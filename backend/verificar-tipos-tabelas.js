const { getClient, connectDatabase } = require('./config/database');

async function verificarTipos() {
  try {
    await connectDatabase();
    const client = getClient();
    
    console.log('=== ESTRUTURA TABELA BRIEFINGS ===');
    const briefings = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('cliente_id', 'responsavel_id', 'escritorio_id')
      ORDER BY column_name
    `);
    console.table(briefings.rows);
    
    console.log('=== ESTRUTURA TABELA CLIENTES ===');
    const clientes = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      AND column_name = 'id'
    `);
    console.table(clientes.rows);
    
    console.log('=== ESTRUTURA TABELA USERS ===');
    const users = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'id'
    `);
    console.table(users.rows);
    
    console.log('=== ESTRUTURA TABELA ESCRITORIOS ===');
    const escritorios = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'escritorios' 
      AND column_name = 'id'
    `);
    console.table(escritorios.rows);
    
    console.log('=== ESTRUTURA TABELA ORCAMENTOS ===');
    const orcamentos = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos'
      ORDER BY column_name
    `);
    console.table(orcamentos.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

verificarTipos();