// SERVIÇO DE ORÇAMENTO AUTOMÁTICO - ARCFLOW
// Gera orçamentos automáticos baseados no briefing e dados históricos

import { OrcamentoAutomatico, Cliente } from '../types/integracaoComercial';

interface ParametrosCalculo {
  tipologia: string;
  subtipo?: string;
  area: number;
  complexidade: number; // 1-10
  padrao: 'economico' | 'medio' | 'alto' | 'luxo';
  prazoSolicitado: number; // semanas
  localProjeto: string;
  clienteHistorico?: Cliente;
}

interface DadosHistoricos {
  valorMedioM2: Record<string, number>;
  tempoMedioPorEtapa: Record<string, number>;
  margemMediaPorTipologia: Record<string, number>;
  multiplicadorComplexidade: Record<number, number>;
  multiplicadorPadrao: Record<string, number>;
  multiplicadorLocal: Record<string, number>;
}

class OrcamentoAutomaticoService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  
  // Dados históricos do escritório (normalmente viriam do banco de dados)
  private dadosHistoricos: DadosHistoricos = {
    valorMedioM2: {
      'residencial': 2500,
      'comercial': 3000,
      'institucional': 3500,
      'industrial': 4000,
      'paisagismo': 1500,
      'interiores': 2000
    },
    tempoMedioPorEtapa: {
      'estudo_preliminar': 2, // semanas
      'anteprojeto': 3,
      'projeto_executivo': 4,
      'detalhamento': 2,
      'aprovacoes': 3,
      'acompanhamento': 1
    },
    margemMediaPorTipologia: {
      'residencial': 25,
      'comercial': 30,
      'institucional': 35,
      'industrial': 40,
      'paisagismo': 20,
      'interiores': 25
    },
    multiplicadorComplexidade: {
      1: 0.7, 2: 0.8, 3: 0.9, 4: 1.0, 5: 1.1,
      6: 1.2, 7: 1.4, 8: 1.6, 9: 1.8, 10: 2.0
    },
    multiplicadorPadrao: {
      'economico': 0.8,
      'medio': 1.0,
      'alto': 1.3,
      'luxo': 1.6
    },
    multiplicadorLocal: {
      'capital': 1.2,
      'interior': 1.0,
      'metropolitana': 1.1
    }
  };

  // Valores base por profissional (R$/hora)
  private valoresHora = {
    'arquiteto_senior': 200,
    'arquiteto_pleno': 150,
    'arquiteto_junior': 100,
    'estagiario': 60,
    'engenheiro': 180,
    'consultor': 250
  };

  async gerarOrcamentoCompleto(parametros: ParametrosCalculo): Promise<OrcamentoAutomatico> {
    try {
      // 1. Calcular custos base
      const custosBase = this.calcularCustosBase(parametros);
      
      // 2. Aplicar multiplicadores
      const custosAjustados = this.aplicarMultiplicadores(custosBase, parametros);
      
      // 3. Calcular cronograma
      const cronograma = this.gerarCronograma(parametros);
      
      // 4. Buscar benchmarking
      const benchmarking = await this.obterBenchmarking(parametros);
      
      // 5. Gerar proposta comercial
      const proposta = this.gerarPropostaComercial(custosAjustados, parametros);
      
      // 6. Montar orçamento completo
      const orcamento: OrcamentoAutomatico = {
        id: this.gerarId(),
        briefingId: '', // será preenchido externamente
        clienteId: '', // será preenchido externamente
        
        dadosBase: {
          tipologia: parametros.tipologia,
          subtipo: parametros.subtipo || '',
          padrao: parametros.padrao,
          areaEstimada: parametros.area,
          complexidade: parametros.complexidade,
          prazoSolicitado: parametros.prazoSolicitado,
          localProjeto: parametros.localProjeto
        },
        
        calculos: custosAjustados,
        benchmarking,
        cronograma,
        proposta,
        
        status: 'calculado',
        geradoEm: new Date().toISOString(),
        geradoPor: 'Sistema Automático'
      };

      return orcamento;
    } catch (error) {
      console.error('Erro ao gerar orçamento automático:', error);
      throw error;
    }
  }

  private calcularCustosBase(parametros: ParametrosCalculo) {
    const { tipologia, area } = parametros;
    
    // Calcular horas por etapa baseado na área e tipologia
    const horasBase = this.calcularHorasBase(area, tipologia);
    
    // Distribuir horas por profissional
    const horasPorProfissional = this.distribuirHorasPorProfissional(horasBase, tipologia);
    
    // Calcular custos por etapa
    const custosPorEtapa = this.calcularCustosPorEtapa(horasPorProfissional);
    
    // Calcular totais
    const custoTotalProjeto = Object.values(custosPorEtapa).reduce((acc, custo) => acc + custo, 0);
    const margemBase = this.dadosHistoricos.margemMediaPorTipologia[tipologia] || 25;
    const valorFinalBase = custoTotalProjeto * (1 + margemBase / 100);

    return {
      horasPorEtapa: horasBase,
      valorHoraPorProfissional: this.valoresHora,
      custoTotalPorEtapa: custosPorEtapa,
      custoTotalProjeto,
      margemAplicada: margemBase,
      valorFinalProjeto: valorFinalBase
    };
  }

  private calcularHorasBase(area: number, tipologia: string): Record<string, number> {
    // Fórmula base: área * multiplicador da tipologia * distribuição por etapa
    const multiplicadorTipologia = this.obterMultiplicadorTipologia(tipologia);
    const horasTotais = Math.max(area * 0.8 * multiplicadorTipologia, 60); // mínimo 60h
    
    return {
      estudo_preliminar: Math.round(horasTotais * 0.15),
      anteprojeto: Math.round(horasTotais * 0.25),
      projeto_executivo: Math.round(horasTotais * 0.35),
      detalhamento: Math.round(horasTotais * 0.15),
      aprovacoes: Math.round(horasTotais * 0.05),
      acompanhamento: Math.round(horasTotais * 0.05),
      total: horasTotais
    };
  }

  private obterMultiplicadorTipologia(tipologia: string): number {
    const multiplicadores: Record<string, number> = {
      'residencial': 1.0,
      'comercial': 1.2,
      'institucional': 1.4,
      'industrial': 1.6,
      'paisagismo': 0.8,
      'interiores': 0.9
    };
    return multiplicadores[tipologia] || 1.0;
  }

  private distribuirHorasPorProfissional(horasBase: Record<string, number>, tipologia: string): Record<string, Record<string, number>> {
    // Distribuição típica por etapa e tipologia
    const distribuicoes: Record<string, Record<string, Record<string, number>>> = {
      'residencial': {
        'estudo_preliminar': { 'arquiteto_pleno': 0.7, 'estagiario': 0.3 },
        'anteprojeto': { 'arquiteto_pleno': 0.6, 'arquiteto_junior': 0.2, 'estagiario': 0.2 },
        'projeto_executivo': { 'arquiteto_senior': 0.3, 'arquiteto_pleno': 0.4, 'arquiteto_junior': 0.3 },
        'detalhamento': { 'arquiteto_pleno': 0.5, 'arquiteto_junior': 0.3, 'estagiario': 0.2 },
        'aprovacoes': { 'arquiteto_senior': 0.8, 'arquiteto_pleno': 0.2 },
        'acompanhamento': { 'arquiteto_pleno': 1.0 }
      },
      'comercial': {
        'estudo_preliminar': { 'arquiteto_senior': 0.4, 'arquiteto_pleno': 0.4, 'estagiario': 0.2 },
        'anteprojeto': { 'arquiteto_senior': 0.3, 'arquiteto_pleno': 0.4, 'arquiteto_junior': 0.3 },
        'projeto_executivo': { 'arquiteto_senior': 0.4, 'arquiteto_pleno': 0.3, 'engenheiro': 0.3 },
        'detalhamento': { 'arquiteto_pleno': 0.4, 'arquiteto_junior': 0.4, 'estagiario': 0.2 },
        'aprovacoes': { 'arquiteto_senior': 0.9, 'engenheiro': 0.1 },
        'acompanhamento': { 'arquiteto_senior': 0.6, 'arquiteto_pleno': 0.4 }
      }
    };

    const distribuicao = distribuicoes[tipologia] || distribuicoes['residencial'];
    const resultado: Record<string, Record<string, number>> = {};

    Object.keys(horasBase).forEach(etapa => {
      if (etapa === 'total') return;
      
      resultado[etapa] = {};
      const distEtapa = distribuicao[etapa] || { 'arquiteto_pleno': 1.0 };
      
      Object.entries(distEtapa).forEach(([profissional, percentual]) => {
        resultado[etapa][profissional] = Math.round(horasBase[etapa] * percentual);
      });
    });

    return resultado;
  }

  private calcularCustosPorEtapa(horasPorProfissional: Record<string, Record<string, number>>): Record<string, number> {
    const custos: Record<string, number> = {};

    Object.entries(horasPorProfissional).forEach(([etapa, profissionais]) => {
      custos[etapa] = 0;
      
      Object.entries(profissionais).forEach(([profissional, horas]) => {
        const valorHora = this.valoresHora[profissional as keyof typeof this.valoresHora] || 100;
        custos[etapa] += horas * valorHora;
      });
    });

    return custos;
  }

  private aplicarMultiplicadores(custosBase: any, parametros: ParametrosCalculo) {
    const { complexidade, padrao, localProjeto } = parametros;
    
    // Multiplicadores
    const multComplexidade = this.dadosHistoricos.multiplicadorComplexidade[complexidade] || 1.0;
    const multPadrao = this.dadosHistoricos.multiplicadorPadrao[padrao] || 1.0;
    const multLocal = this.obterMultiplicadorLocal(localProjeto);
    
    const multiplicadorFinal = multComplexidade * multPadrao * multLocal;
    
    // Aplicar multiplicadores
    const custosAjustados = {
      ...custosBase,
      custoTotalProjeto: custosBase.custoTotalProjeto * multiplicadorFinal,
      valorFinalProjeto: custosBase.valorFinalProjeto * multiplicadorFinal,
      custoTotalPorEtapa: Object.fromEntries(
        Object.entries(custosBase.custoTotalPorEtapa).map(([etapa, custo]) => [
          etapa, 
          (custo as number) * multiplicadorFinal
        ])
      ),
      multiplicadores: {
        complexidade: multComplexidade,
        padrao: multPadrao,
        local: multLocal,
        final: multiplicadorFinal
      }
    };

    return custosAjustados;
  }

  private obterMultiplicadorLocal(local: string): number {
    // Análise simples do local para determinar multiplicador
    const localLower = local.toLowerCase();
    
    if (localLower.includes('são paulo') || localLower.includes('rio de janeiro')) {
      return this.dadosHistoricos.multiplicadorLocal['capital'];
    } else if (localLower.includes('região metropolitana') || localLower.includes('grande')) {
      return this.dadosHistoricos.multiplicadorLocal['metropolitana'];
    } else {
      return this.dadosHistoricos.multiplicadorLocal['interior'];
    }
  }

  private gerarCronograma(parametros: ParametrosCalculo) {
    const { prazoSolicitado, tipologia } = parametros;
    
    // Calcular durações baseadas no prazo solicitado e tipologia
    const duracoes = this.calcularDuracoesPorEtapa(prazoSolicitado, tipologia);
    
    // Gerar etapas do cronograma
    const etapas = [
      {
        nome: 'Estudo Preliminar',
        duracao: duracoes.estudo_preliminar,
        dependencias: [],
        responsavel: 'Arquiteto Responsável',
        entregaveis: [
          'Plantas de situação e localização',
          'Plantas baixas esquemáticas',
          'Cortes e fachadas esquemáticos',
          'Memorial justificativo'
        ]
      },
      {
        nome: 'Anteprojeto',
        duracao: duracoes.anteprojeto,
        dependencias: ['Estudo Preliminar'],
        responsavel: 'Arquiteto Responsável',
        entregaveis: [
          'Plantas baixas definitivas',
          'Cortes e fachadas',
          'Implantação',
          'Perspectivas 3D',
          'Memorial descritivo'
        ]
      },
      {
        nome: 'Projeto Executivo',
        duracao: duracoes.projeto_executivo,
        dependencias: ['Anteprojeto'],
        responsavel: 'Equipe Técnica',
        entregaveis: [
          'Plantas executivas',
          'Cortes e detalhes construtivos',
          'Especificações técnicas',
          'Quantitativos',
          'Caderno de encargos'
        ]
      },
      {
        nome: 'Detalhamento',
        duracao: duracoes.detalhamento,
        dependencias: ['Projeto Executivo'],
        responsavel: 'Arquiteto Especialista',
        entregaveis: [
          'Detalhes construtivos específicos',
          'Detalhes de acabamentos',
          'Detalhes de instalações',
          'Manual do proprietário'
        ]
      }
    ];

    // Calcular datas
    const dataInicio = new Date();
    let dataAtual = new Date(dataInicio);
    
    etapas.forEach((etapa: any) => {
      etapa.dataInicio = new Date(dataAtual).toISOString();
      dataAtual.setDate(dataAtual.getDate() + (etapa.duracao * 7)); // converter semanas para dias
      etapa.dataFim = new Date(dataAtual).toISOString();
    });

    return {
      etapas,
      dataInicioEstimada: dataInicio.toISOString(),
      dataFimEstimada: dataAtual.toISOString(),
      marcosPrincipais: [
        {
          nome: 'Aprovação Estudo Preliminar',
          data: (etapas[0] as any).dataFim,
          tipo: 'aprovacao' as const
        },
        {
          nome: 'Apresentação Anteprojeto',
          data: (etapas[1] as any).dataFim,
          tipo: 'reuniao' as const
        },
        {
          nome: 'Entrega Projeto Executivo',
          data: (etapas[2] as any).dataFim,
          tipo: 'entrega' as const
        },
        {
          nome: 'Entrega Final',
          data: (etapas[3] as any).dataFim,
          tipo: 'entrega' as const
        }
      ]
    };
  }

  private calcularDuracoesPorEtapa(prazoTotal: number, tipologia: string): Record<string, number> {
    // Distribuição percentual padrão por tipologia
    const distribuicoes: Record<string, Record<string, number>> = {
      'residencial': {
        estudo_preliminar: 0.2,
        anteprojeto: 0.3,
        projeto_executivo: 0.35,
        detalhamento: 0.15
      },
      'comercial': {
        estudo_preliminar: 0.15,
        anteprojeto: 0.25,
        projeto_executivo: 0.45,
        detalhamento: 0.15
      },
      'institucional': {
        estudo_preliminar: 0.15,
        anteprojeto: 0.25,
        projeto_executivo: 0.5,
        detalhamento: 0.1
      }
    };

    const distribuicao = distribuicoes[tipologia] || distribuicoes['residencial'];
    const duracoes: Record<string, number> = {};

    Object.entries(distribuicao).forEach(([etapa, percentual]) => {
      duracoes[etapa] = Math.max(Math.round(prazoTotal * percentual), 1); // mínimo 1 semana
    });

    return duracoes;
  }

  private async obterBenchmarking(parametros: ParametrosCalculo) {
    try {
      // Simular busca de projetos similares (normalmente viria do banco de dados)
      const projetosSimilares = await this.buscarProjetosSimilares(parametros);
      
      // Calcular médias históricas
      const mediaHistorica = this.calcularMediaHistorica(parametros.tipologia);
      
      // Gerar recomendações
      const ajustesRecomendados = this.gerarAjustesRecomendados(parametros, projetosSimilares, mediaHistorica);

      return {
        projetosSimilares,
        mediaHistorica,
        ajustesRecomendados
      };
    } catch (error) {
      console.error('Erro ao obter benchmarking:', error);
      return {
        projetosSimilares: [],
        mediaHistorica: this.calcularMediaHistorica(parametros.tipologia),
        ajustesRecomendados: {
          valorSugerido: parametros.area * this.dadosHistoricos.valorMedioM2[parametros.tipologia],
          prazoSugerido: parametros.prazoSolicitado,
          justificativa: 'Baseado na média histórica do escritório'
        }
      };
    }
  }

  private async buscarProjetosSimilares(parametros: ParametrosCalculo) {
    // Simular busca no banco de dados
    // Em produção, faria uma query real buscando projetos com características similares
    return [
      {
        projetoId: 'proj_001',
        similaridade: 85,
        valorRealizado: parametros.area * 2800,
        prazoRealizado: parametros.prazoSolicitado + 2,
        margemFinal: 28
      },
      {
        projetoId: 'proj_002',
        similaridade: 78,
        valorRealizado: parametros.area * 2600,
        prazoRealizado: parametros.prazoSolicitado - 1,
        margemFinal: 22
      }
    ];
  }

  private calcularMediaHistorica(tipologia: string) {
    return {
      valorPorM2: this.dadosHistoricos.valorMedioM2[tipologia] || 2500,
      prazoMedio: 12, // semanas
      margemMedia: this.dadosHistoricos.margemMediaPorTipologia[tipologia] || 25
    };
  }

  private gerarAjustesRecomendados(parametros: ParametrosCalculo, projetosSimilares: any[], mediaHistorica: any) {
    const valorCalculado = parametros.area * mediaHistorica.valorPorM2;
    
    // Analisar projetos similares para ajustes
    let ajusteValor = 1.0;
    let ajustePrazo = 0;
    let justificativas = [];

    if (projetosSimilares.length > 0) {
      const mediaValorSimilares = projetosSimilares.reduce((acc, p) => acc + p.valorRealizado, 0) / projetosSimilares.length;
      const mediaPrazoSimilares = projetosSimilares.reduce((acc, p) => acc + p.prazoRealizado, 0) / projetosSimilares.length;
      
      if (mediaValorSimilares > valorCalculado * 1.1) {
        ajusteValor = 1.1;
        justificativas.push('Projetos similares indicam valor 10% superior');
      }
      
      if (mediaPrazoSimilares > parametros.prazoSolicitado) {
        ajustePrazo = 2;
        justificativas.push('Histórico indica necessidade de 2 semanas adicionais');
      }
    }

    // Ajustes por complexidade
    if (parametros.complexidade >= 8) {
      ajusteValor *= 1.15;
      ajustePrazo += 3;
      justificativas.push('Alta complexidade requer ajustes de valor e prazo');
    }

    return {
      valorSugerido: Math.round(valorCalculado * ajusteValor),
      prazoSugerido: parametros.prazoSolicitado + ajustePrazo,
      justificativa: justificativas.join('; ') || 'Baseado na média histórica do escritório'
    };
  }

  private gerarPropostaComercial(custos: any, parametros: ParametrosCalculo) {
    const valorTotal = custos.valorFinalProjeto;
    
    // Configurar forma de pagamento baseada no valor
    let formaPagamento;
    if (valorTotal <= 50000) {
      formaPagamento = {
        entrada: 40, // %
        parcelas: 2,
        valorParcela: (valorTotal * 0.6) / 2,
        vencimentos: this.gerarVencimentos(2, 30)
      };
    } else if (valorTotal <= 100000) {
      formaPagamento = {
        entrada: 30,
        parcelas: 3,
        valorParcela: (valorTotal * 0.7) / 3,
        vencimentos: this.gerarVencimentos(3, 30)
      };
    } else {
      formaPagamento = {
        entrada: 25,
        parcelas: 4,
        valorParcela: (valorTotal * 0.75) / 4,
        vencimentos: this.gerarVencimentos(4, 30)
      };
    }

    return {
      valorTotal: Math.round(valorTotal),
      formaPagamento,
      prazoEntrega: parametros.prazoSolicitado,
      garantias: [
        'Garantia de 12 meses para revisões do projeto',
        'Suporte técnico durante a execução da obra',
        'Acompanhamento das aprovações legais',
        'Revisões ilimitadas na fase de anteprojeto'
      ],
      observacoes: `Proposta para ${parametros.tipologia} de ${parametros.area}m² - Padrão ${parametros.padrao}`,
      validadeProposta: 30 // dias
    };
  }

  private gerarVencimentos(parcelas: number, intervaloDias: number = 30): string[] {
    const vencimentos = [];
    const hoje = new Date();
    
    for (let i = 1; i <= parcelas; i++) {
      const vencimento = new Date(hoje);
      vencimento.setDate(vencimento.getDate() + (i * intervaloDias));
      vencimentos.push(vencimento.toISOString().split('T')[0]);
    }
    
    return vencimentos;
  }

  private gerarId(): string {
    return 'orc_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Métodos públicos para uso externo
  async calcularOrcamentoRapido(tipologia: string, area: number, complexidade: number = 5): Promise<{ valorEstimado: number; prazoEstimado: number }> {
    const valorM2 = this.dadosHistoricos.valorMedioM2[tipologia] || 2500;
    const multiplicador = this.dadosHistoricos.multiplicadorComplexidade[complexidade] || 1.0;
    
    return {
      valorEstimado: Math.round(area * valorM2 * multiplicador),
      prazoEstimado: Math.max(Math.round(area / 20), 8) // mínimo 8 semanas
    };
  }

  async obterDadosHistoricos(): Promise<DadosHistoricos> {
    return this.dadosHistoricos;
  }

  async atualizarDadosHistoricos(novosDados: Partial<DadosHistoricos>): Promise<void> {
    this.dadosHistoricos = { ...this.dadosHistoricos, ...novosDados };
    // Em produção, salvaria no banco de dados
  }
}

// Instância singleton
export const orcamentoAutomaticoService = new OrcamentoAutomaticoService();
export default orcamentoAutomaticoService; 