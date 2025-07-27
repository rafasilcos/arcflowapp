/**
 * 🗑️ APAGAR TODOS OS BRIEFINGS DA CONTA ADMIN@ARCFLOW.COM
 * 
 * Script para limpar completamente os briefings da conta admin
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function apagarBriefingsAdmin() {
  try {
    console.log('🗑️ APAGANDO TODOS OS BRIEFINGS DA CONTA ADMIN@ARCFLOW.COM');
    console.log('='.repeat(60));
    
    // Primeiro, vamos identificar o escritório do admin@arcflow.com
    const adminUser = await pool.query("SELECT id, email, escritorio_id FROM users WHERE email = 'admin@arcflow.com'");
    
    if (adminUser.rows.length === 0) {
      console.log('❌ Usuário admin@arcflow.com não encontrado');
      
      // Tentar encontrar por outros critérios
      console.log('\n🔍 Procurando usuários admin...');
      const adminUsers = await pool.query("SELECT id, email, escritorio_id FROM users WHERE email LIKE '%admin%' OR email LIKE '%arcflow%'");
      
      if (adminUsers.rows.length > 0) {
        console.log('📋 Usuários encontrados:');
        adminUsers.rows.forEach(user => {
          console.log(`   • ${user.email} (ID: ${user.id}, Escritório: ${user.escritorio_id})`);
        });
      }
      
      return;
    }
    
    const adminUserId = adminUser.rows[0].id;
    const adminEscritorioId = adminUser.rows[0].escritorio_id;
    
    console.log(`✅ Admin encontrado: ${adminUser.rows[0].email}`);
    console.log(`📋 Escritório ID: ${adminEscritorioId}`);
    
    // Contar briefings antes de apagar
    const countAntes = await pool.query('SELECT COUNT(*) as total FROM briefings WHERE escritorio_id = $1', [adminEscritorioId]);
    console.log(`📊 Briefings encontrados: ${countAntes.rows[0].total}`);
    
    if (countAntes.rows[0].total === '0') {
      console.log('✅ Nenhum briefing para apagar');
      return;
    }
    
    // Listar briefings que serão apagados
    const briefingsParaApagar = await pool.query('SELECT id, nome_projeto, created_at FROM briefings WHERE escritorio_id = $1 ORDER BY created_at DESC', [adminEscritorioId]);
    
    console.log(`\n📋 BRIEFINGS QUE SERÃO APAGADOS:`);
    briefingsParaApagar.rows.forEach((briefing, index) => {
      console.log(`   ${index + 1}. ${briefing.nome_projeto}`);
      console.log(`      📅 ${new Date(briefing.created_at).toLocaleString('pt-BR')}`);
    });
    
    // Apagar respostas primeiro (devido às foreign keys)
    console.log(`\n🗑️ Apagando respostas dos briefings...`);
    const respostasApagadas = await pool.query('DELETE FROM respostas_briefing WHERE briefing_id IN (SELECT id FROM briefings WHERE escritorio_id = $1)', [adminEscritorioId]);
    console.log(`✅ ${respostasApagadas.rowCount || 0} respostas apagadas`);
    
    // Apagar briefings
    console.log(`\n🗑️ Apagando briefings...`);
    const briefingsApagados = await pool.query('DELETE FROM briefings WHERE escritorio_id = $1', [adminEscritorioId]);
    console.log(`✅ ${briefingsApagados.rowCount || 0} briefings apagados`);
    
    // Verificar se foi tudo apagado
    const countDepois = await pool.query('SELECT COUNT(*) as total FROM briefings WHERE escritorio_id = $1', [adminEscritorioId]);
    
    console.log(`\n📊 RESULTADO:`);
    console.log(`   📋 Briefings antes: ${countAntes.rows[0].total}`);
    console.log(`   📋 Briefings depois: ${countDepois.rows[0].total}`);
    
    if (countDepois.rows[0].total === '0') {
      console.log('\n🎉 TODOS OS BRIEFINGS FORAM APAGADOS COM SUCESSO!');
      console.log('✅ Conta admin@arcflow.com está limpa');
      console.log('✅ Pronto para criar novos briefings de teste');
    } else {
      console.log('\n⚠️ Alguns briefings podem não ter sido apagados');
    }
    
  } catch (error) {
    console.error('❌ Erro ao apagar briefings:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

// Executar
if (require.main === module) {
  apagarBriefingsAdmin();
}

module.exports = { apagarBriefingsAdmin };