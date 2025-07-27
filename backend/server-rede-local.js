// 🌐 SERVIDOR ARCFLOW - CONFIGURAÇÃO REDE LOCAL
// Baseado no server-simple.js original
// Configurado automaticamente para IP: 192.168.68.145
// MODIFICAÇÕES: Apenas CORS e bind (0.0.0.0), mantendo todas as funcionalidades

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
const helmet = require('helmet');

const app = express();
const PORT = 3001;

console.log('🌐 Iniciando ArcFlow Backend para Rede Local...');
console.log('📡 IP detectado:', '192.168.68.145');
console.log('🌍 Subnet:', '192.168.68.0/24');

// Rate limiting - PROTEÇÃO BÁSICA CONTRA ATAQUES
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por IP (muito permissivo para não quebrar)
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para login (mais restritivo)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 50 tentativas de login por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🌐 CONFIGURAÇÃO CORS PARA REDE LOCAL - MODIFICAÇÃO PRINCIPAL
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Desenvolvimento local
    'http://127.0.0.1:3000',          // Local alternativo
    'http://192.168.68.145:3000',     // IP específico da máquina
    /^http:\/\/192\.168\.68\.\d{1,3}:3000$/  // Toda a subnet 192.168.68.x
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(compression()); // Compressão GZIP para melhor performance
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/', generalLimiter); // Aplicar rate limiting apenas nas APIs
app.use(helmet());

// Database connection
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

// JWT Config
const JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024';
const JWT_REFRESH_SECRET = 'arcflow-super-secret-refresh-jwt-key-development-2024';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

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
  emailTransporter = nodemailer.createTransporter(EMAIL_CONFIG);
    console.log('📧 Sistema de email fallback configurado com credenciais');
} catch (error) {
    console.warn('⚠️ Sistema de email fallback com erro:', error.message);
  }
} else {
  console.log('⚠️ Sistema de email fallback desabilitado (sem credenciais SMTP_USER/SMTP_PASS)');
}

// Connect to database
client.connect()
  .then(() => {
    console.log('✅ Conectado ao Supabase');
  })
  .catch(err => console.error('❌ Erro na conexão:', err));

// 🚀 IMPORTAR TODAS AS ROTAS DO SERVIDOR ORIGINAL
// Vamos carregar dinamicamente o servidor original para evitar conflitos
const fs = require('fs');
const path = require('path');

// Ler o arquivo do servidor original
const originalServerPath = path.join(__dirname, 'server-simple.js');
const originalServerContent = fs.readFileSync(originalServerPath, 'utf8');

// Extrair apenas as rotas e funções, excluindo o app.listen
const routesStartIndex = originalServerContent.indexOf('// Utility functions');
const routesEndIndex = originalServerContent.lastIndexOf('app.listen');

if (routesStartIndex !== -1 && routesEndIndex !== -1) {
  const routesCode = originalServerContent.substring(routesStartIndex, routesEndIndex);
  
  // Executar o código das rotas no contexto atual
  try {
    eval(routesCode);
    console.log('✅ Rotas do servidor original carregadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao carregar rotas:', error);
  }
} else {
  console.warn('⚠️ Não foi possível extrair rotas do servidor original');
}

// Exibir informações de rede
console.log('\n🌐 === INFORMAÇÕES DE REDE ===');
console.log('🖥️  IP da máquina:', '192.168.68.145');
console.log('📡 Interface:', 'Wi-Fi');
console.log('🌍 Subnet:', '192.168.68.0/24');
console.log('🚀 Backend:', 'http://192.168.68.145:3001');
console.log('🎨 Frontend:', 'http://192.168.68.145:3000');
console.log('================================\n');

// 🌐 INICIAR SERVIDOR EM TODAS AS INTERFACES (0.0.0.0) - MODIFICAÇÃO PRINCIPAL
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🎉 === SERVIDOR REDE LOCAL INICIADO ===');
  console.log('🌐 Servidor rodando em todas as interfaces de rede');
  console.log('📡 Acesso local: http://localhost:3001');
  console.log('🌍 Acesso rede local: http://192.168.68.145:3001');
  console.log('📱 Outros computadores podem acessar via IP da rede');
  console.log('🔐 CORS configurado para subnet 192.168.68.0/24');
  console.log('⚡ Sistema pronto para receber conexões da rede local!');
  console.log('=========================================\n');
});

// Exportar o app para ser usado por outros módulos
module.exports = app;
