// @ts-nocheck
import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// Interface para dados do briefing
interface BriefingData {
  nomeProjeto: string;
  descricao?: string;
  descricaoDetalhada?: string;
  objetivos?: string;
  prazo?: string;
  prazoEstimado?: string;
  orcamento?: string;
  orcamentoPrevisto?: number;
  clienteId: string;
  clienteNome?: string;
  responsavelId: string;
  responsavelNome?: string;
  disciplina?: string;
  area?: string | number;
  tipologia?: string;
  status?: string;
  observacoes?: string;
  briefingIds?: string[];
  respostas?: Record<string, Record<string, string>>;
  dados?: Record<string, any>;
}

// GET /api/briefings - Listar briefings do escritório
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, clienteId } = req.query;
  const escritorioId = (req as any).user.escritorioId;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {
    escritorioId,
    deletedAt: null
  };

  if (status) {
    where.status = status;
  }

  if (clienteId) {
    where.clienteId = clienteId;
  }

  const [briefings, total] = await Promise.all([
    prisma.briefing.findMany({
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
        },
        responsavel: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        respostas: {
          select: {
            id: true,
            perguntaId: true,
            resposta: true,
            briefingTemplateId: true
          }
        },
        _count: {
          select: {
            respostas: true
          }
        }
      }
    }),
    prisma.briefing.count({ where })
  ]);

  res.json({
    briefings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

// 🔥 ROTAS ESPECÍFICAS PRIMEIRO (antes da rota genérica /:id)

// REMOVIDO: Rota duplicada foi movida para o topo do arquivo

// GET /api/briefings/:id/completo - Obter briefing completo com templates
router.get('/:id/completo', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [COMPLETO] Buscando briefing completo:', id);

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
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      templates: {
        include: {
          perguntas: true
        }
      },
      respostas: {
        include: {
          pergunta: true
        }
      }
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  console.log('✅ [COMPLETO] Briefing encontrado:', briefing.nomeProjeto);

  res.json({ briefing });
}));

// GET /api/briefings/:id/historico - Buscar histórico de alterações
router.get('/:id/historico', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [HISTORICO] Buscando histórico do briefing:', id);

  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      respostas: {
        include: {
          pergunta: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  // Agrupar respostas por data de modificação
  const historico = briefing.respostas.reduce((acc, resposta) => {
    const data = resposta.updatedAt.toISOString().split('T')[0];
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push({
      perguntaId: resposta.perguntaId,
      pergunta: resposta.pergunta?.pergunta,
      resposta: resposta.resposta,
      updatedAt: resposta.updatedAt
    });
    return acc;
  }, {} as Record<string, any[]>);

  res.json({
    briefingId: briefing.id,
    historico
  });
}));

// GET /api/briefings/:id - Obter briefing específico
router.get('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [BACKEND] Buscando briefing ID:', id);
  console.log('🏢 [BACKEND] Escritório ID:', escritorioId);

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
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      respostas: {
        include: {
          pergunta: true
        }
      },
      templates: {
        include: {
          perguntas: true
        }
      }
    }
  });

  if (!briefing) {
    console.log('❌ [BACKEND] Briefing não encontrado para ID:', id);
    throw new NotFoundError('Briefing não encontrado');
  }

  console.log('✅ [BACKEND] Briefing encontrado:');
  console.log('  📋 Nome:', briefing.nomeProjeto);
  console.log('  👤 Cliente ID:', briefing.clienteId);
  console.log('  👨‍💼 Responsável ID:', briefing.responsavelId);
  
  if (briefing.cliente) {
    console.log('  ✅ [BACKEND] Cliente encontrado:', briefing.cliente.nome);
  } else {
    console.log('  ❌ [BACKEND] Cliente NOT FOUND para ID:', briefing.clienteId);
  }
  
  if (briefing.responsavel) {
    console.log('  ✅ [BACKEND] Responsável encontrado:', briefing.responsavel.name);
  } else {
    console.log('  ❌ [BACKEND] Responsável NOT FOUND para ID:', briefing.responsavelId);
  }

  // 🔥 ADICIONAR RESPOSTAS DO METADATA SE EXISTIREM
  let respostasFormatadas = briefing.respostas || [];
  
  // Se há respostas no metadata, convertê-las para o formato esperado
  if (briefing.metadata && briefing.metadata.respostas) {
    console.log('🔥 [BACKEND] Encontradas respostas no metadata:', Object.keys(briefing.metadata.respostas).length, 'templates');
    
    // Converter respostas do metadata para formato da tabela
    for (const [templateId, perguntasRespostas] of Object.entries(briefing.metadata.respostas)) {
      for (const [perguntaId, resposta] of Object.entries(perguntasRespostas as Record<string, string>)) {
        respostasFormatadas.push({
          id: `metadata_${templateId}_${perguntaId}`,
          perguntaId: perguntaId,
          resposta: resposta,
          briefingTemplateId: templateId,
          createdAt: briefing.createdAt,
          updatedAt: briefing.updatedAt
        });
      }
    }
    
    console.log('🔥 [BACKEND] Total de respostas formatadas:', respostasFormatadas.length);
  }

  // Retornar briefing com respostas do metadata incluídas
  const briefingComRespostas = {
    ...briefing,
    respostas: respostasFormatadas
  };

  res.json({ briefing: briefingComRespostas });
}));

