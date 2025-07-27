/**
 * BRIEFING ANALYSIS ENGINE - ARCFLOW
 * 
 * Motor inteligente para análise automática de briefings e extração de dados
 * para geração de orçamentos. Funciona com briefings padrão e personalizados.
 * 
 * Características:
 * - Análise semântica de respostas
 * - Extração automática de área, tipologia e complexidade
 * - Identificação de disciplinas necessárias
 * - Sistema de scoring para complexidade
 * - Compatível com qualquer estrutura de briefing
 */

export interface DadosExtraidos {
  // Dados básicos
  areaConstruida?: number;
  areaTerreno?: number;
  tipologia: string;
  subtipo?: string;
  padrao: 'SIMPLES' | 'MEDIO' | 'ALTO' | 'LUXO' | 'PREMIUM';
  complexidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA';
  
  // Localização
  localizacao?: string;
  regiao?: string;
  
  // Disciplinas identificadas
  disciplinasNecessarias: string[];
  disciplinasOpcionais: string[];
  
  // Características especiais
  caracteristicasEspeciais: string[];
  sistemasEspeciais: string[];
  
  // Dados financeiros
  orcamentoDisponivel?: number;
  prazoDesejado?: number;
  urgencia?: 'BAIXA' | 'MEDIA' | 'ALTA';
  
  // Indicadores de complexidade
  indicadoresComplexidade: {
    arquitetonico: number;
    estrutural: number;
    instalacoes: number;
    acabamentos: number;
    sustentabilidade: number;
    tecnologia: number;
  };
  
  // Metadados
  confiancaAnalise: number; // 0-1
  camposIdentificados: string[];
  camposFaltantes: string[];
  sugestoes: string[];
}

export interface CamposRelevantes {
  area: string[];
  tipologia: string[];
  complexidade: string[];
  disciplinas: string[];
  localizacao: string[];
  orcamento: string[];
  prazo: string[];
}

export interface ConfiguracaoAnalise {
  incluirDisciplinasOpcionais: boolean;
  nivelDetalheAnalise: 'BASICO' | 'COMPLETO' | 'AVANCADO';
  usarInferencia: boolean;
  scoreMinimo: number;
}

export class BriefingAnalysisEngine {
  private readonly configuracao: ConfiguracaoAnalise;
  
  // Padrões para identificação de dados
  private readonly padroesArea = {
    construida: [
      /(\d+(?:\.\d+)?)\s*m[²2]?\s*(?:construída|construidos|de\s*construção)/i,
      /área\s*(?:construída|de\s*construção)[\s:]*(\d+(?:\.\d+)?)/i,
      /construir\s*(\d+(?:\.\d+)?)\s*m[²2]/i,
      /(\d+(?:\.\d+)?)\s*metros\s*quadrados\s*construídos/i
    ],
    terreno: [
      /terreno\s*(?:de|com)?\s*(\d+(?:\.\d+)?)\s*m[²2]/i,
      /(\d+(?:\.\d+)?)\s*m[²2]?\s*(?:de\s*)?terreno/i,
      /lote\s*(?:de|com)?\s*(\d+(?:\.\d+)?)\s*m[²2]/i
    ]
  };
  
  private readonly padroesTipologia = {
    residencial: {
      unifamiliar: ['casa', 'residência', 'unifamiliar', 'sobrado'],
      multifamiliar: ['apartamento', 'condomínio', 'edifício', 'prédio'],
      especial: ['mansão', 'casa de praia', 'casa de campo', 'chácara']
    },
    comercial: {
      escritorio: ['escritório', 'office', 'corporativo', 'sala comercial'],
      loja: ['loja', 'varejo', 'comércio', 'estabelecimento'],
      hotel: ['hotel', 'pousada', 'resort', 'hospedagem'],
      restaurante: ['restaurante', 'bar', 'lanchonete', 'food']
    },
    industrial: {
      fabrica: ['fábrica', 'indústria', 'industrial', 'produção'],
      galpao: ['galpão', 'depósito', 'armazém', 'estoque'],
      logistico: ['logística', 'distribuição', 'centro de distribuição']
    },
    institucional: {
      escola: ['escola', 'colégio', 'universidade', 'educacional'],
      hospital: ['hospital', 'clínica', 'posto de saúde', 'médico'],
      templo: ['igreja', 'templo', 'capela', 'religioso']
    }
  };
  
