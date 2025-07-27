import { Router, Request, Response } from 'express';
import BriefingCompostoService from '../services/briefingCompostoService';
import { logger } from '../config/logger';

const router = Router();

// POST /api/briefings-compostos - Criar briefing composto
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, descricao, disciplinas, areas, tipologias, projetoId, clienteId, createdBy } = req.body;

    logger.info('📝 Criando briefing composto via API', {
      nome,
      disciplinas: disciplinas?.length,
      projetoId
    });

    const briefingComposto = await BriefingCompostoService.criarBriefingComposto({
      nome,
      descricao,
      disciplinas,
      areas,
      tipologias,
      projetoId,
      clienteId,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: briefingComposto
    });

  } catch (error: any) {
    logger.error('❌ Erro ao criar briefing composto', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/briefings-compostos/:id - Obter briefing composto
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const briefingComposto = await BriefingCompostoService.obterBriefingComposto(id);

    res.json({
      success: true,
      data: briefingComposto
    });

  } catch (error: any) {
    logger.error('❌ Erro ao obter briefing composto', { error: error.message });
    const statusCode = error.message.includes('não encontrado') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/briefings-compostos/projeto/:projetoId - Listar por projeto
router.get('/projeto/:projetoId', async (req: Request, res: Response) => {
  try {
    const { projetoId } = req.params;
    const briefings = await BriefingCompostoService.listarPorProjeto(projetoId);

    res.json({
      success: true,
      data: briefings,
      total: briefings.length
    });

  } catch (error: any) {
    logger.error('❌ Erro ao listar briefings', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'briefings-compostos',
    timestamp: new Date().toISOString()
  });
});

export default router;
