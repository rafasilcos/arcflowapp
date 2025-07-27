/**
 * ✅ VALIDADOR E AUDITOR DE ORÇAMENTOS V2.0
 * 
 * Sistema de validação inteligente que garante qualidade e precisão dos orçamentos
 * Inclui benchmarking automático e análise de consistência
 */

const { getClient } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class OrcamentoValidator {
  constructor() {
    // Faixas de valores por m² por tipologia (dados de mercado 2024)
    this.faixasValorM2 = {
      'RESIDENCIAL': {
        'unifamiliar': { min: 800, max: 3500, medio: 1800 },
        'multifamiliar': { min: 1000, max: 4000, medio: 2200 },
        'conjunto': { min: 900, max: 3200, medio: 1900 }
      },
      'COMERCIAL': {
        'escritorio': { min: 1200, max: 4500, medio: 2500 },
        'loja': { min: 800, max: 3000, medio: 1600 },
        'hotel': { min: 2000, max: 8000, medio: 4500 },
        'restaurante': { min: 1500, max: 5000, medio: 2800 }
      },
      'INDUSTRIAL': {
        'fabrica': { min: 1000, max: 4000, medio: 2200 },
        'galpao': { min: 600, max: 2500, medio: 1200 },
        'logistica': { min: 800, max: 3000, medio: 1600 }
      },
      'INSTITUCIONAL': {
        'educacional': { min: 1500, max: 5000, medio: 2800 },
        'saude': { min: 2500, max: 8000, medio: 4800 },
        'religioso': { min: 1000, max: 3500, medio: 1800 }
      }
    };
    
    // Prazos típicos por área (em semanas)
    this.prazosTypicos = {
      'ate_100m2': { min: 8, max: 16, medio: 12 },
      'ate_300m2': { min: 12, max: 24, medio: 18 },
      'ate_500m2': { min: 16, max: 32, medio: 24 },
      'ate_1000m2': { min: 24, max: 48, medio: 36 },
      'acima_1000m2': { min: 36, max: 72, medio: 54 }
    };
    
    // Alertas de validação
    this.alertas = [];
    this.ajustes = [];
  }

  /**
   * ✅ MÉTODO PRINCIPAL - Validar e ajustar orçamento
   */
  async validarEAjustar(orcamentoCalculado) {
    console.log('✅ [VALIDATOR-V2] Iniciando validação do orçamento:', {
      valorTotal: orcamentoCalculado.valorTotal,
      valorPorM2: orcamentoCalculado.valorPorM2,
      tipologia: orcamentoCalculado.tipologia
    });
    
    try {
      const inicioValidacao = Date.now();
      this.alertas = [];
      this.ajustes = [];
      
      // ETAPA 1: Validações de sanidade básica
      this.validarSanidadeBasica(orcamentoCalculado);
      
      // ETAPA 2: Validar valor por m²
      this.validarValorPorM2(orcamentoCalculado);
      
      // ETAPA 3: Validar prazo
      this.validarPrazo(orcamentoCalculado);
      
      // ETAPA 4: Validar composição financeira
      this.validarComposicaoFinanceira(orcamentoCalculado);
      
      // ETAPA 5: Benchmarking com projetos similares
      const benchmarking = await this.aplicarBenchmarking(orcamentoCalculado);
      
      // ETAPA 6: Análise de consistência
      const analiseConsistencia = this.analisarConsistencia(orcamentoCalculado);
      
      // ETAPA 7: Aplicar ajustes se necessário
      const orcamentoAjustado = this.aplicarAjustes(orcamentoCalculado);
      
      // ETAPA 8: Calcular confiança final
      const confianca = this.calcularConfiancaFinal(orcamentoAjustado, benchmarking);
      
      const tempoValidacao = Date.now() - inicioValidacao;
      
      const resultado = {
        ...orcamentoAjustado,
        
        // Dados de validação
        confianca,
        benchmarking,
        analiseConsistencia,
        
        // Auditoria
        validacoes: {
          alertas: this.alertas,
          ajustes: this.ajustes,
          tempoValidacao: `${tempoValidacao}ms`,
          dataValidacao: new Date().toISOString()
        },
        
        // Análise de riscos
        analiseRiscos: this.gerarAnaliseRiscos(orcamentoAjustado, benchmarking),
        
        // Recomendações
        recomendacoes: this.gerarRecomendacoes(orcamentoAjustado, benchmarking)
      };
      
      console.log('✅ [VALIDATOR-V2] Validação concluída:', {
        confianca: `${(confianca * 100).toFixed(1)}%`,
        alertas: this.alertas.length,
        ajustes: this.ajustes.length,
        benchmarking: benchmarking.posicionamento,
        tempoValidacao: `${tempoValidacao}ms`
      });
      
      return resultado;
      
    } catch (error) {
      console.error('❌ [VALIDATOR-V2] Erro na validação:', error);
      throw new AppError(
        'Erro na validação do orçamento',
        500,
        'ORCAMENTO_VALIDATION_ERROR'
      );
    }
  }

  /**
   * 🔍 Validar sanidade básica
   */
  validarSanidadeBasica(orcamento) {
    // Valor total
    if (!orcamento.valorTotal || orcamento.valorTotal <= 0) {
      throw new AppError('Valor total inválido', 400, 'INVALID_TOTAL_VALUE');
    }
    
    if (orcamento.valorTotal > 50000000) { // R$ 50 milhões
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'VALOR_ALTO',
        mensagem: 'Valor total muito alto para o tipo de projeto',
        valor: orcamento.valorTotal
      });
    }
    
    // Área construída
    if (!orcamento.areaConstruida || orcamento.areaConstruida <= 0) {
      throw new AppError('Área construída inválida', 400, 'INVALID_AREA');
    }
    
    if (orcamento.areaConstruida > 50000) { // 50.000 m²
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'AREA_ALTA',
        mensagem: 'Área construída muito alta',
        valor: orcamento.areaConstruida
      });
    }
    
    // Prazo
    if (!orcamento.prazoEntrega || orcamento.prazoEntrega <= 0) {
      this.alertas.push({
        tipo: 'ERROR',
        categoria: 'PRAZO_INVALIDO',
        mensagem: 'Prazo de entrega inválido',
        valor: orcamento.prazoEntrega
      });
    }
  }

  /**
   * 💰 Validar valor por m²
   */
  validarValorPorM2(orcamento) {
    const faixa = this.faixasValorM2[orcamento.tipologia]?.[orcamento.subtipo];
    
    if (!faixa) {
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'FAIXA_NAO_ENCONTRADA',
        mensagem: `Faixa de valores não encontrada para ${orcamento.tipologia}/${orcamento.subtipo}`
      });
      return;
    }
    
    const valorPorM2 = orcamento.valorPorM2;
    
    // Verificar se está dentro da faixa
    if (valorPorM2 < faixa.min) {
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'VALOR_BAIXO',
        mensagem: `Valor por m² abaixo do mínimo de mercado`,
        valorCalculado: valorPorM2,
        valorMinimo: faixa.min,
        diferenca: faixa.min - valorPorM2
      });
      
      // Sugerir ajuste
      this.ajustes.push({
        tipo: 'VALOR_AJUSTE',
        descricao: 'Ajustar valor para faixa mínima de mercado',
        valorOriginal: orcamento.valorTotal,
        valorSugerido: Math.round(faixa.min * orcamento.areaConstruida),
        justificativa: 'Valor abaixo do praticado no mercado'
      });
    }
    
    if (valorPorM2 > faixa.max) {
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'VALOR_ALTO',
        mensagem: `Valor por m² acima do máximo de mercado`,
        valorCalculado: valorPorM2,
        valorMaximo: faixa.max,
        diferenca: valorPorM2 - faixa.max
      });
    }
    
    // Calcular desvio do valor médio
    const desvioPercentual = Math.abs((valorPorM2 - faixa.medio) / faixa.medio) * 100;
    
    if (desvioPercentual > 30) {
      this.alertas.push({
        tipo: 'INFO',
        categoria: 'DESVIO_MEDIO',
        mensagem: `Valor com desvio significativo da média de mercado`,
        valorCalculado: valorPorM2,
        valorMedio: faixa.medio,
        desvioPercentual: desvioPercentual.toFixed(1)
      });
    }
  }

  /**
   * ⏰ Validar prazo
   */
  validarPrazo(orcamento) {
    let faixaPrazo;
    
    // Determinar faixa de prazo baseada na área
    if (orcamento.areaConstruida <= 100) {
      faixaPrazo = this.prazosTypicos.ate_100m2;
    } else if (orcamento.areaConstruida <= 300) {
      faixaPrazo = this.prazosTypicos.ate_300m2;
    } else if (orcamento.areaConstruida <= 500) {
      faixaPrazo = this.prazosTypicos.ate_500m2;
    } else if (orcamento.areaConstruida <= 1000) {
      faixaPrazo = this.prazosTypicos.ate_1000m2;
    } else {
      faixaPrazo = this.prazosTypicos.acima_1000m2;
    }
    
    const prazo = orcamento.prazoEntrega;
    
    if (prazo < faixaPrazo.min) {
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'PRAZO_OTIMISTA',
        mensagem: 'Prazo pode ser muito otimista para o escopo',
        prazoCalculado: prazo,
        prazoMinimo: faixaPrazo.min,
        area: orcamento.areaConstruida
      });
    }
    
    if (prazo > faixaPrazo.max) {
      this.alertas.push({
        tipo: 'INFO',
        categoria: 'PRAZO_CONSERVADOR',
        mensagem: 'Prazo conservador, pode ser otimizado',
        prazoCalculado: prazo,
        prazoMaximo: faixaPrazo.max,
        area: orcamento.areaConstruida
      });
    }
  }

  /**
   * 💼 Validar composição financeira
   */
  validarComposicaoFinanceira(orcamento) {
    const comp = orcamento.composicaoFinanceira;
    
    // Verificar se a soma está correta
    const somaCalculada = comp.custoTecnico + comp.custosIndiretos + comp.impostos + comp.contingencia + comp.lucro;
    const diferenca = Math.abs(somaCalculada - comp.valorFinal);
    
    if (diferenca > 1) { // Tolerância de R$ 1
      this.alertas.push({
        tipo: 'ERROR',
        categoria: 'COMPOSICAO_INCORRETA',
        mensagem: 'Erro na soma da composição financeira',
        somaCalculada,
        valorFinal: comp.valorFinal,
        diferenca
      });
    }
    
    // Verificar percentuais
    const percentualLucro = comp.lucro / comp.custoTecnico;
    if (percentualLucro > 0.4) { // Mais de 40%
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'LUCRO_ALTO',
        mensagem: 'Margem de lucro muito alta',
        percentual: (percentualLucro * 100).toFixed(1)
      });
    }
    
    if (percentualLucro < 0.1) { // Menos de 10%
      this.alertas.push({
        tipo: 'WARNING',
        categoria: 'LUCRO_BAIXO',
        mensagem: 'Margem de lucro muito baixa',
        percentual: (percentualLucro * 100).toFixed(1)
      });
    }
  }

  /**
   * 📊 Aplicar benchmarking com projetos similares
   */
  async aplicarBenchmarking(orcamento) {
    try {
      const client = getClient();
      
      // Buscar projetos similares dos últimos 12 meses
      const result = await client.query(`
        SELECT 
          valor_total,
          valor_por_m2,
          area_construida,
          tipologia,
          padrao,
          complexidade,
          created_at
        FROM orcamentos 
        WHERE tipologia = $1 
          AND area_construida BETWEEN $2 AND $3
          AND created_at > NOW() - INTERVAL '12 months'
          AND deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 20
      `, [
        orcamento.tipologia,
        orcamento.areaConstruida * 0.7, // -30%
        orcamento.areaConstruida * 1.3  // +30%
      ]);
      
      if (result.rows.length === 0) {
        return {
          encontrados: 0,
          valorMedio: null,
          posicionamento: 'SEM_DADOS',
          confianca: 0.5,
          observacao: 'Não há projetos similares para comparação'
        };
      }
      
      // Calcular estatísticas
      const valores = result.rows.map(row => row.valor_por_m2);
      const valorMedio = valores.reduce((a, b) => a + b, 0) / valores.length;
      const valorMinimo = Math.min(...valores);
      const valorMaximo = Math.max(...valores);
      
      // Determinar posicionamento
      let posicionamento = 'MEDIO';
      const valorAtual = orcamento.valorPorM2;
      
      if (valorAtual < valorMedio * 0.9) {
        posicionamento = 'COMPETITIVO';
      } else if (valorAtual > valorMedio * 1.1) {
        posicionamento = 'PREMIUM';
      }
      
      // Calcular confiança baseada na quantidade de amostras
      const confianca = Math.min(result.rows.length / 10, 1); // Máximo 1.0 com 10+ amostras
      
      return {
        encontrados: result.rows.length,
        valorMedio: Math.round(valorMedio),
        valorMinimo: Math.round(valorMinimo),
        valorMaximo: Math.round(valorMaximo),
        valorAtual: valorAtual,
        posicionamento,
        confianca,
        desvioPercentual: ((valorAtual - valorMedio) / valorMedio * 100).toFixed(1),
        fonteReferencia: 'Projetos similares dos últimos 12 meses',
        dataAnalise: new Date().toISOString()
      };
      
    } catch (error) {
      console.warn('⚠️ [VALIDATOR-V2] Erro no benchmarking:', error.message);
      
      // Fallback para dados estáticos
      const faixa = this.faixasValorM2[orcamento.tipologia]?.[orcamento.subtipo];
      if (faixa) {
        return {
          encontrados: 0,
          valorMedio: faixa.medio,
          valorMinimo: faixa.min,
          valorMaximo: faixa.max,
          valorAtual: orcamento.valorPorM2,
          posicionamento: 'MEDIO',
          confianca: 0.7,
          fonteReferencia: 'Dados de mercado 2024',
          observacao: 'Baseado em dados estatísticos de mercado'
        };
      }
      
      return {
        encontrados: 0,
        valorMedio: null,
        posicionamento: 'SEM_DADOS',
        confianca: 0.3,
        erro: 'Erro ao acessar dados de benchmarking'
      };
    }
  }

  /**
   * 🔍 Analisar consistência
   */
  analisarConsistencia(orcamento) {
    const inconsistencias = [];
    
    // Verificar relação área construída vs terreno
    if (orcamento.areaTerreno && orcamento.areaConstruida > orcamento.areaTerreno) {
      inconsistencias.push({
        tipo: 'AREA_INCONSISTENTE',
        mensagem: 'Área construída maior que área do terreno',
        areaConstruida: orcamento.areaConstruida,
        areaTerreno: orcamento.areaTerreno
      });
    }
    
    // Verificar coerência entre complexidade e valor
    const valorPorM2 = orcamento.valorPorM2;
    const complexidade = orcamento.complexidade;
    
    if (complexidade === 'BAIXA' && valorPorM2 > 2000) {
      inconsistencias.push({
        tipo: 'COMPLEXIDADE_VALOR',
        mensagem: 'Valor alto para complexidade baixa',
        complexidade,
        valorPorM2
      });
    }
    
    if (complexidade === 'MUITO_ALTA' && valorPorM2 < 1500) {
      inconsistencias.push({
        tipo: 'COMPLEXIDADE_VALOR',
        mensagem: 'Valor baixo para complexidade muito alta',
        complexidade,
        valorPorM2
      });
    }
    
    // Verificar disciplinas vs tipologia
    const disciplinas = orcamento.disciplinas || [];
    if (orcamento.tipologia === 'COMERCIAL' && !disciplinas.includes('AVAC')) {
      inconsistencias.push({
        tipo: 'DISCIPLINA_FALTANTE',
        mensagem: 'Projeto comercial sem AVAC pode estar incompleto',
        tipologia: orcamento.tipologia,
        disciplinas
      });
    }
    
    return {
      consistente: inconsistencias.length === 0,
      inconsistencias,
      score: Math.max(0, 1 - (inconsistencias.length * 0.2)) // Reduz 20% por inconsistência
    };
  }

  /**
   * 🔧 Aplicar ajustes
   */
  aplicarAjustes(orcamento) {
    let orcamentoAjustado = { ...orcamento };
    
    // Aplicar ajustes sugeridos
    for (const ajuste of this.ajustes) {
      if (ajuste.tipo === 'VALOR_AJUSTE') {
        // Aplicar apenas se a diferença for significativa (>20%)
        const diferencaPercentual = Math.abs(ajuste.valorSugerido - ajuste.valorOriginal) / ajuste.valorOriginal;
        
        if (diferencaPercentual > 0.2) {
          console.log('⚠️ [VALIDATOR-V2] Ajuste significativo detectado, mantendo valor original');
          continue;
        }
        
        orcamentoAjustado.valorTotal = ajuste.valorSugerido;
        orcamentoAjustado.valorPorM2 = Math.round(ajuste.valorSugerido / orcamento.areaConstruida);
        
        console.log('🔧 [VALIDATOR-V2] Ajuste aplicado:', {
          valorOriginal: ajuste.valorOriginal,
          valorAjustado: ajuste.valorSugerido,
          justificativa: ajuste.justificativa
        });
      }
    }
    
    return orcamentoAjustado;
  }

  /**
   * 🎯 Calcular confiança final
   */
  calcularConfiancaFinal(orcamento, benchmarking) {
    let score = 0;
    let total = 0;
    
    // Confiança do benchmarking (30%)
    score += benchmarking.confianca * 0.3;
    total += 0.3;
    
    // Consistência dos dados (25%)
    const analiseConsistencia = this.analisarConsistencia(orcamento);
    score += analiseConsistencia.score * 0.25;
    total += 0.25;
    
    // Qualidade dos dados de entrada (20%)
    let qualidadeDados = 0.8; // Base
    if (orcamento.dadosExtraidos?.confiancaAnalise) {
      qualidadeDados = orcamento.dadosExtraidos.confiancaAnalise;
    }
    score += qualidadeDados * 0.2;
    total += 0.2;
    
    // Número de alertas (15%)
    const alertasGraves = this.alertas.filter(a => a.tipo === 'ERROR').length;
    const alertasWarning = this.alertas.filter(a => a.tipo === 'WARNING').length;
    const penalidade = (alertasGraves * 0.3) + (alertasWarning * 0.1);
    const scoreAlertas = Math.max(0, 1 - penalidade);
    score += scoreAlertas * 0.15;
    total += 0.15;
    
    // Completude das disciplinas (10%)
    const disciplinasEsperadas = this.getDisciplinasEsperadas(orcamento.tipologia);
    const completude = orcamento.disciplinas?.length / disciplinasEsperadas.length || 0.5;
    score += Math.min(completude, 1) * 0.1;
    total += 0.1;
    
    return total > 0 ? Math.round((score / total) * 100) / 100 : 0.5;
  }

  /**
   * 🏗️ Obter disciplinas esperadas por tipologia
   */
  getDisciplinasEsperadas(tipologia) {
    const disciplinasBase = {
      'RESIDENCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'COMERCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC'],
      'INDUSTRIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'INSTALACOES_ESPECIAIS'],
      'INSTITUCIONAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC', 'SEGURANCA']
    };
    
    return disciplinasBase[tipologia] || disciplinasBase['RESIDENCIAL'];
  }

  /**
   * ⚠️ Gerar análise de riscos
   */
  gerarAnaliseRiscos(orcamento, benchmarking) {
    const riscos = [];
    
    // Risco de valor
    if (benchmarking.posicionamento === 'PREMIUM') {
      riscos.push({
        categoria: 'COMERCIAL',
        nivel: 'MEDIO',
        descricao: 'Valor acima da média de mercado pode afetar competitividade',
        impacto: 'Dificuldade de aprovação pelo cliente',
        mitigacao: 'Justificar valor com diferenciais técnicos'
      });
    }
    
    // Risco de prazo
    const alertasPrazo = this.alertas.filter(a => a.categoria === 'PRAZO_OTIMISTA');
    if (alertasPrazo.length > 0) {
      riscos.push({
        categoria: 'CRONOGRAMA',
        nivel: 'ALTO',
        descricao: 'Prazo pode ser insuficiente para o escopo',
        impacto: 'Atraso na entrega e custos adicionais',
        mitigacao: 'Revisar cronograma com margens de segurança'
      });
    }
    
    // Risco de complexidade
    if (orcamento.complexidade === 'MUITO_ALTA') {
      riscos.push({
        categoria: 'TECNICO',
        nivel: 'MEDIO',
        descricao: 'Projeto de alta complexidade requer expertise especializada',
        impacto: 'Necessidade de consultores externos',
        mitigacao: 'Incluir especialistas na equipe desde o início'
      });
    }
    
    return {
      riscos,
      nivelGeral: this.calcularNivelRiscoGeral(riscos),
      recomendacoes: this.gerarRecomendacoesRisco(riscos)
    };
  }

  /**
   * 📋 Gerar recomendações
   */
  gerarRecomendacoes(orcamento, benchmarking) {
    const recomendacoes = [];
    
    // Recomendações baseadas no benchmarking
    if (benchmarking.posicionamento === 'COMPETITIVO') {
      recomendacoes.push({
        categoria: 'COMERCIAL',
        prioridade: 'ALTA',
        titulo: 'Oportunidade de Reposicionamento',
        descricao: 'Valor competitivo permite margem para melhorias ou maior lucro',
        acao: 'Considerar adicionar serviços complementares ou aumentar margem'
      });
    }
    
    // Recomendações baseadas em alertas
    const alertasValor = this.alertas.filter(a => a.categoria === 'VALOR_BAIXO');
    if (alertasValor.length > 0) {
      recomendacoes.push({
        categoria: 'FINANCEIRO',
        prioridade: 'MEDIA',
        titulo: 'Revisar Precificação',
        descricao: 'Valor abaixo da média de mercado',
        acao: 'Verificar se todos os custos foram considerados adequadamente'
      });
    }
    
    // Recomendações de melhoria
    if (orcamento.disciplinas?.length < 4) {
      recomendacoes.push({
        categoria: 'TECNICO',
        prioridade: 'MEDIA',
        titulo: 'Ampliar Escopo Técnico',
        descricao: 'Projeto pode se beneficiar de disciplinas adicionais',
        acao: 'Considerar incluir paisagismo, design de interiores ou consultoria especializada'
      });
    }
    
    return recomendacoes;
  }

  /**
   * 📊 Calcular nível de risco geral
   */
  calcularNivelRiscoGeral(riscos) {
    if (riscos.length === 0) return 'BAIXO';
    
    const riscosAltos = riscos.filter(r => r.nivel === 'ALTO').length;
    const riscosMedios = riscos.filter(r => r.nivel === 'MEDIO').length;
    
    if (riscosAltos > 0) return 'ALTO';
    if (riscosMedios > 1) return 'MEDIO';
    return 'BAIXO';
  }

  /**
   * 💡 Gerar recomendações de risco
   */
  gerarRecomendacoesRisco(riscos) {
    const recomendacoes = [];
    
    riscos.forEach(risco => {
      recomendacoes.push({
        risco: risco.categoria,
        acao: risco.mitigacao,
        prioridade: risco.nivel
      });
    });
    
    return recomendacoes;
  }
}

module.exports = OrcamentoValidator;