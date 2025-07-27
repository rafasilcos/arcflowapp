const { Client } = require('pg');

async function investigarRespostas() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');

    // 1. Verificar estrutura da tabela briefings
    console.log('\n📋 ESTRUTURA DA TABELA BRIEFINGS:');
    const estruturaResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position
    `);
    console.log(estruturaResult.rows);

    // 2. Buscar briefings recentes com detalhes
    console.log('\n📝 BRIEFINGS RECENTES (TOP 5):');
    const briefingsResult = await client.query(`
      SELECT 
        id, 
        nome_projeto, 
        status, 
        progresso,
        LENGTH(observacoes::text) as observacoes_length,
        observacoes,
        metadata,
        created_at,
        responsavel_id,
        escritorio_id
      FROM briefings 
      WHERE deleted_at IS NULL 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    briefingsResult.rows.forEach((briefing, index) => {
      console.log(`\n--- BRIEFING ${index + 1} ---`);
      console.log('ID:', briefing.id);
      console.log('Nome:', briefing.nome_projeto);
      console.log('Status:', briefing.status);
      console.log('Progresso:', briefing.progresso);
      console.log('Responsável ID:', briefing.responsavel_id);
      console.log('Escritório ID:', briefing.escritorio_id);
      console.log('Observações Length:', briefing.observacoes_length);
      console.log('Metadata:', briefing.metadata);
      
      // Tentar parsear observações
      if (briefing.observacoes) {
        try {
          const observacoesParsed = JSON.parse(briefing.observacoes);
          console.log('📋 OBSERVAÇÕES PARSED:');
          console.log('- Template:', observacoesParsed.template?.nome || 'N/A');
          console.log('- Respostas:', Object.keys(observacoesParsed.respostas || {}).length, 'itens');
          console.log('- Metadados:', observacoesParsed.metadados ? 'SIM' : 'NÃO');
          console.log('- Estrutura Personalizada:', observacoesParsed.estruturaPersonalizada ? 'SIM' : 'NÃO');
          
          // Mostrar algumas respostas como exemplo
          if (observacoesParsed.respostas) {
            const respostasKeys = Object.keys(observacoesParsed.respostas).slice(0, 3);
            console.log('📝 PRIMEIRAS 3 RESPOSTAS:');
            respostasKeys.forEach(key => {
              console.log(`- ${key}: ${observacoesParsed.respostas[key]}`);
            });
          }
        } catch (error) {
          console.log('❌ Erro ao parsear observações:', error.message);
        }
      } else {
        console.log('⚠️ SEM OBSERVAÇÕES');
      }
    });

    // 3. Contar briefings por status
    console.log('\n📊 BRIEFINGS POR STATUS:');
    const statusResult = await client.query(`
      SELECT status, COUNT(*) as total 
      FROM briefings 
      WHERE deleted_at IS NULL 
      GROUP BY status 
      ORDER BY total DESC
    `);
    console.log(statusResult.rows);

    // 4. Verificar se existem outras tabelas relacionadas
    console.log('\n📋 TABELAS RELACIONADAS:');
    const tabelasResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%briefing%' 
      ORDER BY table_name
    `);
    console.log(tabelasResult.rows);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

investigarRespostas(); 