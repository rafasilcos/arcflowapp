'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  DollarSign, 
  TrendingUp,
  Calculator,
  Target,
  BarChart3,
  PieChart,
  Zap,
  Settings,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Briefcase,
  Clock,
  Users
} from 'lucide-react'

// Interfaces
interface PrecificacaoInteligente {
  precosPorTipologia: Record<string, PrecoTipologia>
  margemLucro: number
  modalidadeCobranca: 'por_etapa' | 'valor_total' | 'hibrido'
  descontosProgressivos: boolean
  reajusteAnual: number
  metodoCalculoBase: 'mercado' | 'custos' | 'valor_agregado'
  configuracaoAvancada: ConfiguracaoAvancada
}

interface PrecoTipologia {
  precoBase: number
  multiplicadorComplexidade: number
  valorPorM2: number
  precoMinimo: number
  precoMaximo: number
  modalidadePrincipal: 'valor_fixo' | 'por_m2' | 'por_etapa'
}

interface ConfiguracaoAvancada {
  bonificacaoVolume: number
  descontoPagamentoVista: number
  multaAtraso: number
  valorHoraConsultoria: number
  percentualRevisao: number
}

// Base de dados de mercado (valores referenciais Brasil 2024)
const DADOS_MERCADO = {
  'residencial-unifamiliar': {
    nome: 'Residencial Unifamiliar',
    faixaPreco: { min: 8500, max: 35000 },
    precoM2: { min: 45, max: 180 },
    complexidade: {
      'Baixa': { multiplicador: 0.8, exemplos: ['Casa simples até 150m²', 'Terreno plano', 'Programa básico'] },
      'Média': { multiplicador: 1.0, exemplos: ['Casa 150-300m²', 'Programa completo', 'Terreno regular'] },
      'Alta': { multiplicador: 1.5, exemplos: ['Casa >300m²', 'Terreno complexo', 'Alto padrão'] }
    },
    tempoMedio: 60, // dias
    margemSugerida: 65
  },
  'residencial-multifamiliar': {
    nome: 'Residencial Multifamiliar',
    faixaPreco: { min: 25000, max: 150000 },
    precoM2: { min: 35, max: 120 },
    complexidade: {
      'Baixa': { multiplicador: 0.9, exemplos: ['Até 4 pavimentos', 'Programa simples'] },
      'Média': { multiplicador: 1.0, exemplos: ['5-10 pavimentos', 'Programa completo'] },
      'Alta': { multiplicador: 1.4, exemplos: ['>10 pavimentos', 'Torres múltiplas'] }
    },
    tempoMedio: 120,
    margemSugerida: 70
  },
  'comercial-escritorios': {
    nome: 'Comercial - Escritórios',
    faixaPreco: { min: 15000, max: 80000 },
    precoM2: { min: 55, max: 200 },
    complexidade: {
      'Baixa': { multiplicador: 0.9, exemplos: ['Escritório simples', 'Layout básico'] },
      'Média': { multiplicador: 1.0, exemplos: ['Corporativo médio', 'Múltiplos ambientes'] },
      'Alta': { multiplicador: 1.3, exemplos: ['Sede empresarial', 'Alta tecnologia'] }
    },
    tempoMedio: 75,
    margemSugerida: 68
  },
  'estrutural-residencial': {
    nome: 'Estrutural - Residencial',
    faixaPreco: { min: 3500, max: 18000 },
    precoM2: { min: 18, max: 85 },
    complexidade: {
      'Baixa': { multiplicador: 0.8, exemplos: ['Estrutura simples', 'Vãos pequenos'] },
      'Média': { multiplicador: 1.0, exemplos: ['Estrutura convencional', 'Vãos médios'] },
      'Alta': { multiplicador: 1.4, exemplos: ['Grandes vãos', 'Estrutura especial'] }
    },
    tempoMedio: 30,
    margemSugerida: 60
  }
}

export default function PrecificacaoInteligente() {
  const router = useRouter()
  const [formData, setFormData] = useState<PrecificacaoInteligente>({
    precosPorTipologia: {},
    margemLucro: 65,
    modalidadeCobranca: 'hibrido',
    descontosProgressivos: true,
    reajusteAnual: 6.5,
    metodoCalculoBase: 'mercado',
    configuracaoAvancada: {
      bonificacaoVolume: 10,
      descontoPagamentoVista: 5,
      multaAtraso: 2,
      valorHoraConsultoria: 150,
      percentualRevisao: 15
    }
  })

  const [tipologiasSelecionadas, setTipologiasSelecionadas] = useState<string[]>([])
  const [dadosCompletos, setDadosCompletos] = useState<any>({})
  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])
  const [receitaProjetada, setReceitaProjetada] = useState<any>({})

  useEffect(() => {
    // Carregar dados das etapas anteriores
    const dadosAnteriores = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosAnteriores) {
      const dados = JSON.parse(dadosAnteriores)
      setDadosCompletos(dados)
      
      if (dados.tipologias?.tipologiasSelecionadas) {
        const tipologias = dados.tipologias.tipologiasSelecionadas
        setTipologiasSelecionadas(tipologias)
        configurarPrecosAutomaticos(tipologias, dados)
        gerarSugestoesIA(dados, tipologias)
        calcularReceitaProjetada(tipologias, dados)
      }
    }
  }, [])

  const configurarPrecosAutomaticos = (tipologias: string[], dadosCompletos: any) => {
    const precosConfigurados: Record<string, PrecoTipologia> = {}
    
    tipologias.forEach(tipologia => {
      const dadosMercado = DADOS_MERCADO[tipologia as keyof typeof DADOS_MERCADO]
      if (dadosMercado) {
        // Ajustar preços baseado no porte do escritório
        const porte = dadosCompletos?.identificacao?.porte
        let fatorPorte = 1.0
        
        if (porte === 'Solo') fatorPorte = 0.85
        else if (porte === 'Pequeno') fatorPorte = 0.95
        else if (porte === 'Grande') fatorPorte = 1.15
        
        // Ajustar baseado na localização (simulado)
        const estado = dadosCompletos?.identificacao?.localizacao?.estado
        let fatorRegiao = 1.0
        if (estado === 'SP' || estado === 'RJ') fatorRegiao = 1.2
        else if (estado === 'MG' || estado === 'PR' || estado === 'RS') fatorRegiao = 1.0
        else fatorRegiao = 0.9
        
        const precoMedio = (dadosMercado.faixaPreco.min + dadosMercado.faixaPreco.max) / 2
        const precoAjustado = precoMedio * fatorPorte * fatorRegiao
        
        precosConfigurados[tipologia] = {
          precoBase: Math.round(precoAjustado),
          multiplicadorComplexidade: 1.0,
          valorPorM2: Math.round(((dadosMercado.precoM2.min + dadosMercado.precoM2.max) / 2) * fatorPorte * fatorRegiao),
          precoMinimo: Math.round(dadosMercado.faixaPreco.min * fatorPorte * fatorRegiao),
          precoMaximo: Math.round(dadosMercado.faixaPreco.max * fatorPorte * fatorRegiao),
          modalidadePrincipal: 'valor_fixo'
        }
      }
    })
    
    setFormData(prev => ({
      ...prev,
      precosPorTipologia: precosConfigurados
    }))
  }

  const gerarSugestoesIA = (dadosCompletos: any, tipologias: string[]) => {
    const sugestoes: string[] = []
    
    const faturamento = dadosCompletos?.identificacao?.faturamentoMensal || 0
    const porte = dadosCompletos?.identificacao?.porte
    
    if (faturamento < 50000) {
      sugestoes.push('💰 Seu faturamento indica potencial para crescer 200% com precificação adequada.')
    }
    
    if (dadosCompletos?.metodologia?.maioresDificuldades?.includes('Definir preços justos e competitivos')) {
      sugestoes.push('🎯 Detectamos dificuldade com preços: Nossa IA calculou valores de mercado personalizados.')
    }
    
    if (porte === 'Solo') {
      sugestoes.push('👤 Para escritórios solo: Recomendamos cobrança por etapas para melhor fluxo de caixa.')
    }
    
    if (tipologias.length > 2) {
      sugestoes.push('📊 Múltiplas tipologias: Configure pacotes integrados para aumentar ticket médio.')
    }
    
    const estado = dadosCompletos?.identificacao?.localizacao?.estado
    if (estado === 'SP' || estado === 'RJ') {
      sugestoes.push('🌆 Mercado de alto valor: Seus preços foram ajustados para a realidade local (+20%).')
    }
    
    if (dadosCompletos?.metodologia?.percentualAtrasos > 40) {
      sugestoes.push('⏰ Alto índice de atrasos: Configure multas por atraso para proteger sua rentabilidade.')
    }

    setSugestoesIA(sugestoes)
  }

  const calcularReceitaProjetada = (tipologias: string[], dadosCompletos: any) => {
    let receitaMensal = 0
    let projetosPrevistos = 0
    let margemMedia = 0
    
    tipologias.forEach(tipologia => {
      const dadosMercado = DADOS_MERCADO[tipologia as keyof typeof DADOS_MERCADO]
      if (dadosMercado) {
        const precoMedio = (dadosMercado.faixaPreco.min + dadosMercado.faixaPreco.max) / 2
        const tempoMedio = dadosMercado.tempoMedio
        const projetosPorMes = 30 / tempoMedio // Aproximação
        
        receitaMensal += precoMedio * projetosPorMes
        projetosPrevistos += projetosPorMes
        margemMedia += dadosMercado.margemSugerida
      }
    })
    
    setReceitaProjetada({
      receitaMensal: Math.round(receitaMensal),
      projetosPorMes: Math.round(projetosPrevistos * 10) / 10,
      margemMedia: Math.round(margemMedia / tipologias.length),
      crescimentoProjetado: Math.round(((receitaMensal / (dadosCompletos?.identificacao?.faturamentoMensal || 1)) - 1) * 100)
    })
  }

  const handlePrecoChange = (tipologia: string, campo: keyof PrecoTipologia, valor: number) => {
    setFormData(prev => ({
      ...prev,
      precosPorTipologia: {
        ...prev.precosPorTipologia,
        [tipologia]: {
          ...prev.precosPorTipologia[tipologia],
          [campo]: valor
        }
      }
    }))
  }

  const handleVoltar = () => {
    router.push('/onboarding/v3/workflow')
  }

  const handleContinuar = () => {
    // Salvar dados
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      precificacao: formData
    }))
    
    router.push('/onboarding/v3/personalizacao')
  }

  const isFormValid = () => {
    return Object.keys(formData.precosPorTipologia).length > 0 && formData.margemLucro > 0
  }

  const calcularTicketMedio = () => {
    const precos = Object.values(formData.precosPorTipologia)
    if (precos.length === 0) return 0
    
    const soma = precos.reduce((acc, preco) => acc + preco.precoBase, 0)
    return Math.round(soma / precos.length)
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoltar}
              className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="w-px h-6 bg-white/20"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">Precificação Inteligente</h1>
              <p className="text-blue-200/70">Etapa 6 de 8</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-blue-100">75% Concluído</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-[75%] transition-all duration-1000"></div>
          </div>
        </motion.div>

        {/* Cards IA e Preview no Topo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* IA Helper */}
          <motion.div
            className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">IA do ArcFlow</h3>
            </div>
            
            {sugestoesIA.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-purple-300 font-medium">
                  Análise inteligente de precificação:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Analisando dados de mercado e seu perfil para configurar precificação inteligente...
              </p>
            )}
          </motion.div>

          {/* Projeção Financeira */}
          {receitaProjetada.receitaMensal > 0 ? (
            <motion.div
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Projeção de Receita</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      R$ {receitaProjetada.receitaMensal?.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-blue-100/60">Receita Mensal Projetada</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{receitaProjetada.projetosPorMes}</div>
                    <div className="text-xs text-blue-100/60">Projetos/Mês</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{receitaProjetada.margemMedia}%</div>
                  <div className="text-xs text-blue-100/60">Margem Média</div>
                </div>
                
                {receitaProjetada.crescimentoProjetado > 0 && (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
                    <p className="text-sm text-green-300 font-medium text-center">
                      🚀 Crescimento projetado: +{receitaProjetada.crescimentoProjetado}%
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Projeção de Receita</h3>
                <p className="text-sm text-gray-300/70">
                  Configure preços para ver projeções
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conteúdo Principal - Largura Total */}
        <div className="space-y-6">
          {/* Configuração de Preços por Tipologia */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Preços Inteligentes por Tipologia</h3>
                <p className="text-blue-100/70 text-sm">
                  Baseado em dados de mercado 2024 | Ajustado para sua região e porte
                </p>
              </div>
            </div>

            {tipologiasSelecionadas.length > 0 ? (
              <div className="space-y-6">
                {tipologiasSelecionadas.map((tipologia) => {
                  const dadosMercado = DADOS_MERCADO[tipologia as keyof typeof DADOS_MERCADO]
                  const precoConfig = formData.precosPorTipologia[tipologia]
                  
                  if (!dadosMercado || !precoConfig) return null
                  
                  return (
                    <motion.div
                      key={tipologia}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="font-bold text-white text-lg">{dadosMercado.nome}</h4>
                          <p className="text-blue-100/70 text-sm">
                            Mercado: R$ {dadosMercado.faixaPreco.min.toLocaleString('pt-BR')} - R$ {dadosMercado.faixaPreco.max.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            R$ {precoConfig.precoBase.toLocaleString('pt-BR')}
                          </div>
                          <div className="text-xs text-blue-100/60">Preço Configurado</div>
                        </div>
                      </div>

                      {/* Configurações de Preço */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-sm font-medium text-blue-100 mb-2 block">
                            Preço Base
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                            <input
                              type="number"
                              value={precoConfig.precoBase}
                              onChange={(e) => handlePrecoChange(tipologia, 'precoBase', Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-blue-100 mb-2 block">
                            Valor por m²
                          </label>
                          <div className="relative">
                            <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                            <input
                              type="number"
                              value={precoConfig.valorPorM2}
                              onChange={(e) => handlePrecoChange(tipologia, 'valorPorM2', Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-blue-100 mb-2 block">
                            Multiplicador Complexidade
                          </label>
                          <select
                            value={precoConfig.multiplicadorComplexidade}
                            onChange={(e) => handlePrecoChange(tipologia, 'multiplicadorComplexidade', Number(e.target.value))}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                          >
                            <option value={0.8} className="bg-slate-800">Baixa (0.8x)</option>
                            <option value={1.0} className="bg-slate-800">Média (1.0x)</option>
                            <option value={1.3} className="bg-slate-800">Alta (1.3x)</option>
                            <option value={1.5} className="bg-slate-800">Premium (1.5x)</option>
                          </select>
                        </div>
                      </div>

                      {/* Indicadores de Complexidade */}
                      <div className="mt-4 p-4 bg-white/5 rounded-xl">
                        <h5 className="font-semibold text-white text-sm mb-3">Indicadores de Complexidade:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {Object.entries(dadosMercado.complexidade).map(([nivel, info]: [string, any]) => (
                            <div
                              key={nivel}
                              className={`p-3 rounded-lg border ${
                                precoConfig.multiplicadorComplexidade === info.multiplicador
                                  ? 'bg-blue-500/20 border-blue-400/30'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="font-semibold text-white mb-1">{nivel}</div>
                              <div className="text-blue-100/70 space-y-1">
                                {info.exemplos.map((exemplo: string, idx: number) => (
                                  <div key={idx}>• {exemplo}</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Nenhuma tipologia selecionada</h4>
                <p className="text-blue-100/70 text-sm">
                  Volte para as etapas anteriores e configure suas tipologias
                </p>
              </div>
            )}
          </motion.div>

          {/* Configurações Avançadas */}
          {Object.keys(formData.precosPorTipologia).length > 0 && (
            <motion.div
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Estratégias de Precificação</h3>
                  <p className="text-blue-100/70 text-sm">Configurações avançadas para maximizar receita</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Margem de Lucro</h4>
                  <div className="mb-3">
                    <input
                      type="range"
                      min="30"
                      max="80"
                      value={formData.margemLucro}
                      onChange={(e) => setFormData(prev => ({ ...prev, margemLucro: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-center text-2xl font-bold text-green-400">{formData.margemLucro}%</div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Modalidade Cobrança</h4>
                  <select
                    value={formData.modalidadeCobranca}
                    onChange={(e) => setFormData(prev => ({ ...prev, modalidadeCobranca: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
                  >
                    <option value="por_etapa" className="bg-slate-800">Por Etapa</option>
                    <option value="valor_total" className="bg-slate-800">Valor Total</option>
                    <option value="hibrido" className="bg-slate-800">Híbrido</option>
                  </select>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Desc. Pagamento à Vista</h4>
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={formData.configuracaoAvancada.descontoPagamentoVista}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        configuracaoAvancada: { 
                          ...prev.configuracaoAvancada, 
                          descontoPagamentoVista: Number(e.target.value) 
                        }
                      }))}
                      className="w-full"
                    />
                    <div className="text-center text-xl font-bold text-yellow-400">
                      {formData.configuracaoAvancada.descontoPagamentoVista}%
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Valor/Hora Consultoria</h4>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input
                      type="number"
                      value={formData.configuracaoAvancada.valorHoraConsultoria}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        configuracaoAvancada: { 
                          ...prev.configuracaoAvancada, 
                          valorHoraConsultoria: Number(e.target.value) 
                        }
                      }))}
                      className="w-full pl-8 pr-2 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resumo Financeiro */}
          {Object.keys(formData.precosPorTipologia).length > 0 && (
            <motion.div
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Resumo da Configuração</h3>
                  <p className="text-blue-100/70 text-sm">Análise final da precificação inteligente</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-2xl">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    R$ {calcularTicketMedio().toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-blue-100/60">Ticket Médio</div>
                </div>
                
                <div className="text-center p-6 bg-white/5 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{formData.margemLucro}%</div>
                  <div className="text-sm text-blue-100/60">Margem Configurada</div>
                </div>
                
                <div className="text-center p-6 bg-white/5 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {tipologiasSelecionadas.length}
                  </div>
                  <div className="text-sm text-blue-100/60">Tipologias Configuradas</div>
                </div>
                
                <div className="text-center p-6 bg-white/5 rounded-2xl">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    R$ {formData.configuracaoAvancada.valorHoraConsultoria}
                  </div>
                  <div className="text-sm text-blue-100/60">Valor/Hora</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Botão Continuar */}
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={handleContinuar}
              disabled={!isFormValid()}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>Continuar para Personalização</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}