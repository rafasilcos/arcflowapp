const { createClient } = require('redis');

// Configuração que roda antes de cada arquivo de teste
beforeAll(async () => {
  // Configurar timeout padrão para testes de integração
  jest.setTimeout(30000);
  
  // Configurar variáveis de ambiente se não estiverem definidas
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
  }
  
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/arcflow_test';
  }
  
  if (!process.env.REDIS_URL) {
    process.env.REDIS_URL = 'redis://localhost:6379/1';
  }
});

// Limpeza após cada teste
afterEach(async () => {
  // Limpar dados específicos do teste no Redis
  const redisClient = createClient({
    url: process.env.REDIS_URL
  });
  
  try {
    await redisClient.connect();
    
    // Remover chaves temporárias de teste
    const keys = await redisClient.keys('test:temp:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    await redisClient.disconnect();
  } catch (error) {
    // Ignorar erros de limpeza
    console.warn('Aviso: Erro na limpeza do Redis:', error.message);
  }
});

// Utilitários globais para testes
global.testUtils = {
  // Gerar ID único para teste
  generateTestId: () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Aguardar um tempo específico
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Obter dados de seed
  getSeedData: async () => {
    const redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    await redisClient.connect();
    const seedDataStr = await redisClient.get('test:seed-data');
    await redisClient.disconnect();
    
    return seedDataStr ? JSON.parse(seedDataStr) : null;
  },
  
  // Criar dados de teste temporários
  createTempData: async (key, data, ttl = 300) => {
    const redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    await redisClient.connect();
    await redisClient.setEx(`test:temp:${key}`, ttl, JSON.stringify(data));
    await redisClient.disconnect();
  },
  
  // Obter dados de teste temporários
  getTempData: async (key) => {
    const redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    await redisClient.connect();
    const dataStr = await redisClient.get(`test:temp:${key}`);
    await redisClient.disconnect();
    
    return dataStr ? JSON.parse(dataStr) : null;
  },
  
  // Simular delay de rede
  simulateNetworkDelay: async (min = 100, max = 500) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await global.testUtils.sleep(delay);
  },
  
  // Validar estrutura de orçamento
  validateOrcamentoStructure: (orcamento) => {
    const requiredFields = [
      'id',
      'briefingId',
      'valorTotal',
      'tipologia',
      'complexidade',
      'horasTotal',
      'disciplinas',
      'createdAt'
    ];
    
    for (const field of requiredFields) {
      if (!(field in orcamento)) {
        throw new Error(`Campo obrigatório ausente no orçamento: ${field}`);
      }
    }
    
    // Validar tipos
    if (typeof orcamento.valorTotal !== 'number' || orcamento.valorTotal <= 0) {
      throw new Error('valorTotal deve ser um número positivo');
    }
    
    if (typeof orcamento.horasTotal !== 'number' || orcamento.horasTotal <= 0) {
      throw new Error('horasTotal deve ser um número positivo');
    }
    
    if (!Array.isArray(orcamento.disciplinas) || orcamento.disciplinas.length === 0) {
      throw new Error('disciplinas deve ser um array não vazio');
    }
    
    return true;
  },
  
  // Validar estrutura de briefing
  validateBriefingStructure: (briefing) => {
    const requiredFields = [
      'id',
      'escritorioId',
      'nome',
      'tipologia',
      'status',
      'respostas'
    ];
    
    for (const field of requiredFields) {
      if (!(field in briefing)) {
        throw new Error(`Campo obrigatório ausente no briefing: ${field}`);
      }
    }
    
    if (typeof briefing.respostas !== 'object' || briefing.respostas === null) {
      throw new Error('respostas deve ser um objeto');
    }
    
    return true;
  },
  
  // Criar mock de usuário para testes
  createMockUser: (escritorioId = 'escritorio-test-1', role = 'ARQUITETO') => ({
    id: global.testUtils.generateTestId(),
    escritorioId,
    nome: 'Usuário Teste',
    email: 'teste@exemplo.com',
    role,
    ativo: true,
    createdAt: new Date()
  }),
  
  // Criar mock de briefing para testes
  createMockBriefing: (escritorioId = 'escritorio-test-1', tipologia = 'RESIDENCIAL') => ({
    id: global.testUtils.generateTestId(),
    escritorioId,
    nome: `Briefing Teste ${tipologia}`,
    tipologia,
    areaConstruida: 150,
    padrao: 'MEDIO',
    status: 'CONCLUIDO',
    respostas: {
      area_construida: '150',
      area_terreno: '300',
      tipologia: tipologia.toLowerCase(),
      padrao_acabamento: 'medio',
      complexidade: 'media'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  
  // Criar mock de configuração de escritório
  createMockEscritorioConfig: (escritorioId = 'escritorio-test-1') => ({
    id: global.testUtils.generateTestId(),
    escritorioId,
    tabelaPrecos: {
      valorHoraArquiteto: 150,
      valorHoraEngenheiro: 120,
      valorHoraDesigner: 80,
      valorHoraTecnico: 60,
      valorHoraEstagiario: 30
    },
    multiplicadores: {
      'RESIDENCIAL': 1.0,
      'COMERCIAL': 1.2,
      'INDUSTRIAL': 1.5,
      'INSTITUCIONAL': 1.3,
      'URBANISTICO': 1.4
    },
    parametrosComplexidade: {
      'BAIXA': 0.8,
      'MEDIA': 1.0,
      'ALTA': 1.3,
      'MUITO_ALTA': 1.6
    },
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  
  // Medir tempo de execução
  measureExecutionTime: async (fn) => {
    const start = Date.now();
    const result = await fn();
    const executionTime = Date.now() - start;
    
    return {
      result,
      executionTime
    };
  },
  
  // Verificar se serviços estão disponíveis
  checkServices: async () => {
    const services = {
      redis: false,
      database: false
    };
    
    // Verificar Redis
    try {
      const redisClient = createClient({
        url: process.env.REDIS_URL
      });
      await redisClient.connect();
      await redisClient.ping();
      await redisClient.disconnect();
      services.redis = true;
    } catch (error) {
      console.warn('Redis não disponível para testes:', error.message);
    }
    
    // Verificar banco de dados (simulado)
    try {
      // Em produção, usar Prisma para verificar conexão
      services.database = true;
    } catch (error) {
      console.warn('Banco de dados não disponível para testes:', error.message);
    }
    
    return services;
  }
};

// Configurar matchers customizados do Jest
expect.extend({
  toBeValidOrcamento(received) {
    try {
      global.testUtils.validateOrcamentoStructure(received);
      return {
        message: () => 'Orçamento válido',
        pass: true
      };
    } catch (error) {
      return {
        message: () => `Orçamento inválido: ${error.message}`,
        pass: false
      };
    }
  },
  
  toBeValidBriefing(received) {
    try {
      global.testUtils.validateBriefingStructure(received);
      return {
        message: () => 'Briefing válido',
        pass: true
      };
    } catch (error) {
      return {
        message: () => `Briefing inválido: ${error.message}`,
        pass: false
      };
    }
  },
  
  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max;
    return {
      message: () => `Esperado ${received} estar entre ${min} e ${max}`,
      pass
    };
  }
});

// Log de início dos testes
console.log('🧪 Configuração de testes carregada');
console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
console.log(`🔗 Database: ${process.env.DATABASE_URL ? 'Configurado' : 'Não configurado'}`);
console.log(`📦 Redis: ${process.env.REDIS_URL ? 'Configurado' : 'Não configurado'}`);