const { getClient, connectDatabase } = require('./config/database');

async function verificarBriefings() {
  try {
    await connectDatabase();
    const client = getClient();
    
    console.log('📋 TODOS OS BRIEFINGS NO BANCO:');
    console.log('='.repeat(50));
    
    const result = await client.query(`
      SELECT 
        id, nome_projeto, status, tipologia, disciplina, 
        created_at, deleted_at
      FROM briefings 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Nenhum briefing encontrado no banco');
    } else {
      result.rows.forEach((b, i) => {
        console.log(`${i+1}. ${b.nome_projeto}`);
        console.log(`   ID: ${b.id}`);
        console.log(`   Status: ${b.status}`);
        console.log(`   Tipologia: ${b.tipologia || 'N/A'}`);
        console.log(`   Deleted: ${b.deleted_at ? 'SIM' : 'NÃO'}`);
        console.log('');
      });
      
      // Contar por status
      console.log('📊 BRIEFINGS POR STATUS:');
      const statusCount = await client.query(`
        SELECT status, COUNT(*) as total
        FROM briefings 
        WHERE deleted_at IS NULL
        GROUP BY status
        ORDER BY total DESC
      `);
      
      statusCount.rows.forEach(row => {
        console.log(`   ${row.status}: ${row.total}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

verificarBriefings();