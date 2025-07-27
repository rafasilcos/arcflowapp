/**
 * Exemplo de Integração dos Serviços de Validação
 * Tarefa 11: Implementar validações e tratamento de erros
 * 
 * Este arquivo demonstra como integrar todos os serviços de validação
 * nas APIs de orçamento existentes
 */

import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { budgetErrorHandler, asyncErrorHandler, validateBudgetRequest } from '../middleware/budgetErrorHandler';
import { validationService } from '../services/validationService';
import { fallbackService } from '../services/fallbackService';
import { 
  BriefingAnalysisError, 
  BudgetCalculationError, 
  InsufficientDataError,
  ERROR_CODES 
} from '../services/errors/BudgetErrors';

const router = Router();

/**
 * POST /api/orcamentos-validacao-exemplo/gerar/:briefingId
 * Exemplo de geração de orçamento com validação completa
 */
router.post('/gerar/:briefingId', 
  authMiddleware,
  validateBudgetRequest(['briefingId']),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { briefingId } = req.params;
    const { forcarFallback = false, nivelConfiancaMinimo = 'MEDIA' } = req.body;
    const escritorioId = req.user?.escritorioId;

    // 1. Buscar briefing (simulado)
    const briefing = await buscarBriefing(briefingId, escritorioId);
    
    // 2. Validar se briefing existe e tem dados mínimos
    validationService.validarBriefingParaOrcamento(briefing, briefingId);

    // 3. Extrair dados do briefing
    const dadosExtraidos = extrairDadosDoBriefing(briefing);

    // 4. Validar dados mínimos
    const validacao = validationService.validarDadosMinimos(dadosExtraidos, briefingId);

    let dadosFinais = dadosExtraidos;
    let fallbacksAplicados: string[] = [];

    // 5. Se dados insuficientes, aplicar fallbacks ou solicitar dados
    if (!validacao.valido) {
      if (forcarFallback) {
        // Aplicar fallbacks automaticamente
        const resultadoFallback = await fallbackService.aplicarFallbacks(
          dadosExtraidos, 
          briefingId,
          { nivelConfiancaMinimo: nivelConfiancaMinimo as any }
        );

        if (!resultadoFallback.success) {
          throw new BriefingAnalysisError(
            'Não foi possível aplicar fallbacks para dados insuficientes',
            briefingId,
            validacao.dadosFaltantes,
            validacao.sugestoesFallback,
            ERROR_CODES.INSUFFICIENT_DATA
          );
        }

        dadosFinais = resultadoFallback.dadosCorrigidos;
        fallbacksAplicados = resultadoFallback.fallbacksAplicados.map(f => f.motivo);

      } else {
        // Solicitar dados complementares
        const solicitacao = validationService.criarSolicitacaoDadosComplementares(
          validacao.dadosFaltantes,
          briefingId
        );

        return res.status(422).json({
          success: false,
          error: {
            code: ERROR_CODES.INSUFFICIENT_DATA,
            message: 'Dados insuficientes para gerar orçamento',
            details: {
              briefingId,
              missingFields: validacao.dadosFaltantes,
              suggestions: validacao.sugestoesFallback
            }
          },
          dataRequest: solicitacao,
          fallbackOption: {
            available: true,
            description: 'Você pode optar por usar estimativas automáticas',
            endpoint: `/api/orcamentos-validacao-exemplo/gerar/${briefingId}`,
            body: { forcarFallback: true, nivelConfiancaMinimo }
          }
        });
      }
    }

    // 6. Calcular orçamento (simulado)
    const orcamentoCalculado = await calcularOrcamento(dadosFinais, escritorioId);

    // 7. Validar valores calculados
    validationService.validarValoresCalculados(
      orcamentoCalculado.valorTotal,
      orcamentoCalculado.horasTotal,
      dadosFinais.areaConstruida || 0,
      briefingId
    );

    // 8. Retornar resultado com informações de validação
    return res.json({
      success: true,
      data: {
        orcamento: orcamentoCalculado,
        dadosUtilizados: dadosFinais,
        validacao: {
          dadosOriginais: dadosExtraidos,
          fallbacksAplicados,
          avisos: validacao.avisos,
          confianca: fallbacksAplicados.length === 0 ? 'ALTA' : 'MEDIA'
        }
      }
    });
  })
);

