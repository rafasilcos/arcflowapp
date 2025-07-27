'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Activity, 
  Save, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Eye,
  Settings,
  BarChart3,
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
  Download,
  Upload,
  Database,
  Server,
  Monitor
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usePageEnterprise, useFormEnterprise, useDashboardEnterprise, useBriefingEnterprise } from '@/hooks/usePageEnterprise'

export default function TestEnterpriseCompletePage() {
  // 📝 FORMULÁRIOS DE DEMONSTRAÇÃO
  const [formData1, setFormData1] = useState({
    nome: '',
    email: '',
    projeto: '',
    observacoes: ''
  })

  const [formData2, setFormData2] = useState({
    cliente: '',
    orcamento: '',
    prazo: '',
    especificacoes: ''
  })

  const [briefingData, setBriefingData] = useState({
    tipologia: '',
    area: '',
    programa: '',
    requisitos: ''
  })

  // 🏢 ENTERPRISE HOOKS - DIFERENTES TIPOS
  const pageEnterprise = usePageEnterprise({
    pageInfo: {
      name: 'Demo Enterprise Completa',
      module: 'demonstracao',
      critical: true
    }
  })

  const formEnterprise1 = useFormEnterprise(
    formData1,
    async (data) => {
      console.log('💾 [FORM-1] Salvando dados do formulário 1:', data)
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500))
    },
    'cadastro-projeto'
  )

  const formEnterprise2 = useFormEnterprise(
    formData2,
    async (data) => {
      console.log('💾 [FORM-2] Salvando dados do formulário 2:', data)
      // Simular API call com erro ocasional para testar
      if (Math.random() > 0.8) {
        throw new Error('Erro simulado de conexão')
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
    },
    'orcamento-detalhado'
  )

  const briefingEnterprise = useBriefingEnterprise(
    briefingData,
    async (data) => {
      console.log('💾 [BRIEFING] Salvando dados do briefing:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    'briefing-residencial'
  )

  const dashboardEnterprise = useDashboardEnterprise('demo-completa')

  // 📊 SIMULAÇÃO DE DADOS DINÂMICOS
  const [simulationActive, setSimulationActive] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online')

  // 🎭 SIMULAÇÕES PARA DEMONSTRAÇÃO
  const startDataSimulation = () => {
    setSimulationActive(true)
    
    const fields1 = [
      { key: 'nome', value: 'João Silva Arquiteto' },
      { key: 'email', value: 'joao@arquitetura.com' },
      { key: 'projeto', value: 'Residência Sustentável Premium' },
      { key: 'observacoes', value: 'Projeto com foco em sustentabilidade e tecnologia avançada, utilizando materiais eco-friendly e sistemas de automação residencial.' }
    ]

    const fields2 = [
      { key: 'cliente', value: 'Família Costa' },
      { key: 'orcamento', value: 'R$ 2.500.000,00' },
      { key: 'prazo', value: '18 meses' },
      { key: 'especificacoes', value: 'Casa de 350m² com 4 suítes, piscina, área gourmet, sistema fotovoltaico, automação completa e paisagismo integrado.' }
    ]

    const briefingFields = [
      { key: 'tipologia', value: 'Residencial Unifamiliar' },
      { key: 'area', value: '350m² área construída, terreno 800m²' },
      { key: 'programa', value: '4 suítes, 2 salas, cozinha gourmet, escritório, área de serviço, garagem 4 carros' },
      { key: 'requisitos', value: 'Sustentabilidade máxima, automação residencial, piscina com deck, área gourmet integrada, jardim vertical' }
    ]

    // Simular preenchimento gradual
    let index = 0
    const fillNext = () => {
      if (index < fields1.length) {
        const field = fields1[index]
        setFormData1(prev => ({ ...prev, [field.key]: field.value }))
      }
      
      if (index < fields2.length) {
        const field = fields2[index]
        setFormData2(prev => ({ ...prev, [field.key]: field.value }))
      }
      
      if (index < briefingFields.length) {
        const field = briefingFields[index]
        setBriefingData(prev => ({ ...prev, [field.key]: field.value }))
      }
      
      index++
      if (index < Math.max(fields1.length, fields2.length, briefingFields.length)) {
        setTimeout(fillNext, 1500)
      } else {
        setSimulationActive(false)
      }
    }
    
    fillNext()
  }

  const simulateNetworkIssue = () => {
    setNetworkStatus('offline')
    setTimeout(() => setNetworkStatus('slow'), 3000)
    setTimeout(() => setNetworkStatus('online'), 6000)
  }

  const forceMultiSave = async () => {
    console.log('🚀 [DEMO] Forçando salvamento de TODOS os formulários')
    
    try {
      await Promise.all([
        formEnterprise1.page.forceSaveAll(),
        formEnterprise2.page.forceSaveAll(),
        briefingEnterprise.page.forceSaveAll()
      ])
      
      console.log('✅ [DEMO] Todos os dados salvos com sucesso!')
    } catch (error) {
      console.error('❌ [DEMO] Erro no salvamento múltiplo:', error)
    }
  }

  // 📊 ESTATÍSTICAS COMBINADAS
  const getCombinedStats = () => {
    return {
      totalForms: 3,
      activeAutoSaves: [
        formEnterprise1.autoSave.enabled,
        formEnterprise2.autoSave.enabled,
        briefingEnterprise.autoSave.enabled
      ].filter(Boolean).length,
      hasUnsavedChanges: [
        formEnterprise1.autoSave.hasUnsaved,
        formEnterprise2.autoSave.hasUnsaved,
        briefingEnterprise.autoSave.hasUnsaved
      ].some(Boolean),
      totalTabs: dashboardEnterprise.multiTab.tabCount,
      sessionTime: pageEnterprise.session.totalTime,
      pageInteractions: pageEnterprise.page.stats.interactions
    }
  }

  const stats = getCombinedStats()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER ENTERPRISE */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3 mb-4"
        >
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ArcFlow Enterprise System
          </h1>
          <Zap className="w-8 h-8 text-purple-600" />
        </motion.div>
        
        <p className="text-gray-600 text-lg">
          Demonstração completa de TODAS as funcionalidades enterprise ativas em TODO o sistema
        </p>
        
        <div className="flex justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✅ Auto-save Ativo
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            🔄 Multi-tab Sync
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            🛡️ Session Management
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            💾 Zero Data Loss
          </Badge>
        </div>
      </div>

      {/* STATUS ENTERPRISE GLOBAL */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Status Enterprise Global</span>
            <Badge className="bg-green-100 text-green-700">ATIVO</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.activeAutoSaves}</div>
              <div className="text-sm text-gray-600">Auto-saves Ativos</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.totalTabs}</div>
              <div className="text-sm text-gray-600">Abas Sincronizadas</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {pageEnterprise.utils.formatTime(stats.sessionTime)}
              </div>
              <div className="text-sm text-gray-600">Tempo de Sessão</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.pageInteractions}</div>
              <div className="text-sm text-gray-600">Interações</div>
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <Button
              onClick={startDataSimulation}
              disabled={simulationActive}
              className="flex-1"
            >
              {simulationActive ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Simulando Trabalho...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  🎭 Simular Trabalho Completo
                </>
              )}
            </Button>
            
            <Button onClick={forceMultiSave} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              💾 Salvar Tudo
            </Button>
            
            <Button onClick={simulateNetworkIssue} variant="outline">
              {networkStatus === 'online' ? (
                <Wifi className="w-4 h-4 mr-2" />
              ) : (
                <WifiOff className="w-4 h-4 mr-2" />
              )}
              🌐 Simular Rede
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FORMULÁRIOS DE DEMONSTRAÇÃO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORMULÁRIO 1: CADASTRO DE PROJETO */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-green-600" />
                <span>Formulário 1: Projeto</span>
              </div>
              <div className="flex items-center space-x-2">
                {formEnterprise1.autoSave.hasUnsaved && (
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    Não salvo
                  </Badge>
                )}
                {formEnterprise1.autoSave.status?.isAutoSaving && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                )}
                {formEnterprise1.autoSave.lastSaved && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Responsável</label>
              <Input
                value={formData1.nome}
                onChange={(e) => setFormData1(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome completo..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData1.email}
                onChange={(e) => setFormData1(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Projeto</label>
              <Input
                value={formData1.projeto}
                onChange={(e) => setFormData1(prev => ({ ...prev, projeto: e.target.value }))}
                placeholder="Descrição do projeto..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Observações</label>
              <Textarea
                value={formData1.observacoes}
                onChange={(e) => setFormData1(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Detalhes adicionais..."
                rows={3}
              />
            </div>
            
            <div className="text-xs text-gray-600 p-2 bg-white rounded">
              <div>💾 Auto-save: {formEnterprise1.autoSave.enabled ? 'Ativo' : 'Inativo'}</div>
              <div>🔄 Multi-tab: {formEnterprise1.multiTab.enabled ? 'Ativo' : 'Inativo'}</div>
              {formEnterprise1.autoSave.lastSaved && (
                <div>⏰ Último save: {formEnterprise1.autoSave.lastSaved.toLocaleTimeString('pt-BR')}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FORMULÁRIO 2: ORÇAMENTO */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                <span>Formulário 2: Orçamento</span>
              </div>
              <div className="flex items-center space-x-2">
                {formEnterprise2.autoSave.hasUnsaved && (
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    Não salvo
                  </Badge>
                )}
                {formEnterprise2.autoSave.status?.isAutoSaving && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                )}
                {formEnterprise2.autoSave.error && (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                {formEnterprise2.autoSave.lastSaved && !formEnterprise2.autoSave.hasUnsaved && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <Input
                value={formData2.cliente}
                onChange={(e) => setFormData2(prev => ({ ...prev, cliente: e.target.value }))}
                placeholder="Nome do cliente..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Orçamento</label>
              <Input
                value={formData2.orcamento}
                onChange={(e) => setFormData2(prev => ({ ...prev, orcamento: e.target.value }))}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <Input
                value={formData2.prazo}
                onChange={(e) => setFormData2(prev => ({ ...prev, prazo: e.target.value }))}
                placeholder="Ex: 12 meses"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Especificações</label>
              <Textarea
                value={formData2.especificacoes}
                onChange={(e) => setFormData2(prev => ({ ...prev, especificacoes: e.target.value }))}
                placeholder="Especificações técnicas..."
                rows={3}
              />
            </div>
            
            <div className="text-xs text-gray-600 p-2 bg-white rounded">
              <div>💾 Auto-save: {formEnterprise2.autoSave.enabled ? 'Ativo' : 'Inativo'}</div>
              <div>🔄 Multi-tab: {formEnterprise2.multiTab.enabled ? 'Ativo' : 'Inativo'}</div>
              {formEnterprise2.autoSave.error && (
                <div className="text-red-600">❌ Erro: {formEnterprise2.autoSave.error}</div>
              )}
              {formEnterprise2.autoSave.lastSaved && (
                <div>⏰ Último save: {formEnterprise2.autoSave.lastSaved.toLocaleTimeString('pt-BR')}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FORMULÁRIO 3: BRIEFING */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-purple-600" />
                <span>Formulário 3: Briefing</span>
              </div>
              <div className="flex items-center space-x-2">
                {briefingEnterprise.autoSave.hasUnsaved && (
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    Não salvo
                  </Badge>
                )}
                {briefingEnterprise.autoSave.status?.isAutoSaving && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                )}
                {briefingEnterprise.autoSave.lastSaved && !briefingEnterprise.autoSave.hasUnsaved && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipologia</label>
              <Input
                value={briefingData.tipologia}
                onChange={(e) => setBriefingData(prev => ({ ...prev, tipologia: e.target.value }))}
                placeholder="Ex: Residencial Unifamiliar"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Área</label>
              <Input
                value={briefingData.area}
                onChange={(e) => setBriefingData(prev => ({ ...prev, area: e.target.value }))}
                placeholder="Ex: 250m²"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Programa</label>
              <Input
                value={briefingData.programa}
                onChange={(e) => setBriefingData(prev => ({ ...prev, programa: e.target.value }))}
                placeholder="Ex: 3 quartos, 2 banheiros..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Requisitos</label>
              <Textarea
                value={briefingData.requisitos}
                onChange={(e) => setBriefingData(prev => ({ ...prev, requisitos: e.target.value }))}
                placeholder="Requisitos específicos do cliente..."
                rows={3}
              />
            </div>
            
            <div className="text-xs text-gray-600 p-2 bg-white rounded">
              <div>💾 Auto-save: {briefingEnterprise.autoSave.enabled ? 'Ativo' : 'Inativo'}</div>
              <div>🔄 Multi-tab: {briefingEnterprise.multiTab.enabled ? 'Ativo' : 'Inativo'}</div>
              {briefingEnterprise.autoSave.lastSaved && (
                <div>⏰ Último save: {briefingEnterprise.autoSave.lastSaved.toLocaleTimeString('pt-BR')}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INFORMAÇÕES DO SISTEMA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span>Informações do Sistema Enterprise</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">✅ Funcionalidades Ativas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>🛡️ Session management baseado em atividade (30min inatividade)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>💾 Auto-save inteligente a cada 30s + debounce 2s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>🔄 Sincronização em tempo real entre abas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>📱 Suporte a múltiplas abas/janelas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>🔧 Sistema de recovery automático</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>⚡ Zero perda de dados durante trabalho</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>🏢 UX otimizada para escritórios (8-12h trabalho)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-900">📊 Status da Sessão Atual</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Tempo ativo:</span>
                  <span className="font-medium ml-2">
                    {pageEnterprise.utils.formatTime(pageEnterprise.session.totalTime)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline" className="ml-2 text-green-700 border-green-300">
                    {pageEnterprise.session.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Horário comercial:</span>
                  <Badge variant="outline" className="ml-2">
                    {pageEnterprise.utils.isWorkingHours() ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Network status:</span>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      networkStatus === 'online' 
                        ? 'text-green-700 border-green-300' 
                        : networkStatus === 'slow'
                          ? 'text-yellow-700 border-yellow-300'
                          : 'text-red-700 border-red-300'
                    }`}
                  >
                    {networkStatus === 'online' ? '🟢 Online' : networkStatus === 'slow' ? '🟡 Lento' : '🔴 Offline'}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Abas ativas:</span>
                  <span className="font-medium ml-2">{pageEnterprise.multiTab.tabCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sessão estendida:</span>
                  <Badge variant="outline" className="ml-2">
                    {pageEnterprise.session.isExtended ? 'Sim (+8h)' : 'Não'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 Como Funciona o Sistema Enterprise</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• <strong>Trabalho Ativo:</strong> Enquanto você clicar, digitar ou interagir = sessão infinita</div>
              <div>• <strong>Auto-save:</strong> Dados salvos automaticamente a cada 30s e 2s após parar de digitar</div>
              <div>• <strong>Multi-tab:</strong> Dados sincronizados em tempo real entre todas as abas abertas</div>
              <div>• <strong>Inatividade:</strong> Apenas 30 minutos SEM interação = logout automático</div>
              <div>• <strong>Recovery:</strong> Dados recuperados automaticamente em caso de falha</div>
              <div>• <strong>Enterprise:</strong> Sistema preparado para 10.000 usuários simultâneos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 