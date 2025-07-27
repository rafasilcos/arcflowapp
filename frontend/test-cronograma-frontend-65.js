/**
 * 🔍 TESTE ESPECÍFICO: CRONOGRAMA NO FRONTEND - ORÇAMENTO 65
 * 
 * Verificar como o cronograma está sendo processado no frontend
 */

const axios = require('axios');

async function testarCronogramaFrontend65() {
  console.log('🔍 TESTE DO CRONOGRAMA NO FRONTEND - ORÇAMENTO 65\n');
  
  try {
    // 1. Fazer login
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
    
    const responseData = orcamentoResponse.data;
    const orcamento = responseData.data;
    
    console.log(`✅ Orçamento encontrado: ${orcamento.codigo}`);
    console.log(`📊 Valor total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    
    // 3. Analisar estrutura do cronograma como chega do banco
    console.log('\n📅 ANALISANDO CRONOGRAMA COMO CHEGA DO BANCO...');
    
    if (!orcamento.cronograma) {
      console.log('❌ PROBLEMA: Cronograma não existe!');
      return;
    }
    
    const cronogramaOriginal = orcamento.cronograma;
    console.log(`📊 Tipo: ${typeof cronogramaOriginal}`);
    
    if (cronogramaOriginal.fases) {
      console.log(`📊 Número de fases: ${Object.keys(cronogramaOriginal.fases).length}`);
      console.log(`📊 Prazo total: ${cronogramaOriginal.prazoTotal} semanas`);
      console.log(`📊 Total entregáveis: ${cronogramaOriginal.totalEntregaveis}`);
      
      // 4. Simular conversão que o frontend faz
      console.log('\n🔄 SIMULANDO CONVERSÃO DO FRONTEND...');
      
      const cronogramaConvertido = Object.values(cronogramaOriginal.fases).map((fase) => ({
        id: fase.nome?.replace(/\s+/g, '_').toUpperCase() || 'FASE',
        ordem: fase.ordem || 1,
        etapa: fase.etapa || '',
        nome: fase.nome || '',
        prazo: fase.prazo || 0,
        valor: fase.valor || 0,
        percentual: fase.percentual || 0,
        disciplinas: fase.disciplinas || [],
        responsavel: fase.responsavel || 'Equipe Técnica',
        entregaveis: fase.entregaveis || [],
        ativa: true
      }));
      
      console.log(`📊 Cronograma convertido: ${cronogramaConvertido.length} fases`);
      
      let totalEntregaveisConvertido = 0;
      cronogramaConvertido.forEach((fase, index) => {
        const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
        totalEntregaveisConvertido += numEntregaveis;
        
        console.log(`\n   ${index + 1}. ${fase.nome}:`);
        console.log(`      - ID: ${fase.id}`);
        console.log(`      - Ordem: ${fase.ordem}`);
        console.log(`      - Etapa: ${fase.etapa}`);
        console.log(`      - Prazo: ${fase.prazo} semanas`);
        console.log(`      - Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
        console.log(`      - Entregáveis: ${numEntregaveis} itens`);
        console.log(`      - Disciplinas: ${fase.disciplinas.join(', ')}`);
        console.log(`      - Ativa: ${fase.ativa ? 'Sim' : 'Não'}`);
        
        // Mostrar alguns entregáveis
        if (fase.entregaveis && fase.entregaveis.length > 0) {
          console.log(`      📝 Primeiros entregáveis:`);
          fase.entregaveis.slice(0, 2).forEach((entregavel, i) => {
            console.log(`         ${i + 1}. ${entregavel.substring(0, 60)}${entregavel.length > 60 ? '...' : ''}`);
          });
          if (fase.entregaveis.length > 2) {
            console.log(`         ... e mais ${fase.entregaveis.length - 2} entregáveis`);
          }
        }
      });
      
      console.log(`\n📊 RESULTADO DA CONVERSÃO:`);
      console.log(`   - Total original: ${cronogramaOriginal.totalEntregaveis}`);
      console.log(`   - Total convertido: ${totalEntregaveisConvertido}`);
      console.log(`   - Status: ${totalEntregaveisConvertido === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
      
      // 5. Verificar ordenação
      console.log('\n📋 VERIFICANDO ORDENAÇÃO DAS FASES...');
      
      const fasesOrdenadas = cronogramaConvertido.sort((a, b) => a.ordem - b.ordem);
      console.log('Ordem das fases após ordenação:');
      fasesOrdenadas.forEach((fase, index) => {
        console.log(`   ${index + 1}. ${fase.nome} (Ordem: ${fase.ordem})`);
      });
      
      // 6. Diagnóstico final
      console.log('\n🎯 DIAGNÓSTICO FINAL:');
      
      if (totalEntregaveisConvertido === 72) {
        console.log('✅ A conversão do cronograma está funcionando corretamente');
        console.log('✅ O problema NÃO está na conversão dos dados');
        console.log('🔍 Possíveis causas do problema:');
        console.log('   - Filtros aplicados no frontend que removem entregáveis');
        console.log('   - Problemas na exibição dos componentes');
        console.log('   - Estado do frontend não sendo atualizado corretamente');
        console.log('   - Disciplinas não sendo consideradas ativas');
      } else {
        console.log('❌ Há problemas na conversão do cronograma');
        console.log('🔧 A conversão está perdendo ou duplicando entregáveis');
      }
      
    } else {
      console.log('❌ PROBLEMA: Cronograma sem estrutura de fases!');
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

testarCronogramaFrontend65();