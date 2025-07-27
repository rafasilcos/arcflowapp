'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Building2,
  Factory,
  Home,
  ShoppingBag,
  GraduationCap,
  Heart,
  Users,
  Briefcase,
  TreePine,
  Lightbulb,
  Sparkles,
  Target,
  Settings
} from 'lucide-react'

// Interfaces
interface TipologiasInteligentes {
  tipologiasSelecionadas: string[]
  porcentagemPorTipologia: Record<string, number>
  complexidadeMedia: 'Baixa' | 'Média' | 'Alta'
  ticketMedioPorTipologia: Record<string, number>
  tempoMedioPorTipologia: Record<string, number>
  especializacoesPrincipais: string[]
}

// Tipologias por disciplina
const TIPOLOGIAS_POR_DISCIPLINA = {
  arquitetura: [
    { id: 'residencial-unifamiliar', nome: 'Residencial Unifamiliar', icon: Home, complexidade: 'Média', tempoMedio: 4 },
    { id: 'residencial-multifamiliar', nome: 'Residencial Multifamiliar', icon: Building2, complexidade: 'Alta', tempoMedio: 8 },
    { id: 'comercial-varejo', nome: 'Comercial - Varejo', icon: ShoppingBag, complexidade: 'Média', tempoMedio: 6 },
    { id: 'comercial-escritorios', nome: 'Comercial - Escritórios', icon: Briefcase, complexidade: 'Alta', tempoMedio: 10 },
    { id: 'institucional-educacao', nome: 'Institucional - Educação', icon: GraduationCap, complexidade: 'Alta', tempoMedio: 12 },
    { id: 'institucional-saude', nome: 'Institucional - Saúde', icon: Heart, complexidade: 'Alta', tempoMedio: 14 },
    { id: 'lazer-cultura', nome: 'Lazer e Cultura', icon: Users, complexidade: 'Alta', tempoMedio: 10 },
    { id: 'paisagismo', nome: 'Paisagismo', icon: TreePine, complexidade: 'Média', tempoMedio: 6 }
  ],
  estrutural: [
    { id: 'estrutural-residencial', nome: 'Estrutural - Residencial', icon: Home, complexidade: 'Média', tempoMedio: 3 },
    { id: 'estrutural-comercial', nome: 'Estrutural - Comercial', icon: Building2, complexidade: 'Alta', tempoMedio: 6 },
    { id: 'estrutural-industrial', nome: 'Estrutural - Industrial', icon: Factory, complexidade: 'Alta', tempoMedio: 8 },
    { id: 'estrutural-infraestrutura', nome: 'Estrutural - Infraestrutura', icon: Settings, complexidade: 'Alta', tempoMedio: 10 }
  ],
  hidraulica: [
    { id: 'hidraulica-residencial', nome: 'Hidráulica - Residencial', icon: Home, complexidade: 'Baixa', tempoMedio: 2 },
    { id: 'hidraulica-comercial', nome: 'Hidráulica - Comercial', icon: Building2, complexidade: 'Média', tempoMedio: 4 },
    { id: 'hidraulica-industrial', nome: 'Hidráulica - Industrial', icon: Factory, complexidade: 'Alta', tempoMedio: 6 }
  ],
  eletrica: [
    { id: 'eletrica-residencial', nome: 'Elétrica - Residencial', icon: Home, complexidade: 'Baixa', tempoMedio: 2 },
    { id: 'eletrica-comercial', nome: 'Elétrica - Comercial', icon: Building2, complexidade: 'Média', tempoMedio: 4 },
    { id: 'eletrica-industrial', nome: 'Elétrica - Industrial', icon: Factory, complexidade: 'Alta', tempoMedio: 6 }
  ],
  ambiental: [
    { id: 'licenciamento-ambiental', nome: 'Licenciamento Ambiental', icon: TreePine, complexidade: 'Alta', tempoMedio: 8 },
    { id: 'estudos-impacto', nome: 'Estudos de Impacto', icon: Settings, complexidade: 'Alta', tempoMedio: 12 },
    { id: 'gestao-residuos', nome: 'Gestão de Resíduos', icon: Factory, complexidade: 'Média', tempoMedio: 4 }
  ],
  consultoria: [
    { id: 'viabilidade-tecnica', nome: 'Viabilidade Técnica', icon: Target, complexidade: 'Média', tempoMedio: 3 },
    { id: 'gerenciamento-obras', nome: 'Gerenciamento de Obras', icon: Settings, complexidade: 'Alta', tempoMedio: 6 },
    { id: 'consultoria-tecnica', nome: 'Consultoria Técnica', icon: Lightbulb, complexidade: 'Média', tempoMedio: 4 }
  ]
}

