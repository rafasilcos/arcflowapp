/**
 * 🔍 INVESTIGAR SALVAMENTO DO CRONOGRAMA - ORÇAMENTO 65
 * 
 * Verificar como o cronograma está sendo salvo e recuperado do banco
 */

const axios = require('axios');

async function investigarSalvamentoCronograma65() {
  console.log('🔍 INVESTIGANDO SALVAMENTO DO CRONOGRAMA - ORÇAMENTO 65\n');
  
  try {
    // 1. Fazer login
    console.log('🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
    
    // 2. Buscar o orçamento 65 via API
    console.log('\n📊 Buscando orçamento 65 via API...');
    const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/65', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const responseData = orcamentoResponse.data;
    const orcamento = responseData.data; // Acessar o campo data dentro da resposta
    console.log(`✅ Orçamento encontrado via API: ${orcamento.codigo || 'Código não definido'}`);
    
    // 3. Analisar estrutura do cronograma retornado pela API
    console.log('\n📅 ANALISANDO CRONOGRAMA RETORNADO PELA API...');
    
    if (!orcamento.cronograma) {
      console.log('❌ PROBLEMA: Cronograma não existe na resposta da API!');
      console.log('📊 Campos disponíveis no orçamento:');
      console.log(Object.keys(orcamento));
      return;
    }
    
    const cronograma = orcamento.cronograma;
    console.log(`📊 Tipo do cronograma: ${typeof cronograma}`);
    
    if (typeof cronograma === 'object' && cronograma.fases) {
      const fases = Object.keys(cronograma.fases);
      console.log(`📊 Número de fases: ${fases.length}`);
      console.log(`📊 Prazo total: ${cronograma.prazoTotal || 'N/A'} semanas`);
      console.log(`📊 Total entregáveis informado: ${cronograma.totalEntregaveis || 'N/A'}`);
      
      let totalContado = 0;
      let fasesComProblemas = [];
      
      console.log('\n📋 ANÁLISE DAS FASES RETORNADAS PELA API:');
      
      fases.forEach((faseKey, index) => {
        const fase = cronograma.fases[faseKey];
        const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
        totalContado += numEntregaveis;
        
        console.log(`\n   ${index + 1}. ${fase.codigo} - ${fase.nome}:`);
        console.log(`      - Entregáveis: ${numEntregaveis}`);
        console.log(`      - Disciplinas: ${fase.disciplinas ? fase.disciplinas.join(', ') : 'Nenhuma'}`);
        console.log(`      - Etapa: ${fase.etapa}`);
        console.log(`      - Ordem: ${fase.ordem}`);
        console.log(`      - Valor: R$ ${(fase.valor || 0).toLocaleString('pt-BR')}`);
        
        // Verificar problemas
        if (numEntregaveis === 0) {
          fasesComProblemas.push(`${fase.codigo}: Sem entregáveis`);
        }
        
        if (!fase.disciplinas || fase.disciplinas.length === 0) {
          fasesComProblemas.push(`${fase.codigo}: Sem disciplinas`);
        }
        
        // Mostrar alguns entregáveis
        if (fase.entregaveis && fase.entregaveis.length > 0) {
          console.log(`      📝 Primeiros entregáveis:`);
          fase.entregaveis.slice(0, 2).forEach((entregavel, i) => {
            console.log(`         ${i + 1}. ${entregavel.substring(0, 80)}${entregavel.length > 80 ? '...' : ''}`);
          });
          if (fase.entregaveis.length > 2) {
            console.log(`         ... e mais ${fase.entregaveis.length - 2} entregáveis`);
          }
        }
      });
      
      console.log(`\n📊 RESULTADO DA ANÁLISE DA API:`);
      console.log(`   - Total contado: ${totalContado}`);
      console.log(`   - Total informado: ${cronograma.totalEntregaveis}`);
      console.log(`   - Esperado: 72`);
      console.log(`   - Status: ${totalContado === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
      
      if (fasesComProblemas.length > 0) {
        console.log('\n❌ PROBLEMAS ENCONTRADOS:');
        fasesComProblemas.forEach(problema => console.log(`   - ${problema}`));
      }
      
    } else {
      console.log('❌ PROBLEMA: Cronograma não tem estrutura de fases!');
      console.log('📊 Estrutura do cronograma:');
      console.log(cronograma);
    }
    
    // 4. Comparar com geração local
    console.log('\n🔧 COMPARANDO COM GERAÇÃO LOCAL...');
    
    const { gerarCronogramaCompleto } = require('./utils/cronogramaCompleto');
    const disciplinas = ['arquitetura', 'estrutural', 'hidraulica', 'eletrica'];
    const cronogramaLocal = gerarCronogramaCompleto(18000, disciplinas);
    
    console.log(`📊 Cronograma local - Total entregáveis: ${cronogramaLocal.totalEntregaveis}`);
    console.log(`📊 Cronograma API - Total entregáveis: ${cronograma.totalEntregaveis}`);
    
    if (cronogramaLocal.totalEntregaveis === cronograma.totalEntregaveis) {
      console.log('✅ Totais coincidem - problema pode estar na distribuição');
    } else {
      console.log('❌ Totais diferentes - problema na geração ou salvamento');
    }
    
    // 5. Diagnóstico final
    console.log('\n🎯 DIAGNÓSTICO FINAL:');
    
    if (totalContado === 72 && cronograma.totalEntregaveis === 72) {
      console.log('✅ O cronograma está sendo salvo e recuperado corretamente');
      console.log('🔍 Se há problemas na visualização, o problema está no frontend');
      console.log('💡 Verifique o componente de exibição do cronograma');
    } else {
      console.log('❌ Há problemas no salvamento ou recuperação do cronograma');
      console.log('🔧 Necessário investigar:');
      console.log('   - Como o cronograma é salvo no banco (JSON)');
      console.log('   - Como o cronograma é recuperado do banco');
      console.log('   - Se há transformações nos dados durante o processo');
    }
    
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

investigarSalvamentoCronograma65();