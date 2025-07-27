/**
 * 🔍 VERIFICAÇÃO: ORÇAMENTO 62 NO BANCO DE DADOS
 * 
 * Verificar se o orçamento ID 62 existe no banco e quais dados estão armazenados
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarOrcamento62() {
  console.log('🔍 VERIFICANDO ORÇAMENTO 62 NO BANCO DE DADOS\n');
  
  // Conectar ao banco primeiro
  await connectDatabase();
  const client = getClient();
  
  try {
    // Verificar se o orçamento 62 existe
    console.log('1. 📋 VERIFICANDO EXISTÊNCIA DO ORÇAMENTO 62...');
    
    const orcamentoQuery = `
      SELECT 
        id,
        codigo,
        nome,
        descricao,
        cliente_id,
        escritorio_id,
        briefing_id,
        valor_total,
        valor_por_m2,
        area_construida,
        area_terreno,
        tipologia,
        complexidade,
        localizacao,
        prazo_entrega,
        status,
        created_at,
        updated_at
      FROM orcamentos 
      WHERE id = $1
    `;
    
    const orcamentoResult = await client.query(orcamentoQuery, [62]);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ ORÇAMENTO 62 NÃO ENCONTRADO NO BANCO!');
      console.log('   O sistema está tentando acessar um orçamento que não existe.');
      
      // Listar orçamentos existentes
      console.log('\n📋 ORÇAMENTOS EXISTENTES NO BANCO:');
      const existentesResult = await client.query('SELECT id, codigo, nome, briefing_id FROM orcamentos ORDER BY id DESC LIMIT 10');
      
      if (existentesResult.rows.length === 0) {
        console.log('   ⚠️ NENHUM ORÇAMENTO ENCONTRADO NO BANCO!');
      } else {
        existentesResult.rows.forEach(orc => {
          console.log(`   - ID ${orc.id}: ${orc.codigo} - ${orc.nome} (Briefing: ${orc.briefing_id || 'NULL'})`);
        });
      }
      
      // Verificar briefings recentes
      console.log('\n📝 BRIEFINGS RECENTES:');
      const briefingsResult = await client.query('SELECT id, nome, status, created_at FROM briefings ORDER BY id DESC LIMIT 5');
      
      if (briefingsResult.rows.length > 0) {
        briefingsResult.rows.forEach(brief => {
          console.log(`   - ID ${brief.id}: ${brief.nome} - Status: ${brief.status} (${brief.created_at})`);
        });
      } else {
        console.log('   ⚠️ NENHUM BRIEFING ENCONTRADO!');
      }
      
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    
    console.log('✅ ORÇAMENTO 62 ENCONTRADO!');
    console.log('📊 DADOS ARMAZENADOS NO BANCO:');
    console.log(`   - ID: ${orcamento.id}`);
    console.log(`   - Código: ${orcamento.codigo}`);
    console.log(`   - Nome: ${orcamento.nome}`);
    console.log(`   - Briefing ID: ${orcamento.briefing_id || 'NULL'}`);
    console.log(`   - Cliente ID: ${orcamento.cliente_id}`);
    console.log(`   - Escritório ID: ${orcamento.escritorio_id}`);
    console.log(`   - Valor Total: R$ ${orcamento.valor_total?.toLocaleString('pt-BR') || 'NULL'}`);
    console.log(`   - Valor por m²: R$ ${orcamento.valor_por_m2?.toLocaleString('pt-BR') || 'NULL'}/m²`);
    console.log(`   - Área Construída: ${orcamento.area_construida || 'NULL'}m²`);
    console.log(`   - Tipologia: ${orcamento.tipologia || 'NULL'}`);
    console.log(`   - Complexidade: ${orcamento.complexidade || 'NULL'}`);
    console.log(`   - Prazo Entrega: ${orcamento.prazo_entrega || 'NULL'} semanas`);
    console.log(`   - Status: ${orcamento.status || 'NULL'}`);
    console.log(`   - Criado em: ${orcamento.created_at}`);
    console.log(`   - Atualizado em: ${orcamento.updated_at}\n`);
    
    // Verificar briefing associado
    if (orcamento.briefing_id) {
      console.log('2. 📝 VERIFICANDO BRIEFING ASSOCIADO...');
      
      const briefingQuery = `
        SELECT 
          id, nome, tipologia, subtipo, area_construida, 
          area_terreno, complexidade, localizacao, status,
          created_at
        FROM briefings 
        WHERE id = $1
      `;
      
      const briefingResult = await client.query(briefingQuery, [orcamento.briefing_id]);
      
      if (briefingResult.rows.length > 0) {
        const briefing = briefingResult.rows[0];
        console.log('✅ BRIEFING ENCONTRADO:');
        console.log(`   - Nome: ${briefing.nome}`);
        console.log(`   - Tipologia: ${briefing.tipologia}`);
        console.log(`   - Subtipo: ${briefing.subtipo}`);
        console.log(`   - Área Construída: ${briefing.area_construida}m²`);
        console.log(`   - Complexidade: ${briefing.complexidade}`);
        console.log(`   - Status: ${briefing.status}`);
        console.log(`   - Criado em: ${briefing.created_at}\n`);
      } else {
        console.log('❌ BRIEFING NÃO ENCONTRADO!\n');
      }
    }
    
    // Verificar dados do cliente
    if (orcamento.cliente_id) {
      console.log('3. 👤 VERIFICANDO DADOS DO CLIENTE...');
      
      const clienteQuery = `
        SELECT id, nome, email, telefone, empresa
        FROM clientes 
        WHERE id = $1
      `;
      
      const clienteResult = await client.query(clienteQuery, [orcamento.cliente_id]);
      
      if (clienteResult.rows.length > 0) {
        const cliente = clienteResult.rows[0];
        console.log('✅ CLIENTE ENCONTRADO:');
        console.log(`   - Nome: ${cliente.nome}`);
        console.log(`   - Email: ${cliente.email || 'NULL'}`);
        console.log(`   - Telefone: ${cliente.telefone || 'NULL'}`);
        console.log(`   - Empresa: ${cliente.empresa || 'NULL'}\n`);
      } else {
        console.log('❌ CLIENTE NÃO ENCONTRADO!\n');
      }
    }
    
    // Verificar disciplinas do orçamento
    console.log('4. 🔧 VERIFICANDO DISCIPLINAS DO ORÇAMENTO...');
    
    const disciplinasQuery = `
      SELECT 
        disciplina_codigo,
        ativo,
        valor_disciplina,
        horas_estimadas,
        configuracoes
      FROM orcamento_disciplinas 
      WHERE orcamento_id = $1
    `;
    
    const disciplinasResult = await client.query(disciplinasQuery, [62]);
    
    if (disciplinasResult.rows.length > 0) {
      console.log('✅ DISCIPLINAS ENCONTRADAS:');
      disciplinasResult.rows.forEach(disc => {
        console.log(`   - ${disc.disciplina_codigo}: ${disc.ativo ? 'ATIVO' : 'INATIVO'} - R$ ${disc.valor_disciplina?.toLocaleString('pt-BR') || '0'}`);
      });
      console.log('');
    } else {
      console.log('❌ NENHUMA DISCIPLINA ENCONTRADA!\n');
    }
    
    // Verificar cronograma
    console.log('5. 📅 VERIFICANDO CRONOGRAMA DO ORÇAMENTO...');
    
    const cronogramaQuery = `
      SELECT 
        fase_id,
        nome_fase,
        prazo_semanas,
        valor_fase,
        ordem,
        ativo
      FROM orcamento_cronograma 
      WHERE orcamento_id = $1
      ORDER BY ordem
    `;
    
    const cronogramaResult = await client.query(cronogramaQuery, [62]);
    
    if (cronogramaResult.rows.length > 0) {
      console.log('✅ CRONOGRAMA ENCONTRADO:');
      let prazoTotal = 0;
      cronogramaResult.rows.forEach(fase => {
        console.log(`   - ${fase.nome_fase}: ${fase.prazo_semanas} semanas - R$ ${fase.valor_fase?.toLocaleString('pt-BR') || '0'}`);
        if (fase.ativo) prazoTotal += parseFloat(fase.prazo_semanas || 0);
      });
      console.log(`   PRAZO TOTAL: ${prazoTotal} semanas\n`);
    } else {
      console.log('❌ NENHUM CRONOGRAMA ENCONTRADO!\n');
    }
    
    // Análise final
    console.log('🎯 ANÁLISE FINAL:');
    
    const problemas = [];
    
    if (!orcamento.briefing_id) problemas.push('Briefing não associado');
    if (!orcamento.valor_total) problemas.push('Valor total não calculado');
    if (!orcamento.prazo_entrega) problemas.push('Prazo de entrega não definido');
    if (!orcamento.cliente_id) problemas.push('Cliente não associado');
    if (disciplinasResult.rows.length === 0) problemas.push('Disciplinas não configuradas');
    if (cronogramaResult.rows.length === 0) problemas.push('Cronograma não gerado');
    
    if (problemas.length === 0) {
      console.log('✅ ORÇAMENTO 62 ESTÁ COMPLETO NO BANCO!');
      console.log('   Todos os dados necessários estão armazenados.');
    } else {
      console.log('⚠️ PROBLEMAS ENCONTRADOS:');
      problemas.forEach(problema => {
        console.log(`   - ${problema}`);
      });
      console.log('\n   Estes problemas explicam por que a página aparece vazia.');
    }
    
  } catch (error) {
    console.error('❌ ERRO NA VERIFICAÇÃO:', error);
  }
}

// Executar verificação
verificarOrcamento62()
  .then(() => {
    console.log('\n🔍 VERIFICAÇÃO CONCLUÍDA');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NA VERIFICAÇÃO:', error);
    process.exit(1);
  });