import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { CacheService } from '../config/redis';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorio } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/dashboard/overview - Visão geral do dashboard
router.get('/overview', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const escritorioId = req.user!.escritorioId!;
  
  const cacheKey = `dashboard:overview:${userId}`;
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const [
    totalProjetos,
    projetosAtivos,
    minhasAtividades,
    tempoTrabalhado
  ] = await Promise.all([
    prisma.projeto.count({
      where: { escritorioId }
    }),
    
    prisma.projeto.count({
      where: {
        escritorioId,
        status: 'EM_ANDAMENTO'
      }
    }),
    
    prisma.atividade.count({
      where: {
        userId,
        status: { not: 'CONCLUIDA' }
      }
    }),
    
    prisma.cronometro.aggregate({
      where: {
        atividade: { userId },
        fim: { not: null },
        inicio: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      _sum: { duracao: true }
    })
  ]);

  const overview = {
    totalProjetos,
    projetosAtivos,
    minhasAtividades,
    tempoSemana: tempoTrabalhado._sum.duracao || 0
  };

  await CacheService.set(cacheKey, overview, 300); // 5 minutos
  res.json(overview);
}));

// GET /api/dashboard/projects - Projetos do usuário
router.get('/projects', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const limit = parseInt(req.query.limit as string) || 10;

  const projetos = await prisma.projeto.findMany({
    where: {
      projetoUsers: {
        some: { userId }
      }
    },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      cliente: {
        select: {
          id: true,
          nome: true
        }
      },
      _count: {
        select: {
          atividades: true
        }
      }
    }
  });

  res.json({ projetos });
}));

export default router; 