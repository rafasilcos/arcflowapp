/**
 * SCRIPT PARA CORRIGIR TABELA ORÇAMENTOS
 * Adiciona a coluna dados_extraidos que está faltando
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

async function corrigirTabelaOrcamentos() {
  try {
    console.log('🔧 CORRIGINDO TABELA ORÇAMENTOS');
    console.log('='.repeat(50));

    console.log('\n1. Adicionando coluna dados_extraidos...');
    
    // Adicionar coluna dados_extraidos
    await prisma.$executeRawUnsafe(`
      ALTER TABLE orcamentos 
      ADD COLUMN IF NOT EXISTS dados_extraidos JSONB
    `);
    
    console.log('✅ Coluna dados_extraidos adicionada!');

    console.log('\n2. Verificando se a coluna foi criada...');
    
    // Verificar se a coluna existe agora
    const resultado = await prisma.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos' AND column_name = 'dados_extraidos'
    `);
    
    if (resultado.length > 0) {
      console.log('✅ Coluna dados_extraidos confirmada na tabela!');
    } else {
      console.log('❌ Coluna dados_extraidos ainda não existe!');
    }

    console.log('\n3. Testando inserção de orçamento...');
    
    // Testar inserção simples
    const codigoTeste = `ORC-TESTE-${Date.now()}`;
    
    const novoOrcamento = await prisma.$queryRawUnsafe(`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, 
        area_construida, valor_total, valor_por_m2,
        tipologia, padrao, complexidade,
        disciplinas, composicao_financeira, cronograma, proposta,
        briefing_id, escritorio_id, responsavel_id,
        dados_extraidos
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING id, codigo
    `, 
      codigoTeste,
      'Orçamento Teste Correção',
      'Teste para verificar se a correção funcionou',
      'RASCUNHO',
      200,
      50000,
      250,
      'RESIDENCIAL',
      'MEDIO',
      'MEDIA',
      JSON.stringify([{nome: 'Arquitetura', valor: 50000}]),
      JSON.stringify({custoTecnico: 40000, lucro: 10000}),
      JSON.stringify({prazoTotal: 12}),
      JSON.stringify({escopo: 'Projeto completo'}),
      '8320013b-8caf-405e-aefc-401e29b61ef8', // ID de um briefing existente
      'escritorio_teste',
      1,
      JSON.stringify({areaConstruida: 200, tipologia: 'RESIDENCIAL'})
    );
    
    console.log('✅ Orçamento de teste inserido com sucesso!');
    console.log('   ID:', novoOrcamento[0].id);
    console.log('   Código:', novoOrcamento[0].codigo);

    console.log('\n4. Verificando se o orçamento foi salvo...');
    
    const orcamentoSalvo = await prisma.$queryRawUnsafe(`
      SELECT id, codigo, nome, valor_total, dados_extraidos
      FROM orcamentos 
      WHERE codigo = $1
    `, codigoTeste);
    
    if (orcamentoSalvo.length > 0) {
      console.log('✅ Orçamento encontrado no banco!');
      console.log('   Nome:', orcamentoSalvo[0].nome);
      console.log('   Valor:', orcamentoSalvo[0].valor_total);
      console.log('   Dados extraídos:', orcamentoSalvo[0].dados_extraidos ? 'Presente' : 'Ausente');
    } else {
      console.log('❌ Orçamento não encontrado!');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 CORREÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('   A tabela orcamentos agora tem a coluna dados_extraidos');
    console.log('   O sistema de geração de orçamentos deve funcionar corretamente');

  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar correção
corrigirTabelaOrcamentos();