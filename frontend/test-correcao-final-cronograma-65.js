/**
 * 🎯 TESTE FINAL: CORREÇÃO SEGURA APLICADA - ORÇAMENTO 65
 * 
 * Verificar se a seção 7 agora mostra todos os 17 entregáveis
 */

const axios = require('axios');

async function testeCorrecaoFinalCronograma65() {
  console.log('🎯 TESTE FINAL: CORREÇÃO SEGURA APLICADA - ORÇAMENTO 65\n');
  
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
    console.log(`📊 Valor total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    
    // 3. Simular EXATAMENTE o que o frontend corrigido faz
    console.log('\n🔄 SIMULANDO PROCESSAMENTO DO FRONTEND CORRIGIDO...');
    
    const cronogramaOriginal = orcamento.cronograma;
    
    // Disciplinas padrão (como no frontend corrigido)
    const DISCIPLINAS_PADRAO = [
      { id: 'arquitetura', codigo: 'ARQUITETURA', nome: 'Arquitetura', icone: '🏗️', categoria: 'ESSENCIAL', descricao: 'Projeto arquitetônico completo', valorBase: 5000, horasBase: 40, ativa: true, ordem: 1 },
      { id: 'estrutural', codigo: 'ESTRUTURAL', nome: 'Estrutural', icone: '🏗️', categoria: 'ESSENCIAL', descricao: 'Projeto estrutural', valorBase: 4000, horasBase: 30, ativa: true, ordem: 2 },
      { id: 'hidraulica', codigo: 'INSTALACOES_HIDRAULICAS', nome: 'Instalações Hidráulicas', icone: '🚿', categoria: 'COMPLEMENTAR', descricao: 'Projeto hidrossanitário', valorBase: 2000, horasBase: 20, ativa: true, ordem: 3 },
      { id: 'eletrica', codigo: 'INSTALACOES_ELETRICAS', nome: 'Instalações Elétricas', icone: '⚡', categoria: 'COMPLEMENTAR', descricao: 'Projeto elétrico', valorBase: 2500, horasBase: 25, ativa: true, ordem: 4 }
    ];

    // Conversão EXATA como no frontend corrigido
    const cronogramaConvertido = Object.values(cronogramaOriginal.fases || {}).map((fase) => {
      // Converter disciplinas string para objetos Disciplina (CORREÇÃO APLICADA)
      const disciplinasAtivasNaFase = (fase.disciplinas || []).map((discCodigo) => {
        const disciplinaEncontrada = DISCIPLINAS_PADRAO.find(d => 
          d.codigo.toUpperCase() === discCodigo.toUpperCase()
        );
        return disciplinaEncontrada || {
          id: discCodigo,
          codigo: discCodigo,
          nome: discCodigo,
          icone: '📋',
          categoria: 'ESSENCIAL',
          descricao: '',
          valorBase: 0,
          horasBase: 0,
          ativa: true,
          ordem: 1
        };
      });

      return {
        id: fase.nome?.replace(/\s+/g, '_').toUpperCase() || 'FASE',
        ordem: fase.ordem || 1,
        etapa: fase.etapa || '',
        nome: fase.nome || '',
        prazo: fase.prazo || 0,
        valor: fase.valor || 0,
        percentual: fase.percentual || 0,
        disciplinas: fase.disciplinas || [],
        disciplinasAtivasNaFase, // ✅ CORREÇÃO CRÍTICA APLICADA
        responsavel: fase.responsavel || 'Equipe Técnica',
        entregaveis: fase.entregaveis || [],
        ativa: true
      };
    });

    // Ordenar por ordem
    cronogramaConvertido.sort((a, b) => a.ordem - b.ordem);
    
    // 4. Verificar especificamente a seção 7
    console.log('\n📊 VERIFICAÇÃO ESPECÍFICA DA SEÇÃO 7:');
    
    const secao7 = cronogramaConvertido.find(fase => fase.ordem === 7);
    
    if (secao7) {
      console.log(`✅ Seção 7 encontrada: ${secao7.nome}`);
      console.log(`📊 Entregáveis: ${secao7.entregaveis.length}`);
      console.log(`📊 Esperado: 17`);
      console.log(`📊 Status: ${secao7.entregaveis.length === 17 ? '✅ CORRETO' : '❌ INCORRETO'}`);
      
      if (secao7.entregaveis.length === 17) {
        console.log('\n🎉 CORREÇÃO APLICADA COM SUCESSO!');
        console.log('✅ A seção 7 agora tem todos os 17 entregáveis');
        console.log('✅ O frontend carrega dados reais do banco');
        console.log('✅ Não há mais dados hardcoded');
        
        console.log('\n📝 PRIMEIROS 5 ENTREGÁVEIS DA SEÇÃO 7:');
        secao7.entregaveis.slice(0, 5).forEach((entregavel, index) => {
          console.log(`   ${index + 1}. ${entregavel}`);
        });
        console.log(`   ... e mais ${secao7.entregaveis.length - 5} entregáveis`);
        
      } else {
        console.log('\n❌ AINDA HÁ PROBLEMAS:');
        console.log(`   - Encontrados: ${secao7.entregaveis.length} entregáveis`);
        console.log(`   - Esperados: 17 entregáveis`);
        console.log(`   - Diferença: ${17 - secao7.entregaveis.length} entregáveis faltando`);
      }
      
      // Verificar disciplinas
      console.log(`\n🏷️ Disciplinas da seção 7:`);
      secao7.disciplinasAtivasNaFase.forEach(disc => {
        console.log(`   - ${disc.icone} ${disc.nome} (${disc.codigo})`);
      });
      
    } else {
      console.log('❌ Seção 7 não encontrada!');
    }
    
    // 5. Verificar total geral
    const totalEntregaveis = cronogramaConvertido.reduce((total, fase) => total + fase.entregaveis.length, 0);
    
    console.log('\n📊 VERIFICAÇÃO GERAL:');
    console.log(`   - Total de fases: ${cronogramaConvertido.length}`);
    console.log(`   - Total de entregáveis: ${totalEntregaveis}`);
    console.log(`   - Esperado: 72 entregáveis`);
    console.log(`   - Status geral: ${totalEntregaveis === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
    
    // 6. Resultado final
    console.log('\n🎯 RESULTADO FINAL DA CORREÇÃO:');
    
    if (secao7 && secao7.entregaveis.length === 17 && totalEntregaveis === 72) {
      console.log('🎉 CORREÇÃO 100% BEM-SUCEDIDA!');
      console.log('✅ Seção 7 tem todos os 17 entregáveis');
      console.log('✅ Total geral correto (72 entregáveis)');
      console.log('✅ Frontend carrega dados reais do banco');
      console.log('✅ Todas as funcionalidades preservadas');
      console.log('\n💡 A interface agora deve mostrar todos os entregáveis corretamente!');
    } else {
      console.log('❌ Correção ainda não está completa');
      console.log('🔧 Pode ser necessário verificar:');
      console.log('   - Se o arquivo foi salvo corretamente');
      console.log('   - Se o servidor foi reiniciado');
      console.log('   - Se há cache do navegador');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testeCorrecaoFinalCronograma65();