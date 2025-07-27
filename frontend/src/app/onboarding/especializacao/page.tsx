'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Building2, 
  Wrench, 
  Zap, 
  Shield, 
  FileText, 
  Target,
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Brain,
  Settings,
  Layers,
  Calculator,
  Eye,
  Gauge
} from 'lucide-react'
import Link from 'next/link'

interface EspecializacaoTecnica {
  id: string
  nome: string
  descricao: string
  disciplinas: string[]
  ferramentas: string[]
  metodologias: string[]
  automacoes: string[]
  icon: any
  color: string
  bgColor: string
  complexidade: 'Básica' | 'Intermediária' | 'Avançada'
  tempoConfiguracao: string
}

const especializacoesTecnicas: EspecializacaoTecnica[] = [
  {
    id: 'arquitetura-completa',
    nome: 'Arquitetura Completa',
    descricao: 'Configuração completa para escritórios de arquitetura com todas as disciplinas integradas',
    disciplinas: ['Arquitetura', 'Interiores', 'Paisagismo', 'Decoração'],
    ferramentas: ['AutoCAD', 'Revit', 'SketchUp', 'Lumion', 'V-Ray'],
    metodologias: ['NBR 13532', 'BIM Level 2', 'Design Thinking', 'Lean Design'],
    automacoes: ['Briefing 230 perguntas', 'Programa automático', 'Cronograma NBR', 'Orçamento por m²'],
    icon: Building2,
    color: 'blue',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    complexidade: 'Avançada',
    tempoConfiguracao: '15-20 min'
  },
  {
    id: 'estrutural-especializada',
    nome: 'Estrutural Especializada',
    descricao: 'Configuração otimizada para cálculos estruturais com automação de dimensionamentos',
    disciplinas: ['Estrutural', 'Fundações', 'Contenções'],
    ferramentas: ['SAP2000', 'ETABS', 'TQS', 'Cypecad', 'Robot'],
    metodologias: ['NBR 6118', 'Eurocode', 'ACI', 'Templates Padronizados'],
    automacoes: ['Pré-dimensionamento IA', 'Compatibilização automática', 'Memorial de cálculo', 'ART automática'],
    icon: Wrench,
    color: 'orange',
    bgColor: 'from-orange-500/20 to-red-500/20',
    complexidade: 'Avançada',
    tempoConfiguracao: '10-15 min'
  },
  {
    id: 'instalacoes-inteligentes',
    nome: 'Instalações Inteligentes',
    descricao: 'Automação completa para projetos de instalações com dimensionamento IA',
    disciplinas: ['Elétrica', 'Hidráulica', 'AVAC', 'Automação'],
    ferramentas: ['QiBuilder', 'Lumine', 'Hydros', 'DDS-CAD'],
    metodologias: ['NBR 5410', 'NBR 5626', 'ASHRAE', 'Eficiência Energética'],
    automacoes: ['Dimensionamento automático', 'Análise energética', 'Lista de materiais', 'Memoriais técnicos'],
    icon: Zap,
    color: 'yellow',
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    complexidade: 'Intermediária',
    tempoConfiguracao: '8-12 min'
  },
  {
    id: 'multidisciplinar-bim',
    nome: 'Multidisciplinar BIM',
    descricao: 'Coordenação BIM avançada para escritórios que trabalham com múltiplas disciplinas',
    disciplinas: ['Coordenação BIM', 'Compatibilização', 'Gestão de Modelos'],
    ferramentas: ['Revit', 'Navisworks', 'BIM 360', 'Solibri', 'Tekla'],
    metodologias: ['BIM Level 3', 'ISO 19650', 'Lean Construction', 'IPD'],
    automacoes: ['Clash detection', 'Relatórios automáticos', 'Versionamento', 'Coordenação 4D/5D'],
    icon: Target,
    color: 'indigo',
    bgColor: 'from-indigo-500/20 to-blue-500/20',
    complexidade: 'Avançada',
    tempoConfiguracao: '20-25 min'
  },
  {
    id: 'consultoria-pericia',
    nome: 'Consultoria e Perícia',
    descricao: 'Templates especializados para laudos técnicos, perícias e consultorias',
    disciplinas: ['Perícias', 'Laudos', 'Consultorias', 'Pareceres'],
    ferramentas: ['Templates Laudos', 'Checklist Inspeção', 'Relatórios Automáticos'],
    metodologias: ['NBR 13752', 'Metodologia Científica', 'Análise Forense'],
    automacoes: ['Laudos automáticos', 'Checklist digital', 'Relatórios padronizados', 'Cronograma perícias'],
    icon: FileText,
    color: 'purple',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    complexidade: 'Intermediária',
    tempoConfiguracao: '5-10 min'
  },
  {
    id: 'ambiental-compliance',
    nome: 'Ambiental e Compliance',
    descricao: 'Gestão ambiental automatizada com compliance e monitoramento IoT',
    disciplinas: ['Licenciamento', 'EIA/RIMA', 'Monitoramento', 'Compliance'],
    ferramentas: ['GIS', 'Sensores IoT', 'Dashboards Ambientais', 'Relatórios Automáticos'],
    metodologias: ['ISO 14001', 'CONAMA', 'Legislação Ambiental', 'Sustentabilidade'],
    automacoes: ['Compliance automático', 'Alertas ambientais', 'Relatórios periódicos', 'Monitoramento IoT'],
    icon: Shield,
    color: 'green',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    complexidade: 'Avançada',
    tempoConfiguracao: '12-18 min'
  }
]

