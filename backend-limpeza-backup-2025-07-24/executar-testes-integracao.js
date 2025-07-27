/**
 * EXECUTAR TESTES DE INTEGRAÇÃO - ARCFLOW
 * 
 * Script para executar testes de integração do sistema de orçamentos
 * Valida fluxo completo: briefing -> análise -> precificação -> validação
 */

const { Pool } = require('pg');
const axios = require('axios');

// Configuração
const API_BASE_URL = 'http://localhost:3001/api';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

// Cenários de teste de integração
const CENARIOS_INTEGRACAO = [
  {
    nome: 'Casa Simples - Fluxo Completo',
    briefing: {
      tipologia: 'RESIDENCIAL',
      nome_projeto: 'Casa Simples Integração',
      area_construida: 120,
      observacoes: JSON.stringify({
        respostas: {
          'tipo_construcao': 'casa térrea',
          'terreno': 'plano',
          'acabamento': 'simples',
          'piscina': 'não'
        }
      }),
      dados_extraidos: {
        disciplinasNecessarias: ['ARQUITETURA'],
        caracteristicasEspeciais: [],
        localizacao: 'INTERIOR'
      }
    },
    validacoes: {
      valorMinimo: 9600,
      valorMaximo: 18000,
      valorM2Minimo: 80,
      valorM2Maximo: 150,
      complexidadeEsperada: 'SIMPLES'
    }
  },
  {
    nome: 'Apartamento Médio - Múltiplas Disciplinas',
    briefing: {
      tipologia: 'RESIDENCIAL',
      nome_projeto: 'Apartamento Médio Integração',
      area_construida: 200,
      observacoes: JSON.stringify({
        respostas: {
          'tipo_construcao': 'apartamento',
          'pavimentos': '1',
          'acabamento': 'médio padrão'
        }
      }),
      dados_extraidos: {
        disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL'],
        caracteristicasEspeciais: [],
        localizacao: 'CAPITAL'
      }
    },
    validacoes: {
      valorMinimo: 30000,
      valorMaximo: 50000,
      valorM2Minimo: 150,
      valorM2Maximo: 250,
      complexidadeEsperada: 'MEDIO'
    }
  },
  {
    nome: 'Sobrado Luxo - Alta Complexidade',
    briefing: {
      tipologia: 'RESIDENCIAL',
      nome_projeto: 'Sobrado Luxo Integração',
      area_construida: 350,
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
        localizacao: 'CAPITAL'
      }
    },
    validacoes: {
      valorMinimo: 87500,
      valorMaximo: 140000,
      valorM2Minimo: 250,
      valorM2Maximo: 400,
      complexidadeEsperada: 'COMPLEXO'
    }
  }
];

