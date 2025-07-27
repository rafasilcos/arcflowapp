/**
 * 🧠 MAPEADOR SEMÂNTICO DE BRIEFINGS
 * 
 * Sistema dinâmico para identificar campos por conteúdo semântico
 * em vez de posições fixas, permitindo briefings personalizados
 */

class BriefingSemanticMapper {
  constructor() {
    // Mapeamento semântico por categorias e padrões
    this.camposSemânticos = {
      // ÁREA CONSTRUÍDA
      area_construida: {
        slugs: ['area_construida', 'areaConstruida', 'area_total', 'areaTotal'],
        palavrasChave: [
          'área construída', 'area construida', 'área total', 'area total',
          'metragem', 'tamanho', 'dimensão', 'área do projeto', 'área edificada',
          'área útil', 'área bruta', 'm²', 'm2', 'metros quadrados'
        ],
        padroes: [
          /área\s*(construída|total|do\s*projeto)/i,
          /metragem\s*(total|construída)/i,
          /tamanho\s*(do\s*projeto|da\s*construção)/i,
          /\d+\s*m[²2]/i
        ],
        tipo: 'numero',
        unidade: 'm²',
        validacao: (valor) => {
          const num = this.extrairNumero(valor);
          return num >= 20 && num <= 5000; // Faixa realista
        }
      },

      // ÁREA DO TERRENO
      area_terreno: {
        slugs: ['area_terreno', 'areaTerreno', 'area_lote', 'areaLote'],
        perguntasEspecificas: ['62', '63'], // Perguntas específicas conhecidas
        palavrasChave: [
          'área do terreno', 'area do terreno', 'área terreno', 'area terreno',
          'tamanho do terreno', 'dimensão do terreno', 'área do lote', 'area do lote',
          'metragem do terreno', 'terreno', 'lote'
        ],
        padroes: [
          /área\s*(do\s*)?terreno/i,
          /tamanho\s*(do\s*)?terreno/i,
          /dimensão\s*(do\s*)?terreno/i,
          /área\s*(do\s*)?lote/i,
          /\d+\s*x\s*\d+/i // Dimensões como "15x30"
        ],
        tipo: 'numero',
        unidade: 'm²',
        validacao: (valor) => {
          const num = this.extrairNumero(valor);
          return num >= 100 && num <= 10000; // Faixa realista para terrenos
        }
      },

      // LOCALIZAÇÃO
      localizacao: {
        slugs: ['localizacao', 'localização', 'endereco', 'endereço', 'cidade', 'local'],
        palavrasChave: [
          'localização', 'localizacao', 'endereço', 'endereco', 'cidade',
          'local', 'região', 'regiao', 'bairro', 'estado', 'município',
          'onde', 'aonde', 'lugar'
        ],
        padroes: [
          /localização|localizacao/i,
          /endereço|endereco/i,
          /cidade|município/i,
          /rua\s+[\w\s]+\d+/i, // Padrão de endereço
          /\w+\s*\/\s*(sc|sp|rj|mg|pr|rs|ba|pe|ce|go|df)/i // Cidade/Estado
        ],
        tipo: 'texto',
        validacao: (valor) => {
          return typeof valor === 'string' && valor.length > 3;
        }
      },

      // TIPOLOGIA
      tipologia: {
        slugs: ['tipologia', 'tipo', 'categoria', 'tipo_projeto'],
        palavrasChave: [
          'tipologia', 'tipo', 'categoria', 'tipo de projeto', 'tipo projeto',
          'casa', 'apartamento', 'comercial', 'residencial', 'industrial'
        ],
        padroes: [
          /tipo\s*(de\s*)?projeto/i,
          /tipologia/i,
          /categoria/i,
          /(casa|apartamento|comercial|residencial|industrial)/i
        ],
        tipo: 'categoria',
        opcoes: ['residencial', 'comercial', 'industrial', 'institucional', 'unifamiliar', 'multifamiliar'],
        validacao: (valor) => {
          return typeof valor === 'string' && valor.length > 2;
        }
      },

      // ÁREA DE ATUAÇÃO
      area_atuacao: {
        slugs: ['area_atuacao', 'areaAtuacao', 'segmento', 'setor'],
        palavrasChave: [
          'área de atuação', 'area de atuacao', 'segmento', 'setor',
          'tipo de obra', 'categoria do projeto', 'natureza do projeto'
        ],
        padroes: [
          /área\s*de\s*atuação/i,
          /segmento/i,
          /setor/i,
          /tipo\s*de\s*obra/i
        ],
        tipo: 'categoria',
        opcoes: ['residencial', 'comercial', 'industrial', 'institucional', 'mista'],
        validacao: (valor) => {
          const opcoes = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
          return opcoes.some(opcao => valor.toLowerCase().includes(opcao));
        }
      },

      // PADRÃO/QUALIDADE
      padrao: {
        slugs: ['padrao', 'padrão', 'qualidade', 'nivel', 'nível'],
        palavrasChave: [
          'padrão', 'padrao', 'qualidade', 'nível', 'nivel',
          'alto padrão', 'médio padrão', 'padrão simples',
          'luxo', 'premium', 'básico', 'simples', 'econômico'
        ],
        padroes: [
          /(alto|médio|baixo|simples)\s*padrão/i,
          /(luxo|premium|básico|simples|econômico)/i,
          /qualidade\s*(alta|média|baixa)/i
        ],
        tipo: 'categoria',
        opcoes: ['simples', 'medio', 'alto'],
        validacao: (valor) => {
          const padroes = ['simples', 'medio', 'alto', 'básico', 'luxo', 'premium'];
          return padroes.some(padrao => valor.toLowerCase().includes(padrao));
        }
      },

      // ORÇAMENTO/VALOR
      orcamento: {
        slugs: ['orcamento', 'orçamento', 'valor', 'preco', 'preço', 'investimento'],
        palavrasChave: [
          'orçamento', 'orcamento', 'valor', 'preço', 'preco',
          'investimento', 'custo', 'verba', 'budget'
        ],
        padroes: [
          /orçamento|orcamento/i,
          /valor|preço|preco/i,
          /investimento|custo/i,
          /r\$\s*[\d.,]+/i // Padrão monetário brasileiro
        ],
        tipo: 'monetario',
        validacao: (valor) => {
          const num = this.extrairValorMonetario(valor);
          return num > 0;
        }
      },

      // PRAZO
      prazo: {
        slugs: ['prazo', 'tempo', 'duracao', 'duração', 'cronograma'],
        palavrasChave: [
          'prazo', 'tempo', 'duração', 'duracao', 'cronograma',
          'meses', 'dias', 'semanas', 'quando', 'entrega'
        ],
        padroes: [
          /prazo/i,
          /tempo\s*(de\s*)?(execução|entrega)/i,
          /duração|duracao/i,
          /\d+\s*(meses|dias|semanas)/i
        ],
        tipo: 'tempo',
        validacao: (valor) => {
          return /\d+/.test(valor);
        }
      }
    };

    // Padrões para identificação de características especiais
    this.caracteristicasEspeciais = {
      piscina: ['piscina', 'pool'],
      churrasqueira: ['churrasqueira', 'churras', 'grill', 'barbecue'],
      automacao: ['automação', 'automacao', 'domótica', 'domotica', 'smart home'],
      home_theater: ['home theater', 'cinema', 'sala de cinema'],
      jardim: ['jardim', 'paisagismo', 'área verde', 'verde'],
      garagem: ['garagem', 'estacionamento', 'vaga', 'vagas'],
      elevador: ['elevador', 'lift'],
      ar_condicionado: ['ar condicionado', 'climatização', 'climatizacao'],
      aquecimento: ['aquecimento', 'aquecedor', 'heating'],
      seguranca: ['segurança', 'seguranca', 'alarme', 'câmeras', 'cameras']
    };
  }

  /**
   * 🎯 Método principal para mapear campos dinamicamente
   */
  mapearCampos(respostas) {
    console.log('🧠 [SEMANTIC] Iniciando mapeamento semântico de', Object.keys(respostas).length, 'respostas');
    
    const camposMapeados = {};
    const confiancaMapeamento = {};

    // Para cada campo semântico que queremos encontrar
    for (const [nomeCampo, configuracao] of Object.entries(this.camposSemânticos)) {
      const resultado = this.identificarCampo(nomeCampo, configuracao, respostas);
      
      if (resultado.encontrado) {
        camposMapeados[nomeCampo] = resultado.valor;
        confiancaMapeamento[nomeCampo] = resultado.confianca;
        
        console.log(`✅ [SEMANTIC] ${nomeCampo} encontrado:`, {
          valor: resultado.valor,
          fonte: resultado.fonte,
          confianca: resultado.confianca + '%'
        });
      } else {
        console.log(`⚠️ [SEMANTIC] ${nomeCampo} não encontrado`);
      }
    }

    // Identificar características especiais
    camposMapeados.caracteristicas_especiais = this.identificarCaracteristicas(respostas);

    return {
      campos: camposMapeados,
      confianca: confiancaMapeamento,
      totalCamposEncontrados: Object.keys(camposMapeados).length,
      totalCamposDisponiveis: Object.keys(this.camposSemânticos).length
    };
  }

