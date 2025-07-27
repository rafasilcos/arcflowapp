'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Home, 
  Building, 
  Store, 
  GraduationCap, 
  Heart, 
  TreePine,
  Factory,
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Zap,
  BookOpen,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface TipologiaProjeto {
  id: string
  nome: string
  descricao: string
  icon: any
  cor: string
  complexidade: 'Baixa' | 'Média' | 'Alta'
  prazoMedio: string
  valorMedio: string
  frequencia: number // % dos escritórios que fazem
  exemplos: string[]
}

interface Metodologia {
  id: string
  nome: string
  descricao: string
  icon: any
  cor: string
  adequadoPara: string[]
  vantagens: string[]
  prazoImplementacao: string
  complexidade: 'Básica' | 'Intermediária' | 'Avançada'
}

const tipologiasProjetos: TipologiaProjeto[] = [
  {
    id: 'residencial_unifamiliar',
    nome: 'Residencial Unifamiliar',
    descricao: 'Casas, sobrados e residências unifamiliares',
    icon: Home,
    cor: 'from-blue-500 to-blue-600',
    complexidade: 'Média',
    prazoMedio: '4-8 meses',
    valorMedio: 'R$ 15-50k',
    frequencia: 85,
    exemplos: ['Casas térreas', 'Sobrados', 'Casas de campo', 'Residências de alto padrão']
  },
  {
    id: 'residencial_multifamiliar',
    nome: 'Residencial Multifamiliar',
    descricao: 'Edifícios residenciais e condomínios',
    icon: Building,
    cor: 'from-purple-500 to-purple-600',
    complexidade: 'Alta',
    prazoMedio: '8-18 meses',
    valorMedio: 'R$ 80-300k',
    frequencia: 45,
    exemplos: ['Edifícios residenciais', 'Condomínios', 'Habitação social', 'Lofts']
  },
  {
    id: 'comercial_servicos',
    nome: 'Comercial e Serviços',
    descricao: 'Lojas, escritórios, restaurantes e serviços',
    icon: Store,
    cor: 'from-green-500 to-green-600',
    complexidade: 'Média',
    prazoMedio: '3-12 meses',
    valorMedio: 'R$ 20-150k',
    frequencia: 70,
    exemplos: ['Lojas', 'Restaurantes', 'Escritórios', 'Clínicas', 'Salões']
  },
  {
    id: 'institucional',
    nome: 'Institucional',
    descricao: 'Escolas, hospitais, igrejas e equipamentos públicos',
    icon: GraduationCap,
    cor: 'from-red-500 to-red-600',
    complexidade: 'Alta',
    prazoMedio: '6-24 meses',
    valorMedio: 'R$ 100-500k',
    frequencia: 35,
    exemplos: ['Escolas', 'Hospitais', 'Igrejas', 'Bibliotecas', 'Museus']
  },
  {
    id: 'saude_bem_estar',
    nome: 'Saúde e Bem-estar',
    descricao: 'Clínicas, spas, academias e centros de saúde',
    icon: Heart,
    cor: 'from-pink-500 to-pink-600',
    complexidade: 'Alta',
    prazoMedio: '4-12 meses',
    valorMedio: 'R$ 50-200k',
    frequencia: 40,
    exemplos: ['Clínicas médicas', 'Spas', 'Academias', 'Laboratórios']
  },
  {
    id: 'paisagismo_urbanismo',
    nome: 'Paisagismo e Urbanismo',
    descricao: 'Projetos urbanos, praças e paisagismo',
    icon: TreePine,
    cor: 'from-emerald-500 to-emerald-600',
    complexidade: 'Média',
    prazoMedio: '3-18 meses',
    valorMedio: 'R$ 25-300k',
    frequencia: 30,
    exemplos: ['Praças', 'Parques', 'Loteamentos', 'Jardins corporativos']
  },
  {
    id: 'industrial_logistica',
    nome: 'Industrial e Logística',
    descricao: 'Galpões, fábricas e centros de distribuição',
    icon: Factory,
    cor: 'from-orange-500 to-orange-600',
    complexidade: 'Alta',
    prazoMedio: '6-24 meses',
    valorMedio: 'R$ 150-800k',
    frequencia: 20,
    exemplos: ['Galpões industriais', 'Fábricas', 'Centros de distribuição', 'Armazéns']
  }
]

