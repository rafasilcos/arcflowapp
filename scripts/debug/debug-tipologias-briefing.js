/**
 * DEBUG ESPECÍFICO PARA TIPOLOGIAS DE BRIEFING
 * 
 * Script para analisar exatamente o que acontece após
 * clicar em "Próxima Etapa" e encontrar as tipologias.
 */

const puppeteer = require('puppeteer');

async function debugTipologias() {
  console.log('🔍 DEBUG ESPECÍFICO DAS TIPOLOGIAS');
  console.log('=' .repeat(50));
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    // 1. LOGIN
    console.log('🔐 Login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'admin@arcflow.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. NAVEGAR PARA BRIEFING
    console.log('🧭 Navegando para briefing...');
    await page.goto('http://localhost:3000/briefing/novo', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. PREENCHER DADOS BÁSICOS RAPIDAMENTE
    console.log('📝 Preenchimento rápido...');
    
    const campos = [
      { seletor: 'input[placeholder="Nome do Projeto *"]', valor: 'DEBUG TIPOLOGIAS' },
      { seletor: 'input[placeholder="Prazo estimado (ex: 3 meses)"]', valor: '6 meses' },
      { seletor: 'input[placeholder="Orçamento previsto (ex: R$ 50.000)"]', valor: 'R$ 400.000' },
      { seletor: 'textarea[placeholder="Descrição detalhada do projeto (opcional)"]', valor: 'Debug das tipologias' }
    ];

    for (const campo of campos) {
      const elemento = await page.$(campo.seletor);
      if (elemento) {
        await elemento.click();
        await elemento.evaluate(el => el.value = '');
        await elemento.type(campo.valor, { delay: 30 });
      }
    }

    // 4. SELECIONAR CLIENTE ANA
    console.log('👤 Selecionando cliente Ana...');
    const campoCliente = await page.$('input[placeholder="Digite o nome ou email do cliente..."]');
    if (campoCliente) {
      await campoCliente.click();
      await campoCliente.evaluate(el => el.value = '');
      await campoCliente.type('Ana', { delay: 100 });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clicar na Ana
      await page.evaluate(() => {
        const opcoes = Array.from(document.querySelectorAll('[role="option"], .autocomplete-option, .dropdown-item, li'));
        const opcaoAna = opcoes.find(opcao => opcao.textContent?.toLowerCase().includes('ana'));
        if (opcaoAna) opcaoAna.click();
      });
    }

    // 5. SELECIONAR RESPONSÁVEL
    console.log('👨‍💼 Selecionando responsável...');
    const botaoResponsavel = await page.$('button[role="combobox"]');
    if (botaoResponsavel) {
      await botaoResponsavel.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const opcoes = await page.$$('[role="option"]');
      if (opcoes.length > 0) {
        await opcoes[0].click();
      }
    }

    console.log('✅ Dados básicos preenchidos');

    // 6. CLICAR EM PRÓXIMA ETAPA
    console.log('\n➡️ Clicando em Próxima Etapa...');
    
    const botaoProximo = await page.evaluate(() => {
      const botoes = Array.from(document.querySelectorAll('button'));
      const botao = botoes.find(btn => btn.textContent?.trim() === 'Próxima Etapa');
      if (botao) {
        botao.click();
        return true;
      }
      return false;
    });
    
    if (!botaoProximo) {
      throw new Error('Botão Próxima Etapa não encontrado');
    }

    // 7. AGUARDAR E ANALISAR MUDANÇAS
    console.log('⏳ Aguardando mudanças na página...');
    
    // Aguardar diferentes tempos para capturar mudanças
    const tempos = [1000, 3000, 5000, 8000];
    
    for (let i = 0; i < tempos.length; i++) {
      await new Promise(resolve => setTimeout(resolve, tempos[i] - (i > 0 ? tempos[i-1] : 0)));
      
      console.log(`\n📸 ANÁLISE ${i + 1} (após ${tempos[i]}ms):`);
      
      const analise = await page.evaluate(() => {
        const url = window.location.href;
        const title = document.title;
        
        // Procurar por elementos que podem ser tipologias
        const todosElementos = Array.from(document.querySelectorAll('*'));
        
        // Palavras-chave para tipologias
        const palavrasChave = [
          'residencial', 'comercial', 'industrial', 'institucional', 'urbano',
          'casa', 'apartamento', 'escritório', 'loja', 'galpão', 'escola',
          'hospital', 'hotel', 'restaurante', 'briefing', 'tipo', 'categoria'
        ];
        
        const elementosRelevantes = todosElementos.filter(el => {
          const texto = el.textContent?.toLowerCase() || '';
          return palavrasChave.some(palavra => texto.includes(palavra)) &&
                 el.offsetParent !== null && // Visível
                 texto.length > 2 && texto.length < 100;
        }).map(el => ({
          tagName: el.tagName,
          text: el.textContent?.trim(),
          className: el.className,
          clickable: el.tagName === 'BUTTON' || el.tagName === 'A' || 
                    el.onclick !== null || el.className.includes('cursor-pointer')
        }));
        
        // Procurar por cards ou containers de tipologia
        const cards = Array.from(document.querySelectorAll('.card, [class*="card"], .grid > div, [class*="grid"] > div'))
          .filter(el => el.offsetParent !== null)
          .map(el => ({
            text: el.textContent?.trim(),
            className: el.className,
            children: el.children.length
          }));
        
        return {
          url,
          title,
          elementosRelevantes: elementosRelevantes.slice(0, 10),
          cards: cards.slice(0, 10)
        };
      });
      
      console.log(`📍 URL: ${analise.url}`);
      console.log(`📄 Título: ${analise.title}`);
      
      if (analise.elementosRelevantes.length > 0) {
        console.log('🎯 Elementos relevantes encontrados:');
        analise.elementosRelevantes.forEach((el, j) => {
          console.log(`   ${j+1}. ${el.tagName} - "${el.text}" - Clicável: ${el.clickable}`);
        });
      }
      
      if (analise.cards.length > 0) {
        console.log('🃏 Cards encontrados:');
        analise.cards.forEach((card, j) => {
          console.log(`   ${j+1}. "${card.text?.substring(0, 50)}..." - Filhos: ${card.children}`);
        });
      }
      
      // Capturar screenshot
      await page.screenshot({ 
        path: `debug-tipologia-${i+1}-${Date.now()}.png`,
        fullPage: true 
      });
    }

    // 8. TENTAR ENCONTRAR E CLICAR EM RESIDENCIAL
    console.log('\n🏠 Tentando encontrar e clicar em RESIDENCIAL...');
    
    const residencialEncontrado = await page.evaluate(() => {
      const elementos = Array.from(document.querySelectorAll('*'));
      
      // Procurar por elementos que contenham "residencial" ou palavras relacionadas
      const palavras = ['residencial', 'casa', 'moradia', 'habitação', 'apartamento'];
      
      for (const palavra of palavras) {
        const elemento = elementos.find(el => 
          el.textContent?.toLowerCase().includes(palavra) &&
          el.offsetParent !== null &&
          (el.tagName === 'BUTTON' || el.tagName === 'A' || el.onclick !== null || 
           el.className.includes('cursor-pointer') || el.className.includes('card'))
        );
        
        if (elemento) {
          elemento.click();
          return {
            sucesso: true,
            texto: elemento.textContent?.trim(),
            tagName: elemento.tagName,
            className: elemento.className,
            palavra
          };
        }
      }
      
      return { sucesso: false };
    });
    
    if (residencialEncontrado.sucesso) {
      console.log(`✅ RESIDENCIAL ENCONTRADO E CLICADO!`);
      console.log(`   Texto: "${residencialEncontrado.texto}"`);
      console.log(`   Tag: ${residencialEncontrado.tagName}`);
      console.log(`   Palavra-chave: ${residencialEncontrado.palavra}`);
      
      // Aguardar e analisar próxima página
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const urlFinal = page.url();
      console.log(`📍 URL após clicar: ${urlFinal}`);
      
      await page.screenshot({ 
        path: `debug-apos-residencial-${Date.now()}.png`,
        fullPage: true 
      });
      
    } else {
      console.log('❌ RESIDENCIAL NÃO ENCONTRADO');
    }

    // 9. AGUARDAR PARA INSPEÇÃO MANUAL
    console.log('\n⏳ Aguardando 30 segundos para inspeção manual...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ Erro:', error);
    await page.screenshot({ path: `debug-erro-tipologia-${Date.now()}.png`, fullPage: true });
  } finally {
    await browser.close();
    console.log('🔚 Debug finalizado');
  }
}

// Executar
if (require.main === module) {
  debugTipologias();
}

module.exports = { debugTipologias };