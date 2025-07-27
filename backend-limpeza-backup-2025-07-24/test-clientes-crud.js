const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testClientesCRUD() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // 1. Verificar estrutura da tabela
    console.log('\n🔍 1. Verificando estrutura da tabela clientes...');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    structure.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}) - Nullable: ${row.is_nullable}`);
    });

    // 2. Verificar clientes existentes
    console.log('\n📊 2. Clientes existentes:');
    const existing = await client.query('SELECT id, nome, email, escritorio_id FROM clientes ORDER BY created_at DESC LIMIT 5');
    console.log(`Total: ${existing.rows.length}`);
    existing.rows.forEach(row => {
      console.log(`  - ${row.nome} (${row.email}) - Escritório: ${row.escritorio_id}`);
    });

    // 3. Verificar escritório de teste
    console.log('\n🏢 3. Verificando escritório de teste...');
    const escritorio = await client.query("SELECT * FROM escritorios WHERE nome LIKE '%teste%' LIMIT 1");
    if (escritorio.rows.length === 0) {
      console.log('❌ Nenhum escritório de teste encontrado');
      return;
    }
    
    const escritorioId = escritorio.rows[0].id;
    console.log(`✅ Escritório encontrado: ${escritorio.rows[0].nome} (${escritorioId})`);

    // 4. Teste de criação
    console.log('\n➕ 4. Testando criação de cliente...');
    const { v4: uuidv4 } = require('uuid');
    const novoClienteId = uuidv4();
    
    const createResult = await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, cpf_cnpj, 
        endereco, cidade, estado, observacoes, escritorio_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      novoClienteId,
      'Cliente Teste CRUD',
      'teste-crud@exemplo.com',
      '(11) 99999-9999',
      '123.456.789-00',
      'Rua Teste, 123',
      'São Paulo',
      'SP',
      'Cliente criado via teste CRUD',
      escritorioId
    ]);

    if (createResult.rows.length > 0) {
      console.log('✅ Cliente criado com sucesso:', createResult.rows[0].nome);
    } else {
      console.log('❌ Falha na criação do cliente');
      return;
    }

    // 5. Teste de leitura
    console.log('\n👀 5. Testando leitura do cliente...');
    const readResult = await client.query('SELECT * FROM clientes WHERE id = $1', [novoClienteId]);
    
    if (readResult.rows.length > 0) {
      console.log('✅ Cliente lido com sucesso:', readResult.rows[0].nome);
    } else {
      console.log('❌ Cliente não encontrado na leitura');
    }

    // 6. Teste de atualização
    console.log('\n✏️ 6. Testando atualização do cliente...');
    const updateResult = await client.query(`
      UPDATE clientes SET 
        nome = $1,
        telefone = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [
      'Cliente Teste CRUD ATUALIZADO',
      '(11) 88888-8888',
      novoClienteId
    ]);

    if (updateResult.rows.length > 0) {
      console.log('✅ Cliente atualizado com sucesso:', updateResult.rows[0].nome);
      console.log('📞 Novo telefone:', updateResult.rows[0].telefone);
    } else {
      console.log('❌ Falha na atualização do cliente');
    }

    // 7. Verificar se a atualização persistiu
    console.log('\n🔄 7. Verificando persistência da atualização...');
    const verifyResult = await client.query('SELECT nome, telefone FROM clientes WHERE id = $1', [novoClienteId]);
    
    if (verifyResult.rows.length > 0) {
      const cliente = verifyResult.rows[0];
      console.log('✅ Dados persistidos:');
      console.log(`  - Nome: ${cliente.nome}`);
      console.log(`  - Telefone: ${cliente.telefone}`);
    }

    // 8. Limpeza - remover cliente de teste
    console.log('\n🧹 8. Limpando dados de teste...');
    await client.query('DELETE FROM clientes WHERE id = $1', [novoClienteId]);
    console.log('✅ Cliente de teste removido');

    console.log('\n🎉 Teste CRUD concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste CRUD:', error);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

testClientesCRUD(); 