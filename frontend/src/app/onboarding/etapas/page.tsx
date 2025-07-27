'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ClipboardList, ArrowRight, ArrowLeft, Settings, Percent, Clock, User, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

const etapasPadrao = [
  {
    id: 'tratativas',
    nome: 'Tratativas com Cliente',
    descricao: 'Contato inicial, briefing e negociação',
    percentualPadrao: 5,
    duracaoSemanas: 1,
    responsavel: 'Arquiteto Sênior',
    cor: 'from-blue-500 to-cyan-500',
    icone: '💬'
  },
  {
    id: 'estudo-preliminar',
    nome: 'Estudo Preliminar',
    descricao: 'Conceito inicial e primeiras ideias',
    percentualPadrao: 15,
    duracaoSemanas: 2,
    responsavel: 'Arquiteto',
    cor: 'from-green-500 to-emerald-500',
    icone: '✏️'
  },
  {
    id: 'anteprojeto',
    nome: 'Anteprojeto',
    descricao: 'Desenvolvimento da proposta',
    percentualPadrao: 20,
    duracaoSemanas: 3,
    responsavel: 'Arquiteto',
    cor: 'from-yellow-500 to-orange-500',
    icone: '📐'
  },
  {
    id: 'projeto-legal',
    nome: 'Projeto Legal',
    descricao: 'Documentação para aprovação',
    percentualPadrao: 25,
    duracaoSemanas: 4,
    responsavel: 'Arquiteto + Técnico',
    cor: 'from-purple-500 to-pink-500',
    icone: '📋'
  },
  {
    id: 'projeto-executivo',
    nome: 'Projeto Executivo',
    descricao: 'Detalhamento para execução',
    percentualPadrao: 30,
    duracaoSemanas: 6,
    responsavel: 'Equipe Completa',
    cor: 'from-red-500 to-rose-500',
    icone: '🏗️'
  },
  {
    id: 'entrega-acompanhamento',
    nome: 'Entrega e Acompanhamento',
    descricao: 'Finalização e suporte pós-entrega',
    percentualPadrao: 5,
    duracaoSemanas: 2,
    responsavel: 'Coordenador',
    cor: 'from-indigo-500 to-purple-500',
    icone: '📦'
  }
]

interface EtapaCustomizada {
  id: string
  nome: string
  percentual: number
  duracao: number
  ativa: boolean
}

