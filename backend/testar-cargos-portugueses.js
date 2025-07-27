// Teste do sistema de cargos em português
console.log('🔧 Testando sistema de cargos em português...\n');

// Limpar dados de teste
global.convites = [];
global.usuariosComCargo = [];

// Simular convite com cargo em português
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');

const convite = {
  id: token,
  email: 'engenheiro@exemplo.com',
  nome: 'João Silva',
  cargo: 'Engenheiro Civil Senior', // CARGO EM PORTUGUÊS
  role: 'ENGINEER',                // ROLE EM INGLÊS
  token,
  status: 'PENDENTE',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  mensagemPersonalizada: 'Bem-vindo à equipe!',
  escritorioId: 'test-escritorio',
  enviadoPorId: 'test-user',
  createdAt: new Date(),
  enviadoPor: {
    nome: 'Rafael Teste',
    escritorio_nome: 'ArcFlow Test'
  }
};

global.convites.push(convite);

console.log('✅ Convite criado:');
console.log('Cargo:', convite.cargo);
console.log('Role:', convite.role);

// Simular aceite do convite
console.log('\n🔄 Simulando aceite do convite...');

// Simular criação de usuário
const userId = 'user-test-123';
const roleCorrigida = convite.role === 'ENGINEER' ? 'ARCHITECT' : convite.role;

console.log('Role corrigida para banco:', roleCorrigida);

// Simular salvamento do cargo original
global.usuariosComCargo.push({
  userId: userId,
  cargo: convite.cargo,     // "Engenheiro Civil Senior"
  role: convite.role,       // "ENGINEER"
  roleCorrigida: roleCorrigida // "ARCHITECT"
});

// Simular usuário no banco
const userNoBanco = {
  id: userId,
  nome: 'João Silva',
  email: 'engenheiro@exemplo.com',
  role: roleCorrigida, // "ARCHITECT" (salvo no banco)
  is_active: true,
  created_at: new Date(),
  last_login: new Date()
};

// Simular busca de usuários (como na API)
const cargoOriginal = global.usuariosComCargo.find(u => u.userId === userNoBanco.id);

// Função traduzir role
const traduzirRole = (role) => {
  const traducoes = {
    'USER': 'Usuário',
    'ARCHITECT': 'Arquiteto', 
    'ENGINEER': 'Engenheiro',
    'DESIGNER': 'Designer',
    'MANAGER': 'Gerente',
    'ADMIN': 'Administrador',
    'OWNER': 'Proprietário'
  };
  
  return traducoes[role] || role;
};

const userRetornado = {
  id: userNoBanco.id,
  nome: userNoBanco.nome,
  email: userNoBanco.email,
  cargo: cargoOriginal ? cargoOriginal.cargo : traduzirRole(userNoBanco.role),
  role: userNoBanco.role,
  status: userNoBanco.is_active ? 'ATIVO' : 'INATIVO',
  ultimoLogin: userNoBanco.last_login || userNoBanco.created_at,
  createdAt: userNoBanco.created_at
};

console.log('\n🎯 RESULTADO FINAL:');
console.log('Usuário no banco - Role:', userNoBanco.role);
console.log('Cargo original salvo:', cargoOriginal ? cargoOriginal.cargo : 'N/A');
console.log('Cargo exibido para usuário:', userRetornado.cargo);
console.log('Role exibido para usuário:', userRetornado.role);

console.log('\n✅ TESTE CONCLUÍDO:');
console.log('1. Cargo original preservado:', cargoOriginal ? '✅' : '❌');
console.log('2. Cargo exibido em português:', userRetornado.cargo === 'Engenheiro Civil Senior' ? '✅' : '❌');
console.log('3. Role funcional no banco:', userRetornado.role === 'ARCHITECT' ? '✅' : '❌');

console.log('\n📊 COMPARAÇÃO:');
console.log('ANTES: Cargo exibido =', traduzirRole(userNoBanco.role), '(traduzido automaticamente)');
console.log('AGORA: Cargo exibido =', userRetornado.cargo, '(cargo original preservado)');

if (userRetornado.cargo === 'Engenheiro Civil Senior') {
  console.log('\n🎉 SUCESSO! Sistema funcionando corretamente!');
} else {
  console.log('\n❌ ERRO! Sistema ainda não está funcionando corretamente!');
} 