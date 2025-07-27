'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Building2, Home, Factory, School, Zap, 
  Check, X, AlertCircle, Info, Save, RefreshCw,
  Briefcase, Award, Target, Eye, DollarSign, Calculator,
  Edit3, Plus, Minus, Download, Upload,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Clock,
  TrendingUp,
  ArrowRight,
  Star,
  Lightbulb,
  CheckCircle
} from 'lucide-react'
// Removido EscritorioContext - usando novo sistema de configurações
import Link from 'next/link'
import { useTheme } from '../../../contexts/ThemeContext'
  import useConfiguracaoStore from '../../../stores/configuracaoStore'

// 💰 INTERFACE PARA CONFIGURAÇÕES DE PRECIFICAÇÃO
interface ConfiguracaoPrecificacao {
  disciplinas: {
    [key: string]: {
      nome: string
      valorPorM2: number
      valorPorHora: number
      horasEstimadas: number
      ativo: boolean
    }
  }
  multiplicadoresRegionais: {
    [key: string]: {
      nome: string
      multiplicador: number
    }
  }
  padroesConstrucao: {
    [key: string]: {
      nome: string
      multiplicador: number
      descricao: string
    }
  }
  custosIndiretos: {
    margemLucro: number
    overhead: number
    impostos: number
  }
}

// 🎯 CONFIGURAÇÃO PADRÃO DE PRECIFICAÇÃO
const CONFIGURACAO_PRECIFICACAO_PADRAO: ConfiguracaoPrecificacao = {
  disciplinas: {
    arquitetura: {
      nome: 'Projeto Arquitetônico',
      valorPorM2: 75,
      valorPorHora: 150,
      horasEstimadas: 110,
      ativo: true
    },
    modelagem3d: {
      nome: 'Modelagem 3D + 6 Renderizações',
      valorPorM2: 17,
      valorPorHora: 120,
      horasEstimadas: 45,
      ativo: true
    },
    aprovacao: {
      nome: 'Aprovação Prefeitura + Alvará',
      valorPorM2: 12,
      valorPorHora: 100,
      horasEstimadas: 35,
      ativo: true
    },
    estrutural: {
      nome: 'Projeto Estrutural',
      valorPorM2: 45,
      valorPorHora: 180,
      horasEstimadas: 88,
      ativo: false
    },
    instalacoes: {
      nome: 'Projetos de Instalações',
      valorPorM2: 35,
      valorPorHora: 160,
      horasEstimadas: 75,
      ativo: false
    },
    paisagismo: {
      nome: 'Projeto Paisagístico',
      valorPorM2: 25,
      valorPorHora: 140,
      horasEstimadas: 60,
      ativo: false
    }
  },
  multiplicadoresRegionais: {
    norte: { nome: 'Norte', multiplicador: 0.85 },
    nordeste: { nome: 'Nordeste', multiplicador: 0.90 },
    centro_oeste: { nome: 'Centro-Oeste', multiplicador: 0.95 },
    sudeste: { nome: 'Sudeste', multiplicador: 1.15 },
    sul: { nome: 'Sul', multiplicador: 1.05 }
  },
  padroesConstrucao: {
    simples: { nome: 'Simples', multiplicador: 0.7, descricao: 'Acabamentos básicos' },
    medio: { nome: 'Médio', multiplicador: 1.0, descricao: 'Acabamentos intermediários' },
    alto: { nome: 'Alto', multiplicador: 1.4, descricao: 'Acabamentos superiores' },
    luxo: { nome: 'Luxo', multiplicador: 1.8, descricao: 'Acabamentos premium' },
    premium: { nome: 'Premium', multiplicador: 2.5, descricao: 'Acabamentos exclusivos' }
  },
  custosIndiretos: {
    margemLucro: 15,
    overhead: 25,
    impostos: 12
  }
}

