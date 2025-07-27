// Serviço de análise inteligente simplificado
export type PlanoUsuario = 'GRATUITO' | 'PRO' | 'ENTERPRISE';

export interface AnalisePersonalizacao {
  complexidade: string;
  complexidadeCalculada: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta';
  confianca: number;
  modificacoes: any[];
  recomendacoes: any[];
  upgrade?: any;
  etapasRemover: any[];
  etapasAdicionar: any[];
  tarefasModificar: any[];
  cronogramaAjustado: any;
  confidenciaAnalise: number;
}

export class AnaliseInteligenteService {
  static async analisarBriefingVsTemplate(
    briefing: any, 
    template: any, 
    planoUsuario: string = 'GRATUITO'
  ): Promise<AnalisePersonalizacao> {
    return {
      complexidade: 'Média',
      complexidadeCalculada: 'Média',
      confianca: 0.8,
      modificacoes: [],
      recomendacoes: [],
      upgrade: undefined,
      etapasRemover: [],
      etapasAdicionar: [],
      tarefasModificar: [],
      cronogramaAjustado: {},
      confidenciaAnalise: 0.8
    };
  }

  static obterEstatisticas() {
    return {
      totalRegras: 0,
      regrasPorTipologia: {
        RESIDENCIAL: 0,
        COMERCIAL: 0,
        INDUSTRIAL: 0
      },
      regrasPorCategoria: {
        ETAPA: 0,
        TAREFA: 0,
        CRONOGRAMA: 0
      }
    };
  }
} 