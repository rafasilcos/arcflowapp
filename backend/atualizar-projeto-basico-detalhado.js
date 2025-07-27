/**
 * 🔧 ATUALIZAR PROJETO BÁSICO COM DETALHAMENTO CORRETO
 * Corrigir descrição conforme especificação técnica real
 */

const { Client } = require('pg');

async function atualizarProjetoBasicoDetalhado() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 ATUALIZANDO PROJETO BÁSICO COM DETALHAMENTO CORRETO');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // Buscar cronograma atual
    const result = await client.query(`
      SELECT cronograma FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    const cronogramaAtual = result.rows[0].cronograma;
    
    // Atualizar apenas a fase PB_PROJETO_BASICO com detalhamento correto
    cronogramaAtual.fases.PB_PROJETO_BASICO = {
      "ordem": 7,
      "etapa": "E - PROJETO BÁSICO",
      "nome": "PB - Projeto Básico Multidisciplinar",
      "prazo": 4,
      "valor": 5100,
      "percentual": 0.2,
      "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
      "responsavel": "Equipe Técnica",
      "entregaveis": [
        // 1. ARQUITETURA
        "Projeto arquitetônico básico completo (plantas, cortes, fachadas e cobertura)",
        "Definição preliminar de materiais e acabamentos",
        "Indicação de acessos, fluxos, usos e zoneamentos dos ambientes",
        
        // 2. ESTRUTURA
        "Lançamento estrutural com dimensionamento preliminar dos elementos (vigas, pilares, lajes, fundações)",
        "Indicação dos principais sistemas estruturais adotados",
        "Memorial descritivo básico da estrutura",
        
        // 3. ELÉTRICA
        "Planta baixa com pontos de energia, iluminação e quadros de distribuição",
        "Diagrama unifilar simplificado",
        "Indicação de carga estimada por ambiente e quadro geral",
        
        // 4. HIDROSSANITÁRIO
        "Planta com traçado preliminar de redes hidráulicas e sanitárias",
        "Lançamento dos principais pontos de consumo e esgoto",
        "Indicação do sistema de abastecimento e esgotamento",
        
        // 5. ESPECIFICAÇÕES TÉCNICAS
        "Descrição técnica preliminar dos sistemas e materiais por disciplina",
        "Diretrizes para projeto executivo",
        "Indicações de desempenho mínimo esperado",
        
        // 6. ORÇAMENTO E PLANEJAMENTO
        "Estimativa de custos por disciplina (baseada em projetos básicos)",
        "Cronograma físico-financeiro preliminar com macroetapas",
        "Diretrizes para planejamento executivo da obra"
      ],
      "horasEstimadas": 28,
      "observacoes": "Projeto básico multidisciplinar completo - base técnica para licitação e contratação da obra",
      
      // Detalhamento por disciplina
      "detalhamentoPorDisciplina": {
        "ARQUITETURA": {
          "entregaveis": [
            "Projeto arquitetônico básico completo (plantas, cortes, fachadas e cobertura)",
            "Definição preliminar de materiais e acabamentos", 
            "Indicação de acessos, fluxos, usos e zoneamentos dos ambientes"
          ],
          "observacoes": "Base arquitetônica para todas as outras disciplinas"
        },
        "ESTRUTURAL": {
          "entregaveis": [
            "Lançamento estrutural com dimensionamento preliminar dos elementos (vigas, pilares, lajes, fundações)",
            "Indicação dos principais sistemas estruturais adotados",
            "Memorial descritivo básico da estrutura"
          ],
          "observacoes": "Dimensionamento preliminar para estimativa de custos"
        },
        "INSTALACOES_ELETRICAS": {
          "entregaveis": [
            "Planta baixa com pontos de energia, iluminação e quadros de distribuição",
            "Diagrama unifilar simplificado",
            "Indicação de carga estimada por ambiente e quadro geral"
          ],
          "observacoes": "Base para dimensionamento da infraestrutura elétrica"
        },
        "INSTALACOES_HIDRAULICAS": {
          "entregaveis": [
            "Planta com traçado preliminar de redes hidráulicas e sanitárias",
            "Lançamento dos principais pontos de consumo e esgoto", 
            "Indicação do sistema de abastecimento e esgotamento"
          ],
          "observacoes": "Definição dos sistemas hidrossanitários principais"
        }
      },
      
      // Produtos finais da etapa
      "produtosFinais": [
        "Especificações técnicas preliminares por disciplina",
        "Estimativa de custos detalhada por disciplina",
        "Cronograma físico-financeiro preliminar",
        "Diretrizes técnicas para projeto executivo",
        "Memorial descritivo multidisciplinar básico"
      ]
    };
    
    console.log('📋 PROJETO BÁSICO ATUALIZADO:');
    console.log('-'.repeat(50));
    
    const pb = cronogramaAtual.fases.PB_PROJETO_BASICO;
    console.log(`📌 ${pb.nome}`);
    console.log(`📋 Etapa NBR: ${pb.etapa}`);
    console.log(`⏱️ Prazo: ${pb.prazo} semanas`);
    console.log(`💰 Valor: R$ ${pb.valor.toLocaleString('pt-BR')}`);
    console.log(`👥 Responsável: ${pb.responsavel}`);
    console.log(`🎯 Disciplinas: ${pb.disciplinas.join(', ')}`);
    console.log(`📦 Total de entregáveis: ${pb.entregaveis.length}`);
    
    console.log('\n📋 ENTREGÁVEIS DETALHADOS:');
    pb.entregaveis.forEach((entregavel, i) => {
      console.log(`${i+1}. ${entregavel}`);
    });
    
    console.log('\n🔍 DETALHAMENTO POR DISCIPLINA:');
    Object.entries(pb.detalhamentoPorDisciplina).forEach(([disciplina, detalhes]) => {
      console.log(`\n${disciplina}:`);
      detalhes.entregaveis.forEach((item, i) => {
        console.log(`  • ${item}`);
      });
      console.log(`  📝 ${detalhes.observacoes}`);
    });
    
    console.log('\n🎯 PRODUTOS FINAIS DA ETAPA:');
    pb.produtosFinais.forEach((produto, i) => {
      console.log(`${i+1}. ${produto}`);
    });
    
    // Atualizar no banco
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        cronograma = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(cronogramaAtual), orcamentoId]);
    
    console.log('\n✅ PROJETO BÁSICO ATUALIZADO NO BANCO');
    console.log(`🔄 Linhas afetadas: ${updateResult.rowCount}`);
    
    console.log('\n🎯 MELHORIAS IMPLEMENTADAS:');
    console.log('✅ Detalhamento técnico correto por disciplina');
    console.log('✅ Entregáveis específicos e realistas');
    console.log('✅ Produtos finais claramente definidos');
    console.log('✅ Observações técnicas por disciplina');
    console.log('✅ Complexidade real da etapa representada');
    console.log('✅ Base sólida para licitação e contratação');
    
  } catch (error) {
    console.error('❌ Erro na atualização:', error);
  } finally {
    await client.end();
  }
}

atualizarProjetoBasicoDetalhado();