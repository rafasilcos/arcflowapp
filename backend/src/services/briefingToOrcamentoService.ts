// 🧠 MOTOR INTELIGENTE: BRIEFING → ORÇAMENTO REAL
// Sistema que analisa qualquer briefing e gera orçamento preciso
// Funciona com briefings padrão E personalizados

import { logger } from '../config/logger';

// ===== TIPOS LOCAIS =====
export type TipoComplexidade = 'baixa' | 'media' | 'alta' | 'muito_alta';

// ===== INTERFACES =====
export interface DadosTecnicosExtraidos {
  // Dados básicos obrigatórios
  tipologia: string;
  subtipo: string;
  areaEstimada: number;
  complexidade: TipoComplexidade;
  localizacao: string;
  padrao: string;
  
  // Dados financeiros
  orcamentoDisponivel: number;
  prazoDesejado: number;
  urgencia: string;
  
  // Programa arquitetônico
  numeroQuartos: number;
  numeroBanheiros: number;
  numeroVagas: number;
  numeroAndares: number;
  
  // Disciplinas identificadas
  disciplinasNecessarias: string[];
  
  // Sistemas técnicos
  sistemas: {
    estrutural: boolean;
    hidraulico: boolean;
    eletrico: boolean;
    avac: boolean;
    automacao: boolean;
    seguranca: boolean;
  };
  
  // Características especiais
  caracteristicasEspeciais: string[];
  
  // Indicadores de complexidade
  indicadoresComplexidade: {
    arquitetonico: number; // 1-10
    estrutural: number; // 1-10
    instalacoes: number; // 1-10
    acabamentos: number; // 1-10
  };
}

export interface OrcamentoRealGerado {
  id: string;
  briefingId: string;
  dadosTecnicos: DadosTecnicosExtraidos;
  
  // Cálculos de horas por profissional
  horasPorProfissional: {
    arquiteto: { horas: number; valorHora: number; total: number };
    engenheiro: { horas: number; valorHora: number; total: number };
    desenhista: { horas: number; valorHora: number; total: number };
    estagiario: { horas: number; valorHora: number; total: number };
    coordenador: { horas: number; valorHora: number; total: number };
  };
  
  // Cálculos por disciplina
  disciplinas: {
    nome: string;
    horas: number;
    valorTotal: number;
    profissionaisNecessarios: string[];
    entregaveis: string[];
  }[];
  
  // Cronograma realista
  cronograma: {
    etapas: {
      nome: string;
      duracao: number; // dias
      horas: number;
      valor: number;
      dependencias: string[];
      entregas: string[];
    }[];
    prazoTotal: number;
    dataInicio: Date;
    dataFim: Date;
  };
  
  // Composição financeira
  composicaoFinanceira: {
    custosHoras: number;
    custosIndiretos: number;
    impostos: number;
    margemLucro: number;
    valorTotal: number;
    valorPorM2: number;
  };
  
  // Análise de riscos
  analiseRiscos: {
    riscoTecnico: number; // 1-10
    riscoPrazo: number; // 1-10
    riscoFinanceiro: number; // 1-10
    observacoes: string[];
  };
  
  // Comparação com histórico
  benchmarking: {
    projetosSimilares: number;
    valorMedio: number;
    prazoMedio: number;
    desvioValor: number;
    desvioPrazo: number;
  };
}

// ===== MOTOR DE EXTRAÇÃO INTELIGENTE =====
export class BriefingToOrcamentoService {
  private static instance: BriefingToOrcamentoService;
  
  // Banco de dados de padrões AEC
  private padroesTecnicos = {
    horasPorM2: {
      'residencial-simples': { arquiteto: 2.5, engenheiro: 1.5, desenhista: 3.0 },
      'residencial-medio': { arquiteto: 3.5, engenheiro: 2.0, desenhista: 4.0 },
      'residencial-alto': { arquiteto: 5.0, engenheiro: 3.0, desenhista: 5.5 },
      'comercial-simples': { arquiteto: 3.0, engenheiro: 2.5, desenhista: 3.5 },
      'comercial-medio': { arquiteto: 4.0, engenheiro: 3.5, desenhista: 4.5 },
      'comercial-alto': { arquiteto: 6.0, engenheiro: 4.5, desenhista: 6.0 },
      'industrial': { arquiteto: 4.5, engenheiro: 6.0, desenhista: 5.0 },
      'institucional': { arquiteto: 5.5, engenheiro: 4.0, desenhista: 5.0 }
    },
    
    valoresHora: {
      'arquiteto': { junior: 120, pleno: 180, senior: 250 },
      'engenheiro': { junior: 140, pleno: 200, senior: 280 },
      'desenhista': { junior: 60, pleno: 90, senior: 120 },
      'estagiario': { junior: 25, pleno: 35, senior: 45 },
      'coordenador': { junior: 200, pleno: 280, senior: 380 }
    },
    
    multiplicadoresComplexidade: {
      'baixa': 0.8,
      'media': 1.0,
      'alta': 1.4,
      'muito_alta': 1.8
    },
    
    multiplicadoresUrgencia: {
      'normal': 1.0,
      'urgente': 1.3,
      'muito_urgente': 1.6
    },
    
    percentuaisIndiretos: {
      'impressoes': 0.02,
      'plotagens': 0.03,
      'transportes': 0.02,
      'software': 0.04,
      'overhead': 0.15
    }
  };
  
  public static getInstance(): BriefingToOrcamentoService {
    if (!BriefingToOrcamentoService.instance) {
      BriefingToOrcamentoService.instance = new BriefingToOrcamentoService();
    }
    return BriefingToOrcamentoService.instance;
  }
  
