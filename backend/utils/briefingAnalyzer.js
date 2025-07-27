/**
 * 🧠 ANALISADOR INTELIGENTE DE BRIEFINGS
 * 
 * Sistema avançado para extrair dados precisos dos briefings
 * e alimentar a geração de orçamentos com informações corretas
 */

class BriefingAnalyzer {
  constructor() {
    // Padrões para identificação de tipologias
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

    // Padrões para identificação de complexidade/padrão
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

    // Padrões para identificação de disciplinas
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
   * 🎯 Método principal para extrair dados estruturados do briefing
   */
  async extrairDadosEstruturados(briefing) {
    console.log('🧠 [ANALYZER] Iniciando análise inteligente do briefing:', briefing.id);
    
    try {
      // 1. Extrair respostas do briefing
      const respostas = this.extrairRespostas(briefing);
      console.log('📋 [ANALYZER] Total de respostas encontradas:', Object.keys(respostas).length);
      
      // 2. Analisar dados básicos do briefing
      const dadosBasicos = this.analisarDadosBasicos(briefing);
      
      // 3. Extrair informações específicas das respostas
      const dadosExtraidos = {
        // Dados básicos do briefing
        ...dadosBasicos,
        
        // Análise das respostas
        areaAtuacao: this.extrairAreaAtuacao(respostas, briefing),
        tipologia: this.identificarTipologia(respostas, briefing),
        areaConstruida: this.extrairAreaConstruida(respostas),
        areaTerreno: this.extrairAreaTerreno(respostas),
        padrao: this.identificarPadrao(respostas),
        complexidade: this.calcularComplexidade(respostas),
        disciplinasNecessarias: this.identificarDisciplinas(respostas, briefing),
        localizacao: this.extrairLocalizacao(respostas),
        caracteristicasEspeciais: this.extrairCaracteristicas(respostas),
        prazoEstimado: this.estimarPrazo(respostas),
        
        // Metadados da análise
        confianca: this.calcularConfianca(respostas),
        fonteDados: 'briefing_estruturado',
        timestampAnalise: new Date().toISOString(),
        versaoAnalyzer: '2.0.0'
      };
      
      console.log('✅ [ANALYZER] Dados extraídos com sucesso:', {
        tipologia: dadosExtraidos.tipologia,
        areaConstruida: dadosExtraidos.areaConstruida,
        padrao: dadosExtraidos.padrao,
        disciplinas: dadosExtraidos.disciplinasNecessarias.length,
        confianca: dadosExtraidos.confianca
      });
      
      return dadosExtraidos;
      
    } catch (error) {
      console.error('❌ [ANALYZER] Erro na análise:', error);
      throw new Error(`Erro na análise do briefing: ${error.message}`);
    }
  }

  /**
   * 📋 Extrair respostas do briefing
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
        console.warn('⚠️ [ANALYZER] Erro ao parsear observações:', error.message);
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
        console.warn('⚠️ [ANALYZER] Erro ao parsear dados_extraidos:', error.message);
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
        console.warn('⚠️ [ANALYZER] Erro ao parsear metadata:', error.message);
      }
    }
    
    return respostas;
  }

  /**
   * 📊 Analisar dados básicos do briefing
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
   * 🏢 Extrair área de atuação (RESIDENCIAL, COMERCIAL, etc.)
   */
  extrairAreaAtuacao(respostas, briefing) {
    console.log('🏢 [ANALYZER] Iniciando extração de área de atuação...');
    
    // 1. Verificar campo 'area' do briefing (que pode conter área de atuação)
    if (briefing.area && typeof briefing.area === 'string') {
      const areaLower = briefing.area.toLowerCase();
      const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
      
      for (const tipo of tiposAtuacao) {
        if (areaLower.includes(tipo)) {
          console.log('🏢 [ANALYZER] Área de atuação encontrada no campo area do briefing:', tipo.toUpperCase());
          return tipo.toUpperCase();
        }
      }
    }
    
    // 2. Procurar por perguntas específicas conhecidas (pergunta 66 para residencial)
    const perguntasAtuacaoConhecidas = ['66', '67', '1', '2']; // Perguntas comuns de área de atuação
    
    for (const pergunta of perguntasAtuacaoConhecidas) {
      if (respostas[pergunta]) {
        const valor = respostas[pergunta].toLowerCase();
        const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
        
        for (const tipo of tiposAtuacao) {
          if (valor.includes(tipo)) {
            console.log('🏢 [ANALYZER] Área de atuação encontrada na pergunta', pergunta, ':', tipo.toUpperCase());
            return tipo.toUpperCase();
          }
        }
      }
    }
    
    // 3. Procurar por palavras-chave relacionadas à área de atuação
    const palavrasChaveAtuacao = ['atuação', 'tipo', 'categoria', 'área de', 'segmento', 'setor'];
    
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const keyLower = key.toLowerCase();
        const valueLower = value.toLowerCase();
        
        // Verificar se a pergunta contém palavras relacionadas à área de atuação
        if (palavrasChaveAtuacao.some(palavra => keyLower.includes(palavra))) {
          const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
          
          for (const tipo of tiposAtuacao) {
            if (valueLower.includes(tipo)) {
              console.log('🏢 [ANALYZER] Área de atuação encontrada por palavra-chave na pergunta', key, ':', tipo.toUpperCase());
              return tipo.toUpperCase();
            }
          }
        }
      }
    }
    
