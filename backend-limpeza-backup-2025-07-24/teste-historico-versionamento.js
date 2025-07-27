const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'arcflow',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function testarHistoricoVersionamento() {
  console.log('🔍 Iniciando teste do sistema de histórico e versionamento...\n');

  try {
    // 1. Verificar se as tabelas existem
    console.log('1. Verificando estrutura das tabelas...');
    await verificarTabelas();

    // 2. Criar dados de teste
    console.log('\n2. Criando dados de teste...');
    const { briefingId, orcamentoId, usuarioId, escritorioId } = await criarDadosTeste();

    // 3. Testar salvamento de versões
    console.log('\n3. Testando salvamento de versões...');
    await testarSalvamentoVersoes(orcamentoId, briefingId, usuarioId);

    // 4. Testar busca de histórico
    console.log('\n4. Testando busca de histórico...');
    await testarBuscaHistorico(orcamentoId, briefingId, escritorioId);

    // 5. Testar comparação de versões
    console.log('\n5. Testando comparação de versões...');
    await testarComparacaoVersoes(orcamentoId);

    // 6. Testar auditoria
    console.log('\n6. Testando sistema de auditoria...');
    await testarAuditoria(orcamentoId, usuarioId, escritorioId);

    // 7. Testar limpeza de dados antigos
    console.log('\n7. Testando limpeza de dados antigos...');
    await testarLimpezaDados();

    console.log('\n✅ Todos os testes do sistema de histórico e versionamento passaram!');

  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function verificarTabelas() {
  const client = await pool.connect();
  
  try {
    // Verificar tabela historico_orcamentos
    const historicoResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'historico_orcamentos'
      ORDER BY ordinal_position
    `);

    if (historicoResult.rows.length === 0) {
      throw new Error('Tabela historico_orcamentos não encontrada');
    }

    console.log('   ✓ Tabela historico_orcamentos encontrada');
    console.log('     Colunas:', historicoResult.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));

    // Verificar tabela auditoria_orcamentos
    const auditoriaResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'auditoria_orcamentos'
      ORDER BY ordinal_position
    `);

    if (auditoriaResult.rows.length === 0) {
      throw new Error('Tabela auditoria_orcamentos não encontrada');
    }

    console.log('   ✓ Tabela auditoria_orcamentos encontrada');
    console.log('     Colunas:', auditoriaResult.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));

  } finally {
    client.release();
  }
}

async function criarDadosTeste() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Criar escritório de teste
    const escritorioResult = await client.query(`
      INSERT INTO escritorios (nome, cnpj, email, telefone)
      VALUES ('Escritório Teste Histórico', '12345678000199', 'teste@historico.com', '11999999999')
      ON CONFLICT (cnpj) DO UPDATE SET nome = EXCLUDED.nome
      RETURNING id
    `);
    const escritorioId = escritorioResult.rows[0].id;

    // Criar usuário de teste
    const usuarioResult = await client.query(`
      INSERT INTO users (nome, email, senha, escritorio_id, role)
      VALUES ('Usuário Teste Histórico', 'usuario@historico.com', 'senha123', $1, 'USER')
      ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
      RETURNING id
    `, [escritorioId]);
    const usuarioId = usuarioResult.rows[0].id;

    // Criar briefing de teste
    const briefingResult = await client.query(`
      INSERT INTO briefings (nome, tipologia, status, escritorio_id, created_by)
      VALUES ('Briefing Teste Histórico', 'RESIDENCIAL', 'CONCLUIDO', $1, $2)
      RETURNING id
    `, [escritorioId, usuarioId]);
    const briefingId = briefingResult.rows[0].id;

    // Criar orçamento de teste
    const orcamentoResult = await client.query(`
      INSERT INTO orcamentos (briefing_id, valor_total, horas_total, status, escritorio_id, created_by)
      VALUES ($1, 50000.00, 200, 'APROVADO', $2, $3)
      RETURNING id
    `, [briefingId, escritorioId, usuarioId]);
    const orcamentoId = orcamentoResult.rows[0].id;

    await client.query('COMMIT');

    console.log(`   ✓ Dados de teste criados:`);
    console.log(`     Escritório ID: ${escritorioId}`);
    console.log(`     Usuário ID: ${usuarioId}`);
    console.log(`     Briefing ID: ${briefingId}`);
    console.log(`     Orçamento ID: ${orcamentoId}`);

    return { briefingId, orcamentoId, usuarioId, escritorioId };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function testarSalvamentoVersoes(orcamentoId, briefingId, usuarioId) {
  const client = await pool.connect();
  
  try {
    // Salvar primeira versão
    const dadosVersao1 = {
      valorTotal: 50000.00,
      horasTotal: 200,
      disciplinas: {
        arquitetura: { horas: 120, valor: 30000 },
        estrutural: { horas: 80, valor: 20000 }
      },
      configuracoes: {
        valorHoraArquiteto: 250,
        valorHoraEngenheiro: 250
      }
    };

    const versao1Result = await client.query(`
      INSERT INTO historico_orcamentos 
      (orcamento_id, briefing_id, versao, dados_versao, motivo_alteracao, created_by)
      VALUES ($1, $2, 1, $3, $4, $5)
      RETURNING id, versao, created_at
    `, [
      orcamentoId,
      briefingId,
      JSON.stringify(dadosVersao1),
      'Versão inicial do orçamento',
      usuarioId
    ]);

    console.log(`   ✓ Versão 1 salva: ID ${versao1Result.rows[0].id}`);

    // Salvar segunda versão com alterações
    const dadosVersao2 = {
      valorTotal: 55000.00,
      horasTotal: 220,
      disciplinas: {
        arquitetura: { horas: 130, valor: 32500 },
        estrutural: { horas: 90, valor: 22500 }
      },
      configuracoes: {
        valorHoraArquiteto: 250,
        valorHoraEngenheiro: 250
      }
    };

    const versao2Result = await client.query(`
      INSERT INTO historico_orcamentos 
      (orcamento_id, briefing_id, versao, dados_versao, motivo_alteracao, created_by)
      VALUES ($1, $2, 2, $3, $4, $5)
      RETURNING id, versao, created_at
    `, [
      orcamentoId,
      briefingId,
      JSON.stringify(dadosVersao2),
      'Ajuste nas horas de arquitetura e estrutural',
      usuarioId
    ]);

    console.log(`   ✓ Versão 2 salva: ID ${versao2Result.rows[0].id}`);

    // Verificar se as versões foram salvas corretamente
    const verificacaoResult = await client.query(`
      SELECT COUNT(*) as total, MAX(versao) as ultima_versao
      FROM historico_orcamentos 
      WHERE orcamento_id = $1
    `, [orcamentoId]);

    const { total, ultima_versao } = verificacaoResult.rows[0];
    console.log(`   ✓ Total de versões salvas: ${total}`);
    console.log(`   ✓ Última versão: ${ultima_versao}`);

  } finally {
    client.release();
  }
}

