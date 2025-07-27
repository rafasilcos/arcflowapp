#!/usr/bin/env node

/**
 * 🧹 SCRIPT DE ANÁLISE PARA LIMPEZA INTELIGENTE
 * 
 * Este script analisa todos os arquivos do backend e categoriza
 * quais podem ser removidos com segurança antes da reestruturação.
 */

const fs = require('fs');
const path = require('path');

// Configurações
const BACKEND_DIR = __dirname;
const ANALYSIS_DATE = new Date().toISOString().split('T')[0];

// Categorias de arquivos
const FILE_CATEGORIES = {
  CRITICAL: 'CRÍTICO - NUNCA DELETAR',
  TEST: 'TESTE - PODE DELETAR',
  DEBUG: 'DEBUG - PODE DELETAR', 
  TEMP: 'TEMPORÁRIO - PODE DELETAR',
  MIGRATION: 'MIGRAÇÃO - MANTER POR ENQUANTO',
  BACKUP: 'BACKUP - ANALISAR',
  CONFIG: 'CONFIGURAÇÃO - ANALISAR',
  UNKNOWN: 'DESCONHECIDO - ANALISAR MANUALMENTE'
};

// Padrões para categorização
const PATTERNS = {
  CRITICAL: [
    'server-simple.js',
    'server-simple-BACKUP-ORIGINAL.js',
    'package.json',
    'package-lock.json',
    '.env',
    '.gitignore',
    'tsconfig.json'
  ],
  TEST: [
    /^test-.*\.js$/,
    /^teste-.*\.js$/,
    /.*-test\.js$/,
    /.*\.test\.js$/,
    /.*\.spec\.js$/
  ],
  DEBUG: [
    /^debug-.*\.js$/,
    /.*-debug\.js$/
  ],
  TEMP: [
    /.*-temp\.js$/,
    /.*-temporary\.js$/,
    /.*-tmp\.js$/,
    /.*-working\.js$/
  ],
  MIGRATION: [
    /^criar-.*\.js$/,
    /^migrar-.*\.js$/,
    /^executar-.*\.js$/,
    /^adicionar-.*\.js$/,
    /migrations\//
  ],
  BACKUP: [
    /.*-backup.*\.js$/,
    /.*backup.*\.js$/,
    /^server-.*\.js$/ // Exceto os críticos
  ],
  CONFIG: [
    /^corrigir-.*\.js$/,
    /^verificar-.*\.js$/,
    /^check-.*\.js$/,
    /^investigar-.*\.js$/,
    /^testar-.*\.js$/
  ]
};

class FileAnalyzer {
  constructor() {
    this.files = [];
    this.analysis = {
      total: 0,
      categories: {},
      recommendations: {
        canDelete: [],
        shouldKeep: [],
        needsReview: []
      },
      stats: {
        totalSize: 0,
        potentialSavings: 0
      }
    };
  }

  // Escanear todos os arquivos
  scanFiles(dir = BACKEND_DIR, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeFilePath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);
      
      // Pular node_modules e .git
      if (item === 'node_modules' || item === '.git' || item.startsWith('.')) {
        continue;
      }
      
