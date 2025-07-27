const { Client } = require('pg');

// Configuração do banco
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'arcflow_db',
  user: 'postgres',
  password: 'admin123'
});

async function testarMetricasBriefingsAtivos() {
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco PostgreSQL');

    // ID do escritório de teste
    const escritorioId = '4a012231-36ef-4168-848d-a43498a7efb9';

    console.log('\n📊 TESTANDO MÉTRICAS DE BRIEFINGS ATIVOS');
    console.log('==========================================');

    // 1. Contar total de briefings
    const totalResult = await client.query(`
      SELECT COUNT(*) as total 
      FROM briefings 
      WHERE escritorio_id = $1 AND deleted_at IS NULL
    `, [escritorioId]);

    const totalBriefings = parseInt(totalResult.rows[0]?.total || 0);
    console.log(`📋 Total de briefings: ${totalBriefings}`);

    // 2. Contar por status
    const statusResult = await client.query(`
      SELECT status, COUNT(*) as count
      FROM briefings 
      WHERE escritorio_id = $1 AND deleted_at IS NULL
      GROUP BY status
    `, [escritorioId]);

    console.log('\n📊 Briefings por status:');
    const statusDistribution = {};
    statusResult.rows.forEach(row => {
      statusDistribution[row.status] = parseInt(row.count);
      console.log(`   ${row.status}: ${row.count}`);
    });

    // 3. Calcular briefings ativos (NOVA LÓGICA)
    const briefingsAtivos = (statusDistribution['RASCUNHO'] || 0) + 
                           (statusDistribution['EM_ANDAMENTO'] || 0) + 
                           (statusDistribution['ORCAMENTO_ELABORACAO'] || 0);

    console.log(`\n✅ BRIEFINGS ATIVOS (CORRIGIDO): ${briefingsAtivos}`);
    console.log('   - RASCUNHO:', statusDistribution['RASCUNHO'] || 0);
    console.log('   - EM_ANDAMENTO:', statusDistribution['EM_ANDAMENTO'] || 0);
    console.log('   - ORCAMENTO_ELABORACAO:', statusDistribution['ORCAMENTO_ELABORACAO'] || 0);

    // 4. Briefings concluídos
    const briefingsConcluidos = statusDistribution['CONCLUIDO'] || 0;
    console.log(`\n✅ BRIEFINGS CONCLUÍDOS: ${briefingsConcluidos}`);

    // 5. Listar briefings ativos com detalhes
    console.log('\n📋 DETALHES DOS BRIEFINGS ATIVOS:');
    console.log('==================================');
    
    const briefingsAtivosQuery = await client.query(`
      SELECT id, nome_projeto, status, tipologia, created_at
      FROM briefings 
      WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        AND status IN ('RASCUNHO', 'EM_ANDAMENTO', 'ORCAMENTO_ELABORACAO')
      ORDER BY created_at DESC
    `, [escritorioId]);

    briefingsAtivosQuery.rows.forEach((briefing, index) => {
      console.log(`${index + 1}. ${briefing.nome_projeto}`);
      console.log(`   Status: ${briefing.status}`);
      console.log(`   Tipologia: ${briefing.tipologia}`);
      console.log(`   Criado em: ${new Date(briefing.created_at).toLocaleDateString('pt-BR')}`);
      console.log('');
    });

    console.log('🎯 RESULTADO FINAL:');
    console.log(`   Total: ${totalBriefings}`);
    console.log(`   Ativos: ${briefingsAtivos}`);
    console.log(`   Concluídos: ${briefingsConcluidos}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

testarMetricasBriefingsAtivos();