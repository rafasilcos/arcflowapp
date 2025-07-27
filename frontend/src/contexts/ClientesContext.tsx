'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Cliente } from '@/types/integracaoComercial'
import { sanitizeCliente } from '@/lib/sanitization'

interface ClientesContextType {
  clientes: Cliente[]
  carregando: boolean
  erro: string | null
  paginaAtual: number
  itemsPorPagina: number
  totalClientes: number
  totalPaginas: number
  proximaPagina: () => void
  paginaAnterior: () => void
  irParaPagina: (pagina: number) => void
  alterarItemsPorPagina: (items: number) => void
  adicionar: (cliente: Cliente) => void
  atualizar: (id: string, dados: Partial<Cliente>) => void
  remover: (id: string) => void
  redefinir: (lista: Cliente[]) => void
  buscarClientes: (termo: string) => Cliente[]
  adicionarCliente: (cliente: Partial<Cliente>) => Promise<Cliente>
  consultarCep: (cep: string) => Promise<Partial<Cliente['endereco']> | null>
  recarregar: () => Promise<void>
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined)

export function ClientesProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(25)
  const [totalClientes, setTotalClientes] = useState(0)
  
  // Calcular total de páginas
  const totalPaginas = Math.ceil(totalClientes / itemsPorPagina)

  // Funções de paginação
  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(prev => prev + 1)
    }
  }

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(prev => prev - 1)
    }
  }

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina)
    }
  }

  const alterarItemsPorPagina = (items: number) => {
    setItemsPorPagina(items)
    setPaginaAtual(1) // Voltar para primeira página
  }

  const router = useRouter()

  // Função para converter data SQL (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
  const converterDataSQLParaBrasil = (dataSql: string | null) => {
    if (!dataSql) return '';
    
    try {
      const partes = dataSql.split('T')[0].split('-'); // Remove horário se houver
      if (partes.length !== 3) return '';
      
      const [ano, mes, dia] = partes;
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    } catch {
      return '';
    }
  };

  // Função para verificar se há autenticação válida
  const verificarAutenticacao = () => {
    const token = localStorage.getItem('arcflow_auth_token')
    const userData = localStorage.getItem('arcflow_user')
    const escritorioData = localStorage.getItem('arcflow_escritorio')
    
    return !!(token && userData && escritorioData && 
             userData !== 'undefined' && escritorioData !== 'undefined')
  }

  // Carregar clientes automaticamente quando o provider é montado
  useEffect(() => {
    // Função para tentar carregar clientes
    const tentarCarregar = () => {
      if (verificarAutenticacao()) {
        carregarClientes()
        return true
      }
      return false
    }
    
    // Listener para mudanças no localStorage (quando login acontece)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arcflow_auth_token' && e.newValue) {
        setTimeout(() => tentarCarregar(), 500) // Aguarda um pouco para outros dados serem salvos
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Tentar carregar imediatamente
    if (!tentarCarregar()) {
      // Se não conseguiu, aguardar um pouco e tentar novamente
      const timer = setTimeout(() => {
        tentarCarregar()
      }, 2000) // Aguarda 2 segundos para o AuthGuard terminar
      
      return () => {
        clearTimeout(timer)
        window.removeEventListener('storage', handleStorageChange)
      }
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const carregarClientes = async (busca?: string, filtroStatus?: string) => {
    try {
      setCarregando(true)
      setErro(null)
      
      // Fazer chamada direta à API para evitar problemas de interceptors
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        return // Sair silenciosamente sem erro
      }
      
      // Construir parâmetros da query
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: itemsPorPagina.toString()
      })
      
      if (busca) {
        params.append('search', busca)
      }
      
      if (filtroStatus && filtroStatus !== 'todos') {
        params.append('status', filtroStatus)
      }
      
      const response = await fetch(`http://localhost:3001/api/clientes?${params}`, {
        method: 'GET',
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
      
      const responseData = await response.json()
      
      // A API retorna { clientes: [], pagination: {} }
      const clientesData = responseData.clientes || []
      const paginationData = responseData.pagination || {}
      
      // Atualizar estado de paginação
      setTotalClientes(paginationData.total || 0)
      
      // Processar cada cliente para garantir estrutura correta
      const clientesProcessados = clientesData.map((cliente: any) => {
        let enderecoObj = cliente.endereco;
        try {
          if (typeof cliente.endereco === 'string' && cliente.endereco.startsWith('{')) {
            enderecoObj = JSON.parse(cliente.endereco);
          }
        } catch {}
        
        const enderecoFinal = enderecoObj || {
          cep: cliente.endereco_cep || '',
          logradouro: cliente.endereco_logradouro || '',
          numero: cliente.endereco_numero || '',
          complemento: cliente.endereco_complemento || '',
          bairro: cliente.endereco_bairro || '',
          cidade: cliente.endereco_cidade || '',
          uf: cliente.endereco_uf || '',
          pais: cliente.endereco_pais || 'Brasil'
        }
        
        return {
          ...cliente,
          endereco: enderecoFinal,
          dataNascimento: converterDataSQLParaBrasil(cliente.data_nascimento),
          dataFundacao: converterDataSQLParaBrasil(cliente.data_fundacao),
          status: cliente.status || 'ativo',
          criadoEm: cliente.criadoEm || cliente.created_at || new Date().toISOString(),
          atualizadoEm: cliente.atualizadoEm || cliente.updated_at || new Date().toISOString()
        }
      })
      
      setClientes(clientesProcessados)
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar clientes:', error)
      setErro(error.message || 'Erro ao carregar clientes')
      setClientes([])
    } finally {
      setCarregando(false)
    }
  }

  const recarregar = async () => {
    await carregarClientes()
  }

  const adicionar = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente])
  }

  const atualizar = async (id: string, dados: Partial<Cliente>) => {
    try {
      setErro(null)
      
      // SANITIZAR dados antes de enviar
      const dadosSanitizados = sanitizeCliente(dados)
      
      // CORREÇÃO CRÍTICA: Priorizar campos separados quando existem
      const endereco = {
        cep: (dadosSanitizados as any).endereco_cep || dadosSanitizados.endereco?.cep || '',
        logradouro: (dadosSanitizados as any).endereco_logradouro || dadosSanitizados.endereco?.logradouro || '',
        numero: (dadosSanitizados as any).endereco_numero || dadosSanitizados.endereco?.numero || '',
        complemento: (dadosSanitizados as any).endereco_complemento || dadosSanitizados.endereco?.complemento || '',
        bairro: (dadosSanitizados as any).endereco_bairro || dadosSanitizados.endereco?.bairro || '',
        cidade: (dadosSanitizados as any).endereco_cidade || dadosSanitizados.endereco?.cidade || '',
        uf: (dadosSanitizados as any).endereco_uf || dadosSanitizados.endereco?.uf || '',
        pais: (dadosSanitizados as any).endereco_pais || dadosSanitizados.endereco?.pais || 'Brasil'
      }
      
      const dadosParaAPI = {
        nome: dadosSanitizados.nome,
        email: dadosSanitizados.email,
        telefone: dadosSanitizados.telefone,
        tipoPessoa: dadosSanitizados.tipoPessoa || (dadosSanitizados.cpf ? 'fisica' : 'juridica'),
        cpf: dadosSanitizados.cpf,
        cnpj: dadosSanitizados.cnpj,
        endereco_cep: endereco.cep || '',
        endereco_logradouro: endereco.logradouro || '',
        endereco_numero: endereco.numero || '',
        endereco_complemento: endereco.complemento || '',
        endereco_bairro: endereco.bairro || '',
        endereco_cidade: endereco.cidade || '',
        endereco_uf: endereco.uf || '',
        endereco_pais: endereco.pais || 'Brasil',
        observacoes: dadosSanitizados.observacoes,
        status: dadosSanitizados.status || 'ativo',
        profissao: dadosSanitizados.profissao,
        dataNascimento: dadosSanitizados.dataNascimento,
        dataFundacao: dadosSanitizados.dataFundacao,
        familia: dadosSanitizados.familia,
        origem: dadosSanitizados.origem,
        preferencias: dadosSanitizados.preferencias,
        historicoProjetos: dadosSanitizados.historicoProjetos
      }
      
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.')
      }
      
      const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaAPI)
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        throw new Error(`Erro na API: ${response.status}`)
      }
      
      const responseData = await response.json()
      const clienteAtualizado = responseData.cliente || responseData
      
      const novoEnderecoObj = {
        cep: clienteAtualizado.endereco_cep || '',
        logradouro: clienteAtualizado.endereco_logradouro || '',
        numero: clienteAtualizado.endereco_numero || '',
        complemento: clienteAtualizado.endereco_complemento || '',
        bairro: clienteAtualizado.endereco_bairro || '',
        cidade: clienteAtualizado.endereco_cidade || '',
        uf: clienteAtualizado.endereco_uf || '',
        pais: clienteAtualizado.endereco_pais || 'Brasil'
      }
      
      setClientes(prev => prev.map(c => 
        c.id === id ? { 
          ...clienteAtualizado, 
          endereco: novoEnderecoObj,
          dataNascimento: converterDataSQLParaBrasil(clienteAtualizado.data_nascimento),
          dataFundacao: converterDataSQLParaBrasil(clienteAtualizado.data_fundacao),
          atualizadoEm: clienteAtualizado.updatedAt || new Date().toISOString() 
        } : c
      ))
      
    } catch (error: any) {
      console.error('❌ Erro ao atualizar cliente:', error)
      setErro(error.message || 'Erro ao atualizar cliente')
    }
  }

  const remover = async (id: string) => {
    try {
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.')
      }
      
      const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
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
      
    setClientes(prev => prev.filter(c => c.id !== id))
    } catch (error: any) {
      console.error('❌ Erro ao remover cliente:', error)
      setErro(error.message || 'Erro ao remover cliente')
    }
  }

  const redefinir = (lista: Cliente[]) => {
    setClientes(lista)
  }

  const buscarClientes = (termo: string) => {
    if (!termo) return clientes;
    return clientes.filter(c =>
      c.nome?.toLowerCase().includes(termo.toLowerCase()) ||
      c.email?.toLowerCase().includes(termo.toLowerCase()) ||
      c.telefone?.includes(termo)
    );
  };

  const adicionarCliente = async (clienteData: Partial<Cliente>) => {
    try {
      setErro(null)
      
      // SANITIZAR dados antes de enviar
      const clienteSanitizado = sanitizeCliente(clienteData)
      
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }
      
      // 🔍 DEBUG TEMPORÁRIO - Ver dados de endereço que estão sendo enviados
      console.log('🔍 [FRONTEND DEBUG] Dados de endereço no clienteSanitizado:');
      console.log('  endereco objeto:', clienteSanitizado.endereco);
      console.log('  endereco.cep:', clienteSanitizado.endereco?.cep);
      console.log('  endereco.logradouro:', clienteSanitizado.endereco?.logradouro);
      console.log('  endereco.numero:', clienteSanitizado.endereco?.numero);
      console.log('  endereco.bairro:', clienteSanitizado.endereco?.bairro);
      console.log('  endereco.cidade:', clienteSanitizado.endereco?.cidade);
      console.log('  endereco.uf:', clienteSanitizado.endereco?.uf);
      
      // Verificar se existe endereço em campos separados também
      console.log('🔍 [FRONTEND DEBUG] Campos separados:');
      console.log('  endereco_cep:', (clienteSanitizado as any).endereco_cep);
      console.log('  endereco_logradouro:', (clienteSanitizado as any).endereco_logradouro);

      // Preparar dados para envio - usar campos separados OU objeto endereco
      const dadosParaAPI = {
        nome: clienteSanitizado.nome,
        email: clienteSanitizado.email,
        telefone: clienteSanitizado.telefone,
        tipoPessoa: clienteSanitizado.tipoPessoa || (clienteSanitizado.cpf ? 'fisica' : 'juridica'),
        cpf: clienteSanitizado.cpf,
        cnpj: clienteSanitizado.cnpj,
        endereco_cep: clienteSanitizado.endereco?.cep || (clienteSanitizado as any).endereco_cep || '',
        endereco_logradouro: clienteSanitizado.endereco?.logradouro || (clienteSanitizado as any).endereco_logradouro || '',
        endereco_numero: clienteSanitizado.endereco?.numero || (clienteSanitizado as any).endereco_numero || '',
        endereco_complemento: clienteSanitizado.endereco?.complemento || (clienteSanitizado as any).endereco_complemento || '',
        endereco_bairro: clienteSanitizado.endereco?.bairro || (clienteSanitizado as any).endereco_bairro || '',
        endereco_cidade: clienteSanitizado.endereco?.cidade || (clienteSanitizado as any).endereco_cidade || '',
        endereco_uf: clienteSanitizado.endereco?.uf || (clienteSanitizado as any).endereco_uf || '',
        endereco_pais: clienteSanitizado.endereco?.pais || (clienteSanitizado as any).endereco_pais || 'Brasil',
        observacoes: clienteSanitizado.observacoes,
        status: clienteSanitizado.status || 'ativo',
        profissao: clienteSanitizado.profissao,
        dataNascimento: clienteSanitizado.dataNascimento,
        dataFundacao: clienteSanitizado.dataFundacao,
        familia: clienteSanitizado.familia,
        origem: clienteSanitizado.origem,
        preferencias: clienteSanitizado.preferencias,
        historicoProjetos: clienteSanitizado.historicoProjetos
      }
      
      // 🔍 DEBUG TEMPORÁRIO - Ver dados finais que serão enviados
      console.log('🔍 [FRONTEND DEBUG] Dados finais para API:');
      console.log('  endereco_cep:', dadosParaAPI.endereco_cep);
      console.log('  endereco_logradouro:', dadosParaAPI.endereco_logradouro);
      console.log('  endereco_numero:', dadosParaAPI.endereco_numero);
      console.log('  endereco_bairro:', dadosParaAPI.endereco_bairro);
      console.log('  endereco_cidade:', dadosParaAPI.endereco_cidade);
      console.log('  endereco_uf:', dadosParaAPI.endereco_uf);
      
      const response = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaAPI)
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        throw new Error(`Erro na API: ${response.status}`)
      }
      
      const responseData = await response.json()
      const novoCliente = responseData.cliente || responseData
      
      setClientes(prev => [
        {
          ...novoCliente,
          endereco: {
            cep: novoCliente.endereco_cep || '',
            logradouro: novoCliente.endereco_logradouro || '',
            numero: novoCliente.endereco_numero || '',
            complemento: novoCliente.endereco_complemento || '',
            bairro: novoCliente.endereco_bairro || '',
            cidade: novoCliente.endereco_cidade || '',
            uf: novoCliente.endereco_uf || '',
            pais: novoCliente.endereco_pais || 'Brasil'
          },
          criadoEm: novoCliente.createdAt || new Date().toISOString(),
          atualizadoEm: novoCliente.updatedAt || new Date().toISOString()
        },
        ...prev
      ])
      return novoCliente
    } catch (error: any) {
      console.error('❌ Erro ao criar cliente:', error)
      
      // Tratamento específico de erros baseado no status HTTP
      let mensagemErro = 'Erro desconhecido ao criar cliente'
      
      // Tentar extrair erro da resposta se disponível
      if (error.message.includes('409')) {
        mensagemErro = 'Este cliente já está cadastrado no sistema (email, CPF ou CNPJ duplicado)'
      } else if (error.message.includes('429')) {
        mensagemErro = 'Você está criando clientes muito rapidamente. Aguarde alguns minutos e tente novamente.'
      } else if (error.message.includes('400')) {
        mensagemErro = 'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.'
      } else if (error.message.includes('401')) {
        mensagemErro = 'Sua sessão expirou. Faça login novamente.'
        // TODO: Redirecionar para login
      } else if (error.message.includes('403')) {
        mensagemErro = 'Você não tem permissão para criar clientes.'
      } else if (error.message.includes('500')) {
        mensagemErro = 'Erro interno do servidor. Tente novamente em alguns minutos.'
      } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.'
      } else if (error.message.includes('Token de autenticação não encontrado')) {
        mensagemErro = 'Sessão expirada. Faça login novamente.'
      } else {
        // Usar mensagem original se não conseguir categorizar
        mensagemErro = error.message || 'Erro desconhecido ao criar cliente'
      }
      
      setErro(mensagemErro)
      throw new Error(mensagemErro)
    }
  }

  const consultarCep = async (cep: string) => {
    try {
      if (!cep || cep.length < 8) return null
      
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
      const data = await response.json()
      
      if (data.erro) return null
      
    return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        pais: 'Brasil'
      }
    } catch (error) {
      console.error('❌ Erro ao consultar CEP:', error)
      return null
    }
  }

  // Recarregar quando página ou itens por página mudarem
  // TEMPORARIAMENTE COMENTADO - estava sobrescrevendo dados após edição
  // useEffect(() => {
  //   if (verificarAutenticacao()) {
  //     carregarClientes()
  //   }
  // }, [paginaAtual, itemsPorPagina])

  return (
    <ClientesContext.Provider value={{ 
      clientes, 
      carregando, 
      erro, 
      adicionar, 
      atualizar, 
      remover, 
      redefinir, 
      buscarClientes, 
      adicionarCliente, 
      consultarCep,
      recarregar,
      paginaAtual,
      itemsPorPagina,
      totalClientes,
      totalPaginas,
      proximaPagina,
      paginaAnterior,
      irParaPagina,
      alterarItemsPorPagina
    }}>
      {children}
    </ClientesContext.Provider>
  )
}

export function useClientes() {
  const context = useContext(ClientesContext)
  if (!context) throw new Error('useClientes deve ser usado dentro de ClientesProvider')
  return context
}