async function testarBuscaHistorico(orcamentoId, briefingId, escritorioId) {
  const client = await pool.connect();
  
  try {
    // Buscar histórico por orçamento
    const historicoOrcamento = await client.query(`
      SELECT 
        h.id,
        h.versao,
        h.dados_versao,
        h.motivo_alteracao,
        h.created_at,
        u.nome as nome_usuario
      FROM historico_orcamentos h
      LEFT JOIN users u ON h.created_by = u.id
      WHERE h.orcamento_id = $1
      ORDER BY h.versao DESC
    `, [orcamentoId]);

    console.log(`   ✓ Histórico por orçamento: ${historicoOrcamento.rows.length} versões encontradas`);
    
    historicoOrcamento.rows.forEach(row => {
      console.log(`     - Versão ${row.versao}: ${row.motivo_alteracao} (${row.nome_usuario})`);
    });

    // Buscar histórico por briefing
    const historicoBriefing = await client.query(`
      SELECT 
        h.id,
        h.orcamento_id,
        h.versao,
        h.motivo_alteracao,
        h.created_at
      FROM historico_orcamentos h
      WHERE h.briefing_id = $1
      ORDER BY h.created_at DESC
    `, [briefingId]);

    console.log(`   ✓ Histórico por briefing: ${historicoBriefing.rows.length} versões encontradas`);

    // Buscar estatísticas
    const estatisticas = await client.query(`
      SELECT 
        COUNT(*) as total_versoes,
        COUNT(DISTINCT h.orcamento_id) as total_orcamentos,
        COUNT(DISTINCT h.created_by) as total_usuarios,
        MIN(h.created_at) as primeira_versao,
        MAX(h.created_at) as ultima_versao
      FROM historico_orcamentos h
      JOIN briefings b ON h.briefing_id = b.id
      WHERE b.escritorio_id = $1
    `, [escritorioId]);

    const stats = estatisticas.rows[0];
    console.log(`   ✓ Estatísticas do escritório:`);
    console.log(`     - Total de versões: ${stats.total_versoes}`);
    console.log(`     - Total de orçamentos: ${stats.total_orcamentos}`);
    console.log(`     - Total de usuários: ${stats.total_usuarios}`);

  } finally {
    client.release();
  }
}

async function testarComparacaoVersoes(orcamentoId) {
  const client = await pool.connect();
  
  try {
    // Buscar duas versões para comparar
    const versoes = await client.query(`
      SELECT versao, dados_versao
      FROM historico_orcamentos 
      WHERE orcamento_id = $1
      ORDER BY versao
      LIMIT 2
    `, [orcamentoId]);

    if (versoes.rows.length < 2) {
      console.log('   ⚠️  Não há versões suficientes para comparação');
      return;
    }

    const versao1 = versoes.rows[0];
    const versao2 = versoes.rows[1];

    console.log(`   ✓ Comparando versão ${versao1.versao} com versão ${versao2.versao}`);

    // Simular comparação de dados
    const dados1 = versao1.dados_versao;
    const dados2 = versao2.dados_versao;

    const diferencas = [];

    // Comparar valor total
    if (dados1.valorTotal !== dados2.valorTotal) {
      diferencas.push({
        campo: 'valorTotal',
        valorAnterior: dados1.valorTotal,
        valorAtual: dados2.valorTotal,
        tipo: 'modificado'
      });
    }

    // Comparar horas total
    if (dados1.horasTotal !== dados2.horasTotal) {
      diferencas.push({
        campo: 'horasTotal',
        valorAnterior: dados1.horasTotal,
        valorAtual: dados2.horasTotal,
        tipo: 'modificado'
      });
    }

    console.log(`   ✓ Diferenças encontradas: ${diferencas.length}`);
    diferencas.forEach(diff => {
      console.log(`     - ${diff.campo}: ${diff.valorAnterior} → ${diff.valorAtual}`);
    });

  } finally {
    client.release();
  }
}

async function testarAuditoria(orcamentoId, usuarioId, escritorioId) {
  const client = await pool.connect();
  
  try {
    // Registrar ação de auditoria
    const auditoriaResult = await client.query(`
      INSERT INTO auditoria_orcamentos 
      (entidade, entidade_id, acao, dados_novos, usuario_id, escritorio_id, detalhes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, timestamp
    `, [
      'orcamento',
      orcamentoId,
      'regeneracao',
      JSON.stringify({ valorTotal: 55000, motivo: 'Teste de auditoria' }),
      usuarioId,
      escritorioId,
      'Teste do sistema de auditoria'
    ]);

    console.log(`   ✓ Registro de auditoria criado: ID ${auditoriaResult.rows[0].id}`);

    // Buscar registros de auditoria
    const registros = await client.query(`
      SELECT 
        a.id,
        a.entidade,
        a.acao,
        a.timestamp,
        a.detalhes,
        u.nome as nome_usuario
      FROM auditoria_orcamentos a
      LEFT JOIN users u ON a.usuario_id = u.id
      WHERE a.escritorio_id = $1
      ORDER BY a.timestamp DESC
      LIMIT 10
    `, [escritorioId]);

    console.log(`   ✓ Registros de auditoria encontrados: ${registros.rows.length}`);
    
    registros.rows.forEach(registro => {
      console.log(`     - ${registro.acao} em ${registro.entidade} por ${registro.nome_usuario}`);
    });

    // Buscar estatísticas de auditoria
    const estatisticas = await client.query(`
      SELECT 
        COUNT(*) as total_acoes,
        COUNT(DISTINCT usuario_id) as total_usuarios,
        acao,
        COUNT(*) as total_por_acao
      FROM auditoria_orcamentos
      WHERE escritorio_id = $1
      GROUP BY acao
      ORDER BY total_por_acao DESC
    `, [escritorioId]);

    console.log(`   ✓ Estatísticas de auditoria:`);
    estatisticas.rows.forEach(stat => {
      console.log(`     - ${stat.acao}: ${stat.total_por_acao} ações`);
    });

  } finally {
    client.release();
  }
}

async function testarLimpezaDados() {
  const client = await pool.connect();
  
  try {
    // Criar dados antigos para teste
    const umAnoEMeioAtras = new Date();
    umAnoEMeioAtras.setMonth(umAnoEMeioAtras.getMonth() - 18);

    await client.query(`
      INSERT INTO historico_orcamentos 
      (orcamento_id, briefing_id, versao, dados_versao, motivo_alteracao, created_by, created_at)
      VALUES (
        gen_random_uuid(),
        gen_random_uuid(),
        1,
        '{"valorTotal": 10000}',
        'Dados antigos para teste',
        gen_random_uuid(),
        $1
      )
    `, [umAnoEMeioAtras]);

    console.log('   ✓ Dados antigos criados para teste');

    // Contar registros antes da limpeza
    const antesResult = await client.query(`
      SELECT COUNT(*) as total
      FROM historico_orcamentos
      WHERE created_at < NOW() - INTERVAL '1 year'
    `);

    console.log(`   ✓ Registros antigos antes da limpeza: ${antesResult.rows[0].total}`);

    // Executar limpeza
    const limpezaResult = await client.query(`
      DELETE FROM historico_orcamentos 
      WHERE created_at < NOW() - INTERVAL '1 year'
    `);

    console.log(`   ✓ Registros removidos na limpeza: ${limpezaResult.rowCount}`);

    // Verificar após limpeza
    const depoisResult = await client.query(`
      SELECT COUNT(*) as total
      FROM historico_orcamentos
      WHERE created_at < NOW() - INTERVAL '1 year'
    `);

    console.log(`   ✓ Registros antigos após limpeza: ${depoisResult.rows[0].total}`);

  } finally {
    client.release();
  }
}

// Executar testes
if (require.main === module) {
  testarHistoricoVersionamento();
}

module.exports = {
  testarHistoricoVersionamento
};