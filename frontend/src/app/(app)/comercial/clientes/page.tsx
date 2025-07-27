'use client'

import Link from 'next/link'
import { Plus, User, Search, Eye, Edit3, Phone, Mail, MapPin, Trash2 } from 'lucide-react'
import { useClientes } from '@/contexts/ClientesContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'
import FooterSection from '@/components/ui/FooterSection'

function getInitials(nome: string) {
  return nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ativo': return 'text-green-600 bg-green-50 border-green-200'
    case 'vip': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'problema': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export default function ClientesPage() {
  const { 
    clientes, 
    carregando, 
    erro, 
    remover,
    recarregar,
    paginaAtual,
    itemsPorPagina,
    totalClientes,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
    irParaPagina,
    alterarItemsPorPagina
  } = useClientes()
  const { tema, temaId } = useTheme()
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [clienteParaExcluir, setClienteParaExcluir] = useState<any>(null)
  const [excluindoCliente, setExcluindoCliente] = useState(false)

  // Função para excluir cliente
  const handleExcluirCliente = async () => {
    if (!clienteParaExcluir) return
    
    try {
      setExcluindoCliente(true)
      await remover(clienteParaExcluir.id)
      setClienteParaExcluir(null)
      // Recarregar a lista após exclusão
      await recarregar()
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      // O erro já é tratado no contexto
    } finally {
      setExcluindoCliente(false)
    }
  }

  // TEMPORARIAMENTE COMENTADO - CAUSANDO RECARREGAMENTO APÓS EDIÇÃO
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     recarregar()
  //   }, 300) // Debounce de 300ms
  //   
  //   return () => clearTimeout(timer)
  // }, [busca, filtroStatus])

  // Filtrar clientes localmente (já vem filtrados da API, mas mantemos para compatibilidade)
  const filtrados = clientes
    .filter(c => {
      const termo = busca.toLowerCase()
      const matchBusca = (
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.telefone.includes(termo)
      )
      const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus
      return matchBusca && matchStatus
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')) // Ordenação A-Z em português

  // Componente de Paginação
  const PaginacaoAvancada = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-current/10 bg-current/5">
      {/* Informações da página */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div>
          Mostrando {((paginaAtual - 1) * itemsPorPagina) + 1} a {Math.min(paginaAtual * itemsPorPagina, totalClientes)} de {totalClientes} clientes
        </div>
        
        {/* Seletor de itens por página */}
        <select
          value={itemsPorPagina}
          onChange={(e) => alterarItemsPorPagina(Number(e.target.value))}
          className="px-2 py-1 rounded border text-sm"
        >
          <option value={10}>10 por página</option>
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={paginaAnterior}
          disabled={paginaAtual === 1}
          className="px-3 py-1"
        >
          ← Anterior
        </Button>
        
        {/* Números das páginas */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
            let pageNum;
            if (totalPaginas <= 5) {
              pageNum = i + 1;
            } else if (paginaAtual <= 3) {
              pageNum = i + 1;
            } else if (paginaAtual >= totalPaginas - 2) {
              pageNum = totalPaginas - 4 + i;
            } else {
              pageNum = paginaAtual - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => irParaPagina(pageNum)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  pageNum === paginaAtual
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={proximaPagina}
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-1"
        >
          Próxima →
        </Button>
      </div>
    </div>
  )

  return (
    <div className={`bg-gradient-to-br ${tema.bg} py-8 px-4`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className={`${tema.card} rounded-3xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-8 mb-8`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-2xl ${
                  temaId === 'elegante' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  <User className="w-6 h-6" />
                </div>
                <h1 className={`text-3xl font-bold ${tema.text}`}>
                  Gestão de Clientes
                </h1>
              </div>
              <p className={`text-lg ${tema.textSecondary} max-w-2xl`}>
                Gerencie sua base de clientes com facilidade. Cadastre, edite e acompanhe o histórico de cada cliente do seu escritório.
              </p>
              
              {/* Estatísticas */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className={`text-sm font-medium ${tema.text}`}>
                    {clientes.filter(c => c.status === 'ativo').length} Ativos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className={`text-sm font-medium ${tema.text}`}>
                    {clientes.filter(c => c.status === 'vip').length} VIP
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className={`text-sm font-medium ${tema.text}`}>
                    {clientes.length} Total
                  </span>
                </div>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
                }`} />
                <Input 
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={`pl-10 ${
                    temaId === 'elegante'
                      ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      : 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  }`}
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className={`px-4 py-2 rounded-xl border font-medium transition-all ${
                    temaId === 'elegante'
                      ? 'bg-white border-gray-300 text-gray-700'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  <option value="todos">📋 Todos</option>
                  <option value="ativo">✅ Ativos</option>
                  <option value="vip">⭐ VIP</option>
                  <option value="problema">⚠️ Problema</option>
                </select>
                
                <Link href="/comercial/clientes/lixeira">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`font-medium transition-all ${
                      temaId === 'elegante'
                        ? 'hover:bg-red-50 hover:border-red-200 hover:text-red-700'
                        : 'hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-300'
                    }`}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Lixeira
                  </Button>
                </Link>
                
                <Link href="/comercial/clientes/novo">
                  <Button 
                    variant="comercial" 
                    size="lg"
                    className="font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Cliente
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {carregando ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${tema.card} rounded-3xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-12`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-200 mb-6"></div>
              <h3 className={`text-2xl font-bold ${tema.text} mb-2`}>
                Carregando clientes...
              </h3>
              <p className={`text-lg ${tema.textSecondary}`}>
                Conectando com o banco de dados
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
                <User className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">
                Erro ao carregar clientes
              </h3>
              <p className="text-lg text-red-500 mb-6 max-w-md">
                {erro}
              </p>
              <Button 
                onClick={recarregar}
                variant="outline" 
                size="lg"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Tentar Novamente
              </Button>
            </div>
          </motion.div>
        ) : clientes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${tema.card} rounded-3xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-12`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-6 rounded-3xl mb-6 bg-gray-100">
                <User className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className={`text-2xl font-bold ${tema.text} mb-2`}>
                Nenhum cliente encontrado
              </h3>
              <p className={`text-lg ${tema.textSecondary} mb-6 max-w-md`}>
                Você ainda não possui clientes cadastrados. Comece cadastrando seu primeiro cliente para começar a usar o sistema.
              </p>
              <div className="flex gap-4">
              <Link href="/comercial/clientes/novo">
                <Button variant="comercial" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
                  Cadastrar Primeiro Cliente
                </Button>
              </Link>
                <Button 
                  onClick={recarregar}
                  variant="outline" 
                  size="lg"
                  className="font-medium"
                >
                  Atualizar Lista
                </Button>
              </div>
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
                  📋 Lista de Clientes ({filtrados.length})
                </h3>
                <div className="text-sm text-gray-500">
                  Ordenados A-Z {filtroStatus !== 'todos' && `• ${filtroStatus}`} {busca && `• "${busca}"`}
                </div>
              </div>
            </div>
            
            {/* Lista de Clientes */}
            <div className="divide-y divide-current/10">
              {filtrados.map((cliente, index) => (
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
                        cliente.status === 'vip'
                          ? temaId === 'elegante'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                          : cliente.status === 'problema'
                            ? temaId === 'elegante'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-red-500/20 text-red-300 border-red-400/30'
                            : temaId === 'elegante'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                      }`}>
                        {getInitials(cliente.nome)}
                      </div>

                      {/* Informações Principais */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-bold text-lg ${tema.text} truncate`}>
                            {cliente.nome}
                          </h3>
                          <Badge 
                            className={`capitalize px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(cliente.status)}`}
                          >
                            {cliente.status}
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
                          {(cliente.endereco?.cidade || cliente.endereco?.uf) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{cliente.endereco?.cidade || 'N/A'}/{cliente.endereco?.uf || 'N/A'}</span>
                            </div>
                          )}
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
                        
                        <div className="text-center">
                          <div className="font-medium text-xs text-gray-400">
                            Cliente desde
                          </div>
                          <div className="text-xs">
                            {cliente.criadoEm ? new Date(cliente.criadoEm).toLocaleDateString('pt-BR') : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/comercial/clientes/${cliente.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`font-medium transition-all ${
                              temaId === 'elegante'
                                ? 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
                                : 'hover:bg-blue-500/10 hover:border-blue-400/30 hover:text-blue-300'
                            }`}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setClienteParaExcluir(cliente)}
                          className={`font-medium transition-all ${
                            temaId === 'elegante'
                              ? 'hover:bg-red-50 hover:border-red-200 hover:text-red-700'
                              : 'hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-300'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Footer da Lista */}
            {filtrados.length > 0 && (
              <PaginacaoAvancada />
            )}
          </div>
        )}

        {/* Footer */}
        <FooterSection 
          titulo="👥 Gestão Comercial ArcFlow"
          subtitulo="CRM • Pipeline • Clientes • Comunicação Integrada"
        />
        
        {/* Modal de Confirmação de Exclusão */}
        {clienteParaExcluir && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Confirmar Exclusão
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Tem certeza que deseja excluir o cliente:
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-gray-900">
                    {clienteParaExcluir.nome}
                  </div>
                  <div className="text-sm text-gray-600">
                    {clienteParaExcluir.email}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setClienteParaExcluir(null)}
                  disabled={excluindoCliente}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleExcluirCliente}
                  disabled={excluindoCliente}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {excluindoCliente ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 