export default function EspecializacaoPage() {
  const [especializacoesSelecionadas, setEspecializacoesSelecionadas] = useState<string[]>([])
  const [etapaAtual, setEtapaAtual] = useState<'selecao' | 'configuracao'>('selecao')

  const handleToggleEspecializacao = (especializacaoId: string) => {
    setEspecializacoesSelecionadas(prev => 
      prev.includes(especializacaoId)
        ? prev.filter(id => id !== especializacaoId)
        : [...prev, especializacaoId]
    )
  }

  const especializacoesEscolhidas = especializacoesTecnicas.filter(e => 
    especializacoesSelecionadas.includes(e.id)
  )

  const tempoTotalConfiguracao = especializacoesEscolhidas.reduce((total, esp) => {
    const tempo = parseInt(esp.tempoConfiguracao.split('-')[1])
    return total + tempo
  }, 0)

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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {etapaAtual === 'selecao' ? 'Especialização Técnica' : 'Configuração Avançada'}
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-4xl mx-auto">
            {etapaAtual === 'selecao' 
              ? 'Selecione suas especializações técnicas. O ArcFlow configurará automações, templates e workflows específicos para cada disciplina.'
              : 'Confirme as configurações técnicas. O sistema ativará todas as automações e integrações selecionadas.'
            }
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <div className="bg-green-500/20 text-green-200 px-4 py-2 rounded-full text-sm font-medium">
              ✅ Perfil AEC Definido
            </div>
            <div className="bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
              🔧 Configurando Especialização
            </div>
            <div className="bg-gray-500/20 text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              📋 Próximo: Tipologias
            </div>
          </div>
        </motion.div>

        {etapaAtual === 'selecao' ? (
          /* Seleção de Especializações */
          <>
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {especializacoesTecnicas.map((esp, index) => {
                const isSelected = especializacoesSelecionadas.includes(esp.id)
                
                return (
                  <motion.div
                    key={esp.id}
                    className={`relative group cursor-pointer`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    onClick={() => handleToggleEspecializacao(esp.id)}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`relative bg-gradient-to-br ${esp.bgColor} backdrop-blur-sm border-2 rounded-3xl p-6 h-full transition-all duration-300 ${
                      isSelected 
                        ? 'border-white/40 shadow-2xl ring-2 ring-white/20' 
                        : 'border-white/10 group-hover:border-white/20 group-hover:shadow-xl'
                    }`}>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                      )}

                      {/* Header do Card */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-${esp.color}-500 to-${esp.color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <esp.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            esp.complexidade === 'Básica' ? 'bg-green-500/20 text-green-300' :
                            esp.complexidade === 'Intermediária' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {esp.complexidade}
                          </div>
                        </div>
                      </div>

                      {/* Título e Descrição */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                          {esp.nome}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {esp.descricao}
                        </p>
                      </div>

                      {/* Disciplinas */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-white/90 mb-2">🎯 Disciplinas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {esp.disciplinas.map((disc, idx) => (
                            <span key={idx} className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-xs">
                              {disc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Automações */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-white/90 mb-2">🤖 Automações IA:</h4>
                        <div className="space-y-1">
                          {esp.automacoes.slice(0, 2).map((auto, idx) => (
                            <div key={idx} className="flex items-center text-white/70 text-xs">
                              <Sparkles className="h-3 w-3 mr-2 text-blue-400" />
                              {auto}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="text-xs text-white/60">
                          ⏱️ {esp.tempoConfiguracao}
                        </div>
                        <div className={`text-xs font-medium ${isSelected ? 'text-green-300' : 'text-blue-300'}`}>
                          {isSelected ? 'Selecionado' : 'Selecionar'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Summary e CTA */}
            {especializacoesSelecionadas.length > 0 && (
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
                        {especializacoesSelecionadas.length} Especialização(ões) Selecionada(s)
                      </h3>
                      <p className="text-white/70 text-sm">
                        Tempo estimado de configuração: ~{tempoTotalConfiguracao} minutos
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {especializacoesEscolhidas.map((esp) => (
                          <span key={esp.id} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs">
                            {esp.nome}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setEtapaAtual('configuracao')}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Configurar Especializações
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Configuração Detalhada */
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
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Configuração Técnica Avançada</h2>
                <p className="text-white/80 leading-relaxed">
                  O ArcFlow ativará todas as automações e integrações para suas especializações selecionadas.
                </p>
              </div>

              {/* Lista de Configurações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {especializacoesEscolhidas.map((esp, index) => (
                  <motion.div
                    key={esp.id}
                    className={`bg-gradient-to-br ${esp.bgColor} rounded-2xl p-6 border border-white/10`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r from-${esp.color}-500 to-${esp.color}-600 rounded-lg flex items-center justify-center mr-3`}>
                        <esp.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{esp.nome}</h3>
                        <div className="text-xs text-white/60">{esp.tempoConfiguracao}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-2">🔧 Ferramentas Integradas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {esp.ferramentas.slice(0, 3).map((ferr, idx) => (
                            <span key={idx} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                              {ferr}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-2">🤖 Automações:</h4>
                        <div className="space-y-1">
                          {esp.automacoes.slice(0, 2).map((auto, idx) => (
                            <div key={idx} className="flex items-center text-white/70 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-2 text-green-400" />
                              {auto}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Resumo Final */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2" />
                  Configuração Completa
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{especializacoesEscolhidas.length}</div>
                    <div className="text-xs text-white/70">Especializações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{especializacoesEscolhidas.reduce((total, esp) => total + esp.disciplinas.length, 0)}</div>
                    <div className="text-xs text-white/70">Disciplinas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{especializacoesEscolhidas.reduce((total, esp) => total + esp.automacoes.length, 0)}</div>
                    <div className="text-xs text-white/70">Automações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">~{tempoTotalConfiguracao}min</div>
                    <div className="text-xs text-white/70">Configuração</div>
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
                  Ajustar Seleção
                </motion.button>
                
                <Link href="/onboarding/tipologias">
                  <motion.button
                    className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continuar: Tipologias
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
            href="/onboarding/perfil"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Perfil</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 2 de 8 • Especialização Técnica
          </div>
          
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  )
} 