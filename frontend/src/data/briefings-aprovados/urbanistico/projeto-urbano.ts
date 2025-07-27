import { BriefingCompleto } from '../../../types/briefing';

export const briefingProjetoUrbano: BriefingCompleto = {
  id: 'urbanistico-projeto-urbano',
  tipologia: 'urbanistico',
  subtipo: 'projeto-urbano',
  padrao: 'profissional',
  nome: 'Projeto Urbano Especializado',
  descricao: 'Briefing completo para projetos urbanos com desenho urbano, planejamento territorial e desenvolvimento urbano integrado',
  totalPerguntas: 260,
  tempoEstimado: '65-80 minutos',
  versao: '1.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['projeto-urbano', 'desenho-urbano', 'planejamento-territorial', 'desenvolvimento-urbano', 'sustentabilidade-urbana', 'mobilidade-urbana'],
    categoria: 'urbanistico',
    complexidade: 'muito_alta',
    publico: ['urbanistas', 'arquitetos-urbanistas', 'planejadores-urbanos', 'incorporadoras', 'poder-publico', 'governos-municipais']
  },
  
  secoes: [
    {
      id: 'identificacao-projeto',
      nome: '🎯 Identificação do Projeto',
      descricao: 'Dados básicos, contexto urbano, características físicas e marco regulatório',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        { id: 1, tipo: 'text', pergunta: 'Nome do projeto urbano:', obrigatoria: true, placeholder: 'Nome do projeto urbano' },
        { id: 2, tipo: 'textarea', pergunta: 'Localização:', obrigatoria: true, placeholder: 'Localização detalhada do projeto' },
        { id: 3, tipo: 'select', pergunta: 'Tipo de projeto urbano:', opcoes: ['Novo bairro/distrito', 'Expansão urbana', 'Adensamento urbano', 'Reestruturação urbana', 'Projeto de orla', 'Eixo de desenvolvimento', 'Outro'], obrigatoria: true },
        { id: 4, tipo: 'select', pergunta: 'Escala do projeto:', opcoes: ['Lote/quadra', 'Bairro', 'Distrito', 'Setor urbano', 'Cidade nova'], obrigatoria: true },
        { id: 5, tipo: 'select', pergunta: 'Área total:', opcoes: ['Até 10 hectares', '10 a 50 hectares', '50 a 200 hectares', '200 a 500 hectares', 'Acima de 500 hectares'], obrigatoria: true },
        { id: 6, tipo: 'select', pergunta: 'Inserção na cidade:', opcoes: ['Área central', 'Área pericentral', 'Periferia consolidada', 'Periferia em expansão', 'Área isolada'], obrigatoria: true },
        { id: 7, tipo: 'select', pergunta: 'Conectividade:', opcoes: ['Muito bem conectada', 'Bem conectada', 'Moderadamente conectada', 'Mal conectada', 'Isolada'], obrigatoria: true },
        { id: 8, tipo: 'select', pergunta: 'Densidade do entorno:', opcoes: ['Alta densidade', 'Média densidade', 'Baixa densidade', 'Área rural/natural'], obrigatoria: true },
        { id: 9, tipo: 'select', pergunta: 'Uso do solo predominante:', opcoes: ['Residencial', 'Comercial/serviços', 'Industrial', 'Institucional', 'Misto', 'Área vazia'], obrigatoria: true },
        { id: 10, tipo: 'select', pergunta: 'Infraestrutura existente:', opcoes: ['Infraestrutura completa', 'Infraestrutura básica', 'Infraestrutura deficiente', 'Sem infraestrutura'], obrigatoria: true },
        { id: 11, tipo: 'select', pergunta: 'Topografia:', opcoes: ['Plana', 'Levemente inclinada (até 5%)', 'Inclinada (5-15%)', 'Muito inclinada (15-30%)', 'Montanhosa (acima de 30%)'], obrigatoria: true },
        { id: 12, tipo: 'select', pergunta: 'Recursos hídricos:', opcoes: ['Rio/córrego', 'Lago/lagoa', 'Mar/oceano', 'Nascentes', 'Sem recursos hídricos'], obrigatoria: true },
        { id: 13, tipo: 'select', pergunta: 'Vegetação:', opcoes: ['Mata nativa preservada', 'Vegetação secundária', 'Vegetação esparsa', 'Área cultivada', 'Área desmatada'], obrigatoria: true },
        { id: 14, tipo: 'select', pergunta: 'Solo:', opcoes: ['Solo estável', 'Solo com restrições', 'Solo problemático', 'Área contaminada', 'Não avaliado'], obrigatoria: true },
        { id: 15, tipo: 'select', pergunta: 'Clima:', opcoes: ['Tropical', 'Subtropical', 'Semiárido', 'Temperado', 'Equatorial'], obrigatoria: true },
        { id: 16, tipo: 'select', pergunta: 'Plano diretor:', opcoes: ['Área prevista no plano', 'Área com diretrizes específicas', 'Necessita alteração do plano', 'Não prevista no plano'], obrigatoria: true },
        { id: 17, tipo: 'select', pergunta: 'Zoneamento:', opcoes: ['Zona de expansão urbana', 'Zona de adensamento', 'Zona especial', 'Necessita alteração', 'Não definido'], obrigatoria: true },
        { id: 18, tipo: 'select', pergunta: 'Instrumentos urbanísticos:', opcoes: ['Operação urbana', 'Parcelamento compulsório', 'ZEIS', 'Transferência do direito de construir', 'Múltiplos instrumentos'], obrigatoria: true },
        { id: 19, tipo: 'select', pergunta: 'Licenciamento ambiental:', opcoes: ['Não necessário', 'Licença simplificada', 'EIA/RIMA', 'Múltiplas licenças'], obrigatoria: true },
        { id: 20, tipo: 'select', pergunta: 'Aprovações necessárias:', opcoes: ['Municipal apenas', 'Municipal + estadual', 'Municipal + estadual + federal', 'Múltiplos órgãos'], obrigatoria: true }
      ]
    },
    {
      id: 'programa-urbano',
      nome: '🏗️ Programa Urbano',
      descricao: 'Uso do solo, habitação, atividades econômicas, equipamentos públicos, espaços livres, mobilidade e infraestrutura',
      icon: '🏗️',
      obrigatoria: true,
      perguntas: [
        { id: 21, tipo: 'number', pergunta: 'Uso residencial - Percentual da área:', obrigatoria: true, placeholder: '40' },
        { id: 22, tipo: 'select', pergunta: 'Densidade residencial:', opcoes: ['Baixa', 'Média', 'Alta', 'Mista'], obrigatoria: true },
        { id: 23, tipo: 'number', pergunta: 'Uso comercial - Percentual da área:', obrigatoria: true, placeholder: '20' },
        { id: 24, tipo: 'select', pergunta: 'Tipo de comércio:', opcoes: ['Comércio local', 'Comércio regional', 'Misto'], obrigatoria: true },
        { id: 25, tipo: 'number', pergunta: 'Uso de serviços - Percentual da área:', obrigatoria: true, placeholder: '15' },
        { id: 26, tipo: 'select', pergunta: 'Tipo de serviços:', opcoes: ['Serviços locais', 'Serviços especializados', 'Misto'], obrigatoria: true },
        { id: 27, tipo: 'number', pergunta: 'Uso institucional - Percentual da área:', obrigatoria: true, placeholder: '10' },
        { id: 28, tipo: 'select', pergunta: 'Tipo institucional:', opcoes: ['Educação', 'Saúde', 'Administração', 'Múltiplos'], obrigatoria: true },
        { id: 29, tipo: 'number', pergunta: 'Uso industrial - Percentual da área:', obrigatoria: false, placeholder: '5' },
        { id: 30, tipo: 'select', pergunta: 'Tipo industrial:', opcoes: ['Indústria limpa', 'Logística', 'Não aplicável'], obrigatoria: false },
        { id: 31, tipo: 'select', pergunta: 'Número de unidades habitacionais:', opcoes: ['Até 500 unidades', '500 a 2.000 unidades', '2.000 a 5.000 unidades', '5.000 a 10.000 unidades', 'Acima de 10.000 unidades'], obrigatoria: true },
        { id: 32, tipo: 'select', pergunta: 'Tipologia habitacional:', opcoes: ['Casas térreas', 'Sobrados', 'Apartamentos baixos (até 4 pav.)', 'Edifícios médios (5-12 pav.)', 'Edifícios altos (acima de 12 pav.)', 'Mista'], obrigatoria: true },
        { id: 33, tipo: 'select', pergunta: 'Faixa de renda:', opcoes: ['Habitação social (até 3 SM)', 'Habitação popular (3-6 SM)', 'Classe média (6-15 SM)', 'Classe alta (acima de 15 SM)', 'Múltiplas faixas'], obrigatoria: true },
        { id: 34, tipo: 'select', pergunta: 'Densidade habitacional:', opcoes: ['Baixa (até 50 hab/ha)', 'Média (50-150 hab/ha)', 'Alta (150-300 hab/ha)', 'Muito alta (acima de 300 hab/ha)'], obrigatoria: true },
        { id: 35, tipo: 'select', pergunta: 'População estimada:', opcoes: ['Até 2.000 habitantes', '2.000 a 10.000 habitantes', '10.000 a 30.000 habitantes', '30.000 a 100.000 habitantes', 'Acima de 100.000 habitantes'], obrigatoria: true },
        { id: 36, tipo: 'select', pergunta: 'Comércio e serviços:', opcoes: ['Centro comercial', 'Comércio de rua', 'Comércio especializado', 'Misto'], obrigatoria: true },
        { id: 37, tipo: 'select', pergunta: 'Escritórios:', opcoes: ['Edifícios corporativos', 'Escritórios pequenos/médios', 'Coworking', 'Não previsto'], obrigatoria: true },
        { id: 38, tipo: 'select', pergunta: 'Turismo e lazer:', opcoes: ['Hotéis', 'Restaurantes', 'Entretenimento', 'Não previsto'], obrigatoria: true },
        { id: 39, tipo: 'select', pergunta: 'Indústria/logística:', opcoes: ['Indústria limpa', 'Centro logístico', 'Não previsto'], obrigatoria: true },
        { id: 40, tipo: 'select', pergunta: 'Economia criativa:', opcoes: ['Espaços culturais', 'Ateliês/estúdios', 'Não previsto'], obrigatoria: true },
        { id: 41, tipo: 'select', pergunta: 'Educação:', opcoes: ['Creches', 'Escolas fundamentais', 'Escolas médias', 'Ensino superior', 'Múltiplos níveis'], obrigatoria: true },
        { id: 42, tipo: 'select', pergunta: 'Saúde:', opcoes: ['UBS (Unidade Básica de Saúde)', 'Hospital', 'Clínicas especializadas', 'Múltiplos tipos'], obrigatoria: true },
        { id: 43, tipo: 'select', pergunta: 'Cultura:', opcoes: ['Centro cultural', 'Biblioteca', 'Teatro/cinema', 'Múltiplos equipamentos'], obrigatoria: true },
        { id: 44, tipo: 'select', pergunta: 'Esporte e lazer:', opcoes: ['Centro esportivo', 'Quadras', 'Piscinas', 'Múltiplos equipamentos'], obrigatoria: true },
        { id: 45, tipo: 'select', pergunta: 'Segurança:', opcoes: ['Posto policial', 'Bombeiros', 'Não previsto'], obrigatoria: true },
        { id: 46, tipo: 'select', pergunta: 'Parques urbanos:', opcoes: ['Parque metropolitano', 'Parques de bairro', 'Parques lineares', 'Múltiplos tipos'], obrigatoria: true },
        { id: 47, tipo: 'select', pergunta: 'Praças:', opcoes: ['Praças centrais', 'Praças de bairro', 'Praças temáticas', 'Múltiplos tipos'], obrigatoria: true },
        { id: 48, tipo: 'number', pergunta: 'Áreas verdes - Percentual da área:', obrigatoria: true, placeholder: '30' },
        { id: 49, tipo: 'select', pergunta: 'Tipo de áreas verdes:', opcoes: ['Preservação', 'Contemplação', 'Recreação', 'Misto'], obrigatoria: true },
        { id: 50, tipo: 'select', pergunta: 'Orla/waterfront:', opcoes: ['Orla marítima', 'Orla fluvial', 'Orla lacustre', 'Não aplicável'], obrigatoria: true },
        { id: 51, tipo: 'select', pergunta: 'Espaços esportivos:', opcoes: ['Complexo esportivo', 'Quadras públicas', 'Ciclovias', 'Múltiplos tipos'], obrigatoria: true },
        { id: 52, tipo: 'select', pergunta: 'Sistema viário:', opcoes: ['Vias arteriais', 'Vias coletoras', 'Vias locais', 'Sistema hierarquizado'], obrigatoria: true },
        { id: 53, tipo: 'select', pergunta: 'Transporte público:', opcoes: ['Metrô/trem', 'BRT', 'Ônibus convencional', 'Múltiplos modais'], obrigatoria: true },
        { id: 54, tipo: 'select', pergunta: 'Mobilidade ativa:', opcoes: ['Ciclovias', 'Calçadões', 'Ruas compartilhadas', 'Sistema integrado'], obrigatoria: true },
        { id: 55, tipo: 'select', pergunta: 'Estacionamentos:', opcoes: ['Estacionamentos públicos', 'Estacionamentos privados', 'Estacionamentos rotativos', 'Múltiplos tipos'], obrigatoria: true }
      ]
    }
    // Continua com as outras seções...
  ]
}; 