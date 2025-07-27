/**
 * 🗄️ SCRIPT PARA CRIAR TABELA DE CONFIGURAÇÕES DE DISCIPLINAS
 * Cria tabela específica para armazenar configurações de disciplinas ativas
 */

const { connectDatabase, query } = require('./config/database');

async function criarTabelaDisciplinasConfig() {
  console.log('🗄️ CRIANDO TABELA DE CONFIGURAÇÕES DE DISCIPLINAS\n');

  try {
    // Conectar ao banco
    await connectDatabase();

    // Criar tabela para configurações de disciplinas
    console.log('📋 Criando tabela disciplinas_configuracoes...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS disciplinas_configuracoes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        orcamento_id VARCHAR(255) NOT NULL UNIQUE,
        disciplinas_ativas JSONB NOT NULL DEFAULT '["ARQUITETURA"]',
        configuracoes_por_disciplina JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Índices para performance
        CONSTRAINT disciplinas_configuracoes_orcamento_id_key UNIQUE (orcamento_id)
      );
    `);

    // Criar índices para otimização
    console.log('🔍 Criando índices...');
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_disciplinas_config_orcamento_id 
      ON disciplinas_configuracoes (orcamento_id);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_disciplinas_config_updated_at 
      ON disciplinas_configuracoes (updated_at);
    `);

    // Criar trigger para atualizar updated_at automaticamente
    console.log('⚡ Criando trigger para updated_at...');
    
    await query(`
      CREATE OR REPLACE FUNCTION update_disciplinas_config_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await query(`
      DROP TRIGGER IF EXISTS trigger_update_disciplinas_config_updated_at 
      ON disciplinas_configuracoes;
      
      CREATE TRIGGER trigger_update_disciplinas_config_updated_at
        BEFORE UPDATE ON disciplinas_configuracoes
        FOR EACH ROW
        EXECUTE FUNCTION update_disciplinas_config_updated_at();
    `);

    // Inserir configuração padrão global se não existir
    console.log('🌐 Inserindo configuração global padrão...');
    
    await query(`
      INSERT INTO disciplinas_configuracoes (
        orcamento_id, 
        disciplinas_ativas, 
        configuracoes_por_disciplina
      ) VALUES (
        'configuracoes-globais',
        '["ARQUITETURA"]',
        '{}'
      ) ON CONFLICT (orcamento_id) DO NOTHING;
    `);

    // Verificar se a tabela foi criada corretamente
    const result = await query(`
      SELECT 
        COUNT(*) as total_registros,
        MAX(updated_at) as ultima_atualizacao
      FROM disciplinas_configuracoes;
    `);

    console.log('✅ Tabela criada com sucesso!');
    console.log(`   - Registros: ${result.rows[0].total_registros}`);
    console.log(`   - Última atualização: ${result.rows[0].ultima_atualizacao}`);

    // Mostrar estrutura da tabela
    const estrutura = await query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'disciplinas_configuracoes'
      ORDER BY ordinal_position;
    `);

    console.log('\n📊 Estrutura da tabela:');
    estrutura.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });

    console.log('\n🎉 TABELA DISCIPLINAS_CONFIGURACOES CRIADA COM SUCESSO!');

  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  criarTabelaDisciplinasConfig()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { criarTabelaDisciplinasConfig };