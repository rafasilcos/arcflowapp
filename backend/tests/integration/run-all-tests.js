#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Configuração dos testes
const testConfig = {
  timeout: 60000, // 60 segundos por teste
  maxWorkers: 4,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'tests/reports/coverage',
  testResultsProcessor: 'jest-html-reporter'
};

// Lista de arquivos de teste na ordem de execução
const testFiles = [
  'tests/integration/budget-integration.test.js',
  'tests/integration/custom-briefing.test.js',
  'tests/performance/budget-performance.test.js',
  'tests/integration/concurrency.test.js',
  'tests/integration/error-recovery.test.js',
  'tests/integration/end-to-end-complete.test.js'
];

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(colorize(title, 'cyan'));
  console.log('='.repeat(60));
}

function logStep(step) {
  console.log(colorize(`🔸 ${step}`, 'blue'));
}

function logSuccess(message) {
  console.log(colorize(`✅ ${message}`, 'green'));
}

function logError(message) {
  console.log(colorize(`❌ ${message}`, 'red'));
}

function logWarning(message) {
  console.log(colorize(`⚠️  ${message}`, 'yellow'));
}

async function checkPrerequisites() {
  logSection('Verificando Pré-requisitos');
  
  const checks = [
    {
      name: 'Node.js',
      command: 'node',
      args: ['--version'],
      minVersion: '18.0.0'
    },
    {
      name: 'Jest',
      command: 'npx',
      args: ['jest', '--version']
    },
    {
      name: 'Redis',
      env: 'REDIS_URL',
      default: 'redis://localhost:6379/1'
    },
    {
      name: 'Database',
      env: 'DATABASE_URL',
      default: 'postgresql://test:test@localhost:5432/arcflow_test'
    }
  ];
  
  for (const check of checks) {
    logStep(`Verificando ${check.name}...`);
    
    if (check.command) {
      try {
        const result = await runCommand(check.command, check.args, { timeout: 5000 });
        logSuccess(`${check.name} disponível: ${result.stdout.trim()}`);
      } catch (error) {
        logError(`${check.name} não encontrado: ${error.message}`);
        return false;
      }
    } else if (check.env) {
      const value = process.env[check.env] || check.default;
      if (value) {
        logSuccess(`${check.name}: ${value}`);
        process.env[check.env] = value;
      } else {
        logError(`Variável de ambiente ${check.env} não definida`);
        return false;
      }
    }
  }
  
  return true;
}

async function setupTestEnvironment() {
  logSection('Configurando Ambiente de Teste');
  
  // Criar diretórios necessários
  const directories = [
    'tests/reports',
    'tests/reports/coverage',
    'tests/temp',
    'logs'
  ];
  
  for (const dir of directories) {
    logStep(`Criando diretório ${dir}...`);
    try {
      await fs.mkdir(dir, { recursive: true });
      logSuccess(`Diretório ${dir} criado`);
    } catch (error) {
      logWarning(`Diretório ${dir} já existe ou erro: ${error.message}`);
    }
  }
  
  // Configurar variáveis de ambiente para teste
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error';
  
  logSuccess('Ambiente de teste configurado');
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.silent ? 'pipe' : 'inherit',
      shell: true,
      ...options
    });
    
    let stdout = '';
    let stderr = '';
    
    if (child.stdout) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }
    
    if (child.stderr) {
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    const timeout = options.timeout ? setTimeout(() => {
      child.kill();
      reject(new Error(`Command timeout after ${options.timeout}ms`));
    }, options.timeout) : null;
    
    child.on('close', (code) => {
      if (timeout) clearTimeout(timeout);
      
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
    
    child.on('error', (error) => {
      if (timeout) clearTimeout(timeout);
      reject(error);
    });
  });
}

