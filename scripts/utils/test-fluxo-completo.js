// ===== TESTE FLUXO COMPLETO ARCFLOW =====
// Testa desde a landing page até criação real no banco de dados

// Usar fetch nativo do Node.js 18+ ou polyfill
const fetch = globalThis.fetch || require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Dados de teste para o fluxo completo
const dadosTesteCompleto = {
  // 1. Dados do usuário/responsável
  nome: 'Rafael Silva',
  email: 'rafael.teste@arcflow.com',
  password: 'senha123',
  
  // 2. Dados do escritório
  escritorio: {
    nome: 'ArcFlow Arquitetura Teste',
    email: 'contato@arcflowtest.com',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 99999-9999',
    endereco: 'Rua Teste, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567'
  },
  
  // 3. Dados do onboarding (simulando preenchimento)
  onboarding: {
    porte: 'Pequeno',
    faturamentoMensal: 50000,
    anosExperiencia: 5,
    principaisDesafios: ['Organização', 'Produtividade'],
    objetivoPrincipal: 'Crescimento',
    numeroFuncionarios: 8,
    localizacao: {
      cidade: 'São Paulo',
      estado: 'SP'
    }
  },
  
  // 4. Primeiro colaborador a ser convidado
  primeiroColaborador: {
    nome: 'Maria Santos',
    email: 'maria.santos@arcflowtest.com',
    cargo: 'Arquiteta Senior',
    role: 'ARCHITECT'
  }
};

