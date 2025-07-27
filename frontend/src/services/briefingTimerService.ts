interface BriefingTimer {
  id: string
  dataInicio: Date
  dataFim?: Date
  tempoDecorrido: number
  tempoFormatado: string
  status: 'iniciado' | 'pausado' | 'finalizado'
}

class BriefingTimerService {
  private timers: Map<string, BriefingTimer> = new Map()
  private intervalos: Map<string, NodeJS.Timeout> = new Map()
  private callbacks: Map<string, (timer: BriefingTimer) => void> = new Map()

  // Inicia o contador para um briefing específico
  iniciarContador(briefingId: string, callback?: (timer: BriefingTimer) => void): void {
    const agora = new Date()
    
    // Se já existe um timer para este briefing, pausa o anterior
    if (this.timers.has(briefingId)) {
      this.pausarContador(briefingId)
    }

    const timer: BriefingTimer = {
      id: briefingId,
      dataInicio: agora,
      tempoDecorrido: 0,
      tempoFormatado: '0min',
      status: 'iniciado'
    }

    this.timers.set(briefingId, timer)
    
    if (callback) {
      this.callbacks.set(briefingId, callback)
    }

    // Inicia o intervalo para atualizar o contador
    const intervalo = setInterval(() => {
      this.atualizarContador(briefingId)
    }, 1000) // Atualiza a cada segundo

    this.intervalos.set(briefingId, intervalo)

    // Salva no localStorage para persistir entre sessões
    this.salvarNoStorage(briefingId, timer)

    console.log(`Contador iniciado para briefing ${briefingId}`)
  }

  // Pausa o contador
  pausarContador(briefingId: string): void {
    const timer = this.timers.get(briefingId)
    if (!timer) return

    timer.status = 'pausado'
    
    // Para o intervalo
    const intervalo = this.intervalos.get(briefingId)
    if (intervalo) {
      clearInterval(intervalo)
      this.intervalos.delete(briefingId)
    }

    this.timers.set(briefingId, timer)
    this.salvarNoStorage(briefingId, timer)
  }

  // Retoma o contador pausado
  retomarContador(briefingId: string): void {
    const timer = this.timers.get(briefingId)
    if (!timer || timer.status !== 'pausado') return

    timer.status = 'iniciado'
    
    // Reinicia o intervalo
    const intervalo = setInterval(() => {
      this.atualizarContador(briefingId)
    }, 1000)

    this.intervalos.set(briefingId, intervalo)
    this.timers.set(briefingId, timer)
    this.salvarNoStorage(briefingId, timer)
  }

  // Finaliza o contador
  finalizarContador(briefingId: string): BriefingTimer | null {
    const timer = this.timers.get(briefingId)
    if (!timer) return null

    const agora = new Date()
    timer.dataFim = agora
    timer.status = 'finalizado'
    
    // Calcula o tempo final
    const tempoFinalMs = agora.getTime() - timer.dataInicio.getTime()
    timer.tempoDecorrido = Math.floor(tempoFinalMs / 1000)
    timer.tempoFormatado = this.formatarTempo(timer.tempoDecorrido)

    // Para o intervalo
    const intervalo = this.intervalos.get(briefingId)
    if (intervalo) {
      clearInterval(intervalo)
      this.intervalos.delete(briefingId)
    }

    this.timers.set(briefingId, timer)
    this.salvarNoStorage(briefingId, timer)

    console.log(`Contador finalizado para briefing ${briefingId}: ${timer.tempoFormatado}`)
    return timer
  }

  // Atualiza o contador em tempo real
  private atualizarContador(briefingId: string): void {
    const timer = this.timers.get(briefingId)
    if (!timer || timer.status !== 'iniciado') return

    const agora = new Date()
    const tempoDecorridoMs = agora.getTime() - timer.dataInicio.getTime()
    timer.tempoDecorrido = Math.floor(tempoDecorridoMs / 1000)
    timer.tempoFormatado = this.formatarTempo(timer.tempoDecorrido)

    this.timers.set(briefingId, timer)
    
    // Chama o callback se existir
    const callback = this.callbacks.get(briefingId)
    if (callback) {
      callback(timer)
    }
  }

  // Formata o tempo em segundos para uma string legível
  private formatarTempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segundosRestantes = segundos % 60

    if (horas > 0) {
      return `${horas}h ${minutos}min ${segundosRestantes}s`
    } else if (minutos > 0) {
      return `${minutos}min ${segundosRestantes}s`
    } else {
      return `${segundosRestantes}s`
    }
  }

  // Obtém o timer atual
  obterTimer(briefingId: string): BriefingTimer | null {
    return this.timers.get(briefingId) || null
  }

  // Obtém todos os timers
  obterTodosTimers(): BriefingTimer[] {
    return Array.from(this.timers.values())
  }

  // Salva no localStorage
  private salvarNoStorage(briefingId: string, timer: BriefingTimer): void {
    try {
      const timerData = {
        ...timer,
        dataInicio: timer.dataInicio.toISOString(),
        dataFim: timer.dataFim?.toISOString()
      }
      localStorage.setItem(`briefing_timer_${briefingId}`, JSON.stringify(timerData))
    } catch (error) {
      console.error('Erro ao salvar timer no localStorage:', error)
    }
  }

  // Carrega do localStorage
  carregarDoStorage(briefingId: string): BriefingTimer | null {
    try {
      const data = localStorage.getItem(`briefing_timer_${briefingId}`)
      if (!data) return null

      const timerData = JSON.parse(data)
      const timer: BriefingTimer = {
        ...timerData,
        dataInicio: new Date(timerData.dataInicio),
        dataFim: timerData.dataFim ? new Date(timerData.dataFim) : undefined
      }

      this.timers.set(briefingId, timer)
      return timer
    } catch (error) {
      console.error('Erro ao carregar timer do localStorage:', error)
      return null
    }
  }

  // Restaura timers em andamento (para quando a página é recarregada)
  restaurarTimers(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('briefing_timer_'))
      
      keys.forEach(key => {
        const briefingId = key.replace('briefing_timer_', '')
        const timer = this.carregarDoStorage(briefingId)
        
        if (timer && timer.status === 'iniciado') {
          // Retoma o contador se estava em andamento
          this.retomarContador(briefingId)
        }
      })
    } catch (error) {
      console.error('Erro ao restaurar timers:', error)
    }
  }

  // Limpa um timer específico
  limparTimer(briefingId: string): void {
    this.pausarContador(briefingId)
    this.timers.delete(briefingId)
    this.callbacks.delete(briefingId)
    
    try {
      localStorage.removeItem(`briefing_timer_${briefingId}`)
    } catch (error) {
      console.error('Erro ao limpar timer do localStorage:', error)
    }
  }

  // Limpa todos os timers
  limparTodosTimers(): void {
    // Para todos os intervalos
    this.intervalos.forEach((intervalo, briefingId) => {
      clearInterval(intervalo)
    })
    
    // Limpa as estruturas de dados
    this.timers.clear()
    this.intervalos.clear()
    this.callbacks.clear()
    
    // Limpa o localStorage
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('briefing_timer_'))
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Erro ao limpar timers do localStorage:', error)
    }
  }

  // Obtém estatísticas de tempo
  obterEstatisticas(briefingId: string): {
    tempoTotalSegundos: number
    tempoTotalMinutos: number
    tempoTotalHoras: number
    tempoFormatado: string
    dataInicio: Date | null
    dataFim: Date | null
    status: string
  } | null {
    const timer = this.timers.get(briefingId)
    if (!timer) return null

    const tempoTotalSegundos = timer.tempoDecorrido
    const tempoTotalMinutos = Math.floor(tempoTotalSegundos / 60)
    const tempoTotalHoras = Math.floor(tempoTotalMinutos / 60)

    return {
      tempoTotalSegundos,
      tempoTotalMinutos,
      tempoTotalHoras,
      tempoFormatado: timer.tempoFormatado,
      dataInicio: timer.dataInicio,
      dataFim: timer.dataFim || null,
      status: timer.status
    }
  }
}

// Instância singleton
export const briefingTimerService = new BriefingTimerService()

// Restaura timers ao carregar o módulo
if (typeof window !== 'undefined') {
  briefingTimerService.restaurarTimers()
}

export default briefingTimerService
export type { BriefingTimer } 