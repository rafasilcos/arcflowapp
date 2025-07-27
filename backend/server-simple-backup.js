const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('pg');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

// JWT Config
const JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024';
const JWT_REFRESH_SECRET = 'arcflow-super-secret-refresh-jwt-key-development-2024';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Email Config
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'noreply@arcflow.com',
    pass: process.env.SMTP_PASS || 'sua-senha-app'
  }
};

// Configurar transporter de email
let emailTransporter = null;
try {
  emailTransporter = nodemailer.createTransport(EMAIL_CONFIG);
  console.log('📧 Sistema de email configurado');
} catch (error) {
  console.warn('⚠️ Sistema de email não configurado:', error.message);
}

// Connect to database
client.connect()
  .then(() => console.log('✅ Conectado ao Supabase'))
  .catch(err => console.error('❌ Erro na conexão:', err));

// Utility functions
const generateTokens = (user) => {
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
  });

  const refreshToken = jwt.sign(
    { userId: user.id }, 
    JWT_REFRESH_SECRET, 
    { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'arcflow-api',
      audience: 'arcflow-client'
    }
  );

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (token, userId) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await client.query(`
    INSERT INTO refresh_tokens (id, token, user_id, expires_at)
    VALUES ($1, $2, $3, $4)
  `, [uuidv4(), token, userId, expiresAt]);
};

// Função para enviar email de convite
const enviarEmailConvite = async (dadosConvite) => {
  if (!emailTransporter) {
    console.warn('⚠️ Sistema de email não configurado - email não enviado');
    return false;
  }

  const { email, nome, cargo, role, linkConvite, remetente, escritorio, mensagemPersonalizada } = dadosConvite;

  const htmlEmail = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convite ArcFlow</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; color: #333; margin-bottom: 20px; font-weight: bold; }
        .message { color: #666; line-height: 1.8; margin-bottom: 25px; font-size: 16px; }
        .details-box { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea; }
        .details-box h3 { color: #333; margin: 0 0 15px 0; font-size: 18px; }
        .details-box p { margin: 8px 0; color: #666; font-size: 15px; }
        .personal-message { background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #2196f3; }
        .personal-message p { margin: 0; color: #1976d2; font-style: italic; font-size: 16px; }
        .cta-container { text-align: center; margin: 40px 0; }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 18px 40px; 
          text-decoration: none; 
          border-radius: 10px; 
          font-weight: bold; 
          font-size: 18px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s;
        }
        .cta-button:hover { transform: translateY(-2px); }
        .features { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0; }
        .features h3 { color: #333; margin: 0 0 15px 0; font-size: 18px; }
        .features ul { margin: 0; padding-left: 20px; color: #666; }
        .features li { margin: 8px 0; line-height: 1.6; }
        .footer { border-top: 1px solid #eee; padding: 25px 30px; text-align: center; }
        .footer p { color: #999; font-size: 13px; margin: 5px 0; }
        .link-backup { word-break: break-all; background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
        .link-backup a { color: #667eea; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 ArcFlow</h1>
          <p>Sistema de Gestão para Arquitetura e Engenharia</p>
        </div>
        
        <div class="content">
          <div class="greeting">Olá, ${nome}! 👋</div>
          
          <div class="message">
            Você foi convidado(a) por <strong>${remetente}</strong> para fazer parte da equipe do 
            <strong>${escritorio}</strong> no ArcFlow - o sistema mais avançado de gestão para escritórios de arquitetura e engenharia.
          </div>
          
          <div class="details-box">
            <h3>📋 Detalhes do Convite</h3>
            <p><strong>👤 Cargo:</strong> ${cargo}</p>
            <p><strong>🔧 Função:</strong> ${role}</p>
            <p><strong>🏢 Escritório:</strong> ${escritorio}</p>
            <p><strong>📅 Válido até:</strong> 7 dias a partir de hoje</p>
          </div>
          
          ${mensagemPersonalizada ? `
          <div class="personal-message">
            <p><strong>💬 Mensagem pessoal:</strong></p>
            <p>"${mensagemPersonalizada}"</p>
          </div>
          ` : ''}
          
          <div class="features">
            <h3>🌟 O que você pode fazer no ArcFlow:</h3>
            <ul>
              <li>📊 Gerenciar projetos de arquitetura e engenharia com eficiência</li>
              <li>👥 Colaborar em tempo real com sua equipe</li>
              <li>⏱️ Acompanhar cronômetros de produtividade</li>
              <li>📝 Organizar briefings estruturados e documentos</li>
              <li>💰 Controlar orçamentos e propostas comerciais</li>
              <li>📈 Analisar métricas de desempenho e rentabilidade</li>
              <li>🤖 Usar inteligência artificial para análises avançadas</li>
            </ul>
          </div>
          
          <div class="cta-container">
            <a href="${linkConvite}" class="cta-button">
              ✨ Aceitar Convite e Criar Conta
            </a>
          </div>
          
          <div class="link-backup">
            <p><strong>Não consegue clicar no botão?</strong> Copie e cole este link no seu navegador:</p>
            <a href="${linkConvite}">${linkConvite}</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>⚠️ Este convite expira em 7 dias.</strong></p>
          <p>Se você não solicitou este convite, pode ignorar este email com segurança.</p>
          <p>© 2024 ArcFlow - Sistema de Gestão para Escritórios de Arquitetura e Engenharia</p>
          <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await emailTransporter.sendMail({
      from: `"${escritorio} via ArcFlow" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: `🚀 Convite para ${escritorio} - ArcFlow`,
      html: htmlEmail
    });
    
    console.log('📧 Email de convite enviado para:', email);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    return false;
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ArcFlow Auth API'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      auth: 'active'
    }
  });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Buscar usuário
    const result = await client.query(`
      SELECT u.*, 
             e.nome as escritorio_nome, 
             e.cnpj as escritorio_cnpj,
             e.telefone as escritorio_telefone,
             e.email as escritorio_email,
             e.plan_id 
      FROM users u 
      JOIN escritorios e ON u.escritorio_id = e.id 
      WHERE u.email = $1 AND u.is_active = true AND e.is_active = true
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = result.rows[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Atualizar último login
    await client.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]);

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(user);
    await saveRefreshToken(refreshToken, user.id);

    console.log('✅ Login realizado:', user.email);

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
      escritorio: {
        id: user.escritorio_id,
        nome: user.escritorio_nome || 'Escritório ArcFlow',
        cnpj: user.escritorio_cnpj,
        telefone: user.escritorio_telefone,
        email: user.escritorio_email
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, password, escritorio, planId = 'plan_free' } = req.body;

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
    const existingUser = await client.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já está em uso',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Verificar se plano existe
    const planResult = await client.query(`SELECT id, name FROM plans WHERE id = $1 AND is_active = true`, [planId]);
    if (planResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Plano inválido',
        code: 'INVALID_PLAN'
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar escritório
    const escritorioId = uuidv4();
    await client.query(`
      INSERT INTO escritorios (id, nome, cnpj, email, telefone, endereco, cidade, estado, cep, plan_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      escritorioId, 
      escritorio.nome, 
      escritorio.cnpj || null, 
      escritorio.email, 
      escritorio.telefone || null, 
      escritorio.endereco || null, 
      escritorio.cidade || null, 
      escritorio.estado || null, 
      escritorio.cep || null, 
      planId
    ]);

    // Criar usuário OWNER
    const userId = uuidv4();
    await client.query(`
      INSERT INTO users (id, email, password_hash, nome, role, escritorio_id, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [userId, email, passwordHash, nome, 'OWNER', escritorioId, true]);

    // Buscar usuário criado
    const newUserResult = await client.query(`
      SELECT id, email, nome, role, escritorio_id FROM users WHERE id = $1
    `, [userId]);

    const newUser = newUserResult.rows[0];

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(newUser);
    await saveRefreshToken(refreshToken, userId);

    console.log('✅ Registro completo:', email, escritorioId);

    res.status(201).json({
      message: 'Registro realizado com sucesso',
      user: {
        id: newUser.id,
        email: newUser.email,
        nome: newUser.nome,
        role: newUser.role,
        escritorioId: newUser.escritorio_id
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

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// GET /api/auth/me - Obter dados do usuário atual
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de acesso é obrigatório',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar dados atualizados do usuário
    const userResult = await client.query(`
      SELECT u.id, u.email, u.nome, u.role, u.escritorio_id, u.is_active, u.created_at, u.updated_at,
             e.nome as escritorio_nome, e.cnpj as escritorio_cnpj, 
             e.telefone as escritorio_telefone, e.email as escritorio_email
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.id = $1
    `, [decoded.id]);

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
      role: user.role,
      escritorio_id: user.escritorio_id,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    const escritorio = {
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

  } catch (error) {
    console.error('❌ Erro ao buscar dados do usuário:', error);
    res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
});

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.id,
      email: decoded.email,
      nome: decoded.nome,
      role: decoded.role,
      escritorioId: decoded.escritorioId
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// ===== ROTAS DE CONVITES =====

// POST /api/convites - Enviar convite para colaborador
app.post('/api/convites', authenticateToken, async (req, res) => {
  try {
    const { email, nome, cargo, role, mensagemPersonalizada } = req.body;
    const userId = req.user.userId;
    const escritorioId = req.user.escritorioId;

    // Validações
    if (!email || !nome || !cargo || !role) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: email, nome, cargo, role' 
      });
    }

    // Verificar se o usuário já existe
    const usuarioExistente = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Este email já possui uma conta no sistema' 
      });
    }

    // Gerar token único
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // Buscar dados do remetente
    const remetente = await client.query(`
      SELECT u.nome, u.email, e.nome as escritorio_nome 
      FROM users u 
      JOIN escritorios e ON u.escritorio_id = e.id 
      WHERE u.id = $1
    `, [userId]);

    const dadosRemetente = remetente.rows[0];

    // Simular criação do convite (por enquanto só em memória)
    const convite = {
      id: Date.now(),
      email,
      nome,
      cargo,
      role,
      token,
      status: 'PENDENTE',
      expiresAt,
      mensagemPersonalizada,
      escritorioId,
      enviadoPorId: userId,
      createdAt: new Date(),
      enviadoPor: dadosRemetente
    };

    // Preparar link do convite
    const linkConvite = `http://localhost:3000/convite/${token}`;
    
    // Salvar convite em memória global (temporário)
    global.convites = global.convites || [];
    global.convites.push(convite);

    // Enviar email de convite
    const emailEnviado = await enviarEmailConvite({
      email,
      nome,
      cargo,
      role,
      linkConvite,
      remetente: dadosRemetente.nome,
      escritorio: dadosRemetente.escritorio_nome,
      mensagemPersonalizada
    });

    console.log('📧 CONVITE CRIADO:');
    console.log('Para:', email);
    console.log('Link:', linkConvite);
    console.log('Token:', token);
    console.log('Email enviado:', emailEnviado ? '✅ Sim' : '❌ Não');

    res.status(201).json({
      message: emailEnviado ? 
        'Convite enviado com sucesso! Um email foi enviado para o destinatário.' : 
        'Convite criado com sucesso! Use o link abaixo para compartilhar.',
      convite: {
        id: convite.id,
        email: convite.email,
        nome: convite.nome,
        cargo: convite.cargo,
        role: convite.role,
        status: convite.status,
        createdAt: convite.createdAt,
        expiresAt: convite.expiresAt,
        linkConvite: linkConvite,
        token: token,
        emailEnviado: emailEnviado
      }
    });

  } catch (error) {
    console.error('Erro ao enviar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites - Listar convites do escritório
app.get('/api/convites', authenticateToken, async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;

    // Buscar convites da memória global (temporário)
    const convites = (global.convites || []).filter(c => c.escritorioId === escritorioId);

    res.json({ convites });

  } catch (error) {
    console.error('Erro ao buscar convites:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/convites/:token - Verificar convite por token
app.get('/api/convites/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar convite na memória global
    const convite = (global.convites || []).find(c => c.token === token);

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
        escritorio: { nome: convite.enviadoPor.escritorio_nome },
        enviadoPor: { nome: convite.enviadoPor.nome },
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
app.post('/api/convites/:token/aceitar', async (req, res) => {
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

    // Buscar convite
    const convite = (global.convites || []).find(c => c.token === token);

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
    const usuarioExistente = await client.query('SELECT id FROM users WHERE email = $1', [convite.email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Este email já possui uma conta no sistema' 
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário
    const userId = uuidv4();
    await client.query(`
      INSERT INTO users (id, email, password_hash, nome, role, escritorio_id, email_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [userId, convite.email, passwordHash, convite.nome, convite.role, convite.escritorioId, true, true]);

    // Marcar convite como aceito
    convite.status = 'ACEITO';
    convite.aceitoEm = new Date();
    convite.usuarioId = userId;

    // Buscar usuário criado
    const newUserResult = await client.query(`
      SELECT u.*, e.nome as escritorio_nome 
      FROM users u 
      JOIN escritorios e ON u.escritorio_id = e.id 
      WHERE u.id = $1
    `, [userId]);

    const newUser = newUserResult.rows[0];

    // Gerar token JWT
    const { accessToken, refreshToken } = generateTokens(newUser);
    await saveRefreshToken(refreshToken, userId);

    console.log('✅ Convite aceito:', convite.email);

    res.status(201).json({
      message: 'Convite aceito com sucesso! Bem-vindo(a) à equipe!',
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
        escritorioId: newUser.escritorio_id,
        escritorioNome: newUser.escritorio_nome
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      }
    });

  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/convites/:id - Cancelar convite
app.delete('/api/convites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    // Buscar convite na memória global
    const conviteIndex = (global.convites || []).findIndex(c => 
      c.id === parseInt(id) && c.escritorioId === escritorioId
    );

    if (conviteIndex === -1) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    const convite = global.convites[conviteIndex];

    if (convite.status !== 'PENDENTE') {
      return res.status(400).json({ 
        error: 'Só é possível cancelar convites pendentes' 
      });
    }

    // Marcar como cancelado
    convite.status = 'CANCELADO';

    console.log('✅ Convite cancelado:', id);

    res.json({ message: 'Convite cancelado com sucesso' });

  } catch (error) {
    console.error('Erro ao cancelar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/users - Listar usuários do escritório
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;

    const result = await client.query(`
      SELECT id, nome, email, role, created_at, last_login, is_active
      FROM users 
      WHERE escritorio_id = $1 AND is_active = true
      ORDER BY created_at ASC
    `, [escritorioId]);

    const users = result.rows.map(user => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.role, // Temporário
      role: user.role,
      status: user.is_active ? 'ATIVO' : 'INATIVO',
      ultimoLogin: user.last_login || user.created_at,
      createdAt: user.created_at
    }));

    res.json({ users });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE CLIENTES =====

// GET /api/clientes/lixeira - Listar clientes removidos
app.get('/api/clientes/lixeira', authenticateToken, async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;

    const result = await client.query(`
      SELECT 
        id, nome, email, telefone, "tipoPessoa", cpf, cnpj,
        endereco_cep, endereco_logradouro, endereco_numero, 
        endereco_complemento, endereco_bairro, endereco_cidade, 
        endereco_uf, endereco_pais, observacoes, status, 
        profissao, data_nascimento, data_fundacao,
        familia, origem, preferencias, historico_projetos,
        deleted_at, created_at, updated_at
      FROM clientes 
      WHERE escritorio_id = $1 AND is_active = false
      ORDER BY deleted_at DESC
    `, [escritorioId]);

    console.log(`✅ Lixeira consultada: ${result.rows.length} clientes removidos`);

    res.json({
      clientes: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Erro ao consultar lixeira:', error);
    res.status(500).json({ 
      error: 'Erro ao consultar lixeira',
      message: error.message 
    });
  }
});

// PUT /api/clientes/:id/restaurar - Restaurar cliente da lixeira
app.put('/api/clientes/:id/restaurar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    // Verificar se cliente existe na lixeira
    const existingClient = await client.query(`
      SELECT id FROM clientes 
      WHERE id = $1 AND escritorio_id = $2 AND is_active = false
    `, [id, escritorioId]);

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado na lixeira'
      });
    }

    // Restaurar cliente
    const result = await client.query(`
      UPDATE clientes 
      SET is_active = true, deleted_at = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    console.log('✅ Cliente restaurado:', id);

    res.json({
      message: 'Cliente restaurado com sucesso',
      cliente: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao restaurar cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao restaurar cliente',
      message: error.message 
    });
  }
});

// GET /api/clientes/:id - Obter cliente específico
app.get('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    const result = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND escritorio_id = $2 AND is_active = true
    `, [id, escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado'
      });
    }

    console.log('🔎 [DEBUG] Observacoes retornadas:', result.rows[0].observacoes);

    res.json({
      cliente: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar cliente',
      message: error.message 
    });
  }
});

// GET /api/clientes - Listar clientes
app.get('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const escritorioId = req.user.escritorioId;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE c.escritorio_id = $1 AND c.is_active = true';
    let queryParams = [escritorioId];

    if (search) {
      whereClause += ' AND (c.nome ILIKE $2 OR c.email ILIKE $2 OR c.telefone ILIKE $2)';
      queryParams.push(`%${search}%`);
    }

    if (status) {
      const statusIndex = queryParams.length + 1;
      whereClause += ` AND c.status = $${statusIndex}`;
      queryParams.push(status);
    }

    // Contar total
    const countResult = await client.query(`
      SELECT COUNT(*) as total FROM clientes c ${whereClause}
    `, queryParams);

    // Buscar clientes
    const result = await client.query(`
      SELECT c.* FROM clientes c 
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, Number(limit), offset]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      clientes: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    res.status(500).json({ 
      error: 'Erro ao carregar clientes',
      message: error.message 
    });
  }
});

// POST /api/clientes - Criar novo cliente
app.post('/api/clientes', authenticateToken, async (req, res) => {
  try {
      const { 
    nome, 
    email, 
    telefone, 
    tipoPessoa = 'fisica', 
    cpf, 
    cnpj, 
    endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_uf, endereco_pais,
    observacoes,
    status = 'ativo',
    profissao,
    dataNascimento,
    dataFundacao,
    familia,
    origem,
    preferencias,
    historicoProjetos
  } = req.body;
    
    const escritorioId = req.user.escritorioId;

    // Validações
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        error: 'Nome, email e telefone são obrigatórios'
      });
    }

    // Verificar se email já existe no escritório
    const emailCheck = await client.query(`
      SELECT id FROM clientes 
      WHERE email = $1 AND escritorio_id = $2 AND is_active = true
    `, [email.toLowerCase().trim(), escritorioId]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado neste escritório'
      });
    }

    const clienteId = uuidv4();
    
    await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, cpf, cnpj,
        endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
        endereco_bairro, endereco_cidade, endereco_uf, endereco_pais,
        observacoes, escritorio_id, tipo_pessoa, status, profissao, data_nascimento, data_fundacao, familia, origem, preferencias, historico_projetos
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      )
    `, [
      clienteId,
      nome.trim(),
      email.toLowerCase().trim(),
      telefone.trim(),
      cpf?.trim() || null,
      cnpj?.trim() || null,
      endereco_cep || null,
      endereco_logradouro || null,
      endereco_numero || null,
      endereco_complemento || null,
      endereco_bairro || null,
      endereco_cidade || null,
      endereco_uf || null,
      endereco_pais || 'Brasil',
      observacoes?.trim() || '',
      escritorioId,
      tipoPessoa,
      status,
      profissao?.trim() || null,
      converterDataBrasileiraParaSQL(dataNascimento),
      converterDataBrasileiraParaSQL(dataFundacao),
      JSON.stringify(familia || {}),
      JSON.stringify(origem || {}),
      JSON.stringify(preferencias || {}),
      JSON.stringify(historicoProjetos || [])
    ]);

    // Buscar cliente criado
    const clienteCriado = await client.query(`
      SELECT * FROM clientes WHERE id = $1
    `, [clienteId]);

    console.log('✅ Cliente criado:', nome, clienteId);

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: clienteCriado.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao criar cliente',
      message: error.message 
    });
  }
});

// Função para converter data brasileira DD/MM/YYYY para YYYY-MM-DD
const converterDataBrasileiraParaSQL = (dataBrasileira) => {
  if (!dataBrasileira || dataBrasileira.trim() === '') {
    console.log('🔄 [DEBUG] Data vazia, retornando null');
    return null;
  }
  
  console.log('🔄 [DEBUG] Convertendo data:', dataBrasileira);
  
  const partes = dataBrasileira.split('/');
  if (partes.length !== 3) {
    console.log('❌ [DEBUG] Data inválida - não tem 3 partes:', partes);
    return null;
  }
  
  const [dia, mes, ano] = partes;
  
  // Validar se são números válidos
  const diaNum = parseInt(dia, 10);
  const mesNum = parseInt(mes, 10);
  const anoNum = parseInt(ano, 10);
  
  if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) {
    console.log('❌ [DEBUG] Data inválida - valores não numéricos:', { dia, mes, ano });
    return null;
  }
  
  // Validar rangos
  if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 1900 || anoNum > 2100) {
    console.log('❌ [DEBUG] Data inválida - fora dos rangos:', { diaNum, mesNum, anoNum });
    return null;
  }
  
  // Retornar no formato YYYY-MM-DD
  const dataSQL = `${anoNum}-${mesNum.toString().padStart(2, '0')}-${diaNum.toString().padStart(2, '0')}`;
  console.log('✅ [DEBUG] Data convertida:', dataBrasileira, '->', dataSQL);
  return dataSQL;
};

// PUT /api/clientes/:id - Atualizar cliente
app.put('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const escritorioId = req.user.escritorioId;

    // Verificar se cliente existe
    const existingClient = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND escritorio_id = $2 AND is_active = true
    `, [id, escritorioId]);

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado'
      });
    }

    // Verificar email único (se alterado)
    if (updateData.email) {
      const emailCheck = await client.query(`
        SELECT id FROM clientes 
        WHERE email = $1 AND escritorio_id = $2 AND id != $3 AND is_active = true
      `, [updateData.email.toLowerCase().trim(), escritorioId, id]);

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          error: 'Email já cadastrado em outro cliente'
        });
      }
    }

    // Atualizar cliente
    const result = await client.query(`
      UPDATE clientes 
      SET 
        nome = COALESCE($1, nome),
        email = COALESCE($2, email),
        telefone = COALESCE($3, telefone),
        cpf = COALESCE($4, cpf),
        cnpj = COALESCE($5, cnpj),
        endereco_cep = COALESCE($6, endereco_cep),
        endereco_logradouro = COALESCE($7, endereco_logradouro),
        endereco_numero = COALESCE($8, endereco_numero),
        endereco_complemento = COALESCE($9, endereco_complemento),
        endereco_bairro = COALESCE($10, endereco_bairro),
        endereco_cidade = COALESCE($11, endereco_cidade),
        endereco_uf = COALESCE($12, endereco_uf),
        endereco_pais = COALESCE($13, endereco_pais),
        observacoes = COALESCE($14, observacoes),
        status = COALESCE($15, status),
        profissao = COALESCE($16, profissao),
        data_nascimento = COALESCE($17, data_nascimento),
        data_fundacao = COALESCE($18, data_fundacao),
        familia = COALESCE($19, familia),
        origem = COALESCE($20, origem),
        preferencias = COALESCE($21, preferencias),
        historico_projetos = COALESCE($22, historico_projetos),
        updated_at = NOW()
      WHERE id = $23
      RETURNING *
    `, [
      updateData.nome?.trim(),
      updateData.email?.toLowerCase().trim(),
      updateData.telefone?.trim(),
      updateData.cpf?.trim(),
      updateData.cnpj?.trim(),
      updateData.endereco_cep || null,
      updateData.endereco_logradouro || null,
      updateData.endereco_numero || null,
      updateData.endereco_complemento || null,
      updateData.endereco_bairro || null,
      updateData.endereco_cidade || null,
      updateData.endereco_uf || null,
      updateData.endereco_pais || 'Brasil',
      updateData.observacoes?.trim() || '',
      updateData.status,
      updateData.profissao?.trim() || null,
      converterDataBrasileiraParaSQL(updateData.dataNascimento),
      converterDataBrasileiraParaSQL(updateData.dataFundacao),
      updateData.familia ? JSON.stringify(updateData.familia) : null,
      updateData.origem ? JSON.stringify(updateData.origem) : null,
      updateData.preferencias ? JSON.stringify(updateData.preferencias) : null,
      updateData.historicoProjetos ? JSON.stringify(updateData.historicoProjetos) : null,
      id
    ]);

    console.log('✅ Cliente atualizado:', id);

    res.json({
      message: 'Cliente atualizado com sucesso',
      cliente: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar cliente',
      message: error.message 
    });
  }
});

// DELETE /api/clientes/:id - Deletar cliente (soft delete)
app.delete('/api/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    // Verificar se cliente existe
    const existingClient = await client.query(`
      SELECT id FROM clientes 
      WHERE id = $1 AND escritorio_id = $2 AND is_active = true
    `, [id, escritorioId]);

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado'
      });
    }

    // Soft delete
    await client.query(`
      UPDATE clientes 
      SET is_active = false, deleted_at = NOW()
      WHERE id = $1
    `, [id]);

    console.log('✅ Cliente deletado:', id);

    res.json({
      message: 'Cliente deletado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao deletar cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar cliente',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ArcFlow Server rodando na porta ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Convites: http://localhost:${PORT}/api/convites`);
  console.log(`👤 Usuários: http://localhost:${PORT}/api/users`);
  console.log(`👥 Clientes: http://localhost:${PORT}/api/clientes`);
  console.log(`🗑️ Lixeira: http://localhost:${PORT}/api/clientes/lixeira`);
}); 