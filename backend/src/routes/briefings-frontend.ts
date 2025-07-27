import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorioAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// POST /api/briefings-frontend - Salvar briefing do frontend
router.post('/', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const {
    nomeProjeto,
    clienteId,
    briefingTemplate,
    respostas,
    metadados
  } = req.body;

  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  logger.info('💾 Salvando briefing do frontend:', {
    nomeProjeto,
    clienteId,
    templateId: briefingTemplate?.id,
    totalRespostas: metadados?.totalRespostas,
    progresso: metadados?.progresso,
    userId,
    escritorioId
  });

  // Validações básicas
  if (!nomeProjeto || !clienteId) {
    throw new ValidationError('Nome do projeto e cliente são obrigatórios');
  }

  // Verificar se cliente existe
  const cliente = await prisma.cliente.findFirst({
    where: { 
      id: clienteId, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (!cliente) {
    throw new ValidationError('Cliente não encontrado');
  }

  // Criar briefing
  const briefing = await prisma.briefing.create({
    data: {
      nomeProjeto: nomeProjeto.trim(),
      descricao: `Briefing ${briefingTemplate?.nome || 'Personalizado'} - ${cliente.nome}`,
      clienteId,
      responsavelId: userId,
      escritorioId,
      createdBy: userId,
      status: 'CONCLUIDO',
      progresso: metadados?.progresso || 100,
      aprovado: false
    }
  });

  // Salvar respostas como JSON no campo observacoes (temporário)
  await prisma.briefing.update({
    where: { id: briefing.id },
    data: {
      observacoes: JSON.stringify({
        template: briefingTemplate,
        respostas: respostas,
        metadados: metadados
      })
    }
  });

  logger.info('✅ Briefing salvo com sucesso:', {
    briefingId: briefing.id,
    totalRespostas: metadados?.totalRespostas || 0
  });

  res.status(201).json({
    success: true,
    message: 'Briefing salvo com sucesso!',
    data: {
      briefingId: briefing.id,
      nomeProjeto: briefing.nomeProjeto,
      progresso: briefing.progresso,
      dashboardUrl: `/projetos/${briefing.id}/dashboard`
    }
  });
}));

// GET /api/briefings-frontend/:id - Obter briefing
router.get('/:id', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true
        }
      },
      responsavel: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  // Parse das respostas do JSON
  let dadosCompletos = null;
  if (briefing.observacoes) {
    try {
      dadosCompletos = JSON.parse(briefing.observacoes);
    } catch (error) {
      logger.error('Erro ao fazer parse das respostas:', error);
    }
  }

  res.json({
    success: true,
    data: {
      briefing: {
        id: briefing.id,
        nomeProjeto: briefing.nomeProjeto,
        descricao: briefing.descricao,
        status: briefing.status,
        progresso: briefing.progresso,
        createdAt: briefing.createdAt,
        updatedAt: briefing.updatedAt
      },
      cliente: briefing.cliente,
      responsavel: briefing.responsavel,
      template: dadosCompletos?.template,
      respostas: dadosCompletos?.respostas || {},
      metadados: dadosCompletos?.metadados || {},
      totalRespostas: dadosCompletos?.metadados?.totalRespostas || 0
    }
  });
}));

export default router; 