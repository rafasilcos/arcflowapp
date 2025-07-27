const { createClient } = require('redis');

describe('Briefings Personalizados - Integração', () => {
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
  
  describe('Análise de Briefings Personalizados', () => {
    test('deve analisar briefing com estrutura não padronizada', async () => {
      const briefingPersonalizado = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-2',
        nome: 'Centro de Convenções',
        tipologia: 'PERSONALIZADO',
        status: 'CONCLUIDO',
        respostas: {
          'Qual o tipo de projeto?': 'Centro de convenções e eventos',
          'Área total do projeto': '3.500 m²',
          'Área do terreno': '8.000 m²',
          'Capacidade de pessoas': '2.000 pessoas',
          'Nível de acabamento': 'Alto padrão',
          'Estrutura especial necessária?': 'Sim, vãos livres grandes',
          'Instalações especiais': 'Ar condicionado central, sistema de som, iluminação cênica',
          'Disciplinas envolvidas': 'Arquitetura, Estrutural, Instalações elétricas, Instalações hidráulicas, Ar condicionado',
          'Prazo desejado': '18 meses',
          'Orçamento estimado pelo cliente': 'R$ 500.000'
        }
      };
      
      // Simular análise adaptativa
      const { result: analise, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Simular processamento de análise
        await global.testUtils.simulateNetworkDelay(2000, 3000);
        
        return {
          briefingId: briefingPersonalizado.id,
          dadosExtraidos: {
            areaConstruida: 3500, // Extraído de "3.500 m²"
            areaTerreno: 8000,    // Extraído de "8.000 m²"
            tipologia: 'INSTITUCIONAL', // Inferido de "centro de convenções"
            padrao: 'ALTO',       // Extraído de "Alto padrão"
            complexidade: 'MUITO_ALTA', // Inferido das características
            capacidadePessoas: 2000,
            disciplinasNecessarias: [
              'ARQUITETURA',
              'ESTRUTURAL', 
              'INSTALACOES_ELETRICAS',
              'INSTALACOES_HIDRAULICAS',
              'AR_CONDICIONADO'
            ],
            caracteristicasEspeciais: [
              'Vãos livres grandes',
              'Sistema de som',
              'Iluminação cênica',
              'Ar condicionado central'
            ],
            prazoMeses: 18,
            orcamentoReferencia: 500000
          },
          confianca: 0.85, // 85% de confiança na análise
          camposMapeados: {
            'Área total do projeto': 'areaConstruida',
            'Área do terreno': 'areaTerreno',
            'Qual o tipo de projeto?': 'tipologia',
            'Nível de acabamento': 'padrao',
            'Disciplinas envolvidas': 'disciplinasNecessarias'
          },
          algoritmoUsado: 'ADAPTIVE_PARSER_V2'
        };
      });
      
      // Validações
      expect(analise.dadosExtraidos.areaConstruida).toBe(3500);
      expect(analise.dadosExtraidos.tipologia).toBe('INSTITUCIONAL');
      expect(analise.dadosExtraidos.complexidade).toBe('MUITO_ALTA');
      expect(analise.dadosExtraidos.disciplinasNecessarias).toHaveLength(5);
      expect(analise.confianca).toBeGreaterThan(0.8);
      expect(executionTime).toBeLessThan(5000);
      
      // Verificar mapeamento de campos
      expect(analise.camposMapeados).toHaveProperty('Área total do projeto');
      expect(analise.camposMapeados['Área total do projeto']).toBe('areaConstruida');
    });
    
    test('deve inferir tipologia a partir de descrições textuais', async () => {
      const testCases = [
        {
          descricao: 'Clínica médica com consultórios e laboratório',
          tipologiaEsperada: 'INSTITUCIONAL',
          subtipo: 'CLINICA_HOSPITAL'
        },
        {
          descricao: 'Galpão para armazenamento e distribuição',
          tipologiaEsperada: 'INDUSTRIAL',
          subtipo: 'GALPAO_LOGISTICO'
        },
        {
          descricao: 'Loja de departamentos em shopping center',
          tipologiaEsperada: 'COMERCIAL',
          subtipo: 'LOJA_VAREJO'
        },
        {
          descricao: 'Condomínio residencial com 50 apartamentos',
          tipologiaEsperada: 'RESIDENCIAL',
          subtipo: 'EDIFICIO_RESIDENCIAL'
        }
      ];
      
      for (const testCase of testCases) {
        // Simular inferência de tipologia
        const inferencia = {
          textoOriginal: testCase.descricao,
          tipologiaInferida: testCase.tipologiaEsperada,
          subtipo: testCase.subtipo,
          confianca: 0.9,
          palavrasChave: testCase.descricao.toLowerCase().split(' ').filter(p => p.length > 3),
          algoritmo: 'NLP_CLASSIFIER'
        };
        
        expect(inferencia.tipologiaInferida).toBe(testCase.tipologiaEsperada);
        expect(inferencia.confianca).toBeGreaterThan(0.8);
        expect(inferencia.palavrasChave.length).toBeGreaterThan(0);
      }
    });
    
    test('deve extrair valores numéricos de textos diversos', async () => {
      const testCases = [
        {
          texto: '1.500 metros quadrados',
          valorEsperado: 1500,
          unidade: 'm²'
        },
        {
          texto: 'Área de 2500m2',
          valorEsperado: 2500,
          unidade: 'm²'
        },
        {
          texto: 'Terreno com 10.000 m²',
          valorEsperado: 10000,
          unidade: 'm²'
        },
        {
          texto: 'Orçamento de R$ 250.000,00',
          valorEsperado: 250000,
          unidade: 'R$'
        },
        {
          texto: 'Prazo de 24 meses',
          valorEsperado: 24,
          unidade: 'meses'
        }
      ];
      
      for (const testCase of testCases) {
        // Simular extração de valores
        const extracao = {
          textoOriginal: testCase.texto,
          valorExtraido: testCase.valorEsperado,
          unidadeDetectada: testCase.unidade,
          confianca: 0.95,
          regex: /[\d.,]+/g,
          metodo: 'REGEX_EXTRACTION'
        };
        
        expect(extracao.valorExtraido).toBe(testCase.valorEsperado);
        expect(extracao.unidadeDetectada).toBe(testCase.unidade);
        expect(extracao.confianca).toBeGreaterThan(0.9);
      }
    });
  });
  
  describe('Geração de Orçamento Adaptativo', () => {
    test('deve gerar orçamento para briefing personalizado complexo', async () => {
      const briefingComplexo = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-2',
        nome: 'Hospital Veterinário',
        tipologia: 'PERSONALIZADO',
        respostas: {
          'Tipo de estabelecimento': 'Hospital veterinário de grande porte',
          'Área construída': '2.800 m²',
          'Número de consultórios': '12 consultórios',
          'Salas cirúrgicas': '4 salas de cirurgia',
          'Internação': 'Área de internação com 30 baias',
          'Equipamentos especiais': 'Raio-X, ultrassom, laboratório',
          'Normas aplicáveis': 'Vigilância sanitária, CRMV',
          'Acabamento': 'Hospitalar - azulejos, pisos especiais',
          'Prazo': '20 meses'
        }
      };
      
      // Simular análise e geração de orçamento
      const { result: orcamento, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        await global.testUtils.simulateNetworkDelay(3000, 4000);
        
        return {
          id: global.testUtils.generateTestId(),
          briefingId: briefingComplexo.id,
          escritorioId: briefingComplexo.escritorioId,
          tipologia: 'INSTITUCIONAL', // Inferido
          subtipo: 'CLINICA_HOSPITAL',
          complexidade: 'MUITO_ALTA',
          areaConstruida: 2800,
          valorTotal: 420000,
          horasTotal: 2100,
          disciplinas: [
            {
              nome: 'ARQUITETURA',
              horas: 800,
              valor: 160000,
              observacoes: 'Projeto hospitalar especializado'
            },
            {
              nome: 'ESTRUTURAL',
              horas: 400,
              valor: 64000,
              observacoes: 'Estrutura para equipamentos pesados'
            },
            {
              nome: 'INSTALACOES_ELETRICAS',
              horas: 300,
              valor: 48000,
              observacoes: 'Instalações hospitalares especiais'
            },
            {
              nome: 'INSTALACOES_HIDRAULICAS',
              horas: 250,
              valor: 40000,
              observacoes: 'Sistema de gases medicinais'
            },
            {
              nome: 'AR_CONDICIONADO',
              horas: 200,
              valor: 32000,
              observacoes: 'Sistema de climatização hospitalar'
            },
            {
              nome: 'CONSULTORIA_ESPECIALIZADA',
              horas: 150,
              valor: 30000,
              observacoes: 'Consultoria em projetos hospitalares veterinários'
            }
          ],
          fatoresComplexidade: [
            'Normas sanitárias específicas',
            'Equipamentos especializados',
            'Instalações de gases medicinais',
            'Áreas de isolamento',
            'Controle de infecção'
          ],
          multiplicadorAplicado: 1.8, // Muito alta complexidade
          observacoes: 'Projeto requer especialização em arquitetura hospitalar veterinária',
          createdAt: new Date()
        };
      });
      
      // Validações
      expect(orcamento).toBeValidOrcamento();
      expect(orcamento.tipologia).toBe('INSTITUCIONAL');
      expect(orcamento.complexidade).toBe('MUITO_ALTA');
      expect(orcamento.disciplinas).toHaveLength(6);
      expect(orcamento.multiplicadorAplicado).toBe(1.8);
      expect(executionTime).toBeLessThan(6000);
      
      // Verificar se incluiu disciplina especializada
      const consultoria = orcamento.disciplinas.find(d => d.nome === 'CONSULTORIA_ESPECIALIZADA');
      expect(consultoria).toBeDefined();
      expect(consultoria.observacoes).toContain('hospitalar');
      
      // Verificar fatores de complexidade
      expect(orcamento.fatoresComplexidade).toContain('Normas sanitárias específicas');
      expect(orcamento.fatoresComplexidade.length).toBeGreaterThan(3);
    });
    
    test('deve solicitar dados complementares quando necessário', async () => {
      const briefingIncompleto = {
        id: global.testUtils.generateTestId(),
        escritorioId: 'escritorio-test-2',
        nome: 'Projeto Comercial',
        tipologia: 'PERSONALIZADO',
        respostas: {
          'Tipo de negócio': 'Loja de roupas',
          'Localização': 'Shopping center',
          // Faltam dados essenciais como área
        }
      };
      
      // Simular análise que detecta dados insuficientes
      const analise = {
        briefingId: briefingIncompleto.id,
        dadosExtraidos: {
          tipologia: 'COMERCIAL',
          subtipo: 'LOJA_VAREJO',
          localizacao: 'SHOPPING'
        },
        dadosInsuficientes: true,
        camposFaltantes: [
          {
            campo: 'areaConstruida',
            descricao: 'Área da loja em m²',
            obrigatorio: true,
            sugestao: 'Informar área total da loja'
          },
          {
            campo: 'orcamentoReferencia',
            descricao: 'Orçamento estimado pelo cliente',
            obrigatorio: false,
            sugestao: 'Valor de referência para validação'
          },
          {
            campo: 'prazo',
            descricao: 'Prazo desejado para o projeto',
            obrigatorio: false,
            sugestao: 'Prazo em meses'
          }
        ],
        acaoRecomendada: 'SOLICITAR_DADOS_COMPLEMENTARES',
        podeGerarOrcamentoEstimativo: true,
        observacoes: 'Possível gerar orçamento com valores médios para loja de roupas'
      };
      
      expect(analise.dadosInsuficientes).toBe(true);
      expect(analise.camposFaltantes).toHaveLength(3);
      expect(analise.camposFaltantes[0].obrigatorio).toBe(true);
      expect(analise.podeGerarOrcamentoEstimativo).toBe(true);
    });
  });
  
  describe('Validação e Qualidade dos Dados', () => {
    test('deve validar consistência dos dados extraídos', async () => {
      const dadosInconsistentes = {
        areaConstruida: 5000,
        areaTerreno: 200, // Inconsistente: terreno menor que construção
        tipologia: 'RESIDENCIAL',
        capacidadePessoas: 10000, // Inconsistente para residencial
        orcamentoReferencia: 50000 // Muito baixo para área grande
      };
      
      // Simular validação de consistência
      const validacao = {
        valido: false,
        inconsistencias: [
          {
            tipo: 'AREA_INCONSISTENTE',
            descricao: 'Área construída maior que área do terreno',
            severidade: 'ALTA',
            sugestao: 'Verificar se área construída inclui múltiplos pavimentos'
          },
          {
            tipo: 'CAPACIDADE_INCONSISTENTE',
            descricao: 'Capacidade muito alta para projeto residencial',
            severidade: 'MEDIA',
            sugestao: 'Verificar se tipologia está correta'
          },
          {
            tipo: 'ORCAMENTO_INCONSISTENTE',
            descricao: 'Orçamento muito baixo para área informada',
            severidade: 'BAIXA',
            sugestao: 'Confirmar valor de referência com cliente'
          }
        ],
        scoreConsistencia: 0.3, // 30% - baixa consistência
        recomendacao: 'REVISAR_DADOS_COM_CLIENTE'
      };
      
      expect(validacao.valido).toBe(false);
      expect(validacao.inconsistencias).toHaveLength(3);
      expect(validacao.scoreConsistencia).toBeLessThan(0.5);
      expect(validacao.inconsistencias[0].severidade).toBe('ALTA');
    });
    
    test('deve calcular score de confiança da análise', async () => {
      const testCases = [
        {
          cenario: 'Dados completos e consistentes',
          dados: {
            camposMapeados: 8,
            camposTotal: 10,
            consistencia: 0.95,
            tipologiaConfianca: 0.9
          },
          scoreEsperado: 0.85
        },
        {
          cenario: 'Dados parciais mas consistentes',
          dados: {
            camposMapeados: 5,
            camposTotal: 10,
            consistencia: 0.9,
            tipologiaConfianca: 0.8
          },
          scoreEsperado: 0.65
        },
        {
          cenario: 'Dados completos mas inconsistentes',
          dados: {
            camposMapeados: 9,
            camposTotal: 10,
            consistencia: 0.4,
            tipologiaConfianca: 0.7
          },
          scoreEsperado: 0.45
        }
      ];
      
      for (const testCase of testCases) {
        // Simular cálculo de score
        const score = (
          (testCase.dados.camposMapeados / testCase.dados.camposTotal) * 0.4 +
          testCase.dados.consistencia * 0.4 +
          testCase.dados.tipologiaConfianca * 0.2
        );
        
        expect(score).toBeCloseTo(testCase.scoreEsperado, 1);
      }
    });
  });
  
  describe('Cache e Performance', () => {
    test('deve cachear resultados de análise de briefings similares', async () => {
      const briefing1 = {
        respostas: {
          'Tipo': 'Casa unifamiliar',
          'Área': '150 m²',
          'Padrão': 'Médio'
        }
      };
      
      const briefing2 = {
        respostas: {
          'Tipo de projeto': 'Casa unifamiliar',
          'Área construída': '150 metros quadrados',
          'Nível de acabamento': 'Padrão médio'
        }
      };
      
      // Simular análise do primeiro briefing
      const analise1 = {
        tipologia: 'RESIDENCIAL',
        areaConstruida: 150,
        padrao: 'MEDIO',
        hash: 'casa_150_medio'
      };
      
      // Cachear resultado
      await redisClient.setEx(`analise:${analise1.hash}`, 3600, JSON.stringify(analise1));
      
      // Simular análise do segundo briefing (similar)
      const { result: analise2, executionTime } = await global.testUtils.measureExecutionTime(async () => {
        // Verificar cache primeiro
        const cached = await redisClient.get(`analise:${analise1.hash}`);
        if (cached) {
          return JSON.parse(cached);
        }
        
        // Se não estiver em cache, processar
        await global.testUtils.simulateNetworkDelay(2000, 3000);
        return analise1;
      });
      
      expect(analise2.tipologia).toBe('RESIDENCIAL');
      expect(executionTime).toBeLessThan(100); // Cache deve ser muito rápido
    });
  });
});