/**
 * 💰 CALCULADOR INTELIGENTE DE ORÇAMENTOS
 * 
 * Sistema avançado para calcular orçamentos precisos baseado em dados reais
 * do briefing e padrões do mercado brasileiro AEC
 */

class OrcamentoCalculator {
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
  }

  /**
   * 💰 Método principal para calcular orçamento avançado
   */
  async calcularOrcamentoAvancado(dadosEstruturados) {
    console.log('💰 [CALCULATOR] Iniciando cálculo avançado de orçamento');
    console.log('📊 [CALCULATOR] Dados recebidos:', {
      tipologia: dadosEstruturados.tipologia,
      areaConstruida: dadosEstruturados.areaConstruida,
      padrao: dadosEstruturados.padrao,
      disciplinas: dadosEstruturados.disciplinasNecessarias?.length
    });

    try {
      // 1. Calcular valor base por m²
      const valorPorM2 = this.calcularValorPorM2(
        dadosEstruturados.areaAtuacao,
        dadosEstruturados.padrao,
        dadosEstruturados.localizacao,
        dadosEstruturados.complexidade
      );

      // 2. Calcular valor total base
      const valorTotalBase = dadosEstruturados.areaConstruida * valorPorM2;

      // 3. Calcular detalhamento por disciplinas
      const disciplinasDetalhadas = this.calcularDisciplinas(
        dadosEstruturados.disciplinasNecessarias,
        dadosEstruturados.areaConstruida,
        dadosEstruturados.padrao,
        dadosEstruturados.complexidade
      );

      // 4. Calcular composição financeira
      const composicaoFinanceira = this.calcularComposicaoFinanceira(
        valorTotalBase,
        disciplinasDetalhadas
      );

      // 5. Gerar cronograma
      const cronograma = this.gerarCronograma(
        valorTotalBase,
        dadosEstruturados.disciplinasNecessarias,
        dadosEstruturados.prazoEstimado
      );

      // 6. Calcular valor final com ajustes
      const valorFinal = this.aplicarAjustesFinais(
        valorTotalBase,
        dadosEstruturados.caracteristicasEspeciais,
        dadosEstruturados.complexidade
      );

      const resultado = {
        // Valores principais
        valorTotal: Math.round(valorFinal),
        valorPorM2: Math.round(valorPorM2),
        areaConstruida: dadosEstruturados.areaConstruida,
        areaTerreno: dadosEstruturados.areaTerreno,

        // Classificações
        areaAtuacao: dadosEstruturados.areaAtuacao,
        tipologia: dadosEstruturados.tipologia,
        padrao: dadosEstruturados.padrao,
        complexidade: dadosEstruturados.complexidade,
        localizacao: dadosEstruturados.localizacao,

        // Detalhamentos
        disciplinas: disciplinasDetalhadas,
        composicaoFinanceira,
        cronograma,

        // Dados do briefing
        nome: `Orçamento Inteligente V2 - ${dadosEstruturados.nomeProjeto}`,
        descricao: `Orçamento gerado automaticamente baseado no briefing. Tipologia: ${dadosEstruturados.tipologia}, Padrão: ${dadosEstruturados.padrao}, Área: ${dadosEstruturados.areaConstruida}m²`,
        clienteId: dadosEstruturados.clienteId,
        clienteNome: dadosEstruturados.clienteNome,
        responsavelId: dadosEstruturados.responsavelId,
        prazoEntrega: dadosEstruturados.prazoEstimado,

        // Metadados
        metodologia: 'NBR_13532_V2_INTELIGENTE',
        confianca: dadosEstruturados.confianca,
        versaoCalculator: '2.0.0',
        timestampCalculo: new Date().toISOString(),
        dadosExtraidos: dadosEstruturados
      };

      console.log('✅ [CALCULATOR] Cálculo concluído:', {
        valorTotal: resultado.valorTotal,
        valorPorM2: resultado.valorPorM2,
        disciplinas: resultado.disciplinas.length,
        confianca: resultado.confianca
      });

      return resultado;

    } catch (error) {
      console.error('❌ [CALCULATOR] Erro no cálculo:', error);
      throw new Error(`Erro no cálculo do orçamento: ${error.message}`);
    }
  }

  /**
   * 📊 Calcular valor por m² baseado em área de atuação e padrão
   */
  calcularValorPorM2(areaAtuacao, padrao, localizacao, complexidade) {
    // Usar área de atuação para determinar a tabela de preços
    const tabelaAtuacao = this.tabelaValoresPorM2[areaAtuacao] || this.tabelaValoresPorM2['RESIDENCIAL'];
    const valorBase = tabelaAtuacao[padrao]?.base || tabelaAtuacao['medio'].base;

    // Aplicar multiplicador regional
    const multiplicadorRegional = this.obterMultiplicadorRegional(localizacao);
    let valorAjustado = valorBase * multiplicadorRegional;

    // Aplicar ajuste por complexidade
    if (complexidade === 'alta') {
      valorAjustado *= 1.15;
    } else if (complexidade === 'simples') {
      valorAjustado *= 0.9;
    }

    console.log('📊 [CALCULATOR] Cálculo valor/m²:', {
      areaAtuacao,
      padrao,
      valorBase,
      multiplicadorRegional,
      complexidade,
      valorFinal: Math.round(valorAjustado)
    });

    return valorAjustado;
  }

  /**
   * 🌍 Obter multiplicador regional
   */
  obterMultiplicadorRegional(localizacao) {
    if (!localizacao) return 1.0;

    // Procurar por cidade específica
    for (const [cidade, multiplicador] of Object.entries(this.multiplicadoresRegionais)) {
      if (localizacao.toLowerCase().includes(cidade.toLowerCase())) {
        console.log('🌍 [CALCULATOR] Multiplicador regional:', cidade, multiplicador);
        return multiplicador;
      }
    }

    // Padrão nacional
    return this.multiplicadoresRegionais['Brasil'];
  }

  /**
   * 🔧 Calcular detalhamento por disciplinas
   */
  calcularDisciplinas(disciplinasNecessarias, areaConstruida, padrao, complexidade) {
    const disciplinasDetalhadas = [];

    disciplinasNecessarias.forEach(disciplina => {
      const horasPorM2 = this.horasPorM2[disciplina]?.[padrao] || this.horasPorM2[disciplina]?.['medio'] || 1.0;
      const horasTotal = Math.round(areaConstruida * horasPorM2);
      
      // Selecionar nível do profissional baseado na complexidade
      let nivelProfissional = 'pleno';
      if (complexidade === 'alta') nivelProfissional = 'senior';
      else if (complexidade === 'simples') nivelProfissional = 'junior';

      const valorHora = this.valoresPorHora[disciplina]?.[nivelProfissional] || 120;
      const valorTotal = horasTotal * valorHora;

      disciplinasDetalhadas.push({
        nome: this.obterNomeDisciplina(disciplina),
        codigo: disciplina,
        horasEstimadas: horasTotal,
        valorHora,
        valorTotal,
        nivelProfissional,
        percentualTotal: 0 // Será calculado depois
      });
    });

    // Calcular percentuais
    const valorTotalDisciplinas = disciplinasDetalhadas.reduce((sum, disc) => sum + disc.valorTotal, 0);
    disciplinasDetalhadas.forEach(disc => {
      disc.percentualTotal = ((disc.valorTotal / valorTotalDisciplinas) * 100).toFixed(1);
    });

    console.log('🔧 [CALCULATOR] Disciplinas calculadas:', disciplinasDetalhadas.length);
    return disciplinasDetalhadas;
  }

  /**
   * 📋 Obter nome amigável da disciplina
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

  /**
   * 💼 Calcular composição financeira
   */
  calcularComposicaoFinanceira(valorTotalBase, disciplinasDetalhadas) {
    const valorTotalDisciplinas = disciplinasDetalhadas.reduce((sum, disc) => sum + disc.valorTotal, 0);
    
    const composicao = {
      custosHoras: Math.round(valorTotalDisciplinas),
      custosIndiretos: Math.round(valorTotalBase * 0.15), // 15% custos indiretos
      impostos: Math.round(valorTotalBase * 0.08), // 8% impostos
      margemLucro: Math.round(valorTotalBase * 0.12), // 12% margem
      
      // Detalhamento por disciplina
      disciplinasDetalhadas,
      
      // Totais
      subtotal: Math.round(valorTotalDisciplinas + (valorTotalBase * 0.15)),
      total: Math.round(valorTotalBase)
    };

    console.log('💼 [CALCULATOR] Composição financeira calculada');
    return composicao;
  }

  /**
   * 📅 Gerar cronograma baseado em NBR 13532
   */
  gerarCronograma(valorTotal, disciplinas, prazoEstimado) {
    const { gerarCronogramaCompleto } = require('./cronogramaCompleto');
    
    try {
      const cronograma = gerarCronogramaCompleto(valorTotal, disciplinas);
      console.log('📅 [CALCULATOR] Cronograma gerado com', Object.keys(cronograma.fases).length, 'fases');
      return cronograma;
    } catch (error) {
      console.error('❌ [CALCULATOR] Erro ao gerar cronograma:', error);
      return this.gerarCronogramaSimplificado(valorTotal, prazoEstimado);
    }
  }

  /**
   * 📅 Gerar cronograma simplificado (fallback)
   */
  gerarCronogramaSimplificado(valorTotal, prazoEstimado) {
    return {
      prazoTotal: prazoEstimado,
      metodologia: 'SIMPLIFICADO',
      fases: {
        'estudo_preliminar': {
          nome: 'Estudo Preliminar',
          prazo: Math.round(prazoEstimado * 0.3),
          valor: Math.round(valorTotal * 0.3),
          percentual: 30
        },
        'anteprojeto': {
          nome: 'Anteprojeto',
          prazo: Math.round(prazoEstimado * 0.4),
          valor: Math.round(valorTotal * 0.4),
          percentual: 40
        },
        'projeto_executivo': {
          nome: 'Projeto Executivo',
          prazo: Math.round(prazoEstimado * 0.3),
          valor: Math.round(valorTotal * 0.3),
          percentual: 30
        }
      }
    };
  }

  /**
   * ⚡ Aplicar ajustes finais baseados em características especiais
   */
  aplicarAjustesFinais(valorBase, caracteristicasEspeciais, complexidade) {
    let valorFinal = valorBase;
    let multiplicadorCaracteristicas = 1.0;

    // Ajustes por características especiais
    if (caracteristicasEspeciais && caracteristicasEspeciais.length > 0) {
      const caracteristicasComplexas = ['automação', 'elevador', 'piscina', 'home theater'];
      const caracteristicasEncontradas = caracteristicasEspeciais.filter(c => 
        caracteristicasComplexas.includes(c)
      );
      
      if (caracteristicasEncontradas.length > 0) {
        multiplicadorCaracteristicas += (caracteristicasEncontradas.length * 0.05);
      }
    }

    // Ajuste final por complexidade
    if (complexidade === 'alta') {
      multiplicadorCaracteristicas += 0.1;
    }

    valorFinal = valorBase * multiplicadorCaracteristicas;

    console.log('⚡ [CALCULATOR] Ajustes finais:', {
      valorBase: Math.round(valorBase),
      multiplicadorCaracteristicas,
      valorFinal: Math.round(valorFinal)
    });

    return valorFinal;
  }

  /**
   * 🔧 Carregar configurações personalizadas do escritório
   */
  async carregarConfiguracoesPrecificacao(escritorioId) {
    // TODO: Implementar carregamento de configurações personalizadas
    // Por enquanto, usar valores padrão
    console.log('🔧 [CALCULATOR] Usando configurações padrão para escritório:', escritorioId);
  }
}

module.exports = OrcamentoCalculator;