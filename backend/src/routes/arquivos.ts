import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware, requireProjectAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError } from '../middleware/errorHandler';

const router = Router();

// GET /api/arquivos/project/:projectId - Listar arquivos do projeto
router.get('/project/:projectId', authMiddleware, requireProjectAccess, asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  
  const arquivos = await prisma.arquivo.findMany({
    where: { projetoId: projectId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nome: true,
      tipo: true,
      tamanho: true,
      url: true,
      versao: true,
      createdAt: true
    }
  });

  res.json({ arquivos });
}));

// POST /api/arquivos - Upload de arquivo (simulado)
router.post('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { nome, tipo, tamanho, url, projetoId } = req.body;

  if (!nome || !projetoId) {
    throw new ValidationError('Nome e projeto são obrigatórios');
  }

  const arquivo = await prisma.arquivo.create({
    data: {
      nome: nome.trim(),
      tipo: tipo || 'application/octet-stream',
      tamanho: tamanho || 0,
      url: url || '',
      projetoId,
      versao: 1
    }
  });

  res.status(201).json({
    message: 'Arquivo criado com sucesso',
    arquivo
  });
}));

export default router; 