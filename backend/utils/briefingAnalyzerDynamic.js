/**
 * 🧠 ANALISADOR DINÂMICO DE BRIEFINGS V3.0
 * 
 * Sistema completamente dinâmico que funciona com qualquer estrutura
 * de briefing, usando mapeamento semântico em vez de posições fixas
 */

const BriefingSemanticMapper = require('./briefingSemanticMapper');

class BriefingAnalyzerDynamic {
  constructor() {
    this.semanticMapper = new BriefingSemanticMapper();
    
    // Padrões para análise semântica (mantidos para fallbacks)
    this.tipologiaPatterns = {
      'RESIDENCIAL': [
        'residencial', 'casa', 'apartamento', 'residência', 'moradia',
        'unifamiliar', 'multifamiliar', 'condomínio', 'sobrado',
        'piscina', 'churrasqueira', 'home theater', 'suíte'
      ],
      'COMERCIAL': [
        'comercial', 'loja', 'escritório', 'consultório', 'clínica',
        'restaurante', 'bar', 'hotel', 'pousada', 'salão',
        'coworking', 'franquia', 'varejo', 'atendimento'
      ],
      'INDUSTRIAL': [
        'industrial', 'galpão', 'fábrica', 'indústria', 'armazém',
        'depósito', 'logística', 'produção', 'manufatura'
      ],
      'INSTITUCIONAL': [
        'escola', 'hospital', 'igreja', 'creche', 'universidade',
        'biblioteca', 'museu', 'teatro', 'auditório', 'público'
      ]
    };

    this.padraoPatterns = {
      'ALTO': [
        'alto padrão', 'luxo', 'premium', 'sofisticado', 'requintado',
        'exclusivo', 'diferenciado', 'high-end', 'automação',
        'domótica', 'mármore', 'granito', 'madeira nobre'
      ],
      'MEDIO': [
        'médio padrão', 'padrão', 'intermediário', 'bom acabamento',
        'qualidade', 'confortável', 'funcional'
      ],
      'SIMPLES': [
        'simples', 'básico', 'econômico', 'popular', 'essencial',
        'mínimo', 'funcional', 'sem luxo'
      ]
    };

    this.disciplinaPatterns = {
      'ARQUITETURA': ['arquitetônico', 'arquitetura', 'projeto arquitetônico', 'layout', 'planta'],
      'ESTRUTURAL': ['estrutural', 'estrutura', 'fundação', 'laje', 'viga', 'pilar'],
      'INSTALACOES_HIDRAULICAS': ['hidráulica', 'água', 'esgoto', 'tubulação', 'encanamento'],
      'INSTALACOES_ELETRICAS': ['elétrica', 'energia', 'iluminação', 'tomadas', 'quadro elétrico'],
      'CLIMATIZACAO': ['ar condicionado', 'climatização', 'ventilação', 'exaustão'],
      'PAISAGISMO': ['paisagismo', 'jardim', 'área verde', 'plantas', 'vegetação'],
      'INTERIORES': ['interiores', 'decoração', 'mobiliário', 'design de interiores'],
      'APROVACAO_LEGAL': ['aprovação', 'prefeitura', 'bombeiros', 'legal', 'licença'],
      'MODELAGEM_3D': ['3d', 'maquete', 'renderização', 'visualização']
    };
  }

