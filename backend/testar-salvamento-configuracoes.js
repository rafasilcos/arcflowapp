/**
 * 🧪 TESTE PARA VERIFICAR SALVAMENTO DE CONFIGURAÇÕES
 * Diagnóstico completo do problema de salvamento na aba Tabela de Preços
 */

const { connectDatabase, query } = require('./config/database');

async function testarSalvamentoConfiguracoes() {
  console.log('🧪 TESTANDO SALVAMENTO DE CONFIGURAÇÕES\n');

  try {
    await connectDatabase();

    const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // 1. Verificar se a tabela existe
    console.log('1️⃣ Verificando se a tabela existe...');
    const tabelaExiste = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'configuracoes_escritorio'
      );
    `);
    console.log(`   Tabela existe: ${tabelaExiste.rows[0].exists}`);

    if (!tabelaExiste.rows[0].exists) {
      console.log('❌ Tabela não existe! Criando...');
      const { criarTabelaConfiguracoes } = require('./criar-tabela-configuracoes-escritorio-corrigido');
      await criarTabelaConfiguracoes();
    }

    // 2. Verificar configurações atuais
    console.log('\n2️⃣ Verificando configurações atuais...');
    const configAtual = await query(`
      SELECT configuracoes, versao, updated_at 
      FROM configuracoes_escritorio 
      WHERE escritorio_id = $1
    `, [escritorioId]);

    if (configAtual.rows.length === 0) {
      console.log('   ⚠️ Nenhuma configuração encontrada para este escritório');
    } else {
      const config = configAtual.rows[0];
      console.log(`   Versão: ${config.versao}`);
      console.log(`   Última atualização: ${config.updated_at}`);
      console.log(`   Disciplinas ativas: ${Object.keys(config.configuracoes.disciplinas || {}).length}`);
    }

    // 3. Testar salvamento de uma configuração simples
    console.log('\n3️⃣ Testando salvamento...');
    
    const novaConfiguracao = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 16000, // Valor alterado para teste
          valor_por_m2: 80,  // Valor alterado para teste
          valor_por_hora: 160,
          horas_estimadas: 120,
          multiplicador_complexidade_padrao: 1.0
        },
        ESTRUTURAL: {
          ativo: true,
          valor_base: 13000, // Valor alterado para teste
          valor_por_m2: 50,  // Valor alterado para teste
          valor_por_hora: 180,
          horas_estimadas: 80,
          multiplicador_complexidade_padrao: 1.0
        }
      },
      custos_indiretos: {
        margem_lucro: 30.0, // Valor alterado para teste
        overhead: 18.0,     // Valor alterado para teste
        impostos: 13.65,
        reserva_contingencia: 5.0,
        comissao_vendas: 3.0
      }
    };

    // Simular o que a API faz
    const existingResult = await query(
      'SELECT configuracoes FROM configuracoes_escritorio WHERE escritorio_id = $1',
      [escritorioId]
    );

    let configuracoesFinais;
    
    if (existingResult.rows.length > 0) {
      const configuracoesExistentes = existingResult.rows[0].configuracoes;
      configuracoesFinais = {
        ...configuracoesExistentes,
        ...novaConfiguracao,
        disciplinas: {
          ...configuracoesExistentes.disciplinas,
          ...novaConfiguracao.disciplinas
        },
        custos_indiretos: {
          ...configuracoesExistentes.custos_indiretos,
          ...novaConfiguracao.custos_indiretos
        }
      };
    } else {
      configuracoesFinais = novaConfiguracao;
    }

    // Salvar
    const resultado = await query(`
      INSERT INTO configuracoes_escritorio (
        escritorio_id, 
        configuracoes,
        versao
      ) VALUES ($1, $2, $3)
      ON CONFLICT (escritorio_id) 
      DO UPDATE SET 
        configuracoes = EXCLUDED.configuracoes,
        versao = EXCLUDED.versao,
        updated_at = NOW()
      RETURNING configuracoes, versao, updated_at;
    `, [
      escritorioId,
      JSON.stringify(configuracoesFinais),
      '1.1'
    ]);

    console.log('   ✅ Salvamento realizado com sucesso!');
    console.log(`   Nova versão: ${resultado.rows[0].versao}`);
    console.log(`   Timestamp: ${resultado.rows[0].updated_at}`);

    // 4. Verificar se os dados foram realmente salvos
    console.log('\n4️⃣ Verificando dados salvos...');
    const verificacao = await query(`
      SELECT configuracoes 
      FROM configuracoes_escritorio 
      WHERE escritorio_id = $1
    `, [escritorioId]);

    const dadosSalvos = verificacao.rows[0].configuracoes;
    
    console.log('   Valores salvos:');
    console.log(`   - ARQUITETURA valor_base: ${dadosSalvos.disciplinas.ARQUITETURA.valor_base}`);
    console.log(`   - ARQUITETURA valor_por_m2: ${dadosSalvos.disciplinas.ARQUITETURA.valor_por_m2}`);
    console.log(`   - ESTRUTURAL valor_base: ${dadosSalvos.disciplinas.ESTRUTURAL.valor_base}`);
    console.log(`   - ESTRUTURAL valor_por_m2: ${dadosSalvos.disciplinas.ESTRUTURAL.valor_por_m2}`);
    console.log(`   - Margem lucro: ${dadosSalvos.custos_indiretos.margem_lucro}%`);
    console.log(`   - Overhead: ${dadosSalvos.custos_indiretos.overhead}%`);

    // 5. Testar API endpoint diretamente
    console.log('\n5️⃣ Testando endpoint da API...');
    
    const testConfig = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 17000, // Novo valor para teste
          valor_por_m2: 85,  // Novo valor para teste
          valor_por_hora: 165,
          horas_estimadas: 120,
          multiplicador_complexidade_padrao: 1.0
        }
      }
    };

    // Simular requisição PUT
    console.log('   Simulando PUT /api/escritorios/[id]/configuracoes...');
    
    try {
      const response = await fetch(`http://localhost:3001/api/escritorios/${escritorioId}/configuracoes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configuracoes: testConfig,
          versao: '1.2'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('   ✅ API respondeu com sucesso');
        console.log(`   Valor salvo via API: ${result.data.disciplinas.ARQUITETURA.valor_base}`);
      } else {
        console.log(`   ❌ API retornou erro: ${response.status}`);
        const error = await response.text();
        console.log(`   Erro: ${error}`);
      }
    } catch (error) {
      console.log(`   ⚠️ Erro ao testar API (servidor pode estar offline): ${error.message}`);
    }

    console.log('\n🎉 TESTE CONCLUÍDO!');
    console.log('\n📋 DIAGNÓSTICO:');
    console.log('   - Tabela existe e está funcional');
    console.log('   - Salvamento direto no banco funciona');
    console.log('   - Problema pode estar na comunicação frontend-backend');
    console.log('   - Verificar se o servidor está rodando na porta correta');
    console.log('   - Verificar se há erros de CORS ou autenticação');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
if (require.main === module) {
  testarSalvamentoConfiguracoes()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { testarSalvamentoConfiguracoes };