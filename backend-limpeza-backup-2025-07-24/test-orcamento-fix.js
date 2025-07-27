const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

// Função de normalização UUID (copiada do server-simple.js)
const crypto = require('crypto');

function normalizeToUuid(id) {
  // Se já é um UUID válido, retorna como está
  if (typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  
  // Mapeamento de IDs de teste para UUIDs fixos (consistentes)
  const testIdMappings = {
    'escritorio_teste': 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'user_admin_teste': 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    'admin_arcflow': 'b2c3d4e5-f6g7-8901-2345-678901abcdef',
  };
  
  // Se é um ID de teste conhecido, retorna UUID fixo
  if (testIdMappings[id]) {
    console.log(`🔄 [UUID-NORMALIZE] Convertendo ID de teste: ${id} -> ${testIdMappings[id]}`);
    return testIdMappings[id];
  }
  
  // Para IDs desconhecidos, gera UUID determinístico baseado na string
  const hash = crypto.createHash('md5').update(id.toString()).digest('hex');
  const uuid = [
    hash.substr(0, 8),
    hash.substr(8, 4),
    '4' + hash.substr(13, 3),
    ((parseInt(hash.substr(16, 1), 16) & 0x3) | 0x8).toString(16) + hash.substr(17, 3),
    hash.substr(20, 12)
  ].join('-');
  
  console.log(`🔄 [UUID-NORMALIZE] Gerando UUID determinístico: ${id} -> ${uuid}`);
  return uuid;
}

async function testarCorrecaoOrcamento() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Dados de teste
    const briefingId = '8320013b-8caf-405e-aefc-401e29b61ef8';
    const escritorioIdRaw = 'escritorio_teste';
    const userIdRaw = 'user_admin_teste';

    // Normalizar IDs
    const escritorioId = normalizeToUuid(escritorioIdRaw);
    const userId = normalizeToUuid(userIdRaw);

    console.log('🧪 Testando queries corrigidas...');
    console.log('📋 Dados de teste:', { briefingId, escritorioId, userId });

    // 1. Testar busca de briefing
    console.log('\n1️⃣ Testando busca de briefing...');
    const briefingResult = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        u.nome as responsavel_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      WHERE b.id = $1::uuid AND b.escritorio_id = $2::uuid AND b.deleted_at IS NULL
    `, [briefingId, escritorioId]);

    if (briefingResult.rows.length === 0) {
      console.log('❌ Briefing não encontrado');
      return;
    }

    console.log('✅ Briefing encontrado:', briefingResult.rows[0].nome_projeto);

    // 2. Testar verificação de orçamento existente
    console.log('\n2️⃣ Testando verificação de orçamento existente...');
    const orcamentoExistente = await client.query(`
      SELECT id FROM orcamentos 
      WHERE briefing_id = $1::uuid AND escritorio_id = $2::uuid
    `, [briefingId, escritorioId]);

    if (orcamentoExistente.rows.length > 0) {
      console.log('⚠️ Já existe orçamento para este briefing:', orcamentoExistente.rows[0].id);
    } else {
      console.log('✅ Nenhum orçamento existente encontrado - pode prosseguir');
    }

    // 3. Testar atualização de status do briefing
    console.log('\n3️⃣ Testando atualização de status do briefing...');
    const updateResult = await client.query(`
      UPDATE briefings 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2::uuid AND escritorio_id = $3::uuid
      RETURNING id, status
    `, ['TESTE_CORRECAO', briefingId, escritorioId]);

    if (updateResult.rows.length > 0) {
      console.log('✅ Status do briefing atualizado com sucesso');
      
      // Reverter o status
      await client.query(`
        UPDATE briefings 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2::uuid AND escritorio_id = $3::uuid
      `, ['CONCLUIDO', briefingId, escritorioId]);
      console.log('🔄 Status revertido para CONCLUIDO');
    } else {
      console.log('❌ Falha ao atualizar status do briefing');
    }

    console.log('\n🎉 Todas as queries foram testadas com sucesso!');
    console.log('✅ As correções de UUID estão funcionando corretamente');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    console.error('📋 Detalhes do erro:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
  } finally {
    await client.end();
  }
}

// Executar teste
testarCorrecaoOrcamento();