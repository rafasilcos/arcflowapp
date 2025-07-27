const fetch = require('node-fetch');

async function testAPIs() {
  const baseURL = 'http://localhost:3001';
  
  console.log('🧪 TESTANDO APIS DEPOIS DAS CORREÇÕES...\n');
  
  try {
    // 1. Health Check
    console.log('1️⃣ Testando Health Check...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response:`, healthData);
    console.log('');
    
    // 2. Plans API
    console.log('2️⃣ Testando API de Planos...');
    const plansResponse = await fetch(`${baseURL}/api/payments/plans`);
    const plansData = await plansResponse.json();
    console.log(`   Status: ${plansResponse.status}`);
    if (plansResponse.status === 200) {
      console.log(`   ✅ SUCESSO! Encontrados ${plansData.plans?.length || 0} planos`);
      plansData.plans?.forEach(plan => {
        console.log(`      - ${plan.name}: R$ ${plan.price_monthly}/mês`);
      });
    } else {
      console.log(`   ❌ ERRO:`, plansData);
    }
    console.log('');
    
    // 3. Login Test (should fail without credentials)
    console.log('3️⃣ Testando API de Login (sem credenciais)...');
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const loginData = await loginResponse.json();
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Expected 400 (bad request):`, loginData.error);
    console.log('');
    
    console.log('🎯 RESUMO DO TESTE:');
    console.log(`   Health Check: ${healthResponse.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`   Plans API: ${plansResponse.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`   Auth API: ${loginResponse.status === 400 ? '✅ OK' : '❌ ERRO'}`);
    
    if (healthResponse.status === 200 && plansResponse.status === 200 && loginResponse.status === 400) {
      console.log('\n🚀 SISTEMA ESTÁ FUNCIONANDO PERFEITAMENTE!');
      console.log('✅ Pode prosseguir para cadastro de clientes!');
    } else {
      console.log('\n⚠️ Ainda há problemas para resolver...');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testAPIs(); 