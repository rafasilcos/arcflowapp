'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, AlertTriangle, TrendingUp, TrendingDown, 
  Download, Share2, ArrowLeft, Star, Target, Lightbulb,
  FileText, BarChart3, Clock, Award, AlertCircle, Zap, DollarSign
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AnaliseIA } from '../../services/analiseIA';
import { BriefingCompleto } from '../../types/briefing';

interface AnaliseResultadoProps {
  analise: AnaliseIA;
  briefing: BriefingCompleto;
  onVoltar: () => void;
  onGerarRelatorio?: () => void;
  onCompartilhar?: () => void;
}

export default function AnaliseResultado({
  analise,
  briefing,
  onVoltar,
  onGerarRelatorio,
  onCompartilhar
}: AnaliseResultadoProps) {
  const { temaId } = useTheme();
  const [secaoAtiva, setSecaoAtiva] = useState<'resumo' | 'detalhada' | 'recomendacoes'>('resumo');

  // Obter cor baseada no score
  const obterCorScore = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Obter ícone baseado na categoria
  const obterIconeCategoria = (categoria: string) => {
    switch (categoria) {
      case 'excelente': return <Award className="w-6 h-6 text-green-600" />;
      case 'bom': return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case 'regular': return <Target className="w-6 h-6 text-yellow-600" />;
      case 'precisa_melhorar': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default: return <BarChart3 className="w-6 h-6 text-gray-600" />;
    }
  };

  // Formatar tempo de análise
  const formatarTempo = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onVoltar}
            className={`p-2 rounded-lg transition-colors ${
              temaId === 'elegante'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${
              temaId === 'elegante' ? 'text-gray-900' : 'text-white'
            }`}>
              🎯 Análise IA Completa
            </h1>
            <p className={`${
              temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
            }`}>
              {briefing.nome} • Analisado em {formatarTempo(analise.tempoAnalise)}
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center space-x-3">
          {/* NOVO: Botão Transformar em Orçamento */}
          <button
            onClick={() => {
              // Disparar evento personalizado para o componente pai
              window.dispatchEvent(new CustomEvent('transformarEmOrcamento', {
                detail: { analise, briefing }
              }));
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>Transformar em Orçamento</span>
          </button>

          {onCompartilhar && (
            <button
              onClick={onCompartilhar}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                temaId === 'elegante'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          )}
          
          {onGerarRelatorio && (
            <button
              onClick={onGerarRelatorio}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Relatório PDF</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Score Principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-2xl mb-8 text-center ${
          temaId === 'elegante'
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
            : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20'
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          {obterIconeCategoria(analise.categoria)}
          <span className={`ml-3 text-2xl font-bold ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            {analise.categoria.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <div className={`text-6xl font-bold mb-2 ${obterCorScore(analise.score).split(' ')[0]}`}>
          {analise.score}
        </div>
        
        <p className={`text-lg ${
          temaId === 'elegante' ? 'text-gray-600' : 'text-white/70'
        }`}>
          Score de Qualidade do Briefing
        </p>

        {/* Barra de Score */}
        <div className={`w-full max-w-md mx-auto mt-4 bg-gray-200 rounded-full h-3 ${
          temaId === 'elegante' ? 'bg-gray-200' : 'bg-white/10'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analise.score}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-3 rounded-full ${
              analise.score >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              analise.score >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
              analise.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
          />
        </div>
      </motion.div>

      {/* Navegação de Seções */}
      <div className="flex space-x-2 mb-8 overflow-x-auto">
        {[
          { id: 'resumo', nome: '📊 Resumo Executivo', icon: BarChart3 },
          { id: 'detalhada', nome: '🔍 Análise Detalhada', icon: Target },
          { id: 'recomendacoes', nome: '💡 Recomendações', icon: Lightbulb }
        ].map(secao => (
          <button
            key={secao.id}
            onClick={() => setSecaoAtiva(secao.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              secaoAtiva === secao.id
                ? 'bg-blue-500 text-white'
                : temaId === 'elegante'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <secao.icon className="w-4 h-4" />
            <span>{secao.nome}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das Seções */}
      <motion.div
        key={secaoAtiva}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {secaoAtiva === 'resumo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pontos Fortes */}
            <div className={`p-6 rounded-2xl ${
              temaId === 'elegante'
                ? 'bg-green-50 border border-green-200'
                : 'bg-green-500/10 border border-green-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className={`text-xl font-bold ${
                  temaId === 'elegante' ? 'text-green-800' : 'text-green-200'
                }`}>
                  Pontos Fortes
                </h3>
              </div>
              <ul className="space-y-2">
                {(analise.pontosFortres || []).map((ponto, index) => (
                  <li key={index} className={`flex items-start space-x-2 ${
                    temaId === 'elegante' ? 'text-green-700' : 'text-green-100'
                  }`}>
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos de Atenção */}
            <div className={`p-6 rounded-2xl ${
              temaId === 'elegante'
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className={`text-xl font-bold ${
                  temaId === 'elegante' ? 'text-yellow-800' : 'text-yellow-200'
                }`}>
                  Pontos de Atenção
                </h3>
              </div>
              <ul className="space-y-2">
                {(analise.pontosAtencao || []).map((ponto, index) => (
                  <li key={index} className={`flex items-start space-x-2 ${
                    temaId === 'elegante' ? 'text-yellow-700' : 'text-yellow-100'
                  }`}>
                    <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Alertas Críticos */}
            {(analise.alertas || []).length > 0 && (
              <div className={`lg:col-span-2 p-6 rounded-2xl ${
                temaId === 'elegante'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <h3 className={`text-xl font-bold ${
                    temaId === 'elegante' ? 'text-red-800' : 'text-red-200'
                  }`}>
                    Alertas Críticos
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(analise.alertas || []).map((alerta, index) => (
                    <li key={index} className={`flex items-start space-x-2 ${
                      temaId === 'elegante' ? 'text-red-700' : 'text-red-100'
                    }`}>
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{alerta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {secaoAtiva === 'detalhada' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analise.analiseDetalhada || {}).map(([criterio, dados]) => (
              <div key={criterio} className={`p-6 rounded-2xl ${
                temaId === 'elegante'
                  ? 'bg-white border border-gray-200 shadow-sm'
                  : 'bg-white/5 border border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold capitalize ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {criterio.replace('_', ' ')}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    obterCorScore(dados.score)
                  }`}>
                    {dados.score}
                  </span>
                </div>
                
                <div className={`w-full bg-gray-200 rounded-full h-2 mb-3 ${
                  temaId === 'elegante' ? 'bg-gray-200' : 'bg-white/10'
                }`}>
                  <div
                    className={`h-2 rounded-full ${
                      dados.score >= 85 ? 'bg-green-500' :
                      dados.score >= 70 ? 'bg-blue-500' :
                      dados.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dados.score}%` }}
                  />
                </div>
                
                <p className={`text-sm ${
                  temaId === 'elegante' ? 'text-gray-600' : 'text-white/70'
                }`}>
                  {dados.observacoes}
                </p>
              </div>
            ))}
          </div>
        )}

        {secaoAtiva === 'recomendacoes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recomendações */}
            <div className={`p-6 rounded-2xl ${
              temaId === 'elegante'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h3 className={`text-xl font-bold ${
                  temaId === 'elegante' ? 'text-blue-800' : 'text-blue-200'
                }`}>
                  Recomendações
                </h3>
              </div>
              <ul className="space-y-3">
                {(analise.recomendacoes || []).map((recomendacao, index) => (
                  <li key={index} className={`flex items-start space-x-2 ${
                    temaId === 'elegante' ? 'text-blue-700' : 'text-blue-100'
                  }`}>
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{recomendacao}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Próximos Passos */}
            <div className={`p-6 rounded-2xl ${
              temaId === 'elegante'
                ? 'bg-purple-50 border border-purple-200'
                : 'bg-purple-500/10 border border-purple-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className={`text-xl font-bold ${
                  temaId === 'elegante' ? 'text-purple-800' : 'text-purple-200'
                }`}>
                  Próximos Passos
                </h3>
              </div>
              <ul className="space-y-3">
                {(analise.proximosPassos || []).map((passo, index) => (
                  <li key={index} className={`flex items-start space-x-2 ${
                    temaId === 'elegante' ? 'text-purple-700' : 'text-purple-100'
                  }`}>
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{passo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer com Metadados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-8 p-4 rounded-lg text-center text-sm ${
          temaId === 'elegante'
            ? 'bg-gray-50 text-gray-500'
            : 'bg-white/5 text-white/50'
        }`}
      >
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Analisado em {formatarTempo(analise.tempoAnalise)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Gemini 2.0 Flash</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{new Date(analise.geradoEm).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 