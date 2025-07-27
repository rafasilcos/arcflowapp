// Análise da estrutura do briefing personalizado
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function analisarBriefingPersonalizado() {
  const briefingId = '9185d1ae-827a-4efb-984b-7eacf47559d9';
  
  console.log('🔍 Analisando briefing personalizado:', briefingId);
  console.log('==========================================');
  
  try {
    // 1. Verificar dados básicos do briefing
    console.log('1. 📋 DADOS BÁSICOS DO BRIEFING:');
    const briefing = await prisma.briefing.findUnique({
      where: { id: briefingId }
    });
    
    if (!briefing) {
      console.log('❌ Briefing não encontrado!');
      return;
    }
    
    console.log('✅ Briefing encontrado:');
    console.log('   - Nome:', briefing.nomeProjeto);
    console.log('   - Status:', briefing.status);
    console.log('   - Progresso:', briefing.progresso);
    console.log('   - Disciplina:', briefing.disciplina);
    console.log('   - Área:', briefing.area);
    console.log('   - Tipologia:', briefing.tipologia);
    
    // 2. Verificar se tem respostas na tabela briefing_respostas
    console.log('\n2. 🔍 RESPOSTAS NA TABELA PADRÃO (briefing_respostas):');
    try {
      const respostasTabela = await prisma.briefingResposta.findMany({
        where: { briefingId },
        include: {
          pergunta: {
            select: {
              id: true,
              titulo: true,
              tipo: true
            }
          }
        }
      });
      
      console.log('   - Total respostas encontradas:', respostasTabela.length);
      
      if (respostasTabela.length > 0) {
        console.log('   - Primeiras 3 respostas:');
        respostasTabela.slice(0, 3).forEach((r, i) => {
          console.log(`     ${i + 1}. Pergunta: ${r.pergunta?.titulo || 'N/A'}`);
          console.log(`        Resposta: ${r.resposta?.substring(0, 50)}...`);
        });
      } else {
        console.log('   ⚠️ Nenhuma resposta encontrada na tabela padrão');
      }
    } catch (error) {
      console.log('   ❌ Erro ao buscar na tabela briefing_respostas:', error.message);
    }
    
    // 3. Verificar se as respostas estão em outro campo (JSON)
    console.log('\n3. 🔍 CAMPOS JSON/DADOS ALTERNATIVOS:');
    
    // Verificar todos os campos do briefing que podem conter respostas
    const camposParaAnalisar = ['dados', 'respostas', 'metadata', 'configuracao'];
    
    for (const campo of camposParaAnalisar) {
      if (briefing[campo]) {
        console.log(`   ✅ Campo "${campo}" encontrado:`, typeof briefing[campo]);
        if (typeof briefing[campo] === 'object') {
          console.log(`      - Keys: ${Object.keys(briefing[campo]).length}`);
          console.log(`      - Primeiras keys:`, Object.keys(briefing[campo]).slice(0, 5));
        }
      }
    }
    
    // 4. Verificar briefing composto (se existir)
    console.log('\n4. 🔍 BRIEFING COMPOSTO (se existir):');
    try {
      const briefingComposto = await prisma.briefingComposto.findFirst({
        where: {
          briefingIds: {
            has: briefingId
          }
        }
      });
      
      if (briefingComposto) {
        console.log('   ✅ Briefing faz parte de um briefing composto');
        console.log('   - ID composto:', briefingComposto.id);
        console.log('   - Total briefings:', briefingComposto.briefingIds.length);
        console.log('   - Status:', briefingComposto.status);
      } else {
        console.log('   ℹ️ Briefing não faz parte de um briefing composto');
      }
    } catch (error) {
      console.log('   ⚠️ Tabela briefing_composto não existe ou erro:', error.message);
    }
    
    // 5. Buscar em todas as tabelas relacionadas
    console.log('\n5. 🔍 BUSCA ABRANGENTE POR RESPOSTAS:');
    
    // Tentar encontrar respostas em qualquer lugar
    const queryGeneral = `
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE column_name LIKE '%resposta%' 
         OR column_name LIKE '%answer%'
         OR column_name LIKE '%dados%'
      ORDER BY table_name;
    `;
    
    try {
      const tabelas = await prisma.$queryRawUnsafe(queryGeneral);
      console.log('   📊 Tabelas com campos relacionados a respostas:');
      tabelas.forEach(t => {
        console.log(`      - ${t.table_name}.${t.column_name}`);
      });
    } catch (error) {
      console.log('   ⚠️ Não foi possível executar query de metadados');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('\n🔧 PRÓXIMOS PASSOS:');
  console.log('1. Identificar onde as respostas estão sendo salvas');
  console.log('2. Adaptar a rota para buscar no local correto');
  console.log('3. Garantir compatibilidade com briefings personalizados');
}

analisarBriefingPersonalizado(); 