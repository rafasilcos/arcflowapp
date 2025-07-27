#!/usr/bin/env node

/**
 * 🗂️ SCRIPT DE ORGANIZAÇÃO AUTOMÁTICA
 * 
 * Organiza todos os arquivos espalhados (imagens, documentos, scripts)
 * seguindo uma estrutura profissional e lógica.
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = `organizacao-backup-${new Date().toISOString().split('T')[0]}`;

class FileOrganizer {
  constructor() {
    this.movedFiles = [];
    this.errors = [];
    this.createdDirs = [];
    
    // Mapeamento de arquivos para destinos
    this.fileMapping = {
      // IMAGENS - Briefings
      briefings_images: {
        pattern: /^briefing-.*\.png$/,
        destination: 'assets/images/briefings/',
        description: 'Screenshots de briefings'
      },
      
      // IMAGENS - Debug
      debug_images: {
        pattern: /^debug-.*\.png$/,
        destination: 'assets/images/debug/',
        description: 'Screenshots de debug'
      },
      
      // IMAGENS - Erros
      error_images: {
        pattern: /^erro-.*\.png$/,
        destination: 'assets/images/errors/',
        description: 'Screenshots de erros'
      },
      
      // IMAGENS - Navegação
      navigation_images: {
        pattern: /^(navegacao|selecao|perguntas)-.*\.png$/,
        destination: 'assets/images/navigation/',
        description: 'Screenshots de navegação'
      },
      
      // DOCUMENTOS - Análises
      analysis_docs: {
        pattern: /^ANALISE_.*\.md$/,
        destination: 'docs/analysis/readme/',
        description: 'Análises técnicas'
      },
      
      // DOCUMENTOS - Correções e Relatórios
      reports_docs: {
        pattern: /^(CORRECAO|RESUMO|RELATORIO)_.*\.md$/,
        destination: 'docs/reports/readme/',
        description: 'Correções e relatórios'
      },
      
      // DOCUMENTOS - Manuais
      manuals_docs: {
        pattern: /^(MANUAL|NOVA|MAPEAMENTO)_.*\.md$/,
        destination: 'docs/manuals/readme/',
        description: 'Manuais e documentação'
      },
      
      // SCRIPTS - Briefings
      briefing_scripts: {
        pattern: /^(sistema-briefing|executar-briefings|sistema-preenchimento).*\.js$/,
        destination: 'scripts/briefings/',
        description: 'Scripts de briefings'
      },
      
      // SCRIPTS - Debug e Teste
      debug_scripts: {
        pattern: /^(debug|teste)-.*\.js$/,
        destination: 'scripts/debug/',
        description: 'Scripts de debug e teste'
      },
      
      // SCRIPTS - Sistema
      system_scripts: {
        pattern: /^(sistema|configurar|analise)-.*\.js$/,
        destination: 'scripts/utils/',
        description: 'Scripts do sistema'
      },
      
      // CONFIGURAÇÕES - JSON
      config_json: {
        pattern: /^.*-config\.json$|^arquivos-para-deletar.*\.json$|^relatorio-.*\.json$/,
        destination: 'assets/configs/',
        description: 'Arquivos de configuração JSON'
      },
      
      // CONFIGURAÇÕES - HTML
      config_html: {
        pattern: /^interface-.*\.html$/,
        destination: 'assets/configs/',
        description: 'Interfaces de configuração'
      },
      
      // SCRIPTS - Deploy
      deploy_scripts: {
        pattern: /\.(bat|ps1)$/,
        destination: 'scripts/deployment/',
        description: 'Scripts de deploy'
      },
      
      // ARQUIVOS ESPECIAIS
      special_files: {
        pattern: /^(start-|test-|testar-).*\.(js|md)$/,
        destination: 'scripts/utils/',
        description: 'Arquivos especiais'
      }
    };
  }

  // Criar backup completo
  async createBackup() {
    console.log('💾 Criando backup antes da organização...');
    
    try {
      if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
      }
      
      // Copiar apenas arquivos da raiz (não pastas)
      const rootFiles = fs.readdirSync('.').filter(item => {
        const stats = fs.statSync(item);
        return stats.isFile();
      });
      
      let copiedCount = 0;
      for (const file of rootFiles) {
        fs.copyFileSync(file, path.join(BACKUP_DIR, file));
        copiedCount++;
      }
      
      console.log(`✅ Backup criado: ${copiedCount} arquivos em ${BACKUP_DIR}`);
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error.message);
      return false;
    }
  }

  // Criar estrutura de diretórios
  createDirectoryStructure() {
    console.log('📁 Criando estrutura de diretórios...');
    
    const directories = [
      'docs/api/readme',
      'docs/auth/readme/screenshots',
      'docs/briefings/readme/screenshots',
      'docs/orcamentos/readme/screenshots',
      'docs/clientes/readme',
      'docs/deployment/readme/scripts',
      'docs/analysis/readme/data',
      'docs/reports/readme',
      'docs/manuals/readme',
      'assets/images/briefings',
      'assets/images/debug',
      'assets/images/errors',
      'assets/images/navigation',
      'assets/images/ui',
      'assets/configs',
      'scripts/briefings',
      'scripts/debug',
      'scripts/deployment',
      'scripts/utils',
      'temp/logs',
      'temp/backups',
      'temp/reports'
    ];
    
    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.createdDirs.push(dir);
        console.log(`   📂 ${dir}`);
      }
    }
    
    console.log(`✅ ${this.createdDirs.length} diretórios criados`);
  }

  // Categorizar arquivo
  categorizeFile(fileName) {
    for (const [category, config] of Object.entries(this.fileMapping)) {
      if (config.pattern.test(fileName)) {
        return {
          category,
          destination: config.destination,
          description: config.description
        };
      }
    }
    return null;
  }

  // Detectar dependências em arquivo JS
  detectDependencies(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dependencies = [];
      
      // Procurar por require() relativos
      const requireMatches = content.match(/require\(['"`]\.\/[^'"`]+['"`]\)/g);
      if (requireMatches) {
        requireMatches.forEach(match => {
          const dep = match.match(/['"`]([^'"`]+)['"`]/)[1];
          dependencies.push(dep);
        });
      }
      
      // Procurar por import relativos
      const importMatches = content.match(/import.*from\s+['"`]\.\/[^'"`]+['"`]/g);
      if (importMatches) {
        importMatches.forEach(match => {
          const dep = match.match(/['"`]([^'"`]+)['"`]/)[1];
          dependencies.push(dep);
        });
      }
      
      return dependencies;
    } catch (error) {
      return [];
    }
  }

  // Ajustar caminhos em arquivo
  fixPathsInFile(filePath, oldPaths, newPaths) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      for (let i = 0; i < oldPaths.length; i++) {
        const oldPath = oldPaths[i];
        const newPath = newPaths[i];
        
        // Ajustar require()
        const requireRegex = new RegExp(`require\\(['"\`]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]\\)`, 'g');
        if (requireRegex.test(content)) {
          content = content.replace(requireRegex, `require('${newPath}')`);
          modified = true;
          console.log(`     🔧 Ajustado: ${oldPath} → ${newPath}`);
        }
        
        // Ajustar import
        const importRegex = new RegExp(`from\\s+['"\`]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g');
        if (importRegex.test(content)) {
          content = content.replace(importRegex, `from '${newPath}'`);
          modified = true;
          console.log(`     🔧 Ajustado: ${oldPath} → ${newPath}`);
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`     ❌ Erro ao ajustar caminhos: ${error.message}`);
      return false;
    }
  }

  // Mover arquivo com correção de dependências
  moveFile(fileName, destination) {
    try {
      const sourcePath = fileName;
      const destPath = path.join(destination, fileName);
      
      // Verificar se arquivo existe
      if (!fs.existsSync(sourcePath)) {
        console.log(`   ⚠️ ${fileName} (não encontrado)`);
        return false;
      }
      
      // Verificar se destino existe
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      // Se for arquivo JS, verificar dependências
      if (fileName.endsWith('.js')) {
        const dependencies = this.detectDependencies(sourcePath);
        if (dependencies.length > 0) {
          console.log(`     🔍 Dependências encontradas: ${dependencies.join(', ')}`);
          
          // Calcular novos caminhos relativos
          const newPaths = dependencies.map(dep => {
            // Se a dependência ainda está na raiz, calcular caminho relativo
            const depFile = dep.replace('./', '');
            const levelsUp = destination.split('/').length;
            const relativePath = '../'.repeat(levelsUp) + depFile;
            return relativePath;
          });
          
          // Mover arquivo primeiro
          fs.renameSync(sourcePath, destPath);
          
          // Ajustar caminhos no arquivo movido
          this.fixPathsInFile(destPath, dependencies, newPaths);
        } else {
          // Mover arquivo sem dependências
          fs.renameSync(sourcePath, destPath);
        }
      } else {
        // Mover arquivo não-JS
        fs.renameSync(sourcePath, destPath);
      }
      
      this.movedFiles.push({
        from: sourcePath,
        to: destPath,
        category: destination
      });
      
      console.log(`   ✅ ${fileName} → ${destination}`);
      return true;
      
    } catch (error) {
      console.error(`   ❌ ${fileName}: ${error.message}`);
      this.errors.push({
        file: fileName,
        error: error.message
      });
      return false;
    }
  }

  // Organizar arquivos
  organizeFiles() {
    console.log('🗂️ Organizando arquivos...');
    
    // Obter todos os arquivos da raiz
    const rootFiles = fs.readdirSync('.').filter(item => {
      const stats = fs.statSync(item);
      return stats.isFile() && !item.startsWith('.') && item !== 'package.json' && item !== 'package-lock.json' && item !== 'tsconfig.json' && item !== 'next-env.d.ts';
    });
    
    console.log(`📋 ${rootFiles.length} arquivos para organizar`);
    
    // Agrupar por categoria
    const categorizedFiles = {};
    const uncategorizedFiles = [];
    
    for (const file of rootFiles) {
      const category = this.categorizeFile(file);
      if (category) {
        if (!categorizedFiles[category.category]) {
          categorizedFiles[category.category] = [];
        }
        categorizedFiles[category.category].push({
          file,
          destination: category.destination,
          description: category.description
        });
      } else {
        uncategorizedFiles.push(file);
      }
    }
    
    // Mover arquivos por categoria
    for (const [categoryName, files] of Object.entries(categorizedFiles)) {
      console.log(`\n📂 ${categoryName.toUpperCase()} (${files.length} arquivos)`);
      console.log(`   ${files[0].description}`);
      
      for (const fileInfo of files) {
        this.moveFile(fileInfo.file, fileInfo.destination);
      }
    }
    
    // Mostrar arquivos não categorizados
    if (uncategorizedFiles.length > 0) {
      console.log(`\n❓ ARQUIVOS NÃO CATEGORIZADOS (${uncategorizedFiles.length}):`);
      uncategorizedFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
  }

  // Criar README principal
  createMainReadme() {
    const readmeContent = `# 🚀 ArcFlow - Sistema de Gestão para Arquitetura e Engenharia

## 📋 Sobre o Projeto

ArcFlow é uma plataforma SaaS especializada para escritórios de Arquitetura, Engenharia e Construção (AEC) no Brasil. O sistema revoluciona o gerenciamento de projetos e automação de workflows para empresas do setor.

## 🏗️ Estrutura do Projeto

### 📁 Diretórios Principais

- **\`backend/\`** - API e servidor Node.js
- **\`frontend/\`** - Interface React/Next.js
- **\`docs/\`** - Documentação completa
- **\`assets/\`** - Recursos estáticos (imagens, configs)
- **\`scripts/\`** - Scripts utilitários e automação

### 📚 Documentação

- **[Documentação da API](docs/api/readme/)** - Endpoints e especificações
- **[Sistema de Briefings](docs/briefings/readme/)** - Documentação de briefings
- **[Sistema de Orçamentos](docs/orcamentos/readme/)** - Documentação de orçamentos
- **[Análises Técnicas](docs/analysis/readme/)** - Relatórios e análises
- **[Manuais](docs/manuals/readme/)** - Guias de usuário

## 🚀 Como Executar

### Backend
\`\`\`bash
cd backend
npm install
npm start
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🛠️ Scripts Úteis

- **\`scripts/deployment/\`** - Scripts de deploy
- **\`scripts/briefings/\`** - Automação de briefings
- **\`scripts/utils/\`** - Utilitários diversos

## 📊 Funcionalidades Principais

- 🧠 **Briefings Inteligentes** - 230+ perguntas especializadas
- 💰 **Orçamentos Automáticos** - Geração baseada em IA
- 👥 **Gestão de Clientes** - CRUD completo
- 📈 **Dashboard Analytics** - Métricas em tempo real
- 🔐 **Autenticação Segura** - JWT com refresh tokens

## 🎯 Tecnologias

- **Backend**: Node.js, Express, PostgreSQL, Redis
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Banco**: PostgreSQL com Prisma ORM
- **Cache**: Redis para performance
- **Deploy**: Docker, AWS/Vercel

## 📞 Suporte

Para dúvidas e suporte, consulte a documentação em \`docs/\` ou entre em contato com a equipe de desenvolvimento.

---

**© 2024 ArcFlow - Sistema de Gestão para Escritórios de Arquitetura e Engenharia**
`;

    fs.writeFileSync('README.md', readmeContent);
    console.log('📄 README.md principal criado');
  }

  // Gerar relatório final
  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RELATÓRIO FINAL DA ORGANIZAÇÃO');
    console.log('='.repeat(80));
    
    console.log(`✅ Arquivos movidos: ${this.movedFiles.length}`);
    console.log(`📁 Diretórios criados: ${this.createdDirs.length}`);
    console.log(`❌ Erros encontrados: ${this.errors.length}`);
    console.log(`💾 Backup criado em: ${BACKUP_DIR}`);
    
    // Agrupar por categoria
    const byCategory = {};
    this.movedFiles.forEach(file => {
      const category = file.category;
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(file);
    });
    
    console.log('\n📋 ARQUIVOS MOVIDOS POR CATEGORIA:');
    for (const [category, files] of Object.entries(byCategory)) {
      console.log(`   📂 ${category}: ${files.length} arquivos`);
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERROS ENCONTRADOS:');
      this.errors.forEach(error => {
        console.log(`   - ${error.file}: ${error.error}`);
      });
    }
    
    // Salvar relatório
    const report = {
      date: new Date().toISOString(),
      movedFiles: this.movedFiles,
      createdDirs: this.createdDirs,
      errors: this.errors,
      backupLocation: BACKUP_DIR,
      summary: {
        totalMoved: this.movedFiles.length,
        totalDirs: this.createdDirs.length,
        totalErrors: this.errors.length
      }
    };
    
    const reportFile = `relatorio-organizacao-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📄 Relatório salvo em: ${reportFile}`);
    
    console.log('\n🎯 RESULTADO:');
    console.log('✅ Projeto organizado profissionalmente');
    console.log('✅ Documentação estruturada');
    console.log('✅ Imagens categorizadas');
    console.log('✅ Scripts organizados');
    console.log('✅ Raiz limpa e profissional');
    
    console.log('\n📁 ESTRUTURA FINAL:');
    console.log('   📂 docs/ - Documentação completa');
    console.log('   📂 assets/ - Imagens e configurações');
    console.log('   📂 scripts/ - Scripts organizados');
    console.log('   📂 temp/ - Arquivos temporários');
    console.log('   📄 README.md - Documentação principal');
  }

  // Executar organização completa
  async execute() {
    console.log('🚀 Iniciando organização completa do projeto...');
    
    // 1. Criar backup
    const backupOk = await this.createBackup();
    if (!backupOk) {
      console.error('❌ Falha no backup. Abortando organização.');
      return;
    }
    
    // 2. Criar estrutura de diretórios
    this.createDirectoryStructure();
    
    // 3. Organizar arquivos
    this.organizeFiles();
    
    // 4. Criar README principal
    this.createMainReadme();
    
    // 5. Gerar relatório
    this.generateReport();
    
    console.log('\n🎉 ORGANIZAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('🏗️ Projeto agora tem estrutura profissional e escalável');
  }
}

// Executar organização
async function main() {
  const organizer = new FileOrganizer();
  await organizer.execute();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FileOrganizer };