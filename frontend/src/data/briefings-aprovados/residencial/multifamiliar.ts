// BRIEFING APROVADO: RESIDENCIAL - MULTIFAMILIAR (VERSÃO COMPLETA)
// Convertido do formato markdown para TypeScript - 267 perguntas
// Especializado para empreendimentos imobiliários residenciais multifamiliares

import { BriefingCompleto } from '../../../types/briefing';

export const BRIEFING_RESIDENCIAL_MULTIFAMILIAR: BriefingCompleto = {
  id: 'residencial-multifamiliar-completo',
  tipologia: 'residencial',
  subtipo: 'multifamiliar',
  padrao: 'profissional',
  nome: 'Plano de Necessidades - Residencial / Multifamiliar (Completo)',
  descricao: 'Briefing profissional especializado para empreendimentos residenciais multifamiliares - prédios, condomínios e conjuntos habitacionais com foco no mercado imobiliário brasileiro.',
  totalPerguntas: 157,
  tempoEstimado: '60-90 min',
  versao: '2.0',
  criadoEm: '2024-12-30',
  atualizadoEm: '2024-12-30',
  metadata: {
    tags: ['residencial', 'multifamiliar', 'condominio', 'predio', 'apartamentos', 'casas', 'incorporacao', 'imobiliario', 'vgv'],
    categoria: 'residencial',
    complexidade: 'muito_alta',
    publico: ['arquitetos', 'incorporadores', 'construtoras', 'investidores_imobiliarios', 'empreendedores']
  },
  secoes: [
    {
      id: 'qualificacao-inicial',
      nome: '🎯 Qualificação Inicial do Empreendedor/Cliente',
      descricao: 'Avaliação da experiência e posicionamento da empresa no mercado imobiliário',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        { id: 1, tipo: 'radio', pergunta: 'Qual é a experiência da empresa com empreendimentos imobiliários de porte semelhante?', opcoes: ['Nenhuma experiência', 'Primeira experiência neste segmento', 'Experiência básica (1-3 projetos)', 'Experiência intermediária (4-10 projetos)', 'Experiência avançada (mais de 10 projetos)', 'Líder no segmento'], obrigatoria: true },
        { id: 2, tipo: 'textarea', pergunta: 'Qual o histórico de projetos concluídos e o posicionamento da marca no mercado?', obrigatoria: true, placeholder: 'Descreva os principais projetos e posicionamento da marca' },
        { id: 3, tipo: 'textarea', pergunta: 'Quem são os decisores principais e qual é o processo de governança para aprovações?', obrigatoria: true, placeholder: 'Descreva sócios, conselho, processo decisório' },
        { id: 4, tipo: 'radio', pergunta: 'Qual é o modelo de negócio do empreendimento?', opcoes: ['Venda na planta', 'Venda após construção', 'Locação/renda', 'Multipropriedade', 'Modelo misto', 'Outro modelo'], obrigatoria: true },
        { id: 5, tipo: 'textarea', pergunta: 'Qual é o público-alvo principal para este empreendimento?', obrigatoria: true, placeholder: 'Perfil demográfico, renda, estilo de vida, composição familiar' },
        { id: 6, tipo: 'radio', pergunta: 'Qual o posicionamento de mercado desejado?', opcoes: ['Inovador/diferenciado', 'Tradicional/consolidado', 'Focado em nicho específico', 'Custo-benefício', 'Premium/luxo', 'Sustentável/green'], obrigatoria: true },
        { id: 7, tipo: 'radio', pergunta: 'Existe uma equipe interna de engenharia/arquitetura?', opcoes: ['Não possui', 'Equipe básica', 'Equipe completa', 'Equipe especializada'], obrigatoria: true },
        { id: 8, tipo: 'radio', pergunta: 'Qual é a disponibilidade da equipe decisória para reuniões?', opcoes: ['Muito limitada', 'Limitada', 'Moderada', 'Alta', 'Total'], obrigatoria: true },
        { id: 9, tipo: 'radio', pergunta: 'Há compreensão sobre os prazos e complexidade dos processos de aprovação?', opcoes: ['Nenhuma compreensão', 'Compreensão básica', 'Compreensão intermediária', 'Compreensão avançada', 'Domínio completo'], obrigatoria: true },
        { id: 10, tipo: 'radio', pergunta: 'Qual é a expectativa sobre o nível de inovação arquitetônica?', opcoes: ['Conservador', 'Moderadamente inovador', 'Inovador', 'Muito inovador', 'Vanguarda'], obrigatoria: true },
        { id: 11, tipo: 'radio', pergunta: 'Há interesse em obter certificações de renome?', opcoes: ['Não há interesse', 'Interesse futuro', 'Interesse moderado', 'Alta prioridade', 'Obrigatório'], obrigatoria: true },
        { id: 12, tipo: 'radio', pergunta: 'Qual a importância da identidade visual como ferramenta de marketing?', opcoes: ['Baixa importância', 'Importância moderada', 'Alta importância', 'Crucial para o sucesso'], obrigatoria: true },
        { id: 13, tipo: 'radio', pergunta: 'Existe uma estratégia de marketing e vendas já definida?', opcoes: ['Não definida', 'Em desenvolvimento', 'Parcialmente definida', 'Completamente definida'], obrigatoria: true }
      ]
    },
    {
      id: 'dados-basicos',
      nome: '📋 Dados Básicos do Empreendimento',
      descricao: 'Informações fundamentais sobre o empreendimento e a empresa',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        { id: 14, tipo: 'text', pergunta: 'Qual é a Razão Social e CNPJ da empresa/SPE responsável?', obrigatoria: true, placeholder: 'Razão social completa e CNPJ' },
        { id: 15, tipo: 'text', pergunta: 'Qual o endereço comercial, e-mail e telefone de contato do gestor principal?', obrigatoria: true, placeholder: 'Dados completos de contato' },
        { id: 16, tipo: 'text', pergunta: 'Qual a denominação preliminar do empreendimento?', obrigatoria: true, placeholder: 'Nome do empreendimento' },
        { id: 17, tipo: 'radio', pergunta: 'Qual o regime de construção?', opcoes: ['Administração', 'Preço de custo', 'Empreitada global', 'Regime misto', 'A definir'], obrigatoria: true },
        { id: 18, tipo: 'textarea', pergunta: 'Qual o público-alvo detalhado?', obrigatoria: true, placeholder: 'Faixa de renda, composição familiar, valores, estilo de vida' },
        { id: 19, tipo: 'radio', pergunta: 'O empreendimento será desenvolvido em fases?', opcoes: ['Não, fase única', 'Sim, 2 fases', 'Sim, 3 fases', 'Sim, mais de 3 fases'], obrigatoria: true },
        { id: 20, tipo: 'moeda', pergunta: 'Qual o Valor Geral de Vendas (VGV) estimado ou pretendido?', obrigatoria: true, placeholder: 'R$ 0,00' },
        { id: 21, tipo: 'radio', pergunta: 'Existe um Estudo de Viabilidade Econômica e de Mercado já realizado?', opcoes: ['Não foi realizado', 'Em desenvolvimento', 'Realizado internamente', 'Realizado por consultoria', 'Múltiplos estudos'], obrigatoria: true },
        { id: 22, tipo: 'radio', pergunta: 'Há sócios ou investidores externos com poder de decisão?', opcoes: ['Não', 'Sim, sócios minoritários', 'Sim, sócios majoritários', 'Sim, investidores externos', 'Estrutura complexa'], obrigatoria: true },
        { id: 23, tipo: 'radio', pergunta: 'Qual o perfil de investimento para este projeto?', opcoes: ['Conservador', 'Moderado', 'Arrojado', 'Muito arrojado'], obrigatoria: true },
        { id: 24, tipo: 'radio', pergunta: 'Há assessoria jurídica e contábil especializada já contratada?', opcoes: ['Não contratada', 'Em processo de contratação', 'Já contratada', 'Equipe interna'], obrigatoria: true }
      ]
    },
    {
      id: 'viabilidade-financeira',
      nome: '💰 Viabilidade Financeira e Orçamentária',
      descricao: 'Análise detalhada dos aspectos financeiros e orçamentários do empreendimento',
      icon: '💰',
      obrigatoria: true,
      perguntas: [
        { id: 25, tipo: 'moeda', pergunta: 'Qual é o orçamento total estimado para o desenvolvimento?', obrigatoria: true, placeholder: 'Terreno, projetos, construção, marketing, legalização' },
        { id: 26, tipo: 'moeda', pergunta: 'Qual o custo máximo de obra por metro quadrado (CUB) admitido?', obrigatoria: true, placeholder: 'R$ 0,00 por m²' },
        { id: 27, tipo: 'radio', pergunta: 'O orçamento contempla todos os projetos?', opcoes: ['Apenas arquitetônico', 'Arquitetônico + complementares', 'Todos os projetos + paisagismo', 'Pacote completo + interiores'], obrigatoria: true },
        { id: 28, tipo: 'radio', pergunta: 'Como será a capitalização do projeto?', opcoes: ['100% recursos próprios', 'Financiamento à produção', 'FII - Fundo de Investimento', 'Captação mista', 'Outros investidores'], obrigatoria: true },
        { id: 29, tipo: 'radio', pergunta: 'Existe um cronograma financeiro atrelado ao cronograma físico?', opcoes: ['Não existe', 'Em desenvolvimento', 'Cronograma básico', 'Cronograma detalhado'], obrigatoria: true },
        { id: 30, tipo: 'radio', pergunta: 'Qual a reserva de contingência prevista?', opcoes: ['Sem reserva', '5-10%', '10-15%', '15-20%', 'Acima de 20%'], obrigatoria: true },
        { id: 31, tipo: 'radio', pergunta: 'Qual o percentual destinado às áreas comuns e lazer?', opcoes: ['5-10%', '10-15%', '15-20%', '20-25%', 'Acima de 25%'], obrigatoria: true },
        { id: 32, tipo: 'moeda', pergunta: 'Qual o orçamento para stand de vendas e apartamento decorado?', obrigatoria: true, placeholder: 'R$ 0,00' },
        { id: 33, tipo: 'radio', pergunta: 'Existe orçamento para tecnologias inovadoras e certificações?', opcoes: ['Não previsto', 'Orçamento básico', 'Orçamento moderado', 'Orçamento robusto'], obrigatoria: true },
        { id: 34, tipo: 'radio', pergunta: 'Qual a estratégia para controle de custos?', opcoes: ['Controle básico', 'Gestão terceirizada', 'Equipe interna', 'Sistema integrado'], obrigatoria: true },
        { id: 35, tipo: 'radio', pergunta: 'Há flexibilidade orçamentária para agregar valor?', opcoes: ['Nenhuma flexibilidade', 'Flexibilidade limitada', 'Flexibilidade moderada', 'Alta flexibilidade'], obrigatoria: true },
        { id: 36, tipo: 'radio', pergunta: 'Qual é a prioridade estratégica?', opcoes: ['Menor custo de construção', 'Menor custo de manutenção', 'Maior valor percebido', 'Equilíbrio entre todos'], obrigatoria: true }
      ]
    },
    {
      id: 'terreno-localizacao',
      nome: '🏞️ Terreno, Localização e Análise Urbanística',
      descricao: 'Análise completa do terreno e legislação urbanística aplicável',
      icon: '🏞️',
      obrigatoria: true,
      perguntas: [
        { id: 37, tipo: 'text', pergunta: 'Endereço completo, CEP e matrícula do(s) imóvel(is)', obrigatoria: true, placeholder: 'Endereço completo com CEP e matrícula' },
        { id: 38, tipo: 'text', pergunta: 'Área total e dimensões do terreno (conforme levantamento topográfico)', obrigatoria: true, placeholder: 'Metragem e dimensões exatas' },
        { id: 39, tipo: 'radio', pergunta: 'Levantamento planialtimétrico e cadastral está atualizado?', opcoes: ['Não realizado', 'Em andamento', 'Realizado e atualizado', 'Necessita atualização'], obrigatoria: true },
        { id: 40, tipo: 'text', pergunta: 'Coeficiente de Aproveitamento (C.A.) básico e máximo', obrigatoria: true, placeholder: 'C.A. básico e máximo conforme legislação' },
        { id: 41, tipo: 'text', pergunta: 'Taxa de Ocupação (T.O.) e Taxa de Permeabilidade (T.P.)', obrigatoria: true, placeholder: 'T.O. e T.P. conforme zoneamento' },
        { id: 42, tipo: 'text', pergunta: 'Gabarito de altura e número máximo de pavimentos', obrigatoria: true, placeholder: 'Altura máxima e número de pavimentos permitidos' },
        { id: 43, tipo: 'text', pergunta: 'Recuos obrigatórios (frontais, laterais, fundo)', obrigatoria: true, placeholder: 'Recuos mínimos exigidos' },
        { id: 44, tipo: 'radio', pergunta: 'Outorga Onerosa ou Transferência do Direito de Construir são aplicáveis?', opcoes: ['Não aplicável', 'Outorga Onerosa aplicável', 'TDC aplicável', 'Ambos aplicáveis', 'Em análise'], obrigatoria: true },
        { id: 45, tipo: 'textarea', pergunta: 'Existem restrições ambientais, históricas ou de vizinhança?', obrigatoria: true, placeholder: 'Tombamento, APA, APP, cone aeroporto, etc.' },
        { id: 46, tipo: 'textarea', pergunta: 'Infraestrutura urbana disponível no entorno imediato', obrigatoria: true, placeholder: 'Transporte, escolas, hospitais, comércio, parques' },
        { id: 47, tipo: 'radio', pergunta: 'Estudo de sondagem do solo (SPT) já foi realizado?', opcoes: ['Não realizado', 'Em andamento', 'Realizado', 'Necessita atualização'], obrigatoria: true },
        { id: 48, tipo: 'textarea', pergunta: 'Construções vizinhas que possam impactar o projeto', obrigatoria: true, placeholder: 'Sombreamento, vistas, riscos, logística' },
        { id: 49, tipo: 'text', pergunta: 'Orientação solar e ventos predominantes no terreno', obrigatoria: true, placeholder: 'Orientação solar e direção dos ventos' },
        { id: 50, tipo: 'textarea', pergunta: 'Ruídos ou outros fatores externos a serem mitigados', obrigatoria: true, placeholder: 'Ruídos, odores, vibração, etc.' },
        { id: 51, tipo: 'radio', pergunta: 'É necessário Estudo de Impacto de Vizinhança (EIV) ou Relatório de Impacto de Trânsito (RIT)?', opcoes: ['Não necessário', 'EIV necessário', 'RIT necessário', 'Ambos necessários', 'Em análise'], obrigatoria: true },
        { id: 52, tipo: 'textarea', pergunta: 'Planos de desenvolvimento urbano ou obras públicas para a região', obrigatoria: true, placeholder: 'Projetos urbanos que possam valorizar/desvalorizar' },
        { id: 53, tipo: 'radio', pergunta: 'Padrão construtivo e perfil socioeconômico da vizinhança', opcoes: ['Padrão popular', 'Padrão médio', 'Padrão médio-alto', 'Padrão alto', 'Padrão luxo'], obrigatoria: true },
        { id: 54, tipo: 'radio', pergunta: 'Qualidade e capacidade dos serviços das concessionárias', opcoes: ['Deficiente', 'Regular', 'Boa', 'Excelente'], obrigatoria: true },
        { id: 55, tipo: 'textarea', pergunta: 'Análise da topografia e declividade do terreno', obrigatoria: true, placeholder: 'Características topográficas relevantes' },
        { id: 56, tipo: 'radio', pergunta: 'Há necessidade de contenções ou movimentação de terra significativa?', opcoes: ['Não necessário', 'Contenções simples', 'Contenções complexas', 'Grande movimentação terra', 'Análise detalhada necessária'], obrigatoria: true }
      ]
    },
    {
      id: 'programa-unidades',
      nome: '🏠 Programa Arquitetônico - Unidades Privativas',
      descricao: 'Definição do programa e tipologias das unidades residenciais',
      icon: '🏠',
      obrigatoria: true,
      perguntas: [
        { id: 57, tipo: 'textarea', pergunta: 'Mix de tipologias de apartamentos/casas e quantidade de cada', obrigatoria: true, placeholder: 'Ex: 20 studios, 40 aptos 2 dorms, 30 aptos 3 dorms' },
        { id: 58, tipo: 'text', pergunta: 'Metragem quadrada privativa desejada (mínima, média, máxima) para cada tipologia', obrigatoria: true, placeholder: 'Áreas por tipologia' },
        { id: 59, tipo: 'numero', pergunta: 'Quantos Studios serão ofertados?', obrigatoria: false, placeholder: '0' },
        { id: 60, tipo: 'numero', pergunta: 'Quantos apartamentos de 1 dormitório serão ofertados?', obrigatoria: false, placeholder: '0' },
        { id: 61, tipo: 'numero', pergunta: 'Quantos apartamentos de 2 dormitórios serão ofertados?', obrigatoria: false, placeholder: '0' },
        { id: 62, tipo: 'numero', pergunta: 'Quantos apartamentos de 3 dormitórios serão ofertados?', obrigatoria: false, placeholder: '0' },
        { id: 63, tipo: 'numero', pergunta: 'Quantos apartamentos de 4+ dormitórios serão ofertados?', obrigatoria: false, placeholder: '0' },
        { id: 64, tipo: 'radio', pergunta: 'Haverá unidades especiais (coberturas, duplex, garden)?', opcoes: ['Não', 'Coberturas simples', 'Coberturas duplex', 'Gardens', 'Múltiplas opções'], obrigatoria: true },
        { id: 65, tipo: 'textarea', pergunta: 'Quais os diferenciais funcionais desejados nas unidades?', obrigatoria: true, placeholder: 'Automação, tomadas USB, toalheiro aquecido, etc.' },
        { id: 66, tipo: 'radio', pergunta: 'As vagas de garagem serão vinculadas, livres ou sorteadas?', opcoes: ['Vinculadas às unidades', 'Livres para escolha', 'Sorteadas', 'Sistema misto'], obrigatoria: true },
        { id: 67, tipo: 'radio', pergunta: 'Haverá depósitos privativos nos subsolos ou pavimentos?', opcoes: ['Não', 'Depósitos pequenos', 'Depósitos médios', 'Depósitos grandes'], obrigatoria: true },
        { id: 68, tipo: 'radio', pergunta: 'Qual a importância da flexibilidade de planta?', opcoes: ['Não importante', 'Pouco importante', 'Importante', 'Muito importante'], obrigatoria: true },
        { id: 69, tipo: 'radio', pergunta: 'Estratégia para garantir iluminação e ventilação natural', opcoes: ['Básica', 'Intermediária', 'Avançada', 'Máxima performance'], obrigatoria: true },
        { id: 70, tipo: 'radio', pergunta: 'Previsão para infraestrutura de ar condicionado', opcoes: ['Não previsto', 'Pontos básicos', 'Rede frigorígena', 'Laje técnica'], obrigatoria: true },
        { id: 71, tipo: 'radio', pergunta: 'Tipo de cozinha preferido nas unidades', opcoes: ['Cozinha fechada', 'Cozinha aberta', 'Cozinha americana', 'Flexível conforme tipologia'], obrigatoria: true },
        { id: 72, tipo: 'radio', pergunta: 'Varanda será item obrigatório em todas as unidades?', opcoes: ['Não obrigatório', 'Varanda simples', 'Varanda gourmet', 'Diferentes tipos'], obrigatoria: true },
        { id: 73, tipo: 'radio', pergunta: 'Quantas vagas de garagem por unidade (média)?', opcoes: ['Sem vaga', '1 vaga', '2 vagas', '3+ vagas', 'Variável por tipologia'], obrigatoria: true }
      ]
    },
    {
      id: 'programa-areas-comuns',
      nome: '🏢 Programa Arquitetônico - Áreas Comuns e Lazer',
      descricao: 'Definição das áreas comuns, lazer e serviços do condomínio',
      icon: '🏢',
      obrigatoria: true,
      perguntas: [
        { id: 74, tipo: 'checkbox', pergunta: 'Acessos e Segurança desejados:', opcoes: ['Portaria 24h presencial', 'Portaria remota', 'Clausura pedestres', 'Clausura veículos', 'Acesso serviço independente', 'Central CFTV'], obrigatoria: true },
        { id: 75, tipo: 'checkbox', pergunta: 'Lazer Fundamental:', opcoes: ['Salão de festas', 'Copa de apoio', 'Churrasqueira', 'Espaço gourmet', 'Playground', 'Área de convivência'], obrigatoria: true },
        { id: 76, tipo: 'checkbox', pergunta: 'Lazer Aquático:', opcoes: ['Piscina adulto', 'Piscina infantil', 'Prainha', 'Raia de natação', 'Deck molhado', 'Solarium', 'Piscina aquecida'], obrigatoria: true },
        { id: 77, tipo: 'checkbox', pergunta: 'Lazer Esportivo:', opcoes: ['Quadra poliesportiva', 'Academia/fitness', 'Cardio', 'Musculação', 'Funcional', 'Beach tennis', 'Vôlei de areia'], obrigatoria: true },
        { id: 78, tipo: 'checkbox', pergunta: 'Bem-estar e Relaxamento:', opcoes: ['Sauna seca', 'Sauna úmida', 'Spa', 'Sala de massagem', 'Espaço zen/yoga', 'Ofurô'], obrigatoria: true },
        { id: 79, tipo: 'checkbox', pergunta: 'Social e Conveniência:', opcoes: ['Salão de jogos adulto', 'Salão jogos juvenil', 'Cinema', 'Coworking', 'Business center', 'Brinquedoteca', 'Bicicletário', 'Adega/wine bar'], obrigatoria: true },
        { id: 80, tipo: 'checkbox', pergunta: 'Serviços (Pay-Per-Use ou Inclusos):', opcoes: ['Lavanderia coletiva', 'Mini mercado autônomo', 'Pet place', 'Pet care', 'Oficina reparos', 'Delivery space refrigerado'], obrigatoria: true },
        { id: 81, tipo: 'checkbox', pergunta: 'Áreas Externas e Paisagismo:', opcoes: ['Praças de convivência', 'Jardins contemplativos', 'Redário', 'Horta comunitária', 'Pomar', 'Fire pit', 'Áreas de piquenique'], obrigatoria: true },
        { id: 82, tipo: 'checkbox', pergunta: 'Infraestrutura de Apoio ao Condomínio:', opcoes: ['Vestiários funcionários', 'Copa funcionários', 'Administração/síndico', 'DML por andar', 'Casa de máquinas', 'Central de gás'], obrigatoria: true },
        { id: 83, tipo: 'radio', pergunta: 'Qual a hierarquia de sofisticação desejada para as áreas comuns?', opcoes: ['Básica/funcional', 'Intermediária', 'Sofisticada', 'Luxuosa'], obrigatoria: true },
        { id: 84, tipo: 'radio', pergunta: 'Como será o controle de acesso às áreas comuns?', opcoes: ['Controle básico', 'Biometria', 'Agendamento por app', 'Sistema integrado'], obrigatoria: true },
        { id: 85, tipo: 'radio', pergunta: 'Prioridade para o paisagismo do empreendimento', opcoes: ['Baixa prioridade', 'Moderada', 'Alta prioridade', 'Diferencial competitivo'], obrigatoria: true },
        { id: 86, tipo: 'radio', pergunta: 'Nível de automação das áreas comuns', opcoes: ['Básico', 'Intermediário', 'Avançado', 'Smart building'], obrigatoria: true },
        { id: 87, tipo: 'radio', pergunta: 'Política para animais de estimação', opcoes: ['Não permitido', 'Permitido com restrições', 'Pet friendly', 'Pet oriented'], obrigatoria: true },
        { id: 88, tipo: 'texto_longo', pergunta: 'Observações específicas sobre as áreas comuns', obrigatoria: false, placeholder: 'Detalhes específicos, restrições ou diferenciais desejados' },
        { id: 89, tipo: 'radio', pergunta: 'Prioridade para sustentabilidade nas áreas comuns', opcoes: ['Não prioritário', 'Algumas práticas', 'Moderadamente sustentável', 'Altamente sustentável'], obrigatoria: true }
      ]
    },
    {
      id: 'estilo-materialidade',
      nome: '🎨 Estilo, Estética e Materialidade',
      descricao: 'Definição do conceito arquitetônico, estilo e materiais',
      icon: '🎨',
      obrigatoria: true,
      perguntas: [
        { id: 90, tipo: 'radio', pergunta: 'Qual o estilo arquitetônico pretendido?', opcoes: ['Contemporâneo', 'Moderno', 'Neoclássico', 'Industrial', 'Minimalista', 'Eclético'], obrigatoria: true },
        { id: 91, tipo: 'radio', pergunta: 'Imagem que a fachada deve transmitir', opcoes: ['Sofisticação', 'Tecnologia/modernidade', 'Aconchego/residencial', 'Sobriedade', 'Design/arte', 'Sustentabilidade'], obrigatoria: true },
        { id: 92, tipo: 'textarea', pergunta: 'Paleta de cores e materiais predominantes para as fachadas', obrigatoria: true, placeholder: 'Cores e materiais preferidos para embasamento e coroamento' },
        { id: 93, tipo: 'radio', pergunta: 'Padrão de acabamento para as áreas comuns', opcoes: ['Básico/funcional', 'Intermediário', 'Alto padrão', 'Luxo'], obrigatoria: true },
        { id: 94, tipo: 'radio', pergunta: 'Padrão de acabamento nas unidades privativas', opcoes: ['Básico', 'Intermediário', 'Alto padrão', 'Premium'], obrigatoria: true },
        { id: 95, tipo: 'radio', pergunta: 'Haverá programa de personalização de acabamentos?', opcoes: ['Não', 'Personalização básica', 'Personalização moderada', 'Personalização completa'], obrigatoria: true },
        { id: 96, tipo: 'radio', pergunta: 'Importância do projeto de paisagismo', opcoes: ['Baixa importância', 'Importância moderada', 'Alta importância', 'Diferencial competitivo'], obrigatoria: true },
        { id: 97, tipo: 'textarea', pergunta: 'Preferência por materiais específicos', obrigatoria: true, placeholder: 'Madeira certificada, concreto aparente, brises, vidro, etc.' },
        { id: 98, tipo: 'radio', pergunta: 'Importância da comunicação visual e sinalização integrada', opcoes: ['Não prioritário', 'Moderadamente importante', 'Muito importante', 'Diferencial de marca'], obrigatoria: true },
        { id: 99, tipo: 'radio', pergunta: 'Prioridade: atemporalidade vs tendências de mercado', opcoes: ['Foco em tendências atuais', 'Equilibrio', 'Foco na atemporalidade', 'Design inovador'], obrigatoria: true }
      ]
    },
    {
      id: 'sistemas-prediais',
      nome: '⚡ Sistemas Prediais, Instalações e Tecnologia',
      descricao: 'Definição dos sistemas técnicos e tecnológicos do empreendimento',
      icon: '⚡',
      obrigatoria: true,
      perguntas: [
        { id: 100, tipo: 'checkbox', pergunta: 'Sistemas de Segurança desejados:', opcoes: ['CFTV com análise de vídeo', 'Controle de acesso biométrico', 'Reconhecimento facial', 'QR Code', 'Segurança perimetral', 'Guarita blindada'], obrigatoria: true },
      ]
    },
    {
      id: 'memorial-acabamentos',
      nome: '📋 Memorial Descritivo e Acabamentos',
      descricao: 'Especificação dos acabamentos e padrões de entrega',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        { id: 135, tipo: 'textarea', pergunta: 'Padrão de pisos para áreas sociais das unidades', obrigatoria: true, placeholder: 'Especificar tipo, marca e modelo de referência' },
        { id: 136, tipo: 'textarea', pergunta: 'Padrão de pisos para áreas íntimas das unidades', obrigatoria: true, placeholder: 'Especificar tipo, marca e modelo de referência' },
        { id: 137, tipo: 'textarea', pergunta: 'Padrão de pisos para áreas molhadas das unidades', obrigatoria: true, placeholder: 'Especificar tipo, marca e modelo de referência' },
        { id: 138, tipo: 'textarea', pergunta: 'Revestimentos de parede (cozinha, área de serviço, banheiros)', obrigatoria: true, placeholder: 'Especificar tipos e padrões' },
        { id: 139, tipo: 'textarea', pergunta: 'Bancadas (cozinha e banheiros)', obrigatoria: true, placeholder: 'Material, espessura, acabamento' },
        { id: 140, tipo: 'textarea', pergunta: 'Louças e Metais', obrigatoria: true, placeholder: 'Marcas e modelos de referência' },
        { id: 141, tipo: 'textarea', pergunta: 'Portas e Ferragens', obrigatoria: true, placeholder: 'Tipos, materiais e acabamentos' },
        { id: 142, tipo: 'textarea', pergunta: 'Esquadrias (material e tipo de vidro)', obrigatoria: true, placeholder: 'Especificar materiais e vidros' },
        { id: 143, tipo: 'radio', pergunta: 'Durabilidade vs custo inicial dos materiais', opcoes: ['Foco no menor custo inicial', 'Equilibrio', 'Foco na durabilidade', 'Máxima durabilidade'], obrigatoria: true }
      ]
    },
    {
      id: 'marketing-vendas',
      nome: '📢 Marketing e Vendas',
      descricao: 'Estratégias de marketing e ferramentas de vendas',
      icon: '📢',
      obrigatoria: true,
      perguntas: [
        { id: 144, tipo: 'checkbox', pergunta: 'Materiais de marketing que o projeto deve subsidiar:', opcoes: ['Imagens renderizadas', 'Plantas humanizadas', 'Tour virtual', 'Maquete física', 'App interativo', 'Vídeo promocional'], obrigatoria: true },
        { id: 145, tipo: 'textarea', pergunta: 'Localização e conceito para o stand de vendas', obrigatoria: true, placeholder: 'Localização, tamanho e conceito do stand' },
        { id: 146, tipo: 'radio', pergunta: 'Apartamento/casa decorado será:', opcoes: ['No stand de vendas', 'Em unidade real', 'Ambos', 'Não haverá'], obrigatoria: true },
        { id: 147, tipo: 'textarea', pergunta: 'Três principais diferenciais competitivos arquitetônicos', obrigatoria: true, placeholder: 'Argumentos de venda baseados na arquitetura' },
        { id: 148, tipo: 'radio', pergunta: 'Nome e identidade visual do empreendimento', opcoes: ['Já definidos', 'Em desenvolvimento', 'A definir', 'Será criado pelo arquiteto'], obrigatoria: true }
      ]
    },
    {
      id: 'pos-ocupacao',
      nome: '🏘️ Pós-Ocupação e Gestão Condominial',
      descricao: 'Planejamento para a vida útil e gestão do empreendimento',
      icon: '🏘️',
      obrigatoria: true,
      perguntas: [
        { id: 149, tipo: 'radio', pergunta: 'Projeto deve prever soluções para facilitar manutenção predial?', opcoes: ['Não prioritário', 'Algumas soluções', 'Soluções integradas', 'Máxima otimização'], obrigatoria: true },
        { id: 150, tipo: 'moeda', pergunta: 'Estimativa do custo condominial é premissa de projeto? (valor teto por m²)', obrigatoria: false, placeholder: 'R$ 0,00 por m²' },
        { id: 151, tipo: 'radio', pergunta: 'Projeto deve prever otimização da operação condominial?', opcoes: ['Não prioritário', 'Algumas otimizações', 'Otimizações integradas', 'Máxima eficiência'], obrigatoria: true },
        { id: 152, tipo: 'radio', pergunta: 'Administradora de condomínios pré-selecionada?', opcoes: ['Não', 'Em análise', 'Já selecionada', 'Será indicada'], obrigatoria: true }
      ]
    },
    {
      id: 'informacoes-complementares',
      nome: '📝 Informações Complementares e Premissas',
      descricao: 'Informações adicionais e premissas específicas do projeto',
      icon: '📝',
      obrigatoria: true,
      perguntas: [
        { id: 153, tipo: 'textarea', pergunta: 'Premissas ou restrições inegociáveis para este projeto', obrigatoria: true, placeholder: 'Ex: "todas as unidades devem ter vista para o mar"' },
        { id: 154, tipo: 'textarea', pergunta: 'Projetos concorrentes na região (referência positiva ou negativa)', obrigatoria: true, placeholder: 'Análise de concorrentes e diferenciais' },
        { id: 155, tipo: 'radio', pergunta: 'Interesse em registrar e documentar o processo para publicações?', opcoes: ['Não há interesse', 'Interesse moderado', 'Alto interesse', 'Prioritário'], obrigatoria: true },
        { id: 156, tipo: 'textarea', pergunta: 'Preocupações específicas, valores da empresa ou tradições', obrigatoria: true, placeholder: 'Valores que devem ser refletidos no projeto' },
        { id: 157, tipo: 'textarea', pergunta: 'Descreva em uma frase o que seria o sucesso absoluto deste empreendimento', obrigatoria: true, placeholder: 'Definição de sucesso para o projeto' }
      ]
    }
  ]
};
