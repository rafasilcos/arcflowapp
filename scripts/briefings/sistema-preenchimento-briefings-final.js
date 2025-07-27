/**
 * SISTEMA FINAL DE PREENCHIMENTO AUTOMÁTICO DE BRIEFINGS - ARCFLOW
 * 
 * Sistema corrigido que preenche automaticamente todas as 235 perguntas
 * nas 15 seções do briefing residencial unifamiliar.
 * 
 * Versão: FINAL - Corrigida
 * Data: 24/07/2025
 */

const puppeteer = require('puppeteer');

class SistemaPreenchimentoBriefings {
  constructor() {
    this.browser = null;
    this.page = null;
    this.perguntasRespondidas = 0;
    this.secaoAtual = 1;
    this.totalSecoes = 15;
  }

  async inicializar() {
    console.log('🚀 SISTEMA FINAL DE PREENCHIMENTO AUTOMÁTICO DE BRIEFINGS');
    console.log('📋 Especializado em preencher as 235 perguntas automaticamente');
    console.log('=' .repeat(70));
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1366, height: 768 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('✅ Sistema inicializado');
    console.log('⏳ Aguardando você chegar na página das perguntas...');
  }

  async aguardarPaginaPerguntas() {
    console.log('🔍 Detectando página de perguntas do briefing...');
    
    let tentativas = 0;
    const maxTentativas = 60;
    
    while (tentativas < maxTentativas) {
      try {
        const url = this.page.url();
        console.log(`📍 URL atual: ${url}`);
        
        const temPerguntas = await this.page.evaluate(() => {
          const inputs = document.querySelectorAll('input, textarea, select');
          const perguntas = Array.from(inputs).filter(el => 
            el.offsetParent !== null &&
            !el.placeholder?.toLowerCase().includes('buscar')
          );
          return perguntas.length > 5;
        });
        
        if (temPerguntas) {
          console.log('✅ Página de perguntas detectada!');
          return true;
        }
        
        console.log(`⏳ Aguardando... (tentativa ${tentativas + 1}/${maxTentativas})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        tentativas++;
        
      } catch (error) {
        console.log(`⚠️ Erro ao verificar página: ${error.message}`);
        tentativas++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    throw new Error('Timeout: Página de perguntas não detectada em 5 minutos');
  }

  async analisarSecaoAtual() {
    console.log(`\n🔍 ANALISANDO SEÇÃO ${this.secaoAtual}/${this.totalSecoes}`);
    
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analise = await this.page.evaluate(() => {
      const titulos = Array.from(document.querySelectorAll('h1, h2, h3, h4, .title, [class*="title"]'))
        .filter(el => el.offsetParent !== null)
        .map(el => el.textContent?.trim())
        .filter(texto => texto && texto.length > 5);
      
      const todosCampos = [];
      
      // Buscar todos os inputs
      const inputs = Array.from(document.querySelectorAll('input'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' &&
                 el.type !== 'hidden' &&
                 !el.placeholder?.toLowerCase().includes('buscar');
        });
      
      inputs.forEach((el, index) => {
        todosCampos.push({
          elemento: 'input',
          index,
          tipo: el.type || 'text',
          placeholder: el.placeholder || '',
          name: el.name || '',
          id: el.id || '',
          value: el.value || '',
          required: el.required || false,
          className: el.className || '',
          seletor: el.id ? `#${el.id}` : el.name ? `input[name="${el.name}"]` : `input:nth-of-type(${index + 1})`
        });
      });
      
