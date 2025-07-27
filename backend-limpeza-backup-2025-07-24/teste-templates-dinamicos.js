const axios = require('axios');

// ===== TESTE DAS APIS DE TEMPLATES DINÂMICOS =====

const BASE_URL = 'http://localhost:3001/api/templates-dinamicos';

async function testarAPIs() {
  console.log('🧪 INICIANDO TESTES DAS APIS DE TEMPLATES DINÂMICOS');
  console.log('='.repeat(60));

  try {
    // 1. TESTE HEALTH CHECK
    console.log('\n1️⃣ Testando Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);

    // 2. TESTE DETECÇÃO DE NECESSIDADES
    console.log('\n2️⃣ Testando Detecção de Necessidades...');
    const briefingData = {
      tipologia: 'residencial',
      subtipo: 'unifamiliar',
      descricao: 'Casa de 3 quartos com área de lazer, piscina e jardim',
      area: 250,
      orcamento: 500000,
      prioridades: ['estrutural', 'instalacoes', 'paisagismo'],
      complexidade: 'media'
    };

    const deteccaoResponse = await axios.post(`${BASE_URL}/detectar`, {
      briefingData
    });
    console.log('✅ Detecção concluída:');
    console.log(`   Templates Principais: ${deteccaoResponse.data.data.templatesPrincipais.length}`);
    console.log(`   Templates Complementares: ${deteccaoResponse.data.data.templatesComplementares.length}`);
    console.log(`   Templates Opcionais: ${deteccaoResponse.data.data.templatesOpcionais.length}`);
    console.log(`   Complexidade: ${deteccaoResponse.data.data.complexidade}`);

    // 3. TESTE SIMULAÇÃO DE PROJETO
    console.log('\n3️⃣ Testando Simulação de Projeto...');
    const simulacaoResponse = await axios.post(`${BASE_URL}/simular`, {
      briefingData,
      configuracao: {
        incluirOpcionais: true,
        scoreMinimo: 0.6
      }
    });
    console.log('✅ Simulação concluída:');
    console.log(`   Total Atividades: ${simulacaoResponse.data.data.resumo.totalAtividades}`);
    console.log(`   Duração Estimada: ${simulacaoResponse.data.data.resumo.duracaoEstimada} dias`);
    console.log(`   Orçamento Estimado: R$ ${simulacaoResponse.data.data.resumo.orcamentoEstimado.toLocaleString()}`);

    // 4. TESTE GERAÇÃO DE PROJETO COMPLETO
    console.log('\n4️⃣ Testando Geração de Projeto Completo...');
    const projetoId = `test_${Date.now()}`;
    const projetoResponse = await axios.post(`${BASE_URL}/gerar-projeto`, {
      projetoId,
      briefingData,
      configuracao: {
        incluirOpcionais: true
      }
    });
    console.log('✅ Projeto gerado:');
    console.log(`   ID: ${projetoResponse.data.data.projetoComposto.id}`);
    console.log(`   Total Atividades: ${projetoResponse.data.data.projetoComposto.atividades.length}`);
    console.log(`   Orçamento Total: R$ ${projetoResponse.data.data.projetoComposto.orcamento.total.toLocaleString()}`);

    // 5. TESTE OBTER CRONOGRAMA
    console.log('\n5️⃣ Testando Obtenção de Cronograma...');
    const cronogramaResponse = await axios.get(`${BASE_URL}/cronograma/${projetoId}`);
    console.log('✅ Cronograma obtido:');
    console.log(`   Total Atividades: ${cronogramaResponse.data.data.metadados.totalAtividades}`);
    console.log(`   Duração Total: ${cronogramaResponse.data.data.metadados.duracaoTotal} dias`);

    // 6. TESTE OBTER PROJETO COMPLETO
    console.log('\n6️⃣ Testando Obtenção de Projeto Completo...');
    const projetoCompletoResponse = await axios.get(`${BASE_URL}/projeto/${projetoId}`);
    console.log('✅ Projeto obtido do cache:');
    console.log(`   Cached: ${projetoCompletoResponse.data.meta.cached}`);
    console.log(`   Response Time: ${projetoCompletoResponse.data.meta.responseTime}ms`);

    // 7. TESTE MÉTRICAS
    console.log('\n7️⃣ Testando Métricas do Sistema...');
    const metricasResponse = await axios.get(`${BASE_URL}/metricas`);
    console.log('✅ Métricas obtidas:');
    console.log(`   Templates Processados: ${metricasResponse.data.data.sistema.templatesProcessados}`);
    console.log(`   Taxa de Sucesso: ${(metricasResponse.data.data.sistema.taxaSucesso * 100).toFixed(1)}%`);

    console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.response?.data || error.message);
    console.log('\n💡 POSSÍVEIS CAUSAS:');
    console.log('   - Servidor não está rodando na porta 3001');
    console.log('   - Algum serviço (Templates Engine) com erro');
    console.log('   - Configuração de CORS ou middleware');
    console.log('\n🔧 SOLUÇÃO:');
    console.log('   1. Verificar se o servidor está rodando: npm run dev');
    console.log('   2. Verificar logs do servidor');
    console.log('   3. Verificar se todas as dependências estão instaladas');
  }
}

// Executar testes
testarAPIs(); 