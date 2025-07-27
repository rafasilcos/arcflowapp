import React, { useState } from 'react'
import { Phone, Users, HelpCircle, Coffee, AlertTriangle, Clock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface Interrupcao {
  id: string
  tipo: 'ligacao' | 'reuniao' | 'duvida' | 'pausa_tecnica' | 'emergencia'
  inicio: Date
  fim?: Date
  observacoes?: string
  tarefaId: string
}

interface SistemaInterrupcoesProps {
  tarefaAtiva?: string
  onInterrupcao: (tipo: string, observacoes?: string) => void
  onRetornar: (contexto?: string) => void
  interrupcaoAtiva?: Interrupcao
}

export default function SistemaInterrupcoes({ 
  tarefaAtiva, 
  onInterrupcao, 
  onRetornar, 
  interrupcaoAtiva 
}: SistemaInterrupcoesProps) {
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false)
  const [observacoes, setObservacoes] = useState('')
  const [contextoRecuperacao, setContextoRecuperacao] = useState('')

  const tiposInterrupcao = [
    { tipo: 'ligacao', label: 'Ligação', icon: Phone, cor: 'bg-blue-100 text-blue-800' },
    { tipo: 'reuniao', label: 'Reunião', icon: Users, cor: 'bg-purple-100 text-purple-800' },
    { tipo: 'duvida', label: 'Dúvida/Consulta', icon: HelpCircle, cor: 'bg-orange-100 text-orange-800' },
    { tipo: 'pausa_tecnica', label: 'Pausa Técnica', icon: Coffee, cor: 'bg-green-100 text-green-800' },
    { tipo: 'emergencia', label: 'Emergência', icon: AlertTriangle, cor: 'bg-red-100 text-red-800' }
  ]

  const handleInterrupcao = (tipo: string) => {
    onInterrupcao(tipo, observacoes)
    setMostrarOpcoes(false)
    setObservacoes('')
  }

  const handleRetornar = () => {
    onRetornar(contextoRecuperacao)
    setContextoRecuperacao('')
  }

  if (interrupcaoAtiva) {
    const tipoInfo = tiposInterrupcao.find(t => t.tipo === interrupcaoAtiva.tipo)
    const tempoInterrupcao = Math.floor((Date.now() - interrupcaoAtiva.inicio.getTime()) / 60000)

    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {tipoInfo && <tipoInfo.icon className="w-5 h-5 text-orange-600" />}
              <div>
                <h3 className="font-semibold text-orange-800">Interrupção Ativa</h3>
                <p className="text-sm text-orange-600">
                  {tipoInfo?.label} • {tempoInterrupcao} min
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800">
              <Clock className="w-3 h-3 mr-1" />
              {tempoInterrupcao}min
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Contexto para retomar (opcional):
              </label>
              <Textarea
                placeholder="Ex: Estava revisando a planta baixa, seção de esquadrias..."
                value={contextoRecuperacao}
                onChange={(e) => setContextoRecuperacao(e.target.value)}
                className="text-sm"
                rows={2}
              />
            </div>

            <Button 
              onClick={handleRetornar}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Retomar Trabalho
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (mostrarOpcoes) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-3">Motivo da Interrupção</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {tiposInterrupcao.map(({ tipo, label, icon: Icon, cor }) => (
              <Button
                key={tipo}
                variant="outline"
                onClick={() => handleInterrupcao(tipo)}
                className="justify-start h-auto p-3"
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Observações sobre a interrupção (opcional)"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="text-sm"
              rows={2}
            />
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setMostrarOpcoes(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tarefaAtiva) return null

  return (
    <Button
      onClick={() => setMostrarOpcoes(true)}
      variant="outline"
      className="bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
    >
      <AlertTriangle className="w-4 h-4 mr-2" />
      Pausa Rápida
    </Button>
  )
} 