'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronDown, Play, Pause, Square, Plus, Edit3, 
  Trash2, Clock, User, Paperclip, MessageSquare, MoreHorizontal,
  FileText, Calendar, AlertTriangle, CheckCircle2, Upload,
  Timer, GripVertical, Copy, Eye, Target
} from 'lucide-react';

// ===== TIPOS =====
interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida';
  responsavel: string;
  tempo_estimado: number;
  tempo_total: number;
  data_entrega: string;
  prioridade: 'baixa' | 'media' | 'alta';
  arquivos: number;
  comentarios: number;
}

interface Etapa {
  id: string;
  numero: number;
  nome: string;
  progresso: number;
  status: 'nao_iniciada' | 'em_progresso' | 'concluida';
  data_inicio: string;
  data_fim: string;
  responsavel: string;
  arquivos: number;
  comentarios: number;
  tarefas: Tarefa[];
}

interface ProjetoEtapasTarefasCardProps {
  etapas: Etapa[];
  onTarefaAction?: (action: string, tarefaId: string, etapaId: string) => void;
  onEtapaAction?: (action: string, etapaId: string) => void;
}

// ===== COMPONENTE PRINCIPAL =====
export function ProjetoEtapasTarefasCard({ 
  etapas, 
  onTarefaAction, 
  onEtapaAction 
}: ProjetoEtapasTarefasCardProps) {
  const [etapasExpandidas, setEtapasExpandidas] = useState<Record<string, boolean>>({});
  const [cronometroAtivo, setCronometroAtivo] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState<string | null>(null);

  // ===== HANDLERS =====
  const toggleEtapa = useCallback((etapaId: string) => {
    setEtapasExpandidas(prev => ({
      ...prev,
      [etapaId]: !prev[etapaId]
    }));
  }, []);

  const handleCronometro = useCallback((tarefaId: string, action: 'play' | 'pause' | 'stop') => {
    if (action === 'play') {
      setCronometroAtivo(tarefaId);
    } else if (action === 'pause' || action === 'stop') {
      setCronometroAtivo(null);
    }
    onTarefaAction?.(action, tarefaId, '');
  }, [onTarefaAction]);

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-500';
      case 'em_progresso': return 'bg-blue-500 animate-pulse';
      case 'em_revisao': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'border-l-red-500 bg-red-50';
      case 'media': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  // ===== COMPONENTE: ETAPA =====
  const EtapaItem = ({ etapa }: { etapa: Etapa }) => {
    const expandida = etapasExpandidas[etapa.id];
    const totalTarefas = etapa.tarefas.length;
    const tarefasConcluidas = etapa.tarefas.filter(t => t.status === 'concluida').length;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Header da Etapa */}
        <div 
          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all"
          onClick={() => toggleEtapa(etapa.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: expandida ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </motion.div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  etapa.status === 'concluida' ? 'bg-green-500' : 
                  etapa.status === 'em_progresso' ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  {etapa.numero}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{etapa.nome}</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>👤 {etapa.responsavel}</span>
                    <span>📅 {etapa.data_inicio} - {etapa.data_fim}</span>
                    <span>📁 {etapa.arquivos} arquivos</span>
                    <span>💬 {etapa.comentarios} comentários</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Progress value={etapa.progresso} className="w-20 h-2" />
                  <span className="text-sm font-medium text-gray-700">{etapa.progresso}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {tarefasConcluidas}/{totalTarefas} tarefas
                </p>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEtapaAction?.('add-task', etapa.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEtapaAction?.('edit', etapa.id);
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEtapaAction?.('more', etapa.id);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <AnimatePresence>
          {expandida && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-2 space-y-2">
                {etapa.tarefas.map((tarefa, index) => (
                  <TarefaItem 
                    key={tarefa.id} 
                    tarefa={tarefa} 
                    etapaId={etapa.id}
                    index={index}
                  />
                ))}
                
                {/* Botão Adicionar Tarefa */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={() => onEtapaAction?.('add-task', etapa.id)}
                >
                  <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Adicionar Nova Tarefa</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ===== COMPONENTE: TAREFA =====
  const TarefaItem = ({ tarefa, etapaId, index }: { tarefa: Tarefa; etapaId: string; index: number }) => {
    const isAtiva = cronometroAtivo === tarefa.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`border-l-4 ${getPrioridadeColor(tarefa.prioridade)} rounded-r-lg p-3 hover:shadow-md transition-all group`}
      >
        <div className="flex items-center justify-between">
          {/* Informações da Tarefa */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              <div className={`w-3 h-3 rounded-full ${getStatusColor(tarefa.status)}`}></div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900 text-sm">{tarefa.nome}</h4>
                <Badge 
                  variant={tarefa.prioridade === 'alta' ? 'destructive' : 
                           tarefa.prioridade === 'media' ? 'default' : 'secondary'}
                  className="text-xs h-5"
                >
                  {tarefa.prioridade}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                <span className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{tarefa.responsavel}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{tarefa.data_entrega}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatarTempo(tarefa.tempo_total)} / {formatarTempo(tarefa.tempo_estimado)}</span>
                </span>
                {tarefa.arquivos > 0 && (
                  <span className="flex items-center space-x-1">
                    <Paperclip className="h-3 w-3" />
                    <span>{tarefa.arquivos}</span>
                  </span>
                )}
                {tarefa.comentarios > 0 && (
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{tarefa.comentarios}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ações da Tarefa */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Cronômetro */}
            <div className="flex items-center space-x-1 border rounded px-2 py-1">
              {isAtiva ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleCronometro(tarefa.id, 'pause')}
                >
                  <Pause className="h-3 w-3 text-blue-600" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleCronometro(tarefa.id, 'play')}
                >
                  <Play className="h-3 w-3 text-green-600" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleCronometro(tarefa.id, 'stop')}
              >
                <Square className="h-3 w-3 text-red-600" />
              </Button>
            </div>

            {/* Outras ações */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTarefaAction?.('upload', tarefa.id, etapaId)}
            >
              <Upload className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTarefaAction?.('comment', tarefa.id, etapaId)}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTarefaAction?.('edit', tarefa.id, etapaId)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTarefaAction?.('duplicate', tarefa.id, etapaId)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTarefaAction?.('more', tarefa.id, etapaId)}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Barra de Progresso da Tarefa */}
        {tarefa.tempo_total > 0 && (
          <div className="mt-2">
            <Progress 
              value={(tarefa.tempo_total / tarefa.tempo_estimado) * 100} 
              className="h-1" 
            />
          </div>
        )}
      </motion.div>
    );
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <Card className="h-full">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Projeto - Etapas & Tarefas</span>
            <Badge variant="outline" className="ml-2">
              {etapas.length} etapas
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Etapa
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Expandir Todas
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {etapas.map((etapa) => (
            <EtapaItem key={etapa.id} etapa={etapa} />
          ))}
          
          {/* Botão Adicionar Etapa */}
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            onClick={() => onEtapaAction?.('add', '')}
          >
            <Plus className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-medium text-blue-700 mb-1">Adicionar Nova Etapa</h3>
            <p className="text-sm text-blue-600">Organize seu projeto em etapas estruturadas</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
} 