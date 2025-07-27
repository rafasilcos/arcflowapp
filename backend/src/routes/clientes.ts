import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorioAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { cache } from '../config/redis';

const router = Router();

// GET /api/clientes - Listar clientes do escritório
router.get('/', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search, status, orderBy = 'nome' } = req.query;
  const escritorioId = (req as any).user.escritorioId;

  const skip = (Number(page) - 1) * Number(limit);
  
  // Cache key
  const cacheKey = `clientes:${escritorioId}:${page}:${limit}:${search}:${status}:${orderBy}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Filtros
  const where: any = {
    escritorio_id: escritorioId,
    deletedAt: null
  };

  if (search) {
    where.OR = [
      { nome: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { telefone: { contains: search as string } },
      { cpf: { contains: search as string } },
      { cnpj: { contains: search as string } }
    ];
  }

  if (status) {
    where.status = status;
  }

  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [orderBy as string]: 'asc' },
      include: {
        projetos: {
          select: {
            id: true,
            nome: true,
            status: true
          }
        },
        _count: {
          select: {
            projetos: true
          }
        }
      }
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

  // Cache por 5 minutos
  await cache.setex(cacheKey, 300, JSON.stringify(result));
  
  res.json(result);
}));

// GET /api/clientes/:id - Obter cliente específico
router.get('/:id', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  const cliente = await prisma.cliente.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      projetos: {
        include: {
          _count: {
            select: {
              atividades: true
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

  if (!cliente) {
    throw new NotFoundError('Cliente não encontrado');
  }

  res.json({ cliente });
}));

// POST /api/clientes - Criar novo cliente
router.post('/', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { 
    nome, 
    email, 
    telefone, 
    tipoPessoa, 
    cpf, 
    cnpj, 
    endereco, 
    observacoes,
    status = 'ativo'
  } = req.body;
  
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Validações
  if (!nome || !email || !telefone) {
    throw new ValidationError('Nome, email e telefone são obrigatórios');
  }

  if (tipoPessoa === 'fisica' && !cpf) {
    throw new ValidationError('CPF é obrigatório para pessoa física');
  }

  if (tipoPessoa === 'juridica' && !cnpj) {
    throw new ValidationError('CNPJ é obrigatório para pessoa jurídica');
  }

  // Verificar se email já existe no escritório
  const emailExistente = await prisma.cliente.findFirst({
    where: { 
      email, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (emailExistente) {
    throw new ValidationError('Email já cadastrado neste escritório');
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim(),
      tipoPessoa,
      cpf: tipoPessoa === 'fisica' ? cpf?.trim() : null,
      cnpj: tipoPessoa === 'juridica' ? cnpj?.trim() : null,
      endereco: endereco || {},
      observacoes: observacoes?.trim(),
      status,
      escritorioId,
      createdBy: userId
    }
  });

  // Invalidar cache
  await cache.del(`clientes:${escritorioId}:*`);

  logger.info('Cliente criado', { 
    clienteId: cliente.id, 
    nome: cliente.nome,
    escritorioId,
    userId 
  });

  res.status(201).json({
    message: 'Cliente criado com sucesso',
    cliente
  });
}));

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se cliente existe
  const clienteExistente = await prisma.cliente.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (!clienteExistente) {
    throw new NotFoundError('Cliente não encontrado');
  }

  // Verificar email único (se alterado)
  if (updateData.email && updateData.email !== clienteExistente.email) {
    const emailExistente = await prisma.cliente.findFirst({
      where: { 
        email: updateData.email, 
        escritorioId,
        deletedAt: null,
        NOT: { id }
      }
    });

    if (emailExistente) {
      throw new ValidationError('Email já cadastrado neste escritório');
    }
  }

  const cliente = await prisma.cliente.update({
    where: { id },
    data: {
      ...updateData,
      updatedAt: new Date(),
      updatedBy: userId
    }
  });

  // Invalidar cache
  await cache.del(`clientes:${escritorioId}:*`);

  logger.info('Cliente atualizado', { 
    clienteId: id, 
    escritorioId,
    userId 
  });

  res.json({
    message: 'Cliente atualizado com sucesso',
    cliente
  });
}));

// DELETE /api/clientes/:id - Deletar cliente (soft delete)
router.delete('/:id', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se cliente existe
  const cliente = await prisma.cliente.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      projetos: {
        where: { status: { in: ['PLANEJAMENTO', 'EM_ANDAMENTO'] } }
      }
    }
  });

  if (!cliente) {
    throw new NotFoundError('Cliente não encontrado');
  }

  // Verificar se tem projetos ativos
  if (cliente.projetos.length > 0) {
    throw new ValidationError('Não é possível deletar cliente com projetos ativos');
  }

  // Soft delete
  await prisma.cliente.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedBy: userId
    }
  });

  // Invalidar cache
  await cache.del(`clientes:${escritorioId}:*`);

  logger.info('Cliente deletado', { 
    clienteId: id, 
    escritorioId,
    userId 
  });

  res.json({
    message: 'Cliente deletado com sucesso'
  });
}));

// GET /api/clientes/stats - Estatísticas de clientes
router.get('/stats/overview', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const escritorioId = (req as any).user.escritorioId;

  const cacheKey = `clientes:stats:${escritorioId}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const [total, ativos, vip, inativos, novosEstesMes] = await Promise.all([
    prisma.cliente.count({ 
      where: { escritorioId, deletedAt: null } 
    }),
    prisma.cliente.count({ 
      where: { escritorioId, status: 'ativo', deletedAt: null } 
    }),
    prisma.cliente.count({ 
      where: { escritorioId, status: 'vip', deletedAt: null } 
    }),
    prisma.cliente.count({ 
      where: { escritorioId, status: 'inativo', deletedAt: null } 
    }),
    prisma.cliente.count({ 
      where: { 
        escritorioId, 
        deletedAt: null,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      } 
    })
  ]);

  const stats = {
    total,
    ativos,
    vip,
    inativos,
    novosEstesMes,
    distribuicao: {
      ativo: Math.round((ativos / total) * 100) || 0,
      vip: Math.round((vip / total) * 100) || 0,
      inativo: Math.round((inativos / total) * 100) || 0
    }
  };

  // Cache por 10 minutos
  await cache.setex(cacheKey, 600, JSON.stringify(stats));

  res.json(stats);
}));

export default router; 