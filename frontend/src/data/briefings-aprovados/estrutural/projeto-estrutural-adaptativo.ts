import { BriefingCompleto } from '../../../types/briefing';

export const briefingEstrutural: BriefingCompleto = {
  id: 'estrutural-projeto-adaptativo-completo',
  tipologia: 'estrutural',
  subtipo: 'projeto-adaptativo',
  padrao: 'profissional',
  nome: 'Projeto Estrutural Adaptativo - COMPLETO',
  descricao: 'Briefing estrutural adaptativo completo com 210+ perguntas - padrão mundial',
  totalPerguntas: 210, // Briefing completo com todas as seções
  tempoEstimado: '35-50 minutos',
  versao: '3.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['estrutural', 'adaptativo', 'condicional', 'completo', 'profissional'],
    categoria: 'estrutural',
    complexidade: 'muito_alta',
    publico: ['engenheiros-estruturais', 'calculistas', 'construtoras'],
    adaptativo: true
  },
  
  secoes: [
    {
      id: 'dados-basicos',
      nome: '🏗️ Dados Gerais do Projeto',
      descricao: 'Informações completas para desenvolvimento do projeto estrutural',
      icon: '🏗️',
      obrigatoria: true,
      perguntas: [
        // === 1.1 IDENTIFICAÇÃO DO PROJETO ===
        { id: 1, tipo: 'text', pergunta: 'Nome do projeto:', obrigatoria: true, placeholder: 'Nome do projeto estrutural' },
        { id: 2, tipo: 'textarea', pergunta: 'Localização completa:', obrigatoria: true, placeholder: 'Endereço, cidade, estado' },
        { id: 3, tipo: 'text', pergunta: 'Coordenadas geográficas:', obrigatoria: false, placeholder: 'Latitude, Longitude (se disponível)' },
        { id: 4, tipo: 'select', pergunta: 'Tipo de edificação:', opcoes: ['Residencial unifamiliar', 'Residencial multifamiliar', 'Comercial', 'Industrial', 'Institucional', 'Misto'], obrigatoria: true },
        { id: 5, tipo: 'select', pergunta: 'Finalidade do projeto:', opcoes: ['Projeto novo', 'Reforma/ampliação', 'Reforço estrutural', 'Mudança de uso', 'Regularização'], obrigatoria: true },
        { id: 6, tipo: 'file', pergunta: 'Upload plantas arquitetônicas:', obrigatoria: false, placeholder: 'Plantas, croquis ou estudos disponíveis' },
        { id: 7, tipo: 'select', pergunta: 'Plantas arquitetônicas disponíveis:', opcoes: ['Estudo preliminar', 'Anteprojeto', 'Projeto executivo', 'Apenas croqui/ideia', 'Não disponível'], obrigatoria: true },
        
        // === 1.2 CARACTERÍSTICAS ARQUITETÔNICAS ===
        { id: 8, tipo: 'number', pergunta: 'Número de subsolos:', obrigatoria: true, placeholder: '0' },
        { id: 9, tipo: 'number', pergunta: 'Pé-direito do subsolo (m):', obrigatoria: false, placeholder: '2.5', dependeDe: { perguntaId: '8', valoresQueExibem: ['1', '2', '3', '4', '5'] } },
        { id: 10, tipo: 'select', pergunta: 'Possui térreo?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 11, tipo: 'number', pergunta: 'Número de pavimentos superiores:', obrigatoria: true, placeholder: '1' },
        { id: 12, tipo: 'select', pergunta: 'Tipo de cobertura:', opcoes: ['Laje', 'Telhado', 'Misto', 'Terraço jardim'], obrigatoria: true },
        { id: 13, tipo: 'number', pergunta: 'Área total construída (m²):', obrigatoria: true, placeholder: '150' },
        { id: 14, tipo: 'number', pergunta: 'Área de projeção em planta (m²):', obrigatoria: true, placeholder: '100' },
        { id: 15, tipo: 'number', pergunta: 'Pé-direito do térreo (m):', obrigatoria: true, placeholder: '2.8', dependeDe: { perguntaId: '10', valoresQueExibem: ['Sim'] } },
        { id: 16, tipo: 'number', pergunta: 'Pé-direito pavimentos tipo (m):', obrigatoria: true, placeholder: '2.8' },
        { id: 17, tipo: 'number', pergunta: 'Pé-direito da cobertura (m):', obrigatoria: false, placeholder: '2.8' },
        { id: 18, tipo: 'number', pergunta: 'Vão máximo desejado (m):', obrigatoria: true, placeholder: '5.0' },
        { id: 19, tipo: 'number', pergunta: 'Vão típico (m):', obrigatoria: true, placeholder: '4.0' },
        { id: 20, tipo: 'select', pergunta: 'Restrições para pilares:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 21, tipo: 'textarea', pergunta: 'Descreva restrições de pilares:', obrigatoria: false, placeholder: 'Locais onde não podem haver pilares', dependeDe: { perguntaId: '20', valoresQueExibem: ['Sim'] } },
        { id: 22, tipo: 'number', pergunta: 'Altura total da edificação (m):', obrigatoria: true, placeholder: '8.0' },
        
        // === 1.3 CARACTERÍSTICAS DO TERRENO ===
        { id: 23, tipo: 'number', pergunta: 'Área do terreno (m²):', obrigatoria: true, placeholder: '300' },
        { id: 24, tipo: 'select', pergunta: 'Topografia do terreno:', opcoes: ['Plano', 'Levemente inclinado (até 5%)', 'Inclinado (5% a 15%)', 'Muito inclinado (acima de 15%)', 'Irregular'], obrigatoria: true },
        { id: 25, tipo: 'number', pergunta: 'Desnível máximo (m):', obrigatoria: false, placeholder: '2.0' },
        { id: 26, tipo: 'select', pergunta: 'Levantamento topográfico:', opcoes: ['Sim', 'Não', 'Em andamento'], obrigatoria: true },
        { id: 27, tipo: 'select', pergunta: 'Características do solo:', opcoes: ['Argiloso', 'Arenoso', 'Rochoso', 'Misto', 'Não sei'], obrigatoria: true },
        { id: 28, tipo: 'select', pergunta: 'Existe sondagem do solo?', opcoes: ['Sim, completa', 'Sim, parcial', 'Não, mas será feita', 'Não será feita'], obrigatoria: true },
        { id: 29, tipo: 'file', pergunta: 'Upload relatório de sondagem:', obrigatoria: false, placeholder: 'Relatório SPT ou outro', dependeDe: { perguntaId: '28', valoresQueExibem: ['Sim, completa', 'Sim, parcial'] } },
        { id: 30, tipo: 'number', pergunta: 'Nível do lençol freático (m):', obrigatoria: false, placeholder: '3.0' },
        { id: 31, tipo: 'select', pergunta: 'Construções vizinhas próximas:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 32, tipo: 'number', pergunta: 'Distância construções vizinhas (m):', obrigatoria: false, placeholder: '5.0', dependeDe: { perguntaId: '31', valoresQueExibem: ['Sim'] } },
        
        // === 1.4 CARGAS E SOBRECARGAS ===
        { id: 33, tipo: 'select', pergunta: 'Uso previsto do SUBSOLO:', opcoes: ['Garagem', 'Depósito', 'Área técnica', 'Não há subsolo', 'Outro'], obrigatoria: true, dependeDe: { perguntaId: '8', valoresQueExibem: ['1', '2', '3', '4', '5'] } },
        { id: 34, tipo: 'select', pergunta: 'Uso previsto do TÉRREO:', opcoes: ['Residencial', 'Comercial', 'Escritório', 'Industrial', 'Garagem', 'Pilotis', 'Misto', 'Outro'], obrigatoria: true, dependeDe: { perguntaId: '10', valoresQueExibem: ['Sim'] } },
        { id: 35, tipo: 'select', pergunta: 'Uso previsto PAVIMENTOS SUPERIORES:', opcoes: ['Residencial', 'Comercial', 'Escritório', 'Industrial', 'Misto', 'Outro'], obrigatoria: true },
        { id: 36, tipo: 'checkbox', pergunta: 'Sobrecargas especiais:', opcoes: ['Equipamentos pesados', 'Biblioteca/arquivo', 'Auditório/teatro', 'Piscina', 'Jardim/terra', 'Máquinas industriais', 'Não há sobrecargas especiais'], obrigatoria: true },
        { id: 37, tipo: 'textarea', pergunta: 'Descrição equipamentos pesados:', obrigatoria: false, placeholder: 'Tipo, peso, localização', dependeDe: { perguntaId: '36', valoresQueExibem: ['Equipamentos pesados'] } },
        { id: 38, tipo: 'textarea', pergunta: 'Cargas concentradas especiais:', obrigatoria: false, placeholder: 'Ex: Pilar 50kN, Tanque 20kN' },
        { id: 39, tipo: 'number', pergunta: 'Maior carga concentrada (kN):', obrigatoria: false, placeholder: '50' },
        { id: 40, tipo: 'checkbox', pergunta: 'Cargas dinâmicas especiais:', opcoes: ['Equipamentos rotativos', 'Pontes rolantes', 'Vibrações industriais', 'Cargas de vento especiais', 'Cargas sísmicas', 'Não há cargas dinâmicas'], obrigatoria: true },
        { id: 41, tipo: 'textarea', pergunta: 'Descrição cargas dinâmicas:', obrigatoria: false, placeholder: 'Frequência, amplitude, localização', dependeDe: { perguntaId: '40', valoresQueExibem: ['Equipamentos rotativos', 'Pontes rolantes', 'Vibrações industriais'] } },
        { id: 42, tipo: 'number', pergunta: 'Velocidade do vento (m/s):', obrigatoria: true, placeholder: '30' },
        { id: 43, tipo: 'select', pergunta: 'Categoria de rugosidade:', opcoes: ['Categoria I (mar aberto)', 'Categoria II (campo aberto)', 'Categoria III (subúrbios)', 'Categoria IV (centros urbanos)', 'Categoria V (grandes cidades)', 'Não sei'], obrigatoria: true },
        { id: 44, tipo: 'select', pergunta: 'Fator topográfico:', opcoes: ['S1 = 1,00 (plano)', 'S1 = 1,10 (encosta suave)', 'S1 = 1,20 (encosta íngreme)', 'S1 = 1,30 (cume)', 'Não sei'], obrigatoria: true },
        { id: 45, tipo: 'number', pergunta: 'Variação de temperatura (°C):', obrigatoria: false, placeholder: '±20' },
        { id: 46, tipo: 'select', pergunta: 'Sobrecarga de neve:', opcoes: ['Sim (região serrana)', 'Não (clima tropical)', 'Não sei'], obrigatoria: true },
        { id: 47, tipo: 'number', pergunta: 'Sobrecarga de neve (kN/m²):', obrigatoria: false, placeholder: '0.5', dependeDe: { perguntaId: '46', valoresQueExibem: ['Sim (região serrana)'] } },
        
        // === 1.5 COMPATIBILIZAÇÃO COM OUTRAS DISCIPLINAS ===
        { id: 48, tipo: 'checkbox', pergunta: 'Projetos complementares definidos:', opcoes: ['Instalações elétricas', 'Instalações hidráulicas', 'AVAC', 'Elevadores', 'Instalações especiais', 'Nenhum definido'], obrigatoria: true },
        { id: 49, tipo: 'textarea', pergunta: 'Restrições para instalações:', obrigatoria: false, placeholder: 'Limitações para passagem de tubulações, dutos, etc.' },
        { id: 50, tipo: 'select', pergunta: 'Coordenação com projetistas:', opcoes: ['Já definidos', 'A definir pelo escritório', 'Não necessário'], obrigatoria: true },
        
        // === 1.6 CONDIÇÕES AMBIENTAIS ===
        { id: 51, tipo: 'select', pergunta: 'Classe de agressividade ambiental:', opcoes: ['CAA I - Rural', 'CAA II - Urbana', 'CAA III - Marinha/industrial', 'CAA IV - Industrial severa', 'Não sei'], obrigatoria: true },
        { id: 52, tipo: 'select', pergunta: 'Distância do mar:', opcoes: ['Menos de 1 km', '1 a 5 km', '5 a 20 km', 'Mais de 20 km', 'Não aplicável'], obrigatoria: true },
        { id: 53, tipo: 'checkbox', pergunta: 'Agentes agressivos:', opcoes: ['Gases industriais', 'Produtos químicos', 'Cloretos', 'Sulfatos', 'Nenhum conhecido'], obrigatoria: true },
        { id: 54, tipo: 'select', pergunta: 'Condições de exposição:', opcoes: ['Ambiente interno seco', 'Ambiente interno úmido', 'Ambiente externo', 'Contato com solo', 'Contato com água'], obrigatoria: true },
        { id: 55, tipo: 'select', pergunta: 'Análise sísmica:', opcoes: ['Estrutura comum (básica)', 'Estrutura especial (obrigatória)', 'Edifício alto (>60m)', 'Estrutura irregular', 'Equipamentos sensíveis', 'Não aplicável'], obrigatoria: true },
        { id: 56, tipo: 'number', pergunta: 'Aceleração espectral (m/s²):', obrigatoria: false, placeholder: '0.025', dependeDe: { perguntaId: '55', valoresQueExibem: ['Estrutura especial (obrigatória)', 'Edifício alto (>60m)'] } },
        { id: 57, tipo: 'select', pergunta: 'Classe de solo sísmico:', opcoes: ['Classe A', 'Classe B', 'Classe C', 'Classe D', 'Classe E', 'Não sei'], obrigatoria: false, dependeDe: { perguntaId: '55', valoresQueExibem: ['Estrutura especial (obrigatória)', 'Edifício alto (>60m)'] } },
        { id: 58, tipo: 'number', pergunta: 'Fator de amplificação:', obrigatoria: false, placeholder: '1.5', dependeDe: { perguntaId: '55', valoresQueExibem: ['Estrutura especial (obrigatória)', 'Edifício alto (>60m)'] } },
        { id: 59, tipo: 'textarea', pergunta: 'Irregularidades estruturais:', obrigatoria: false, placeholder: 'Descreva irregularidades geométricas ou de rigidez', dependeDe: { perguntaId: '55', valoresQueExibem: ['Estrutura irregular'] } },
        { id: 60, tipo: 'select', pergunta: 'Monitoramento estrutural:', opcoes: ['Necessário', 'Recomendado', 'Não necessário'], obrigatoria: false },
        { id: 61, tipo: 'select', pergunta: 'Instrumentação geotécnica:', opcoes: ['Necessária', 'Recomendada', 'Não necessária'], obrigatoria: false },
        
        // === 1.7 CONTROLE TECNOLÓGICO E QUALIDADE ===
        { id: 62, tipo: 'select', pergunta: 'Nível de controle tecnológico:', opcoes: ['Básico (mínimo)', 'Intermediário', 'Rigoroso', 'Especial (crítico)'], obrigatoria: true },
        { id: 63, tipo: 'select', pergunta: 'Laboratório disponível:', opcoes: ['Próprio', 'Terceirizado credenciado', 'Básico', 'Não definido'], obrigatoria: true },
        { id: 64, tipo: 'checkbox', pergunta: 'Ensaios especiais:', opcoes: ['Fadiga', 'Dinâmicos', 'Monitoramento estrutural', 'Instrumentação geotécnica', 'Não necessário'], obrigatoria: true },
        { id: 65, tipo: 'select', pergunta: 'Frequência de ensaios:', opcoes: ['Mínima por norma', 'Intermediária', 'Rigorosa', 'Especial'], obrigatoria: true },
        { id: 66, tipo: 'select', pergunta: 'Controle de qualidade:', opcoes: ['Básico', 'Intermediário', 'Rigoroso', 'Especial'], obrigatoria: true },
        { id: 67, tipo: 'textarea', pergunta: 'Requisitos especiais de qualidade:', obrigatoria: false, placeholder: 'Certificações, normas especiais, etc.' },
        
        // === INFORMAÇÕES COMPLEMENTARES ===
        { id: 68, tipo: 'select', pergunta: 'Prazo para o projeto (dias):', opcoes: ['15-30 dias', '30-45 dias', '45-60 dias', 'Acima de 60 dias'], obrigatoria: true },
        { id: 69, tipo: 'select', pergunta: 'Orçamento estimado:', opcoes: ['Até R$ 50k', 'R$ 50k-100k', 'R$ 100k-500k', 'R$ 500k-1M', 'Acima de R$ 1M'], obrigatoria: false },
        { id: 70, tipo: 'file', pergunta: 'Documentos complementares:', obrigatoria: false, placeholder: 'Laudos, relatórios, outros documentos' },
        { id: 71, tipo: 'textarea', pergunta: 'Observações gerais:', obrigatoria: false, placeholder: 'Informações adicionais relevantes' },
        { id: 72, tipo: 'textarea', pergunta: 'Restrições específicas:', obrigatoria: false, placeholder: 'Limitações não mencionadas' },
        { id: 73, tipo: 'textarea', pergunta: 'Exigências do cliente:', obrigatoria: false, placeholder: 'Requisitos especiais do cliente' },
        { id: 74, tipo: 'select', pergunta: 'Mão de obra disponível:', opcoes: ['Altamente qualificada', 'Qualificada', 'Básica', 'Não sei'], obrigatoria: false },
        { id: 75, tipo: 'select', pergunta: 'Acesso à obra:', opcoes: ['Fácil', 'Limitado', 'Difícil', 'Muito restrito'], obrigatoria: false },
        { id: 76, tipo: 'select', pergunta: 'Disponibilidade de materiais:', opcoes: ['Todos disponíveis', 'Maioria disponível', 'Poucos disponíveis', 'Não sei'], obrigatoria: false },
        { id: 77, tipo: 'select', pergunta: 'Necessidade de manutenção:', opcoes: ['Mínima', 'Padrão', 'Intensiva aceitável'], obrigatoria: false },
        { id: 78, tipo: 'select', pergunta: 'Vida útil desejada:', opcoes: ['25 anos', '50 anos', '75 anos', '100 anos'], obrigatoria: true },
        { id: 79, tipo: 'select', pergunta: 'Prioridade #1:', opcoes: ['Custo', 'Prazo', 'Qualidade'], obrigatoria: true },
        { id: 80, tipo: 'select', pergunta: 'Prioridade #2:', opcoes: ['Custo', 'Prazo', 'Qualidade'], obrigatoria: true },
        { id: 81, tipo: 'select', pergunta: 'Prioridade #3:', opcoes: ['Custo', 'Prazo', 'Qualidade'], obrigatoria: true }
      ]
    },
    
    {
      id: 'sistema-estrutural',
      nome: '🔧 Sistema Estrutural (CHAVE ADAPTATIVA)',
      descricao: 'Escolha que determina quais seções aparecerão + requisitos gerais',
      icon: '🔧',
      obrigatoria: true,
      perguntas: [
        // === 2.1 ESCOLHA DO SISTEMA ESTRUTURAL ===
        { id: 82, tipo: 'select', pergunta: '🚨 ESCOLHA O SISTEMA ESTRUTURAL:', opcoes: ['Concreto armado moldado in loco', 'Estrutura metálica', 'Madeira', 'Alvenaria estrutural', 'Estruturas mistas (aço-concreto)', 'Pré-moldados de concreto', 'Não tenho preferência'], obrigatoria: true },
        { id: 83, tipo: 'textarea', pergunta: 'Justificativa da escolha:', obrigatoria: false, placeholder: 'Motivos da escolha' },
        { id: 84, tipo: 'checkbox', pergunta: 'Sistemas que NÃO devem ser considerados:', opcoes: ['Concreto armado', 'Estrutura metálica', 'Madeira', 'Alvenaria estrutural', 'Estruturas mistas', 'Pré-moldados', 'Nenhuma restrição'], obrigatoria: false },
        { id: 85, tipo: 'textarea', pergunta: 'Motivo das restrições:', obrigatoria: false, placeholder: 'Por que certos sistemas não devem ser usados' },
        { id: 86, tipo: 'select', pergunta: 'Análise comparativa automática:', opcoes: ['Solicitar estudo comparativo', 'Apenas sistema selecionado', 'IA deve sugerir melhor', 'Não necessário'], obrigatoria: true },
        
        // === 2.2 REQUISITOS GERAIS ===
        { id: 87, tipo: 'select', pergunta: 'Vida útil de projeto desejada:', opcoes: ['25 anos (temporária)', '50 anos (padrão)', '75 anos (superior)', '100 anos (excepcional)'], obrigatoria: true },
        { id: 88, tipo: 'select', pergunta: 'Velocidade de execução:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 89, tipo: 'select', pergunta: 'Custo de execução:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 90, tipo: 'select', pergunta: 'Facilidade de manutenção:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 91, tipo: 'select', pergunta: 'Sustentabilidade:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 92, tipo: 'select', pergunta: 'Qualidade do acabamento:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 93, tipo: 'select', pergunta: 'Resistência a intempéries:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 94, tipo: 'select', pergunta: 'Flexibilidade arquitetônica:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 95, tipo: 'select', pergunta: 'Disponibilidade de mão de obra:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 96, tipo: 'select', pergunta: 'Disponibilidade de materiais:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true }
      ]
    },
    
    // === SEÇÕES CONDICIONAIS ADAPTATIVAS ===
    
    {
      id: 'concreto-armado',
      nome: '🏭 Concreto Armado - Específico',
      descricao: 'Detalhes específicos para concreto armado',
      icon: '🏭',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 82, valores: ['Concreto armado moldado in loco'], operador: 'equals' },
      perguntas: [
        { id: 97, tipo: 'select', pergunta: 'Classe de resistência (fck):', opcoes: ['C20', 'C25', 'C30', 'C35', 'C40', 'C45', 'C50'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 98, tipo: 'select', pergunta: 'Tipo de cimento:', opcoes: ['CP II-E', 'CP II-Z', 'CP III', 'CP IV', 'CP V-ARI'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 99, tipo: 'select', pergunta: 'Tipo de armadura:', opcoes: ['CA-50', 'CA-60', 'Mista', 'Aço inoxidável'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 100, tipo: 'checkbox', pergunta: 'Aditivos necessários:', opcoes: ['Plastificante', 'Superplastificante', 'Retardador', 'Acelerador', 'Nenhum'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 101, tipo: 'select', pergunta: 'Tipo de forma:', opcoes: ['Madeira', 'Metálica', 'Plástica', 'Mista'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 102, tipo: 'select', pergunta: 'Necessidade de protensão:', opcoes: ['Sim, pré-tensão', 'Sim, pós-tensão', 'Não necessária'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 103, tipo: 'select', pergunta: 'Controle tecnológico:', opcoes: ['Básico', 'Intermediário', 'Rigoroso'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 104, tipo: 'select', pergunta: 'Idade de desforma:', opcoes: ['3 dias', '7 dias', '14 dias', '21 dias'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 105, tipo: 'select', pergunta: 'Método de adensamento:', opcoes: ['Vibrador imersão', 'Vibrador superfície', 'Auto-adensável'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } },
        { id: 106, tipo: 'textarea', pergunta: 'Observações concreto:', obrigatoria: false, placeholder: 'Requisitos especiais', dependeDe: { perguntaId: '82', valoresQueExibem: ['Concreto armado moldado in loco'] } }
      ]
    },
    
    {
      id: 'estrutura-metalica',
      nome: '⚙️ Estrutura Metálica - Específico',
      descricao: 'Detalhes específicos para estrutura metálica',
      icon: '⚙️',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 82, valores: ['Estrutura metálica'], operador: 'equals' },
      perguntas: [
        { id: 107, tipo: 'select', pergunta: 'Tipo de aço:', opcoes: ['ASTM A36', 'ASTM A572 Gr.50', 'ASTM A992', 'AR 350', 'AR 415'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 108, tipo: 'select', pergunta: 'Perfis - Vigas:', opcoes: ['Laminados (W, I, H)', 'Soldados', 'Formados a frio', 'Treliças'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 109, tipo: 'select', pergunta: 'Perfis - Pilares:', opcoes: ['Laminados (W, H)', 'Soldados', 'Tubulares', 'Compostos'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 110, tipo: 'select', pergunta: 'Tipo de ligação:', opcoes: ['Soldada', 'Parafusada', 'Mista'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 111, tipo: 'select', pergunta: 'Proteção corrosão:', opcoes: ['Galvanização', 'Pintura anti-corrosiva', 'Duplex', 'Cor-Ten'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 112, tipo: 'select', pergunta: 'Proteção incêndio:', opcoes: ['Tinta intumescente', 'Argamassa projetada', 'Placas fibrocimento', 'Não necessária'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 113, tipo: 'select', pergunta: 'Fabricante:', opcoes: ['Local', 'Regional', 'Nacional', 'Importado'], obrigatoria: false, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 114, tipo: 'select', pergunta: 'Transporte:', opcoes: ['Normal', 'Especial', 'Pré-montagem'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 115, tipo: 'checkbox', pergunta: 'Verificações especiais:', opcoes: ['Fadiga', 'Vibração', 'Flambagem', 'Instabilidade', 'Nenhuma'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } },
        { id: 116, tipo: 'textarea', pergunta: 'Observações metálica:', obrigatoria: false, placeholder: 'Requisitos especiais', dependeDe: { perguntaId: '82', valoresQueExibem: ['Estrutura metálica'] } }
      ]
    },
    
    {
      id: 'madeira',
      nome: '🌳 Madeira - Específico',
      descricao: 'Detalhes específicos para estrutura de madeira',
      icon: '🌳',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 82, valores: ['Madeira'], operador: 'equals' },
      perguntas: [
        { id: 117, tipo: 'select', pergunta: 'Tipo de madeira:', opcoes: ['Maciça nativa', 'Maciça reflorestamento', 'Laminada colada (MLC)', 'Laminada cruzada (CLT)', 'OSB estrutural'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 118, tipo: 'select', pergunta: 'Espécie:', opcoes: ['Eucalipto', 'Pinus', 'Peroba', 'Ipê', 'Jatobá', 'Angelim'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 119, tipo: 'select', pergunta: 'Classe de resistência:', opcoes: ['C20', 'C25', 'C30', 'C35', 'C40'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 120, tipo: 'select', pergunta: 'Umidade de equilíbrio:', opcoes: ['12% (seco)', '15% (normal)', '18% (úmido)'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 121, tipo: 'select', pergunta: 'Tratamento preservativo:', opcoes: ['Autoclave (CCA)', 'Imersão', 'Pincelamento', 'Natural'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 122, tipo: 'select', pergunta: 'Proteção contra fogo:', opcoes: ['Retardante', 'Seção sacrificial', 'Revestimento', 'Não necessária'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 123, tipo: 'select', pergunta: 'Ligações:', opcoes: ['Entalhes', 'Parafusos', 'Pregos estruturais', 'Conectores metálicos', 'Adesivos'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 124, tipo: 'select', pergunta: 'Fornecimento:', opcoes: ['Serraria local', 'Certificado', 'FSC', 'Não definido'], obrigatoria: false, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 125, tipo: 'checkbox', pergunta: 'Considerações especiais:', opcoes: ['Retração', 'Insetos', 'Ventilação', 'Detalhes especiais'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } },
        { id: 126, tipo: 'textarea', pergunta: 'Observações madeira:', obrigatoria: false, placeholder: 'Requisitos especiais', dependeDe: { perguntaId: '82', valoresQueExibem: ['Madeira'] } }
      ]
    },
    
    {
      id: 'alvenaria-estrutural',
      nome: '🧱 Alvenaria Estrutural - Específico',
      descricao: 'Detalhes específicos para alvenaria estrutural',
      icon: '🧱',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 82, valores: ['Alvenaria estrutural'], operador: 'equals' },
      perguntas: [
        { id: 127, tipo: 'select', pergunta: 'Tipo de bloco:', opcoes: ['Concreto', 'Cerâmico', 'Sílico-calcário', 'Concreto celular'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 128, tipo: 'select', pergunta: 'Dimensões do bloco:', opcoes: ['14x19x39 cm', '19x19x39 cm', '14x19x19 cm', '19x19x19 cm'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 129, tipo: 'select', pergunta: 'Resistência (fbk):', opcoes: ['≥ 4,5 MPa', '≥ 6,0 MPa', '≥ 8,0 MPa', '≥ 10,0 MPa'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 130, tipo: 'select', pergunta: 'Tipo de argamassa:', opcoes: ['Industrializada', 'Virada obra', 'Colante'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 131, tipo: 'select', pergunta: 'Armação:', opcoes: ['Horizontal (canaletas)', 'Vertical (furos)', 'Horizontal+Vertical', 'Não armada'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 132, tipo: 'select', pergunta: 'Tipo de aço:', opcoes: ['CA-50', 'CA-60', 'Tela soldada'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 133, tipo: 'number', pergunta: 'Máximo de pavimentos:', obrigatoria: true, placeholder: '4', dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 134, tipo: 'select', pergunta: 'Tipo de laje:', opcoes: ['Maciça', 'Nervurada', 'Pré-moldada', 'Steel deck'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 135, tipo: 'select', pergunta: 'Controle de qualidade:', opcoes: ['Básico', 'Intermediário', 'Rigoroso'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } },
        { id: 136, tipo: 'textarea', pergunta: 'Observações alvenaria:', obrigatoria: false, placeholder: 'Requisitos especiais', dependeDe: { perguntaId: '82', valoresQueExibem: ['Alvenaria estrutural'] } }
      ]
    },
    
    {
      id: 'estruturas-mistas',
      nome: '🏗️ Estruturas Mistas - Específico',
      descricao: 'Detalhes específicos para estruturas mistas',
      icon: '🏗️',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 82, valores: ['Estruturas mistas (aço-concreto)'], operador: 'equals' },
      perguntas: [
        { id: 137, tipo: 'checkbox', pergunta: 'Elementos mistos:', opcoes: ['Vigas mistas', 'Pilares mistos', 'Lajes mistas', 'Forma incorporada'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 138, tipo: 'select', pergunta: 'Tipo de laje:', opcoes: ['Steel deck + concreto', 'Alveolar + capeamento', 'Pré-moldada + concreto'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 139, tipo: 'select', pergunta: 'Conectores:', opcoes: ['Stud', 'Perfil U', 'Especiais'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 140, tipo: 'select', pergunta: 'Proteção corrosão:', opcoes: ['Pintura', 'Galvanização', 'Duplex', 'Proteção concreto'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 141, tipo: 'select', pergunta: 'Resistência concreto:', opcoes: ['C25', 'C30', 'C35', 'C40'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 142, tipo: 'checkbox', pergunta: 'Verificações:', opcoes: ['Interação completa', 'Interação parcial', 'Flambagem', 'Vibração'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 143, tipo: 'select', pergunta: 'Sequência construtiva:', opcoes: ['Metal depois concreto', 'Simultânea', 'Pré-fabricação'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 144, tipo: 'select', pergunta: 'Controle qualidade:', opcoes: ['Básico', 'Intermediário', 'Rigoroso'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } },
        { id: 145, tipo: 'textarea', pergunta: 'Observações mistas:', obrigatoria: false, placeholder: 'Requisitos especiais', dependeDe: { perguntaId: '82', valoresQueExibem: ['Estruturas mistas (aço-concreto)'] } }
      ]
    },
    
    {
      id: 'pre-moldados',
      nome: '🏭 Pré-moldados - Específico',
      descricao: 'Detalhes específicos para pré-moldados',
      icon: '🏭',
      obrigatoria: false,
      condicional: true,
      condicao: { perguntaId: 82, valores: ['Pré-moldados de concreto'], operador: 'equals' },
      perguntas: [
        { id: 146, tipo: 'checkbox', pergunta: 'Elementos:', opcoes: ['Pilares', 'Vigas', 'Lajes alveolares', 'Painéis', 'Escadas'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 147, tipo: 'select', pergunta: 'Fabricação:', opcoes: ['Pré-fabricado (fábrica)', 'Pré-moldado (canteiro)', 'Misto'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 148, tipo: 'select', pergunta: 'Controle qualidade:', opcoes: ['Nível A (rigoroso)', 'Nível B (intermediário)', 'Nível C (básico)'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 149, tipo: 'select', pergunta: 'Tipo de concreto:', opcoes: ['Convencional', 'Alta resistência', 'Auto-adensável', 'Leve'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 150, tipo: 'select', pergunta: 'Resistência:', opcoes: ['C35', 'C40', 'C45', 'C50'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 151, tipo: 'select', pergunta: 'Cura:', opcoes: ['Térmica (vapor)', 'Ao ar', 'Autoclave'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 152, tipo: 'checkbox', pergunta: 'Ligações:', opcoes: ['Soldadas', 'Parafusadas', 'Chumbadas', 'Concretadas'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 153, tipo: 'select', pergunta: 'Transporte:', opcoes: ['Caminhão comum', 'Carreta especial', 'Combinação'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 154, tipo: 'select', pergunta: 'Montagem:', opcoes: ['Guindaste móvel', 'Guindaste fixo', 'Grua'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 155, tipo: 'select', pergunta: 'Tolerâncias:', opcoes: ['Classe 1 (alta)', 'Classe 2 (normal)', 'Classe 3 (baixa)'], obrigatoria: true, dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } },
        { id: 156, tipo: 'textarea', pergunta: 'Observações pré-moldados:', obrigatoria: false, placeholder: 'Requisitos especiais', dependeDe: { perguntaId: '82', valoresQueExibem: ['Pré-moldados de concreto'] } }
      ]
    },
    
    // === NOVA SEÇÃO 4: REQUISITOS ESPECIAIS ===
    {
      id: 'requisitos-especiais',
      nome: '🌟 Requisitos Especiais',
      descricao: 'Sustentabilidade, cronograma, orçamento e informações complementares',
      icon: '🌟',
      obrigatoria: true,
      perguntas: [
        // === 4.1 SUSTENTABILIDADE E MEIO AMBIENTE ===
        { id: 157, tipo: 'select', pergunta: 'Certificação ambiental desejada:', opcoes: ['LEED', 'AQUA-HQE', 'BREEAM', 'Não necessária'], obrigatoria: false },
        { id: 158, tipo: 'select', pergunta: 'Uso de materiais reciclados:', opcoes: ['Obrigatório', 'Preferível', 'Indiferente', 'Não desejado'], obrigatoria: true },
        { id: 159, tipo: 'select', pergunta: 'Eficiência energética:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 160, tipo: 'select', pergunta: 'Gestão de resíduos na obra:', opcoes: ['Plano obrigatório', 'Gestão básica', 'Não é prioridade'], obrigatoria: true },
        { id: 161, tipo: 'select', pergunta: 'Pegada de carbono:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não é fator'], obrigatoria: true },
        { id: 162, tipo: 'select', pergunta: 'Materiais locais:', opcoes: ['Obrigatório', 'Preferível', 'Indiferente'], obrigatoria: true },
        { id: 163, tipo: 'select', pergunta: 'Água da chuva:', opcoes: ['Aproveitamento obrigatório', 'Preferível', 'Não necessário'], obrigatoria: false },
        { id: 164, tipo: 'select', pergunta: 'Energia renovável:', opcoes: ['Obrigatório', 'Preferível', 'Não necessário'], obrigatoria: false },
        
        // === 4.2 CRONOGRAMA E ORÇAMENTO ===
        { id: 165, tipo: 'number', pergunta: 'Prazo desejado para projeto (dias):', obrigatoria: true, placeholder: '30' },
        { id: 166, tipo: 'date', pergunta: 'Data desejada para início da obra:', obrigatoria: false },
        { id: 167, tipo: 'select', pergunta: 'Orçamento disponível para estrutura:', opcoes: ['Até R$ 100.000', 'R$ 100.000 a R$ 500.000', 'R$ 500.000 a R$ 1.000.000', 'Acima de R$ 1.000.000', 'A definir'], obrigatoria: true },
        { id: 168, tipo: 'select', pergunta: 'Flexibilidade no prazo:', opcoes: ['Nenhuma', 'Pequena (até 10%)', 'Média (até 20%)', 'Grande (até 30%)'], obrigatoria: true },
        { id: 169, tipo: 'select', pergunta: 'Flexibilidade no orçamento:', opcoes: ['Nenhuma', 'Pequena (até 10%)', 'Média (até 20%)', 'Grande (até 30%)'], obrigatoria: true },
        { id: 170, tipo: 'textarea', pergunta: 'Restrições de cronograma:', obrigatoria: false, placeholder: 'Datas críticas, eventos, etc.' },
        { id: 171, tipo: 'select', pergunta: 'Forma de pagamento:', opcoes: ['À vista', 'Parcelado', 'Por etapas', 'A negociar'], obrigatoria: false },
        { id: 172, tipo: 'select', pergunta: 'Garantia desejada:', opcoes: ['5 anos', '10 anos', '15 anos', 'Vida útil'], obrigatoria: true },
        
        // === 4.3 EXECUÇÃO E MANUTENÇÃO ===
        { id: 173, tipo: 'select', pergunta: 'Experiência da construtora:', opcoes: ['Altamente experiente', 'Experiente', 'Pouco experiente', 'Não definida'], obrigatoria: false },
        { id: 174, tipo: 'select', pergunta: 'Supervisão técnica:', opcoes: ['Intensiva', 'Normal', 'Básica', 'Não necessária'], obrigatoria: true },
        { id: 175, tipo: 'select', pergunta: 'Treinamento da equipe:', opcoes: ['Necessário', 'Recomendado', 'Não necessário'], obrigatoria: true },
        { id: 176, tipo: 'textarea', pergunta: 'Limitações de horário:', obrigatoria: false, placeholder: 'Restrições de ruído, trânsito, etc.' },
        { id: 177, tipo: 'select', pergunta: 'Acesso para equipamentos:', opcoes: ['Fácil', 'Limitado', 'Difícil', 'Muito restrito'], obrigatoria: true },
        { id: 178, tipo: 'select', pergunta: 'Armazenamento de materiais:', opcoes: ['Amplo', 'Limitado', 'Muito limitado', 'Não há espaço'], obrigatoria: true },
        { id: 179, tipo: 'select', pergunta: 'Interferências vizinhas:', opcoes: ['Nenhuma', 'Pequenas', 'Médias', 'Grandes'], obrigatoria: true },
        { id: 180, tipo: 'textarea', pergunta: 'Plano de manutenção:', obrigatoria: false, placeholder: 'Periodicidade, responsabilidades, etc.' },
        
        // === 4.4 INFORMAÇÕES COMPLEMENTARES ===
        { id: 181, tipo: 'checkbox', pergunta: 'Documentos necessários:', opcoes: ['ART/RRT', 'Licenças ambientais', 'Alvará de construção', 'Aprovação no corpo de bombeiros', 'Outros'], obrigatoria: true },
        { id: 182, tipo: 'select', pergunta: 'Acompanhamento de obra:', opcoes: ['Semanal', 'Quinzenal', 'Mensal', 'Por etapas'], obrigatoria: true },
        { id: 183, tipo: 'select', pergunta: 'Relatórios técnicos:', opcoes: ['Detalhados', 'Resumidos', 'Apenas críticos', 'Não necessários'], obrigatoria: true },
        { id: 184, tipo: 'textarea', pergunta: 'Comunicação preferida:', obrigatoria: false, placeholder: 'WhatsApp, email, reuniões presenciais, etc.' },
        { id: 185, tipo: 'file', pergunta: 'Documentos adicionais:', obrigatoria: false, placeholder: 'Contratos, especificações, etc.' },
        { id: 186, tipo: 'textarea', pergunta: 'Expectativas especiais:', obrigatoria: false, placeholder: 'Requisitos únicos do cliente' },
        { id: 187, tipo: 'select', pergunta: 'Assessoria pós-obra:', opcoes: ['Necessária', 'Recomendada', 'Não necessária'], obrigatoria: true },
        { id: 188, tipo: 'textarea', pergunta: 'Observações finais:', obrigatoria: false, placeholder: 'Qualquer informação adicional relevante' }
      ]
    },
    
    {
      id: 'finalizacao',
      nome: '🎯 Finalização e Entrega',
      descricao: 'Assinatura e próximos passos',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        { id: 189, tipo: 'text', pergunta: 'Nome do responsável:', obrigatoria: true, placeholder: 'Nome completo' },
        { id: 190, tipo: 'text', pergunta: 'CPF/CNPJ:', obrigatoria: true, placeholder: 'Documento' },
        { id: 191, tipo: 'text', pergunta: 'CREA/CAU:', obrigatoria: false, placeholder: 'Registro profissional' },
        { id: 192, tipo: 'text', pergunta: 'Telefone de contato:', obrigatoria: true, placeholder: '(11) 99999-9999' },
                 { id: 193, tipo: 'text', pergunta: 'E-mail:', obrigatoria: true, placeholder: 'email@exemplo.com' },
        { id: 194, tipo: 'date', pergunta: 'Data:', obrigatoria: true },
        { id: 195, tipo: 'text', pergunta: 'Assinatura digital:', obrigatoria: true, placeholder: 'Digite seu nome completo' },
        { id: 196, tipo: 'checkbox', pergunta: 'Declaração:', opcoes: ['Declaro que as informações são verdadeiras e autorizo o uso para desenvolvimento do projeto'], obrigatoria: true },
        { id: 197, tipo: 'select', pergunta: 'Preferência de retorno:', opcoes: ['Telefone', 'WhatsApp', 'E-mail', 'Presencial'], obrigatoria: true },
        { id: 198, tipo: 'select', pergunta: 'Melhor horário para contato:', opcoes: ['Manhã', 'Tarde', 'Noite', 'Qualquer horário'], obrigatoria: true },
        { id: 199, tipo: 'textarea', pergunta: 'Comentários adicionais:', obrigatoria: false, placeholder: 'Alguma observação final' },
        { id: 200, tipo: 'select', pergunta: 'Avaliação do briefing:', opcoes: ['Excelente', 'Bom', 'Regular', 'Pode melhorar'], obrigatoria: false }
      ]
    }
  ]
}; 