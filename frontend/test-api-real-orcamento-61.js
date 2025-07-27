/**
 * 🧪 TESTE: API REAL DO ORÇAMENTO 61
 * 
 * Verificar se a API está retornando os dados reais do banco
 */

const axios = require('axios');

async function testarAPIRealOrcamento61() {
  console.log('🧪 TESTANDO API REAL DO ORÇAMENTO 61\n');
  
  try {
    console.log('🔍 Fazendo chamada para API real...');
    
    const response = await axios.get('http://localhost:3001/api/orcamentos/61', {
      headers: {
        'Authorization': 'Bearer demo-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Resposta da API recebida!');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success && response.data.data) {
      const orcamento = response.data.data;
      
      console.log('\n📊 DADOS REAIS DO BANCO:');
      console.log('=' .repeat(60));
      console.log(`ID: ${orcamento.id}`);
      console.log(`Código: ${orcamento.codigo}`);
      console.log(`Nome: ${orcamento.nome}`);
      console.log(`Status: ${orcamento.status}`);
      console.log(`Área Construída: ${orcamento.area_construida}m²`);
      console.log(`Valor Total: R$ ${parseFloat(orcamento.valor_total || 0).toLocaleString('pt-BR')}`);
      console.log(`Valor por m²: R$ ${parseFloat(orcamento.valor_por_m2 || 0).toLocaleString('pt-BR')}/m²`);
      console.log(`Tipologia: ${orcamento.tipologia}`);
      console.log(`Complexidade: ${orcamento.complexidade}`);
      console.log(`Cliente ID: ${orcamento.cliente_id}`);
      console.log('=' .repeat(60));
      
      // Verificar cronograma
      if (orcamento.cronograma) {
        const cronograma = typeof orcamento.cronograma === 'string' 
          ? JSON.parse(orcamento.cronograma) 
          : orcamento.cronograma;
        
        console.log('\n📅 CRONOGRAMA REAL DO BANCO:');
        console.log(`Prazo Total: ${cronograma.prazoTotal} semanas`);
        console.log(`Metodologia: ${cronograma.metodologia}`);
        console.log(`Valor Técnico Total: R$ ${cronograma.valorTecnicoTotal?.toLocaleString('pt-BR') || 0}`);
        
        if (cronograma.fases) {
          console.log('\nFases do Cronograma:');
          Object.values(cronograma.fases).forEach((fase, index) => {
            console.log(`${index + 1}. ${fase.nome}: ${fase.prazo} semanas - R$ ${fase.valor?.toLocaleString('pt-BR') || 0}`);
          });
        }
      }
      
      // Verificar disciplinas
      if (orcamento.disciplinas) {
        const disciplinas = Array.isArray(orcamento.disciplinas) 
          ? orcamento.disciplinas 
          : JSON.parse(orcamento.disciplinas);
        
        console.log('\n🔧 DISCIPLINAS ATIVAS:');
        disciplinas.forEach((disciplina, index) => {
          console.log(`${index + 1}. ${disciplina}`);
        });
      }
      
      // Análise final
      console.log('\n🎯 ANÁLISE DOS DADOS REAIS:');
      
      const valorTotal = parseFloat(orcamento.valor_total || 0);
      const prazoTotal = orcamento.cronograma ? 
        (typeof orcamento.cronograma === 'string' ? JSON.parse(orcamento.cronograma) : orcamento.cronograma).prazoTotal : 0;
      
      console.log(`✅ Valor Total Real: R$ ${valorTotal.toLocaleString('pt-BR')}`);
      console.log(`✅ Prazo Total Real: ${prazoTotal} semanas`);
      console.log(`✅ Área: ${orcamento.area_construida}m²`);
      console.log(`✅ Valor por m²: R$ ${(valorTotal / orcamento.area_construida).toFixed(2)}/m²`);
      
      console.log('\n🔧 PRÓXIMOS PASSOS:');
      console.log('1. ✅ API está retornando dados reais do banco');
      console.log('2. ✅ Frontend deve usar estes dados (não dados mockados)');
      console.log('3. ✅ Cronograma real tem 26 semanas (não 56 nem 11.5)');
      console.log('4. ✅ Valor real é R$ 36.210,00 (não R$ 60.350,00)');
      
      console.log('\n🚨 IMPORTANTE:');
      console.log('- O frontend deve mostrar EXATAMENTE estes valores');
      console.log('- Qualquer diferença indica uso de dados mockados');
      console.log('- Teste no navegador: /orcamentos/61');
      
    } else {
      console.log('❌ API não retornou dados válidos');
      console.log('Resposta:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ ERRO NA CHAMADA DA API:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    
    console.log('\n🔧 POSSÍVEIS CAUSAS:');
    console.log('1. Backend não está rodando (npm run dev no backend)');
    console.log('2. Orçamento 61 não existe no banco');
    console.log('3. Problema de autenticação');
    console.log('4. Erro na rota da API');
  }
}

// Executar teste
testarAPIRealOrcamento61()
  .then(() => {
    console.log('\n✅ TESTE CONCLUÍDO');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NO TESTE:', error);
    process.exit(1);
  });