async function runTestSuite(testFile, index, total) {
  const suiteName = path.basename(testFile, '.test.js');
  
  logSection(`Executando Teste ${index + 1}/${total}: ${suiteName}`);
  
  const startTime = Date.now();
  
  try {
    const jestArgs = [
      'jest',
      testFile,
      '--verbose',
      '--no-cache',
      '--forceExit',
      '--detectOpenHandles',
      `--testTimeout=${testConfig.timeout}`,
      '--setupFilesAfterEnv=tests/setup/setupTests.js'
    ];
    
    if (testConfig.collectCoverage) {
      jestArgs.push('--coverage', '--coverageDirectory=tests/reports/coverage');
    }
    
    logStep(`Executando: npx ${jestArgs.join(' ')}`);
    
    const result = await runCommand('npx', jestArgs, {
      timeout: testConfig.timeout * 2 // Timeout maior para o processo
    });
    
    const duration = Date.now() - startTime;
    logSuccess(`${suiteName} concluído em ${duration}ms`);
    
    return {
      name: suiteName,
      file: testFile,
      success: true,
      duration,
      output: result.stdout
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`${suiteName} falhou após ${duration}ms: ${error.message}`);
    
    return {
      name: suiteName,
      file: testFile,
      success: false,
      duration,
      error: error.message
    };
  }
}

