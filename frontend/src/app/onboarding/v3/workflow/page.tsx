'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  GitBranch, 
  Clock,
  Users,
  FileText,
  Calendar,
  Target,
  Zap,
  Settings,
  Sparkles,
  Layers,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  CheckSquare
} from 'lucide-react'

// Interfaces
interface WorkflowPersonalizado {
  workflowsSelecionados: string[]
  etapasPersonalizadas: Record<string, EtapaWorkflow[]>
  aprovacoesPorTipologia: Record<string, string[]>
  responsaveisPorEtapa: Record<string, string>
  prazosPersonalizados: Record<string, number>
  alertasAtivados: string[]
  integracoesSistemas: string[]
}

interface EtapaWorkflow {
  id: string
  nome: string
  descricao: string
  prazoDefault: number
  obrigatoria: boolean
  tipoAprovacao: 'interna' | 'cliente' | 'orgao'
  documentosNecessarios: string[]
  responsavel: 'arquiteto' | 'engenheiro' | 'estagiario' | 'cliente'
}

// Workflows baseados nas NBR 13531/13532
const WORKFLOWS_DISPONIVEIS = {
  'residencial-unifamiliar': {
    nome: 'Residencial Unifamiliar',
    etapas: [
      { id: 'lv', nome: 'Levantamento de Dados', descricao: 'Briefing e análise do terreno', prazoDefault: 5, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Briefing', 'Escritura', 'Topografia'], responsavel: 'arquiteto' },
      { id: 'pn', nome: 'Programa de Necessidades', descricao: 'Definição do programa e estudo de viabilidade', prazoDefault: 3, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['PN', 'Estudo Viabilidade'], responsavel: 'arquiteto' },
      { id: 'ev', nome: 'Estudo de Viabilidade', descricao: 'Análise de viabilidade técnica e legal', prazoDefault: 7, obrigatoria: true, tipoAprovacao: 'interna', documentosNecessarios: ['Análise Zoneamento', 'Viabilidade'], responsavel: 'arquiteto' },
      { id: 'ep', nome: 'Estudo Preliminar', descricao: 'Primeira proposta arquitetônica', prazoDefault: 10, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Plantas', 'Cortes', 'Fachadas', '3D'], responsavel: 'arquiteto' },
      { id: 'ap', nome: 'Anteprojeto', descricao: 'Projeto desenvolvido com detalhes', prazoDefault: 15, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Prancha Técnica', 'Memorial'], responsavel: 'arquiteto' },
      { id: 'pl', nome: 'Projeto Legal', descricao: 'Projeto para aprovação na prefeitura', prazoDefault: 10, obrigatoria: true, tipoAprovacao: 'orgao', documentosNecessarios: ['Prancha Legal', 'ART'], responsavel: 'arquiteto' },
      { id: 'pe', nome: 'Projeto Executivo', descricao: 'Projeto completo para execução', prazoDefault: 20, obrigatoria: false, tipoAprovacao: 'cliente', documentosNecessarios: ['Detalhes', 'Especificações'], responsavel: 'arquiteto' }
    ]
  },
  'comercial-escritorios': {
    nome: 'Comercial - Escritórios',
    etapas: [
      { id: 'lv', nome: 'Levantamento e Briefing', descricao: 'Análise das necessidades comerciais', prazoDefault: 7, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Briefing Comercial', 'Layout Funcional'], responsavel: 'arquiteto' },
      { id: 'ep', nome: 'Estudo Preliminar', descricao: 'Layout funcional e fluxos', prazoDefault: 12, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Plant Baixa', 'Fluxograma'], responsavel: 'arquiteto' },
      { id: 'ap', nome: 'Anteprojeto', descricao: 'Projeto desenvolvido', prazoDefault: 18, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Plantas', 'Cortes', '3D'], responsavel: 'arquiteto' },
      { id: 'pl', nome: 'Projeto Legal', descricao: 'Aprovação AVCB e Prefeitura', prazoDefault: 15, obrigatoria: true, tipoAprovacao: 'orgao', documentosNecessarios: ['AVCB', 'Alvará'], responsavel: 'arquiteto' },
      { id: 'pe', nome: 'Projeto Executivo', descricao: 'Detalhamento completo', prazoDefault: 25, obrigatoria: false, tipoAprovacao: 'cliente', documentosNecessarios: ['Detalhes', 'Mobiliário'], responsavel: 'arquiteto' }
    ]
  },
  'estrutural-residencial': {
    nome: 'Estrutural - Residencial',
    etapas: [
      { id: 'an', nome: 'Análise Arquitetônica', descricao: 'Compatibilização com projeto arquitetônico', prazoDefault: 3, obrigatoria: true, tipoAprovacao: 'interna', documentosNecessarios: ['Projeto Arquitetônico'], responsavel: 'engenheiro' },
      { id: 'la', nome: 'Lançamento', descricao: 'Concepção estrutural e pré-dimensionamento', prazoDefault: 5, obrigatoria: true, tipoAprovacao: 'interna', documentosNecessarios: ['Lançamento Estrutural'], responsavel: 'engenheiro' },
      { id: 'ca', nome: 'Cálculo', descricao: 'Dimensionamento e verificações', prazoDefault: 10, obrigatoria: true, tipoAprovacao: 'interna', documentosNecessarios: ['Memorial Cálculo'], responsavel: 'engenheiro' },
      { id: 'de', nome: 'Detalhamento', descricao: 'Projeto executivo estrutural', prazoDefault: 8, obrigatoria: true, tipoAprovacao: 'cliente', documentosNecessarios: ['Pranchas Estruturais', 'ART'], responsavel: 'engenheiro' }
    ]
  }
}

export default function WorkflowPersonalizado() {
  const router = useRouter()
  const [formData, setFormData] = useState<WorkflowPersonalizado>({
    workflowsSelecionados: [],
    etapasPersonalizadas: {},
    aprovacoesPorTipologia: {},
    responsaveisPorEtapa: {},
    prazosPersonalizados: {},
    alertasAtivados: ['prazo_vencendo', 'aprovacao_pendente'],
    integracoesSistemas: []
  })

  const [tipologiasSelecionadas, setTipologiasSelecionadas] = useState<string[]>([])
  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])
  const [workflowsDisponiveis, setWorkflowsDisponiveis] = useState<any[]>([])

  useEffect(() => {
    // Carregar dados das etapas anteriores
    const dadosAnteriores = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosAnteriores) {
      const dados = JSON.parse(dadosAnteriores)
      
      if (dados.tipologias?.tipologiasSelecionadas) {
        const tipologias = dados.tipologias.tipologiasSelecionadas
        setTipologiasSelecionadas(tipologias)
        gerarWorkflowsDisponiveis(tipologias)
        gerarSugestoesIA(dados, tipologias)
        
                 // Auto-selecionar workflows baseados nas tipologias
         setFormData(prev => ({
           ...prev,
           workflowsSelecionados: tipologias.filter((t: string) => WORKFLOWS_DISPONIVEIS[t as keyof typeof WORKFLOWS_DISPONIVEIS])
         }))
      }
    }
  }, [])

  const gerarWorkflowsDisponiveis = (tipologias: string[]) => {
    const workflows = tipologias
      .map(tipologia => WORKFLOWS_DISPONIVEIS[tipologia as keyof typeof WORKFLOWS_DISPONIVEIS])
      .filter(Boolean)
      .map((workflow, index) => ({
        ...workflow,
        id: tipologias[index]
      }))
    
    setWorkflowsDisponiveis(workflows)
  }

  const gerarSugestoesIA = (dadosAnteriores: any, tipologias: string[]) => {
    const sugestoes: string[] = []
    
    if (tipologias.length > 1) {
      sugestoes.push('🔄 Múltiplas tipologias detectadas: Vamos criar workflows integrados com etapas compartilhadas.')
    }
    
    if (dadosAnteriores?.metodologia?.percentualAtrasos > 30) {
      sugestoes.push('⏰ Alto índice de atrasos: Configuraremos alertas antecipados e prazos buffer.')
    }
    
    if (dadosAnteriores?.identificacao?.porte === 'Solo') {
      sugestoes.push('👤 Escritório solo: Workflows simplificados com foco na produtividade individual.')
    }
    
    if (dadosAnteriores?.perfilTecnico?.disciplinasAtivas?.arquitetura?.ativa && 
        dadosAnteriores?.perfilTecnico?.disciplinasAtivas?.estrutural?.ativa) {
      sugestoes.push('🏗️ Multidisciplinar detectado: Criaremos compatibilização automática entre disciplinas.')
    }
    
    if (dadosAnteriores?.metodologia?.processosQueQueremMelhorar?.includes('Controle de prazos')) {
      sugestoes.push('📅 Foco em prazos: Sistema incluirá marcos automáticos e dashboard de acompanhamento.')
    }

    setSugestoesIA(sugestoes)
  }

  const handleWorkflowToggle = (workflowId: string, enabled: boolean) => {
    setFormData(prev => {
      if (enabled) {
        return {
          ...prev,
          workflowsSelecionados: [...prev.workflowsSelecionados, workflowId]
        }
      } else {
        return {
          ...prev,
          workflowsSelecionados: prev.workflowsSelecionados.filter(id => id !== workflowId)
        }
      }
    })
  }

  const handleVoltar = () => {
    router.push('/onboarding/v3/tipologias')
  }

  const handleContinuar = () => {
    // Salvar dados
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      workflow: formData
    }))
    
    router.push('/onboarding/v3/precificacao')
  }

  const isFormValid = () => {
    return formData.workflowsSelecionados.length > 0
  }

  const calcularTotalEtapas = () => {
    return formData.workflowsSelecionados.reduce((total, workflowId) => {
      const workflow = WORKFLOWS_DISPONIVEIS[workflowId as keyof typeof WORKFLOWS_DISPONIVEIS]
      return total + (workflow?.etapas?.length || 0)
    }, 0)
  }

  const calcularPrazoMedio = () => {
    let totalPrazo = 0
    let totalWorkflows = 0
    
    formData.workflowsSelecionados.forEach(workflowId => {
      const workflow = WORKFLOWS_DISPONIVEIS[workflowId as keyof typeof WORKFLOWS_DISPONIVEIS]
      if (workflow?.etapas) {
        const prazoWorkflow = workflow.etapas.reduce((sum: number, etapa: any) => sum + etapa.prazoDefault, 0)
        totalPrazo += prazoWorkflow
        totalWorkflows++
      }
    })
    
    return totalWorkflows > 0 ? Math.round(totalPrazo / totalWorkflows) : 0
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
              <h1 className="text-2xl font-bold text-white">Workflow Personalizado</h1>
              <p className="text-blue-200/70">Etapa 5 de 8</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-blue-100">62.5% Concluído</span>
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
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-[62.5%] transition-all duration-1000"></div>
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
                  Configurações inteligentes de workflow:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Selecione workflows para receber configurações inteligentes baseadas no seu perfil.
              </p>
            )}
          </motion.div>

          {/* Preview da Configuração */}
          {formData.workflowsSelecionados.length > 0 ? (
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Análise dos Workflows</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formData.workflowsSelecionados.length}</div>
                    <div className="text-xs text-blue-100/60">Workflows Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{calcularTotalEtapas()}</div>
                    <div className="text-xs text-blue-100/60">Total de Etapas</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{calcularPrazoMedio()} dias</div>
                  <div className="text-xs text-blue-100/60">Prazo Médio por Projeto</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
                  <p className="text-sm text-green-300 font-medium">
                    🎯 Sistema criará templates automáticos para cada etapa
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
                  <GitBranch className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Análise dos Workflows</h3>
                <p className="text-sm text-gray-300/70">
                  Configure workflows para ver a análise
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conteúdo Principal - Largura Total */}
        <div className="space-y-6">
          {/* Workflows Disponíveis */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Workflows Inteligentes</h3>
                <p className="text-blue-100/70 text-sm">
                  Baseado nas tipologias selecionadas | Seguindo NBR 13531/13532
                </p>
              </div>
            </div>

            {workflowsDisponiveis.length > 0 ? (
              <div className="space-y-6">
                {workflowsDisponiveis.map((workflow) => {
                  const isSelected = formData.workflowsSelecionados.includes(workflow.id)
                  
                  return (
                    <motion.div
                      key={workflow.id}
                      className={`rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                              <Layers className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{workflow.nome}</h4>
                              <p className="text-blue-100/70 text-sm">
                                {workflow.etapas.length} etapas • {workflow.etapas.reduce((sum: number, etapa: any) => sum + etapa.prazoDefault, 0)} dias
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleWorkflowToggle(workflow.id, !isSelected)}
                              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                                isSelected
                                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                  : 'bg-white/10 text-blue-100 hover:bg-white/20 border border-white/20'
                              }`}
                            >
                              {isSelected ? 'Ativado' : 'Ativar'}
                            </button>
                          </div>
                        </div>

                        {/* Etapas do Workflow */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-white text-sm mb-3">Etapas do Workflow:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {workflow.etapas.map((etapa: any, index: number) => (
                              <div
                                key={etapa.id}
                                className="p-3 bg-white/5 rounded-xl border border-white/10"
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-300">
                                    {index + 1}
                                  </div>
                                  <h6 className="font-semibold text-white text-xs">{etapa.nome}</h6>
                                  {etapa.obrigatoria && (
                                    <AlertCircle className="w-3 h-3 text-yellow-400" />
                                  )}
                                </div>
                                <p className="text-xs text-blue-100/70 mb-2">{etapa.descricao}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-blue-100/60">📅 {etapa.prazoDefault} dias</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    etapa.tipoAprovacao === 'cliente' ? 'bg-green-500/20 text-green-300' :
                                    etapa.tipoAprovacao === 'orgao' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {etapa.tipoAprovacao === 'cliente' ? '👤 Cliente' :
                                     etapa.tipoAprovacao === 'orgao' ? '🏛️ Órgão' : '🔒 Interna'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Nenhuma tipologia selecionada</h4>
                <p className="text-blue-100/70 text-sm">
                  Volte para a etapa anterior e selecione tipologias para gerar workflows
                </p>
              </div>
            )}
          </motion.div>

          {/* Configurações Avançadas */}
          {formData.workflowsSelecionados.length > 0 && (
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
                  <h3 className="text-xl font-bold text-white">Automações Inteligentes</h3>
                  <p className="text-blue-100/70 text-sm">Configurações que serão aplicadas automaticamente</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Gestão de Prazos</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Alertas automáticos, marcos importantes e controle de atrasos
                  </p>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Templates Automáticos</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Documentos e formatos pré-configurados para cada etapa
                  </p>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                    <CheckSquare className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Checklists Inteligentes</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Listas de verificação específicas por tipologia e etapa
                  </p>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Aprovações Automáticas</h4>
                  <p className="text-sm text-blue-100/70 leading-relaxed">
                    Fluxos de aprovação configurados por tipo de projeto
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
              <span>Continuar para Precificação</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 