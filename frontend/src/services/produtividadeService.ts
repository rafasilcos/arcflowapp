// ===== SERVIÇO DE PRODUTIVIDADE =====
// Migrado da V7-Otimizado para V8-Modular
// Análise e métricas de produtividade

import { Projeto, Tarefa, MetricasProdutividade, ProximaTarefaInteligente } from '@/types/dashboard-core';

export class ProdutividadeService {

  // ===== CALCULAR MÉTRICAS DE PRODUTIVIDADE =====
  static calcularMetricas(projeto: Projeto): MetricasProdutividade {
    const todasTarefas = this.obterTodasTarefas(projeto);
    const tarefasConcluidas = todasTarefas.filter(t => ['concluida', 'aprovada'].includes(t.status));
    
    return {
      precisaoEstimativas: this.calcularPrecisaoEstimativas(tarefasConcluidas),
      tarefasConcluidas: tarefasConcluidas.length,
      horasTrabalhadasReal: this.calcularHorasTrabalhadasReal(todasTarefas),
      horasEstimadasTotal: this.calcularHorasEstimadasTotal(todasTarefas),
      padroesDependencia: this.analisarPadroesDependencia(todasTarefas),
      temposMediosPorTipo: this.calcularTemposMediosPorTipo(tarefasConcluidas)
    };
  }

  // ===== CALCULAR PRÓXIMAS TAREFAS INTELIGENTES =====
  static calcularProximasTarefas(projeto: Projeto, limite: number = 5): ProximaTarefaInteligente[] {
    const todasTarefas = this.obterTodasTarefas(projeto);
    const hoje = new Date();
    const amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);

    const tarefasComAnalise = todasTarefas.map(tarefa => {
      let urgencia = 0;
      let pontuacaoPrioridade = 0;
      let diasParaVencimento = 0;
      let labelPrazo = '';
      let corBadge = 'bg-gray-100 text-gray-700 border-gray-200';

      // Calcular urgência baseada no status
      if (tarefa.status === 'atrasada') {
        urgencia = 4;
        labelPrazo = 'ATRASADA';
        corBadge = 'bg-red-100 text-red-700 border-red-200';
      } else if (tarefa.status === 'em_revisao') {
        urgencia = 3;
        labelPrazo = 'EM REVISÃO';
        corBadge = 'bg-purple-100 text-purple-700 border-purple-200';
      } else if (tarefa.data_entrega) {
        const dataEntrega = new Date(tarefa.data_entrega);
        const diffTempo = dataEntrega.getTime() - hoje.getTime();
        diasParaVencimento = Math.ceil(diffTempo / (1000 * 3600 * 24));

        if (diasParaVencimento < 0) {
          urgencia = 4;
          labelPrazo = 'ATRASADA';
          corBadge = 'bg-red-100 text-red-700 border-red-200';
        } else if (diasParaVencimento === 0) {
          urgencia = 3;
          labelPrazo = 'HOJE';
          corBadge = 'bg-orange-100 text-orange-700 border-orange-200';
        } else if (diasParaVencimento === 1) {
          urgencia = 2;
          labelPrazo = 'AMANHÃ';
          corBadge = 'bg-yellow-100 text-yellow-700 border-yellow-200';
        } else if (diasParaVencimento <= 3) {
          urgencia = 1;
          labelPrazo = `${diasParaVencimento} DIAS`;
          corBadge = 'bg-blue-100 text-blue-700 border-blue-200';
        }
      }

      // Calcular pontuação de prioridade
      switch (tarefa.prioridade) {
        case 'critica': pontuacaoPrioridade = 4; break;
        case 'alta': pontuacaoPrioridade = 3; break;
        case 'media': pontuacaoPrioridade = 2; break;
        case 'baixa': pontuacaoPrioridade = 1; break;
        default: pontuacaoPrioridade = 1;
      }

      return {
        ...tarefa,
        urgencia,
        pontuacaoPrioridade,
        diasParaVencimento,
        labelPrazo,
        corBadge
      };
    }).filter(tarefa => 
      // Filtrar apenas tarefas relevantes
      tarefa.status !== 'concluida' && 
      tarefa.status !== 'aprovada' &&
      (tarefa.urgencia > 0 || tarefa.pontuacaoPrioridade > 2)
    ).sort((a, b) => {
      // Ordenar por urgência primeiro, depois por prioridade
      if (a.urgencia !== b.urgencia) {
        return b.urgencia - a.urgencia;
      }
      return b.pontuacaoPrioridade - a.pontuacaoPrioridade;
    });

