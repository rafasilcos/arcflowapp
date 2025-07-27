/**
 * SCRIPT PARA VERIFICAR ESTRUTURA DA TABELA ORÇAMENTOS
 */

// Carregar variáveis de ambiente
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

// URL do banco diretamente (para debug)
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function verificarEstruturaOrcamentos() {
  try {
    console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA ORÇAMENTOS');
    console.log('='.repeat(60));

    // 1. Verificar colunas da tabela orcamentos
    console.log('\n1. Verificando colunas da tabela orcamentos...');
    const colunas = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos' 
      ORDER BY ordinal_position
    `;

    console.log(`📊 Encontradas ${colunas.length} colunas:`);
    colunas.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 2. Verificar se a coluna dados_extraidos existe
    const temDadosExtraidos = colunas.some(col => col.column_name === 'dados_extraidos');
    console.log(`\n2. Coluna 'dados_extraidos' existe: ${temDadosExtraidos ? '✅ SIM' : '❌ NÃO'}`);

    // 3. Verificar orçamentos existentes
    console.log('\n3. Verificando orçamentos existentes...');
    const orcamentos = await prisma.$queryRaw`
      SELECT id, codigo, nome, valor_total, briefing_id, created_at
      FROM orcamentos 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    console.log(`💰 Encontrados ${orcamentos.length} orçamentos:`);
    orcamentos.forEach(o => {
      console.log(`   - ID: ${o.id} | Código: ${o.codigo} | Valor: R$ ${o.valor_total}`);
    });

    // 4. Se não existe a coluna, mostrar como adicionar
    if (!temDadosExtraidos) {
      console.log('\n4. ❌ PROBLEMA IDENTIFICADO:');
      console.log('   A coluna "dados_extraidos" não existe na tabela "orcamentos"');
      console.log('\n   SOLUÇÃO: Executar a seguinte query para adicionar a coluna:');
      console.log('   ALTER TABLE orcamentos ADD COLUMN dados_extraidos JSONB;');
      
      console.log('\n   Executando correção automaticamente...');
      try {
        await prisma.$queryRaw`
          ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS dados_extraidos JSONB
        `;
        console.log('   ✅ Coluna "dados_extraidos" adicionada com sucesso!');
      } catch (error) {
        console.log('   ❌ Erro ao adicionar coluna:', error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🏁 VERIFICAÇÃO CONCLUÍDA');

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar verificação
verificarEstruturaOrcamentos();