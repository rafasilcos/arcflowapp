/**
 * 🎯 TESTE ESPECÍFICO - SISTEMA DISCIPLINAS COMPLETO
 * Teste focado no problema específico do salvamento de disciplinas
 */

async function testarSistemaDisciplinas() {
  console.log('🎯 TESTE ESPECÍFICO - SISTEMA DISCIPLINAS COMPLETO\n');

  const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const baseURL = 'http://localhost:3000';

  try {
    // 1. Carregar dados atuais
    console.log('1️⃣ Carregando dados atuais...');
    
    const getResponse = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    const dados = await getResponse.json();
    
    if (!dados.success) {
      console.log('❌ Erro ao carregar dados');
      return;
    }

    console.log('✅ Dados carregados');
    console.log('Estrutura da ARQUITETURA:', JSON.stringify(dados.data.disciplinas.ARQUITETURA, null, 2));

    // 2. Testar salvamento com estrutura exata
    console.log('\n2️⃣ Testando salvamento com estrutura exata...');
    
    const arquiteturaOriginal = dados.data.disciplinas.ARQUITETURA;
    const novoValor = arquiteturaOriginal.valor_base + 100;
    
    // Criar objeto exatamente igual, mudando apenas o valor_base
    const arquiteturaAlterada = {
      ativo: arquiteturaOriginal.ativo,
      valor_base: novoValor,
      valor_por_m2: arquiteturaOriginal.valor_por_m2,
      valor_por_hora: arquiteturaOriginal.valor_por_hora,
      horas_estimadas: arquiteturaOriginal.horas_estimadas,
      multiplicador_complexidade_padrao: arquiteturaOriginal.multiplicador_complexidade_padrao
    };

    console.log('Arquitetura alterada:', JSON.stringify(arquiteturaAlterada, null, 2));

    const payload1 = {
      configuracoes: {
        disciplinas: {
          ARQUITETURA: arquiteturaAlterada
        }
      },
      versao: '1.0'
    };

    console.log('Payload 1 size:', JSON.stringify(payload1).length, 'chars');

    const response1 = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload1)
    });

    console.log(`Response 1 status: ${response1.status}`);

    if (response1.ok) {
      const result1 = await response1.json();
      console.log('✅ Salvamento 1 funcionou');
      console.log(`Valor salvo: ${result1.data.disciplinas.ARQUITETURA.valor_base}`);
    } else {
      const error1 = await response1.text();
      console.log('❌ Salvamento 1 falhou');
      console.log(`Erro: ${error1.substring(0, 300)}`);
    }

    // 3. Testar com dados completos (como o componente faria)
    console.log('\n3️⃣ Testando com dados completos...');
    
    // Recarregar dados para ter certeza
    const getResponse2 = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`);
    const dados2 = await getResponse2.json();
    
    if (!dados2.success) {
      console.log('❌ Erro ao recarregar dados');
      return;
    }

    // Simular o que o componente React faz
    const estadoCompleto = { ...dados2.data };
    delete estadoCompleto.metadata; // Remover metadata
    
    // Alterar apenas um valor
    estadoCompleto.disciplinas.ARQUITETURA.valor_base += 200;
    
    console.log('Estado completo size:', JSON.stringify(estadoCompleto).length, 'chars');
    console.log('Seções no estado:', Object.keys(estadoCompleto));

    const payload2 = {
      configuracoes: estadoCompleto,
      versao: new Date().getTime().toString()
    };

    const response2 = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload2)
    });

    console.log(`Response 2 status: ${response2.status}`);

    if (response2.ok) {
      const result2 = await response2.json();
      console.log('✅ Salvamento 2 (completo) funcionou');
      console.log(`Valor salvo: ${result2.data.disciplinas.ARQUITETURA.valor_base}`);
    } else {
      const error2 = await response2.text();
      console.log('❌ Salvamento 2 (completo) falhou');
      console.log(`Erro: ${error2.substring(0, 300)}`);
      
      // Tentar identificar o problema específico
      if (error2.includes('JSON')) {
        console.log('💡 Problema pode ser JSON inválido');
      } else if (error2.includes('database')) {
        console.log('💡 Problema pode ser no banco de dados');
      } else if (error2.includes('merge')) {
        console.log('💡 Problema pode ser no merge de dados');
      }
    }

    // 4. Testar seção por seção
    console.log('\n4️⃣ Testando seção por seção...');
    
    const secoes = ['disciplinas', 'custos_indiretos', 'multiplicadores_regionais'];
    
    for (const secao of secoes) {
      console.log(`\n   Testando seção: ${secao}`);
      
      if (dados2.data[secao]) {
        const payloadSecao = {
          configuracoes: {
            [secao]: dados2.data[secao]
          },
          versao: '1.0'
        };

        const responseSecao = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadSecao)
        });

        if (responseSecao.ok) {
          console.log(`   ✅ Seção ${secao} funcionou`);
        } else {
          const errorSecao = await responseSecao.text();
          console.log(`   ❌ Seção ${secao} falhou: ${errorSecao.substring(0, 100)}`);
        }
      }
    }

    console.log('\n🎯 CONCLUSÃO:');
    console.log('- Se salvamento 1 funcionou: estrutura simples OK');
    console.log('- Se salvamento 2 falhou: problema com dados completos');
    console.log('- Se seções individuais funcionaram: problema no merge completo');

  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  }
}

// Executar teste
testarSistemaDisciplinas();