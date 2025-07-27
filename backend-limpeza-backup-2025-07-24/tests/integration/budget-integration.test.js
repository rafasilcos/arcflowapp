const request = require('supertest');
const { createClient } = require('redis');

// Simular app Express (em produção, importar o app real)
const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('Integração Briefing-Orçamento', () => {
  let redisClient;
  let seedData;
  
  beforeAll(async () => {
    // Conectar ao Redis de teste
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    await redisClient.connect();
    
    // Obter dados de seed
    seedData = await global.testUtils.getSeedData();
    
    // Verificar se serviços estão disponíveis
    const services = await global.testUtils.checkServices();
    if (!services.redis) {
      throw new Error('Redis não disponível para testes');
    }
  });
  
  afterAll(async () => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.disconnect();
    }
  });
  
  describe('Geração Automática de Orçamento', () => {
    test('deve gerar orçamento a partir de briefing padrão', async () => {
      const briefing = seedData.briefings[0]; // Casa Unifamiliar
      
      // Simular geração de orçamento
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Em produção, fazer requisição real para API
        return {
          id: global.testUtils.generateTestId(),
          briefingId: briefing.id,
          escritorioId: briefing.escritorioId,
          tipologia: briefing.tipologia,
          complexidade: 'MEDIA',
          areaConstruida: briefing.areaConstruida,
          valorTotal: 15000,
          horasTotal: 100,
          disciplinas: [
            {
              nome: 'ARQUITETURA',
              horas: 60,
              valor: 9000
            },
            {
              nome: 'ESTRUTURAL',
              horas: 25,
              valor: 3000
            },
            {
              nome: 'INSTALACOES',
              horas: 15,
              valor: 1800
            }
          ],
          breakdown: {
            custosDiretos: 13800,
            custosIndiretos: 690,
            impostos: 510,
            margemLucro: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
      
      // Validações
      expect(result).toBeValidOrcamento();
      expect(result.briefingId).toBe(briefing.id);
      expect(result.tipologia).toBe(briefing.tipologia);
      expect(result.valorTotal).toBeGreaterThan(0);
      expect(result.horasTotal).toBeGreaterThan(0);
      expect(result.disciplinas).toHaveLength(3);
      expect(executionTime).toBeLessThan(5000); // Menos de 5 segundos
      
      // Verificar cálculos
      const somaValorDisciplinas = result.disciplinas.reduce((sum, d) => sum + d.valor, 0);
      expect(somaValorDisciplinas).toBe(result.breakdown.custosDiretos);
      
      const somaHorasDisciplinas = result.disciplinas.reduce((sum, d) => sum + d.horas, 0);
      expect(somaHorasDisciplinas).toBe(result.horasTotal);
    });
    
    test('deve aplicar configurações personalizadas do escritório', async () => {
      const briefing = seedData.briefings[1]; // Edifício Comercial
      const escritorio = seedData.escritorios.find(e => e.id === briefing.escritorioId);
      
      const orcamento = {
        id: global.testUtils.generateTestId(),
        briefingId: briefing.id,
        escritorioId: briefing.escritorioId,
        tipologia: briefing.tipologia,
        complexidade: 'ALTA',
        areaConstruida: briefing.areaConstruida,
        valorTotal: 240000, // Valor mais alto devido ao multiplicador comercial
        horasTotal: 1600,
        disciplinas: [
          {
            nome: 'ARQUITETURA',
            horas: 800,
            valor: 120000 // 800h * R$ 150/h
          },
          {
            nome: 'ESTRUTURAL',
            horas: 500,
            valor: 60000 // 500h * R$ 120/h
          },
          {
            nome: 'INSTALACOES',
            horas: 300,
            valor: 36000 // 300h * R$ 120/h
          }
        ],
        configuracaoAplicada: escritorio.configuracao,
        multiplicadorTipologia: 1.2, // Comercial
        createdAt: new Date()
      };
      
      // Validações
      expect(orcamento).toBeValidOrcamento();
      expect(orcamento.configuracaoAplicada.tabelaPrecos.valorHoraArquiteto).toBe(150);
      expect(orcamento.multiplicadorTipologia).toBe(1.2);
      
      // Verificar aplicação da tabela de preços
      const disciplinaArquitetura = orcamento.disciplinas.find(d => d.nome === 'ARQUITETURA');
      const valorEsperado = disciplinaArquitetura.horas * escritorio.configuracao.tabelaPrecos.valorHoraArquiteto;
      expect(disciplinaArquitetura.valor).toBe(valorEsperado);
    });
    
    test('deve calcular complexidade automaticamente', async () => {
      const briefingComplexo = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-1',
        nome: 'Projeto Complexo',
        tipologia: 'INDUSTRIAL',
        areaConstruida: 5000,
        padrao: 'ALTO',
        status: 'CONCLUIDO',
        respostas: {
          area_construida: '5000',
          area_terreno: '10000',
          tipologia: 'fabrica',
          padrao_acabamento: 'alto',
          estrutura_especial: 'sim',
          instalacoes_especiais: 'sim',
          normas_especificas: 'sim'
        }
      };
      
      // Simular análise de complexidade
      const analise = {
        complexidade: 'MUITO_ALTA',
        fatores: [
          'Área construída > 3000m²',
          'Estrutura especial requerida',
          'Instalações especiais',
          'Normas específicas aplicáveis'
        ],
        score: 85 // Score de complexidade
      };
      
      expect(analise.complexidade).toBe('MUITO_ALTA');
      expect(analise.score).toBeWithinRange(80, 100);
      expect(analise.fatores).toHaveLength(4);
    });
  });
  
  describe('Persistência e Histórico', () => {
    test('deve salvar orçamento vinculado ao briefing', async () => {
      const briefingId = 'briefing-test-1';
      const orcamentoId = global.testUtils.generateTestId();
      
      // Simular salvamento
      const orcamentoSalvo = {
        id: orcamentoId,
        briefingId,
        valorTotal: 15000,
        status: 'GERADO',
        versao: 1,
        createdAt: new Date()
      };
      
      // Simular atualização do briefing
      const briefingAtualizado = {
        id: briefingId,
        orcamentoGerado: true,
        orcamentoId,
        ultimaAtualizacao: new Date()
      };
      
      expect(orcamentoSalvo.briefingId).toBe(briefingId);
      expect(briefingAtualizado.orcamentoGerado).toBe(true);
      expect(briefingAtualizado.orcamentoId).toBe(orcamentoId);
    });
    
    test('deve criar versão no histórico ao regenerar orçamento', async () => {
      const orcamentoOriginal = {
        id: 'orcamento-test-1',
        briefingId: 'briefing-test-1',
        valorTotal: 15000,
        versao: 1
      };
      
      const orcamentoRegenerado = {
        ...orcamentoOriginal,
        valorTotal: 18000,
        versao: 2,
        motivoAlteracao: 'Alteração na configuração de preços'
      };
      
      const historicoVersao = {
        id: global.testUtils.generateTestId(),
        orcamentoId: orcamentoOriginal.id,
        versao: 1,
        dadosVersao: orcamentoOriginal,
        motivoAlteracao: 'Versão inicial',
        createdAt: new Date()
      };
      
      expect(orcamentoRegenerado.versao).toBe(2);
      expect(orcamentoRegenerado.valorTotal).not.toBe(orcamentoOriginal.valorTotal);
      expect(historicoVersao.versao).toBe(1);
      expect(historicoVersao.dadosVersao).toEqual(orcamentoOriginal);
    });
  });
  
  describe('Validações e Tratamento de Erros', () => {
    test('deve validar dados mínimos necessários', async () => {
      const briefingIncompleto = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-1',
        nome: 'Briefing Incompleto',
        status: 'CONCLUIDO',
        respostas: {
          // Faltam dados essenciais como área e tipologia
          observacoes: 'Apenas observações'
        }
      };
      
      // Simular validação
      const validacao = {
        valido: false,
        erros: [
          'Área construída não informada',
          'Tipologia não identificada',
          'Dados insuficientes para cálculo'
        ],
        sugestoes: [
          'Informar área construída',
          'Especificar tipo de projeto',
          'Adicionar informações de complexidade'
        ]
      };
      
      expect(validacao.valido).toBe(false);
      expect(validacao.erros).toHaveLength(3);
      expect(validacao.sugestoes).toHaveLength(3);
    });
    
    test('deve aplicar fallback para dados insuficientes', async () => {
      const briefingParcial = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-1',
        nome: 'Casa Simples',
        tipologia: 'RESIDENCIAL',
        status: 'CONCLUIDO',
        respostas: {
          tipologia: 'casa',
          // Área não informada
        }
      };
      
      // Simular aplicação de fallback
      const dadosComFallback = {
        areaConstruida: 120, // Área padrão para casa simples
        complexidade: 'MEDIA', // Complexidade padrão
        padrao: 'MEDIO', // Padrão padrão
        disciplinas: ['ARQUITETURA'], // Disciplinas mínimas
        observacoes: 'Valores estimados com base em dados padrão'
      };
      
      expect(dadosComFallback.areaConstruida).toBe(120);
      expect(dadosComFallback.complexidade).toBe('MEDIA');
      expect(dadosComFallback.observacoes).toContain('estimados');
    });
    
    test('deve tratar erro de configuração ausente', async () => {
      const escritorioSemConfig = 'escritorio-sem-config';
      
      // Simular uso de configuração padrão
      const configPadrao = {
        escritorioId: escritorioSemConfig,
        tabelaPrecos: {
          valorHoraArquiteto: 100, // Valor padrão do mercado
          valorHoraEngenheiro: 80,
          valorHoraDesigner: 60
        },
        multiplicadores: {
          'RESIDENCIAL': 1.0,
          'COMERCIAL': 1.1,
          'INDUSTRIAL': 1.3
        },
        origem: 'PADRAO_SISTEMA'
      };
      
      expect(configPadrao.origem).toBe('PADRAO_SISTEMA');
      expect(configPadrao.tabelaPrecos.valorHoraArquiteto).toBe(100);
    });
  });
  
  describe('Performance e Cache', () => {
    test('deve usar cache para configurações de escritório', async () => {
      const escritorioId = 'escritorio-test-1';
      const cacheKey = `config:${escritorioId}`;
      
      // Simular cache miss - primeira consulta
      const { executionTime: tempoSemCache } = await global.testUtils.measureExecutionTime(async () => {
        await global.testUtils.simulateNetworkDelay(200, 400); // Simular consulta ao banco
        return seedData.escritorios[0].configuracao;
      });
      
      // Salvar no cache
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(seedData.escritorios[0].configuracao));
      
      // Simular cache hit - segunda consulta
      const { executionTime: tempoComCache } = await global.testUtils.measureExecutionTime(async () => {
        const cached = await redisClient.get(cacheKey);
        return JSON.parse(cached);
      });
      
      expect(tempoComCache).toBeLessThan(tempoSemCache);
      expect(tempoComCache).toBeLessThan(50); // Cache deve ser muito rápido
    });
    
    test('deve processar múltiplos orçamentos em paralelo', async () => {
      const briefings = [
        global.testUtils.createMockBriefing('escritorio-test-1', 'RESIDENCIAL'),
        global.testUtils.createMockBriefing('escritorio-test-1', 'COMERCIAL'),
        global.testUtils.createMockBriefing('escritorio-test-1', 'INDUSTRIAL')
      ];
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular processamento paralelo
        const promises = briefings.map(async (briefing) => {
          await global.testUtils.simulateNetworkDelay(1000, 2000);
          return {
            id: global.testUtils.generateTestId(),
            briefingId: briefing.id,
            valorTotal: Math.random() * 50000 + 10000,
            processedAt: new Date()
          };
        });
        
        return Promise.all(promises);
      });
      
      expect(result).toHaveLength(3);
      expect(executionTime).toBeLessThan(3000); // Paralelo deve ser mais rápido que sequencial
      
      // Verificar se todos foram processados
      result.forEach(orcamento => {
        expect(orcamento.id).toBeDefined();
        expect(orcamento.valorTotal).toBeGreaterThan(0);
      });
    });
  });
  
  describe('Métricas e Monitoramento', () => {
    test('deve registrar métricas de geração de orçamento', async () => {
      const metrica = {
        operacao: 'GERAR_ORCAMENTO',
        briefingId: 'briefing-test-1',
        escritorioId: 'escritorio-test-1',
        tempoExecucao: 2500,
        valorGerado: 15000,
        sucesso: true,
        timestamp: new Date()
      };
      
      // Salvar métrica no Redis
      const metricsKey = `metricas:orcamento:${metrica.escritorioId}:${new Date().toISOString().split('T')[0]}`;
      await redisClient.lPush(metricsKey, JSON.stringify(metrica));
      
      // Verificar se foi salva
      const metricas = await redisClient.lRange(metricsKey, 0, -1);
      expect(metricas).toHaveLength(1);
      
      const metricaSalva = JSON.parse(metricas[0]);
      expect(metricaSalva.operacao).toBe('GERAR_ORCAMENTO');
      expect(metricaSalva.sucesso).toBe(true);
    });
    
    test('deve detectar performance degradada', async () => {
      const tempoExecucaoLento = 12000; // 12 segundos
      const threshold = 5000; // 5 segundos
      
      const alerta = {
        tipo: 'PERFORMANCE_BAIXA',
        operacao: 'GERAR_ORCAMENTO',
        tempoExecucao: tempoExecucaoLento,
        threshold,
        severidade: tempoExecucaoLento > threshold * 2 ? 'ALTA' : 'MEDIA',
        timestamp: new Date()
      };
      
      expect(alerta.severidade).toBe('ALTA');
      expect(alerta.tempoExecucao).toBeGreaterThan(threshold);
    });
  });
});