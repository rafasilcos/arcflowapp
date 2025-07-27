const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function investigarTabelaBriefings() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔗 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');
    
    // 1. Verificar se tabela briefings existe
    console.log('\n📋 Verificando se tabela briefings existe...');
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'briefings'
      );
    `);
    
    console.log(`📊 Tabela briefings existe: ${tableExists.rows[0].exists}`);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Tabela briefings NÃO EXISTE!');
      console.log('💡 Precisamos criar a tabela primeiro');
      return;
    }
    
    // 2. Verificar estrutura da tabela
    console.log('\n📊 Estrutura da tabela briefings:');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position
    `);
    
    structure.rows.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.column_name} - ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // 3. Verificar especificamente o campo escritorio_id
    const escritorioIdField = structure.rows.find(col => col.column_name === 'escritorio_id');
    if (escritorioIdField) {
      console.log('\n🎯 Campo escritorio_id:');
      console.log(`  Tipo: ${escritorioIdField.data_type}`);
      console.log(`  Nullable: ${escritorioIdField.is_nullable}`);
      console.log(`  Default: ${escritorioIdField.column_default || 'Nenhum'}`);
      
      if (escritorioIdField.data_type === 'uuid') {
        console.log('⚠️ PROBLEMA: Campo é UUID mas recebe STRING!');
      } else {
        console.log('✅ Campo aceita strings');
      }
    } else {
      console.log('❌ Campo escritorio_id não encontrado!');
    }
    
    // 4. Verificar dados existentes
    console.log('\n📊 Verificando briefings existentes...');
    const existingBriefings = await client.query(`
      SELECT id, nome_projeto, escritorio_id, created_at 
      FROM briefings 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log(`📋 Briefings existentes: ${existingBriefings.rows.length}`);
    existingBriefings.rows.forEach((briefing, index) => {
      console.log(`  ${index + 1}. ${briefing.nome_projeto} - escritorio_id: ${briefing.escritorio_id}`);
    });
    
    // 5. Verificar escritórios válidos
    console.log('\n🏢 Verificando escritórios válidos...');
    const escritorios = await client.query(`
      SELECT id, nome FROM escritorios 
      WHERE is_active = true
      ORDER BY created_at DESC
    `);
    
    console.log(`🏢 Escritórios ativos: ${escritorios.rows.length}`);
    escritorios.rows.forEach((escritorio, index) => {
      console.log(`  ${index + 1}. ${escritorio.nome} - ID: ${escritorio.id}`);
    });
    
    // 6. Sugestão de correção
    console.log('\n💡 SUGESTÕES DE CORREÇÃO:');
    
    if (escritorioIdField?.data_type === 'uuid') {
      console.log('📋 OPÇÃO 1: Converter string para UUID válido na API');
      console.log('📋 OPÇÃO 2: Alterar campo para TEXT (mais flexível)');
      console.log('📋 OPÇÃO 3: Mapear "escritorio_teste" para UUID real');
      
      // Verificar se existe UUID para "escritorio_teste"
      const escritorioTeste = await client.query(`
        SELECT id FROM escritorios WHERE nome ILIKE '%teste%' OR id = 'escritorio_teste'
      `);
      
      if (escritorioTeste.rows.length > 0) {
        console.log(`✅ Escritório teste encontrado: ${escritorioTeste.rows[0].id}`);
      } else {
        console.log('⚠️ Escritório teste não encontrado - precisa criar ou mapear');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
    console.log('\n🔚 Investigação concluída.');
  }
}

// Executar investigação
investigarTabelaBriefings().catch(console.error); 