  /**
   * 🎯 Método principal para extrair dados estruturados dinamicamente
   */
  async extrairDadosEstruturados(briefing) {
    console.log('🧠 [ANALYZER-DYNAMIC] Iniciando análise dinâmica do briefing:', briefing.id);
    
    try {
      // 1. Extrair respostas do briefing
      const respostas = this.extrairRespostas(briefing);
      console.log('📋 [ANALYZER-DYNAMIC] Total de respostas encontradas:', Object.keys(respostas).length);
      
      // 2. Usar mapeamento semântico para identificar campos
      const mapeamentoSemantico = this.semanticMapper.mapearCampos(respostas);
      console.log('🎯 [ANALYZER-DYNAMIC] Campos mapeados semanticamente:', mapeamentoSemantico.totalCamposEncontrados);
      
      // 3. Analisar dados básicos do briefing
      const dadosBasicos = this.analisarDadosBasicos(briefing);
      
      // 4. Combinar dados mapeados com análise semântica
      const dadosExtraidos = {
        // Dados básicos do briefing
        ...dadosBasicos,
        
        // Dados extraídos dinamicamente
        areaAtuacao: this.extrairAreaAtuacaoDinamica(mapeamentoSemantico, respostas, briefing),
        tipologia: this.identificarTipologiaDinamica(mapeamentoSemantico, respostas, briefing),
        areaConstruida: this.extrairAreaConstruidaDinamica(mapeamentoSemantico, respostas),
        areaTerreno: this.extrairAreaTerrenoDinamica(mapeamentoSemantico, respostas),
        localizacao: this.extrairLocalizacaoDinamica(mapeamentoSemantico, respostas),
        padrao: this.identificarPadraoDinamico(mapeamentoSemantico, respostas),
        complexidade: this.calcularComplexidadeDinamica(mapeamentoSemantico, respostas),
        disciplinasNecessarias: this.identificarDisciplinasDinamicas(mapeamentoSemantico, respostas, briefing),
        caracteristicasEspeciais: mapeamentoSemantico.campos.caracteristicas_especiais || [],
        prazoEstimado: this.estimarPrazoDinamico(mapeamentoSemantico, respostas),
        orcamentoOriginal: this.extrairOrcamentoDinamico(mapeamentoSemantico, respostas),
        
        // Metadados da análise dinâmica
        confiancaMapeamento: mapeamentoSemantico.confianca,
        totalCamposMapeados: mapeamentoSemantico.totalCamposEncontrados,
        confianca: this.calcularConfiancaDinamica(mapeamentoSemantico, respostas),
        fonteDados: 'briefing_dinamico_v3',
        timestampAnalise: new Date().toISOString(),
        versaoAnalyzer: '3.0.0-dynamic'
      };
      
      console.log('✅ [ANALYZER-DYNAMIC] Dados extraídos dinamicamente:', {
        tipologia: dadosExtraidos.tipologia,
        areaConstruida: dadosExtraidos.areaConstruida,
        areaTerreno: dadosExtraidos.areaTerreno,
        localizacao: dadosExtraidos.localizacao,
        padrao: dadosExtraidos.padrao,
        disciplinas: dadosExtraidos.disciplinasNecessarias.length,
        confianca: dadosExtraidos.confianca
      });
      
      return dadosExtraidos;
      
    } catch (error) {
      console.error('❌ [ANALYZER-DYNAMIC] Erro na análise dinâmica:', error);
      throw new Error(`Erro na análise dinâmica do briefing: ${error.message}`);
    }
  }

  /**
   * 📋 Extrair respostas do briefing (mantido igual)
   */
  extrairRespostas(briefing) {
    let respostas = {};
    
    // Tentar extrair das observações
    if (briefing.observacoes) {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        if (observacoes.respostas) {
          respostas = { ...respostas, ...observacoes.respostas };
        }
        if (observacoes.estruturaPersonalizada?.respostas) {
          respostas = { ...respostas, ...observacoes.estruturaPersonalizada.respostas };
        }
      } catch (error) {
        console.warn('⚠️ [ANALYZER-DYNAMIC] Erro ao parsear observações:', error.message);
      }
    }
    
    // Tentar extrair dos dados_extraidos
    if (briefing.dados_extraidos) {
      try {
        const dadosExtraidos = JSON.parse(briefing.dados_extraidos);
        if (dadosExtraidos.respostas) {
          respostas = { ...respostas, ...dadosExtraidos.respostas };
        }
      } catch (error) {
        console.warn('⚠️ [ANALYZER-DYNAMIC] Erro ao parsear dados_extraidos:', error.message);
      }
    }
    
    // Tentar extrair da metadata
    if (briefing.metadata) {
      try {
        const metadata = JSON.parse(briefing.metadata);
        if (metadata.respostas) {
          respostas = { ...respostas, ...metadata.respostas };
        }
      } catch (error) {
        console.warn('⚠️ [ANALYZER-DYNAMIC] Erro ao parsear metadata:', error.message);
      }
    }
    
