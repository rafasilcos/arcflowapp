import { ProjectTemplate } from '../../data/projectTemplates';

const UsinaTemplate: ProjectTemplate = {
  id: 'industrial-usina',
  nome: 'Usina Industrial',
  tipologia: 'industrial',
  subtipo: 'usina',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#991B1B',
      cor_secundaria: '#FEF2F2',
      icone: '⚡'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações Especiais', 'Segurança'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto de Usina',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#991B1B',
      icone: '⚡',
      tarefas: [
        {
          id: 1,
          nome: 'Complexo energético',
          descricao: 'Projeto do complexo da usina de energia',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '200h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-04-01',
          template_notas: 'Usina:\n- Casa de máquinas\n- Subestação\n- Sistemas de segurança\n- Controle ambiental',
          checklist: ['Casa de máquinas', 'Subestação', 'Segurança', 'Meio ambiente'],
          historico: []
        }
      ]
    }
  ]
};

export default UsinaTemplate; 