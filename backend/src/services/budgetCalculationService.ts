/**
 * BUDGET CALCULATION SERVICE - ARCFLOW
 * 
 * Serviço para cálculo inteligente de horas e valores de orçamentos
 * baseado em dados extraídos de briefings e configurações do escritório.
 * 
 * Características:
 * - Cálculo de horas baseado em área e complexidade
 * - Valores por disciplina usando tabela de preços
 * - Multiplicadores por tipologia e região
 * - Cronograma temporal realista
 * - Custos indiretos, impostos e margem
 */

import { DadosExtraidos } from './briefingAnalysisEngine';

export interface ConfiguracaoEscritorio {
  id: string;
  escritorioId: string;
  tabelaPrecos: TabelaPrecos;
  multiplicadores: MultiplicadoresTipologia;
  parametrosComplexidade: ParametrosComplexidade;
  configuracoesPadrao: ConfiguracoesPadrao;
}

export interface TabelaPrecos {
  arquitetura: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
  estrutural: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
  instalacoes: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
  paisagismo: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
}

export interface MultiplicadoresTipologia {
  residencial: {
    unifamiliar: number;
    multifamiliar: number;
    condominio: number;
  };
  comercial: {
    escritorio: number;
    loja: number;
    shopping: number;
    hotel: number;
  };
  industrial: {
    fabrica: number;
    galpao: number;
    centro_logistico: number;
  };
  institucional: {
    escola: number;
    hospital: number;
    templo: number;
  };
}
e
xport interface ParametrosComplexidade {
  baixa: {
    multiplicador: number;
    horas_base_m2: number;
  };
  media: {
    multiplicador: number;
    horas_base_m2: number;
  };
  alta: {
    multiplicador: number;
    horas_base_m2: number;
  };
  muito_alta: {
    multiplicador: number;
    horas_base_m2: number;
  };
}

export interface ConfiguracoesPadrao {
  margem_lucro: number;
  impostos: number;
  custos_indiretos: number;
  contingencia: number;
}

export interface ResultadoOrcamento {
  // Dados básicos
  id?: string;
  codigo: string;
  nome: string;
  descricao: string;
  status: 'RASCUNHO' | 'ENVIADO' | 'APROVADO' | 'REJEITADO';
  
  // Dados técnicos
  areaConstruida: number;
  areaTerreno?: number;
  tipologia: string;
  subtipo?: string;
  padrao: string;
  complexidade: string;
  localizacao?: string;
  
  // Valores calculados
  valorTotal: number;
  valorPorM2: number;
  
  // Estruturas detalhadas
  disciplinas: DisciplinaOrcamento[];
  composicaoFinanceira: ComposicaoFinanceira;
  cronograma: CronogramaOrcamento;
  proposta: PropostaOrcamento;
  
  // Metadados
  briefingId: string;
  clienteId?: string;
  escritorioId: string;
  responsavelId?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface DisciplinaOrcamento {
  nome: string;
  codigo: string;
  horasEstimadas: number;
  valorHora: number;
  valorTotal: number;
  etapas: EtapaDisciplina[];
  equipe: EquipeDisciplina;
  opcional: boolean;
}

export interface EtapaDisciplina {
  nome: string;
  codigo: string;
  percentual: number;
  horasEstimadas: number;
  valorEstimado: number;
  entregaveis: string[];
}

export interface EquipeDisciplina {
  senior: number;
  pleno: number;
  junior: number;
  estagiario: number;
}

export interface ComposicaoFinanceira {
  custoTecnico: number;
  custosIndiretos: number;
  impostos: number;
  contingencia: number;
  lucro: number;
}

export interface CronogramaOrcamento {
  prazoTotal: number;
  etapas: EtapaCronograma[];
}

export interface EtapaCronograma {
  nome: string;
  codigo: string;
  inicio: number; // semanas após início
  fim: number; // semanas após início
  duracao: number; // em semanas
  disciplinas: string[];
  marcos: string[];
}

export interface PropostaOrcamento {
  escopo: string;
  premissas: string[];
  exclusoes: string[];
  condicoesComerciais: string[];
  formasPagamento: string[];
  validadeProposta: number; // dias
}

export class BudgetCalculationService {
  private configuracao: ConfiguracaoEscritorio;
  
