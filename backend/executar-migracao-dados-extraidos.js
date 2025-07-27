/**
 * EXECUTAR MIGRAÇÃO - ADICIONAR DADOS_EXTRAIDOS
 * 
 * Este script executa a migração para adicionar a coluna dados_extraidos
 * na tabela orcamentos, que é necessária para o funcionamento correto
 * do sistema de geração de orçamentos.
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config();

const { Client } = require('pg');

async function executarMigracao() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    console.log('🚀 EXECUTANDO MIGRAÇÃO - DADOS_EXTRAIDOS');
    console.log('='.repeat(50));

    // Conectar ao banco
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Ler arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', '004-adicionar-dados-extraidos-orcamentos.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('\n📄 Executando migração...');
    console.log('Arquivo:', migrationPath);

    // Executar migração
    const result = await client.query(migrationSQL);
    
    console.log('✅ Migração executada com sucesso!');
    
    // Se há resultado da verificação, mostrar
    if (result.rows && result.rows.length > 0) {
      console.log('\n📊 Verificação da coluna:');
      result.rows.forEach(row => {
        console.log(`   - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    }

    // Testar inserção de um orçamento
    console.log('\n🧪 Testando inserção de orçamento...');
    
    const codigoTeste = `ORC-TESTE-${Date.now()}`;
    
    const insertResult = await client.query(`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, 
        area_construida, valor_total, valor_por_m2,
        tipologia, padrao, complexidade,
        disciplinas, composicao_financeira, cronograma, proposta,
        briefing_id, escritorio_id, responsavel_id,
        dados_extraidos
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING id, codigo
    `, [
      codigoTeste,
      'Orçamento Teste Migração',
      'Teste para verificar se a migração funcionou',
      'RASCUNHO',
      200,
      50000,
      250,
      'RESIDENCIAL',
      'MEDIO',
      'MEDIA',
      JSON.stringify([{nome: 'Arquitetura', valor: 50000}]),
      JSON.stringify({custoTecnico: 40000, lucro: 10000}),
      JSON.stringify({prazoTotal: 12}),
      JSON.stringify({escopo: 'Projeto completo'}),
      '8320013b-8caf-405e-aefc-401e29b61ef8', // ID de um briefing existente
      'escritorio_teste',
      1,
      JSON.stringify({areaConstruida: 200, tipologia: 'RESIDENCIAL'})
    ]);
    
    console.log('✅ Orçamento de teste inserido!');
    console.log('   ID:', insertResult.rows[0].id);
    console.log('   Código:', insertResult.rows[0].codigo);

    // Verificar se foi salvo
    const selectResult = await client.query(`
      SELECT id, codigo, nome, valor_total, dados_extraidos
      FROM orcamentos 
      WHERE codigo = $1
    `, [codigoTeste]);
    
    if (selectResult.rows.length > 0) {
      const orcamento = selectResult.rows[0];
      console.log('✅ Orçamento confirmado no banco!');
      console.log('   Nome:', orcamento.nome);
      console.log('   Valor:', orcamento.valor_total);
      console.log('   Dados extraídos:', orcamento.dados_extraidos ? 'Presente ✅' : 'Ausente ❌');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('');
    console.log('✅ A coluna dados_extraidos foi adicionada à tabela orcamentos');
    console.log('✅ O sistema de geração de orçamentos agora deve funcionar');
    console.log('✅ Teste de inserção passou com sucesso');
    console.log('');
    console.log('🔄 Próximos passos:');
    console.log('   1. Testar a geração de orçamento via API');
    console.log('   2. Verificar se o redirecionamento funciona');
    console.log('   3. Confirmar que a página de orçamento carrega');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Conexão com banco encerrada');
  }
}

// Executar migração
executarMigracao().catch(console.error);