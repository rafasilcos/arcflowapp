'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useActivitySession } from '@/hooks/useActivitySession'
import { useAutoSaveBriefing } from '@/hooks/useAutoSaveBriefing'

// 🏢 ENTERPRISE CONTEXT - Funcionalidades para todo o sistema ArcFlow

interface EnterpriseFeatures {
  // Session Management
  sessionStatus: {
    isActive: boolean
    timeRemaining: number
    totalActiveTime: number
    isExtendedSession: boolean
  }
  extendSession: () => void
  
  // Auto-save Universal
  autoSave: {
    registerAutoSave: (key: string, data: any, onSave?: (data: any) => Promise<void>) => void
    unregisterAutoSave: (key: string) => void
    forceSave: (key?: string) => Promise<void>
    getAutoSaveStatus: (key: string) => AutoSaveStatus | null
  }
  
  // Multi-tab Sync
  multiTab: {
    isActiveTab: boolean
    tabCount: number
    syncData: (key: string, data: any) => void
    onTabSync: (callback: (key: string, data: any) => void) => () => void
  }
  
  // Enterprise Utils
  utils: {
    formatTime: (seconds: number) => string
    isWorkingHours: () => boolean
    getProductivityStats: () => ProductivityStats
  }
}

interface AutoSaveStatus {
  isAutoSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  error: string | null
}

interface ProductivityStats {
  sessionsToday: number
  totalTimeToday: number
  avgSessionLength: number
  peakProductivityHour: number
}

interface AutoSaveRegistry {
  [key: string]: {
    data: any
    onSave?: (data: any) => Promise<void>
    status: AutoSaveStatus
    lastUpdate: Date
  }
}

const EnterpriseContext = createContext<EnterpriseFeatures | null>(null)

