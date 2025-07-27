const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testClientesAPI() {
  try {
    console.log('🚀 Testando API de Clientes...\n');

    // 1. Testar health check
    console.log('1. 🏥 Testando health check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check OK:', health.data.status);

    // 2. Testar listagem de clientes
    console.log('\n2. 📋 Testando listagem de clientes...');
    const listaClientes = await axios.get(`${API_URL}/clientes`);
    console.log('✅ Listagem OK:', listaClientes.data.clientes.length, 'clientes encontrados');
    console.log('📊 Paginação:', listaClientes.data.pagination);

    // 3. Testar criação de cliente
    console.log('\n3. ➕ Testando criação de cliente...');
    const novoCliente = {
      nome: 'Maria Silva Teste API',
      email: 'maria.api@teste.com',
      telefone: '(11) 99999-1234',
      tipoPessoa: 'fisica',
      cpf: '987.654.321-00',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua API, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      observacoes: 'Cliente criado via teste da API',
      status: 'ativo'
    };

    const clienteCriado = await axios.post(`${API_URL}/clientes`, novoCliente);
    console.log('✅ Cliente criado:', clienteCriado.data.cliente.id);
    console.log('📝 Nome:', clienteCriado.data.cliente.nome);

    const clienteId = clienteCriado.data.cliente.id;

    // 4. Testar busca de cliente específico
    console.log('\n4. 🔍 Testando busca de cliente específico...');
    const clienteEspecifico = await axios.get(`${API_URL}/clientes/${clienteId}`);
    console.log('✅ Cliente encontrado:', clienteEspecifico.data.cliente.nome);

    // 5. Testar atualização de cliente
    console.log('\n5. ✏️ Testando atualização de cliente...');
    const dadosAtualizacao = {
      telefone: '(11) 88888-1234',
      observacoes: 'Cliente atualizado via API'
    };

    const clienteAtualizado = await axios.put(`${API_URL}/clientes/${clienteId}`, dadosAtualizacao);
    console.log('✅ Cliente atualizado:', clienteAtualizado.data.cliente.telefone);

    // 6. Testar busca com filtros
    console.log('\n6. 🎯 Testando busca com filtros...');
    const buscaFiltrada = await axios.get(`${API_URL}/clientes?search=Maria&status=ativo`);
    console.log('✅ Busca filtrada:', buscaFiltrada.data.clientes.length, 'resultados');

    // 7. Testar estatísticas
    console.log('\n7. 📊 Testando estatísticas...');
    const stats = await axios.get(`${API_URL}/clientes/stats/overview`);
    console.log('✅ Estatísticas obtidas:');
    console.log('  - Total:', stats.data.total);
    console.log('  - Ativos:', stats.data.ativos);
    console.log('  - VIP:', stats.data.vip);

    // 8. Testar exclusão (soft delete)
    console.log('\n8. 🗑️ Testando exclusão de cliente...');
    await axios.delete(`${API_URL}/clientes/${clienteId}`);
    console.log('✅ Cliente excluído com sucesso');

    // 9. Verificar se cliente foi realmente excluído
    console.log('\n9. ✅ Verificando exclusão...');
    try {
      await axios.get(`${API_URL}/clientes/${clienteId}`);
      console.log('❌ Erro: Cliente deveria estar excluído');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Confirmado: Cliente foi excluído corretamente');
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    console.log('\n🎉 Todos os testes da API passaram com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste da API:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Aguardar um pouco para o servidor iniciar
setTimeout(() => {
  testClientesAPI();
}, 3000);

console.log('⏳ Aguardando servidor iniciar...'); 