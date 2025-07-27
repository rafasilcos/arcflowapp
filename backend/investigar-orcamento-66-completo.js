/**
 * 🔍 INVESTIGAÇÃO COMPLETA DO ORÇAMENTO 66
 * Recuperar TODOS os dados para reconstruir a página frontend
 */

const { connectDatabase, getClient } = require('./config/database');

async function investigarOrcamento66Completo() {
  // Inicializar conexão com o banco
  await connectDatabase();
  const client = getClient();
  
  try {
    console.log('🔍 INVESTIGAÇÃO COMPLETA DO ORÇAMENTO 66');
    console.log('=====================================\n');
    
    // 1. DADOS BÁSICOS DO ORÇAMENTO
    console.log('1️⃣ DADOS BÁSICOS DO ORÇAMENTO:');
    const orcamentoQuery = `
      SELECT 
        o.*,
        b.nome_projeto as briefing_nome,
        b.dados_extraidos as briefing_dados_extraidos,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        u.nome as responsavel_nome,
        e.nome as escritorio_nome
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN clientes c ON o.cliente_id::text = c.id::text
      LEFT JOIN users u ON o.responsavel_id::text = u.id::text
      LEFT JOIN escritorios e ON o.escritorio_id::text = e.id::text
      WHERE o.id = 66
    `;
    
    const orcamentoResult = await client.query(orcamentoQuery);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ Orçamento 66 não encontrado!');
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    
    console.log('📊 DADOS PRINCIPAIS:');
    console.log('- ID:', orcamento.id);
    console.log('- Código:', orcamento.codigo);
    console.log('- Nome:', orcamento.nome);
    console.log('- Status:', orcamento.status);
    console.log('- Cliente:', orcamento.cliente_nome);
    console.log('- Valor Total:', orcamento.valor_total);
    console.log('- Área Construída:', orcamento.area_construida);
    console.log('- Tipologia:', orcamento.tipologia);
    console.log('- Padrão:', orcamento.padrao);
    console.log('- Complexidade:', orcamento.complexidade);
    console.log('- Localização:', orcamento.localizacao);
    console.log('- Prazo Entrega:', orcamento.prazo_entrega);
    console.log('- Criado em:', orcamento.created_at);
    console.log('- Atualizado em:', orcamento.updated_at);
    
    // 2. DISCIPLINAS
    console.log('\n2️⃣ DISCIPLINAS:');
    let disciplinas = [];
    try {
      disciplinas = typeof orcamento.disciplinas === 'string' 
        ? JSON.parse(orcamento.disciplinas) 
        : orcamento.disciplinas || [];
      console.log('- Disciplinas ativas:', disciplinas);
      console.log('- Total de disciplinas:', disciplinas.length);
    } catch (error) {
      console.log('❌ Erro ao fazer parse das disciplinas:', error.message);
      console.log('- Disciplinas raw:', orcamento.disciplinas);
    }
    
    // 3. CRONOGRAMA DETALHADO
    console.log('\n3️⃣ CRONOGRAMA DETALHADO:');
    let cronograma = null;
    try {
      cronograma = typeof orcamento.cronograma === 'string' 
        ? JSON.parse(orcamento.cronograma) 
        : orcamento.cronograma;
      
      if (cronograma) {
        console.log('- Prazo Total:', cronograma.prazoTotal, 'semanas');
        console.log('- Valor Técnico Total:', cronograma.valorTecnicoTotal);
        console.log('- Metodologia:', cronograma.metodologia);
        console.log('- Total de Fases:', Object.keys(cronograma.fases || {}).length);
        
        if (cronograma.estatisticas) {
          console.log('- Total de Entregáveis:', cronograma.estatisticas.totalEntregaveis);
          console.log('- Fases Multidisciplinares:', cronograma.estatisticas.fasesMultidisciplinares);
        }
        
        console.log('\n📋 FASES DO CRONOGRAMA:');
        const fases = Object.values(cronograma.fases || {});
        fases.forEach((fase, index) => {
          console.log(`\n   Fase ${index + 1}: ${fase.nome}`);
          console.log(`   - Ordem: ${fase.ordem}`);
          console.log(`   - Etapa: ${fase.etapa}`);
          console.log(`   - Prazo: ${fase.prazo} semanas`);
          console.log(`   - Valor: R$ ${fase.valor?.toLocaleString('pt-BR')}`);
          console.log(`   - Percentual: ${(fase.percentual * 100).toFixed(1)}%`);
          console.log(`   - Disciplinas: ${fase.disciplinas?.join(', ')}`);
          console.log(`   - Responsável: ${fase.responsavel}`);
          console.log(`   - Entregáveis: ${fase.entregaveis?.length || 0} itens`);
          
          if (fase.entregaveis && fase.entregaveis.length > 0) {
            console.log('   - Primeiros entregáveis:');
            fase.entregaveis.slice(0, 3).forEach((entregavel, idx) => {
              console.log(`     ${idx + 1}. ${entregavel}`);
            });
            if (fase.entregaveis.length > 3) {
              console.log(`     ... e mais ${fase.entregaveis.length - 3} itens`);
            }
          }
        });
      } else {
        console.log('❌ Cronograma não encontrado ou vazio');
      }
    } catch (error) {
      console.log('❌ Erro ao fazer parse do cronograma:', error.message);
      console.log('- Cronograma raw:', orcamento.cronograma);
    }
    
    // 4. COMPOSIÇÃO FINANCEIRA
    console.log('\n4️⃣ COMPOSIÇÃO FINANCEIRA:');
    let composicaoFinanceira = null;
    try {
      composicaoFinanceira = typeof orcamento.composicao_financeira === 'string' 
        ? JSON.parse(orcamento.composicao_financeira) 
        : orcamento.composicao_financeira;
      
      if (composicaoFinanceira) {
        console.log('- Custo Técnico:', composicaoFinanceira.custoTecnico?.toLocaleString('pt-BR'));
        console.log('- Custos Indiretos:', composicaoFinanceira.custosIndiretos?.toLocaleString('pt-BR'));
        console.log('- Impostos:', composicaoFinanceira.impostos?.toLocaleString('pt-BR'));
        console.log('- Contingência:', composicaoFinanceira.contingencia?.toLocaleString('pt-BR'));
        console.log('- Lucro:', composicaoFinanceira.lucro?.toLocaleString('pt-BR'));
        console.log('- Subtotal:', composicaoFinanceira.subtotal?.toLocaleString('pt-BR'));
        console.log('- Valor Final:', composicaoFinanceira.valorFinal?.toLocaleString('pt-BR'));
        
        if (composicaoFinanceira.percentuais) {
          console.log('- Percentuais:');
          console.log('  - Custos Indiretos:', (composicaoFinanceira.percentuais.custos_indiretos * 100).toFixed(1) + '%');
          console.log('  - Impostos:', (composicaoFinanceira.percentuais.impostos * 100).toFixed(1) + '%');
          console.log('  - Contingência:', (composicaoFinanceira.percentuais.contingencia * 100).toFixed(1) + '%');
          console.log('  - Margem de Lucro:', (composicaoFinanceira.percentuais.margem_lucro * 100).toFixed(1) + '%');
        }
      } else {
        console.log('❌ Composição financeira não encontrada');
      }
    } catch (error) {
      console.log('❌ Erro ao fazer parse da composição financeira:', error.message);
      console.log('- Composição raw:', orcamento.composicao_financeira);
    }
    
    // 5. PROPOSTA COMERCIAL
    console.log('\n5️⃣ PROPOSTA COMERCIAL:');
    let proposta = null;
    try {
      proposta = typeof orcamento.proposta === 'string' 
        ? JSON.parse(orcamento.proposta) 
        : orcamento.proposta;
      
      if (proposta) {
        console.log('- Forma de Pagamento:');
        if (proposta.formaPagamento) {
          console.log('  - Entrada:', proposta.formaPagamento.entrada + '%');
          console.log('  - Parcelas:', proposta.formaPagamento.parcelas);
        }
        console.log('- Validade da Oferta:', proposta.validadeOferta, 'dias');
        console.log('- Prazo de Entrega:', proposta.prazoEntrega, 'semanas');
        console.log('- Observações:', proposta.observacoes);
      } else {
        console.log('❌ Proposta comercial não encontrada');
      }
    } catch (error) {
      console.log('❌ Erro ao fazer parse da proposta:', error.message);
      console.log('- Proposta raw:', orcamento.proposta);
    }
    
    // 6. DADOS EXTRAÍDOS (IA)
    console.log('\n6️⃣ DADOS EXTRAÍDOS PELA IA:');
    let dadosExtraidos = null;
    try {
      dadosExtraidos = typeof orcamento.dados_extraidos === 'string' 
        ? JSON.parse(orcamento.dados_extraidos) 
        : orcamento.dados_extraidos;
      
      if (dadosExtraidos) {
        console.log('- Tipologia:', dadosExtraidos.tipologia);
        console.log('- Complexidade:', dadosExtraidos.complexidade);
        console.log('- Disciplinas Necessárias:', dadosExtraidos.disciplinasNecessarias);
        console.log('- Características Especiais:', dadosExtraidos.caracteristicasEspeciais);
        console.log('- Nome do Projeto:', dadosExtraidos.nomeProjeto);
        console.log('- Cliente ID:', dadosExtraidos.clienteId);
        console.log('- Localização:', dadosExtraidos.localizacao);
      } else {
        console.log('❌ Dados extraídos não encontrados');
      }
    } catch (error) {
      console.log('❌ Erro ao fazer parse dos dados extraídos:', error.message);
      console.log('- Dados extraídos raw:', orcamento.dados_extraidos);
    }
    
    // 7. BRIEFING RELACIONADO
    console.log('\n7️⃣ BRIEFING RELACIONADO:');
    console.log('- Nome do Projeto:', orcamento.briefing_nome);
    console.log('- Briefing ID:', orcamento.briefing_id);
    
    if (orcamento.briefing_dados_extraidos) {
      try {
        const dadosBriefing = typeof orcamento.briefing_dados_extraidos === 'string' 
          ? JSON.parse(orcamento.briefing_dados_extraidos) 
          : orcamento.briefing_dados_extraidos;
        
        console.log('- Dados do Briefing:', Object.keys(dadosBriefing).length, 'propriedades');
        
        // Mostrar algumas propriedades importantes
        const propriedadesImportantes = [
          'tipologia',
          'complexidade',
          'areaConstruida',
          'localizacao',
          'disciplinasNecessarias'
        ];
        
        console.log('- Propriedades Importantes:');
        propriedadesImportantes.forEach(chave => {
          if (dadosBriefing[chave]) {
            console.log(`  - ${chave}: ${dadosBriefing[chave]}`);
          }
        });
      } catch (error) {
        console.log('❌ Erro ao fazer parse das respostas do briefing:', error.message);
      }
    }
    
    // 8. RESUMO PARA RECONSTRUÇÃO
    console.log('\n8️⃣ RESUMO PARA RECONSTRUÇÃO DA PÁGINA:');
    console.log('=====================================');
    console.log('✅ Dados disponíveis para reconstrução:');
    console.log('- ✅ Dados básicos do orçamento');
    console.log('- ✅ Informações do cliente');
    console.log('- ✅ Disciplinas ativas:', disciplinas.length > 0 ? 'SIM' : 'NÃO');
    console.log('- ✅ Cronograma detalhado:', cronograma ? 'SIM' : 'NÃO');
    console.log('- ✅ Composição financeira:', composicaoFinanceira ? 'SIM' : 'NÃO');
    console.log('- ✅ Proposta comercial:', proposta ? 'SIM' : 'NÃO');
    console.log('- ✅ Dados extraídos IA:', dadosExtraidos ? 'SIM' : 'NÃO');
    
    if (cronograma && cronograma.fases) {
      const totalEntregaveis = Object.values(cronograma.fases).reduce((total, fase) => total + (fase.entregaveis?.length || 0), 0);
      console.log(`- ✅ Total de entregáveis: ${totalEntregaveis}`);
      console.log(`- ✅ Total de fases: ${Object.keys(cronograma.fases).length}`);
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Reconstruir página frontend com base nesses dados');
    console.log('2. Implementar todas as seções: Resumo, Cronograma, Financeiro');
    console.log('3. Garantir que TODOS os entregáveis sejam exibidos');
    console.log('4. Implementar funcionalidades avançadas (benchmarking, análises)');
    console.log('5. Adicionar componentes que estavam na versão de 1000 linhas');
    
    console.log('\n✅ INVESTIGAÇÃO CONCLUÍDA COM SUCESSO!');
    
    return {
      orcamento,
      disciplinas,
      cronograma,
      composicaoFinanceira,
      proposta,
      dadosExtraidos,
      totalEntregaveis: cronograma?.fases ? Object.values(cronograma.fases).reduce((total, fase) => total + (fase.entregaveis?.length || 0), 0) : 0
    };
    
  } catch (error) {
    console.error('❌ Erro na investigação:', error);
    throw error;
  }
}

// Executar investigação
investigarOrcamento66Completo()
  .then(() => {
    console.log('\n🎉 Investigação finalizada!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });