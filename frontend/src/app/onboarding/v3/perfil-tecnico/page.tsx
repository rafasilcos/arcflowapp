'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Building2, Wrench, Zap, Shield, FileText, Target, Layers, CheckCircle2, Sparkles, Lightbulb, TrendingUp } from 'lucide-react'

// Interfaces baseadas na nossa evolução documentada
interface PerfilTecnicoDetalhado {
  disciplinasAtivas: {
    [key: string]: {
      ativa: boolean
      principal: boolean
      percentualFaturamento: number
      especializacoes: string[]
    }
  }
  tipologiasProjetos: string[]
  metodologiasUtilizadas: string[]
  ferramentasCAD: string[]
  certificacoes: string[]
  diferenciaisCompetitivos: string[]
}

const DISCIPLINAS_OPCOES = [
  {
    id: 'arquitetura',
    nome: 'Arquitetura e Urbanismo',
    icon: Building2,
    color: 'blue',
    bgColor: 'from-blue-500/10 to-cyan-500/10',
    especializacoes: [
      'Projetos Residenciais',
      'Projetos Comerciais', 
      'Projetos Institucionais',
      'Urbanismo e Paisagismo',
      'Interiores',
      'Patrimônio Histórico',
      'Sustentabilidade'
    ],
    tipologias: [
      'Residencial Unifamiliar',
      'Residencial Multifamiliar', 
      'Comercial/Corporativo',
      'Educacional',
      'Hospitalar',
      'Hotelaria',
      'Industrial',
      'Esportivo/Cultural'
    ],
    ferramentasCAD: ['AutoCAD', 'Revit', 'SketchUp', 'ArchiCAD', 'Rhino', 'Lumion', 'V-Ray'],
    metodologias: ['BIM', 'Lean Construction', 'Design Thinking', 'Co-criação', 'Pesquisa Pós-Ocupação']
  },
  {
    id: 'estrutural',
    nome: 'Engenharia Estrutural',
    icon: Wrench,
    color: 'orange',
    bgColor: 'from-orange-500/10 to-red-500/10',
    especializacoes: [
      'Concreto Armado',
      'Estruturas Metálicas',
      'Estruturas Mistas',
      'Alvenaria Estrutural', 
      'Madeira',
      'Fundações',
      'Pontes e Viadutos',
      'Estruturas Especiais'
    ],
    tipologias: [
      'Residencial',
      'Comercial/Industrial',
      'Pontes',
      'Infraestrutura',
      'Grandes Vãos',
      'Torres/Edifícios Altos',
      'Estruturas Especiais'
    ],
    ferramentasCAD: ['AutoCAD', 'Revit Structure', 'TQS', 'SAP2000', 'Robot', 'CypeCAD', 'Eberick'],
    metodologias: ['BIM', 'Análise Não-Linear', 'Otimização Estrutural', 'MEF', 'Análise Sísmica']
  },
  {
    id: 'instalacoes',
    nome: 'Engenharia de Instalações',
    icon: Zap,
    color: 'yellow',
    bgColor: 'from-yellow-500/10 to-orange-500/10',
    especializacoes: [
      'Instalações Elétricas',
      'Instalações Hidráulicas',
      'Ar Condicionado/AVAC',
      'Prevenção Incêndio (PPCI)',
      'Automação Predial',
      'Telecomunicações',
      'Gases Medicinais',
      'Energia Solar'
    ],
    tipologias: [
      'Residencial',
      'Comercial',
      'Industrial',
      'Hospitalar',
      'Data Centers',
      'Laboratórios',
      'Hotelaria'
    ],
    ferramentasCAD: ['AutoCAD', 'Revit MEP', 'QiBuilder', 'AltoQi', 'DDS-CAD', 'Dialux', 'HAP'],
    metodologias: ['BIM', 'Comissionamento', 'Eficiência Energética', 'LEED', 'Automação']
  },
  {
    id: 'ambiental',
    nome: 'Engenharia Ambiental',
    icon: Shield,
    color: 'green', 
    bgColor: 'from-green-500/10 to-emerald-500/10',
    especializacoes: [
      'Licenciamento Ambiental',
      'EIA/RIMA',
      'Gestão de Resíduos',
      'Controle de Poluição',
      'Recursos Hídricos',
      'Monitoramento Ambiental',
      'Sustentabilidade',
      'Perícias Ambientais'
    ],
    tipologias: [
      'Indústrias',
      'Infraestrutura',
      'Mineração',
      'Energético',
      'Imobiliário',
      'Saneamento',
      'Portuário'
    ],
    ferramentasCAD: ['AutoCAD', 'ArcGIS', 'QGIS', 'Global Mapper', 'Surfer'],
    metodologias: ['ISO 14001', 'Avaliação de Impacto', 'Gestão Integrada', 'Due Diligence']
  },
  {
    id: 'consultoria',
    nome: 'Consultoria e Perícias',
    icon: FileText,
    color: 'purple',
    bgColor: 'from-purple-500/10 to-pink-500/10',
    especializacoes: [
      'Perícias Judiciais',
      'Avaliações Imobiliárias',
      'Inspeções Prediais',
      'Laudos Técnicos',
      'Consultorias Especializadas',
      'Pareceres Técnicos',
      'Vistorias',
      'Assessoria Técnica'
    ],
    tipologias: [
      'Perícias Cíveis',
      'Perícias Criminais',
      'Avaliações',
      'Inspeções',
      'Consultorias',
      'Laudos Diversos'
    ],
    ferramentasCAD: ['AutoCAD', 'SketchUp', 'Ferramentas de Medição'],
    metodologias: ['NBR 14653', 'Metodologias de Avaliação', 'Inspeção Predial', 'Análise Forense']
  },
  {
    id: 'multidisciplinar',
    nome: 'Escritório Multidisciplinar',
    icon: Target,
    color: 'indigo',
    bgColor: 'from-indigo-500/10 to-blue-500/10',
    especializacoes: [
      'Coordenação BIM',
      'Gestão de Projetos',
      'Compatibilização',
      'Projetos Integrados',
      'Consultoria Geral',
      'Coordenação Técnica'
    ],
    tipologias: [
      'Projetos Completos',
      'Coordenação',
      'BIM Management',
      'Facility Management'
    ],
    ferramentasCAD: ['Revit', 'Navisworks', 'BIM 360', 'Solibri', 'AutoCAD'],
    metodologias: ['BIM', 'IPD', 'Lean Construction', 'PMI', 'Coordenação Integrada']
  }
]

