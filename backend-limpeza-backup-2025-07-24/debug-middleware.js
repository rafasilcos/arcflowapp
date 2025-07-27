const jwt = require('jsonwebtoken');

// JWT_SECRET CORRETO do servidor
const JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024';

// Token do último teste
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfYWRtaW5fdGVzdGUiLCJlbWFpbCI6ImFkbWluQGFyY2Zsb3cuY29tIiwibm9tZSI6IkFkbWluIFRlc3RlIiwicm9sZSI6Ik9XTkVSIiwiZXNjcml0b3Jpb0lkIjoiZXNjcml0b3Jpb190ZXN0ZSIsImlhdCI6MTc1MTQ5NTE3OSwiZXhwIjoxNzUxNDk2MDc5LCJhdWQiOiJhcmNmbG93LWNsaWVudCIsImlzcyI6ImFyY2Zsb3ctYXBpIn0.-tuzHmlof-WvOtuKktuiMiQDO9jVtRBxrFiBq4bZjjs';

console.log('🔍 Debugando middleware de autenticação...');

try {
  // Decodificar token
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token decodificado com sucesso:');
  console.log(JSON.stringify(decoded, null, 2));
  
  // Simular middleware - EXATAMENTE como no servidor
  const escritorioIdFromToken = decoded.escritorioId || decoded.id;
  
  const reqUser = {
    id: decoded.id,
    userId: decoded.id,
    email: decoded.email,
    nome: decoded.nome,
    role: decoded.role,
    escritorioId: escritorioIdFromToken
  };
  
  console.log('\n👤 Objeto req.user que será criado:');
  console.log(JSON.stringify(reqUser, null, 2));
  
  console.log('\n🎯 Escritório ID que será usado nas queries:');
  console.log(`  escritorioId: "${reqUser.escritorioId}"`);
  
  // Verificar se é o mesmo que está no banco
  console.log('\n📊 Comparação com dados do banco:');
  console.log('  Usuário admin@arcflow.com tem escritorio_id: "escritorio_teste"');
  console.log('  Clientes foram movidos para escritorio_id: "escritorio_teste"');
  console.log(`  Middleware usará escritorio_id: "${reqUser.escritorioId}"`);
  
  if (reqUser.escritorioId === 'escritorio_teste') {
    console.log('✅ MATCH! Os IDs coincidem - deveria funcionar');
  } else {
    console.log('❌ MISMATCH! Os IDs não coincidem - problema encontrado');
    console.log(`  Esperado: "escritorio_teste"`);
    console.log(`  Obtido: "${reqUser.escritorioId}"`);
  }
  
} catch (error) {
  console.error('❌ Erro ao decodificar token:', error.message);
  console.log('\n🔄 Gerando novo token para teste...');
  
  // Gerar token novo para teste
  const newPayload = {
    id: 'user_admin_teste',
    email: 'admin@arcflow.com',
    nome: 'Admin Teste',
    role: 'OWNER',
    escritorioId: 'escritorio_teste'
  };
  
  const newToken = jwt.sign(newPayload, JWT_SECRET, { 
    expiresIn: '15m',
    issuer: 'arcflow-api',
    audience: 'arcflow-client'
  });
  
  console.log('🔑 Novo token gerado:');
  console.log(newToken);
  
  // Testar novo token
  const decodedNew = jwt.verify(newToken, JWT_SECRET);
  console.log('\n✅ Novo token decodificado:');
  console.log(JSON.stringify(decodedNew, null, 2));
}

// Teste direto da query
async function testarQueryDireta() {
  const { Client } = require('pg');
  const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
  
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    console.log('\n🧪 Testando query direta da API /users...');
    const escritorioId = 'escritorio_teste';
    
    const usersResult = await client.query(`
      SELECT id, nome, email, role, created_at, last_login, is_active
      FROM users 
      WHERE escritorio_id = $1 AND is_active = true
      ORDER BY created_at ASC
    `, [escritorioId]);
    
    console.log(`📊 Query retornou: ${usersResult.rows.length} usuários`);
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n🧪 Testando query direta da API /clientes...');
    const clientesResult = await client.query(`
      SELECT * FROM clientes c 
      WHERE c.escritorio_id = $1 AND c.is_active = true
      ORDER BY c.created_at DESC
      LIMIT 20 OFFSET 0
    `, [escritorioId]);
    
    console.log(`📊 Query retornou: ${clientesResult.rows.length} clientes`);
    clientesResult.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
    });
    
  } catch (error) {
    console.error('❌ Erro na query:', error);
  } finally {
    await client.end();
  }
}

// Executar teste
testarQueryDireta(); 