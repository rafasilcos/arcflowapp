const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function updateClientesTable() {
  try {
    await client.connect();
    console.log('🔄 Atualizando tabela clientes para suportar todos os campos do formulário...\n');

    // 1. Verificar estrutura atual
    console.log('1. Verificando estrutura atual...');
    const currentStructure = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Colunas atuais:');
    currentStructure.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });

    // 2. Lista de colunas a adicionar
    const newColumns = [
      { name: 'cpf', type: 'VARCHAR(20)', description: 'CPF do cliente (pessoa física)' },
      { name: 'cnpj', type: 'VARCHAR(30)', description: 'CNPJ do cliente (pessoa jurídica)' },
      { name: 'profissao', type: 'VARCHAR(255)', description: 'Profissão do cliente' },
      { name: 'tipo_pessoa', type: 'VARCHAR(20)', description: 'fisica ou juridica' },
      { name: 'data_nascimento', type: 'DATE', description: 'Data de nascimento (pessoa física)' },
      { name: 'data_fundacao', type: 'DATE', description: 'Data de fundação (pessoa jurídica)' },
      { name: 'endereco_numero', type: 'VARCHAR(20)', description: 'Número do endereço' },
      { name: 'endereco_complemento', type: 'VARCHAR(255)', description: 'Complemento do endereço' },
      { name: 'endereco_bairro', type: 'VARCHAR(255)', description: 'Bairro' },
      { name: 'endereco_cep', type: 'VARCHAR(20)', description: 'CEP' },
      { name: 'endereco_pais', type: 'VARCHAR(100)', description: 'País' },
      { name: 'familia', type: 'JSONB', description: 'Dados da família (cônjuge, filhos, pets)' },
      { name: 'origem', type: 'JSONB', description: 'Origem do lead e dados comerciais' },
      { name: 'preferencias', type: 'JSONB', description: 'Preferências arquitetônicas e orçamentárias' },
      { name: 'historico_projetos', type: 'JSONB', description: 'Histórico de projetos anteriores' },
      { name: 'status', type: 'VARCHAR(20)', description: 'Status do cliente (ativo, inativo, vip, problema)' }
    ];

    // 3. Adicionar colunas que não existem
    console.log('\n2. Adicionando novas colunas...');
    
    for (const column of newColumns) {
      try {
        // Verificar se a coluna já existe
        const exists = currentStructure.rows.find(row => row.column_name === column.name);
        
        if (!exists) {
          console.log(`   ➕ Adicionando: ${column.name} (${column.type})`);
          await client.query(`ALTER TABLE clientes ADD COLUMN ${column.name} ${column.type}`);
        } else {
          console.log(`   ✅ Já existe: ${column.name}`);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao adicionar ${column.name}:`, error.message);
      }
    }

    // 4. Definir valores padrão para colunas existentes
    console.log('\n3. Definindo valores padrão...');
    
    try {
      await client.query(`
        UPDATE clientes 
        SET 
          endereco_pais = COALESCE(endereco_pais, 'Brasil'),
          status = COALESCE(status, 'ativo'),
          familia = COALESCE(familia, '{}'),
          origem = COALESCE(origem, '{}'),
          preferencias = COALESCE(preferencias, '{}'),
          historico_projetos = COALESCE(historico_projetos, '[]')
        WHERE endereco_pais IS NULL 
           OR status IS NULL 
           OR familia IS NULL 
           OR origem IS NULL 
           OR preferencias IS NULL 
           OR historico_projetos IS NULL
      `);
      console.log('   ✅ Valores padrão definidos');
    } catch (error) {
      console.log('   ⚠️ Erro ao definir valores padrão:', error.message);
    }

    // 5. Criar índices para performance
    console.log('\n4. Criando índices...');
    
    const indexes = [
      { name: 'idx_clientes_status', column: 'status' },
      { name: 'idx_clientes_tipo_pessoa', column: 'tipo_pessoa' },
      { name: 'idx_clientes_endereco_cidade', column: 'cidade' },
      { name: 'idx_clientes_endereco_cep', column: 'endereco_cep' }
    ];

    for (const index of indexes) {
      try {
        await client.query(`
          CREATE INDEX IF NOT EXISTS ${index.name} 
          ON clientes(${index.column})
        `);
        console.log(`   ✅ Índice criado: ${index.name}`);
      } catch (error) {
        console.log(`   ⚠️ Erro ao criar índice ${index.name}:`, error.message);
      }
    }

    // 6. Verificar estrutura final
    console.log('\n5. Verificando estrutura final...');
    const finalStructure = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Estrutura final da tabela clientes:');
    finalStructure.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.column_name} (${row.data_type})`);
    });

    console.log('\n🎉 Tabela clientes atualizada com sucesso!');
    console.log('✅ Agora todos os campos do formulário podem ser salvos no banco.');

  } catch (error) {
    console.error('❌ Erro ao atualizar tabela:', error);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

updateClientesTable(); 