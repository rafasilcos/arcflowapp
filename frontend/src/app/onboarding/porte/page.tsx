'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Building,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Brain,
  Settings,
  UserPlus,
  Crown,
  Shield,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface PorteEscritorio {
  id: string
  nome: string
  descricao: string
  faixaUsuarios: string
  faturamentoAnual: string
  caracteristicas: string[]
  beneficios: string[]
  limitesPlano: {
    projetos: string
    armazenamento: string
    usuarios: number
    integrações: number
  }
  precoSugerido: string
  icon: any
  color: string
  bgColor: string
  popular: boolean
  recomendadoPara: string[]
}

// PORTES ESPECIALIZADOS CONFORME BLUEPRINT
const portesEscritorio: PorteEscritorio[] = [
  {
    id: 'solo-freelancer',
    nome: 'Solo/Freelancer',
    descricao: 'Profissional autônomo ou escritório individual com projetos focados',
    faixaUsuarios: '1-2 usuários',
    faturamentoAnual: 'R$ 100k - R$ 500k',
    caracteristicas: [
      'Gestão pessoal de projetos',
      'Briefing simplificado',
      'Templates básicos',
      'Automação essencial'
    ],
    beneficios: [
      'Setup rápido em 10 min',
      'Interface simplificada',
      'Foco em produtividade',
      'Custo acessível'
    ],
    limitesPlano: {
      projetos: '10 simultâneos',
      armazenamento: '50 GB',
      usuarios: 2,
      integrações: 5
    },
    precoSugerido: 'R$ 97/mês',
    icon: Users,
    color: 'blue',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    popular: true,
    recomendadoPara: ['Arquitetos autônomos', 'Freelancers', 'Recém-formados']
  },
  {
    id: 'pequeno-escritorio',
    nome: 'Pequeno Escritório',
    descricao: 'Equipe pequena com crescimento estruturado e processos definidos',
    faixaUsuarios: '3-8 usuários',
    faturamentoAnual: 'R$ 500k - R$ 2M',
    caracteristicas: [
      'Gestão de equipe',
      'Workflows colaborativos',
      'Briefing completo 230 perguntas',
      'IA análise básica'
    ],
    beneficios: [
      'Colaboração em tempo real',
      'Controle de permissões',
      'Relatórios de produtividade',
      'Suporte prioritário'
    ],
    limitesPlano: {
      projetos: '25 simultâneos',
      armazenamento: '200 GB',
      usuarios: 8,
      integrações: 15
    },
    precoSugerido: 'R$ 297/mês',
    icon: Building,
    color: 'green',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    popular: true,
    recomendadoPara: ['Escritórios 3-8 pessoas', 'Crescimento estruturado', 'Processos definidos']
  },
  {
    id: 'medio-escritorio',
    nome: 'Médio Escritório',
    descricao: 'Operação consolidada com múltiplas disciplinas e gestão avançada',
    faixaUsuarios: '9-25 usuários',
    faturamentoAnual: 'R$ 2M - R$ 10M',
    caracteristicas: [
      'Gestão multidisciplinar',
      'IA análise avançada',
      'Automação completa',
      'Integração BIM'
    ],
    beneficios: [
      'Coordenação automática',
      'Analytics avançado',
      'API personalizada',
      'Consultoria especializada'
    ],
    limitesPlano: {
      projetos: '50 simultâneos',
      armazenamento: '500 GB',
      usuarios: 25,
      integrações: 30
    },
    precoSugerido: 'R$ 697/mês',
    icon: TrendingUp,
    color: 'purple',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    popular: false,
    recomendadoPara: ['Escritórios consolidados', 'Múltiplas disciplinas', 'Gestão avançada']
  },
  {
    id: 'grande-escritorio',
    nome: 'Grande Escritório',
    descricao: 'Operação enterprise com gestão complexa e múltiplas filiais',
    faixaUsuarios: '26-100 usuários',
    faturamentoAnual: 'R$ 10M - R$ 50M',
    caracteristicas: [
      'Gestão enterprise',
      'IA personalizada',
      'Automação total',
      'Múltiplas filiais'
    ],
    beneficios: [
      'Customização completa',
      'Suporte dedicado',
      'Treinamento equipe',
      'SLA garantido'
    ],
    limitesPlano: {
      projetos: '100 simultâneos',
      armazenamento: '2 TB',
      usuarios: 100,
      integrações: 50
    },
    precoSugerido: 'R$ 1.497/mês',
    icon: Crown,
    color: 'orange',
    bgColor: 'from-orange-500/20 to-red-500/20',
    popular: false,
    recomendadoPara: ['Grandes escritórios', 'Múltiplas filiais', 'Operação enterprise']
  },
  {
    id: 'construtora-incorporadora',
    nome: 'Construtora/Incorporadora',
    descricao: 'Operação integrada projeto-obra com gestão financeira complexa',
    faixaUsuarios: '15-200 usuários',
    faturamentoAnual: 'R$ 20M - R$ 500M',
    caracteristicas: [
      'Integração projeto-obra',
      'Gestão financeira avançada',
      'Controle de custos',
      'Planejamento 4D/5D'
    ],
    beneficios: [
      'ROI 500-1000%',
      'Integração ERP',
      'Controle total obra',
      'Consultoria especializada'
    ],
    limitesPlano: {
      projetos: 'Ilimitados',
      armazenamento: '10 TB',
      usuarios: 200,
      integrações: 100
    },
    precoSugerido: 'Sob consulta',
    icon: Shield,
    color: 'red',
    bgColor: 'from-red-500/20 to-pink-500/20',
    popular: false,
    recomendadoPara: ['Construtoras', 'Incorporadoras', 'Integração projeto-obra']
  }
]

