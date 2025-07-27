'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2,
  Trophy,
  Star,
  Sparkles,
  Download,
  Play,
  Rocket,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Zap,
  Crown,
  Award,
  PartyPopper
} from 'lucide-react'

// Interfaces
interface ResumoCompleto {
  identificacao: any
  perfilTecnico: any
  metodologia: any
  tipologias: any
  workflow: any
  precificacao: any
  integracoes: any
}

interface ProximosPassos {
  id: string
  titulo: string
  descricao: string
  icon: string
  tempo: string
  prioridade: 'alta' | 'media' | 'baixa'
}

export default function ConclusaoOnboarding() {
  const router = useRouter()
  const [dadosCompletos, setDadosCompletos] = useState<ResumoCompleto>({
    identificacao: {},
    perfilTecnico: {},
    metodologia: {},
    tipologias: {},
    workflow: {},
    precificacao: {},
    integracoes: {}
  })
  
  const [certificadoGerado, setCertificadoGerado] = useState(false)
  const [proximosPassos, setProximosPassos] = useState<ProximosPassos[]>([])
  const [estatisticasOnboarding, setEstatisticasOnboarding] = useState({
    tempoTotal: '0 min',
    etapasConcluidas: 8,
    configuracoesCriadas: 0,
    eficienciaPrevia: 0
  })

  useEffect(() => {
    // Carregar todos os dados do onboarding
    const dadosStorage = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosStorage) {
      const dados = JSON.parse(dadosStorage)
      setDadosCompletos(dados)
      gerarProximosPassos(dados)
      calcularEstatisticas(dados)
    }
    
    // Simular geração do certificado
    setTimeout(() => {
      setCertificadoGerado(true)
    }, 2000)
  }, [])

  const gerarProximosPassos = (dados: any) => {
    const passos: ProximosPassos[] = [
      {
        id: 'configurar-integracao',
        titulo: 'Configurar Primeira Integração',
        descricao: 'Conectar AutoCAD ou Revit para sincronização automática',
        icon: '🔗',
        tempo: '10 min',
        prioridade: 'alta'
      },
      {
        id: 'criar-primeiro-projeto',
        titulo: 'Criar Primeiro Projeto',
        descricao: 'Testar o workflow completo com um projeto real',
        icon: '🏗️',
        tempo: '15 min',
        prioridade: 'alta'
      },
      {
        id: 'configurar-equipe',
        titulo: 'Adicionar Membros da Equipe',
        descricao: 'Convidar colaboradores e definir permissões',
        icon: '👥',
        tempo: '5 min',
        prioridade: 'media'
      },
      {
        id: 'personalizar-templates',
        titulo: 'Personalizar Templates',
        descricao: 'Adaptar modelos de documentos ao seu padrão',
        icon: '📄',
        tempo: '20 min',
        prioridade: 'media'
      },
      {
        id: 'configurar-backup',
        titulo: 'Configurar Backup na Nuvem',
        descricao: 'Garantir segurança dos seus projetos',
        icon: '☁️',
        tempo: '5 min',
        prioridade: 'baixa'
      }
    ]
    
    // Personalizar baseado no perfil
    const porte = dados?.identificacao?.porte
    if (porte === 'Solo') {
      passos.unshift({
        id: 'tutorial-solo',
        titulo: 'Tutorial Profissional Solo',
        descricao: 'Guia específico para profissionais autônomos',
        icon: '🎯',
        tempo: '8 min',
        prioridade: 'alta'
      })
    }
    
    setProximosPassos(passos)
  }

  const calcularEstatisticas = (dados: any) => {
    // Simular cálculos baseados nos dados
    const configuracoes = Object.keys(dados).length
    const eficiencia = configuracoes * 12.5 // Base de cálculo fictícia
    
    setEstatisticasOnboarding({
      tempoTotal: '12 min',
      etapasConcluidas: 8,
      configuracoesCriadas: configuracoes,
      eficienciaPrevia: Math.min(eficiencia, 100)
    })
  }

  const handleVoltar = () => {
    router.push('/onboarding/v3/personalizacao')
  }

  const handleIniciarSistema = () => {
    // Marcar onboarding como concluído
    localStorage.setItem('arcflow-onboarding-concluido', 'true')
    // Redirecionar para dashboard
    router.push('/dashboard')
  }

  const handleDownloadCertificado = () => {
    // Simular download do certificado
    console.log('Baixando certificado...')
  }

  const calcularPorcentagemMelhoria = () => {
    const configuracoes = dadosCompletos ? Object.keys(dadosCompletos).length : 0
    return Math.min(configuracoes * 37.5, 300) // Máximo 300%
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
              <h1 className="text-2xl font-bold text-white">Parabéns! 🎉</h1>
              <p className="text-blue-200/70">Onboarding Concluído</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-white font-bold">100% Concluído</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar - Completa */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-full"
              initial={{ width: '87.5%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Celebração Principal */}
        <motion.div
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-12 border border-green-400/30 backdrop-blur-sm mb-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Seu Escritório foi Revolucionado!
          </motion.h2>
          
          <motion.p
            className="text-lg text-green-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Configuramos um sistema completo e personalizado para turbinar sua produtividade.
            Agora você está pronto para dominar o mercado AEC!
          </motion.p>

          {/* Estatísticas de Impacto */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">
                +{calcularPorcentagemMelhoria()}%
              </div>
              <div className="text-sm text-white/70">Eficiência Projetada</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {estatisticasOnboarding.etapasConcluidas}
              </div>
              <div className="text-sm text-white/70">Etapas Concluídas</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {estatisticasOnboarding.configuracoesCriadas}
              </div>
              <div className="text-sm text-white/70">Configurações Criadas</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {estatisticasOnboarding.tempoTotal}
              </div>
              <div className="text-sm text-white/70">Tempo Investido</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Resumo da Configuração */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resumo Executivo */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Resumo da Configuração</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-blue-100">Perfil do Escritório:</span>
                <span className="text-white font-medium">
                  {dadosCompletos.identificacao?.porte || 'Configurado'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-blue-100">Disciplinas Ativas:</span>
                <span className="text-white font-medium">
                  {dadosCompletos.perfilTecnico?.disciplinasAtivas ? 
                    Object.keys(dadosCompletos.perfilTecnico.disciplinasAtivas).filter(d => 
                      dadosCompletos.perfilTecnico.disciplinasAtivas[d]?.ativa
                    ).length : 0} configuradas
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-blue-100">Workflows Personalizados:</span>
                <span className="text-white font-medium">
                  {dadosCompletos.workflow?.workflowsAtivos?.length || 0} criados
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-blue-100">Estratégia de Precificação:</span>
                <span className="text-white font-medium">Otimizada</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-blue-100">Integrações Configuradas:</span>
                <span className="text-white font-medium">Prontas</span>
              </div>
            </div>

            {/* Certificado de Conclusão */}
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-400/20">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <h4 className="font-bold text-white">Certificado de Conclusão</h4>
                  <p className="text-xs text-yellow-200/70">ArcFlow Onboarding Master</p>
                </div>
              </div>
              
              {certificadoGerado ? (
                <button
                  onClick={handleDownloadCertificado}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 justify-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Certificado</span>
                </button>
              ) : (
                <div className="w-full py-3 bg-gray-500/20 text-gray-300 font-medium rounded-xl flex items-center space-x-2 justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  <span>Gerando certificado...</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Próximos Passos */}
          <motion.div
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Próximos Passos</h3>
            </div>

            <div className="space-y-4">
              {proximosPassos.slice(0, 4).map((passo, index) => (
                <motion.div
                  key={passo.id}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-102 ${
                    passo.prioridade === 'alta' 
                      ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/20' 
                      : passo.prioridade === 'media'
                      ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-400/20'
                      : 'bg-white/5 border border-white/10'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{passo.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{passo.titulo}</h4>
                      <p className="text-xs text-blue-100/70">{passo.descricao}</p>
                    </div>
                    <div className="text-xs text-blue-300 font-medium">
                      {passo.tempo}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-white">Dica Pro:</span>
              </div>
              <p className="text-xs text-blue-100/80">
                Complete os primeiros 3 passos nas próximas 24 horas para maximizar seu ROI inicial!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Seção de Impacto Esperado */}
        <motion.div
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Impacto Esperado nos Próximos 30 Dias</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">-60%</div>
              <div className="text-sm text-white/70">Tempo em tarefas administrativas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <div className="text-2xl font-bold text-green-400 mb-2">+150%</div>
              <div className="text-sm text-white/70">Controle sobre projetos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <div className="text-2xl font-bold text-blue-400 mb-2">+25%</div>
              <div className="text-sm text-white/70">Margem de lucro média</div>
            </div>
          </div>
        </motion.div>

        {/* Botão Principal */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <button
            onClick={handleIniciarSistema}
            className="inline-flex items-center space-x-4 px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-green-500/25"
          >
            <Play className="w-6 h-6" />
            <span>Iniciar Jornada no ArcFlow</span>
            <Rocket className="w-6 h-6" />
          </button>
          
          <p className="text-sm text-blue-100/70 mt-4 max-w-md mx-auto">
            Clique aqui para acessar seu dashboard personalizado e começar a revolucionar seu escritório hoje mesmo!
          </p>
        </motion.div>

        {/* Confetti Animation */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: -50,
                rotate: 0 
              }}
              animate={{ 
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                rotate: 360 
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "linear" 
              }}
            >
              {['🎉', '🚀', '⭐', '🏆', '💎'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}