  private readonly padroesComplexidade = {
    palavrasAlta: [
      'luxo', 'premium', 'sofisticado', 'exclusivo', 'personalizado',
      'automação', 'inteligente', 'sustentável', 'certificação',
      'importado', 'especial', 'único', 'diferenciado'
    ],
    palavrasMedia: [
      'padrão', 'qualidade', 'bom', 'adequado', 'funcional',
      'moderno', 'contemporâneo', 'atual'
    ],
    palavrasBaixa: [
      'simples', 'básico', 'econômico', 'popular', 'acessível',
      'mínimo', 'essencial'
    ]
  };
  
  constructor(configuracao: Partial<ConfiguracaoAnalise> = {}) {
    this.configuracao = {
      incluirDisciplinasOpcionais: true,
      nivelDetalheAnalise: 'COMPLETO',
      usarInferencia: true,
      scoreMinimo: 0.6,
      ...configuracao
    };
  }
  
  /**
   * Analisa um briefing completo e extrai dados relevantes
   */
  async analisarBriefing(briefing: any): Promise<DadosExtraidos> {
    console.log('🔍 Iniciando análise do briefing:', briefing.id);
    
    try {
      // 1. Preparar dados para análise
      const dadosTexto = this.prepararDadosTexto(briefing);
      
      // 2. Extrair dados básicos
      const areaConstruida = this.extrairAreaConstruida(dadosTexto);
      const areaTerreno = this.extrairAreaTerreno(dadosTexto);
      const tipologia = this.identificarTipologia(dadosTexto);
      const localizacao = this.extrairLocalizacao(dadosTexto);
      
      // 3. Calcular complexidade
      const indicadoresComplexidade = this.calcularIndicadoresComplexidade(dadosTexto);
      const complexidade = this.determinarComplexidade(indicadoresComplexidade);
      const padrao = this.determinarPadrao(dadosTexto, complexidade);
      
      // 4. Identificar disciplinas
      const disciplinasNecessarias = this.identificarDisciplinasNecessarias(dadosTexto, tipologia);
      const disciplinasOpcionais = this.identificarDisciplinasOpcionais(dadosTexto);
      
      // 5. Extrair características especiais
      const caracteristicasEspeciais = this.identificarCaracteristicasEspeciais(dadosTexto);
      const sistemasEspeciais = this.identificarSistemasEspeciais(dadosTexto);
      
      // 6. Dados financeiros e prazo
      const orcamentoDisponivel = this.extrairOrcamento(dadosTexto);
      const prazoDesejado = this.extrairPrazo(dadosTexto);
      const urgencia = this.determinarUrgencia(dadosTexto);
      
      // 7. Calcular confiança da análise
      const confiancaAnalise = this.calcularConfiancaAnalise({
        areaConstruida,
        tipologia,
        complexidade,
        disciplinasNecessarias
      });
      
      // 8. Identificar campos e sugestões
      const camposIdentificados = this.identificarCamposEncontrados(dadosTexto);
      const camposFaltantes = this.identificarCamposFaltantes(camposIdentificados);
      const sugestoes = this.gerarSugestoes(camposFaltantes, tipologia);
      
      const resultado: DadosExtraidos = {
        areaConstruida,
        areaTerreno,
        tipologia: tipologia.principal,
        subtipo: tipologia.subtipo,
        padrao,
        complexidade,
        localizacao,
        disciplinasNecessarias,
        disciplinasOpcionais,
        caracteristicasEspeciais,
        sistemasEspeciais,
        orcamentoDisponivel,
        prazoDesejado,
        urgencia,
        indicadoresComplexidade,
        confiancaAnalise,
        camposIdentificados,
        camposFaltantes,
        sugestoes
      };
      
      console.log('✅ Análise concluída com sucesso');
      console.log('📊 Confiança da análise:', (confiancaAnalise * 100).toFixed(1) + '%');
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Erro na análise do briefing:', error);
      throw new Error(`Falha na análise do briefing: ${error.message}`);
    }
  }
  