      // Buscar textareas
      const textareas = Array.from(document.querySelectorAll('textarea'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
      
      textareas.forEach((el, index) => {
        todosCampos.push({
          elemento: 'textarea',
          index,
          tipo: 'textarea',
          placeholder: el.placeholder || '',
          name: el.name || '',
          id: el.id || '',
          value: el.value || '',
          className: el.className || '',
          seletor: el.id ? `#${el.id}` : el.name ? `textarea[name="${el.name}"]` : `textarea:nth-of-type(${index + 1})`
        });
      });
      
      // Buscar selects
      const selects = Array.from(document.querySelectorAll('select'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
      
      selects.forEach((el, index) => {
        todosCampos.push({
          elemento: 'select',
          index,
          tipo: 'select',
          name: el.name || '',
          id: el.id || '',
          className: el.className || '',
          opcoes: Array.from(el.options).map(opt => ({ value: opt.value, text: opt.text })),
          seletor: el.id ? `#${el.id}` : el.name ? `select[name="${el.name}"]` : `select:nth-of-type(${index + 1})`
        });
      });
      
      return {
        url: window.location.href,
        titulos: titulos.slice(0, 5),
        todosCampos: todosCampos,
        totalElementosInterativos: document.querySelectorAll('input, textarea, select, button').length
      };
    });
    
    console.log(`📍 URL: ${analise.url}`);
    console.log(`📝 TOTAL de campos encontrados: ${analise.todosCampos.length}`);
    console.log(`⚡ Elementos interativos: ${analise.totalElementosInterativos}`);
    
    return analise;
  }

  ehValorOrientacao(campo) {
    const valor = campo.value?.trim() || '';
    const valorLower = valor.toLowerCase();
    
    if (!valor) return false;
    
    const valoresOrientacao = [
      'r$ 500.000', 'r$ 500000', 'r$500.000', 'r$500000',
      'digite aqui', 'digite o valor', 'insira o valor',
      'selecione', 'escolha uma opção', 'clique aqui',
      'exemplo:', 'ex:', 'placeholder', 'orientação',
      'seguir normas técnicas nbr', 'valor de exemplo'
    ];
    
    for (const orientacao of valoresOrientacao) {
      if (valorLower.includes(orientacao)) {
        return true;
      }
    }
    
    if (valorLower.match(/^r\$\s*[\d.,]+$/)) {
      return true;
    }
    
    if (valor.length <= 2) {
      return true;
    }
    
    return false;
  }

  extrairNumeroPergunta(campo) {
    const textos = [campo.name, campo.id, campo.seletor, campo.placeholder].filter(Boolean);
    
    for (const texto of textos) {
      const matches = texto.match(/(?:pergunta|question|p)[-_]?(\d+)/i);
      if (matches) {
        return parseInt(matches[1]);
      }
      
      const numeroMatch = texto.match(/(\d+)/);
      if (numeroMatch) {
        return parseInt(numeroMatch[1]);
      }
    }
    
    return 999;
  }

  gerarResposta(campo) {
    const placeholder = (campo.placeholder || campo.name || '').toLowerCase();
    const tipo = campo.tipo;
    
    if (placeholder.includes('área') || placeholder.includes('m²')) {
      return Math.floor(Math.random() * 300 + 80).toString();
    }
    
    if (placeholder.includes('altura') || placeholder.includes('pé direito')) {
      return (Math.random() * 1.5 + 2.7).toFixed(1);
    }
    
    if (placeholder.includes('quantidade') || placeholder.includes('número')) {
      return Math.floor(Math.random() * 8 + 1).toString();
    }
    
    if (placeholder.includes('orçamento') || placeholder.includes('valor')) {
      return `R$ ${(Math.random() * 200000 + 50000).toFixed(0)}`;
    }
    
    if (tipo === 'number') {
      return Math.floor(Math.random() * 50 + 1).toString();
    }
    
    if (tipo === 'email') {
      return 'cliente@email.com';
    }
    
    if (tipo === 'tel') {
      return '(11) 99999-9999';
    }
    
    const respostas = [
      'Sim, conforme necessidades da família',
      'Não se aplica para este projeto',
      'A definir em reunião com arquiteto',
      'Seguir normas técnicas NBR',
      'Padrão residencial contemporâneo',
      'Funcional e confortável',
      'Sustentável e eficiente energeticamente',
      'Integrado ao paisagismo',
      'Adequado ao perfil da família',
      'Moderno e aconchegante'
    ];
    
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  async preencherTodosCampos(todosCampos) {
    console.log('🚀 PREENCHENDO CAMPOS EM ORDEM NUMÉRICA...');
    
    const camposOrdenados = todosCampos.sort((a, b) => {
      const numeroA = this.extrairNumeroPergunta(a);
      const numeroB = this.extrairNumeroPergunta(b);
      return numeroA - numeroB;
    });
    
    console.log('📋 ORDEM DE PREENCHIMENTO:');
    camposOrdenados.slice(0, 10).forEach((campo, i) => {
      const numeroPergunta = this.extrairNumeroPergunta(campo);
      console.log(`   ${i+1}. Pergunta ${numeroPergunta} - ${campo.elemento}[${campo.tipo}] - "${campo.placeholder || campo.name}"`);
    });
    
    let totalPreenchidos = 0;
    const perguntasProcessadas = new Set();
    
    for (const campo of camposOrdenados) {
      try {
        // Pular campos com valores de orientação (não radio buttons)
        if (campo.value && campo.value.trim() !== '' && campo.tipo !== 'radio' && this.ehValorOrientacao(campo)) {
          console.log(`   ⏭️ Pulando orientação: ${campo.elemento}[${campo.tipo}] = "${campo.value}"`);
          continue;
        }
        
        const elemento = await this.page.$(campo.seletor);
        if (!elemento) {
          console.log(`   ⚠️ Elemento não encontrado: ${campo.seletor}`);
          continue;
        }
        
        const isVisible = await elemento.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 && 
                 style.display !== 'none' && style.visibility !== 'hidden';
        });
        
        if (!isVisible) {
          console.log(`   👻 Elemento não visível: ${campo.seletor}`);
          continue;
        }
        
        await elemento.evaluate(el => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let sucesso = false;
        
        switch (campo.tipo) {
          case 'text':
          case 'textarea':
            const respostaTexto = this.gerarResposta(campo);
            await elemento.click();
            await elemento.evaluate(el => el.value = '');
            await elemento.type(respostaTexto, { delay: 50 });
            console.log(`   ✅ ${campo.elemento}[${campo.tipo}] "${campo.placeholder || campo.name}" → "${respostaTexto}"`);
            sucesso = true;
            break;
            
          case 'number':
            const respostaNumero = this.gerarResposta(campo);
            await elemento.click();
            await elemento.evaluate(el => el.value = '');
            await elemento.type(respostaNumero.toString(), { delay: 50 });
            console.log(`   ✅ ${campo.elemento}[${campo.tipo}] → "${respostaNumero}"`);
            sucesso = true;
            break;
            
          case 'radio':
            // Para radio buttons, verificar se já há um selecionado no grupo
            const grupoJaSelecionado = await this.page.evaluate((name) => {
              const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
              return Array.from(radios).some(radio => radio.checked);
            }, campo.name);
            
            if (!grupoJaSelecionado && !perguntasProcessadas.has(campo.name)) {
              await elemento.click();
              console.log(`   ✅ ${campo.elemento}[${campo.tipo}] "${campo.name}" selecionado`);
              perguntasProcessadas.add(campo.name);
              sucesso = true;
            }
            break;
            
          case 'checkbox':
            if (Math.random() > 0.3) {
              await elemento.click();
              console.log(`   ✅ ${campo.elemento}[${campo.tipo}] "${campo.name}" marcado`);
              sucesso = true;
            }
            break;
            
          case 'select':
            if (campo.opcoes && campo.opcoes.length > 1) {
              const opcaoAleatoria = Math.floor(Math.random() * (campo.opcoes.length - 1)) + 1;
              const opcaoEscolhida = campo.opcoes[opcaoAleatoria];
              
              await elemento.select(opcaoEscolhida.value);
              console.log(`   ✅ ${campo.elemento}[${campo.tipo}] → "${opcaoEscolhida.text}"`);
              sucesso = true;
            }
            break;
        }
        
        if (sucesso) {
          totalPreenchidos++;
          this.perguntasRespondidas++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        console.log(`   ❌ Erro no campo ${campo.seletor}: ${error.message}`);
      }
    }
    
    console.log(`🎯 Total preenchido nesta rodada: ${totalPreenchidos} campos`);
    return totalPreenchidos;
  }

  async tentarAvancarSecao() {
    console.log('➡️ Tentando avançar para próxima seção...');
    
    const acaoExecutada = await this.page.evaluate(() => {
      const botoes = Array.from(document.querySelectorAll('button'));
      
      const acoes = [
        'próxima seção',
        'próxima etapa', 
        'próximo',
        'continuar',
        'avançar'
      ];
      
      for (const acao of acoes) {
        const botao = botoes.find(btn => 
          btn.textContent?.toLowerCase().includes(acao) && 
          !btn.disabled &&
          btn.offsetParent !== null
        );
        
        if (botao) {
          botao.click();
          return acao;
        }
      }
      
      return null;
    });
    
    if (acaoExecutada) {
      console.log(`✅ Ação executada: ${acaoExecutada}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return true;
    } else {
      console.log('⚠️ Nenhum botão de avanço encontrado');
      return false;
    }
  }

  async executarPreenchimentoCompleto() {
    console.log('🎯 INICIANDO PREENCHIMENTO AUTOMÁTICO DAS 235 PERGUNTAS');
    console.log('=' .repeat(70));
    
    try {
      await this.aguardarPaginaPerguntas();
      
      let continuarPreenchimento = true;
      
      while (continuarPreenchimento && this.secaoAtual <= this.totalSecoes) {
        console.log(`\n📋 PROCESSANDO SEÇÃO ${this.secaoAtual}/${this.totalSecoes}`);
        
        await this.page.screenshot({ 
          path: `briefing-secao-${this.secaoAtual}-${Date.now()}.png`,
          fullPage: true 
        });
        
        const analise = await this.analisarSecaoAtual();
        const totalPreenchidos = await this.preencherTodosCampos(analise.todosCampos);
        
        console.log(`✅ Seção ${this.secaoAtual} concluída: ${totalPreenchidos} campos preenchidos`);
        
        const avancarSucesso = await this.tentarAvancarSecao();
        
        if (avancarSucesso) {
          this.secaoAtual++;
        } else {
          console.log('🏁 Não conseguiu avançar - finalizando');
          continuarPreenchimento = false;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        const urlAtual = this.page.url();
        if (!urlAtual.includes('/briefing')) {
          console.log('🏁 Saiu da página de briefing - processo concluído');
          continuarPreenchimento = false;
        }
        
        if (this.secaoAtual > 20) {
          console.log('⚠️ Limite de seções atingido');
          continuarPreenchimento = false;
        }
      }
      
      await this.page.screenshot({ 
        path: `briefing-completo-finalizado-${Date.now()}.png`,
        fullPage: true 
      });
      
      console.log('\n🏆 PREENCHIMENTO AUTOMÁTICO CONCLUÍDO!');
      console.log(`📊 Total de perguntas respondidas: ${this.perguntasRespondidas}`);
      console.log(`📋 Seções processadas: ${this.secaoAtual - 1}/${this.totalSecoes}`);
      
      return {
        sucesso: true,
        perguntasRespondidas: this.perguntasRespondidas,
        secoesProcessadas: this.secaoAtual - 1
      };
      
    } catch (error) {
      console.error('❌ ERRO NO PREENCHIMENTO:', error.message);
      
      await this.page.screenshot({ 
        path: `erro-preenchimento-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  }

  async finalizar() {
    console.log('🔚 Finalizando sistema...');
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log('✅ Sistema finalizado');
  }
}

// ===== EXECUÇÃO =====

async function executarPreenchimentoBriefings() {
  const sistema = new SistemaPreenchimentoBriefings();
  
  try {
    await sistema.inicializar();
    const resultado = await sistema.executarPreenchimentoCompleto();
    
    console.log('\n🎉 RESULTADO FINAL:');
    console.log(JSON.stringify(resultado, null, 2));
    
  } catch (error) {
    console.error('\n💥 ERRO CRÍTICO:', error.message);
  } finally {
    await sistema.finalizar();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarPreenchimentoBriefings();
}

module.exports = { SistemaPreenchimentoBriefings, executarPreenchimentoBriefings };