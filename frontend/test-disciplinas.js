/**
 * 🔍 TESTE DE DEBUG DO SISTEMA DE DISCIPLINAS
 * Verifica detalhadamente o que está acontecendo no fallback
 */

const API_BASE = 'http://localhost:3000';

async function testarDebugDisciplinas() {
  console.log('🔍 TESTE DE DEBUG: SISTEMA DE DISCIPLINAS\n');

  try {
    // 1. VERIFICAR CONFIGURAÇÕES GLOBAIS
    console.log('1️⃣ Verificando configurações globais...');
    
    const responseGlobal = await fetch(`${API_BASE}/api/orcamentos/configuracoes-globais/disciplinas`);
    const resultGlobal = await responseGlobal.json();
    
    console.log('📊 Configurações globais:');
    console.log('   Success:', resultGlobal.success);
    console.log('   Disciplinas:', resultGlobal.data?.disciplinasAtivas);
    console.log('   Configurações:', Object.keys(resultGlobal.data?.configuracoesPorDisciplina || {}));

    // 2. VERIFICAR ORÇAMENTO ESPECÍFICO
    console.log('\n2️⃣ Verificando orçamento específico...');
    
    const orcamentoId = 'demo';
    const responseDemo = await fetch(`${API_BASE}/api/orcamentos/${orcamentoId}/disciplinas`);
    const resultDemo = await responseDemo.json();
    
    console.log(`📋 Orçamento ${orcamentoId}:`);
    console.log('   Success:', resultDemo.success);
    console.log('   Disciplinas:', resultDemo.data?.disciplinasAtivas);
    console.log('   Configurações:', Object.keys(resultDemo.data?.configuracoesPorDisciplina || {}));

    // 3. VERIFICAR SE O FALLBACK DEVERIA ACONTECER
    console.log('\n3️⃣ Análise do fallback...');
    
    const disciplinasDemo = resultDemo.data?.disciplinasAtivas || [];
    const disciplinasGlobal = resultGlobal.data?.disciplinasAtivas || [];
    
    console.log(`   Disciplinas no orçamento demo: ${disciplinasDemo.length}`);
    console.log(`   Disciplinas globais: ${disciplinasGlobal.length}`);
    
    if (disciplinasDemo.length <= 1 && disciplinasGlobal.length > 1) {
      console.log('   ✅ Fallback DEVERIA acontecer!');
      console.log('   🔍 Possível problema: Frontend não está usando o fallback corretamente');
    } else if (disciplinasDemo.length > 1) {
      console.log('   ✅ Orçamento tem configurações específicas - fallback não necessário');
    } else {
      console.log('   ⚠️ Configurações globais também estão vazias');
    }

    // 4. TESTAR SALVAMENTO DE CONFIGURAÇÃO ESPECÍFICA
    console.log('\n4️⃣ Testando salvamento de configuração específica...');
    
    const configEspecifica = {
      disciplinasAtivas: ['ARQUITETURA', 'ESTRUTURAL'],
      configuracoesPorDisciplina: {
        'ARQUITETURA': { valor: 10000 },
        'ESTRUTURAL': { valor: 8000 }
      }
    };

    const responseSaveDemo = await fetch(`${API_BASE}/api/orcamentos/${orcamentoId}/disciplinas`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configEspecifica)
    });

    const resultSaveDemo = await responseSaveDemo.json();
    
    if (resultSaveDemo.success) {
      console.log('   ✅ Configuração específica salva com sucesso!');
      
      // Verificar se foi salva corretamente
      const responseVerify = await fetch(`${API_BASE}/api/orcamentos/${orcamentoId}/disciplinas`);
      const resultVerify = await responseVerify.json();
      
      console.log('   📊 Verificação após salvamento:');
      console.log('   Disciplinas:', resultVerify.data?.disciplinasAtivas);
      console.log('   Configurações:', Object.keys(resultVerify.data?.configuracoesPorDisciplina || {}));
    }

    // 5. TESTAR NOVO ORÇAMENTO (SEM CONFIGURAÇÕES)
    console.log('\n5️⃣ Testando novo orçamento sem configurações...');
    
    const novoOrcamentoId = 'novo-teste-' + Date.now();
    const responseNovo = await fetch(`${API_BASE}/api/orcamentos/${novoOrcamentoId}/disciplinas`);
    const resultNovo = await responseNovo.json();
    
    console.log(`📋 Novo orçamento ${novoOrcamentoId}:`);
    console.log('   Success:', resultNovo.success);
    console.log('   Disciplinas:', resultNovo.data?.disciplinasAtivas);
    console.log('   Configurações:', Object.keys(resultNovo.data?.configuracoesPorDisciplina || {}));

    const disciplinasNovo = resultNovo.data?.disciplinasAtivas || [];
    
    if (disciplinasNovo.length === 1 && disciplinasNovo[0] === 'ARQUITETURA') {
      console.log('   ⚠️ Retornando configuração padrão - fallback não está funcionando na API');
    } else if (disciplinasNovo.length > 1) {
      console.log('   ✅ Fallback funcionando na API!');
    }

    // 6. CONCLUSÃO
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNÓSTICO DO PROBLEMA');
    console.log('='.repeat(60));
    
    if (disciplinasGlobal.length > 1 && disciplinasNovo.length === 1) {
      console.log('❌ PROBLEMA IDENTIFICADO:');
      console.log('   • Configurações globais existem no banco');
      console.log('   • API não está aplicando o fallback corretamente');
      console.log('   • Orçamentos novos retornam apenas ARQUITETURA');
      
      console.log('\n🔧 SOLUÇÃO NECESSÁRIA:');
      console.log('   • Corrigir lógica de fallback na API');
      console.log('   • Garantir que orçamentos sem configurações usem as globais');
    } else {
      console.log('✅ SISTEMA FUNCIONANDO CORRETAMENTE');
    }

  } catch (error) {
    console.error('❌ Erro no teste de debug:', error);
  }
}

// Executar teste
testarDebugDisciplinas();