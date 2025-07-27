// CONFIGURAÇÃO DE PRAZOS - ARCFLOW
// Sistema de configuração personalizada de prazos por escritório

export interface ConfiguracaoPrazos {
  // Configuração da equipe
  equipe: {
    arquitetos: number;
    engenheiros: number;
    desenhistas: number;
    estagiarios: number;
    horasPorDia: number;
    diasPorSemana: number;
  };
  
  // Prazos base por disciplina (em dias)
  prazosBase: {
    arquitetura: {
      levantamento: number;
      estudoPreliminar: number;
      anteprojeto: number;
      projetoExecutivo: number;
      detalhamento: number;
    };
    estrutural: {
      concepcao: number;
      dimensionamento: number;
      detalhamento: number;
      memorial: number;
    };
    instalacoes: {
      concepcao: number;
      dimensionamento: number;
      detalhamento: number;
      memorial: number;
    };
    paisagismo: {
      concepcao: number;
      desenvolvimento: number;
      detalhamento: number;
    };
    interiores: {
      concepcao: number;
      desenvolvimento: number;
      detalhamento: number;
    };
  };
  
  // Multiplicadores por complexidade
  multiplicadoresComplexidade: {
    simples: number;
    medio: number;
    alto: number;
    complexo: number;
  };
  
  // Multiplicadores por área (m²)
  multiplicadoresArea: {
    ate100: number;
    ate200: number;
    ate300: number;
    ate500: number;
    acima500: number;
  };
  
  // Configurações especiais
  configuracoes: {
    paralelismo: boolean; // Disciplinas em paralelo ou sequencial
    margemSeguranca: number; // % adicional de segurança
    considerarFeriados: boolean;
    considerarFerias: boolean;
  };
}

// Configuração padrão (conservadora)
export const CONFIGURACAO_PADRAO: ConfiguracaoPrazos = {
  equipe: {
    arquitetos: 2,
    engenheiros: 1,
    desenhistas: 1,
    estagiarios: 1,
    horasPorDia: 8,
    diasPorSemana: 5
  },
  
  prazosBase: {
    arquitetura: {
      levantamento: 3,
      estudoPreliminar: 7,
      anteprojeto: 10,
      projetoExecutivo: 15,
      detalhamento: 5
    },
    estrutural: {
      concepcao: 2,
      dimensionamento: 8,
      detalhamento: 7,
      memorial: 3
    },
    instalacoes: {
      concepcao: 2,
      dimensionamento: 6,
      detalhamento: 8,
      memorial: 2
    },
    paisagismo: {
      concepcao: 3,
      desenvolvimento: 5,
      detalhamento: 4
    },
    interiores: {
      concepcao: 4,
      desenvolvimento: 8,
      detalhamento: 6
    }
  },
  
  multiplicadoresComplexidade: {
    simples: 0.7,
    medio: 1.0,
    alto: 1.4,
    complexo: 1.8
  },
  
  multiplicadoresArea: {
    ate100: 0.8,
    ate200: 1.0,
    ate300: 1.2,
    ate500: 1.4,
    acima500: 1.6
  },
  
  configuracoes: {
    paralelismo: true,
    margemSeguranca: 15, // 15% de margem
    considerarFeriados: true,
    considerarFerias: false
  }
};

// Configuração otimizada (escritório eficiente)
export const CONFIGURACAO_OTIMIZADA: ConfiguracaoPrazos = {
  equipe: {
    arquitetos: 3,
    engenheiros: 2,
    desenhistas: 2,
    estagiarios: 2,
    horasPorDia: 8,
    diasPorSemana: 5
  },
  
  prazosBase: {
    arquitetura: {
      levantamento: 2,
      estudoPreliminar: 4,
      anteprojeto: 6,
      projetoExecutivo: 8,
      detalhamento: 3
    },
    estrutural: {
      concepcao: 1,
      dimensionamento: 4,
      detalhamento: 4,
      memorial: 2
    },
    instalacoes: {
      concepcao: 1,
      dimensionamento: 3,
      detalhamento: 4,
      memorial: 1
    },
    paisagismo: {
      concepcao: 2,
      desenvolvimento: 3,
      detalhamento: 2
    },
    interiores: {
      concepcao: 2,
      desenvolvimento: 4,
      detalhamento: 3
    }
  },
  
  multiplicadoresComplexidade: {
    simples: 0.6,
    medio: 0.8,
    alto: 1.0,
    complexo: 1.3
  },
  
  multiplicadoresArea: {
    ate100: 0.7,
    ate200: 0.9,
    ate300: 1.0,
    ate500: 1.1,
    acima500: 1.2
  },
  
  configuracoes: {
    paralelismo: true,
    margemSeguranca: 10, // 10% de margem
    considerarFeriados: true,
    considerarFerias: false
  }
};

// Classe para gerenciar configurações de prazos
export class GerenciadorPrazos {
  private configuracao: ConfiguracaoPrazos;
  
  constructor(configuracao?: ConfiguracaoPrazos) {
    this.configuracao = configuracao || this.carregarConfiguracaoSalva();
  }
  
