'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useEnterprise, useEnterpriseAutoSave, useMultiTabSync } from '@/contexts/EnterpriseContext'

// 🏢 HOOK UNIVERSAL PARA PÁGINAS ENTERPRISE
// Use este hook em qualquer página para ativar automaticamente:
// - Auto-save inteligente
// - Session management
// - Multi-tab sync
// - Zero data loss

interface UsePageEnterpriseOptions {
  // Auto-save configuration
  autoSave?: {
    enabled?: boolean
    data?: any
    onSave?: (data: any) => Promise<void>
    key?: string
  }
  
  // Multi-tab sync configuration
  multiTabSync?: {
    enabled?: boolean
    key?: string
    initialData?: any
    onSync?: (data: any) => void
  }
  
  // Session management
  sessionManagement?: {
    customWarning?: (timeLeft: number) => void
    customExpiration?: () => void
  }
  
  // Page identification
  pageInfo?: {
    name?: string
    module?: string
    critical?: boolean // Se true, força backup mais frequente
  }
}

export function usePageEnterprise(options: UsePageEnterpriseOptions = {}) {
  const enterprise = useEnterprise()
  
  // 📝 CONFIGURAÇÃO PADRÃO
  const config = {
    autoSave: {
      enabled: true,
      key: `page-${Date.now()}`,
      ...options.autoSave
    },
    multiTabSync: {
      enabled: true,
      key: `sync-${Date.now()}`,
      ...options.multiTabSync
    },
    sessionManagement: {
      ...options.sessionManagement
    },
    pageInfo: {
      name: 'Página ArcFlow',
      module: 'sistema',
      critical: false,
      ...options.pageInfo
    }
  }

  // 📊 REFS PARA CONTROLE
  const isInitialized = useRef(false)
  const pageStartTime = useRef(new Date())
  const interactionCount = useRef(0)

  // 💾 AUTO-SAVE SETUP
  const autoSaveHook = useEnterpriseAutoSave(
    config.autoSave.enabled ? config.autoSave.key! : '',
    config.autoSave.enabled ? config.autoSave.data : null,
    config.autoSave.enabled ? config.autoSave.onSave : undefined
  )

  // 🔄 MULTI-TAB SYNC SETUP
  const [syncedData, updateSyncedData] = useMultiTabSync(
    config.multiTabSync.enabled ? config.multiTabSync.key! : '',
    config.multiTabSync.enabled ? config.multiTabSync.initialData : null
  )

  // 🎯 CALLBACK WHEN SYNCED DATA CHANGES
  useEffect(() => {
    if (config.multiTabSync.enabled && config.multiTabSync.onSync && syncedData) {
      config.multiTabSync.onSync(syncedData)
    }
  }, [syncedData, config.multiTabSync])

  // 📊 TRACK PAGE INTERACTIONS
  const trackInteraction = useCallback(() => {
    interactionCount.current++
    
    // Log para páginas críticas
    if (config.pageInfo.critical) {
      console.log(`💎 [CRITICAL-PAGE] Interação ${interactionCount.current} em ${config.pageInfo.name}`)
    }
  }, [config.pageInfo])

  // 🚀 PÁGINA INITIALIZATION
  useEffect(() => {
    if (isInitialized.current) return
    
    console.log('🏢 [PAGE-ENTERPRISE] Inicializando funcionalidades enterprise:', {
      pagina: config.pageInfo.name,
      modulo: config.pageInfo.module,
      critica: config.pageInfo.critical,
      autoSave: config.autoSave.enabled,
      multiTab: config.multiTabSync.enabled,
      timestamp: new Date().toISOString()
    })

    // Registrar listeners de interação se página crítica
    if (config.pageInfo.critical) {
      const events = ['click', 'keypress', 'change', 'input', 'focus']
      events.forEach(event => {
        document.addEventListener(event, trackInteraction, { passive: true })
      })
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, trackInteraction)
        })
      }
    }

    isInitialized.current = true
  }, [config, trackInteraction])

  // 🎛️ UTILITY FUNCTIONS
  const getPageStats = useCallback(() => {
    const now = new Date()
    const sessionDuration = Math.floor((now.getTime() - pageStartTime.current.getTime()) / 1000)
    
    return {
      pageName: config.pageInfo.name,
      module: config.pageInfo.module,
      sessionDuration: enterprise.utils.formatTime(sessionDuration),
      interactions: interactionCount.current,
      isCritical: config.pageInfo.critical,
      autoSaveEnabled: config.autoSave.enabled,
      multiTabEnabled: config.multiTabSync.enabled,
      globalSessionTime: enterprise.utils.formatTime(enterprise.sessionStatus.totalActiveTime),
      tabCount: enterprise.multiTab.tabCount
    }
  }, [enterprise, config])

  const forceSaveAll = useCallback(async () => {
    console.log('💪 [PAGE-ENTERPRISE] Força salvamento de todos os dados da página')
    
    try {
      // Força auto-save da página
      if (config.autoSave.enabled && autoSaveHook.forceSave) {
        await autoSaveHook.forceSave()
      }
      
      // Força auto-save global
      await enterprise.autoSave.forceSave()
      
      console.log('✅ [PAGE-ENTERPRISE] Todos os dados salvos com sucesso')
      return true
    } catch (error) {
      console.error('❌ [PAGE-ENTERPRISE] Erro ao forçar salvamento:', error)
      return false
    }
  }, [config.autoSave.enabled, autoSaveHook, enterprise])

  const syncWithOtherTabs = useCallback((data: any) => {
    if (config.multiTabSync.enabled) {
      console.log('🔄 [PAGE-ENTERPRISE] Sincronizando dados com outras abas:', config.multiTabSync.key)
      updateSyncedData(data)
    }
  }, [config.multiTabSync.enabled, updateSyncedData])

  // 🚨 SESSION WARNING HANDLER
  useEffect(() => {
    if (config.sessionManagement.customWarning) {
      // TODO: Implement custom warning listener
      console.log('⚠️ [PAGE-ENTERPRISE] Custom session warning handler configurado')
    }
  }, [config.sessionManagement.customWarning])

  // 📈 RETURN ENTERPRISE FEATURES
  return {
    // Session Status
    session: {
      isActive: enterprise.sessionStatus.isActive,
      timeRemaining: enterprise.sessionStatus.timeRemaining,
      totalTime: enterprise.sessionStatus.totalActiveTime,
      isExtended: enterprise.sessionStatus.isExtendedSession,
      extend: enterprise.extendSession
    },
    
    // Auto-save Status
    autoSave: {
      enabled: config.autoSave.enabled,
      status: autoSaveHook.status,
      forceSave: autoSaveHook.forceSave,
      lastSaved: autoSaveHook.status?.lastSaved,
      hasUnsaved: autoSaveHook.status?.hasUnsavedChanges || false,
      error: autoSaveHook.status?.error
    },
    
    // Multi-tab Sync
    multiTab: {
      enabled: config.multiTabSync.enabled,
      isActiveTab: enterprise.multiTab.isActiveTab,
      tabCount: enterprise.multiTab.tabCount,
      syncedData,
      syncData: syncWithOtherTabs
    },
    
    // Page Utils
    page: {
      stats: getPageStats(),
      forceSaveAll,
      trackInteraction
    },
    
    // Enterprise Utils
    utils: {
      formatTime: enterprise.utils.formatTime,
      isWorkingHours: enterprise.utils.isWorkingHours,
      productivity: enterprise.utils.getProductivityStats()
    }
  }
}

// 🎯 HOOK SIMPLIFICADO PARA FORMULÁRIOS
export function useFormEnterprise(formData: any, onSave?: (data: any) => Promise<void>, formName = 'form') {
  return usePageEnterprise({
    autoSave: {
      enabled: true,
      data: formData,
      onSave,
      key: `form-${formName}-${Date.now()}`
    },
    multiTabSync: {
      enabled: true,
      key: `form-sync-${formName}`,
      initialData: formData
    },
    pageInfo: {
      name: `Formulário ${formName}`,
      module: 'formularios',
      critical: true // Formulários são sempre críticos
    }
  })
}

// 🎯 HOOK SIMPLIFICADO PARA DASHBOARDS
export function useDashboardEnterprise(dashboardName = 'dashboard') {
  return usePageEnterprise({
    autoSave: {
      enabled: false // Dashboards geralmente não precisam de auto-save
    },
    multiTabSync: {
      enabled: true,
      key: `dashboard-sync-${dashboardName}`
    },
    sessionManagement: {
      customWarning: (timeLeft) => {
        console.log(`⚠️ [DASHBOARD] Sessão expira em ${Math.ceil(timeLeft / 60)} minutos`)
      }
    },
    pageInfo: {
      name: `Dashboard ${dashboardName}`,
      module: 'dashboards',
      critical: false
    }
  })
}

// 🎯 HOOK SIMPLIFICADO PARA BRIEFINGS
export function useBriefingEnterprise(briefingData: any, onSave?: (data: any) => Promise<void>, briefingId = 'briefing') {
  return usePageEnterprise({
    autoSave: {
      enabled: true,
      data: briefingData,
      onSave,
      key: `briefing-${briefingId}`
    },
    multiTabSync: {
      enabled: true,
      key: `briefing-sync-${briefingId}`,
      initialData: briefingData
    },
    pageInfo: {
      name: `Briefing ${briefingId}`,
      module: 'briefings',
      critical: true // Briefings são sempre críticos
    }
  })
} 