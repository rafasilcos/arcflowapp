const axios = require('axios');

async function testarRotaSalvarCompleto() {
  console.log('🧪 Testando rota /api/briefings/salvar-completo...');
  
  try {
    console.log('1️⃣ Testando se a rota existe...');
    
    const dadosTeste = {
      nomeProjeto: 'Briefing Teste - 03/07/2025',
      clienteId: null,
      briefingTemplate: {
        id: 'teste',
        nome: 'Teste',
        categoria: 'residencial',
        totalPerguntas: 1
      },
      respostas: {
        1: 'teste'
      },
      metadados: {
        totalRespostas: 1,
        progresso: 100
      }
    };
    
    const response = await axios.post('http://localhost:3001/api/briefings/salvar-completo', dadosTeste, {
      headers: { 'Content-Type': 'application/json' }
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
        console.log('\n✅ ROTA EXISTE! Erro 401 é esperado (não autenticado)');
        console.log('   A API está funcionando corretamente');
        return true;
      } else if (response.status === 400) {
        console.log('\n❌ ERRO 400: Dados inválidos');
        console.log('   Detalhes:', response.data);
        return false;
      } else if (response.status === 500) {
        console.log('\n❌ ERRO 500: Erro interno do servidor');
        console.log('   Detalhes:', response.data);
        return false;
      } else {
        console.log('\n❌ ERRO DESCONHECIDO:', response.status);
        return false;
      }
    } else {
      console.log('✅ SUCESSO INESPERADO:', response.data);
      return true;
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    return false;
  }
}

testarRotaSalvarCompleto().then(resultado => {
  console.log('\n🏁 Teste concluído!');
  if (resultado) {
    console.log('✅ API está funcionando');
  } else {
    console.log('❌ API tem problemas');
  }
}); 