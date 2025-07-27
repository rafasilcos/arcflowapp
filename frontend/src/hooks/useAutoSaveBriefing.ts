import { useEffect, useRef, useCallback, useState } from 'react'

// Função de debounce melhorada
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout

  const debouncedFunc = (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }

  debouncedFunc.cancel = () => {
    clearTimeout(timeoutId)
  }

  return debouncedFunc
}

interface AutoSaveOptions {
  briefingId: string
  data: Record<string, any>
  onSave: (data: Record<string, any>) => Promise<void>
  interval?: number // ms - padrão 30 segundos
  debounceDelay?: number // ms - padrão 2 segundos após parar de digitar
  enableLocalBackup?: boolean // padrão true
}

interface AutoSaveStatus {
  isAutoSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  error: string | null
}

export function useAutoSaveBriefing({
  briefingId,
  data,
  onSave,
  interval = 30000, // 30 segundos
  debounceDelay = 2000, // 2 segundos
  enableLocalBackup = true
}: AutoSaveOptions) {
  const [status, setStatus] = useState<AutoSaveStatus>({
    isAutoSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null
  })

  const lastDataRef = useRef<string>('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasChangedRef = useRef(false)
  const onSaveRef = useRef(onSave)
  const dataRef = useRef(data)
  const debouncerRef = useRef<any>(null)

  // Manter refs atualizadas
  useEffect(() => {
    onSaveRef.current = onSave
    dataRef.current = data
  }, [onSave, data])

  // 💾 BACKUP LOCAL para failsafe
  const saveToLocalStorage = useCallback((saveData: Record<string, any>) => {
    if (!enableLocalBackup) return
    
    try {
      const backupKey = `briefing_backup_${briefingId}`
      const backup = {
        data: saveData,
        timestamp: new Date().toISOString(),
        briefingId
      }
      localStorage.setItem(backupKey, JSON.stringify(backup))
      console.log('💾 [AUTO-SAVE] Backup local salvo:', backupKey)
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao salvar backup local:', error)
    }
  }, [briefingId, enableLocalBackup])

  // 🔄 FUNÇÃO DE SAVE com retry automático (SEM DEPENDÊNCIAS DINÂMICAS)
  const performSave = useCallback(async (saveData: Record<string, any>, isInterval = false) => {
    if (!hasChangedRef.current && isInterval) {
      console.log('⏭️ [AUTO-SAVE] Sem mudanças, pulando save automático')
      return
    }

    setStatus(prev => ({ ...prev, isAutoSaving: true, error: null }))
    
    try {
      console.log('💾 [AUTO-SAVE] Salvando dados...', { isInterval, dataSize: Object.keys(saveData).length })
      
      // Salvar backup local primeiro
      if (enableLocalBackup) {
        try {
          const backupKey = `briefing_backup_${briefingId}`
          const backup = {
            data: saveData,
            timestamp: new Date().toISOString(),
            briefingId
          }
          localStorage.setItem(backupKey, JSON.stringify(backup))
          console.log('💾 [AUTO-SAVE] Backup local salvo:', backupKey)
        } catch (error) {
          console.error('❌ [AUTO-SAVE] Erro ao salvar backup local:', error)
        }
      }
      
      // Tentar salvar no servidor com retry
      let attempts = 0
      const maxAttempts = 3
      
      while (attempts < maxAttempts) {
        try {
          await onSaveRef.current(saveData)
          break
        } catch (error) {
          attempts++
          console.warn(`⚠️ [AUTO-SAVE] Tentativa ${attempts}/${maxAttempts} falhou:`, error)
          
          if (attempts >= maxAttempts) {
            throw error
          }
          
          // Aguardar antes de tentar novamente (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000))
        }
      }
      
      setStatus(prev => ({
        ...prev,
        isAutoSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        error: null
      }))
      
      hasChangedRef.current = false
      lastDataRef.current = JSON.stringify(saveData)
      
      if (isInterval) {
        console.log('✅ [AUTO-SAVE] Briefing salvo automaticamente')
      }
      
      console.log('✅ [AUTO-SAVE] Dados salvos com sucesso')
      
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao salvar:', error)
      
      setStatus(prev => ({
        ...prev,
        isAutoSaving: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }))
      
      console.error('❌ [AUTO-SAVE] Erro ao salvar automaticamente - dados em backup local')
    }
  }, [briefingId, enableLocalBackup]) // APENAS dependências estáveis

  // 🕐 CRIAR DEBOUNCER APENAS UMA VEZ
  useEffect(() => {
    debouncerRef.current = debounce((saveData: Record<string, any>) => {
      performSave(saveData, false)
    }, debounceDelay)

    return () => {
      if (debouncerRef.current) {
        debouncerRef.current.cancel()
      }
    }
  }, [debounceDelay, performSave])

  // 🎯 DETECTAR MUDANÇAS nos dados (SEM DEPENDÊNCIAS PROBLEMÁTICAS)
  useEffect(() => {
    const currentDataString = JSON.stringify(data)
    const hasChanged = currentDataString !== lastDataRef.current
    
    if (hasChanged && lastDataRef.current !== '') {
      hasChangedRef.current = true
      setStatus(prev => ({ ...prev, hasUnsavedChanges: true }))
      
      // Trigger debounced save usando ref
      if (debouncerRef.current) {
        debouncerRef.current(data)
      }
      
      console.log('📝 [AUTO-SAVE] Dados alterados, agendando save...')
    }
    
    // Inicializar na primeira execução
    if (lastDataRef.current === '') {
      lastDataRef.current = currentDataString
    }
  }, [data]) // APENAS data como dependência

  // ⏰ SAVE PERIÓDICO (SEM DEPENDÊNCIAS DINÂMICAS)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (hasChangedRef.current) {
        console.log('⏰ [AUTO-SAVE] Save periódico disparado')
        performSave(dataRef.current, true)
      }
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [interval]) // APENAS interval como dependência

  // 🧹 CLEANUP FINAL
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (debouncerRef.current) {
        debouncerRef.current.cancel()
      }
    }
  }, [])

  // 📥 FUNÇÃO PARA RECUPERAR BACKUP LOCAL
  const recoverFromLocalStorage = useCallback(() => {
    if (!enableLocalBackup) return null
    
    try {
      const backupKey = `briefing_backup_${briefingId}`
      const backupString = localStorage.getItem(backupKey)
      
      if (backupString) {
        const backup = JSON.parse(backupString)
        console.log('📥 [AUTO-SAVE] Backup local encontrado:', backup.timestamp)
        return backup
      }
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao recuperar backup local:', error)
    }
    
    return null
  }, [briefingId, enableLocalBackup])

  // 🗑️ FUNÇÃO PARA LIMPAR BACKUP LOCAL
  const clearLocalBackup = useCallback(() => {
    if (!enableLocalBackup) return
    
    try {
      const backupKey = `briefing_backup_${briefingId}`
      localStorage.removeItem(backupKey)
      console.log('🗑️ [AUTO-SAVE] Backup local limpo:', backupKey)
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao limpar backup local:', error)
    }
  }, [briefingId, enableLocalBackup])

  // 💾 FUNÇÃO PARA SAVE MANUAL
  const forceSave = useCallback(async () => {
    console.log('💾 [AUTO-SAVE] Save manual disparado')
    await performSave(dataRef.current, false)
  }, [performSave])

  return {
    status,
    forceSave,
    recoverFromLocalStorage,
    clearLocalBackup
  }
} 