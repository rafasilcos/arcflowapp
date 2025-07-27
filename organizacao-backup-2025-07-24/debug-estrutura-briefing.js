/**
 * DEBUG AVANÇADO - ESTRUTURA REAL DA PÁGINA DE BRIEFING
 * 
 * Este script faz login e analisa a estrutura completa da página
 * /briefing/novo para identificar os seletores corretos.
 */

const puppeteer = require('puppeteer');

async function debugEstruturaBriefing() {
  console.log('🔍 INICIANDO DEBUG AVANÇADO DA ESTRUTURA');
  console.log('=' .repeat(60));
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    // 1. FAZER LOGIN
    console.log('🔐 Fazendo login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'admin@arcflow.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Login realizado');

    // 2. NAVEGAR PARA BRIEFING
    console.log('🧭 Navegando para /briefing/novo...');
    await page.goto('http://localhost:3000/briefing/novo', { waitUntil: 'networkidle2' });
    
    // Aguardar página carregar completamente
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. CAPTURAR SCREENSHOT
    console.log('📸 Capturando screenshot...');
    await page.screenshot({ 
      path: `debug-briefing-estrutura-${Date.now()}.png`,
      fullPage: true 
    });

    // 4. ANALISAR TODOS OS INPUTS
    console.log('\n📝 ANALISANDO TODOS OS INPUTS:');
    const inputs = await page.evaluate(() => {
      const elementos = Array.from(document.querySelectorAll('input'));
      return elementos.map(input => ({
        type: input.type,
        placeholder: input.placeholder,
        name: input.name,
        id: input.id,
        className: input.className,
        value: input.value,
        required: input.required,
        outerHTML: input.outerHTML.substring(0, 200) + '...'
      }));
    });

    inputs.forEach((input, index) => {
      console.log(`\nINPUT ${index + 1}:`);
      console.log(`  Type: ${input.type}`);
      console.log(`  Placeholder: "${input.placeholder}"`);
      console.log(`  Name: "${input.name}"`);
      console.log(`  ID: "${input.id}"`);
      console.log(`  Class: "${input.className}"`);
      console.log(`  Required: ${input.required}`);
      console.log(`  HTML: ${input.outerHTML}`);
    });

    // 5. ANALISAR TODOS OS TEXTAREAS
    console.log('\n📄 ANALISANDO TODOS OS TEXTAREAS:');
    const textareas = await page.evaluate(() => {
      const elementos = Array.from(document.querySelectorAll('textarea'));
      return elementos.map(textarea => ({
        placeholder: textarea.placeholder,
        name: textarea.name,
        id: textarea.id,
        className: textarea.className,
        rows: textarea.rows,
        cols: textarea.cols,
        outerHTML: textarea.outerHTML.substring(0, 200) + '...'
      }));
    });

    textareas.forEach((textarea, index) => {
      console.log(`\nTEXTAREA ${index + 1}:`);
      console.log(`  Placeholder: "${textarea.placeholder}"`);
      console.log(`  Name: "${textarea.name}"`);
      console.log(`  ID: "${textarea.id}"`);
      console.log(`  Class: "${textarea.className}"`);
      console.log(`  HTML: ${textarea.outerHTML}`);
    });

    // 6. ANALISAR TODOS OS BOTÕES
    console.log('\n🔘 ANALISANDO TODOS OS BOTÕES:');
    const botoes = await page.evaluate(() => {
      const elementos = Array.from(document.querySelectorAll('button'));
      return elementos.map(button => ({
        text: button.textContent?.trim(),
        type: button.type,
        className: button.className,
        disabled: button.disabled,
        outerHTML: button.outerHTML.substring(0, 200) + '...'
      }));
    });

    botoes.forEach((botao, index) => {
      console.log(`\nBOTÃO ${index + 1}:`);
      console.log(`  Texto: "${botao.text}"`);
      console.log(`  Type: ${botao.type}`);
      console.log(`  Class: "${botao.className}"`);
      console.log(`  Disabled: ${botao.disabled}`);
      console.log(`  HTML: ${botao.outerHTML}`);
    });

    // 7. ANALISAR SELECTS E DROPDOWNS
    console.log('\n📋 ANALISANDO SELECTS E DROPDOWNS:');
    const selects = await page.evaluate(() => {
      const elementos = Array.from(document.querySelectorAll('select, [role="combobox"], [role="listbox"]'));
      return elementos.map(select => ({
        tagName: select.tagName,
        role: select.getAttribute('role'),
        className: select.className,
        id: select.id,
        name: select.name,
        outerHTML: select.outerHTML.substring(0, 200) + '...'
      }));
    });

    selects.forEach((select, index) => {
      console.log(`\nSELECT/DROPDOWN ${index + 1}:`);
      console.log(`  Tag: ${select.tagName}`);
      console.log(`  Role: ${select.role}`);
      console.log(`  Class: "${select.className}"`);
      console.log(`  ID: "${select.id}"`);
      console.log(`  Name: "${select.name}"`);
      console.log(`  HTML: ${select.outerHTML}`);
    });

    // 8. ANALISAR ESTRUTURA GERAL
    console.log('\n🏗️ ANALISANDO ESTRUTURA GERAL:');
    const estrutura = await page.evaluate(() => {
      const body = document.body;
      const forms = Array.from(document.querySelectorAll('form'));
      const divs = Array.from(document.querySelectorAll('div[class*="form"], div[class*="input"], div[class*="field"]'));
      
      return {
        title: document.title,
        url: window.location.href,
        formsCount: forms.length,
        formsInfo: forms.map(form => ({
          action: form.action,
          method: form.method,
          className: form.className,
          id: form.id
        })),
        relevantDivs: divs.slice(0, 10).map(div => ({
          className: div.className,
          id: div.id,
          innerHTML: div.innerHTML.substring(0, 100) + '...'
        }))
      };
    });

    console.log(`Título da página: ${estrutura.title}`);
    console.log(`URL atual: ${estrutura.url}`);
    console.log(`Número de forms: ${estrutura.formsCount}`);
    
    estrutura.formsInfo.forEach((form, index) => {
      console.log(`\nFORM ${index + 1}:`);
      console.log(`  Action: ${form.action}`);
      console.log(`  Method: ${form.method}`);
      console.log(`  Class: "${form.className}"`);
      console.log(`  ID: "${form.id}"`);
    });

    // 9. TENTAR ENCONTRAR CAMPOS ESPECÍFICOS
    console.log('\n🎯 TESTANDO SELETORES ESPECÍFICOS:');
    
    const seletoresParaTestar = [
      'input[placeholder*="Nome"]',
      'input[placeholder*="nome"]',
      'input[placeholder*="Projeto"]',
      'input[placeholder*="projeto"]',
      'input[name*="nome"]',
      'input[name*="project"]',
      'input[id*="nome"]',
      'input[id*="project"]',
      '[data-testid*="nome"]',
      '[data-testid*="project"]'
    ];

    for (const seletor of seletoresParaTestar) {
      try {
        const elemento = await page.$(seletor);
        if (elemento) {
          const info = await page.evaluate((el) => ({
            tagName: el.tagName,
            type: el.type,
            placeholder: el.placeholder,
            name: el.name,
            id: el.id,
            className: el.className
          }), elemento);
          
          console.log(`✅ ENCONTRADO: ${seletor}`);
          console.log(`   ${JSON.stringify(info, null, 2)}`);
        } else {
          console.log(`❌ NÃO ENCONTRADO: ${seletor}`);
        }
      } catch (e) {
        console.log(`❌ ERRO ao testar: ${seletor} - ${e.message}`);
      }
    }

    // 10. AGUARDAR PARA INSPEÇÃO MANUAL
    console.log('\n⏳ Aguardando 30 segundos para inspeção manual...');
    console.log('💡 Use este tempo para inspecionar a página no navegador!');
    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    console.error('❌ Erro durante debug:', error);
    
    // Capturar screenshot do erro
    await page.screenshot({ 
      path: `erro-debug-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
    console.log('🔚 Debug finalizado');
  }
}

// Executar
if (require.main === module) {
  debugEstruturaBriefing();
}

module.exports = { debugEstruturaBriefing };