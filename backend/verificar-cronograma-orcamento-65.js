/**
 * 🔍 VERIFICAÇÃO ESPECÍFICA DO CRONOGRAMA DO ORÇAMENTO 65
 */

const axios = require('axios');

async function verificarCronogramaOrcamento65() {
  console.log('🔍 VERIFICANDO CRONOGRAMA DO ORÇAMENTO 65\n');
  
  try {
    // Fazer requisição para a API do orçamento 65
    const response = await axios.get('http://localhost:3001/api/orcamentos/65', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status !== 200) {
      console.log('❌ Erro ao buscar orçamento 65:', response.status);
      return;
    }
    
    const orcamento = response.data;
    console.log(`✅ Orçamento encontrado: ${orcamento.codigo}`);
    console.log(`📊 Valor total: R$ ${orcamento.valor_total?.toLocaleString('pt-BR') || 'N/A'}`);
    
    if (!orcamento.cronograma) {
      console.log('❌ PROBLEMA: Cronograma não existe no orçamento!');
      return;
    }
    
    const cronograma = orcamento.cronograma;
    console.log(`📅 Cronograma encontrado - Tipo: ${typeof cronograma}`);
    
    if (cronograma.fases) {
      const fases = Object.keys(cronograma.fases);
      console.log(`📊 Total de fases: ${fases.length}`);
      console.log(`📊 Prazo total: ${cronograma.prazoTotal || 'N/A'} semanas`);
      console.log(`📊 Metodologia: ${cronograma.metodologia || 'N/A'}`);
      
      let totalEntregaveis = 0;
      let problemasEncontrados = [];
      
      console.log('\n📋 ANÁLISE DETALHADA DAS FASES:');
      
      fases.forEach((faseKey, index) => {
        const fase = cronograma.fases[faseKey];
        const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
        totalEntregaveis += numEntregaveis;
        
        console.log(`\n${index + 1}. ${fase.codigo} - ${fase.nome}:`);
        console.log(`   - Etapa: ${fase.etapa || 'N/A'}`);
        console.log(`   - Ordem: ${fase.ordem || 'N/A'}`);
        console.log(`   - Prazo: ${fase.prazo || 'N/A'} semanas`);
        console.log(`   - Valor: R$ ${fase.valor?.toLocaleString('pt-BR') || 'N/A'}`);
        console.log(`   - Entregáveis: ${numEntregaveis} itens`);
        console.log(`   - Disciplinas: ${fase.disciplinas?.join(', ') || 'N/A'}`);
        
        // Verificar problemas específicos
        if (!fase.entregaveis || fase.entregaveis.length === 0) {
          problemasEncontrados.push(`Fase ${fase.codigo}: Sem entregáveis`);
        }
        
        if (!fase.disciplinas || fase.disciplinas.length === 0) {
          problemasEncontrados.push(`Fase ${fase.codigo}: Sem disciplinas`);
        }
        
        if (fase.ordem === undefined || fase.ordem === null) {
          problemasEncontrados.push(`Fase ${fase.codigo}: Ordem não definida`);
        }
      });
      
      console.log(`\n📊 RESUMO FINAL:`);
      console.log(`   - Total de entregáveis contados: ${totalEntregaveis}`);
      console.log(`   - Total esperado: 72`);
      console.log(`   - Status: ${totalEntregaveis === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
      
      if (problemasEncontrados.length > 0) {
        console.log('\n❌ PROBLEMAS ENCONTRADOS:');
        problemasEncontrados.forEach(problema => console.log(`   - ${problema}`));
      }
      
      if (totalEntregaveis !== 72) {
        console.log('\n🔧 DIAGNÓSTICO:');
        console.log('   O cronograma está sendo gerado, mas com quantidade incorreta de entregáveis.');
        console.log('   Isso indica problema na lógica de mapeamento dos entregáveis por fase.');
        console.log('   Necessário verificar a função de geração do cronograma.');
      }
      
    } else {
      console.log('❌ PROBLEMA: Cronograma sem estrutura de fases!');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Servidor não está rodando. Execute: npm run dev');
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

verificarCronogramaOrcamento65();