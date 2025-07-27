import { SecaoBriefing } from '../../types';

// SEÇÃO 3 - INSTALAÇÕES HIDRÁULICAS (Condicional)
export const secaoHidraulicas: SecaoBriefing = {
  id: 'instalacoes-hidraulicas',
  nome: '💧 Instalações Hidráulicas',
  descricao: 'Água fria, quente, esgoto sanitário e águas pluviais (NBR 5626/8160)',
  condicao: {
    perguntaId: 26,
    valores: ['Água fria (abastecimento e distribuição)', 'Água quente (aquecimento e distribuição)', 'Esgoto sanitário (coleta e tratamento)', 'Águas pluviais (captação e drenagem)'],
    operador: 'contains_any'
  },
  perguntas: [
    // 3.1 Água Fria - Abastecimento
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
};

// SEÇÃO 4 - INSTALAÇÕES ELÉTRICAS (Condicional)
export const secaoEletricas: SecaoBriefing = {
  id: 'instalacoes-eletricas',
  nome: '⚡ Instalações Elétricas',
  descricao: 'Sistemas elétricos BT/MT, iluminação, força e automação (NBR 5410/14039)',
  condicao: {
    perguntaId: 28,
    valores: ['Força e iluminação básica', 'Iluminação especial/decorativa', 'Automação residencial/predial', 'Sistemas de emergência', 'Energia solar fotovoltaiva'],
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
      texto: 'Número de quadros:',
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
};

// SEÇÃO 5 - PPCI (Condicional - baseada em outras condições)
export const secaoPPCI: SecaoBriefing = {
  id: 'ppci-protecao-incendio',
  nome: '🔥 PPCI - Prevenção e Proteção Contra Incêndio',
  descricao: 'Sistemas completos de detecção, alarme e combate (NBR 17240/13714)',
  condicao: {
    perguntaId: 2, // Baseado na tipologia
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
        'G - Serviços automotivos',
        'H - Serviços de saúde',
        'I - Industrial',
        'J - Depósitos'
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
};

// SEÇÃO 6 - CLIMATIZAÇÃO (Condicional)
export const secaoClimatizacao: SecaoBriefing = {
  id: 'climatizacao-avac',
  nome: '❄️ Climatização AVAC/HVAC',
  descricao: 'Sistemas de ar condicionado, ventilação e controle (NBR 16280/16401)',
  condicao: {
    perguntaId: 2, // Baseado na tipologia que requer climatização
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
};

// Seções condicionais do briefing de instalações
export const secoesCondicionais = {
  // Seção aparece se sistemas hidráulicos foram selecionados
  hidraulicas: {
    condicao: { perguntaId: 26, valores: ['Água fria', 'Água quente'], operador: 'contains_any' },
    perguntas: [
      { id: 31, texto: 'Sistema de abastecimento:', tipo: 'radio' },
      { id: 32, texto: 'Capacidade do reservatório:', tipo: 'radio' },
      { id: 33, texto: 'Tipo de reservatório:', tipo: 'checkbox' }
    ]
  },
  
  // Seção aparece se sistemas elétricos foram selecionados  
  eletricas: {
    condicao: { perguntaId: 28, valores: ['Força e iluminação'], operador: 'contains' },
    perguntas: [
      { id: 41, texto: 'Tensão de fornecimento:', tipo: 'radio' },
      { id: 42, texto: 'Sistema de distribuição:', tipo: 'radio' },
      { id: 43, texto: 'Tipo de iluminação:', tipo: 'radio' }
    ]
  }
}; 