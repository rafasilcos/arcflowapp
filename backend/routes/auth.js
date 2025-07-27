/**
 * 🔐 ROTAS DE AUTENTICAÇÃO
 * 
 * Rotas organizadas para autenticação e autorização
 */

const express = require('express');
const router = express.Router();

// Importar controladores
const authController = require('../controllers/authController');

// Importar middleware
const { loginLimiter, statusLimiter } = require('../config/rateLimiting');
const { asyncErrorHandler } = require('../middleware/errorHandler');

// ===== ROTAS DE AUTENTICAÇÃO =====

/**
 * POST /api/auth/login
 * Login de usuário com email e senha
 */
router.post('/login', 
  loginLimiter,
  asyncErrorHandler(authController.login)
);

/**
 * POST /api/auth/register
 * Registro de novo usuário e escritório
 */
router.post('/register',
  asyncErrorHandler(authController.register)
);

/**
 * GET /api/auth/me
 * Obter dados do usuário autenticado
 */
router.get('/me',
  asyncErrorHandler(authController.me)
);

/**
 * GET /api/auth/status
 * Validar token JWT do usuário
 */
router.get('/status',
  statusLimiter,
  asyncErrorHandler(authController.status)
);

/**
 * POST /api/auth/heartbeat
 * Manter sessão ativa
 */
router.post('/heartbeat',
  statusLimiter,
  asyncErrorHandler(authController.heartbeat)
);

/**
 * POST /api/auth/refresh
 * Renovar token de acesso
 */
router.post('/refresh',
  asyncErrorHandler(authController.refresh)
);

/**
 * POST /api/auth/logout
 * Logout do usuário (invalidar tokens)
 */
router.post('/logout',
  asyncErrorHandler(authController.logout)
);

/**
 * POST /api/auth/forgot-password
 * Solicitar reset de senha
 */
router.post('/forgot-password',
  asyncErrorHandler(authController.forgotPassword)
);

/**
 * POST /api/auth/reset-password
 * Resetar senha com token
 */
router.post('/reset-password',
  asyncErrorHandler(authController.resetPassword)
);

/**
 * POST /api/auth/change-password
 * Alterar senha (usuário autenticado)
 */
router.post('/change-password',
  asyncErrorHandler(authController.changePassword)
);

module.exports = router;