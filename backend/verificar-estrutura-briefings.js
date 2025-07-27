/**
 * VERIFICAR ESTRUTURA DA TABELA BRIEFINGS
 * 
 * Este script verifica a estrutura da tabela briefings
 * para identificar o nome correto das colunas
 */

const { Client } = require('pg');

async function verificarEstruturaBriefings() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA BRIEFINGS');
    console.log('='.repeat(50));

    await client.connect();

    // 1. Verificar estrutura da tabela briefings
    console.log('\n1. Estrutura da tabela briefings:');
    const estrutura = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'briefings'
      ORDER BY ordinal_position
    `);

    console.log('📊 Colunas da tabela briefings:');
    estrutura.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) - ${col.is_nullable === 'YES' ? 'Nullable' : 'Not Null'}`);
    });

    // 2. Verificar se existe coluna nome ou nome_projeto
    console.log('\n2. Verificando colunas de nome:');
    const colunasNome = estrutura.rows.filter(col => 
      col.column_name.includes('nome') || 
      col.column_name.includes('titulo') ||
      col.column_name.includes('project')
    );

    if (colunasNome.length > 0) {
      console.log('✅ Colunas relacionadas a nome encontradas:');
      colunasNome.forEach(col => {
        console.log(`   ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('❌ Nenhuma coluna de nome encontrada');
    }

    // 3. Verificar alguns briefings para ver os dados
    console.log('\n3. Verificando dados de briefings existentes:');
    const briefings = await client.query(`
      SELECT id, nome_projeto, created_at
      FROM briefings 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    if (briefings.rows.length > 0) {
      console.log('✅ Briefings encontrados:');
      briefings.rows.forEach((brief, index) => {
        console.log(`   ${index + 1}. ${brief.nome_projeto || 'Sem nome'} (${brief.id})`);
      });
    } else {
      console.log('❌ Nenhum briefing encontrado');
    }

    // 4. Verificar o briefing específico do orçamento ID 7
    console.log('\n4. Verificando briefing do orçamento ID 7:');
    const briefingId = '8320013b-8caf-405e-aefc-401e29b61ef8';
    const briefingEspecifico = await client.query(`
      SELECT *
      FROM briefings 
      WHERE id = $1
    `, [briefingId]);

    if (briefingEspecifico.rows.length > 0) {
      const brief = briefingEspecifico.rows[0];
      console.log('✅ Briefing encontrado:');
      console.log(`   ID: ${brief.id}`);
      console.log(`   Nome do projeto: ${brief.nome_projeto}`);
      console.log(`   Cliente ID: ${brief.cliente_id}`);
      console.log(`   Escritório ID: ${brief.escritorio_id}`);
      console.log(`   Status: ${brief.status}`);
    } else {
      console.log('❌ Briefing não encontrado');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNÓSTICO:');
    console.log('   A coluna correta para nome do briefing é: nome_projeto');
    console.log('   A query da API precisa ser corrigida de b.nome para b.nome_projeto');

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  } finally {
    await client.end();
  }
}

verificarEstruturaBriefings();