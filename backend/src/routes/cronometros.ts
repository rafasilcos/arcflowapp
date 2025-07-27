import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { CacheService, RealtimeService } from '../config/redis';
import { logger } from '../config/logger';
import { authMiddleware, requireProjectAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// Interface para dados do cronômetro
interface TimerData {
  projectId: string;
  atividadeId?: string;
  observacoes?: string;
}

// GET /api/cronometros/project/:projectId - Listar cronômetros do projeto
router.get('/project/:projectId', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const isActive = req.query.isActive === 'true';

  const skip = (page - 1) * limit;

  // Construir filtros
  const where: any = { projetoId: projectId };
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  // Buscar cronômetros
  const [cronometros, total] = await Promise.all([
    prisma.cronometro.findMany({
      where,
      skip,
      take: limit,
      orderBy: { inicio: 'desc' },
      include: {
        atividade: {
          select: {
            id: true,
            titulo: true,
            tipo: true
          }
        }
      }
    }),
    prisma.cronometro.count({ where })
  ]);

  // Calcular estatísticas
  const stats = await prisma.cronometro.aggregate({
    where: {
      projetoId: projectId,
      fim: { not: null }
    },
    _sum: { duracao: true },
    _avg: { duracao: true },
    _count: true
  });

  logger.info('Cronômetros listados', {
    userId,
    projectId,
    total,
    page
  });

  res.json({
    cronometros,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    stats: {
      totalTime: stats._sum.duracao || 0,
      averageTime: Math.round(stats._avg.duracao || 0),
      totalSessions: stats._count
    }
  });
}));

// GET /api/cronometros/active - Buscar cronômetros ativos do usuário
router.get('/active', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Buscar cronômetros ativos do usuário
  const activeCronometros = await prisma.cronometro.findMany({
    where: {
      isActive: true,
      projeto: {
        projetoUsers: {
          some: { userId }
        }
      }
    },
    include: {
      projeto: {
        select: {
          id: true,
          nome: true,
          status: true
        }
      },
      atividade: {
        select: {
          id: true,
          titulo: true,
          tipo: true
        }
      }
    },
    orderBy: { inicio: 'desc' }
  });

  // Calcular tempo decorrido para cada cronômetro ativo
  const cronometrosWithElapsed = activeCronometros.map(cronometro => ({
    ...cronometro,
    elapsedTime: Math.floor((Date.now() - cronometro.inicio.getTime()) / 1000)
  }));

  res.json({
    activeCronometros: cronometrosWithElapsed,
    total: activeCronometros.length
  });
}));

// POST /api/cronometros/start - Iniciar cronômetro
router.post('/start', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { projectId, atividadeId, observacoes }: TimerData = req.body;
  const userId = req.user!.id;

  if (!projectId) {
    throw new ValidationError('ID do projeto é obrigatório');
  }

  // Verificar acesso ao projeto
  const projectAccess = await prisma.projetoUser.findFirst({
    where: {
      userId,
      projetoId: projectId
    },
    include: {
      projeto: {
        select: {
          id: true,
          nome: true,
          isActive: true
        }
      }
    }
  });

  if (!projectAccess || !projectAccess.projeto.isActive) {
    throw new ValidationError('Acesso negado ao projeto ou projeto inativo');
  }

  // Verificar se existe cronômetro ativo para este usuário neste projeto
  const existingActive = await prisma.cronometro.findFirst({
    where: {
      projetoId: projectId,
      isActive: true,
      atividade: atividadeId ? {
        userId
      } : undefined
    }
  });

  if (existingActive) {
    throw new ValidationError('Já existe um cronômetro ativo para este projeto');
  }

  // Verificar atividade se fornecida
  if (atividadeId) {
    const atividade = await prisma.atividade.findFirst({
      where: {
        id: atividadeId,
        projetoId: projectId,
        userId
      }
    });

    if (!atividade) {
      throw new ValidationError('Atividade não encontrada ou sem acesso');
    }
  }

  // Criar cronômetro
  const cronometro = await prisma.cronometro.create({
    data: {
      projetoId: projectId,
      atividadeId,
      inicio: new Date(),
      observacoes: observacoes?.trim(),
      isActive: true
    },
    include: {
      projeto: {
        select: {
          id: true,
          nome: true
        }
      },
      atividade: {
        select: {
          id: true,
          titulo: true,
          tipo: true
        }
      }
    }
  });

  // Publicar evento real-time
  await RealtimeService.publishTimerUpdate(projectId, {
    action: 'start',
    cronometroId: cronometro.id,
    projectId,
    atividadeId,
    userId,
    startTime: cronometro.inicio.toISOString(),
    projectName: cronometro.projeto.nome,
    atividadeTitulo: cronometro.atividade?.titulo
  });

  // Invalidar cache do projeto
  await CacheService.del(`project:${projectId}:details`);

  logger.info('Cronômetro iniciado', {
    userId,
    cronometroId: cronometro.id,
    projectId,
    atividadeId
  });

  res.status(201).json({
    message: 'Cronômetro iniciado com sucesso',
    cronometro: {
      ...cronometro,
      elapsedTime: 0
    }
  });
}));

// POST /api/cronometros/:id/stop - Parar cronômetro
router.post('/:id/stop', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const cronometroId = req.params.id;
  const userId = req.user!.id;
  const { observacoes } = req.body;

  // Buscar cronômetro
  const cronometro = await prisma.cronometro.findUnique({
    where: { id: cronometroId },
    include: {
      projeto: {
        include: {
          projetoUsers: {
            where: { userId }
          }
        }
      },
      atividade: {
        select: {
          id: true,
          titulo: true,
          userId: true
        }
      }
    }
  });

  if (!cronometro) {
    throw new NotFoundError('Cronômetro não encontrado');
  }

  // Verificar acesso
  if (cronometro.projeto.projetoUsers.length === 0) {
    throw new ValidationError('Sem acesso a este cronômetro');
  }

  if (!cronometro.isActive) {
    throw new ValidationError('Cronômetro já foi parado');
  }

  // Calcular duração
  const fim = new Date();
  const duracao = Math.floor((fim.getTime() - cronometro.inicio.getTime()) / 1000);

  // Atualizar cronômetro
  const updatedCronometro = await prisma.$transaction(async (tx) => {
    // Parar cronômetro
    const stopped = await tx.cronometro.update({
      where: { id: cronometroId },
      data: {
        fim,
        duracao,
        observacoes: observacoes?.trim() || cronometro.observacoes,
        isActive: false
      },
      include: {
        projeto: {
          select: {
            id: true,
            nome: true
          }
        },
        atividade: {
          select: {
            id: true,
            titulo: true,
            tipo: true
          }
        }
      }
    });

    // Atualizar tempo gasto na atividade se existir
    if (cronometro.atividadeId) {
      await tx.atividade.update({
        where: { id: cronometro.atividadeId },
        data: {
          tempoGasto: {
            increment: duracao / 60 // converter para minutos
          }
        }
      });
    }

    return stopped;
  });

  // Publicar evento real-time
  await RealtimeService.publishTimerUpdate(cronometro.projetoId, {
    action: 'stop',
    cronometroId,
    projectId: cronometro.projetoId,
    atividadeId: cronometro.atividadeId,
    userId,
    endTime: fim.toISOString(),
    duration: duracao,
    projectName: cronometro.projeto.nome,
    atividadeTitulo: cronometro.atividade?.titulo
  });

  // Invalidar caches
  await Promise.all([
    CacheService.del(`project:${cronometro.projetoId}:details`),
    CacheService.invalidatePattern(`dashboard:*`)
  ]);

  logger.info('Cronômetro parado', {
    userId,
    cronometroId,
    projectId: cronometro.projetoId,
    duracao: `${Math.floor(duracao / 60)}m ${duracao % 60}s`
  });

  res.json({
    message: 'Cronômetro parado com sucesso',
    cronometro: {
      ...updatedCronometro,
      duration: duracao
    }
  });
}));

// GET /api/cronometros/:id - Buscar cronômetro específico
router.get('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const cronometroId = req.params.id;
  const userId = req.user!.id;

  const cronometro = await prisma.cronometro.findUnique({
    where: { id: cronometroId },
    include: {
      projeto: {
        select: {
          id: true,
          nome: true,
          projetoUsers: {
            where: { userId },
            select: { role: true }
          }
        }
      },
      atividade: {
        select: {
          id: true,
          titulo: true,
          tipo: true,
          status: true
        }
      }
    }
  });

  if (!cronometro) {
    throw new NotFoundError('Cronômetro não encontrado');
  }

  // Verificar acesso
  if (cronometro.projeto.projetoUsers.length === 0) {
    throw new ValidationError('Sem acesso a este cronômetro');
  }

  // Calcular tempo decorrido se ativo
  let elapsedTime = 0;
  if (cronometro.isActive) {
    elapsedTime = Math.floor((Date.now() - cronometro.inicio.getTime()) / 1000);
  }

  res.json({
    ...cronometro,
    elapsedTime,
    duration: cronometro.duracao
  });
}));

