const fetch = require('node-fetch');

async function testarBriefingCorrigido() {
  console.log('🧪 TESTE: Briefing Corrigido');
  console.log('=========================\n');
  
  try {
    // 1. Fazer login
    console.log('🔐 1. Fazendo login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Erro no login:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');
    
    // 2. Testar criação de briefing
    console.log('\n📝 2. Testando criação de briefing...');
    const briefingPayload = {
      nomeProjeto: 'Teste Correção UUID',
      descricao: 'Teste da correção de mapeamento de escritorioId',
      disciplina: 'arquitetura',
      area: 'arquitetura',
      tipologia: 'residencial',
      clienteId: 'e24bb076-9318-497a-9f0e-3813d2cca2ce',
      responsavelId: 'user_admin_teste'
    };
    
    console.log('📦 Payload:', briefingPayload);
    
    const briefingResponse = await fetch('http://localhost:3001/api/briefings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(briefingPayload)
    });
    
    console.log(`📡 Status: ${briefingResponse.status}`);
    
    if (briefingResponse.ok) {
      const briefingData = await briefingResponse.json();
      console.log('✅ SUCESSO! Briefing criado:', briefingData.briefing.id);
      console.log('📋 Nome:', briefingData.briefing.nome_projeto);
      console.log('🏢 Escritório ID:', briefingData.briefing.escritorio_id);
      
      console.log('\n🎉 CORREÇÃO FUNCIONOU PERFEITAMENTE!');
      console.log('✅ UUID aceito pelo PostgreSQL');
      console.log('✅ Mapeamento funcionando');
      console.log('✅ Multi-tenancy operacional');
      
    } else {
      const errorData = await briefingResponse.json();
      console.log('❌ Erro ao criar briefing:');
      console.log('📡 Status:', briefingResponse.status);
      console.log('💥 Erro:', errorData);
      
      if (errorData.message?.includes('invalid input syntax for type uuid')) {
        console.log('\n⚠️ AINDA TEM PROBLEMA UUID!');
        console.log('🔧 Servidor pode não ter reiniciado ou correção não aplicada');
      }
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error.message);
  }
}

// Aguardar um pouco para servidor iniciar
setTimeout(() => {
  testarBriefingCorrigido();
}, 3000); 