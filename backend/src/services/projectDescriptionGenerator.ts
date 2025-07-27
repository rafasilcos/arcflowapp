/**
 * Gerador de descrições detalhadas e prazos para projetos
 * Usado pelo sistema de geração de dados de teste
 */

export type BriefingType = 
  | 'residencial_casa_padrao'
  | 'residencial_sobrado'
  | 'residencial_apartamento'
  | 'comercial_escritorio'
  | 'comercial_loja'
  | 'comercial_restaurante'
  | 'comercial_hotel'
  | 'industrial_fabrica'
  | 'industrial_galpao'
  | 'industrial_centro_logistico'
  | 'institucional_escola'
  | 'institucional_hospital'
  | 'institucional_templo'
  | 'urbanistico_espacos_publicos'
  | 'urbanistico_loteamentos'
  | 'urbanistico_planos_urbanos'

export interface ProjectContext {
  area: number
  orcamento: number
  complexidade: 'simples' | 'medio' | 'alto'
  clienteNome: string
}

export class ProjectDescriptionGenerator {
  /**
   * Gera descrição detalhada baseada no tipo de projeto
   */
  generateDetailedDescription(type: BriefingType, context: ProjectContext): string {
    const baseDescription = this.getBaseDescription(type, context)
    const specificDetails = this.getSpecificDetails(type, context)
    const objectives = this.getProjectObjectives(type, context)
    const constraints = this.getProjectConstraints(type, context)

    return `${baseDescription}\n\n${specificDetails}\n\n${objectives}\n\n${constraints}`.trim()
  }

  /**
   * Gera prazo estimado realista baseado no tipo e complexidade
   */
  generateRealisticDeadline(type: BriefingType, context: ProjectContext): string {
    const baseMonths = this.getBaseTimelineMonths(type)
    const complexityMultiplier = this.getComplexityMultiplier(context.complexidade)
    const areaMultiplier = this.getAreaMultiplier(type, context.area)
    
    const totalMonths = Math.round(baseMonths * complexityMultiplier * areaMultiplier)
    const finalMonths = Math.max(1, Math.min(36, totalMonths)) // Entre 1 e 36 meses
    
    const today = new Date()
    const deadline = new Date(today)
    deadline.setMonth(today.getMonth() + finalMonths)
    
    return deadline.toISOString().split('T')[0] // Formato YYYY-MM-DD
  }

  /**
   * Gera orçamento estimado baseado no tipo e área
   */
  generateRealisticBudget(type: BriefingType, area: number, complexidade: 'simples' | 'medio' | 'alto'): number {
    const basePricePerM2 = this.getBasePricePerM2(type)
    const complexityMultiplier = this.getComplexityMultiplier(complexidade)
    const locationMultiplier = 1.2 // Fator São Paulo
    
    const basePrice = area * basePricePerM2 * complexityMultiplier * locationMultiplier
    
    // Adiciona variação de ±20%
    const variation = 0.8 + Math.random() * 0.4
    
    return Math.round(basePrice * variation)
  }

