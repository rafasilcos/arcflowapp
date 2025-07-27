/**
 * Engine de Variações para Briefings de Teste
 * Cria diferentes cenários e variações para testes abrangentes
 */

import { BriefingType, ComplexityLevel, VariantConfig, GenerationContext } from '../types/testData'
import { realisticDataProvider } from './realisticDataProvider'
import { DEFAULT_VARIANTS } from '../config/testDataConfig'

export interface VariationStrategy {
  name: string
  description: string
  apply: (baseData: any, context: GenerationContext) => any
}

export interface ScenarioConfig {
  name: string
  description: string
  probability: number
  modifications: Record<string, any>
}

/**
 * Engine para criação de variações em briefings de teste
 */
export class VariationEngine {
  private readonly variationStrategies: Map<string, VariationStrategy> = new Map()
  private readonly scenarioConfigs: Map<BriefingType, ScenarioConfig[]> = new Map()

  constructor() {
    this.initializeVariationStrategies()
    this.initializeScenarioConfigs()
  }

  /**
   * Aplica variações baseadas no tipo e complexidade
   */
  applyVariations(baseData: any, context: GenerationContext): any {
    let variatedData = { ...baseData }

    // Aplica variação de complexidade
    variatedData = this.applyComplexityVariation(variatedData, context)

    // Aplica variações específicas do tipo
    variatedData = this.applyTypeSpecificVariations(variatedData, context)

    // Aplica cenários especiais
    variatedData = this.applyScenarioVariations(variatedData, context)

    // Aplica variações de valores limítrofes
    if (Math.random() < 0.2) { // 20% chance de valores limítrofes
      variatedData = this.applyBoundaryValueVariations(variatedData, context)
    }

    return variatedData
  }

  /**
   * Cria configurações de variantes para um tipo de briefing
   */
  createVariantConfigs(type: BriefingType): VariantConfig[] {
    const defaultVariants = DEFAULT_VARIANTS[type as keyof typeof DEFAULT_VARIANTS]
    
    if (defaultVariants) {
      return defaultVariants.map(variant => ({
        ...variant,
        complexity: variant.complexity as ComplexityLevel
      }))
    }

    // Variantes padrão se não houver configuração específica
    return [
      {
        name: 'simples',
        budgetRange: [50000, 200000],
        areaRange: [30, 100],
        complexity: 'simples' as ComplexityLevel
      },
      {
        name: 'medio',
        budgetRange: [200000, 500000],
        areaRange: [100, 250],
        complexity: 'medio' as ComplexityLevel
      },
      {
        name: 'alto',
        budgetRange: [500000, 1500000],
        areaRange: [250, 500],
        complexity: 'alto' as ComplexityLevel
      }
    ]
  }

  /**
   * Gera preenchimento parcial de campos opcionais
   */
  generatePartialFilling(fields: string[], fillRate: number = 0.7): string[] {
    const shuffled = [...fields].sort(() => 0.5 - Math.random())
    const fillCount = Math.floor(fields.length * fillRate)
    return shuffled.slice(0, fillCount)
  }

  /**
   * Cria cenário com valores mínimos
   */
  createMinimumScenario(baseData: any, context: GenerationContext): any {
    const minimumData = { ...baseData }
    
    // Aplica valores mínimos para campos numéricos
    Object.keys(minimumData).forEach(key => {
      if (typeof minimumData[key] === 'number') {
        if (key.includes('orcamento') || key.includes('valor')) {
          const budgetRange = realisticDataProvider.getBudgetRange(context.briefingType, 'simples')
          minimumData[key] = budgetRange.min
        } else if (key.includes('area')) {
          const areaRange = realisticDataProvider.getAreaRange(context.briefingType)
          minimumData[key] = areaRange.min
        } else if (key.includes('quarto')) {
          minimumData[key] = 1
        } else if (key.includes('banheiro')) {
          minimumData[key] = 1
        }
      }
    })

    return minimumData
  }

  /**
   * Cria cenário com valores máximos
   */
  createMaximumScenario(baseData: any, context: GenerationContext): any {
    const maximumData = { ...baseData }
    
    // Aplica valores máximos para campos numéricos
    Object.keys(maximumData).forEach(key => {
      if (typeof maximumData[key] === 'number') {
        if (key.includes('orcamento') || key.includes('valor')) {
          const budgetRange = realisticDataProvider.getBudgetRange(context.briefingType, 'alto')
          maximumData[key] = budgetRange.max
        } else if (key.includes('area')) {
          const areaRange = realisticDataProvider.getAreaRange(context.briefingType)
          maximumData[key] = areaRange.max
        } else if (key.includes('quarto')) {
          maximumData[key] = 6
        } else if (key.includes('banheiro')) {
          maximumData[key] = 5
        }
      }
    })

    return maximumData
  }

  /**
   * Cria cenário com urgência
   */
  createUrgentScenario(baseData: any): any {
    const urgentData = { ...baseData }
    
    // Modifica datas para cenário urgente
    const now = new Date()
    urgentData.data_inicio = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 1 semana
    urgentData.prazo_entrega = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // 3 meses
    urgentData.urgente = true
    urgentData.observacoes = 'Projeto com prazo apertado. Cliente tem urgência na entrega.'
    
    return urgentData
  }

  /**
   * Cria cenário com orçamento limitado
   */
  createBudgetConstrainedScenario(baseData: any, context: GenerationContext): any {
    const constrainedData = { ...baseData }
    
    // Reduz orçamento em 30-50%
    const reductionFactor = 0.5 + Math.random() * 0.2 // 50-70% do original
    
    Object.keys(constrainedData).forEach(key => {
      if (key.includes('orcamento') || key.includes('valor')) {
        constrainedData[key] = Math.round(constrainedData[key] * reductionFactor)
      }
    })
    
    constrainedData.observacoes = 'Orçamento limitado. Buscar soluções econômicas e criativas.'
    constrainedData.prioridade = 'Custo'
    
    return constrainedData
  }

  /**
   * Cria cenário sustentável
   */
  createSustainableScenario(baseData: any): any {
    const sustainableData = { ...baseData }
    
    sustainableData.sustentabilidade = true
    sustainableData.energia_solar = true
    sustainableData.captacao_agua = true
    sustainableData.materiais_sustentaveis = true
    sustainableData.observacoes = 'Cliente prioriza soluções sustentáveis e eficiência energética.'
    
    return sustainableData
  }

  /**
   * Inicializa estratégias de variação
   */
  private initializeVariationStrategies(): void {
    this.variationStrategies.set('complexity', {
      name: 'Variação de Complexidade',
      description: 'Ajusta dados baseado no nível de complexidade',
      apply: (data, context) => this.applyComplexityVariation(data, context)
    })

    this.variationStrategies.set('boundary', {
      name: 'Valores Limítrofes',
      description: 'Aplica valores mínimos e máximos',
      apply: (data, context) => this.applyBoundaryValueVariations(data, context)
    })

    this.variationStrategies.set('partial', {
      name: 'Preenchimento Parcial',
      description: 'Preenche apenas parte dos campos opcionais',
      apply: (data, context) => this.applyPartialFillingVariation(data, context)
    })

    this.variationStrategies.set('scenario', {
      name: 'Cenários Especiais',
      description: 'Aplica cenários específicos como urgência ou orçamento limitado',
      apply: (data, context) => this.applyScenarioVariations(data, context)
    })
  }

  /**
   * Inicializa configurações de cenários
   */
  private initializeScenarioConfigs(): void {
    const commonScenarios: ScenarioConfig[] = [
      {
        name: 'urgente',
        description: 'Projeto com prazo apertado',
        probability: 0.15,
        modifications: { urgente: true, prazo_reduzido: true }
      },
      {
        name: 'orcamento_limitado',
        description: 'Orçamento restrito',
        probability: 0.20,
        modifications: { orcamento_limitado: true, prioridade: 'Custo' }
      },
      {
        name: 'sustentavel',
        description: 'Foco em sustentabilidade',
        probability: 0.10,
        modifications: { sustentabilidade: true, energia_solar: true }
      },
      {
        name: 'premium',
        description: 'Projeto de alto padrão',
        probability: 0.08,
        modifications: { alto_padrao: true, acabamentos_premium: true }
      }
    ]

    // Aplica cenários comuns para todos os tipos
    Object.values(this.getBriefingTypes()).forEach(type => {
      this.scenarioConfigs.set(type, [...commonScenarios])
    })

    // Cenários específicos para residencial
    const residentialScenarios = [
      ...commonScenarios,
      {
        name: 'familia_grande',
        description: 'Família numerosa',
        probability: 0.12,
        modifications: { quartos_extras: true, banheiros_extras: true }
      },
      {
        name: 'idosos',
        description: 'Adaptado para idosos',
        probability: 0.08,
        modifications: { acessibilidade: true, sem_escadas: true }
      }
    ]

    this.scenarioConfigs.set('residencial_casa_padrao', residentialScenarios)
    this.scenarioConfigs.set('residencial_sobrado', residentialScenarios)
    this.scenarioConfigs.set('residencial_apartamento', residentialScenarios)

    // Cenários específicos para comercial
    const commercialScenarios = [
      ...commonScenarios,
      {
        name: 'crescimento_rapido',
        description: 'Empresa em crescimento',
        probability: 0.15,
        modifications: { expansao_futura: true, flexibilidade: true }
      },
      {
        name: 'home_office',
        description: 'Modelo híbrido',
        probability: 0.20,
        modifications: { trabalho_hibrido: true, menos_estacoes: true }
      }
    ]

    this.scenarioConfigs.set('comercial_escritorio', commercialScenarios)
    this.scenarioConfigs.set('comercial_loja', commercialScenarios)
  }