  constructor(configuracao: ConfiguracaoEscritorio) {
    this.configuracao = configuracao;
  }
  
  /**
   * Calcula orçamento completo baseado nos dados extraídos do briefing
   */
  async calcularOrcamento(dados: DadosExtraidos, briefingId: string, escritorioId: string): Promise<ResultadoOrcamento> {
    console.log('💰 Iniciando cálculo de orçamento para briefing:', briefingId);
    
    try {
      // 1. Validar dados mínimos
      this.validarDadosMinimos(dados);
      
      // 2. Calcular horas por disciplina
      const disciplinas = this.calcularHorasDisciplinas(dados);
      
      // 3. Calcular valores por disciplina
      const disciplinasComValores = this.calcularValoresDisciplinas(disciplinas, dados);
      
      // 4. Calcular composição financeira
      const composicaoFinanceira = this.calcularComposicaoFinanceira(disciplinasComValores);
      
      // 5. Calcular cronograma
      const cronograma = this.calcularCronograma(disciplinasComValores, dados);
      
      // 6. Gerar proposta
      const proposta = this.gerarProposta(dados, disciplinasComValores);
      
      // 7. Calcular valor total e por m²
      const valorTotal = composicaoFinanceira.custoTecnico + 
                        composicaoFinanceira.custosIndiretos + 
                        composicaoFinanceira.impostos + 
                        composicaoFinanceira.contingencia + 
                        composicaoFinanceira.lucro;
      
      const valorPorM2 = dados.areaConstruida ? valorTotal / dados.areaConstruida : 0;
      
      // 8. Montar resultado final
      const resultado: ResultadoOrcamento = {
        codigo: this.gerarCodigoOrcamento(briefingId),
        nome: `Orçamento - ${dados.tipologia} ${dados.subtipo || ''}`.trim(),
        descricao: `Orçamento para projeto ${dados.tipologia.toLowerCase()} de ${dados.areaConstruida}m² - ${dados.padrao}`,
        status: 'RASCUNHO',
        
        areaConstruida: dados.areaConstruida || 0,
        areaTerreno: dados.areaTerreno,
        tipologia: dados.tipologia,
        subtipo: dados.subtipo,
        padrao: dados.padrao,
        complexidade: dados.complexidade,
        localizacao: dados.localizacao,
        
        valorTotal,
        valorPorM2,
        
        disciplinas: disciplinasComValores,
        composicaoFinanceira,
        cronograma,
        proposta,
        
        briefingId,
        escritorioId,
        dataCriacao: new Date(),
        dataAtualizacao: new Date()
      };
      
      console.log('✅ Cálculo de orçamento concluído');
      console.log('💵 Valor total:', valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
      console.log('📊 Disciplinas:', disciplinasComValores.length);
      console.log('📅 Prazo total:', cronograma.prazoTotal, 'semanas');
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Erro no cálculo do orçamento:', error);
      throw new Error(`Falha no cálculo do orçamento: ${error.message}`);
    }
  }  /**

   * Valida se os dados mínimos necessários estão presentes
   */
  private validarDadosMinimos(dados: DadosExtraidos): void {
    if (!dados.areaConstruida || dados.areaConstruida <= 0) {
      throw new Error('Área construída é obrigatória para o cálculo do orçamento');
    }
    
    if (!dados.tipologia) {
      throw new Error('Tipologia é obrigatória para o cálculo do orçamento');
    }
    
    if (!dados.complexidade) {
      throw new Error('Complexidade é obrigatória para o cálculo do orçamento');
    }
    
    if (!dados.disciplinasNecessarias || dados.disciplinasNecessarias.length === 0) {
      throw new Error('Pelo menos uma disciplina é necessária para o cálculo do orçamento');
    }
  }
  
  /**
   * Calcula horas por disciplina baseado na área e complexidade
   */
  private calcularHorasDisciplinas(dados: DadosExtraidos): DisciplinaOrcamento[] {
    const disciplinas: DisciplinaOrcamento[] = [];
    
    // Obter parâmetros de complexidade
    const parametros = this.obterParametrosComplexidade(dados.complexidade);
    
    // Calcular horas base por m²
    const horasBaseM2 = parametros.horas_base_m2;
    
    // Calcular multiplicador de tipologia
    const multiplicadorTipologia = this.obterMultiplicadorTipologia(dados.tipologia, dados.subtipo);
    
    // Para cada disciplina necessária
    for (const nomeDisciplina of dados.disciplinasNecessarias) {
      // Normalizar nome da disciplina
      const disciplinaNormalizada = this.normalizarNomeDisciplina(nomeDisciplina);
      
      // Calcular horas estimadas para esta disciplina
      const horasEstimadas = this.calcularHorasDisciplina(
        dados.areaConstruida,
        horasBaseM2,
        multiplicadorTipologia,
        parametros.multiplicador,
        disciplinaNormalizada
      );
      
      // Distribuir horas por etapas
      const etapas = this.distribuirHorasPorEtapas(horasEstimadas, disciplinaNormalizada);
      
      // Distribuir equipe
      const equipe = this.distribuirEquipe(horasEstimadas, disciplinaNormalizada);
      
      // Criar objeto de disciplina
      disciplinas.push({
        nome: this.obterNomeCompletoDisciplina(disciplinaNormalizada),
        codigo: disciplinaNormalizada,
        horasEstimadas,
        valorHora: 0, // Será calculado depois
        valorTotal: 0, // Será calculado depois
        etapas,
        equipe,
        opcional: false
      });
    }
    
    // Adicionar disciplinas opcionais
    if (dados.disciplinasOpcionais && dados.disciplinasOpcionais.length > 0) {
      for (const nomeDisciplina of dados.disciplinasOpcionais) {
        const disciplinaNormalizada = this.normalizarNomeDisciplina(nomeDisciplina);
        
        const horasEstimadas = this.calcularHorasDisciplina(
          dados.areaConstruida,
          horasBaseM2,
          multiplicadorTipologia,
          parametros.multiplicador,
          disciplinaNormalizada
        ) * 0.8; // Disciplinas opcionais têm escopo reduzido
        
        const etapas = this.distribuirHorasPorEtapas(horasEstimadas, disciplinaNormalizada);
        const equipe = this.distribuirEquipe(horasEstimadas, disciplinaNormalizada);
        
        disciplinas.push({
          nome: this.obterNomeCompletoDisciplina(disciplinaNormalizada),
          codigo: disciplinaNormalizada,
          horasEstimadas,
          valorHora: 0,
          valorTotal: 0,
          etapas,
          equipe,
          opcional: true
        });
      }
    }
    
    return disciplinas;
  }  /
**
   * Calcula valores por disciplina baseado nas horas e tabela de preços
   */
  private calcularValoresDisciplinas(disciplinas: DisciplinaOrcamento[], dados: DadosExtraidos): DisciplinaOrcamento[] {
    return disciplinas.map(disciplina => {
      // Obter tabela de preços para esta disciplina
      const tabelaPrecos = this.obterTabelaPrecosDisciplina(disciplina.codigo);
      
      // Calcular valor hora médio ponderado pela distribuição da equipe
      const valorHora = this.calcularValorHoraMedio(disciplina.equipe, tabelaPrecos);
      
      // Calcular valor total
      const valorTotal = valorHora * disciplina.horasEstimadas;
      
      // Atualizar etapas com valores
      const etapas = disciplina.etapas.map(etapa => ({
        ...etapa,
        valorEstimado: etapa.horasEstimadas * valorHora
      }));
      
      return {
        ...disciplina,
        valorHora,
        valorTotal,
        etapas
      };
    });
  }
  
  /**
   * Calcula composição financeira do orçamento
   */
  private calcularComposicaoFinanceira(disciplinas: DisciplinaOrcamento[]): ComposicaoFinanceira {
    // Calcular custo técnico (soma dos valores de todas as disciplinas)
    const custoTecnico = disciplinas.reduce((total, disciplina) => {
      return total + (disciplina.opcional ? 0 : disciplina.valorTotal);
    }, 0);
    
    // Obter configurações padrão
    const config = this.configuracao.configuracoesPadrao;
    
    // Calcular componentes financeiros
    const custosIndiretos = custoTecnico * config.custos_indiretos;
    const impostos = custoTecnico * config.impostos;
    const contingencia = custoTecnico * config.contingencia;
    const lucro = custoTecnico * config.margem_lucro;
    
    return {
      custoTecnico,
      custosIndiretos,
      impostos,
      contingencia,
      lucro
    };
  }
  
  /**
   * Calcula cronograma do projeto
   */
  private calcularCronograma(disciplinas: DisciplinaOrcamento[], dados: DadosExtraidos): CronogramaOrcamento {
    // Calcular prazo total baseado na área e complexidade
    const prazoBase = Math.sqrt(dados.areaConstruida) / 5;
    const multiplicadorComplexidade = this.obterMultiplicadorPrazo(dados.complexidade);
    let prazoTotal = Math.ceil(prazoBase * multiplicadorComplexidade);
    
    // Garantir prazo mínimo de 8 semanas
    prazoTotal = Math.max(prazoTotal, 8);
    
    // Se o cliente especificou um prazo desejado, considerar
    if (dados.prazoDesejado && dados.prazoDesejado > 0) {
      // Converter prazo desejado de meses para semanas
      const prazoDesejadoSemanas = dados.prazoDesejado * 4.33;
      
      // Usar o menor entre o prazo calculado e o desejado, mas com mínimo de 8 semanas
      prazoTotal = Math.max(Math.min(prazoTotal, prazoDesejadoSemanas), 8);
    }
    
    // Criar etapas do cronograma
    const etapas: EtapaCronograma[] = [
      {
        nome: 'Levantamento de Dados',
        codigo: 'LV',
        inicio: 0,
        duracao: Math.max(1, Math.ceil(prazoTotal * 0.1)),
        fim: 0, // Será calculado
        disciplinas: disciplinas.map(d => d.codigo),
        marcos: ['Início do Projeto', 'Coleta de Dados']
      },
      {
        nome: 'Estudo Preliminar',
        codigo: 'EP',
        inicio: 0, // Será calculado
        duracao: Math.max(2, Math.ceil(prazoTotal * 0.25)),
        fim: 0, // Será calculado
        disciplinas: disciplinas.map(d => d.codigo),
        marcos: ['Apresentação de Conceitos', 'Aprovação de Estudo']
      },
      {
        nome: 'Anteprojeto',
        codigo: 'AP',
        inicio: 0, // Será calculado
        duracao: Math.max(2, Math.ceil(prazoTotal * 0.25)),
        fim: 0, // Será calculado
        disciplinas: disciplinas.map(d => d.codigo),
        marcos: ['Compatibilização', 'Aprovação de Anteprojeto']
      },
      {
        nome: 'Projeto Executivo',
        codigo: 'PE',
        inicio: 0, // Será calculado
        duracao: Math.max(3, Math.ceil(prazoTotal * 0.4)),
        fim: 0, // Será calculado
        disciplinas: disciplinas.map(d => d.codigo),
        marcos: ['Detalhamentos', 'Entrega Final']
      }
    ];
    
    // Calcular início e fim de cada etapa
    let inicioAtual = 0;
    for (let i = 0; i < etapas.length; i++) {
      etapas[i].inicio = inicioAtual;
      etapas[i].fim = inicioAtual + etapas[i].duracao;
      inicioAtual = etapas[i].fim;
    }
    
    return {
      prazoTotal,
      etapas
    };
  }  /**

   * Gera proposta comercial baseada nos dados do projeto
   */
  private gerarProposta(dados: DadosExtraidos, disciplinas: DisciplinaOrcamento[]): PropostaOrcamento {
    // Gerar escopo baseado nas disciplinas
    const escopo = `Elaboração de projeto ${dados.tipologia.toLowerCase()} ${dados.subtipo || ''} com área de ${dados.areaConstruida}m², incluindo as disciplinas de ${disciplinas.filter(d => !d.opcional).map(d => d.nome).join(', ')}.`;
    
    // Premissas padrão
    const premissas = [
      'Cliente fornecerá documentação completa do terreno',
      'Reuniões de acompanhamento quinzenais',
      'Até 2 revisões por etapa de projeto',
      'Aprovações formais ao final de cada etapa'
    ];
    
    // Exclusões padrão
    const exclusoes = [
      'Aprovações em órgãos públicos',
      'Taxas e emolumentos',
      'Acompanhamento de obra',
      'Projetos não listados no escopo'
    ];
    
    // Condições comerciais
    const condicoesComerciais = [
      'Pagamento em parcelas conforme cronograma',
      'Primeira parcela na assinatura do contrato',
      'Reajuste anual pelo INCC'
    ];
    
    // Formas de pagamento
    const formasPagamento = [
      'Transferência bancária',
      'PIX',
      'Boleto bancário'
    ];
    
    return {
      escopo,
      premissas,
      exclusoes,
      condicoesComerciais,
      formasPagamento,
      validadeProposta: 30 // 30 dias
    };
  }
  
  /**
   * Gera código único para o orçamento
   */
  private gerarCodigoOrcamento(briefingId: string): string {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear().toString().substring(2);
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `ORC-${ano}${mes}-${randomPart}`;
  }
  
  /**
   * Obtém parâmetros de complexidade
   */
  private obterParametrosComplexidade(complexidade: string): { multiplicador: number; horas_base_m2: number } {
    const complexidadeNormalizada = complexidade.toLowerCase();
    
    if (complexidadeNormalizada.includes('muito_alta') || complexidadeNormalizada.includes('muito alta')) {
      return this.configuracao.parametrosComplexidade.muito_alta;
    }
    
    if (complexidadeNormalizada.includes('alta')) {
      return this.configuracao.parametrosComplexidade.alta;
    }
    
    if (complexidadeNormalizada.includes('media') || complexidadeNormalizada.includes('média')) {
      return this.configuracao.parametrosComplexidade.media;
    }
    
    return this.configuracao.parametrosComplexidade.baixa;
  }
  
  /**
   * Obtém multiplicador de tipologia
   */
  private obterMultiplicadorTipologia(tipologia: string, subtipo?: string): number {
    const tipologiaNormalizada = tipologia.toLowerCase();
    const subtipoNormalizado = subtipo?.toLowerCase() || '';
    
    // Residencial
    if (tipologiaNormalizada.includes('residencial')) {
      if (subtipoNormalizado.includes('multi') || subtipoNormalizado.includes('edifício')) {
        return this.configuracao.multiplicadores.residencial.multifamiliar;
      }
      if (subtipoNormalizado.includes('condomínio') || subtipoNormalizado.includes('condominio')) {
        return this.configuracao.multiplicadores.residencial.condominio;
      }
      return this.configuracao.multiplicadores.residencial.unifamiliar;
    }
    
    // Comercial
    if (tipologiaNormalizada.includes('comercial')) {
      if (subtipoNormalizado.includes('hotel') || subtipoNormalizado.includes('pousada')) {
        return this.configuracao.multiplicadores.comercial.hotel;
      }
      if (subtipoNormalizado.includes('shopping') || subtipoNormalizado.includes('mall')) {
        return this.configuracao.multiplicadores.comercial.shopping;
      }
      if (subtipoNormalizado.includes('loja') || subtipoNormalizado.includes('varejo')) {
        return this.configuracao.multiplicadores.comercial.loja;
      }
      return this.configuracao.multiplicadores.comercial.escritorio;
    }
    
    // Industrial
    if (tipologiaNormalizada.includes('industrial')) {
      if (subtipoNormalizado.includes('logístico') || subtipoNormalizado.includes('logistico')) {
        return this.configuracao.multiplicadores.industrial.centro_logistico;
      }
      if (subtipoNormalizado.includes('galpão') || subtipoNormalizado.includes('galpao')) {
        return this.configuracao.multiplicadores.industrial.galpao;
      }
      return this.configuracao.multiplicadores.industrial.fabrica;
    }
    
    // Institucional
    if (tipologiaNormalizada.includes('institucional')) {
      if (subtipoNormalizado.includes('hospital') || subtipoNormalizado.includes('clínica')) {
        return this.configuracao.multiplicadores.institucional.hospital;
      }
      if (subtipoNormalizado.includes('templo') || subtipoNormalizado.includes('igreja')) {
        return this.configuracao.multiplicadores.institucional.templo;
      }
      return this.configuracao.multiplicadores.institucional.escola;
    }
    
    // Padrão
    return 1.0;
  }  /**

   * Calcula horas para uma disciplina específica
   */
  private calcularHorasDisciplina(
    area: number,
    horasBaseM2: number,
    multiplicadorTipologia: number,
    multiplicadorComplexidade: number,
    disciplina: string
  ): number {
    // Fator de disciplina
    const fatorDisciplina = this.obterFatorDisciplina(disciplina);
    
    // Fator de escala (projetos maiores têm economia de escala)
    const fatorEscala = this.calcularFatorEscala(area);
    
    // Cálculo final
    const horas = area * horasBaseM2 * multiplicadorTipologia * multiplicadorComplexidade * fatorDisciplina * fatorEscala;
    
    // Arredondar para cima
    return Math.ceil(horas);
  }
  
  /**
   * Distribui horas por etapas de projeto
   */
  private distribuirHorasPorEtapas(horasTotal: number, disciplina: string): EtapaDisciplina[] {
    // Distribuição padrão por etapa
    const distribuicaoPadrao = {
      'LV': 0.1, // 10% Levantamento
      'EP': 0.25, // 25% Estudo Preliminar
      'AP': 0.25, // 25% Anteprojeto
      'PE': 0.4 // 40% Projeto Executivo
    };
    
    // Ajustar distribuição conforme disciplina
    let distribuicao = { ...distribuicaoPadrao };
    
    if (disciplina === 'ESTRUTURAL') {
      distribuicao = {
        'LV': 0.05,
        'EP': 0.15,
        'AP': 0.3,
        'PE': 0.5
      };
    } else if (disciplina.includes('INSTALACOES')) {
      distribuicao = {
        'LV': 0.05,
        'EP': 0.15,
        'AP': 0.3,
        'PE': 0.5
      };
    }
    
    // Criar etapas
    return [
      {
        nome: 'Levantamento de Dados',
        codigo: 'LV',
        percentual: distribuicao.LV,
        horasEstimadas: Math.ceil(horasTotal * distribuicao.LV),
        valorEstimado: 0, // Será calculado depois
        entregaveis: ['Relatório de Levantamento', 'Análise de Requisitos']
      },
      {
        nome: 'Estudo Preliminar',
        codigo: 'EP',
        percentual: distribuicao.EP,
        horasEstimadas: Math.ceil(horasTotal * distribuicao.EP),
        valorEstimado: 0,
        entregaveis: ['Plantas Conceituais', 'Estudos Volumétricos']
      },
      {
        nome: 'Anteprojeto',
        codigo: 'AP',
        percentual: distribuicao.AP,
        horasEstimadas: Math.ceil(horasTotal * distribuicao.AP),
        valorEstimado: 0,
        entregaveis: ['Plantas Técnicas', 'Memoriais']
      },
      {
        nome: 'Projeto Executivo',
        codigo: 'PE',
        percentual: distribuicao.PE,
        horasEstimadas: Math.ceil(horasTotal * distribuicao.PE),
        valorEstimado: 0,
        entregaveis: ['Detalhamentos', 'Especificações', 'Memoriais Descritivos']
      }
    ];
  }
  
  /**
   * Distribui equipe para uma disciplina
   */
  private distribuirEquipe(horasTotal: number, disciplina: string): EquipeDisciplina {
    // Distribuição padrão da equipe
    let senior = 0.2; // 20% Sênior
    let pleno = 0.3; // 30% Pleno
    let junior = 0.4; // 40% Júnior
    let estagiario = 0.1; // 10% Estagiário
    
    // Ajustar conforme disciplina
    if (disciplina === 'ARQUITETURA') {
      senior = 0.25;
      pleno = 0.35;
      junior = 0.3;
      estagiario = 0.1;
    } else if (disciplina === 'ESTRUTURAL') {
      senior = 0.3;
      pleno = 0.4;
      junior = 0.25;
      estagiario = 0.05;
    }
    
    return {
      senior: Math.ceil(horasTotal * senior),
      pleno: Math.ceil(horasTotal * pleno),
      junior: Math.ceil(horasTotal * junior),
      estagiario: Math.ceil(horasTotal * estagiario)
    };
  }
  
  /**
   * Calcula valor hora médio ponderado pela distribuição da equipe
   */
  private calcularValorHoraMedio(equipe: EquipeDisciplina, tabelaPrecos: any): number {
    const totalHoras = equipe.senior + equipe.pleno + equipe.junior + equipe.estagiario;
    
    if (totalHoras === 0) return 0;
    
    const valorTotal = 
      equipe.senior * tabelaPrecos.valor_hora_senior +
      equipe.pleno * tabelaPrecos.valor_hora_pleno +
      equipe.junior * tabelaPrecos.valor_hora_junior +
      equipe.estagiario * tabelaPrecos.valor_hora_estagiario;
    
    return valorTotal / totalHoras;
  }
  
  /**
   * Obtém tabela de preços para uma disciplina
   */
  private obterTabelaPrecosDisciplina(disciplina: string): any {
    if (disciplina === 'ARQUITETURA') {
      return this.configuracao.tabelaPrecos.arquitetura;
    }
    
    if (disciplina === 'ESTRUTURAL') {
      return this.configuracao.tabelaPrecos.estrutural;
    }
    
    if (disciplina.includes('INSTALACOES')) {
      return this.configuracao.tabelaPrecos.instalacoes;
    }
    
    if (disciplina === 'PAISAGISMO') {
      return this.configuracao.tabelaPrecos.paisagismo;
    }
    
    // Padrão
    return this.configuracao.tabelaPrecos.arquitetura;
  }  /
**
   * Obtém fator de disciplina para cálculo de horas
   */
  private obterFatorDisciplina(disciplina: string): number {
    const fatores: Record<string, number> = {
      'ARQUITETURA': 1.0,
      'ESTRUTURAL': 0.7,
      'INSTALACOES_ELETRICAS': 0.5,
      'INSTALACOES_HIDRAULICAS': 0.5,
      'PAISAGISMO': 0.4,
      'DESIGN_INTERIORES': 0.6,
      'AVAC': 0.5,
      'LUMINOTECNICA': 0.3,
      'ACUSTICA': 0.3,
      'AUTOMACAO': 0.4
    };
    
    return fatores[disciplina] || 0.5;
  }
  
  /**
   * Calcula fator de escala baseado na área
   */
  private calcularFatorEscala(area: number): number {
    // Projetos maiores têm economia de escala
    if (area > 5000) return 0.7;
    if (area > 2000) return 0.8;
    if (area > 1000) return 0.9;
    return 1.0;
  }
  
  /**
   * Obtém multiplicador de prazo baseado na complexidade
   */
  private obterMultiplicadorPrazo(complexidade: string): number {
    const multiplicadores: Record<string, number> = {
      'BAIXA': 0.8,
      'MEDIA': 1.0,
      'ALTA': 1.3,
      'MUITO_ALTA': 1.6
    };
    
    return multiplicadores[complexidade] || 1.0;
  }
  
  /**
   * Normaliza nome de disciplina
   */
  private normalizarNomeDisciplina(disciplina: string): string {
    const nome = disciplina.toUpperCase().trim();
    
    if (nome.includes('ARQUITET')) return 'ARQUITETURA';
    if (nome.includes('ESTRUT')) return 'ESTRUTURAL';
    if (nome.includes('ELETRIC')) return 'INSTALACOES_ELETRICAS';
    if (nome.includes('HIDRAUL')) return 'INSTALACOES_HIDRAULICAS';
    if (nome.includes('PAISAG')) return 'PAISAGISMO';
    if (nome.includes('INTERIOR')) return 'DESIGN_INTERIORES';
    if (nome.includes('CONDICIONADO') || nome.includes('AVAC')) return 'AVAC';
    if (nome.includes('LUMIN')) return 'LUMINOTECNICA';
    if (nome.includes('ACUSTIC')) return 'ACUSTICA';
    if (nome.includes('AUTOMA')) return 'AUTOMACAO';
    
    return nome;
  }
  
  /**
   * Obtém nome completo da disciplina
   */
  private obterNomeCompletoDisciplina(codigo: string): string {
    const nomes: Record<string, string> = {
      'ARQUITETURA': 'Projeto de Arquitetura',
      'ESTRUTURAL': 'Projeto Estrutural',
      'INSTALACOES_ELETRICAS': 'Projeto de Instalações Elétricas',
      'INSTALACOES_HIDRAULICAS': 'Projeto de Instalações Hidráulicas',
      'PAISAGISMO': 'Projeto de Paisagismo',
      'DESIGN_INTERIORES': 'Projeto de Design de Interiores',
      'AVAC': 'Projeto de Ar Condicionado e Ventilação',
      'LUMINOTECNICA': 'Projeto de Luminotécnica',
      'ACUSTICA': 'Projeto de Acústica',
      'AUTOMACAO': 'Projeto de Automação'
    };
    
    return nomes[codigo] || codigo;
  }
}

// Exportar classe
export default BudgetCalculationService;