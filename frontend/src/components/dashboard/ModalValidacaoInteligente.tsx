import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, AlertTriangle, AlertCircle, Info, DollarSign, 
  CheckCircle, XCircle, FileText, Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResultadoValidacao, ValidacaoImpacto } from '@/types/validacao';

interface ModalValidacaoInteligenteProps {
  isOpen: boolean;
  validacao: ResultadoValidacao | null;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  titulo?: string;
}

export function ModalValidacaoInteligente({
  isOpen,
  validacao,
  onClose,
  onConfirm,
  onCancel,
  titulo = "Análise de Impacto"
}: ModalValidacaoInteligenteProps) {
  
  if (!isOpen || !validacao) return null;

  const getValidacaoIcon = (tipo: ValidacaoImpacto['tipo']) => {
    switch (tipo) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getCategoriaColor = (categoria: ValidacaoImpacto['categoria']) => {
    const colors = {
      dependencia: 'bg-purple-100 text-purple-700',
      prazo: 'bg-orange-100 text-orange-700',
      custo: 'bg-green-100 text-green-700',
      qualidade: 'bg-blue-100 text-blue-700',
      equipe: 'bg-indigo-100 text-indigo-700'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-700';
  };

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const baixarRelatorioValidacao = () => {
    const relatorio = {
      timestamp: new Date().toISOString(),
      titulo,
      resumo: {
        pode_prosseguir: validacao.pode_prosseguir,
        requer_confirmacao: validacao.requer_confirmacao,
        total_validacoes: validacao.validacoes.length,
        validacoes_por_tipo: {
          error: validacao.validacoes.filter(v => v.tipo === 'error').length,
          warning: validacao.validacoes.filter(v => v.tipo === 'warning').length,
          info: validacao.validacoes.filter(v => v.tipo === 'info').length
        }
      },
      impacto_calculado: validacao.impacto_calculado,
      validacoes: validacao.validacoes,
      sugestoes_alternativas: validacao.sugestoes_alternativas
    };

    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validacao-impacto-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header com resumo do impacto */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{titulo}</h2>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={baixarRelatorioValidacao}
                  className="p-2 hover:bg-white/20 rounded-lg text-white border border-white/30"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Resumo de impacto */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {validacao.impacto_calculado.horas_adicionais > 0 && (
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <div className="text-sm opacity-90">Impacto em Tempo</div>
                      <div className="font-bold">
                        +{formatarTempo(validacao.impacto_calculado.horas_adicionais)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {validacao.impacto_calculado.dias_atraso > 0 && (
                <div className="bg-orange-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                      <div className="text-sm opacity-90">Atraso Potencial</div>
                      <div className="font-bold">{validacao.impacto_calculado.dias_atraso} dias</div>
                    </div>
                  </div>
                </div>
              )}
              
              {validacao.impacto_calculado.custo_adicional > 0 && (
                <div className="bg-green-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <div>
                      <div className="text-sm opacity-90">Custo Adicional</div>
                      <div className="font-bold">
                        {formatarMoeda(validacao.impacto_calculado.custo_adicional)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {validacao.impacto_calculado.tarefas_afetadas.length > 0 && (
                <div className="bg-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <div>
                      <div className="text-sm opacity-90">Tarefas Afetadas</div>
                      <div className="font-bold">{validacao.impacto_calculado.tarefas_afetadas.length}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status geral */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {validacao.pode_prosseguir ? (
                  <CheckCircle className="w-5 h-5 text-green-300" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-300" />
                )}
                <span className="text-sm">
                  {validacao.pode_prosseguir ? 'Operação pode prosseguir' : 'Operação bloqueada'}
                </span>
              </div>
              
              {validacao.requer_confirmacao && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Requer confirmação</span>
                </div>
              )}
            </div>
          </div>

          {/* Lista de validações */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {validacao.validacoes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p>Nenhum problema detectado! A operação pode ser executada com segurança.</p>
              </div>
            ) : (
              validacao.validacoes.map((validacaoItem, index) => (
                <div 
                  key={validacaoItem.id || index}
                  className={`border rounded-lg p-4 ${
                    validacaoItem.tipo === 'error' ? 'border-red-300 bg-red-50' :
                    validacaoItem.tipo === 'warning' ? 'border-orange-300 bg-orange-50' :
                    'border-blue-300 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getValidacaoIcon(validacaoItem.tipo)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoriaColor(validacaoItem.categoria)}`}>
                          {validacaoItem.categoria.toUpperCase()}
                        </Badge>
                        
                        {!validacaoItem.pode_prosseguir && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            BLOQUEANTE
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-800 font-medium mb-2">{validacaoItem.mensagem}</p>
                      
                      {/* Detalhes do impacto */}
                      {(validacaoItem.impacto_estimado.horas_adicionais || 
                        validacaoItem.impacto_estimado.dias_atraso || 
                        validacaoItem.impacto_estimado.custo_adicional) && (
                        <div className="mb-3 p-2 bg-white rounded border">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Impacto Estimado:</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            {validacaoItem.impacto_estimado.horas_adicionais && (
                              <div>• Tempo adicional: {formatarTempo(validacaoItem.impacto_estimado.horas_adicionais)}</div>
                            )}
                            {validacaoItem.impacto_estimado.dias_atraso && (
                              <div>• Atraso: {validacaoItem.impacto_estimado.dias_atraso} dias</div>
                            )}
                            {validacaoItem.impacto_estimado.custo_adicional && (
                              <div>• Custo: {formatarMoeda(validacaoItem.impacto_estimado.custo_adicional)}</div>
                            )}
                            {validacaoItem.impacto_estimado.risco_qualidade && (
                              <div>• Risco de qualidade: {validacaoItem.impacto_estimado.risco_qualidade}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Sugestões */}
                      {validacaoItem.sugestoes.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Sugestões:</h5>
                          <ul className="space-y-1">
                            {validacaoItem.sugestoes.map((sugestao, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                                <span>{sugestao}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sugestões alternativas */}
          {validacao.sugestoes_alternativas.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Alternativas Sugeridas:</h4>
              <div className="space-y-2">
                {validacao.sugestoes_alternativas.map((sugestao, index) => (
                  <button
                    key={sugestao.id || index}
                    onClick={sugestao.acao}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{sugestao.descricao}</span>
                      <span className="text-xs text-blue-600">Executar →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <div className="text-sm text-gray-600">
              {validacao.validacoes.length > 0 && (
                <span>
                  {validacao.validacoes.filter(v => v.tipo === 'error').length} erro(s), {' '}
                  {validacao.validacoes.filter(v => v.tipo === 'warning').length} aviso(s), {' '}
                  {validacao.validacoes.filter(v => v.tipo === 'info').length} info(s)
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </Button>
              
              {validacao.pode_prosseguir && (
                <Button
                  onClick={onConfirm}
                  className={`px-6 py-2 text-white rounded-lg font-medium ${
                    validacao.requer_confirmacao
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {validacao.requer_confirmacao ? 'Confirmar Mesmo Assim' : 'Continuar'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 