async function generateReport(results) {
  logSection('Gerando Relatório de Testes');
  
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const failedTests = totalTests - successfulTests;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      successful: successfulTests,
      failed: failedTests,
      successRate: (successfulTests / totalTests) * 100,
      totalDuration,
      averageDuration: totalDuration / totalTests
    },
    results,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado',
        REDIS_URL: process.env.REDIS_URL ? 'Configurado' : 'Não configurado'
      }
    }
  };
  
  // Salvar relatório JSON
  const reportPath = path.join('tests/reports', `integration-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  logSuccess(`Relatório JSON salvo em: ${reportPath}`);
  
  // Gerar relatório HTML simples
  const htmlReport = generateHtmlReport(report);
  const htmlPath = path.join('tests/reports', `integration-report-${Date.now()}.html`);
  await fs.writeFile(htmlPath, htmlReport);
  logSuccess(`Relatório HTML salvo em: ${htmlPath}`);
  
  // Exibir resumo no console
  console.log('\n' + '='.repeat(60));
  console.log(colorize('RESUMO DOS TESTES', 'bright'));
  console.log('='.repeat(60));
  console.log(`📊 Total de testes: ${totalTests}`);
  console.log(colorize(`✅ Sucessos: ${successfulTests}`, 'green'));
  console.log(colorize(`❌ Falhas: ${failedTests}`, failedTests > 0 ? 'red' : 'green'));
  console.log(`📈 Taxa de sucesso: ${report.summary.successRate.toFixed(1)}%`);
  console.log(`⏱️  Tempo total: ${(totalDuration / 1000).toFixed(1)}s`);
  console.log(`⏱️  Tempo médio: ${(report.summary.averageDuration / 1000).toFixed(1)}s`);
  
  if (failedTests > 0) {
    console.log('\n' + colorize('TESTES FALHARAM:', 'red'));
    results.filter(r => !r.success).forEach(result => {
      console.log(`  • ${result.name}: ${result.error}`);
    });
  }
  
  return report;
}

function generateHtmlReport(report) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Testes de Integração - ArcFlow</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .metric-label { color: #666; margin-top: 5px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .test-results { margin-top: 30px; }
        .test-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff; }
        .test-item.success { border-left-color: #28a745; }
        .test-item.error { border-left-color: #dc3545; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-duration { color: #666; font-size: 0.9em; }
        .test-error { color: #dc3545; margin-top: 10px; font-family: monospace; background: #f8d7da; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Relatório de Testes de Integração</h1>
            <p>Sistema Briefing-Orçamento - ArcFlow</p>
            <p><small>Gerado em: ${new Date(report.timestamp).toLocaleString('pt-BR')}</small></p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${report.summary.total}</div>
                <div class="metric-label">Total de Testes</div>
            </div>
            <div class="metric">
                <div class="metric-value success">${report.summary.successful}</div>
                <div class="metric-label">Sucessos</div>
            </div>
            <div class="metric">
                <div class="metric-value ${report.summary.failed > 0 ? 'error' : 'success'}">${report.summary.failed}</div>
                <div class="metric-label">Falhas</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.successRate.toFixed(1)}%</div>
                <div class="metric-label">Taxa de Sucesso</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(report.summary.totalDuration / 1000).toFixed(1)}s</div>
                <div class="metric-label">Tempo Total</div>
            </div>
        </div>
        
        <div class="test-results">
            <h2>Resultados Detalhados</h2>
            ${report.results.map(result => `
                <div class="test-item ${result.success ? 'success' : 'error'}">
                    <div class="test-name">${result.name}</div>
                    <div class="test-duration">Duração: ${(result.duration / 1000).toFixed(1)}s</div>
                    ${result.error ? `<div class="test-error">Erro: ${result.error}</div>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <h3>Ambiente de Teste</h3>
            <ul>
                <li><strong>Node.js:</strong> ${report.environment.nodeVersion}</li>
                <li><strong>Plataforma:</strong> ${report.environment.platform} (${report.environment.arch})</li>
                <li><strong>Memória:</strong> ${Math.round(report.environment.memory.heapUsed / 1024 / 1024)}MB</li>
                <li><strong>Database:</strong> ${report.environment.env.DATABASE_URL}</li>
                <li><strong>Redis:</strong> ${report.environment.env.REDIS_URL}</li>
            </ul>
        </div>
    </div>
</body>
</html>
  `;
}

async function cleanup() {
  logSection('Limpeza Final');
  
  try {
    // Executar limpeza global
    logStep('Executando limpeza global...');
    
    // Limpar arquivos temporários
    try {
      await fs.rmdir('tests/temp', { recursive: true });
      logSuccess('Arquivos temporários removidos');
    } catch (error) {
      logWarning('Nenhum arquivo temporário para remover');
    }
    
    logSuccess('Limpeza concluída');
  } catch (error) {
    logWarning(`Erro na limpeza: ${error.message}`);
  }
}

async function main() {
  console.log(colorize('🧪 EXECUTANDO TESTES DE INTEGRAÇÃO - ARCFLOW', 'bright'));
  console.log(colorize('Sistema Briefing-Orçamento', 'cyan'));
  console.log(`Iniciado em: ${new Date().toLocaleString('pt-BR')}\n`);
  
  const startTime = Date.now();
  let results = [];
  
  try {
    // Verificar pré-requisitos
    const prerequisitesOk = await checkPrerequisites();
    if (!prerequisitesOk) {
      logError('Pré-requisitos não atendidos. Abortando execução.');
      process.exit(1);
    }
    
    // Configurar ambiente
    await setupTestEnvironment();
    
    // Executar testes
    logSection('Executando Suítes de Teste');
    
    for (let i = 0; i < testFiles.length; i++) {
      const testFile = testFiles[i];
      const result = await runTestSuite(testFile, i, testFiles.length);
      results.push(result);
      
      // Pequena pausa entre testes para evitar sobrecarga
      if (i < testFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Gerar relatório
    const report = await generateReport(results);
    
    // Limpeza
    await cleanup();
    
    const totalTime = Date.now() - startTime;
    
    console.log('\n' + '='.repeat(60));
    console.log(colorize('EXECUÇÃO CONCLUÍDA', 'bright'));
    console.log('='.repeat(60));
    console.log(`⏱️  Tempo total de execução: ${(totalTime / 1000).toFixed(1)}s`);
    console.log(`📊 Taxa de sucesso geral: ${report.summary.successRate.toFixed(1)}%`);
    
    // Exit code baseado no resultado
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    
    if (exitCode === 0) {
      console.log(colorize('🎉 TODOS OS TESTES PASSARAM!', 'green'));
    } else {
      console.log(colorize(`💥 ${report.summary.failed} TESTE(S) FALHARAM`, 'red'));
    }
    
    process.exit(exitCode);
    
  } catch (error) {
    logError(`Erro fatal na execução dos testes: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('Erro não tratado:', error);
    process.exit(1);
  });
}

module.exports = {
  runTestSuite,
  generateReport,
  checkPrerequisites,
  setupTestEnvironment
};