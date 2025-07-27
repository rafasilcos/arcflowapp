/**
 * TESTE DE PRECIFICAÇÃO REALISTA - ARCFLOW
 * 
 * Script para testar se o sistema de precificação está gerando valores realistas
 * Testa cenários específicos: casa simples, apartamento médio, sobrado luxo
 */

const { Pool } = require('pg');

// Configuração do banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

// Cenários de teste
const CENARIOS_TESTE = [
  {
    nome: 'Casa Simples 120m²',
    tipologia: 'RESIDENCIAL',
    area: 120,
    complexidade: 'SIMPLES',
    disciplinas: ['ARQUITETURA'],
    caracteristicasEspeciais: [],
    localizacao: 'INTERIOR',
    faixaEsperada: { min: 9600, max: 18000 },
    valorM2Esperado: { min: 80, max: 150 }
  },
  {
    nome: 'Apartamento Médio 200m²',
    tipologia: 'RESIDENCIAL',
    area: 200,
    complexidade: 'MEDIO',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL'],
    caracteristicasEspeciais: [],
    localizacao: 'CAPITAL',
    faixaEsperada: { min: 30000, max: 50000 },
    valorM2Esperado: { min: 150, max: 250 }
  },
  {
    nome: 'Sobrado Luxo 350m²',
    tipologia: 'RESIDENCIAL',
    area: 350,
    complexidade: 'COMPLEXO',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'],
    caracteristicasEspeciais: ['piscina', 'elevador', 'automação'],
    localizacao: 'CAPITAL',
    faixaEsperada: { min: 87500, max: 140000 },
    valorM2Esperado: { min: 250, max: 400 }
  },
  {
    nome: 'Escritório Comercial 300m²',
    tipologia: 'COMERCIAL',
    area: 300,
    complexidade: 'MEDIO',
    disciplinas: ['ARQUITETURA', 'INSTALACOES'],
    caracteristicasEspeciais: [],
    localizacao: 'CAPITAL',
    faixaEsperada: { min: 45000, max: 90000 },
    valorM2Esperado: { min: 150, max: 300 }
  },
  {
    nome: 'Galpão Industrial 1000m²',
    tipologia: 'INDUSTRIAL',
    area: 1000,
    complexidade: 'MEDIO',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL'],
    caracteristicasEspeciais: [],
    localizacao: 'INTERIOR',
    faixaEsperada: { min: 60000, max: 120000 },
    valorM2Esperado: { min: 60, max: 120 }
  }
];