  /**
   * Identifica campos relevantes em briefings personalizados
   */
  identificarCamposRelevantes(briefingPersonalizado: any): CamposRelevantes {
    const campos = this.extrairCamposTexto(briefingPersonalizado);
    
    return {
      area: this.filtrarCamposPorTipo(campos, 'area'),
      tipologia: this.filtrarCamposPorTipo(campos, 'tipologia'),
      complexidade: this.filtrarCamposPorTipo(campos, 'complexidade'),
      disciplinas: this.filtrarCamposPorTipo(campos, 'disciplinas'),
      localizacao: this.filtrarCamposPorTipo(campos, 'localizacao'),
      orcamento: this.filtrarCamposPorTipo(campos, 'orcamento'),
      prazo: this.filtrarCamposPorTipo(campos, 'prazo')
    };
  }
  
  /**
   * Calcula score de complexidade baseado em múltiplos fatores
   */
  calcularComplexidade(dados: Partial<DadosExtraidos>): 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA' {
    let score = 0;
    
    // Área (peso: 20%)
    if (dados.areaConstruida) {
      if (dados.areaConstruida > 1000) score += 0.8;
      else if (dados.areaConstruida > 500) score += 0.6;
      else if (dados.areaConstruida > 200) score += 0.4;
      else score += 0.2;
    }
    
    // Tipologia (peso: 25%)
    const tipologiaScore = this.calcularScoreTipologia(dados.tipologia || '');
    score += tipologiaScore * 0.25;
    
    // Disciplinas (peso: 30%)
    const disciplinasScore = (dados.disciplinasNecessarias?.length || 0) / 8;
    score += Math.min(disciplinasScore, 1) * 0.3;
    
    // Características especiais (peso: 25%)
    const especialScore = (dados.caracteristicasEspeciais?.length || 0) / 10;
    score += Math.min(especialScore, 1) * 0.25;
    
