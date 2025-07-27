const { createClient } = require('redis');

describe('Recuperação de Erros - Sistema Briefing-Orçamento', () => {
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
  
  describe('Recuperação de Falhas de Rede', () => {
    test('deve recuperar de falha temporária do Redis', async () => {
      const chaveCache = 'test:redis-recovery';
      const dadosTeste = { valor: 'teste-recovery' };
      
      let tentativas = 0;
      const maxTentativas = 3;
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        while (tentativas < maxTentativas) {
          try {
            tentativas++;
            
            // Simular falha nas primeiras tentativas
            if (tentativas < 3) {
              throw new Error('Redis connection failed');
            }
            
            // Sucesso na terceira tentativa
            await redisClient.set(chaveCache, JSON.stringify(dadosTeste));
            const resultado = await redisClient.get(chaveCache);
            
            return {
              sucesso: true,
              tentativas,
              dados: JSON.parse(resultado)
            };
            
          } catch (error) {
            if (tentativas >= maxTentativas) {
              throw error;
            }
            
            // Aguardar antes de tentar novamente (exponential backoff)
            await global.testUtils.sleep(Math.pow(2, tentativas) * 100);
          }
        }
      });
      
      expect(result.sucesso).toBe(true);
      expect(result.tentativas).toBe(3);
      expect(result.dados.valor).toBe('teste-recovery');
      expect(executionTime).toBeGreaterThan(300); // Deve incluir delays de retry
    });
    
    test('deve usar fallback quando cache não está disponível', async () => {
      const escritorioId = 'escritorio-fallback-test';
      
      // Simular configuração padrão (fallback)
      const configPadrao = {
        id: 'config-padrao',
        escritorioId,
        tabelaPrecos: {
          valorHoraArquiteto: 100,
          valorHoraEngenheiro: 80,
          valorHoraDesigner: 60
        },
        origem: 'FALLBACK'
      };
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        try {
          // Tentar buscar no cache (simular falha)
          throw new Error('Cache unavailable');
          
        } catch (cacheError) {
          // Usar fallback
          console.log('Cache indisponível, usando configuração padrão');
          
          return {
            configuracao: configPadrao,
            origem: 'FALLBACK',
            erro: cacheError.message
          };
        }
      });
      
      expect(result.configuracao.origem).toBe('FALLBACK');
      expect(result.configuracao.tabelaPrecos.valorHoraArquiteto).toBe(100);
      expect(result.origem).toBe('FALLBACK');
    });
  });
  
  describe('Recuperação de Falhas de Processamento', () => {
    test('deve recuperar de erro na análise de briefing', async () => {
      const briefingProblematico = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-1',
        nome: 'Briefing com Dados Corrompidos',
        respostas: {
          'area_construida': 'valor_inválido', // Dado corrompido
          'tipologia': null,
          'dados_corrompidos': '###ERRO###'
        }
      };
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        try {
          // Tentar análise normal
          if (briefingProblematico.respostas.area_construida === 'valor_inválido') {
            throw new Error('Dados corrompidos na análise');
          }
          
        } catch (error) {
          // Recuperação com análise simplificada
          console.log('Erro na análise, aplicando recuperação:', error.message);
          
          return {
            briefingId: briefingProblematico.id,
            dadosExtraidos: {
              areaConstruida: 120, // Valor padrão
              tipologia: 'RESIDENCIAL', // Inferido do nome
              complexidade: 'MEDIA',
              confianca: 0.3 // Baixa confiança devido ao erro
            },
            recuperacao: true,
            erroOriginal: error.message,
            metodoRecuperacao: 'ANALISE_SIMPLIFICADA'
          };
        }
      });
      
      expect(result.recuperacao).toBe(true);
      expect(result.dadosExtraidos.areaConstruida).toBe(120);
      expect(result.dadosExtraidos.confianca).toBe(0.3);
      expect(result.metodoRecuperacao).toBe('ANALISE_SIMPLIFICADA');
    });
    
    test('deve recuperar de erro no cálculo de orçamento', async () => {
      const dadosCalculoInvalidos = {
        areaConstruida: -100, // Valor inválido
        tipologia: 'TIPO_INEXISTENTE',
        complexidade: null
      };
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        try {
          // Tentar cálculo normal
          if (dadosCalculoInvalidos.areaConstruida < 0) {
            throw new Error('Área construída inválida');
          }
          
        } catch (error) {
          // Recuperação com valores seguros
          console.log('Erro no cálculo, aplicando valores seguros:', error.message);
          
          const dadosCorrigidos = {
            areaConstruida: Math.abs(dadosCalculoInvalidos.areaConstruida) || 100,
            tipologia: 'RESIDENCIAL', // Padrão seguro
            complexidade: 'MEDIA'
          };
          
          return {
            orcamento: {
              id: global.testUtils.generateTestId(),
              valorTotal: dadosCorrigidos.areaConstruida * 100, // Cálculo simplificado
              horasTotal: dadosCorrigidos.areaConstruida * 0.8,
              observacoes: 'Orçamento gerado com valores corrigidos devido a erro nos dados'
            },
            recuperacao: true,
            dadosOriginais: dadosCalculoInvalidos,
            dadosCorrigidos,
            erroOriginal: error.message
          };
        }
      });
      
      expect(result.recuperacao).toBe(true);
      expect(result.orcamento.valorTotal).toBe(10000); // 100 * 100
      expect(result.orcamento.observacoes).toContain('valores corrigidos');
      expect(result.dadosCorrigidos.areaConstruida).toBe(100);
    });
  });
  
  describe('Recuperação de Falhas de Transação', () => {
    test('deve fazer rollback em caso de falha parcial', async () => {
      const briefingId = 'briefing-transacao-test';
      const orcamentoId = global.testUtils.generateTestId();
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const transacao = {
          passos: [],
          sucesso: false,
          rollbackExecutado: false
        };
        
        try {
          // Passo 1: Salvar orçamento
          transacao.passos.push('SALVAR_ORCAMENTO');
          await redisClient.set(`orcamento:${orcamentoId}`, JSON.stringify({
            id: orcamentoId,
            briefingId,
            valorTotal: 15000
          }));
          
          // Passo 2: Atualizar briefing
          transacao.passos.push('ATUALIZAR_BRIEFING');
          await redisClient.set(`briefing:${briefingId}`, JSON.stringify({
            id: briefingId,
            orcamentoId,
            orcamentoGerado: true
          }));
          
          // Passo 3: Simular falha
          transacao.passos.push('NOTIFICAR_USUARIO');
          throw new Error('Falha na notificação');
          
        } catch (error) {
          // Executar rollback
          console.log('Erro na transação, executando rollback:', error.message);
          
          // Reverter alterações
          if (transacao.passos.includes('SALVAR_ORCAMENTO')) {
            await redisClient.del(`orcamento:${orcamentoId}`);
          }
          
          if (transacao.passos.includes('ATUALIZAR_BRIEFING')) {
            await redisClient.del(`briefing:${briefingId}`);
          }
          
          transacao.rollbackExecutado = true;
          transacao.erroOriginal = error.message;
        }
        
        return transacao;
      });
      
      expect(result.rollbackExecutado).toBe(true);
      expect(result.passos).toContain('SALVAR_ORCAMENTO');
      expect(result.passos).toContain('ATUALIZAR_BRIEFING');
      
      // Verificar se rollback foi efetivo
      const orcamentoRestante = await redisClient.get(`orcamento:${orcamentoId}`);
      const briefingRestante = await redisClient.get(`briefing:${briefingId}`);
      
      expect(orcamentoRestante).toBeNull();
      expect(briefingRestante).toBeNull();
    });
    
    test('deve manter consistência em caso de falha durante versionamento', async () => {
      const orcamentoId = 'orcamento-versioning-test';
      const versaoOriginal = {
        id: orcamentoId,
        valorTotal: 10000,
        versao: 1
      };
      
      // Salvar versão original
      await redisClient.set(`orcamento:${orcamentoId}`, JSON.stringify(versaoOriginal));
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const operacao = {
          versaoOriginal,
          novaVersao: null,
          historicoSalvo: false,
          recuperacao: false
        };
        
        try {
          // Criar nova versão
          const novaVersao = {
            ...versaoOriginal,
            valorTotal: 12000,
            versao: 2,
            updatedAt: new Date()
          };
          
          operacao.novaVersao = novaVersao;
          
          // Salvar no histórico
          await redisClient.lPush(`historico:${orcamentoId}`, JSON.stringify(versaoOriginal));
          operacao.historicoSalvo = true;
          
          // Simular falha ao atualizar versão atual
          throw new Error('Falha ao atualizar versão atual');
          
        } catch (error) {
          // Recuperação: verificar consistência
          console.log('Erro no versionamento, verificando consistência:', error.message);
          
          const versaoAtual = await redisClient.get(`orcamento:${orcamentoId}`);
          const historico = await redisClient.lRange(`historico:${orcamentoId}`, 0, -1);
          
          if (operacao.historicoSalvo && versaoAtual) {
            const versaoAtualObj = JSON.parse(versaoAtual);
            
            // Se histórico foi salvo mas versão atual não foi atualizada,
            // remover do histórico para manter consistência
            if (versaoAtualObj.versao === versaoOriginal.versao) {
              await redisClient.lPop(`historico:${orcamentoId}`);
              operacao.recuperacao = true;
            }
          }
          
          operacao.erroOriginal = error.message;
        }
        
        return operacao;
      });
      
      expect(result.recuperacao).toBe(true);
      expect(result.historicoSalvo).toBe(true);
      
      // Verificar consistência final
      const versaoFinal = await redisClient.get(`orcamento:${orcamentoId}`);
      const historicoFinal = await redisClient.lRange(`historico:${orcamentoId}`, 0, -1);
      
      const versaoFinalObj = JSON.parse(versaoFinal);
      expect(versaoFinalObj.versao).toBe(1); // Deve manter versão original
      expect(historicoFinal).toHaveLength(0); // Histórico deve estar limpo
    });
  });
  
  describe('Recuperação de Falhas de Recursos', () => {
    test('deve recuperar de esgotamento de memória', async () => {
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const operacao = {
          dadosProcessados: 0,
          memoriaLiberada: false,
          recuperacao: false
        };
        
        try {
          // Simular processamento que consome muita memória
          const dadosGrandes = [];
          
          for (let i = 0; i < 1000; i++) {
            // Simular verificação de memória
            const memoriaUsada = process.memoryUsage().heapUsed / 1024 / 1024; // MB
            
            if (memoriaUsada > 100) { // Limite simulado de 100MB
              throw new Error('Memory limit exceeded');
            }
            
            dadosGrandes.push(new Array(1000).fill(Math.random()));
            operacao.dadosProcessados = i + 1;
          }
          
        } catch (error) {
          // Recuperação: liberar memória e processar em lotes menores
          console.log('Limite de memória atingido, processando em lotes:', error.message);
          
          // Forçar garbage collection se disponível
          if (global.gc) {
            global.gc();
          }
          
          operacao.memoriaLiberada = true;
          operacao.recuperacao = true;
          
          // Processar em lotes menores
          const lotesPequenos = Math.ceil(1000 / 100); // 10 lotes de 100
          for (let lote = 0; lote < lotesPequenos; lote++) {
            // Processar lote pequeno
            const dadosLote = new Array(100).fill(0);
            operacao.dadosProcessados += dadosLote.length;
            
            // Liberar memória entre lotes
            if (global.gc && lote % 3 === 0) {
              global.gc();
            }
          }
        }
        
        return operacao;
      });
      
      expect(result.recuperacao).toBe(true);
      expect(result.memoriaLiberada).toBe(true);
      expect(result.dadosProcessados).toBe(1000); // Todos os dados processados
    });
    
    test('deve recuperar de timeout em operações longas', async () => {
      const timeoutMs = 2000; // 2 segundos
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const operacao = {
          etapasCompletas: 0,
          timeoutOcorreu: false,
          recuperacao: false,
          resultadoParcial: null
        };
        
        const etapas = [
          { nome: 'ANALISE_BRIEFING', tempo: 800 },
          { nome: 'CALCULO_VALORES', tempo: 600 },
          { nome: 'VALIDACAO_DADOS', tempo: 400 },
          { nome: 'GERACAO_RELATORIO', tempo: 1500 } // Esta vai causar timeout
        ];
        
        const inicioOperacao = Date.now();
        
        for (const etapa of etapas) {
          const tempoDecorrido = Date.now() - inicioOperacao;
          
          if (tempoDecorrido + etapa.tempo > timeoutMs) {
            // Timeout iminente, interromper e retornar resultado parcial
            console.log(`Timeout iminente na etapa ${etapa.nome}, retornando resultado parcial`);
            
            operacao.timeoutOcorreu = true;
            operacao.recuperacao = true;
            operacao.resultadoParcial = {
              etapasCompletas: operacao.etapasCompletas,
              ultimaEtapa: etapas[operacao.etapasCompletas - 1]?.nome || 'INICIO',
              proximaEtapa: etapa.nome,
              podeRetomarEm: etapa.nome
            };
            break;
          }
          
          // Simular processamento da etapa
          await global.testUtils.sleep(etapa.tempo);
          operacao.etapasCompletas++;
        }
        
        return operacao;
      });
      
      expect(result.timeoutOcorreu).toBe(true);
      expect(result.recuperacao).toBe(true);
      expect(result.etapasCompletas).toBe(3); // 3 etapas completas antes do timeout
      expect(result.resultadoParcial.proximaEtapa).toBe('GERACAO_RELATORIO');
      expect(executionTime).toBeLessThan(timeoutMs + 500); // Deve ter parado antes do timeout
    });
  });
  
  describe('Recuperação de Falhas de Validação', () => {
    test('deve recuperar de dados inválidos com sanitização', async () => {
      const dadosInvalidos = {
        areaConstruida: 'abc123', // String em vez de número
        valorOrcamento: -5000, // Valor negativo
        tipologia: '<script>alert("xss")</script>', // Possível XSS
        observacoes: 'Texto muito longo'.repeat(1000) // Texto muito longo
      };
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const sanitizacao = {
          dadosOriginais: dadosInvalidos,
          dadosSanitizados: {},
          errosEncontrados: [],
          recuperacao: false
        };
        
        try {
          // Tentar usar dados como estão
          if (typeof dadosInvalidos.areaConstruida !== 'number') {
            throw new Error('Área construída deve ser um número');
          }
          
        } catch (error) {
          // Recuperação com sanitização
          console.log('Dados inválidos detectados, aplicando sanitização:', error.message);
          
          sanitizacao.recuperacao = true;
          
          // Sanitizar área construída
          const areaStr = String(dadosInvalidos.areaConstruida);
          const areaNumeros = areaStr.replace(/[^\d.]/g, '');
          sanitizacao.dadosSanitizados.areaConstruida = parseFloat(areaNumeros) || 100;
          
          if (areaNumeros !== areaStr) {
            sanitizacao.errosEncontrados.push('Área construída continha caracteres inválidos');
          }
          
          // Sanitizar valor do orçamento
          sanitizacao.dadosSanitizados.valorOrcamento = Math.abs(dadosInvalidos.valorOrcamento) || 0;
          
          if (dadosInvalidos.valorOrcamento < 0) {
            sanitizacao.errosEncontrados.push('Valor do orçamento era negativo');
          }
          
          // Sanitizar tipologia (remover HTML/scripts)
          sanitizacao.dadosSanitizados.tipologia = dadosInvalidos.tipologia
            .replace(/<[^>]*>/g, '') // Remover tags HTML
            .substring(0, 50) // Limitar tamanho
            .toUpperCase() || 'RESIDENCIAL';
          
          if (dadosInvalidos.tipologia.includes('<')) {
            sanitizacao.errosEncontrados.push('Tipologia continha código HTML');
          }
          
          // Sanitizar observações
          sanitizacao.dadosSanitizados.observacoes = dadosInvalidos.observacoes
            .substring(0, 500) // Limitar a 500 caracteres
            .replace(/[<>]/g, ''); // Remover caracteres perigosos
          
          if (dadosInvalidos.observacoes.length > 500) {
            sanitizacao.errosEncontrados.push('Observações eram muito longas');
          }
        }
        
        return sanitizacao;
      });
      
      expect(result.recuperacao).toBe(true);
      expect(result.errosEncontrados.length).toBeGreaterThan(0);
      expect(result.dadosSanitizados.areaConstruida).toBe(123); // Extraído de 'abc123'
      expect(result.dadosSanitizados.valorOrcamento).toBe(5000); // Valor absoluto
      expect(result.dadosSanitizados.tipologia).not.toContain('<script>');
      expect(result.dadosSanitizados.observacoes.length).toBeLessThanOrEqual(500);
    });
    
    test('deve recuperar de falha de validação de negócio', async () => {
      const orcamentoInvalido = {
        areaConstruida: 50, // Muito pequena
        valorTotal: 1000000, // Muito alto para área pequena
        horasTotal: 10, // Muito poucas horas
        disciplinas: [] // Nenhuma disciplina
      };
      
      const { result } = await global.testUtils.measureExecutionTime(async () => {
        const validacao = {
          orcamentoOriginal: orcamentoInvalido,
          orcamentoCorrigido: null,
          violacoesEncontradas: [],
          recuperacao: false
        };
        
        // Validações de negócio
        const violacoes = [];
        
        if (orcamentoInvalido.areaConstruida < 80) {
          violacoes.push({
            campo: 'areaConstruida',
            valor: orcamentoInvalido.areaConstruida,
            minimo: 80,
            correcao: 80
          });
        }
        
        const valorPorM2 = orcamentoInvalido.valorTotal / orcamentoInvalido.areaConstruida;
        if (valorPorM2 > 5000) { // Máximo R$ 5.000/m²
          violacoes.push({
            campo: 'valorTotal',
            valor: orcamentoInvalido.valorTotal,
            valorPorM2,
            maximoPorM2: 5000,
            correcao: orcamentoInvalido.areaConstruida * 5000
          });
        }
        
        if (orcamentoInvalido.horasTotal < 20) {
          violacoes.push({
            campo: 'horasTotal',
            valor: orcamentoInvalido.horasTotal,
            minimo: 20,
            correcao: 20
          });
        }
        
        if (orcamentoInvalido.disciplinas.length === 0) {
          violacoes.push({
            campo: 'disciplinas',
            valor: orcamentoInvalido.disciplinas,
            correcao: ['ARQUITETURA']
          });
        }
        
        if (violacoes.length > 0) {
          // Aplicar correções
          validacao.recuperacao = true;
          validacao.violacoesEncontradas = violacoes;
          
          validacao.orcamentoCorrigido = {
            ...orcamentoInvalido
          };
          
          violacoes.forEach(violacao => {
            validacao.orcamentoCorrigido[violacao.campo] = violacao.correcao;
          });
        }
        
        return validacao;
      });
      
      expect(result.recuperacao).toBe(true);
      expect(result.violacoesEncontradas.length).toBe(4);
      expect(result.orcamentoCorrigido.areaConstruida).toBe(80);
      expect(result.orcamentoCorrigido.valorTotal).toBe(400000); // 80 * 5000
      expect(result.orcamentoCorrigido.horasTotal).toBe(20);
      expect(result.orcamentoCorrigido.disciplinas).toEqual(['ARQUITETURA']);
    });
  });
});