/**
 * ⚙️ PÁGINA DE CONFIGURAÇÕES DE ORÇAMENTO PERSONALIZÁVEIS
 * Interface completa para configurar todos os parâmetros de cálculo por escritório
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ConfiguracaoDisciplinas } from '@/shared/components/ConfiguracaoDisciplinas';
import { ConfiguracaoEscritorio } from '@/shared/components/ConfiguracaoEscritorio';
import { useDisciplinas } from '@/shared/hooks/useDisciplinas';

export default function ConfiguracoesOrcamentoPage() {
  const { 
    initializeDisciplinas, 
    loading, 
    disciplinasAtivas, 
    configuracoes,
    error,
    salvarConfiguracoes
  } = useDisciplinas();
  const [activeTab, setActiveTab] = useState('disciplinas');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // ✅ CORREÇÃO: Referência para o componente ConfiguracaoEscritorio
  const configuracaoEscritorioRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Inicializar disciplinas ao carregar a página
    // Para configurações globais, usamos 'configuracoes-globais' como ID
    const initAsync = async () => {
      try {
        await initializeDisciplinas(undefined, undefined, 'configuracoes-globais');
      } catch (error) {
        console.error('Erro ao inicializar disciplinas:', error);
      }
    };
    
    initAsync();
  }, [initializeDisciplinas]);

  // ✅ FUNÇÃO PARA SALVAR CONFIGURAÇÕES
  const handleSalvarConfiguracoes = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    try {
      // ✅ CORREÇÃO: Verificar qual aba está ativa e salvar adequadamente
      if (activeTab === 'valores') {
        // Para a aba de valores, usar a referência do componente ConfiguracaoEscritorio
        if (configuracaoEscritorioRef.current) {
          console.log('💾 Chamando salvamento do componente ConfiguracaoEscritorio');
          await configuracaoEscritorioRef.current();
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          console.error('❌ Referência do componente ConfiguracaoEscritorio não encontrada');
        }
      } else {
        // Para outras abas, usar o hook useDisciplinas
        await salvarConfiguracoes();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      // O erro já é tratado no hook useDisciplinas
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      id: 'disciplinas',
      name: 'Disciplinas e Serviços',
      icon: '🎯',
      description: 'Configure quais disciplinas serão incluídas nos orçamentos'
    },
    {
      id: 'valores',
      name: 'Tabela de Preços',
      icon: '💰',
      description: 'Defina valores padrão por disciplina e região'
    },
    {
      id: 'cronograma',
      name: 'Cronograma Padrão',
      icon: '📅',
      description: 'Configure prazos e fases padrão dos projetos'
    },
    {
      id: 'avancado',
      name: 'Configurações Avançadas',
      icon: '⚙️',
      description: 'Parâmetros avançados e integrações'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações de Orçamento
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure parâmetros globais para geração automática de orçamentos
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {activeTab === 'disciplinas' && (
            <div className="p-6">
              <ConfiguracaoDisciplinas />
            </div>
          )}

          {activeTab === 'valores' && (
            <div className="p-6">
              <TabelaPrecos />
            </div>
          )}

          {activeTab === 'cronograma' && (
            <div className="p-6">
              <CronogramaPadrao />
            </div>
          )}

          {activeTab === 'avancado' && (
            <div className="p-6">
              <ConfiguracoesAvancadas />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Cancelar
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={handleSalvarConfiguracoes}
            disabled={saving}
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

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
              <span className="text-green-800 dark:text-green-200">
                Configurações salvas com sucesso!
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 dark:text-red-400 mr-2">❌</span>
              <span className="text-red-800 dark:text-red-200">
                Erro ao salvar: {error}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para Tabela de Preços com dados reais
function TabelaPrecos() {
  const [configuracoes, setConfiguracoes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);

  // Carregar configurações
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Importar a calculadora para acessar as configurações
      const { calculadoraUnificada } = await import('../services/calculadoraUnificada');
      
      // Forçar carregamento das configurações
      const config = await (calculadoraUnificada as any).carregarConfiguracoes();
      setConfiguracoes(config);
      
      console.log('✅ Configurações carregadas para tabela de preços');
    } catch (err: any) {
      console.error('❌ Erro ao carregar configurações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracoes = async () => {
    try {
      setSaving(true);
      
      // Aqui implementaríamos o salvamento via API
      // Por enquanto, apenas simular
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('💾 Configurações salvas (simulado)');
      
    } catch (err: any) {
      console.error('❌ Erro ao salvar:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const atualizarValor = (disciplinaId: string, campo: string, valor: any) => {
    setConfiguracoes((prev: any) => ({
      ...prev,
      disciplinas: {
        ...prev.disciplinas,
        [disciplinaId]: {
          ...prev.disciplinas[disciplinaId],
          [campo]: valor
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 dark:text-red-400 mr-2">❌</span>
            <span className="text-red-800 dark:text-red-200">
              Erro ao carregar configurações: {error}
            </span>
          </div>
          <button
            onClick={carregarConfiguracoes}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tabela de Preços por Disciplina
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Configure valores base, por m² e multiplicadores para cada disciplina
          </p>
        </div>
        <button
          onClick={salvarConfiguracoes}
          disabled={saving}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
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
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      {/* Tabela de Disciplinas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Disciplina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Base (R$)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor/m² (R$)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Horas Estimadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor/Hora (R$)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {configuracoes?.disciplinas && Object.entries(configuracoes.disciplinas).map(([disciplinaId, config]: [string, any]) => (
                <tr key={disciplinaId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {config.nome}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.ativo}
                        onChange={(e) => atualizarValor(disciplinaId, 'ativo', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`ml-2 text-sm ${config.ativo ? 'text-green-600' : 'text-gray-400'}`}>
                        {config.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editando === `${disciplinaId}-valor_base` ? (
                      <input
                        type="number"
                        value={config.valor_base}
                        onChange={(e) => atualizarValor(disciplinaId, 'valor_base', parseFloat(e.target.value) || 0)}
                        onBlur={() => setEditando(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditando(null)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditando(`${disciplinaId}-valor_base`)}
                        className="text-sm text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                      >
                        R$ {config.valor_base?.toLocaleString('pt-BR') || '0'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editando === `${disciplinaId}-valor_por_m2` ? (
                      <input
                        type="number"
                        value={config.valor_por_m2}
                        onChange={(e) => atualizarValor(disciplinaId, 'valor_por_m2', parseFloat(e.target.value) || 0)}
                        onBlur={() => setEditando(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditando(null)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditando(`${disciplinaId}-valor_por_m2`)}
                        className="text-sm text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                      >
                        R$ {config.valor_por_m2?.toLocaleString('pt-BR') || '0'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editando === `${disciplinaId}-horas_estimadas` ? (
                      <input
                        type="number"
                        value={config.horas_estimadas}
                        onChange={(e) => atualizarValor(disciplinaId, 'horas_estimadas', parseInt(e.target.value) || 0)}
                        onBlur={() => setEditando(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditando(null)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditando(`${disciplinaId}-horas_estimadas`)}
                        className="text-sm text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                      >
                        {config.horas_estimadas || 0}h
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editando === `${disciplinaId}-valor_hora` ? (
                      <input
                        type="number"
                        value={config.valor_hora}
                        onChange={(e) => atualizarValor(disciplinaId, 'valor_hora', parseFloat(e.target.value) || 0)}
                        onBlur={() => setEditando(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditando(null)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditando(`${disciplinaId}-valor_hora`)}
                        className="text-sm text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                      >
                        R$ {config.valor_hora?.toLocaleString('pt-BR') || '0'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        const valorEstimado = (config.valor_base || 0) + ((config.valor_por_m2 || 0) * 150);
                        alert(`Valor estimado para 150m²: R$ ${valorEstimado.toLocaleString('pt-BR')}`);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Calcular valor estimado"
                    >
                      🧮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multiplicadores Regionais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Multiplicadores Regionais
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {configuracoes?.parametros_gerais?.multiplicador_regional && 
            Object.entries(configuracoes.parametros_gerais.multiplicador_regional).map(([regiao, multiplicador]: [string, any]) => (
              <div key={regiao} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{regiao}</div>
                <div className="text-lg font-bold text-blue-600">{multiplicador}x</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-blue-600 dark:text-blue-400 mr-2">ℹ️</span>
          <div className="text-blue-800 dark:text-blue-200 text-sm">
            <p className="font-medium mb-2">Como funciona o cálculo:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Valor Base:</strong> Valor fixo independente da área</li>
              <li><strong>Valor/m²:</strong> Multiplicado pela área construída</li>
              <li><strong>Multiplicadores:</strong> Aplicados por complexidade e região</li>
              <li><strong>Valor Final:</strong> (Base + Área×Valor/m²) × Multiplicadores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente placeholder para Cronograma Padrão
function CronogramaPadrao() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configuração de Cronograma
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Defina prazos padrão para cada fase do projeto conforme NBR 13532
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-600 dark:text-yellow-400 mr-2">🚧</span>
          <span className="text-yellow-800 dark:text-yellow-200">
            Esta funcionalidade será implementada na próxima versão
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente placeholder para Configurações Avançadas
function ConfiguracoesAvancadas() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configurações Avançadas
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Parâmetros avançados, integrações e configurações de sistema
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-600 dark:text-yellow-400 mr-2">🚧</span>
          <span className="text-yellow-800 dark:text-yellow-200">
            Esta funcionalidade será implementada na próxima versão
          </span>
        </div>
      </div>
    </div>
  );
}