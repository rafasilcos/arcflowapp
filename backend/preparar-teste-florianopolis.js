const { getClient, connectDatabase } = require('./config/database');

async function prepararTeste() {
  try {
    await connectDatabase();
    const client = getClient();
    
    const briefingId = '947cbfa7-00db-4bda-b86b-033aa665dae5';
    
    // Resetar status do Casa Florianopolis para CONCLUIDO
    await client.query('UPDATE briefings SET status = $1 WHERE id = $2', 
      ['CONCLUIDO', briefingId]);
    
    // Deletar orçamento existente para poder gerar novo
    await client.query('DELETE FROM orcamentos WHERE briefing_id = $1', 
      [briefingId]);
    
    console.log('✅ Casa Florianopolis preparado para teste');
    console.log('📋 Status: CONCLUIDO');
    console.log('💰 Orçamentos existentes: REMOVIDOS');
    
    // Mostrar dados do briefing
    const result = await client.query(`
      SELECT nome_projeto, descricao, objetivos, observacoes
      FROM briefings 
      WHERE id = $1
    `, [briefingId]);
    
    const briefing = result.rows[0];
    console.log('\n📝 DADOS DO BRIEFING:');
    console.log(`Nome: ${briefing.nome_projeto}`);
    console.log(`Descrição: ${briefing.descricao || 'N/A'}`);
    console.log(`Objetivos: ${briefing.objetivos || 'N/A'}`);
    
    if (briefing.observacoes) {
      console.log('\nRespostas:');
      try {
        const obs = JSON.parse(briefing.observacoes);
        if (obs.respostas) {
          Object.entries(obs.respostas).forEach(([k, v]) => {
            if (v && v.toString().trim()) {
              console.log(`  ${k}: ${v}`);
            }
          });
        }
      } catch (e) {
        console.log('  (Erro ao parsear respostas)');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

prepararTeste();