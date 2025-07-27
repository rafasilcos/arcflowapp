import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { config } from '@/config/environment'
import { toastManager } from '@/lib/toast-manager'

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp: string
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    rateLimit?: {
      remaining: number
      reset: number
    }
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: any
  timestamp: string
  traceId?: string
}

// Configuração do cliente HTTP para SaaS
class ApiClient {
  private client: AxiosInstance
  private retryCount = 0
  private tenantId: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': config.app.version,
        'X-Client-Platform': 'web',
      },
    })

    this.setupInterceptors()
  }

  // Configurar tenant para multi-tenancy
  setTenant(tenantId: string) {
    this.tenantId = tenantId
    this.client.defaults.headers['X-Tenant-ID'] = tenantId
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação se disponível
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Adicionar tenant ID para multi-tenancy
        if (this.tenantId) {
          config.headers['X-Tenant-ID'] = this.tenantId
        }

        // Adicionar timestamp para cache busting
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          }
        }

        // Rate limiting headers
        config.headers['X-Rate-Limit-Client'] = 'web'

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log de sucesso em desenvolvimento
        if (config.app.environment === 'development') {
          console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`)
        }

        // Processar rate limit headers
        this.handleRateLimitHeaders(response.headers)

        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Log de erro
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data)

        // 🔥 NOVA INTERCEPTAÇÃO: Tratamento específico para JWT expirado (401)
        if (error.response?.status === 401) {
          const errorData = error.response.data as any
          
          // Verificar se é erro de JWT expirado
          if (errorData?.code === 'TOKEN_EXPIRED' || 
              errorData?.code === 'INVALID_TOKEN' || 
              errorData?.code === 'SERVER_RESTART_REQUIRED_REAUTH' ||
              errorData?.code === 'MISSING_TOKEN' ||
              errorData?.code === 'USER_NOT_FOUND_OR_INACTIVE' ||
              errorData?.error?.includes('expirado') ||
              errorData?.error?.includes('inválido')) {
            
            console.log('🚨 [API-INTERCEPTOR] JWT expirado/inválido detectado - usando toast')
            
            // 🎯 USAR TOAST MANAGER AO INVÉS DE ALERT
            toastManager.handleAuthError(errorData?.code || 'UNKNOWN_AUTH_ERROR', errorData?.error)
            
            // Limpar dados de autenticação
            this.clearAuthData()
            
            // Redirecionar para login após um delay para o toast aparecer
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 1000)
            
            return Promise.reject(error)
          }
        }

        // Tratamento específico para rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after']
          if (retryAfter && !originalRequest._retry) {
            originalRequest._retry = true
            await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000))
            return this.client(originalRequest)
          }
        }

        // Retry logic para erros de rede
        if (
          error.code === 'NETWORK_ERROR' ||
          error.response?.status === 503 ||
          error.response?.status === 502
        ) {
          if (this.retryCount < config.api.retries && !originalRequest._retry) {
            originalRequest._retry = true
            this.retryCount++
            
            // Delay exponencial
            const delay = Math.pow(2, this.retryCount) * 1000
            await new Promise(resolve => setTimeout(resolve, delay))
            
            return this.client(originalRequest)
          }
        }

        // Reset retry count em caso de sucesso
        this.retryCount = 0

        // Tratamento de erro 401 genérico (fallback)
        if (error.response?.status === 401) {
          this.handleUnauthorized()
        }

        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arcflow_auth_token')
    }
    return null
  }

  private clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arcflow_auth_token')
      localStorage.removeItem('arcflow_refresh_token')
      localStorage.removeItem('arcflow_user')
      localStorage.removeItem('arcflow_escritorio')
      localStorage.removeItem('arcflow_tenant_id')
    }
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      this.clearAuthData()
      window.location.href = '/auth/login'
    }
  }

  private handleUnauthorizedWithNotification(message: string) {
    if (typeof window !== 'undefined') {
      this.clearAuthData()
      window.location.href = '/auth/login'
      // Removido alert - agora usa toast manager
    }
  }

  private handleInsufficientPlan(data: any) {
    if (typeof window !== 'undefined') {
      // Redirecionar para upgrade de plano
      const upgradeUrl = `/billing/upgrade?reason=${data.code || 'insufficient_plan'}`
      window.location.href = upgradeUrl
    }
  }

  private handleRateLimitHeaders(headers: any) {
    const remaining = headers['x-ratelimit-remaining']
    const reset = headers['x-ratelimit-reset']
    
    if (remaining !== undefined && parseInt(remaining) < 10) {
      console.warn(`⚠️ Rate limit warning: ${remaining} requests remaining`)
    }
  }

  private formatError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
    }

    if (error.response?.data) {
      const data = error.response.data as any
      apiError.message = data.message || data.error || apiError.message
      apiError.code = data.code
      apiError.details = data.details
      apiError.traceId = data.traceId
    } else if (error.message) {
      apiError.message = error.message
    }

    return apiError
  }

  // Métodos HTTP
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return response.data.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return response.data.data
  }

  // Upload de arquivos com progress
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data.data
  }

  // Download de arquivos
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Health check para monitoramento
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health')
      return true
    } catch {
      return false
    }
  }

  // ===== AUTENTICAÇÃO =====
  async login(credentials: { email: string; password: string }): Promise<any> {
    const response = await this.client.post('/api/auth/login', credentials)
    const { accessToken } = response.data
    if (accessToken && typeof window !== 'undefined') {
      localStorage.setItem('arcflow_auth_token', accessToken)
    }
    return response.data
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arcflow_auth_token')
      localStorage.removeItem('arcflow_refresh_token')
    }
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get('/api/auth/me')
    return response.data.user
  }

  // ===== PROJETOS =====
  async getProjetos(params?: any): Promise<any> {
    const response = await this.client.get('/projetos', { params })
    return response.data
  }

  async getProjeto(id: string): Promise<any> {
    const response = await this.client.get(`/projetos/${id}`)
    return response.data.projeto
  }

  async updateProjeto(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/projetos/${id}`, data)
    return response.data.projeto
  }

  // ===== CRONÔMETROS =====
  async getCronometrosAtivos(): Promise<any> {
    const response = await this.client.get('/cronometros/active')
    return response.data
  }

  async startCronometro(data: any): Promise<any> {
    const response = await this.client.post('/cronometros/start', data)
    return response.data.cronometro
  }

  async stopCronometro(id: string, observacoes?: string): Promise<any> {
    const response = await this.client.post(`/cronometros/${id}/stop`, { observacoes })
    return response.data.cronometro
  }

  // ===== DASHBOARD =====
  async getDashboardOverview(): Promise<any> {
    const response = await this.client.get('/dashboard/overview')
    return response.data
  }

  async getDashboardProjects(limit?: number): Promise<any> {
    const response = await this.client.get('/dashboard/projects', { params: { limit } })
    return response.data
  }

  // ===== CLIENTES =====
  async getClientes(params?: any): Promise<any> {
    const response = await this.client.get('/api/clientes', { params })
    return response.data
  }

  async getCliente(id: string): Promise<any> {
    const response = await this.client.get(`/api/clientes/${id}`)
    return response.data.cliente
  }

  async createCliente(data: any): Promise<any> {
    const response = await this.client.post('/api/clientes', data)
    return response.data.cliente
  }

  async updateCliente(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/api/clientes/${id}`, data)
    return response.data.cliente
  }

  async deleteCliente(id: string): Promise<any> {
    const response = await this.client.delete(`/api/clientes/${id}`)
    return response.data
  }

  async getClientesStats(): Promise<any> {
    const response = await this.client.get('/api/clientes/stats/overview')
    return response.data
  }

  // ===== USUÁRIOS =====
  async getUsers(): Promise<any> {
    const response = await this.client.get('/api/users')
    return response.data
  }

  // ===== BRIEFINGS =====
  async getBriefings(projectId: string): Promise<any> {
    const response = await this.client.get(`/briefings/project/${projectId}`)
    return response.data.briefings
  }

  async getBriefing(id: string): Promise<any> {
    const response = await this.client.get(`/briefings/${id}`)
    return response.data.briefing
  }

  async createBriefing(data: any): Promise<any> {
    const response = await this.client.post('/briefings', data)
    return response.data.briefing
  }

  async updateBriefing(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/briefings/${id}`, data)
    return response.data.briefing
  }

  async saveBriefingRespostas(id: string, respostas: any, status?: string): Promise<any> {
    const response = await this.client.post(`/briefings/${id}/respostas`, { respostas, status })
    return response.data.briefing
  }

  async finalizarBriefing(id: string, observacoes?: string): Promise<any> {
    const response = await this.client.post(`/briefings/${id}/finalizar`, { observacoes })
    return response.data.briefing
  }

  // Métodos específicos para SaaS
  async getUsageStats(): Promise<any> {
    return this.get('/usage/stats')
  }

  async getBillingInfo(): Promise<any> {
    return this.get('/billing/info')
  }

  async updateSubscription(planId: string): Promise<any> {
    return this.post('/billing/subscription', { planId })
  }
}

// Instância singleton
const apiClient = new ApiClient()

export { apiClient }
export const useApiClient = () => apiClient 