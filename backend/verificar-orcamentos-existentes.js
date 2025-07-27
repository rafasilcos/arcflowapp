/**
 * 🔍 VERIFICAR ORÇAMENTOS EXISTENTES
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarOrcamentos() {
  await connectDatabase();
  const client = getClient();
  
  try {
    // Contar orçamentos
    const countResult = await client.query('SELECT COUNT(*) as total FROM orcamentos WHERE deleted_at IS NULL');
    const total = parseInt(countResult.rows[0].total);
    
    console.log(`📊 Total de orçamentos: ${total}`);
    
    if (total > 0) {
      // Listar orçamentos
      const result = await client.query(`
        SELECT 
          id, codigo, nome, status, valor_total, 
          briefing_id, created_at
        FROM orcamentos 
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 10
      `);
      
      console.log('\n💰 ORÇAMENTOS EXISTENTES:');
      console.log('==================================================');
      
      result.rows.forEach((orcamento, index) => {
        console.log(`${index + 1}. ${orcamento.nome}`);
        console.log(`   ID: ${orcamento.id}`);
        console.log(`   Código: ${orcamento.codigo}`);
        console.log(`   Status: ${orcamento.status}`);
        console.log(`   Valor: R$ ${orcamento.valor_total?.toLocaleString('pt-BR') || 'N/A'}`);
        console.log(`   Briefing ID: ${orcamento.briefing_id}`);
        console.log(`   Criado: ${new Date(orcamento.created_at).toLocaleString('pt-BR')}`);
        console.log('');
      });
    }
    
    // Verificar briefings sem orçamento
    const briefingsSemOrcamento = await client.query(`
      SELECT 
        b.id, b.nome_projeto, b.status, b.progresso
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id AND o.deleted_at IS NULL
      WHERE b.deleted_at IS NULL 
        AND o.id IS NULL
        AND b.status IN ('CONCLUIDO', 'APROVADO', 'EM_ANDAMENTO')
      ORDER BY b.updated_at DESC
    `);
    
    console.log(`\n📋 Briefings sem orçamento: ${briefingsSemOrcamento.rows.length}`);
    
    if (briefingsSemOrcamento.rows.length > 0) {
      console.log('\n📝 BRIEFINGS DISPONÍVEIS PARA ORÇAMENTO:');
      console.log('==================================================');
      
      briefingsSemOrcamento.rows.forEach((briefing, index) => {
        console.log(`${index + 1}. ${briefing.nome_projeto}`);
        console.log(`   ID: ${briefing.id}`);
        console.log(`   Status: ${briefing.status}`);
        console.log(`   Progresso: ${briefing.progresso}%`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarOrcamentos();