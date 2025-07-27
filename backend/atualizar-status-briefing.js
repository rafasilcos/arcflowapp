/**
 * 🔧 ATUALIZAR CRONOGRAMA COM DETALHAMENTO TÉCNICO COMPLETO
 * Implementar os entregáveis detalhados conforme especificação técnica
 */

const { Client } = require('pg');

async function atualizarCronogramaDetalhado() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 ATUALIZANDO CRONOGRAMA COM DETALHAMENTO TÉCNICO COMPLETO');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // Buscar cronograma atual
    const result = await client.query(`
      SELECT cronograma FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    const cronogramaAtual = result.rows[0].cronograma;
    
    // Cronograma atualizado com detalhamento técnico completo
    const cronogramaAtualizado = {
      ...cronogramaAtual,
      fases: {
        // FASE 1: LEVANTAMENTO DE DADOS
        "LV_LEVANTAMENTO_DADOS": {
          "ordem": 1,
          "etapa": "A - CONCEPÇÃO",
          "nome": "LV - Levantamento de Dados",
          "prazo": 1,
          "valor": 1275,
          "percentual": 0.05,
          "disciplinas": ["ARQUITETURA"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Levantamento topográfico georreferenciado com curvas de nível e pontos notáveis",
            "Cadastro técnico da edificação existente (quando houver), incluindo levantamento arquitetônico, estrutural, instalações e patologias",
            "Levantamento de dados climáticos e orientação solar (heliodiagrama, rosa dos ventos, sombreamento)",
            "Levantamento geotécnico e sondagens do solo (SPT, análise estratigráfica)",
            "Levantamento de infraestrutura local (acessos, redes públicas de água, esgoto, energia, telecom, drenagem)",
            "Fotografias técnicas e relatório descritivo do entorno imediato",
            "Verificação de condicionantes ambientais e legais (APPs, tombamentos, zoneamento, etc.)"
          ],
          "horasEstimadas": 7,
          "observacoes": "Base técnica fundamental para todas as disciplinas do projeto"
        },
        
        // FASE 2: PROGRAMA DE NECESSIDADES
        "PN_PROGRAMA_NECESSIDADES": {
          "ordem": 2,
          "etapa": "A - CONCEPÇÃO",
          "nome": "PN - Programa de Necessidades",
          "prazo": 1,
          "valor": 1275,
          "percentual": 0.05,
          "disciplinas": ["ARQUITETURA"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Programa arquitetônico/Briefing detalhado com tabela de ambientes, áreas mínimas e inter-relações",
            "Organograma funcional por setor de uso",
            "Fluxograma das atividades e usuários (diagrama de uso e circulação)",
            "Pré-dimensionamento dos ambientes com base em normas e boas práticas",
            "Definição de padrão de acabamento desejado (nível de qualidade por ambiente)",
            "Levantamento de premissas e restrições técnicas, legais, operacionais e econômicas",
            "Relatório com diagnóstico das demandas, objetivos e prioridades do cliente"
          ],
          "horasEstimadas": 7,
          "observacoes": "Define requisitos funcionais e técnicos para todas as disciplinas"
        },
        
        // FASE 3: ESTUDO DE VIABILIDADE
        "EV_ESTUDO_VIABILIDADE": {
          "ordem": 3,
          "etapa": "B - DEFINIÇÃO",
          "nome": "EV - Estudo de Viabilidade",
          "prazo": 2,
          "valor": 2550,
          "percentual": 0.1,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Estudo de massa arquitetônico (volumetria, implantação, ocupação do solo)",
            "Análise de viabilidade legal e urbanística conforme o plano diretor e legislação local",
            "Pré-dimensionamento estrutural e avaliação da solução técnica adotada",
            "Análise de custos preliminar com base em índices e benchmarking",
            "Relatório de viabilidade técnica, econômica e operacional",
            "Avaliação de impacto ambiental preliminar (quando aplicável)",
            "Matriz de riscos iniciais e proposição de soluções ou mitigação"
          ],
          "horasEstimadas": 14,
          "observacoes": "Validação técnica, legal e econômica da viabilidade do empreendimento"
        },
        
        // FASE 4: ESTUDO PRELIMINAR
        "EP_ESTUDO_PRELIMINAR": {
          "ordem": 4,
          "etapa": "B - DEFINIÇÃO",
          "nome": "EP - Estudo Preliminar",
          "prazo": 3,
          "valor": 3825,
          "percentual": 0.15,
          "disciplinas": ["ARQUITETURA"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Plantas baixas dos pavimentos com layout funcional",
            "Planta de cobertura com elementos técnicos (caimentos, equipamentos, etc.)",
            "Cortes longitudinais e transversais principais",
            "Fachadas principais com volumetria e linguagem arquitetônica",
            "Planta de situação e locação com afastamentos, acessos e orientação solar",
            "Memorial justificativo conceitual e técnico (implantação, partido, fluxos, materiais)",
            "Estudo volumétrico tridimensional (maquete eletrônica ou física simplificada)"
          ],
          "horasEstimadas": 21,
          "observacoes": "Definição da concepção arquitetônica e partido geral do projeto"
        },
        
        // FASE 5: ANTEPROJETO MULTIDISCIPLINAR
        "AP_ANTEPROJETO": {
          "ordem": 5,
          "etapa": "C - INTERFACES",
          "nome": "AP - Anteprojeto Multidisciplinar",
          "prazo": 6,
          "valor": 7650,
          "percentual": 0.3,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Plantas baixas com dimensionamento e layouts definitivos",
            "Cortes e fachadas cotados",
            "Planta de cobertura detalhada com elementos técnicos e construtivos",
            "Lançamento da estrutura (planta de pilares, vigas, lajes e fundações)",
            "Esquema vertical da distribuição elétrica e pontos principais",
            "Esquema vertical da rede hidráulica e pontos principais",
            "Compatibilização entre disciplinas (detecção de interferências)",
            "Memorial descritivo multidisciplinar consolidado",
            "Representações 3D ou maquetes eletrônicas para comunicação com o cliente"
          ],
          "horasEstimadas": 42,
          "observacoes": "Compatibilização multidisciplinar e definição de todas as interfaces técnicas"
        },
        
        // FASE 6: PROJETO LEGAL
        "PL_PROJETO_LEGAL": {
          "ordem": 6,
          "etapa": "D - APROVAÇÃO",
          "nome": "PL - Projeto Legal",
          "prazo": 3,
          "valor": 3825,
          "percentual": 0.15,
          "disciplinas": ["ARQUITETURA"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Plantas, cortes e fachadas conforme exigências do órgão licenciador",
            "Memorial descritivo conforme legislação urbanística e edilícia",
            "Quadro de áreas conforme ABNT NBR 13531 e normas locais/plano diretor",
            "Relatório técnico de acessibilidade (se aplicável)",
            "Documentação complementar exigida pela prefeitura (ART/RRT, formulários, certidões, etc.)",
            "Indicação de parâmetros urbanísticos atendidos (gabarito, taxa de ocupação, etc.)"
          ],
          "horasEstimadas": 21,
          "observacoes": "Adequação às normas técnicas e legislação para aprovação legal"
        },
        
        // FASE 7: PROJETO BÁSICO MULTIDISCIPLINAR
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
            "Indicações de desempenho mínimo esperado (conforme NBR 15575)",
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
        
        // FASE 8: PROJETO EXECUTIVO COMPLETO
        "PE_PROJETO_EXECUTIVO": {
          "ordem": 8,
          "etapa": "F - PROJETO EXECUTIVO",
          "nome": "PE - Projeto Executivo Completo",
          "prazo": 6,
          "valor": 7650,
          "percentual": 0.3,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "responsavel": "Equipe Técnica",
          "entregaveis": [
            "Projeto arquitetônico executivo com todos os detalhes construtivos (plantas, cortes, fachadas, paginações)",
            "Projeto estrutural completo com detalhamento de armaduras, fundações, lajes e peças especiais",
            "Projeto elétrico executivo (plantas, quadros, detalhes, diagramas, lista de materiais e cargas)",
            "Projeto hidrossanitário executivo (plantas, cortes, detalhes, reservatórios, bombeamento, etc.)",
            "Projetos complementares: prevenção contra incêndio, lógica, SPDA, climatização (quando aplicável)",
            "Detalhamentos construtivos em escala apropriada (1:20, 1:10, 1:5, etc.)",
            "Especificações técnicas completas por disciplina",
            "Caderno de encargos com obrigações contratuais e critérios de medição",
            "Lista de materiais e componentes construtivos",
            "Memoriais de cálculo estrutural (fundações, lajes, vigas, etc.)",
            "Memoriais descritivos por disciplina atualizados e consolidados",
            "Planejamento executivo com sequenciamento de execução, logística e recomendações"
          ],
          "horasEstimadas": 42,
          "observacoes": "Informações técnicas completas e detalhadas para execução da obra"
        }
      }
    };
    
    console.log('📋 CRONOGRAMA ATUALIZADO COM DETALHAMENTO TÉCNICO:');
    console.log('-'.repeat(60));
    
    // Mostrar resumo das atualizações
    Object.entries(cronogramaAtualizado.fases).forEach(([key, fase]) => {
      console.log(`${fase.ordem}. ${fase.nome}`);
      console.log(`   📋 Etapa NBR: ${fase.etapa}`);
      console.log(`   👥 Responsável: ${fase.responsavel}`);
      console.log(`   📦 Entregáveis: ${fase.entregaveis.length} itens técnicos`);
      console.log(`   💰 Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    // Atualizar no banco
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        cronograma = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(cronogramaAtualizado), orcamentoId]);
    
    console.log('✅ CRONOGRAMA ATUALIZADO NO BANCO');
    console.log(`🔄 Linhas afetadas: ${updateResult.rowCount}`);
    
    console.log('\n🎯 MELHORIAS IMPLEMENTADAS:');
    console.log('✅ Detalhamento técnico profissional completo');
    console.log('✅ Entregáveis específicos conforme NBR 13532');
    console.log('✅ Responsável definido para cada fase');
    console.log('✅ Observações técnicas detalhadas');
    console.log('✅ Conformidade com normas técnicas brasileiras');
    console.log('✅ Linguagem técnica apropriada para AEC');
    
    console.log('\n📊 ESTATÍSTICAS:');
    const totalEntregaveis = Object.values(cronogramaAtualizado.fases)
      .reduce((total, fase) => total + fase.entregaveis.length, 0);
    console.log(`📦 Total de entregáveis: ${totalEntregaveis}`);
    console.log(`📅 Total de fases: ${Object.keys(cronogramaAtualizado.fases).length}`);
    console.log(`⏱️ Prazo total: ${cronogramaAtualizado.prazoTotal} semanas`);
    console.log(`💰 Valor técnico: R$ ${cronogramaAtualizado.valorTecnicoTotal.toLocaleString('pt-BR')}`);
    
  } catch (error) {
    console.error('❌ Erro na atualização:', error);
  } finally {
    await client.end();
  }
}

atualizarCronogramaDetalhado();