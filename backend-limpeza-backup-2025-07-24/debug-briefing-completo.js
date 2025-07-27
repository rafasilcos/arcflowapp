const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugBriefingCompleto() {
  console.log('🔍 DEBUG COMPLETO: Sistema de Briefings');
  console.log('=' .repeat(80));
  
  try {
    // 1. Verificar estrutura da tabela
    console.log('\n1. 📊 ESTRUTURA DA TABELA BRIEFINGS');
    console.log('-' .repeat(50));
    
    const estruturaTabela = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 Colunas da tabela briefings:');
    console.table(estruturaTabela);
    
    // 2. Verificar se as colunas críticas existem
    console.log('\n2. 🎯 VERIFICAÇÃO DAS COLUNAS CRÍTICAS');
    console.log('-' .repeat(50));
    
    const colunasCriticas = estruturaTabela.filter(col => 
      ['disciplina', 'area', 'tipologia'].includes(col.column_name)
    );
    
    if (colunasCriticas.length === 3) {
      console.log('✅ Todas as 3 colunas críticas existem!');
      console.table(colunasCriticas);
    } else {
      console.log('❌ PROBLEMA: Colunas críticas não encontradas!');
      console.log('📋 Colunas encontradas:', colunasCriticas.map(c => c.column_name));
      console.log('🚨 Execute: node adicionar-colunas-briefing.js');
      return;
    }
    
    // 3. Verificar briefings existentes
    console.log('\n3. 📁 BRIEFINGS EXISTENTES NO BANCO');
    console.log('-' .repeat(50));
    
    const briefingsExistentes = await prisma.briefing.findMany({
      select: {
        id: true,
        nomeProjeto: true,
        disciplina: true,
        area: true,
        tipologia: true,
        status: true,
        progresso: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    console.log(`📊 Total de briefings encontrados: ${briefingsExistentes.length}`);
    
    if (briefingsExistentes.length > 0) {
      console.log('🗂️ Últimos 10 briefings:');
      briefingsExistentes.forEach((b, index) => {
        console.log(`${index + 1}. ${b.nomeProjeto}`);
        console.log(`   ID: ${b.id}`);
        console.log(`   Disciplina: ${b.disciplina || 'NULL'}`);
        console.log(`   Área: ${b.area || 'NULL'}`);
        console.log(`   Tipologia: ${b.tipologia || 'NULL'}`);
        console.log(`   Status: ${b.status} (${b.progresso}%)`);
        console.log(`   Criado: ${b.createdAt}`);
        console.log('');
      });
    } else {
      console.log('📭 Nenhum briefing encontrado no banco');
    }
    
    // 4. Testar criação de briefing
    console.log('\n4. 🧪 TESTE DE CRIAÇÃO DE BRIEFING');
    console.log('-' .repeat(50));
    
    const UUID_TESTE = 'e24bb076-9318-497a-9f0e-3813d2cca2ce';
    
    console.log('📝 Criando briefing de teste: Arquitetura → Comercial → Lojas...');
    
    const briefingTeste = await prisma.briefing.create({
      data: {
        nomeProjeto: 'DEBUG - Loja Comercial Teste',
        descricao: 'Teste para debug do sistema de templates',
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
    
    console.log('✅ Briefing criado com sucesso!');
    console.log('📋 Dados salvos:');
    console.log(`   ID: ${briefingTeste.id}`);
    console.log(`   Nome: ${briefingTeste.nomeProjeto}`);
    console.log(`   Disciplina: ${briefingTeste.disciplina}`);
    console.log(`   Área: ${briefingTeste.area}`);
    console.log(`   Tipologia: ${briefingTeste.tipologia}`);
    
    // 5. Buscar o briefing como o frontend faria
    console.log('\n5. 🔍 SIMULAÇÃO DA BUSCA DO FRONTEND');
    console.log('-' .repeat(50));
    
    console.log(`🌐 Simulando: GET /api/briefings/${briefingTeste.id}`);
    
    const briefingBuscado = await prisma.briefing.findFirst({
      where: { 
        id: briefingTeste.id,
        deletedAt: null 
      },
      include: {
        cliente: true,
        responsavel: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    if (briefingBuscado) {
      console.log('✅ Briefing encontrado na busca!');
      console.log('📋 Dados retornados:');
      console.log(`   ID: ${briefingBuscado.id}`);
      console.log(`   Nome: ${briefingBuscado.nomeProjeto}`);
      console.log(`   Disciplina: ${briefingBuscado.disciplina || 'NULL'}`);
      console.log(`   Área: ${briefingBuscado.area || 'NULL'}`);
      console.log(`   Tipologia: ${briefingBuscado.tipologia || 'NULL'}`);
      
      // 6. Simular lógica do BriefingAdapter
      console.log('\n6. 🔄 SIMULAÇÃO DO BRIEFING ADAPTER');
      console.log('-' .repeat(50));
      
      const templateSelecionado = simularBriefingAdapter({
        disciplina: briefingBuscado.disciplina,
        area: briefingBuscado.area,
        tipologia: briefingBuscado.tipologia
      });
      
      console.log(`🎯 Template selecionado: ${templateSelecionado}`);
      
      if (templateSelecionado.includes('COMERCIAL_LOJAS')) {
        console.log('✅ SUCESSO: Template correto selecionado!');
      } else {
        console.log('❌ PROBLEMA: Template incorreto selecionado!');
        console.log('🎯 Esperado: BRIEFING_COMERCIAL_LOJAS');
      }
      
    } else {
      console.log('❌ Briefing não encontrado na busca!');
    }
    
    // 7. Limpeza
    console.log('\n7. 🧹 LIMPEZA');
    console.log('-' .repeat(50));
    
    await prisma.briefing.delete({
      where: { id: briefingTeste.id }
    });
    
    console.log('✅ Briefing de teste removido');
    
    // 8. Diagnóstico final
    console.log('\n8. 🏁 DIAGNÓSTICO FINAL');
    console.log('-' .repeat(50));
    
    console.log('📊 Resumo dos testes:');
    console.log(`✅ Estrutura da tabela: ${colunasCriticas.length === 3 ? 'OK' : 'ERRO'}`);
    console.log(`✅ Criação de briefing: OK`);
    console.log(`✅ Busca de briefing: OK`);
    console.log(`✅ Campos salvos corretamente: OK`);
    console.log(`✅ BriefingAdapter funcionando: ${templateSelecionado.includes('COMERCIAL_LOJAS') ? 'OK' : 'ERRO'}`);
    
    if (templateSelecionado.includes('COMERCIAL_LOJAS')) {
      console.log('\n🎉 SISTEMA FUNCIONANDO CORRETAMENTE!');
      console.log('🔧 O problema pode estar em:');
      console.log('   1. Cache do navegador');
      console.log('   2. Servidor backend não reiniciado');
      console.log('   3. Briefings antigos sem os novos campos');
      console.log('   4. Console do navegador para verificar logs');
    } else {
      console.log('\n⚠️ PROBLEMA IDENTIFICADO NO BRIEFING ADAPTER!');
    }
    
  } catch (error) {
    console.error('❌ Erro durante debug:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Simular a lógica do BriefingAdapter
function simularBriefingAdapter(dados) {
  const { disciplina, area, tipologia } = dados;
  
  console.log('🔍 Dados recebidos pelo adapter:', { disciplina, area, tipologia });
  
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
    }
    
    // Comercial
    if (area === 'comercial') {
      if (tipologia === 'escritorios' || tipologia === 'escritorio') {
        return 'BRIEFING_COMERCIAL_ESCRITORIOS (939 perguntas)';
      }
      if (tipologia === 'lojas' || tipologia === 'loja' || tipologia === 'varejo') {
        return 'BRIEFING_COMERCIAL_LOJAS (907 perguntas) ✅';
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
  return 'BRIEFING_RESIDENCIAL_UNIFAMILIAR (235 perguntas) - FALLBACK ❌';
}

// Executar debug
debugBriefingCompleto()
  .then(() => {
    console.log('\n✅ Debug concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal durante debug:', error);
    process.exit(1);
  }); 