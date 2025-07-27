import { ProjectTemplate } from '../../data/projectTemplates';

const CasaMedioTemplate: ProjectTemplate = {
  id: 'residencial-casa-medio',
  nome: 'Casa Residencial - Padrão Médio',
  tipologia: 'residencial',
  subtipo: 'casa',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#2563EB',
      cor_secundaria: '#DBEAFE',
      icone: '🏠'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Paisagismo'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Levantamento e Análise',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Levantamento topográfico detalhado',
          descricao: 'Realizar levantamento planialtimétrico completo do terreno com curvas de nível',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '12h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-20',
          template_notas: 'Observações:\n- Verificar orientação solar\n- Analisar ventos predominantes\n- Checar infraestrutura existente',
          checklist: ['Medições do terreno', 'Curvas de nível', 'Orientação solar', 'Análise do entorno'],
          historico: []
        },
        {
          id: 2,
          nome: 'Análise de viabilidade construtiva',
          descricao: 'Estudar viabilidade técnica e legal para construção no terreno',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '8h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-22',
          template_notas: 'Verificações:\n- Tipo de solo\n- Capacidade de carga\n- Lençol freático\n- Restrições legais',
          checklist: ['Sondagem do solo', 'Análise estrutural', 'Verificação legal', 'Relatório técnico'],
          historico: []
        }
      ]
    },
    {
      id: 2,
      nome: 'Estudo Preliminar',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#3B82F6',
      icone: '✏️',
      tarefas: [
        {
          id: 3,
          nome: 'Desenvolvimento do programa de necessidades',
          descricao: 'Definir ambientes, áreas e relações funcionais da residência',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '16h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-25',
          template_notas: 'Ambientes:\n- Sala de estar/jantar\n- Cozinha americana\n- 3 quartos (1 suíte)\n- 2 banheiros\n- Área de serviço\n- Garagem para 2 carros',
          checklist: ['Programa definido', 'Fluxograma', 'Dimensionamento', 'Aprovação cliente'],
          historico: []
        },
        {
          id: 4,
          nome: 'Estudo de implantação',
          descricao: 'Definir melhor posicionamento da casa no terreno',
          status: 'pendente',
          prioridade: 'media',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '12h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-27',
          template_notas: 'Considerar:\n- Orientação solar\n- Ventilação natural\n- Privacidade\n- Acessos\n- Jardins',
          checklist: ['Estudo solar', 'Análise ventos', 'Acessos definidos', 'Jardim planejado'],
          historico: []
        }
      ]
    },
    {
      id: 3,
      nome: 'Anteprojeto',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#10B981',
      icone: '🎨',
      tarefas: [
        {
          id: 5,
          nome: 'Plantas baixas definitivas',
          descricao: 'Desenvolver plantas baixas com dimensionamento e especificações',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '24h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-05',
          template_notas: 'Incluir:\n- Dimensões e cotas\n- Mobiliário\n- Esquadrias\n- Acabamentos\n- Áreas',
          checklist: ['Planta térrea', 'Planta cobertura', 'Dimensionamento', 'Mobiliário', 'Especificações'],
          historico: []
        },
        {
          id: 6,
          nome: 'Cortes e fachadas',
          descricao: 'Desenvolver cortes longitudinais/transversais e fachadas',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '20h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-08',
          template_notas: 'Desenvolver:\n- 2 cortes principais\n- 4 fachadas\n- Cotas de nível\n- Materiais\n- Cores',
          checklist: ['Cortes executados', 'Fachadas definidas', 'Materiais especificados', 'Aprovação cliente'],
          historico: []
        }
      ]
    },
    {
      id: 4,
      nome: 'Projeto Executivo',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#F59E0B',
      icone: '🏗️',
      tarefas: [
        {
          id: 7,
          nome: 'Detalhamento arquitetônico',
          descricao: 'Detalhar elementos construtivos e especificações técnicas',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '32h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-15',
          template_notas: 'Detalhar:\n- Esquadrias\n- Escadas\n- Banheiros\n- Cozinha\n- Estrutura de cobertura',
          checklist: ['Detalhes construtivos', 'Especificações', 'Memorial descritivo', 'Planilha quantitativa'],
          historico: []
        },
        {
          id: 8,
          nome: 'Coordenação com projetos complementares',
          descricao: 'Integrar projetos estrutural, hidráulico, elétrico e paisagismo',
          status: 'pendente',
          prioridade: 'media',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '16h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-20',
          template_notas: 'Coordenar:\n- Furos e passagens\n- Alturas e níveis\n- Interferências\n- Compatibilização',
          checklist: ['Estrutural compatibilizado', 'Instalações compatibilizadas', 'Paisagismo integrado', 'Relatório final'],
          historico: []
        }
      ]
    }
  ]
};

export default CasaMedioTemplate; 