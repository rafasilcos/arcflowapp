import React from 'react'
import { Lightbulb, ArrowRight, Clock, AlertCircle, Target, Zap, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SugestaoIA {
  id: string
  tipo: 'proxima_tarefa' | 'otimizacao' | 'alerta' | 'melhoria'
  titulo: string
  descricao: string
  acao?: string
  prioridade: 'baixa' | 'media' | 'alta'
  timestamp: Date
}

interface SugestoesIAProps {
  sugestoes: SugestaoIA[]
  onAceitarSugestao: (sugestaoId: string) => void
  onRejeitarSugestao: (sugestaoId: string) => void
}

export default function SugestoesIA({ sugestoes, onAceitarSugestao, onRejeitarSugestao }: SugestoesIAProps) {
  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'proxima_tarefa': return ArrowRight
      case 'otimizacao': return Zap
      case 'alerta': return AlertCircle
      case 'melhoria': return Target
      default: return Lightbulb
    }
  }

  const getCor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baixa': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const sugestoesPrioritarias = sugestoes
    .sort((a, b) => {
      const prioridades = { alta: 3, media: 2, baixa: 1 }
      return prioridades[b.prioridade as keyof typeof prioridades] - 
             prioridades[a.prioridade as keyof typeof prioridades]
    })
    .slice(0, 3)

  if (sugestoesPrioritarias.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Nenhuma sugestão no momento</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-purple-600" />
          SUGESTÕES INTELIGENTES
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sugestoesPrioritarias.map((sugestao) => {
          const Icone = getIcone(sugestao.tipo)
          
          return (
            <div key={sugestao.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <Icone className="w-4 h-4 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{sugestao.titulo}</h4>
                    <p className="text-xs text-gray-600 mt-1">{sugestao.descricao}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getCor(sugestao.prioridade)}>
                  {sugestao.prioridade}
                </Badge>
              </div>

              {sugestao.acao && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => onAceitarSugestao(sugestao.id)}
                    className="flex-1 h-7 text-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {sugestao.acao}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onRejeitarSugestao(sugestao.id)}
                    className="h-7 text-xs"
                  >
                    Ignorar
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Função para gerar sugestões baseadas no contexto
export function gerarSugestoes(
  tarefas: any[], 
  tarefaAtual: any, 
  historico: any[]
): SugestaoIA[] {
  const sugestoes: SugestaoIA[] = []

  // 1. Próxima tarefa sugerida
  if (tarefaAtual?.status === 'em_progresso') {
    const proximasTarefas = tarefas
      .filter(t => t.status === 'nao_iniciada' && t.dependencias.length === 0)
      .sort((a, b) => {
        const prioridades = { critica: 4, alta: 3, media: 2, baixa: 1 }
        return prioridades[b.prioridade as keyof typeof prioridades] - 
               prioridades[a.prioridade as keyof typeof prioridades]
      })

    if (proximasTarefas.length > 0) {
      sugestoes.push({
        id: 'proxima-' + Date.now(),
        tipo: 'proxima_tarefa',
        titulo: 'Próxima tarefa sugerida',
        descricao: `${proximasTarefas[0].nome} - ${proximasTarefas[0].etapa}`,
        acao: 'Preparar',
        prioridade: 'media',
        timestamp: new Date()
      })
    }
  }

  // 2. Alerta de dependências liberadas
  const dependenciasLiberadas = tarefas.filter(t => 
    t.status === 'bloqueada' && 
        t.dependencias.every((depId: any) =>
      tarefas.find((dep: any) => dep.id === depId)?.status === 'concluida'
    )
  )

  dependenciasLiberadas.forEach(tarefa => {
    sugestoes.push({
      id: 'liberada-' + tarefa.id,
      tipo: 'alerta',
      titulo: 'Tarefa liberada!',
      descricao: `${tarefa.nome} está pronta para iniciar`,
      acao: 'Iniciar',
      prioridade: 'alta',
      timestamp: new Date()
    })
  })

  // 3. Otimização de cronograma
  const tarefasAtrasadas = tarefas.filter(t => 
    new Date(t.prazo) < new Date() && t.status !== 'concluida'
  )

  if (tarefasAtrasadas.length > 0) {
    sugestoes.push({
      id: 'otimizacao-' + Date.now(),
      tipo: 'otimizacao',
      titulo: 'Reorganizar prioridades',
      descricao: `${tarefasAtrasadas.length} tarefas em atraso precisam de atenção`,
      acao: 'Reorganizar',
      prioridade: 'alta',
      timestamp: new Date()
    })
  }

  // 4. Sugestão de pausa (Pomodoro)
  if (tarefaAtual?.timerAtivo && tarefaAtual.tempoGasto > 90) {
    sugestoes.push({
      id: 'pausa-' + Date.now(),
      tipo: 'melhoria',
      titulo: 'Hora da pausa!',
      descricao: 'Você está trabalhando há mais de 90 minutos. Uma pausa pode melhorar sua produtividade.',
      acao: 'Fazer Pausa',
      prioridade: 'media',
      timestamp: new Date()
    })
  }

  return sugestoes
}