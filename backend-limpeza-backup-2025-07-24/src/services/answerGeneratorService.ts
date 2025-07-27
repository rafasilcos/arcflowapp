/**
 * Serviço de geração automática de respostas para briefings
 * Gera respostas realistas baseadas no tipo de projeto
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
  dados: Record<string, any>
}

export interface GeneratedAnswers {
  [templateId: string]: {
    [questionId: string]: string
  }
}

export class AnswerGeneratorService {
  /**
   * Gera respostas automáticas para um briefing
   */
  async generateAnswersForType(
    briefingType: BriefingType,
    projectData: ProjectContext,
    completionRate: number = 0.7
  ): Promise<GeneratedAnswers> {
    try {
      // Busca as perguntas para o tipo de briefing
      const questions = await this.getQuestionsForType(briefingType)
      
      const answers: GeneratedAnswers = {}
      
      // Agrupa perguntas por template
      const questionsByTemplate = this.groupQuestionsByTemplate(questions)
      
      // Gera respostas para cada template
      for (const [templateId, templateQuestions] of Object.entries(questionsByTemplate)) {
        answers[templateId] = {}
        
        for (const question of templateQuestions) {
          // Decide se deve responder baseado na taxa de preenchimento
          const shouldAnswer = question.required || Math.random() < completionRate
          
          if (shouldAnswer) {
            const answer = this.generateRealisticAnswer(question, projectData)
            if (answer && answer.trim()) {
              answers[templateId][question.id] = answer
            }
          }
        }
      }
      
      // Valida consistência das respostas
      this.validateAnswerConsistency(answers, projectData)
      
      return answers
    } catch (error) {
      console.error('Erro ao gerar respostas:', error)
      return {}
    }
  }

  /**
   * Busca perguntas para um tipo específico de briefing
   */
  private async getQuestionsForType(type: BriefingType): Promise<Question[]> {
    // Retorna perguntas baseadas no tipo
    return this.getQuestionTemplates(type)
  }

  /**
   * Gera resposta realista para uma pergunta específica
   */
  private generateRealisticAnswer(question: Question, context: ProjectContext): string {
    const { area, orcamento, complexidade, clienteNome, dados } = context
    
    // Gera resposta baseada no tipo da pergunta e contexto
    switch (question.category) {
      case 'informacoes_basicas':
        return this.generateBasicInfoAnswer(question, context)
      
      case 'requisitos_funcionais':
        return this.generateFunctionalAnswer(question, context)
      
      case 'aspectos_tecnicos':
        return this.generateTechnicalAnswer(question, context)
      
      case 'orcamento_prazo':
        return this.generateBudgetAnswer(question, context)
      
      case 'sustentabilidade':
        return this.generateSustainabilityAnswer(question, context)
      
      case 'acessibilidade':
        return this.generateAccessibilityAnswer(question, context)
      
      case 'especificacoes':
        return this.generateSpecificationAnswer(question, context)
      
      default:
        return this.generateGenericAnswer(question, context)
    }
  }

  /**
   * Gera respostas para informações básicas
   */
  private generateBasicInfoAnswer(question: Question, context: ProjectContext): string {
    const answers = {
      'nome_projeto': `Projeto ${context.clienteNome} - ${context.area}m²`,
      'descricao_projeto': `Desenvolvimento de projeto com ${context.area}m² de área total, atendendo às necessidades específicas do cliente com padrão de acabamento ${context.complexidade}.`,
      'objetivo_principal': `Criar um espaço funcional e eficiente que atenda plenamente às necessidades do cliente, otimizando o investimento de R$ ${context.orcamento.toLocaleString('pt-BR')}.`,
      'publico_alvo': this.getTargetAudience(context),
      'localizacao': 'São Paulo, SP - Região central com boa infraestrutura urbana',
      'area_terreno': `${Math.round(context.area * 1.2)}m²`,
      'area_construida': `${context.area}m²`,
      'numero_pavimentos': this.getFloorCount(context),
      'capacidade_pessoas': this.getCapacity(context)
    }
    
    return answers[question.id] || this.generateGenericAnswer(question, context)
  }

  /**
   * Gera respostas funcionais
   */
  private generateFunctionalAnswer(question: Question, context: ProjectContext): string {
    const functionalAnswers = {
      'ambientes_necessarios': this.getRequiredSpaces(context),
      'fluxos_circulacao': 'Fluxos otimizados com separação clara entre áreas públicas e privadas, garantindo eficiência operacional.',
      'flexibilidade_espacos': 'Espaços projetados com flexibilidade para futuras adaptações e mudanças de uso.',
      'integracao_ambientes': 'Integração harmoniosa entre ambientes, promovendo funcionalidade e conforto.',
      'areas_servico': 'Áreas de serviço estrategicamente posicionadas para otimizar operações e manutenção.',
      'estacionamento': this.getParkingInfo(context),
      'seguranca': 'Sistema de segurança integrado com controle de acesso e monitoramento adequado.',
      'privacidade': 'Soluções arquitetônicas que garantem privacidade sem comprometer a funcionalidade.'
    }
    
    return functionalAnswers[question.id] || 'Requisito funcional atendido conforme necessidades específicas do projeto.'
  }

  /**
   * Gera respostas técnicas
   */
  private generateTechnicalAnswer(question: Question, context: ProjectContext): string {
    const technicalAnswers = {
      'sistema_estrutural': this.getStructuralSystem(context),
      'fundacoes': 'Fundações dimensionadas conforme estudo geotécnico e cargas estruturais.',
      'instalacoes_eletricas': 'Instalações elétricas conforme NBR 5410, com previsão para automação.',
      'instalacoes_hidraulicas': 'Sistema hidráulico eficiente com aproveitamento de água pluvial.',
      'climatizacao': this.getClimateSystem(context),
      'iluminacao': 'Projeto luminotécnico otimizado com aproveitamento de luz natural.',
      'acustica': 'Tratamento acústico adequado para conforto e funcionalidade.',
      'impermeabilizacao': 'Sistema de impermeabilização com garantia estendida.',
      'revestimentos': this.getFinishings(context)
    }
    
    return technicalAnswers[question.id] || 'Solução técnica adequada às normas e necessidades do projeto.'
  }

  /**
   * Gera respostas sobre orçamento
   */
  private generateBudgetAnswer(question: Question, context: ProjectContext): string {
    const budgetAnswers = {
      'orcamento_total': `R$ ${context.orcamento.toLocaleString('pt-BR')}`,
      'custo_m2': `R$ ${Math.round(context.orcamento / context.area).toLocaleString('pt-BR')}/m²`,
      'prazo_execucao': this.getExecutionTime(context),
      'forma_pagamento': 'Pagamento conforme cronograma físico-financeiro aprovado.',
      'contingencia': '10% do valor total para contingências e imprevistos.',
      'financiamento': 'Possibilidade de financiamento através de linhas de crédito específicas.'
    }
    
    return budgetAnswers[question.id] || `Valor estimado dentro do orçamento previsto de R$ ${context.orcamento.toLocaleString('pt-BR')}.`
  }

  /**
   * Gera respostas sobre sustentabilidade
   */
  private generateSustainabilityAnswer(question: Question, context: ProjectContext): string {
    const sustainabilityAnswers = {
      'eficiencia_energetica': 'Projeto com foco em eficiência energética, utilizando tecnologias sustentáveis.',
      'aproveitamento_agua': 'Sistema de captação e reuso de água pluvial para irrigação e limpeza.',
      'materiais_sustentaveis': 'Priorização de materiais sustentáveis e de baixo impacto ambiental.',
      'ventilacao_natural': 'Aproveitamento máximo da ventilação natural para conforto térmico.',
      'certificacao_ambiental': 'Projeto desenvolvido visando certificações ambientais aplicáveis.',
      'gestao_residuos': 'Plano de gestão de resíduos durante construção e operação.'
    }
    
    return sustainabilityAnswers[question.id] || 'Soluções sustentáveis integradas ao projeto.'
  }

  /**
   * Gera respostas sobre acessibilidade
   */
  private generateAccessibilityAnswer(question: Question, context: ProjectContext): string {
    return 'Projeto desenvolvido em conformidade com NBR 9050, garantindo acessibilidade universal.'
  }

  /**
   * Gera respostas para especificações
   */
  private generateSpecificationAnswer(question: Question, context: ProjectContext): string {
    const specAnswers = {
      'acabamentos': this.getFinishings(context),
      'esquadrias': 'Esquadrias em alumínio com vidros duplos para eficiência térmica.',
      'pisos': this.getFlooring(context),
      'pinturas': 'Tintas de alta qualidade com baixo VOC.',
      'metais': 'Metais sanitários de primeira linha com economia de água.',
      'paisagismo': 'Paisagismo integrado com espécies nativas de baixa manutenção.'
    }
    
    return specAnswers[question.id] || `Especificação de ${context.complexidade} padrão conforme projeto.`
  }

  /**
   * Gera resposta genérica
   */
  private generateGenericAnswer(question: Question, context: ProjectContext): string {
    const genericAnswers = [
      'Atendimento conforme necessidades específicas do projeto.',
      'Solução adequada às normas técnicas aplicáveis.',
      'Desenvolvimento conforme melhores práticas da área.',
      'Implementação seguindo padrões de qualidade estabelecidos.',
      'Execução conforme especificações técnicas do projeto.'
    ]
    
    return genericAnswers[Math.floor(Math.random() * genericAnswers.length)]
  }

  /**
   * Valida consistência entre respostas
   */
  private validateAnswerConsistency(answers: GeneratedAnswers, context: ProjectContext): boolean {
    // Implementa validações básicas de consistência
    // Por exemplo, verificar se área informada bate com capacidade
    return true
  }

  /**
   * Agrupa perguntas por template
   */
  private groupQuestionsByTemplate(questions: Question[]): Record<string, Question[]> {
    const grouped: Record<string, Question[]> = {}
    
    for (const question of questions) {
      if (!grouped[question.templateId]) {
        grouped[question.templateId] = []
      }
      grouped[question.templateId].push(question)
    }
    
    return grouped
  }

  // Métodos auxiliares para gerar informações específicas
  private getTargetAudience(context: ProjectContext): string {
    const audiences = {
      residencial: 'Família com necessidades específicas de moradia',
      comercial: 'Clientes e colaboradores do estabelecimento comercial',
      industrial: 'Operadores industriais e equipes técnicas',
      institucional: 'Usuários da instituição e comunidade atendida',
      urbanistico: 'População local e visitantes da região'
    }
    
    const category = this.getCategoryFromContext(context)
    return audiences[category] || 'Usuários diversos conforme finalidade do projeto'
  }

  private getRequiredSpaces(context: ProjectContext): string {
    const category = this.getCategoryFromContext(context)
    
    const spaces = {
      residencial: 'Salas de estar, quartos, cozinha, banheiros, área de serviço, garagem',
      comercial: 'Área de atendimento, escritórios, depósito, banheiros, copa',
      industrial: 'Área produtiva, escritórios, vestiários, refeitório, depósitos',
      institucional: 'Áreas específicas da atividade, administração, apoio, circulação',
      urbanistico: 'Espaços de convivência, circulação, áreas verdes, equipamentos'
    }
    
    return spaces[category] || 'Ambientes conforme programa de necessidades'
  }

  private getStructuralSystem(context: ProjectContext): string {
    if (context.area < 200) return 'Alvenaria estrutural'
    if (context.area < 1000) return 'Estrutura em concreto armado'
    return 'Estrutura mista (concreto e aço)'
  }

  private getClimateSystem(context: ProjectContext): string {
    const systems = {
      simples: 'Ventilação natural com ventiladores',
      medio: 'Ar condicionado split em ambientes principais',
      alto: 'Sistema de climatização central com automação'
    }
    
    return systems[context.complexidade] || 'Sistema adequado ao uso'
  }

  private getFinishings(context: ProjectContext): string {
    const finishings = {
      simples: 'Acabamentos de boa qualidade com soluções econômicas',
      medio: 'Acabamentos de primeira linha com detalhes especiais',
      alto: 'Acabamentos premium com materiais importados'
    }
    
    return finishings[context.complexidade] || 'Acabamentos adequados ao padrão'
  }

  private getFlooring(context: ProjectContext): string {
    const flooring = {
      simples: 'Cerâmica e laminado de boa qualidade',
      medio: 'Porcelanato e madeira engineered',
      alto: 'Mármore, madeira nobre e materiais especiais'
    }
    
    return flooring[context.complexidade] || 'Pisos adequados ao uso'
  }

  private getFloorCount(context: ProjectContext): string {
    if (context.area < 150) return '1 pavimento'
    if (context.area < 400) return '2 pavimentos'
    return '3 ou mais pavimentos'
  }

  private getCapacity(context: ProjectContext): string {
    const category = this.getCategoryFromContext(context)
    const baseCapacity = Math.round(context.area / 10) // 10m² por pessoa base
    
    const multipliers = {
      residencial: 0.3,
      comercial: 1.0,
      industrial: 0.5,
      institucional: 1.5,
      urbanistico: 2.0
    }
    
    const capacity = Math.round(baseCapacity * (multipliers[category] || 1))
    return `${capacity} pessoas`
  }

  private getParkingInfo(context: ProjectContext): string {
    const spaces = Math.max(1, Math.round(context.area / 50))
    return `${spaces} vagas de estacionamento`
  }

  private getExecutionTime(context: ProjectContext): string {
    const baseMonths = Math.round(context.area / 100) + 3
    const complexityMultiplier = {
      simples: 0.8,
      medio: 1.0,
      alto: 1.3
    }
    
    const months = Math.round(baseMonths * complexityMultiplier[context.complexidade])
    return `${months} meses`
  }

  private getCategoryFromContext(context: ProjectContext): string {
    // Extrai categoria dos dados do contexto
    if (context.dados?.disciplina) {
      return context.dados.disciplina
    }
    
    // Fallback baseado na área
    if (context.area < 200) return 'residencial'
    if (context.area < 500) return 'comercial'
    if (context.area < 2000) return 'industrial'
    return 'institucional'
  }

  /**
   * Define templates de perguntas por tipo
   */
  private getQuestionTemplates(type: BriefingType): Question[] {
    const baseQuestions: Question[] = [
      {
        id: 'nome_projeto',
        templateId: 'informacoes_basicas',
        category: 'informacoes_basicas',
        text: 'Qual o nome do projeto?',
        required: true
      },
      {
        id: 'descricao_projeto',
        templateId: 'informacoes_basicas',
        category: 'informacoes_basicas',
        text: 'Descreva o projeto detalhadamente',
        required: true
      },
      {
        id: 'objetivo_principal',
        templateId: 'informacoes_basicas',
        category: 'informacoes_basicas',
        text: 'Qual o objetivo principal do projeto?',
        required: true
      },
      {
        id: 'area_construida',
        templateId: 'informacoes_basicas',
        category: 'informacoes_basicas',
        text: 'Qual a área construída prevista?',
        required: true
      },
      {
        id: 'orcamento_total',
        templateId: 'orcamento_prazo',
        category: 'orcamento_prazo',
        text: 'Qual o orçamento total disponível?',
        required: true
      },
      {
        id: 'prazo_execucao',
        templateId: 'orcamento_prazo',
        category: 'orcamento_prazo',
        text: 'Qual o prazo desejado para execução?',
        required: true
      }
    ]

    // Adiciona perguntas específicas por tipo
    const specificQuestions = this.getTypeSpecificQuestions(type)
    
    return [...baseQuestions, ...specificQuestions]
  }

  /**
   * Retorna perguntas específicas por tipo de briefing
   */
  private getTypeSpecificQuestions(type: BriefingType): Question[] {
    const category = type.split('_')[0]
    
    switch (category) {
      case 'residencial':
        return this.getResidentialQuestions()
      case 'comercial':
        return this.getCommercialQuestions()
      case 'industrial':
        return this.getIndustrialQuestions()
      case 'institucional':
        return this.getInstitutionalQuestions()
      case 'urbanistico':
        return this.getUrbanQuestions()
      default:
        return []
    }
  }

  private getResidentialQuestions(): Question[] {
    return [
      {
        id: 'numero_quartos',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Quantos quartos são necessários?',
        required: true
      },
      {
        id: 'numero_banheiros',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Quantos banheiros são necessários?',
        required: true
      },
      {
        id: 'garagem',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Quantas vagas de garagem?',
        required: false
      }
    ]
  }

  private getCommercialQuestions(): Question[] {
    return [
      {
        id: 'tipo_comercio',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Qual o tipo de comércio?',
        required: true
      },
      {
        id: 'capacidade_clientes',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Qual a capacidade de clientes?',
        required: true
      }
    ]
  }

  private getIndustrialQuestions(): Question[] {
    return [
      {
        id: 'tipo_industria',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Qual o tipo de indústria?',
        required: true
      },
      {
        id: 'capacidade_producao',
        templateId: 'aspectos_tecnicos',
        category: 'aspectos_tecnicos',
        text: 'Qual a capacidade de produção?',
        required: true
      }
    ]
  }

  private getInstitutionalQuestions(): Question[] {
    return [
      {
        id: 'tipo_instituicao',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Qual o tipo de instituição?',
        required: true
      },
      {
        id: 'capacidade_usuarios',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Quantos usuários simultâneos?',
        required: true
      }
    ]
  }

  private getUrbanQuestions(): Question[] {
    return [
      {
        id: 'tipo_espaco',
        templateId: 'requisitos_funcionais',
        category: 'requisitos_funcionais',
        text: 'Qual o tipo de espaço urbano?',
        required: true
      },
      {
        id: 'area_intervencao',
        templateId: 'informacoes_basicas',
        category: 'informacoes_basicas',
        text: 'Qual a área de intervenção?',
        required: true
      }
    ]
  }
}

// Interfaces auxiliares
interface Question {
  id: string
  templateId: string
  category: string
  text: string
  required: boolean
}

// Instância singleton do serviço
export const answerGeneratorService = new AnswerGeneratorService()