'use client'

import { useState, useEffect } from 'react'
import { useAutoSaveBriefing } from '@/hooks/useAutoSaveBriefing'
import { SessionAlert } from '@/components/session/SessionAlert'
import { AutoSaveIndicator } from '@/components/session/AutoSaveIndicator'
import { DataRecoveryModal } from '@/components/session/DataRecoveryModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, RefreshCw, Shield, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TestAutoSavePage() {
  const [formData, setFormData] = useState({
    nomeProjeto: '',
    descricao: '',
    cliente: '',
    prazo: '',
    orcamento: '',
    objetivos: '',
    restricoes: '',
    preferencias: '',
    observacoes: ''
  })
  const [showRecovery, setShowRecovery] = useState(false)
  const [simulationActive, setSimulationActive] = useState(false)

  const briefingId = 'test-briefing-123'

  // 💾 AUTO-SAVE ENTERPRISE
  const autoSave = useAutoSaveBriefing({
    briefingId,
    data: formData,
    onSave: async (data) => {
      // Simular salvamento no servidor com possível erro ocasional
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      if (Math.random() < 0.1) { // 10% chance de erro para teste
        throw new Error('Erro simulado de rede')
      }
      
      console.log('📋 [DEMO] Briefing salvo no servidor:', {
        briefingId,
        campos: Object.keys(data).length,
        timestamp: new Date().toISOString()
      })
    },
    interval: 15000, // 15 segundos para demo mais rápida
    debounceDelay: 1000, // 1 segundo para demo
    enableLocalBackup: true
  })

  // 📥 VERIFICAR RECOVERY NA INICIALIZAÇÃO
  useEffect(() => {
    const backup = autoSave.recoverFromLocalStorage()
    if (backup && Object.keys(backup.data).length > 0) {
      console.log('📥 [DEMO] Backup encontrado na inicialização')
      setShowRecovery(true)
    }
  }, [])

  // 🎭 SIMULAÇÃO DE PREENCHIMENTO AUTOMÁTICO
  const startSimulation = () => {
    if (simulationActive) return
    
    setSimulationActive(true)
    
    const campos = [
      { key: 'nomeProjeto', value: 'Residência Moderna Sustentável' },
      { key: 'cliente', value: 'Família Silva' },
      { key: 'descricao', value: 'Casa moderna com foco em sustentabilidade e eficiência energética' },
      { key: 'orcamento', value: 'R$ 850.000,00' },
      { key: 'prazo', value: '8 meses' },
      { key: 'objetivos', value: 'Criar uma residência que combine conforto, modernidade e responsabilidade ambiental' },
      { key: 'restricoes', value: 'Terreno com declive acentuado, restrições de altura do município' },
      { key: 'preferencias', value: 'Materiais sustentáveis, grandes janelas, espaços integrados' },
      { key: 'observacoes', value: 'Cliente tem preferência por energia solar e sistema de captação de água da chuva' }
    ]
    
    let index = 0
    const interval = setInterval(() => {
      if (index >= campos.length) {
        clearInterval(interval)
        setSimulationActive(false)
        return
      }
      
      const campo = campos[index]
      setFormData(prev => ({
        ...prev,
        [campo.key]: campo.value
      }))
      
      index++
    }, 2000) // Preencher um campo a cada 2 segundos
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
      observacoes: ''
    })
  }

  // 📊 ESTATÍSTICAS
  const stats = {
    camposPreenchidos: Object.values(formData).filter(v => v.trim() !== '').length,
    totalCampos: Object.keys(formData).length,
    progresso: Math.round((Object.values(formData).filter(v => v.trim() !== '').length / Object.keys(formData).length) * 100)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">🛡️ Demo: Sistema Enterprise de Auto-Save</h1>
          <p className="text-gray-600">
            Demonstração completa do sistema que resolve o problema de perda de dados por expiração de sessão
          </p>
        </div>
        <AutoSaveIndicator
          isAutoSaving={autoSave.status.isAutoSaving}
          lastSaved={autoSave.status.lastSaved}
          hasUnsavedChanges={autoSave.status.hasUnsavedChanges}
          error={autoSave.status.error}
          className="min-w-fit"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORMULÁRIO PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  📋 Briefing do Projeto
                  <Badge variant="outline" className="ml-2">
                    {stats.progresso}% completo
                  </Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={startSimulation}
                    disabled={simulationActive}
                    variant="outline"
                    size="sm"
                  >
                    {simulationActive ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Simulando...
                      </>
                    ) : (
                      '🎭 Simular Preenchimento'
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
                    placeholder="Ex: Residência Moderna"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cliente</label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                    placeholder="Ex: Família Silva"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Orçamento</label>
                  <input
                    type="text"
                    value={formData.orcamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, orcamento: e.target.value }))}
                    placeholder="Ex: R$ 500.000,00"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Prazo</label>
                  <input
                    type="text"
                    value={formData.prazo}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                    placeholder="Ex: 6 meses"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descrição do Projeto</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o projeto em detalhes..."
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Objetivos</label>
                <textarea
                  value={formData.objetivos}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivos: e.target.value }))}
                  placeholder="Quais são os principais objetivos do projeto?"
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Restrições</label>
                <textarea
                  value={formData.restricoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, restricoes: e.target.value }))}
                  placeholder="Quais são as principais restrições?"
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Preferências</label>
                <textarea
                  value={formData.preferencias}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferencias: e.target.value }))}
                  placeholder="Preferências de materiais, estilo, etc."
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações adicionais..."
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
          {/* ESTATÍSTICAS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📊 Estatísticas
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
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.progresso}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* STATUS DO SISTEMA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🛡️ Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-save ativo:</span>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ativo (15s)
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup local:</span>
                <Badge className="bg-blue-100 text-blue-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Habilitado
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Status salvamento:</span>
                {autoSave.status.isAutoSaving ? (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Salvando
                  </Badge>
                ) : autoSave.status.error ? (
                  <Badge className="bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Erro
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sincronizado
                  </Badge>
                )}
              </div>
              
              {autoSave.status.lastSaved && (
                <div className="pt-2 border-t text-xs text-gray-500">
                  Último salvamento: {autoSave.status.lastSaved.toLocaleTimeString('pt-BR')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* INSTRUÇÕES */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ℹ️ Como Testar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Use "Simular Preenchimento" para teste automático</div>
              <div>• Digite em qualquer campo para ativar auto-save</div>
              <div>• Recarregue a página para testar recovery</div>
              <div>• Aguarde 15s para ver salvamento automático</div>
              <div>• Clique no indicador para ver detalhes</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ALERTA DE SESSÃO */}
      <SessionAlert />

      {/* MODAL DE RECOVERY */}
      <DataRecoveryModal
        briefingId={briefingId}
        currentData={formData}
        onRecover={(recoveredData) => {
          setFormData(prev => ({ ...prev, ...recoveredData }))
          setShowRecovery(false)
        }}
        onDismiss={() => setShowRecovery(false)}
        isOpen={showRecovery}
      />
    </div>
  )
} 