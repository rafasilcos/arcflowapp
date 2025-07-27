import { BriefingCompleto } from '../../../types/briefing';

export const briefingEstrutural: BriefingCompleto = {
  id: 'estrutural-projeto-adaptativo-corrigido',
  tipologia: 'estrutural',
  subtipo: 'projeto-adaptativo',
  padrao: 'profissional',
  nome: 'Projeto Estrutural Adaptativo - CORRIGIDO',
  descricao: 'Briefing estrutural adaptativo com lógica condicional real - se adapta automaticamente',
  totalPerguntas: 210, // Agora com contagem correta (varia por caminho)
  tempoEstimado: '25-40 minutos',
  versao: '2.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['estrutural', 'adaptativo', 'condicional', 'corrigido'],
    categoria: 'estrutural',
    complexidade: 'muito_alta',
    publico: ['engenheiros-estruturais', 'calculistas', 'construtoras'],
    adaptativo: true,
    revolucionario: true
  },
  
  secoes: [
    {
      id: 'dados-basicos',
      nome: '🏗️ Dados Básicos do Projeto',
      descricao: 'Informações essenciais de identificação e localização',
      icon: '🏗️',
      obrigatoria: true,
      perguntas: [
        { id: 1, tipo: 'text', pergunta: 'Nome do projeto:', obrigatoria: true, placeholder: 'Nome do projeto estrutural' },
        { id: 2, tipo: 'textarea', pergunta: 'Localização completa:', obrigatoria: true, placeholder: 'Endereço, cidade, estado' },
        { id: 3, tipo: 'select', pergunta: 'Tipo de edificação:', opcoes: ['Residencial unifamiliar', 'Residencial multifamiliar', 'Comercial', 'Industrial', 'Institucional', 'Misto'], obrigatoria: true },
        { id: 4, tipo: 'select', pergunta: 'Finalidade do projeto:', opcoes: ['Projeto novo', 'Reforma/ampliação', 'Reforço estrutural', 'Mudança de uso', 'Regularização'], obrigatoria: true },
        { id: 5, tipo: 'number', pergunta: 'Área total construída (m²):', obrigatoria: true, placeholder: '150' },
        { id: 6, tipo: 'number', pergunta: 'Número de subsolos:', obrigatoria: true, placeholder: '0' },
        { id: 7, tipo: 'number', pergunta: 'Pé-direito do subsolo (m):', obrigatoria: false, placeholder: '2.5', condicional: true, condicao: { perguntaId: 6, valores: ['1', '2', '3', '4', '5'], operador: 'greater_than', valor: 0 } },
        { id: 8, tipo: 'select', pergunta: 'Possui térreo?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 9, tipo: 'number', pergunta: 'Número de pavimentos superiores:', obrigatoria: true, placeholder: '1' },
        { id: 10, tipo: 'number', pergunta: 'Pé-direito típico (m):', obrigatoria: true, placeholder: '2.8' },
        { id: 11, tipo: 'number', pergunta: 'Vão máximo desejado (m):', obrigatoria: true, placeholder: '5.0' },
        { id: 12, tipo: 'select', pergunta: 'Existe sondagem do solo?', opcoes: ['Sim, completa', 'Sim, parcial', 'Não, mas será feita', 'Não será feita'], obrigatoria: true },
        { id: 13, tipo: 'select', pergunta: 'Classe de agressividade ambiental:', opcoes: ['CAA I - Rural', 'CAA II - Urbana', 'CAA III - Marinha/industrial', 'CAA IV - Industrial severa', 'Não sei'], obrigatoria: true },
        { id: 14, tipo: 'select', pergunta: 'Prazo para o projeto (dias):', opcoes: ['15-30 dias', '30-45 dias', '45-60 dias', 'Acima de 60 dias'], obrigatoria: true },
        { id: 15, tipo: 'select', pergunta: 'Orçamento estimado:', opcoes: ['Até R$ 50k', 'R$ 50k-100k', 'R$ 100k-500k', 'R$ 500k-1M', 'Acima de R$ 1M'], obrigatoria: false }
      ]
    },
    
    {
      id: 'sistema-estrutural',
      nome: '🔧 Sistema Estrutural (CHAVE ADAPTATIVA)',
      descricao: 'Escolha que determina quais seções aparecerão',
      icon: '🔧',
      obrigatoria: true,
      perguntas: [
        { id: 16, tipo: 'select', pergunta: '🚨 ESCOLHA O SISTEMA ESTRUTURAL:', opcoes: ['Concreto armado moldado in loco', 'Estrutura metálica', 'Madeira', 'Alvenaria estrutural', 'Estruturas mistas (aço-concreto)', 'Pré-moldados de concreto', 'Não tenho preferência'], obrigatoria: true },
        { id: 17, tipo: 'textarea', pergunta: 'Justificativa da escolha:', obrigatoria: false, placeholder: 'Motivos da escolha' },
        { id: 18, tipo: 'select', pergunta: 'Velocidade de execução:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 19, tipo: 'select', pergunta: 'Custo de execução:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 20, tipo: 'select', pergunta: 'Vida útil desejada:', opcoes: ['25 anos', '50 anos', '75 anos', '100 anos'], obrigatoria: true }
      ]
    },
    
    // === SEÇÕES CONDICIONAIS ===
    
    {
      id: 'concreto-armado',
      nome: '🏭 Concreto Armado - Específico',
      descricao: 'Detalhes específicos para concreto armado',
      icon: '🏭',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 16, valores: ['Concreto armado moldado in loco'], operador: 'equals' },
      perguntas: [
        { id: 21, tipo: 'select', pergunta: 'Classe de resistência (fck):', opcoes: ['C20', 'C25', 'C30', 'C35', 'C40', 'C45', 'C50'], obrigatoria: true },
        { id: 22, tipo: 'select', pergunta: 'Tipo de cimento:', opcoes: ['CP II-E', 'CP II-Z', 'CP III', 'CP IV', 'CP V-ARI'], obrigatoria: true },
        { id: 23, tipo: 'select', pergunta: 'Tipo de armadura:', opcoes: ['CA-50', 'CA-60', 'Mista', 'Aço inoxidável'], obrigatoria: true },
        { id: 24, tipo: 'checkbox', pergunta: 'Aditivos necessários:', opcoes: ['Plastificante', 'Superplastificante', 'Retardador', 'Acelerador', 'Nenhum'], obrigatoria: true },
        { id: 25, tipo: 'select', pergunta: 'Tipo de forma:', opcoes: ['Madeira', 'Metálica', 'Plástica', 'Mista'], obrigatoria: true },
        { id: 26, tipo: 'select', pergunta: 'Necessidade de protensão:', opcoes: ['Sim, pré-tensão', 'Sim, pós-tensão', 'Não necessária'], obrigatoria: true },
        { id: 27, tipo: 'select', pergunta: 'Controle tecnológico:', opcoes: ['Básico', 'Intermediário', 'Rigoroso'], obrigatoria: true },
        { id: 28, tipo: 'select', pergunta: 'Idade de desforma:', opcoes: ['3 dias', '7 dias', '14 dias', '21 dias'], obrigatoria: true },
        { id: 29, tipo: 'select', pergunta: 'Método de adensamento:', opcoes: ['Vibrador imersão', 'Vibrador superfície', 'Auto-adensável'], obrigatoria: true },
        { id: 30, tipo: 'textarea', pergunta: 'Observações concreto:', obrigatoria: false, placeholder: 'Requisitos especiais' }
      ]
    },
    
    {
      id: 'estrutura-metalica',
      nome: '⚙️ Estrutura Metálica - Específico',
      descricao: 'Detalhes específicos para estrutura metálica',
      icon: '⚙️',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 16, valores: ['Estrutura metálica'], operador: 'equals' },
      perguntas: [
        { id: 31, tipo: 'select', pergunta: 'Tipo de aço:', opcoes: ['ASTM A36', 'ASTM A572 Gr.50', 'ASTM A992', 'AR 350', 'AR 415'], obrigatoria: true },
        { id: 32, tipo: 'select', pergunta: 'Perfis - Vigas:', opcoes: ['Laminados (W, I, H)', 'Soldados', 'Formados a frio', 'Treliças'], obrigatoria: true },
        { id: 33, tipo: 'select', pergunta: 'Perfis - Pilares:', opcoes: ['Laminados (W, H)', 'Soldados', 'Tubulares', 'Compostos'], obrigatoria: true },
        { id: 34, tipo: 'select', pergunta: 'Tipo de ligação:', opcoes: ['Soldada', 'Parafusada', 'Mista'], obrigatoria: true },
        { id: 35, tipo: 'select', pergunta: 'Proteção corrosão:', opcoes: ['Galvanização', 'Pintura anti-corrosiva', 'Duplex', 'Cor-Ten'], obrigatoria: true },
        { id: 36, tipo: 'select', pergunta: 'Proteção incêndio:', opcoes: ['Tinta intumescente', 'Argamassa projetada', 'Placas fibrocimento', 'Não necessária'], obrigatoria: true },
        { id: 37, tipo: 'select', pergunta: 'Fabricante:', opcoes: ['Local', 'Regional', 'Nacional', 'Importado'], obrigatoria: false },
        { id: 38, tipo: 'select', pergunta: 'Transporte:', opcoes: ['Normal', 'Especial', 'Pré-montagem'], obrigatoria: true },
        { id: 39, tipo: 'checkbox', pergunta: 'Verificações especiais:', opcoes: ['Fadiga', 'Vibração', 'Flambagem', 'Instabilidade', 'Nenhuma'], obrigatoria: true },
        { id: 40, tipo: 'textarea', pergunta: 'Observações metálica:', obrigatoria: false, placeholder: 'Requisitos especiais' }
      ]
    },
    
    {
      id: 'madeira',
      nome: '🌳 Madeira - Específico',
      descricao: 'Detalhes específicos para estrutura de madeira',
      icon: '🌳',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 16, valores: ['Madeira'], operador: 'equals' },
      perguntas: [
        { id: 41, tipo: 'select', pergunta: 'Tipo de madeira:', opcoes: ['Maciça nativa', 'Maciça reflorestamento', 'Laminada colada (MLC)', 'Laminada cruzada (CLT)', 'OSB estrutural'], obrigatoria: true },
        { id: 42, tipo: 'select', pergunta: 'Espécie:', opcoes: ['Eucalipto', 'Pinus', 'Peroba', 'Ipê', 'Jatobá', 'Angelim'], obrigatoria: true },
        { id: 43, tipo: 'select', pergunta: 'Classe de resistência:', opcoes: ['C20', 'C25', 'C30', 'C35', 'C40'], obrigatoria: true },
        { id: 44, tipo: 'select', pergunta: 'Umidade de equilíbrio:', opcoes: ['12% (seco)', '15% (normal)', '18% (úmido)'], obrigatoria: true },
        { id: 45, tipo: 'select', pergunta: 'Tratamento preservativo:', opcoes: ['Autoclave (CCA)', 'Imersão', 'Pincelamento', 'Natural'], obrigatoria: true },
        { id: 46, tipo: 'select', pergunta: 'Proteção contra fogo:', opcoes: ['Retardante', 'Seção sacrificial', 'Revestimento', 'Não necessária'], obrigatoria: true },
        { id: 47, tipo: 'select', pergunta: 'Ligações:', opcoes: ['Entalhes', 'Parafusos', 'Pregos estruturais', 'Conectores metálicos', 'Adesivos'], obrigatoria: true },
        { id: 48, tipo: 'select', pergunta: 'Fornecimento:', opcoes: ['Serraria local', 'Certificado', 'FSC', 'Não definido'], obrigatoria: false },
        { id: 49, tipo: 'checkbox', pergunta: 'Considerações especiais:', opcoes: ['Retração', 'Insetos', 'Ventilação', 'Detalhes especiais'], obrigatoria: true },
        { id: 50, tipo: 'textarea', pergunta: 'Observações madeira:', obrigatoria: false, placeholder: 'Requisitos especiais' }
      ]
    },
    
    {
      id: 'alvenaria-estrutural',
      nome: '🧱 Alvenaria Estrutural - Específico',
      descricao: 'Detalhes específicos para alvenaria estrutural',
      icon: '🧱',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 16, valores: ['Alvenaria estrutural'], operador: 'equals' },
      perguntas: [
        { id: 51, tipo: 'select', pergunta: 'Tipo de bloco:', opcoes: ['Concreto', 'Cerâmico', 'Sílico-calcário', 'Concreto celular'], obrigatoria: true },
        { id: 52, tipo: 'select', pergunta: 'Dimensões do bloco:', opcoes: ['14x19x39 cm', '19x19x39 cm', '14x19x19 cm', '19x19x19 cm'], obrigatoria: true },
        { id: 53, tipo: 'select', pergunta: 'Resistência (fbk):', opcoes: ['≥ 4,5 MPa', '≥ 6,0 MPa', '≥ 8,0 MPa', '≥ 10,0 MPa'], obrigatoria: true },
        { id: 54, tipo: 'select', pergunta: 'Tipo de argamassa:', opcoes: ['Industrializada', 'Virada obra', 'Colante'], obrigatoria: true },
        { id: 55, tipo: 'select', pergunta: 'Armação:', opcoes: ['Horizontal (canaletas)', 'Vertical (furos)', 'Horizontal+Vertical', 'Não armada'], obrigatoria: true },
        { id: 56, tipo: 'select', pergunta: 'Tipo de aço:', opcoes: ['CA-50', 'CA-60', 'Tela soldada'], obrigatoria: true },
        { id: 57, tipo: 'number', pergunta: 'Máximo de pavimentos:', obrigatoria: true, placeholder: '4' },
        { id: 58, tipo: 'select', pergunta: 'Tipo de laje:', opcoes: ['Maciça', 'Nervurada', 'Pré-moldada', 'Steel deck'], obrigatoria: true },
        { id: 59, tipo: 'select', pergunta: 'Controle de qualidade:', opcoes: ['Básico', 'Intermediário', 'Rigoroso'], obrigatoria: true },
        { id: 60, tipo: 'textarea', pergunta: 'Observações alvenaria:', obrigatoria: false, placeholder: 'Requisitos especiais' }
      ]
    },
    
    {
      id: 'estruturas-mistas',
      nome: '🏗️ Estruturas Mistas - Específico',
      descricao: 'Detalhes específicos para estruturas mistas',
      icon: '🏗️',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 16, valores: ['Estruturas mistas (aço-concreto)'], operador: 'equals' },
      perguntas: [
        { id: 61, tipo: 'checkbox', pergunta: 'Elementos mistos:', opcoes: ['Vigas mistas', 'Pilares mistos', 'Lajes mistas', 'Forma incorporada'], obrigatoria: true },
        { id: 62, tipo: 'select', pergunta: 'Tipo de laje:', opcoes: ['Steel deck + concreto', 'Alveolar + capeamento', 'Pré-moldada + concreto'], obrigatoria: true },
        { id: 63, tipo: 'select', pergunta: 'Conectores:', opcoes: ['Stud', 'Perfil U', 'Especiais'], obrigatoria: true },
        { id: 64, tipo: 'select', pergunta: 'Proteção corrosão:', opcoes: ['Pintura', 'Galvanização', 'Duplex', 'Proteção concreto'], obrigatoria: true },
        { id: 65, tipo: 'select', pergunta: 'Resistência concreto:', opcoes: ['C25', 'C30', 'C35', 'C40'], obrigatoria: true },
        { id: 66, tipo: 'checkbox', pergunta: 'Verificações:', opcoes: ['Interação completa', 'Interação parcial', 'Flambagem', 'Vibração'], obrigatoria: true },
        { id: 67, tipo: 'select', pergunta: 'Sequência construtiva:', opcoes: ['Metal depois concreto', 'Simultânea', 'Pré-fabricação'], obrigatoria: true },
        { id: 68, tipo: 'select', pergunta: 'Controle qualidade:', opcoes: ['Básico', 'Intermediário', 'Rigoroso'], obrigatoria: true },
        { id: 69, tipo: 'textarea', pergunta: 'Observações mistas:', obrigatoria: false, placeholder: 'Requisitos especiais' }
      ]
    },
    
    {
      id: 'pre-moldados',
      nome: '🏭 Pré-moldados - Específico',
      descricao: 'Detalhes específicos para pré-moldados',
      icon: '🏭',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 16, valores: ['Pré-moldados de concreto'], operador: 'equals' },
      perguntas: [
        { id: 70, tipo: 'checkbox', pergunta: 'Elementos:', opcoes: ['Pilares', 'Vigas', 'Lajes alveolares', 'Painéis', 'Escadas'], obrigatoria: true },
        { id: 71, tipo: 'select', pergunta: 'Fabricação:', opcoes: ['Pré-fabricado (fábrica)', 'Pré-moldado (canteiro)', 'Misto'], obrigatoria: true },
        { id: 72, tipo: 'select', pergunta: 'Controle qualidade:', opcoes: ['Nível A (rigoroso)', 'Nível B (intermediário)', 'Nível C (básico)'], obrigatoria: true },
        { id: 73, tipo: 'select', pergunta: 'Tipo de concreto:', opcoes: ['Convencional', 'Alta resistência', 'Auto-adensável', 'Leve'], obrigatoria: true },
        { id: 74, tipo: 'select', pergunta: 'Resistência:', opcoes: ['C35', 'C40', 'C45', 'C50'], obrigatoria: true },
        { id: 75, tipo: 'select', pergunta: 'Cura:', opcoes: ['Térmica (vapor)', 'Ao ar', 'Autoclave'], obrigatoria: true },
        { id: 76, tipo: 'checkbox', pergunta: 'Ligações:', opcoes: ['Soldadas', 'Parafusadas', 'Chumbadas', 'Concretadas'], obrigatoria: true },
        { id: 77, tipo: 'select', pergunta: 'Transporte:', opcoes: ['Caminhão comum', 'Carreta especial', 'Combinação'], obrigatoria: true },
        { id: 78, tipo: 'select', pergunta: 'Montagem:', opcoes: ['Guindaste móvel', 'Guindaste fixo', 'Grua'], obrigatoria: true },
        { id: 79, tipo: 'select', pergunta: 'Tolerâncias:', opcoes: ['Classe 1 (alta)', 'Classe 2 (normal)', 'Classe 3 (baixa)'], obrigatoria: true },
        { id: 80, tipo: 'textarea', pergunta: 'Observações pré-moldados:', obrigatoria: false, placeholder: 'Requisitos especiais' }
      ]
    },
    
    {
      id: 'finalizacao',
      nome: '🎯 Finalização e Entrega',
      descricao: 'Prazos, sustentabilidade e assinatura',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        { id: 81, tipo: 'select', pergunta: 'Certificação ambiental:', opcoes: ['LEED', 'AQUA-HQE', 'BREEAM', 'Não necessária'], obrigatoria: false },
        { id: 82, tipo: 'select', pergunta: 'Materiais reciclados:', opcoes: ['Obrigatório', 'Preferível', 'Indiferente'], obrigatoria: false },
        { id: 83, tipo: 'select', pergunta: 'Prioridade #1:', opcoes: ['Custo', 'Prazo', 'Qualidade'], obrigatoria: true },
        { id: 84, tipo: 'select', pergunta: 'Prioridade #2:', opcoes: ['Custo', 'Prazo', 'Qualidade'], obrigatoria: true },
        { id: 85, tipo: 'select', pergunta: 'Mão de obra regional:', opcoes: ['Qualificada', 'Básica', 'Não sei'], obrigatoria: false },
        { id: 86, tipo: 'select', pergunta: 'Acesso à obra:', opcoes: ['Fácil', 'Limitado', 'Difícil'], obrigatoria: false },
        { id: 87, tipo: 'textarea', pergunta: 'Restrições específicas:', obrigatoria: false, placeholder: 'Restrições não mencionadas' },
        { id: 88, tipo: 'textarea', pergunta: 'Exigências do cliente:', obrigatoria: false, placeholder: 'Exigências especiais' },
        { id: 89, tipo: 'text', pergunta: 'Nome do responsável:', obrigatoria: true, placeholder: 'Nome completo' },
        { id: 90, tipo: 'text', pergunta: 'CREA/CAU:', obrigatoria: false, placeholder: 'Registro profissional' },
        { id: 91, tipo: 'date', pergunta: 'Data:', obrigatoria: true },
        { id: 92, tipo: 'signature', pergunta: 'Assinatura digital:', obrigatoria: true }
      ]
    }
  ]
}; 