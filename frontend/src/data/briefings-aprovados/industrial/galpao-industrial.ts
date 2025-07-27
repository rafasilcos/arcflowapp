import { BriefingCompleto } from '../../../types/briefing';

export const briefingGalpaoIndustrial: BriefingCompleto = {
  id: 'industrial-galpao-industrial',
  tipologia: 'industrial',
  subtipo: 'galpao-industrial',
  padrao: 'profissional',
  nome: 'Galpão Industrial Especializado',
  descricao: 'Briefing completo para projetos de galpões industriais com análise técnica, segurança industrial e normas regulamentadoras',
  totalPerguntas: 170,
  tempoEstimado: '180-240 minutos',
  versao: '1.0',
  criadoEm: '2024-12-19',
  atualizadoEm: '2024-12-19',
  metadata: {
    tags: ['galpao-industrial', 'industria', 'armazenagem', 'producao', 'logistica', 'seguranca-industrial', 'normas-regulamentadoras'],
    categoria: 'industrial',
    complexidade: 'muito_alta',
    publico: ['arquitetos-industriais', 'engenheiros-industriais', 'empresarios', 'incorporadoras']
  },
  
  secoes: [
    {
      id: 'identificacao-viabilidade',
      nome: '📋 Identificação e Viabilidade do Projeto',
      descricao: 'Dados básicos, viabilidade técnica e sustentabilidade inicial',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        { id: 1, tipo: 'select', pergunta: 'Que tipo de galpão industrial deseja?', opcoes: ['Armazenagem', 'Produção', 'Misto'], obrigatoria: true },
        { id: 2, tipo: 'text', pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + obra)', obrigatoria: true, placeholder: 'Ex: R$ 2.000.000,00' },
        { id: 3, tipo: 'select', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento'], obrigatoria: true },
        { id: 4, tipo: 'select', pergunta: 'Qual a prioridade?', opcoes: ['Prazo', 'Custo', 'Funcionalidade'], obrigatoria: true },
        { id: 5, tipo: 'select', pergunta: 'Situação legal do imóvel:', opcoes: ['Próprio', 'Alugado'], obrigatoria: true },
        { id: 6, tipo: 'number', pergunta: 'Duração do contrato de locação (Anos):', obrigatoria: false, placeholder: '10' },
        { id: 7, tipo: 'select', pergunta: 'Há restrições de zoneamento?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 8, tipo: 'checkbox', pergunta: 'Infraestrutura disponível:', opcoes: ['Água', 'Esgoto', 'Energia'], obrigatoria: true },
        { id: 9, tipo: 'select', pergunta: 'Necessita demolição de construções existentes?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 10, tipo: 'select', pergunta: 'Acesso para veículos de carga é viável?', opcoes: ['Sim', 'Não', 'Precisa adequações'], obrigatoria: true },
        { id: 11, tipo: 'select', pergunta: 'Interesse em iluminação eficiente?', opcoes: ['LED', 'Convencional'], obrigatoria: true },
        { id: 12, tipo: 'select', pergunta: 'Ventilação natural é importante?', opcoes: ['Sim', 'Não'], obrigatoria: true }
      ]
    },
    {
      id: 'perfil-negocio-operacao',
      nome: '🏭 Perfil do Negócio e Operação',
      descricao: 'Identidade da empresa e perfil operacional',
      icon: '🏭',
      obrigatoria: true,
      perguntas: [
        { id: 13, tipo: 'select', pergunta: 'Qual o posicionamento da empresa?', opcoes: ['Intermediário', 'Econômico'], obrigatoria: true },
        { id: 14, tipo: 'checkbox', pergunta: 'Quais os valores da empresa?', opcoes: ['Praticidade', 'Economia', 'Qualidade', 'Sustentabilidade'], obrigatoria: true },
        { id: 15, tipo: 'text', pergunta: 'Cores institucionais:', obrigatoria: false, placeholder: 'Ex: Azul e branco' },
        { id: 16, tipo: 'select', pergunta: 'Há outras unidades da empresa?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 17, tipo: 'select', pergunta: 'Necessidade de padronização com outras unidades?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 18, tipo: 'select', pergunta: 'Tipo de operação:', opcoes: ['Armazenagem', 'Produção', 'Mista'], obrigatoria: true },
        { id: 19, tipo: 'textarea', pergunta: 'Produtos manipulados:', obrigatoria: true, placeholder: 'Descreva os produtos e características' },
        { id: 20, tipo: 'number', pergunta: 'Número total de colaboradores:', obrigatoria: true, placeholder: '50' },
        { id: 21, tipo: 'select', pergunta: 'Turnos de trabalho:', opcoes: ['1 turno', '2 turnos', '3 turnos'], obrigatoria: true },
        { id: 22, tipo: 'text', pergunta: 'Fluxo de veículos (Caminhões/VUCs/Quantidade diária):', obrigatoria: true, placeholder: 'Ex: 10 caminhões/dia' }
      ]
    },
    {
      id: 'analise-tecnica-local',
      nome: '🏗️ Análise Técnica do Local',
      descricao: 'Características físicas, entorno e restrições técnicas',
      icon: '🏗️',
      obrigatoria: true,
      perguntas: [
        { id: 23, tipo: 'text', pergunta: 'Endereço completo do imóvel:', obrigatoria: true, placeholder: 'Endereço completo' },
        { id: 24, tipo: 'number', pergunta: 'Área total do terreno (m²):', obrigatoria: true, placeholder: '10000' },
        { id: 25, tipo: 'number', pergunta: 'Área construída existente (m²):', obrigatoria: false, placeholder: '5000' },
        { id: 26, tipo: 'select', pergunta: 'Topografia:', opcoes: ['Plana', 'Inclinada'], obrigatoria: true },
        { id: 27, tipo: 'text', pergunta: 'Orientação solar:', obrigatoria: true, placeholder: 'Norte/Sul/Leste/Oeste' },
        { id: 28, tipo: 'select', pergunta: 'Estado de conservação (se construção existente):', opcoes: ['Bom', 'Regular', 'Precisa reforma'], obrigatoria: false },
        { id: 29, tipo: 'select', pergunta: 'Tipo de localização:', opcoes: ['Distrito industrial', 'Urbana'], obrigatoria: true },
        { id: 30, tipo: 'text', pergunta: 'Acessos (Rodovias/Avenidas):', obrigatoria: true, placeholder: 'Principais acessos' },
        { id: 31, tipo: 'number', pergunta: 'Distância de centros urbanos (km):', obrigatoria: true, placeholder: '25' },
        { id: 32, tipo: 'select', pergunta: 'Perfil do entorno:', opcoes: ['Industrial', 'Comercial', 'Misto'], obrigatoria: true },
        { id: 33, tipo: 'text', pergunta: 'Limitações de construção (Gabarito/Taxa de ocupação):', obrigatoria: false, placeholder: 'Restrições municipais' },
        { id: 34, tipo: 'text', pergunta: 'Limitações de acesso (Estradas/Outras):', obrigatoria: false, placeholder: 'Restrições de acesso' }
      ]
    },
    {
      id: 'programa-arquitetonico',
      nome: '📐 Programa Arquitetônico Detalhado',
      descricao: 'Definição de áreas operacionais, administrativas, técnicas e especiais',
      icon: '📐',
      obrigatoria: true,
      perguntas: [
        { id: 35, tipo: 'number', pergunta: 'Área de armazenagem (m²):', obrigatoria: true, placeholder: '3000' },
        { id: 36, tipo: 'number', pergunta: 'Pé-direito livre necessário (metros):', obrigatoria: true, placeholder: '8' },
        { id: 37, tipo: 'number', pergunta: 'Capacidade de carga do piso (toneladas/m²):', obrigatoria: true, placeholder: '5' },
        { id: 38, tipo: 'number', pergunta: 'Área de produção (m²):', obrigatoria: false, placeholder: '1500' },
        { id: 39, tipo: 'number', pergunta: 'Área de expedição (m²):', obrigatoria: true, placeholder: '200' },
        { id: 40, tipo: 'number', pergunta: 'Docas (Quantidade):', obrigatoria: true, placeholder: '4' },
        { id: 41, tipo: 'number', pergunta: 'Escritórios administrativos (m²):', obrigatoria: true, placeholder: '150' },
        { id: 42, tipo: 'number', pergunta: 'Refeitório (Capacidade pessoas):', obrigatoria: true, placeholder: '30' },
        { id: 43, tipo: 'text', pergunta: 'Vestiários (Capacidade H/M):', obrigatoria: true, placeholder: 'Ex: 20H/10M' },
        { id: 44, tipo: 'text', pergunta: 'Sanitários (Quantidade H/M/PNE):', obrigatoria: true, placeholder: 'Ex: 3H/2M/1PNE' },
        { id: 45, tipo: 'number', pergunta: 'Portaria/Controle de acesso (m²):', obrigatoria: true, placeholder: '20' },
        { id: 46, tipo: 'number', pergunta: 'Estacionamento de veículos leves (Quantidade de vagas):', obrigatoria: true, placeholder: '25' },
        { id: 47, tipo: 'number', pergunta: 'Subestação elétrica (kVA):', obrigatoria: true, placeholder: '500' },
        { id: 48, tipo: 'number', pergunta: 'Reservatório de água (Capacidade litros):', obrigatoria: true, placeholder: '15000' },
        { id: 49, tipo: 'number', pergunta: 'Reserva de incêndio (Capacidade litros):', obrigatoria: true, placeholder: '54000' },
        { id: 50, tipo: 'number', pergunta: 'Área para compressores (m²):', obrigatoria: false, placeholder: '30' },
        { id: 51, tipo: 'number', pergunta: 'Área para manutenção (m²):', obrigatoria: true, placeholder: '100' },
        { id: 52, tipo: 'number', pergunta: 'Área para resíduos (m²):', obrigatoria: true, placeholder: '50' },
        { id: 53, tipo: 'number', pergunta: 'Área para produtos específicos (m²):', obrigatoria: false, placeholder: '200' },
        { id: 54, tipo: 'number', pergunta: 'Área para expansão futura (m²):', obrigatoria: false, placeholder: '1000' }
      ]
    },
    {
      id: 'requisitos-operacionais',
      nome: '⚙️ Requisitos Operacionais Específicos',
      descricao: 'Fluxos, processos e requisitos técnicos específicos',
      icon: '⚙️',
      obrigatoria: true,
      perguntas: [
        { id: 55, tipo: 'textarea', pergunta: 'Fluxo de recebimento:', obrigatoria: true, placeholder: 'Descreva o processo de recebimento' },
        { id: 56, tipo: 'textarea', pergunta: 'Fluxo de armazenagem:', obrigatoria: true, placeholder: 'Descreva o processo de armazenagem' },
        { id: 57, tipo: 'textarea', pergunta: 'Fluxo de produção:', obrigatoria: false, placeholder: 'Descreva o processo produtivo' },
        { id: 58, tipo: 'textarea', pergunta: 'Fluxo de expedição:', obrigatoria: true, placeholder: 'Descreva o processo de expedição' },
        { id: 59, tipo: 'textarea', pergunta: 'Fluxo de pessoas:', obrigatoria: true, placeholder: 'Descreva a circulação de colaboradores' },
        { id: 60, tipo: 'select', pergunta: 'Temperatura controlada:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 61, tipo: 'text', pergunta: 'Piso especial (Tipo/Áreas):', obrigatoria: false, placeholder: 'Ex: Epóxi nas áreas de produção' },
        { id: 62, tipo: 'select', pergunta: 'Resistência a impactos:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 63, tipo: 'select', pergunta: 'Isolamento térmico:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 64, tipo: 'select', pergunta: 'Proteção contra descargas atmosféricas:', opcoes: ['Sim', 'Não'], obrigatoria: true }
      ]
    },
    {
      id: 'sistemas-tecnicos-tecnologia',
      nome: '🔧 Sistemas Técnicos e Tecnologia',
      descricao: 'Sistemas prediais e tecnologia básica',
      icon: '🔧',
      obrigatoria: true,
      perguntas: [
        { id: 65, tipo: 'text', pergunta: 'Sistema elétrico (Tensão/Potência):', obrigatoria: true, placeholder: 'Ex: 380V/500kVA' },
        { id: 66, tipo: 'select', pergunta: 'Sistema hidráulico:', opcoes: ['Convencional', 'Especial'], obrigatoria: true },
        { id: 67, tipo: 'select', pergunta: 'Sistema de combate a incêndio:', opcoes: ['Extintores', 'Hidrantes', 'Sprinklers'], obrigatoria: true },
        { id: 68, tipo: 'select', pergunta: 'Sistema de exaustão:', opcoes: ['Básico', 'Avançado', 'Não necessário'], obrigatoria: true },
        { id: 69, tipo: 'select', pergunta: 'Ar condicionado:', opcoes: ['Split', 'Central', 'Não'], obrigatoria: true },
        { id: 70, tipo: 'select', pergunta: 'Sistema de CFTV:', opcoes: ['Básico', 'Completo', 'Não'], obrigatoria: true },
        { id: 71, tipo: 'select', pergunta: 'Controle de acesso:', opcoes: ['Básico', 'Biométrico', 'Cartão', 'Não'], obrigatoria: true },
        { id: 72, tipo: 'select', pergunta: 'Alarme:', opcoes: ['Simples', 'Monitorado', 'Não'], obrigatoria: true },
        { id: 73, tipo: 'select', pergunta: 'Sistema de gestão:', opcoes: ['Básico', 'WMS', 'ERP integrado', 'Não'], obrigatoria: true },
        { id: 74, tipo: 'select', pergunta: 'Coletores de dados:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 75, tipo: 'select', pergunta: 'Wi-Fi:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 76, tipo: 'select', pergunta: 'Infraestrutura para servidores locais:', opcoes: ['Sim', 'Não'], obrigatoria: true }
      ]
    },
    {
      id: 'estetica-design',
      nome: '🎨 Estética e Design',
      descricao: 'Estilo arquitetônico e design de interiores',
      icon: '🎨',
      obrigatoria: true,
      perguntas: [
        { id: 77, tipo: 'select', pergunta: 'Estilo arquitetônico preferido:', opcoes: ['Contemporâneo', 'Tradicional', 'Moderno'], obrigatoria: true },
        { id: 78, tipo: 'textarea', pergunta: 'Referências visuais (Anexar fotos de projetos admirados):', obrigatoria: false, placeholder: 'Descreva ou anexe referências' },
        { id: 79, tipo: 'select', pergunta: 'Materiais de acabamento preferidos:', opcoes: ['Econômicos', 'Básicos', 'Intermediários'], obrigatoria: true },
        { id: 80, tipo: 'select', pergunta: 'Cores predominantes:', opcoes: ['Neutras', 'Institucionais', 'Funcionais'], obrigatoria: true },
        { id: 81, tipo: 'select', pergunta: 'Cobertura:', opcoes: ['Metálica', 'Fibrocimento', 'Telha cerâmica'], obrigatoria: true },
        { id: 82, tipo: 'select', pergunta: 'Fachada principal:', opcoes: ['Funcional', 'Básica', 'Elaborada'], obrigatoria: true },
        { id: 83, tipo: 'select', pergunta: 'Mobiliário operacional:', opcoes: ['Modular', 'Padrão', 'Sob medida'], obrigatoria: true },
        { id: 84, tipo: 'select', pergunta: 'Mobiliário administrativo:', opcoes: ['Padrão', 'Econômico', 'Executivo'], obrigatoria: true },
        { id: 85, tipo: 'select', pergunta: 'Acabamentos internos:', opcoes: ['Básicos', 'Funcionais', 'Elaborados'], obrigatoria: true },
        { id: 86, tipo: 'select', pergunta: 'Revestimentos de parede:', opcoes: ['Pintura', 'Cerâmica', 'Misto'], obrigatoria: true },
        { id: 87, tipo: 'select', pergunta: 'Iluminação geral:', opcoes: ['Direta', 'Indireta', 'Mista'], obrigatoria: true },
        { id: 88, tipo: 'select', pergunta: 'Pisos:', opcoes: ['Industrial', 'Concreto polido', 'Epóxi'], obrigatoria: true }
      ]
    },
    {
      id: 'aspectos-tecnicos-basicos',
      nome: '💡 Aspectos Técnicos Básicos',
      descricao: 'Iluminação técnica e estrutura básica',
      icon: '💡',
      obrigatoria: true,
      perguntas: [
        { id: 89, tipo: 'select', pergunta: 'Tipo de iluminação geral:', opcoes: ['LED', 'Fluorescente', 'Mista'], obrigatoria: true },
        { id: 90, tipo: 'select', pergunta: 'Iluminação de áreas operacionais:', opcoes: ['Básica', 'Reforçada', 'Especializada'], obrigatoria: true },
        { id: 91, tipo: 'select', pergunta: 'Temperatura de cor:', opcoes: ['Neutra', 'Fria', 'Quente'], obrigatoria: true },
        { id: 92, tipo: 'select', pergunta: 'Iluminação natural:', opcoes: ['Aproveitamento máximo', 'Moderado', 'Mínimo'], obrigatoria: true },
        { id: 93, tipo: 'select', pergunta: 'Sistema estrutural:', opcoes: ['Concreto', 'Metálico', 'Misto'], obrigatoria: true },
        { id: 94, tipo: 'number', pergunta: 'Vão livre necessário (metros):', obrigatoria: true, placeholder: '20' },
        { id: 95, tipo: 'select', pergunta: 'Tipo de fundação:', opcoes: ['Superficial', 'Profunda'], obrigatoria: true },
        { id: 96, tipo: 'select', pergunta: 'Tipo de fechamento lateral:', opcoes: ['Alvenaria', 'Metálico', 'Misto'], obrigatoria: true }
      ]
    },
    {
      id: 'cronograma-gestao',
      nome: '📅 Cronograma e Gestão',
      descricao: 'Prazos e gestão do projeto',
      icon: '📅',
      obrigatoria: true,
      perguntas: [
        { id: 97, tipo: 'text', pergunta: 'Início desejado da obra:', obrigatoria: true, placeholder: 'Ex: 01/03/2025' },
        { id: 98, tipo: 'text', pergunta: 'Prazo máximo para conclusão:', obrigatoria: true, placeholder: 'Ex: 8 meses' },
        { id: 99, tipo: 'text', pergunta: 'Há alguma data limite? (Motivo)', obrigatoria: false, placeholder: 'Ex: Início da safra em setembro' },
        { id: 100, tipo: 'select', pergunta: 'Prioridade:', opcoes: ['Prazo', 'Custo', 'Qualidade'], obrigatoria: true },
        { id: 101, tipo: 'select', pergunta: 'Frequência de reuniões desejada:', opcoes: ['Quinzenal', 'Mensal', 'Conforme necessidade'], obrigatoria: true },
        { id: 102, tipo: 'select', pergunta: 'Forma de comunicação preferida:', opcoes: ['WhatsApp', 'E-mail', 'Presencial'], obrigatoria: true },
        { id: 103, tipo: 'select', pergunta: 'Visitas à obra:', opcoes: ['Semanais', 'Quinzenais', 'Mensais'], obrigatoria: true },
        { id: 104, tipo: 'select', pergunta: 'Tomada de decisões:', opcoes: ['Rápida', 'Consultiva', 'Comitê'], obrigatoria: true }
      ]
    },
    {
      id: 'aspectos-legais-financeiros',
      nome: '📊 Aspectos Legais e Financeiros',
      descricao: 'Documentação básica e aspectos financeiros',
      icon: '📊',
      obrigatoria: true,
      perguntas: [
        { id: 105, tipo: 'select', pergunta: 'Documentação do imóvel:', opcoes: ['Completa', 'Pendente'], obrigatoria: true },
        { id: 106, tipo: 'select', pergunta: 'Aprovação na prefeitura:', opcoes: ['Necessária', 'Dispensada'], obrigatoria: true },
        { id: 107, tipo: 'select', pergunta: 'Aprovação no corpo de bombeiros:', opcoes: ['Necessária', 'Dispensada'], obrigatoria: true },
        { id: 108, tipo: 'select', pergunta: 'Responsabilidade pelas aprovações:', opcoes: ['Arquiteto', 'Cliente'], obrigatoria: true },
        { id: 109, tipo: 'select', pergunta: 'Forma de pagamento dos projetos:', opcoes: ['À vista', 'Parcelado'], obrigatoria: true },
        { id: 110, tipo: 'select', pergunta: 'Forma de pagamento da obra:', opcoes: ['À vista', 'Por etapas'], obrigatoria: true },
        { id: 111, tipo: 'select', pergunta: 'Reserva para imprevistos:', opcoes: ['10%', '15%', '20%', 'Não tem'], obrigatoria: true },
        { id: 112, tipo: 'select', pergunta: 'Medição da obra:', opcoes: ['Quinzenal', 'Mensal'], obrigatoria: true }
      ]
    },
    {
      id: 'questoes-especificas-simples',
      nome: '🔍 Questões Específicas Padrão Simples',
      descricao: 'Otimização de custos e funcionalidade essencial',
      icon: '🔍',
      obrigatoria: true,
      perguntas: [
        { id: 113, tipo: 'select', pergunta: 'Prioridade para economia:', opcoes: ['Acabamentos', 'Mobiliário', 'Estrutura'], obrigatoria: true },
        { id: 114, tipo: 'select', pergunta: 'Aceita materiais alternativos mais econômicos?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 115, tipo: 'select', pergunta: 'Possibilidade de execução em etapas?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 116, tipo: 'select', pergunta: 'Mão de obra:', opcoes: ['Empreitada', 'Administração direta'], obrigatoria: true },
        { id: 117, tipo: 'select', pergunta: 'Prioridade para armazenamento?', opcoes: ['Alta', 'Média', 'Baixa'], obrigatoria: true },
        { id: 118, tipo: 'select', pergunta: 'Facilidade de manutenção é essencial?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 119, tipo: 'select', pergunta: 'Possibilidade de ampliação futura?', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 120, tipo: 'select', pergunta: 'Adaptabilidade para outros usos?', opcoes: ['Sim', 'Não'], obrigatoria: true }
      ]
    },
    {
      id: 'logistica-movimentacao',
      nome: '🚛 Logística e Movimentação Industrial',
      descricao: 'Logística de entrada, movimentação interna e saída',
      icon: '🚛',
      obrigatoria: true,
      perguntas: [
        { id: 121, tipo: 'checkbox', pergunta: 'Tipo de veículos de entrega:', opcoes: ['Caminhões', 'Carretas', 'VUCs'], obrigatoria: true },
        { id: 122, tipo: 'select', pergunta: 'Frequência de entregas:', opcoes: ['Diária', 'Semanal', 'Mensal'], obrigatoria: true },
        { id: 123, tipo: 'select', pergunta: 'Horário de recebimento:', opcoes: ['Comercial', '24h'], obrigatoria: true },
        { id: 124, tipo: 'select', pergunta: 'Área de descarregamento:', opcoes: ['Coberta', 'Descoberta', 'Mista'], obrigatoria: true },
        { id: 125, tipo: 'number', pergunta: 'Número de docas:', obrigatoria: true, placeholder: '4' },
        { id: 126, tipo: 'select', pergunta: 'Altura das docas:', opcoes: ['Padrão (1,20m)', 'Específica'], obrigatoria: true },
        { id: 127, tipo: 'checkbox', pergunta: 'Equipamentos de movimentação:', opcoes: ['Empilhadeira', 'Paleteira', 'Manual'], obrigatoria: true },
        { id: 128, tipo: 'select', pergunta: 'Controle de entrada:', opcoes: ['Portaria', 'Livre'], obrigatoria: true },
        { id: 129, tipo: 'number', pergunta: 'Corredores de circulação (Largura mínima metros):', obrigatoria: true, placeholder: '3' },
        { id: 130, tipo: 'number', pergunta: 'Altura de empilhamento (Metros):', obrigatoria: true, placeholder: '6' },
        { id: 131, tipo: 'select', pergunta: 'Tipo de estocagem:', opcoes: ['Pallets', 'Prateleiras', 'Piso', 'Misto'], obrigatoria: true },
        { id: 132, tipo: 'checkbox', pergunta: 'Equipamentos internos:', opcoes: ['Empilhadeira', 'Paleteira', 'Transpaleteira'], obrigatoria: true },
        { id: 133, tipo: 'select', pergunta: 'Sinalização de segurança:', opcoes: ['Completa', 'Básica'], obrigatoria: true },
        { id: 134, tipo: 'select', pergunta: 'Demarcação de áreas:', opcoes: ['Pintura', 'Fitas', 'Ambas'], obrigatoria: true },
        { id: 135, tipo: 'select', pergunta: 'Expedição:', opcoes: ['Mesma área de recebimento', 'Separada'], obrigatoria: true },
        { id: 136, tipo: 'select', pergunta: 'Preparação de pedidos:', opcoes: ['Área dedicada', 'Integrada'], obrigatoria: true },
        { id: 137, tipo: 'select', pergunta: 'Conferência:', opcoes: ['Área específica', 'No local'], obrigatoria: true },
        { id: 138, tipo: 'select', pergunta: 'Embalagem:', opcoes: ['Área dedicada', 'Não necessária'], obrigatoria: true },
        { id: 139, tipo: 'select', pergunta: 'Carregamento:', opcoes: ['Equipamentos', 'Manual'], obrigatoria: true },
        { id: 140, tipo: 'select', pergunta: 'Controle de saída:', opcoes: ['Rigoroso', 'Básico'], obrigatoria: true }
      ]
    },
    {
      id: 'seguranca-industrial-normas',
      nome: '⚠️ Segurança Industrial e Normas',
      descricao: 'Segurança do trabalho, prevenção de incêndios e segurança patrimonial',
      icon: '⚠️',
      obrigatoria: true,
      perguntas: [
        { id: 141, tipo: 'select', pergunta: 'Conhecimento das NRs aplicáveis:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 142, tipo: 'select', pergunta: 'NR-12 (Máquinas):', opcoes: ['Aplicável', 'Não aplicável'], obrigatoria: true },
        { id: 143, tipo: 'select', pergunta: 'NR-17 (Ergonomia):', opcoes: ['Aplicável', 'Não aplicável'], obrigatoria: true },
        { id: 144, tipo: 'select', pergunta: 'NR-23 (Proteção contra incêndio):', opcoes: ['Aplicável', 'Não aplicável'], obrigatoria: true },
        { id: 145, tipo: 'checkbox', pergunta: 'Equipamentos de proteção:', opcoes: ['EPI', 'EPC'], obrigatoria: true },
        { id: 146, tipo: 'select', pergunta: 'Sinalização de segurança:', opcoes: ['Completa', 'Básica'], obrigatoria: true },
        { id: 147, tipo: 'select', pergunta: 'Saídas de emergência:', opcoes: ['Múltiplas', 'Mínimas'], obrigatoria: true },
        { id: 148, tipo: 'select', pergunta: 'Iluminação de emergência:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 149, tipo: 'select', pergunta: 'Chuveiros de emergência:', opcoes: ['Necessário', 'Não necessário'], obrigatoria: true },
        { id: 150, tipo: 'select', pergunta: 'Lava-olhos:', opcoes: ['Necessário', 'Não necessário'], obrigatoria: true },
        { id: 151, tipo: 'select', pergunta: 'CIPA:', opcoes: ['Necessária', 'Não necessária'], obrigatoria: true },
        { id: 152, tipo: 'select', pergunta: 'Treinamentos de segurança:', opcoes: ['Regulares', 'Básicos', 'Não'], obrigatoria: true },
        { id: 153, tipo: 'select', pergunta: 'Classe de risco:', opcoes: ['Baixo', 'Médio', 'Alto'], obrigatoria: true },
        { id: 154, tipo: 'select', pergunta: 'Materiais armazenados:', opcoes: ['Inflamáveis', 'Não inflamáveis', 'Misto'], obrigatoria: true },
        { id: 155, tipo: 'select', pergunta: 'Sistema de detecção:', opcoes: ['Automático', 'Manual'], obrigatoria: true },
        { id: 156, tipo: 'checkbox', pergunta: 'Extintores (Tipos necessários):', opcoes: ['Água', 'PQS', 'CO2', 'Espuma'], obrigatoria: true },
        { id: 157, tipo: 'select', pergunta: 'Hidrantes:', opcoes: ['Necessários', 'Não necessários'], obrigatoria: true },
        { id: 158, tipo: 'select', pergunta: 'Sprinklers:', opcoes: ['Necessário', 'Não necessário'], obrigatoria: true },
        { id: 159, tipo: 'select', pergunta: 'Brigada de incêndio:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 160, tipo: 'select', pergunta: 'Plano de evacuação:', opcoes: ['Detalhado', 'Básico'], obrigatoria: true },
        { id: 161, tipo: 'select', pergunta: 'Perímetro:', opcoes: ['Murado', 'Cercado', 'Aberto'], obrigatoria: true },
        { id: 162, tipo: 'select', pergunta: 'Portaria:', opcoes: ['24h', 'Horário comercial'], obrigatoria: true },
        { id: 163, tipo: 'select', pergunta: 'Controle de acesso:', opcoes: ['Biométrico', 'Cartão', 'Manual', 'Não'], obrigatoria: true },
        { id: 164, tipo: 'select', pergunta: 'CFTV:', opcoes: ['Completo', 'Básico', 'Não'], obrigatoria: true },
        { id: 165, tipo: 'select', pergunta: 'Iluminação externa:', opcoes: ['Completa', 'Básica'], obrigatoria: true },
        { id: 166, tipo: 'select', pergunta: 'Alarme:', opcoes: ['Monitorado', 'Local', 'Não'], obrigatoria: true },
        { id: 167, tipo: 'select', pergunta: 'Vigilância:', opcoes: ['Terceirizada', 'Própria', 'Não'], obrigatoria: true },
        { id: 168, tipo: 'select', pergunta: 'Cofre/Tesouraria:', opcoes: ['Sim', 'Não'], obrigatoria: true },
        { id: 169, tipo: 'select', pergunta: 'Seguro:', opcoes: ['Completo', 'Básico'], obrigatoria: true },
        { id: 170, tipo: 'select', pergunta: 'Plano de segurança:', opcoes: ['Detalhado', 'Básico'], obrigatoria: true }
      ]
    }
  ]
}; 