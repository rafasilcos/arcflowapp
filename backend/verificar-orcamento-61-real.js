/**
 * 🔍 VERIFICAÇÃO REAL: ORÇAMENTO 61 NO BANCO
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarOrcamento61Real() {
  console.log('🔍 VERIFICANDO ORÇAMENTO 61 - DADOS REAIS DO BANCO\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // Verificar se o orçamento 61 existe
    const orcamentoResult = await client.query(`
      SELECT 
        id,
        codigo,
        nome,
        descricao,
        status,
        area_construida,
        area_terreno,
        valor_total,
        valor_por_m2,
        tipologia,
        padrao,
        complexidade,
        localizacao,
        disciplinas,
        cronograma,
        briefing_id,
        cliente_id,
        escritorio_id,
        created_at,
        updated_at
      FROM orcamentos 
      WHERE id = $1
    `, [61]);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ ORÇAMENTO 61 NÃO EXISTE NO BANCO!');
      console.log('\n📋 ORÇAMENTOS EXISTENTES:');
      
      const existentesResult = await client.query(`
        SELECT id, codigo, nome, valor_total, status 
        FROM orcamentos 
        ORDER BY id
      `);
      
      existentesResult.rows.forEach(orc => {
        console.log(`   ID ${orc.id}: ${orc.codigo} - ${orc.nome} - R$ ${orc.valor_total || 0} - ${orc.status}`);
      });
      
      console.log('\n🚨 PROBLEMA IDENTIFICADO:');
      console.log('   O frontend está tentando acessar orçamento ID 61 que não existe!');
      console.log('   Por isso foram usados dados mockados.');
      console.log('\n✅ SOLUÇÃO:');
      console.log('   1. Usar um ID de orçamento que realmente existe no banco');
      console.log('   2. Ou criar o orçamento 61 no banco com dados reais');
      
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    
    console.log('✅ ORÇAMENTO 61 ENCONTRADO NO BANCO!');
    console.log('\n📊 DADOS REAIS ARMAZENADOS:');
    console.log('=' .repeat(60));
    console.log(`ID: ${orcamento.id}`);
    console.log(`Código: ${orcamento.codigo}`);
    console.log(`Nome: ${orcamento.nome}`);
    console.log(`Descrição: ${orcamento.descricao || 'NULL'}`);
    console.log(`Status: ${orcamento.status || 'NULL'}`);
    console.log(`Área Construída: ${orcamento.area_construida || 'NULL'}m²`);
    console.log(`Área Terreno: ${orcamento.area_terreno || 'NULL'}m²`);
    console.log(`Valor Total: R$ ${orcamento.valor_total ? parseFloat(orcamento.valor_total).toLocaleString('pt-BR') : 'NULL'}`);
    console.log(`Valor por m²: R$ ${orcamento.valor_por_m2 ? parseFloat(orcamento.valor_por_m2).toLocaleString('pt-BR') : 'NULL'}/m²`);
    console.log(`Tipologia: ${orcamento.tipologia || 'NULL'}`);
    console.log(`Padrão: ${orcamento.padrao || 'NULL'}`);
    console.log(`Complexidade: ${orcamento.complexidade || 'NULL'}`);
    console.log(`Localização: ${orcamento.localizacao || 'NULL'}`);
    console.log(`Cliente ID: ${orcamento.cliente_id || 'NULL'}`);
    console.log(`Escritório ID: ${orcamento.escritorio_id || 'NULL'}`);
    console.log(`Criado em: ${orcamento.created_at}`);
    console.log(`Atualizado em: ${orcamento.updated_at}`);
    console.log('=' .repeat(60));
    
    // Verificar disciplinas
    if (orcamento.disciplinas) {
      console.log('\n🔧 DISCIPLINAS (JSON):');
      console.log(JSON.stringify(orcamento.disciplinas, null, 2));
    } else {
      console.log('\n❌ DISCIPLINAS: NULL');
    }
    
    // Verificar cronograma
    if (orcamento.cronograma) {
      console.log('\n📅 CRONOGRAMA (JSON):');
      console.log(JSON.stringify(orcamento.cronograma, null, 2));
      
      // Calcular prazo total se houver cronograma
      if (orcamento.cronograma.fases) {
        const prazoTotal = Object.values(orcamento.cronograma.fases).reduce((total, fase) => {
          return total + (fase.prazo || 0);
        }, 0);
        console.log(`\n⏱️ PRAZO TOTAL CALCULADO: ${prazoTotal} semanas`);
      }
    } else {
      console.log('\n❌ CRONOGRAMA: NULL');
    }
    
    // Verificar dados do cliente se existir
    if (orcamento.cliente_id) {
      console.log('\n👤 VERIFICANDO CLIENTE...');
      
      const clienteResult = await client.query(`
        SELECT id, nome, email, telefone, empresa
        FROM clientes 
        WHERE id = $1
      `, [orcamento.cliente_id]);
      
      if (clienteResult.rows.length > 0) {
        const cliente = clienteResult.rows[0];
        console.log('✅ CLIENTE ENCONTRADO:');
        console.log(`   Nome: ${cliente.nome}`);
        console.log(`   Email: ${cliente.email || 'NULL'}`);
        console.log(`   Telefone: ${cliente.telefone || 'NULL'}`);
        console.log(`   Empresa: ${cliente.empresa || 'NULL'}`);
      } else {
        console.log('❌ CLIENTE NÃO ENCONTRADO');
      }
    }
    
    // Análise final
    console.log('\n🎯 ANÁLISE DOS DADOS REAIS:');
    
    const problemas = [];
    const sucessos = [];
    
    if (orcamento.valor_total) {
      sucessos.push(`Valor total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    } else {
      problemas.push('Valor total não calculado');
    }
    
    if (orcamento.cronograma) {
      sucessos.push('Cronograma armazenado em JSON');
    } else {
      problemas.push('Cronograma não gerado');
    }
    
    if (orcamento.disciplinas) {
      sucessos.push('Disciplinas configuradas');
    } else {
      problemas.push('Disciplinas não configuradas');
    }
    
    if (orcamento.cliente_id) {
      sucessos.push('Cliente associado');
    } else {
      problemas.push('Cliente não associado');
    }
    
    if (sucessos.length > 0) {
      console.log('\n✅ DADOS DISPONÍVEIS:');
      sucessos.forEach(sucesso => console.log(`   - ${sucesso}`));
    }
    
    if (problemas.length > 0) {
      console.log('\n⚠️ DADOS FALTANDO:');
      problemas.forEach(problema => console.log(`   - ${problema}`));
    }
    
    console.log('\n🔧 PRÓXIMOS PASSOS:');
    if (problemas.length === 0) {
      console.log('✅ ORÇAMENTO 61 ESTÁ COMPLETO!');
      console.log('   O frontend deve usar estes dados reais do banco.');
      console.log('   Remover todos os dados mockados e usar apenas dados reais.');
    } else {
      console.log('⚠️ COMPLETAR DADOS FALTANDO:');
      console.log('   1. Calcular valores se necessário');
      console.log('   2. Gerar cronograma se necessário');
      console.log('   3. Configurar disciplinas se necessário');
      console.log('   4. Depois usar apenas dados reais do banco');
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

verificarOrcamento61Real()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 FALHA:', error);
    process.exit(1);
  });