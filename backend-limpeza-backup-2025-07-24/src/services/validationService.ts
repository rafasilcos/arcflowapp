/**
 * Serviço de Validação para Sistema de Orçamentos
 * Tarefa 11: Implementar validações e tratamento de erros
 */

import { 
  BriefingAnalysisError, 
  BudgetCalculationError, 
  DataValidationError, 
  InsufficientDataError,
  ERROR_CODES 
} from './errors/BudgetErrors';

export interface DadosMinimos {
  areaConstruida?: number;
  areaTerreno?: number;
  tipologia?: string;
  padrao?: 'SIMPLES' | 'MEDIO' | 'ALTO';
  complexidade?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA';
  disciplinasNecessarias?: string[];
  localizacao?: string;
  prazoDesejado?: number;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: string[];
  avisos: string[];
  dadosFaltantes: string[];
  sugestoesFallback: string[];
  dadosCorrigidos?: DadosMinimos;
}

export interface ConfiguracaoValidacao {
  areaMinima: number;
  areaMaxima: number;
  tipologiasValidas: string[];
  disciplinasObrigatorias: string[];
  prazoMinimo: number;
  prazoMaximo: number;
}

export class ValidationService {
  private readonly configuracaoPadrao: ConfiguracaoValidacao = {
    areaMinima: 10, // m²
    areaMaxima: 100000, // m²
    tipologiasValidas: [
      'residencial', 'comercial', 'industrial', 
      'institucional', 'urbanistico', 'misto'
    ],
    disciplinasObrigatorias: ['arquitetura'],
    prazoMinimo: 7, // dias
    prazoMaximo: 730 // dias (2 anos)
  };

  /**
   * Valida dados mínimos necessários para orçamentação
   */
  public validarDadosMinimos(
    dados: DadosMinimos, 
    briefingId: string,
    configuracao?: Partial<ConfiguracaoValidacao>
  ): ResultadoValidacao {
    const config = { ...this.configuracaoPadrao, ...configuracao };
    const resultado: ResultadoValidacao = {
      valido: true,
      erros: [],
      avisos: [],
      dadosFaltantes: [],
      sugestoesFallback: []
    };

    // Validação de área construída (obrigatória)
    if (!dados.areaConstruida) {
      resultado.valido = false;
      resultado.erros.push('Área construída é obrigatória');
      resultado.dadosFaltantes.push('areaConstruida');
      resultado.sugestoesFallback.push('Estimar área baseada na tipologia do projeto');
    } else if (dados.areaConstruida < config.areaMinima || dados.areaConstruida > config.areaMaxima) {
      resultado.valido = false;
      resultado.erros.push(
        `Área construída deve estar entre ${config.areaMinima}m² e ${config.areaMaxima.toLocaleString('pt-BR')}m²`
      );
    }

    // Validação de tipologia (obrigatória)
    if (!dados.tipologia) {
      resultado.valido = false;
      resultado.erros.push('Tipologia do projeto é obrigatória');
      resultado.dadosFaltantes.push('tipologia');
      resultado.sugestoesFallback.push('Usar tipologia "misto" como padrão');
    } else if (!config.tipologiasValidas.includes(dados.tipologia.toLowerCase())) {
      resultado.avisos.push(
        `Tipologia "${dados.tipologia}" não reconhecida. Tipologias válidas: ${config.tipologiasValidas.join(', ')}`
      );
      resultado.sugestoesFallback.push('Mapear para tipologia mais próxima');
    }

    // Validação de padrão (opcional, mas recomendado)
    if (!dados.padrao) {
      resultado.avisos.push('Padrão do projeto não informado');
      resultado.sugestoesFallback.push('Usar padrão "MEDIO" como padrão');
    }

    // Validação de complexidade (opcional, mas recomendado)
    if (!dados.complexidade) {
      resultado.avisos.push('Complexidade do projeto não informada');
      resultado.sugestoesFallback.push('Inferir complexidade baseada na área e tipologia');
    }

    // Validação de disciplinas necessárias
    if (!dados.disciplinasNecessarias || dados.disciplinasNecessarias.length === 0) {
      resultado.avisos.push('Disciplinas necessárias não informadas');
      resultado.sugestoesFallback.push('Usar disciplinas padrão baseadas na tipologia');
    } else {
      const disciplinasFaltantes = config.disciplinasObrigatorias.filter(
        disciplina => !dados.disciplinasNecessarias!.includes(disciplina)
      );
      if (disciplinasFaltantes.length > 0) {
        resultado.avisos.push(
          `Disciplinas obrigatórias faltantes: ${disciplinasFaltantes.join(', ')}`
        );
      }
    }

    // Validação de prazo (opcional)
    if (dados.prazoDesejado) {
      if (dados.prazoDesejado < config.prazoMinimo || dados.prazoDesejado > config.prazoMaximo) {
        resultado.avisos.push(
          `Prazo desejado fora do intervalo recomendado (${config.prazoMinimo}-${config.prazoMaximo} dias)`
        );
      }
    }

    // Validação de área do terreno (opcional, mas útil para alguns cálculos)
    if (dados.areaTerreno && dados.areaConstruida && dados.areaTerreno < dados.areaConstruida) {
      resultado.avisos.push('Área do terreno menor que área construída - verificar dados');
    }

    return resultado;
  }

