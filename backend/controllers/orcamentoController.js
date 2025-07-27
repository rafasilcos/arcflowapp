/**
 * 🎯 CONTROLADOR DE ORÇAMENTOS V2.0
 * 
 * Controlador principal que orquestra todo o sistema de orçamentos inteligente
 * Integra análise, cálculo, validação e persistência
 */

const OrcamentoService = require('../services/orcamentoService');
const { AppError } = require('../middleware/errorHandler');

class OrcamentoController {
  /**
   * 🚀 Gerar orçamento inteligente
   * POST /api/orcamentos/gerar
   */
  async gerarOrcamento(req, res, next) {
    try {
      const { briefingId } = req.body;
      const { escritorioId } = req.user;
      const userId = req.user.id;

      console.log('🚀 [ORCAMENTO-CONTROLLER] Iniciando geração:', {
        briefingId,
        escritorioId,
        userId
      });

      // Validar entrada
      if (!briefingId) {
        throw new AppError(
          'ID do briefing é obrigatório',
          400,
          'MISSING_BRIEFING_ID'
        );
      }

      // Gerar orçamento usando o serviço inteligente
      const resultado = await OrcamentoService.gerarOrcamentoInteligente(
        briefingId,
        escritorioId,
        userId
      );

      console.log('✅ [ORCAMENTO-CONTROLLER] Orçamento gerado com sucesso:', {
        orcamentoId: resultado.data.orcamentoId,
        valorTotal: resultado.data.valorTotal
      });

      res.status(201).json(resultado);

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro na geração:', error);
      next(error);
    }
  }

  /**
   * 📋 Listar briefings disponíveis para orçamento
   * GET /api/orcamentos/briefings-disponiveis
   */
  async listarBriefingsDisponiveis(req, res, next) {
    try {
      const { escritorioId } = req.user;

      console.log('📋 [ORCAMENTO-CONTROLLER] Listando briefings disponíveis:', { escritorioId });

      const resultado = await OrcamentoService.listarBriefingsDisponiveis(escritorioId);

      res.json(resultado);

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao listar briefings:', error);
      next(error);
    }
  }

  /**
   * 🔍 Buscar orçamento por ID
   * GET /api/orcamentos/:id
   */
  async buscarOrcamento(req, res, next) {
    try {
      const { id } = req.params;
      const { escritorioId } = req.user;

      console.log('🔍 [ORCAMENTO-CONTROLLER] Buscando orçamento:', { id, escritorioId });

      const orcamento = await OrcamentoService.buscarOrcamentoPorId(id, escritorioId);

      res.json({
        success: true,
        message: 'Orçamento encontrado com sucesso',
        data: orcamento
      });

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao buscar orçamento:', error);
      next(error);
    }
  }

  /**
   * 📊 Listar orçamentos do escritório
   * GET /api/orcamentos
   */
  async listarOrcamentos(req, res, next) {
    try {
      const { escritorioId } = req.user;
      const { 
        page = 1, 
        limit = 10, 
        status, 
        tipologia, 
        ordenacao = 'created_at',
        direcao = 'DESC'
      } = req.query;

      console.log('📊 [ORCAMENTO-CONTROLLER] Listando orçamentos:', {
        escritorioId,
        page,
        limit,
        status,
        tipologia
      });

      const resultado = await this.listarOrcamentosEscritorio(
        escritorioId,
        { page, limit, status, tipologia, ordenacao, direcao }
      );

      res.json(resultado);

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao listar orçamentos:', error);
      next(error);
    }
  }

  /**
   * 📈 Dashboard de orçamentos
   * GET /api/orcamentos/dashboard
   */
  async dashboardOrcamentos(req, res, next) {
    try {
      const { escritorioId } = req.user;

      console.log('📈 [ORCAMENTO-CONTROLLER] Carregando dashboard:', { escritorioId });

      const dashboard = await this.gerarDashboardOrcamentos(escritorioId);

      res.json({
        success: true,
        message: 'Dashboard carregado com sucesso',
        data: dashboard
      });

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro no dashboard:', error);
      next(error);
    }
  }

  /**
   * 🔄 Atualizar status do orçamento
   * PATCH /api/orcamentos/:id/status
   */
  async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, observacoes } = req.body;
      const { escritorioId } = req.user;
      const userId = req.user.id;

      console.log('🔄 [ORCAMENTO-CONTROLLER] Atualizando status:', {
        id,
        status,
        escritorioId
      });

      const resultado = await this.atualizarStatusOrcamento(
        id,
        status,
        escritorioId,
        userId,
        observacoes
      );

      res.json(resultado);

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao atualizar status:', error);
      next(error);
    }
  }

  /**
   * 📄 Gerar PDF do orçamento
   * GET /api/orcamentos/:id/pdf
   */
  async gerarPDF(req, res, next) {
    try {
      const { id } = req.params;
      const { escritorioId } = req.user;

      console.log('📄 [ORCAMENTO-CONTROLLER] Gerando PDF:', { id, escritorioId });

      // Buscar orçamento
      const orcamento = await OrcamentoService.buscarOrcamentoPorId(id, escritorioId);

      // Gerar PDF (implementar depois)
      const pdfBuffer = await this.gerarPDFOrcamento(orcamento);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="orcamento-${orcamento.codigo}.pdf"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao gerar PDF:', error);
      next(error);
    }
  }

  /**
   * 🗑️ Excluir orçamento
   * DELETE /api/orcamentos/:id
   */
  async excluirOrcamento(req, res, next) {
    try {
      const { id } = req.params;
      const { escritorioId } = req.user;
      const userId = req.user.id;

      console.log('🗑️ [ORCAMENTO-CONTROLLER] Excluindo orçamento:', { id, escritorioId });

      const resultado = await this.excluirOrcamentoLogico(id, escritorioId, userId);

      res.json(resultado);

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao excluir orçamento:', error);
      next(error);
    }
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  /**
   * 📊 Listar orçamentos do escritório com filtros
   */
  async listarOrcamentosEscritorio(escritorioId, filtros) {
    const { getClient } = require('../config/database');
    const client = getClient();

    try {
      const offset = (filtros.page - 1) * filtros.limit;
      
      let whereClause = 'WHERE o.escritorio_id = $1 AND o.deleted_at IS NULL';
      let params = [escritorioId];
      let paramCount = 1;

      // Aplicar filtros
      if (filtros.status) {
        paramCount++;
        whereClause += ` AND o.status = $${paramCount}`;
        params.push(filtros.status);
      }

      if (filtros.tipologia) {
        paramCount++;
        whereClause += ` AND o.tipologia = $${paramCount}`;
        params.push(filtros.tipologia);
      }

      // Query principal
      const query = `
        SELECT 
          o.id,
          o.codigo,
          o.nome,
          o.status,
          o.valor_total as "valorTotal",
          o.valor_por_m2 as "valorPorM2",
          o.area_construida as "areaConstruida",
          o.tipologia,
          o.padrao,
          o.complexidade,
          o.prazo_entrega as "prazoEntrega",
          o.created_at as "createdAt",
          o.updated_at as "updatedAt",
          b.nome_projeto as "briefingNome",
          c.nome as "clienteNome",
          u.nome as "responsavelNome"
        FROM orcamentos o
        LEFT JOIN briefings b ON o.briefing_id = b.id
        LEFT JOIN clientes c ON o.cliente_id::text = c.id
        LEFT JOIN users u ON o.responsavel_id::text = u.id
        ${whereClause}
        ORDER BY o.${filtros.ordenacao} ${filtros.direcao}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;

      params.push(filtros.limit, offset);

      const result = await client.query(query, params);

      // Query para contar total
      const countQuery = `
        SELECT COUNT(*) as total
        FROM orcamentos o
        ${whereClause}
      `;

      const countResult = await client.query(countQuery, params.slice(0, paramCount));
      const total = parseInt(countResult.rows[0].total);

      return {
        success: true,
        message: 'Orçamentos listados com sucesso',
        data: {
          orcamentos: result.rows,
          pagination: {
            page: parseInt(filtros.page),
            limit: parseInt(filtros.limit),
            total,
            pages: Math.ceil(total / filtros.limit)
          }
        }
      };

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro na listagem:', error);
      throw new AppError(
        'Erro ao listar orçamentos',
        500,
        'ORCAMENTOS_LIST_ERROR'
      );
    }
  }

  /**
   * 📈 Gerar dashboard de orçamentos
   */
  async gerarDashboardOrcamentos(escritorioId) {
    const { getClient } = require('../config/database');
    const client = getClient();

    try {
      // Estatísticas gerais
      const statsQuery = `
        SELECT 
          COUNT(*) as total_orcamentos,
          COUNT(CASE WHEN status = 'APROVADO' THEN 1 END) as aprovados,
          COUNT(CASE WHEN status = 'PENDENTE' THEN 1 END) as pendentes,
          COUNT(CASE WHEN status = 'REJEITADO' THEN 1 END) as rejeitados,
          SUM(valor_total) as valor_total_geral,
          AVG(valor_por_m2) as valor_medio_m2,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as ultimos_30_dias
        FROM orcamentos 
        WHERE escritorio_id = $1 AND deleted_at IS NULL
      `;

      const statsResult = await client.query(statsQuery, [escritorioId]);
      const stats = statsResult.rows[0];

      // Orçamentos por tipologia
      const tipologiaQuery = `
        SELECT 
          tipologia,
          COUNT(*) as quantidade,
          SUM(valor_total) as valor_total,
          AVG(valor_por_m2) as valor_medio_m2
        FROM orcamentos 
        WHERE escritorio_id = $1 AND deleted_at IS NULL
        GROUP BY tipologia
        ORDER BY quantidade DESC
      `;

      const tipologiaResult = await client.query(tipologiaQuery, [escritorioId]);

      // Orçamentos recentes
      const recentesQuery = `
        SELECT 
          o.id,
          o.codigo,
          o.nome,
          o.status,
          o.valor_total as "valorTotal",
          o.created_at as "createdAt",
          b.nome_projeto as "briefingNome",
          c.nome as "clienteNome"
        FROM orcamentos o
        LEFT JOIN briefings b ON o.briefing_id = b.id
        LEFT JOIN clientes c ON o.cliente_id::text = c.id
        WHERE o.escritorio_id = $1 AND o.deleted_at IS NULL
        ORDER BY o.created_at DESC
        LIMIT 5
      `;

      const recentesResult = await client.query(recentesQuery, [escritorioId]);

      // Evolução mensal (últimos 6 meses)
      const evolucaoQuery = `
        SELECT 
          DATE_TRUNC('month', created_at) as mes,
          COUNT(*) as quantidade,
          SUM(valor_total) as valor_total
        FROM orcamentos 
        WHERE escritorio_id = $1 
          AND deleted_at IS NULL
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY mes DESC
      `;

      const evolucaoResult = await client.query(evolucaoQuery, [escritorioId]);

      return {
        estatisticas: {
          totalOrcamentos: parseInt(stats.total_orcamentos) || 0,
          aprovados: parseInt(stats.aprovados) || 0,
          pendentes: parseInt(stats.pendentes) || 0,
          rejeitados: parseInt(stats.rejeitados) || 0,
          valorTotalGeral: parseFloat(stats.valor_total_geral) || 0,
          valorMedioM2: parseFloat(stats.valor_medio_m2) || 0,
          ultimos30Dias: parseInt(stats.ultimos_30_dias) || 0,
          taxaAprovacao: stats.total_orcamentos > 0 
            ? ((stats.aprovados / stats.total_orcamentos) * 100).toFixed(1)
            : '0.0'
        },
        porTipologia: tipologiaResult.rows,
        orcamentosRecentes: recentesResult.rows,
        evolucaoMensal: evolucaoResult.rows,
        dataAtualizacao: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro no dashboard:', error);
      throw new AppError(
        'Erro ao gerar dashboard de orçamentos',
        500,
        'DASHBOARD_ERROR'
      );
    }
  }

  /**
   * 🔄 Atualizar status do orçamento
   */
  async atualizarStatusOrcamento(orcamentoId, novoStatus, escritorioId, userId, observacoes) {
    const { getClient } = require('../config/database');
    const client = getClient();

    try {
      // Validar status
      const statusValidos = ['RASCUNHO', 'PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO'];
      if (!statusValidos.includes(novoStatus)) {
        throw new AppError(
          'Status inválido',
          400,
          'INVALID_STATUS'
        );
      }

      // Atualizar orçamento
      const result = await client.query(`
        UPDATE orcamentos 
        SET 
          status = $1,
          updated_at = NOW(),
          observacoes = COALESCE($2, observacoes)
        WHERE id = $3::uuid 
          AND escritorio_id = $4::uuid
          AND deleted_at IS NULL
        RETURNING *
      `, [novoStatus, observacoes, orcamentoId, escritorioId]);

      if (result.rows.length === 0) {
        throw new AppError(
          'Orçamento não encontrado',
          404,
          'ORCAMENTO_NOT_FOUND'
        );
      }

      // Registrar histórico
      await client.query(`
        INSERT INTO orcamentos_historico (
          orcamento_id, status_anterior, status_novo, 
          usuario_id, observacoes, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        orcamentoId,
        result.rows[0].status, // Status anterior
        novoStatus,
        userId,
        observacoes
      ]);

      return {
        success: true,
        message: 'Status atualizado com sucesso',
        data: {
          id: result.rows[0].id,
          status: result.rows[0].status,
          updatedAt: result.rows[0].updated_at
        }
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao atualizar status:', error);
      throw new AppError(
        'Erro ao atualizar status do orçamento',
        500,
        'STATUS_UPDATE_ERROR'
      );
    }
  }

  /**
   * 🗑️ Excluir orçamento (soft delete)
   */
  async excluirOrcamentoLogico(orcamentoId, escritorioId, userId) {
    const { getClient } = require('../config/database');
    const client = getClient();

    try {
      const result = await client.query(`
        UPDATE orcamentos 
        SET 
          deleted_at = NOW(),
          deleted_by = $1,
          updated_at = NOW()
        WHERE id = $2::uuid 
          AND escritorio_id = $3::uuid
          AND deleted_at IS NULL
        RETURNING id, codigo
      `, [userId, orcamentoId, escritorioId]);

      if (result.rows.length === 0) {
        throw new AppError(
          'Orçamento não encontrado',
          404,
          'ORCAMENTO_NOT_FOUND'
        );
      }

      return {
        success: true,
        message: 'Orçamento excluído com sucesso',
        data: {
          id: result.rows[0].id,
          codigo: result.rows[0].codigo
        }
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ [ORCAMENTO-CONTROLLER] Erro ao excluir:', error);
      throw new AppError(
        'Erro ao excluir orçamento',
        500,
        'DELETE_ERROR'
      );
    }
  }

  /**
   * 📄 Gerar PDF do orçamento (placeholder)
   */
  async gerarPDFOrcamento(orcamento) {
    // TODO: Implementar geração de PDF
    // Por enquanto, retorna um buffer vazio
    return Buffer.from('PDF em desenvolvimento');
  }
}

module.exports = new OrcamentoController();