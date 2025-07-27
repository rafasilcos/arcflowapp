// ===== TESTE RÁPIDO DE AUTENTICAÇÃO =====

const email = 'admin@arcflow.com'  // Usuário correto que já existe
const password = '123456'

console.log('🔐 Testando autenticação...')

async function testarAuth() {
  try {
    // 1. Fazer login
    console.log('1. Fazendo login...')
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`)
    }

    const loginData = await loginResponse.json()
    console.log('✅ Login realizado com sucesso')
    console.log('📋 Dados do usuário:', loginData.user?.nome)
    console.log('🏢 Escritório:', loginData.escritorio?.nome)

    const token = loginData.token

    // 2. Verificar status
    console.log('\n2. Verificando status...')
    const statusResponse = await fetch('http://localhost:3001/api/auth/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!statusResponse.ok) {
      throw new Error(`Status falhou: ${statusResponse.status}`)
    }

    const statusData = await statusResponse.json()
    console.log('✅ Status verificado com sucesso')
    console.log('👤 Usuário autenticado:', statusData.user?.nome)

    // 3. Testar clientes
    console.log('\n3. Testando API de clientes...')
    const clientesResponse = await fetch('http://localhost:3001/api/clientes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!clientesResponse.ok) {
      throw new Error(`Clientes falhou: ${clientesResponse.status}`)
    }

    const clientesData = await clientesResponse.json()
    console.log('✅ API de clientes funcionando')
    console.log('📊 Total de clientes:', clientesData.clientes?.length || 0)

    console.log('\n🎉 TODOS OS TESTES PASSARAM!')
    console.log('🔗 URLs para testar no frontend:')
    console.log('   - Login: http://localhost:3000/auth/login')
    console.log('   - Dashboard: http://localhost:3000/dashboard')
    console.log('   - Clientes: http://localhost:3000/comercial/clientes')

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
    console.log('\n🔧 Possíveis soluções:')
    console.log('   1. Verificar se o backend está rodando')
    console.log('   2. Verificar se o usuário existe no banco')
    console.log('   3. Verificar logs do servidor')
  }
}

testarAuth() 