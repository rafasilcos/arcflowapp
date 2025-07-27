/**
 * DEBUG SALVAMENTO DE ORÇAMENTO
 * 
 * Este script verifica diretamente no banco se o orçamento ID 7 existe
 * e testa a API sem autenticação para isolar o problema
 */

const { Client } = require('pg');
const axios = require('axios');

async function debugSalvamentoOrcamento() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🔍 DEBUG SALVAMENTO DE ORÇAMENTO');
    console.log('='.repeat(50));

    await client.connect();

    // 1. Verificar se orçamento ID 7 existe no banco
    console.log('\n1. Verificando orçamento ID 7 no banco...');
    const orcamento = await client.query(`
      SELECT 
        o.id,
        o.codigo,
        o.nome,
        o.valor_total,
        o.escritorio_id,
        o.briefing_id,
        o.cliente_id,
        o.responsavel_id,
        o.created_at,
        b.nome_projeto,
        c.nome as cliente_nome
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN clientes c ON o.cliente_id::text = c.id
      WHERE o.id = 7
    `);

    if (orcamento.rows.length > 0) {
      const orc = orcamento.rows[0];
      console.log('✅ Orçamento ID 7 EXISTE no banco');
      console.log(`   ID: ${orc.id}`);
      console.log(`   Código: ${orc.codigo}`);
      console.log(`   Nome: ${orc.nome}`);
      console.log(`   Valor: R$ ${orc.valor_total}`);
      console.log(`   Escritório: ${orc.escritorio_id}`);
      console.log(`   Briefing: ${orc.briefing_id} (${orc.nome_projeto})`);
      console.log(`   Cliente: ${orc.cliente_id} (${orc.cliente_nome})`);
      console.log(`   Responsável: ${orc.responsavel_id}`);
      console.log(`   Criado: ${orc.created_at}`);
    } else {
      console.log('❌ Orçamento ID 7 NÃO EXISTE no banco');
      return;
    }

    // 2. Verificar se a API está respondendo (health check)
    console.log('\n2. Testando health check da API...');
    try {
      const healthResponse = await axios.get('http://localhost:3001/health');
      console.log('✅ API está respondendo');
      console.log(`   Status: ${healthResponse.status}`);
      console.log(`   Resposta: ${JSON.stringify(healthResponse.data)}`);
    } catch (healthError) {
      console.log('❌ API não está respondendo');
      console.log(`   Erro: ${healthError.message}`);
      return;
    }

    // 3. Testar endpoint de orçamentos sem autenticação (para debug)
    console.log('\n3. Testando endpoint /api/orcamentos/7 (sem auth)...');
    try {
      const response = await axios.get('http://localhost:3001/api/orcamentos/7');
      console.log('✅ Endpoint respondeu (sem auth)');
      console.log(`   Status: ${response.status}`);
      console.log(`   Dados: ${JSON.stringify(response.data, null, 2)}`);
    } catch (apiError) {
      console.log('❌ Endpoint falhou');
      console.log(`   Status: ${apiError.response?.status}`);
      console.log(`   Erro: ${apiError.response?.data || apiError.message}`);
      
      if (apiError.response?.status === 401) {
        console.log('🔍 Erro 401 - Autenticação obrigatória (normal)');
      } else if (apiError.response?.status === 404) {
        console.log('🔍 Erro 404 - Orçamento não encontrado pela API');
        console.log('   PROBLEMA: API não consegue encontrar o orçamento que existe no banco');
      }
    }

    // 4. Verificar se há problemas na query da API
    console.log('\n4. Simulando query da API...');
    
    // Esta é provavelmente a query que a API usa
    const apiQuery = await client.query(`
      SELECT 
        o.*,
        b.nome_projeto,
        c.nome as cliente_nome,
        u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN clientes c ON o.cliente_id::text = c.id
      LEFT JOIN users u ON o.responsavel_id::text = u.id
      WHERE o.id = $1
    `, [7]);

    if (apiQuery.rows.length > 0) {
      console.log('✅ Query da API funciona no banco');
      console.log(`   Encontrou: ${apiQuery.rows[0].nome}`);
    } else {
      console.log('❌ Query da API não retorna resultados');
      console.log('   PROBLEMA: Query da API tem problema');
    }

    // 5. Verificar se o problema é com escritorio_id
    console.log('\n5. Verificando filtro por escritorio_id...');
    
    const escritorioId = orcamento.rows[0].escritorio_id;
    const queryComEscritorio = await client.query(`
      SELECT id, nome, codigo
      FROM orcamentos 
      WHERE id = $1 AND escritorio_id = $2
    `, [7, escritorioId]);

    if (queryComEscritorio.rows.length > 0) {
      console.log('✅ Query com escritorio_id funciona');
      console.log(`   Escritório: ${escritorioId}`);
    } else {
      console.log('❌ Query com escritorio_id falha');
      console.log('   PROBLEMA: Filtro de escritório está bloqueando');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNÓSTICO:');
    console.log('   1. Orçamento existe no banco ✅');
    console.log('   2. API está rodando ✅');
    console.log('   3. Problema provavelmente na query da API ou filtro de escritório');

  } catch (error) {
    console.error('❌ Erro no debug:', error);
  } finally {
    await client.end();
  }
}

debugSalvamentoOrcamento();