  // ===== MÉTODO PRINCIPAL =====
  async analisarBriefingEGerarOrcamento(briefing: any): Promise<OrcamentoRealGerado> {
    try {
      logger.info('🧠 Iniciando análise inteligente do briefing', { briefingId: briefing.id });
      
      // 1. EXTRAIR DADOS TÉCNICOS (funciona com qualquer briefing)
      const dadosTecnicos = await this.extrairDadosTecnicos(briefing);
      
      // 2. CALCULAR HORAS BASEADO NOS DADOS REAIS
      const horasPorProfissional = this.calcularHorasPorProfissional(dadosTecnicos);
      
      // 3. DETERMINAR DISCIPLINAS NECESSÁRIAS
      const disciplinas = this.determinarDisciplinas(dadosTecnicos);
      
      // 4. GERAR CRONOGRAMA REALISTA
      const cronograma = this.gerarCronograma(dadosTecnicos, horasPorProfissional);
      
      // 5. CALCULAR COMPOSIÇÃO FINANCEIRA
      const composicaoFinanceira = this.calcularComposicaoFinanceira(horasPorProfissional, dadosTecnicos);
      
      // 6. ANÁLISE DE RISCOS
      const analiseRiscos = this.analisarRiscos(dadosTecnicos, briefing);
      
      // 7. BENCHMARKING
      const benchmarking = await this.obterBenchmarking(dadosTecnicos);
      
      const orcamentoGerado: OrcamentoRealGerado = {
        id: this.gerarId(),
        briefingId: briefing.id,
        dadosTecnicos,
        horasPorProfissional,
        disciplinas,
        cronograma,
        composicaoFinanceira,
        analiseRiscos,
        benchmarking
      };
      
      logger.info('✅ Orçamento inteligente gerado com sucesso', {
        briefingId: briefing.id,
        valorTotal: composicaoFinanceira.valorTotal,
        prazoTotal: cronograma.prazoTotal
      });
      
      return orcamentoGerado;
      
    } catch (error) {
      logger.error('❌ Erro ao gerar orçamento inteligente:', error);
      throw error;
    }
  }
  
  // ===== EXTRAÇÃO INTELIGENTE DE DADOS =====
  private async extrairDadosTecnicos(briefing: any): Promise<DadosTecnicosExtraidos> {
    const respostas = this.obterRespostas(briefing);
    
    // ANÁLISE INTELIGENTE DE QUALQUER TIPO DE BRIEFING
    const tipologia = this.identificarTipologia(respostas);
    const subtipo = this.identificarSubtipo(respostas, tipologia);
    const areaEstimada = this.extrairArea(respostas);
    const complexidade = this.calcularComplexidade(respostas);
    const localizacao = this.extrairLocalizacao(respostas);
    const padrao = this.identificarPadrao(respostas);
    
    const orcamentoDisponivel = this.extrairOrcamento(respostas);
    const prazoDesejado = this.extrairPrazo(respostas);
    const urgencia = this.identificarUrgencia(respostas);
    
    const numeroQuartos = this.extrairNumeroQuartos(respostas);
    const numeroBanheiros = this.extrairNumeroBanheiros(respostas);
    const numeroVagas = this.extrairNumeroVagas(respostas);
    const numeroAndares = this.extrairNumeroAndares(respostas);
    
    const disciplinasNecessarias = this.identificarDisciplinas(respostas, tipologia);
    const sistemas = this.identificarSistemas(respostas);
    const caracteristicasEspeciais = this.extrairCaracteristicasEspeciais(respostas);
    const indicadoresComplexidade = this.calcularIndicadoresComplexidade(respostas);
    
    return {
      tipologia,
      subtipo,
      areaEstimada,
      complexidade,
      localizacao,
      padrao,
      orcamentoDisponivel,
      prazoDesejado,
      urgencia,
      numeroQuartos,
      numeroBanheiros,
      numeroVagas,
      numeroAndares,
      disciplinasNecessarias,
      sistemas,
      caracteristicasEspeciais,
      indicadoresComplexidade
    };
  }
  
  // ===== OBTER RESPOSTAS (FUNCIONA COM QUALQUER ESTRUTURA) =====
  private obterRespostas(briefing: any): Record<string, any> {
    const respostas: Record<string, any> = {};
    
    // Tentar diferentes estruturas de dados
    if (briefing.metadata?.respostas) {
      Object.assign(respostas, briefing.metadata.respostas);
    }
    
    if (briefing.respostas) {
      Object.assign(respostas, briefing.respostas);
    }
    
    if (briefing.observacoes) {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        if (observacoes.respostas) {
          Object.assign(respostas, observacoes.respostas);
        }
      } catch (error) {
        // Ignorar erros de parsing
      }
    }
    
    // Estrutura personalizada
    if (briefing.estrutura_briefing?.secoes) {
      briefing.estrutura_briefing.secoes.forEach((secao: any) => {
        secao.perguntas?.forEach((pergunta: any) => {
          if (pergunta.resposta) {
            const chave = pergunta.id || pergunta.pergunta_original;
            respostas[chave] = pergunta.resposta;
          }
        });
      });
    }
    