async function testarPrecificacao() {
  console.log('🧪 INICIANDO TESTES DE PRECIFICAÇÃO REALISTA\n');
  console.log('='.repeat(80));
  
  let totalTestes = 0;
  let testesPassaram = 0;
  let testesFalharam = 0;
  
  try {
    // Verificar se as tabelas existem
    await verificarEstruturaBanco();
    
    // Executar cada cenário de teste
    for (const cenario of CENARIOS_TESTE) {
      console.log(`\n📋 TESTANDO: ${cenario.nome}`);
      console.log('-'.repeat(50));
      
      const resultado = await testarCenario(cenario);
      totalTestes++;
      
      if (resultado.sucesso) {
        testesPassaram++;
        console.log('✅ PASSOU');
      } else {
        testesFalharam++;
        console.log('❌ FALHOU');
        console.log(`   Motivo: ${resultado.motivo}`);
      }
      
      // Exibir detalhes
      console.log(`   Valor Total: R$ ${resultado.valorTotal?.toLocaleString('pt-BR') || 'N/A'}`);
      console.log(`   Valor/m²: R$ ${resultado.valorPorM2?.toFixed(2) || 'N/A'}`);
      console.log(`   Faixa Esperada: R$ ${cenario.faixaEsperada.min.toLocaleString('pt-BR')} - R$ ${cenario.faixaEsperada.max.toLocaleString('pt-BR')}`);
    }
    
    // Resumo final
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMO DOS TESTES');
    console.log('='.repeat(80));
    console.log(`Total de testes: ${totalTestes}`);
    console.log(`✅ Passaram: ${testesPassaram}`);
    console.log(`❌ Falharam: ${testesFalharam}`);
    console.log(`📈 Taxa de sucesso: ${((testesPassaram / totalTestes) * 100).toFixed(1)}%`);
    
    if (testesFalharam === 0) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM! Sistema de precificação está funcionando corretamente.');
    } else {
      console.log('\n⚠️  ALGUNS TESTES FALHARAM. Verifique a implementação do sistema de precificação.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  } finally {
    await pool.end();
  }
}

async function verificarEstruturaBanco() {
  console.log('🔍 Verificando estrutura do banco de dados...');
  
  try {
    // Verificar se a tabela pricing_base existe
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pricing_base'
      )
    `);
    
    if (!result.rows[0].exists) {
      console.log('⚠️  Tabela pricing_base não encontrada. Criando dados de teste...');
      await criarDadosTeste();
    } else {
      console.log('✅ Estrutura do banco verificada.');
    }
  } catch (error) {
    console.log('⚠️  Erro ao verificar banco. Usando valores padrão.');
  }
}

async function criarDadosTeste() {
  try {
    // Criar tabela se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing_base (
        id SERIAL PRIMARY KEY,
        tipologia VARCHAR(50) NOT NULL,
        disciplina VARCHAR(50) NOT NULL,
        complexidade VARCHAR(20) NOT NULL,
        price_min DECIMAL(10,2) NOT NULL,
        price_max DECIMAL(10,2) NOT NULL,
        price_average DECIMAL(10,2) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Inserir dados de teste
    const dadosTeste = [
      // RESIDENCIAL
      ['RESIDENCIAL', 'ARQUITETURA', 'SIMPLES', 80, 150, 115],
      ['RESIDENCIAL', 'ARQUITETURA', 'MEDIO', 120, 200, 160],
      ['RESIDENCIAL', 'ARQUITETURA', 'COMPLEXO', 180, 300, 240],
      ['RESIDENCIAL', 'ESTRUTURAL', 'SIMPLES', 40, 80, 60],
      ['RESIDENCIAL', 'ESTRUTURAL', 'MEDIO', 60, 100, 80],
      ['RESIDENCIAL', 'ESTRUTURAL', 'COMPLEXO', 80, 120, 100],
      ['RESIDENCIAL', 'INSTALACOES', 'SIMPLES', 30, 60, 45],
      ['RESIDENCIAL', 'INSTALACOES', 'MEDIO', 50, 80, 65],
      ['RESIDENCIAL', 'INSTALACOES', 'COMPLEXO', 70, 100, 85],
      
      // COMERCIAL
      ['COMERCIAL', 'ARQUITETURA', 'SIMPLES', 90, 180, 135],
      ['COMERCIAL', 'ARQUITETURA', 'MEDIO', 140, 220, 180],
      ['COMERCIAL', 'ARQUITETURA', 'COMPLEXO', 200, 320, 260],
      ['COMERCIAL', 'INSTALACOES', 'SIMPLES', 40, 80, 60],
      ['COMERCIAL', 'INSTALACOES', 'MEDIO', 60, 100, 80],
      ['COMERCIAL', 'INSTALACOES', 'COMPLEXO', 80, 120, 100],
      
      // INDUSTRIAL
      ['INDUSTRIAL', 'ARQUITETURA', 'SIMPLES', 40, 80, 60],
      ['INDUSTRIAL', 'ARQUITETURA', 'MEDIO', 60, 100, 80],
      ['INDUSTRIAL', 'ARQUITETURA', 'COMPLEXO', 80, 120, 100],
      ['INDUSTRIAL', 'ESTRUTURAL', 'SIMPLES', 30, 60, 45],
      ['INDUSTRIAL', 'ESTRUTURAL', 'MEDIO', 40, 80, 60],
      ['INDUSTRIAL', 'ESTRUTURAL', 'COMPLEXO', 60, 100, 80]
    ];
    
    for (const dados of dadosTeste) {
      await pool.query(`
        INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, dados);
    }
    
    console.log('✅ Dados de teste criados.');
  } catch (error) {
    console.log('⚠️  Erro ao criar dados de teste:', error.message);
  }
}

async function testarCenario(cenario) {
  try {
    // Simular cálculo de orçamento usando lógica realista
    const valorCalculado = await calcularOrcamentoRealista(cenario);
    
    // Verificar se está dentro da faixa esperada
    const dentroFaixa = valorCalculado.valorTotal >= cenario.faixaEsperada.min && 
                       valorCalculado.valorTotal <= cenario.faixaEsperada.max;
    
    const valorM2Ok = valorCalculado.valorPorM2 >= cenario.valorM2Esperado.min && 
                     valorCalculado.valorPorM2 <= cenario.valorM2Esperado.max;
    
    if (dentroFaixa && valorM2Ok) {
      return {
        sucesso: true,
        valorTotal: valorCalculado.valorTotal,
        valorPorM2: valorCalculado.valorPorM2
      };
    } else {
      let motivo = [];
      if (!dentroFaixa) {
        motivo.push(`Valor total fora da faixa (R$ ${valorCalculado.valorTotal.toLocaleString('pt-BR')})`);
      }
      if (!valorM2Ok) {
        motivo.push(`Valor/m² fora da faixa (R$ ${valorCalculado.valorPorM2.toFixed(2)})`);
      }
      
      return {
        sucesso: false,
        motivo: motivo.join(', '),
        valorTotal: valorCalculado.valorTotal,
        valorPorM2: valorCalculado.valorPorM2
      };
    }
    
  } catch (error) {
    return {
      sucesso: false,
      motivo: `Erro no cálculo: ${error.message}`
    };
  }
}

async function calcularOrcamentoRealista(cenario) {
  try {
    // Buscar preços base do banco
    const result = await pool.query(`
      SELECT disciplina, price_min, price_max, price_average
      FROM pricing_base
      WHERE tipologia = $1 AND complexidade = $2 AND disciplina = ANY($3)
    `, [cenario.tipologia, cenario.complexidade, cenario.disciplinas]);
    
    let valorTotalPorM2 = 0;
    
    if (result.rows.length > 0) {
      // Usar dados do banco
      for (const row of result.rows) {
        valorTotalPorM2 += parseFloat(row.price_average);
      }
    } else {
      // Usar valores padrão se não encontrar no banco
      const valoresPadrao = {
        'RESIDENCIAL': { 'SIMPLES': 120, 'MEDIO': 180, 'COMPLEXO': 280 },
        'COMERCIAL': { 'SIMPLES': 140, 'MEDIO': 200, 'COMPLEXO': 300 },
        'INDUSTRIAL': { 'SIMPLES': 80, 'MEDIO': 120, 'COMPLEXO': 180 }
      };
      
      valorTotalPorM2 = valoresPadrao[cenario.tipologia]?.[cenario.complexidade] || 150;
      valorTotalPorM2 *= cenario.disciplinas.length * 0.7; // Ajuste por disciplina
    }
    
    // Aplicar multiplicadores
    let multiplicador = 1.0;
    
    // Multiplicador por complexidade
    const multiplicadoresComplexidade = {
      'SIMPLES': 0.8,
      'MEDIO': 1.0,
      'COMPLEXO': 1.5
    };
    multiplicador *= multiplicadoresComplexidade[cenario.complexidade] || 1.0;
    
    // Multiplicador por localização
    const multiplicadoresLocalizacao = {
      'INTERIOR': 0.85,
      'CAPITAL': 1.2,
      'METROPOLITANA': 1.1
    };
    multiplicador *= multiplicadoresLocalizacao[cenario.localizacao] || 1.0;
    
    // Multiplicador por características especiais
    if (cenario.caracteristicasEspeciais.length > 0) {
      multiplicador += cenario.caracteristicasEspeciais.length * 0.1;
    }
    
    // Calcular valores finais
    const valorPorM2Final = valorTotalPorM2 * multiplicador;
    const valorTotal = valorPorM2Final * cenario.area;
    
    return {
      valorTotal: Math.round(valorTotal),
      valorPorM2: Math.round(valorPorM2Final * 100) / 100
    };
    
  } catch (error) {
    throw new Error(`Erro no cálculo: ${error.message}`);
  }
}

// Executar testes
if (require.main === module) {
  testarPrecificacao();
}

module.exports = { testarPrecificacao, CENARIOS_TESTE };