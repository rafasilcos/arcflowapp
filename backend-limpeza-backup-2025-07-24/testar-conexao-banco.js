#!/usr/bin/env node

// SCRIPT DE TESTE DE CONEXÃO COM BANCO DE DADOS
// Diagnóstica problemas de conexão e configuração

const { Client } = require('pg');
require('dotenv').config();

console.log('🔍 DIAGNÓSTICO DE CONEXÃO COM BANCO DE DADOS');
console.log('=' .repeat(50));

// Verificar variáveis de ambiente
console.log('\n📋 VARIÁVEIS DE AMBIENTE:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
console.log(`DB_HOST: ${process.env.DB_HOST || 'NÃO DEFINIDA'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 'NÃO DEFINIDA'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'NÃO DEFINIDA'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'NÃO DEFINIDA'}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);

// Configurações de teste
const configs = [];

// Config 1: DATABASE_URL do .env
if (process.env.DATABASE_URL) {
  configs.push({
    nome: 'DATABASE_URL (.env)',
    config: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  });
}

// Config 2: Variáveis individuais do .env
if (process.env.DB_HOST) {
  configs.push({
    nome: 'Variáveis individuais (.env)',
    config: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  });
}

// Config 3: Padrão local
configs.push({
  nome: 'PostgreSQL Local (padrão)',
  config: {
    host: 'localhost',
    port: 5432,
    database: 'arcflow',
    user: 'postgres',
    password: 'postgres'
  }
});

// Config 4: Supabase direto
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase')) {
  configs.push({
    nome: 'Supabase (SSL obrigatório)',
    config: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  });
}

// Testar cada configuração
async function testarConexao(nome, config) {
  console.log(`\n🔄 Testando: ${nome}`);
  
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log(`  ✅ Conexão estabelecida com sucesso!`);
    
    // Testar query simples
    const result = await client.query('SELECT NOW() as tempo_atual');
    console.log(`  ⏰ Tempo do servidor: ${result.rows[0].tempo_atual}`);
    
    // Verificar se as tabelas existem
    const tabelas = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('escritorios', 'users', 'clientes', 'briefings')
      ORDER BY table_name
    `);
    
    console.log(`  📋 Tabelas encontradas: ${tabelas.rows.map(r => r.table_name).join(', ')}`);
    
    if (tabelas.rows.length === 0) {
      console.log(`  ⚠️  ATENÇÃO: Nenhuma tabela do ArcFlow encontrada!`);
    }
    
    await client.end();
    return true;
    
  } catch (error) {
    console.log(`  ❌ Erro: ${error.message}`);
    
    // Diagnóstico específico do erro
    if (error.code === 'ECONNREFUSED') {
      console.log(`  💡 Diagnóstico: Servidor PostgreSQL não está rodando ou não aceita conexões`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`  💡 Diagnóstico: Host não encontrado - verifique o endereço`);
    } else if (error.message.includes('password')) {
      console.log(`  💡 Diagnóstico: Problema de autenticação - verifique usuário/senha`);
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log(`  💡 Diagnóstico: Banco de dados não existe`);
    } else if (error.message.includes('SSL')) {
      console.log(`  💡 Diagnóstico: Problema de SSL - conexão remota pode precisar de SSL`);
    }
    
    try {
      await client.end();
    } catch (e) {
      // Ignorar erro ao fechar conexão que falhou
    }
    
    return false;
  }
}

async function main() {
  let conexaoSucesso = false;
  
  for (const { nome, config } of configs) {
    const sucesso = await testarConexao(nome, config);
    if (sucesso && !conexaoSucesso) {
      conexaoSucesso = true;
      console.log(`\n🎉 CONEXÃO FUNCIONANDO: ${nome}`);
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  
  if (conexaoSucesso) {
    console.log('✅ DIAGNÓSTICO: Pelo menos uma configuração funciona!');
    console.log('💡 PRÓXIMO PASSO: Execute o script de preenchimento');
    console.log('   node script-preenchimento-briefings.js');
  } else {
    console.log('❌ DIAGNÓSTICO: Nenhuma configuração funcionou');
    console.log('\n🔧 SOLUÇÕES POSSÍVEIS:');
    console.log('1. Verificar se PostgreSQL está rodando:');
    console.log('   - Windows: Verificar serviços do Windows');
    console.log('   - Linux/Mac: sudo systemctl status postgresql');
    console.log('');
    console.log('2. Verificar configurações no .env:');
    console.log('   - DATABASE_URL correto');
    console.log('   - Credenciais válidas');
    console.log('');
    console.log('3. Para Supabase:');
    console.log('   - SSL deve estar habilitado');
    console.log('   - Verificar se o projeto está ativo');
    console.log('');
    console.log('4. Criar banco local:');
    console.log('   createdb arcflow');
    console.log('   psql arcflow < schema.sql');
  }
}

main().catch(error => {
  console.error('💥 Erro fatal no diagnóstico:', error.message);
  process.exit(1);
});