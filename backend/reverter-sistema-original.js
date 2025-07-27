/**
 * 🔄 REVERTER SISTEMA PARA ESTADO ORIGINAL
 * Desfazer mudanças e voltar ao orçamento multidisciplinar
 */

const { Client } = require('pg');

async function reverterSistemaOriginal() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔄 REVERTENDO SISTEMA PARA ESTADO ORIGINAL');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // 1. RESTAURAR cronograma multidisciplinar original
    console.log('🔧 1. Restaurando cronograma multidisciplinar...');
    
    const cronogramaOriginal = {
      fases: {
        // FASE 1: LEVANTAMENTO E PROGRAMA
        "LV_LEVANTAMENTO_DADOS": {
          "ordem": 1,
          "etapa": "A - CONCEPÇÃO",
          "nome": "LV - Levantamento de Dados",
          "prazo": 1,
          "valor": 1275,
          "percentual": 0.05,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Levantamento topográfico",
            "Cadastro da edificação existente (se houver)",
            "Levantamento de dados climáticos",
            "Levantamento de dados geotécnicos",
            "Levantamento de dados sobre infraestrutura local"
          ],
          "horasEstimadas": 7,
          "observacoes": "Base para todas as disciplinas"
        },
        
        "PN_PROGRAMA_NECESSIDADES": {
          "ordem": 2,
          "etapa": "A - CONCEPÇÃO",
          "nome": "PN - Programa de Necessidades",
          "prazo": 1,
          "valor": 1275,
          "percentual": 0.05,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Programa arquitetônico detalhado",
            "Organograma funcional",
            "Fluxograma das atividades",
            "Pré-dimensionamento dos ambientes",
            "Definição de padrão de acabamento"
          ],
          "horasEstimadas": 7,
          "observacoes": "Define requisitos para todas as disciplinas"
        },
        
        // FASE 2: ESTUDOS
        "EV_ESTUDO_VIABILIDADE": {
          "ordem": 3,
          "etapa": "B - DEFINIÇÃO",
          "nome": "EV - Estudo de Viabilidade",
          "prazo": 2,
          "valor": 2550,
          "percentual": 0.1,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL"],
          "entregaveis": [
            "Estudo de massa arquitetônico",
            "Análise de viabilidade legal",
            "Pré-dimensionamento estrutural",
            "Análise de custos preliminar",
            "Relatório de viabilidade técnica"
          ],
          "horasEstimadas": 14,
          "observacoes": "Validação da viabilidade técnica e legal"
        },
        
        "EP_ESTUDO_PRELIMINAR": {
          "ordem": 4,
          "etapa": "B - DEFINIÇÃO",
          "nome": "EP - Estudo Preliminar",
          "prazo": 3,
          "valor": 3825,
          "percentual": 0.15,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Plantas baixas dos pavimentos",
            "Planta de cobertura",
            "Cortes longitudinais e transversais",
            "Fachadas principais",
            "Planta de situação e locação",
            "Memorial justificativo"
          ],
          "horasEstimadas": 21,
          "observacoes": "Definição da concepção arquitetônica"
        },
        
        // FASE 3: ANTEPROJETO MULTIDISCIPLINAR
        "AP_ANTEPROJETO": {
          "ordem": 5,
          "etapa": "C - INTERFACES",
          "nome": "AP - Anteprojeto Multidisciplinar",
          "prazo": 6,
          "valor": 7650,
          "percentual": 0.3,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "entregaveis": [
            "Plantas baixas com dimensionamento",
            "Cortes e fachadas cotados",
            "Planta de cobertura detalhada",
            "Lançamento da estrutura",
            "Esquema vertical de distribuição elétrica",
            "Esquema vertical de distribuição hidráulica",
            "Compatibilização entre disciplinas",
            "Memorial descritivo multidisciplinar"
          ],
          "horasEstimadas": 42,
          "observacoes": "Compatibilização e definição de interfaces"
        },
        
        // FASE 4: PROJETO LEGAL
        "PL_PROJETO_LEGAL": {
          "ordem": 6,
          "etapa": "D - APROVAÇÃO",
          "nome": "PL - Projeto Legal",
          "prazo": 3,
          "valor": 3825,
          "percentual": 0.15,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Plantas, cortes e fachadas para aprovação",
            "Memorial descritivo conforme legislação",
            "Quadro de áreas conforme normas",
            "Relatório de acessibilidade (se aplicável)",
            "Documentação para aprovação na prefeitura"
          ],
          "horasEstimadas": 21,
          "observacoes": "Adequação às normas e legislação local"
        },
        
        // FASE 5: PROJETO BÁSICO MULTIDISCIPLINAR
        "PB_PROJETO_BASICO": {
          "ordem": 7,
          "etapa": "E - PROJETO BÁSICO",
          "nome": "PB - Projeto Básico Multidisciplinar",
          "prazo": 4,
          "valor": 5100,
          "percentual": 0.2,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Projeto arquitetônico básico completo (plantas, cortes, fachadas e cobertura)",
            "Definição preliminar de materiais e acabamentos",
            "Indicação de acessos, fluxos, usos e zoneamentos dos ambientes",
            "Lançamento estrutural com dimensionamento preliminar dos elementos (vigas, pilares, lajes, fundações)",
            "Indicação dos principais sistemas estruturais adotados",
            "Memorial descritivo básico da estrutura",
            "Planta baixa com pontos de energia, iluminação e quadros de distribuição",
            "Diagrama unifilar simplificado",
            "Indicação de carga estimada por ambiente e quadro geral",
            "Planta com traçado preliminar de redes hidráulicas e sanitárias",
            "Lançamento dos principais pontos de consumo e esgoto",
            "Indicação do sistema de abastecimento e esgotamento",
            "Descrição técnica preliminar dos sistemas e materiais por disciplina",
            "Diretrizes para projeto executivo",
            "Indicações de desempenho mínimo esperado",
            "Estimativa de custos por disciplina (baseada em projetos básicos)",
            "Cronograma físico-financeiro preliminar com macroetapas",
            "Diretrizes para planejamento executivo da obra"
          ],
          "horasEstimadas": 28,
          "observacoes": "Projeto básico multidisciplinar completo - base técnica para licitação e contratação da obra",
          
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
          
          "produtosFinais": [
            "Especificações técnicas preliminares por disciplina",
            "Estimativa de custos detalhada por disciplina",
            "Cronograma físico-financeiro preliminar",
            "Diretrizes técnicas para projeto executivo",
            "Memorial descritivo multidisciplinar básico"
          ]
        },
        
        // FASE 6: PROJETO EXECUTIVO MULTIDISCIPLINAR
        "PE_PROJETO_EXECUTIVO": {
          "ordem": 8,
          "etapa": "F - PROJETO EXECUTIVO",
          "nome": "PE - Projeto Executivo Completo",
          "prazo": 6,
          "valor": 7650,
          "percentual": 0.3,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "entregaveis": [
            "Projeto arquitetônico executivo detalhado",
            "Projeto estrutural completo com armação",
            "Projeto elétrico executivo com detalhes",
            "Projeto hidrossanitário executivo completo",
            "Detalhamentos construtivos",
            "Especificações técnicas completas",
            "Caderno de encargos",
            "Lista de materiais e componentes",
            "Memoriais de cálculo estrutural",
            "Memoriais descritivos por disciplina"
          ],
          "horasEstimadas": 42,
          "observacoes": "Informações completas para execução da obra"
        }
      },
      
      // Informações gerais do cronograma
      prazoTotal: 26,
      valorTecnicoTotal: 33150,
      metodologia: "NBR_13532_SEQUENCIAL",
      disciplinasIncluidas: ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
      observacoes: "Cronograma sequencial conforme NBR 13532 com integração multidisciplinar",
      
      // Sequência de execução
      sequenciaExecucao: [
        "LV_LEVANTAMENTO_DADOS",
        "PN_PROGRAMA_NECESSIDADES", 
        "EV_ESTUDO_VIABILIDADE",
        "EP_ESTUDO_PRELIMINAR",
        "AP_ANTEPROJETO",
        "PL_PROJETO_LEGAL",
        "PB_PROJETO_BASICO",
        "PE_PROJETO_EXECUTIVO"
      ],
      
      // Marcos importantes
      marcos: {
        "Aprovação do Programa": "PN_PROGRAMA_NECESSIDADES",
        "Validação da Viabilidade": "EV_ESTUDO_VIABILIDADE", 
        "Aprovação da Concepção": "EP_ESTUDO_PRELIMINAR",
        "Compatibilização Concluída": "AP_ANTEPROJETO",
        "Aprovação Legal": "PL_PROJETO_LEGAL",
        "Liberação para Licitação": "PB_PROJETO_BASICO",
        "Liberação para Execução": "PE_PROJETO_EXECUTIVO"
      }
    };
    
    // 2. RESTAURAR valores originais
    console.log('💰 2. Restaurando valores originais...');
    
    const valorTotalOriginal = 36210;
    const valorPorM2Original = 144.84;
    const disciplinasOriginais = ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"];
    
    // 3. ATUALIZAR no banco
    console.log('💾 3. Atualizando orçamento no banco...');
    
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        cronograma = $1,
        disciplinas = $2,
        valor_total = $3,
        valor_por_m2 = $4,
        updated_at = NOW()
      WHERE id = $5
    `, [
      JSON.stringify(cronogramaOriginal),
      JSON.stringify(disciplinasOriginais),
      valorTotalOriginal,
      valorPorM2Original,
      orcamentoId
    ]);
    
    console.log('✅ Orçamento revertido no banco');
    console.log(`🔄 Linhas afetadas: ${updateResult.rowCount}`);
    
    // 4. RESUMO da reversão
    console.log('\n🎯 RESUMO DA REVERSÃO:');
    console.log('='.repeat(50));
    console.log(`📋 Disciplinas restauradas: ${disciplinasOriginais.length}`);
    console.log(`📅 Fases no cronograma: ${Object.keys(cronogramaOriginal.fases).length}`);
    console.log(`⏱️ Prazo total: ${cronogramaOriginal.prazoTotal} semanas`);
    console.log(`💰 Valor restaurado: R$ ${valorTotalOriginal.toLocaleString('pt-BR')}`);
    console.log(`💵 Valor por m²: R$ ${valorPorM2Original}`);
    
    console.log('\n✅ SISTEMA REVERTIDO COM SUCESSO!');
    console.log('🔄 Orçamento voltou ao estado multidisciplinar original');
    console.log('🎯 Todas as disciplinas estão ativas novamente');
    
  } catch (error) {
    console.error('❌ Erro na reversão:', error);
  } finally {
    await client.end();
  }
}

reverterSistemaOriginal();