'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react'
import Link from 'next/link'
import { API_CONFIG } from '@/config/api-config'

interface LoginData {
  email: string
  password: string
}

interface LoginErrors {
  [key: string]: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<LoginErrors>({})

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
  }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Usar o novo serviço de autenticação com auto-refresh
      const { default: authService } = await import('@/services/authService')
      const result = await authService.login(formData.email, formData.password)

      if (result.success) {
        console.log('✅ Login realizado com auto-refresh ativado')
        
        // Redirecionar para dashboard
        router.push('/dashboard')
      } else {
        if (result.error?.includes('credenciais') || result.error?.includes('senha')) {
          setErrors({ general: 'Email ou senha incorretos' })
        } else if (result.error?.includes('não encontrado')) {
          setErrors({ email: 'Email não encontrado' })
        } else {
          setErrors({ general: result.error || 'Erro ao fazer login' })
        }
      }
    } catch (error) {
      setErrors({ general: 'Erro de conexão. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = () => {
    setFormData({
      email: 'admin@arcflow.com',
      password: '123456'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ArcFlow</h1>
          <p className="text-gray-600 mt-2">Faça login na sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Erro Geral */}
              {errors.general && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{errors.general}</p>
          </div>
        )}

              {/* Botão de Login */}
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              {/* Link para esqueceu senha */}
              <div className="text-center">
                      <Link 
              href="/auth/esqueci-senha" 
                  className="text-sm text-purple-600 hover:underline"
            >
                  Esqueceu sua senha?
            </Link>
        </div>

              {/* Divisor */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Botão de teste */}
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={handleTestLogin}
              >
                🧪 Usar conta de teste
              </Button>

              {/* Link para registro */}
              <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
                <Link href="/auth/escolha-plano" className="text-purple-600 hover:underline">
                  Criar conta
          </Link>
        </p>
            </form>
          </CardContent>
        </Card>

        {/* Info adicional */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Dados de teste disponíveis:
          </p>
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
            <div>📧 Email: admin@arcflow.com</div>
            <div>🔑 Senha: 123456</div>
          </div>
        </div>
      </div>
    </div>
  )
} 