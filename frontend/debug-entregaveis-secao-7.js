/**
 * 🔍 DEBUG: ENTREGÁVEIS DA SEÇÃO 7 - PB PROJETO BÁSICO
 * 
 * Investigar por que estão aparecendo apenas 12 entregáveis ao invés de 17
 */

const axios = require('axios');

async function debugEntregaveisSecao7() {
  console.log('🔍 DEBUG: ENTREGÁVEIS DA SEÇÃO 7 - PB PROJETO BÁSICO\n');
  
  try {
    // 1. Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Buscar orçamento 65
    const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/65', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orcamento = orcamentoResponse.data.data;
    
    console.log(`✅ Orçamento: ${orcamento.codigo}`);
    
    // 3. Analisar especificamente a fase PB - Projeto Básico
    const cronograma = orcamento.cronograma;
    
    if (!cronograma || !cronograma.fases) {
      console.log('❌ Cronograma ou fases não encontrados');
      return;
    }
    
    console.log('\n📋 ANALISANDO TODAS AS FASES PARA ENCONTRAR A SEÇÃO 7:');
    
    // Listar todas as fases ordenadas
    const fasesOrdenadas = Object.values(cronograma.fases).sort((a, b) => a.ordem - b.ordem);
    
    fasesOrdenadas.forEach((fase, index) => {
      console.log(`\n   ${index + 1}. ${fase.nome} (Ordem: ${fase.ordem}):`);
      console.log(`      - Entregáveis: ${fase.entregaveis ? fase.entregaveis.length : 0}`);
      console.log(`      - Código: ${fase.codigo || 'N/A'}`);
      
      if (fase.ordem === 7 || fase.nome.includes('Projeto Básico') || fase.nome.includes('PB')) {
        console.log(`\n🎯 ENCONTRADA A SEÇÃO 7 - PROJETO BÁSICO:`);
        console.log(`   - Nome: ${fase.nome}`);
        console.log(`   - Ordem: ${fase.ordem}`);
        console.log(`   - Total de entregáveis: ${fase.entregaveis ? fase.entregaveis.length : 0}`);
        console.log(`   - Esperado: 17 entregáveis`);
        
        if (fase.entregaveis) {
          console.log(`\n📝 LISTANDO TODOS OS ENTREGÁVEIS (${fase.entregaveis.length}):`);
          fase.entregaveis.forEach((entregavel, idx) => {
            console.log(`      ${idx + 1}. ${entregavel}`);
          });
          
          if (fase.entregaveis.length !== 17) {
            console.log(`\n❌ PROBLEMA CONFIRMADO:`);
            console.log(`   - Encontrados: ${fase.entregaveis.length} entregáveis`);
            console.log(`   - Esperados: 17 entregáveis`);
            console.log(`   - Faltando: ${17 - fase.entregaveis.length} entregáveis`);
          } else {
            console.log(`\n✅ QUANTIDADE CORRETA: 17 entregáveis`);
          }
        } else {
          console.log(`\n❌ PROBLEMA CRÍTICO: Nenhum entregável encontrado!`);
        }
      }
    });
    
    // 4. Verificar se o problema está na geração original do cronograma
    console.log('\n🔍 VERIFICANDO CRONOGRAMA ORIGINAL DO BACKEND:');
    
    // Buscar a definição original do cronograma no backend
    const { CRONOGRAMA_NBR_13532_COMPLETO } = require('../backend/utils/cronogramaCompleto.js');
    
    const fasePBOriginal = CRONOGRAMA_NBR_13532_COMPLETO['PB_PROJETO_BASICO'];
    
    if (fasePBOriginal) {
      console.log(`\n📋 DEFINIÇÃO ORIGINAL NO BACKEND:`);
      console.log(`   - Nome: ${fasePBOriginal.nome}`);
      console.log(`   - Ordem: ${fasePBOriginal.ordem}`);
      console.log(`   - Entregáveis originais: ${fasePBOriginal.entregaveis.length}`);
      
      console.log(`\n📝 ENTREGÁVEIS ORIGINAIS (${fasePBOriginal.entregaveis.length}):`);
      fasePBOriginal.entregaveis.forEach((entregavel, idx) => {
        console.log(`      ${idx + 1}. ${entregavel}`);
      });
      
      // Comparar com o que está no banco
      const fasePBBanco = fasesOrdenadas.find(f => f.ordem === 7);
      
      if (fasePBBanco) {
        console.log(`\n🔍 COMPARAÇÃO BACKEND vs BANCO:`);
        console.log(`   - Backend: ${fasePBOriginal.entregaveis.length} entregáveis`);
        console.log(`   - Banco: ${fasePBBanco.entregaveis ? fasePBBanco.entregaveis.length : 0} entregáveis`);
        
        if (fasePBOriginal.entregaveis.length !== (fasePBBanco.entregaveis ? fasePBBanco.entregaveis.length : 0)) {
          console.log(`\n❌ PROBLEMA IDENTIFICADO:`);
          console.log(`   O cronograma no banco tem dados diferentes do backend!`);
          console.log(`   Isso indica que o orçamento foi gerado com uma versão antiga ou incorreta.`);
          
          // Verificar quais entregáveis estão faltando
          if (fasePBBanco.entregaveis) {
            const entregaveisFaltando = fasePBOriginal.entregaveis.filter(original => 
              !fasePBBanco.entregaveis.some(banco => banco.includes(original.substring(0, 30)))
            );
            
            if (entregaveisFaltando.length > 0) {
              console.log(`\n📝 ENTREGÁVEIS FALTANDO (${entregaveisFaltando.length}):`);
              entregaveisFaltando.forEach((entregavel, idx) => {
                console.log(`      ${idx + 1}. ${entregavel}`);
              });
            }
          }
        } else {
          console.log(`\n✅ BACKEND E BANCO COINCIDEM`);
        }
      }
    } else {
      console.log(`\n❌ Definição original PB_PROJETO_BASICO não encontrada no backend`);
    }
    
    // 5. Diagnóstico final
    console.log('\n🎯 DIAGNÓSTICO FINAL:');
    
    const fasePB = fasesOrdenadas.find(f => f.ordem === 7);
    if (fasePB && fasePB.entregaveis) {
      if (fasePB.entregaveis.length < 17) {
        console.log('❌ PROBLEMA CONFIRMADO: Seção 7 tem menos entregáveis que o esperado');
        console.log('🔧 POSSÍVEIS CAUSAS:');
        console.log('   1. Orçamento foi gerado com versão antiga do cronograma');
        console.log('   2. Dados foram corrompidos durante salvamento');
        console.log('   3. Houve problema na geração inicial do cronograma');
        console.log('   4. Frontend está filtrando/limitando entregáveis na exibição');
        
        console.log('\n💡 SOLUÇÕES POSSÍVEIS:');
        console.log('   1. Regenerar o orçamento com cronograma atualizado');
        console.log('   2. Corrigir dados diretamente no banco');
        console.log('   3. Verificar se há limitação na exibição do frontend');
      } else {
        console.log('✅ Quantidade de entregáveis está correta no banco');
        console.log('🔍 O problema pode estar na exibição do frontend');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugEntregaveisSecao7();