/**
 * 💰 CALCULADOR ADAPTATIVO DE ORÇAMENTOS V3.0
 * 
 * Sistema completamente adaptativo que trabalha com dados disponíveis
 * e aplica fallbacks inteligentes para dados faltantes
 */

class OrcamentoCalculatorAdaptive {
  constructor() {
    // Tabela de valores por m² baseada no mercado brasileiro 2024/2025
    this.tabelaValoresPorM2 = {
      'RESIDENCIAL': {
        'simples': { min: 800, base: 1200, max: 1600 },
        'medio': { min: 1200, base: 1800, max: 2400 },
        'alto': { min: 2000, base: 2800, max: 3600 }
      },
      'COMERCIAL': {
        'simples': { min: 600, base: 1000, max: 1400 },
        'medio': { min: 1000, base: 1500, max: 2000 },
        'alto': { min: 1800, base: 2500, max: 3200 }
      },
      'INDUSTRIAL': {
        'simples': { min: 400, base: 800, max: 1200 },
        'medio': { min: 800, base: 1200, max: 1600 },
        'alto': { min: 1200, base: 1800, max: 2400 }
      },
      'INSTITUCIONAL': {
        'simples': { min: 700, base: 1100, max: 1500 },
        'medio': { min: 1100, base: 1600, max: 2100 },
        'alto': { min: 1600, base: 2200, max: 2800 }
      }
    };

    // Multiplicadores por região
    this.multiplicadoresRegionais = {
      'São Paulo': 1.2,
      'Rio de Janeiro': 1.15,
      'Brasília': 1.1,
      'Belo Horizonte': 1.0,
      'Porto Alegre': 1.05,
      'Curitiba': 1.0,
      'Salvador': 0.9,
      'Recife': 0.85,
      'Fortaleza': 0.8,
      'Goiânia': 0.9,
      'Brasil': 1.0 // Padrão nacional
    };

    // Valores por hora por disciplina (mercado brasileiro)
    this.valoresPorHora = {
      'arquitetura': { junior: 80, pleno: 120, senior: 180 },
      'estrutural': { junior: 90, pleno: 140, senior: 200 },
      'instalacoes_hidraulicas': { junior: 70, pleno: 110, senior: 160 },
      'instalacoes_eletricas': { junior: 75, pleno: 115, senior: 170 },
      'climatizacao': { junior: 85, pleno: 130, senior: 190 },
      'paisagismo': { junior: 60, pleno: 90, senior: 140 },
      'interiores': { junior: 70, pleno: 110, senior: 160 },
      'aprovacao_legal': { junior: 100, pleno: 150, senior: 220 },
      'modelagem_3d': { junior: 50, pleno: 80, senior: 120 }
    };

    // Horas estimadas por m² por disciplina
    this.horasPorM2 = {
      'arquitetura': { simples: 2.0, medio: 2.5, alto: 3.5 },
      'estrutural': { simples: 1.2, medio: 1.5, alto: 2.0 },
      'instalacoes_hidraulicas': { simples: 0.8, medio: 1.0, alto: 1.5 },
      'instalacoes_eletricas': { simples: 0.8, medio: 1.0, alto: 1.5 },
      'climatizacao': { simples: 0.5, medio: 0.8, alto: 1.2 },
      'paisagismo': { simples: 0.3, medio: 0.5, alto: 0.8 },
      'interiores': { simples: 1.0, medio: 1.5, alto: 2.5 },
      'aprovacao_legal': { simples: 0.2, medio: 0.3, alto: 0.5 },
      'modelagem_3d': { simples: 0.5, medio: 0.8, alto: 1.2 }
    };

    // Fallbacks inteligentes para dados faltantes
    this.fallbacks = {
      areaAtuacao: 'RESIDENCIAL',
      tipologia: 'UNIFAMILIAR',
      areaConstruida: 150,
      areaTerreno: null,
      padrao: 'medio',
      complexidade: 'media',
      localizacao: 'Brasil',
      disciplinasNecessarias: ['arquitetura', 'estrutural', 'instalacoes_hidraulicas', 'instalacoes_eletricas'],
      caracteristicasEspeciais: [],
      prazoEstimado: 60
    };
  }

