const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'arcflow_db',
  user: 'postgres',
  password: '123456'
});

async function verificarStatusBriefings() {
  try {
    console.log('🔍 VERIFICANDO STATUS DOS BRIEFINGS\n');
    
    // Buscar todos os briefings e seus status
    const briefingsResult = await pool.query(`
      SELECT 
        id,
        nome_projeto,
        status,
        progresso,
        created_at,
        updated_at
      FROM briefings 
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
      LIMIT 10
    `);
    
    if (briefingsResult.rows.length === 0) {
      console.log('❌ Nenhum briefing encontrado no banco de dados');
      return;
    }
    
    console.log('📋 BRIEFINGS ENCONTRADOS:\n');
    briefingsResult.rows.forEach((briefing, index) => {
      const statusIcon = briefing.status === 'CONCLUIDO' ? '✅' : 
                        briefing.status === 'APROVADO' ? '🎯' :
                        briefing.status === 'EM_ANDAMENTO' ? '⏳' :
                        briefing.status === 'RASCUNHO' ? '📝' : '❓';
      
      console.log(`${index + 1}. ${statusIcon} ${briefing.nome_projeto}`);
      console.log(`   ID: ${briefing.id}`);
      console.log(`   Status: ${briefing.status}`);
      console.log(`   Progresso: ${briefing.progresso}%`);
      console.log(`   Criado: ${new Date(briefing.created_at).toLocaleString('pt-BR')}`);
      console.log(`   Atualizado: ${new Date(briefing.updated_at).toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    // Contar briefings por status
    const statusCountResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as total
      FROM briefings 
      WHERE deleted_at IS NULL
      GROUP BY status
      ORDER BY total DESC
    `);
    
    console.log('📊 DISTRIBUIÇÃO POR STATUS:\n');
    statusCountResult.rows.forEach(row => {
      const statusIcon = row.status === 'CONCLUIDO' ? '✅' : 
                        row.status === 'APROVADO' ? '🎯' :
                        row.status === 'EM_ANDAMENTO' ? '⏳' :
                        row.status === 'RASCUNHO' ? '📝' : '❓';
      
      console.log(`   ${statusIcon} ${row.status}: ${row.total} briefing(s)`);
    });
    
    // Verificar briefings que podem gerar orçamento
    const briefingsParaOrcamento = await pool.query(`
      SELECT 
        id,
        nome_projeto,
        status
      FROM briefings 
      WHERE deleted_at IS NULL
      AND status IN ('CONCLUIDO', 'APROVADO')
      ORDER BY updated_at DESC
      LIMIT 5
    `);
    
    console.log('\n💰 BRIEFINGS DISPONÍVEIS PARA GERAR ORÇAMENTO:\n');
    if (briefingsParaOrcamento.rows.length === 0) {
      console.log('❌ Nenhum briefing com status CONCLUIDO ou APROVADO encontrado');
      console.log('💡 Para habilitar o botão "Gerar Orçamento", você precisa:');
      console.log('   1. Ter um briefing com status "CONCLUIDO" ou "APROVADO"');
      console.log('   2. Atualizar o status de um briefing existente');
    } else {
      briefingsParaOrcamento.rows.forEach((briefing, index) => {
        console.log(`${index + 1}. ✅ ${briefing.nome_projeto}`);
        console.log(`   ID: ${briefing.id}`);
        console.log(`   Status: ${briefing.status}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar briefings:', error.message);
  } finally {
    await pool.end();
  }
}

console.log('🚀 Iniciando verificação de status dos briefings...\n');
verificarStatusBriefings();