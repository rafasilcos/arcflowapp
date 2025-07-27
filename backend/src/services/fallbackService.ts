/**
 * Serviço de Fallback para Dados Insuficientes
 * Tarefa 11: Implementar validações e tratamento de erros
 */

import { InsufficientDataError, ERROR_CODES } from './errors/BudgetErrors';
import { DadosMinimos } from './validationService';

export interface FallbackResult {
  success: boolean;
  dadosCorrigidos: DadosMinimos;
  fallbacksAplicados: Array<{
    campo: string;
    valorOriginal: any;
    valorFallback: any;
    motivo: string;
    confianca: 'ALTA' | 'MEDIA' | 'BAIXA';
  }>;
  avisos: string[];
  recomendacoes: string[];
}

export interface FallbackConfig {
  permitirEstimativas: boolean;
  nivelConfiancaMinimo: 'ALTA' | 'MEDIA' | 'BAIXA';
  usarDadosHistoricos: boolean;
  aplicarMultiplicadoresSeguros: boolean;
}

export class FallbackService {
  private readonly configPadrao: FallbackConfig = {
    permitirEstimativas: true,
    nivelConfiancaMinimo: 'MEDIA',
    usarDadosHistoricos: true,
    aplicarMultiplicadoresSeguros: true
  };

  // Base de dados históricos para estimativas (em produção viria do banco)
  private readonly dadosHistoricos = {
    areaMediaPorTipologia: {
      'residencial': { unifamiliar: 120, multifamiliar: 80, condominio: 150 },
      'comercial': { loja: 100, escritorio: 200, shopping: 1000 },
      'industrial': { galpao: 500, fabrica: 1200, logistica: 800 },
      'institucional': { escola: 400, hospital: 600, igreja: 300 },
      'urbanistico': { praca: 2000, parque: 5000, loteamento: 10000 }
    },
    multiplicadoresPorRegiao: {
      'sudeste': 1.0,
      'sul': 0.9,
      'nordeste': 0.8,
      'centro-oeste': 0.85,
      'norte': 0.9
    },
    complexidadePorCaracteristicas: {
      'piscina': 'ALTA',
      'subsolo': 'ALTA',
      'elevador': 'MEDIA',
      'jardim': 'BAIXA',
      'garagem': 'BAIXA'
    }
  };

  /**
   * Aplica fallbacks inteligentes para dados insuficientes
   */
  public async aplicarFallbacks(
    dados: DadosMinimos,
    briefingId: string,
    config?: Partial<FallbackConfig>
  ): Promise<FallbackResult> {
    const configuracao = { ...this.configPadrao, ...config };
    const resultado: FallbackResult = {
      success: true,
      dadosCorrigidos: { ...dados },
      fallbacksAplicados: [],
      avisos: [],
      recomendacoes: []
    };

    try {
      // 1. Fallback para área construída
      if (!dados.areaConstruida) {
        const fallbackArea = await this.estimarAreaConstruida(dados, configuracao);
        if (fallbackArea.success) {
          resultado.dadosCorrigidos.areaConstruida = fallbackArea.valor;
          resultado.fallbacksAplicados.push({
            campo: 'areaConstruida',
            valorOriginal: null,
            valorFallback: fallbackArea.valor,
            motivo: fallbackArea.motivo,
            confianca: fallbackArea.confianca
          });
        }
      }

      // 2. Fallback para tipologia
      if (!dados.tipologia) {
        const fallbackTipologia = await this.inferirTipologia(dados, configuracao);
        if (fallbackTipologia.success) {
          resultado.dadosCorrigidos.tipologia = fallbackTipologia.valor;
          resultado.fallbacksAplicados.push({
            campo: 'tipologia',
            valorOriginal: null,
            valorFallback: fallbackTipologia.valor,
            motivo: fallbackTipologia.motivo,
            confianca: fallbackTipologia.confianca
          });
        }
      }

      // 3. Fallback para padrão
      if (!dados.padrao) {
        const fallbackPadrao = await this.inferirPadrao(dados, configuracao);
        resultado.dadosCorrigidos.padrao = fallbackPadrao.valor;
        resultado.fallbacksAplicados.push({
          campo: 'padrao',
          valorOriginal: null,
          valorFallback: fallbackPadrao.valor,
          motivo: fallbackPadrao.motivo,
          confianca: fallbackPadrao.confianca
        });
      }

      // 4. Fallback para complexidade
      if (!dados.complexidade) {
        const fallbackComplexidade = await this.inferirComplexidade(dados, configuracao);
        resultado.dadosCorrigidos.complexidade = fallbackComplexidade.valor;
        resultado.fallbacksAplicados.push({
          campo: 'complexidade',
          valorOriginal: null,
          valorFallback: fallbackComplexidade.valor,
          motivo: fallbackComplexidade.motivo,
          confianca: fallbackComplexidade.confianca
        });
      }

      // 5. Fallback para disciplinas necessárias
      if (!dados.disciplinasNecessarias || dados.disciplinasNecessarias.length === 0) {
        const fallbackDisciplinas = await this.definirDisciplinas(dados, configuracao);
        resultado.dadosCorrigidos.disciplinasNecessarias = fallbackDisciplinas.valor;
        resultado.fallbacksAplicados.push({
          campo: 'disciplinasNecessarias',
          valorOriginal: dados.disciplinasNecessarias || [],
          valorFallback: fallbackDisciplinas.valor,
          motivo: fallbackDisciplinas.motivo,
          confianca: fallbackDisciplinas.confianca
        });
      }

      // 6. Fallback para prazo desejado
      if (!dados.prazoDesejado) {
        const fallbackPrazo = await this.estimarPrazo(dados, configuracao);
        resultado.dadosCorrigidos.prazoDesejado = fallbackPrazo.valor;
        resultado.fallbacksAplicados.push({
          campo: 'prazoDesejado',
          valorOriginal: null,
          valorFallback: fallbackPrazo.valor,
          motivo: fallbackPrazo.motivo,
          confianca: fallbackPrazo.confianca
        });
      }

      // Gerar avisos e recomendações
      this.gerarAvisosERecomendacoes(resultado);

      // Verificar se o nível de confiança é aceitável
      const confiancaGeral = this.calcularConfiancaGeral(resultado.fallbacksAplicados);
      if (confiancaGeral === 'BAIXA' && configuracao.nivelConfiancaMinimo !== 'BAIXA') {
        resultado.avisos.push(
          'Muitos dados foram estimados com baixa confiança. Recomenda-se revisar as informações.'
        );
      }

    } catch (error) {
      resultado.success = false;
      resultado.avisos.push(`Erro ao aplicar fallbacks: ${error.message}`);
    }

    return resultado;
  }

