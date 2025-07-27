'use client';

import { useState, use } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, Play, Pause, Square, CheckCircle2, AlertTriangle,
  MessageSquare, Bell, Settings, Plus, 
  User, Focus, FileText, Save, Timer,
  ArrowRight, ChevronRight, Clock, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces (mesmas da V3)
interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida' | 'atrasada';
  responsavel: string;
  tempo_estimado: number;
  tempo_total: number;
  tempo_sessao_atual: number;
  cronometro_ativo: boolean;
  data_inicio?: string;
  data_conclusao?: string;
  requer_aprovacao: boolean;
  anotacao_sessao_atual?: string;
  notas_sessoes: any[];
  arquivos: any[];
  revisoes: any[];
}

interface Etapa {
  id: string;
  numero: number;
  nome: string;
  progresso: number;
  status: string;
  tarefas: Tarefa[];
}

interface Projeto {
  id: string;
  nome: string;
  cliente: string;
  gerente: string;
  data_inicio: string;
  prazo_final: string;
  status: string;
  progresso_geral: number;
  tempo_total_estimado: number;
  tempo_total_trabalhado: number;
  etapas: Etapa[];
  comunicacao: any[];
}

interface DashboardProps {
  params: Promise<{ id: string }>;
}

export default function DashboardProdutividadeV4({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // Estados principais
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>('tarefa_002');
  const [anotacaoRapida, setAnotacaoRapida] = useState('');
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);

  // Dados do projeto (mesmos da V3)
  const projeto: Projeto = {
    id: projetoId,
    nome: 'Casa Residencial - Família Silva',
    cliente: 'João e Maria Silva',
    gerente: 'Ana Paula Arquiteta',
    data_inicio: '2024-03-01',
    prazo_final: '2024-06-15',
    status: 'em_andamento',
    progresso_geral: 68,
    tempo_total_estimado: 240,
    tempo_total_trabalhado: 163,
    etapas: [
      {
        id: 'etapa_001',
        numero: 1,
        nome: 'Estudos Preliminares',
        progresso: 85,
        status: 'em_andamento',
        tarefas: [
          {
            id: 'tarefa_001',
            nome: 'Levantamento topográfico e análise do terreno',
            status: 'concluida',
            responsavel: 'Carlos Topógrafo',
            tempo_estimado: 14*3600,
            tempo_total: 13.5*3600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-01',
            data_conclusao: '2024-03-03',
            requer_aprovacao: false,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_002',
            nome: 'Programa de necessidades e briefing detalhado',
            status: 'em_progresso',
            responsavel: 'Ana Paula Arquiteta',
            tempo_estimado: 12*3600,
            tempo_total: 8.75*3600,
            tempo_sessao_atual: 2.25*3600,
            cronometro_ativo: true,
            data_inicio: '2024-03-04',
            requer_aprovacao: true,
            anotacao_sessao_atual: 'Reunião com cliente agendada para revisar programa final',
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_003',
            nome: 'Briefing cliente e validação final',
            status: 'nao_iniciada',
            responsavel: 'Marina Arquiteta Jr.',
            tempo_estimado: 6*3600,
            tempo_total: 0,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          }
        ]
      },
      {
        id: 'etapa_002',
        numero: 2,
        nome: 'Anteprojeto',
        progresso: 45,
        status: 'em_progresso',
        tarefas: [
          {
            id: 'tarefa_004',
            nome: 'Plantas baixas - Pavimento Térreo',
            status: 'em_progresso',
            responsavel: 'Ana Paula Arquiteta',
            tempo_estimado: 24*3600,
            tempo_total: 18.5*3600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-06',
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_005',
            nome: 'Cortes e fachadas principais',
            status: 'nao_iniciada',
            responsavel: 'Carlos Designer',
            tempo_estimado: 16*3600,
            tempo_total: 0,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          }
        ]
      }
    ],
    comunicacao: [
      {
        id: 'msg_001',
        usuario: 'Ana Paula Arquiteta',
        avatar: 'AP',
        mensagem: 'Pessoal, as plantas do térreo estão 90% prontas. Vou enviar para revisão ainda hoje.',
        data: '2024-03-08T15:30:00',
        mencoes: ['Carlos Designer', 'Marina Arquiteta Jr.']
      },
      {
        id: 'msg_002',
        usuario: 'Carlos Designer',
        avatar: 'CD',
        mensagem: '@Ana Paula Arquiteta Perfeito! Assim que aprovar, já inicio os cortes e fachadas.',
        data: '2024-03-08T15:45:00',
        mencoes: ['Ana Paula Arquiteta']
      }
    ]
  };

  // Funções utilitárias
  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const formatarTempoSimples = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    if (horas > 0) {
      return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
    }
    return `${minutos}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nao_iniciada': return 'bg-gray-100 text-gray-700';
      case 'em_progresso': return 'bg-blue-100 text-blue-700';
      case 'em_revisao': return 'bg-yellow-100 text-yellow-700';
      case 'concluida': return 'bg-green-100 text-green-700';
      case 'atrasada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nao_iniciada': return '⏳';
      case 'em_progresso': return '🔄';
      case 'em_revisao': return '👁️';
      case 'concluida': return '✅';
      case 'atrasada': return '🔴';
      default: return '📋';
    }
  };

  // Dados derivados
  const tarefaAtivaData = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .find(tarefa => tarefa.id === tarefaAtiva);

  const todasTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas);
  const tarefasConcluidas = todasTarefas.filter(t => t.status === 'concluida');
  const tarefasProximas = todasTarefas.filter(t => t.status === 'nao_iniciada' || t.status === 'em_progresso');
  const tarefasAtrasadas = todasTarefas.filter(t => t.status === 'atrasada');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER ULTRA COMPACTO */}
      <div className="bg-white border-b px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-gray-900">ArcFlow</span>
          </div>
          <div className="text-gray-400">|</div>
          <h1 className="text-base font-semibold text-gray-900">{projeto.nome}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setChatAberto(!chatAberto)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
          
          <div className="relative">
            <Bell className="h-4 w-4 text-gray-600" />
            {tarefasAtrasadas.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                {tarefasAtrasadas.length}
              </span>
            )}
          </div>
          
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            AP
          </div>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL: 70% FOCO + 30% LISTA */}
      <div className="flex h-[calc(100vh-60px)]">
        
        {/* ÁREA DE FOCO (70%) */}
        <div className="flex-1 p-6 bg-white">
          {tarefaAtivaData ? (
            <div className="h-full flex flex-col">
              
              {/* TÍTULO DA TAREFA */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    🎯 Tarefa em Foco
                  </h2>
                  <Badge className={getStatusColor(tarefaAtivaData.status)}>
                    {getStatusIcon(tarefaAtivaData.status)} {tarefaAtivaData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tarefaAtivaData.nome}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {tarefaAtivaData.responsavel}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Estimado: {formatarTempoSimples(tarefaAtivaData.tempo_estimado)}
                  </span>
                </div>
              </div>

              {/* CRONÔMETRO GIGANTE */}
              <div className="flex-1 flex items-center justify-center mb-8">
                <div className="text-center">
                  
                  {/* Círculo do Timer */}
                  <div className="relative w-80 h-80 mx-auto mb-8">
                    <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Círculo de fundo */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(229 231 235)"
                        strokeWidth="3"
                        fill="transparent"
                      />
                      {/* Círculo de progresso */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(34 197 94)"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 283}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 283 }}
                        transition={{ duration: 2 }}
                      />
                    </svg>
                    
                    {/* Tempo no centro */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
                        {formatarTempo(tarefaAtivaData.tempo_total + tarefaAtivaData.tempo_sessao_atual)}
                      </div>
                      <div className="text-lg text-gray-600 mb-4">tempo trabalhado</div>
                      <div className="text-sm text-gray-500">
                        {Math.round((tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 100)}% concluído
                      </div>
                    </div>
                  </div>

                  {/* Controles do Timer */}
                  <div className="flex justify-center space-x-4 mb-8">
                    <Button 
                      size="lg" 
                      className={`px-8 py-4 text-lg ${timerAtivo ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
                      onClick={() => setTimerAtivo(!timerAtivo)}
                    >
                      {timerAtivo ? (
                        <>
                          <Pause className="h-6 w-6 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-6 w-6 mr-2" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                      <Square className="h-6 w-6 mr-2" />
                      Parar
                    </Button>
                    
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                      <Save className="h-6 w-6 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>

              {/* NOTAS DA SESSÃO */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Notas da Sessão
                </h4>
                <Textarea
                  placeholder="Anote suas ideias, descobertas e próximos passos..."
                  value={anotacaoRapida}
                  onChange={(e) => setAnotacaoRapida(e.target.value)}
                  rows={4}
                  className="mb-4 text-base"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">💾 Auto-save ativo</span>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Concluir Tarefa
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Target className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Nenhuma tarefa selecionada
                </h3>
                <p className="text-gray-600 mb-6">
                  Escolha uma tarefa da lista ao lado para começar
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LISTA DE TAREFAS (30%) */}
        <div className="w-96 bg-gray-50 border-l overflow-hidden">
          
          {/* Header da Lista */}
          <div className="bg-white border-b p-4">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Fila de Tarefas</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-700">{tarefasConcluidas.length}</div>
                <div className="text-green-600">Concluídas</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-700">{tarefasProximas.length}</div>
                <div className="text-blue-600">Pendentes</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-bold text-red-700">{tarefasAtrasadas.length}</div>
                <div className="text-red-600">Atrasadas</div>
              </div>
            </div>
          </div>

          {/* Lista Scrollável */}
          <div className="h-full overflow-y-auto p-4 space-y-3">
            
            {/* Tarefas por Etapa */}
            {projeto.etapas.map((etapa) => (
              <div key={etapa.id}>
                
                {/* Header da Etapa */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-sm">
                    ETAPA {etapa.numero}: {etapa.nome}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Progress value={etapa.progresso} className="w-16 h-2" />
                    <span className="text-xs text-gray-600">{etapa.progresso}%</span>
                  </div>
                </div>

                {/* Tarefas da Etapa */}
                <div className="space-y-2 mb-6">
                  {etapa.tarefas.map((tarefa) => (
                    <motion.div
                      key={tarefa.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        tarefa.id === tarefaAtiva 
                          ? 'border-green-400 bg-green-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setTarefaAtiva(tarefa.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{getStatusIcon(tarefa.status)}</span>
                        <Badge className={`${getStatusColor(tarefa.status)} text-xs`}>
                          {tarefa.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <h5 className="font-medium text-gray-900 text-sm mb-2 leading-tight">
                        {tarefa.nome}
                      </h5>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>👤 {tarefa.responsavel.split(' ')[0]}</span>
                        <span>⏱️ {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}</span>
                      </div>

                      {/* Botão de Ação */}
                      {tarefa.id === tarefaAtiva && (
                        <div className="mt-3 pt-2 border-t border-green-200">
                          <Button 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Trabalhar nesta tarefa
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Botão Adicionar */}
            <Button variant="outline" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Nova Tarefa
            </Button>
          </div>
        </div>

        {/* CHAT LATERAL (OVERLAY) */}
        <AnimatePresence>
          {chatAberto && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l shadow-lg z-50"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">💬 Chat da Equipe</h3>
                  <Button variant="ghost" size="sm" onClick={() => setChatAberto(false)}>
                    ✕
                  </Button>
                </div>
              </div>

              <div className="h-full overflow-y-auto p-4">
                <div className="space-y-4">
                  {projeto.comunicacao.map((msg) => (
                    <div key={msg.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {msg.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">
                            {msg.usuario.split(' ')[0]}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.data).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.mensagem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}