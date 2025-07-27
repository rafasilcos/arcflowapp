console.log('🔍 [TEST] Testando inicialização do servidor...');

try {
  // Testar imports básicos
  const express = require('express');
  const { Client } = require('pg');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  
  console.log('✅ [TEST] Todos os módulos carregados com sucesso');

  // Testar conexão com banco
  const client = new Client({ 
    connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
  });

  async function testDatabase() {
    try {
      await client.connect();
      console.log('✅ [TEST] Conexão com banco estabelecida');
      
      // Testar query simples
      const result = await client.query('SELECT NOW()');
      console.log('✅ [TEST] Query de teste executada:', result.rows[0]);
      
      await client.end();
      console.log('✅ [TEST] Conexão fechada');
      
      console.log('🚀 [TEST] TUDO OK! Servidor pode ser iniciado');
      
    } catch (dbError) {
      console.error('❌ [TEST] Erro no banco:', dbError.message);
    }
  }

  testDatabase();

} catch (error) {
  console.error('❌ [TEST] Erro na inicialização:', error.message);
} 