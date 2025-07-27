/**
 * VERIFICAR DADOS REAIS
 * 
 * Este script verifica a incompatibilidade entre usuário logado e orçamento
 */

const { Client } = require('pg');

async function verificarDadosReais() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 VERIFICANDO DADOS REAIS - INCOMPATIBILIDADE');
    console.log('='.repeat(60));

    await client.connect();

    // 1. Dados do usuário logado (admin@arcflow.com)
    console.log('\n1. USUÁRIO LOGADO (admin@arcflow.com):');
    const usuarioLogado = await client.query(`
      SELECT id, email, nome, escritorio_id
      FROM users 
      WHERE email = 'admin@arcflow.com'
    `);

    if (usuarioLogado.rows.length > 0) {
      const user = usuarioLogado.rows[0];
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.nome}`);
      console.log(`   Escritório ID: ${user.escritorio_id}`);
      console.log(`   Tipo do escritório_id: ${typeof user.escritorio_id}`);
    }

    // 2. Dados do orçamento ID 7
    console.log('\n2. ORÇAMENTO ID 7:');
    const orcamento = await client.query(`
      SELECT id, codigo, nome, escritorio_id, briefing_id, responsavel_id
      FROM orcamentos 
      WHERE id = 7
    `);

    if (orcamento.rows.length > 0) {
      const orc = orcamento.rows[0];
      console.log(`   ID: ${orc.id}`);
      console.log(`   Código: ${orc.codigo}`);
      console.log(`   Nome: ${orc.nome}`);
      console.log(`   Escritório ID: ${orc.escritorio_id}`);
      console.log(`   Briefing ID: ${orc.briefing_id}`);
      console.log(`   Responsável ID: ${orc.responsavel_id}`);
      console.log(`   Tipo do escritório_id: ${typeof orc.escritorio_id}`);
    }

    // 3. Dados do briefing Casa REAL
    console.log('\n3. BRIEFING CASA REAL:');
    const briefing = await client.query(`
      SELECT id, nome_projeto, escritorio_id, responsavel_id, cliente_id
      FROM briefings 
      WHERE nome_projeto = 'Casa REAL'
    `);

    if (briefing.rows.length > 0) {
      const brief = briefing.rows[0];
      console.log(`   ID: ${brief.id}`);
      console.log(`   Nome: ${brief.nome_projeto}`);
      console.log(`   Escritório ID: ${brief.escritorio_id}`);
      console.log(`   Responsável ID: ${brief.responsavel_id}`);
      console.log(`   Cliente ID: ${brief.cliente_id}`);
    }

    // 4. Verificar quem é o responsável pelo orçamento
    console.log('\n4. RESPONSÁVEL PELO ORÇAMENTO:');
    if (orcamento.rows.length > 0) {
      const responsavelId = orcamento.rows[0].responsavel_id;
      const responsavel = await client.query(`
        SELECT id, email, nome, escritorio_id
        FROM users 
        WHERE id = $1
      `, [responsavelId]);

      if (responsavel.rows.length > 0) {
        const resp = responsavel.rows[0];
        console.log(`   ID: ${resp.id}`);
        console.log(`   Email: ${resp.email}`);
        console.log(`   Nome: ${resp.nome}`);
        console.log(`   Escritório ID: ${resp.escritorio_id}`);
      }
    }

    // 5. Análise da incompatibilidade
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ANÁLISE DA INCOMPATIBILIDADE:');
    
    if (usuarioLogado.rows.length > 0 && orcamento.rows.length > 0) {
      const userEscritorio = usuarioLogado.rows[0].escritorio_id;
      const orcEscritorio = orcamento.rows[0].escritorio_id;
      
      console.log(`\n   Usuário logado escritório: "${userEscritorio}"`);
      console.log(`   Orçamento escritório: "${orcEscritorio}"`);
      
      if (userEscritorio === orcEscritorio) {
        console.log('   ✅ Escritórios BATEM - Problema é outro');
      } else {
        console.log('   ❌ Escritórios DIFERENTES - ESTE É O PROBLEMA!');
        console.log('\n   SOLUÇÕES POSSÍVEIS:');
        console.log('   1. Fazer login com usuário do escritório correto');
        console.log('   2. Atualizar escritório do usuário admin@arcflow.com');
        console.log('   3. Atualizar escritório do orçamento');
      }
      
      // Verificar se escritório do usuário é UUID válido
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userEscritorio);
      if (!isValidUUID) {
        console.log('\n   ❌ PROBLEMA ADICIONAL: escritorio_id do usuário não é UUID válido');
        console.log(`   "${userEscritorio}" não é um UUID válido`);
        console.log('   Isso causa erro na query SQL que espera UUID');
      }
    }

    // 6. Sugestão de usuário correto
    console.log('\n6. USUÁRIO CORRETO PARA ACESSAR O ORÇAMENTO:');
    if (orcamento.rows.length > 0) {
      const orcEscritorio = orcamento.rows[0].escritorio_id;
      const usuariosCorretos = await client.query(`
        SELECT id, email, nome
        FROM users 
        WHERE escritorio_id = $1 AND is_active = true
      `, [orcEscritorio]);

      if (usuariosCorretos.rows.length > 0) {
        console.log('   ✅ Usuários que podem acessar este orçamento:');
        usuariosCorretos.rows.forEach(user => {
          console.log(`     📧 ${user.email} (${user.nome})`);
        });
      } else {
        console.log('   ❌ Nenhum usuário ativo encontrado para este escritório');
      }
    }

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  } finally {
    await client.end();
  }
}

verificarDadosReais();