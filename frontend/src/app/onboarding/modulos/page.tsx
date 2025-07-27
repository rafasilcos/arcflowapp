'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Building2, 
  Palette, 
  Wrench, 
  Zap, 
  HardHat,
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Circle,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ModuloAEC {
  id: string
  nome: string
  descricao: string
  icon: any
  cor: string
  corFundo: string
  marketShare: number
  roiEsperado: string
  tempoImplementacao: string
  complexidade: 'Básica' | 'Intermediária' | 'Avançada'
  dependencias: string[]
  funcionalidades: string[]
  automacoes: string[]
  casos_uso: string[]
}

const modulosAEC: ModuloAEC[] = [
  {
    id: 'arquitetura_urbanismo',
    nome: 'Arquitetura e Urbanismo',
    descricao: 'Projetos arquitetônicos completos desde o briefing até a aprovação',
    icon: Building2,
    cor: 'from-blue-500 to-blue-600',
    corFundo: 'bg-blue-500/10',
    marketShare: 35,
    roiEsperado: '300-500%',
    tempoImplementacao: '2-3 semanas',
    complexidade: 'Intermediária',
    dependencias: [],
    funcionalidades: [
      'Briefing inteligente (230 perguntas)',
      'Fases NBR 13532 (LV, PN, EP, AP, PE, AS)',
      'Compatibilização automática',
      'Aprovações municipais',
      'Análise de viabilidade IA'
    ],
    automacoes: [
      'Geração automática de programa de necessidades',
      'Cronograma baseado em metodologia',
      'Estimativa de custos por m²',
      'Checklist de aprovações por município',
      'Controle de revisões versionado'
    ],
    casos_uso: [
      'Residencial unifamiliar e multifamiliar',
      'Comercial (lojas, escritórios, restaurantes)',
      'Institucional (escolas, hospitais, igrejas)',
      'Projetos urbanos e loteamentos'
    ]
  },
  {
    id: 'interiores_paisagismo',
    nome: 'Interiores e Paisagismo',
    descricao: 'Design de interiores e projetos paisagísticos integrados',
    icon: Palette,
    cor: 'from-green-500 to-green-600',
    corFundo: 'bg-green-500/10',
    marketShare: 20,
    roiEsperado: '250-400%',
    tempoImplementacao: '1-2 semanas',
    complexidade: 'Básica',
    dependencias: ['Recomendado com Arquitetura'],
    funcionalidades: [
      'Conceituação de ambientes',
      'Especificação de materiais e mobiliário',
      'Projeto de iluminação',
      'Paisagismo e irrigação',
      'Gestão de fornecedores especializados'
    ],
    automacoes: [
      'Paleta de cores automática',
      'Lista de compras integrada',
      'Cronograma de execução',
      'Orçamento por ambiente',
      'Compatibilização com arquitetura'
    ],
    casos_uso: [
      'Interiores residenciais completos',
      'Ambientes comerciais (lojas, restaurantes)',
      'Jardins residenciais e corporativos',
      'Paisagismo urbano'
    ]
  },
  {
    id: 'engenharia_estrutural',
    nome: 'Engenharia Estrutural',
    descricao: 'Cálculos estruturais e dimensionamento automatizado',
    icon: Wrench,
    cor: 'from-orange-500 to-orange-600',
    corFundo: 'bg-orange-500/10',
    marketShare: 20,
    roiEsperado: '400-600%',
    tempoImplementacao: '3-4 semanas',
    complexidade: 'Avançada',
    dependencias: ['Integração com Arquitetura'],
    funcionalidades: [
      'Análise de cargas automática',
      'Dimensionamento por IA',
      'Verificações NBR',
      'Memorial de cálculo automático',
      'Compatibilização 3D'
    ],
    automacoes: [
      'Detecção de interferências',
      'Otimização de seções',
      'Geração de plantas de forma',
      'Quantitativo de materiais',
      'Relatórios técnicos automáticos'
    ],
    casos_uso: [
      'Estruturas de concreto armado',
      'Estruturas metálicas',
      'Estruturas de madeira',
      'Fundações especiais'
    ]
  },
  {
    id: 'engenharia_instalacoes',
    nome: 'Engenharia de Instalações',
    descricao: 'Projetos elétricos, hidráulicos e sistemas prediais',
    icon: Zap,
    cor: 'from-yellow-500 to-yellow-600',
    corFundo: 'bg-yellow-500/10',
    marketShare: 15,
    roiEsperado: '350-550%',
    tempoImplementacao: '2-3 semanas',
    complexidade: 'Avançada',
    dependencias: ['Integração com Arquitetura'],
    funcionalidades: [
      'Instalações elétricas (BT/MT)',
      'Hidrossanitárias completas',
      'AVAC e climatização',
      'Automação predial',
      'SPDA e segurança'
    ],
    automacoes: [
      'Dimensionamento automático',
      'Cálculo de cargas térmicas',
      'Compatibilização entre sistemas',
      'Quantitativo de materiais',
      'Memoriais descritivos automáticos'
    ],
    casos_uso: [
      'Instalações residenciais',
      'Sistemas comerciais complexos',
      'Instalações industriais',
      'Automação residencial e predial'
    ]
  },
  {
    id: 'administracao_obras',
    nome: 'Administração de Obras',
    descricao: 'Gestão completa de obras do planejamento à entrega',
    icon: HardHat,
    cor: 'from-red-500 to-red-600',
    corFundo: 'bg-red-500/10',
    marketShare: 10,
    roiEsperado: '500-800%',
    tempoImplementacao: '1-2 semanas',
    complexidade: 'Intermediária',
    dependencias: ['Recomendado após projetos'],
    funcionalidades: [
      'Cronograma físico-financeiro',
      'Controle de medições',
      'Gestão de fornecedores',
      'Controle de qualidade',
      'Relatórios de progresso'
    ],
    automacoes: [
      'Medições automáticas por foto',
      'Alertas de prazo e orçamento',
      'Prestação de contas automática',
      'Controle de estoque',
      'Dashboard em tempo real'
    ],
    casos_uso: [
      'Obras residenciais',
      'Reformas e ampliações',
      'Construção comercial',
      'Acompanhamento técnico'
    ]
  }
]

export default function ModulosPage() {
  const [modulosSelecionados, setModulosSelecionados] = useState<string[]>([])
  const [moduloDetalhado, setModuloDetalhado] = useState<string | null>(null)
  const [tipoEscritorioDetectado, setTipoEscritorioDetectado] = useState<string>('')

  // Detecta automaticamente o tipo de escritório baseado nos módulos selecionados
  const detectarTipoEscritorio = (modulos: string[]) => {
    if (modulos.length === 0) return ''
    
    if (modulos.includes('arquitetura_urbanismo') && modulos.includes('interiores_paisagismo') && 
        modulos.includes('engenharia_estrutural') && modulos.includes('engenharia_instalacoes') && 
        modulos.includes('administracao_obras')) {
      return 'Escritório Completo AEC'
    }
    
    if (modulos.includes('arquitetura_urbanismo') && modulos.includes('interiores_paisagismo')) {
      return 'Escritório de Arquitetura e Design'
    }
    
    if (modulos.includes('engenharia_estrutural') && modulos.includes('engenharia_instalacoes')) {
      return 'Escritório de Engenharia'
    }
    
    if (modulos.includes('arquitetura_urbanismo') && modulos.includes('administracao_obras')) {
      return 'Escritório de Arquitetura com Obras'
    }
    
    if (modulos.length === 1) {
      const modulo = modulosAEC.find(m => m.id === modulos[0])
      return `Especialista em ${modulo?.nome}`
    }
    
    return 'Escritório Multidisciplinar'
  }

  const toggleModulo = (moduloId: string) => {
    const novosModulos = modulosSelecionados.includes(moduloId)
      ? modulosSelecionados.filter(id => id !== moduloId)
      : [...modulosSelecionados, moduloId]
    
    setModulosSelecionados(novosModulos)
    setTipoEscritorioDetectado(detectarTipoEscritorio(novosModulos))
  }

  const calcularROITotal = () => {
    if (modulosSelecionados.length === 0) return '0%'
    
    const roisMedios = modulosSelecionados.map(id => {
      const modulo = modulosAEC.find(m => m.id === id)
      if (!modulo) return 0
      const roi = modulo.roiEsperado.split('-')[0].replace('%', '')
      return parseInt(roi)
    })
    
    const roiMedio = roisMedios.reduce((acc, roi) => acc + roi, 0) / roisMedios.length
    const bonus = modulosSelecionados.length > 1 ? modulosSelecionados.length * 50 : 0
    
    return `${Math.round(roiMedio + bonus)}%`
  }

  const calcularMarketShare = () => {
    return modulosSelecionados.reduce((acc, id) => {
      const modulo = modulosAEC.find(m => m.id === id)
      return acc + (modulo?.marketShare || 0)
    }, 0)
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8">
        
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Módulos Especializados AEC
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-4xl mx-auto">
            Selecione os módulos que seu escritório utiliza. Cada módulo é especializado para um tipo de trabalho AEC, 
            com workflows, automações e IA específicas. <strong>Mínimo 1 módulo obrigatório.</strong>
          </p>
          
          {/* Barra de Progresso */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-blue-200">Etapa 2 de 8</span>
              <span className="text-xs text-blue-200">Módulos AEC</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 w-1/4" />
            </div>
          </div>
        </motion.div>

        {/* Resumo da Seleção */}
        {modulosSelecionados.length > 0 && (
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{modulosSelecionados.length}</div>
                <div className="text-sm text-white/60">Módulos Selecionados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{calcularROITotal()}</div>
                <div className="text-sm text-white/60">ROI Esperado</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{calcularMarketShare()}%</div>
                <div className="text-sm text-white/60">Cobertura de Mercado</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">{tipoEscritorioDetectado}</div>
                <div className="text-sm text-white/60">Tipo Detectado</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid de Módulos */}
        <motion.div
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {modulosAEC.map((modulo, index) => {
            const isSelected = modulosSelecionados.includes(modulo.id)
            const isDetailed = moduloDetalhado === modulo.id
            const Icon = modulo.icon

            return (
              <motion.div
                key={modulo.id}
                className={`bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border rounded-3xl p-6 transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-white/30 bg-white/10 shadow-2xl' 
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
                onClick={() => toggleModulo(modulo.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-6">
                  {/* Ícone e Seleção */}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 bg-gradient-to-r ${modulo.cor} rounded-2xl flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center justify-center">
                      {isSelected ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-white/40" />
                      )}
                    </div>
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{modulo.nome}</h3>
                        <p className="text-white/70 leading-relaxed">{modulo.descricao}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setModuloDetalhado(isDetailed ? null : modulo.id)
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Info className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{modulo.marketShare}%</div>
                        <div className="text-xs text-white/60">Market Share</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{modulo.roiEsperado}</div>
                        <div className="text-xs text-white/60">ROI Esperado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{modulo.tempoImplementacao}</div>
                        <div className="text-xs text-white/60">Implementação</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${
                          modulo.complexidade === 'Básica' ? 'text-green-400' :
                          modulo.complexidade === 'Intermediária' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {modulo.complexidade}
                        </div>
                        <div className="text-xs text-white/60">Complexidade</div>
                      </div>
                    </div>

                    {/* Dependências */}
                    {modulo.dependencias.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">Dependências:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {modulo.dependencias.map((dep, i) => (
                            <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-lg">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detalhes Expandidos */}
                    {isDetailed && (
                      <motion.div
                        className="mt-6 space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Funcionalidades */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            Funcionalidades Principais
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {modulo.funcionalidades.map((func, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                                <span className="text-xs text-white/70">{func}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Automações */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Automações IA
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {modulo.automacoes.map((auto, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-purple-400 flex-shrink-0" />
                                <span className="text-xs text-white/70">{auto}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Casos de Uso */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Casos de Uso
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {modulo.casos_uso.map((caso, i) => (
                              <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                                {caso}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Alerta se nenhum módulo selecionado */}
        {modulosSelecionados.length === 0 && (
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Selecione pelo menos 1 módulo</h3>
                <p className="text-yellow-300/80">Escolha os módulos que seu escritório trabalha para personalizar sua experiência no ArcFlow.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navegação */}
        <div className="flex justify-between items-center pt-8">
          <Link href="/onboarding/identificacao">
            <motion.button
              className="flex items-center px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Anterior
            </motion.button>
          </Link>

          <div className="text-center">
            <div className="text-xs text-white/60 mb-1">Seleção de módulos especializados</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === 2 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <Link href="/onboarding/tipologias">
            <motion.button
              disabled={modulosSelecionados.length === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                modulosSelecionados.length > 0
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={modulosSelecionados.length > 0 ? { scale: 1.02 } : {}}
              whileTap={modulosSelecionados.length > 0 ? { scale: 0.98 } : {}}
            >
              Continuar
              <ArrowRight className="h-5 w-5 ml-2" />
            </motion.button>
          </Link>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding/identificacao"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Identificação</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 2 de 8 • Módulos Especializados AEC
          </div>
          
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  )
} 