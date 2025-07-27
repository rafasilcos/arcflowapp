'use client';

// ===== VISUALIZAÇÃO KANBAN ENTERPRISE =====
// Implementação COMPLETA baseada na página original de 4277 linhas

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, Square, User, Clock, Timer
} from 'lucide-react';
import { Projeto, Tarefa } from '@/types/dashboard';

interface KanbanViewProps {
  projeto: Projeto;
  tarefaAtiva: string | null;
  cronometroAtivo: boolean;
  tempoSessaoAtual: number;
  setTarefaAtiva: (tarefaId: string) => void;
  iniciarTarefa: (tarefaId: string) => void;
  pausarTarefa: () => void;
  concluirTarefa: (tarefaId: string) => void;
  formatarTempo: (segundos: number) => string;
  formatarTempoSimples: (segundos: number) => string;
  getStatusIcon: (status: string) => string;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  projeto,
  tarefaAtiva,
  cronometroAtivo,
  tempoSessaoAtual,
  setTarefaAtiva,
  iniciarTarefa,
  pausarTarefa,
  concluirTarefa,
  formatarTempo,
  formatarTempoSimples,
  getStatusIcon
}) => {
  const statusColunas = [
    { 
      id: 'nao_iniciada', 
      title: '📋 Não Iniciadas', 
      color: 'bg-gray-100 border-gray-300',
      headerColor: 'text-gray-700'
    },
    { 
      id: 'em_progresso', 
      title: '🔄 Em Progresso', 
      color: 'bg-blue-100 border-blue-300',
      headerColor: 'text-blue-700'
    },
    { 
      id: 'em_revisao', 
      title: '👁️ Em Revisão', 
      color: 'bg-yellow-100 border-yellow-300',
      headerColor: 'text-yellow-700'
    },
    { 
      id: 'concluida', 
      title: '✅ Concluídas', 
      color: 'bg-green-100 border-green-300',
      headerColor: 'text-green-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statusColunas.map(coluna => {
        const tarefasStatus = projeto.etapas
          .flatMap(e => e.tarefas)
          .filter(t => t.status === coluna.id);

        return (
          <div key={coluna.id} className={`rounded-lg border-2 ${coluna.color} p-4`}>
            {/* Header da Coluna */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${coluna.headerColor}`}>
                {coluna.title}
              </h3>
              <Badge variant="outline" className="bg-white">
                {tarefasStatus.length}
              </Badge>
            </div>
            
            {/* Cards das Tarefas */}
            <div className="space-y-3 min-h-[400px]">
              {tarefasStatus.map((tarefa, index) => (
                <motion.div
                  key={tarefa.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                    tarefa.id === tarefaAtiva ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setTarefaAtiva(tarefa.id)}
                >
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900 line-clamp-2">
                      {tarefa.nome}
                    </span>
                    <span className="text-lg flex-shrink-0">
                      {getStatusIcon(tarefa.status)}
                    </span>
                  </div>
                  
                  {/* Responsável */}
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <User className="h-3 w-3 mr-1" />
                    {tarefa.responsavel}
                  </div>
                  
                  {/* Tempo */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                      </span>
                    </div>
                    {tarefa.tempo_total > tarefa.tempo_estimado && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        Atrasado
                      </Badge>
                    )}
                  </div>

                  {/* Cronômetro Ativo */}
                  {tarefa.id === tarefaAtiva && cronometroAtivo && (
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-green-600 mb-2 bg-green-50 rounded p-2">
                      <div className="flex items-center">
                        <Timer className="h-3 w-3 mr-1 animate-pulse" />
                        <span>Sessão:</span>
                      </div>
                      <span>{formatarTempo(tempoSessaoAtual)}</span>
                    </div>
                  )}

                  {/* Barra de Progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        tarefa.status === 'concluida' ? 'bg-green-500' :
                        tarefa.status === 'em_progresso' ? 'bg-blue-500' :
                        tarefa.status === 'em_revisao' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`}
                      style={{ 
                        width: tarefa.status === 'concluida' ? '100%' : 
                               tarefa.tempo_estimado > 0 ? 
                               `${Math.min((tarefa.tempo_total / tarefa.tempo_estimado) * 100, 100)}%` : 
                               '0%'
                      }}
                    />
                  </div>
                  
                  {/* Controles da Tarefa */}
                  {tarefa.id === tarefaAtiva && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex space-x-1">
                        {!cronometroAtivo ? (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              iniciarTarefa(tarefa.id);
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-orange-300 text-orange-700 text-xs px-2 py-1 h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              pausarTarefa();
                            }}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-300 text-blue-700 text-xs px-2 py-1 h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            concluirTarefa(tarefa.id);
                          }}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Indicadores Visuais */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Prioridade */}
                    {tarefa.prioridade && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1 py-0 ${
                          tarefa.prioridade === 'critica' ? 'border-red-300 text-red-700' :
                          tarefa.prioridade === 'alta' ? 'border-orange-300 text-orange-700' :
                          tarefa.prioridade === 'media' ? 'border-yellow-300 text-yellow-700' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {tarefa.prioridade === 'critica' ? '🔴' :
                         tarefa.prioridade === 'alta' ? '🟠' :
                         tarefa.prioridade === 'media' ? '🟡' : '🔵'}
                      </Badge>
                    )}

                    {/* Aprovação Necessária */}
                    {tarefa.requer_aprovacao && (
                      <Badge variant="outline" className="text-xs px-1 py-0 border-purple-300 text-purple-700">
                        📋 Aprovação
                      </Badge>
                    )}

                    {/* Arquivos Anexados */}
                    {tarefa.arquivos && tarefa.arquivos.length > 0 && (
                      <Badge variant="outline" className="text-xs px-1 py-0 border-blue-300 text-blue-700">
                        📎 {tarefa.arquivos.length}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Estado Vazio */}
              {tarefasStatus.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-sm">Nenhuma tarefa</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanView; 