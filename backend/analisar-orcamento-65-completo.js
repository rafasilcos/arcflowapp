/**
 * 🔍 ANÁLISE COMPLETA: ORÇAMENTO 65
 * 
 * Investigar exatamente onde está o problema na geração do cronograma
 */

const { connectDatabase, getClient } = require('./config/database');

async function analisarOrcamento65() {
  console.log('🔍 ANÁLISE COMPLETA DO ORÇAMENTO 65\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // 1. Verificar se orçamento 65 existe
    console.log('1. 📋 VERIFICANDO ORÇAMENTO 65...');
    
    const orcamentoResult = await client.query(`
      SELECT id, codigo, nome, valor_total, cronograma, disciplinas, 
             composicao_financeira, briefing_id, created_at
      FROM orcamentos 
      WHERE id = 65
    `);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ ORÇAMENTO 65 NÃO ENCONTRADO!');
      
      // Listar orçamentos existentes
      const existentes = await client.query('SELECT id, codigo, nome FROM orcamentos ORDER BY id DESC LIMIT 5');
      console.log('\n📋 ORÇAMENTOS EXISTENTES:');
      existentes.rows.forEach(orc => {
        console.log(`   - ID ${orc.id}: ${orc.codigo} - ${orc.nome}`);
      });
      
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    
    console.log('✅ ORÇAMENTO 65 ENCONTRADO:');
    console.log(`   - ID: ${orcamento.id}`);
    console.log(`   - Código: ${orcamento.codigo}`);
    console.log(`   - Nome: ${orcamento.nome}`);
    console.log(`   - Valor Total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    console.log(`   - Briefing ID: ${orcamento.briefing_id}`);
    console.log(`   - Criado em: ${orcamento.created_at}`);
    
    // 2. Analisar cronograma atual
    console.log('\n2. 📅 ANALISANDO CRONOGRAMA ATUAL...');
    
    if (!orcamento.cronograma) {
      console.log('❌ CRONOGRAMA NÃO EXISTE!');
      return;
    }
    
    const cronograma = orcamento.cronograma;
    console.log(`   - Tipo: ${typeof cronograma}`);
    
    if (typeof cronograma === 'object') {
      console.log('✅ Cronograma é um objeto válido');
      
      if (cronograma.fases) {
        console.log(`   - Formato: Objeto com fases estruturadas`);
        console.log(`   - Prazo Total: ${cronograma.prazoTotal || 'N/A'} semanas`);
        console.log(`   - Metodologia: ${cronograma.metodologia || 'N/A'}`);
        console.log(`   - Total Entregáveis: ${cronograma.totalEntregaveis || 'N/A'}`);
        console.log(`   - Número de Fases: ${Object.keys(cronograma.fases).length}`);
        
        // Analisar cada fase detalhadamente
        console.log('\n📋 ANÁLISE DETALHADA DAS FASES:');
        let totalEntregaveisContados = 0;
        
        Object.keys(cronograma.fases).forEach((faseKey, index) => {
          const fase = cronograma.fases[faseKey];
          const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
          totalEntregaveisContados += numEntregaveis;
          
          console.log(`\n   ${index + 1}. ${fase.codigo || faseKey} - ${fase.nome}:`);
          console.log(`      - Etapa: ${fase.etapa || 'N/A'}`);
          console.log(`      - Ordem: ${fase.ordem || 'N/A'}`);
          console.log(`      - Prazo: ${fase.prazo || 'N/A'} semanas`);
          console.log(`      - Valor: R$ ${(fase.valor || 0).toLocaleString('pt-BR')}`);
          console.log(`      - Entregáveis: ${numEntregaveis} itens`);
          console.log(`      - Disciplinas: ${fase.disciplinas ? fase.disciplinas.join(', ') : 'N/A'}`);
          
          if (fase.entregaveis && fase.entregaveis.length > 0) {
            console.log(`      📝 ENTREGÁVEIS:`);
            fase.entregaveis.slice(0, 3).forEach((entregavel, i) => {
              console.log(`         ${i + 1}. ${entregavel}`);
            });
            if (fase.entregaveis.length > 3) {
              console.log(`         ... e mais ${fase.entregaveis.length - 3} entregáveis`);
            }
          } else {
            console.log(`      ❌ NENHUM ENTREGÁVEL ENCONTRADO!`);
          }
        });
        
        console.log(`\n   📊 CONTAGEM TOTAL: ${totalEntregaveisContados} entregáveis`);
        console.log(`   📊 ESPERADO: 72 entregáveis`);
        console.log(`   📊 STATUS: ${totalEntregaveisContados === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
        
      } else if (Array.isArray(cronograma)) {
        console.log(`   - Formato: Array com ${cronograma.length} fases (formato antigo)`);
        console.log('   ⚠️ PROBLEMA: Usando formato antigo de cronograma!');
      } else {
        console.log('   ❌ FORMATO DESCONHECIDO DE CRONOGRAMA!');
        console.log('   📊 Estrutura:', Object.keys(cronograma));
      }
    }
    
    // 3. Verificar disciplinas
    console.log('\n3. 🔧 VERIFICANDO DISCIPLINAS...');
    
    if (orcamento.disciplinas) {
      let disciplinas = [];
      
      if (Array.isArray(orcamento.disciplinas)) {
        disciplinas = orcamento.disciplinas;
      } else if (typeof orcamento.disciplinas === 'string') {
        if (orcamento.disciplinas.includes(',')) {
          disciplinas = orcamento.disciplinas.split(',').map(d => d.trim());
        } else {
          disciplinas = [orcamento.disciplinas];
        }
      }
      
      console.log(`   - Disciplinas: ${disciplinas.join(', ')}`);
      console.log(`   - Quantidade: ${disciplinas.length}`);
    } else {
      console.log('   ❌ DISCIPLINAS NÃO DEFINIDAS!');
    }
    
    // 4. Verificar briefing associado
    if (orcamento.briefing_id) {
      console.log('\n4. 📝 VERIFICANDO BRIEFING ASSOCIADO...');
      
      const briefingResult = await client.query(`
        SELECT id, nome_projeto, tipologia, area, complexidade, status
        FROM briefings 
        WHERE id = $1
      `, [orcamento.briefing_id]);
      
      if (briefingResult.rows.length > 0) {
        const briefing = briefingResult.rows[0];
        console.log('✅ BRIEFING ENCONTRADO:');
        console.log(`   - Nome: ${briefing.nome_projeto}`);
        console.log(`   - Tipologia: ${briefing.tipologia}`);
        console.log(`   - Área: ${briefing.area}`);
        console.log(`   - Complexidade: ${briefing.complexidade || 'N/A'}`);
        console.log(`   - Status: ${briefing.status}`);
      } else {
        console.log('❌ BRIEFING NÃO ENCONTRADO!');
      }
    }
    
    // 5. Diagnóstico final
    console.log('\n🎯 DIAGNÓSTICO FINAL:');
    
    const problemas = [];
    
    if (!orcamento.cronograma) {
      problemas.push('Cronograma não existe');
    } else if (!orcamento.cronograma.fases) {
      problemas.push('Cronograma não tem estrutura de fases');
    } else {
      const totalEntregaveis = orcamento.cronograma.totalEntregaveis;
      if (totalEntregaveis !== 72) {
        problemas.push(`Total de entregáveis incorreto: ${totalEntregaveis} (esperado: 72)`);
      }
      
      // Verificar se fases estão na ordem correta
      const fasesEsperadas = ['LV_LEVANTAMENTO_DADOS', 'PN_PROGRAMA_NECESSIDADES', 'EV_ESTUDO_VIABILIDADE', 
                             'EP_ESTUDO_PRELIMINAR', 'AP_ANTEPROJETO', 'PL_PROJETO_LEGAL', 
                             'PB_PROJETO_BASICO', 'PE_PROJETO_EXECUTIVO'];
      
      const fasesAtuais = Object.keys(orcamento.cronograma.fases);
      const fasesCorretas = fasesEsperadas.every(fase => fasesAtuais.includes(fase));
      
      if (!fasesCorretas) {
        problemas.push('Fases do cronograma não estão corretas');
      }
    }
    
    if (problemas.length === 0) {
      console.log('✅ CRONOGRAMA PARECE ESTAR CORRETO!');
      console.log('   O problema pode estar na exibição no frontend');
    } else {
      console.log('❌ PROBLEMAS ENCONTRADOS:');
      problemas.forEach(problema => {
        console.log(`   - ${problema}`);
      });
    }
    
  } catch (error) {
    console.error('❌ ERRO NA ANÁLISE:', error);
  }
}

analisarOrcamento65()
  .then(() => {
    console.log('\n🔍 ANÁLISE CONCLUÍDA');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NA ANÁLISE:', error);
    process.exit(1);
  });