  /**
   * Aplica variação baseada na complexidade
   */
  private applyComplexityVariation(data: any, context: GenerationContext): any {
    const complexityData = { ...data }
    
    switch (context.complexity) {
      case 'simples':
        // Simplifica o projeto
        complexityData.acabamentos = 'Básicos'
        complexityData.sistemas = 'Convencionais'
        break
      case 'medio':
        // Projeto padrão
        complexityData.acabamentos = 'Intermediários'
        complexityData.sistemas = 'Modernos'
        break
      case 'alto':
        // Projeto complexo
        complexityData.acabamentos = 'Premium'
        complexityData.sistemas = 'Avançados'
        complexityData.automacao = true
        break
    }
    
    return complexityData
  }

  /**
   * Aplica variações específicas do tipo
   */
  private applyTypeSpecificVariations(data: any, context: GenerationContext): any {
    const typeData = { ...data }
    
    if (context.briefingType.startsWith('residencial_')) {
      typeData.jardim = realisticDataProvider.generateBoolean('tem_jardim')
      typeData.churrasqueira = realisticDataProvider.generateBoolean('tem_churrasqueira')
      if (context.complexity === 'alto') {
        typeData.piscina = realisticDataProvider.generateBoolean('tem_piscina')
      }
    }
    
    if (context.briefingType.startsWith('comercial_')) {
      typeData.estacionamento = true
      typeData.acessibilidade = true
      if (context.complexity === 'alto') {
        typeData.automacao_predial = true
      }
    }
    
    if (context.briefingType.startsWith('industrial_')) {
      typeData.seguranca_industrial = true
      typeData.ventilacao_especial = true
      typeData.cargas_pesadas = true
    }
    
    return typeData
  }

  /**
   * Aplica variações de cenários especiais
   */
  private applyScenarioVariations(data: any, context: GenerationContext): any {
    const scenarios = this.scenarioConfigs.get(context.briefingType) || []
    let scenarioData = { ...data }
    
    for (const scenario of scenarios) {
      if (Math.random() < scenario.probability) {
        switch (scenario.name) {
          case 'urgente':
            scenarioData = this.createUrgentScenario(scenarioData)
            break
          case 'orcamento_limitado':
            scenarioData = this.createBudgetConstrainedScenario(scenarioData, context)
            break
          case 'sustentavel':
            scenarioData = this.createSustainableScenario(scenarioData)
            break
          default:
            // Aplica modificações genéricas
            Object.assign(scenarioData, scenario.modifications)
        }
        break // Aplica apenas um cenário por briefing
      }
    }
    
    return scenarioData
  }

  /**
   * Aplica variações de valores limítrofes
   */
  private applyBoundaryValueVariations(data: any, context: GenerationContext): any {
    const boundaryType = Math.random()
    
    if (boundaryType < 0.5) {
      return this.createMinimumScenario(data, context)
    } else {
      return this.createMaximumScenario(data, context)
    }
  }

  /**
   * Aplica variação de preenchimento parcial
   */
  private applyPartialFillingVariation(data: any, context: GenerationContext): any {
    const partialData = { ...data }
    
    // Lista campos opcionais (não críticos)
    const optionalFields = Object.keys(partialData).filter(key => 
      !key.includes('nome') && 
      !key.includes('orcamento') && 
      !key.includes('area') &&
      !key.includes('email') &&
      !key.includes('telefone')
    )
    
    // Remove alguns campos opcionais aleatoriamente
    const fieldsToRemove = this.generatePartialFilling(optionalFields, 0.3) // Remove 30%
    fieldsToRemove.forEach(field => {
      delete partialData[field]
    })
    
    return partialData
  }

  /**
   * Retorna todos os tipos de briefing disponíveis
   */
  private getBriefingTypes(): BriefingType[] {
    return [
      'residencial_casa_padrao',
      'residencial_sobrado',
      'residencial_apartamento',
      'comercial_escritorio',
      'comercial_loja',
      'comercial_restaurante',
      'comercial_hotel',
      'industrial_fabrica',
      'industrial_galpao',
      'industrial_centro_logistico',
      'institucional_escola',
      'institucional_hospital',
      'institucional_templo',
      'urbanistico_espacos_publicos',
      'urbanistico_loteamentos',
      'urbanistico_planos_urbanos'
    ]
  }
}

// Instância singleton do engine de variações
export const variationEngine = new VariationEngine()