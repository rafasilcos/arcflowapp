const { Client } = require('pg');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const API_BASE = 'http://localhost:3001';

async function runCompleteTest() {
  try {
    console.log('🚀 TESTE COMPLETO: CORRIGINDO E TESTANDO SISTEMA DE CLIENTES\n');

    // FASE 1: Atualizar estrutura da tabela
    console.log('📊 FASE 1: Atualizando estrutura da tabela clientes...');
    await updateTableStructure();

    // FASE 2: Testar APIs
    console.log('\n🧪 FASE 2: Testando APIs com dados completos...');
    await testCompleteAPIs();

    console.log('\n🎉 TESTE COMPLETO FINALIZADO COM SUCESSO!');
    console.log('✅ Agora o sistema deve funcionar perfeitamente!');

  } catch (error) {
    console.error('❌ Erro no teste completo:', error);
  } finally {
    await client.end();
  }
}

async function updateTableStructure() {
  try {
    await client.connect();

    // Lista de colunas a adicionar
    const newColumns = [
      'cpf VARCHAR(20)',
      'cnpj VARCHAR(30)',
      'profissao VARCHAR(255)',
      'tipo_pessoa VARCHAR(20)',
      'data_nascimento DATE',
      'data_fundacao DATE',
      'endereco_numero VARCHAR(20)',
      'endereco_complemento VARCHAR(255)',
      'endereco_bairro VARCHAR(255)',
      'endereco_cep VARCHAR(20)',
      'endereco_pais VARCHAR(100)',
      'familia JSONB',
      'origem JSONB',
      'preferencias JSONB',
      'historico_projetos JSONB',
      'status VARCHAR(20)'
    ];

    console.log('   🔧 Adicionando colunas necessárias...');
    
    for (const column of newColumns) {
      try {
        const [name] = column.split(' ');
        await client.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ${column}`);
        console.log(`   ✅ ${name}`);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log(`   ⚠️ ${column}: ${error.message}`);
        }
      }
    }

    // Definir valores padrão
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

    console.log('   ✅ Estrutura da tabela atualizada com sucesso!');

  } catch (error) {
    console.error('   ❌ Erro ao atualizar tabela:', error.message);
    throw error;
  }
}

async function testCompleteAPIs() {
  try {
    // 1. Login
    console.log('   1. Fazendo login...');
    const login = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = login.data.tokens.accessToken;
    console.log('   ✅ Login realizado');

    // 2. Criar cliente com TODOS os campos
    console.log('   2. Criando cliente com dados completos...');
    const clienteCompleto = {
      nome: 'Cliente Teste Completo',
      email: 'teste-completo@exemplo.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      profissao: 'Engenheiro Civil',
      dataNascimento: '1985-05-15',
      endereco: {
        logradouro: 'Rua Teste Completa, 123',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01234-567',
        pais: 'Brasil'
      },
      familia: {
        conjuge: 'Maria Silva',
        filhos: [
          { nome: 'João', idade: 10, necessidadesEspeciais: 'Nenhuma' }
        ],
        pets: [
          { tipo: 'Cachorro', quantidade: 1 }
        ]
      },
      origem: {
        fonte: 'site',
        dataContato: new Date().toISOString(),
        responsavelComercial: 'Carlos Vendas',
        conversasAnteriores: []
      },
      preferencias: {
        estilosArquitetonicos: ['Moderno', 'Minimalista'],
        materiaisPreferidos: ['Concreto', 'Vidro'],
        coresPreferidas: ['Branco', 'Cinza'],
        orcamentoMedioHistorico: 250000,
        prazoTipicoPreferido: 12
      },
      historicoProjetos: [],
      status: 'vip',
      observacoes: 'Cliente criado com dados completos para teste'
    };

    const novoCliente = await axios.post(`${API_BASE}/api/clientes`, clienteCompleto, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('   ✅ Cliente criado:', novoCliente.data.cliente.nome);
    const clienteId = novoCliente.data.cliente.id;

    // 3. Atualizar cliente
    console.log('   3. Atualizando cliente...');
    const dadosAtualizacao = {
      ...clienteCompleto,
      nome: 'Cliente Teste Completo ATUALIZADO',
      telefone: '(11) 88888-8888',
      profissao: 'Arquiteto',
      status: 'ativo',
      observacoes: 'Cliente atualizado com sucesso'
    };

    const clienteAtualizado = await axios.put(`${API_BASE}/api/clientes/${clienteId}`, dadosAtualizacao, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('   ✅ Cliente atualizado:', clienteAtualizado.data.cliente.nome);

    // 4. Buscar cliente específico
    console.log('   4. Buscando cliente específico...');
    const clienteEspecifico = await axios.get(`${API_BASE}/api/clientes/${clienteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('   ✅ Cliente encontrado:', clienteEspecifico.data.cliente.nome);

    // 5. Listar todos os clientes
    console.log('   5. Listando todos os clientes...');
    const todosClientes = await axios.get(`${API_BASE}/api/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`   ✅ Total de clientes: ${todosClientes.data.clientes?.length || 0}`);

    // 6. Verificar dados no banco
    console.log('   6. Verificando dados no banco...');
    const clienteNoBanco = await client.query('SELECT * FROM clientes WHERE id = $1', [clienteId]);
    
    if (clienteNoBanco.rows.length > 0) {
      const cliente = clienteNoBanco.rows[0];
      console.log('   ✅ Cliente encontrado no banco:');
      console.log(`      - Nome: ${cliente.nome}`);
      console.log(`      - Email: ${cliente.email}`);
      console.log(`      - Telefone: ${cliente.telefone}`);
      console.log(`      - Profissão: ${cliente.profissao}`);
      console.log(`      - Tipo Pessoa: ${cliente.tipo_pessoa}`);
      console.log(`      - Status: ${cliente.status}`);
      console.log(`      - Endereço Completo: ${cliente.endereco}, ${cliente.endereco_numero}, ${cliente.endereco_bairro}`);
      console.log(`      - Família: ${JSON.stringify(cliente.familia)}`);
      console.log(`      - Preferências: ${JSON.stringify(cliente.preferencias)}`);
    } else {
      console.log('   ❌ Cliente não encontrado no banco!');
    }

    console.log('   ✅ Todos os testes de API passaram!');

  } catch (error) {
    console.error('   ❌ Erro no teste de API:', error.response?.data || error.message);
    throw error;
  }
}

runCompleteTest(); 