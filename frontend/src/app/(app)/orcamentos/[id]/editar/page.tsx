/**
 * 📝 PÁGINA DE EDIÇÃO DE ORÇAMENTO
 * Interface completa para edição de orçamentos com validações e controles
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDisciplinas } from '@/shared/hooks/useDisciplinas';
import { useThemeOptimized } from '@/hooks/useThemeOptimized';

interface OrcamentoEditData {
  nome: string;
  descricao: string;
  clienteId: string;
  areaConstruida: number;
  prazoEntrega: number;
  observacoes: string;
  disciplinasAtivas: string[];
  configuracoes: Record<string, any>;
  condicoesPagamento: {
    entrada: number;
    parcelas: number;
    prazoValidade: number;
  };
  descontos: {
    percentual: number;
    motivo: string;
  };
}

// Componente de Seção do Formulário
function FormSection({ title, children, className = '' }: any) {
  const { isElegante, classes } = useThemeOptimized();
  
  return (
    <div className={`rounded-xl p-6 border ${isElegante ? 'bg-white border-gray-200' : classes.card} ${className}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isElegante ? 'text-gray-900' : classes.text}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// Componente de Input
function FormInput({ label, name, type = 'text', value, onChange, placeholder, required = false, disabled = false }: any) {
  const { isElegante, classes } = useThemeOptimized();
  
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isElegante ? 'text-gray-700' : classes.text}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
          disabled 
            ? isElegante 
              ? 'bg-gray-100 border-gray-200 text-gray-500' 
              : 'bg-white/5 border-white/10 text-gray-400'
            : isElegante
              ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              : 'border-white/20 focus:border-white/40 bg-white/10 text-white'
        }`}
      />
    </div>
  );
}

// Componente de TextArea
function FormTextArea({ label, name, value, onChange, placeholder, rows = 3 }: any) {
  const { isElegante, classes } = useThemeOptimized();
  
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isElegante ? 'text-gray-700' : classes.text}`}>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg transition-colors resize-none ${
          isElegante
            ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            : 'border-white/20 focus:border-white/40 bg-white/10 text-white'
        }`}
      />
    </div>
  );
}

// Componente Editor de Disciplinas
function DisciplinasEditor({ disciplinasDisponiveis, disciplinasAtivas, onToggle, configuracoes, onConfigChange }: any) {
  const { isElegante, classes, tema } = useThemeOptimized();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disciplinasDisponiveis.map((disciplina: any) => {
          const isAtiva = disciplinasAtivas.includes(disciplina.codigo);
          const config = configuracoes[disciplina.codigo] || {};
          
          return (
            <div
              key={disciplina.codigo}
              className={`p-4 border rounded-lg transition-all ${
                isAtiva 
                  ? isElegante 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-blue-500/50 bg-blue-500/10'
                  : isElegante 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{disciplina.icone}</span>
                  <div>
                    <h4 className={`font-medium ${isElegante ? 'text-gray-900' : classes.text}`}>
                      {disciplina.nome}
                    </h4>
                    <p className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
                      {disciplina.categoria}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggle(disciplina.codigo)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isAtiva
                      ? isElegante
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-white hover:bg-blue-600'
                      : isElegante
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  style={isAtiva && !isElegante ? { backgroundColor: tema.primaria } : {}}
                >
                  {isAtiva ? 'Ativa' : 'Inativa'}
                </button>
              </div>
              
              {isAtiva && (
                <div className="space-y-3">
                  <FormInput
                    label="Valor Personalizado (R$)"
                    name={`valor_${disciplina.codigo}`}
                    type="number"
                    value={config.valorPersonalizado || ''}
                    onChange={(e: any) => onConfigChange(disciplina.codigo, 'valorPersonalizado', parseFloat(e.target.value) || 0)}
                    placeholder={`Padrão: R$ ${disciplina.valorBase.toLocaleString('pt-BR')}`}
                  />
                  <FormInput
                    label="Multiplicador de Complexidade"
                    name={`multiplicador_${disciplina.codigo}`}
                    type="number"
                    step="0.1"
                    value={config.multiplicadorComplexidade || 1}
                    onChange={(e: any) => onConfigChange(disciplina.codigo, 'multiplicadorComplexidade', parseFloat(e.target.value) || 1)}
                    placeholder="1.0"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente Principal da Página de Edição
export default function EditarOrcamentoPage() {
  const params = useParams();
  const router = useRouter();
  const orcamentoId = params.id as string;
  
  const { 
    getDisciplinasAtivas, 
    toggleDisciplina,
    updateDisciplinaConfig,
    getValorTotal,
    calculoAtual,
    loading: disciplinasLoading
  } = useDisciplinas();
  
  const { classes, tema, isElegante } = useThemeOptimized();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<OrcamentoEditData>({
    nome: '',
    descricao: '',
    clienteId: '',
    areaConstruida: 0,
    prazoEntrega: 0,
    observacoes: '',
    disciplinasAtivas: [],
    configuracoes: {},
    condicoesPagamento: {
      entrada: 30,
      parcelas: 3,
      prazoValidade: 30
    },
    descontos: {
      percentual: 0,
      motivo: ''
    }
  });

  // Carregar dados do orçamento
  useEffect(() => {
    const loadOrcamentoData = async () => {
      try {
        // Simular carregamento de dados
        const mockData = {
          nome: 'Projeto Residencial - Casa Moderna',
          descricao: 'Projeto arquitetônico completo para residência unifamiliar',
          clienteId: 'cliente-123',
          areaConstruida: 250,
          prazoEntrega: 12,
          observacoes: 'Cliente solicitou acabamentos especiais',
          disciplinasAtivas: ['ARQUITETURA', 'ESTRUTURAL'],
          configuracoes: {},
          condicoesPagamento: {
            entrada: 30,
            parcelas: 3,
            prazoValidade: 30
          },
          descontos: {
            percentual: 0,
            motivo: ''
          }
        };
        
        setFormData(mockData);
        setLoading(false);
        
      } catch (error) {
        console.error('Erro ao carregar orçamento:', error);
        setLoading(false);
      }
    };

    if (orcamentoId) {
      loadOrcamentoData();
    }
  }, [orcamentoId]);

  // Validações
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do projeto é obrigatório';
    }
    
    if (formData.areaConstruida <= 0) {
      newErrors.areaConstruida = 'Área deve ser maior que zero';
    }
    
    if (formData.prazoEntrega <= 0) {
      newErrors.prazoEntrega = 'Prazo deve ser maior que zero';
    }
    
    if (formData.disciplinasAtivas.length === 0) {
      newErrors.disciplinasAtivas = 'Pelo menos uma disciplina deve estar ativa';
    }
    
    if (formData.descontos.percentual > 25) {
      newErrors.desconto = 'Desconto não pode ser maior que 25%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-save
  useEffect(() => {
    const autoSave = setTimeout(async () => {
      if (!loading && formData.nome) {
        await handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [formData, loading]);

  const handleAutoSave = async () => {
    try {
      setSaving(true);
      // Simular salvamento automático
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erro no auto-save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof OrcamentoEditData],
        [field]: value
      }
    }));
  };

  const handleDisciplinaToggle = async (codigo: string) => {
    try {
      await toggleDisciplina(codigo);
      
      setFormData(prev => ({
        ...prev,
        disciplinasAtivas: prev.disciplinasAtivas.includes(codigo)
          ? prev.disciplinasAtivas.filter(d => d !== codigo)
          : [...prev.disciplinasAtivas, codigo]
      }));
    } catch (error) {
      console.error('Erro ao alterar disciplina:', error);
    }
  };

  const handleConfigChange = (disciplinaCodigo: string, campo: string, valor: any) => {
    updateDisciplinaConfig(disciplinaCodigo, { [campo]: valor });
    
    setFormData(prev => ({
      ...prev,
      configuracoes: {
        ...prev.configuracoes,
        [disciplinaCodigo]: {
          ...prev.configuracoes[disciplinaCodigo],
          [campo]: valor
        }
      }
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar de volta para visualização
      router.push(`/orcamentos/${orcamentoId}`);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/orcamentos/${orcamentoId}`);
  };

  if (loading || disciplinasLoading) {
    return (
      <div className={`min-h-screen ${isElegante ? 'bg-gray-50' : classes.bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className={`h-12 ${isElegante ? 'bg-gray-200' : 'bg-white/10'} rounded-lg w-1/3`}></div>
            <div className={`h-96 ${isElegante ? 'bg-gray-200' : 'bg-white/10'} rounded-xl`}></div>
          </div>
        </div>
      </div>
    );
  }

  const disciplinasDisponiveis = [
    { codigo: 'ARQUITETURA', nome: 'Projeto Arquitetônico', icone: '🏗️', categoria: 'ESSENCIAL', valorBase: 18000 },
    { codigo: 'ESTRUTURAL', nome: 'Projeto Estrutural', icone: '🏗️', categoria: 'ESPECIALIZADA', valorBase: 8000 },
    { codigo: 'INSTALACOES_ELETRICAS', nome: 'Instalações Elétricas', icone: '⚡', categoria: 'ESPECIALIZADA', valorBase: 5000 },
    { codigo: 'INSTALACOES_HIDRAULICAS', nome: 'Instalações Hidráulicas', icone: '🚰', categoria: 'ESPECIALIZADA', valorBase: 4500 },
    { codigo: 'PAISAGISMO', nome: 'Projeto Paisagístico', icone: '🌿', categoria: 'COMPLEMENTAR', valorBase: 6000 },
    { codigo: 'DESIGN_INTERIORES', nome: 'Design de Interiores', icone: '🛋️', categoria: 'COMPLEMENTAR', valorBase: 7500 }
  ];

  const valorTotal = getValorTotal();

  return (
    <div className={`min-h-screen ${isElegante ? 'bg-gray-50' : classes.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={handleCancel}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isElegante 
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                      : `${classes.textSecondary} hover:${classes.text} hover:bg-white/10`
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Voltar ao Orçamento</span>
                </button>
              </div>
              
              <h1 className={`text-3xl font-bold ${isElegante ? 'text-gray-900' : classes.text}`}>
                Editar Orçamento
              </h1>
              
              <div className="flex items-center gap-4 mt-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isElegante ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  📝 RASCUNHO
                </div>
                
                {lastSaved && (
                  <span className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
                    Salvo automaticamente às {lastSaved.toLocaleTimeString('pt-BR')}
                  </span>
                )}
                
                {saving && (
                  <span className={`text-sm ${isElegante ? 'text-blue-600' : 'text-blue-400'}`}>
                    Salvando...
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  isElegante
                    ? 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    : `${classes.text} border-white/20 hover:bg-white/10`
                }`}
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-2 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ 
                  backgroundColor: tema.primaria,
                  boxShadow: `0 4px 14px 0 ${tema.primaria}25`
                }}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>

        {/* Valor Total em Destaque */}
        <div className={`rounded-xl p-6 mb-8 border ${
          isElegante 
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
            : 'bg-gradient-to-r from-white/10 to-white/5 border-white/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${isElegante ? 'text-gray-900' : classes.text}`}>
                Valor Total do Orçamento
              </h2>
              <p className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
                Atualizado automaticamente conforme suas alterações
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${isElegante ? 'text-blue-600' : classes.text}`} 
                   style={!isElegante ? { color: tema.primaria } : {}}>
                R$ {valorTotal.toLocaleString('pt-BR')}
              </div>
              <div className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
                {formData.areaConstruida > 0 && `R$ ${Math.round(valorTotal / formData.areaConstruida).toLocaleString('pt-BR')}/m²`}
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="space-y-8">
          
          {/* Seção 1: Dados Básicos */}
          <FormSection title="Informações Gerais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nome do Projeto"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Projeto Residencial - Casa Moderna"
                required
              />
              
              <FormInput
                label="Área Construída (m²)"
                name="areaConstruida"
                type="number"
                value={formData.areaConstruida}
                onChange={handleInputChange}
                placeholder="250"
                required
              />
              
              <div className="md:col-span-2">
                <FormTextArea
                  label="Descrição do Projeto"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva brevemente o projeto..."
                />
              </div>
              
              <FormInput
                label="Prazo de Entrega (semanas)"
                name="prazoEntrega"
                type="number"
                value={formData.prazoEntrega}
                onChange={handleInputChange}
                placeholder="12"
                required
              />
              
              <div className="md:col-span-2">
                <FormTextArea
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Observações adicionais sobre o projeto..."
                />
              </div>
            </div>
            
            {/* Exibir erros */}
            {Object.keys(errors).length > 0 && (
              <div className={`mt-4 p-4 rounded-lg ${isElegante ? 'bg-red-50 border border-red-200' : 'bg-red-500/10 border border-red-500/20'}`}>
                <h4 className={`font-medium mb-2 ${isElegante ? 'text-red-800' : 'text-red-300'}`}>
                  Corrija os seguintes erros:
                </h4>
                <ul className={`text-sm space-y-1 ${isElegante ? 'text-red-700' : 'text-red-400'}`}>
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </FormSection>

          {/* Seção 2: Disciplinas e Valores */}
          <FormSection title="Disciplinas e Valores">
            <DisciplinasEditor
              disciplinasDisponiveis={disciplinasDisponiveis}
              disciplinasAtivas={formData.disciplinasAtivas}
              onToggle={handleDisciplinaToggle}
              configuracoes={formData.configuracoes}
              onConfigChange={handleConfigChange}
            />
          </FormSection>

          {/* Seção 3: Configurações Comerciais */}
          <FormSection title="Configurações Comerciais">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Entrada (%)"
                name="entrada"
                type="number"
                value={formData.condicoesPagamento.entrada}
                onChange={(e: any) => handleNestedChange('condicoesPagamento', 'entrada', parseFloat(e.target.value) || 0)}
                placeholder="30"
              />
              
              <FormInput
                label="Número de Parcelas"
                name="parcelas"
                type="number"
                value={formData.condicoesPagamento.parcelas}
                onChange={(e: any) => handleNestedChange('condicoesPagamento', 'parcelas', parseInt(e.target.value) || 1)}
                placeholder="3"
              />
              
              <FormInput
                label="Validade da Proposta (dias)"
                name="prazoValidade"
                type="number"
                value={formData.condicoesPagamento.prazoValidade}
                onChange={(e: any) => handleNestedChange('condicoesPagamento', 'prazoValidade', parseInt(e.target.value) || 30)}
                placeholder="30"
              />
              
              <FormInput
                label="Desconto (%)"
                name="percentual"
                type="number"
                step="0.1"
                value={formData.descontos.percentual}
                onChange={(e: any) => handleNestedChange('descontos', 'percentual', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              
              <div className="md:col-span-2">
                <FormInput
                  label="Motivo do Desconto"
                  name="motivo"
                  value={formData.descontos.motivo}
                  onChange={(e: any) => handleNestedChange('descontos', 'motivo', e.target.value)}
                  placeholder="Ex: Cliente fidelizado, projeto de grande porte..."
                />
              </div>
            </div>
          </FormSection>

        </div>
      </div>
    </div>
  );
}