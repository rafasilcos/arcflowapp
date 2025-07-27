/**
 * 🧪 TESTE: CRONOGRAMA CORRIGIDO
 * 
 * Testar se a correção dos prazos NBR 13532 funcionou
 * Projeto residencial 250m² deve resultar em ~10 semanas (não 56!)
 */

// Importar a classe diretamente
const OrcamentoCalculator = require('./utils/orcamentoCalculator');

async function testarCronogramaCorrigido() {
  console.log('🧪 TESTANDO CRONOGRAMA CORRIGIDO\n');
  
  // Simular dados de um projeto residencial 250m²
  const dadosTesteProjeto = {
    nomeProjeto: 'Casa Residencial Teste',
    tipologia: 'RESIDENCIAL',
    subtipo: 'unifamiliar',
    areaConstruida: 250,
    areaTerreno: 400,
    complexidade: 'MEDIA',
    localizacao: 'BRASIL',
    disciplinasNecessarias: [
      'ARQUITETURA',
      'ESTRUTURAL', 
      'INSTALACOES_ELETRICAS',
      'INSTALACOES_HIDRAULICAS'
    ],
    clienteId: 'test-client-123',
    escritorioId: 'test-escritorio-456'
  };
  
  console.log('📊 DADOS DO PROJETO:');
  console.log(`- Nome: ${dadosTesteProjeto.nomeProjeto}`);
  console.log(`- Tipologia: ${dadosTesteProjeto.tipologia} - ${dadosTesteProjeto.subtipo}`);
  console.log(`- Área construída: ${dadosTesteProjeto.areaConstruida}m²`);
  console.log(`- Complexidade: ${dadosTesteProjeto.complexidade}`);
  console.log(`- Disciplinas: ${dadosTesteProjeto.disciplinasNecessarias.length}`);
  console.log(`- Localização: ${dadosTesteProjeto.localizacao}\n`);
  
  try {
    // Instanciar calculadora
    const calculator = new OrcamentoCalculator();
    
    // Calcular orçamento com cronograma corrigido
    console.log('⚙️ Calculando orçamento...\n');
    const resultado = await calculator.calcularOrcamentoAvancado(dadosTesteProjeto);
    
    // Exibir resultados do cronograma
    console.log('📅 CRONOGRAMA CORRIGIDO:');
    console.log('=' .repeat(60));
    
    let prazoTotalVerificacao = 0;
    
    for (const [faseId, fase] of Object.entries(resultado.cronograma.fases)) {
      console.log(`${fase.ordem}. ${fase.nome}`);
      console.log(`   Etapa: ${fase.etapa}`);
      console.log(`   Prazo: ${fase.prazo} semanas`);
      console.log(`   Valor: ${fase.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
      console.log(`   Percentual: ${(fase.percentual * 100).toFixed(1)}%`);
      console.log('');
      
      prazoTotalVerificacao += fase.prazo;
    }
    
    console.log('=' .repeat(60));
    console.log(`🎯 PRAZO TOTAL: ${resultado.cronograma.prazoTotal} semanas`);
    console.log(`📊 VERIFICAÇÃO: ${prazoTotalVerificacao.toFixed(1)} semanas`);
    console.log(`💰 VALOR TOTAL: ${resultado.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    console.log(`💵 VALOR POR M²: ${resultado.valorPorM2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/m²\n`);
    
    // Análise do resultado
    console.log('🔍 ANÁLISE DO RESULTADO:');
    
    if (resultado.cronograma.prazoTotal <= 15) {
      console.log('✅ SUCESSO: Prazo realista para projeto residencial!');
      console.log(`   ${resultado.cronograma.prazoTotal} semanas está dentro da faixa esperada (8-12 semanas)`);
    } else if (resultado.cronograma.prazoTotal <= 25) {
      console.log('⚠️ ATENÇÃO: Prazo ainda um pouco alto, mas aceitável');
      console.log(`   ${resultado.cronograma.prazoTotal} semanas pode ser justificável para projetos mais complexos`);
    } else {
      console.log('❌ PROBLEMA: Prazo ainda muito alto!');
      console.log(`   ${resultado.cronograma.prazoTotal} semanas continua irreal para projeto residencial`);
    }
    
    // Comparação com valores de mercado
    console.log('\n💡 COMPARAÇÃO COM MERCADO:');
    console.log(`- Prazo calculado: ${resultado.cronograma.prazoTotal} semanas`);
    console.log(`- Prazo esperado: 8-12 semanas`);
    console.log(`- Valor por m²: ${resultado.valorPorM2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/m²`);
    console.log(`- Faixa mercado: R$ 180-250/m² (arquitetura completa)`);
    
    // Detalhamento por disciplina
    console.log('\n🔧 VALORES POR DISCIPLINA:');
    for (const [disciplina, valores] of Object.entries(resultado.valoresPorProfissional)) {
      console.log(`- ${disciplina}: ${valores.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${valores.valorPorM2Ajustado.toFixed(0)}/m²)`);
    }
    
    // Estatísticas do cronograma
    console.log('\n📈 ESTATÍSTICAS:');
    console.log(`- Total de fases: ${resultado.cronograma.estatisticas.totalFases}`);
    console.log(`- Total de entregáveis: ${resultado.cronograma.estatisticas.totalEntregaveis}`);
    console.log(`- Fases multidisciplinares: ${resultado.cronograma.estatisticas.fasesMultidisciplinares}`);
    console.log(`- Metodologia: ${resultado.cronograma.metodologia}`);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

// Executar teste
testarCronogramaCorrigido()
  .then((resultado) => {
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log(`Prazo final: ${resultado.cronograma.prazoTotal} semanas`);
    console.log(`Valor final: ${resultado.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    
    // Verificação final
    if (resultado.cronograma.prazoTotal <= 15) {
      console.log('✅ CORREÇÃO APLICADA COM SUCESSO - PRAZOS REALISTAS!');
    } else {
      console.log('⚠️ CORREÇÃO PARCIAL - PODE PRECISAR DE MAIS AJUSTES');
    }
    
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NO TESTE:', error.message);
    process.exit(1);
  });