  private getBaseDescription(type: BriefingType, context: ProjectContext): string {
    const descriptions = {
      residencial_casa_padrao: `Projeto de casa residencial unifamiliar para ${context.clienteNome}, com área total de ${context.area}m². O projeto visa criar um ambiente familiar confortável e funcional, atendendo às necessidades específicas dos moradores.`,
      
      residencial_sobrado: `Desenvolvimento de sobrado residencial para ${context.clienteNome}, totalizando ${context.area}m² distribuídos em dois pavimentos. O projeto busca otimizar o aproveitamento do terreno mantendo conforto e privacidade.`,
      
      residencial_apartamento: `Projeto de apartamento residencial para ${context.clienteNome}, com ${context.area}m² de área útil. O foco está na funcionalidade dos espaços e na criação de ambientes integrados e bem iluminados.`,
      
      comercial_escritorio: `Desenvolvimento de espaço corporativo para ${context.clienteNome}, com ${context.area}m² de área útil. O projeto visa criar um ambiente de trabalho produtivo, moderno e alinhado com a identidade da empresa.`,
      
      comercial_loja: `Projeto de espaço comercial para ${context.clienteNome}, totalizando ${context.area}m². O objetivo é criar um ambiente atrativo para clientes, otimizando o fluxo de pessoas e a exposição de produtos.`,
      
      comercial_restaurante: `Desenvolvimento de restaurante para ${context.clienteNome}, com ${context.area}m² de área total. O projeto foca na criação de ambientes acolhedores para clientes e áreas funcionais para operação.`,
      
      comercial_hotel: `Projeto hoteleiro para ${context.clienteNome}, abrangendo ${context.area}m² de área construída. O desenvolvimento visa proporcionar conforto aos hóspedes e eficiência operacional.`,
      
      industrial_fabrica: `Projeto industrial para ${context.clienteNome}, com ${context.area}m² de área fabril. O foco está na otimização dos processos produtivos, segurança operacional e eficiência logística.`,
      
      industrial_galpao: `Desenvolvimento de galpão industrial para ${context.clienteNome}, totalizando ${context.area}m². O projeto visa maximizar o aproveitamento do espaço para armazenagem e operações industriais.`,
      
      industrial_centro_logistico: `Projeto de centro logístico para ${context.clienteNome}, com ${context.area}m² de área operacional. O objetivo é otimizar fluxos de mercadorias e operações de distribuição.`,
      
      institucional_escola: `Desenvolvimento de projeto educacional para ${context.clienteNome}, abrangendo ${context.area}m². O foco está na criação de ambientes pedagógicos adequados e seguros para o aprendizado.`,
      
      institucional_hospital: `Projeto de unidade de saúde para ${context.clienteNome}, com ${context.area}m² de área construída. O desenvolvimento prioriza funcionalidade, segurança e conforto para pacientes e profissionais.`,
      
      institucional_templo: `Projeto de templo religioso para ${context.clienteNome}, totalizando ${context.area}m². O objetivo é criar um espaço sagrado que proporcione acolhimento e contemplação.`,
      
      urbanistico_espacos_publicos: `Projeto urbanístico de espaços públicos para ${context.clienteNome}, abrangendo ${context.area}m². O foco está na criação de áreas de convivência e lazer para a comunidade.`,
      
      urbanistico_loteamentos: `Desenvolvimento de loteamento para ${context.clienteNome}, com ${context.area}m² de área total. O projeto visa criar um bairro planejado com infraestrutura adequada e qualidade de vida.`,
      
      urbanistico_planos_urbanos: `Projeto de planejamento urbano para ${context.clienteNome}, abrangendo ${context.area}m². O objetivo é desenvolver diretrizes para o crescimento ordenado e sustentável da região.`
    }

    return descriptions[type] || `Projeto ${type.replace(/_/g, ' ')} para ${context.clienteNome}, com ${context.area}m² de área total.`
  }

  private getSpecificDetails(type: BriefingType, context: ProjectContext): string {
    const category = type.split('_')[0]
    
    switch (category) {
      case 'residencial':
        return `CARACTERÍSTICAS ESPECÍFICAS:\n• Ambientes integrados e funcionais\n• Aproveitamento de iluminação natural\n• Áreas de convivência familiar\n• Soluções sustentáveis e eficientes\n• Acabamentos de ${context.complexidade} padrão`
      
      case 'comercial':
        return `CARACTERÍSTICAS ESPECÍFICAS:\n• Layout otimizado para operação comercial\n• Identidade visual alinhada com a marca\n• Fluxos de clientes bem definidos\n• Tecnologia integrada\n• Padrão de acabamento ${context.complexidade}`
      
      case 'industrial':
        return `CARACTERÍSTICAS ESPECÍFICAS:\n• Otimização de processos produtivos\n• Segurança operacional prioritária\n• Eficiência energética\n• Flexibilidade para expansões futuras\n• Conformidade com normas técnicas`
      
      case 'institucional':
        return `CARACTERÍSTICAS ESPECÍFICAS:\n• Funcionalidade específica da atividade\n• Acessibilidade universal\n• Conforto ambiental\n• Segurança e durabilidade\n• Manutenção simplificada`
      
      case 'urbanistico':
        return `CARACTERÍSTICAS ESPECÍFICAS:\n• Integração com o entorno urbano\n• Sustentabilidade ambiental\n• Mobilidade urbana\n• Infraestrutura adequada\n• Qualidade de vida urbana`
      
      default:
        return `CARACTERÍSTICAS ESPECÍFICAS:\n• Funcionalidade otimizada\n• Qualidade construtiva\n• Sustentabilidade\n• Eficiência operacional`
    }
  }

