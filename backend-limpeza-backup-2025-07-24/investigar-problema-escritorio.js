const { Client } = require('pg');

async function investigarEscritorio() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');

    // 1. Verificar usuário específico
    console.log('\n👤 USUÁRIO ESPECÍFICO:');
    const userResult = await client.query(`
      SELECT id, email, escritorio_id, role 
      FROM users 
      WHERE email = 'rafasilcos@icloud.com'
    `);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('Email:', user.email);
      console.log('Escritório ID:', user.escritorio_id);
      console.log('Role:', user.role);
      
      // 2. Normalizar o escritório ID
      const normalizedEscritorio = user.escritorio_id === 'escritorio_teste' 
        ? 'f47ac10b-58cc-4372-a567-0e02b2c3d479' 
        : user.escritorio_id;
      
      console.log('Escritório Normalizado:', normalizedEscritorio);
      
      // 3. Buscar briefings do escritório original
      console.log('\n📋 BRIEFINGS DO ESCRITÓRIO ORIGINAL:');
      const briefingsOriginais = await client.query(`
        SELECT 
          id, 
          nome_projeto, 
          escritorio_id,
          LENGTH(observacoes::text) as observacoes_length,
          status
        FROM briefings 
        WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        LIMIT 5
      `, [user.escritorio_id]);
      
      console.log('Total briefings (escritório original):', briefingsOriginais.rows.length);
      briefingsOriginais.rows.forEach((b, i) => {
        console.log(`${i + 1}. ${b.nome_projeto} - ${b.observacoes_length} chars - ${b.status}`);
      });
      
      // 4. Buscar briefings do escritório normalizado
      console.log('\n📋 BRIEFINGS DO ESCRITÓRIO NORMALIZADO:');
      const briefingsNormalizados = await client.query(`
        SELECT 
          id, 
          nome_projeto, 
          escritorio_id,
          LENGTH(observacoes::text) as observacoes_length,
          status
        FROM briefings 
        WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        LIMIT 5
      `, [normalizedEscritorio]);
      
      console.log('Total briefings (escritório normalizado):', briefingsNormalizados.rows.length);
      briefingsNormalizados.rows.forEach((b, i) => {
        console.log(`${i + 1}. ${b.nome_projeto} - ${b.observacoes_length} chars - ${b.status}`);
      });
      
      // 5. Verificar se há briefings com respostas
      console.log('\n🔍 BRIEFINGS COM RESPOSTAS:');
      const briefingsComRespostas = await client.query(`
        SELECT 
          id, 
          nome_projeto, 
          escritorio_id,
          LENGTH(observacoes::text) as observacoes_length,
          status
        FROM briefings 
        WHERE deleted_at IS NULL 
        AND observacoes IS NOT NULL 
        AND LENGTH(observacoes::text) > 100
        ORDER BY LENGTH(observacoes::text) DESC
        LIMIT 10
      `);
      
      console.log('Total briefings com respostas:', briefingsComRespostas.rows.length);
      briefingsComRespostas.rows.forEach((b, i) => {
        console.log(`${i + 1}. ${b.nome_projeto} - ${b.observacoes_length} chars - Escritório: ${b.escritorio_id}`);
      });
      
    } else {
      console.log('❌ Usuário não encontrado');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

investigarEscritorio(); 