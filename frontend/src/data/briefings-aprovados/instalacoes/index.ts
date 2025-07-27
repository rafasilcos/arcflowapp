// Categoria: Instalações - Engenharia de Instalações Prediais
export { briefingInstalacoes } from './briefing-instalacoes-adaptativo-completo';

// Metadados da categoria
export const metadataInstalacoes = {
  categoria: 'instalacoes',
  nome: 'Instalações',
  icone: '⚡',
  descricao: 'Briefings especializados em instalações prediais',
  briefings: [
    {
      id: 'instalacoes-adaptativo-completo',
      nome: 'Briefing Adaptativo Completo - Engenharia de Instalações',
      descricao: 'Briefing técnico especializado com 25 NBRs integradas',
      especializacoes: 7,
      perguntas: 350,
      tempoEstimado: '60-90 minutos',
      notaTecnica: 9.5,
      status: 'ativo'
    }
  ],
  estatisticas: {
    totalBriefings: 1,
    totalPerguntas: 350,
    especializacoes: [
      'Instalações Elétricas BT/MT',
      'Instalações Hidrossanitárias',
      'PPCI - Prevenção e Proteção Contra Incêndio',
      'Climatização AVAC/HVAC',
      'Instalações de Gás',
      'Segurança Eletrônica',
      'Automação Predial'
    ]
  }
}; 