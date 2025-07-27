import { useState, useEffect, useCallback } from 'react'

interface BriefingTimerData {
  id: string
  dataInicio: Date
  dataFim?: Date
  tempoDecorrido: number
  tempoFormatado: string
  status: 'iniciado' | 'pausado' | 'finalizado'
}

export const useBriefingTimer = (briefingId: string) => {
  const [timer, setTimer] = useState<BriefingTimerData | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  // Formatar tempo em segundos para string legível
  const formatarTempo = useCallback((segundos: number): string => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segundosRestantes = segundos % 60

    if (horas > 0) {
      return `${horas}h ${minutos}min`
    } else if (minutos > 0) {
      return `${minutos}min ${segundosRestantes}s`
    } else {
      return `${segundosRestantes}s`
    }
  }, [])

  // Calcular tempo decorrido entre duas datas
  const calcularTempoDecorrido = useCallback((dataInicio: Date, dataFim?: Date): number => {
    const fim = dataFim || new Date()
    const inicio = dataInicio
    return Math.floor((fim.getTime() - inicio.getTime()) / 1000)
  }, [])

  // Carregar timer do localStorage
  const carregarTimer = useCallback(() => {
    try {
      const savedTimer = localStorage.getItem(`briefing_timer_${briefingId}`)
      if (savedTimer) {
        const timerData = JSON.parse(savedTimer)
        const timer: BriefingTimerData = {
          ...timerData,
          dataInicio: new Date(timerData.dataInicio),
          dataFim: timerData.dataFim ? new Date(timerData.dataFim) : undefined
        }
        
        // Recalcular tempo decorrido
        timer.tempoDecorrido = calcularTempoDecorrido(timer.dataInicio, timer.dataFim)
        timer.tempoFormatado = formatarTempo(timer.tempoDecorrido)
        
        setTimer(timer)
        setIsRunning(timer.status === 'iniciado')
        return timer
      }
    } catch (error) {
      console.error('Erro ao carregar timer:', error)
    }
    return null
  }, [briefingId, calcularTempoDecorrido, formatarTempo])

  // Salvar timer no localStorage
  const salvarTimer = useCallback((timerData: BriefingTimerData) => {
    try {
      const dataToSave = {
        ...timerData,
        dataInicio: timerData.dataInicio.toISOString(),
        dataFim: timerData.dataFim?.toISOString()
      }
      localStorage.setItem(`briefing_timer_${briefingId}`, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Erro ao salvar timer:', error)
    }
  }, [briefingId])

  // Iniciar timer
  const iniciarTimer = useCallback(() => {
    const novoTimer: BriefingTimerData = {
      id: briefingId,
      dataInicio: new Date(),
      tempoDecorrido: 0,
      tempoFormatado: '0s',
      status: 'iniciado'
    }
    
    setTimer(novoTimer)
    setIsRunning(true)
    salvarTimer(novoTimer)
    
    console.log('✅ Timer iniciado para briefing:', briefingId)
  }, [briefingId, salvarTimer])

  // Finalizar timer
  const finalizarTimer = useCallback(() => {
    if (!timer) return null
    
    const timerFinalizado: BriefingTimerData = {
      ...timer,
      dataFim: new Date(),
      status: 'finalizado'
    }
    
    timerFinalizado.tempoDecorrido = calcularTempoDecorrido(timerFinalizado.dataInicio, timerFinalizado.dataFim)
    timerFinalizado.tempoFormatado = formatarTempo(timerFinalizado.tempoDecorrido)
    
    setTimer(timerFinalizado)
    setIsRunning(false)
    salvarTimer(timerFinalizado)
    
    console.log('✅ Timer finalizado para briefing:', briefingId, '- Tempo:', timerFinalizado.tempoFormatado)
    return timerFinalizado
  }, [timer, calcularTempoDecorrido, formatarTempo, salvarTimer, briefingId])

  // Pausar timer
  const pausarTimer = useCallback(() => {
    if (!timer) return
    
    const timerPausado: BriefingTimerData = {
      ...timer,
      status: 'pausado'
    }
    
    timerPausado.tempoDecorrido = calcularTempoDecorrido(timerPausado.dataInicio)
    timerPausado.tempoFormatado = formatarTempo(timerPausado.tempoDecorrido)
    
    setTimer(timerPausado)
    setIsRunning(false)
    salvarTimer(timerPausado)
  }, [timer, calcularTempoDecorrido, formatarTempo, salvarTimer])

  // Obter estatísticas do timer
  const obterEstatisticas = useCallback(() => {
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
      dataFim: timer.dataFim,
      status: timer.status
    }
  }, [timer])

  // Effect para atualizar timer em tempo real
  useEffect(() => {
    if (!isRunning || !timer) return
    
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (!prevTimer || prevTimer.status !== 'iniciado') return prevTimer
        
        const tempoDecorrido = calcularTempoDecorrido(prevTimer.dataInicio)
        const tempoFormatado = formatarTempo(tempoDecorrido)
        
        const timerAtualizado = {
          ...prevTimer,
          tempoDecorrido,
          tempoFormatado
        }
        
        // Salvar periodicamente
        if (tempoDecorrido % 10 === 0) { // A cada 10 segundos
          salvarTimer(timerAtualizado)
        }
        
        return timerAtualizado
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isRunning, timer, calcularTempoDecorrido, formatarTempo, salvarTimer])

  // Carregar timer ao inicializar
  useEffect(() => {
    carregarTimer()
  }, [carregarTimer])

  return {
    timer,
    isRunning,
    iniciarTimer,
    finalizarTimer,
    pausarTimer,
    obterEstatisticas,
    carregarTimer
  }
} 