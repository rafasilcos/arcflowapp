'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Timer, MessageSquare, Paperclip, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TarefaDetalhesModalProps {
  tarefa: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TarefaDetalhesModal({ tarefa, isOpen, onClose }: TarefaDetalhesModalProps) {
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  if (!tarefa || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className="h-6 w-6" />
                  <h1 className="text-xl font-bold">Detalhes da Tarefa</h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Informações da Tarefa */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{tarefa.nome}</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Responsável</p>
                      <p className="font-medium text-gray-900">👤 {tarefa.responsavel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                      <Badge variant="outline">{tarefa.status}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Prioridade</p>
                      <Badge variant="destructive">{tarefa.prioridade}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Progresso</p>
                      <Progress value={75} className="mt-1" />
                    </div>
                  </div>

                  {/* Controle do Cronômetro */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={cronometroAtivo ? "destructive" : "secondary"}
                        onClick={() => setCronometroAtivo(!cronometroAtivo)}
                      >
                        {cronometroAtivo ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {cronometroAtivo ? 'Pausar' : 'Iniciar'}
                      </Button>
                      
                      {cronometroAtivo && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-800 font-mono">02:34:12</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sessões de Cronômetro */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <span>Histórico de Sessões</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {[1, 2, 3].map((sessao) => (
                      <div key={sessao} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sessão #{sessao}</p>
                            <p className="text-sm text-gray-600">📅 15/01/2024 • 09:00 - 11:30</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">2h 30m</p>
                            <Badge variant="secondary">Completa</Badge>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">💭 Trabalhei na análise do terreno, coletei todas as medidas necessárias.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revisões do Manager */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-yellow-600" />
                    <span>Revisões do Manager</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { tipo: 'solicitacao', titulo: 'Revisar medidas do terreno', descricao: 'Por favor, confirme as medidas da lateral direita do terreno.', status: 'pendente' },
                      { tipo: 'aprovacao', titulo: 'Aprovação do levantamento', descricao: 'Levantamento topográfico aprovado. Pode prosseguir.', status: 'resolvida' }
                    ].map((revisao, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{revisao.titulo}</h4>
                              <Badge variant={revisao.status === 'resolvida' ? 'secondary' : 'destructive'}>
                                {revisao.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{revisao.descricao}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>👤 Maria Santos</span>
                              <span>📅 16/01/2024 14:30</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arquivos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Paperclip className="h-5 w-5 text-green-600" />
                    <span>Arquivos</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { nome: 'levantamento-topografico.pdf', tamanho: '2.5 MB', tipo: 'PDF' },
                      { nome: 'fotos-terreno.zip', tamanho: '15.2 MB', tipo: 'ZIP' },
                      { nome: 'medidas-precisas.dwg', tamanho: '1.8 MB', tipo: 'DWG' }
                    ].map((arquivo, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-blue-600 bg-blue-50 rounded-lg p-1" />
                            <div>
                              <p className="font-medium text-sm">{arquivo.nome}</p>
                              <p className="text-xs text-gray-500">{arquivo.tamanho} • {arquivo.tipo}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anotações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Anotações</span>
                  </h3>
                  
                  {/* Nova Anotação */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <textarea
                      placeholder="Adicionar nova anotação..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button size="sm">Salvar Anotação</Button>
                    </div>
                  </div>
                  
                  {/* Lista de Anotações */}
                  <div className="space-y-3">
                    {[
                      '16/01/2024 09:15: Terreno tem uma declividade maior que o esperado na parte fundos.',
                      '15/01/2024 14:30: Necessário ajustar o projeto para considerar a árvore na lateral esquerda.'
                    ].map((anotacao, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{anotacao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 p-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button>
                Salvar Alterações
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 