      if (stats.isDirectory()) {
        this.scanFiles(fullPath, relativeFilePath);
      } else if (item.endsWith('.js') || item.endsWith('.json') || item.endsWith('.md')) {
        this.files.push({
          name: item,
          path: relativeFilePath,
          fullPath: fullPath,
          size: stats.size,
          modified: stats.mtime,
          category: this.categorizeFile(item, relativeFilePath)
        });
      }
    }
  }

  // Categorizar arquivo baseado em padrões
  categorizeFile(fileName, filePath) {
    // Verificar arquivos críticos primeiro
    if (PATTERNS.CRITICAL.includes(fileName)) {
      return FILE_CATEGORIES.CRITICAL;
    }
    
    // Verificar outros padrões
    for (const [category, patterns] of Object.entries(PATTERNS)) {
      if (category === 'CRITICAL') continue;
      
      for (const pattern of patterns) {
        if (typeof pattern === 'string') {
          if (fileName === pattern || filePath.includes(pattern)) {
            return FILE_CATEGORIES[category];
          }
        } else if (pattern instanceof RegExp) {
          if (pattern.test(fileName) || pattern.test(filePath)) {
            return FILE_CATEGORIES[category];
          }
        }
      }
    }
    
    return FILE_CATEGORIES.UNKNOWN;
  }

  // Verificar dependências (importações)
  checkDependencies(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const imports = [];
      
      // Procurar por require() e import
      const requireMatches = content.match(/require\(['"`]([^'"`]+)['"`]\)/g);
      const importMatches = content.match(/import.*from\s+['"`]([^'"`]+)['"`]/g);
      
      if (requireMatches) {
        requireMatches.forEach(match => {
          const moduleName = match.match(/['"`]([^'"`]+)['"`]/)[1];
          if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
            imports.push(moduleName);
          }
        });
      }
      
      if (importMatches) {
        importMatches.forEach(match => {
          const moduleName = match.match(/['"`]([^'"`]+)['"`]/)[1];
          if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
            imports.push(moduleName);
          }
        });
      }
      
      return imports;
    } catch (error) {
      return [];
    }
  }

  // Analisar arquivos
  analyze() {
    console.log('🔍 Iniciando análise de arquivos...');
    
    this.scanFiles();
    this.analysis.total = this.files.length;
    
    // Categorizar arquivos
    for (const file of this.files) {
      if (!this.analysis.categories[file.category]) {
        this.analysis.categories[file.category] = [];
      }
      this.analysis.categories[file.category].push(file);
      this.analysis.stats.totalSize += file.size;
    }
    
    // Gerar recomendações
    this.generateRecommendations();
    
    console.log('✅ Análise concluída!');
  }

  // Gerar recomendações
  generateRecommendations() {
    for (const [category, files] of Object.entries(this.analysis.categories)) {
      switch (category) {
        case FILE_CATEGORIES.TEST:
        case FILE_CATEGORIES.DEBUG:
        case FILE_CATEGORIES.TEMP:
          this.analysis.recommendations.canDelete.push(...files);
          this.analysis.stats.potentialSavings += files.reduce((sum, f) => sum + f.size, 0);
          break;
          
        case FILE_CATEGORIES.CRITICAL:
        case FILE_CATEGORIES.MIGRATION:
          this.analysis.recommendations.shouldKeep.push(...files);
          break;
          
        default:
          this.analysis.recommendations.needsReview.push(...files);
      }
    }
  }

  // Gerar relatório
  generateReport() {
    const report = {
      date: ANALYSIS_DATE,
      summary: {
        totalFiles: this.analysis.total,
        totalSize: this.formatBytes(this.analysis.stats.totalSize),
        potentialSavings: this.formatBytes(this.analysis.stats.potentialSavings),
        savingsPercentage: Math.round((this.analysis.stats.potentialSavings / this.analysis.stats.totalSize) * 100)
      },
      categories: {},
      recommendations: {
        canDelete: this.analysis.recommendations.canDelete.length,
        shouldKeep: this.analysis.recommendations.shouldKeep.length,
        needsReview: this.analysis.recommendations.needsReview.length
      }
    };

    // Detalhar categorias
    for (const [category, files] of Object.entries(this.analysis.categories)) {
      report.categories[category] = {
        count: files.length,
        size: this.formatBytes(files.reduce((sum, f) => sum + f.size, 0)),
        files: files.map(f => ({
          name: f.name,
          path: f.path,
          size: this.formatBytes(f.size),
          modified: f.modified.toISOString().split('T')[0]
        }))
      };
    }

    return report;
  }

  // Formatar bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Exibir relatório no console
  displayReport() {
    const report = this.generateReport();
    
    console.log('\n' + '='.repeat(80));
    console.log('🧹 RELATÓRIO DE ANÁLISE PARA LIMPEZA DO SISTEMA');
    console.log('='.repeat(80));
    
    console.log(`\n📊 RESUMO GERAL:`);
    console.log(`   Total de arquivos: ${report.summary.totalFiles}`);
    console.log(`   Tamanho total: ${report.summary.totalSize}`);
    console.log(`   Economia potencial: ${report.summary.potentialSavings} (${report.summary.savingsPercentage}%)`);
    
    console.log(`\n🎯 RECOMENDAÇÕES:`);
    console.log(`   ✅ Podem ser deletados: ${report.recommendations.canDelete} arquivos`);
    console.log(`   🔒 Devem ser mantidos: ${report.recommendations.shouldKeep} arquivos`);
    console.log(`   ⚠️  Precisam de revisão: ${report.recommendations.needsReview} arquivos`);
    
    console.log(`\n📋 DETALHAMENTO POR CATEGORIA:`);
    for (const [category, data] of Object.entries(report.categories)) {
      console.log(`\n${this.getCategoryIcon(category)} ${category}:`);
      console.log(`   Arquivos: ${data.count} | Tamanho: ${data.size}`);
      
      if (data.files.length <= 10) {
        data.files.forEach(file => {
          console.log(`   - ${file.name} (${file.size})`);
        });
      } else {
        data.files.slice(0, 5).forEach(file => {
          console.log(`   - ${file.name} (${file.size})`);
        });
        console.log(`   ... e mais ${data.files.length - 5} arquivos`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📄 Relatório detalhado salvo em: relatorio-limpeza-sistema.json');
    console.log('='.repeat(80));
  }

  // Ícone da categoria
  getCategoryIcon(category) {
    const icons = {
      [FILE_CATEGORIES.CRITICAL]: '🚨',
      [FILE_CATEGORIES.TEST]: '🧪',
      [FILE_CATEGORIES.DEBUG]: '🐛',
      [FILE_CATEGORIES.TEMP]: '⏳',
      [FILE_CATEGORIES.MIGRATION]: '🔄',
      [FILE_CATEGORIES.BACKUP]: '💾',
      [FILE_CATEGORIES.CONFIG]: '⚙️',
      [FILE_CATEGORIES.UNKNOWN]: '❓'
    };
    return icons[category] || '📄';
  }

  // Salvar relatório em arquivo
  saveReport() {
    const report = this.generateReport();
    const fileName = `relatorio-limpeza-sistema-${ANALYSIS_DATE}.json`;
    
    fs.writeFileSync(fileName, JSON.stringify(report, null, 2));
    console.log(`📄 Relatório salvo em: ${fileName}`);
    
    // Salvar também lista de arquivos para deletar
    const deleteList = this.analysis.recommendations.canDelete.map(f => f.path);
    fs.writeFileSync(`arquivos-para-deletar-${ANALYSIS_DATE}.json`, JSON.stringify(deleteList, null, 2));
    console.log(`🗑️ Lista de arquivos para deletar salva em: arquivos-para-deletar-${ANALYSIS_DATE}.json`);
  }
}

// Executar análise
async function main() {
  console.log('🚀 Iniciando análise inteligente de arquivos para limpeza...');
  console.log(`📁 Diretório: ${BACKEND_DIR}`);
  console.log(`📅 Data: ${ANALYSIS_DATE}`);
  
  const analyzer = new FileAnalyzer();
  analyzer.analyze();
  analyzer.displayReport();
  analyzer.saveReport();
  
  console.log('\n🎯 PRÓXIMOS PASSOS:');
  console.log('1. Revisar o relatório gerado');
  console.log('2. Confirmar arquivos que podem ser deletados');
  console.log('3. Executar limpeza gradual com backup');
  console.log('4. Testar sistema após cada lote de exclusão');
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FileAnalyzer };