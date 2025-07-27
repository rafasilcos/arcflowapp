/**
 * DEBUG ORÇAMENTO REAL
 * 
 * Este script testa diretamente a query que está falhando
 * para identificar o problema exato
 */

const { Client } = require('pg');

async function debugOrcamentoReal() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 DEBUG ORÇAMENTO REAL');
    console.log('='.repeat(50));

    await client.connect();

    // 1. Testar a query exata da API (com casts corretos)
    console.log('\n1. Testando query da API com casts corretos...');
    const queryApi = `
      SELECT o.*, c.nome as cliente_nome, c.email as cliente_email, 
             c.telefone as cliente_telefone, b.nome_projeto as briefing_nome,
             u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id::text = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN users u ON o.responsavel_id::text = u.id
      WHERE o.id = $1
    `;

    const resultado = await client.query(queryApi, [7]);

    if (resultado.rows.length > 0) {
      const orc = resultado.rows[0];
      console.log('✅ Query funcionou! Dados encontrados:');
      console.log(`   ID: ${orc.id}`);
      console.log(`   Código: ${orc.codigo}`);
      console.log(`   Nome: ${orc.nome}`);
      console.log(`   Valor: R$ ${orc.valor_total}`);
      console.log(`   Cliente: ${orc.cliente_nome}`);
      console.log(`   Briefing: ${orc.briefing_nome}`);
      console.log(`   Responsável: ${orc.responsavel_nome}`);
    } else {
      console.log('❌ Query não retornou resultados');
    }

    // 2. Testar query sem escritorio_id para ver se é esse o problema
    console.log('\n2. Testando query sem filtro de escritório...');
    const querySimples = `
      SELECT o.*, b.nome_projeto as briefing_nome
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      WHERE o.id = $1
    `;

    const resultadoSimples = await client.query(querySimples, [7]);

    if (resultadoSimples.rows.length > 0) {
      const orc = resultadoSimples.rows[0];
      console.log('✅ Query simples funcionou!');
      console.log(`   Escritório do orçamento: ${orc.escritorio_id}`);
      console.log(`   Briefing: ${orc.briefing_nome}`);
    } else {
      console.log('❌ Query simples falhou');
    }

    // 3. Verificar qual escritório_id o usuário logado tem
    console.log('\n3. Verificando escritórios dos usuários ativos...');
    const usuarios = await client.query(`
      SELECT id, email, nome, escritorio_id
      FROM users 
      WHERE is_active = true
      ORDER BY email
    `);

    console.log('📊 Usuários ativos e seus escritórios:');
    usuarios.rows.forEach(user => {
      console.log(`   ${user.email} - Escritório: ${user.escritorio_id}`);
    });

    // 4. Verificar se algum usuário tem o mesmo escritório do orçamento
    const escritorioOrcamento = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const usuarioCompativel = usuarios.rows.find(u => u.escritorio_id === escritorioOrcamento);

    if (usuarioCompativel) {
      console.log(`\n✅ Usuário compatível encontrado: ${usuarioCompativel.email}`);
      console.log('   Este usuário deveria conseguir acessar o orçamento');
    } else {
      console.log('\n❌ Nenhum usuário tem o mesmo escritório do orçamento');
      console.log(`   Orçamento escritório: ${escritorioOrcamento}`);
      console.log('   ESTE É O PROBLEMA! Nenhum usuário pode acessar o orçamento');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNÓSTICO FINAL:');
    
    if (usuarioCompativel) {
      console.log('✅ Query SQL está correta');
      console.log('✅ Usuário compatível existe');
      console.log('❌ Problema deve estar na API ou autenticação');
    } else {
      console.log('❌ PROBLEMA: Incompatibilidade de escritório_id');
      console.log('   Solução: Atualizar escritório do orçamento ou do usuário');
    }

  } catch (error) {
    console.error('❌ Erro no debug:', error);
  } finally {
    await client.end();
  }
}

debugOrcamentoReal();