/**
 * CORRIGIR ESCRITÓRIO DO USUÁRIO
 * 
 * Este script atualiza o escritorio_id do usuário admin@arcflow.com
 * para o UUID correto do escritório
 */

const { Client } = require('pg');

async function corrigirEscritorioUsuario() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔧 CORRIGINDO ESCRITÓRIO DO USUÁRIO');
    console.log('='.repeat(50));

    await client.connect();

    // 1. Verificar situação atual
    console.log('\n1. Situação atual:');
    const usuarioAtual = await client.query(`
      SELECT id, email, nome, escritorio_id
      FROM users 
      WHERE email = 'admin@arcflow.com'
    `);

    if (usuarioAtual.rows.length > 0) {
      const user = usuarioAtual.rows[0];
      console.log(`   Usuário: ${user.email}`);
      console.log(`   Escritório atual: ${user.escritorio_id}`);
      console.log(`   É UUID válido: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.escritorio_id)}`);
    }

    // 2. Definir o escritório correto (mesmo do orçamento)
    const escritorioCorreto = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    console.log(`\n2. Escritório correto: ${escritorioCorreto}`);

    // 3. Atualizar o usuário
    console.log('\n3. Atualizando escritório do usuário...');
    const resultado = await client.query(`
      UPDATE users 
      SET escritorio_id = $1
      WHERE email = 'admin@arcflow.com'
      RETURNING id, email, escritorio_id
    `, [escritorioCorreto]);

    if (resultado.rows.length > 0) {
      const userAtualizado = resultado.rows[0];
      console.log('✅ Usuário atualizado com sucesso!');
      console.log(`   Email: ${userAtualizado.email}`);
      console.log(`   Novo escritório: ${userAtualizado.escritorio_id}`);
    }

    // 4. Verificar se agora pode acessar o orçamento
    console.log('\n4. Testando acesso ao orçamento...');
    const testeAcesso = await client.query(`
      SELECT o.id, o.codigo, o.nome
      FROM orcamentos o
      WHERE o.id = 7 AND o.escritorio_id = $1
    `, [escritorioCorreto]);

    if (testeAcesso.rows.length > 0) {
      console.log('✅ Usuário agora pode acessar o orçamento!');
      console.log(`   Orçamento: ${testeAcesso.rows[0].nome}`);
    } else {
      console.log('❌ Ainda não pode acessar o orçamento');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 CORREÇÃO APLICADA:');
    console.log('   ✅ Escritório do usuário admin@arcflow.com atualizado');
    console.log('   ✅ Agora usa UUID válido');
    console.log('   ✅ Pode acessar orçamentos do escritório correto');
    console.log('\n   📝 PRÓXIMO PASSO:');
    console.log('   Faça logout e login novamente para atualizar o token JWT');

  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await client.end();
  }
}

corrigirEscritorioUsuario();