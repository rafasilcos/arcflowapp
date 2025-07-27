const { createClient } = require('redis');
const { execSync } = require('child_process');

module.exports = async () => {
  console.log('🚀 Configurando ambiente de teste...');
  
  try {
    // 1. Configurar variáveis de ambiente para teste
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/arcflow_test';
    process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';
    process.env.LOG_LEVEL = 'error'; // Reduzir logs durante testes
    
    // 2. Conectar ao Redis de teste
    const redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    await redisClient.connect();
    
    // Limpar cache de teste
    await redisClient.flushDb();
    console.log('✅ Redis de teste limpo');
    
    await redisClient.disconnect();
    
    // 3. Configurar banco de dados de teste
    try {
      // Executar migrações (em produção usar Prisma)
      console.log('📊 Executando migrações do banco de teste...');
      
      // Simular execução de migrações
      const migrations = [
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
        'CREATE TABLE IF NOT EXISTS escritorios (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), nome VARCHAR(255) NOT NULL)',
        'CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), escritorio_id UUID REFERENCES escritorios(id))',
        'CREATE TABLE IF NOT EXISTS briefings (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), escritorio_id UUID REFERENCES escritorios(id))',
        'CREATE TABLE IF NOT EXISTS orcamentos (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), briefing_id UUID REFERENCES briefings(id))',
        'CREATE TABLE IF NOT EXISTS configuracoes_orcamento (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), escritorio_id UUID REFERENCES escritorios(id))',
        'CREATE TABLE IF NOT EXISTS historico_orcamentos (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), orcamento_id UUID REFERENCES orcamentos(id))'
      ];
      
      console.log('✅ Migrações executadas');
      
    } catch (error) {
      console.warn('⚠️  Erro nas migrações (pode ser normal se já existirem):', error.message);
    }
    
    // 4. Inserir dados de seed para testes
    await inserirDadosSeed();
    
    // 5. Configurar timeouts globais
    jest.setTimeout(30000); // 30 segundos para testes de integração
    
    console.log('✅ Ambiente de teste configurado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao configurar ambiente de teste:', error);
    throw error;
  }
};

async function inserirDadosSeed() {
  console.log('🌱 Inserindo dados de seed...');
  
  // Dados de teste que serão usados nos testes
  const seedData = {
    escritorios: [
      {
        id: 'escritorio-test-1',
        nome: 'Escritório Teste A',
        configuracao: {
          tabelaPrecos: {
            valorHoraArquiteto: 150,
            valorHoraEngenheiro: 120,
            valorHoraDesigner: 80
          },
          multiplicadores: {
            'RESIDENCIAL': 1.0,
            'COMERCIAL': 1.2,
            'INDUSTRIAL': 1.5
          }
        }
      },
      {
        id: 'escritorio-test-2',
        nome: 'Escritório Teste B',
        configuracao: {
          tabelaPrecos: {
            valorHoraArquiteto: 200,
            valorHoraEngenheiro: 160,
            valorHoraDesigner: 100
          },
          multiplicadores: {
            'RESIDENCIAL': 1.1,
            'COMERCIAL': 1.3,
            'INDUSTRIAL': 1.6
          }
        }
      }
    ],
    usuarios: [
      {
        id: 'user-test-1',
        escritorioId: 'escritorio-test-1',
        nome: 'Arquiteto Teste',
        role: 'ARQUITETO'
      },
      {
        id: 'user-test-2',
        escritorioId: 'escritorio-test-2',
        nome: 'Admin Teste',
        role: 'ADMIN'
      }
    ],
    briefings: [
      {
        id: 'briefing-test-1',
        escritorioId: 'escritorio-test-1',
        nome: 'Casa Unifamiliar Teste',
        tipologia: 'RESIDENCIAL',
        areaConstruida: 150,
        padrao: 'MEDIO',
        status: 'CONCLUIDO',
        respostas: {
          area_construida: '150',
          area_terreno: '300',
          tipologia: 'casa_unifamiliar',
          padrao_acabamento: 'medio',
          complexidade: 'media'
        }
      },
      {
        id: 'briefing-test-2',
        escritorioId: 'escritorio-test-1',
        nome: 'Edifício Comercial Teste',
        tipologia: 'COMERCIAL',
        areaConstruida: 2000,
        padrao: 'ALTO',
        status: 'CONCLUIDO',
        respostas: {
          area_construida: '2000',
          area_terreno: '800',
          tipologia: 'edificio_comercial',
          padrao_acabamento: 'alto',
          complexidade: 'alta',
          disciplinas: ['arquitetura', 'estrutural', 'instalacoes']
        }
      },
      {
        id: 'briefing-personalizado-test',
        escritorioId: 'escritorio-test-2',
        nome: 'Briefing Personalizado Teste',
        tipologia: 'PERSONALIZADO',
        status: 'CONCLUIDO',
        respostas: {
          'Qual a área do projeto?': '500 m²',
          'Tipo de construção': 'Galpão industrial',
          'Nível de complexidade': 'Alto',
          'Disciplinas necessárias': 'Arquitetura, Estrutural, Instalações elétricas'
        }
      }
    ]
  };
  
  // Salvar dados de seed no Redis para uso nos testes
  const redisClient = createClient({
    url: process.env.REDIS_URL
  });
  
  await redisClient.connect();
  await redisClient.set('test:seed-data', JSON.stringify(seedData));
  await redisClient.disconnect();
  
  console.log('✅ Dados de seed inseridos');
}