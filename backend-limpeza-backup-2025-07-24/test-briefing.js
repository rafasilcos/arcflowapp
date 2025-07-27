// Teste rápido para verificar se o briefing existe no banco
const { PrismaClient } = require('@prisma/client');

async function testBriefing() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testando briefing ID: 9185d1ae-827a-4efb-984b-7eacf47559d9');
    
    const briefing = await prisma.briefing.findUnique({
      where: { id: '9185d1ae-827a-4efb-984b-7eacf47559d9' },
      include: {
        respostas: true,
        cliente: true
      }
    });
    
    if (briefing) {
      console.log('✅ Briefing encontrado:');
      console.log('  - Nome:', briefing.nomeProjeto);
      console.log('  - Status:', briefing.status);
      console.log('  - Total respostas:', briefing.respostas?.length || 0);
      console.log('  - Cliente:', briefing.cliente?.nome || 'N/A');
      
      if (briefing.respostas && briefing.respostas.length > 0) {
        console.log('  - Primeiras 3 respostas:');
        briefing.respostas.slice(0, 3).forEach((r, i) => {
          console.log(`    ${i + 1}. ID: ${r.perguntaId}, Resposta: ${r.resposta?.substring(0, 50)}...`);
        });
      }
    } else {
      console.log('❌ Briefing não encontrado');
      
      // Listar briefings disponíveis
      const briefings = await prisma.briefing.findMany({
        take: 5,
        select: {
          id: true,
          nomeProjeto: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log('📋 Briefings disponíveis:');
      briefings.forEach(b => {
        console.log(`  - ${b.id} | ${b.nomeProjeto} | ${b.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testBriefing(); 