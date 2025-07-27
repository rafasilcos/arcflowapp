import { ProjectTemplate } from '../../data/projectTemplates';

const HotelTemplate: ProjectTemplate = {
  id: 'comercial-hotel',
  nome: 'Hotel Comercial',
  tipologia: 'comercial',
  subtipo: 'hotel',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#B91C1C',
      cor_secundaria: '#FEF2F2',
      icone: '🏨'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Hotelaria', 'Paisagismo'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Conceito Hoteleiro',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#B91C1C',
      icone: '🏨',
      tarefas: [
        {
          id: 1,
          nome: 'Programa hoteleiro',
          descricao: 'Desenvolvimento do programa e conceito do hotel',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '60h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-20',
          template_notas: 'Hotel:\n- Recepção e lobby\n- Quartos e suítes\n- Restaurante\n- Áreas de lazer\n- Serviços',
          checklist: ['Programa', 'Quartos', 'Áreas comuns', 'Serviços'],
          historico: []
        }
      ]
    }
  ]
};

export default HotelTemplate; 