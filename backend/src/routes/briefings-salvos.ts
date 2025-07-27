import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorioAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// Interface para dados do briefing completo
interface BriefingCompletoData {
  nomeProjeto: string;
  clienteId: string;
  briefingTemplate: {
    id: string;
    nome: string;
    categoria: string;
    totalPerguntas: number;
  };
  respostas: Record<string, any>;
  metadados: {
    totalRespostas: number;
    progresso: number;
    tempoGasto?: number;
    dataInicio?: string;
    dataFim?: string;
  };
}

// POST /api/briefings-salvos - Salvar briefing completo do frontend
router.post('/', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const {
    nomeProjeto,
    clienteId,
    briefingTemplate,
    respostas,
    metadados
  }: BriefingCompletoData = req.body;

  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  logger.info('💾 Salvando briefing completo:', {
    nomeProjeto,
    clienteId,
    templateId: briefingTemplate.id,
    totalRespostas: metadados.totalRespostas,
    progresso: metadados.progresso,
    userId,
    escritorioId
  });

  // Validações
  if (!nomeProjeto || !clienteId || !briefingTemplate || !respostas) {
    throw new ValidationError('Dados incompletos para salvar briefing');
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

  // Iniciar transação para salvar tudo atomicamente
  const result = await prisma.$transaction(async (tx) => {
    // 1. Criar briefing principal
    const briefing = await tx.briefing.create({
      data: {
        nomeProjeto: nomeProjeto.trim(),
        descricao: `Briefing ${briefingTemplate.nome} - ${cliente.nome}`,
        clienteId,
        responsavelId: userId,
        escritorioId,
        createdBy: userId,
        status: 'CONCLUIDO',
        progresso: metadados.progresso,
        aprovado: false
      }
    });

    // 2. Criar template do briefing
    const template = await tx.briefingTemplate.create({
      data: {
        templateId: briefingTemplate.id,
        nome: briefingTemplate.nome,
        categoria: briefingTemplate.categoria,
        briefingId: briefing.id,
        status: 'CONCLUIDO',
        progresso: metadados.progresso
      }
    });

    // 3. Salvar todas as respostas
    const respostasArray = [];
    for (const [perguntaId, resposta] of Object.entries(respostas)) {
      if (resposta !== null && resposta !== undefined && resposta !== '') {
        // Criar pergunta se não existir
        const pergunta = await tx.briefingPergunta.upsert({
          where: { 
            templateId_ordem: {
              templateId: template.id,
              ordem: parseInt(perguntaId)
            }
          },
          update: {},
          create: {
            titulo: `Pergunta ${perguntaId}`,
            descricao: `Pergunta ID ${perguntaId}`,
            tipo: 'TEXTO',
            obrigatoria: false,
            ordem: parseInt(perguntaId),
            templateId: template.id
          }
        });

        // Salvar resposta
        const respostaSalva = await tx.briefingResposta.create({
          data: {
            resposta: Array.isArray(resposta) ? resposta.join(', ') : resposta.toString(),
            briefingId: briefing.id,
            briefingTemplateId: template.id,
            perguntaId: pergunta.id,
            createdBy: userId
          }
        });

        respostasArray.push(respostaSalva);
      }
    }

    return {
      briefing,
      template,
      respostas: respostasArray,
      totalRespostas: respostasArray.length
    };
  });

  logger.info('✅ Briefing salvo com sucesso:', {
    briefingId: result.briefing.id,
    templateId: result.template.id,
    totalRespostas: result.totalRespostas
  });

  res.status(201).json({
    success: true,
    message: 'Briefing salvo com sucesso!',
    data: {
      briefingId: result.briefing.id,
      templateId: result.template.id,
      totalRespostas: result.totalRespostas,
      progresso: metadados.progresso
    }
  });
}));

// GET /api/briefings-salvos/:id - Obter briefing completo
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
      },
      templates: {
        include: {
          respostas: {
            include: {
              pergunta: true
            }
          }
        }
      }
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  // Transformar respostas para formato do frontend
  const respostasFormatadas: Record<string, any> = {};
  
  briefing.templates.forEach(template => {
    template.respostas.forEach(resposta => {
      const perguntaId = resposta.pergunta.ordem.toString();
      respostasFormatadas[perguntaId] = resposta.resposta;
    });
  });

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
      template: briefing.templates[0],
      respostas: respostasFormatadas,
      totalRespostas: Object.keys(respostasFormatadas).length
    }
  });
}));

export default router; 