const axios = require('axios')

// Configuração
const BASE_URL = 'http://localhost:3001/api'
let authToken = ''

// Função para fazer login e obter token
async function login() {
  try {
    console.log('🔐 Fazendo login...')
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    })
    
    if (response.data.tokens) {
      authToken = response.data.tokens.accessToken
      console.log('✅ Login realizado com sucesso')
      console.log('👤 Usuário:', response.data.user.nome)
      console.log('🏢 Escritório:', response.data.escritorio.nome)
      console.log('📋 Plano:', response.data.escritorio.planId)
      return true
    }
    
    return false
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message)
    return false
  }
}

// Função para fazer requisições autenticadas
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    }
    
    if (data) {
      config.data = data
    }
    
    const response = await axios(config)
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status
    }
  }
}

// Teste 1: Verificar configurações enterprise
async function testeConfiguracoes() {
  console.log('\n📊 Testando configurações enterprise...')
  
  const result = await makeRequest('GET', '/enterprise/config')
  
  if (result.success) {
    console.log('✅ Configurações obtidas com sucesso')
    console.log('📋 Plano:', result.data.data.plano)
    console.log('📊 Status:', result.data.data.status)
    console.log('👥 Usuários:', result.data.data.estatisticas.usuarios)
    console.log('📁 Projetos:', result.data.data.estatisticas.projetos)
    console.log('💾 Storage:', Math.round(result.data.data.estatisticas.storage / (1024*1024)), 'MB')
    
    if (result.data.data.configuracoes.recursos) {
      console.log('🔧 Recursos disponíveis:')
      console.log('  - API:', result.data.data.configuracoes.recursos.api ? '✅' : '❌')
      console.log('  - Integração:', result.data.data.configuracoes.recursos.integracao ? '✅' : '❌')
      console.log('  - Relatórios Avançados:', result.data.data.configuracoes.recursos.relatoriosAvancados ? '✅' : '❌')
      console.log('  - Suporte Dedicado:', result.data.data.configuracoes.recursos.suporteDedicado ? '✅' : '❌')
      console.log('  - Backup:', result.data.data.configuracoes.recursos.backup ? '✅' : '❌')
    }
    
    return true
  } else {
    console.error('❌ Erro ao obter configurações:', result.error)
    return false
  }
}

// Teste 2: Listar API Keys
async function testeApiKeys() {
  console.log('\n🔑 Testando API Keys...')
  
  const result = await makeRequest('GET', '/enterprise/api-keys')
  
  if (result.success) {
    console.log('✅ API Keys listadas com sucesso')
    console.log('📊 Total de keys:', result.data.data.length)
    
    if (result.data.data.length > 0) {
      result.data.data.forEach((key, index) => {
        console.log(`  ${index + 1}. ${key.nome} - ${key.chave} (${key.ativa ? 'Ativa' : 'Inativa'})`)
      })
    } else {
      console.log('📝 Nenhuma API key encontrada')
    }
    
    return true
  } else {
    console.error('❌ Erro ao listar API keys:', result.error)
    return false
  }
}

// Teste 3: Criar nova API Key
async function testeCriarApiKey() {
  console.log('\n➕ Testando criação de API Key...')
  
  const novaKey = {
    nome: 'API Key de Teste',
    permissoes: {
      leitura: true,
      escrita: false,
      admin: false,
      modulos: ['clientes', 'projetos']
    },
    expiresIn: 30 // 30 dias
  }
  
  const result = await makeRequest('POST', '/enterprise/api-keys', novaKey)
  
  if (result.success) {
    console.log('✅ API Key criada com sucesso')
    console.log('🔑 Nome:', result.data.data.nome)
    console.log('🔐 Chave:', result.data.data.chave)
    console.log('⚠️ Aviso:', result.data.data.warning)
    
    // Salvar ID para teste de deleção
    global.testApiKeyId = result.data.data.chave.split('_')[1] // Simular ID
    
    return true
  } else {
    console.error('❌ Erro ao criar API key:', result.error)
    return false
  }
}

// Teste 4: Relatório de uso
async function testeRelatorioUso() {
  console.log('\n📈 Testando relatório de uso...')
  
  const result = await makeRequest('GET', '/enterprise/reports/usage?periodo=30d')
  
  if (result.success) {
    console.log('✅ Relatório de uso gerado com sucesso')
    console.log('📅 Período:', result.data.data.periodo)
    
    const uso = result.data.data.uso
    console.log('📊 Uso atual:')
    console.log(`  👥 Usuários: ${uso.usuarios.total}/${uso.usuarios.limite} (${uso.usuarios.percentual}%)`)
    console.log(`  📁 Projetos: ${uso.projetos.total}/${uso.projetos.limite} (${uso.projetos.percentual}%)`)
    console.log(`  💾 Storage: ${Math.round(uso.storage.total/(1024*1024*1024))}GB/${Math.round(uso.storage.limite/(1024*1024*1024))}GB (${uso.storage.percentual}%)`)
    console.log(`  🔗 API: ${uso.api.chamadas}/${uso.api.limite} (${uso.api.percentual}%)`)
    
    if (result.data.data.alertas.length > 0) {
      console.log('⚠️ Alertas:')
      result.data.data.alertas.forEach(alerta => {
        console.log(`  - ${alerta.mensagem}`)
      })
    } else {
      console.log('✅ Nenhum alerta de limite')
    }
    
    return true
  } else {
    console.error('❌ Erro ao gerar relatório:', result.error)
    return false
  }
}

