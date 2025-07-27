const express = require('express');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Database connection
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });
client.connect();

// Middleware simples de autenticação
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token necessário' });
  }
  // Aqui seria a validação JWT completa
  req.user = { id: 'user_test', escritorioId: 'escritorio_teste' }; // Mock
  next();
};

// GET /api/payments/plans - Listar planos disponíveis
router.get('/plans', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT id, name, type, price_monthly, price_yearly, max_users, max_projects, features, is_active
      FROM plans 
      WHERE is_active = true 
      ORDER BY price_monthly ASC
    `);

    const plans = result.rows.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features || '{}'),
      savings_yearly: Math.round(((plan.price_monthly * 12) - plan.price_yearly) / (plan.price_monthly * 12) * 100)
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
router.post('/create-checkout', requireAuth, async (req, res) => {
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

    // Simular criação de sessão de checkout (aqui seria integração real com gateway)
    const checkoutSession = {
      id: `checkout_${paymentId}`,
      payment_id: paymentId,
      amount,
      currency: 'BRL',
      plan_name: plan.name,
      billing_cycle,
      checkout_url: `https://checkout.stripe.com/session/${paymentId}`, // URL simulada
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

// POST /api/payments/webhook - Webhook para receber confirmações de pagamento
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Aqui seria a validação da assinatura do webhook
    const event = req.body;
    
    console.log('📨 Webhook recebido:', event.type);

    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSuccess(event.data);
        break;
      case 'payment.failed':
        await handlePaymentFailure(event.data);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data);
        break;
      default:
        console.log(`⚠️ Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ error: 'Erro no webhook' });
  }
});

// Função para processar pagamento bem-sucedido
async function handlePaymentSuccess(paymentData) {
  const { payment_id, amount, metadata } = paymentData;
  
  try {
    // Atualizar status do pagamento
    await client.query(`
      UPDATE payments 
      SET status = 'PAID', paid_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [payment_id]);

    // Atualizar plano do escritório
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + (metadata.billing_cycle === 'yearly' ? 12 : 1));

    await client.query(`
      UPDATE escritorios 
      SET plan_id = $1, subscription_status = 'ACTIVE', subscription_ends_at = $2, updated_at = NOW()
      WHERE id = $3
    `, [metadata.plan_id, subscriptionEndDate, metadata.escritorio_id]);

    console.log('✅ Pagamento processado com sucesso:', payment_id);

    // Aqui você poderia enviar email de confirmação, notificações, etc.

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error);
  }
}

// Função para processar falha de pagamento
async function handlePaymentFailure(paymentData) {
  const { payment_id, error_message } = paymentData;
  
  try {
    await client.query(`
      UPDATE payments 
      SET status = 'FAILED', updated_at = NOW()
      WHERE id = $1
    `, [payment_id]);

    console.log('❌ Pagamento falhou:', payment_id, error_message);
    
    // Aqui você poderia enviar email de falha, notificar usuário, etc.

  } catch (error) {
    console.error('❌ Erro ao processar falha:', error);
  }
}

// Função para criar assinatura
async function handleSubscriptionCreated(subscriptionData) {
  // Lógica para assinaturas recorrentes
  console.log('📅 Assinatura criada:', subscriptionData);
}

// Função para cancelar assinatura
async function handleSubscriptionCancelled(subscriptionData) {
  // Lógica para cancelamento de assinaturas
  console.log('❌ Assinatura cancelada:', subscriptionData);
}

// GET /api/payments/history - Histórico de pagamentos do escritório
router.get('/history', requireAuth, async (req, res) => {
  try {
    const escritorioId = req.user.escritorioId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await client.query(`
      SELECT p.*, pl.name as plan_name, pl.type as plan_type
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.escritorio_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [escritorioId, limit, offset]);

    const total = await client.query(`
      SELECT COUNT(*) FROM payments WHERE escritorio_id = $1
    `, [escritorioId]);

    res.json({
      message: 'Histórico carregado com sucesso',
      payments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.rows[0].count),
        pages: Math.ceil(parseInt(total.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/payments/current-plan - Plano atual do escritório
router.get('/current-plan', requireAuth, async (req, res) => {
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

// POST /api/payments/test-webhook - Endpoint para testar webhooks (apenas desenvolvimento)
router.post('/test-webhook', async (req, res) => {
  try {
    const { event_type, payment_id } = req.body;

    const testEvent = {
      type: event_type,
      data: {
        payment_id,
        amount: 19700, // R$ 197,00
        metadata: {
          escritorio_id: 'escritorio_teste',
          plan_id: 'plan_pro',
          billing_cycle: 'monthly'
        }
      }
    };

    // Simular processamento do webhook
    switch (event_type) {
      case 'payment.succeeded':
        await handlePaymentSuccess(testEvent.data);
        break;
      case 'payment.failed':
        await handlePaymentFailure({
          ...testEvent.data,
          error_message: 'Cartão recusado'
        });
        break;
    }

    res.json({
      message: 'Webhook de teste processado com sucesso',
      event: testEvent
    });

  } catch (error) {
    console.error('❌ Erro no teste de webhook:', error);
    res.status(500).json({ error: 'Erro no teste' });
  }
});

module.exports = router; 