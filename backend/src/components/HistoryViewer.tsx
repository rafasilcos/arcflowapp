import React, { useState, useEffect } from 'react';

export interface VersaoOrcamento {
  id: string;
  orcamentoId: string;
  briefingId: string;
  versao: number;
  dadosVersao: any;
  motivoAlteracao?: string;
  createdAt: string;
  createdBy: string;
  nomeUsuario?: string;
}

export interface DiferencaVersao {
  campo: string;
  valorAnterior: any;
  valorAtual: any;
  tipo: 'adicionado' | 'removido' | 'modificado';
  categoria: 'valor' | 'horas' | 'disciplina' | 'configuracao';
}

export interface ComparacaoVersoes {
  versaoAnterior: VersaoOrcamento;
  versaoAtual: VersaoOrcamento;
  diferencas: DiferencaVersao[];
}

export interface HistoryViewerProps {
  orcamentoId: string;
  briefingId?: string;
  onClose: () => void;
}



const HistoryViewer: React.FC<HistoryViewerProps> = ({ orcamentoId, briefingId, onClose }) => {
  const [historico, setHistorico] = useState<VersaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparacao, setComparacao] = useState<ComparacaoVersoes | null>(null);
  const [versaoSelecionada1, setVersaoSelecionada1] = useState<number | null>(null);
  const [versaoSelecionada2, setVersaoSelecionada2] = useState<number | null>(null);
  const [modoComparacao, setModoComparacao] = useState(false);

  useEffect(() => {
    carregarHistorico();
  }, [orcamentoId, briefingId]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = briefingId 
        ? `/api/historico-orcamentos/briefing/${briefingId}`
        : `/api/historico-orcamentos/${orcamentoId}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar histórico');
      }

      const data = await response.json();
      setHistorico(data.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const compararVersoes = async () => {
    if (!versaoSelecionada1 || !versaoSelecionada2) {
      alert('Selecione duas versões para comparar');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/historico-orcamentos/comparar/${orcamentoId}/${versaoSelecionada1}/${versaoSelecionada2}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao comparar versões');
      }

      const data = await response.json();
      setComparacao(data.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao comparar versões');
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor: any): string => {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
    return String(valor);
  };

  const formatarData = (data: string): string => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const getTipoCorClass = (tipo: string): string => {
    switch (tipo) {
      case 'adicionado': return 'text-green-600 bg-green-50';
      case 'removido': return 'text-red-600 bg-red-50';
      case 'modificado': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Carregando histórico...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Histórico de Versões
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModoComparacao(!modoComparacao)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              {modoComparacao ? 'Cancelar Comparação' : 'Comparar Versões'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-80px)]">
          {/* Lista de Versões */}
          <div className="w-1/2 border-r overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Versões ({historico.length})
              </h3>

              {modoComparacao && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    Selecione duas versões para comparar:
                  </p>
                  <button
                    onClick={compararVersoes}
                    disabled={!versaoSelecionada1 || !versaoSelecionada2}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:bg-gray-300"
                  >
                    Comparar
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                {historico.map((versao) => (
                  <div
                    key={versao.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      modoComparacao
                        ? versaoSelecionada1 === versao.versao || versaoSelecionada2 === versao.versao
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (modoComparacao) {
                        if (!versaoSelecionada1) {
                          setVersaoSelecionada1(versao.versao);
                        } else if (!versaoSelecionada2 && versao.versao !== versaoSelecionada1) {
                          setVersaoSelecionada2(versao.versao);
                        } else if (versao.versao === versaoSelecionada1) {
                          setVersaoSelecionada1(versaoSelecionada2);
                          setVersaoSelecionada2(null);
                        } else if (versao.versao === versaoSelecionada2) {
                          setVersaoSelecionada2(null);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        Versão {versao.versao}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatarData(versao.createdAt)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      Por: {versao.nomeUsuario || 'Usuário desconhecido'}
                    </div>

                    {versao.motivoAlteracao && (
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {versao.motivoAlteracao}
                      </div>
                    )}

                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Valor Total: </span>
                      <span className="font-medium">
                        {formatarValor(versao.dadosVersao?.valorTotal || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes/Comparação */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6">
              {comparacao ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Comparação de Versões
                  </h3>
                  
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">Versão {comparacao.versaoAnterior.versao}</div>
                        <div className="text-sm text-gray-600">
                          {formatarData(comparacao.versaoAnterior.createdAt)}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">Versão {comparacao.versaoAtual.versao}</div>
                        <div className="text-sm text-gray-600">
                          {formatarData(comparacao.versaoAtual.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Diferenças ({comparacao.diferencas.length})
                    </h4>
                    
                    {comparacao.diferencas.length === 0 ? (
                      <p className="text-gray-500">Nenhuma diferença encontrada</p>
                    ) : (
                      <div className="space-y-3">
                        {comparacao.diferencas.map((diff, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${getTipoCorClass(diff.tipo)}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{diff.campo}</span>
                              <span className="text-xs px-2 py-1 rounded bg-white">
                                {diff.tipo}
                              </span>
                            </div>
                            
                            <div className="text-sm">
                              {diff.tipo === 'adicionado' ? (
                                <div>
                                  <span className="text-gray-600">Novo valor: </span>
                                  <span className="font-medium">{formatarValor(diff.valorAtual)}</span>
                                </div>
                              ) : diff.tipo === 'removido' ? (
                                <div>
                                  <span className="text-gray-600">Valor removido: </span>
                                  <span className="font-medium">{formatarValor(diff.valorAnterior)}</span>
                                </div>
                              ) : (
                                <div>
                                  <div>
                                    <span className="text-gray-600">De: </span>
                                    <span className="font-medium">{formatarValor(diff.valorAnterior)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Para: </span>
                                    <span className="font-medium">{formatarValor(diff.valorAtual)}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  {modoComparacao 
                    ? 'Selecione duas versões para comparar'
                    : 'Selecione uma versão para ver detalhes'
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryViewer;