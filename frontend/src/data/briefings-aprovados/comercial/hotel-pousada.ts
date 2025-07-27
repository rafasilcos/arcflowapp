// BRIEFING APROVADO: COMERCIAL - HOTEL/POUSADA (VERSÃO COMPLETA)
// Convertido do formato markdown para TypeScript - 72 perguntas
// Especializado para setor hoteleiro brasileiro

import { BriefingCompleto } from '../../../types/briefing';

export const BRIEFING_COMERCIAL_HOTEL_POUSADA: BriefingCompleto = {
  id: 'comercial-hotel-pousada-completo',
  tipologia: 'comercial',
  subtipo: 'hotel-pousada',
  padrao: 'profissional',
  nome: 'Plano de Necessidades - Comercial / Hotel/Pousada (Completo)',
  descricao: 'Briefing profissional especializado para projetos de hotéis e pousadas, incluindo análise de viabilidade, conceito hoteleiro, programa arquitetônico, operação e normas do setor turístico brasileiro.',
  totalPerguntas: 72,
  tempoEstimado: '45-60 min',
  versao: '2.0',
  criadoEm: '2024-12-30',
  atualizadoEm: '2024-12-30',
  metadata: {
    tags: ['hotel', 'pousada', 'hospedagem', 'turismo', 'hotelaria', 'comercial', 'hospitalidade', 'mtur', 'abnt'],
    categoria: 'comercial',
    complexidade: 'muito_alta',
    publico: ['arquitetos', 'hoteleiros', 'empreendedores', 'investidores', 'gestores_turismo']
  },
  secoes: [
    {
      id: 'qualificacao-inicial',
      nome: '🎯 Qualificação Inicial do Cliente',
      descricao: 'Avaliação da experiência e conhecimento do cliente no setor hoteleiro',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        { id: 1, tipo: 'radio', pergunta: 'Qual é a sua experiência anterior com projetos hoteleiros?', opcoes: ['Nenhuma experiência', 'Primeira experiência', 'Experiência básica', 'Experiência avançada', 'Especialista no setor'], obrigatoria: true },
        { id: 2, tipo: 'radio', pergunta: 'Qual é o seu conhecimento sobre normas hoteleiras e turísticas?', opcoes: ['Nenhum conhecimento', 'Conhecimento básico', 'Conhecimento intermediário', 'Conhecimento avançado', 'Especialista'], obrigatoria: true },
        { id: 3, tipo: 'radio', pergunta: 'Já trabalhou anteriormente com arquitetos para projetos hoteleiros?', opcoes: ['Nunca', 'Uma vez', 'Algumas vezes', 'Frequentemente'], obrigatoria: true },
        { id: 4, tipo: 'radio', pergunta: 'Qual é a sua disponibilidade para reuniões durante o projeto?', opcoes: ['Muito limitada', 'Limitada', 'Moderada', 'Alta', 'Total'], obrigatoria: true },
        { id: 5, tipo: 'text', pergunta: 'Quem é o decisor principal para aprovações do projeto?', obrigatoria: true, placeholder: 'Nome e cargo do decisor' },
        { id: 6, tipo: 'radio', pergunta: 'Há investidores ou sócios com poder de veto nas decisões?', opcoes: ['Não', 'Sim, um investidor', 'Sim, vários investidores', 'Sim, conselho'], obrigatoria: true },
        { id: 7, tipo: 'textarea', pergunta: 'Qual é a sua expectativa sobre o cronograma e complexidade?', obrigatoria: true, placeholder: 'Descreva suas expectativas' },
        { id: 8, tipo: 'radio', pergunta: 'Há compreensão sobre as exigências específicas do setor hoteleiro?', opcoes: ['Nenhuma', 'Básica', 'Intermediária', 'Avançada', 'Completa'], obrigatoria: true }
      ]
    },
    {
      id: 'dados-basicos',
      nome: '📋 Dados Básicos do Projeto',
      descricao: 'Informações fundamentais sobre o empreendimento hoteleiro',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        { id: 9, tipo: 'text', pergunta: 'Qual é o nome do empreendimento?', obrigatoria: true, placeholder: 'Nome do hotel/pousada' },
        { id: 10, tipo: 'text', pergunta: 'Qual é o CNPJ da empresa?', obrigatoria: true, placeholder: '00.000.000/0000-00' },
        { id: 11, tipo: 'text', pergunta: 'Qual é o nome do responsável pelo projeto?', obrigatoria: true, placeholder: 'Nome completo' },
        { id: 12, tipo: 'text', pergunta: 'Qual é o telefone principal?', obrigatoria: true, placeholder: '(11) 99999-9999' },
        { id: 13, tipo: 'text', pergunta: 'Qual é o e-mail de contato?', obrigatoria: true, placeholder: 'email@hotel.com' },
        { id: 14, tipo: 'text', pergunta: 'Qual é o endereço da empresa?', obrigatoria: true, placeholder: 'Endereço completo' },
        { id: 15, tipo: 'radio', pergunta: 'Qual é o tipo de empreendimento?', opcoes: ['Hotel', 'Pousada', 'Hostel', 'Resort', 'Hotel fazenda', 'Outro'], obrigatoria: true },
        { id: 16, tipo: 'radio', pergunta: 'Há experiência anterior no ramo hoteleiro?', opcoes: ['Nenhuma', 'Básica', 'Intermediária', 'Avançada'], obrigatoria: true },
        { id: 17, tipo: 'number', pergunta: 'Quantos funcionários trabalharão no local?', obrigatoria: true, min: 1, max: 200 },
        { id: 18, tipo: 'radio', pergunta: 'Qual é o horário de funcionamento da recepção?', opcoes: ['24 horas', 'Horário comercial', 'Manhã e tarde', 'Personalizado'], obrigatoria: true },
        { id: 19, tipo: 'radio', pergunta: 'Qual é o público-alvo principal?', opcoes: ['Turismo de lazer', 'Turismo de negócios', 'Turismo rural', 'Turismo familiar', 'Turismo jovem', 'Turismo de luxo'], obrigatoria: true },
        { id: 20, tipo: 'radio', pergunta: 'Há outros empreendimentos da mesma rede?', opcoes: ['Não', 'Sim, um', 'Sim, vários', 'Rede nacional'], obrigatoria: true }
      ]
    },
    {
      id: 'localizacao-terreno',
      nome: '📍 Localização e Terreno',
      descricao: 'Análise da localização e características do terreno',
      icon: '📍',
      obrigatoria: true,
      perguntas: [
        { id: 21, tipo: 'text', pergunta: 'Qual é o endereço completo do terreno?', obrigatoria: true, placeholder: 'Endereço, cidade, estado' },
        { id: 22, tipo: 'number', pergunta: 'Qual é a área total do terreno (m²)?', obrigatoria: true, min: 100, max: 100000 },
        { id: 23, tipo: 'radio', pergunta: 'Qual é a topografia do terreno?', opcoes: ['Plano', 'Levemente inclinado', 'Inclinado', 'Muito inclinado', 'Irregular'], obrigatoria: true },
        { id: 24, tipo: 'radio', pergunta: 'Há vegetação significativa no terreno?', opcoes: ['Não', 'Pouca', 'Moderada', 'Abundante', 'Área de preservação'], obrigatoria: true },
        { id: 25, tipo: 'radio', pergunta: 'Qual é a proximidade com o centro da cidade?', opcoes: ['Centro', 'Próximo (até 5km)', 'Intermediário (5-15km)', 'Distante (15-30km)', 'Muito distante (+30km)'], obrigatoria: true },
        { id: 26, tipo: 'radio', pergunta: 'Há acesso a transporte público?', opcoes: ['Não', 'Limitado', 'Bom', 'Excelente'], obrigatoria: true },
        { id: 27, tipo: 'checkbox', pergunta: 'Quais atrações turísticas estão próximas?', opcoes: ['Praia', 'Montanha', 'Centro histórico', 'Parques naturais', 'Museus', 'Vida noturna', 'Centros comerciais', 'Aeroporto'], obrigatoria: false },
        { id: 28, tipo: 'radio', pergunta: 'Qual é a classificação da via de acesso?', opcoes: ['Estrada de terra', 'Via pavimentada local', 'Via coletora', 'Via arterial', 'Rodovia'], obrigatoria: true }
      ]
    },
    {
      id: 'conceito-posicionamento',
      nome: '🎨 Conceito e Posicionamento',
      descricao: 'Definição do conceito arquitetônico e posicionamento de mercado',
      icon: '🎨',
      obrigatoria: true,
      perguntas: [
        { id: 29, tipo: 'radio', pergunta: 'Qual é o padrão de qualidade desejado?', opcoes: ['Econômico', 'Médio', 'Superior', 'Luxo', 'Ultra luxo'], obrigatoria: true },
        { id: 30, tipo: 'radio', pergunta: 'Qual é o estilo arquitetônico preferido?', opcoes: ['Contemporâneo', 'Colonial', 'Rústico', 'Minimalista', 'Eclético', 'Regional', 'Sustentável'], obrigatoria: true },
        { id: 31, tipo: 'textarea', pergunta: 'Descreva o conceito e a identidade visual desejada', obrigatoria: true, placeholder: 'Conceito, atmosfera, experiência do hóspede' },
        { id: 32, tipo: 'radio', pergunta: 'Qual é a sazonalidade esperada?', opcoes: ['Baixa sazonalidade', 'Sazonalidade moderada', 'Alta sazonalidade', 'Apenas alta temporada'], obrigatoria: true },
        { id: 33, tipo: 'number', pergunta: 'Qual é a taxa de ocupação média esperada (%)?', obrigatoria: true, min: 30, max: 95 },
        { id: 34, tipo: 'number', pergunta: 'Qual é a diária média pretendida (R$)?', obrigatoria: true, min: 50, max: 2000 },
        { id: 35, tipo: 'checkbox', pergunta: 'Quais certificações são desejadas?', opcoes: ['ISO 14001', 'LEED', 'AQUA', 'Selo Verde', 'Turismo Responsável', 'Não se aplica'], obrigatoria: false }
      ]
    },
    {
      id: 'programa-necessidades',
      nome: '🏨 Programa de Necessidades',
      descricao: 'Definição detalhada dos ambientes e suas características',
      icon: '🏨',
      obrigatoria: true,
      perguntas: [
        { id: 36, tipo: 'number', pergunta: 'Quantas unidades habitacionais (UHs) são desejadas?', obrigatoria: true, min: 5, max: 500 },
        { id: 37, tipo: 'checkbox', pergunta: 'Quais tipos de acomodações serão oferecidas?', opcoes: ['Quarto standard', 'Quarto superior', 'Suíte júnior', 'Suíte master', 'Suíte presidencial', 'Apartamento', 'Chalé', 'Villa'], obrigatoria: true },
        { id: 38, tipo: 'number', pergunta: 'Qual é a metragem média desejada para quarto standard (m²)?', obrigatoria: true, min: 15, max: 60 },
        { id: 39, tipo: 'radio', pergunta: 'Haverá acomodações para PCD?', opcoes: ['Não', 'Mínimo exigido por lei', 'Acima do mínimo legal', 'Foco em acessibilidade'], obrigatoria: true },
        { id: 40, tipo: 'checkbox', pergunta: 'Quais áreas sociais serão incluídas?', opcoes: ['Lobby/recepção', 'Restaurante', 'Bar', 'Lounge', 'Sala de jogos', 'Biblioteca', 'Business center', 'Sala de convenções'], obrigatoria: true },
        { id: 41, tipo: 'checkbox', pergunta: 'Quais áreas de lazer serão oferecidas?', opcoes: ['Piscina', 'Spa', 'Academia', 'Sauna', 'Quadra esportiva', 'Playground', 'Jardim', 'Trilhas'], obrigatoria: false },
        { id: 42, tipo: 'radio', pergunta: 'Haverá estacionamento?', opcoes: ['Não', 'Descoberto', 'Coberto', 'Subterrâneo', 'Misto'], obrigatoria: true },
        { id: 43, tipo: 'number', pergunta: 'Quantas vagas de estacionamento?', obrigatoria: true, min: 0, max: 500 }
      ]
    },
    {
      id: 'areas-operacionais',
      nome: '⚙️ Áreas Operacionais',
      descricao: 'Definição das áreas de apoio e funcionamento',
      icon: '⚙️',
      obrigatoria: true,
      perguntas: [
        { id: 44, tipo: 'checkbox', pergunta: 'Quais áreas de serviço são necessárias?', opcoes: ['Lavanderia', 'Cozinha industrial', 'Despensa', 'Câmara frigorífica', 'Depósito', 'Almoxarifado', 'Lixo'], obrigatoria: true },
        { id: 45, tipo: 'checkbox', pergunta: 'Quais áreas administrativas serão incluídas?', opcoes: ['Gerência', 'Administração', 'RH', 'Financeiro', 'Reservas', 'Marketing', 'Segurança'], obrigatoria: true },
        { id: 46, tipo: 'checkbox', pergunta: 'Quais áreas técnicas são necessárias?', opcoes: ['Casa de máquinas', 'Subestação', 'Central de gás', 'Reservatório de água', 'ETE', 'Central de ar'], obrigatoria: true },
        { id: 47, tipo: 'radio', pergunta: 'Haverá apartamentos para funcionários?', opcoes: ['Não', 'Poucos (1-3)', 'Moderado (4-10)', 'Muitos (+10)'], obrigatoria: true },
        { id: 48, tipo: 'radio', pergunta: 'Será necessária área para fornecedores?', opcoes: ['Não', 'Acesso básico', 'Área específica', 'Doca de carga'], obrigatoria: true }
      ]
    },
    {
      id: 'instalacoes-tecnicas',
      nome: '🔧 Instalações Técnicas',
      descricao: 'Especificações técnicas e sistemas prediais',
      icon: '🔧',
      obrigatoria: true,
      perguntas: [
        { id: 49, tipo: 'radio', pergunta: 'Qual sistema de climatização será adotado?', opcoes: ['Ventilação natural', 'Ventiladores', 'Split', 'VRF', 'Central de ar', 'Misto'], obrigatoria: true },
        { id: 50, tipo: 'radio', pergunta: 'Qual sistema de aquecimento de água?', opcoes: ['Elétrico', 'Gás', 'Solar', 'Bomba de calor', 'Misto'], obrigatoria: true },
        { id: 51, tipo: 'radio', pergunta: 'Haverá geração de energia?', opcoes: ['Não', 'Gerador de emergência', 'Solar fotovoltaica', 'Eólica', 'Misto'], obrigatoria: true },
        { id: 52, tipo: 'checkbox', pergunta: 'Quais sistemas de segurança serão instalados?', opcoes: ['CFTV', 'Alarme', 'Controle de acesso', 'Cerca elétrica', 'Segurança 24h', 'Cofre'], obrigatoria: true },
        { id: 53, tipo: 'radio', pergunta: 'Qual sistema de automação?', opcoes: ['Não haverá', 'Básico', 'Intermediário', 'Avançado', 'Smart hotel'], obrigatoria: true },
        { id: 54, tipo: 'radio', pergunta: 'Qual sistema de som ambiente?', opcoes: ['Não haverá', 'Áreas sociais', 'Todo o hotel', 'Personalizado por ambiente'], obrigatoria: true }
      ]
    },
    {
      id: 'sustentabilidade',
      nome: '🌱 Sustentabilidade',
      descricao: 'Estratégias de sustentabilidade e eficiência',
      icon: '🌱',
      obrigatoria: true,
      perguntas: [
        { id: 55, tipo: 'radio', pergunta: 'Qual é a importância da sustentabilidade no projeto?', opcoes: ['Baixa', 'Moderada', 'Alta', 'Muito alta', 'Fundamental'], obrigatoria: true },
        { id: 56, tipo: 'checkbox', pergunta: 'Quais estratégias sustentáveis serão adotadas?', opcoes: ['Reuso de água', 'Captação de chuva', 'Energia solar', 'Materiais locais', 'Ventilação natural', 'Paisagismo nativo'], obrigatoria: false },
        { id: 57, tipo: 'radio', pergunta: 'Haverá tratamento de efluentes?', opcoes: ['Não', 'Sistema básico', 'ETE completa', 'Reuso total'], obrigatoria: true },
        { id: 58, tipo: 'radio', pergunta: 'Qual estratégia para resíduos sólidos?', opcoes: ['Coleta convencional', 'Separação básica', 'Compostagem', 'Zero waste'], obrigatoria: true }
      ]
    },
    {
      id: 'orcamento-cronograma',
      nome: '💰 Orçamento e Cronograma',
      descricao: 'Definições financeiras e de prazo',
      icon: '💰',
      obrigatoria: true,
      perguntas: [
        { id: 59, tipo: 'number', pergunta: 'Qual é o orçamento total disponível (R$)?', obrigatoria: true, min: 500000, max: 50000000 },
        { id: 60, tipo: 'radio', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento bancário', 'Investidores', 'Misto'], obrigatoria: true },
        { id: 61, tipo: 'number', pergunta: 'Qual é o prazo desejado para conclusão (meses)?', obrigatoria: true, min: 12, max: 60 },
        { id: 62, tipo: 'radio', pergunta: 'Há flexibilidade no cronograma?', opcoes: ['Nenhuma', 'Pouca', 'Moderada', 'Alta'], obrigatoria: true },
        { id: 63, tipo: 'radio', pergunta: 'Quando deve iniciar a operação?', opcoes: ['Logo após conclusão', '6 meses após', '1 ano após', 'Data específica'], obrigatoria: true }
      ]
    },
    {
      id: 'normas-legais',
      nome: '📜 Normas e Aspectos Legais',
      descricao: 'Conformidade com normas e regulamentações',
      icon: '📜',
      obrigatoria: true,
      perguntas: [
        { id: 64, tipo: 'radio', pergunta: 'O terreno está regularizado?', opcoes: ['Sim', 'Em processo', 'Não', 'Não sei'], obrigatoria: true },
        { id: 65, tipo: 'radio', pergunta: 'Há licenças ambientais necessárias?', opcoes: ['Não necessário', 'Em andamento', 'Já obtida', 'Não iniciado'], obrigatoria: true },
        { id: 66, tipo: 'radio', pergunta: 'O projeto seguirá normas de acessibilidade?', opcoes: ['Mínimo legal', 'Acima do mínimo', 'Desenho universal'], obrigatoria: true },
        { id: 67, tipo: 'radio', pergunta: 'Há restrições do plano diretor?', opcoes: ['Não há', 'Poucas', 'Moderadas', 'Muitas', 'Não sei'], obrigatoria: true },
        { id: 68, tipo: 'radio', pergunta: 'Será necessário EIV (Estudo de Impacto de Vizinhança)?', opcoes: ['Não', 'Sim', 'Não sei'], obrigatoria: true }
      ]
    },
    {
      id: 'observacoes-finais',
      nome: '📝 Observações Finais',
      descricao: 'Informações adicionais e considerações especiais',
      icon: '📝',
      obrigatoria: false,
      perguntas: [
        { id: 69, tipo: 'textarea', pergunta: 'Há alguma exigência específica não mencionada?', obrigatoria: false, placeholder: 'Descreva requisitos especiais' },
        { id: 70, tipo: 'textarea', pergunta: 'Há referências de projetos que admira?', obrigatoria: false, placeholder: 'Hotéis, pousadas ou projetos de referência' },
        { id: 71, tipo: 'textarea', pergunta: 'Observações adicionais sobre o projeto', obrigatoria: false, placeholder: 'Qualquer informação relevante não abordada' },
        { id: 72, tipo: 'radio', pergunta: 'Gostaria de agendar uma visita ao terreno?', opcoes: ['Sim, urgente', 'Sim, sem pressa', 'Não necessário', 'Já foi visitado'], obrigatoria: false }
      ]
    }
  ]
};

