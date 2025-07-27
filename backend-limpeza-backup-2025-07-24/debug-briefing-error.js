/**
 * 🔍 DEBUG ERRO BRIEFING NÃO ENCONTRADO
 * 
 * Investiga o erro que aparece na dashboard de briefings
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function debugBriefingError() {
  try {
    await client.connect();
    console.log('🔍 DEBUGANDO ERRO DE BRIEFING NÃO ENCONTRADO...\n');

    const escritorioAdmin = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    // 1. Verificar briefings existentes
    const briefings = await client.query(`
      SELECT id, nome_projeto, status, deleted_at, created_at
      FROM briefings 
      WHERE escritorio_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `, [escritorioAdmin]);

    console.log(`📋 BRIEFINGS NO ESCRITÓRIO ADMIN (${briefings.rows.length}):`);
    briefings.rows.forEach((b, i) => {
      console.log(`   ${i+1}. ${b.nome_projeto}`);
      console.log(`      ID: ${b.id}`);
      console.log(`      Status: ${b.status}`);
      console.log(`      Deletado: ${b.deleted_at ? 'SIM' : 'NÃO'}`);
      console.log(`      Criado: ${new Date(b.created_at).toLocaleString('pt-BR')}\n`);
    });

    // 2. Verificar briefings deletados
    const deletados = await client.query(`
      SELECT COUNT(*) as total
      FROM briefings 
      WHERE escritorio_id = $1 AND deleted_at IS NOT NULL
    `, [escritorioAdmin]);

    console.log(`🗑️ BRIEFINGS DELETADOS: ${deletados.rows[0].total}`);

    // 3. Verificar se há briefings com IDs inválidos sendo chamados
    const idsProblematicos = await client.query(`
      SELECT id, nome_projeto
      FROM briefings 
      WHERE escritorio_id = $1 
      AND (id IS NULL OR id = '')
    `, [escritorioAdmin]);

    console.log(`⚠️ BRIEFINGS COM IDs PROBLEMÁTICOS: ${idsProblematicos.rows.length}`);

    // 4. Verificar briefings de teste específicos
    const briefingsTeste = await client.query(`
      SELECT id, nome_projeto, status
      FROM briefings 
      WHERE nome_projeto LIKE '%TESTE AUTOMÁTICO%' 
      AND escritorio_id = $1
    `, [escritorioAdmin]);

    console.log(`\n🧪 BRIEFINGS DE TESTE (${briefingsTeste.rows.length}):`);
    briefingsTeste.rows.forEach((b, i) => {
      console.log(`   ${i+1}. ${b.nome_projeto}`);
      console.log(`      ID: ${b.id}`);
      console.log(`      Status: ${b.status}\n`);
    });

    // 5. Verificar se há problemas de encoding ou caracteres especiais
    const problemasEncoding = await client.query(`
      SELECT id, nome_projeto
      FROM briefings 
      WHERE escritorio_id = $1 
      AND (nome_projeto LIKE '%undefined%' OR nome_projeto LIKE '%null%')
    `, [escritorioAdmin]);

    console.log(`🔤 PROBLEMAS DE ENCODING: ${problemasEncoding.rows.length}`);
    if (problemasEncoding.rows.length > 0) {
      problemasEncoding.rows.forEach((b, i) => {
        console.log(`   ${i+1}. ${b.nome_projeto} (ID: ${b.id})`);
      });
    }

    console.log('\n🔍 POSSÍVEIS CAUSAS DO ERRO:');
    if (briefings.rows.length === 0) {
      console.log('   ❌ Nenhum briefing encontrado no escritório');
    } else {
      console.log('   ✅ Briefings existem no banco');
      console.log('   🔍 Problema pode ser:');
      console.log('     - ID sendo passado incorretamente na URL');
      console.log('     - Briefing sendo deletado/movido durante o carregamento');
      console.log('     - Problema de cache no frontend');
      console.log('     - Erro na API de busca do briefing');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

debugBriefingError(); 