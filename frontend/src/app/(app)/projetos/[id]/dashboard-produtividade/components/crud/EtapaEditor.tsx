'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Etapa } from '../../data/projectTemplates';
import { NovaEtapaData } from '../../hooks/useProjectCrud';

// ===== INTERFACE DO COMPONENTE =====
interface EtapaEditorProps {
  etapa?: Etapa | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: NovaEtapaData) => Promise<void>;
  isLoading?: boolean;
}

// ===== OPÇÕES DE ÍCONES PARA ETAPAS =====
const ICONES_ETAPA = [
  { value: '📋', label: '📋 Planejamento' },
  { value: '📐', label: '📐 Levantamento' },
  { value: '✏️', label: '✏️ Estudo' },
  { value: '🎨', label: '🎨 Conceito' },
  { value: '🏗️', label: '🏗️ Projeto' },
  { value: '⚡', label: '⚡ Instalações' },
  { value: '🔧', label: '🔧 Detalhamento' },
  { value: '✅', label: '✅ Finalização' },
  { value: '🎯', label: '🎯 Execução' },
  { value: '📊', label: '📊 Análise' },
  { value: '🚀', label: '🚀 Entrega' },
  { value: '💡', label: '💡 Inovação' }
];

// ===== OPÇÕES DE CORES PARA ETAPAS =====
const CORES_ETAPA = [
  { value: '#6B7280', label: 'Cinza (Não iniciada)', bg: 'bg-gray-500' },
  { value: '#3B82F6', label: 'Azul (Em andamento)', bg: 'bg-blue-500' },
  { value: '#10B981', label: 'Verde (Concluída)', bg: 'bg-green-500' },
  { value: '#F59E0B', label: 'Amarelo (Atenção)', bg: 'bg-yellow-500' },
  { value: '#EF4444', label: 'Vermelho (Crítico)', bg: 'bg-red-500' },
  { value: '#8B5CF6', label: 'Roxo (Especial)', bg: 'bg-purple-500' },
  { value: '#EC4899', label: 'Rosa (Criativo)', bg: 'bg-pink-500' },
  { value: '#06B6D4', label: 'Ciano (Técnico)', bg: 'bg-cyan-500' }
];

// ===== COMPONENTE PRINCIPAL =====
export function EtapaEditor({ etapa, isOpen, onClose, onSave, isLoading = false }: EtapaEditorProps) {
  const [formData, setFormData] = useState<NovaEtapaData>({
    nome: '',
    icone: '📋',
    cor_tema: '#6B7280',
    status: 'nao_iniciada',
    progresso: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== EFEITOS =====
  useEffect(() => {
    if (etapa) {
      // Modo edição
      setFormData({
        nome: etapa.nome || '',
        icone: etapa.icone || '📋',
        cor_tema: etapa.cor_tema || '#6B7280',
        status: etapa.status || 'nao_iniciada',
        progresso: etapa.progresso || 0
      });
    } else {
      // Modo criação
      setFormData({
        nome: '',
        icone: '📋',
        cor_tema: '#6B7280',
        status: 'nao_iniciada',
        progresso: 0
      });
    }
    setErrors({});
  }, [etapa, isOpen]);

  // ===== HANDLERS =====
  const handleInputChange = (field: keyof NovaEtapaData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da etapa é obrigatório';
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.nome.length > 50) {
      newErrors.nome = 'Nome deve ter no máximo 50 caracteres';
    }

    if (formData.progresso < 0 || formData.progresso > 100) {
      newErrors.progresso = 'Progresso deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar etapa:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      icone: '📋',
      cor_tema: '#6B7280',
      status: 'nao_iniciada',
      progresso: 0
    });
    setErrors({});
    onClose();
  };

  // ===== RENDER =====
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {etapa ? '✏️ Editar Etapa' : '➕ Nova Etapa'}
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
          {/* Nome da Etapa */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
              Nome da Etapa *
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Estudo Preliminar"
              className={errors.nome ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Ícone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Ícone da Etapa
            </Label>
            <Select
              value={formData.icone}
              onChange={(e) => handleInputChange('icone', e.target.value)}
              disabled={isLoading}
            >
              {ICONES_ETAPA.map((icone) => (
                <option key={icone.value} value={icone.value}>
                  {icone.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Cor do Tema */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Cor do Tema
            </Label>
            <Select
              value={formData.cor_tema}
              onChange={(e) => handleInputChange('cor_tema', e.target.value)}
              disabled={isLoading}
            >
              {CORES_ETAPA.map((cor) => (
                <option key={cor.value} value={cor.value}>
                  {cor.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Status da Etapa
            </Label>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'nao_iniciada' | 'em_andamento' | 'concluida')}
              disabled={isLoading}
            >
              <option value="nao_iniciada">Não Iniciada</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </Select>
          </div>

          {/* Progresso */}
          <div className="space-y-2">
            <Label htmlFor="progresso" className="text-sm font-medium text-gray-700">
              Progresso ({formData.progresso}%)
            </Label>
            <div className="space-y-2">
              <input
                type="range"
                id="progresso"
                min="0"
                max="100"
                value={formData.progresso}
                onChange={(e) => handleInputChange('progresso', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isLoading}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            {errors.progresso && (
              <p className="text-sm text-red-600">{errors.progresso}</p>
            )}
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: formData.cor_tema }}
              >
                {formData.icone}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {formData.nome || 'Nome da Etapa'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    {formData.status === 'nao_iniciada' && 'Não Iniciada'}
                    {formData.status === 'em_andamento' && 'Em Andamento'}
                    {formData.status === 'concluida' && 'Concluída'}
                  </span>
                  <span>•</span>
                  <span>{formData.progresso}%</span>
                </div>
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
              etapa ? 'Salvar Alterações' : 'Criar Etapa'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 