  /**
   * Estima área construída baseada em dados disponíveis
   */
  private async estimarAreaConstruida(
    dados: DadosMinimos,
    config: FallbackConfig
  ): Promise<{ success: boolean; valor?: number; motivo: string; confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }> {
    
    // Método 1: Baseado na área do terreno
    if (dados.areaTerreno) {
      const taxaOcupacao = this.obterTaxaOcupacaoPorTipologia(dados.tipologia || 'misto');
      const areaEstimada = dados.areaTerreno * taxaOcupacao;
      
      return {
        success: true,
        valor: Math.round(areaEstimada),
        motivo: `Estimado baseado na área do terreno (${dados.areaTerreno}m²) com taxa de ocupação ${(taxaOcupacao * 100).toFixed(0)}%`,
        confianca: 'MEDIA'
      };
    }

    // Método 2: Baseado na tipologia e dados históricos
    if (dados.tipologia && config.usarDadosHistoricos) {
      const areaMedia = this.obterAreaMediaPorTipologia(dados.tipologia);
      if (areaMedia) {
        return {
          success: true,
          valor: areaMedia,
          motivo: `Estimado baseado na média histórica para tipologia "${dados.tipologia}"`,
          confianca: 'BAIXA'
        };
      }
    }

    // Método 3: Valor padrão conservador
    return {
      success: true,
      valor: 150,
      motivo: 'Valor padrão aplicado (150m²) - dados insuficientes para estimativa precisa',
      confianca: 'BAIXA'
    };
  }

  /**
   * Infere tipologia baseada em dados disponíveis
   */
  private async inferirTipologia(
    dados: DadosMinimos,
    config: FallbackConfig
  ): Promise<{ success: boolean; valor?: string; motivo: string; confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }> {
    
    // Método 1: Baseado na área construída
    if (dados.areaConstruida) {
      if (dados.areaConstruida <= 200) {
        return {
          success: true,
          valor: 'residencial',
          motivo: `Inferido como residencial baseado na área (${dados.areaConstruida}m²)`,
          confianca: 'MEDIA'
        };
      } else if (dados.areaConstruida <= 1000) {
        return {
          success: true,
          valor: 'comercial',
          motivo: `Inferido como comercial baseado na área (${dados.areaConstruida}m²)`,
          confianca: 'BAIXA'
        };
      } else {
        return {
          success: true,
          valor: 'industrial',
          motivo: `Inferido como industrial baseado na área (${dados.areaConstruida}m²)`,
          confianca: 'BAIXA'
        };
      }
    }

    // Método 2: Valor padrão
    return {
      success: true,
      valor: 'misto',
      motivo: 'Tipologia padrão aplicada - dados insuficientes para inferência',
      confianca: 'BAIXA'
    };
  }

