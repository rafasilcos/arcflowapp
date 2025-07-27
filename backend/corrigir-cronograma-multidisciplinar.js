/**
 * 🔧 CORRIGIR CRONOGRAMA MULTIDISCIPLINAR
 * Adicionar fases das outras disciplinas no cronograma
 */

const { Client } = require('pg');

async function corrigirCronogramaMultidisciplinar() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 CORRIGINDO CRONOGRAMA MULTIDISCIPLINAR');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // Buscar orçamento atual
    const result = await client.query(`
      SELECT cronograma, disciplinas, valor_total FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    const orcamento = result.rows[0];
    const cronogramaAtual = orcamento.cronograma;
    const disciplinas = orcamento.disciplinas;
    const valorTotal = parseFloat(orcamento.valor_total);
    
    console.log('📋 Disciplinas incluídas:', disciplinas.join(', '));
    console.log('💰 Valor total:', `R$ ${valorTotal.toLocaleString('pt-BR')}`);
    
    // Criar cronograma multidisciplinar completo
    const cronogramaCompleto = {
      ...cronogramaAtual,
      fases: {
        // FASE 1: LEVANTAMENTO E PROGRAMA (todas as disciplinas)
        "LEVANTAMENTO_DADOS": {
          "nome": "Levantamento de Dados",
          "prazo": 1,
          "valor": 1275,
          "percentual": 0.05,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Medição do terreno",
            "Cadastro existente", 
            "Análise do programa",
            "Levantamento topográfico"
          ],
          "horasEstimadas": 7
        },
        
        "PROGRAMA_NECESSIDADES": {
          "nome": "Programa de Necessidades",
          "prazo": 1,
          "valor": 1275,
          "percentual": 0.05,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Programa arquitetônico",
            "Organograma funcional",
            "Pré-dimensionamento estrutural",
            "Cargas elétricas preliminares"
          ],
          "horasEstimadas": 7
        },
        
        // FASE 2: ESTUDOS (multidisciplinar)
        "ESTUDO_VIABILIDADE": {
          "nome": "Estudo de Viabilidade",
          "prazo": 2,
          "valor": 2550,
          "percentual": 0.1,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL"],
          "entregaveis": [
            "Estudo de massa arquitetônico",
            "Análise de viabilidade",
            "Pré-dimensionamento estrutural",
            "Relatório técnico integrado"
          ],
          "horasEstimadas": 14
        },
        
        "ESTUDO_PRELIMINAR": {
          "nome": "Estudo Preliminar",
          "prazo": 3,
          "valor": 3825,
          "percentual": 0.15,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Plantas baixas",
            "Cortes e fachadas",
            "Implantação",
            "Memorial descritivo"
          ],
          "horasEstimadas": 21
        },
        
        // FASE 3: ANTEPROJETO (multidisciplinar)
        "ANTEPROJETO": {
          "nome": "Anteprojeto Multidisciplinar",
          "prazo": 6,
          "valor": 7650,
          "percentual": 0.3,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "entregaveis": [
            "Plantas arquitetônicas definitivas",
            "Cortes e fachadas detalhadas",
            "Lançamento estrutural",
            "Esquema unifilar elétrico",
            "Esquema hidráulico básico",
            "Compatibilização entre disciplinas"
          ],
          "horasEstimadas": 42
        },
        
        // FASE 4: PROJETO LEGAL
        "PROJETO_LEGAL": {
          "nome": "Projeto Legal",
          "prazo": 3,
          "valor": 3825,
          "percentual": 0.15,
          "disciplinas": ["ARQUITETURA"],
          "entregaveis": [
            "Projeto para aprovação na prefeitura",
            "Memorial descritivo",
            "Documentação legal completa"
          ],
          "horasEstimadas": 21
        },
        
        // FASE 5: PROJETO BÁSICO (multidisciplinar)
        "PROJETO_BASICO": {
          "nome": "Projeto Básico Multidisciplinar",
          "prazo": 4,
          "valor": 5100,
          "percentual": 0.2,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "entregaveis": [
            "Projeto básico arquitetônico",
            "Projeto estrutural básico",
            "Projeto elétrico básico",
            "Projeto hidráulico básico",
            "Especificações técnicas",
            "Orçamento estimativo"
          ],
          "horasEstimadas": 28
        },
        
        // FASE 6: PROJETO EXECUTIVO (multidisciplinar)
        "PROJETO_EXECUTIVO": {
          "nome": "Projeto Executivo Completo",
          "prazo": 6,
          "valor": 7650,
          "percentual": 0.3,
          "disciplinas": ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"],
          "entregaveis": [
            "Projeto arquitetônico executivo",
            "Projeto estrutural completo com detalhes",
            "Projeto elétrico executivo com quadros",
            "Projeto hidráulico executivo completo",
            "Detalhamentos construtivos",
            "Caderno de especificações",
            "Lista de materiais",
            "Memoriais de cálculo"
          ],
          "horasEstimadas": 42
        }
      },
      
      // Atualizar totais
      prazoTotal: 26, // semanas
      valorTecnicoTotal: 33150, // soma das fases
      metodologia: "NBR_13532_MULTIDISCIPLINAR",
      
      // Adicionar informações sobre disciplinas
      disciplinasIncluidas: disciplinas,
      observacoes: "Cronograma integrado incluindo todas as disciplinas contratadas"
    };
    
    // Calcular novo valor técnico total
    let novoValorTecnico = 0;
    Object.values(cronogramaCompleto.fases).forEach(fase => {
      novoValorTecnico += fase.valor;
    });
    
    console.log('\n📅 NOVO CRONOGRAMA MULTIDISCIPLINAR:');
    console.log('-'.repeat(50));
    
    Object.entries(cronogramaCompleto.fases).forEach(([key, fase]) => {
      const disciplinasTexto = fase.disciplinas.join(', ');
      console.log(`📌 ${fase.nome}`);
      console.log(`   ⏱️ Prazo: ${fase.prazo} semanas`);
      console.log(`   💰 Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
      console.log(`   🎯 Disciplinas: ${disciplinasTexto}`);
      console.log(`   📋 Entregáveis: ${fase.entregaveis.length} itens`);
      console.log('');
    });
    
    console.log(`💰 NOVO VALOR TÉCNICO TOTAL: R$ ${novoValorTecnico.toLocaleString('pt-BR')}`);
    console.log(`⏱️ PRAZO TOTAL: ${cronogramaCompleto.prazoTotal} semanas`);
    
    // Atualizar no banco
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        cronograma = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(cronogramaCompleto), orcamentoId]);
    
    console.log('\n✅ CRONOGRAMA ATUALIZADO NO BANCO');
    console.log(`🔄 Linhas afetadas: ${updateResult.rowCount}`);
    
    console.log('\n🎯 MELHORIAS IMPLEMENTADAS:');
    console.log('✅ Todas as disciplinas agora aparecem no cronograma');
    console.log('✅ Entregáveis específicos para cada disciplina');
    console.log('✅ Fases integradas e compatibilizadas');
    console.log('✅ Transparência total sobre o que está incluído');
    console.log('✅ Valor técnico alinhado com cronograma');
    
  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await client.end();
  }
}

corrigirCronogramaMultidisciplinar();