export default function PerfilTecnicoDetalhado() {
  const router = useRouter()
  const [dadosIdentificacao, setDadosIdentificacao] = useState<any>(null)
  const [formData, setFormData] = useState<PerfilTecnicoDetalhado>({
    disciplinasAtivas: {},
    tipologiasProjetos: [],
    metodologiasUtilizadas: [],
    ferramentasCAD: [],
    certificacoes: [],
    diferenciaisCompetitivos: []
  })

  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])

  useEffect(() => {
    // Carregar dados da etapa anterior
    const dadosAnteriores = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosAnteriores) {
      const dados = JSON.parse(dadosAnteriores)
      setDadosIdentificacao(dados.identificacao)
    }
  }, [])

  // Lógica inteligente para sugestões baseadas no perfil
  const gerarSugestoesIA = () => {
    const sugestoes: string[] = []
    const disciplinasAtivas = Object.keys(formData.disciplinasAtivas).filter(d => formData.disciplinasAtivas[d].ativa)
    
    if (disciplinasAtivas.length === 0) {
      sugestoes.push('🎯 Selecione suas disciplinas para receber configurações personalizadas')
      return
    }

    if (disciplinasAtivas.length === 1) {
      sugestoes.push('⚡ Foco especializado: workflows otimizados para sua disciplina')
      sugestoes.push('📈 Templates específicos aumentam produtividade em 40%')
    }

    if (disciplinasAtivas.length > 1) {
      sugestoes.push('🔄 Multidisciplinar: Sistema configurará compatibilização automática')
      sugestoes.push('👥 Gestão integrada de equipes por disciplina')
    }

    if (disciplinasAtivas.includes('arquitetura') && disciplinasAtivas.includes('estrutural')) {
      sugestoes.push('🏗️ Arquitetura + Estrutural: Compatibilização BIM automática')
    }

    if (formData.metodologiasUtilizadas.includes('BIM')) {
      sugestoes.push('🎯 BIM detectado: Integração com Revit e Navisworks')
    }

    setSugestoesIA(sugestoes)
  }

  const handleDisciplinaChange = (disciplinaId: string, ativa: boolean) => {
    setFormData(prev => ({
      ...prev,
      disciplinasAtivas: {
        ...prev.disciplinasAtivas,
        [disciplinaId]: {
          ...prev.disciplinasAtivas[disciplinaId],
          ativa,
          principal: ativa ? prev.disciplinasAtivas[disciplinaId]?.principal || false : false,
          percentualFaturamento: ativa ? prev.disciplinasAtivas[disciplinaId]?.percentualFaturamento || 0 : 0,
          especializacoes: ativa ? prev.disciplinasAtivas[disciplinaId]?.especializacoes || [] : []
        }
      }
    }))
    
    // Limpar tipologias se não há mais disciplinas compatíveis
    if (!ativa) {
      const tipologiasValidas = getOpcoesDisponiveis().tipologias
      setFormData(prev => ({
        ...prev,
        tipologiasProjetos: prev.tipologiasProjetos.filter(t => tipologiasValidas.includes(t))
      }))
    }
    
    setTimeout(gerarSugestoesIA, 100)
  }

  const handleEspecializacaoChange = (disciplinaId: string, especializacao: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      disciplinasAtivas: {
        ...prev.disciplinasAtivas,
        [disciplinaId]: {
          ...prev.disciplinasAtivas[disciplinaId],
          especializacoes: checked 
            ? [...(prev.disciplinasAtivas[disciplinaId]?.especializacoes || []), especializacao]
            : (prev.disciplinasAtivas[disciplinaId]?.especializacoes || []).filter(e => e !== especializacao)
        }
      }
    }))
  }

  const setDisciplinaPrincipal = (disciplinaId: string) => {
    setFormData(prev => {
      const novasDisciplinas = { ...prev.disciplinasAtivas }
      
      // Remove principal de todas
      Object.keys(novasDisciplinas).forEach(id => {
        if (novasDisciplinas[id]) {
          novasDisciplinas[id].principal = false
        }
      })
      
      // Define a nova principal
      if (novasDisciplinas[disciplinaId]) {
        novasDisciplinas[disciplinaId].principal = true
      }
      
      return {
        ...prev,
        disciplinasAtivas: novasDisciplinas
      }
    })
  }

  // Função para retornar opções disponíveis baseadas nas disciplinas selecionadas
  const getOpcoesDisponiveis = () => {
    const disciplinasAtivas = Object.keys(formData.disciplinasAtivas).filter(d => formData.disciplinasAtivas[d].ativa)
    
    if (disciplinasAtivas.length === 0) {
      return { tipologias: [], ferramentasCAD: [], metodologias: [] }
    }

    const disciplinasObjetos = DISCIPLINAS_OPCOES.filter(d => disciplinasAtivas.includes(d.id))
    
    // Combinar todas as opções das disciplinas ativas
    const tipologias = [...new Set(disciplinasObjetos.flatMap(d => d.tipologias))]
    const ferramentasCAD = [...new Set(disciplinasObjetos.flatMap(d => d.ferramentasCAD))]
    const metodologias = [...new Set(disciplinasObjetos.flatMap(d => d.metodologias))]
    
    return { tipologias, ferramentasCAD, metodologias }
  }

  const handleContinuar = () => {
    // Salvar dados no localStorage
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      perfilTecnico: formData
    }))
    
    // Navegar para próxima etapa
    router.push('/onboarding/v3/metodologia')
  }

  const isFormValid = () => {
    const disciplinasAtivas = Object.keys(formData.disciplinasAtivas).filter(d => formData.disciplinasAtivas[d].ativa)
    const temPrincipal = Object.values(formData.disciplinasAtivas).some(d => d.principal)
    
    return disciplinasAtivas.length > 0 && temPrincipal
  }

  const opcoesDisponiveis = getOpcoesDisponiveis()
  const disciplinasAtivas = Object.keys(formData.disciplinasAtivas).filter(d => formData.disciplinasAtivas[d].ativa)

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header com Progress */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Layers className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Perfil Técnico Detalhado
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-3xl mx-auto">
            Selecione suas disciplinas técnicas e especializações. O sistema configurará automaticamente workflows, templates e automações específicas para sua atuação.
          </p>
          
          {/* Progress Bar Elegante */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100/60 text-sm">Etapa 2 de 8</span>
              <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <span className="text-sm text-blue-100">25% Concluído</span>
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: '25%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-blue-100/60 text-sm mt-2">Definição de Disciplinas e Especialidades</p>
          </div>
        </motion.div>

        {/* Cards IA e Configuração no Topo */}
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
                  Configurações inteligentes:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Selecione suas disciplinas para receber configurações inteligentes personalizadas.
              </p>
            )}
          </motion.div>

          {/* Preview da Configuração */}
          {disciplinasAtivas.length > 0 ? (
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Configuração Técnica</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-blue-100/60 mb-2">Disciplinas Ativas:</p>
                  <div className="space-y-1">
                    {disciplinasAtivas.map(id => {
                      const disciplina = DISCIPLINAS_OPCOES.find(d => d.id === id)
                      const isPrincipal = formData.disciplinasAtivas[id]?.principal
                      return (
                        <div key={id} className="flex items-center justify-between">
                          <span className="text-xs text-blue-100">{disciplina?.nome}</span>
                          {isPrincipal && <span className="text-xs text-yellow-300">⭐</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {formData.tipologiasProjetos.length > 0 && (
                  <div>
                    <p className="text-sm text-blue-100/60 mb-2">Tipologias:</p>
                    <p className="text-xs text-blue-100">{formData.tipologiasProjetos.length} selecionadas</p>
                  </div>
                )}
                
                <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
                  <p className="text-sm text-green-300 font-medium">
                    🎯 Sistema configurará {disciplinasAtivas.length} workflow(s) integrado(s)
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
                  <Lightbulb className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Configuração Técnica</h3>
                <p className="text-sm text-gray-300/70">
                  Selecione disciplinas para ver a configuração
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conteúdo Principal - Largura Total */}
        <div className="space-y-6">
            {/* Seleção de Disciplinas */}
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Disciplinas Técnicas</h3>
                  <p className="text-blue-100/70 text-sm">Selecione todas as disciplinas que seu escritório atua (pode marcar várias)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DISCIPLINAS_OPCOES.map((disciplina) => {
                  const IconComponent = disciplina.icon
                  const isAtiva = formData.disciplinasAtivas[disciplina.id]?.ativa || false
                  const isPrincipal = formData.disciplinasAtivas[disciplina.id]?.principal || false
                  
                  return (
                    <motion.div
                      key={disciplina.id}
                      className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isAtiva
                          ? `bg-gradient-to-br ${disciplina.bgColor} border-white/30 scale-105`
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => handleDisciplinaChange(disciplina.id, !isAtiva)}
                      whileHover={{ scale: isAtiva ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-${disciplina.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-6 h-6 text-${disciplina.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1">{disciplina.nome}</h4>
                          <p className="text-blue-100/70 text-xs leading-relaxed">
                            {disciplina.especializacoes.slice(0, 3).join(', ')}
                            {disciplina.especializacoes.length > 3 && '...'}
                          </p>
                          
                          {isAtiva && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-xs font-medium">Ativa</span>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDisciplinaPrincipal(disciplina.id)
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  isPrincipal
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                                    : 'bg-white/10 text-blue-100/70 hover:bg-white/20'
                                }`}
                              >
                                {isPrincipal ? '⭐ Principal' : 'Definir como Principal'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Especializações por Disciplina */}
            {disciplinasAtivas.length > 0 && (
              <motion.div
                className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Especializações</h3>
                    <p className="text-blue-100/70 text-sm">Selecione as especializações para cada disciplina ativa</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {disciplinasAtivas.map((disciplinaId) => {
                    const disciplina = DISCIPLINAS_OPCOES.find(d => d.id === disciplinaId)
                    if (!disciplina) return null
                    
                    const IconComponent = disciplina.icon
                    
                    return (
                      <div key={disciplinaId} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-8 h-8 bg-${disciplina.color}-500/20 rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`w-4 h-4 text-${disciplina.color}-400`} />
                          </div>
                          <h4 className="font-semibold text-white">{disciplina.nome}</h4>
                          {formData.disciplinasAtivas[disciplinaId]?.principal && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-lg">Principal</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {disciplina.especializacoes.map((especializacao) => {
                            const isSelected = formData.disciplinasAtivas[disciplinaId]?.especializacoes?.includes(especializacao) || false
                            
                            return (
                              <div
                                key={especializacao}
                                className={`p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                  isSelected
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white/5 text-blue-100/70 hover:bg-white/10'
                                }`}
                                onClick={() => handleEspecializacaoChange(disciplinaId, especializacao, !isSelected)}
                              >
                                {especializacao}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Tipologias de Projetos (Dinâmico) */}
            {opcoesDisponiveis.tipologias.length > 0 && (
              <motion.div
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Tipologias de Projetos</h3>
                    <p className="text-blue-100/70 text-sm">Baseado nas disciplinas selecionadas - escolha as tipologias que trabalha</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {opcoesDisponiveis.tipologias.map((tipologia) => {
                    const isSelected = formData.tipologiasProjetos.includes(tipologia)
                    
                    return (
                      <div
                        key={tipologia}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-300 text-sm ${
                          isSelected
                            ? 'bg-white/20 text-white border border-white/30 scale-105'
                            : 'bg-white/5 text-blue-100/70 hover:bg-white/10 hover:scale-102'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            tipologiasProjetos: isSelected
                              ? prev.tipologiasProjetos.filter(t => t !== tipologia)
                              : [...prev.tipologiasProjetos, tipologia]
                          }))
                        }}
                      >
                        {tipologia}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Navegação */}
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => router.push('/onboarding/v3/identificacao')}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar: Identificação</span>
              </button>
              
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