/**
 * 🔍 VERIFICAR ESTRUTURA DA TABELA RESPOSTAS_BRIEFING
 * 
 * Script para verificar se a tabela de respostas existe e criar se necessário
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarEstrutuuraRespostasBriefing() {
  console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA RESPOSTAS_BRIEFING');
  console.log('='.repeat(60));
  
  try {
    // 1. Verificar se a tabela existe
    console.log('\n📋 Verificando se a tabela respostas_briefing existe...');
    
    const tabelaExiste = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'respostas_briefing'
      );
    `);
    
    if (tabelaExiste.rows[0].exists) {
      console.log('✅ Tabela respostas_briefing existe');
      
      // Verificar estrutura da tabela
      const estrutura = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'respostas_briefing'
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📊 Estrutura da tabela:');
      estrutura.rows.forEach(col => {
        console.log(`   • ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
      });
      
      // Verificar quantas respostas existem
      const totalRespostas = await pool.query('SELECT COUNT(*) as total FROM respostas_briefing');
      console.log(`\n📝 Total de respostas na tabela: ${totalRespostas.rows[0].total}`);
      
    } else {
      console.log('❌ Tabela respostas_briefing NÃO existe');
      console.log('\n🔧 Criando tabela respostas_briefing...');
      
      await pool.query(`
        CREATE TABLE respostas_briefing (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          briefing_id UUID NOT NULL,
          pergunta_id VARCHAR(50) NOT NULL,
          resposta TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          
          -- Constraints
          CONSTRAINT fk_respostas_briefing FOREIGN KEY (briefing_id) REFERENCES briefings(id) ON DELETE CASCADE,
          CONSTRAINT unique_briefing_pergunta UNIQUE (briefing_id, pergunta_id)
        );
      `);
      
      // Criar índices
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_respostas_briefing_briefing_id ON respostas_briefing(briefing_id);
        CREATE INDEX IF NOT EXISTS idx_respostas_briefing_pergunta_id ON respostas_briefing(pergunta_id);
      `);
      
      console.log('✅ Tabela respostas_briefing criada com sucesso!');
    }
    
    // 2. Verificar se há briefings sem respostas na tabela
    console.log('\n🔍 Verificando briefings sem respostas na tabela...');
    
    const briefingsSemRespostas = await pool.query(`
      SELECT 
        b.id, 
        b.nome_projeto,
        COUNT(r.id) as total_respostas
      FROM briefings b
      LEFT JOIN respostas_briefing r ON b.id = r.briefing_id
      WHERE b.nome_projeto LIKE '%TESTE AUTOMÁTICO%'
      GROUP BY b.id, b.nome_projeto
      HAVING COUNT(r.id) = 0
      ORDER BY b.nome_projeto
    `);
    
    if (briefingsSemRespostas.rows.length > 0) {
      console.log(`⚠️ Encontrados ${briefingsSemRespostas.rows.length} briefings sem respostas na tabela:`);
      briefingsSemRespostas.rows.forEach(briefing => {
        console.log(`   • ${briefing.nome_projeto} (ID: ${briefing.id})`);
      });
      
      console.log('\n💡 SOLUÇÕES:');
      console.log('   1. Execute: node sistema-briefings-teste-automatico-completo-corrigido.js');
      console.log('   2. Ou execute: node migrar-respostas-metadata-para-tabela.js');
      
    } else {
      console.log('✅ Todos os briefings de teste têm respostas na tabela');
    }
    
    // 3. Verificar integridade dos dados
    console.log('\n🔍 Verificando integridade dos dados...');
    
    const integridade = await pool.query(`
      SELECT 
        COUNT(DISTINCT b.id) as total_briefings,
        COUNT(r.id) as total_respostas,
        AVG(respostas_por_briefing.total) as media_respostas_por_briefing
      FROM briefings b
      LEFT JOIN respostas_briefing r ON b.id = r.briefing_id
      LEFT JOIN (
        SELECT briefing_id, COUNT(*) as total
        FROM respostas_briefing
        GROUP BY briefing_id
      ) respostas_por_briefing ON b.id = respostas_por_briefing.briefing_id
      WHERE b.nome_projeto LIKE '%TESTE AUTOMÁTICO%'
    `);
    
    const stats = integridade.rows[0];
    console.log(`📊 Estatísticas de integridade:`);
    console.log(`   • Total de briefings de teste: ${stats.total_briefings}`);
    console.log(`   • Total de respostas: ${stats.total_respostas}`);
    console.log(`   • Média de respostas por briefing: ${Math.round(stats.media_respostas_por_briefing || 0)}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICAÇÃO CONCLUÍDA!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

// Executar verificação
if (require.main === module) {
  verificarEstrutuuraRespostasBriefing();
}

module.exports = { verificarEstrutuuraRespostasBriefing };