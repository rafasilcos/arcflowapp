import { Router, Request, Response } from 'express';
import { logger } from '../config/logger';

const router = Router();

// GET /api/cronometros - Listar cronômetros
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json({
      cronometros: [],
      total: 0
    });
  } catch (error: any) {
    logger.error('Erro ao buscar cronômetros:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

// POST /api/cronometros - Criar cronômetro
router.post('/', async (req: Request, res: Response) => {
  try {
    res.status(501).json({ message: 'Funcionalidade em desenvolvimento' });
  } catch (error: any) {
    logger.error('Erro ao criar cronômetro:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

export default router; 