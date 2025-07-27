/**
 * 🔄 RESETAR CONFIGURAÇÕES COM VALORES PADRÃO 2025
 * Aplicar os novos valores realistas do mercado brasileiro
 */

const { connectDatabase, query } = require('./config/database');

async function resetarConfiguracoes2025() {
  console.log('🔄 RESETANDO CONFIGURAÇÕES COM VALORES PADRÃO 2025\n');

  try {
    await connectDatabase();

    const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // 1. Verificar configurações atuais
    console.log('1️⃣ Verificando configurações atuais...');
    
    const estadoAtual = await query(`
      SELECT configuracoes, versao, updated_at 
      FROM configuracoes_escritorio 
      WHERE escritorio_id = $1
    `, [escritorioId]);

    if (estadoAtual.rows.length > 0) {
      const config = estadoAtual.rows[0].configuracoes;
      console.log('   Configurações encontradas:');
      console.log(`   - Versão atual: ${estadoAtual.rows[0].versao}`);
      console.log(`   - ARQUITETURA valor_base atual: R$ ${config.disciplinas?.ARQUITETURA?.valor_base || 'N/A'}`);
      console.log(`   - ARQUITETURA valor_por_m2 atual: R$ ${config.disciplinas?.ARQUITETURA?.valor_por_m2 || 'N/A'}`);
      console.log(`   - Margem lucro atual: ${config.custos_indiretos?.margem_lucro || 'N/A'}%`);
    } else {
      console.log('   Nenhuma configuração encontrada - será criada nova');
    }

    // 2. Aplicar novos valores padrão 2025
    console.log('\n2️⃣ Aplicando valores padrão 2025...');
    
    const configuracoes2025 = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 18000,      // R$ 18.000 - projeto arquitetônico completo
          valor_por_m2: 85,       // R$ 85/m² - média nacional atualizada
          valor_por_hora: 180,    // R$ 180/hora - arquiteto sênior
          horas_estimadas: 120,   // 120h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        ESTRUTURAL: {
          ativo: true,
          valor_base: 15000,      // R$ 15.000 - projeto estrutural completo
          valor_por_m2: 55,       // R$ 55/m² - 30-35% do arquitetônico
          valor_por_hora: 220,    // R$ 220/hora - engenheiro estrutural
          horas_estimadas: 80,    // 80h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        INSTALACOES_ELETRICAS: {
          ativo: false,
          valor_base: 8500,       // R$ 8.500 - projeto elétrico completo
          valor_por_m2: 28,       // R$ 28/m² - 15-20% do arquitetônico
          valor_por_hora: 160,    // R$ 160/hora - engenheiro elétrico
          horas_estimadas: 60,    // 60h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        INSTALACOES_HIDRAULICAS: {
          ativo: false,
          valor_base: 9500,       // R$ 9.500 - projeto hidrossanitário
          valor_por_m2: 32,       // R$ 32/m² - 18-22% do arquitetônico
          valor_por_hora: 160,    // R$ 160/hora - engenheiro hidráulico
          horas_estimadas: 65,    // 65h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        CLIMATIZACAO: {
          ativo: false,
          valor_base: 7500,       // R$ 7.500 - projeto de climatização
          valor_por_m2: 22,       // R$ 22/m² - 12-15% do arquitetônico
          valor_por_hora: 150,    // R$ 150/hora - especialista
          horas_estimadas: 50,    // 50h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        PAISAGISMO: {
          ativo: false,
          valor_base: 6500,       // R$ 6.500 - projeto paisagístico
          valor_por_m2: 18,       // R$ 18/m² - 10-12% do arquitetônico
          valor_por_hora: 140,    // R$ 140/hora - paisagista
          horas_estimadas: 45,    // 45h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        INTERIORES: {
          ativo: false,
          valor_base: 12000,      // R$ 12.000 - design de interiores
          valor_por_m2: 45,       // R$ 45/m² - 25-30% do arquitetônico
          valor_por_hora: 160,    // R$ 160/hora - designer
          horas_estimadas: 75,    // 75h para projeto médio
          multiplicador_complexidade_padrao: 1.0
        },
        APROVACAO_LEGAL: {
          ativo: false,
          valor_base: 8000,       // R$ 8.000 - projeto legal + aprovação
          valor_por_m2: 25,       // R$ 25/m² - taxa fixa + acompanhamento
          valor_por_hora: 180,    // R$ 180/hora - tramitação
          horas_estimadas: 40,    // 40h para aprovação
          multiplicador_complexidade_padrao: 1.0
        },
        MODELAGEM_3D: {
          ativo: false,
          valor_base: 5500,       // R$ 5.500 - modelagem + renderizações
          valor_por_m2: 15,       // R$ 15/m² - complementar
          valor_por_hora: 120,    // R$ 120/hora - modelador 3D
          horas_estimadas: 35,    // 35h para modelagem completa
          multiplicador_complexidade_padrao: 1.0
        }
      },
      multiplicadores_regionais: {
        norte: { nome: "Norte", multiplicador: 0.75 },           // AM, RR, AP, PA, TO, AC, RO
        nordeste: { nome: "Nordeste", multiplicador: 0.85 },     // BA, SE, AL, PE, PB, RN, CE, PI, MA
        centro_oeste: { nome: "Centro-Oeste", multiplicador: 0.95 }, // MT, MS, GO, DF
        sudeste: { nome: "Sudeste", multiplicador: 1.25 },       // SP, RJ, MG, ES
        sul: { nome: "Sul", multiplicador: 1.10 }                // RS, SC, PR
      },
      padroes_construcao: {
        economico: { nome: "Econômico", multiplicador: 0.65 },   // Acabamentos básicos
        popular: { nome: "Popular", multiplicador: 0.80 },       // Padrão MCMV
        medio: { nome: "Médio", multiplicador: 1.00 },           // Referência de mercado
        alto: { nome: "Alto Padrão", multiplicador: 1.50 },      // Acabamentos superiores
        luxo: { nome: "Luxo", multiplicador: 2.20 },             // Acabamentos premium
        ultra_luxo: { nome: "Ultra Luxo", multiplicador: 3.50 }  // Projetos únicos
      },
      custos_indiretos: {
        margem_lucro: 28.0,           // 28% - margem líquida desejada
        overhead: 18.0,               // 18% - custos operacionais
        impostos: 16.33,              // 16.33% - Simples Nacional faixa 4
        reserva_contingencia: 8.0,    // 8% - imprevistos e alterações
        comissao_vendas: 5.0,         // 5% - comissão para captação
        marketing: 3.0,               // 3% - investimento em marketing
        capacitacao: 2.0,             // 2% - treinamentos profissionais
        seguros: 1.5                  // 1.5% - seguro profissional
      },
      multiplicadores_complexidade: {
        muito_simples: 0.60,    // Projetos padronizados, repetitivos
        simples: 0.80,          // Projetos convencionais
        normal: 1.00,           // Referência - projetos típicos
        complexo: 1.35,         // Projetos com desafios técnicos
        muito_complexo: 1.75,   // Alta complexidade técnica
        excepcional: 2.50,      // Projetos únicos, P&D
        experimental: 3.20      // Projetos experimentais
      },
      configuracoes_comerciais: {
        desconto_maximo_permitido: 15.0,        // 15% desconto máximo
        valor_minimo_projeto: 8500.0,           // R$ 8.500 valor mínimo
        forma_pagamento_padrao: "30_60_90",     // 30/60/90 dias
        juros_parcelamento: 2.8,                // 2.8% a.m. para parcelamento
        desconto_pagamento_vista: 8.0,          // 8% desconto à vista
        multa_atraso_pagamento: 2.0,            // 2% multa por atraso
        juros_mora: 1.0,                        // 1% a.m. juros de mora
        reajuste_anual: 6.5,                    // 6.5% reajuste anual (INCC)
        prazo_garantia_projeto: 60,             // 60 meses garantia
        prazo_revisao_gratuita: 6               // 6 meses revisões gratuitas
      },
      configuracoes_escritorio: {
        // Dados da empresa (exemplo)
        razao_social: "ArcFlow Projetos e Consultoria Ltda",
        nome_fantasia: "ArcFlow Arquitetura",
        cnpj: "12.345.678/0001-90",
        
        // Configurações técnicas
        regime_tributario: "simples_nacional",
        regiao_principal: "sudeste",
        especialidade: "residencial_comercial",
        nivel_experiencia: "senior",
        ano_fundacao: 2018,
        numero_funcionarios: 8,
        
        // Responsável técnico
        responsavel_tecnico: {
          nome: "Arq. Maria Silva Santos",
          registro_profissional: "CAU A12345-6",
          email: "maria.santos@arcflow.com.br"
        },
        
        // Áreas de atuação
        areas_atuacao: [
          "Projetos Residenciais",
          "Projetos Comerciais", 
          "Projetos Institucionais",
          "Consultoria em Sustentabilidade"
        ]
      }
    };

    console.log('   ✅ Configurações 2025 preparadas');

    // 3. Salvar no banco
    console.log('\n3️⃣ Salvando no banco de dados...');
    
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
      JSON.stringify(configuracoes2025),
      '2025.1'
    ]);

    console.log('   ✅ Configurações 2025 salvas com sucesso!');
    console.log(`   Nova versão: ${resultado.rows[0].versao}`);
    console.log(`   Timestamp: ${resultado.rows[0].updated_at}`);

    // 4. Verificar valores aplicados
    console.log('\n4️⃣ Verificando valores aplicados...');
    
    const configFinal = resultado.rows[0].configuracoes;
    
    console.log('   📊 DISCIPLINAS ATUALIZADAS:');
    console.log(`   - ARQUITETURA: R$ ${configFinal.disciplinas.ARQUITETURA.valor_base} base | R$ ${configFinal.disciplinas.ARQUITETURA.valor_por_m2}/m²`);
    console.log(`   - ESTRUTURAL: R$ ${configFinal.disciplinas.ESTRUTURAL.valor_base} base | R$ ${configFinal.disciplinas.ESTRUTURAL.valor_por_m2}/m²`);
    console.log(`   - INSTALAÇÕES ELÉTRICAS: R$ ${configFinal.disciplinas.INSTALACOES_ELETRICAS.valor_base} base | R$ ${configFinal.disciplinas.INSTALACOES_ELETRICAS.valor_por_m2}/m²`);
    console.log(`   - INSTALAÇÕES HIDRÁULICAS: R$ ${configFinal.disciplinas.INSTALACOES_HIDRAULICAS.valor_base} base | R$ ${configFinal.disciplinas.INSTALACOES_HIDRAULICAS.valor_por_m2}/m²`);
    
    console.log('\n   🌍 MULTIPLICADORES REGIONAIS:');
    Object.entries(configFinal.multiplicadores_regionais).forEach(([regiao, dados]) => {
      console.log(`   - ${dados.nome}: ${dados.multiplicador}x`);
    });
    
    console.log('\n   🏠 PADRÕES DE CONSTRUÇÃO:');
    Object.entries(configFinal.padroes_construcao).forEach(([padrao, dados]) => {
      console.log(`   - ${dados.nome}: ${dados.multiplicador}x`);
    });
    
    console.log('\n   📊 CUSTOS INDIRETOS:');
    console.log(`   - Margem lucro: ${configFinal.custos_indiretos.margem_lucro}%`);
    console.log(`   - Overhead: ${configFinal.custos_indiretos.overhead}%`);
    console.log(`   - Impostos: ${configFinal.custos_indiretos.impostos}%`);
    console.log(`   - Contingência: ${configFinal.custos_indiretos.reserva_contingencia}%`);
    console.log(`   - Comissão vendas: ${configFinal.custos_indiretos.comissao_vendas}%`);
    console.log(`   - Marketing: ${configFinal.custos_indiretos.marketing}%`);
    console.log(`   - Capacitação: ${configFinal.custos_indiretos.capacitacao}%`);
    console.log(`   - Seguros: ${configFinal.custos_indiretos.seguros}%`);

    // 5. Calcular multiplicador total de custos indiretos
    const custos = configFinal.custos_indiretos;
    const multiplicadorTotal = (1 + custos.margem_lucro/100) * 
                              (1 + custos.overhead/100) * 
                              (1 + custos.impostos/100) * 
                              (1 + custos.reserva_contingencia/100) * 
                              (1 + custos.comissao_vendas/100) * 
                              (1 + custos.marketing/100) * 
                              (1 + custos.capacitacao/100) * 
                              (1 + custos.seguros/100);

    console.log(`\n   💰 MULTIPLICADOR TOTAL CUSTOS INDIRETOS: ${multiplicadorTotal.toFixed(3)}x`);

    // 6. Exemplo de cálculo com novos valores
    console.log('\n5️⃣ Exemplo de cálculo com novos valores...');
    
    const exemploCalculo = {
      area: 200,                    // 200m²
      regiao: 'sudeste',           // Sudeste (1.25x)
      padrao: 'alto',              // Alto padrão (1.50x)
      complexidade: 'normal'       // Normal (1.00x)
    };

    console.log(`   📋 Projeto exemplo: ${exemploCalculo.area}m², ${exemploCalculo.regiao}, ${exemploCalculo.padrao}, ${exemploCalculo.complexidade}`);

    // Calcular ARQUITETURA
    const valorBasePorM2 = configFinal.disciplinas.ARQUITETURA.valor_por_m2 * exemploCalculo.area;
    const multRegional = configFinal.multiplicadores_regionais[exemploCalculo.regiao].multiplicador;
    const multPadrao = configFinal.padroes_construcao[exemploCalculo.padrao].multiplicador;
    const multComplexidade = configFinal.multiplicadores_complexidade[exemploCalculo.complexidade];
    
    const subtotalArquitetura = valorBasePorM2 * multRegional * multPadrao * multComplexidade;
    const valorFinalArquitetura = subtotalArquitetura * multiplicadorTotal;

    console.log(`   💰 ARQUITETURA:`);
    console.log(`      Base: R$ ${configFinal.disciplinas.ARQUITETURA.valor_por_m2}/m² × ${exemploCalculo.area}m² = R$ ${valorBasePorM2.toFixed(2)}`);
    console.log(`      Multiplicadores: ${multRegional} × ${multPadrao} × ${multComplexidade} = ${(multRegional * multPadrao * multComplexidade).toFixed(3)}x`);
    console.log(`      Subtotal: R$ ${subtotalArquitetura.toFixed(2)}`);
    console.log(`      Custos indiretos: R$ ${subtotalArquitetura.toFixed(2)} × ${multiplicadorTotal.toFixed(3)} = R$ ${valorFinalArquitetura.toFixed(2)}`);

    console.log('\n🎉 RESET CONCLUÍDO COM SUCESSO!');
    console.log('   ✅ Valores padrão 2025 aplicados');
    console.log('   ✅ Todas as disciplinas atualizadas');
    console.log('   ✅ Multiplicadores regionais atualizados');
    console.log('   ✅ Padrões de construção expandidos');
    console.log('   ✅ Custos indiretos detalhados');
    console.log('   ✅ Configurações comerciais realistas');
    console.log('   ✅ Sistema pronto para uso com valores de mercado');

  } catch (error) {
    console.error('❌ Erro durante o reset:', error);
  }
}

// Executar reset
if (require.main === module) {
  resetarConfiguracoes2025()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { resetarConfiguracoes2025 };