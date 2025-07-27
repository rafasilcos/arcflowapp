/**
 * Engine de Templates para Briefings
 * Processa templates de briefing e gera dados automaticamente
 */

import { BriefingTemplate, TemplateSection, FieldDefinition, GenerationRule, FieldConstraint, GenerationContext, BriefingType } from '../types/testData'
import { realisticDataProvider } from './realisticDataProvider'
import { isValidBriefingType } from '../utils/testDataUtils'
import * as fs from 'fs'
import * as path from 'path'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface TemplateParseResult {
  template: BriefingTemplate | null
  errors: string[]
}

/**
 * Engine para processamento de templates de briefing
 */
export class BriefingTemplateEngine {
  private templateCache: Map<BriefingType, BriefingTemplate> = new Map()
  private readonly briefingTypeMappings: Record<string, BriefingType> = {
    'casa_padrao': 'residencial_casa_padrao',
    'casa_alto_padrao': 'residencial_casa_padrao',
    'sobrado': 'residencial_sobrado',
    'apartamento': 'residencial_apartamento',
    'escritorio': 'comercial_escritorio',
    'loja': 'comercial_loja',
    'restaurante': 'comercial_restaurante',
    'hotel': 'comercial_hotel',
    'fabrica': 'industrial_fabrica',
    'galpao': 'industrial_galpao',
    'centro_logistico': 'industrial_centro_logistico',
    'escola': 'institucional_escola',
    'hospital': 'institucional_hospital',
    'templo': 'institucional_templo',
    'espacos_publicos': 'urbanistico_espacos_publicos',
    'loteamentos': 'urbanistico_loteamentos',
    'planos_urbanos': 'urbanistico_planos_urbanos'
  }

  /**
   * Carrega template de briefing baseado no tipo
   */
  async loadTemplate(type: BriefingType): Promise<BriefingTemplate> {
    // Verifica cache primeiro
    if (this.templateCache.has(type)) {
      return this.templateCache.get(type)!
    }

    try {
      const template = await this.parseTemplateFromFile(type)
      this.templateCache.set(type, template)
      return template
    } catch (error) {
      throw new Error(`Erro ao carregar template para ${type}: ${error}`)
    }
  }

  /**
   * Gera dados para um campo específico baseado na definição
   */
  generateFieldData(field: FieldDefinition, context: GenerationContext): any {
    try {
      switch (field.type) {
        case 'text':
          return this.generateTextData(field, context)
        case 'number':
          return this.generateNumberData(field, context)
        case 'select':
          return this.generateSelectData(field, context)
        case 'multiselect':
          return this.generateMultiSelectData(field, context)
        case 'date':
          return this.generateDateData(field, context)
        case 'boolean':
          return this.generateBooleanData(field, context)
        default:
          return this.generateDefaultData(field, context)
      }
    } catch (error) {
      console.warn(`Erro ao gerar dados para campo ${field.name}:`, error)
      return this.getDefaultValueForType(field.type)
    }
  }

  /**
   * Valida dados gerados contra o template
   */
  validateGeneratedData(data: any, template: BriefingTemplate): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Valida campos obrigatórios
    for (const section of template.sections) {
      for (const field of section.fields) {
        if (field.required && (!data[field.name] || data[field.name] === '')) {
          errors.push(`Campo obrigatório '${field.name}' está vazio`)
        }
      }
    }

