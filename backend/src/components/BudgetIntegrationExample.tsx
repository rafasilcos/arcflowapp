import React, { useState } from 'react';
import BudgetPreview from './BudgetPreview';
import BudgetBreakdown from './BudgetBreakdown';
import ConfigurationPanel from './ConfigurationPanel';
import HistoryViewer from './HistoryViewer';

interface BudgetIntegrationExampleProps {
  briefingId: string;
  orcamentoId?: string;
  escritorioId: string;
  isAdmin?: boolean;
  briefingStatus?: string;
}

const BudgetIntegrationExample: React.FC<BudgetIntegrationExampleProps> = ({
  briefingId,
  orcamentoId,
  escritorioId,
  isAdmin = false,
  briefingStatus = 'RASCUNHO'
}) => {
  const [modalAberto, setModalAberto] = useState<'preview' | 'breakdown' | 'config' | 'history' | null>(null);
  const [orcamentoAtual, setOrcamentoAtual] = useState<string | undefined>(orcamentoId);

  // Dados de exemplo para o BudgetBreakdown
  const disciplinasExemplo = [
    {
      nome: 'Arquitetura',
      horas: 120,
      valor: 18000,
      percentual: 45,
      detalhes: {
        valorHora: 150,
        multiplicador: 1.0,
        fases: [
          { nome: 'Estudo Preliminar', horas: 40, valor: 6000 },
          { nome: 'Anteprojeto', horas: 50, valor: 7500 },
          { nome: 'Projeto Executivo', horas: 30, valor: 4500 }
        ]
      }
    },
    {
      nome: 'Estrutural',
      horas: 80,
      valor: 11200,
      percentual: 28,
      detalhes: {
        valorHora: 140,
        multiplicador: 1.0,
        fases: [
          { nome: 'Dimensionamento', horas: 50, valor: 7000 },
          { nome: 'Detalhamento', horas: 30, valor: 4200 }
        ]
      }
    },
    {
      nome: 'Instalações',
      horas: 60,
      valor: 8400,
      percentual: 21,
      detalhes: {
        valorHora: 140,
        multiplicador: 1.0,
        fases: [
          { nome: 'Elétrica', horas: 30, valor: 4200 },
          { nome: 'Hidráulica', horas: 30, valor: 4200 }
        ]
      }
    },
    {
      nome: 'Paisagismo',
      horas: 20,
      valor: 2400,
      percentual: 6,
      detalhes: {
        valorHora: 120,
        multiplicador: 1.0,
        fases: [
          { nome: 'Conceito', horas: 10, valor: 1200 },
          { nome: 'Detalhamento', horas: 10, valor: 1200 }
        ]
      }
    }
  ];

  const fasesExemplo = [
    {
      nome: 'Estudo Preliminar',
      prazo: 30,
      percentual: 25,
      disciplinas: [
        { nome: 'Arquitetura', horas: 40, valor: 6000 },
        { nome: 'Estrutural', horas: 20, valor: 2800 }
      ]
    },
    {
      nome: 'Anteprojeto',
      prazo: 45,
      percentual: 37.5,
      disciplinas: [
        { nome: 'Arquitetura', horas: 50, valor: 7500 },
        { nome: 'Estrutural', horas: 30, valor: 4200 },
        { nome: 'Instalações', horas: 30, valor: 4200 }
      ]
    },
    {
      nome: 'Projeto Executivo',
      prazo: 45,
      percentual: 37.5,
      disciplinas: [
        { nome: 'Arquitetura', horas: 30, valor: 4500 },
        { nome: 'Estrutural', horas: 30, valor: 4200 },
        { nome: 'Instalações', horas: 30, valor: 4200 },
        { nome: 'Paisagismo', horas: 20, valor: 2400 }
      ]
    }
  ];

  const handleGerarOrcamento = (novoOrcamentoId: string) => {
    setOrcamentoAtual(novoOrcamentoId);
    setModalAberto(null);
    // Aqui você pode adicionar lógica para atualizar o estado do briefing
    console.log('Orçamento gerado:', novoOrcamentoId);
  };

  const handleSalvarConfiguracao = (configuracao: any) => {
    console.log('Configuração salva:', configuracao);
    setModalAberto(null);
    // Aqui você pode adicionar lógica para atualizar configurações
  };

  const podeGerarOrcamento = briefingStatus === 'CONCLUIDO' || briefingStatus === 'APROVADO';
  const temOrcamento = !!orcamentoAtual;

  return (
    <div className="space-y-6">
      {/* Seção de Ações do Orçamento */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Orçamento do Projeto</h3>
            <p className="text-sm text-gray-600">
              {temOrcamento 
                ? 'Orçamento gerado automaticamente baseado no briefing'
                : 'Gere um orçamento automático baseado nas informações do briefing'
              }
            </p>
          </div>
          
          {/* Status do Orçamento */}
          <div className="flex items-center space-x-2">
            {temOrcamento ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Orçamento Disponível
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Aguardando Geração
              </span>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3">
          {/* Botão Preview/Gerar */}
          <button
            onClick={() => setModalAberto('preview')}
            disabled={!podeGerarOrcamento}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              podeGerarOrcamento
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {temOrcamento ? 'Ver Preview' : 'Gerar Orçamento'}
          </button>

          {/* Botão Detalhamento */}
          {temOrcamento && (
            <button
              onClick={() => setModalAberto('breakdown')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Detalhamento
            </button>
          )}

          {/* Botão Histórico */}
          {temOrcamento && (
            <button
              onClick={() => setModalAberto('history')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Histórico
            </button>
          )}

          {/* Botão Configurações (apenas para admins) */}
          {isAdmin && (
            <button
              onClick={() => setModalAberto('config')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </button>
          )}
        </div>

        {/* Aviso se briefing não está pronto */}
        {!podeGerarOrcamento && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  O briefing precisa estar concluído para gerar o orçamento automaticamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalAberto === 'preview' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <BudgetPreview
              briefingId={briefingId}
              orcamentoId={orcamentoAtual}
              onGerarOrcamento={handleGerarOrcamento}
              onFechar={() => setModalAberto(null)}
            />
          </div>
        </div>
      )}

      {modalAberto === 'breakdown' && orcamentoAtual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhamento do Orçamento</h2>
              <button
                onClick={() => setModalAberto(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <BudgetBreakdown
                disciplinas={disciplinasExemplo}
                fases={fasesExemplo}
                valorTotal={40000}
                horasTotal={280}
                orcamentoId={orcamentoAtual}
                briefingId={briefingId}
                editavel={isAdmin}
              />
            </div>
          </div>
        </div>
      )}

      {modalAberto === 'config' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ConfigurationPanel
              escritorioId={escritorioId}
              onSalvar={handleSalvarConfiguracao}
              onFechar={() => setModalAberto(null)}
            />
          </div>
        </div>
      )}

      {modalAberto === 'history' && orcamentoAtual && (
        <HistoryViewer
          orcamentoId={orcamentoAtual}
          briefingId={briefingId}
          onClose={() => setModalAberto(null)}
        />
      )}
    </div>
  );
};

export default BudgetIntegrationExample;