    return respostas;
  }
  
  // ===== IDENTIFICAÇÃO INTELIGENTE DE DADOS =====
  private identificarTipologia(respostas: Record<string, any>): string {
    const palavrasChave = {
      'residencial': ['casa', 'residencial', 'apartamento', 'moradia', 'família'],
      'comercial': ['comercial', 'escritório', 'loja', 'negócio', 'empresa'],
      'industrial': ['industrial', 'fábrica', 'galpão', 'produção', 'indústria'],
      'institucional': ['escola', 'hospital', 'igreja', 'público', 'clínica']
    };
    
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    for (const [tipologia, palavras] of Object.entries(palavrasChave)) {
      if (palavras.some(palavra => textoCompleto.includes(palavra))) {
        return tipologia;
      }
    }
    
    return 'residencial'; // Padrão
  }
  
  private extrairArea(respostas: Record<string, any>): number {
    const chavesArea = ['area', 'areaConstruida', 'areaTotal', 'metragem', 'm2'];
    
    for (const chave of chavesArea) {
      const valor = respostas[chave];
      if (valor) {
        const numeroExtraido = this.extrairNumero(valor);
        if (numeroExtraido > 0) {
          return numeroExtraido;
        }
      }
    }
    
    // Buscar em qualquer resposta que contenha área
    for (const [chave, valor] of Object.entries(respostas)) {
      if (chave.toLowerCase().includes('area') || chave.toLowerCase().includes('m2')) {
        const numeroExtraido = this.extrairNumero(valor);
        if (numeroExtraido > 0) {
          return numeroExtraido;
        }
      }
    }
    
    return 200; // Área padrão
  }
  
  private calcularComplexidade(respostas: Record<string, any>): TipoComplexidade {
    let pontuacao = 0;
    
    // Análise de palavras-chave
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('automação')) pontuacao += 2;
    if (textoCompleto.includes('luxo') || textoCompleto.includes('premium')) pontuacao += 2;
    if (textoCompleto.includes('sustentável') || textoCompleto.includes('certificação')) pontuacao += 2;
    if (textoCompleto.includes('complexo') || textoCompleto.includes('especial')) pontuacao += 2;
    
    // Análise de quantidade de ambientes
    const numeroQuartos = this.extrairNumeroQuartos(respostas);
    if (numeroQuartos > 4) pontuacao += 1;
    if (numeroQuartos > 6) pontuacao += 1;
    
    // Análise de orçamento
    const orcamento = this.extrairOrcamento(respostas);
    if (orcamento > 1000000) pontuacao += 1;
    if (orcamento > 2000000) pontuacao += 2;
    
    if (pontuacao >= 8) return 'muito_alta';
    if (pontuacao >= 6) return 'alta';
    if (pontuacao >= 3) return 'media';
    return 'baixa';
  }
  
  // ===== CÁLCULO DE HORAS POR PROFISSIONAL =====
  private calcularHorasPorProfissional(dados: DadosTecnicosExtraidos): OrcamentoRealGerado['horasPorProfissional'] {
    const chaveHoras = `${dados.tipologia}-${dados.padrao}`;
    const padraoHoras = (this.padroesTecnicos.horasPorM2 as any)[chaveHoras] || this.padroesTecnicos.horasPorM2['residencial-medio'];
    
    const multiplicador = this.padroesTecnicos.multiplicadoresComplexidade[dados.complexidade];
    const multiplicadorUrgencia = (this.padroesTecnicos.multiplicadoresUrgencia as any)[dados.urgencia] || 1.0;
    
    const horasArquiteto = Math.ceil(padraoHoras.arquiteto * dados.areaEstimada * multiplicador * multiplicadorUrgencia);
    const horasEngenheiro = Math.ceil(padraoHoras.engenheiro * dados.areaEstimada * multiplicador);
    const horasDesenhista = Math.ceil(padraoHoras.desenhista * dados.areaEstimada * multiplicador);
    const horasEstagiario = Math.ceil(horasDesenhista * 0.3); // 30% das horas de desenho
    const horasCoordenador = Math.ceil((horasArquiteto + horasEngenheiro) * 0.15); // 15% das horas técnicas
    
    const valorHoraArquiteto = this.padroesTecnicos.valoresHora.arquiteto.pleno;
    const valorHoraEngenheiro = this.padroesTecnicos.valoresHora.engenheiro.pleno;
    const valorHoraDesenhista = this.padroesTecnicos.valoresHora.desenhista.pleno;
    const valorHoraEstagiario = this.padroesTecnicos.valoresHora.estagiario.pleno;
    const valorHoraCoordenador = this.padroesTecnicos.valoresHora.coordenador.pleno;
    
    return {
      arquiteto: {
        horas: horasArquiteto,
        valorHora: valorHoraArquiteto,
        total: horasArquiteto * valorHoraArquiteto
      },
      engenheiro: {
        horas: horasEngenheiro,
        valorHora: valorHoraEngenheiro,
        total: horasEngenheiro * valorHoraEngenheiro
      },
      desenhista: {
        horas: horasDesenhista,
        valorHora: valorHoraDesenhista,
        total: horasDesenhista * valorHoraDesenhista
      },
      estagiario: {
        horas: horasEstagiario,
        valorHora: valorHoraEstagiario,
        total: horasEstagiario * valorHoraEstagiario
      },
      coordenador: {
        horas: horasCoordenador,
        valorHora: valorHoraCoordenador,
        total: horasCoordenador * valorHoraCoordenador
      }
    };
  }
  
  // ===== MÉTODOS AUXILIARES =====
  private extrairNumero(valor: any): number {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const match = valor.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  }
  
  private extrairNumeroQuartos(respostas: Record<string, any>): number {
    const chavesQuartos = ['quartos', 'numeroQuartos', 'num_quartos', 'bedrooms'];
    
    for (const chave of chavesQuartos) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 3; // Padrão
  }
  
  private extrairNumeroBanheiros(respostas: Record<string, any>): number {
    const chavesBanheiros = ['banheiros', 'numeroBanheiros', 'num_banheiros', 'bathrooms'];
    
    for (const chave of chavesBanheiros) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 2; // Padrão
  }
  
  private extrairNumeroVagas(respostas: Record<string, any>): number {
    const chavesVagas = ['vagas', 'numeroVagas', 'num_vagas', 'garagem'];
    
    for (const chave of chavesVagas) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero >= 0) return numero;
      }
    }
    
    return 2; // Padrão
  }
  
  private extrairNumeroAndares(respostas: Record<string, any>): number {
    const chavesAndares = ['andares', 'pavimentos', 'num_andares', 'floors'];
    
    for (const chave of chavesAndares) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 1; // Padrão
  }
  
  private extrairOrcamento(respostas: Record<string, any>): number {
    const chavesOrcamento = ['orcamento', 'investimento', 'valor', 'budget'];
    
    for (const chave of chavesOrcamento) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 1500000; // Padrão
  }
  
  private extrairPrazo(respostas: Record<string, any>): number {
    const chavesPrazo = ['prazo', 'tempo', 'deadline', 'cronograma'];
    
    for (const chave of chavesPrazo) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 180; // Padrão em dias
  }
  
  private extrairLocalizacao(respostas: Record<string, any>): string {
    const chavesLocalizacao = ['localizacao', 'cidade', 'estado', 'endereco'];
    
    for (const chave of chavesLocalizacao) {
      const valor = respostas[chave];
      if (valor && typeof valor === 'string') {
        return valor;
      }
    }
    
    return 'São Paulo'; // Padrão
  }
  
  private identificarSubtipo(respostas: Record<string, any>, tipologia: string): string {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (tipologia === 'residencial') {
      if (textoCompleto.includes('casa')) return 'casa';
      if (textoCompleto.includes('apartamento')) return 'apartamento';
      if (textoCompleto.includes('condomínio')) return 'condominio';
      return 'casa';
    }
    
    if (tipologia === 'comercial') {
      if (textoCompleto.includes('escritório')) return 'escritorio';
      if (textoCompleto.includes('loja')) return 'loja';
      if (textoCompleto.includes('restaurante')) return 'restaurante';
      return 'escritorio';
    }
    
    return 'padrao';
  }
  
  private identificarPadrao(respostas: Record<string, any>): string {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('luxo') || textoCompleto.includes('premium')) return 'alto';
    if (textoCompleto.includes('simples') || textoCompleto.includes('básico')) return 'simples';
    return 'medio';
  }
  
  private identificarUrgencia(respostas: Record<string, any>): string {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('urgente') || textoCompleto.includes('rápido')) return 'urgente';
    if (textoCompleto.includes('muito urgente') || textoCompleto.includes('imediato')) return 'muito_urgente';
    return 'normal';
  }
  
  private identificarDisciplinas(respostas: Record<string, any>, tipologia: string): string[] {
    const disciplinas = ['arquitetura']; // Sempre obrigatória
    
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('estrutura') || textoCompleto.includes('fundação')) {
      disciplinas.push('estrutural');
    }
    
    if (textoCompleto.includes('hidráulica') || textoCompleto.includes('elétrica') || textoCompleto.includes('instalações')) {
      disciplinas.push('instalacoes');
    }
    
    if (textoCompleto.includes('interiores') || textoCompleto.includes('design')) {
      disciplinas.push('interiores');
    }
    
    if (textoCompleto.includes('paisagismo') || textoCompleto.includes('jardim')) {
      disciplinas.push('paisagismo');
    }
    
    return disciplinas;
  }
  
  private identificarSistemas(respostas: Record<string, any>): DadosTecnicosExtraidos['sistemas'] {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    return {
      estrutural: textoCompleto.includes('estrutura') || textoCompleto.includes('fundação'),
      hidraulico: textoCompleto.includes('hidráulica') || textoCompleto.includes('água'),
      eletrico: textoCompleto.includes('elétrica') || textoCompleto.includes('energia'),
      avac: textoCompleto.includes('ar condicionado') || textoCompleto.includes('climatização'),
      automacao: textoCompleto.includes('automação') || textoCompleto.includes('smart'),
      seguranca: textoCompleto.includes('segurança') || textoCompleto.includes('alarme')
    };
  }
  
  private extrairCaracteristicasEspeciais(respostas: Record<string, any>): string[] {
    const caracteristicas: string[] = [];
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('sustentável')) caracteristicas.push('Sustentabilidade');
    if (textoCompleto.includes('automação')) caracteristicas.push('Automação');
    if (textoCompleto.includes('luxo')) caracteristicas.push('Alto Padrão');
    if (textoCompleto.includes('acessibilidade')) caracteristicas.push('Acessibilidade');
    
    return caracteristicas;
  }
  
  private calcularIndicadoresComplexidade(respostas: Record<string, any>): DadosTecnicosExtraidos['indicadoresComplexidade'] {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    let arquitetonico = 5;
    let estrutural = 5;
    let instalacoes = 5;
    let acabamentos = 5;
    
    // Ajustar baseado em palavras-chave
    if (textoCompleto.includes('complexo')) arquitetonico += 2;
    if (textoCompleto.includes('especial')) estrutural += 2;
    if (textoCompleto.includes('automação')) instalacoes += 3;
    if (textoCompleto.includes('luxo')) acabamentos += 3;
    
    return {
      arquitetonico: Math.min(arquitetonico, 10),
      estrutural: Math.min(estrutural, 10),
      instalacoes: Math.min(instalacoes, 10),
      acabamentos: Math.min(acabamentos, 10)
    };
  }
  
  private determinarDisciplinas(dados: DadosTecnicosExtraidos) {
    // Implementar lógica para determinar disciplinas necessárias
    return dados.disciplinasNecessarias.map(disciplina => ({
      nome: disciplina,
      horas: 100, // Calcular baseado na disciplina
      valorTotal: 15000, // Calcular baseado nas horas
      profissionaisNecessarios: ['arquiteto'],
      entregaveis: ['Projeto executivo']
    }));
  }
  
  private gerarCronograma(dados: DadosTecnicosExtraidos, horas: OrcamentoRealGerado['horasPorProfissional']) {
    const prazoTotal = Math.ceil(dados.prazoDesejado * 0.8); // 80% do prazo desejado
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + prazoTotal);
    
    const totalHoras = horas.arquiteto.horas + horas.engenheiro.horas + horas.desenhista.horas + horas.estagiario.horas + horas.coordenador.horas;
    const totalValor = horas.arquiteto.total + horas.engenheiro.total + horas.desenhista.total + horas.estagiario.total + horas.coordenador.total;
    
    return {
      etapas: [
        {
          nome: 'Estudo Preliminar',
          duracao: Math.ceil(prazoTotal * 0.2),
          horas: totalHoras * 0.2,
          valor: totalValor * 0.2,
          dependencias: [],
          entregas: ['Plantas conceituais', 'Volumetria 3D']
        },
        {
          nome: 'Anteprojeto',
          duracao: Math.ceil(prazoTotal * 0.3),
          horas: totalHoras * 0.3,
          valor: totalValor * 0.3,
          dependencias: ['Estudo Preliminar'],
          entregas: ['Plantas detalhadas', 'Cortes e fachadas']
        },
        {
          nome: 'Projeto Executivo',
          duracao: Math.ceil(prazoTotal * 0.5),
          horas: totalHoras * 0.5,
          valor: totalValor * 0.5,
          dependencias: ['Anteprojeto'],
          entregas: ['Plantas executivas', 'Detalhamentos', 'Especificações']
        }
      ],
      prazoTotal,
      dataInicio,
      dataFim
    };
  }
  
  private calcularComposicaoFinanceira(horas: OrcamentoRealGerado['horasPorProfissional'], dados: DadosTecnicosExtraidos) {
    const custosHoras = horas.arquiteto.total + horas.engenheiro.total + horas.desenhista.total + horas.estagiario.total + horas.coordenador.total;
    const custosIndiretos = custosHoras * 0.25; // 25% dos custos diretos
    const impostos = (custosHoras + custosIndiretos) * 0.15; // 15%
    const margemLucro = (custosHoras + custosIndiretos + impostos) * 0.20; // 20%
    const valorTotal = custosHoras + custosIndiretos + impostos + margemLucro;
    
    return {
      custosHoras,
      custosIndiretos,
      impostos,
      margemLucro,
      valorTotal,
      valorPorM2: valorTotal / dados.areaEstimada
    };
  }
  
  private analisarRiscos(dados: DadosTecnicosExtraidos, briefing: any) {
    return {
      riscoTecnico: dados.indicadoresComplexidade.arquitetonico > 7 ? 8 : 5,
      riscoPrazo: dados.urgencia === 'urgente' ? 7 : 4,
      riscoFinanceiro: dados.orcamentoDisponivel < 1000000 ? 6 : 3,
      observacoes: ['Projeto dentro da normalidade']
    };
  }
  
  private async obterBenchmarking(dados: DadosTecnicosExtraidos) {
    // Implementar consulta ao histórico de projetos
    return {
      projetosSimilares: 5,
      valorMedio: 850000,
      prazoMedio: 120,
      desvioValor: 15,
      desvioPrazo: 10
    };
  }
  
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// ===== EXPORT =====
export const briefingToOrcamentoService = BriefingToOrcamentoService.getInstance(); 
// Sistema que analisa qualquer briefing e gera orçamento preciso
// Funciona com briefings padrão E personalizados

import { logger } from '../config/logger';

// ===== TIPOS LOCAIS =====
export type TipoComplexidade = 'baixa' | 'media' | 'alta' | 'muito_alta';

// ===== INTERFACES =====
export interface DadosTecnicosExtraidos {
  // Dados básicos obrigatórios
  tipologia: string;
  subtipo: string;
  areaEstimada: number;
  complexidade: TipoComplexidade;
  localizacao: string;
  padrao: string;
  
  // Dados financeiros
  orcamentoDisponivel: number;
  prazoDesejado: number;
  urgencia: string;
  
  // Programa arquitetônico
  numeroQuartos: number;
  numeroBanheiros: number;
  numeroVagas: number;
  numeroAndares: number;
  
  // Disciplinas identificadas
  disciplinasNecessarias: string[];
  
  // Sistemas técnicos
  sistemas: {
    estrutural: boolean;
    hidraulico: boolean;
    eletrico: boolean;
    avac: boolean;
    automacao: boolean;
    seguranca: boolean;
  };
  
  // Características especiais
  caracteristicasEspeciais: string[];
  
  // Indicadores de complexidade
  indicadoresComplexidade: {
    arquitetonico: number; // 1-10
    estrutural: number; // 1-10
    instalacoes: number; // 1-10
    acabamentos: number; // 1-10
  };
}