    return tarefasComAnalise.slice(0, limite);
  }

  // ===== ANALISAR TEMPO REAL =====
  static calcularTempoTotalRealTime(projeto: Projeto): number {
    const todasTarefas = this.obterTodasTarefas(projeto);
    return todasTarefas.reduce((total, tarefa) => {
      return total + tarefa.tempo_total + tarefa.tempo_sessao_atual;
    }, 0);
  }

  // ===== FORMATAR TEMPO =====
  static formatarTempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos.toString().padStart(2, '0')}min`;
    }
    return `${minutos}min ${segs.toString().padStart(2, '0')}s`;
  }

  static formatarTempoSimples(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }

  // ===== MÉTODOS AUXILIARES PRIVADOS =====
  private static obterTodasTarefas(projeto: Projeto): Tarefa[] {
    return projeto.etapas.flatMap(etapa => etapa.tarefas);
  }

  private static calcularPrecisaoEstimativas(tarefasConcluidas: Tarefa[]): number {
    if (tarefasConcluidas.length === 0) return 0;

    const precisoes = tarefasConcluidas.map(tarefa => {
      const estimado = tarefa.tempo_estimado;
      const real = tarefa.tempo_total;
      
      if (estimado === 0) return 0;
      
      const diferenca = Math.abs(estimado - real) / estimado;
      return Math.max(0, 1 - diferenca);
    });

    return Math.round((precisoes.reduce((a, b) => a + b, 0) / precisoes.length) * 100);
  }

  private static calcularHorasTrabalhadasReal(tarefas: Tarefa[]): number {
    return tarefas.reduce((total, tarefa) => {
      return total + tarefa.tempo_total + tarefa.tempo_sessao_atual;
    }, 0) / 3600; // Converter para horas
  }

  private static calcularHorasEstimadasTotal(tarefas: Tarefa[]): number {
    return tarefas.reduce((total, tarefa) => {
      return total + tarefa.tempo_estimado;
    }, 0) / 3600; // Converter para horas
  }

  private static analisarPadroesDependencia(tarefas: Tarefa[]): Map<string, string[]> {
    const padroes = new Map<string, string[]>();
    
    tarefas.forEach(tarefa => {
      if (tarefa.dependencia_tarefa_id) {
        const dependencia = tarefa.dependencia_tarefa_id;
        if (!padroes.has(dependencia)) {
          padroes.set(dependencia, []);
        }
        padroes.get(dependencia)!.push(tarefa.id);
      }
    });

    return padroes;
  }

  private static calcularTemposMediosPorTipo(tarefasConcluidas: Tarefa[]): Map<string, number> {
    const temposPorTipo = new Map<string, number[]>();
    
    tarefasConcluidas.forEach(tarefa => {
      // Categorizar tarefa por palavras-chave no nome
      const categoria = this.categorizarTarefa(tarefa.nome);
      
      if (!temposPorTipo.has(categoria)) {
        temposPorTipo.set(categoria, []);
      }
      temposPorTipo.get(categoria)!.push(tarefa.tempo_total);
    });

    const temposMedias = new Map<string, number>();
    temposPorTipo.forEach((tempos, categoria) => {
      const media = tempos.reduce((a, b) => a + b, 0) / tempos.length;
      temposMedias.set(categoria, media);
    });

    return temposMedias;
  }

  private static categorizarTarefa(nomeTarefa: string): string {
    const nome = nomeTarefa.toLowerCase();
    
    if (nome.includes('planta') || nome.includes('desenho') || nome.includes('cad')) {
      return 'Desenho Técnico';
    } else if (nome.includes('reunião') || nome.includes('cliente') || nome.includes('briefing')) {
      return 'Comunicação';
    } else if (nome.includes('projeto') || nome.includes('executivo')) {
      return 'Projeto Executivo';
    } else if (nome.includes('análise') || nome.includes('estudo')) {
      return 'Análise';
    } else if (nome.includes('revisão') || nome.includes('correção')) {
      return 'Revisão';
    } else {
      return 'Outros';
    }
  }

  // ===== ESTATÍSTICAS AVANÇADAS =====
  static gerarEstatisticasAvancadas(projeto: Projeto) {
    const metricas = this.calcularMetricas(projeto);
    const todasTarefas = this.obterTodasTarefas(projeto);
    
    return {
      eficiencia: this.calcularEficiencia(metricas),
      velocidade: this.calcularVelocidade(todasTarefas),
      qualidade: this.calcularQualidade(todasTarefas),
      previsibilidade: this.calcularPrevisibilidade(metricas)
    };
  }

  private static calcularEficiencia(metricas: MetricasProdutividade): number {
    if (metricas.horasEstimadasTotal === 0) return 0;
    return Math.round((metricas.horasEstimadasTotal / metricas.horasTrabalhadasReal) * 100);
  }

  private static calcularVelocidade(tarefas: Tarefa[]): number {
    const tarefasConcluidas = tarefas.filter(t => ['concluida', 'aprovada'].includes(t.status));
    const diasTrabalhados = this.calcularDiasTrabalhados(tarefas);
    
    if (diasTrabalhados === 0) return 0;
    return Math.round(tarefasConcluidas.length / diasTrabalhados * 7); // Tarefas por semana
  }

  private static calcularQualidade(tarefas: Tarefa[]): number {
    const tarefasComRevisao = tarefas.filter(t => t.revisoes.length > 0);
    const totalRevisoes = tarefasComRevisao.reduce((total, t) => total + t.revisoes.length, 0);
    
    if (tarefasComRevisao.length === 0) return 100;
    const mediaRevisoes = totalRevisoes / tarefasComRevisao.length;
    
    // Qualidade inversamente proporcional ao número de revisões
    return Math.max(0, Math.round(100 - (mediaRevisoes * 20)));
  }

  private static calcularPrevisibilidade(metricas: MetricasProdutividade): number {
    return metricas.precisaoEstimativas;
  }

  private static calcularDiasTrabalhados(tarefas: Tarefa[]): number {
    const datasInicio = tarefas
      .filter(t => t.data_inicio)
      .map(t => new Date(t.data_inicio!));
    
    if (datasInicio.length === 0) return 0;
    
    const dataInicial = new Date(Math.min(...datasInicio.map(d => d.getTime())));
    const hoje = new Date();
    
    return Math.ceil((hoje.getTime() - dataInicial.getTime()) / (1000 * 3600 * 24));
  }
}

export default ProdutividadeService; 