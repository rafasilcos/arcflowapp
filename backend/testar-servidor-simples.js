const fetch = require('node-fetch');

async function testarServidorSimples() {
  console.log('🧪 TESTANDO SERVIDOR SIMPLES');
  console.log('=' .repeat(60));
  
  try {
    // Testar login diretamente (sabemos que existe)
    console.log('\n🔐 TESTANDO LOGIN...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    console.log('Status do login:', loginResponse.status);
    
    if (loginResponse.ok) {
      console.log('✅ Servidor está rodando e respondendo!');
      
      const loginData = await loginResponse.json();
      const token = loginData.tokens?.accessToken || loginData.token;
      
      if (token) {
        console.log('✅ Token obtido com sucesso');
        
        // Testar geração de orçamento
        console.log('\n💰 TESTANDO GERAÇÃO DE ORÇAMENTO...');
        const briefingId = 'f4be8500-d82d-4fb4-9c16-caba13c71081';
        
        const orcamentoResponse = await fetch(`http://localhost:3001/api/orcamentos/gerar-briefing/${briefingId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Status da geração:', orcamentoResponse.status);
        
        const orcamentoData = await orcamentoResponse.json();
        
        if (orcamentoResponse.ok) {
          console.log('✅ Orçamento gerado!');
          console.log('Área:', orcamentoData.orcamento?.areaConstruida, 'm²');
          console.log('Valor:', `R$ ${orcamentoData.orcamento?.valorTotal?.toLocaleString('pt-BR')}`);
          
          // Verificar se está correto
          const area = orcamentoData.orcamento?.areaConstruida || 0;
          const valor = orcamentoData.orcamento?.valorTotal || 0;
          
          if (area >= 200 && valor > 100000) {
            console.log('🎉 CORREÇÃO FUNCIONOU!');
          } else {
            console.log('⚠️ Ainda há problemas nos dados');
          }
        } else {
          console.log('❌ Erro na geração:', orcamentoData);
        }
      }
    } else {
      console.log('❌ Servidor não está respondendo ao login');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n🔄 Tentando verificar se o servidor está rodando...');
    
    // Verificar processos Node
    console.log('Verificando processos Node.js ativos...');
  }
}

testarServidorSimples();