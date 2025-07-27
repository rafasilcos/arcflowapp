import React, { useState } from 'react'
import { MessageSquare, Users, Bell, Send, Eye, Clock, Wifi } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Mensagem {
  id: string
  usuario: string
  avatar: string
  conteudo: string
  timestamp: Date
  tarefaId?: string
  tipo: 'mensagem' | 'notificacao' | 'alerta'
  lida?: boolean
}

interface ColaboracaoTempoProps {
  tarefaId: string
  mensagens: Mensagem[]
  usuariosOnline: string[]
  onEnviarMensagem: (conteudo: string, tarefaId: string) => void
  onMarcarVisto: (mensagemId: string) => void
}

export default function ColaboracaoTempo({ 
  tarefaId, 
  mensagens, 
  usuariosOnline, 
  onEnviarMensagem,
  onMarcarVisto
}: ColaboracaoTempoProps) {
  const [novaMensagem, setNovaMensagem] = useState('')
  const [chatAberto, setChatAberto] = useState(false)

  const mensagensTarefa = mensagens
    .filter(m => m.tarefaId === tarefaId || m.tipo === 'notificacao')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  const mensagensNaoLidas = mensagensTarefa.filter(m => !m.lida).length

  const handleEnviar = () => {
    if (novaMensagem.trim()) {
      onEnviarMensagem(novaMensagem, tarefaId)
      setNovaMensagem('')
    }
  }

  const formatarTempo = (timestamp: Date) => {
    const agora = new Date()
    const diff = agora.getTime() - timestamp.getTime()
    const minutos = Math.floor(diff / 60000)
    
    if (minutos < 1) return 'agora'
    if (minutos < 60) return `${minutos}min`
    if (minutos < 1440) return `${Math.floor(minutos / 60)}h`
    return timestamp.toLocaleDateString('pt-BR')
  }

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'alerta': return 'bg-red-100 border-red-200'
      case 'notificacao': return 'bg-blue-100 border-blue-200'
      default: return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {/* Status da Equipe Online */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Wifi className="w-4 h-4 mr-2 text-green-600" />
              EQUIPE ONLINE
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {usuariosOnline.length} online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 overflow-x-auto">
            {usuariosOnline.map((usuario, index) => (
              <div key={index} className="flex items-center space-x-1 bg-green-50 rounded-full px-2 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-800">{usuario}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Rápido */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
              CHAT DA TAREFA
            </div>
            <div className="flex items-center space-x-2">
              {mensagensNaoLidas > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {mensagensNaoLidas}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChatAberto(!chatAberto)}
              >
                {chatAberto ? 'Fechar' : 'Abrir'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {chatAberto && (
          <CardContent className="space-y-3">
            {/* Mensagens */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mensagensTarefa.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma mensagem ainda
                </p>
              ) : (
                mensagensTarefa.map((mensagem) => (
                  <div 
                    key={mensagem.id} 
                    className={`p-2 rounded-lg border ${getCorTipo(mensagem.tipo)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {mensagem.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{mensagem.usuario}</span>
                            <span className="text-xs text-gray-500">
                              {formatarTempo(mensagem.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {mensagem.conteudo}
                          </p>
                        </div>
                      </div>
                      
                      {!mensagem.lida && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarcarVisto(mensagem.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de nova mensagem */}
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
                className="text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleEnviar}
                disabled={!novaMensagem.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notificações Recentes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Bell className="w-4 h-4 mr-2 text-orange-600" />
            NOTIFICAÇÕES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mensagens
              .filter(m => m.tipo === 'notificacao' || m.tipo === 'alerta')
              .slice(0, 3)
              .map((notificacao) => (
                <div 
                  key={notificacao.id}
                  className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <Bell className="w-4 h-4 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">
                      {notificacao.conteudo}
                    </p>
                    <p className="text-xs text-orange-600">
                      {formatarTempo(notificacao.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            
            {mensagens.filter(m => m.tipo === 'notificacao' || m.tipo === 'alerta').length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                Nenhuma notificação
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Função para gerar notificações automáticas
export function gerarNotificacoes(
  tarefas: any[], 
  eventos: any[]
): Mensagem[] {
  const notificacoes: Mensagem[] = []

  // Notificação de tarefa liberada
  const tarefasLiberadas = tarefas.filter(t => 
    t.status === 'bloqueada' && 
    t.dependencias.every((depId: any) => 
      tarefas.find((dep: any) => dep.id === depId)?.status === 'concluida'
    )
  )

  tarefasLiberadas.forEach(tarefa => {
    notificacoes.push({
      id: 'liberada-' + tarefa.id + Date.now(),
      usuario: 'Sistema',
      avatar: 'SYS',
      conteudo: `✅ Tarefa "${tarefa.nome}" foi liberada e pode ser iniciada!`,
      timestamp: new Date(),
      tarefaId: tarefa.id,
      tipo: 'notificacao'
    })
  })

  // Alerta de prazo próximo
  const tarefasUrgentes = tarefas.filter(t => {
    const horasRestantes = (new Date(t.prazo).getTime() - Date.now()) / (1000 * 60 * 60)
    return horasRestantes <= 4 && horasRestantes > 0 && t.status !== 'concluida'
  })

  tarefasUrgentes.forEach(tarefa => {
    const horasRestantes = Math.floor((new Date(tarefa.prazo).getTime() - Date.now()) / (1000 * 60 * 60))
    notificacoes.push({
      id: 'urgente-' + tarefa.id + Date.now(),
      usuario: 'Sistema',
      avatar: 'SYS',
      conteudo: `⚠️ Atenção: "${tarefa.nome}" vence em ${horasRestantes}h!`,
      timestamp: new Date(),
      tarefaId: tarefa.id,
      tipo: 'alerta'
    })
  })

  return notificacoes
} 