const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'arcflow_db',
  user: 'postgres',
  password: '123456'
});

async function atualizarStatusBriefing() {
  try {
    console.log('🔧 ATUALIZANDO STATUS DE BRIEFING PARA HABILITAR BOTÃO\n');
    
    // Primeiro, vamos buscar um briefing existente
    console.log('1️⃣ Buscando briefings existentes...');
    const briefingsResult = await pool.query(`
      SELECT 
        id,
        nome_projeto,
        status,
        progresso
      FROM briefings 
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
      LIMIT 5
    `);
    
    if (briefingsResult.rows.length === 0) {
      console.log('❌ Nenhum briefing encontrado no banco de dados');
      console.log('💡 Você precisa criar um briefing primeiro no frontend');
      return;
    }
    
    console.log('📋 Briefings encontrados:');
    briefingsResult.rows.forEach((briefing, index) => {
      console.log(`   ${index + 1}. ${briefing.nome_projeto} (Status: ${briefing.status})`);
    });
    
    // Pegar o primeiro briefing e atualizar seu status
    const briefingParaAtualizar = briefingsResult.rows[0];
    console.log(`\n2️⃣ Atualizando status do briefing: "${briefingParaAtualizar.nome_projeto}"`);
    console.log(`   Status atual: ${briefingParaAtualizar.status}`);
    console.log(`   Novo status: CONCLUIDO`);
    
    const updateResult = await pool.query(`
      UPDATE briefings 
      SET 
        status = 'CONCLUIDO',
        progresso = 100,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, nome_projeto, status, progresso
    `, [briefingParaAtualizar.id]);
    
    if (updateResult.rows.length > 0) {
      const briefingAtualizado = updateResult.rows[0];
      console.log('\n✅ Briefing atualizado com sucesso!');
      console.log(`   ID: ${briefingAtualizado.id}`);
      console.log(`   Nome: ${briefingAtualizado.nome_projeto}`);
      console.log(`   Status: ${briefingAtualizado.status}`);
      console.log(`   Progresso: ${briefingAtualizado.progresso}%`);
      
      console.log('\n🎯 PRÓXIMOS PASSOS:');
      console.log('   1. Acesse o frontend do ArcFlow');
      console.log(`   2. Vá para o briefing: ${briefingAtualizado.nome_projeto}`);
      console.log('   3. O botão "Gerar Orçamento" agora deve estar habilitado!');
      console.log('   4. Clique no botão para testar a funcionalidade');
      
    } else {
      console.log('❌ Falha ao atualizar o briefing');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar status do briefing:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 SOLUÇÃO:');
      console.log('   1. Inicie o PostgreSQL');
      console.log('   2. Execute este script novamente');
      console.log('   3. Ou atualize o status manualmente no frontend');
    }
  } finally {
    await pool.end();
  }
}

console.log('🚀 Iniciando atualização de status do briefing...\n');
atualizarStatusBriefing();