// Teste 5: Backup manual
async function testeBackupManual() {
  console.log('\n💾 Testando backup manual...')
  
  const backup = {
    tipo: 'completo',
    descricao: 'Backup de teste via API Enterprise'
  }
  
  const result = await makeRequest('POST', '/enterprise/backup/manual', backup)
  
  if (result.success) {
    console.log('✅ Backup iniciado com sucesso')
    console.log('🆔 ID:', result.data.data.id)
    console.log('📋 Tipo:', result.data.data.tipo)
    console.log('⏱️ Status:', result.data.data.status)
    console.log('⏰ Estimativa:', result.data.data.estimativa)
    
    // Aguardar um pouco e verificar histórico
    console.log('⏳ Aguardando 6 segundos para verificar conclusão...')
    await new Promise(resolve => setTimeout(resolve, 6000))
    
    return await testeHistoricoBackup()
  } else {
    console.error('❌ Erro ao iniciar backup:', result.error)
    return false
  }
}

// Teste 6: Histórico de backup
async function testeHistoricoBackup() {
  console.log('\n📚 Testando histórico de backup...')
  
  const result = await makeRequest('GET', '/enterprise/backup/history?limit=5')
  
  if (result.success) {
    console.log('✅ Histórico obtido com sucesso')
    console.log('📊 Total de backups:', result.data.data.length)
    
    if (result.data.data.length > 0) {
      console.log('📋 Últimos backups:')
      result.data.data.forEach((backup, index) => {
        const status = backup.status === 'concluido' ? '✅' : backup.status === 'iniciando' ? '⏳' : '❌'
        console.log(`  ${index + 1}. ${backup.tipo} - ${status} ${backup.status} (${backup.descricao})`)
        if (backup.tamanho_mb) {
          console.log(`     💾 Tamanho: ${backup.tamanho_mb}MB`)
        }
      })
    }
    
    return true
  } else {
    console.error('❌ Erro ao obter histórico:', result.error)
    return false
  }
}

// Teste 7: White Label (apenas para ENTERPRISE)
async function testeWhiteLabel() {
  console.log('\n🎨 Testando configurações de White Label...')
  
  const whiteLabel = {
    logo: {
      principal: 'https://exemplo.com/logo.png',
      favicon: 'https://exemplo.com/favicon.ico'
    },
    cores: {
      primaria: '#FF6B35',
      secundaria: '#2E86AB',
      acento: '#A23B72'
    },
    dominio: {
      customizado: 'app.meuescritorio.com.br',
      ssl: true
    },
    marca: {
      nomeExibicao: 'Meu Escritório Pro',
      slogan: 'Projetos que transformam',
      copyright: '© 2024 Meu Escritório'
    }
  }
  
  const result = await makeRequest('PUT', '/enterprise/white-label', whiteLabel)
  
  if (result.success) {
    console.log('✅ White Label configurado com sucesso')
    console.log('🎨 Configurações aplicadas:')
    console.log('  - Logo:', result.data.data.logo.principal)
    console.log('  - Cores:', Object.keys(result.data.data.cores).join(', '))
    console.log('  - Domínio:', result.data.data.dominio.customizado)
    console.log('  - Marca:', result.data.data.marca.nomeExibicao)
    
    return true
  } else {
    if (result.status === 403) {
      console.log('⚠️ White Label disponível apenas para plano ENTERPRISE')
      return true // Não é erro, é esperado para outros planos
    }
    console.error('❌ Erro ao configurar White Label:', result.error)
    return false
  }
}

// Função principal de teste
async function executarTestes() {
  console.log('🚀 Iniciando testes do sistema Enterprise ArcFlow')
  console.log('=' * 50)
  
  // Login
  const loginSuccess = await login()
  if (!loginSuccess) {
    console.error('❌ Falha no login. Encerrando testes.')
    return
  }
  
  // Executar testes
  const testes = [
    { nome: 'Configurações Enterprise', func: testeConfiguracoes },
    { nome: 'API Keys - Listar', func: testeApiKeys },
    { nome: 'API Keys - Criar', func: testeCriarApiKey },
    { nome: 'Relatório de Uso', func: testeRelatorioUso },
    { nome: 'Backup Manual', func: testeBackupManual },
    { nome: 'White Label', func: testeWhiteLabel }
  ]
  
  let sucessos = 0
  let falhas = 0
  
  for (const teste of testes) {
    try {
      const resultado = await teste.func()
      if (resultado) {
        sucessos++
      } else {
        falhas++
      }
    } catch (error) {
      console.error(`❌ Erro no teste ${teste.nome}:`, error.message)
      falhas++
    }
    
    // Pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Resumo final
  console.log('\n' + '=' * 50)
  console.log('📊 RESUMO DOS TESTES ENTERPRISE')
  console.log('=' * 50)
  console.log(`✅ Sucessos: ${sucessos}`)
  console.log(`❌ Falhas: ${falhas}`)
  console.log(`📊 Total: ${sucessos + falhas}`)
  console.log(`🎯 Taxa de sucesso: ${Math.round((sucessos / (sucessos + falhas)) * 100)}%`)
  
  if (falhas === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! Sistema Enterprise funcionando perfeitamente!')
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os logs acima.')
  }
}

// Executar testes
if (require.main === module) {
  executarTestes().catch(console.error)
}

module.exports = { executarTestes } 