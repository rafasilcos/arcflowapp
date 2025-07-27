/**
 * Worker para Processamento Paralelo de Análise de Briefings
 * Tarefa 13: Implementar otimizações de performance
 */

const { parentPort } = require('worker_threads');

// Simulação dos serviços de análise (em produção, importar os serviços reais)
class BriefingAnalysisWorker {
  constructor() {
    this.setupMessageHandler();
  }

  setupMessageHandler() {
    if (parentPort) {
      parentPort.on('message', async (task) => {
        const startTime = Date.now();
        
        try {
          const result = await this.processTask(task);
          
          parentPort.postMessage({
            taskId: task.id,
            success: true,
            result,
            processingTime: Date.now() - startTime
          });
          
        } catch (error) {
          parentPort.postMessage({
            taskId: task.id,
            success: false,
            error: error.message,
            processingTime: Date.now() - startTime
          });
        }
      });
    }
  }

  async processTask(task) {
    switch (task.type) {
      case 'briefing_analysis':
        return await this.processBriefingAnalysis(task.data);
      case 'adaptive_parsing':
        return await this.processAdaptiveParsing(task.data);
      case 'budget_calculation':
        return await this.processBudgetCalculation(task.data);
      default:
        throw new Error(`Tipo de tarefa desconhecido: ${task.type}`);
    }
  }

  async processBriefingAnalysis(data) {
    const { type, data: briefingData } = data;

    switch (type) {
      case 'area_extraction':
        return this.extractAreaData(briefingData);
      case 'tipologia_identification':
        return this.identifyTipologia(briefingData);
      case 'complexity_calculation':
        return this.calculateComplexity(briefingData);
      case 'disciplines_identification':
        return this.identifyDisciplines(briefingData);
      default:
        throw new Error(`Tipo de análise desconhecido: ${type}`);
    }
  }

  async processAdaptiveParsing(data) {
    const { type, data: customData } = data;

    switch (type) {
      case 'field_mapping':
        return this.mapFields(customData);
      case 'data_extraction':
        return this.extractCustomData(customData);
      case 'data_validation':
        return this.validateCustomData(customData);
      default:
        throw new Error(`Tipo de parsing desconhecido: ${type}`);
    }
  }

  async processBudgetCalculation(data) {
    const { type, analysisData, configurations } = data;

    switch (type) {
      case 'hours_calculation':
        return this.calculateHours(analysisData, configurations);
      case 'values_calculation':
        return this.calculateValues(analysisData, configurations);
      case 'multipliers_application':
        return this.applyMultipliers(analysisData, configurations);
      case 'timeline_distribution':
        return this.distributeTimeline(analysisData, configurations);
      default:
        throw new Error(`Tipo de cálculo desconhecido: ${type}`);
    }
  }

  // Métodos de Análise de Briefing
  extractAreaData(briefingData) {
    const areas = {};
    
    // Buscar área construída em diferentes formatos
    const areaFields = ['area_construida', 'area', 'metragem', 'metragem_quadrada', 'area_total'];
    
    for (const field of areaFields) {
      if (briefingData.respostas && briefingData.respostas[field]) {
        areas.areaConstruida = parseFloat(briefingData.respostas[field]);
        break;
      }
    }

    // Buscar área do terreno
    const terrenoFields = ['area_terreno', 'area_lote', 'terreno'];
    
    for (const field of terrenoFields) {
      if (briefingData.respostas && briefingData.respostas[field]) {
        areas.areaTerreno = parseFloat(briefingData.respostas[field]);
        break;
      }
    }

    return areas;
  }

  identifyTipologia(briefingData) {
    let tipologia = briefingData.tipologia || 'residencial';
    
    // Mapear variações de tipologia
    const tipologiaMap = {
      'casa': 'residencial',
      'apartamento': 'residencial',
      'residencial': 'residencial',
      'comercial': 'comercial',
      'loja': 'comercial',
      'escritorio': 'comercial',
      'industrial': 'industrial',
      'galpao': 'industrial',
      'fabrica': 'industrial',
      'institucional': 'institucional',
      'escola': 'institucional',
      'hospital': 'institucional',
      'misto': 'misto'
    };

    tipologia = tipologiaMap[tipologia.toLowerCase()] || tipologia;

    return { tipologia };
  }

  calculateComplexity(briefingData) {
    let complexityScore = 0;
    const respostas = briefingData.respostas || {};

    // Fatores que aumentam complexidade
    if (respostas.numero_pavimentos > 2) complexityScore += 10;
    if (respostas.elevadores) complexityScore += 15;
    if (respostas.sistema_ar_condicionado === 'central') complexityScore += 10;
    if (respostas.automacao_predial) complexityScore += 15;
    if (respostas.sistema_incendio === 'completo') complexityScore += 10;
    if (respostas.heliponto) complexityScore += 20;
    if (respostas.subsolo > 0) complexityScore += 10;
    if (respostas.ponte_rolante) complexityScore += 15;
    if (respostas.piscina) complexityScore += 5;

    // Determinar nível de complexidade
    let complexidade = 'BAIXA';
    if (complexityScore >= 50) complexidade = 'MUITO_ALTA';
    else if (complexityScore >= 30) complexidade = 'ALTA';
    else if (complexityScore >= 15) complexidade = 'MEDIA';

    return { complexidade, complexityScore };
  }

  identifyDisciplines(briefingData) {
    const disciplinas = ['Arquitetura']; // Sempre presente
    const respostas = briefingData.respostas || {};
    const tipologia = briefingData.tipologia || 'residencial';

    // Disciplinas básicas por tipologia
    if (tipologia !== 'urbanistico') {
      disciplinas.push('Estrutural');
      disciplinas.push('Instalações Hidráulicas');
      disciplinas.push('Instalações Elétricas');
    }

    // Disciplinas específicas baseadas nas respostas
    if (respostas.sistema_ar_condicionado) {
      disciplinas.push('Ar Condicionado');
    }
    
    if (respostas.sistema_incendio) {
      disciplinas.push('Prevenção Incêndio');
    }
    
    if (respostas.automacao_predial || respostas.sistema_seguranca) {
      disciplinas.push('Automação');
    }
    
    if (respostas.elevadores) {
      disciplinas.push('Instalações Especiais');
    }
    
    if (respostas.ponte_rolante || respostas.instalacoes_industriais) {
      disciplinas.push('Instalações Industriais');
    }
    
    if (respostas.paisagismo || respostas.jardim) {
      disciplinas.push('Paisagismo');
    }

    return { disciplinasNecessarias: [...new Set(disciplinas)] };
  }

  // Métodos de Parsing Adaptativo
  mapFields(customData) {
    const mappedFields = {};
    
    // Mapear campos de área
    const areaVariations = ['area', 'area_construida', 'metragem', 'metragem_quadrada', 'area_total'];
    const areaField = this.findFieldVariation(customData, areaVariations);
    if (areaField) {
      mappedFields.area = areaField;
    }

    // Mapear campos de tipologia
    const tipologiaVariations = ['tipologia', 'tipo', 'categoria', 'uso', 'finalidade'];
    const tipologiaField = this.findFieldVariation(customData, tipologiaVariations);
    if (tipologiaField) {
      mappedFields.tipologia = tipologiaField;
    }

    // Mapear campos de padrão
    const padraoVariations = ['padrao', 'nivel', 'qualidade', 'acabamento', 'nivel_acabamento'];
    const padraoField = this.findFieldVariation(customData, padraoVariations);
    if (padraoField) {
      mappedFields.padrao = padraoField;
    }

    return mappedFields;
  }

  findFieldVariation(data, variations) {
    for (const variation of variations) {
      if (this.hasField(data, variation)) {
        return { field: variation, value: this.getFieldValue(data, variation) };
      }
    }
    return null;
  }

  hasField(obj, field) {
    if (typeof obj !== 'object' || obj === null) return false;
    
    if (obj.hasOwnProperty(field)) return true;
    
    for (const key in obj) {
      if (typeof obj[key] === 'object' && this.hasField(obj[key], field)) {
        return true;
      }
    }
    
    return false;
  }

