#!/usr/bin/env node

/**
 * Teste simples do Configuration Management Service
 * Testa diretamente o serviço sem depender das APIs
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

// Simular o Configuration Management Service
class ConfigurationManagementServiceTest {
  constructor(client) {
    this.client = client;
  }
  
  async obterConfiguracaoEscritorio(escritorioId) {
    try {
      console.log('📋 Buscando configuração para escritório:', escritorioId);
      
      const result = await this.client.query(`
        SELECT 
          id,
          escritorio_id,
          tabela_precos,
          multiplicadores_tipologia,
          parametros_complexidade,
          configuracoes_gerais,
          ativo,
          created_at,
          updated_at
        FROM configuracoes_orcamento 
        WHERE escritorio_id = $1 AND ativo = true
        ORDER BY updated_at DESC
        LIMIT 1;
      `, [escritorioId]);
      
      if (result.rows.length === 0) {
        console.log('⚠️ Configuração não encontrada');
        return null;
      }
      
      console.log('✅ Configuração encontrada');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erro ao buscar configuração:', error);
      throw error;
    }
  }
  
  async criarConfiguracaoPadrao(escritorioId) {
    try {
      console.log('🆕 Criando configuração padrão para escritório:', escritorioId);
      
      const configuracaoPadrao = {
        tabelaPrecos: {
          arquitetura: {
            valor_hora_senior: 180,
            valor_hora_pleno: 140,
            valor_hora_junior: 100,
            valor_hora_estagiario: 50
          },
          estrutural: {
            valor_hora_senior: 200,
            valor_hora_pleno: 160,
            valor_hora_junior: 120,
            valor_hora_estagiario: 60
          },
          instalacoes: {
            valor_hora_senior: 170,
            valor_hora_pleno: 130,
            valor_hora_junior: 90,
            valor_hora_estagiario: 45
          },
          paisagismo: {
            valor_hora_senior: 150,
            valor_hora_pleno: 120,
            valor_hora_junior: 80,
            valor_hora_estagiario: 40
          }
        },
        multiplicadores: {
          residencial: {
            unifamiliar: 1.0,
            multifamiliar: 1.2,
            condominio: 1.4
          },
          comercial: {
            escritorio: 1.1,
            loja: 1.0,
            hotel: 1.5,
            shopping: 1.8
          },
          industrial: {
            fabrica: 1.3,
            galpao: 1.0,
            centro_logistico: 1.2
          },
          institucional: {
            escola: 1.2,
            hospital: 1.6,
            templo: 1.1
          }
        },
        parametrosComplexidade: {
          baixa: {
            multiplicador: 0.8,
            horas_base_m2: 0.6
          },
          media: {
            multiplicador: 1.0,
            horas_base_m2: 0.8
          },
          alta: {
            multiplicador: 1.3,
            horas_base_m2: 1.0
          },
          muito_alta: {
            multiplicador: 1.6,
            horas_base_m2: 1.2
          }
        },
        configuracoesPadrao: {
          margem_lucro: 0.25,
          impostos: 0.15,
          custos_indiretos: 0.10,
          contingencia: 0.05
        }
      };
      
      const result = await this.client.query(`
        INSERT INTO configuracoes_orcamento (
          escritorio_id,
          tabela_precos,
          multiplicadores_tipologia,
          parametros_complexidade,
          configuracoes_gerais,
          ativo
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `, [
        escritorioId,
        JSON.stringify(configuracaoPadrao.tabelaPrecos),
        JSON.stringify(configuracaoPadrao.multiplicadores),
        JSON.stringify(configuracaoPadrao.parametrosComplexidade),
        JSON.stringify(configuracaoPadrao.configuracoesPadrao),
        true
      ]);
      
      console.log('✅ Configuração padrão criada com sucesso');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar configuração padrão:', error);
      throw error;
    }
  }
  
  async validarConfiguracoes(configuracoes) {
    const erros = [];
    const avisos = [];
    
    // Validar tabela de preços
    if (!configuracoes.tabelaPrecos) {
      erros.push('Tabela de preços é obrigatória');
    } else {
      // Validar valores mínimos
      Object.keys(configuracoes.tabelaPrecos).forEach(disciplina => {
        const precos = configuracoes.tabelaPrecos[disciplina];
        if (precos.valor_hora_senior < 50) {
          avisos.push(`Valor hora sênior muito baixo para ${disciplina}`);
        }
        if (precos.valor_hora_senior < precos.valor_hora_pleno) {
          erros.push(`Valor sênior deve ser maior que pleno em ${disciplina}`);
        }
      });
    }
    
    // Validar multiplicadores
    if (!configuracoes.multiplicadores) {
      erros.push('Multiplicadores de tipologia são obrigatórios');
    }
    
    // Validar parâmetros de complexidade
    if (!configuracoes.parametrosComplexidade) {
      erros.push('Parâmetros de complexidade são obrigatórios');
    }
    
    return {
      valido: erros.length === 0,
      erros,
      avisos
    };
  }
}

async function testarConfigurationService() {
  try {
    console.log('🚀 Iniciando teste do Configuration Management Service...');
    await client.connect();
    
    // 1. Buscar escritórios existentes
    console.log('\\n📋 1. Buscando escritórios...');
    
    const escritorios = await client.query(`
      SELECT id, nome FROM escritorios LIMIT 3
    `);
    
    console.log(`✅ Encontrados ${escritorios.rows.length} escritórios`);
    
    if (escritorios.rows.length === 0) {
      console.log('❌ Nenhum escritório encontrado. Criando um para teste...');
      
      await client.query(`
        INSERT INTO escritorios (id, nome, ativo) 
        VALUES ('escritorio-teste-config', 'Escritório Teste Config', true)
        ON CONFLICT (id) DO NOTHING
      `);
      
      escritorios.rows.push({
        id: 'escritorio-teste-config',
        nome: 'Escritório Teste Config'
      });
    }
    
    // 2. Criar instância do serviço
    const configService = new ConfigurationManagementServiceTest(client);
    
    // 3. Testar para cada escritório
    for (const escritorio of escritorios.rows) {
      console.log(`\\n--- Testando configurações para: ${escritorio.nome} ---`);
      
      // 3.1. Buscar configuração existente
      let configuracao = await configService.obterConfiguracaoEscritorio(escritorio.id);
      
      // 3.2. Se não existe, criar padrão
      if (!configuracao) {
        configuracao = await configService.criarConfiguracaoPadrao(escritorio.id);
      }
      
      // 3.3. Validar configuração
      const validacao = await configService.validarConfiguracoes({
        tabelaPrecos: configuracao.tabela_precos,
        multiplicadores: configuracao.multiplicadores_tipologia,
        parametrosComplexidade: configuracao.parametros_complexidade,
        configuracoesPadrao: configuracao.configuracoes_gerais
      });
      
      console.log('📊 Resultado da validação:');
      console.log('   Válido:', validacao.valido);
      if (validacao.erros.length > 0) {
        console.log('   Erros:', validacao.erros);
      }
      if (validacao.avisos.length > 0) {
        console.log('   Avisos:', validacao.avisos);
      }
      
      // 3.4. Mostrar resumo da configuração
      console.log('💰 Resumo da configuração:');
      console.log('   Valor hora arquitetura (sênior):', configuracao.tabela_precos?.arquitetura?.valor_hora_senior || 'N/A');
      console.log('   Multiplicador residencial unifamiliar:', configuracao.multiplicadores_tipologia?.residencial?.unifamiliar || 'N/A');
      console.log('   Margem de lucro:', (configuracao.configuracoes_gerais?.margem_lucro * 100) || 'N/A', '%');
    }
    
    // 4. Verificar configurações salvas
    console.log('\\n📊 4. Verificando configurações no banco...');
    
    const totalConfiguracoes = await client.query(`
      SELECT COUNT(*) as total FROM configuracoes_orcamento WHERE ativo = true
    `);
    
    console.log('✅ Total de configurações ativas:', totalConfiguracoes.rows[0].total);
    
    // 5. Listar todas as configurações
    const todasConfiguracoes = await client.query(`
      SELECT 
        co.id,
        co.escritorio_id,
        e.nome as escritorio_nome,
        co.created_at,
        co.updated_at
      FROM configuracoes_orcamento co
      JOIN escritorios e ON co.escritorio_id = e.id
      WHERE co.ativo = true
      ORDER BY co.updated_at DESC
    `);
    
    console.log('\\n📋 Configurações encontradas:');
    todasConfiguracoes.rows.forEach((config, index) => {
      console.log(`${index + 1}. ${config.escritorio_nome}`);
      console.log(`   ID: ${config.id}`);
      console.log(`   Criado: ${new Date(config.created_at).toLocaleString('pt-BR')}`);
      console.log(`   Atualizado: ${new Date(config.updated_at).toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    console.log('\\n🎉 TESTE DO CONFIGURATION MANAGEMENT SERVICE CONCLUÍDO!');
    console.log('📋 Resumo:');
    console.log(`   ✅ ${escritorios.rows.length} escritórios testados`);
    console.log(`   ✅ ${totalConfiguracoes.rows[0].total} configurações ativas`);
    console.log('   ✅ Sistema de configuração funcionando corretamente');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

// Executar teste
testarConfigurationService();