const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarUsuarios() {
  try {
    await client.connect();
    console.log('👤 VERIFICANDO USUÁRIOS NO BANCO...\n');

    // Listar usuários
    const usuarios = await client.query(`
      SELECT email, escritorio_id, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log('📋 USUÁRIOS EXISTENTES:');
    usuarios.rows.forEach((u, i) => {
      console.log(`   ${i+1}. ${u.email}`);
      console.log(`      Escritório: ${u.escritorio_id || 'NÃO DEFINIDO'}`);
      console.log(`      Criado: ${new Date(u.created_at).toLocaleString('pt-BR')}\n`);
    });

    // Verificar usuários que podem acessar o escritório com os briefings de teste
    const escritorioTeste = '4f4fb257-b8af-4260-98e0-698791478bb3';
    const usuariosEscritorioTeste = await client.query(`
      SELECT email 
      FROM users 
      WHERE escritorio_id = $1
    `, [escritorioTeste]);

    console.log(`🏢 USUÁRIOS DO ESCRITÓRIO COM BRIEFINGS DE TESTE (${escritorioTeste}):`);
    if (usuariosEscritorioTeste.rows.length > 0) {
      usuariosEscritorioTeste.rows.forEach((u, i) => {
        console.log(`   ${i+1}. ${u.email}`);
      });
    } else {
      console.log('   ❌ Nenhum usuário encontrado neste escritório!');
    }

    // Verificar usuários do escritório que o Rafael vê (16 briefings)
    const escritorioRafael = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const usuariosEscritorioRafael = await client.query(`
      SELECT email 
      FROM users 
      WHERE escritorio_id = $1
    `, [escritorioRafael]);

    console.log(`\n🎯 USUÁRIOS DO ESCRITÓRIO QUE RAFAEL VÊ (${escritorioRafael}):`);
    if (usuariosEscritorioRafael.rows.length > 0) {
      usuariosEscritorioRafael.rows.forEach((u, i) => {
        console.log(`   ${i+1}. ${u.email}`);
      });
    } else {
      console.log('   ❌ Nenhum usuário encontrado neste escritório!');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarUsuarios(); 