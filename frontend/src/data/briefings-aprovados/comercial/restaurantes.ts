// BRIEFING APROVADO: COMERCIAL - RESTAURANTES/BAR (VERSÃO COMPLETA)
// Convertido do formato markdown para TypeScript - 238 perguntas

import { BriefingCompleto } from '../../../types/briefing';

export const BRIEFING_COMERCIAL_RESTAURANTES: BriefingCompleto = {
  id: 'comercial-restaurantes-completo',
  tipologia: 'comercial',
  subtipo: 'restaurantes',
  padrao: 'profissional',
  nome: 'Plano de Necessidades - Comercial / Restaurantes & Bar (Completo)',
  descricao: 'Briefing completo para projetos gastronômicos com foco em operação, normas sanitárias e experiência do cliente',
  totalPerguntas: 238,
  tempoEstimado: '60-90 min',
  versao: '2.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['comercial', 'gastronomia', 'restaurante', 'bar', 'anvisa', 'sanitario'],
    categoria: 'comercial',
    complexidade: 'muito_alta',
    publico: ['arquitetos', 'empresarios', 'gastronomo', 'investidores']
  },
  secoes: [
    {
      id: 'qualificacao-inicial',
      nome: '🎯 Qualificação Inicial do Cliente',
      descricao: 'Avaliação da experiência e conhecimento gastronômico',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        {
          id: 1,
          tipo: 'radio',
          pergunta: 'Qual é a sua experiência anterior com projetos gastronômicos?',
          opcoes: ['Nenhuma', 'Básica (1-2 projetos)', 'Intermediária (3-5 projetos)', 'Avançada (mais de 5 projetos)'],
          obrigatoria: true
        },
        {
          id: 2,
          tipo: 'radio',
          pergunta: 'Qual é o seu conhecimento sobre normas sanitárias e de segurança alimentar?',
          opcoes: ['Nenhum', 'Básico', 'Intermediário', 'Avançado'],
          obrigatoria: true
        },
        {
          id: 3,
          tipo: 'radio',
          pergunta: 'Já trabalhou anteriormente com arquitetos para projetos gastronômicos?',
          opcoes: ['Nunca', 'Uma vez', 'Algumas vezes', 'Frequentemente'],
          obrigatoria: true
        },
        {
          id: 4,
          tipo: 'radio',
          pergunta: 'Qual é a sua disponibilidade para reuniões e decisões durante a obra?',
          opcoes: ['Baixa', 'Média', 'Alta', 'Total'],
          obrigatoria: true
        },
        {
          id: 5,
          tipo: 'text',
          pergunta: 'Quem é o decisor principal para aprovações do projeto?',
          obrigatoria: true,
          placeholder: 'Nome e cargo do decisor'
        },
        {
          id: 6,
          tipo: 'radio',
          pergunta: 'Há sócios ou investidores com poder de veto nas decisões?',
          opcoes: ['Não', 'Sim, um sócio', 'Sim, vários sócios', 'Sim, investidores'],
          obrigatoria: true
        },
        {
          id: 7,
          tipo: 'radio',
          pergunta: 'Qual é a sua expectativa sobre o cronograma e complexidade?',
          opcoes: ['Projeto simples', 'Projeto médio', 'Projeto complexo', 'Projeto muito complexo'],
          obrigatoria: true
        },
        {
          id: 8,
          tipo: 'radio',
          pergunta: 'Há compreensão sobre as exigências da vigilância sanitária?',
          opcoes: ['Nenhuma', 'Básica', 'Boa', 'Total'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'dados-basicos',
      nome: '📋 Dados Básicos do Projeto',
      descricao: 'Informações fundamentais do estabelecimento',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        {
          id: 9,
          tipo: 'text',
          pergunta: 'Qual é o nome do estabelecimento?',
          obrigatoria: true,
          placeholder: 'Nome fantasia do restaurante'
        },
        {
          id: 10,
          tipo: 'text',
          pergunta: 'Qual é o CNPJ da empresa?',
          obrigatoria: true,
          placeholder: '00.000.000/0000-00'
        },
        {
          id: 11,
          tipo: 'text',
          pergunta: 'Qual é o nome do responsável pelo projeto?',
          obrigatoria: true,
          placeholder: 'Nome completo'
        },
        {
          id: 12,
          tipo: 'text',
          pergunta: 'Qual é o telefone principal?',
          obrigatoria: true,
          placeholder: '(11) 99999-9999'
        },
        {
          id: 13,
          tipo: 'text',
          pergunta: 'Qual é o e-mail de contato?',
          obrigatoria: true,
          placeholder: 'email@restaurante.com'
        },
        {
          id: 14,
          tipo: 'text',
          pergunta: 'Qual é o endereço da empresa?',
          obrigatoria: true,
          placeholder: 'Endereço completo'
        },
        {
          id: 15,
          tipo: 'radio',
          pergunta: 'Qual é o tipo de estabelecimento?',
          opcoes: ['Restaurante', 'Bar', 'Lanchonete', 'Café', 'Pizzaria', 'Bistrô', 'Gastrobar'],
          obrigatoria: true
        },
        {
          id: 16,
          tipo: 'number',
          pergunta: 'Há quantos anos a empresa está no mercado?',
          obrigatoria: true,
          min: 0,
          max: 100
        },
        {
          id: 17,
          tipo: 'number',
          pergunta: 'Quantos funcionários trabalharão no local?',
          obrigatoria: true,
          min: 1,
          max: 200
        },
        {
          id: 18,
          tipo: 'text',
          pergunta: 'Qual é o horário de funcionamento previsto?',
          obrigatoria: true,
          placeholder: 'Ex: 12h às 23h de terça a domingo'
        },
        {
          id: 19,
          tipo: 'text',
          pergunta: 'Qual é a experiência anterior no ramo gastronômico?',
          obrigatoria: true,
          placeholder: 'Descrição da experiência'
        },
        {
          id: 20,
          tipo: 'radio',
          pergunta: 'Há outros estabelecimentos da mesma rede?',
          opcoes: ['Não', 'Sim, 1 unidade', 'Sim, 2-5 unidades', 'Sim, mais de 5 unidades'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'viabilidade-financeira',
      nome: '💰 Viabilidade Financeira',
      descricao: 'Análise da capacidade financeira e retorno do investimento',
      icon: '💰',
      obrigatoria: true,
      perguntas: [
        {
          id: 21,
          tipo: 'radio',
          pergunta: 'Qual é o orçamento total disponível?',
          opcoes: ['Até R$ 200 mil', 'R$ 200-500 mil', 'R$ 500 mil - 1 milhão', 'R$ 1-2 milhões', 'Acima de R$ 2 milhões'],
          obrigatoria: true
        },
        {
          id: 22,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui o projeto?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 23,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui a reforma/construção?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 24,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui equipamentos de cozinha?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 25,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui mobiliário?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 26,
          tipo: 'radio',
          pergunta: 'Como será o financiamento?',
          opcoes: ['Recursos próprios', 'Financiamento bancário', 'Investidores', 'Misto'],
          obrigatoria: true
        },
        {
          id: 27,
          tipo: 'radio',
          pergunta: 'Há prazo limite para inauguração?',
          opcoes: ['Sim, inflexível', 'Sim, flexível', 'Não há prazo'],
          obrigatoria: true
        },
        {
          id: 28,
          tipo: 'radio',
          pergunta: 'Há recursos para imprevistos (reserva de 20%)?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 29,
          tipo: 'number',
          pergunta: 'Qual é o valor do aluguel mensal?',
          obrigatoria: false,
          min: 0,
          max: 100000,
          placeholder: 'Valor em reais'
        },
        {
          id: 30,
          tipo: 'text',
          pergunta: 'Qual é o retorno esperado do investimento?',
          obrigatoria: false,
          placeholder: 'Percentual ou prazo esperado'
        },
        {
          id: 31,
          tipo: 'text',
          pergunta: 'Qual é o ponto de equilíbrio financeiro esperado?',
          obrigatoria: false,
          placeholder: 'Tempo ou faturamento para equilibrar'
        },
        {
          id: 32,
          tipo: 'radio',
          pergunta: 'Há capital de giro suficiente para operação?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 33,
          tipo: 'text',
          pergunta: 'Qual é o ticket médio esperado?',
          obrigatoria: false,
          placeholder: 'Valor médio por cliente'
        },
        {
          id: 34,
          tipo: 'radio',
          pergunta: 'Existe análise de viabilidade do negócio?',
          opcoes: ['Sim, completa', 'Sim, básica', 'Não'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'localizacao-imovel',
      nome: '🏢 Localização e Imóvel',
      descricao: 'Características do imóvel e análise de mercado',
      icon: '🏢',
      obrigatoria: true,
      perguntas: [
        {
          id: 35,
          tipo: 'text',
          pergunta: 'Qual é o endereço do imóvel?',
          obrigatoria: true,
          placeholder: 'Endereço completo do restaurante'
        },
        {
          id: 36,
          tipo: 'number',
          pergunta: 'Qual é a área total disponível (m²)?',
          obrigatoria: true,
          min: 50,
          max: 2000
        },
        {
          id: 37,
          tipo: 'radio',
          pergunta: 'O imóvel é próprio, alugado ou será adquirido?',
          opcoes: ['Próprio', 'Alugado', 'Será adquirido', 'Sociedade'],
          obrigatoria: true
        },
        {
          id: 38,
          tipo: 'radio',
          pergunta: 'Qual é o tipo de imóvel?',
          opcoes: ['Térreo', 'Sobreloja', 'Shopping', 'Galeria', 'Prédio comercial'],
          obrigatoria: true
        },
        {
          id: 39,
          tipo: 'radio',
          pergunta: 'Há estacionamento disponível?',
          opcoes: ['Sim, privativo', 'Sim, público', 'Não', 'Valet'],
          obrigatoria: true
        },
        {
          id: 40,
          tipo: 'radio',
          pergunta: 'Há área externa disponível (calçada, terraço)?',
          opcoes: ['Sim, ampla', 'Sim, pequena', 'Não', 'Possível'],
          obrigatoria: true
        },
        {
          id: 41,
          tipo: 'radio',
          pergunta: 'Qual é o fluxo de pedestres na região?',
          opcoes: ['Muito alto', 'Alto', 'Médio', 'Baixo'],
          obrigatoria: true
        },
        {
          id: 42,
          tipo: 'radio',
          pergunta: 'Há concorrentes próximos?',
          opcoes: ['Muitos', 'Alguns', 'Poucos', 'Nenhum'],
          obrigatoria: true
        },
        {
          id: 43,
          tipo: 'checkbox',
          pergunta: 'Qual é a infraestrutura disponível?',
          opcoes: ['Água', 'Luz', 'Esgoto', 'Gás', 'Internet', 'Telefone', 'Câmeras'],
          obrigatoria: true
        },
        {
          id: 44,
          tipo: 'text',
          pergunta: 'Há restrições do condomínio ou shopping?',
          obrigatoria: false,
          placeholder: 'Descreva as restrições'
        },
        {
          id: 45,
          tipo: 'text',
          pergunta: 'Qual é o horário de funcionamento permitido?',
          obrigatoria: true,
          placeholder: 'Horários permitidos no local'
        },
        {
          id: 46,
          tipo: 'radio',
          pergunta: 'Há limitações de ruído?',
          opcoes: ['Sim, severas', 'Sim, moderadas', 'Não'],
          obrigatoria: true
        },
        {
          id: 47,
          tipo: 'radio',
          pergunta: 'Qual é o perfil socioeconômico da região?',
          opcoes: ['Classe A', 'Classe B', 'Classe C', 'Misto'],
          obrigatoria: true
        },
        {
          id: 48,
          tipo: 'radio',
          pergunta: 'Há facilidade de acesso por transporte público?',
          opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim'],
          obrigatoria: true
        },
        {
          id: 49,
          tipo: 'radio',
          pergunta: 'Existe potencial de crescimento da região?',
          opcoes: ['Alto', 'Médio', 'Baixo', 'Não sei'],
          obrigatoria: true
        },
        {
          id: 50,
          tipo: 'radio',
          pergunta: 'Qual é a segurança da localização?',
          opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'conceito-cardapio',
      nome: '🍽️ Conceito e Cardápio',
      descricao: 'Definição do conceito gastronômico e operacional',
      icon: '🍽️',
      obrigatoria: true,
      perguntas: [
        {
          id: 51,
          tipo: 'text',
          pergunta: 'Qual é o conceito do estabelecimento?',
          obrigatoria: true,
          placeholder: 'Descrição do conceito gastronômico'
        },
        {
          id: 52,
          tipo: 'text',
          pergunta: 'Qual é o público-alvo principal?',
          obrigatoria: true,
          placeholder: 'Perfil dos clientes'
        },
        {
          id: 53,
          tipo: 'radio',
          pergunta: 'Qual é o tipo de cardápio?',
          opcoes: ['À la carte', 'Self-service', 'Fast food', 'Buffet', 'Misto'],
          obrigatoria: true
        },
        {
          id: 54,
          tipo: 'radio',
          pergunta: 'Qual é a faixa de preço dos pratos?',
          opcoes: ['R$ 10-25', 'R$ 25-50', 'R$ 50-100', 'Acima de R$ 100'],
          obrigatoria: true
        },
        {
          id: 55,
          tipo: 'text',
          pergunta: 'Há especialidade culinária específica?',
          obrigatoria: false,
          placeholder: 'Ex: Italiana, Japonesa, Brasileira'
        },
        {
          id: 56,
          tipo: 'radio',
          pergunta: 'É servido café da manhã?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 57,
          tipo: 'radio',
          pergunta: 'É servido almoço?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 58,
          tipo: 'radio',
          pergunta: 'É servido jantar?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 59,
          tipo: 'radio',
          pergunta: 'São servidas bebidas alcoólicas?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 60,
          tipo: 'radio',
          pergunta: 'Há delivery/take away?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 61,
          tipo: 'radio',
          pergunta: 'É necessário espaço para eventos?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 62,
          tipo: 'number',
          pergunta: 'Qual é a capacidade de atendimento desejada?',
          obrigatoria: true,
          min: 20,
          max: 500,
          placeholder: 'Número de lugares'
        },
        {
          id: 63,
          tipo: 'radio',
          pergunta: 'Há sazonalidade no cardápio?',
          opcoes: ['Sim', 'Não', 'Parcial'],
          obrigatoria: true
        },
        {
          id: 64,
          tipo: 'radio',
          pergunta: 'É necessário cardápio para dietas especiais?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 65,
          tipo: 'text',
          pergunta: 'Há produtos que requerem preparo especial?',
          obrigatoria: false,
          placeholder: 'Descreva preparos especiais'
        },
        {
          id: 66,
          tipo: 'radio',
          pergunta: 'Existe necessidade de área para degustação?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'programa-arquitetonico',
      nome: '🏗️ Programa Arquitetônico',
      descricao: 'Definição de ambientes e necessidades espaciais',
      icon: '🏗️',
      obrigatoria: true,
      perguntas: [
        {
          id: 67,
          tipo: 'number',
          pergunta: 'Quantos lugares são necessários no salão?',
          obrigatoria: true,
          min: 20,
          max: 500
        },
        {
          id: 68,
          tipo: 'radio',
          pergunta: 'É necessário bar/balcão?',
          opcoes: ['Sim, principal', 'Sim, apoio', 'Não'],
          obrigatoria: true
        },
        {
          id: 69,
          tipo: 'radio',
          pergunta: 'É necessária cozinha completa?',
          opcoes: ['Sim', 'Não', 'Básica'],
          obrigatoria: true
        },
        {
          id: 70,
          tipo: 'radio',
          pergunta: 'É necessária copa/apoio?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        },
        {
          id: 71,
          tipo: 'radio',
          pergunta: 'É necessário depósito/estoque?',
          opcoes: ['Sim', 'Não', 'Terceirizado'],
          obrigatoria: true
        },
        {
          id: 72,
          tipo: 'radio',
          pergunta: 'É necessário escritório/administração?',
          opcoes: ['Sim', 'Não', 'Integrado'],
          obrigatoria: true
        },
        {
          id: 73,
          tipo: 'radio',
          pergunta: 'É necessário vestiário para funcionários?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 74,
          tipo: 'radio',
          pergunta: 'É necessário banheiro para clientes?',
          opcoes: ['Sim, múltiplos', 'Sim, um', 'Usar do prédio'],
          obrigatoria: true
        },
        {
          id: 75,
          tipo: 'radio',
          pergunta: 'É necessário banheiro para funcionários?',
          opcoes: ['Sim', 'Não', 'Compartilhado'],
          obrigatoria: true
        },
        {
          id: 76,
          tipo: 'radio',
          pergunta: 'É necessária área de recebimento de mercadorias?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        },
        {
          id: 77,
          tipo: 'radio',
          pergunta: 'É necessária área externa/terraço?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 78,
          tipo: 'radio',
          pergunta: 'É necessário espaço para música ao vivo?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 79,
          tipo: 'radio',
          pergunta: 'É necessária área para fumantes?',
          opcoes: ['Sim', 'Não', 'Externa'],
          obrigatoria: true
        },
        {
          id: 80,
          tipo: 'radio',
          pergunta: 'É necessário espaço kids?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 81,
          tipo: 'radio',
          pergunta: 'É necessária área de espera?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        },
        {
          id: 82,
          tipo: 'radio',
          pergunta: 'É necessário espaço para eventos privados?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 83,
          tipo: 'radio',
          pergunta: 'É necessária área de self-service?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 84,
          tipo: 'radio',
          pergunta: 'É necessário espaço para buffet?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'cozinha-operacao',
      nome: '👨‍🍳 Cozinha e Operação',
      descricao: 'Equipamentos e fluxo operacional da cozinha',
      icon: '👨‍🍳',
      obrigatoria: true,
      perguntas: [
        {
          id: 85,
          tipo: 'radio',
          pergunta: 'Qual é o tipo de cozinha necessária?',
          opcoes: ['Completa', 'Básica', 'Industrial', 'Gourmet'],
          obrigatoria: true
        },
        {
          id: 86,
          tipo: 'radio',
          pergunta: 'É necessário forno industrial?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 87,
          tipo: 'radio',
          pergunta: 'É necessário fogão industrial?',
          opcoes: ['Sim', 'Não', 'Residencial'],
          obrigatoria: true
        },
        {
          id: 88,
          tipo: 'radio',
          pergunta: 'É necessária fritadeira?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 89,
          tipo: 'radio',
          pergunta: 'É necessária chapa/grill?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 90,
          tipo: 'radio',
          pergunta: 'É necessário forno de pizza?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 91,
          tipo: 'radio',
          pergunta: 'É necessária coifa/exaustão?',
          opcoes: ['Sim', 'Não', 'Básica'],
          obrigatoria: true
        },
        {
          id: 92,
          tipo: 'radio',
          pergunta: 'É necessária câmara fria?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 93,
          tipo: 'radio',
          pergunta: 'É necessário freezer?',
          opcoes: ['Sim', 'Não', 'Múltiplos'],
          obrigatoria: true
        },
        {
          id: 94,
          tipo: 'radio',
          pergunta: 'É necessária geladeira industrial?',
          opcoes: ['Sim', 'Não', 'Múltiplas'],
          obrigatoria: true
        },
        {
          id: 95,
          tipo: 'radio',
          pergunta: 'É necessária pia industrial?',
          opcoes: ['Sim', 'Não', 'Múltiplas'],
          obrigatoria: true
        },
        {
          id: 96,
          tipo: 'radio',
          pergunta: 'É necessário espaço para preparo?',
          opcoes: ['Sim, amplo', 'Sim, básico', 'Não'],
          obrigatoria: true
        },
        {
          id: 97,
          tipo: 'radio',
          pergunta: 'É necessário espaço para higienização?',
          opcoes: ['Sim', 'Não', 'Integrado'],
          obrigatoria: true
        },
        {
          id: 98,
          tipo: 'radio',
          pergunta: 'É necessária área suja/limpa separada?',
          opcoes: ['Sim', 'Não', 'Parcial'],
          obrigatoria: true
        },
        {
          id: 99,
          tipo: 'radio',
          pergunta: 'É necessário sistema de tratamento de gordura?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 100,
          tipo: 'radio',
          pergunta: 'É necessário sistema de controle de temperatura?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 101,
          tipo: 'radio',
          pergunta: 'É necessário equipamento de segurança alimentar?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 102,
          tipo: 'radio',
          pergunta: 'É necessário sistema de monitoramento HACCP?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'sistemas-instalacoes',
      nome: '🔧 Sistemas e Instalações',
      descricao: 'Infraestrutura técnica e instalações especiais',
      icon: '🔧',
      obrigatoria: true,
      perguntas: [
        {
          id: 103,
          tipo: 'radio',
          pergunta: 'É necessário sistema de exaustão?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 104,
          tipo: 'radio',
          pergunta: 'É necessário sistema de ar condicionado?',
          opcoes: ['Sim, central', 'Sim, split', 'Não'],
          obrigatoria: true
        },
        {
          id: 105,
          tipo: 'radio',
          pergunta: 'É necessário sistema de som?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 106,
          tipo: 'radio',
          pergunta: 'É necessário sistema de iluminação especial?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 107,
          tipo: 'radio',
          pergunta: 'É necessária instalação de gás?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 108,
          tipo: 'radio',
          pergunta: 'É necessário sistema de segurança?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 109,
          tipo: 'radio',
          pergunta: 'É necessária instalação elétrica reforçada?',
          opcoes: ['Sim', 'Não', 'Parcial'],
          obrigatoria: true
        },
        {
          id: 110,
          tipo: 'radio',
          pergunta: 'É necessário sistema de telefonia/internet?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 111,
          tipo: 'radio',
          pergunta: 'É necessário sistema de TV?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 112,
          tipo: 'radio',
          pergunta: 'É necessário sistema de alarme?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 113,
          tipo: 'radio',
          pergunta: 'É necessário sistema de detecção de vazamento de gás?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 114,
          tipo: 'radio',
          pergunta: 'É necessário sistema de backup de energia?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 115,
          tipo: 'radio',
          pergunta: 'É necessário sistema de água filtrada?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 116,
          tipo: 'radio',
          pergunta: 'É necessário sistema de tratamento de efluentes?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 117,
          tipo: 'radio',
          pergunta: 'É necessário sistema de ventilação na área de refeições?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 118,
          tipo: 'radio',
          pergunta: 'É necessário sistema de comunicação cozinha-salão?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'ambientacao-decoracao',
      nome: '🎨 Ambientação e Decoração',
      descricao: 'Conceito visual e experiência do cliente',
      icon: '🎨',
      obrigatoria: true,
      perguntas: [
        {id: 119, tipo: 'text', pergunta: 'Qual é o estilo/tema desejado?', obrigatoria: true, placeholder: 'Descrição do estilo'},
        {id: 120, tipo: 'radio', pergunta: 'Há cores específicas da marca?', opcoes: ['Sim', 'Não', 'Flexível'], obrigatoria: true},
        {id: 121, tipo: 'radio', pergunta: 'É importante que seja instagramável?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 122, tipo: 'text', pergunta: 'Há referências visuais?', obrigatoria: false, placeholder: 'Referências de decoração'},
        {id: 123, tipo: 'radio', pergunta: 'É necessária música ambiente?', opcoes: ['Sim', 'Não', 'Ocasional'], obrigatoria: true},
        {id: 124, tipo: 'radio', pergunta: 'É importante ter iluminação romântica/aconchegante?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 125, tipo: 'radio', pergunta: 'É necessário espaço para exposição de produtos?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 126, tipo: 'radio', pergunta: 'É importante ter plantas/decoração natural?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 127, tipo: 'radio', pergunta: 'É necessária comunicação visual específica?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true},
        {id: 128, tipo: 'radio', pergunta: 'É importante ter área para fotos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 129, tipo: 'radio', pergunta: 'É necessário sistema de iluminação cênica?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 130, tipo: 'radio', pergunta: 'É importante ter elementos temáticos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 131, tipo: 'radio', pergunta: 'É necessário espaço para arte/decoração?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 132, tipo: 'radio', pergunta: 'É importante ter identidade visual forte?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true}
      ]
    },
    {
      id: 'normas-licencas',
      nome: '📋 Normas e Licenças',
      descricao: 'Licenciamento e conformidades legais',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        {id: 133, tipo: 'radio', pergunta: 'É necessário alvará de funcionamento?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 134, tipo: 'radio', pergunta: 'É necessária licença sanitária?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 135, tipo: 'radio', pergunta: 'É necessária aprovação no corpo de bombeiros?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 136, tipo: 'radio', pergunta: 'É necessário projeto de prevenção contra incêndio?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 137, tipo: 'text', pergunta: 'Há normas específicas da vigilância sanitária?', obrigatoria: false, placeholder: 'RDC 275, portarias específicas'},
        {id: 138, tipo: 'radio', pergunta: 'É necessária licença para música ao vivo?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 139, tipo: 'radio', pergunta: 'É necessária licença para bebidas alcoólicas?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 140, tipo: 'text', pergunta: 'Há outras licenças específicas?', obrigatoria: false, placeholder: 'Outras licenças necessárias'},
        {id: 141, tipo: 'radio', pergunta: 'É necessário laudo de vistoria sanitária?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 142, tipo: 'radio', pergunta: 'É necessário certificado de potabilidade da água?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 143, tipo: 'radio', pergunta: 'É necessário controle de pragas?', opcoes: ['Sim', 'Não', 'Terceirizado'], obrigatoria: true},
        {id: 144, tipo: 'text', pergunta: 'Há exigências específicas do corpo de bombeiros?', obrigatoria: false, placeholder: 'Exigências específicas'}
      ]
    },
    {
      id: 'cronograma-operacao',
      nome: '📅 Cronograma e Operação',
      descricao: 'Planejamento de inauguração e operação',
      icon: '📅',
      obrigatoria: true,
      perguntas: [
        {id: 145, tipo: 'date', pergunta: 'Qual é o prazo desejado para inauguração?', obrigatoria: false},
        {id: 146, tipo: 'radio', pergunta: 'Há sazonalidade que deve ser considerada?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 147, tipo: 'radio', pergunta: 'É importante inaugurar em data específica?', opcoes: ['Sim', 'Não', 'Preferível'], obrigatoria: true},
        {id: 148, tipo: 'radio', pergunta: 'Há fornecedores que dependem do cronograma?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 149, tipo: 'radio', pergunta: 'É necessário treinamento da equipe?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 150, tipo: 'radio', pergunta: 'Há mudança de endereço de estabelecimento existente?', opcoes: ['Sim', 'Não', 'Expansão'], obrigatoria: true},
        {id: 151, tipo: 'radio', pergunta: 'É necessário comunicar clientes sobre mudança?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 152, tipo: 'radio', pergunta: 'Há contratos que dependem da inauguração?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 153, tipo: 'radio', pergunta: 'É necessário período de testes dos equipamentos?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 154, tipo: 'radio', pergunta: 'Há campanhas de marketing vinculadas à inauguração?', opcoes: ['Sim', 'Não', 'Planejadas'], obrigatoria: true},
        {id: 155, tipo: 'radio', pergunta: 'É necessário estoque mínimo para abertura?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 156, tipo: 'radio', pergunta: 'Há necessidade de licenças temporárias?', opcoes: ['Sim', 'Não', 'Não sei'], obrigatoria: true}
      ]
    },
    {
      id: 'sustentabilidade',
      nome: '🌱 Sustentabilidade',
      descricao: 'Práticas sustentáveis e responsabilidade ambiental',
      icon: '🌱',
      obrigatoria: false,
      perguntas: [
        {id: 157, tipo: 'radio', pergunta: 'Há interesse em soluções sustentáveis?', opcoes: ['Muito interesse', 'Interesse médio', 'Pouco interesse'], obrigatoria: true},
        {id: 158, tipo: 'radio', pergunta: 'É importante ter eficiência energética?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 159, tipo: 'radio', pergunta: 'É importante usar materiais ecológicos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 160, tipo: 'radio', pergunta: 'Há interesse em reduzir desperdício?', opcoes: ['Muito interesse', 'Interesse médio', 'Pouco interesse'], obrigatoria: true},
        {id: 161, tipo: 'radio', pergunta: 'É importante ter gestão de resíduos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 162, tipo: 'radio', pergunta: 'Há interesse em fornecedores locais?', opcoes: ['Muito interesse', 'Interesse médio', 'Pouco interesse'], obrigatoria: true},
        {id: 163, tipo: 'radio', pergunta: 'É importante ter compostagem?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 164, tipo: 'radio', pergunta: 'Há interesse em energia renovável?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 165, tipo: 'radio', pergunta: 'É importante ter reuso de água?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 166, tipo: 'radio', pergunta: 'Existe preocupação com pegada de carbono?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 167, tipo: 'radio', pergunta: 'É importante ter certificação ambiental?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 168, tipo: 'radio', pergunta: 'Há interesse em materiais reciclados?', opcoes: ['Muito interesse', 'Interesse médio', 'Pouco interesse'], obrigatoria: true}
      ]
    },
    {
      id: 'seguranca-acessibilidade',
      nome: '🔒 Segurança e Acessibilidade',
      descricao: 'Segurança patrimonial e acessibilidade universal',
      icon: '🔒',
      obrigatoria: true,
      perguntas: [
        {id: 169, tipo: 'radio', pergunta: 'É necessário sistema anti-furto?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 170, tipo: 'radio', pergunta: 'É necessário controle de acesso?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 171, tipo: 'radio', pergunta: 'É necessário cofre?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 172, tipo: 'radio', pergunta: 'É necessário acesso para pessoas com deficiência?', opcoes: ['Sim', 'Não', 'Já existe'], obrigatoria: true},
        {id: 173, tipo: 'radio', pergunta: 'É necessário banheiro acessível?', opcoes: ['Sim', 'Não', 'Já existe'], obrigatoria: true},
        {id: 174, tipo: 'radio', pergunta: 'Há necessidade de sinalização especial?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true},
        {id: 175, tipo: 'radio', pergunta: 'É necessário sistema de emergência?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 176, tipo: 'radio', pergunta: 'É necessário sistema de detecção de incêndio?', opcoes: ['Sim', 'Não', 'Já existe'], obrigatoria: true},
        {id: 177, tipo: 'radio', pergunta: 'É necessário controle de acesso à cozinha?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 178, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 179, tipo: 'radio', pergunta: 'É necessário protocolo de segurança alimentar?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 180, tipo: 'radio', pergunta: 'É necessário sistema de rastreabilidade de ingredientes?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true}
      ]
    },
    {
      id: 'operacao-gastronomica',
      nome: '🍴 Operação Gastronômica',
      descricao: 'Operação especializada e controles gastronômicos',
      icon: '🍴',
      obrigatoria: true,
      perguntas: [
        {id: 181, tipo: 'number', pergunta: 'Qual é o volume de refeições servidas por dia?', obrigatoria: true, min: 10, max: 2000},
        {id: 182, tipo: 'text', pergunta: 'Qual é o horário de pico de movimento?', obrigatoria: true, placeholder: 'Ex: 12h-14h e 19h-21h'},
        {id: 183, tipo: 'radio', pergunta: 'É necessário cardápio digital/QR Code?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 184, tipo: 'radio', pergunta: 'É feito controle de temperatura dos alimentos?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 185, tipo: 'radio', pergunta: 'É necessário sistema de pedidos online?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 186, tipo: 'radio', pergunta: 'Há necessidade de área para entregadores?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 187, tipo: 'radio', pergunta: 'É necessário espaço para higienização de mãos dos clientes?', opcoes: ['Sim', 'Não', 'Já existe'], obrigatoria: true},
        {id: 188, tipo: 'radio', pergunta: 'É feito controle de validade dos ingredientes?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 189, tipo: 'radio', pergunta: 'É necessário sistema de ventilação na área de refeições?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 190, tipo: 'radio', pergunta: 'Há necessidade de área para preparo de bebidas especiais?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 191, tipo: 'radio', pergunta: 'É necessário espaço para armazenamento de bebidas?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 192, tipo: 'radio', pergunta: 'É feito controle de pragas? Precisa de área específica?', opcoes: ['Sim', 'Não', 'Terceirizado'], obrigatoria: true},
        {id: 193, tipo: 'radio', pergunta: 'É necessário sistema de água filtrada?', opcoes: ['Sim', 'Não', 'Já existe'], obrigatoria: true},
        {id: 194, tipo: 'radio', pergunta: 'Há necessidade de área para limpeza de equipamentos?', opcoes: ['Sim', 'Não', 'Integrada'], obrigatoria: true},
        {id: 195, tipo: 'radio', pergunta: 'É necessário espaço para uniformes/EPIs?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 196, tipo: 'radio', pergunta: 'É feito controle de resíduos orgânicos?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 197, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento de temperatura?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 198, tipo: 'radio', pergunta: 'Há necessidade de área para recebimento de gás?', opcoes: ['Sim', 'Não', 'Já existe'], obrigatoria: true},
        {id: 199, tipo: 'radio', pergunta: 'É necessário sistema de detecção de vazamento de gás?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 200, tipo: 'radio', pergunta: 'É feito controle de qualidade da água?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 201, tipo: 'radio', pergunta: 'É necessário espaço para produtos de limpeza?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 202, tipo: 'radio', pergunta: 'Há necessidade de área para manutenção de equipamentos?', opcoes: ['Sim', 'Não', 'Terceirizada'], obrigatoria: true},
        {id: 203, tipo: 'radio', pergunta: 'É necessário sistema de backup de energia para refrigeração?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 204, tipo: 'radio', pergunta: 'É feito controle de umidade nos estoques?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 205, tipo: 'radio', pergunta: 'É necessário espaço para degustação/teste de pratos?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 206, tipo: 'radio', pergunta: 'Há necessidade de área para preparo de sobremesas?', opcoes: ['Sim', 'Não', 'Integrada'], obrigatoria: true},
        {id: 207, tipo: 'radio', pergunta: 'É necessário sistema de som na cozinha?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 208, tipo: 'radio', pergunta: 'É feito controle de acesso à cozinha?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 209, tipo: 'radio', pergunta: 'É necessário sistema de comunicação cozinha-salão?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 210, tipo: 'radio', pergunta: 'Há necessidade de área para embalagens de delivery?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true}
      ]
    },
    {
      id: 'gestao-processo-projeto',
      nome: '📈 Gestão do Processo de Projeto',
      descricao: 'Organização e controle do desenvolvimento do projeto',
      icon: '📈',
      obrigatoria: true,
      perguntas: [
        {id: 211, tipo: 'radio', pergunta: 'Qual é a frequência desejada de reuniões de acompanhamento?', opcoes: ['Semanal', 'Quinzenal', 'Mensal', 'Conforme necessário'], obrigatoria: true},
        {id: 212, tipo: 'radio', pergunta: 'Há preferência por comunicação digital ou presencial?', opcoes: ['Digital', 'Presencial', 'Híbrida'], obrigatoria: true},
        {id: 213, tipo: 'text', pergunta: 'Quem será o interlocutor principal com a equipe de projeto?', obrigatoria: true, placeholder: 'Nome e cargo do responsável'},
        {id: 214, tipo: 'radio', pergunta: 'Qual é a disponibilidade para tomada de decisões urgentes?', opcoes: ['Imediata', 'Até 24h', 'Até 48h', 'Até 1 semana'], obrigatoria: true},
        {id: 215, tipo: 'radio', pergunta: 'Há necessidade de aprovação de sócios para decisões?', opcoes: ['Sempre', 'Grandes decisões', 'Raramente', 'Nunca'], obrigatoria: true},
        {id: 216, tipo: 'text', pergunta: 'Qual é o processo interno de validação empresarial?', obrigatoria: false, placeholder: 'Descreva o processo'},
        {id: 217, tipo: 'radio', pergunta: 'Há preferência por relatórios detalhados ou resumidos?', opcoes: ['Detalhados', 'Resumidos', 'Ambos'], obrigatoria: true},
        {id: 218, tipo: 'radio', pergunta: 'Existe necessidade de documentação específica do processo?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true}
      ]
    },
    {
      id: 'analise-riscos-contingencias',
      nome: '⚠️ Análise de Riscos e Contingências',
      descricao: 'Gestão de riscos específicos da gastronomia',
      icon: '⚠️',
      obrigatoria: true,
      perguntas: [
        {id: 219, tipo: 'radio', pergunta: 'Qual é a tolerância a atrasos no cronograma?', opcoes: ['Nenhuma', 'Até 1 semana', 'Até 1 mês', 'Flexível'], obrigatoria: true},
        {id: 220, tipo: 'radio', pergunta: 'Existe capacidade financeira para imprevistos de 20%?', opcoes: ['Sim', 'Não', 'Parcialmente'], obrigatoria: true},
        {id: 221, tipo: 'radio', pergunta: 'Há flexibilidade para mudanças de escopo durante o projeto?', opcoes: ['Alta', 'Média', 'Baixa', 'Nenhuma'], obrigatoria: true},
        {id: 222, tipo: 'text', pergunta: 'Qual é a estratégia para lidar com problemas de aprovação sanitária?', obrigatoria: false, placeholder: 'Estratégia para vigilância sanitária'},
        {id: 223, tipo: 'text', pergunta: 'Existe plano alternativo para questões de licenciamento?', obrigatoria: false, placeholder: 'Plano para licenças'},
        {id: 224, tipo: 'radio', pergunta: 'Há tolerância a variações de custo durante a obra?', opcoes: ['Até 5%', 'Até 10%', 'Até 20%', 'Nenhuma'], obrigatoria: true},
        {id: 225, tipo: 'text', pergunta: 'Qual é a estratégia para problemas de fornecimento de equipamentos?', obrigatoria: false, placeholder: 'Estratégia para equipamentos'},
        {id: 226, tipo: 'radio', pergunta: 'Existe seguro específico para a obra e equipamentos?', opcoes: ['Sim', 'Não', 'Será contratado'], obrigatoria: true}
      ]
    },
    {
      id: 'informacoes-complementares',
      nome: '📝 Informações Complementares',
      descricao: 'Informações adicionais e observações especiais',
      icon: '📝',
      obrigatoria: false,
      perguntas: [
        {id: 227, tipo: 'textarea', pergunta: 'Há alguma restrição específica não mencionada?', obrigatoria: false, placeholder: 'Restrições específicas'},
        {id: 228, tipo: 'text', pergunta: 'Há algum ambiente que deve ter prioridade no projeto?', obrigatoria: false, placeholder: 'Ambiente prioritário'},
        {id: 229, tipo: 'text', pergunta: 'Há algum ambiente que pode ser eliminado se necessário?', obrigatoria: false, placeholder: 'Ambiente dispensável'},
        {id: 230, tipo: 'text', pergunta: 'Há preferência por algum profissional específico para a obra?', obrigatoria: false, placeholder: 'Profissional preferido'},
        {id: 231, tipo: 'radio', pergunta: 'Já possui algum projeto ou estudo preliminar?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 232, tipo: 'text', pergunta: 'Há alguma experiência anterior com projetos gastronômicos?', obrigatoria: false, placeholder: 'Experiência anterior'},
        {id: 233, tipo: 'textarea', pergunta: 'Há alguma preocupação específica com a obra?', obrigatoria: false, placeholder: 'Preocupações específicas'},
        {id: 234, tipo: 'date', pergunta: 'Há algum prazo específico para inauguração?', obrigatoria: false},
        {id: 235, tipo: 'text', pergunta: 'Há alguma tradição culinária que deve ser considerada?', obrigatoria: false, placeholder: 'Tradições culinárias'},
        {id: 236, tipo: 'text', pergunta: 'Há necessidades específicas relacionadas ao tipo de culinária?', obrigatoria: false, placeholder: 'Necessidades específicas'},
        {id: 237, tipo: 'text', pergunta: 'Há fornecedores específicos que influenciam o projeto?', obrigatoria: false, placeholder: 'Fornecedores específicos'},
        {id: 238, tipo: 'textarea', pergunta: 'Há alguma informação adicional importante?', obrigatoria: false, placeholder: 'Informações adicionais importantes'}
      ]
    }
  ]
}; 