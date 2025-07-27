/**
 * Modal para Solicitação de Dados Complementares
 * Tarefa 11: Implementar validações e tratamento de erros
 */

import React, { useState } from 'react';

export interface CampoSolicitacao {
  nome: string;
  label: string;
  tipo: 'number' | 'text' | 'select';
  obrigatorio: boolean;
  opcoes?: string[];
  placeholder?: string;
  validacao?: string;
  valor?: any;
}

export interface SolicitacaoDados {
  titulo: string;
  descricao: string;
  campos: CampoSolicitacao[];
}

export interface DataRequestModalProps {
  solicitacao: SolicitacaoDados;
  onSubmit: (dados: Record<string, any>) => void;
  onCancel: () => void;
  onUseFallback?: () => void;
  loading?: boolean;
}

const DataRequestModal: React.FC<DataRequestModalProps> = ({
  solicitacao,
  onSubmit,
  onCancel,
  onUseFallback,
  loading = false
}) => {
  const [dados, setDados] = useState<Record<string, any>>({});
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleInputChange = (nome: string, valor: any) => {
    setDados(prev => ({ ...prev, [nome]: valor }));
    
    // Limpar erro do campo quando usuário digita
    if (erros[nome]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[nome];
        return novosErros;
      });
    }
  };

  const validarCampo = (campo: CampoSolicitacao, valor: any): string | null => {
    // Campo obrigatório
    if (campo.obrigatorio && (!valor || valor === '')) {
      return `${campo.label} é obrigatório`;
    }

    // Validações específicas por tipo
    if (valor && campo.tipo === 'number') {
      const numero = Number(valor);
      if (isNaN(numero)) {
        return `${campo.label} deve ser um número válido`;
      }
      
      // Validações específicas por campo
      if (campo.nome === 'areaConstruida' && numero <= 0) {
        return 'Área construída deve ser maior que zero';
      }
      if (campo.nome === 'prazoDesejado' && (numero < 7 || numero > 730)) {
        return 'Prazo deve estar entre 7 e 730 dias';
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novosErros: Record<string, string> = {};
    
    // Validar todos os campos
    solicitacao.campos.forEach(campo => {
      const erro = validarCampo(campo, dados[campo.nome]);
      if (erro) {
        novosErros[campo.nome] = erro;
      }
    });

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    onSubmit(dados);
  };

  const renderCampo = (campo: CampoSolicitacao) => {
    const valor = dados[campo.nome] || '';
    const erro = erros[campo.nome];

    switch (campo.tipo) {
      case 'select':
        return (
          <div key={campo.nome} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={valor}
              onChange={(e) => handleInputChange(campo.nome, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                erro ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              {campo.opcoes?.map(opcao => (
                <option key={opcao} value={opcao}>
                  {opcao.charAt(0).toUpperCase() + opcao.slice(1)}
                </option>
              ))}
            </select>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {campo.validacao && !erro && (
              <p className="text-sm text-gray-500">{campo.validacao}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={campo.nome} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => handleInputChange(campo.nome, e.target.value)}
              placeholder={campo.placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                erro ? 'border-red-300' : 'border-gray-300'
              }`}
              step={campo.nome.includes('area') ? '0.01' : '1'}
              min="0"
            />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {campo.validacao && !erro && (
              <p className="text-sm text-gray-500">{campo.validacao}</p>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <div key={campo.nome} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {campo.label}
              {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={valor}
              onChange={(e) => handleInputChange(campo.nome, e.target.value)}
              placeholder={campo.placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                erro ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {campo.validacao && !erro && (
              <p className="text-sm text-gray-500">{campo.validacao}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{solicitacao.titulo}</h2>
              <p className="text-blue-100 text-sm mt-1">{solicitacao.descricao}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-blue-100 hover:text-white"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {solicitacao.campos.map(renderCampo)}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Campos obrigatórios
          </div>
          
          <div className="flex space-x-3">
            {onUseFallback && (
              <button
                type="button"
                onClick={onUseFallback}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Usar Estimativas
              </button>
            )}
            
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Continuar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-blue-50 px-6 py-3 border-t">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Dica:</p>
              <p>
                Quanto mais informações precisas você fornecer, mais exato será o orçamento gerado. 
                {onUseFallback && ' Você também pode optar por usar estimativas automáticas baseadas em dados históricos.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRequestModal;