/**
 * 🐛 DEBUG DO PROBLEMA DE SALVAMENTO NO FRONTEND
 * Análise detalhada do fluxo de dados no componente ConfiguracaoEscritorio
 */

// Simular o comportamento do hook useConfiguracaoEscritorio
class MockConfiguracaoEscritorio {
  constructor() {
    this.configuracoes = null;
    this.loading = false;
    this.error = null;
  }

  // Simular carregamento inicial
  async loadConfiguracoes() {
    console.log('🔄 Simulando carregamento de configurações...');
    
    // Simular dados vindos da API
    this.configuracoes = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 19000,
          valor_por_m2: 95,
          valor_por_hora: 170,
          horas_estimadas: 120,
          multiplicador_complexidade_padrao: 1.0
        },
        ESTRUTURAL: {
          ativo: true,
          valor_base: 14000,
          valor_por_m2: 55,
          valor_por_hora: 185,
          horas_estimadas: 80,
          multiplicador_complexidade_padrao: 1.0
        }
      },
      custos_indiretos: {
        margem_lucro: 35.0,
        overhead: 20.0,
        impostos: 13.65,
        reserva_contingencia: 5.0,
        comissao_vendas: 3.0
      }
    };

    console.log('✅ Configurações carregadas:', {
      arquitetura_valor_base: this.configuracoes.disciplinas.ARQUITETURA.valor_base,
      arquitetura_valor_m2: this.configuracoes.disciplinas.ARQUITETURA.valor_por_m2,
      margem_lucro: this.configuracoes.custos_indiretos.margem_lucro
    });
  }

  // Simular alteração de valor (como no input)
  updateDisciplina(disciplina, campo, valor) {
    console.log(`🔧 Alterando ${disciplina}.${campo} para ${valor}`);
    
    if (!this.configuracoes) return;

    // Problema potencial: referência vs cópia
    this.configuracoes = {
      ...this.configuracoes,
      disciplinas: {
        ...this.configuracoes.disciplinas,
        [disciplina]: {
          ...this.configuracoes.disciplinas[disciplina],
          [campo]: valor
        }
      }
    };

    console.log(`   Novo valor em memória: ${this.configuracoes.disciplinas[disciplina][campo]}`);
  }

  // Simular salvamento
  async salvarConfiguracoes() {
    console.log('💾 Simulando salvamento...');
    
    if (!this.configuracoes) {
      console.log('❌ Nenhuma configuração para salvar');
      return false;
    }

    console.log('📤 Dados sendo enviados:', {
      arquitetura_valor_base: this.configuracoes.disciplinas.ARQUITETURA.valor_base,
      arquitetura_valor_m2: this.configuracoes.disciplinas.ARQUITETURA.valor_por_m2,
      margem_lucro: this.configuracoes.custos_indiretos.margem_lucro
    });

    // Simular resposta da API
    const response = {
      success: true,
      data: {
        ...this.configuracoes,
        metadata: {
          versao: '2.2',
          updated_at: new Date().toISOString()
        }
      }
    };

    // Problema potencial: não atualizar o estado local com a resposta
    console.log('📥 Resposta da API:', {
      success: response.success,
      arquitetura_valor_base: response.data.disciplinas.ARQUITETURA.valor_base,
      arquitetura_valor_m2: response.data.disciplinas.ARQUITETURA.valor_por_m2
    });

    // Atualizar configurações com resposta da API
    this.configuracoes = response.data;

    return true;
  }
}

