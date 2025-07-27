// 🧠 API DE ORÇAMENTOS INTELIGENTES - ARCFLOW
// Sistema que gera orçamentos precisos analisando briefings automaticamente

import { Router, Request, Response } from 'express';
import { prisma } from '../config/database-simple';
import { authMiddleware } from '../middleware/auth';
import { briefingTriggerMiddleware, customBriefingTriggerMiddleware } from '../middleware/briefingTriggerMiddleware';
import { logger } from '../config/logger';
import { BriefingToOrcamentoService } from '../services/briefingToOrcamentoService';
import { BriefingAnalysisEngine } from '../services/briefingAnalysisEngine';
import { AdaptiveParser } from '../services/adaptiveParser';
import { BudgetCalculationService } from '../services/budgetCalculationService';
import { ConfigurationManagementService } from '../services/configurationManagementService';
import { queueService } from '../services/queueService';
import { triggerService } from '../services/triggerService';

const router = Router();

// Instâncias dos serviços
const briefingToOrcamentoService = BriefingToOrcamentoService.getInstance();
const briefingAnalysisEngine = new BriefingAnalysisEngine();
const adaptiveParser = new AdaptiveParser();
const configService = new ConfigurationManagementService();

// 🧠 POST /api/orcamentos-inteligentes/gerar/:briefingId
// Modificado para suportar briefings personalizados
router.post('/gerar/:briefingId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { briefingId } = req.params;
    const escritorioId = req.user?.escritorioId;
    const userId = req.user?.id;

    if (!escritorioId || !userId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('🧠 Iniciando geração de orçamento inteligente:', { briefingId, escritorioId, userId });

    // 1. Buscar briefing completo
    const briefingResult = await prisma.$queryRaw`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        u.nome as responsavel_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id = c.id
      LEFT JOIN users u ON b.responsavel_id = u.id
      WHERE b.id = ${briefingId} AND b.escritorio_id = ${escritorioId} AND b.deleted_at IS NULL
    ` as any[];

    if (briefingResult.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado',
        code: 'BRIEFING_NOT_FOUND'
      });
    }

    const briefing = briefingResult[0];

    // Verificar se já existe orçamento para este briefing
    const orcamentoExistente = await prisma.$queryRaw`
      SELECT id FROM orcamentos 
      WHERE briefing_id = ${briefingId} AND escritorio_id = ${escritorioId}
    ` as any[];

    if (orcamentoExistente.length > 0) {
      return res.status(400).json({
        error: 'Já existe um orçamento para este briefing',
        code: 'ORCAMENTO_ALREADY_EXISTS',
        orcamentoId: orcamentoExistente[0].id
      });
    }

    // 2. Obter configurações do escritório
    const configuracao = await configService.obterConfiguracaoEscritorio(escritorioId);

    // 3. Determinar se é briefing padrão ou personalizado
    let dadosExtraidos;
    const isBriefingPersonalizado = briefing.tipo_briefing === 'PERSONALIZADO' || 
                                   briefing.estrutura_personalizada || 
                                   !briefing.template_id;

    if (isBriefingPersonalizado) {
      logger.info('🎨 Processando briefing personalizado com Adaptive Parser');
      dadosExtraidos = await adaptiveParser.extrairDados(briefing);
    } else {
      logger.info('📋 Processando briefing padrão com Analysis Engine');
      dadosExtraidos = await briefingAnalysisEngine.extrairDados(briefing);
    }

    // 4. Calcular orçamento usando Budget Calculation Service
    const budgetService = new BudgetCalculationService(configuracao);
    const orcamentoCalculado = await budgetService.calcularOrcamento(
      dadosExtraidos,
      briefingId,
      escritorioId
    );

    // 5. Salvar orçamento no banco
    const orcamentoResult = await prisma.$queryRaw`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, 
        area_construida, area_terreno, valor_total, valor_por_m2,
        tipologia, padrao, complexidade, localizacao,
        disciplinas, composicao_financeira, cronograma, proposta,
        briefing_id, cliente_id, escritorio_id, responsavel_id,
        dados_extraidos
      ) VALUES (
        ${orcamentoCalculado.codigo},
        ${orcamentoCalculado.nome},
        ${orcamentoCalculado.descricao},
        ${orcamentoCalculado.status},
        ${orcamentoCalculado.areaConstruida},
        ${orcamentoCalculado.areaTerreno || null},
        ${orcamentoCalculado.valorTotal},
        ${orcamentoCalculado.valorPorM2},
        ${orcamentoCalculado.tipologia},
        ${orcamentoCalculado.padrao},
        ${orcamentoCalculado.complexidade},
        ${orcamentoCalculado.localizacao || null},
        ${JSON.stringify(orcamentoCalculado.disciplinas)},
        ${JSON.stringify(orcamentoCalculado.composicaoFinanceira)},
        ${JSON.stringify(orcamentoCalculado.cronograma)},
        ${JSON.stringify(orcamentoCalculado.proposta)},
        ${briefingId},
        ${briefing.cliente_id},
        ${escritorioId},
        ${userId},
        ${JSON.stringify(dadosExtraidos)}
      ) RETURNING id
    ` as any[];

    const orcamentoId = orcamentoResult[0].id;

    // 6. Atualizar briefing com dados extraídos e referência ao orçamento
    await prisma.$queryRaw`
      UPDATE briefings 
      SET 
        status = ${'ORCAMENTO_ELABORACAO'},
        dados_extraidos = ${JSON.stringify(dadosExtraidos)},
        orcamento_gerado = true,
        orcamento_id = ${orcamentoId},
        updated_at = NOW() 
      WHERE id = ${briefingId} AND escritorio_id = ${escritorioId}
    `;

    logger.info('✅ Orçamento inteligente gerado com sucesso:', {
      orcamentoId,
      briefingId,
      valorTotal: orcamentoCalculado.valorTotal,
      areaConstruida: orcamentoCalculado.areaConstruida,
      complexidade: orcamentoCalculado.complexidade,
      disciplinas: orcamentoCalculado.disciplinas.length,
      tipoBriefing: isBriefingPersonalizado ? 'PERSONALIZADO' : 'PADRÃO'
    });

    res.json({
      success: true,
      message: 'Orçamento inteligente gerado com sucesso!',
      data: {
        orcamentoId,
        codigo: orcamentoCalculado.codigo,
        valorTotal: orcamentoCalculado.valorTotal,
        valorPorM2: orcamentoCalculado.valorPorM2,
        areaConstruida: orcamentoCalculado.areaConstruida,
        prazoEntrega: orcamentoCalculado.cronograma.prazoTotal,
        briefingId,
        tipoBriefing: isBriefingPersonalizado ? 'PERSONALIZADO' : 'PADRÃO',
        dadosExtraidos,
        disciplinas: orcamentoCalculado.disciplinas,
        composicaoFinanceira: orcamentoCalculado.composicaoFinanceira,
        cronograma: orcamentoCalculado.cronograma
      }
    });

  } catch (error: any) {
    logger.error('❌ Erro ao gerar orçamento inteligente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🧠 POST /api/orcamentos-inteligentes/gerar-automatico/:briefingId
// Novo endpoint para geração automática (sem interação do usuário)
router.post('/gerar-automatico/:briefingId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { briefingId } = req.params;
    const escritorioId = req.user?.escritorioId;
    const userId = req.user?.id;

    if (!escritorioId || !userId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('🤖 Iniciando geração automática de orçamento:', { briefingId, escritorioId });

    // Verificar se o briefing está no status correto para geração automática
    const briefingResult = await prisma.$queryRaw`
      SELECT * FROM briefings 
      WHERE id = ${briefingId} 
        AND escritorio_id = ${escritorioId} 
        AND status = 'CONCLUIDO'
        AND deleted_at IS NULL
    ` as any[];

    if (briefingResult.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado ou não está concluído',
        code: 'BRIEFING_NOT_READY'
      });
    }

    // Verificar se já existe orçamento
    const orcamentoExistente = await prisma.$queryRaw`
      SELECT id FROM orcamentos 
      WHERE briefing_id = ${briefingId} AND escritorio_id = ${escritorioId}
    ` as any[];

    if (orcamentoExistente.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Orçamento já existe para este briefing',
        data: {
          orcamentoId: orcamentoExistente[0].id,
          briefingId
        }
      });
    }

    // Redirecionar para o endpoint principal de geração
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/orcamentos-inteligentes/gerar/${briefingId}`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok) {
      logger.info('✅ Orçamento gerado automaticamente:', { briefingId, orcamentoId: result.data.orcamentoId });
    }

    res.status(response.status).json(result);

  } catch (error: any) {
    logger.error('❌ Erro na geração automática:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🧠 GET /api/orcamentos-inteligentes/preview/:briefingId
// Novo endpoint para visualização prévia do orçamento
router.get('/preview/:briefingId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { briefingId } = req.params;
    const escritorioId = req.user?.escritorioId;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('👁️ Gerando preview de orçamento:', { briefingId, escritorioId });

    // 1. Buscar briefing
    const briefingResult = await prisma.$queryRaw`
      SELECT * FROM briefings 
      WHERE id = ${briefingId} AND escritorio_id = ${escritorioId} AND deleted_at IS NULL
    ` as any[];

    if (briefingResult.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado',
        code: 'BRIEFING_NOT_FOUND'
      });
    }

    const briefing = briefingResult[0];

    // 2. Obter configurações do escritório
    const configuracao = await configService.obterConfiguracaoEscritorio(escritorioId);

    // 3. Extrair dados (sem salvar)
    let dadosExtraidos;
    const isBriefingPersonalizado = briefing.tipo_briefing === 'PERSONALIZADO' || 
                                   briefing.estrutura_personalizada || 
                                   !briefing.template_id;

    if (isBriefingPersonalizado) {
      dadosExtraidos = await adaptiveParser.extrairDados(briefing);
    } else {
      dadosExtraidos = await briefingAnalysisEngine.extrairDados(briefing);
    }

    // 4. Calcular orçamento (sem salvar)
    const budgetService = new BudgetCalculationService(configuracao);
    const orcamentoCalculado = await budgetService.calcularOrcamento(
      dadosExtraidos,
      briefingId,
      escritorioId
    );

    res.json({
      success: true,
      message: 'Preview do orçamento gerado com sucesso!',
      data: {
        briefingId,
        tipoBriefing: isBriefingPersonalizado ? 'PERSONALIZADO' : 'PADRÃO',
        dadosExtraidos,
        orcamento: {
          valorTotal: orcamentoCalculado.valorTotal,
          valorPorM2: orcamentoCalculado.valorPorM2,
          areaConstruida: orcamentoCalculado.areaConstruida,
          prazoTotal: orcamentoCalculado.cronograma.prazoTotal,
          disciplinas: orcamentoCalculado.disciplinas,
          composicaoFinanceira: orcamentoCalculado.composicaoFinanceira,
          cronograma: orcamentoCalculado.cronograma
        }
      }
    });

  } catch (error: any) {
    logger.error('❌ Erro ao gerar preview:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🧠 POST /api/orcamentos-inteligentes/regenerar/:orcamentoId
// Novo endpoint para regenerar orçamento existente
router.post('/regenerar/:orcamentoId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { orcamentoId } = req.params;
    const escritorioId = req.user?.escritorioId;
    const userId = req.user?.id;

    if (!escritorioId || !userId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('🔄 Iniciando regeneração de orçamento:', { orcamentoId, escritorioId });

    // 1. Buscar orçamento existente
    const orcamentoResult = await prisma.$queryRaw`
      SELECT o.*, b.* FROM orcamentos o
      JOIN briefings b ON o.briefing_id = b.id
      WHERE o.id = ${orcamentoId} 
        AND o.escritorio_id = ${escritorioId}
    ` as any[];

    if (orcamentoResult.length === 0) {
      return res.status(404).json({
        error: 'Orçamento não encontrado',
        code: 'ORCAMENTO_NOT_FOUND'
      });
    }

    const orcamentoExistente = orcamentoResult[0];

    // 2. Salvar versão anterior no histórico
    await prisma.$queryRaw`
      INSERT INTO historico_orcamentos (
        orcamento_id, versao_anterior, usuario_id, motivo, created_at
      ) VALUES (
        ${orcamentoId},
        ${JSON.stringify({
          valor_total: orcamentoExistente.valor_total,
          disciplinas: orcamentoExistente.disciplinas,
          composicao_financeira: orcamentoExistente.composicao_financeira,
          cronograma: orcamentoExistente.cronograma
        })},
        ${userId},
        ${'Regeneração automática'},
        NOW()
      )
    `;

    // 3. Obter configurações atualizadas
    const configuracao = await configService.obterConfiguracaoEscritorio(escritorioId);

    // 4. Re-extrair dados do briefing
    let dadosExtraidos;
    const isBriefingPersonalizado = orcamentoExistente.tipo_briefing === 'PERSONALIZADO' || 
                                   orcamentoExistente.estrutura_personalizada || 
                                   !orcamentoExistente.template_id;

    if (isBriefingPersonalizado) {
      dadosExtraidos = await adaptiveParser.extrairDados(orcamentoExistente);
    } else {
      dadosExtraidos = await briefingAnalysisEngine.extrairDados(orcamentoExistente);
    }

    // 5. Recalcular orçamento
    const budgetService = new BudgetCalculationService(configuracao);
    const orcamentoRecalculado = await budgetService.calcularOrcamento(
      dadosExtraidos,
      orcamentoExistente.briefing_id,
      escritorioId
    );

    // 6. Atualizar orçamento existente
    await prisma.$queryRaw`
      UPDATE orcamentos SET
        valor_total = ${orcamentoRecalculado.valorTotal},
        valor_por_m2 = ${orcamentoRecalculado.valorPorM2},
        disciplinas = ${JSON.stringify(orcamentoRecalculado.disciplinas)},
        composicao_financeira = ${JSON.stringify(orcamentoRecalculado.composicaoFinanceira)},
        cronograma = ${JSON.stringify(orcamentoRecalculado.cronograma)},
        proposta = ${JSON.stringify(orcamentoRecalculado.proposta)},
        dados_extraidos = ${JSON.stringify(dadosExtraidos)},
        updated_at = NOW()
      WHERE id = ${orcamentoId}
    `;

    logger.info('✅ Orçamento regenerado com sucesso:', {
      orcamentoId,
      valorAnterior: orcamentoExistente.valor_total,
      valorNovo: orcamentoRecalculado.valorTotal,
      diferenca: orcamentoRecalculado.valorTotal - orcamentoExistente.valor_total
    });

    res.json({
      success: true,
      message: 'Orçamento regenerado com sucesso!',
      data: {
        orcamentoId,
        valorAnterior: orcamentoExistente.valor_total,
        valorNovo: orcamentoRecalculado.valorTotal,
        diferenca: orcamentoRecalculado.valorTotal - orcamentoExistente.valor_total,
        percentualVariacao: ((orcamentoRecalculado.valorTotal - orcamentoExistente.valor_total) / orcamentoExistente.valor_total) * 100,
        dadosExtraidos,
        orcamento: orcamentoRecalculado
      }
    });

  } catch (error: any) {
    logger.error('❌ Erro ao regenerar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🧠 GET /api/orcamentos-inteligentes/analise/:briefingId - Apenas analisar briefing (sem salvar)
router.get('/analise/:briefingId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { briefingId } = req.params;
    const escritorioId = req.user?.escritorioId;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('🔍 Iniciando análise de briefing:', { briefingId, escritorioId });

    // 1. Buscar briefing completo
    const briefingResult = await prisma.$queryRaw`
      SELECT * FROM briefings 
      WHERE id = ${briefingId} AND escritorio_id = ${escritorioId} AND deleted_at IS NULL
    ` as any[];

    if (briefingResult.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado',
        code: 'BRIEFING_NOT_FOUND'
      });
    }

    const briefing = briefingResult[0];

    // 2. Determinar tipo de briefing e extrair dados
    let dadosExtraidos;
    const isBriefingPersonalizado = briefing.tipo_briefing === 'PERSONALIZADO' || 
                                   briefing.estrutura_personalizada || 
                                   !briefing.template_id;

    if (isBriefingPersonalizado) {
      logger.info('🎨 Analisando briefing personalizado');
      dadosExtraidos = await adaptiveParser.extrairDados(briefing);
    } else {
      logger.info('📋 Analisando briefing padrão');
      dadosExtraidos = await briefingAnalysisEngine.extrairDados(briefing);
    }

    res.json({
      success: true,
      message: 'Análise do briefing concluída!',
      data: {
        briefingId,
        tipoBriefing: isBriefingPersonalizado ? 'PERSONALIZADO' : 'PADRÃO',
        dadosExtraidos,
        analise: {
          viabilidade: dadosExtraidos.areaConstruida && dadosExtraidos.tipologia && dadosExtraidos.complexidade,
          dadosMinimos: {
            areaConstruida: !!dadosExtraidos.areaConstruida,
            tipologia: !!dadosExtraidos.tipologia,
            complexidade: !!dadosExtraidos.complexidade,
            disciplinas: dadosExtraidos.disciplinasNecessarias?.length > 0
          },
          recomendacoes: []
        }
      }
    });

  } catch (error: any) {
    logger.error('❌ Erro ao analisar briefing:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🧠 GET /api/orcamentos-inteligentes/briefings-disponiveis - Listar briefings prontos para orçamento
router.get('/briefings-disponiveis', authMiddleware, async (req: Request, res: Response) => {
  try {
    const escritorioId = req.user?.escritorioId;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('📋 Listando briefings disponíveis para orçamento:', { escritorioId });

    // Buscar briefings CONCLUÍDOS que ainda não foram para orçamento
    const briefingsResult = await prisma.$queryRaw`
      SELECT 
        b.id,
        b.nome_projeto,
        b.descricao,
        b.status,
        b.progresso,
        b.tipo_briefing,
        b.template_id,
        b.estrutura_personalizada,
        b.created_at,
        b.updated_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        u.id as responsavel_id,
        u.nome as responsavel_nome,
        CASE 
          WHEN o.briefing_id IS NOT NULL THEN true 
          ELSE false 
        END as tem_orcamento,
        o.id as orcamento_id,
        o.valor_total as orcamento_valor
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id = c.id
      LEFT JOIN users u ON b.responsavel_id = u.id
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE b.escritorio_id = ${escritorioId} 
        AND b.status IN ('CONCLUIDO', 'EM_EDICAO')
        AND b.deleted_at IS NULL
      ORDER BY b.created_at DESC
      LIMIT 50
    ` as any[];

    const briefings = briefingsResult.map((row: any) => ({
      id: row.id,
      nomeProjeto: row.nome_projeto,
      descricao: row.descricao,
      status: row.status,
      progresso: row.progresso,
      tipoBriefing: row.tipo_briefing === 'PERSONALIZADO' || row.estrutura_personalizada || !row.template_id ? 'PERSONALIZADO' : 'PADRÃO',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      cliente: {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email
      },
      responsavel: {
        id: row.responsavel_id,
        nome: row.responsavel_nome
      },
      temOrcamento: row.tem_orcamento,
      orcamento: row.tem_orcamento ? {
        id: row.orcamento_id,
        valor: row.orcamento_valor
      } : null
    }));

    res.json({
      success: true,
      data: briefings,
      message: `${briefings.length} briefings disponíveis para orçamento inteligente`,
      estatisticas: {
        total: briefings.length,
        comOrcamento: briefings.filter(b => b.temOrcamento).length,
        semOrcamento: briefings.filter(b => !b.temOrcamento).length,
        personalizados: briefings.filter(b => b.tipoBriefing === 'PERSONALIZADO').length,
        padrao: briefings.filter(b => b.tipoBriefing === 'PADRÃO').length
      }
    });

  } catch (error: any) {
    logger.error('❌ Erro ao listar briefings disponíveis:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

export default router;