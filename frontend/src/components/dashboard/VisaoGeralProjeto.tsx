import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building, Clock, Calendar, Users, CheckCircle2, AlertTriangle, 
  Zap, Eye, BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VisaoGeralProjetoProps {
  projeto: {
    id: string;
    nome: string;
    cliente: string;
    gerente: string;
    data_inicio: string;
    prazo_final: string;
    progresso_geral: number;
    tempo_total_estimado: number;
  };
  cronometroAtivo: boolean;
  tempoTotalRealTime: string;
  formatarTempoSimples: (segundos: number) => string;
  tarefasConcluidas: number;
  totalTarefas: number;
  aguardandoAprovacao: any[];
  tarefasEmRevisao: any[];
  tarefasAprovadas: any[];
  // Handlers para tooltips
  tooltipAguardandoVisible: boolean;
  tooltipRevisaoVisible: boolean;
  handleMouseEnterAguardando: () => void;
  handleMouseLeaveAguardando: () => void;
  handleMouseEnterTooltip: () => void;
  handleMouseLeaveTooltip: () => void;
  irParaTarefa: (tarefaId: string) => void;
}

export const VisaoGeralProjeto: React.FC<VisaoGeralProjetoProps> = ({
  projeto,
  cronometroAtivo,
  tempoTotalRealTime,
  formatarTempoSimples,
  tarefasConcluidas,
  totalTarefas,
  aguardandoAprovacao,
  tarefasEmRevisao,
  tarefasAprovadas,
  tooltipAguardandoVisible,
  tooltipRevisaoVisible,
  handleMouseEnterAguardando,
  handleMouseLeaveAguardando,
  handleMouseEnterTooltip,
  handleMouseLeaveTooltip,
  irParaTarefa
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Visão Geral do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Cards em linha - 5 cards lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Card 1: Dados do Projeto */}
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-3 text-center">
              <Building className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-indigo-700 mb-2">{projeto.nome}</div>
              <div className="space-y-1 text-xs">
                <div className="text-indigo-600">👤 {projeto.cliente}</div>
                <div className="text-indigo-600">🏗️ {projeto.gerente}</div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Tempo - CRONÔMETRO EM TEMPO REAL */}
          <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 ${cronometroAtivo ? 'ring-2 ring-green-400 ring-opacity-60' : ''}`}>
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className={`h-6 w-6 text-blue-600 ${cronometroAtivo ? 'animate-pulse' : ''}`} />
                {cronometroAtivo && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></div>
                )}
              </div>
              <div className={`font-mono text-base font-bold ${cronometroAtivo ? 'text-green-700' : 'text-blue-700'}`}>
                {tempoTotalRealTime}
              </div>
              <div className="text-xs text-blue-600">de {formatarTempoSimples(projeto.tempo_total_estimado * 3600)}</div>
              <div className={`text-xs mt-1 ${cronometroAtivo ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                {cronometroAtivo ? '⏱️ Tempo Real' : 'Tempo Total'}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Prazo */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-700">97</div>
              <div className="text-xs text-green-600">dias restantes</div>
              <div className="text-xs text-gray-600 mt-1">Até 15/06</div>
            </CardContent>
          </Card>

          {/* Card 4: Equipe */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 text-center">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-700">4</div>
              <div className="text-xs text-purple-600">pessoas ativas</div>
              <div className="text-xs text-gray-600 mt-1">Equipe</div>
            </CardContent>
          </Card>

          {/* Card 5: Tarefas Concluídas */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-3 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-emerald-700">{tarefasConcluidas}/{totalTarefas}</div>
              <div className="text-xs text-emerald-600">tarefas concluídas</div>
              <div className="text-xs text-gray-600 mt-1">Progresso</div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Progresso Geral do Projeto</h4>
            <span className="text-lg font-bold text-blue-600">{projeto.progresso_geral}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${projeto.progresso_geral}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Iniciado em {new Date(projeto.data_inicio).toLocaleDateString('pt-BR')}</span>
            <span>Prazo: {new Date(projeto.prazo_final).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Segunda linha - Cards Consolidados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* CARD 1: ALERTAS & STATUS CRÍTICOS */}
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <h4 className="font-semibold text-red-800">Alertas & Status Críticos</h4>
                  <p className="text-xs text-red-600">🚨 Atenção Necessária</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-red-100/70">
                  <span className="text-sm text-red-700 flex items-center">
                    🔴 <span className="ml-2">Tarefas atrasadas</span>
                  </span>
                  <Badge variant="destructive" className="bg-red-600">0</Badge>
                </div>
                
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-yellow-100/70">
                  <span className="text-sm text-yellow-700 flex items-center">
                    🟡 <span className="ml-2">Vencendo hoje</span>
                  </span>
                  <Badge className="bg-yellow-600">1</Badge>
                </div>
                
                <div 
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-blue-100/70 cursor-pointer hover:bg-blue-200/70 transition-colors relative"
                  onMouseEnter={handleMouseEnterAguardando}
                  onMouseLeave={handleMouseLeaveAguardando}
                >
                  <span className="text-sm text-blue-700 flex items-center">
                    🔵 <span className="ml-2">Aguardando aprovação</span>
                  </span>
                  <Badge className="bg-blue-600">{aguardandoAprovacao.length}</Badge>
                  
                  {/* Tooltip para aguardando aprovação */}
                  {tooltipAguardandoVisible && aguardandoAprovacao.length > 0 && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
                      onMouseEnter={handleMouseEnterAguardando}
                      onMouseLeave={handleMouseLeaveAguardando}
                    >
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">Aguardando Decisão do Manager</h4>
                        <p className="text-xs text-gray-500">{aguardandoAprovacao.length} tarefa(s) enviada(s) pelo colaborador</p>
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {aguardandoAprovacao.map((tarefa) => (
                          <div key={tarefa.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm text-gray-900 mb-1">{tarefa.nome}</h5>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div>👤 {tarefa.responsavel}</div>
                                  <div>📅 Enviado: {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                </div>
                              </div>
                              <Badge className="bg-blue-500 text-white text-xs">Aguardando</Badge>
                            </div>
                            
                            <div className="flex justify-center mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs px-3 py-1 h-7 border-blue-300 text-blue-700 hover:bg-blue-50"
                                onClick={() => irParaTarefa(tarefa.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          Passe o mouse fora para fechar
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: PRODUTIVIDADE HOJE */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Zap className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h4 className="font-semibold text-green-800">Produtividade Hoje</h4>
                  <p className="text-xs text-green-600">📊 Performance Atual</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-green-100/70">
                  <span className="text-sm text-green-700 flex items-center">
                    ⏱️ <span className="ml-2">Flow time</span>
                  </span>
                  <Badge className="bg-green-600 text-white">4h 30min</Badge>
                </div>
                
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-emerald-100/70">
                  <span className="text-sm text-emerald-700 flex items-center">
                    🎯 <span className="ml-2">Foco score</span>
                  </span>
                  <Badge className="bg-emerald-600 text-white">85%</Badge>
                </div>
                
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-blue-100/70">
                  <span className="text-sm text-blue-700 flex items-center">
                    ✅ <span className="ml-2">Tarefas concluídas</span>
                  </span>
                  <Badge className="bg-blue-600 text-white">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: APROVAÇÕES CONSOLIDADO */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="font-semibold text-blue-800">Aprovações</h4>
                  <p className="text-xs text-blue-600">🔍 Central de Aprovações</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div 
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-orange-100/70 cursor-pointer hover:bg-orange-200/70 transition-colors relative"
                  onMouseEnter={handleMouseEnterTooltip}
                  onMouseLeave={handleMouseLeaveTooltip}
                >
                  <span className="text-sm text-orange-700 flex items-center">
                    🟠 <span className="ml-2">Em revisão</span>
                  </span>
                  <Badge className="bg-orange-600">{tarefasEmRevisao.length}</Badge>
                  
                  {/* Tooltip para tarefas em revisão */}
                  {tooltipRevisaoVisible && tarefasEmRevisao.length > 0 && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
                      onMouseEnter={handleMouseEnterTooltip}
                      onMouseLeave={handleMouseLeaveTooltip}
                    >
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">Aguardando Decisão do Manager</h4>
                        <p className="text-xs text-gray-500">{tarefasEmRevisao.length} tarefa(s) enviada(s) pelo colaborador</p>
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {tarefasEmRevisao.map((tarefa) => (
                          <div key={tarefa.id} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm text-gray-900 mb-1">{tarefa.nome}</h5>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div>👤 {tarefa.responsavel}</div>
                                  <div>📅 Desde: {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                </div>
                              </div>
                              <Badge className="bg-orange-500 text-white text-xs">Aguardando</Badge>
                            </div>
                            
                            <div className="flex justify-center mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs px-3 py-1 h-7 border-blue-300 text-blue-700 hover:bg-blue-50"
                                onClick={() => irParaTarefa(tarefa.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          Passe o mouse fora para fechar
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-emerald-100/70">
                  <span className="text-sm text-emerald-700 flex items-center">
                    ✅ <span className="ml-2">Aprovadas hoje</span>
                  </span>
                  <Badge className="bg-emerald-600">{tarefasAprovadas.length}</Badge>
                </div>
                
                <div className="flex items-center justify-between py-1.5 px-2 rounded bg-blue-100/70">
                  <span className="text-sm text-blue-700 flex items-center">
                    🔄 <span className="ml-2">Em correção</span>
                  </span>
                  <Badge className="bg-blue-600">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}; 