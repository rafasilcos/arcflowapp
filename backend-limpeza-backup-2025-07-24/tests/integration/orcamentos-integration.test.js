/**
 * TESTES DE INTEGRAÇÃO - SISTEMA DE ORÇAMENTOS ARCFLOW
 * 
 * Testa o fluxo completo de geração de orçamentos
 * Valida integração entre briefing, análise de complexidade e precificação
 */

const request = require('supertest');
const { Pool } = require('pg');

// Mock do app Express
const express = require('express');
const app = express();
app.use(express.json());

// Mock das rotas
app.use('/api/orcamentos', require('../../src/routes/orcamentos'));

// Configuração do banco de teste
const pool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

describe('Integração - Sistema de Orçamentos', () => {
  let authToken;
  let testBriefingId;
  let testClienteId;

  beforeAll(async () => {
    // Setup inicial - criar dados de teste
    await setupTestData();
    
    // Simular token de autenticação
    authToken = 'test-token-123';
  });

  afterAll(async () => {
    // Limpeza após testes
    await cleanupTestData();
    await pool.end();
  });

  describe('Geração de Orçamentos End-to-End', () => {
    test('deve gerar orçamento para casa simples com valores realistas', async () => {
      const briefingData = {
        cliente_id: testClienteId,
        tipologia: 'RESIDENCIAL',
        nome_projeto: 'Casa Simples Teste',
        area_construida: 120,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'casa térrea',
            'terreno': 'plano',
            'acabamento': 'simples',
            'piscina': 'não'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA'],
          caracteristicasEspeciais: [],
          localizacao: 'INTERIOR'
        }
      };

      // 1. Criar briefing
      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingData);

      expect(briefingResponse.status).toBe(201);
      const briefingId = briefingResponse.body.id;

      // 2. Gerar orçamento
      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      
      const orcamento = orcamentoResponse.body;
      
      // Validações específicas para casa simples 120m²
      expect(orcamento.valor_total).toBeGreaterThanOrEqual(9600);
      expect(orcamento.valor_total).toBeLessThanOrEqual(18000);
      expect(orcamento.valor_por_m2).toBeGreaterThanOrEqual(80);
      expect(orcamento.valor_por_m2).toBeLessThanOrEqual(150);
      
      // Validar estrutura da resposta
      expect(orcamento).toHaveProperty('id');
      expect(orcamento).toHaveProperty('briefing_id');
      expect(orcamento).toHaveProperty('valor_total');
      expect(orcamento).toHaveProperty('valor_por_m2');
      expect(orcamento).toHaveProperty('detalhamento');
      expect(orcamento).toHaveProperty('complexidade_aplicada');
    });

    test('deve gerar orçamento para apartamento médio com múltiplas disciplinas', async () => {
      const briefingData = {
        cliente_id: testClienteId,
        tipologia: 'RESIDENCIAL',
        nome_projeto: 'Apartamento Médio Teste',
        area_construida: 200,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'apartamento',
            'pavimentos': '1',
            'acabamento': 'médio padrão',
            'elevador': 'não'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL'],
          caracteristicasEspeciais: [],
          localizacao: 'CAPITAL'
        }
      };

      // 1. Criar briefing
      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingData);

      expect(briefingResponse.status).toBe(201);
      const briefingId = briefingResponse.body.id;

      // 2. Gerar orçamento
      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      
      const orcamento = orcamentoResponse.body;
      
      // Validações para apartamento médio 200m²
      expect(orcamento.valor_total).toBeGreaterThanOrEqual(30000);
      expect(orcamento.valor_total).toBeLessThanOrEqual(50000);
      expect(orcamento.valor_por_m2).toBeGreaterThanOrEqual(150);
      expect(orcamento.valor_por_m2).toBeLessThanOrEqual(250);
      
      // Validar que inclui múltiplas disciplinas
      expect(orcamento.detalhamento).toHaveProperty('ARQUITETURA');
      expect(orcamento.detalhamento).toHaveProperty('ESTRUTURAL');
      
      // Cada disciplina deve ter valor > 0
      expect(orcamento.detalhamento.ARQUITETURA).toBeGreaterThan(0);
      expect(orcamento.detalhamento.ESTRUTURAL).toBeGreaterThan(0);
    });

    test('deve gerar orçamento para sobrado complexo com características especiais', async () => {
      const briefingData = {
        cliente_id: testClienteId,
        tipologia: 'RESIDENCIAL',
        nome_projeto: 'Sobrado Luxo Teste',
        area_construida: 350,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'sobrado',
            'pavimentos': '3',
            'piscina': 'sim, aquecida',
            'elevador': 'sim',
            'automacao': 'completa',
            'acabamento': 'alto padrão'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'],
          caracteristicasEspeciais: ['piscina', 'elevador', 'automação'],
          localizacao: 'CAPITAL'
        }
      };

      // 1. Criar briefing
      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingData);

      expect(briefingResponse.status).toBe(201);
      const briefingId = briefingResponse.body.id;

      // 2. Gerar orçamento
      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      
      const orcamento = orcamentoResponse.body;
      
      // Validações para sobrado luxo 350m²
      expect(orcamento.valor_total).toBeGreaterThanOrEqual(87500);
      expect(orcamento.valor_total).toBeLessThanOrEqual(140000);
      expect(orcamento.valor_por_m2).toBeGreaterThanOrEqual(250);
      expect(orcamento.valor_por_m2).toBeLessThanOrEqual(400);
      
      // Deve ser classificado como COMPLEXO
      expect(orcamento.complexidade_aplicada).toBe('COMPLEXO');
      
      // Validar todas as disciplinas
      expect(orcamento.detalhamento).toHaveProperty('ARQUITETURA');
      expect(orcamento.detalhamento).toHaveProperty('ESTRUTURAL');
      expect(orcamento.detalhamento).toHaveProperty('INSTALACOES');
    });

    test('deve gerar orçamento para projeto comercial', async () => {
      const briefingData = {
        cliente_id: testClienteId,
        tipologia: 'COMERCIAL',
        nome_projeto: 'Escritório Comercial Teste',
        area_construida: 300,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'escritório',
            'ocupantes': '50',
            'fachada': 'simples',
            'espacos_especiais': 'não'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA', 'INSTALACOES'],
          caracteristicasEspeciais: [],
          localizacao: 'CAPITAL'
        }
      };

      // 1. Criar briefing
      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingData);

      expect(briefingResponse.status).toBe(201);
      const briefingId = briefingResponse.body.id;

      // 2. Gerar orçamento
      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      
      const orcamento = orcamentoResponse.body;
      
      // Validações para escritório comercial 300m²
      expect(orcamento.valor_total).toBeGreaterThanOrEqual(45000);
      expect(orcamento.valor_total).toBeLessThanOrEqual(90000);
      expect(orcamento.valor_por_m2).toBeGreaterThanOrEqual(150);
      expect(orcamento.valor_por_m2).toBeLessThanOrEqual(300);
      
      // Tipologia deve estar correta
      expect(orcamento.tipologia).toBe('COMERCIAL');
    });

    test('deve gerar orçamento para projeto industrial', async () => {
      const briefingData = {
        cliente_id: testClienteId,
        tipologia: 'INDUSTRIAL',
        nome_projeto: 'Galpão Industrial Teste',
        area_construida: 1000,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'galpão',
            'pe_direito': '8 metros',
            'ponte_rolante': 'não',
            'maquinario_pesado': 'não'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL'],
          caracteristicasEspeciais: [],
          localizacao: 'INTERIOR'
        }
      };

      // 1. Criar briefing
      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingData);

      expect(briefingResponse.status).toBe(201);
      const briefingId = briefingResponse.body.id;

      // 2. Gerar orçamento
      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      
      const orcamento = orcamentoResponse.body;
      
      // Validações para galpão industrial 1000m²
      expect(orcamento.valor_total).toBeGreaterThanOrEqual(60000);
      expect(orcamento.valor_total).toBeLessThanOrEqual(120000);
      expect(orcamento.valor_por_m2).toBeGreaterThanOrEqual(60);
      expect(orcamento.valor_por_m2).toBeLessThanOrEqual(120);
      
      // Tipologia deve estar correta
      expect(orcamento.tipologia).toBe('INDUSTRIAL');
    });
  });

  describe('Validação de Orçamentos', () => {
    test('deve rejeitar orçamento com valores muito baixos', async () => {
      const orcamentoInvalido = {
        briefing_id: testBriefingId,
        valor_total: 1000, // Muito baixo
        area_construida: 150,
        tipologia: 'RESIDENCIAL'
      };

      const response = await request(app)
        .post('/api/orcamentos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orcamentoInvalido);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALOR_MUITO_BAIXO');
    });

    test('deve rejeitar orçamento com valores muito altos', async () => {
      const orcamentoInvalido = {
        briefing_id: testBriefingId,
        valor_total: 150000, // R$ 1.000/m² - muito alto
        area_construida: 150,
        tipologia: 'RESIDENCIAL'
      };

      const response = await request(app)
        .post('/api/orcamentos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orcamentoInvalido);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALOR_MUITO_ALTO');
    });

    test('deve aceitar orçamento com valores dentro da faixa', async () => {
      const orcamentoValido = {
        briefing_id: testBriefingId,
        valor_total: 30000, // R$ 200/m² - dentro da faixa
        area_construida: 150,
        tipologia: 'RESIDENCIAL'
      };

      const response = await request(app)
        .post('/api/orcamentos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orcamentoValido);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Análise de Complexidade Integrada', () => {
    test('deve classificar projeto simples corretamente', async () => {
      const briefingSimples = {
        cliente_id: testClienteId,
        tipologia: 'RESIDENCIAL',
        nome_projeto: 'Casa Simples Análise',
        area_construida: 100,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'casa térrea',
            'terreno': 'plano',
            'acabamento': 'básico',
            'piscina': 'não',
            'elevador': 'não'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA'],
          caracteristicasEspeciais: [],
          localizacao: 'INTERIOR'
        }
      };

      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingSimples);

      const briefingId = briefingResponse.body.id;

      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      expect(orcamentoResponse.body.complexidade_aplicada).toBe('SIMPLES');
    });

    test('deve classificar projeto complexo corretamente', async () => {
      const briefingComplexo = {
        cliente_id: testClienteId,
        tipologia: 'RESIDENCIAL',
        nome_projeto: 'Casa Complexa Análise',
        area_construida: 500,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'sobrado',
            'terreno': 'irregular com desnível',
            'acabamento': 'alto padrão',
            'piscina': 'sim, aquecida',
            'elevador': 'sim',
            'automacao': 'completa',
            'pavimentos': '4'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'],
          caracteristicasEspeciais: ['piscina', 'elevador', 'automação', 'terreno irregular'],
          localizacao: 'CAPITAL'
        }
      };

      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingComplexo);

      const briefingId = briefingResponse.body.id;

      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(orcamentoResponse.status).toBe(200);
      expect(orcamentoResponse.body.complexidade_aplicada).toBe('COMPLEXO');
    });
  });

  describe('Performance e Escalabilidade', () => {
    test('deve gerar orçamento em menos de 2 segundos', async () => {
      const briefingData = {
        cliente_id: testClienteId,
        tipologia: 'RESIDENCIAL',
        nome_projeto: 'Teste Performance',
        area_construida: 200,
        observacoes: JSON.stringify({
          respostas: {
            'tipo_construcao': 'casa',
            'acabamento': 'médio'
          }
        }),
        dados_extraidos: {
          disciplinasNecessarias: ['ARQUITETURA'],
          caracteristicasEspeciais: [],
          localizacao: 'INTERIOR'
        }
      };

      const briefingResponse = await request(app)
        .post('/api/briefings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(briefingData);

      const briefingId = briefingResponse.body.id;

      const startTime = Date.now();
      
      const orcamentoResponse = await request(app)
        .post(`/api/orcamentos/gerar/${briefingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(orcamentoResponse.status).toBe(200);
      expect(executionTime).toBeLessThan(2000); // Menos de 2 segundos
    });

    test('deve lidar com múltiplas requisições simultâneas', async () => {
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        const briefingData = {
          cliente_id: testClienteId,
          tipologia: 'RESIDENCIAL',
          nome_projeto: `Teste Concorrência ${i}`,
          area_construida: 150 + (i * 10),
          observacoes: JSON.stringify({
            respostas: {
              'tipo_construcao': 'casa',
              'acabamento': 'médio'
            }
          }),
          dados_extraidos: {
            disciplinasNecessarias: ['ARQUITETURA'],
            caracteristicasEspeciais: [],
            localizacao: 'INTERIOR'
          }
        };

        const promise = request(app)
          .post('/api/briefings')
          .set('Authorization', `Bearer ${authToken}`)
          .send(briefingData)
          .then(briefingResponse => {
            return request(app)
              .post(`/api/orcamentos/gerar/${briefingResponse.body.id}`)
              .set('Authorization', `Bearer ${authToken}`);
          });

        promises.push(promise);
      }

      const results = await Promise.all(promises);
      
      // Todos devem ter sucesso
      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('valor_total');
      });
    });
  });

  // Funções auxiliares
  async function setupTestData() {
    try {
      // Criar cliente de teste
      const clienteResult = await pool.query(`
        INSERT INTO clientes (nome, email, telefone, escritorio_id)
        VALUES ('Cliente Teste', 'teste@teste.com', '11999999999', 1)
        RETURNING id
      `);
      testClienteId = clienteResult.rows[0].id;

      // Criar briefing de teste
      const briefingResult = await pool.query(`
        INSERT INTO briefings (cliente_id, tipologia, nome_projeto, area_construida)
        VALUES ($1, 'RESIDENCIAL', 'Briefing Teste', 150)
        RETURNING id
      `, [testClienteId]);
      testBriefingId = briefingResult.rows[0].id;

      // Criar dados de precificação se não existirem
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pricing_base (
          id SERIAL PRIMARY KEY,
          tipologia VARCHAR(50) NOT NULL,
          disciplina VARCHAR(50) NOT NULL,
          complexidade VARCHAR(20) NOT NULL,
          price_min DECIMAL(10,2) NOT NULL,
          price_max DECIMAL(10,2) NOT NULL,
          price_average DECIMAL(10,2) NOT NULL,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Inserir dados básicos de precificação
      const pricingData = [
        ['RESIDENCIAL', 'ARQUITETURA', 'SIMPLES', 80, 150, 115],
        ['RESIDENCIAL', 'ARQUITETURA', 'MEDIO', 120, 200, 160],
        ['RESIDENCIAL', 'ARQUITETURA', 'COMPLEXO', 180, 300, 240],
        ['COMERCIAL', 'ARQUITETURA', 'MEDIO', 140, 220, 180],
        ['INDUSTRIAL', 'ARQUITETURA', 'MEDIO', 60, 100, 80]
      ];

      for (const data of pricingData) {
        await pool.query(`
          INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, data);
      }

    } catch (error) {
      console.log('Erro no setup de teste:', error.message);
    }
  }

  async function cleanupTestData() {
    try {
      // Limpar dados de teste
      if (testBriefingId) {
        await pool.query('DELETE FROM orcamentos WHERE briefing_id = $1', [testBriefingId]);
        await pool.query('DELETE FROM briefings WHERE id = $1', [testBriefingId]);
      }
      
      if (testClienteId) {
        await pool.query('DELETE FROM clientes WHERE id = $1', [testClienteId]);
      }
    } catch (error) {
      console.log('Erro na limpeza de teste:', error.message);
    }
  }
});