  /**
   * 💰 Método principal para calcular orçamento adaptativamente
   */
  async calcularOrcamentoAdaptativo(dadosEstruturados) {
    console.log('💰 [CALCULATOR-ADAPTIVE] Iniciando cálculo adaptativo de orçamento');
    
    try {
      // 1. Aplicar fallbacks inteligentes para dados faltantes
      const dadosCompletos = this.aplicarFallbacks(dadosEstruturados);
      
      console.log('📊 [CALCULATOR-ADAPTIVE] Dados após fallbacks:', {
        tipologia: dadosCompletos.tipologia,
        areaConstruida: dadosCompletos.areaConstruida,
        areaTerreno: dadosCompletos.areaTerreno,
        padrao: dadosCompletos.padrao,
        localizacao: dadosCompletos.localizacao,
        disciplinas: dadosCompletos.disciplinasNecessarias?.length
      });

      // 2. Calcular valor base por m²
      const valorPorM2 = this.calcularValorPorM2Adaptativo(dadosCompletos);

      // 3. Calcular valor total base
      const valorTotalBase = dadosCompletos.areaConstruida * valorPorM2;

      // 4. Calcular detalhamento por disciplinas
      const disciplinasDetalhadas = this.calcularDisciplinasAdaptativo(dadosCompletos);

      // 5. Calcular composição financeira
      const composicaoFinanceira = this.calcularComposicaoFinanceira(disciplinasDetalhadas);

      // 6. Gerar cronograma adaptativo
      const cronograma = this.gerarCronogramaAdaptativo(valorTotalBase, dadosCompletos);

      // 7. Aplicar ajustes finais baseados em características
      const valorFinal = this.aplicarAjustesFinaisAdaptativos(valorTotalBase, dadosCompletos);

      // 8. Calcular confiança do cálculo
      const confiancaCalculo = this.calcularConfiancaCalculo(dadosEstruturados, dadosCompletos);

      return {
        // Valores principais
        valorTotal: Math.round(valorFinal),
        valorPorM2: Math.round(valorPorM2),
        areaConstruida: dadosCompletos.areaConstruida,
        areaTerreno: dadosCompletos.areaTerreno,

        // Classificações
        areaAtuacao: dadosCompletos.areaAtuacao,
        tipologia: dadosCompletos.tipologia,
        padrao: dadosCompletos.padrao,
        complexidade: dadosCompletos.complexidade,
        localizacao: dadosCompletos.localizacao,

        // Detalhamentos
        disciplinas: disciplinasDetalhadas,
        composicaoFinanceira: composicaoFinanceira,
        cronograma: cronograma,

        // Dados do briefing
        nome: `Orçamento Adaptativo V3 - ${dadosCompletos.nomeProjeto || 'Projeto'}`,
        descricao: `Orçamento gerado adaptativamente. Tipologia: ${dadosCompletos.tipologia}, Padrão: ${dadosCompletos.padrao}, Área: ${dadosCompletos.areaConstruida}m²`,
        clienteId: dadosCompletos.clienteId,
        clienteNome: dadosCompletos.clienteNome,
        responsavelId: dadosCompletos.responsavelId,
        prazoEntrega: dadosCompletos.prazoEstimado,

        // Metadados adaptativos
        metodologia: 'NBR_13532_V3_ADAPTATIVO',
        confiancaOriginal: dadosEstruturados.confianca || 0,
        confiancaCalculo: confiancaCalculo,
        confiancaFinal: Math.round((dadosEstruturados.confianca || 0 + confiancaCalculo) / 2),
        fallbacksAplicados: this.identificarFallbacksAplicados(dadosEstruturados, dadosCompletos),
        versaoCalculator: '3.0.0-adaptive',
        timestampCalculo: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ [CALCULATOR-ADAPTIVE] Erro no cálculo adaptativo:', error);
      throw new Error(`Erro no cálculo adaptativo: ${error.message}`);
    }
  }

  /**
   * 🔄 Aplicar fallbacks inteligentes para dados faltantes
   */
  aplicarFallbacks(dadosOriginais) {
    let dadosCompletos = { ...dadosOriginais };
    const fallbacksAplicados = [];

    // Aplicar fallbacks para cada campo essencial
    for (const [campo, valorFallback] of Object.entries(this.fallbacks)) {
      if (!dadosCompletos[campo] || dadosCompletos[campo] === null || dadosCompletos[campo] === undefined) {
        dadosCompletos[campo] = valorFallback;
        fallbacksAplicados.push(campo);
        console.log(`🔄 [CALCULATOR-ADAPTIVE] Fallback aplicado para ${campo}:`, valorFallback);
      }
    }

    // Fallbacks inteligentes baseados em contexto
    dadosCompletos = this.aplicarFallbacksInteligentes(dadosCompletos, fallbacksAplicados);

    if (fallbacksAplicados.length > 0) {
      console.log('🔄 [CALCULATOR-ADAPTIVE] Total de fallbacks aplicados:', fallbacksAplicados.length);
    }

    return dadosCompletos;
  }

  /**
   * 🧠 Aplicar fallbacks inteligentes baseados em contexto
   */
  aplicarFallbacksInteligentes(dados, fallbacksAplicados) {
    // Se área de atuação foi inferida, ajustar outros campos
    if (dados.areaAtuacao === 'RESIDENCIAL' && !dados.tipologia) {
      dados.tipologia = 'UNIFAMILIAR';
      fallbacksAplicados.push('tipologia_contextual');
    }

    // Se tem características especiais, ajustar padrão
    if (dados.caracteristicasEspeciais?.length > 3 && dados.padrao === 'simples') {
      dados.padrao = 'medio';
      fallbacksAplicados.push('padrao_por_caracteristicas');
    }

    // Se área construída é muito grande, ajustar complexidade
    if (dados.areaConstruida > 300 && dados.complexidade === 'simples') {
      dados.complexidade = 'media';
      fallbacksAplicados.push('complexidade_por_area');
    }

    // Adicionar disciplinas baseadas em características especiais
    if (dados.caracteristicasEspeciais?.includes('paisagismo') && 
        !dados.disciplinasNecessarias.includes('paisagismo')) {
      dados.disciplinasNecessarias.push('paisagismo');
      fallbacksAplicados.push('disciplina_paisagismo');
    }

    if (dados.caracteristicasEspeciais?.includes('home_theater') && 
        !dados.disciplinasNecessarias.includes('interiores')) {
      dados.disciplinasNecessarias.push('interiores');
      fallbacksAplicados.push('disciplina_interiores');
    }

    return dados;
  }

  /**
   * 💵 Calcular valor por m² adaptativamente
   */
  calcularValorPorM2Adaptativo(dados) {
    console.log('💵 [CALCULATOR-ADAPTIVE] Calculando valor/m² adaptativo...');

    // Obter tabela de valores base
    const tabelaArea = this.tabelaValoresPorM2[dados.areaAtuacao] || this.tabelaValoresPorM2['RESIDENCIAL'];
    const valorBase = tabelaArea[dados.padrao]?.base || tabelaArea['medio'].base;

    // Aplicar multiplicador regional
    const multiplicadorRegional = this.obterMultiplicadorRegional(dados.localizacao);

    // Aplicar ajuste por complexidade
    let multiplicadorComplexidade = 1.0;
    if (dados.complexidade === 'alta') multiplicadorComplexidade = 1.2;
    else if (dados.complexidade === 'simples') multiplicadorComplexidade = 0.9;

    // Aplicar ajuste por características especiais
    const multiplicadorCaracteristicas = 1 + (dados.caracteristicasEspeciais.length * 0.05);

    const valorFinal = valorBase * multiplicadorRegional * multiplicadorComplexidade * multiplicadorCaracteristicas;

    console.log('💵 [CALCULATOR-ADAPTIVE] Cálculo valor/m²:', {
      valorBase,
      multiplicadorRegional,
      multiplicadorComplexidade,
      multiplicadorCaracteristicas,
      valorFinal: Math.round(valorFinal)
    });

    return valorFinal;
  }

  /**
   * 🌍 Obter multiplicador regional (mantido igual)
   */
  obterMultiplicadorRegional(localizacao) {
    if (!localizacao) return 1.0;

    // Procurar por cidade específica
    for (const [cidade, multiplicador] of Object.entries(this.multiplicadoresRegionais)) {
      if (localizacao.toLowerCase().includes(cidade.toLowerCase())) {
        console.log('🌍 [CALCULATOR-ADAPTIVE] Multiplicador regional:', cidade, multiplicador);
        return multiplicador;
      }
    }

    // Padrão nacional
    return this.multiplicadoresRegionais['Brasil'];
  }

  /**
   * 🔧 Calcular disciplinas adaptativamente
   */
  calcularDisciplinasAdaptativo(dados) {
    const disciplinasDetalhadas = [];

    dados.disciplinasNecessarias.forEach(disciplina => {
      const horasPorM2 = this.horasPorM2[disciplina]?.[dados.padrao] || this.horasPorM2[disciplina]?.['medio'] || 1.0;
      const horasTotal = Math.round(dados.areaConstruida * horasPorM2);
      
      // Selecionar nível do profissional baseado na complexidade
      let nivelProfissional = 'pleno';
      if (dados.complexidade === 'alta') nivelProfissional = 'senior';
      else if (dados.complexidade === 'simples') nivelProfissional = 'junior';

      const valorHora = this.valoresPorHora[disciplina]?.[nivelProfissional] || 120;
      const valorTotal = horasTotal * valorHora;

      disciplinasDetalhadas.push({
        nome: this.obterNomeDisciplina(disciplina),
        codigo: disciplina,
        horasEstimadas: horasTotal,
        valorHora,
        valorTotal,
        nivelProfissional,
        percentualTotal: '0' // Será calculado depois
      });
    });

    // Calcular percentuais
    const valorTotalDisciplinas = disciplinasDetalhadas.reduce((sum, d) => sum + d.valorTotal, 0);
    disciplinasDetalhadas.forEach(disciplina => {
      disciplina.percentualTotal = ((disciplina.valorTotal / valorTotalDisciplinas) * 100).toFixed(1);
    });

    console.log('🔧 [CALCULATOR-ADAPTIVE] Disciplinas calculadas adaptativamente:', disciplinasDetalhadas.length);
    return disciplinasDetalhadas;
  }

  /**
   * 📊 Calcular composição financeira (mantido similar)
   */
  calcularComposicaoFinanceira(disciplinasDetalhadas) {
    const custosHoras = disciplinasDetalhadas.reduce((sum, d) => sum + d.valorTotal, 0);
    const custosIndiretos = Math.round(custosHoras * 0.15); // 15% custos indiretos
    const subtotal = custosHoras + custosIndiretos;
    const impostos = Math.round(subtotal * 0.08); // 8% impostos
    const margemLucro = Math.round(subtotal * 0.12); // 12% margem
    const total = subtotal + impostos + margemLucro;

    return {
      custosHoras,
      custosIndiretos,
      subtotal,
      impostos,
      margemLucro,
      total,
      disciplinasDetalhadas
    };
  }

  /**
   * 📅 Gerar cronograma adaptativo
   */
  gerarCronogramaAdaptativo(valorTotal, dados) {
    // Cronograma simplificado baseado na NBR 13532
    const fases = {
      'LV': { nome: 'Levantamento de Dados', percentual: 0.05, prazo: 1 },
      'PN': { nome: 'Programa de Necessidades', percentual: 0.05, prazo: 1 },
      'EV': { nome: 'Estudo de Viabilidade', percentual: 0.10, prazo: 2 },
      'EP': { nome: 'Estudo Preliminar', percentual: 0.15, prazo: 3 },
      'AP': { nome: 'Anteprojeto', percentual: 0.30, prazo: 6 },
      'PL': { nome: 'Projeto Legal', percentual: 0.15, prazo: 3 },
      'PB': { nome: 'Projeto Básico', percentual: 0.20, prazo: 4 },
      'PE': { nome: 'Projeto Executivo', percentual: 0.30, prazo: 6 }
    };

    const cronogramaDetalhado = {};
    let prazoTotal = 0;

    Object.entries(fases).forEach(([codigo, fase]) => {
      const valor = Math.round(valorTotal * fase.percentual);
      prazoTotal += fase.prazo;

      cronogramaDetalhado[codigo] = {
        codigo,
        nome: fase.nome,
        valor,
        prazo: fase.prazo,
        percentual: fase.percentual,
        ativa: true
      };
    });

    return {
      fases: cronogramaDetalhado,
      prazoTotal,
      valorTecnicoTotal: valorTotal,
      metodologia: 'NBR_13532_ADAPTATIVO'
    };
  }

  /**
   * ⚡ Aplicar ajustes finais adaptativos
   */
  aplicarAjustesFinaisAdaptativos(valorBase, dados) {
    let valorAjustado = valorBase;

    // Ajuste por características especiais
    const caracteristicas = dados.caracteristicasEspeciais || [];
    if (caracteristicas.includes('automacao')) valorAjustado *= 1.15;
    if (caracteristicas.includes('piscina')) valorAjustado *= 1.10;
    if (caracteristicas.includes('home_theater')) valorAjustado *= 1.08;

    // Ajuste por área (economia de escala)
    if (dados.areaConstruida > 500) valorAjustado *= 0.95;
    else if (dados.areaConstruida < 100) valorAjustado *= 1.05;

    console.log('⚡ [CALCULATOR-ADAPTIVE] Ajustes finais aplicados:', {
      valorBase: Math.round(valorBase),
      valorAjustado: Math.round(valorAjustado),
      ajuste: ((valorAjustado / valorBase - 1) * 100).toFixed(1) + '%'
    });

    return valorAjustado;
  }

  /**
   * 🎯 Calcular confiança do cálculo
   */
  calcularConfiancaCalculo(dadosOriginais, dadosCompletos) {
    let confianca = 100;

    // Reduzir confiança para cada fallback aplicado
    const fallbacks = this.identificarFallbacksAplicados(dadosOriginais, dadosCompletos);
    confianca -= fallbacks.length * 10;

    // Ajustar baseado na qualidade dos dados originais
    if (!dadosOriginais.areaConstruida) confianca -= 15;
    if (!dadosOriginais.localizacao || dadosOriginais.localizacao === 'Brasil') confianca -= 10;
    if (!dadosOriginais.areaTerreno) confianca -= 5;

    // Aumentar confiança se temos muitos dados
    const totalCampos = Object.keys(dadosOriginais).length;
    if (totalCampos > 15) confianca += 10;
    else if (totalCampos > 10) confianca += 5;

    return Math.max(30, Math.min(100, confianca)); // Entre 30% e 100%
  }

  /**
   * 🔍 Identificar fallbacks aplicados
   */
  identificarFallbacksAplicados(dadosOriginais, dadosCompletos) {
    const fallbacks = [];

    for (const campo of Object.keys(this.fallbacks)) {
      if (!dadosOriginais[campo] && dadosCompletos[campo]) {
        fallbacks.push(campo);
      }
    }

    return fallbacks;
  }

  /**
   * 📝 Obter nome da disciplina (mantido igual)
   */
  obterNomeDisciplina(codigo) {
    const nomes = {
      'arquitetura': 'Projeto Arquitetônico',
      'estrutural': 'Projeto Estrutural',
      'instalacoes_hidraulicas': 'Instalações Hidráulicas',
      'instalacoes_eletricas': 'Instalações Elétricas',
      'climatizacao': 'Climatização',
      'paisagismo': 'Paisagismo',
      'interiores': 'Design de Interiores',
      'aprovacao_legal': 'Aprovação Legal',
      'modelagem_3d': 'Modelagem 3D'
    };

    return nomes[codigo] || codigo;
  }
}

module.exports = OrcamentoCalculatorAdaptive;