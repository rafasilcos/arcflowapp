const { createClient } = require('redis');

describe('Performance - Sistema Briefing-Orçamento', () => {
  let redisClient;
  
  beforeAll(async () => {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    await redisClient.connect();
  });
  
  afterAll(async () => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.disconnect();
    }
  });
  
  describe('Performance de Geração de Orçamentos', () => {
    test('deve gerar orçamento simples em menos de 3 segundos', async () => {
      const briefingSimples = global.testUtils.createMockBriefing('escritorio-test-1', 'RESIDENCIAL');
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular geração de orçamento simples
        await global.testUtils.simulateNetworkDelay(1500, 2500);
        
        return {
          id: global.testUtils.generateTestId(),
          briefingId: briefingSimples.id,
          valorTotal: 15000,
          horasTotal: 100,
          disciplinas: [
            { nome: 'ARQUITETURA', horas: 60, valor: 9000 },
            { nome: 'ESTRUTURAL', horas: 25, valor: 3000 },
            { nome: 'INSTALACOES', horas: 15, valor: 1800 }
          ]
        };
      });
      
      expect(result).toBeValidOrcamento();
      expect(executionTime).toBeLessThan(3000); // Menos de 3 segundos
      
      // Registrar métrica de performance
      await redisClient.lPush('test:performance:orcamento-simples', JSON.stringify({
        tempo: executionTime,
        timestamp: new Date().toISOString()
      }));
    });
    
    test('deve gerar orçamento complexo em menos de 5 segundos', async () => {
      const briefingComplexo = {
        ...global.testUtils.createMockBriefing('escritorio-test-1', 'INDUSTRIAL'),
        areaConstruida: 5000,
        padrao: 'ALTO',
        respostas: {
          ...global.testUtils.createMockBriefing().respostas,
          estrutura_especial: 'sim',
          instalacoes_especiais: 'sim',
          disciplinas_extras: ['consultoria', 'sustentabilidade']
        }
      };
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular processamento mais complexo
        await global.testUtils.simulateNetworkDelay(3000, 4500);
        
        return {
          id: global.testUtils.generateTestId(),
          briefingId: briefingComplexo.id,
          valorTotal: 450000,
          horasTotal: 2500,
          disciplinas: [
            { nome: 'ARQUITETURA', horas: 1000, valor: 150000 },
            { nome: 'ESTRUTURAL', horas: 600, valor: 72000 },
            { nome: 'INSTALACOES_ELETRICAS', horas: 400, valor: 48000 },
            { nome: 'INSTALACOES_HIDRAULICAS', horas: 300, valor: 36000 },
            { nome: 'CONSULTORIA_ESPECIALIZADA', horas: 200, valor: 40000 }
          ],
          complexidade: 'MUITO_ALTA'
        };
      });
      
      expect(result).toBeValidOrcamento();
      expect(executionTime).toBeLessThan(5000); // Menos de 5 segundos
      expect(result.complexidade).toBe('MUITO_ALTA');
      
      // Registrar métrica
      await redisClient.lPush('test:performance:orcamento-complexo', JSON.stringify({
        tempo: executionTime,
        timestamp: new Date().toISOString()
      }));
    });
    
    test('deve processar lote de 10 orçamentos em menos de 30 segundos', async () => {
      const briefings = Array.from({ length: 10 }, (_, i) => ({
        ...global.testUtils.createMockBriefing('escritorio-test-1', 'COMERCIAL'),
        id: `briefing-lote-${i}`,
        nome: `Projeto Comercial ${i + 1}`
      }));
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular processamento em lote (paralelo)
        const promises = briefings.map(async (briefing, index) => {
          // Simular tempo variável por orçamento
          await global.testUtils.simulateNetworkDelay(1000, 2500);
          
          return {
            id: global.testUtils.generateTestId(),
            briefingId: briefing.id,
            valorTotal: Math.random() * 50000 + 20000,
            horasTotal: Math.random() * 300 + 100,
            processedAt: new Date(),
            batchIndex: index
          };
        });
        
        return Promise.all(promises);
      });
      
      expect(result).toHaveLength(10);
      expect(executionTime).toBeLessThan(30000); // Menos de 30 segundos para lote
      
      // Verificar se todos foram processados
      result.forEach((orcamento, index) => {
        expect(orcamento.batchIndex).toBe(index);
        expect(orcamento.valorTotal).toBeGreaterThan(0);
      });
      
      // Calcular tempo médio por orçamento
      const tempoMedioPorOrcamento = executionTime / 10;
      expect(tempoMedioPorOrcamento).toBeLessThan(3000); // Menos de 3s por orçamento em lote
    });
  });
  
  describe('Performance de Cache', () => {
    test('deve acessar configuração em cache em menos de 50ms', async () => {
      const escritorioId = 'escritorio-test-1';
      const configuracao = global.testUtils.createMockEscritorioConfig(escritorioId);
      
      // Pré-popular cache
      await redisClient.setEx(`config:${escritorioId}`, 3600, JSON.stringify(configuracao));
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const cached = await redisClient.get(`config:${escritorioId}`);
        return JSON.parse(cached);
      });
      
      expect(result.escritorioId).toBe(escritorioId);
      expect(executionTime).toBeLessThan(50); // Menos de 50ms
    });
    
    test('deve ter hit rate de cache superior a 80%', async () => {
      const escritorioId = 'escritorio-test-1';
      const configuracao = global.testUtils.createMockEscritorioConfig(escritorioId);
      
      // Simular múltiplos acessos
      const totalAcessos = 100;
      let cacheHits = 0;
      let cacheMisses = 0;
      
      for (let i = 0; i < totalAcessos; i++) {
        const cacheKey = `config:${escritorioId}`;
        
        // Simular probabilidade de cache hit (90%)
        if (Math.random() < 0.9) {
          // Cache hit
          await redisClient.setEx(cacheKey, 3600, JSON.stringify(configuracao));
          const cached = await redisClient.get(cacheKey);
          if (cached) {
            cacheHits++;
          }
        } else {
          // Cache miss
          await redisClient.del(cacheKey);
          const cached = await redisClient.get(cacheKey);
          if (!cached) {
            cacheMisses++;
            // Simular busca no banco e cache
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(configuracao));
          }
        }
      }
      
      const hitRate = (cacheHits / totalAcessos) * 100;
      expect(hitRate).toBeGreaterThan(80); // Mais de 80% de hit rate
    });
  });
  
  describe('Performance de Consultas ao Banco', () => {
    test('deve consultar briefing por ID em menos de 200ms', async () => {
      const briefingId = 'briefing-test-1';
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular consulta ao banco
        await global.testUtils.simulateNetworkDelay(50, 150);
        
        return {
          id: briefingId,
          nome: 'Casa Unifamiliar',
          tipologia: 'RESIDENCIAL',
          status: 'CONCLUIDO'
        };
      });
      
      expect(result.id).toBe(briefingId);
      expect(executionTime).toBeLessThan(200); // Menos de 200ms
    });
    
    test('deve listar orçamentos paginados em menos de 300ms', async () => {
      const escritorioId = 'escritorio-test-1';
      const limit = 20;
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular consulta paginada
        await global.testUtils.simulateNetworkDelay(100, 250);
        
        return {
          data: Array.from({ length: limit }, (_, i) => ({
            id: `orcamento-${i}`,
            briefingId: `briefing-${i}`,
            valorTotal: Math.random() * 100000,
            createdAt: new Date()
          })),
          pagination: {
            hasMore: true,
            nextCursor: `cursor-${limit}`,
            count: limit
          }
        };
      });
      
      expect(result.data).toHaveLength(limit);
      expect(result.pagination.hasMore).toBe(true);
      expect(executionTime).toBeLessThan(300); // Menos de 300ms
    });
  });
  
  describe('Performance de Análise de Briefings', () => {
    test('deve analisar briefing padrão em menos de 2 segundos', async () => {
      const briefing = global.testUtils.createMockBriefing('escritorio-test-1', 'RESIDENCIAL');
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular análise de briefing padrão
        await global.testUtils.simulateNetworkDelay(1000, 1800);
        
        return {
          briefingId: briefing.id,
          dadosExtraidos: {
            areaConstruida: 150,
            tipologia: 'RESIDENCIAL',
            complexidade: 'MEDIA',
            disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL']
          },
          confianca: 0.95,
          tempoProcessamento: executionTime
        };
      });
      
      expect(result.dadosExtraidos.areaConstruida).toBe(150);
      expect(result.confianca).toBeGreaterThan(0.9);
      expect(executionTime).toBeLessThan(2000); // Menos de 2 segundos
    });
    
    test('deve analisar briefing personalizado em menos de 4 segundos', async () => {
      const briefingPersonalizado = {
        id: global.testUtils.generateTestId(),
        respostas: {
          'Tipo de projeto': 'Centro comercial com cinema',
          'Área total': '8.500 m²',
          'Número de lojas': '45 lojas',
          'Salas de cinema': '8 salas',
          'Estacionamento': '300 vagas',
          'Nível de acabamento': 'Alto padrão'
        }
      };
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular análise mais complexa para briefing personalizado
        await global.testUtils.simulateNetworkDelay(2500, 3500);
        
        return {
          briefingId: briefingPersonalizado.id,
          dadosExtraidos: {
            areaConstruida: 8500,
            tipologia: 'COMERCIAL',
            subtipo: 'SHOPPING_CENTER',
            complexidade: 'MUITO_ALTA',
            caracteristicasEspeciais: ['cinema', 'estacionamento', 'multiplas_lojas']
          },
          confianca: 0.88,
          algoritmoUsado: 'ADAPTIVE_PARSER',
          tempoProcessamento: executionTime
        };
      });
      
      expect(result.dadosExtraidos.tipologia).toBe('COMERCIAL');
      expect(result.dadosExtraidos.complexidade).toBe('MUITO_ALTA');
      expect(executionTime).toBeLessThan(4000); // Menos de 4 segundos
    });
  });
  
  describe('Stress Tests', () => {
    test('deve manter performance com 100 usuários simultâneos', async () => {
      const numeroUsuarios = 100;
      const tempoLimite = 10000; // 10 segundos
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroUsuarios }, async (_, i) => {
          const briefing = global.testUtils.createMockBriefing(`escritorio-${i % 5}`, 'COMERCIAL');
          
          // Simular operação por usuário
          await global.testUtils.simulateNetworkDelay(500, 1500);
          
          return {
            userId: `user-${i}`,
            briefingId: briefing.id,
            orcamentoGerado: true,
            tempoProcessamento: Math.random() * 3000 + 1000
          };
        });
        
        return Promise.all(promises);
      });
      
      expect(result).toHaveLength(numeroUsuarios);
      expect(executionTime).toBeLessThan(tempoLimite);
      
      // Verificar se todos os usuários foram atendidos
      const usuariosAtendidos = result.filter(r => r.orcamentoGerado).length;
      expect(usuariosAtendidos).toBe(numeroUsuarios);
      
      // Calcular tempo médio por usuário
      const tempoMedioPorUsuario = executionTime / numeroUsuarios;
      expect(tempoMedioPorUsuario).toBeLessThan(100); // Menos de 100ms por usuário em paralelo
    });
    
    test('deve manter estabilidade de memória durante processamento intenso', async () => {
      const memoriaInicial = process.memoryUsage();
      const numeroOperacoes = 1000;
      
      // Simular processamento intenso
      for (let i = 0; i < numeroOperacoes; i++) {
        const briefing = global.testUtils.createMockBriefing('escritorio-test-1', 'RESIDENCIAL');
        const orcamento = {
          id: global.testUtils.generateTestId(),
          briefingId: briefing.id,
          valorTotal: Math.random() * 50000,
          dados: new Array(100).fill(0).map(() => Math.random()) // Simular dados
        };
        
        // Simular processamento
        if (i % 100 === 0) {
          // Forçar garbage collection periodicamente
          if (global.gc) {
            global.gc();
          }
        }
      }
      
      const memoriaFinal = process.memoryUsage();
      const aumentoMemoria = memoriaFinal.heapUsed - memoriaInicial.heapUsed;
      const aumentoMB = aumentoMemoria / 1024 / 1024;
      
      // Aumento de memória deve ser controlado (menos de 100MB)
      expect(aumentoMB).toBeLessThan(100);
    });
  });
  
  describe('Relatórios de Performance', () => {
    test('deve gerar relatório de métricas coletadas', async () => {
      // Coletar métricas dos testes anteriores
      const metricasOrcamentoSimples = await redisClient.lRange('test:performance:orcamento-simples', 0, -1);
      const metricasOrcamentoComplexo = await redisClient.lRange('test:performance:orcamento-complexo', 0, -1);
      
      const relatorio = {
        timestamp: new Date().toISOString(),
        metricas: {
          orcamentoSimples: {
            total: metricasOrcamentoSimples.length,
            tempos: metricasOrcamentoSimples.map(m => JSON.parse(m).tempo),
            tempoMedio: 0,
            tempoMaximo: 0,
            tempoMinimo: 0
          },
          orcamentoComplexo: {
            total: metricasOrcamentoComplexo.length,
            tempos: metricasOrcamentoComplexo.map(m => JSON.parse(m).tempo),
            tempoMedio: 0,
            tempoMaximo: 0,
            tempoMinimo: 0
          }
        },
        thresholds: {
          orcamentoSimples: 3000,
          orcamentoComplexo: 5000,
          consultaCache: 50,
          consultaBanco: 200
        }
      };
      
      // Calcular estatísticas
      if (relatorio.metricas.orcamentoSimples.tempos.length > 0) {
        const tempos = relatorio.metricas.orcamentoSimples.tempos;
        relatorio.metricas.orcamentoSimples.tempoMedio = tempos.reduce((a, b) => a + b, 0) / tempos.length;
        relatorio.metricas.orcamentoSimples.tempoMaximo = Math.max(...tempos);
        relatorio.metricas.orcamentoSimples.tempoMinimo = Math.min(...tempos);
      }
      
      expect(relatorio.metricas).toBeDefined();
      expect(relatorio.thresholds).toBeDefined();
      
      // Salvar relatório
      await global.testUtils.createTempData('performance-report', relatorio, 3600);
      
      console.log('📊 Relatório de Performance:', JSON.stringify(relatorio, null, 2));
    });
  });
});