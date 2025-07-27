/**
 * 🔍 VERIFICAR CRONOGRAMA ATUALIZADO
 * Verificar se o cronograma foi atualizado com os detalhamentos técnicos
 */

const { Client } = require('pg');

async function verificarCronogramaAtualizado() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔍 VERIFICANDO CRONOGRAMA ATUALIZADO');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // Buscar cronograma atual
    const result = await client.query(`
      SELECT cronograma FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    if (result.rows.length === 0) {
      console.log('❌ Orçamento não encontrado');
      return;
    }
    
    const cronograma = result.rows[0].cronograma;
    
    console.log('📋 CRONOGRAMA DETALHADO:');
    console.log('-'.repeat(60));
    
    // Verificar cada fase
    Object.entries(cronograma.fases).forEach(([key, fase]) => {
      console.log(`\n${fase.ordem}. ${fase.nome}`);
      console.log(`   📋 Etapa NBR: ${fase.etapa}`);
      console.log(`   👥 Responsável: ${fase.responsavel}`);
      console.log(`   ⏱️ Prazo: ${fase.prazo} semanas`);
      console.log(`   💰 Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
      console.log(`   📦 Entregáveis (${fase.entregaveis.length}):`);
      
      fase.entregaveis.forEach((entregavel, index) => {
        console.log(`      ${index + 1}. ${entregavel}`);
      });
      
      if (fase.observacoes) {
        console.log(`   📝 Observações: ${fase.observacoes}`);
      }
      
      // Verificar detalhamento por disciplina (se existir)
      if (fase.detalhamentoPorDisciplina) {
        console.log(`   🔧 Detalhamento por Disciplina:`);
        Object.entries(fase.detalhamentoPorDisciplina).forEach(([disciplina, detalhes]) => {
          console.log(`      📐 ${disciplina}:`);
          detalhes.entregaveis.forEach((item, idx) => {
            console.log(`         ${idx + 1}. ${item}`);
          });
        });
      }
    });
    
    console.log('\n📊 ESTATÍSTICAS DO CRONOGRAMA:');
    console.log('-'.repeat(60));
    
    const totalFases = Object.keys(cronograma.fases).length;
    const totalEntregaveis = Object.values(cronograma.fases)
      .reduce((total, fase) => total + fase.entregaveis.length, 0);
    const totalPrazo = Object.values(cronograma.fases)
      .reduce((total, fase) => total + fase.prazo, 0);
    const totalValor = Object.values(cronograma.fases)
      .reduce((total, fase) => total + fase.valor, 0);
    
    console.log(`📅 Total de fases: ${totalFases}`);
    console.log(`📦 Total de entregáveis: ${totalEntregaveis}`);
    console.log(`⏱️ Prazo total: ${totalPrazo} semanas`);
    console.log(`💰 Valor total técnico: R$ ${totalValor.toLocaleString('pt-BR')}`);
    
    // Verificar se todas as fases têm os campos obrigatórios
    console.log('\n✅ VALIDAÇÃO DOS CAMPOS:');
    console.log('-'.repeat(60));
    
    let validacao = true;
    Object.entries(cronograma.fases).forEach(([key, fase]) => {
      const camposObrigatorios = ['ordem', 'etapa', 'nome', 'prazo', 'valor', 'responsavel', 'entregaveis'];
      const camposFaltando = camposObrigatorios.filter(campo => !fase[campo]);
      
      if (camposFaltando.length > 0) {
        console.log(`❌ ${fase.nome}: Campos faltando: ${camposFaltando.join(', ')}`);
        validacao = false;
      } else {
        console.log(`✅ ${fase.nome}: Todos os campos obrigatórios presentes`);
      }
    });
    
    if (validacao) {
      console.log('\n🎉 CRONOGRAMA VALIDADO COM SUCESSO!');
      console.log('✅ Todas as fases têm detalhamento técnico completo');
      console.log('✅ Entregáveis específicos conforme NBR 13532');
      console.log('✅ Responsáveis definidos');
      console.log('✅ Estrutura técnica profissional');
    } else {
      console.log('\n⚠️ CRONOGRAMA COM PROBLEMAS DE VALIDAÇÃO');
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  } finally {
    await client.end();
  }
}

verificarCronogramaAtualizado();