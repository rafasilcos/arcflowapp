#!/usr/bin/env node

/**
 * Script Principal para Execução de Testes de Integração
 * Tarefa 12: Desenvolver testes de integração end-to-end
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configurações
const CONFIG = {
  testDir: path.join(__dirname, 'tests/integration'),
  coverageDir: path.join(__dirname, 'coverage/integration'),
  reportDir: path.join(__dirname, 'test-reports'),
  jestConfig: path.join(__dirname, 'tests/jest.integration.config.js')
};

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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDirectories() {
  const dirs = [CONFIG.coverageDir, CONFIG.reportDir];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function checkPrerequisites() {
  log('\n🔍 Verificando pré-requisitos...', 'cyan');
  
  try {
    // Verificar se Jest está instalado
    execSync('npx jest --version', { stdio: 'pipe' });
    log('✅ Jest encontrado', 'green');
  } catch (error) {
    log('❌ Jest não encontrado. Execute: npm install --save-dev jest', 'red');
    process.exit(1);
  }
  
  // Verificar se arquivo de configuração existe
  if (!fs.existsSync(CONFIG.jestConfig)) {
    log('❌ Arquivo de configuração Jest não encontrado', 'red');
    process.exit(1);
  }
  log('✅ Configuração Jest encontrada', 'green');
  
  // Verificar se diretório de testes existe
  if (!fs.existsSync(CONFIG.testDir)) {
    log('❌ Diretório de testes não encontrado', 'red');
    process.exit(1);
  }
  log('✅ Diretório de testes encontrado', 'green');
}

function runTests(options = {}) {
  log('\n🚀 Iniciando testes de integração...', 'bright');
  
  const jestArgs = [
    `--config=${CONFIG.jestConfig}`,
    '--verbose',
    '--detectOpenHandles',
    '--forceExit'
  ];
  
  if (options.coverage) {
    jestArgs.push('--coverage');
  }
  
  if (options.watch) {
    jestArgs.push('--watch');
  }
  
  if (options.testNamePattern) {
    jestArgs.push(`--testNamePattern="${options.testNamePattern}"`);
  }
  
  if (options.testPathPattern) {
    jestArgs.push(`--testPathPattern="${options.testPathPattern}"`);
  }
  
  const command = `npx jest ${jestArgs.join(' ')}`;
  
  try {
    log(`\n📋 Executando: ${command}`, 'blue');
    execSync(command, { 
      stdio: 'inherit',
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        FORCE_COLOR: '1'
      }
    });
    
    log('\n🎉 Todos os testes passaram!', 'green');
    return true;
    
  } catch (error) {
    log('\n❌ Alguns testes falharam', 'red');
    return false;
  }
}

function generateReport() {
  log('\n📊 Gerando relatório detalhado...', 'cyan');
  
  try {
    const reportPath = path.join(CONFIG.reportDir, 'integration-summary.md');
    const timestamp = new Date().toISOString();
    
    const report = `# Relatório de Testes de Integração

**Data:** ${timestamp}
**Projeto:** ArcFlow - Integração Briefing-Orçamento

## Resumo dos Testes

### Testes Executados

1. **budget-integration.test.js**
   - Fluxo completo: Briefing padrão → Análise → Orçamento
   - Validação de cálculos baseados em área e complexidade
   - Verificação de disciplinas por tipologia

2. **custom-briefing.test.js**
   - Briefings personalizados com diferentes estruturas
   - Parser adaptativo para campos não padronizados
   - Mapeamento de variações de nomenclatura

3. **end-to-end-complete.test.js**
   - Cenários completos de diferentes tipologias
   - Testes de fallback para dados insuficientes
   - Recuperação de erros de análise

4. **concurrency.test.js**
   - Múltiplos usuários simultâneos
   - Isolamento entre escritórios
   - Condições de corrida (race conditions)

5. **error-recovery.test.js**
   - Recuperação de falhas de processamento
   - Timeouts e retry logic
   - Validação de dados corrompidos

6. **budget-performance.test.js**
   - Testes de carga com múltiplos briefings
   - Performance com diferentes complexidades
   - Stress testing

## Cobertura de Código

Veja o relatório detalhado em: \`coverage/integration/lcov-report/index.html\`

## Próximos Passos

- [ ] Executar testes em ambiente de staging
- [ ] Configurar CI/CD para execução automática
- [ ] Implementar testes de regressão
- [ ] Adicionar métricas de performance

---
*Relatório gerado automaticamente*
`;

    fs.writeFileSync(reportPath, report);
    log(`✅ Relatório salvo em: ${reportPath}`, 'green');
    
  } catch (error) {
    log(`⚠️  Erro ao gerar relatório: ${error.message}`, 'yellow');
  }
}

function showHelp() {
  log('\n📖 Uso do script de testes de integração:', 'bright');
  log('\nComandos disponíveis:');
  log('  node run-integration-tests.js [opções]', 'cyan');
  log('\nOpções:');
  log('  --coverage          Gerar relatório de cobertura', 'blue');
  log('  --watch            Executar em modo watch', 'blue');
  log('  --test-name=NOME   Executar apenas testes com nome específico', 'blue');
  log('  --test-path=PATH   Executar apenas testes em caminho específico', 'blue');
  log('  --help             Mostrar esta ajuda', 'blue');
  log('\nExemplos:');
  log('  node run-integration-tests.js --coverage', 'green');
  log('  node run-integration-tests.js --test-name="Casa Residencial"', 'green');
  log('  node run-integration-tests.js --test-path="budget-integration"', 'green');
}

function main() {
  const args = process.argv.slice(2);
  
  // Verificar se é pedido de ajuda
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  // Parsear argumentos
  const options = {
    coverage: args.includes('--coverage'),
    watch: args.includes('--watch'),
    testNamePattern: args.find(arg => arg.startsWith('--test-name='))?.split('=')[1],
    testPathPattern: args.find(arg => arg.startsWith('--test-path='))?.split('=')[1]
  };
  
  log('🧪 ArcFlow - Testes de Integração End-to-End', 'bright');
  log('=' .repeat(50), 'blue');
  
  // Executar verificações e testes
  createDirectories();
  checkPrerequisites();
  
  const success = runTests(options);
  
  if (success && options.coverage) {
    generateReport();
  }
  
  if (success) {
    log('\n✨ Execução concluída com sucesso!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Execução falhou. Verifique os logs acima.', 'red');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { runTests, generateReport };