/**
 * 🧪 TESTE DE INTEGRAÇÃO COMPLETO - SALVAMENTO CONFIGURAÇÕES
 * Teste final para verificar se a solução implementada está funcionando
 */

async function testarIntegracaoCompleta() {
  console.log('🧪 TESTE DE INTEGRAÇÃO COMPLETO - SALVAMENTO CONFIGURAÇÕES\n');

  const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const baseURL = 'http://localhost:3000';

  try {
    // 1. Carregar configurações iniciais
    console.log('1️⃣ Carregando configurações iniciais...');
    
    const getResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    const configIniciais = await getResponse.json();
    
    if (!configIniciais.success) {
      console.log('❌ Erro ao carregar configurações iniciais');
      return;
    }

    console.log('✅ Configurações carregadas:');
    console.log(`   - ARQUITETURA valor_base: R$ ${configIniciais.data.disciplinas.ARQUITETURA.valor_base}`);
    console.log(`   - ARQUITETURA valor_por_m2: R$ ${configIniciais.data.disciplinas.ARQUITETURA.valor_por_m2}`);
    console.log(`   - Margem lucro: ${configIniciais.data.custos_indiretos.margem_lucro}%`);

    // 2. Simular alterações do usuário na aba "Tabela de Preços"
    console.log('\n2️⃣ Simulando alterações do usuário...');
    
    const valoresOriginais = {
      arquitetura_valor_base: configIniciais.data.disciplinas.ARQUITETURA.valor_base,
      arquitetura_valor_m2: configIniciais.data.disciplinas.ARQUITETURA.valor_por_m2,
      margem_lucro: configIniciais.data.custos_indiretos.margem_lucro
    };

    const novosValores = {
      arquitetura_valor_base: valoresOriginais.arquitetura_valor_base + 2000,
      arquitetura_valor_m2: valoresOriginais.arquitetura_valor_m2 + 10,
      margem_lucro: valoresOriginais.margem_lucro + 5
    };

    console.log('   Alterações a serem feitas:');
    console.log(`   - ARQUITETURA valor_base: ${valoresOriginais.arquitetura_valor_base} → ${novosValores.arquitetura_valor_base}`);
    console.log(`   - ARQUITETURA valor_por_m2: ${valoresOriginais.arquitetura_valor_m2} → ${novosValores.arquitetura_valor_m2}`);
    console.log(`   - Margem lucro: ${valoresOriginais.margem_lucro}% → ${novosValores.margem_lucro}%`);

    // 3. Preparar dados para salvamento (simulando o que o componente faz)
    console.log('\n3️⃣ Preparando dados para salvamento...');
    
    const configuracoesAlteradas = {
      ...configIniciais.data,
      disciplinas: {
        ...configIniciais.data.disciplinas,
        ARQUITETURA: {
          ...configIniciais.data.disciplinas.ARQUITETURA,
          valor_base: novosValores.arquitetura_valor_base,
          valor_por_m2: novosValores.arquitetura_valor_m2
        }
      },
      custos_indiretos: {
        ...configIniciais.data.custos_indiretos,
        margem_lucro: novosValores.margem_lucro
      }
    };

    // Remover metadata para envio
    delete configuracoesAlteradas.metadata;

    console.log('   ✅ Dados preparados para envio');

    // 4. Salvar configurações
    console.log('\n4️⃣ Salvando configurações...');
    
    const putResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        configuracoes: configuracoesAlteradas,
        versao: new Date().getTime().toString()
      })
    });

    const resultadoSalvamento = await putResponse.json();

    if (!resultadoSalvamento.success) {
      console.log('❌ Erro ao salvar configurações:', resultadoSalvamento.error);
      return;
    }

    console.log('✅ Configurações salvas com sucesso!');
    console.log(`   Nova versão: ${resultadoSalvamento.data.metadata?.versao || 'N/A'}`);

    // 5. Verificar se os dados foram persistidos corretamente
    console.log('\n5️⃣ Verificando persistência...');
    
    // Aguardar um pouco para garantir que o banco foi atualizado
    await new Promise(resolve => setTimeout(resolve, 500));

    const verificacaoResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    const dadosVerificacao = await verificacaoResponse.json();

    if (!dadosVerificacao.success) {
      console.log('❌ Erro ao verificar dados salvos');
      return;
    }

    const dadosSalvos = dadosVerificacao.data;
    
    console.log('   Valores verificados:');
    console.log(`   - ARQUITETURA valor_base: R$ ${dadosSalvos.disciplinas.ARQUITETURA.valor_base}`);
    console.log(`   - ARQUITETURA valor_por_m2: R$ ${dadosSalvos.disciplinas.ARQUITETURA.valor_por_m2}`);
    console.log(`   - Margem lucro: ${dadosSalvos.custos_indiretos.margem_lucro}%`);

    // 6. Validar se os valores foram salvos corretamente
    console.log('\n6️⃣ Validando salvamento...');
    
    const validacoes = [
      {
        nome: 'ARQUITETURA valor_base',
        esperado: novosValores.arquitetura_valor_base,
        atual: dadosSalvos.disciplinas.ARQUITETURA.valor_base,
        ok: dadosSalvos.disciplinas.ARQUITETURA.valor_base === novosValores.arquitetura_valor_base
      },
      {
        nome: 'ARQUITETURA valor_por_m2',
        esperado: novosValores.arquitetura_valor_m2,
        atual: dadosSalvos.disciplinas.ARQUITETURA.valor_por_m2,
        ok: dadosSalvos.disciplinas.ARQUITETURA.valor_por_m2 === novosValores.arquitetura_valor_m2
      },
      {
        nome: 'Margem lucro',
        esperado: novosValores.margem_lucro,
        atual: dadosSalvos.custos_indiretos.margem_lucro,
        ok: dadosSalvos.custos_indiretos.margem_lucro === novosValores.margem_lucro
      }
    ];

    let todasValidacoesOk = true;
    
    validacoes.forEach(validacao => {
      const status = validacao.ok ? '✅' : '❌';
      console.log(`   ${status} ${validacao.nome}: ${validacao.atual} (esperado: ${validacao.esperado})`);
      
      if (!validacao.ok) {
        todasValidacoesOk = false;
      }
    });

    // 7. Testar cenário de múltiplas alterações simultâneas
    console.log('\n7️⃣ Testando múltiplas alterações simultâneas...');
    
    const alteracoesMultiplas = {
      ...dadosSalvos,
      disciplinas: {
        ...dadosSalvos.disciplinas,
        ARQUITETURA: {
          ...dadosSalvos.disciplinas.ARQUITETURA,
          valor_base: dadosSalvos.disciplinas.ARQUITETURA.valor_base + 500,
          valor_por_m2: dadosSalvos.disciplinas.ARQUITETURA.valor_por_m2 + 2
        },
        ESTRUTURAL: {
          ...dadosSalvos.disciplinas.ESTRUTURAL,
          valor_base: dadosSalvos.disciplinas.ESTRUTURAL.valor_base + 300,
          valor_por_m2: dadosSalvos.disciplinas.ESTRUTURAL.valor_por_m2 + 1
        }
      },
      custos_indiretos: {
        ...dadosSalvos.custos_indiretos,
        margem_lucro: dadosSalvos.custos_indiretos.margem_lucro + 2,
        overhead: dadosSalvos.custos_indiretos.overhead + 1
      }
    };

    delete alteracoesMultiplas.metadata;

    const multiplaResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        configuracoes: alteracoesMultiplas,
        versao: new Date().getTime().toString()
      })
    });

    const resultadoMultiplo = await multiplaResponse.json();
    
    if (resultadoMultiplo.success) {
      console.log('   ✅ Múltiplas alterações salvas com sucesso');
    } else {
      console.log('   ❌ Erro ao salvar múltiplas alterações');
    }

    // 8. Resultado final
    console.log('\n🎯 RESULTADO FINAL:');
    
    if (todasValidacoesOk) {
      console.log('   ✅ TESTE PASSOU - O salvamento está funcionando corretamente!');
      console.log('   ✅ A solução implementada resolveu o problema');
      console.log('   ✅ Os dados são persistidos corretamente no banco');
      console.log('   ✅ As alterações na aba "Tabela de Preços" são salvas');
    } else {
      console.log('   ❌ TESTE FALHOU - Ainda há problemas no salvamento');
      console.log('   ❌ Verificar implementação do componente React');
      console.log('   ❌ Verificar sincronização entre frontend e backend');
    }

    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('   1. Testar no navegador com o componente real');
    console.log('   2. Verificar se as mensagens de sucesso aparecem');
    console.log('   3. Confirmar que os valores não "voltam" após salvar');
    console.log('   4. Testar recarregamento da página');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 DICA: O servidor Next.js não está rodando!');
      console.log('   Execute: npm run dev');
    }
  }
}

// Executar teste
testarIntegracaoCompleta();