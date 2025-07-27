const axios = require('axios');

console.log('🧪 TESTANDO API DE BRIEFINGS...\n');

async function testarApiBriefings() {
  try {
    // 1. Primeiro, fazer login para obter token
    console.log('🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'rafael@teste.com',
      password: '123456'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Login realizado com sucesso');

    // 2. Testar criação de briefing
    console.log('\n📝 Testando criação de briefing...');
    const briefingData = {
      nomeProjeto: 'Casa Teste ArcFlow',
      descricao: 'Projeto residencial para teste da API',
      disciplina: 'Arquitetura',
      area: 'Residencial',
      tipologia: 'Unifamiliar'
    };

    const createResponse = await axios.post('http://localhost:3001/api/briefings', briefingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Briefing criado com sucesso!');
    console.log('📋 Dados do briefing:', createResponse.data.briefing);

    // 3. Testar listagem de briefings
    console.log('\n📋 Testando listagem de briefings...');
    const listResponse = await axios.get('http://localhost:3001/api/briefings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Listagem realizada com sucesso!');
    console.log(`📊 Total de briefings: ${listResponse.data.briefings.length}`);
    
    if (listResponse.data.briefings.length > 0) {
      console.log('\n📝 Briefings encontrados:');
      listResponse.data.briefings.forEach((briefing, index) => {
        console.log(`  ${index + 1}. ${briefing.nome_projeto} - ${briefing.disciplina}/${briefing.area}/${briefing.tipologia}`);
      });
    }

    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ API de briefings está funcionando perfeitamente!');

  } catch (error) {
    console.error('❌ ERRO no teste:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 Problema de autenticação - verifique as credenciais');
    } else if (error.response?.status === 404) {
      console.log('\n🔍 Rota não encontrada - verifique se o backend está rodando');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔍 Conexão recusada - verifique se o backend está rodando na porta 3001');
    }
  }
}

testarApiBriefings(); 