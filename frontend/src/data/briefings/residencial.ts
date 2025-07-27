// BRIEFINGS RESIDENCIAIS - ARCFLOW
// 12 briefings especializados para tipologia residencial

import { BriefingCompleto } from '../../types/briefing';

export const BRIEFINGS_RESIDENCIAL: Record<string, BriefingCompleto> = {
  // CASA SIMPLES PADRÃO
  'residencial-casa_padrao-simples_padrao': {
    id: 'residencial-casa_padrao-simples_padrao',
    tipologia: 'residencial',
    subtipo: 'casa_padrao',
    padrao: 'simples_padrao',
    nome: 'Casa Simples Padrão',
    descricao: 'Briefing otimizado para casas de padrão simples, focado em funcionalidade e economia',
    totalPerguntas: 120,
    tempoEstimado: '35-45 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['casa', 'simples', 'economico', 'funcional'],
      categoria: 'basico',
      complexidade: 'baixa',
      publico: ['arquitetos', 'construtoras']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🎯 Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica e sustentabilidade',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Que tipo de casa de alto padrão deseja?',
            opcoes: ['Contemporânea', 'Tradicional'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'valor',
            pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + obra)',
            obrigatoria: true,
            placeholder: 'R$ 1.200.000',
            formatacao: 'moeda'
          },
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Como será o financiamento?',
            opcoes: ['Recursos próprios', 'Financiamento', 'Misto'],
            obrigatoria: true
          },
          {
            id: 4,
            tipo: 'radio',
            pergunta: 'Qual a prioridade?',
            opcoes: ['Prazo', 'Custo', 'Funcionalidade'],
            obrigatoria: true
          },
          {
            id: 5,
            tipo: 'radio',
            pergunta: 'Situação legal do terreno:',
            opcoes: ['Escritura', 'Matrícula', 'Documentação pendente'],
            obrigatoria: true
          },
          {
            id: 6,
            tipo: 'radio',
            pergunta: 'Terreno possui restrições conhecidas?',
            opcoes: ['Ambientais', 'Legais', 'Não'],
            obrigatoria: true
          },
          {
            id: 7,
            tipo: 'checkbox',
            pergunta: 'Infraestrutura disponível:',
            opcoes: ['Água', 'Esgoto', 'Energia'],
            obrigatoria: true
          },
          {
            id: 8,
            tipo: 'radio',
            pergunta: 'Zoneamento conhecido?',
            opcoes: ['Sim, com recuos e taxa de ocupação', 'Parcialmente', 'Não'],
            obrigatoria: true
          },
          {
            id: 9,
            tipo: 'radio',
            pergunta: 'Necessita demolição de construções existentes?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 10,
            tipo: 'radio',
            pergunta: 'Acesso para obra é viável?',
            opcoes: ['Sim', 'Não', 'Com restrições'],
            obrigatoria: true
          },
          {
            id: 11,
            tipo: 'radio',
            pergunta: 'Interesse em ventilação e iluminação natural?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 12,
            tipo: 'radio',
            pergunta: 'Captação de água da chuva é desejável?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'perfil-familiar',
        nome: '👥 Perfil Familiar e Lifestyle',
        descricao: 'Composição familiar e estilo de vida',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          {
            id: 13,
            tipo: 'number',
            pergunta: 'Quantas pessoas moram na casa atualmente?',
            obrigatoria: true,
            min: 1,
            max: 10
          },
          {
            id: 14,
            tipo: 'text',
            pergunta: 'Idades de todos os moradores:',
            obrigatoria: true,
            placeholder: 'Ex: 35, 32, 8, 5'
          },
          {
            id: 15,
            tipo: 'radio',
            pergunta: 'Há previsão de crescimento familiar nos próximos anos?',
            opcoes: ['Sim', 'Não', 'Talvez'],
            obrigatoria: true
          },
          {
            id: 16,
            tipo: 'number',
            pergunta: 'Trabalham em casa? Quantas pessoas?',
            obrigatoria: true,
            min: 0,
            max: 10
          },
          {
            id: 17,
            tipo: 'text',
            pergunta: 'Animais de estimação? (Tipo/Quantidade)',
            obrigatoria: false,
            placeholder: 'Ex: 2 cães, 1 gato'
          },
          {
            id: 18,
            tipo: 'radio',
            pergunta: 'Como definem seu estilo de vida?',
            opcoes: ['Formal', 'Casual'],
            obrigatoria: true
          },
          {
            id: 19,
            tipo: 'radio',
            pergunta: 'Frequência de visitas/hóspedes:',
            opcoes: ['Frequente', 'Esporádica'],
            obrigatoria: true
          },
          {
            id: 20,
            tipo: 'radio',
            pergunta: 'Preferência por ambientes integrados ou separados?',
            opcoes: ['Integrados', 'Separados', 'Misto'],
            obrigatoria: true
          },
          {
            id: 21,
            tipo: 'text',
            pergunta: 'Rotina de trabalho da família: (Horários/Home office)',
            obrigatoria: true,
            placeholder: 'Ex: 8h-18h, home office 2x semana'
          },
          {
            id: 22,
            tipo: 'radio',
            pergunta: 'Necessidades especiais de acessibilidade:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'analise-terreno',
        nome: '🏞️ Análise Técnica do Terreno',
        descricao: 'Características físicas, entorno e restrições legais',
        icon: '🏞️',
        obrigatoria: true,
        perguntas: [
          {
            id: 23,
            tipo: 'text',
            pergunta: 'Endereço completo do terreno:',
            obrigatoria: true,
            placeholder: 'Rua, número, bairro, cidade'
          },
          {
            id: 24,
            tipo: 'text',
            pergunta: 'Dimensões: (Frente x Fundo)',
            obrigatoria: true,
            placeholder: 'Ex: 15m x 30m'
          },
          {
            id: 25,
            tipo: 'number',
            pergunta: 'Área total do terreno (m²):',
            obrigatoria: true,
            min: 100,
            max: 5000
          },
          {
            id: 26,
            tipo: 'radio',
            pergunta: 'Topografia:',
            opcoes: ['Plano', 'Aclive', 'Declive'],
            obrigatoria: true
          },
          {
            id: 27,
            tipo: 'radio',
            pergunta: 'Orientação solar da frente do terreno:',
            opcoes: ['Norte', 'Sul', 'Leste', 'Oeste', 'Nordeste', 'Noroeste', 'Sudeste', 'Sudoeste'],
            obrigatoria: true
          },
          {
            id: 28,
            tipo: 'radio',
            pergunta: 'Há desnível entre terreno e rua?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 29,
            tipo: 'radio',
            pergunta: 'Vizinhança - construções existentes:',
            opcoes: ['Casas', 'Prédios', 'Misto'],
            obrigatoria: true
          },
          {
            id: 30,
            tipo: 'radio',
            pergunta: 'Nível de ruído:',
            opcoes: ['Silencioso', 'Moderado', 'Ruidoso'],
            obrigatoria: true
          },
          {
            id: 31,
            tipo: 'radio',
            pergunta: 'Segurança da região:',
            opcoes: ['Boa', 'Regular', 'Problemática'],
            obrigatoria: true
          },
          {
            id: 32,
            tipo: 'checkbox',
            pergunta: 'Serviços próximos:',
            opcoes: ['Escola', 'Hospital', 'Comércio', 'Transporte público'],
            obrigatoria: true
          },
          {
            id: 33,
            tipo: 'text',
            pergunta: 'Recuos mínimos obrigatórios: (Frontal/Laterais/Fundo)',
            obrigatoria: true,
            placeholder: 'Ex: 5m/1,5m/3m'
          },
          {
            id: 34,
            tipo: 'number',
            pergunta: 'Taxa de ocupação máxima permitida (%):',
            obrigatoria: true,
            min: 30,
            max: 80
          }
        ]
      },
      {
        id: 'programa-arquitetonico',
        nome: '🏠 Programa Arquitetônico Detalhado',
        descricao: 'Ambientes sociais, íntimos, de serviço e especiais',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          {
            id: 35,
            tipo: 'radio',
            pergunta: 'Sala de estar/jantar integradas?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 36,
            tipo: 'number',
            pergunta: 'Quantas pessoas na sala simultaneamente?',
            obrigatoria: true,
            min: 4,
            max: 20
          },
          {
            id: 37,
            tipo: 'radio',
            pergunta: 'Cozinha: Aberta ou fechada?',
            opcoes: ['Aberta', 'Fechada', 'Semi-aberta'],
            obrigatoria: true
          },
          {
            id: 38,
            tipo: 'radio',
            pergunta: 'Lavabo social:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 39,
            tipo: 'radio',
            pergunta: 'Espaço para home office?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 40,
            tipo: 'radio',
            pergunta: 'Varanda/Área externa social?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 41,
            tipo: 'number',
            pergunta: 'Quantos quartos no total?',
            obrigatoria: true,
            min: 2,
            max: 6
          },
          {
            id: 42,
            tipo: 'number',
            pergunta: 'Quantas suítes?',
            obrigatoria: true,
            min: 1,
            max: 4
          },
          {
            id: 43,
            tipo: 'number',
            pergunta: 'Tamanho mínimo dos quartos (m²):',
            obrigatoria: true,
            min: 9,
            max: 25
          },
          {
            id: 44,
            tipo: 'radio',
            pergunta: 'Banheiro social:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 45,
            tipo: 'radio',
            pergunta: 'Necessidade de armários embutidos?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 46,
            tipo: 'radio',
            pergunta: 'Quarto de hóspedes ou multiuso?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 47,
            tipo: 'radio',
            pergunta: 'Lavanderia:',
            opcoes: ['Separada', 'Integrada à cozinha'],
            obrigatoria: true
          },
          {
            id: 48,
            tipo: 'radio',
            pergunta: 'Depósito/Despensa:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 49,
            tipo: 'number',
            pergunta: 'Garagem: Quantos carros?',
            obrigatoria: true,
            min: 1,
            max: 4
          },
          {
            id: 50,
            tipo: 'radio',
            pergunta: 'Garagem coberta ou descoberta?',
            opcoes: ['Coberta', 'Descoberta', 'Mista'],
            obrigatoria: true
          },
          {
            id: 51,
            tipo: 'radio',
            pergunta: 'Área de serviço externa?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 52,
            tipo: 'radio',
            pergunta: 'Espaço para ferramentas/manutenção?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 53,
            tipo: 'radio',
            pergunta: 'Espaço para atividade física?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 54,
            tipo: 'radio',
            pergunta: 'Área para hobby específico?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: false
          }
        ]
      },
      {
        id: 'areas-externas-paisagismo',
        nome: '🌿 Áreas Externas e Paisagismo',
        descricao: 'Áreas de lazer e paisagismo',
        icon: '🌿',
        obrigatoria: true,
        perguntas: [
          {
            id: 55,
            tipo: 'radio',
            pergunta: 'Quintal/Jardim:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 56,
            tipo: 'radio',
            pergunta: 'Churrasqueira simples?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 57,
            tipo: 'radio',
            pergunta: 'Espaço para mesa externa?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 58,
            tipo: 'radio',
            pergunta: 'Área para crianças brincarem?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 59,
            tipo: 'radio',
            pergunta: 'Piscina é prioridade?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 60,
            tipo: 'radio',
            pergunta: 'Estilo de jardim preferido:',
            opcoes: ['Prático', 'Decorativo'],
            obrigatoria: true
          },
          {
            id: 61,
            tipo: 'radio',
            pergunta: 'Manutenção do jardim:',
            opcoes: ['Mínima', 'Moderada'],
            obrigatoria: true
          },
          {
            id: 62,
            tipo: 'radio',
            pergunta: 'Plantas preferidas:',
            opcoes: ['Fácil manutenção', 'Ornamentais'],
            obrigatoria: true
          },
          {
            id: 63,
            tipo: 'radio',
            pergunta: 'Horta:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 64,
            tipo: 'radio',
            pergunta: 'Área pavimentada externa:',
            opcoes: ['Mínima', 'Moderada'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'sistemas-tecnicos-tecnologia',
        nome: '💡 Sistemas Técnicos e Tecnologia',
        descricao: 'Sistemas prediais e tecnologia básica',
        icon: '💡',
        obrigatoria: true,
        perguntas: [
          {
            id: 65,
            tipo: 'radio',
            pergunta: 'Sistema elétrico:',
            opcoes: ['Padrão', 'Reforçado'],
            obrigatoria: true
          },
          {
            id: 66,
            tipo: 'radio',
            pergunta: 'Aquecimento de água:',
            opcoes: ['Chuveiro elétrico', 'Solar', 'Gás'],
            obrigatoria: true
          },
          {
            id: 67,
            tipo: 'radio',
            pergunta: 'Sistema hidráulico:',
            opcoes: ['Convencional'],
            obrigatoria: true
          },
          {
            id: 68,
            tipo: 'radio',
            pergunta: 'Sistema de esgoto:',
            opcoes: ['Rede pública', 'Fossa'],
            obrigatoria: true
          },
          {
            id: 69,
            tipo: 'radio',
            pergunta: 'Ar condicionado:',
            opcoes: ['Preparação para split', 'Não'],
            obrigatoria: true
          },
          {
            id: 70,
            tipo: 'radio',
            pergunta: 'Sistema de gás:',
            opcoes: ['Botijão', 'Encanado'],
            obrigatoria: true
          },
          {
            id: 71,
            tipo: 'radio',
            pergunta: 'Interfone:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 72,
            tipo: 'radio',
            pergunta: 'Sistema de segurança básico:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 73,
            tipo: 'radio',
            pergunta: 'Internet:',
            opcoes: ['Cabeamento básico', 'Wi-Fi apenas'],
            obrigatoria: true
          },
          {
            id: 74,
            tipo: 'text',
            pergunta: 'Pontos de TV: (Quais ambientes)',
            obrigatoria: true,
            placeholder: 'Ex: Sala, quartos'
          },
          {
            id: 75,
            tipo: 'radio',
            pergunta: 'Iluminação:',
            opcoes: ['Convencional', 'Alguns pontos especiais'],
            obrigatoria: true
          },
          {
            id: 76,
            tipo: 'radio',
            pergunta: 'Tomadas USB:',
            opcoes: ['Alguns pontos', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'estetica-design',
        nome: '🎨 Estética e Design',
        descricao: 'Estilo arquitetônico e design de interiores',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          {
            id: 77,
            tipo: 'radio',
            pergunta: 'Estilo arquitetônico preferido:',
            opcoes: ['Contemporâneo', 'Tradicional'],
            obrigatoria: true
          },
          {
            id: 78,
            tipo: 'text',
            pergunta: 'Referências visuais: (Anexar fotos de projetos admirados)',
            obrigatoria: false,
            placeholder: 'Descreva ou anexe referências'
          },
          {
            id: 79,
            tipo: 'radio',
            pergunta: 'Fachada:',
            opcoes: ['Simples', 'Detalhada'],
            obrigatoria: true
          },
          {
            id: 80,
            tipo: 'radio',
            pergunta: 'Cores predominantes:',
            opcoes: ['Neutras', 'Coloridas'],
            obrigatoria: true
          },
          {
            id: 81,
            tipo: 'radio',
            pergunta: 'Cobertura:',
            opcoes: ['Laje', 'Telha'],
            obrigatoria: true
          },
          {
            id: 82,
            tipo: 'radio',
            pergunta: 'Esquadrias:',
            opcoes: ['Alumínio', 'Ferro', 'Madeira'],
            obrigatoria: true
          },
          {
            id: 83,
            tipo: 'radio',
            pergunta: 'Estilo de interiores:',
            opcoes: ['Simples', 'Funcional'],
            obrigatoria: true
          },
          {
            id: 84,
            tipo: 'radio',
            pergunta: 'Paleta de cores internas:',
            opcoes: ['Neutras', 'Coloridas'],
            obrigatoria: true
          },
          {
            id: 85,
            tipo: 'radio',
            pergunta: 'Pisos:',
            opcoes: ['Cerâmica', 'Porcelanato', 'Laminado'],
            obrigatoria: true
          },
          {
            id: 86,
            tipo: 'radio',
            pergunta: 'Revestimentos:',
            opcoes: ['Básicos', 'Alguns destaques'],
            obrigatoria: true
          },
          {
            id: 87,
            tipo: 'radio',
            pergunta: 'Iluminação:',
            opcoes: ['Básica', 'Alguns pontos especiais'],
            obrigatoria: true
          },
          {
            id: 88,
            tipo: 'radio',
            pergunta: 'Móveis:',
            opcoes: ['Planejados', 'Soltos', 'Misto'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'aspectos-tecnicos-basicos',
        nome: '🔧 Aspectos Técnicos Básicos',
        descricao: 'Estrutura, materiais e conforto básico',
        icon: '🔧',
        obrigatoria: true,
        perguntas: [
          {
            id: 89,
            tipo: 'radio',
            pergunta: 'Preferência estrutural:',
            opcoes: ['Convencional', 'Econômica'],
            obrigatoria: true
          },
          {
            id: 90,
            tipo: 'radio',
            pergunta: 'Alvenaria:',
            opcoes: ['Blocos cerâmicos', 'Blocos de concreto'],
            obrigatoria: true
          },
          {
            id: 91,
            tipo: 'radio',
            pergunta: 'Pé-direito:',
            opcoes: ['Padrão 2,7m', 'Mínimo 2,5m'],
            obrigatoria: true
          },
          {
            id: 92,
            tipo: 'radio',
            pergunta: 'Vãos:',
            opcoes: ['Convencionais', 'Econômicos'],
            obrigatoria: true
          },
          {
            id: 93,
            tipo: 'radio',
            pergunta: 'Ventilação natural:',
            opcoes: ['Prioridade', 'Desejável'],
            obrigatoria: true
          },
          {
            id: 94,
            tipo: 'radio',
            pergunta: 'Proteção solar:',
            opcoes: ['Beirais', 'Básica'],
            obrigatoria: true
          },
          {
            id: 95,
            tipo: 'radio',
            pergunta: 'Isolamento térmico básico:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 96,
            tipo: 'radio',
            pergunta: 'Acústica:',
            opcoes: ['Básica', 'Não prioritária'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'cronograma-gestao',
        nome: '📅 Cronograma e Gestão',
        descricao: 'Prazos e gestão do projeto',
        icon: '📅',
        obrigatoria: true,
        perguntas: [
          {
            id: 97,
            tipo: 'date',
            pergunta: 'Início desejado da obra:',
            obrigatoria: true
          },
          {
            id: 98,
            tipo: 'date',
            pergunta: 'Prazo máximo para conclusão:',
            obrigatoria: true
          },
          {
            id: 99,
            tipo: 'text',
            pergunta: 'Há alguma data limite? (Motivo)',
            obrigatoria: false,
            placeholder: 'Ex: Casamento em dezembro'
          },
          {
            id: 100,
            tipo: 'radio',
            pergunta: 'Prioridade:',
            opcoes: ['Prazo', 'Custo'],
            obrigatoria: true
          },
          {
            id: 101,
            tipo: 'radio',
            pergunta: 'Frequência de reuniões desejada:',
            opcoes: ['Quinzenal', 'Mensal'],
            obrigatoria: true
          },
          {
            id: 102,
            tipo: 'radio',
            pergunta: 'Forma de comunicação preferida:',
            opcoes: ['WhatsApp', 'E-mail'],
            obrigatoria: true
          },
          {
            id: 103,
            tipo: 'radio',
            pergunta: 'Visitas à obra:',
            opcoes: ['Semanais', 'Quinzenais'],
            obrigatoria: true
          },
          {
            id: 104,
            tipo: 'radio',
            pergunta: 'Tomada de decisões:',
            opcoes: ['Rápida', 'Consultiva'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'aspectos-legais-financeiros',
        nome: '💰 Aspectos Legais e Financeiros',
        descricao: 'Documentação e aspectos financeiros',
        icon: '💰',
        obrigatoria: true,
        perguntas: [
          {
            id: 105,
            tipo: 'radio',
            pergunta: 'Documentação do terreno:',
            opcoes: ['Completa', 'Pendente'],
            obrigatoria: true
          },
          {
            id: 106,
            tipo: 'radio',
            pergunta: 'Aprovação na prefeitura:',
            opcoes: ['Necessária', 'Dispensada'],
            obrigatoria: true
          },
          {
            id: 107,
            tipo: 'radio',
            pergunta: 'Responsabilidade pelas aprovações:',
            opcoes: ['Arquiteto', 'Cliente'],
            obrigatoria: true
          },
          {
            id: 108,
            tipo: 'radio',
            pergunta: 'Regularização necessária?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 109,
            tipo: 'radio',
            pergunta: 'Forma de pagamento dos projetos:',
            opcoes: ['À vista', 'Parcelado'],
            obrigatoria: true
          },
          {
            id: 110,
            tipo: 'radio',
            pergunta: 'Forma de pagamento da obra:',
            opcoes: ['À vista', 'Financiado', 'Por etapas'],
            obrigatoria: true
          },
          {
            id: 111,
            tipo: 'radio',
            pergunta: 'Reserva para imprevistos:',
            opcoes: ['10%', 'Não tem'],
            obrigatoria: true
          },
          {
            id: 112,
            tipo: 'radio',
            pergunta: 'Medição da obra:',
            opcoes: ['Quinzenal', 'Mensal'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'questoes-especificas-simples',
        nome: '🎯 Questões Específicas Padrão Simples',
        descricao: 'Otimização de custos e funcionalidade essencial',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          {
            id: 113,
            tipo: 'radio',
            pergunta: 'Prioridade para economia:',
            opcoes: ['Acabamentos', 'Tamanho', 'Sistemas'],
            obrigatoria: true
          },
          {
            id: 114,
            tipo: 'radio',
            pergunta: 'Aceita materiais alternativos mais econômicos?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 115,
            tipo: 'radio',
            pergunta: 'Possibilidade de execução em etapas?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 116,
            tipo: 'radio',
            pergunta: 'Mão de obra:',
            opcoes: ['Empreitada', 'Administração direta'],
            obrigatoria: true
          },
          {
            id: 117,
            tipo: 'radio',
            pergunta: 'Ambientes multiuso são desejáveis?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 118,
            tipo: 'radio',
            pergunta: 'Prioridade para armazenamento:',
            opcoes: ['Alta', 'Média', 'Baixa'],
            obrigatoria: true
          },
          {
            id: 119,
            tipo: 'radio',
            pergunta: 'Facilidade de manutenção é essencial?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 120,
            tipo: 'radio',
            pergunta: 'Possibilidade de ampliação futura?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // CASA MÉDIO PADRÃO
  'residencial-casa_padrao-medio_padrao': {
    id: 'residencial-casa_padrao-medio_padrao',
    tipologia: 'residencial',
    subtipo: 'casa_padrao',
    padrao: 'medio_padrao',
    nome: 'Casa Médio Padrão',
    descricao: 'Briefing para casas de padrão médio, equilibrando conforto e custo',
    totalPerguntas: 175,
    tempoEstimado: '35-45 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['casa', 'medio_padrao', 'conforto', 'equilibrado'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['arquitetos', 'famílias']
    },
    secoes: [
      {
        id: 'dados-basicos',
        nome: '📋 Dados Básicos',
        descricao: 'Informações do projeto',
        icon: '📋',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Tipo de casa:',
            opcoes: ['Casa térrea', 'Sobrado', 'Casa com mezanino'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'valor',
            pergunta: 'Orçamento disponível:',
            obrigatoria: true,
            placeholder: 'R$ 1.500.000',
            formatacao: 'moeda'
          }
        ]
      },
      {
        id: 'programa-completo',
        nome: '🏠 Programa Completo',
        descricao: 'Todos os ambientes necessários',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          {
            id: 3,
            tipo: 'number',
            pergunta: 'Quantos quartos:',
            obrigatoria: true,
            min: 2,
            max: 5
          },
          {
            id: 4,
            tipo: 'radio',
            pergunta: 'Suíte master:',
            opcoes: ['Sim, com closet', 'Sim, simples', 'Não'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // APARTAMENTO SIMPLES
  'residencial-apartamento-simples_padrao': {
    id: 'residencial-apartamento-simples_padrao',
    tipologia: 'residencial',
    subtipo: 'apartamento',
    padrao: 'simples_padrao',
    nome: 'Apartamento Simples',
    descricao: 'Briefing para apartamentos compactos e funcionais',
    totalPerguntas: 140,
    tempoEstimado: '30-40 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['apartamento', 'compacto', 'funcional', 'urbano'],
      categoria: 'basico',
      complexidade: 'baixa',
      publico: ['arquitetos', 'incorporadoras']
    },
    secoes: [
      {
        id: 'dados-apartamento',
        nome: '🏢 Dados do Apartamento',
        descricao: 'Características do apartamento',
        icon: '🏢',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'number',
            pergunta: 'Área útil (m²):',
            obrigatoria: true,
            min: 35,
            max: 120,
            placeholder: '60'
          },
          {
            id: 2,
            tipo: 'radio',
            pergunta: 'Andar:',
            opcoes: ['Térreo', 'Baixo (2-5)', 'Médio (6-10)', 'Alto (11+)'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // APARTAMENTO MÉDIO PADRÃO - NOVO
  'residencial-apartamento-medio_padrao': {
    id: 'residencial-apartamento-medio_padrao',
    tipologia: 'residencial',
    subtipo: 'apartamento',
    padrao: 'medio_padrao',
    nome: 'Apartamento Médio Padrão',
    descricao: 'Briefing especializado para apartamentos de padrão médio (80-150m², R$ 150k-300k)',
    totalPerguntas: 175,
    tempoEstimado: '45-60 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['apartamento', 'medio', 'reforma', 'interiores'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['arquitetos', 'designers']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🎯 Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica e sustentabilidade básica',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          { id: 1, tipo: 'radio', pergunta: 'Tipo de intervenção desejada?', opcoes: ['Reforma parcial', 'Interiores', 'Reforma completa'], obrigatoria: true },
          { id: 2, tipo: 'text', pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + obra + mobiliário)', obrigatoria: true },
          { id: 3, tipo: 'radio', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento', 'Misto'], obrigatoria: true },
          { id: 4, tipo: 'radio', pergunta: 'Há reserva para contingência? (Recomendamos 10-15% do orçamento)', opcoes: ['Sim, 10%', 'Sim, 15%', 'Sim, outro valor', 'Não'], obrigatoria: true },
          { id: 5, tipo: 'radio', pergunta: 'Qual a prioridade?', opcoes: ['Prazo', 'Qualidade', 'Custo'], obrigatoria: true },
          { id: 6, tipo: 'radio', pergunta: 'Situação legal do imóvel:', opcoes: ['Escritura', 'Matrícula', 'Documentação completa'], obrigatoria: true },
          { id: 7, tipo: 'radio', pergunta: 'Idade do edifício:', opcoes: ['Novo', '5-15 anos', '15+ anos'], obrigatoria: true },
          { id: 8, tipo: 'radio', pergunta: 'Há projeto original disponível?', opcoes: ['Plantas', 'Não'], obrigatoria: true },
          { id: 9, tipo: 'radio', pergunta: 'Há limitações condominiais para reformas?', opcoes: ['Horários', 'Escopo', 'Não'], obrigatoria: true },
          { id: 10, tipo: 'radio', pergunta: 'Há restrições estruturais conhecidas?', opcoes: ['Paredes', 'Shafts'], obrigatoria: true },
          { id: 11, tipo: 'radio', pergunta: 'Infraestrutura disponível:', opcoes: ['Elétrica', 'Hidráulica', 'Gás'], obrigatoria: true },
          { id: 12, tipo: 'radio', pergunta: 'Acesso para obra é viável?', opcoes: ['Elevador', 'Escada'], obrigatoria: true },
          { id: 13, tipo: 'text', pergunta: 'Há restrições de horário para obra?', obrigatoria: true },
          { id: 14, tipo: 'radio', pergunta: 'Interesse em eficiência energética?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 15, tipo: 'radio', pergunta: 'Iluminação LED é prioridade?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 16, tipo: 'radio', pergunta: 'Reuso de água?', opcoes: ['Economizadores', 'Não'], obrigatoria: true },
          { id: 17, tipo: 'radio', pergunta: 'Ventilação natural é importante?', opcoes: ['Prioridade', 'Desejável', 'Indiferente'], obrigatoria: true },
          { id: 18, tipo: 'radio', pergunta: 'Materiais sustentáveis?', opcoes: ['Quando viável', 'Não é prioridade'], obrigatoria: true }
        ]
      }
    ]
  },

  // APARTAMENTO ALTO PADRÃO - NOVO
  'residencial-apartamento-alto_padrao': {
    id: 'residencial-apartamento-alto_padrao',
    tipologia: 'residencial',
    subtipo: 'apartamento',
    padrao: 'alto_padrao',
    nome: 'Apartamento Alto Padrão',
    descricao: 'Briefing completo para apartamentos de alto padrão com máxima personalização e luxo',
    totalPerguntas: 230,
    tempoEstimado: '60-90 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['apartamento', 'alto', 'luxo', 'premium'],
      categoria: 'premium',
      complexidade: 'alta',
      publico: ['arquitetos', 'designers', 'decoradores']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🎯 Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica, sustentabilidade e certificações',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          { id: 1, tipo: 'radio', pergunta: 'Tipo de intervenção desejada?', opcoes: ['Reforma completa', 'Interiores', 'Retrofit'], obrigatoria: true },
          { id: 2, tipo: 'text', pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + obra + mobiliário)', obrigatoria: true },
          { id: 3, tipo: 'radio', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento', 'Misto'], obrigatoria: true },
          { id: 4, tipo: 'radio', pergunta: 'Há reserva para contingência? (Recomendamos 15-20% do orçamento)', opcoes: ['Sim, 15%', 'Sim, 20%', 'Sim, outro valor', 'Não'], obrigatoria: true },
          { id: 5, tipo: 'radio', pergunta: 'Qual a prioridade?', opcoes: ['Exclusividade', 'Prazo', 'Qualidade', 'Inovação'], obrigatoria: true },
          { id: 6, tipo: 'radio', pergunta: 'Situação legal do imóvel:', opcoes: ['Escritura', 'Matrícula', 'Documentação completa'], obrigatoria: true },
          { id: 7, tipo: 'radio', pergunta: 'Idade do edifício:', opcoes: ['Novo', '5-15 anos', '15+ anos'], obrigatoria: true },
          { id: 8, tipo: 'radio', pergunta: 'Há projeto original disponível?', opcoes: ['Plantas', 'Memoriais', 'Não'], obrigatoria: true },
          { id: 9, tipo: 'radio', pergunta: 'Há limitações condominiais para reformas?', opcoes: ['Horários', 'Escopo', 'Não'], obrigatoria: true },
          { id: 10, tipo: 'radio', pergunta: 'Há restrições estruturais conhecidas?', opcoes: ['Paredes', 'Shafts', 'Pisos'], obrigatoria: true },
          { id: 11, tipo: 'checkbox', pergunta: 'Infraestrutura disponível:', opcoes: ['Elétrica', 'Hidráulica', 'Gás', 'Telecom'], obrigatoria: true },
          { id: 12, tipo: 'checkbox', pergunta: 'Há necessidade de aprovações?', opcoes: ['Condomínio', 'Prefeitura', 'Bombeiros'], obrigatoria: true },
          { id: 13, tipo: 'radio', pergunta: 'Acesso para obra é viável?', opcoes: ['Elevador', 'Escada', 'Restrições'], obrigatoria: true },
          { id: 14, tipo: 'text', pergunta: 'Há restrições de horário para obra?', obrigatoria: true },
          { id: 15, tipo: 'radio', pergunta: 'Há vizinhos sensíveis a considerar?', opcoes: ['Idosos', 'Crianças', 'Trabalho remoto'], obrigatoria: true },
          { id: 16, tipo: 'radio', pergunta: 'Interesse em certificação sustentável?', opcoes: ['LEED', 'AQUA', 'Não'], obrigatoria: true },
          { id: 17, tipo: 'radio', pergunta: 'Prioridade para eficiência energética?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 18, tipo: 'radio', pergunta: 'Sistemas de energia renovável?', opcoes: ['Solar', 'Não'], obrigatoria: true },
          { id: 19, tipo: 'radio', pergunta: 'Reuso de água?', opcoes: ['Sistemas de economia', 'Não'], obrigatoria: true },
          { id: 20, tipo: 'radio', pergunta: 'Materiais sustentáveis são prioridade?', opcoes: ['Sim', 'Não', 'Indiferente'], obrigatoria: true },
          { id: 21, tipo: 'radio', pergunta: 'Ventilação natural é importante?', opcoes: ['Prioridade alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 22, tipo: 'radio', pergunta: 'Iluminação natural é prioridade?', opcoes: ['Máxima', 'Equilibrada', 'Controlada'], obrigatoria: true },
          { id: 23, tipo: 'radio', pergunta: 'Interesse em vegetação interna?', opcoes: ['Jardim vertical', 'Vasos', 'Não'], obrigatoria: true },
          { id: 24, tipo: 'radio', pergunta: 'Descarte responsável de resíduos da obra?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 25, tipo: 'radio', pergunta: 'Qualidade do ar interno é prioridade?', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'perfil-familiar',
        nome: '👥 Perfil Familiar e Lifestyle',
        descricao: 'Composição familiar e estilo de vida detalhado',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          { id: 26, tipo: 'number', pergunta: 'Quantas pessoas moram no apartamento atualmente?', obrigatoria: true },
          { id: 27, tipo: 'text', pergunta: 'Idades de todos os moradores:', obrigatoria: true },
          { id: 28, tipo: 'radio', pergunta: 'Há previsão de crescimento familiar nos próximos 5 anos?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 29, tipo: 'radio', pergunta: 'Frequência de visitas/hóspedes:', opcoes: ['Diária', 'Semanal', 'Mensal', 'Esporádica'], obrigatoria: true },
          { id: 30, tipo: 'radio', pergunta: 'Duração típica das visitas:', opcoes: ['Algumas horas', 'Pernoite', 'Temporadas'], obrigatoria: true },
          { id: 31, tipo: 'text', pergunta: 'Trabalham em casa? Quantas pessoas? Com que frequência?', obrigatoria: true },
          { id: 32, tipo: 'radio', pergunta: 'Há funcionários domésticos?', opcoes: ['Diários', 'Diaristas', 'Mensalistas', 'Não'], obrigatoria: true },
          { id: 33, tipo: 'text', pergunta: 'Animais de estimação? (Tipo/Quantidade/Necessidades especiais)', obrigatoria: false },
          { id: 34, tipo: 'radio', pergunta: 'Como definem seu estilo de vida?', opcoes: ['Formal', 'Casual', 'Misto'], obrigatoria: true },
          { id: 35, tipo: 'radio', pergunta: 'Frequência de entretenimento em casa:', opcoes: ['Semanal', 'Mensal', 'Esporádico'], obrigatoria: true },
          { id: 36, tipo: 'radio', pergunta: 'Tipo de entretenimento preferido:', opcoes: ['Íntimo', 'Grandes grupos', 'Misto'], obrigatoria: true },
          { id: 37, tipo: 'text', pergunta: 'Atividades físicas praticadas em casa:', obrigatoria: false },
          { id: 38, tipo: 'text', pergunta: 'Hobbies que requerem espaços específicos:', obrigatoria: false },
          { id: 39, tipo: 'text', pergunta: 'Coleções que precisam de exposição/armazenamento:', obrigatoria: false },
          { id: 40, tipo: 'text', pergunta: 'Instrumentos musicais na família:', obrigatoria: false },
          { id: 41, tipo: 'radio', pergunta: 'Preferência por ambientes integrados ou compartimentados?', opcoes: ['Integrados', 'Compartimentados', 'Misto'], obrigatoria: true },
          { id: 42, tipo: 'radio', pergunta: 'Nível de privacidade desejado entre membros da família:', opcoes: ['Alto', 'Médio', 'Baixo'], obrigatoria: true },
          { id: 43, tipo: 'text', pergunta: 'Rotina de trabalho da família: (Horários/Home office/Viagens)', obrigatoria: true },
          { id: 44, tipo: 'text', pergunta: 'Como imaginam usar o apartamento nos próximos 10 anos?', obrigatoria: true },
          { id: 45, tipo: 'radio', pergunta: 'Necessidades especiais de acessibilidade:', opcoes: ['Atuais', 'Futuras', 'Não'], obrigatoria: true }
        ]
      }
    ]
  },

  // CONDOMÍNIO SIMPLES PADRÃO - NOVO
  'residencial-condominio-simples_padrao': {
    id: 'residencial-condominio-simples_padrao',
    tipologia: 'residencial',
    subtipo: 'condominio',
    padrao: 'simples_padrao',
    nome: 'Condomínio Simples Padrão',
    descricao: 'Briefing para condomínios de padrão simples, focado em funcionalidade e economia',
    totalPerguntas: 120,
    tempoEstimado: '30-40 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['condominio', 'simples', 'economico', 'funcional'],
      categoria: 'basico',
      complexidade: 'baixa',
      publico: ['arquitetos', 'incorporadoras', 'construtoras']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🎯 Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica e sustentabilidade básica',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          { id: 1, tipo: 'radio', pergunta: 'Que tipo de condomínio deseja?', opcoes: ['Horizontal', 'Vertical'], obrigatoria: true },
          { id: 2, tipo: 'text', pergunta: 'Qual o investimento total disponível? (Incluindo terreno + infraestrutura + edificações)', obrigatoria: true },
          { id: 3, tipo: 'radio', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento', 'Incorporação'], obrigatoria: true },
          { id: 4, tipo: 'radio', pergunta: 'Qual a prioridade?', opcoes: ['Prazo', 'Custo', 'Funcionalidade'], obrigatoria: true },
          { id: 5, tipo: 'radio', pergunta: 'Situação legal do terreno:', opcoes: ['Escritura', 'Matrícula', 'Documentação'], obrigatoria: true },
          { id: 6, tipo: 'radio', pergunta: 'Terreno possui restrições conhecidas?', opcoes: ['Ambientais', 'Legais', 'Não'], obrigatoria: true },
          { id: 7, tipo: 'checkbox', pergunta: 'Infraestrutura disponível:', opcoes: ['Água', 'Esgoto', 'Energia'], obrigatoria: true },
          { id: 8, tipo: 'radio', pergunta: 'Zoneamento conhecido?', opcoes: ['Recuos', 'Taxa ocupação'], obrigatoria: true },
          { id: 9, tipo: 'radio', pergunta: 'Necessita demolição de construções existentes?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 10, tipo: 'radio', pergunta: 'Acesso para obra é viável?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 11, tipo: 'radio', pergunta: 'Interesse em ventilação e iluminação natural?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 12, tipo: 'radio', pergunta: 'Captação de água da chuva é desejável?', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'perfil-publico',
        nome: '👥 Perfil do Público-Alvo',
        descricao: 'Composição dos moradores e estilo de vida',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          { id: 13, tipo: 'radio', pergunta: 'Perfil socioeconômico dos compradores:', opcoes: ['C', 'C+', 'B-'], obrigatoria: true },
          { id: 14, tipo: 'radio', pergunta: 'Faixa etária predominante:', opcoes: ['Jovens', 'Famílias', 'Misto'], obrigatoria: true },
          { id: 15, tipo: 'radio', pergunta: 'Tamanho médio das famílias:', opcoes: ['1-2', '3-4 pessoas'], obrigatoria: true },
          { id: 16, tipo: 'radio', pergunta: 'Presença de crianças:', opcoes: ['Algumas', 'Poucas'], obrigatoria: true },
          { id: 17, tipo: 'radio', pergunta: 'Animais de estimação:', opcoes: ['Permitidos', 'Restritos'], obrigatoria: true },
          { id: 18, tipo: 'radio', pergunta: 'Estilo de vida predominante:', opcoes: ['Formal', 'Casual'], obrigatoria: true },
          { id: 19, tipo: 'radio', pergunta: 'Frequência de entretenimento:', opcoes: ['Baixa', 'Ocasional'], obrigatoria: true },
          { id: 20, tipo: 'radio', pergunta: 'Trabalho remoto:', opcoes: ['Ocasional', 'Raro'], obrigatoria: true },
          { id: 21, tipo: 'radio', pergunta: 'Uso de áreas comuns:', opcoes: ['Baixo', 'Moderado'], obrigatoria: true },
          { id: 22, tipo: 'radio', pergunta: 'Preferência por privacidade:', opcoes: ['Alta', 'Média'], obrigatoria: true }
        ]
      },
      {
        id: 'analise-terreno',
        nome: '🏞️ Análise Técnica do Terreno',
        descricao: 'Características físicas, entorno e restrições legais',
        icon: '🏞️',
        obrigatoria: true,
        perguntas: [
          { id: 23, tipo: 'text', pergunta: 'Endereço completo do terreno:', obrigatoria: true },
          { id: 24, tipo: 'text', pergunta: 'Dimensões: (Frente x Fundo)', obrigatoria: true },
          { id: 25, tipo: 'number', pergunta: 'Área total do terreno (m²):', obrigatoria: true },
          { id: 26, tipo: 'radio', pergunta: 'Topografia:', opcoes: ['Plano', 'Aclive', 'Declive'], obrigatoria: true },
          { id: 27, tipo: 'radio', pergunta: 'Orientação solar da frente do terreno:', opcoes: ['Norte', 'Sul', 'Leste', 'Oeste'], obrigatoria: true },
          { id: 28, tipo: 'radio', pergunta: 'Há desnível entre terreno e rua?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 29, tipo: 'radio', pergunta: 'Vizinhança - construções existentes:', opcoes: ['Casas', 'Prédios'], obrigatoria: true },
          { id: 30, tipo: 'radio', pergunta: 'Nível de ruído:', opcoes: ['Silencioso', 'Moderado', 'Ruidoso'], obrigatoria: true },
          { id: 31, tipo: 'radio', pergunta: 'Segurança da região:', opcoes: ['Boa', 'Regular', 'Problemática'], obrigatoria: true },
          { id: 32, tipo: 'checkbox', pergunta: 'Serviços próximos:', opcoes: ['Escola', 'Hospital', 'Comércio'], obrigatoria: true },
          { id: 33, tipo: 'text', pergunta: 'Recuos mínimos obrigatórios: (Frontal/Laterais/Fundo)', obrigatoria: true },
          { id: 34, tipo: 'number', pergunta: 'Taxa de ocupação máxima permitida (%):', obrigatoria: true }
        ]
      },
      {
        id: 'programa-arquitetonico',
        nome: '🏠 Programa Arquitetônico Detalhado',
        descricao: 'Unidades residenciais, áreas comuns sociais, lazer e técnicas',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          { id: 35, tipo: 'number', pergunta: 'Número total de unidades:', obrigatoria: true },
          { id: 36, tipo: 'text', pergunta: 'Tipologias diferentes: (Quantas e quais)', obrigatoria: true },
          { id: 37, tipo: 'number', pergunta: 'Área média por unidade (m²):', obrigatoria: true },
          { id: 38, tipo: 'radio', pergunta: 'Número de quartos por unidade:', opcoes: ['1', '2'], obrigatoria: true },
          { id: 39, tipo: 'radio', pergunta: 'Número de suítes por unidade:', opcoes: ['0', '1'], obrigatoria: true },
          { id: 40, tipo: 'radio', pergunta: 'Vagas de garagem por unidade:', opcoes: ['1'], obrigatoria: true },
          { id: 41, tipo: 'radio', pergunta: 'Portaria/Recepção:', opcoes: ['Diurna', 'Não'], obrigatoria: true },
          { id: 42, tipo: 'radio', pergunta: 'Salão de festas:', opcoes: ['Pequeno', 'Não'], obrigatoria: true },
          { id: 43, tipo: 'radio', pergunta: 'Espaço gourmet:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 44, tipo: 'radio', pergunta: 'Brinquedoteca:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 45, tipo: 'radio', pergunta: 'Coworking:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 46, tipo: 'radio', pergunta: 'Pet place:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 47, tipo: 'radio', pergunta: 'Piscina:', opcoes: ['Pequena', 'Não'], obrigatoria: true },
          { id: 48, tipo: 'radio', pergunta: 'Academia:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 49, tipo: 'radio', pergunta: 'Quadra esportiva:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 50, tipo: 'radio', pergunta: 'Playground:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 51, tipo: 'radio', pergunta: 'Espaço zen/Yoga:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 52, tipo: 'radio', pergunta: 'Churrasqueira coletiva:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 53, tipo: 'radio', pergunta: 'Depósito de lixo:', opcoes: ['Coletivo'], obrigatoria: true },
          { id: 54, tipo: 'radio', pergunta: 'Estacionamento para visitantes:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'areas-externas',
        nome: '🌳 Áreas Externas e Paisagismo',
        descricao: 'Áreas de lazer externas e paisagismo',
        icon: '🌳',
        obrigatoria: true,
        perguntas: [
          { id: 55, tipo: 'radio', pergunta: 'Praça central:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 56, tipo: 'radio', pergunta: 'Áreas de convivência:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 57, tipo: 'radio', pergunta: 'Quiosques:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 58, tipo: 'radio', pergunta: 'Área para pets:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 59, tipo: 'radio', pergunta: 'Playground natural:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 60, tipo: 'radio', pergunta: 'Estilo de jardim preferido:', opcoes: ['Prático', 'Decorativo'], obrigatoria: true },
          { id: 61, tipo: 'radio', pergunta: 'Manutenção do jardim:', opcoes: ['Mínima', 'Moderada'], obrigatoria: true },
          { id: 62, tipo: 'radio', pergunta: 'Plantas preferidas:', opcoes: ['Fácil manutenção', 'Ornamentais'], obrigatoria: true },
          { id: 63, tipo: 'radio', pergunta: 'Horta comunitária:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 64, tipo: 'radio', pergunta: 'Iluminação paisagística:', opcoes: ['Básica', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'sistemas-tecnologia',
        nome: '⚡ Sistemas Técnicos e Tecnologia',
        descricao: 'Sistemas prediais e tecnologia básica',
        icon: '⚡',
        obrigatoria: true,
        perguntas: [
          { id: 65, tipo: 'radio', pergunta: 'Sistema elétrico:', opcoes: ['Padrão', 'Reforçado'], obrigatoria: true },
          { id: 66, tipo: 'radio', pergunta: 'Sistema hidráulico:', opcoes: ['Convencional'], obrigatoria: true },
          { id: 67, tipo: 'radio', pergunta: 'Sistema de esgoto:', opcoes: ['Rede pública', 'Fossa'], obrigatoria: true },
          { id: 68, tipo: 'radio', pergunta: 'Sistema de gás:', opcoes: ['Central', 'Individual'], obrigatoria: true },
          { id: 69, tipo: 'radio', pergunta: 'Ar condicionado:', opcoes: ['Preparação para split', 'Não'], obrigatoria: true },
          { id: 70, tipo: 'radio', pergunta: 'Interfone:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 71, tipo: 'radio', pergunta: 'CFTV:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 72, tipo: 'radio', pergunta: 'Alarme perimetral:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 73, tipo: 'radio', pergunta: 'Controle de acesso:', opcoes: ['Convencional'], obrigatoria: true },
          { id: 74, tipo: 'radio', pergunta: 'Wi-Fi nas áreas comuns:', opcoes: ['Não', 'Básico'], obrigatoria: true },
          { id: 75, tipo: 'radio', pergunta: 'Sistema de segurança:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 76, tipo: 'radio', pergunta: 'Portões automatizados:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'estetica-design',
        nome: '🎨 Estética e Design',
        descricao: 'Estilo arquitetônico e design de interiores das áreas comuns',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          { id: 77, tipo: 'radio', pergunta: 'Estilo arquitetônico preferido:', opcoes: ['Contemporâneo', 'Tradicional'], obrigatoria: true },
          { id: 78, tipo: 'text', pergunta: 'Referências visuais: (Anexar fotos de projetos admirados)', obrigatoria: false },
          { id: 79, tipo: 'radio', pergunta: 'Fachada:', opcoes: ['Simples', 'Detalhada'], obrigatoria: true },
          { id: 80, tipo: 'radio', pergunta: 'Cores predominantes:', opcoes: ['Neutras', 'Coloridas'], obrigatoria: true },
          { id: 81, tipo: 'radio', pergunta: 'Cobertura:', opcoes: ['Laje', 'Telha'], obrigatoria: true },
          { id: 82, tipo: 'radio', pergunta: 'Esquadrias:', opcoes: ['Alumínio', 'Ferro', 'Madeira'], obrigatoria: true },
          { id: 83, tipo: 'radio', pergunta: 'Estilo de interiores:', opcoes: ['Simples', 'Funcional'], obrigatoria: true },
          { id: 84, tipo: 'radio', pergunta: 'Paleta de cores internas:', opcoes: ['Neutras', 'Coloridas'], obrigatoria: true },
          { id: 85, tipo: 'radio', pergunta: 'Pisos:', opcoes: ['Cerâmica', 'Porcelanato', 'Laminado'], obrigatoria: true },
          { id: 86, tipo: 'radio', pergunta: 'Revestimentos:', opcoes: ['Básicos', 'Alguns destaques'], obrigatoria: true },
          { id: 87, tipo: 'radio', pergunta: 'Iluminação:', opcoes: ['Básica', 'Alguns pontos especiais'], obrigatoria: true },
          { id: 88, tipo: 'radio', pergunta: 'Móveis:', opcoes: ['Planejados', 'Soltos', 'Misto'], obrigatoria: true }
        ]
      },
      {
        id: 'aspectos-tecnicos',
        nome: '🔧 Aspectos Técnicos Básicos',
        descricao: 'Estrutura, materiais e conforto básico',
        icon: '🔧',
        obrigatoria: true,
        perguntas: [
          { id: 89, tipo: 'radio', pergunta: 'Preferência estrutural:', opcoes: ['Convencional', 'Econômica'], obrigatoria: true },
          { id: 90, tipo: 'radio', pergunta: 'Alvenaria:', opcoes: ['Blocos cerâmicos', 'Blocos de concreto'], obrigatoria: true },
          { id: 91, tipo: 'radio', pergunta: 'Pé-direito:', opcoes: ['Padrão 2,7m', 'Mínimo 2,5m'], obrigatoria: true },
          { id: 92, tipo: 'radio', pergunta: 'Vãos:', opcoes: ['Convencionais', 'Econômicos'], obrigatoria: true },
          { id: 93, tipo: 'radio', pergunta: 'Ventilação natural:', opcoes: ['Prioridade', 'Desejável'], obrigatoria: true },
          { id: 94, tipo: 'radio', pergunta: 'Proteção solar:', opcoes: ['Beirais', 'Básica'], obrigatoria: true },
          { id: 95, tipo: 'radio', pergunta: 'Isolamento térmico básico:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 96, tipo: 'radio', pergunta: 'Acústica:', opcoes: ['Básica', 'Não prioritária'], obrigatoria: true }
        ]
      },
      {
        id: 'cronograma-gestao',
        nome: '📅 Cronograma e Gestão',
        descricao: 'Prazos, gestão e comunicação',
        icon: '📅',
        obrigatoria: true,
        perguntas: [
          { id: 97, tipo: 'date', pergunta: 'Início desejado da obra:', obrigatoria: true },
          { id: 98, tipo: 'date', pergunta: 'Prazo máximo para conclusão:', obrigatoria: true },
          { id: 99, tipo: 'text', pergunta: 'Há alguma data limite? (Motivo)', obrigatoria: false },
          { id: 100, tipo: 'radio', pergunta: 'Prioridade:', opcoes: ['Prazo', 'Custo'], obrigatoria: true },
          { id: 101, tipo: 'radio', pergunta: 'Frequência de reuniões desejada:', opcoes: ['Quinzenal', 'Mensal'], obrigatoria: true },
          { id: 102, tipo: 'radio', pergunta: 'Forma de comunicação preferida:', opcoes: ['WhatsApp', 'E-mail'], obrigatoria: true },
          { id: 103, tipo: 'radio', pergunta: 'Visitas à obra:', opcoes: ['Semanais', 'Quinzenais'], obrigatoria: true },
          { id: 104, tipo: 'radio', pergunta: 'Tomada de decisões:', opcoes: ['Rápida', 'Consultiva'], obrigatoria: true }
        ]
      },
      {
        id: 'aspectos-legais',
        nome: '📋 Aspectos Legais e Financeiros',
        descricao: 'Documentação básica e aspectos financeiros',
        icon: '📋',
        obrigatoria: true,
        perguntas: [
          { id: 105, tipo: 'radio', pergunta: 'Documentação do terreno:', opcoes: ['Completa', 'Pendente'], obrigatoria: true },
          { id: 106, tipo: 'radio', pergunta: 'Aprovação na prefeitura:', opcoes: ['Necessária', 'Dispensada'], obrigatoria: true },
          { id: 107, tipo: 'radio', pergunta: 'Responsabilidade pelas aprovações:', opcoes: ['Arquiteto', 'Cliente'], obrigatoria: true },
          { id: 108, tipo: 'radio', pergunta: 'Regularização necessária?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 109, tipo: 'radio', pergunta: 'Forma de pagamento dos projetos:', opcoes: ['À vista', 'Parcelado'], obrigatoria: true },
          { id: 110, tipo: 'radio', pergunta: 'Forma de pagamento da obra:', opcoes: ['À vista', 'Financiado', 'Por etapas'], obrigatoria: true },
          { id: 111, tipo: 'radio', pergunta: 'Reserva para imprevistos:', opcoes: ['10%', 'Não tem'], obrigatoria: true },
          { id: 112, tipo: 'radio', pergunta: 'Medição da obra:', opcoes: ['Quinzenal', 'Mensal'], obrigatoria: true }
        ]
      },
      {
        id: 'questoes-simples',
        nome: '💡 Questões Específicas Padrão Simples',
        descricao: 'Otimização de custos e funcionalidade essencial',
        icon: '💡',
        obrigatoria: true,
        perguntas: [
          { id: 113, tipo: 'radio', pergunta: 'Prioridade para economia:', opcoes: ['Acabamentos', 'Tamanho', 'Sistemas'], obrigatoria: true },
          { id: 114, tipo: 'radio', pergunta: 'Aceita materiais alternativos mais econômicos?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 115, tipo: 'radio', pergunta: 'Possibilidade de execução em etapas?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 116, tipo: 'radio', pergunta: 'Mão de obra:', opcoes: ['Empreitada', 'Administração direta'], obrigatoria: true },
          { id: 117, tipo: 'radio', pergunta: 'Ambientes multiuso são desejáveis?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 118, tipo: 'radio', pergunta: 'Prioridade para armazenamento:', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 119, tipo: 'radio', pergunta: 'Facilidade de manutenção é essencial?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 120, tipo: 'radio', pergunta: 'Possibilidade de ampliação futura?', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      }
    ]
  },

  // CONDOMÍNIO MÉDIO PADRÃO
  'residencial-condominio-medio_padrao': {
    id: 'residencial-condominio-medio_padrao',
    tipologia: 'residencial',
    subtipo: 'condominio',
    padrao: 'medio_padrao',
    nome: 'Condomínio Médio Padrão',
    descricao: 'Briefing especializado para condomínios de médio padrão, equilibrando qualidade e custo',
    totalPerguntas: 175,
    tempoEstimado: '35-45 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['condominio', 'medio', 'equilibrado', 'qualidade'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['arquitetos', 'incorporadoras', 'construtoras']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🎯 Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica e sustentabilidade básica',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          { id: 1, tipo: 'radio', pergunta: 'Que tipo de condomínio deseja?', opcoes: ['Horizontal', 'Vertical', 'Misto'], obrigatoria: true },
          { id: 2, tipo: 'valor', pergunta: 'Qual o investimento total disponível? (Incluindo terreno + infraestrutura + edificações)', obrigatoria: true, placeholder: 'R$ 5.000.000', formatacao: 'moeda' },
          { id: 3, tipo: 'radio', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento', 'Incorporação'], obrigatoria: true },
          { id: 4, tipo: 'radio', pergunta: 'Há reserva para contingência?', opcoes: ['Sim, 10-15%', 'Sim, menos de 10%', 'Não'], obrigatoria: true },
          { id: 5, tipo: 'radio', pergunta: 'Qual a prioridade?', opcoes: ['Prazo', 'Qualidade', 'Custo', 'Rentabilidade'], obrigatoria: true },
          { id: 6, tipo: 'radio', pergunta: 'Situação legal do terreno:', opcoes: ['Escritura', 'Matrícula', 'Documentação completa'], obrigatoria: true },
          { id: 7, tipo: 'radio', pergunta: 'Terreno possui restrições ambientais?', opcoes: ['APP', 'Árvores protegidas', 'Não'], obrigatoria: true },
          { id: 8, tipo: 'checkbox', pergunta: 'Infraestrutura disponível:', opcoes: ['Água', 'Esgoto', 'Energia', 'Internet'], obrigatoria: true },
          { id: 9, tipo: 'radio', pergunta: 'Zoneamento conhecido?', opcoes: ['Zona/Taxa ocupação/Gabarito/Recuos', 'Parcialmente', 'Não'], obrigatoria: true },
          { id: 10, tipo: 'radio', pergunta: 'Há projetos aprovados anteriormente no terreno?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 11, tipo: 'radio', pergunta: 'Necessita demolição de construções existentes?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 12, tipo: 'radio', pergunta: 'Acesso para obra é viável?', opcoes: ['Sim', 'Com restrições', 'Problemático'], obrigatoria: true },
          { id: 13, tipo: 'radio', pergunta: 'Há restrições de horário para obra na região?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 14, tipo: 'radio', pergunta: 'Interesse em eficiência energética?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 15, tipo: 'radio', pergunta: 'Energia solar é prioridade?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 16, tipo: 'radio', pergunta: 'Reuso de água?', opcoes: ['Cisterna básica', 'Não'], obrigatoria: true },
          { id: 17, tipo: 'radio', pergunta: 'Ventilação natural é importante?', opcoes: ['Prioridade', 'Desejável', 'Indiferente'], obrigatoria: true },
          { id: 18, tipo: 'radio', pergunta: 'Materiais sustentáveis?', opcoes: ['Quando viável', 'Não é prioridade'], obrigatoria: true }
        ]
      },
      {
        id: 'perfil-publico',
        nome: '👥 Perfil do Público-Alvo',
        descricao: 'Composição dos moradores e estilo de vida',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          { id: 19, tipo: 'radio', pergunta: 'Perfil socioeconômico dos compradores:', opcoes: ['B', 'B+', 'C+'], obrigatoria: true },
          { id: 20, tipo: 'radio', pergunta: 'Faixa etária predominante:', opcoes: ['Jovens', 'Famílias', 'Idosos', 'Misto'], obrigatoria: true },
          { id: 21, tipo: 'radio', pergunta: 'Tamanho médio das famílias:', opcoes: ['1-2 pessoas', '3-4 pessoas', '5+ pessoas'], obrigatoria: true },
          { id: 22, tipo: 'radio', pergunta: 'Presença de crianças:', opcoes: ['Muitas', 'Algumas', 'Poucas'], obrigatoria: true },
          { id: 23, tipo: 'radio', pergunta: 'Presença de idosos:', opcoes: ['Muitos', 'Alguns', 'Poucos'], obrigatoria: true },
          { id: 24, tipo: 'radio', pergunta: 'Perfil profissional:', opcoes: ['Profissionais liberais', 'Funcionários', 'Misto'], obrigatoria: true },
          { id: 25, tipo: 'radio', pergunta: 'Animais de estimação:', opcoes: ['Permitidos', 'Restritos', 'Não permitidos'], obrigatoria: true },
          { id: 26, tipo: 'radio', pergunta: 'Estilo de vida predominante:', opcoes: ['Formal', 'Casual', 'Misto'], obrigatoria: true },
          { id: 27, tipo: 'radio', pergunta: 'Frequência de entretenimento:', opcoes: ['Média', 'Baixa'], obrigatoria: true },
          { id: 28, tipo: 'radio', pergunta: 'Tipo de entretenimento preferido:', opcoes: ['Íntimo', 'Pequenos grupos'], obrigatoria: true },
          { id: 29, tipo: 'radio', pergunta: 'Atividades físicas praticadas:', opcoes: ['Individuais', 'Coletivas'], obrigatoria: true },
          { id: 30, tipo: 'radio', pergunta: 'Trabalho remoto:', opcoes: ['Ocasional', 'Raro'], obrigatoria: true },
          { id: 31, tipo: 'radio', pergunta: 'Uso de áreas comuns:', opcoes: ['Moderado', 'Baixo'], obrigatoria: true },
          { id: 32, tipo: 'radio', pergunta: 'Preferência por privacidade:', opcoes: ['Alta', 'Média'], obrigatoria: true },
          { id: 33, tipo: 'radio', pergunta: 'Interação entre vizinhos:', opcoes: ['Moderada', 'Mínima'], obrigatoria: true }
        ]
      },
      {
        id: 'analise-terreno',
        nome: '🏞️ Análise Técnica do Terreno',
        descricao: 'Características físicas, entorno e contexto, restrições legais',
        icon: '🏞️',
        obrigatoria: true,
        perguntas: [
          { id: 34, tipo: 'text', pergunta: 'Endereço completo do terreno:', obrigatoria: true },
          { id: 35, tipo: 'text', pergunta: 'Dimensões exatas: (Frente x Fundo)', obrigatoria: true },
          { id: 36, tipo: 'number', pergunta: 'Área total do terreno (m²):', obrigatoria: true },
          { id: 37, tipo: 'radio', pergunta: 'Topografia:', opcoes: ['Plano', 'Aclive', 'Declive', 'Percentual'], obrigatoria: true },
          { id: 38, tipo: 'radio', pergunta: 'Orientação solar da frente do terreno:', opcoes: ['Norte', 'Sul', 'Leste', 'Oeste'], obrigatoria: true },
          { id: 39, tipo: 'number', pergunta: 'Há desnível entre terreno e rua? (Metros)', obrigatoria: true },
          { id: 40, tipo: 'radio', pergunta: 'Vegetação existente:', opcoes: ['Árvores', 'Arbustos', 'Nenhuma'], obrigatoria: true },
          { id: 41, tipo: 'radio', pergunta: 'Drenagem natural:', opcoes: ['Boa', 'Regular', 'Problemática'], obrigatoria: true },
          { id: 42, tipo: 'radio', pergunta: 'Vizinhança - construções existentes:', opcoes: ['Casas', 'Prédios', 'Misto'], obrigatoria: true },
          { id: 43, tipo: 'radio', pergunta: 'Padrão construtivo da região:', opcoes: ['Alto', 'Médio', 'Simples'], obrigatoria: true },
          { id: 44, tipo: 'radio', pergunta: 'Nível de ruído:', opcoes: ['Silencioso', 'Moderado', 'Ruidoso'], obrigatoria: true },
          { id: 45, tipo: 'radio', pergunta: 'Segurança da região:', opcoes: ['Boa', 'Regular', 'Problemática'], obrigatoria: true },
          { id: 46, tipo: 'radio', pergunta: 'Vistas privilegiadas:', opcoes: ['Verde', 'Urbana', 'Nenhuma'], obrigatoria: true },
          { id: 47, tipo: 'radio', pergunta: 'Privacidade visual:', opcoes: ['Total', 'Parcial', 'Limitada'], obrigatoria: true },
          { id: 48, tipo: 'checkbox', pergunta: 'Serviços próximos:', opcoes: ['Escola', 'Hospital', 'Shopping'], obrigatoria: true },
          { id: 49, tipo: 'text', pergunta: 'Recuos mínimos obrigatórios: (Frontal/Laterais/Fundo)', obrigatoria: true },
          { id: 50, tipo: 'number', pergunta: 'Taxa de ocupação máxima permitida (%):', obrigatoria: true },
          { id: 51, tipo: 'number', pergunta: 'Gabarito máximo permitido: (Pavimentos)', obrigatoria: true }
        ]
      },
      {
        id: 'programa-arquitetonico',
        nome: '🏠 Programa Arquitetônico Detalhado',
        descricao: 'Unidades residenciais, áreas comuns sociais, lazer e técnicas',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          { id: 52, tipo: 'number', pergunta: 'Número total de unidades:', obrigatoria: true },
          { id: 53, tipo: 'text', pergunta: 'Tipologias diferentes: (Quantas e quais)', obrigatoria: true },
          { id: 54, tipo: 'number', pergunta: 'Área média por unidade (m²):', obrigatoria: true },
          { id: 55, tipo: 'radio', pergunta: 'Número de quartos por unidade:', opcoes: ['1', '2', '3'], obrigatoria: true },
          { id: 56, tipo: 'radio', pergunta: 'Número de suítes por unidade:', opcoes: ['0', '1', '2'], obrigatoria: true },
          { id: 57, tipo: 'radio', pergunta: 'Vagas de garagem por unidade:', opcoes: ['1', '2'], obrigatoria: true },
          { id: 58, tipo: 'radio', pergunta: 'Depósito privativo por unidade?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 59, tipo: 'radio', pergunta: 'Varanda/Terraço privativo?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 60, tipo: 'radio', pergunta: 'Portaria/Recepção:', opcoes: ['24h', 'Diurna', 'Não'], obrigatoria: true },
          { id: 61, tipo: 'radio', pergunta: 'Salão de festas:', opcoes: ['Médio', 'Pequeno', 'Não'], obrigatoria: true },
          { id: 62, tipo: 'radio', pergunta: 'Espaço gourmet:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 63, tipo: 'radio', pergunta: 'Sala de jogos:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 64, tipo: 'radio', pergunta: 'Brinquedoteca:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 65, tipo: 'radio', pergunta: 'Coworking:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 66, tipo: 'radio', pergunta: 'Sala de reuniões:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 67, tipo: 'radio', pergunta: 'Pet place:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 68, tipo: 'radio', pergunta: 'Piscina:', opcoes: ['Adulto', 'Infantil', 'Não'], obrigatoria: true },
          { id: 69, tipo: 'radio', pergunta: 'Academia:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 70, tipo: 'radio', pergunta: 'Quadra esportiva:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 71, tipo: 'radio', pergunta: 'Playground:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 72, tipo: 'radio', pergunta: 'Espaço zen/Yoga:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 73, tipo: 'radio', pergunta: 'Churrasqueira coletiva:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 74, tipo: 'radio', pergunta: 'Central de segurança:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 75, tipo: 'radio', pergunta: 'Depósito de lixo:', opcoes: ['Coletivo', 'Individual'], obrigatoria: true },
          { id: 76, tipo: 'radio', pergunta: 'Estacionamento para visitantes:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'areas-externas',
        nome: '🌳 Áreas Externas e Paisagismo',
        descricao: 'Áreas de lazer externas e paisagismo',
        icon: '🌳',
        obrigatoria: true,
        perguntas: [
          { id: 77, tipo: 'radio', pergunta: 'Praça central:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 78, tipo: 'radio', pergunta: 'Áreas de convivência:', opcoes: ['Poucas', 'Não'], obrigatoria: true },
          { id: 79, tipo: 'radio', pergunta: 'Quiosques:', opcoes: ['Poucos', 'Não'], obrigatoria: true },
          { id: 80, tipo: 'radio', pergunta: 'Deck molhado:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 81, tipo: 'radio', pergunta: 'Área para pets:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 82, tipo: 'radio', pergunta: 'Playground natural:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 83, tipo: 'radio', pergunta: 'Redário:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 84, tipo: 'radio', pergunta: 'Pista de caminhada:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 85, tipo: 'radio', pergunta: 'Estilo de paisagismo:', opcoes: ['Natural', 'Formal', 'Contemporâneo'], obrigatoria: true },
          { id: 86, tipo: 'radio', pergunta: 'Densidade de vegetação:', opcoes: ['Média', 'Baixa'], obrigatoria: true },
          { id: 87, tipo: 'radio', pergunta: 'Plantas preferidas:', opcoes: ['Nativas', 'Ornamentais', 'Frutíferas'], obrigatoria: true },
          { id: 88, tipo: 'radio', pergunta: 'Horta comunitária:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 89, tipo: 'radio', pergunta: 'Irrigação automatizada:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 90, tipo: 'radio', pergunta: 'Iluminação paisagística:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 91, tipo: 'radio', pergunta: 'Área de compostagem:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'sistemas-tecnologia',
        nome: '⚡ Sistemas Técnicos e Tecnologia',
        descricao: 'Sistemas prediais e automação/tecnologia',
        icon: '⚡',
        obrigatoria: true,
        perguntas: [
          { id: 92, tipo: 'radio', pergunta: 'Sistema elétrico:', opcoes: ['Padrão', 'Reforçado'], obrigatoria: true },
          { id: 93, tipo: 'radio', pergunta: 'Gerador de emergência:', opcoes: ['Parcial', 'Não'], obrigatoria: true },
          { id: 94, tipo: 'radio', pergunta: 'Sistema hidráulico:', opcoes: ['Convencional', 'Pressurizador'], obrigatoria: true },
          { id: 95, tipo: 'radio', pergunta: 'Aquecimento de água:', opcoes: ['Central', 'Individual', 'Solar', 'Gás'], obrigatoria: true },
          { id: 96, tipo: 'radio', pergunta: 'Sistema de esgoto:', opcoes: ['Rede pública', 'Fossa'], obrigatoria: true },
          { id: 97, tipo: 'radio', pergunta: 'Sistema de gás:', opcoes: ['Central', 'Individual'], obrigatoria: true },
          { id: 98, tipo: 'radio', pergunta: 'Ar condicionado:', opcoes: ['Preparação', 'Não'], obrigatoria: true },
          { id: 99, tipo: 'radio', pergunta: 'Ventilação mecânica:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 100, tipo: 'radio', pergunta: 'Coleta seletiva:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 101, tipo: 'radio', pergunta: 'Sistema de filtragem de água:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 102, tipo: 'radio', pergunta: 'Interfone:', opcoes: ['Vídeo', 'Áudio'], obrigatoria: true },
          { id: 103, tipo: 'radio', pergunta: 'CFTV:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 104, tipo: 'radio', pergunta: 'Automação predial:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 105, tipo: 'radio', pergunta: 'Controle de acesso:', opcoes: ['Cartão', 'Convencional'], obrigatoria: true },
          { id: 106, tipo: 'radio', pergunta: 'Wi-Fi nas áreas comuns:', opcoes: ['Parcial', 'Não'], obrigatoria: true },
          { id: 107, tipo: 'radio', pergunta: 'Rede estruturada:', opcoes: ['Básica', 'Não'], obrigatoria: true },
          { id: 108, tipo: 'radio', pergunta: 'Sistema de segurança:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 109, tipo: 'radio', pergunta: 'App do condomínio:', opcoes: ['Básico', 'Não'], obrigatoria: true },
          { id: 110, tipo: 'radio', pergunta: 'Sensores de presença:', opcoes: ['Principais', 'Não'], obrigatoria: true },
          { id: 111, tipo: 'radio', pergunta: 'Portões automatizados:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'estetica-design',
        nome: '🎨 Estética e Design',
        descricao: 'Estilo arquitetônico e design de interiores das áreas comuns',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          { id: 112, tipo: 'radio', pergunta: 'Estilo arquitetônico preferido:', opcoes: ['Contemporâneo', 'Clássico', 'Rústico'], obrigatoria: true },
          { id: 113, tipo: 'text', pergunta: 'Referências visuais: (Anexar fotos de projetos admirados)', obrigatoria: false },
          { id: 114, tipo: 'radio', pergunta: 'Fachada:', opcoes: ['Moderna', 'Tradicional', 'Mista'], obrigatoria: true },
          { id: 115, tipo: 'radio', pergunta: 'Materiais de fachada preferidos:', opcoes: ['Concreto', 'Madeira', 'Cerâmica'], obrigatoria: true },
          { id: 116, tipo: 'radio', pergunta: 'Cores predominantes:', opcoes: ['Neutras', 'Terrosas', 'Claras'], obrigatoria: true },
          { id: 117, tipo: 'radio', pergunta: 'Cobertura:', opcoes: ['Laje', 'Telha cerâmica', 'Telha metálica'], obrigatoria: true },
          { id: 118, tipo: 'radio', pergunta: 'Esquadrias:', opcoes: ['Alumínio', 'PVC'], obrigatoria: true },
          { id: 119, tipo: 'radio', pergunta: 'Integração interior/exterior:', opcoes: ['Máxima', 'Moderada'], obrigatoria: true },
          { id: 120, tipo: 'radio', pergunta: 'Estilo de interiores:', opcoes: ['Moderno', 'Clássico', 'Contemporâneo'], obrigatoria: true },
          { id: 121, tipo: 'radio', pergunta: 'Paleta de cores internas:', opcoes: ['Neutras', 'Quentes', 'Claras'], obrigatoria: true },
          { id: 122, tipo: 'radio', pergunta: 'Pisos:', opcoes: ['Porcelanato', 'Laminado', 'Misto'], obrigatoria: true },
          { id: 123, tipo: 'radio', pergunta: 'Iluminação:', opcoes: ['Direta', 'Mista'], obrigatoria: true },
          { id: 124, tipo: 'radio', pergunta: 'Móveis:', opcoes: ['Planejados', 'Soltos', 'Misto'], obrigatoria: true },
          { id: 125, tipo: 'radio', pergunta: 'Obras de arte:', opcoes: ['Algumas', 'Poucas'], obrigatoria: true },
          { id: 126, tipo: 'radio', pergunta: 'Plantas internas:', opcoes: ['Algumas', 'Poucas'], obrigatoria: true },
          { id: 127, tipo: 'radio', pergunta: 'Metais:', opcoes: ['Cromado', 'Preto', 'Misto'], obrigatoria: true },
          { id: 128, tipo: 'radio', pergunta: 'Acabamentos:', opcoes: ['Foscos', 'Misto'], obrigatoria: true },
          { id: 129, tipo: 'radio', pergunta: 'Tapetes:', opcoes: ['Alguns', 'Poucos'], obrigatoria: true }
        ]
      },
      {
        id: 'aspectos-tecnicos',
        nome: '🔧 Aspectos Técnicos Especializados',
        descricao: 'Estrutura e fundação, conforto ambiental',
        icon: '🔧',
        obrigatoria: true,
        perguntas: [
          { id: 130, tipo: 'radio', pergunta: 'Preferência estrutural:', opcoes: ['Concreto armado', 'Conforme projeto'], obrigatoria: true },
          { id: 131, tipo: 'radio', pergunta: 'Fundação:', opcoes: ['Conforme projeto', 'Econômica'], obrigatoria: true },
          { id: 132, tipo: 'radio', pergunta: 'Pé-direito:', opcoes: ['Padrão 2,7m', 'Alto 3m'], obrigatoria: true },
          { id: 133, tipo: 'radio', pergunta: 'Vãos livres:', opcoes: ['Médios', 'Convencionais'], obrigatoria: true },
          { id: 134, tipo: 'radio', pergunta: 'Estrutura aparente:', opcoes: ['Não', 'Talvez'], obrigatoria: true },
          { id: 135, tipo: 'radio', pergunta: 'Isolamento térmico:', opcoes: ['Moderado', 'Padrão'], obrigatoria: true },
          { id: 136, tipo: 'radio', pergunta: 'Isolamento acústico:', opcoes: ['Moderado', 'Padrão'], obrigatoria: true },
          { id: 137, tipo: 'radio', pergunta: 'Ventilação cruzada:', opcoes: ['Prioridade', 'Desejável'], obrigatoria: true },
          { id: 138, tipo: 'radio', pergunta: 'Proteção solar:', opcoes: ['Beirais', 'Básica'], obrigatoria: true },
          { id: 139, tipo: 'radio', pergunta: 'Aproveitamento de chuva:', opcoes: ['Cisterna', 'Não'], obrigatoria: true },
          { id: 140, tipo: 'radio', pergunta: 'Iluminação natural:', opcoes: ['Máxima', 'Controlada'], obrigatoria: true },
          { id: 141, tipo: 'radio', pergunta: 'Privacidade acústica:', opcoes: ['Moderada', 'Padrão'], obrigatoria: true }
        ]
      },
      {
        id: 'cronograma-gestao',
        nome: '📅 Cronograma e Gestão',
        descricao: 'Prazos e gestão/comunicação',
        icon: '📅',
        obrigatoria: true,
        perguntas: [
          { id: 142, tipo: 'date', pergunta: 'Início desejado dos projetos:', obrigatoria: true },
          { id: 143, tipo: 'date', pergunta: 'Início desejado da obra:', obrigatoria: true },
          { id: 144, tipo: 'date', pergunta: 'Prazo desejado para conclusão da obra:', obrigatoria: true },
          { id: 145, tipo: 'text', pergunta: 'Há alguma data limite? (Motivo)', obrigatoria: false },
          { id: 146, tipo: 'radio', pergunta: 'Flexibilidade de prazos:', opcoes: ['Pequena', 'Moderada', 'Total'], obrigatoria: true },
          { id: 147, tipo: 'radio', pergunta: 'Prioridade:', opcoes: ['Prazo', 'Qualidade', 'Custo'], obrigatoria: true },
          { id: 148, tipo: 'radio', pergunta: 'Frequência de reuniões desejada:', opcoes: ['Quinzenal', 'Mensal'], obrigatoria: true },
          { id: 149, tipo: 'radio', pergunta: 'Forma de comunicação preferida:', opcoes: ['WhatsApp', 'E-mail'], obrigatoria: true },
          { id: 150, tipo: 'radio', pergunta: 'Relatórios de obra:', opcoes: ['Semanais', 'Quinzenais'], obrigatoria: true },
          { id: 151, tipo: 'radio', pergunta: 'Visitas à obra:', opcoes: ['Semanais', 'Quinzenais'], obrigatoria: true },
          { id: 152, tipo: 'radio', pergunta: 'Mudanças durante obra:', opcoes: ['Aceita', 'Evita'], obrigatoria: true },
          { id: 153, tipo: 'radio', pergunta: 'Gestão de fornecedores:', opcoes: ['Arquiteto', 'Compartilhada'], obrigatoria: true }
        ]
      },
      {
        id: 'aspectos-legais',
        nome: '📋 Aspectos Legais e Financeiros',
        descricao: 'Documentação e aprovações, aspectos financeiros',
        icon: '📋',
        obrigatoria: true,
        perguntas: [
          { id: 154, tipo: 'radio', pergunta: 'Documentação do terreno:', opcoes: ['Completa', 'Pendente'], obrigatoria: true },
          { id: 155, tipo: 'radio', pergunta: 'Aprovação na prefeitura:', opcoes: ['Necessária', 'Dispensada'], obrigatoria: true },
          { id: 156, tipo: 'radio', pergunta: 'Aprovação no corpo de bombeiros:', opcoes: ['Necessária', 'Dispensada'], obrigatoria: true },
          { id: 157, tipo: 'radio', pergunta: 'Responsabilidade pelas aprovações:', opcoes: ['Arquiteto', 'Cliente'], obrigatoria: true },
          { id: 158, tipo: 'radio', pergunta: 'Prazo para aprovações:', opcoes: ['Normal', 'Flexível'], obrigatoria: true },
          { id: 159, tipo: 'radio', pergunta: 'Averbação na matrícula:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 160, tipo: 'radio', pergunta: 'Forma de pagamento dos projetos:', opcoes: ['À vista', 'Por etapas'], obrigatoria: true },
          { id: 161, tipo: 'radio', pergunta: 'Forma de pagamento da obra:', opcoes: ['Financiado', 'Por etapas'], obrigatoria: true },
          { id: 162, tipo: 'radio', pergunta: 'Reserva para imprevistos:', opcoes: ['10%', '15%', 'Não tem'], obrigatoria: true },
          { id: 163, tipo: 'radio', pergunta: 'Seguro da obra:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 164, tipo: 'radio', pergunta: 'Garantia pós-obra:', opcoes: ['1 ano', '2 anos'], obrigatoria: true },
          { id: 165, tipo: 'radio', pergunta: 'Medição da obra:', opcoes: ['Mensal', 'Por etapas'], obrigatoria: true }
        ]
      },
      {
        id: 'questoes-medio',
        nome: '💎 Questões Específicas Padrão Médio',
        descricao: 'Otimização de custos e funcionalidade/praticidade',
        icon: '💎',
        obrigatoria: true,
        perguntas: [
          { id: 166, tipo: 'radio', pergunta: 'Prioridade para economia:', opcoes: ['Estrutura', 'Acabamentos', 'Instalações'], obrigatoria: true },
          { id: 167, tipo: 'radio', pergunta: 'Aceita soluções padronizadas para reduzir custos?', opcoes: ['Sim', 'Não', 'Algumas'], obrigatoria: true },
          { id: 168, tipo: 'radio', pergunta: 'Flexibilidade para substituição de materiais?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 169, tipo: 'radio', pergunta: 'Interesse em execução por etapas?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 170, tipo: 'radio', pergunta: 'Prioridade para manutenção baixa?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 171, tipo: 'radio', pergunta: 'Ambientes multiuso são aceitos?', opcoes: ['Sim', 'Não', 'Alguns'], obrigatoria: true },
          { id: 172, tipo: 'radio', pergunta: 'Áreas comuns compartilhadas são prioridade?', opcoes: ['Sim', 'Não', 'Algumas'], obrigatoria: true },
          { id: 173, tipo: 'radio', pergunta: 'Facilidade de limpeza é importante?', opcoes: ['Muito', 'Moderadamente'], obrigatoria: true },
          { id: 174, tipo: 'radio', pergunta: 'Ampliação futura é possível?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 175, tipo: 'radio', pergunta: 'Revenda é uma consideração?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true }
        ]
      }
    ]
  },

  // CONDOMÍNIO ALTO PADRÃO
  'residencial-condominio-alto_padrao': {
    id: 'residencial-condominio-alto_padrao',
    tipologia: 'residencial',
    subtipo: 'condominio',
    padrao: 'alto_padrao',
    nome: 'Condomínio Alto Padrão',
    descricao: 'Briefing premium para condomínios de alto padrão, focado em exclusividade e sofisticação',
    totalPerguntas: 230,
    tempoEstimado: '45-60 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['condominio', 'alto', 'premium', 'exclusivo', 'sofisticado'],
      categoria: 'premium',
      complexidade: 'alta',
      publico: ['arquitetos', 'incorporadoras', 'construtoras', 'investidores']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🎯 Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica e sustentabilidade/certificações',
        icon: '🎯',
        obrigatoria: true,
        perguntas: [
          { id: 1, tipo: 'radio', pergunta: 'Que tipo de condomínio deseja?', opcoes: ['Horizontal', 'Vertical', 'Misto'], obrigatoria: true },
          { id: 2, tipo: 'valor', pergunta: 'Qual o investimento total disponível? (Incluindo terreno + infraestrutura + edificações)', obrigatoria: true, placeholder: 'R$ 15.000.000', formatacao: 'moeda' },
          { id: 3, tipo: 'radio', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento', 'Incorporação'], obrigatoria: true },
          { id: 4, tipo: 'radio', pergunta: 'Há reserva para contingência?', opcoes: ['Sim, 15-20%', 'Sim, 10-15%', 'Sim, menos de 10%', 'Não'], obrigatoria: true },
          { id: 5, tipo: 'radio', pergunta: 'Qual a prioridade?', opcoes: ['Exclusividade', 'Prazo', 'Qualidade', 'Rentabilidade'], obrigatoria: true },
          { id: 6, tipo: 'radio', pergunta: 'Situação legal do terreno:', opcoes: ['Escritura', 'Matrícula', 'Documentação completa'], obrigatoria: true },
          { id: 7, tipo: 'radio', pergunta: 'Terreno possui restrições ambientais?', opcoes: ['APP', 'Reserva legal', 'Árvores protegidas', 'Não'], obrigatoria: true },
          { id: 8, tipo: 'radio', pergunta: 'Há estudos geotécnicos?', opcoes: ['Sondagem', 'Análise do solo', 'Não'], obrigatoria: true },
          { id: 9, tipo: 'checkbox', pergunta: 'Infraestrutura disponível:', opcoes: ['Água', 'Esgoto', 'Energia', 'Gás', 'Internet fibra'], obrigatoria: true },
          { id: 10, tipo: 'radio', pergunta: 'Zoneamento conhecido?', opcoes: ['Zona/Taxa ocupação/Gabarito/Recuos', 'Parcialmente', 'Não'], obrigatoria: true },
          { id: 11, tipo: 'radio', pergunta: 'Há projetos aprovados anteriormente no terreno?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 12, tipo: 'radio', pergunta: 'Necessita demolição de construções existentes?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 13, tipo: 'radio', pergunta: 'Acesso de veículos pesados para obra é viável?', opcoes: ['Sim', 'Com restrições', 'Problemático'], obrigatoria: true },
          { id: 14, tipo: 'radio', pergunta: 'Há restrições de horário para obra na região?', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 15, tipo: 'radio', pergunta: 'Vizinhança pode impor limitações?', opcoes: ['Residencial', 'Comercial', 'Industrial', 'Não'], obrigatoria: true },
          { id: 16, tipo: 'radio', pergunta: 'Interesse em certificação sustentável?', opcoes: ['LEED', 'AQUA', 'Casa Azul', 'Não'], obrigatoria: true },
          { id: 17, tipo: 'radio', pergunta: 'Prioridade para eficiência energética?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 18, tipo: 'radio', pergunta: 'Sistemas de energia renovável?', opcoes: ['Solar', 'Eólica', 'Biomassa', 'Não'], obrigatoria: true },
          { id: 19, tipo: 'radio', pergunta: 'Reuso de água?', opcoes: ['Cisterna', 'Tratamento', 'Sistema completo', 'Não'], obrigatoria: true },
          { id: 20, tipo: 'radio', pergunta: 'Materiais sustentáveis são prioridade?', opcoes: ['Sim', 'Não', 'Indiferente'], obrigatoria: true },
          { id: 21, tipo: 'radio', pergunta: 'Ventilação natural é importante?', opcoes: ['Prioridade alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 22, tipo: 'radio', pergunta: 'Iluminação natural é prioridade?', opcoes: ['Máxima', 'Equilibrada', 'Controlada'], obrigatoria: true },
          { id: 23, tipo: 'radio', pergunta: 'Paisagismo nativo é desejado?', opcoes: ['Sim', 'Não', 'Indiferente'], obrigatoria: true },
          { id: 24, tipo: 'radio', pergunta: 'Compostagem comunitária?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 25, tipo: 'radio', pergunta: 'Horta comunitária?', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true }
        ]
      },
      {
        id: 'perfil-publico',
        nome: '👥 Perfil do Público-Alvo',
        descricao: 'Composição dos moradores e estilo de vida',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          { id: 26, tipo: 'radio', pergunta: 'Perfil socioeconômico dos compradores:', opcoes: ['A', 'B+', 'B'], obrigatoria: true },
          { id: 27, tipo: 'radio', pergunta: 'Faixa etária predominante:', opcoes: ['Jovens', 'Famílias', 'Idosos', 'Misto'], obrigatoria: true },
          { id: 28, tipo: 'radio', pergunta: 'Tamanho médio das famílias:', opcoes: ['1-2 pessoas', '3-4 pessoas', '5+ pessoas'], obrigatoria: true },
          { id: 29, tipo: 'radio', pergunta: 'Presença de crianças:', opcoes: ['Muitas', 'Algumas', 'Poucas'], obrigatoria: true },
          { id: 30, tipo: 'radio', pergunta: 'Presença de idosos:', opcoes: ['Muitos', 'Alguns', 'Poucos'], obrigatoria: true },
          { id: 31, tipo: 'radio', pergunta: 'Perfil profissional:', opcoes: ['Executivos', 'Profissionais liberais', 'Empresários'], obrigatoria: true },
          { id: 32, tipo: 'radio', pergunta: 'Funcionários por unidade:', opcoes: ['Diários', 'Diaristas', 'Mensalistas', 'Não'], obrigatoria: true },
          { id: 33, tipo: 'radio', pergunta: 'Animais de estimação:', opcoes: ['Permitidos', 'Restritos', 'Não permitidos'], obrigatoria: true },
          { id: 34, tipo: 'radio', pergunta: 'Estilo de vida predominante:', opcoes: ['Formal', 'Casual', 'Misto'], obrigatoria: true },
          { id: 35, tipo: 'radio', pergunta: 'Frequência de entretenimento:', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 36, tipo: 'radio', pergunta: 'Tipo de entretenimento preferido:', opcoes: ['Íntimo', 'Grandes grupos', 'Misto'], obrigatoria: true },
          { id: 37, tipo: 'radio', pergunta: 'Atividades físicas praticadas:', opcoes: ['Individuais', 'Coletivas', 'Ambas'], obrigatoria: true },
          { id: 38, tipo: 'radio', pergunta: 'Hobbies predominantes:', opcoes: ['Culturais', 'Esportivos', 'Sociais'], obrigatoria: true },
          { id: 39, tipo: 'radio', pergunta: 'Trabalho remoto:', opcoes: ['Frequente', 'Ocasional', 'Raro'], obrigatoria: true },
          { id: 40, tipo: 'radio', pergunta: 'Uso de áreas comuns:', opcoes: ['Intenso', 'Moderado', 'Baixo'], obrigatoria: true },
          { id: 41, tipo: 'radio', pergunta: 'Preferência por privacidade:', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 42, tipo: 'radio', pergunta: 'Interação entre vizinhos:', opcoes: ['Intensa', 'Moderada', 'Mínima'], obrigatoria: true },
          { id: 43, tipo: 'radio', pergunta: 'Rotina de trabalho típica:', opcoes: ['Horário comercial', 'Flexível', 'Misto'], obrigatoria: true },
          { id: 44, tipo: 'radio', pergunta: 'Tempo de permanência no condomínio:', opcoes: ['Integral', 'Parcial'], obrigatoria: true },
          { id: 45, tipo: 'radio', pergunta: 'Necessidades especiais de acessibilidade:', opcoes: ['Muitas', 'Algumas', 'Poucas'], obrigatoria: true }
        ]
      },
      {
        id: 'analise-terreno',
        nome: '🏞️ Análise Técnica do Terreno',
        descricao: 'Características físicas, entorno e contexto, restrições legais',
        icon: '🏞️',
        obrigatoria: true,
        perguntas: [
          { id: 46, tipo: 'text', pergunta: 'Endereço completo do terreno:', obrigatoria: true },
          { id: 47, tipo: 'text', pergunta: 'Dimensões exatas: (Frente x Fundo x Laterais)', obrigatoria: true },
          { id: 48, tipo: 'number', pergunta: 'Área total do terreno (m²):', obrigatoria: true },
          { id: 49, tipo: 'radio', pergunta: 'Formato do terreno:', opcoes: ['Regular', 'Irregular', 'Esquina', 'Meio de quadra'], obrigatoria: true },
          { id: 50, tipo: 'radio', pergunta: 'Topografia detalhada:', opcoes: ['Plano', 'Aclive', 'Declive', 'Percentual'], obrigatoria: true },
          { id: 51, tipo: 'radio', pergunta: 'Orientação solar da frente do terreno:', opcoes: ['Norte', 'Sul', 'Leste', 'Oeste'], obrigatoria: true },
          { id: 52, tipo: 'number', pergunta: 'Há desnível entre terreno e rua? (Metros)', obrigatoria: true },
          { id: 53, tipo: 'radio', pergunta: 'Solo aparente:', opcoes: ['Argiloso', 'Arenoso', 'Rochoso', 'Misto'], obrigatoria: true },
          { id: 54, tipo: 'radio', pergunta: 'Drenagem natural:', opcoes: ['Boa', 'Regular', 'Problemática'], obrigatoria: true },
          { id: 55, tipo: 'radio', pergunta: 'Vegetação existente:', opcoes: ['Árvores', 'Arbustos', 'Gramado', 'Nenhuma'], obrigatoria: true },
          { id: 56, tipo: 'radio', pergunta: 'Vizinhança - construções existentes:', opcoes: ['Casas', 'Prédios', 'Misto', 'Vazio'], obrigatoria: true },
          { id: 57, tipo: 'radio', pergunta: 'Gabarito predominante na região:', opcoes: ['Térreo', '2 pav', '3+ pav', 'Misto'], obrigatoria: true },
          { id: 58, tipo: 'radio', pergunta: 'Padrão construtivo da região:', opcoes: ['Alto', 'Médio', 'Simples', 'Misto'], obrigatoria: true },
          { id: 59, tipo: 'radio', pergunta: 'Nível de ruído:', opcoes: ['Silencioso', 'Moderado', 'Ruidoso'], obrigatoria: true },
          { id: 60, tipo: 'radio', pergunta: 'Movimento de veículos:', opcoes: ['Intenso', 'Moderado', 'Baixo'], obrigatoria: true },
          { id: 61, tipo: 'radio', pergunta: 'Segurança da região:', opcoes: ['Excelente', 'Boa', 'Regular', 'Problemática'], obrigatoria: true },
          { id: 62, tipo: 'radio', pergunta: 'Vistas privilegiadas:', opcoes: ['Mar', 'Montanha', 'Verde', 'Urbana', 'Nenhuma'], obrigatoria: true },
          { id: 63, tipo: 'radio', pergunta: 'Privacidade visual:', opcoes: ['Total', 'Parcial', 'Limitada'], obrigatoria: true },
          { id: 64, tipo: 'radio', pergunta: 'Infraestrutura urbana:', opcoes: ['Completa', 'Parcial', 'Básica'], obrigatoria: true },
          { id: 65, tipo: 'checkbox', pergunta: 'Serviços próximos:', opcoes: ['Escola', 'Hospital', 'Shopping', 'Transporte'], obrigatoria: true },
          { id: 66, tipo: 'text', pergunta: 'Recuos mínimos obrigatórios: (Frontal/Laterais/Fundo)', obrigatoria: true },
          { id: 67, tipo: 'number', pergunta: 'Taxa de ocupação máxima permitida (%):', obrigatoria: true },
          { id: 68, tipo: 'number', pergunta: 'Coeficiente de aproveitamento máximo:', obrigatoria: true },
          { id: 69, tipo: 'text', pergunta: 'Gabarito máximo permitido: (Pavimentos/Metros)', obrigatoria: true },
          { id: 70, tipo: 'text', pergunta: 'Usos permitidos no zoneamento:', obrigatoria: true }
        ]
      },
      {
        id: 'programa-arquitetonico',
        nome: '🏠 Programa Arquitetônico Detalhado',
        descricao: 'Unidades residenciais, áreas comuns sociais, lazer e técnicas/serviços',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          { id: 71, tipo: 'number', pergunta: 'Número total de unidades:', obrigatoria: true },
          { id: 72, tipo: 'text', pergunta: 'Tipologias diferentes: (Quantas e quais)', obrigatoria: true },
          { id: 73, tipo: 'number', pergunta: 'Área média por unidade (m²):', obrigatoria: true },
          { id: 74, tipo: 'radio', pergunta: 'Número de quartos por unidade:', opcoes: ['1', '2', '3', '4+'], obrigatoria: true },
          { id: 75, tipo: 'radio', pergunta: 'Número de suítes por unidade:', opcoes: ['1', '2', '3', '4+'], obrigatoria: true },
          { id: 76, tipo: 'radio', pergunta: 'Vagas de garagem por unidade:', opcoes: ['1', '2', '3', '4+'], obrigatoria: true },
          { id: 77, tipo: 'radio', pergunta: 'Depósito privativo por unidade?', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 78, tipo: 'radio', pergunta: 'Varanda/Terraço privativo?', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 79, tipo: 'radio', pergunta: 'Churrasqueira privativa?', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 80, tipo: 'radio', pergunta: 'Piscina privativa?', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 81, tipo: 'radio', pergunta: 'Elevador privativo?', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 82, tipo: 'radio', pergunta: 'Entrada de serviço separada?', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 83, tipo: 'radio', pergunta: 'Portaria/Recepção:', opcoes: ['24h', 'Diurna', 'Não'], obrigatoria: true },
          { id: 84, tipo: 'radio', pergunta: 'Salão de festas:', opcoes: ['Grande', 'Médio', 'Pequeno', 'Não'], obrigatoria: true },
          { id: 85, tipo: 'radio', pergunta: 'Espaço gourmet:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 86, tipo: 'radio', pergunta: 'Sala de jogos:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 87, tipo: 'radio', pergunta: 'Brinquedoteca:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 88, tipo: 'radio', pergunta: 'Cinema:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 89, tipo: 'radio', pergunta: 'Coworking:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 90, tipo: 'radio', pergunta: 'Biblioteca:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 91, tipo: 'radio', pergunta: 'Sala de reuniões:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 92, tipo: 'radio', pergunta: 'Pet place:', opcoes: ['Sim', 'Não', 'Opcional'], obrigatoria: true },
          { id: 93, tipo: 'radio', pergunta: 'Piscina:', opcoes: ['Adulto', 'Infantil', 'Raia', 'Não'], obrigatoria: true },
          { id: 94, tipo: 'radio', pergunta: 'Academia:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 95, tipo: 'radio', pergunta: 'Quadra esportiva:', opcoes: ['Poliesportiva', 'Tênis', 'Não'], obrigatoria: true },
          { id: 96, tipo: 'radio', pergunta: 'Playground:', opcoes: ['Completo', 'Básico', 'Não'], obrigatoria: true },
          { id: 97, tipo: 'radio', pergunta: 'Spa/Sauna:', opcoes: ['Seca', 'Úmida', 'Não'], obrigatoria: true },
          { id: 98, tipo: 'radio', pergunta: 'Espaço zen/Yoga:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 99, tipo: 'radio', pergunta: 'Pista de caminhada:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 100, tipo: 'radio', pergunta: 'Churrasqueira coletiva:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 101, tipo: 'radio', pergunta: 'Central de segurança:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 102, tipo: 'radio', pergunta: 'Depósito de lixo:', opcoes: ['Coletivo', 'Individual', 'Não'], obrigatoria: true },
          { id: 103, tipo: 'radio', pergunta: 'Casa de máquinas:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 104, tipo: 'radio', pergunta: 'Estacionamento para visitantes:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 105, tipo: 'radio', pergunta: 'Área para funcionários:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'areas-externas',
        nome: '🌳 Áreas Externas e Paisagismo',
        descricao: 'Áreas de lazer externas e paisagismo',
        icon: '🌳',
        obrigatoria: true,
        perguntas: [
          { id: 106, tipo: 'radio', pergunta: 'Praça central:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 107, tipo: 'radio', pergunta: 'Áreas de convivência:', opcoes: ['Múltiplas', 'Poucas', 'Não'], obrigatoria: true },
          { id: 108, tipo: 'radio', pergunta: 'Quiosques:', opcoes: ['Múltiplos', 'Poucos', 'Não'], obrigatoria: true },
          { id: 109, tipo: 'radio', pergunta: 'Deck molhado:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 110, tipo: 'radio', pergunta: 'Praia artificial:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 111, tipo: 'radio', pergunta: 'Lago ornamental:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 112, tipo: 'radio', pergunta: 'Área para pets:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 113, tipo: 'radio', pergunta: 'Playground natural:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 114, tipo: 'radio', pergunta: 'Redário:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 115, tipo: 'radio', pergunta: 'Mirante:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 116, tipo: 'radio', pergunta: 'Estilo de paisagismo:', opcoes: ['Formal', 'Natural', 'Tropical', 'Contemporâneo'], obrigatoria: true },
          { id: 117, tipo: 'radio', pergunta: 'Densidade de vegetação:', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
          { id: 118, tipo: 'radio', pergunta: 'Plantas preferidas:', opcoes: ['Nativas', 'Exóticas', 'Frutíferas', 'Ornamentais'], obrigatoria: true },
          { id: 119, tipo: 'radio', pergunta: 'Horta comunitária:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 120, tipo: 'radio', pergunta: 'Pomar:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 121, tipo: 'radio', pergunta: 'Área de compostagem:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 122, tipo: 'radio', pergunta: 'Irrigação automatizada:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 123, tipo: 'radio', pergunta: 'Iluminação paisagística:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 124, tipo: 'radio', pergunta: 'Espelhos d\'água/Fontes:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 125, tipo: 'radio', pergunta: 'Esculturas/Arte:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'sistemas-tecnologia',
        nome: '⚡ Sistemas Técnicos e Tecnologia',
        descricao: 'Sistemas prediais e automação/tecnologia',
        icon: '⚡',
        obrigatoria: true,
        perguntas: [
          { id: 126, tipo: 'radio', pergunta: 'Sistema elétrico:', opcoes: ['Subestação', 'Geradores', 'Convencional'], obrigatoria: true },
          { id: 127, tipo: 'radio', pergunta: 'Gerador de emergência:', opcoes: ['Total', 'Parcial', 'Não'], obrigatoria: true },
          { id: 128, tipo: 'radio', pergunta: 'Sistema hidráulico:', opcoes: ['Pressurizado', 'Convencional'], obrigatoria: true },
          { id: 129, tipo: 'radio', pergunta: 'Aquecimento de água:', opcoes: ['Central', 'Individual', 'Solar', 'Gás'], obrigatoria: true },
          { id: 130, tipo: 'radio', pergunta: 'Sistema de esgoto:', opcoes: ['Rede pública', 'Tratamento próprio'], obrigatoria: true },
          { id: 131, tipo: 'radio', pergunta: 'Água de reuso:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 132, tipo: 'radio', pergunta: 'Sistema de gás:', opcoes: ['Central', 'Individual'], obrigatoria: true },
          { id: 133, tipo: 'radio', pergunta: 'Ar condicionado central:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 134, tipo: 'radio', pergunta: 'Ventilação mecânica:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 135, tipo: 'radio', pergunta: 'Sistema de exaustão:', opcoes: ['Completo', 'Básico', 'Não'], obrigatoria: true },
          { id: 136, tipo: 'radio', pergunta: 'Coleta seletiva:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 137, tipo: 'radio', pergunta: 'Sistema de filtragem de água:', opcoes: ['Completo', 'Básico', 'Não'], obrigatoria: true },
          { id: 138, tipo: 'radio', pergunta: 'Interfone/Porteiro eletrônico:', opcoes: ['Vídeo', 'Áudio', 'Não'], obrigatoria: true },
          { id: 139, tipo: 'radio', pergunta: 'CFTV:', opcoes: ['Completo', 'Básico', 'Não'], obrigatoria: true },
          { id: 140, tipo: 'radio', pergunta: 'Alarme perimetral:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 141, tipo: 'radio', pergunta: 'Automação predial:', opcoes: ['Completa', 'Parcial', 'Básica', 'Não'], obrigatoria: true },
          { id: 142, tipo: 'radio', pergunta: 'Controle de iluminação:', opcoes: ['Cênico', 'Dimmer', 'Convencional'], obrigatoria: true },
          { id: 143, tipo: 'radio', pergunta: 'Controle de acesso:', opcoes: ['Biometria', 'Facial', 'Cartão', 'Convencional'], obrigatoria: true },
          { id: 144, tipo: 'radio', pergunta: 'Sistema de som ambiente:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 145, tipo: 'radio', pergunta: 'Wi-Fi nas áreas comuns:', opcoes: ['Completo', 'Parcial', 'Não'], obrigatoria: true },
          { id: 146, tipo: 'radio', pergunta: 'Rede estruturada:', opcoes: ['Completa', 'Básica', 'Não'], obrigatoria: true },
          { id: 147, tipo: 'radio', pergunta: 'Sistema de segurança integrado:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 148, tipo: 'radio', pergunta: 'Monitoramento remoto:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 149, tipo: 'radio', pergunta: 'App do condomínio:', opcoes: ['Completo', 'Básico', 'Não'], obrigatoria: true },
          { id: 150, tipo: 'radio', pergunta: 'Sensores de presença:', opcoes: ['Todos ambientes', 'Principais', 'Não'], obrigatoria: true },
          { id: 151, tipo: 'radio', pergunta: 'Controle de temperatura:', opcoes: ['Automático', 'Manual'], obrigatoria: true },
          { id: 152, tipo: 'radio', pergunta: 'Sistema de irrigação inteligente:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 153, tipo: 'radio', pergunta: 'Carregador para carro elétrico:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 154, tipo: 'radio', pergunta: 'Portões automatizados:', opcoes: ['Sim', 'Não'], obrigatoria: true },
          { id: 155, tipo: 'radio', pergunta: 'Elevadores inteligentes:', opcoes: ['Sim', 'Não'], obrigatoria: true }
        ]
      },
      {
        id: 'estetica-design',
        nome: '🎨 Estética e Design',
        descricao: 'Estilo arquitetônico e design de interiores das áreas comuns',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          { id: 156, tipo: 'radio', pergunta: 'Estilo arquitetônico preferido:', opcoes: ['Contemporâneo', 'Clássico', 'Rústico', 'Minimalista', 'Eclético'], obrigatoria: true },
          { id: 157, tipo: 'text', pergunta: 'Referências visuais: (Anexar fotos/links de projetos admirados)', obrigatoria: false },
          { id: 158, tipo: 'radio', pergunta: 'Fachada:', opcoes: ['Moderna', 'Tradicional', 'Mista'], obrigatoria: true },
          { id: 159, tipo: 'radio', pergunta: 'Materiais de fachada preferidos:', opcoes: ['Concreto', 'Madeira', 'Pedra', 'Vidro', 'Cerâmica'], obrigatoria: true },
          { id: 160, tipo: 'radio', pergunta: 'Cores predominantes:', opcoes: ['Neutras', 'Terrosas', 'Vibrantes', 'Monocromática'], obrigatoria: true },
          { id: 161, tipo: 'radio', pergunta: 'Cobertura:', opcoes: ['Laje', 'Telha cerâmica', 'Telha metálica', 'Mista'], obrigatoria: true },
          { id: 162, tipo: 'radio', pergunta: 'Esquadrias:', opcoes: ['Alumínio', 'Madeira', 'PVC', 'Mista'], obrigatoria: true },
          { id: 163, tipo: 'radio', pergunta: 'Vidros:', opcoes: ['Transparente', 'Fumê', 'Reflexivo', 'Laminado'], obrigatoria: true },
          { id: 164, tipo: 'radio', pergunta: 'Elementos decorativos:', opcoes: ['Mínimos', 'Moderados', 'Abundantes'], obrigatoria: true },
          { id: 165, tipo: 'radio', pergunta: 'Integração interior/exterior:', opcoes: ['Máxima', 'Moderada', 'Mínima'], obrigatoria: true },
          { id: 166, tipo: 'radio', pergunta: 'Estilo de interiores:', opcoes: ['Moderno', 'Clássico', 'Rústico', 'Industrial', 'Escandinavo'], obrigatoria: true },
          { id: 167, tipo: 'radio', pergunta: 'Paleta de cores internas:', opcoes: ['Neutras', 'Quentes', 'Frias', 'Vibrantes'], obrigatoria: true },
          { id: 168, tipo: 'radio', pergunta: 'Pisos:', opcoes: ['Porcelanato', 'Madeira', 'Mármore', 'Misto'], obrigatoria: true },
          { id: 169, tipo: 'radio', pergunta: 'Revestimentos:', opcoes: ['Mínimos', 'Moderados', 'Abundantes'], obrigatoria: true },
          { id: 170, tipo: 'radio', pergunta: 'Iluminação:', opcoes: ['Direta', 'Indireta', 'Mista'], obrigatoria: true },
          { id: 171, tipo: 'radio', pergunta: 'Móveis:', opcoes: ['Planejados', 'Soltos', 'Misto'], obrigatoria: true },
          { id: 172, tipo: 'radio', pergunta: 'Estilo dos móveis:', opcoes: ['Contemporâneo', 'Clássico', 'Rústico', 'Industrial'], obrigatoria: true },
          { id: 173, tipo: 'radio', pergunta: 'Obras de arte:', opcoes: ['Muitas', 'Algumas', 'Poucas', 'Nenhuma'], obrigatoria: true },
          { id: 174, tipo: 'radio', pergunta: 'Plantas internas:', opcoes: ['Muitas', 'Algumas', 'Poucas', 'Nenhuma'], obrigatoria: true },
          { id: 175, tipo: 'radio', pergunta: 'Tecidos e texturas:', opcoes: ['Abundantes', 'Moderados', 'Mínimos'], obrigatoria: true },
          { id: 176, tipo: 'radio', pergunta: 'Metais:', opcoes: ['Dourado', 'Prateado', 'Preto', 'Misto'], obrigatoria: true },
          { id: 177, tipo: 'radio', pergunta: 'Acabamentos:', opcoes: ['Foscos', 'Brilhantes', 'Misto'], obrigatoria: true },
          { id: 178, tipo: 'radio', pergunta: 'Espelhos:', opcoes: ['Muitos', 'Alguns', 'Poucos', 'Nenhum'], obrigatoria: true },
          { id: 179, tipo: 'radio', pergunta: 'Tapetes:', opcoes: ['Grandes', 'Pequenos', 'Nenhum'], obrigatoria: true },
          { id: 180, tipo: 'radio', pergunta: 'Acessórios decorativos:', opcoes: ['Muitos', 'Alguns', 'Poucos', 'Nenhum'], obrigatoria: true }
        ]
      },
      {
        id: 'aspectos-tecnicos',
        nome: '🔧 Aspectos Técnicos Especializados',
        descricao: 'Estrutura e fundação, conforto ambiental',
        icon: '🔧',
        obrigatoria: true,
        perguntas: [
          { id: 181, tipo: 'radio', pergunta: 'Preferência estrutural:', opcoes: ['Concreto armado', 'Aço', 'Madeira', 'Mista', 'Indiferente'], obrigatoria: true },
          { id: 182, tipo: 'radio', pergunta: 'Fundação:', opcoes: ['Sapata', 'Radier', 'Estaca', 'Conforme projeto'], obrigatoria: true },
          { id: 183, tipo: 'radio', pergunta: 'Laje:', opcoes: ['Maciça', 'Nervurada', 'Steel deck', 'Conforme projeto'], obrigatoria: true },
          { id: 184, tipo: 'radio', pergunta: 'Vãos livres desejados:', opcoes: ['Grandes', 'Médios', 'Convencionais'], obrigatoria: true },
          { id: 185, tipo: 'radio', pergunta: 'Pé-direito:', opcoes: ['Alto 3m+', 'Padrão 2,7m', 'Baixo 2,5m'], obrigatoria: true },
          { id: 186, tipo: 'radio', pergunta: 'Mezanino:', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 187, tipo: 'radio', pergunta: 'Estrutura aparente:', opcoes: ['Sim', 'Não', 'Talvez'], obrigatoria: true },
          { id: 188, tipo: 'radio', pergunta: 'Proteção sísmica:', opcoes: ['Sim', 'Não', 'Indiferente'], obrigatoria: true },
          { id: 189, tipo: 'radio', pergunta: 'Isolamento térmico:', opcoes: ['Máximo', 'Moderado', 'Padrão'], obrigatoria: true },
          { id: 190, tipo: 'radio', pergunta: 'Isolamento acústico:', opcoes: ['Máximo', 'Moderado', 'Padrão'], obrigatoria: true },
          { id: 191, tipo: 'radio', pergunta: 'Ventilação cruzada:', opcoes: ['Prioridade', 'Desejável', 'Indiferente'], obrigatoria: true },
          { id: 192, tipo: 'radio', pergunta: 'Proteção solar:', opcoes: ['Brises', 'Beirais', 'Vegetação', 'Mista'], obrigatoria: true },
          { id: 193, tipo: 'radio', pergunta: 'Aproveitamento de chuva:', opcoes: ['Cisterna', 'Jardim de chuva', 'Não'], obrigatoria: true },
          { id: 194, tipo: 'radio', pergunta: 'Microclima:', opcoes: ['Criar', 'Aproveitar', 'Indiferente'], obrigatoria: true },
          { id: 195, tipo: 'radio', pergunta: 'Umidade:', opcoes: ['Controle rigoroso', 'Moderado', 'Padrão'], obrigatoria: true },
          { id: 196, tipo: 'radio', pergunta: 'Qualidade do ar:', opcoes: ['Filtros', 'Plantas', 'Ventilação', 'Misto'], obrigatoria: true },
          { id: 197, tipo: 'radio', pergunta: 'Iluminação natural:', opcoes: ['Máxima', 'Controlada', 'Mínima'], obrigatoria: true },
          { id: 198, tipo: 'radio', pergunta: 'Ofuscamento:', opcoes: ['Evitar totalmente', 'Controlar', 'Indiferente'], obrigatoria: true },
          { id: 199, tipo: 'radio', pergunta: 'Privacidade acústica:', opcoes: ['Máxima', 'Moderada', 'Padrão'], obrigatoria: true },
          { id: 200, tipo: 'radio', pergunta: 'Zoneamento térmico:', opcoes: ['Por ambiente', 'Por setor', 'Geral'], obrigatoria: true }
        ]
      },
      {
        id: 'cronograma-gestao',
        nome: '📅 Cronograma e Gestão',
        descricao: 'Prazos e gestão/comunicação',
        icon: '📅',
        obrigatoria: true,
        perguntas: [
          { id: 201, tipo: 'date', pergunta: 'Início desejado dos projetos:', obrigatoria: true },
          { id: 202, tipo: 'date', pergunta: 'Prazo para aprovação dos projetos:', obrigatoria: true },
          { id: 203, tipo: 'date', pergunta: 'Início desejado da obra:', obrigatoria: true },
          { id: 204, tipo: 'date', pergunta: 'Prazo desejado para conclusão da obra:', obrigatoria: true },
          { id: 205, tipo: 'text', pergunta: 'Há alguma data limite inflexível? (Lançamento/Entrega/Outro)', obrigatoria: false },
          { id: 206, tipo: 'radio', pergunta: 'Flexibilidade de prazos:', opcoes: ['Nenhuma', 'Pequena', 'Moderada', 'Total'], obrigatoria: true },
          { id: 207, tipo: 'radio', pergunta: 'Prioridade:', opcoes: ['Prazo', 'Qualidade', 'Custo'], obrigatoria: true },
          { id: 208, tipo: 'radio', pergunta: 'Etapas de entrega:', opcoes: ['Única', 'Por fases', 'Conforme cronograma'], obrigatoria: true },
          { id: 209, tipo: 'radio', pergunta: 'Frequência de reuniões desejada:', opcoes: ['Semanal', 'Quinzenal', 'Mensal'], obrigatoria: true },
          { id: 210, tipo: 'radio', pergunta: 'Forma de comunicação preferida:', opcoes: ['Presencial', 'WhatsApp', 'E-mail', 'App'], obrigatoria: true },
          { id: 211, tipo: 'radio', pergunta: 'Relatórios de obra:', opcoes: ['Diários', 'Semanais', 'Quinzenais', 'Mensais'], obrigatoria: true },
          { id: 212, tipo: 'radio', pergunta: 'Visitas à obra:', opcoes: ['Diárias', 'Semanais', 'Quinzenais', 'Mensais'], obrigatoria: true },
          { id: 213, tipo: 'radio', pergunta: 'Tomada de decisões:', opcoes: ['Conjunta', 'Individual', 'Delegada'], obrigatoria: true },
          { id: 214, tipo: 'radio', pergunta: 'Mudanças durante obra:', opcoes: ['Aceita', 'Evita', 'Proíbe'], obrigatoria: true },
          { id: 215, tipo: 'radio', pergunta: 'Gestão de fornecedores:', opcoes: ['Arquiteto', 'Cliente', 'Compartilhada'], obrigatoria: true }
        ]
      },
      {
        id: 'aspectos-legais',
        nome: '📋 Aspectos Legais e Financeiros',
        descricao: 'Documentação e aprovações, aspectos financeiros',
        icon: '📋',
        obrigatoria: true,
        perguntas: [
          { id: 216, tipo: 'radio', pergunta: 'Documentação do terreno:', opcoes: ['Completa', 'Pendente', 'Desconhece'], obrigatoria: true },
          { id: 217, tipo: 'radio', pergunta: 'Aprovação na prefeitura:', opcoes: ['Necessária', 'Dispensada', 'Desconhece'], obrigatoria: true },
          { id: 218, tipo: 'radio', pergunta: 'Aprovação no corpo de bombeiros:', opcoes: ['Necessária', 'Dispensada', 'Desconhece'], obrigatoria: true },
          { id: 219, tipo: 'radio', pergunta: 'Licença ambiental:', opcoes: ['Necessária', 'Dispensada', 'Desconhece'], obrigatoria: true },
          { id: 220, tipo: 'radio', pergunta: 'Averbação na matrícula:', opcoes: ['Sim', 'Não', 'Desconhece'], obrigatoria: true },
          { id: 221, tipo: 'radio', pergunta: 'Habite-se:', opcoes: ['Necessário', 'Dispensado', 'Desconhece'], obrigatoria: true },
          { id: 222, tipo: 'radio', pergunta: 'Responsabilidade pelas aprovações:', opcoes: ['Arquiteto', 'Cliente', 'Compartilhada'], obrigatoria: true },
          { id: 223, tipo: 'radio', pergunta: 'Prazo para aprovações:', opcoes: ['Urgente', 'Normal', 'Flexível'], obrigatoria: true },
          { id: 224, tipo: 'radio', pergunta: 'Forma de pagamento dos projetos:', opcoes: ['À vista', 'Parcelado', 'Por etapas'], obrigatoria: true },
          { id: 225, tipo: 'radio', pergunta: 'Forma de pagamento da obra:', opcoes: ['À vista', 'Financiado', 'Por etapas'], obrigatoria: true },
          { id: 226, tipo: 'radio', pergunta: 'Reserva para imprevistos:', opcoes: ['10%', '15%', '20%', 'Não tem'], obrigatoria: true },
          { id: 227, tipo: 'radio', pergunta: 'Seguro da obra:', opcoes: ['Sim', 'Não', 'Desconhece'], obrigatoria: true },
          { id: 228, tipo: 'radio', pergunta: 'Garantia pós-obra:', opcoes: ['1 ano', '2 anos', '5 anos', 'Não exige'], obrigatoria: true },
          { id: 229, tipo: 'radio', pergunta: 'Reajuste de valores:', opcoes: ['INCC', 'IGP-M', 'Fixo', 'Negociável'], obrigatoria: true },
          { id: 230, tipo: 'radio', pergunta: 'Medição da obra:', opcoes: ['Mensal', 'Por etapas', 'Por conclusão'], obrigatoria: true }
        ]
      }
    ]
  }
};

// Função auxiliar para obter briefings residenciais
export function obterBriefingsResidenciais() {
  return Object.values(BRIEFINGS_RESIDENCIAL);
}

// Função para obter briefing específico residencial
export function obterBriefingResidencial(subtipo: string, padrao: string) {
  const chave = `residencial-${subtipo}-${padrao}`;
  return BRIEFINGS_RESIDENCIAL[chave] || null;
} 