export interface OrcamentoRealGerado {
  id: string;
  briefingId: string;
  dadosTecnicos: DadosTecnicosExtraidos;
  
  // Cálculos de horas por profissional
  horasPorProfissional: {
    arquiteto: { horas: number; valorHora: number; total: number };
    engenheiro: { horas: number; valorHora: number; total: number };
    desenhista: { horas: number; valorHora: number; total: number };
    estagiario: { horas: number; valorHora: number; total: number };
    coordenador: { horas: number; valorHora: number; total: number };
  };
  
  // Cálculos por disciplina
  disciplinas: {
    nome: string;
    horas: number;
    valorTotal: number;
    profissionaisNecessarios: string[];
    entregaveis: string[];
  }[];
  
  // Cronograma realista
  cronograma: {
    etapas: {
      nome: string;
      duracao: number; // dias
      horas: number;
      valor: number;
      dependencias: string[];
      entregas: string[];
    }[];
    prazoTotal: number;
    dataInicio: Date;
    dataFim: Date;
  };
  
  // Composição financeira
  composicaoFinanceira: {
    custosHoras: number;
    custosIndiretos: number;
    impostos: number;
    margemLucro: number;
    valorTotal: number;
    valorPorM2: number;
  };
  
  // Análise de riscos
  analiseRiscos: {
    riscoTecnico: number; // 1-10
    riscoPrazo: number; // 1-10
    riscoFinanceiro: number; // 1-10
    observacoes: string[];
  };
  
  // Comparação com histórico
  benchmarking: {
    projetosSimilares: number;
    valorMedio: number;
    prazoMedio: number;
    desvioValor: number;
    desvioPrazo: number;
  };
}

// ===== MOTOR DE EXTRAÇÃO INTELIGENTE =====
export class BriefingToOrcamentoService {
  private static instance: BriefingToOrcamentoService;
  
  // Banco de dados de padrões AEC
  private padroesTecnicos = {
    horasPorM2: {
      'residencial-simples': { arquiteto: 2.5, engenheiro: 1.5, desenhista: 3.0 },
      'residencial-medio': { arquiteto: 3.5, engenheiro: 2.0, desenhista: 4.0 },
      'residencial-alto': { arquiteto: 5.0, engenheiro: 3.0, desenhista: 5.5 },
      'comercial-simples': { arquiteto: 3.0, engenheiro: 2.5, desenhista: 3.5 },
      'comercial-medio': { arquiteto: 4.0, engenheiro: 3.5, desenhista: 4.5 },
      'comercial-alto': { arquiteto: 6.0, engenheiro: 4.5, desenhista: 6.0 },
      'industrial': { arquiteto: 4.5, engenheiro: 6.0, desenhista: 5.0 },
      'institucional': { arquiteto: 5.5, engenheiro: 4.0, desenhista: 5.0 }
    },
    
    valoresHora: {
      'arquiteto': { junior: 120, pleno: 180, senior: 250 },
      'engenheiro': { junior: 140, pleno: 200, senior: 280 },
      'desenhista': { junior: 60, pleno: 90, senior: 120 },
      'estagiario': { junior: 25, pleno: 35, senior: 45 },
      'coordenador': { junior: 200, pleno: 280, senior: 380 }
    },
    
    multiplicadoresComplexidade: {
      'baixa': 0.8,
      'media': 1.0,
      'alta': 1.4,
      'muito_alta': 1.8
    },
    
    multiplicadoresUrgencia: {
      'normal': 1.0,
      'urgente': 1.3,
      'muito_urgente': 1.6
    },
    
    percentuaisIndiretos: {
      'impressoes': 0.02,
      'plotagens': 0.03,
      'transportes': 0.02,
      'software': 0.04,
      'overhead': 0.15
    }
  };
  
  public static getInstance(): BriefingToOrcamentoService {
    if (!BriefingToOrcamentoService.instance) {
      BriefingToOrcamentoService.instance = new BriefingToOrcamentoService();
    }
    return BriefingToOrcamentoService.instance;
  }
  
  // ===== MÉTODO PRINCIPAL =====
  async analisarBriefingEGerarOrcamento(briefing: any): Promise<OrcamentoRealGerado> {
    try {
      logger.info('🧠 Iniciando análise inteligente do briefing', { briefingId: briefing.id });
      
      // 1. EXTRAIR DADOS TÉCNICOS (funciona com qualquer briefing)
      const dadosTecnicos = await this.extrairDadosTecnicos(briefing);
      
      // 2. CALCULAR HORAS BASEADO NOS DADOS REAIS
      const horasPorProfissional = this.calcularHorasPorProfissional(dadosTecnicos);
      
      // 3. DETERMINAR DISCIPLINAS NECESSÁRIAS
      const disciplinas = this.determinarDisciplinas(dadosTecnicos);
      
      // 4. GERAR CRONOGRAMA REALISTA
      const cronograma = this.gerarCronograma(dadosTecnicos, horasPorProfissional);
      
      // 5. CALCULAR COMPOSIÇÃO FINANCEIRA
      const composicaoFinanceira = this.calcularComposicaoFinanceira(horasPorProfissional, dadosTecnicos);
      
      // 6. ANÁLISE DE RISCOS
      const analiseRiscos = this.analisarRiscos(dadosTecnicos, briefing);
      
      // 7. BENCHMARKING
      const benchmarking = await this.obterBenchmarking(dadosTecnicos);
      
      const orcamentoGerado: OrcamentoRealGerado = {
        id: this.gerarId(),
        briefingId: briefing.id,
        dadosTecnicos,
        horasPorProfissional,
        disciplinas,
        cronograma,
        composicaoFinanceira,
        analiseRiscos,
        benchmarking
      };
      
      logger.info('✅ Orçamento inteligente gerado com sucesso', {
        briefingId: briefing.id,
        valorTotal: composicaoFinanceira.valorTotal,
        prazoTotal: cronograma.prazoTotal
      });
      
      return orcamentoGerado;
      
    } catch (error) {
      logger.error('❌ Erro ao gerar orçamento inteligente:', error);
      throw error;
    }
  }
  
