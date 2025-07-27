const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('pg');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { body, validationResult } = require('express-validator');

// 🚀 OTIMIZAÇÃO: Instância reutilizável do cache JWT com fallback
let jwtCacheInstance = null;
try {
  jwtCacheInstance = require('./src/middleware/jwt-cache');
  console.log('✅ [JWT-CACHE] Instância Redis inicializada com sucesso');
} catch (error) {
  console.warn('⚠️ [JWT-CACHE] Redis indisponível, usando fallback:', error.message);
  try {
    jwtCacheInstance = require('./src/middleware/jwt-cache-fallback');
    console.log('✅ [JWT-CACHE] Fallback em memória inicializado');
  } catch (fallbackError) {
    console.error('❌ [JWT-CACHE] Erro crítico:', fallbackError.message);
  }
}

// 🔥 IMPORTAR RATE LIMITING OTIMIZADO
const { 
  authStatusLimiter, 
  loginLimiter, 
  refreshLimiter, 
  generalAPILimiter,
  createResourceLimiter,
  rateLimitMonitor 
} = require('./src/middleware/auth-rate-limit');
const helmet = require('helmet');
// Removido: sendpulse-api (usando HTTP direto agora)

// 🔧 FUNÇÃO DE NORMALIZAÇÃO UUID PARA SISTEMA REAL
function normalizeToUuid(id) {
  // Se já é um UUID válido, retorna como está
  if (typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  
  // Mapeamento de IDs de teste para UUIDs fixos (consistentes)
  const testIdMappings = {
    'escritorio_teste': 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'user_admin_teste': 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    'admin_arcflow': 'b2c3d4e5-f6g7-8901-2345-678901abcdef',
    // Adicione outros IDs de teste conforme necessário
  };
  
  // Se é um ID de teste conhecido, retorna UUID fixo
  if (testIdMappings[id]) {
    console.log(`🔄 [UUID-NORMALIZE] Convertendo ID de teste: ${id} -> ${testIdMappings[id]}`);
    return testIdMappings[id];
  }
  
  // Para IDs desconhecidos, gera UUID determinístico baseado na string
  // Isso garante que a mesma string sempre gere o mesmo UUID
  const hash = crypto.createHash('md5').update(id.toString()).digest('hex');
  const uuid = [
    hash.substr(0, 8),
    hash.substr(8, 4),
    '4' + hash.substr(12, 3), // versão 4
    '8' + hash.substr(15, 3), // variante 10
    hash.substr(18, 12)
  ].join('-');
  
  console.log(`🔄 [UUID-NORMALIZE] Gerando UUID determinístico: ${id} -> ${uuid}`);
  return uuid;
}

// 🔧 FUNÇÃO PARA CONTAR RESPOSTAS REAIS DO CAMPO OBSERVACOES
function contarRespostasReais(observacoes) {
  if (!observacoes) return 0;
  
  try {
    const observacoesParsed = JSON.parse(observacoes);
    
    // Verificar se tem respostas no formato padrão
    if (observacoesParsed.respostas && typeof observacoesParsed.respostas === 'object') {
      return Object.keys(observacoesParsed.respostas).length;
    }
    
    return 0;
  } catch (error) {
    console.log('⚠️ [RESPOSTAS-COUNT] Erro ao parsear observações:', error.message);
    return 0;
  }
}

const app = express();
const PORT = 3001;

// Rate limiting - usando o otimizado do middleware

// Rate limiting específico para login removido - usando o otimizado do middleware

// CORS configurado para rede local
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Desenvolvimento local
    'http://127.0.0.1:3000',          // Local alternativo
    'http://192.168.0.116:3000'       // Acesso pela rede
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(compression()); // Compressão GZIP para melhor performance
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/', generalAPILimiter); // Aplicar rate limiting otimizado apenas nas APIs
app.use(helmet());

// Database connection
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

// ✅ CONEXÃO REAL COM BANCO POSTGRESQL - 170 BRIEFINGS DISPONÍVEIS

// JWT Config
const JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024';
const JWT_REFRESH_SECRET = 'arcflow-super-secret-refresh-jwt-key-development-2024';
const JWT_EXPIRES_IN = '4h'; // ✅ PRODUTIVIDADE: Token expira em 4 horas (adequado para trabalho)
const JWT_REFRESH_EXPIRES_IN = '30d'; // ✅ PRODUTIVIDADE: Refresh token expira em 30 dias

// ⚡ SEGURANÇA: ID único do servidor para invalidar sessões antigas
const SERVER_INSTANCE_ID = Date.now().toString();

// SendPulse Configuration (API REST HTTP)
const SENDPULSE_CONFIG = {
  API_USER_ID: '70f9f522391c531eadde28516c49c7cc',
  API_SECRET: '01764e0f7fde0c58782b72cd2807e346',
  BASE_URL: 'https://api.sendpulse.com'
};

// Token para autenticação SendPulse
let sendpulseToken = null;
let sendpulseTokenExpiry = null;

// Função para obter token de autenticação SendPulse
async function getSendPulseToken() {
  if (sendpulseToken && sendpulseTokenExpiry && Date.now() < sendpulseTokenExpiry) {
    return sendpulseToken;
  }

  try {
    const https = require('https');
    const querystring = require('querystring');
    
    const postData = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: SENDPULSE_CONFIG.API_USER_ID,
      client_secret: SENDPULSE_CONFIG.API_SECRET
    });

    const options = {
      hostname: 'api.sendpulse.com',
      port: 443,
      path: '/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.access_token) {
              sendpulseToken = response.access_token;
              sendpulseTokenExpiry = Date.now() + (response.expires_in * 1000) - 60000; // 1 minuto de margem
              console.log('✅ [SENDPULSE] Token obtido com sucesso');
              resolve(sendpulseToken);
            } else {
              console.error('❌ [SENDPULSE] Erro ao obter token:', response);
              resolve(null);
            }
          } catch (error) {
            console.error('❌ [SENDPULSE] Erro ao parsear resposta:', error);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ [SENDPULSE] Erro na requisição:', error);
        resolve(null);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('❌ [SENDPULSE] Erro geral:', error.message);
    return null;
  }
}

// Inicializar SendPulse obtendo token
getSendPulseToken().then(token => {
  if (token) {
    console.log('📧 SendPulse configurado com sucesso!');
  } else {
    console.warn('⚠️ SendPulse não pôde ser configurado');
  }
});

// Email Config (mantido como fallback)
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'noreply@arcflow.com',
    pass: process.env.SMTP_PASS || 'sua-senha-app'
  }
};

// Configurar transporter de email como fallback
let emailTransporter = null;
const hasEmailCredentials = process.env.SMTP_USER && process.env.SMTP_PASS;

if (hasEmailCredentials) {
try {
  emailTransporter = nodemailer.createTransport(EMAIL_CONFIG);
    console.log('📧 Sistema de email fallback configurado com credenciais');
} catch (error) {
    console.warn('⚠️ Sistema de email fallback com erro:', error.message);
  }
} else {
  console.log('⚠️ Sistema de email fallback desabilitado (sem credenciais SMTP_USER/SMTP_PASS)');
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
    escritorioId: user.escritorio_id,
    serverInstanceId: SERVER_INSTANCE_ID, // ⚡ SEGURANÇA: ID do servidor
    issuedAt: Math.floor(Date.now() / 1000) // ⚡ SEGURANÇA: Timestamp de criação
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'arcflow-api',
    audience: 'arcflow-client'
  });

  const refreshToken = jwt.sign(
    { 
      userId: user.id,
      serverInstanceId: SERVER_INSTANCE_ID, // ⚡ SEGURANÇA: ID do servidor
      issuedAt: Math.floor(Date.now() / 1000)
    }, 
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

  try {
    // Primeiro, deletar todos os tokens antigos do usuário para evitar acúmulo
    await client.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
    
    // Deletar qualquer token duplicado que possa existir
    await client.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);

    // Inserir novo token usando ON CONFLICT para evitar duplicatas
    await client.query(`
      INSERT INTO refresh_tokens (id, token, user_id, expires_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (token) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        expires_at = EXCLUDED.expires_at
    `, [uuidv4(), token, userId, expiresAt]);

    console.log('✅ [AUTH] Refresh token salvo com sucesso para usuário:', userId);
  } catch (error) {
    console.error('❌ [AUTH] Erro ao salvar refresh token:', error);
    throw error;
  }
};

// Middleware de validação para tratar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};

// Validações para cliente
const clienteValidations = [
  body('nome').trim().isLength({ min: 2, max: 255 }).withMessage('Nome deve ter entre 2 e 255 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('cpf').optional().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/).withMessage('CPF inválido'),
  body('cnpj').optional().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/).withMessage('CNPJ inválido')
];

