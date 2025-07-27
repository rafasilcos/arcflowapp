/**
 * Serviço para integração com dados reais do banco de dados
 * Usado pelo sistema de geração de dados de teste
 */

import { PrismaClient } from '@prisma/client'
import { cacheService } from './cacheService'
import { v4 as uuidv4 } from 'uuid'

// Usar a mesma configuração do servidor principal
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
    }
  }
})

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone?: string
  escritorioId: string
}

export interface Responsavel {
  id: string
  name: string
  email: string
  escritorioId: string
}

export class RealDataService {
  /**
   * Busca clientes reais do banco de dados
   */
  async fetchRealClients(escritorioId?: string): Promise<Cliente[]> {
    const cacheKey = `clients_${escritorioId || 'all'}`
    
    return cacheService.withCache(cacheKey, async () => {
      try {
        const whereClause: any = {
          deletedAt: null,
          isActive: true
        }
        
        if (escritorioId) {
          whereClause.escritorioId = escritorioId
        }

        const clientes = await prisma.cliente.findMany({
          where: whereClause,
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            escritorioId: true
          },
          take: 50, // Limita para performance
          orderBy: {
            createdAt: 'desc'
          }
        })

        return clientes
      } catch (error) {
        console.error('Erro ao buscar clientes reais:', error)
        return []
      }
    }, 3 * 60 * 1000) // Cache por 3 minutos
  }

  /**
   * Busca responsáveis reais do banco de dados
   */
  async fetchRealResponsibles(escritorioId?: string): Promise<Responsavel[]> {
    const cacheKey = `responsibles_${escritorioId || 'all'}`
    
    return cacheService.withCache(cacheKey, async () => {
      try {
        const whereClause: any = {
          isActive: true,
          deletedAt: null
        }
        
        if (escritorioId) {
          whereClause.escritorioId = escritorioId
        }

        const responsaveis = await prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            escritorioId: true
          },
          take: 50, // Limita para performance
          orderBy: {
            createdAt: 'desc'
          }
        })

        return responsaveis
      } catch (error) {
        console.error('Erro ao buscar responsáveis reais:', error)
        return []
      }
    }, 3 * 60 * 1000) // Cache por 3 minutos
  }

  /**
   * Cria um cliente padrão temporário quando não há clientes reais
   */
  async createDefaultClient(escritorioId: string): Promise<Cliente> {
    try {
      const defaultClient = await prisma.cliente.create({
        data: {
          id: uuidv4(),
          nome: 'Cliente Padrão (Teste)',
          email: 'cliente.padrao@teste.com',
          telefone: '(11) 99999-9999',
          cpf: '000.000.000-00',
          tipoPessoa: 'fisica',
          escritorioId,
          enderecoCep: '01234-567',
          enderecoLogradouro: 'Rua Teste',
          enderecoNumero: '123',
          enderecoBairro: 'Centro',
          enderecoCidade: 'São Paulo',
          enderecoUf: 'SP',
          observacoes: 'Cliente criado automaticamente para testes. Pode ser removido.',
          isActive: true
        }
      })

      return {
        id: defaultClient.id,
        nome: defaultClient.nome,
        email: defaultClient.email,
        telefone: defaultClient.telefone || undefined,
        escritorioId: defaultClient.escritorioId
      }
    } catch (error) {
      console.error('Erro ao criar cliente padrão:', error)
      throw new Error('Não foi possível criar cliente padrão')
    }
  }

  /**
   * Seleciona um cliente aleatório da lista
   */
  selectRandomClient(clients: Cliente[]): Cliente {
    if (clients.length === 0) {
      throw new Error('Nenhum cliente disponível para seleção')
    }
    
    const randomIndex = Math.floor(Math.random() * clients.length)
    return clients[randomIndex]
  }

  /**
   * Seleciona um responsável aleatório da lista
   */
  selectRandomResponsible(responsibles: Responsavel[]): Responsavel {
    if (responsibles.length === 0) {
      throw new Error('Nenhum responsável disponível para seleção')
    }
    
    const randomIndex = Math.floor(Math.random() * responsibles.length)
    return responsibles[randomIndex]
  }

  /**
   * Busca dados completos para geração de teste
   */
  async fetchTestGenerationData(escritorioId?: string): Promise<{
    clients: Cliente[]
    responsibles: Responsavel[]
    hasRealData: boolean
  }> {
    const [clients, responsibles] = await Promise.all([
      this.fetchRealClients(escritorioId),
      this.fetchRealResponsibles(escritorioId)
    ])

    return {
      clients,
      responsibles,
      hasRealData: clients.length > 0 && responsibles.length > 0
    }
  }

  /**
   * Valida se cliente existe e está ativo
   */
  async validateClient(clientId: string, escritorioId?: string): Promise<boolean> {
    try {
      const whereClause: any = {
        id: clientId,
        deletedAt: null,
        isActive: true
      }
      
      if (escritorioId) {
        whereClause.escritorioId = escritorioId
      }

      const client = await prisma.cliente.findFirst({
        where: whereClause
      })

      return !!client
    } catch (error) {
      console.error('Erro ao validar cliente:', error)
      return false
    }
  }

  /**
   * Valida se responsável existe e está ativo
   */
  async validateResponsible(responsibleId: string, escritorioId?: string): Promise<boolean> {
    try {
      const whereClause: any = {
        id: responsibleId,
        isActive: true,
        deletedAt: null
      }
      
      if (escritorioId) {
        whereClause.escritorioId = escritorioId
      }

      const responsible = await prisma.user.findFirst({
        where: whereClause
      })

      return !!responsible
    } catch (error) {
      console.error('Erro ao validar responsável:', error)
      return false
    }
  }

  /**
   * Obtém estatísticas de dados disponíveis
   */
  async getDataStats(escritorioId?: string): Promise<{
    totalClients: number
    totalResponsibles: number
    activeClients: number
    activeResponsibles: number
  }> {
    try {
      const whereClause: any = {}
      if (escritorioId) {
        whereClause.escritorioId = escritorioId
      }

      const [totalClients, activeClients, totalResponsibles, activeResponsibles] = await Promise.all([
        prisma.cliente.count({ where: whereClause }),
        prisma.cliente.count({ where: { ...whereClause, deletedAt: null, isActive: true } }),
        prisma.user.count({ where: whereClause }),
        prisma.user.count({ where: { ...whereClause, isActive: true, deletedAt: null } })
      ])

      return {
        totalClients,
        totalResponsibles,
        activeClients,
        activeResponsibles
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        totalClients: 0,
        totalResponsibles: 0,
        activeClients: 0,
        activeResponsibles: 0
      }
    }
  }
}

// Instância singleton do serviço
export const realDataService = new RealDataService()