    // Valida constraints
    for (const constraint of template.constraints) {
      const value = data[constraint.field]
      
      if (constraint.min !== undefined && typeof value === 'number' && value < constraint.min) {
        errors.push(`Campo '${constraint.field}' abaixo do mínimo (${constraint.min})`)
      }
      
      if (constraint.max !== undefined && typeof value === 'number' && value > constraint.max) {
        errors.push(`Campo '${constraint.field}' acima do máximo (${constraint.max})`)
      }
      
      if (constraint.pattern && typeof value === 'string' && !new RegExp(constraint.pattern).test(value)) {
        warnings.push(`Campo '${constraint.field}' não atende ao padrão esperado`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Aplica regras de geração ao contexto
   */
  applyGenerationRules(rules: GenerationRule[], context: GenerationContext): void {
    for (const rule of rules) {
      try {
        if (this.evaluateCondition(rule.condition, context)) {
          this.executeAction(rule.action, rule.value, context)
        }
      } catch (error) {
        console.warn(`Erro ao aplicar regra para campo ${rule.field}:`, error)
      }
    }
  }

  /**
   * Gera dados de texto baseado no contexto
   */
  private generateTextData(field: FieldDefinition, context: GenerationContext): string {
    const fieldName = field.name.toLowerCase()
    
    // Mapeamento de campos para geradores específicos
    if (fieldName.includes('nome') || fieldName.includes('responsavel')) {
      return realisticDataProvider.getRandomName()
    }
    
    if (fieldName.includes('email')) {
      return realisticDataProvider.getRandomEmail()
    }
    
    if (fieldName.includes('telefone') || fieldName.includes('celular')) {
      return realisticDataProvider.getRandomPhoneNumber()
    }
    
    if (fieldName.includes('cpf')) {
      return realisticDataProvider.getRandomCPF()
    }
    
    if (fieldName.includes('cnpj')) {
      return realisticDataProvider.getRandomCNPJ()
    }
    
    if (fieldName.includes('endereco') || fieldName.includes('rua')) {
      const address = realisticDataProvider.getRandomAddress()
      return `${address.street}, ${address.number}`
    }
    
    if (fieldName.includes('cidade')) {
      return realisticDataProvider.getRandomAddress().city
    }
    
    if (fieldName.includes('estado')) {
      return realisticDataProvider.getRandomAddress().state
    }
    
    if (fieldName.includes('cep')) {
      return realisticDataProvider.getRandomAddress().zipCode
    }
    
    if (fieldName.includes('empresa') || fieldName.includes('construtora')) {
      return realisticDataProvider.getRandomCompanyName()
    }
    
    if (fieldName.includes('profissao') || fieldName.includes('cargo')) {
      return realisticDataProvider.getRandomProfession()
    }
    
    if (fieldName.includes('descricao') || fieldName.includes('observacao')) {
      return realisticDataProvider.generateDescriptiveText('projeto_descricao', 'medium')
    }
    
    // Valor padrão para campos de texto
    return `Texto gerado para ${field.name}`
  }

  /**
   * Gera dados numéricos baseado no contexto
   */
  private generateNumberData(field: FieldDefinition, context: GenerationContext): number {
    const fieldName = field.name.toLowerCase()
    
    if (fieldName.includes('orcamento') || fieldName.includes('valor') || fieldName.includes('preco')) {
      return realisticDataProvider.generateMonetaryValue(context.briefingType, context.complexity, 'budget')
    }
    
    if (fieldName.includes('area') || fieldName.includes('metragem')) {
      return realisticDataProvider.generateAreaValue(context.briefingType, 'total')
    }
    
    if (fieldName.includes('quarto')) {
      return realisticDataProvider.generateQuantity('quartos')
    }
    
    if (fieldName.includes('banheiro')) {
      return realisticDataProvider.generateQuantity('banheiros')
    }
    
    if (fieldName.includes('vaga') || fieldName.includes('garagem')) {
      return realisticDataProvider.generateQuantity('vagas_garagem')
    }
    
    if (fieldName.includes('pavimento') || fieldName.includes('andar')) {
      return realisticDataProvider.generateQuantity('pavimentos')
    }
    
    if (fieldName.includes('funcionario') || fieldName.includes('colaborador')) {
      return realisticDataProvider.generateQuantity('funcionarios')
    }
    
    if (fieldName.includes('idade')) {
      return realisticDataProvider.generateAge('adult')
    }
    
    // Aplica constraints se existirem
    if (field.constraints) {
      const min = field.constraints.min || 1
      const max = field.constraints.max || 100
      return realisticDataProvider.getRandomValueInRange(min, max)
    }
    
    return realisticDataProvider.getRandomValueInRange(1, 100)
  }

  /**
   * Gera dados de seleção única
   */
  private generateSelectData(field: FieldDefinition, context: GenerationContext): string {
    if (field.options && field.options.length > 0) {
      return realisticDataProvider.getRandomFromArray(field.options)
    }
    
    // Opções padrão baseadas no nome do campo
    const fieldName = field.name.toLowerCase()
    
    if (fieldName.includes('prioridade')) {
      return realisticDataProvider.getRandomFromArray(['Prazo', 'Custo', 'Qualidade'])
    }
    
    if (fieldName.includes('estilo')) {
      return realisticDataProvider.getRandomFromArray(['Moderno', 'Contemporâneo', 'Clássico', 'Minimalista'])
    }
    
    if (fieldName.includes('financiamento')) {
      return realisticDataProvider.getRandomFromArray(['Recursos Próprios', 'Financiamento', 'Misto'])
    }
    
    return 'Opção Padrão'
  }

  /**
   * Gera dados de múltipla seleção
   */
  private generateMultiSelectData(field: FieldDefinition, context: GenerationContext): string[] {
    if (field.options && field.options.length > 0) {
      const selection = realisticDataProvider.generateSelection('multiple_few', field.options)
      return Array.isArray(selection) ? selection : [selection]
    }
    
    return ['Opção 1', 'Opção 2']
  }

  /**
   * Gera dados de data
   */
  private generateDateData(field: FieldDefinition, context: GenerationContext): Date {
    const fieldName = field.name.toLowerCase()
    
    if (fieldName.includes('inicio') || fieldName.includes('start')) {
      return realisticDataProvider.generateContextualDate('start')
    }
    
    if (fieldName.includes('prazo') || fieldName.includes('deadline')) {
      return realisticDataProvider.generateContextualDate('deadline')
    }
    
    if (fieldName.includes('aprovacao')) {
      return realisticDataProvider.generateContextualDate('approval')
    }
    
    if (fieldName.includes('entrega') || fieldName.includes('delivery')) {
      return realisticDataProvider.generateContextualDate('delivery')
    }
    
    return realisticDataProvider.generateContextualDate('start')
  }

  /**
   * Gera dados booleanos
   */
  private generateBooleanData(field: FieldDefinition, context: GenerationContext): boolean {
    const fieldName = field.name.toLowerCase()
    return realisticDataProvider.generateBoolean(fieldName)
  }

  /**
   * Gera dados padrão quando tipo não é reconhecido
   */
  private generateDefaultData(field: FieldDefinition, context: GenerationContext): any {
    return `Valor gerado para ${field.name}`
  }

  /**
   * Retorna valor padrão baseado no tipo
   */
  private getDefaultValueForType(type: string): any {
    switch (type) {
      case 'text':
        return ''
      case 'number':
        return 0
      case 'select':
        return ''
      case 'multiselect':
        return []
      case 'date':
        return new Date()
      case 'boolean':
        return false
      default:
        return null
    }
  }

  /**
   * Parseia template a partir de arquivo de briefing
   */
  private async parseTemplateFromFile(type: BriefingType): Promise<BriefingTemplate> {
    // Por enquanto, retorna um template básico
    // Na implementação completa, isso leria os arquivos .md dos briefings
    return this.createBasicTemplate(type)
  }

  /**
   * Cria template básico para um tipo de briefing
   */
  private createBasicTemplate(type: BriefingType): BriefingTemplate {
    const templates: Record<BriefingType, Partial<BriefingTemplate>> = {
      'residencial_casa_padrao': {
        name: 'Casa Padrão Residencial',
        sections: [
          {
            id: 'dados_basicos',
            name: 'Dados Básicos',
            fields: [
              { name: 'nome_projeto', type: 'text', required: true, generator: 'project_name' },
              { name: 'orcamento_total', type: 'number', required: true, generator: 'budget' },
              { name: 'area_terreno', type: 'number', required: true, generator: 'land_area' },
              { name: 'quartos', type: 'number', required: true, generator: 'rooms' },
              { name: 'banheiros', type: 'number', required: true, generator: 'bathrooms' }
            ]
          }
        ]
      },
      'comercial_escritorio': {
        name: 'Escritório Comercial',
        sections: [
          {
            id: 'dados_basicos',
            name: 'Dados Básicos',
            fields: [
              { name: 'nome_empresa', type: 'text', required: true, generator: 'company_name' },
              { name: 'orcamento_total', type: 'number', required: true, generator: 'budget' },
              { name: 'area_total', type: 'number', required: true, generator: 'office_area' },
              { name: 'funcionarios', type: 'number', required: true, generator: 'employees' }
            ]
          }
        ]
      }
    }

    const baseTemplate = templates[type] || templates['residencial_casa_padrao']
    
    return {
      type,
      name: baseTemplate.name || `Template ${type}`,
      sections: baseTemplate.sections || [],
      rules: [],
      constraints: []
    }
  }

  /**
   * Avalia condição de regra
   */
  private evaluateCondition(condition: string, context: GenerationContext): boolean {
    // Implementação básica - pode ser expandida
    return true
  }

  /**
   * Executa ação de regra
   */
  private executeAction(action: string, value: any, context: GenerationContext): void {
    // Implementação básica - pode ser expandida
  }

  /**
   * Limpa cache de templates
   */
  clearCache(): void {
    this.templateCache.clear()
  }

  /**
   * Retorna estatísticas do cache
   */
  getCacheStats(): { size: number; types: BriefingType[] } {
    return {
      size: this.templateCache.size,
      types: Array.from(this.templateCache.keys())
    }
  }
}

// Instância singleton do engine
export const briefingTemplateEngine = new BriefingTemplateEngine()