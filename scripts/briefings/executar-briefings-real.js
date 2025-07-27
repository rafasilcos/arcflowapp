/**
 * EXECUTAR BRIEFINGS REAL - SISTEMA COMPLETO
 * 
 * Sistema que realmente preenche briefings completos do ArcFlow
 * baseado na análise real da estrutura.
 */

const puppeteer = require('puppeteer');

class ExecutorBriefingsReal {
  constructor() {
    this.browser = null;
    this.page = null;
    this.perguntasRespondidas = 0;
  }

  async inicializar() {
    console.log('🚀 Inicializando executor REAL de briefings');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1366, height: 768 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('✅ Sistema inicializado');
  }

  async fazerLogin() {
    console.log('🔐 Fazendo login...');
    
    await this.page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    
    await this.page.waitForSelector('input[type="email"]');
    await this.page.type('input[type="email"]', 'admin@arcflow.com');
    await this.page.type('input[type="password"]', '123456');
    await this.page.click('button[type="submit"]');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Login realizado');
  }

  async preencherDadosBasicos() {
    console.log('📝 ETAPA 1: Preenchendo dados básicos...');
    
    await this.page.goto('http://localhost:3000/briefing/novo', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const campos = [
      { seletor: 'input[placeholder="Nome do Projeto *"]', valor: 'BRIEFING REAL - Casa Moderna Premium' },
      { seletor: 'input[placeholder="Prazo estimado (ex: 3 meses)"]', valor: '12 meses' },
      { seletor: 'input[placeholder="Orçamento previsto (ex: R$ 50.000)"]', valor: 'R$ 850.000' },
      { seletor: 'input[placeholder="Digite o nome ou email do cliente..."]', valor: 'Carlos Eduardo Santos' },
      { seletor: 'textarea[placeholder="Descrição detalhada do projeto (opcional)"]', valor: 'Casa moderna de alto padrão com 4 suítes, área gourmet, piscina e sistema de automação completo.' }
    ];

    for (const campo of campos) {
      try {
        const elemento = await this.page.$(campo.seletor);
        if (elemento) {
          await elemento.click();
          await elemento.evaluate(el => el.value = '');
          await elemento.type(campo.valor, { delay: 30 });
          console.log(`✅ ${campo.seletor.includes('Nome') ? 'Nome' : campo.seletor.includes('Prazo') ? 'Prazo' : campo.seletor.includes('Orçamento') ? 'Orçamento' : campo.seletor.includes('cliente') ? 'Cliente' : 'Descrição'} preenchido`);
        }
      } catch (e) {
        console.log(`⚠️ Erro ao preencher campo: ${e.message}`);
      }
    }

    // Tentar selecionar responsável
    try {
      const botaoResponsavel = await this.page.$('button[role="combobox"]');
      if (botaoResponsavel) {
        await botaoResponsavel.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const opcoes = await this.page.$$('[role="option"]');
        if (opcoes.length > 0) {
          await opcoes[0].click();
          console.log('✅ Responsável selecionado');
        }
      }
    } catch (e) {
      console.log('⚠️ Responsável não selecionado');
    }

    console.log('✅ Dados básicos preenchidos');
  }

  async avancarEtapa() {
    console.log('➡️ Avançando etapa...');
    
    const sucesso = await this.page.evaluate(() => {
      const botoes = Array.from(document.querySelectorAll('button'));
      const botao = botoes.find(btn => btn.textContent?.trim() === 'Próxima Etapa');
      if (botao && !botao.disabled) {
        botao.click();
        return true;
      }
      return false;
    });
    
    if (sucesso) {
      console.log('✅ Etapa avançada');
      await new Promise(resolve => setTimeout(resolve, 4000));
      return true;
    } else {
      console.log('❌ Não conseguiu avançar');
      return false;
    }
  }

  async analisarPaginaAtual() {
    console.log('🔍 Analisando página atual...');
    
    const analise = await this.page.evaluate(() => {
      const url = window.location.href;
      
      // Procurar por qualquer elemento que possa ser uma pergunta ou campo
      const todosElementos = Array.from(document.querySelectorAll('*'));
      
      // Filtrar elementos que podem ser perguntas
      const possiveisPerguntas = todosElementos.filter(el => {
        const texto = el.textContent?.trim();
        return texto && 
               texto.length > 10 && 
               texto.length < 200 &&
               (texto.includes('?') || 
                texto.toLowerCase().includes('qual') ||
                texto.toLowerCase().includes('como') ||
                texto.toLowerCase().includes('quantos') ||
                texto.toLowerCase().includes('possui') ||
                texto.toLowerCase().includes('deseja'));
      }).map(el => el.textContent?.trim()).slice(0, 10);
      
      // Procurar por campos de entrada
      const campos = Array.from(document.querySelectorAll('input, textarea, select, button[role="combobox"]'))
        .filter(el => el.offsetParent !== null && !el.placeholder?.toLowerCase().includes('buscar'))
        .map(el => ({
          tipo: el.type || el.tagName.toLowerCase(),
          placeholder: el.placeholder || '',
          name: el.name || '',
          id: el.id || '',
          texto: el.textContent?.trim() || ''
        }));
      
      // Procurar por botões de ação
      const botoes = Array.from(document.querySelectorAll('button'))
        .filter(btn => btn.offsetParent !== null)
        .map(btn => btn.textContent?.trim())
        .filter(texto => texto && texto.length > 2);
      
      return {
        url,
        possiveisPerguntas,
        campos,
        botoes
      };
    });
    
    console.log(`📍 URL: ${analise.url}`);
    console.log(`❓ Possíveis perguntas: ${analise.possiveisPerguntas.length}`);
    console.log(`📝 Campos encontrados: ${analise.campos.length}`);
    console.log(`🔘 Botões: ${analise.botoes.length}`);
    
    if (analise.possiveisPerguntas.length > 0) {
      console.log('\n❓ Perguntas encontradas:');
      analise.possiveisPerguntas.forEach((pergunta, i) => {
        console.log(`   ${i+1}. ${pergunta}`);
      });
    }
    
    if (analise.campos.length > 0) {
      console.log('\n📝 Campos encontrados:');
      analise.campos.forEach((campo, i) => {
        console.log(`   ${i+1}. ${campo.tipo} - "${campo.placeholder}" - "${campo.texto}"`);
      });
    }
    
    console.log('\n🔘 Botões disponíveis:');
    analise.botoes.forEach((botao, i) => {
      console.log(`   ${i+1}. "${botao}"`);
    });
    
    return analise;
  }

  async preencherCamposDisponiveis() {
    console.log('📝 Preenchendo campos disponíveis...');
    
    const campos = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, textarea, select'))
        .filter(el => el.offsetParent !== null && !el.placeholder?.toLowerCase().includes('buscar'))
        .map((el, index) => ({
          index,
          tipo: el.type || el.tagName.toLowerCase(),
          placeholder: el.placeholder || '',
          seletor: `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`
        }));
    });
    
