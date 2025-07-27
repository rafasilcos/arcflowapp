/**
 * 🧮 CALCULADORA UNIFICADA DE ORÇAMENTOS
 * 
 * Serviço centralizado para todos os cálculos de orçamento:
 * - Integração com configurações reais do escritório
 * - Cálculos baseados em disciplinas ativas
 * - Persistência automática no banco de dados
 * - Compatibilidade com briefings e entrada manual
 */

import { orcamentosAPI, CriarOrcamentoData } from './orcamentosAPI';

// Interfaces principais
export interface ParametrosCalculo {
  // Dados básicos obrigatórios
  nome: string;
  cliente_nome: string;
  area_construida: number;
  tipologia: string;
  padrao: string;
  complexidade: string;
  localizacao: string;
  
  // Dados opcionais
  area_terreno?: number;
  disciplinas?: string[];
  briefing_id?: string;
  
  // Parâmetros de cálculo
  margem_lucro?: number;
  urgencia?: string;
  observacoes?: string;
}

export interface ResultadoCalculo {
  // Valores calculados
  valor_base: number;
  valor_disciplinas: number;
  valor_subtotal: number;
  valor_impostos: number;
  valor_margem: number;
  valor_total: number;
  valor_por_m2: number;
  
  // Breakdown por disciplina
  disciplinas_valores: Record<string, {
    nome: string;
    horas_estimadas: number;
    valor_hora: number;
    valor_total: number;
    percentual: number;
  }>;
  
  // Cronograma estimado
  cronograma: {
    prazo_total_semanas: number;
    fases: Array<{
      nome: string;
      semana_inicio: number;
      semana_fim: number;
      valor: number;
      percentual: number;
    }>;
  };
  
  // Metadados
  configuracoes_utilizadas: any;
  data_calculo: string;
  versao_calculo: string;
}

export interface OrcamentoCompleto extends ResultadoCalculo {
  id: string;
  codigo: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * 🧮 CLASSE PRINCIPAL DA CALCULADORA
 */
class CalculadoraUnificada {
  private configuracoes: any = null;
  private versao = '2.0.0';

  /**
   * ⚙️ CARREGAR CONFIGURAÇÕES DO ESCRITÓRIO
   */
  private async carregarConfiguracoes(): Promise<any> {
    if (this.configuracoes) {
      return this.configuracoes;
    }

    try {
      console.log('⚙️ Carregando configurações do escritório...');
      
      const response = await orcamentosAPI.obterConfiguracoesDisciplinas();
      
      if (response.success && response.data) {
        this.configuracoes = response.data;
        console.log('✅ Configurações carregadas:', Object.keys(this.configuracoes.disciplinas || {}).length, 'disciplinas');
        return this.configuracoes;
      } else {
        throw new Error(response.error || 'Erro ao carregar configurações');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      
      // Fallback: configurações padrão
      console.log('🔄 Usando configurações padrão...');
      this.configuracoes = this.obterConfiguracoesPadrao();
      return this.configuracoes;
    }
  }

  /**
   * 🎯 CONFIGURAÇÕES PADRÃO PARA FALLBACK
   */
  private obterConfiguracoesPadrao(): any {
    return {
      disciplinas: {
        'ARQUITETURA': {
          nome: 'Projeto Arquitetônico',
          ativo: true,
          valor_base: 8000,
          valor_por_m2: 75,
          horas_estimadas: 120,
          valor_hora: 150,
          multiplicador_complexidade: {
            'Baixa': 0.8,
            'Média': 1.0,
            'Alta': 1.3,
            'Muito Alta': 1.6
          }
        },
        'ESTRUTURAL': {
          nome: 'Projeto Estrutural',
          ativo: true,
          valor_base: 6000,
          valor_por_m2: 45,
          horas_estimadas: 80,
          valor_hora: 180,
          multiplicador_complexidade: {
            'Baixa': 0.8,
            'Média': 1.0,
            'Alta': 1.4,
            'Muito Alta': 1.8
          }
        },
        'INSTALACOES_ELETRICAS': {
          nome: 'Instalações Elétricas',
          ativo: true,
          valor_base: 4000,
          valor_por_m2: 30,
          horas_estimadas: 60,
          valor_hora: 160,
          multiplicador_complexidade: {
            'Baixa': 0.9,
            'Média': 1.0,
            'Alta': 1.2,
            'Muito Alta': 1.5
          }
        },
        'INSTALACOES_HIDRAULICAS': {
          nome: 'Instalações Hidráulicas',
          ativo: true,
          valor_base: 3500,
          valor_por_m2: 25,
          horas_estimadas: 50,
          valor_hora: 160,
          multiplicador_complexidade: {
            'Baixa': 0.9,
            'Média': 1.0,
            'Alta': 1.2,
            'Muito Alta': 1.4
          }
        }
      },
      parametros_gerais: {
        margem_lucro_padrao: 0.15,
        impostos: 0.08,
        custos_indiretos: 0.12,
        multiplicador_urgencia: {
          'Normal': 1.0,
          'Urgente': 1.25,
          'Muito Urgente': 1.5
        },
        multiplicador_regional: {
          'SP': 1.15,
          'RJ': 1.12,
          'MG': 0.95,
          'RS': 1.02,
          'SC': 1.05
        }
      }
    };
  }

  /**
   * 💰 CALCULAR ORÇAMENTO COMPLETO
   */
  async calcular(parametros: ParametrosCalculo): Promise<ResultadoCalculo> {
    try {
      console.log('💰 Iniciando cálculo de orçamento:', parametros.nome);
      
      // Carregar configurações
      const config = await this.carregarConfiguracoes();
      
      // Obter disciplinas ativas
      const disciplinasAtivas = parametros.disciplinas || 
        Object.keys(config.disciplinas).filter(d => config.disciplinas[d].ativo);
      
      console.log('🎯 Disciplinas ativas:', disciplinasAtivas);
      
      // Calcular valores por disciplina
      const disciplinasValores: Record<string, any> = {};
      let valorSubtotal = 0;
      
      for (const disciplinaId of disciplinasAtivas) {
        const disciplinaConfig = config.disciplinas[disciplinaId];
        if (!disciplinaConfig) continue;
        
        // Valor base da disciplina
        let valorBase = disciplinaConfig.valor_base || 0;
        let valorPorM2 = (disciplinaConfig.valor_por_m2 || 0) * parametros.area_construida;
        
        // Aplicar multiplicador de complexidade
        const multiplicadorComplexidade = disciplinaConfig.multiplicador_complexidade?.[parametros.complexidade] || 1.0;
        
        // Aplicar multiplicador regional
        const multiplicadorRegional = config.parametros_gerais.multiplicador_regional?.[parametros.localizacao] || 1.0;
        
        // Calcular valor final da disciplina
        const valorDisciplina = (valorBase + valorPorM2) * multiplicadorComplexidade * multiplicadorRegional;
        
        disciplinasValores[disciplinaId] = {
          nome: disciplinaConfig.nome,
          horas_estimadas: disciplinaConfig.horas_estimadas || 0,
          valor_hora: disciplinaConfig.valor_hora || 0,
          valor_total: Math.round(valorDisciplina),
          percentual: 0 // Será calculado depois
        };
        
        valorSubtotal += valorDisciplina;
      }
      
      // Aplicar multiplicador de urgência
      const multiplicadorUrgencia = config.parametros_gerais.multiplicador_urgencia?.[parametros.urgencia || 'Normal'] || 1.0;
      valorSubtotal *= multiplicadorUrgencia;
      
      // Calcular impostos e custos indiretos
      const valorImpostos = valorSubtotal * (config.parametros_gerais.impostos || 0.08);
      const valorMargem = valorSubtotal * (parametros.margem_lucro || config.parametros_gerais.margem_lucro_padrao || 0.15);
      
      // Valor total
      const valorTotal = valorSubtotal + valorImpostos + valorMargem;
      const valorPorM2 = valorTotal / parametros.area_construida;
      
      // Calcular percentuais das disciplinas
      Object.keys(disciplinasValores).forEach(disciplinaId => {
        disciplinasValores[disciplinaId].percentual = 
          Math.round((disciplinasValores[disciplinaId].valor_total / valorTotal) * 100 * 100) / 100;
      });
      
      // Gerar cronograma estimado
      const cronograma = this.gerarCronograma(parametros, disciplinasAtivas, valorTotal);
      
      const resultado: ResultadoCalculo = {
        valor_base: Math.round(valorSubtotal / multiplicadorUrgencia),
        valor_disciplinas: Math.round(valorSubtotal),
        valor_subtotal: Math.round(valorSubtotal),
        valor_impostos: Math.round(valorImpostos),
        valor_margem: Math.round(valorMargem),
        valor_total: Math.round(valorTotal),
        valor_por_m2: Math.round(valorPorM2),
        disciplinas_valores: disciplinasValores,
        cronograma,
        configuracoes_utilizadas: {
          versao: this.versao,
          disciplinas_ativas: disciplinasAtivas,
          multiplicadores_aplicados: {
            complexidade: parametros.complexidade,
            regional: parametros.localizacao,
            urgencia: parametros.urgencia || 'Normal'
          }
        },
        data_calculo: new Date().toISOString(),
        versao_calculo: this.versao
      };
      
      console.log('✅ Cálculo concluído:', {
        valorTotal: resultado.valor_total,
        disciplinas: Object.keys(disciplinasValores).length,
        prazoSemanas: cronograma.prazo_total_semanas
      });
      
      return resultado;
      
    } catch (error: any) {
      console.error('❌ Erro no cálculo:', error);
      throw new Error(`Erro ao calcular orçamento: ${error.message}`);
    }
  }

  /**
   * 📅 GERAR CRONOGRAMA ESTIMADO
   */
  private gerarCronograma(parametros: ParametrosCalculo, disciplinas: string[], valorTotal: number) {
    // Calcular prazo base (1 semana por 50m² + 8 semanas base)
    const prazoBase = Math.ceil(parametros.area_construida / 50) + 8;
    
    // Multiplicador por complexidade
    const multiplicadorPrazo = {
      'Baixa': 0.8,
      'Média': 1.0,
      'Alta': 1.3,
      'Muito Alta': 1.6
    }[parametros.complexidade] || 1.0;
    
    const prazoTotal = Math.ceil(prazoBase * multiplicadorPrazo);
    
    // Fases padrão
    const fases = [
      {
        nome: 'Levantamento e Estudo Preliminar',
        percentual: 0.15,
        duracao_percentual: 0.2
      },
      {
        nome: 'Anteprojeto',
        percentual: 0.25,
        duracao_percentual: 0.3
      },
      {
        nome: 'Projeto Executivo',
        percentual: 0.45,
        duracao_percentual: 0.35
      },
      {
        nome: 'Detalhamento e Finalização',
        percentual: 0.15,
        duracao_percentual: 0.15
      }
    ];
    
    let semanaAtual = 1;
    const fasesCalculadas = fases.map(fase => {
      const duracaoFase = Math.ceil(prazoTotal * fase.duracao_percentual);
      const valorFase = Math.round(valorTotal * fase.percentual);
      
      const faseCalculada = {
        nome: fase.nome,
        semana_inicio: semanaAtual,
        semana_fim: semanaAtual + duracaoFase - 1,
        valor: valorFase,
        percentual: Math.round(fase.percentual * 100)
      };
      
      semanaAtual += duracaoFase;
      return faseCalculada;
    });
    
    return {
      prazo_total_semanas: prazoTotal,
      fases: fasesCalculadas
    };
  }

  /**
   * 💾 CALCULAR E SALVAR ORÇAMENTO
   */
  async calcularESalvar(parametros: ParametrosCalculo): Promise<OrcamentoCompleto> {
    try {
      console.log('💾 Calculando e salvando orçamento:', parametros.nome);
      
      // Calcular valores
      const resultado = await this.calcular(parametros);
      
      // Preparar dados para salvamento
      const dadosOrcamento: CriarOrcamentoData = {
        nome: parametros.nome,
        cliente_nome: parametros.cliente_nome,
        tipologia: parametros.tipologia,
        area_construida: parametros.area_construida,
        area_terreno: parametros.area_terreno,
        padrao: parametros.padrao,
        complexidade: parametros.complexidade,
        localizacao: parametros.localizacao,
        disciplinas: Object.keys(resultado.disciplinas_valores),
        briefing_id: parametros.briefing_id
      };
      
      // Salvar no banco de dados
      const response = await orcamentosAPI.criarOrcamento(dadosOrcamento);
      
      if (response.success && response.data) {
        console.log('✅ Orçamento salvo com sucesso:', response.data.codigo);
        
        return {
          ...resultado,
          id: response.data.id,
          codigo: response.data.codigo,
          status: response.data.status,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at
        };
      } else {
        throw new Error(response.error || 'Erro ao salvar orçamento');
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao calcular e salvar:', error);
      throw new Error(`Erro ao salvar orçamento: ${error.message}`);
    }
  }

  /**
   * 🧠 CALCULAR A PARTIR DE BRIEFING
   */
  async calcularDoBriefing(briefingId: string): Promise<OrcamentoCompleto> {
    try {
      console.log('🧠 Calculando orçamento do briefing:', briefingId);
      
      // Usar API direta para gerar do briefing (backend faz o cálculo)
      const response = await orcamentosAPI.gerarOrcamentoDoBriefing(briefingId);
      
      if (response.success && response.data) {
        console.log('✅ Orçamento gerado do briefing:', response.data.codigo);
        
        // Retornar dados no formato esperado
        return {
          ...response.data,
          valor_base: response.data.valor_total * 0.8, // Estimativa
          valor_disciplinas: response.data.valor_total * 0.85,
          valor_subtotal: response.data.valor_total * 0.85,
          valor_impostos: response.data.valor_total * 0.08,
          valor_margem: response.data.valor_total * 0.15,
          disciplinas_valores: {},
          cronograma: {
            prazo_total_semanas: response.data.prazo_entrega || 12,
            fases: []
          },
          configuracoes_utilizadas: { fonte: 'briefing' },
          data_calculo: new Date().toISOString(),
          versao_calculo: this.versao
        };
      } else {
        throw new Error(response.error || 'Erro ao gerar orçamento do briefing');
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao calcular do briefing:', error);
      throw new Error(`Erro ao gerar orçamento do briefing: ${error.message}`);
    }
  }
}

// Instância singleton
export const calculadoraUnificada = new CalculadoraUnificada();

// Exportar também como default
export default calculadoraUnificada;