  // Carregar configuração salva ou usar padrão
  private carregarConfiguracaoSalva(): ConfiguracaoPrazos {
    try {
      const salva = localStorage.getItem('configuracao_prazos_escritorio');
      if (salva) {
        return JSON.parse(salva);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de prazos:', error);
    }
    return CONFIGURACAO_PADRAO;
  }
  
  // Salvar configuração
  salvarConfiguracao(configuracao: ConfiguracaoPrazos): void {
    this.configuracao = configuracao;
    localStorage.setItem('configuracao_prazos_escritorio', JSON.stringify(configuracao));
  }
  
  // Calcular prazo total do projeto
  calcularPrazoTotal(parametros: {
    disciplinas: string[];
    areaConstruida: number;
    complexidade: 'simples' | 'medio' | 'alto' | 'complexo';
    paralelismo?: boolean;
  }): {
    prazoTotal: number;
    detalhePorDisciplina: Record<string, number>;
    cronograma: Array<{
      disciplina: string;
      etapa: string;
      inicio: number;
      fim: number;
      duracao: number;
    }>;
  } {
    const { disciplinas, areaConstruida, complexidade, paralelismo } = parametros;
    
    // Obter multiplicadores
    const multComplexidade = this.configuracao.multiplicadoresComplexidade[complexidade];
    const multArea = this.obterMultiplicadorArea(areaConstruida);
    const margemSeguranca = 1 + (this.configuracao.configuracoes.margemSeguranca / 100);
    
    const detalhePorDisciplina: Record<string, number> = {};
    const cronograma: Array<{
      disciplina: string;
      etapa: string;
      inicio: number;
      fim: number;
      duracao: number;
    }> = [];
    
    let diaAtual = 0;
    
    // Calcular para cada disciplina
    disciplinas.forEach(disciplina => {
      const prazosBaseDisciplina = this.obterPrazosBaseDisciplina(disciplina);
      
      if (prazosBaseDisciplina) {
        let prazoTotalDisciplina = 0;
        let inicioEtapa = paralelismo !== false ? 0 : diaAtual;
        
        // Calcular cada etapa da disciplina
        Object.entries(prazosBaseDisciplina).forEach(([etapa, diasBase]) => {
          const duracaoEtapa = Math.ceil(
            diasBase * multComplexidade * multArea * margemSeguranca
          );
          
          cronograma.push({
            disciplina,
            etapa,
            inicio: inicioEtapa,
            fim: inicioEtapa + duracaoEtapa,
            duracao: duracaoEtapa
          });
          
          prazoTotalDisciplina += duracaoEtapa;
          
          if (!paralelismo) {
            inicioEtapa += duracaoEtapa;
          }
        });
        
        detalhePorDisciplina[disciplina] = prazoTotalDisciplina;
        
        if (!paralelismo) {
          diaAtual = inicioEtapa;
        }
      }
    });
    
    // Calcular prazo total
    const prazoTotal = paralelismo !== false 
      ? Math.max(...Object.values(detalhePorDisciplina))
      : Object.values(detalhePorDisciplina).reduce((sum, prazo) => sum + prazo, 0);
    
    return {
      prazoTotal,
      detalhePorDisciplina,
      cronograma
    };
  }
  
  // Obter multiplicador de área
  private obterMultiplicadorArea(area: number): number {
    if (area <= 100) return this.configuracao.multiplicadoresArea.ate100;
    if (area <= 200) return this.configuracao.multiplicadoresArea.ate200;
    if (area <= 300) return this.configuracao.multiplicadoresArea.ate300;
    if (area <= 500) return this.configuracao.multiplicadoresArea.ate500;
    return this.configuracao.multiplicadoresArea.acima500;
  }
  
  // Obter prazos base por disciplina
  private obterPrazosBaseDisciplina(disciplina: string): Record<string, number> | null {
    switch (disciplina) {
      case 'arquitetura':
        return this.configuracao.prazosBase.arquitetura;
      case 'estrutural':
        return this.configuracao.prazosBase.estrutural;
      case 'instalacoes':
        return this.configuracao.prazosBase.instalacoes;
      case 'paisagismo':
        return this.configuracao.prazosBase.paisagismo;
      case 'interiores':
        return this.configuracao.prazosBase.interiores;
      default:
        return null;
    }
  }
  
  // Obter configuração atual
  obterConfiguracao(): ConfiguracaoPrazos {
    return { ...this.configuracao };
  }
  
  // Aplicar template otimizado
  aplicarTemplateOtimizado(): void {
    this.salvarConfiguracao(CONFIGURACAO_OTIMIZADA);
  }
  
  // Aplicar template padrão
  aplicarTemplatePadrao(): void {
    this.salvarConfiguracao(CONFIGURACAO_PADRAO);
  }
  
  // Simular diferentes cenários
  simularCenarios(parametros: {
    disciplinas: string[];
    areaConstruida: number;
    complexidade: 'simples' | 'medio' | 'alto' | 'complexo';
  }) {
    const cenarios = {
      conservador: this.calcularComConfiguracao(CONFIGURACAO_PADRAO, parametros),
      otimizado: this.calcularComConfiguracao(CONFIGURACAO_OTIMIZADA, parametros),
      atual: this.calcularPrazoTotal(parametros)
    };
    
    return cenarios;
  }
  
  // Calcular com configuração específica
  private calcularComConfiguracao(
    configuracao: ConfiguracaoPrazos, 
    parametros: any
  ) {
    const gerenciadorTemp = new GerenciadorPrazos(configuracao);
    return gerenciadorTemp.calcularPrazoTotal(parametros);
  }
}

// Instância global
export const gerenciadorPrazos = new GerenciadorPrazos(); 