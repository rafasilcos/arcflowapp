const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://arcflow_user:23081998@localhost:5432/arcflow_db'
  });

  try {
    await client.connect();
    console.log('🔍 ANÁLISE COMPLETA DA SITUAÇÃO DO CLIENTE:');
    console.log('');
    
    // 1. Ver briefing específico em questão
    const briefingId = 'ebc63db7-778b-48af-bc7b-c719c6857a7a';
    console.log('1. BRIEFING EM QUESTÃO:', briefingId);
    const briefingResult = await client.query('SELECT * FROM briefings WHERE id = $1', [briefingId]);
    if (briefingResult.rows.length > 0) {
      const briefing = briefingResult.rows[0];
      console.log('   Nome projeto:', briefing.nome_projeto);
      console.log('   Cliente ID:', briefing.cliente_id);
      console.log('   Status:', briefing.status);
      console.log('   Criado em:', briefing.created_at);
      console.log('   Escritório:', briefing.escritorio_id);
    }
    
    console.log('');
    console.log('2. CLIENTE ASSOCIADO (Rafael):');
    const clienteRafael = await client.query('SELECT * FROM clientes WHERE id = $1', ['e24bb076-9318-497a-9f0e-3813d2cca2ce']);
    if (clienteRafael.rows.length > 0) {
      const cliente = clienteRafael.rows[0];
      console.log('   Nome:', cliente.nome);
      console.log('   Email:', cliente.email);
      console.log('   Escritório:', cliente.escritorio_id);
    }
    
    console.log('');
    console.log('3. OUTROS CLIENTES DISPONÍVEIS:');
    const todosClientes = await client.query('SELECT id, nome, email, escritorio_id FROM clientes LIMIT 10');
    todosClientes.rows.forEach(cliente => {
      console.log('   -', cliente.nome, '|', cliente.id.substring(0,8) + '...', '| Escritório:', cliente.escritorio_id);
    });
    
    console.log('');
    console.log('4. CLIENTE ANA (se existir):');
    const clienteAna = await client.query('SELECT * FROM clientes WHERE nome ILIKE $1', ['%ana%']);
    if (clienteAna.rows.length > 0) {
      clienteAna.rows.forEach(cliente => {
        console.log('   -', cliente.nome, '|', cliente.id, '| Escritório:', cliente.escritorio_id);
      });
    } else {
      console.log('   ❌ Nenhum cliente com nome Ana encontrado');
    }

    console.log('');
    console.log('5. BRIEFINGS RECENTES PARA DEBUG:');
    const briefingsRecentes = await client.query('SELECT id, nome_projeto, cliente_id, created_at FROM briefings ORDER BY created_at DESC LIMIT 5');
    briefingsRecentes.rows.forEach(briefing => {
      console.log('   -', briefing.nome_projeto, '|', 'Cliente:', briefing.cliente_id?.substring(0,8) + '...', '|', briefing.created_at);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

main(); 