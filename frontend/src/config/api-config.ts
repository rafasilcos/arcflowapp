// ===== CONFIGURAÇÃO DE API - PREPARADA PARA BACKEND =====

/**
 * Função para detectar automaticamente a URL do backend
 */
const getBackendURL = (): string => {
  // Se estiver definido via env, usar ele
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Detecção automática (apenas no client-side)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = '3001';
    
    // Se for localhost ou 127.0.0.1, usar localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:${port}`;
    }
    
    // Caso contrário, usar o mesmo hostname (IP da rede)
    return `http://${hostname}:${port}`;
  }
  
  // Fallback para server-side (build time)
  return 'http://localhost:3001';
};

/**
 * Função para detectar URL do WebSocket
 */
const getWebSocketURL = (): string => {
  // Se estiver definido via env, usar ele
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  
  // Detecção automática baseada na URL do backend
  const backendURL = getBackendURL();
  return backendURL.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
};

/**
 * Configurações de ambiente para API
 */
export const API_CONFIG = {
  // URLs base - detecção automática de localhost vs rede
  baseURL: getBackendURL(),
  mockURL: '/api/mock', // Fallback para dados mockados
  
  // Timeouts
  timeout: 30000, // 30 segundos
  retryDelay: 1000, // 1 segundo
  maxRetries: 3,
  
  // Rate limiting
  rateLimits: {
    api: 1000, // requests por hora
    uploads: 50, // uploads por hora
    exports: 20, // exports por hora
  },
  
  // WebSocket - detecção automática
  websocket: {
    url: getWebSocketURL(),
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  },
  
  // Features flags
  features: {
    enableWebsockets: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKETS === 'true',
    enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE === 'true',
    enableRealTimeSync: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  },
  
  // Cache settings
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    longTTL: 60 * 60 * 1000, // 1 hora
    shortTTL: 30 * 1000, // 30 segundos
  }
};

/**
 * Endpoints da API organizados por módulo
 */
export const API_ENDPOINTS = {
  // Autenticação
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register',
    resetPassword: '/auth/reset-password',
  },
  
  // Projetos
  projects: {
    list: '/projects',
    create: '/projects',
    get: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
    
    // Tarefas
    tasks: {
      list: (projectId: string) => `/projects/${projectId}/tasks`,
      create: (projectId: string) => `/projects/${projectId}/tasks`,
      get: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}`,
      update: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}`,
      delete: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}`,
      
      // Timer
      startTimer: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}/timer/start`,
      stopTimer: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}/timer/stop`,
      timeTick: (projectId: string, taskId: string) => `/projects/${projectId}/tasks/${taskId}/timer/tick`,
    },
    
    // Comunicação
    messages: {
      list: (projectId: string) => `/projects/${projectId}/messages`,
      create: (projectId: string) => `/projects/${projectId}/messages`,
      markRead: (projectId: string, messageId: string) => `/projects/${projectId}/messages/${messageId}/read`,
    },
    
    // Arquivos
    files: {
      list: (projectId: string) => `/projects/${projectId}/files`,
      upload: (projectId: string) => `/projects/${projectId}/files/upload`,
      download: (projectId: string, fileId: string) => `/projects/${projectId}/files/${fileId}/download`,
      delete: (projectId: string, fileId: string) => `/projects/${projectId}/files/${fileId}`,
    }
  },
  
  // Briefings
  briefings: {
    list: '/briefings',
    create: '/briefings',
    get: (id: string) => `/briefings/${id}`,
    update: (id: string) => `/briefings/${id}`,
    delete: (id: string) => `/briefings/${id}`,
    templates: '/briefings/templates',
  },
  
  // Orçamentos
  budgets: {
    list: '/budgets',
    create: '/budgets',
    get: (id: string) => `/budgets/${id}`,
    update: (id: string) => `/budgets/${id}`,
    calculate: '/budgets/calculate',
    export: (id: string) => `/budgets/${id}/export`,
  },
  
  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    productivity: '/analytics/productivity',
    performance: '/analytics/performance',
    reports: '/analytics/reports',
  },
  
  // Usuários e Equipe
  users: {
    profile: '/users/profile',
    team: '/users/team',
    permissions: '/users/permissions',
    activity: '/users/activity',
  },
  
  // Configurações
  settings: {
    company: '/settings/company',
    project: '/settings/project',
    notifications: '/settings/notifications',
    integrations: '/settings/integrations',
  }
};

/**
 * Headers padrão para requisições
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  'X-Client-Platform': 'web',
};

/**
 * Configurações de retry para diferentes tipos de erro
 */
export const RETRY_CONFIG = {
  // Retry automático para estes status codes
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  
  // Não fazer retry para estes
  nonRetryableStatusCodes: [400, 401, 403, 404, 422],
  
  // Configurações específicas por endpoint
  endpointConfigs: {
    '/auth/login': { maxRetries: 1, retryDelay: 2000 },
    '/projects/*/tasks/*/timer/tick': { maxRetries: 5, retryDelay: 500 },
    '/projects/*/files/upload': { maxRetries: 2, retryDelay: 3000 },
  }
};

/**
 * Configurações de WebSocket por tipo de evento
 */
export const WEBSOCKET_EVENTS = {
  // Eventos de projeto
  PROJECT_UPDATED: 'project:updated',
  PROJECT_MEMBER_JOINED: 'project:member_joined',
  PROJECT_MEMBER_LEFT: 'project:member_left',
  
  // Eventos de tarefas
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_COMPLETED: 'task:completed',
  TASK_TIMER_STARTED: 'task:timer_started',
  TASK_TIMER_STOPPED: 'task:timer_stopped',
  
  // Eventos de comunicação
  MESSAGE_SENT: 'message:sent',
  MESSAGE_READ: 'message:read',
  USER_TYPING: 'user:typing',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  // Eventos de sistema
  NOTIFICATION_RECEIVED: 'notification:received',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  FORCE_REFRESH: 'system:force_refresh',
};

/**
 * Configurações de cache por tipo de dados
 */
export const CACHE_STRATEGIES = {
  // Cache longo para dados que mudam pouco
  longCache: {
    ttl: API_CONFIG.cache.longTTL,
    endpoints: [
      '/briefings/templates',
      '/settings/company',
      '/users/permissions',
    ]
  },
  
  // Cache padrão para dados moderados
  defaultCache: {
    ttl: API_CONFIG.cache.defaultTTL,
    endpoints: [
      '/projects',
      '/briefings',
      '/budgets',
    ]
  },
  
  // Cache curto para dados em tempo real
  shortCache: {
    ttl: API_CONFIG.cache.shortTTL,
    endpoints: [
      '/projects/*/messages',
      '/users/activity',
      '/analytics/dashboard',
    ]
  },
  
  // Sem cache para dados críticos
  noCache: {
    ttl: 0,
    endpoints: [
      '/auth/login',
      '/projects/*/tasks/*/timer/tick',
      '/projects/*/files/upload',
    ]
  }
};

/**
 * Configurações de mock data para desenvolvimento
 */
export const MOCK_CONFIG = {
  enabled: API_CONFIG.features.useMockData,
  delay: 500, // Simular latência de rede
  errorRate: 0.05, // 5% de chance de erro para testar error handling
  
  // Dados mockados por endpoint
  mockData: {
    '/projects': {
      method: 'GET',
      response: () => Promise.resolve([]), // Será substituído por dados reais
    },
    '/briefings/templates': {
      method: 'GET', 
      response: () => Promise.resolve([]), // Será substituído por dados reais
    },
    // Adicionar mais conforme necessário
  }
};

/**
 * Validação de configuração
 */
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!API_CONFIG.baseURL) {
    errors.push('API_CONFIG.baseURL is required');
  }
  
  if (API_CONFIG.features.enableWebsockets && !API_CONFIG.websocket.url) {
    errors.push('WebSocket URL is required when WebSockets are enabled');
  }
  
  if (errors.length > 0) {
    console.error('❌ API Configuration errors:', errors);
    throw new Error(`API Configuration invalid: ${errors.join(', ')}`);
  }
  
  console.log('✅ API Configuration validated successfully');
};

// Validar configuração na inicialização
if (typeof window !== 'undefined') {
  validateConfig();
} 