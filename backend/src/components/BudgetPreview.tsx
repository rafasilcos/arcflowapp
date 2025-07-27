import React, { useState, useEffect } from 'react';
import HistoryViewer from './HistoryViewer';

export interface DadosExtraidos {
  areaConstruida: number;
  areaTerreno?: number;
  tipologia: string;
  padrao: 'SIMPLES' | 'MEDIO' | 'ALTO';
  complexidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA';
  disciplinasNecessarias: string[];
  localizacao?: string;
  prazoDesejado?: number;
}

export interface OrcamentoPreview {
  valorTotal: number;
  valorPorM2: number;
  areaConstruida: number;
  prazoTotal: number;
  disciplinas: Array<{
    nome: string;
    horas: number;
    valor: number;
    percentual: number;
  }>;
  composicaoFinanceira: {
    valorBase: number;
    custosIndiretos: number;
    impostos: number;
    margemLucro: number;
  };
  cronograma: {
    prazoTotal: number;
    fases: Array<{
      nome: string;
      prazo: number;
      percentual: number;
    }>;
  };
}

export interface BudgetPreviewProps {
  briefingId: string;
  orcamentoId?: string;
  onGerarOrcamento?: (orcamentoId: string) => void;
  onFechar?: () => void;
}



export const BudgetPreview: React.FC<BudgetPreviewProps> = ({
  briefingId,
  orcamentoId,
  onGerarOrcamento,
  onFechar
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dadosExtraidos, setDadosExtraidos] = useState<DadosExtraidos | null>(null);
  const [orcamentoPreview, setOrcamentoPreview] = useState<OrcamentoPreview | null>(null);
  const [tipoBriefing, setTipoBriefing] = useState<'PADRÃO' | 'PERSONALIZADO'>('PADRÃO');
  const [gerando, setGerando] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  useEffect(() => {
    carregarPreview();
  }, [briefingId]);

  const carregarPreview = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orcamentos-inteligentes/preview/${briefingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao carregar preview');
      }

      const data = await response.json();
      setDadosExtraidos(data.data.dadosExtraidos);
      setOrcamentoPreview(data.data.orcamento);
      setTipoBriefing(data.data.tipoBriefing);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const gerarOrcamento = async () => {
    try {
      setGerando(true);
      setError(null);

      const response = await fetch(`/api/orcamentos-inteligentes/gerar/${briefingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar orçamento');
      }

      const data = await response.json();
      onGerarOrcamento?.(data.data.orcamentoId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na geração');
    } finally {
      setGerando(false);
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getComplexidadeColor = (complexidade: string) => {
    switch (complexidade) {
      case 'BAIXA': return 'text-green-600 bg-green-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'ALTA': return 'text-orange-600 bg-orange-100';
      case 'MUITO_ALTA': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPadraoColor = (padrao: string) => {
    switch (padrao) {
      case 'SIMPLES': return 'text-blue-600 bg-blue-100';
      case 'MEDIO': return 'text-purple-600 bg-purple-100';
      case 'ALTO': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Gerando preview do orçamento...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro no Preview</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-3">
                <button
                  onClick={carregarPreview}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dadosExtraidos || !orcamentoPreview) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Dados insuficientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Não foi possível gerar o preview do orçamento com os dados disponíveis.
          </p>
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
            <h2 className="text-xl font-bold text-white">Preview do Orçamento</h2>
            <p className="text-blue-100 text-sm mt-1">
              Briefing {tipoBriefing} • Gerado automaticamente
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatarValor(orcamentoPreview.valorTotal)}
            </div>
            <div className="text-blue-100 text-sm">
              {formatarValor(orcamentoPreview.valorPorM2)}/m²
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Dados Extraídos */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Dados do Projeto</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Área Construída</span>
              <div className="text-lg font-semibold text-gray-900">
                {dadosExtraidos.areaConstruida.toLocaleString('pt-BR')} m²
              </div>
            </div>
            {dadosExtraidos.areaTerreno && (
              <div>
                <span className="text-sm text-gray-500">Área do Terreno</span>
                <div className="text-lg font-semibold text-gray-900">
                  {dadosExtraidos.areaTerreno.toLocaleString('pt-BR')} m²
                </div>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Tipologia</span>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {dadosExtraidos.tipologia}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Prazo Estimado</span>
              <div className="text-lg font-semibold text-gray-900">
                {orcamentoPreview.prazoTotal} dias
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPadraoColor(dadosExtraidos.padrao)}`}>
              Padrão {dadosExtraidos.padrao}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexidadeColor(dadosExtraidos.complexidade)}`}>
              Complexidade {dadosExtraidos.complexidade}
            </span>
          </div>
        </div>

        {/* Disciplinas */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Disciplinas Incluídas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orcamentoPreview.disciplinas.map((disciplina, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{disciplina.nome}</h4>
                    <p className="text-sm text-gray-500">{disciplina.horas}h</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatarValor(disciplina.valor)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {disciplina.percentual.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Composição Financeira */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Composição Financeira</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Base</span>
                <span className="font-medium">{formatarValor(orcamentoPreview.composicaoFinanceira.valorBase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Custos Indiretos</span>
                <span className="font-medium">{formatarValor(orcamentoPreview.composicaoFinanceira.custosIndiretos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impostos</span>
                <span className="font-medium">{formatarValor(orcamentoPreview.composicaoFinanceira.impostos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Margem de Lucro</span>
                <span className="font-medium">{formatarValor(orcamentoPreview.composicaoFinanceira.margemLucro)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatarValor(orcamentoPreview.valorTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cronograma */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Cronograma</h3>
          <div className="space-y-2">
            {orcamentoPreview.cronograma.fases.map((fase, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-gray-700">{fase.nome}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{fase.prazo} dias</span>
                  <span className="text-sm text-gray-500">({fase.percentual.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            Preview gerado em {new Date().toLocaleString('pt-BR')}
          </div>
          <div className="flex space-x-3">
            {orcamentoId && (
              <button
                onClick={() => setMostrarHistorico(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Histórico
              </button>
            )}
            {onFechar && (
              <button
                onClick={onFechar}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            )}
            <button
              onClick={gerarOrcamento}
              disabled={gerando}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {gerando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando...
                </>
              ) : (
                orcamentoId ? 'Regenerar Orçamento' : 'Gerar Orçamento'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal do Histórico */}
      {mostrarHistorico && orcamentoId && (
        <HistoryViewer
          orcamentoId={orcamentoId}
          briefingId={briefingId}
          onClose={() => setMostrarHistorico(false)}
        />
      )}
      </div>
    </div>
  );
};

export default BudgetPreview;