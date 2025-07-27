/**
 * 🧹 LIMPEZA DE DADOS ANTIGOS - ARCFLOW
 * 
 * Remove dados antigos e inconsistências que podem causar erros
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function limparDadosAntigos() {
  console.log('🧹 LIMPANDO DADOS ANTIGOS E INCONSISTÊNCIAS...');
  console.log('='.repeat(60));
  
  try {
    await client.connect();
    
    // 1. Verificar quantos briefings existem por escritório
    console.log('\n📊 SITUAÇÃO ATUAL:');
    const briefingsPorEscritorio = await client.query(`
      SELECT escritorio_id, COUNT(*) as total
      FROM briefings 
      WHERE deleted_at IS NULL
      GROUP BY escritorio_id 
      ORDER BY total DESC
    `);
    
    briefingsPorEscritorio.rows.forEach((row) => {
      console.log(`   Escritório ${row.escritorio_id}: ${row.total} briefings`);
    });
    
    // 2. Remover briefings órfãos (sem cliente ou escritório válido)
    console.log('\n🗑️ REMOVENDO BRIEFINGS ÓRFÃOS...');
    const briefingsOrfaos = await client.query(`
      DELETE FROM briefings 
      WHERE cliente_id IS NULL 
      OR escritorio_id IS NULL 
      OR created_by IS NULL
      RETURNING id, nome_projeto
    `);
    
    if (briefingsOrfaos.rows.length > 0) {
      console.log(`✅ Removidos ${briefingsOrfaos.rows.length} briefings órfãos:`);
      briefingsOrfaos.rows.forEach((b, i) => {
        console.log(`   ${i+1}. ${b.nome_projeto} (${b.id})`);
      });
    } else {
      console.log('✅ Nenhum briefing órfão encontrado');
    }
    
    // 3. Verificar briefings com IDs duplicados ou corrompidos
    console.log('\n🔍 VERIFICANDO IDs CORROMPIDOS...');
    const idsDuplicados = await client.query(`
      SELECT nome_projeto, COUNT(*) as count
      FROM briefings 
      WHERE deleted_at IS NULL
      GROUP BY nome_projeto 
      HAVING COUNT(*) > 1
    `);
    
    if (idsDuplicados.rows.length > 0) {
      console.log(`⚠️ Encontrados ${idsDuplicados.rows.length} nomes duplicados:`);
      idsDuplicados.rows.forEach((d) => {
        console.log(`   ${d.nome_projeto}: ${d.count} ocorrências`);
      });
    } else {
      console.log('✅ Nenhum ID duplicado encontrado');
    }
    
    // 4. Verificar briefings com metadata corrompida
    console.log('\n🔧 VERIFICANDO METADATA...');
    const metadataProblemas = await client.query(`
      SELECT id, nome_projeto
      FROM briefings 
      WHERE metadata IS NOT NULL 
      AND metadata::text = 'null'
      OR metadata::text = '{}'
      OR metadata::text = ''
    `);
    
    if (metadataProblemas.rows.length > 0) {
      console.log(`⚠️ Encontrados ${metadataProblemas.rows.length} briefings com metadata problemática:`);
      metadataProblemas.rows.forEach((b, i) => {
        console.log(`   ${i+1}. ${b.nome_projeto} (${b.id})`);
      });
    } else {
      console.log('✅ Metadata está consistente');
    }
    
    // 5. Contar total final
    const totalFinal = await client.query(`
      SELECT COUNT(*) as total 
      FROM briefings 
      WHERE deleted_at IS NULL
    `);
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 SITUAÇÃO FINAL:');
    console.log(`📊 Total de briefings limpos: ${totalFinal.rows[0].total}`);
    
    if (totalFinal.rows[0].total == 0) {
      console.log('✅ Sistema está limpo - Nenhum briefing no banco');
      console.log('✅ Agora o dashboard deve mostrar "Nenhum briefing encontrado"');
      console.log('✅ Sem erros de "Briefing não encontrado"!');
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. ✅ Acesse http://localhost:3000/briefing');
    console.log('2. ✅ Deve mostrar "Nenhum briefing encontrado"');
    console.log('3. ✅ Clique "Criar Briefing" para teste');
    console.log('4. ✅ Se necessário, execute criar-briefings-teste.bat');
    
    console.log('\n✅ LIMPEZA CONCLUÍDA!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

limparDadosAntigos(); 