/**
 * POST /api/orcamentos-validacao-exemplo/completar-dados/:briefingId
 * Endpoint para receber dados complementares do usuário
 */
router.post('/completar-dados/:briefingId',
  authMiddleware,
  validateBudgetRequest(['briefingId']),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { briefingId } = req.params;
    const dadosComplementares = req.body;
    const escritorioId = req.user?.escritorioId;

    // 1. Buscar briefing original
    const briefing = await buscarBriefing(briefingId, escritorioId);
    
    // 2. Combinar dados originais com complementares
    const dadosCombinados = {
      ...extrairDadosDoBriefing(briefing),
      ...dadosComplementares
    };

    // 3. Validar dados combinados
    const validacao = validationService.validarDadosMinimos(dadosCombinados, briefingId);

    if (!validacao.valido) {
      throw new InsufficientDataError(
        'Dados complementares ainda são insuficientes',
        briefingId,
        validacao.dadosFaltantes,
        Object.keys(dadosCombinados),
        validacao.sugestoesFallback,
        ERROR_CODES.MISSING_REQUIRED_FIELDS
      );
    }

    // 4. Calcular orçamento com dados completos
    const orcamentoCalculado = await calcularOrcamento(dadosCombinados, escritorioId);

    // 5. Validar valores calculados
    validationService.validarValoresCalculados(
      orcamentoCalculado.valorTotal,
      orcamentoCalculado.horasTotal,
      dadosCombinados.areaConstruida || 0,
      briefingId
    );

    return res.json({
      success: true,
      data: {
        orcamento: orcamentoCalculado,
        dadosUtilizados: dadosCombinados,
        validacao: {
          confianca: 'ALTA',
          dadosComplementaresRecebidos: Object.keys(dadosComplementares)
        }
      }
    });
  })
);

/**
 * GET /api/orcamentos-validacao-exemplo/preview/:briefingId
 * Preview com validação e fallbacks
 */
router.get('/preview/:briefingId',
  authMiddleware,
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { briefingId } = req.params;
    const escritorioId = req.user?.escritorioId;

    // 1. Buscar briefing
    const briefing = await buscarBriefing(briefingId, escritorioId);
    
    // 2. Extrair dados
    const dadosExtraidos = extrairDadosDoBriefing(briefing);

    // 3. Validar dados
    const validacao = validationService.validarDadosMinimos(dadosExtraidos, briefingId);

    // 4. Aplicar fallbacks para preview
    const resultadoFallback = await fallbackService.aplicarFallbacks(
      dadosExtraidos,
      briefingId,
      { permitirEstimativas: true, nivelConfiancaMinimo: 'BAIXA' }
    );

    // 5. Calcular preview do orçamento
    const previewOrcamento = await calcularOrcamento(
      resultadoFallback.dadosCorrigidos,
      escritorioId
    );

    return res.json({
      success: true,
      data: {
        preview: previewOrcamento,
        dadosUtilizados: resultadoFallback.dadosCorrigidos,
        validacao: {
          dadosOriginais: dadosExtraidos,
          dadosValidos: validacao.valido,
          erros: validacao.erros,
          avisos: validacao.avisos,
          fallbacks: resultadoFallback.fallbacksAplicados,
          recomendacoes: resultadoFallback.recomendacoes,
          confianca: validacao.valido ? 'ALTA' : 'MEDIA'
        }
      }
    });
  })
);

/**
 * POST /api/orcamentos-validacao-exemplo/validar
 * Endpoint para validar dados antes de gerar orçamento
 */
