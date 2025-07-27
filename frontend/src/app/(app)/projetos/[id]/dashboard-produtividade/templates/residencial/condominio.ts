import { ProjectTemplate } from '../../data/projectTemplates';

const CondominioTemplate: ProjectTemplate = {
  id: 'residencial-condominio',
  nome: 'Condomínio Residencial',
  tipologia: 'residencial',
  subtipo: 'condominio',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#7C2D12',
      cor_secundaria: '#FEF7ED',
      icone: '🏘️'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Paisagismo', 'Urbanismo'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Estudo de Viabilidade',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Análise urbanística',
          descricao: 'Estudo de viabilidade para condomínio residencial',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '40h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-01',
          template_notas: 'Condomínio:\n- Múltiplas unidades\n- Áreas comuns\n- Infraestrutura completa\n- Aprovações legais',
          checklist: ['Legislação', 'Zoneamento', 'Viabilidade', 'Programa'],
          historico: []
        }
      ]
    }
  ]
};

export default CondominioTemplate; 