  private getProjectObjectives(type: BriefingType, context: ProjectContext): string {
    return `OBJETIVOS DO PROJETO:\n• Atender plenamente às necessidades do cliente\n• Otimizar o investimento de R$ ${context.orcamento.toLocaleString('pt-BR')}\n• Garantir qualidade e durabilidade da construção\n• Cumprir prazos estabelecidos\n• Seguir todas as normas técnicas e legais aplicáveis`
  }

  private getProjectConstraints(type: BriefingType, context: ProjectContext): string {
    return `PREMISSAS E RESTRIÇÕES:\n• Orçamento máximo: R$ ${context.orcamento.toLocaleString('pt-BR')}\n• Área disponível: ${context.area}m²\n• Complexidade: ${context.complexidade}\n• Conformidade com legislação local\n• Sustentabilidade e eficiência energética`
  }

  private getBaseTimelineMonths(type: BriefingType): number {
    const timelines = {
      residencial_casa_padrao: 8,
      residencial_sobrado: 10,
      residencial_apartamento: 6,
      comercial_escritorio: 4,
      comercial_loja: 3,
      comercial_restaurante: 5,
      comercial_hotel: 12,
      industrial_fabrica: 15,
      industrial_galpao: 6,
      industrial_centro_logistico: 10,
      institucional_escola: 12,
      institucional_hospital: 18,
      institucional_templo: 8,
      urbanistico_espacos_publicos: 6,
      urbanistico_loteamentos: 24,
      urbanistico_planos_urbanos: 18
    }

    return timelines[type] || 8
  }

  private getComplexityMultiplier(complexidade: 'simples' | 'medio' | 'alto'): number {
    const multipliers = {
      simples: 0.8,
      medio: 1.0,
      alto: 1.4
    }

    return multipliers[complexidade] || 1.0
  }

  private getAreaMultiplier(type: BriefingType, area: number): number {
    const category = type.split('_')[0]
    
    // Faixas de área por categoria
    const areaRanges = {
      residencial: { small: 100, large: 300 },
      comercial: { small: 50, large: 200 },
      industrial: { small: 500, large: 2000 },
      institucional: { small: 200, large: 1000 },
      urbanistico: { small: 1000, large: 10000 }
    }

    const range = areaRanges[category as keyof typeof areaRanges] || areaRanges.residencial
    
    if (area <= range.small) return 0.9
    if (area >= range.large) return 1.3
    return 1.0
  }

  private getBasePricePerM2(type: BriefingType): number {
    const prices = {
      residencial_casa_padrao: 2500,
      residencial_sobrado: 2800,
      residencial_apartamento: 3000,
      comercial_escritorio: 2000,
      comercial_loja: 1800,
      comercial_restaurante: 3500,
      comercial_hotel: 4000,
      industrial_fabrica: 1500,
      industrial_galpao: 800,
      industrial_centro_logistico: 1200,
      institucional_escola: 2200,
      institucional_hospital: 5000,
      institucional_templo: 2500,
      urbanistico_espacos_publicos: 500,
      urbanistico_loteamentos: 300,
      urbanistico_planos_urbanos: 100
    }

    return prices[type] || 2000
  }
}

// Instância singleton do serviço
export const projectDescriptionGenerator = new ProjectDescriptionGenerator()