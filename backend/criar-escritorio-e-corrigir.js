const { Client } = require('pg');

async function criarEscritorioECorrigir() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');

    const escritorioNormalizado = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const escritorioString = 'escritorio_teste';

    // 1. Verificar se escritório normalizado existe
    console.log('\n🏢 VERIFICANDO ESCRITÓRIO NORMALIZADO:');
    const escritorioExiste = await client.query(`
      SELECT id, nome FROM escritorios WHERE id = $1
    `, [escritorioNormalizado]);
    
    if (escritorioExiste.rows.length === 0) {
      console.log('❌ Escritório normalizado não existe. Criando...');
      
      // 2. Buscar dados do escritório original (string)
      const escritorioOriginal = await client.query(`
        SELECT * FROM escritorios WHERE id = $1
      `, [escritorioString]);
      
      if (escritorioOriginal.rows.length > 0) {
        const dadosOriginais = escritorioOriginal.rows[0];
        console.log('✅ Dados do escritório original encontrados:', dadosOriginais.nome);
        
        // 3. Criar escritório com UUID normalizado
        await client.query(`
          INSERT INTO escritorios (
            id, 
            nome, 
            cnpj, 
            telefone, 
            email, 
            endereco, 
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [
          escritorioNormalizado,
          dadosOriginais.nome || 'Escritório Teste ArcFlow',
          dadosOriginais.cnpj,
          dadosOriginais.telefone,
          dadosOriginais.email || 'contato@arcflow.com',
          dadosOriginais.endereco
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
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, NOW(), NOW())
        `, [
          escritorioNormalizado,
          'Escritório Teste ArcFlow',
          'contato@arcflow.com'
        ]);
        
        console.log('✅ Escritório normalizado criado do zero!');
      }
    } else {
      console.log('✅ Escritório normalizado já existe:', escritorioExiste.rows[0].nome);
    }

    // 5. Atualizar usuário para usar escritório normalizado
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
      console.log('Role:', user.role);
      
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

criarEscritorioECorrigir(); 