    return respostas;
  }

  /**
   * 📊 Analisar dados básicos do briefing (mantido igual)
   */
  analisarDadosBasicos(briefing) {
    return {
      briefingId: briefing.id,
      nomeProjeto: briefing.nome_projeto,
      clienteId: briefing.cliente_id,
      clienteNome: briefing.cliente_nome,
      responsavelId: briefing.responsavel_id,
      responsavelNome: briefing.responsavel_nome,
      escritorioId: briefing.escritorio_id,
      disciplinaPrincipal: briefing.disciplina,
      tipologiaOriginal: briefing.tipologia,
      areaOriginal: briefing.area,
      descricao: briefing.descricao,
      objetivos: briefing.objetivos,
      prazoOriginal: briefing.prazo,
      orcamentoOriginal: briefing.orcamento
    };
  }

  /**
   * 🏢 Extrair área de atuação dinamicamente
   */
  extrairAreaAtuacaoDinamica(mapeamentoSemantico, respostas, briefing) {
    console.log('🏢 [ANALYZER-DYNAMIC] Extraindo área de atuação dinamicamente...');
    
    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.area_atuacao) {
      console.log('🏢 [ANALYZER-DYNAMIC] Área de atuação encontrada via mapeamento semântico:', mapeamentoSemantico.campos.area_atuacao);
      return mapeamentoSemantico.campos.area_atuacao.toUpperCase();
    }

    // 2. Verificar campo 'area' do briefing
    if (briefing.area && typeof briefing.area === 'string') {
      const areaLower = briefing.area.toLowerCase();
      const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
      
      for (const tipo of tiposAtuacao) {
        if (areaLower.includes(tipo)) {
          console.log('🏢 [ANALYZER-DYNAMIC] Área de atuação encontrada no campo area do briefing:', tipo.toUpperCase());
          return tipo.toUpperCase();
        }
      }
    }

    // 3. Análise semântica em todas as respostas
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
    
    for (const tipo of tiposAtuacao) {
      if (textoCompleto.includes(tipo)) {
        console.log('🏢 [ANALYZER-DYNAMIC] Área de atuação encontrada por análise semântica:', tipo.toUpperCase());
        return tipo.toUpperCase();
      }
    }

    // 4. Fallback: inferir da tipologia
    if (briefing.tipologia) {
      const tipologiaLower = briefing.tipologia.toLowerCase();
      if (tipologiaLower.includes('unifamiliar') || tipologiaLower.includes('casa') || tipologiaLower.includes('apartamento')) {
        console.log('🏢 [ANALYZER-DYNAMIC] Área de atuação inferida da tipologia: RESIDENCIAL');
        return 'RESIDENCIAL';
      }
    }

    return 'RESIDENCIAL'; // Padrão mais comum
  }

  /**
   * 🏠 Identificar tipologia dinamicamente
   */
  identificarTipologiaDinamica(mapeamentoSemantico, respostas, briefing) {
    console.log('🏠 [ANALYZER-DYNAMIC] Identificando tipologia dinamicamente...');

    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.tipologia) {
      console.log('🏠 [ANALYZER-DYNAMIC] Tipologia encontrada via mapeamento semântico:', mapeamentoSemantico.campos.tipologia);
      return mapeamentoSemantico.campos.tipologia.toUpperCase();
    }

    // 2. Verificar tipologia já definida no briefing
    if (briefing.tipologia && briefing.tipologia !== 'null') {
      console.log('🏠 [ANALYZER-DYNAMIC] Tipologia do briefing:', briefing.tipologia);
      return briefing.tipologia.toUpperCase();
    }
    
    // 3. Análise por padrões semânticos
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    let pontuacoes = {};
    
    Object.entries(this.tipologiaPatterns).forEach(([tipo, patterns]) => {
      pontuacoes[tipo] = 0;
      patterns.forEach(pattern => {
        const matches = (textoCompleto.match(new RegExp(pattern, 'gi')) || []).length;
        pontuacoes[tipo] += matches;
      });
    });
    
    const tipologiaIdentificada = Object.entries(pontuacoes)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    console.log('🏠 [ANALYZER-DYNAMIC] Pontuações de tipologia:', pontuacoes);
    console.log('🏠 [ANALYZER-DYNAMIC] Tipologia identificada:', tipologiaIdentificada);
    
    return tipologiaIdentificada;
  }

  /**
   * 📐 Extrair área construída dinamicamente
   */
  extrairAreaConstruidaDinamica(mapeamentoSemantico, respostas) {
    console.log('📐 [ANALYZER-DYNAMIC] Extraindo área construída dinamicamente...');
    
    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.area_construida) {
      console.log('📐 [ANALYZER-DYNAMIC] Área construída encontrada via mapeamento semântico:', mapeamentoSemantico.campos.area_construida, 'm²');
      return mapeamentoSemantico.campos.area_construida;
    }

    console.warn('⚠️ [ANALYZER-DYNAMIC] Área construída não encontrada, usando padrão: 150m²');
    return 150; // Valor padrão
  }

  /**
   * 🏞️ Extrair área do terreno dinamicamente
   */
  extrairAreaTerrenoDinamica(mapeamentoSemantico, respostas) {
    console.log('🏞️ [ANALYZER-DYNAMIC] Extraindo área do terreno dinamicamente...');
    
    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.area_terreno) {
      console.log('🏞️ [ANALYZER-DYNAMIC] Área do terreno encontrada via mapeamento semântico:', mapeamentoSemantico.campos.area_terreno, 'm²');
      return mapeamentoSemantico.campos.area_terreno;
    }

    console.warn('⚠️ [ANALYZER-DYNAMIC] Área do terreno não encontrada');
    return null;
  }

  /**
   * 📍 Extrair localização dinamicamente
   */
  extrairLocalizacaoDinamica(mapeamentoSemantico, respostas) {
    console.log('📍 [ANALYZER-DYNAMIC] Extraindo localização dinamicamente...');
    
    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.localizacao) {
      console.log('📍 [ANALYZER-DYNAMIC] Localização encontrada via mapeamento semântico:', mapeamentoSemantico.campos.localizacao);
      return mapeamentoSemantico.campos.localizacao;
    }

    console.warn('⚠️ [ANALYZER-DYNAMIC] Localização não encontrada, usando padrão');
    return 'Brasil'; // Padrão
  }

  /**
   * ⭐ Identificar padrão dinamicamente
   */
  identificarPadraoDinamico(mapeamentoSemantico, respostas) {
    console.log('⭐ [ANALYZER-DYNAMIC] Identificando padrão dinamicamente...');

    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.padrao) {
      console.log('⭐ [ANALYZER-DYNAMIC] Padrão encontrado via mapeamento semântico:', mapeamentoSemantico.campos.padrao);
      return mapeamentoSemantico.campos.padrao.toLowerCase();
    }

    // 2. Análise por padrões semânticos
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    let pontuacoes = {};
    
    Object.entries(this.padraoPatterns).forEach(([padrao, patterns]) => {
      pontuacoes[padrao] = 0;
      patterns.forEach(pattern => {
        const matches = (textoCompleto.match(new RegExp(pattern, 'gi')) || []).length;
        pontuacoes[padrao] += matches;
      });
    });
    
    const padraoIdentificado = Object.entries(pontuacoes)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    console.log('⭐ [ANALYZER-DYNAMIC] Pontuações de padrão:', pontuacoes);
    console.log('⭐ [ANALYZER-DYNAMIC] Padrão identificado:', padraoIdentificado);
    
    return padraoIdentificado.toLowerCase();
  }

  /**
   * 🎯 Calcular complexidade dinamicamente
   */
  calcularComplexidadeDinamica(mapeamentoSemantico, respostas) {
    const padrao = this.identificarPadraoDinamico(mapeamentoSemantico, respostas);
    const totalRespostas = Object.keys(respostas).length;
    const caracteristicasEspeciais = mapeamentoSemantico.campos.caracteristicas_especiais || [];
    
    // Fatores de complexidade
    let pontuacaoComplexidade = 0;
    
    // Baseado no padrão
    if (padrao === 'alto') pontuacaoComplexidade += 3;
    else if (padrao === 'medio') pontuacaoComplexidade += 2;
    else pontuacaoComplexidade += 1;
    
    // Baseado no número de respostas
    if (totalRespostas > 20) pontuacaoComplexidade += 2;
    else if (totalRespostas > 10) pontuacaoComplexidade += 1;
    
    // Baseado em características especiais
    pontuacaoComplexidade += caracteristicasEspeciais.length;
    
    // Determinar complexidade final
    let complexidade;
    if (pontuacaoComplexidade >= 6) complexidade = 'alta';
    else if (pontuacaoComplexidade >= 3) complexidade = 'media';
    else complexidade = 'simples';
    
    console.log('🎯 [ANALYZER-DYNAMIC] Pontuação de complexidade:', pontuacaoComplexidade);
    console.log('🎯 [ANALYZER-DYNAMIC] Complexidade calculada:', complexidade);
    
    return complexidade;
  }

  /**
   * 🔧 Identificar disciplinas dinamicamente
   */
  identificarDisciplinasDinamicas(mapeamentoSemantico, respostas, briefing) {
    const disciplinasIdentificadas = new Set();
    
    // Sempre incluir a disciplina principal do briefing
    if (briefing.disciplina) {
      disciplinasIdentificadas.add(briefing.disciplina.toLowerCase());
    }
    
    // Analisar respostas para identificar outras disciplinas
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    
    Object.entries(this.disciplinaPatterns).forEach(([disciplina, patterns]) => {
      patterns.forEach(pattern => {
        if (textoCompleto.includes(pattern)) {
          disciplinasIdentificadas.add(disciplina.toLowerCase());
        }
      });
    });
    
    // Disciplinas básicas sempre necessárias
    const disciplinasBasicas = ['arquitetura', 'estrutural', 'instalacoes_hidraulicas', 'instalacoes_eletricas'];
    disciplinasBasicas.forEach(disc => disciplinasIdentificadas.add(disc));
    
    // Adicionar disciplinas baseadas em características especiais
    const caracteristicas = mapeamentoSemantico.campos.caracteristicas_especiais || [];
    if (caracteristicas.includes('paisagismo') || caracteristicas.includes('jardim')) {
      disciplinasIdentificadas.add('paisagismo');
    }
    if (caracteristicas.includes('home_theater') || caracteristicas.includes('automacao')) {
      disciplinasIdentificadas.add('interiores');
    }
    
    const resultado = Array.from(disciplinasIdentificadas);
    console.log('🔧 [ANALYZER-DYNAMIC] Disciplinas identificadas dinamicamente:', resultado);
    
    return resultado;
  }

  /**
   * ⏱️ Estimar prazo dinamicamente
   */
  estimarPrazoDinamico(mapeamentoSemantico, respostas) {
    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.prazo) {
      console.log('⏱️ [ANALYZER-DYNAMIC] Prazo encontrado via mapeamento semântico:', mapeamentoSemantico.campos.prazo, 'dias');
      return mapeamentoSemantico.campos.prazo;
    }

    // 2. Calcular baseado em outros fatores
    const complexidade = this.calcularComplexidadeDinamica(mapeamentoSemantico, respostas);
    const areaConstruida = this.extrairAreaConstruidaDinamica(mapeamentoSemantico, respostas);
    
    // Fórmula base: 30 dias + (área/10) + fator complexidade
    let prazoBase = 30;
    prazoBase += Math.round(areaConstruida / 10);
    
    if (complexidade === 'alta') prazoBase += 30;
    else if (complexidade === 'media') prazoBase += 15;
    
    console.log('⏱️ [ANALYZER-DYNAMIC] Prazo estimado dinamicamente:', prazoBase, 'dias');
    return prazoBase;
  }

  /**
   * 💰 Extrair orçamento dinamicamente
   */
  extrairOrcamentoDinamico(mapeamentoSemantico, respostas) {
    // 1. Usar mapeamento semântico primeiro
    if (mapeamentoSemantico.campos.orcamento) {
      console.log('💰 [ANALYZER-DYNAMIC] Orçamento encontrado via mapeamento semântico:', mapeamentoSemantico.campos.orcamento);
      return mapeamentoSemantico.campos.orcamento;
    }

    return null;
  }

  /**
   * 🎯 Calcular confiança dinâmica
   */
  calcularConfiancaDinamica(mapeamentoSemantico, respostas) {
    const totalRespostas = Object.keys(respostas).length;
    const camposMapeados = mapeamentoSemantico.totalCamposEncontrados;
    const camposDisponiveis = mapeamentoSemantico.totalCamposDisponiveis;
    
    let pontuacaoConfianca = 0;
    
    // Baseado no número de respostas
    if (totalRespostas >= 20) pontuacaoConfianca += 30;
    else if (totalRespostas >= 10) pontuacaoConfianca += 20;
    else if (totalRespostas >= 5) pontuacaoConfianca += 10;
    
    // Baseado na taxa de mapeamento semântico
    const taxaMapeamento = (camposMapeados / camposDisponiveis) * 100;
    pontuacaoConfianca += Math.round(taxaMapeamento * 0.5); // Até 50 pontos
    
    // Baseado na confiança individual dos campos
    const confiancasIndividuais = Object.values(mapeamentoSemantico.confianca || {});
    if (confiancasIndividuais.length > 0) {
      const mediaConfiancas = confiancasIndividuais.reduce((a, b) => a + b, 0) / confiancasIndividuais.length;
      pontuacaoConfianca += Math.round(mediaConfiancas * 0.2); // Até 20 pontos
    }
    
    const confianca = Math.min(100, pontuacaoConfianca);
    console.log('🎯 [ANALYZER-DYNAMIC] Confiança dinâmica calculada:', confianca + '%');
    
    return confianca;
  }
}

module.exports = BriefingAnalyzerDynamic;