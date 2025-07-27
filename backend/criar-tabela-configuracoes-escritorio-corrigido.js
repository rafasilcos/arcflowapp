/**
 * 🏢 SCRIPT PARA CRIAR TABELA DE CONFIGURAÇÕES POR ESCRITÓRIO
 * Sistema multi-tenant com configurações independentes e seguras
 */

const { connectDatabase, query } = require('./config/database');

async function criarTabelaConfiguracoes() {
  console.log('🏢 CRIANDO TABELA DE CONFIGURAÇÕES POR ESCRITÓRIO\n');

  try {
    await connectDatabase();

    // Criar tabela de configurações por escritório
    console.log('📋 Criando tabela configuracoes_escritorio...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS configuracoes_escritorio (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        escritorio_id UUID NOT NULL,
        
        -- Configurações completas em JSON
        configuracoes JSONB NOT NULL DEFAULT '{}',
        
        -- Metadados
        versao VARCHAR(10) DEFAULT '1.0',
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Índices e constraints
        CONSTRAINT configuracoes_escritorio_escritorio_id_key UNIQUE (escritorio_id)
      );
    `);

    // Criar índices para performance
    console.log('🔍 Criando índices...');
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_configuracoes_escritorio_id 
      ON configuracoes_escritorio (escritorio_id);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_configuracoes_ativo 
      ON configuracoes_escritorio (ativo);
    `);

    // Inserir configuração padrão
    console.log('🏢 Inserindo configuração padrão...');
    
    const configuracaoPadrao = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 15000,
          valor_por_m2: 75,
          valor_por_hora: 150,
          horas_estimadas: 120,
          multiplicador_complexidade_padrao: 1.0
        },
        ESTRUTURAL: {
          ativo: true,
          valor_base: 12000,
          valor_por_m2: 45,
          valor_por_hora: 180,
          horas_estimadas: 80,
          multiplicador_complexidade_padrao: 1.0
        },
        INSTALACOES_HIDRAULICAS: {
          ativo: true,
          valor_base: 8000,
          valor_por_m2: 25,
          valor_por_hora: 120,
          horas_estimadas: 60,
          multiplicador_complexidade_padrao: 1.0
        },
        INSTALACOES_ELETRICAS: {
          ativo: false,
          valor_base: 7000,
          valor_por_m2: 22,
          valor_por_hora: 110,
          horas_estimadas: 50,
          multiplicador_complexidade_padrao: 1.0
        },
        PAISAGISMO: {
          ativo: false,
          valor_base: 5000,
          valor_por_m2: 15,
          valor_por_hora: 100,
          horas_estimadas: 40,
          multiplicador_complexidade_padrao: 1.0
        }
      },
      multiplicadores_regionais: {
        norte: { nome: "Norte", multiplicador: 0.85 },
        nordeste: { nome: "Nordeste", multiplicador: 0.90 },
        centro_oeste: { nome: "Centro-Oeste", multiplicador: 0.95 },
        sudeste: { nome: "Sudeste", multiplicador: 1.15 },
        sul: { nome: "Sul", multiplicador: 1.05 }
      },
      padroes_construcao: {
        simples: { nome: "Simples", multiplicador: 0.7 },
        medio: { nome: "Médio", multiplicador: 1.0 },
        alto: { nome: "Alto", multiplicador: 1.4 },
        luxo: { nome: "Luxo", multiplicador: 1.8 },
        premium: { nome: "Premium", multiplicador: 2.5 }
      },
      custos_indiretos: {
        margem_lucro: 25.0,
        overhead: 15.0,
        impostos: 13.65,
        reserva_contingencia: 5.0,
        comissao_vendas: 3.0
      },
      multiplicadores_complexidade: {
        muito_simples: 0.6,
        simples: 0.8,
        normal: 1.0,
        complexo: 1.3,
        muito_complexo: 1.6,
        excepcional: 2.0
      },
      configuracoes_prazo: {
        fator_urgencia: {
          normal: 1.0,
          urgente: 0.8,
          muito_urgente: 0.6
        },
        adicional_revisoes: 1.2,
        buffer_seguranca: 1.1
      },
      configuracoes_comerciais: {
        desconto_maximo_permitido: 15.0,
        valor_minimo_projeto: 5000.0,
        forma_pagamento_padrao: "30_60_90",
        juros_parcelamento: 2.5,
        desconto_pagamento_vista: 5.0
      },
      configuracoes_escritorio: {
        regime_tributario: "simples_nacional",
        regiao_principal: "sudeste",
        especialidade: "residencial",
        nivel_experiencia: "senior"
      }
    };

    // Gerar UUID para escritório demo
    const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // UUID fixo para demo

    await query(`
      INSERT INTO configuracoes_escritorio (
        escritorio_id, 
        configuracoes
      ) VALUES (
        $1,
        $2
      ) ON CONFLICT (escritorio_id) DO UPDATE SET
        configuracoes = EXCLUDED.configuracoes,
        updated_at = NOW();
    `, [escritorioId, JSON.stringify(configuracaoPadrao)]);

    // Verificar criação
    const result = await query(`
      SELECT 
        COUNT(*) as total_registros,
        MAX(updated_at) as ultima_atualizacao
      FROM configuracoes_escritorio;
    `);

    console.log('✅ Tabela criada com sucesso!');
    console.log(`   - Registros: ${result.rows[0].total_registros}`);
    console.log(`   - Última atualização: ${result.rows[0].ultima_atualizacao}`);

    console.log('\n🎉 TABELA CONFIGURACOES_ESCRITORIO CRIADA COM SUCESSO!');

  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  criarTabelaConfiguracoes()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { criarTabelaConfiguracoes };