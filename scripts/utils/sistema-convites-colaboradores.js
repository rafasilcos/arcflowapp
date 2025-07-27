// ===== SISTEMA DE CONVITES PARA COLABORADORES =====
// Sistema completo para convidar e gerenciar colaboradores no escritório

const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// ===== MIDDLEWARE PARA CONVITES =====

// Configuração do email (usar suas credenciais SMTP)
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'seu-email@gmail.com',
    pass: process.env.SMTP_PASS || 'sua-senha-app'
  }
};

const transporter = nodemailer.createTransporter(emailConfig);

// ===== ROTAS DO SISTEMA DE CONVITES =====

const router = express.Router();

// POST /api/convites - Enviar convite para colaborador
router.post('/convites', async (req, res) => {
  try {
    const { 
      email, 
      nome, 
      cargo, 
      role = 'USER',
      permissoes = ['READ'],
      mensagemPersonalizada 
    } = req.body;
    
    const escritorioId = req.user.escritorioId;
    const remetenteId = req.user.id;
    const remetente = req.user.nome;

    // Validações
    if (!email || !nome) {
      return res.status(400).json({
        error: 'Email e nome são obrigatórios',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Verificar se usuário já existe no sistema
    const usuarioExistente = await client.query(`
      SELECT id, escritorio_id FROM users WHERE email = $1
    `, [email]);

    if (usuarioExistente.rows.length > 0) {
      const usuario = usuarioExistente.rows[0];
      if (usuario.escritorio_id === escritorioId) {
        return res.status(409).json({
          error: 'Usuário já faz parte deste escritório',
          code: 'USER_ALREADY_IN_OFFICE'
        });
      } else {
        return res.status(409).json({
          error: 'Usuário já possui conta em outro escritório',
          code: 'USER_HAS_ACCOUNT'
        });
      }
    }

    // Verificar se já existe convite pendente
    const convitePendente = await client.query(`
      SELECT id FROM convites 
      WHERE email = $1 AND escritorio_id = $2 AND status = 'PENDENTE'
    `, [email, escritorioId]);

    if (convitePendente.rows.length > 0) {
      return res.status(409).json({
        error: 'Já existe um convite pendente para este email',
        code: 'INVITE_ALREADY_EXISTS'
      });
    }

    // Gerar token único para o convite
    const token = crypto.randomBytes(32).toString('hex');
    const conviteId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // Salvar convite no banco
    await client.query(`
      INSERT INTO convites (
        id, email, nome, cargo, role, permissoes, token, 
        expires_at, escritorio_id, enviado_por, mensagem_personalizada,
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
      conviteId, email, nome, cargo, role, JSON.stringify(permissoes),
      token, expiresAt, escritorioId, remetenteId, mensagemPersonalizada,
      'PENDENTE', new Date()
    ]);

    // Buscar dados do escritório
    const escritorio = await client.query(`
      SELECT nome, email FROM escritorios WHERE id = $1
    `, [escritorioId]);

    const escritorioNome = escritorio.rows[0]?.nome || 'Escritório';

    // Enviar email de convite
    const linkConvite = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/convite/${token}`;
    
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite - ${escritorioNome}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Você foi convidado!</h1>
            <p>Junte-se ao ${escritorioNome}</p>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p><strong>${remetente}</strong> convidou você para fazer parte da equipe do <strong>${escritorioNome}</strong> no ArcFlow.</p>
            
            <h3>📋 Detalhes do convite:</h3>
            <ul>
              <li><strong>Cargo:</strong> ${cargo}</li>
              <li><strong>Função:</strong> ${role}</li>
              <li><strong>Escritório:</strong> ${escritorioNome}</li>
            </ul>

            ${mensagemPersonalizada ? `
              <h3>💬 Mensagem pessoal:</h3>
              <p style="background: #e8f4fd; padding: 15px; border-radius: 5px; font-style: italic;">
                "${mensagemPersonalizada}"
              </p>
            ` : ''}

            <h3>🚀 O que você pode fazer no ArcFlow:</h3>
            <ul>
              <li>Gerenciar projetos de arquitetura e engenharia</li>
              <li>Colaborar em tempo real com a equipe</li>
              <li>Acompanhar cronômetros e produtividade</li>
              <li>Organizar briefings e documentos</li>
              <li>Muito mais!</li>
            </ul>

            <div style="text-align: center;">
              <a href="${linkConvite}" class="button">
                ✅ Aceitar Convite
              </a>
            </div>

            <p><strong>⏰ Este convite expira em 7 dias.</strong></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p>Se você não conseguir clicar no botão, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${linkConvite}
            </p>
          </div>
          <div class="footer">
            <p>© 2024 ArcFlow - Sistema de Gestão para Escritórios de Arquitetura e Engenharia</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${escritorioNome}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🎉 Convite para ${escritorioNome} - ArcFlow`,
      html: emailHTML
    });

    console.log('✅ Convite enviado:', email, conviteId);

    res.status(201).json({
      message: 'Convite enviado com sucesso',
      convite: {
        id: conviteId,
        email,
        nome,
        cargo,
        status: 'PENDENTE',
        expiresAt
      }
    });

  } catch (error) {
    console.error('❌ Erro ao enviar convite:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// GET /api/convites - Listar convites do escritório
router.get('/convites', async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;
    const { status, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE escritorio_id = $1';
    let params = [escritorioId];

    if (status) {
      whereClause += ' AND status = $2';
      params.push(status.toUpperCase());
    }

    const offset = (page - 1) * limit;

    const convites = await client.query(`
      SELECT 
        c.*,
        u.nome as enviado_por_nome
      FROM convites c
      LEFT JOIN users u ON c.enviado_por = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, limit, offset]);

    const total = await client.query(`
      SELECT COUNT(*) FROM convites ${whereClause}
    `, params);

    res.json({
      convites: convites.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        pages: Math.ceil(total.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('❌ Erro ao listar convites:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites/:token - Verificar convite por token
router.get('/convites/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const convite = await client.query(`
      SELECT 
        c.*,
        e.nome as escritorio_nome,
        u.nome as enviado_por_nome
      FROM convites c
      JOIN escritorios e ON c.escritorio_id = e.id
      LEFT JOIN users u ON c.enviado_por = u.id
      WHERE c.token = $1
    `, [token]);

    if (convite.rows.length === 0) {
      return res.status(404).json({
        error: 'Convite não encontrado',
        code: 'INVITE_NOT_FOUND'
      });
    }

    const conviteData = convite.rows[0];

    // Verificar se convite expirou
    if (new Date() > new Date(conviteData.expires_at)) {
      return res.status(410).json({
        error: 'Convite expirado',
        code: 'INVITE_EXPIRED'
      });
    }

    // Verificar se convite já foi usado
    if (conviteData.status !== 'PENDENTE') {
      return res.status(409).json({
        error: 'Convite já foi utilizado',
        code: 'INVITE_ALREADY_USED'
      });
    }

    res.json({
      convite: {
        id: conviteData.id,
        email: conviteData.email,
        nome: conviteData.nome,
        cargo: conviteData.cargo,
        role: conviteData.role,
        escritorioNome: conviteData.escritorio_nome,
        enviadoPor: conviteData.enviado_por_nome,
        mensagemPersonalizada: conviteData.mensagem_personalizada,
        expiresAt: conviteData.expires_at
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/convites/:token/aceitar - Aceitar convite
router.post('/convites/:token/aceitar', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        error: 'Senha deve ter pelo menos 6 caracteres',
        code: 'WEAK_PASSWORD'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Senhas não coincidem',
        code: 'PASSWORDS_DONT_MATCH'
      });
    }

    // Buscar convite
    const convite = await client.query(`
      SELECT * FROM convites WHERE token = $1
    `, [token]);

    if (convite.rows.length === 0) {
      return res.status(404).json({
        error: 'Convite não encontrado',
        code: 'INVITE_NOT_FOUND'
      });
    }

    const conviteData = convite.rows[0];

    // Verificações
    if (new Date() > new Date(conviteData.expires_at)) {
      return res.status(410).json({
        error: 'Convite expirado',
        code: 'INVITE_EXPIRED'
      });
    }

    if (conviteData.status !== 'PENDENTE') {
      return res.status(409).json({
        error: 'Convite já foi utilizado',
        code: 'INVITE_ALREADY_USED'
      });
    }

    // Verificar se email já tem conta
    const usuarioExistente = await client.query(`
      SELECT id FROM users WHERE email = $1
    `, [conviteData.email]);

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já possui conta no sistema',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Hash da senha
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário
    const userId = uuidv4();
    await client.query(`
      INSERT INTO users (
        id, email, password_hash, nome, role, escritorio_id, 
        email_verified, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      userId, conviteData.email, passwordHash, conviteData.nome,
      conviteData.role, conviteData.escritorio_id, true, new Date()
    ]);

    // Marcar convite como aceito
    await client.query(`
      UPDATE convites 
      SET status = 'ACEITO', aceito_em = $1, usuario_criado_id = $2
      WHERE id = $3
    `, [new Date(), userId, conviteData.id]);

    // Buscar usuário criado
    const novoUsuario = await client.query(`
      SELECT id, email, nome, role, escritorio_id FROM users WHERE id = $1
    `, [userId]);

    console.log('✅ Convite aceito:', conviteData.email, userId);

    res.status(201).json({
      message: 'Convite aceito com sucesso! Conta criada.',
      user: novoUsuario.rows[0],
      redirectTo: '/auth/login'
    });

  } catch (error) {
    console.error('❌ Erro ao aceitar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/convites/:id - Cancelar convite
router.delete('/convites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    const convite = await client.query(`
      SELECT * FROM convites WHERE id = $1 AND escritorio_id = $2
    `, [id, escritorioId]);

    if (convite.rows.length === 0) {
      return res.status(404).json({
        error: 'Convite não encontrado',
        code: 'INVITE_NOT_FOUND'
      });
    }

    await client.query(`
      UPDATE convites SET status = 'CANCELADO', cancelado_em = $1
      WHERE id = $2
    `, [new Date(), id]);

    console.log('✅ Convite cancelado:', id);

    res.json({
      message: 'Convite cancelado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao cancelar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== SCHEMA DO BANCO PARA CONVITES =====

const criarTabelaConvites = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS convites (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        nome TEXT NOT NULL,
        cargo TEXT,
        role TEXT NOT NULL DEFAULT 'USER',
        permissoes JSONB DEFAULT '["read"]',
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        escritorio_id TEXT NOT NULL REFERENCES escritorios(id),
        enviado_por TEXT NOT NULL REFERENCES users(id),
        mensagem_personalizada TEXT,
        status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'ACEITO', 'CANCELADO', 'EXPIRADO')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        aceito_em TIMESTAMP,
        cancelado_em TIMESTAMP,
        usuario_criado_id TEXT REFERENCES users(id)
      );

      CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token);
      CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email);
      CREATE INDEX IF NOT EXISTS idx_convites_escritorio ON convites(escritorio_id);
      CREATE INDEX IF NOT EXISTS idx_convites_status ON convites(status);
    `);
    console.log('✅ Tabela de convites criada/verificada');
  } catch (error) {
    console.error('❌ Erro ao criar tabela de convites:', error);
  }
};

module.exports = {
  router,
  criarTabelaConvites
}; 