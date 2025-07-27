import React, { useState } from 'react'
import { Search, User, AlertCircle, CheckCircle2, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { colaboradoresService, type Colaborador } from '@/services/colaboradoresService'

interface SeletorColaboradorProps {
  colaboradorId?: string
  onSelecionar: (colaborador: Colaborador | null) => void
  label?: string
  placeholder?: string
  descricao?: string
  apenasResponsaveis?: boolean
  apenasAtivos?: boolean
  rolesFiltro?: string[]
  className?: string
}

export function SeletorColaborador({
  colaboradorId,
  onSelecionar,
  label = "Selecionar Colaborador",
  placeholder = "Buscar colaborador...",
  descricao,
  apenasResponsaveis = false,
  apenasAtivos = true,
  rolesFiltro,
  className
}: SeletorColaboradorProps) {
  const [busca, setBusca] = useState('')
  const [seletorAberto, setSeletorAberto] = useState(false)
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null)

  // Buscar colaboradores
  const { 
    data: colaboradores = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['colaboradores-seletor', apenasAtivos, rolesFiltro],
    queryFn: async (): Promise<Colaborador[]> => {
      console.log('🔍 [SeletorColaborador] Buscando colaboradores...')
      
      try {
        let colaboradores: Colaborador[] = []
        
        if (rolesFiltro && rolesFiltro.length > 0) {
          // Buscar por roles específicas
          const promises = rolesFiltro.map(role => 
            colaboradoresService.listarPorRole(role)
          )
          const results = await Promise.all(promises)
          colaboradores = results.flat()
        } else if (apenasAtivos) {
          // Buscar apenas ativos
          colaboradores = await colaboradoresService.listarAtivos()
        } else {
          // Buscar todos
          const response = await colaboradoresService.listar()
          colaboradores = response.users
        }
        
        // Filtrar apenas responsáveis se necessário
        if (apenasResponsaveis) {
          colaboradores = colaboradores.filter(colaborador => 
            colaboradoresService.podeSerResponsavel(colaborador)
          )
        }
        
        console.log('✅ [SeletorColaborador] Colaboradores encontrados:', colaboradores.length)
        
        return colaboradores
        
      } catch (error) {
        console.error('❌ [SeletorColaborador] Erro ao buscar colaboradores:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })

  // Buscar colaborador específico se ID foi fornecido
  const { data: colaboradorAtual } = useQuery({
    queryKey: ['colaborador-atual', colaboradorId],
    queryFn: async () => {
      if (!colaboradorId) return null
      
      console.log('👤 [SeletorColaborador] Buscando colaborador atual:', colaboradorId)
      
      try {
        const colaborador = await colaboradoresService.buscarPorId(colaboradorId)
        setColaboradorSelecionado(colaborador)
        return colaborador
      } catch (error) {
        console.error('❌ [SeletorColaborador] Erro ao buscar colaborador atual:', error)
        return null
      }
    },
    enabled: !!colaboradorId,
    staleTime: 5 * 60 * 1000,
  })

  // Filtrar colaboradores pela busca
  const colaboradoresFiltrados = colaboradores.filter(colaborador => {
    if (!busca) return true
    
    const termo = busca.toLowerCase()
    return (
      colaborador.nome.toLowerCase().includes(termo) ||
      colaborador.email.toLowerCase().includes(termo) ||
      colaboradoresService.getRoleDisplay(colaborador.role).toLowerCase().includes(termo) ||
      (colaborador.cargo && colaborador.cargo.toLowerCase().includes(termo))
    )
  })

  // Handlers
  const handleSelecionar = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador)
    onSelecionar(colaborador)
    setSeletorAberto(false)
    setBusca('')
  }

  const handleLimpar = () => {
    setColaboradorSelecionado(null)
    onSelecionar(null)
    setBusca('')
  }

  const handleToggleSeletor = () => {
    setSeletorAberto(!seletorAberto)
    if (!seletorAberto) {
      setBusca('')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
      case 'ADMIN':
        return '👑'
      case 'MANAGER':
        return '🎯'
      case 'ARCHITECT':
        return '🏛️'
      case 'ENGINEER':
        return '⚙️'
      case 'DESIGNER':
        return '🎨'
      default:
        return '👤'
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {colaboradorSelecionado && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLimpar}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Limpar
            </Button>
          )}
        </div>
      )}

      {/* Descrição */}
      {descricao && (
        <p className="text-xs text-gray-500">{descricao}</p>
      )}

      {/* Colaborador selecionado */}
      {colaboradorSelecionado && !seletorAberto && (
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleToggleSeletor}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={colaboradorSelecionado.avatar} />
                <AvatarFallback className="bg-purple-100 text-purple-700">
                  {colaboradorSelecionado.nome.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{colaboradorSelecionado.nome}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      colaboradoresService.getRoleBadgeColor(colaboradorSelecionado.role)
                    )}
                  >
                    {getRoleIcon(colaboradorSelecionado.role)} {colaboradoresService.getRoleDisplay(colaboradorSelecionado.role)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {colaboradorSelecionado.email}
                  {colaboradorSelecionado.cargo && ` • ${colaboradorSelecionado.cargo}`}
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seletor de colaborador */}
      {(!colaboradorSelecionado || seletorAberto) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Selecionar Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={placeholder}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Error handling */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-600 text-sm">
                    Erro ao buscar colaboradores: {error.message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-xs text-red-600 hover:text-red-800 mt-1"
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Loading */}
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              /* Lista de colaboradores */
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {colaboradoresFiltrados.length > 0 ? (
                  colaboradoresFiltrados.map((colaborador) => (
                    <div
                      key={colaborador.id}
                      onClick={() => handleSelecionar(colaborador)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={colaborador.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {colaborador.nome.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{colaborador.nome}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              colaboradoresService.getRoleBadgeColor(colaborador.role)
                            )}
                          >
                            {getRoleIcon(colaborador.role)} {colaboradoresService.getRoleDisplay(colaborador.role)}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {colaborador.email}
                          {colaborador.cargo && ` • ${colaborador.cargo}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {busca ? (
                      <div>
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Nenhum colaborador encontrado para "{busca}"</p>
                      </div>
                    ) : (
                      <div>
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Nenhum colaborador disponível</p>
                        {apenasResponsaveis && (
                          <p className="text-xs text-gray-400 mt-1">
                            Apenas colaboradores com funções técnicas podem ser responsáveis
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SeletorColaborador 