export function EnterpriseProvider({ children }: { children: React.ReactNode }) {
  // 🎮 ESTADOS PRINCIPAIS
  const [autoSaveRegistry, setAutoSaveRegistry] = useState<AutoSaveRegistry>({})
  const [isActiveTab, setIsActiveTab] = useState(true)
  const [tabCount, setTabCount] = useState(1)
  const [tabSyncCallbacks, setTabSyncCallbacks] = useState<Array<(key: string, data: any) => void>>([])
  
  // 📊 REFS PARA PERFORMANCE
  const broadcastChannel = useRef<BroadcastChannel | null>(null)
  const autoSaveIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const tabId = useRef<string>(`tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const lastActivity = useRef<Date>(new Date())

  // 🏃‍♂️ ACTIVITY SESSION MANAGEMENT
  const activitySession = useActivitySession({
    inactivityTimeout: 30, // 30 minutos
    warningTime: 5,       // 5 minutos de aviso
    onActivityDetected: () => {
      lastActivity.current = new Date()
      // Broadcast atividade para outras abas
      broadcastChannel.current?.postMessage({
        type: 'ACTIVITY_DETECTED',
        tabId: tabId.current,
        timestamp: new Date().toISOString()
      })
    },
    onSessionExpired: () => {
      console.log('🚨 [ENTERPRISE] Sessão expirada por inatividade - limpando dados')
      // Limpar auto-saves em progresso
      autoSaveIntervals.current.forEach(interval => clearInterval(interval))
      autoSaveIntervals.current.clear()
      
      // Redirecionar para login
      window.location.href = '/auth/login'
    }
  })

  // 🌐 MULTI-TAB COMMUNICATION
  useEffect(() => {
    // Criar canal de comunicação entre abas
    broadcastChannel.current = new BroadcastChannel('arcflow-enterprise')
    
    // Anunciar nova aba
    broadcastChannel.current.postMessage({
      type: 'TAB_OPENED',
      tabId: tabId.current,
      timestamp: new Date().toISOString()
    })

    // Escutar mensagens de outras abas
    const handleMessage = (event: MessageEvent) => {
      const { type, tabId: senderTabId, data, key, timestamp } = event.data

      switch (type) {
        case 'TAB_OPENED':
          if (senderTabId !== tabId.current) {
            setTabCount(prev => prev + 1)
            console.log('📱 [MULTI-TAB] Nova aba detectada:', senderTabId)
          }
          break

        case 'TAB_CLOSED':
          if (senderTabId !== tabId.current) {
            setTabCount(prev => Math.max(1, prev - 1))
            console.log('📱 [MULTI-TAB] Aba fechada:', senderTabId)
          }
          break

        case 'DATA_SYNC':
          if (senderTabId !== tabId.current) {
            console.log('🔄 [MULTI-TAB] Dados sincronizados:', key)
            tabSyncCallbacks.forEach(callback => callback(key, data))
          }
          break

        case 'ACTIVITY_DETECTED':
          if (senderTabId !== tabId.current) {
            // Atualizar atividade global
            lastActivity.current = new Date(timestamp)
          }
          break
      }
    }

    broadcastChannel.current.addEventListener('message', handleMessage)

    // Detectar quando aba fica ativa/inativa
    const handleVisibilityChange = () => {
      setIsActiveTab(!document.hidden)
      
      if (!document.hidden) {
        // Aba ficou ativa - verificar sincronização
        console.log('👁️ [MULTI-TAB] Aba ativada - verificando sincronização')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup ao fechar aba
    const handleBeforeUnload = () => {
      broadcastChannel.current?.postMessage({
        type: 'TAB_CLOSED',
        tabId: tabId.current,
        timestamp: new Date().toISOString()
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      handleBeforeUnload()
      broadcastChannel.current?.close()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [tabSyncCallbacks])

  // 💾 AUTO-SAVE REGISTRY MANAGEMENT
  const registerAutoSave = useCallback((key: string, data: any, onSave?: (data: any) => Promise<void>) => {
    console.log('📝 [ENTERPRISE] Registrando auto-save:', key)
    
    setAutoSaveRegistry(prev => ({
      ...prev,
      [key]: {
        data,
        onSave,
        status: {
          isAutoSaving: false,
          lastSaved: null,
          hasUnsavedChanges: true,
          error: null
        },
        lastUpdate: new Date()
      }
    }))

    // Configurar auto-save periódico
    if (autoSaveIntervals.current.has(key)) {
      clearInterval(autoSaveIntervals.current.get(key)!)
    }

    const interval = setInterval(async () => {
      const registry = autoSaveRegistry[key]
      if (registry?.status.hasUnsavedChanges && registry.onSave) {
        try {
          setAutoSaveRegistry(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: { ...prev[key].status, isAutoSaving: true, error: null }
            }
          }))

          await registry.onSave(registry.data)

          setAutoSaveRegistry(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: {
                isAutoSaving: false,
                lastSaved: new Date(),
                hasUnsavedChanges: false,
                error: null
              }
            }
          }))

          console.log('✅ [ENTERPRISE] Auto-save executado:', key)

          // Sincronizar com outras abas
          broadcastChannel.current?.postMessage({
            type: 'DATA_SYNC',
            tabId: tabId.current,
            key: `autosave-${key}`,
            data: registry.data,
            timestamp: new Date().toISOString()
          })

        } catch (error: any) {
          console.error('❌ [ENTERPRISE] Erro no auto-save:', key, error)
          
          setAutoSaveRegistry(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: {
                ...prev[key].status,
                isAutoSaving: false,
                error: error.message || 'Erro desconhecido'
              }
            }
          }))
        }
      }
    }, 30000) // 30 segundos

    autoSaveIntervals.current.set(key, interval)
  }, [autoSaveRegistry])

  const unregisterAutoSave = useCallback((key: string) => {
    console.log('🗑️ [ENTERPRISE] Removendo auto-save:', key)
    
    const interval = autoSaveIntervals.current.get(key)
    if (interval) {
      clearInterval(interval)
      autoSaveIntervals.current.delete(key)
    }

    setAutoSaveRegistry(prev => {
      const newRegistry = { ...prev }
      delete newRegistry[key]
      return newRegistry
    })
  }, [])

  const forceSave = useCallback(async (key?: string) => {
    console.log('💪 [ENTERPRISE] Força salvamento:', key || 'TODOS')
    
    const keysToSave = key ? [key] : Object.keys(autoSaveRegistry)
    
    for (const saveKey of keysToSave) {
      const registry = autoSaveRegistry[saveKey]
      if (registry?.onSave && registry.status.hasUnsavedChanges) {
        try {
          await registry.onSave(registry.data)
          console.log('✅ [ENTERPRISE] Força salvamento OK:', saveKey)
        } catch (error) {
          console.error('❌ [ENTERPRISE] Erro força salvamento:', saveKey, error)
        }
      }
    }
  }, [autoSaveRegistry])

  const getAutoSaveStatus = useCallback((key: string): AutoSaveStatus | null => {
    return autoSaveRegistry[key]?.status || null
  }, [autoSaveRegistry])

  // 🔄 MULTI-TAB SYNC FUNCTIONS
  const syncData = useCallback((key: string, data: any) => {
    broadcastChannel.current?.postMessage({
      type: 'DATA_SYNC',
      tabId: tabId.current,
      key,
      data,
      timestamp: new Date().toISOString()
    })
  }, [])

  const onTabSync = useCallback((callback: (key: string, data: any) => void) => {
    setTabSyncCallbacks(prev => [...prev, callback])
    
    // Retornar função de cleanup
    return () => {
      setTabSyncCallbacks(prev => prev.filter(cb => cb !== callback))
    }
  }, [])

  // 🛠️ UTILITY FUNCTIONS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    } else {
      return `${minutes}min`
    }
  }, [])

  const isWorkingHours = useCallback((): boolean => {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 8 && hour <= 18 // 8h às 18h
  }, [])

  const getProductivityStats = useCallback((): ProductivityStats => {
    // Implementação básica - pode ser expandida
    return {
      sessionsToday: 1,
      totalTimeToday: activitySession.status.totalActiveTime,
      avgSessionLength: activitySession.status.totalActiveTime,
      peakProductivityHour: new Date().getHours()
    }
  }, [activitySession.status.totalActiveTime])

  // 🎯 ENTERPRISE FEATURES OBJECT
  const enterpriseFeatures: EnterpriseFeatures = {
    sessionStatus: {
      isActive: activitySession.status.isActive,
      timeRemaining: activitySession.status.timeUntilLogout,
      totalActiveTime: activitySession.status.totalActiveTime,
      isExtendedSession: activitySession.isExtendedSession
    },
    extendSession: activitySession.extendSession,
    
    autoSave: {
      registerAutoSave,
      unregisterAutoSave,
      forceSave,
      getAutoSaveStatus
    },
    
    multiTab: {
      isActiveTab,
      tabCount,
      syncData,
      onTabSync
    },
    
    utils: {
      formatTime,
      isWorkingHours,
      getProductivityStats
    }
  }

  return (
    <EnterpriseContext.Provider value={enterpriseFeatures}>
      {children}
    </EnterpriseContext.Provider>
  )
}

// 🪝 HOOK PARA USAR AS FUNCIONALIDADES ENTERPRISE
export function useEnterprise(): EnterpriseFeatures {
  const context = useContext(EnterpriseContext)
  if (!context) {
    throw new Error('useEnterprise deve ser usado dentro de um EnterpriseProvider')
  }
  return context
}

// 🪝 HOOK SIMPLIFICADO PARA AUTO-SAVE
export function useEnterpriseAutoSave(key: string, data: any, onSave?: (data: any) => Promise<void>) {
  const { autoSave } = useEnterprise()
  
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      autoSave.registerAutoSave(key, data, onSave)
    }
    
    return () => {
      autoSave.unregisterAutoSave(key)
    }
  }, [key, data, onSave, autoSave])
  
  return {
    status: autoSave.getAutoSaveStatus(key),
    forceSave: () => autoSave.forceSave(key)
  }
}

// 🪝 HOOK PARA MULTI-TAB SYNC
export function useMultiTabSync(key: string, initialData?: any) {
  const { multiTab } = useEnterprise()
  const [syncedData, setSyncedData] = useState(initialData)
  
  useEffect(() => {
    const unsubscribe = multiTab.onTabSync((syncKey, data) => {
      if (syncKey === key) {
        setSyncedData(data)
      }
    })
    
    return unsubscribe
  }, [key, multiTab])
  
  const updateData = useCallback((data: any) => {
    setSyncedData(data)
    multiTab.syncData(key, data)
  }, [key, multiTab])
  
  return [syncedData, updateData] as const
} 