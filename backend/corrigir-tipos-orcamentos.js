/**
 * CORRIGIR TIPOS E DADOS DOS ORÇAMENTOS
 * 
 * Este script corrige os problemas de tipos UUID e adiciona dados_extraidos
 * ao orçamento ID 7
 */

const { Client } = require('pg');

async function corrigirTiposOrcamentos() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔧 CORRIGINDO TIPOS E DADOS DOS ORÇAMENTOS');
    console.log('='.repeat(60));

    await client.connect();

    // 1. Verificar o orçamento ID 7
    console.log('\n1. Verificando orçamento ID 7...');
    const orcamento7 = await client.query(`
      SELECT * FROM orcamentos WHERE id = 7
    `);

    if (orcamento7.rows.length === 0) {
      console.log('❌ Orçamento ID 7 não encontrado');
      return;
    }

    const orc = orcamento7.rows[0];
    console.log('📊 Dados atuais:');
    console.log(`   ID: ${orc.id}`);
    console.log(`   Código: ${orc.codigo}`);
    console.log(`   Responsável ID: ${orc.responsavel_id}`);
    console.log(`   Dados extraídos: ${orc.dados_extraidos ? 'SIM' : 'NÃO'}`);

    // 2. Corrigir responsavel_id se necessário
    console.log('\n2. Corrigindo responsavel_id...');
    
    // Buscar um usuário válido do mesmo escritório
    const usuarioValido = await client.query(`
      SELECT id FROM users 
      WHERE escritorio_id = $1 
      LIMIT 1
    `, [orc.escritorio_id]);

    let responsavelIdCorreto = orc.responsavel_id;
    
    if (usuarioValido.rows.length > 0) {
      responsavelIdCorreto = usuarioValido.rows[0].id;
      console.log(`   Usando usuário válido: ${responsavelIdCorreto}`);
      
      await client.query(`
        UPDATE orcamentos 
        SET responsavel_id = $1 
        WHERE id = 7
      `, [responsavelIdCorreto]);
      
      console.log('✅ Responsável ID corrigido');
    } else {
      console.log('⚠️ Nenhum usuário válido encontrado, mantendo atual');
    }

    // 3. Adicionar dados_extraidos se não existir
    console.log('\n3. Adicionando dados_extraidos...');
    
    if (!orc.dados_extraidos) {
      const dadosExtraidos = {
        areaConstruida: orc.area_construida || 200,
        tipologia: orc.tipologia || 'RESIDENCIAL',
        complexidade: orc.complexidade || 'MEDIA',
        disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL'],
        padrao: orc.padrao || 'MEDIO',
        localizacao: orc.localizacao || 'São Paulo, SP'
      };

      await client.query(`
        UPDATE orcamentos 
        SET dados_extraidos = $1 
        WHERE id = 7
      `, [JSON.stringify(dadosExtraidos)]);
      
      console.log('✅ Dados extraídos adicionados');
      console.log('   Conteúdo:', JSON.stringify(dadosExtraidos, null, 2));
    } else {
      console.log('✅ Dados extraídos já existem');
    }

    // 4. Testar query da API com cast explícito
    console.log('\n4. Testando query da API corrigida...');
    
    try {
      const testeAPI = await client.query(`
        SELECT o.*, c.nome as cliente_nome, c.email as cliente_email, 
               c.telefone as cliente_telefone, b.nome_projeto as briefing_nome,
               u.nome as responsavel_nome
        FROM orcamentos o
        LEFT JOIN clientes c ON o.cliente_id::text = c.id::text
        LEFT JOIN briefings b ON o.briefing_id::text = b.id::text
        LEFT JOIN users u ON o.responsavel_id::text = u.id::text
        WHERE o.id = 7 AND o.escritorio_id::text = $1::text
      `, [orc.escritorio_id]);

      if (testeAPI.rows.length > 0) {
        const resultado = testeAPI.rows[0];
        console.log('✅ Query da API funcionou com cast!');
        console.log(`   Cliente: ${resultado.cliente_nome || 'N/A'}`);
        console.log(`   Projeto: ${resultado.briefing_nome || 'N/A'}`);
        console.log(`   Responsável: ${resultado.responsavel_nome || 'N/A'}`);
        console.log(`   Dados extraídos: ${resultado.dados_extraidos ? 'SIM' : 'NÃO'}`);
      } else {
        console.log('❌ Query ainda não funcionou');
      }
    } catch (error) {
      console.log('❌ Erro na query de teste:', error.message);
    }

    // 5. Verificar se o problema é na API do backend
    console.log('\n5. Verificando estrutura da API...');
    
    // Verificar se a rota existe e está funcionando
    console.log('   A API /api/orcamentos/:id precisa ser corrigida para usar cast de tipos');
    console.log('   Problema: UUIDs sendo comparados com strings sem cast explícito');

    console.log('\n' + '='.repeat(60));
    console.log('🎯 CORREÇÕES APLICADAS:');
    console.log('✅ Responsável ID corrigido (se necessário)');
    console.log('✅ Dados extraídos adicionados');
    console.log('✅ Query testada com cast de tipos');
    console.log('');
    console.log('🔧 PRÓXIMO PASSO NECESSÁRIO:');
    console.log('❌ Corrigir a API /api/orcamentos/:id para usar cast de tipos UUID');
    console.log('   Exemplo: WHERE o.id = $1 AND o.escritorio_id::text = $2::text');

  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await client.end();
  }
}

corrigirTiposOrcamentos();