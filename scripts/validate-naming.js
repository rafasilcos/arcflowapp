#!/usr/bin/env node
// 🔍 SCRIPT DE VALIDAÇÃO DE NOMENCLATURA ARCFLOW
// Este script verifica se o padrão de nomenclatura está sendo seguido

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 VALIDANDO NOMENCLATURA ARCFLOW...\n');

// 🎯 PADRÕES ESPERADOS
const SNAKE_CASE_PATTERN = /^[a-z]+(_[a-z]+)*$/;
const CAMEL_CASE_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

// 📊 MAPEAMENTO DE CAMPOS OBRIGATÓRIOS
const FIELD_MAPPINGS = {
  'nome_projeto': 'nomeProjeto',
  'cliente_id': 'clienteId',
  'responsavel_id': 'responsavelId',
  'escritorio_id': 'escritorioId',
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'deleted_at': 'deletedAt',
  'created_by': 'createdBy',
  'updated_by': 'updatedBy'
};

let errors = [];
let warnings = [];

// 🔍 FUNÇÃO PARA ENCONTRAR ARQUIVOS
function findFiles(dir, extension) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// 🔍 VALIDAR BACKEND
function validateBackend() {
  console.log('🖥️  VALIDANDO BACKEND...');
  
  const backendFiles = findFiles('backend', '.js');
  
  for (const file of backendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar se queries SQL estão fazendo conversão correta
    const sqlSelects = content.match(/SELECT[\s\S]*?FROM/gi);
    
    if (sqlSelects) {
      for (const select of sqlSelects) {
        // Verificar se campos snake_case estão sendo convertidos para camelCase
        for (const [snakeCase, camelCase] of Object.entries(FIELD_MAPPINGS)) {
          if (select.includes(snakeCase) && !select.includes(`as "${camelCase}"`)) {
            warnings.push(`${file}: Campo ${snakeCase} deve ser convertido para ${camelCase}`);
          }
        }
      }
    }
    
    // Verificar se responses estão em camelCase
    const responseObjects = content.match(/{\s*[\s\S]*?}/gi);
    
    if (responseObjects) {
      for (const obj of responseObjects) {
        for (const snakeCase of Object.keys(FIELD_MAPPINGS)) {
          if (obj.includes(snakeCase + ':')) {
            errors.push(`${file}: Propriedade ${snakeCase} deve estar em camelCase`);
          }
        }
      }
    }
  }
}

// 🔍 VALIDAR FRONTEND
function validateFrontend() {
  console.log('🎨 VALIDANDO FRONTEND...');
  
  const frontendFiles = findFiles('frontend/src', '.tsx');
  
  for (const file of frontendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar se propriedades estão sendo acessadas em camelCase
    for (const [snakeCase, camelCase] of Object.entries(FIELD_MAPPINGS)) {
      
      // Verificar acesso direto a propriedades snake_case
      const snakeCaseAccess = new RegExp(`\\.${snakeCase}\\b`, 'g');
      if (snakeCaseAccess.test(content)) {
        warnings.push(`${file}: Acessando propriedade ${snakeCase} - deve usar ${camelCase}`);
      }
      
      // Verificar interfaces com snake_case
      const interfaceSnakeCase = new RegExp(`${snakeCase}\\s*[?:]`, 'g');
      if (interfaceSnakeCase.test(content)) {
        errors.push(`${file}: Interface usa ${snakeCase} - deve usar ${camelCase}`);
      }
    }
  }
}

// 🔍 VALIDAR INTERFACES CENTRALIZADAS
function validateInterfaces() {
  console.log('📝 VALIDANDO INTERFACES...');
  
  const typeFiles = findFiles('frontend/src/types', '.ts');
  
  for (const file of typeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar se interfaces usam camelCase
    for (const [snakeCase, camelCase] of Object.entries(FIELD_MAPPINGS)) {
      if (content.includes(snakeCase + ':') || content.includes(snakeCase + '?:')) {
        errors.push(`${file}: Interface deve usar ${camelCase} em vez de ${snakeCase}`);
      }
    }
  }
}

// 🔍 VALIDAR FALLBACKS
function validateFallbacks() {
  console.log('🛡️  VALIDANDO FALLBACKS...');
  
  const frontendFiles = findFiles('frontend/src', '.tsx');
  
  for (const file of frontendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar se existem fallbacks para compatibilidade
    for (const [snakeCase, camelCase] of Object.entries(FIELD_MAPPINGS)) {
      const directAccess = new RegExp(`\\.${camelCase}\\b`, 'g');
      const fallbackPattern = new RegExp(`\\.${camelCase}\\s*\\|\\|\\s*.*\\.${snakeCase}`, 'g');
      
      if (directAccess.test(content) && !fallbackPattern.test(content)) {
        warnings.push(`${file}: Considere adicionar fallback para ${camelCase} || ${snakeCase}`);
      }
    }
  }
}

// 🔍 EXECUTAR VALIDAÇÕES
validateBackend();
validateFrontend();
validateInterfaces();
validateFallbacks();

// 📊 RELATÓRIO FINAL
console.log('\n📊 RELATÓRIO DE VALIDAÇÃO:\n');

if (errors.length > 0) {
  console.log('❌ ERROS CRÍTICOS:');
  errors.forEach(error => console.log(`  - ${error}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  AVISOS:');
  warnings.forEach(warning => console.log(`  - ${warning}`));
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ PARABÉNS! Nomenclatura está consistente!');
} else {
  console.log(`🔍 Total: ${errors.length} erros, ${warnings.length} avisos`);
  
  if (errors.length > 0) {
    console.log('\n❌ CORRIGIR ERROS ANTES DE CONTINUAR!');
    process.exit(1);
  } else {
    console.log('\n✅ Apenas avisos encontrados - pode continuar');
  }
}

console.log('\n📖 Consulte: docs/PADRAO_NOMENCLATURA_ARCFLOW.md');
console.log('🎯 Padrão: snake_case (banco) → camelCase (backend/frontend)'); 