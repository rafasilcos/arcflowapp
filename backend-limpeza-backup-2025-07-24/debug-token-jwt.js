/**
 * DEBUG TOKEN JWT
 * 
 * Este script verifica se o token JWT está sendo decodificado corretamente
 * e se o escritorio_id está sendo passado para a API
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

async function debugTokenJwt() {
  try {
    console.log('🔍 DEBUG TOKEN JWT');
    console.log('='.repeat(50));

    // 1. Fazer login e obter token
    console.log('\n1. Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'rafasilcos@icloud.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Token: ${token.substring(0, 30)}...`);

    // 2. Decodificar token JWT
    console.log('\n2. Decodificando token JWT...');
    const JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024';
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token decodificado com sucesso:');
      console.log(`   ID: ${decoded.id}`);
      console.log(`   Email: ${decoded.email}`);
      console.log(`   Nome: ${decoded.nome}`);
      console.log(`   Role: ${decoded.role}`);
      console.log(`   Escritório ID: ${decoded.escritorioId}`);
      console.log(`   Server Instance: ${decoded.serverInstanceId}`);
      
      // Verificar se escritorioId está presente
      if (decoded.escritorioId) {
        console.log('✅ escritorioId presente no token');
      } else {
        console.log('❌ escritorioId AUSENTE no token - ESTE É O PROBLEMA!');
      }
      
    } catch (jwtError) {
      console.log('❌ Erro ao decodificar token:', jwtError.message);
    }

    // 3. Testar endpoint /api/auth/me para ver dados do usuário
    console.log('\n3. Testando endpoint /api/auth/me...');
    
    try {
      const meResponse = await axios.get('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Endpoint /api/auth/me funcionou:');
      console.log(`   ID: ${meResponse.data.id}`);
      console.log(`   Email: ${meResponse.data.email}`);
      console.log(`   Nome: ${meResponse.data.nome}`);
      console.log(`   Escritório ID: ${meResponse.data.escritorio_id || meResponse.data.escritorioId}`);
      
    } catch (meError) {
      console.log('❌ Endpoint /api/auth/me falhou:', meError.response?.status);
      console.log('   Mensagem:', meError.response?.data || meError.message);
    }

    // 4. Fazer uma requisição de debug para ver o que chega na API
    console.log('\n4. Fazendo requisição de debug...');
    
    try {
      // Vou tentar acessar a listagem de orçamentos para ver se o problema é geral
      const listaResponse = await axios.get('http://localhost:3001/api/orcamentos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Listagem de orçamentos funcionou:');
      console.log(`   Status: ${listaResponse.status}`);
      console.log(`   Total: ${listaResponse.data.orcamentos?.length || 0} orçamentos`);
      
      if (listaResponse.data.orcamentos?.length > 0) {
        console.log('   Orçamentos encontrados:');
        listaResponse.data.orcamentos.forEach(orc => {
          console.log(`     ID: ${orc.id} | Código: ${orc.codigo}`);
        });
        
        // Verificar se o orçamento ID 7 aparece na lista
        const orcamento7 = listaResponse.data.orcamentos.find(o => o.id === 7);
        if (orcamento7) {
          console.log('✅ Orçamento ID 7 APARECE na listagem!');
          console.log('   PROBLEMA: API de busca individual tem bug específico');
        } else {
          console.log('❌ Orçamento ID 7 NÃO APARECE na listagem');
          console.log('   PROBLEMA: Filtro de escritório está bloqueando');
        }
      }
      
    } catch (listaError) {
      console.log('❌ Listagem falhou:', listaError.response?.status);
      console.log('   Mensagem:', listaError.response?.data || listaError.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNÓSTICO:');
    console.log('   Se o token tem escritorioId mas a API não encontra o orçamento,');
    console.log('   o problema pode estar no middleware de autenticação da API');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

debugTokenJwt();