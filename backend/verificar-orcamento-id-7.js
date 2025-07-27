/**
 * 🔍 VERIFICAR ESTRUTURA DO ORÇAMENTO ID 61
 */

const { Client } = require('pg');

async function verificarOrcamentoId61() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔍 VERIFICANDO ORÇAMENTO ID 61');
    console.log('='.repeat(50));
    
    const result = await client.query(`
      SELECT 
        o.*,
        b.nome_projeto as briefing_nome,
        c.nome as cliente_nome
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      WHERE o.id = 61
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Orçamento não encontrado');
      return;
    }
    
    const orcamento = result.rows[0];
    
    console.log('✅ ORÇAMENTO ENCONTRADO:');
    console.log(`📋 Briefing: ${orcamento.briefing_nome}`);
    console.log(`👤 Cliente: ${orcamento.cliente_nome}`);
    console.log(`💰 Valor Total: R$ ${orcamento.valor_total || 'N/A'}`);
    console.log(`📊 Status: ${orcamento.status}`);
    console.log(`📅 Criado: ${new Date(orcamento.created_at).toLocaleDateString('pt-BR')}`);
    
    console.log('\n🔧 ESTRUTURA DE DADOS:');
    console.log('Cronograma:', typeof orcamento.cronograma, orcamento.cronograma ? 'presente' : 'ausente');
    console.log('Composição:', typeof orcamento.composicao_financeira, orcamento.composicao_financeira ? 'presente' : 'ausente');
    console.log('Metadata:', typeof orcamento.metadata, orcamento.metadata ? 'presente' : 'ausente');
    
    if (orcamento.cronograma) {
      try {
        const cronogramaParsed = typeof orcamento.cronograma === 'string' 
          ? JSON.parse(orcamento.cronograma) 
          : orcamento.cronograma;
        console.log('Cronograma estrutura:', Array.isArray(cronogramaParsed) ? 'array' : typeof cronogramaParsed);
        if (Array.isArray(cronogramaParsed)) {
          console.log('Cronograma itens:', cronogramaParsed.length);
        }
      } catch (error) {
        console.log('❌ Erro ao parsear cronograma:', error.message);
      }
    }
    
    console.log('\n📄 DADOS COMPLETOS:');
    console.log(JSON.stringify(orcamento, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

verificarOrcamentoId61();