const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

// ID do briefing que está retornando 404
const BRIEFING_ID = 'ec8b516f-4681-4f91-b861-eb0a3e68d5e9';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2NzM4OWJjLTcwMDctNGRkMi04MDdkLWM5NTlmN2RiMGNlYyIsImVtYWlsIjoicmFmYWVsLmNvc3RhQGFyY2Zsb3cuY29tLmJyIiwiZXNjcml0b3Jpb0lkIjoiNjFjYzRiN2EtOGIzZS00NmVhLWJmMzctZGRiOTc5NWM2MmZkIiwiaWF0IjoxNzM2NDM1MjI3fQ.LkzZvBPQHUfRBrBiLvJf9g2r8u8QjfBJ5f1WAQK5IpA'; // Coloque seu token aqui

async function testarBriefing() {
  console.log('🧪 TESTE: Verificar Briefing no Banco');
  console.log('=====================================');
  console.log('ID:', BRIEFING_ID);
  console.log('');

  try {
    // 1. Verificar se briefing existe no banco
    console.log('1. 🔍 Verificando se briefing existe no banco...');
    
    const briefing = await prisma.briefing.findFirst({
      where: { 
        id: BRIEFING_ID
      },
      select: {
        id: true,
        nome_projeto: true,
        status: true,
        progresso: true,
        disciplina: true,
        area: true,
        tipologia: true,
        escritorio_id: true,
        metadata: true,
        observacoes: true
      }
    });

    if (!briefing) {
      console.log('❌ BRIEFING NÃO ENCONTRADO NO BANCO');
      return;
    }

    console.log('✅ Briefing encontrado:');
    console.log('   - ID:', briefing.id);
    console.log('   - Nome:', briefing.nome_projeto);
    console.log('   - Status:', briefing.status);
    console.log('   - Progresso:', briefing.progresso);
    console.log('   - Escritório:', briefing.escritorio_id);
    console.log('   - Metadata presente:', !!briefing.metadata);
    console.log('   - Observações presente:', !!briefing.observacoes);
    console.log('');

    // 2. Verificar metadata
    if (briefing.metadata) {
      console.log('2. 🔍 Verificando metadata...');
      console.log('   - Tipo:', typeof briefing.metadata);
      
      if (typeof briefing.metadata === 'object') {
        const metadata = briefing.metadata;
        console.log('   - Chaves:', Object.keys(metadata));
        
        if (metadata.respostas) {
          console.log('   - Respostas encontradas:', Object.keys(metadata.respostas).length);
          console.log('   - Primeiras 3 respostas:');
          Object.entries(metadata.respostas).slice(0, 3).forEach(([key, value]) => {
            console.log(`     ${key}: ${value}`);
          });
        } else {
          console.log('   - ❌ Campo "respostas" não encontrado no metadata');
        }
      }
      console.log('');
    }

    // 3. Verificar observações
    if (briefing.observacoes) {
      console.log('3. 🔍 Verificando observações...');
      
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        console.log('   - Observações parseadas com sucesso');
        console.log('   - Chaves:', Object.keys(observacoes));
        
        if (observacoes.respostas) {
          console.log('   - Respostas encontradas:', Object.keys(observacoes.respostas).length);
        } else {
          console.log('   - ❌ Campo "respostas" não encontrado nas observações');
        }
      } catch (error) {
        console.log('   - ❌ Erro ao parsear observações:', error.message);
      }
      console.log('');
    }

    // 4. Verificar tabela briefing_respostas
    console.log('4. 🔍 Verificando tabela briefing_respostas...');
    
    const respostasTabela = await prisma.briefingResposta.findMany({
      where: {
        briefingId: BRIEFING_ID
      },
      select: {
        id: true,
        perguntaId: true,
        resposta: true,
        briefingTemplateId: true
      }
    });

    if (respostasTabela.length > 0) {
      console.log('   ✅ Respostas encontradas na tabela:', respostasTabela.length);
      console.log('   - Primeiras 3 respostas:');
      respostasTabela.slice(0, 3).forEach(resposta => {
        console.log(`     ${resposta.perguntaId}: ${resposta.resposta}`);
      });
    } else {
      console.log('   ❌ Nenhuma resposta encontrada na tabela briefing_respostas');
    }
    console.log('');

    // 5. Testar API diretamente
    console.log('5. 🔍 Testando API...');
    
    const response = await fetch(`http://localhost:3001/api/briefings/${BRIEFING_ID}/respostas`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('   - Status:', response.status);
    console.log('   - Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ API funcionando!');
      console.log('   - Total respostas:', data.totalRespostas);
      console.log('   - Fonte:', data.fonte);
      console.log('   - Chaves:', Object.keys(data));
    } else {
      const errorText = await response.text();
      console.log('   ❌ API retornou erro:');
      console.log('   - Erro:', errorText.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste
testarBriefing(); 