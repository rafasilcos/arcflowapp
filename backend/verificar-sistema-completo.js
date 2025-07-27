
const axios = require('axios');
const { execSync } = require('child_process');

// URLs críticas do sistema
const URLS_CRITICAS = {
  backend: 'http://localhost:3001',
  frontend: 'http://localhost:3000',
  apis: {
    authStatus: 'http://localhost:3001/api/auth/status',
    clientes: 'http://localhost:3001/api/clientes',
    login: 'http://localhost:3001/api/auth/login'
  }
};

// Credenciais de teste
const CREDENCIAIS_TESTE = {
  email: 'rafael@teste.com',
  password: '123456'
};

class VerificadorSistema {
  constructor() {
    this.erros = [];
    this.sucessos = [];
  }

  log(tipo, mensagem, detalhes = null) {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = tipo === 'sucesso' ? '✅' : tipo === 'erro' ? '❌' : '🔍';
    
    console.log(`${emoji} [${timestamp}] ${mensagem}`);
    if (detalhes) {
      console.log(`   📋 ${detalhes}`);
    }

    if (tipo === 'sucesso') {
      this.sucessos.push(mensagem);
    } else if (tipo === 'erro') {
      this.erros.push(mensagem);
    }
  }

  async verificarServidor(url, nome) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      this.log('sucesso', `${nome} está respondendo`, `Status: ${response.status}`);
      return true;
    } catch (error) {
      this.log('erro', `${nome} não está respondendo`, error.message);
      return false;
    }
  }

  async verificarAPI(url, nome, metodo = 'GET', dados = null) {
    try {
      let response;
      if (metodo === 'POST') {
        response = await axios.post(url, dados, { timeout: 5000 });
      } else {
        response = await axios.get(url, { timeout: 5000 });
      }
      
      this.log('sucesso', `API ${nome} funcionando`, `Status: ${response.status}`);
      return response.data;
    } catch (error) {
      this.log('erro', `API ${nome} com problema`, error.response?.data?.error || error.message);
      return null;
    }
  }

  async verificarLogin() {
    this.log('info', 'Testando sistema de login...');
    
    const loginData = await this.verificarAPI(
      URLS_CRITICAS.apis.login,
      'Login',
      'POST',
      CREDENCIAIS_TESTE
    );

    if (loginData && loginData.tokens) {
      this.log('sucesso', 'Login funcionando', `Usuário: ${loginData.user.nome}`);
      return loginData.tokens.accessToken;
    }
    
    return null;
  }

  async verificarClientes(token = null) {
    this.log('info', 'Testando API de clientes...');
    
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    try {
      const response = await axios.get(URLS_CRITICAS.apis.clientes, { 
        headers,
        timeout: 5000 
      });
      
      this.log('sucesso', 'API Clientes funcionando', `${response.data.data?.length || 0} clientes encontrados`);
      return true;
    } catch (error) {
      this.log('erro', 'API Clientes com problema', error.response?.data?.error || error.message);
      return false;
    }
  }

  async verificarPaginasFrontend() {
    this.log('info', 'Verificando páginas do frontend...');
    
    const paginas = [
      { url: `${URLS_CRITICAS.frontend}/auth/login`, nome: 'Login' },
      { url: `${URLS_CRITICAS.frontend}/comercial/clientes`, nome: 'Clientes' },
      { url: `${URLS_CRITICAS.frontend}/dashboard`, nome: 'Dashboard' }
    ];

    for (const pagina of paginas) {
      try {
        const response = await axios.get(pagina.url, { 
          timeout: 10000,
          validateStatus: (status) => status < 500 // Aceitar redirects
        });
        
        this.log('sucesso', `Página ${pagina.nome} acessível`, `Status: ${response.status}`);
      } catch (error) {
        this.log('erro', `Página ${pagina.nome} inacessível`, error.message);
      }
    }
  }

  async executarVerificacaoCompleta() {
    console.log('🚀 INICIANDO VERIFICAÇÃO COMPLETA DO SISTEMA ARCFLOW');
    console.log('=' .repeat(60));

    // 1. Verificar servidores básicos
    this.log('info', 'Verificando servidores...');
    const backendOK = await this.verificarServidor(`${URLS_CRITICAS.backend}/health`, 'Backend');
    
    if (!backendOK) {
      this.log('erro', 'Backend não está rodando!', 'Execute: cd backend && npm run dev');
      return this.gerarRelatorio();
    }

    // 2. Verificar APIs críticas
    this.log('info', 'Verificando APIs críticas...');
    await this.verificarAPI(URLS_CRITICAS.apis.authStatus, 'Auth Status');
    
    // 3. Testar login
    const token = await this.verificarLogin();
    
    // 4. Testar clientes
    await this.verificarClientes(token);
    
    // 5. Verificar páginas frontend (se frontend estiver rodando)
    try {
      await this.verificarServidor(URLS_CRITICAS.frontend, 'Frontend');
      await this.verificarPaginasFrontend();
    } catch (error) {
      this.log('erro', 'Frontend não está rodando', 'Execute: cd frontend && npm run dev');
    }

    return this.gerarRelatorio();
  }

  gerarRelatorio() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RELATÓRIO FINAL DA VERIFICAÇÃO');
    console.log('=' .repeat(60));

    console.log(`\n✅ SUCESSOS: ${this.sucessos.length}`);
    this.sucessos.forEach((sucesso, index) => {
      console.log(`   ${index + 1}. ${sucesso}`);
    });

    console.log(`\n❌ ERROS: ${this.erros.length}`);
    this.erros.forEach((erro, index) => {
      console.log(`   ${index + 1}. ${erro}`);
    });

    const status = this.erros.length === 0 ? 'SISTEMA OK' : 'SISTEMA COM PROBLEMAS';
    const emoji = this.erros.length === 0 ? '🎉' : '⚠️';
    
    console.log(`\n${emoji} STATUS GERAL: ${status}`);
    
    if (this.erros.length === 0) {
      console.log('\n🎯 TODAS AS FUNCIONALIDADES CRÍTICAS ESTÃO FUNCIONANDO!');
    } else {
      console.log('\n🔧 AÇÕES NECESSÁRIAS:');
      console.log('   1. Verificar servidores (backend/frontend)');
      console.log('   2. Verificar logs de erro');
      console.log('   3. Testar manualmente as URLs que falharam');
    }

    console.log('\n📋 URLS PARA TESTE MANUAL:');
    console.log('   Backend: http://localhost:3001/health');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Login: http://localhost:3000/auth/login');
    console.log('   Clientes: http://localhost:3000/comercial/clientes');
    console.log('   API Auth: http://localhost:3001/api/auth/status');

    return this.erros.length === 0;
  }
}

// Executar verificação
async function main() {
  const verificador = new VerificadorSistema();
  
  try {
    const sistemaOK = await verificador.executarVerificacaoCompleta();
    process.exit(sistemaOK ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message);
    process.exit(1);
  }
}

// Instalar axios se necessário
try {
  require('axios');
} catch (error) {
  console.log('📦 Instalando axios...');
  execSync('npm install axios', { stdio: 'inherit' });
}

main(); 