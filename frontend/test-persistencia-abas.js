/**
 * 🔍 TESTE ESPECÍFICO - PERSISTÊNCIA ENTRE ABAS
 * Foco no problema específico da aba "Tabela de Preços"
 */

async function testarPersistenciaAbas() {
  console.log('🔍 TESTE ESPECÍFICO - PERSISTÊNCIA ENTRE ABAS\n');

  const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const baseURL = 'http://localhost:3000';

  try {
    // 1. Carregar dados atuais
    console.log('1️⃣ Carregando dados atuais...');
    
    const response = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    const dados = await response.json();
    
    if (!dados.success) {
      console.log('❌ Erro ao carregar dados:', dados.error);
      return;
    }

    console.log('   Dados carregados:');
    console.log(`   - ARQUITETURA valor_base: R$ ${dados.data.disciplinas.ARQUITETURA.valor_base}`);
    console.log(`   - ARQUITETURA valor_por_m2: R$ ${dados.data.disciplinas.ARQUITETURA.valor_por_m2}`);

    // 2. Fazer uma alteração mínima (como o usuário faria)
    console.log('\n2️⃣ Fazendo alteração mínima...');
    
    const novoValorBase = dados.data.disciplinas.ARQUITETURA.valor_base + 1000;
    
    console.log(`   Alterando ARQUITETURA valor_base: ${dados.data.disciplinas.ARQUITETURA.valor_base} → ${novoValorBase}`);

    // 3. Preparar dados EXATAMENTE como o componente faz
    console.log('\n3️⃣ Preparando dados como o componente...');
    
    // Simular o que o componente updateDisciplina faz
    const configuracoesAtualizadas = {
      ...dados.data,
      disciplinas: {
        ...dados.data.disciplinas,
        ARQUITETURA: {
          ...dados.data.disciplinas.ARQUITETURA,
          valor_base: novoValorBase
        }
      }
    };

    // Remover metadata (importante!)
    delete configuracoesAtualizadas.metadata;

    console.log('   Estrutura preparada:');
    console.log(`   - Disciplinas: ${Object.keys(configuracoesAtualizadas.disciplinas).length} itens`);
    console.log(`   - Custos indiretos: ${Object.keys(configuracoesAtualizadas.custos_indiretos).length} itens`);
    console.log(`   - Novo valor: ${configuracoesAtualizadas.disciplinas.ARQUITETURA.valor_base}`);

    // 4. Tentar salvamento com dados completos
    console.log('\n4️⃣ Tentando salvamento...');
    
    const payload = {
      configuracoes: configuracoesAtualizadas,
      versao: new Date().getTime().toString()
    };

    console.log('   Payload size:', JSON.stringify(payload).length, 'chars');

    const putResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Response status: ${putResponse.status}`);
    console.log(`   Response headers:`, Object.fromEntries(putResponse.headers.entries()));

    if (putResponse.ok) {
      const resultado = await putResponse.json();
      console.log('   ✅ Salvamento funcionou!');
      console.log(`   Valor salvo: ${resultado.data.disciplinas.ARQUITETURA.valor_base}`);
      
      // Verificar imediatamente
      const verificacao = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
      const dadosVerificacao = await verificacao.json();
      
      const persistiu = dadosVerificacao.data.disciplinas.ARQUITETURA.valor_base === novoValorBase;
      console.log(`   Persistiu: ${persistiu ? '✅' : '❌'}`);
      
    } else {
      const errorText = await putResponse.text();
      console.log('   ❌ Salvamento falhou');
      console.log(`   Erro: ${errorText.substring(0, 300)}`);
      
      // Tentar identificar o problema específico
      if (errorText.includes('JSON')) {
        console.log('   💡 Problema pode ser formato JSON inválido');
      } else if (errorText.includes('database') || errorText.includes('Database')) {
        console.log('   💡 Problema pode ser no banco de dados');
      } else if (errorText.includes('validation') || errorText.includes('Validation')) {
        console.log('   💡 Problema pode ser validação de dados');
      }
    }

    // 5. Testar com dados mínimos para isolar o problema
    console.log('\n5️⃣ Testando com dados mínimos...');
    
    const dadosMinimos = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: novoValorBase + 100,
          valor_por_m2: 76,
          valor_por_hora: 151,
          horas_estimadas: 121,
          multiplicador_complexidade_padrao: 1.0
        }
      }
    };

    const minimoResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        configuracoes: dadosMinimos,
        versao: '2.0'
      })
    });

    if (minimoResponse.ok) {
      const minimoResult = await minimoResponse.json();
      console.log('   ✅ Dados mínimos funcionaram');
      console.log(`   Valor salvo: ${minimoResult.data.disciplinas.ARQUITETURA.valor_base}`);
      console.log('   💡 Problema pode estar na estrutura completa dos dados');
    } else {
      const minimoError = await minimoResponse.text();
      console.log('   ❌ Dados mínimos também falharam');
      console.log(`   Erro: ${minimoError.substring(0, 200)}`);
      console.log('   💡 Problema pode estar na API ou banco');
    }

    console.log('\n🎯 DIAGNÓSTICO:');
    console.log('   - Se dados mínimos funcionam mas completos falham: problema na estrutura');
    console.log('   - Se ambos falham: problema na API ou banco');
    console.log('   - Verificar logs do servidor Next.js para detalhes');

  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  }
}

// Executar teste
testarPersistenciaAbas();