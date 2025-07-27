import { ProjectTemplate } from '../../data/projectTemplates';

const HospitalTemplate: ProjectTemplate = {
  id: 'institucional-hospital',
  nome: 'Hospital Institucional',
  tipologia: 'institucional',
  subtipo: 'hospital',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#DC2626',
      cor_secundaria: '#FEF2F2',
      icone: '🏥'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações Hospitalares', 'Gases Medicinais', 'Segurança'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Complexo Hospitalar',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#DC2626',
      icone: '🏥',
      tarefas: [
        {
          id: 1,
          nome: 'Programa hospitalar',
          descricao: 'Desenvolvimento do programa do complexo hospitalar',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '150h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-03-20',
          template_notas: 'Hospital:\n- Pronto socorro\n- Internação\n- Centro cirúrgico\n- UTI\n- Diagnóstico por imagem',
          checklist: ['Programa médico', 'Fluxos', 'Instalações especiais', 'Normas técnicas'],
          historico: []
        }
      ]
    }
  ]
};

export default HospitalTemplate; 