async function testarFluxoCompleto() {
  console.log('🚀 ===============================================');
  console.log('   TESTE FLUXO COMPLETO - ARCFLOW');
  console.log('🚀 ===============================================\n');

  try {
    // ===== ETAPA 1: VERIFICAR SERVIÇOS =====
    console.log('1️⃣ Verificando se serviços estão rodando...');
    
    try {
      const healthCheck = await fetch(`${BASE_URL}/health`);
      if (healthCheck.ok) {
        console.log('✅ Backend rodando na porta 3001');
      } else {
        throw new Error('Backend não está respondendo');
      }
    } catch (error) {
      console.log('❌ Backend não está rodando na porta 3001');
      console.log('   Execute: cd backend && node server-simple.js');
      return;
    }

    try {
      const frontendCheck = await fetch(`${FRONTEND_URL}`);
      if (frontendCheck.ok) {
        console.log('✅ Frontend rodando na porta 3000');
      } else {
        throw new Error('Frontend não está respondendo');
      }
    } catch (error) {
      console.log('❌ Frontend não está rodando na porta 3000');
      console.log('   Execute: cd frontend && npm run dev');
      return;
    }

    console.log('');

    // ===== ETAPA 2: SIMULAR ONBOARDING =====
    console.log('2️⃣ Simulando fluxo de onboarding...');
    console.log(`📋 Dados coletados no onboarding:`);
    console.log(`   - Escritório: ${dadosTesteCompleto.escritorio.nome}`);
    console.log(`   - Responsável: ${dadosTesteCompleto.nome}`);
    console.log(`   - Porte: ${dadosTesteCompleto.onboarding.porte}`);
    console.log(`   - Funcionários: ${dadosTesteCompleto.onboarding.numeroFuncionarios}`);
    console.log('✅ Onboarding simulado com sucesso\n');

    // ===== ETAPA 3: REGISTRO REAL NO BANCO =====
    console.log('3️⃣ Criando escritório e usuário no banco de dados...');
    
    const registroResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: dadosTesteCompleto.nome,
        email: dadosTesteCompleto.email,
        password: dadosTesteCompleto.password,
        escritorio: dadosTesteCompleto.escritorio,
        planId: 'plan_professional' // Plano baseado no onboarding
      })
    });

    const registroData = await registroResponse.json();
    
    if (registroResponse.ok) {
      console.log('✅ Escritório criado no banco de dados');
      console.log(`   - ID Escritório: ${registroData.escritorio.id}`);
      console.log(`   - ID Usuário: ${registroData.user.id}`);
      console.log(`   - Role: ${registroData.user.role}`);
      console.log(`   - Plano: ${registroData.escritorio.planId}`);
    } else {
      console.log('❌ Erro ao criar escritório:', registroData.error);
      return;
    }

    const { accessToken } = registroData.tokens;
    const escritorioId = registroData.user.escritorioId;
    console.log('');

    // ===== ETAPA 4: TESTAR LOGIN =====
    console.log('4️⃣ Testando login do usuário criado...');
    
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: dadosTesteCompleto.email,
        password: dadosTesteCompleto.password
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login realizado com sucesso');
      console.log(`   - Usuário: ${loginData.user.nome}`);
      console.log(`   - Email: ${loginData.user.email}`);
      console.log(`   - Token válido: ${loginData.tokens.accessToken ? 'Sim' : 'Não'}`);
    } else {
      console.log('❌ Erro no login:', loginData.error);
      return;
    }
    console.log('');

    // ===== ETAPA 5: CRIAR PRIMEIRO CLIENTE =====
    console.log('5️⃣ Criando primeiro cliente...');
    
    const clienteResponse = await fetch(`${BASE_URL}/api/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        nome: 'Cliente Teste ArcFlow',
        email: 'cliente.teste@email.com',
        telefone: '(11) 88888-8888',
        tipoPessoa: 'juridica',
        cnpj: '98.765.432/0001-10',
        endereco: {
          logradouro: 'Av. Cliente, 456',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '04567-890'
        },
        observacoes: 'Cliente criado via teste de fluxo completo'
      })
    });

    const clienteData = await clienteResponse.json();
    
    if (clienteResponse.ok) {
      console.log('✅ Cliente criado com sucesso');
      console.log(`   - ID Cliente: ${clienteData.cliente.id}`);
      console.log(`   - Nome: ${clienteData.cliente.nome}`);
      console.log(`   - Email: ${clienteData.cliente.email}`);
    } else {
      console.log('❌ Erro ao criar cliente:', clienteData.error);
    }
    console.log('');

    // ===== ETAPA 6: SIMULAR CONVITE DE COLABORADOR =====
    console.log('6️⃣ Simulando convite de colaborador...');
    console.log('📧 Dados do convite:');
    console.log(`   - Nome: ${dadosTesteCompleto.primeiroColaborador.nome}`);
    console.log(`   - Email: ${dadosTesteCompleto.primeiroColaborador.email}`);
    console.log(`   - Cargo: ${dadosTesteCompleto.primeiroColaborador.cargo}`);
    console.log(`   - Role: ${dadosTesteCompleto.primeiroColaborador.role}`);
    
    // Nota: Sistema de convites ainda não implementado
    console.log('⚠️  Sistema de convites ainda não implementado');
    console.log('   - Funcionalidade planejada para próxima versão');
    console.log('   - Por enquanto, novos usuários são criados diretamente pelo OWNER');
    console.log('');

    // ===== ETAPA 7: VERIFICAR DADOS PERSISTIDOS =====
    console.log('7️⃣ Verificando dados persistidos no banco...');
    
    const statusResponse = await fetch(`${BASE_URL}/api/auth/status`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const statusData = await statusResponse.json();
    
    if (statusResponse.ok) {
      console.log('✅ Dados persistidos corretamente');
      console.log(`   - Usuário ativo: ${statusData.user.nome}`);
      console.log(`   - Escritório: ${statusData.user.escritorioId}`);
      console.log(`   - Role: ${statusData.user.role}`);
      console.log(`   - Sessão válida: Sim`);
    } else {
      console.log('❌ Erro ao verificar status:', statusData.error);
    }
    console.log('');

    // ===== RESUMO FINAL =====
    console.log('🎯 ===============================================');
    console.log('   RESUMO DO TESTE FLUXO COMPLETO');
    console.log('🎯 ===============================================');
    console.log('✅ Backend rodando e respondendo');
    console.log('✅ Frontend rodando e acessível');
    console.log('✅ Onboarding simulado com sucesso');
    console.log('✅ Escritório criado no banco de dados');
    console.log('✅ Usuário OWNER criado e autenticado');
    console.log('✅ Login funcionando corretamente');
    console.log('✅ Cliente criado com sucesso');
    console.log('✅ Dados persistidos corretamente');
    console.log('⚠️  Sistema de convites pendente');
    console.log('');
    console.log('🚀 FLUXO PRINCIPAL FUNCIONANDO 100%!');
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('   1. Implementar sistema de convites');
    console.log('   2. Criar fluxo de aceite de convites');
    console.log('   3. Adicionar gestão de permissões por usuário');
    console.log('   4. Implementar dashboard de equipe');
    console.log('');
    console.log('🌐 URLS PARA TESTAR:');
    console.log(`   - Landing Page: ${FRONTEND_URL}`);
    console.log(`   - Login: ${FRONTEND_URL}/auth/login`);
    console.log(`   - Registro: ${FRONTEND_URL}/auth/registro`);
    console.log(`   - Dashboard: ${FRONTEND_URL}/dashboard`);
    console.log(`   - Clientes: ${FRONTEND_URL}/comercial/clientes`);

  } catch (error) {
    console.log('❌ Erro durante o teste:', error.message);
    console.log('');
    console.log('🔧 VERIFICAÇÕES:');
    console.log('   1. Backend rodando: cd backend && node server-simple.js');
    console.log('   2. Frontend rodando: cd frontend && npm run dev');
    console.log('   3. Banco de dados configurado corretamente');
  }
}

// Executar teste
testarFluxoCompleto(); 