  /**
   * 🔍 Identificar um campo específico nas respostas
   */
  identificarCampo(nomeCampo, configuracao, respostas) {
    let melhorMatch = null;
    let maiorConfianca = 0;

    // 1. Buscar por slugs diretos (maior confiança)
    for (const slug of configuracao.slugs) {
      if (respostas[slug]) {
        const valor = this.processarValor(respostas[slug], configuracao);
        if (valor && configuracao.validacao(valor)) {
          return {
            encontrado: true,
            valor: valor,
            fonte: `slug_direto:${slug}`,
            confianca: 95
          };
        }
      }
    }

    // 2. Buscar por padrões regex (alta confiança)
    for (const [chave, resposta] of Object.entries(respostas)) {
      if (typeof resposta !== 'string') continue;

      for (const padrao of configuracao.padroes) {
        if (padrao.test(resposta) || padrao.test(chave)) {
          const valor = this.processarValor(resposta, configuracao);
          if (valor && configuracao.validacao(valor)) {
            const confianca = this.calcularConfiancaContextual(nomeCampo, chave, resposta, 85);
            if (confianca > maiorConfianca) {
              melhorMatch = {
                encontrado: true,
                valor: valor,
                fonte: `padrao_regex:${chave}`,
                confianca: confianca
              };
              maiorConfianca = confianca;
            }
          }
        }
      }
    }

    // 3. Buscar por palavras-chave (média confiança)
    for (const [chave, resposta] of Object.entries(respostas)) {
      if (typeof resposta !== 'string') continue;

      const chaveNormalizada = chave.toLowerCase();
      const respostaNormalizada = resposta.toLowerCase();

      for (const palavraChave of configuracao.palavrasChave) {
        if (chaveNormalizada.includes(palavraChave.toLowerCase()) || 
            respostaNormalizada.includes(palavraChave.toLowerCase())) {
          
          const valor = this.processarValor(resposta, configuracao);
          if (valor && configuracao.validacao(valor)) {
            const confianca = this.calcularConfiancaContextual(nomeCampo, chave, resposta, 70);
            if (confianca > maiorConfianca) {
              melhorMatch = {
                encontrado: true,
                valor: valor,
                fonte: `palavra_chave:${chave}`,
                confianca: confianca
              };
              maiorConfianca = confianca;
            }
          }
        }
      }
    }

    // 4. Busca heurística inteligente por tipo (baixa confiança)
    if (!melhorMatch && configuracao.tipo === 'numero') {
      const numerosEncontrados = this.buscarNumerosPorTipoInteligente(respostas, configuracao, nomeCampo);
      if (numerosEncontrados.length > 0) {
        const melhorNumero = numerosEncontrados[0]; // Já ordenado por relevância
        melhorMatch = {
          encontrado: true,
          valor: melhorNumero.valor,
          fonte: `heuristica_inteligente:${melhorNumero.chave}`,
          confianca: melhorNumero.confianca
        };
      }
    }

    return melhorMatch || { encontrado: false };
  }

  /**
   * 🧠 Busca inteligente de números por tipo específico
   */
  buscarNumerosPorTipoInteligente(respostas, configuracao, nomeCampo) {
    const numerosEncontrados = [];
    const chavesJaUsadas = this.chavesJaUsadas || new Set();

    for (const [chave, resposta] of Object.entries(respostas)) {
      if (typeof resposta !== 'string') continue;
      
      // Evitar reutilizar a mesma chave para campos diferentes
      if (chavesJaUsadas.has(chave)) continue;

      const numero = this.extrairNumero(resposta);
      if (numero > 0 && configuracao.validacao(resposta)) {
        const relevanciaContextual = this.calcularRelevanciaContextual(numero, chave, resposta, nomeCampo, configuracao);
        
        numerosEncontrados.push({
          chave: chave,
          valor: numero,
          resposta: resposta,
          relevancia: relevanciaContextual.relevancia,
          confianca: relevanciaContextual.confianca,
          motivo: relevanciaContextual.motivo
        });
      }
    }

    // Ordenar por relevância contextual
    const numerosOrdenados = numerosEncontrados.sort((a, b) => b.relevancia - a.relevancia);
    
    // Marcar a melhor chave como usada
    if (numerosOrdenados.length > 0) {
      if (!this.chavesJaUsadas) this.chavesJaUsadas = new Set();
      this.chavesJaUsadas.add(numerosOrdenados[0].chave);
    }

    return numerosOrdenados;
  }

  /**
   * 🎯 Calcular relevância contextual para um número específico
   */
  calcularRelevanciaContextual(numero, chave, resposta, nomeCampo, configuracao) {
    let relevancia = 0;
    let confianca = 30;
    let motivo = [];

    const chaveNormalizada = chave.toLowerCase();
    const respostaNormalizada = resposta.toLowerCase();

    // Lógica específica para área do terreno
    if (nomeCampo === 'area_terreno') {
      // Priorizar dimensões (ex: "20x25")
      if (/\d+\s*x\s*\d+/i.test(resposta)) {
        relevancia += 50;
        confianca += 30;
        motivo.push('dimensoes_terreno');
      }

      // Priorizar contexto de terreno
      if (chaveNormalizada.includes('terreno') || chaveNormalizada.includes('lote')) {
        relevancia += 40;
        confianca += 25;
        motivo.push('contexto_terreno');
      }

      // Penalizar se parece área construída
      if (chaveNormalizada.includes('construi') || chaveNormalizada.includes('edifica')) {
        relevancia -= 30;
        confianca -= 20;
        motivo.push('penalizado_construida');
      }

      // Faixa de valores típicos para terrenos (100-10000m²)
      if (numero >= 200 && numero <= 2000) {
        relevancia += 20;
        confianca += 10;
        motivo.push('faixa_terreno_tipica');
      }
    }

    // Lógica específica para área construída
    if (nomeCampo === 'area_construida') {
      // Priorizar contexto de construção
      if (chaveNormalizada.includes('construi') || chaveNormalizada.includes('edifica') || 
          chaveNormalizada.includes('area') && !chaveNormalizada.includes('terreno')) {
        relevancia += 40;
        confianca += 25;
        motivo.push('contexto_construida');
      }

      // Penalizar se parece terreno
      if (chaveNormalizada.includes('terreno') || chaveNormalizada.includes('lote')) {
        relevancia -= 30;
        confianca -= 20;
        motivo.push('penalizado_terreno');
      }

      // Penalizar dimensões (mais provável ser terreno)
      if (/\d+\s*x\s*\d+/i.test(resposta)) {
        relevancia -= 20;
        confianca -= 15;
        motivo.push('penalizado_dimensoes');
      }

      // Faixa de valores típicos para área construída (50-1000m²)
      if (numero >= 50 && numero <= 800) {
        relevancia += 20;
        confianca += 10;
        motivo.push('faixa_construida_tipica');
      }
    }

    // Relevância base por validação
    if (configuracao.validacao(resposta)) {
      relevancia += this.calcularRelevanciaNumero(numero, configuracao);
      confianca += 10;
      motivo.push('validacao_passou');
    }

    return {
      relevancia: Math.max(0, relevancia),
      confianca: Math.min(90, Math.max(10, confianca)),
      motivo: motivo.join(', ')
    };
  }

  /**
   * 🎯 Calcular confiança contextual
   */
  calcularConfiancaContextual(nomeCampo, chave, resposta, confiancaBase) {
    let ajuste = 0;
    const chaveNormalizada = chave.toLowerCase();
    const respostaNormalizada = resposta.toLowerCase();

    // Ajustes específicos por campo
    if (nomeCampo === 'area_terreno') {
      if (chaveNormalizada.includes('terreno') || chaveNormalizada.includes('lote')) {
        ajuste += 10;
      }
      if (/\d+\s*x\s*\d+/i.test(resposta)) {
        ajuste += 15; // Dimensões são muito indicativas de terreno
      }
      if (chaveNormalizada.includes('construi')) {
        ajuste -= 20; // Penalizar se parece área construída
      }
    }

    if (nomeCampo === 'area_construida') {
      if (chaveNormalizada.includes('construi') || chaveNormalizada.includes('edifica')) {
        ajuste += 10;
      }
      if (chaveNormalizada.includes('terreno')) {
        ajuste -= 20; // Penalizar se parece terreno
      }
      if (/\d+\s*x\s*\d+/i.test(resposta)) {
        ajuste -= 10; // Dimensões são menos prováveis para área construída
      }
    }

    return Math.min(95, Math.max(10, confiancaBase + ajuste));
  }

