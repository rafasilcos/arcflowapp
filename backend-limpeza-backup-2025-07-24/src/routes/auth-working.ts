import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger';

const router = Router();

// Configuração do banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Segredo JWT (em produção deve vir de variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-secret-key-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'arcflow-refresh-secret-2024';

// Interface para dados do usuário (estrutura real do Supabase)
interface User {
  id: string;
  email: string;
  nome: string;
  escritorio_id: string;
  password_hash?: string;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}

interface Escritorio {
  id: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
}

// Função para gerar tokens JWT
const generateTokens = (user: User, escritorio: Escritorio) => {
  const payload = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    escritorio_id: user.escritorio_id,
    escritorio_nome: escritorio.nome
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_FIELDS'
      });
    }

    logger.info('Tentativa de login:', { email });

    // Buscar usuário no banco (estrutura real do Supabase)
    const userQuery = `
      SELECT u.id, u.email, u.nome, u.escritorio_id, u.password_hash, u.is_active, u.created_at, u.updated_at,
             e.nome as escritorio_nome, e.cnpj as escritorio_cnpj, 
             e.telefone as escritorio_telefone, e.email as escritorio_email
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.email = $1
    `;

    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      logger.warn('Usuário não encontrado:', { email });
      return res.status(401).json({
        error: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = userResult.rows[0];

    // Verificar se usuário está ativo
    if (user.is_active === false) {
      logger.warn('Usuário inativo:', { email });
      return res.status(401).json({
        error: 'Usuário inativo. Entre em contato com o administrador.',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar senha (por enquanto, senha simples para teste)
    // Em produção, usar bcrypt.compare(password, user.password_hash)
    if (password !== '123456') {
      logger.warn('Senha incorreta para usuário:', { email });
      return res.status(401).json({
        error: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Dados do escritório
    const escritorio: Escritorio = {
      id: user.escritorio_id,
      nome: user.escritorio_nome || 'Escritório ArcFlow',
      cnpj: user.escritorio_cnpj,
      telefone: user.escritorio_telefone,
      email: user.escritorio_email
    };

    // Gerar tokens
    const tokens = generateTokens(user, escritorio);

    // Dados do usuário para resposta (sem senha)
    const userData = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      escritorio_id: user.escritorio_id,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // Atualizar último login
    try {
      await pool.query(`
        UPDATE users 
        SET last_login = NOW() 
        WHERE id = $1
      `, [user.id]);
    } catch (updateError) {
      // Não falhar se não conseguir atualizar último login
      logger.warn('Não foi possível atualizar último login:', updateError);
    }

    logger.info('Login realizado com sucesso:', { 
      email, 
      userId: user.id,
      escritorioId: user.escritorio_id 
    });

    res.json({
      message: 'Login realizado com sucesso',
      user: userData,
      escritorio,
      tokens,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    // Em uma implementação completa, invalidaríamos o token no Redis
    logger.info('Logout realizado');
    
    res.json({
      message: 'Logout realizado com sucesso',
      success: true
    });
  } catch (error: any) {
    logger.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token é obrigatório',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    
    // Buscar usuário
    const userQuery = `
      SELECT u.id, u.email, u.nome, u.escritorio_id, u.is_active, u.created_at, u.updated_at,
             e.nome as escritorio_nome, e.cnpj as escritorio_cnpj, 
             e.telefone as escritorio_telefone, e.email as escritorio_email
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.id = $1
    `;

    const userResult = await pool.query(userQuery, [decoded.id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    if (user.is_active === false) {
      return res.status(401).json({
        error: 'Usuário inativo',
        code: 'USER_INACTIVE'
      });
    }

    const escritorio: Escritorio = {
      id: user.escritorio_id,
      nome: user.escritorio_nome || 'Escritório ArcFlow',
      cnpj: user.escritorio_cnpj,
      telefone: user.escritorio_telefone,
      email: user.escritorio_email
    };

    // Gerar novos tokens
    const tokens = generateTokens(user, escritorio);

    res.json({
      message: 'Tokens renovados com sucesso',
      tokens,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao renovar token:', error);
    res.status(401).json({
      error: 'Refresh token inválido',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de acesso é obrigatório',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Buscar dados atualizados do usuário
    const userQuery = `
      SELECT u.id, u.email, u.nome, u.escritorio_id, u.is_active, u.created_at, u.updated_at,
             e.nome as escritorio_nome, e.cnpj as escritorio_cnpj, 
             e.telefone as escritorio_telefone, e.email as escritorio_email
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.id = $1
    `;

    const userResult = await pool.query(userQuery, [decoded.id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];
    
    const userData = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      escritorio_id: user.escritorio_id,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    const escritorio: Escritorio = {
      id: user.escritorio_id,
      nome: user.escritorio_nome || 'Escritório ArcFlow',
      cnpj: user.escritorio_cnpj,
      telefone: user.escritorio_telefone,
      email: user.escritorio_email
    };

    res.json({
      user: userData,
      escritorio,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao buscar dados do usuário:', error);
    res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
});

// GET /api/auth/status
router.get('/status', async (req: Request, res: Response) => {
  try {
    // Testar conexão com banco
    const result = await pool.query('SELECT NOW()');
    
    // Contar usuários ativos
    const userCount = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN is_active = true THEN 1 END) as ativos
      FROM users
    `);
    
    res.json({
      status: 'OK',
      message: 'Serviço de autenticação funcionando',
      database: 'connected',
      timestamp: result.rows[0].now,
      users: {
        total: parseInt(userCount.rows[0].total),
        ativos: parseInt(userCount.rows[0].ativos)
      }
    });
  } catch (error: any) {
    logger.error('Erro no status da auth:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Erro na conexão com banco de dados',
      error: error.message
    });
  }
});

export default router; 