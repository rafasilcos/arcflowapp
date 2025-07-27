'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Building2, 
  Palette, 
  Wrench, 
  Zap, 
  HardHat,
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Brain,
  Settings,
  Target,
  Users,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ModuloAEC {
  id: string
  nome: string
  descricao: string
  detalhes: string
  funcionalidades: string[]
  workflows: string[]
  automacoes: string[]
  icon: any
  color: string
  bgColor: string
  dependencias: string[]
  roiEsperado: string
  participacaoMercado: string
}

// 5 MÓDULOS PRINCIPAIS CONFORME BLUEPRINT ATUALIZADO
const modulosAEC: ModuloAEC[] = [
  {
    id: 'arquitetura-urbanismo',
    nome: 'Arquitetura e Urbanismo',
    descricao: 'Projetos arquitetônicos completos com briefing de 230 perguntas e IA especializada',
    detalhes: 'Desenvolvimento de projetos residenciais, comerciais, institucionais e urbanos com workflows NBR 13532',
    funcionalidades: [
      'Briefing inteligente 230 perguntas',
      'Workflows NBR 13532 (LV/PN/EP/AP/PE/AS)',
      'Análise IA de viabilidade',
      'Geração automática de programas',
      'Aprovações municipais automáticas',
      'Compatibilização multidisciplinar'
    ],
    workflows: ['NBR 13532', 'Metodologia Ágil', 'Workflows Personalizados'],
    automacoes: [
      'Briefing adaptativo por tipologia',
      'Programa de necessidades automático',
      'Cronograma NBR automático',
      'Análise de zoneamento IA',
      'Estimativa de custos',
      'Controle de revisões'
    ],
    icon: Building2,
    color: 'blue',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    dependencias: [],
    roiEsperado: '+45% margem',
    participacaoMercado: '35% do mercado'
  },
  {
    id: 'interiores-paisagismo',
    nome: 'Interiores e Paisagismo',
    descricao: 'Design de interiores e projetos paisagísticos integrados com cronograma unificado',
    detalhes: 'Projetos completos de interiores, decoração e paisagismo com integração automática à arquitetura',
    funcionalidades: [
      'Conceituação de interiores',
      'Especificação de materiais e mobiliário',
      'Projetos de paisagismo completos',
      'Iluminação interna e externa',
      'Gestão de fornecedores especializados',
      'Cronograma integrado multidisciplinar'
    ],
    workflows: ['Design Thinking', 'Cronograma Integrado', 'Gestão de Fornecedores'],
    automacoes: [
      'Compatibilização automática com arquitetura',
      'Orçamento unificado multidisciplinar',
      'Lista de materiais integrada',
      'Cronograma de execução otimizado',
      'Gestão de fornecedores automática',
      'Relatórios de progresso integrados'
    ],
    icon: Palette,
    color: 'pink',
    bgColor: 'from-pink-500/20 to-rose-500/20',
    dependencias: [],
    roiEsperado: '+55% valor agregado',
    participacaoMercado: '20% do mercado'
  },
  {
    id: 'engenharia-estrutural',
    nome: 'Engenharia Estrutural',
    descricao: 'Projetos estruturais com cálculos automáticos e compatibilização BIM',
    detalhes: 'Desenvolvimento de projetos estruturais em concreto armado, aço e madeira com automação de cálculos',
    funcionalidades: [
      'Análise estrutural automatizada',
      'Dimensionamento IA por tipologia',
      'Compatibilização automática',
      'Memoriais de cálculo automáticos',
      'Gestão de revisões técnicas',
      'ART automática integrada'
    ],
    workflows: ['Metodologia Ágil Estrutural', 'Templates Padronizados', 'Automação Cálculos'],
    automacoes: [
      'Pré-dimensionamento IA',
      'Compatibilização automática',
      'Memorial de cálculo gerado',
      'Detecção de interferências',
      'Cronograma integrado',
      'Controle de cargas automático'
    ],
    icon: Wrench,
    color: 'orange',
    bgColor: 'from-orange-500/20 to-red-500/20',
    dependencias: [],
    roiEsperado: '+60% produtividade',
    participacaoMercado: '20% do mercado'
  },
  {
    id: 'engenharia-instalacoes',
    nome: 'Engenharia de Instalações',
    descricao: 'Projetos de instalações elétricas, hidráulicas e AVAC com dimensionamento automático',
    detalhes: 'Projetos completos de instalações prediais com automação de dimensionamentos e análise energética',
    funcionalidades: [
      'Projetos elétricos (baixa/média tensão)',
      'Projetos hidrossanitários completos',
      'Projetos de climatização (AVAC)',
      'Dimensionamento automático por ambiente',
      'Análise de eficiência energética',
      'Lista de materiais automática'
    ],
    workflows: ['Automação Dimensionamentos', 'Templates NBR', 'Análise Energética'],
    automacoes: [
      'Dimensionamento automático por ambiente',
      'Análise energética IA',
      'Lista de materiais gerada',
      'Memoriais técnicos automáticos',
      'Integração com fornecedores',
      'Cronograma de instalação'
    ],
    icon: Zap,
    color: 'yellow',
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    dependencias: [],
    roiEsperado: '+50% agilidade',
    participacaoMercado: '15% do mercado'
  },
  {
    id: 'administracao-obras',
    nome: 'Administração de Obras',
    descricao: 'Gestão completa de obras com controle financeiro, fornecedores e cronograma físico',
    detalhes: 'Módulo completo para administração de obras com controle de custos, fornecedores, cronograma e qualidade',
    funcionalidades: [
      'Planejamento físico-financeiro',
      'Gestão completa de fornecedores',
      'Controle de medições automático',
      'Gestão de compras integrada',
      'Controle de qualidade',
      'Relatórios de obra automáticos'
    ],
    workflows: ['Lean Construction', 'Gestão Ágil de Obras', 'Controle de Qualidade'],
    automacoes: [
      'Orçamento baseado em projetos',
      'Cronograma físico automático',
      'Controle de desvios IA',
      'Gestão de fornecedores',
      'Medições automáticas',
      'Relatórios de progresso'
    ],
    icon: HardHat,
    color: 'green',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    dependencias: [],
    roiEsperado: '+70% controle',
    participacaoMercado: '10% do mercado'
  }
]

export default function PerfilPage() {
  const [modulosSelecionados, setModulosSelecionados] = useState<string[]>([])
  const [etapaAtual, setEtapaAtual] = useState<'selecao' | 'confirmacao'>('selecao')

  const handleToggleModulo = (moduloId: string) => {
    setModulosSelecionados(prev => 
      prev.includes(moduloId)
        ? prev.filter(id => id !== moduloId)
        : [...prev, moduloId]
    )
  }

  const modulosEscolhidos = modulosAEC.filter(m => modulosSelecionados.includes(m.id))
  const podeAvancar = modulosSelecionados.length > 0

  const getTipoEscritorio = () => {
    const modulos = modulosSelecionados
    
    if (modulos.length === 1) {
      if (modulos.includes('arquitetura-urbanismo')) {
        return {
          tipo: 'Escritório de Arquitetura',
          descricao: 'Foco exclusivo em projetos arquitetônicos',
          perfil: 'Especialista'
        }
      }
      if (modulos.includes('interiores-paisagismo')) {
        return {
          tipo: 'Escritório de Design',
          descricao: 'Especializado em interiores e paisagismo',
          perfil: 'Criativo'
        }
      }
      if (modulos.includes('engenharia-estrutural')) {
        return {
          tipo: 'Escritório de Estrutural',
          descricao: 'Especializado em projetos estruturais',
          perfil: 'Técnico'
        }
      }
      if (modulos.includes('engenharia-instalacoes')) {
        return {
          tipo: 'Escritório de Instalações',
          descricao: 'Especializado em projetos de instalações',
          perfil: 'Técnico'
        }
      }
      if (modulos.includes('administracao-obras')) {
        return {
          tipo: 'Administradora de Obras',
          descricao: 'Foco em gestão e execução de obras',
          perfil: 'Executivo'
        }
      }
    }
    
    if (modulos.includes('administracao-obras')) {
      return {
        tipo: 'Construtora com Projetos',
        descricao: 'Desenvolvimento de projetos + execução de obras',
        perfil: 'Completo'
      }
    }
    
    if (modulos.length >= 3) {
      return {
        tipo: 'Escritório Multidisciplinar',
        descricao: 'Múltiplas disciplinas integradas',
        perfil: 'Integrado'
      }
    }
    
    return {
      tipo: 'Escritório Especializado',
      descricao: 'Foco em disciplinas específicas',
      perfil: 'Especializado'
    }
  }

  const tipoDetectado = getTipoEscritorio()

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header Especializado */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {etapaAtual === 'selecao' ? 'Módulos do Seu Escritório' : 'Configuração dos Módulos'}
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-4xl mx-auto">
            {etapaAtual === 'selecao' 
              ? 'Selecione quais disciplinas/módulos seu escritório trabalha. O ArcFlow ativará apenas os módulos necessários para seu workflow. Escolha pelo menos 1 módulo.'
              : 'Confirme os módulos selecionados. O sistema configurará workflows, automações e funcionalidades específicas para cada disciplina.'
            }
          </p>
          
          {/* Detecção Automática do Tipo */}
          {modulosSelecionados.length > 0 && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="text-sm text-blue-200 mb-1">Tipo detectado automaticamente:</div>
              <div className="text-lg font-bold text-white">{tipoDetectado.tipo}</div>
              <div className="text-sm text-blue-100/70">{tipoDetectado.descricao}</div>
            </div>
          )}

          {/* Alerta se nenhum módulo selecionado */}
          {modulosSelecionados.length === 0 && etapaAtual === 'selecao' && (
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 max-w-2xl mx-auto border border-orange-500/20">
              <div className="flex items-center justify-center text-orange-300 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Selecione pelo menos 1 módulo</span>
              </div>
              <div className="text-xs text-orange-200/70">Escolha as disciplinas que seu escritório trabalha para configurar o sistema</div>
            </div>
          )}
        </motion.div>

        {etapaAtual === 'selecao' ? (
          /* Seleção de Módulos */
          <>
            <motion.div 
              className="max-w-4xl mx-auto space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {modulosAEC.map((modulo, index) => {
                const isSelected = modulosSelecionados.includes(modulo.id)
                
                return (
                  <motion.div
                    key={modulo.id}
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    onClick={() => handleToggleModulo(modulo.id)}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className={`relative bg-gradient-to-r ${modulo.bgColor} backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 ${
                      isSelected 
                        ? 'border-white/40 shadow-2xl ring-2 ring-white/20' 
                        : 'border-white/10 group-hover:border-white/20 group-hover:shadow-xl'
                    }`}>
                      
                      {/* Badge de Seleção */}
                      <div className="absolute -top-2 -right-2 flex gap-2">
                        {isSelected && (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Layout Horizontal */}
                      <div className="flex items-center gap-6">
                        
                        {/* Ícone e Info Principal */}
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 bg-gradient-to-r from-${modulo.color}-500 to-${modulo.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <modulo.icon className="h-8 w-8 text-white" />
                          </div>
                        </div>

                        {/* Conteúdo Principal */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                                {modulo.nome}
                              </h3>
                              <p className="text-white/70 text-sm leading-relaxed">
                                {modulo.descricao}
                              </p>
                            </div>
                            <div className="text-right ml-4 flex-shrink-0">
                              <div className="text-xs text-white/60 font-medium">{modulo.participacaoMercado}</div>
                              <div className="text-sm text-white/80 font-semibold">{modulo.roiEsperado}</div>
                            </div>
                          </div>

                          {/* Funcionalidades e Automações em Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Funcionalidades */}
                            <div>
                              <h4 className="text-xs font-semibold text-white/90 mb-2">🎯 Funcionalidades:</h4>
                              <div className="space-y-1">
                                {modulo.funcionalidades.slice(0, 3).map((func, idx) => (
                                  <div key={idx} className="flex items-center text-white/70 text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-2 text-green-400 flex-shrink-0" />
                                    <span className="leading-tight">{func}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Automações IA */}
                            <div>
                              <h4 className="text-xs font-semibold text-white/90 mb-2">🤖 Automações IA:</h4>
                              <div className="space-y-1">
                                {modulo.automacoes.slice(0, 3).map((auto, idx) => (
                                  <div key={idx} className="flex items-center text-white/70 text-xs">
                                    <Sparkles className="h-3 w-3 mr-2 text-blue-400 flex-shrink-0" />
                                    <span className="leading-tight">{auto}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div className="text-xs text-white/60">
                              {isSelected ? 'Selecionado' : 'Clique para ativar'}
                            </div>
                            <div className={`text-xs font-medium ${isSelected ? 'text-green-300' : 'text-blue-300'}`}>
                              {isSelected ? 'Ativo' : 'Inativo'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Summary e CTA */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {modulosSelecionados.length} Módulo(s) Selecionado(s)
                    </h3>
                    {modulosSelecionados.length > 0 && (
                      <>
                        <p className="text-white/70 text-sm mb-3">
                          Tipo: {tipoDetectado.tipo} • Perfil: {tipoDetectado.perfil}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {modulosEscolhidos.map((modulo) => (
                            <span key={modulo.id} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs">
                              {modulo.nome}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <motion.button
                    onClick={() => podeAvancar && setEtapaAtual('confirmacao')}
                    disabled={!podeAvancar}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                      podeAvancar 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl' 
                        : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={podeAvancar ? { scale: 1.02 } : {}}
                    whileTap={podeAvancar ? { scale: 0.98 } : {}}
                  >
                    Configurar Módulos
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          /* Confirmação dos Módulos */
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              
              {/* Header da Configuração */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Configuração dos Módulos</h2>
                <p className="text-white/80 leading-relaxed">
                  O ArcFlow ativará os módulos selecionados com workflows e automações específicas.
                </p>
              </div>

              {/* Tipo de Escritório Detectado */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Tipo de Escritório Detectado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">{tipoDetectado.tipo}</div>
                    <div className="text-xs text-white/70">Classificação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{tipoDetectado.perfil}</div>
                    <div className="text-xs text-white/70">Perfil</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">{modulosSelecionados.length}</div>
                    <div className="text-xs text-white/70">Módulos Ativos</div>
                  </div>
                </div>
              </div>

              {/* Módulos Configurados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {modulosEscolhidos.map((modulo, index) => (
                  <motion.div
                    key={modulo.id}
                    className={`bg-gradient-to-br ${modulo.bgColor} rounded-2xl p-6 border border-white/10`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r from-${modulo.color}-500 to-${modulo.color}-600 rounded-lg flex items-center justify-center mr-3`}>
                        <modulo.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{modulo.nome}</h3>
                        <div className="text-xs text-white/60">{modulo.roiEsperado}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-2">🔧 Workflows Ativados:</h4>
                        <div className="space-y-1">
                          {modulo.workflows.slice(0, 2).map((workflow, idx) => (
                            <div key={idx} className="flex items-center text-white/70 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-2 text-green-400" />
                              {workflow}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-2">🤖 Automações:</h4>
                        <div className="space-y-1">
                          {modulo.automacoes.slice(0, 2).map((auto, idx) => (
                            <div key={idx} className="flex items-center text-white/70 text-xs">
                              <Sparkles className="h-3 w-3 mr-2 text-blue-400" />
                              {auto}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ROI Esperado */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  ROI Esperado com Módulos Selecionados
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">+40%</div>
                    <div className="text-xs text-white/70">Produtividade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">+60%</div>
                    <div className="text-xs text-white/70">Qualidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">-30%</div>
                    <div className="text-xs text-white/70">Retrabalho</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">400%</div>
                    <div className="text-xs text-white/70">ROI 24 meses</div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => setEtapaAtual('selecao')}
                  className="flex items-center justify-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Ajustar Módulos
                </motion.button>
                
                <Link href="/onboarding/especializacao">
                  <motion.button
                    className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continuar Configuração
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Footer */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Início</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 1 de 8 • Módulos do Escritório
          </div>
          
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  )
} 