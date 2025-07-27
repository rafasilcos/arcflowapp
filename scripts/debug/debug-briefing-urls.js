/**
 * DEBUG DAS URLs E ESTRUTURA DO BRIEFING
 * 
 * Script para analisar o fluxo completo do briefing
 * e identificar as páginas corretas.
 */

const puppeteer = require('puppeteer');

async function debugBriefingUrls() {
  console.log('🔍 INICIANDO DEBUG DAS URLs DO BRIEFING');
  console.log('=' .repeat(60));
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    // 1. LOGIN
    console.log('🔐 Fazendo login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'admin@arcflow.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`✅ Login - URL: ${page.url()}`);

    // 2. NAVEGAR PARA BRIEFING
    console.log('\n🧭 Navegando para briefing...');
    await page.goto('http://localhost:3000/briefing/novo', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`📍 Página inicial - URL: ${page.url()}`);
    await page.screenshot({ path: `debug-etapa-1-${Date.now()}.png`, fullPage: true });

    // 3. PREENCHER DADOS BÁSICOS
    console.log('\n📝 Preenchendo dados básicos...');
    
    const campos = [
      { seletor: 'input[placeholder="Nome do Projeto *"]', valor: 'TESTE DEBUG - Casa Moderna' },
      { seletor: 'input[placeholder="Prazo estimado (ex: 3 meses)"]', valor: '8 meses' },
      { seletor: 'input[placeholder="Orçamento previsto (ex: R$ 50.000)"]', valor: 'R$ 600.000' },
      { seletor: 'input[placeholder="Digite o nome ou email do cliente..."]', valor: 'João Silva' },
      { seletor: 'textarea[placeholder="Descrição detalhada do projeto (opcional)"]', valor: 'Casa moderna para família de 4 pessoas' }
    ];

    for (const campo of campos) {
      try {
        const elemento = await page.$(campo.seletor);
        if (elemento) {
          await elemento.click();
          await elemento.evaluate(el => el.value = '');
          await elemento.type(campo.valor, { delay: 50 });
          console.log(`✅ Preenchido: ${campo.seletor}`);
        }
      } catch (e) {
        console.log(`⚠️ Erro: ${campo.seletor}`);
      }
    }

    // 4. CLICAR EM PRÓXIMA ETAPA
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
    
    if (botaoProximo) {
      console.log('✅ Clicou em Próxima Etapa');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`📍 Após Próxima Etapa - URL: ${page.url()}`);
      await page.screenshot({ path: `debug-etapa-2-${Date.now()}.png`, fullPage: true });
      
      // 5. ANALISAR PÁGINA ATUAL
      console.log('\n🔍 Analisando página atual...');
      
      const analise = await page.evaluate(() => {
        const url = window.location.href;
        const title = document.title;
        
        // Procurar por elementos que indiquem tipos de briefing
        const elementos = Array.from(document.querySelectorAll('*'));
        const textos = elementos.map(el => el.textContent?.trim()).filter(texto => 
          texto && 
          texto.length > 3 && 
          texto.length < 100 &&
          (texto.toLowerCase().includes('residencial') ||
           texto.toLowerCase().includes('comercial') ||
           texto.toLowerCase().includes('industrial') ||
           texto.toLowerCase().includes('briefing') ||
           texto.toLowerCase().includes('tipo') ||
           texto.toLowerCase().includes('categoria'))
        );
        
        // Procurar por cards, botões ou links clicáveis
        const clickables = Array.from(document.querySelectorAll('button, .card, [class*="card"], a, [role="button"]'))
          .map(el => ({
            tagName: el.tagName,
            text: el.textContent?.trim(),
            className: el.className,
            href: el.href || '',
            clickable: true
          }))
          .filter(el => el.text && el.text.length > 2 && el.text.length < 50);
        
        return {
          url,
          title,
          textosRelevantes: [...new Set(textos)].slice(0, 10),
          elementosClicaveis: clickables.slice(0, 15)
        };
      });
      
      console.log(`📄 Título: ${analise.title}`);
      console.log(`🔗 URL: ${analise.url}`);
      
      console.log('\n📝 Textos relevantes encontrados:');
      analise.textosRelevantes.forEach((texto, i) => {
        console.log(`   ${i+1}. "${texto}"`);
      });
      
      console.log('\n🔘 Elementos clicáveis encontrados:');
      analise.elementosClicaveis.forEach((el, i) => {
        console.log(`   ${i+1}. ${el.tagName} - "${el.text}" - Class: "${el.className}"`);
      });
      
      // 6. TENTAR CLICAR EM ALGO RELACIONADO A RESIDENCIAL
      console.log('\n🏠 Tentando encontrar opção residencial...');
      
      const residencialClicado = await page.evaluate(() => {
        const elementos = Array.from(document.querySelectorAll('button, .card, [class*="card"], a, [role="button"]'));
        
        // Procurar por elementos que contenham palavras relacionadas a residencial
        const palavrasChave = ['residencial', 'casa', 'apartamento', 'moradia', 'habitação'];
        
        for (const palavra of palavrasChave) {
          const elemento = elementos.find(el => 
            el.textContent?.toLowerCase().includes(palavra)
          );
          
          if (elemento) {
            elemento.click();
            return { sucesso: true, texto: elemento.textContent?.trim(), palavra };
          }
        }
        
        return { sucesso: false };
      });
      
      if (residencialClicado.sucesso) {
        console.log(`✅ Clicou em elemento residencial: "${residencialClicado.texto}"`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log(`📍 Após clicar residencial - URL: ${page.url()}`);
        await page.screenshot({ path: `debug-etapa-3-${Date.now()}.png`, fullPage: true });
        
        // 7. ANALISAR PÁGINA DE PERGUNTAS
        console.log('\n📋 Analisando página de perguntas...');
        
        const perguntas = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
          return inputs.map(input => ({
            type: input.type || input.tagName.toLowerCase(),
            placeholder: input.placeholder || '',
            name: input.name || '',
            id: input.id || '',
            visible: input.offsetParent !== null
          })).filter(input => input.visible && !input.placeholder.toLowerCase().includes('buscar'));
        });
        
        console.log(`📝 Perguntas encontradas: ${perguntas.length}`);
        perguntas.forEach((pergunta, i) => {
          console.log(`   ${i+1}. ${pergunta.type} - "${pergunta.placeholder}"`);
        });
        
      } else {
        console.log('⚠️ Não encontrou opção residencial');
      }
      
    } else {
      console.log('❌ Não encontrou botão Próxima Etapa');
    }
    
    // 8. AGUARDAR PARA INSPEÇÃO MANUAL
    console.log('\n⏳ Aguardando 30 segundos para inspeção manual...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ Erro durante debug:', error);
    await page.screenshot({ path: `debug-erro-${Date.now()}.png`, fullPage: true });
  } finally {
    await browser.close();
    console.log('🔚 Debug finalizado');
  }
}

// Executar
if (require.main === module) {
  debugBriefingUrls();
}

module.exports = { debugBriefingUrls };