// POST /api/briefings - Criar novo briefing
router.post('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { 
    nomeProjeto, 
    descricao, 
    descricaoDetalhada,
    objetivos,
    prazo,
    prazoEstimado,
    orcamento,
    orcamentoPrevisto,
    clienteId, 
    clienteNome,
    responsavelId,
    responsavelNome,
    disciplina,
    area,
    tipologia,
    status = 'rascunho',
    observacoes,
    briefingIds = [],
    respostas = {},
    dados = {}
  }: BriefingData = req.body;
  
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Validações
  if (!nomeProjeto || !clienteId || !responsavelId) {
    throw new ValidationError('Nome do projeto, cliente e responsável são obrigatórios');
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

  // Verificar se responsável existe e pertence ao escritório
  const responsavel = await prisma.user.findFirst({
    where: { 
      id: responsavelId, 
      escritorioId,
      isActive: true 
    }
  });

  if (!responsavel) {
    throw new ValidationError('Responsável não encontrado ou não pertence ao escritório');
  }

  // Criar briefing principal
  const briefing = await prisma.briefing.create({
    data: {
      nomeProjeto: nomeProjeto.trim(),
      descricao: descricaoDetalhada?.trim() || descricao?.trim(),
      objetivos: objetivos?.trim(),
      prazo: prazoEstimado || prazo?.trim(),
      orcamento: orcamentoPrevisto?.toString() || orcamento?.trim(),
      clienteId,
      responsavelId,
      escritorioId,
      createdBy: userId,
      status: status?.toUpperCase() || 'RASCUNHO',
      progresso: 0,
      observacoes: observacoes?.trim(),
      // 🎯 NOVOS CAMPOS PARA SELEÇÃO CORRETA DE TEMPLATES
      disciplina: disciplina?.trim(),
      area: typeof area === 'number' ? area.toString() : area?.toString()?.trim(),
      tipologia: tipologia?.trim(),
      // 🎯 SALVAR DADOS ADICIONAIS NO METADATA
      metadata: dados && Object.keys(dados).length > 0 ? dados : null
    }
  });

  // Criar templates de briefing baseados nos IDs selecionados
  for (const briefingTemplateId of briefingIds) {
    await prisma.briefingTemplate.create({
      data: {
        briefingId: briefing.id,
        templateId: briefingTemplateId,
        nome: `Template ${briefingTemplateId}`,
        categoria: briefingTemplateId.split('-')[0] || 'geral',
        status: 'PENDENTE',
        progresso: 0
      }
    });
  }

  // 🔥 SALVAR RESPOSTAS NO FORMATO CORRETO (metadata JSONB)
  if (respostas && Object.keys(respostas).length > 0) {
    // Buscar metadata existente
    const metadataExistente = briefing.metadata || {};
    
    // Atualizar metadata com novas respostas
    const novaMetadata = {
      ...metadataExistente,
      respostas: respostas, // Salva no formato correto para edição
      updatedAt: new Date().toISOString()
    };
    
    // Atualizar metadata no banco
    await prisma.briefing.update({
      where: { id: briefing.id },
      data: {
        metadata: novaMetadata,
        updatedAt: new Date()
      }
    });
    
    console.log('🔥 [BRIEFING-CREATE] Salvando respostas no metadata:', {
      briefingId: briefing.id,
      totalRespostas: Object.keys(respostas).length,
      formatoCorreto: true
    });
  }

  logger.info('Briefing criado', { 
    briefingId: briefing.id, 
    nomeProjeto: briefing.nomeProjeto,
    clienteId,
    escritorioId,
    userId 
  });

  res.status(201).json({
    message: 'Briefing criado com sucesso',
    briefing: {
      ...briefing,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email
      },
      responsavel: {
        id: responsavel.id,
        name: responsavel.name,
        email: responsavel.email
      }
    }
  });
}));

// PUT /api/briefings/:id - Atualizar briefing
router.put('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    nomeProjeto, 
    descricao, 
    objetivos,
    prazo,
    orcamento,
    status,
    respostas = {}
  } = req.body;
  
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se briefing existe
  const briefingExistente = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    }
  });

  if (!briefingExistente) {
    throw new NotFoundError('Briefing não encontrado');
  }

  // Atualizar dados principais
  const dadosAtualizacao: any = {
    updatedAt: new Date()
  };

  if (nomeProjeto) dadosAtualizacao.nomeProjeto = nomeProjeto.trim();
  if (descricao !== undefined) dadosAtualizacao.descricao = descricao?.trim();
  if (objetivos !== undefined) dadosAtualizacao.objetivos = objetivos?.trim();
  if (prazo !== undefined) dadosAtualizacao.prazo = prazo?.trim();
  if (orcamento !== undefined) dadosAtualizacao.orcamento = orcamento?.trim();
  if (status) dadosAtualizacao.status = status;

  const briefing = await prisma.briefing.update({
    where: { id },
    data: dadosAtualizacao,
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          email: true
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

  // Atualizar respostas se fornecidas
  for (const [templateId, perguntasRespostas] of Object.entries(respostas)) {
    for (const [perguntaId, resposta] of Object.entries(perguntasRespostas)) {
      // Verificar se resposta já existe
      const respostaExistente = await prisma.briefingResposta.findFirst({
        where: {
          briefingId: id,
          briefingTemplateId: templateId,
          perguntaId
        }
      });

      if (respostaExistente) {
        // Atualizar resposta existente
        await prisma.briefingResposta.update({
          where: { id: respostaExistente.id },
          data: {
            resposta: resposta.toString().trim(),
            updatedAt: new Date()
          }
        });
      } else if (resposta && resposta.toString().trim()) {
        // Criar nova resposta
        await prisma.briefingResposta.create({
          data: {
            briefingId: id,
            briefingTemplateId: templateId,
            perguntaId,
            resposta: resposta.toString().trim(),
            createdBy: userId
          }
        });
      }
    }
  }

  // Calcular progresso
  const totalRespostas = await prisma.briefingResposta.count({
    where: { briefingId: id }
  });
  
  const templates = await prisma.briefingTemplate.count({
    where: { briefingId: id }
  });

  const progresso = templates > 0 ? Math.round((totalRespostas / (templates * 10)) * 100) : 0; // Assumindo 10 perguntas por template em média

  await prisma.briefing.update({
    where: { id },
    data: { progresso: Math.min(progresso, 100) }
  });

  logger.info('Briefing atualizado', { 
    briefingId: id, 
    escritorioId,
    userId,
    progresso 
  });

  res.json({
    message: 'Briefing atualizado com sucesso',
    briefing
  });
}));

// DELETE /api/briefings/:id - Excluir briefing (soft delete)
router.delete('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

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

  await prisma.briefing.update({
    where: { id },
    data: { 
      deletedAt: new Date(),
      status: 'EXCLUIDO'
    }
  });

  logger.info('Briefing excluído', { 
    briefingId: id, 
    escritorioId,
    userId: (req as any).user.id 
  });

  res.json({ message: 'Briefing excluído com sucesso' });
}));

// POST /api/briefings/:id/respostas - Salvar respostas em lote
router.post('/:id/respostas', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { respostas } = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  // Verificar se briefing existe
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

  // 🔥 SALVAR RESPOSTAS NO FORMATO CORRETO (metadata JSONB)
  if (respostas && Object.keys(respostas).length > 0) {
    // Buscar metadata existente
    const metadataExistente = briefing.metadata || {};
    
    // Atualizar metadata com novas respostas
    const novaMetadata = {
      ...metadataExistente,
      respostas: respostas, // Salva no formato correto para edição
      updatedAt: new Date().toISOString()
    };
    
    // Atualizar metadata no banco
    await prisma.briefing.update({
      where: { id },
      data: {
        metadata: novaMetadata,
        updatedAt: new Date()
      }
    });
    
    console.log('🔥 [EDIT] Salvando respostas no metadata:', {
      briefingId: id,
      totalRespostas: Object.keys(respostas).length,
      formatoCorreto: true
    });
  }
  
  // Salvar respostas na tabela tradicional (para compatibilidade)
  for (const [templateId, perguntasRespostas] of Object.entries(respostas)) {
    for (const [perguntaId, resposta] of Object.entries(perguntasRespostas as Record<string, string>)) {
      if (resposta && resposta.trim()) {
        await prisma.briefingResposta.upsert({
          where: {
            briefingId_briefingTemplateId_perguntaId: {
              briefingId: id,
              briefingTemplateId: templateId,
              perguntaId
            }
          },
          update: {
            resposta: resposta.trim(),
            updatedAt: new Date()
          },
          create: {
            briefingId: id,
            briefingTemplateId: templateId,
            perguntaId,
            resposta: resposta.trim(),
            createdBy: userId
          }
        });
      }
    }
  }

  res.json({ message: 'Respostas salvas com sucesso' });
}));

