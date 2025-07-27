/**
 * 🔍 DEBUG COMPLETO: CRONOGRAMA NO FRONTEND - ORÇAMENTO 65
 * 
 * Análise criteriosa de todas as possibilidades de erro no frontend
 */

const axios = require('axios');

async function debugCronogramaFrontendCompleto() {
  console.log('🔍 DEBUG COMPLETO DO CRONOGRAMA NO FRONTEND - ORÇAMENTO 65\n');
  
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
    console.log(`📊 Disciplinas no banco: ${orcamento.disciplinas}`);
    
    // 3. Verificar estrutura do cronograma original
    const cronogramaOriginal = orcamento.cronograma;
    console.log('\n📅 CRONOGRAMA ORIGINAL DO BANCO:');
    console.log(`   - Tipo: ${typeof cronogramaOriginal}`);
    console.log(`   - Fases: ${Object.keys(cronogramaOriginal.fases).length}`);
    console.log(`   - Total entregáveis: ${cronogramaOriginal.totalEntregaveis}`);
    
    // 4. Simular exatamente o que o frontend faz
    console.log('\n🔄 SIMULANDO PROCESSAMENTO DO FRONTEND...');
    
    // 4.1. Conversão para array (como no useDisciplinas.ts linha 315-320)
    const cronogramaArray = Object.values(cronogramaOriginal.fases).map((fase) => ({
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
    
    console.log(`✅ Conversão para array: ${cronogramaArray.length} fases`);
    
    // 4.2. Verificar disciplinas ativas (simulando o que o frontend faria)
    const disciplinasString = orcamento.disciplinas;
    let disciplinasAtivas = [];
    
    if (typeof disciplinasString === 'string') {
      if (disciplinasString.includes(',')) {
        disciplinasAtivas = disciplinasString.split(',').map(d => d.trim().toUpperCase());
      } else {
        disciplinasAtivas = [disciplinasString.trim().toUpperCase()];
      }
    } else if (Array.isArray(disciplinasString)) {
      disciplinasAtivas = disciplinasString.map(d => d.toUpperCase());
    }
    
    console.log(`📋 Disciplinas ativas processadas: ${disciplinasAtivas.join(', ')}`);
    
    // 4.3. Simular filtro por disciplinas ativas (possível problema)
    console.log('\n🔍 VERIFICANDO FILTROS POR DISCIPLINAS...');
    
    let cronogramaFiltrado = cronogramaArray.filter(fase => {
      // Verificar se a fase tem disciplinas que estão ativas
      const temDisciplinaAtiva = fase.disciplinas.some(disc => 
        disciplinasAtivas.includes(disc.toUpperCase())
      );
      
      console.log(`   ${fase.nome}:`);
      console.log(`     - Disciplinas da fase: ${fase.disciplinas.join(', ')}`);
      console.log(`     - Tem disciplina ativa: ${temDisciplinaAtiva ? '✅' : '❌'}`);
      
      return temDisciplinaAtiva;
    });
    
    console.log(`📊 Após filtro por disciplinas: ${cronogramaFiltrado.length} fases`);
    
    // 4.4. Contar entregáveis após filtro
    let totalEntregaveisFiltrado = 0;
    cronogramaFiltrado.forEach(fase => {
      totalEntregaveisFiltrado += fase.entregaveis.length;
    });
    
    console.log(`📊 Total entregáveis após filtro: ${totalEntregaveisFiltrado}`);
    
    // 4.5. Verificar ordenação
    cronogramaFiltrado.sort((a, b) => a.ordem - b.ordem);
    
    console.log('\n📋 FASES APÓS ORDENAÇÃO:');
    cronogramaFiltrado.forEach((fase, index) => {
      console.log(`   ${index + 1}. ${fase.nome} (${fase.entregaveis.length} entregáveis)`);
    });
    
    // 5. Simular possíveis problemas específicos
    console.log('\n🔍 VERIFICANDO POSSÍVEIS PROBLEMAS ESPECÍFICOS...');
    
    // 5.1. Problema: Disciplinas não reconhecidas
    console.log('\n5.1. VERIFICANDO RECONHECIMENTO DE DISCIPLINAS:');
    const disciplinasPadrao = ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'];
    
    cronogramaArray.forEach(fase => {
      fase.disciplinas.forEach(disc => {
        const reconhecida = disciplinasPadrao.includes(disc.toUpperCase()) || 
                           disciplinasAtivas.includes(disc.toUpperCase());
        if (!reconhecida) {
          console.log(`   ❌ Disciplina não reconhecida: ${disc} na fase ${fase.nome}`);
        }
      });
    });
    
    // 5.2. Problema: Entregáveis vazios ou nulos
    console.log('\n5.2. VERIFICANDO ENTREGÁVEIS VAZIOS:');
    cronogramaArray.forEach(fase => {
      if (!fase.entregaveis || fase.entregaveis.length === 0) {
        console.log(`   ❌ Fase sem entregáveis: ${fase.nome}`);
      } else {
        fase.entregaveis.forEach((entregavel, index) => {
          if (!entregavel || entregavel.trim() === '') {
            console.log(`   ❌ Entregável vazio na fase ${fase.nome}, posição ${index}`);
          }
        });
      }
    });
    
    // 5.3. Problema: Fases marcadas como inativas
    console.log('\n5.3. VERIFICANDO FASES INATIVAS:');
    cronogramaArray.forEach(fase => {
      if (!fase.ativa) {
        console.log(`   ❌ Fase inativa: ${fase.nome}`);
      }
    });
    
    // 6. Diagnóstico final
    console.log('\n🎯 DIAGNÓSTICO FINAL:');
    
    if (totalEntregaveisFiltrado === 72) {
      console.log('✅ O processamento do frontend está correto');
      console.log('🔍 O problema deve estar na exibição dos componentes React');
      console.log('💡 Verifique:');
      console.log('   - Componente FaseCard');
      console.log('   - Renderização condicional');
      console.log('   - Estado do React não atualizado');
    } else {
      console.log('❌ PROBLEMA ENCONTRADO NO PROCESSAMENTO!');
      console.log(`   - Original: 72 entregáveis`);
      console.log(`   - Após processamento: ${totalEntregaveisFiltrado} entregáveis`);
      console.log(`   - Diferença: ${72 - totalEntregaveisFiltrado} entregáveis perdidos`);
      
      if (cronogramaFiltrado.length < cronogramaArray.length) {
        console.log('🔧 CAUSA: Filtro por disciplinas está removendo fases');
        console.log('💡 SOLUÇÃO: Verificar lógica de filtro por disciplinas ativas');
      }
    }
    
    // 7. Mostrar detalhes das fases que podem estar sendo filtradas incorretamente
    if (cronogramaFiltrado.length < cronogramaArray.length) {
      console.log('\n❌ FASES REMOVIDAS PELO FILTRO:');
      cronogramaArray.forEach(fase => {
        const foiRemovida = !cronogramaFiltrado.find(f => f.id === fase.id);
        if (foiRemovida) {
          console.log(`   - ${fase.nome}:`);
          console.log(`     Disciplinas: ${fase.disciplinas.join(', ')}`);
          console.log(`     Entregáveis: ${fase.entregaveis.length}`);
          console.log(`     Motivo: Nenhuma disciplina da fase está ativa`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugCronogramaFrontendCompleto();