#!/usr/bin/env node

// TESTE DIRETO DO ARQUIVO .ENV
const fs = require('fs');
const path = require('path');

console.log('🔍 TESTE DIRETO DO ARQUIVO .ENV');
console.log('=' .repeat(40));

// Verificar se arquivo .env existe
const envPath = path.join(__dirname, '.env');
console.log(`📁 Caminho do .env: ${envPath}`);
console.log(`📋 Arquivo existe: ${fs.existsSync(envPath) ? 'SIM' : 'NÃO'}`);

if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('\n📄 CONTEÚDO DO .ENV:');
    console.log(envContent);
    
    // Carregar manualmente
    const lines = envContent.split('\n');
    const envVars = {};
    
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // Remover aspas se existirem
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          envVars[key] = value;
        }
      }
    });
    
    console.log('\n🔑 VARIÁVEIS EXTRAÍDAS:');
    Object.keys(envVars).forEach(key => {
      if (key.includes('PASSWORD') || key.includes('SECRET')) {
        console.log(`${key}: [OCULTO]`);
      } else {
        console.log(`${key}: ${envVars[key]}`);
      }
    });
    
    // Testar conexão com essas variáveis
    if (envVars.DATABASE_URL) {
      console.log('\n🔄 TESTANDO CONEXÃO COM DATABASE_URL...');
      
      const { Client } = require('pg');
      const client = new Client({
        connectionString: envVars.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      client.connect()
        .then(() => {
          console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!');
          return client.query('SELECT NOW() as tempo');
        })
        .then(result => {
          console.log(`⏰ Tempo do servidor: ${result.rows[0].tempo}`);
          return client.end();
        })
        .then(() => {
          console.log('🎉 TESTE DE CONEXÃO CONCLUÍDO COM SUCESSO!');
        })
        .catch(error => {
          console.log(`❌ ERRO NA CONEXÃO: ${error.message}`);
          if (error.code) {
            console.log(`📋 Código do erro: ${error.code}`);
          }
        });
    } else {
      console.log('\n⚠️  DATABASE_URL não encontrada no .env');
    }
    
  } catch (error) {
    console.log(`❌ Erro ao ler .env: ${error.message}`);
  }
} else {
  console.log('\n❌ Arquivo .env não encontrado!');
  console.log('💡 Crie o arquivo .env com as configurações do banco');
}