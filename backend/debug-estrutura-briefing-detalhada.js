/**
 * 🔍 DEBUG DETALHADO DA ESTRUTURA DO BRIEFING
 * 
 * Análise completa para identificar problemas na extração de dados
 */

const { connectDatabase, getClient } = require('./config/database');

async function debugEstruturaBriefing() {
  await connectDatabase();
  const client = getClient();
  
  try {
    console.log('🔍 DEBUG DETALHADO DA ESTRUTURA DO BRIEFING\n');
    
    // Buscar briefing mais recente
    const briefings = await client.query(`
      SELECT 
        b.id, b.nome_projeto, b.tipologia, b.area, b.disciplina,
        b.observacoes, b.metadata, b.dados_extraidos,
        c.nome as cliente_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      WHERE b.deleted_at IS NULL
      ORDER BY b.updated_at DESC
      LIMIT 1
    `);
    
    if (briefings.rows.length === 0) {
      console.log('❌ Nenhum briefing encontrado');
      return;
    }
    
    const briefing = briefings.rows[0];
    
    console.log('📋 BRIEFING SELECIONADO:');
    console.log(`   ID: ${briefing.id}`);
    console.log(`   Nome: ${briefing.nome_projeto}`);
    console.log(`   Tipologia: ${briefing.tipologia}`);
    console.log(`   Área: ${briefing.area}`);
    console.log(`   Disciplina: ${briefing.disciplina}`);
    console.log('');
    
    // Analisar observações em detalhes
    if (briefing.observacoes) {
      try {
        const observacoes = JSON.parse(briefing.observacoes);
        console.log('📝 ESTRUTURA DAS OBSERVAÇÕES:');
        console.log('   Chaves principais:', Object.keys(observacoes));
        
        if (observacoes.respostas) {
          const respostas = observacoes.respostas;
          console.log(`   📊 Total de respostas: ${Object.keys(respostas).length}`);
          
          console.log('\n🔍 ANÁLISE DETALHADA DAS RESPOSTAS:');
          
          // Procurar por área
          console.log('\n📐 BUSCANDO INFORMAÇÕES DE ÁREA:');
          let areasEncontradas = [];
          
          Object.entries(respostas).forEach(([key, value], index) => {
            if (typeof value === 'string') {
              // Procurar por padrões de área
              const areaPatterns = [
                /(\d+)\s*m²/gi,
                /(\d+)\s*metros?\s*quadrados?/gi,
                /(\d+)\s*m2/gi,
                /área.*?(\d+)/gi,
                /metragem.*?(\d+)/gi,
                /tamanho.*?(\d+)/gi
              ];
              
              areaPatterns.forEach(pattern => {
                const matches = value.match(pattern);
                if (matches) {
                  areasEncontradas.push({
                    pergunta: key,
                    indice: index + 1,
                    valor: value,
                    matches: matches,
                    numero: parseInt(matches[0].replace(/[^\d]/g, ''))
                  });
                }
              });
              
              // Verificar se a pergunta contém palavras relacionadas à área
              const areaKeywords = ['área', 'area', 'metragem', 'tamanho', 'dimensão', 'm²', 'metros'];
              const keyLower = key.toLowerCase();
              const valueLower = value.toLowerCase();
              
              if (areaKeywords.some(keyword => keyLower.includes(keyword) || valueLower.includes(keyword))) {
                console.log(`   ${index + 1}. ${key}:`);
                console.log(`      Valor: "${value}"`);
                console.log(`      Contém área: ${areaKeywords.filter(k => keyLower.includes(k) || valueLower.includes(k)).join(', ')}`);
              }
            }
          });
          
          if (areasEncontradas.length > 0) {
            console.log('\n📊 ÁREAS ENCONTRADAS:');
            areasEncontradas.forEach((item, index) => {
              console.log(`   ${index + 1}. Pergunta: ${item.pergunta} (índice ${item.indice})`);
              console.log(`      Valor completo: "${item.valor}"`);
              console.log(`      Matches: ${item.matches.join(', ')}`);
              console.log(`      Número extraído: ${item.numero}m²`);
              console.log('');
            });
            
            // Identificar qual deveria ser a área principal
            const areasPrincipais = areasEncontradas.filter(a => 
              a.pergunta.toLowerCase().includes('construída') || 
              a.pergunta.toLowerCase().includes('total') ||
              a.pergunta.toLowerCase().includes('projeto') ||
              a.numero > 50 // Áreas realistas para projetos
            );
            
            if (areasPrincipais.length > 0) {
              console.log('🎯 ÁREA PRINCIPAL IDENTIFICADA:');
              const areaPrincipal = areasPrincipais[0];
              console.log(`   Pergunta: ${areaPrincipal.pergunta}`);
              console.log(`   Valor: ${areaPrincipal.numero}m²`);
              console.log(`   Índice da pergunta: ${areaPrincipal.indice}`);
            }
          } else {
            console.log('❌ Nenhuma área encontrada nas respostas');
          }
          
          // Procurar por área de atuação
          console.log('\n🏠 BUSCANDO ÁREA DE ATUAÇÃO:');
          let areaAtuacaoEncontrada = null;
          
          Object.entries(respostas).forEach(([key, value], index) => {
            if (typeof value === 'string') {
              const keyLower = key.toLowerCase();
              const valueLower = value.toLowerCase();
              
              // Palavras-chave para área de atuação
              const atuacaoKeywords = ['atuação', 'tipo', 'categoria', 'área de', 'segmento'];
              const tiposAtuacao = ['residencial', 'comercial', 'industrial', 'institucional', 'mista'];
              
              if (atuacaoKeywords.some(keyword => keyLower.includes(keyword)) ||
                  tiposAtuacao.some(tipo => valueLower.includes(tipo))) {
                
                console.log(`   ${index + 1}. ${key}:`);
                console.log(`      Valor: "${value}"`);
                
                // Identificar o tipo
                const tipoEncontrado = tiposAtuacao.find(tipo => valueLower.includes(tipo));
                if (tipoEncontrado) {
                  areaAtuacaoEncontrada = {
                    pergunta: key,
                    indice: index + 1,
                    valor: value,
                    tipo: tipoEncontrado.toUpperCase()
                  };
                  console.log(`      Tipo identificado: ${tipoEncontrado.toUpperCase()}`);
                }
              }
            }
          });
          
          if (areaAtuacaoEncontrada) {
            console.log('\n🎯 ÁREA DE ATUAÇÃO IDENTIFICADA:');
            console.log(`   Pergunta: ${areaAtuacaoEncontrada.pergunta}`);
            console.log(`   Tipo: ${areaAtuacaoEncontrada.tipo}`);
            console.log(`   Índice da pergunta: ${areaAtuacaoEncontrada.indice}`);
          } else {
            console.log('❌ Área de atuação não encontrada nas respostas');
          }
          
          // Procurar por tipologia
          console.log('\n🏗️ BUSCANDO TIPOLOGIA:');
          let tipologiaEncontrada = null;
          
          Object.entries(respostas).forEach(([key, value], index) => {
            if (typeof value === 'string') {
              const keyLower = key.toLowerCase();
              const valueLower = value.toLowerCase();
              
              const tipologiaKeywords = ['tipologia', 'tipo de projeto', 'categoria', 'classificação'];
              const tiposTipologia = ['unifamiliar', 'multifamiliar', 'apartamento', 'casa', 'sobrado', 'loja', 'escritório'];
              
              if (tipologiaKeywords.some(keyword => keyLower.includes(keyword)) ||
                  tiposTipologia.some(tipo => valueLower.includes(tipo))) {
                
                console.log(`   ${index + 1}. ${key}:`);
                console.log(`      Valor: "${value}"`);
                
                const tipoEncontrado = tiposTipologia.find(tipo => valueLower.includes(tipo));
                if (tipoEncontrado) {
                  tipologiaEncontrada = {
                    pergunta: key,
                    indice: index + 1,
                    valor: value,
                    tipo: tipoEncontrado
                  };
                  console.log(`      Tipologia identificada: ${tipoEncontrado}`);
                }
              }
            }
          });
          
          if (tipologiaEncontrada) {
            console.log('\n🎯 TIPOLOGIA IDENTIFICADA:');
            console.log(`   Pergunta: ${tipologiaEncontrada.pergunta}`);
            console.log(`   Tipo: ${tipologiaEncontrada.tipo}`);
            console.log(`   Índice da pergunta: ${tipologiaEncontrada.indice}`);
          }
          
          // Mostrar todas as perguntas para referência
          console.log('\n📋 TODAS AS PERGUNTAS E RESPOSTAS:');
          Object.entries(respostas).forEach(([key, value], index) => {
            console.log(`   ${index + 1}. ${key}:`);
            const valorTruncado = String(value).substring(0, 100);
            console.log(`      "${valorTruncado}${String(value).length > 100 ? '...' : ''}"`);
          });
          
        } else {
          console.log('❌ Não há campo "respostas" nas observações');
        }
        
      } catch (error) {
        console.log('❌ Erro ao parsear observações:', error.message);
      }
    } else {
      console.log('❌ Briefing não possui observações');
    }
    
    // Testar a lógica atual
    console.log('\n🧪 TESTANDO LÓGICA ATUAL:');
    const BriefingAnalyzer = require('./utils/briefingAnalyzer');
    const analyzer = new BriefingAnalyzer();
    
    try {
      const dadosEstruturados = await analyzer.extrairDadosEstruturados(briefing);
      
      console.log('📊 DADOS EXTRAÍDOS PELA LÓGICA ATUAL:');
      console.log(`   Tipologia: ${dadosEstruturados.tipologia}`);
      console.log(`   Área construída: ${dadosEstruturados.areaConstruida}m²`);
      console.log(`   Área terreno: ${dadosEstruturados.areaTerreno}m²`);
      console.log(`   Padrão: ${dadosEstruturados.padrao}`);
      console.log(`   Complexidade: ${dadosEstruturados.complexidade}`);
      console.log(`   Localização: ${dadosEstruturados.localizacao}`);
      console.log(`   Disciplinas: ${dadosEstruturados.disciplinasNecessarias.join(', ')}`);
      console.log(`   Características: ${dadosEstruturados.caracteristicasEspeciais.join(', ')}`);
      console.log(`   Confiança: ${dadosEstruturados.confianca}%`);
      
    } catch (error) {
      console.error('❌ Erro na lógica atual:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

debugEstruturaBriefing();