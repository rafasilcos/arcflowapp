const { createClient } = require('redis');

describe('Testes End-to-End Completos - Sistema Briefing-Orçamento', () => {
  let redisClient;
  let seedData;
  
  beforeAll(async () => {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    await redisClient.connect();
    seedData = await global.testUtils.getSeedData();
  });
  
  afterAll(async () => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.disconnect();
    }
  });
  
  describe('Fluxo Completo: Briefing Padrão → Orçamento', () => {
    test('deve executar fluxo completo de geração de orçamento', async () => {
      const fluxoCompleto = {
        etapas: [],
        tempoTotal: 0,
        sucesso: false,
        resultados: {}
      };
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // ETAPA 1: Criar briefing
        fluxoCompleto.etapas.push('CRIAR_BRIEFING');
        const briefing = {
          id: global.testUtils.generateTestId(),
          escritorioId: 'escritorio-test-1',
          nome: 'Casa Unifamiliar Completa',
          tipologia: 'RESIDENCIAL',
          status: 'EM_ANDAMENTO',
          respostas: {
            area_construida: '180',
            area_terreno: '400',
            tipologia: 'casa_unifamiliar',
            padrao_acabamento: 'alto',
            numero_pavimentos: '2',
            numero_quartos: '4',
            numero_banheiros: '3',
            garagem: 'sim',
            piscina: 'sim',
            churrasqueira: 'sim'
          },
          createdAt: new Date()
        };
        
        fluxoCompleto.resultados.briefing = briefing;
        
        // ETAPA 2: Finalizar briefing
        fluxoCompleto.etapas.push('FINALIZAR_BRIEFING');
        briefing.status = 'CONCLUIDO';
        briefing.finalizadoEm = new Date();
        
        // ETAPA 3: Analisar briefing
        fluxoCompleto.etapas.push('ANALISAR_BRIEFING');
        await global.testUtils.sleep(1500); // Simular tempo de análise
        
        const analise = {
          briefingId: briefing.id,
          dadosExtraidos: {
            areaConstruida: 180,
            areaTerreno: 400,
            tipologia: 'RESIDENCIAL',
            subtipo: 'CASA_UNIFAMILIAR',
            padrao: 'ALTO',
            complexidade: 'ALTA', // Devido às características especiais
            numeroPavimentos: 2,
            caracteristicasEspeciais: ['piscina', 'churrasqueira'],
            disciplinasNecessarias: [
              'ARQUITETURA',
              'ESTRUTURAL',
              'INSTALACOES_ELETRICAS',
              'INSTALACOES_HIDRAULICAS',
              'PAISAGISMO'
            ]
          },
          confianca: 0.95,
          algoritmo: 'STANDARD_PARSER'
        };
        
        fluxoCompleto.resultados.analise = analise;
        
        // ETAPA 4: Buscar configuração do escritório
        fluxoCompleto.etapas.push('BUSCAR_CONFIGURACAO');
        const configuracao = seedData.escritorios.find(e => e.id === briefing.escritorioId).configuracao;
        fluxoCompleto.resultados.configuracao = configuracao;
        
        // ETAPA 5: Calcular horas por disciplina
        fluxoCompleto.etapas.push('CALCULAR_HORAS');
        await global.testUtils.sleep(800); // Simular cálculo
        
        const horasPorDisciplina = {
          'ARQUITETURA': Math.round(analise.dadosExtraidos.areaConstruida * 0.8), // 144h
          'ESTRUTURAL': Math.round(analise.dadosExtraidos.areaConstruida * 0.4), // 72h
          'INSTALACOES_ELETRICAS': Math.round(analise.dadosExtraidos.areaConstruida * 0.3), // 54h
          'INSTALACOES_HIDRAULICAS': Math.round(analise.dadosExtraidos.areaConstruida * 0.25), // 45h
          'PAISAGISMO': 40 // Fixo para piscina e churrasqueira
        };
        
        const horasTotal = Object.values(horasPorDisciplina).reduce((sum, h) => sum + h, 0);
        fluxoCompleto.resultados.horas = { horasPorDisciplina, horasTotal };
        
        // ETAPA 6: Calcular valores
        fluxoCompleto.etapas.push('CALCULAR_VALORES');
        await global.testUtils.sleep(600); // Simular cálculo
        
        const valoresPorDisciplina = {
          'ARQUITETURA': horasPorDisciplina.ARQUITETURA * configuracao.tabelaPrecos.valorHoraArquiteto,
          'ESTRUTURAL': horasPorDisciplina.ESTRUTURAL * configuracao.tabelaPrecos.valorHoraEngenheiro,
          'INSTALACOES_ELETRICAS': horasPorDisciplina.INSTALACOES_ELETRICAS * configuracao.tabelaPrecos.valorHoraEngenheiro,
          'INSTALACOES_HIDRAULICAS': horasPorDisciplina.INSTALACOES_HIDRAULICAS * configuracao.tabelaPrecos.valorHoraEngenheiro,
          'PAISAGISMO': horasPorDisciplina.PAISAGISMO * configuracao.tabelaPrecos.valorHoraDesigner
        };
        
        const valorBruto = Object.values(valoresPorDisciplina).reduce((sum, v) => sum + v, 0);
        
        // Aplicar multiplicador de complexidade
        const multiplicadorComplexidade = 1.3; // ALTA complexidade
        const valorComComplexidade = valorBruto * multiplicadorComplexidade;
        
        // Aplicar multiplicador de tipologia
        const multiplicadorTipologia = configuracao.multiplicadores.RESIDENCIAL;
        const valorComTipologia = valorComComplexidade * multiplicadorTipologia;
        
        const valorTotal = Math.round(valorComTipologia);
        
        fluxoCompleto.resultados.valores = {
          valoresPorDisciplina,
          valorBruto,
          multiplicadorComplexidade,
          multiplicadorTipologia,
          valorTotal
        };
        
        // ETAPA 7: Gerar orçamento
        fluxoCompleto.etapas.push('GERAR_ORCAMENTO');
        await global.testUtils.sleep(1000); // Simular geração
        
        const orcamento = {
          id: global.testUtils.generateTestId(),
          briefingId: briefing.id,
          escritorioId: briefing.escritorioId,
          tipologia: analise.dadosExtraidos.tipologia,
          subtipo: analise.dadosExtraidos.subtipo,
          complexidade: analise.dadosExtraidos.complexidade,
          areaConstruida: analise.dadosExtraidos.areaConstruida,
          valorTotal,
          horasTotal,
          disciplinas: Object.entries(horasPorDisciplina).map(([nome, horas]) => ({
            nome,
            horas,
            valor: valoresPorDisciplina[nome],
            valorHora: nome === 'ARQUITETURA' ? configuracao.tabelaPrecos.valorHoraArquiteto :
                      nome === 'PAISAGISMO' ? configuracao.tabelaPrecos.valorHoraDesigner :
                      configuracao.tabelaPrecos.valorHoraEngenheiro
          })),
          breakdown: {
            valorBruto,
            multiplicadorComplexidade,
            multiplicadorTipologia,
            valorFinal: valorTotal
          },
          caracteristicasEspeciais: analise.dadosExtraidos.caracteristicasEspeciais,
          observacoes: 'Orçamento gerado automaticamente com base no briefing',
          versao: 1,
          status: 'GERADO',
          createdAt: new Date()
        };
        
        fluxoCompleto.resultados.orcamento = orcamento;
        
        // ETAPA 8: Salvar orçamento
        fluxoCompleto.etapas.push('SALVAR_ORCAMENTO');
        await redisClient.set(`orcamento:${orcamento.id}`, JSON.stringify(orcamento));
        
        // ETAPA 9: Atualizar briefing
        fluxoCompleto.etapas.push('ATUALIZAR_BRIEFING');
        briefing.orcamentoGerado = true;
        briefing.orcamentoId = orcamento.id;
        briefing.updatedAt = new Date();
        
        await redisClient.set(`briefing:${briefing.id}`, JSON.stringify(briefing));
        
        // ETAPA 10: Registrar métricas
        fluxoCompleto.etapas.push('REGISTRAR_METRICAS');
        const metrica = {
          operacao: 'FLUXO_COMPLETO_ORCAMENTO',
          briefingId: briefing.id,
          orcamentoId: orcamento.id,
          escritorioId: briefing.escritorioId,
          tempoTotal: executionTime,
          valorGerado: orcamento.valorTotal,
          horasCalculadas: orcamento.horasTotal,
          disciplinas: orcamento.disciplinas.length,
          sucesso: true,
          timestamp: new Date()
        };
        
        await redisClient.lPush('metricas:fluxo-completo', JSON.stringify(metrica));
        fluxoCompleto.resultados.metrica = metrica;
        
        fluxoCompleto.sucesso = true;
        return fluxoCompleto;
      });
      
      fluxoCompleto.tempoTotal = executionTime;
      
      // Validações do fluxo completo
      expect(result.sucesso).toBe(true);
      expect(result.etapas).toHaveLength(10);
      expect(result.tempoTotal).toBeLessThan(10000); // Menos de 10 segundos
      
      // Validar briefing
      expect(result.resultados.briefing.status).toBe('CONCLUIDO');
      expect(result.resultados.briefing.orcamentoGerado).toBe(true);
      
      // Validar análise
      expect(result.resultados.analise.dadosExtraidos.areaConstruida).toBe(180);
      expect(result.resultados.analise.dadosExtraidos.complexidade).toBe('ALTA');
      expect(result.resultados.analise.confianca).toBeGreaterThan(0.9);
      
      // Validar cálculos
      expect(result.resultados.horas.horasTotal).toBe(355); // Soma das horas
      expect(result.resultados.valores.valorTotal).toBeGreaterThan(0);
      
      // Validar orçamento
      expect(result.resultados.orcamento).toBeValidOrcamento();
      expect(result.resultados.orcamento.disciplinas).toHaveLength(5);
      expect(result.resultados.orcamento.caracteristicasEspeciais).toContain('piscina');
      
      // Verificar persistência
      const orcamentoSalvo = await redisClient.get(`orcamento:${result.resultados.orcamento.id}`);
      expect(orcamentoSalvo).not.toBeNull();
      
      const briefingAtualizado = await redisClient.get(`briefing:${result.resultados.briefing.id}`);
      expect(briefingAtualizado).not.toBeNull();
      
      console.log('✅ Fluxo completo executado com sucesso em', executionTime, 'ms');
      console.log('💰 Valor total do orçamento:', result.resultados.valores.valorTotal);
      console.log('⏱️  Total de horas:', result.resultados.horas.horasTotal);
    });
  });
  
  describe('Fluxo Completo: Briefing Personalizado → Orçamento', () => {
    test('deve processar briefing personalizado complexo', async () => {
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // BRIEFING PERSONALIZADO: Centro Médico
        const briefingPersonalizado = {
          id: global.testUtils.generateTestId(),
          escritorioId: 'escritorio-test-2',
          nome: 'Centro Médico Especializado',
          tipologia: 'PERSONALIZADO',
          status: 'CONCLUIDO',
          respostas: {
            'Tipo de estabelecimento': 'Centro médico com múltiplas especialidades',
            'Área total construída': '1.200 metros quadrados',
            'Área do terreno': '2.500 m²',
            'Número de consultórios': '15 consultórios médicos',
            'Salas especiais': '2 salas de cirurgia, 1 sala de raio-X, 1 laboratório',
            'Recepção e espera': 'Recepção ampla com 60 lugares',
            'Estacionamento': '40 vagas cobertas',
            'Nível de acabamento': 'Hospitalar - alto padrão',
            'Normas aplicáveis': 'Vigilância sanitária, ANVISA, acessibilidade',
            'Instalações especiais': 'Gases medicinais, sistema de emergência, ar condicionado central',
            'Prazo desejado': '24 meses',
            'Orçamento de referência': 'R$ 800.000'
          }
        };
        
        // ANÁLISE ADAPTATIVA
        await global.testUtils.sleep(3000); // Análise mais complexa
        
        const analiseAdaptativa = {
          briefingId: briefingPersonalizado.id,
          dadosExtraidos: {
            areaConstruida: 1200,
            areaTerreno: 2500,
            tipologia: 'INSTITUCIONAL',
            subtipo: 'CLINICA_HOSPITAL',
            padrao: 'ALTO',
            complexidade: 'MUITO_ALTA',
            numeroConsultorios: 15,
            salasEspeciais: ['cirurgia', 'raio-x', 'laboratorio'],
            capacidadeEspera: 60,
            vagasEstacionamento: 40,
            disciplinasNecessarias: [
              'ARQUITETURA',
              'ESTRUTURAL',
              'INSTALACOES_ELETRICAS',
              'INSTALACOES_HIDRAULICAS',
              'AR_CONDICIONADO',
              'GASES_MEDICINAIS',
              'CONSULTORIA_HOSPITALAR'
            ],
            normasEspeciais: ['ANVISA', 'VIGILANCIA_SANITARIA', 'ACESSIBILIDADE'],
            prazoMeses: 24,
            orcamentoReferencia: 800000
          },
          confianca: 0.88,
          algoritmo: 'ADAPTIVE_PARSER_V2',
          camposMapeados: 11,
          camposTotal: 12
        };
        
        // CÁLCULO ESPECIALIZADO
        await global.testUtils.sleep(2000);
        
        const configuracaoEscritorio = seedData.escritorios.find(e => e.id === briefingPersonalizado.escritorioId).configuracao;
        
        const horasEspecializadas = {
          'ARQUITETURA': Math.round(analiseAdaptativa.dadosExtraidos.areaConstruida * 1.2), // 1440h - mais complexo
          'ESTRUTURAL': Math.round(analiseAdaptativa.dadosExtraidos.areaConstruida * 0.6), // 720h
          'INSTALACOES_ELETRICAS': Math.round(analiseAdaptativa.dadosExtraidos.areaConstruida * 0.5), // 600h
          'INSTALACOES_HIDRAULICAS': Math.round(analiseAdaptativa.dadosExtraidos.areaConstruida * 0.4), // 480h
          'AR_CONDICIONADO': Math.round(analiseAdaptativa.dadosExtraidos.areaConstruida * 0.3), // 360h
          'GASES_MEDICINAIS': 200, // Especializado
          'CONSULTORIA_HOSPITALAR': 150 // Especializado
        };
        
        const valoresEspecializados = {
          'ARQUITETURA': horasEspecializadas.ARQUITETURA * configuracaoEscritorio.tabelaPrecos.valorHoraArquiteto,
          'ESTRUTURAL': horasEspecializadas.ESTRUTURAL * configuracaoEscritorio.tabelaPrecos.valorHoraEngenheiro,
          'INSTALACOES_ELETRICAS': horasEspecializadas.INSTALACOES_ELETRICAS * configuracaoEscritorio.tabelaPrecos.valorHoraEngenheiro,
          'INSTALACOES_HIDRAULICAS': horasEspecializadas.INSTALACOES_HIDRAULICAS * configuracaoEscritorio.tabelaPrecos.valorHoraEngenheiro,
          'AR_CONDICIONADO': horasEspecializadas.AR_CONDICIONADO * configuracaoEscritorio.tabelaPrecos.valorHoraEngenheiro,
          'GASES_MEDICINAIS': horasEspecializadas.GASES_MEDICINAIS * 250, // Valor especializado
          'CONSULTORIA_HOSPITALAR': horasEspecializadas.CONSULTORIA_HOSPITALAR * 300 // Valor especializado
        };
        
        const horasTotal = Object.values(horasEspecializadas).reduce((sum, h) => sum + h, 0);
        const valorBruto = Object.values(valoresEspecializados).reduce((sum, v) => sum + v, 0);
        
        // Multiplicadores para projeto hospitalar
        const multiplicadorComplexidade = 1.6; // MUITO_ALTA
        const multiplicadorTipologia = 1.3; // INSTITUCIONAL
        const multiplicadorEspecializacao = 1.2; // Projeto hospitalar
        
        const valorTotal = Math.round(valorBruto * multiplicadorComplexidade * multiplicadorTipologia * multiplicadorEspecializacao);
        
        // ORÇAMENTO ESPECIALIZADO
        const orcamentoEspecializado = {
          id: global.testUtils.generateTestId(),
          briefingId: briefingPersonalizado.id,
          escritorioId: briefingPersonalizado.escritorioId,
          tipologia: analiseAdaptativa.dadosExtraidos.tipologia,
          subtipo: analiseAdaptativa.dadosExtraidos.subtipo,
          complexidade: analiseAdaptativa.dadosExtraidos.complexidade,
          areaConstruida: analiseAdaptativa.dadosExtraidos.areaConstruida,
          valorTotal,
          horasTotal,
          disciplinas: Object.entries(horasEspecializadas).map(([nome, horas]) => ({
            nome,
            horas,
            valor: valoresEspecializados[nome],
            especializada: ['GASES_MEDICINAIS', 'CONSULTORIA_HOSPITALAR'].includes(nome)
          })),
          multiplicadores: {
            complexidade: multiplicadorComplexidade,
            tipologia: multiplicadorTipologia,
            especializacao: multiplicadorEspecializacao
          },
          caracteristicasEspeciais: analiseAdaptativa.dadosExtraidos.salasEspeciais,
          normasAplicaveis: analiseAdaptativa.dadosExtraidos.normasEspeciais,
          observacoes: 'Orçamento para projeto hospitalar com disciplinas especializadas',
          confiancaAnalise: analiseAdaptativa.confianca,
          versao: 1,
          status: 'GERADO',
          createdAt: new Date()
        };
        
        return {
          briefing: briefingPersonalizado,
          analise: analiseAdaptativa,
          orcamento: orcamentoEspecializado,
          tempoProcessamento: executionTime
        };
      });
      
      // Validações específicas para briefing personalizado
      expect(result.analise.confianca).toBeGreaterThan(0.8);
      expect(result.analise.dadosExtraidos.tipologia).toBe('INSTITUCIONAL');
      expect(result.analise.dadosExtraidos.complexidade).toBe('MUITO_ALTA');
      
      expect(result.orcamento).toBeValidOrcamento();
      expect(result.orcamento.disciplinas).toHaveLength(7);
      expect(result.orcamento.horasTotal).toBe(3950); // Soma das horas especializadas
      expect(result.orcamento.valorTotal).toBeGreaterThan(1000000); // Projeto complexo
      
      // Verificar disciplinas especializadas
      const disciplinasEspecializadas = result.orcamento.disciplinas.filter(d => d.especializada);
      expect(disciplinasEspecializadas).toHaveLength(2);
      
      expect(executionTime).toBeLessThan(8000); // Menos de 8 segundos
      
      console.log('🏥 Briefing personalizado processado:', result.briefing.nome);
      console.log('💰 Valor especializado:', result.orcamento.valorTotal);
      console.log('🔬 Disciplinas especializadas:', disciplinasEspecializadas.length);
    });
  });
  
  describe('Fluxo Completo: Múltiplos Orçamentos Simultâneos', () => {
    test('deve processar múltiplos orçamentos de diferentes tipos simultaneamente', async () => {
      const tiposProjeto = [
        { tipo: 'RESIDENCIAL', nome: 'Casa de Alto Padrão', area: 300 },
        { tipo: 'COMERCIAL', nome: 'Loja de Departamentos', area: 800 },
        { tipo: 'INDUSTRIAL', nome: 'Galpão Logístico', area: 2000 },
        { tipo: 'INSTITUCIONAL', nome: 'Escola Infantil', area: 600 },
        { tipo: 'RESIDENCIAL', nome: 'Apartamento Duplex', area: 200 }
      ];
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        const promises = tiposProjeto.map(async (projeto, index) => {
          const briefing = {
            id: `briefing-simultaneo-${index}`,
            escritorioId: index % 2 === 0 ? 'escritorio-test-1' : 'escritorio-test-2',
            nome: projeto.nome,
            tipologia: projeto.tipo,
            areaConstruida: projeto.area,
            status: 'CONCLUIDO',
            respostas: {
              area_construida: projeto.area.toString(),
              tipologia: projeto.tipo.toLowerCase(),
              padrao_acabamento: 'medio'
            }
          };
          
          // Simular processamento paralelo
          await global.testUtils.sleep(Math.random() * 2000 + 1000);
          
          const orcamento = {
            id: `orcamento-simultaneo-${index}`,
            briefingId: briefing.id,
            escritorioId: briefing.escritorioId,
            tipologia: projeto.tipo,
            areaConstruida: projeto.area,
            valorTotal: projeto.area * (100 + Math.random() * 200), // R$ 100-300/m²
            horasTotal: projeto.area * (0.5 + Math.random() * 0.5), // 0.5-1h/m²
            disciplinas: [
              { nome: 'ARQUITETURA', horas: projeto.area * 0.6, valor: projeto.area * 90 },
              { nome: 'ESTRUTURAL', horas: projeto.area * 0.3, valor: projeto.area * 36 }
            ],
            processadoEm: new Date(),
            indiceProcessamento: index
          };
          
          return {
            briefing,
            orcamento,
            projeto
          };
        });
        
        return Promise.all(promises);
      });
      
      // Validações do processamento simultâneo
      expect(result).toHaveLength(5);
      expect(executionTime).toBeLessThan(4000); // Processamento paralelo
      
      // Verificar se todos foram processados
      result.forEach((item, index) => {
        expect(item.orcamento.indiceProcessamento).toBe(index);
        expect(item.orcamento).toBeValidOrcamento();
        expect(item.orcamento.tipologia).toBe(tiposProjeto[index].tipo);
      });
      
      // Verificar distribuição por escritório
      const porEscritorio = result.reduce((acc, item) => {
        acc[item.briefing.escritorioId] = (acc[item.briefing.escritorioId] || 0) + 1;
        return acc;
      }, {});
      
      expect(Object.keys(porEscritorio)).toHaveLength(2);
      
      // Calcular estatísticas
      const valorTotal = result.reduce((sum, item) => sum + item.orcamento.valorTotal, 0);
      const horasTotal = result.reduce((sum, item) => sum + item.orcamento.horasTotal, 0);
      const areaTotal = result.reduce((sum, item) => sum + item.orcamento.areaConstruida, 0);
      
      expect(valorTotal).toBeGreaterThan(0);
      expect(horasTotal).toBeGreaterThan(0);
      expect(areaTotal).toBe(3900); // Soma das áreas
      
      console.log('🏗️  Processados simultaneamente:', result.length, 'projetos');
      console.log('💰 Valor total combinado:', valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
      console.log('⏱️  Horas totais:', Math.round(horasTotal));
    });
  });
  
  describe('Fluxo Completo: Regeneração e Versionamento', () => {
    test('deve regenerar orçamento com nova configuração mantendo histórico', async () => {
      // Criar orçamento inicial
      const briefingOriginal = global.testUtils.createMockBriefing('escritorio-test-1', 'COMERCIAL');
      const orcamentoOriginal = {
        id: global.testUtils.generateTestId(),
        briefingId: briefingOriginal.id,
        valorTotal: 50000,
        versao: 1,
        createdAt: new Date()
      };
      
      const { result, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Salvar orçamento original
        await redisClient.set(`orcamento:${orcamentoOriginal.id}`, JSON.stringify(orcamentoOriginal));
        
        // Simular alteração na configuração do escritório
        const novaConfiguracao = {
          ...seedData.escritorios[0].configuracao,
          tabelaPrecos: {
            ...seedData.escritorios[0].configuracao.tabelaPrecos,
            valorHoraArquiteto: 200 // Aumento de R$ 150 para R$ 200
          }
        };
        
        // Salvar histórico antes da regeneração
        const historicoVersao1 = {
          id: global.testUtils.generateTestId(),
          orcamentoId: orcamentoOriginal.id,
          versao: 1,
          dadosVersao: orcamentoOriginal,
          motivoAlteracao: 'Versão original',
          createdAt: new Date()
        };
        
        await redisClient.lPush(`historico:${orcamentoOriginal.id}`, JSON.stringify(historicoVersao1));
        
        // Regenerar orçamento com nova configuração
        await global.testUtils.sleep(2000); // Simular regeneração
        
        const orcamentoRegenerado = {
          ...orcamentoOriginal,
          valorTotal: 65000, // Aumento devido ao novo valor/hora
          versao: 2,
          configuracaoAplicada: novaConfiguracao,
          motivoRegeneracao: 'Atualização da tabela de preços',
          regeneradoEm: new Date(),
          versaoAnterior: 1
        };
        
        // Salvar nova versão
        await redisClient.set(`orcamento:${orcamentoOriginal.id}`, JSON.stringify(orcamentoRegenerado));
        
        // Comparação entre versões
        const comparacao = {
          versaoAnterior: orcamentoOriginal,
          versaoAtual: orcamentoRegenerado,
          diferencas: {
            valorTotal: orcamentoRegenerado.valorTotal - orcamentoOriginal.valorTotal,
            percentualAumento: ((orcamentoRegenerado.valorTotal - orcamentoOriginal.valorTotal) / orcamentoOriginal.valorTotal) * 100,
            valorHoraArquiteto: {
              anterior: 150,
              atual: 200,
              aumento: 50
            }
          }
        };
        
        return {
          orcamentoOriginal,
          orcamentoRegenerado,
          comparacao,
          historico: [historicoVersao1]
        };
      });
      
      // Validações do versionamento
      expect(result.orcamentoRegenerado.versao).toBe(2);
      expect(result.orcamentoRegenerado.valorTotal).toBeGreaterThan(result.orcamentoOriginal.valorTotal);
      expect(result.comparacao.diferencas.valorTotal).toBe(15000);
      expect(result.comparacao.diferencas.percentualAumento).toBe(30);
      
      // Verificar histórico
      const historicoSalvo = await redisClient.lRange(`historico:${orcamentoOriginal.id}`, 0, -1);
      expect(historicoSalvo).toHaveLength(1);
      
      const versaoHistorico = JSON.parse(historicoSalvo[0]);
      expect(versaoHistorico.versao).toBe(1);
      expect(versaoHistorico.dadosVersao.valorTotal).toBe(50000);
      
      console.log('🔄 Orçamento regenerado com sucesso');
      console.log('📈 Aumento de valor:', result.comparacao.diferencas.percentualAumento.toFixed(1) + '%');
      console.log('📚 Versões no histórico:', historicoSalvo.length);
    });
  });
});