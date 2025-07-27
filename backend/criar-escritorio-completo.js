const { Client } = require('pg');

async function criarEscritorioCompleto() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');

    const escritorioNormalizado = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const escritorioString = 'escritorio_teste';

    // 1. Verificar estrutura da tabela escritorios
    console.log('\n🏢 VERIFICANDO ESTRUTURA DA TABELA ESCRITORIOS:');
    const estrutura = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'escritorios' 
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas da tabela escritorios:');
    estrutura.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type}) - NULL: ${col.is_nullable}`);
    });

    // 2. Buscar dados do escritório original
    console.log('\n🔍 BUSCANDO ESCRITÓRIO ORIGINAL:');
    const escritorioOriginal = await client.query(`
      SELECT * FROM escritorios WHERE id = $1
    `, [escritorioString]);
    
    if (escritorioOriginal.rows.length > 0) {
      const dadosOriginais = escritorioOriginal.rows[0];
      console.log('✅ Dados do escritório original:', dadosOriginais);
      
      // 3. Criar escritório com UUID normalizado (incluindo plan_id)
      console.log('\n🔧 CRIANDO ESCRITÓRIO NORMALIZADO...');
      await client.query(`
        INSERT INTO escritorios (
          id, 
          nome, 
          cnpj, 
          telefone, 
          email, 
          endereco,
          plan_id,
          created_at, 
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [
        escritorioNormalizado,
        dadosOriginais.nome || 'Escritório Teste ArcFlow',
        dadosOriginais.cnpj,
        dadosOriginais.telefone,
        dadosOriginais.email || 'contato@arcflow.com',
        dadosOriginais.endereco,
        dadosOriginais.plan_id || 'plan_pro' // Usar plan_id original ou padrão
      ]);
      
      console.log('✅ Escritório normalizado criado!');
    } else {
      console.log('⚠️ Escritório original não encontrado. Criando novo...');
      
      // 4. Criar escritório do zero
      await client.query(`
        INSERT INTO escritorios (
          id, 
          nome, 
          email,
          plan_id,
          created_at, 
          updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [
        escritorioNormalizado,
        'Escritório Teste ArcFlow',
        'contato@arcflow.com',
        'plan_pro' // Plano padrão
      ]);
      
      console.log('✅ Escritório normalizado criado do zero!');
    }

    // 5. Atualizar usuário
    console.log('\n👤 CORRIGINDO USUÁRIO...');
    await client.query(`
      UPDATE users 
      SET escritorio_id = $1, updated_at = NOW()
      WHERE email = $2
    `, [escritorioNormalizado, 'rafasilcos@icloud.com']);
    
    console.log('✅ Usuário atualizado!');
    
    // 6. Verificar resultado
    console.log('\n📊 RESULTADO FINAL:');
    const userFinal = await client.query(`
      SELECT id, email, escritorio_id, role 
      FROM users 
      WHERE email = 'rafasilcos@icloud.com'
    `);
    
    if (userFinal.rows.length > 0) {
      const user = userFinal.rows[0];
      console.log('Email:', user.email);
      console.log('Escritório ID:', user.escritorio_id);
      
      // 7. Verificar briefings acessíveis
      const briefings = await client.query(`
        SELECT 
          id, 
          nome_projeto, 
          LENGTH(observacoes::text) as observacoes_length,
          status
        FROM briefings 
        WHERE escritorio_id = $1 
        AND deleted_at IS NULL 
        LIMIT 10
      `, [user.escritorio_id]);
      
      console.log('\n📋 BRIEFINGS ACESSÍVEIS:', briefings.rows.length);
      
      const briefingsComRespostas = briefings.rows.filter(b => b.observacoes_length > 100);
      console.log(`📊 BRIEFINGS COM RESPOSTAS: ${briefingsComRespostas.length}/${briefings.rows.length}`);
      
      if (briefingsComRespostas.length > 0) {
        console.log('🎉 SUCESSO! Usuário agora tem acesso aos briefings com respostas!');
        
        // Mostrar alguns briefings com respostas
        briefings.rows.filter(b => b.observacoes_length > 100).forEach((b, i) => {
          console.log(`${i + 1}. ${b.nome_projeto} - ${b.observacoes_length} chars`);
        });
      } else {
        console.log('⚠️ Ainda não há briefings com respostas para este usuário');
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

criarEscritorioCompleto(); 