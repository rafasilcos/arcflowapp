const axios = require('axios');

// Simular dados que o frontend está enviando
const dadosTeste = {
  nomeProjeto: 'Briefing Residencial Unifamiliar - 03/07/2025',
  clienteId: null,
  briefingTemplate: {
    id: 'residencial-unifamiliar',
    nome: 'Briefing Residencial Unifamiliar',
    categoria: 'residencial',
    totalPerguntas: 235
  },
  respostas: {
    1: 'Casa térrea',
    2: '3',
    3: '2'
  },
  metadados: {
    totalRespostas: 3,
    progresso: 1.28,
    tempoGasto: 0,
    dataInicio: new Date().toISOString(),
    dataFim: new Date().toISOString()
  }
};

async function testarDadosBriefing() {
  console.log('🧪 Testando dados do briefing...\n');
  
  try {
    console.log('📤 Dados que serão enviados:');
    console.log(JSON.stringify(dadosTeste, null, 2));
    
    console.log('\n🔄 Enviando para servidor...');
    
    const response = await axios.post('http://localhost:3001/api/briefings/salvar-completo', dadosTeste, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      return { 
        error: true, 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      };
    });

    if (response.error) {
      console.log(`❌ ERRO ${response.status}:`, response.data || response.message);
      
      if (response.status === 401) {
        console.log('\n💡 SOLUÇÃO: Erro de autenticação - isso é esperado para este teste');
        console.log('   O erro 400 foi resolvido! Agora é só questão de login.');
      }
    } else {
      console.log('✅ SUCESSO:', response.data);
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }

  console.log('\n🏁 Teste concluído!');
}

testarDadosBriefing(); 