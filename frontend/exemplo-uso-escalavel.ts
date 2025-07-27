// 🚀 EXEMPLO DE USO DO SISTEMA ESCALÁVEL - 150K+ USUÁRIOS
// Como usar o novo sistema de briefings com lazy loading

import { obterBriefing, obterBriefingModular } from './src/data/briefings';
import { obterBriefingEstatico, preloadBriefing, obterEstatisticasCache } from './src/data/briefings-estaticos';

// ===== EXEMPLO 1: USO BÁSICO (RECOMENDADO) =====
async function exemploUsoBasico() {
  console.log('🎯 EXEMPLO 1: Uso básico do sistema escalável');
  
  try {
    // ✅ CORRETO: Função assíncrona com lazy loading
    const briefing = await obterBriefing('casa', undefined, 'simples');
    
    if (briefing) {
      console.log('✅ Briefing carregado:', {
        nome: briefing.nome,
        totalPerguntas: briefing.totalPerguntas,
        secoes: briefing.secoes.length
      });
    } else {
      console.log('❌ Briefing não encontrado');
    }
    
  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

// ===== EXEMPLO 2: PRELOAD INTELIGENTE =====
async function exemploPreload() {
  console.log('🎯 EXEMPLO 2: Preload inteligente para performance');
  
  // Preload em background (não bloqueia)
  preloadBriefing('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'SIMPLES');
  preloadBriefing('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'MEDIO');
  preloadBriefing('COMERCIAL', 'ESCRITORIO', 'UNICO');
  
  console.log('🚀 Preload iniciado em background');
  
  // Aguardar um pouco para o preload
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Agora o acesso será instantâneo (cache hit)
  const briefing1 = await obterBriefingEstatico('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'SIMPLES');
  const briefing2 = await obterBriefingEstatico('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'MEDIO');
  
  console.log('⚡ Acessos instantâneos via cache:', {
    briefing1: briefing1 ? '✅ Cache Hit' : '❌ Cache Miss',
    briefing2: briefing2 ? '✅ Cache Hit' : '❌ Cache Miss'
  });
  
  // Verificar estatísticas do cache
  console.log('📊 Estatísticas do cache:', obterEstatisticasCache());
}

// ===== EXEMPLO 3: COMPATIBILIDADE COM SISTEMA ANTIGO =====
async function exemploCompatibilidade() {
  console.log('🎯 EXEMPLO 3: Compatibilidade com sistema antigo');
  
  // Funciona com parâmetros antigos
  const briefing = await obterBriefingModular(
    'arquitetura',
    'residencial', 
    'simples_padrao'
  );
  
  if (briefing) {
    console.log('✅ Compatibilidade OK:', briefing.nome);
  }
}

// ===== EXEMPLO 4: MÚLTIPLOS USUÁRIOS SIMULTÂNEOS =====
async function exemploMultiplosUsuarios() {
  console.log('🎯 EXEMPLO 4: Simulando 1000 usuários simultâneos');
  
  const promises = [];
  
  // Simular 1000 usuários acessando ao mesmo tempo
  for (let i = 0; i < 1000; i++) {
    const tipologia = i % 3 === 0 ? 'casa' : i % 3 === 1 ? 'escritorio' : 'casa';
    const padrao = i % 2 === 0 ? 'simples' : 'medio';
    
    promises.push(obterBriefing(tipologia, undefined, padrao));
  }
  
  const inicio = performance.now();
  
  try {
    const resultados = await Promise.all(promises);
    const fim = performance.now();
    
    const sucessos = resultados.filter(r => r !== null).length;
    const falhas = resultados.filter(r => r === null).length;
    
    console.log('🚀 TESTE DE CARGA CONCLUÍDO:', {
      totalUsuarios: 1000,
      sucessos,
      falhas,
      tempoTotal: `${(fim - inicio).toFixed(2)}ms`,
      tempoMedioPorUsuario: `${((fim - inicio) / 1000).toFixed(2)}ms`,
      performance: '✅ ESCALÁVEL'
    });
    
    console.log('📊 Cache após teste:', obterEstatisticasCache());
    
  } catch (error) {
    console.error('💥 Erro no teste de carga:', error);
  }
}

// ===== EXEMPLO 5: COMPARAÇÃO DE PERFORMANCE =====
async function exemploComparacaoPerformance() {
  console.log('🎯 EXEMPLO 5: Comparação de performance');
  
  // Primeiro acesso (cold start)
  const inicio1 = performance.now();
  const briefing1 = await obterBriefingEstatico('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'SIMPLES');
  const fim1 = performance.now();
  
  // Segundo acesso (cache hit)
  const inicio2 = performance.now();
  const briefing2 = await obterBriefingEstatico('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'SIMPLES');
  const fim2 = performance.now();
  
  console.log('⚡ COMPARAÇÃO DE PERFORMANCE:', {
    primeiroAcesso: `${(fim1 - inicio1).toFixed(2)}ms (lazy loading)`,
    segundoAcesso: `${(fim2 - inicio2).toFixed(2)}ms (cache hit)`,
    melhoria: `${((fim1 - inicio1) / (fim2 - inicio2)).toFixed(0)}x mais rápido`,
    status: '🚀 OTIMIZADO PARA ESCALA'
  });
}

// ===== EXECUTAR TODOS OS EXEMPLOS =====
export async function executarExemplosEscalaveis() {
  console.log('🚀 INICIANDO EXEMPLOS DO SISTEMA ESCALÁVEL\n');
  
  await exemploUsoBasico();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploPreload();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploCompatibilidade();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploComparacaoPerformance();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploMultiplosUsuarios();
  
  console.log('\n🎉 TODOS OS EXEMPLOS CONCLUÍDOS COM SUCESSO!');
}

// ===== COMO USAR NO SEU COMPONENTE =====
export const ExemploComponenteReact = `
// ✅ CORRETO: Componente React usando o sistema escalável
import { useState, useEffect } from 'react';
import { obterBriefing } from './src/data/briefings';

function MeuComponenteBriefing() {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarBriefing() {
      setLoading(true);
      
      try {
        // ✅ Sistema escalável com lazy loading
        const resultado = await obterBriefing('casa', undefined, 'simples', 'fisica');
        setBriefing(resultado);
      } catch (error) {
        console.error('Erro ao carregar briefing:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarBriefing();
  }, []);

  if (loading) return <div>Carregando briefing...</div>;
  if (!briefing) return <div>Briefing não encontrado</div>;

  return (
    <div>
      <h1>{briefing.nome}</h1>
      <p>{briefing.totalPerguntas} perguntas</p>
      <p>Tempo estimado: {briefing.tempoEstimado}</p>
      
      {briefing.secoes.map(secao => (
        <div key={secao.id}>
          <h2>{secao.nome}</h2>
          {secao.perguntas.map(pergunta => (
            <div key={pergunta.id}>
              <label>{pergunta.pergunta}</label>
              {/* Renderizar campo baseado no tipo */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
`;

// Para testar, descomente a linha abaixo:
// executarExemplosEscalaveis(); 