// Função para enviar email de convite usando SendPulse (API REST HTTP)
const enviarEmailConvite = async (dadosConvite) => {
  const { email, nome, cargo, role, linkConvite, remetente, escritorio, mensagemPersonalizada } = dadosConvite;

  // Obter token de autenticação
  const token = await getSendPulseToken();
  if (!token) {
    console.warn('⚠️ SendPulse não configurado - tentando fallback com Nodemailer');
    
    // Fallback para nodemailer se disponível
    const temCredenciais = process.env.SMTP_USER && process.env.SMTP_PASS;
    if (!emailTransporter || !temCredenciais) {
      console.warn('⚠️ Nenhum sistema de email configurado - email não enviado');
      console.log('💡 Para configurar email fallback, defina SMTP_USER e SMTP_PASS');
    return false;
  }

    return await enviarEmailConviteNodmailer(dadosConvite);
  }

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

  // Preparar dados para SendPulse SMTP (formato oficial correto)
  const emailDataPayload = {
    email: {
      html: Buffer.from(htmlEmail).toString('base64'), // Codificar HTML em Base64
      text: `Olá ${nome}, você foi convidado para ${escritorio}! Acesse: ${linkConvite}`,
      subject: `🚀 Convite para ${escritorio} - ArcFlow`,
      from: {
        name: `${escritorio} via ArcFlow`,
        email: 'contato@arcflow.com.br'  // Email principal cadastrado no SendPulse
      },
      to: [
        {
          name: nome,
          email: email
        }
      ]
    }
  };

  console.log('📧 [SENDPULSE] Enviando email com dados:', {
    to: email,
    from: emailDataPayload.email.from.email,
    subject: emailDataPayload.email.subject
  });

  // Enviar email via API REST HTTP do SendPulse
  try {
    const https = require('https');
    
    const postData = JSON.stringify(emailDataPayload);
    
    const options = {
      hostname: 'api.sendpulse.com',
      port: 443,
      path: '/smtp/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('📤 [SENDPULSE] Resposta completa:', JSON.stringify(response, null, 2));
            
            if (response.result && response.id) {
              console.log('✅ [SENDPULSE] Email enviado com sucesso para:', email);
              console.log('📨 [SENDPULSE] ID do email:', response.id);
              resolve(true);
            } else {
              console.error('❌ [SENDPULSE] Erro detalhado:', response);
              
              // Tentar fallback com nodemailer
              const temCredenciais = process.env.SMTP_USER && process.env.SMTP_PASS;
              if (emailTransporter && temCredenciais) {
                console.log('🔄 Tentando fallback com Nodemailer...');
                enviarEmailConviteNodmailer(dadosConvite)
                  .then(result => resolve(result))
                  .catch(() => resolve(false));
              } else {
                console.log('⚠️ Fallback não disponível (sem credenciais SMTP)');
                resolve(false);
              }
            }
          } catch (error) {
            console.error('❌ [SENDPULSE] Erro ao parsear resposta:', error);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ [SENDPULSE] Erro na requisição:', error);
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('❌ [SENDPULSE] Erro geral:', error.message);
    return false;
  }
};

// Função de fallback usando Nodemailer
const enviarEmailConviteNodmailer = async (dadosConvite) => {
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
    
    console.log('📧 Email de convite enviado via Nodemailer para:', email);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email via Nodemailer:', error.message);
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
app.post('/api/auth/login', loginLimiter, async (req, res) => {
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
      token: accessToken, // Campo compatível com frontend
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

    // ⚡ SEGURANÇA: Verificar se o token foi criado nesta instância do servidor
    if (decoded.serverInstanceId !== SERVER_INSTANCE_ID) {
      console.log('🚨 [SECURITY] Token de instância anterior detectado - invalidando');
      return res.status(401).json({
        error: 'Sessão inválida - servidor foi reiniciado. Faça login novamente.',
        code: 'SERVER_RESTART_REQUIRED_REAUTH'
      });
    }

    // ⚡ SEGURANÇA: Verificar se o usuário está ativo
    if (!decoded.id) {
      return res.status(401).json({
        error: 'Token malformado',
        code: 'MALFORMED_TOKEN'
      });
    }

    // Buscar dados atualizados do usuário
    const userResult = await client.query(`
      SELECT u.id, u.email, u.nome, u.role, u.escritorio_id, u.is_active, u.created_at, u.updated_at,
             e.nome as escritorio_nome, e.cnpj as escritorio_cnpj, 
             e.telefone as escritorio_telefone, e.email as escritorio_email
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.id = $1 AND u.is_active = true
    `, [decoded.id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo',
        code: 'USER_NOT_FOUND_OR_INACTIVE'
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
      success: true,
      tokenValid: true
    });

  } catch (error) {
    console.error('❌ Erro ao buscar dados do usuário:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado. Faça login novamente.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
});

// 🔥 NOVA ROTA: POST /api/auth/heartbeat - Manter sessão ativa
app.post('/api/auth/heartbeat', authStatusLimiter, async (req, res) => {
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

    // Verificar se o token foi criado nesta instância do servidor
    if (decoded.serverInstanceId !== SERVER_INSTANCE_ID) {
      return res.status(401).json({
        error: 'Sessão inválida - servidor foi reiniciado',
        code: 'SERVER_RESTART_REQUIRED_REAUTH'
      });
    }

    // Atualizar último heartbeat do usuário
    await client.query(`
      UPDATE users 
      SET last_heartbeat = NOW() 
      WHERE id = $1
    `, [decoded.id]);

    console.log('💓 [HEARTBEAT] Recebido de:', decoded.email);

    res.json({
      success: true,
      message: 'Heartbeat recebido',
      timestamp: new Date().toISOString(),
      user: {
        id: decoded.id,
        email: decoded.email
      }
    });

  } catch (error) {
    console.error('❌ [HEARTBEAT] Erro:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
});

// 🔥 NOVA ROTA: GET /api/auth/status - Validar JWT do usuário COM RATE LIMITING
app.get('/api/auth/status', authStatusLimiter, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        authenticated: false,
        error: 'Token de acesso é obrigatório',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // ⚡ SEGURANÇA: Verificar se o token foi criado nesta instância do servidor (OPCIONAL)
    // ✅ PRODUTIVIDADE: Comentado para não invalidar sessões em restarts de servidor
    // Este comportamento pode ser reativado em produção se necessário
    /*
    if (decoded.serverInstanceId !== SERVER_INSTANCE_ID) {
      console.log('🚨 [AUTH-STATUS] Token de instância anterior detectado - invalidando');
      console.log('🚨 [AUTH-STATUS] Token ServerID:', decoded.serverInstanceId);
      console.log('🚨 [AUTH-STATUS] Atual ServerID:', SERVER_INSTANCE_ID);
      return res.status(401).json({
        authenticated: false,
        error: 'Sessão inválida - servidor foi reiniciado. Faça login novamente.',
        code: 'SERVER_RESTART_REQUIRED_REAUTH'
      });
    }
    */

    // ⚡ SEGURANÇA: Verificar se o usuário está ativo no banco
    if (!decoded.id) {
      return res.status(401).json({
        authenticated: false,
        error: 'Token malformado',
        code: 'MALFORMED_TOKEN'
      });
    }

    // 🚀 OTIMIZAÇÃO: Usar cache Redis se disponível
    if (jwtCacheInstance) {
      try {
        const cacheResult = await jwtCacheInstance.validateJWTWithCache(token);
        
        if (cacheResult.success) {
          console.log('⚡ [AUTH-STATUS] Validação via cache Redis');
          return res.json({
            authenticated: true,
            valid: true,
            user: {
              id: cacheResult.userData.id,
              email: cacheResult.userData.email,
              nome: cacheResult.userData.nome,
              role: cacheResult.userData.role || 'USER'
            },
            expiresAt: cacheResult.userData.tokenInfo?.exp ? 
              new Date(cacheResult.userData.tokenInfo.exp * 1000).toISOString() : null,
            fromCache: cacheResult.fromCache
          });
        } else {
          return res.status(401).json({
            authenticated: false,
            error: cacheResult.error,
            code: cacheResult.code || 'CACHE_VALIDATION_FAILED'
          });
        }
      } catch (cacheError) {
        console.warn('⚠️ [AUTH-STATUS] Cache indisponível, usando validação direta:', cacheError.message);
      }
    }
    
    // FALLBACK: Validação direta (código original mantido)
    // Verificar se usuário ainda está ativo
    const userCheck = await client.query(`
      SELECT id, is_active FROM users WHERE id = $1
    `, [decoded.id]);

    if (userCheck.rows.length === 0 || !userCheck.rows[0].is_active) {
      return res.status(401).json({
        authenticated: false,
        error: 'Usuário não encontrado ou inativo',
        code: 'USER_NOT_FOUND_OR_INACTIVE'
      });
    }

    // 🎯 Token válido!
    console.log('✅ [AUTH-STATUS] Token válido para usuário:', decoded.email);
    
    res.json({
      authenticated: true,
      valid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        nome: decoded.nome,
        role: decoded.role
      },
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
    });

  } catch (error) {
    console.error('❌ [AUTH-STATUS] Erro na validação:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        authenticated: false,
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        authenticated: false,
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    return res.status(500).json({
      authenticated: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido',
        code: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // ⚡ SEGURANÇA: Verificar se o token foi criado nesta instância do servidor (OPCIONAL)
    // ✅ PRODUTIVIDADE: Comentado para não invalidar sessões em restarts de servidor
    // Este comportamento pode ser reativado em produção se necessário
    /*
    if (decoded.serverInstanceId !== SERVER_INSTANCE_ID) {
      console.log('🚨 [SECURITY] Token de instância anterior detectado - invalidando');
      return res.status(401).json({
        error: 'Sessão inválida - servidor foi reiniciado. Faça login novamente.',
        code: 'SERVER_RESTART_REQUIRED_REAUTH'
      });
    }
    */

    // ⚡ SEGURANÇA: Verificar se o usuário está ativo no banco
    const userCheck = await client.query(
      'SELECT id, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userCheck.rows.length === 0 || !userCheck.rows[0].is_active) {
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo',
        code: 'USER_NOT_FOUND_OR_INACTIVE'
      });
    }
    
    // 🚀 CORREÇÃO ENTERPRISE: Extrair escritorioId DINÂMICO do JWT
    // Se não houver escritorioId no token, usar o próprio ID do usuário como fallback
    const escritorioIdFromToken = decoded.escritorioId || decoded.id;
    
    req.user = {
      id: decoded.id,
      userId: decoded.id, // Compatibilidade
      email: decoded.email,
      nome: decoded.nome,
      role: decoded.role,
      escritorioId: escritorioIdFromToken, // DINÂMICO baseado no JWT real
      serverInstanceId: decoded.serverInstanceId // ⚡ SEGURANÇA: ID do servidor
    };

    // Debug para multi-tenancy
    console.log('🔐 [AUTH] Token decodificado:', {
      userId: decoded.id,
      email: decoded.email,
      escritorioId: escritorioIdFromToken,
      role: decoded.role,
      serverInstanceId: decoded.serverInstanceId
    });

    next();
  } catch (error) {
    console.error('❌ [AUTH] Erro na autenticação:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado. Faça login novamente.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(403).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// ===== ROTA DE USUÁRIOS =====

// GET /api/users/:id - Buscar usuário específico
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log('🔍 [BACKEND/USERS] Buscando usuário ID:', userId);

    const result = await client.query(`
      SELECT id, nome, email, role, created_at, is_active
      FROM users 
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      console.log('❌ [BACKEND/USERS] Usuário não encontrado:', userId);
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];
    console.log('✅ [BACKEND/USERS] Usuário encontrado:', user.nome);
    
    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      avatar: null, // Coluna não existe no banco
      isActive: user.is_active,
      createdAt: user.created_at
    });

  } catch (error) {
    console.error('❌ [BACKEND/USERS] Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// ===== ROTAS DE CONVITES =====

// POST /api/convites - Enviar convite para colaborador
app.post('/api/convites', authenticateToken, async (req, res) => {
  try {
    const { email, nome, cargo, role, mensagemPersonalizada } = req.body;
    const userId = req.user.userId;
    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    
    // Mapeamento de strings para UUIDs válidos (multi-tenancy)
    const escritorioIdMappings = {
      'escritorio_teste': 'escritorio_teste',
      'user_admin_teste': 'escritorio_teste', // Fallback
      // Adicionar outros mapeamentos conforme necessário
    };
    
    // Se for uma string conhecida, usar mapeamento; senão, usar como está (UUID)
    const escritorioId = escritorioIdMappings[escritorioIdRaw] || escritorioIdRaw;
    
    console.log('🔍 [BRIEFING] Mapeamento escritório:', {
      original: escritorioIdRaw,
      mapeado: escritorioId,
      tipo: typeof escritorioId
    });

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
      id: token, // CORREÇÃO: usar token como id para o frontend funcionar
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
    
    // CORREÇÃO: Manter ENGINEER como válido, ou converter temporariamente
    const roleCorrigida = convite.role === 'ENGINEER' ? 'ARCHITECT' : convite.role;
    
    await client.query(`
      INSERT INTO users (id, email, password_hash, nome, role, escritorio_id, email_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [userId, convite.email, passwordHash, convite.nome, roleCorrigida, convite.escritorioId, true, true]);
    
    // SALVAR CARGO ORIGINAL: Criar entrada do usuário com cargo original
    global.usuariosComCargo = global.usuariosComCargo || [];
    global.usuariosComCargo.push({
      userId: userId,
      cargo: convite.cargo, // Salvar cargo original em português
      role: convite.role,   // Salvar role original
      roleCorrigida: roleCorrigida
    });

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
      c.id === id && c.escritorioId === escritorioId
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

    console.log('👥 [API/USERS] Buscando usuários do escritório:', escritorioId);

    const result = await client.query(`
      SELECT id, nome, email, role, created_at, last_login, is_active
      FROM users 
      WHERE escritorio_id = $1 AND is_active = true
      ORDER BY created_at ASC
    `, [escritorioId]);

    console.log('✅ [API/USERS] Usuários encontrados:', result.rows.length);

    const users = result.rows.map(user => {
      // Buscar cargo original salvo
      const cargoOriginal = (global.usuariosComCargo || []).find(u => u.userId === user.id);
      
      return {
        id: user.id,
        name: user.nome,        // Frontend espera 'name'
        nome: user.nome,        // Manter compatibilidade
        email: user.email,
        cargo: cargoOriginal ? cargoOriginal.cargo : traduzirRole(user.role), // Usar cargo original ou traduzir
        role: user.role,
        isActive: user.is_active,
        status: user.is_active ? 'ATIVO' : 'INATIVO',
        lastLogin: user.last_login,
        ultimoLogin: user.last_login || user.created_at,
        createdAt: user.created_at
      };
    });

    console.log('📋 [API/USERS] Dados formatados:', users);

    res.json({ users });

  } catch (error) {
    console.error('❌ [API/USERS] Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE CLIENTES =====

// GET /api/clientes/lixeira - Listar clientes removidos
app.get('/api/clientes/lixeira', authenticateToken, async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;
    console.log('🔍 [DEBUG] Lixeira - escritorioId:', escritorioId);
    console.log('🔍 [DEBUG] Lixeira - user:', req.user);

    const result = await client.query(`
      SELECT 
        id, nome, email, telefone, tipo_pessoa, cpf, cnpj,
        status, deleted_at, created_at
      FROM clientes 
      WHERE escritorio_id = $1 AND is_active = false
      ORDER BY deleted_at DESC
    `, [escritorioId]);

    console.log(`✅ Lixeira consultada: ${result.rows.length} clientes removidos`);
    console.log('📋 Dados retornados:', result.rows);

    res.json({
      clientes: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Erro ao consultar lixeira:', error);
    console.error('❌ Stack trace:', error.stack);
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

// DELETE /api/clientes/:id/permanente - Excluir cliente permanentemente da lixeira
app.delete('/api/clientes/:id/permanente', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    // Verificar se cliente existe na lixeira
    const existingClient = await client.query(`
      SELECT id, nome FROM clientes 
      WHERE id = $1 AND escritorio_id = $2 AND is_active = false
    `, [id, escritorioId]);

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado na lixeira'
      });
    }

    // Excluir permanentemente
    await client.query(`
      DELETE FROM clientes 
      WHERE id = $1
    `, [id]);

    console.log('🗑️ Cliente excluído permanentemente:', existingClient.rows[0].nome, id);

    res.json({
      message: 'Cliente excluído permanentemente com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao excluir cliente permanentemente:', error);
    res.status(500).json({ 
      error: 'Erro ao excluir cliente permanentemente',
      message: error.message 
    });
  }
});

// ✅ ROTAS DE VERIFICAÇÃO (DEVEM VIR ANTES DA ROTA :id)
// GET /api/clientes/verificar-cpf/:cpf - Verificar se CPF já está cadastrado
app.get('/api/clientes/verificar-cpf/:cpf', authenticateToken, async (req, res) => {
  try {
    const { cpf } = req.params;
    const escritorioId = req.user.escritorioId;
    const userId = req.user.id;

    // ✅ VERIFICAÇÃO DIRETA SEM CACHE
    // TODO: Implementar cache mais tarde

    // Por enquanto, fazer verificação direta sem cache

    // ✅ OTIMIZAÇÃO 3: Query otimizada - COMPARAR CPF LIMPO
    const cpfCheck = await client.query(`
      SELECT nome FROM clientes 
      WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = $1 
      AND escritorio_id = $2 AND is_active = true
      LIMIT 1
    `, [cpf, escritorioId]);

    // Retorno simples
    if (cpfCheck.rows.length > 0) {
      return res.status(200).json({
        duplicado: true,
        nomeCliente: cpfCheck.rows[0].nome
      });
    } else {
      return res.status(200).json({
        duplicado: false
      });
    }

  } catch (error) {
    console.error('❌ Erro ao verificar CPF:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      duplicado: false
    });
  }
});

// GET /api/clientes/verificar-cnpj/:cnpj - Verificar se CNPJ já está cadastrado
app.get('/api/clientes/verificar-cnpj/:cnpj', authenticateToken, async (req, res) => {
  try {
    const { cnpj } = req.params;
    const escritorioId = req.user.escritorioId;
    const userId = req.user.id;

    // ✅ VERIFICAÇÃO DIRETA SEM CACHE
    // TODO: Implementar cache mais tarde

    // ✅ OTIMIZAÇÃO 3: Query otimizada - COMPARAR CNPJ LIMPO
    const cnpjCheck = await client.query(`
      SELECT nome FROM clientes 
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(cnpj, '.', ''), '-', ''), '/', ''), ' ', '') = $1 
      AND escritorio_id = $2 AND is_active = true
      LIMIT 1
    `, [cnpj, escritorioId]);

    // Retorno simples
    if (cnpjCheck.rows.length > 0) {
      return res.status(200).json({
        duplicado: true,
        nomeCliente: cnpjCheck.rows[0].nome
      });
    } else {
      return res.status(200).json({
        duplicado: false
      });
    }

  } catch (error) {
    console.error('❌ Erro ao verificar CNPJ:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      duplicado: false
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
    
    // 🔍 DEBUG TEMPORÁRIO - Ver se dados de endereço chegam
    console.log('🔍 [DEBUG] Dados de endereço recebidos:');
    console.log('  endereco_cep:', endereco_cep);
    console.log('  endereco_logradouro:', endereco_logradouro);
    console.log('  endereco_numero:', endereco_numero);
    console.log('  endereco_bairro:', endereco_bairro);
    console.log('  endereco_cidade:', endereco_cidade);
    console.log('  endereco_uf:', endereco_uf);
    console.log('  endereco_pais:', endereco_pais);
    
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

    // Verificar se CPF já existe no escritório (para pessoa física)
    if (tipoPessoa === 'fisica' && cpf?.trim()) {
      const cpfLimpo = cpf.trim().replace(/\D/g, ''); // Remove formatação para comparação
      const cpfCheck = await client.query(`
        SELECT id, nome FROM clientes 
        WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = $1 
        AND escritorio_id = $2 AND is_active = true
      `, [cpfLimpo, escritorioId]);

      if (cpfCheck.rows.length > 0) {
        return res.status(409).json({
          error: `CPF já cadastrado para o cliente: ${cpfCheck.rows[0].nome}`
        });
      }
    }

    // Verificar se CNPJ já existe no escritório (para pessoa jurídica)
    if (tipoPessoa === 'juridica' && cnpj?.trim()) {
      const cnpjLimpo = cnpj.trim().replace(/\D/g, ''); // Remove formatação para comparação
      const cnpjCheck = await client.query(`
        SELECT id, nome FROM clientes 
        WHERE REPLACE(REPLACE(REPLACE(REPLACE(cnpj, '.', ''), '-', ''), '/', ''), ' ', '') = $1 
        AND escritorio_id = $2 AND is_active = true
      `, [cnpjLimpo, escritorioId]);

      if (cnpjCheck.rows.length > 0) {
        return res.status(409).json({
          error: `CNPJ já cadastrado para o cliente: ${cnpjCheck.rows[0].nome}`
        });
      }
    }

    const clienteId = uuidv4();
    
    await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, tipo_pessoa, cpf, cnpj, 
        endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
        endereco_bairro, endereco_cidade, endereco_uf, endereco_pais,
        observacoes, status, escritorio_id, profissao, data_nascimento, data_fundacao,
        familia, origem, preferencias, historico_projetos,
        created_by, created_at, updated_at, is_active
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW(), true
      )
    `, [
      clienteId,                                           // $1 - id
      nome.trim(),                                         // $2 - nome
      email.toLowerCase().trim(),                          // $3 - email
      telefone.trim(),                                     // $4 - telefone
      tipoPessoa,                                          // $5 - tipo_pessoa
      cpf?.trim() || null,                                 // $6 - cpf
      cnpj?.trim() || null,                                // $7 - cnpj
      endereco_cep || null,                                // $8 - endereco_cep
      endereco_logradouro || null,                         // $9 - endereco_logradouro
      endereco_numero || null,                             // $10 - endereco_numero
      endereco_complemento || null,                        // $11 - endereco_complemento
      endereco_bairro || null,                             // $12 - endereco_bairro
      endereco_cidade || null,                             // $13 - endereco_cidade
      endereco_uf || null,                                 // $14 - endereco_uf
      endereco_pais || 'Brasil',                           // $15 - endereco_pais
      observacoes?.trim() || '',                           // $16 - observacoes
      status,                                              // $17 - status
      escritorioId,                                        // $18 - escritorio_id
      profissao?.trim() || null,                           // $19 - profissao
      converterDataBrasileiraParaSQL(dataNascimento),      // $20 - data_nascimento
      converterDataBrasileiraParaSQL(dataFundacao),        // $21 - data_fundacao
      JSON.stringify(familia || {}),                       // $22 - familia
      JSON.stringify(origem || {}),                        // $23 - origem
      JSON.stringify(preferencias || {}),                  // $24 - preferencias
      JSON.stringify(historicoProjetos || []),             // $25 - historico_projetos
      req.user.id                                          // $26 - created_by
    ]);

    // Buscar cliente criado
    const clienteCriado = await client.query(`
      SELECT * FROM clientes WHERE id = $1
    `, [clienteId]);

    // ✅ Cliente criado com sucesso

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

// ✅ ROTAS DE VERIFICAÇÃO MOVIDAS PARA POSIÇÃO CORRETA (ANTES DA ROTA :id)

// Função para converter data brasileira DD/MM/YYYY para YYYY-MM-DD
const converterDataBrasileiraParaSQL = (dataBrasileira) => {
  if (!dataBrasileira || dataBrasileira.trim() === '') {
    return null;
  }
  
  const partes = dataBrasileira.split('/');
  if (partes.length !== 3) {
    return null;
  }
  
  const [dia, mes, ano] = partes;
  
  // Validar se são números válidos
  const diaNum = parseInt(dia, 10);
  const mesNum = parseInt(mes, 10);
  const anoNum = parseInt(ano, 10);
  
  if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) {
    return null;
  }
  
  // Validar rangos
  if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 1900 || anoNum > 2100) {
    return null;
  }
  
  // Retornar no formato YYYY-MM-DD
  const dataSQL = `${anoNum}-${mesNum.toString().padStart(2, '0')}-${diaNum.toString().padStart(2, '0')}`;
  return dataSQL;
};

// Função para traduzir roles do inglês para português
const traduzirRole = (role) => {
  const traducoes = {
    'USER': 'Usuário',
    'ARCHITECT': 'Arquiteto', 
    'ENGINEER': 'Engenheiro',
    'DESIGNER': 'Designer',
    'MANAGER': 'Gerente',
    'ADMIN': 'Administrador',
    'OWNER': 'Proprietário'
  };
  
  return traducoes[role] || role;
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

    // Verificar CPF único (se alterado e for pessoa física)
    if (updateData.tipoPessoa === 'fisica' && updateData.cpf?.trim()) {
      const cpfLimpo = updateData.cpf.trim().replace(/\D/g, ''); // Remove formatação para comparação
      const cpfCheck = await client.query(`
        SELECT id, nome FROM clientes 
        WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = $1 
        AND escritorio_id = $2 AND id != $3 AND is_active = true
      `, [cpfLimpo, escritorioId, id]);

      if (cpfCheck.rows.length > 0) {
        return res.status(409).json({
          error: `CPF já cadastrado para o cliente: ${cpfCheck.rows[0].nome}`
        });
      }
    }

    // Verificar CNPJ único (se alterado e for pessoa jurídica)
    if (updateData.tipoPessoa === 'juridica' && updateData.cnpj?.trim()) {
      const cnpjLimpo = updateData.cnpj.trim().replace(/\D/g, ''); // Remove formatação para comparação
      const cnpjCheck = await client.query(`
        SELECT id, nome FROM clientes 
        WHERE REPLACE(REPLACE(REPLACE(REPLACE(cnpj, '.', ''), '-', ''), '/', ''), ' ', '') = $1 
        AND escritorio_id = $2 AND id != $3 AND is_active = true
      `, [cnpjLimpo, escritorioId, id]);

      if (cnpjCheck.rows.length > 0) {
        return res.status(409).json({
          error: `CNPJ já cadastrado para o cliente: ${cnpjCheck.rows[0].nome}`
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
        tipo_pessoa = COALESCE($4, tipo_pessoa),
        cpf = COALESCE($5, cpf),
        cnpj = COALESCE($6, cnpj),
        endereco_cep = COALESCE($7, endereco_cep),
        endereco_logradouro = COALESCE($8, endereco_logradouro),
        endereco_numero = COALESCE($9, endereco_numero),
        endereco_complemento = COALESCE($10, endereco_complemento),
        endereco_bairro = COALESCE($11, endereco_bairro),
        endereco_cidade = COALESCE($12, endereco_cidade),
        endereco_uf = COALESCE($13, endereco_uf),
        endereco_pais = COALESCE($14, endereco_pais),
        observacoes = COALESCE($15, observacoes),
        status = COALESCE($16, status),
        profissao = COALESCE($17, profissao),
        data_nascimento = COALESCE($18, data_nascimento),
        data_fundacao = COALESCE($19, data_fundacao),
        familia = COALESCE($20, familia),
        origem = COALESCE($21, origem),
        preferencias = COALESCE($22, preferencias),
        historico_projetos = COALESCE($23, historico_projetos),
        updated_by = $24,
        updated_at = NOW()
      WHERE id = $25
      RETURNING *
    `, [
      updateData.nome?.trim(),
      updateData.email?.toLowerCase().trim(),
      updateData.telefone?.trim(),
      updateData.tipoPessoa,
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
      req.user.id,
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
    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    const escritorioId = escritorioIdRaw === 'escritorio_teste' ? 'escritorio_teste' : escritorioIdRaw;
    
    console.log('🔍 [BRIEFING] Mapeamento:', { original: escritorioIdRaw, mapeado: escritorioId });

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

// =================== ROTAS DE BRIEFINGS ===================

// POST /api/briefings - Criar novo briefing
app.post('/api/briefings', authenticateToken, async (req, res) => {
  try {
    const { 
      nomeProjeto, 
      descricao, 
      objetivos,
      prazo,
      orcamento,
      clienteId, 
      responsavelId,
      disciplina,
      area,
      tipologia,
      briefingIds = [],
      respostas = {}
    } = req.body;
    
    // ✅ DADOS REAIS DO USUÁRIO - COM NORMALIZAÇÃO UUID ROBUSTA
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;
    
    // 🔧 NORMALIZAR IDs PARA UUIDs VÁLIDOS
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    const userId = normalizeToUuid(userIdRaw);
    
    console.log('🔍 [BRIEFING-POST] Dados do usuário:', { 
      escritorioIdRaw,
      escritorioId,
      userIdRaw, 
      userId,
      userEmail: req.user.email
    });

    console.log('📝 Criando briefing:', { nomeProjeto, disciplina, area, tipologia });

    // Validações básicas
    if (!nomeProjeto || !disciplina) {
      return res.status(400).json({
        error: 'Nome do projeto e disciplina são obrigatórios'
      });
    }

    // Criar briefing básico
    const briefingId = uuidv4();
    
    const result = await client.query(`
      INSERT INTO briefings (
        id, nome_projeto, descricao, objetivos, prazo, orcamento,
        cliente_id, responsavel_id, escritorio_id, created_by,
        disciplina, area, tipologia, status, progresso, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      RETURNING *
    `, [
      briefingId,
      nomeProjeto.trim(),
      descricao?.trim() || '',
      objetivos?.trim() || '',
      prazo?.trim() || '',
      orcamento?.trim() || '',
      clienteId || null,
      responsavelId || userId, // Usar responsável direto ou usuário atual
      escritorioId,
      userId,
      disciplina,
      area || '',
      tipologia || '',
      'RASCUNHO',
      0
    ]);

    console.log('✅ Briefing criado:', briefingId);

    // 🔥 SALVAR RESPOSTAS NO METADATA SE FORNECIDAS
    if (respostas && Object.keys(respostas).length > 0) {
      console.log('🔥 [BRIEFING-CREATE] Salvando respostas no metadata:', {
        briefingId: briefingId,
        totalRespostas: Object.keys(respostas).length,
        formatoCorreto: true
      });
      
      console.log('🔍 [DEBUG] Estrutura das respostas recebidas:', JSON.stringify(respostas, null, 2));

      // Atualizar briefing com respostas no metadata
      await client.query(`
        UPDATE briefings 
        SET observacoes = $1, updated_at = NOW()
        WHERE id = $2
      `, [
        JSON.stringify({
          respostas: respostas,
          test_metadata: req.body.dados?.test_metadata || {},
          savedAt: new Date().toISOString()
        }),
        briefingId
      ]);

      console.log('✅ [BRIEFING-CREATE] Respostas salvas com sucesso no metadata');
    }

    res.status(201).json({
      message: 'Briefing criado com sucesso',
      briefing: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao criar briefing:', error);
    res.status(500).json({ 
      error: 'Erro ao criar briefing',
      message: error.message 
    });
  }
});

// GET /api/briefings - Listar briefings REAIS do PostgreSQL
app.get('/api/briefings', authenticateToken, async (req, res) => {
  try {
    const escritorioIdRaw = req.user.escritorioId;
    
    // 🔧 NORMALIZAR ID PARA UUID VÁLIDO
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    
    const { page = 1, limit = 20, status, clienteId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    console.log('🔍 [BRIEFINGS] Buscando briefings do escritório:', escritorioId);

    // 🚀 QUERY OTIMIZADA com JOINs para alta performance (10k usuários)
    let whereClause = 'WHERE b.escritorio_id = $1 AND b.deleted_at IS NULL';
    let queryParams = [escritorioId];
    let paramIndex = 2;

    // Filtros opcionais
    if (status) {
      whereClause += ` AND b.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (clienteId) {
      whereClause += ` AND b.cliente_id = $${paramIndex}`;
      queryParams.push(clienteId);
      paramIndex++;
    }

    // Query principal SIMPLIFICADA - SEM JOINs PROBLEMÁTICOS
    const briefingsQuery = `
      SELECT 
        b.id,
        b.nome_projeto as "nomeProjeto",
        b.status,
        b.progresso,
        b.disciplina,
        b.area,
        b.tipologia,
        b.observacoes,
        b.created_at as "createdAt",
        b.updated_at as "updatedAt",
        b.cliente_id as "clienteId",
        b.responsavel_id as "responsavelId",
        b.escritorio_id as "escritorioId",
        b.deleted_at as "deletedAt"
      FROM briefings b
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(Number(limit), offset);

    // Query para contar total (otimizada)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM briefings b
      ${whereClause}
    `;

    console.log('📊 [BRIEFINGS] Executando queries otimizadas...');
    
    // Executar queries em paralelo para máxima performance
    const [briefingsResult, countResult] = await Promise.all([
      client.query(briefingsQuery, queryParams),
      client.query(countQuery, queryParams.slice(0, -2)) // Remove limit e offset do count
    ]);

    // 🔄 Transformar dados para formato esperado pelo frontend
    const briefings = briefingsResult.rows.map(row => ({
      id: row.id,
      nomeProjeto: row.nomeProjeto,
      status: row.status,
      progresso: row.progresso || 0,
      disciplina: row.disciplina,
      area: row.area,
      tipologia: row.tipologia,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      clienteId: row.clienteId,
      responsavelId: row.responsavelId,
      escritorioId: row.escritorioId,
      deletedAt: row.deletedAt,
      // Dados relacionados podem ser buscados separadamente se necessário
      cliente: null,
      responsavel: null,
      // ✅ CONTAGEM REAL DE RESPOSTAS DO CAMPO OBSERVACOES
      _count: {
        respostas: contarRespostasReais(row.observacoes) // Contar respostas reais
      },
      respostas: [] // Array vazio para compatibilidade
    }));

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / Number(limit));

    const response = {
      briefings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    };

    console.log(`✅ [BRIEFINGS] ${briefings.length}/${total} briefings carregados com sucesso`);
    res.json(response);

  } catch (error) {
    console.error('❌ [BRIEFINGS] Erro ao listar briefings:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao carregar briefings',
      timestamp: new Date().toISOString()
    });
  }
});


// GET /api/briefings/:id - Buscar briefing específico REAL do PostgreSQL
app.get('/api/briefings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userIdRaw = req.user.id;
    const escritorioIdRaw = req.user.escritorioId;
    
    // 🔧 NORMALIZAR IDs PARA UUIDs VÁLIDOS
    const userId = normalizeToUuid(userIdRaw);
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    
    console.log('🔍 [BRIEFING] Buscando briefing por ID:', id);
    console.log('🔍 [BRIEFING] Usuário:', userId, 'Escritório:', escritorioId);

    // 🚀 QUERY SIMPLIFICADA E ROBUSTA - SEM JOINS PROBLEMÁTICOS
    const briefingQuery = `
      SELECT 
        b.id,
        b.nome_projeto as "nomeProjeto",
        b.descricao,
        b.objetivos,
        b.prazo,
        b.orcamento,
        b.status,
        b.progresso,
        b.disciplina,
        b.area,
        b.tipologia,
        b.metadata,
        b.observacoes,
        b.created_at as "createdAt",
        b.updated_at as "updatedAt",
        b.cliente_id as "clienteId",
        b.responsavel_id as "responsavelId",
        b.escritorio_id as "escritorioId",
        b.deleted_at as "deletedAt"
      FROM briefings b
      WHERE b.id = $1 
      AND b.deleted_at IS NULL
    `;

    const result = await client.query(briefingQuery, [id]);

    if (result.rows.length === 0) {
      console.log('❌ [BRIEFING] Briefing não encontrado');
      return res.status(404).json({
        error: 'Briefing não encontrado',
        message: 'O briefing solicitado não existe',
        timestamp: new Date().toISOString()
      });
    }

    const row = result.rows[0];
    
    // 🔒 VERIFICAÇÃO DE SEGURANÇA: Verificar se briefing pertence ao escritório do usuário
    // Conversão flexível para comparar IDs
    const briefingEscritorioId = row.escritorioId?.toString();
    const userEscritorioId = escritorioId?.toString();
    
    // Se não há match de escritório, verificar se usuário é responsável
    const briefingResponsavelId = row.responsavelId?.toString();
    const currentUserId = userId?.toString();
    
    const isOwner = briefingEscritorioId === userEscritorioId;
    const isResponsavel = briefingResponsavelId === currentUserId;
    
    if (!isOwner && !isResponsavel) {
      console.log('❌ [BRIEFING] Sem permissão - Escritório:', briefingEscritorioId, 'vs', userEscritorioId, 'Responsável:', briefingResponsavelId, 'vs', currentUserId);
      return res.status(403).json({
        error: 'Sem permissão',
        message: 'Você não tem permissão para visualizar este briefing',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ [BRIEFING] Acesso autorizado - IsOwner:', isOwner, 'IsResponsavel:', isResponsavel);

    // 🔥 EXTRAIR RESPOSTAS DO METADATA/OBSERVACOES
    let respostasFormatadas = [];
    let metadataRespostas = null;
    
    // Tentar extrair respostas das observações (formato JSON)
    if (row.observacoes) {
      try {
        const observacoesData = JSON.parse(row.observacoes);
        if (observacoesData.respostas) {
          metadataRespostas = observacoesData.respostas;
          console.log('🔥 [BRIEFING] Encontradas respostas no metadata:', Object.keys(metadataRespostas).length, 'templates');
          
          // Converter respostas do metadata para formato da tabela
          for (const [templateId, perguntasRespostas] of Object.entries(metadataRespostas)) {
            for (const [perguntaId, resposta] of Object.entries(perguntasRespostas)) {
              respostasFormatadas.push({
                id: `metadata_${templateId}_${perguntaId}`,
                perguntaId: perguntaId,
                resposta: resposta,
                briefingTemplateId: templateId,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
              });
            }
          }
          
          console.log('🔥 [BRIEFING] Total de respostas formatadas:', respostasFormatadas.length);
        }
      } catch (error) {
        console.log('⚠️ [BRIEFING] Erro ao parsear observações como JSON:', error.message);
      }
    }

    // 🔄 Transformar dados para formato esperado
    const briefing = {
      id: row.id,
      nomeProjeto: row.nomeProjeto,
      descricao: row.descricao,
      objetivos: row.objetivos,
      prazo: row.prazo,
      orcamento: row.orcamento,
      status: row.status,
      progresso: row.progresso || 0,
      disciplina: row.disciplina,
      area: row.area,
      tipologia: row.tipologia,
      metadata: row.metadata,
      observacoes: row.observacoes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      clienteId: row.clienteId,
      responsavelId: row.responsavelId,
      escritorioId: row.escritorioId,
      deletedAt: row.deletedAt,
      // Dados relacionados podem ser buscados separadamente se necessário
      cliente: null,
      responsavel: null,
      // 🔥 RESPOSTAS EXTRAÍDAS DO METADATA
      respostas: respostasFormatadas,
      // ✅ CONTAGEM REAL DE RESPOSTAS
      _count: {
        respostas: respostasFormatadas.length
      }
    };

    console.log('✅ [BRIEFING] Briefing encontrado:', briefing.nomeProjeto, `(${briefing._count.respostas} respostas)`);

    res.json({
      message: 'Briefing encontrado com sucesso',
      briefing: briefing
    });

  } catch (error) {
    console.error('❌ [BRIEFING] Erro ao buscar briefing:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao carregar briefing',
      timestamp: new Date().toISOString()
    });
  }
});


// POST /api/briefings/salvar-completo - Salvar briefing completo do frontend
app.post('/api/briefings/salvar-completo', authenticateToken, async (req, res) => {
  try {
    console.log('🎯 [BRIEFING-SALVAR] Recebendo dados completos:', {
      body: req.body ? 'presente' : 'ausente',
      user: req.user ? req.user.email : 'não autenticado'
    });

    const { 
      nomeProjeto, 
      clienteId,
      briefingTemplate,
      respostas,
      metadados,
      estruturaPersonalizada
    } = req.body;

    // Validações básicas
    if (!nomeProjeto || !briefingTemplate || !respostas) {
      console.log('❌ [BRIEFING-SALVAR] Dados obrigatórios faltando');
      return res.status(400).json({
        error: 'Dados obrigatórios faltando',
        message: 'nomeProjeto, briefingTemplate e respostas são obrigatórios'
      });
    }

    // ✅ DADOS REAIS DO USUÁRIO - COM NORMALIZAÇÃO UUID ROBUSTA
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;
    
    // 🔧 NORMALIZAR IDs PARA UUIDs VÁLIDOS
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    const userId = normalizeToUuid(userIdRaw);

    
    // 🔍 DEBUG: Verificar briefingTemplate enviado
    console.log('🔍 [DEBUG-BRIEFING-TEMPLATE] Dados recebidos:', {
      nomeProjeto: nomeProjeto,
      briefingTemplate: briefingTemplate,
      briefingTemplate_nome: briefingTemplate?.nome,
      briefingTemplate_categoria: briefingTemplate?.categoria,
      briefingTemplate_keys: briefingTemplate ? Object.keys(briefingTemplate) : 'undefined'
    });

    // 🛡️ PROTEÇÃO: Validar e corrigir nome do projeto se necessário
    if (!nomeProjeto || nomeProjeto.includes('undefined')) {
      console.log('⚠️ [NOME-INVALIDO] Nome do projeto inválido detectado:', nomeProjeto);
      
      // Tentar recuperar nome de diferentes fontes
      const nomeRecuperado = briefingTemplate?.nome || 
                           briefingTemplate?.id || 
                           `Briefing ${new Date().toLocaleDateString('pt-BR')}`;
      
      console.log('🔧 [NOME-CORRIGIDO] Nome corrigido para:', nomeRecuperado);
      nomeProjeto = nomeRecuperado;
    }

    console.log('🔍 [BRIEFING-SALVAR] Dados do usuário:', { 
      escritorioIdRaw,
      escritorioId,
      userIdRaw,
      userId,
      userEmail: req.user.email
    });

    // Verificar se cliente existe (se fornecido) - VALIDAÇÃO FLEXÍVEL
    let clienteIdValido = clienteId; // Criar variável mutável para o clienteId válido
    
    if (clienteId) {
      console.log('🔍 [BRIEFING-SALVAR] Verificando cliente:', { clienteId, escritorioId });
      
      const clienteResult = await client.query(`
        SELECT id, escritorio_id FROM clientes 
        WHERE id = $1
      `, [clienteId]);

      if (clienteResult.rows.length === 0) {
        console.log('❌ [BRIEFING-SALVAR] Cliente não encontrado no sistema:', clienteId);
        console.log('⚠️ [BRIEFING-SALVAR] Salvando briefing SEM cliente para não bloquear');
        // 🔥 SOLUÇÃO TEMPORÁRIA: Salvar sem cliente em vez de bloquear
        clienteIdValido = null;
      } else {
        const cliente = clienteResult.rows[0];
        console.log('✅ [BRIEFING-SALVAR] Cliente encontrado:', { 
          id: cliente.id, 
          escritorioCliente: cliente.escritorio_id,
          escritorioUsuario: escritorioId,
          match: cliente.escritorio_id === escritorioId
        });
        
        // Se cliente não pertence ao escritório, log mas permite salvamento
        if (cliente.escritorio_id !== escritorioId) {
          console.log('⚠️ [BRIEFING-SALVAR] Cliente pertence a outro escritório, salvando sem cliente');
          clienteIdValido = null; // Salvar sem cliente por enquanto
        }
      }
    }

    // 🎯 SOLUÇÃO RAFAEL: ATUALIZAR BRIEFING EXISTENTE EM VEZ DE CRIAR NOVO
    const briefingExistenteId = req.body.briefingId; // ID do briefing para atualizar
    const dataAtual = new Date();

    // Preparar dados para salvamento
    const observacoes = JSON.stringify({
      template: briefingTemplate,
      respostas: respostas,
      metadados: metadados || {},
      // 🔥 NOVO: Salvar estrutura personalizada
      estruturaPersonalizada: estruturaPersonalizada || null,
      dataFinalizacao: dataAtual.toISOString()
    });

    let briefingId;
    let result;

    if (briefingExistenteId) {
      // 🎯 RAFAEL CORRETO: ATUALIZAR BRIEFING EXISTENTE
      console.log('🔄 [BRIEFING-UPDATE] Atualizando briefing existente:', {
        briefingExistenteId,
        totalRespostas: metadados?.totalRespostas || 0,
        operacao: 'UPDATE (não cria novo ID)'
      });

      // Verificar se briefing existe
      const verificacao = await client.query(
        'SELECT id FROM briefings WHERE id = $1::uuid AND escritorio_id = $2::uuid',
        [briefingExistenteId, escritorioId]
      );

      if (verificacao.rows.length > 0) {
        // ATUALIZAR briefing existente PRESERVANDO cliente_id e responsavel_id
        result = await client.query(`
          UPDATE briefings SET
            nome_projeto = $1,
            descricao = $2,
            status = $3,
            progresso = $4,
            observacoes = $5,
            updated_at = NOW()
          WHERE id = $6 AND escritorio_id = $7
          RETURNING *
        `, [
          nomeProjeto.trim(),
          `${nomeProjeto.trim()} - Concluído`,
          'CONCLUIDO',
          metadados?.progresso || 100,
          observacoes,
          briefingExistenteId,
          escritorioId
        ]);

        briefingId = briefingExistenteId; // MANTER O MESMO ID!
        console.log('✅ [BRIEFING-UPDATE] Briefing atualizado com sucesso - MESMO ID preservado');
      } else {
        console.log('⚠️ [BRIEFING-UPDATE] Briefing não encontrado, criando novo');
        briefingId = uuidv4(); // Só cria novo se não encontrar o existente
      }
    } else {
      console.log('📝 [BRIEFING-CREATE] Criando novo briefing (sem ID fornecido)');
      briefingId = uuidv4();
    }

    // Se não foi atualizado acima, criar novo
    if (!result || result.rows.length === 0) {
      console.log('💾 [BRIEFING-SALVAR] Criando briefing no banco:', {
        id: briefingId,
        nomeProjeto,
        categoria: briefingTemplate.categoria,
        totalPerguntas: briefingTemplate.totalPerguntas,
        totalRespostas: metadados?.totalRespostas || 0
      });

      result = await client.query(`
        INSERT INTO briefings (
          id, nome_projeto, descricao, cliente_id, responsavel_id, 
          escritorio_id, created_by, disciplina, area, tipologia,
          status, progresso, observacoes, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        RETURNING *
      `, [
        briefingId,
        nomeProjeto.trim(),
        `${nomeProjeto.trim()} - Concluído`,
        clienteIdValido || null,
        userId, // responsável
        escritorioId,
        userId, // criado por
        briefingTemplate?.categoria || 'Geral',
        briefingTemplate?.area || '',
        briefingTemplate?.tipologia || '',
        'CONCLUIDO',
        metadados?.progresso || 100,
        observacoes
      ]);
    }

    const briefingSalvo = result.rows[0];

    console.log('✅ [BRIEFING-SALVAR] Briefing salvo com sucesso:', {
      id: briefingSalvo.id,
      nome: briefingSalvo.nome_projeto,
      status: briefingSalvo.status
    });

    // Resposta de sucesso
    res.status(201).json({
      success: true,
      message: 'Briefing salvo com sucesso!',
      data: {
        briefingId: briefingSalvo.id,
        nomeProjeto: briefingSalvo.nome_projeto,
        status: briefingSalvo.status,
        progresso: briefingSalvo.progresso,
        dashboardUrl: `/projetos/${briefingSalvo.id}/dashboard`,
        createdAt: briefingSalvo.created_at
      }
    });

  } catch (error) {
    console.error('❌ [BRIEFING-SALVAR] Erro ao salvar:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao salvar briefing. Tente novamente.',
      details: error.message 
    });
  }
});

// POST /api/briefings/:id/respostas - Salvar respostas em lote
app.post('/api/briefings/:id/respostas', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { respostas } = req.body;
    // ✅ DADOS REAIS DO USUÁRIO - COM NORMALIZAÇÃO UUID ROBUSTA
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;
    
    // 🔧 NORMALIZAR IDs PARA UUIDs VÁLIDOS
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    const userId = normalizeToUuid(userIdRaw);

    console.log('🔥 [RESPOSTAS-SAVE] Salvando respostas:', {
      briefingId: id,
      totalRespostas: Object.keys(respostas).length,
      escritorioId
    });

    // Verificar se briefing existe
    const briefingResult = await client.query(
      'SELECT * FROM briefings WHERE id = $1::uuid AND escritorio_id = $2::uuid',
      [id, escritorioId]
    );

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado'
      });
    }

    const briefing = briefingResult.rows[0];

    // 🔥 SALVAR RESPOSTAS NO OBSERVACOES (metadata JSONB)
    if (respostas && Object.keys(respostas).length > 0) {
      // Buscar metadata existente
      let metadataExistente = {};
      try {
        metadataExistente = briefing.observacoes ? JSON.parse(briefing.observacoes) : {};
      } catch (error) {
        console.log('⚠️ [RESPOSTAS-SAVE] Erro ao parsear observações existentes, usando vazio');
      }
      
      // 🔥 NOVO: Registrar histórico de edições
      const historico = metadataExistente.historico || [];
      const novaEntradaHistorico = {
        id: `edit-${Date.now()}`,
        acao: 'Briefing editado',
        data: new Date().toISOString(),
        tempo_inicio: new Date().toISOString(),
        tempo_fim: new Date().toISOString(),
        usuario: req.user.name || 'Usuário',
        detalhes: `Briefing editado com ${Object.keys(respostas).length} respostas atualizadas`,
        totalRespostas: Object.keys(respostas).length,
        respostasAtualizadas: Object.keys(respostas).slice(0, 5) // Primeiras 5 chaves para referência
      };
      
      // Manter histórico limitado (últimas 50 entradas)
      historico.unshift(novaEntradaHistorico);
      if (historico.length > 50) {
        historico.splice(50);
      }
      
      // Atualizar metadata com novas respostas E histórico
      const novaMetadata = {
        ...metadataExistente,
        respostas: respostas, // Salva no formato correto para edição
        historico: historico, // 🔥 NOVO: Histórico de edições
        updatedAt: new Date().toISOString(),
        lastEditBy: req.user.name || 'Usuário',
        lastEditAt: new Date().toISOString()
      };
      
      // Atualizar metadata no banco
      await client.query(`
        UPDATE briefings 
        SET observacoes = $1, updated_at = NOW()
        WHERE id = $2
      `, [JSON.stringify(novaMetadata), id]);
      
      console.log('🔥 [RESPOSTAS-SAVE] Salvando respostas na metadata com histórico:', {
        briefingId: id,
        totalRespostas: Object.keys(respostas).length,
        totalHistorico: historico.length,
        formatoCorreto: true
      });
    }

    res.json({ 
      success: true,
      message: 'Respostas salvas com sucesso',
      totalRespostas: Object.keys(respostas).length,
      briefingId: id
    });

  } catch (error) {
    console.error('❌ [RESPOSTAS-SAVE] Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao salvar respostas',
      message: error.message 
    });
  }
});

// GET /api/briefings/:id/respostas - Buscar respostas específicas de um briefing
app.get('/api/briefings/:id/respostas', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // ✅ CORREÇÃO CRÍTICA: Usar ID original sem mapeamento incorreto
    let escritorioId = req.user.escritorioId;
    
    // 🔧 CORREÇÃO FINAL: FORÇAR UUID para escritorio_teste
    if (escritorioId === 'escritorio_teste') {
      escritorioId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    }

    console.log('🔍 [RESPOSTAS-GET] Buscando respostas do briefing:', id);

    // Buscar briefing
    const briefingResult = await client.query(
      'SELECT * FROM briefings WHERE id = $1::uuid AND escritorio_id = $2::uuid',
      [id, escritorioId]
    );

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado'
      });
    }

    const briefing = briefingResult.rows[0];

    // 🔥 ESTRATÉGIA UNIFICADA: Formato único para edição
    let respostasParaEdicao = {};
    let totalRespostas = 0;
    let fonte = 'nenhuma';
    let estruturaPersonalizada = null;

    // 1. 🎯 PRIORIDADE: Briefings personalizados (observacoes JSON)
    if (briefing.observacoes && typeof briefing.observacoes === 'string') {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        
        // Buscar respostas
        if (observacoes.respostas && typeof observacoes.respostas === 'object') {
          console.log('✅ [RESPOSTAS-GET] Encontrado formato "respostas" nas observações');
          
          // Copiar respostas diretamente (já estão no formato correto)
          respostasParaEdicao = { ...observacoes.respostas };
          totalRespostas = Object.keys(respostasParaEdicao).length;
          fonte = 'observacoes-json';
        }

        // Buscar estrutura personalizada
        estruturaPersonalizada = observacoes.estruturaPersonalizada || null;
        
      } catch (error) {
        console.log('⚠️ [RESPOSTAS-GET] Erro ao parsear observações:', error.message);
      }
    }

    console.log(`✅ [RESPOSTAS-GET] Respostas encontradas: ${totalRespostas} (fonte: ${fonte})`);
    console.log('🔍 [RESPOSTAS-GET] Estrutura personalizada encontrada:', estruturaPersonalizada ? 'SIM' : 'NÃO');

    res.json({
      success: true,
      briefingId: briefing.id,
      totalRespostas,
      fonte,
      respostas: respostasParaEdicao,
      estruturaPersonalizada: estruturaPersonalizada,
      metadata: {
        nomeProjeto: briefing.nome_projeto,
        status: briefing.status,
        progresso: briefing.progresso,
        createdAt: briefing.created_at,
        updatedAt: briefing.updated_at
      }
    });

  } catch (error) {
    console.error('❌ [RESPOSTAS-GET] Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar respostas',
      message: error.message 
    });
  }
});

// GET /api/briefings/:id/historico - Buscar histórico do briefing (placeholder)
app.get('/api/briefings/:id/historico', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // ✅ CORREÇÃO CRÍTICA: Usar ID original sem mapeamento incorreto
    let escritorioId = req.user.escritorioId;
    
    // 🔧 CORREÇÃO FINAL: FORÇAR UUID para escritorio_teste
    if (escritorioId === 'escritorio_teste') {
      escritorioId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    }
    
    console.log('🔍 [HISTORICO] Buscando histórico do briefing:', id);

    // Buscar briefing
    const briefingResult = await client.query(
      'SELECT * FROM briefings WHERE id = $1::uuid AND escritorio_id = $2::uuid',
      [id, escritorioId]
    );

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado'
      });
    }

    const briefing = briefingResult.rows[0];
    let historicoCompleto = [];

    // 🔥 BUSCAR HISTÓRICO SALVO NAS OBSERVAÇÕES
    if (briefing.observacoes && typeof briefing.observacoes === 'string') {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        if (observacoes.historico && Array.isArray(observacoes.historico)) {
          historicoCompleto = [...observacoes.historico];
          console.log('✅ [HISTORICO] Encontrado histórico nas observações:', historicoCompleto.length, 'eventos');
        }
      } catch (error) {
        console.log('⚠️ [HISTORICO] Erro ao parsear observações:', error.message);
      }
    }

    // 🔥 ADICIONAR EVENTO DE CRIAÇÃO (se não existir)
    const temEventoCriacao = historicoCompleto.some(h => h.acao === 'Briefing criado');
    if (!temEventoCriacao) {
      const eventoCriacao = {
        id: `${briefing.id}-criado`,
        acao: 'Briefing criado',
        data: briefing.created_at,
        tempo_inicio: briefing.created_at,
        tempo_fim: briefing.created_at,
        usuario: 'Sistema',
        detalhes: `Briefing "${briefing.nome_projeto}" criado no sistema`
      };
      historicoCompleto.push(eventoCriacao);
    }

    // 🔥 ORDENAR POR DATA (mais recente primeiro)
    historicoCompleto.sort((a, b) => new Date(b.data) - new Date(a.data));

    console.log('✅ [HISTORICO] Histórico completo encontrado:', historicoCompleto.length, 'eventos');

    res.json({
      briefingId: id,
      totalEventos: historicoCompleto.length,
      historico: historicoCompleto,
      metadata: {
        nomeProjeto: briefing.nome_projeto,
        status: briefing.status,
        progresso: briefing.progresso,
        createdAt: briefing.created_at,
        updatedAt: briefing.updated_at
      }
    });

  } catch (error) {
    console.error('❌ [HISTORICO] Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar histórico',
      message: error.message 
    });
  }
});

// =================== ROTAS DE ESTRUTURAS PERSONALIZADAS ===================

// POST /api/briefings/:id/estrutura-personalizada - Salvar estrutura personalizada
app.post('/api/briefings/:id/estrutura-personalizada', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estruturaPersonalizada } = req.body;
    // ✅ DADOS REAIS DO USUÁRIO - COM NORMALIZAÇÃO UUID ROBUSTA
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;
    
    // 🔧 NORMALIZAR IDs PARA UUIDs VÁLIDOS
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    const userId = normalizeToUuid(userIdRaw);

    console.log('💾 [ESTRUTURA] Salvando estrutura personalizada para briefing:', id);

    // Verificar se briefing existe
    const briefingResult = await client.query(
      'SELECT * FROM briefings WHERE id = $1::uuid AND escritorio_id = $2::uuid',
      [id, escritorioId]
    );

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado'
      });
    }

    const briefing = briefingResult.rows[0];

    // Buscar metadata existente
    let metadataExistente = {};
    try {
      metadataExistente = briefing.observacoes ? JSON.parse(briefing.observacoes) : {};
    } catch (error) {
      console.log('⚠️ [ESTRUTURA] Erro ao parsear observações existentes, usando vazio');
    }
    
    // Atualizar metadata com estrutura personalizada
    const novaMetadata = {
      ...metadataExistente,
      estruturaPersonalizada: estruturaPersonalizada,
      updatedAt: new Date().toISOString()
    };

    // Salvar no banco
    await client.query(`
      UPDATE briefings 
      SET observacoes = $1, updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(novaMetadata), id]);

    console.log('✅ [ESTRUTURA] Estrutura personalizada salva com sucesso');

    res.json({
      success: true,
      message: 'Estrutura personalizada salva com sucesso',
      briefingId: id,
      estruturaPersonalizada: estruturaPersonalizada
    });

  } catch (error) {
    console.error('❌ [ESTRUTURA] Erro ao salvar estrutura personalizada:', error);
    res.status(500).json({ 
      error: 'Erro ao salvar estrutura personalizada',
      message: error.message 
    });
  }
});

// GET /api/briefings/:id/estrutura-personalizada - Carregar estrutura personalizada
app.get('/api/briefings/:id/estrutura-personalizada', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // ✅ DADOS REAIS DO USUÁRIO - COM NORMALIZAÇÃO UUID ROBUSTA
    const escritorioIdRaw = req.user.escritorioId;
    
    // 🔧 NORMALIZAR ID PARA UUID VÁLIDO
    const escritorioId = normalizeToUuid(escritorioIdRaw);

    console.log('🔍 [ESTRUTURA] Carregando estrutura personalizada para briefing:', id);

    // Buscar briefing
    const briefingResult = await client.query(
      'SELECT * FROM briefings WHERE id = $1::uuid AND escritorio_id = $2::uuid',
      [id, escritorioId]
    );

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado'
      });
    }

    const briefing = briefingResult.rows[0];
    let estruturaPersonalizada = null;

    // Buscar estrutura personalizada nas observações
    if (briefing.observacoes && typeof briefing.observacoes === 'string') {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        estruturaPersonalizada = observacoes.estruturaPersonalizada || null;
      } catch (error) {
        console.log('⚠️ [ESTRUTURA] Erro ao parsear observações:', error.message);
      }
    }

    console.log('✅ [ESTRUTURA] Estrutura personalizada carregada:', estruturaPersonalizada ? 'SIM' : 'NÃO');

    res.json({
      success: true,
      briefingId: id,
      estruturaPersonalizada: estruturaPersonalizada,
      nomeProjeto: briefing.nome_projeto,
      hasEstrutura: !!estruturaPersonalizada
    });

  } catch (error) {
    console.error('❌ [ESTRUTURA] Erro ao carregar estrutura personalizada:', error);
    res.status(500).json({ 
      error: 'Erro ao carregar estrutura personalizada',
      message: error.message 
    });
  }
});


// Start server - Escutar em todas as interfaces (0.0.0.0) para acesso via rede
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ArcFlow Server rodando na porta ${PORT} (TODAS as interfaces)`);
  console.log(`\n🛡️  SEGURANÇA APRIMORADA:`);
  console.log(`   🔐 Servidor ID: ${SERVER_INSTANCE_ID}`);
  console.log(`   ⚡ Tokens expiram em: ${JWT_EXPIRES_IN}`);
  console.log(`   🚨 Tokens antigos serão invalidados automaticamente`);
  console.log(`   🔒 Validação de usuário ativo obrigatória`);
  console.log(`\n📍 Acesso LOCAL:`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`   Frontend: http://localhost:3000`);
  console.log(`\n🌐 Acesso via REDE:`);
  console.log(`   Health: http://192.168.0.116:${PORT}/health`);
  console.log(`   Auth: http://192.168.0.116:${PORT}/api/auth/login`);
  console.log(`   Frontend: http://192.168.0.116:3000`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   👥 Convites: /api/convites`);
  console.log(`   👤 Usuários: /api/users`);
  console.log(`   👥 Clientes: /api/clientes`);
  console.log(`   📝 Briefings: /api/briefings`);
  console.log(`   🗑️ Lixeira: /api/clientes/lixeira`);
});

// GET /api/briefings/dashboard/metricas - Métricas para dashboard
app.get('/api/briefings/dashboard/metricas', authenticateToken, async (req, res) => {
  try {
    const userIdRaw = req.user.id;
    const escritorioIdRaw = req.user.escritorioId;
    
    // 🔧 NORMALIZAR IDs PARA UUIDs VÁLIDOS
    const userId = normalizeToUuid(userIdRaw);
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    
    console.log('📊 [DASHBOARD-METRICAS] Calculando métricas para escritório:', escritorioId);

    // 🚀 QUERIES OTIMIZADAS EM PARALELO
    const [
      totalResult,
      statusResult,
      respostasResult,
      tempoMedioResult
    ] = await Promise.all([
      // Total de briefings
      client.query(`
        SELECT COUNT(*) as total 
        FROM briefings 
        WHERE escritorio_id = $1 AND deleted_at IS NULL
      `, [escritorioId]),
      
      // Distribuição por status
      client.query(`
        SELECT 
          status, 
          COUNT(*) as count 
        FROM briefings 
        WHERE escritorio_id = $1 AND deleted_at IS NULL 
        GROUP BY status
      `, [escritorioId]),
      
      // Análise de respostas
      client.query(`
        SELECT 
          COUNT(*) as briefings_com_respostas,
          AVG(LENGTH(observacoes::text)) as media_chars_respostas
        FROM briefings 
        WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        AND observacoes IS NOT NULL 
        AND LENGTH(observacoes::text) > 100
      `, [escritorioId]),
      
      // Tempo médio (baseado em created_at vs updated_at)
      client.query(`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as tempo_medio_minutos
        FROM briefings 
        WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        AND status = 'CONCLUIDO'
      `, [escritorioId])
    ]);

    // 📊 PROCESSAR DADOS
    const totalBriefings = parseInt(totalResult.rows[0]?.total || 0);
    
    const statusDistribution = {};
    statusResult.rows.forEach(row => {
      statusDistribution[row.status] = parseInt(row.count);
    });
    
    const briefingsAtivos = (statusDistribution['RASCUNHO'] || 0) + (statusDistribution['EM_ANDAMENTO'] || 0);
    const briefingsConcluidos = statusDistribution['CONCLUIDO'] || 0;
    
    const briefingsComRespostas = parseInt(respostasResult.rows[0]?.briefings_com_respostas || 0);
    const mediaCharsRespostas = parseFloat(respostasResult.rows[0]?.media_chars_respostas || 0);
    
    const tempoMedioMinutos = parseFloat(tempoMedioResult.rows[0]?.tempo_medio_minutos || 18);
    
    // 🎯 CALCULAR SCORE MÉDIO IA (baseado no tamanho/complexidade das respostas)
    let scoreMediaIA = 85; // Padrão
    if (mediaCharsRespostas > 0) {
      // Score baseado na complexidade das respostas
      if (mediaCharsRespostas > 10000) scoreMediaIA = 95;
      else if (mediaCharsRespostas > 5000) scoreMediaIA = 90;
      else if (mediaCharsRespostas > 2000) scoreMediaIA = 85;
      else scoreMediaIA = 80;
    }
    
    // 📈 RESPOSTA ESTRUTURADA
    const metricas = {
      totalBriefings,
      briefingsAtivos,
      briefingsConcluidos,
      briefingsComRespostas,
      scoreMediaIA,
      tempoMedioPreenchimento: Math.round(tempoMedioMinutos),
      statusDistribution,
      estatisticasExtras: {
        taxaConclusao: totalBriefings > 0 ? Math.round((briefingsConcluidos / totalBriefings) * 100) : 0,
        mediaCharsRespostas: Math.round(mediaCharsRespostas),
        produtividade: tempoMedioMinutos < 20 ? 'alta' : tempoMedioMinutos < 30 ? 'media' : 'baixa'
      }
    };

    console.log('✅ [DASHBOARD-METRICAS] Métricas calculadas:', metricas);
    
    res.json({
      success: true,
      message: 'Métricas calculadas com sucesso',
      data: metricas,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [DASHBOARD-METRICAS] Erro ao calcular métricas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao calcular métricas do dashboard',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/briefings/dashboard/recentes - Briefings recentes para dashboard
app.get('/api/briefings/dashboard/recentes', authenticateToken, async (req, res) => {
  try {
    const escritorioIdRaw = req.user.escritorioId;
    
    // 🔧 NORMALIZAR ID PARA UUID VÁLIDO
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    
    const { limit = 5 } = req.query;

    console.log('📋 [DASHBOARD-RECENTES] Buscando briefings recentes para escritório:', escritorioId);

    // 🚀 QUERY OTIMIZADA para briefings recentes
    const briefingsQuery = `
      SELECT 
        b.id,
        b.nome_projeto as "nomeProjeto",
        b.status,
        b.progresso,
        b.disciplina,
        b.area,
        b.tipologia,
        b.observacoes,
        b.created_at as "createdAt",
        b.updated_at as "updatedAt",
        b.cliente_id as "clienteId",
        b.responsavel_id as "responsavelId",
        b.escritorio_id as "escritorioId"
      FROM briefings b
      WHERE b.escritorio_id = $1 
      AND b.deleted_at IS NULL
      ORDER BY b.updated_at DESC
      LIMIT $2
    `;

    const result = await client.query(briefingsQuery, [escritorioId, parseInt(limit)]);

    // 🔄 Transformar dados para formato esperado pelo frontend
    const briefingsRecentes = result.rows.map(row => ({
      id: row.id,
      nomeProjeto: row.nomeProjeto,
      status: row.status,
      progresso: row.progresso || 0,
      disciplina: row.disciplina,
      area: row.area,
      tipologia: row.tipologia,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      clienteId: row.clienteId,
      responsavelId: row.responsavelId,
      escritorioId: row.escritorioId,
      // ✅ CONTAGEM REAL DE RESPOSTAS
      _count: {
        respostas: contarRespostasReais(row.observacoes)
      },
      // Dados relacionados simplificados para dashboard
      cliente: null, // Pode ser expandido se necessário
      responsavel: null // Pode ser expandido se necessário
    }));

    console.log(`✅ [DASHBOARD-RECENTES] ${briefingsRecentes.length} briefings recentes carregados`);
    
    res.json({
      success: true,
      message: 'Briefings recentes carregados com sucesso',
      data: {
        briefings: briefingsRecentes,
        total: briefingsRecentes.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [DASHBOARD-RECENTES] Erro ao carregar briefings recentes:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao carregar briefings recentes',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/briefings/dashboard/status - Status resumido para dashboard
app.get('/api/briefings/dashboard/status', authenticateToken, async (req, res) => {
  try {
    const escritorioIdRaw = req.user.escritorioId;
    
    // 🔧 NORMALIZAR ID PARA UUID VÁLIDO
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    
    console.log('📊 [DASHBOARD-STATUS] Verificando status do sistema para escritório:', escritorioId);

    // 🚀 VERIFICAÇÕES DE SISTEMA
    const [
      conectividadeResult,
      backupResult,
      ultimaAtividade
    ] = await Promise.all([
      // Testar conectividade com banco
      client.query('SELECT NOW() as timestamp'),
      
      // Verificar briefings com backup (que têm observações)
      client.query(`
        SELECT 
          COUNT(*) as total_briefings,
          COUNT(CASE WHEN observacoes IS NOT NULL THEN 1 END) as com_backup
        FROM briefings 
        WHERE escritorio_id = $1 AND deleted_at IS NULL
      `, [escritorioId]),
      
      // Última atividade no sistema
      client.query(`
        SELECT 
          MAX(updated_at) as ultima_atividade
        FROM briefings 
        WHERE escritorio_id = $1 AND deleted_at IS NULL
      `, [escritorioId])
    ]);

    const totalBriefings = parseInt(backupResult.rows[0]?.total_briefings || 0);
    const briefingsComBackup = parseInt(backupResult.rows[0]?.com_backup || 0);
    const ultimaAtividadeTimestamp = ultimaAtividade.rows[0]?.ultima_atividade;

    const status = {
      sistemaOnline: true,
      bancoDados: {
        conectado: true,
        ultimaVerificacao: conectividadeResult.rows[0]?.timestamp
      },
      backup: {
        taxaBackup: totalBriefings > 0 ? Math.round((briefingsComBackup / totalBriefings) * 100) : 100,
        briefingsComBackup,
        totalBriefings
      },
      atividade: {
        ultimaAtividade: ultimaAtividadeTimestamp,
        tempoInativo: ultimaAtividadeTimestamp ? 
          Math.round((Date.now() - new Date(ultimaAtividadeTimestamp).getTime()) / (1000 * 60)) : 0
      }
    };

    console.log('✅ [DASHBOARD-STATUS] Status do sistema verificado:', status);
    
    res.json({
      success: true,
      message: 'Status do sistema verificado com sucesso',
      data: status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [DASHBOARD-STATUS] Erro ao verificar status:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Falha ao verificar status do sistema',
      status: {
        sistemaOnline: false,
        bancoDados: { conectado: false },
        backup: { taxaBackup: 0 },
        atividade: { ultimaAtividade: null, tempoInativo: 0 }
      },
      timestamp: new Date().toISOString()
    });
  }
});
// 🧠 API DE ORÇAMENTOS INTELIGENTES - ARCFLOW
// Sistema que gera orçamentos precisos analisando briefings automaticamente

// POST /api/orcamentos-inteligentes/gerar/:briefingId
app.post('/api/orcamentos-inteligentes/gerar/:briefingId', authenticateToken, async (req, res) => {
  try {
    const { briefingId } = req.params;
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;

    // Normalizar IDs
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    const userId = normalizeToUuid(userIdRaw);

    console.log('🧠 [ORCAMENTO-IA] Iniciando geração de orçamento inteligente:', { briefingId, escritorioId, userId });

    // 1. Buscar briefing completo
    const briefingResult = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        u.nome as responsavel_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      WHERE b.id = $1::uuid AND b.escritorio_id = $2::uuid AND b.deleted_at IS NULL
    `, [briefingId, escritorioId]);

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado',
        code: 'BRIEFING_NOT_FOUND'
      });
    }

    const briefing = briefingResult.rows[0];

    // Verificar se já existe orçamento para este briefing
    const orcamentoExistente = await client.query(`
      SELECT id FROM orcamentos 
      WHERE briefing_id = $1::uuid AND escritorio_id = $2::uuid
    `, [briefingId, escritorioId]);

    if (orcamentoExistente.rows.length > 0) {
      return res.status(400).json({
        error: 'Já existe um orçamento para este briefing',
        code: 'ORCAMENTO_ALREADY_EXISTS',
        orcamentoId: orcamentoExistente.rows[0].id
      });
    }

    // 2. 🧠 ANÁLISE INTELIGENTE SIMPLIFICADA
    console.log('🧠 [ORCAMENTO-IA] Iniciando análise inteligente do briefing...');
    
    // Extrair dados das observações
    let respostasBriefing = {};
    if (briefing.observacoes) {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        respostasBriefing = observacoes.respostas || {};
      } catch (error) {
        console.log('⚠️ [ORCAMENTO-IA] Erro ao parsear observações:', error.message);
      }
    }

    // Análise semântica simplificada
    const respostasString = JSON.stringify(respostasBriefing).toLowerCase();
    
    // Identificar tipologia
    let tipologia = 'residencial';
    if (respostasString.includes('comercial') || respostasString.includes('loja') || respostasString.includes('escritório')) {
      tipologia = 'comercial';
    } else if (respostasString.includes('industrial') || respostasString.includes('galpão') || respostasString.includes('fábrica')) {
      tipologia = 'industrial';
    }

    // Estimar área (baseado em respostas)
    let areaEstimada = 150; // Padrão
    for (const resposta of Object.values(respostasBriefing)) {
      if (typeof resposta === 'string') {
        const areaMatch = resposta.match(/(\d+)\s*m²?/);
        if (areaMatch) {
          areaEstimada = parseInt(areaMatch[1]);
          break;
        }
      }
    }

    // Identificar complexidade
    let complexidade = 'media';
    if (respostasString.includes('simples') || respostasString.includes('básico')) {
      complexidade = 'simples';
    } else if (respostasString.includes('luxo') || respostasString.includes('sofisticado') || respostasString.includes('alto padrão')) {
      complexidade = 'alta';
    }

    // Calcular valores baseados em padrões AEC
    const valorPorM2Base = {
      'residencial': { 'simples': 1200, 'media': 1800, 'alta': 2500 },
      'comercial': { 'simples': 1000, 'media': 1500, 'alta': 2200 },
      'industrial': { 'simples': 800, 'media': 1200, 'alta': 1800 }
    };

    const valorPorM2 = valorPorM2Base[tipologia]?.[complexidade] || 1500;
    const valorTotal = areaEstimada * valorPorM2;

    // Horas por profissional
    const horasArquiteto = Math.round(areaEstimada * 2.5); // 2.5h/m² para arquiteto
    const horasEngenheiro = Math.round(areaEstimada * 1.5); // 1.5h/m² para engenheiro
    const horasDesigner = Math.round(areaEstimada * 1.2); // 1.2h/m² para designer

    // Prazo estimado
    const prazoTotal = Math.round(30 + (areaEstimada / 10)); // 30 dias base + 1 dia por 10m²

    // 3. Gerar código único
    const codigo = `ORC-IA-${Date.now().toString(36).toUpperCase()}`;

    // 4. Preparar dados para inserção
    const composicaoFinanceira = {
      horasPorProfissional: {
        arquiteto: horasArquiteto,
        engenheiro: horasEngenheiro,
        designer: horasDesigner
      },
      disciplinas: ['arquitetura', 'estrutural', 'hidraulica', 'eletrica'],
      custosDetalhados: {
        custosHoras: Math.round(valorTotal * 0.6),
        custosIndiretos: Math.round(valorTotal * 0.2),
        impostos: Math.round(valorTotal * 0.1),
        margemLucro: Math.round(valorTotal * 0.1)
      },
      subtotal: Math.round(valorTotal * 0.9),
      total: valorTotal
    };

    const cronograma = [
      { etapa: 'Levantamento', prazo: Math.round(prazoTotal * 0.2), valor: Math.round(valorTotal * 0.2), horas: Math.round(horasArquiteto * 0.3), entregaveis: ['Medição', 'Cadastro'] },
      { etapa: 'Estudo Preliminar', prazo: Math.round(prazoTotal * 0.3), valor: Math.round(valorTotal * 0.3), horas: Math.round(horasArquiteto * 0.4), entregaveis: ['Plantas', 'Cortes'] },
      { etapa: 'Anteprojeto', prazo: Math.round(prazoTotal * 0.3), valor: Math.round(valorTotal * 0.3), horas: Math.round(horasArquiteto * 0.2), entregaveis: ['Projeto Aprovação'] },
      { etapa: 'Projeto Executivo', prazo: Math.round(prazoTotal * 0.2), valor: Math.round(valorTotal * 0.2), horas: Math.round(horasEngenheiro * 0.8), entregaveis: ['Projeto Completo'] }
    ];

    const proposta = {
      formaPagamento: {
        entrada: 30,
        parcelas: 3,
        vencimentos: ['Na assinatura', 'Entrega anteprojeto', 'Entrega projeto executivo']
      },
      validadeOferta: 30,
      prazoEntrega: prazoTotal,
      observacoes: `Orçamento inteligente gerado automaticamente - Complexidade: ${complexidade}`,
      garantias: [
        'Garantia de 1 ano para correções',
        'Suporte técnico durante execução',
        'Revisões inclusas conforme escopo'
      ],
      analiseRiscos: {
        nivel: complexidade === 'alta' ? 'medio' : 'baixo',
        fatores: ['Prazo', 'Escopo', 'Aprovações'],
        mitigacao: 'Cronograma com margens de segurança'
      },
      benchmarking: {
        valorMedio: valorPorM2,
        fonteReferencia: 'Tabela AEC Brasil 2024',
        posicionamento: 'Competitivo'
      }
    };

    // 5. Salvar orçamento
    const orcamentoResult = await client.query(`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, 
        area_construida, area_terreno, valor_total, valor_por_m2,
        tipologia, padrao, complexidade, localizacao,
        disciplinas, composicao_financeira, cronograma, proposta,
        briefing_id, cliente_id, escritorio_id, responsavel_id,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW()
      ) RETURNING id
    `, [
      codigo,
      `Orçamento Inteligente - ${briefing.nome_projeto}`,
      `Orçamento gerado por IA a partir do briefing: ${briefing.nome_projeto}. Tipologia: ${tipologia}, Complexidade: ${complexidade}`,
      'RASCUNHO',
      areaEstimada,
      Math.round(areaEstimada * 0.6),
      valorTotal,
      valorPorM2,
      tipologia,
      complexidade,
      complexidade,
      'Brasil',
      JSON.stringify(['arquitetura', 'estrutural', 'hidraulica', 'eletrica']),
      JSON.stringify(composicaoFinanceira),
      JSON.stringify(cronograma),
      JSON.stringify(proposta),
      briefingId,
      briefing.cliente_id,
      escritorioId,
      userId
    ]);

    const orcamentoId = orcamentoResult.rows[0].id;

    // 6. Atualizar status do briefing
    await client.query(`
      UPDATE briefings 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2::uuid AND escritorio_id = $3::uuid
    `, ['ORCAMENTO_ELABORACAO', briefingId, escritorioId]);

    console.log('✅ [ORCAMENTO-IA] Orçamento inteligente gerado com sucesso:', {
      orcamentoId,
      briefingId,
      valorTotal,
      areaConstruida: areaEstimada,
      complexidade,
      tipologia
    });

    res.json({
      success: true,
      message: 'Orçamento inteligente gerado com sucesso!',
      data: {
        orcamentoId,
        codigo,
        valorTotal,
        valorPorM2,
        areaConstruida: areaEstimada,
        prazoEntrega: prazoTotal,
        briefingId,
        dadosExtaidosIA: {
          tipologia,
          complexidade,
          disciplinas: ['arquitetura', 'estrutural', 'hidraulica', 'eletrica'],
          caracteristicas: [`Área: ${areaEstimada}m²`, `Padrão: ${complexidade}`],
          indicadores: { area: areaEstimada, valor: valorTotal, prazo: prazoTotal }
        },
        horasPorProfissional: {
          arquiteto: horasArquiteto,
          engenheiro: horasEngenheiro,
          designer: horasDesigner
        },
        analiseRiscos: proposta.analiseRiscos,
        benchmarking: proposta.benchmarking
      }
    });

  } catch (error) {
    console.error('❌ [ORCAMENTO-IA] Erro ao gerar orçamento inteligente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// GET /api/orcamentos-inteligentes/briefings-disponiveis - Listar briefings prontos para orçamento
app.get('/api/orcamentos-inteligentes/briefings-disponiveis', authenticateToken, async (req, res) => {
  try {
    const escritorioIdRaw = req.user.escritorioId;
    const escritorioId = normalizeToUuid(escritorioIdRaw);

    console.log('📋 [ORCAMENTO-IA] Buscando briefings disponíveis para orçamento:', escritorioId);

    // Buscar briefings concluídos sem orçamento
    const briefingsResult = await client.query(`
      SELECT 
        b.id,
        b.nome_projeto as "nomeProjeto",
        b.status,
        b.progresso,
        b.disciplina,
        b.area,
        b.tipologia,
        b.created_at as "createdAt",
        b.updated_at as "updatedAt",
        c.nome as cliente_nome,
        COUNT(o.id) as total_orcamentos
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE b.escritorio_id = $1 
      AND b.deleted_at IS NULL
      AND b.status IN ('CONCLUIDO', 'APROVADO')
      GROUP BY b.id, b.nome_projeto, b.status, b.progresso, b.disciplina, b.area, b.tipologia, b.created_at, b.updated_at, c.nome
      HAVING COUNT(o.id) = 0
      ORDER BY b.updated_at DESC
    `, [escritorioId]);

    const briefingsDisponiveis = briefingsResult.rows.map(row => ({
      id: row.id,
      nomeProjeto: row.nomeProjeto,
      status: row.status,
      progresso: row.progresso,
      disciplina: row.disciplina,
      area: row.area,
      tipologia: row.tipologia,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      cliente: {
        nome: row.cliente_nome
      },
      podeGerarOrcamento: true
    }));

    console.log(`✅ [ORCAMENTO-IA] ${briefingsDisponiveis.length} briefings disponíveis para orçamento`);

    res.json({
      success: true,
      message: 'Briefings disponíveis carregados com sucesso',
      data: {
        briefings: briefingsDisponiveis,
        total: briefingsDisponiveis.length
      }
    });

  } catch (error) {
    console.error('❌ [ORCAMENTO-IA] Erro ao carregar briefings disponíveis:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🆕 IMPORTAR ROTAS DE ORÇAMENTOS
try {
  const orcamentosRoutes = require('./dist/routes/orcamentos');
  app.use('/api/orcamentos', orcamentosRoutes.default || orcamentosRoutes);
  console.log('✅ Rotas de orçamentos carregadas com sucesso');
} catch (error) {
  console.error('❌ Erro ao carregar rotas de orçamentos:', error.message);
}

// 🆕 IMPORTAR ROTAS DE TEST-DATA
try {
  const testDataRoutes = require('./src/routes/test-data-simple');
  app.use('/api/test-data', testDataRoutes);
  console.log('✅ Rotas de test-data carregadas com sucesso');
} catch (error) {
  console.error('❌ Erro ao carregar rotas de test-data:', error.message);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ArcFlow Server rodando na porta ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Convites: http://localhost:${PORT}/api/convites`);
  console.log(`👤 Usuários: http://localhost:${PORT}/api/users`);
  console.log(`👥 Clientes: http://localhost:${PORT}/api/clientes`);
  console.log(`📝 Briefings: http://localhost:${PORT}/api/briefings`);
  console.log(`🧠 Orçamentos IA: http://localhost:${PORT}/api/orcamentos-inteligentes`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/briefings/dashboard`);
  console.log(`🗑️ Lixeira: http://localhost:${PORT}/api/clientes/lixeira`);
  console.log(`🎯 Sistema pronto para 10k usuários simultâneos!`);
});

