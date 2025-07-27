import express from 'express';
import { authenticateToken } from '../middleware/auth';
import historicoOrcamentoService, { HistoricoFiltros } from '../services/historicoOrcamentoService';
import auditoriaService from '../services/auditoriaService';

const router = express.Router();

/**
 * GET /api/historico-orcamentos/:orcamentoId
 * Busca histórico de versões de um orçamento específico
 */
router.get('/:orcamentoId', authenticateToken, async (req, res) => {
  try {
    const { orcamentoId } = req.params;
    const { limite, offset } = req.query;

    // Verificar se o usuário tem acesso ao orçamento
    // (implementar verificação de escritório)

    const filtros: HistoricoFiltros = {
      orcamentoId,
      escritorioId: req.user.escritorio_id,
      limite: limite ? parseInt(limite as string) : 50,
      offset: offset ? parseInt(offset as string) : 0
    };

    const historico = await historicoOrcamentoService.buscarHistorico(filtros);

    res.json({
      success: true,
      data: historico,
      total: historico.length
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/historico-orcamentos/briefing/:briefingId
 * Busca histórico de todos os orçamentos de um briefing
 */
router.get('/briefing/:briefingId', authenticateToken, async (req, res) => {
  try {
    const { briefingId } = req.params;
    const { limite, offset } = req.query;

    const filtros: HistoricoFiltros = {
      briefingId,
      escritorioId: req.user.escritorio_id,
      limite: limite ? parseInt(limite as string) : 50,
      offset: offset ? parseInt(offset as string) : 0
    };

    const historico = await historicoOrcamentoService.buscarHistorico(filtros);

    res.json({
      success: true,
      data: historico,
      total: historico.length
    });

  } catch (error) {
    console.error('Erro ao buscar histórico por briefing:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/historico-orcamentos/comparar/:orcamentoId/:versaoAnterior/:versaoAtual
 * Compara duas versões de um orçamento
 */
router.get('/comparar/:orcamentoId/:versaoAnterior/:versaoAtual', authenticateToken, async (req, res) => {
  try {
    const { orcamentoId, versaoAnterior, versaoAtual } = req.params;

    // Verificar se o usuário tem acesso ao orçamento
    // (implementar verificação de escritório)

    const comparacao = await historicoOrcamentoService.compararVersoes(
      orcamentoId,
      parseInt(versaoAnterior),
      parseInt(versaoAtual)
    );

    res.json({
      success: true,
      data: comparacao
    });

  } catch (error) {
    console.error('Erro ao comparar versões:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * POST /api/historico-orcamentos/:orcamentoId/salvar-versao
 * Salva uma nova versão do orçamento no histórico
 */
router.post('/:orcamentoId/salvar-versao', authenticateToken, async (req, res) => {
  try {
    const { orcamentoId } = req.params;
    const { briefingId, dadosOrcamento, motivoAlteracao } = req.body;

    if (!briefingId || !dadosOrcamento || !motivoAlteracao) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    // Verificar se o usuário tem acesso ao orçamento
    // (implementar verificação de escritório)

    const novaVersao = await historicoOrcamentoService.salvarVersao(
      orcamentoId,
      briefingId,
      dadosOrcamento,
      motivoAlteracao,
      req.user.id
    );

    // Registrar na auditoria
    await auditoriaService.registrarAcao(
      'orcamento',
      orcamentoId,
      'atualizacao',
      req.user.id,
      req.user.escritorio_id,
      null,
      dadosOrcamento,
      `Nova versão salva: ${motivoAlteracao}`,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json({
      success: true,
      data: novaVersao,
      message: 'Versão salva com sucesso'
    });

  } catch (error) {
    console.error('Erro ao salvar versão:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/historico-orcamentos/escritorio/estatisticas
 * Busca estatísticas do histórico do escritório
 */
router.get('/escritorio/estatisticas', authenticateToken, async (req, res) => {
  try {
    const estatisticas = await historicoOrcamentoService.buscarEstatisticas(req.user.escritorio_id);

    res.json({
      success: true,
      data: estatisticas
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/historico-orcamentos/auditoria/relatorio
 * Gera relatório de auditoria do escritório
 */
router.get('/auditoria/relatorio', authenticateToken, async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    let periodo;
    if (dataInicio && dataFim) {
      periodo = {
        inicio: new Date(dataInicio as string),
        fim: new Date(dataFim as string)
      };
    }

    const relatorio = await auditoriaService.gerarRelatorio(req.user.escritorio_id, periodo);

    res.json({
      success: true,
      data: relatorio
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * GET /api/historico-orcamentos/auditoria/registros
 * Busca registros de auditoria com filtros
 */
router.get('/auditoria/registros', authenticateToken, async (req, res) => {
  try {
    const { entidade, entidadeId, acao, usuarioId, dataInicio, dataFim, limite, offset } = req.query;

    const filtros = {
      entidade: entidade as any,
      entidadeId: entidadeId as string,
      acao: acao as string,
      usuarioId: usuarioId as string,
      escritorioId: req.user.escritorio_id,
      dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
      dataFim: dataFim ? new Date(dataFim as string) : undefined,
      limite: limite ? parseInt(limite as string) : 50,
      offset: offset ? parseInt(offset as string) : 0
    };

    const registros = await auditoriaService.buscarRegistros(filtros);

    res.json({
      success: true,
      data: registros,
      total: registros.length
    });

  } catch (error) {
    console.error('Erro ao buscar registros de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * DELETE /api/historico-orcamentos/limpeza/versoes-antigas
 * Remove versões antigas do histórico (apenas para administradores)
 */
router.delete('/limpeza/versoes-antigas', authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário é administrador
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem executar limpeza.'
      });
    }

    const versõesRemovidas = await historicoOrcamentoService.limparVersõesAntigas();
    const registrosRemovidos = await auditoriaService.limparRegistrosAntigos();

    res.json({
      success: true,
      data: {
        versõesRemovidas,
        registrosRemovidos
      },
      message: 'Limpeza executada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao executar limpeza:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

export default router;