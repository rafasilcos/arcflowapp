const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function investigarBriefings() {
  try {
    await client.connect();
    console.log('🔍 INVESTIGANDO PROBLEMA DOS BRIEFINGS...\n');

    // 1. Total de briefings no banco
    const total = await client.query('SELECT COUNT(*) as total FROM briefings');
    console.log(`📊 TOTAL BRIEFINGS NO BANCO: ${total.rows[0].total}`);

    // 2. Briefings de teste
    const teste = await client.query("SELECT COUNT(*) as teste FROM briefings WHERE nome_projeto LIKE '%TESTE AUTOMÁTICO%'");
    console.log(`🧪 BRIEFINGS DE TESTE: ${teste.rows[0].teste}`);

    // 3. Verificar escritórios
    const escritorios = await client.query('SELECT id, nome FROM escritorios');
    console.log('\n🏢 ESCRITÓRIOS NO BANCO:');
    escritorios.rows.forEach((e, i) => {
      console.log(`   ${i+1}. ${e.nome} (${e.id})`);
    });

    // 4. Verificar distribuição por escritório
    const porEscritorio = await client.query(`
      SELECT escritorio_id, COUNT(*) as total 
      FROM briefings 
      GROUP BY escritorio_id 
      ORDER BY total DESC
    `);
    console.log('\n📊 BRIEFINGS POR ESCRITÓRIO:');
    porEscritorio.rows.forEach((row) => {
      console.log(`   Escritório ${row.escritorio_id}: ${row.total} briefings`);
    });

    // 5. Briefings de teste específicos
    const briefingsTeste = await client.query(`
      SELECT nome_projeto, escritorio_id, created_at 
      FROM briefings 
      WHERE nome_projeto LIKE '%TESTE AUTOMÁTICO%' 
      ORDER BY created_at DESC
    `);
    
    if (briefingsTeste.rows.length > 0) {
      console.log('\n🧪 BRIEFINGS DE TESTE CRIADOS:');
      briefingsTeste.rows.forEach((b, i) => {
        console.log(`   ${i+1}. ${b.nome_projeto}`);
        console.log(`      Escritório: ${b.escritorio_id}`);
        console.log(`      Criado: ${new Date(b.created_at).toLocaleString('pt-BR')}`);
      });
    } else {
      console.log('\n❌ NENHUM BRIEFING DE TESTE ENCONTRADO!');
    }

    // 6. Verificar usuário admin@arcflow
    const userAdmin = await client.query("SELECT id, email, escritorio_id FROM users WHERE email = 'admin@arcflow'");
    if (userAdmin.rows.length > 0) {
      console.log('\n👤 USUÁRIO admin@arcflow:');
      console.log(`   ID: ${userAdmin.rows[0].id}`);
      console.log(`   Escritório: ${userAdmin.rows[0].escritorio_id || 'NÃO DEFINIDO'}`);
      
      // Verificar briefings do escritório do admin
      if (userAdmin.rows[0].escritorio_id) {
        const briefingsAdmin = await client.query(`
          SELECT COUNT(*) as total 
          FROM briefings 
          WHERE escritorio_id = $1
        `, [userAdmin.rows[0].escritorio_id]);
        console.log(`   Briefings no escritório do admin: ${briefingsAdmin.rows[0].total}`);
      }
    } else {
      console.log('\n❌ USUÁRIO admin@arcflow NÃO ENCONTRADO!');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

investigarBriefings(); 