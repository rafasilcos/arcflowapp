/**
 * CORRIGIR BRIEFINGS DE TESTE - ARCFLOW
 * 
 * Regenera orçamentos dos briefings existentes com o novo sistema
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function corrigirBriefingsTeste() {
  console.log('🔧 CORRIGINDO BRIEFINGS DE TESTE COM NOVO SISTEMA');
  console.log('='.repeat(60));
  
  try {
    // 1. Buscar briefings existentes
    const briefings = await pool.query(`
      SELECT id, nome_projeto, tipologia, area, observacoes, dados_extraidos
      FROM briefings 
      WHERE nome_projeto LIKE '%teste%' OR nome_projeto LIKE '%Teste%'
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    console.log(`📋 Encontrados ${briefings.rows.length} briefings de teste`);
    
    if (briefings.rows.length === 0) {
      console.log('⚠️  Nenhum briefing de teste encontrado. Criando novos...');
      await criarBriefingsTeste();
      return;
    }
    
    // 2. Regenerar orçamentos
    for (const briefing of briefings.rows) {
      console.log(`\\n🔄 Processando: ${briefing.nome_projeto}`);
      
      try {
        // Deletar orçamento antigo se existir
        await pool.query('DELETE FROM orcamentos WHERE briefing_id = $1', [briefing.id]);
        
        // Gerar novo orçamento
        const novoOrcamento = await gerarOrcamentoRealista(briefing);
        
        if (novoOrcamento) {
          console.log(`   ✅ Novo orçamento: R$ ${novoOrcamento.valor_total.toLocaleString('pt-BR')} (R$ ${novoOrcamento.valor_por_m2.toFixed(2)}/m²)`);
        } else {
          console.log(`   ❌ Falha ao gerar orçamento`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }
    
    // 3. Mostrar resumo
    await mostrarResumoOrcamentos();
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await pool.end();
  }
}

async function criarBriefingsTeste() {
  console.log('🏗️  Criando briefings de teste...');
  
  const briefingsTeste = [
    {
      nome_projeto: 'Casa Simples Teste - 120m²',
      tipologia: 'RESIDENCIAL',
      area: 120,
      observacoes: JSON.stringify({
        respostas: {
          'tipo_construcao': 'casa térrea',
          'terreno': 'plano',
          'acabamento': 'simples',
          'piscina': 'não',
          'elevador': 'não'
        }
      }),
      dados_extraidos: {
        disciplinasNecessarias: ['ARQUITETURA'],
        caracteristicasEspeciais: [],
        localizacao: 'INTERIOR',
        complexidadeEstimada: 'SIMPLES'
      }
    },
    {
      nome_projeto: 'Apartamento Médio Teste - 200m²',
      tipologia: 'RESIDENCIAL',
      area: 200,
      observacoes: JSON.stringify({
        respostas: {
          'tipo_construcao': 'apartamento',
          'pavimentos': '1',
          'acabamento': 'médio padrão',
          'piscina': 'não',
          'elevador': 'não'
        }
      }),
      dados_extraidos: {
        disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL'],
        caracteristicasEspeciais: [],
        localizacao: 'CAPITAL',
        complexidadeEstimada: 'MEDIO'
      }
    },
    {
      nome_projeto: 'Sobrado Luxo Teste - 350m²',
      tipologia: 'RESIDENCIAL',
      area: 350,
      observacoes: JSON.stringify({
        respostas: {
          'tipo_construcao': 'sobrado',
          'pavimentos': '3',
          'piscina': 'sim, aquecida',
          'elevador': 'sim',
          'automacao': 'completa',
          'acabamento': 'alto padrão'
        }
      }),
      dados_extraidos: {
        disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'],
        caracteristicasEspeciais: ['piscina', 'elevador', 'automação'],
        localizacao: 'CAPITAL',
        complexidadeEstimada: 'COMPLEXO'
      }
    }
  ];
  
  for (const briefing of briefingsTeste) {
    try {
      // Criar cliente de teste se não existir
      await pool.query(`
        INSERT INTO clientes (id, nome, email, telefone, escritorio_id)
        VALUES (9999, 'Cliente Teste', 'teste@arcflow.com', '11999999999', 1)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Criar briefing
      const result = await pool.query(`
        INSERT INTO briefings (cliente_id, nome_projeto, tipologia, area, observacoes, dados_extraidos)
        VALUES (9999, $1, $2, $3, $4, $5)
        RETURNING id
      `, [
        briefing.nome_projeto,
        briefing.tipologia,
        briefing.area,
        briefing.observacoes,
        JSON.stringify(briefing.dados_extraidos)
      ]);
      
      const briefingId = result.rows[0].id;
      
      // Gerar orçamento
      const orcamento = await gerarOrcamentoRealista({
        id: briefingId,
        ...briefing
      });
      
      if (orcamento) {
        console.log(`   ✅ ${briefing.nome_projeto}: R$ ${orcamento.valor_total.toLocaleString('pt-BR')}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Erro ao criar ${briefing.nome_projeto}:`, error.message);
    }
  }
}

async function gerarOrcamentoRealista(briefing) {
  try {
    // Extrair dados do briefing
    const tipologia = briefing.tipologia || 'RESIDENCIAL';
    const area = briefing.area || 150;
    
    let dadosExtraidos = {};
    try {
      dadosExtraidos = typeof briefing.dados_extraidos === 'string' 
        ? JSON.parse(briefing.dados_extraidos) 
        : briefing.dados_extraidos || {};
    } catch (e) {
      dadosExtraidos = {};
    }
    
    let respostas = {};
    try {
      const obs = typeof briefing.observacoes === 'string' 
        ? JSON.parse(briefing.observacoes) 
        : briefing.observacoes || {};
      respostas = obs.respostas || {};
    } catch (e) {
      respostas = {};
    }
    
    // Determinar disciplinas
    const disciplinas = dadosExtraidos.disciplinasNecessarias || ['ARQUITETURA'];
    
    // Analisar complexidade
    let complexidade = 'MEDIO';
    const caracteristicas = dadosExtraidos.caracteristicasEspeciais || [];
    
    if (caracteristicas.length === 0 && area < 150) {
      complexidade = 'SIMPLES';
    } else if (caracteristicas.length > 2 || area > 300) {
      complexidade = 'COMPLEXO';
    }
    
    // Buscar preços base
    const precosResult = await pool.query(`
      SELECT disciplina, price_average
      FROM pricing_base
      WHERE tipologia = $1 AND complexidade = $2 AND disciplina = ANY($3) AND active = true
    `, [tipologia, complexidade, disciplinas]);
    
    let valorPorM2 = 0;
    const detalhamento = {};
    
    if (precosResult.rows.length > 0) {
      for (const row of precosResult.rows) {
        const valor = parseFloat(row.price_average);
        valorPorM2 += valor;
        detalhamento[row.disciplina] = valor * area;
      }
    } else {
      // Valores padrão se não encontrar no banco
      const valoresPadrao = {
        'RESIDENCIAL': { 'SIMPLES': 115, 'MEDIO': 160, 'COMPLEXO': 240 },
        'COMERCIAL': { 'SIMPLES': 135, 'MEDIO': 180, 'COMPLEXO': 260 },
        'INDUSTRIAL': { 'SIMPLES': 60, 'MEDIO': 80, 'COMPLEXO': 100 }
      };
      
      valorPorM2 = valoresPadrao[tipologia]?.[complexidade] || 150;
      detalhamento['ARQUITETURA'] = valorPorM2 * area;
    }
    
    // Aplicar multiplicadores
    let multiplicador = 1.0;
    
    // Multiplicador por localização
    const localizacao = dadosExtraidos.localizacao || 'INTERIOR';
    if (localizacao === 'CAPITAL') {
      multiplicador *= 1.2;
    } else if (localizacao === 'METROPOLITANA') {
      multiplicador *= 1.1;
    } else {
      multiplicador *= 0.9;
    }
    
    // Multiplicador por características especiais
    if (caracteristicas.length > 0) {
      multiplicador += caracteristicas.length * 0.05;
    }
    
    // Calcular valores finais
    const valorFinalPorM2 = valorPorM2 * multiplicador;
    const valorTotal = Math.round(valorFinalPorM2 * area);
    
    // Salvar no banco
    const orcamentoResult = await pool.query(`
      INSERT INTO orcamentos (
        briefing_id, valor_total, valor_por_m2, tipologia, area_construida,
        disciplinas, complexidade, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [
      briefing.id,
      valorTotal,
      Math.round(valorFinalPorM2 * 100) / 100,
      tipologia,
      area,
      JSON.stringify(Object.keys(detalhamento)),
      complexidade
    ]);
    
    return orcamentoResult.rows[0];
    
  } catch (error) {
    console.error('Erro ao gerar orçamento:', error);
    return null;
  }
}

async function mostrarResumoOrcamentos() {
  console.log('\\n📊 RESUMO DOS ORÇAMENTOS ATUALIZADOS');
  console.log('='.repeat(50));
  
  const result = await pool.query(`
    SELECT 
      b.nome_projeto,
      b.tipologia,
      b.area,
      o.valor_total,
      o.valor_por_m2,
      o.complexidade
    FROM briefings b
    JOIN orcamentos o ON b.id = o.briefing_id
    WHERE b.nome_projeto LIKE '%teste%' OR b.nome_projeto LIKE '%Teste%'
    ORDER BY o.created_at DESC
  `);
  
  result.rows.forEach(row => {
    console.log(`\\n📋 ${row.nome_projeto}`);
    console.log(`   Tipologia: ${row.tipologia}`);
    console.log(`   Área: ${row.area}m²`);
    console.log(`   Complexidade: ${row.complexidade}`);
    console.log(`   Valor Total: R$ ${row.valor_total.toLocaleString('pt-BR')}`);
    console.log(`   Valor/m²: R$ ${parseFloat(row.valor_por_m2).toFixed(2)}`);
  });
  
  console.log('\\n🎉 CORREÇÃO CONCLUÍDA!');
  console.log('\\n📋 COMO TESTAR:');
  console.log('   1. Acesse o sistema ArcFlow');
  console.log('   2. Vá em "Orçamentos" no menu');
  console.log('   3. Veja os orçamentos atualizados com valores realistas');
  console.log('   4. Crie novos briefings - eles usarão o novo sistema automaticamente');
}

// Executar correção
if (require.main === module) {
  corrigirBriefingsTeste();
}

module.exports = { corrigirBriefingsTeste };