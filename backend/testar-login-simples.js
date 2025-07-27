/**
 * TESTAR LOGIN SIMPLES
 * 
 * Este script testa diferentes combinações de login
 * para encontrar as credenciais corretas
 */

const axios = require('axios');

async function testarLoginSimples() {
  try {
    console.log('🔍 TESTANDO LOGIN SIMPLES');
    console.log('='.repeat(50));

    const credenciais = [
      { email: 'admin@arcflow.com', password: 'admin123' },
      { email: 'admin@arcflow.com', password: '123456' },
      { email: 'rafasilcos@icloud.com', password: 'admin123' },
      { email: 'rafasilcos@icloud.com', password: '123456' },
      { email: 'teste@arcflow.com', password: 'admin123' },
      { email: 'teste@arcflow.com', password: '123456' }
    ];

    for (let i = 0; i < credenciais.length; i++) {
      const cred = credenciais[i];
      console.log(`\n${i + 1}. Testando ${cred.email} com senha ${cred.password}...`);
      
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          email: cred.email,
          password: cred.password
        });

        console.log('✅ LOGIN FUNCIONOU!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Token: ${response.data.token?.substring(0, 20)}...`);
        console.log(`   Usuário: ${response.data.user?.nome}`);
        console.log(`   Escritório: ${response.data.user?.escritorio_id}`);
        
        // Se login funcionou, testar a API de orçamento
        console.log('\n🔍 Testando API de orçamento com este token...');
        
        try {
          const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/7', {
            headers: {
              'Authorization': `Bearer ${response.data.token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('✅ API de orçamento FUNCIONOU!');
          console.log(`   Status: ${orcamentoResponse.status}`);
          console.log(`   Orçamento: ${orcamentoResponse.data.nome}`);
          console.log(`   Valor: R$ ${orcamentoResponse.data.valor_total}`);
          
          return; // Sucesso total, parar aqui
          
        } catch (orcError) {
          console.log('❌ API de orçamento falhou:', orcError.response?.status);
          console.log('   Mensagem:', orcError.response?.data?.message || orcError.message);
          
          if (orcError.response?.status === 404) {
            console.log('🔍 Erro 404 - Orçamento não encontrado');
            console.log('   Possível problema: escritorio_id não bate');
          }
        }
        
      } catch (loginError) {
        console.log('❌ Login falhou:', loginError.response?.status || 'Sem resposta');
        if (loginError.response?.data) {
          console.log('   Mensagem:', loginError.response.data.message || loginError.response.data);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 RESULTADO: Nenhuma combinação de login funcionou');
    console.log('   Possíveis problemas:');
    console.log('   - Servidor não está rodando corretamente');
    console.log('   - Senhas estão incorretas no banco');
    console.log('   - Problema na API de autenticação');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarLoginSimples();