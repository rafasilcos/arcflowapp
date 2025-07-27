// BRIEFING APROVADO: COMERCIAL - LOJAS/VAREJO (VERSÃO COMPLETA)
// Convertido do formato markdown para TypeScript - 218 perguntas

import { BriefingCompleto } from '../../../types/briefing';

export const BRIEFING_COMERCIAL_LOJAS: BriefingCompleto = {
  id: 'comercial-lojas-completo',
  tipologia: 'comercial',
  subtipo: 'lojas',
  padrao: 'profissional',
  nome: 'Plano de Necessidades - Comercial / Loja/Varejo (Completo)',
  descricao: 'Briefing completo para projetos de lojas e estabelecimentos comerciais com análise profunda de viabilidade',
  totalPerguntas: 218,
  tempoEstimado: '60-90 min',
  versao: '2.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['comercial', 'loja', 'varejo', 'viabilidade', 'negocio'],
    categoria: 'comercial',
    complexidade: 'muito_alta',
    publico: ['arquitetos', 'empreendedores', 'lojistas', 'investidores']
  },
  secoes: [
    {
      id: 'qualificacao-inicial',
      nome: '🎯 Qualificação Inicial do Cliente',
      descricao: 'Avaliação da experiência e maturidade do cliente',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        {
          id: 1,
          tipo: 'radio',
          pergunta: 'Qual é a sua experiência anterior com projetos comerciais?',
          opcoes: ['Nenhuma', 'Básica (1-2 projetos)', 'Intermediária (3-5 projetos)', 'Avançada (mais de 5 projetos)'],
          obrigatoria: true
        },
        {
          id: 2,
          tipo: 'radio',
          pergunta: 'Qual é o seu conhecimento sobre normas comerciais e sanitárias?',
          opcoes: ['Nenhum', 'Básico', 'Intermediário', 'Avançado'],
          obrigatoria: true
        },
        {
          id: 3,
          tipo: 'radio',
          pergunta: 'Já trabalhou anteriormente com arquitetos para projetos comerciais?',
          opcoes: ['Nunca', 'Uma vez', 'Algumas vezes', 'Frequentemente'],
          obrigatoria: true
        },
        {
          id: 4,
          tipo: 'radio',
          pergunta: 'Qual é a sua disponibilidade para reuniões e decisões rápidas?',
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
          pergunta: 'Há sócios ou parceiros com poder de veto nas decisões?',
          opcoes: ['Não', 'Sim, um sócio', 'Sim, vários sócios', 'Sim, conselho'],
          obrigatoria: true
        },
        {
          id: 7,
          tipo: 'radio',
          pergunta: 'Qual é a sua expectativa sobre o cronograma do projeto?',
          opcoes: ['Muito urgente (1-2 meses)', 'Urgente (3-4 meses)', 'Normal (5-6 meses)', 'Flexível (mais de 6 meses)'],
          obrigatoria: true
        },
        {
          id: 8,
          tipo: 'radio',
          pergunta: 'Há compreensão sobre a complexidade de aprovações comerciais?',
          opcoes: ['Nenhuma', 'Básica', 'Boa', 'Total'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'dados-basicos',
      nome: '📋 Dados Básicos do Projeto',
      descricao: 'Informações fundamentais da empresa e projeto',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        {
          id: 9,
          tipo: 'text',
          pergunta: 'Qual é o nome da empresa/estabelecimento?',
          obrigatoria: true,
          placeholder: 'Razão social completa'
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
          placeholder: 'email@empresa.com'
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
          tipo: 'text',
          pergunta: 'Qual é o ramo de atividade específico?',
          obrigatoria: true,
          placeholder: 'Descrição detalhada da atividade'
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
          max: 100
        },
        {
          id: 18,
          tipo: 'text',
          pergunta: 'Qual é o horário de funcionamento previsto?',
          obrigatoria: true,
          placeholder: 'Ex: 08h às 18h de segunda a sábado'
        },
        {
          id: 19,
          tipo: 'radio',
          pergunta: 'Qual é o faturamento mensal médio da empresa?',
          opcoes: ['Até R$ 50 mil', 'R$ 50-100 mil', 'R$ 100-300 mil', 'R$ 300-500 mil', 'Acima de R$ 500 mil'],
          obrigatoria: false
        },
        {
          id: 20,
          tipo: 'radio',
          pergunta: 'Há experiência anterior com gestão de pontos comerciais?',
          opcoes: ['Nenhuma', 'Pouca', 'Média', 'Muita'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'viabilidade-financeira',
      nome: '💰 Viabilidade Financeira',
      descricao: 'Análise completa da capacidade financeira do projeto',
      icon: '💰',
      obrigatoria: true,
      perguntas: [
        {
          id: 21,
          tipo: 'radio',
          pergunta: 'Qual é o orçamento total disponível para o projeto?',
          opcoes: ['Até R$ 50 mil', 'R$ 50-100 mil', 'R$ 100-200 mil', 'R$ 200-500 mil', 'Acima de R$ 500 mil'],
          obrigatoria: true
        },
        {
          id: 22,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui o projeto arquitetônico?',
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
          pergunta: 'Este orçamento inclui mobiliário e equipamentos?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 25,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui estoque inicial?',
          opcoes: ['Sim', 'Não', 'Não se aplica'],
          obrigatoria: true
        },
        {
          id: 26,
          tipo: 'radio',
          pergunta: 'Como será o financiamento da obra?',
          opcoes: ['Recursos próprios', 'Financiamento bancário', 'Parcerias', 'Misto'],
          obrigatoria: true
        },
        {
          id: 27,
          tipo: 'radio',
          pergunta: 'Há prazo limite para inauguração?',
          opcoes: ['Sim, inflexível', 'Sim, flexível', 'Não há prazo definido'],
          obrigatoria: true
        },
        {
          id: 28,
          tipo: 'radio',
          pergunta: 'Há recursos para imprevistos (reserva de 15%)?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 29,
          tipo: 'number',
          pergunta: 'Qual é o valor do aluguel mensal (se aplicável)?',
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
          placeholder: 'Valor mensal ou tempo'
        },
        {
          id: 32,
          tipo: 'radio',
          pergunta: 'Há capacidade de pagamento durante o período de obra?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 33,
          tipo: 'radio',
          pergunta: 'Existe análise de viabilidade econômica do negócio?',
          opcoes: ['Sim, completa', 'Sim, básica', 'Não'],
          obrigatoria: true
        },
        {
          id: 34,
          tipo: 'text',
          pergunta: 'Qual é o capital de giro disponível para operação?',
          obrigatoria: false,
          placeholder: 'Valor estimado'
        }
      ]
    },
    {
      id: 'localizacao-imovel',
      nome: '🏢 Localização e Imóvel',
      descricao: 'Características físicas e localização do ponto comercial',
      icon: '🏢',
      obrigatoria: true,
      perguntas: [
        {
          id: 35,
          tipo: 'text',
          pergunta: 'Qual é o endereço do imóvel comercial?',
          obrigatoria: true,
          placeholder: 'Endereço completo'
        },
        {
          id: 36,
          tipo: 'number',
          pergunta: 'Qual é a área total disponível (m²)?',
          obrigatoria: true,
          min: 10,
          max: 2000
        },
        {
          id: 37,
          tipo: 'radio',
          pergunta: 'O imóvel é próprio, alugado ou será adquirido?',
          opcoes: ['Próprio', 'Alugado', 'Será adquirido'],
          obrigatoria: true
        },
        {
          id: 38,
          tipo: 'radio',
          pergunta: 'Qual é o tipo de imóvel?',
          opcoes: ['Térreo', 'Sobreloja', 'Shopping', 'Galeria'],
          obrigatoria: true
        },
        {
          id: 39,
          tipo: 'radio',
          pergunta: 'Há estacionamento disponível?',
          opcoes: ['Sim, próprio', 'Sim, público', 'Não'],
          obrigatoria: true
        },
        {
          id: 40,
          tipo: 'radio',
          pergunta: 'Qual é a localização em relação à rua principal?',
          opcoes: ['Na rua principal', 'Rua paralela', 'Dentro de quadra'],
          obrigatoria: true
        },
        {
          id: 41,
          tipo: 'radio',
          pergunta: 'Há vitrine para a rua?',
          opcoes: ['Sim, grande', 'Sim, pequena', 'Não'],
          obrigatoria: true
        },
        {
          id: 42,
          tipo: 'radio',
          pergunta: 'Qual é o fluxo de pedestres na região?',
          opcoes: ['Muito alto', 'Alto', 'Médio', 'Baixo'],
          obrigatoria: true
        },
        {
          id: 43,
          tipo: 'radio',
          pergunta: 'Há concorrentes próximos?',
          opcoes: ['Sim, muitos', 'Sim, poucos', 'Não'],
          obrigatoria: true
        },
        {
          id: 44,
          tipo: 'checkbox',
          pergunta: 'Qual é a infraestrutura disponível?',
          opcoes: ['Água', 'Luz', 'Esgoto', 'Gás', 'Internet'],
          obrigatoria: true
        },
        {
          id: 45,
          tipo: 'text',
          pergunta: 'Há restrições do condomínio ou shopping?',
          obrigatoria: false,
          placeholder: 'Descreva restrições'
        },
        {
          id: 46,
          tipo: 'text',
          pergunta: 'Qual é o horário de funcionamento permitido?',
          obrigatoria: true,
          placeholder: 'Horários permitidos'
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
          opcoes: ['Alto', 'Médio', 'Baixo'],
          obrigatoria: true
        },
        {
          id: 50,
          tipo: 'radio',
          pergunta: 'Qual é a segurança da localização?',
          opcoes: ['Muito boa', 'Boa', 'Regular', 'Ruim'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'programa-comercial',
      nome: '🏪 Programa Comercial',
      descricao: 'Definição de ambientes e necessidades operacionais',
      icon: '🏪',
      obrigatoria: true,
      perguntas: [
        {
          id: 51,
          tipo: 'text',
          pergunta: 'Qual é o tipo de produtos vendidos?',
          obrigatoria: true,
          placeholder: 'Descrição dos produtos'
        },
        {
          id: 52,
          tipo: 'text',
          pergunta: 'Qual é o público-alvo principal?',
          obrigatoria: true,
          placeholder: 'Perfil do cliente'
        },
        {
          id: 53,
          tipo: 'radio',
          pergunta: 'É necessária área de atendimento ao cliente?',
          opcoes: ['Sim, prioritária', 'Sim, secundária', 'Não'],
          obrigatoria: true
        },
        {
          id: 54,
          tipo: 'radio',
          pergunta: 'É necessário balcão de vendas?',
          opcoes: ['Sim', 'Não', 'Talvez'],
          obrigatoria: true
        },
        {
          id: 55,
          tipo: 'radio',
          pergunta: 'É necessário caixa/checkout?',
          opcoes: ['Sim', 'Não', 'Múltiplos'],
          obrigatoria: true
        },
        {
          id: 56,
          tipo: 'radio',
          pergunta: 'É necessária área de estoque?',
          opcoes: ['Sim, grande', 'Sim, pequena', 'Não'],
          obrigatoria: true
        },
        {
          id: 57,
          tipo: 'radio',
          pergunta: 'É necessário provador?',
          opcoes: ['Sim, múltiplos', 'Sim, um', 'Não'],
          obrigatoria: true
        },
        {
          id: 58,
          tipo: 'radio',
          pergunta: 'É necessária vitrine interna?',
          opcoes: ['Sim, prioritária', 'Sim, secundária', 'Não'],
          obrigatoria: true
        },
        {
          id: 59,
          tipo: 'radio',
          pergunta: 'É necessário escritório/administração?',
          opcoes: ['Sim', 'Não', 'Compartilhado'],
          obrigatoria: true
        },
        {
          id: 60,
          tipo: 'radio',
          pergunta: 'É necessária copa/cozinha para funcionários?',
          opcoes: ['Sim', 'Não', 'Básica'],
          obrigatoria: true
        },
        {
          id: 61,
          tipo: 'radio',
          pergunta: 'É necessário banheiro para clientes?',
          opcoes: ['Sim, obrigatório', 'Não', 'Se possível'],
          obrigatoria: true
        },
        {
          id: 62,
          tipo: 'radio',
          pergunta: 'É necessário banheiro para funcionários?',
          opcoes: ['Sim', 'Não', 'Compartilhado'],
          obrigatoria: true
        },
        {
          id: 63,
          tipo: 'radio',
          pergunta: 'É necessária área de recebimento de mercadorias?',
          opcoes: ['Sim, específica', 'Sim, compartilhada', 'Não'],
          obrigatoria: true
        },
        {
          id: 64,
          tipo: 'radio',
          pergunta: 'É necessário depósito?',
          opcoes: ['Sim', 'Não', 'Integrado'],
          obrigatoria: true
        },
        {
          id: 65,
          tipo: 'radio',
          pergunta: 'Há necessidade de refrigeração especial?',
          opcoes: ['Sim, crítica', 'Sim, desejável', 'Não'],
          obrigatoria: true
        },
        {
          id: 66,
          tipo: 'radio',
          pergunta: 'É necessária área para demonstração de produtos?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        },
        {
          id: 67,
          tipo: 'text',
          pergunta: 'Qual é a sazonalidade dos produtos?',
          obrigatoria: false,
          placeholder: 'Variações sazonais'
        },
        {
          id: 68,
          tipo: 'radio',
          pergunta: 'É necessário espaço para produtos em promoção?',
          opcoes: ['Sim, fixo', 'Sim, flexível', 'Não'],
          obrigatoria: true
        },
        {
          id: 69,
          tipo: 'radio',
          pergunta: 'É necessário espaço para atendimento pós-venda?',
          opcoes: ['Sim', 'Não', 'Integrado'],
          obrigatoria: true
        },
        {
          id: 70,
          tipo: 'radio',
          pergunta: 'Há produtos que requerem segurança especial?',
          opcoes: ['Sim, muitos', 'Sim, poucos', 'Não'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'layout-circulacao',
      nome: '🚶 Layout e Circulação',
      descricao: 'Fluxos de pessoas e organização espacial',
      icon: '🚶',
      obrigatoria: true,
      perguntas: [
        {
          id: 71,
          tipo: 'number',
          pergunta: 'Qual é a capacidade máxima de clientes simultâneos?',
          obrigatoria: true,
          min: 5,
          max: 200
        },
        {
          id: 72,
          tipo: 'text',
          pergunta: 'Como deve ser o fluxo de clientes na loja?',
          obrigatoria: true,
          placeholder: 'Fluxo desejado'
        },
        {
          id: 73,
          tipo: 'radio',
          pergunta: 'É importante ter entrada e saída separadas?',
          opcoes: ['Sim, obrigatório', 'Sim, desejável', 'Não'],
          obrigatoria: true
        },
        {
          id: 74,
          tipo: 'text',
          pergunta: 'Como deve ser organizada a exposição dos produtos?',
          obrigatoria: true,
          placeholder: 'Estratégia de exposição'
        },
        {
          id: 75,
          tipo: 'radio',
          pergunta: 'É necessário espaço para carrinho de compras?',
          opcoes: ['Sim', 'Não', 'Opcional'],
          obrigatoria: true
        },
        {
          id: 76,
          tipo: 'radio',
          pergunta: 'É importante ter área de espera?',
          opcoes: ['Sim', 'Não', 'Pequena'],
          obrigatoria: true
        },
        {
          id: 77,
          tipo: 'text',
          pergunta: 'Como deve ser a circulação dos funcionários?',
          obrigatoria: true,
          placeholder: 'Fluxo da equipe'
        },
        {
          id: 78,
          tipo: 'radio',
          pergunta: 'É necessário acesso independente para fornecedores?',
          opcoes: ['Sim', 'Não', 'Desejável'],
          obrigatoria: true
        },
        {
          id: 79,
          tipo: 'text',
          pergunta: 'Há produtos que precisam de área específica?',
          obrigatoria: false,
          placeholder: 'Produtos especiais'
        },
        {
          id: 80,
          tipo: 'radio',
          pergunta: 'É importante ter flexibilidade no layout?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        },
        {
          id: 81,
          tipo: 'radio',
          pergunta: 'É necessário controle de fluxo em horários de pico?',
          opcoes: ['Sim', 'Não', 'Ocasionalmente'],
          obrigatoria: true
        },
        {
          id: 82,
          tipo: 'radio',
          pergunta: 'Há necessidade de área para degustação/teste?',
          opcoes: ['Sim', 'Não', 'Eventual'],
          obrigatoria: true
        },
        {
          id: 83,
          tipo: 'radio',
          pergunta: 'É importante ter visibilidade total da loja?',
          opcoes: ['Muito importante', 'Importante', 'Não importante'],
          obrigatoria: true
        },
        {
          id: 84,
          tipo: 'radio',
          pergunta: 'Existe necessidade de áreas temáticas?',
          opcoes: ['Sim', 'Não', 'Talvez'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'identidade-visual',
      nome: '🎨 Identidade Visual e Marketing',
      descricao: 'Conceito visual e estratégias de marketing',
      icon: '🎨',
      obrigatoria: true,
      perguntas: [
        {id: 85, tipo: 'radio', pergunta: 'A empresa já possui identidade visual definida?', opcoes: ['Sim, completa', 'Sim, parcial', 'Não'], obrigatoria: true},
        {id: 86, tipo: 'radio', pergunta: 'Há cores específicas da marca?', opcoes: ['Sim', 'Não', 'Em desenvolvimento'], obrigatoria: true},
        {id: 87, tipo: 'radio', pergunta: 'Há logotipo que deve ser aplicado?', opcoes: ['Sim', 'Não', 'Em desenvolvimento'], obrigatoria: true},
        {id: 88, tipo: 'text', pergunta: 'Qual é o conceito/estilo desejado para a loja?', obrigatoria: true, placeholder: 'Conceito visual'},
        {id: 89, tipo: 'radio', pergunta: 'É importante que a loja seja instagramável?', opcoes: ['Muito importante', 'Importante', 'Não importante'], obrigatoria: true},
        {id: 90, tipo: 'text', pergunta: 'Há referências visuais de outras lojas?', obrigatoria: false, placeholder: 'Descreva referências'},
        {id: 91, tipo: 'radio', pergunta: 'É necessária comunicação visual específica?', opcoes: ['Sim, muita', 'Sim, básica', 'Não'], obrigatoria: true},
        {id: 92, tipo: 'radio', pergunta: 'É importante ter área para fotos/selfies?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true},
        {id: 93, tipo: 'radio', pergunta: 'Há materiais de marketing que devem ser expostos?', opcoes: ['Sim', 'Não', 'Ocasionalmente'], obrigatoria: true},
        {id: 94, tipo: 'radio', pergunta: 'É necessário espaço para eventos/lançamentos?', opcoes: ['Sim', 'Não', 'Flexível'], obrigatoria: true},
        {id: 95, tipo: 'radio', pergunta: 'Qual é a importância da fachada para atração de clientes?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 96, tipo: 'radio', pergunta: 'É necessário sistema de som para comunicação?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 97, tipo: 'radio', pergunta: 'Há necessidade de telas/monitores para propaganda?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true},
        {id: 98, tipo: 'radio', pergunta: 'É importante ter iluminação cênica para produtos?', opcoes: ['Muito importante', 'Importante', 'Não importante'], obrigatoria: true}
      ]
    },
    {
      id: 'sistemas-instalacoes',
      nome: '🔌 Sistemas e Instalações',
      descricao: 'Infraestrutura técnica e sistemas',
      icon: '🔌',
      obrigatoria: true,
      perguntas: [
        {id: 99, tipo: 'radio', pergunta: 'É necessário sistema de ar condicionado?', opcoes: ['Sim, central', 'Sim, split', 'Não'], obrigatoria: true},
        {id: 100, tipo: 'radio', pergunta: 'É necessário sistema de som ambiente?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 101, tipo: 'radio', pergunta: 'É necessário sistema de segurança/câmeras?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 102, tipo: 'radio', pergunta: 'É necessário sistema de alarme?', opcoes: ['Sim', 'Não', 'Integrado'], obrigatoria: true},
        {id: 103, tipo: 'radio', pergunta: 'É necessária instalação de internet/Wi-Fi?', opcoes: ['Sim', 'Não', 'Para clientes'], obrigatoria: true},
        {id: 104, tipo: 'radio', pergunta: 'É necessário sistema de iluminação especial?', opcoes: ['Sim', 'Não', 'LED básico'], obrigatoria: true},
        {id: 105, tipo: 'radio', pergunta: 'É necessária instalação elétrica reforçada?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 106, tipo: 'radio', pergunta: 'É necessário sistema de telefonia?', opcoes: ['Sim', 'Não', 'Móvel'], obrigatoria: true},
        {id: 107, tipo: 'radio', pergunta: 'É necessária instalação de gás?', opcoes: ['Sim', 'Não', 'Não se aplica'], obrigatoria: true},
        {id: 108, tipo: 'radio', pergunta: 'É necessário sistema de exaustão?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 109, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento de temperatura?', opcoes: ['Sim', 'Não', 'Para produtos'], obrigatoria: true},
        {id: 110, tipo: 'radio', pergunta: 'É necessário sistema de backup de energia?', opcoes: ['Sim', 'Não', 'Nobreak'], obrigatoria: true},
        {id: 111, tipo: 'radio', pergunta: 'É necessário sistema de automação?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 112, tipo: 'radio', pergunta: 'É necessário sistema de comunicação interna?', opcoes: ['Sim', 'Não', 'Interfone'], obrigatoria: true}
      ]
    },
    {
      id: 'equipamentos-mobiliario',
      nome: '🛠️ Equipamentos e Mobiliário',
      descricao: 'Equipamentos operacionais e mobiliário',
      icon: '🛠️',
      obrigatoria: true,
      perguntas: [
        {id: 113, tipo: 'text', pergunta: 'Quais equipamentos serão necessários?', obrigatoria: true, placeholder: 'Lista de equipamentos'},
        {id: 114, tipo: 'radio', pergunta: 'É necessário balcão refrigerado?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true},
        {id: 115, tipo: 'radio', pergunta: 'É necessário freezer/geladeira?', opcoes: ['Sim', 'Não', 'Múltiplos'], obrigatoria: true},
        {id: 116, tipo: 'radio', pergunta: 'São necessárias prateleiras específicas?', opcoes: ['Sim', 'Não', 'Sob medida'], obrigatoria: true},
        {id: 117, tipo: 'radio', pergunta: 'É necessário caixa registradora/PDV?', opcoes: ['Sim', 'Não', 'Múltiplos'], obrigatoria: true},
        {id: 118, tipo: 'radio', pergunta: 'É necessário computador/sistema?', opcoes: ['Sim', 'Não', 'Tablet'], obrigatoria: true},
        {id: 119, tipo: 'radio', pergunta: 'É necessária máquina de cartão?', opcoes: ['Sim', 'Não', 'Múltiplas'], obrigatoria: true},
        {id: 120, tipo: 'radio', pergunta: 'É necessário cofre?', opcoes: ['Sim', 'Não', 'Gaveta'], obrigatoria: true},
        {id: 121, tipo: 'radio', pergunta: 'Há equipamentos pesados que precisam de base especial?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 122, tipo: 'radio', pergunta: 'É necessário mobiliário sob medida?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 123, tipo: 'radio', pergunta: 'É necessário sistema de etiquetagem eletrônica?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 124, tipo: 'radio', pergunta: 'É necessário equipamento de código de barras?', opcoes: ['Sim', 'Não', 'Manual'], obrigatoria: true},
        {id: 125, tipo: 'radio', pergunta: 'É necessário sistema de inventário automatizado?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 126, tipo: 'radio', pergunta: 'É necessário equipamento de limpeza específico?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true}
      ]
    },
    {
      id: 'normas-aprovacoes',
      nome: '📋 Normas e Aprovações',
      descricao: 'Licenças e conformidades legais',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        {id: 127, tipo: 'radio', pergunta: 'É necessário alvará de funcionamento?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 128, tipo: 'radio', pergunta: 'É necessária aprovação no corpo de bombeiros?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 129, tipo: 'text', pergunta: 'Há normas específicas do ramo de atividade?', obrigatoria: false, placeholder: 'Descreva normas'},
        {id: 130, tipo: 'radio', pergunta: 'É necessária licença sanitária?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 131, tipo: 'radio', pergunta: 'É necessário projeto de prevenção contra incêndio?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 132, tipo: 'radio', pergunta: 'Há normas de acessibilidade a cumprir?', opcoes: ['Sim', 'Não', 'Parciais'], obrigatoria: true},
        {id: 133, tipo: 'radio', pergunta: 'É necessária aprovação na prefeitura?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 134, tipo: 'text', pergunta: 'Há outras licenças específicas necessárias?', obrigatoria: false, placeholder: 'Outras licenças'},
        {id: 135, tipo: 'radio', pergunta: 'É necessário estudo de impacto de vizinhança?', opcoes: ['Sim', 'Não', 'Não sei'], obrigatoria: true},
        {id: 136, tipo: 'text', pergunta: 'Há normas específicas do shopping/condomínio?', obrigatoria: false, placeholder: 'Normas do local'},
        {id: 137, tipo: 'radio', pergunta: 'É necessário laudo de vistoria técnica?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 138, tipo: 'text', pergunta: 'Há exigências específicas da vigilância sanitária?', obrigatoria: false, placeholder: 'Exigências sanitárias'}
      ]
    },
    {
      id: 'cronograma-operacao',
      nome: '📅 Cronograma e Operação',
      descricao: 'Planejamento temporal e operacional',
      icon: '📅',
      obrigatoria: true,
      perguntas: [
        {id: 139, tipo: 'date', pergunta: 'Qual é o prazo desejado para inauguração?', obrigatoria: false},
        {id: 140, tipo: 'radio', pergunta: 'Há sazonalidade que deve ser considerada?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 141, tipo: 'radio', pergunta: 'É importante inaugurar em data específica?', opcoes: ['Sim, crítico', 'Sim, desejável', 'Não'], obrigatoria: true},
        {id: 142, tipo: 'radio', pergunta: 'Há fornecedores que dependem do cronograma?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 143, tipo: 'radio', pergunta: 'É necessário treinamento da equipe no novo espaço?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 144, tipo: 'radio', pergunta: 'Há mudança de endereço de loja existente?', opcoes: ['Sim', 'Não', 'Expansão'], obrigatoria: true},
        {id: 145, tipo: 'radio', pergunta: 'É necessário comunicar clientes sobre a mudança?', opcoes: ['Sim', 'Não', 'Não se aplica'], obrigatoria: true},
        {id: 146, tipo: 'radio', pergunta: 'Há contratos que dependem da inauguração?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 147, tipo: 'radio', pergunta: 'É necessário período de testes dos sistemas?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 148, tipo: 'radio', pergunta: 'Há campanhas de marketing vinculadas à inauguração?', opcoes: ['Sim', 'Não', 'Planejadas'], obrigatoria: true},
        {id: 149, tipo: 'radio', pergunta: 'É necessário estoque mínimo para abertura?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 150, tipo: 'radio', pergunta: 'Há necessidade de licenças temporárias?', opcoes: ['Sim', 'Não', 'Não sei'], obrigatoria: true}
      ]
    },
    {
      id: 'sustentabilidade',
      nome: '🌱 Sustentabilidade e Eficiência',
      descricao: 'Soluções sustentáveis e eficiência energética',
      icon: '🌱',
      obrigatoria: false,
      perguntas: [
        {id: 151, tipo: 'radio', pergunta: 'Há interesse em soluções sustentáveis?', opcoes: ['Muito interesse', 'Interesse médio', 'Pouco interesse', 'Nenhum'], obrigatoria: true},
        {id: 152, tipo: 'radio', pergunta: 'É importante ter eficiência energética?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 153, tipo: 'radio', pergunta: 'É importante usar materiais ecológicos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 154, tipo: 'radio', pergunta: 'Há interesse em certificação ambiental?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 155, tipo: 'radio', pergunta: 'É importante reduzir custos operacionais?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 156, tipo: 'radio', pergunta: 'Há interesse em energia solar?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true},
        {id: 157, tipo: 'radio', pergunta: 'É importante ter gestão de resíduos?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true},
        {id: 158, tipo: 'radio', pergunta: 'Há interesse em materiais reciclados?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true},
        {id: 159, tipo: 'radio', pergunta: 'É importante ter ventilação natural?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 160, tipo: 'radio', pergunta: 'Existe preocupação com pegada de carbono?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true}
      ]
    },
    {
      id: 'seguranca-acessibilidade',
      nome: '🔒 Segurança e Acessibilidade',
      descricao: 'Sistemas de segurança e acessibilidade universal',
      icon: '🔒',
      obrigatoria: true,
      perguntas: [
        {id: 161, tipo: 'radio', pergunta: 'É necessário sistema anti-furto?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 162, tipo: 'radio', pergunta: 'É necessário controle de acesso?', opcoes: ['Sim', 'Não', 'Para funcionários'], obrigatoria: true},
        {id: 163, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento?', opcoes: ['Sim', 'Não', '24h'], obrigatoria: true},
        {id: 164, tipo: 'radio', pergunta: 'Há necessidade de segurança especial para produtos?', opcoes: ['Sim', 'Não', 'Alguns produtos'], obrigatoria: true},
        {id: 165, tipo: 'radio', pergunta: 'É necessário acesso para pessoas com deficiência?', opcoes: ['Sim, obrigatório', 'Sim, desejável', 'Não'], obrigatoria: true},
        {id: 166, tipo: 'radio', pergunta: 'É necessário banheiro acessível?', opcoes: ['Sim', 'Não', 'Se houver banheiro'], obrigatoria: true},
        {id: 167, tipo: 'radio', pergunta: 'Há necessidade de sinalização especial?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true},
        {id: 168, tipo: 'radio', pergunta: 'É necessário sistema de emergência?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 169, tipo: 'radio', pergunta: 'É necessário sistema de detecção de incêndio?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 170, tipo: 'radio', pergunta: 'É necessário controle de acesso de funcionários?', opcoes: ['Sim', 'Não', 'Horário'], obrigatoria: true},
        {id: 171, tipo: 'radio', pergunta: 'Há necessidade de área de isolamento para emergências?', opcoes: ['Sim', 'Não', 'Não sei'], obrigatoria: true},
        {id: 172, tipo: 'radio', pergunta: 'É necessário sistema de comunicação de emergência?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true}
      ]
    },
    {
      id: 'logistica-operacao',
      nome: '📦 Logística e Operação Comercial',
      descricao: 'Fluxo de mercadorias e operação logística',
      icon: '📦',
      obrigatoria: true,
      perguntas: [
        {id: 173, tipo: 'number', pergunta: 'Qual é o volume médio de mercadorias recebidas por semana?', obrigatoria: true, min: 1, max: 100, placeholder: 'Entregas por semana'},
        {id: 174, tipo: 'text', pergunta: 'Qual é o horário preferencial para recebimento de mercadorias?', obrigatoria: true, placeholder: 'Horário preferencial'},
        {id: 175, tipo: 'radio', pergunta: 'Qual é o tipo de veículo usado para entrega?', opcoes: ['Moto', 'Van', 'Caminhão pequeno', 'Caminhão grande', 'Misto'], obrigatoria: true},
        {id: 176, tipo: 'radio', pergunta: 'É necessário espaço para conferência de mercadorias?', opcoes: ['Sim', 'Não', 'Integrado'], obrigatoria: true},
        {id: 177, tipo: 'radio', pergunta: 'Como é feito o controle de estoque?', opcoes: ['Manual', 'Sistema', 'Misto'], obrigatoria: true},
        {id: 178, tipo: 'radio', pergunta: 'É necessário código de barras/etiquetagem?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 179, tipo: 'radio', pergunta: 'Há produtos que precisam de armazenamento especial?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 180, tipo: 'radio', pergunta: 'É necessário espaço para embalagem de produtos?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 181, tipo: 'radio', pergunta: 'É feita entrega para clientes?', opcoes: ['Sim', 'Não', 'Eventual'], obrigatoria: true},
        {id: 182, tipo: 'radio', pergunta: 'É necessário espaço para devolução/troca de produtos?', opcoes: ['Sim', 'Não', 'Integrado'], obrigatoria: true},
        {id: 183, tipo: 'radio', pergunta: 'Há necessidade de área para produtos em promoção?', opcoes: ['Sim', 'Não', 'Flexível'], obrigatoria: true},
        {id: 184, tipo: 'radio', pergunta: 'É necessário espaço para produtos sazonais?', opcoes: ['Sim', 'Não', 'Compartilhado'], obrigatoria: true},
        {id: 185, tipo: 'text', pergunta: 'Como é feita a reposição de produtos nas prateleiras?', obrigatoria: true, placeholder: 'Processo de reposição'},
        {id: 186, tipo: 'radio', pergunta: 'É necessário carrinho/equipamento para movimentação interna?', opcoes: ['Sim', 'Não', 'Manual'], obrigatoria: true},
        {id: 187, tipo: 'radio', pergunta: 'Há produtos frágeis que precisam de cuidado especial?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 188, tipo: 'radio', pergunta: 'É necessário controle de validade de produtos?', opcoes: ['Sim', 'Não', 'Alguns produtos'], obrigatoria: true},
        {id: 189, tipo: 'radio', pergunta: 'Há necessidade de área para produtos danificados?', opcoes: ['Sim', 'Não', 'Temporária'], obrigatoria: true},
        {id: 190, tipo: 'radio', pergunta: 'É necessário sistema de rastreabilidade de produtos?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true}
      ]
    },
    {
      id: 'gestao-processo',
      nome: '👥 Gestão do Processo de Projeto',
      descricao: 'Comunicação e acompanhamento do projeto',
      icon: '👥',
      obrigatoria: true,
      perguntas: [
        {id: 191, tipo: 'radio', pergunta: 'Qual é a frequência desejada de reuniões de acompanhamento?', opcoes: ['Semanal', 'Quinzenal', 'Mensal', 'Por demanda'], obrigatoria: true},
        {id: 192, tipo: 'radio', pergunta: 'Há preferência por comunicação digital ou presencial?', opcoes: ['Digital', 'Presencial', 'Misto'], obrigatoria: true},
        {id: 193, tipo: 'text', pergunta: 'Quem será o interlocutor principal com a equipe de projeto?', obrigatoria: true, placeholder: 'Nome e cargo'},
        {id: 194, tipo: 'radio', pergunta: 'Qual é a disponibilidade para tomada de decisões urgentes?', opcoes: ['Imediata', 'Até 24h', 'Até 48h', 'Semanal'], obrigatoria: true},
        {id: 195, tipo: 'radio', pergunta: 'Há necessidade de aprovação de sócios para decisões?', opcoes: ['Sim, sempre', 'Sim, grandes decisões', 'Não'], obrigatoria: true},
        {id: 196, tipo: 'text', pergunta: 'Qual é o processo interno de validação empresarial?', obrigatoria: false, placeholder: 'Processo de aprovação'},
        {id: 197, tipo: 'radio', pergunta: 'Há preferência por relatórios detalhados ou resumidos?', opcoes: ['Detalhados', 'Resumidos', 'Misto'], obrigatoria: true},
        {id: 198, tipo: 'radio', pergunta: 'Existe necessidade de documentação específica do processo?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true}
      ]
    },
    {
      id: 'analise-riscos',
      nome: '⚠️ Análise de Riscos e Contingências',
      descricao: 'Identificação e gestão de riscos do projeto',
      icon: '⚠️',
      obrigatoria: true,
      perguntas: [
        {id: 199, tipo: 'radio', pergunta: 'Qual é a tolerância a atrasos no cronograma?', opcoes: ['Nenhuma', 'Baixa (até 15 dias)', 'Média (até 30 dias)', 'Alta (mais de 30 dias)'], obrigatoria: true},
        {id: 200, tipo: 'radio', pergunta: 'Existe capacidade financeira para imprevistos de 15%?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 201, tipo: 'radio', pergunta: 'Há flexibilidade para mudanças de escopo durante o projeto?', opcoes: ['Sim', 'Não', 'Limitada'], obrigatoria: true},
        {id: 202, tipo: 'text', pergunta: 'Qual é a estratégia para lidar com problemas de aprovação?', obrigatoria: false, placeholder: 'Estratégia de contingência'},
        {id: 203, tipo: 'text', pergunta: 'Existe plano alternativo para questões de licenciamento?', obrigatoria: false, placeholder: 'Plano B'},
        {id: 204, tipo: 'radio', pergunta: 'Há tolerância a variações de custo durante a obra?', opcoes: ['Sim, até 10%', 'Sim, até 20%', 'Não'], obrigatoria: true},
        {id: 205, tipo: 'text', pergunta: 'Qual é a estratégia para problemas de fornecimento?', obrigatoria: false, placeholder: 'Estratégia alternativa'},
        {id: 206, tipo: 'radio', pergunta: 'Existe seguro específico para a obra e equipamentos?', opcoes: ['Sim', 'Não', 'Será contratado'], obrigatoria: true}
      ]
    },
    {
      id: 'informacoes-complementares',
      nome: '📝 Informações Complementares',
      descricao: 'Dados adicionais e observações especiais',
      icon: '📝',
      obrigatoria: false,
      perguntas: [
        {id: 207, tipo: 'text', pergunta: 'Há alguma restrição específica não mencionada?', obrigatoria: false, placeholder: 'Restrições especiais'},
        {id: 208, tipo: 'text', pergunta: 'Há algum ambiente que deve ter prioridade no projeto?', obrigatoria: false, placeholder: 'Ambiente prioritário'},
        {id: 209, tipo: 'text', pergunta: 'Há algum ambiente que pode ser eliminado se necessário?', obrigatoria: false, placeholder: 'Ambientes opcionais'},
        {id: 210, tipo: 'text', pergunta: 'Há preferência por algum profissional específico para a obra?', obrigatoria: false, placeholder: 'Preferências profissionais'},
        {id: 211, tipo: 'radio', pergunta: 'Já possui algum projeto ou estudo preliminar?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 212, tipo: 'text', pergunta: 'Há alguma experiência anterior com reformas comerciais?', obrigatoria: false, placeholder: 'Experiências anteriores'},
        {id: 213, tipo: 'text', pergunta: 'Há alguma preocupação específica com a obra?', obrigatoria: false, placeholder: 'Preocupações especiais'},
        {id: 214, tipo: 'date', pergunta: 'Há algum prazo específico para inauguração?', obrigatoria: false},
        {id: 215, tipo: 'text', pergunta: 'Há alguma tradição empresarial que deve ser considerada?', obrigatoria: false, placeholder: 'Tradições da empresa'},
        {id: 216, tipo: 'text', pergunta: 'Há necessidades específicas relacionadas ao tipo de produto?', obrigatoria: false, placeholder: 'Necessidades dos produtos'},
        {id: 217, tipo: 'text', pergunta: 'Há clientes especiais que requerem atendimento diferenciado?', obrigatoria: false, placeholder: 'Clientes especiais'},
        {id: 218, tipo: 'text', pergunta: 'Há alguma informação adicional importante?', obrigatoria: false, placeholder: 'Informações adicionais'}
      ]
    }
  ]
}; 