export default function PortePage() {
  const [porteSelecionado, setPorteSelecionado] = useState<string>('')
  const [etapaAtual, setEtapaAtual] = useState<'selecao' | 'configuracao'>('selecao')

  const handleSelecionarPorte = (porteId: string) => {
    setPorteSelecionado(porteId)
    setEtapaAtual('configuracao')
  }

  const porteEscolhido = portesEscritorio.find(p => p.id === porteSelecionado)

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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {etapaAtual === 'selecao' ? 'Porte do Escritório' : 'Configuração da Equipe'}
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-4xl mx-auto">
            {etapaAtual === 'selecao' 
              ? 'Selecione o porte que melhor descreve seu escritório. Isso configurará limites, permissões e funcionalidades adequadas ao seu tamanho.'
              : 'Configuração otimizada para seu porte. O sistema ativará recursos e limites adequados à sua operação.'
            }
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <div className="bg-green-500/20 text-green-200 px-4 py-2 rounded-full text-sm font-medium">
              ✅ Perfil & Especialização & Tipologias
            </div>
            <div className="bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
              👥 Configurando Equipe
            </div>
            <div className="bg-gray-500/20 text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              ⚙️ Próximo: Metodologia
            </div>
          </div>
        </motion.div>

        {etapaAtual === 'selecao' ? (
          /* Seleção de Porte */
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {portesEscritorio.map((porte, index) => (
              <motion.div
                key={porte.id}
                className={`relative group cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => handleSelecionarPorte(porte.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`relative bg-gradient-to-br ${porte.bgColor} backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl`}>
                  
                  {/* Popular Badge */}
                  {porte.popular && (
                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold">
                      Mais Escolhido
                    </div>
                  )}

                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r from-${porte.color}-500 to-${porte.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <porte.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/60 font-medium">{porte.faixaUsuarios}</div>
                      <div className="text-sm text-white/80 font-semibold">{porte.faturamentoAnual}</div>
                    </div>
                  </div>

                  {/* Título e Descrição */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                      {porte.nome}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      {porte.descricao}
                    </p>
                  </div>

                  {/* Características */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white/90 mb-3">🎯 Características:</h4>
                    <div className="space-y-2">
                      {porte.caracteristicas.slice(0, 3).map((carac, idx) => (
                        <div key={idx} className="flex items-center text-white/70 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-400" />
                          {carac}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limites do Plano */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white/90 mb-3">📊 Limites:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-xs text-white/60">Projetos</div>
                        <div className="text-sm font-bold text-white">{porte.limitesPlano.projetos}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-xs text-white/60">Usuários</div>
                        <div className="text-sm font-bold text-white">{porte.limitesPlano.usuarios}</div>
                      </div>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{porte.precoSugerido}</div>
                      <div className="text-xs text-white/70">Preço sugerido</div>
                    </div>
                  </div>

                  {/* Recomendado Para */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-white/90 mb-2">✨ Ideal para:</h4>
                    <div className="flex flex-wrap gap-1">
                      {porte.recomendadoPara.slice(0, 2).map((rec, idx) => (
                        <span key={idx} className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-xs">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-xs text-white/60">
                      {porte.limitesPlano.armazenamento}
                    </div>
                    <div className="flex items-center text-blue-300 font-medium text-sm group-hover:text-blue-200 transition-colors">
                      Selecionar
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Configuração da Equipe */
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {porteEscolhido && (
              <div className={`bg-gradient-to-br ${porteEscolhido.bgColor} backdrop-blur-sm border border-white/10 rounded-3xl p-10`}>
                
                {/* Header da Configuração */}
                <div className="text-center mb-10">
                  <div className={`w-20 h-20 bg-gradient-to-r from-${porteEscolhido.color}-500 to-${porteEscolhido.color}-600 rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                    <porteEscolhido.icon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{porteEscolhido.nome}</h2>
                  <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                    {porteEscolhido.descricao}
                  </p>
                </div>

                {/* Configurações Ativadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  
                  {/* Recursos Inclusos */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Recursos Inclusos
                    </h3>
                    <div className="space-y-3">
                      {porteEscolhido.caracteristicas.map((carac, idx) => (
                        <div key={idx} className="flex items-center text-white/80">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mr-3" />
                          <span className="text-sm">{carac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefícios Exclusivos */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Benefícios Exclusivos
                    </h3>
                    <div className="space-y-3">
                      {porteEscolhido.beneficios.map((beneficio, idx) => (
                        <div key={idx} className="flex items-center text-white/80">
                          <Brain className="h-4 w-4 text-blue-400 mr-3" />
                          <span className="text-sm">{beneficio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Limites e Capacidades */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Limites e Capacidades
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{porteEscolhido.limitesPlano.projetos}</div>
                      <div className="text-xs text-white/70">Projetos Simultâneos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{porteEscolhido.limitesPlano.usuarios}</div>
                      <div className="text-xs text-white/70">Usuários</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{porteEscolhido.limitesPlano.armazenamento}</div>
                      <div className="text-xs text-white/70">Armazenamento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{porteEscolhido.limitesPlano.integrações}</div>
                      <div className="text-xs text-white/70">Integrações</div>
                    </div>
                  </div>
                </div>

                {/* Preço e ROI */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 mb-10">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-4">Investimento e Retorno</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{porteEscolhido.precoSugerido}</div>
                        <div className="text-xs text-white/70">Investimento mensal</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">300-600%</div>
                        <div className="text-xs text-white/70">ROI esperado</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">12-24 meses</div>
                        <div className="text-xs text-white/70">Payback</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ideal Para */}
                <div className="bg-white/5 rounded-2xl p-6 mb-10">
                  <h3 className="text-lg font-bold text-white mb-4">✨ Ideal Para:</h3>
                  <div className="flex flex-wrap gap-3">
                    {porteEscolhido.recomendadoPara.map((rec, idx) => (
                      <span key={idx} className="bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm">
                        {rec}
                      </span>
                    ))}
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
                    Escolher Outro Porte
                  </motion.button>
                  
                  <Link href="/onboarding/metodologia">
                    <motion.button
                      className={`flex items-center justify-center px-8 py-4 bg-gradient-to-r from-${porteEscolhido.color}-500 to-${porteEscolhido.color}-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continuar: Metodologia
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation Footer */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding/tipologias"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Tipologias</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 4 de 8 • Porte do Escritório
          </div>
          
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  )
} 