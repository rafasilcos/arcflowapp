'use client'

import Link from 'next/link'
import { ArrowLeft, Trash2, RotateCcw, User, Calendar, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface ClienteRemovido {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  cnpj?: string;
  deleted_at: string;
  deleted_by: string;
  status: string;
}

function getInitials(nome: string) {
  return nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function LixeiraClientesPage() {
  const { tema, temaId } = useTheme()
  const [clientesRemovidos, setClientesRemovidos] = useState<ClienteRemovido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [restaurando, setRestaurando] = useState<string | null>(null)
  const [excluindoPermanente, setExcluindoPermanente] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar clientes removidos
  const carregarClientesRemovidos = async () => {
    try {
      setCarregando(true)
      setErro(null)
      
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }

      const response = await fetch('http://localhost:3001/api/clientes/lixeira', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      setClientesRemovidos(data.clientes || [])
      
    } catch (error: any) {
      console.error('Erro ao carregar lixeira:', error)
      setErro(error.message || 'Erro ao carregar clientes removidos')
    } finally {
      setCarregando(false)
    }
  }

  // Restaurar cliente
  const restaurarCliente = async (cliente: ClienteRemovido) => {
    try {
      setRestaurando(cliente.id)
      
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }

      const response = await fetch(`http://localhost:3001/api/clientes/${cliente.id}/restaurar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        throw new Error(`Erro na API: ${response.status}`)
      }

      toast.success(`Cliente ${cliente.nome} restaurado com sucesso!`)
      
      // Remover da lista local
      setClientesRemovidos(prev => prev.filter(c => c.id !== cliente.id))
      
    } catch (error: any) {
      console.error('Erro ao restaurar cliente:', error)
      toast.error(error.message || 'Erro ao restaurar cliente')
    } finally {
      setRestaurando(null)
    }
  }

  // Excluir cliente permanentemente
  const excluirPermanentemente = async (cliente: ClienteRemovido) => {
    if (!confirm(`⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nTem certeza que deseja excluir PERMANENTEMENTE o cliente:\n\n${cliente.nome}\n${cliente.email}\n\nEste cliente será removido definitivamente do sistema e não poderá ser recuperado.`)) {
      return
    }

    try {
      setExcluindoPermanente(cliente.id)
      
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }

      const response = await fetch(`http://localhost:3001/api/clientes/${cliente.id}/permanente`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        throw new Error(`Erro na API: ${response.status}`)
      }

      toast.success(`Cliente ${cliente.nome} excluído permanentemente!`)
      
      // Remover da lista local
      setClientesRemovidos(prev => prev.filter(c => c.id !== cliente.id))
      
    } catch (error: any) {
      console.error('Erro ao excluir cliente permanentemente:', error)
      toast.error(error.message || 'Erro ao excluir cliente permanentemente')
    } finally {
      setExcluindoPermanente(null)
    }
  }

  useEffect(() => {
    carregarClientesRemovidos()
  }, [])

  return (
    <div className={`bg-gradient-to-br ${tema.bg} py-8 px-4 min-h-screen`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className={`${tema.card} rounded-3xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-8 mb-8`}>
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/comercial/clientes"
              className={`p-2 rounded-xl transition-colors ${
                temaId === 'elegante'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white/60 hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className={`p-3 rounded-2xl ${
              temaId === 'elegante' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${tema.text}`}>
                Lixeira de Clientes
              </h1>
              <p className={`text-lg ${tema.textSecondary} mt-1`}>
                Clientes removidos que podem ser restaurados
              </p>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className={`text-sm font-medium ${tema.text}`}>
                {clientesRemovidos.length} Clientes Removidos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className={`text-sm font-medium ${tema.text}`}>
                Podem ser restaurados
              </span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        {carregando ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${tema.card} rounded-3xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-12`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className={`text-lg ${tema.text}`}>
                Carregando clientes removidos...
              </p>
            </div>
          </motion.div>
        ) : erro ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${tema.card} rounded-3xl shadow-xl border border-red-200 p-12`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-6 rounded-3xl mb-6 bg-red-100">
                <Trash2 className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">
                Erro ao carregar lixeira
              </h3>
              <p className="text-lg text-red-500 mb-6 max-w-md">
                {erro}
              </p>
              <Button 
                onClick={carregarClientesRemovidos}
                variant="outline" 
                size="lg"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Tentar Novamente
              </Button>
            </div>
          </motion.div>
        ) : clientesRemovidos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${tema.card} rounded-3xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-12`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-6 rounded-3xl mb-6 bg-green-100">
                <Trash2 className="w-16 h-16 text-green-600" />
              </div>
              <h3 className={`text-2xl font-bold ${tema.text} mb-2`}>
                Lixeira vazia
              </h3>
              <p className={`text-lg ${tema.textSecondary} mb-6 max-w-md`}>
                Não há clientes removidos no momento. Todos os clientes estão ativos na sua lista principal.
              </p>
              <Link href="/comercial/clientes">
                <Button variant="outline" size="lg">
                  Voltar para Clientes
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className={`${tema.card} rounded-3xl shadow-xl border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
          } overflow-hidden`}>
            
            {/* Header da Lista */}
            <div className="p-6 border-b border-current/10">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${tema.text}`}>
                  🗑️ Clientes Removidos ({clientesRemovidos.length})
                </h3>
                <Button 
                  onClick={carregarClientesRemovidos}
                  variant="outline" 
                  size="sm"
                >
                  Atualizar
                </Button>
              </div>
            </div>
            
            {/* Lista de Clientes Removidos */}
            <div className="divide-y divide-current/10">
              {clientesRemovidos.map((cliente, index) => (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group hover:bg-current/5 transition-all duration-200 ${
                    temaId === 'elegante' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border-2 flex-shrink-0 ${
                        temaId === 'elegante'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-red-500/20 text-red-300 border-red-400/30'
                      }`}>
                        {getInitials(cliente.nome)}
                      </div>

                      {/* Informações Principais */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-bold text-lg ${tema.text} truncate`}>
                            {cliente.nome}
                          </h3>
                          <Badge className="capitalize px-2 py-1 text-xs font-semibold rounded-full border bg-red-50 text-red-600 border-red-200">
                            Removido
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{cliente.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{cliente.telefone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Removido em {new Date(cliente.deleted_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Informações Secundárias */}
                      <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
                        {(cliente.cpf || cliente.cnpj) && (
                          <div className="text-center">
                            <div className="font-medium text-xs text-gray-400">
                              {cliente.cpf ? 'CPF' : 'CNPJ'}
                            </div>
                            <div className="font-mono text-xs">
                              {cliente.cpf || cliente.cnpj}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restaurarCliente(cliente)}
                          disabled={restaurando === cliente.id || excluindoPermanente === cliente.id}
                          className={`font-medium transition-all ${
                            temaId === 'elegante'
                              ? 'hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                              : 'hover:bg-green-500/10 hover:border-green-400/30 hover:text-green-300'
                          }`}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          {restaurando === cliente.id ? 'Restaurando...' : 'Restaurar'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => excluirPermanentemente(cliente)}
                          disabled={restaurando === cliente.id || excluindoPermanente === cliente.id}
                          className={`font-medium transition-all border-red-200 text-red-600 ${
                            temaId === 'elegante'
                              ? 'hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                              : 'hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {excluindoPermanente === cliente.id ? 'Excluindo...' : 'Excluir Definitivamente'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 