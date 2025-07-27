'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Tarefa, Etapa } from '../../data/projectTemplates';
import { NovaTarefaData } from '../../hooks/useProjectCrud';

// ===== INTERFACE DO COMPONENTE =====
interface TarefaEditorProps {
  tarefa?: Tarefa | null;
  etapas: Etapa[];
  etapaAtual?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (etapaId: number, dados: NovaTarefaData) => Promise<void>;
  isLoading?: boolean;
}

// ===== OPÇÕES DE DISCIPLINAS =====
const DISCIPLINAS = [
  'Arquitetura',
  'Estrutural', 
  'Instalações',
  'Design',
  'Paisagismo',
  'Sustentabilidade',
  'Orçamento',
  'Gestão',
  'Aprovações',
  'Execução'
];

// ===== OPÇÕES DE RESPONSÁVEIS =====
const RESPONSAVEIS = [
  'Ana Arquiteta',
  'Carlos Estrutural',
  'Marina Designer',
  'João Silva',
  'Maria Instalações',
  'Pedro Paisagista',
  'Laura Sustentabilidade',
  'Rafael Gestor'
];

// ===== COMPONENTE PRINCIPAL =====
export function TarefaEditor({ 
  tarefa, 
  etapas, 
  etapaAtual, 
  isOpen, 
  onClose, 
  onSave, 
  isLoading = false 
}: TarefaEditorProps) {
  const [formData, setFormData] = useState<NovaTarefaData & { etapaId: number }>({
    nome: '',
    descricao: '',
    responsavel: 'Ana Arquiteta',
    disciplina: 'Arquitetura',
    tempoEstimado: '8h',
    prioridade: 'media',
    dataVencimento: '',
    template_notas: '',
    checklist: [],
    etapaId: etapaAtual || (etapas[0]?.id ?? 1)
  });

  const [checklistInput, setChecklistInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== EFEITOS =====
  useEffect(() => {
    if (tarefa) {
      // Modo edição
      const etapaId = etapas.find(e => e.tarefas.some(t => t.id === tarefa.id))?.id || etapaAtual || etapas[0]?.id || 1;
      
      setFormData({
        nome: tarefa.nome || '',
        descricao: tarefa.descricao || '',
        responsavel: tarefa.responsavel || 'Ana Arquiteta',
        disciplina: tarefa.disciplina || 'Arquitetura',
        tempoEstimado: tarefa.tempoEstimado || '8h',
        prioridade: tarefa.prioridade || 'media',
        dataVencimento: tarefa.dataVencimento || '',
        template_notas: tarefa.template_notas || '',
        checklist: tarefa.checklist || [],
        etapaId
      });
      setChecklistInput((tarefa.checklist || []).join(' | '));
    } else {
      // Modo criação
      const hoje = new Date();
      const proximaSemana = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      setFormData({
        nome: '',
        descricao: '',
        responsavel: 'Ana Arquiteta',
        disciplina: 'Arquitetura',
        tempoEstimado: '8h',
        prioridade: 'media',
        dataVencimento: proximaSemana.toISOString().split('T')[0],
        template_notas: '',
        checklist: [],
        etapaId: etapaAtual || (etapas[0]?.id ?? 1)
      });
      setChecklistInput('');
    }
    setErrors({});
  }, [tarefa, isOpen, etapaAtual, etapas]);

  // ===== HANDLERS =====
  const handleInputChange = (field: keyof (NovaTarefaData & { etapaId: number }), value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChecklistChange = (value: string) => {
    setChecklistInput(value);
    const items = value.split('|').map(item => item.trim()).filter(item => item);
    handleInputChange('checklist', items);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da tarefa é obrigatório';
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.nome.length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória';
    } else {
      const dataVencimento = new Date(formData.dataVencimento);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataVencimento < hoje) {
        newErrors.dataVencimento = 'Data de vencimento não pode ser no passado';
      }
    }

    if (!formData.tempoEstimado.match(/^\d+h$/)) {
      newErrors.tempoEstimado = 'Formato deve ser: 8h, 24h, etc.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const { etapaId, ...dadosTarefa } = formData;
      await onSave(etapaId, dadosTarefa);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      descricao: '',
      responsavel: 'Ana Arquiteta',
      disciplina: 'Arquitetura',
      tempoEstimado: '8h',
      prioridade: 'media',
      dataVencimento: '',
      template_notas: '',
      checklist: [],
      etapaId: etapaAtual || (etapas[0]?.id ?? 1)
    });
    setChecklistInput('');
    setErrors({});
    onClose();
  };

  // ===== RENDER =====
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {tarefa ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              {/* Nome da Tarefa */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome da Tarefa *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Desenvolvimento de plantas baixas"
                  className={errors.nome ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.nome && (
                  <p className="text-sm text-red-600">{errors.nome}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva detalhadamente o que deve ser feito nesta tarefa..."
                  className={errors.descricao ? 'border-red-500' : ''}
                  rows={4}
                  disabled={isLoading}
                />
                {errors.descricao && (
                  <p className="text-sm text-red-600">{errors.descricao}</p>
                )}
              </div>

              {/* Etapa */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Etapa
                </Label>
                <Select
                  value={formData.etapaId.toString()}
                  onChange={(e) => handleInputChange('etapaId', parseInt(e.target.value))}
                  disabled={isLoading}
                >
                  {etapas.map((etapa) => (
                    <option key={etapa.id} value={etapa.id}>
                      {etapa.icone} {etapa.nome}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Template de Notas */}
              <div className="space-y-2">
                <Label htmlFor="template_notas" className="text-sm font-medium text-gray-700">
                  Template de Notas
                </Label>
                <Textarea
                  id="template_notas"
                  value={formData.template_notas}
                  onChange={(e) => handleInputChange('template_notas', e.target.value)}
                  placeholder="Template para anotações:\n- Item 1: \n- Item 2: \n- Observações: "
                  rows={4}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Use \n para quebras de linha no template
                </p>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              {/* Responsável e Disciplina */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Responsável
                  </Label>
                  <Select
                    value={formData.responsavel}
                    onChange={(e) => handleInputChange('responsavel', e.target.value)}
                    disabled={isLoading}
                  >
                    {RESPONSAVEIS.map((responsavel) => (
                      <option key={responsavel} value={responsavel}>
                        {responsavel}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Disciplina
                  </Label>
                  <Select
                    value={formData.disciplina}
                    onChange={(e) => handleInputChange('disciplina', e.target.value)}
                    disabled={isLoading}
                  >
                    {DISCIPLINAS.map((disciplina) => (
                      <option key={disciplina} value={disciplina}>
                        {disciplina}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Tempo e Prioridade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tempoEstimado" className="text-sm font-medium text-gray-700">
                    Tempo Estimado
                  </Label>
                  <Input
                    id="tempoEstimado"
                    value={formData.tempoEstimado}
                    onChange={(e) => handleInputChange('tempoEstimado', e.target.value)}
                    placeholder="Ex: 8h, 24h"
                    className={errors.tempoEstimado ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.tempoEstimado && (
                    <p className="text-sm text-red-600">{errors.tempoEstimado}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Prioridade
                  </Label>
                  <Select
                    value={formData.prioridade}
                    onChange={(e) => handleInputChange('prioridade', e.target.value as 'baixa' | 'media' | 'alta')}
                    disabled={isLoading}
                  >
                    <option value="baixa">🟢 Baixa</option>
                    <option value="media">🟡 Média</option>
                    <option value="alta">🔴 Alta</option>
                  </Select>
                </div>
              </div>

              {/* Data de Vencimento */}
              <div className="space-y-2">
                <Label htmlFor="dataVencimento" className="text-sm font-medium text-gray-700">
                  Data de Vencimento *
                </Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                  className={errors.dataVencimento ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.dataVencimento && (
                  <p className="text-sm text-red-600">{errors.dataVencimento}</p>
                )}
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <Label htmlFor="checklist" className="text-sm font-medium text-gray-700">
                  Checklist
                </Label>
                <Textarea
                  id="checklist"
                  value={checklistInput}
                  onChange={(e) => handleChecklistChange(e.target.value)}
                  placeholder="Item 1 | Item 2 | Item 3"
                  rows={3}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Separe os itens com " | " (pipe)
                </p>
                {formData.checklist && formData.checklist.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                    <ul className="space-y-1">
                      {formData.checklist.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 border border-gray-300 rounded"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </div>
            ) : (
              tarefa ? 'Salvar Alterações' : 'Criar Tarefa'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 