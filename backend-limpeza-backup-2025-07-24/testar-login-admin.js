const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

const JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024';

async function testarLogin() {
  try {
    await client.connect();
    
    console.log('🔐 Testando login do admin@arcflow.com...');
    
    // Buscar usuário
    const result = await client.query(`
      SELECT 
        u.id,
        u.nome,
        u.email,
        u.password_hash,
        u.role,
        u.escritorio_id,
        u.is_active,
        e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.email = $1
    `, ['admin@arcflow.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado!');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ Usuário encontrado:');
    console.log('  ID:', user.id);
    console.log('  Nome:', user.nome);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Ativo:', user.is_active);
    console.log('  Escritório ID:', user.escritorio_id);
    console.log('  Escritório Nome:', user.escritorio_nome);
    
    // Verificar senha
    const senhaCorreta = await bcrypt.compare('123456', user.password_hash);
    console.log('🔑 Senha correta:', senhaCorreta ? '✅ Sim' : '❌ Não');
    
    if (!senhaCorreta) {
      console.log('❌ Senha incorreta!');
      return;
    }
    
    // Gerar token
    const payload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      escritorioId: user.escritorio_id
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '15m',
      issuer: 'arcflow-api',
      audience: 'arcflow-client'
    });
    
    console.log('🎫 Token gerado com sucesso!');
    console.log('Token:', token);
    
    // Verificar token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token válido! Dados decodificados:');
      console.log('  ID:', decoded.id);
      console.log('  Email:', decoded.email);
      console.log('  Nome:', decoded.nome);
      console.log('  Role:', decoded.role);
      console.log('  Escritório ID:', decoded.escritorioId);
    } catch (tokenError) {
      console.log('❌ Erro ao verificar token:', tokenError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

testarLogin(); 