  // ===== EXTRAÇÃO INTELIGENTE DE DADOS =====
  private async extrairDadosTecnicos(briefing: any): Promise<DadosTecnicosExtraidos> {
    const respostas = this.obterRespostas(briefing);
    
    // ANÁLISE INTELIGENTE DE QUALQUER TIPO DE BRIEFING
    const tipologia = this.identificarTipologia(respostas);
    const subtipo = this.identificarSubtipo(respostas, tipologia);
    const areaEstimada = this.extrairArea(respostas);
    const complexidade = this.calcularComplexidade(respostas);
    const localizacao = this.extrairLocalizacao(respostas);
    const padrao = this.identificarPadrao(respostas);
    
    const orcamentoDisponivel = this.extrairOrcamento(respostas);
    const prazoDesejado = this.extrairPrazo(respostas);
    const urgencia = this.identificarUrgencia(respostas);
    
    const numeroQuartos = this.extrairNumeroQuartos(respostas);
    const numeroBanheiros = this.extrairNumeroBanheiros(respostas);
    const numeroVagas = this.extrairNumeroVagas(respostas);
    const numeroAndares = this.extrairNumeroAndares(respostas);
    
    const disciplinasNecessarias = this.identificarDisciplinas(respostas, tipologia);
    const sistemas = this.identificarSistemas(respostas);
    const caracteristicasEspeciais = this.extrairCaracteristicasEspeciais(respostas);
    const indicadoresComplexidade = this.calcularIndicadoresComplexidade(respostas);
    
    return {
      tipologia,
      subtipo,
      areaEstimada,
      complexidade,
      localizacao,
      padrao,
      orcamentoDisponivel,
      prazoDesejado,
      urgencia,
      numeroQuartos,
      numeroBanheiros,
      numeroVagas,
      numeroAndares,
      disciplinasNecessarias,
      sistemas,
      caracteristicasEspeciais,
      indicadoresComplexidade
    };
  }
  
  // ===== OBTER RESPOSTAS (FUNCIONA COM QUALQUER ESTRUTURA) =====
  private obterRespostas(briefing: any): Record<string, any> {
    const respostas: Record<string, any> = {};
    
    // Tentar diferentes estruturas de dados
    if (briefing.metadata?.respostas) {
      Object.assign(respostas, briefing.metadata.respostas);
    }
    
    if (briefing.respostas) {
      Object.assign(respostas, briefing.respostas);
    }
    
    if (briefing.observacoes) {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        if (observacoes.respostas) {
          Object.assign(respostas, observacoes.respostas);
        }
      } catch (error) {
        // Ignorar erros de parsing
      }
    }
    
    // Estrutura personalizada
    if (briefing.estrutura_briefing?.secoes) {
      briefing.estrutura_briefing.secoes.forEach((secao: any) => {
        secao.perguntas?.forEach((pergunta: any) => {
          if (pergunta.resposta) {
            const chave = pergunta.id || pergunta.pergunta_original;
            respostas[chave] = pergunta.resposta;
          }
        });
      });
    }
    
