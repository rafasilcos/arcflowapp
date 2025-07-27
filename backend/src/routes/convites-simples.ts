import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../config/logger';

const router = Router();

// Declaração global para usuários simulados
declare global {
  var usuariosSimulados: any[];
}

// Armazenamento temporário de convites (em produção seria banco)
let convitesMemoria: any[] = [];

// Interface para convite
interface ConviteSimples {
  id: string;
  email: string;
  nome: string;
  cargo: string;
  role: string;
  status: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  enviadoPor: string;
  escritorioId: string;
  mensagemPersonalizada?: string;
}

// POST /api/convites - Enviar convite
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { email, nome, cargo, role, mensagemPersonalizada } = req.body;
    const userId = req.user?.id;
    const escritorioId = req.user?.escritorioId;

    if (!email || !nome || !cargo || !role) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: email, nome, cargo, role' 
      });
    }

    // Verificar se já existe convite pendente
    const conviteExistente = convitesMemoria.find(c => 
      c.email === email && 
      c.escritorioId === escritorioId && 
      c.status === 'PENDENTE'
    );

    if (conviteExistente) {
      return res.status(400).json({ 
        error: 'Já existe um convite pendente para este email' 
      });
    }

    // Criar convite
    const convite: ConviteSimples = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      nome,
      cargo,
      role,
      status: 'PENDENTE',
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      enviadoPor: req.user?.nome || 'Usuário',
      escritorioId: escritorioId || '',
      mensagemPersonalizada
    };

    convitesMemoria.push(convite);

    // Link de convite
    const linkConvite = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/convite/${convite.token}`;

    logger.info('Convite criado', { conviteId: convite.id, email, nome });

    res.status(201).json({
      message: 'Convite criado com sucesso!',
      convite: {
        id: convite.id,
        email: convite.email,
        nome: convite.nome,
        cargo: convite.cargo,
        role: convite.role,
        status: convite.status,
        createdAt: convite.createdAt,
        expiresAt: convite.expiresAt,
        linkConvite,
        emailEnviado: false // Em desenvolvimento não envia email
      }
    });

  } catch (error) {
    logger.error('Erro ao criar convite', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites - Listar convites
router.get('/', authMiddleware, async (req, res) => {
  try {
    const escritorioId = req.user?.escritorioId;
    
    const convites = convitesMemoria.filter(c => 
      c.escritorioId === escritorioId
    );

    res.json({ convites });

  } catch (error) {
    logger.error('Erro ao listar convites', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/convites/:id - Cancelar convite
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user?.escritorioId;

    const index = convitesMemoria.findIndex(c => 
      c.id === id && c.escritorioId === escritorioId
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    convitesMemoria[index].status = 'CANCELADO';

    logger.info('Convite cancelado', { conviteId: id });

    res.json({ message: 'Convite cancelado com sucesso' });

  } catch (error) {
    logger.error('Erro ao cancelar convite', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites/stats - Estatísticas de convites
router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    const escritorioId = req.user?.escritorioId;
    
    const convites = convitesMemoria.filter(c => 
      c.escritorioId === escritorioId
    );

    const stats = {
      total: convites.length,
      pendentes: convites.filter(c => c.status === 'PENDENTE').length,
      aceitos: convites.filter(c => c.status === 'ACEITO').length,
      cancelados: convites.filter(c => c.status === 'CANCELADO').length,
      expirados: convites.filter(c => c.status === 'EXPIRADO').length
    };

    res.json(stats);

  } catch (error) {
    logger.error('Erro ao obter estatísticas', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites/:token - Verificar convite por token (para página de aceite)
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const convite = convitesMemoria.find(c => c.token === token);

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    if (convite.status !== 'PENDENTE') {
      return res.status(400).json({ 
        error: 'Este convite já foi processado',
        status: convite.status 
      });
    }

    if (new Date() > convite.expiresAt) {
      // Marcar como expirado
      convite.status = 'EXPIRADO';
      return res.status(400).json({ 
        error: 'Este convite expirou',
        status: 'EXPIRADO' 
      });
    }

    res.json({
      convite: {
        id: convite.id,
        email: convite.email,
        nome: convite.nome,
        cargo: convite.cargo,
        role: convite.role,
        escritorio: {
          nome: 'Escritório Teste' // Hardcoded para teste
        },
        enviadoPor: {
          nome: convite.enviadoPor
        },
        mensagemPersonalizada: convite.mensagemPersonalizada,
        createdAt: convite.createdAt,
        expiresAt: convite.expiresAt
      }
    });

  } catch (error) {
    logger.error('Erro ao verificar convite', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/convites/:token/aceitar - Aceitar convite
router.post('/:token/aceitar', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmarPassword } = req.body;

    if (!password || !confirmarPassword) {
      return res.status(400).json({ 
        error: 'Senha e confirmação são obrigatórias' 
      });
    }

    if (password !== confirmarPassword) {
      return res.status(400).json({ 
        error: 'Senhas não coincidem' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Senha deve ter pelo menos 6 caracteres' 
      });
    }

    const convite = convitesMemoria.find(c => c.token === token);

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    if (convite.status !== 'PENDENTE') {
      return res.status(400).json({ 
        error: 'Este convite já foi processado' 
      });
    }

    if (new Date() > convite.expiresAt) {
      return res.status(400).json({ 
        error: 'Este convite expirou' 
      });
    }

    // Marcar convite como aceito
    convite.status = 'ACEITO';
    convite.aceitoEm = new Date();

    // Simular criação de usuário (em produção seria no banco)
    const novoUsuario = {
      id: `user_${Date.now()}`,
      nome: convite.nome,
      email: convite.email,
      cargo: convite.cargo,
      role: convite.role,
      escritorioId: convite.escritorioId,
      status: 'ATIVO',
      isActive: true,
      createdAt: new Date(),
      ultimoLogin: new Date()
    };

    // Adicionar usuário à lista de usuários para aparecer no /api/users
    // (Em produção isso seria salvo no banco)
    global.usuariosSimulados = global.usuariosSimulados || [];
    global.usuariosSimulados.push(novoUsuario);

    // Gerar token JWT simples
    const jwtToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    logger.info('Convite aceito', { 
      conviteId: convite.id, 
      email: convite.email,
      nome: convite.nome 
    });

    res.status(201).json({
      message: 'Convite aceito com sucesso! Bem-vindo(a) à equipe!',
      user: novoUsuario,
      tokens: {
        accessToken: jwtToken,
        refreshToken: `refresh_${jwtToken}`
      }
    });

  } catch (error) {
    logger.error('Erro ao aceitar convite', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router; 