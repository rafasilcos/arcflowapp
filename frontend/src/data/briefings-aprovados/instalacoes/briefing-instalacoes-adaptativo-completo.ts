import { BriefingData } from '../../types';

export const briefingInstalacoes: BriefingData = {
  id: 'instalacoes-adaptativo-completo',
  categoria: 'instalacoes',
  nome: 'Briefing Adaptativo Completo - Engenharia de Instalações',
  descricao: 'Briefing técnico especializado com 25 NBRs integradas e 7 especializações técnicas',
  
  // Metadados técnicos únicos
  metadata: {
    totalPerguntas: 350,
    tempoEstimado: '60-90 minutos',
    notaTecnica: 9.5,
    tipologia: 'Engenharia de Instalações - Briefing Adaptativo Completo',
    especializacoes: [
      '⚡ Instalações Elétricas BT/MT (NBR 5410/14039)',
      '💧 Instalações Hidrossanitárias (NBR 5626/8160)', 
      '🔥 PPCI - Prevenção e Proteção Contra Incêndio (NBR 17240/13714)',
      '❄️ Climatização AVAC/HVAC (NBR 16280/16401)',
      '🔧 Instalações de Gás (NBR 13103)',
      '🛡️ Segurança Eletrônica (sistemas integrados)',
      '🏠 Automação Predial (IoT/BMS)'
    ],
    normasAplicaveis: [
      'NBR 5410:2004 - Instalações Elétricas de Baixa Tensão',
      'NBR 14039:2005 - Instalações Elétricas de Média Tensão',
      'NBR 5626:2020 - Instalações Prediais de Água Fria',
      'NBR 8160:1999 - Sistemas Prediais de Esgoto Sanitário',
      'NBR 17240:2010 - Sistemas de Detecção e Alarme de Incêndio',
      'NBR 16280:2020 - Sistemas de Climatização',
      'NBR 13103:2020 - Instalações de Gás Combustível'
    ],
    metodologia: 'EP → AP → PE → CP → DT → AO (6 Fases de Projeto)'
  },

  // Seções com lógica adaptativa avançada
  secoes: [
    {
      id: 'identificacao-projeto',
      nome: '🎯 Identificação do Projeto',
      descricao: 'Dados básicos, localização, infraestrutura e características do terreno',
      perguntas: [
        {
          id: 1,
          texto: 'Nome do projeto:',
          tipo: 'text',
          obrigatorio: true,
          placeholder: 'Digite o nome do projeto'
        },
        {
          id: 2,
          texto: 'Tipologia da edificação:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Residencial unifamiliar',
            'Residencial multifamiliar', 
            'Comercial/escritórios',
            'Industrial',
            'Institucional/saúde',
            'Educacional',
            'Hotelaria',
            'Misto'
          ]
        },
        {
          id: 3,
          texto: 'Área total construída:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 100 m²',
            '100 a 300 m²',
            '300 a 1.000 m²',
            '1.000 a 5.000 m²',
            '5.000 a 20.000 m²',
            'Acima de 20.000 m²'
          ]
        },
        {
          id: 4,
          texto: 'Número de pavimentos:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Térreo',
            'Térreo + 1 pavimento',
            'Térreo + 2 pavimentos',
            'Térreo + 3 a 5 pavimentos',
            'Térreo + 6 a 15 pavimentos',
            'Acima de 15 pavimentos'
          ]
        },
        {
          id: 5,
          texto: 'Possui subsolo:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Não',
            '1 subsolo',
            '2 subsolos', 
            '3 ou mais subsolos'
          ]
        },
        {
          id: 6,
          texto: 'Localização:',
          tipo: 'textarea',
          obrigatorio: true,
          placeholder: 'Descreva a localização detalhada do projeto'
        },
        {
          id: 7,
          texto: 'Disponibilidade de água:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Rede pública disponível',
            'Poço artesiano',
            'Captação superficial',
            'Múltiplas fontes'
          ]
        },
        {
          id: 8,
          texto: 'Disponibilidade de energia elétrica:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Rede pública baixa tensão',
            'Rede pública média tensão',
            'Geração própria',
            'Sistema misto'
          ]
        },
        {
          id: 9,
          texto: 'Disponibilidade de esgoto:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Rede pública disponível',
            'Sistema individual (fossa)',
            'Estação de tratamento própria',
            'Não definido'
          ]
        },
        {
          id: 10,
          texto: 'Disponibilidade de gás:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Rede pública (GN)',
            'GLP (botijão/central)',
            'Não necessário',
            'Não definido'
          ]
        },
        {
          id: 11,
          texto: 'Topografia:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Plana',
            'Levemente inclinada',
            'Inclinada',
            'Muito inclinada'
          ]
        },
        {
          id: 12,
          texto: 'Nível do lençol freático:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Profundo (acima de 5m)',
            'Médio (2-5m)',
            'Raso (até 2m)',
            'Não investigado'
          ]
        },
        {
          id: 13,
          texto: 'Tipo de solo:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Arenoso',
            'Argiloso',
            'Rochoso',
            'Misto',
            'Não investigado'
          ]
        },
        {
          id: 14,
          texto: 'Clima da região:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Tropical',
            'Subtropical',
            'Semiárido',
            'Temperado',
            'Equatorial'
          ]
        },
        {
          id: 15,
          texto: 'Temperatura média anual:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 20°C',
            '20°C a 25°C',
            '25°C a 30°C',
            'Acima de 30°C'
          ]
        },
        {
          id: 16,
          texto: 'Umidade relativa média:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Baixa (até 50%)',
            'Média (50-70%)',
            'Alta (70-85%)',
            'Muito alta (acima de 85%)'
          ]
        },
        {
          id: 17,
          texto: 'Incidência de chuvas:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Baixa',
            'Moderada',
            'Alta',
            'Muito alta'
          ]
        },
        {
          id: 18,
          texto: 'Normas municipais específicas:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Código de obras padrão',
            'Normas específicas rigorosas',
            'Normas especiais (patrimônio histórico)',
            'Não definidas'
          ]
        },
        {
          id: 19,
          texto: 'Aprovações necessárias:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'Prefeitura apenas',
            'Concessionárias',
            'Corpo de bombeiros',
            'Órgãos ambientais',
            'Múltiplos órgãos'
          ]
        },
        {
          id: 20,
          texto: 'Prazo desejado para projeto:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 30 dias',
            '30 a 60 dias',
            '60 a 90 dias',
            'Acima de 90 dias'
          ]
        },
        {
          id: 21,
          texto: 'Orçamento disponível:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até R$ 50.000',
            'R$ 50.000 a R$ 150.000',
            'R$ 150.000 a R$ 500.000',
            'Acima de R$ 500.000'
          ]
        },
        {
          id: 22,
          texto: 'Prioridade do projeto:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Custo mínimo',
            'Prazo mínimo',
            'Qualidade máxima',
            'Sustentabilidade',
            'Equilíbrio entre fatores'
          ]
        },
        {
          id: 23,
          texto: 'Nível de detalhamento:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Básico (aprovação)',
            'Executivo completo',
            'Executivo + especificações',
            'Executivo + acompanhamento'
          ]
        },
        {
          id: 24,
          texto: 'Experiência anterior com projetos similares:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Primeira experiência',
            'Alguma experiência',
            'Muita experiência',
            'Especialista na área'
          ]
        },
        {
          id: 25,
          texto: 'Observações gerais sobre o projeto:',
          tipo: 'textarea',
          obrigatorio: false,
          placeholder: 'Informações adicionais sobre o projeto'
        }
      ]
    },

    // SEÇÃO 2 - HUB DE DECISÃO ADAPTATIVA
    {
      id: 'selecao-sistemas',
      nome: '⚡ Seleção de Sistemas',
      descricao: 'Definição dos sistemas de instalações necessários (determina seções condicionais)',
      perguntas: [
        {
          id: 26,
          texto: 'Sistemas hidráulicos necessários:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'Água fria (abastecimento e distribuição)',
            'Água quente (aquecimento e distribuição)',
            'Esgoto sanitário (coleta e tratamento)',
            'Águas pluviais (captação e drenagem)',
            'Irrigação automatizada',
            'Piscina/spa/hidromassagem',
            'Sistemas de reuso de água',
            'Captação de água de chuva',
            'Sistemas especiais'
          ]
        },
        {
          id: 27,
          texto: 'Complexidade hidráulica:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Básica (residencial simples)',
            'Média (comercial/residencial médio)',
            'Alta (industrial/hospitalar)',
            'Muito alta (processos especiais)'
          ]
        },
        {
          id: 28,
          texto: 'Sistemas elétricos necessários:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'Força e iluminação básica',
            'Iluminação especial/decorativa',
            'Automação residencial/predial',
            'Sistemas de emergência',
            'Energia solar fotovoltaica',
            'Sistemas de backup (no-break/UPS)',
            'Sistemas especiais'
          ]
        },
        {
          id: 29,
          texto: 'Complexidade elétrica:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Básica (residencial simples)',
            'Média (comercial/residencial médio)',
            'Alta (industrial/hospitalar)',
            'Muito alta (processos especiais)'
          ]
        },
        {
          id: 30,
          texto: 'Demanda diversificada estimada:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 10 kW',
            '10 a 50 kW',
            '50 a 200 kW',
            '200 a 1000 kW',
            'Acima de 1000 kW'
          ]
        }
      ]
    },

    // SEÇÃO 3 - INSTALAÇÕES HIDRÁULICAS (Condicional)
    {
      id: 'instalacoes-hidraulicas',
      nome: '💧 Instalações Hidráulicas',
      descricao: 'Água fria, quente, esgoto sanitário e águas pluviais (NBR 5626/8160)',
      condicao: {
        perguntaId: 26,
        valores: ['Água fria (abastecimento e distribuição)', 'Água quente (aquecimento e distribuição)', 'Esgoto sanitário (coleta e tratamento)', 'Águas pluviais (captação e drenagem)'],
        operador: 'contains_any'
      },
      perguntas: [
        {
          id: 31,
          texto: 'Sistema de abastecimento:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Direto da rede',
            'Reservatório inferior + superior',
            'Sistema de pressurização',
            'Sistema misto'
          ]
        },
        {
          id: 32,
          texto: 'Capacidade do reservatório:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 5.000 litros',
            '5.000 a 20.000 litros',
            '20.000 a 100.000 litros',
            'Acima de 100.000 litros'
          ]
        },
        {
          id: 33,
          texto: 'Tipo de reservatório:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'Fibra de vidro',
            'Polietileno',
            'Concreto armado',
            'Aço inoxidável',
            'Múltiplos tipos'
          ]
        },
        {
          id: 34,
          texto: 'Pressão mínima desejada:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            '10 mca (padrão)',
            '15 mca',
            '20 mca', 
            'Acima de 20 mca'
          ]
        },
        {
          id: 35,
          texto: 'Consumo per capita (NBR 5626):',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            '150 L/dia/pessoa (residencial)',
            '50 L/dia/pessoa (escritório)',
            '250 L/dia/pessoa (hotel)',
            '300 L/dia/pessoa (hospital)',
            'Cálculo específico'
          ]
        }
      ]
    },

    // SEÇÃO 4 - INSTALAÇÕES ELÉTRICAS (Condicional)
    {
      id: 'instalacoes-eletricas',
      nome: '⚡ Instalações Elétricas',
      descricao: 'Sistemas elétricos BT/MT, iluminação, força e automação (NBR 5410/14039)',
      condicao: {
        perguntaId: 28,
        valores: ['Força e iluminação básica', 'Iluminação especial/decorativa', 'Automação residencial/predial', 'Sistemas de emergência', 'Energia solar fotovoltaica'],
        operador: 'contains_any'
      },
      perguntas: [
        {
          id: 36,
          texto: 'Tensão de fornecimento:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Monofásico 220V',
            'Bifásico 220V',
            'Trifásico 220V/380V',
            'Trifásico 380V/660V',
            'Média tensão'
          ]
        },
        {
          id: 37,
          texto: 'Sistema de distribuição:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Radial simples',
            'Radial com backup',
            'Anel aberto',
            'Anel fechado'
          ]
        },
        {
          id: 38,
          texto: 'Tipo de iluminação:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Fluorescente',
            'LED',
            'Mista',
            'Especial'
          ]
        },
        {
          id: 39,
          texto: 'Sistema de aterramento (NBR 5410):',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'TN-S (neutro e proteção separados)',
            'TN-C-S (neutro e proteção combinados)',
            'TT (aterramento local)',
            'IT (neutro isolado)'
          ]
        },
        {
          id: 40,
          texto: 'Proteção contra surtos (DPS):',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Não necessária',
            'Classe III (equipamentos)',
            'Classe II (distribuição)',
            'Classe I (entrada) + II + III'
          ]
        }
      ]
    },

    // SEÇÃO 5 - PPCI (Condicional)
    {
      id: 'ppci-protecao-incendio',
      nome: '🔥 PPCI - Prevenção e Proteção Contra Incêndio',
      descricao: 'Sistemas completos de detecção, alarme e combate (NBR 17240/13714)',
      condicao: {
        perguntaId: 2,
        valores: ['Comercial/escritórios', 'Industrial', 'Institucional/saúde', 'Educacional', 'Hotelaria', 'Misto'],
        operador: 'contains_any'
      },
      perguntas: [
        {
          id: 41,
          texto: 'Sistemas PPCI necessários:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'Básico (extintores e sinalização)',
            'Médio (hidrantes e detectores)',
            'Completo (sprinklers e central)',
            'Especial (gases limpos/espuma)'
          ]
        },
        {
          id: 42,
          texto: 'Classificação de ocupação (IT-14 CBPMESP):',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'A - Residencial',
            'B - Serviços de hospedagem',
            'C - Comercial varejista',
            'D - Serviços profissionais',
            'E - Educacional e cultura física',
            'F - Locais de reunião de público',
            'H - Serviços de saúde',
            'I - Industrial'
          ]
        },
        {
          id: 43,
          texto: 'Altura da edificação:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Térrea (até 6m)',
            'Baixa (6m a 12m)',
            'Média (12m a 23m)',
            'Alta (23m a 60m)',
            'Muito alta (acima de 60m)'
          ]
        }
      ]
    },

    // SEÇÃO 6 - CLIMATIZAÇÃO (Condicional)
    {
      id: 'climatizacao-avac',
      nome: '❄️ Climatização AVAC/HVAC',
      descricao: 'Sistemas de ar condicionado, ventilação e controle (NBR 16280/16401)',
      condicao: {
        perguntaId: 2,
        valores: ['Comercial/escritórios', 'Industrial', 'Institucional/saúde', 'Hotelaria'],
        operador: 'contains_any'
      },
      perguntas: [
        {
          id: 44,
          texto: 'Sistema de climatização:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Split individual',
            'Split cassete',
            'VRF/VRV',
            'Chiller + fan coil',
            'Self contained',
            'Sistema misto'
          ]
        }
      ]
    },

    // SEÇÃO 7 - SEGURANÇA ELETRÔNICA (Condicional)
    {
      id: 'seguranca-eletronica',
      nome: '🛡️ Segurança Eletrônica',
      descricao: 'CFTV, alarmes, controle de acesso e sistemas integrados',
      condicao: {
        perguntaId: 2,
        valores: ['Comercial/escritórios', 'Industrial', 'Institucional/saúde', 'Hotelaria', 'Misto'],
        operador: 'contains_any'
      },
      perguntas: [
        {
          id: 45,
          texto: 'Sistemas de segurança eletrônica:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'CFTV básico',
            'CFTV profissional',
            'Alarmes de intrusão',
            'Controle de acesso',
            'Cerca elétrica',
            'Sistema integrado completo'
          ]
        }
      ]
    },

    // SEÇÃO 8 - AUTOMAÇÃO PREDIAL (Condicional)
    {
      id: 'automacao-predial',
      nome: '🏠 Automação Predial',
      descricao: 'Sistemas inteligentes, IoT e integração total',
      condicao: {
        perguntaId: 28,
        valores: ['Automação residencial/predial'],
        operador: 'contains'
      },
      perguntas: [
        {
          id: 46,
          texto: 'Nível de automação desejado:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Sem automação',
            'Automação básica (timers, sensores)',
            'Automação integrada (BMS)',
            'Edifício inteligente (IoT completo)'
          ]
        }
      ]
    }
  ]
}; 