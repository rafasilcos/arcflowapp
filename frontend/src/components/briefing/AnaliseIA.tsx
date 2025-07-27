'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Lightbulb, 
  PieChart,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar
} from 'lucide-react'
import { AnaliseIA } from '@/services/geminiService'

interface AnaliseIAProps {
  analise: AnaliseIA
  isLoading?: boolean
}

export default function AnaliseIAComponent({ analise, isLoading }: AnaliseIAProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Brain className="w-16 h-16 text-blue-600 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              🤖 IA Analisando seu Briefing...
            </h2>
            <p className="text-slate-600">
              Processando 130+ respostas com inteligência artificial
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adequado': return 'text-green-600 bg-green-50'
      case 'subestimado': return 'text-red-600 bg-red-50'
      case 'superestimado': return 'text-yellow-600 bg-yellow-50'
      case 'realista': return 'text-green-600 bg-green-50'
      case 'otimista': return 'text-yellow-600 bg-yellow-50'
      case 'conservador': return 'text-blue-600 bg-blue-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'adequado':
      case 'realista':
        return <CheckCircle className="w-5 h-5" />
      case 'subestimado':
        return <XCircle className="w-5 h-5" />
      case 'superestimado':
      case 'otimista':
      case 'conservador':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getViabilidadeColor = (nota: number) => {
    if (nota >= 8) return 'text-green-600'
    if (nota >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              Análise IA do Briefing
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Análise inteligente baseada em 130+ respostas estruturadas
          </p>
        </motion.div>

        {/* Viabilidade Geral */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Viabilidade Geral
            </h2>
            <div className={`text-6xl font-bold mb-2 ${getViabilidadeColor(analise.viabilidadeGeral)}`}>
              {analise.viabilidadeGeral.toFixed(1)}/10
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${analise.viabilidadeGeral * 10}%` }}
              />
            </div>
            <p className="text-slate-600">
              {analise.viabilidadeGeral >= 8 ? 'Projeto altamente viável' :
               analise.viabilidadeGeral >= 6 ? 'Projeto viável com ajustes' :
               'Projeto requer revisão significativa'}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Análise Orçamentária */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-slate-800">Análise Orçamentária</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Orçamento Declarado</p>
                <p className="text-2xl font-bold text-slate-800">
                  R$ {analise.analiseOrcamentaria.orcamentoDeclado.toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">Estimativa IA</p>
                <p className="text-lg font-semibold text-slate-700">
                  {analise.analiseOrcamentaria.estimativaIA}
                </p>
                {analise.analiseOrcamentaria.cubAtual && (
                  <p className="text-xs text-slate-500 mt-1">
                    CUB atual: {analise.analiseOrcamentaria.cubAtual}
                  </p>
                )}
                {analise.analiseOrcamentaria.valorM2Regiao && (
                  <p className="text-xs text-slate-500">
                    Valor m² região: {analise.analiseOrcamentaria.valorM2Regiao}
                  </p>
                )}
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(analise.analiseOrcamentaria.status)}`}>
                {getStatusIcon(analise.analiseOrcamentaria.status)}
                <span className="font-medium capitalize">
                  {analise.analiseOrcamentaria.status}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  {analise.analiseOrcamentaria.sugestao}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cronograma */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800">Cronograma</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Prazo Desejado</p>
                <p className="text-2xl font-bold text-slate-800">
                  {analise.cronograma.prazoDesejado}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">Estimativa IA</p>
                <p className="text-lg font-semibold text-slate-700">
                  {analise.cronograma.estimativaIA}
                </p>
                {analise.cronograma.prazoAprovacoes && (
                  <p className="text-xs text-slate-500 mt-1">
                    Aprovações: {analise.cronograma.prazoAprovacoes}
                  </p>
                )}
                {analise.cronograma.prazoExecucao && (
                  <p className="text-xs text-slate-500">
                    Execução: {analise.cronograma.prazoExecucao}
                  </p>
                )}
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(analise.cronograma.status)}`}>
                {getStatusIcon(analise.cronograma.status)}
                <span className="font-medium capitalize">
                  {analise.cronograma.status}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  {analise.cronograma.sugestao}
                </p>
                {analise.cronograma.riscosSazonais && analise.cronograma.riscosSazonais.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-600 mb-2">⚠️ Riscos Sazonais:</p>
                    {analise.cronograma.riscosSazonais.map((risco, index) => (
                      <p key={index} className="text-xs text-slate-600">• {risco}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alertas Críticos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-slate-800">Alertas Críticos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analise.alertasCriticos.map((alerta, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{alerta}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sugestões de Otimização */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold text-slate-800">Sugestões de Otimização</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analise.sugestoesOtimizacao.map((sugestao, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{sugestao}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Distribuição Orçamentária */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-slate-800">Distribuição Orçamentária</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analise.distribuicaoOrcamento.map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-slate-800">{item.categoria}</h4>
                  <span className="text-sm font-bold text-purple-600">{item.percentual}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  R$ {item.valor.toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Resumo Executivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6" />
            <h3 className="text-xl font-bold">Resumo Executivo</h3>
          </div>
          
          <p className="text-blue-100 text-lg leading-relaxed">
            {analise.resumoExecutivo}
          </p>
          
          <div className="mt-6 pt-6 border-t border-blue-500">
            <p className="text-blue-200 text-sm">
              ✨ Análise gerada por IA em tempo real • Baseada em 130+ perguntas estruturadas
            </p>
            {analise.dadosMercado && (
              <div className="mt-3 text-blue-200 text-xs">
                <p>📊 {analise.dadosMercado.fonteConsultada}</p>
                <p>📅 Consultado em: {analise.dadosMercado.dataConsulta}</p>
                <p>💡 {analise.dadosMercado.observacoes}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Botões de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            📧 Enviar Análise por Email
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            📅 Agendar Reunião
          </button>
          <button className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            📄 Gerar PDF
          </button>
        </motion.div>
      </div>
    </div>
  )
} 