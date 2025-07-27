'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Settings, 
  TrendingUp, 
  Target,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Calculator,
  Calendar,
  DollarSign,
  FileText,
  Users,
  BarChart3
} from 'lucide-react'

// Interfaces
interface MetodologiaAtual {
  comoFazOrcamentos: string
  comoPlanejaProjetos: string[]
  comoControlaFinanceiro: string[]
  maioresDificuldades: string[]
  processosQueQueremMelhorar: string[]
  tempoMedioProjetoResidencial: number
  percentualAtrasos: number
  usaAlgumSoftware: boolean
  qualSoftwareUsa: string
  satisfacaoProcessoAtual: number
}

// Constantes
const OPCOES_ORCAMENTO = [
  'Planilha Excel própria',
  'Software especializado',
  'Tabelas de referência (CAU/ASBEA)',
  'Experiência/feeling',
  'Composição de custos detalhada',
  'Não tenho método estruturado'
]

const OPCOES_PLANEJAMENTO = [
  'Cronograma no Excel',
  'Software de gestão de projetos',
  'Agenda pessoal/calendário',
  'Quadro Kanban físico/digital',
  'Metodologia própria no papel',
  'Não faço planejamento estruturado'
]

const OPCOES_CONTROLE_FINANCEIRO = [
  'Planilha de controle própria',
  'Software de contabilidade',
  'Contador externo cuida',
  'Sistema bancário apenas',
  'Separação manual por projeto',
  'Não tenho controle estruturado'
]

const DIFICULDADES_COMUNS = [
  'Definir preços justos e competitivos',
  'Controlar prazos e entregas',
  'Saber se projetos estão dando lucro',
  'Organizar documentos e versões',
  'Gerenciar múltiplos projetos simultâneos',
  'Comunicação com clientes',
  'Controle de horas trabalhadas',
  'Fluxo de caixa e recebimentos',
  'Aprovações em órgãos públicos',
  'Gestão da equipe e colaboradores'
]

const PROCESSOS_MELHORIA = [
  'Orçamentação mais precisa',
  'Planejamento de projetos',
  'Controle financeiro detalhado',
  'Comunicação com clientes',
  'Gestão de documentos',
  'Análise de rentabilidade',
  'Controle de prazos',
  'Fluxo de aprovações',
  'Gestão de equipe',
  'Relatórios gerenciais'
]

export default function MetodologiaAtual() {
  const router = useRouter()
  const [formData, setFormData] = useState<MetodologiaAtual>({
    comoFazOrcamentos: '',
    comoPlanejaProjetos: [],
    comoControlaFinanceiro: [],
    maioresDificuldades: [],
    processosQueQueremMelhorar: [],
    tempoMedioProjetoResidencial: 0,
    percentualAtrasos: 0,
    usaAlgumSoftware: false,
    qualSoftwareUsa: '',
    satisfacaoProcessoAtual: 5
  })

  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])

  useEffect(() => {
    const dadosAnteriores = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosAnteriores) {
      const dados = JSON.parse(dadosAnteriores)
      gerarSugestoesIA(dados)
    }
  }, [formData])

  const gerarSugestoesIA = (dadosAnteriores?: any) => {
    const sugestoes: string[] = []
    
    if (formData.comoFazOrcamentos === 'Experiência/feeling') {
      sugestoes.push('⚠️ Orçar por experiência pode gerar prejuízos. Vamos estruturar sua precificação com dados reais.')
    }
    
    if (formData.maioresDificuldades.includes('Saber se projetos estão dando lucro')) {
      sugestoes.push('💰 O módulo "Onde Vai Seu Dinheiro" vai mostrar exatamente onde você perde dinheiro em cada projeto.')
    }
    
    if (formData.comoPlanejaProjetos.includes('Não faço planejamento estruturado')) {
      sugestoes.push('📋 Vamos criar cronogramas automáticos baseados nas melhores práticas NBR 13531.')
    }
    
    if (formData.percentualAtrasos > 50) {
      sugestoes.push('⏱️ Com nossa agenda integrada e alertas automáticos, podemos reduzir seus atrasos em mais de 60%.')
    }
    
    if (dadosAnteriores?.objetivoPrincipal === 'Crescimento' && formData.processosQueQueremMelhorar.includes('Gestão de equipe')) {
      sugestoes.push('🚀 Para crescer sustentavelmente, vamos implementar controles de produtividade e gestão visual da equipe.')
    }

    setSugestoesIA(sugestoes)
  }

  const handleMultipleChoice = (campo: keyof MetodologiaAtual, valor: string, isChecked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[campo] as string[]
      if (isChecked) {
        return { ...prev, [campo]: [...currentArray, valor] }
      } else {
        return { ...prev, [campo]: currentArray.filter(item => item !== valor) }
      }
    })
  }

  const handleVoltar = () => {
    router.push('/onboarding/v3/perfil-tecnico')
  }

  const handleContinuar = () => {
    // Salvar dados
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      metodologia: formData
    }))
    
    router.push('/onboarding/v3/tipologias')
  }

  const isFormValid = () => {
    return formData.comoFazOrcamentos && 
           formData.comoPlanejaProjetos.length > 0 &&
           formData.comoControlaFinanceiro.length > 0 &&
           formData.maioresDificuldades.length > 0 &&
           formData.processosQueQueremMelhorar.length > 0 &&
           formData.tempoMedioProjetoResidencial > 0
  }

  const calcularMaturidade = () => {
    let pontos = 0
    
    // Orçamentação
    if (formData.comoFazOrcamentos === 'Software especializado') pontos += 3
    else if (formData.comoFazOrcamentos === 'Composição de custos detalhada') pontos += 2
    else if (formData.comoFazOrcamentos === 'Planilha Excel própria') pontos += 1
    
    // Controle
    if (formData.comoControlaFinanceiro.includes('Software de contabilidade')) pontos += 2
    if (formData.comoPlanejaProjetos.includes('Software de gestão de projetos')) pontos += 2
    
    // Satisfação
    pontos += Math.floor(formData.satisfacaoProcessoAtual / 2)
    
    if (pontos >= 8) return { nivel: 'Avançado', cor: 'green' }
    if (pontos >= 5) return { nivel: 'Intermediário', cor: 'yellow' }
    return { nivel: 'Básico', cor: 'red' }
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
              <h1 className="text-2xl font-bold text-white">Metodologia Atual</h1>
              <p className="text-blue-200/70">Etapa 3 de 8</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-blue-100">37.5% Concluído</span>
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
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-[37.5%] transition-all duration-1000"></div>
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
                  Análise dos seus processos atuais:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Conte-nos como você trabalha hoje para receber sugestões personalizadas de otimização.
              </p>
            )}
          </motion.div>

          {/* Preview da Maturidade */}
          {formData.comoFazOrcamentos && formData.satisfacaoProcessoAtual > 0 ? (
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Maturidade dos Processos</h3>
              </div>
              
              <div className="space-y-4">
                {(() => {
                  const { nivel, cor } = calcularMaturidade()
                  return (
                    <div className={`p-4 rounded-xl border ${
                      cor === 'green' ? 'bg-green-500/10 border-green-400/20' :
                      cor === 'yellow' ? 'bg-yellow-500/10 border-yellow-400/20' :
                      'bg-red-500/10 border-red-400/20'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">Nível Atual:</span>
                        <span className={`font-bold ${
                          cor === 'green' ? 'text-green-400' :
                          cor === 'yellow' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {nivel}
                        </span>
                      </div>
                      <p className="text-sm text-blue-100/70">
                        {nivel === 'Avançado' ? 'Seus processos estão bem estruturados. Vamos otimizar ainda mais!' :
                         nivel === 'Intermediário' ? 'Você tem uma base boa. Vamos profissionalizar!' :
                         'Muitas oportunidades de melhoria. Vamos estruturar!'}
                      </p>
                    </div>
                  )
                })()}
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formData.satisfacaoProcessoAtual}/10</div>
                    <div className="text-xs text-blue-100/60">Satisfação Atual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">8+/10</div>
                    <div className="text-xs text-blue-100/60">Meta com ArcFlow</div>
                  </div>
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
                  <BarChart3 className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Análise de Maturidade</h3>
                <p className="text-sm text-gray-300/70">
                  Responda as perguntas para ver sua análise
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conteúdo Principal - Largura Total */}
        <div className="space-y-6">
          {/* Como Faz Orçamentos */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Orçamentação</h3>
                <p className="text-blue-100/70 text-sm">Como você precifica seus projetos hoje?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OPCOES_ORCAMENTO.map((opcao) => (
                <div
                  key={opcao}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    formData.comoFazOrcamentos === opcao
                      ? 'border-white/30 bg-blue-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, comoFazOrcamentos: opcao }))}
                >
                  <p className="text-sm text-blue-100/80 leading-relaxed">{opcao}</p>
                  {formData.comoFazOrcamentos === opcao && (
                    <div className="mt-2 flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-xs font-medium">Selecionado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Como Planeja Projetos */}
          <motion.div
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Planejamento de Projetos</h3>
                <p className="text-blue-100/70 text-sm">Como você organiza e acompanha seus projetos? (Múltiplas opções)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPCOES_PLANEJAMENTO.map((opcao) => (
                <div key={opcao} className="flex items-center space-x-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    id={`planejamento-${opcao}`}
                    checked={formData.comoPlanejaProjetos.includes(opcao)}
                    onChange={(e) => handleMultipleChoice('comoPlanejaProjetos', opcao, e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                  />
                  <label 
                    htmlFor={`planejamento-${opcao}`} 
                    className="text-sm leading-relaxed cursor-pointer text-blue-100/80 hover:text-white transition-colors"
                  >
                    {opcao}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Controle Financeiro */}
          <motion.div
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Controle Financeiro</h3>
                <p className="text-blue-100/70 text-sm">Como você controla as finanças hoje? (Múltiplas opções)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPCOES_CONTROLE_FINANCEIRO.map((opcao) => (
                <div key={opcao} className="flex items-center space-x-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    id={`financeiro-${opcao}`}
                    checked={formData.comoControlaFinanceiro.includes(opcao)}
                    onChange={(e) => handleMultipleChoice('comoControlaFinanceiro', opcao, e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-500/50"
                  />
                  <label 
                    htmlFor={`financeiro-${opcao}`} 
                    className="text-sm leading-relaxed cursor-pointer text-blue-100/80 hover:text-white transition-colors"
                  >
                    {opcao}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Principais Dificuldades */}
          <motion.div
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Principais Dificuldades</h3>
                <p className="text-blue-100/70 text-sm">Quais são seus maiores desafios no dia a dia? (Até 5 opções)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIFICULDADES_COMUNS.map((dificuldade) => (
                <div key={dificuldade} className="flex items-center space-x-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    id={`dificuldade-${dificuldade}`}
                    checked={formData.maioresDificuldades.includes(dificuldade)}
                    onChange={(e) => handleMultipleChoice('maioresDificuldades', dificuldade, e.target.checked)}
                    disabled={!formData.maioresDificuldades.includes(dificuldade) && formData.maioresDificuldades.length >= 5}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500/50 disabled:opacity-50"
                  />
                  <label 
                    htmlFor={`dificuldade-${dificuldade}`} 
                    className="text-sm leading-relaxed cursor-pointer text-blue-100/80 hover:text-white transition-colors"
                  >
                    {dificuldade}
                  </label>
                </div>
              ))}
            </div>
            
            {formData.maioresDificuldades.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-400/20">
                <p className="text-sm text-red-300 font-medium">
                  ⚠️ {formData.maioresDificuldades.length} dificuldade(s) identificada(s) - Vamos resolver isso juntos!
                </p>
              </div>
            )}
          </motion.div>

          {/* Processos para Melhorar */}
          <motion.div
            className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Prioridades de Melhoria</h3>
                <p className="text-blue-100/70 text-sm">O que você mais quer melhorar? (Múltiplas opções)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROCESSOS_MELHORIA.map((processo) => (
                <div key={processo} className="flex items-center space-x-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    id={`melhoria-${processo}`}
                    checked={formData.processosQueQueremMelhorar.includes(processo)}
                    onChange={(e) => handleMultipleChoice('processosQueQueremMelhorar', processo, e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <label 
                    htmlFor={`melhoria-${processo}`} 
                    className="text-sm leading-relaxed cursor-pointer text-blue-100/80 hover:text-white transition-colors"
                  >
                    {processo}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dados Quantitativos */}
          <motion.div
            className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Dados Atuais</h3>
                <p className="text-blue-100/70 text-sm">Nos ajude a entender seus números atuais</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tempo Médio */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-100 min-h-[2.5rem] flex items-center">
                  Tempo médio para concluir um projeto residencial (meses)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formData.tempoMedioProjetoResidencial || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tempoMedioProjetoResidencial: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder="Ex: 6"
                />
              </div>

              {/* Percentual de Atrasos */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-100 min-h-[2.5rem] flex items-center">
                  % de projetos que atrasam
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentualAtrasos || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentualAtrasos: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder="Ex: 30"
                />
              </div>

              {/* Satisfação */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-100 min-h-[2.5rem] flex items-center">
                  Satisfação com processos atuais (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.satisfacaoProcessoAtual || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, satisfacaoProcessoAtual: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            {/* Software Atual */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="usa-software"
                  checked={formData.usaAlgumSoftware}
                  onChange={(e) => setFormData(prev => ({ ...prev, usaAlgumSoftware: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500/50"
                />
                <label htmlFor="usa-software" className="text-sm text-blue-100/80">
                  Já uso algum software de gestão
                </label>
              </div>

              {formData.usaAlgumSoftware && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-blue-100">
                    Qual software você usa?
                  </label>
                  <input
                    type="text"
                    value={formData.qualSoftwareUsa}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualSoftwareUsa: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    placeholder="Ex: Sienge, Vobi, Monday, etc."
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Botão Continuar */}
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <button
              onClick={handleContinuar}
              disabled={!isFormValid()}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>Continuar para Tipologias</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 