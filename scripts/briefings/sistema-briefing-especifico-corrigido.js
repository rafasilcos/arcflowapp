/**
 * SISTEMA ESPECÍFICO PARA PREENCHIMENTO DE BRIEFINGS - ARCFLOW
 * 
 * Sistema adaptado especificamente para a estrutura real da página
 * /briefing/novo do ArcFlow baseado na análise realizada.
 * 
 * Versão: 1.1 - Corrigida
 * Data: 24/07/2025
 */

const puppeteer = require('puppeteer');

class SistemaBriefingEspecifico {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async inicializar() {
    console.log('🚀 Inicializando sistema específico para ArcFlow');
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1366, height: 768 }
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('✅ Sistema inicializado');
  }

  async fazerLogin(email, senha) {
    console.log('🔐 Fazendo login...');
    
    await this.page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    
    await this.page.waitForSelector('input[type="email"]');
    await this.page.type('input[type="email"]', email);
    await this.page.type('input[type="password"]', senha);
    await this.page.click('button[type="submit"]');
    
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Login realizado');
  }

  async navegarParaBriefing() {
    console.log('🧭 Navegando para página de briefing...');
    
    await this.page.goto('http://localhost:3000/briefing/novo', { waitUntil: 'networkidle2' });
    
    // Aguardar página carregar completamente
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Aguardar elementos específicos encontrados na análise
    try {
      await this.page.waitForSelector('input[placeholder*="Nome"]', { timeout: 15000 });
      console.log('✅ Campo Nome do Projeto encontrado');
    } catch (error) {
      console.log('⚠️ Tentando seletores alternativos...');
      
      // Tentar seletores alternativos
      const seletoresAlternativos = [
        'input[placeholder="Nome do Projeto *"]',
        'input[placeholder*="Projeto"]',
        'input[type="text"]'
      ];
      
      let encontrado = false;
      for (const seletor of seletoresAlternativos) {
        try {
          await this.page.waitForSelector(seletor, { timeout: 5000 });
          console.log(`✅ Encontrado com seletor: ${seletor}`);
          encontrado = true;
          break;
        } catch (e) {
          console.log(`❌ Falhou: ${seletor}`);
        }
      }
      
      if (!encontrado) {
        throw new Error('Nenhum campo de entrada encontrado na página');
      }
    }
    
    console.log('✅ Página de briefing carregada');
  }

  async preencherBriefing(dados) {
    console.log('📝 Preenchendo briefing...');
    
    try {
      // 1. Preencher Nome do Projeto
      console.log('📝 Preenchendo nome do projeto...');
      const campoNome = await this.page.$('input[placeholder="Nome do Projeto *"]');
      if (campoNome) {
        await campoNome.click();
        await campoNome.evaluate(el => el.value = '');
        await campoNome.type(dados.nomeProjeto || 'TESTE AUTOMÁTICO - Residência Silva', { delay: 50 });
        console.log('✅ Nome do projeto preenchido');
      }

      // 2. Preencher Prazo
      console.log('📅 Preenchendo prazo...');
      const campoPrazo = await this.page.$('input[placeholder="Prazo estimado (ex: 3 meses)"]');
      if (campoPrazo) {
        await campoPrazo.click();
        await campoPrazo.evaluate(el => el.value = '');
        await campoPrazo.type(dados.prazo || '6 meses', { delay: 50 });
        console.log('✅ Prazo preenchido');
      }

      // 3. Preencher Orçamento
      console.log('💰 Preenchendo orçamento...');
      const campoOrcamento = await this.page.$('input[placeholder="Orçamento previsto (ex: R$ 50.000)"]');
      if (campoOrcamento) {
        await campoOrcamento.click();
        await campoOrcamento.evaluate(el => el.value = '');
        await campoOrcamento.type(dados.orcamento || 'R$ 500.000', { delay: 50 });
        console.log('✅ Orçamento preenchido');
      }

      // 4. Preencher Cliente
      console.log('👤 Preenchendo cliente...');
      const campoCliente = await this.page.$('input[placeholder="Digite o nome ou email do cliente..."]');
      if (campoCliente) {
        await campoCliente.click();
        await campoCliente.evaluate(el => el.value = '');
        await campoCliente.type(dados.clienteNome || 'Ana Paula Silva', { delay: 50 });
        
        // Aguardar um pouco para autocomplete aparecer
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Tentar clicar na primeira opção do autocomplete
        try {
          const primeiraOpcao = await this.page.$('.autocomplete-option:first-child, .dropdown-item:first-child, li:first-child');
          if (primeiraOpcao) {
            await primeiraOpcao.click();
            console.log('✅ Cliente selecionado do autocomplete');
          }
        } catch (e) {
          console.log('⚠️ Autocomplete não encontrado, continuando...');
        }
      }

      // 5. Selecionar Responsável
      console.log('👨‍💼 Selecionando responsável...');
      
      try {
        // Procurar o botão combobox do responsável
        const botaoResponsavel = await this.page.$('button[role="combobox"]');
        if (botaoResponsavel) {
          await botaoResponsavel.click();
          console.log('✅ Clicou no dropdown responsável');
          
          // Aguardar dropdown aparecer
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Tentar selecionar primeira opção disponível
          const opcoes = await this.page.$$('[role="option"], .select-item, [data-value]');
          if (opcoes.length > 0) {
            await opcoes[0].click();
            console.log('✅ Responsável selecionado');
          } else {
            console.log('⚠️ Nenhuma opção encontrada no dropdown');
          }
        } else {
          console.log('⚠️ Botão responsável não encontrado');
        }
      } catch (e) {
        console.log('⚠️ Erro ao selecionar responsável:', e.message);
      }

      // 6. Preencher Textarea (se houver)
      console.log('📄 Preenchendo descrição...');
      const textarea = await this.page.$('textarea[placeholder="Descrição detalhada do projeto (opcional)"]');
      if (textarea) {
        await textarea.click();
        await textarea.type(dados.descricao || 'Briefing preenchido automaticamente pelo sistema ArcFlow. Projeto residencial moderno com foco em funcionalidade e conforto para a família.', { delay: 30 });
        console.log('✅ Descrição preenchida');
      }

      console.log('✅ Todos os campos preenchidos!');

    } catch (error) {
      console.error('❌ Erro ao preencher briefing:', error);
      throw error;
    }
  }

  async avancarEtapa() {
    console.log('➡️ Avançando para próxima etapa...');
    
    try {
      // Procurar botão "Próxima Etapa" usando seletor específico
      const botaoProximo = await this.page.$('button:has-text("Próxima Etapa")');
      
      if (!botaoProximo) {
        // Fallback: procurar usando evaluate
        const botaoEncontrado = await this.page.evaluate(() => {
          const botoes = Array.from(document.querySelectorAll('button'));
          const botao = botoes.find(btn => btn.textContent?.trim() === 'Próxima Etapa');
          if (botao) {
            botao.click();
            return true;
          }
          return false;
        });
        
        if (botaoEncontrado) {
          console.log('✅ Clicou em "Próxima Etapa"');
          await new Promise(resolve => setTimeout(resolve, 3000));
          return true;
        }
      } else {
        await botaoProximo.click();
        console.log('✅ Clicou em "Próxima Etapa"');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
      }
      
      console.log('⚠️ Botão "Próxima Etapa" não encontrado');
      return false;
      
    } catch (error) {
      console.error('❌ Erro ao avançar etapa:', error);
      return false;
    }
  }

  async salvarBriefing() {
    console.log('💾 Tentando salvar briefing...');
    
    try {
      // Procurar botões de salvar usando evaluate
      const botaoSalvar = await this.page.evaluate(() => {
        const botoes = Array.from(document.querySelectorAll('button'));
        const botao = botoes.find(btn => {
          const texto = btn.textContent?.trim().toLowerCase();
          return texto?.includes('salvar') || 
                 texto?.includes('finalizar') || 
                 texto?.includes('concluir') ||
                 texto?.includes('enviar');
        });
        
        if (botao) {
          botao.click();
          return true;
        }
        return false;
      });
      
      if (botaoSalvar) {
        console.log('✅ Clicou em botão de salvar');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
      }
      
      console.log('⚠️ Nenhum botão de salvar encontrado');
      return false;
      
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      return false;
    }
  }

  async executarFluxoCompleto(dados) {
    console.log('🎯 Executando fluxo completo de briefing');
    
    try {
      // 1. Login
      await this.fazerLogin(dados.email, dados.senha);
      
      // 2. Navegar para briefing
      await this.navegarParaBriefing();
      
      // 3. Preencher dados
      await this.preencherBriefing(dados);
      
      // 4. Tentar avançar etapa
      const avancarSucesso = await this.avancarEtapa();
      
      if (avancarSucesso) {
        // Se avançou, pode ter mais etapas
        console.log('📋 Briefing pode ter mais etapas...');
        
        // Aguardar um pouco e tentar salvar
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.salvarBriefing();
      } else {
        // Se não avançou, tentar salvar diretamente
        await this.salvarBriefing();
      }
      
      console.log('🎉 Fluxo completo executado!');
      
      // Aguardar um pouco para ver resultado
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return true;
      
    } catch (error) {
      console.error('❌ Erro no fluxo completo:', error);
      
      // Salvar screenshot do erro
      await this.page.screenshot({ 
        path: `erro-briefing-${Date.now()}.png`,
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

async function executarSistemaEspecifico() {
  const sistema = new SistemaBriefingEspecifico();
  
  // Dados para preenchimento
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
    console.log('🚀 INICIANDO SISTEMA ESPECÍFICO PARA ARCFLOW');
    console.log('=' .repeat(60));
    
    await sistema.inicializar();
    await sistema.executarFluxoCompleto(dados);
    
    console.log('\n🎉 SUCESSO! Briefing preenchido automaticamente!');
    console.log('🔍 Verifique o Supabase para confirmar se foi salvo');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  } finally {
    await sistema.finalizar();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarSistemaEspecifico();
}

module.exports = { SistemaBriefingEspecifico, executarSistemaEspecifico };