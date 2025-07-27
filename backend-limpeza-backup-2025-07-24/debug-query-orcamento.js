/**
 * DEBUG QUERY ORÇAMENTO
 * 
 * Este script testa diretamente a query que a API está usando
 * para encontrar o orçamento ID 7
 */

const { Client } = require('pg');

async function debugQueryOrcamento() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 DEBUG QUERY ORÇAMENTO');
    console.log('='.repeat(50));

    await client.connect();

    // 1. Verificar dados do orçamento ID 7
    console.log('\n1. Dados do orçamento ID 7:');
    const orcamento = await client.query(`
      SELECT id, codigo, nome, escritorio_id, briefing_id, cliente_id, responsavel_id
      FROM orcamentos 
      WHERE id = 7
    `);

    if (orcamento.rows.length > 0) {
      const orc = orcamento.rows[0];
      console.log('✅ Orçamento encontrado:');
      console.log(`   ID: ${orc.id}`);
      console.log(`   Código: ${orc.codigo}`);
      console.log(`   Nome: ${orc.nome}`);
      console.log(`   Escritório: ${orc.escritorio_id}`);
      console.log(`   Briefing: ${orc.briefing_id}`);
      console.log(`   Cliente: ${orc.cliente_id}`);
      console.log(`   Responsável: ${orc.responsavel_id}`);
    } else {
      console.log('❌ Orçamento não encontrado');
      return;
    }

    // 2. Verificar dados do usuário rafasilcos@icloud.com
    console.log('\n2. Dados do usuário rafasilcos@icloud.com:');
    const usuario = await client.query(`
      SELECT id, email, nome, escritorio_id
      FROM users 
      WHERE email = 'rafasilcos@icloud.com'
    `);

    if (usuario.rows.length > 0) {
      const user = usuario.rows[0];
      console.log('✅ Usuário encontrado:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.nome}`);
      console.log(`   Escritório: ${user.escritorio_id}`);
    } else {
      console.log('❌ Usuário não encontrado');
      return;
    }

    // 3. Testar query exata da API
    console.log('\n3. Testando query exata da API:');
    const escritorioUsuario = usuario.rows[0].escritorio_id;
    const orcamentoId = 7;

    console.log(`   Parâmetros: orcamentoId=${orcamentoId}, escritorioId=${escritorioUsuario}`);

    const queryApi = await client.query(`
      SELECT o.*, c.nome as cliente_nome, c.email as cliente_email, 
             c.telefone as cliente_telefone, b.nome_projeto as briefing_nome,
             u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id::text = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN users u ON o.responsavel_id::text = u.id
      WHERE o.id = $1 AND o.escritorio_id = $2
    `, [orcamentoId, escritorioUsuario]);

    if (queryApi.rows.length > 0) {
      console.log('✅ Query da API funcionou!');
      console.log(`   Encontrou: ${queryApi.rows[0].nome}`);
      console.log(`   Cliente: ${queryApi.rows[0].cliente_nome}`);
      console.log(`   Briefing: ${queryApi.rows[0].briefing_nome}`);
    } else {
      console.log('❌ Query da API não retornou resultados');
      console.log('   PROBLEMA: Escritório do usuário não bate com o do orçamento');
      
      // Verificar se os escritórios são diferentes
      const escritorioOrcamento = orcamento.rows[0].escritorio_id;
      console.log(`   Escritório do orçamento: ${escritorioOrcamento}`);
      console.log(`   Escritório do usuário: ${escritorioUsuario}`);
      
      if (escritorioOrcamento !== escritorioUsuario) {
        console.log('❌ PROBLEMA CONFIRMADO: Escritórios diferentes!');
        console.log('   Solução: Atualizar escritório do orçamento ou do usuário');
      }
    }

    // 4. Testar query sem filtro de escritório
    console.log('\n4. Testando query sem filtro de escritório:');
    const querySemFiltro = await client.query(`
      SELECT o.*, c.nome as cliente_nome, b.nome_projeto as briefing_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id::text = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      WHERE o.id = $1
    `, [orcamentoId]);

    if (querySemFiltro.rows.length > 0) {
      console.log('✅ Query sem filtro funcionou!');
      console.log(`   Orçamento: ${querySemFiltro.rows[0].nome}`);
      console.log('   CONFIRMADO: O problema é o filtro de escritório');
    } else {
      console.log('❌ Query sem filtro também falhou');
      console.log('   PROBLEMA: Pode ser nos JOINs ou no orçamento não existir');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNÓSTICO FINAL:');
    console.log('   Se a query sem filtro funciona mas a com filtro não,');
    console.log('   o problema é incompatibilidade de escritório_id');

  } catch (error) {
    console.error('❌ Erro no debug:', error);
  } finally {
    await client.end();
  }
}

debugQueryOrcamento();