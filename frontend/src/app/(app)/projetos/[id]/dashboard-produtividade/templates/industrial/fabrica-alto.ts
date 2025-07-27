import { ProjectTemplate } from '../../data/projectTemplates';

const FabricaAltoTemplate: ProjectTemplate = {
  id: 'industrial-fabrica-alto',
  nome: 'Fábrica Industrial - Padrão Alto',
  tipologia: 'industrial',
  subtipo: 'fabrica',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#1F2937',
      cor_secundaria: '#F9FAFB',
      icone: '🏭'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações Industriais', 'Automação', 'Sustentabilidade'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Complexo Industrial',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#1F2937',
      icone: '🏭',
      tarefas: [
        {
          id: 1,
          nome: 'Masterplan industrial',
          descricao: 'Desenvolvimento do complexo industrial completo',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '120h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-03-15',
          template_notas: 'Complexo industrial:\n- Múltiplos pavilhões\n- Centro de pesquisa\n- Tratamento de efluentes\n- Energia renovável',
          checklist: ['Masterplan', 'Sustentabilidade', 'Tecnologia', 'Certificações'],
          historico: []
        }
      ]
    }
  ]
};

export default FabricaAltoTemplate; 