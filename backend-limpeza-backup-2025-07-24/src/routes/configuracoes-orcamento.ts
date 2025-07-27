import express from 'express';
import { Client } from 'pg';
import { authenticateToken } from '../middleware/auth';
import { ConfigurationManagementService } from '../services/configurationManagementService';

const router = express.Router();

// Configuração do cliente PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

client.connect().catch(console.error);

// Instância do serviço de configuração
const configService = new ConfigurationManagementService(client);

/**
 * GET /api/configuracoes-orcamento/escritorio/:escritorioId
 * Busca configurações de orçamento de um escritório
 */
router.get('/escritorio/:escritorioId', authenticateToken, async (req, res) => {
  try {
    const { escritorioId } = req.params;
    const userId = req.user?.id;

    console.log('📋 Buscando configurações de orçamento para escritório:', escritorioId);

    // Verificar se o usuário tem acesso ao escritório
    const userAccess = await client.query(`
      SELECT u.id, u.escritorio_id, u.role
      FROM users u
      WHERE u.id = $1 AND u.escritorio_id = $2
    `, [userId, escritorioId]);

    if (userAccess.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado ao escritório'
      });
    }

    // Buscar configurações do escritório
    const configuracao = await configService.obterConfiguracaoEscritorio(escritorioId);

    if (!configuracao) {
      // Se não existe configuração, criar uma padrão
      console.log('⚠️ Configuração não encontrada. Criando configuração padrão...');
      const novaConfiguracao = await configService.criarConfiguracaoPadrao(escritorioId);
      
      return res.json({
        success: true,
        data: novaConfiguracao,
        message: 'Configuração padrão criada com sucesso'
      });
    }

    console.log('✅ Configurações encontradas');

    res.json({
      success: true,
      data: configuracao
    });

  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * PUT /api/configuracoes-orcamento/escritorio/:escritorioId
 * Atualiza configurações de orçamento de um escritório
 */
router.put('/escritorio/:escritorioId', authenticateToken, async (req, res) => {
  try {
    const { escritorioId } = req.params;
    const userId = req.user?.id;
    const novasConfiguracoes = req.body;

    console.log('📝 Atualizando configurações de orçamento para escritório:', escritorioId);

    // Verificar se o usuário é administrador do escritório
    const userAccess = await client.query(`
      SELECT u.id, u.escritorio_id, u.role
      FROM users u
      WHERE u.id = $1 AND u.escritorio_id = $2 AND u.role IN ('ADMIN', 'OWNER')
    `, [userId, escritorioId]);

    if (userAccess.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem alterar configurações de orçamento'
      });
    }

    // Validar configurações
    const validationResult = await configService.validarConfiguracoes(novasConfiguracoes);
    
    if (!validationResult.valido) {
      return res.status(400).json({
        success: false,
        message: 'Configurações inválidas',
        errors: validationResult.erros
      });
    }

    // Atualizar configurações
    const configuracaoAtualizada = await configService.atualizarConfiguracao(escritorioId, novasConfiguracoes);

    console.log('✅ Configurações atualizadas com sucesso');

    res.json({
      success: true,
      data: configuracaoAtualizada,
      message: 'Configurações atualizadas com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * POST /api/configuracoes-orcamento/reset/:escritorioId
 * Restaura configurações padrão para um escritório
 */
router.post('/reset/:escritorioId', authenticateToken, async (req, res) => {
  try {
    const { escritorioId } = req.params;
    const userId = req.user?.id;

    console.log('🔄 Restaurando configurações padrão para escritório:', escritorioId);

    // Verificar se o usuário é administrador do escritório
    const userAccess = await client.query(`
      SELECT u.id, u.escritorio_id, u.role
      FROM users u
      WHERE u.id = $1 AND u.escritorio_id = $2 AND u.role IN ('ADMIN', 'OWNER')
    `, [userId, escritorioId]);

    if (userAccess.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem restaurar configurações'
      });
    }

    // Restaurar configurações padrão
    const configuracaoPadrao = await configService.restaurarConfiguracoesPadrao(escritorioId);

    console.log('✅ Configurações padrão restauradas');

    res.json({
      success: true,
      data: configuracaoPadrao,
      message: 'Configurações padrão restauradas com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao restaurar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/configuracoes-orcamento/template
 * Retorna template de configurações padrão
 */
router.get('/template', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Buscando template de configurações padrão');

    const template = await configService.obterTemplatePadrao();

    res.json({
      success: true,
      data: template,
      message: 'Template de configurações obtido com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao buscar template:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * POST /api/configuracoes-orcamento/validar
 * Valida configurações sem salvar
 */
router.post('/validar', authenticateToken, async (req, res) => {
  try {
    const configuracoes = req.body;

    console.log('🔍 Validando configurações de orçamento');

    const validationResult = await configService.validarConfiguracoes(configuracoes);

    res.json({
      success: true,
      data: validationResult
    });

  } catch (error) {
    console.error('❌ Erro ao validar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/configuracoes-orcamento/historico/:escritorioId
 * Busca histórico de alterações nas configurações
 */
router.get('/historico/:escritorioId', authenticateToken, async (req, res) => {
  try {
    const { escritorioId } = req.params;
    const userId = req.user?.id;
    const { limit = 10, offset = 0 } = req.query;

    console.log('📋 Buscando histórico de configurações para escritório:', escritorioId);

    // Verificar acesso ao escritório
    const userAccess = await client.query(`
      SELECT u.id, u.escritorio_id, u.role
      FROM users u
      WHERE u.id = $1 AND u.escritorio_id = $2
    `, [userId, escritorioId]);

    if (userAccess.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado ao escritório'
      });
    }

    // Buscar histórico
    const historico = await client.query(`
      SELECT 
        h.id,
        h.alteracoes,
        h.usuario_id,
        h.created_at,
        u.nome as usuario_nome
      FROM historico_configuracoes_orcamento h
      JOIN users u ON h.usuario_id = u.id
      WHERE h.escritorio_id = $1
      ORDER BY h.created_at DESC
      LIMIT $2 OFFSET $3
    `, [escritorioId, limit, offset]);

    res.json({
      success: true,
      data: historico.rows,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: historico.rowCount
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

export default router; * @rou
te   POST /api/configuracoes-orcamento/precos-base
 * @desc    Criar ou atualizar preço base
 * @access  Private
 */
router.post('/precos-base', auth, async (req, res) => {
  try {
    const { tipologia, disciplina, complexidade, price_min, price_max, price_average } = req.body;

    // Validar dados obrigatórios
    if (!tipologia || !disciplina || !complexidade || !price_min || !price_max || !price_average) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validar valores
    if (price_min <= 0 || price_max <= 0 || price_average <= 0) {
      return res.status(400).json({ error: 'Valores devem ser maiores que zero' });
    }

    if (price_min > price_max) {
      return res.status(400).json({ error: 'Preço mínimo não pode ser maior que o máximo' });
    }

    // Verificar se já existe
    const existingResult = await pool.query(`
      SELECT id FROM pricing_base 
      WHERE tipologia = $1 AND disciplina = $2 AND complexidade = $3
    `, [tipologia.toUpperCase(), disciplina.toUpperCase(), complexidade.toUpperCase()]);

    let result;
    if (existingResult.rows.length > 0) {
      // Atualizar existente
      result = await pool.query(`
        UPDATE pricing_base 
        SET price_min = $1, price_max = $2, price_average = $3, updated_at = NOW()
        WHERE tipologia = $4 AND disciplina = $5 AND complexidade = $6
        RETURNING *
      `, [price_min, price_max, price_average, tipologia.toUpperCase(), disciplina.toUpperCase(), complexidade.toUpperCase()]);
    } else {
      // Criar novo
      result = await pool.query(`
        INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [tipologia.toUpperCase(), disciplina.toUpperCase(), complexidade.toUpperCase(), price_min, price_max, price_average]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao salvar preço base:', error);
    res.status(500).json({ error: 'Erro ao salvar preço base' });
  }
});

/**
 * @route   DELETE /api/configuracoes-orcamento/precos-base/:id
 * @desc    Desativar preço base
 * @access  Private
 */
router.delete('/precos-base/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE pricing_base 
      SET active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Preço base não encontrado' });
    }

    res.json({ message: 'Preço base desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao desativar preço base:', error);
    res.status(500).json({ error: 'Erro ao desativar preço base' });
  }
});

/**
 * @route   GET /api/configuracoes-orcamento/fatores-complexidade
 * @desc    Obter fatores de complexidade configuráveis
 * @access  Private
 */
router.get('/fatores-complexidade', auth, async (req, res) => {
  try {
    // Retornar configurações de complexidade do ComplexityAnalyzer
    const fatores = {
      AREA_GRANDE: { impact: 5, reason: 'Área construída grande' },
      AREA_MUITO_GRANDE: { impact: 10, reason: 'Área construída muito grande' },
      PISCINA: { impact: 3, reason: 'Projeto inclui piscina' },
      ELEVADOR: { impact: 5, reason: 'Projeto inclui elevador' },
      AUTOMACAO: { impact: 7, reason: 'Projeto inclui automação residencial' },
      TERRENO_IRREGULAR: { impact: 4, reason: 'Terreno com topografia irregular' },
      MULTIPLOS_PAVIMENTOS: { impact: 3, reason: 'Edificação com múltiplos pavimentos' },
      ALTO_PADRAO: { impact: 8, reason: 'Acabamentos de alto padrão' },
      FACHADA_COMPLEXA: { impact: 6, reason: 'Fachada com design complexo' },
      ESPACOS_ESPECIAIS: { impact: 4, reason: 'Espaços com requisitos especiais' },
      ALTA_DENSIDADE: { impact: 5, reason: 'Alta densidade de ocupação' },
      PONTE_ROLANTE: { impact: 7, reason: 'Estrutura para ponte rolante' },
      MAQUINARIO_PESADO: { impact: 6, reason: 'Suporte para maquinário pesado' },
      PE_DIREITO_ALTO: { impact: 4, reason: 'Pé direito elevado' },
      NORMAS_ESPECIAIS: { impact: 8, reason: 'Atendimento a normas específicas' },
      ACESSIBILIDADE_COMPLETA: { impact: 5, reason: 'Acessibilidade universal' },
      SEGURANCA_ESPECIAL: { impact: 6, reason: 'Requisitos especiais de segurança' },
      PROJETO_PADRAO: { impact: -5, reason: 'Projeto com padrão repetitivo' },
      TERRENO_PLANO: { impact: -3, reason: 'Terreno plano sem desafios' },
      CONSTRUCAO_SIMPLES: { impact: -4, reason: 'Construção com métodos simples' }
    };

    res.json(fatores);
  } catch (error) {
    console.error('Erro ao buscar fatores de complexidade:', error);
    res.status(500).json({ error: 'Erro ao buscar fatores de complexidade' });
  }
});

/**
 * @route   GET /api/configuracoes-orcamento/validacoes
 * @desc    Obter configurações de validação
 * @access  Private
 */
router.get('/validacoes', auth, async (req, res) => {
  try {
    const configuracoes = {
      ABSOLUTE_MIN_PRICE_M2: 50,
      ABSOLUTE_MAX_PRICE_M2: 500,
      PRICE_RANGES: {
        'RESIDENCIAL': { min: 80, max: 400, avg: 200 },
        'COMERCIAL': { min: 90, max: 400, avg: 220 },
        'INDUSTRIAL': { min: 40, max: 200, avg: 100 },
        'INSTITUCIONAL': { min: 100, max: 400, avg: 250 },
        'URBANISTICO': { min: 30, max: 150, avg: 80 }
      },
      MIN_PROJECT_VALUE: {
        'RESIDENCIAL': 5000,
        'COMERCIAL': 8000,
        'INDUSTRIAL': 15000,
        'INSTITUCIONAL': 10000,
        'URBANISTICO': 5000
      }
    };

    res.json(configuracoes);
  } catch (error) {
    console.error('Erro ao buscar configurações de validação:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações de validação' });
  }
});

/**
 * @route   GET /api/configuracoes-orcamento/benchmarks/:tipologia
 * @desc    Obter benchmarks de mercado por tipologia
 * @access  Private
 */
router.get('/benchmarks/:tipologia', auth, async (req, res) => {
  try {
    const { tipologia } = req.params;

    const result = await pool.query(`
      SELECT 
        disciplina, 
        complexidade, 
        AVG(price_min) as valor_minimo, 
        AVG(price_max) as valor_maximo, 
        AVG(price_average) as valor_medio,
        COUNT(*) as total_registros
      FROM pricing_base 
      WHERE tipologia = $1 AND active = true
      GROUP BY disciplina, complexidade
      ORDER BY disciplina, complexidade
    `, [tipologia.toUpperCase()]);

    const benchmarks = {};
    for (const row of result.rows) {
      const key = `${row.disciplina}_${row.complexidade}`;
      benchmarks[key] = {
        disciplina: row.disciplina,
        complexidade: row.complexidade,
        min: parseFloat(row.valor_minimo),
        max: parseFloat(row.valor_maximo),
        avg: parseFloat(row.valor_medio),
        totalRegistros: parseInt(row.total_registros)
      };
    }

    res.json(benchmarks);
  } catch (error) {
    console.error('Erro ao buscar benchmarks:', error);
    res.status(500).json({ error: 'Erro ao buscar benchmarks' });
  }
});

/**
 * @route   POST /api/configuracoes-orcamento/validar-orcamento
 * @desc    Validar um orçamento contra benchmarks
 * @access  Private
 */
router.post('/validar-orcamento', auth, async (req, res) => {
  try {
    const { tipologia, area, valorTotal, disciplinas, complexidade } = req.body;

    if (!tipologia || !area || !valorTotal) {
      return res.status(400).json({ error: 'Tipologia, área e valor total são obrigatórios' });
    }

    const valorPorM2 = valorTotal / area;

    // Buscar benchmarks
    const MarketValidator = require('../services/marketValidator').default;
    const marketValidator = new MarketValidator(pool);

    const validationResult = await marketValidator.validatePrice({
      briefingId: 'validation-test',
      tipologia: tipologia.toUpperCase(),
      area,
      valorTotal,
      valorPorM2,
      disciplinas: disciplinas || ['ARQUITETURA'],
      complexidade: complexidade || 'MEDIO'
    });

    res.json(validationResult);
  } catch (error) {
    console.error('Erro ao validar orçamento:', error);
    res.status(500).json({ error: 'Erro ao validar orçamento' });
  }
});

/**
 * @route   GET /api/configuracoes-orcamento/estatisticas
 * @desc    Obter estatísticas dos orçamentos
 * @access  Private
 */
router.get('/estatisticas', auth, async (req, res) => {
  try {
    // Estatísticas gerais
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_orcamentos,
        AVG(valor_total) as valor_medio,
        MIN(valor_total) as valor_minimo,
        MAX(valor_total) as valor_maximo,
        AVG(valor_total / NULLIF(area_construida, 0)) as valor_medio_m2
      FROM orcamentos 
      WHERE valor_total > 0 AND area_construida > 0
    `);

    // Estatísticas por tipologia
    const tipologiaResult = await pool.query(`
      SELECT 
        tipologia,
        COUNT(*) as total,
        AVG(valor_total) as valor_medio,
        AVG(valor_total / NULLIF(area_construida, 0)) as valor_medio_m2
      FROM orcamentos 
      WHERE valor_total > 0 AND area_construida > 0
      GROUP BY tipologia
      ORDER BY total DESC
    `);

    res.json({
      geral: statsResult.rows[0],
      porTipologia: tipologiaResult.rows
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;