export default function TipologiasInteligentes() {
  const router = useRouter()
  const [formData, setFormData] = useState<TipologiasInteligentes>({
    tipologiasSelecionadas: [],
    porcentagemPorTipologia: {},
    complexidadeMedia: 'Média',
    ticketMedioPorTipologia: {},
    tempoMedioPorTipologia: {},
    especializacoesPrincipais: []
  })

  const [disciplinasAtivas, setDisciplinasAtivas] = useState<string[]>([])
  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])
  const [tipologiasDisponiveis, setTipologiasDisponiveis] = useState<any[]>([])

  useEffect(() => {
    // Carregar dados das etapas anteriores
    const dadosAnteriores = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosAnteriores) {
      const dados = JSON.parse(dadosAnteriores)
      
      // Extrair disciplinas ativas da etapa 2
      if (dados.perfilTecnico?.disciplinasAtivas) {
        const disciplinasAtivasArray = Object.keys(dados.perfilTecnico.disciplinasAtivas)
          .filter(id => dados.perfilTecnico.disciplinasAtivas[id]?.ativa)
        
        setDisciplinasAtivas(disciplinasAtivasArray)
        gerarTipologiasDisponiveis(disciplinasAtivasArray)
        gerarSugestoesIA(dados, disciplinasAtivasArray)
      }
    }
  }, [])

  const gerarTipologiasDisponiveis = (disciplinas: string[]) => {
    let todasTipologias: any[] = []
    
    disciplinas.forEach(disciplina => {
      const tipologiasDisciplina = TIPOLOGIAS_POR_DISCIPLINA[disciplina as keyof typeof TIPOLOGIAS_POR_DISCIPLINA] || []
      todasTipologias = [...todasTipologias, ...tipologiasDisciplina]
    })
    
    // Remover duplicatas baseado no ID
    const tipologiasUnicas = todasTipologias.filter((tipologia, index, self) => 
      index === self.findIndex(t => t.id === tipologia.id)
    )
    
    setTipologiasDisponiveis(tipologiasUnicas)
  }

  const gerarSugestoesIA = (dadosAnteriores: any, disciplinas: string[]) => {
    const sugestoes: string[] = []
    
    if (disciplinas.includes('arquitetura')) {
      sugestoes.push('💡 Para arquitetura, recomendamos começar com Residencial Unifamiliar - é onde a maioria dos escritórios ganha experiência.')
    }
    
    if (disciplinas.includes('estrutural')) {
      sugestoes.push('🏗️ Projetos estruturais comerciais têm maior margem de lucro que residenciais.')
    }
    
    if (disciplinas.length > 2) {
      sugestoes.push('⚡ Escritórios multidisciplinares conseguem maior ticket médio oferecendo soluções completas.')
    }
    
    const porte = dadosAnteriores?.identificacao?.porte
    if (porte === 'Solo') {
      sugestoes.push('👤 Para escritórios solo, tipologias residenciais são mais eficientes no início.')
    }
    
    if (dadosAnteriores?.metodologia?.maioresDificuldades?.includes('Definir preços justos e competitivos')) {
      sugestoes.push('💰 Vamos configurar precificação automática baseada na complexidade de cada tipologia.')
    }

    setSugestoesIA(sugestoes)
  }

  const handleTipologiaChange = (tipologiaId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          tipologiasSelecionadas: [...prev.tipologiasSelecionadas, tipologiaId]
        }
      } else {
        return {
          ...prev,
          tipologiasSelecionadas: prev.tipologiasSelecionadas.filter(id => id !== tipologiaId)
        }
      }
    })
  }

  const handleVoltar = () => {
    router.push('/onboarding/v3/metodologia')
  }

  const handleContinuar = () => {
    // Salvar dados
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      tipologias: formData
    }))
    
    router.push('/onboarding/v3/workflow')
  }

  const isFormValid = () => {
    return formData.tipologiasSelecionadas.length > 0
  }

  const calcularComplexidadeMedia = () => {
    if (formData.tipologiasSelecionadas.length === 0) return 'Média'
    
    const tipologiasSelecionadasData = tipologiasDisponiveis.filter(t => 
      formData.tipologiasSelecionadas.includes(t.id)
    )
    
    const complexidades = tipologiasSelecionadasData.map(t => {
      switch(t.complexidade) {
        case 'Baixa': return 1
        case 'Média': return 2  
        case 'Alta': return 3
        default: return 2
      }
    })
    
    const media = complexidades.reduce((a, b) => a + b, 0) / complexidades.length
    
    if (media <= 1.5) return 'Baixa'
    if (media <= 2.5) return 'Média'
    return 'Alta'
  }

  const calcularTempoMedio = () => {
    if (formData.tipologiasSelecionadas.length === 0) return 0
    
    const tipologiasSelecionadasData = tipologiasDisponiveis.filter(t => 
      formData.tipologiasSelecionadas.includes(t.id)
    )
    
    const tempos = tipologiasSelecionadasData.map(t => t.tempoMedio)
    return Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
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
              <h1 className="text-2xl font-bold text-white">Tipologias Inteligentes</h1>
              <p className="text-blue-200/70">Etapa 4 de 8</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-blue-100">50% Concluído</span>
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
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-[50%] transition-all duration-1000"></div>
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
                  Sugestões baseadas no seu perfil:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Selecione tipologias para receber sugestões inteligentes baseadas no seu perfil técnico.
              </p>
            )}
          </motion.div>

          {/* Preview da Configuração */}
          {formData.tipologiasSelecionadas.length > 0 ? (
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Análise das Tipologias</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formData.tipologiasSelecionadas.length}</div>
                    <div className="text-xs text-blue-100/60">Tipologias Selecionadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{calcularComplexidadeMedia()}</div>
                    <div className="text-xs text-blue-100/60">Complexidade Média</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{calcularTempoMedio()} meses</div>
                  <div className="text-xs text-blue-100/60">Tempo Médio por Projeto</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
                  <p className="text-sm text-green-300 font-medium">
                    🎯 Sistema configurará workflows específicos para cada tipologia
                  </p>
                </div>
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
                  <Layers className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Análise das Tipologias</h3>
                <p className="text-sm text-gray-300/70">
                  Selecione tipologias para ver a análise
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conteúdo Principal - Largura Total */}
        <div className="space-y-6">
          {/* Tipologias Disponíveis */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Tipologias de Projetos</h3>
                <p className="text-blue-100/70 text-sm">
                  Baseado nas suas disciplinas: {disciplinasAtivas.join(', ')} (Múltiplas seleções permitidas)
                </p>
              </div>
            </div>

            {tipologiasDisponiveis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tipologiasDisponiveis.map((tipologia) => {
                  const IconComponent = tipologia.icon
                  const isSelected = formData.tipologiasSelecionadas.includes(tipologia.id)
                  const complexidadeColor: Record<string, string> = {
                    'Baixa': 'text-green-400',
                    'Média': 'text-yellow-400', 
                    'Alta': 'text-red-400'
                  }
                  const colorClass = complexidadeColor[tipologia.complexidade]
                  
                  return (
                    <motion.div
                      key={tipologia.id}
                      className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/30 scale-105'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => handleTipologiaChange(tipologia.id, !isSelected)}
                      whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-2 text-sm leading-tight">{tipologia.nome}</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-blue-100/60">Complexidade:</span>
                              <span className={`text-xs font-medium ${colorClass}`}>
                                {tipologia.complexidade}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-blue-100/60">Tempo médio:</span>
                              <span className="text-xs text-blue-100">{tipologia.tempoMedio} meses</span>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="mt-3 flex items-center space-x-2">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                              <span className="text-green-400 text-xs font-medium">Selecionada</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Nenhuma disciplina ativa</h4>
                <p className="text-blue-100/70 text-sm">
                  Volte para a etapa anterior e selecione suas disciplinas técnicas
                </p>
              </div>
            )}
          </motion.div>

          {/* Resumo das Seleções */}
          {formData.tipologiasSelecionadas.length > 0 && (
            <motion.div
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Configuração Inteligente</h3>
                  <p className="text-blue-100/70 text-sm">O que será configurado automaticamente</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl">
                  <h4 className="font-bold text-white mb-3">Workflows Personalizados</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Cada tipologia terá etapas específicas baseadas nas melhores práticas NBR 13531/13532
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <h4 className="font-bold text-white mb-3">Precificação Automática</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Valores base configurados por complexidade e tempo médio de cada tipologia
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <h4 className="font-bold text-white mb-3">Templates de Documentos</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Briefings, contratos e documentos específicos para cada tipo de projeto
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Botão Continuar */}
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <button
              onClick={handleContinuar}
              disabled={!isFormValid()}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>Continuar para Workflow</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}