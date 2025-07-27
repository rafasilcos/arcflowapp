import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Configuração do email
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'noreply@arcflow.com',
    pass: process.env.SMTP_PASS || 'sua-senha-app'
  }
};

const transporter = nodemailer.createTransporter(emailConfig);

// Modelo de convite - nova estrutura
interface ConviteData {
  email: string;
  nome: string;
  cargo: string;      // Formação profissional
  funcao: string;     // Papel na organização
  role: string;       // Permissões do sistema
  mensagemPersonalizada?: string;
}

// POST /api/convites - Enviar convite para colaborador
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { email, nome, cargo, funcao, role, mensagemPersonalizada }: ConviteData = req.body;
    const userId = (req as any).user.userId;
    const escritorioId = (req as any).user.escritorioId;

    // Validações
    if (!email || !nome || !cargo || !funcao || !role) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: email, nome, cargo, funcao, role' 
      });
    }

    // Verificar se o usuário já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'Este email já possui uma conta no sistema' 
      });
    }

    // Verificar se já existe convite pendente
    const conviteExistente = await prisma.convite.findFirst({
      where: {
        email,
        escritorioId,
        status: 'PENDENTE'
      }
    });

    if (conviteExistente) {
      return res.status(400).json({ 
        error: 'Já existe um convite pendente para este email' 
      });
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // Buscar dados do remetente
    const remetente = await prisma.user.findUnique({
      where: { id: userId },
      include: { escritorio: true }
    });

    // Criar convite no banco
    const convite = await prisma.convite.create({
      data: {
        email,
        nome,
        cargo,
        funcao,
        role,
        token,
        status: 'PENDENTE',
        expiresAt,
        mensagemPersonalizada,
        escritorioId,
        enviadoPorId: userId
      },
      include: {
        enviadoPor: true,
        escritorio: true
      }
    });

    // Preparar email
    const linkConvite = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/convite/${token}`;
    
    const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚀 ArcFlow</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Sistema de Gestão para Arquitetura e Engenharia</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Olá, ${nome}! 👋</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Você foi convidado(a) por <strong>${remetente?.nome}</strong> para fazer parte da equipe do 
          <strong>${remetente?.escritorio?.nome}</strong> no ArcFlow.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Detalhes do Convite:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Cargo:</strong> ${cargo}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Função:</strong> ${funcao}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Permissões:</strong> ${role}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Escritório:</strong> ${remetente?.escritorio?.nome}</p>
        </div>
        
        ${mensagemPersonalizada ? `
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <p style="margin: 0; color: #1976d2; font-style: italic;">"${mensagemPersonalizada}"</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${linkConvite}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            ✨ Aceitar Convite
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Este convite expira em 7 dias. Se você não solicitou este convite, pode ignorar este email.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; margin: 10px 0 0 0;">
            Link direto: <a href="${linkConvite}" style="color: #667eea;">${linkConvite}</a>
          </p>
        </div>
      </div>
    </div>
    `;

    // Enviar email (em produção)
    if (process.env.NODE_ENV === 'production') {
      try {
        await transporter.sendMail({
          from: `"${remetente?.escritorio?.nome}" <${emailConfig.auth.user}>`,
          to: email,
          subject: `🚀 Convite para ${remetente?.escritorio?.nome} - ArcFlow`,
          html: htmlEmail
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Não falha a operação se o email não for enviado
      }
    }

    res.status(201).json({
      message: 'Convite enviado com sucesso!',
      convite: {
        id: convite.id,
        email: convite.email,
        nome: convite.nome,
        cargo: convite.cargo,
        funcao: convite.funcao,
        role: convite.role,
        status: convite.status,
        createdAt: convite.createdAt,
        expiresAt: convite.expiresAt,
        linkConvite: process.env.NODE_ENV === 'development' ? linkConvite : undefined,
        emailEnviado: process.env.NODE_ENV === 'production'
      }
    });

  } catch (error) {
    console.error('Erro ao enviar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites - Listar convites do escritório
router.get('/', authMiddleware, async (req, res) => {
  try {
    const escritorioId = (req as any).user.escritorioId;

    const convites = await prisma.convite.findMany({
      where: { escritorioId },
      include: {
        enviadoPor: {
          select: { nome: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ convites });

  } catch (error) {
    console.error('Erro ao buscar convites:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites/:token - Verificar convite por token
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const convite = await prisma.convite.findUnique({
      where: { token },
      include: {
        escritorio: {
          select: { nome: true, email: true }
        },
        enviadoPor: {
          select: { nome: true, email: true }
        }
      }
    });

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
      await prisma.convite.update({
        where: { id: convite.id },
        data: { status: 'EXPIRADO' }
      });

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
        escritorio: convite.escritorio,
        enviadoPor: convite.enviadoPor,
        mensagemPersonalizada: convite.mensagemPersonalizada,
        createdAt: convite.createdAt,
        expiresAt: convite.expiresAt
      }
    });

  } catch (error) {
    console.error('Erro ao verificar convite:', error);
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

    const convite = await prisma.convite.findUnique({
      where: { token },
      include: { escritorio: true }
    });

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

    // Verificar se o email já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email: convite.email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'Este email já possui uma conta no sistema' 
      });
    }

    // Hash da senha
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const novoUsuario = await prisma.user.create({
      data: {
        nome: convite.nome,
        email: convite.email,
        password: hashedPassword,
        cargo: convite.cargo,
        role: convite.role,
        escritorioId: convite.escritorioId,
        status: 'ATIVO'
      }
    });

    // Marcar convite como aceito
    await prisma.convite.update({
      where: { id: convite.id },
      data: { 
        status: 'ACEITO',
        aceitoEm: new Date(),
        usuarioId: novoUsuario.id
      }
    });

    // Gerar token JWT
    const jwtToken = jwt.sign(
      { 
        userId: novoUsuario.id, 
        escritorioId: novoUsuario.escritorioId,
        role: novoUsuario.role 
      },
      process.env.JWT_SECRET || 'arcflow-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Convite aceito com sucesso! Bem-vindo(a) à equipe!',
      user: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cargo: novoUsuario.cargo,
        role: novoUsuario.role,
        escritorio: convite.escritorio
      },
      token: jwtToken
    });

  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/convites/:id - Cancelar convite
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = (req as any).user.escritorioId;

    const convite = await prisma.convite.findFirst({
      where: { 
        id: parseInt(id),
        escritorioId 
      }
    });

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    if (convite.status !== 'PENDENTE') {
      return res.status(400).json({ 
        error: 'Só é possível cancelar convites pendentes' 
      });
    }

    await prisma.convite.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELADO' }
    });

    res.json({ message: 'Convite cancelado com sucesso' });

  } catch (error) {
    console.error('Erro ao cancelar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites/estatisticas - Estatísticas de convites
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const escritorioId = (req as any).user.escritorioId;

    const stats = await prisma.convite.groupBy({
      by: ['status'],
      where: { escritorioId },
      _count: { status: true }
    });

    const totalUsuarios = await prisma.user.count({
      where: { escritorioId }
    });

    const estatisticas = {
      totalUsuarios,
      convites: {
        pendentes: stats.find(s => s.status === 'PENDENTE')?._count.status || 0,
        aceitos: stats.find(s => s.status === 'ACEITO')?._count.status || 0,
        cancelados: stats.find(s => s.status === 'CANCELADO')?._count.status || 0,
        expirados: stats.find(s => s.status === 'EXPIRADO')?._count.status || 0,
      }
    };

    res.json({ estatisticas });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router; 