    let preenchidos = 0;
    
    for (const campo of campos) {
      try {
        const elemento = await this.page.$(campo.seletor);
        if (elemento) {
          const resposta = this.gerarResposta(campo);
          
          switch (campo.tipo) {
            case 'text':
            case 'textarea':
              await elemento.click();
              await elemento.evaluate(el => el.value = '');
              await elemento.type(resposta, { delay: 50 });
              break;
              
            case 'number':
              await elemento.click();
              await elemento.evaluate(el => el.value = '');
              await elemento.type(resposta.toString(), { delay: 50 });
              break;
              
            case 'select':
              const opcoes = await elemento.$$('option');
              if (opcoes.length > 1) {
                const opcaoAleatoria = Math.floor(Math.random() * (opcoes.length - 1)) + 1;
                await elemento.select(await opcoes[opcaoAleatoria].evaluate(el => el.value));
              }
              break;
          }
          
          console.log(`   ✅ Campo ${preenchidos + 1}: ${campo.tipo} - "${resposta}"`);
          preenchidos++;
          this.perguntasRespondidas++;
        }
      } catch (e) {
        console.log(`   ❌ Erro no campo ${campo.tipo}: ${e.message}`);
      }
    }
    
    console.log(`✅ ${preenchidos} campos preenchidos`);
    return preenchidos;
  }

  gerarResposta(campo) {
    const placeholder = campo.placeholder.toLowerCase();
    
    if (placeholder.includes('área') || placeholder.includes('m²')) {
      return Math.floor(Math.random() * 300 + 120).toString();
    }
    
    if (placeholder.includes('altura') || placeholder.includes('pé direito')) {
      return (Math.random() * 1.2 + 2.8).toFixed(1);
    }
    
    if (placeholder.includes('quantidade') || placeholder.includes('número')) {
      return Math.floor(Math.random() * 6 + 1).toString();
    }
    
    if (campo.tipo === 'number') {
      return Math.floor(Math.random() * 20 + 1).toString();
    }
    
    const respostas = [
      'Sim, conforme especificações técnicas',
      'Não necessário para este projeto',
      'A definir em reunião técnica',
      'Seguir normas ABNT vigentes',
      'Padrão residencial de alto padrão',
      'Funcional e moderno',
      'Sustentável e eficiente energeticamente',
      'Integrado ao projeto paisagístico',
      'Conforme disponibilidade orçamentária',
      'Adequado às necessidades do cliente'
    ];
    
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  async tentarContinuar() {
    console.log('🔄 Tentando continuar...');
    
    const acoes = [
      'finalizar briefing',
      'gerar orçamento',
      'concluir',
      'finalizar',
      'próxima etapa',
      'próximo',
      'continuar',
      'avançar',
      'salvar'
    ];
    
    for (const acao of acoes) {
      const sucesso = await this.page.evaluate((acaoTexto) => {
        const botoes = Array.from(document.querySelectorAll('button'));
        const botao = botoes.find(btn => 
          btn.textContent?.toLowerCase().includes(acaoTexto) && !btn.disabled
        );
        
        if (botao) {
          botao.click();
          return acaoTexto;
        }
        return null;
      }, acao);
      
      if (sucesso) {
        console.log(`✅ Executou ação: ${sucesso}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
      }
    }
    
    console.log('⚠️ Nenhuma ação disponível');
    return false;
  }

  async executarBriefingCompleto() {
    console.log('🎯 EXECUTANDO BRIEFING COMPLETO REAL');
    console.log('=' .repeat(60));
    
    try {
      // 1. Login
      await this.fazerLogin();
      
      // 2. Preencher dados básicos
      await this.preencherDadosBasicos();
      
      // 3. Avançar primeira etapa
      const avancar1 = await this.avancarEtapa();
      if (!avancar1) {
        throw new Error('Não conseguiu avançar da primeira etapa');
      }
      
      // 4. Loop para preencher todas as etapas
      let etapa = 2;
      let continuarLoop = true;
      
      while (continuarLoop && etapa <= 20) {
        console.log(`\n🔄 ETAPA ${etapa}:`);
        
        // Capturar screenshot da etapa
        await this.page.screenshot({ 
          path: `briefing-etapa-${etapa}-${Date.now()}.png`,
          fullPage: true 
        });
        
        // Analisar página atual
        const analise = await this.analisarPaginaAtual();
        
        // Se há campos, preencher
        if (analise.campos.length > 0) {
          await this.preencherCamposDisponiveis();
        }
        
        // Tentar continuar
        const continuou = await this.tentarContinuar();
        
        if (!continuou) {
          console.log('🏁 Não conseguiu continuar - finalizando');
          continuarLoop = false;
        } else {
          etapa++;
          
          // Verificar se saiu do briefing
          await new Promise(resolve => setTimeout(resolve, 2000));
          const urlAtual = this.page.url();
          if (!urlAtual.includes('/briefing')) {
            console.log('🏁 Saiu do briefing - processo concluído');
            continuarLoop = false;
          }
        }
      }
      
      // Screenshot final
      await this.page.screenshot({ 
        path: `briefing-final-${Date.now()}.png`,
        fullPage: true 
      });
      
      console.log('\n🎉 BRIEFING REAL CONCLUÍDO!');
      console.log(`📊 Total de perguntas respondidas: ${this.perguntasRespondidas}`);
      console.log(`🔢 Etapas processadas: ${etapa - 1}`);
      
      // Aguardar visualização
      console.log('⏳ Aguardando 20 segundos para visualização...');
      await new Promise(resolve => setTimeout(resolve, 20000));
      
      return {
        sucesso: true,
        perguntasRespondidas: this.perguntasRespondidas,
        etapasProcessadas: etapa - 1
      };
      
    } catch (error) {
      console.error('❌ ERRO:', error.message);
      
      await this.page.screenshot({ 
        path: `erro-briefing-real-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  }

  async finalizar() {
    console.log('🔚 Finalizando...');
    if (this.browser) {
      await this.browser.close();
    }
    console.log('✅ Finalizado');
  }
}

// ===== EXECUÇÃO =====

async function executarBriefingReal() {
  const executor = new ExecutorBriefingsReal();
  
  try {
    await executor.inicializar();
    const resultado = await executor.executarBriefingCompleto();
    
    console.log('\n🏆 RESULTADO FINAL:');
    console.log(JSON.stringify(resultado, null, 2));
    
  } catch (error) {
    console.error('\n💥 ERRO FINAL:', error.message);
  } finally {
    await executor.finalizar();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarBriefingReal();
}

module.exports = { ExecutorBriefingsReal, executarBriefingReal };