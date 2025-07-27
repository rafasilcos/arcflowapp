import { Router, Request, Response } from 'express';
import { prisma } from '../config/database-simple';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorio } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/clientes - Listar clientes do escritório
router.get('/', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search, status } = req.query;
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
      { email: { contains: search as string, mode: 'insensitive' } },
      { cpfCnpj: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.cliente.count({ where })
  ]);

  const result = {
    clientes,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  };
  
  res.json(result);
}));

// GET /api/clientes/:id - Obter cliente específico
router.get('/:id', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  const cliente = await prisma.cliente.findFirst({
    where: { 
      id, 
      escritorioId,
      isActive: true 
    }
  });

  if (!cliente) {
    throw new NotFoundError('Cliente não encontrado');
  }

  res.json({ cliente });
}));

// POST /api/clientes - Criar novo cliente
router.post('/', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const { 
    nome, 
    email, 
    telefone,
    cpfCnpj,
    endereco,
    cidade,
    estado,
    cep,
    observacoes
  } = req.body;

  const escritorioId = (req as any).user.escritorioId;

  if (!nome || !email) {
    throw new ValidationError('Nome e email são obrigatórios');
  }

  // Verificar se email já existe no escritório
  const existingCliente = await prisma.cliente.findFirst({
    where: { 
      email, 
      escritorioId,
      isActive: true 
    }
  });

  if (existingCliente) {
    throw new ValidationError('Cliente com este email já existe');
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome,
      email,
      telefone,
      cpfCnpj,
      endereco,
      cidade,
      estado,
      cep,
      observacoes,
      escritorioId
    }
  });

  logger.info('Cliente criado', { 
    clienteId: cliente.id, 
    nome: cliente.nome,
    userId: (req as any).user.id 
  });

  res.status(201).json({ cliente });
}));

export default router; 