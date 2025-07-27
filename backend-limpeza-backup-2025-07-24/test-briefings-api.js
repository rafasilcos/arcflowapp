// Script para testar API de briefings
const axios = require('axios');

const testBriefingsAPI = async () => {
  try {
    console.log('🔍 Testando API de briefings...');
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTc4OTAtMTIzNC01Njc4OTBhYmNkZWYiLCJlc2NyaXRvcmlvSWQiOiJmNDdhYzEwYi01OGNjLTQzNzItYTU2Ny0wZTAyYjJjM2Q0NzkiLCJpYXQiOjE3MzU2NDA1OTZ9.DgHaGuU5G_7DqfVUYhcOBSDFoX9zVByKi5RgItG-Osk';
    
    const response = await axios.get('http://localhost:3001/api/briefings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Status:', response.status);
    console.log('✅ Estrutura da resposta:', Object.keys(response.data));
    console.log('✅ Total de briefings:', response.data.briefings?.length || 0);
    
    if (response.data.briefings && response.data.briefings.length > 0) {
      console.log('✅ Primeiro briefing:', {
        id: response.data.briefings[0].id,
        nomeProjeto: response.data.briefings[0].nomeProjeto,
        status: response.data.briefings[0].status
      });
    }
    
    console.log('✅ Paginação:', response.data.pagination);
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.response?.status);
    console.error('❌ Dados do erro:', error.response?.data);
  }
};

testBriefingsAPI(); 