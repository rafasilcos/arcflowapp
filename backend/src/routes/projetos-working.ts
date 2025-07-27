import { Router, Request, Response } from 'express';
import { logger } from '../config/logger';

const router = Router();

// GET /api/projetos - Listar projetos (simplificado)
router.get('/', async (req: Request, res: Response) => {
  try {
    // Por enquanto retorna lista vazia para não quebrar o frontend
    res.json({
      projetos: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    });
  } catch (error: any) {
    logger.error('Erro ao buscar projetos:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

// GET /api/projetos/:id - Obter projeto específico
router.get('/:id', async (req: Request, res: Response) => {
  try {
    res.status(404).json({ message: 'Projeto não encontrado' });
  } catch (error: any) {
    logger.error('Erro ao buscar projeto:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

// POST /api/projetos - Criar novo projeto
router.post('/', async (req: Request, res: Response) => {
  try {
    res.status(501).json({ message: 'Funcionalidade em desenvolvimento' });
  } catch (error: any) {
    logger.error('Erro ao criar projeto:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

export default router; 