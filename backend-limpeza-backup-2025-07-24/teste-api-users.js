const jwt = require('jsonwebtoken');

// Criar token JWT para teste
const JWT_SECRET = 'arcflow_super_secret_key_2024_production_ready';

const tokenPayload = {
  id: 'user_admin_teste',
  email: 'admin@arcflow.com',
  nome: 'Admin Teste',
  role: 'admin',
  escritorioId: 'user_admin_teste' // Mesmo ID do usuário
};

const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

console.log('🔐 Token JWT criado para teste:');
console.log(token);
console.log('\n📊 Payload do token:');
console.log(tokenPayload);

// Testar API /users
async function testarApiUsers() {
  try {
    console.log('\n🧪 Testando API /users...');
    
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Status text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API /users funcionando!');
      console.log('📋 Dados retornados:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.users && Array.isArray(data.users)) {
        console.log(`\n👥 Total de usuários: ${data.users.length}`);
        data.users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.nome} (${user.email}) - Role: ${user.role}`);
        });
      } else {
        console.log('⚠️ Formato de resposta inesperado');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na API:');
      console.log('Status:', response.status);
      console.log('Resposta:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error);
  }
}

// Executar teste
testarApiUsers(); 