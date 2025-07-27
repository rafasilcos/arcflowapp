/**
 * 🔍 ANÁLISE COMPLETA DO PROBLEMA DO CRONOGRAMA - ORÇAMENTO 65
 */

const axios = require('axios');

async function analisarCronogramaProblema65() {
  console.log('🔍 ANÁLISE DO PROBLEMA DO CRONOGRAMA - ORÇAMENTO 65\n');
  
  try {
    // 1. Fazer login primeiro
    console.log('🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    
    // 2. Buscar o orçamento 65
    console.log('\n📊 Buscando orçamento 65...');
    const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/65', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const orcamento = orcamentoResponse.data;
    console.log(`✅ Orçamento encontrado: ${orcamento.codigo}`);
    console.log(`📊 Briefing ID: ${orcamento.briefing_id}`);
    
    // 3. Buscar o briefing associado
    console.log('\n📋 Buscando briefing associado...');
    const briefingResponse = await axios.get(`http://localhost:3001/api/briefings/${orcamento.briefing_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const briefing = briefingResponse.data;
    console.log(`✅ Briefing encontrado: ${briefing.nome_projeto}`);
    console.log(`📊 Tipologia: ${briefing.tipologia_principal}`);
    console.log(`📊 Área: ${briefing.area_construcao}m²`);
    console.log(`📊 Disciplinas: ${briefing.disciplinas?.join(', ') || 'N/A'}`);
    
    // 4. Analisar o cronograma atual
    console.log('\n📅 ANALISANDO CRONOGRAMA ATUAL...');
    
    if (!orcamento.cronograma) {
      console.log('❌ PROBLEMA CRÍTICO: Cronograma não existe!');
      return;
    }
    
    const cronograma = orcamento.cronograma;
    
    if (!cronograma.fases) {
      console.log('❌ PROBLEMA CRÍTICO: Cronograma sem fases!');
      return;
    }
    
    const fases = Object.keys(cronograma.fases);
    console.log(`📊 Total de fases: ${fases.length}`);
    
    let totalEntregaveis = 0;
    let fasesComProblemas = [];
    
    // Analisar cada fase
    fases.forEach(faseKey => {
      const fase = cronograma.fases[faseKey];
      const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
      totalEntregaveis += numEntregaveis;
      
      console.log(`\n📋 ${fase.codigo} - ${fase.nome}:`);
      console.log(`   Entregáveis: ${numEntregaveis}`);
      console.log(`   Disciplinas: ${fase.disciplinas?.join(', ') || 'Nenhuma'}`);
      console.log(`   Etapa: ${fase.etapa}`);
      console.log(`   Ordem: ${fase.ordem}`);
      
      // Verificar problemas
      if (numEntregaveis === 0) {
        fasesComProblemas.push(`${fase.codigo}: Sem entregáveis`);
      }
      
      if (!fase.disciplinas || fase.disciplinas.length === 0) {
        fasesComProblemas.push(`${fase.codigo}: Sem disciplinas`);
      }
      
      // Mostrar alguns entregáveis para verificar se estão corretos
      if (fase.entregaveis && fase.entregaveis.length > 0) {
        console.log(`   Primeiros entregáveis:`);
        fase.entregaveis.slice(0, 3).forEach((entregavel, index) => {
          console.log(`     ${index + 1}. ${entregavel}`);
        });
        if (fase.entregaveis.length > 3) {
          console.log(`     ... e mais ${fase.entregaveis.length - 3} entregáveis`);
        }
      }
    });
    
    console.log(`\n📊 RESULTADO FINAL:`);
    console.log(`   Total de entregáveis: ${totalEntregaveis}`);
    console.log(`   Esperado: 72`);
    console.log(`   Status: ${totalEntregaveis === 72 ? '✅ QUANTIDADE CORRETA' : '❌ QUANTIDADE INCORRETA'}`);
    
    if (fasesComProblemas.length > 0) {
      console.log('\n❌ PROBLEMAS IDENTIFICADOS:');
      fasesComProblemas.forEach(problema => console.log(`   - ${problema}`));
    }
    
    // 5. Verificar se o problema está na geração ou nos dados
    console.log('\n🔧 DIAGNÓSTICO:');
    
    if (totalEntregaveis === 72) {
      console.log('✅ A quantidade de entregáveis está correta (72)');
      console.log('🔍 O problema pode estar na distribuição ou conteúdo dos entregáveis');
      console.log('💡 Verifique se os entregáveis estão nas fases corretas');
    } else {
      console.log('❌ A quantidade de entregáveis está incorreta');
      console.log('🔍 O problema está na lógica de geração do cronograma');
      console.log('💡 Necessário verificar a função cronogramaCompleto.js');
    }
    
    // 6. Verificar dados do briefing que afetam o cronograma
    console.log('\n📋 DADOS DO BRIEFING QUE AFETAM O CRONOGRAMA:');
    console.log(`   - Tipologia: ${briefing.tipologia_principal}`);
    console.log(`   - Área: ${briefing.area_construcao}m²`);
    console.log(`   - Disciplinas: ${briefing.disciplinas?.length || 0} disciplinas`);
    console.log(`   - Complexidade: ${briefing.complexidade || 'N/A'}`);
    console.log(`   - Projeto tipo: ${briefing.projeto_tipo || 'N/A'}`);
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Erro da API:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Servidor não está rodando. Execute: npm run dev');
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

analisarCronogramaProblema65();