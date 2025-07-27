import { useState } from 'react'
import { Building2, Briefcase, User, Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { colaboradoresService, type Colaborador } from '@/services/colaboradoresService'

interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  status: string
  tipo_pessoa: string
}

// Reutilizando o tipo Colaborador do serviço
type Usuario = Colaborador

interface ConfiguracaoInicial {
  nomeProjeto: string
  descricao: string
  objetivos: string
  prazo: string
  orcamento: string
  clienteId: string
  responsavelId: string
}

interface Props {
  configuracao: ConfiguracaoInicial
  onConfiguracao: (config: ConfiguracaoInicial) => void
}

export function ConfiguracaoInicial({ configuracao, onConfiguracao }: Props) {
  const [clienteQuery, setClienteQuery] = useState('')
  const [showClienteSearch, setShowClienteSearch] = useState(false)

  // Buscar colaboradores ativos usando o novo serviço
  const { 
    data: usuariosData, 
    isLoading: loadingUsuarios, 
    error: usuariosError,
    refetch: refetchUsuarios
  } = useQuery({
    queryKey: ['colaboradores-ativos-briefing'],
    queryFn: async (): Promise<{ users: Usuario[] }> => {
      console.log('👥 [ConfiguracaoInicial] Buscando colaboradores ativos...')
      try {
        const colaboradores = await colaboradoresService.listarAtivos()
        
        // Filtrar apenas colaboradores que podem ser responsáveis por briefing
        const responsaveis = colaboradores.filter(colaborador => 
          colaboradoresService.podeSerResponsavel(colaborador)
        )
        
        console.log('✅ [ConfiguracaoInicial] Colaboradores responsáveis encontrados:', responsaveis.length)
        
        return { users: responsaveis }
        
      } catch (error) {
        console.error('❌ [ConfiguracaoInicial] Erro ao buscar colaboradores:', error)
        return { users: [] }
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    gcTime: 10 * 60 * 1000, // Manter em cache por 10 minutos
  })
  
  // CORREÇÃO: Usar fetch direto para clientes também
  const { 
    data: clientesData, 
    isLoading: loadingClientes, 
    error: clientesError,
    refetch: refetchClientes
  } = useQuery({
    queryKey: ['escritorio-clientes-briefing', clienteQuery],
    queryFn: async (): Promise<{ clientes: Cliente[] }> => {
      if (clienteQuery.length < 2) {
        return { clientes: [] }
      }
      
      console.log('🔍 [ConfiguracaoInicial] Buscando clientes:', clienteQuery)
      try {
        const token = localStorage.getItem('arcflow_auth_token')
        if (!token) {
          console.warn('⚠️ Token não encontrado')
          return { clientes: [] }
        }

        const params = new URLSearchParams({
          search: clienteQuery,
          limit: '10'
        })

        const response = await fetch(`http://localhost:3001/api/clientes?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          console.error('❌ Erro na API clientes:', response.status, response.statusText)
          return { clientes: [] }
        }

        const data = await response.json()
        console.log('✅ [ConfiguracaoInicial] Response clientes:', data)
        
        // Processar response de forma robusta
        if (data && data.clientes && Array.isArray(data.clientes)) {
          console.log('✅ Clientes encontrados:', data.clientes.length)
          return { clientes: data.clientes }
        }
        
        // Se não tem clientes mas é um array direto
        if (Array.isArray(data)) {
          console.log('✅ Response é array direto:', data.length)
          return { clientes: data }
        }
        
        // Fallback seguro
        console.warn('⚠️ Formato de response não reconhecido, retornando array vazio')
        return { clientes: [] }
        
      } catch (error) {
        console.error('❌ [ConfiguracaoInicial] Erro ao buscar clientes:', error)
        return { clientes: [] }
      }
    },
    enabled: clienteQuery.length >= 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30 * 1000, // Cache por 30 segundos
    gcTime: 2 * 60 * 1000, // Manter em cache por 2 minutos
  })

  // Processar dados com fallbacks seguros
  const usuarios = usuariosData?.users || []
  const clientes = clientesData?.clientes || []
  
  // Encontrar cliente e usuário selecionados
  const clienteSelecionado = clientes.find(c => c.id === configuracao.clienteId)
  const usuarioSelecionado = usuarios.find(u => u.id === configuracao.responsavelId)

  // Handlers
  const handleClienteSelect = (cliente: Cliente) => {
    onConfiguracao({
      ...configuracao,
      clienteId: cliente.id
    })
    setShowClienteSearch(false)
    setClienteQuery('')
  }

  const handleResponsavelSelect = (usuarioId: string) => {
    onConfiguracao({
      ...configuracao,
      responsavelId: usuarioId
    })
  }

  return (
    <div className="space-y-8">
      {/* Debug Info - TEMPORÁRIO */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Colaboradores responsáveis: {usuarios.length}</p>
        <p>Clientes carregados: {clientes.length}</p>
        <p>Loading colaboradores: {loadingUsuarios ? 'Sim' : 'Não'}</p>
        <p>Loading clientes: {loadingClientes ? 'Sim' : 'Não'}</p>
        <p>Erro colaboradores: {usuariosError ? usuariosError.message : 'Nenhum'}</p>
        <p>Erro clientes: {clientesError ? clientesError.message : 'Nenhum'}</p>
        <button 
          onClick={async () => {
            console.log('🔍 [DEBUG] Testando API diretamente...')
            try {
              const token = localStorage.getItem('arcflow_auth_token')
              const response = await fetch('http://localhost:3001/api/users', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })
              const data = await response.json()
              console.log('🔍 [DEBUG] Response API users:', data)
            } catch (error) {
              console.error('❌ [DEBUG] Erro na API:', error)
            }
          }}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs mt-2"
        >
          Testar API Diretamente
        </button>
      </div>

      {/* Seção: Informações do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Informações do Projeto
          </CardTitle>
          <CardDescription>
            Configure os dados básicos do projeto para o briefing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome do Projeto *"
                value={configuracao.nomeProjeto}
                onChange={(e) => onConfiguracao({
                  ...configuracao,
                  nomeProjeto: e.target.value
                })}
                className={cn(
                  "transition-all",
                  configuracao.nomeProjeto ? "border-green-300 bg-green-50" : ""
                )}
              />
              {configuracao.nomeProjeto && (
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  Nome do projeto definido
                </div>
              )}
            </div>
            
            <Textarea
              placeholder="Descrição detalhada do projeto (opcional)"
              value={configuracao.descricao}
              onChange={(e) => onConfiguracao({
                ...configuracao,
                descricao: e.target.value
              })}
              rows={3}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Prazo estimado (ex: 3 meses)"
                value={configuracao.prazo}
                onChange={(e) => onConfiguracao({
                  ...configuracao,
                  prazo: e.target.value
                })}
              />
              <Input
                placeholder="Orçamento previsto (ex: R$ 50.000)"
                value={configuracao.orcamento}
                onChange={(e) => onConfiguracao({
                  ...configuracao,
                  orcamento: e.target.value
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção: Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            Seleção do Cliente
            {configuracao.clienteId && <Badge variant="outline" className="text-green-600">Selecionado</Badge>}
          </CardTitle>
          <CardDescription>
            Busque e selecione o cliente para este briefing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cliente já selecionado */}
          {clienteSelecionado && !showClienteSearch && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-900">{clienteSelecionado.nome}</div>
                  <div className="text-sm text-green-700">{clienteSelecionado.email}</div>
                  <div className="text-xs text-green-600 mt-1">
                    {clienteSelecionado.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'} • 
                    Status: {clienteSelecionado.status}
                  </div>
                </div>
                <button
                  onClick={() => setShowClienteSearch(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Alterar
                </button>
              </div>
            </div>
          )}

          {/* Busca de cliente */}
          {(!clienteSelecionado || showClienteSearch) && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Digite o nome ou email do cliente..."
                  value={clienteQuery}
                  onChange={(e) => setClienteQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Error handling para clientes */}
              {clientesError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-red-600 text-sm">
                      Erro ao buscar clientes: {clientesError.message}
                    </p>
                  </div>
                  <button
                    onClick={() => refetchClientes()}
                    className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
              
              {/* Loading clientes */}
              {loadingClientes && (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}

              {/* Lista de clientes */}
              {clientes.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg">
                  {clientes.map((cliente: Cliente) => (
                    <button
                      key={cliente.id}
                      onClick={() => handleClienteSelect(cliente)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{cliente.nome}</div>
                          <div className="text-sm text-gray-500">{cliente.email}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {cliente.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Nenhum cliente encontrado */}
              {clienteQuery.length >= 2 && !loadingClientes && clientes.length === 0 && !clientesError && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-yellow-700 text-sm">
                    🔍 Nenhum cliente encontrado para "{clienteQuery}"
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Tente buscar por nome ou email
                  </p>
                </div>
              )}

              {/* Instrução de busca */}
              {clienteQuery.length < 2 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-600 text-sm">
                    💡 Digite pelo menos 2 caracteres para buscar clientes
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Seção: Responsável */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Responsável pelo Briefing
            {configuracao.responsavelId && <Badge variant="outline" className="text-purple-600">Selecionado</Badge>}
          </CardTitle>
          <CardDescription>
            Selecione quem será responsável por conduzir este briefing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Error handling para colaboradores */}
          {usuariosError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-red-600 text-sm">
                  Erro ao buscar colaboradores: {usuariosError.message}
                </p>
              </div>
              <button
                onClick={() => refetchUsuarios()}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Loading colaboradores */}
          {loadingUsuarios ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={configuracao.responsavelId} onValueChange={handleResponsavelSelect}>
              <SelectTrigger className={cn(
                "transition-all",
                configuracao.responsavelId ? "border-purple-300 bg-purple-50" : ""
              )}>
                <SelectValue placeholder="Selecione o responsável pelo briefing" />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map((usuario: Usuario) => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">
                          {usuario.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{usuario.nome}</div>
                        <div className="text-xs text-gray-500">
                          {colaboradoresService.getDescricaoCompleta(usuario)}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Usuário selecionado */}
          {usuarioSelecionado && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700">
                  <strong>{usuarioSelecionado.nome}</strong> será responsável pelo briefing
                </span>
              </div>
            </div>
          )}

          {/* Nenhum colaborador encontrado */}
          {!loadingUsuarios && usuarios.length === 0 && !usuariosError && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <p className="text-yellow-700 text-sm">
                  Nenhum colaborador capacitado encontrado
                </p>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                Apenas colaboradores com funções técnicas (Arquiteto, Engenheiro, etc.) podem ser responsáveis por briefings
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status de Validação */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Status da Configuração</h4>
            
            <div className="flex items-center gap-2">
              {configuracao.nomeProjeto ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className={cn(
                "text-sm",
                configuracao.nomeProjeto ? "text-green-700" : "text-gray-500"
              )}>
                Nome do projeto informado
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {configuracao.clienteId ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className={cn(
                "text-sm",
                configuracao.clienteId ? "text-green-700" : "text-gray-500"
              )}>
                Cliente selecionado
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {configuracao.responsavelId ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className={cn(
                "text-sm",
                configuracao.responsavelId ? "text-green-700" : "text-gray-500"
              )}>
                Responsável definido
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 