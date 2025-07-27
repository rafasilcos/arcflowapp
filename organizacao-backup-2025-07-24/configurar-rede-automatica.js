const os = require('os');
const fs = require('fs');
const path = require('path');

// 🌐 CONFIGURADOR AUTOMÁTICO DE REDE LOCAL - ARCFLOW
// Este script detecta automaticamente o IP da máquina e configura
// tanto o frontend quanto o backend para funcionar em rede local

console.log('🚀 Iniciando configuração automática de rede local...');

// Função para detectar IP da rede local
function detectarIPLocal() {
  const interfaces = os.networkInterfaces();
  
  // Prioridade: Wi-Fi -> Ethernet -> Outras
  const prioridade = ['Wi-Fi', 'Ethernet', 'en0', 'eth0', 'wlan0'];
  
  let ipsEncontrados = [];
  
  for (let interfaceName of prioridade) {
    const networkInterface = interfaces[interfaceName];
    if (networkInterface) {
      for (let details of networkInterface) {
        if (details.family === 'IPv4' && !details.internal) {
          ipsEncontrados.push({
            interface: interfaceName,
            ip: details.address,
            prioridade: prioridade.indexOf(interfaceName)
          });
        }
      }
    }
  }
  
  // Se não encontrou nas interfaces prioritárias, buscar em todas
  if (ipsEncontrados.length === 0) {
    for (let interfaceName in interfaces) {
      const networkInterface = interfaces[interfaceName];
      for (let details of networkInterface) {
        if (details.family === 'IPv4' && !details.internal) {
          ipsEncontrados.push({
            interface: interfaceName,
            ip: details.address,
            prioridade: 999
          });
        }
      }
    }
  }
  
  // Ordenar por prioridade e retornar o melhor
  ipsEncontrados.sort((a, b) => a.prioridade - b.prioridade);
  
  return ipsEncontrados.length > 0 ? ipsEncontrados[0] : null;
}

// Função para obter informações da rede
function obterInformacoesRede() {
  const ipInfo = detectarIPLocal();
  
  if (!ipInfo) {
    console.error('❌ Não foi possível detectar o IP da rede local');
    return null;
  }
  
  const ip = ipInfo.ip;
  const subnet = ip.split('.').slice(0, 3).join('.'); // Ex: 192.168.0
  
  return {
    ip: ip,
    interface: ipInfo.interface,
    subnet: subnet,
    range: `${subnet}.0/24`,
    frontendUrl: `http://${ip}:3000`,
    backendUrl: `http://${ip}:3001`,
    corsOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      `http://${ip}:3000`,
      `http://${subnet}.*:3000` // Permitir toda a subnet
    ]
  };
}

// Função para gerar configuração do CORS
function gerarConfiguracaoCORS(redeInfo) {
  const corsOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    `http://${redeInfo.ip}:3000`
  ];
  
  // Adicionar toda a subnet para máxima compatibilidade
  for (let i = 1; i <= 254; i++) {
    corsOrigins.push(`http://${redeInfo.subnet}.${i}:3000`);
  }
  
  return corsOrigins;
}

// Função para criar arquivo de configuração
function criarArquivoConfiguracao(redeInfo) {
  const config = {
    timestamp: new Date().toISOString(),
    network: {
      ip: redeInfo.ip,
      interface: redeInfo.interface,
      subnet: redeInfo.subnet,
      range: redeInfo.range
    },
    urls: {
      frontend: redeInfo.frontendUrl,
      backend: redeInfo.backendUrl
    },
    cors: {
      origins: gerarConfiguracaoCORS(redeInfo)
    },
    instructions: {
      frontend: `npm run dev:network`,
      backend: `npm run dev:network`,
      access: `Acesse de qualquer computador da rede: ${redeInfo.frontendUrl}`
    }
  };
  
  fs.writeFileSync('rede-config.json', JSON.stringify(config, null, 2));
  console.log('✅ Arquivo de configuração criado: rede-config.json');
  
  return config;
}

