import React, { useState, useEffect } from 'react';

export interface TabelaPrecos {
  valorHoraArquiteto: number;
  valorHoraEngenheiro: number;
  valorHoraDesigner: number;
  valorHoraTecnico: number;
  valorHoraEstagiario: number;
}

export interface MultiplicadoresTipologia {
  [tipologia: string]: number;
}

export interface ParametrosComplexidade {
  baixa: number;
  media: number;
  alta: number;
  muitoAlta: number;
}

export interface ConfiguracoesPadrao {
  custosIndiretos: number;
  impostos: number;
  margemLucro: number;
  prazoBasePorM2: number;
}

export interface ConfiguracaoEscritorio {
  id?: string;
  escritorioId: string;
  tabelaPrecos: TabelaPrecos;
  multiplicadores: MultiplicadoresTipologia;
  parametrosComplexidade: ParametrosComplexidade;
  configuracoesPadrao: ConfiguracoesPadrao;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConfigurationPanelProps {
  escritorioId: string;
  onSalvar?: (configuracao: ConfiguracaoEscritorio) => void;
  onFechar?: () => void;
  readOnly?: boolean;
}



const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  escritorioId,
  onSalvar,
  onFechar,
  readOnly = false
}) => {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoEscritorio>({
    escritorioId,
    tabelaPrecos: {
      valorHoraArquiteto: 150,
      valorHoraEngenheiro: 140,
      valorHoraDesigner: 80,
      valorHoraTecnico: 60,
      valorHoraEstagiario: 25
    },
    multiplicadores: {
      'residencial': 1.0,
      'comercial': 1.2,
      'industrial': 1.5,
      'institucional': 1.3,
      'urbanistico': 1.8
    },
    parametrosComplexidade: {
      baixa: 1.0,
      media: 1.3,
      alta: 1.6,
      muitoAlta: 2.0
    },
    configuracoesPadrao: {
      custosIndiretos: 0.15,
      impostos: 0.08,
      margemLucro: 0.20,
      prazoBasePorM2: 0.5
    },
    ativo: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<'precos' | 'multiplicadores' | 'complexidade' | 'padrao'>('precos');

  useEffect(() => {
    carregarConfiguracao();
  }, [escritorioId]);

  const carregarConfiguracao = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/configuracoes-orcamento/escritorio/${escritorioId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracao(data.data);
      } else if (response.status !== 404) {
        throw new Error('Erro ao carregar configurações');
      }
      // Se 404, mantém configurações padrão

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracao = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/configuracoes-orcamento/escritorio/${escritorioId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configuracao)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar configurações');
      }

      const data = await response.json();
      setConfiguracao(data.data);
      onSalvar?.(data.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const resetarPadrao = async () => {
    if (!confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/configuracoes-orcamento/reset/${escritorioId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao resetar configurações');
      }

      const data = await response.json();
      setConfiguracao(data.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resetar');
    } finally {
      setSaving(false);
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarPercentual = (valor: number) => {
    return (valor * 100).toFixed(1) + '%';
  };

  const atualizarTabelaPrecos = (campo: keyof TabelaPrecos, valor: number) => {
    setConfiguracao(prev => ({
      ...prev,
      tabelaPrecos: {
        ...prev.tabelaPrecos,
        [campo]: valor
      }
    }));
  };

  const atualizarMultiplicador = (tipologia: string, valor: number) => {
    setConfiguracao(prev => ({
      ...prev,
      multiplicadores: {
        ...prev.multiplicadores,
        [tipologia]: valor
      }
    }));
  };

  const atualizarComplexidade = (nivel: keyof ParametrosComplexidade, valor: number) => {
    setConfiguracao(prev => ({
      ...prev,
      parametrosComplexidade: {
        ...prev.parametrosComplexidade,
        [nivel]: valor
      }
    }));
  };

  const atualizarPadrao = (campo: keyof ConfiguracoesPadrao, valor: number) => {
    setConfiguracao(prev => ({
      ...prev,
      configuracoesPadrao: {
        ...prev.configuracoesPadrao,
        [campo]: valor
      }
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando configurações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Configurações de Orçamento</h2>
            <p className="text-blue-100 text-sm mt-1">
              Personalize os parâmetros de cálculo para seu escritório
            </p>
          </div>
          {onFechar && (
            <button
              onClick={onFechar}
              className="text-blue-100 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { key: 'precos', label: 'Tabela de Preços' },
            { key: 'multiplicadores', label: 'Multiplicadores' },
            { key: 'complexidade', label: 'Complexidade' },
            { key: 'padrao', label: 'Configurações Gerais' }
          ].map((aba) => (
            <button
              key={aba.key}
              onClick={() => setAbaSelecionada(aba.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                abaSelecionada === aba.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo das Abas */}
        {abaSelecionada === 'precos' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Valores por Hora por Função</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(configuracao.tabelaPrecos).map(([funcao, valor]) => (
                  <div key={funcao}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {funcao.replace('valorHora', '').replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={valor}
                        onChange={(e) => atualizarTabelaPrecos(funcao as keyof TabelaPrecos, parseFloat(e.target.value) || 0)}
                        disabled={readOnly}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'multiplicadores' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Multiplicadores por Tipologia</h3>
              <p className="text-sm text-gray-600 mb-4">
                Fatores aplicados aos valores base conforme a tipologia do projeto
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(configuracao.multiplicadores).map(([tipologia, multiplicador]) => (
                  <div key={tipologia}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {tipologia}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={multiplicador}
                        onChange={(e) => atualizarMultiplicador(tipologia, parseFloat(e.target.value) || 0)}
                        disabled={readOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        step="0.1"
                        min="0.1"
                        max="5.0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'complexidade' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fatores de Complexidade</h3>
              <p className="text-sm text-gray-600 mb-4">
                Multiplicadores aplicados conforme a complexidade identificada no projeto
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(configuracao.parametrosComplexidade).map(([nivel, fator]) => (
                  <div key={nivel}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      Complexidade {nivel === 'muitoAlta' ? 'Muito Alta' : nivel}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={fator}
                        onChange={(e) => atualizarComplexidade(nivel as keyof ParametrosComplexidade, parseFloat(e.target.value) || 0)}
                        disabled={readOnly}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        step="0.1"
                        min="0.5"
                        max="3.0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'padrao' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Gerais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custos Indiretos
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={configuracao.configuracoesPadrao.custosIndiretos * 100}
                      onChange={(e) => atualizarPadrao('custosIndiretos', (parseFloat(e.target.value) || 0) / 100)}
                      disabled={readOnly}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      step="0.1"
                      min="0"
                      max="50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impostos
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={configuracao.configuracoesPadrao.impostos * 100}
                      onChange={(e) => atualizarPadrao('impostos', (parseFloat(e.target.value) || 0) / 100)}
                      disabled={readOnly}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      step="0.1"
                      min="0"
                      max="30"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margem de Lucro
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={configuracao.configuracoesPadrao.margemLucro * 100}
                      onChange={(e) => atualizarPadrao('margemLucro', (parseFloat(e.target.value) || 0) / 100)}
                      disabled={readOnly}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo Base por m²
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={configuracao.configuracoesPadrao.prazoBasePorM2}
                      onChange={(e) => atualizarPadrao('prazoBasePorM2', parseFloat(e.target.value) || 0)}
                      disabled={readOnly}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      step="0.1"
                      min="0.1"
                      max="5"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">dias</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo de Impacto */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Resumo de Impacto</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Custos Indiretos:</span>
                  <div className="font-medium">{formatarPercentual(configuracao.configuracoesPadrao.custosIndiretos)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Impostos:</span>
                  <div className="font-medium">{formatarPercentual(configuracao.configuracoesPadrao.impostos)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Margem de Lucro:</span>
                  <div className="font-medium">{formatarPercentual(configuracao.configuracoesPadrao.margemLucro)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total de Acréscimos:</span>
                  <div className="font-medium text-blue-600">
                    {formatarPercentual(
                      configuracao.configuracoesPadrao.custosIndiretos +
                      configuracao.configuracoesPadrao.impostos +
                      configuracao.configuracoesPadrao.margemLucro
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        {!readOnly && (
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={resetarPadrao}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Resetar Padrão
            </button>
            
            <div className="flex space-x-3">
              {onFechar && (
                <button
                  onClick={onFechar}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={salvarConfiguracao}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel;