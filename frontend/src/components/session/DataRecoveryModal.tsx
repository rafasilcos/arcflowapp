'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, X, Download, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

interface BackupData {
  data: Record<string, any>
  timestamp: string
  briefingId: string
}

interface DataRecoveryModalProps {
  briefingId: string
  currentData?: Record<string, any>
  onRecover: (data: Record<string, any>) => void
  onDismiss: () => void
  isOpen?: boolean
}

export function DataRecoveryModal({
  briefingId,
  currentData = {},
  onRecover,
  onDismiss,
  isOpen = false
}: DataRecoveryModalProps) {
  const [backup, setBackup] = useState<BackupData | null>(null)
  const [isRecovering, setIsRecovering] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // 🔍 VERIFICAR SE HÁ BACKUP LOCAL
  useEffect(() => {
    if (!briefingId) return

    const checkForBackup = () => {
      try {
        const backupKey = `briefing_backup_${briefingId}`
        const backupString = localStorage.getItem(backupKey)
        
        if (backupString) {
          const backupData: BackupData = JSON.parse(backupString)
          
          // Verificar se o backup é mais recente que os dados atuais
          const backupTime = new Date(backupData.timestamp).getTime()
          const currentTime = Date.now()
          const timeDiff = currentTime - backupTime
          
          // Se backup tem menos de 24 horas e tem dados diferentes
          if (timeDiff < 24 * 60 * 60 * 1000) {
            const hasNewData = JSON.stringify(backupData.data) !== JSON.stringify(currentData)
            
            if (hasNewData) {
              console.log('📥 [RECOVERY] Backup encontrado:', {
                timestamp: backupData.timestamp,
                dataSize: Object.keys(backupData.data).length,
                timeDiff: Math.round(timeDiff / 60000) + ' minutos atrás'
              })
              
              setBackup(backupData)
              setIsVisible(true)
            }
          }
        }
      } catch (error) {
        console.error('❌ [RECOVERY] Erro ao verificar backup:', error)
      }
    }

    checkForBackup()
  }, [briefingId, currentData])

  // 📊 ANALISAR DIFERENÇAS entre backup e dados atuais
  const analyzeDifferences = () => {
    if (!backup) return { newFields: 0, modifiedFields: 0, totalFields: 0 }

    const backupData = backup.data
    const newFields = Object.keys(backupData).filter(key => !(key in currentData)).length
    const modifiedFields = Object.keys(backupData).filter(key => 
      key in currentData && JSON.stringify(backupData[key]) !== JSON.stringify(currentData[key])
    ).length
    const totalFields = Object.keys(backupData).length

    return { newFields, modifiedFields, totalFields }
  }

  // 💾 RECUPERAR DADOS
  const handleRecover = async () => {
    if (!backup) return

    setIsRecovering(true)
    
    try {
      console.log('💾 [RECOVERY] Recuperando dados do backup...')
      
      // Aguardar um pouco para mostrar feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onRecover(backup.data)
      
      console.log('✅ [RECOVERY] Dados recuperados com sucesso')
      
      // Limpar backup após recuperação bem-sucedida
      clearBackup()
      setIsVisible(false)
      
    } catch (error) {
      console.error('❌ [RECOVERY] Erro ao recuperar dados:', error)
    } finally {
      setIsRecovering(false)
    }
  }

  // 🗑️ LIMPAR BACKUP
  const clearBackup = () => {
    try {
      const backupKey = `briefing_backup_${briefingId}`
      localStorage.removeItem(backupKey)
      console.log('🗑️ [RECOVERY] Backup limpo:', backupKey)
    } catch (error) {
      console.error('❌ [RECOVERY] Erro ao limpar backup:', error)
    }
  }

  // 🚫 DISPENSAR SEM RECUPERAR
  const handleDismiss = () => {
    console.log('🚫 [RECOVERY] Backup dispensado pelo usuário')
    clearBackup()
    setIsVisible(false)
    onDismiss()
  }

  // 💾 BAIXAR BACKUP para arquivo
  const handleDownloadBackup = () => {
    if (!backup) return

    try {
      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `briefing_backup_${briefingId}_${backup.timestamp.replace(/[:.]/g, '-')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      console.log('💾 [RECOVERY] Backup baixado como arquivo')
    } catch (error) {
      console.error('❌ [RECOVERY] Erro ao baixar backup:', error)
    }
  }

  if (!isVisible || !backup || !isOpen) {
    return null
  }

  const differences = analyzeDifferences()
  const backupAge = Math.round((Date.now() - new Date(backup.timestamp).getTime()) / 60000)

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <AlertTriangle className="w-5 h-5" />
                    <span>💾 Dados Recuperáveis</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-8 w-8 p-0 hover:bg-blue-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Backup Encontrado!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Encontramos dados não salvos de uma sessão anterior. Você gostaria de recuperá-los?
                  </p>
                </div>

                {/* Informações do Backup */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salvo há:</span>
                    <span className="font-medium text-gray-900">
                      {backupAge < 60 ? `${backupAge} min` : `${Math.round(backupAge / 60)}h`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Campos preenchidos:</span>
                    <span className="font-medium text-gray-900">
                      {differences.totalFields}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Novos dados:</span>
                    <span className="font-medium text-green-600">
                      +{differences.newFields + differences.modifiedFields}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="font-mono text-xs text-gray-700">
                      {new Date(backup.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Ações Secundárias */}
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {showDetails ? 'Ocultar' : 'Ver'} Detalhes
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadBackup}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                </div>

                {/* Detalhes Expandidos */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 rounded-lg p-3 text-xs"
                    >
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900">Prévia dos dados:</div>
                        <div className="bg-white rounded p-2 max-h-32 overflow-y-auto">
                          <pre className="text-xs text-gray-700">
                            {JSON.stringify(backup.data, null, 2).substring(0, 200)}
                            {JSON.stringify(backup.data).length > 200 && '...'}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botões de Ação */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    disabled={isRecovering}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Descartar
                  </Button>
                  
                  <Button
                    onClick={handleRecover}
                    disabled={isRecovering}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isRecovering ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Recuperando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Recuperar Dados
                      </>
                    )}
                  </Button>
                </div>

                {/* Aviso */}
                <div className="text-xs text-center text-gray-500 border-t pt-3">
                  ⚠️ Os dados atuais serão substituídos pelos dados do backup
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 