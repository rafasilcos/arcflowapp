// 🏗️ BRIEFING CASA UNIFAMILIAR - PADRÃO MÉDIO - ARCFLOW V3 LIMPO
// 185 perguntas exatas (P7 a P191) conforme especificação do cliente
// 16 seções organizadas sem duplicatas

import { BriefingEstatico } from '../types';

export const CASA_MEDIO: BriefingEstatico = {
  // 📊 METADADOS
  id: 'residencial-casa-medio',
  nome: 'Casa Unifamiliar - Padrão Médio',
  area: 'RESIDENCIAL',
  tipologia: 'CASA_UNIFAMILIAR',
  padrao: 'MEDIO',
  categoria: 'residencial-casa',
  versao: '3.0.0',
  totalPerguntas: 185,
  tempoEstimado: 148,
  
  metadados: {
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    baseadoEm: 'Especificação cliente - 185 perguntas (P7-P191) - 16 seções sem duplicatas',
    tags: ['residencial', 'casa', 'medio', 'unifamiliar', '185perguntas', 'limpo'],
    status: 'ativo'
  },

  // 📋 SEÇÕES - 16 SEÇÕES CONFORME ESPECIFICAÇÃO DO CLIENTE
  secoes: [
    {
      id: 'secao_1',
      nome: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE',
      icone: '👥',
      descricao: 'Informações fundamentais sobre o cliente e família',
      ordem: 1
    },
    {
      id: 'secao_2', 
      nome: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE',
      icone: '🎯',
      descricao: 'Experiência e expectativas do cliente',
      ordem: 2
    },
    {
      id: 'secao_3',
      nome: 'SEÇÃO 3: VIABILIDADE FINANCEIRA',
      icone: '💰',
      descricao: 'Orçamento e viabilidade financeira',
      ordem: 3
    },
    {
      id: 'secao_4',
      nome: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO',
      icone: '📍',
      descricao: 'Características do terreno e análise do entorno',
      ordem: 4
    },
    {
      id: 'secao_5',
      nome: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO',
      icone: '🏠',
      descricao: 'Necessidades de ambientes e funcionalidades',
      ordem: 5
    },
    {
      id: 'secao_6',
      nome: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO',
      icone: '🛋️',
      descricao: 'Organização funcional e zoneamento dos espaços',
      ordem: 6
    },
    {
      id: 'secao_7',
      nome: 'SEÇÃO 7: ESTILO E ESTÉTICA',
      icone: '🎨',
      descricao: 'Preferências estéticas e estilo arquitetônico',
      ordem: 7
    },
    {
      id: 'secao_8',
      nome: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES',
      icone: '⚡',
      descricao: 'Sistemas elétricos, hidráulicos e instalações',
      ordem: 8
    },
    {
      id: 'secao_9',
      nome: 'SEÇÃO 9: SUSTENTABILIDADE',
      icone: '🌱',
      descricao: 'Aspectos de sustentabilidade',
      ordem: 9
    },
    {
      id: 'secao_10',
      nome: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS',
      icone: '🎨',
      descricao: 'Especificações de acabamentos e materiais',
      ordem: 10
    },
    {
      id: 'secao_11',
      nome: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE',
      icone: '🔒',
      descricao: 'Sistemas de segurança e acessibilidade',
      ordem: 11
    },
    {
      id: 'secao_12',
      nome: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES',
      icone: '⏰',
      descricao: 'Prazos e processos de aprovação',
      ordem: 12
    },
    {
      id: 'secao_13',
      nome: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO',
      icone: '📋',
      descricao: 'Gestão e comunicação do projeto',
      ordem: 13
    },
    {
      id: 'secao_14',
      nome: 'SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS',
      icone: '⚠️',
      descricao: 'Análise de riscos e planos de contingência',
      ordem: 14
    },
    {
      id: 'secao_15',
      nome: 'SEÇÃO 15: CUSTO-BENEFÍCIO E INVESTIMENTO',
      icone: '📊',
      descricao: 'Análise de custo-benefício e investimento',
      ordem: 15
    },
    {
      id: 'secao_16',
      nome: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES',
      icone: '📝',
      descricao: 'Informações adicionais e complementares',
      ordem: 16
    }
  ],

  // ❓ PERGUNTAS - 185 PERGUNTAS EXATAS (P7 a P191)
  perguntas: [
    // SEÇÃO 1: DADOS BÁSICOS DO CLIENTE (6 perguntas: P1-P6)
    {
      id: 'P001',
      texto: 'Quantas pessoas moram na residência?',
      tipo: 'select',
      opcoes: [
        '1 pessoa',
        '2 pessoas',
        '3 pessoas',
        '4 pessoas',
        '5 pessoas',
        '6 ou mais pessoas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE'
    },
    {
      id: 'P002',
      texto: 'Quais são as idades dos moradores?',
      tipo: 'multiple',
      opcoes: [
        'Bebês (0-2 anos)',
        'Crianças (3-12 anos)',
        'Adolescentes (13-17 anos)',
        'Adultos jovens (18-30 anos)',
        'Adultos (31-50 anos)',
        'Adultos maduros (51-65 anos)',
        'Idosos (65+ anos)'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE'
    },
    {
      id: 'P003',
      texto: 'Há previsão de mudança na composição familiar nos próximos 5 anos?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, planejamos ter filhos',
        'Sim, filhos saindo de casa',
        'Sim, parentes vindo morar',
        'Sim, outras mudanças'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE'
    },
    {
      id: 'P004',
      texto: 'Algum morador possui necessidades especiais de acessibilidade?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, atualmente',
        'Sim, previsão futura',
        'Sim, visitantes frequentes'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE'
    },
    {
      id: 'P005',
      texto: 'Há necessidades específicas por faixa etária (crianças, adolescentes, idosos)?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva necessidades específicas por faixa etária',
      maxLength: 400,
      dependeDe: 'P002', // Só aparece se tiver diferentes faixas etárias
      secao: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE'
    },
    {
      id: 'P006',
      texto: 'Quais são os hábitos e rotinas específicas de cada morador?',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva os hábitos e rotinas específicas de cada morador',
      maxLength: 500,
      secao: 'SEÇÃO 1: DADOS BÁSICOS DO CLIENTE'
    },

    // SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE (10 perguntas: P7-P16)
    {
      id: 'P007',
      texto: 'Qual é a sua experiência anterior com projetos de arquitetura?',
      tipo: 'select',
      opcoes: [
        'Nenhuma experiência',
        'Experiência básica (reformas pequenas)',
        'Experiência intermediária (reformas grandes)',
        'Experiência avançada (construções)',
        'Sou profissional da área'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P008',
      texto: 'Já trabalhou anteriormente com arquitetos? Como foi a experiência?',
      tipo: 'select',
      opcoes: [
        'Não, primeira vez',
        'Sim, experiência excelente',
        'Sim, experiência boa',
        'Sim, experiência regular',
        'Sim, experiência ruim'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P009',
      texto: 'Qual é a sua disponibilidade de tempo para reuniões quinzenais?',
      tipo: 'select',
      opcoes: [
        'Total disponibilidade',
        'Boa disponibilidade (horário comercial)',
        'Disponibilidade limitada (fins de semana)',
        'Disponibilidade restrita (agendamento prévio)',
        'Disponibilidade muito limitada'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P010',
      texto: 'Quem é o decisor principal para aprovações do projeto?',
      tipo: 'select',
      opcoes: [
        'Eu',
        'Meu cônjuge',
        'Nós dois em conjunto',
        'Toda a família',
        'Outro responsável'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P011',
      texto: 'Há outros membros da família com poder de veto nas decisões?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, cônjuge',
        'Sim, filhos',
        'Sim, pais/sogros',
        'Sim, outros familiares'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P012',
      texto: 'Qual é a sua expectativa sobre o nível de detalhamento do projeto?',
      tipo: 'select',
      opcoes: [
        'Básico (apenas o essencial)',
        'Intermediário (detalhes importantes)',
        'Completo (todos os detalhes)',
        'Muito detalhado (especificações técnicas)',
        'Não sei, preciso de orientação'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P013',
      texto: 'Qual é o seu nível de envolvimento desejado no processo?',
      tipo: 'select',
      opcoes: [
        'Mínimo (apenas aprovações)',
        'Básico (reuniões principais)',
        'Médio (acompanhamento regular)',
        'Alto (participação ativa)',
        'Total (envolvimento em tudo)'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P014',
      texto: 'Existe compreensão sobre prazos realistas para desenvolvimento de projetos?',
      tipo: 'select',
      opcoes: [
        'Sim, tenho conhecimento',
        'Parcialmente',
        'Não, preciso de orientação',
        'Tenho pressa, mas entendo',
        'Tenho urgência extrema'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P015',
      texto: 'Há compreensão sobre custos de mudanças durante o processo?',
      tipo: 'select',
      opcoes: [
        'Sim, entendo completamente',
        'Parcialmente',
        'Não, preciso de esclarecimento',
        'Entendo, mas posso mudar de ideia',
        'Não me importo com custos extras'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },
    {
      id: 'P016',
      texto: 'Qual é a expectativa sobre comunicação durante o projeto?',
      tipo: 'select',
      opcoes: [
        'Comunicação mínima (apenas marcos importantes)',
        'Comunicação básica (quinzenal)',
        'Comunicação regular (semanal)',
        'Comunicação frequente (conforme necessário)',
        'Comunicação constante (diária se preciso)'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 2: QUALIFICAÇÃO E EXPECTATIVAS DO CLIENTE'
    },

    // SEÇÃO 3: VIABILIDADE FINANCEIRA (12 perguntas: P17-P28)
    {
      id: 'P017',
      texto: 'Qual é o orçamento total disponível para o projeto?',
      tipo: 'select',
      opcoes: [
        'R$ 300.000 - R$ 500.000',
        'R$ 500.000 - R$ 800.000',
        'R$ 800.000 - R$ 1.200.000',
        'R$ 1.200.000 - R$ 2.000.000',
        'Acima de R$ 2.000.000'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P018',
      texto: 'Este orçamento inclui o projeto arquitetônico?',
      tipo: 'select',
      opcoes: [
        'Sim, está incluído',
        'Não, é adicional',
        'Parcialmente incluído',
        'Não sei, preciso de orientação'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P019',
      texto: 'Este orçamento inclui projetos complementares?',
      tipo: 'select',
      opcoes: [
        'Sim, todos incluídos',
        'Parcialmente incluídos',
        'Não, são adicionais',
        'Não sei quais são necessários'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P020',
      texto: 'Este orçamento inclui a construção?',
      tipo: 'select',
      opcoes: [
        'Sim, construção completa',
        'Sim, estrutura e fechamento',
        'Não, apenas projeto',
        'Não sei ainda'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P021',
      texto: 'Este orçamento inclui mobiliário básico?',
      tipo: 'select',
      opcoes: [
        'Sim, mobiliário completo',
        'Sim, mobiliário básico',
        'Não, será separado',
        'Não sei ainda'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P022',
      texto: 'Como será o financiamento da obra?',
      tipo: 'select',
      opcoes: [
        'Recursos próprios',
        'Financiamento bancário',
        'FGTS + financiamento',
        'Consórcio',
        'Misto (recursos próprios + financiamento)',
        'Outros'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P023',
      texto: 'Há prazo limite para conclusão da obra?',
      tipo: 'select',
      opcoes: [
        'Não há prazo específico',
        'Sim, prazo flexível',
        'Sim, prazo rígido',
        'Sim, prazo muito rígido',
        'Urgência extrema'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P024',
      texto: 'Há recursos para imprevistos (reserva de 15% do orçamento)?',
      tipo: 'select',
      opcoes: [
        'Sim, reserva completa (15%)',
        'Sim, reserva parcial (5-10%)',
        'Reserva mínima (até 5%)',
        'Não há reserva',
        'Não sei, preciso avaliar'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P025',
      texto: 'Qual é a capacidade de pagamento mensal máxima?',
      tipo: 'select',
      opcoes: [
        'Até R$ 3.000/mês',
        'R$ 3.000 - R$ 5.000/mês',
        'R$ 5.000 - R$ 8.000/mês',
        'R$ 8.000 - R$ 12.000/mês',
        'Acima de R$ 12.000/mês'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P026',
      texto: 'Qual é a prioridade: economia inicial ou economia operacional?',
      tipo: 'select',
      opcoes: [
        'Economia inicial (menor custo de construção)',
        'Economia operacional (menor custo de manutenção)',
        'Equilibrio entre ambas',
        'Priorizo qualidade sobre economia',
        'Não sei, preciso de orientação'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P027',
      texto: 'Há flexibilidade orçamentária para melhorias durante o projeto?',
      tipo: 'select',
      opcoes: [
        'Sim, alta flexibilidade',
        'Sim, flexibilidade moderada',
        'Flexibilidade limitada',
        'Nenhuma flexibilidade',
        'Depende da melhoria'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },
    {
      id: 'P028',
      texto: 'Qual é o comprometimento atual da renda familiar?',
      tipo: 'select',
      opcoes: [
        'Baixo (até 30%)',
        'Moderado (30-50%)',
        'Alto (50-70%)',
        'Muito alto (acima de 70%)',
        'Prefiro não informar'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 3: VIABILIDADE FINANCEIRA'
    },

    // SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO (19 perguntas: P29-P47)
    {
      id: 'P029',
      texto: 'Qual é o endereço completo do terreno?',
      tipo: 'texto',
      obrigatoria: true,
      placeholder: 'Digite o endereço completo do terreno',
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P030',
      texto: 'Qual é a área total do terreno (m²)?',
      tipo: 'select',
      opcoes: [
        'Até 300 m²',
        '300 - 500 m²',
        '500 - 800 m²',
        '800 - 1.200 m²',
        'Acima de 1.200 m²'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P031',
      texto: 'Quais são as dimensões do terreno (frente x fundo)?',
      tipo: 'texto',
      obrigatoria: true,
      placeholder: 'Ex: 12m x 30m',
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P032',
      texto: 'Qual é a topografia do terreno (plano, aclive, declive)?',
      tipo: 'select',
      opcoes: [
        'Plano',
        'Aclive suave',
        'Aclive acentuado',
        'Declive suave',
        'Declive acentuado',
        'Irregular',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P033',
      texto: 'Qual é a orientação solar do terreno (norte, sul, leste, oeste)?',
      tipo: 'select',
      opcoes: [
        'Frente para Norte',
        'Frente para Sul',
        'Frente para Leste',
        'Frente para Oeste',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P034',
      texto: 'Qual é a incidência de ventos predominantes na região?',
      tipo: 'select',
      opcoes: [
        'Ventos suaves',
        'Ventos moderados',
        'Ventos fortes',
        'Ventos variáveis',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P035',
      texto: 'Há construções vizinhas? Descreva.',
      tipo: 'select',
      opcoes: [
        'Não há construções vizinhas',
        'Sim, construções baixas',
        'Sim, construções altas',
        'Sim, construções mistas',
        'Sim, muito próximas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P036',
      texto: 'Quais são os gabaritos e recuos das construções vizinhas?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva os gabaritos e recuos das construções vizinhas',
      maxLength: 400,
      dependeDe: {
        perguntaId: 'P035',
        valoresQueExibem: ['Sim, construções baixas', 'Sim, construções altas', 'Sim, construções mistas', 'Sim, muito próximas']
      },
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P037',
      texto: 'Como é a proximidade e altura das edificações do entorno?',
      tipo: 'select',
      opcoes: [
        'Edificações baixas e distantes',
        'Edificações baixas e próximas',
        'Edificações altas e distantes',
        'Edificações altas e próximas',
        'Entorno misto',
        'Não há edificações próximas'
      ],
      obrigatoria: false,
      dependeDe: {
        perguntaId: 'P035',
        valoresQueExibem: ['Sim, construções baixas', 'Sim, construções altas', 'Sim, construções mistas', 'Sim, muito próximas']
      },
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P038',
      texto: 'Há árvores no terreno que devem ser preservadas?',
      tipo: 'select',
      opcoes: [
        'Não há árvores',
        'Sim, algumas árvores',
        'Sim, muitas árvores',
        'Sim, árvores protegidas',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P039',
      texto: 'Qual é a infraestrutura disponível (água, luz, esgoto, gás)?',
      tipo: 'multiple',
      opcoes: [
        'Água encanada',
        'Energia elétrica',
        'Rede de esgoto',
        'Gás encanado',
        'Internet/telefone',
        'Asfalto',
        'Nenhuma'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P040',
      texto: 'Há restrições legais ou do condomínio para construção?',
      tipo: 'select',
      opcoes: [
        'Não há restrições',
        'Sim, restrições municipais',
        'Sim, restrições do condomínio',
        'Sim, ambas',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P041',
      texto: 'Qual é o gabarito máximo permitido?',
      tipo: 'select',
      opcoes: [
        '1 pavimento',
        '2 pavimentos',
        '3 pavimentos',
        'Sem restrição',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P042',
      texto: 'Quais são os recuos obrigatórios?',
      tipo: 'texto',
      obrigatoria: true,
      placeholder: 'Ex: frontal 5m, lateral 1,5m, fundo 3m',
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P043',
      texto: 'Há ruídos externos que devem ser considerados?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, trânsito',
        'Sim, vizinhos',
        'Sim, indústrias',
        'Sim, múltiplas fontes'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P044',
      texto: 'Quais são as principais fontes de ruído do entorno?',
      tipo: 'multiple',
      opcoes: [
        'Trânsito de veículos',
        'Vizinhos',
        'Comércio local',
        'Indústrias',
        'Aeroporto',
        'Animais',
        'Não há ruídos significativos'
      ],
      obrigatoria: false,
      dependeDe: {
        perguntaId: 'P043',
        valoresQueExibem: ['Sim, trânsito', 'Sim, vizinhos', 'Sim, indústrias', 'Sim, múltiplas fontes']
      },
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P045',
      texto: 'Há histórico de enchentes na região?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, raramente',
        'Sim, ocasionalmente',
        'Sim, frequentemente',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P046',
      texto: 'Já foi feita consulta prévia na prefeitura?',
      tipo: 'select',
      opcoes: [
        'Sim, aprovada',
        'Sim, com pendências',
        'Não, mas pretendo fazer',
        'Não, preciso de ajuda',
        'Não sei se é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },
    {
      id: 'P047',
      texto: 'Há documentação do terreno regularizada?',
      tipo: 'select',
      opcoes: [
        'Sim, toda documentação ok',
        'Sim, com pequenas pendências',
        'Parcialmente regularizada',
        'Não regularizada',
        'Não sei'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 4: TERRENO E ANÁLISE DO ENTORNO'
    },

    // SEÇÃO 5: PROGRAMA ARQUITETÔNICO (26 perguntas: P48-P73)
    {
      id: 'P048',
      texto: 'Quantos quartos são necessários?',
      tipo: 'select',
      opcoes: [
        '1 quarto',
        '2 quartos',
        '3 quartos',
        '4 quartos',
        '5 ou mais quartos'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P049',
      texto: 'Quantos banheiros são necessários?',
      tipo: 'select',
      opcoes: [
        '1 banheiro',
        '2 banheiros',
        '3 banheiros',
        '4 banheiros',
        '5 ou mais banheiros'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P050',
      texto: 'Quantas suítes são necessárias?',
      tipo: 'select',
      opcoes: [
        'Nenhuma suíte',
        '1 suíte',
        '2 suítes',
        '3 suítes',
        '4 ou mais suítes'
      ],
      obrigatoria: false,
      dependeDe: {
        perguntaId: 'P054',
        valoresQueExibem: ['2 quartos', '3 quartos', '4 quartos', '5 ou mais quartos']
      },
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P051',
      texto: 'É necessário escritório/home office?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básico',
        'Sim, completo',
        'Sim, profissional',
        'Sim, múltiplos escritórios'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P052',
      texto: 'É necessária sala de estar?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básica',
        'Sim, ampla',
        'Sim, formal',
        'Sim, múltiplas salas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P053',
      texto: 'É necessária sala de jantar?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, integrada',
        'Sim, separada',
        'Sim, formal',
        'Sim, múltiplas salas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P054',
      texto: 'É necessária sala de TV/família?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básica',
        'Sim, ampla',
        'Sim, com home theater',
        'Sim, múltiplas salas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P055',
      texto: 'Qual o tipo de cozinha desejada (americana, separada, gourmet)?',
      tipo: 'select',
      opcoes: [
        'Cozinha separada tradicional',
        'Cozinha americana simples',
        'Cozinha gourmet integrada',
        'Cozinha gourmet + apoio',
        'Cozinha profissional'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P056',
      texto: 'É necessária área de serviço?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básica',
        'Sim, ampla',
        'Sim, com depósito',
        'Sim, externa coberta'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P057',
      texto: 'É necessário quarto de empregada?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básico',
        'Sim, com banheiro',
        'Sim, com entrada independente',
        'Sim, múltiplos quartos'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P058',
      texto: 'É necessária garagem? Para quantos carros?',
      tipo: 'select',
      opcoes: [
        'Não precisa',
        '1 carro coberto',
        '2 carros cobertos',
        '3 carros cobertos',
        '4 ou mais carros',
        'Garagem + área descoberta'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P058A',
      texto: 'Tipo de garagem desejada?',
      tipo: 'select',
      opcoes: [
        'Garagem coberta simples',
        'Garagem coberta com portão automático',
        'Garagem descoberta',
        'Garagem mista (coberta + descoberta)',
        'Garagem subterrânea'
      ],
      obrigatoria: false,
      dependeDe: 'P058', // Só aparece se precisa de garagem
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P059',
      texto: 'É necessária área gourmet/churrasqueira?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básica',
        'Sim, completa',
        'Sim, integrada com piscina',
        'Sim, área gourmet profissional'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P060',
      texto: 'É necessária piscina?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, pequena',
        'Sim, média',
        'Sim, grande',
        'Sim, com spa/hidro'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P060A',
      texto: 'Especificações da piscina?',
      tipo: 'multiple',
      opcoes: [
        'Piscina aquecida',
        'Cobertura retrátil',
        'Sistema de automação',
        'Iluminação LED',
        'Cascata/hidromassagem',
        'Deck de madeira',
        'Área gourmet integrada'
      ],
      obrigatoria: false,
      dependeDe: 'P060', // Só aparece se precisa de piscina
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P061',
      texto: 'É necessário jardim?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, básico',
        'Sim, elaborado',
        'Sim, com horta',
        'Sim, paisagismo completo'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P062',
      texto: 'É necessário closet?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, no quarto principal',
        'Sim, em múltiplos quartos',
        'Sim, closet amplo',
        'Sim, closets personalizados'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P063',
      texto: 'É necessária despensa?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, pequena',
        'Sim, média',
        'Sim, grande',
        'Sim, despensa + adega'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P064',
      texto: 'É necessário lavabo?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, 1 lavabo',
        'Sim, 2 lavabos',
        'Sim, lavabo + banheiro social',
        'Sim, múltiplos lavabos'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P065',
      texto: 'É necessário espaço para academia/exercícios?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, espaço básico',
        'Sim, academia completa',
        'Sim, com vestiário',
        'Sim, academia profissional'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P066',
      texto: 'Há outros ambientes específicos necessários?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva outros ambientes específicos (ateliê, biblioteca, sala de jogos, etc.)',
      maxLength: 300,
      dependeDe: 'P069', // Só aparece se há atividades específicas
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P067',
      texto: 'Qual é a frequência de recebimento de visitas?',
      tipo: 'select',
      opcoes: [
        'Raramente',
        'Ocasionalmente',
        'Frequentemente',
        'Muito frequentemente',
        'Constantemente'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P068',
      texto: 'Como é a rotina diária da família?',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva a rotina diária da família',
      maxLength: 400,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P069',
      texto: 'Há atividades específicas que requerem espaços dedicados?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, atividades artísticas',
        'Sim, atividades físicas',
        'Sim, trabalho/estudos',
        'Sim, múltiplas atividades'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P070',
      texto: 'Há animais de estimação? Precisam de espaço específico?',
      tipo: 'select',
      opcoes: [
        'Não temos animais',
        'Sim, mas não precisam de espaço específico',
        'Sim, precisam de área externa',
        'Sim, precisam de área interna',
        'Sim, precisam de área especializada'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },
    {
      id: 'P070A',
      texto: 'Que tipo de animal e necessidades específicas?',
      tipo: 'texto_longo',
      placeholder: 'Descreva o tipo de animal e suas necessidades específicas de espaço',
      maxLength: 300,
      obrigatoria: false,
      dependeDe: 'P070', // Só aparece se tem animais
      secao: 'SEÇÃO 5: PROGRAMA ARQUITETÔNICO'
    },

    // SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO (18 perguntas: P77-P94)
    {
      id: 'P077',
      texto: 'Como deve ser organizada a setorização (íntima, social, serviço)?',
      tipo: 'select',
      opcoes: [
        'Setores bem separados',
        'Setores parcialmente integrados',
        'Setores integrados',
        'Não tenho preferência',
        'Preciso de orientação'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P078',
      texto: 'Quais ambientes devem ter conexão direta entre si?',
      tipo: 'multiple',
      opcoes: [
        'Cozinha e sala de jantar',
        'Sala de estar e sala de jantar',
        'Cozinha e área de serviço',
        'Área gourmet e cozinha',
        'Quartos e banheiros',
        'Garagem e área de serviço',
        'Escritório e entrada social'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P079',
      texto: 'Quais ambientes precisam de isolamento acústico específico?',
      tipo: 'multiple',
      opcoes: [
        'Quartos',
        'Escritório/home office',
        'Sala de TV',
        'Academia',
        'Área de serviço',
        'Nenhum ambiente específico'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P080',
      texto: 'Como devem ser os fluxos de circulação internos?',
      tipo: 'select',
      opcoes: [
        'Circulação mínima (ambientes integrados)',
        'Circulação básica (corredores curtos)',
        'Circulação ampla (corredores largos)',
        'Circulação separada (social/íntima/serviço)',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P081',
      texto: 'Há preferência por ambientes mais reservados ou integrados?',
      tipo: 'select',
      opcoes: [
        'Ambientes reservados (compartimentados)',
        'Ambientes parcialmente integrados',
        'Ambientes totalmente integrados',
        'Misto (alguns integrados, outros reservados)',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P082',
      texto: 'É importante ter vista para o jardim?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P083',
      texto: 'É importante ter privacidade dos vizinhos?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P084',
      texto: 'Há necessidade de isolamento acústico básico?',
      tipo: 'select',
      opcoes: [
        'Sim, muito importante',
        'Sim, importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P085',
      texto: 'Qual é a importância da ventilação natural?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P086',
      texto: 'É importante ter varanda ou terraço?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P087',
      texto: 'É necessário depósito/storage?',
      tipo: 'select',
      opcoes: [
        'Sim, muito necessário',
        'Sim, necessário',
        'Moderadamente necessário',
        'Pouco necessário',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P088',
      texto: 'É importante ter entrada social e de serviço separadas?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P089',
      texto: 'É importante ter flexibilidade para mudanças futuras?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P090',
      texto: 'Há preferência por ambientes com vista específica?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva preferências de vista para ambientes específicos',
      maxLength: 300,
      dependeDe: 'P082', // Só aparece se vista para jardim é importante
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P091',
      texto: 'Há limitações físicas específicas de algum morador?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva limitações físicas que devem ser consideradas',
      maxLength: 300,
      dependeDe: 'P004', // Só aparece se há necessidades especiais de acessibilidade
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P092',
      texto: 'Qual é a importância da iluminação natural?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P093',
      texto: 'É importante ter conexão visual entre ambientes?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },
    {
      id: 'P094',
      texto: 'Há necessidade de espaços com diferentes níveis de privacidade?',
      tipo: 'select',
      opcoes: [
        'Sim, muito necessário',
        'Sim, necessário',
        'Moderadamente necessário',
        'Pouco necessário',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 6: FUNCIONALIDADE E ZONEAMENTO'
    },

    // SEÇÃO 7: ESTILO E ESTÉTICA (14 perguntas: P95-P108)
    {
      id: 'P095',
      texto: 'Qual estilo arquitetônico é preferido (contemporâneo, clássico, minimalista, rústico)?',
      tipo: 'select',
      opcoes: [
        'Contemporâneo',
        'Clássico',
        'Minimalista',
        'Rústico',
        'Industrial',
        'Eclético',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P096',
      texto: 'Há referências visuais ou projetos que admira?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva referências visuais ou projetos que admira',
      maxLength: 400,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P097',
      texto: 'Prefere linhas retas ou curvas?',
      tipo: 'select',
      opcoes: [
        'Linhas retas',
        'Linhas curvas',
        'Combinação de ambas',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P098',
      texto: 'Prefere ambientes integrados ou compartimentados?',
      tipo: 'select',
      opcoes: [
        'Totalmente integrados',
        'Parcialmente integrados',
        'Compartimentados',
        'Misto',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P099',
      texto: 'Qual a paleta de cores preferida?',
      tipo: 'select',
      opcoes: [
        'Cores neutras (branco, bege, cinza)',
        'Cores quentes (terra, madeira)',
        'Cores frias (azul, verde)',
        'Cores vibrantes',
        'Preto e branco',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P100',
      texto: 'Há materiais de preferência para fachada?',
      tipo: 'multiple',
      opcoes: [
        'Tijolo aparente',
        'Concreto aparente',
        'Madeira',
        'Pedra natural',
        'Revestimento cerâmico',
        'Vidro',
        'Metal',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P101',
      texto: 'Há materiais de preferência para pisos?',
      tipo: 'multiple',
      opcoes: [
        'Porcelanato',
        'Madeira',
        'Pedra natural',
        'Cimento queimado',
        'Cerâmica',
        'Vinílico',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P102',
      texto: 'Há materiais de preferência para paredes?',
      tipo: 'multiple',
      opcoes: [
        'Tinta',
        'Papel de parede',
        'Madeira',
        'Pedra natural',
        'Tijolo aparente',
        'Concreto aparente',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P103',
      texto: 'Há elementos decorativos específicos desejados?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva elementos decorativos específicos',
      maxLength: 300,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P104',
      texto: 'Há preferência por elementos em madeira?',
      tipo: 'select',
      opcoes: [
        'Sim, muitos elementos',
        'Sim, alguns elementos',
        'Poucos elementos',
        'Não gosto de madeira',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P105',
      texto: 'Há preferência por elementos em pedra natural?',
      tipo: 'select',
      opcoes: [
        'Sim, muitos elementos',
        'Sim, alguns elementos',
        'Poucos elementos',
        'Não gosto de pedra',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P106',
      texto: 'Qual a importância da fachada para o projeto?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P107',
      texto: 'Existe preferência por tendências ou atemporalidade?',
      tipo: 'select',
      opcoes: [
        'Preferência por tendências atuais',
        'Preferência por atemporalidade',
        'Equilibrio entre ambos',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },
    {
      id: 'P108',
      texto: 'É importante ter harmonia com a paisagem?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 7: ESTILO E ESTÉTICA'
    },

    // SEÇÃO 8: SISTEMAS E INSTALAÇÕES (14 perguntas: P109-P122)
    {
      id: 'P109',
      texto: 'Qual tipo de aquecimento de água é preferido?',
      tipo: 'select',
      opcoes: [
        'Aquecedor elétrico',
        'Aquecedor a gás',
        'Aquecimento solar',
        'Aquecimento central',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P110',
      texto: 'É necessário sistema de ar condicionado?',
      tipo: 'select',
      opcoes: [
        'Sim, em todos os ambientes',
        'Sim, apenas nos quartos',
        'Sim, apenas nas áreas sociais',
        'Sim, seletivo',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P110A',
      texto: 'Em quais ambientes? Tipo de sistema?',
      tipo: 'multiple',
      opcoes: [
        'Quartos - Split individual',
        'Salas - Split individual', 
        'Cozinha - Split individual',
        'Sistema central (dutos)',
        'Sistema VRF (múltiplas unidades)',
        'Apenas preparação elétrica'
      ],
      obrigatoria: false,
      dependeDe: 'P110', // Só aparece se precisa de ar condicionado
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P111',
      texto: 'É necessária instalação de gás?',
      tipo: 'select',
      opcoes: [
        'Sim, gás encanado',
        'Sim, gás de botijão',
        'Ambos os sistemas',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P111A',
      texto: 'Para quais equipamentos (fogão, aquecedor, lareira)?',
      tipo: 'multiple',
      opcoes: [
        'Fogão/cooktop',
        'Aquecedor de água',
        'Lareira a gás',
        'Churrasqueira',
        'Aquecimento de piscina',
        'Sistema de calefação'
      ],
      obrigatoria: false,
      dependeDe: 'P111', // Só aparece se precisa de gás
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P112',
      texto: 'É necessário sistema de segurança básico?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P113',
      texto: 'É necessário sistema de energia solar?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P113A',
      texto: 'Capacidade desejada? Apenas aquecimento ou fotovoltaico?',
      tipo: 'select',
      opcoes: [
        'Aquecimento solar apenas (água)',
        'Fotovoltaico básico (30% consumo)',
        'Fotovoltaico médio (50% consumo)',
        'Fotovoltaico completo (80%+ consumo)',
        'Sistema híbrido (aquecimento + fotovoltaico)'
      ],
      obrigatoria: false,
      dependeDe: 'P113', // Só aparece se precisa de energia solar
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P114',
      texto: 'É necessária automação residencial básica?',
      tipo: 'select',
      opcoes: [
        'Sim, automação completa',
        'Sim, automação básica',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P114A',
      texto: 'Quais sistemas automatizar (iluminação, climatização, segurança)?',
      tipo: 'multiple',
      opcoes: [
        'Iluminação inteligente',
        'Climatização automática',
        'Sistema de segurança',
        'Portões e fechaduras',
        'Cortinas e persianas',
        'Som ambiente',
        'Irrigação automática'
      ],
      obrigatoria: false,
      dependeDe: 'P114', // Só aparece se precisa de automação
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P115',
      texto: 'É necessário sistema de som ambiente?',
      tipo: 'select',
      opcoes: [
        'Sim, em todos os ambientes',
        'Sim, apenas áreas sociais',
        'Sim, seletivo',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P115A',
      texto: 'Em quais ambientes? Sistema integrado?',
      tipo: 'multiple',
      opcoes: [
        'Salas sociais',
        'Quartos',
        'Área gourmet',
        'Área da piscina',
        'Jardim/área externa',
        'Sistema integrado (central)',
        'Apenas preparação (tubulação)'
      ],
      obrigatoria: false,
      dependeDe: 'P115', // Só aparece se precisa de som ambiente
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P116',
      texto: 'É necessária TV a cabo/internet em todos os ambientes?',
      tipo: 'select',
      opcoes: [
        'Sim, em todos os ambientes',
        'Sim, apenas nos quartos',
        'Sim, apenas nas áreas sociais',
        'Sim, seletivo',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P117',
      texto: 'É necessário sistema de captação de água da chuva?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P117A',
      texto: 'Para quais usos (irrigação, limpeza, outros)?',
      tipo: 'multiple',
      opcoes: [
        'Irrigação do jardim',
        'Limpeza de áreas externas',
        'Descarga de banheiros',
        'Lavagem de roupas',
        'Limpeza de veículos',
        'Abastecimento da piscina'
      ],
      obrigatoria: false,
      dependeDe: 'P117', // Só aparece se precisa de captação de água
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P118',
      texto: 'É necessário sistema de filtragem de água?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas na cozinha',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P119',
      texto: 'É necessário sistema de irrigação automática?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P120',
      texto: 'Qual é a expectativa de vida útil dos sistemas?',
      tipo: 'select',
      opcoes: [
        'Mínima (economia inicial)',
        'Básica (10-15 anos)',
        'Intermediária (15-20 anos)',
        'Longa (20+ anos)',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P121',
      texto: 'Qual é a importância da eficiência energética?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },
    {
      id: 'P122',
      texto: 'Há interesse em sistemas integrados básicos?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei o que são'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 8: SISTEMAS E INSTALAÇÕES'
    },

    // SEÇÃO 9: SUSTENTABILIDADE (12 perguntas: P123-P134)
    {
      id: 'P123',
      texto: 'Qual é a importância da sustentabilidade no projeto?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P124',
      texto: 'Há interesse em materiais sustentáveis?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei o que são'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P125',
      texto: 'Há interesse em reuso de água?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei como funciona'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P126',
      texto: 'Há interesse em compostagem?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei como funciona'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P127',
      texto: 'Há interesse em horta orgânica?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não tenho tempo'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P128',
      texto: 'Qual é a importância da ventilação natural para economia de energia?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P129',
      texto: 'Qual é a importância da iluminação natural para economia de energia?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P130',
      texto: 'Há interesse em materiais reciclados?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Depende do material'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P131',
      texto: 'Há interesse em redução do consumo de água?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei como fazer'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P132',
      texto: 'Há interesse em redução do consumo de energia?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei como fazer'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P133',
      texto: 'Qual é o orçamento disponível para soluções sustentáveis?',
      tipo: 'select',
      opcoes: [
        'Orçamento específico para sustentabilidade',
        'Parte do orçamento total',
        'Apenas se for viável economicamente',
        'Não tenho orçamento específico',
        'Não sei ainda'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },
    {
      id: 'P134',
      texto: 'Há interesse em certificação ambiental?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Não sei o que é'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 9: SUSTENTABILIDADE'
    },

    // SEÇÃO 10: ACABAMENTOS E MATERIAIS (10 perguntas: P135-P144)
    {
      id: 'P135',
      texto: 'Qual é o padrão de acabamento desejado?',
      tipo: 'select',
      opcoes: [
        'Padrão básico',
        'Padrão médio',
        'Padrão alto',
        'Padrão luxo',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P136',
      texto: 'Há preferência por materiais nacionais ou importados?',
      tipo: 'select',
      opcoes: [
        'Preferência por nacionais',
        'Preferência por importados',
        'Misto (nacionais e importados)',
        'Não tenho preferência',
        'Depende do custo-benefício'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P137',
      texto: 'Qual é a importância da durabilidade dos acabamentos?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P138',
      texto: 'Qual é a importância da facilidade de manutenção?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P139',
      texto: 'Há materiais que devem ser evitados?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva materiais que devem ser evitados e o motivo',
      maxLength: 300,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P140',
      texto: 'Há preferência por texturas específicas?',
      tipo: 'multiple',
      opcoes: [
        'Texturas lisas',
        'Texturas rugosas',
        'Texturas naturais',
        'Texturas geométricas',
        'Não tenho preferência'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P141',
      texto: 'Qual é a prioridade entre estética e funcionalidade nos acabamentos?',
      tipo: 'select',
      opcoes: [
        'Prioridade total para estética',
        'Prioridade para estética',
        'Equilíbrio entre ambas',
        'Prioridade para funcionalidade',
        'Prioridade total para funcionalidade'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P142',
      texto: 'Há interesse em acabamentos diferenciados?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Pouco interesse',
        'Não tenho interesse',
        'Depende do custo'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P143',
      texto: 'Qual é a flexibilidade orçamentária para acabamentos especiais?',
      tipo: 'select',
      opcoes: [
        'Alta flexibilidade',
        'Flexibilidade moderada',
        'Pouca flexibilidade',
        'Nenhuma flexibilidade',
        'Depende do acabamento'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },
    {
      id: 'P144',
      texto: 'Há preferência por fornecedores específicos?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Cite fornecedores de preferência ou que devem ser evitados',
      maxLength: 300,
      secao: 'SEÇÃO 10: ACABAMENTOS E MATERIAIS'
    },

    // SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE (9 perguntas: P145-P153)
    {
      id: 'P145',
      texto: 'Qual é a importância da segurança no projeto?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P146',
      texto: 'É necessário sistema de alarme?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P146A',
      texto: 'Com monitoramento? Sensores específicos?',
      tipo: 'multiple',
      opcoes: [
        'Monitoramento 24h',
        'Sensores de movimento',
        'Sensores de abertura',
        'Sensores de quebra de vidro',
        'Botão de pânico',
        'Sirene externa',
        'Aplicativo móvel'
      ],
      obrigatoria: false,
      dependeDe: 'P146', // Só aparece se precisa de alarme
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P147',
      texto: 'É necessário sistema de câmeras?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P147A',
      texto: 'Quantas câmeras? Quais locais? Gravação?',
      tipo: 'multiple',
      opcoes: [
        '2-4 câmeras básicas',
        '5-8 câmeras completas',
        'Entrada principal',
        'Área da piscina',
        'Garagem',
        'Fundos da casa',
        'Gravação em nuvem',
        'Gravação local (DVR)'
      ],
      obrigatoria: false,
      dependeDe: 'P147', // Só aparece se precisa de câmeras
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P148',
      texto: 'É necessário controle de acesso?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P149',
      texto: 'É necessário cerca elétrica ou similar?',
      tipo: 'select',
      opcoes: [
        'Sim, cerca elétrica',
        'Sim, outro sistema de perímetro',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P150',
      texto: 'É necessário projeto de acessibilidade?',
      tipo: 'select',
      opcoes: [
        'Sim, projeto completo',
        'Sim, acessibilidade básica',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P151',
      texto: 'É necessário sistema de iluminação de emergência?',
      tipo: 'select',
      opcoes: [
        'Sim, sistema completo',
        'Sim, sistema básico',
        'Apenas preparação para futuro',
        'Não é necessário'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P152',
      texto: 'Há preocupações específicas de segurança?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva preocupações específicas de segurança',
      maxLength: 300,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },
    {
      id: 'P153',
      texto: 'Há necessidades específicas de acessibilidade?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva necessidades específicas de acessibilidade',
      maxLength: 300,
      secao: 'SEÇÃO 11: SEGURANÇA E ACESSIBILIDADE'
    },

    // SEÇÃO 12: CRONOGRAMA E APROVAÇÕES (8 perguntas: P154-P161)
    {
      id: 'P154',
      texto: 'Qual é o prazo desejado para conclusão do projeto arquitetônico?',
      tipo: 'select',
      opcoes: [
        'Até 30 dias',
        '30-60 dias',
        '60-90 dias',
        '90-120 dias',
        'Acima de 120 dias',
        'Não tenho pressa'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P155',
      texto: 'Qual é o prazo desejado para início da construção?',
      tipo: 'select',
      opcoes: [
        'Imediatamente após aprovação',
        'Até 3 meses',
        '3-6 meses',
        '6-12 meses',
        'Acima de 12 meses',
        'Ainda não defini'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P156',
      texto: 'Qual é o prazo desejado para conclusão da obra?',
      tipo: 'select',
      opcoes: [
        'Até 6 meses',
        '6-12 meses',
        '12-18 meses',
        '18-24 meses',
        'Acima de 24 meses',
        'Ainda não defini'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P157',
      texto: 'É necessário auxílio para aprovação na prefeitura?',
      tipo: 'select',
      opcoes: [
        'Sim, preciso de ajuda completa',
        'Sim, preciso de orientação',
        'Não, posso fazer sozinho',
        'Já tenho profissional',
        'Não sei ainda'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P158',
      texto: 'É necessário auxílio para aprovação no corpo de bombeiros?',
      tipo: 'select',
      opcoes: [
        'Sim, preciso de ajuda',
        'Não, não é necessário',
        'Já tenho profissional',
        'Não sei se é necessário',
        'Ainda não pensei nisso'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P159',
      texto: 'Há outras aprovações necessárias (CREA, ambientais, etc.)?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva outras aprovações que podem ser necessárias',
      maxLength: 300,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P160',
      texto: 'Qual é a flexibilidade com prazos em caso de imprevistos?',
      tipo: 'select',
      opcoes: [
        'Total flexibilidade',
        'Flexibilidade moderada',
        'Pouca flexibilidade',
        'Nenhuma flexibilidade',
        'Depende do motivo'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },
    {
      id: 'P161',
      texto: 'Há datas específicas importantes a considerar?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Ex: mudança, casamento, aposentadoria, etc.',
      maxLength: 200,
      secao: 'SEÇÃO 12: CRONOGRAMA E APROVAÇÕES'
    },

    // SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO (8 perguntas: P162-P169)
    {
      id: 'P162',
      texto: 'Como prefere receber as comunicações sobre o projeto?',
      tipo: 'multiple',
      opcoes: [
        'WhatsApp',
        'E-mail',
        'Telefone',
        'Reuniões presenciais',
        'Videoconferência',
        'Sistema/plataforma online'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P163',
      texto: 'Qual é a frequência ideal de reuniões de acompanhamento?',
      tipo: 'select',
      opcoes: [
        'Semanal',
        'Quinzenal',
        'Mensal',
        'Conforme necessário',
        'Apenas marcos importantes'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P164',
      texto: 'Qual é o seu nível de envolvimento desejado nas decisões técnicas?',
      tipo: 'select',
      opcoes: [
        'Mínimo (confio no arquiteto)',
        'Básico (principais decisões)',
        'Médio (decisões importantes)',
        'Alto (todas as decisões)',
        'Total (cada detalhe)'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P165',
      texto: 'Como prefere receber e aprovar as etapas do projeto?',
      tipo: 'select',
      opcoes: [
        'Apresentação presencial',
        'Apresentação online',
        'Documentos por e-mail',
        'Sistema online',
        'Combinação de métodos'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P166',
      texto: 'Qual é o prazo ideal para análise e aprovação de cada etapa?',
      tipo: 'select',
      opcoes: [
        'Até 3 dias',
        '3-7 dias',
        '1-2 semanas',
        '2-3 semanas',
        'Mais de 3 semanas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P167',
      texto: 'Como prefere lidar com mudanças durante o projeto?',
      tipo: 'select',
      opcoes: [
        'Evitar mudanças',
        'Mudanças mínimas',
        'Mudanças moderadas',
        'Aberto a mudanças',
        'Mudanças são esperadas'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P168',
      texto: 'É importante ter um cronograma detalhado do projeto?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },
    {
      id: 'P169',
      texto: 'Como prefere acompanhar o progresso do projeto?',
      tipo: 'multiple',
      opcoes: [
        'Relatórios escritos',
        'Apresentações visuais',
        'Reuniões regulares',
        'Sistema online',
        'Visitas ao escritório',
        'Não preciso acompanhar'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 13: GESTÃO DO PROCESSO DE PROJETO'
    },

    // SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS (5 perguntas: P170-P174)
    {
      id: 'P170',
      texto: 'Quais são os principais riscos que você identifica no projeto?',
      tipo: 'multiple',
      opcoes: [
        'Orçamento insuficiente',
        'Prazo muito apertado',
        'Problemas de aprovação',
        'Mudanças de escopo',
        'Problemas no terreno',
        'Questões familiares/pessoais',
        'Mercado/economia',
        'Não identifico riscos'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS'
    },
    {
      id: 'P171',
      texto: 'Como prefere lidar com imprevistos durante o projeto?',
      tipo: 'select',
      opcoes: [
        'Parar e replanejar',
        'Adaptar e continuar',
        'Buscar alternativas',
        'Consultar especialistas',
        'Não sei, preciso orientação'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS'
    },
    {
      id: 'P172',
      texto: 'Há flexibilidade no cronograma para ajustes?',
      tipo: 'select',
      opcoes: [
        'Sim, total flexibilidade',
        'Sim, flexibilidade moderada',
        'Flexibilidade limitada',
        'Nenhuma flexibilidade',
        'Depende do motivo'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS'
    },
    {
      id: 'P173',
      texto: 'Há flexibilidade no orçamento para ajustes?',
      tipo: 'select',
      opcoes: [
        'Sim, total flexibilidade',
        'Sim, flexibilidade moderada',
        'Flexibilidade limitada',
        'Nenhuma flexibilidade',
        'Depende da necessidade'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS'
    },
    {
      id: 'P174',
      texto: 'Como prefere ser informado sobre riscos identificados?',
      tipo: 'select',
      opcoes: [
        'Imediatamente',
        'Em reuniões regulares',
        'Apenas se for crítico',
        'No final de cada etapa',
        'Não preciso ser informado'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 14: ANÁLISE DE RISCOS E CONTINGÊNCIAS'
    },

    // SEÇÃO 15: CUSTO-BENEFÍCIO E INVESTIMENTO (3 perguntas: P168-P170)
    {
      id: 'P168',
      texto: 'É importante ter retorno do investimento?',
      tipo: 'select',
      opcoes: [
        'Sim, muito importante',
        'Sim, importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 15: CUSTO-BENEFÍCIO E INVESTIMENTO'
    },
    {
      id: 'P169',
      texto: 'Há interesse em valorização do imóvel?',
      tipo: 'select',
      opcoes: [
        'Sim, muito interesse',
        'Sim, interesse moderado',
        'Interesse limitado',
        'Pouco interesse',
        'Nenhum interesse'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 15: CUSTO-BENEFÍCIO E INVESTIMENTO'
    },
    {
      id: 'P170',
      texto: 'É importante ter flexibilidade para ampliações?',
      tipo: 'select',
      opcoes: [
        'Muito importante',
        'Importante',
        'Moderadamente importante',
        'Pouco importante',
        'Não é importante'
      ],
      obrigatoria: true,
      secao: 'SEÇÃO 15: CUSTO-BENEFÍCIO E INVESTIMENTO'
    },

    // SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES (15 perguntas: P171-P185)
    {
      id: 'P171',
      texto: 'Há alguma restrição específica não mencionada?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva qualquer informação adicional relevante para o projeto',
      maxLength: 500,
      secao: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES'
    },
    {
      id: 'P172',
      texto: 'Há algum ambiente que deve ter prioridade no projeto?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Relate experiências anteriores que possam influenciar este projeto',
      maxLength: 400,
      secao: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES'
    },
    {
      id: 'P182',
      texto: 'Qual é a sua maior expectativa em relação ao resultado final?',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva sua principal expectativa para o projeto',
      maxLength: 300,
      secao: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES'
    },
    {
      id: 'P183',
      texto: 'Há alguma preocupação específica que gostaria de compartilhar?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Compartilhe suas preocupações sobre o projeto',
      maxLength: 300,
      secao: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES'
    },
    {
      id: 'P184',
      texto: 'Gostaria de deixar algum comentário final ou sugestão?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Comentários finais, sugestões ou observações',
      maxLength: 400,
      secao: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES'
    },
    {
      id: 'P185',
      texto: 'Há algum profissional de sua confiança que gostaria de indicar para a equipe?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Indique profissionais de confiança (engenheiros, consultores, etc.)',
      maxLength: 300,
      secao: 'SEÇÃO 16: INFORMAÇÕES COMPLEMENTARES'
    }
  ]
}; 