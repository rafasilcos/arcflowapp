const fetch = require('node-fetch');

async function testarRotaRespostas() {
  console.log('🔍 Testando rota de respostas...');
  
  const briefingId = 'f777e9c8-6e7f-4b51-afa5-beaf984f0f71';
  const token = 'test-token'; // Temporário para teste
  
  try {
    // 1. Testar sem autenticação (deve dar erro 401)
    console.log('📡 Testando sem autenticação...');
    const responseSemAuth = await fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`);
    console.log('Status sem auth:', responseSemAuth.status);
    
    // 2. Testar com token
    console.log('📡 Testando com token...');
    const responseComAuth = await fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status com auth:', responseComAuth.status);
    
    if (responseComAuth.ok) {
      const data = await responseComAuth.json();
      console.log('✅ Respostas recebidas:', {
        totalRespostas: data.totalRespostas,
        fonte: data.fonte,
        respostasOrganizadas: Object.keys(data.respostas || {}).length,
        respostasPorId: Object.keys(data.respostasPorId || {}).length,
        respostasParaEdicao: Object.keys(data.respostasParaEdicao || {}).length
      });
      
      // Mostrar algumas respostas como exemplo
      if (data.respostasParaEdicao) {
        console.log('📝 Exemplos de respostas para edição:');
        Object.entries(data.respostasParaEdicao).slice(0, 3).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
      
      return data;
    } else {
      const errorText = await responseComAuth.text();
      console.log('❌ Erro na resposta:', errorText);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar rota:', error.message);
    return null;
  }
}

// Também testar busca do briefing
async function testarBriefing() {
  console.log('\n🔍 Testando busca do briefing...');
  
  const briefingId = 'f777e9c8-6e7f-4b51-afa5-beaf984f0f71';
  const token = 'test-token';
  
  try {
    const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status briefing:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Briefing encontrado:', {
        id: data.briefing?.id,
        nome: data.briefing?.nomeProjeto,
        status: data.briefing?.status,
        progresso: data.briefing?.progresso,
        temMetadata: !!data.briefing?.metadata,
        metadata: data.briefing?.metadata ? Object.keys(data.briefing.metadata) : []
      });
      
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na busca do briefing:', errorText);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar briefing:', error.message);
    return null;
  }
}

// Executar testes
async function executarTestes() {
  console.log('🚀 Iniciando testes de respostas do briefing...\n');
  
  // Testar briefing primeiro
  const briefingData = await testarBriefing();
  
  // Depois testar respostas
  const respostasData = await testarRotaRespostas();
  
  console.log('\n📊 Resumo dos testes:');
  console.log('Briefing encontrado:', !!briefingData);
  console.log('Respostas encontradas:', !!respostasData);
  
  if (respostasData) {
    console.log(`Total de respostas: ${respostasData.totalRespostas}`);
    console.log(`Fonte das respostas: ${respostasData.fonte}`);
  }
  
  if (!briefingData) {
    console.log('\n❌ PROBLEMA: Briefing não encontrado!');
    console.log('Verifique se o ID está correto e se o servidor está rodando.');
  }
  
  if (!respostasData) {
    console.log('\n❌ PROBLEMA: Respostas não encontradas!');
    console.log('Verifique se as respostas foram salvas corretamente.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarTestes();
}

module.exports = {
  testarRotaRespostas,
  testarBriefing,
  executarTestes
}; 