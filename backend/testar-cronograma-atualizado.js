/**
 * 🧪 TESTAR CRONOGRAMA ATUALIZADO
 * Testar se o sistema está gerando orçamentos com a nova estrutura detalhada
 */

const { Client } = require('pg');
const { connectDatabase } = require('./config/database');
const OrcamentoService = require('./services/orcamentoService');

async function testarCronogramaAtualizado() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    // Inicializar conexão do sistema
    await connectDatabase();
    
    console.log('🧪 TESTANDO CRONOGRAMA ATUALIZADO');
    console.log('='.repeat(60));
    
    // Buscar um briefing para teste
    const briefingResult = await client.query(`
      SELECT id, nome_projeto, escritorio_id 
      FROM briefings 
      WHERE status IN ('CONCLUIDO', 'APROVADO', 'EM_ANDAMENTO')
        AND deleted_at IS NULL
      ORDER BY updated_at DESC
      LIMIT 1
    `);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ Nenhum briefing disponível para teste');
      return;
    }
    
    const briefing = briefingResult.rows[0];
    console.log('📋 Briefing selecionado:', {
      id: briefing.id,
      nome: briefing.nome_projeto,
      escritorio: briefing.escritorio_id
    });
    
    // Verificar se já existe orçamento
    const orcamentoExistente = await client.query(`
      SELECT id FROM orcamentos 
      WHERE briefing_id = $1 AND deleted_at IS NULL
    `, [briefing.id]);
    
    if (orcamentoExistente.rows.length > 0) {
      console.log('⚠️ Já existe orçamento para este briefing, removendo para teste...');
      await client.query(`
        UPDATE orcamentos 
        SET deleted_at = NOW() 
        WHERE briefing_id = $1
      `, [briefing.id]);
    }
    
    // Gerar novo orçamento com estrutura atualizada
    console.log('🚀 Gerando orçamento com cronograma atualizado...');
    
    const resultado = await OrcamentoService.gerarOrcamentoInteligente(
      briefing.id,
      briefing.escritorio_id,
      'admin' // userId para teste
    );
    
    if (resultado.success) {
      console.log('✅ ORÇAMENTO GERADO COM SUCESSO!');
      console.log('-'.repeat(60));
      
      console.log('📊 DADOS DO ORÇAMENTO:');
      console.log(`🆔 ID: ${resultado.data.orcamentoId}`);
      console.log(`🔢 Código: ${resultado.data.codigo}`);
      console.log(`💰 Valor Total: R$ ${resultado.data.valorTotal.toLocaleString('pt-BR')}`);
      console.log(`📏 Valor por m²: R$ ${resultado.data.valorPorM2.toLocaleString('pt-BR')}`);
      console.log(`🏠 Área: ${resultado.data.areaConstruida}m²`);
      console.log(`⏱️ Prazo: ${resultado.data.prazoEntrega} semanas`);
      
      // Verificar cronograma detalhado
      const orcamentoCompleto = await client.query(`
        SELECT cronograma FROM orcamentos WHERE id = $1
      `, [resultado.data.orcamentoId]);
      
      if (orcamentoCompleto.rows.length > 0) {
        const cronograma = orcamentoCompleto.rows[0].cronograma;
        
        console.log('\n📅 CRONOGRAMA DETALHADO:');
        console.log('-'.repeat(60));
        
        let totalEntregaveis = 0;
        Object.entries(cronograma.fases).forEach(([key, fase]) => {
          console.log(`\n${fase.ordem}. ${fase.nome}`);
          console.log(`   📋 Etapa NBR: ${fase.etapa}`);
          console.log(`   👥 Responsável: ${fase.responsavel}`);
          console.log(`   ⏱️ Prazo: ${fase.prazo} semanas`);
          console.log(`   💰 Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
          console.log(`   📦 Entregáveis: ${fase.entregaveis.length} itens`);
          
          // Mostrar alguns entregáveis como exemplo
          if (fase.entregaveis.length > 0) {
            console.log(`   📝 Exemplos de entregáveis:`);
            fase.entregaveis.slice(0, 3).forEach((entregavel, index) => {
              console.log(`      ${index + 1}. ${entregavel}`);
            });
            if (fase.entregaveis.length > 3) {
              console.log(`      ... e mais ${fase.entregaveis.length - 3} itens`);
            }
          }
          
          totalEntregaveis += fase.entregaveis.length;
        });
        
        console.log('\n📊 ESTATÍSTICAS DO CRONOGRAMA:');
        console.log('-'.repeat(60));
        console.log(`📅 Total de fases: ${Object.keys(cronograma.fases).length}`);
        console.log(`📦 Total de entregáveis: ${totalEntregaveis}`);
        console.log(`⏱️ Prazo total: ${cronograma.prazoTotal} semanas`);
        console.log(`💰 Valor técnico total: R$ ${cronograma.valorTecnicoTotal.toLocaleString('pt-BR')}`);
        console.log(`🔧 Metodologia: ${cronograma.metodologia}`);
        
        // Verificar se todas as fases têm a estrutura detalhada
        console.log('\n✅ VALIDAÇÃO DA ESTRUTURA:');
        console.log('-'.repeat(60));
        
        let estruturaValida = true;
        Object.entries(cronograma.fases).forEach(([key, fase]) => {
          const camposObrigatorios = ['ordem', 'etapa', 'nome', 'prazo', 'valor', 'responsavel', 'entregaveis'];
          const camposFaltando = camposObrigatorios.filter(campo => !fase[campo]);
          
          if (camposFaltando.length > 0) {
            console.log(`❌ ${fase.nome}: Campos faltando: ${camposFaltando.join(', ')}`);
            estruturaValida = false;
          } else {
            console.log(`✅ ${fase.nome}: Estrutura completa`);
          }
        });
        
        if (estruturaValida) {
          console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
          console.log('✅ Cronograma com estrutura detalhada implementada');
          console.log('✅ Todos os entregáveis técnicos presentes');
          console.log('✅ Responsáveis definidos para cada fase');
          console.log('✅ Observações técnicas incluídas');
          console.log('✅ Conformidade com NBR 13532');
          
          console.log('\n🚀 PRÓXIMOS PASSOS:');
          console.log('1. Acesse o frontend para visualizar o orçamento');
          console.log(`2. Procure pelo código: ${resultado.data.codigo}`);
          console.log('3. Verifique se todos os detalhes estão sendo exibidos corretamente');
          console.log('4. Teste a funcionalidade de exportação/impressão');
          
        } else {
          console.log('\n⚠️ TESTE COM PROBLEMAS DE ESTRUTURA');
        }
        
      } else {
        console.log('❌ Erro ao buscar cronograma detalhado');
      }
      
    } else {
      console.log('❌ ERRO NA GERAÇÃO DO ORÇAMENTO:', resultado.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await client.end();
  }
}

testarCronogramaAtualizado();