const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function adicionarColunasBriefing() {
  console.log('🔄 Iniciando migração para adicionar colunas no briefing...');
  
  try {
    // Verificar se as colunas já existem
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('disciplina', 'area', 'tipologia');
    `;
    
    console.log('📊 Colunas existentes:', result);
    
    // Adicionar as colunas se não existirem
    const existingColumns = result.map(row => row.column_name);
    
    if (!existingColumns.includes('disciplina')) {
      console.log('➕ Adicionando coluna disciplina...');
      await prisma.$executeRaw`
        ALTER TABLE briefings 
        ADD COLUMN disciplina VARCHAR(255);
      `;
    }
    
    if (!existingColumns.includes('area')) {
      console.log('➕ Adicionando coluna area...');
      await prisma.$executeRaw`
        ALTER TABLE briefings 
        ADD COLUMN area VARCHAR(255);
      `;
    }
    
    if (!existingColumns.includes('tipologia')) {
      console.log('➕ Adicionando coluna tipologia...');
      await prisma.$executeRaw`
        ALTER TABLE briefings 
        ADD COLUMN tipologia VARCHAR(255);
      `;
    }
    
    // Criar índices para performance
    console.log('📈 Criando índices para performance...');
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_briefings_disciplina 
        ON briefings(disciplina);
      `;
      
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_briefings_area 
        ON briefings(area);
      `;
      
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_briefings_tipologia 
        ON briefings(tipologia);
      `;
      
      console.log('✅ Índices criados com sucesso!');
    } catch (indexError) {
      console.log('⚠️  Erro ao criar índices (podem já existir):', indexError.message);
    }
    
    // Verificar resultado final
    const finalResult = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('disciplina', 'area', 'tipologia')
      ORDER BY column_name;
    `;
    
    console.log('✅ Migração concluída! Colunas adicionadas:');
    console.table(finalResult);
    
    // Testar uma inserção
    console.log('🧪 Testando inserção com novos campos...');
    
    const testResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total_briefings FROM briefings;
    `;
    
    console.log('📊 Total de briefings na tabela:', testResult[0].total_briefings);
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Reiniciar o servidor backend');
    console.log('2. Testar criação de novo briefing');
    console.log('3. Verificar se os templates corretos são carregados');
    
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração
adicionarColunasBriefing()
  .then(() => {
    console.log('✅ Script executado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  }); 