/**
 * TESTAR API ORÇAMENTO ESPECÍFICO
 * 
 * Este script testa especificamente a API GET /api/orcamentos/7
 * com o usuário correto
 */

const axios = require('axios');

async function testarApiOrcamentoEspecifico() {
  try {
    console.log('🔍 TESTANDO API ORÇAMENTO ESPECÍFICO');
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
    console.log(`   Escritório: ${loginResponse.data.user.escritorioId}`);

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
      console.log(`   Dados:`, JSON.stringify(orcamentoResponse.data, null, 2));
      
    } catch (orcError) {
      console.log('❌ API de orçamento falhou:', orcError.response?.status);
      console.log('   Mensagem:', orcError.response?.data || orcError.message);
      
      if (orcError.response?.status === 500) {
        console.log('🔍 Erro 500 - Problema interno do servidor');
        console.log('   Provavelmente erro na query SQL com b.nome');
        
        // Vou tentar corrigir o arquivo compilado diretamente
        console.log('\n🔧 TENTANDO CORRIGIR O ARQUIVO COMPILADO...');
        await corrigirArquivoCompilado();
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function corrigirArquivoCompilado() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const arquivoPath = path.join(__dirname, 'dist/routes/orcamentos.js');
    let conteudo = fs.readFileSync(arquivoPath, 'utf8');
    
    // Procurar e substituir b.nome por b.nome_projeto
    const antes = conteudo;
    conteudo = conteudo.replace(/b\.nome(?!_)/g, 'b.nome_projeto');
    
    if (conteudo !== antes) {
      fs.writeFileSync(arquivoPath, conteudo);
      console.log('✅ Arquivo corrigido! Substituído b.nome por b.nome_projeto');
      
      // Reiniciar o servidor seria necessário, mas vamos tentar testar novamente
      console.log('⚠️ Reinicie o servidor backend para aplicar as correções');
    } else {
      console.log('ℹ️ Nenhuma ocorrência de b.nome encontrada no arquivo');
    }
    
  } catch (error) {
    console.error('❌ Erro ao corrigir arquivo:', error.message);
  }
}

testarApiOrcamentoEspecifico();