  /**
   * Infere padrão do projeto
   */
  private async inferirPadrao(
    dados: DadosMinimos,
    config: FallbackConfig
  ): Promise<{ valor: 'SIMPLES' | 'MEDIO' | 'ALTO'; motivo: string; confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }> {
    
    // Baseado na área e tipologia
    const area = dados.areaConstruida || 150;
    const tipologia = dados.tipologia || 'misto';

    if (tipologia === 'residencial' && area <= 100) {
      return {
        valor: 'SIMPLES',
        motivo: 'Inferido como SIMPLES baseado na área residencial pequena',
        confianca: 'MEDIA'
      };
    } else if (area >= 500 || tipologia === 'institucional') {
      return {
        valor: 'ALTO',
        motivo: 'Inferido como ALTO baseado na área grande ou tipologia institucional',
        confianca: 'MEDIA'
      };
    }

    return {
      valor: 'MEDIO',
      motivo: 'Padrão MEDIO aplicado como valor conservador',
      confianca: 'BAIXA'
    };
  }

  /**
   * Infere complexidade do projeto
   */
  private async inferirComplexidade(
    dados: DadosMinimos,
    config: FallbackConfig
  ): Promise<{ valor: 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA'; motivo: string; confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }> {
    
    const area = dados.areaConstruida || 150;
    const tipologia = dados.tipologia || 'misto';
    const padrao = dados.padrao || 'MEDIO';

    // Lógica de inferência baseada em múltiplos fatores
    let pontuacaoComplexidade = 0;
    const fatores: string[] = [];

    // Fator área
    if (area <= 100) {
      pontuacaoComplexidade += 1;
      fatores.push('área pequena');
    } else if (area <= 500) {
      pontuacaoComplexidade += 2;
      fatores.push('área média');
    } else if (area <= 2000) {
      pontuacaoComplexidade += 3;
      fatores.push('área grande');
    } else {
      pontuacaoComplexidade += 4;
      fatores.push('área muito grande');
    }

    // Fator tipologia
    const complexidadePorTipologia: Record<string, number> = {
      'residencial': 1,
      'comercial': 2,
      'institucional': 3,
      'industrial': 3,
      'urbanistico': 4,
      'misto': 2
    };
    pontuacaoComplexidade += complexidadePorTipologia[tipologia] || 2;
    fatores.push(`tipologia ${tipologia}`);

    // Fator padrão
    const complexidadePorPadrao: Record<string, number> = {
      'SIMPLES': 1,
      'MEDIO': 2,
      'ALTO': 3
    };
    pontuacaoComplexidade += complexidadePorPadrao[padrao];
    fatores.push(`padrão ${padrao}`);

    // Determinar complexidade final
    let complexidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA';
    if (pontuacaoComplexidade <= 4) {
      complexidade = 'BAIXA';
    } else if (pontuacaoComplexidade <= 6) {
      complexidade = 'MEDIA';
    } else if (pontuacaoComplexidade <= 8) {
      complexidade = 'ALTA';
    } else {
      complexidade = 'MUITO_ALTA';
    }

    return {
      valor: complexidade,
      motivo: `Inferido como ${complexidade} baseado em: ${fatores.join(', ')}`,
      confianca: 'MEDIA'
    };
  }

  /**
   * Define disciplinas necessárias
   */
  private async definirDisciplinas(
    dados: DadosMinimos,
    config: FallbackConfig
  ): Promise<{ valor: string[]; motivo: string; confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }> {
    
    const tipologia = dados.tipologia || 'misto';
    const area = dados.areaConstruida || 150;
    const complexidade = dados.complexidade || 'MEDIA';

    const disciplinasPorTipologia: Record<string, string[]> = {
      'residencial': ['arquitetura', 'estrutural', 'instalacoes'],
      'comercial': ['arquitetura', 'estrutural', 'instalacoes', 'incendio'],
      'industrial': ['arquitetura', 'estrutural', 'instalacoes', 'incendio', 'ambiental'],
      'institucional': ['arquitetura', 'estrutural', 'instalacoes', 'incendio', 'acessibilidade'],
      'urbanistico': ['arquitetura', 'urbanismo', 'paisagismo', 'infraestrutura'],
      'misto': ['arquitetura', 'estrutural', 'instalacoes']
    };

    let disciplinas = disciplinasPorTipologia[tipologia] || disciplinasPorTipologia['misto'];

    // Adicionar disciplinas baseadas na complexidade e área
    if (area > 1000 || complexidade === 'ALTA' || complexidade === 'MUITO_ALTA') {
      if (!disciplinas.includes('incendio')) disciplinas.push('incendio');
      if (!disciplinas.includes('acessibilidade')) disciplinas.push('acessibilidade');
    }

    if (tipologia === 'residencial' && area > 300) {
      if (!disciplinas.includes('paisagismo')) disciplinas.push('paisagismo');
    }

    return {
      valor: disciplinas,
      motivo: `Disciplinas definidas baseadas na tipologia "${tipologia}" e características do projeto`,
      confianca: 'ALTA'
    };
  }

  /**
   * Estima prazo do projeto
   */
  private async estimarPrazo(
    dados: DadosMinimos,
    config: FallbackConfig
  ): Promise<{ valor: number; motivo: string; confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }> {
    
    const area = dados.areaConstruida || 150;
    const complexidade = dados.complexidade || 'MEDIA';
    const disciplinas = dados.disciplinasNecessarias || ['arquitetura'];

    // Fórmula base: 0.5 dias por m² + fatores de complexidade e disciplinas
    let prazoBase = area * 0.5;

    // Multiplicador por complexidade
    const multiplicadorComplexidade: Record<string, number> = {
      'BAIXA': 0.8,
      'MEDIA': 1.0,
      'ALTA': 1.3,
      'MUITO_ALTA': 1.6
    };
    prazoBase *= multiplicadorComplexidade[complexidade];

    // Adicionar tempo por disciplina adicional
    const tempoAdicionalPorDisciplina = 15; // dias
    const disciplinasAdicionais = Math.max(0, disciplinas.length - 1);
    prazoBase += disciplinasAdicionais * tempoAdicionalPorDisciplina;

    // Limites mínimo e máximo
    const prazoFinal = Math.max(30, Math.min(365, Math.round(prazoBase)));

    return {
      valor: prazoFinal,
      motivo: `Estimado baseado na área (${area}m²), complexidade (${complexidade}) e ${disciplinas.length} disciplinas`,
      confianca: 'MEDIA'
    };
  }

  // Métodos auxiliares

  private obterTaxaOcupacaoPorTipologia(tipologia: string): number {
    const taxas: Record<string, number> = {
      'residencial': 0.6,
      'comercial': 0.8,
      'industrial': 0.7,
      'institucional': 0.5,
      'urbanistico': 0.3,
      'misto': 0.6
    };
    return taxas[tipologia] || 0.6;
  }

  private obterAreaMediaPorTipologia(tipologia: string): number | null {
    const areas: Record<string, number> = {
      'residencial': 120,
      'comercial': 200,
      'industrial': 500,
      'institucional': 300,
      'urbanistico': 1000,
      'misto': 150
    };
    return areas[tipologia] || null;
  }

  private gerarAvisosERecomendacoes(resultado: FallbackResult): void {
    const fallbacksBaixaConfianca = resultado.fallbacksAplicados.filter(f => f.confianca === 'BAIXA');
    
    if (fallbacksBaixaConfianca.length > 0) {
      resultado.avisos.push(
        `${fallbacksBaixaConfianca.length} campo(s) foram estimados com baixa confiança: ${
          fallbacksBaixaConfianca.map(f => f.campo).join(', ')
        }`
      );
    }

    if (resultado.fallbacksAplicados.length > 3) {
      resultado.recomendacoes.push(
        'Muitos dados foram estimados. Recomenda-se revisar o briefing e fornecer informações mais precisas.'
      );
    }

    if (resultado.fallbacksAplicados.some(f => f.campo === 'areaConstruida')) {
      resultado.recomendacoes.push(
        'A área construída foi estimada. Para um orçamento mais preciso, forneça a área real do projeto.'
      );
    }

    if (resultado.fallbacksAplicados.some(f => f.campo === 'tipologia')) {
      resultado.recomendacoes.push(
        'A tipologia foi inferida automaticamente. Confirme se está correta para garantir a precisão do orçamento.'
      );
    }
  }

  private calcularConfiancaGeral(fallbacks: Array<{ confianca: 'ALTA' | 'MEDIA' | 'BAIXA' }>): 'ALTA' | 'MEDIA' | 'BAIXA' {
    if (fallbacks.length === 0) return 'ALTA';

    const pontuacao = fallbacks.reduce((acc, f) => {
      switch (f.confianca) {
        case 'ALTA': return acc + 3;
        case 'MEDIA': return acc + 2;
        case 'BAIXA': return acc + 1;
        default: return acc;
      }
    }, 0);

    const media = pontuacao / fallbacks.length;
    
    if (media >= 2.5) return 'ALTA';
    if (media >= 1.5) return 'MEDIA';
    return 'BAIXA';
  }
}

export const fallbackService = new FallbackService();