/**
 * Provedor de Dados Realistas para Testes
 * Gera dados brasileiros válidos e realistas para preenchimento automático
 */

export interface BrazilianAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface BudgetRange {
  min: number
  max: number
  typical: number
}

export interface AreaRange {
  min: number
  max: number
  typical: number
}

/**
 * Service para geração de dados realistas brasileiros
 */
export class RealisticDataProvider {
  private readonly brazilianNames = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza',
    'Fernanda Lima', 'Ricardo Almeida', 'Juliana Ferreira', 'Marcos Rodrigues',
    'Patricia Martins', 'Rafael Silveira', 'Camila Barbosa', 'Bruno Carvalho',
    'Larissa Pereira', 'Diego Nascimento', 'Gabriela Ribeiro', 'Lucas Araújo',
    'Mariana Gomes', 'Felipe Dias', 'Isabela Moreira'
  ]

  private readonly companyNames = [
    'Construtora Horizonte Ltda', 'Arquitetura & Design Silva',
    'Engenharia Moderna S/A', 'Projetos Inovadores Ltda',
    'Construções Premium', 'Arquitetos Associados',
    'Engenharia Sustentável', 'Design Contemporâneo',
    'Construtora Família', 'Projetos Residenciais Plus'
  ]

  private readonly brazilianCities = [
    { city: 'São Paulo', state: 'SP', neighborhoods: ['Vila Madalena', 'Pinheiros', 'Moema', 'Jardins'] },
    { city: 'Rio de Janeiro', state: 'RJ', neighborhoods: ['Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca'] },
    { city: 'Belo Horizonte', state: 'MG', neighborhoods: ['Savassi', 'Funcionários', 'Lourdes', 'Belvedere'] },
    { city: 'Porto Alegre', state: 'RS', neighborhoods: ['Moinhos de Vento', 'Auxiliadora', 'Petrópolis', 'Bela Vista'] },
    { city: 'Curitiba', state: 'PR', neighborhoods: ['Batel', 'Água Verde', 'Bigorrilho', 'Centro Cívico'] }
  ]

  private readonly streetTypes = ['Rua', 'Avenida', 'Alameda', 'Travessa', 'Praça']
  private readonly streetNames = [
    'das Flores', 'do Sol', 'da Paz', 'dos Pinheiros', 'das Palmeiras',
    'Central', 'Principal', 'da Liberdade', 'do Comércio', 'da Independência'
  ]

  /**
   * Gera um nome brasileiro aleatório
   */
  getRandomName(): string {
    return this.brazilianNames[Math.floor(Math.random() * this.brazilianNames.length)]
  }

  /**
   * Gera um endereço brasileiro válido
   */
  getRandomAddress(): BrazilianAddress {
    const cityData = this.brazilianCities[Math.floor(Math.random() * this.brazilianCities.length)]
    const streetType = this.streetTypes[Math.floor(Math.random() * this.streetTypes.length)]
    const streetName = this.streetNames[Math.floor(Math.random() * this.streetNames.length)]
    const neighborhood = cityData.neighborhoods[Math.floor(Math.random() * cityData.neighborhoods.length)]

    return {
      street: `${streetType} ${streetName}`,
      number: Math.floor(Math.random() * 9999 + 1).toString(),
      complement: Math.random() > 0.7 ? `Apto ${Math.floor(Math.random() * 200 + 1)}` : undefined,
      neighborhood,
      city: cityData.city,
      state: cityData.state,
      zipCode: this.generateZipCode()
    }
  }

  /**
   * Gera um nome de empresa brasileiro
   */
  getRandomCompanyName(): string {
    return this.companyNames[Math.floor(Math.random() * this.companyNames.length)]
  }

  /**
   * Gera um telefone brasileiro válido
   */
  getRandomPhoneNumber(): string {
    const ddd = Math.floor(Math.random() * 89 + 11) // DDDs de 11 a 99
    const firstDigit = Math.random() > 0.5 ? '9' : '8' // Celular ou fixo
    const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    
    return `(${ddd}) ${firstDigit}${number.substring(0, 4)}-${number.substring(4)}`
  }

  /**
   * Gera um email válido
   */
  getRandomEmail(): string {
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br']
    const name = this.getRandomName().toLowerCase().replace(' ', '.')
    const domain = domains[Math.floor(Math.random() * domains.length)]
    
    return `${name}@${domain}`
  }

  /**
   * Gera um CPF válido
   */
  getRandomCPF(): string {
    // Gera CPF válido com algoritmo de verificação
    const cpf = []
    
    // Gera os 9 primeiros dígitos
    for (let i = 0; i < 9; i++) {
      cpf[i] = Math.floor(Math.random() * 10)
    }
    
    // Calcula o primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += cpf[i] * (10 - i)
    }
    cpf[9] = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    
    // Calcula o segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += cpf[i] * (11 - i)
    }
    cpf[10] = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    
    return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Gera um CNPJ válido
   */
  getRandomCNPJ(): string {
    // Gera CNPJ válido com algoritmo de verificação
    const cnpj = []
    
    // Gera os 12 primeiros dígitos
    for (let i = 0; i < 12; i++) {
      cnpj[i] = Math.floor(Math.random() * 10)
    }
    
    // Calcula o primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += cnpj[i] * weights1[i]
    }
    cnpj[12] = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    
    // Calcula o segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += cnpj[i] * weights2[i]
    }
    cnpj[13] = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    
    return cnpj.join('').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  /**
   * Retorna faixa de orçamento baseada no tipo e complexidade do projeto
   */
  getBudgetRange(projectType: string, complexity: string): BudgetRange {
    const baseRanges: Record<string, BudgetRange> = {
      'residencial_casa_padrao': { min: 300000, max: 800000, typical: 500000 },
      'residencial_sobrado': { min: 400000, max: 1200000, typical: 700000 },
      'residencial_apartamento': { min: 200000, max: 600000, typical: 350000 },
      'comercial_escritorio': { min: 50000, max: 300000, typical: 150000 },
      'comercial_loja': { min: 80000, max: 400000, typical: 200000 },
      'comercial_restaurante': { min: 150000, max: 600000, typical: 300000 },
      'comercial_hotel': { min: 500000, max: 2000000, typical: 1000000 },
      'industrial_fabrica': { min: 800000, max: 5000000, typical: 2000000 },
      'industrial_galpao': { min: 300000, max: 1500000, typical: 700000 },
      'institucional_escola': { min: 600000, max: 3000000, typical: 1200000 },
      'institucional_hospital': { min: 1000000, max: 8000000, typical: 3000000 }
    }

    const base = baseRanges[projectType] || { min: 100000, max: 500000, typical: 250000 }
    
    // Ajusta baseado na complexidade
    const multipliers = {
      'simples': 0.7,
      'medio': 1.0,
      'alto': 1.5
    }
    
    const multiplier = multipliers[complexity as keyof typeof multipliers] || 1.0
    
    return {
      min: Math.round(base.min * multiplier),
      max: Math.round(base.max * multiplier),
      typical: Math.round(base.typical * multiplier)
    }
  }

  /**
   * Retorna faixa de área baseada no tipo de construção
   */
  getAreaRange(buildingType: string): AreaRange {
    const areaRanges: Record<string, AreaRange> = {
      'residencial_casa_padrao': { min: 80, max: 300, typical: 150 },
      'residencial_sobrado': { min: 120, max: 400, typical: 200 },
      'residencial_apartamento': { min: 45, max: 150, typical: 80 },
      'comercial_escritorio': { min: 30, max: 200, typical: 80 },
      'comercial_loja': { min: 50, max: 300, typical: 120 },
      'comercial_restaurante': { min: 80, max: 400, typical: 180 },
      'comercial_hotel': { min: 500, max: 3000, typical: 1200 },
      'industrial_fabrica': { min: 300, max: 5000, typical: 1500 },
      'industrial_galpao': { min: 200, max: 2000, typical: 800 },
      'institucional_escola': { min: 400, max: 2500, typical: 1000 },
      'institucional_hospital': { min: 800, max: 5000, typical: 2000 }
    }

    return areaRanges[buildingType] || { min: 50, max: 200, typical: 100 }
  }

  /**
   * Gera um CEP brasileiro válido
   */
  private generateZipCode(): string {
    const first = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
    const second = Math.floor(Math.random() * 999).toString().padStart(3, '0')
    return `${first}-${second}`
  }

  /**
   * Gera uma data aleatória dentro de um intervalo
   */
  getRandomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime()
    const end = endDate.getTime()
    const randomTime = start + Math.random() * (end - start)
    return new Date(randomTime)
  }

  /**
   * Gera um valor aleatório dentro de uma faixa
   */
  getRandomValueInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Seleciona um item aleatório de uma lista
   */
  getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Gera valores monetários realistas por faixa de projeto
   */
  generateMonetaryValue(projectType: string, complexity: string, fieldType: 'budget' | 'cost' | 'fee'): number {
    const budgetRange = this.getBudgetRange(projectType, complexity)
    
    switch (fieldType) {
      case 'budget':
        return this.getRandomValueInRange(budgetRange.min, budgetRange.max)
      case 'cost':
        // Custo é tipicamente 70-85% do orçamento
        const costMultiplier = 0.7 + Math.random() * 0.15
        return Math.round(budgetRange.typical * costMultiplier)
      case 'fee':
        // Honorários são tipicamente 8-15% do orçamento
        const feeMultiplier = 0.08 + Math.random() * 0.07
        return Math.round(budgetRange.typical * feeMultiplier)
      default:
        return budgetRange.typical
    }
  }

  /**
   * Gera áreas e medidas realistas
   */
  generateAreaValue(buildingType: string, areaType: 'total' | 'built' | 'land' | 'room'): number {
    const areaRange = this.getAreaRange(buildingType)
    
    switch (areaType) {
      case 'total':
        return this.getRandomValueInRange(areaRange.min, areaRange.max)
      case 'built':
        // Área construída é tipicamente 60-80% da área total
        const builtMultiplier = 0.6 + Math.random() * 0.2
        return Math.round(areaRange.typical * builtMultiplier)
      case 'land':
        // Área do terreno é tipicamente 1.2-2x a área construída
        const landMultiplier = 1.2 + Math.random() * 0.8
        return Math.round(areaRange.typical * landMultiplier)
      case 'room':
        // Área de cômodo varia conforme o tipo
        const roomSizes = {
          'quarto': [9, 20],
          'sala': [15, 40],
          'cozinha': [8, 25],
          'banheiro': [3, 8],
          'escritorio': [10, 30]
        }
        const defaultRange = [10, 25]
        return this.getRandomValueInRange(defaultRange[0], defaultRange[1])
      default:
        return areaRange.typical
    }
  }

  /**
   * Gera datas contextuais para projetos
   */
  generateContextualDate(dateType: 'start' | 'deadline' | 'approval' | 'delivery'): Date {
    const now = new Date()
    
    switch (dateType) {
      case 'start':
        // Data de início: entre hoje e 30 dias no futuro
        return this.getRandomDate(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))
      case 'deadline':
        // Prazo: entre 3 e 18 meses no futuro
        const minDeadline = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
        const maxDeadline = new Date(now.getTime() + 540 * 24 * 60 * 60 * 1000)
        return this.getRandomDate(minDeadline, maxDeadline)
      case 'approval':
        // Aprovação: entre 30 e 90 dias no futuro
        const minApproval = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        const maxApproval = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
        return this.getRandomDate(minApproval, maxApproval)
      case 'delivery':
        // Entrega: entre 6 e 24 meses no futuro
        const minDelivery = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)
        const maxDelivery = new Date(now.getTime() + 720 * 24 * 60 * 60 * 1000)
        return this.getRandomDate(minDelivery, maxDelivery)
      default:
        return new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)
    }
  }

  /**
   * Gera textos descritivos coerentes por contexto
   */
  generateDescriptiveText(context: string, length: 'short' | 'medium' | 'long' = 'medium'): string {
    const templates = {
      'projeto_descricao': {
        short: [
          'Projeto residencial moderno com foco em funcionalidade.',
          'Empreendimento comercial de alto padrão.',
          'Reforma completa com conceito contemporâneo.',
          'Nova construção seguindo padrões sustentáveis.'
        ],
        medium: [
          'Projeto arquitetônico residencial que busca integrar funcionalidade e estética moderna, priorizando o conforto dos usuários e a otimização dos espaços disponíveis.',
          'Desenvolvimento de projeto comercial com conceito inovador, focando na experiência do cliente e na eficiência operacional do negócio.',
          'Reforma e modernização de edificação existente, mantendo características originais e incorporando soluções contemporâneas de design.',
          'Nova construção residencial com conceitos de sustentabilidade, aproveitamento de luz natural e integração com área externa.'
        ],
        long: [
          'Projeto arquitetônico completo para residência unifamiliar de alto padrão, contemplando conceitos modernos de design, sustentabilidade e funcionalidade. O projeto busca integrar os ambientes internos e externos, priorizando a entrada de luz natural, ventilação cruzada e o uso de materiais sustentáveis. A proposta inclui ambientes amplos e integrados, com foco no conforto térmico e acústico dos usuários.',
          'Desenvolvimento de projeto comercial inovador para escritório corporativo, com foco na produtividade e bem-estar dos colaboradores. O conceito arquitetônico prioriza espaços colaborativos, áreas de descanso e a integração de tecnologias modernas. A proposta inclui soluções sustentáveis de iluminação, climatização e acústica, visando certificação ambiental.'
        ]
      },
      'observacoes': {
        short: [
          'Cliente prioriza prazo de entrega.',
          'Orçamento limitado, buscar soluções econômicas.',
          'Necessário aprovação na prefeitura.',
          'Terreno com declive acentuado.'
        ],
        medium: [
          'Cliente tem urgência na entrega do projeto devido a cronograma de obra já definido. Necessário agilizar processo de aprovação.',
          'Orçamento restrito exige soluções criativas e econômicas, priorizando funcionalidade sem comprometer qualidade.',
          'Terreno localizado em área de preservação ambiental, necessário estudo de impacto e aprovações especiais.',
          'Projeto deve considerar ampliação futura, deixando infraestrutura preparada para expansão.'
        ],
        long: [
          'Projeto desenvolvido para cliente com necessidades específicas de acessibilidade, incluindo rampas, elevador e banheiros adaptados. O cronograma é apertado devido ao prazo de financiamento já aprovado. É fundamental manter comunicação constante com o cliente para validação de cada etapa do projeto.',
          'Empreendimento localizado em zona histórica da cidade, exigindo aprovação do patrimônio histórico. O projeto deve respeitar gabaritos e materiais específicos, mantendo harmonia com o entorno. Orçamento permite soluções de qualidade, mas dentro dos padrões estabelecidos pelos órgãos competentes.'
        ]
      }
    }

    const contextTemplates = templates[context as keyof typeof templates] || templates['projeto_descricao']
    const lengthTemplates = contextTemplates[length]
    
    return this.getRandomFromArray(lengthTemplates)
  }

  /**
   * Gera quantidades realistas por tipo
   */
  generateQuantity(itemType: string): number {
    const quantities = {
      'quartos': [2, 3, 4, 5],
      'banheiros': [1, 2, 3, 4],
      'vagas_garagem': [1, 2, 3, 4],
      'pavimentos': [1, 2, 3],
      'funcionarios': [5, 10, 15, 20, 25, 30, 50],
      'mesas_trabalho': [10, 15, 20, 30, 40],
      'salas_reuniao': [1, 2, 3, 4],
      'pessoas_familia': [2, 3, 4, 5],
      'anos_experiencia': [1, 2, 3, 5, 8, 10, 15, 20]
    }

    const options = quantities[itemType as keyof typeof quantities] || [1, 2, 3]
    return this.getRandomFromArray(options)
  }

  /**
   * Gera seleções realistas para campos de múltipla escolha
   */
  generateSelection(fieldType: string, options: string[]): string | string[] {
    if (options.length === 0) return ''

    const selectionPatterns = {
      'single': () => this.getRandomFromArray(options),
      'multiple_few': () => {
        const count = Math.min(2, Math.floor(Math.random() * 3) + 1)
        const shuffled = [...options].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
      },
      'multiple_many': () => {
        const count = Math.min(options.length, Math.floor(Math.random() * 4) + 2)
        const shuffled = [...options].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
      }
    }

    // Determina padrão baseado no tipo de campo
    if (fieldType.includes('multi') || fieldType.includes('varios')) {
      return Math.random() > 0.5 ? 
        selectionPatterns.multiple_few() : 
        selectionPatterns.multiple_many()
    }

    return selectionPatterns.single()
  }

  /**
   * Gera valores booleanos com probabilidades realistas
   */
  generateBoolean(context: string): boolean {
    const probabilities = {
      'tem_jardim': 0.7,
      'tem_piscina': 0.3,
      'tem_churrasqueira': 0.6,
      'precisa_elevador': 0.2,
      'tem_garagem': 0.9,
      'aceita_financiamento': 0.8,
      'urgente': 0.3,
      'flexivel_prazo': 0.6,
      'orcamento_aprovado': 0.7,
      'documentacao_ok': 0.8
    }

    const probability = probabilities[context as keyof typeof probabilities] || 0.5
    return Math.random() < probability
  }

  /**
   * Gera profissões brasileiras comuns
   */
  getRandomProfession(): string {
    const professions = [
      'Engenheiro Civil', 'Arquiteto', 'Médico', 'Advogado', 'Contador',
      'Empresário', 'Professor', 'Dentista', 'Veterinário', 'Farmacêutico',
      'Administrador', 'Economista', 'Psicólogo', 'Fisioterapeuta', 'Nutricionista',
      'Designer', 'Publicitário', 'Jornalista', 'Consultor', 'Gerente'
    ]
    
    return this.getRandomFromArray(professions)
  }

  /**
   * Gera estados civis brasileiros
   */
  getRandomMaritalStatus(): string {
    const statuses = ['Solteiro(a)', 'Casado(a)', 'União Estável', 'Divorciado(a)', 'Viúvo(a)']
    return this.getRandomFromArray(statuses)
  }

  /**
   * Gera idades realistas por contexto
   */
  generateAge(context: 'adult' | 'child' | 'senior' | 'professional'): number {
    switch (context) {
      case 'adult':
        return this.getRandomValueInRange(25, 65)
      case 'child':
        return this.getRandomValueInRange(0, 17)
      case 'senior':
        return this.getRandomValueInRange(60, 85)
      case 'professional':
        return this.getRandomValueInRange(28, 55)
      default:
        return this.getRandomValueInRange(25, 65)
    }
  }
}

// Instância singleton do provedor
export const realisticDataProvider = new RealisticDataProvider()