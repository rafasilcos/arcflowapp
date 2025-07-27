'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Eye, EyeOff, Building2, User, Mail, Lock, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Plan {
  id: string
  name: string
  type: string
  price_monthly: number
  price_yearly: number
  max_users: number
  max_projects: number
}

interface FormData {
  // Dados pessoais
  nome: string
  email: string
  password: string
  confirmPassword: string
  
  // Dados do escritório
  escritorio: {
    nome: string
    email: string
  cnpj: string
    telefone: string
    endereco: string
    cidade: string
    estado: string
    cep: string
  }
}

interface FormErrors {
  [key: string]: string
}

export default function RegistroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    escritorio: {
      nome: '',
      email: '',
      cnpj: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Carregar plano selecionado da URL
    const planId = searchParams.get('planId')
    const billing = searchParams.get('billing') as 'monthly' | 'yearly'
    
    if (billing) setBillingCycle(billing)
    if (planId) loadPlan(planId)
  }, [searchParams])

  const loadPlan = async (planId: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/payments/plans')
      const data = await response.json()
      
      if (response.ok) {
        const plan = data.plans.find((p: Plan) => p.id === planId)
        if (plan) setSelectedPlan(plan)
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validações de dados pessoais
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    // Validações do escritório
    if (!formData.escritorio.nome.trim()) {
      newErrors['escritorio.nome'] = 'Nome do escritório é obrigatório'
    }

    if (!formData.escritorio.email.trim()) {
      newErrors['escritorio.email'] = 'Email do escritório é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.escritorio.email)) {
      newErrors['escritorio.email'] = 'Email do escritório inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('escritorio.')) {
      const escritorioField = field.replace('escritorio.', '')
      setFormData(prev => ({
        ...prev,
        escritorio: {
          ...prev.escritorio,
          [escritorioField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

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
      const requestData = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        escritorio: {
          nome: formData.escritorio.nome,
          email: formData.escritorio.email,
          cnpj: formData.escritorio.cnpj || undefined,
          telefone: formData.escritorio.telefone || undefined,
          endereco: formData.escritorio.endereco || undefined,
          cidade: formData.escritorio.cidade || undefined,
          estado: formData.escritorio.estado || undefined,
          cep: formData.escritorio.cep || undefined
        },
        planId: selectedPlan?.id || 'plan_free'
      }

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // Salvar token no localStorage (usar chave correta!)
        localStorage.setItem('arcflow_auth_token', data.tokens.accessToken)
        localStorage.setItem('arcflow_refresh_token', data.tokens.refreshToken)
        localStorage.setItem('arcflow_user', JSON.stringify(data.user))
        localStorage.setItem('arcflow_escritorio', JSON.stringify(data.escritorio))
        
        console.log('✅ Registro realizado e token salvo:', data.tokens.accessToken.substring(0, 50) + '...')
        
        // Redirecionar para dashboard após 2 segundos
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        if (data.code === 'EMAIL_ALREADY_EXISTS') {
          setErrors({ email: 'Este email já está sendo usado' })
        } else {
          setErrors({ general: data.error || 'Erro ao criar conta' })
        }
      }
    } catch (error) {
      setErrors({ general: 'Erro de conexão. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Conta Criada com Sucesso!</CardTitle>
            <CardDescription>
              Bem-vindo ao ArcFlow! Redirecionando para seu dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Criar Conta ArcFlow</CardTitle>
                <CardDescription>
                  Complete seus dados para começar a usar o ArcFlow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Dados Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                type="text"
                value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          className={errors.nome ? 'border-red-500' : ''}
                          placeholder="Seu nome completo"
                        />
                        {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                          placeholder="seu@email.com"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="password">Senha *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                            placeholder="Mínimo 6 caracteres"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                            placeholder="Confirme sua senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Dados do Escritório */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Dados do Escritório
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="escritorio.nome">Nome do Escritório *</Label>
                        <Input
                          id="escritorio.nome"
                type="text"
                          value={formData.escritorio.nome}
                          onChange={(e) => handleInputChange('escritorio.nome', e.target.value)}
                          className={errors['escritorio.nome'] ? 'border-red-500' : ''}
                          placeholder="Nome do seu escritório"
                        />
                        {errors['escritorio.nome'] && <p className="text-sm text-red-500 mt-1">{errors['escritorio.nome']}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="escritorio.email">Email do Escritório *</Label>
                        <Input
                          id="escritorio.email"
                          type="email"
                          value={formData.escritorio.email}
                          onChange={(e) => handleInputChange('escritorio.email', e.target.value)}
                          className={errors['escritorio.email'] ? 'border-red-500' : ''}
                          placeholder="contato@escritorio.com"
                        />
                        {errors['escritorio.email'] && <p className="text-sm text-red-500 mt-1">{errors['escritorio.email']}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="escritorio.cnpj">CNPJ</Label>
                        <Input
                          id="escritorio.cnpj"
                          type="text"
                          value={formData.escritorio.cnpj}
                          onChange={(e) => handleInputChange('escritorio.cnpj', e.target.value)}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="escritorio.telefone">Telefone</Label>
                        <Input
                          id="escritorio.telefone"
                          type="text"
                          value={formData.escritorio.telefone}
                          onChange={(e) => handleInputChange('escritorio.telefone', e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                  <div>
                        <Label htmlFor="escritorio.cidade">Cidade</Label>
                        <Input
                          id="escritorio.cidade"
                          type="text"
                          value={formData.escritorio.cidade}
                          onChange={(e) => handleInputChange('escritorio.cidade', e.target.value)}
                          placeholder="São Paulo"
                        />
                </div>
                
                  <div>
                        <Label htmlFor="escritorio.estado">Estado</Label>
                        <Input
                          id="escritorio.estado"
                          type="text"
                          value={formData.escritorio.estado}
                          onChange={(e) => handleInputChange('escritorio.estado', e.target.value)}
                          placeholder="SP"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Erro Geral */}
                  {errors.general && (
                    <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-red-700">{errors.general}</p>
                </div>
                  )}

                  {/* Botão de Submit */}
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
                    <Link href="/auth/login" className="text-purple-600 hover:underline">
            Fazer login
          </Link>
        </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Plano */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Plano</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPlan ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{selectedPlan.name}</h4>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPlan.type === 'FREE' ? 'Grátis' : formatPrice(
                          billingCycle === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly
                        )}
                      </div>
                      {selectedPlan.type !== 'FREE' && (
                        <p className="text-sm text-gray-600">
                          {billingCycle === 'yearly' ? '/ano' : '/mês'}
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">Inclui:</h5>
                      <ul className="text-sm space-y-1">
                        <li>✅ Até {selectedPlan.max_users} usuários</li>
                        <li>✅ Até {selectedPlan.max_projects} projetos</li>
                        <li>✅ Suporte 24/7</li>
                        <li>✅ Atualizações gratuitas</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">Nenhum plano selecionado</p>
                    <Link href="/auth/escolha-plano">
                      <Button variant="outline" className="w-full">
                        Escolher Plano
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 