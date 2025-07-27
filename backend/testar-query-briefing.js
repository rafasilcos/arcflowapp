const { getClient, connectDatabase } = require('./config/database');

async function testarQuery() {
  try {
    await connectDatabase();
    const client = getClient();
    
    const briefingId = '123e4567-e89b-12d3-a456-426614174003';
    const escritorioId = '123e4567-e89b-12d3-a456-426614174000';
    
    console.log('Testando query do briefing...');
    
    const result = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        c.cpf as cliente_cpf,
        c.cnpj as cliente_cnpj,
        u.nome as responsavel_nome,
        u.email as responsavel_email,
        e.nome as escritorio_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      LEFT JOIN escritorios e ON b.escritorio_id::text = e.id
      WHERE b.id = $1::uuid 
        AND b.escritorio_id::text = $2 
        AND b.deleted_at IS NULL
    `, [briefingId, escritorioId]);
    
    console.log('✅ Query executada com sucesso!');
    console.log('Resultados encontrados:', result.rows.length);
    
    if (result.rows.length > 0) {
      console.log('Primeiro resultado:', {
        id: result.rows[0].id,
        nome_projeto: result.rows[0].nome_projeto,
        cliente_nome: result.rows[0].cliente_nome,
        responsavel_nome: result.rows[0].responsavel_nome,
        escritorio_nome: result.rows[0].escritorio_nome
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na query:', error);
    process.exit(1);
  }
}

testarQuery();