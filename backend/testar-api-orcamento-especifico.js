/**
 * 🧪 TESTE: API BACKEND ORÇAMENTO 61
 * 
 * Testar diretamente no backend se a rota está funcionando
 */

const axios = require('axios');

async function testarAPIBackend() {
  console.log('🧪 TESTANDO API BACKEND - ORÇAMENTO 61\n');
  
  try {
    // Primeiro, fazer login para obter token válido
    console.log('🔐 Fazendo login...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    console.log('Resposta do login:', loginResponse.data);
    
    if (!loginResponse.data.token && !loginResponse.data.tokens) {
      throw new Error(`Falha no login: ${loginResponse.data.message || 'Token não encontrado'}`);
    }
    
    const token = loginResponse.data.token || loginResponse.data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');
    
    // Agora buscar o orçamento 61
    console.log('🔍 Buscando orçamento ID 61...');
    
    const response = await axios.get('http://localhost:3001/api/orcamentos/61', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Resposta recebida:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success && response.data.data) {
      const orcamento = response.data.data;
      
      console.log('\n📊 DADOS REAIS RETORNADOS PELA API:');
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
      console.log('=' .repeat(60));
      
      // Verificar cronograma
      if (orcamento.cronograma) {
        const cronograma = typeof orcamento.cronograma === 'string' 
          ? JSON.parse(orcamento.cronograma) 
          : orcamento.cronograma;
        
        console.log('\n📅 CRONOGRAMA:');
        console.log(`Prazo Total: ${cronograma.prazoTotal} semanas`);
        console.log(`Metodologia: ${cronograma.metodologia}`);
        
        if (cronograma.fases) {
          console.log('\nFases:');
          Object.values(cronograma.fases).forEach((fase, index) => {
            console.log(`${index + 1}. ${fase.nome}: ${fase.prazo} semanas`);
          });
        }
      }
      
      console.log('\n🎯 RESUMO DOS DADOS REAIS:');
      const valorTotal = parseFloat(orcamento.valor_total || 0);
      const prazoTotal = orcamento.cronograma ? 
        (typeof orcamento.cronograma === 'string' ? JSON.parse(orcamento.cronograma) : orcamento.cronograma).prazoTotal : 0;
      
      console.log(`💰 Valor Total: R$ ${valorTotal.toLocaleString('pt-BR')}`);
      console.log(`⏱️ Prazo Total: ${prazoTotal} semanas`);
      console.log(`📐 Área: ${orcamento.area_construida}m²`);
      console.log(`💵 Valor/m²: R$ ${(valorTotal / orcamento.area_construida).toFixed(2)}/m²`);
      
      console.log('\n✅ CONCLUSÃO:');
      console.log('- API backend está funcionando corretamente');
      console.log('- Dados reais estão sendo retornados do banco');
      console.log('- Frontend deve usar EXATAMENTE estes valores');
      console.log('- Não deve haver dados mockados ou hardcoded');
      
    } else {
      console.log('❌ API retornou erro:', response.data);
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testarAPIBackend()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 FALHA:', error);
    process.exit(1);
  });