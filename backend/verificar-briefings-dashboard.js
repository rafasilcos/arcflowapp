const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarBriefings() {
  try {
    console.log('🔍 Verificando briefings no banco...');
    
    const briefings = await prisma.briefing.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        nomeProjeto: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('📊 Total de briefings encontrados:', briefings.length);
    
    if (briefings.length > 0) {
      console.log('\n📋 Briefings encontrados:');
      briefings.forEach((briefing, index) => {
        console.log(`${index + 1}. ${briefing.nomeProjeto} - Status: ${briefing.status} - Criado: ${briefing.createdAt.toLocaleDateString('pt-BR')}`);
      });
      
      // Verificar se há briefings deletados
      const briefingsDeletados = await prisma.briefing.count({
        where: {
          deletedAt: { not: null }
        }
      });
      
      console.log('\n🗑️ Briefings deletados:', briefingsDeletados);
      
      // Contar por status
      const statusCount = await prisma.briefing.groupBy({
        by: ['status'],
        where: {
          deletedAt: null
        },
        _count: {
          status: true
        }
      });
      
      console.log('\n📈 Contagem por status:');
      statusCount.forEach(item => {
        console.log(`  ${item.status}: ${item._count.status}`);
      });
    } else {
      console.log('✅ Nenhum briefing encontrado no banco');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar briefings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarBriefings();