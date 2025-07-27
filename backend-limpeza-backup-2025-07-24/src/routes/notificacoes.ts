import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/notificacoes - Listar notificações do usuário
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [notificacoes, total] = await Promise.all([
    prisma.notificacao.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notificacao.count({ where: { userId } })
  ]);

  res.json({
    notificacoes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// PUT /api/notificacoes/:id/read - Marcar como lida
router.put('/:id/read', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const notificacaoId = req.params.id;
  const userId = req.user!.id;

  await prisma.notificacao.updateMany({
    where: {
      id: notificacaoId,
      userId
    },
    data: {
      lida: true,
      lidaEm: new Date()
    }
  });

  res.json({ message: 'Notificação marcada como lida' });
}));

export default router; 