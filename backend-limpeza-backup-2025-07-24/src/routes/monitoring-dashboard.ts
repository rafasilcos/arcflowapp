import express from 'express';
import { metricsCollectorService } from '../services/metricsCollectorService';
import { alertingService } from '../services/alertingService';
import { reportingService } from '../services/reportingService';
import { loggingService } from '../services/loggingService';

const router = express.Router();

// Middleware de autenticação (assumindo que já existe)
const requireAuth = (req: any, res: any, next: any) => {
  // Implementar verificação de autenticação
  if (!req.user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
};

// Middleware para verificar se é administrador
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado - apenas administradores' });
  }
  next();
};

// GET /api/monitoring/dashboard - Dashboard principal
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const timer = loggingService.criarTimerPerformance('DASHBOARD_MONITORING');
    
    const escritorioId = req.user.escritorioId;
    const diasAtras = parseInt(req.query.dias as string) || 7;
    
    // Obter dados do dashboard
    const [
      estatisticas,
      alertasAtivos,
      relatorioSaude
    ] = await Promise.all([
      metricsCollectorService.obterEstatisticasEscritorio(escritorioId, diasAtras),
      alertingService.obterAlertasAtivos(),
      metricsCollectorService.gerarRelatorioSaude()
    ]);
    
    const dashboard = {
      periodo: {
        dias: diasAtras,
        inicio: estatisticas.periodo.inicio,
        fim: estatisticas.periodo.fim
      },
      resumo: {
        totalOrcamentos: estatisticas.totalOrcamentos,
        orcamentosSucesso: estatisticas.orcamentosSucesso,
        orcamentosErro: estatisticas.orcamentosErro,
        taxaSucesso: estatisticas.totalOrcamentos > 0 ? 
          (estatisticas.orcamentosSucesso / estatisticas.totalOrcamentos) * 100 : 0,
        tempoMedioGeracao: estatisticas.tempoMedioGeracao,
        valorMedioOrcamento: estatisticas.valorMedioOrcamento
      },
      alertas: {
        total: alertasAtivos.length,
        criticos: alertasAtivos.filter(a => a.severidade === 'CRITICA').length,
        altos: alertasAtivos.filter(a => a.severidade === 'ALTA').length,
        recentes: alertasAtivos.slice(0, 5)
      },
      saude: relatorioSaude,
      tipologias: Object.entries(estatisticas.tipologiasMaisUsadas)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5)
    };
    
    timer.finalizar({ escritorioId, diasAtras });
    
    res.json(dashboard);
    
  } catch (error) {
    loggingService.logOrcamentoError('DASHBOARD_MONITORING', error as Error, { 
      userId: req.user?.id,
      escritorioId: req.user?.escritorioId 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/statistics/:escritorioId - Estatísticas detalhadas
router.get('/statistics/:escritorioId', requireAuth, async (req, res) => {
  try {
    const escritorioId = req.params.escritorioId;
    const diasAtras = parseInt(req.query.dias as string) || 30;
    
    // Verificar se usuário tem acesso ao escritório
    if (req.user.escritorioId !== escritorioId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const estatisticas = await metricsCollectorService.obterEstatisticasEscritorio(escritorioId, diasAtras);
    
    res.json(estatisticas);
    
  } catch (error) {
    loggingService.logOrcamentoError('STATISTICS_MONITORING', error as Error, { 
      escritorioId: req.params.escritorioId,
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/alerts - Alertas ativos
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const limite = parseInt(req.query.limite as string) || 50;
    const incluirResolvidos = req.query.incluirResolvidos === 'true';
    
    let alertas;
    if (incluirResolvidos) {
      alertas = alertingService.obterHistoricoAlertas(limite);
    } else {
      alertas = alertingService.obterAlertasAtivos();
    }
    
    res.json({
      total: alertas.length,
      alertas: alertas.slice(0, limite)
    });
    
  } catch (error) {
    loggingService.logOrcamentoError('ALERTS_MONITORING', error as Error, { 
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/monitoring/alerts/:alertaId/resolve - Resolver alerta
router.put('/alerts/:alertaId/resolve', requireAuth, async (req, res) => {
  try {
    const alertaId = req.params.alertaId;
    const userId = req.user.id;
    
    await alertingService.resolverAlerta(alertaId, userId);
    
    res.json({ success: true, message: 'Alerta resolvido com sucesso' });
    
  } catch (error) {
    loggingService.logOrcamentoError('RESOLVE_ALERT', error as Error, { 
      alertaId: req.params.alertaId,
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/performance - Métricas de performance
router.get('/performance', requireAdmin, async (req, res) => {
  try {
    const diasAtras = parseInt(req.query.dias as string) || 7;
    
    const metricas = await metricsCollectorService.obterMetricasPerformance(diasAtras);
    
    // Agrupar métricas por operação
    const metricasAgrupadas = metricas.reduce((acc, metrica) => {
      if (!acc[metrica.operacao]) {
        acc[metrica.operacao] = [];
      }
      acc[metrica.operacao].push(metrica);
      return acc;
    }, {} as { [operacao: string]: any[] });
    
    // Calcular estatísticas por operação
    const estatisticas = Object.entries(metricasAgrupadas).map(([operacao, dados]) => {
      const tempos = dados.map(d => d.tempoExecucao);
      const memoria = dados.map(d => d.memoriaUsada);
      
      return {
        operacao,
        total: dados.length,
        tempoMedio: tempos.reduce((a, b) => a + b, 0) / tempos.length,
        tempoMinimo: Math.min(...tempos),
        tempoMaximo: Math.max(...tempos),
        memoriaMedia: memoria.reduce((a, b) => a + b, 0) / memoria.length
      };
    });
    
    res.json({
      periodo: diasAtras,
      totalOperacoes: metricas.length,
      estatisticasPorOperacao: estatisticas,
      metricasDetalhadas: metricas.slice(0, 100) // Limitar para não sobrecarregar
    });
    
  } catch (error) {
    loggingService.logOrcamentoError('PERFORMANCE_MONITORING', error as Error, { 
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/reports/usage/:escritorioId - Relatório de uso
router.get('/reports/usage/:escritorioId', requireAuth, async (req, res) => {
  try {
    const escritorioId = req.params.escritorioId;
    const diasAtras = parseInt(req.query.dias as string) || 30;
    
    // Verificar acesso
    if (req.user.escritorioId !== escritorioId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const relatorio = await reportingService.gerarRelatorioUso(escritorioId, diasAtras);
    
    res.json(relatorio);
    
  } catch (error) {
    loggingService.logOrcamentoError('USAGE_REPORT', error as Error, { 
      escritorioId: req.params.escritorioId,
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/reports/system - Relatório do sistema (apenas admin)
router.get('/reports/system', requireAdmin, async (req, res) => {
  try {
    const diasAtras = parseInt(req.query.dias as string) || 7;
    
    const relatorio = await reportingService.gerarRelatorioSistema(diasAtras);
    
    res.json(relatorio);
    
  } catch (error) {
    loggingService.logOrcamentoError('SYSTEM_REPORT', error as Error, { 
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/reports/comparative - Relatório comparativo (apenas admin)
router.get('/reports/comparative', requireAdmin, async (req, res) => {
  try {
    const escritoriosIds = (req.query.escritorios as string)?.split(',') || [];
    const diasAtras = parseInt(req.query.dias as string) || 30;
    
    if (escritoriosIds.length === 0) {
      return res.status(400).json({ error: 'IDs de escritórios são obrigatórios' });
    }
    
    const relatorio = await reportingService.gerarRelatorioComparativo(escritoriosIds, diasAtras);
    
    res.json(relatorio);
    
  } catch (error) {
    loggingService.logOrcamentoError('COMPARATIVE_REPORT', error as Error, { 
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/reports/trends/:escritorioId - Relatório de tendências
router.get('/reports/trends/:escritorioId', requireAuth, async (req, res) => {
  try {
    const escritorioId = req.params.escritorioId;
    const mesesAtras = parseInt(req.query.meses as string) || 6;
    
    // Verificar acesso
    if (req.user.escritorioId !== escritorioId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const relatorio = await reportingService.gerarRelatorioTendencias(escritorioId, mesesAtras);
    
    res.json(relatorio);
    
  } catch (error) {
    loggingService.logOrcamentoError('TRENDS_REPORT', error as Error, { 
      escritorioId: req.params.escritorioId,
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/monitoring/health - Status de saúde do sistema
router.get('/health', async (req, res) => {
  try {
    const saude = await metricsCollectorService.gerarRelatorioSaude();
    
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy', // Implementar verificação real
        redis: saude?.redis?.conectado ? 'healthy' : 'unhealthy',
        queue: 'healthy' // Implementar verificação real
      },
      performance: saude?.performance || {},
      uptime: process.uptime()
    };
    
    res.json(status);
    
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Erro ao verificar saúde do sistema'
    });
  }
});

// POST /api/monitoring/test-alert - Testar sistema de alertas (apenas admin)
router.post('/test-alert', requireAdmin, async (req, res) => {
  try {
    const { tipo, severidade } = req.body;
    
    // Simular alerta de teste
    await alertingService.registrarFalhaSistema(
      'TESTE',
      new Error(`Alerta de teste - ${tipo}`),
      { usuario: req.user.id, timestamp: new Date() }
    );
    
    res.json({ success: true, message: 'Alerta de teste criado' });
    
  } catch (error) {
    loggingService.logOrcamentoError('TEST_ALERT', error as Error, { 
      userId: req.user?.id 
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;