const ConfiguracoesPage: React.FC = () => {
  const { tema, temaId } = useTheme()
  const { configuracoes, obterSugestoes, exportarConfiguracoes, isLoading } = useConfiguracaoStore()
  
  const [mostrarSugestoes, setMostrarSugestoes] = useState(true)

  const sugestoes = obterSugestoes()

  const configuracoesModulos = [
    {
      key: 'empresa',
      titulo: 'Dados da Empresa',
      descricao: 'Configure informações básicas, endereço e responsáveis técnicos',
      icon: Building2,
      cor: 'blue',
      href: '/configuracoes/empresa',
      progresso: configuracoes.empresa.razaoSocial ? 85 : 25,
      status: configuracoes.empresa.razaoSocial && configuracoes.empresa.cnpj ? 'completo' : 'pendente'
    },
    {
      key: 'financeiro', 
      titulo: 'Configurações Financeiras',
      descricao: 'Impostos, precificação e condições de pagamento',
      icon: DollarSign,
      cor: 'green',
      href: '/configuracoes/financeiro', 
      progresso: configuracoes.financeira.tabelaPrecos.length > 0 ? 70 : 30,
      status: configuracoes.financeira.tabelaPrecos.length > 0 ? 'parcial' : 'pendente'
    },
    {
      key: 'prazos',
      titulo: 'Gestão de Prazos',
      descricao: 'Configure equipe, prazos base e multiplicadores de complexidade',
      icon: Clock,
      cor: 'purple',
      href: '/configuracoes/prazos',
      progresso: 80,
      status: 'completo'
    },
    {
      key: 'operacional',
      titulo: 'Configurações Operacionais', 
      descricao: 'Fluxo de trabalho, equipe e integrações',
      icon: User,
      cor: 'orange',
      href: '/configuracoes/operacional',
      progresso: configuracoes.operacional.membrosEquipe.length > 0 ? 60 : 15,
      status: 'pendente'
    },
    {
      key: 'projeto',
      titulo: 'Configurações de Projeto',
      descricao: 'Templates, padrões técnicos e entregáveis',
      icon: Award,
      cor: 'indigo',
      href: '/configuracoes/projeto',
      progresso: 25,
      status: 'pendente'
    },
    {
      key: 'seguranca',
      titulo: 'Segurança e Backup',
      descricao: 'Políticas de segurança, backup e LGPD',
      icon: Shield,
      cor: 'red',
      href: '/configuracoes/seguranca',
      progresso: configuracoes.seguranca.logAcesso ? 60 : 30,
      status: 'parcial'
    }
  ]

  const getCorPorStatus = (status: string) => {
    switch (status) {
      case 'completo':
        return temaId === 'elegante' ? 'text-green-600' : 'text-green-400'
      case 'parcial':
        return temaId === 'elegante' ? 'text-yellow-600' : 'text-yellow-400'
      default:
        return temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
    }
  }

  const getIconePorStatus = (status: string) => {
    switch (status) {
      case 'completo':
        return CheckCircle
      case 'parcial':
        return AlertCircle
      default:
        return Target
    }
  }

  const exportarTodasConfiguracoes = () => {
    const blob = exportarConfiguracoes()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arcflow-configuracoes-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const progressoGeral = Math.round(
    configuracoesModulos.reduce((acc, modulo) => acc + modulo.progresso, 0) / configuracoesModulos.length
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            temaId === 'elegante' 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg'
          }`}>
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Configurações do Sistema
            </h1>
            <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              Personalize completamente seu escritório ArcFlow
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportarTodasConfiguracoes}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              temaId === 'elegante'
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
                : 'text-white/70 hover:text-white hover:bg-white/10 border border-white/20'
            }`}>
            <Download className="w-4 h-4 inline mr-2" />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* Progresso Geral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
          temaId === 'elegante'
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-white/5 border-white/10'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Progresso da Configuração
            </h2>
            <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              {progressoGeral}% configurado
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg ${
              progressoGeral >= 80
                ? 'border-green-500 text-green-500'
                : progressoGeral >= 50
                ? 'border-yellow-500 text-yellow-500'
                : 'border-red-500 text-red-500'
            }`}>
              {progressoGeral}%
            </div>
          </div>
        </div>
        
        <div className={`w-full bg-gray-200 rounded-full h-3 ${temaId === 'elegante' ? '' : 'bg-white/10'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressoGeral}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              progressoGeral >= 80
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : progressoGeral >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          />
        </div>
      </motion.div>

      {/* Sugestões */}
      {sugestoes.length > 0 && mostrarSugestoes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
            temaId === 'elegante'
              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
              : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
          }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                temaId === 'elegante' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${temaId === 'elegante' ? 'text-yellow-800' : 'text-yellow-300'}`}>
                  💡 Sugestões Personalizadas
                </h3>
                <p className={`text-sm ${temaId === 'elegante' ? 'text-yellow-700' : 'text-yellow-400'}`}>
                  Recomendações baseadas no seu perfil de escritório
                </p>
              </div>
            </div>
            <button
              onClick={() => setMostrarSugestoes(false)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                temaId === 'elegante'
                  ? 'hover:bg-yellow-200 text-yellow-600'
                  : 'hover:bg-yellow-500/20 text-yellow-400'
              }`}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {sugestoes.map((sugestao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  temaId === 'elegante'
                    ? 'bg-white/50 border-yellow-200'
                    : 'bg-white/5 border-yellow-500/20'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    temaId === 'elegante' ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                                         <h4 className={`font-semibold mb-1 ${temaId === 'elegante' ? 'text-yellow-800' : 'text-yellow-300'}`}>
                       Campo: {sugestao.campo}
                     </h4>
                     <p className={`text-sm ${temaId === 'elegante' ? 'text-yellow-700' : 'text-yellow-400'}`}>
                       {sugestao.motivo}
                     </p>
                     {sugestao.impacto === 'alto' && (
                      <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                        temaId === 'elegante'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                                                 <TrendingUp className="w-3 h-3" />
                         Alto Impacto
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configuracoesModulos.map((modulo, index) => {
          const Icon = modulo.icon
          const StatusIcon = getIconePorStatus(modulo.status)
          
          return (
            <motion.div
              key={modulo.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={modulo.href}>
                <div className={`h-full p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  temaId === 'elegante'
                    ? 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      modulo.cor === 'blue' ? 'bg-blue-100 text-blue-600' :
                      modulo.cor === 'green' ? 'bg-green-100 text-green-600' :
                      modulo.cor === 'purple' ? 'bg-purple-100 text-purple-600' :
                      modulo.cor === 'orange' ? 'bg-orange-100 text-orange-600' :
                      modulo.cor === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <StatusIcon className={`w-5 h-5 ${getCorPorStatus(modulo.status)}`} />
                  </div>
                  
                  <h3 className={`text-lg font-bold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    {modulo.titulo}
                  </h3>
                  <p className={`text-sm mb-4 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    {modulo.descricao}
                  </p>
                  
                  {/* Barra de Progresso */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                        Progresso
                      </span>
                      <span className={`text-xs font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        {modulo.progresso}%
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${temaId === 'elegante' ? '' : 'bg-white/10'}`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          modulo.progresso >= 80 ? 'bg-green-500' :
                          modulo.progresso >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${modulo.progresso}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ConfiguracoesPage 