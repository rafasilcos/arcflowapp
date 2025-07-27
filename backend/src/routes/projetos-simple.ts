import { Router, Request, Response } from 'express';
import { prisma } from '../config/database-simple';
import { logger } from '../config/logger';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/projetos - Listar projetos do escritório
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search, status, tipologia } = req.query;
  const escritorioId = (req as any).user.escritorioId;

  const skip = (Number(page) - 1) * Number(limit);
  
  // Filtros básicos
  const where: any = {
    escritorioId,
    isActive: true
  };

  if (search) {
    where.OR = [
      { nome: { contains: search as string, mode: 'insensitive' } },
      { descricao: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  if (status) {
    where.status = status;
  }

  if (tipologia) {
    where.tipologia = tipologia;
  }

  const [projetos, total] = await Promise.all([
    prisma.projeto.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true
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
  
  res.json(result);
}));

// GET /api/projetos/:id - Obter projeto específico
router.get('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  const projeto = await prisma.projeto.findFirst({
    where: { 
      id, 
      escritorioId,
      isActive: true 
    },
    include: {
      cliente: true
    }
  });

  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  res.json({ projeto });
}));

// POST /api/projetos - Criar novo projeto
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { 
    nome, 
    descricao, 
    clienteId, 
    tipologia,
    status = 'BRIEFING',
    prioridade = 'MEDIA'
  } = req.body;

  const escritorioId = (req as any).user.escritorioId;

  if (!nome || !clienteId || !tipologia) {
    throw new ValidationError('Nome, cliente e tipologia são obrigatórios');
  }

  // Verificar se cliente existe e pertence ao escritório
  const cliente = await prisma.cliente.findFirst({
    where: { 
      id: clienteId, 
      escritorioId,
      isActive: true 
    }
  });

  if (!cliente) {
    throw new NotFoundError('Cliente não encontrado');
  }

  const projeto = await prisma.projeto.create({
    data: {
      nome,
      descricao,
      clienteId,
      tipologia,
      status,
      prioridade,
      escritorioId
    },
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    }
  });

  logger.info('Projeto criado', { 
    projetoId: projeto.id, 
    nome: projeto.nome,
    userId: (req as any).user.id 
  });

  res.status(201).json({ projeto });
}));

export default router; 