  /**
   * Aplica fallbacks para dados insuficientes
   */
  public aplicarFallbacks(
    dados: DadosMinimos, 
    briefingId: string
  ): { dadosCorrigidos: DadosMinimos; fallbacksAplicados: string[] } {
    const dadosCorrigidos = { ...dados };
    const fallbacksAplicados: string[] = [];

    // Fallback para área construída (estimativa baseada na tipologia)
    if (!dadosCorrigidos.areaConstruida && dadosCorrigidos.tipologia) {
      const areaEstimada = this.estimarAreaPorTipologia(dadosCorrigidos.tipologia);
      dadosCorrigidos.areaConstruida = areaEstimada;
      fallbacksAplicados.push(`Área construída estimada: ${areaEstimada}m² (baseada na tipologia)`);
    }

    // Fallback para tipologia
    if (!dadosCorrigidos.tipologia) {
      dadosCorrigidos.tipologia = 'misto';
      fallbacksAplicados.push('Tipologia definida como "misto" (padrão)');
    }

    // Fallback para padrão
    if (!dadosCorrigidos.padrao) {
      dadosCorrigidos.padrao = 'MEDIO';
      fallbacksAplicados.push('Padrão definido como "MEDIO" (padrão)');
    }

    // Fallback para complexidade (baseado na área e tipologia)
    if (!dadosCorrigidos.complexidade) {
      dadosCorrigidos.complexidade = this.inferirComplexidade(
        dadosCorrigidos.areaConstruida || 0,
        dadosCorrigidos.tipologia || 'misto'
      );
      fallbacksAplicados.push(`Complexidade inferida: ${dadosCorrigidos.complexidade}`);
    }

    // Fallback para disciplinas necessárias
    if (!dadosCorrigidos.disciplinasNecessarias || dadosCorrigidos.disciplinasNecessarias.length === 0) {
      dadosCorrigidos.disciplinasNecessarias = this.obterDisciplinasPorTipologia(
        dadosCorrigidos.tipologia || 'misto'
      );
      fallbacksAplicados.push(
        `Disciplinas definidas: ${dadosCorrigidos.disciplinasNecessarias.join(', ')}`
      );
    }

    // Fallback para prazo (baseado na área e complexidade)
    if (!dadosCorrigidos.prazoDesejado) {
      dadosCorrigidos.prazoDesejado = this.calcularPrazoPadrao(
        dadosCorrigidos.areaConstruida || 0,
        dadosCorrigidos.complexidade || 'MEDIA'
      );
      fallbacksAplicados.push(`Prazo estimado: ${dadosCorrigidos.prazoDesejado} dias`);
    }

    return { dadosCorrigidos, fallbacksAplicados };
  }

