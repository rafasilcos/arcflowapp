import { ProjectTemplate } from '../../data/projectTemplates';

const BibliotecaTemplate: ProjectTemplate = {
  id: 'institucional-biblioteca',
  nome: 'Biblioteca Institucional',
  tipologia: 'institucional',
  subtipo: 'biblioteca',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#1E40AF',
      cor_secundaria: '#EFF6FF',
      icone: '📚'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Acústica', 'Tecnologia'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Bibliotecário',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#1E40AF',
      icone: '📚',
      tarefas: [
        {
          id: 1,
          nome: 'Programa bibliotecário',
          descricao: 'Desenvolvimento do programa da biblioteca',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '45h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-20',
          template_notas: 'Biblioteca:\n- Acervo\n- Salas de leitura\n- Área digital\n- Auditório\n- Administração',
          checklist: ['Acervo', 'Leitura', 'Digital', 'Acústica'],
          historico: []
        }
      ]
    }
  ]
};

export default BibliotecaTemplate; 