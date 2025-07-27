/**
 * 🛣️ ROTEADOR PRINCIPAL
 * 
 * Organização centralizada de todas as rotas da API
 */

const express = require('express');
const router = express.Router();

// Importar rotas organizadas
const authRoutes = require('./auth');
const userRoutes = require('./users');
const clienteRoutes = require('./clientes');
const briefingRoutes = require('./briefings');
const orcamentoRoutes = require('./orcamentos');
const conviteRoutes = require('./convites');

// Health check da API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      auth: 'active',
      api: 'running'
    },
    version: '2.0.0'
  });
});

// ===== ROTAS ORGANIZADAS =====

// Autenticação e autorização
router.use('/auth', authRoutes);

// Gestão de usuários
router.use('/users', userRoutes);

// Sistema de convites
router.use('/convites', conviteRoutes);

// Gestão de clientes
router.use('/clientes', clienteRoutes);

// Sistema de briefings
router.use('/briefings', briefingRoutes);

// Sistema de orçamentos (novo e melhorado)
router.use('/orcamentos', orcamentoRoutes);
router.use('/orcamentos-inteligentes', orcamentoRoutes); // Compatibilidade

// Rota de informações da API
router.get('/info', (req, res) => {
  res.json({
    name: 'ArcFlow API',
    version: '2.0.0',
    description: 'Sistema de Gestão para Arquitetura e Engenharia',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      convites: '/api/convites',
      clientes: '/api/clientes',
      briefings: '/api/briefings',
      orcamentos: '/api/orcamentos'
    },
    features: [
      'Autenticação JWT',
      'Briefings Inteligentes',
      'Orçamentos Automáticos',
      'Gestão de Clientes',
      'Sistema Multi-tenant',
      'Rate Limiting',
      'Logs Estruturados'
    ],
    documentation: '/docs',
    support: 'contato@arcflow.com.br'
  });
});

// Middleware para rotas não encontradas na API
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    code: 'API_ENDPOINT_NOT_FOUND',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/auth',
      '/api/users',
      '/api/convites',
      '/api/clientes',
      '/api/briefings',
      '/api/orcamentos'
    ]
  });
});

module.exports = router;