const metodologias: Metodologia[] = [
  {
    id: 'nbr_13532',
    nome: 'NBR 13532 (Tradicional)',
    descricao: 'Organização clássica brasileira: LV → PN → EP → AP → PE → AS',
    icon: BookOpen,
    cor: 'from-blue-500 to-blue-600',
    adequadoPara: ['Projetos grandes', 'Clientes conservadores', 'Aprovações municipais'],
    vantagens: [
      'Padrão brasileiro reconhecido',
      'Fases bem documentadas',
      'Ideal para aprovações',
      'Controle rigoroso de qualidade'
    ],
    prazoImplementacao: 'Imediato',
    complexidade: 'Básica'
  },
  {
    id: 'agil_adaptado',
    nome: 'Ágil Adaptado AEC',
    descricao: 'Organização em sprints: Discovery → Conceito → Desenvolvimento → Detalhamento',
    icon: Zap,
    cor: 'from-purple-500 to-purple-600',
    adequadoPara: ['Projetos inovadores', 'Clientes participativos', 'Prazos apertados'],
    vantagens: [
      'Entregas incrementais',
      'Feedback contínuo do cliente',
      'Adaptação rápida a mudanças',
      'Maior satisfação do cliente'
    ],
    prazoImplementacao: '2-3 semanas',
    complexidade: 'Intermediária'
  },
  {
    id: 'design_thinking',
    nome: 'Design Thinking',
    descricao: 'Organização centrada no usuário: Empatizar → Definir → Idear → Prototipar → Testar',
    icon: Target,
    cor: 'from-green-500 to-green-600',
    adequadoPara: ['Projetos complexos', 'Inovação', 'Múltiplos stakeholders'],
    vantagens: [
      'Foco nas necessidades reais',
      'Soluções inovadoras',
      'Redução de retrabalho',
      'Maior assertividade'
    ],
    prazoImplementacao: '3-4 semanas',
    complexidade: 'Avançada'
  },
  {
    id: 'lean_construction',
    nome: 'Lean Construction',
    descricao: 'Organização enxuta focada em eliminar desperdícios e otimizar fluxos',
    icon: TrendingUp,
    cor: 'from-orange-500 to-orange-600',
    adequadoPara: ['Projetos com obras', 'Foco em eficiência', 'Redução de custos'],
    vantagens: [
      'Redução de desperdícios',
      'Otimização de recursos',
      'Maior produtividade',
      'Controle rigoroso de custos'
    ],
    prazoImplementacao: '4-6 semanas',
    complexidade: 'Avançada'
  },
  {
    id: 'hibrida_personalizada',
    nome: 'Híbrida Personalizada',
    descricao: 'Organização customizada combinando diferentes abordagens conforme o projeto',
    icon: Settings,
    cor: 'from-indigo-500 to-indigo-600',
    adequadoPara: ['Escritórios experientes', 'Projetos variados', 'Flexibilidade máxima'],
    vantagens: [
      'Adaptação total ao escritório',
      'Flexibilidade máxima',
      'Otimização por tipo de projeto',
      'Evolução contínua'
    ],
    prazoImplementacao: '6-8 semanas',
    complexidade: 'Avançada'
  }
]

export default function TipologiasPage() {
  const [tipologiasSelecionadas, setTipologiasSelecionadas] = useState<string[]>([])
  const [metodologiaSelecionada, setMetodologiaSelecionada] = useState<string>('')
  const [mostrarDetalhes, setMostrarDetalhes] = useState<string | null>(null)

  const toggleTipologia = (tipologiaId: string) => {
    setTipologiasSelecionadas(prev => 
      prev.includes(tipologiaId)
        ? prev.filter(id => id !== tipologiaId)
        : [...prev, tipologiaId]
    )
  }

  const calcularComplexidadeMedia = () => {
    if (tipologiasSelecionadas.length === 0) return 'Não definida'
    
    const complexidades = tipologiasSelecionadas.map(id => {
      const tipologia = tipologiasProjetos.find(t => t.id === id)
      return tipologia?.complexidade === 'Baixa' ? 1 : 
             tipologia?.complexidade === 'Média' ? 2 : 3
    })
    
    const media = complexidades.reduce((acc, val) => acc + val, 0) / complexidades.length
    
    if (media <= 1.5) return 'Baixa'
    if (media <= 2.5) return 'Média'
    return 'Alta'
  }

  const calcularValorMedioPortfolio = () => {
    if (tipologiasSelecionadas.length === 0) return 'R$ 0'
    
    const valores = tipologiasSelecionadas.map(id => {
      const tipologia = tipologiasProjetos.find(t => t.id === id)
      if (!tipologia) return 0
      
      // Extrai o valor médio (pega o valor do meio da faixa)
      const valorStr = tipologia.valorMedio.replace('R$ ', '').replace('k', '')
      const [min, max] = valorStr.split('-').map(v => parseInt(v))
      return (min + max) / 2
    })
    
    const media = valores.reduce((acc, val) => acc + val, 0) / valores.length
    return `R$ ${Math.round(media)}k`
  }

  const podeAvancar = () => {
    return tipologiasSelecionadas.length > 0 && metodologiaSelecionada !== ''
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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Tipologias e Organização
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-4xl mx-auto">
            Selecione os tipos de projetos que seu escritório desenvolve e como prefere organizar as fases de trabalho. 
            O fluxo operacional é sempre o mesmo: gerente → colaborador → revisão → aprovação cliente (se crítico).
          </p>
          
          {/* Barra de Progresso */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-blue-200">Etapa 3 de 8</span>
              <span className="text-xs text-blue-200">Tipologias e Organização</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500 w-3/8" />
            </div>
          </div>
        </motion.div>

        {/* Resumo da Seleção */}
        {(tipologiasSelecionadas.length > 0 || metodologiaSelecionada) && (
          <motion.div
            className="max-w-5xl mx-auto bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{tipologiasSelecionadas.length}</div>
                <div className="text-sm text-white/60">Tipologias Selecionadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{calcularComplexidadeMedia()}</div>
                <div className="text-sm text-white/60">Complexidade Média</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">{calcularValorMedioPortfolio()}</div>
                <div className="text-sm text-white/60">Valor Médio Projeto</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">
                  {metodologiaSelecionada ? metodologias.find(m => m.id === metodologiaSelecionada)?.nome.split(' ')[0] : 'Não definida'}
                </div>
                <div className="text-sm text-white/60">Organização</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Seção: Tipologias de Projetos */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Tipologias de Projetos</h2>
            <p className="text-white/70">Selecione os tipos de projetos que seu escritório desenvolve</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipologiasProjetos.map((tipologia, index) => {
              const isSelected = tipologiasSelecionadas.includes(tipologia.id)
              const Icon = tipologia.icon

              return (
                <motion.div
                  key={tipologia.id}
                  className={`bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-white/30 bg-white/10 shadow-xl' 
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                  onClick={() => toggleTipologia(tipologia.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tipologia.cor} rounded-xl flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-white/40" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{tipologia.nome}</h3>
                  <p className="text-white/70 text-sm mb-4">{tipologia.descricao}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{tipologia.prazoMedio}</div>
                      <div className="text-xs text-white/60">Prazo Médio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-400">{tipologia.valorMedio}</div>
                      <div className="text-xs text-white/60">Valor Médio</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded-lg text-xs ${
                      tipologia.complexidade === 'Baixa' ? 'bg-green-500/20 text-green-300' :
                      tipologia.complexidade === 'Média' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {tipologia.complexidade}
                    </div>
                    <div className="text-xs text-white/60">{tipologia.frequencia}% dos escritórios</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Seção: Organização de Fases */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Organização de Fases</h2>
            <p className="text-white/70">Como seu escritório prefere organizar as etapas dos projetos</p>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl max-w-4xl mx-auto">
              <p className="text-sm text-blue-200">
                💡 <strong>O fluxo operacional é sempre o mesmo:</strong> Gerente cria tarefa → Colaborador executa → Gerente revisa → 
                Se crítico, cliente aprova → Tarefa concluída. As "metodologias" apenas organizam as fases do projeto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metodologias.map((metodologia, index) => {
              const isSelected = metodologiaSelecionada === metodologia.id
              const isDetailed = mostrarDetalhes === metodologia.id
              const Icon = metodologia.icon

              return (
                <motion.div
                  key={metodologia.id}
                  className={`bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-white/30 bg-white/10 shadow-xl' 
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                  onClick={() => setMetodologiaSelecionada(metodologia.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${metodologia.cor} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{metodologia.nome}</h3>
                        <p className="text-white/70 text-sm">{metodologia.descricao}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-white/40" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{metodologia.prazoImplementacao}</div>
                      <div className="text-xs text-white/60">Implementação</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-bold ${
                        metodologia.complexidade === 'Básica' ? 'text-green-400' :
                        metodologia.complexidade === 'Intermediária' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {metodologia.complexidade}
                      </div>
                      <div className="text-xs text-white/60">Complexidade</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Adequado para:</h4>
                      <div className="flex flex-wrap gap-1">
                        {metodologia.adequadoPara.slice(0, 2).map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                            {item}
                          </span>
                        ))}
                        {metodologia.adequadoPara.length > 2 && (
                          <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                            +{metodologia.adequadoPara.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMostrarDetalhes(isDetailed ? null : metodologia.id)
                      }}
                      className="w-full text-left text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isDetailed ? 'Ocultar detalhes' : 'Ver vantagens e detalhes'}
                    </button>

                    {isDetailed && (
                      <motion.div
                        className="space-y-3 pt-3 border-t border-white/10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Principais Vantagens
                          </h4>
                          <div className="space-y-1">
                            {metodologia.vantagens.map((vantagem, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                                <span className="text-xs text-white/70">{vantagem}</span>
                              </div>
                            ))}
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

        {/* Navegação */}
        <div className="flex justify-between items-center pt-8">
          <Link href="/onboarding/modulos">
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
            <div className="text-xs text-white/60 mb-1">Tipologias e organização de fases</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === 3 ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <Link href="/onboarding/equipe">
            <motion.button
              disabled={!podeAvancar()}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                podeAvancar()
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-xl'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={podeAvancar() ? { scale: 1.02 } : {}}
              whileTap={podeAvancar() ? { scale: 0.98 } : {}}
            >
              Continuar
              <ArrowRight className="h-5 w-5 ml-2" />
            </motion.button>
          </Link>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding/modulos"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Módulos AEC</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 3 de 8 • Tipologias e Metodologia
          </div>
          
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  )
} 