  /**
   * 📊 Calcular relevância de um número para um tipo específico
   */
  calcularRelevanciaNumero(numero, configuracao) {
    // Lógica específica por tipo de campo
    if (configuracao.unidade === 'm²') {
      // Para áreas, números entre 50-500 são mais relevantes
      if (numero >= 50 && numero <= 500) return 100;
      if (numero >= 20 && numero <= 1000) return 80;
      if (numero >= 10 && numero <= 2000) return 60;
      return 20;
    }

    return 50; // Relevância padrão
  }

  /**
   * ✨ Identificar características especiais
   */
  identificarCaracteristicas(respostas) {
    const caracteristicasEncontradas = [];
    const textoCompleto = JSON.stringify(respostas).toLowerCase();

    for (const [caracteristica, palavras] of Object.entries(this.caracteristicasEspeciais)) {
      for (const palavra of palavras) {
        if (textoCompleto.includes(palavra.toLowerCase())) {
          caracteristicasEncontradas.push(caracteristica);
          break;
        }
      }
    }

    console.log('✨ [SEMANTIC] Características especiais encontradas:', caracteristicasEncontradas);
    return caracteristicasEncontradas;
  }

  /**
   * 🔄 Processar valor de acordo com o tipo
   */
  processarValor(valor, configuracao) {
    switch (configuracao.tipo) {
      case 'numero':
        return this.extrairNumero(valor);
      case 'monetario':
        return this.extrairValorMonetario(valor);
      case 'tempo':
        return this.extrairTempo(valor);
      case 'categoria':
        return this.processarCategoria(valor, configuracao.opcoes);
      case 'texto':
      default:
        return typeof valor === 'string' ? valor.trim() : valor;
    }
  }

  /**
   * 🔢 Extrair número de um texto
   */
  extrairNumero(texto) {
    if (typeof texto !== 'string') return 0;

    // Primeiro, tentar número simples
    const numeroSimples = texto.trim();
    if (/^\d+$/.test(numeroSimples)) {
      return parseInt(numeroSimples);
    }

    // Calcular área de dimensões (ex: "15x30")
    const dimensoes = texto.match(/(\d+)\s*x\s*(\d+)/i);
    if (dimensoes) {
      return parseInt(dimensoes[1]) * parseInt(dimensoes[2]);
    }

    // Extrair qualquer número do texto
    const numeros = texto.match(/\d+(?:\.\d+)?/g);
    if (numeros) {
      return parseFloat(numeros[0]);
    }

    return 0;
  }

  /**
   * 💰 Extrair valor monetário
   */
  extrairValorMonetario(texto) {
    if (typeof texto !== 'string') return 0;

    // Remover formatação monetária brasileira
    const numeroLimpo = texto
      .replace(/r\$\s*/gi, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    const numero = parseFloat(numeroLimpo);
    return isNaN(numero) ? 0 : numero;
  }

  /**
   * ⏰ Extrair tempo
   */
  extrairTempo(texto) {
    if (typeof texto !== 'string') return texto;

    // Extrair número e unidade
    const match = texto.match(/(\d+)\s*(meses|dias|semanas|anos)/i);
    if (match) {
      const numero = parseInt(match[1]);
      const unidade = match[2].toLowerCase();
      
      // Converter tudo para dias
      switch (unidade) {
        case 'anos': return numero * 365;
        case 'meses': return numero * 30;
        case 'semanas': return numero * 7;
        case 'dias': return numero;
        default: return numero;
      }
    }

    return texto;
  }

  /**
   * 📂 Processar categoria
   */
  processarCategoria(valor, opcoes) {
    if (typeof valor !== 'string') return valor;

    const valorLower = valor.toLowerCase();
    
    // Buscar correspondência exata ou parcial
    for (const opcao of opcoes) {
      if (valorLower.includes(opcao.toLowerCase()) || opcao.toLowerCase().includes(valorLower)) {
        return opcao;
      }
    }

    return valor;
  }
}

module.exports = BriefingSemanticMapper;