/**
 * 🧪 TESTE DA API DE CONFIGURAÇÕES DO FRONTEND
 * Diagnóstico do problema de salvamento na aba Tabela de Preços
 */

async function testarAPIConfiguracoes() {
  console.log('🧪 TESTANDO API DE CONFIGURAÇÕES DO FRONTEND\n');

  const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const baseURL = 'http://localhost:3000'; // Porta do Next.js

  try {
    // 1. Testar GET - Carregar configurações
    console.log('1️⃣ Testando GET /api/escritorios/[id]/configuracoes...');
    
    const getResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    
    if (getResponse.ok) {
      const getResult = await getResponse.json();
      console.log('   ✅ GET funcionou!');
      console.log(`   Disciplinas encontradas: ${Object.keys(getResult.data.disciplinas || {}).length}`);
      console.log(`   Versão atual: ${getResult.data.metadata?.versao || 'N/A'}`);
      
      // Mostrar alguns valores atuais
      if (getResult.data.disciplinas?.ARQUITETURA) {
        console.log(`   ARQUITETURA valor_base: R$ ${getResult.data.disciplinas.ARQUITETURA.valor_base}`);
        console.log(`   ARQUITETURA valor_por_m2: R$ ${getResult.data.disciplinas.ARQUITETURA.valor_por_m2}`);
      }
    } else {
      console.log(`   ❌ GET falhou: ${getResponse.status}`);
      const error = await getResponse.text();
      console.log(`   Erro: ${error.substring(0, 200)}...`);
      return;
    }

    // 2. Testar PUT - Salvar configurações
    console.log('\n2️⃣ Testando PUT /api/escritorios/[id]/configuracoes...');
    
    const novasConfiguracoes = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 18000, // Valor alterado para teste
          valor_por_m2: 90,  // Valor alterado para teste
          valor_por_hora: 170,
          horas_estimadas: 120,
          multiplicador_complexidade_padrao: 1.0
        },
        ESTRUTURAL: {
          ativo: true,
          valor_base: 14000, // Valor alterado para teste
          valor_por_m2: 55,  // Valor alterado para teste
          valor_por_hora: 185,
          horas_estimadas: 80,
          multiplicador_complexidade_padrao: 1.0
        }
      },
      custos_indiretos: {
        margem_lucro: 35.0, // Valor alterado para teste
        overhead: 20.0,     // Valor alterado para teste
        impostos: 13.65,
        reserva_contingencia: 5.0,
        comissao_vendas: 3.0
      }
    };

    const putResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        configuracoes: novasConfiguracoes,
        versao: '2.0'
      })
    });

    if (putResponse.ok) {
      const putResult = await putResponse.json();
      console.log('   ✅ PUT funcionou!');
      console.log(`   Nova versão: ${putResult.data.metadata?.versao || 'N/A'}`);
      
      // Verificar se os valores foram salvos
      if (putResult.data.disciplinas?.ARQUITETURA) {
        console.log(`   ARQUITETURA valor_base salvo: R$ ${putResult.data.disciplinas.ARQUITETURA.valor_base}`);
        console.log(`   ARQUITETURA valor_por_m2 salvo: R$ ${putResult.data.disciplinas.ARQUITETURA.valor_por_m2}`);
      }
      if (putResult.data.custos_indiretos) {
        console.log(`   Margem lucro salva: ${putResult.data.custos_indiretos.margem_lucro}%`);
        console.log(`   Overhead salvo: ${putResult.data.custos_indiretos.overhead}%`);
      }
    } else {
      console.log(`   ❌ PUT falhou: ${putResponse.status}`);
      const error = await putResponse.text();
      console.log(`   Erro: ${error.substring(0, 500)}...`);
      return;
    }

    // 3. Verificar se os dados persistiram - fazer outro GET
    console.log('\n3️⃣ Verificando persistência dos dados...');
    
    const verificacaoResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    
    if (verificacaoResponse.ok) {
      const verificacaoResult = await verificacaoResponse.json();
      console.log('   ✅ Verificação realizada!');
      
      // Comparar valores
      const arquitetura = verificacaoResult.data.disciplinas?.ARQUITETURA;
      const custos = verificacaoResult.data.custos_indiretos;
      
      if (arquitetura) {
        const valorBasePersistiu = arquitetura.valor_base === 18000;
        const valorM2Persistiu = arquitetura.valor_por_m2 === 90;
        
        console.log(`   ARQUITETURA valor_base persistiu: ${valorBasePersistiu ? '✅' : '❌'} (${arquitetura.valor_base})`);
        console.log(`   ARQUITETURA valor_por_m2 persistiu: ${valorM2Persistiu ? '✅' : '❌'} (${arquitetura.valor_por_m2})`);
      }
      
      if (custos) {
        const margemPersistiu = custos.margem_lucro === 35.0;
        const overheadPersistiu = custos.overhead === 20.0;
        
        console.log(`   Margem lucro persistiu: ${margemPersistiu ? '✅' : '❌'} (${custos.margem_lucro}%)`);
        console.log(`   Overhead persistiu: ${overheadPersistiu ? '✅' : '❌'} (${custos.overhead}%)`);
      }
    } else {
      console.log(`   ❌ Verificação falhou: ${verificacaoResponse.status}`);
    }

    // 4. Testar cenário de problema comum - dados parciais
    console.log('\n4️⃣ Testando salvamento de dados parciais...');
    
    const dadosParciais = {
      disciplinas: {
        ARQUITETURA: {
          valor_base: 19000, // Só alterando um campo
          valor_por_m2: 95   // Só alterando um campo
        }
      }
    };

    const putParcialResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        configuracoes: dadosParciais,
        versao: '2.1'
      })
    });

    if (putParcialResponse.ok) {
      const putParcialResult = await putParcialResponse.json();
      console.log('   ✅ Salvamento parcial funcionou!');
      
      const arquiteturaParcial = putParcialResult.data.disciplinas?.ARQUITETURA;
      if (arquiteturaParcial) {
        console.log(`   Valor base atualizado: R$ ${arquiteturaParcial.valor_base}`);
        console.log(`   Valor por m2 atualizado: R$ ${arquiteturaParcial.valor_por_m2}`);
        console.log(`   Outros campos preservados: ${arquiteturaParcial.ativo ? '✅' : '❌'}`);
      }
    } else {
      console.log(`   ❌ Salvamento parcial falhou: ${putParcialResponse.status}`);
    }

    console.log('\n🎉 TESTE DA API CONCLUÍDO!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 DICA: O servidor Next.js não está rodando!');
      console.log('   Execute: npm run dev ou yarn dev');
    }
  }
}

// Executar teste
testarAPIConfiguracoes();