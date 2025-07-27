/**
 * 🔧 CORRIGIR ORDEM DO CRONOGRAMA CONFORME NBR 13532
 * Organizar etapas na sequência correta de execução
 */

const { Client } = require('pg');

async function corrigirOrdemCronogramaNBR() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 CORRIGINDO ORDEM DO CRONOGRAMA CONFORME NBR 13532');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // Buscar orçamento atual
    const result = await client.query(`
      SELECT cronograma, disciplinas FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    const orcamento = result.rows[0];
    const disciplinas = orcamento.disciplinas;
    
    console.log('📋 Disciplinas incluídas:', disciplinas.join(', '));
    
    // Criar cronograma na ORDEM CORRETA conforme NBR 13532
    const cronogramaOrdenado = {
      fases: {
        // ETAPA A - CONCEPÇÃO DO PRODUTO (LV + PN)
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
        
        // ETAPA B - DEFINIÇÃO DO PRODUTO (EV + EP)
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
        
        // ETAPA C - IDENTIFICAÇÃO E SOLUÇÃO DE INTERFACES (AP)
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
        
        // ETAPA D - PROJETO DE APROVAÇÃO (PL)
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
        
        // ETAPA E - PROJETO BÁSICO (PB)
        "PB_PROJETO_BASICO": {
          "ordem": 7,
          "etapa": "E - PROJETO BÁSICO",
          "nome": "PB - Projeto Básico Multidisciplinar",
          "prazo": 4,
          "valor": 5100,
          "percentual": 0.2,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "entregaveis": [
            "Projeto arquitetônico básico completo",
            "Projeto estrutural básico com dimensionamento",
            "Projeto elétrico básico com quadros",
            "Projeto hidrossanitário básico completo",
            "Especificações técnicas básicas",
            "Orçamento estimativo por disciplina",
            "Cronograma físico-financeiro"
          ],
          "horasEstimadas": 28,
          "observacoes": "Base para licitação e contratação da obra"
        },
        
        // ETAPA F - PROJETO EXECUTIVO (PE)
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
      disciplinasIncluidas: disciplinas,
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
    
    console.log('\n📅 CRONOGRAMA ORDENADO CONFORME NBR 13532:');
    console.log('='.repeat(60));
    
    // Mostrar na ordem correta
    cronogramaOrdenado.sequenciaExecucao.forEach((faseKey, index) => {
      const fase = cronogramaOrdenado.fases[faseKey];
      console.log(`${fase.ordem}. ${fase.nome}`);
      console.log(`   📋 Etapa NBR: ${fase.etapa}`);
      console.log(`   ⏱️ Prazo: ${fase.prazo} semana(s)`);
      console.log(`   💰 Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
      console.log(`   🎯 Disciplinas: ${fase.disciplinas.join(', ')}`);
      console.log(`   📦 Entregáveis: ${fase.entregaveis.length} itens`);
      console.log(`   📝 Observação: ${fase.observacoes}`);
      console.log('');
    });
    
    console.log('🎯 MARCOS DO PROJETO:');
    Object.entries(cronogramaOrdenado.marcos).forEach(([marco, fase]) => {
      console.log(`✅ ${marco}: ${cronogramaOrdenado.fases[fase].nome}`);
    });
    
    console.log(`\n💰 VALOR TÉCNICO TOTAL: R$ ${cronogramaOrdenado.valorTecnicoTotal.toLocaleString('pt-BR')}`);
    console.log(`⏱️ PRAZO TOTAL: ${cronogramaOrdenado.prazoTotal} semanas`);
    console.log(`📊 METODOLOGIA: ${cronogramaOrdenado.metodologia}`);
    
    // Atualizar no banco
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        cronograma = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(cronogramaOrdenado), orcamentoId]);
    
    console.log('\n✅ CRONOGRAMA ATUALIZADO NO BANCO');
    console.log(`🔄 Linhas afetadas: ${updateResult.rowCount}`);
    
    console.log('\n🎯 MELHORIAS IMPLEMENTADAS:');
    console.log('✅ Ordem sequencial conforme NBR 13532');
    console.log('✅ Etapas claramente identificadas (A, B, C, D, E, F)');
    console.log('✅ Nomenclatura técnica correta (LV, PN, EV, EP, AP, PL, PB, PE)');
    console.log('✅ Sequência lógica de execução');
    console.log('✅ Marcos de aprovação definidos');
    console.log('✅ Integração multidisciplinar mantida');
    console.log('✅ Entregáveis específicos por etapa');
    
  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await client.end();
  }
}

corrigirOrdemCronogramaNBR();