import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { CacheService } from '../config/redis';
import { logger, logSecurity } from '../config/logger';
import { authMiddleware, requireRole, requireEscritorio } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// Declaração global para usuários simulados
declare global {
  var usuariosSimulados: any[];
}

// Interface para dados de usuário
interface UserData {
  name: string;
  email: string;
  role: string;
  password?: string;
  avatar?: string;
}

// Função para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar senha
const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// GET /api/users - Listar usuários do escritório
router.get('/', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const escritorioId = req.user!.escritorioId!;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const role = req.query.role as string;
  const isActive = req.query.isActive;

  const skip = (page - 1) * limit;

  // Construir filtros
  const where: any = {
    escritorioId,
    ...(isActive !== undefined && { isActive: isActive === 'true' })
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (role) {
    where.role = role;
  }

  // Buscar usuários
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // cargo: true,    // Será habilitado após migration
        // funcao: true,   // Será habilitado após migration
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            projetoUsers: true,
            atividades: true
          }
        }
      }
    }),
    prisma.user.count({ where })
  ]);

  // Adicionar usuários simulados dos convites aceitos
  let allUsers = [...users];
  
  if (global.usuariosSimulados) {
    const usuariosEscritorio = global.usuariosSimulados.filter((u: any) => 
      u.escritorioId === escritorioId && u.isActive
    );
    
    // Converter para formato esperado
    const usuariosSimuladosFormatados = usuariosEscritorio.map((u: any) => ({
      id: u.id,
      name: u.nome,
      email: u.email,
      role: u.role,
      avatar: u.avatar || null,
      isActive: u.isActive,
      lastLogin: u.ultimoLogin,
      createdAt: u.createdAt,
      _count: {
        projetoUsers: 0,
        atividades: 0
      }
    }));

    allUsers = [...allUsers, ...usuariosSimuladosFormatados];
  }

  const totalWithSimulated = total + (global.usuariosSimulados?.filter((u: any) => 
    u.escritorioId === escritorioId && u.isActive
  ).length || 0);

  logger.info('Usuários listados', {
    userId: req.user!.id,
    escritorioId,
    total: totalWithSimulated,
    page
  });

  res.json({
    users: allUsers,
    pagination: {
      page,
      limit,
      total: totalWithSimulated,
      pages: Math.ceil(totalWithSimulated / limit)
    }
  });
}));

// GET /api/users/:id - Buscar usuário específico
router.get('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  console.log('🔍 [BACKEND/USERS] Buscando usuário ID:', userId);

  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true
    }
  });

  if (!user) {
    console.log('❌ [BACKEND/USERS] Usuário não encontrado:', userId);
    return res.status(404).json({
      error: 'Usuário não encontrado'
    });
  }

  console.log('✅ [BACKEND/USERS] Usuário encontrado:', user.name);

  res.json({
    id: user.id,
    nome: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt
  });
}));

// POST /api/users - Criar novo usuário (apenas admins)
router.post('/', authMiddleware, requireEscritorio, requireRole('ADMIN', 'OWNER'), asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, password }: UserData = req.body;
  const currentUserId = req.user!.id;
  const escritorioId = req.user!.escritorioId!;

  // Validações
  if (!name || !email || !role || !password) {
    throw new ValidationError('Nome, email, role e senha são obrigatórios');
  }

  if (!isValidEmail(email)) {
    throw new ValidationError('Email inválido');
  }

  if (!isValidPassword(password)) {
    throw new ValidationError('Senha deve ter pelo menos 8 caracteres, incluindo letras e números');
  }

  const validRoles = ['USER', 'DESIGNER', 'ENGINEER', 'ARCHITECT', 'MANAGER'];
  if (!validRoles.includes(role)) {
    throw new ValidationError('Role inválida');
  }

  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ValidationError('Email já está em uso');
  }

  // Hash da senha
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role as any,
      escritorioId,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true
    }
  });

  logger.info('Usuário criado', {
    currentUserId,
    newUserId: user.id,
    email: user.email,
    role: user.role,
    escritorioId
  });

  res.status(201).json({
    message: 'Usuário criado com sucesso',
    user
  });
}));

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', authMiddleware, requireEscritorio, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const currentUserId = req.user!.id;
  const currentUserRole = req.user!.role;
  const escritorioId = req.user!.escritorioId!;
  const { name, email, role, avatar }: Partial<UserData> = req.body;

  // Verificar se usuário existe e pertence ao escritório
  const targetUser = await prisma.user.findFirst({
    where: {
      id: userId,
      escritorioId
    }
  });

  if (!targetUser) {
    throw new NotFoundError('Usuário não encontrado');
  }

  // Verificar permissões
  const canEditOthers = ['ADMIN', 'OWNER', 'MANAGER'].includes(currentUserRole);
  const isEditingSelf = currentUserId === userId;

  if (!isEditingSelf && !canEditOthers) {
    throw new ValidationError('Sem permissão para editar outros usuários');
  }

  // Verificar se pode alterar role
  if (role && role !== targetUser.role) {
    if (!['ADMIN', 'OWNER'].includes(currentUserRole)) {
      throw new ValidationError('Sem permissão para alterar roles');
    }

    // OWNER não pode ser alterado por outros
    if (targetUser.role === 'OWNER' && currentUserRole !== 'ADMIN') {
      throw new ValidationError('Não é possível alterar role de OWNER');
    }

    const validRoles = ['USER', 'DESIGNER', 'ENGINEER', 'ARCHITECT', 'MANAGER', 'OWNER'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Role inválida');
    }
  }

  // Validar email se fornecido
  if (email && email !== targetUser.email) {
    if (!isValidEmail(email)) {
      throw new ValidationError('Email inválido');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ValidationError('Email já está em uso');
    }
  }

  // Atualizar usuário
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name: name.trim() }),
      ...(email && { email: email.toLowerCase().trim() }),
      ...(role && { role: role as any }),
      ...(avatar !== undefined && { avatar })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      lastLogin: true,
      createdAt: true
    }
  });

  // Invalidar cache do usuário
  await CacheService.invalidateUser(userId);

  logger.info('Usuário atualizado', {
    currentUserId,
    targetUserId: userId,
    changes: { name: !!name, email: !!email, role: !!role, avatar: avatar !== undefined }
  });

  res.json({
    message: 'Usuário atualizado com sucesso',
    user: updatedUser
  });
}));

// PUT /api/users/:id/status - Ativar/Desativar usuário
router.put('/:id/status', authMiddleware, requireEscritorio, requireRole('ADMIN', 'OWNER'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const currentUserId = req.user!.id;
  const escritorioId = req.user!.escritorioId!;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw new ValidationError('Status isActive deve ser boolean');
  }

  // Verificar se usuário existe
  const targetUser = await prisma.user.findFirst({
    where: {
      id: userId,
      escritorioId
    }
  });

  if (!targetUser) {
    throw new NotFoundError('Usuário não encontrado');
  }

  // Não permitir desativar a si mesmo
  if (currentUserId === userId && !isActive) {
    throw new ValidationError('Não é possível desativar sua própria conta');
  }

  // Não permitir desativar o último OWNER
  if (targetUser.role === 'OWNER' && !isActive) {
    const ownersCount = await prisma.user.count({
      where: {
        escritorioId,
        role: 'OWNER',
        isActive: true
      }
    });

    if (ownersCount <= 1) {
      throw new ValidationError('Não é possível desativar o último proprietário do escritório');
    }
  }

  // Atualizar status
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true
    }
  });

  // Se desativando, invalidar todas as sessões do usuário
  if (!isActive) {
    await Promise.all([
      prisma.userSession.deleteMany({ where: { userId } }),
      CacheService.invalidateUser(userId)
    ]);
  }

  logSecurity(`Usuário ${isActive ? 'ativado' : 'desativado'}`, {
    currentUserId,
    targetUserId: userId,
    isActive,
    targetUserEmail: targetUser.email
  });

  res.json({
    message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`,
    user: updatedUser
  });
}));

// POST /api/users/:id/reset-password - Resetar senha (apenas admins)
router.post('/:id/reset-password', authMiddleware, requireEscritorio, requireRole('ADMIN', 'OWNER'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const currentUserId = req.user!.id;
  const escritorioId = req.user!.escritorioId!;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ValidationError('Nova senha é obrigatória');
  }

  if (!isValidPassword(newPassword)) {
    throw new ValidationError('Senha deve ter pelo menos 8 caracteres, incluindo letras e números');
  }

  // Verificar se usuário existe
  const targetUser = await prisma.user.findFirst({
    where: {
      id: userId,
      escritorioId
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  if (!targetUser) {
    throw new NotFoundError('Usuário não encontrado');
  }

  // Hash da nova senha
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Atualizar senha e invalidar sessões
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    await tx.userSession.deleteMany({
      where: { userId }
    });
  });

  // Invalidar cache
  await CacheService.invalidateUser(userId);

  logSecurity('Senha resetada por admin', {
    currentUserId,
    targetUserId: userId,
    targetUserEmail: targetUser.email
  });

  res.json({
    message: 'Senha resetada com sucesso. O usuário deve fazer login novamente.'
  });
}));

// GET /api/users/stats - Estatísticas dos usuários do escritório
router.get('/stats/overview', authMiddleware, requireEscritorio, requireRole('ADMIN', 'OWNER', 'MANAGER'), asyncHandler(async (req: Request, res: Response) => {
  const escritorioId = req.user!.escritorioId!;
  const days = parseInt(req.query.days as string) || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Buscar estatísticas
  const [
    totalUsers,
    activeUsers,
    usersByRole,
    recentActivity,
    productivityStats
  ] = await Promise.all([
    // Total de usuários
    prisma.user.count({
      where: { escritorioId }
    }),

    // Usuários ativos
    prisma.user.count({
      where: {
        escritorioId,
        isActive: true
      }
    }),

    // Usuários por role
    prisma.user.groupBy({
      by: ['role'],
      where: { escritorioId },
      _count: true
    }),

    // Atividade recente
    prisma.user.count({
      where: {
        escritorioId,
        lastLogin: {
          gte: startDate
        }
      }
    }),

    // Estatísticas de produtividade
    prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        COUNT(DISTINCT pu.projeto_id) as projects_count,
        COUNT(DISTINCT a.id) as activities_count,
        COALESCE(SUM(c.duracao), 0) as total_time
      FROM users u
      LEFT JOIN projeto_users pu ON u.id = pu.user_id
      LEFT JOIN atividades a ON u.id = a.user_id AND a.created_at >= ${startDate}
      LEFT JOIN cronometros c ON a.id = c.atividade_id AND c.fim IS NOT NULL AND c.inicio >= ${startDate}
      WHERE u.escritorio_id = ${escritorioId} AND u.is_active = true
      GROUP BY u.id, u.name
      ORDER BY total_time DESC
      LIMIT 10
    `
  ]);

  res.json({
    period: {
      days,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString()
    },
    overview: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      recentlyActive: recentActivity
    },
    usersByRole: usersByRole.map(item => ({
      role: item.role,
      count: item._count
    })),
    topPerformers: productivityStats
  });
}));

export default router; 