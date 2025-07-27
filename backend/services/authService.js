/**
 * 🔐 SERVIÇO DE AUTENTICAÇÃO
 * 
 * Toda a lógica de negócio para autenticação e autorização
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const { getClient } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Configurações JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'arcflow-super-secret-refresh-jwt-key-development-2024',
  expiresIn: '4h',
  refreshExpiresIn: '30d'
};

// ID único do servidor para invalidar sessões antigas
const SERVER_INSTANCE_ID = Date.now().toString();

const authService = {
  /**
   * Login de usuário
   */
  async login(email, password) {
    const client = getClient();
    
    try {
      // Buscar usuário com dados do escritório
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
        throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
      }

      const user = result.rows[0];

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
      }

      // Atualizar último login
      await client.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]);

      // Gerar tokens
      const tokens = this.generateTokens(user);
      await this.saveRefreshToken(tokens.refreshToken, user.id);

      console.log('✅ Login realizado:', user.email);

      return {
        token: tokens.accessToken, // Campo compatível com frontend
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
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: JWT_CONFIG.expiresIn
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro no login:', error);
      throw new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR');
    }
  },

  /**
   * Registro de usuário
   */
  async register(userData) {
    const client = getClient();
    const { nome, email, password, escritorio, planId = 'plan_free' } = userData;

    try {
      // Validações
      if (password.length < 6) {
        throw new AppError('Senha deve ter pelo menos 6 caracteres', 400, 'WEAK_PASSWORD');
      }

      // Verificar se email já existe
      const existingUser = await client.query(`SELECT id FROM users WHERE email = $1`, [email]);
      if (existingUser.rows.length > 0) {
        throw new AppError('Email já está em uso', 409, 'EMAIL_ALREADY_EXISTS');
      }

      // Verificar se plano existe
      const planExists = await client.query(`SELECT id FROM plans WHERE id = $1`, [planId]);
      if (planExists.rows.length === 0) {
        throw new AppError('Plano não encontrado', 400, 'INVALID_PLAN');
      }

      // Hash da senha
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Iniciar transação
      await client.query('BEGIN');

      try {
        // Criar escritório
        const escritorioId = uuidv4();
        await client.query(`
          INSERT INTO escritorios (id, nome, email, cnpj, telefone, plan_id, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
        `, [
          escritorioId,
          escritorio.nome,
          escritorio.email || email,
          escritorio.cnpj || null,
          escritorio.telefone || null,
          planId
        ]);

        // Criar usuário
        const userId = uuidv4();
        await client.query(`
          INSERT INTO users (id, nome, email, password_hash, role, escritorio_id, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
        `, [userId, nome, email, passwordHash, 'ADMIN', escritorioId]);

        // Commit da transação
        await client.query('COMMIT');

        console.log('✅ Usuário registrado:', email);

        // Fazer login automático
        return await this.login(email, password);

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro no registro:', error);
      throw new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR');
    }
  },

  /**
   * Obter usuário a partir do token
   */
  async getUserFromToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      
      // Verificar se token é do servidor atual
      if (decoded.serverInstanceId !== SERVER_INSTANCE_ID) {
        throw new AppError('Token inválido', 401, 'INVALID_TOKEN');
      }

      const client = getClient();
      const result = await client.query(`
        SELECT u.*, 
               e.nome as escritorio_nome, 
               e.cnpj as escritorio_cnpj,
               e.telefone as escritorio_telefone,
               e.email as escritorio_email,
               e.plan_id 
        FROM users u 
        JOIN escritorios e ON u.escritorio_id = e.id 
        WHERE u.id = $1 AND u.is_active = true AND e.is_active = true
      `, [decoded.id]);

      if (result.rows.length === 0) {
        throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
      }

      const user = result.rows[0];

      return {
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
          nome: user.escritorio_nome,
          cnpj: user.escritorio_cnpj,
          telefone: user.escritorio_telefone,
          email: user.escritorio_email
        }
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
      }
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao validar token', 500, 'TOKEN_VALIDATION_ERROR');
    }
  },

  /**
   * Validar token
   */
  async validateToken(token) {
    const userData = await this.getUserFromToken(token);
    
    // Calcular tempo restante do token
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    
    return {
      ...userData,
      expiresIn: expiresIn > 0 ? expiresIn : 0
    };
  },

  /**
   * Heartbeat - manter sessão ativa
   */
  async heartbeat(token) {
    const userData = await this.getUserFromToken(token);
    
    // Atualizar última atividade
    const client = getClient();
    await client.query(`UPDATE users SET last_activity = NOW() WHERE id = $1`, [userData.user.id]);
    
    return {
      user: userData.user,
      escritorio: userData.escritorio,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Renovar token de acesso
   */
  async refreshToken(refreshToken) {
    const client = getClient();
    
    try {
      // Verificar refresh token
      const decoded = jwt.verify(refreshToken, JWT_CONFIG.refreshSecret);
      
      // Verificar se token existe no banco
      const tokenResult = await client.query(`
        SELECT rt.*, u.* 
        FROM refresh_tokens rt
        JOIN users u ON rt.user_id = u.id
        WHERE rt.token = $1 AND rt.expires_at > NOW()
      `, [refreshToken]);

      if (tokenResult.rows.length === 0) {
        throw new AppError('Refresh token inválido', 401, 'INVALID_REFRESH_TOKEN');
      }

      const user = tokenResult.rows[0];

      // Gerar novos tokens
      const tokens = this.generateTokens(user);
      
      // Salvar novo refresh token e remover o antigo
      await client.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]);
      await this.saveRefreshToken(tokens.refreshToken, user.id);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: JWT_CONFIG.expiresIn
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token inválido', 401, 'INVALID_REFRESH_TOKEN');
      }
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao renovar token', 500, 'TOKEN_REFRESH_ERROR');
    }
  },

  /**
   * Logout do usuário
   */
  async logout(accessToken, refreshToken) {
    const client = getClient();
    
    try {
      // Remover refresh token se fornecido
      if (refreshToken) {
        await client.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken]);
      }
      
      // TODO: Implementar blacklist de access tokens se necessário
      
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      // Não falhar o logout por erro de limpeza
    }
  },

  /**
   * Gerar tokens JWT
   */
  generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      escritorioId: user.escritorio_id,
      serverInstanceId: SERVER_INSTANCE_ID,
      issuedAt: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(payload, JWT_CONFIG.secret, { 
      expiresIn: JWT_CONFIG.expiresIn,
      issuer: 'arcflow-api',
      audience: 'arcflow-client'
    });

    const refreshToken = jwt.sign(
      { 
        userId: user.id,
        serverInstanceId: SERVER_INSTANCE_ID,
        issuedAt: Math.floor(Date.now() / 1000)
      }, 
      JWT_CONFIG.refreshSecret, 
      { 
        expiresIn: JWT_CONFIG.refreshExpiresIn,
        issuer: 'arcflow-api',
        audience: 'arcflow-client'
      }
    );

    return { accessToken, refreshToken };
  },

  /**
   * Salvar refresh token no banco
   */
  async saveRefreshToken(token, userId) {
    const client = getClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    try {
      // Deletar tokens antigos do usuário
      await client.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
      
      // Inserir novo token
      await client.query(`
        INSERT INTO refresh_tokens (id, token, user_id, expires_at, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [uuidv4(), token, userId, expiresAt]);

      console.log('✅ Refresh token salvo para usuário:', userId);
    } catch (error) {
      console.error('❌ Erro ao salvar refresh token:', error);
      throw new AppError('Erro ao salvar token', 500, 'TOKEN_SAVE_ERROR');
    }
  },

  /**
   * Solicitar reset de senha
   */
  async forgotPassword(email) {
    // TODO: Implementar reset de senha por email
    console.log('📧 Reset de senha solicitado para:', email);
    // Por enquanto, apenas log - implementar envio de email depois
  },

  /**
   * Resetar senha com token
   */
  async resetPassword(token, newPassword) {
    // TODO: Implementar reset de senha
    console.log('🔑 Reset de senha com token');
    throw new AppError('Funcionalidade não implementada', 501, 'NOT_IMPLEMENTED');
  },

  /**
   * Alterar senha (usuário autenticado)
   */
  async changePassword(token, currentPassword, newPassword) {
    const userData = await this.getUserFromToken(token);
    const client = getClient();
    
    try {
      // Buscar senha atual
      const result = await client.query(`
        SELECT password_hash FROM users WHERE id = $1
      `, [userData.user.id]);

      if (result.rows.length === 0) {
        throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
      }

      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
      if (!isValidPassword) {
        throw new AppError('Senha atual incorreta', 400, 'INVALID_CURRENT_PASSWORD');
      }

      // Hash da nova senha
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Atualizar senha
      await client.query(`
        UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2
      `, [newPasswordHash, userData.user.id]);

      console.log('✅ Senha alterada para usuário:', userData.user.email);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro ao alterar senha:', error);
      throw new AppError('Erro interno do servidor', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
};

module.exports = authService;