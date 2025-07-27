/**
 * MIGRAÇÃO PARA SISTEMA DE PRECIFICAÇÃO REALISTA
 * 
 * Cria tabelas e dados necessários para o novo sistema
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function executarMigration() {
  console.log('🚀 EXECUTANDO MIGRAÇÃO DO SISTEMA DE PRECIFICAÇÃO');
  console.log('='.repeat(60));
  
  try {
    // 1. Criar tabela pricing_base
    console.log('📋 Criando tabela pricing_base...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing_base (
        id SERIAL PRIMARY KEY,
        tipologia VARCHAR(50) NOT NULL,
        disciplina VARCHAR(50) NOT NULL,
        complexidade VARCHAR(20) NOT NULL,
        price_min DECIMAL(10,2) NOT NULL,
        price_max DECIMAL(10,2) NOT NULL,
        price_average DECIMAL(10,2) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(tipologia, disciplina, complexidade)
      )
    `);
    console.log('✅ Tabela pricing_base criada');

    // 2. Inserir dados realistas
    console.log('📊 Inserindo dados de precificação realistas...');
    
    const dadosRealistas = [
      // RESIDENCIAL
      ['RESIDENCIAL', 'ARQUITETURA', 'SIMPLES', 80, 150, 115],
      ['RESIDENCIAL', 'ARQUITETURA', 'MEDIO', 120, 200, 160],
      ['RESIDENCIAL', 'ARQUITETURA', 'COMPLEXO', 180, 300, 240],
      ['RESIDENCIAL', 'ESTRUTURAL', 'SIMPLES', 40, 80, 60],
      ['RESIDENCIAL', 'ESTRUTURAL', 'MEDIO', 60, 100, 80],
      ['RESIDENCIAL', 'ESTRUTURAL', 'COMPLEXO', 80, 120, 100],
      ['RESIDENCIAL', 'INSTALACOES', 'SIMPLES', 30, 60, 45],
      ['RESIDENCIAL', 'INSTALACOES', 'MEDIO', 50, 80, 65],
      ['RESIDENCIAL', 'INSTALACOES', 'COMPLEXO', 70, 100, 85],
      ['RESIDENCIAL', 'PAISAGISMO', 'SIMPLES', 20, 40, 30],
      ['RESIDENCIAL', 'PAISAGISMO', 'MEDIO', 30, 60, 45],
      ['RESIDENCIAL', 'PAISAGISMO', 'COMPLEXO', 50, 80, 65],
      ['RESIDENCIAL', 'INTERIORES', 'SIMPLES', 60, 120, 90],
      ['RESIDENCIAL', 'INTERIORES', 'MEDIO', 100, 160, 130],
      ['RESIDENCIAL', 'INTERIORES', 'COMPLEXO', 140, 220, 180],
      
      // COMERCIAL
      ['COMERCIAL', 'ARQUITETURA', 'SIMPLES', 90, 180, 135],
      ['COMERCIAL', 'ARQUITETURA', 'MEDIO', 140, 220, 180],
      ['COMERCIAL', 'ARQUITETURA', 'COMPLEXO', 200, 320, 260],
      ['COMERCIAL', 'ESTRUTURAL', 'SIMPLES', 50, 90, 70],
      ['COMERCIAL', 'ESTRUTURAL', 'MEDIO', 70, 120, 95],
      ['COMERCIAL', 'ESTRUTURAL', 'COMPLEXO', 100, 150, 125],
      ['COMERCIAL', 'INSTALACOES', 'SIMPLES', 40, 80, 60],
      ['COMERCIAL', 'INSTALACOES', 'MEDIO', 60, 100, 80],
      ['COMERCIAL', 'INSTALACOES', 'COMPLEXO', 80, 120, 100],
      ['COMERCIAL', 'INTERIORES', 'SIMPLES', 80, 140, 110],
      ['COMERCIAL', 'INTERIORES', 'MEDIO', 120, 180, 150],
      ['COMERCIAL', 'INTERIORES', 'COMPLEXO', 160, 240, 200],
      
      // INDUSTRIAL
      ['INDUSTRIAL', 'ARQUITETURA', 'SIMPLES', 40, 80, 60],
      ['INDUSTRIAL', 'ARQUITETURA', 'MEDIO', 60, 100, 80],
      ['INDUSTRIAL', 'ARQUITETURA', 'COMPLEXO', 80, 120, 100],
      ['INDUSTRIAL', 'ESTRUTURAL', 'SIMPLES', 30, 60, 45],
      ['INDUSTRIAL', 'ESTRUTURAL', 'MEDIO', 40, 80, 60],
      ['INDUSTRIAL', 'ESTRUTURAL', 'COMPLEXO', 60, 100, 80],
      ['INDUSTRIAL', 'INSTALACOES', 'SIMPLES', 25, 50, 37],
      ['INDUSTRIAL', 'INSTALACOES', 'MEDIO', 35, 70, 52],
      ['INDUSTRIAL', 'INSTALACOES', 'COMPLEXO', 50, 90, 70],
      
      // INSTITUCIONAL
      ['INSTITUCIONAL', 'ARQUITETURA', 'SIMPLES', 100, 180, 140],
      ['INSTITUCIONAL', 'ARQUITETURA', 'MEDIO', 150, 250, 200],
      ['INSTITUCIONAL', 'ARQUITETURA', 'COMPLEXO', 220, 350, 285],
      ['INSTITUCIONAL', 'ESTRUTURAL', 'SIMPLES', 60, 100, 80],
      ['INSTITUCIONAL', 'ESTRUTURAL', 'MEDIO', 80, 130, 105],
      ['INSTITUCIONAL', 'ESTRUTURAL', 'COMPLEXO', 110, 170, 140],
      ['INSTITUCIONAL', 'INSTALACOES', 'SIMPLES', 50, 90, 70],
      ['INSTITUCIONAL', 'INSTALACOES', 'MEDIO', 70, 120, 95],
      ['INSTITUCIONAL', 'INSTALACOES', 'COMPLEXO', 100, 150, 125],
      
      // URBANISTICO
      ['URBANISTICO', 'ARQUITETURA', 'SIMPLES', 30, 60, 45],
      ['URBANISTICO', 'ARQUITETURA', 'MEDIO', 50, 90, 70],
      ['URBANISTICO', 'ARQUITETURA', 'COMPLEXO', 70, 120, 95],
      ['URBANISTICO', 'PAISAGISMO', 'SIMPLES', 25, 50, 37],
      ['URBANISTICO', 'PAISAGISMO', 'MEDIO', 40, 70, 55],
      ['URBANISTICO', 'PAISAGISMO', 'COMPLEXO', 60, 100, 80]
    ];

    let inseridos = 0;
    for (const dados of dadosRealistas) {
      try {
        await pool.query(`
          INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (tipologia, disciplina, complexidade) 
          DO UPDATE SET 
            price_min = EXCLUDED.price_min,
            price_max = EXCLUDED.price_max,
            price_average = EXCLUDED.price_average,
            updated_at = NOW()
        `, dados);
        inseridos++;
      } catch (error) {
        console.log(`⚠️  Erro ao inserir ${dados[0]}-${dados[1]}-${dados[2]}:`, error.message);
      }
    }
    
    console.log(`✅ ${inseridos} registros de precificação inseridos/atualizados`);

    // 3. Verificar dados inseridos
    const result = await pool.query(`
      SELECT tipologia, COUNT(*) as total
      FROM pricing_base 
      WHERE active = true
      GROUP BY tipologia
      ORDER BY tipologia
    `);
    
    console.log('\n📊 DADOS INSERIDOS POR TIPOLOGIA:');
    result.rows.forEach(row => {
      console.log(`   ${row.tipologia}: ${row.total} registros`);
    });

    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('   1. Reinicie o servidor backend');
    console.log('   2. Os orçamentos agora usarão valores realistas');
    console.log('   3. Execute: node teste-precificacao-realista.js para testar');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await pool.end();
  }
}

// Executar migração
if (require.main === module) {
  executarMigration();
}

module.exports = { executarMigration };