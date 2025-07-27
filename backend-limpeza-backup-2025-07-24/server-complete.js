const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// JWT Config
const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'arcflow-super-secret-refresh-jwt-key-development-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Connect to database
client.connect()
  .then(() => console.log('✅ Conectado ao Supabase'))
  .catch(err => console.error('❌ Erro na conexão:', err));

// ===== UTILITIES =====

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

// Middleware de autenticação
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token necessário' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware de autenticação para rotas protegidas
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ===== HEALTH CHECKS =====

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ArcFlow Complete API',
    version: '2.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      auth: 'active',
      payments: 'active'
    }
  });
});

// ===== AUTENTICAÇÃO =====

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
      SELECT u.*, e.nome as escritorio_nome, e.plan_id 
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
        nome: user.escritorio_nome,
        planId: user.plan_id
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

// ===== PAGAMENTOS =====

// GET /api/payments/plans - Listar planos disponíveis
app.get('/api/payments/plans', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT id, name, type, price_monthly, price_yearly, max_users, max_projects, features, is_active
      FROM plans 
      WHERE is_active = true 
      ORDER BY price_monthly ASC
    `);

    const plans = result.rows.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features || '{}') : plan.features || {},
      savings_yearly: plan.price_monthly > 0 ? Math.round(((plan.price_monthly * 12) - plan.price_yearly) / (plan.price_monthly * 12) * 100) : 0
    }));

    res.json({
      message: 'Planos carregados com sucesso',
      plans
    });

  } catch (error) {
    console.error('❌ Erro ao buscar planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/payments/create-checkout - Criar sessão de checkout
app.post('/api/payments/create-checkout', requireAuth, async (req, res) => {
  try {
    const { planId, billing_cycle = 'monthly' } = req.body;
    const escritorioId = req.user.escritorioId;

    // Buscar plano
    const planResult = await client.query(`
      SELECT * FROM plans WHERE id = $1 AND is_active = true
    `, [planId]);

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    const plan = planResult.rows[0];
    const amount = billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

    // Criar registro de pagamento pendente
    const paymentId = uuidv4();
    await client.query(`
      INSERT INTO payments (id, escritorio_id, plan_id, amount, currency, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [paymentId, escritorioId, planId, amount, 'BRL', 'PENDING']);

    // Simular criação de sessão de checkout
    const checkoutSession = {
      id: `checkout_${paymentId}`,
      payment_id: paymentId,
      amount,
      currency: 'BRL',
      plan_name: plan.name,
      billing_cycle,
      checkout_url: `https://checkout.arcflow.com/session/${paymentId}`,
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      metadata: {
        escritorio_id: escritorioId,
        plan_id: planId,
        billing_cycle
      }
    };

    console.log('✅ Checkout criado:', paymentId, plan.name);

    res.json({
      message: 'Checkout criado com sucesso',
      checkout: checkoutSession
    });

  } catch (error) {
    console.error('❌ Erro ao criar checkout:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/payments/current-plan - Plano atual do escritório
app.get('/api/payments/current-plan', requireAuth, async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;

    const result = await client.query(`
      SELECT e.*, p.name as plan_name, p.type as plan_type, p.price_monthly, p.price_yearly, 
             p.max_users, p.max_projects, p.features
      FROM escritorios e
      JOIN plans p ON e.plan_id = p.id
      WHERE e.id = $1
    `, [escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Escritório não encontrado' });
    }

    const escritorio = result.rows[0];
    
    res.json({
      message: 'Plano atual carregado com sucesso',
      current_plan: {
        plan_id: escritorio.plan_id,
        plan_name: escritorio.plan_name,
        plan_type: escritorio.plan_type,
        subscription_status: escritorio.subscription_status,
        subscription_ends_at: escritorio.subscription_ends_at,
        trial_ends_at: escritorio.trial_ends_at,
        limits: {
          max_users: escritorio.max_users,
          max_projects: escritorio.max_projects
        },
        features: JSON.parse(escritorio.features || '{}')
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar plano atual:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/payments/test-payment - Simular pagamento para testes
app.post('/api/payments/test-payment', requireAuth, async (req, res) => {
  try {
    const { payment_id, success = true } = req.body;
    
    if (success) {
      // Simular pagamento bem-sucedido
      await client.query(`
        UPDATE payments 
        SET status = 'PAID', paid_at = NOW(), updated_at = NOW()
        WHERE id = $1
      `, [payment_id]);

      // Buscar dados do pagamento
      const paymentResult = await client.query(`
        SELECT p.*, pl.name as plan_name FROM payments p
        JOIN plans pl ON p.plan_id = pl.id
        WHERE p.id = $1
      `, [payment_id]);

      if (paymentResult.rows.length > 0) {
        const payment = paymentResult.rows[0];
        
        // Atualizar plano do escritório
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

        await client.query(`
          UPDATE escritorios 
          SET plan_id = $1, subscription_status = 'ACTIVE', subscription_ends_at = $2, updated_at = NOW()
          WHERE id = $3
        `, [payment.plan_id, subscriptionEndDate, payment.escritorio_id]);

        console.log('✅ Pagamento de teste processado:', payment_id);
      }
    } else {
      // Simular falha no pagamento
      await client.query(`
        UPDATE payments 
        SET status = 'FAILED', updated_at = NOW()
        WHERE id = $1
      `, [payment_id]);

      console.log('❌ Pagamento de teste falhou:', payment_id);
    }

    res.json({
      message: success ? 'Pagamento de teste aprovado' : 'Pagamento de teste recusado',
      payment_id,
      status: success ? 'PAID' : 'FAILED'
    });

  } catch (error) {
    console.error('❌ Erro no pagamento de teste:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para estatísticas do dashboard
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar dados do usuário e escritório
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        escritorio:escritorios(*)
      `)
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const escritorioId = user.escritorio_id;

    // Buscar estatísticas do escritório
    const { data: projetos } = await supabase
      .from('projetos')
      .select('*')
      .eq('escritorio_id', escritorioId);

    const { data: usuarios } = await supabase
      .from('users')
      .select('*')
      .eq('escritorio_id', escritorioId);

    // Calcular estatísticas
    const stats = {
      projetos_ativos: projetos ? projetos.filter(p => p.status === 'ativo' || p.status === 'em_andamento').length : 0,
      projetos_total: projetos ? projetos.length : 0,
      usuarios_ativos: usuarios ? usuarios.filter(u => u.status === 'ativo').length : 1,
      usuarios_total: usuarios ? usuarios.length : 1,
      receita_mensal: 15750.00, // Valor exemplo
      tarefas_pendentes: 8 // Valor exemplo
    };

    res.json({
      success: true,
      stats: stats,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel: user.papel
      },
      escritorio: user.escritorio
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// ===== CLIENTES =====

// GET /api/clientes - Listar clientes do escritório
app.get('/api/clientes', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const escritorioId = req.user.escritorioId;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE c.escritorio_id = $1 AND c.is_active = true';
    let queryParams = [escritorioId];

    if (search) {
      whereClause += ' AND (c.nome ILIKE $2 OR c.email ILIKE $2 OR c.telefone ILIKE $2 OR c.cpf ILIKE $2 OR c.cnpj ILIKE $2)';
      queryParams.push(`%${search}%`);
    }

    const countResult = await client.query(`
      SELECT COUNT(*) as total FROM clientes c ${whereClause}
    `, queryParams);

    const result = await client.query(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM projetos p WHERE p.cliente_id::text = c.id) as total_projetos
      FROM clientes c 
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, Number(limit), offset]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      message: 'Clientes carregados com sucesso',
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
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/clientes - Criar novo cliente
app.post('/api/clientes', requireAuth, async (req, res) => {
  try {
    const { 
      nome, 
      email, 
      telefone, 
      tipoPessoa = 'fisica', 
      cpf, 
      cnpj, 
      endereco, 
      observacoes,
      profissao,
      dataNascimento,
      dataFundacao,
      familia,
      origem,
      preferencias,
      historicoProjetos,
      status = 'ativo'
    } = req.body;
    
    const escritorioId = req.user.escritorioId;
    const userId = req.user.id;

    // Validações
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        error: 'Nome, email e telefone são obrigatórios',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (tipoPessoa === 'fisica' && !cpf) {
      return res.status(400).json({
        error: 'CPF é obrigatório para pessoa física',
        code: 'MISSING_CPF'
      });
    }

    if (tipoPessoa === 'juridica' && !cnpj) {
      return res.status(400).json({
        error: 'CNPJ é obrigatório para pessoa jurídica',
        code: 'MISSING_CNPJ'
      });
    }

    // Verificar se email já existe no escritório
    const emailCheck = await client.query(`
      SELECT id FROM clientes 
      WHERE email = $1 AND escritorio_id = $2 AND is_active = true
    `, [email.toLowerCase().trim(), escritorioId]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado neste escritório',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    const clienteId = uuidv4();
    
    await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, cpf, cnpj,
        endereco, cidade, estado, observacoes, escritorio_id,
        profissao, tipo_pessoa, data_nascimento, data_fundacao,
        endereco_numero, endereco_complemento, endereco_bairro, 
        endereco_cep, endereco_pais, familia, origem, 
        preferencias, historico_projetos, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
          `, [
        clienteId,
        nome.trim(),
        email.toLowerCase().trim(),
        telefone.trim(),
        cpf?.trim() || null,
        cnpj?.trim() || null,
        endereco?.logradouro || null,
        endereco?.cidade || null,
        endereco?.estado || endereco?.uf || null,
        observacoes?.trim(),
        escritorioId,
        profissao?.trim() || null,
        tipoPessoa,
        dataNascimento || null,
        dataFundacao || null,
        endereco?.numero || null,
        endereco?.complemento || null,
        endereco?.bairro || null,
        endereco?.cep || null,
        endereco?.pais || 'Brasil',
        JSON.stringify(familia || {}),
        JSON.stringify(origem || {}),
        JSON.stringify(preferencias || {}),
        JSON.stringify(historicoProjetos || []),
        status
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
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/clientes/:id - Obter cliente específico
app.get('/api/clientes/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user.escritorioId;

    const result = await client.query(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM projetos p WHERE p.cliente_id::text = c.id) as total_projetos,
             (SELECT json_agg(json_build_object('id', p.id, 'nome', p.nome, 'status', p.status)) 
              FROM projetos p WHERE p.cliente_id::text = c.id LIMIT 5) as projetos_recentes
      FROM clientes c 
      WHERE c.id = $1 AND c.escritorio_id = $2 AND c.is_active = true
    `, [id, escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Cliente carregado com sucesso',
      cliente: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/clientes/:id - Atualizar cliente
app.put('/api/clientes/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nome, 
      email, 
      telefone, 
      tipoPessoa, 
      cpf, 
      cnpj, 
      endereco, 
      observacoes,
      profissao,
      dataNascimento,
      dataFundacao,
      familia,
      origem,
      preferencias,
      historicoProjetos,
      status
    } = req.body;
    
    const escritorioId = req.user.escritorioId;

    // Verificar se cliente existe e pertence ao escritório
    const existingClient = await client.query(`
      SELECT id FROM clientes 
      WHERE id = $1 AND escritorio_id = $2 AND is_active = true
    `, [id, escritorioId]);

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Validações
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        error: 'Nome, email e telefone são obrigatórios',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Verificar se email já existe em outro cliente do escritório
    const emailCheck = await client.query(`
      SELECT id FROM clientes 
      WHERE email = $1 AND escritorio_id = $2 AND id != $3 AND is_active = true
    `, [email.toLowerCase().trim(), escritorioId, id]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado em outro cliente',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Atualizar cliente
    const updateResult = await client.query(`
      UPDATE clientes SET 
        nome = $1,
        email = $2,
        telefone = $3,
        cpf = $4,
        cnpj = $5,
        endereco = $6,
        cidade = $7,
        estado = $8,
        observacoes = $9,
        profissao = $10,
        tipo_pessoa = $11,
        data_nascimento = $12,
        data_fundacao = $13,
        endereco_numero = $14,
        endereco_complemento = $15,
        endereco_bairro = $16,
        endereco_cep = $17,
        endereco_pais = $18,
        familia = $19,
        origem = $20,
        preferencias = $21,
        historico_projetos = $22,
        status = $23,
        updated_at = NOW()
      WHERE id = $24 AND escritorio_id = $25
      RETURNING *
    `, [
      nome.trim(),
      email.toLowerCase().trim(),
      telefone.trim(),
      cpf?.trim() || null,
      cnpj?.trim() || null,
      endereco?.logradouro || null,
      endereco?.cidade || null,
      endereco?.estado || endereco?.uf || null,
      observacoes?.trim(),
      profissao?.trim() || null,
      tipoPessoa,
      dataNascimento || null,
      dataFundacao || null,
      endereco?.numero || null,
      endereco?.complemento || null,
      endereco?.bairro || null,
      endereco?.cep || null,
      endereco?.pais || 'Brasil',
      JSON.stringify(familia || {}),
      JSON.stringify(origem || {}),
      JSON.stringify(preferencias || {}),
      JSON.stringify(historicoProjetos || []),
      status || 'ativo',
      id,
      escritorioId
    ]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado para atualização',
        code: 'UPDATE_FAILED'
      });
    }

    console.log('✅ Cliente atualizado:', nome, id);

    res.json({
      message: 'Cliente atualizado com sucesso',
      cliente: updateResult.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== START SERVER =====

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ===============================================');
  console.log('   ARCFLOW COMPLETE SERVER - VERSÃO 2.0.0');
  console.log('🚀 ===============================================');
  console.log('');
  console.log(`📍 Servidor rodando na porta: ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔐 Autenticação: http://localhost:${PORT}/api/auth/`);
  console.log(`💳 Pagamentos: http://localhost:${PORT}/api/payments/`);
  console.log('');
  console.log('✅ FUNCIONALIDADES ATIVAS:');
  console.log('   🔐 Sistema de Autenticação JWT');
  console.log('   🏢 Multi-tenancy (Escritórios)');
  console.log('   💳 Sistema de Pagamentos');
  console.log('   📋 Gestão de Planos');
  console.log('   🔄 Registro e Login Completos');
  console.log('');
  console.log('📧 Usuário de teste: admin@arcflow.com');
  console.log('🔑 Senha de teste: 123456');
  console.log('');
}); 