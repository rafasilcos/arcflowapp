import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Edit3, Copy, Trash2, Save, Lightbulb, Clock, 
  User, AlertTriangle, CheckCircle, Zap, Target, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tarefa, Etapa } from '@/types/briefing';
import { AnaliseInteligenteService } from '@/data/templates-inteligentes';
import { AnaliseInteligente } from '@/types/validacao';

interface ModalCrudAvancadoProps {
  isOpen: boolean;
  modo: 'criar' | 'editar' | 'duplicar';
  tipo: 'etapa' | 'tarefa';
  item?: Etapa | Tarefa;
  etapaId?: string; // Para criação de tarefas
  onClose: () => void;
  onSave: (dados: any) => void;
  onDelete?: () => void;
}

export function ModalCrudAvancado({
  isOpen,
  modo,
  tipo,
  item,
  etapaId,
  onClose,
  onSave,
  onDelete
}: ModalCrudAvancadoProps) {
  
  const [formData, setFormData] = useState<any>({});
  const [analiseInteligente, setAnaliseInteligente] = useState<AnaliseInteligente | null>(null);
  const [mostrarAnalise, setMostrarAnalise] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar formulário
  useEffect(() => {
    if (isOpen) {
      if (modo === 'editar' && item) {
        setFormData({ ...item });
      } else if (modo === 'duplicar' && item) {
        setFormData({
          ...item,
          nome: `${item.nome} (Cópia)`,
          id: undefined
        });
      } else {
        // Criar novo
        setFormData(tipo === 'etapa' ? {
          nome: '',
          descricao: '',
          numero: 1,
          status: 'nao_iniciada',
          progresso: 0
        } : {
          nome: '',
          descricao: '',
          responsavel: '',
          tempo_estimado: 3600,
          status: 'nao_iniciada',
          requer_aprovacao: false,
          prioridade: 'media'
        });
      }
      setAnaliseInteligente(null);
      setMostrarAnalise(false);
      setErrors({});
    }
  }, [isOpen, modo, item, tipo]);

  // Análise inteligente para tarefas
  const analisarTarefaInteligente = async (nomeTarefa: string) => {
    if (!nomeTarefa.trim() || nomeTarefa.length < 3) return;
    
    setLoading(true);
    try {
      const analise = AnaliseInteligenteService.analisarTarefaInteligente(
        nomeTarefa, 
        etapaId || 'desenvolvimento'
      );
      setAnaliseInteligente(analise);
      setMostrarAnalise(true);
    } catch (error) {
      console.error('Erro na análise inteligente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar sugestão da análise inteligente
  const aplicarSugestaoInteligente = () => {
    if (!analiseInteligente) return;
    
    setFormData((prev: any) => ({
      ...prev,
      tempo_estimado: analiseInteligente.tempo_estimado,
      responsavel: analiseInteligente.responsavel_sugerido,
      requer_aprovacao: analiseInteligente.requer_aprovacao,
      descricao: analiseInteligente.tarefa_sugerida?.descricao || prev.descricao
    }));
    
    setMostrarAnalise(false);
  };

  // Validação do formulário
  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (tipo === 'tarefa') {
      if (!formData.responsavel?.trim()) {
        newErrors.responsavel = 'Responsável é obrigatório';
      }
      
      if (!formData.tempo_estimado || formData.tempo_estimado <= 0) {
        newErrors.tempo_estimado = 'Tempo estimado deve ser maior que zero';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar
  const handleSave = () => {
    if (!validarFormulario()) return;
    
    onSave(formData);
    onClose();
  };

  // Formatadores
  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
  };

  const obterCorConfianca = (confianca: number) => {
    if (confianca >= 80) return 'text-green-600 bg-green-100';
    if (confianca >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (!isOpen) return null;

  const titulo = `${modo === 'criar' ? 'Criar' : modo === 'editar' ? 'Editar' : 'Duplicar'} ${tipo === 'etapa' ? 'Etapa' : 'Tarefa'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {modo === 'criar' ? <Plus className="w-5 h-5" /> :
                   modo === 'editar' ? <Edit3 className="w-5 h-5" /> :
                   <Copy className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{titulo}</h2>
                  <p className="text-blue-100">
                    {tipo === 'etapa' ? 'Configure as informações da etapa' : 'Configure as informações da tarefa'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Formulário Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna Esquerda - Informações Básicas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome {tipo === 'etapa' ? 'da Etapa' : 'da Tarefa'} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.nome || ''}
                      onChange={(e) => {
                        setFormData((prev: any) => ({ ...prev, nome: e.target.value }));
                        if (tipo === 'tarefa' && e.target.value.length > 3) {
                          analisarTarefaInteligente(e.target.value);
                        }
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nome ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={tipo === 'etapa' ? 'Ex: Desenvolvimento do Projeto' : 'Ex: Estudo Preliminar Arquitetônico'}
                    />
                    {loading && tipo === 'tarefa' && (
                      <div className="absolute right-3 top-2.5">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, descricao: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva os objetivos e escopo..."
                  />
                </div>

                {tipo === 'tarefa' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Responsável *
                      </label>
                      <select
                        value={formData.responsavel || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, responsavel: e.target.value }))}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.responsavel ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o responsável</option>
                        <option value="Arquiteto">Arquiteto</option>
                        <option value="Engenheiro">Engenheiro</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Designer">Designer</option>
                        <option value="Gerente de Projeto">Gerente de Projeto</option>
                      </select>
                      {errors.responsavel && <p className="text-red-600 text-sm mt-1">{errors.responsavel}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tempo Estimado *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={Math.floor((formData.tempo_estimado || 0) / 3600)}
                            onChange={(e) => setFormData((prev: any) => ({ 
                              ...prev, 
                              tempo_estimado: parseInt(e.target.value) * 3600 || 0 
                            }))}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.tempo_estimado ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="8"
                            min="1"
                          />
                          <span className="absolute right-3 top-2.5 text-gray-500 text-sm">horas</span>
                        </div>
                        {errors.tempo_estimado && <p className="text-red-600 text-sm mt-1">{errors.tempo_estimado}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prioridade
                        </label>
                        <select
                          value={formData.prioridade || 'media'}
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, prioridade: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                          <option value="critica">Crítica</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.requer_aprovacao || false}
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, requer_aprovacao: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Requer aprovação</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Coluna Direita - Análise Inteligente */}
              {tipo === 'tarefa' && analiseInteligente && mostrarAnalise && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-semibold text-gray-900">Análise Inteligente</h3>
                        <Badge className={`text-xs px-2 py-1 rounded-full ${obterCorConfianca(analiseInteligente.confianca)}`}>
                          {analiseInteligente.confianca}% confiança
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Tempo sugerido: {formatarTempo(analiseInteligente.tempo_estimado)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Responsável: {analiseInteligente.responsavel_sugerido}</span>
                        </div>

                        {analiseInteligente.requer_aprovacao && (
                          <div className="flex items-center space-x-2 text-sm text-orange-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Requer aprovação</span>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          {analiseInteligente.justificativa}
                        </div>

                        <Button
                          onClick={aplicarSugestaoInteligente}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Aplicar Sugestões
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alternativas */}
                  {analiseInteligente.alternativas.length > 0 && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Templates Alternativos
                        </h4>
                        <div className="space-y-2">
                          {analiseInteligente.alternativas.slice(0, 3).map((template, index) => (
                            <button
                              key={template.id}
                              onClick={() => {
                                setFormData((prev: any) => ({
                                  ...prev,
                                  nome: template.nome,
                                  descricao: template.descricao,
                                  tempo_estimado: template.tempo_estimado_base,
                                  responsavel: AnaliseInteligenteService['traduzirResponsavel'](template.responsavel_sugerido),
                                  requer_aprovacao: template.requer_aprovacao
                                }));
                                setMostrarAnalise(false);
                              }}
                              className="w-full text-left p-2 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                              <div className="text-sm font-medium text-gray-900">{template.nome}</div>
                              <div className="text-xs text-gray-500">{formatarTempo(template.tempo_estimado_base)}</div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Placeholder para quando não há análise */}
              {tipo === 'tarefa' && (!analiseInteligente || !mostrarAnalise) && (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">Digite o nome da tarefa para receber</p>
                    <p className="text-sm">sugestões inteligentes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <div className="flex space-x-3">
              {modo === 'editar' && onDelete && (
                <Button
                  onClick={onDelete}
                  className="px-4 py-2 text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </Button>
              
              <Button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 