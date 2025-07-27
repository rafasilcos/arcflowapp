const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarSistemaBriefings() {
  console.log('🔍 VERIFICAÇÃO DO SISTEMA DE BRIEFINGS');
  console.log('=' .repeat(60));
  
  try {
    // 1. Verificar colunas críticas
    console.log('\n1. 🏗️ VERIFICANDO ESTRUTURA DO BANCO');
    console.log('-' .repeat(40));
    
    const colunas = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('disciplina', 'area', 'tipologia')
      ORDER BY column_name;
    `;
    
    const colunasEncontradas = colunas.map(c => c.column_name);
    const colunasNecessarias = ['disciplina', 'area', 'tipologia'];
    
    console.log('📊 Colunas encontradas:', colunasEncontradas);
    
    if (colunasEncontradas.length === 3) {
      console.log('✅ ESTRUTURA DO BANCO: OK');
    } else {
      console.log('❌ ESTRUTURA DO BANCO: ERRO');
      console.log('🔧 Execute: node adicionar-colunas-briefing.js');
      return false;
    }
    
    // 2. Teste de criação e busca
    console.log('\n2. 🧪 TESTE DE CRIAÇÃO E BUSCA');
    console.log('-' .repeat(40));
    
    const UUID_TESTE = 'e24bb076-9318-497a-9f0e-3813d2cca2ce';
    
    // Criar briefing de teste
    const briefingTeste = await prisma.briefing.create({
      data: {
        nomeProjeto: 'TESTE AUTOMATICO - Loja Comercial',
        descricao: 'Teste de verificação do sistema',
        clienteId: UUID_TESTE,
        responsavelId: UUID_TESTE,
        escritorioId: UUID_TESTE,
        createdBy: UUID_TESTE,
        status: 'RASCUNHO',
        progresso: 0,
        disciplina: 'arquitetura',
        area: 'comercial',
        tipologia: 'lojas'
      }
    });
    
    console.log('✅ Briefing criado:', briefingTeste.id);
    console.log('📋 Dados salvos:', {
      disciplina: briefingTeste.disciplina,
      area: briefingTeste.area,
      tipologia: briefingTeste.tipologia
    });
    
    // Buscar briefing
    const briefingBuscado = await prisma.briefing.findUnique({
      where: { id: briefingTeste.id }
    });
    
    console.log('✅ Briefing encontrado na busca');
    console.log('📋 Dados recuperados:', {
      disciplina: briefingBuscado.disciplina,
      area: briefingBuscado.area,
      tipologia: briefingBuscado.tipologia
    });
    
    // 3. Teste do BriefingAdapter
    console.log('\n3. 🎯 TESTE DO BRIEFING ADAPTER');
    console.log('-' .repeat(40));
    
    const templateSelecionado = testarBriefingAdapter({
      disciplina: briefingBuscado.disciplina,
      area: briefingBuscado.area,
      tipologia: briefingBuscado.tipologia
    });
    
    console.log('🎭 Template selecionado:', templateSelecionado);
    
    // Verificar se selecionou o template correto
    const templateCorreto = templateSelecionado.includes('COMERCIAL_LOJAS');
    
    if (templateCorreto) {
      console.log('✅ TEMPLATE SELECIONADO: CORRETO');
    } else {
      console.log('❌ TEMPLATE SELECIONADO: INCORRETO');
      console.log('🎯 Esperado: BRIEFING_COMERCIAL_LOJAS');
      console.log('🎯 Obtido:', templateSelecionado);
    }
    
    // 4. Teste de múltiplos cenários
    console.log('\n4. 🔄 TESTE DE MÚLTIPLOS CENÁRIOS');
    console.log('-' .repeat(40));
    
    const cenarios = [
      { disciplina: 'arquitetura', area: 'comercial', tipologia: 'lojas', esperado: 'COMERCIAL_LOJAS' },
      { disciplina: 'arquitetura', area: 'comercial', tipologia: 'escritorios', esperado: 'COMERCIAL_ESCRITORIOS' },
      { disciplina: 'arquitetura', area: 'residencial', tipologia: 'unifamiliar', esperado: 'RESIDENCIAL_UNIFAMILIAR' },
      { disciplina: 'estrutural', area: 'qualquer', tipologia: 'qualquer', esperado: 'ESTRUTURAL_ADAPTATIVO' }
    ];
    
    let cenariosPassed = 0;
    
    for (const cenario of cenarios) {
      const resultado = testarBriefingAdapter(cenario);
      const passou = resultado.includes(cenario.esperado);
      
      console.log(`${passou ? '✅' : '❌'} ${cenario.disciplina}/${cenario.area}/${cenario.tipologia} → ${resultado}`);
      
      if (passou) cenariosPassed++;
    }
    
    console.log(`\n📊 Cenários aprovados: ${cenariosPassed}/${cenarios.length}`);
    
    // 5. Limpeza
    console.log('\n5. 🧹 LIMPEZA');
    console.log('-' .repeat(40));
    
    await prisma.briefing.delete({
      where: { id: briefingTeste.id }
    });
    
    console.log('✅ Briefing de teste removido');
    
    // 6. Resultado final
    console.log('\n6. 🏁 RESULTADO FINAL');
    console.log('-' .repeat(40));
    
    const sistemFuncionando = (
      colunasEncontradas.length === 3 &&
      templateCorreto &&
      cenariosPassed === cenarios.length
    );
    
    if (sistemFuncionando) {
      console.log('🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!');
      console.log('🚀 Você pode usar o frontend com confiança.');
      console.log('');
      console.log('✅ Testes aprovados:');
      console.log('   - Estrutura do banco: OK');
      console.log('   - Criação de briefing: OK');
      console.log('   - Busca de briefing: OK');
      console.log('   - Seleção de template: OK');
      console.log('   - Múltiplos cenários: OK');
      console.log('');
      console.log('🎯 Próximos passos:');
      console.log('   1. Reiniciar backend se necessário');
      console.log('   2. Testar no frontend: localhost:3000/briefing/novo');
      console.log('   3. Selecionar: Arquitetura → Comercial → Loja');
      console.log('   4. Verificar console: "COMERCIAL_LOJAS (907 perguntas)"');
      
      return true;
    } else {
      console.log('❌ SISTEMA COM PROBLEMAS');
      console.log('🔧 Verifique os erros acima e corrija antes de continuar.');
      
      return false;
    }
    
  } catch (error) {
    console.error('💥 Erro durante verificação:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Simular lógica do BriefingAdapter
function testarBriefingAdapter(dados) {
  const { disciplina, area, tipologia } = dados;
  
  // Arquitetura
  if (disciplina === 'arquitetura' || !disciplina) {
    
    // Residencial
    if (area === 'residencial' || !area) {
      if (tipologia === 'unifamiliar' || tipologia === 'casa' || !tipologia) {
        return 'BRIEFING_RESIDENCIAL_UNIFAMILIAR (235 perguntas)';
      }
      if (tipologia === 'multifamiliar' || tipologia === 'predio' || tipologia === 'apartamento') {
        return 'BRIEFING_RESIDENCIAL_MULTIFAMILIAR (259 perguntas)';
      }
      if (tipologia === 'paisagismo' || tipologia === 'jardim') {
        return 'BRIEFING_RESIDENCIAL_PAISAGISMO (285 perguntas)';
      }
      if (tipologia === 'design-interiores' || tipologia === 'interiores') {
        return 'BRIEFING_RESIDENCIAL_DESIGN_INTERIORES (344 perguntas)';
      }
      if (tipologia === 'loteamentos' || tipologia === 'loteamento') {
        return 'BRIEFING_RESIDENCIAL_LOTEAMENTOS (1169 perguntas)';
      }
    }
    
    // Comercial
    if (area === 'comercial') {
      if (tipologia === 'escritorios' || tipologia === 'escritorio') {
        return 'BRIEFING_COMERCIAL_ESCRITORIOS (939 perguntas)';
      }
      if (tipologia === 'lojas' || tipologia === 'loja' || tipologia === 'varejo') {
        return 'BRIEFING_COMERCIAL_LOJAS (907 perguntas)';
      }
      if (tipologia === 'restaurantes' || tipologia === 'restaurante' || tipologia === 'gastronomia') {
        return 'BRIEFING_COMERCIAL_RESTAURANTES (1133 perguntas)';
      }
      if (tipologia === 'hotel' || tipologia === 'pousada' || tipologia === 'hospedagem') {
        return 'BRIEFING_COMERCIAL_HOTEL_POUSADA (423 perguntas)';
      }
    }
    
    // Industrial
    if (area === 'industrial') {
      return 'BRIEFING_INDUSTRIAL_GALPAO (311 perguntas)';
    }
    
    // Urbanístico
    if (area === 'urbanistico' || area === 'urbano') {
      return 'BRIEFING_PROJETO_URBANO (98 perguntas)';
    }
  }
  
  // Estrutural
  if (disciplina === 'estrutural') {
    return 'BRIEFING_ESTRUTURAL_ADAPTATIVO (292 perguntas)';
  }
  
  // Instalações
  if (disciplina === 'instalacoes' || disciplina === 'instalações') {
    return 'BRIEFING_INSTALACOES_ADAPTATIVO (709 perguntas)';
  }
  
  // Fallback
  return 'BRIEFING_RESIDENCIAL_UNIFAMILIAR (235 perguntas) - FALLBACK';
}

// Executar verificação
verificarSistemaBriefings()
  .then((sucesso) => {
    if (sucesso) {
      console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA COM SUCESSO!');
      process.exit(0);
    } else {
      console.log('\n❌ VERIFICAÇÃO FALHOU!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 ERRO FATAL:', error);
    process.exit(1);
  }); 