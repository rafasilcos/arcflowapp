import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database-simple';
import { logger } from '../config/logger';

const router = Router();

// Interfaces para tipos
interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
  escritorio: {
    nome: string;
    cnpj?: string;
    email: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  planId?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'arcflow-super-secret-refresh-jwt-key-development-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Função para gerar tokens
const generateTokens = (user: any) => {
  const payload = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    escritorioId: user.escritorio_id
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'arcflow-api',
    audience: 'arcflow-client'
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(
    { userId: user.id }, 
    JWT_REFRESH_SECRET, 
    { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'arcflow-api',
      audience: 'arcflow-client'
    } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

// Função para salvar refresh token no banco
const saveRefreshToken = async (token: string, userId: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

  await prisma.$executeRaw`
    INSERT INTO refresh_tokens (id, token, user_id, expires_at)
    VALUES (${uuidv4()}, ${token}, ${userId}, ${expiresAt})
  `;
};

// POST /api/auth/register - Registro completo (Escritório + Usuário)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, password, escritorio, planId = 'plan_free' }: RegisterRequest = req.body;

    // Validações básicas
    if (!nome || !email || !password || !escritorio?.nome || !escritorio?.email) {
      return res.status(400).json({
        error: 'Dados obrigatórios: nome, email, password, escritorio.nome, escritorio.email',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Senha deve ter pelo menos 6 caracteres',
        code: 'WEAK_PASSWORD'
      });
    }

    // Verificar se email já existe
    const existingUser = await prisma.$queryRaw`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return res.status(409).json({
        error: 'Email já está em uso',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Verificar se plano existe
    const plan = await prisma.$queryRaw`
      SELECT id, name FROM plans WHERE id = ${planId} AND is_active = true
    `;

    if (!Array.isArray(plan) || plan.length === 0) {
      return res.status(400).json({
        error: 'Plano inválido',
        code: 'INVALID_PLAN'
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar escritório
    const escritorioId = uuidv4();
    await prisma.$executeRaw`
      INSERT INTO escritorios (id, nome, cnpj, email, telefone, endereco, cidade, estado, cep, plan_id)
      VALUES (${escritorioId}, ${escritorio.nome}, ${escritorio.cnpj || null}, ${escritorio.email}, 
              ${escritorio.telefone || null}, ${escritorio.endereco || null}, ${escritorio.cidade || null}, 
              ${escritorio.estado || null}, ${escritorio.cep || null}, ${planId})
    `;

    // Criar usuário OWNER
    const userId = uuidv4();
    await prisma.$executeRaw`
      INSERT INTO users (id, email, password_hash, nome, role, escritorio_id, email_verified)
      VALUES (${userId}, ${email}, ${passwordHash}, ${nome}, 'OWNER', ${escritorioId}, true)
    `;

    // Buscar usuário criado
    const newUser = await prisma.$queryRaw`
      SELECT id, email, nome, role, escritorio_id FROM users WHERE id = ${userId}
    ` as any[];

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(newUser[0]);
    await saveRefreshToken(refreshToken, userId);

    logger.info('Novo registro completo', {
      userId,
      email,
      escritorioId,
      planId
    });

    res.status(201).json({
      message: 'Registro realizado com sucesso',
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        nome: newUser[0].nome,
        role: newUser[0].role,
        escritorioId: newUser[0].escritorio_id
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      },
      escritorio: {
        id: escritorioId,
        nome: escritorio.nome,
        planId
      }
    });

  } catch (error: any) {
    logger.error('Erro no registro', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// POST /api/auth/login - Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Buscar usuário
    const users = await prisma.$queryRaw`
      SELECT u.*, e.nome as escritorio_nome, e.plan_id 
      FROM users u 
      JOIN escritorios e ON u.escritorio_id = e.id 
      WHERE u.email = ${email} AND u.is_active = true AND e.is_active = true
    ` as any[];

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = users[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Atualizar último login
    await prisma.$executeRaw`
      UPDATE users SET last_login = NOW() WHERE id = ${user.id}
    `;

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(user);
    await saveRefreshToken(refreshToken, user.id);

    logger.info('Login realizado', {
      userId: user.id,
      email: user.email,
      escritorioId: user.escritorio_id
    });

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        escritorioId: user.escritorio_id,
        escritorioNome: user.escritorio_nome,
        planId: user.plan_id
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    });

  } catch (error: any) {
    logger.error('Erro no login', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token é obrigatório',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verificar refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Refresh token inválido',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Verificar se token existe no banco e não foi revogado
    const tokenData = await prisma.$queryRaw`
      SELECT rt.*, u.email, u.nome, u.role, u.escritorio_id 
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token = ${refreshToken} AND rt.is_revoked = false AND rt.expires_at > NOW()
    ` as any[];

    if (tokenData.length === 0) {
      return res.status(401).json({
        error: 'Refresh token inválido ou expirado',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    const user = tokenData[0];

    // Revogar token antigo
    await prisma.$executeRaw`
      UPDATE refresh_tokens SET is_revoked = true WHERE token = ${refreshToken}
    `;

    // Gerar novos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await saveRefreshToken(newRefreshToken, user.user_id);

    res.json({
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    });

  } catch (error: any) {
    logger.error('Erro no refresh', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revogar refresh token
      await prisma.$executeRaw`
        UPDATE refresh_tokens SET is_revoked = true WHERE token = ${refreshToken}
      `;
    }

    res.json({ message: 'Logout realizado com sucesso' });

  } catch (error: any) {
    logger.error('Erro no logout', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// GET /api/auth/me - Obter dados do usuário atual
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de acesso necessário',
        code: 'TOKEN_REQUIRED'
      });
    }

    const token = authHeader.substring(7);
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    // Buscar dados atualizados do usuário
    const users = await prisma.$queryRaw`
      SELECT u.id, u.email, u.nome, u.role, u.escritorio_id, u.last_login,
             e.nome as escritorio_nome, e.plan_id, p.name as plan_name
      FROM users u 
      JOIN escritorios e ON u.escritorio_id = e.id 
      JOIN plans p ON e.plan_id = p.id
      WHERE u.id = ${decoded.id} AND u.is_active = true AND e.is_active = true
    ` as any[];

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = users[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        escritorioId: user.escritorio_id,
        escritorioNome: user.escritorio_nome,
        planId: user.plan_id,
        planName: user.plan_name,
        lastLogin: user.last_login
      }
    });

  } catch (error: any) {
    logger.error('Erro ao buscar usuário', { error: error.message });
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

export default router; 