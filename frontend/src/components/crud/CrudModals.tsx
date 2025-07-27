'use client';

import React, { useState, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, AlertTriangle, Check, Clock, User, Calendar, Tag, 
  Building, Target, CheckCircle2, Trash2, Plus, Workflow 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ConfirmacaoExclusao } from '@/types/dashboard';

// Interfaces básicas
interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida' | 'atrasada' | 'aguardando_aprovacao';
  responsavel: string;
  tempo_estimado: number;
  tempo_total: number;
  tempo_sessao_atual: number;
  cronometro_ativo: boolean;
  data_inicio?: string;
  data_conclusao?: string;
  data_entrega?: string;
  prioridade?: 'baixa' | 'media' | 'alta' | 'critica';
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
  equipe: any[];
  atividades: any[];
  arquivos: any[];
}

interface ModalEdicaoProps {
  modoEdicao: {
    tipo: 'projeto' | 'etapa' | 'tarefa';
    acao: 'criar' | 'editar' | 'duplicar';
  } | null;
  formData: any;
  setFormData: (data: any) => void;
  onSalvar: () => void;
  onCancelar: () => void;
  carregando?: boolean;
}

interface ModalConfirmacaoProps {
  confirmacao: {
    tipo: 'projeto' | 'etapa' | 'tarefa';
    id: string;
    nome: string;
  } | null;
  onConfirmar: () => void;
  onCancelar: () => void;
  carregando?: boolean;
}