    return respostas;
  }
  
  // ===== IDENTIFICAÇÃO INTELIGENTE DE DADOS =====
  private identificarTipologia(respostas: Record<string, any>): string {
    const palavrasChave = {
      'residencial': ['casa', 'residencial', 'apartamento', 'moradia', 'família'],
      'comercial': ['comercial', 'escritório', 'loja', 'negócio', 'empresa'],
      'industrial': ['industrial', 'fábrica', 'galpão', 'produção', 'indústria'],
      'institucional': ['escola', 'hospital', 'igreja', 'público', 'clínica']
    };
    
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    for (const [tipologia, palavras] of Object.entries(palavrasChave)) {
      if (palavras.some(palavra => textoCompleto.includes(palavra))) {
        return tipologia;
      }
    }
    
    return 'residencial'; // Padrão
  }
  
  private extrairArea(respostas: Record<string, any>): number {
    const chavesArea = ['area', 'areaConstruida', 'areaTotal', 'metragem', 'm2'];
    
    for (const chave of chavesArea) {
      const valor = respostas[chave];
      if (valor) {
        const numeroExtraido = this.extrairNumero(valor);
        if (numeroExtraido > 0) {
          return numeroExtraido;
        }
      }
    }
    
    // Buscar em qualquer resposta que contenha área
    for (const [chave, valor] of Object.entries(respostas)) {
      if (chave.toLowerCase().includes('area') || chave.toLowerCase().includes('m2')) {
        const numeroExtraido = this.extrairNumero(valor);
        if (numeroExtraido > 0) {
          return numeroExtraido;
        }
      }
    }
    
    return 200; // Área padrão
  }
  
  private calcularComplexidade(respostas: Record<string, any>): TipoComplexidade {
    let pontuacao = 0;
    
    // Análise de palavras-chave
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('automação')) pontuacao += 2;
    if (textoCompleto.includes('luxo') || textoCompleto.includes('premium')) pontuacao += 2;
    if (textoCompleto.includes('sustentável') || textoCompleto.includes('certificação')) pontuacao += 2;
    if (textoCompleto.includes('complexo') || textoCompleto.includes('especial')) pontuacao += 2;
    
    // Análise de quantidade de ambientes
    const numeroQuartos = this.extrairNumeroQuartos(respostas);
    if (numeroQuartos > 4) pontuacao += 1;
    if (numeroQuartos > 6) pontuacao += 1;
    
    // Análise de orçamento
    const orcamento = this.extrairOrcamento(respostas);
    if (orcamento > 1000000) pontuacao += 1;
    if (orcamento > 2000000) pontuacao += 2;
    
    if (pontuacao >= 8) return 'muito_alta';
    if (pontuacao >= 6) return 'alta';
    if (pontuacao >= 3) return 'media';
    return 'baixa';
  }
  
  // ===== CÁLCULO DE HORAS POR PROFISSIONAL =====
  private calcularHorasPorProfissional(dados: DadosTecnicosExtraidos): OrcamentoRealGerado['horasPorProfissional'] {
    const chaveHoras = `${dados.tipologia}-${dados.padrao}`;
    const padraoHoras = (this.padroesTecnicos.horasPorM2 as any)[chaveHoras] || this.padroesTecnicos.horasPorM2['residencial-medio'];
    
    const multiplicador = this.padroesTecnicos.multiplicadoresComplexidade[dados.complexidade];
    const multiplicadorUrgencia = (this.padroesTecnicos.multiplicadoresUrgencia as any)[dados.urgencia] || 1.0;
    
    const horasArquiteto = Math.ceil(padraoHoras.arquiteto * dados.areaEstimada * multiplicador * multiplicadorUrgencia);
    const horasEngenheiro = Math.ceil(padraoHoras.engenheiro * dados.areaEstimada * multiplicador);
    const horasDesenhista = Math.ceil(padraoHoras.desenhista * dados.areaEstimada * multiplicador);
    const horasEstagiario = Math.ceil(horasDesenhista * 0.3); // 30% das horas de desenho
    const horasCoordenador = Math.ceil((horasArquiteto + horasEngenheiro) * 0.15); // 15% das horas técnicas
    
    const valorHoraArquiteto = this.padroesTecnicos.valoresHora.arquiteto.pleno;
    const valorHoraEngenheiro = this.padroesTecnicos.valoresHora.engenheiro.pleno;
    const valorHoraDesenhista = this.padroesTecnicos.valoresHora.desenhista.pleno;
    const valorHoraEstagiario = this.padroesTecnicos.valoresHora.estagiario.pleno;
    const valorHoraCoordenador = this.padroesTecnicos.valoresHora.coordenador.pleno;
    
    return {
      arquiteto: {
        horas: horasArquiteto,
        valorHora: valorHoraArquiteto,
        total: horasArquiteto * valorHoraArquiteto
      },
      engenheiro: {
        horas: horasEngenheiro,
        valorHora: valorHoraEngenheiro,
        total: horasEngenheiro * valorHoraEngenheiro
      },
      desenhista: {
        horas: horasDesenhista,
        valorHora: valorHoraDesenhista,
        total: horasDesenhista * valorHoraDesenhista
      },
      estagiario: {
        horas: horasEstagiario,
        valorHora: valorHoraEstagiario,
        total: horasEstagiario * valorHoraEstagiario
      },
      coordenador: {
        horas: horasCoordenador,
        valorHora: valorHoraCoordenador,
        total: horasCoordenador * valorHoraCoordenador
      }
    };
  }
  
  // ===== MÉTODOS AUXILIARES =====
  private extrairNumero(valor: any): number {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const match = valor.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  }
  
  private extrairNumeroQuartos(respostas: Record<string, any>): number {
    const chavesQuartos = ['quartos', 'numeroQuartos', 'num_quartos', 'bedrooms'];
    
    for (const chave of chavesQuartos) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 3; // Padrão
  }
  
  private extrairNumeroBanheiros(respostas: Record<string, any>): number {
    const chavesBanheiros = ['banheiros', 'numeroBanheiros', 'num_banheiros', 'bathrooms'];
    
    for (const chave of chavesBanheiros) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 2; // Padrão
  }
  
  private extrairNumeroVagas(respostas: Record<string, any>): number {
    const chavesVagas = ['vagas', 'numeroVagas', 'num_vagas', 'garagem'];
    
    for (const chave of chavesVagas) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero >= 0) return numero;
      }
    }
    
    return 2; // Padrão
  }
  
  private extrairNumeroAndares(respostas: Record<string, any>): number {
    const chavesAndares = ['andares', 'pavimentos', 'num_andares', 'floors'];
    
    for (const chave of chavesAndares) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 1; // Padrão
  }
  
  private extrairOrcamento(respostas: Record<string, any>): number {
    const chavesOrcamento = ['orcamento', 'investimento', 'valor', 'budget'];
    
    for (const chave of chavesOrcamento) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 1500000; // Padrão
  }
  
  private extrairPrazo(respostas: Record<string, any>): number {
    const chavesPrazo = ['prazo', 'tempo', 'deadline', 'cronograma'];
    
    for (const chave of chavesPrazo) {
      const valor = respostas[chave];
      if (valor) {
        const numero = this.extrairNumero(valor);
        if (numero > 0) return numero;
      }
    }
    
    return 180; // Padrão em dias
  }
  
  private extrairLocalizacao(respostas: Record<string, any>): string {
    const chavesLocalizacao = ['localizacao', 'cidade', 'estado', 'endereco'];
    
    for (const chave of chavesLocalizacao) {
      const valor = respostas[chave];
      if (valor && typeof valor === 'string') {
        return valor;
      }
    }
    
    return 'São Paulo'; // Padrão
  }
  
  private identificarSubtipo(respostas: Record<string, any>, tipologia: string): string {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (tipologia === 'residencial') {
      if (textoCompleto.includes('casa')) return 'casa';
      if (textoCompleto.includes('apartamento')) return 'apartamento';
      if (textoCompleto.includes('condomínio')) return 'condominio';
      return 'casa';
    }
    
    if (tipologia === 'comercial') {
      if (textoCompleto.includes('escritório')) return 'escritorio';
      if (textoCompleto.includes('loja')) return 'loja';
      if (textoCompleto.includes('restaurante')) return 'restaurante';
      return 'escritorio';
    }
    
    return 'padrao';
  }
  
  private identificarPadrao(respostas: Record<string, any>): string {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('luxo') || textoCompleto.includes('premium')) return 'alto';
    if (textoCompleto.includes('simples') || textoCompleto.includes('básico')) return 'simples';
    return 'medio';
  }
  
  private identificarUrgencia(respostas: Record<string, any>): string {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('urgente') || textoCompleto.includes('rápido')) return 'urgente';
    if (textoCompleto.includes('muito urgente') || textoCompleto.includes('imediato')) return 'muito_urgente';
    return 'normal';
  }
  
  private identificarDisciplinas(respostas: Record<string, any>, tipologia: string): string[] {
    const disciplinas = ['arquitetura']; // Sempre obrigatória
    
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('estrutura') || textoCompleto.includes('fundação')) {
      disciplinas.push('estrutural');
    }
    
    if (textoCompleto.includes('hidráulica') || textoCompleto.includes('elétrica') || textoCompleto.includes('instalações')) {
      disciplinas.push('instalacoes');
    }
    
    if (textoCompleto.includes('interiores') || textoCompleto.includes('design')) {
      disciplinas.push('interiores');
    }
    
    if (textoCompleto.includes('paisagismo') || textoCompleto.includes('jardim')) {
      disciplinas.push('paisagismo');
    }
    
    return disciplinas;
  }
  
  private identificarSistemas(respostas: Record<string, any>): DadosTecnicosExtraidos['sistemas'] {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    return {
      estrutural: textoCompleto.includes('estrutura') || textoCompleto.includes('fundação'),
      hidraulico: textoCompleto.includes('hidráulica') || textoCompleto.includes('água'),
      eletrico: textoCompleto.includes('elétrica') || textoCompleto.includes('energia'),
      avac: textoCompleto.includes('ar condicionado') || textoCompleto.includes('climatização'),
      automacao: textoCompleto.includes('automação') || textoCompleto.includes('smart'),
      seguranca: textoCompleto.includes('segurança') || textoCompleto.includes('alarme')
    };
  }
  
  private extrairCaracteristicasEspeciais(respostas: Record<string, any>): string[] {
    const caracteristicas: string[] = [];
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    if (textoCompleto.includes('sustentável')) caracteristicas.push('Sustentabilidade');
    if (textoCompleto.includes('automação')) caracteristicas.push('Automação');
    if (textoCompleto.includes('luxo')) caracteristicas.push('Alto Padrão');
    if (textoCompleto.includes('acessibilidade')) caracteristicas.push('Acessibilidade');
    
    return caracteristicas;
  }
  
  private calcularIndicadoresComplexidade(respostas: Record<string, any>): DadosTecnicosExtraidos['indicadoresComplexidade'] {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();
    
    let arquitetonico = 5;
    let estrutural = 5;
    let instalacoes = 5;
    let acabamentos = 5;
    
    // Ajustar baseado em palavras-chave
    if (textoCompleto.includes('complexo')) arquitetonico += 2;
    if (textoCompleto.includes('especial')) estrutural += 2;
    if (textoCompleto.includes('automação')) instalacoes += 3;
    if (textoCompleto.includes('luxo')) acabamentos += 3;
    
    return {
      arquitetonico: Math.min(arquitetonico, 10),
      estrutural: Math.min(estrutural, 10),
      instalacoes: Math.min(instalacoes, 10),
      acabamentos: Math.min(acabamentos, 10)
    };
  }
  
  private determinarDisciplinas(dados: DadosTecnicosExtraidos) {
    // Implementar lógica para determinar disciplinas necessárias
    return dados.disciplinasNecessarias.map(disciplina => ({
      nome: disciplina,
      horas: 100, // Calcular baseado na disciplina
      valorTotal: 15000, // Calcular baseado nas horas
      profissionaisNecessarios: ['arquiteto'],
      entregaveis: ['Projeto executivo']
    }));
  }
  
  private gerarCronograma(dados: DadosTecnicosExtraidos, horas: OrcamentoRealGerado['horasPorProfissional']) {
    const prazoTotal = Math.ceil(dados.prazoDesejado * 0.8); // 80% do prazo desejado
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + prazoTotal);
    
    const totalHoras = horas.arquiteto.horas + horas.engenheiro.horas + horas.desenhista.horas + horas.estagiario.horas + horas.coordenador.horas;
    const totalValor = horas.arquiteto.total + horas.engenheiro.total + horas.desenhista.total + horas.estagiario.total + horas.coordenador.total;
    
    return {
      etapas: [
        {
          nome: 'Estudo Preliminar',
          duracao: Math.ceil(prazoTotal * 0.2),
          horas: totalHoras * 0.2,
          valor: totalValor * 0.2,
          dependencias: [],
          entregas: ['Plantas conceituais', 'Volumetria 3D']
        },
        {
          nome: 'Anteprojeto',
          duracao: Math.ceil(prazoTotal * 0.3),
          horas: totalHoras * 0.3,
          valor: totalValor * 0.3,
          dependencias: ['Estudo Preliminar'],
          entregas: ['Plantas detalhadas', 'Cortes e fachadas']
        },
        {
          nome: 'Projeto Executivo',
          duracao: Math.ceil(prazoTotal * 0.5),
          horas: totalHoras * 0.5,
          valor: totalValor * 0.5,
          dependencias: ['Anteprojeto'],
          entregas: ['Plantas executivas', 'Detalhamentos', 'Especificações']
        }
      ],
      prazoTotal,
      dataInicio,
      dataFim
    };
  }
  
  private calcularComposicaoFinanceira(horas: OrcamentoRealGerado['horasPorProfissional'], dados: DadosTecnicosExtraidos) {
    const custosHoras = horas.arquiteto.total + horas.engenheiro.total + horas.desenhista.total + horas.estagiario.total + horas.coordenador.total;
    const custosIndiretos = custosHoras * 0.25; // 25% dos custos diretos
    const impostos = (custosHoras + custosIndiretos) * 0.15; // 15%
    const margemLucro = (custosHoras + custosIndiretos + impostos) * 0.20; // 20%
    const valorTotal = custosHoras + custosIndiretos + impostos + margemLucro;
    
    return {
      custosHoras,
      custosIndiretos,
      impostos,
      margemLucro,
      valorTotal,
      valorPorM2: valorTotal / dados.areaEstimada
    };
  }
  
  private analisarRiscos(dados: DadosTecnicosExtraidos, briefing: any) {
    return {
      riscoTecnico: dados.indicadoresComplexidade.arquitetonico > 7 ? 8 : 5,
      riscoPrazo: dados.urgencia === 'urgente' ? 7 : 4,
      riscoFinanceiro: dados.orcamentoDisponivel < 1000000 ? 6 : 3,
      observacoes: ['Projeto dentro da normalidade']
    };
  }
  
  private async obterBenchmarking(dados: DadosTecnicosExtraidos) {
    // Implementar consulta ao histórico de projetos
    return {
      projetosSimilares: 5,
      valorMedio: 850000,
      prazoMedio: 120,
      desvioValor: 15,
      desvioPrazo: 10
    };
  }
  
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// ===== EXPORT =====
export const briefingToOrcamentoService = BriefingToOrcamentoService.getInstance(); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 