/**
 * VERIFICAR SE O ORÇAMENTO ID 7 EXISTE NO BANCO
 * 
 * Este script verifica se o orçamento com ID 7 foi realmente salvo no banco
 * e testa a API de busca
 */

const { Client } = require('pg');

async function verificarOrcamentoId7() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 VERIFICANDO ORÇAMENTO ID 7');
    console.log('='.repeat(50));

    await client.connect();

    // 1. Verificar se o orçamento ID 7 existe no banco
    console.log('\n1. Verificando se orçamento ID 7 existe no banco...');
    const orcamento7 = await client.query(`
      SELECT 
        o.*,
        b.nome_projeto,
        c.nome as cliente_nome
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN clientes c ON o.cliente_id::text = c.id
      WHERE o.id = 7
    `);

    if (orcamento7.rows.length > 0) {
      const orc = orcamento7.rows[0];
      console.log('✅ Orçamento ID 7 EXISTE no banco!');
      console.log(`   Código: ${orc.codigo}`);
      console.log(`   Nome: ${orc.nome}`);
      console.log(`   Valor: R$ ${orc.valor_total}`);
      console.log(`   Briefing: ${orc.nome_projeto}`);
      console.log(`   Cliente: ${orc.cliente_nome}`);
      console.log(`   Escritório ID: ${orc.escritorio_id}`);
      console.log(`   Dados extraídos: ${orc.dados_extraidos ? 'Presente' : 'Ausente'}`);
      console.log(`   Criado em: ${orc.created_at}`);
    } else {
      console.log('❌ Orçamento ID 7 NÃO EXISTE no banco!');
      console.log('   Isso explica o erro 404 na API');
    }

    // 2. Verificar qual é o último orçamento criado
    console.log('\n2. Verificando último orçamento criado...');
    const ultimoOrcamento = await client.query(`
      SELECT id, codigo, nome, valor_total, created_at, briefing_id
      FROM orcamentos 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (ultimoOrcamento.rows.length > 0) {
      const ultimo = ultimoOrcamento.rows[0];
      console.log('📊 Último orçamento no banco:');
      console.log(`   ID: ${ultimo.id}`);
      console.log(`   Código: ${ultimo.codigo}`);
      console.log(`   Nome: ${ultimo.nome}`);
      console.log(`   Valor: R$ ${ultimo.valor_total}`);
      console.log(`   Briefing ID: ${ultimo.briefing_id}`);
      console.log(`   Criado: ${ultimo.created_at}`);
    }

    // 3. Verificar todos os orçamentos
    console.log('\n3. Todos os orçamentos no banco:');
    const todosOrcamentos = await client.query(`
      SELECT id, codigo, nome, valor_total, briefing_id, created_at
      FROM orcamentos 
      ORDER BY id DESC
    `);

    console.log(`📊 Total de orçamentos: ${todosOrcamentos.rows.length}`);
    todosOrcamentos.rows.forEach(orc => {
      console.log(`   ID: ${orc.id} | Código: ${orc.codigo} | Valor: R$ ${orc.valor_total}`);
    });

    // 4. Verificar se há orçamentos para o briefing Casa REAL
    console.log('\n4. Verificando orçamentos do briefing Casa REAL...');
    const briefingId = '8320013b-8caf-405e-aefc-401e29b61ef8';
    const orcamentosCasaReal = await client.query(`
      SELECT id, codigo, valor_total, created_at
      FROM orcamentos 
      WHERE briefing_id = $1
      ORDER BY created_at DESC
    `, [briefingId]);

    if (orcamentosCasaReal.rows.length > 0) {
      console.log(`✅ Encontrados ${orcamentosCasaReal.rows.length} orçamentos para Casa REAL:`);
      orcamentosCasaReal.rows.forEach(orc => {
        console.log(`   ID: ${orc.id} | Código: ${orc.codigo} | Valor: R$ ${orc.valor_total}`);
      });
    } else {
      console.log('❌ Nenhum orçamento encontrado para Casa REAL');
      console.log('   Isso significa que a geração falhou silenciosamente');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNÓSTICO:');
    
    if (orcamento7.rows.length === 0) {
      console.log('❌ PROBLEMA: Orçamento ID 7 não existe no banco');
      console.log('   - A API retorna 404 porque não encontra o orçamento');
      console.log('   - A geração pode ter falhado silenciosamente');
      console.log('   - Precisa verificar logs da API de geração');
    } else {
      console.log('✅ Orçamento existe no banco');
      console.log('❌ PROBLEMA: Pode ser na API de busca');
      console.log('   - Verificar autenticação');
      console.log('   - Verificar escritorio_id');
    }

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  } finally {
    await client.end();
  }
}

verificarOrcamentoId7();