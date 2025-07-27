import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorio, requireProjectAccess } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { CacheService } from '../config/redis';

const router = Router();

// GET /api/projetos - Listar projetos do escritório
router.get('/', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search, status, tipologia, clienteId, orderBy = 'createdAt' } = req.query;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  const skip = (Number(page) - 1) * Number(limit);
  
  // Cache key
  const cacheKey = `projetos:${escritorioId}:${page}:${limit}:${search}:${status}:${tipologia}:${clienteId}:${orderBy}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Filtros
  const where: any = {
    escritorioId,
    deletedAt: null,
    OR: [
      { criadoPor: userId },
      { equipe: { some: { userId } } },
      { publico: true }
    ]
  };

  if (search) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { nome: { contains: search as string, mode: 'insensitive' } },
          { codigo: { contains: search as string, mode: 'insensitive' } },
          { descricao: { contains: search as string, mode: 'insensitive' } }
        ]
      }
    ];
  }

  if (status) {
    where.status = status;
  }

  if (tipologia) {
    where.tipologia = tipologia;
  }

  if (clienteId) {
    where.clienteId = clienteId;
  }

  const [projetos, total] = await Promise.all([
    prisma.projeto.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [orderBy as string]: 'desc' },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        equipe: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            atividades: true,
            arquivos: true,
            cronometros: true
          }
        }
      }
    }),
    prisma.projeto.count({ where })
  ]);

  const result = {
    projetos,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  };

  // Cache por 2 minutos
  await cache.setex(cacheKey, 120, JSON.stringify(result));
  
  res.json(result);
}));

// GET /api/projetos/:id - Obter projeto específico
router.get('/:id', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  const cacheKey = `projeto:${id}:${escritorioId}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const projeto = await prisma.projeto.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      cliente: true,
      equipe: {
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              email: true,
              role: true
            }
          }
        }
      },
      atividades: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          responsavel: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      },
      arquivos: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      cronometros: {
        where: { status: 'ATIVO' },
        include: {
          user: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      },
      briefings: {
        select: {
          id: true,
          titulo: true,
          status: true,
          createdAt: true
        }
      }
    }
  });

  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  // Cache por 5 minutos
  await cache.setex(cacheKey, 300, JSON.stringify({ projeto }));

  res.json({ projeto });
}));

// POST /api/projetos - Criar novo projeto
router.post('/', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { 
    nome, 
    descricao, 
    clienteId, 
    tipologia, 
    subtipo, 
    complexidade,
    dataInicio,
    dataPrevisaoTermino,
    orcamentoEstimado,
    observacoes,
    publico = false,
    equipeIds = []
  } = req.body;
  
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Validações
  if (!nome || !clienteId || !tipologia) {
    throw new ValidationError('Nome, cliente e tipologia são obrigatórios');
  }

  // Verificar se cliente existe e pertence ao escritório
  const cliente = await prisma.cliente.findFirst({
    where: { 
      id: clienteId, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (!cliente) {
    throw new ValidationError('Cliente não encontrado ou não pertence ao escritório');
  }

  // Gerar código único do projeto
  const anoAtual = new Date().getFullYear();
  const prefixo = tipologia.substring(0, 3).toUpperCase();
  const ultimoProjeto = await prisma.projeto.findFirst({
    where: {
      escritorioId,
      codigo: { startsWith: `${prefixo}-${anoAtual}` }
    },
    orderBy: { codigo: 'desc' }
  });

  let proximoNumero = 1;
  if (ultimoProjeto) {
    const numeroAtual = parseInt(ultimoProjeto.codigo.split('-')[2]) || 0;
    proximoNumero = numeroAtual + 1;
  }

  const codigo = `${prefixo}-${anoAtual}-${proximoNumero.toString().padStart(3, '0')}`;

  const projeto = await prisma.projeto.create({
    data: {
      nome: nome.trim(),
      codigo,
      descricao: descricao?.trim(),
      clienteId,
      tipologia,
      subtipo,
      complexidade: complexidade || 'MEDIA',
      status: 'PLANEJAMENTO',
      dataInicio: dataInicio ? new Date(dataInicio) : new Date(),
      dataPrevisaoTermino: dataPrevisaoTermino ? new Date(dataPrevisaoTermino) : null,
      orcamentoEstimado: orcamentoEstimado || 0,
      observacoes: observacoes?.trim(),
      publico,
      escritorioId,
      criadoPor: userId,
      equipe: {
        create: [
          // Criador sempre faz parte da equipe
          {
            userId,
            papel: 'COORDENADOR',
            permissoes: ['READ', 'WRITE', 'DELETE', 'MANAGE']
          },
          // Adicionar outros membros
          ...equipeIds.map((id: string) => ({
            userId: id,
            papel: 'COLABORADOR',
            permissoes: ['READ', 'WRITE']
          }))
        ]
      }
    },
    include: {
      cliente: true,
      equipe: {
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      }
    }
  });

  // Invalidar cache
  await cache.del(`projetos:${escritorioId}:*`);

  logger.info('Projeto criado', { 
    projetoId: projeto.id, 
    nome: projeto.nome,
    codigo: projeto.codigo,
    escritorioId,
    userId 
  });

  res.status(201).json({
    message: 'Projeto criado com sucesso',
    projeto
  });
}));

// PUT /api/projetos/:id - Atualizar projeto
router.put('/:id', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se projeto existe
  const projetoExistente = await prisma.projeto.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (!projetoExistente) {
    throw new NotFoundError('Projeto não encontrado');
  }

  // Verificar se cliente existe (se alterado)
  if (updateData.clienteId && updateData.clienteId !== projetoExistente.clienteId) {
    const cliente = await prisma.cliente.findFirst({
      where: { 
        id: updateData.clienteId, 
        escritorioId,
        deletedAt: null 
      }
    });

    if (!cliente) {
      throw new ValidationError('Cliente não encontrado ou não pertence ao escritório');
    }
  }

  const projeto = await prisma.projeto.update({
    where: { id },
    data: {
      ...updateData,
      updatedAt: new Date()
    },
    include: {
      cliente: true,
      equipe: {
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      }
    }
  });

  // Invalidar cache
  await cache.del(`projetos:${escritorioId}:*`);
  await cache.del(`projeto:${id}:${escritorioId}`);

  logger.info('Projeto atualizado', { 
    projetoId: id, 
    escritorioId,
    userId 
  });

  res.json({
    message: 'Projeto atualizado com sucesso',
    projeto
  });
}));

// DELETE /api/projetos/:id - Deletar projeto (soft delete)
router.delete('/:id', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se projeto existe
  const projeto = await prisma.projeto.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      cronometros: {
        where: { status: 'ATIVO' }
      }
    }
  });

  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  // Verificar se tem cronômetros ativos
  if (projeto.cronometros.length > 0) {
    throw new ValidationError('Não é possível deletar projeto com cronômetros ativos');
  }

  // Soft delete
  await prisma.projeto.update({
    where: { id },
    data: {
      deletedAt: new Date()
    }
  });

  // Invalidar cache
  await cache.del(`projetos:${escritorioId}:*`);
  await cache.del(`projeto:${id}:${escritorioId}`);

  logger.info('Projeto deletado', { 
    projetoId: id, 
    escritorioId,
    userId 
  });

  res.json({
    message: 'Projeto deletado com sucesso'
  });
}));

// POST /api/projetos/:id/team - Adicionar usuário à equipe
router.post('/:id/team', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId: novoUserId, papel = 'COLABORADOR', permissoes = ['READ', 'write'] } = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  if (!novoUserId) {
    throw new ValidationError('ID do usuário é obrigatório');
  }

  // Verificar se usuário existe no escritório
  const usuario = await prisma.user.findFirst({
    where: { 
      id: novoUserId, 
      escritorioId,
      status: 'ATIVO' 
    }
  });

  if (!usuario) {
    throw new ValidationError('Usuário não encontrado ou não pertence ao escritório');
  }

  // Verificar se já está na equipe
  const membroExistente = await prisma.equipeProjeto.findFirst({
    where: {
      projetoId: id,
      userId: novoUserId
    }
  });

  if (membroExistente) {
    throw new ValidationError('Usuário já faz parte da equipe');
  }

  const membro = await prisma.equipeProjeto.create({
    data: {
      projetoId: id,
      userId: novoUserId,
      papel,
      permissoes
    },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          role: true
        }
      }
    }
  });

  // Invalidar cache
  await cache.del(`projeto:${id}:${escritorioId}`);

  logger.info('Usuário adicionado à equipe', { 
    projetoId: id, 
    novoUserId,
    papel,
    escritorioId,
    userId 
  });

  res.status(201).json({
    message: 'Usuário adicionado à equipe com sucesso',
    membro
  });
}));

// DELETE /api/projetos/:id/team/:userId - Remover usuário da equipe
router.delete('/:id/team/:userId', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id, userId: membroId } = req.params;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se membro existe na equipe
  const membro = await prisma.equipeProjeto.findFirst({
    where: {
      projetoId: id,
      userId: membroId
    }
  });

  if (!membro) {
    throw new NotFoundError('Membro não encontrado na equipe');
  }

  // Não permitir remover o coordenador se for o único
  if (membro.papel === 'COORDENADOR') {
    const totalCoordenadores = await prisma.equipeProjeto.count({
      where: {
        projetoId: id,
        papel: 'COORDENADOR'
      }
    });

    if (totalCoordenadores <= 1) {
      throw new ValidationError('Não é possível remover o único coordenador do projeto');
    }
  }

  await prisma.equipeProjeto.delete({
    where: { id: membro.id }
  });

  // Invalidar cache
  await cache.del(`projeto:${id}:${escritorioId}`);

  logger.info('Usuário removido da equipe', { 
    projetoId: id, 
    membroId,
    escritorioId,
    userId 
  });

  res.json({
    message: 'Usuário removido da equipe com sucesso'
  });
}));

// GET /api/projetos/stats - Estatísticas de projetos
router.get('/stats/overview', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  const cacheKey = `projetos:stats:${escritorioId}:${userId}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const whereClause = {
    escritorioId,
    deletedAt: null,
    OR: [
      { criadoPor: userId },
      { equipe: { some: { userId } } },
      { publico: true }
    ]
  };

  const [total, planejamento, emAndamento, concluidos, atrasados] = await Promise.all([
    prisma.projeto.count({ where: whereClause }),
    prisma.projeto.count({ 
      where: { ...whereClause, status: 'PLANEJAMENTO' } 
    }),
    prisma.projeto.count({ 
      where: { ...whereClause, status: 'EM_ANDAMENTO' } 
    }),
    prisma.projeto.count({ 
      where: { ...whereClause, status: 'CONCLUIDO' } 
    }),
    prisma.projeto.count({ 
      where: { 
        ...whereClause, 
        status: { in: ['PLANEJAMENTO', 'EM_ANDAMENTO'] },
        dataPrevisaoTermino: {
          lt: new Date()
        }
      } 
    })
  ]);

  const stats = {
    total,
    planejamento,
    emAndamento,
    concluidos,
    atrasados,
    distribuicao: {
      planejamento: Math.round((planejamento / total) * 100) || 0,
      emAndamento: Math.round((emAndamento / total) * 100) || 0,
      concluidos: Math.round((concluidos / total) * 100) || 0,
      atrasados: Math.round((atrasados / total) * 100) || 0
    }
  };

  // Cache por 5 minutos
  await cache.setex(cacheKey, 300, JSON.stringify(stats));

  res.json(stats);
}));

export default router; 