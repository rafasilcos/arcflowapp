/**
 * 🔍 VERIFICAR ESTRUTURA DAS TABELAS PARA ORÇAMENTO 66
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarEstrutura() {
  await connectDatabase();
  const client = getClient();
  
  try {
    console.log('🔍 VERIFICANDO ESTRUTURA DAS TABELAS\n');
    
    // 1. Estrutura da tabela orcamentos
    console.log('1️⃣ ESTRUTURA DA TABELA ORCAMENTOS:');
    const orcamentosStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos'
      ORDER BY ordinal_position
    `);
    
    orcamentosStructure.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // 2. Estrutura da tabela briefings
    console.log('\n2️⃣ ESTRUTURA DA TABELA BRIEFINGS:');
    const briefingsStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'briefings'
      ORDER BY ordinal_position
    `);
    
    briefingsStructure.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // 3. Verificar se orçamento 66 existe
    console.log('\n3️⃣ VERIFICANDO ORÇAMENTO 66:');
    const orcamento66 = await client.query('SELECT * FROM orcamentos WHERE id = 66');
    
    if (orcamento66.rows.length > 0) {
      console.log('✅ Orçamento 66 encontrado!');
      const orc = orcamento66.rows[0];
      console.log('- ID:', orc.id);
      console.log('- Código:', orc.codigo);
      console.log('- Nome:', orc.nome);
      console.log('- Briefing ID:', orc.briefing_id);
      console.log('- Cliente ID:', orc.cliente_id);
    } else {
      console.log('❌ Orçamento 66 não encontrado!');
    }
    
    console.log('\n✅ Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarEstrutura()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });