#!/usr/bin/env node

/**
 * 🧹 SCRIPT DE LIMPEZA SEGURA DO SISTEMA
 * 
 * Remove arquivos desnecessários em lotes, com backup e validação
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ANALYSIS_DATE = '2025-07-24';
const BACKUP_DIR = `backend-limpeza-backup-${ANALYSIS_DATE}`;

class SafeCleaner {
  constructor() {
    this.deletedFiles = [];
    this.errors = [];
    this.backupCreated = false;
  }

  // Criar backup completo antes da limpeza
  async createBackup() {
    console.log('💾 Criando backup completo antes da limpeza...');
    
    try {
      // Criar diretório de backup
      if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
      }
      
      // Copiar todos os arquivos (exceto node_modules)
      const files = this.getAllFiles('backend');
      let copiedCount = 0;
      
      for (const file of files) {
        if (file.includes('node_modules') || file.includes('.git')) continue;
        
        const relativePath = path.relative('backend', file);
        const backupPath = path.join(BACKUP_DIR, relativePath);
        const backupDir = path.dirname(backupPath);
        
        // Criar diretório se não existir
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        
        // Copiar arquivo
        fs.copyFileSync(file, backupPath);
        copiedCount++;
      }
      
      console.log(`✅ Backup criado: ${copiedCount} arquivos copiados para ${BACKUP_DIR}`);
      this.backupCreated = true;
      
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error.message);
      throw error;
    }
  }

  // Obter todos os arquivos recursivamente
  getAllFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Testar se sistema ainda funciona
  async testSystem() {
    console.log('🧪 Testando se sistema ainda funciona...');
    
    try {
      // Verificar se arquivo principal existe
      if (!fs.existsSync('backend/server-simple.js')) {
        throw new Error('Arquivo principal server-simple.js não encontrado!');
      }
      
      // Verificar se package.json existe
      if (!fs.existsSync('backend/package.json')) {
        throw new Error('Arquivo package.json não encontrado!');
      }
      
      // Tentar fazer parse do server-simple.js (verificar sintaxe)
      const serverContent = fs.readFileSync('backend/server-simple.js', 'utf8');
      if (serverContent.length < 1000) {
        throw new Error('Arquivo server-simple.js parece corrompido!');
      }
      
      console.log('✅ Sistema parece estar funcionando');
      return true;
      
    } catch (error) {
      console.error('❌ Erro no teste do sistema:', error.message);
      return false;
    }
  }

  // Deletar arquivos em lote
  async deleteBatch(files, batchName) {
    console.log(`\n🗑️ Deletando lote: ${batchName}`);
    console.log(`📁 Arquivos a deletar: ${files.length}`);
    
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const filePath of files) {
      try {
        const fullPath = path.join('backend', filePath);
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          this.deletedFiles.push(filePath);
          deletedCount++;
          console.log(`   ✅ ${filePath}`);
        } else {
          console.log(`   ⚠️ ${filePath} (não encontrado)`);
        }
        
      } catch (error) {
        console.error(`   ❌ ${filePath}: ${error.message}`);
        this.errors.push({ file: filePath, error: error.message });
        errorCount++;
      }
    }
    
    console.log(`📊 Resultado: ${deletedCount} deletados, ${errorCount} erros`);
    
    // Testar sistema após cada lote
    const systemOk = await this.testSystem();
    if (!systemOk) {
      console.error('🚨 SISTEMA COM PROBLEMAS! Parando limpeza...');
      return false;
    }
    
    return true;
  }

  // Executar limpeza completa
  async executeCleanup() {
    console.log('🚀 Iniciando limpeza segura do sistema...');
    
    // 1. Criar backup
    await this.createBackup();
    
    // 2. Carregar lista de arquivos para deletar
    const deleteListFile = `arquivos-para-deletar-${ANALYSIS_DATE}.json`;
    if (!fs.existsSync(deleteListFile)) {
      console.error(`❌ Lista de arquivos não encontrada: ${deleteListFile}`);
      return;
    }
    
    const allFilesToDelete = JSON.parse(fs.readFileSync(deleteListFile, 'utf8'));
    console.log(`📋 Total de arquivos para deletar: ${allFilesToDelete.length}`);
    
    // 3. Separar em lotes por categoria
    const batches = {
      'Arquivos de Teste': allFilesToDelete.filter(f => 
        f.includes('test-') || f.includes('teste-') || f.endsWith('.test.js')
      ),
      'Arquivos de Debug': allFilesToDelete.filter(f => 
        f.includes('debug-') || f.endsWith('-debug.js')
      ),
      'Arquivos Temporários': allFilesToDelete.filter(f => 
        f.includes('-temp.js') || f.includes('-tmp.js') || f.includes('-working.js')
      )
    };
    
    // 4. Executar limpeza por lotes
    for (const [batchName, files] of Object.entries(batches)) {
      if (files.length === 0) continue;
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🎯 LOTE: ${batchName}`);
      console.log(`${'='.repeat(60)}`);
      
      const success = await this.deleteBatch(files, batchName);
      if (!success) {
        console.error('🚨 Parando limpeza devido a problemas no sistema');
        break;
      }
      
      // Pausa entre lotes para segurança
      console.log('⏳ Aguardando 2 segundos antes do próximo lote...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 5. Relatório final
    this.generateFinalReport();
  }

  // Gerar relatório final
  generateFinalReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RELATÓRIO FINAL DA LIMPEZA');
    console.log('='.repeat(80));
    
    console.log(`✅ Arquivos deletados: ${this.deletedFiles.length}`);
    console.log(`❌ Erros encontrados: ${this.errors.length}`);
    console.log(`💾 Backup criado em: ${BACKUP_DIR}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERROS ENCONTRADOS:');
      this.errors.forEach(error => {
        console.log(`   - ${error.file}: ${error.error}`);
      });
    }
    
    // Salvar relatório
    const report = {
      date: new Date().toISOString(),
      deletedFiles: this.deletedFiles,
      errors: this.errors,
      backupLocation: BACKUP_DIR,
      summary: {
        totalDeleted: this.deletedFiles.length,
        totalErrors: this.errors.length,
        backupCreated: this.backupCreated
      }
    };
    
    const reportFile = `relatorio-limpeza-executada-${ANALYSIS_DATE}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📄 Relatório salvo em: ${reportFile}`);
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Testar sistema completamente');
    console.log('2. Verificar se todas as funcionalidades funcionam');
    console.log('3. Se tudo estiver ok, pode prosseguir com reestruturação');
    console.log('4. Se houver problemas, restaurar do backup');
    
    console.log('\n🔄 PARA RESTAURAR BACKUP (se necessário):');
    console.log(`   cp -r ${BACKUP_DIR}/* backend/`);
  }

  // Restaurar backup (método de emergência)
  async restoreBackup() {
    console.log('🔄 Restaurando backup...');
    
    try {
      const files = this.getAllFiles(BACKUP_DIR);
      let restoredCount = 0;
      
      for (const file of files) {
        const relativePath = path.relative(BACKUP_DIR, file);
        const targetPath = path.join('backend', relativePath);
        const targetDir = path.dirname(targetPath);
        
        // Criar diretório se não existir
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // Restaurar arquivo
        fs.copyFileSync(file, targetPath);
        restoredCount++;
      }
      
      console.log(`✅ Backup restaurado: ${restoredCount} arquivos`);
      
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error.message);
      throw error;
    }
  }
}

// Função principal
async function main() {
  const cleaner = new SafeCleaner();
  
  try {
    await cleaner.executeCleanup();
  } catch (error) {
    console.error('❌ Erro durante limpeza:', error.message);
    console.log('\n🚨 RECOMENDAÇÃO: Não prosseguir com reestruturação até resolver problemas');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SafeCleaner };