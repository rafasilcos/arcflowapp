/**
 * 🧪 TESTE COM BRIEFING REAL DO USUÁRIO
 * 
 * Script para testar o sistema de orçamentos com um briefing específico
 */

const { getClient, connectDatabase } = require('./config/database');
const OrcamentoService = require('./services/orcamentoService');

async function testarBriefingReal() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTE COM BRIEFING REAL');
  console.log('='.repeat(80));
  
  try {
    // Conectar ao banco
    await connectDatabase();
    const client = getClient();
    
    // ETAPA 1: Listar briefings disponíveis
    console.log('\n📋 BRIEFINGS DISPONÍVEIS PARA ORÇAMENTO:');
    console.log('-'.repeat(50));
    
    const briefingsDisponiveis = await client.query(`
      SELECT 
        b.id,
        b.nome_projeto,
        b.status,
        b.tipologia,
        b.disciplina,
        b.created_at,
        c.nome as cliente_nome,
        COUNT(o.id) as total_orcamentos
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN orcamentos o ON b.id = o.briefing_id AND o.deleted_at IS NULL
      WHERE b.deleted_at IS NULL
        AND b.status IN ('CONCLUIDO', 'APROVADO', 'EM_ANDAMENTO')
      GROUP BY b.id, b.nome_projeto, b.status, b.tipologia, b.disciplina, b.created_at, c.nome
      ORDER BY b.created_at DESC
      LIMIT 10
    `);
    
    if (briefingsDisponiveis.rows.length === 0) {
      console.log('❌ Nenhum briefing encontrado para teste');
      console.log('💡 Dica: Certifique-se de ter briefings com status CONCLUIDO, APROVADO ou EM_ANDAMENTO');
      process.exit(1);
    }
    
    // Mostrar briefings disponíveis
    briefingsDisponiveis.rows.forEach((briefing, index) => {
      const temOrcamento = parseInt(briefing.total_orcamentos) > 0;
      console.log(`${index + 1}. 📋 ${briefing.nome_projeto}`);
      console.log(`   🆔 ID: ${briefing.id}`);
      console.log(`   📊 Status: ${briefing.status}`);
      console.log(`   🏠 Tipologia: ${briefing.tipologia || 'N/A'}`);
      console.log(`   🔧 Disciplina: ${briefing.disciplina || 'N/A'}`);
      console.log(`   👤 Cliente: ${briefing.cliente_nome || 'N/A'}`);
      console.log(`   💰 Orçamentos: ${temOrcamento ? '✅ JÁ TEM' : '❌ SEM ORÇAMENTO'}`);
      console.log(`   📅 Criado: ${new Date(briefing.created_at).toLocaleDateString('pt-BR')}`);
      console.log('');
    });
    
    // ETAPA 2: Permitir seleção manual ou usar o primeiro
    console.log('🎯 SELECIONANDO BRIEFING PARA TESTE...');
    
    // Pegar o primeiro briefing sem orçamento
    let briefingSelecionado = briefingsDisponiveis.rows.find(b => parseInt(b.total_orcamentos) === 0);
    
    if (!briefingSelecionado) {
      // Se todos têm orçamento, pegar o primeiro mesmo assim para mostrar o comportamento
      briefingSelecionado = briefingsDisponiveis.rows[0];
      console.log('⚠️ Todos os briefings já têm orçamento, testando comportamento de duplicata...');
    }
    
    console.log(`✅ Briefing selecionado: ${briefingSelecionado.nome_projeto}`);
    console.log(`🆔 ID: ${briefingSelecionado.id}`);
    
    // ETAPA 3: Buscar dados completos do briefing
    console.log('\n🔍 DADOS COMPLETOS DO BRIEFING:');
    console.log('-'.repeat(50));
    
    const briefingCompleto = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        u.nome as responsavel_nome,
        e.nome as escritorio_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      LEFT JOIN escritorios e ON b.escritorio_id::text = e.id
      WHERE b.id = $1
    `, [briefingSelecionado.id]);
    
    const briefing = briefingCompleto.rows[0];
    
    console.log(`📋 Nome: ${briefing.nome_projeto}`);
    console.log(`📝 Descrição: ${briefing.descricao || 'N/A'}`);
    console.log(`🎯 Objetivos: ${briefing.objetivos || 'N/A'}`);
    console.log(`🏠 Tipologia: ${briefing.tipologia || 'N/A'}`);
    console.log(`🔧 Disciplina: ${briefing.disciplina || 'N/A'}`);
    console.log(`👤 Cliente: ${briefing.cliente_nome || 'N/A'}`);
    console.log(`👨‍💼 Responsável: ${briefing.responsavel_nome || 'N/A'}`);
    console.log(`🏢 Escritório: ${briefing.escritorio_nome || 'N/A'}`);
    
    // Mostrar observações/respostas se existirem
    if (briefing.observacoes) {
      console.log('\n📝 RESPOSTAS DO BRIEFING:');
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        if (observacoes.respostas) {
          Object.entries(observacoes.respostas).forEach(([pergunta, resposta]) => {
            if (resposta && resposta.toString().trim()) {
              console.log(`   • ${pergunta}: ${resposta}`);
            }
          });
        } else {
          console.log('   (Estrutura de respostas não encontrada)');
        }
      } catch (error) {
        console.log('   (Erro ao parsear respostas)');
      }
    }
    
    // ETAPA 4: Gerar orçamento
    console.log('\n🚀 GERANDO ORÇAMENTO INTELIGENTE...');
    console.log('-'.repeat(50));
    
    try {
      const resultado = await OrcamentoService.gerarOrcamentoInteligente(
        briefing.id,
        briefing.escritorio_id,
        briefing.responsavel_id || briefing.created_by
      );
      
      console.log('🎉 ORÇAMENTO GERADO COM SUCESSO!');
      console.log(`📋 ID do Orçamento: ${resultado.data.orcamentoId}`);
      console.log(`🔢 Código: ${resultado.data.codigo}`);
      console.log(`💰 Valor Total: ${resultado.data.valorTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
      console.log(`📊 Valor por m²: ${resultado.data.valorPorM2?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
      console.log(`📏 Área: ${resultado.data.areaConstruida || 'N/A'}m²`);
      console.log(`⏰ Prazo: ${resultado.data.prazoEntrega || 'N/A'} semanas`);
      console.log(`🎯 Confiança: ${(resultado.data.dadosExtaidosIA?.indicadores?.confianca * 100)?.toFixed(1) || 'N/A'}%`);
      
      // Mostrar dados extraídos pela IA
      if (resultado.data.dadosExtaidosIA) {
        console.log('\n🧠 DADOS EXTRAÍDOS PELA IA:');
        console.log(`   🏠 Tipologia: ${resultado.data.dadosExtaidosIA.tipologia}`);
        console.log(`   ⭐ Complexidade: ${resultado.data.dadosExtaidosIA.complexidade}`);
        console.log(`   🔧 Disciplinas: ${resultado.data.dadosExtaidosIA.disciplinas?.join(', ') || 'N/A'}`);
        console.log(`   ✨ Características: ${resultado.data.dadosExtaidosIA.caracteristicas?.join(', ') || 'Nenhuma'}`);
      }
      
      // Mostrar composição financeira
      if (resultado.data.composicaoFinanceira) {
        const comp = resultado.data.composicaoFinanceira;
        console.log('\n💼 COMPOSIÇÃO FINANCEIRA:');
        console.log(`   💻 Custo Técnico: ${comp.custoTecnico?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
        console.log(`   🏢 Custos Indiretos: ${comp.custosIndiretos?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
        console.log(`   📋 Impostos: ${comp.impostos?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
        console.log(`   🛡️ Contingência: ${comp.contingencia?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
        console.log(`   💎 Lucro: ${comp.lucro?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}`);
      }
      
    } catch (error) {
      if (error.code === 'ORCAMENTO_ALREADY_EXISTS') {
        console.log('ℹ️ ORÇAMENTO JÁ EXISTE (comportamento esperado)');
        console.log(`📋 ID Existente: ${error.details?.orcamentoId}`);
        console.log(`🔢 Código: ${error.details?.codigo}`);
        console.log(`📊 Status: ${error.details?.status}`);
        console.log(`📅 Criado em: ${new Date(error.details?.criadoEm).toLocaleString('pt-BR')}`);
      } else if (error.code === 'BRIEFING_INVALID_STATUS') {
        console.log('⚠️ STATUS DO BRIEFING INVÁLIDO');
        console.log(`📊 Status atual: ${error.message.split(': ')[1]}`);
        console.log('💡 Dica: Briefing deve estar CONCLUIDO, APROVADO ou EM_ANDAMENTO');
      } else {
        console.error('❌ ERRO:', error.message);
        throw error;
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(80));
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error);
    process.exit(1);
  }
}

// Executar teste
if (require.main === module) {
  testarBriefingReal();
}

module.exports = { testarBriefingReal };