// ===== MODAL DE EDIÇÃO UNIVERSAL =====
export const ModalEdicao: React.FC<ModalEdicaoProps> = ({
  modoEdicao,
  formData,
  setFormData,
  onSalvar,
  onCancelar,
  carregando = false
}) => {
  if (!modoEdicao) return null;

  const { tipo, acao } = modoEdicao;

  const handleInputChange = (campo: string, valor: any) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const getTitulo = () => {
    const acoes: Record<string, string> = {
      criar: 'Criar',
      editar: 'Editar', 
      duplicar: 'Duplicar'
    };
    const tipos: Record<string, string> = {
      projeto: 'Projeto',
      etapa: 'Etapa',
      tarefa: 'Tarefa'
    };
    return `${acoes[acao]} ${tipos[tipo]}`;
  };

  const getIcone = () => {
    const icones: Record<string, JSX.Element> = {
      projeto: <Building className="h-6 w-6" />,
      etapa: <Workflow className="h-6 w-6" />,
      tarefa: <Target className="h-6 w-6" />
    };
    return icones[tipo];
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {getIcone()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{getTitulo()}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancelar}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-6">
            {tipo === 'projeto' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Projeto *
                    </label>
                    <Input
                      value={formData.nome || ''}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Ex: Residência Unifamiliar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <Input
                      value={formData.cliente || ''}
                      onChange={(e) => handleInputChange('cliente', e.target.value)}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gerente Responsável *
                    </label>
                    <Input
                      value={formData.gerente || ''}
                      onChange={(e) => handleInputChange('gerente', e.target.value)}
                      placeholder="Ex: Arq. Maria Santos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status || 'em_planejamento'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="em_planejamento">Em Planejamento</option>
                      <option value="em_progresso">Em Progresso</option>
                      <option value="em_revisao">Em Revisão</option>
                      <option value="concluido">Concluído</option>
                      <option value="pausado">Pausado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início
                    </label>
                    <Input
                      type="date"
                      value={formData.data_inicio || ''}
                      onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo Final
                    </label>
                    <Input
                      type="date"
                      value={formData.prazo_final || ''}
                      onChange={(e) => handleInputChange('prazo_final', e.target.value)}
                    />
          </div>
        </div>
              </>
            )}

            {tipo === 'etapa' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Etapa *
            </label>
            <Input
              value={formData.nome || ''}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Ex: Projeto Arquitetônico"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número da Etapa *
                    </label>
                    <Input
                      type="number"
                      value={formData.numero || 1}
                      onChange={(e) => handleInputChange('numero', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status || 'nao_iniciada'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="nao_iniciada">Não Iniciada</option>
                      <option value="em_progresso">Em Progresso</option>
                      <option value="em_revisao">Em Revisão</option>
                      <option value="concluida">Concluída</option>
                      <option value="pausada">Pausada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progresso (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.progresso || 0}
                      onChange={(e) => handleInputChange('progresso', parseInt(e.target.value))}
                      min="0"
                      max="100"
            />
          </div>
                </div>
              </>
            )}

          {tipo === 'tarefa' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Tarefa *
                    </label>
                    <Input
                      value={formData.nome || ''}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Ex: Análise do Terreno e Levantamento Topográfico"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável *
                    </label>
                    <Input
                      value={formData.responsavel || ''}
                      onChange={(e) => handleInputChange('responsavel', e.target.value)}
                      placeholder="Ex: Eng. Carlos Lima"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo Estimado (horas)
                    </label>
                    <Input
                      type="number"
                      value={formData.tempo_estimado_horas || 8}
                      onChange={(e) => handleInputChange('tempo_estimado_horas', parseFloat(e.target.value))}
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                  </label>
                  <select
                      value={formData.status || 'nao_iniciada'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="nao_iniciada">Não Iniciada</option>
                      <option value="em_progresso">Em Progresso</option>
                      <option value="em_revisao">Em Revisão</option>
                      <option value="concluida">Concluída</option>
                      <option value="atrasada">Atrasada</option>
                      <option value="aguardando_aprovacao">Aguardando Aprovação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.prioridade || 'media'}
                      onChange={(e) => handleInputChange('prioridade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Entrega
                  </label>
                    <Input
                      type="date"
                      value={formData.data_entrega || ''}
                      onChange={(e) => handleInputChange('data_entrega', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.requer_aprovacao || false}
                        onChange={(e) => handleInputChange('requer_aprovacao', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Requer aprovação do cliente
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}
              </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 border-t">
            <Button variant="outline" onClick={onCancelar} disabled={carregando}>
              Cancelar
            </Button>
            <Button 
              onClick={onSalvar} 
              disabled={carregando}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {carregando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
      </motion.div>
    </div>
    </AnimatePresence>
  );
};

// ===== MODAL DE CONFIRMAÇÃO DE EXCLUSÃO =====
export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  confirmacao,
  onConfirmar,
  onCancelar,
  carregando = false
}) => {
  if (!confirmacao) return null;

  const getTipoLabel = () => {
    const tipos: Record<string, string> = {
      projeto: 'Projeto',
      etapa: 'Etapa',
      tarefa: 'Tarefa'
    };
    return tipos[confirmacao.tipo] || 'Item';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-red-50 border-b border-red-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-red-900">Confirmar Exclusão</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Tem certeza que deseja excluir {getTipoLabel()} <strong>{confirmacao.nome}</strong>?
          </p>
          
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Atenção!
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Esta ação não pode ser desfeita. 
                  {confirmacao.tipo === 'etapa' && ' Todas as tarefas desta etapa também serão excluídas.'}
                  {confirmacao.tipo === 'projeto' && ' Todas as etapas e tarefas deste projeto também serão excluídas.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onCancelar}
              disabled={carregando}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmar}
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== COMPONENTE DE FEEDBACK DE SUCESSO =====
export const FeedbackSucesso: React.FC<{ 
  visivel: boolean; 
  mensagem: string; 
  onFechar: () => void 
}> = ({ visivel, mensagem, onFechar }) => {
  React.useEffect(() => {
    if (visivel) {
      const timer = setTimeout(onFechar, 3000);
      return () => clearTimeout(timer);
    }
  }, [visivel, onFechar]);

  if (!visivel) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-800 font-medium">{mensagem}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onFechar}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 