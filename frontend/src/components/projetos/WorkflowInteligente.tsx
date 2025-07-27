import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, Circle, List, Zap, Clock, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'

interface ItemChecklist {
  id: string
  titulo: string
  descricao?: string
  concluido: boolean
  obrigatorio: boolean
}

interface TransicaoTarefa {
  id: string
  tarefaAtual: string
  proximaTarefa: string
  condicoes: string[]
  preparacao: string[]
  automatica: boolean
}

interface WorkflowInteligenteProps {
  tarefaAtual?: any
  proximasTarefas: any[]
  checklist: ItemChecklist[]
  transicoes: TransicaoTarefa[]
  onConcluirItem: (itemId: string) => void
  onIniciarTransicao: (transicaoId: string) => void
  onPrepararTarefa: (tarefaId: string) => void
}

export default function WorkflowInteligente({
  tarefaAtual,
  proximasTarefas,
  checklist,
  transicoes,
  onConcluirItem,
  onIniciarTransicao,
  onPrepararTarefa
}: WorkflowInteligenteProps) {
  const [mostrarChecklist, setMostrarChecklist] = useState(true)

  const itensObrigatorios = checklist.filter(item => item.obrigatorio)
  const itensConcluidos = checklist.filter(item => item.concluido)
  const progressoChecklist = checklist.length > 0 
    ? (itensConcluidos.length / checklist.length) * 100 
    : 0

  const podeAvancar = itensObrigatorios.every(item => item.concluido)

  const transicaoDisponivel = transicoes.find(t => 
    t.tarefaAtual === tarefaAtual?.id && 
    t.condicoes.every(condicao => avaliarCondicao(condicao, tarefaAtual, checklist))
  )

  function avaliarCondicao(condicao: string, tarefa: any, checklist: ItemChecklist[]): boolean {
    switch (condicao) {
      case 'checklist_completo':
        return checklist.filter(c => c.obrigatorio).every(c => c.concluido)
      case 'tempo_minimo':
        return tarefa?.tempoGasto >= (tarefa?.estimativa * 0.8)
      case 'aprovacao_necessaria':
        return tarefa?.status === 'revisao'
      default:
        return true
    }
  }

  return (
    <div className="space-y-4">
      {/* Checklist Dinâmico */}
      {tarefaAtual && checklist.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center">
                <List className="w-4 h-4 mr-2 text-green-600" />
                CHECKLIST DA TAREFA
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {itensConcluidos.length}/{checklist.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarChecklist(!mostrarChecklist)}
                >
                  {mostrarChecklist ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          {mostrarChecklist && (
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Progresso</span>
                <span className="text-sm font-medium">{Math.round(progressoChecklist)}%</span>
              </div>
              <Progress value={progressoChecklist} className="h-2 mb-4" />

              <div className="space-y-2">
                {checklist.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-start space-x-3 p-2 rounded-lg border ${
                      item.concluido ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Checkbox
                      checked={item.concluido}
                      onCheckedChange={() => onConcluirItem(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          item.concluido ? 'text-green-800 line-through' : 'text-gray-800'
                        }`}>
                          {item.titulo}
                        </span>
                        {item.obrigatorio && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      {item.descricao && (
                        <p className={`text-xs mt-1 ${
                          item.concluido ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {item.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!podeAvancar && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Complete os itens obrigatórios para prosseguir
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Transição Inteligente */}
      {transicaoDisponivel && podeAvancar && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-600" />
              TRANSIÇÃO AUTOMÁTICA DISPONÍVEL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <span className="font-medium">{tarefaAtual?.nome}</span>
                  <ArrowRight className="w-4 h-4 inline mx-2 text-blue-600" />
                  <span className="font-medium">
                    {proximasTarefas.find(t => t.id === transicaoDisponivel.proximaTarefa)?.nome}
                  </span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {transicaoDisponivel.automatica ? 'Automática' : 'Manual'}
              </Badge>
            </div>

            {transicaoDisponivel.preparacao.length > 0 && (
              <div className="bg-white rounded-lg p-3 border">
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Preparação necessária:
                </h4>
                <ul className="space-y-1">
                  {transicaoDisponivel.preparacao.map((prep, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <Circle className="w-3 h-3 mr-2" />
                      {prep}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={() => onIniciarTransicao(transicaoDisponivel.id)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Iniciar Transição
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Próximas Tarefas Sugeridas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Target className="w-4 h-4 mr-2 text-purple-600" />
            PRÓXIMAS TAREFAS SUGERIDAS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {proximasTarefas.slice(0, 3).map((tarefa, index) => (
              <div 
                key={tarefa.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <div>
                    <h4 className="text-sm font-medium">{tarefa.nome}</h4>
                    <p className="text-xs text-gray-600">{tarefa.etapa}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={
                      tarefa.prioridade === 'critica' ? 'bg-red-50 text-red-700 border-red-200' :
                      tarefa.prioridade === 'alta' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  >
                    {tarefa.prioridade}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onPrepararTarefa(tarefa.id)}
                  >
                    Preparar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Função para gerar checklist dinâmico baseado no tipo de tarefa
export function gerarChecklistDinamico(tarefa: any): ItemChecklist[] {
  const checklists: { [key: string]: ItemChecklist[] } = {
    'plantas_baixas': [
      { id: '1', titulo: 'Verificar dimensões e cotas', obrigatorio: true, concluido: false },
      { id: '2', titulo: 'Conferir legenda e símbolos', obrigatorio: true, concluido: false },
      { id: '3', titulo: 'Validar escala e layout', obrigatorio: true, concluido: false },
      { id: '4', titulo: 'Revisar textos e anotações', obrigatorio: false, concluido: false },
      { id: '5', titulo: 'Exportar em alta qualidade', obrigatorio: true, concluido: false }
    ],
    'cortes_fachadas': [
      { id: '1', titulo: 'Definir alturas e níveis', obrigatorio: true, concluido: false },
      { id: '2', titulo: 'Detalhar materiais e acabamentos', obrigatorio: true, concluido: false },
      { id: '3', titulo: 'Verificar proporções', obrigatorio: true, concluido: false },
      { id: '4', titulo: 'Adicionar cotas necessárias', obrigatorio: false, concluido: false }
    ],
    'detalhamento': [
      { id: '1', titulo: 'Criar detalhes construtivos', obrigatorio: true, concluido: false },
      { id: '2', titulo: 'Especificar materiais', obrigatorio: true, concluido: false },
      { id: '3', titulo: 'Dimensionar elementos', obrigatorio: true, concluido: false },
      { id: '4', titulo: 'Revisar compatibilidade', obrigatorio: true, concluido: false }
    ]
  }

  // Determinar tipo baseado no nome da tarefa
  const nomeMinusculo = tarefa.nome.toLowerCase()
  let tipo = 'default'
  
  if (nomeMinusculo.includes('planta')) tipo = 'plantas_baixas'
  else if (nomeMinusculo.includes('corte') || nomeMinusculo.includes('fachada')) tipo = 'cortes_fachadas'
  else if (nomeMinusculo.includes('detalh')) tipo = 'detalhamento'

  return checklists[tipo] || [
    { id: '1', titulo: 'Revisar requisitos', obrigatorio: true, concluido: false },
    { id: '2', titulo: 'Executar tarefa principal', obrigatorio: true, concluido: false },
    { id: '3', titulo: 'Fazer verificação final', obrigatorio: true, concluido: false }
  ]
}

// Função para gerar transições automáticas
export function gerarTransicoes(tarefas: any[]): TransicaoTarefa[] {
  const transicoes: TransicaoTarefa[] = []

  tarefas.forEach(tarefa => {
    // Transição de Plantas Baixas para Cortes
    if (tarefa.nome.toLowerCase().includes('planta')) {
      const cortesRelacionados = tarefas.filter(t => 
        t.nome.toLowerCase().includes('corte') && 
        t.etapa === tarefa.etapa
      )

      cortesRelacionados.forEach(corte => {
        transicoes.push({
          id: `${tarefa.id}-${corte.id}`,
          tarefaAtual: tarefa.id,
          proximaTarefa: corte.id,
          condicoes: ['checklist_completo', 'tempo_minimo'],
          preparacao: [
            'Verificar plantas aprovadas',
            'Preparar base para cortes',
            'Definir seções de corte'
          ],
          automatica: false
        })
      })
    }

    // Transição para Detalhamento
    if (tarefa.nome.toLowerCase().includes('anteprojeto')) {
      const detalhamentos = tarefas.filter(t => 
        t.nome.toLowerCase().includes('detalh') && 
        t.dependencias.includes(tarefa.id)
      )

      detalhamentos.forEach(detalhe => {
        transicoes.push({
          id: `${tarefa.id}-${detalhe.id}`,
          tarefaAtual: tarefa.id,
          proximaTarefa: detalhe.id,
          condicoes: ['checklist_completo', 'aprovacao_necessaria'],
          preparacao: [
            'Aguardar aprovação do anteprojeto',
            'Preparar documentos de referência',
            'Definir nível de detalhamento'
          ],
          automatica: true
        })
      })
    }
  })

  return transicoes
} 