async function executarTestesIntegracao() {
  console.log('🧪 INICIANDO TESTES DE INTEGRAÇÃO - SISTEMA DE ORÇAMENTOS\n');
  console.log('='.repeat(80));
  
  let totalTestes = 0;
  let testesPassaram = 0;
  let testesFalharam = 0;
  
  try {
    // Verificar se o servidor está rodando
    await verificarServidor();
    
    // Preparar dados de teste
    await prepararDadosTeste();
    
    // Executar cada cenário
    for (const cenario of CENARIOS_INTEGRACAO) {
      console.log(`\n📋 TESTANDO: ${cenario.nome}`);
      console.log('-'.repeat(60));
      
      const resultado = await testarCenarioCompleto(cenario);
      totalTestes++;
      
      if (resultado.sucesso) {
        testesPassaram++;
        console.log('✅ PASSOU - Fluxo completo funcionando');
      } else {
        testesFalharam++;
        console.log('❌ FALHOU');
        console.log(`   Motivo: ${resultado.motivo}`);
      }
      
      // Exibir detalhes
      if (resultado.orcamento) {
        console.log(`   Valor Total: R$ ${resultado.orcamento.valor_total?.toLocaleString('pt-BR') || 'N/A'}`);
        console.log(`   Valor/m²: R$ ${resultado.orcamento.valor_por_m2?.toFixed(2) || 'N/A'}`);
        console.log(`   Complexidade: ${resultado.orcamento.complexidade_aplicada || 'N/A'}`);
        console.log(`   Disciplinas: ${Object.keys(resultado.orcamento.detalhamento || {}).join(', ')}`);
      }
      
      console.log(`   Faixa Esperada: R$ ${cenario.validacoes.valorMinimo.toLocaleString('pt-BR')} - R$ ${cenario.validacoes.valorMaximo.toLocaleString('pt-BR')}`);
    }
    
    // Testes adicionais
    await testarValidacoes();
    await testarPerformance();
    
    // Resumo final
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMO DOS TESTES DE INTEGRAÇÃO');
    console.log('='.repeat(80));
    console.log(`Total de testes: ${totalTestes}`);
    console.log(`✅ Passaram: ${testesPassaram}`);
    console.log(`❌ Falharam: ${testesFalharam}`);
    console.log(`📈 Taxa de sucesso: ${((testesPassaram / totalTestes) * 100).toFixed(1)}%`);
    
    if (testesFalharam === 0) {
      console.log('\n🎉 TODOS OS TESTES DE INTEGRAÇÃO PASSARAM!');
      console.log('   Sistema de orçamentos está funcionando corretamente end-to-end.');
    } else {
      console.log('\n⚠️  ALGUNS TESTES FALHARAM.');
      console.log('   Verifique a integração entre os componentes do sistema.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante os testes de integração:', error.message);
  } finally {
    await pool.end();
  }
}

async function verificarServidor() {
  try {
    console.log('🔍 Verificando se o servidor está rodando...');
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/`);
    console.log('✅ Servidor está rodando.');
  } catch (error) {
    throw new Error('Servidor não está rodando. Execute: npm start');
  }
}

async function prepararDadosTeste() {
  console.log('🔧 Preparando dados de teste...');
  
  try {
    // Criar cliente de teste se não existir
    await pool.query(`
      INSERT INTO clientes (id, nome, email, telefone, escritorio_id)
      VALUES (9999, 'Cliente Teste Integração', 'integracao@teste.com', '11999999999', 1)
      ON CONFLICT (id) DO NOTHING
    `);
    
    // Criar dados de precificação se não existirem
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
    
    // Inserir dados de precificação
    const pricingData = [
      ['RESIDENCIAL', 'ARQUITETURA', 'SIMPLES', 80, 150, 115],
      ['RESIDENCIAL', 'ARQUITETURA', 'MEDIO', 120, 200, 160],
      ['RESIDENCIAL', 'ARQUITETURA', 'COMPLEXO', 180, 300, 240],
      ['RESIDENCIAL', 'ESTRUTURAL', 'SIMPLES', 40, 80, 60],
      ['RESIDENCIAL', 'ESTRUTURAL', 'MEDIO', 60, 100, 80],
      ['RESIDENCIAL', 'ESTRUTURAL', 'COMPLEXO', 80, 120, 100],
      ['RESIDENCIAL', 'INSTALACOES', 'SIMPLES', 30, 60, 45],
      ['RESIDENCIAL', 'INSTALACOES', 'MEDIO', 50, 80, 65],
      ['RESIDENCIAL', 'INSTALACOES', 'COMPLEXO', 70, 100, 85]
    ];
    
    for (const data of pricingData) {
      await pool.query(`
        INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, data);
    }
    
    console.log('✅ Dados de teste preparados.');
  } catch (error) {
    console.log('⚠️  Erro ao preparar dados de teste:', error.message);
  }
}

