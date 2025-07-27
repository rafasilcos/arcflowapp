import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database-simple';
import { logger } from '../config/logger';

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';

// Interface para o usuário autenticado
export interface AuthenticatedUser {
  id: string;
  email: string;
  nome: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'ARCHITECT' | 'INTERN' | 'VIEWER';
  escritorioId: string;
}

// Estender interface Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Middleware principal de autenticação
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de acesso necessário',
        code: 'TOKEN_REQUIRED'
      });
    }

    const token = authHeader.substring(7);

    // Verificar token JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    // Buscar usuário no banco para garantir que ainda está ativo
    const users = await prisma.$queryRaw`
      SELECT u.id, u.email, u.nome, u.role, u.escritorio_id,
             e.nome as escritorio_nome, e.is_active as escritorio_ativo
      FROM users u 
      JOIN escritorios e ON u.escritorio_id = e.id 
      WHERE u.id = ${decoded.id} AND u.is_active = true
    ` as any[];

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = users[0];

    // Verificar se escritório está ativo
    if (!user.escritorio_ativo) {
      return res.status(403).json({
        error: 'Escritório desativado',
        code: 'OFFICE_INACTIVE'
      });
    }

    // Adicionar usuário ao request
    req.user = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      escritorioId: user.escritorio_id
    };

    next();

  } catch (error: any) {
    logger.error('Erro no middleware de autenticação', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Middleware para verificar roles específicas
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Permissão insuficiente',
        code: 'INSUFFICIENT_PERMISSION',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware para verificar se é OWNER ou ADMIN
export const requireAdmin = requireRole(['OWNER', 'ADMIN']);

// Middleware para verificar se é OWNER, ADMIN ou MANAGER
export const requireManager = requireRole(['OWNER', 'ADMIN', 'MANAGER']);

// Middleware para verificar se é OWNER, ADMIN, MANAGER ou ARCHITECT
export const requireArchitect = requireRole(['OWNER', 'ADMIN', 'MANAGER', 'ARCHITECT']);

// Middleware para verificar se o usuário pertence ao mesmo escritório
export const requireSameOffice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    // Extrair escritorioId dos parâmetros ou body
    const escritorioId = req.params.escritorioId || req.body.escritorioId;

    if (escritorioId && escritorioId !== req.user.escritorioId) {
      return res.status(403).json({
        error: 'Acesso negado: usuário não pertence a este escritório',
        code: 'DIFFERENT_OFFICE'
      });
    }

    next();

  } catch (error: any) {
    logger.error('Erro no middleware de escritório', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Middleware opcional - não falha se não houver token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continua sem usuário
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Buscar usuário
      const users = await prisma.$queryRaw`
        SELECT u.id, u.email, u.nome, u.role, u.escritorio_id
        FROM users u 
        JOIN escritorios e ON u.escritorio_id = e.id 
        WHERE u.id = ${decoded.id} AND u.is_active = true AND e.is_active = true
      ` as any[];

      if (users.length > 0) {
        const user = users[0];
        req.user = {
          id: user.id,
          email: user.email,
          nome: user.nome,
          role: user.role,
          escritorioId: user.escritorio_id
        };
      }
    } catch (error) {
      // Token inválido, mas não falha - apenas continua sem usuário
    }

    next();

  } catch (error: any) {
    logger.error('Erro no middleware opcional', { error: error.message });
    next(); // Continua mesmo com erro
  }
};

// Middleware para verificar se o usuário tem escritório
export const requireEscritorio = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Usuário não autenticado',
      code: 'USER_NOT_AUTHENTICATED'
    });
  }

  if (!req.user.escritorioId) {
    return res.status(403).json({
      error: 'Usuário deve estar associado a um escritório',
      code: 'NO_OFFICE_ASSOCIATION'
    });
  }

  next();
};

// Função para extrair escritório do usuário automaticamente
export const autoInjectOffice = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && !req.body.escritorioId && !req.params.escritorioId) {
    // Injeta escritorioId automaticamente nas queries/body
    if (req.method === 'POST' || req.method === 'PUT') {
      req.body.escritorioId = req.user.escritorioId;
    }
    
    // Para queries GET, adiciona filtro automático
    if (req.method === 'GET') {
      req.query.escritorioId = req.user.escritorioId;
    }
  }
  
  next();
};

export default authMiddleware; 