import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, ChevronRight, GripVertical, MoreHorizontal, Plus, Edit, 
  Copy, Trash, Play, Pause, Eye, Upload, Clock, Target, User, Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Tarefa {
  id: string;
  nome: string;
  status: string;
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

interface EtapasTarefasListProps {
  projeto: {
    etapas: Etapa[];
  };
  etapasExpandidas: string[];
  tarefasDetalhesExpandidos: string[];
  tarefaAtiva: string | null;
  cronometroAtivo: boolean;
  tempoSessaoAtual: number;
  formatarTempo: (segundos: number) => string;
  formatarTempoSimples: (segundos: number) => string;
  calcularTempoTarefaAtualRealTime: () => number;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  toggleEtapa: (etapaId: string) => void;
  toggleDetalheTarefa: (tarefaId: string) => void;
  handleDragStart: (type: 'etapa' | 'tarefa', id: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetId: string, targetType: 'etapa' | 'tarefa') => void;
  iniciarTarefa: (tarefaId: string) => void;
  pausarTarefa: () => void;
  abrirModalEdicao: (tipo: 'projeto' | 'etapa' | 'tarefa', id: string | null, acao: 'criar' | 'editar' | 'duplicar') => void;
  abrirConfirmacaoExclusao: (tipo: 'projeto' | 'etapa' | 'tarefa', id: string, nome: string) => void;
}

export const EtapasTarefasList: React.FC<EtapasTarefasListProps> = ({
  projeto,
  etapasExpandidas,
  tarefasDetalhesExpandidos,
  tarefaAtiva,
  cronometroAtivo,
  tempoSessaoAtual,
  formatarTempo,
  formatarTempoSimples,
  calcularTempoTarefaAtualRealTime,
  getStatusColor,
  getStatusIcon,
  toggleEtapa,
  toggleDetalheTarefa,
  handleDragStart,
  handleDragOver,
  handleDrop,
  iniciarTarefa,
  pausarTarefa,
  abrirModalEdicao,
  abrirConfirmacaoExclusao
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Etapas do Projeto</h3>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
            onClick={() => abrirModalEdicao('etapa', null, 'criar')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova Etapa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projeto.etapas.map((etapa) => (
            <Card key={etapa.id} className="border border-gray-200">
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={() => handleDragStart('etapa', etapa.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, etapa.id, 'etapa')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => toggleEtapa(etapa.id)}
                      className="p-1 bg-transparent hover:bg-gray-100"
                    >
                      {etapasExpandidas.includes(etapa.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <h4 className="font-semibold text-gray-900">
                      ETAPA {etapa.numero}: {etapa.nome}
                    </h4>
                    <Badge className={getStatusColor(etapa.status)}>
                      {etapa.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ({etapa.tarefas.length} tarefas)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Progress value={etapa.progresso} className="w-24" />
                      <span className="text-sm font-medium text-gray-600">
                        {etapa.progresso}%
                      </span>
                    </div>
                    <div className="relative group">
                      <Button 
                        className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 bg-transparent border-none"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => abrirModalEdicao('etapa', null, 'criar')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Etapa
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={() => abrirModalEdicao('etapa', etapa.id, 'editar')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Etapa
                          </button>
                          <button
                            onClick={() => abrirConfirmacaoExclusao('etapa', etapa.id, etapa.nome)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir Etapa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {etapasExpandidas.includes(etapa.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {etapa.tarefas.map((tarefa) => (
                      <div key={tarefa.id}>
                        <div
                          className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                            tarefa.id === tarefaAtiva 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                          draggable
                          onDragStart={() => handleDragStart('tarefa', tarefa.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, tarefa.id, 'tarefa')}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">{tarefa.nome}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {tarefa.responsavel} • {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(tarefa.status)} text-xs`}>
                                {tarefa.status.replace('_', ' ')}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-1">
                              {tarefa.id === tarefaAtiva && cronometroAtivo ? (
                                <Button
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50 h-7 px-3 border"
                                  onClick={pausarTarefa}
                                >
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pausar
                                </Button>
                              ) : tarefa.id === tarefaAtiva && !cronometroAtivo ? (
                                <Button
                                  className="bg-green-600 hover:bg-green-700 text-white h-7 px-3"
                                  onClick={() => iniciarTarefa(tarefa.id)}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Continuar
                                </Button>
                              ) : tarefa.status === 'em_progresso' ? (
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-3"
                                  onClick={() => iniciarTarefa(tarefa.id)}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Iniciar
                                </Button>
                              ) : tarefa.status === 'nao_iniciada' ? (
                                <Button
                                  className="border-green-300 text-green-700 hover:bg-green-50 h-7 px-3 border"
                                  onClick={() => iniciarTarefa(tarefa.id)}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Começar
                                </Button>
                              ) : tarefa.status === 'concluida' ? (
                                null
                              ) : (
                                <div className="flex items-center px-3 py-1 bg-gray-100 rounded text-gray-700 h-7">
                                  <span className="text-sm">{getStatusIcon(tarefa.status)}</span>
                                  <span className="text-xs font-medium ml-1">
                                    {tarefa.status.replace('_', ' ')}
                                  </span>
                                </div>
                              )}

                              <Button
                                className="border-gray-300 text-gray-700 h-7 px-2 border"
                                onClick={() => toggleDetalheTarefa(tarefa.id)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {tarefa.id === tarefaAtiva && cronometroAtivo && (
                            <div className="mt-2 p-2 bg-green-100 rounded-md">
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-green-800">
                                  ⏱️ Sessão Atual: <span className="font-mono font-bold">{formatarTempo(tempoSessaoAtual)}</span>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    className="border-orange-300 text-orange-700 h-6 px-2 text-xs border"
                                    onClick={pausarTarefa}
                                  >
                                    Pausar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {tarefasDetalhesExpandidos.includes(tarefa.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 bg-white rounded-lg border shadow-sm overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <div className="text-xs text-gray-600">Tempo Total</div>
                                    <div className="font-semibold text-gray-900">
                                      {tarefa.id === tarefaAtiva ? formatarTempo(calcularTempoTarefaAtualRealTime()) : formatarTempo(tarefa.tempo_total)}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Target className="h-4 w-4 text-green-600" />
                                  <div>
                                    <div className="text-xs text-gray-600">Estimado</div>
                                    <div className="font-semibold text-gray-900">{formatarTempo(tarefa.tempo_estimado)}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-purple-600" />
                                  <div>
                                    <div className="text-xs text-gray-600">Responsável</div>
                                    <div className="font-semibold text-gray-900">{tarefa.responsavel}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-4 w-4 text-orange-600" />
                                  <div>
                                    <div className="text-xs text-gray-600">Data Início</div>
                                    <div className="font-semibold text-gray-900">
                                      {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">S</span>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-600">Sessões</div>
                                    <div className="font-semibold text-gray-900">{tarefa.notas_sessoes.length}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 