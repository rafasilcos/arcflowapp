// Script para verificar status da API
const axios = require('axios');

const checkStatus = async () => {
  try {
    console.log('🔍 Verificando status da API...');
    
    // Testar rota de status sem autenticação
    const response = await axios.get('http://localhost:3001/api/auth/status');
    
    console.log('✅ API Status:', response.status);
    console.log('✅ Resposta:', response.data);
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.response?.status || error.message);
    console.error('❌ Dados do erro:', error.response?.data || 'Sem dados');
  }
};

checkStatus(); 