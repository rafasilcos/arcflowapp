/**
 * Serviço de Paginação Otimizada
 * Tarefa 13: Implementar otimizações de performance
 */

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number;
    previousPage?: number;
  };
  meta?: {
    processingTime: number;
    cacheHit?: boolean;
    queryInfo?: any;
  };
}

interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
  value: any;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

class PaginationService {
  private defaultLimit = 20;
  private maxLimit = 100;

  /**
   * Paginar Briefings com Filtros Otimizados
   */
  async paginateBriefings(
    prisma: any,
    escritorioId: string,
    options: PaginationOptions = {}
  ): Promise<PaginationResult<any>> {
    const startTime = Date.now();
    
    const {
      page = 1,
      limit = this.defaultLimit,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {}
    } = options;

    const validatedLimit = Math.min(limit, this.maxLimit);
    const offset = (page - 1) * validatedLimit;

    // Construir filtros
    const whereClause = this.buildBriefingFilters(escritorioId, filters);
    
    // Construir ordenação
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    try {
      // Executar consultas em paralelo
      const [items, totalCount] = await Promise.all([
        prisma.briefings.findMany({
          where: whereClause,
          orderBy,
          skip: offset,
          take: validatedLimit,
          select: {
            id: true,
            nome_projeto: true,
            tipologia: true,
            subtipologia: true,
            area_construida: true,
            padrao: true,
            status: true,
            orcamento_gerado: true,
            orcamento_id: true,
            created_at: true,
            updated_at: true,
            created_by: true,
            // Incluir dados do orçamento se existir
            orcamento: {
              select: {
                id: true,
                valor_total: true,
                horas_total: true,
                status: true
              }
            }
          }
        }),
        prisma.briefings.count({
          where: whereClause
        })
      ]);

      const totalPages = Math.ceil(totalCount / validatedLimit);
      const processingTime = Date.now() - startTime;

      return {
        data: items,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: validatedLimit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? page + 1 : undefined,
          previousPage: page > 1 ? page - 1 : undefined
        },
        meta: {
          processingTime,
          queryInfo: {
            offset,
            limit: validatedLimit,
            sortBy,
            sortOrder,
            filtersApplied: Object.keys(filters).length
          }
        }
      };

    } catch (error) {
      console.error('Erro na paginação de briefings:', error);
      throw new Error('Erro ao paginar briefings');
    }
  }

  /**
   * Paginar Orçamentos com Filtros Otimizados
   */
  async paginateOrcamentos(
    prisma: any,
    escritorioId: string,
    options: PaginationOptions = {}
  ): Promise<PaginationResult<any>> {
    const startTime = Date.now();
    
    const {
      page = 1,
      limit = this.defaultLimit,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {}
    } = options;

    const validatedLimit = Math.min(limit, this.maxLimit);
    const offset = (page - 1) * validatedLimit;

    const whereClause = this.buildOrcamentoFilters(escritorioId, filters);
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    try {
      const [items, totalCount] = await Promise.all([
        prisma.orcamentos.findMany({
          where: whereClause,
          orderBy,
          skip: offset,
          take: validatedLimit,
          select: {
            id: true,
            briefing_id: true,
            nome_projeto: true,
            tipologia: true,
            area_construida: true,
            valor_total: true,
            horas_total: true,
            status: true,
            created_at: true,
            updated_at: true,
            // Incluir dados do briefing
            briefing: {
              select: {
                id: true,
                nome_projeto: true,
                status: true,
                created_at: true
              }
            },
            // Incluir resumo das disciplinas
            disciplinas: {
              select: {
                nome: true,
                horas: true,
                valor: true
              }
            }
          }
        }),
        prisma.orcamentos.count({
          where: whereClause
        })
      ]);

      const totalPages = Math.ceil(totalCount / validatedLimit);
      const processingTime = Date.now() - startTime;

      return {
        data: items,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: validatedLimit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? page + 1 : undefined,
          previousPage: page > 1 ? page - 1 : undefined
        },
        meta: {
          processingTime,
          queryInfo: {
            offset,
            limit: validatedLimit,
            sortBy,
            sortOrder,
            filtersApplied: Object.keys(filters).length
          }
        }
      };

    } catch (error) {
      console.error('Erro na paginação de orçamentos:', error);
      throw new Error('Erro ao paginar orçamentos');
    }
  }

  /**
   * Busca Paginada com Full-Text Search
   */
  async searchBriefings(
    prisma: any,
    escritorioId: string,
    searchTerm: string,
    options: PaginationOptions = {}
  ): Promise<PaginationResult<any>> {
    const startTime = Date.now();
    
    const {
      page = 1,
      limit = this.defaultLimit,
      sortBy = '_relevance',
      filters = {}
    } = options;

    const validatedLimit = Math.min(limit, this.maxLimit);
    const offset = (page - 1) * validatedLimit;

    // Construir filtros de busca
    const searchFilters = {
      AND: [
        { escritorio_id: escritorioId },
        {
          OR: [
            { nome_projeto: { contains: searchTerm, mode: 'insensitive' } },
            { descricao: { contains: searchTerm, mode: 'insensitive' } },
            { tipologia: { contains: searchTerm, mode: 'insensitive' } },
            { subtipologia: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        ...this.buildAdditionalFilters(filters)
      ]
    };

    try {
      const [items, totalCount] = await Promise.all([
        prisma.briefings.findMany({
          where: searchFilters,
          orderBy: sortBy === '_relevance' 
            ? [{ updated_at: 'desc' }, { created_at: 'desc' }]
            : this.buildOrderBy(sortBy, 'desc'),
          skip: offset,
          take: validatedLimit,
          select: {
            id: true,
            nome_projeto: true,
            descricao: true,
            tipologia: true,
            subtipologia: true,
            area_construida: true,
            status: true,
            orcamento_gerado: true,
            created_at: true,
            updated_at: true
          }
        }),
        prisma.briefings.count({
          where: searchFilters
        })
      ]);

      const totalPages = Math.ceil(totalCount / validatedLimit);
      const processingTime = Date.now() - startTime;

      return {
        data: items,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: validatedLimit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? page + 1 : undefined,
          previousPage: page > 1 ? page - 1 : undefined
        },
        meta: {
          processingTime,
          queryInfo: {
            searchTerm,
            offset,
            limit: validatedLimit,
            filtersApplied: Object.keys(filters).length
          }
        }
      };

    } catch (error) {
      console.error('Erro na busca paginada:', error);
      throw new Error('Erro ao buscar briefings');
    }
  }

  /**
   * Construir Filtros para Briefings
   */
  private buildBriefingFilters(escritorioId: string, filters: Record<string, any>): any {
    const whereClause: any = {
      escritorio_id: escritorioId
    };

    // Filtro por status
    if (filters.status) {
      whereClause.status = filters.status;
    }

    // Filtro por tipologia
    if (filters.tipologia) {
      whereClause.tipologia = filters.tipologia;
    }

    // Filtro por padrão
    if (filters.padrao) {
      whereClause.padrao = filters.padrao;
    }

    // Filtro por área construída
    if (filters.areaMin || filters.areaMax) {
      whereClause.area_construida = {};
      if (filters.areaMin) {
        whereClause.area_construida.gte = parseFloat(filters.areaMin);
      }
      if (filters.areaMax) {
        whereClause.area_construida.lte = parseFloat(filters.areaMax);
      }
    }

    // Filtro por data de criação
    if (filters.dataInicio || filters.dataFim) {
      whereClause.created_at = {};
      if (filters.dataInicio) {
        whereClause.created_at.gte = new Date(filters.dataInicio);
      }
      if (filters.dataFim) {
        whereClause.created_at.lte = new Date(filters.dataFim);
      }
    }

    // Filtro por orçamento gerado
    if (filters.orcamentoGerado !== undefined) {
      whereClause.orcamento_gerado = filters.orcamentoGerado === 'true';
    }

    // Filtro por criador
    if (filters.createdBy) {
      whereClause.created_by = filters.createdBy;
    }

    return whereClause;
  }

  /**
   * Construir Filtros para Orçamentos
   */
  private buildOrcamentoFilters(escritorioId: string, filters: Record<string, any>): any {
    const whereClause: any = {
      escritorio_id: escritorioId
    };

    // Filtro por status
    if (filters.status) {
      whereClause.status = filters.status;
    }

    // Filtro por tipologia
    if (filters.tipologia) {
      whereClause.tipologia = filters.tipologia;
    }

    // Filtro por valor total
    if (filters.valorMin || filters.valorMax) {
      whereClause.valor_total = {};
      if (filters.valorMin) {
        whereClause.valor_total.gte = parseFloat(filters.valorMin);
      }
      if (filters.valorMax) {
        whereClause.valor_total.lte = parseFloat(filters.valorMax);
      }
    }

    // Filtro por horas totais
    if (filters.horasMin || filters.horasMax) {
      whereClause.horas_total = {};
      if (filters.horasMin) {
        whereClause.horas_total.gte = parseFloat(filters.horasMin);
      }
      if (filters.horasMax) {
        whereClause.horas_total.lte = parseFloat(filters.horasMax);
      }
    }

    // Filtro por data
    if (filters.dataInicio || filters.dataFim) {
      whereClause.created_at = {};
      if (filters.dataInicio) {
        whereClause.created_at.gte = new Date(filters.dataInicio);
      }
      if (filters.dataFim) {
        whereClause.created_at.lte = new Date(filters.dataFim);
      }
    }

    return whereClause;
  }

  /**
   * Construir Filtros Adicionais
   */
  private buildAdditionalFilters(filters: Record<string, any>): any[] {
    const additionalFilters: any[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        additionalFilters.push({ [key]: value });
      }
    });

    return additionalFilters;
  }

  /**
   * Construir Ordenação
   */
  private buildOrderBy(sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): any {
    const validSortFields = [
      'created_at', 'updated_at', 'nome_projeto', 'tipologia', 
      'area_construida', 'valor_total', 'horas_total', 'status'
    ];

    if (!validSortFields.includes(sortBy)) {
      sortBy = 'created_at';
    }

    return { [sortBy]: sortOrder };
  }

  /**
   * Obter Estatísticas de Paginação
   */
  async getPaginationStats(
    prisma: any,
    escritorioId: string,
    entity: 'briefings' | 'orcamentos'
  ): Promise<any> {
    try {
      const table = entity === 'briefings' ? prisma.briefings : prisma.orcamentos;
      
      const [total, byStatus, byTipologia, recentCount] = await Promise.all([
        table.count({
          where: { escritorio_id: escritorioId }
        }),
        table.groupBy({
          by: ['status'],
          where: { escritorio_id: escritorioId },
          _count: { id: true }
        }),
        table.groupBy({
          by: ['tipologia'],
          where: { escritorio_id: escritorioId },
          _count: { id: true }
        }),
        table.count({
          where: {
            escritorio_id: escritorioId,
            created_at: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
            }
          }
        })
      ]);

      return {
        total,
        byStatus: byStatus.reduce((acc: any, item: any) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {}),
        byTipologia: byTipologia.reduce((acc: any, item: any) => {
          acc[item.tipologia] = item._count.id;
          return acc;
        }, {}),
        recentCount,
        averagePerPage: Math.ceil(total / this.defaultLimit)
      };

    } catch (error) {
      console.error('Erro ao obter estatísticas de paginação:', error);
      return null;
    }
  }
}

export default new PaginationService();