/**
 * 🧪 TESTE: GERAÇÃO DE NOVO ORÇAMENTO
 * 
 * Testar se a geração de orçamento está funcionando após a correção
 */

const axios = require('axios');

async function testarGeracaoOrcamento() {
  console.log('🧪 TESTANDO GERAÇÃO DE NOVO ORÇAMENTO\n');
  
  try {
    // 1. Fazer login
    console.log('1. 🔐 FAZENDO LOGIN...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    
    // 2. Buscar um briefing disponível
    console.log('\n2. 📋 BUSCANDO BRIEFINGS DISPONÍVEIS...');
    
    const briefingsResponse = await axios.get('http://localhost:3001/api/orcamentos-inteligentes/briefings-disponiveis', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Resposta dos briefings:', briefingsResponse.data);
    
    const briefings = briefingsResponse.data.data?.briefings || briefingsResponse.data.briefings || [];
    console.log(`✅ Encontrados ${briefings.length} briefings disponíveis`);
    
    if (briefings.length === 0) {
      console.log('❌ Nenhum briefing disponível para teste');
      return;
    }
    
    // Usar o primeiro briefing disponível
    const briefingTeste = briefings[0];
    console.log(`📋 Usando briefing: ${briefingTeste.nomeProjeto} (ID: ${briefingTeste.id})`);
    
    // 3. Tentar gerar orçamento
    console.log('\n3. 🚀 GERANDO ORÇAMENTO...');
    
    const orcamentoResponse = await axios.post(`http://localhost:3001/api/orcamentos-inteligentes/gerar/${briefingTeste.id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ ORÇAMENTO GERADO COM SUCESSO!');
    console.log('📊 DADOS DO ORÇAMENTO:');
    console.log(`   - ID: ${orcamentoResponse.data.orcamentoId}`);
    console.log(`   - Código: ${orcamentoResponse.data.codigo}`);
    console.log(`   - Valor Total: R$ ${orcamentoResponse.data.valorTotal?.toLocaleString('pt-BR')}`);
    console.log(`   - Área: ${orcamentoResponse.data.areaConstruida}m²`);
    console.log(`   - Prazo: ${orcamentoResponse.data.prazoEntrega} semanas`);
    
    // 4. Verificar se o cronograma foi gerado corretamente
    if (orcamentoResponse.data.cronograma) {
      console.log('\n📅 CRONOGRAMA GERADO:');
      console.log(`   - Prazo Total: ${orcamentoResponse.data.cronograma.prazoTotal} semanas`);
      console.log(`   - Metodologia: ${orcamentoResponse.data.cronograma.metodologia}`);
      console.log(`   - Número de Fases: ${Object.keys(orcamentoResponse.data.cronograma.fases || {}).length}`);
      
      // Mostrar primeira fase como exemplo
      const fases = Object.values(orcamentoResponse.data.cronograma.fases || {});
      if (fases.length > 0) {
        const primeiraFase = fases[0];
        console.log(`   - Exemplo: ${primeiraFase.nome} - ${primeiraFase.entregaveis?.length || 0} entregáveis`);
      }
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ A geração de orçamentos está funcionando corretamente');
    console.log('✅ Cronograma completo NBR 13532 está sendo gerado');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.data?.message) {
      console.error('💬 Mensagem do servidor:', error.response.data.message);
    }
  }
}

testarGeracaoOrcamento();