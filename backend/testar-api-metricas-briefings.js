const http = require('http');

// Função para fazer requisição HTTP
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function testarApiMetricasBriefings() {
  try {
    console.log('🔄 TESTANDO API DE MÉTRICAS DE BRIEFINGS');
    console.log('=========================================');

    // 1. Fazer login para obter token
    console.log('\n1. 🔐 Fazendo login...');
    const loginData = JSON.stringify({
      email: 'rafaelcosta.engenheiro@gmail.com',
      password: '123456'
    });

    const loginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const loginResponse = await makeRequest(loginOptions, loginData);
    
    if (loginResponse.status !== 200) {
      console.error('❌ Erro no login:', loginResponse);
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Testar API de métricas
    console.log('\n2. 📊 Testando API de métricas...');
    const metricasOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/briefings/dashboard/metricas',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const metricasResponse = await makeRequest(metricasOptions);
    
    if (metricasResponse.status !== 200) {
      console.error('❌ Erro na API de métricas:', metricasResponse);
      return;
    }

    console.log('✅ Métricas obtidas com sucesso:');
    console.log('🔍 Resposta completa:', JSON.stringify(metricasResponse.data, null, 2));
    
    const metricas = metricasResponse.data.data;
    console.log('');
    console.log('📊 MÉTRICAS DETALHADAS:');
    console.log('========================');
    console.log(`📋 Total de briefings: ${metricas.totalBriefings}`);
    console.log(`🔥 Briefings ativos: ${metricas.briefingsAtivos}`);
    console.log(`✅ Briefings concluídos: ${metricas.briefingsConcluidos}`);
    console.log(`📝 Briefings com respostas: ${metricas.briefingsComRespostas}`);
    console.log(`🤖 Score médio IA: ${metricas.scoreMediaIA}%`);
    console.log(`⏱️ Tempo médio preenchimento: ${metricas.tempoMedioPreenchimento} min`);
    
    console.log('\n📊 Distribuição por status:');
    Object.entries(metricas.statusDistribution).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    // 3. Testar API de listagem de briefings
    console.log('\n3. 📋 Testando listagem de briefings...');
    const briefingsOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/briefings',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const briefingsResponse = await makeRequest(briefingsOptions);
    
    if (briefingsResponse.status !== 200) {
      console.error('❌ Erro na API de briefings:', briefingsResponse);
      return;
    }

    const briefings = briefingsResponse.data.briefings;
    console.log(`✅ ${briefings.length} briefings encontrados:`);
    
    briefings.forEach((briefing, index) => {
      console.log(`${index + 1}. ${briefing.nomeProjeto}`);
      console.log(`   Status: ${briefing.status}`);
      console.log(`   Tipologia: ${briefing.tipologia || 'Não definida'}`);
      console.log(`   Criado: ${new Date(briefing.createdAt).toLocaleDateString('pt-BR')}`);
      console.log('');
    });

    console.log('🎯 RESULTADO FINAL:');
    console.log('===================');
    console.log(`✅ API funcionando corretamente`);
    console.log(`📊 Briefings ativos no card: ${metricas.briefingsAtivos}`);
    console.log(`📋 Total de briefings: ${briefings.length}`);

    // Verificar se os números batem
    const ativosReais = briefings.filter(b => 
      b.status === 'RASCUNHO' || 
      b.status === 'EM_ANDAMENTO' || 
      b.status === 'ORCAMENTO_ELABORACAO'
    ).length;

    console.log(`🔍 Briefings ativos calculados: ${ativosReais}`);
    
    if (metricas.briefingsAtivos === ativosReais) {
      console.log('✅ Contagem está correta!');
    } else {
      console.log('❌ Há discrepância na contagem');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testarApiMetricasBriefings();