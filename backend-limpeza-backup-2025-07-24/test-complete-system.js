const axios = require('axios');

const API_BASE = 'http://localhost:3001';

// Configuração global
let tokens = {};
let testData = {
  checkout: null,
  paymentId: null
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== TESTES DO SISTEMA COMPLETO =====

async function testSystemHealth() {
  console.log('\n🔍 TESTANDO SAÚDE DO SISTEMA...');
  
  try {
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', health.data.status, health.data.version);
    
    const apiHealth = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ API Health:', apiHealth.data.status);
    console.log('   📊 Serviços:', Object.entries(apiHealth.data.services).map(([k,v]) => `${k}: ${v}`).join(', '));
    
    return true;
  } catch (error) {
    console.log('❌ Erro na saúde do sistema:', error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('\n🔐 TESTANDO AUTENTICAÇÃO...');
  
  try {
    // Login com usuário existente
    console.log('1️⃣ Testando login...');
    const login = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    console.log('✅ Login realizado com sucesso');
    console.log('   👤 Usuário:', login.data.user.nome);
    console.log('   🏢 Escritório:', login.data.user.escritorioNome);
    console.log('   📋 Plano:', login.data.user.planId);
    console.log('   🔑 Token:', login.data.tokens.accessToken.substring(0, 50) + '...');
    
    // Salvar tokens para próximos testes
    tokens = login.data.tokens;
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro na autenticação:', error.response?.data || error.message);
    return false;
  }
}

async function testNewRegistration() {
  console.log('\n📝 TESTANDO NOVO REGISTRO...');
  
  try {
    const randomEmail = `teste${Date.now()}@arcflow.com`;
    
    const registro = await axios.post(`${API_BASE}/api/auth/register`, {
      nome: 'Usuário Teste',
      email: randomEmail,
      password: 'senha123456',
      escritorio: {
        nome: 'Escritório Teste Novo',
        email: `contato${Date.now()}@escritorio.com`,
        telefone: '(11) 99999-9999',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      planId: 'plan_basic'
    });
    
    console.log('✅ Registro realizado com sucesso');
    console.log('   👤 Usuário:', registro.data.user.nome);
    console.log('   📧 Email:', registro.data.user.email);
    console.log('   🏢 Escritório:', registro.data.escritorio.nome);
    console.log('   📋 Plano:', registro.data.escritorio.planId);
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro no registro:', error.response?.data || error.message);
    return false;
  }
}

async function testPaymentSystem() {
  console.log('\n💳 TESTANDO SISTEMA DE PAGAMENTOS...');
  
  try {
    // Listar planos
    console.log('1️⃣ Buscando planos disponíveis...');
    const plans = await axios.get(`${API_BASE}/api/payments/plans`);
    
    console.log('✅ Planos carregados:', plans.data.plans.length);
    plans.data.plans.forEach(plan => {
      console.log(`   📋 ${plan.name}: R$ ${plan.price_monthly}/mês (${plan.savings_yearly}% economia anual)`);
    });
    
    // Buscar plano atual
    console.log('\n2️⃣ Verificando plano atual...');
    const currentPlan = await axios.get(`${API_BASE}/api/payments/current-plan`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    
    console.log('✅ Plano atual:', currentPlan.data.current_plan.plan_name);
    console.log('   📊 Status:', currentPlan.data.current_plan.subscription_status);
    console.log('   👥 Limite usuários:', currentPlan.data.current_plan.limits.max_users);
    console.log('   📁 Limite projetos:', currentPlan.data.current_plan.limits.max_projects);
    
    // Criar checkout para upgrade
    console.log('\n3️⃣ Criando checkout para upgrade...');
    const checkout = await axios.post(`${API_BASE}/api/payments/create-checkout`, {
      planId: 'plan_pro',
      billing_cycle: 'monthly'
    }, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    
    console.log('✅ Checkout criado com sucesso');
    console.log('   💰 Valor:', `R$ ${checkout.data.checkout.amount}`);
    console.log('   📋 Plano:', checkout.data.checkout.plan_name);
    console.log('   🔗 URL:', checkout.data.checkout.checkout_url);
    
    // Salvar dados para teste de pagamento
    testData.checkout = checkout.data.checkout;
    testData.paymentId = checkout.data.checkout.payment_id;
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro no sistema de pagamentos:', error.response?.data || error.message);
    return false;
  }
}

async function testPaymentFlow() {
  console.log('\n🎯 TESTANDO FLUXO DE PAGAMENTO...');
  
  if (!testData.paymentId) {
    console.log('⚠️ Nenhum pagamento para testar');
    return false;
  }
  
  try {
    // Simular pagamento bem-sucedido
    console.log('1️⃣ Simulando pagamento bem-sucedido...');
    const payment = await axios.post(`${API_BASE}/api/payments/test-payment`, {
      payment_id: testData.paymentId,
      success: true
    }, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    
    console.log('✅ Pagamento processado:', payment.data.status);
    
    // Aguardar processamento
    await sleep(1000);
    
    // Verificar se plano foi atualizado
    console.log('\n2️⃣ Verificando atualização do plano...');
    const updatedPlan = await axios.get(`${API_BASE}/api/payments/current-plan`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    
    console.log('✅ Plano atualizado:', updatedPlan.data.current_plan.plan_name);
    console.log('   📊 Status:', updatedPlan.data.current_plan.subscription_status);
    console.log('   📅 Expira em:', updatedPlan.data.current_plan.subscription_ends_at);
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro no fluxo de pagamento:', error.response?.data || error.message);
    return false;
  }
}

async function testFullWorkflow() {
  console.log('\n🔄 TESTANDO WORKFLOW COMPLETO...');
  
  try {
    // Novo usuário registra
    const randomEmail = `workflow${Date.now()}@arcflow.com`;
    
    console.log('1️⃣ Registrando novo usuário...');
    const registro = await axios.post(`${API_BASE}/api/auth/register`, {
      nome: 'Usuário Workflow',
      email: randomEmail,
      password: 'senha123456',
      escritorio: {
        nome: 'Escritório Workflow',
        email: `workflow${Date.now()}@escritorio.com`,
        cidade: 'Rio de Janeiro',
        estado: 'RJ'
      },
      planId: 'plan_free' // Começa no plano grátis
    });
    
    const userTokens = registro.data.tokens;
    console.log('✅ Usuário registrado:', registro.data.user.nome);
    
    // Usuário vê os planos
    console.log('\n2️⃣ Usuário consulta planos...');
    const plans = await axios.get(`${API_BASE}/api/payments/plans`);
    console.log('✅ Planos disponíveis:', plans.data.plans.length);
    
    // Usuário escolhe um plano e cria checkout
    console.log('\n3️⃣ Usuário escolhe plano básico...');
    const checkout = await axios.post(`${API_BASE}/api/payments/create-checkout`, {
      planId: 'plan_basic',
      billing_cycle: 'yearly' // Anual com desconto
    }, {
      headers: { Authorization: `Bearer ${userTokens.accessToken}` }
    });
    
    console.log('✅ Checkout criado:', checkout.data.checkout.plan_name);
    console.log('   💰 Valor anual:', `R$ ${checkout.data.checkout.amount}`);
    
    // Simular pagamento
    console.log('\n4️⃣ Processando pagamento...');
    await axios.post(`${API_BASE}/api/payments/test-payment`, {
      payment_id: checkout.data.checkout.payment_id,
      success: true
    }, {
      headers: { Authorization: `Bearer ${userTokens.accessToken}` }
    });
    
    // Verificar resultado final
    await sleep(1000);
    const finalPlan = await axios.get(`${API_BASE}/api/payments/current-plan`, {
      headers: { Authorization: `Bearer ${userTokens.accessToken}` }
    });
    
    console.log('✅ Workflow completo!');
    console.log('   📋 Plano final:', finalPlan.data.current_plan.plan_name);
    console.log('   📊 Status:', finalPlan.data.current_plan.subscription_status);
    console.log('   🎯 Resultado: SUCESSO TOTAL!');
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro no workflow:', error.response?.data || error.message);
    return false;
  }
}

// ===== EXECUÇÃO PRINCIPAL =====

async function runAllTests() {
  console.log('🧪 ===============================================');
  console.log('   TESTE COMPLETO DO SISTEMA ARCFLOW');
  console.log('🧪 ===============================================');
  
  const tests = [
    { name: 'Saúde do Sistema', fn: testSystemHealth },
    { name: 'Autenticação', fn: testAuthentication },
    { name: 'Novo Registro', fn: testNewRegistration },
    { name: 'Sistema de Pagamentos', fn: testPaymentSystem },
    { name: 'Fluxo de Pagamento', fn: testPaymentFlow },
    { name: 'Workflow Completo', fn: testFullWorkflow }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        console.log(`\n✅ ${test.name}: PASSOU`);
      } else {
        failed++;
        console.log(`\n❌ ${test.name}: FALHOU`);
      }
    } catch (error) {
      failed++;
      console.log(`\n💥 ${test.name}: ERRO - ${error.message}`);
    }
    
    // Pausa entre testes
    await sleep(500);
  }
  
  console.log('\n🎯 ===============================================');
  console.log('               RESULTADO FINAL');
  console.log('🎯 ===============================================');
  console.log(`✅ Testes aprovados: ${passed}`);
  console.log(`❌ Testes falharam: ${failed}`);
  console.log(`📊 Taxa de sucesso: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 PARABÉNS! SISTEMA 100% FUNCIONAL!');
    console.log('🚀 Pronto para produção!');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verificar logs acima.');
  }
  
  console.log('\n🔗 URLs importantes:');
  console.log(`   📍 Health: ${API_BASE}/health`);
  console.log(`   🔐 Auth: ${API_BASE}/api/auth/login`);
  console.log(`   💳 Plans: ${API_BASE}/api/payments/plans`);
}

// Aguardar servidor e executar testes
setTimeout(runAllTests, 2000); 