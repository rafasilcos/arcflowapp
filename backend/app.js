/**
 * 🚀 ARCFLOW - APLICAÇÃO PRINCIPAL
 * 
 * Configuração central do Express com middleware e rotas organizadas
 * Substitui o sistema monolítico anterior de forma modular e escalável
 */

const express = require('express');
const compression = require('compression');

// Importar configurações
const { corsConfig } = require('./config/cors');
const { securityConfig } = require('./config/security');
const { rateLimitConfig } = require('./config/rateLimiting');

// Importar middleware
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

// Importar rotas
const routes = require('./routes');

// Criar aplicação Express
const app = express();

// ===== MIDDLEWARE GLOBAIS =====

// Compressão GZIP para performance
app.use(compression());

// Configurações de segurança
app.use(securityConfig);

// CORS configurado para rede local
app.use(corsConfig);

// Rate limiting otimizado
app.use(rateLimitConfig);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de requisições
app.use(requestLogger);

// ===== ROTAS =====

// Health check simples
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ArcFlow API',
    version: '2.0.0'
  });
});

// Rotas da API organizadas
app.use('/api', routes);

// ===== TRATAMENTO DE ERROS =====

// Handler de erros centralizado
app.use(errorHandler);

// Handler para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl
  });
});

module.exports = app;