  /**
   * Valida coerência de valores calculados
   */
  public validarCoerenciaValores(
    valorTotal: number,
    horasTotal: number,
    areaConstruida: number,
    briefingId: string
  ): ResultadoValidacao {
    const resultado: ResultadoValidacao = {
      valido: true,
      erros: [],
      avisos: [],
      dadosFaltantes: [],
      sugestoesFallback: []
    };

    // Validação de valor total
    if (valorTotal <= 0) {
      resultado.valido = false;
      resultado.erros.push('Valor total deve ser maior que zero');
    } else if (valorTotal < 1000) {
      resultado.avisos.push('Valor total muito baixo - verificar cálculos');
    } else if (valorTotal > 10000000) { // 10 milhões
      resultado.avisos.push('Valor total muito alto - verificar cálculos');
    }

    // Validação de horas total
    if (horasTotal <= 0) {
      resultado.valido = false;
      resultado.erros.push('Total de horas deve ser maior que zero');
    } else if (horasTotal < 10) {
      resultado.avisos.push('Total de horas muito baixo - verificar cálculos');
    } else if (horasTotal > 10000) {
      resultado.avisos.push('Total de horas muito alto - verificar cálculos');
    }

    // Validação de valor por m²
    const valorPorM2 = valorTotal / areaConstruida;
    if (valorPorM2 < 50) {
      resultado.avisos.push(`Valor por m² muito baixo: R$ ${valorPorM2.toFixed(2)}/m²`);
    } else if (valorPorM2 > 2000) {
      resultado.avisos.push(`Valor por m² muito alto: R$ ${valorPorM2.toFixed(2)}/m²`);
    }

    // Validação de valor por hora
    const valorPorHora = valorTotal / horasTotal;
    if (valorPorHora < 30) {
      resultado.avisos.push(`Valor por hora muito baixo: R$ ${valorPorHora.toFixed(2)}/h`);
    } else if (valorPorHora > 500) {
      resultado.avisos.push(`Valor por hora muito alto: R$ ${valorPorHora.toFixed(2)}/h`);
    }

    // Validação de horas por m²
    const horasPorM2 = horasTotal / areaConstruida;
    if (horasPorM2 < 0.1) {
      resultado.avisos.push(`Horas por m² muito baixo: ${horasPorM2.toFixed(2)}h/m²`);
    } else if (horasPorM2 > 10) {
      resultado.avisos.push(`Horas por m² muito alto: ${horasPorM2.toFixed(2)}h/m²`);
    }

    return resultado;
  }

  /**
   * Cria interface para solicitar dados complementares
   */
  public criarSolicitacaoDadosComplementares(
    dadosFaltantes: string[],
    briefingId: string
  ): {
    titulo: string;
    descricao: string;
    campos: Array<{
      nome: string;
      label: string;
      tipo: 'number' | 'text' | 'select';
      obrigatorio: boolean;
      opcoes?: string[];
      placeholder?: string;
      validacao?: string;
    }>;
  } {
    const campos = dadosFaltantes.map(campo => {
      switch (campo) {
        case 'areaConstruida':
          return {
            nome: 'areaConstruida',
            label: 'Área Construída (m²)',
            tipo: 'number' as const,
            obrigatorio: true,
            placeholder: 'Ex: 150',
            validacao: 'Área deve ser maior que 10m²'
          };
        
        case 'tipologia':
          return {
            nome: 'tipologia',
            label: 'Tipologia do Projeto',
            tipo: 'select' as const,
            obrigatorio: true,
            opcoes: this.configuracaoPadrao.tipologiasValidas
          };
        
        case 'padrao':
          return {
            nome: 'padrao',
            label: 'Padrão do Projeto',
            tipo: 'select' as const,
            obrigatorio: false,
            opcoes: ['SIMPLES', 'MEDIO', 'ALTO']
          };
        
        case 'complexidade':
          return {
            nome: 'complexidade',
            label: 'Complexidade do Projeto',
            tipo: 'select' as const,
            obrigatorio: false,
            opcoes: ['BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA']
          };
        
        case 'prazoDesejado':
          return {
            nome: 'prazoDesejado',
            label: 'Prazo Desejado (dias)',
            tipo: 'number' as const,
            obrigatorio: false,
            placeholder: 'Ex: 90',
            validacao: 'Prazo deve estar entre 7 e 730 dias'
          };
        
        default:
          return {
            nome: campo,
            label: campo.charAt(0).toUpperCase() + campo.slice(1),
            tipo: 'text' as const,
            obrigatorio: false
          };
      }
    });

    return {
      titulo: 'Dados Complementares Necessários',
      descricao: 'Para gerar um orçamento mais preciso, precisamos de algumas informações adicionais:',
      campos
    };
  }

  // Métodos auxiliares privados

