/**
 * DEBUG DO FLUXO DE LOGIN - ARCFLOW
 * 
 * Script para debugar o processo de login e verificar
 * onde está ocorrendo o problema de redirecionamento.
 */

const puppeteer = require('puppeteer');

async function debugLogin() {
  console.log('🔍 INICIANDO DEBUG DO LOGIN');
  console.log('=' .repeat(50));
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    // 1. NAVEGAR PARA LOGIN
    console.log('🔐 Navegando para página de login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    
    console.log(`📍 URL após navegar: ${page.url()}`);
    
    // Capturar screenshot da página de login
    await page.screenshot({ path: `debug-login-1-${Date.now()}.png` });
    
    // 2. VERIFICAR ELEMENTOS DE LOGIN
    console.log('🔍 Verificando elementos de login...');
    
    const elementos = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitButton = document.querySelector('button[type="submit"]');
      
      return {
        emailInput: emailInput ? {
          placeholder: emailInput.placeholder,
          name: emailInput.name,
          id: emailInput.id
        } : null,
        passwordInput: passwordInput ? {
          placeholder: passwordInput.placeholder,
          name: passwordInput.name,
          id: passwordInput.id
        } : null,
        submitButton: submitButton ? {
          text: submitButton.textContent?.trim(),
          disabled: submitButton.disabled
        } : null
      };
    });
    
    console.log('📧 Campo email:', elementos.emailInput);
    console.log('🔒 Campo senha:', elementos.passwordInput);
    console.log('🔘 Botão submit:', elementos.submitButton);
    
    if (!elementos.emailInput || !elementos.passwordInput || !elementos.submitButton) {
      throw new Error('Elementos de login não encontrados');
    }
    
    // 3. PREENCHER CREDENCIAIS
    console.log('📝 Preenchendo credenciais...');
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'admin@arcflow.com', { delay: 100 });
    
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', '123456', { delay: 100 });
    
    // Verificar se foi preenchido
    const credenciaisPreenchidas = await page.evaluate(() => {
      const email = document.querySelector('input[type="email"]').value;
      const senha = document.querySelector('input[type="password"]').value;
      return { email, senha };
    });
    
    console.log('✅ Credenciais preenchidas:', credenciaisPreenchidas);
    
    // Capturar screenshot antes do submit
    await page.screenshot({ path: `debug-login-2-preenchido-${Date.now()}.png` });
    
    // 4. FAZER LOGIN
    console.log('🚀 Fazendo login...');
    
    // Interceptar requisições de rede
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    await page.click('button[type="submit"]');
    
    // Aguardar um pouco para ver o que acontece
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`📍 URL após submit: ${page.url()}`);
    
    // Capturar screenshot após submit
    await page.screenshot({ path: `debug-login-3-apos-submit-${Date.now()}.png` });
    
    // 5. VERIFICAR RESPOSTAS DA REDE
    console.log('\n🌐 RESPOSTAS DA REDE:');
    responses.forEach((response, index) => {
      console.log(`${index + 1}. ${response.status} - ${response.url}`);
    });
    
    // 6. VERIFICAR SE HOUVE REDIRECIONAMENTO
    if (page.url().includes('/auth/login')) {
      console.log('⚠️ Ainda na página de login - verificando erros...');
      
      // Procurar mensagens de erro
      const erros = await page.evaluate(() => {
        const errorElements = Array.from(document.querySelectorAll('[class*="error"], [class*="alert"], .text-red-500, .text-red-600'));
        return errorElements.map(el => el.textContent?.trim()).filter(Boolean);
      });
      
      if (erros.length > 0) {
        console.log('❌ Erros encontrados:', erros);
      } else {
        console.log('🤔 Nenhum erro visível encontrado');
      }
      
      // Verificar se o botão está desabilitado
      const botaoStatus = await page.evaluate(() => {
        const button = document.querySelector('button[type="submit"]');
        return {
          disabled: button?.disabled,
          text: button?.textContent?.trim()
        };
      });
      
      console.log('🔘 Status do botão:', botaoStatus);
      
    } else {
      console.log('✅ Redirecionamento bem-sucedido!');
      
      // Aguardar navegação completa
      try {
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
      } catch (e) {
        console.log('⚠️ Timeout na navegação, mas pode estar OK');
      }
      
      console.log(`📍 URL final: ${page.url()}`);
      
      // Capturar screenshot da página após login
      await page.screenshot({ path: `debug-login-4-sucesso-${Date.now()}.png` });
      
      // 7. TENTAR NAVEGAR PARA BRIEFING
      console.log('🧭 Tentando navegar para /briefing/novo...');
      
      await page.goto('http://localhost:3000/briefing/novo', { waitUntil: 'networkidle2' });
      
      console.log(`📍 URL após navegar para briefing: ${page.url()}`);
      
      // Capturar screenshot da página de briefing
      await page.screenshot({ path: `debug-login-5-briefing-${Date.now()}.png` });
      
      if (page.url().includes('/briefing/novo')) {
        console.log('🎉 SUCESSO! Conseguiu acessar a página de briefing');
        
        // Verificar se há campos na página
        const campos = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input'));
          return inputs.map(input => ({
            type: input.type,
            placeholder: input.placeholder,
            visible: input.offsetParent !== null
          }));
        });
        
        console.log('📝 Campos encontrados na página de briefing:');
        campos.forEach((campo, i) => {
          console.log(`   ${i+1}. ${campo.type} - "${campo.placeholder}" - Visível: ${campo.visible}`);
        });
        
      } else {
        console.log('❌ Não conseguiu acessar a página de briefing');
      }
    }
    
    // 8. AGUARDAR PARA INSPEÇÃO MANUAL
    console.log('\n⏳ Aguardando 20 segundos para inspeção manual...');
    await new Promise(resolve => setTimeout(resolve, 20000));
    
  } catch (error) {
    console.error('❌ Erro durante debug:', error);
    
    // Capturar screenshot do erro
    await page.screenshot({ 
      path: `debug-login-erro-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
    console.log('🔚 Debug finalizado');
  }
}

// Executar
if (require.main === module) {
  debugLogin();
}

module.exports = { debugLogin };