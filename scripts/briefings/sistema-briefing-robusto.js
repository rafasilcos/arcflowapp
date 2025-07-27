/**
 * SISTEMA ROBUSTO PARA PREENCHIMENTO DE BRIEFINGS - ARCFLOW
 * 
 * Sistema com verificações robustas e aguarda carregamento completo
 * 
 * Versão: 1.2 - Robusta
 * Data: 24/07/2025
 */

const puppeteer = require('puppeteer');

class SistemaBriefingRobusto {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async inicializar() {
    console.log('🚀 Inicializando sistema robusto para ArcFlow');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1366, height: 768 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('✅ Sistema inicializado');
  }

  async fazerLogin(email, senha) {
    console.log('🔐 Fazendo login...');
    
    await this.page.goto('http://localhost:3000/auth/login', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await this.page.type('input[type="email"]', email, { delay: 100 });
    await this.page.type('input[type="password"]', senha, { delay: 100 });
    await this.page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para dashboard
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const urlAtual = this.page.url();
    console.log(`📍 URL após login: ${urlAtual}`);
    
    if (urlAtual.includes('/dashboard')) {
      console.log('✅ Login realizado com sucesso');
    } else if (urlAtual.includes('/auth/login')) {
      throw new Error('Login falhou - ainda na página de login');
    } else {
      console.log('⚠️ Redirecionamento inesperado, mas continuando...');
    }
  }

  async aguardarCarregamentoCompleto() {
    console.log('⏳ Aguardando carregamento completo da página...');
    
    // Aguardar múltiplas condições
    await Promise.all([
      this.page.waitForLoadState?.('networkidle') || Promise.resolve(),
      new Promise(resolve => setTimeout(resolve, 5000)), // 5 segundos fixos
      this.page.waitForFunction(() => document.readyState === 'complete'),
    ]);
    
    console.log('✅ Página carregada completamente');
  }

  async navegarParaBriefing() {
    console.log('🧭 Navegando para página de briefing...');
    
    await this.page.goto('http://localhost:3000/briefing/novo', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await this.aguardarCarregamentoCompleto();
    
    // Capturar screenshot para debug
    await this.page.screenshot({ 
      path: `debug-navegacao-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verificar se estamos na página correta
    const url = this.page.url();
    console.log(`📍 URL atual: ${url}`);
    
    if (!url.includes('/briefing/novo')) {
      throw new Error(`URL incorreta: ${url}. Esperado: /briefing/novo`);
    }
    
    // Aguardar e verificar elementos
    console.log('🔍 Verificando elementos na página...');
    
    const elementos = await this.page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const textareas = Array.from(document.querySelectorAll('textarea'));
      const buttons = Array.from(document.querySelectorAll('button'));
      
      return {
        inputs: inputs.length,
        textareas: textareas.length,
        buttons: buttons.length,
        inputsInfo: inputs.slice(0, 5).map(input => ({
          type: input.type,
          placeholder: input.placeholder,
          visible: input.offsetParent !== null
        }))
      };
    });
    
    console.log(`📊 Elementos encontrados: ${elementos.inputs} inputs, ${elementos.textareas} textareas, ${elementos.buttons} buttons`);
    elementos.inputsInfo.forEach((input, i) => {
      console.log(`   Input ${i+1}: ${input.type} - "${input.placeholder}" - Visível: ${input.visible}`);
    });
    
    // Tentar diferentes estratégias para encontrar campos
    const estrategias = [
      () => this.page.waitForSelector('input[placeholder*="Nome"]', { timeout: 5000 }),
      () => this.page.waitForSelector('input[placeholder*="Projeto"]', { timeout: 5000 }),
      () => this.page.waitForSelector('input[type="text"]', { timeout: 5000 }),
      () => this.page.waitForSelector('input', { timeout: 5000 })
    ];
    
    let campoEncontrado = false;
    for (let i = 0; i < estrategias.length; i++) {
      try {
        console.log(`🎯 Tentando estratégia ${i + 1}...`);
        await estrategias[i]();
        console.log(`✅ Estratégia ${i + 1} funcionou!`);
        campoEncontrado = true;
        break;
      } catch (e) {
        console.log(`❌ Estratégia ${i + 1} falhou: ${e.message}`);
      }
    }
    
    if (!campoEncontrado) {
      // Última tentativa: aguardar mais tempo
      console.log('⏳ Última tentativa: aguardando 10 segundos adicionais...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      try {
        await this.page.waitForSelector('input', { timeout: 5000 });
        console.log('✅ Campo encontrado após aguardar mais tempo');
      } catch (e) {
        throw new Error('Nenhum campo de entrada encontrado após todas as tentativas');
      }
    }
    
    console.log('✅ Página de briefing carregada e campos encontrados');
  }

  async preencherCampoSeguro(seletor, valor, nome) {
    console.log(`📝 Preenchendo ${nome}...`);
    
    try {
      const campo = await this.page.$(seletor);
      if (campo) {
        // Verificar se o campo está visível
        const visivel = await campo.evaluate(el => el.offsetParent !== null);
        if (!visivel) {
          console.log(`⚠️ Campo ${nome} não está visível`);
          return false;
        }
        
        // Limpar e preencher
        await campo.click();
        await campo.evaluate(el => el.value = '');
        await campo.type(valor, { delay: 100 });
        
        // Verificar se foi preenchido
        const valorAtual = await campo.evaluate(el => el.value);
        if (valorAtual === valor) {
          console.log(`✅ ${nome} preenchido com sucesso`);
          return true;
        } else {
          console.log(`⚠️ ${nome} não foi preenchido corretamente. Esperado: "${valor}", Atual: "${valorAtual}"`);
          return false;
        }
      } else {
        console.log(`⚠️ Campo ${nome} não encontrado`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Erro ao preencher ${nome}: ${error.message}`);
      return false;
    }
  }

  async preencherBriefing(dados) {
    console.log('📝 Iniciando preenchimento do briefing...');
    
    const resultados = {};
    
    // 1. Nome do Projeto
    resultados.nome = await this.preencherCampoSeguro(
      'input[placeholder="Nome do Projeto *"]',
      dados.nomeProjeto || 'TESTE AUTOMÁTICO - Residência Silva',
      'Nome do Projeto'
    );
    
    // 2. Prazo
    resultados.prazo = await this.preencherCampoSeguro(
      'input[placeholder="Prazo estimado (ex: 3 meses)"]',
      dados.prazo || '6 meses',
      'Prazo'
    );
    
    // 3. Orçamento
    resultados.orcamento = await this.preencherCampoSeguro(
      'input[placeholder="Orçamento previsto (ex: R$ 50.000)"]',
      dados.orcamento || 'R$ 500.000',
      'Orçamento'
    );
    
    // 4. Preencher e Selecionar Cliente
    console.log('👤 Preenchendo e selecionando cliente...');
    try {
      const campoCliente = await this.page.$('input[placeholder="Digite o nome ou email do cliente..."]');
      if (campoCliente) {
        // Limpar campo e digitar "Ana" para buscar
        await campoCliente.click();
        await campoCliente.evaluate(el => el.value = '');
        await campoCliente.type('Ana', { delay: 100 });
        
        // Aguardar autocomplete aparecer
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Procurar e clicar na opção da Ana
        const clienteSelecionada = await this.page.evaluate(() => {
          // Procurar por elementos que podem ser opções do autocomplete
          const seletores = [
            '[role="option"]',
            '.autocomplete-option',
            '.dropdown-item',
            '.select-option',
            'li',
            '[class*="option"]',
            '[class*="item"]'
          ];
          
          for (const seletor of seletores) {
            const opcoes = Array.from(document.querySelectorAll(seletor));
            const opcaoAna = opcoes.find(opcao => 
              opcao.textContent?.toLowerCase().includes('ana') && 
              opcao.offsetParent !== null
            );
            
            if (opcaoAna) {
              opcaoAna.click();
              return opcaoAna.textContent?.trim();
            }
          }
          
          return null;
        });
        
        if (clienteSelecionada) {
          console.log(`✅ Cliente selecionada: ${clienteSelecionada}`);
          resultados.cliente = true;
        } else {
          console.log('⚠️ Cliente Ana não encontrada no autocomplete');
          resultados.cliente = false;
        }
      } else {
        console.log('⚠️ Campo cliente não encontrado');
        resultados.cliente = false;
      }
    } catch (error) {
      console.log(`❌ Erro ao selecionar cliente: ${error.message}`);
      resultados.cliente = false;
    }
    
    // 5. Descrição
    resultados.descricao = await this.preencherCampoSeguro(
      'textarea[placeholder="Descrição detalhada do projeto (opcional)"]',
      dados.descricao || 'Briefing preenchido automaticamente pelo sistema ArcFlow.',
      'Descrição'
    );
    
    // 6. Responsável (dropdown)
    console.log('👨‍💼 Selecionando responsável...');
    try {
      const botaoResponsavel = await this.page.$('button[role="combobox"]');
      if (botaoResponsavel) {
        await botaoResponsavel.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const opcoes = await this.page.$$('[role="option"]');
        if (opcoes.length > 0) {
          await opcoes[0].click();
          console.log('✅ Responsável selecionado');
          resultados.responsavel = true;
        } else {
          console.log('⚠️ Nenhuma opção de responsável encontrada');
          resultados.responsavel = false;
        }
      } else {
        console.log('⚠️ Dropdown responsável não encontrado');
        resultados.responsavel = false;
      }
    } catch (e) {
      console.log('❌ Erro ao selecionar responsável:', e.message);
      resultados.responsavel = false;
    }
    
    // Resumo dos resultados
    console.log('\n📊 RESUMO DO PREENCHIMENTO:');
    Object.entries(resultados).forEach(([campo, sucesso]) => {
      console.log(`   ${campo}: ${sucesso ? '✅' : '❌'}`);
    });
    
    const sucessos = Object.values(resultados).filter(Boolean).length;
    const total = Object.keys(resultados).length;
    console.log(`\n🎯 Taxa de sucesso: ${sucessos}/${total} (${Math.round(sucessos/total*100)}%)`);
    
    return resultados;
  }

  async tentarAvancar() {
    console.log('➡️ Tentando avançar para próxima etapa...');
    
    try {
      const botaoEncontrado = await this.page.evaluate(() => {
        const botoes = Array.from(document.querySelectorAll('button'));
        const botao = botoes.find(btn => btn.textContent?.trim() === 'Próxima Etapa');
        if (botao && !botao.disabled) {
          botao.click();
          return true;
        }
        return false;
      });
      
      if (botaoEncontrado) {
        console.log('✅ Clicou em "Próxima Etapa"');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
      } else {
        console.log('⚠️ Botão "Próxima Etapa" não encontrado ou desabilitado');
        return false;
      }
    } catch (error) {
      console.log('❌ Erro ao tentar avançar:', error.message);
      return false;
    }
  }

  async selecionarTipoBriefing() {
    console.log('🏠 ETAPA 2: Selecionando tipo de briefing (Arquitetura → Residencial → Unifamiliar)...');
    
    // Aguardar página carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Capturar screenshot da página de seleção
    await this.page.screenshot({ 
      path: `selecao-briefing-${Date.now()}.png`,
      fullPage: true 
    });
    
    try {
      // PASSO 1: Clicar em ARQUITETURA
      console.log('🏗️ Passo 1: Clicando em Arquitetura...');
      const arquiteturaClicada = await this.page.evaluate(() => {
        const elementos = Array.from(document.querySelectorAll('button, .card, [class*="card"], div, span'));
        const arquitetura = elementos.find(el => 
          el.textContent?.toLowerCase().includes('arquitetura') && 
          el.offsetParent !== null
        );
        
        if (arquitetura) {
          arquitetura.click();
          return arquitetura.textContent?.trim();
        }
        return null;
      });
      
      if (arquiteturaClicada) {
        console.log(`✅ Arquitetura selecionada: ${arquiteturaClicada}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('⚠️ Arquitetura não encontrada');
      }
      
      // PASSO 2: Clicar em RESIDENCIAL
      console.log('🏠 Passo 2: Clicando em Residencial...');
      const residencialClicada = await this.page.evaluate(() => {
        const elementos = Array.from(document.querySelectorAll('button, .card, [class*="card"], div, span'));
        const residencial = elementos.find(el => 
          el.textContent?.toLowerCase().includes('residencial') && 
          el.offsetParent !== null
        );
        
        if (residencial) {
          residencial.click();
          return residencial.textContent?.trim();
        }
        return null;
      });
      
      if (residencialClicada) {
        console.log(`✅ Residencial selecionada: ${residencialClicada}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('⚠️ Residencial não encontrada');
      }
      
      // PASSO 3: Clicar em UNIFAMILIAR
      console.log('👨‍👩‍👧‍👦 Passo 3: Clicando em Unifamiliar...');
      const unifamiliarClicada = await this.page.evaluate(() => {
        const elementos = Array.from(document.querySelectorAll('button, .card, [class*="card"], div, span'));
        const unifamiliar = elementos.find(el => 
          el.textContent?.toLowerCase().includes('unifamiliar') && 
          el.offsetParent !== null
        );
        
        if (unifamiliar) {
          unifamiliar.click();
          return unifamiliar.textContent?.trim();
        }
        return null;
      });
      
      if (unifamiliarClicada) {
        console.log(`✅ Unifamiliar selecionada: ${unifamiliarClicada}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('⚠️ Unifamiliar não encontrada');
      }
      
      // PASSO 4: Clicar em GERAR BRIEFING
      console.log('⚡ Passo 4: Clicando em Gerar Briefing...');
      const gerarBriefingClicado = await this.page.evaluate(() => {
        const botoes = Array.from(document.querySelectorAll('button'));
        const gerarBriefing = botoes.find(btn => 
          btn.textContent?.toLowerCase().includes('gerar briefing') && 
          !btn.disabled
        );
        
        if (gerarBriefing) {
          gerarBriefing.click();
          return gerarBriefing.textContent?.trim();
        }
        return null;
      });
      
      if (gerarBriefingClicado) {
        console.log(`✅ Gerar Briefing clicado: ${gerarBriefingClicado}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return 'Arquitetura → Residencial → Unifamiliar';
      } else {
        console.log('⚠️ Botão Gerar Briefing não encontrado');
        return null;
      }
      
    } catch (error) {
      console.log(`❌ Erro na seleção de tipologia: ${error.message}`);
      return null;
    }
  }

  async preencherPerguntasBriefing() {
    console.log('📋 ETAPA 3: Preenchendo perguntas do briefing...');
    
    let perguntasRespondidas = 0;
    let etapaAtual = 1;
    let continuarPreenchimento = true;
    
    while (continuarPreenchimento) {
      console.log(`\n🔄 Processando etapa ${etapaAtual} das perguntas...`);
      
      // Aguardar página carregar
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Capturar screenshot da etapa atual
      await this.page.screenshot({ 
        path: `perguntas-etapa-${etapaAtual}-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Verificar URL atual
      const urlAtual = this.page.url();
      console.log(`📍 URL atual: ${urlAtual}`);
      
      // Analisar perguntas na página
      const perguntas = await this.page.evaluate(() => {
        const elementos = [];
        
        // Procurar diferentes tipos de campos de pergunta
        const seletores = [
          'input[type="text"]:not([placeholder*="Buscar"]):not([placeholder*="buscar"])',
          'input[type="number"]',
          'textarea',
          'select',
          'input[type="radio"]',
          'input[type="checkbox"]',
          'button[role="combobox"]'
        ];
        
        seletores.forEach(seletor => {
          const campos = Array.from(document.querySelectorAll(seletor));
          campos.forEach((campo, index) => {
            if (campo.offsetParent !== null) { // Apenas elementos visíveis
              elementos.push({
                tipo: campo.type || campo.tagName.toLowerCase(),
                seletor: `${seletor}:nth-of-type(${index + 1})`,
                placeholder: campo.placeholder || '',
                name: campo.name || '',
                id: campo.id || '',
                text: campo.textContent?.trim() || ''
              });
            }
          });
        });
        
        return elementos;
      });
      
      console.log(`📝 Encontradas ${perguntas.length} perguntas nesta etapa`);
      
      if (perguntas.length === 0) {
        console.log('⚠️ Nenhuma pergunta encontrada - pode ter chegado ao fim');
        break;
      }
      
      // Responder cada pergunta
      for (let i = 0; i < perguntas.length; i++) {
        const pergunta = perguntas[i];
        const sucesso = await this.responderPergunta(pergunta, i + 1);
        if (sucesso) {
          perguntasRespondidas++;
        }
      }
      
      console.log(`✅ Etapa ${etapaAtual} concluída - ${perguntas.length} perguntas processadas`);
      
      // Tentar avançar para próxima etapa ou finalizar
      const proximaEtapa = await this.tentarAvancarOuFinalizar();
      
      if (!proximaEtapa) {
        console.log('🏁 Não conseguiu avançar - processo finalizado');
        continuarPreenchimento = false;
      } else {
        etapaAtual++;
        
        // Verificar se ainda estamos no briefing
        await new Promise(resolve => setTimeout(resolve, 2000));
        const novaUrl = this.page.url();
        if (!novaUrl.includes('/briefing') && !novaUrl.includes('/pergunta')) {
          console.log('🏁 Saiu do briefing - processo concluído');
          continuarPreenchimento = false;
        }
      }
      
      // Limite de segurança
      if (etapaAtual > 15) {
        console.log('⚠️ Limite de etapas atingido');
        continuarPreenchimento = false;
      }
    }
    
    console.log(`\n🎉 BRIEFING COMPLETO!`);
    console.log(`📊 Total de perguntas respondidas: ${perguntasRespondidas}`);
    
    return perguntasRespondidas;
  }

  async responderPergunta(pergunta, numero) {
    console.log(`   ${numero}. Respondendo: ${pergunta.tipo} - "${pergunta.placeholder || pergunta.text}"`);
    
    try {
      const elemento = await this.page.$(pergunta.seletor);
      if (!elemento) {
        console.log(`      ⚠️ Elemento não encontrado`);
        return false;
      }
      
      // Gerar resposta baseada no tipo
      const resposta = this.gerarResposta(pergunta);
      
      switch (pergunta.tipo) {
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
          
        case 'radio':
          await elemento.click();
          break;
          
        case 'checkbox':
          if (Math.random() > 0.3) { // 70% chance de marcar
            await elemento.click();
          }
          break;
          
        case 'button': // combobox
          await elemento.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const opcoesCombo = await this.page.$$('[role="option"]');
          if (opcoesCombo.length > 0) {
            const opcaoAleatoria = Math.floor(Math.random() * opcoesCombo.length);
            await opcoesCombo[opcaoAleatoria].click();
          }
          break;
      }
      
      console.log(`      ✅ Respondido: "${resposta}"`);
      return true;
      
    } catch (error) {
      console.log(`      ❌ Erro: ${error.message}`);
      return false;
    }
  }

  gerarResposta(pergunta) {
    const placeholder = (pergunta.placeholder || pergunta.text || '').toLowerCase();
    
    // Respostas específicas baseadas no contexto
    if (placeholder.includes('área') || placeholder.includes('m²')) {
      return Math.floor(Math.random() * 400 + 80).toString(); // 80-480 m²
    }
    
    if (placeholder.includes('altura') || placeholder.includes('pé direito')) {
      return (Math.random() * 1.5 + 2.7).toFixed(1); // 2.7-4.2m
    }
    
    if (placeholder.includes('quantidade') || placeholder.includes('número') || placeholder.includes('qtd')) {
      return Math.floor(Math.random() * 8 + 1).toString(); // 1-8
    }
    
    if (placeholder.includes('orçamento') || placeholder.includes('valor') || placeholder.includes('r$')) {
      return `R$ ${(Math.random() * 400000 + 100000).toFixed(0)}`; // R$ 100k-500k
    }
    
    if (pergunta.tipo === 'number') {
      return Math.floor(Math.random() * 50 + 1).toString();
    }
    
    // Respostas textuais contextuais
    const respostas = [
      'Sim, conforme projeto arquitetônico',
      'Não se aplica neste caso',
      'A definir com o cliente',
      'Seguir normas técnicas NBR',
      'Padrão residencial moderno',
      'Funcional e econômico',
      'Sustentável e eficiente',
      'Integrado ao entorno',
      'Conforme disponibilidade do terreno',
      'Adequado às necessidades familiares'
    ];
    
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  async tentarAvancarOuFinalizar() {
    console.log('   🔄 Tentando avançar ou finalizar...');
    
    const acaoEncontrada = await this.page.evaluate(() => {
      const botoes = Array.from(document.querySelectorAll('button'));
      
      // Prioridades de ação
      const acoes = [
        'finalizar briefing',
        'gerar orçamento',
        'concluir',
        'finalizar',
        'próxima etapa',
        'próximo',
        'continuar',
        'avançar'
      ];
      
      for (const acao of acoes) {
        const botao = botoes.find(btn => 
          btn.textContent?.toLowerCase().includes(acao) && !btn.disabled
        );
        
        if (botao) {
          botao.click();
          return { acao, sucesso: true };
        }
      }
      
      return { acao: null, sucesso: false };
    });
    
    if (acaoEncontrada.sucesso) {
      console.log(`   ✅ Ação executada: ${acaoEncontrada.acao}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return true;
    } else {
      console.log('   ⚠️ Nenhuma ação disponível');
      return false;
    }
  }

  async aguardarSelecaoManual() {
    console.log('\n⏸️  PAUSA PARA SELEÇÃO MANUAL');
    console.log('=' .repeat(60));
    console.log('👤 AGORA É SUA VEZ!');
    console.log('');
    console.log('📋 Por favor, faça manualmente:');
    console.log('   1. 🏗️  Clique em "Arquitetura"');
    console.log('   2. 🏠 Clique em "Residencial"');
    console.log('   3. 👨‍👩‍👧‍👦 Clique em "Unifamiliar"');
    console.log('   4. ⚡ Clique em "Gerar Briefing"');
    console.log('');
    console.log('🤖 Após clicar em "Gerar Briefing", o sistema continuará automaticamente');
    console.log('📋 Preenchendo todas as 235 perguntas nas 15 seções');
    console.log('');
    console.log('⏳ Aguardando você chegar na página das perguntas...');
    
    // Aguardar até detectar que chegamos na página de perguntas
    let tentativas = 0;
    const maxTentativas = 120; // 10 minutos
    
    while (tentativas < maxTentativas) {
      try {
        const url = this.page.url();
        
        // Verificar se há muitas perguntas na página (indicativo de briefing gerado)
        const temMuitasPerguntas = await this.page.evaluate(() => {
          const inputs = document.querySelectorAll('input, textarea, select');
          const perguntasReais = Array.from(inputs).filter(el => 
            el.offsetParent !== null && // Visível
            !el.placeholder?.toLowerCase().includes('buscar') &&
            !el.placeholder?.toLowerCase().includes('search') &&
            !el.placeholder?.toLowerCase().includes('nome do projeto') &&
            !el.placeholder?.toLowerCase().includes('prazo') &&
            !el.placeholder?.toLowerCase().includes('orçamento')
          );
          return perguntasReais.length > 10; // Se tem mais de 10 campos específicos
        });
        
        if (temMuitasPerguntas) {
          console.log('\n✅ PÁGINA DE PERGUNTAS DETECTADA!');
          console.log('🤖 Iniciando preenchimento automático das 235 perguntas...');
          return true;
        }
        
        // Mostrar progresso a cada 10 tentativas
        if (tentativas % 10 === 0) {
          console.log(`⏳ Aguardando... (${tentativas * 5}s) - URL: ${url}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        tentativas++;
        
      } catch (error) {
        console.log(`⚠️ Erro ao verificar: ${error.message}`);
        tentativas++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    throw new Error('Timeout: Não detectou a página de perguntas em 10 minutos');
  }

  async executarFluxoCompleto(dados) {
    console.log('🎯 Executando fluxo HÍBRIDO (automático + manual)');
    
    try {
      // ETAPA 1: Login (automático)
      await this.fazerLogin(dados.email, dados.senha);
      
      // ETAPA 2: Navegar para briefing (automático)
      await this.navegarParaBriefing();
      
      // ETAPA 3: Preencher dados básicos (automático)
      const resultados = await this.preencherBriefing(dados);
      
      // ETAPA 4: Avançar para seleção de tipo (automático)
      const avancarSucesso = await this.tentarAvancar();
      if (!avancarSucesso) {
        throw new Error('Não conseguiu avançar da primeira etapa');
      }
      
      // ETAPA 5: Aguardar seleção manual (manual)
      await this.aguardarSelecaoManual();
      
      // ETAPA 6: Preencher todas as perguntas do briefing (automático)
      const perguntasRespondidas = await this.preencherPerguntasBriefing();
      
      // ETAPA 7: Screenshot final
      await this.page.screenshot({ 
        path: `briefing-completo-finalizado-${Date.now()}.png`,
        fullPage: true 
      });
      
      console.log('\n🏆 BRIEFING HÍBRIDO FINALIZADO COM SUCESSO!');
      console.log(`📊 Dados básicos: ${Object.values(resultados).filter(Boolean).length}/${Object.keys(resultados).length} campos`);
      console.log(`📋 Perguntas respondidas: ${perguntasRespondidas}`);
      console.log('🔍 Verifique o banco de dados para confirmar salvamento');
      
      // Aguardar para visualização final
      console.log('⏳ Aguardando 15 segundos para visualização final...');
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      return { 
        preenchimento: resultados, 
        perguntasRespondidas,
        sucesso: true
      };
      
    } catch (error) {
      console.error('❌ Erro no fluxo completo:', error);
      
      // Capturar screenshot do erro
      await this.page.screenshot({ 
        path: `erro-briefing-completo-${Date.now()}.png`,
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

async function executarSistemaRobusto() {
  const sistema = new SistemaBriefingRobusto();
  
  const dados = {
    email: 'admin@arcflow.com',
    senha: '123456',
    nomeProjeto: 'TESTE AUTOMÁTICO - Residência Silva',
    prazo: '6 meses',
    orcamento: 'R$ 500.000',
    clienteNome: 'Ana Paula Silva',
    descricao: 'Briefing preenchido automaticamente pelo sistema ArcFlow. Projeto residencial moderno com foco em funcionalidade e conforto para a família.'
  };
  
  try {
    console.log('🚀 INICIANDO SISTEMA ROBUSTO PARA ARCFLOW');
    console.log('=' .repeat(60));
    
    await sistema.inicializar();
    const resultado = await sistema.executarFluxoCompleto(dados);
    
    console.log('\n🎉 EXECUÇÃO CONCLUÍDA!');
    console.log('📊 Resultados:', JSON.stringify(resultado, null, 2));
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  } finally {
    await sistema.finalizar();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarSistemaRobusto();
}

module.exports = { SistemaBriefingRobusto, executarSistemaRobusto };