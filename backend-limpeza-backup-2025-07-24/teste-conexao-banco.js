// ===== TESTE DE CONEXÃO COM BANCO =====

const sqlite3 = require('sqlite3').verbose()

console.log('🔍 Testando conexão com banco de dados...')

const db = new sqlite3.Database('./arcflow-auth.db', (err) => {
  if (err) {
    console.error('❌ Erro ao conectar com banco:', err.message)
    return
  }
  console.log('✅ Conectado ao banco SQLite')
})

// Verificar tabelas
db.serialize(() => {
  // Listar todas as tabelas
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao listar tabelas:', err.message)
      return
    }
    
    console.log('\n📋 Tabelas encontradas:')
    rows.forEach((row) => {
      console.log(`  - ${row.name}`)
    })
    
    // Verificar usuários
    db.all("SELECT id, nome, email FROM usuarios LIMIT 5", [], (err, users) => {
      if (err) {
        console.error('❌ Erro ao buscar usuários:', err.message)
      } else {
        console.log('\n👥 Usuários encontrados:')
        if (users.length === 0) {
          console.log('  Nenhum usuário encontrado')
        } else {
          users.forEach((user) => {
            console.log(`  - ${user.nome} (${user.email})`)
          })
        }
      }
      
      // Verificar escritórios
      db.all("SELECT id, nome FROM escritorios LIMIT 5", [], (err, escritorios) => {
        if (err) {
          console.error('❌ Erro ao buscar escritórios:', err.message)
        } else {
          console.log('\n🏢 Escritórios encontrados:')
          if (escritorios.length === 0) {
            console.log('  Nenhum escritório encontrado')
          } else {
            escritorios.forEach((escritorio) => {
              console.log(`  - ${escritorio.nome}`)
            })
          }
        }
        
        db.close((err) => {
          if (err) {
            console.error('❌ Erro ao fechar banco:', err.message)
          } else {
            console.log('\n✅ Conexão com banco fechada')
          }
        })
      })
    })
  })
}) 