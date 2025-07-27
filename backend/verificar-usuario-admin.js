const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarUsuario() {
  try {
    await client.connect();
    
    console.log('🔍 Verificando usuário admin@arcflow.com...');
    
    const result = await client.query(`
      SELECT 
        u.id,
        u.nome,
        u.email,
        u.role,
        u.escritorio_id,
        e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.email = $1
    `, ['admin@arcflow.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Usuário admin@arcflow.com NÃO ENCONTRADO!');
      
      // Vamos criar o usuário admin
      console.log('🔨 Criando usuário admin...');
      
      // Primeiro, verificar se existe algum escritório
      const escritorios = await client.query('SELECT id, nome FROM escritorios LIMIT 1');
      
      if (escritorios.rows.length === 0) {
        console.log('❌ Nenhum escritório encontrado! Criando escritório padrão...');
        
        const novoEscritorio = await client.query(`
          INSERT INTO escritorios (nome, cnpj, email, telefone, endereco, status, plano)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, nome
        `, [
          'ArcFlow Escritório Padrão',
          '00000000000100',
          'admin@arcflow.com',
          '(11) 99999-9999',
          'Endereço Padrão',
          'ATIVO',
          'PREMIUM'
        ]);
        
        console.log('✅ Escritório criado:', novoEscritorio.rows[0]);
        
        const escritorioId = novoEscritorio.rows[0].id;
        
        // Criar usuário admin
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        await client.query(`
          INSERT INTO users (nome, email, password, role, escritorio_id, status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          'Admin ArcFlow',
          'admin@arcflow.com',
          hashedPassword,
          'ADMIN',
          escritorioId,
          'ATIVO'
        ]);
        
        console.log('✅ Usuário admin criado com sucesso!');
        
      } else {
        const escritorioId = escritorios.rows[0].id;
        console.log('✅ Escritório encontrado:', escritorios.rows[0]);
        
        // Criar usuário admin
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        await client.query(`
          INSERT INTO users (nome, email, password, role, escritorio_id, status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          'Admin ArcFlow',
          'admin@arcflow.com',
          hashedPassword,
          'ADMIN',
          escritorioId,
          'ATIVO'
        ]);
        
        console.log('✅ Usuário admin criado com sucesso!');
      }
      
    } else {
      const user = result.rows[0];
      console.log('✅ Usuário encontrado:');
      console.log('  ID:', user.id);
      console.log('  Nome:', user.nome);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Escritório ID:', user.escritorio_id);
      console.log('  Escritório Nome:', user.escritorio_nome);
      
      if (!user.escritorio_id) {
        console.log('⚠️ PROBLEMA: Usuário não tem escritório_id!');
        
        // Buscar um escritório padrão
        const escritorios = await client.query('SELECT id, nome FROM escritorios LIMIT 1');
        
        if (escritorios.rows.length > 0) {
          const escritorioId = escritorios.rows[0].id;
          
          await client.query(`
            UPDATE users SET escritorio_id = $1 WHERE id = $2
          `, [escritorioId, user.id]);
          
          console.log('✅ Escritório_id atualizado para:', escritorioId);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarUsuario(); 