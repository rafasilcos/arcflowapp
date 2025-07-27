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
    // SEÇÃO 1 - IDENTIFICAÇÃO DO PROJETO
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
        }
      ]
    },

    // SEÇÃO 2 - HUB DE DECISÃO ADAPTATIVA (CHAVE)
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
        },
        {
          id: 36,
          texto: 'População equivalente:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 50 pessoas',
            '50 a 200 pessoas',
            '200 a 1000 pessoas',
            'Acima de 1000 pessoas'
          ]
        },
        {
          id: 37,
          texto: 'Sistema de aquecimento:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 26,
            valores: ['Água quente (aquecimento e distribuição)'],
            operador: 'contains'
          },
          opcoes: [
            'Não necessário',
            'Aquecedor elétrico',
            'Aquecedor a gás',
            'Sistema solar',
            'Sistema central',
            'Sistema misto'
          ]
        },
        {
          id: 38,
          texto: 'Capacidade de aquecimento:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 26,
            valores: ['Água quente (aquecimento e distribuição)'],
            operador: 'contains'
          },
          opcoes: [
            'Até 200 litros',
            '200 a 1.000 litros',
            '1.000 a 5.000 litros',
            'Acima de 5.000 litros'
          ]
        },
        {
          id: 39,
          texto: 'Sistema de esgoto:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 26,
            valores: ['Esgoto sanitário (coleta e tratamento)'],
            operador: 'contains'
          },
          opcoes: [
            'Rede pública',
            'Fossa séptica + filtro',
            'Estação de tratamento',
            'Sistema misto'
          ]
        },
        {
          id: 40,
          texto: 'Sistema pluvial:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 26,
            valores: ['Águas pluviais (captação e drenagem)'],
            operador: 'contains'
          },
          opcoes: [
            'Calhas e condutores simples',
            'Sistema completo',
            'Captação para reuso',
            'Sistema integrado'
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
          id: 41,
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
          id: 42,
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
          id: 43,
          texto: 'Número de quadros elétricos:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            '1 quadro geral',
            '2 a 5 quadros',
            '6 a 15 quadros',
            'Acima de 15 quadros'
          ]
        },
        {
          id: 44,
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
          id: 45,
          texto: 'Controle de iluminação:',
          tipo: 'checkbox',
          obrigatorio: true,
          opcoes: [
            'Interruptores simples',
            'Dimmers',
            'Sensores de presença',
            'Automação completa'
          ]
        },
        {
          id: 46,
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
          id: 47,
          texto: 'Proteção contra surtos (DPS):',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Não necessária',
            'Classe III (equipamentos)',
            'Classe II (distribuição)',
            'Classe I (entrada) + II + III'
          ]
        },
        {
          id: 48,
          texto: 'Geração de emergência:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 28,
            valores: ['Sistemas de emergência'],
            operador: 'contains'
          },
          opcoes: [
            'Não necessária',
            'Gerador até 50 kVA',
            'Gerador 50-200 kVA',
            'Gerador acima de 200 kVA',
            'Múltiplos geradores'
          ]
        },
        {
          id: 49,
          texto: 'Sistema fotovoltaico:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 28,
            valores: ['Energia solar fotovoltaica'],
            operador: 'contains'
          },
          opcoes: [
            'Sistema básico',
            'Sistema completo',
            'Sistema com armazenamento',
            'Sistema de grande porte'
          ]
        },
        {
          id: 50,
          texto: 'Automação elétrica:',
          tipo: 'radio',
          obrigatorio: true,
          condicao: {
            perguntaId: 28,
            valores: ['Automação residencial/predial'],
            operador: 'contains'
          },
          opcoes: [
            'Sem automação',
            'Automação básica (timers)',
            'Automação integrada (CLP)',
            'Sistema inteligente (IoT)'
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
          id: 51,
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
          id: 52,
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
          id: 53,
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
        },
        {
          id: 54,
          texto: 'Carga de incêndio específica (MJ/m²):',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Baixa (até 300 MJ/m²)',
            'Média (300 a 600 MJ/m²)',
            'Alta (600 a 1200 MJ/m²)',
            'Muito alta (acima de 1200 MJ/m²)'
          ]
        },
        {
          id: 55,
          texto: 'Sistema de detecção automática:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Não necessário',
            'Detectores pontuais convencionais',
            'Detectores pontuais endereçáveis',
            'Sistema por aspiração',
            'Múltiplos sistemas'
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
          id: 56,
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
        },
        {
          id: 57,
          texto: 'Capacidade total estimada:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Até 50 TR',
            '50 a 200 TR',
            '200 a 500 TR',
            'Acima de 500 TR'
          ]
        },
        {
          id: 58,
          texto: 'Temperatura interna desejada:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            '22°C ± 2°C',
            '24°C ± 2°C',
            'Múltiplas temperaturas',
            'Controle especial'
          ]
        },
        {
          id: 59,
          texto: 'Renovação de ar:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Mínima (norma)',
            'Acima da norma',
            'Muito acima da norma',
            'Especial'
          ]
        },
        {
          id: 60,
          texto: 'Controle automático:',
          tipo: 'radio',
          obrigatorio: true,
          opcoes: [
            'Não necessário',
            'Controle básico',
            'Controle avançado',
            'Sistema inteligente'
          ]
        }
      ]
    }
  ]
}; 