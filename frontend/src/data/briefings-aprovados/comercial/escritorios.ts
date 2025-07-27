// BRIEFING APROVADO: COMERCIAL - ESCRITÓRIOS (VERSÃO COMPLETA)
// Convertido do formato markdown para TypeScript - 238 perguntas

import { BriefingCompleto } from '../../../types/briefing';

export const BRIEFING_COMERCIAL_ESCRITORIOS: BriefingCompleto = {
  id: 'comercial-escritorios-completo',
  tipologia: 'comercial',
  subtipo: 'escritorios',
  padrao: 'profissional',
  nome: 'Plano de Necessidades - Comercial / Escritórios (Completo)',
  descricao: 'Briefing completo para projetos de escritórios corporativos com foco em produtividade e bem-estar',
  totalPerguntas: 238,
  tempoEstimado: '60-90 min',
  versao: '2.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['comercial', 'escritorio', 'corporativo', 'produtividade', 'ergonomia'],
    categoria: 'comercial',
    complexidade: 'muito_alta',
    publico: ['arquitetos', 'empresarios', 'gestores', 'designers']
  },
  secoes: [
    {
      id: 'qualificacao-inicial',
      nome: '🎯 Qualificação Inicial do Cliente',
      descricao: 'Avaliação da experiência e expectativas do cliente',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        {
          id: 1,
          tipo: 'radio',
          pergunta: 'Qual é a sua experiência anterior com projetos de escritórios?',
          opcoes: ['Nenhuma', 'Básica (1-2 projetos)', 'Intermediária (3-5 projetos)', 'Avançada (mais de 5 projetos)'],
          obrigatoria: true
        },
        {
          id: 2,
          tipo: 'radio',
          pergunta: 'Qual é o seu conhecimento sobre ergonomia e produtividade?',
          opcoes: ['Nenhum', 'Básico', 'Intermediário', 'Avançado'],
          obrigatoria: true
        },
        {
          id: 3,
          tipo: 'radio',
          pergunta: 'Já trabalhou anteriormente com arquitetos para espaços corporativos?',
          opcoes: ['Nunca', 'Uma vez', 'Algumas vezes', 'Frequentemente'],
          obrigatoria: true
        },
        {
          id: 4,
          tipo: 'radio',
          pergunta: 'Qual é a sua disponibilidade para reuniões durante horário comercial?',
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
          pergunta: 'Há diretores ou sócios com poder de veto nas decisões?',
          opcoes: ['Não', 'Sim, um diretor', 'Sim, vários diretores', 'Sim, conselho'],
          obrigatoria: true
        },
        {
          id: 7,
          tipo: 'radio',
          pergunta: 'Qual é a sua expectativa sobre o impacto na produtividade?',
          opcoes: ['Manter atual', 'Pequeno aumento', 'Aumento significativo', 'Transformação total'],
          obrigatoria: true
        },
        {
          id: 8,
          tipo: 'radio',
          pergunta: 'Há compreensão sobre normas trabalhistas e ergonômicas?',
          opcoes: ['Nenhuma', 'Básica', 'Boa', 'Total'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'dados-basicos',
      nome: '📋 Dados Básicos do Projeto',
      descricao: 'Informações fundamentais da empresa',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        {
          id: 9,
          tipo: 'text',
          pergunta: 'Qual é o nome da empresa?',
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
          pergunta: 'Qual é o endereço atual da empresa?',
          obrigatoria: true,
          placeholder: 'Endereço completo atual'
        },
        {
          id: 15,
          tipo: 'text',
          pergunta: 'Qual é o ramo de atividade da empresa?',
          obrigatoria: true,
          placeholder: 'Descrição da atividade principal'
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
          pergunta: 'Quantos funcionários trabalharão no escritório?',
          obrigatoria: true,
          min: 1,
          max: 500
        },
        {
          id: 18,
          tipo: 'text',
          pergunta: 'Qual é o horário de funcionamento?',
          obrigatoria: true,
          placeholder: 'Ex: 08h às 18h de segunda a sexta'
        },
        {
          id: 19,
          tipo: 'text',
          pergunta: 'Qual é o perfil dos funcionários (idade, formação)?',
          obrigatoria: true,
          placeholder: 'Descrição do perfil da equipe'
        },
        {
          id: 20,
          tipo: 'radio',
          pergunta: 'Há previsão de crescimento da equipe?',
          opcoes: ['Não', 'Até 25%', 'Até 50%', 'Mais de 50%'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'viabilidade-financeira',
      nome: '💰 Viabilidade Financeira',
      descricao: 'Análise da capacidade financeira e investimento',
      icon: '💰',
      obrigatoria: true,
      perguntas: [
        {
          id: 21,
          tipo: 'radio',
          pergunta: 'Qual é o orçamento total disponível?',
          opcoes: ['Até R$ 100 mil', 'R$ 100-300 mil', 'R$ 300-500 mil', 'R$ 500 mil - 1 milhão', 'Acima de R$ 1 milhão'],
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
          pergunta: 'Este orçamento inclui a reforma?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 24,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui mobiliário?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 25,
          tipo: 'radio',
          pergunta: 'Este orçamento inclui equipamentos?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 26,
          tipo: 'radio',
          pergunta: 'Como será o financiamento?',
          opcoes: ['Recursos próprios', 'Financiamento bancário', 'Leasing', 'Misto'],
          obrigatoria: true
        },
        {
          id: 27,
          tipo: 'radio',
          pergunta: 'Há prazo limite para mudança?',
          opcoes: ['Sim, inflexível', 'Sim, flexível', 'Não há prazo'],
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
          pergunta: 'Qual é o valor do aluguel mensal?',
          obrigatoria: false,
          min: 0,
          max: 100000,
          placeholder: 'Valor em reais'
        },
        {
          id: 30,
          tipo: 'radio',
          pergunta: 'É importante controlar custos operacionais?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        },
        {
          id: 31,
          tipo: 'text',
          pergunta: 'Qual é o orçamento para tecnologia e sistemas?',
          obrigatoria: false,
          placeholder: 'Valor ou percentual'
        },
        {
          id: 32,
          tipo: 'text',
          pergunta: 'Há verba específica para ergonomia e bem-estar?',
          obrigatoria: false,
          placeholder: 'Valor ou percentual'
        },
        {
          id: 33,
          tipo: 'radio',
          pergunta: 'Existe análise de retorno sobre investimento?',
          opcoes: ['Sim, completa', 'Sim, básica', 'Não'],
          obrigatoria: true
        },
        {
          id: 34,
          tipo: 'text',
          pergunta: 'Qual é o impacto financeiro da mudança na operação?',
          obrigatoria: false,
          placeholder: 'Descrição do impacto'
        }
      ]
    },
    {
      id: 'localizacao-imovel',
      nome: '🏢 Localização e Imóvel',
      descricao: 'Características do imóvel e localização',
      icon: '🏢',
      obrigatoria: true,
      perguntas: [
        {
          id: 35,
          tipo: 'text',
          pergunta: 'Qual é o endereço do imóvel?',
          obrigatoria: true,
          placeholder: 'Endereço completo do novo escritório'
        },
        {
          id: 36,
          tipo: 'number',
          pergunta: 'Qual é a área total disponível (m²)?',
          obrigatoria: true,
          min: 50,
          max: 5000
        },
        {
          id: 37,
          tipo: 'radio',
          pergunta: 'O imóvel é próprio, alugado ou será adquirido?',
          opcoes: ['Próprio', 'Alugado', 'Será adquirido', 'Comodato'],
          obrigatoria: true
        },
        {
          id: 38,
          tipo: 'text',
          pergunta: 'Em que andar está localizado?',
          obrigatoria: true,
          placeholder: 'Ex: 5º andar, térreo, cobertura'
        },
        {
          id: 39,
          tipo: 'radio',
          pergunta: 'Há elevador no prédio?',
          opcoes: ['Sim', 'Não', 'Múltiplos elevadores'],
          obrigatoria: true
        },
        {
          id: 40,
          tipo: 'radio',
          pergunta: 'Há estacionamento disponível?',
          opcoes: ['Sim, privativo', 'Sim, rotativo', 'Não', 'Público próximo'],
          obrigatoria: true
        },
        {
          id: 41,
          tipo: 'checkbox',
          pergunta: 'Qual é a infraestrutura disponível?',
          opcoes: ['Água', 'Luz', 'Esgoto', 'Gás', 'Internet', 'Telefone', 'Ar condicionado central'],
          obrigatoria: true
        },
        {
          id: 42,
          tipo: 'text',
          pergunta: 'Há restrições do condomínio?',
          obrigatoria: false,
          placeholder: 'Descreva as restrições'
        },
        {
          id: 43,
          tipo: 'text',
          pergunta: 'Qual é o horário de funcionamento permitido?',
          obrigatoria: true,
          placeholder: 'Horários permitidos no prédio'
        },
        {
          id: 44,
          tipo: 'radio',
          pergunta: 'Há segurança no prédio?',
          opcoes: ['Sim, 24h', 'Sim, horário comercial', 'Não', 'Portaria'],
          obrigatoria: true
        },
        {
          id: 45,
          tipo: 'radio',
          pergunta: 'Qual é a qualidade da internet/telefonia na região?',
          opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim'],
          obrigatoria: true
        },
        {
          id: 46,
          tipo: 'radio',
          pergunta: 'Há transporte público próximo?',
          opcoes: ['Excelente', 'Bom', 'Regular', 'Ruim'],
          obrigatoria: true
        },
        {
          id: 47,
          tipo: 'radio',
          pergunta: 'Qual é a qualidade da vizinhança empresarial?',
          opcoes: ['Excelente', 'Boa', 'Regular', 'Ruim'],
          obrigatoria: true
        },
        {
          id: 48,
          tipo: 'radio',
          pergunta: 'Há facilidades próximas (bancos, restaurantes)?',
          opcoes: ['Muitas', 'Algumas', 'Poucas', 'Nenhuma'],
          obrigatoria: true
        },
        {
          id: 49,
          tipo: 'radio',
          pergunta: 'Existe potencial de valorização da região?',
          opcoes: ['Alto', 'Médio', 'Baixo', 'Não sei'],
          obrigatoria: true
        },
        {
          id: 50,
          tipo: 'radio',
          pergunta: 'Qual é a imagem que o endereço transmite?',
          opcoes: ['Muito prestigiosa', 'Prestigiosa', 'Neutra', 'Não importa'],
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
          id: 51,
          tipo: 'number',
          pergunta: 'Quantas estações de trabalho são necessárias?',
          obrigatoria: true,
          min: 1,
          max: 200
        },
        {
          id: 52,
          tipo: 'radio',
          pergunta: 'É necessária recepção?',
          opcoes: ['Sim, ampla', 'Sim, básica', 'Não'],
          obrigatoria: true
        },
        {
          id: 53,
          tipo: 'radio',
          pergunta: 'É necessária sala de reuniões?',
          opcoes: ['Sim, múltiplas', 'Sim, uma', 'Não'],
          obrigatoria: true
        },
        {
          id: 54,
          tipo: 'radio',
          pergunta: 'É necessária sala da diretoria?',
          opcoes: ['Sim, individual', 'Sim, compartilhada', 'Não'],
          obrigatoria: true
        },
        {
          id: 55,
          tipo: 'radio',
          pergunta: 'É necessário arquivo/depósito?',
          opcoes: ['Sim, grande', 'Sim, pequeno', 'Não'],
          obrigatoria: true
        },
        {
          id: 56,
          tipo: 'radio',
          pergunta: 'É necessária copa/cozinha?',
          opcoes: ['Sim, completa', 'Sim, básica', 'Não'],
          obrigatoria: true
        },
        {
          id: 57,
          tipo: 'radio',
          pergunta: 'É necessário banheiro?',
          opcoes: ['Sim, múltiplos', 'Sim, um', 'Usar do prédio'],
          obrigatoria: true
        },
        {
          id: 58,
          tipo: 'radio',
          pergunta: 'É necessária sala de espera?',
          opcoes: ['Sim', 'Não', 'Integrada à recepção'],
          obrigatoria: true
        },
        {
          id: 59,
          tipo: 'radio',
          pergunta: 'É necessário almoxarifado?',
          opcoes: ['Sim', 'Não', 'Integrado ao arquivo'],
          obrigatoria: true
        },
        {
          id: 60,
          tipo: 'radio',
          pergunta: 'É necessária sala de servidor/TI?',
          opcoes: ['Sim, dedicada', 'Sim, básica', 'Não'],
          obrigatoria: true
        },
        {
          id: 61,
          tipo: 'radio',
          pergunta: 'É necessário espaço para impressoras?',
          opcoes: ['Sim, centralizado', 'Sim, distribuído', 'Não'],
          obrigatoria: true
        },
        {
          id: 62,
          tipo: 'radio',
          pergunta: 'É necessária área de descanso?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        },
        {
          id: 63,
          tipo: 'radio',
          pergunta: 'É necessário vestiário?',
          opcoes: ['Sim', 'Não', 'Básico'],
          obrigatoria: true
        },
        {
          id: 64,
          tipo: 'text',
          pergunta: 'Há necessidade de salas específicas?',
          obrigatoria: false,
          placeholder: 'Descreva salas especiais'
        },
        {
          id: 65,
          tipo: 'radio',
          pergunta: 'É necessário espaço para treinamentos?',
          opcoes: ['Sim, dedicado', 'Sim, flexível', 'Não'],
          obrigatoria: true
        },
        {
          id: 66,
          tipo: 'radio',
          pergunta: 'É necessária sala de videoconferência?',
          opcoes: ['Sim, dedicada', 'Sim, flexível', 'Não'],
          obrigatoria: true
        },
        {
          id: 67,
          tipo: 'radio',
          pergunta: 'É necessário espaço para arquivo morto?',
          opcoes: ['Sim', 'Não', 'Terceirizado'],
          obrigatoria: true
        },
        {
          id: 68,
          tipo: 'radio',
          pergunta: 'É necessária área para coffee break?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        },
        {
          id: 69,
          tipo: 'radio',
          pergunta: 'É necessário espaço para materiais de escritório?',
          opcoes: ['Sim, amplo', 'Sim, básico', 'Não'],
          obrigatoria: true
        },
        {
          id: 70,
          tipo: 'radio',
          pergunta: 'Há necessidade de área para visitantes?',
          opcoes: ['Sim', 'Não', 'Integrada'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'organizacao-trabalho',
      nome: '⚙️ Organização do Trabalho',
      descricao: 'Dinâmica de trabalho e necessidades operacionais',
      icon: '⚙️',
      obrigatoria: true,
      perguntas: [
        {
          id: 71,
          tipo: 'text',
          pergunta: 'Qual é o tipo de trabalho realizado?',
          obrigatoria: true,
          placeholder: 'Descrição das atividades principais'
        },
        {
          id: 72,
          tipo: 'radio',
          pergunta: 'É necessário concentração/silêncio?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        },
        {
          id: 73,
          tipo: 'radio',
          pergunta: 'Há trabalho em equipe frequente?',
          opcoes: ['Muito frequente', 'Frequente', 'Ocasional', 'Raro'],
          obrigatoria: true
        },
        {
          id: 74,
          tipo: 'radio',
          pergunta: 'É necessário atendimento ao público?',
          opcoes: ['Sim, frequente', 'Sim, ocasional', 'Não'],
          obrigatoria: true
        },
        {
          id: 75,
          tipo: 'radio',
          pergunta: 'Há reuniões frequentes?',
          opcoes: ['Diárias', 'Semanais', 'Mensais', 'Ocasionais'],
          obrigatoria: true
        },
        {
          id: 76,
          tipo: 'radio',
          pergunta: 'É necessário espaço para apresentações?',
          opcoes: ['Sim, frequente', 'Sim, ocasional', 'Não'],
          obrigatoria: true
        },
        {
          id: 77,
          tipo: 'radio',
          pergunta: 'Há necessidade de privacidade?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        },
        {
          id: 78,
          tipo: 'radio',
          pergunta: 'É importante flexibilidade no layout?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        },
        {
          id: 79,
          tipo: 'radio',
          pergunta: 'Há trabalho com documentos confidenciais?',
          opcoes: ['Sim, frequente', 'Sim, ocasional', 'Não'],
          obrigatoria: true
        },
        {
          id: 80,
          tipo: 'radio',
          pergunta: 'É necessário espaço para arquivo físico?',
          opcoes: ['Sim, muito', 'Sim, pouco', 'Não'],
          obrigatoria: true
        },
        {
          id: 81,
          tipo: 'text',
          pergunta: 'Qual é a cultura organizacional da empresa?',
          obrigatoria: true,
          placeholder: 'Descrição da cultura'
        },
        {
          id: 82,
          tipo: 'radio',
          pergunta: 'Há necessidade de espaços colaborativos?',
          opcoes: ['Sim, muitos', 'Sim, alguns', 'Não'],
          obrigatoria: true
        },
        {
          id: 83,
          tipo: 'radio',
          pergunta: 'É importante ter áreas de descompressão?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        },
        {
          id: 84,
          tipo: 'radio',
          pergunta: 'Existe trabalho em turnos ou horários flexíveis?',
          opcoes: ['Sim', 'Não', 'Parcialmente'],
          obrigatoria: true
        },
        {
          id: 85,
          tipo: 'radio',
          pergunta: 'Há necessidade de home office híbrido?',
          opcoes: ['Sim', 'Não', 'Futuro'],
          obrigatoria: true
        },
        {
          id: 86,
          tipo: 'radio',
          pergunta: 'É importante ter espaços para reuniões informais?',
          opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
          obrigatoria: true
        }
      ]
    },
    {
      id: 'tecnologia-equipamentos',
      nome: '💻 Tecnologia e Equipamentos',
      descricao: 'Necessidades tecnológicas e equipamentos',
      icon: '💻',
      obrigatoria: true,
      perguntas: [
        {id: 87, tipo: 'number', pergunta: 'Quantos computadores serão utilizados?', obrigatoria: true, min: 1, max: 200},
        {id: 88, tipo: 'radio', pergunta: 'É necessário servidor local?', opcoes: ['Sim', 'Não', 'Cloud'], obrigatoria: true},
        {id: 89, tipo: 'radio', pergunta: 'É necessária rede estruturada?', opcoes: ['Sim', 'Não', 'Wi-Fi'], obrigatoria: true},
        {id: 90, tipo: 'radio', pergunta: 'É necessário sistema telefônico?', opcoes: ['Sim, tradicional', 'Sim, VoIP', 'Não'], obrigatoria: true},
        {id: 91, tipo: 'radio', pergunta: 'É necessário sistema de videoconferência?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 92, tipo: 'radio', pergunta: 'É necessária internet de alta velocidade?', opcoes: ['Sim, crítica', 'Sim, desejável', 'Não'], obrigatoria: true},
        {id: 93, tipo: 'radio', pergunta: 'É necessário Wi-Fi em todo o escritório?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 94, tipo: 'number', pergunta: 'Quantas impressoras serão necessárias?', obrigatoria: true, min: 0, max: 20},
        {id: 95, tipo: 'radio', pergunta: 'É necessário scanner/copiadora?', opcoes: ['Sim', 'Não', 'Integrado'], obrigatoria: true},
        {id: 96, tipo: 'text', pergunta: 'Há equipamentos especiais necessários?', obrigatoria: false, placeholder: 'Equipamentos específicos'},
        {id: 97, tipo: 'radio', pergunta: 'É necessário sistema de backup?', opcoes: ['Sim', 'Não', 'Cloud'], obrigatoria: true},
        {id: 98, tipo: 'radio', pergunta: 'É necessário sistema de segurança digital?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 99, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 100, tipo: 'radio', pergunta: 'É necessário sistema de automação predial?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 101, tipo: 'radio', pergunta: 'É necessário sistema de controle de acesso?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 102, tipo: 'radio', pergunta: 'É necessário sistema de áudio/vídeo?', opcoes: ['Sim', 'Não', 'Reuniões'], obrigatoria: true}
      ]
    },
    {
      id: 'conforto-ambiente',
      nome: '🌡️ Conforto e Ambiente',
      descricao: 'Condições ambientais e conforto',
      icon: '🌡️',
      obrigatoria: true,
      perguntas: [
        {id: 103, tipo: 'radio', pergunta: 'É necessário ar condicionado?', opcoes: ['Sim, central', 'Sim, split', 'Não'], obrigatoria: true},
        {id: 104, tipo: 'radio', pergunta: 'É importante ventilação natural?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 105, tipo: 'radio', pergunta: 'É importante iluminação natural?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 106, tipo: 'radio', pergunta: 'É necessário controle de ruído?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 107, tipo: 'radio', pergunta: 'É importante ter vista externa?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 108, tipo: 'radio', pergunta: 'É necessário sistema de som?', opcoes: ['Sim', 'Não', 'Emergência'], obrigatoria: true},
        {id: 109, tipo: 'radio', pergunta: 'É importante ter plantas/decoração?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 110, tipo: 'radio', pergunta: 'É necessário espaço para relaxamento?', opcoes: ['Sim', 'Não', 'Integrado'], obrigatoria: true},
        {id: 111, tipo: 'radio', pergunta: 'É importante ter cores específicas?', opcoes: ['Sim', 'Não', 'Neutras'], obrigatoria: true},
        {id: 112, tipo: 'radio', pergunta: 'É necessário isolamento acústico?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 113, tipo: 'radio', pergunta: 'É importante ter controle individual de temperatura?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 114, tipo: 'radio', pergunta: 'É necessário sistema de purificação do ar?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 115, tipo: 'radio', pergunta: 'É importante ter iluminação regulável?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 116, tipo: 'radio', pergunta: 'É necessário controle de luminosidade natural?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 117, tipo: 'radio', pergunta: 'É importante ter ergonomia adequada?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 118, tipo: 'radio', pergunta: 'É necessário sistema de umidificação?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true}
      ]
    },
    {
      id: 'seguranca-controle',
      nome: '🔒 Segurança e Controle',
      descricao: 'Sistemas de segurança e controle de acesso',
      icon: '🔒',
      obrigatoria: true,
      perguntas: [
        {id: 119, tipo: 'radio', pergunta: 'É necessário controle de acesso?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 120, tipo: 'radio', pergunta: 'É necessário sistema de segurança?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 121, tipo: 'radio', pergunta: 'É necessário cofre?', opcoes: ['Sim', 'Não', 'Armário'], obrigatoria: true},
        {id: 122, tipo: 'radio', pergunta: 'É necessário sistema de backup?', opcoes: ['Sim', 'Não', 'Cloud'], obrigatoria: true},
        {id: 123, tipo: 'radio', pergunta: 'É necessário controle de visitantes?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 124, tipo: 'radio', pergunta: 'É necessário câmeras de segurança?', opcoes: ['Sim', 'Não', 'Externas'], obrigatoria: true},
        {id: 125, tipo: 'radio', pergunta: 'É necessário alarme?', opcoes: ['Sim', 'Não', 'Integrado'], obrigatoria: true},
        {id: 126, tipo: 'radio', pergunta: 'É necessário sistema contra incêndio?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 127, tipo: 'radio', pergunta: 'É necessário saída de emergência?', opcoes: ['Sim', 'Não', 'Do prédio'], obrigatoria: true},
        {id: 128, tipo: 'radio', pergunta: 'Há documentos que precisam de segurança especial?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 129, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento 24h?', opcoes: ['Sim', 'Não', 'Horário comercial'], obrigatoria: true},
        {id: 130, tipo: 'radio', pergunta: 'É necessário controle de acesso por biometria?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 131, tipo: 'radio', pergunta: 'É necessário sistema de detecção de intrusão?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 132, tipo: 'radio', pergunta: 'É necessário protocolo de segurança da informação?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true}
      ]
    },
    {
      id: 'normas-aprovacoes',
      nome: '📋 Normas e Aprovações',
      descricao: 'Licenças e conformidades necessárias',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        {id: 133, tipo: 'radio', pergunta: 'É necessário alvará de funcionamento?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 134, tipo: 'radio', pergunta: 'É necessária aprovação no corpo de bombeiros?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 135, tipo: 'text', pergunta: 'Há normas específicas da atividade?', obrigatoria: false, placeholder: 'Normas específicas'},
        {id: 136, tipo: 'radio', pergunta: 'É necessário projeto de prevenção contra incêndio?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 137, tipo: 'radio', pergunta: 'Há normas de acessibilidade a cumprir?', opcoes: ['Sim', 'Não', 'Parciais'], obrigatoria: true},
        {id: 138, tipo: 'radio', pergunta: 'É necessária licença sanitária?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 139, tipo: 'text', pergunta: 'Há outras aprovações necessárias?', obrigatoria: false, placeholder: 'Outras licenças'},
        {id: 140, tipo: 'radio', pergunta: 'É necessário laudo elétrico?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 141, tipo: 'radio', pergunta: 'É necessário laudo de vistoria do corpo de bombeiros?', opcoes: ['Sim', 'Não', 'Já possui'], obrigatoria: true},
        {id: 142, tipo: 'text', pergunta: 'Há normas específicas do condomínio?', obrigatoria: false, placeholder: 'Normas do prédio'},
        {id: 143, tipo: 'radio', pergunta: 'É necessário estudo de impacto de vizinhança?', opcoes: ['Sim', 'Não', 'Não sei'], obrigatoria: true},
        {id: 144, tipo: 'text', pergunta: 'Há exigências específicas da vigilância sanitária?', obrigatoria: false, placeholder: 'Exigências sanitárias'}
      ]
    },
    {
      id: 'cronograma-mudanca',
      nome: '📅 Cronograma e Mudança',
      descricao: 'Planejamento da transição e mudança',
      icon: '📅',
      obrigatoria: true,
      perguntas: [
        {id: 145, tipo: 'date', pergunta: 'Qual é o prazo para mudança?', obrigatoria: false},
        {id: 146, tipo: 'radio', pergunta: 'Há contratos que dependem da mudança?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 147, tipo: 'radio', pergunta: 'É necessário comunicar clientes?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 148, tipo: 'radio', pergunta: 'Há sazonalidade a considerar?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 149, tipo: 'radio', pergunta: 'É necessário treinamento da equipe?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 150, tipo: 'radio', pergunta: 'Há fornecedores que dependem do cronograma?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 151, tipo: 'radio', pergunta: 'É necessário testar sistemas antes da mudança?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 152, tipo: 'radio', pergunta: 'Há backup do escritório atual durante a transição?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 153, tipo: 'radio', pergunta: 'É necessário mudança gradual ou total?', opcoes: ['Gradual', 'Total', 'Flexível'], obrigatoria: true},
        {id: 154, tipo: 'radio', pergunta: 'Há necessidade de operação simultânea?', opcoes: ['Sim', 'Não', 'Temporária'], obrigatoria: true},
        {id: 155, tipo: 'radio', pergunta: 'É importante minimizar impacto na produtividade?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 156, tipo: 'radio', pergunta: 'Há clientes que precisam ser comunicados?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true}
      ]
    },
    {
      id: 'sustentabilidade',
      nome: '🌱 Sustentabilidade',
      descricao: 'Soluções sustentáveis e eficiência',
      icon: '🌱',
      obrigatoria: false,
      perguntas: [
        {id: 157, tipo: 'radio', pergunta: 'Há interesse em soluções sustentáveis?', opcoes: ['Muito interesse', 'Interesse médio', 'Pouco interesse'], obrigatoria: true},
        {id: 158, tipo: 'radio', pergunta: 'É importante eficiência energética?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 159, tipo: 'radio', pergunta: 'É importante usar materiais ecológicos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 160, tipo: 'radio', pergunta: 'Há interesse em certificação ambiental?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 161, tipo: 'radio', pergunta: 'É importante reduzir custos operacionais?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 162, tipo: 'radio', pergunta: 'Há interesse em energia solar?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 163, tipo: 'radio', pergunta: 'É importante ter gestão de resíduos?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true},
        {id: 164, tipo: 'radio', pergunta: 'Há interesse em materiais reciclados?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 165, tipo: 'radio', pergunta: 'É importante ter ventilação natural otimizada?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 166, tipo: 'radio', pergunta: 'Existe preocupação com pegada de carbono?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 167, tipo: 'radio', pergunta: 'É importante ter certificação LEED?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 168, tipo: 'radio', pergunta: 'Há interesse em tecnologias verdes?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true}
      ]
    },
    {
      id: 'ergonomia-bem-estar',
      nome: '🧘 Ergonomia e Bem-Estar',
      descricao: 'Conforto ergonômico e bem-estar dos funcionários',
      icon: '🧘',
      obrigatoria: true,
      perguntas: [
        {id: 169, tipo: 'radio', pergunta: 'É importante ter móveis ergonômicos?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 170, tipo: 'radio', pergunta: 'É necessário ajuste de altura das mesas?', opcoes: ['Sim', 'Não', 'Algumas'], obrigatoria: true},
        {id: 171, tipo: 'radio', pergunta: 'É importante ter cadeiras de qualidade?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 172, tipo: 'radio', pergunta: 'É necessário apoio para pés/punhos?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 173, tipo: 'radio', pergunta: 'É importante controlar reflexos na tela?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 174, tipo: 'radio', pergunta: 'É necessário iluminação adequada para leitura?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 175, tipo: 'radio', pergunta: 'É importante ter pausas visuais (plantas, arte)?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 176, tipo: 'radio', pergunta: 'É necessário espaço para alongamento?', opcoes: ['Sim', 'Não', 'Desejável'], obrigatoria: true},
        {id: 177, tipo: 'radio', pergunta: 'É importante ter temperatura controlada individualmente?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 178, tipo: 'radio', pergunta: 'É necessário controle de umidade do ar?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 179, tipo: 'radio', pergunta: 'É importante ter água filtrada disponível?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 180, tipo: 'radio', pergunta: 'É necessário espaço para lanche/café?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 181, tipo: 'radio', pergunta: 'É importante ter área para descompressão?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 182, tipo: 'radio', pergunta: 'É necessário controle de poluição sonora?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 183, tipo: 'radio', pergunta: 'É importante ter boa qualidade do ar?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 184, tipo: 'radio', pergunta: 'É necessário espaço para guardar pertences pessoais?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 185, tipo: 'radio', pergunta: 'É importante ter privacidade visual?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 186, tipo: 'radio', pergunta: 'É necessário espaço para reuniões informais?', opcoes: ['Sim', 'Não', 'Desejável'], obrigatoria: true},
        {id: 187, tipo: 'radio', pergunta: 'É importante ter flexibilidade para mudanças de layout?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true},
        {id: 188, tipo: 'radio', pergunta: 'É necessário considerar diferentes tipos físicos de usuários?', opcoes: ['Sim', 'Não', 'Parcialmente'], obrigatoria: true}
      ]
    },
    {
      id: 'tecnologia-corporativa-automacao',
      nome: '🤖 Tecnologia Corporativa e Automação',
      descricao: 'Sistemas inteligentes e automação predial',
      icon: '🤖',
      obrigatoria: false,
      perguntas: [
        {id: 189, tipo: 'radio', pergunta: 'É necessário sistema de automação predial?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 190, tipo: 'radio', pergunta: 'É importante ter controle inteligente de iluminação?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 191, tipo: 'radio', pergunta: 'É necessário sistema de monitoramento de energia?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 192, tipo: 'radio', pergunta: 'É importante ter sensores de presença?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 193, tipo: 'radio', pergunta: 'É necessário sistema de controle de temperatura por zona?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 194, tipo: 'radio', pergunta: 'É importante ter sistema de purificação do ar?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 195, tipo: 'radio', pergunta: 'É necessário carregadores para dispositivos móveis?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 196, tipo: 'radio', pergunta: 'É importante ter projetores/telas para apresentação?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true},
        {id: 197, tipo: 'radio', pergunta: 'É necessário sistema de áudio para reuniões?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 198, tipo: 'radio', pergunta: 'É importante ter quadros interativos?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 199, tipo: 'radio', pergunta: 'É necessário sistema de videoconferência avançado?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 200, tipo: 'radio', pergunta: 'É importante ter rede 5G/Wi-Fi 6?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 201, tipo: 'radio', pergunta: 'É necessário sistema de backup de energia?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 202, tipo: 'radio', pergunta: 'É importante ter materiais com baixa emissão de VOC?', opcoes: ['Sim', 'Não', 'Não sei'], obrigatoria: true},
        {id: 203, tipo: 'radio', pergunta: 'É necessário sistema de coleta seletiva?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 204, tipo: 'radio', pergunta: 'É importante ter certificação LEED ou similar?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 205, tipo: 'radio', pergunta: 'É necessário monitoramento de qualidade do ar interno?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 206, tipo: 'radio', pergunta: 'É importante ter sistema de reuso de água?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 207, tipo: 'radio', pergunta: 'É necessário paisagismo interno (biofilia)?', opcoes: ['Sim', 'Não', 'Básico'], obrigatoria: true},
        {id: 208, tipo: 'radio', pergunta: 'É importante ter iluminação LED com controle de temperatura de cor?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 209, tipo: 'radio', pergunta: 'É necessário sistema de sombreamento automatizado?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 210, tipo: 'radio', pergunta: 'É importante ter mobiliário feito com materiais sustentáveis?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true}
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
        {id: 215, tipo: 'radio', pergunta: 'Há necessidade de aprovação da diretoria para decisões?', opcoes: ['Sempre', 'Grandes decisões', 'Raramente', 'Nunca'], obrigatoria: true},
        {id: 216, tipo: 'text', pergunta: 'Qual é o processo interno de validação empresarial?', obrigatoria: false, placeholder: 'Descreva o processo'},
        {id: 217, tipo: 'radio', pergunta: 'Há preferência por relatórios detalhados ou resumidos?', opcoes: ['Detalhados', 'Resumidos', 'Ambos'], obrigatoria: true},
        {id: 218, tipo: 'radio', pergunta: 'Existe necessidade de documentação específica do processo?', opcoes: ['Sim', 'Não', 'Básica'], obrigatoria: true}
      ]
    },
    {
      id: 'analise-riscos-contingencias',
      nome: '⚠️ Análise de Riscos e Contingências',
      descricao: 'Gestão de riscos e planos de contingência',
      icon: '⚠️',
      obrigatoria: true,
      perguntas: [
        {id: 219, tipo: 'radio', pergunta: 'Qual é a tolerância a atrasos no cronograma?', opcoes: ['Nenhuma', 'Até 1 semana', 'Até 1 mês', 'Flexível'], obrigatoria: true},
        {id: 220, tipo: 'radio', pergunta: 'Existe capacidade financeira para imprevistos de 15%?', opcoes: ['Sim', 'Não', 'Parcialmente'], obrigatoria: true},
        {id: 221, tipo: 'radio', pergunta: 'Há flexibilidade para mudanças de escopo durante o projeto?', opcoes: ['Alta', 'Média', 'Baixa', 'Nenhuma'], obrigatoria: true},
        {id: 222, tipo: 'text', pergunta: 'Qual é a estratégia para lidar com problemas técnicos?', obrigatoria: false, placeholder: 'Estratégia de contingência'},
        {id: 223, tipo: 'text', pergunta: 'Existe plano alternativo para questões de aprovação?', obrigatoria: false, placeholder: 'Plano alternativo'},
        {id: 224, tipo: 'radio', pergunta: 'Há tolerância a variações de custo durante a obra?', opcoes: ['Até 5%', 'Até 10%', 'Até 15%', 'Nenhuma'], obrigatoria: true},
        {id: 225, tipo: 'text', pergunta: 'Qual é a estratégia para problemas de fornecimento?', obrigatoria: false, placeholder: 'Estratégia de fornecimento'},
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
        {id: 227, tipo: 'textarea', pergunta: 'Há alguma restrição específica não mencionada?', obrigatoria: false, placeholder: 'Descreva restrições específicas'},
        {id: 228, tipo: 'text', pergunta: 'Há algum ambiente que deve ter prioridade no projeto?', obrigatoria: false, placeholder: 'Ambiente prioritário'},
        {id: 229, tipo: 'text', pergunta: 'Há algum ambiente que pode ser eliminado se necessário?', obrigatoria: false, placeholder: 'Ambiente dispensável'},
        {id: 230, tipo: 'text', pergunta: 'Há preferência por algum profissional específico para a obra?', obrigatoria: false, placeholder: 'Profissional preferido'},
        {id: 231, tipo: 'radio', pergunta: 'Já possui algum projeto ou estudo preliminar?', opcoes: ['Sim', 'Não', 'Parcial'], obrigatoria: true},
        {id: 232, tipo: 'text', pergunta: 'Há alguma experiência anterior com mudanças de escritório?', obrigatoria: false, placeholder: 'Experiência anterior'},
        {id: 233, tipo: 'textarea', pergunta: 'Há alguma preocupação específica com a obra?', obrigatoria: false, placeholder: 'Preocupações específicas'},
        {id: 234, tipo: 'date', pergunta: 'Há algum prazo específico para mudança?', obrigatoria: false},
        {id: 235, tipo: 'text', pergunta: 'Há alguma cultura empresarial que deve ser considerada?', obrigatoria: false, placeholder: 'Cultura empresarial'},
        {id: 236, tipo: 'text', pergunta: 'Há necessidades específicas relacionadas ao tipo de trabalho?', obrigatoria: false, placeholder: 'Necessidades específicas'},
        {id: 237, tipo: 'radio', pergunta: 'Há funcionários com necessidades especiais?', opcoes: ['Sim', 'Não', 'Futuro'], obrigatoria: true},
        {id: 238, tipo: 'textarea', pergunta: 'Há alguma informação adicional importante?', obrigatoria: false, placeholder: 'Informações adicionais importantes'}
      ]
    }
  ]
}; 