// Função para atualizar package.json do frontend
function atualizarPackageJsonFrontend(redeInfo) {
  const frontendPath = path.join(__dirname, 'frontend', 'package.json');
  
  if (!fs.existsSync(frontendPath)) {
    console.error('❌ Arquivo package.json do frontend não encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(frontendPath, 'utf8'));
  
  // Adicionar novos scripts mantendo os existentes
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev:network': `next dev -H 0.0.0.0 -p 3000`,
    'dev:network-info': `echo "Frontend rodando em: http://${redeInfo.ip}:3000" && npm run dev:network`,
    'start:network': `next start -H 0.0.0.0 -p 3000`
  };
  
  fs.writeFileSync(frontendPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json do frontend atualizado com scripts de rede');
  
  return true;
}

// Função para atualizar package.json do backend
function atualizarPackageJsonBackend(redeInfo) {
  const backendPath = path.join(__dirname, 'backend', 'package.json');
  
  if (!fs.existsSync(backendPath)) {
    console.error('❌ Arquivo package.json do backend não encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(backendPath, 'utf8'));
  
  // Adicionar novos scripts mantendo os existentes
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev:network': `node server-rede-local.js`,
    'dev:network-info': `echo "Backend rodando em: http://${redeInfo.ip}:3001" && npm run dev:network`,
    'start:network': `node server-rede-local.js`
  };
  
  fs.writeFileSync(backendPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json do backend atualizado com scripts de rede');
  
  return true;
}

// Função para criar servidor de rede local
function criarServidorRedeLocal(redeInfo) {
  const serverContent = `// 🌐 SERVIDOR ARCFLOW - CONFIGURAÇÃO REDE LOCAL
// Baseado no server-simple.js original
// Configurado automaticamente para IP: ${redeInfo.ip}

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

console.log('🌐 Iniciando ArcFlow Backend para Rede Local...');
console.log('📡 IP detectado:', '${redeInfo.ip}');
console.log('🌍 Subnet:', '${redeInfo.subnet}.0/24');

// Importar configurações do servidor original
const originalServer = require('./server-simple.js');

// Configuração CORS para rede local
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sem origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://${redeInfo.ip}:3000',
      // Permitir toda a subnet
      /^http:\\/\\/${redeInfo.subnet.replace(/\./g, '\\.')}\\.[0-9]{1,3}:3000$/
    ];
    
    // Verificar se a origem é permitida
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return pattern === origin;
      } else if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ Origem não permitida:', origin);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Exibir informações de rede
console.log('\\n🌐 === INFORMAÇÕES DE REDE ===');
console.log('🖥️  IP da máquina:', '${redeInfo.ip}');
console.log('📡 Interface:', '${redeInfo.interface}');
console.log('🌍 Subnet:', '${redeInfo.subnet}.0/24');
console.log('🚀 Backend:', 'http://${redeInfo.ip}:3001');
console.log('🎨 Frontend:', 'http://${redeInfo.ip}:3000');
console.log('================================\\n');

console.log('✅ Servidor configurado para rede local!');
console.log('📱 Outros computadores da rede podem acessar em:');
console.log('   Frontend: http://${redeInfo.ip}:3000');
console.log('   Backend:  http://${redeInfo.ip}:3001');
`;

  const serverPath = path.join(__dirname, 'backend', 'server-rede-local.js');
  fs.writeFileSync(serverPath, serverContent);
  console.log('✅ Servidor de rede local criado: backend/server-rede-local.js');
  
  return true;
}

// Função principal
function main() {
  console.log('🔍 Detectando configuração de rede...');
  
  const redeInfo = obterInformacoesRede();
  
  if (!redeInfo) {
    console.error('❌ Falha ao detectar informações de rede');
    process.exit(1);
  }
  
  console.log('\\n🌐 === REDE DETECTADA ===');
  console.log('🖥️  IP:', redeInfo.ip);
  console.log('📡 Interface:', redeInfo.interface);
  console.log('🌍 Subnet:', redeInfo.subnet);
  console.log('========================\\n');
  
  // Criar configurações
  const config = criarArquivoConfiguracao(redeInfo);
  
  // Atualizar package.json
  const frontendOk = atualizarPackageJsonFrontend(redeInfo);
  const backendOk = atualizarPackageJsonBackend(redeInfo);
  
  // Criar servidor de rede local
  const serverOk = criarServidorRedeLocal(redeInfo);
  
  if (frontendOk && backendOk && serverOk) {
    console.log('\\n🎉 === CONFIGURAÇÃO COMPLETA ===');
    console.log('✅ Sistema configurado para rede local!');
    console.log('\\n📋 COMO USAR:');
    console.log('\\n1. 🚀 Iniciar Backend:');
    console.log('   cd backend && npm run dev:network');
    console.log('\\n2. 🎨 Iniciar Frontend:');
    console.log('   cd frontend && npm run dev:network');
    console.log('\\n3. 🌐 Acessar de qualquer computador:');
    console.log('   ' + redeInfo.frontendUrl);
    console.log('\\n⚠️  IMPORTANTE:');
    console.log('   - Firewall deve permitir portas 3000 e 3001');
    console.log('   - Todos os computadores devem estar na mesma rede');
    console.log('   - Scripts originais (dev) continuam funcionando para localhost');
    console.log('\\n🔧 Configuração salva em: rede-config.json');
  } else {
    console.error('❌ Falha na configuração. Verifique os erros acima.');
    process.exit(1);
  }
}

// Executar configuração
main(); 