// POST /api/briefings/salvar-completo - Salvar briefing completo do frontend
router.post('/salvar-completo', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const {
    nomeProjeto,
    clienteId,
    briefingTemplate,
    respostas,
    metadados
  } = req.body;

  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  logger.info('💾 Salvando briefing completo do frontend:', {
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

  // 🔥 SALVAR RESPOSTAS NO FORMATO CORRETO (metadata JSONB)
  await prisma.briefing.update({
    where: { id: briefing.id },
    data: {
      metadata: {
        template: briefingTemplate,
        respostas: respostas, // Salva no formato correto para edição
        metadados: metadados,
        savedAt: new Date().toISOString()
      },
      // Manter observacoes para compatibilidade (temporário)
      observacoes: JSON.stringify({
        template: briefingTemplate,
        respostas: respostas,
        metadados: metadados,
        savedAt: new Date().toISOString()
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

// ===== NOVOS ENDPOINTS PARA BRIEFING PERSONALIZÁVEL =====

// Buscar briefing completo com estrutura
router.get('/:id/completo', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;
  
  console.log('🔍 Buscando briefing completo:', id);
  
  // Buscar briefing com dados relacionados
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
          id: true,
          name: true,
          email: true
        }
      },
      escritorio: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });
  
  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }
  
  // Se não tem estrutura_briefing, migrar do formato antigo
  if (!briefing.estruturaBriefing) {
    console.log('📦 Migrando briefing antigo para nova estrutura');
    const estruturaMigrada = await migrarBriefingAntigo(briefing);
    
    // Salvar estrutura migrada
    const briefingAtualizado = await prisma.briefing.update({
      where: { id },
      data: { estruturaBriefing: estruturaMigrada }
    });
    
    briefing.estruturaBriefing = estruturaMigrada;
  }
  
  // Formatar resposta
  const briefingCompleto = {
    ...briefing,
    cliente_nome: briefing.cliente?.nome || 'Cliente não encontrado',
    cliente_email: briefing.cliente?.email || 'Email não encontrado',
    cliente_telefone: briefing.cliente?.telefone || 'Telefone não informado',
    responsavel_nome: briefing.responsavel?.name || 'Responsável não encontrado',
    responsavel_email: briefing.responsavel?.email || 'Email não encontrado'
  };
  
  console.log('✅ Briefing completo encontrado');
  res.json({ success: true, briefing: briefingCompleto });
}));

// Salvar briefing completo com estrutura
router.post('/:id/salvar-completo', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estrutura_briefing } = req.body;
    
    console.log('💾 Salvando briefing completo:', id);
    
    // Validar estrutura
    if (!estrutura_briefing || !estrutura_briefing.secoes) {
      return res.status(400).json({ 
        error: 'Estrutura do briefing inválida' 
      });
    }
    
    // Calcular metadados
    const metadados = calcularMetadados(estrutura_briefing);
    estrutura_briefing.metadados = metadados;
    estrutura_briefing.data_ultima_modificacao = new Date().toISOString();
    
    // Salvar no banco
    const briefingAtualizado = await prisma.briefing.update({
      where: { id },
      data: {
        estruturaBriefing: estrutura_briefing,
        progresso: metadados.progresso,
        status: metadados.progresso === 100 ? 'CONCLUIDO' : 'EM_ANDAMENTO'
      }
    });
    
    console.log('✅ Briefing salvo com sucesso');
    res.json({ 
      success: true, 
      briefing: briefingAtualizado,
      metadados 
    });
    
  } catch (error) {
    console.error('❌ Erro ao salvar briefing completo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// Função auxiliar para calcular metadados
function calcularMetadados(estrutura) {
  let totalPerguntas = 0;
  let totalRespondidas = 0;
  let qualidadeTotal = 0;
  
  estrutura.secoes.forEach(secao => {
    secao.perguntas.forEach(pergunta => {
      totalPerguntas++;
      if (pergunta.respondida && pergunta.resposta) {
        totalRespondidas++;
        
        // Calcular qualidade da resposta
        const respostaString = String(pergunta.resposta).trim();
        if (respostaString.length > 10) {
          qualidadeTotal += 100;
        } else if (respostaString.length > 3) {
          qualidadeTotal += 70;
        } else {
          qualidadeTotal += 30;
        }
      }
    });
  });
  
  const progresso = totalPerguntas > 0 ? Math.round((totalRespondidas / totalPerguntas) * 100) : 0;
  const qualidade = totalRespondidas > 0 ? Math.round(qualidadeTotal / totalRespondidas) : 0;
  
  return {
    total_perguntas: totalPerguntas,
    total_respondidas: totalRespondidas,
    progresso: progresso,
    qualidade_respostas: qualidade,
    tempo_gasto_minutos: 0 // Será calculado pelo frontend
  };
}

// Função para migrar briefing antigo
async function migrarBriefingAntigo(briefingAntigo) {
  console.log('🔄 Iniciando migração de briefing antigo');
  
  const estrutura = {
    template_id: 'template-migrado',
    template_nome: 'Briefing Migrado',
    template_versao: '1.0',
    personalizado: false,
    data_criacao: briefingAntigo.createdAt,
    data_ultima_modificacao: briefingAntigo.updatedAt,
    metadados: {
      total_perguntas: 0,
      total_respondidas: 0,
      progresso: briefingAntigo.progresso || 0,
      qualidade_respostas: 0,
      tempo_gasto_minutos: 0
    },
    secoes: []
  };
  
  // Tentar extrair dados das observações
  let respostas = {};
  if (briefingAntigo.observacoes) {
    try {
      const observacoes = JSON.parse(briefingAntigo.observacoes);
      respostas = observacoes.respostas || {};
    } catch (e) {
      console.warn('⚠️ Erro ao parsear observações:', e);
    }
  }
  
  // Se não tem respostas nas observações, criar campos básicos
  if (Object.keys(respostas).length === 0) {
    respostas = {
      'Nome do projeto': briefingAntigo.nomeProjeto || '',
      'Descrição': briefingAntigo.descricao || '',
      'Objetivos': briefingAntigo.objetivos || '',
      'Prazo': briefingAntigo.prazo || '',
      'Orçamento': briefingAntigo.orcamento || ''
    };
  }
  
  // Organizar respostas por categorias
  const categorias = organizarRespostasPorCategoria(respostas);
  
  // Converter cada categoria em uma seção
  Object.entries(categorias).forEach(([nomeSecao, perguntasSecao], indexSecao) => {
    const secao = {
      id: `secao-migrada-${indexSecao + 1}`,
      nome: nomeSecao,
      descricao: `Seção migrada do sistema anterior`,
      ordem: indexSecao + 1,
      obrigatoria: true,
      perguntas: []
    };
    
    perguntasSecao.forEach((item, indexPergunta) => {
      secao.perguntas.push({
        id: `pergunta-migrada-${indexSecao + 1}-${indexPergunta + 1}`,
        pergunta_original: item.pergunta,
        pergunta_personalizada: null,
        tipo: 'text',
        obrigatoria: false,
        ordem: indexPergunta + 1,
        importancia: item.importancia,
        categoria: 'migrada',
        resposta: item.resposta,
        respondida: true,
        data_resposta: briefingAntigo.updatedAt,
        validacao: {
          required: false
        }
      });
    });
    
    estrutura.secoes.push(secao);
  });
  
  // Calcular metadados
  estrutura.metadados = calcularMetadados(estrutura);
  
  console.log('✅ Migração concluída:', estrutura.metadados);
  
  return estrutura;
}

// Função para organizar respostas por categoria
function organizarRespostasPorCategoria(respostas) {
  const categorias = {
    '📋 Informações Gerais': [],
    '📐 Dimensões e Áreas': [],
    '💰 Orçamento e Custos': [],
    '⏰ Prazos e Cronograma': [],
    '🏗️ Materiais e Acabamentos': [],
    '🎨 Design e Estética': [],
    '⚡ Instalações': [],
    '🔒 Segurança': [],
    '🌱 Sustentabilidade': [],
    '🔧 Tecnologia': []
  };
  
  Object.entries(respostas).forEach(([pergunta, resposta]) => {
    const perguntaLower = pergunta.toLowerCase();
    let categoria = '📋 Informações Gerais';
    let importancia = 'media';
    
    // Categorizar pergunta
    if (perguntaLower.includes('área') || perguntaLower.includes('metro') || perguntaLower.includes('tamanho') || perguntaLower.includes('dimensão')) {
      categoria = '📐 Dimensões e Áreas';
      importancia = 'alta';
    } else if (perguntaLower.includes('orçamento') || perguntaLower.includes('custo') || perguntaLower.includes('preço') || perguntaLower.includes('valor')) {
      categoria = '💰 Orçamento e Custos';
      importancia = 'alta';
    } else if (perguntaLower.includes('prazo') || perguntaLower.includes('tempo') || perguntaLower.includes('cronograma') || perguntaLower.includes('entrega')) {
      categoria = '⏰ Prazos e Cronograma';
      importancia = 'alta';
    } else if (perguntaLower.includes('material') || perguntaLower.includes('acabamento') || perguntaLower.includes('revestimento')) {
      categoria = '🏗️ Materiais e Acabamentos';
    } else if (perguntaLower.includes('estilo') || perguntaLower.includes('design') || perguntaLower.includes('estética') || perguntaLower.includes('cor')) {
      categoria = '🎨 Design e Estética';
    } else if (perguntaLower.includes('elétrica') || perguntaLower.includes('hidráulica') || perguntaLower.includes('instalação')) {
      categoria = '⚡ Instalações';
      importancia = 'alta';
    } else if (perguntaLower.includes('segurança') || perguntaLower.includes('proteção') || perguntaLower.includes('alarme')) {
      categoria = '🔒 Segurança';
      importancia = 'alta';
    } else if (perguntaLower.includes('sustentabilidade') || perguntaLower.includes('sustentável') || perguntaLower.includes('verde')) {
      categoria = '🌱 Sustentabilidade';
    } else if (perguntaLower.includes('tecnologia') || perguntaLower.includes('automação') || perguntaLower.includes('smart')) {
      categoria = '🔧 Tecnologia';
    }
    
    categorias[categoria].push({
      pergunta,
      resposta,
      importancia
    });
  });
  
  // Remover categorias vazias
  Object.keys(categorias).forEach(categoria => {
    if (categorias[categoria].length === 0) {
      delete categorias[categoria];
    }
  });
  
  return categorias;
}

// POST /api/briefings/export-pdf - Exportar briefing para PDF
router.post('/export-pdf', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { briefingData, perguntasERespostas } = req.body;
  
  if (!briefingData) {
    return res.status(400).json({ error: 'Dados do briefing são obrigatórios' });
  }

  try {
    // Verificar se puppeteer está disponível
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (error) {
      console.log('⚠️ Puppeteer não instalado, usando fallback HTML');
      
      // Fallback: retornar HTML para download
      const html = gerarHTMLBriefing(briefingData, perguntasERespostas);
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="briefing-${briefingData.nomeProjeto.replace(/[^a-zA-Z0-9]/g, '-')}.html"`);
      res.send(html);
      return;
    }
    
    // Gerar HTML do briefing
    const html = gerarHTMLBriefing(briefingData, perguntasERespostas);
    
    // Configurar puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Configurar o HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });
    
    await browser.close();
    
    // Enviar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="briefing-${briefingData.nomeProjeto.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    
    // Fallback: retornar HTML em caso de erro
    try {
      const html = gerarHTMLBriefing(briefingData, perguntasERespostas);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="briefing-${briefingData.nomeProjeto.replace(/[^a-zA-Z0-9]/g, '-')}.html"`);
      res.send(html);
    } catch (fallbackError) {
      res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  }
}));

// Função para gerar HTML do briefing
function gerarHTMLBriefing(briefingData: any, perguntasERespostas: any): string {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Briefing - ${briefingData.nomeProjeto}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 2rem; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .content { padding: 2rem; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2rem; }
        .info-card { background: #f8fafc; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #2563eb; }
        .info-card h3 { color: #2563eb; margin-bottom: 0.5rem; }
        .section { margin-bottom: 2rem; }
        .section h2 { color: #1e40af; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 1rem; }
        .question { background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .question h4 { color: #374151; margin-bottom: 0.5rem; }
        .answer { background: #f9fafb; padding: 1rem; border-radius: 0.25rem; border-left: 3px solid #10b981; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #f8fafc; padding: 1rem; border-radius: 0.5rem; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #2563eb; }
        .stat-label { color: #6b7280; font-size: 0.875rem; }
        .footer { background: #f8fafc; padding: 2rem; text-align: center; margin-top: 2rem; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${briefingData.nomeProjeto}</h1>
        <p>Dashboard do Briefing - ArcFlow</p>
      </div>
      
      <div class="content">
        <div class="info-grid">
          <div class="info-card">
            <h3>📋 Informações do Projeto</h3>
            <p><strong>Nome:</strong> ${briefingData.nomeProjeto}</p>
            <p><strong>Categoria:</strong> ${briefingData.briefingTemplate.categoria}</p>
            <p><strong>Template:</strong> ${briefingData.briefingTemplate.nome}</p>
          </div>
          
          <div class="info-card">
            <h3>👤 Cliente</h3>
            <p><strong>Nome:</strong> ${briefingData.nomeCliente}</p>
            <p><strong>Email:</strong> ${briefingData.emailCliente}</p>
            <p><strong>Telefone:</strong> ${briefingData.telefoneCliente}</p>
          </div>
          
          <div class="info-card">
            <h3>👨‍💼 Responsável</h3>
            <p><strong>Nome:</strong> ${briefingData.nomeResponsavel}</p>
            <p><strong>Email:</strong> ${briefingData.emailResponsavel}</p>
          </div>
          
          <div class="info-card">
            <h3>⏱️ Tempo de Preenchimento</h3>
            <p><strong>Tempo Total:</strong> ${briefingData.metadados.tempoRealFormatado}</p>
            <p><strong>Progresso:</strong> ${briefingData.metadados.progresso}%</p>
          </div>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${briefingData.metadados.totalRespostas}</div>
            <div class="stat-label">Total de Respostas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${briefingData.metadados.progresso}%</div>
            <div class="stat-label">Completude</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${briefingData.metadados.tempoRealFormatado}</div>
            <div class="stat-label">Tempo Total</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${new Date(briefingData.createdAt).toLocaleDateString('pt-BR')}</div>
            <div class="stat-label">Data de Criação</div>
          </div>
        </div>
        
        <div class="page-break"></div>
        
        ${Object.entries(perguntasERespostas || {}).map(([secao, perguntas]: [string, any]) => `
          <div class="section">
            <h2>${secao}</h2>
            ${perguntas.map((item: any) => `
              <div class="question">
                <h4>${item.pergunta}</h4>
                <div class="answer">${item.resposta}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}
        
        <div class="page-break"></div>
        
        <div class="section">
          <h2>🔏 Assinaturas</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 3rem; margin-top: 3rem;">
            <div style="text-align: center;">
              <div style="border-bottom: 2px solid #333; margin-bottom: 1rem; height: 80px;"></div>
              <p><strong>${briefingData.nomeCliente}</strong></p>
              <p>Cliente</p>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 2px solid #333; margin-bottom: 1rem; height: 80px;"></div>
              <p><strong>${briefingData.nomeResponsavel}</strong></p>
              <p>Responsável Técnico</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>Briefing gerado em ${dataAtual} pelo ArcFlow</p>
        <p>Sistema de Gestão para Escritórios de Arquitetura, Engenharia e Construção</p>
      </div>
    </body>
    </html>
  `;
}

// 🔥 GET /api/briefings/:id/respostas - Buscar respostas específicas de um briefing
router.get('/:id/respostas', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [RESPOSTAS] Buscando respostas do briefing:', id);
  console.log('🔍 [RESPOSTAS] EscritorioId do usuário:', escritorioId);

  // 🔥 DEBUG: Verificar se briefing existe independente do escritório
  const briefingDebug = await prisma.briefing.findFirst({
    where: { id },
    select: {
      id: true,
      escritorioId: true,
      deletedAt: true,
      nomeProjeto: true,
      status: true
    }
  });

  console.log('🔍 [RESPOSTAS] Briefing encontrado (debug):', briefingDebug);

  if (!briefingDebug) {
    console.log('❌ [RESPOSTAS] Briefing não existe no banco');
    throw new NotFoundError('Briefing não encontrado no banco de dados');
  }

  if (briefingDebug.escritorioId !== escritorioId) {
    console.log('❌ [RESPOSTAS] Briefing pertence a outro escritório');
    console.log('❌ [RESPOSTAS] Escritório do briefing:', briefingDebug.escritorioId);
    console.log('❌ [RESPOSTAS] Escritório do usuário:', escritorioId);
    throw new NotFoundError('Briefing não encontrado - escritório diferente');
  }

  if (briefingDebug.deletedAt) {
    console.log('❌ [RESPOSTAS] Briefing foi deletado em:', briefingDebug.deletedAt);
    throw new NotFoundError('Briefing não encontrado - foi deletado');
  }

  // Buscar briefing completo
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

  // 🔥 ESTRATÉGIA UNIFICADA: Formato único para edição
  let respostasParaEdicao: Record<string, any> = {};
  let totalRespostas = 0;
  let fonte = 'nenhuma';

  // 1. 🎯 PRIORIDADE: Briefings personalizados (metadata JSON)
  if (briefing.metadata && typeof briefing.metadata === 'object') {
    console.log('🔍 [RESPOSTAS] Verificando metadata para briefing personalizado...');
    
    const metadata = briefing.metadata as any;
    
    // Verificar formato de respostas no metadata
    if (metadata.respostas && typeof metadata.respostas === 'object') {
      console.log('✅ [RESPOSTAS] Encontrado formato "respostas" no metadata');
      
      // Copiar respostas diretamente (já estão no formato correto)
      respostasParaEdicao = { ...metadata.respostas };
      totalRespostas = Object.keys(respostasParaEdicao).length;
        fonte = 'metadata-personalizado';
    }
    // Verificar se há respostas no campo observacoes (formato antigo)
    else if (briefing.observacoes && typeof briefing.observacoes === 'string') {
      console.log('🔍 [RESPOSTAS] Verificando observações para respostas...');
      
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        if (observacoes.respostas && typeof observacoes.respostas === 'object') {
          console.log('✅ [RESPOSTAS] Encontrado formato "respostas" nas observações');
      
          // Mapear respostas para formato de edição
          Object.entries(observacoes.respostas).forEach(([key, value], index) => {
            // Se a chave já é um ID numérico, usar diretamente
            if (/^\d+$/.test(key)) {
              respostasParaEdicao[key] = value;
            } else {
              // Se não, gerar ID sequencial
          const numeroId = (index + 1).toString();
          respostasParaEdicao[numeroId] = value;
        }
      });
      
          totalRespostas = Object.keys(respostasParaEdicao).length;
          fonte = 'observacoes-json';
        }
      } catch (error) {
        console.log('⚠️ [RESPOSTAS] Erro ao parsear observações:', error.message);
      }
    }
  }

  // 2. 🔄 FALLBACK: Estrutura padrão (briefing_respostas)
  if (totalRespostas === 0) {
    console.log('🔍 [RESPOSTAS] Tentando estrutura padrão (briefing_respostas)...');
    
    try {
      const briefingComRespostas = await prisma.briefing.findFirst({
        where: { 
          id, 
          escritorioId,
          deletedAt: null 
        },
        include: {
          respostas: {
            include: {
              pergunta: {
                select: {
                  id: true,
                  pergunta: true,
                  tipo: true,
                  obrigatoria: true,
                  ordem: true
                }
              }
            },
            orderBy: {
              pergunta: {
                ordem: 'asc'
              }
            }
          }
        }
      });
      
      if (briefingComRespostas?.respostas?.length > 0) {
        briefingComRespostas.respostas.forEach(resposta => {
          const perguntaId = resposta.perguntaId;
          
          // 🔥 CORREÇÃO CRÍTICA: Usar perguntaId como string (formato esperado pelo frontend)
          respostasParaEdicao[perguntaId.toString()] = resposta.resposta;
        });
        
        totalRespostas = briefingComRespostas.respostas.length;
        fonte = 'tabela-padrao';
      }
    } catch (error) {
      console.log('⚠️ [RESPOSTAS] Erro ao buscar na tabela padrão:', error.message);
    }
  }

  // 3. 🔧 FALLBACK FINAL: Apenas se não encontrou nenhuma resposta
  if (totalRespostas === 0) {
    console.log('🔍 [RESPOSTAS] Nenhuma resposta encontrada para briefing:', id);
    
    // Retornar objeto vazio em vez de dados do briefing
    respostasParaEdicao = {};
    fonte = 'vazio';
  }

  console.log(`✅ [RESPOSTAS] Respostas encontradas: ${totalRespostas} (fonte: ${fonte})`);
  console.log('🔧 [RESPOSTAS] Primeiras 5 respostas:', 
    Object.entries(respostasParaEdicao).slice(0, 5).map(([key, value]) => 
      `${key}: ${typeof value === 'string' ? value.substring(0, 50) : value}...`
    )
  );

  // 🔥 CARREGAR ESTRUTURA PERSONALIZADA SE EXISTIR
  let estruturaPersonalizada = null;
  if (briefing.metadata && typeof briefing.metadata === 'object') {
    const metadata = briefing.metadata as any;
    estruturaPersonalizada = metadata.estruturaPersonalizada || null;
  }
  
  // Se não encontrou no metadata, tentar nas observações
  if (!estruturaPersonalizada && briefing.observacoes && typeof briefing.observacoes === 'string') {
    try {
      const observacoes = JSON.parse(briefing.observacoes);
      estruturaPersonalizada = observacoes.estruturaPersonalizada || null;
    } catch (error) {
      console.log('⚠️ [RESPOSTAS] Erro ao parsear observações para estrutura personalizada:', error.message);
    }
  }

  console.log('🔍 [RESPOSTAS] Estrutura personalizada encontrada:', estruturaPersonalizada ? 'SIM' : 'NÃO');
  if (estruturaPersonalizada) {
    console.log('📋 [RESPOSTAS] Personalização - Seções visíveis:', estruturaPersonalizada.secoesVisiveis?.length || 0);
  }

  res.json({
    briefingId: briefing.id,
    totalRespostas,
    fonte, // Indicar de onde vieram as respostas
    // 🔥 FORMATO ÚNICO: Apenas respostasParaEdicao (formato esperado pelo frontend)
    respostasParaEdicao: respostasParaEdicao,
    // 🔥 NOVO: Estrutura personalizada para restaurar personalização
    estruturaPersonalizada: estruturaPersonalizada,
    // Metadados úteis
    metadata: {
      isPersonalizado: fonte.includes('metadata'),
      progresso: briefing.progresso,
      status: briefing.status,
      disciplina: briefing.disciplina,
      area: briefing.area,
      tipologia: briefing.tipologia
    }
  });
}));

// 🔥 GET /api/briefings/:id/historico - Buscar histórico de alterações
router.get('/:id/historico', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [HISTORICO] Buscando histórico do briefing:', id);

  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
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

  // Buscar histórico de auditoria se existir
  let historicoAuditoria: any[] = [];
  try {
    historicoAuditoria = await prisma.auditoria.findMany({
      where: {
        entidade: 'briefing',
        entidadeId: id,
        escritorioId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  } catch (error) {
    console.log('⚠️ [HISTORICO] Tabela de auditoria não encontrada, usando histórico básico');
  }

  // Histórico básico baseado nos dados do briefing
  const historicoBasico = [
    {
      id: `${briefing.id}-criado`,
      acao: 'Briefing criado',
      data: briefing.createdAt,
      tempo_inicio: briefing.createdAt,
      tempo_fim: briefing.updatedAt,
      usuario: briefing.responsavel?.name || 'Sistema',
      detalhes: `Briefing "${briefing.nomeProjeto}" criado no sistema`
    }
  ];

  // Se o briefing foi atualizado, adicionar evento de atualização
  if (briefing.updatedAt.getTime() !== briefing.createdAt.getTime()) {
    historicoBasico.push({
      id: `${briefing.id}-atualizado`,
      acao: 'Briefing atualizado',
      data: briefing.updatedAt,
      tempo_inicio: briefing.createdAt,
      tempo_fim: briefing.updatedAt,
      usuario: briefing.responsavel?.name || 'Sistema',
      detalhes: `Briefing "${briefing.nomeProjeto}" foi atualizado`
    });
  }

  // Combinar histórico de auditoria com histórico básico
  const historicoCompleto = [
    ...historicoAuditoria.map(h => ({
      id: h.id,
      acao: h.acao,
      data: h.createdAt,
      tempo_inicio: h.createdAt,
      tempo_fim: h.updatedAt,
      usuario: h.usuario?.name || 'Sistema',
      detalhes: h.detalhes
    })),
    ...historicoBasico
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  console.log('✅ [HISTORICO] Histórico encontrado:', historicoCompleto.length, 'eventos');

  res.json({
    briefingId: briefing.id,
    totalEventos: historicoCompleto.length,
    historico: historicoCompleto
  });
}));

// 🔥 POST /api/briefings/:id/duplicar - Duplicar briefing
router.post('/:id/duplicar', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nomeProjeto, clienteId } = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  console.log('🔄 [DUPLICAR] Duplicando briefing:', id);

  // Buscar briefing original
  const briefingOriginal = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      respostas: {
        include: {
          pergunta: true
        }
      },
      templates: true
    }
  });

  if (!briefingOriginal) {
    throw new NotFoundError('Briefing original não encontrado');
  }

  // Verificar se cliente existe
  if (clienteId) {
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
  }

  // Criar novo briefing duplicado
  const novoBriefing = await prisma.briefing.create({
    data: {
      nomeProjeto: nomeProjeto || `${briefingOriginal.nomeProjeto} (Cópia)`,
      descricao: briefingOriginal.descricao,
      objetivos: briefingOriginal.objetivos,
      prazo: briefingOriginal.prazo,
      orcamento: briefingOriginal.orcamento,
      clienteId: clienteId || briefingOriginal.clienteId,
      responsavelId: userId,
      escritorioId,
      disciplina: briefingOriginal.disciplina,
      area: briefingOriginal.area,
      tipologia: briefingOriginal.tipologia,
      status: 'RASCUNHO',
      progresso: 0,
      createdBy: userId
    },
    include: {
      cliente: true,
      responsavel: true
    }
  });

  // Duplicar respostas
  if (briefingOriginal.respostas.length > 0) {
    await prisma.resposta.createMany({
      data: briefingOriginal.respostas.map(resposta => ({
        briefingId: novoBriefing.id,
        perguntaId: resposta.perguntaId,
        resposta: resposta.resposta,
        briefingTemplateId: resposta.briefingTemplateId
      }))
    });
  }

  console.log('✅ [DUPLICAR] Briefing duplicado com sucesso:', novoBriefing.id);

  res.json({
    success: true,
    briefing: novoBriefing,
    message: 'Briefing duplicado com sucesso'
  });
}));

// 🔥 PUT /api/briefings/:id/status - Atualizar status do briefing
router.put('/:id/status', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  console.log('🔄 [STATUS] Atualizando status do briefing:', id, 'para:', status);

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

  const briefingAtualizado = await prisma.briefing.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date()
    },
    include: {
      cliente: true,
      responsavel: true
    }
  });

  // Registrar auditoria se possível
  try {
    await prisma.auditoria.create({
      data: {
        entidade: 'briefing',
        entidadeId: id,
        acao: 'Status atualizado',
        detalhes: `Status alterado de "${briefing.status}" para "${status}"`,
        usuarioId: userId,
        escritorioId,
        dadosAnteriores: { status: briefing.status },
        dadosNovos: { status }
      }
    });
  } catch (error) {
    console.log('⚠️ [STATUS] Erro ao registrar auditoria:', error.message);
  }

  console.log('✅ [STATUS] Status atualizado com sucesso');

  res.json({
    success: true,
    briefing: briefingAtualizado,
    message: 'Status atualizado com sucesso'
  });
}));

// 🎯 ===== ROTAS PARA ESTRUTURAS PERSONALIZADAS =====
// Implementação para 10.000 usuários simultâneos - ZERO perda de dados

// POST /api/briefings/:id/estrutura-personalizada - Salvar estrutura personalizada
router.post('/:id/estrutura-personalizada', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estruturaPersonalizada } = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  console.log('💾 [ESTRUTURA] Salvando estrutura personalizada para briefing:', id);

  // Verificar se briefing existe e pertence ao escritório
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

  // Salvar estrutura personalizada no campo estruturaBriefing
  const briefingAtualizado = await prisma.briefing.update({
    where: { id },
    data: {
      estruturaBriefing: estruturaPersonalizada,
      updatedAt: new Date()
    }
  });

  // Registrar auditoria para garantir rastreabilidade
  try {
    await prisma.auditoria.create({
      data: {
        entidade: 'briefing',
        entidadeId: id,
        acao: 'Estrutura personalizada salva',
        detalhes: `Estrutura personalizada criada/atualizada para briefing "${briefing.nomeProjeto}"`,
        usuarioId: userId,
        escritorioId,
        dadosNovos: { estruturaPersonalizada }
      }
    });
  } catch (error) {
    console.log('⚠️ [ESTRUTURA] Erro ao registrar auditoria:', error.message);
  }

  console.log('✅ [ESTRUTURA] Estrutura personalizada salva com sucesso');

  res.json({
    success: true,
    message: 'Estrutura personalizada salva com sucesso',
    briefingId: id,
    estruturaPersonalizada: briefingAtualizado.estruturaBriefing
  });
}));

// GET /api/briefings/:id/estrutura-personalizada - Carregar estrutura personalizada
router.get('/:id/estrutura-personalizada', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [ESTRUTURA] Carregando estrutura personalizada para briefing:', id);

  // Buscar briefing com estrutura personalizada
  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    select: {
      id: true,
      nomeProjeto: true,
      estruturaBriefing: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  console.log('✅ [ESTRUTURA] Estrutura personalizada carregada:', briefing.estruturaBriefing ? 'SIM' : 'NÃO');

  res.json({
    success: true,
    briefingId: id,
    estruturaPersonalizada: briefing.estruturaBriefing,
    nomeProjeto: briefing.nomeProjeto,
    hasEstrutura: !!briefing.estruturaBriefing
  });
}));

// POST /api/briefings/:id/respostas - Salvar respostas do briefing
router.post('/:id/respostas', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { respostas } = req.body;
  const escritorioId = (req as any).user.escritorioId;
  const userId = (req as any).user.id;

  console.log('💾 [RESPOSTAS] Salvando respostas para briefing:', id);
  console.log('💾 [RESPOSTAS] Número de respostas:', Object.keys(respostas).length);

  // Verificar se briefing existe e pertence ao escritório
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

  // Filtrar respostas válidas (ignorar metadados)
  const respostasValidas = Object.entries(respostas)
    .filter(([key, value]) => !key.startsWith('_') && value !== null && value !== undefined && value !== '');

  console.log('💾 [RESPOSTAS] Respostas válidas:', respostasValidas.length);

  // Salvar cada resposta individualmente
  const respostasSalvas = [];
  for (const [perguntaId, resposta] of respostasValidas) {
    try {
      // Verificar se já existe uma resposta para essa pergunta
      const respostaExistente = await prisma.briefingResposta.findFirst({
        where: {
          briefingId: id,
          perguntaId: perguntaId
        }
      });

      if (respostaExistente) {
        // Atualizar resposta existente
        const respostaAtualizada = await prisma.briefingResposta.update({
          where: { id: respostaExistente.id },
          data: {
            resposta: String(resposta),
            updatedAt: new Date()
          }
        });
        respostasSalvas.push(respostaAtualizada);
      } else {
        // Criar nova resposta
        const novaResposta = await prisma.briefingResposta.create({
          data: {
            briefingId: id,
            perguntaId: perguntaId,
            resposta: String(resposta),
            briefingTemplateId: 'personalizado', // Identificador para respostas personalizadas
            createdBy: userId
          }
        });
        respostasSalvas.push(novaResposta);
      }
    } catch (error) {
      console.log('⚠️ [RESPOSTAS] Erro ao salvar resposta:', perguntaId, error.message);
    }
  }

  // Atualizar progresso do briefing
  const progresso = Math.min(100, Math.floor((respostasSalvas.length / respostasValidas.length) * 100));
  await prisma.briefing.update({
    where: { id },
    data: {
      progresso,
      updatedAt: new Date()
    }
  });

  // Registrar auditoria
  try {
    await prisma.auditoria.create({
      data: {
        entidade: 'briefing',
        entidadeId: id,
        acao: 'Respostas salvas',
        detalhes: `${respostasSalvas.length} respostas salvas para briefing "${briefing.nomeProjeto}"`,
        usuarioId: userId,
        escritorioId,
        dadosNovos: { totalRespostas: respostasSalvas.length, progresso }
      }
    });
  } catch (error) {
    console.log('⚠️ [RESPOSTAS] Erro ao registrar auditoria:', error.message);
  }

  console.log('✅ [RESPOSTAS] Respostas salvas com sucesso:', respostasSalvas.length);

  res.json({
    success: true,
    message: 'Respostas salvas com sucesso',
    briefingId: id,
    totalRespostas: respostasSalvas.length,
    progresso
  });
}));

// GET /api/briefings/:id/respostas - Carregar respostas do briefing
router.get('/:id/respostas', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const escritorioId = (req as any).user.escritorioId;

  console.log('🔍 [RESPOSTAS] Carregando respostas para briefing:', id);

  // Buscar briefing com respostas
  const briefing = await prisma.briefing.findFirst({
    where: { 
      id, 
      escritorioId,
      deletedAt: null 
    },
    include: {
      respostas: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!briefing) {
    throw new NotFoundError('Briefing não encontrado');
  }

  // Converter respostas para formato esperado pelo frontend
  const respostasFormatadas = briefing.respostas.reduce((acc, resposta) => {
    acc[resposta.perguntaId] = resposta.resposta;
    return acc;
  }, {} as Record<string, string>);

  console.log('✅ [RESPOSTAS] Respostas carregadas:', Object.keys(respostasFormatadas).length);

  res.json({
    success: true,
    briefingId: id,
    respostas: respostasFormatadas,
    totalRespostas: briefing.respostas.length,
    progresso: briefing.progresso
  });
}));

export default router; 