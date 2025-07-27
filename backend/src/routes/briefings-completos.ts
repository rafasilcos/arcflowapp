import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware, requireEscritorioAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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

// POST /api/briefings-completos - Salvar briefing completo do frontend
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

// GET /api/briefings-completos/:id - Obter briefing completo
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

// POST /api/briefings-completos/:id/pdf - Gerar PDF do briefing
router.post('/:id/pdf', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  // Buscar briefing completo
  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      cliente: true,
      responsavel: {
        select: {
          name: true,
          email: true
        }
      },
      escritorio: {
        select: {
          nome: true,
          email: true,
          telefone: true
        }
      },
      templates: {
        include: {
          respostas: {
            include: {
              pergunta: true
            },
            orderBy: {
              pergunta: {
                ordem: 'asc'
              }
            }
          }
        }
      }
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  // Criar PDF
  const doc = new PDFDocument({ margin: 50 });
  const filename = `briefing-${briefing.id}-${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../uploads', filename);

  // Garantir que o diretório existe
  const uploadsDir = path.dirname(filepath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Cabeçalho do PDF
  doc.fontSize(20).text('BRIEFING COMPLETO', { align: 'center' });
  doc.moveDown();

  // Informações do escritório
  doc.fontSize(12).text(`Escritório: ${briefing.escritorio.nome}`);
  doc.text(`Email: ${briefing.escritorio.email}`);
  if (briefing.escritorio.telefone) {
    doc.text(`Telefone: ${briefing.escritorio.telefone}`);
  }
  doc.moveDown();

  // Informações do projeto
  doc.fontSize(16).text('INFORMAÇÕES DO PROJETO', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Projeto: ${briefing.nomeProjeto}`);
  doc.text(`Cliente: ${briefing.cliente.nome}`);
  doc.text(`Email: ${briefing.cliente.email}`);
  if (briefing.cliente.telefone) {
    doc.text(`Telefone: ${briefing.cliente.telefone}`);
  }
  doc.text(`Responsável: ${briefing.responsavel.name}`);
  doc.text(`Data: ${briefing.createdAt.toLocaleDateString('pt-BR')}`);
  doc.text(`Progresso: ${briefing.progresso}%`);
  doc.moveDown();

  // Respostas do briefing
  if (briefing.templates.length > 0) {
    const template = briefing.templates[0];
    doc.fontSize(16).text('RESPOSTAS DO BRIEFING', { underline: true });
    doc.moveDown(0.5);
    
    template.respostas.forEach((resposta, index) => {
      // Verificar se precisa de nova página
      if (doc.y > 700) {
        doc.addPage();
      }
      
      doc.fontSize(12).text(`${index + 1}. ${resposta.pergunta.titulo}`, { 
        continued: false,
        width: 500
      });
      doc.fontSize(10).text(`Resposta: ${resposta.resposta}`, { 
        indent: 20,
        width: 480
      });
      doc.moveDown(0.5);
    });
  }

  // Rodapé
  doc.fontSize(8).text(
    `Documento gerado automaticamente pelo ArcFlow em ${new Date().toLocaleString('pt-BR')}`,
    50,
    doc.page.height - 50,
    { align: 'center' }
  );

  doc.end();

  // Aguardar finalização do PDF
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  logger.info('📄 PDF gerado com sucesso:', {
    briefingId: id,
    filename,
    filepath
  });

  res.json({
    success: true,
    message: 'PDF gerado com sucesso!',
    data: {
      filename,
      downloadUrl: `/api/briefings-completos/${id}/download-pdf/${filename}`
    }
  });
}));

// GET /api/briefings-completos/:id/download-pdf/:filename - Download do PDF
router.get('/:id/download-pdf/:filename', authMiddleware, requireEscritorioAccess, asyncHandler(async (req: Request, res: Response) => {
  const { id, filename } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  // Verificar se o briefing pertence ao escritório
  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  const filepath = path.join(__dirname, '../../uploads', filename);
  
  if (!fs.existsSync(filepath)) {
    throw new NotFoundError('Arquivo PDF não encontrado');
  }

  res.download(filepath, `briefing-${briefing.nomeProjeto.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
}));

export default router; 