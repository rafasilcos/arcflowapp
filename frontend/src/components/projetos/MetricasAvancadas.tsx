import React from 'react'
import { Activity, Clock, TrendingUp, Calendar, BarChart, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface MetricaAvancada {
  velocidadeMedia: number // minutos por tarefa
  horasProdutivas: { hora: number; produtividade: number }[]
  padraoSemanal: { dia: string; produtividade: number }[]
  previsaoEntrega: Date
  eficiencia: number // 0-100%
  tempoFoco: number // minutos sem interrupção
  tarefasPorHora: number
}

interface MetricasAvancadasProps {
  metricas: MetricaAvancada
  tempoTotalHoje: number
  tarefasConcluidas: number
}

export default function MetricasAvancadas({ 
  metricas, 
  tempoTotalHoje, 
  tarefasConcluidas 
}: MetricasAvancadasProps) {
  
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas}h ${mins.toString().padStart(2, '0')}m`
  }

  const obterCorEficiencia = (eficiencia: number) => {
    if (eficiencia >= 80) return 'text-green-600'
    if (eficiencia >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const melhorHora = metricas.horasProdutivas.reduce((prev, current) => 
    prev.produtividade > current.produtividade ? prev : current
  )

  const melhorDia = metricas.padraoSemanal.reduce((prev, current) => 
    prev.produtividade > current.produtividade ? prev : current
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Velocidade e Eficiência */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-600" />
            PERFORMANCE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Eficiência</span>
              <span className={`font-bold ${obterCorEficiencia(metricas.eficiencia)}`}>
                {metricas.eficiencia}%
              </span>
            </div>
            <Progress value={metricas.eficiencia} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-600">
                {formatarTempo(metricas.velocidadeMedia)}
              </div>
              <div className="text-xs text-gray-600">Por tarefa</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-lg font-bold text-green-600">
                {metricas.tarefasPorHora.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Tarefas/hora</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Padrões de Produtividade */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart className="w-4 h-4 mr-2 text-purple-600" />
            PADRÕES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Melhor horário</span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {melhorHora.hora}:00h
              </Badge>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {melhorHora.produtividade}% de produtividade
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Melhor dia</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {melhorDia.dia}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              {melhorDia.produtividade}% de produtividade
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-2 text-center">
            <div className="text-sm font-medium text-orange-800">
              Tempo de Foco
            </div>
            <div className="text-lg font-bold text-orange-600">
              {formatarTempo(metricas.tempoFoco)}
            </div>
            <div className="text-xs text-orange-600">
              Sem interrupções
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previsões */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
            PREVISÕES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">Previsão de Entrega</div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-medium">
                {metricas.previsaoEntrega.toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Baseado no ritmo atual
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Hoje vs Média
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo trabalhado</span>
                <span className="font-medium">
                  {formatarTempo(tempoTotalHoje)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tarefas concluídas</span>
                <span className="font-medium">
                  {tarefasConcluidas}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Produtividade</span>
                <span className={`font-medium ${obterCorEficiencia(metricas.eficiencia)}`}>
                  {metricas.eficiencia > 75 ? '↗️' : metricas.eficiencia > 50 ? '→' : '↘️'} 
                  {metricas.eficiencia}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Função para calcular métricas baseadas no histórico
export function calcularMetricas(
  tarefas: any[], 
  historicoSessoes: any[]
): MetricaAvancada {
  const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida')
  const tempoTotal = tarefasConcluidas.reduce((acc, t) => acc + t.tempoGasto, 0)
  
  // Velocidade média
  const velocidadeMedia = tarefasConcluidas.length > 0 
    ? tempoTotal / tarefasConcluidas.length 
    : 0

  // Padrões de produtividade por hora
  const horasProdutivas = Array.from({ length: 24 }, (_, hora) => {
    const sessoesHora = historicoSessoes.filter(s => 
      new Date(s.inicio).getHours() === hora
    )
    const produtividade = sessoesHora.length > 0 
      ? sessoesHora.reduce((acc, s) => acc + (s.produtividade || 70), 0) / sessoesHora.length
      : 0
    
    return { hora, produtividade }
  })

  // Padrão semanal
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const padraoSemanal = diasSemana.map((dia, index) => {
    const sessoesDia = historicoSessoes.filter(s => 
      new Date(s.inicio).getDay() === index + 1
    )
    const produtividade = sessoesDia.length > 0 
      ? sessoesDia.reduce((acc, s) => acc + (s.produtividade || 70), 0) / sessoesDia.length
      : 0
    
    return { dia, produtividade }
  })

  // Previsão de entrega baseada na velocidade atual
  const tarefasRestantes = tarefas.filter(t => t.status !== 'concluida').length
  const tempoEstimadoRestante = tarefasRestantes * velocidadeMedia
  const previsaoEntrega = new Date(Date.now() + tempoEstimadoRestante * 60 * 1000)

  // Eficiência baseada em tempo estimado vs real
  const eficiencia = tarefasConcluidas.length > 0 
    ? Math.min(100, Math.max(0, 
        tarefasConcluidas.reduce((acc, t) => 
          acc + Math.min(100, (t.estimativa / Math.max(t.tempoGasto, 1)) * 100)
        , 0) / tarefasConcluidas.length
      ))
    : 75

  // Tempo de foco (maior sessão sem interrupção)
  const tempoFoco = Math.max(...historicoSessoes.map(s => s.duracaoFoco || 0), 0)

  // Tarefas por hora
  const tarefasPorHora = tempoTotal > 0 ? (tarefasConcluidas.length / (tempoTotal / 60)) : 0

  return {
    velocidadeMedia,
    horasProdutivas,
    padraoSemanal,
    previsaoEntrega,
    eficiencia,
    tempoFoco,
    tarefasPorHora
  }
} 