    // Determinar complexidade
    if (score >= 0.8) return 'MUITO_ALTA';
    if (score >= 0.6) return 'ALTA';
    if (score >= 0.4) return 'MEDIA';
    return 'BAIXA';
  }
  
  // ===== MÉTODOS PRIVADOS =====
  
  private prepararDadosTexto(briefing: any): string {
    let texto = '';
    
    // Extrair texto de diferentes estruturas
    if (briefing.respostas) {
      briefing.respostas.forEach((resposta: any) => {
        texto += ` ${resposta.resposta || ''}`;
      });
    }
    
    if (briefing.estruturaBriefing) {
      texto += ` ${JSON.stringify(briefing.estruturaBriefing)}`;
    }
    
    // Adicionar campos básicos
    texto += ` ${briefing.nomeProjeto || ''}`;
    texto += ` ${briefing.descricao || ''}`;
    texto += ` ${briefing.objetivos || ''}`;
    texto += ` ${briefing.orcamento || ''}`;
    
    return texto.toLowerCase();
  }
  
  private extrairAreaConstruida(texto: string): number | undefined {
    for (const padrao of this.padroesArea.construida) {
      const match = texto.match(padrao);
      if (match) {
        const area = parseFloat(match[1]);
        if (area > 0 && area < 100000) { // Validação básica
          return area;
        }
      }
    }
    return undefined;
  }
  
  private extrairAreaTerreno(texto: string): number | undefined {
    for (const padrao of this.padroesArea.terreno) {
      const match = texto.match(padrao);
      if (match) {
        const area = parseFloat(match[1]);
        if (area > 0 && area < 1000000) { // Validação básica
          return area;
        }
      }
    }
    return undefined;
  }
  
  private identificarTipologia(texto: string): { principal: string; subtipo?: string } {
    let melhorMatch = { principal: 'RESIDENCIAL', subtipo: 'unifamiliar', score: 0 };
    
    for (const [categoria, subtipos] of Object.entries(this.padroesTipologia)) {
      for (const [subtipo, palavras] of Object.entries(subtipos)) {
        let score = 0;
        for (const palavra of palavras) {
          if (texto.includes(palavra.toLowerCase())) {
            score += 1;
          }
        }
        
        if (score > melhorMatch.score) {
          melhorMatch = {
            principal: categoria.toUpperCase(),
            subtipo,
            score
          };
        }
      }
    }
    
    return {
      principal: melhorMatch.principal,
      subtipo: melhorMatch.subtipo
    };
  }
  
  private calcularIndicadoresComplexidade(texto: string) {
    const indicadores = {
      arquitetonico: 0,
      estrutural: 0,
      instalacoes: 0,
      acabamentos: 0,
      sustentabilidade: 0,
      tecnologia: 0
    };
    
    // Palavras-chave por categoria
    const palavrasChave = {
      arquitetonico: ['design', 'forma', 'estética', 'visual', 'conceito'],
      estrutural: ['estrutura', 'fundação', 'laje', 'viga', 'pilar'],
      instalacoes: ['elétrica', 'hidráulica', 'ar condicionado', 'instalação'],
      acabamentos: ['acabamento', 'revestimento', 'piso', 'teto', 'parede'],
      sustentabilidade: ['sustentável', 'verde', 'ecológico', 'leed', 'energia'],
      tecnologia: ['automação', 'inteligente', 'digital', 'tecnologia', 'smart']
    };
    
    for (const [categoria, palavras] of Object.entries(palavrasChave)) {
      let score = 0;
      for (const palavra of palavras) {
        if (texto.includes(palavra)) score += 0.2;
      }
      indicadores[categoria as keyof typeof indicadores] = Math.min(score, 1);
    }
    
    return indicadores;
  }
  
  private determinarComplexidade(indicadores: any): 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA' {
    const media = Object.values(indicadores).reduce((a: number, b: number) => a + b, 0) / 6;
    
    if (media >= 0.8) return 'MUITO_ALTA';
    if (media >= 0.6) return 'ALTA';
    if (media >= 0.4) return 'MEDIA';
    return 'BAIXA';
  }
  
  private determinarPadrao(texto: string, complexidade: string): 'SIMPLES' | 'MEDIO' | 'ALTO' | 'LUXO' | 'PREMIUM' {
    // Verificar palavras indicativas de padrão
    if (this.padroesComplexidade.palavrasAlta.some(p => texto.includes(p))) {
      return complexidade === 'MUITO_ALTA' ? 'PREMIUM' : 'LUXO';
    }
    
    if (this.padroesComplexidade.palavrasBaixa.some(p => texto.includes(p))) {
      return 'SIMPLES';
    }
    
    // Baseado na complexidade
    switch (complexidade) {
      case 'MUITO_ALTA': return 'LUXO';
      case 'ALTA': return 'ALTO';
      case 'MEDIA': return 'MEDIO';
      default: return 'SIMPLES';
    }
  }
  
  private identificarDisciplinasNecessarias(texto: string, tipologia: any): string[] {
    const disciplinas = ['ARQUITETURA']; // Sempre necessária
    
    // Disciplinas por tipologia
    const disciplinasPorTipologia = {
      'RESIDENCIAL': ['ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'COMERCIAL': ['ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC'],
      'INDUSTRIAL': ['ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'INSTALACOES_ESPECIAIS'],
      'INSTITUCIONAL': ['ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC', 'SEGURANCA']
    };
    
    const disciplinasTipologia = disciplinasPorTipologia[tipologia.principal] || [];
    disciplinas.push(...disciplinasTipologia);
    
    // Disciplinas por palavras-chave
    const palavrasChaveDisciplinas = {
      'PAISAGISMO': ['jardim', 'paisagismo', 'verde', 'plantas'],
      'DESIGN_INTERIORES': ['interiores', 'decoração', 'mobiliário', 'ambientação'],
      'LUMINOTECNICA': ['iluminação', 'luz', 'luminotécnica'],
      'ACUSTICA': ['acústica', 'som', 'ruído', 'isolamento acústico'],
      'AUTOMACAO': ['automação', 'inteligente', 'smart', 'domótica']
    };
    
    for (const [disciplina, palavras] of Object.entries(palavrasChaveDisciplinas)) {
      if (palavras.some(p => texto.includes(p))) {
        disciplinas.push(disciplina);
      }
    }
    
    return [...new Set(disciplinas)]; // Remove duplicatas
  }
  
  private identificarDisciplinasOpcionais(texto: string): string[] {
    const opcionais = [];
    
    const disciplinasOpcionais = {
      'CONSULTORIA_SUSTENTABILIDADE': ['sustentável', 'leed', 'verde'],
      'CONSULTORIA_ACESSIBILIDADE': ['acessibilidade', 'pcd', 'rampa'],
      'CONSULTORIA_SEGURANCA': ['segurança', 'cftv', 'alarme'],
      'CONSULTORIA_INCENDIO': ['incêndio', 'bombeiros', 'sprinkler']
    };
    
    for (const [disciplina, palavras] of Object.entries(disciplinasOpcionais)) {
      if (palavras.some(p => texto.includes(p))) {
        opcionais.push(disciplina);
      }
    }
    
    return opcionais;
  }
  
  private identificarCaracteristicasEspeciais(texto: string): string[] {
    const caracteristicas = [];
    
    const palavrasEspeciais = {
      'Piscina': ['piscina'],
      'Elevador': ['elevador'],
      'Garagem Subterrânea': ['garagem subterrânea', 'subsolo'],
      'Cobertura Verde': ['cobertura verde', 'teto verde'],
      'Sistema Solar': ['solar', 'fotovoltaica'],
      'Automação Residencial': ['automação', 'casa inteligente'],
      'Home Theater': ['home theater', 'cinema'],
      'Adega': ['adega', 'vinho'],
      'SPA': ['spa', 'sauna'],
      'Academia': ['academia', 'fitness']
    };
    
    for (const [caracteristica, palavras] of Object.entries(palavrasEspeciais)) {
      if (palavras.some(p => texto.includes(p))) {
        caracteristicas.push(caracteristica);
      }
    }
    
    return caracteristicas;
  }
  
  private identificarSistemasEspeciais(texto: string): string[] {
    const sistemas = [];
    
    const sistemasPalavras = {
      'Ar Condicionado Central': ['ar condicionado central', 'vrf'],
      'Aquecimento Solar': ['aquecimento solar'],
      'Sistema de Segurança': ['alarme', 'cftv', 'segurança'],
      'Automação Predial': ['automação predial', 'bms'],
      'Sistema de Som': ['som ambiente', 'audio'],
      'Rede Estruturada': ['rede estruturada', 'cabeamento']
    };
    
    for (const [sistema, palavras] of Object.entries(sistemasPalavras)) {
      if (palavras.some(p => texto.includes(p))) {
        sistemas.push(sistema);
      }
    }
    
    return sistemas;
  }
  
  private extrairLocalizacao(texto: string): string | undefined {
    // Padrões para identificar localização
    const padroes = [
      /(?:em|na|no)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /cidade\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /localização\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
    ];
    
    for (const padrao of padroes) {
      const match = texto.match(padrao);
      if (match) {
        return match[1];
      }
    }
    
    return undefined;
  }
  
  private extrairOrcamento(texto: string): number | undefined {
    const padroes = [
      /(?:orçamento|budget|valor)\s*:?\s*r?\$?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i,
      /(\d+(?:\.\d{3})*(?:,\d{2})?)\s*(?:reais|mil|milhão)/i
    ];
    
    for (const padrao of padroes) {
      const match = texto.match(padrao);
      if (match) {
        const valor = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
        if (valor > 0) return valor;
      }
    }
    
    return undefined;
  }
  
  private extrairPrazo(texto: string): number | undefined {
    const padroes = [
      /(?:prazo|tempo)\s*:?\s*(\d+)\s*(?:meses|mês)/i,
      /(\d+)\s*(?:meses|mês)\s*(?:de\s*)?(?:prazo|tempo)/i
    ];
    
    for (const padrao of padroes) {
      const match = texto.match(padrao);
      if (match) {
        const prazo = parseInt(match[1]);
        if (prazo > 0 && prazo <= 60) return prazo;
      }
    }
    
    return undefined;
  }
  
  private determinarUrgencia(texto: string): 'BAIXA' | 'MEDIA' | 'ALTA' | undefined {
    if (/urgente|rápido|pressa|imediato/i.test(texto)) return 'ALTA';
    if (/normal|padrão|tranquilo/i.test(texto)) return 'MEDIA';
    if (/sem pressa|flexível/i.test(texto)) return 'BAIXA';
    return undefined;
  }
  
  private calcularConfiancaAnalise(dados: any): number {
    let score = 0;
    let total = 0;
    
    // Área identificada (+25%)
    if (dados.areaConstruida) score += 0.25;
    total += 0.25;
    
    // Tipologia identificada (+25%)
    if (dados.tipologia) score += 0.25;
    total += 0.25;
    
    // Complexidade calculada (+20%)
    if (dados.complexidade) score += 0.20;
    total += 0.20;
    
    // Disciplinas identificadas (+30%)
    if (dados.disciplinasNecessarias?.length > 0) {
      score += Math.min(dados.disciplinasNecessarias.length / 5, 1) * 0.30;
    }
    total += 0.30;
    
    return total > 0 ? score / total : 0;
  }
  
  private identificarCamposEncontrados(texto: string): string[] {
    const campos = [];
    
    if (this.extrairAreaConstruida(texto)) campos.push('area_construida');
    if (this.extrairAreaTerreno(texto)) campos.push('area_terreno');
    if (this.identificarTipologia(texto)) campos.push('tipologia');
    if (this.extrairLocalizacao(texto)) campos.push('localizacao');
    if (this.extrairOrcamento(texto)) campos.push('orcamento');
    if (this.extrairPrazo(texto)) campos.push('prazo');
    
    return campos;
  }
  
  private identificarCamposFaltantes(camposEncontrados: string[]): string[] {
    const camposEssenciais = ['area_construida', 'tipologia', 'localizacao'];
    return camposEssenciais.filter(campo => !camposEncontrados.includes(campo));
  }
  
  private gerarSugestoes(camposFaltantes: string[], tipologia: string): string[] {
    const sugestoes = [];
    
    if (camposFaltantes.includes('area_construida')) {
      sugestoes.push('Considere informar a área construída para um orçamento mais preciso');
    }
    
    if (camposFaltantes.includes('localizacao')) {
      sugestoes.push('A localização do projeto ajuda a aplicar multiplicadores regionais');
    }
    
    if (tipologia === 'RESIDENCIAL') {
      sugestoes.push('Para projetos residenciais, considere informar número de quartos e banheiros');
    }
    
    return sugestoes;
  }
  
  private calcularScoreTipologia(tipologia: string): number {
    const scores = {
      'RESIDENCIAL': 0.3,
      'COMERCIAL': 0.5,
      'INDUSTRIAL': 0.7,
      'INSTITUCIONAL': 0.6
    };
    
    return scores[tipologia as keyof typeof scores] || 0.3;
  }
  
  private extrairCamposTexto(briefing: any): string[] {
    // Implementação para extrair campos de briefings personalizados
    const campos = [];
    
    if (briefing.perguntas) {
      briefing.perguntas.forEach((pergunta: any) => {
        campos.push(pergunta.titulo || pergunta.texto || '');
      });
    }
    
    return campos;
  }
  
  private filtrarCamposPorTipo(campos: string[], tipo: string): string[] {
    const palavrasChave = {
      area: ['área', 'tamanho', 'metros', 'm²', 'dimensão'],
      tipologia: ['tipo', 'categoria', 'uso', 'finalidade'],
      complexidade: ['padrão', 'qualidade', 'nível', 'categoria'],
      disciplinas: ['disciplina', 'especialidade', 'área técnica'],
      localizacao: ['local', 'cidade', 'endereço', 'região'],
      orcamento: ['orçamento', 'valor', 'custo', 'preço'],
      prazo: ['prazo', 'tempo', 'cronograma', 'entrega']
    };
    
    const palavras = palavrasChave[tipo as keyof typeof palavrasChave] || [];
    
    return campos.filter(campo => 
      palavras.some(palavra => 
        campo.toLowerCase().includes(palavra.toLowerCase())
      )
    );
  }
}