/**
 * 🔐 CONTROLADOR DE AUTENTICAÇÃO
 * 
 * Lógica de controle para autenticação e autorização
 */

const authService = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');

const authController = {
  /**
   * Login de usuário
   */
  async login(req, res) {
    const { email, password } = req.body;
    
    // Validação básica
    if (!email || !password) {
      throw new AppError('Email e senha são obrigatórios', 400, 'MISSING_CREDENTIALS');
    }
    
    // Executar login
    const result = await authService.login(email, password);
    
    res.json({
      message: 'Login realizado com sucesso',
      ...result
    });
  },

  /**
   * Registro de usuário
   */
  async register(req, res) {
    const userData = req.body;
    
    // Validação básica
    const { nome, email, password, escritorio } = userData;
    if (!nome || !email || !password || !escritorio?.nome) {
      throw new AppError(
        'Dados obrigatórios: nome, email, password, escritorio.nome', 
        400, 
        'MISSING_REQUIRED_FIELDS'
      );
    }
    
    // Executar registro
    const result = await authService.register(userData);
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      ...result
    });
  },

  /**
   * Obter dados do usuário atual
   */
  async me(req, res) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acesso requerido', 401, 'MISSING_TOKEN');
    }
    
    const token = authHeader.substring(7);
    const userData = await authService.getUserFromToken(token);
    
    res.json({
      user: userData.user,
      escritorio: userData.escritorio
    });
  },

  /**
   * Validar status do token
   */
  async status(req, res) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        valid: false,
        error: 'Token não fornecido',
        code: 'MISSING_TOKEN'
      });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const userData = await authService.validateToken(token);
      
      res.json({
        valid: true,
        user: userData.user,
        escritorio: userData.escritorio,
        expiresIn: userData.expiresIn
      });
    } catch (error) {
      res.status(401).json({
        valid: false,
        error: error.message,
        code: 'INVALID_TOKEN'
      });
    }
  },

  /**
   * Heartbeat para manter sessão ativa
   */
  async heartbeat(req, res) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acesso requerido', 401, 'MISSING_TOKEN');
    }
    
    const token = authHeader.substring(7);
    const result = await authService.heartbeat(token);
    
    res.json({
      message: 'Sessão atualizada',
      ...result
    });
  },

  /**
   * Renovar token de acesso
   */
  async refresh(req, res) {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError('Refresh token requerido', 400, 'MISSING_REFRESH_TOKEN');
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      message: 'Token renovado com sucesso',
      ...result
    });
  },

  /**
   * Logout do usuário
   */
  async logout(req, res) {
    const authHeader = req.headers.authorization;
    const { refreshToken } = req.body;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      await authService.logout(accessToken, refreshToken);
    }
    
    res.json({
      message: 'Logout realizado com sucesso'
    });
  },

  /**
   * Solicitar reset de senha
   */
  async forgotPassword(req, res) {
    const { email } = req.body;
    
    if (!email) {
      throw new AppError('Email é obrigatório', 400, 'MISSING_EMAIL');
    }
    
    await authService.forgotPassword(email);
    
    res.json({
      message: 'Se o email existir, você receberá instruções para reset de senha'
    });
  },

  /**
   * Resetar senha com token
   */
  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      throw new AppError('Token e nova senha são obrigatórios', 400, 'MISSING_REQUIRED_FIELDS');
    }
    
    await authService.resetPassword(token, newPassword);
    
    res.json({
      message: 'Senha alterada com sucesso'
    });
  },

  /**
   * Alterar senha (usuário autenticado)
   */
  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!currentPassword || !newPassword) {
      throw new AppError('Senha atual e nova senha são obrigatórias', 400, 'MISSING_REQUIRED_FIELDS');
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acesso requerido', 401, 'MISSING_TOKEN');
    }
    
    const token = authHeader.substring(7);
    await authService.changePassword(token, currentPassword, newPassword);
    
    res.json({
      message: 'Senha alterada com sucesso'
    });
  }
};

module.exports = authController;