router.post('/validar',
  authMiddleware,
  asyncErrorHandler(async (req: Request, res: Response) => {
    const dadosParaValidar = req.body;
    const briefingId = dadosParaValidar.briefingId || 'temp';

    // Validar dados fornecidos
    const validacao = validationService.validarDadosMinimos(dadosParaValidar, briefingId);

    // Se dados insuficientes, oferecer fallbacks
    let fallbacksDisponiveis = null;
    if (!validacao.valido) {
      const resultadoFallback = await fallbackService.aplicarFallbacks(
        dadosParaValidar,
        briefingId,
        { permitirEstimativas: true }
      );
      
      fallbacksDisponiveis = {
        dadosCorrigidos: resultadoFallback.dadosCorrigidos,
        fallbacksAplicados: resultadoFallback.fallbacksAplicados,
        avisos: resultadoFallback.avisos,
        recomendacoes: resultadoFallback.recomendacoes
      };
    }

    return res.json({
      success: true,
      data: {
        validacao: {
          valido: validacao.valido,
          erros: validacao.erros,
          avisos: validacao.avisos,
          dadosFaltantes: validacao.dadosFaltantes,
          sugestoesFallback: validacao.sugestoesFallback
        },
        fallbacks: fallbacksDisponiveis,
        solicitacaoDados: !validacao.valido ? 
          validationService.criarSolicitacaoDadosComplementares(validacao.dadosFaltantes, briefingId) : 
          null
      }
    });
  })
);

// Aplicar middleware de tratamento de erros
router.use(budgetErrorHandler);

// Funções auxiliares (simuladas)

async function buscarBriefing(briefingId: string, escritorioId: string) {
  // Simulação - em produção viria do banco de dados
  if (briefingId === 'inexistente') {
    return null;
  }

  return {
    id: briefingId,
    escritorioId,
    areaConstruida: briefingId === 'sem-area' ? null : 150,
    tipologia: briefingId === 'sem-tipologia' ? null : 'residencial',
    padrao: 'MEDIO',
    complexidade: null,
    disciplinasNecessarias: null,
    localizacao: 'São Paulo',
    prazoDesejado: null,
    status: 'CONCLUIDO'
  };
}

function extrairDadosDoBriefing(briefing: any) {
  return {
    areaConstruida: briefing?.areaConstruida,
    areaTerreno: briefing?.areaTerreno,
    tipologia: briefing?.tipologia,
    padrao: briefing?.padrao,
    complexidade: briefing?.complexidade,
    disciplinasNecessarias: briefing?.disciplinasNecessarias,
    localizacao: briefing?.localizacao,
    prazoDesejado: briefing?.prazoDesejado
  };
}

async function calcularOrcamento(dados: any, escritorioId: string) {
  // Simulação de cálculo - em produção usaria BudgetCalculationService
  const area = dados.areaConstruida || 150;
  const valorPorM2 = 200;
  const horasPorM2 = 1.5;

  return {
    valorTotal: area * valorPorM2,
    horasTotal: area * horasPorM2,
    valorPorM2,
    disciplinas: [
      {
        nome: 'Arquitetura',
        horas: area * 0.8,
        valor: area * 120,
        percentual: 60
      },
      {
        nome: 'Estrutural',
        horas: area * 0.5,
        valor: area * 60,
        percentual: 30
      },
      {
        nome: 'Instalações',
        horas: area * 0.2,
        valor: area * 20,
        percentual: 10
      }
    ],
    cronograma: {
      prazoTotal: dados.prazoDesejado || 90,
      fases: [
        { nome: 'Estudo Preliminar', prazo: 30, percentual: 33 },
        { nome: 'Anteprojeto', prazo: 30, percentual: 33 },
        { nome: 'Projeto Executivo', prazo: 30, percentual: 34 }
      ]
    }
  };
}

export default router;