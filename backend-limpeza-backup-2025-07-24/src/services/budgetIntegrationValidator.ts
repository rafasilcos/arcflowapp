/**
 * Validador de Integração com Sistema de Orçamentos
 * Verifica se briefings gerados são compatíveis com geração de orçamentos
 */

import { BriefingType } from '../types/testData'

export interface BudgetValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  requiredFields: string[]
  missingFields: string[]
}

export interface BudgetCompatibilityCheck {
  briefingId: string
  briefingType: BriefingType
  isCompatible: boolean
  validationResult: BudgetValidationResult
  estimatedBudget?: number
}

/**
 * Service para validar compatibilidade com sistema de orçamentos
 */
export class BudgetIntegrationValidator {
  private readonly requiredFieldsByType: Record<string, string[]> = {
    'residencial_casa_padrao': [
      'nome_projeto',
      'orcamento_total',
      'area_terreno',
      'area_construida',
      'quartos',
      'banheiros',
      'endereco',
      'tipo_construcao'
    ],
    'comercial_escritorio': [
      'nome_projeto',
      'orcamento_total',
      'area_total',
      'funcionarios',
      'endereco',
      'tipo_uso'
    ],
    'industrial_fabrica': [
      'nome_projeto',
      'orcamento_total',
      'area_total',
      'tipo_industria',
      'endereco',
      'capacidade_producao'
    ]
  }

  private readonly budgetCalculationFields: Record<string, string[]> = {
    'residencial_casa_padrao': [
      'area_construida',
      'padrao_acabamento',
      'tipo_estrutura',
      'numero_pavimentos'
    ],
    'comercial_escritorio': [
      'area_total',
      'padrao_acabamento',
      'sistemas_especiais',
      'densidade_ocupacao'
    ],
    'industrial_fabrica': [
      'area_total',
      'tipo_estrutura',
      'sistemas_industriais',
      'equipamentos_especiais'
    ]
  }

  /**
   * Valida se um briefing é compatível com geração de orçamentos
   */
  validateBudgetCompatibility(briefingData: any, briefingType: BriefingType): BudgetValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const requiredFields = this.getRequiredFields(briefingType)
    const missingFields: string[] = []

    // Verifica campos obrigatórios
    for (const field of requiredFields) {
      if (!briefingData[field] || briefingData[field] === '' || briefingData[field] === null) {
        missingFields.push(field)
        errors.push(`Campo obrigatório '${field}' está ausente ou vazio`)
      }
    }

    // Verifica campos de cálculo de orçamento
    const calculationFields = this.getBudgetCalculationFields(briefingType)
    for (const field of calculationFields) {
      if (!briefingData[field]) {
        warnings.push(`Campo '${field}' recomendado para cálculo preciso de orçamento`)
      }
    }

    // Validações específicas por tipo
    this.validateTypeSpecificFields(briefingData, briefingType, errors, warnings)

