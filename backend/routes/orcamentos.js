/**
 * 🛣️ ROTAS DE ORÇAMENTOS V2.0
 * 
 * Rotas da API para o sistema de orçamentos inteligente
 * Inclui todas as operações CRUD e funcionalidades avançadas
 */

const express = require('express');
const router = express.Router();
const OrcamentoController = require('../controllers/orcamentoController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { rateLimitOrcamentos } = require('../middleware/rateLimiting');

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// Aplicar rate limiting específico para orçamentos
router.use(rateLimitOrcamentos);

/**
 * 🚀 Gerar orçamento inteligente
 * POST /api/orcamentos/gerar
 */
router.post('/gerar', 
  validateRequest({
    body: {
      briefingId: { type: 'string', required: true, format: 'uuid' }
    }
  }),
  OrcamentoController.gerarOrcamento
);

/**
 * 📋 Listar briefings disponíveis para orçamento
 * GET /api/orcamentos/briefings-disponiveis
 */
router.get('/briefings-disponiveis', 
  OrcamentoController.listarBriefingsDisponiveis
);

/**
 * 📈 Dashboard de orçamentos
 * GET /api/orcamentos/dashboard
 */
router.get('/dashboard', 
  OrcamentoController.dashboardOrcamentos
);

/**
 * 📊 Listar orçamentos do escritório
 * GET /api/orcamentos
 */
router.get('/', 
  validateRequest({
    query: {
      page: { type: 'number', min: 1, default: 1 },
      limit: { type: 'number', min: 1, max: 100, default: 10 },
      status: { type: 'string', enum: ['RASCUNHO', 'PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO'] },
      tipologia: { type: 'string', enum: ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INSTITUCIONAL'] },
      ordenacao: { type: 'string', enum: ['created_at', 'updated_at', 'valor_total', 'nome'], default: 'created_at' },
      direcao: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' }
    }
  }),
  OrcamentoController.listarOrcamentos
);

/**
 * 🔍 Buscar orçamento por ID
 * GET /api/orcamentos/:id
 */
router.get('/:id', 
  validateRequest({
    params: {
      id: { type: 'string', required: true }
    }
  }),
  OrcamentoController.buscarOrcamento
);

/**
 * 🔄 Atualizar status do orçamento
 * PATCH /api/orcamentos/:id/status
 */
router.patch('/:id/status', 
  validateRequest({
    params: {
      id: { type: 'string', required: true, format: 'uuid' }
    },
    body: {
      status: { 
        type: 'string', 
        required: true, 
        enum: ['RASCUNHO', 'PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO'] 
      },
      observacoes: { type: 'string', maxLength: 1000 }
    }
  }),
  OrcamentoController.atualizarStatus
);

/**
 * 📄 Gerar PDF do orçamento
 * GET /api/orcamentos/:id/pdf
 */
router.get('/:id/pdf', 
  validateRequest({
    params: {
      id: { type: 'string', required: true, format: 'uuid' }
    }
  }),
  OrcamentoController.gerarPDF
);

/**
 * 🗑️ Excluir orçamento
 * DELETE /api/orcamentos/:id
 */
router.delete('/:id', 
  validateRequest({
    params: {
      id: { type: 'string', required: true, format: 'uuid' }
    }
  }),
  OrcamentoController.excluirOrcamento
);

// ========================================
// ROTAS AVANÇADAS E RELATÓRIOS
// ========================================

/**
 * 📊 Relatório de performance de orçamentos
 * GET /api/orcamentos/relatorios/performance
 */
router.get('/relatorios/performance', 
  validateRequest({
    query: {
      periodo: { type: 'string', enum: ['7d', '30d', '90d', '1y'], default: '30d' },
      tipologia: { type: 'string', enum: ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INSTITUCIONAL'] }
    }
  }),
  async (req, res, next) => {
    try {
      const { escritorioId } = req.user;
      const { periodo, tipologia } = req.query;

      console.log('📊 [ORCAMENTOS-ROUTES] Gerando relatório de performance:', {
        escritorioId,
        periodo,
        tipologia
      });

      const relatorio = await gerarRelatorioPerformance(escritorioId, periodo, tipologia);

      res.json({
        success: true,
        message: 'Relatório gerado com sucesso',
        data: relatorio
      });

    } catch (error) {
      console.error('❌ [ORCAMENTOS-ROUTES] Erro no relatório:', error);
      next(error);
    }
  }
);

/**
 * 🎯 Análise de benchmarking
 * GET /api/orcamentos/:id/benchmarking
 */
router.get('/:id/benchmarking', 
  validateRequest({
    params: {
      id: { type: 'string', required: true, format: 'uuid' }
    }
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { escritorioId } = req.user;

      console.log('🎯 [ORCAMENTOS-ROUTES] Análise de benchmarking:', { id, escritorioId });

      const benchmarking = await analisarBenchmarking(id, escritorioId);

      res.json({
        success: true,
        message: 'Análise de benchmarking concluída',
        data: benchmarking
      });

    } catch (error) {
      console.error('❌ [ORCAMENTOS-ROUTES] Erro no benchmarking:', error);
      next(error);
    }
  }
);

/**
 * 📈 Estatísticas avançadas
 * GET /api/orcamentos/estatisticas/avancadas
 */
router.get('/estatisticas/avancadas', 
  validateRequest({
    query: {
      periodo: { type: 'string', enum: ['30d', '90d', '6m', '1y'], default: '90d' },
      agrupamento: { type: 'string', enum: ['tipologia', 'complexidade', 'mes'], default: 'tipologia' }
    }
  }),
  async (req, res, next) => {
    try {
      const { escritorioId } = req.user;
      const { periodo, agrupamento } = req.query;

      console.log('📈 [ORCAMENTOS-ROUTES] Estatísticas avançadas:', {
        escritorioId,
        periodo,
        agrupamento
      });

      const estatisticas = await gerarEstatisticasAvancadas(escritorioId, periodo, agrupamento);

      res.json({
        success: true,
        message: 'Estatísticas geradas com sucesso',
        data: estatisticas
      });

    } catch (error) {
      console.error('❌ [ORCAMENTOS-ROUTES] Erro nas estatísticas:', error);
      next(error);
    }
  }
);

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * 📊 Gerar relatório de performance
 */
async function gerarRelatorioPerformance(escritorioId, periodo, tipologia) {
  const { getClient } = require('../config/database');
  const client = getClient();

  try {
    // Calcular intervalo baseado no período
    let intervalo;
    switch (periodo) {
      case '7d': intervalo = '7 days'; break;
      case '30d': intervalo = '30 days'; break;
      case '90d': intervalo = '90 days'; break;
      case '1y': intervalo = '1 year'; break;
      default: intervalo = '30 days';
    }

    let whereClause = `WHERE o.escritorio_id = $1 AND o.deleted_at IS NULL AND o.created_at >= NOW() - INTERVAL '${intervalo}'`;
    let params = [escritorioId];

    if (tipologia) {
      whereClause += ` AND o.tipologia = $2`;
      params.push(tipologia);
    }

    // Query principal
    const query = `
      SELECT 
        COUNT(*) as total_orcamentos,
        COUNT(CASE WHEN o.status = 'APROVADO' THEN 1 END) as aprovados,
        COUNT(CASE WHEN o.status = 'REJEITADO' THEN 1 END) as rejeitados,
        AVG(o.valor_total) as valor_medio,
        AVG(o.valor_por_m2) as valor_medio_m2,
        MIN(o.valor_por_m2) as valor_min_m2,
        MAX(o.valor_por_m2) as valor_max_m2,
        AVG(o.prazo_entrega) as prazo_medio,
        o.tipologia,
        o.complexidade
      FROM orcamentos o
      ${whereClause}
      GROUP BY o.tipologia, o.complexidade
      ORDER BY total_orcamentos DESC
    `;

    const result = await client.query(query, params);

    // Calcular métricas gerais
    const metricas = result.rows.reduce((acc, row) => {
      acc.totalOrcamentos += parseInt(row.total_orcamentos);
      acc.totalAprovados += parseInt(row.aprovados);
      acc.totalRejeitados += parseInt(row.rejeitados);
      return acc;
    }, { totalOrcamentos: 0, totalAprovados: 0, totalRejeitados: 0 });

    const taxaAprovacao = metricas.totalOrcamentos > 0 
      ? ((metricas.totalAprovados / metricas.totalOrcamentos) * 100).toFixed(1)
      : '0.0';

    return {
      periodo,
      tipologia: tipologia || 'TODAS',
      metricas: {
        ...metricas,
        taxaAprovacao: `${taxaAprovacao}%`
      },
      detalhamento: result.rows,
      dataGeracao: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ [ORCAMENTOS-ROUTES] Erro no relatório de performance:', error);
    throw error;
  }
}

/**
 * 🎯 Analisar benchmarking de orçamento específico
 */
async function analisarBenchmarking(orcamentoId, escritorioId) {
  const { getClient } = require('../config/database');
  const client = getClient();

  try {
    // Buscar orçamento
    const orcamentoResult = await client.query(`
      SELECT * FROM orcamentos 
      WHERE id = $1::uuid AND escritorio_id = $2::uuid AND deleted_at IS NULL
    `, [orcamentoId, escritorioId]);

    if (orcamentoResult.rows.length === 0) {
      throw new Error('Orçamento não encontrado');
    }

    const orcamento = orcamentoResult.rows[0];

    // Buscar orçamentos similares
    const similaresResult = await client.query(`
      SELECT 
        valor_por_m2,
        valor_total,
        area_construida,
        prazo_entrega,
        complexidade,
        created_at
      FROM orcamentos 
      WHERE tipologia = $1 
        AND area_construida BETWEEN $2 AND $3
        AND id != $4::uuid
        AND deleted_at IS NULL
        AND created_at >= NOW() - INTERVAL '12 months'
      ORDER BY created_at DESC
      LIMIT 50
    `, [
      orcamento.tipologia,
      orcamento.area_construida * 0.8,
      orcamento.area_construida * 1.2,
      orcamentoId
    ]);

    if (similaresResult.rows.length === 0) {
      return {
        orcamentoId,
        similares: 0,
        posicionamento: 'SEM_DADOS',
        observacao: 'Não há orçamentos similares para comparação'
      };
    }

    // Calcular estatísticas
    const valores = similaresResult.rows.map(row => row.valor_por_m2);
    const valorMedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const valorMinimo = Math.min(...valores);
    const valorMaximo = Math.max(...valores);

    // Determinar posicionamento
    let posicionamento = 'MEDIO';
    if (orcamento.valor_por_m2 < valorMedio * 0.9) {
      posicionamento = 'COMPETITIVO';
    } else if (orcamento.valor_por_m2 > valorMedio * 1.1) {
      posicionamento = 'PREMIUM';
    }

    return {
      orcamentoId,
      valorAtual: orcamento.valor_por_m2,
      similares: similaresResult.rows.length,
      estatisticas: {
        valorMedio: Math.round(valorMedio),
        valorMinimo: Math.round(valorMinimo),
        valorMaximo: Math.round(valorMaximo),
        desvioPercentual: ((orcamento.valor_por_m2 - valorMedio) / valorMedio * 100).toFixed(1)
      },
      posicionamento,
      recomendacao: gerarRecomendacaoBenchmarking(posicionamento, orcamento.valor_por_m2, valorMedio),
      dataAnalise: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ [ORCAMENTOS-ROUTES] Erro na análise de benchmarking:', error);
    throw error;
  }
}

/**
 * 📈 Gerar estatísticas avançadas
 */
async function gerarEstatisticasAvancadas(escritorioId, periodo, agrupamento) {
  const { getClient } = require('../config/database');
  const client = getClient();

  try {
    // Calcular intervalo
    let intervalo;
    switch (periodo) {
      case '30d': intervalo = '30 days'; break;
      case '90d': intervalo = '90 days'; break;
      case '6m': intervalo = '6 months'; break;
      case '1y': intervalo = '1 year'; break;
      default: intervalo = '90 days';
    }

    let groupBy, selectFields;
    switch (agrupamento) {
      case 'tipologia':
        groupBy = 'tipologia';
        selectFields = 'tipologia as categoria';
        break;
      case 'complexidade':
        groupBy = 'complexidade';
        selectFields = 'complexidade as categoria';
        break;
      case 'mes':
        groupBy = "DATE_TRUNC('month', created_at)";
        selectFields = "DATE_TRUNC('month', created_at) as categoria";
        break;
      default:
        groupBy = 'tipologia';
        selectFields = 'tipologia as categoria';
    }

    const query = `
      SELECT 
        ${selectFields},
        COUNT(*) as quantidade,
        SUM(valor_total) as valor_total,
        AVG(valor_total) as valor_medio,
        AVG(valor_por_m2) as valor_medio_m2,
        AVG(area_construida) as area_media,
        AVG(prazo_entrega) as prazo_medio,
        COUNT(CASE WHEN status = 'APROVADO' THEN 1 END) as aprovados,
        COUNT(CASE WHEN status = 'REJEITADO' THEN 1 END) as rejeitados
      FROM orcamentos 
      WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        AND created_at >= NOW() - INTERVAL '${intervalo}'
      GROUP BY ${groupBy}
      ORDER BY quantidade DESC
    `;

    const result = await client.query(query, [escritorioId]);

    // Calcular totais
    const totais = result.rows.reduce((acc, row) => {
      acc.quantidade += parseInt(row.quantidade);
      acc.valorTotal += parseFloat(row.valor_total) || 0;
      acc.aprovados += parseInt(row.aprovados);
      acc.rejeitados += parseInt(row.rejeitados);
      return acc;
    }, { quantidade: 0, valorTotal: 0, aprovados: 0, rejeitados: 0 });

    return {
      periodo,
      agrupamento,
      totais: {
        ...totais,
        taxaAprovacao: totais.quantidade > 0 
          ? `${((totais.aprovados / totais.quantidade) * 100).toFixed(1)}%`
          : '0.0%',
        valorMedio: totais.quantidade > 0 
          ? Math.round(totais.valorTotal / totais.quantidade)
          : 0
      },
      detalhamento: result.rows.map(row => ({
        ...row,
        quantidade: parseInt(row.quantidade),
        valor_total: parseFloat(row.valor_total) || 0,
        valor_medio: Math.round(parseFloat(row.valor_medio) || 0),
        valor_medio_m2: Math.round(parseFloat(row.valor_medio_m2) || 0),
        area_media: Math.round(parseFloat(row.area_media) || 0),
        prazo_medio: Math.round(parseFloat(row.prazo_medio) || 0),
        aprovados: parseInt(row.aprovados),
        rejeitados: parseInt(row.rejeitados),
        taxa_aprovacao: row.quantidade > 0 
          ? `${((row.aprovados / row.quantidade) * 100).toFixed(1)}%`
          : '0.0%'
      })),
      dataGeracao: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ [ORCAMENTOS-ROUTES] Erro nas estatísticas avançadas:', error);
    throw error;
  }
}

/**
 * 💡 Gerar recomendação de benchmarking
 */
function gerarRecomendacaoBenchmarking(posicionamento, valorAtual, valorMedio) {
  switch (posicionamento) {
    case 'COMPETITIVO':
      return `Valor competitivo (${Math.round(((valorMedio - valorAtual) / valorMedio) * 100)}% abaixo da média). Considere destacar diferenciais ou aumentar margem.`;
    case 'PREMIUM':
      return `Valor premium (${Math.round(((valorAtual - valorMedio) / valorMedio) * 100)}% acima da média). Certifique-se de justificar o valor com qualidade superior.`;
    case 'MEDIO':
      return 'Valor alinhado com o mercado. Posicionamento equilibrado entre competitividade e rentabilidade.';
    default:
      return 'Posicionamento não determinado devido à falta de dados comparativos.';
  }
}

module.exports = router;