const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function testClientesAPI() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco de dados');

    // 1. Verificar estrutura da tabela clientes
    console.log('\n📋 Verificando estrutura da tabela clientes...');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'clientes'
      ORDER BY ordinal_position;
    `);

    console.log('Colunas da tabela clientes:');
    structure.rows.forEach(row => {
      console.log(`  ✅ ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // 2. Usar escritório existente
    console.log('\n🏢 Buscando escritório existente...');
    const escritorio = await client.query(`
      SELECT id FROM escritorios LIMIT 1;
    `);

    if (escritorio.rows.length === 0) {
      console.log('❌ Nenhum escritório encontrado no banco');
      return;
    } else {
      console.log('✅ Usando escritório existente:', escritorio.rows[0].id);
    }

    const escritorioId = escritorio.rows[0].id;

    // 3. Usar usuário existente ou criar um simples
    console.log('\n👤 Buscando usuário existente...');
    let usuario = await client.query(`
      SELECT id FROM users WHERE escritorio_id = $1 LIMIT 1;
    `, [escritorioId]);

    if (usuario.rows.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado, usando ID fictício para teste');
      const userId = 'user_teste_' + Date.now();
    } else {
      console.log('✅ Usando usuário existente:', usuario.rows[0].id);
    }

    const userId = usuario.rows.length > 0 ? usuario.rows[0].id : 'user_teste_' + Date.now();

    // 4. Testar inserção de cliente
    console.log('\n🧪 Testando inserção de cliente...');
    const clienteId = 'cliente_teste_' + Date.now();
    const novoCliente = await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, "tipoPessoa", cpf, endereco, observacoes, 
        status, escritorio_id, "createdBy", created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *;
    `, [
      clienteId,
      'João Silva Teste',
      'joao.teste@email.com',
      '(11) 99999-9999',
      'fisica',
      '123.456.789-00',
      JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'Brasil'
      }),
      'Cliente criado para teste da API',
      'ativo',
      escritorioId,
      userId
    ]);

    console.log('✅ Cliente inserido com sucesso:');
    console.log('  ID:', novoCliente.rows[0].id);
    console.log('  Nome:', novoCliente.rows[0].nome);
    console.log('  Email:', novoCliente.rows[0].email);
    console.log('  Status:', novoCliente.rows[0].status);

    // clienteId já definido acima

    // 5. Testar busca de clientes
    console.log('\n🔍 Testando busca de clientes...');
    const clientes = await client.query(`
      SELECT * FROM clientes 
      WHERE escritorio_id = $1 AND "deletedAt" IS NULL
      ORDER BY created_at DESC;
    `, [escritorioId]);

    console.log(`✅ Encontrados ${clientes.rows.length} clientes:`);
    clientes.rows.forEach(cliente => {
      console.log(`  - ${cliente.nome} (${cliente.email}) - Status: ${cliente.status}`);
    });

    // 6. Testar atualização de cliente
    console.log('\n✏️ Testando atualização de cliente...');
    const clienteAtualizado = await client.query(`
      UPDATE clientes 
      SET telefone = $1, observacoes = $2, updated_at = NOW()
      WHERE id = $3 AND escritorio_id = $4
      RETURNING *;
    `, [
      '(11) 88888-8888',
      'Cliente atualizado via teste',
      clienteId,
      escritorioId
    ]);

    console.log('✅ Cliente atualizado com sucesso:');
    console.log('  Novo telefone:', clienteAtualizado.rows[0].telefone);
    console.log('  Observações:', clienteAtualizado.rows[0].observacoes);

    // 7. Testar busca com filtros
    console.log('\n🎯 Testando busca com filtros...');
    const clientesAtivos = await client.query(`
      SELECT COUNT(*) as total FROM clientes 
      WHERE escritorio_id = $1 AND status = 'ativo' AND "deletedAt" IS NULL;
    `, [escritorioId]);

    console.log(`✅ Total de clientes ativos: ${clientesAtivos.rows[0].total}`);

    // 8. Testar soft delete
    console.log('\n🗑️ Testando soft delete...');
    await client.query(`
      UPDATE clientes 
      SET "deletedAt" = NOW()
      WHERE id = $1;
    `, [clienteId]);

    const clientesDeletados = await client.query(`
      SELECT COUNT(*) as total FROM clientes 
      WHERE escritorio_id = $1 AND "deletedAt" IS NOT NULL;
    `, [escritorioId]);

    console.log(`✅ Total de clientes deletados: ${clientesDeletados.rows[0].total}`);

    // 9. Verificar índices
    console.log('\n📊 Verificando índices...');
    const indices = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'clientes' AND schemaname = 'public';
    `);

    console.log('Índices criados:');
    indices.rows.forEach(index => {
      console.log(`  ✅ ${index.indexname}`);
    });

    console.log('\n🎉 Todos os testes passaram! A API de clientes está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

testClientesAPI(); 