// Debug do erro 404 no briefing específico
const { Pool } = require('pg');

// Configuração direta do banco (mesmo do database-simple.ts)
const pool = new Pool({
  user: 'arcflow_user',
  host: 'localhost',
  database: 'arcflow_db',
  password: 'arcflow2024',
  port: 5432,
});

async function debugBriefing404() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Debugando briefing ID: 9185d1ae-827a-4efb-984b-7eacf47559d9');
    console.log('==========================================');
    
    // 1. Verificar se o briefing existe
    const briefingQuery = `
      SELECT 
        id, 
        nome_projeto, 
        status, 
        escritorio_id,
        cliente_id,
        responsavel_id,
        created_at
      FROM briefings 
      WHERE id = $1
    `;
    
    const briefingResult = await client.query(briefingQuery, ['9185d1ae-827a-4efb-984b-7eacf47559d9']);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ BRIEFING NÃO ENCONTRADO!');
      console.log('');
      
      // Listar briefings disponíveis
      console.log('📋 Briefings disponíveis (últimos 10):');
      const allBriefings = await client.query(`
        SELECT id, nome_projeto, status, created_at 
        FROM briefings 
        ORDER BY created_at DESC 
        LIMIT 10
      `);
      
      if (allBriefings.rows.length === 0) {
        console.log('   ⚠️ Nenhum briefing encontrado na base de dados');
      } else {
        allBriefings.rows.forEach((b, i) => {
          console.log(`   ${i + 1}. ${b.id}`);
          console.log(`      Nome: ${b.nome_projeto}`);
          console.log(`      Status: ${b.status}`);
          console.log(`      Criado: ${b.created_at}`);
          console.log('');
        });
      }
      
      return;
    }
    
    const briefing = briefingResult.rows[0];
    console.log('✅ BRIEFING ENCONTRADO:');
    console.log(`   ID: ${briefing.id}`);
    console.log(`   Nome: ${briefing.nome_projeto}`);
    console.log(`   Status: ${briefing.status}`);
    console.log(`   Escritório: ${briefing.escritorio_id}`);
    console.log(`   Cliente: ${briefing.cliente_id}`);
    console.log(`   Responsável: ${briefing.responsavel_id}`);
    console.log('');
    
    // 2. Verificar respostas
    const respostasQuery = `
      SELECT COUNT(*) as total
      FROM briefing_respostas 
      WHERE briefing_id = $1
    `;
    
    const respostasResult = await client.query(respostasQuery, [briefing.id]);
    const totalRespostas = respostasResult.rows[0].total;
    
    console.log(`📋 RESPOSTAS: ${totalRespostas} encontradas`);
    
    if (totalRespostas > 0) {
      // Mostrar algumas respostas
      const respostasDetalhes = await client.query(`
        SELECT pergunta_id, resposta
        FROM briefing_respostas 
        WHERE briefing_id = $1
        LIMIT 5
      `, [briefing.id]);
      
      console.log('   Exemplos de respostas:');
      respostasDetalhes.rows.forEach((r, i) => {
        console.log(`   ${i + 1}. Pergunta ${r.pergunta_id}: ${r.resposta?.substring(0, 50)}...`);
      });
    }
    
    console.log('');
    console.log('🔧 DIAGNÓSTICO:');
    
    if (totalRespostas === 0) {
      console.log('   ⚠️ Briefing existe mas não tem respostas - isso explica o problema!');
      console.log('   💡 Solução: Criar algumas respostas de teste ou verificar se há dados em outras tabelas');
    } else {
      console.log('   ✅ Briefing tem respostas - problema deve ser na rota da API');
      console.log('   💡 Verificar se o middleware de autenticação está funcionando');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

debugBriefing404(); 