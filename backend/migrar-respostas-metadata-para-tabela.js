/**
 * 🔄 MIGRAR RESPOSTAS DO METADATA PARA TABELA
 * 
 * Script para migrar respostas que estão apenas no metadata dos briefings
 * para a tabela respostas_briefing
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function migrarRespostasMetadataParaTabela() {
  console.log('🔄 MIGRAÇÃO DE RESPOSTAS: METADATA → TABELA');
  console.log('='.repeat(60));
  
  try {
    // 1. Buscar briefings com respostas no metadata mas sem respostas na tabela
    console.log('\n🔍 Buscando briefings com respostas apenas no metadata...');
    
    const briefingsParaMigrar = await pool.query(`
      SELECT 
        b.id,
        b.nome_projeto,
        b.metadata,
        COUNT(r.id) as respostas_na_tabela
      FROM briefings b
      LEFT JOIN respostas_briefing r ON b.id = r.briefing_id
      WHERE b.metadata IS NOT NULL 
        AND b.metadata->>'respostas' IS NOT NULL
        AND b.nome_projeto LIKE '%TESTE AUTOMÁTICO%'
      GROUP BY b.id, b.nome_projeto, b.metadata
      HAVING COUNT(r.id) = 0
      ORDER BY b.nome_projeto
    `);
    
    if (briefingsParaMigrar.rows.length === 0) {
      console.log('✅ Nenhum briefing precisa de migração');
      console.log('   Todos os briefings já têm respostas na tabela ou não têm respostas no metadata');
      return;
    }
    
    console.log(`📋 Encontrados ${briefingsParaMigrar.rows.length} briefings para migrar:`);
    briefingsParaMigrar.rows.forEach(briefing => {
      const totalRespostasMetadata = briefing.metadata?.respostas ? Object.keys(briefing.metadata.respostas).length : 0;
      console.log(`   • ${briefing.nome_projeto}: ${totalRespostasMetadata} respostas no metadata`);
    });
    
    // 2. Migrar cada briefing
    console.log('\n🔄 Iniciando migração...');
    
    let totalBriefingsMigrados = 0;
    let totalRespostasMigradas = 0;
    let totalErros = 0;
    
    for (const briefing of briefingsParaMigrar.rows) {
      try {
        console.log(`\n📋 Migrando: ${briefing.nome_projeto}`);
        
        const respostas = briefing.metadata.respostas;
        if (!respostas || typeof respostas !== 'object') {
          console.log('   ⚠️ Metadata sem respostas válidas, pulando...');
          continue;
        }
        
        let respostasMigradasBriefing = 0;
        let errosBriefing = 0;
        
        // Inserir cada resposta
        for (const [perguntaId, resposta] of Object.entries(respostas)) {
          try {
            const respostaTexto = Array.isArray(resposta) ? JSON.stringify(resposta) : resposta.toString();
            
            await pool.query(`
              INSERT INTO respostas_briefing (
                briefing_id, pergunta_id, resposta, created_at, updated_at
              ) VALUES ($1, $2, $3, NOW(), NOW())
              ON CONFLICT (briefing_id, pergunta_id) DO UPDATE SET
                resposta = EXCLUDED.resposta,
                updated_at = NOW()
            `, [briefing.id, perguntaId, respostaTexto]);
            
            respostasMigradasBriefing++;
            totalRespostasMigradas++;
            
          } catch (respostaError) {
            console.log(`   ❌ Erro ao migrar resposta ${perguntaId}: ${respostaError.message}`);
            errosBriefing++;
            totalErros++;
          }
        }
        
        console.log(`   ✅ Migradas ${respostasMigradasBriefing} respostas (${errosBriefing} erros)`);
        totalBriefingsMigrados++;
        
      } catch (briefingError) {
        console.log(`   ❌ Erro ao migrar briefing: ${briefingError.message}`);
        totalErros++;
      }
    }
    
    // 3. Relatório final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO DE MIGRAÇÃO:');
    console.log(`   📋 Briefings migrados: ${totalBriefingsMigrados}/${briefingsParaMigrar.rows.length}`);
    console.log(`   📝 Respostas migradas: ${totalRespostasMigradas}`);
    console.log(`   ❌ Total de erros: ${totalErros}`);
    
    if (totalBriefingsMigrados === briefingsParaMigrar.rows.length && totalErros === 0) {
      console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('✅ Todas as respostas foram migradas do metadata para a tabela');
      
      // Verificar resultado
      console.log('\n🔍 Verificando resultado da migração...');
      const verificacao = await pool.query(`
        SELECT 
          COUNT(DISTINCT b.id) as briefings_com_respostas,
          COUNT(r.id) as total_respostas
        FROM briefings b
        INNER JOIN respostas_briefing r ON b.id = r.briefing_id
        WHERE b.nome_projeto LIKE '%TESTE AUTOMÁTICO%'
      `);
      
      console.log(`✅ Resultado: ${verificacao.rows[0].briefings_com_respostas} briefings com ${verificacao.rows[0].total_respostas} respostas na tabela`);
      
    } else {
      console.log('\n⚠️ MIGRAÇÃO PARCIAL OU COM ERROS');
      console.log('💡 Verifique os erros acima e execute novamente se necessário');
    }
    
    // 4. Próximos passos
    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('   1. Execute: node verificar-briefings-teste-corrigido.js');
    console.log('   2. Teste o sistema no dashboard do ArcFlow');
    console.log('   3. Verifique se as respostas aparecem corretamente nos briefings');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

// Executar migração
if (require.main === module) {
  migrarRespostasMetadataParaTabela();
}

module.exports = { migrarRespostasMetadataParaTabela };