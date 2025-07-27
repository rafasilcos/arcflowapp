export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 30000,
    retries: 3,
  },
  app: {
    name: 'ArcFlow',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE === 'true',
  },
  cache: {
    defaultStaleTime: 5 * 60 * 1000, // 5 minutos
    defaultCacheTime: 10 * 60 * 1000, // 10 minutos
  },
  security: {
    enableCSP: process.env.NODE_ENV === 'production',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  performance: {
    enableServiceWorker: process.env.NODE_ENV === 'production',
    enableCompression: true,
  },
  // Configurações específicas para SaaS
  saas: {
    maxUsersPerPlan: {
      free: 1,
      basic: 5,
      professional: 25,
      enterprise: 100,
    },
    rateLimits: {
      api: 1000, // requests por hora
      uploads: 50, // uploads por hora
      exports: 20, // exports por hora
    },
    features: {
      multiTenant: true,
      customBranding: process.env.NEXT_PUBLIC_ENABLE_CUSTOM_BRANDING === 'true',
      advancedAnalytics: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS === 'true',
      apiAccess: process.env.NEXT_PUBLIC_ENABLE_API_ACCESS === 'true',
    }
  },
  monitoring: {
    enableSentry: process.env.NEXT_PUBLIC_SENTRY_DSN !== undefined,
    enableHotjar: process.env.NEXT_PUBLIC_HOTJAR_ID !== undefined,
    enableGoogleAnalytics: process.env.NEXT_PUBLIC_GA_ID !== undefined,
  }
}

export type Config = typeof config 