    // 4. Procurar em todas as respostas por tipos de atuação
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const valueLower = value.toLowerCase();
        const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
        
        for (const tipo of tiposAtuacao) {
          if (valueLower === tipo || valueLower.includes(tipo)) {
            console.log('🏢 [ANALYZER] Área de atuação encontrada na resposta', key, ':', tipo.toUpperCase());
            return tipo.toUpperCase();
          }
        }
      }
    }
    
    console.warn('⚠️ [ANALYZER] Área de atuação não encontrada, usando padrão baseado na tipologia');
    
    // 5. Fallback: inferir da tipologia se disponível
    if (briefing.tipologia) {
      const tipologiaLower = briefing.tipologia.toLowerCase();
      if (tipologiaLower.includes('unifamiliar') || tipologiaLower.includes('casa') || tipologiaLower.includes('apartamento')) {
        console.log('🏢 [ANALYZER] Área de atuação inferida da tipologia: RESIDENCIAL');
        return 'RESIDENCIAL';
      }
    }
    
    return 'RESIDENCIAL'; // Padrão mais comum
  }

  /**
   * 🏠 Identificar tipologia do projeto
   */
  identificarTipologia(respostas, briefing) {
    // 1. Verificar tipologia já definida no briefing
    if (briefing.tipologia && briefing.tipologia !== 'null') {
      console.log('🏠 [ANALYZER] Tipologia do briefing:', briefing.tipologia);
      return briefing.tipologia.toUpperCase();
    }
    
    // 2. Analisar respostas para identificar tipologia
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    let pontuacoes = {};
    
    Object.entries(this.tipologiaPatterns).forEach(([tipo, patterns]) => {
      pontuacoes[tipo] = 0;
      patterns.forEach(pattern => {
        const matches = (textoCompleto.match(new RegExp(pattern, 'gi')) || []).length;
        pontuacoes[tipo] += matches;
      });
    });
    
    // Encontrar tipologia com maior pontuação
    const tipologiaIdentificada = Object.entries(pontuacoes)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    console.log('🏠 [ANALYZER] Pontuações de tipologia:', pontuacoes);
    console.log('🏠 [ANALYZER] Tipologia identificada:', tipologiaIdentificada);
    
    return tipologiaIdentificada;
  }

  /**
   * 📐 Extrair área construída
   */
  extrairAreaConstruida(respostas) {
    console.log('📐 [ANALYZER] Iniciando extração de área construída...');
    
    // 1. Procurar por campos específicos de área (nomes diretos)
    const camposAreaDiretos = [
      'area_construida', 'areaConstruida', 'area_total', 'areaTotal',
      'area', 'metragem', 'tamanho', 'dimensao'
    ];
    
    for (const campo of camposAreaDiretos) {
      if (respostas[campo]) {
        const area = this.extrairNumeroArea(respostas[campo]);
        if (area > 0) {
          console.log('📐 [ANALYZER] Área encontrada no campo direto', campo, ':', area, 'm²');
          return area;
        }
      }
    }
    
    // 2. Procurar por perguntas específicas conhecidas (pergunta 24 para residencial)
    const perguntasAreaConhecidas = ['24', '25', '26']; // Perguntas comuns de área
    
    for (const pergunta of perguntasAreaConhecidas) {
      if (respostas[pergunta]) {
        const area = this.extrairNumeroArea(respostas[pergunta]);
        if (area > 0) {
          console.log('📐 [ANALYZER] Área encontrada na pergunta', pergunta, ':', area, 'm²');
          return area;
        }
      }
    }
    
    // 3. Procurar por palavras-chave relacionadas à área nas perguntas
    const palavrasChaveArea = ['área', 'area', 'metragem', 'tamanho', 'dimensão', 'construída', 'total'];
    
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const keyLower = key.toLowerCase();
        
        // Verificar se a pergunta contém palavras relacionadas à área
        if (palavrasChaveArea.some(palavra => keyLower.includes(palavra))) {
          const area = this.extrairNumeroArea(value);
          if (area > 0) {
            console.log('📐 [ANALYZER] Área encontrada por palavra-chave na pergunta', key, ':', area, 'm²');
            return area;
          }
        }
      }
    }
    
    // 4. Procurar por números que podem representar área (50-2000m²)
    const areasEncontradas = [];
    
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const area = this.extrairNumeroArea(value);
        if (area >= 50 && area <= 2000) { // Faixa realista para projetos
          areasEncontradas.push({
            pergunta: key,
            area: area,
            valor: value
          });
        }
      }
    }
    
    if (areasEncontradas.length > 0) {
      // Ordenar por área (maior primeiro) e pegar a mais provável
      areasEncontradas.sort((a, b) => b.area - a.area);
      const areaSelecionada = areasEncontradas[0];
      
      console.log('📐 [ANALYZER] Área encontrada por análise numérica na pergunta', areaSelecionada.pergunta, ':', areaSelecionada.area, 'm²');
      console.log('📐 [ANALYZER] Outras áreas encontradas:', areasEncontradas.slice(1).map(a => `${a.pergunta}:${a.area}m²`).join(', '));
      
      return areaSelecionada.area;
    }
    
    console.warn('⚠️ [ANALYZER] Área não encontrada, usando padrão: 150m²');
    return 150; // Valor padrão
  }

  /**
   * 🌍 Extrair área do terreno
   */
  extrairAreaTerreno(respostas) {
    console.log('🏞️ [ANALYZER] Iniciando extração de área do terreno...');
    
    // 1. Mapeamento específico de perguntas conhecidas para área do terreno
    const perguntasAreaTerreno = ['62', '63']; // Pergunta 62: área, 63: dimensões
    
    // Primeiro, verifica perguntas específicas conhecidas
    for (const pergunta of perguntasAreaTerreno) {
      if (respostas[pergunta]) {
        const resposta = respostas[pergunta];
        console.log(`🏞️ [ANALYZER] Verificando pergunta ${pergunta}: "${resposta}"`);
        
        // Se for a pergunta 62, extrai número direto (área em m²)
        if (pergunta === '62') {
          const numero = this.extrairNumeroArea(resposta);
          if (numero && numero > 50 && numero < 50000) {
            console.log(`🏞️ [ANALYZER] Área do terreno encontrada na pergunta ${pergunta}: ${numero} m²`);
            return numero;
          }
        }
        
        // Se for a pergunta 63, calcula área a partir das dimensões (ex: "15x30")
        if (pergunta === '63') {
          const dimensoes = resposta.match(/(\d+)\s*x\s*(\d+)/i);
          if (dimensoes) {
            const largura = parseInt(dimensoes[1]);
            const comprimento = parseInt(dimensoes[2]);
            const area = largura * comprimento;
            console.log(`🏞️ [ANALYZER] Área calculada das dimensões ${largura}x${comprimento}: ${area} m²`);
            return area;
          }
        }
      }
    }
    
    // 2. Procurar por campos específicos de terreno (nomes diretos)
    const camposTerrenoDiretos = [
      'area_terreno', 'areaTerreno', 'terreno', 'lote', 'area_lote', 'areaLote'
    ];
    
    for (const campo of camposTerrenoDiretos) {
      if (respostas[campo]) {
        const area = this.extrairNumeroArea(respostas[campo]);
        if (area > 0) {
          console.log('🏞️ [ANALYZER] Área do terreno encontrada no campo direto', campo, ':', area, 'm²');
          return area;
        }
      }
    }
    
    // 3. Procurar por palavras-chave relacionadas ao terreno
    const palavrasChaveTerreno = ['terreno', 'lote', 'área do terreno', 'tamanho do terreno', 'dimensão do terreno'];
    
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const keyLower = key.toLowerCase();
        const valueLower = value.toLowerCase();
        
        // Verificar se a pergunta contém palavras relacionadas ao terreno
        if (palavrasChaveTerreno.some(palavra => keyLower.includes(palavra) || valueLower.includes(palavra))) {
          const area = this.extrairNumeroArea(value);
          if (area > 0) {
            console.log('🏞️ [ANALYZER] Área do terreno encontrada por palavra-chave na pergunta', key, ':', area, 'm²');
            return area;
          }
        }
      }
    }
    
    // 4. Procurar por números que podem representar área de terreno (100-5000m²)
    const areasEncontradas = [];
    
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const area = this.extrairNumeroArea(value);
        if (area >= 100 && area <= 5000) { // Faixa realista para terrenos
          // Verificar se não é a área construída (que já foi extraída)
          const areaConstrutida = this.extrairAreaConstruida(respostas);
          if (area !== areaConstrutida) {
            areasEncontradas.push({
              pergunta: key,
              area: area,
              valor: value
            });
          }
        }
      }
    }
    
    if (areasEncontradas.length > 0) {
      // Ordenar por área (maior primeiro) e pegar a mais provável para terreno
      areasEncontradas.sort((a, b) => b.area - a.area);
      const areaSelecionada = areasEncontradas[0];
      
      console.log('🏞️ [ANALYZER] Área do terreno encontrada por análise numérica na pergunta', areaSelecionada.pergunta, ':', areaSelecionada.area, 'm²');
      console.log('🏞️ [ANALYZER] Outras áreas de terreno encontradas:', areasEncontradas.slice(1).map(a => `${a.pergunta}:${a.area}m²`).join(', '));
      
      return areaSelecionada.area;
    }
    
    console.warn('⚠️ [ANALYZER] Área do terreno não encontrada');
    return null;
  }

  /**
   * 🔢 Extrair número da área de um texto
   */
  extrairNumeroArea(texto) {
    if (typeof texto !== 'string') return 0;
    
    // Primeiro, tentar extrair número simples (como "250")
    const numeroSimples = texto.trim();
    if (/^\d+$/.test(numeroSimples)) {
      const numero = parseInt(numeroSimples);
      if (numero >= 10 && numero <= 10000) {
        console.log('🔢 [ANALYZER] Número simples encontrado:', numero);
        return numero;
      }
    }
    
    // Padrões para encontrar área em m² ou com texto
    const patterns = [
      /(\d+(?:\.\d+)?)\s*m²/gi,
      /(\d+(?:\.\d+)?)\s*metros?\s*quadrados?/gi,
      /(\d+(?:\.\d+)?)\s*m2/gi,
      /área.*?(\d+(?:\.\d+)?)/gi,
      /(\d+(?:\.\d+)?)\s*metros/gi,
      /(\d+(?:\.\d+)?)/gi // Qualquer número
    ];
    
    for (const pattern of patterns) {
      const matches = texto.match(pattern);
      if (matches) {
        for (const match of matches) {
          const numero = parseFloat(match.replace(/[^\d.]/g, ''));
          if (numero >= 10 && numero <= 10000) { // Validação básica
            console.log('🔢 [ANALYZER] Número extraído do padrão:', numero, 'de:', match);
            return Math.round(numero);
          }
        }
      }
    }
    
    return 0;
  }

  /**
   * ⭐ Identificar padrão do projeto
   */
  identificarPadrao(respostas) {
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    let pontuacoes = {};
    
    Object.entries(this.padraoPatterns).forEach(([padrao, patterns]) => {
      pontuacoes[padrao] = 0;
      patterns.forEach(pattern => {
        const matches = (textoCompleto.match(new RegExp(pattern, 'gi')) || []).length;
        pontuacoes[padrao] += matches;
      });
    });
    
    // Encontrar padrão com maior pontuação
    const padraoIdentificado = Object.entries(pontuacoes)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    console.log('⭐ [ANALYZER] Pontuações de padrão:', pontuacoes);
    console.log('⭐ [ANALYZER] Padrão identificado:', padraoIdentificado);
    
    return padraoIdentificado.toLowerCase();
  }

  /**
   * 🎯 Calcular complexidade
   */
  calcularComplexidade(respostas) {
    const padrao = this.identificarPadrao(respostas);
    const totalRespostas = Object.keys(respostas).length;
    
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
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    const caracteristicasComplexas = [
      'automação', 'domótica', 'piscina', 'elevador', 'ar condicionado',
      'aquecimento', 'sistema de segurança', 'home theater'
    ];
    
    caracteristicasComplexas.forEach(caracteristica => {
      if (textoCompleto.includes(caracteristica)) {
        pontuacaoComplexidade += 1;
      }
    });
    
    // Determinar complexidade final
    let complexidade;
    if (pontuacaoComplexidade >= 6) complexidade = 'alta';
    else if (pontuacaoComplexidade >= 3) complexidade = 'media';
    else complexidade = 'simples';
    
    console.log('🎯 [ANALYZER] Pontuação de complexidade:', pontuacaoComplexidade);
    console.log('🎯 [ANALYZER] Complexidade calculada:', complexidade);
    
    return complexidade;
  }

  /**
   * 🔧 Identificar disciplinas necessárias
   */
  identificarDisciplinas(respostas, briefing) {
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
    
    const resultado = Array.from(disciplinasIdentificadas);
    console.log('🔧 [ANALYZER] Disciplinas identificadas:', resultado);
    
    return resultado;
  }

  /**
   * 📍 Extrair localização
   */
  extrairLocalizacao(respostas) {
    console.log('📍 [ANALYZER] Iniciando extração de localização...');
    
    // 1. Mapeamento específico de perguntas conhecidas para localização
    const perguntasLocalizacaoConhecidas = ['61', '13']; // Pergunta 61: endereço completo, 13: cidade/região
    
    // Primeiro, verifica perguntas específicas conhecidas
    for (const pergunta of perguntasLocalizacaoConhecidas) {
      if (respostas[pergunta]) {
        const resposta = respostas[pergunta];
        console.log(`📍 [ANALYZER] Verificando pergunta ${pergunta}: "${resposta}"`);
        
        // Se contém informações de localização válidas
        if (resposta && typeof resposta === 'string' && resposta.trim().length > 3) {
          console.log(`📍 [ANALYZER] Localização encontrada na pergunta ${pergunta}: ${resposta}`);
          return resposta.trim();
        }
      }
    }
    
    // 2. Procurar por campos específicos de localização (nomes diretos)
    const camposLocalizacao = [
      'localizacao', 'localização', 'cidade', 'endereco', 'endereço',
      'local', 'regiao', 'região', 'estado', 'bairro', 'municipio', 'município'
    ];
    
    for (const campo of camposLocalizacao) {
      if (respostas[campo] && typeof respostas[campo] === 'string') {
        console.log('📍 [ANALYZER] Localização encontrada no campo direto:', respostas[campo]);
        return respostas[campo];
      }
    }
    
    // 3. Procurar por palavras-chave relacionadas à localização
    const palavrasChaveLocalizacao = [
      'endereço', 'endereco', 'rua', 'avenida', 'cidade', 'estado', 
      'bairro', 'localização', 'localizacao', 'região', 'regiao'
    ];
    
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string') {
        const keyLower = key.toLowerCase();
        const valueLower = value.toLowerCase();
        
        // Verificar se a pergunta contém palavras relacionadas à localização
        if (palavrasChaveLocalizacao.some(palavra => keyLower.includes(palavra) || valueLower.includes(palavra))) {
          // Verificar se a resposta parece ser uma localização válida
          if (value.length > 5 && (
            value.includes(',') || 
            value.includes('/') || 
            value.includes('-') ||
            /\b(rua|avenida|av|r\.|cidade|estado|sc|sp|rj|mg|pr|rs)\b/i.test(value)
          )) {
            console.log('📍 [ANALYZER] Localização encontrada por palavra-chave na pergunta', key, ':', value);
            return value;
          }
        }
      }
    }
    
    // 4. Procurar por padrões de endereço em todas as respostas
    for (const [key, value] of Object.entries(respostas)) {
      if (typeof value === 'string' && value.length > 10) {
        // Padrões que indicam endereço
        const padraoEndereco = /\b(rua|avenida|av|r\.|estrada|rodovia|alameda|travessa|praça|largo)\b.*\d+/i;
        const padraoCidade = /\b\w+\s*\/\s*(sc|sp|rj|mg|pr|rs|ba|pe|ce|go|df|mt|ms|ro|ac|am|ap|pa|rr|to|al|se|pb|rn|pi|ma)\b/i;
        
        if (padraoEndereco.test(value) || padraoCidade.test(value)) {
          console.log('📍 [ANALYZER] Localização encontrada por padrão de endereço na pergunta', key, ':', value);
          return value;
        }
      }
    }
    
    console.warn('⚠️ [ANALYZER] Localização não encontrada, usando padrão');
    return 'Brasil'; // Padrão
  }

  /**
   * ✨ Extrair características especiais
   */
  extrairCaracteristicas(respostas) {
    const caracteristicas = [];
    const textoCompleto = JSON.stringify(respostas).toLowerCase();
    
    const caracteristicasEspeciais = [
      'piscina', 'churrasqueira', 'automação', 'home theater',
      'elevador', 'garagem', 'jardim', 'varanda', 'terraço',
      'ar condicionado', 'aquecimento', 'lareira'
    ];
    
    caracteristicasEspeciais.forEach(caracteristica => {
      if (textoCompleto.includes(caracteristica)) {
        caracteristicas.push(caracteristica);
      }
    });
    
    console.log('✨ [ANALYZER] Características especiais:', caracteristicas);
    return caracteristicas;
  }

  /**
   * ⏱️ Estimar prazo do projeto
   */
  estimarPrazo(respostas) {
    const complexidade = this.calcularComplexidade(respostas);
    const areaConstruida = this.extrairAreaConstruida(respostas);
    
    // Fórmula base: 30 dias + (área/10) + fator complexidade
    let prazoBase = 30;
    prazoBase += Math.round(areaConstruida / 10);
    
    if (complexidade === 'alta') prazoBase += 30;
    else if (complexidade === 'media') prazoBase += 15;
    
    console.log('⏱️ [ANALYZER] Prazo estimado:', prazoBase, 'dias');
    return prazoBase;
  }

  /**
   * 🎯 Calcular confiança da análise
   */
  calcularConfianca(respostas) {
    const totalRespostas = Object.keys(respostas).length;
    let pontuacaoConfianca = 0;
    
    // Baseado no número de respostas
    if (totalRespostas >= 20) pontuacaoConfianca += 40;
    else if (totalRespostas >= 10) pontuacaoConfianca += 30;
    else if (totalRespostas >= 5) pontuacaoConfianca += 20;
    else pontuacaoConfianca += 10;
    
    // Baseado na presença de campos importantes
    const camposImportantes = ['area_construida', 'tipologia', 'padrao', 'localizacao'];
    camposImportantes.forEach(campo => {
      if (respostas[campo]) pontuacaoConfianca += 15;
    });
    
    const confianca = Math.min(100, pontuacaoConfianca);
    console.log('🎯 [ANALYZER] Confiança da análise:', confianca + '%');
    
    return confianca;
  }
}

module.exports = BriefingAnalyzer;