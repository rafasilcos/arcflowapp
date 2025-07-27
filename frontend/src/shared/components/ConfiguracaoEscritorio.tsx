/**
 * 🏢 COMPONENTE DE CONFIGURAÇÃO PERSONALIZÁVEL POR ESCRITÓRIO
 * Interface completa para personalizar todos os parâmetros de cálculo
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useConfiguracaoEscritorio } from '../hooks/useConfiguracaoEscritorio';

interface ConfiguracaoEscritorio {
  disciplinas: Record<string, {
    ativo: boolean;
    valor_base: number;
    valor_por_m2: number;
    valor_por_hora: number;
    horas_estimadas: number;
    multiplicador_complexidade_padrao: number;
  }>;
  multiplicadores_regionais: Record<string, {
    nome: string;
    multiplicador: number;
  }>;
  padroes_construcao: Record<string, {
    nome: string;
    multiplicador: number;
  }>;
  custos_indiretos: {
    margem_lucro: number;
    overhead: number;
    impostos: number;
    reserva_contingencia: number;
    comissao_vendas: number;
  };
  multiplicadores_complexidade: Record<string, number>;
  configuracoes_comerciais: {
    desconto_maximo_permitido: number;
    valor_minimo_projeto: number;
    forma_pagamento_padrao: string;
    juros_parcelamento: number;
    desconto_pagamento_vista: number;
  };
  configuracoes_escritorio: {
    regime_tributario: string;
    regiao_principal: string;
    especialidade: string;
    nivel_experiencia: string;
  };
}

interface Props {
  escritorioId: string;
  onSave?: (configuracoes: ConfiguracaoEscritorio) => void;
  onSaveRef?: React.MutableRefObject<(() => Promise<void>) | null>;
}

export function ConfiguracaoEscritorio({ escritorioId, onSave, onSaveRef }: Props) {
  // ✅ CORREÇÃO: Usar o hook personalizado
  const {
    configuracoes,
    loading,
    error,
    salvarConfiguracoes,
    setConfiguracoes
  } = useConfiguracaoEscritorio(escritorioId);

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('disciplinas');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ✅ CORREÇÃO: Salvar configurações usando o hook
  const handleSave = useCallback(async () => {
    if (!configuracoes) {
      console.error('❌ Nenhuma configuração para salvar');
      return;
    }

    setSaving(true);

    try {
      console.log('💾 Iniciando salvamento das configurações...');
      
      // ✅ CORREÇÃO: Chamar salvarConfiguracoes sem parâmetro para usar estado atual
      const success = await salvarConfiguracoes();
      
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        if (onSave) {
          onSave(configuracoes);
        }
        
        console.log('✅ Configurações salvas com sucesso!');
      } else {
        console.error('❌ Falha ao salvar configurações');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  }, [configuracoes, salvarConfiguracoes, onSave]);

  // ✅ CORREÇÃO: Expor função de salvamento para componente pai
  useEffect(() => {
    if (onSaveRef) {
      onSaveRef.current = handleSave;
    }
  }, [onSaveRef, handleSave]);

  // ✅ CORREÇÃO: Resetar para padrão
  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar todas as configurações para o padrão?')) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/escritorios/${escritorioId}/configuracoes`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        setConfiguracoes(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao resetar:', error);
    } finally {
      setSaving(false);
    }
  };

  // Atualizar configuração específica
  const updateConfig = (section: string, key: string, value: any) => {
    if (!configuracoes) return;

    setConfiguracoes(prev => ({
      ...prev!,
      [section]: {
        ...prev![section as keyof ConfiguracaoEscritorio],
        [key]: value
      }
    }));
  };

  // Atualizar disciplina específica
  const updateDisciplina = (disciplina: string, campo: string, valor: any) => {
    if (!configuracoes) return;

    setConfiguracoes(prev => ({
      ...prev!,
      disciplinas: {
        ...prev!.disciplinas,
        [disciplina]: {
          ...prev!.disciplinas[disciplina],
          [campo]: valor
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!configuracoes) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Erro ao carregar configurações</p>
      </div>
    );
  }

  const tabs = [
    { id: 'disciplinas', name: 'Disciplinas e Valores', icon: '💰' },
    { id: 'regionais', name: 'Multiplicadores Regionais', icon: '🌍' },
    { id: 'padroes', name: 'Padrões de Construção', icon: '🏠' },
    { id: 'custos', name: 'Custos Indiretos', icon: '📊' },
    { id: 'complexidade', name: 'Multiplicadores de Complexidade', icon: '⚙️' },
    { id: 'comercial', name: 'Configurações Comerciais', icon: '💼' },
    { id: 'escritorio', name: 'Dados do Escritório', icon: '🏢' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configurações do Escritório
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personalize todos os parâmetros de cálculo de orçamentos
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            🔄 Restaurar Padrão
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-md transition-colors flex items-center space-x-2 ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
            <span className="text-green-800 dark:text-green-200">
              Configurações salvas com sucesso!
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 dark:text-red-400 mr-2">❌</span>
            <span className="text-red-800 dark:text-red-200">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        
        {/* Disciplinas Tab */}
        {activeTab === 'disciplinas' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              💰 Valores por Disciplina
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(configuracoes.disciplinas).map(([codigo, disciplina]) => (
                <div key={codigo} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={disciplina.ativo}
                        onChange={(e) => updateDisciplina(codigo, 'ativo', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {codigo.replace(/_/g, ' ')}
                      </h4>
                    </div>
                  </div>
                  
                  {disciplina.ativo && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Valor Base (R$)
                          <span className="ml-1 text-xs text-blue-600 cursor-help" title="Valor fixo cobrado pela disciplina, independente da área do projeto">ℹ️</span>
                        </label>
                        <input
                          type="number"
                          value={disciplina.valor_base}
                          onChange={(e) => updateDisciplina(codigo, 'valor_base', parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 18000"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Usado quando não há área definida ou como valor mínimo. Base de cálculo quando área não é especificada.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Valor por m² (R$)
                        </label>
                        <input
                          type="number"
                          value={disciplina.valor_por_m2}
                          onChange={(e) => updateDisciplina(codigo, 'valor_por_m2', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Valor por Hora (R$)
                        </label>
                        <input
                          type="number"
                          value={disciplina.valor_por_hora}
                          onChange={(e) => updateDisciplina(codigo, 'valor_por_hora', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Horas Estimadas
                        </label>
                        <input
                          type="number"
                          value={disciplina.horas_estimadas}
                          onChange={(e) => updateDisciplina(codigo, 'horas_estimadas', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Multiplicador Padrão
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={disciplina.multiplicador_complexidade_padrao}
                          onChange={(e) => updateDisciplina(codigo, 'multiplicador_complexidade_padrao', parseFloat(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multiplicadores Regionais Tab */}
        {activeTab === 'regionais' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🌍 Multiplicadores Regionais
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ajuste os valores conforme o custo de vida e disponibilidade de profissionais em cada região
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(configuracoes.multiplicadores_regionais).map(([regiao, dados]) => (
                <div key={regiao} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {dados.nome}
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Multiplicador
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={dados.multiplicador}
                        onChange={(e) => {
                          const novoValor = parseFloat(e.target.value) || 1;
                          setConfiguracoes(prev => ({
                            ...prev!,
                            multiplicadores_regionais: {
                              ...prev!.multiplicadores_regionais,
                              [regiao]: { ...dados, multiplicador: novoValor }
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dados.multiplicador < 1 ? 
                        `${((1 - dados.multiplicador) * 100).toFixed(0)}% desconto` : 
                        `${((dados.multiplicador - 1) * 100).toFixed(0)}% acréscimo`
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Padrões de Construção Tab */}
        {activeTab === 'padroes' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🏠 Padrões de Construção
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure multiplicadores baseados no nível de acabamento e complexidade construtiva
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(configuracoes.padroes_construcao).map(([padrao, dados]) => (
                <div key={padrao} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {dados.nome}
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Multiplicador
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={dados.multiplicador}
                        onChange={(e) => {
                          const novoValor = parseFloat(e.target.value) || 1;
                          setConfiguracoes(prev => ({
                            ...prev!,
                            padroes_construcao: {
                              ...prev!.padroes_construcao,
                              [padrao]: { ...dados, multiplicador: novoValor }
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Impacto: {dados.multiplicador}x o valor base
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custos Indiretos Tab */}
        {activeTab === 'custos' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              📊 Custos Indiretos e Margens
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure todos os custos que não estão diretamente relacionados à execução do projeto
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Margem de Lucro (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.custos_indiretos.margem_lucro}
                  onChange={(e) => updateConfig('custos_indiretos', 'margem_lucro', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Margem de lucro desejada sobre o projeto</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Overhead (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.custos_indiretos.overhead}
                  onChange={(e) => updateConfig('custos_indiretos', 'overhead', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Custos operacionais (aluguel, energia, etc.)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Impostos (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.custos_indiretos.impostos}
                  onChange={(e) => updateConfig('custos_indiretos', 'impostos', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Carga tributária conforme regime fiscal</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reserva de Contingência (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.custos_indiretos.reserva_contingencia}
                  onChange={(e) => updateConfig('custos_indiretos', 'reserva_contingencia', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Reserva para imprevistos e alterações</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comissão de Vendas (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.custos_indiretos.comissao_vendas}
                  onChange={(e) => updateConfig('custos_indiretos', 'comissao_vendas', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Comissão para vendedores/captadores</p>
              </div>
            </div>

            {/* Simulador de Impacto */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Simulador de Impacto
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Para um projeto de R$ 50.000, os custos indiretos representariam:
              </p>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                {(() => {
                  const base = 50000;
                  const custos = configuracoes.custos_indiretos;
                  const multiplicador = (1 + custos.margem_lucro/100) * 
                                      (1 + custos.overhead/100) * 
                                      (1 + custos.impostos/100) * 
                                      (1 + custos.reserva_contingencia/100) * 
                                      (1 + custos.comissao_vendas/100);
                  const valorFinal = base * multiplicador;
                  const acrescimo = valorFinal - base;
                  return `R$ ${acrescimo.toLocaleString('pt-BR')} (${((acrescimo/base)*100).toFixed(1)}% de acréscimo)`;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Multiplicadores de Complexidade Tab */}
        {activeTab === 'complexidade' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              ⚙️ Multiplicadores de Complexidade
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Defina como a complexidade do projeto afeta o valor final
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(configuracoes.multiplicadores_complexidade).map(([nivel, multiplicador]) => (
                <div key={nivel} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 capitalize">
                    {nivel.replace(/_/g, ' ')}
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Multiplicador
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={multiplicador}
                      onChange={(e) => {
                        const novoValor = parseFloat(e.target.value) || 1;
                        setConfiguracoes(prev => ({
                          ...prev!,
                          multiplicadores_complexidade: {
                            ...prev!.multiplicadores_complexidade,
                            [nivel]: novoValor
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {multiplicador < 1 ? 
                        `${((1 - multiplicador) * 100).toFixed(0)}% desconto` : 
                        multiplicador > 1 ?
                        `${((multiplicador - 1) * 100).toFixed(0)}% acréscimo` :
                        'Valor padrão'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurações Comerciais Tab */}
        {activeTab === 'comercial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              💼 Configurações Comerciais
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure políticas comerciais e condições de pagamento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desconto Máximo Permitido (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.configuracoes_comerciais.desconto_maximo_permitido}
                  onChange={(e) => updateConfig('configuracoes_comerciais', 'desconto_maximo_permitido', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Limite máximo de desconto para negociação</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Mínimo de Projeto (R$)
                </label>
                <input
                  type="number"
                  value={configuracoes.configuracoes_comerciais.valor_minimo_projeto}
                  onChange={(e) => updateConfig('configuracoes_comerciais', 'valor_minimo_projeto', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Valor mínimo aceitável para projetos</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Forma de Pagamento Padrão
                </label>
                <select
                  value={configuracoes.configuracoes_comerciais.forma_pagamento_padrao}
                  onChange={(e) => updateConfig('configuracoes_comerciais', 'forma_pagamento_padrao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="30_60_90">30/60/90 dias</option>
                  <option value="50_50">50% entrada + 50% entrega</option>
                  <option value="a_vista">À vista</option>
                  <option value="parcelado_6x">Parcelado 6x</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Juros Parcelamento (% ao mês)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.configuracoes_comerciais.juros_parcelamento}
                  onChange={(e) => updateConfig('configuracoes_comerciais', 'juros_parcelamento', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Taxa de juros para pagamento parcelado</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desconto Pagamento à Vista (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configuracoes.configuracoes_comerciais.desconto_pagamento_vista}
                  onChange={(e) => updateConfig('configuracoes_comerciais', 'desconto_pagamento_vista', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Desconto oferecido para pagamento à vista</p>
              </div>
            </div>
          </div>
        )}

        {/* Dados do Escritório Tab */}
        {activeTab === 'escritorio' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🏢 Dados do Escritório
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure informações específicas que influenciam nos cálculos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Regime Tributário
                </label>
                <select
                  value={configuracoes.configuracoes_escritorio.regime_tributario}
                  onChange={(e) => updateConfig('configuracoes_escritorio', 'regime_tributario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="simples_nacional">Simples Nacional</option>
                  <option value="lucro_presumido">Lucro Presumido</option>
                  <option value="lucro_real">Lucro Real</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Afeta o cálculo de impostos</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Região Principal
                </label>
                <select
                  value={configuracoes.configuracoes_escritorio.regiao_principal}
                  onChange={(e) => updateConfig('configuracoes_escritorio', 'regiao_principal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="norte">Norte</option>
                  <option value="nordeste">Nordeste</option>
                  <option value="centro_oeste">Centro-Oeste</option>
                  <option value="sudeste">Sudeste</option>
                  <option value="sul">Sul</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Região padrão para novos projetos</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Especialidade Principal
                </label>
                <select
                  value={configuracoes.configuracoes_escritorio.especialidade}
                  onChange={(e) => updateConfig('configuracoes_escritorio', 'especialidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="institucional">Institucional</option>
                  <option value="urbano">Urbanismo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Área de maior experiência</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nível de Experiência
                </label>
                <select
                  value={configuracoes.configuracoes_escritorio.nivel_experiencia}
                  onChange={(e) => updateConfig('configuracoes_escritorio', 'nivel_experiencia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="junior">Junior (0-3 anos)</option>
                  <option value="pleno">Pleno (3-8 anos)</option>
                  <option value="senior">Senior (8+ anos)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Influencia valores e prazos</p>
              </div>
            </div>
          </div>
        )}

        {/* Adicionar outras abas conforme necessário */}
        {activeTab !== 'disciplinas' && activeTab !== 'custos' && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Configurações para "{tabs.find(t => t.id === activeTab)?.name}" em desenvolvimento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}