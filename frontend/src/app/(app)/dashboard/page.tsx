'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, Users, FolderOpen, CreditCard, TrendingUp, Calendar,
  AlertCircle, CheckCircle, Clock, Star, Plus, Settings, LogOut, Zap
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  nome: string
  email: string
  papel: string
}

interface Escritorio {
  id: string
  nome: string
  email: string
  plano: string
  status: string
}

interface DashboardStats {
  projetos_ativos: number
  projetos_total: number
  usuarios_ativos: number
  usuarios_total: number
  receita_mensal: number
  tarefas_pendentes: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [escritorio, setEscritorioData] = useState<Escritorio | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('arcflow_auth_token')
      const userData = localStorage.getItem('arcflow_user')
      const escritorioData = localStorage.getItem('arcflow_escritorio')

      if (!token || !userData || !escritorioData) {
        router.push('/auth/login')
        return
      }

      // Verificar se os dados não são "undefined" string antes de fazer parse
      if (userData === 'undefined' || escritorioData === 'undefined') {
        router.push('/auth/login')
        return
      }

      setUser(JSON.parse(userData))
      setEscritorioData(JSON.parse(escritorioData))

      // Carregar estatísticas do dashboard
      const response = await fetch('http://localhost:3001/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else if (response.status === 401) {
        // Token inválido, redirecionar para login
        localStorage.removeItem('arcflow_auth_token')
        localStorage.removeItem('arcflow_refresh_token')
        localStorage.removeItem('arcflow_user')
        localStorage.removeItem('arcflow_escritorio')
        router.push('/auth/login')
        return
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('arcflow_auth_token')
    localStorage.removeItem('arcflow_refresh_token')
    localStorage.removeItem('arcflow_user')
    localStorage.removeItem('arcflow_escritorio')
    router.push('/auth/login')
  }

  const getPlanBadgeColor = (plano: string) => {
    switch (plano) {
      case 'FREE': return 'bg-gray-100 text-gray-800'
      case 'BASIC': return 'bg-blue-100 text-blue-800'
      case 'PROFESSIONAL': return 'bg-purple-100 text-purple-800'
      case 'ENTERPRISE': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
  }
  }

  const getPlanName = (plano: string) => {
    switch (plano) {
      case 'FREE': return 'Grátis'
      case 'BASIC': return 'Básico'
      case 'PROFESSIONAL': return 'Profissional'
      case 'ENTERPRISE': return 'Enterprise'
      default: return plano
    }
  }

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

          return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-gray-900">ArcFlow</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {escritorio && (
                <Badge className={getPlanBadgeColor(escritorio.plano)}>
                  {getPlanName(escritorio.plano)}
                </Badge>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Olá, {user?.nome}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                        </div>
                        </div>
                      </div>
                  </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao {escritorio?.nome || 'ArcFlow'}!
          </h2>
          <p className="text-gray-600">
            Este é seu painel de controle. Aqui você pode gerenciar projetos, equipe e acompanhar o desempenho.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.projetos_ativos || 0}</div>
              <p className="text-xs text-muted-foreground">
                de {stats?.projetos_total || 0} projetos totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.usuarios_ativos || 0}</div>
              <p className="text-xs text-muted-foreground">
                de {stats?.usuarios_total || 0} usuários totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats?.receita_mensal || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.tarefas_pendentes || 0}</div>
              <p className="text-xs text-muted-foreground">
                Requer atenção imediata
              </p>
            </CardContent>
          </Card>
                    </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às funcionalidades principais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Equipe
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Agenda
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>
                Informações sobre seu escritório e plano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Escritório</span>
                <span className="text-sm text-gray-600">{escritorio?.nome}</span>
                    </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plano Atual</span>
                <Badge className={getPlanBadgeColor(escritorio?.plano || '')}>
                  {getPlanName(escritorio?.plano || '')}
                </Badge>
                  </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Ativo</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gerenciar Plano
                </Button>
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas atividades no seu escritório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                  <p className="text-sm font-medium">Conta criada com sucesso</p>
                  <p className="text-xs text-gray-500">Há alguns minutos</p>
                </div>
            </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                  <p className="text-sm font-medium">Sistema ArcFlow inicializado</p>
                  <p className="text-xs text-gray-500">Há alguns minutos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Plano {getPlanName(escritorio?.plano || '')} ativado</p>
                  <p className="text-xs text-gray-500">Há alguns minutos</p>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Dinâmicos - NOVO SISTEMA */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-purple-700">🚀 Templates Dinâmicos</div>
                <div className="text-sm font-normal text-purple-600">Sistema Revolucionário</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-purple-600">
                Sistema de geração automática de projetos baseado em briefings estruturados.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2 rounded border">
                  <div className="font-semibold text-purple-700">24 Briefings</div>
                  <div className="text-purple-600">Implementados</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="font-semibold text-green-700">100% Pronto</div>
                  <div className="text-green-600">Para Produção</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/templates-dinamicos-teste" className="flex-1">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Testar Sistema
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
