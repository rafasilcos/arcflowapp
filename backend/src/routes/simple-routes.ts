import { Router, Request, Response } from 'express';
import { logger } from '../config/logger';

// Função para criar rota simplificada
const createSimpleRoute = (routeName: string) => {
  const router = Router();
  
  router.get('/', async (req: Request, res: Response) => {
    try {
      res.json({
        message: `${routeName} funcionando`,
        data: [],
        total: 0
      });
    } catch (error: any) {
      logger.error(`Erro em ${routeName}:`, error);
      res.status(500).json({ 
        message: 'Erro interno do servidor',
        error: error.message 
      });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      res.status(501).json({ message: `${routeName} - Funcionalidade em desenvolvimento` });
    } catch (error: any) {
      logger.error(`Erro em ${routeName}:`, error);
      res.status(500).json({ 
        message: 'Erro interno do servidor',
        error: error.message 
      });
    }
  });

  return router;
};

export const authRoutes = createSimpleRoute('Auth');
export const usersRoutes = createSimpleRoute('Users');
export const atividadesRoutes = createSimpleRoute('Atividades');
export const dashboardRoutes = createSimpleRoute('Dashboard');
export const briefingsRoutes = createSimpleRoute('Briefings');
export const arquivosRoutes = createSimpleRoute('Arquivos');
export const notificacoesRoutes = createSimpleRoute('Notificacoes'); 