  getFieldValue(obj, field) {
    if (typeof obj !== 'object' || obj === null) return null;
    
    if (obj.hasOwnProperty(field)) return obj[field];
    
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const value = this.getFieldValue(obj[key], field);
        if (value !== null) return value;
      }
    }
    
    return null;
  }

  extractCustomData(customData) {
    const extracted = {};
    
    // Extrair área
    const areaValue = this.findNumericValue(customData, ['area', 'metragem']);
    if (areaValue) {
      extracted.areaConstruida = areaValue;
    }

    // Extrair tipologia
    const tipologiaValue = this.findStringValue(customData, ['tipo', 'categoria']);
    if (tipologiaValue) {
      extracted.tipologia = this.normalizeTipologia(tipologiaValue);
    }

    // Extrair padrão
    const padraoValue = this.findStringValue(customData, ['nivel', 'padrao']);
    if (padraoValue) {
      extracted.padrao = this.normalizePadrao(padraoValue);
    }

    return extracted;
  }

  findNumericValue(obj, fields) {
    for (const field of fields) {
      const value = this.getFieldValue(obj, field);
      if (typeof value === 'number' && value > 0) {
        return value;
      }
      if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        return parseFloat(value);
      }
    }
    return null;
  }

  findStringValue(obj, fields) {
    for (const field of fields) {
      const value = this.getFieldValue(obj, field);
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim().toLowerCase();
      }
    }
    return null;
  }

  normalizeTipologia(tipologia) {
    const map = {
      'residencial': 'residencial',
      'casa': 'residencial',
      'apartamento': 'residencial',
      'habitacional': 'residencial',
      'comercial': 'comercial',
      'loja': 'comercial',
      'escritorio': 'comercial',
      'industrial': 'industrial',
      'galpao': 'industrial',
      'fabrica': 'industrial',
      'institucional': 'institucional',
      'escola': 'institucional',
      'hospital': 'institucional'
    };
    
    return map[tipologia] || 'residencial';
  }

  normalizePadrao(padrao) {
    if (padrao.includes('alto') || padrao.includes('premium') || padrao.includes('luxo')) {
      return 'ALTO';
    } else if (padrao.includes('medio') || padrao.includes('intermediario')) {
      return 'MEDIO';
    } else {
      return 'SIMPLES';
    }
  }

  validateCustomData(customData) {
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Validar se tem dados mínimos
    const hasArea = this.findNumericValue(customData, ['area', 'metragem']) !== null;
    const hasTipologia = this.findStringValue(customData, ['tipo', 'categoria']) !== null;

    if (!hasArea) {
      validation.errors.push('Área construída não encontrada');
      validation.valid = false;
    }

    if (!hasTipologia) {
      validation.warnings.push('Tipologia não especificada, usando padrão residencial');
    }

    return validation;
  }

  // Métodos de Cálculo de Orçamento
  calculateHours(analysisData, configurations) {
    const baseHours = this.getBaseHours(analysisData.areaConstruida, analysisData.tipologia);
    const complexityMultiplier = this.getComplexityMultiplier(analysisData.complexidade);
    
    const horasPorDisciplina = {};
    const disciplinas = analysisData.disciplinasNecessarias || ['Arquitetura'];

    for (const disciplina of disciplinas) {
      const disciplinaHours = baseHours * this.getDisciplinaRatio(disciplina) * complexityMultiplier;
      horasPorDisciplina[disciplina] = Math.round(disciplinaHours);
    }

    const horasTotal = Object.values(horasPorDisciplina).reduce((sum, hours) => sum + hours, 0);

    return {
      horasPorDisciplina,
      horasTotal,
      baseHours,
      complexityMultiplier
    };
  }

  getBaseHours(area, tipologia) {
    const baseRates = {
      'residencial': 0.8,
      'comercial': 1.0,
      'industrial': 1.2,
      'institucional': 1.5
    };

    const rate = baseRates[tipologia] || 1.0;
    return area * rate;
  }

  getComplexityMultiplier(complexidade) {
    const multipliers = {
      'BAIXA': 1.0,
      'MEDIA': 1.3,
      'ALTA': 1.6,
      'MUITO_ALTA': 2.0
    };

    return multipliers[complexidade] || 1.0;
  }

  getDisciplinaRatio(disciplina) {
    const ratios = {
      'Arquitetura': 0.35,
      'Estrutural': 0.25,
      'Instalações Hidráulicas': 0.15,
      'Instalações Elétricas': 0.15,
      'Ar Condicionado': 0.10,
      'Prevenção Incêndio': 0.08,
      'Automação': 0.12,
      'Paisagismo': 0.10,
      'Instalações Especiais': 0.15,
      'Instalações Industriais': 0.20
    };

    return ratios[disciplina] || 0.10;
  }

  calculateValues(analysisData, configurations) {
    // Usar configurações do escritório ou valores padrão
    const tabelaPrecos = configurations.tabelaPrecos || this.getDefaultPrices();
    
    const valorPorDisciplina = {};
    const horasPorDisciplina = analysisData.horasPorDisciplina || {};

    for (const [disciplina, horas] of Object.entries(horasPorDisciplina)) {
      const valorHora = this.getHourlyRate(disciplina, tabelaPrecos);
      valorPorDisciplina[disciplina] = horas * valorHora;
    }

    const valorTotal = Object.values(valorPorDisciplina).reduce((sum, valor) => sum + valor, 0);

    return {
      valorPorDisciplina,
      valorTotal,
      tabelaPrecosUsada: tabelaPrecos
    };
  }

  getDefaultPrices() {
    return {
      valorHoraArquiteto: 120,
      valorHoraEngenheiro: 130,
      valorHoraDesigner: 80,
      valorHoraTecnico: 60,
      valorHoraEstagiario: 30
    };
  }

  getHourlyRate(disciplina, tabelaPrecos) {
    const disciplinaRates = {
      'Arquitetura': tabelaPrecos.valorHoraArquiteto,
      'Estrutural': tabelaPrecos.valorHoraEngenheiro,
      'Instalações Hidráulicas': tabelaPrecos.valorHoraEngenheiro,
      'Instalações Elétricas': tabelaPrecos.valorHoraEngenheiro,
      'Ar Condicionado': tabelaPrecos.valorHoraEngenheiro,
      'Prevenção Incêndio': tabelaPrecos.valorHoraEngenheiro,
      'Automação': tabelaPrecos.valorHoraTecnico,
      'Paisagismo': tabelaPrecos.valorHoraDesigner,
      'Instalações Especiais': tabelaPrecos.valorHoraEngenheiro,
      'Instalações Industriais': tabelaPrecos.valorHoraEngenheiro
    };

    return disciplinaRates[disciplina] || tabelaPrecos.valorHoraArquiteto;
  }

  applyMultipliers(analysisData, configurations) {
    const multiplicadores = configurations.multiplicadores || {};
    const tipologia = analysisData.tipologia;
    
    const multiplicadorTipologia = multiplicadores[tipologia] || 1.0;
    const valorOriginal = analysisData.valorTotal || 0;
    const valorComMultiplicador = valorOriginal * multiplicadorTipologia;

    return {
      multiplicadorAplicado: multiplicadorTipologia,
      valorOriginal,
      valorFinal: valorComMultiplicador
    };
  }

  distributeTimeline(analysisData, configurations) {
    const horasTotal = analysisData.horasTotal || 0;
    const fases = ['Estudo Preliminar', 'Anteprojeto', 'Projeto Executivo'];
    const distribuicao = [0.25, 0.35, 0.40]; // 25%, 35%, 40%

    const distribuicaoTemporal = {};
    
    for (let i = 0; i < fases.length; i++) {
      distribuicaoTemporal[fases[i]] = Math.round(horasTotal * distribuicao[i]);
    }

    return {
      distribuicaoTemporal,
      horasTotal,
      fases
    };
  }
}

// Inicializar worker
new BriefingAnalysisWorker();