export default function EtapasPage() {
  const [etapasConfiguradas, setEtapasConfiguradas] = useState<EtapaCustomizada[]>(
    etapasPadrao.map(etapa => ({
      id: etapa.id,
      nome: etapa.nome,
      percentual: etapa.percentualPadrao,
      duracao: etapa.duracaoSemanas,
      ativa: true
    }))
  )

  const [modoAvancado, setModoAvancado] = useState(false)

  const handleToggleEtapa = (etapaId: string) => {
    setEtapasConfiguradas(prev => 
      prev.map(etapa => 
        etapa.id === etapaId 
          ? { ...etapa, ativa: !etapa.ativa }
          : etapa
      )
    )
  }

  const handleUpdatePercentual = (etapaId: string, novoPercentual: number) => {
    if (novoPercentual < 1 || novoPercentual > 50) return
    
    setEtapasConfiguradas(prev => 
      prev.map(etapa => 
        etapa.id === etapaId 
          ? { ...etapa, percentual: novoPercentual }
          : etapa
      )
    )
  }

  const handleUpdateDuracao = (etapaId: string, novaDuracao: number) => {
    if (novaDuracao < 1 || novaDuracao > 20) return
    
    setEtapasConfiguradas(prev => 
      prev.map(etapa => 
        etapa.id === etapaId 
          ? { ...etapa, duracao: novaDuracao }
          : etapa
      )
    )
  }

  const etapasAtivas = etapasConfiguradas.filter(e => e.ativa)
  const totalPercentual = etapasAtivas.reduce((total, etapa) => total + etapa.percentual, 0)
  const totalSemanas = etapasAtivas.reduce((total, etapa) => total + etapa.duracao, 0)
  const isValid = totalPercentual === 100 && etapasAtivas.length >= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <ClipboardList className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">
          Configure sua metodologia ⚙️
        </h1>
        <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
          Defina as etapas de trabalho, percentuais de valor e prazos que seu escritório utiliza. 
          Isso criará cronogramas automáticos para todos os seus projetos.
        </p>
      </motion.div>

      {/* Resumo e Controles */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-blue-400" />
            <span className="text-blue-100/70 text-sm">Etapas Ativas</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {etapasAtivas.length}<span className="text-sm text-blue-100/60 ml-1">de 6</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Percent className="h-4 w-4 text-green-400" />
            <span className="text-blue-100/70 text-sm">Total Percentual</span>
          </div>
          <div className={`text-2xl font-bold ${totalPercentual === 100 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPercentual}%
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-blue-100/70 text-sm">Duração Total</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalSemanas}<span className="text-sm text-blue-100/60 ml-1">sem</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-4 w-4 text-purple-400" />
            <span className="text-blue-100/70 text-sm">Modo</span>
          </div>
          <button
            onClick={() => setModoAvancado(!modoAvancado)}
            className={`text-sm font-medium px-3 py-1 rounded-full transition-all ${
              modoAvancado 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {modoAvancado ? 'Avançado' : 'Simples'}
          </button>
        </div>
      </motion.div>

      {/* Status da Configuração */}
      {totalPercentual !== 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-sm">⚠️</span>
            </div>
            <div>
              <p className="text-yellow-400 font-medium">
                Ajuste necessário: {totalPercentual > 100 ? `Remova ${totalPercentual - 100}%` : `Adicione ${100 - totalPercentual}%`}
              </p>
              <p className="text-yellow-300/70 text-sm">
                O total deve somar exatamente 100% para criar orçamentos precisos.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de Etapas */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Etapas de Trabalho
          </h2>
          <div className="text-sm text-blue-100/60">
            Configure percentuais e prazos
          </div>
        </div>

        <div className="space-y-3">
          {etapasPadrao.map((etapaPadrao, index) => {
            const etapaConfig = etapasConfiguradas.find(e => e.id === etapaPadrao.id)!
            const isAtiva = etapaConfig.ativa

            return (
              <motion.div
                key={etapaPadrao.id}
                layout
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isAtiva
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 bg-white/5 opacity-60'
                }`}
              >
                <div className="space-y-4">
                  {/* Header da Etapa */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${etapaPadrao.cor} flex items-center justify-center text-xl flex-shrink-0`}>
                        {etapaPadrao.icone}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-white">
                            {index + 1}. {etapaPadrao.nome}
                          </h3>
                          <div className="text-xs text-blue-100/60 bg-white/10 px-2 py-1 rounded-full">
                            {etapaPadrao.responsavel}
                          </div>
                        </div>
                        <p className="text-blue-100/70 text-sm">
                          {etapaPadrao.descricao}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggleEtapa(etapaPadrao.id)}
                      className={`w-10 h-6 rounded-full relative transition-all duration-300 ${
                        isAtiva ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                        isAtiva ? 'left-5' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Controles (apenas se ativa) */}
                  {isAtiva && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10"
                    >
                      {/* Percentual */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100/80">
                          Percentual do Valor
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdatePercentual(etapaPadrao.id, etapaConfig.percentual - 1)}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            disabled={etapaConfig.percentual <= 1}
                          >
                            <Minus className="h-4 w-4 text-white" />
                          </button>
                          <div className="flex-1 text-center">
                            <div className="text-lg font-bold text-white">
                              {etapaConfig.percentual}%
                            </div>
                            {modoAvancado && (
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={etapaConfig.percentual}
                                onChange={(e) => handleUpdatePercentual(etapaPadrao.id, parseInt(e.target.value) || 1)}
                                className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white text-sm mt-1"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => handleUpdatePercentual(etapaPadrao.id, etapaConfig.percentual + 1)}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            disabled={etapaConfig.percentual >= 50}
                          >
                            <Plus className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Duração */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100/80">
                          Duração (semanas)
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateDuracao(etapaPadrao.id, etapaConfig.duracao - 1)}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            disabled={etapaConfig.duracao <= 1}
                          >
                            <Minus className="h-4 w-4 text-white" />
                          </button>
                          <div className="flex-1 text-center">
                            <div className="text-lg font-bold text-white">
                              {etapaConfig.duracao} sem
                            </div>
                            {modoAvancado && (
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={etapaConfig.duracao}
                                onChange={(e) => handleUpdateDuracao(etapaPadrao.id, parseInt(e.target.value) || 1)}
                                className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white text-sm mt-1"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => handleUpdateDuracao(etapaPadrao.id, etapaConfig.duracao + 1)}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            disabled={etapaConfig.duracao >= 20}
                          >
                            <Plus className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Dica */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-400 text-sm">💡</span>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">
              Metodologia Personalizada
            </h3>
            <p className="text-blue-100/70 text-sm leading-relaxed">
              Essa configuração será aplicada automaticamente a todos os novos projetos. 
              Você pode desativar etapas que não usa e ajustar percentuais conforme sua metodologia. 
              O ArcFlow usará esses dados para gerar cronogramas e orçamentos precisos.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex justify-between items-center pt-8 border-t border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link
          href="/onboarding/tipologias"
          className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
        >
          <motion.div
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
          <span>Voltar: Tipologias</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="text-blue-100/60 text-sm">
            Etapa 4 de 6
          </div>
          
          <Link
            href="/onboarding/parametros"
            className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
              isValid
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
            onClick={(e) => {
              if (!isValid) {
                e.preventDefault()
              }
            }}
          >
            <span>Próxima Etapa: Parâmetros</span>
            <motion.div
              animate={isValid ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  )
} 