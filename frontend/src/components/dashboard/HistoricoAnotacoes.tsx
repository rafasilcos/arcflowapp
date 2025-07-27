'use client';

// ===== HISTÓRICO DE ANOTAÇÕES ENTERPRISE =====
// Implementação COMPLETA baseada na página original de 4277 linhas

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, Clock, User, Calendar
} from 'lucide-react';
import { AnotacaoSalva, Tarefa } from '@/types/dashboard';

interface HistoricoAnotacoesProps {
  tarefa: Tarefa;
  anotacoesSalvas: AnotacaoSalva[];
  tarefaAtiva: string | null;
  anotacaoSessao: string;
  formatarTempo: (segundos: number) => string;
  expanded: boolean;
}

const HistoricoAnotacoes: React.FC<HistoricoAnotacoesProps> = ({
  tarefa,
  anotacoesSalvas,
  tarefaAtiva,
  anotacaoSessao,
  formatarTempo,
  expanded
}) => {
  const anotacoesTarefa = anotacoesSalvas.filter(a => a.tarefaId === tarefa.id);

  if (!expanded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 bg-white rounded-lg border shadow-sm overflow-hidden"
    >
      {/* HEADER COM INFORMAÇÕES PRINCIPAIS */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-xs text-gray-600">Tempo Total</div>
              <div className="font-semibold text-gray-900">
                {tarefa.id === tarefaAtiva ? formatarTempo(tarefa.tempo_total) : formatarTempo(tarefa.tempo_total)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-600" />
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
            <Calendar className="h-4 w-4 text-orange-600" />
            <div>
              <div className="text-xs text-gray-600">Iniciado</div>
              <div className="font-semibold text-gray-900">
                {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-4">
        {/* Sessão Atual Ativa */}
        {tarefa.id === tarefaAtiva && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-800">Sessão Atual - Em Andamento</span>
              </div>
              <div className="font-mono text-lg font-bold text-green-700">
                Em progresso...
              </div>
            </div>
            {anotacaoSessao && (
              <div className="bg-white/70 rounded p-2 text-sm text-green-700">
                💭 {anotacaoSessao}
              </div>
            )}
          </div>
        )}

        {/* Histórico de Anotações */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            Histórico de Anotações
            <Badge className="ml-2 bg-blue-100 text-blue-700">
              {anotacoesTarefa.length}
            </Badge>
          </h4>
          
          {anotacoesTarefa.length > 0 ? (
            <div className="space-y-2">
              {anotacoesTarefa
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((anotacao, index) => (
                <motion.div
                  key={anotacao.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Sessão {anotacao.sessao}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(anotacao.timestamp).toLocaleDateString('pt-BR')} • {new Date(anotacao.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="font-mono font-semibold text-blue-600">
                      {formatarTempo(anotacao.tempo)}
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 text-sm text-gray-700">
                    💭 {anotacao.texto}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">
                {tarefa.id === tarefaAtiva 
                  ? 'Nenhuma anotação salva ainda. Digite uma anotação na sessão atual e clique em "Salvar Nota".'
                  : 'Nenhuma anotação registrada para esta tarefa'
                }
              </p>
            </div>
          )}
        </div>

        {/* Revisões Pendentes */}
        {tarefa.requer_aprovacao && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
              Revisões Pendentes
            </h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800">⚠️ Aguardando aprovação do cliente</span>
                <Badge className="bg-yellow-500">Pendente</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HistoricoAnotacoes; 