async function debugSalvamentoFrontend() {
  console.log('🐛 DEBUG DO PROBLEMA DE SALVAMENTO NO FRONTEND\n');

  const mock = new MockConfiguracaoEscritorio();

  // 1. Carregar configurações iniciais
  console.log('1️⃣ Carregamento inicial...');
  await mock.loadConfiguracoes();

  // 2. Simular alterações do usuário
  console.log('\n2️⃣ Simulando alterações do usuário...');
  
  // Usuário altera valor base da arquitetura
  mock.updateDisciplina('ARQUITETURA', 'valor_base', 20000);
  
  // Usuário altera valor por m2
  mock.updateDisciplina('ARQUITETURA', 'valor_por_m2', 100);

  // 3. Simular salvamento
  console.log('\n3️⃣ Salvamento...');
  const sucesso = await mock.salvarConfiguracoes();
  
  if (sucesso) {
    console.log('✅ Salvamento simulado com sucesso');
  }

  // 4. Verificar estado final
  console.log('\n4️⃣ Estado final...');
  console.log('Valores finais em memória:', {
    arquitetura_valor_base: mock.configuracoes.disciplinas.ARQUITETURA.valor_base,
    arquitetura_valor_m2: mock.configuracoes.disciplinas.ARQUITETURA.valor_por_m2
  });

  // 5. Simular problema comum - recarregamento da página
  console.log('\n5️⃣ Simulando recarregamento da página...');
  
  const mockRecarregado = new MockConfiguracaoEscritorio();
  await mockRecarregado.loadConfiguracoes();
  
  console.log('Valores após recarregar:', {
    arquitetura_valor_base: mockRecarregado.configuracoes.disciplinas.ARQUITETURA.valor_base,
    arquitetura_valor_m2: mockRecarregado.configuracoes.disciplinas.ARQUITETURA.valor_por_m2
  });

  // 6. Identificar possíveis problemas
  console.log('\n🔍 POSSÍVEIS PROBLEMAS IDENTIFICADOS:');
  
  console.log('\n   A. Estado não sincronizado:');
  console.log('      - O componente pode estar usando estado local desatualizado');
  console.log('      - Verificar se setConfiguracoes está sendo chamado após salvar');
  
  console.log('\n   B. Race condition:');
  console.log('      - Múltiplas alterações simultâneas podem se sobrescrever');
  console.log('      - Verificar se há debounce ou throttling');
  
  console.log('\n   C. Problema de referência:');
  console.log('      - Objetos podem estar sendo mutados diretamente');
  console.log('      - Verificar se está usando spread operator corretamente');
  
  console.log('\n   D. Cache do navegador:');
  console.log('      - Dados antigos podem estar em cache');
  console.log('      - Verificar headers de cache da API');

  // 7. Testar cenário real com fetch
  console.log('\n7️⃣ Testando cenário real...');
  
  try {
    const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    
    // Carregar dados atuais
    const getResponse = await fetch(`http://localhost:3000/api/escritorios/${escritorioId}/configuracoes`);
    const dadosAtuais = await getResponse.json();
    
    console.log('   Dados atuais da API:', {
      arquitetura_valor_base: dadosAtuais.data.disciplinas.ARQUITETURA.valor_base,
      arquitetura_valor_m2: dadosAtuais.data.disciplinas.ARQUITETURA.valor_por_m2
    });

    // Fazer uma alteração pequena
    const novoValorBase = dadosAtuais.data.disciplinas.ARQUITETURA.valor_base + 1000;
    const novoValorM2 = dadosAtuais.data.disciplinas.ARQUITETURA.valor_por_m2 + 5;

    const alteracao = {
      disciplinas: {
        ARQUITETURA: {
          ...dadosAtuais.data.disciplinas.ARQUITETURA,
          valor_base: novoValorBase,
          valor_por_m2: novoValorM2
        }
      }
    };

    console.log('   Enviando alteração:', {
      novo_valor_base: novoValorBase,
      novo_valor_m2: novoValorM2
    });

    // Salvar
    const putResponse = await fetch(`http://localhost:3000/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        configuracoes: alteracao,
        versao: '2.3'
      })
    });

    const resultado = await putResponse.json();
    
    console.log('   Resultado do salvamento:', {
      success: resultado.success,
      valor_base_salvo: resultado.data.disciplinas.ARQUITETURA.valor_base,
      valor_m2_salvo: resultado.data.disciplinas.ARQUITETURA.valor_por_m2
    });

    // Verificar imediatamente
    const verificacaoResponse = await fetch(`http://localhost:3000/api/escritorios/${escritorioId}/configuracoes`);
    const dadosVerificacao = await verificacaoResponse.json();
    
    console.log('   Verificação imediata:', {
      valor_base_verificado: dadosVerificacao.data.disciplinas.ARQUITETURA.valor_base,
      valor_m2_verificado: dadosVerificacao.data.disciplinas.ARQUITETURA.valor_por_m2,
      persistiu: dadosVerificacao.data.disciplinas.ARQUITETURA.valor_base === novoValorBase
    });

  } catch (error) {
    console.log('   ❌ Erro no teste real:', error.message);
  }

  console.log('\n🎯 CONCLUSÃO:');
  console.log('   Se o teste real funcionou, o problema está no componente React');
  console.log('   Se o teste real falhou, o problema está na API ou banco de dados');
}

// Executar debug
debugSalvamentoFrontend();