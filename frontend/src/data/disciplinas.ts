// 🎯 DADOS ESTÁTICOS - DISCIPLINAS E ÁREAS ARCFLOW
// Estrutura hierárquica completa para seleção de briefings

export const DISCIPLINAS = [
  {
    id: 'arquitetura',
    nome: 'Arquitetura',
    icone: '🏛️',
    areas: [
      {
        id: 'residencial',
        nome: 'Residencial',
        tipologias: [
          { id: 'casa-simples', nome: 'Casa Simples', complexidade: 'baixa', tempoEstimado: '2-3 semanas' },
          { id: 'casa-medio', nome: 'Casa Médio Padrão', complexidade: 'media', tempoEstimado: '3-4 semanas' },
          { id: 'casa-alto', nome: 'Casa Alto Padrão', complexidade: 'alta', tempoEstimado: '4-6 semanas' }
        ]
      },
      {
        id: 'comercial',
        nome: 'Comercial',
        tipologias: [
          { id: 'loja', nome: 'Loja/Varejo', complexidade: 'baixa', tempoEstimado: '2-3 semanas' },
          { id: 'escritorio', nome: 'Escritório', complexidade: 'media', tempoEstimado: '3-4 semanas' },
          { id: 'restaurante', nome: 'Restaurante', complexidade: 'alta', tempoEstimado: '4-5 semanas' }
        ]
      }
    ]
  },
  {
    id: 'engenharia',
    nome: 'Engenharia',
    icone: '🏗️',
    areas: [
      {
        id: 'estrutural',
        nome: 'Estrutural',
        tipologias: [
          { id: 'concreto', nome: 'Concreto Armado', complexidade: 'media', tempoEstimado: '3-4 semanas' },
          { id: 'metalica', nome: 'Estrutura Metálica', complexidade: 'alta', tempoEstimado: '4-5 semanas' }
        ]
      },
      {
        id: 'instalacoes',
        nome: 'Instalações',
        tipologias: [
          { id: 'eletrica', nome: 'Elétrica', complexidade: 'media', tempoEstimado: '2-3 semanas' },
          { id: 'hidraulica', nome: 'Hidráulica', complexidade: 'media', tempoEstimado: '2-3 semanas' },
          { id: 'hvac', nome: 'HVAC', complexidade: 'alta', tempoEstimado: '3-4 semanas' }
        ]
      }
    ]
  }
]

export interface Disciplina {
  id: string
  nome: string
  icone: string
  areas: Area[]
}

export interface Area {
  id: string
  nome: string
  tipologias: Tipologia[]
}

export interface Tipologia {
  id: string
  nome: string
  complexidade: 'baixa' | 'media' | 'alta'
  tempoEstimado: string
}

export function encontrarDisciplina(id: string): Disciplina | undefined {
  return DISCIPLINAS.find(d => d.id === id)
}

export function encontrarArea(disciplinaId: string, areaId: string): Area | undefined {
  const disciplina = encontrarDisciplina(disciplinaId)
  return disciplina?.areas.find(a => a.id === areaId)
}

export function encontrarTipologia(disciplinaId: string, areaId: string, tipologiaId: string): Tipologia | undefined {
  const area = encontrarArea(disciplinaId, areaId)
  return area?.tipologias.find(t => t.id === tipologiaId)
} 