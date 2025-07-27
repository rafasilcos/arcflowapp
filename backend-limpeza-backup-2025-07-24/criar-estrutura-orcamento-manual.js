#!/usr/bin/env node

/**
 * Script para criar estrutura de orçamento manualmente
 * Baseado nos scripts que já funcionam no sistema
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function criarEstruturaOrcamento() {
  try {
    console.log('🚀 Conectando ao Supabase...');
    await client.connect();
    
    console.log('✅ Conectado! Criando estrutura de orçamento...');
    
    // 1. Adicionar colunas na tabela briefings
    console.log('📝 1. Adicionando colunas na tabela briefings...');
    
    const alterBriefings = `
      ALTER TABLE briefings 
      ADD COLUMN IF NOT EXISTS orcamento_gerado BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS orcamento_id UUID,
      ADD COLUMN IF NOT EXISTS dados_extraidos JSONB,
      ADD COLUMN IF NOT EXISTS ultima_analise TIMESTAMP,
      ADD COLUMN IF NOT EXISTS complexidade_calculada VARCHAR(20),
      ADD COLUMN IF NOT EXISTS disciplinas_identificadas TEXT[];
    `;
    
    await client.query(alterBriefings);
    console.log('✅ Colunas adicionadas em briefings');
    
    // 2. Criar tabela de orçamentos
    console.log('📝 2. Criando tabela de orçamentos...');
    
    const createOrcamentos = `
      CREATE TABLE IF NOT EXISTS orcamentos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo VARCHAR(50) UNIQUE NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        status VARCHAR(50) DEFAULT 'RASCUNHO',
        
        -- Dados técnicos extraídos do briefing
        area_construida DECIMAL(10,2),
        area_terreno DECIMAL(10,2),
        tipologia VARCHAR(100),
        padrao VARCHAR(100),
        complexidade VARCHAR(100),
        localizacao VARCHAR(255),
        
        -- Valores calculados
        valor_total DECIMAL(15,2),
        valor_por_m2 DECIMAL(10,2),
        
        -- Estruturas JSON para dados complexos
        disciplinas JSONB,
        composicao_financeira JSONB,
        cronograma JSONB,
        proposta JSONB,
        dados_tecnicos JSONB,
        
        -- Relacionamentos
        briefing_id UUID,
        cliente_id UUID,
        escritorio_id UUID NOT NULL,
        responsavel_id UUID,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      );
    `;
    
    await client.query(createOrcamentos);
    console.log('✅ Tabela orcamentos criada');
    
    // 3. Criar tabela de configurações
    console.log('📝 3. Criando tabela de configurações de orçamento...');
    
    const createConfiguracoes = `
      CREATE TABLE IF NOT EXISTS configuracoes_orcamento (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        escritorio_id UUID NOT NULL,
        
        -- Tabela de preços por disciplina
        tabela_precos JSONB NOT NULL DEFAULT '{
          "arquitetura": {
            "valor_hora_senior": 180,
            "valor_hora_pleno": 120,
            "valor_hora_junior": 80,
            "valor_hora_estagiario": 40
          },
          "estrutural": {
            "valor_hora_senior": 200,
            "valor_hora_pleno": 140,
            "valor_hora_junior": 90,
            "valor_hora_estagiario": 45
          },
          "instalacoes": {
            "valor_hora_senior": 160,
            "valor_hora_pleno": 110,
            "valor_hora_junior": 70,
            "valor_hora_estagiario": 35
          },
          "paisagismo": {
            "valor_hora_senior": 150,
            "valor_hora_pleno": 100,
            "valor_hora_junior": 65,
            "valor_hora_estagiario": 30
          }
        }',
        
        -- Multiplicadores por tipologia
        multiplicadores_tipologia JSONB NOT NULL DEFAULT '{
          "residencial": {
            "unifamiliar": 1.0,
            "multifamiliar": 1.2,
            "condominio": 1.3
          },
          "comercial": {
            "escritorio": 1.1,
            "loja": 1.0,
            "shopping": 1.5,
            "hotel": 1.4
          },
          "industrial": {
            "fabrica": 1.3,
            "galpao": 1.1,
            "centro_logistico": 1.2
          },
          "institucional": {
            "escola": 1.2,
            "hospital": 1.6,
            "templo": 1.1
          }
        }',
        
        -- Parâmetros de complexidade
        parametros_complexidade JSONB NOT NULL DEFAULT '{
          "baixa": {
            "multiplicador": 0.8,
            "horas_base_m2": 0.5
          },
          "media": {
            "multiplicador": 1.0,
            "horas_base_m2": 0.8
          },
          "alta": {
            "multiplicador": 1.3,
            "horas_base_m2": 1.2
          },
          "muito_alta": {
            "multiplicador": 1.6,
            "horas_base_m2": 1.8
          }
        }',
        
        -- Configurações gerais
        configuracoes_gerais JSONB DEFAULT '{
          "margem_lucro": 0.25,
          "impostos": 0.15,
          "custos_indiretos": 0.10,
          "contingencia": 0.05
        }',
        
        -- Status e controle
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        
        -- Constraint única por escritório
        UNIQUE(escritorio_id)
      );
    `;
    
    await client.query(createConfiguracoes);
    console.log('✅ Tabela configuracoes_orcamento criada');
    
    // 4. Criar tabela de histórico
    console.log('📝 4. Criando tabela de histórico de orçamentos...');
    
    const createHistorico = `
      CREATE TABLE IF NOT EXISTS historico_orcamentos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        orcamento_id UUID NOT NULL,
        briefing_id UUID NOT NULL,
        versao INTEGER NOT NULL,
        
        -- Dados da versão
        dados_versao JSONB NOT NULL,
        valores_anteriores JSONB,
        alteracoes JSONB,
        
        -- Motivo e contexto
        motivo_alteracao TEXT,
        tipo_alteracao VARCHAR(50),
        
        -- Auditoria
        created_at TIMESTAMP DEFAULT NOW(),
        created_by UUID
      );
    `;
    
    await client.query(createHistorico);
    console.log('✅ Tabela historico_orcamentos criada');
    
    // 5. Criar índices importantes
    console.log('📝 5. Criando índices de performance...');
    
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_briefings_orcamento_status ON briefings(orcamento_gerado, status);',
      'CREATE INDEX IF NOT EXISTS idx_briefings_ultima_analise ON briefings(ultima_analise);',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_briefing_id ON orcamentos(briefing_id);',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_escritorio_status ON orcamentos(escritorio_id, status);',
      'CREATE INDEX IF NOT EXISTS idx_config_orcamento_escritorio ON configuracoes_orcamento(escritorio_id, ativo);',
      'CREATE INDEX IF NOT EXISTS idx_historico_orcamento_id ON historico_orcamentos(orcamento_id);'
    ];
    
    for (const indice of indices) {
      await client.query(indice);
    }
    console.log('✅ Índices criados');
    
    // 6. Inserir configurações padrão para escritórios existentes
    console.log('📝 6. Inserindo configurações padrão...');
    
    const insertConfigs = `
      INSERT INTO configuracoes_orcamento (escritorio_id)
      SELECT id FROM escritorios 
      WHERE id NOT IN (SELECT escritorio_id FROM configuracoes_orcamento WHERE escritorio_id IS NOT NULL)
      ON CONFLICT (escritorio_id) DO NOTHING;
    `;
    
    const result = await client.query(insertConfigs);
    console.log(`✅ Configurações inseridas para escritórios`);
    
    // 7. Verificar estruturas criadas
    console.log('\n🔍 Verificando estruturas criadas...');
    
    // Verificar colunas em briefings
    const briefingCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('orcamento_gerado', 'orcamento_id', 'dados_extraidos', 'ultima_analise')
      ORDER BY column_name;
    `);
    console.log('✅ Colunas em briefings:', briefingCols.rows);
    
    // Verificar tabelas criadas
    const tabelas = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('orcamentos', 'configuracoes_orcamento', 'historico_orcamentos')
      ORDER BY table_name;
    `);
    console.log('✅ Tabelas criadas:', tabelas.rows);
    
    // Verificar configurações inseridas
    const configs = await client.query(`
      SELECT COUNT(*) as total_configuracoes 
      FROM configuracoes_orcamento;
    `);
    console.log('✅ Configurações inseridas:', configs.rows[0]);
    
    // Verificar escritórios
    const escritorios = await client.query(`
      SELECT COUNT(*) as total_escritorios 
      FROM escritorios;
    `);
    console.log('✅ Escritórios existentes:', escritorios.rows[0]);
    
    console.log('\n🎉 ESTRUTURA DE ORÇAMENTO CRIADA COM SUCESSO!');
    console.log('📋 Resumo do que foi criado:');
    console.log('   ✅ Colunas adicionadas na tabela briefings');
    console.log('   ✅ Tabela orcamentos');
    console.log('   ✅ Tabela configuracoes_orcamento');
    console.log('   ✅ Tabela historico_orcamentos');
    console.log('   ✅ Índices de performance');
    console.log('   ✅ Configurações padrão inseridas');
    
    console.log('\n📋 Próximos passos:');
    console.log('   1. ✅ Estrutura de banco configurada');
    console.log('   2. 🔄 Implementar Briefing Analysis Engine');
    console.log('   3. 🔄 Criar APIs de configuração de orçamento');
    console.log('   4. 🔄 Desenvolver sistema de triggers automáticos');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

// Executar
criarEstruturaOrcamento();