  private estimarAreaPorTipologia(tipologia: string): number {
    const estimativas: Record<string, number> = {
      'residencial': 120,
      'comercial': 200,
      'industrial': 500,
      'institucional': 300,
      'urbanistico': 1000,
      'misto': 150
    };
    
    return estimativas[tipologia.toLowerCase()] || 150;
  }

  private inferirComplexidade(area: number, tipologia: string): 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA' {
    // Lógica baseada na área e tipologia
    if (tipologia === 'urbanistico' || area > 5000) {
      return 'MUITO_ALTA';
    } else if (tipologia === 'industrial' || area > 1000) {
      return 'ALTA';
    } else if (area > 300) {
      return 'MEDIA';
    } else {
      return 'BAIXA';
    }
  }

  private obterDisciplinasPorTipologia(tipologia: string): string[] {
    const disciplinasPorTipologia: Record<string, string[]> = {
      'residencial': ['arquitetura', 'estrutural', 'instalacoes'],
      'comercial': ['arquitetura', 'estrutural', 'instalacoes', 'incendio'],
      'industrial': ['arquitetura', 'estrutural', 'instalacoes', 'incendio', 'ambiental'],
      'institucional': ['arquitetura', 'estrutural', 'instalacoes', 'incendio', 'acessibilidade'],
      'urbanistico': ['arquitetura', 'urbanismo', 'paisagismo', 'infraestrutura'],
      'misto': ['arquitetura', 'estrutural', 'instalacoes']
    };
    
    return disciplinasPorTipologia[tipologia.toLowerCase()] || ['arquitetura'];
  }

  private calcularPrazoPadrao(area: number, complexidade: string): number {
    const basePorComplexidade: Record<string, number> = {
      'BAIXA': 0.3,
      'MEDIA': 0.5,
      'ALTA': 0.8,
      'MUITO_ALTA': 1.2
    };
    
    const fator = basePorComplexidade[complexidade] || 0.5;
    const prazoCalculado = Math.ceil(area * fator);
    
    // Limites mínimo e máximo
    return Math.max(30, Math.min(365, prazoCalculado));
  }

  /**
   * Valida se um briefing tem dados suficientes para orçamentação
   */
  public validarBriefingParaOrcamento(briefing: any, briefingId: string): void {
    if (!briefing) {
      throw new BriefingAnalysisError(
        'Briefing não encontrado',
        briefingId,
        [],
        ['Verificar se o ID do briefing está correto'],
        ERROR_CODES.BRIEFING_NOT_FOUND
      );
    }

    const dados: DadosMinimos = {
      areaConstruida: briefing.areaConstruida || briefing.area_construida,
      areaTerreno: briefing.areaTerreno || briefing.area_terreno,
      tipologia: briefing.tipologia,
      padrao: briefing.padrao,
      complexidade: briefing.complexidade,
      disciplinasNecessarias: briefing.disciplinasNecessarias || briefing.disciplinas_necessarias,
      localizacao: briefing.localizacao,
      prazoDesejado: briefing.prazoDesejado || briefing.prazo_desejado
    };

    const validacao = this.validarDadosMinimos(dados, briefingId);
    
    if (!validacao.valido) {
      throw new InsufficientDataError(
        'Dados insuficientes para gerar orçamento',
        briefingId,
        validacao.dadosFaltantes,
        Object.keys(dados).filter(key => dados[key as keyof DadosMinimos] !== undefined),
        validacao.sugestoesFallback,
        ERROR_CODES.INSUFFICIENT_DATA
      );
    }
  }

  /**
   * Valida valores calculados e lança erro se inválidos
   */
  public validarValoresCalculados(
    valorTotal: number,
    horasTotal: number,
    areaConstruida: number,
    briefingId: string
  ): void {
    const validacao = this.validarCoerenciaValores(valorTotal, horasTotal, areaConstruida, briefingId);
    
    if (!validacao.valido) {
      throw new BudgetCalculationError(
        'Valores calculados são inválidos',
        briefingId,
        {
          valorTotal,
          horasTotal,
          areaConstruida,
          erros: validacao.erros
        },
        undefined,
        valorTotal,
        ERROR_CODES.BUDGET_CALCULATION_FAILED
      );
    }
  }
}

export const validationService = new ValidationService();