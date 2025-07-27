/**
 * 🔍 VERIFICAR TABELA DE DISCIPLINAS
 * Verifica se a tabela foi criada corretamente e testa operações básicas
 */

const { connectDatabase, query } = require('./config/database');

async function verificarTabelaDisciplinas() {
  console.log('🔍 VERIFICANDO TABELA DE DISCIPLINAS\n');

  try {
    // Conectar ao banco
    await connectDatabase();

    // 1. Verificar se a tabela existe
    console.log('1️⃣ Verificando se a tabela existe...');
    
    const tabelaExiste = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'disciplinas_configuracoes'
      );
    `);

    if (tabelaExiste.rows[0].exists) {
      console.log('   ✅ Tabela disciplinas_configuracoes existe');
    } else {
      console.log('   ❌ Tabela disciplinas_configuracoes NÃO existe');
      return;
    }

    // 2. Verificar registros existentes
    console.log('\n2️⃣ Verificando registros existentes...');
    
    const registros = await query(`
      SELECT 
        orcamento_id,
        disciplinas_ativas,
        configuracoes_por_disciplina,
        created_at,
        updated_at
      FROM disciplinas_configuracoes
      ORDER BY updated_at DESC;
    `);

    console.log(`   📊 Total de registros: ${registros.rows.length}`);
    
    registros.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.orcamento_id}:`);
      console.log(`      - Disciplinas: ${row.disciplinas_ativas.length}`);
      console.log(`      - Configurações: ${Object.keys(row.configuracoes_por_disciplina).length}`);
      console.log(`      - Atualizado: ${row.updated_at.toLocaleString('pt-BR')}`);
    });

    // 3. Testar inserção de configurações de teste
    console.log('\n3️⃣ Testando inserção de configurações...');
    
    const configTeste = {
      orcamento_id: 'teste-verificacao',
      disciplinas_ativas: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_HIDRAULICAS'],
      configuracoes_por_disciplina: {
        'ARQUITETURA': { valor: 15000, horas: 120 },
        'ESTRUTURAL': { valor: 12000, horas: 80 },
        'INSTALACOES_HIDRAULICAS': { valor: 8000, horas: 60 }
      }
    };

    const resultInsert = await query(`
      INSERT INTO disciplinas_configuracoes (
        orcamento_id, 
        disciplinas_ativas, 
        configuracoes_por_disciplina
      ) VALUES ($1, $2, $3)
      ON CONFLICT (orcamento_id) 
      DO UPDATE SET 
        disciplinas_ativas = EXCLUDED.disciplinas_ativas,
        configuracoes_por_disciplina = EXCLUDED.configuracoes_por_disciplina,
        updated_at = NOW()
      RETURNING *;
    `, [
      configTeste.orcamento_id,
      JSON.stringify(configTeste.disciplinas_ativas),
      JSON.stringify(configTeste.configuracoes_por_disciplina)
    ]);

    if (resultInsert.rows.length > 0) {
      console.log('   ✅ Inserção/atualização bem-sucedida');
      const row = resultInsert.rows[0];
      console.log(`   📊 Disciplinas salvas: ${row.disciplinas_ativas.length}`);
      console.log(`   ⚙️ Configurações salvas: ${Object.keys(row.configuracoes_por_disciplina).length}`);
    }

    // 4. Testar busca
    console.log('\n4️⃣ Testando busca de configurações...');
    
    const resultSelect = await query(`
      SELECT disciplinas_ativas, configuracoes_por_disciplina, updated_at 
      FROM disciplinas_configuracoes 
      WHERE orcamento_id = $1;
    `, ['teste-verificacao']);

    if (resultSelect.rows.length > 0) {
      const row = resultSelect.rows[0];
      console.log('   ✅ Busca bem-sucedida');
      console.log(`   📊 Disciplinas encontradas: ${row.disciplinas_ativas.length}`);
      console.log(`   ⚙️ Configurações encontradas: ${Object.keys(row.configuracoes_por_disciplina).length}`);
      console.log(`   🕐 Última atualização: ${row.updated_at.toLocaleString('pt-BR')}`);
    }

    // 5. Testar configurações globais
    console.log('\n5️⃣ Verificando configurações globais...');
    
    const globalConfig = await query(`
      SELECT disciplinas_ativas, configuracoes_por_disciplina, updated_at 
      FROM disciplinas_configuracoes 
      WHERE orcamento_id = 'configuracoes-globais';
    `);

    if (globalConfig.rows.length > 0) {
      const row = globalConfig.rows[0];
      console.log('   ✅ Configurações globais encontradas');
      console.log(`   📊 Disciplinas globais: ${row.disciplinas_ativas.length}`);
      console.log(`   ⚙️ Configurações globais: ${Object.keys(row.configuracoes_por_disciplina).length}`);
    } else {
      console.log('   ⚠️ Configurações globais não encontradas - criando...');
      
      await query(`
        INSERT INTO disciplinas_configuracoes (
          orcamento_id, 
          disciplinas_ativas, 
          configuracoes_por_disciplina
        ) VALUES (
          'configuracoes-globais',
          '["ARQUITETURA"]',
          '{}'
        );
      `);
      
      console.log('   ✅ Configurações globais criadas');
    }

    // 6. Limpar dados de teste
    console.log('\n6️⃣ Limpando dados de teste...');
    
    await query(`DELETE FROM disciplinas_configuracoes WHERE orcamento_id = 'teste-verificacao';`);
    console.log('   ✅ Dados de teste removidos');

    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA - TABELA FUNCIONANDO CORRETAMENTE!');

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  }
}

// Executar verificação
verificarTabelaDisciplinas();