    // Validações de valores numéricos
    this.validateNumericFields(briefingData, briefingType, errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      requiredFields,
      missingFields
    }
  }

  /**
   * Testa geração de orçamento para um briefing
   */
  async testBudgetGeneration(briefingData: any, briefingType: BriefingType): Promise<BudgetCompatibilityCheck> {
    const validationResult = this.validateBudgetCompatibility(briefingData, briefingType)
    
    let estimatedBudget: number | undefined
    let isCompatible = validationResult.isValid

    if (isCompatible) {
      try {
        // Simula chamada para API de orçamentos
        estimatedBudget = await this.simulateBudgetCalculation(briefingData, briefingType)
      } catch (error) {
        isCompatible = false
        validationResult.errors.push(`Erro na geração de orçamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }

    return {
      briefingId: briefingData.id || briefingData._testMetadata?.generationId || 'unknown',
      briefingType,
      isCompatible,
      validationResult,
      estimatedBudget
    }
  }

  /**
   * Valida múltiplos briefings em lote
   */
  async validateBriefingsBatch(briefings: Array<{ data: any; type: BriefingType }>): Promise<{
    totalBriefings: number
    compatibleBriefings: number
    incompatibleBriefings: number
    results: BudgetCompatibilityCheck[]
    summary: {
      commonErrors: Array<{ error: string; count: number }>
      commonWarnings: Array<{ warning: string; count: number }>
    }
  }> {
    const results: BudgetCompatibilityCheck[] = []
    const errorCounts: Record<string, number> = {}
    const warningCounts: Record<string, number> = {}

    // Processa cada briefing
    for (const briefing of briefings) {
      const result = await this.testBudgetGeneration(briefing.data, briefing.type)
      results.push(result)

      // Conta erros e warnings
      result.validationResult.errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1
      })
      result.validationResult.warnings.forEach(warning => {
        warningCounts[warning] = (warningCounts[warning] || 0) + 1
      })
    }

    const compatibleCount = results.filter(r => r.isCompatible).length

    return {
      totalBriefings: briefings.length,
      compatibleBriefings: compatibleCount,
      incompatibleBriefings: briefings.length - compatibleCount,
      results,
      summary: {
        commonErrors: Object.entries(errorCounts)
          .map(([error, count]) => ({ error, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        commonWarnings: Object.entries(warningCounts)
          .map(([warning, count]) => ({ warning, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }
    }
  }

  /**
   * Corrige problemas comuns de compatibilidade
   */
  fixCompatibilityIssues(briefingData: any, briefingType: BriefingType): any {
    const fixedData = { ...briefingData }
    const requiredFields = this.getRequiredFields(briefingType)

    // Corrige campos obrigatórios ausentes
    for (const field of requiredFields) {
      if (!fixedData[field] || fixedData[field] === '') {
        fixedData[field] = this.generateDefaultValueForField(field, briefingType)
      }
    }

    // Corrige valores numéricos inválidos
    this.fixNumericFields(fixedData, briefingType)

    // Corrige estrutura de dados
    this.fixDataStructure(fixedData, briefingType)

    return fixedData
  }

  /**
   * Obtém campos obrigatórios para um tipo de briefing
   */
  private getRequiredFields(briefingType: BriefingType): string[] {
    return this.requiredFieldsByType[briefingType] || this.requiredFieldsByType['residencial_casa_padrao']
  }

  /**
   * Obtém campos necessários para cálculo de orçamento
   */
  private getBudgetCalculationFields(briefingType: BriefingType): string[] {
    return this.budgetCalculationFields[briefingType] || this.budgetCalculationFields['residencial_casa_padrao']
  }

  /**
   * Validações específicas por tipo de briefing
   */
  private validateTypeSpecificFields(data: any, type: BriefingType, errors: string[], warnings: string[]): void {
    switch (type) {
      case 'residencial_casa_padrao':
        if (data.quartos && data.quartos < 1) {
          errors.push('Número de quartos deve ser maior que zero')
        }
        if (data.area_construida && data.area_terreno && data.area_construida > data.area_terreno) {
          warnings.push('Área construída maior que área do terreno')
        }
        break

      case 'comercial_escritorio':
        if (data.funcionarios && data.funcionarios < 1) {
          errors.push('Número de funcionários deve ser maior que zero')
        }
        if (data.area_total && data.funcionarios && (data.area_total / data.funcionarios) < 5) {
          warnings.push('Área por funcionário muito baixa (menos de 5m²)')
        }
        break

      case 'industrial_fabrica':
        if (data.capacidade_producao && data.capacidade_producao <= 0) {
          errors.push('Capacidade de produção deve ser maior que zero')
        }
        break
    }
  }

  /**
   * Validações de campos numéricos
   */
  private validateNumericFields(data: any, type: BriefingType, errors: string[], warnings: string[]): void {
    // Valida orçamento
    if (data.orcamento_total) {
      if (typeof data.orcamento_total !== 'number' || data.orcamento_total <= 0) {
        errors.push('Orçamento total deve ser um número positivo')
      } else if (data.orcamento_total < 10000) {
        warnings.push('Orçamento muito baixo para o tipo de projeto')
      }
    }

    // Valida áreas
    const areaFields = ['area_total', 'area_construida', 'area_terreno']
    for (const field of areaFields) {
      if (data[field]) {
        if (typeof data[field] !== 'number' || data[field] <= 0) {
          errors.push(`${field} deve ser um número positivo`)
        }
      }
    }
  }

  /**
   * Simula cálculo de orçamento
   */
  private async simulateBudgetCalculation(data: any, type: BriefingType): Promise<number> {
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 100))

    // Cálculo básico baseado em área e tipo
    let baseValue = 0
    
    switch (type) {
      case 'residencial_casa_padrao':
        baseValue = (data.area_construida || 100) * 3000 // R$ 3000/m²
        break
      case 'comercial_escritorio':
        baseValue = (data.area_total || 50) * 2000 // R$ 2000/m²
        break
      case 'industrial_fabrica':
        baseValue = (data.area_total || 200) * 1500 // R$ 1500/m²
        break
      default:
        baseValue = 100000
    }

    // Aplica variação de ±20%
    const variation = 0.8 + Math.random() * 0.4
    return Math.round(baseValue * variation)
  }

  /**
   * Gera valor padrão para campo específico
   */
  private generateDefaultValueForField(field: string, type: BriefingType): any {
    const fieldName = field.toLowerCase()

    if (fieldName.includes('nome')) {
      return `Projeto ${type.replace(/_/g, ' ')}`
    }
    if (fieldName.includes('orcamento')) {
      return type.startsWith('residencial') ? 500000 : 
             type.startsWith('comercial') ? 200000 : 1000000
    }
    if (fieldName.includes('area')) {
      return type.startsWith('residencial') ? 150 :
             type.startsWith('comercial') ? 80 : 300
    }
    if (fieldName.includes('endereco')) {
      return 'Rua Exemplo, 123 - São Paulo, SP'
    }
    if (fieldName.includes('quartos')) {
      return 3
    }
    if (fieldName.includes('banheiros')) {
      return 2
    }
    if (fieldName.includes('funcionarios')) {
      return 10
    }

    return 'Valor Padrão'
  }

  /**
   * Corrige campos numéricos
   */
  private fixNumericFields(data: any, type: BriefingType): void {
    const numericFields = ['orcamento_total', 'area_total', 'area_construida', 'area_terreno', 'quartos', 'banheiros', 'funcionarios']
    
    for (const field of numericFields) {
      if (data[field] && (typeof data[field] !== 'number' || data[field] <= 0)) {
        data[field] = this.generateDefaultValueForField(field, type)
      }
    }
  }

  /**
   * Corrige estrutura de dados
   */
  private fixDataStructure(data: any, type: BriefingType): void {
    // Garante que campos de texto não sejam objetos
    const textFields = ['nome_projeto', 'endereco', 'tipo_construcao', 'tipo_uso']
    
    for (const field of textFields) {
      if (data[field] && typeof data[field] === 'object') {
        data[field] = String(data[field])
      }
    }

    // Garante estrutura mínima
    if (!data.created_at) {
      data.created_at = new Date().toISOString()
    }
    if (!data.updated_at) {
      data.updated_at = new Date().toISOString()
    }
  }
}

// Instância singleton do validador
export const budgetIntegrationValidator = new BudgetIntegrationValidator()