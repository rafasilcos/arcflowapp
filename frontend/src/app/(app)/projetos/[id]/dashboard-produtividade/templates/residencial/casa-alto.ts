import { ProjectTemplate } from '../../data/projectTemplates';

const CasaAltoTemplate: ProjectTemplate = {
  id: 'residencial-casa-alto',
  nome: 'Casa Residencial - Padrão Alto',
  tipologia: 'residencial',
  subtipo: 'casa',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#7C3AED',
      cor_secundaria: '#F3E8FF',
      icone: '🏘️'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Paisagismo', 'Automação', 'Acústica'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Levantamento e Análise Avançada',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Levantamento topográfico e geotécnico completo',
          descricao: 'Levantamento detalhado com sondagem do solo e análise geotécnica',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '16h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-20',
          template_notas: 'Levantamento completo:\n- Topografia detalhada\n- Sondagem SPT\n- Análise geotécnica\n- Estudo de insolação\n- Análise de ventos',
          checklist: ['Topografia', 'Sondagem SPT', 'Análise geotécnica', 'Estudo solar', 'Análise ventos'],
          historico: []
        }
      ]
    },
    {
      id: 2,
      nome: 'Estudo Preliminar Conceitual',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#7C3AED',
      icone: '✏️',
      tarefas: [
        {
          id: 2,
          nome: 'Desenvolvimento conceitual avançado',
          descricao: 'Criar conceito arquitetônico com múltiplas alternativas',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '32h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-30',
          template_notas: 'Conceito:\n- 3 alternativas de implantação\n- Programa detalhado (5 quartos, 4 suítes)\n- Áreas sociais amplas\n- Piscina e área gourmet\n- Garagem para 4 carros',
          checklist: ['Alternativas conceituais', 'Programa detalhado', 'Implantação', 'Aprovação cliente'],
          historico: []
        }
      ]
    },
    {
      id: 3,
      nome: 'Anteprojeto Executivo',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#10B981',
      icone: '🎨',
      tarefas: [
        {
          id: 3,
          nome: 'Plantas baixas executivas',
          descricao: 'Plantas baixas detalhadas com especificações de acabamentos',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '40h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-15',
          template_notas: 'Plantas executivas:\n- Todos os pavimentos\n- Cotas e dimensões\n- Especificações de acabamentos\n- Mobiliário detalhado\n- Paisagismo integrado',
          checklist: ['Plantas detalhadas', 'Especificações', 'Mobiliário', 'Paisagismo'],
          historico: []
        }
      ]
    },
    {
      id: 4,
      nome: 'Projeto Executivo Completo',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#F59E0B',
      icone: '🏗️',
      tarefas: [
        {
          id: 4,
          nome: 'Coordenação multidisciplinar completa',
          descricao: 'Integração de todos os projetos complementares',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '48h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-03-01',
          template_notas: 'Coordenação:\n- Estrutural\n- Instalações completas\n- Automação residencial\n- Paisagismo\n- Acústica\n- Segurança',
          checklist: ['Compatibilização', 'Memorial técnico', 'Especificações', 'Orçamento detalhado'],
          historico: []
        }
      ]
    }
  ]
};

export default CasaAltoTemplate; 