// PUT /api/cronometros/:id - Atualizar observações do cronômetro
router.put('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const cronometroId = req.params.id;
  const userId = req.user!.id;
  const { observacoes } = req.body;

  // Buscar e verificar acesso
  const cronometro = await prisma.cronometro.findUnique({
    where: { id: cronometroId },
    include: {
      projeto: {
        select: {
          projetoUsers: {
            where: { userId },
            select: { role: true }
          }
        }
      }
    }
  });

  if (!cronometro) {
    throw new NotFoundError('Cronômetro não encontrado');
  }

  if (cronometro.projeto.projetoUsers.length === 0) {
    throw new ValidationError('Sem acesso a este cronômetro');
  }

  // Atualizar observações
  const updatedCronometro = await prisma.cronometro.update({
    where: { id: cronometroId },
    data: {
      observacoes: observacoes?.trim()
    },
    include: {
      projeto: {
        select: {
          id: true,
          nome: true
        }
      },
      atividade: {
        select: {
          id: true,
          titulo: true
        }
      }
    }
  });

  logger.info('Cronômetro atualizado', {
    userId,
    cronometroId,
    projectId: cronometro.projetoId
  });

  res.json({
    message: 'Cronômetro atualizado com sucesso',
    cronometro: updatedCronometro
  });
}));

// GET /api/cronometros/analytics/project/:projectId - Analytics do projeto
router.get('/analytics/project/:projectId', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userId = req.user!.id;
  const days = parseInt(req.query.days as string) || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Buscar dados de analytics
  const [
    totalStats,
    dailyStats,
    userStats,
    activityStats
  ] = await Promise.all([
    // Estatísticas totais
    prisma.cronometro.aggregate({
      where: {
        projetoId: projectId,
        fim: { not: null },
        inicio: { gte: startDate }
      },
      _sum: { duracao: true },
      _avg: { duracao: true },
      _count: true
    }),

    // Estatísticas diárias
    prisma.$queryRaw`
      SELECT 
        DATE(inicio) as date,
        COUNT(*) as sessions,
        SUM(duracao) as total_time,
        AVG(duracao) as avg_time
      FROM cronometros 
      WHERE projeto_id = ${projectId}
        AND fim IS NOT NULL
        AND inicio >= ${startDate}
      GROUP BY DATE(inicio)
      ORDER BY date DESC
    `,

    // Estatísticas por usuário
    prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        COUNT(c.*) as sessions,
        SUM(c.duracao) as total_time,
        AVG(c.duracao) as avg_time
      FROM cronometros c
      JOIN atividades a ON c.atividade_id = a.id
      JOIN users u ON a.user_id = u.id
      WHERE c.projeto_id = ${projectId}
        AND c.fim IS NOT NULL
        AND c.inicio >= ${startDate}
      GROUP BY u.id, u.name
      ORDER BY total_time DESC
    `,

    // Estatísticas por tipo de atividade
    prisma.$queryRaw`
      SELECT 
        a.tipo,
        COUNT(c.*) as sessions,
        SUM(c.duracao) as total_time,
        AVG(c.duracao) as avg_time
      FROM cronometros c
      JOIN atividades a ON c.atividade_id = a.id
      WHERE c.projeto_id = ${projectId}
        AND c.fim IS NOT NULL
        AND c.inicio >= ${startDate}
      GROUP BY a.tipo
      ORDER BY total_time DESC
    `
  ]);

  logger.info('Analytics de cronômetro consultado', {
    userId,
    projectId,
    days
  });

  res.json({
    period: {
      days,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString()
    },
    totalStats: {
      totalTime: totalStats._sum.duracao || 0,
      averageTime: Math.round(totalStats._avg.duracao || 0),
      totalSessions: totalStats._count,
      averageSessionsPerDay: Math.round(totalStats._count / days)
    },
    dailyStats,
    userStats,
    activityStats
  });
}));

// DELETE /api/cronometros/:id - Deletar cronômetro
router.delete('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const cronometroId = req.params.id;
  const userId = req.user!.id;

  // Verificar se usuário tem permissão (apenas OWNER, ADMIN ou MANAGER)
  const userRole = req.user!.role;
  if (!['ADMIN', 'OWNER', 'MANAGER'].includes(userRole)) {
    throw new ValidationError('Sem permissão para deletar cronômetros');
  }

  // Buscar e verificar acesso
  const cronometro = await prisma.cronometro.findUnique({
    where: { id: cronometroId },
    include: {
      projeto: {
        select: {
          id: true,
          escritorioId: true
        }
      }
    }
  });

  if (!cronometro) {
    throw new NotFoundError('Cronômetro não encontrado');
  }

  // Verificar se pertence ao mesmo escritório
  if (cronometro.projeto.escritorioId !== req.user!.escritorioId) {
    throw new ValidationError('Sem acesso a este cronômetro');
  }

  // Deletar cronômetro
  await prisma.cronometro.delete({
    where: { id: cronometroId }
  });

  // Invalidar caches
  await Promise.all([
    CacheService.del(`project:${cronometro.projetoId}:details`),
    CacheService.invalidatePattern(`dashboard:*`)
  ]);

  logger.info('Cronômetro deletado', {
    userId,
    cronometroId,
    projectId: cronometro.projetoId
  });

  res.json({
    message: 'Cronômetro deletado com sucesso'
  });
}));

export default router; 