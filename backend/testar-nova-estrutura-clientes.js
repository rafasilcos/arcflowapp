const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function testarNovaEstrutura() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco de dados');
    
    // 1. Verificar estrutura da tabela
    console.log('\n📋 VERIFICANDO ESTRUTURA DA NOVA TABELA...');
    const estrutura = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position;
    `);
    
    console.log('✅ Colunas encontradas:');
    estrutura.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.column_name} (${row.data_type}) - Nullable: ${row.is_nullable}`);
    });
    
    // 2. Testar criação de cliente
    console.log('\n🆕 TESTANDO CRIAÇÃO DE CLIENTE...');
    const clienteId = 'cliente_teste_' + Date.now();
    
    const novoCliente = await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, tipo_pessoa, cpf, 
        endereco_cep, endereco_logradouro, endereco_numero, 
        endereco_bairro, endereco_cidade, endereco_uf, endereco_pais,
        profissao, data_nascimento, status, escritorio_id,
        familia, origem, preferencias, observacoes,
        created_by, created_at, updated_at, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW(), NOW(), true)
      RETURNING *;
    `, [
      clienteId,
      'João Silva Teste',
      'joao.teste@email.com',
      '(11) 99999-9999',
      'fisica',
      '123.456.789-00',
      '01234-567',
      'Rua das Flores',
      '123',
      'Centro',
      'São Paulo',
      'SP',
      'Brasil',
      'Engenheiro Civil',
      '1985-06-15',
      'ativo',
      'escritorio_teste',
      JSON.stringify({
        conjuge: 'Maria Silva',
        filhos: [{ nome: 'Pedro', idade: 10 }],
        pets: [{ tipo: 'Cão', quantidade: 1 }]
      }),
      JSON.stringify({
        fonte: 'site',
        dataContato: new Date().toISOString(),
        responsavelComercial: 'Ana Santos'
      }),
      JSON.stringify({
        estilosArquitetonicos: ['moderno', 'contemporaneo'],
        materiaisPreferidos: ['vidro', 'concreto'],
        coresPreferidas: ['branco', 'cinza']
      }),
      'Cliente de teste para verificar nova estrutura',
      'user_system'
    ]);
    
    console.log('✅ Cliente criado com sucesso:', {
      id: novoCliente.rows[0].id,
      nome: novoCliente.rows[0].nome,
      email: novoCliente.rows[0].email
    });
    
    // 3. Testar busca de cliente
    console.log('\n🔍 TESTANDO BUSCA DE CLIENTE...');
    const clienteBuscado = await client.query(`
      SELECT * FROM clientes WHERE id = $1
    `, [clienteId]);
    
    if (clienteBuscado.rows.length > 0) {
      const cliente = clienteBuscado.rows[0];
      console.log('✅ Cliente encontrado:', {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        tipoPessoa: cliente.tipo_pessoa,
        endereco: {
          cep: cliente.endereco_cep,
          logradouro: cliente.endereco_logradouro,
          numero: cliente.endereco_numero,
          cidade: cliente.endereco_cidade
        },
        familia: cliente.familia,
        origem: cliente.origem,
        preferencias: cliente.preferencias
      });
    }
    
    // 4. Testar atualização de cliente
    console.log('\n📝 TESTANDO ATUALIZAÇÃO DE CLIENTE...');
    const clienteAtualizado = await client.query(`
      UPDATE clientes 
      SET 
        telefone = $1,
        endereco_complemento = $2,
        observacoes = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `, [
      '(11) 88888-8888',
      'Apartamento 101',
      'Observações atualizadas',
      clienteId
    ]);
    
    console.log('✅ Cliente atualizado:', {
      telefone: clienteAtualizado.rows[0].telefone,
      complemento: clienteAtualizado.rows[0].endereco_complemento,
      observacoes: clienteAtualizado.rows[0].observacoes
    });
    
    // 5. Testar soft delete
    console.log('\n🗑️ TESTANDO SOFT DELETE...');
    await client.query(`
      UPDATE clientes 
      SET 
        is_active = false,
        deleted_at = NOW(),
        deleted_by = $1
      WHERE id = $2
    `, ['user_system', clienteId]);
    
    console.log('✅ Soft delete realizado');
    
    // 6. Testar restauração
    console.log('\n🔄 TESTANDO RESTAURAÇÃO...');
    await client.query(`
      UPDATE clientes 
      SET 
        is_active = true,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_at = NOW()
      WHERE id = $1
    `, [clienteId]);
    
    console.log('✅ Cliente restaurado');
    
    // 7. Limpeza - remover cliente de teste
    console.log('\n🧹 LIMPANDO DADOS DE TESTE...');
    await client.query(`DELETE FROM clientes WHERE id = $1`, [clienteId]);
    console.log('✅ Dados de teste removidos');
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM! A nova estrutura está funcionando perfeitamente.');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

// Executar testes
testarNovaEstrutura(); 