/**
 * 🔧 TESTE BÁSICO - IDENTIFICAR PROBLEMA ESPECÍFICO
 * Teste mínimo para identificar exatamente onde está falhando
 */

async function testeBasico() {
  console.log('🔧 TESTE BÁSICO - IDENTIFICAR PROBLEMA ESPECÍFICO\n');

  const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const baseURL = 'http://localhost:3000';

  try {
    // 1. Teste GET básico
    console.log('1️⃣ Teste GET básico...');
    
    const getResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    console.log(`Status GET: ${getResponse.status}`);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('✅ GET funcionou');
      console.log(`Disciplinas: ${Object.keys(getData.data.disciplinas).length}`);
    } else {
      console.log('❌ GET falhou');
      return;
    }

    // 2. Teste PUT com dados mínimos absolutos
    console.log('\n2️⃣ Teste PUT com dados mínimos absolutos...');
    
    const dadosMinimos = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 20000
        }
      }
    };

    console.log('Enviando:', JSON.stringify(dadosMinimos));

    const putResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        configuracoes: dadosMinimos,
        versao: '1.0'
      })
    });

    console.log(`Status PUT: ${putResponse.status}`);
    console.log(`Headers: ${JSON.stringify(Object.fromEntries(putResponse.headers.entries()))}`);

    if (putResponse.ok) {
      const putData = await putResponse.json();
      console.log('✅ PUT funcionou');
      console.log(`Valor salvo: ${putData.data.disciplinas.ARQUITETURA.valor_base}`);
    } else {
      const errorText = await putResponse.text();
      console.log('❌ PUT falhou');
      console.log(`Erro completo: ${errorText}`);
      
      // Tentar parsear como JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log(`Erro estruturado:`, errorJson);
      } catch (e) {
        console.log('Erro não é JSON válido');
      }
    }

    // 3. Teste com dados ainda mais simples
    console.log('\n3️⃣ Teste com dados ultra simples...');
    
    const dadosUltraSimples = {
      test: "value"
    };

    const ultraResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        configuracoes: dadosUltraSimples,
        versao: '1.0'
      })
    });

    console.log(`Status ultra simples: ${ultraResponse.status}`);

    if (ultraResponse.ok) {
      console.log('✅ Dados ultra simples funcionaram');
    } else {
      const ultraError = await ultraResponse.text();
      console.log('❌ Dados ultra simples falharam');
      console.log(`Erro: ${ultraError.substring(0, 200)}`);
    }

    // 4. Verificar se o problema é no servidor Next.js
    console.log('\n4️⃣ Verificando servidor Next.js...');
    
    try {
      const healthResponse = await fetch(`${baseURL}/api/health`);
      console.log(`Health check status: ${healthResponse.status}`);
    } catch (healthError) {
      console.log('❌ Erro no health check:', healthError.message);
    }

    // 5. Teste direto no banco (se possível)
    console.log('\n5️⃣ Informações de debug...');
    console.log('URL base:', baseURL);
    console.log('Escritório ID:', escritorioId);
    console.log('Timestamp:', new Date().toISOString());

    console.log('\n🔍 POSSÍVEIS CAUSAS:');
    console.log('1. Servidor Next.js não está rodando corretamente');
    console.log('2. Problema na conexão com o banco de dados');
    console.log('3. Erro na API route (sintaxe ou lógica)');
    console.log('4. Problema de CORS ou headers');
    console.log('5. Dados corrompidos no banco');

    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('1. Verificar logs do servidor Next.js no terminal');
    console.log('2. Verificar se o banco PostgreSQL está rodando');
    console.log('3. Testar a API route diretamente no navegador');
    console.log('4. Verificar variáveis de ambiente');

  } catch (error) {
    console.error('❌ Erro durante teste básico:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: Servidor não está rodando!');
      console.log('Solução: Execute "npm run dev" no diretório frontend');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: Erro de rede!');
      console.log('Verifique se o servidor está rodando na porta 3000');
    }
  }
}

// Executar teste básico
testeBasico();