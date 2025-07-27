import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { CacheService } from '../config/redis';
import { logger } from '../config/logger';
import { authMiddleware, requireProjectAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/atividades/project/:projectId - Listar atividades do projeto
router.get('/project/:projectId', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userId = req.user!.id;
  const status = req.query.status as string;
  const assignedTo = req.query.assignedTo as string;
  const tipo = req.query.tipo as string;
  
  // Construir filtros
  const where: any = { projetoId: projectId };
  if (status) where.status = status;
  if (assignedTo) where.userId = assignedTo;
  if (tipo) where.tipo = tipo;

  const atividades = await prisma.atividade.findMany({
    where,
    orderBy: [
      { prioridade: 'desc' },
      { prazo: 'asc' },
      { createdAt: 'desc' }
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      _count: {
        select: {
          cronometros: true
        }
      }
    }
  });

  res.json({ atividades });
}));

// POST /api/atividades - Criar atividade
router.post('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const {
    titulo,
    descricao,
    projetoId,
    userId: assignedUserId,
    tipo,
    prioridade,
    prazo,
    estimativaHoras
  } = req.body;

  if (!titulo || !projetoId) {
    throw new ValidationError('Título e projeto são obrigatórios');
  }

  // Verificar acesso ao projeto
  const projectAccess = await prisma.projetoUser.findFirst({
    where: {
      userId: req.user!.id,
      projetoId
    }
  });

  if (!projectAccess) {
    throw new ValidationError('Sem acesso ao projeto');
  }

  const atividade = await prisma.atividade.create({
    data: {
      titulo: titulo.trim(),
      descricao: descricao?.trim(),
      projetoId,
      userId: assignedUserId || req.user!.id,
      tipo: tipo || 'DESENVOLVIMENTO',
      prioridade: prioridade || 'MEDIA',
      status: 'PENDENTE',
      prazo: prazo ? new Date(prazo) : null,
      estimativaHoras: estimativaHoras || 0
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });

  res.status(201).json({
    message: 'Atividade criada com sucesso',
    atividade
  });
}));

// PUT /api/atividades/:id/status - Atualizar status
router.put('/:id/status', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const atividadeId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['PENDENTE', 'EM_ANDAMENTO', 'REVISAO', 'CONCLUIDA', 'CANCELADA'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError('Status inválido');
  }

  const atividade = await prisma.atividade.update({
    where: { id: atividadeId },
    data: { 
      status,
      ...(status === 'CONCLUIDA' && { dataFinalizacao: new Date() })
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  res.json({
    message: 'Status atualizado com sucesso',
    atividade
  });
}));

export default router; 