/**
 * 🧹 RESETAR CONFIGURAÇÕES PARA ESTADO LIMPO
 * Limpar dados corrompidos e restaurar configurações válidas
 */

const { connectDatabase, query } = require('./config/database');

async function resetarConfiguracoes() {
  console.log('🧹 RESETANDO CONFIGURAÇÕES PARA ESTADO LIMPO\n');

  try {
    await connectDatabase();

    const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // 1. Verificar estado atual
    console.log('1️⃣ Verificando estado atual...');
    
    const estadoAtual = await query(`
      SELECT configuracoes 
      FROM configuracoes_escritorio 
      WHERE escritorio_id = $1
    `, [escritorioId]);

    if (estadoAtual.rows.length > 0) {
      const config = estadoAtual.rows[0].configuracoes;
      console.log('   Estado atual encontrado:');
      console.log(`   - ARQUITETURA valor_base: ${config.disciplinas?.ARQUITETURA?.valor_base}`);
      console.log(`   - ARQUITETURA valor_por_m2: ${config.disciplinas?.ARQUITETURA?.valor_por_m2}`);
      console.log(`   - ESTRUTURAL valor_base: ${config.disciplinas?.ESTRUTURAL?.valor_base}`);
    } else {
      console.log('   Nenhuma configuração encontrada');
    }

    // 2. Configuração limpa e válida
    console.log('\n2️⃣ Preparando configuração limpa...');
    
    const configuracaoLimpa = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 15000,
          valor_por_m2: 75,
          valor_por_hora: 150,
          horas_estimadas: 120,
          multiplicador_complexidade_padrao: 1.0
        },
        ESTRUTURAL: {
          ativo: true,
          valor_base: 12000,
          valor_por_m2: 45,
          valor_por_hora: 180,
          horas_estimadas: 80,
          multiplicador_complexidade_padrao: 1.0
        },
        INSTALACOES_HIDRAULICAS: {
          ativo: true,
          valor_base: 8000,
          valor_por_m2: 25,
          valor_por_hora: 120,
          horas_estimadas: 60,
          multiplicador_complexidade_padrao: 1.0
        },
        INSTALACOES_ELETRICAS: {
          ativo: false,
          valor_base: 7000,
          valor_por_m2: 22,
          valor_por_hora: 110,
          horas_estimadas: 50,
          multiplicador_complexidade_padrao: 1.0
        },
        PAISAGISMO: {
          ativo: false,
          valor_base: 5000,
          valor_por_m2: 15,
          valor_por_hora: 100,
          horas_estimadas: 40,
          multiplicador_complexidade_padrao: 1.0
        }
      },
      multiplicadores_regionais: {
        norte: { nome: "Norte", multiplicador: 0.85 },
        nordeste: { nome: "Nordeste", multiplicador: 0.90 },
        centro_oeste: { nome: "Centro-Oeste", multiplicador: 0.95 },
        sudeste: { nome: "Sudeste", multiplicador: 1.15 },
        sul: { nome: "Sul", multiplicador: 1.05 }
      },
      padroes_construcao: {
        simples: { nome: "Simples", multiplicador: 0.7 },
        medio: { nome: "Médio", multiplicador: 1.0 },
        alto: { nome: "Alto", multiplicador: 1.4 },
        luxo: { nome: "Luxo", multiplicador: 1.8 },
        premium: { nome: "Premium", multiplicador: 2.5 }
      },
      custos_indiretos: {
        margem_lucro: 25.0,
        overhead: 15.0,
        impostos: 13.65,
        reserva_contingencia: 5.0,
        comissao_vendas: 3.0
      },
      multiplicadores_complexidade: {
        muito_simples: 0.6,
        simples: 0.8,
        normal: 1.0,
        complexo: 1.3,
        muito_complexo: 1.6,
        excepcional: 2.0
      },
      configuracoes_prazo: {
        fator_urgencia: {
          normal: 1.0,
          urgente: 0.8,
          muito_urgente: 0.6
        },
        adicional_revisoes: 1.2,
        buffer_seguranca: 1.1
      },
      configuracoes_comerciais: {
        desconto_maximo_permitido: 15.0,
        valor_minimo_projeto: 5000.0,
        forma_pagamento_padrao: "30_60_90",
        juros_parcelamento: 2.5,
        desconto_pagamento_vista: 5.0
      },
      configuracoes_escritorio: {
        regime_tributario: "simples_nacional",
        regiao_principal: "sudeste",
        especialidade: "residencial",
        nivel_experiencia: "senior"
      }
    };

    console.log('   ✅ Configuração limpa preparada');

    // 3. Resetar no banco
    console.log('\n3️⃣ Resetando no banco de dados...');
    
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
      JSON.stringify(configuracaoLimpa),
      '1.0'
    ]);

    console.log('   ✅ Configurações resetadas com sucesso!');
    console.log(`   Nova versão: ${resultado.rows[0].versao}`);
    console.log(`   Timestamp: ${resultado.rows[0].updated_at}`);

    // 4. Verificar estado final
    console.log('\n4️⃣ Verificando estado final...');
    
    const estadoFinal = await query(`
      SELECT configuracoes 
      FROM configuracoes_escritorio 
      WHERE escritorio_id = $1
    `, [escritorioId]);

    const configFinal = estadoFinal.rows[0].configuracoes;
    
    console.log('   Estado final:');
    console.log(`   - ARQUITETURA valor_base: R$ ${configFinal.disciplinas.ARQUITETURA.valor_base}`);
    console.log(`   - ARQUITETURA valor_por_m2: R$ ${configFinal.disciplinas.ARQUITETURA.valor_por_m2}`);
    console.log(`   - ESTRUTURAL valor_base: R$ ${configFinal.disciplinas.ESTRUTURAL.valor_base}`);
    console.log(`   - ESTRUTURAL valor_por_m2: R$ ${configFinal.disciplinas.ESTRUTURAL.valor_por_m2}`);
    console.log(`   - Margem lucro: ${configFinal.custos_indiretos.margem_lucro}%`);
    console.log(`   - Overhead: ${configFinal.custos_indiretos.overhead}%`);

    // 5. Validar tipos de dados
    console.log('\n5️⃣ Validando tipos de dados...');
    
    const validacoes = [
      {
        campo: 'ARQUITETURA valor_base',
        valor: configFinal.disciplinas.ARQUITETURA.valor_base,
        tipo: typeof configFinal.disciplinas.ARQUITETURA.valor_base,
        esperado: 'number'
      },
      {
        campo: 'ARQUITETURA valor_por_m2',
        valor: configFinal.disciplinas.ARQUITETURA.valor_por_m2,
        tipo: typeof configFinal.disciplinas.ARQUITETURA.valor_por_m2,
        esperado: 'number'
      },
      {
        campo: 'Margem lucro',
        valor: configFinal.custos_indiretos.margem_lucro,
        tipo: typeof configFinal.custos_indiretos.margem_lucro,
        esperado: 'number'
      }
    ];

    let todasValidacoesOk = true;

    validacoes.forEach(validacao => {
      const ok = validacao.tipo === validacao.esperado && !isNaN(validacao.valor);
      const status = ok ? '✅' : '❌';
      
      console.log(`   ${status} ${validacao.campo}: ${validacao.valor} (${validacao.tipo})`);
      
      if (!ok) {
        todasValidacoesOk = false;
      }
    });

    if (todasValidacoesOk) {
      console.log('\n🎉 RESET CONCLUÍDO COM SUCESSO!');
      console.log('   ✅ Todos os dados estão em formato válido');
      console.log('   ✅ Configurações prontas para uso');
      console.log('   ✅ Pode testar o salvamento novamente');
    } else {
      console.log('\n❌ Ainda há problemas nos dados');
    }

  } catch (error) {
    console.error('❌ Erro durante o reset:', error);
  }
}

// Executar reset
if (require.main === module) {
  resetarConfiguracoes()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { resetarConfiguracoes };