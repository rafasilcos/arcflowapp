// Briefings da categoria Urbanística
export const briefingsUrbanistico = {
  'projeto-urbano': () => import('./projeto-urbano').then(m => m.briefingProjetoUrbano)
};

// Metadados da categoria
export const metadataUrbanistico = {
  nome: 'Urbanístico',
  icone: '🏙️',
  descricao: 'Briefings especializados para projetos urbanos e planejamento territorial',
  totalBriefings: 1,
  briefings: [
    {
      id: 'projeto-urbano',
      nome: 'Projeto Urbano',
      descricao: 'Briefing completo para projetos urbanos com desenho urbano, planejamento territorial e desenvolvimento urbano integrado',
      totalPerguntas: 260,
      tempoEstimado: '65-80 minutos',
      complexidade: 'muito_alta',
      status: 'ativo'
    }
  ]
}; 