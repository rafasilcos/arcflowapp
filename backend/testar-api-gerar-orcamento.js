/**
 * TESTAR API GERAR ORÇAMENTO
 * 
 * Este script testa a API completa de orçamentos
 * usando o usuário correto (rafasilcos@icloud.com)
 */

const axios = require('axios');

async function testarApiGerarOrcamento() {
  try {
    console.log('🔍 TESTANDO API COMPLETA DE ORÇAMENTOS');
    console.log('='.repeat(50));

    // 1. Login com usuário correto
    console.log('\n1. Fazendo login com rafasilcos@icloud.com...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'rafasilcos@icloud.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   Usuário: ${loginResponse.data.user.nome}`);
    console.log(`   Escritório: ${loginResponse.data.user.escritorio_id}`);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Testar API de orçamento específico (ID 7)
    console.log('\n2. Testando GET /api/orcamentos/7...');
    
    try {
      const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/7', { headers });

      console.log('✅ API de orçamento funcionou!');
      console.log(`   Status: ${orcamentoResponse.status}`);
      console.log(`   ID: ${orcamentoResponse.data.orcamento.id}`);
      console.log(`   Código: ${orcamentoResponse.data.orcamento.codigo}`);
      console.log(`   Nome: ${orcamentoResponse.data.orcamento.nome}`);
      console.log(`   Valor: R$ ${orcamentoResponse.data.orcamento.valor_total}`);
      
    } catch (orcError) {
      console.log('❌ API de orçamento falhou:', orcError.response?.status);
      console.log('   Mensagem:', orcError.response?.data?.message || orcError.message);
      
      if (orcError.response?.status === 500) {
        console.log('🔍 Erro 500 - Problema interno do servidor');
        console.log('   Provavelmente erro na query SQL');
      }
    }

    // 3. Testar listagem de orçamentos
    console.log('\n3. Testando GET /api/orcamentos (listagem)...');
    
    try {
      const listaResponse = await axios.get('http://localhost:3001/api/orcamentos', { headers });

      console.log('✅ Listagem funcionou!');
      console.log(`   Status: ${listaResponse.status}`);
      console.log(`   Total: ${listaResponse.data.orcamentos?.length || 0} orçamentos`);
      
      if (listaResponse.data.orcamentos?.length > 0) {
        console.log('   Orçamentos encontrados:');
        listaResponse.data.orcamentos.forEach(orc => {
          console.log(`     ID: ${orc.id} | Código: ${orc.codigo} | Valor: R$ ${orc.valor_total}`);
        });
      }
      
    } catch (listaError) {
      console.log('❌ Listagem falhou:', listaError.response?.status);
      console.log('   Mensagem:', listaError.response?.data?.message || listaError.message);
    }

    // 4. Testar geração de novo orçamento
    console.log('\n4. Testando geração de novo orçamento...');
    const briefingId = '8320013b-8caf-405e-aefc-401e29b61ef8'; // Casa REAL
    
    try {
      const gerarResponse = await axios.post(
        `http://localhost:3001/api/orcamentos-inteligentes/gerar/${briefingId}`, 
        {}, 
        { headers }
      );

      console.log('✅ Geração funcionou!');
      console.log(`   Status: ${gerarResponse.status}`);
      console.log(`   Novo orçamento ID: ${gerarResponse.data.orcamento?.id}`);
      console.log(`   Código: ${gerarResponse.data.orcamento?.codigo}`);
      console.log(`   Valor: R$ ${gerarResponse.data.orcamento?.valorTotal}`);
      
    } catch (gerarError) {
      console.log('❌ Geração falhou:', gerarError.response?.status);
      console.log('   Mensagem:', gerarError.response?.data?.message || gerarError.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 RESULTADO FINAL:');
    console.log('   Se a API de orçamento específico falhar com erro 500,');
    console.log('   o problema está na query SQL compilada em dist/routes/orcamentos.js');
    console.log('   Solução: Corrigir o arquivo TypeScript e recompilar');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarApiGerarOrcamento();