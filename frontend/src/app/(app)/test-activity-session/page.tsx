'use client'

import { useState, useEffect } from 'react'
import { useAutoSaveBriefing } from '@/hooks/useAutoSaveBriefing'
import { ActivityIndicator } from '@/components/session/ActivityIndicator'
import { AutoSaveIndicator } from '@/components/session/AutoSaveIndicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, RefreshCw, Shield, CheckCircle, AlertTriangle, Coffee, Clock, Activity } from 'lucide-react'

export default function TestActivitySessionPage() {
  const [formData, setFormData] = useState({
    nomeProjeto: '',
    descricao: '',
    cliente: '',
    prazo: '',
    orcamento: '',
    objetivos: '',
    restricoes: '',
    preferencias: '',
    observacoes: '',
    detalhamentoProjeto: '',
    cronogramaDetalhado: '',
    especificacoesTecnicas: ''
  })

  const [simulationActive, setSimulationActive] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    startTime: new Date(),
    interactions: 0,
    saves: 0
  })

  const briefingId = 'test-activity-briefing-456'

  // 💾 AUTO-SAVE ENTERPRISE (integrado com atividade)
  const autoSave = useAutoSaveBriefing({
    briefingId,
    data: formData,
    onSave: async (data) => {
      // Simular salvamento real
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
      
      setSessionStats(prev => ({ ...prev, saves: prev.saves + 1 }))
      
      console.log('📋 [ACTIVITY-DEMO] Briefing salvo:', {
        briefingId,
        campos: Object.keys(data).filter(k => data[k]).length,
        timestamp: new Date().toISOString(),
        totalSaves: sessionStats.saves + 1
      })
    },
    interval: 45000, // 45 segundos (mais espaçado para demonstração)
    debounceDelay: 3000, // 3 segundos após parar de digitar
    enableLocalBackup: true
  })

  // 📊 ESTATÍSTICAS EM TEMPO REAL
  const stats = {
    camposPreenchidos: Object.values(formData).filter(v => v.trim() !== '').length,
    totalCampos: Object.keys(formData).length,
    progresso: Math.round((Object.values(formData).filter(v => v.trim() !== '').length / Object.keys(formData).length) * 100),
    caracteres: Object.values(formData).join('').length,
    tempoSessao: Math.floor((Date.now() - sessionStats.startTime.getTime()) / 1000)
  }

  // 🎭 SIMULAÇÃO DE PREENCHIMENTO LONGO (para testar inatividade)
  const startLongSimulation = () => {
    if (simulationActive) return
    
    setSimulationActive(true)
    
    const campos = [
      { key: 'nomeProjeto', value: 'Complexo Empresarial Sustentável - Fase I', delay: 2000 },
      { key: 'cliente', value: 'Grupo Industrial TechCorp Ltda.', delay: 3000 },
      { key: 'descricao', value: 'Desenvolvimento de complexo empresarial com 12 edifícios, focado em sustentabilidade e tecnologia avançada...', delay: 4000 },
      { key: 'orcamento', value: 'R$ 45.000.000,00', delay: 2000 },
      { key: 'prazo', value: '24 meses (entrega por fases)', delay: 2000 },
      { key: 'objetivos', value: 'Criar um hub tecnológico que seja referência em sustentabilidade na região, integrando escritórios, centro de pesquisa e espaços de convivência...', delay: 5000 },
      { key: 'restricoes', value: 'Terreno irregular com desnível de 15m, proximidade a área de preservação ambiental, limitações de altura municipal...', delay: 4000 },
      { key: 'preferencias', value: 'Certificação LEED Platinum, fachadas inteligentes, sistema de energia renovável, materiais regionais sustentáveis...', delay: 4000 },
      { key: 'detalhamentoProjeto', value: 'O projeto contempla: Torre A (20 andares - escritórios), Torre B (15 andares - centro de pesquisa), Pavilhão Central (área de convivência), estacionamento subterrâneo...', delay: 6000 },
      { key: 'cronogramaDetalhado', value: 'Fase 1: Terraplanagem e fundações (6 meses), Fase 2: Estrutura Torre A (8 meses), Fase 3: Estrutura Torre B (6 meses), Fase 4: Acabamentos e sistemas (4 meses)...', delay: 5000 },
      { key: 'especificacoesTecnicas', value: 'Sistema estrutural: concreto armado com lajes protendidas, Fachada: sistema unitizado com vidros duplos low-e, HVAC: sistema VRF com recuperação de calor...', delay: 4000 },
      { key: 'observacoes', value: 'Projeto piloto para expansão nacional da empresa. Prevista integração com sistema de automação predial IoT e espaços flexíveis para coworking...', delay: 3000 }
    ]
    
    let index = 0
    const fillNext = () => {
      if (index >= campos.length) {
        setSimulationActive(false)
        return
      }
      
      const campo = campos[index]
      setFormData(prev => ({
        ...prev,
        [campo.key]: campo.value
      }))
      
      setSessionStats(prev => ({ ...prev, interactions: prev.interactions + 1 }))
      
      index++
      setTimeout(fillNext, campo.delay)
    }
    
    fillNext()
  }

  // 🧹 LIMPAR FORMULÁRIO
  const clearForm = () => {
    setFormData({
      nomeProjeto: '',
      descricao: '',
      cliente: '',
      prazo: '',
      orcamento: '',
      objetivos: '',
      restricoes: '',
      preferencias: '',
      observacoes: '',
      detalhamentoProjeto: '',
      cronogramaDetalhado: '',
      especificacoesTecnicas: ''
    })
    setSessionStats(prev => ({ ...prev, interactions: prev.interactions + 1 }))
  }

  // 🎯 SIMULAR PAUSA (para testar alertas de inatividade)
  const simulateBreak = (minutes: number) => {
    alert(`🕐 Simulando pausa de ${minutes} minutos...\n\n` +
          '⚠️ IMPORTANTE: Esta é apenas uma simulação!\n' +
          'O sistema detectará automaticamente quando você parar de interagir.\n\n' +
          `Após ${minutes} minutos de INATIVIDADE REAL, você receberia um aviso.`)
  }

  // Contar interações
  useEffect(() => {
    const handleInteraction = () => {
      setSessionStats(prev => ({ ...prev, interactions: prev.interactions + 1 }))
    }

    // Listeners para contar interações
    document.addEventListener('click', handleInteraction)
    document.addEventListener('keypress', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keypress', handleInteraction)
    }
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            ⚡ Sistema de Sessão Baseado em Atividade
          </h1>
          <p className="text-gray-600">
            Perfeito para escritórios: NUNCA expira durante trabalho ativo • 
            Logout apenas por inatividade real
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <AutoSaveIndicator
            isAutoSaving={autoSave.status.isAutoSaving}
            lastSaved={autoSave.status.lastSaved}
            hasUnsavedChanges={autoSave.status.hasUnsavedChanges}
            error={autoSave.status.error}
            className="min-w-fit"
          />
          
          <ActivityIndicator 
            inactivityTimeout={30} // 30 minutos para demo (pode ser mais)
            warningTime={5}        // 5 minutos de aviso
            onSessionExpired={() => {
              alert('🚨 Sessão expirada por inatividade!\n\nVocê seria redirecionado para login.')
            }}
          />
        </div>
      </div>

      {/* CARDS DE BENEFÍCIOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">Trabalho Ativo</div>
              <div className="text-sm text-green-700">Sessão nunca expira enquanto você trabalha</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900">Segurança Inteligente</div>
              <div className="text-sm text-blue-700">Logout automático apenas por inatividade</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <Clock className="w-8 h-8 text-purple-600" />
            <div>
              <div className="font-semibold text-purple-900">Sessões Longas</div>
              <div className="text-sm text-purple-700">Suporte a 8-12h de trabalho contínuo</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORMULÁRIO PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  📋 Briefing Complexo (Demo Escritório)
                  <Badge variant="outline" className="ml-2">
                    {stats.progresso}% • {stats.caracteres} chars
                  </Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={startLongSimulation}
                    disabled={simulationActive}
                    variant="outline"
                    size="sm"
                  >
                    {simulationActive ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Preenchendo...
                      </>
                    ) : (
                      '🎭 Simular Trabalho Longo'
                    )}
                  </Button>
                  <Button onClick={clearForm} variant="outline" size="sm">
                    🧹 Limpar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Projeto</label>
                  <input
                    type="text"
                    value={formData.nomeProjeto}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomeProjeto: e.target.value }))}
                    placeholder="Ex: Complexo Empresarial..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cliente</label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                    placeholder="Ex: Grupo Industrial..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Orçamento</label>
                  <input
                    type="text"
                    value={formData.orcamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, orcamento: e.target.value }))}
                    placeholder="Ex: R$ 45.000.000,00"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Prazo</label>
                  <input
                    type="text"
                    value={formData.prazo}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                    placeholder="Ex: 24 meses"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Campos de texto longo */}
              {[
                { key: 'descricao', label: 'Descrição do Projeto', placeholder: 'Descreva o projeto detalhadamente...', rows: 3 },
                { key: 'objetivos', label: 'Objetivos', placeholder: 'Principais objetivos do projeto...', rows: 3 },
                { key: 'restricoes', label: 'Restrições', placeholder: 'Limitações técnicas, legais, ambientais...', rows: 3 },
                { key: 'preferencias', label: 'Preferências', placeholder: 'Materiais, tecnologias, certificações...', rows: 3 },
                { key: 'detalhamentoProjeto', label: 'Detalhamento do Projeto', placeholder: 'Descrição técnica detalhada...', rows: 4 },
                { key: 'cronogramaDetalhado', label: 'Cronograma Detalhado', placeholder: 'Fases e prazos específicos...', rows: 4 },
                { key: 'especificacoesTecnicas', label: 'Especificações Técnicas', placeholder: 'Detalhes técnicos e sistemas...', rows: 4 },
                { key: 'observacoes', label: 'Observações Adicionais', placeholder: 'Informações complementares...', rows: 3 }
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <textarea
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* AÇÕES */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Button
                  onClick={() => autoSave.forceSave()}
                  disabled={autoSave.status.isAutoSaving}
                  className="flex-1"
                >
                  {autoSave.status.isAutoSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      💾 Salvar Agora
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="flex-1">
                  📋 Finalizar Briefing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PAINEL LATERAL */}
        <div className="space-y-6">
          {/* ESTATÍSTICAS DA SESSÃO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📊 Estatísticas em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.camposPreenchidos}</div>
                  <div className="text-sm text-blue-700">Campos preenchidos</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.progresso}%</div>
                  <div className="text-sm text-green-700">Progresso</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{sessionStats.interactions}</div>
                  <div className="text-sm text-purple-700">Interações</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{sessionStats.saves}</div>
                  <div className="text-sm text-orange-700">Auto-saves</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.progresso}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* TESTES DE INATIVIDADE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🧪 Testar Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => simulateBreak(5)}
                variant="outline" 
                className="w-full text-sm"
              >
                <Coffee className="w-4 h-4 mr-2" />
                Simular Pausa (5min)
              </Button>
              
              <Button 
                onClick={() => simulateBreak(30)}
                variant="outline" 
                className="w-full text-sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Simular Almoço (30min)
              </Button>
              
              <div className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded">
                <strong>Como testar:</strong><br/>
                • Digite em qualquer campo = atividade detectada<br/>
                • Pare de interagir por 25+ min = aviso aparece<br/>
                • Pare de interagir por 30+ min = logout automático<br/>
                • Sistema detecta: clicks, teclas, scroll, focus
              </div>
            </CardContent>
          </Card>

          {/* VANTAGENS DO SISTEMA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ✅ Vantagens Enterprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Trabalho 8-12h sem interrupção</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Zero perda de dados durante trabalho</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Segurança mantida (logout por inatividade)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Auto-save inteligente integrado</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>UX otimizada para escritórios</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Suporte a múltiplas abas/janelas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 