async function testarCenarioCompleto(cenario) {
  try {
    // 1. Criar briefing
    const briefingData = {
      ...cenario.briefing,
      cliente_id: 9999 // Cliente de teste
    };
    
    const briefingResponse = await axios.post(`${API_BASE_URL}/briefings`, briefingData, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    
    if (briefingResponse.status !== 201) {
      return {
        sucesso: false,
        motivo: `Falha ao criar briefing: ${briefingResponse.status}`
      };
    }
    
    const briefingId = briefingResponse.data.id;
    
    // 2. Gerar orçamento
    const orcamentoResponse = await axios.post(`${API_BASE_URL}/orcamentos/gerar/${briefingId}`, {}, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    
    if (orcamentoResponse.status !== 200) {
      return {
        sucesso: false,
        motivo: `Falha ao gerar orçamento: ${orcamentoResponse.status}`
      };
    }
    
    const orcamento = orcamentoResponse.data;
    
    // 3. Validar resultado
    const validacao = validarOrcamento(orcamento, cenario.validacoes);
    
    if (!validacao.valido) {
      return {
        sucesso: false,
        motivo: validacao.motivo,
        orcamento
      };
    }
    
    // 4. Limpeza
    await pool.query('DELETE FROM orcamentos WHERE briefing_id = $1', [briefingId]);
    await pool.query('DELETE FROM briefings WHERE id = $1', [briefingId]);
    
    return {
      sucesso: true,
      orcamento
    };
    
  } catch (error) {
    return {
      sucesso: false,
      motivo: `Erro na execução: ${error.message}`
    };
  }
}

function validarOrcamento(orcamento, validacoes) {
  // Validar valor total
  if (orcamento.valor_total < validacoes.valorMinimo || orcamento.valor_total > validacoes.valorMaximo) {
    return {
      valido: false,
      motivo: `Valor total fora da faixa: R$ ${orcamento.valor_total} (esperado: R$ ${validacoes.valorMinimo}-${validacoes.valorMaximo})`
    };
  }
  
  // Validar valor por m²
  if (orcamento.valor_por_m2 < validacoes.valorM2Minimo || orcamento.valor_por_m2 > validacoes.valorM2Maximo) {
    return {
      valido: false,
      motivo: `Valor/m² fora da faixa: R$ ${orcamento.valor_por_m2} (esperado: R$ ${validacoes.valorM2Minimo}-${validacoes.valorM2Maximo})`
    };
  }
  
  // Validar complexidade
  if (orcamento.complexidade_aplicada !== validacoes.complexidadeEsperada) {
    return {
      valido: false,
      motivo: `Complexidade incorreta: ${orcamento.complexidade_aplicada} (esperado: ${validacoes.complexidadeEsperada})`
    };
  }
  
  // Validar estrutura
  if (!orcamento.detalhamento || Object.keys(orcamento.detalhamento).length === 0) {
    return {
      valido: false,
      motivo: 'Detalhamento não encontrado'
    };
  }
  
  return { valido: true };
}

async function testarValidacoes() {
  console.log('\n🔒 TESTANDO VALIDAÇÕES DE SEGURANÇA');
  console.log('-'.repeat(40));
  
  try {
    // Teste: valor muito baixo
    const orcamentoBaixo = {
      briefing_id: 1,
      valor_total: 1000,
      area_construida: 150,
      tipologia: 'RESIDENCIAL'
    };
    
    const responseBaixo = await axios.post(`${API_BASE_URL}/orcamentos`, orcamentoBaixo, {
      headers: { 'Authorization': 'Bearer test-token' },
      validateStatus: () => true
    });
    
    if (responseBaixo.status === 400 && responseBaixo.data.error === 'VALOR_MUITO_BAIXO') {
      console.log('✅ Validação de valor baixo funcionando');
    } else {
      console.log('❌ Validação de valor baixo falhou');
    }
    
    // Teste: valor muito alto
    const orcamentoAlto = {
      briefing_id: 1,
      valor_total: 150000,
      area_construida: 150,
      tipologia: 'RESIDENCIAL'
    };
    
    const responseAlto = await axios.post(`${API_BASE_URL}/orcamentos`, orcamentoAlto, {
      headers: { 'Authorization': 'Bearer test-token' },
      validateStatus: () => true
    });
    
    if (responseAlto.status === 400 && responseAlto.data.error === 'VALOR_MUITO_ALTO') {
      console.log('✅ Validação de valor alto funcionando');
    } else {
      console.log('❌ Validação de valor alto falhou');
    }
    
  } catch (error) {
    console.log('⚠️  Erro ao testar validações:', error.message);
  }
}

async function testarPerformance() {
  console.log('\n⚡ TESTANDO PERFORMANCE');
  console.log('-'.repeat(30));
  
  try {
    const startTime = Date.now();
    
    // Criar briefing para teste de performance
    const briefingData = {
      cliente_id: 9999,
      tipologia: 'RESIDENCIAL',
      nome_projeto: 'Teste Performance',
      area_construida: 200,
      observacoes: JSON.stringify({
        respostas: {
          'tipo_construcao': 'casa',
          'acabamento': 'médio'
        }
      }),
      dados_extraidos: {
        disciplinasNecessarias: ['ARQUITETURA'],
        caracteristicasEspeciais: [],
        localizacao: 'INTERIOR'
      }
    };
    
    const briefingResponse = await axios.post(`${API_BASE_URL}/briefings`, briefingData, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    
    const briefingId = briefingResponse.data.id;
    
    // Gerar orçamento
    await axios.post(`${API_BASE_URL}/orcamentos/gerar/${briefingId}`, {}, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    console.log(`⏱️  Tempo de execução: ${executionTime}ms`);
    
    if (executionTime < 2000) {
      console.log('✅ Performance adequada (< 2s)');
    } else {
      console.log('⚠️  Performance pode ser melhorada (> 2s)');
    }
    
    // Limpeza
    await pool.query('DELETE FROM orcamentos WHERE briefing_id = $1', [briefingId]);
    await pool.query('DELETE FROM briefings WHERE id = $1', [briefingId]);
    
  } catch (error) {
    console.log('⚠️  Erro ao testar performance:', error.message);
  }
}

// Executar testes
if (require.main === module) {
  executarTestesIntegracao();
}

module.exports = { executarTestesIntegracao, CENARIOS_INTEGRACAO };