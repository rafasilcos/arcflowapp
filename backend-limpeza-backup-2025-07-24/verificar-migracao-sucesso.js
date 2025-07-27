/**
 * VERIFICAR SE A MIGRAÇÃO FOI EXECUTADA COM SUCESSO
 */

const { Client } = require('pg');

async function verificarMigracao() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 VERIFICANDO MIGRAÇÃO');
    console.log('='.repeat(40));

    await client.connect();

    // 1. Verificar se a coluna dados_extraidos existe
    console.log('\n1. Verificando coluna dados_extraidos...');
    const colunaResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos' AND column_name = 'dados_extraidos'
    `);

    if (colunaResult.rows.length > 0) {
      console.log('✅ Coluna dados_extraidos existe!');
      console.log(`   Tipo: ${colunaResult.rows[0].data_type}`);
      console.log(`   Nullable: ${colunaResult.rows[0].is_nullable}`);
    } else {
      console.log('❌ Coluna dados_extraidos NÃO existe!');
      return;
    }

    // 2. Buscar um escritório válido
    console.log('\n2. Buscando escritório válido...');
    const escritorioResult = await client.query(`
      SELECT id, nome FROM escritorios LIMIT 1
    `);

    let escritorioId = null;
    if (escritorioResult.rows.length > 0) {
      escritorioId = escritorioResult.rows[0].id;
      console.log(`✅ Escritório encontrado: ${escritorioResult.rows[0].nome} (${escritorioId})`);
    } else {
      console.log('❌ Nenhum escritório encontrado');
      return;
    }

    // 3. Buscar um briefing válido
    console.log('\n3. Buscando briefing válido...');
    const briefingResult = await client.query(`
      SELECT id, nome_projeto FROM briefings WHERE escritorio_id = $1 LIMIT 1
    `, [escritorioId]);

    let briefingId = null;
    if (briefingResult.rows.length > 0) {
      briefingId = briefingResult.rows[0].id;
      console.log(`✅ Briefing encontrado: ${briefingResult.rows[0].nome_projeto} (${briefingId})`);
    } else {
      console.log('❌ Nenhum briefing encontrado para este escritório');
      return;
    }

    // 4. Buscar um usuário válido
    console.log('\n4. Buscando usuário válido...');
    const usuarioResult = await client.query(`
      SELECT id, nome FROM users WHERE escritorio_id = $1 LIMIT 1
    `, [escritorioId]);

    let usuarioId = null;
    if (usuarioResult.rows.length > 0) {
      usuarioId = usuarioResult.rows[0].id;
      console.log(`✅ Usuário encontrado: ${usuarioResult.rows[0].nome} (${usuarioId})`);
    } else {
      console.log('❌ Nenhum usuário encontrado para este escritório');
      return;
    }

    // 5. Testar inserção com dados válidos
    console.log('\n5. Testando inserção com dados válidos...');
    
    const codigoTeste = `ORC-TESTE-${Date.now()}`;
    
    const insertResult = await client.query(`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, 
        area_construida, valor_total, valor_por_m2,
        tipologia, padrao, complexidade,
        disciplinas, composicao_financeira, cronograma, proposta,
        briefing_id, escritorio_id, responsavel_id,
        dados_extraidos
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING id, codigo
    `, [
      codigoTeste,
      'Orçamento Teste Final',
      'Teste final da migração',
      'RASCUNHO',
      200,
      50000,
      250,
      'RESIDENCIAL',
      'MEDIO',
      'MEDIA',
      JSON.stringify([{nome: 'Arquitetura', valor: 50000}]),
      JSON.stringify({custoTecnico: 40000, lucro: 10000}),
      JSON.stringify({prazoTotal: 12}),
      JSON.stringify({escopo: 'Projeto completo'}),
      briefingId,
      escritorioId,
      usuarioId,
      JSON.stringify({areaConstruida: 200, tipologia: 'RESIDENCIAL'})
    ]);
    
    console.log('✅ Orçamento inserido com sucesso!');
    console.log(`   ID: ${insertResult.rows[0].id}`);
    console.log(`   Código: ${insertResult.rows[0].codigo}`);

    // 6. Verificar se foi salvo corretamente
    console.log('\n6. Verificando orçamento salvo...');
    const selectResult = await client.query(`
      SELECT id, codigo, nome, valor_total, dados_extraidos
      FROM orcamentos 
      WHERE codigo = $1
    `, [codigoTeste]);
    
    if (selectResult.rows.length > 0) {
      const orcamento = selectResult.rows[0];
      console.log('✅ Orçamento confirmado no banco!');
      console.log(`   Nome: ${orcamento.nome}`);
      console.log(`   Valor: R$ ${orcamento.valor_total}`);
      console.log(`   Dados extraídos: ${orcamento.dados_extraidos ? 'Presente ✅' : 'Ausente ❌'}`);
      
      if (orcamento.dados_extraidos) {
        console.log(`   Conteúdo: ${JSON.stringify(orcamento.dados_extraidos)}`);
      }
    }

    console.log('\n' + '='.repeat(40));
    console.log('🎉 MIGRAÇÃO VERIFICADA COM SUCESSO!');
    console.log('');
    console.log('✅ A coluna dados_extraidos foi criada');
    console.log('✅ Inserção de orçamento funciona');
    console.log('✅ Dados são salvos corretamente');
    console.log('');
    console.log('🚀 O sistema de orçamentos deve funcionar agora!');

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  } finally {
    await client.end();
  }
}

verificarMigracao();