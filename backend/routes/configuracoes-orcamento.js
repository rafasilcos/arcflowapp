/**
 * 🔧 ROTAS DE CONFIGURAÇÕES DE ORÇAMENTO
 * 
 * API para gerenciar configurações personalizadas de precificação por escritório
 */

const express = require('express');
const { getClient } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * 📥 GET /api/configuracoes-orcamento/escritorio/:escritorioId
 * Buscar configurações de orçamento do escritório
 */
router.get('/escritorio/:escritorioId', authenticateToken, async (req, res) => {
  try {
    const { escritorioId } = req.params;
    const client = getClient();
    
    // Verificar se usuário pertence ao escritório
    if (req.user.escritorio_id !== escritorioId) {
      throw new AppError('Acesso negado ao escritório', 403, 'ACCESS_DENIED');
    }
    
    const result = await client.query(`
      SELECT 
        id,
        tabela_precos,
        multiplicadores_tipologia,
        multiplicadores_regionais,
        configuracao_financeira,
        ativo,
        created_at,
        updated_at
      FROM configuracoes_orcamento 
      WHERE escritorio_id = $1 AND ativo = true
      ORDER BY updated_at DESC
      LIMIT 1
    `, [escritorioId]);
    
    let configuracao = null;
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      configuracao = {
        id: row.id,
        disciplinas: row.tabela_precos ? JSON.parse(row.tabela_precos) : null,
        multiplicadoresRegionais: row.multiplicadores_regionais ? JSON.parse(row.multiplicadores_regionais) : null,
        padroesConstrucao: row.multiplicadores_tipologia ? JSON.parse(row.multiplicadores_tipologia) : null,
        custosIndiretos: row.configuracao_financeira ? JSON.parse(row.configuracao_financeira) : null,
        ativo: row.ativo,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    }
    
    res.json({
      success: true,
      message: configuracao ? 'Configurações carregadas' : 'Nenhuma configuração personalizada encontrada',
      data: { configuracao }
    });
    
  } catch (error) {
    console.error('❌ [CONFIG-ORCAMENTO] Erro ao buscar configurações:', error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * 💾 POST /api/configuracoes-orcamento/salvar
 * Salvar configurações de orçamento do escritório
 */
router.post('/salvar', authenticateToken, async (req, res) => {
  try {
    const { configuracao } = req.body;
    const escritorioId = req.user.escritorio_id;
    const userId = req.user.id;
    
    if (!configuracao) {
      throw new AppError('Configuração é obrigatória', 400, 'MISSING_CONFIGURATION');
    }
    
    const client = getClient();
    
    // Preparar dados para salvar
    const tabelaPrecos = configuracao.disciplinas ? JSON.stringify(configuracao.disciplinas) : null;
    const multiplicadoresRegionais = configuracao.multiplicadoresRegionais ? JSON.stringify(configuracao.multiplicadoresRegionais) : null;
    const multiplicadoresTipologia = configuracao.padroesConstrucao ? JSON.stringify(configuracao.padroesConstrucao) : null;
    const configuracaoFinanceira = configuracao.custosIndiretos ? JSON.stringify(configuracao.custosIndiretos) : null;
    
    // Verificar se já existe configuração ativa
    const existente = await client.query(`
      SELECT id FROM configuracoes_orcamento 
      WHERE escritorio_id = $1 AND ativo = true
    `, [escritorioId]);
    
    let result;
    
    if (existente.rows.length > 0) {
      // Atualizar configuração existente
      result = await client.query(`
        UPDATE configuracoes_orcamento 
        SET 
          tabela_precos = $2,
          multiplicadores_regionais = $3,
          multiplicadores_tipologia = $4,
          configuracao_financeira = $5,
          updated_at = NOW()
        WHERE escritorio_id = $1 AND ativo = true
        RETURNING id
      `, [escritorioId, tabelaPrecos, multiplicadoresRegionais, multiplicadoresTipologia, configuracaoFinanceira]);
      
    } else {
      // Criar nova configuração
      result = await client.query(`
        INSERT INTO configuracoes_orcamento (
          escritorio_id,
          tabela_precos,
          multiplicadores_regionais,
          multiplicadores_tipologia,
          configuracao_financeira,
          ativo,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
        RETURNING id
      `, [escritorioId, tabelaPrecos, multiplicadoresRegionais, multiplicadoresTipologia, configuracaoFinanceira]);
    }
    
    console.log('✅ [CONFIG-ORCAMENTO] Configurações salvas:', {
      escritorioId,
      configId: result.rows[0].id,
      userId
    });
    
    res.json({
      success: true,
      message: 'Configurações salvas com sucesso!',
      data: {
        configId: result.rows[0].id,
        escritorioId
      }
    });
    
  } catch (error) {
    console.error('❌ [CONFIG-ORCAMENTO] Erro ao salvar configurações:', error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar configurações',
      code: 'SAVE_ERROR'
    });
  }
});

/**
 * 🔄 POST /api/configuracoes-orcamento/resetar
 * Resetar configurações para padrão
 */
router.post('/resetar', authenticateToken, async (req, res) => {
  try {
    const escritorioId = req.user.escritorio_id;
    const client = getClient();
    
    // Desativar configurações existentes
    await client.query(`
      UPDATE configuracoes_orcamento 
      SET ativo = false, updated_at = NOW()
      WHERE escritorio_id = $1
    `, [escritorioId]);
    
    console.log('✅ [CONFIG-ORCAMENTO] Configurações resetadas para padrão:', { escritorioId });
    
    res.json({
      success: true,
      message: 'Configurações resetadas para o padrão com sucesso!',
      data: { escritorioId }
    });
    
  } catch (error) {
    console.error('❌ [CONFIG-ORCAMENTO] Erro ao resetar configurações:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao resetar configurações',
      code: 'RESET_ERROR'
    });
  }
});

/**
 * 📊 GET /api/configuracoes-orcamento/preview
 * Preview de orçamento com configurações atuais
 */
router.post('/preview', authenticateToken, async (req, res) => {
  try {
    const { areaConstruida = 150, regiao = 'BRASIL', complexidade = 'MEDIA', disciplinas = ['ARQUITETURA'] } = req.body;
    const escritorioId = req.user.escritorio_id;
    
    // Simular cálculo de preview (versão simplificada)
    const OrcamentoCalculator = require('../utils/orcamentoCalculator');
    const calculator = new OrcamentoCalculator();
    
    // Carregar configurações personalizadas
    await calculator.carregarConfiguracoesPrecificacao(escritorioId);
    
    // Dados simulados para preview
    const dadosSimulados = {
      areaConstruida,
      complexidade,
      localizacao: regiao,
      disciplinasNecessarias: disciplinas,
      tipologia: 'RESIDENCIAL',
      subtipo: 'unifamiliar',
      escritorioId
    };
    
    const preview = await calculator.calcularOrcamentoAvancado(dadosSimulados);
    
    res.json({
      success: true,
      message: 'Preview calculado com sucesso',
      data: {
        valorTotal: preview.valorTotal,
        valorPorM2: preview.valorPorM2,
        areaConstruida: preview.areaConstruida,
        disciplinas: preview.disciplinas,
        composicaoFinanceira: preview.composicaoFinanceira,
        prazoEntrega: preview.prazoEntrega
      }
    });
    
  } catch (error) {
    console.error('❌ [CONFIG-ORCAMENTO] Erro no preview:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao calcular preview',
      code: 'PREVIEW_ERROR'
    });
  }
});

module.exports = router;