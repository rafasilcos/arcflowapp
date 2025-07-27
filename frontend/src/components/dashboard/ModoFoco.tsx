// ===== MODO FOCO ENTERPRISE =====
// Implementação COMPLETA baseada na página original de 4277 linhas

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, User, Play, Pause, Square, Save,
  Timer
} from 'lucide-react';
import { Tarefa } from '@/types/dashboard';

interface ModoFocoProps {
  modoFoco: boolean;
  setModoFoco: (ativo: boolean) => void;
  tarefaAtivaData: Tarefa | null;
  cronometroAtivo: boolean;
  tempoSessaoAtual: number;
  numeroSessoes: number;
  anotacaoSessao: string;
  setAnotacaoSessao: (anotacao: string) => void;
  iniciarTarefa: (tarefaId: string) => void;
  pausarTarefa: () => void;
  salvarNota: () => void;
  concluirTarefa: (tarefaId: string) => void;
  formatarTempo: (segundos: number) => string;
  formatarTempoSimples: (segundos: number) => string;
  calcularTempoTarefaAtualRealTime: () => number;
}

export const ModoFoco: React.FC<ModoFocoProps> = ({
  modoFoco,
  setModoFoco,
  tarefaAtivaData,
  cronometroAtivo,
  tempoSessaoAtual,
  numeroSessoes,
  anotacaoSessao,
  setAnotacaoSessao,
  iniciarTarefa,
  pausarTarefa,
  salvarNota,
  concluirTarefa,
  formatarTempo,
  formatarTempoSimples,
  calcularTempoTarefaAtualRealTime
}) => {
  return (
    <AnimatePresence>
      {modoFoco && tarefaAtivaData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden"
          >
            {/* Header Elegante */}
            <div className="relative bg-gradient-to-r from-blue-50/30 via-slate-50/30 to-white border-b border-slate-200/30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"></div>
              <div className="relative px-8 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h1 className="text-2xl font-bold text-slate-800">Modo Foco Ativo</h1>
                  <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    Sessão {numeroSessoes}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setModoFoco(false)}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="p-8">
              {/* Nome da Tarefa */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{tarefaAtivaData.nome}</h2>
                <div className="flex items-center justify-center space-x-4 text-slate-600">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {tarefaAtivaData.responsavel}
                  </span>
                  <span className="text-slate-400">•</span>
                  <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-700">
                    {tarefaAtivaData.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Cronômetro Central Elegante */}
                <div className="lg:col-span-1 flex justify-center">
                  <div className="relative">
                    {/* Círculo de fundo */}
                    <div className="w-48 h-48 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {/* Cronômetro SVG */}
                      <div className="relative w-36 h-36">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            className="text-slate-200"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray="264"
                            strokeDashoffset={cronometroAtivo ? "66" : "264"}
                            className="text-blue-500"
                            strokeLinecap="round"
                            animate={{
                              strokeDashoffset: cronometroAtivo ? ["66", "264", "66"] : "264"
                            }}
                            transition={{
                              duration: 3,
                              repeat: cronometroAtivo ? Infinity : 0,
                              ease: "linear"
                            }}
                          />
                        </svg>
                        
                        {/* Tempo no centro */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-mono font-bold text-slate-800 mb-1">
                              {formatarTempo(tempoSessaoAtual)}
                            </div>
                            <div className="text-sm text-slate-500">sessão atual</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Indicador de status */}
                    {cronometroAtivo && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Métricas e Controles */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Cards de Métricas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {formatarTempoSimples(tempoSessaoAtual)}
                      </div>
                      <div className="text-sm text-blue-600">Sessão</div>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {formatarTempoSimples(calcularTempoTarefaAtualRealTime())}
                      </div>
                      <div className="text-sm text-green-600">Total</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-slate-700">
                        {formatarTempoSimples(tarefaAtivaData.tempo_estimado)}
                      </div>
                      <div className="text-sm text-slate-600">Estimado</div>
                    </div>
                  </div>

                  {/* Controles Principais */}
                  <div className="flex justify-center space-x-4">
                    {!cronometroAtivo ? (
                      <Button 
                        size="lg" 
                        onClick={() => iniciarTarefa(tarefaAtivaData.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Iniciar
                      </Button>
                    ) : (
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={pausarTarefa}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg font-semibold"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pausar
                      </Button>
                    )}
                    
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => concluirTarefa(tarefaAtivaData.id)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Concluir
                    </Button>
                  </div>

                  {/* Anotações da Sessão */}
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                        <Timer className="w-5 h-5 mr-2" />
                        Anotações da Sessão
                      </h3>
                      <Badge variant="outline" className="bg-white">
                        Sessão {numeroSessoes}
                      </Badge>
                    </div>
                    
                    <Textarea
                      placeholder="Digite suas anotações para esta sessão... (Ctrl+S para salvar)"
                      value={anotacaoSessao}
                      onChange={(e) => setAnotacaoSessao(e.target.value)}
                      className="min-h-[120px] bg-white border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-slate-600">
                        💡 Use <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl+S</kbd> ou <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl+Enter</kbd> para salvar
                      </div>
                      <Button
                        onClick={salvarNota}
                        disabled={!anotacaoSessao.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Nota
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 