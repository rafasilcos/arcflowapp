#!/usr/bin/env node

// SCRIPT DE VERIFICAÇÃO DE BRIEFINGS DE TESTE
// Verifica se os briefings foram criados corretamente e podem gerar orçamentos

const { Client } = require('pg');
const axios = require('axios');

// Configuração do banco de dados
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const DB_CONFIG = {
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

// Configuração da API
const API_CONFIG = {
  baseURL: process.env.API_URL || 'http://localhost:3001',
  timeout: 10000
};

class VerificadorBriefings {
  constructor() {
    this.client = null;
    this.relatorio = {
      briefings_encontrados: 0,
      briefings_validos: 0,
      briefings_com_dados_essenciais: 0,
      orcamentos_gerados: 0,
      orcamentos_falharam: 0,
      erros: [],
      detalhes: []
    };
  }

  // Conectar ao banco de dados
  async conectarBanco() {
    try {
      this.client = new Client(DB_CONFIG);
      await this.client.connect();
      console.log('✅ Conectado ao banco de dados PostgreSQL');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco:', error.message);
      return false;
    }
  }

  // Desconectar do banco
  async desconectarBanco() {
    if (this.client) {
      await this.client.end();
      console.log('🔌 Desconectado do banco de dados');
    }
  }

  // Buscar briefings de teste
  async buscarBriefingsTeste() {
    try {
      const query = `
        SELECT 
          b.id,
          b.nome_projeto,
          b.disciplina as tipo,
          b.tipologia as subtipo,
          'medio' as padrao,
          b.status,
          b.metadata as metadados,
          b.cliente_id,
          b.escritorio_id,
          b.created_at,
          c.nome as cliente_nome,
          e.nome as escritorio_nome
        FROM briefings b
        LEFT JOIN clientes c ON b.cliente_id::text = c.id
        LEFT JOIN escritorios e ON b.escritorio_id::text = e.id
        WHERE b.metadata->>'origem' = 'preenchimento_automatico'
        ORDER BY b.created_at DESC
      `;
      
      const result = await this.client.query(query);
      
      console.log(`📋 Encontrados ${result.rows.length} briefings de teste`);
      this.relatorio.briefings_encontrados = result.rows.length;
      
      return result.rows;
      
    } catch (error) {
      console.error('❌ Erro ao buscar briefings de teste:', error.message);
      this.relatorio.erros.push(`Erro ao buscar briefings: ${error.message}`);
      return [];
    }
  }

  // Verificar dados essenciais de um briefing
  verificarDadosEssenciais(briefing) {
    // Buscar dados no campo dados_extraidos (onde estão salvos) ou metadados
    const dadosExtraidos = briefing.metadados?.dados_para_orcamento || {};
    const respostas = dadosExtraidos || {};
    
    const essenciais = {
      area: respostas.area_total || dadosExtraidos.area_total || briefing.area,
      tipologia: respostas.tipologia || briefing.tipo,
      subtipologia: respostas.subtipologia || briefing.subtipo,
      padrao: respostas.padrao || respostas.padrao_acabamento || 'medio',
      estado: respostas.estado || dadosExtraidos.localizacao?.estado,
      cidade: respostas.cidade || dadosExtraidos.localizacao?.cidade
    };
    
    const faltando = [];
    Object.keys(essenciais).forEach(campo => {
      if (!essenciais[campo]) {
        faltando.push(campo);
      }
    });
    
    const valido = faltando.length === 0;
    
    if (valido) {
      this.relatorio.briefings_com_dados_essenciais++;
    }
    
    return {
      valido,
      faltando,
      dados: essenciais
    };
  }

  // Verificar estrutura do briefing
  verificarEstrutura(briefing) {
    const problemas = [];
    
    // Verificar campos obrigatórios
    if (!briefing.nome_projeto) problemas.push('Nome do projeto ausente');
    if (!briefing.tipo) problemas.push('Tipo ausente');
    if (!briefing.cliente_id) problemas.push('Cliente não associado');
    if (!briefing.escritorio_id) problemas.push('Escritório não associado');
    
    // Verificar status
    if (briefing.status !== 'CONCLUÍDO') {
      problemas.push(`Status incorreto: ${briefing.status} (deveria ser CONCLUÍDO)`);
    }
    
    // Verificar se tem dados essenciais nos metadados
    if (!briefing.metadados || !briefing.metadados.dados_para_orcamento) {
      problemas.push('Dados para orçamento ausentes nos metadados');
    }
    
    // Verificar metadados
    if (!briefing.metadados || !briefing.metadados.origem) {
      problemas.push('Metadados ausentes ou incompletos');
    }
    
    const valido = problemas.length === 0;
    
    if (valido) {
      this.relatorio.briefings_validos++;
    }
    
    return {
      valido,
      problemas
    };
  }

  // Tentar gerar orçamento para um briefing
  async testarGeracaoOrcamento(briefing) {
    try {
      console.log(`  🔄 Testando geração de orçamento para: ${briefing.nome_projeto}`);
      
      // Simular chamada para API de geração de orçamento
      // Em um ambiente real, faria uma chamada HTTP para a API
      
      // Por enquanto, vamos simular a lógica de extração de dados
      const dadosExtraidos = this.extrairDadosParaOrcamento(briefing);
      
      if (!dadosExtraidos.valido) {
        throw new Error(`Dados insuficientes: ${dadosExtraidos.problemas.join(', ')}`);
      }
      
      // Simular cálculo de orçamento
      const orcamentoSimulado = this.simularCalculoOrcamento(dadosExtraidos.dados);
      
      console.log(`  ✅ Orçamento simulado: R$ ${orcamentoSimulado.valorTotal.toLocaleString('pt-BR')}`);
      this.relatorio.orcamentos_gerados++;
      
      return {
        sucesso: true,
        orcamento: orcamentoSimulado
      };
      
    } catch (error) {
      console.log(`  ❌ Falha na geração de orçamento: ${error.message}`);
      this.relatorio.orcamentos_falharam++;
      this.relatorio.erros.push(`Orçamento ${briefing.id}: ${error.message}`);
      
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  // Extrair dados do briefing para orçamento
  extrairDadosParaOrcamento(briefing) {
    // Buscar dados nos campos corretos
    const dadosExtraidos = briefing.metadados?.dados_extraidos || {};
    const metadados = briefing.metadados?.dados_para_orcamento || {};
    const problemas = [];
    
    // Área construída - buscar em múltiplos locais
    let areaTotal = 0;
    if (dadosExtraidos.area_construida) {
      areaTotal = parseFloat(dadosExtraidos.area_construida);
    } else if (dadosExtraidos.area_total) {
      areaTotal = parseFloat(dadosExtraidos.area_total);
    } else if (metadados.area_total) {
      areaTotal = parseFloat(metadados.area_total);
    } else if (briefing.area) {
      areaTotal = parseFloat(briefing.area);
    } else {
      problemas.push('Área construída não encontrada');
    }
    
    // Tipologia
    const tipologia = metadados.tipologia || dadosExtraidos.tipologia || briefing.tipo;
    if (!tipologia) problemas.push('Tipologia não encontrada');
    
    // Subtipologia
    const subtipologia = metadados.subtipologia || dadosExtraidos.subtipologia || briefing.subtipo;
    if (!subtipologia) problemas.push('Subtipologia não encontrada');
    
    // Padrão de acabamento
    const padrao = metadados.padrao || dadosExtraidos.padrao_acabamento || briefing.padrao || 'medio';
    
    // Localização
    const localizacao = {
      estado: dadosExtraidos.estado || metadados.localizacao?.estado || 'SP',
      cidade: dadosExtraidos.cidade || metadados.localizacao?.cidade || 'São Paulo',
      bairro: dadosExtraidos.bairro || ''
    };
    
    if (!dadosExtraidos.estado && !metadados.localizacao?.estado) problemas.push('Estado não encontrado');
    if (!dadosExtraidos.cidade && !metadados.localizacao?.cidade) problemas.push('Cidade não encontrada');
    
    // Complexidade
    const complexidade = dadosExtraidos.complexidade_calculada || metadados.complexidade || this.determinarComplexidade(dadosExtraidos);
    
    const dados = {
      tipologia,
      subtipologia,
      areaTotal,
      padrao,
      complexidade,
      localizacao,
      clienteId: briefing.cliente_id,
      nomeProjeto: briefing.nome_projeto
    };
    
    return {
      valido: problemas.length === 0,
      problemas,
      dados
    };
  }

  // Determinar complexidade do projeto
  determinarComplexidade(respostas) {
    let pontuacao = 0;
    
    // Número de pavimentos
    const pavimentos = parseInt(respostas.pavimentos || respostas.andares || '1');
    if (pavimentos > 2) pontuacao += 2;
    else if (pavimentos === 2) pontuacao += 1;
    
    // Elementos especiais
    if (respostas.piscina === 'sim') pontuacao += 2;
    if (respostas.spa === 'sim' || respostas.sauna === 'sim') pontuacao += 1;
    if (respostas.elevador === 'sim') pontuacao += 2;
    if (respostas.terreno_irregular === 'sim') pontuacao += 1;
    
    // Determinar nível de complexidade
    if (pontuacao >= 6) return 'alta';
    if (pontuacao >= 3) return 'media';
    return 'baixa';
  }

  // Simular cálculo de orçamento
  simularCalculoOrcamento(dados) {
    // Valores base por m² (simulados)
    const valoresBase = {
      residencial: { baixo: 1800, medio: 2500, alto: 3500, luxo: 5000 },
      comercial: { baixo: 2000, medio: 2800, alto: 3800, luxo: 5500 },
      industrial: { baixo: 1500, medio: 2200, alto: 3000, luxo: 4000 }
    };
    
    // Mapear tipologia
    let chaveTipologia = 'residencial';
    if (dados.tipologia === 'comercial') chaveTipologia = 'comercial';
    if (dados.tipologia === 'industrial') chaveTipologia = 'industrial';
    
    // Mapear padrão
    let chavePadrao = 'medio';
    if (dados.padrao === 'simples' || dados.padrao === 'baixo') chavePadrao = 'baixo';
    if (dados.padrao === 'alto' || dados.padrao === 'superior') chavePadrao = 'alto';
    if (dados.padrao === 'luxo' || dados.padrao === 'premium') chavePadrao = 'luxo';
    
    // Valor base
    const valorBase = valoresBase[chaveTipologia][chavePadrao] || 2500;
    
    // Ajustar por complexidade
    const multiplicadorComplexidade = {
      'baixa': 0.9,
      'media': 1.0,
      'alta': 1.2
    };
    
    const valorM2 = valorBase * (multiplicadorComplexidade[dados.complexidade] || 1.0);
    const valorTotal = valorM2 * dados.areaTotal;
    
    return {
      valorTotal,
      valorM2,
      areaTotal: dados.areaTotal
    };
  }

  // Processar um briefing
  async processarBriefing(briefing) {
    console.log(`\n📋 Verificando: ${briefing.nome_projeto} (ID: ${briefing.id})`);
    
    const detalheBriefing = {
      id: briefing.id,
      nome: briefing.nome_projeto,
      tipo: `${briefing.tipo}-${briefing.subtipo}`,
      status: briefing.status,
      estrutura_valida: false,
      dados_essenciais: false,
      orcamento_gerado: false,
      problemas: [],
      dados_extraidos: null
    };
    
    // Verificar estrutura
    const estrutura = this.verificarEstrutura(briefing);
    detalheBriefing.estrutura_valida = estrutura.valido;
    if (!estrutura.valido) {
      detalheBriefing.problemas.push(...estrutura.problemas);
      console.log(`  ❌ Problemas de estrutura: ${estrutura.problemas.join(', ')}`);
    } else {
      console.log('  ✅ Estrutura válida');
    }
    
    // Verificar dados essenciais
    const dadosEssenciais = this.verificarDadosEssenciais(briefing);
    detalheBriefing.dados_essenciais = dadosEssenciais.valido;
    detalheBriefing.dados_extraidos = dadosEssenciais.dados;
    
    if (!dadosEssenciais.valido) {
      detalheBriefing.problemas.push(`Dados faltando: ${dadosEssenciais.faltando.join(', ')}`);
      console.log(`  ❌ Dados essenciais faltando: ${dadosEssenciais.faltando.join(', ')}`);
    } else {
      console.log('  ✅ Dados essenciais presentes');
    }
    
    // Testar geração de orçamento
    if (estrutura.valido && dadosEssenciais.valido) {
      const orcamento = await this.testarGeracaoOrcamento(briefing);
      detalheBriefing.orcamento_gerado = orcamento.sucesso;
      
      if (!orcamento.sucesso) {
        detalheBriefing.problemas.push(`Orçamento: ${orcamento.erro}`);
      }
    } else {
      console.log('  ⏭️  Pulando teste de orçamento (dados insuficientes)');
    }
    
    this.relatorio.detalhes.push(detalheBriefing);
  }

  // Executar verificação completa
  async executar() {
    console.log('🔍 INICIANDO VERIFICAÇÃO DE BRIEFINGS DE TESTE');
    console.log('=' .repeat(60));
    
    try {
      // Conectar ao banco
      const conectado = await this.conectarBanco();
      if (!conectado) {
        throw new Error('Não foi possível conectar ao banco de dados');
      }
      
      // Buscar briefings de teste
      const briefings = await this.buscarBriefingsTeste();
      
      if (briefings.length === 0) {
        console.log('⚠️  Nenhum briefing de teste encontrado');
        console.log('💡 Execute o script de preenchimento primeiro: node script-preenchimento-briefings.js');
        return;
      }
      
      // Processar cada briefing
      for (const briefing of briefings) {
        await this.processarBriefing(briefing);
      }
      
      // Exibir relatório final
      this.exibirRelatorio();
      
    } catch (error) {
      console.error('\n💥 ERRO CRÍTICO:', error.message);
      this.relatorio.erros.push(`Erro crítico: ${error.message}`);
    } finally {
      await this.desconectarBanco();
    }
  }

  // Exibir relatório final
  exibirRelatorio() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RELATÓRIO DE VERIFICAÇÃO');
    console.log('=' .repeat(60));
    
    console.log(`📋 Briefings encontrados: ${this.relatorio.briefings_encontrados}`);
    console.log(`✅ Briefings com estrutura válida: ${this.relatorio.briefings_validos}`);
    console.log(`📊 Briefings com dados essenciais: ${this.relatorio.briefings_com_dados_essenciais}`);
    console.log(`💰 Orçamentos gerados com sucesso: ${this.relatorio.orcamentos_gerados}`);
    console.log(`❌ Orçamentos que falharam: ${this.relatorio.orcamentos_falharam}`);
    
    if (this.relatorio.erros.length > 0) {
      console.log(`\n⚠️  ERROS ENCONTRADOS (${this.relatorio.erros.length}):`);
      this.relatorio.erros.forEach((erro, index) => {
        console.log(`  ${index + 1}. ${erro}`);
      });
    }
    
    // Resumo por categoria
    const categorias = {};
    this.relatorio.detalhes.forEach(detalhe => {
      const categoria = detalhe.tipo.split('-')[0];
      if (!categorias[categoria]) {
        categorias[categoria] = { total: 0, validos: 0, com_orcamento: 0 };
      }
      categorias[categoria].total++;
      if (detalhe.estrutura_valida && detalhe.dados_essenciais) {
        categorias[categoria].validos++;
      }
      if (detalhe.orcamento_gerado) {
        categorias[categoria].com_orcamento++;
      }
    });
    
    console.log('\n📂 RESUMO POR CATEGORIA:');
    Object.keys(categorias).forEach(categoria => {
      const stats = categorias[categoria];
      console.log(`  ${categoria.toUpperCase()}: ${stats.total} briefings, ${stats.validos} válidos, ${stats.com_orcamento} com orçamento`);
    });
    
    // Conclusão
    const taxaSucesso = this.relatorio.briefings_encontrados > 0 
      ? Math.round((this.relatorio.orcamentos_gerados / this.relatorio.briefings_encontrados) * 100)
      : 0;
    
    console.log(`\n🎯 TAXA DE SUCESSO GERAL: ${taxaSucesso}%`);
    
    if (taxaSucesso >= 80) {
      console.log('🎉 EXCELENTE! Os briefings estão funcionando corretamente.');
    } else if (taxaSucesso >= 60) {
      console.log('👍 BOM! Alguns ajustes podem ser necessários.');
    } else {
      console.log('⚠️  ATENÇÃO! Muitos problemas encontrados. Revisar implementação.');
    }
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('1. Acesse a dashboard do sistema para visualizar os briefings');
    console.log('2. Teste a geração de orçamentos manualmente');
    console.log('3. Verifique se os briefings aparecem na listagem');
  }
}

// Função principal
async function main() {
  const verificador = new VerificadorBriefings();
  await verificador.executar();
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = VerificadorBriefings;