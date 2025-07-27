/**
 * TESTE DO SISTEMA COMPLETO DE BRIEFINGS
 */

console.log('🚀 INICIANDO TESTE DO SISTEMA COMPLETO');

const { SistemaPreenchimentoAutomaticoBriefings } = require('../../../sistema-preenchimento-automatico-briefings.js');

async function testar() {
  const sistema = new SistemaPreenchimentoAutomaticoBriefings();
  
  const dados = {
    email: 'admin@arcflow.com',
    senha: '123456',
    nomeProjeto: 'TESTE COMPLETO - Residência Automatizada',
    prazo: '8 meses',
    orcamento: 'R$ 750.000',
    clienteNome: 'Maria Silva Santos',
    descricao: 'Projeto residencial completo com briefing automatizado.',
    tipologia: 'residencial'
  };
  
  try {
    console.log('🎯 Iniciando sistema...');
    await sistema.inicializar();
    
    console.log('🔐 Fazendo login...');
    await sistema.fazerLogin(dados.email, dados.senha);
    
    console.log('📝 Preenchendo dados básicos...');
    await sistema.preencherDadosBasicos(dados);
    
    console.log('➡️ Avançando etapa...');
    const avancar = await sistema.avancarParaProximaEtapa();
    console.log(`Avanço: ${avancar}`);
    
    if (avancar) {
      console.log('🏠 Selecionando tipologia...');
      await sistema.selecionarTipologia(dados.tipologia);
      
      console.log('📋 Iniciando preenchimento completo...');
      await sistema.preencherBriefingCompleto();
    }
    
    console.log('🎉 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await sistema.finalizar();
  }
}

testar();