const { createClient } = require('redis');

describe('Testes de Concorrência - Sistema Briefing-Orçamento', () => {
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
  
  describe('Concorrência na Geração de Orçamentos', () => {
    test('deve processar múltiplos orçamentos simultaneamente sem conflitos', async () => {
      const numeroOrcamentos = 20;
      const escritorioId = 'escritorio-test-1';
      
      // Criar briefings para teste
      const briefings = Array.from({ length: numeroOrcamentos }, (_, i) => ({
        ...global.testUtils.createMockBriefing(escritorioId, 'COMERCIAL'),
        id: `briefing-concurrent-${i}`,
        nome: `Projeto Concorrente ${i + 1}`
      }));
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Processar todos simultaneamente
        const promises = briefings.map(async (briefing, index) => {
          // Simular tempo de processamento variável
          const tempoProcessamento = Math.random() * 2000 + 1000;
          await global.testUtils.sleep(tempoProcessamento);
          
          return {
            id: global.testUtils.generateTestId(),
            briefingId: briefing.id,
            escritorioId: briefing.escritorioId,
            valorTotal: Math.random() * 100000 + 10000,
            horasTotal: Math.random() * 500 + 50,
            processedAt: new Date(),
            processIndex: index,
            tempoProcessamento
          };
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      expect(result).toHaveLength(numeroOrcamentos);
      expect(executionTime).toBeLessThan(5000); // Processamento paralelo deve ser rápido
      
      // Verificar se todos foram processados corretamente
      result.forEach((orcamento, index) => {
        expect(orcamento.processIndex).toBe(index);
        expect(orcamento.briefingId).toBe(`briefing-concurrent-${index}`);
        expect(orcamento.valorTotal).toBeGreaterThan(0);
      });
      
      // Verificar se não houve duplicatas
      const ids = result.map(o => o.id);
      const idsUnicos = [...new Set(ids)];
      expect(idsUnicos).toHaveLength(numeroOrcamentos);
    });
    
    test('deve manter consistência de dados com acessos simultâneos', async () => {
      const escritorioId = 'escritorio-test-1';
      const configuracao = global.testUtils.createMockEscritorioConfig(escritorioId);
      const numeroAcessos = 50;
      
      // Salvar configuração inicial
      await redisClient.set(`config:${escritorioId}`, JSON.stringify(configuracao));
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        // Múltiplos acessos simultâneos à mesma configuração
        const promises = Array.from({ length: numeroAcessos }, async (_, i) => {
          const configKey = `config:${escritorioId}`;
          
          // Simular leitura
          const configStr = await redisClient.get(configKey);
          const config = JSON.parse(configStr);
          
          // Simular processamento
          await global.testUtils.sleep(Math.random() * 100);
          
          return {
            accessIndex: i,
            configId: config.id,
            valorHoraArquiteto: config.tabelaPrecos.valorHoraArquiteto,
            timestamp: new Date()
          };
        });
        
        return Promise.all(promises);
      });
      
      // Verificar consistência
      expect(result).toHaveLength(numeroAcessos);
      
      // Todos devem ter lido a mesma configuração
      const valoresUnicos = [...new Set(result.map(r => r.valorHoraArquiteto))];
      expect(valoresUnicos).toHaveLength(1);
      expect(valoresUnicos[0]).toBe(configuracao.tabelaPrecos.valorHoraArquiteto);
    });
    
    test('deve gerenciar fila de processamento com múltiplos workers', async () => {
      const numeroJobs = 30;
      const numeroWorkers = 5;
      
      // Simular fila de jobs
      const jobs = Array.from({ length: numeroJobs }, (_, i) => ({
        id: `job-${i}`,
        briefingId: `briefing-${i}`,
        tipo: 'GERAR_ORCAMENTO',
        prioridade: Math.floor(Math.random() * 3) + 1, // 1-3
        createdAt: new Date()
      }));
      
      // Adicionar jobs à fila
      for (const job of jobs) {
        await redisClient.lPush('queue:orcamentos', JSON.stringify(job));
      }
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular múltiplos workers processando a fila
        const workers = Array.from({ length: numeroWorkers }, async (_, workerId) => {
          const jobsProcessados = [];
          
          while (true) {
            // Tentar pegar job da fila
            const jobStr = await redisClient.rPop('queue:orcamentos');
            if (!jobStr) break; // Fila vazia
            
            const job = JSON.parse(jobStr);
            
            // Simular processamento
            await global.testUtils.sleep(Math.random() * 500 + 200);
            
            jobsProcessados.push({
              ...job,
              workerId,
              processedAt: new Date(),
              status: 'COMPLETED'
            });
          }
          
          return jobsProcessados;
        });
        
        const resultadosWorkers = await Promise.all(workers);
        return resultadosWorkers.flat();
      });
      
      // Validações
      expect(result).toHaveLength(numeroJobs);
      
      // Verificar se todos os jobs foram processados
      const jobsProcessados = result.map(r => r.id).sort();
      const jobsOriginais = jobs.map(j => j.id).sort();
      expect(jobsProcessados).toEqual(jobsOriginais);
      
      // Verificar distribuição entre workers
      const jobsPorWorker = {};
      result.forEach(job => {
        jobsPorWorker[job.workerId] = (jobsPorWorker[job.workerId] || 0) + 1;
      });
      
      // Cada worker deve ter processado pelo menos um job
      expect(Object.keys(jobsPorWorker)).toHaveLength(numeroWorkers);
      
      // Fila deve estar vazia
      const filaRestante = await redisClient.lLen('queue:orcamentos');
      expect(filaRestante).toBe(0);
    });
  });
  
  describe('Concorrência em Cache', () => {
    test('deve evitar cache stampede com múltiplos acessos simultâneos', async () => {
      const chaveCache = 'config:escritorio-stampede-test';
      const numeroAcessos = 100;
      
      // Limpar cache
      await redisClient.del(chaveCache);
      
      let contadorBuscarBanco = 0;
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroAcessos }, async (_, i) => {
          // Tentar obter do cache
          let config = await redisClient.get(chaveCache);
          
          if (!config) {
            // Simular lock para evitar stampede
            const lockKey = `${chaveCache}:lock`;
            const lockAcquired = await redisClient.setNX(lockKey, '1');
            
            if (lockAcquired) {
              try {
                // Verificar novamente se não foi criado por outro processo
                config = await redisClient.get(chaveCache);
                
                if (!config) {
                  // Simular busca no banco
                  contadorBuscarBanco++;
                  await global.testUtils.sleep(500); // Simular latência do banco
                  
                  const novaConfig = {
                    id: 'config-test',
                    valorHora: 150,
                    createdAt: new Date()
                  };
                  
                  config = JSON.stringify(novaConfig);
                  await redisClient.setEx(chaveCache, 300, config);
                }
              } finally {
                // Liberar lock
                await redisClient.del(lockKey);
              }
            } else {
              // Aguardar um pouco e tentar novamente
              await global.testUtils.sleep(100);
              config = await redisClient.get(chaveCache);
            }
          }
          
          return {
            accessIndex: i,
            config: JSON.parse(config || '{}'),
            timestamp: new Date()
          };
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      expect(result).toHaveLength(numeroAcessos);
      
      // Deve ter buscado no banco apenas uma vez (evitou stampede)
      expect(contadorBuscarBanco).toBe(1);
      
      // Todos devem ter recebido a mesma configuração
      const configsUnicas = [...new Set(result.map(r => r.config.id))];
      expect(configsUnicas).toHaveLength(1);
      expect(configsUnicas[0]).toBe('config-test');
    });
    
    test('deve manter performance com alta concorrência de leitura', async () => {
      const numeroLeituras = 1000;
      const dadosCache = {
        configuracoes: Array.from({ length: 100 }, (_, i) => ({
          id: `config-${i}`,
          valor: Math.random() * 1000
        }))
      };
      
      // Pré-popular cache
      await redisClient.set('cache:performance-test', JSON.stringify(dadosCache));
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroLeituras }, async (_, i) => {
          const inicio = Date.now();
          const dados = await redisClient.get('cache:performance-test');
          const tempoLeitura = Date.now() - inicio;
          
          return {
            readIndex: i,
            tempoLeitura,
            dadosRecebidos: dados ? JSON.parse(dados).configuracoes.length : 0
          };
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      expect(result).toHaveLength(numeroLeituras);
      
      // Tempo total deve ser razoável para alta concorrência
      expect(executionTime).toBeLessThan(5000); // Menos de 5 segundos
      
      // Tempo médio por leitura deve ser baixo
      const tempoMedioLeitura = result.reduce((sum, r) => sum + r.tempoLeitura, 0) / numeroLeituras;
      expect(tempoMedioLeitura).toBeLessThan(50); // Menos de 50ms por leitura
      
      // Todos devem ter recebido os dados
      result.forEach(r => {
        expect(r.dadosRecebidos).toBe(100);
      });
    });
  });
  
  describe('Concorrência em Operações de Escrita', () => {
    test('deve manter consistência em atualizações simultâneas de configuração', async () => {
      const escritorioId = 'escritorio-concurrent-update';
      const numeroAtualizacoes = 20;
      
      // Configuração inicial
      const configInicial = {
        id: global.testUtils.generateTestId(),
        escritorioId,
        valorHoraArquiteto: 100,
        versao: 1
      };
      
      await redisClient.set(`config:${escritorioId}`, JSON.stringify(configInicial));
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroAtualizacoes }, async (_, i) => {
          // Simular operação de update com lock otimista
          const lockKey = `config:${escritorioId}:lock`;
          const lockValue = `update-${i}-${Date.now()}`;
          
          // Tentar adquirir lock
          const lockAcquired = await redisClient.setNX(lockKey, lockValue);
          
          if (lockAcquired) {
            try {
              // Ler configuração atual
              const configStr = await redisClient.get(`config:${escritorioId}`);
              const config = JSON.parse(configStr);
              
              // Simular processamento
              await global.testUtils.sleep(Math.random() * 100);
              
              // Atualizar configuração
              const novaConfig = {
                ...config,
                valorHoraArquiteto: config.valorHoraArquiteto + 10,
                versao: config.versao + 1,
                ultimaAtualizacao: new Date(),
                atualizadoPor: `update-${i}`
              };
              
              await redisClient.set(`config:${escritorioId}`, JSON.stringify(novaConfig));
              
              return {
                updateIndex: i,
                sucesso: true,
                novoValor: novaConfig.valorHoraArquiteto,
                versao: novaConfig.versao
              };
              
            } finally {
              // Liberar lock apenas se ainda for nosso
              const currentLock = await redisClient.get(lockKey);
              if (currentLock === lockValue) {
                await redisClient.del(lockKey);
              }
            }
          } else {
            return {
              updateIndex: i,
              sucesso: false,
              motivo: 'Lock não adquirido'
            };
          }
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      const atualizacoesSucesso = result.filter(r => r.sucesso);
      const atualizacoesFalha = result.filter(r => !r.sucesso);
      
      // Deve ter pelo menos algumas atualizações bem-sucedidas
      expect(atualizacoesSucesso.length).toBeGreaterThan(0);
      
      // Verificar configuração final
      const configFinalStr = await redisClient.get(`config:${escritorioId}`);
      const configFinal = JSON.parse(configFinalStr);
      
      // Valor deve ter sido incrementado corretamente
      const incrementoEsperado = atualizacoesSucesso.length * 10;
      expect(configFinal.valorHoraArquiteto).toBe(configInicial.valorHoraArquiteto + incrementoEsperado);
      expect(configFinal.versao).toBe(configInicial.versao + atualizacoesSucesso.length);
    });
    
    test('deve gerenciar histórico de orçamentos com atualizações concorrentes', async () => {
      const orcamentoId = 'orcamento-concurrent-history';
      const numeroVersoes = 15;
      
      // Orçamento inicial
      const orcamentoInicial = {
        id: orcamentoId,
        valorTotal: 10000,
        versao: 1,
        createdAt: new Date()
      };
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroVersoes }, async (_, i) => {
          // Simular criação de nova versão
          const novaVersao = {
            id: global.testUtils.generateTestId(),
            orcamentoId,
            versao: i + 2, // Começar da versão 2
            valorTotal: orcamentoInicial.valorTotal + (i + 1) * 1000,
            alteradoPor: `user-${i}`,
            motivoAlteracao: `Alteração ${i + 1}`,
            createdAt: new Date()
          };
          
          // Simular salvamento no histórico
          await global.testUtils.sleep(Math.random() * 200);
          
          const historicoKey = `historico:${orcamentoId}`;
          await redisClient.lPush(historicoKey, JSON.stringify(novaVersao));
          
          return novaVersao;
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      expect(result).toHaveLength(numeroVersoes);
      
      // Verificar histórico salvo
      const historicoKey = `historico:${orcamentoId}`;
      const historico = await redisClient.lRange(historicoKey, 0, -1);
      expect(historico).toHaveLength(numeroVersoes);
      
      // Verificar se todas as versões foram salvas
      const versoesHistorico = historico.map(h => JSON.parse(h).versao).sort((a, b) => a - b);
      const versoesEsperadas = Array.from({ length: numeroVersoes }, (_, i) => i + 2);
      expect(versoesHistorico).toEqual(versoesEsperadas);
    });
  });
  
  describe('Testes de Deadlock e Race Conditions', () => {
    test('deve evitar deadlocks em operações interdependentes', async () => {
      const recurso1 = 'recurso-1';
      const recurso2 = 'recurso-2';
      const numeroOperacoes = 10;
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroOperacoes }, async (_, i) => {
          const isEven = i % 2 === 0;
          
          // Alternar ordem de aquisição de locks para evitar deadlock
          const primeiroRecurso = isEven ? recurso1 : recurso2;
          const segundoRecurso = isEven ? recurso2 : recurso1;
          
          const lock1Key = `lock:${primeiroRecurso}`;
          const lock2Key = `lock:${segundoRecurso}`;
          const lockValue = `op-${i}-${Date.now()}`;
          
          // Tentar adquirir primeiro lock
          const lock1 = await redisClient.setNX(lock1Key, lockValue);
          
          if (lock1) {
            try {
              // Pequeno delay antes do segundo lock
              await global.testUtils.sleep(Math.random() * 50);
              
              // Tentar adquirir segundo lock
              const lock2 = await redisClient.setNX(lock2Key, lockValue);
              
              if (lock2) {
                try {
                  // Simular operação que usa ambos os recursos
                  await global.testUtils.sleep(Math.random() * 100);
                  
                  return {
                    operationIndex: i,
                    sucesso: true,
                    recursos: [primeiroRecurso, segundoRecurso]
                  };
                  
                } finally {
                  await redisClient.del(lock2Key);
                }
              } else {
                return {
                  operationIndex: i,
                  sucesso: false,
                  motivo: 'Segundo lock não adquirido'
                };
              }
              
            } finally {
              await redisClient.del(lock1Key);
            }
          } else {
            return {
              operationIndex: i,
              sucesso: false,
              motivo: 'Primeiro lock não adquirido'
            };
          }
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      const operacoesSucesso = result.filter(r => r.sucesso);
      
      // Deve ter completado pelo menos algumas operações
      expect(operacoesSucesso.length).toBeGreaterThan(0);
      
      // Não deve ter travado (timeout implícito do Jest)
      expect(executionTime).toBeLessThan(10000); // Menos de 10 segundos
      
      // Verificar se locks foram liberados
      const lock1Restante = await redisClient.get(`lock:${recurso1}`);
      const lock2Restante = await redisClient.get(`lock:${recurso2}`);
      expect(lock1Restante).toBeNull();
      expect(lock2Restante).toBeNull();
    });
    
    test('deve detectar e resolver race conditions em contadores', async () => {
      const contadorKey = 'contador:orcamentos-gerados';
      const numeroIncrementos = 100;
      
      // Inicializar contador
      await redisClient.set(contadorKey, '0');
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const promises = Array.from({ length: numeroIncrementos }, async (_, i) => {
          // Simular incremento atômico
          const novoValor = await redisClient.incr(contadorKey);
          
          return {
            incrementIndex: i,
            valorAposIncremento: novoValor
          };
        });
        
        return Promise.all(promises);
      });
      
      // Validações
      expect(result).toHaveLength(numeroIncrementos);
      
      // Valor final deve ser exato
      const valorFinal = await redisClient.get(contadorKey);
      expect(parseInt(valorFinal)).toBe(numeroIncrementos);
      
      // Todos os valores devem ser únicos (não houve race condition)
      const valores = result.map(r => r.valorAposIncremento).sort((a, b) => a - b);
      const valoresEsperados = Array.from({ length: numeroIncrementos }, (_, i) => i + 1);
      expect(valores).toEqual(valoresEsperados);
    });
  });
});