const fetch = require('node-fetch');

async function testarServidorCorrigido() {
  console.log('🧪 TESTANDO SERVIDOR COM CORREÇÕES APLICADAS');
  console.log('=' .repeat(60));
  
  try {
    // 1. Testar se servidor está rodando
    console.log('\n🔍 1. VERIFICANDO SERVIDOR...');
    const healthResponse = await fetch('http://localhost:3001/health');
    
    if (!healthResponse.ok) {
      throw new Error('Servidor não está respondendo');
    }
    
    console.log('✅ Servidor está rodando na porta 3001');
    
    // 2. Fazer login
    console.log('\n🔐 2. FAZENDO LOGIN...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Erro no login: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.tokens?.accessToken || loginData.token;
    
    if (!token) {
      throw new Error('Token não encontrado na resposta do login');
    }
    
    console.log('✅ Login realizado com sucesso');
    
    // 3. Testar geração de orçamento com briefing problemático
    console.log('\n💰 3. TESTANDO GERAÇÃO DE ORÇAMENTO CORRIGIDA...');
    const briefingId = 'f4be8500-d82d-4fb4-9c16-caba13c71081'; // Casa Florianopolis 2
    
    console.log(`🔄 Gerando orçamento para briefing: ${briefingId}`);
    
    const orcamentoResponse = await fetch(`http://localhost:3001/api/orcamentos/gerar-briefing/${briefingId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const orcamentoData = await orcamentoResponse.json();
    
    if (!orcamentoResponse.ok) {
      console.log('❌ Erro na geração do orçamento:');
      console.log('Status:', orcamentoResponse.status);
      console.log('Resposta:', JSON.stringify(orcamentoData, null, 2));
      throw new Error(`Erro ao gerar orçamento: ${orcamentoData.error || 'Erro desconhecido'}`);
    }
    
    console.log('✅ Orçamento gerado com sucesso!');
    console.log('\n📊 DADOS DO ORÇAMENTO GERADO:');
    console.log('ID:', orcamentoData.orcamento.id);
    console.log('Código:', orcamentoData.orcamento.codigo);
    console.log('Nome:', orcamentoData.orcamento.nome);
    console.log('Status:', orcamentoData.orcamento.status);
    console.log('Área Construída:', orcamentoData.orcamento.areaConstruida, 'm²');
    console.log('Valor Total:', `R$ ${orcamentoData.orcamento.valorTotal.toLocaleString('pt-BR')}`);
    console.log('Valor/m²:', `R$ ${orcamentoData.orcamento.valorPorM2.toLocaleString('pt-BR')}`);
    
    // 4. Verificar se os dados estão corretos
    console.log('\n🔍 4. VERIFICAÇÃO DOS DADOS:');
    
    const areaCorreta = orcamentoData.orcamento.areaConstruida >= 200; // Área esperada ~250m²
    const valorCoerente = orcamentoData.orcamento.valorTotal > 100000; // Valor esperado ~187k
    
    console.log(`📐 Área construída: ${orcamentoData.orcamento.areaConstruida}m² - ${areaCorreta ? '✅ OK' : '❌ AINDA INCORRETA'}`);
    console.log(`💰 Valor total: R$ ${orcamentoData.orcamento.valorTotal.toLocaleString('pt-BR')} - ${valorCoerente ? '✅ OK' : '❌ AINDA INCORRETO'}`);
    
    if (areaCorreta && valorCoerente) {
      console.log('\n🎉 CORREÇÃO FUNCIONOU! O orçamento foi gerado corretamente.');
      console.log('✅ O problema foi resolvido com sucesso!');
    } else {
      console.log('\n⚠️ CORREÇÃO NÃO APLICADA! Ainda há problemas.');
      console.log('❌ O servidor pode não estar usando a versão corrigida.');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 TESTE CONCLUÍDO');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarServidorCorrigido();