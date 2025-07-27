/**
 * 🔍 ANALISAR BRIEFING REAL PARA ENTENDER ESTRUTURA
 */

const { connectDatabase, getClient } = require('./config/database');

async function analisarBriefingReal() {
  await connectDatabase();
  const client = getClient();

  try {
    console.log('🔍 ANALISANDO BRIEFINGS REAIS PARA ENTENDER ESTRUTURA\n');

    // Buscar briefings disponíveis para orçamento
    const briefings = await client.query(`
      SELECT 
        b.id, b.nome_projeto, b.tipologia, b.area, b.disciplina,
        b.observacoes, b.metadata, b.dados_extraidos,
        c.nome as cliente_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      WHERE b.status IN ('CONCLUIDO', 'APROVADO')
        AND b.deleted_at IS NULL
      ORDER BY b.updated_at DESC
      LIMIT 3
    `);

    console.log(`📋 Encontrados ${briefings.rows.length} briefings para análise:\n`);

    for (let i = 0; i < briefings.rows.length; i++) {
      const briefing = briefings.rows[i];

      console.log(`${i + 1}️⃣ BRIEFING: ${briefing.nome_projeto}`);
      console.log(`   ID: ${briefing.id}`);
      console.log(`   Cliente: ${briefing.cliente_nome}`);
      console.log(`   Tipologia: ${briefing.tipologia}`);
      console.log(`   Área: ${briefing.area}`);
      console.log(`   Disciplina: ${briefing.disciplina}`);

      // Analisar observações
      if (briefing.observacoes) {
        try {
          const observacoes = JSON.parse(briefing.observacoes);
          console.log(`   📝 Observações estruturadas:`);

          if (observacoes.respostas) {
            const respostas = observacoes.respostas;
            const totalRespostas = Object.keys(respostas).length;
            console.log(`      - Total de respostas: ${totalRespostas}`);

            // Mostrar algumas respostas importantes
            console.log(`      - Primeiras 5 respostas:`);
            Object.entries(respostas).slice(0, 5).forEach(([key, value]) => {
              const valorTruncado = String(value).substring(0, 80);
              console.log(`        ${key}: ${valorTruncado}${String(value).length > 80 ? '...' : ''}`);
            });

            // Procurar por informações específicas
            console.log(`      - 🔍 Análise de dados importantes:`);

            // Buscar área
            const areasEncontradas = [];
            Object.entries(respostas).forEach(([key, value]) => {
              if (typeof value === 'string') {
                const areaMatch = value.match(/(\d+)\s*m²?/gi);
                if (areaMatch) {
                  areasEncontradas.push({ pergunta: key, area: areaMatch });
                }
              }
            });

            if (areasEncontradas.length > 0) {
              console.log(`        📐 Áreas encontradas:`);
              areasEncontradas.forEach(item => {
                console.log(`          ${item.pergunta}: ${item.area.join(', ')}`);
              });
            }

            // Buscar tipologia
            const tipologiasEncontradas = [];
            Object.entries(respostas).forEach(([key, value]) => {
              if (typeof value === 'string') {
                const valorLower = value.toLowerCase();
                if (valorLower.includes('residencial') || valorLower.includes('casa') || valorLower.includes('apartamento')) {
                  tipologiasEncontradas.push({ pergunta: key, tipo: 'RESIDENCIAL', valor: value });
                } else if (valorLower.includes('comercial') || valorLower.includes('loja') || valorLower.includes('escritório')) {
                  tipologiasEncontradas.push({ pergunta: key, tipo: 'COMERCIAL', valor: value });
                } else if (valorLower.includes('industrial') || valorLower.includes('galpão') || valorLower.includes('fábrica')) {
                  tipologiasEncontradas.push({ pergunta: key, tipo: 'INDUSTRIAL', valor: value });
                }
              }
            });

            if (tipologiasEncontradas.length > 0) {
              console.log(`        🏠 Tipologias encontradas:`);
              tipologiasEncontradas.forEach(item => {
                console.log(`          ${item.pergunta}: ${item.tipo} (${item.valor.substring(0, 50)}...)`);
              });
            }

            // Buscar padrão/complexidade
            const padroesEncontrados = [];
            Object.entries(respostas).forEach(([key, value]) => {
              if (typeof value === 'string') {
                const valorLower = value.toLowerCase();
                if (valorLower.includes('luxo') || valorLower.includes('alto padrão') || valorLower.includes('sofisticado')) {
                  padroesEncontrados.push({ pergunta: key, padrao: 'ALTO', valor: value });
                } else if (valorLower.includes('simples') || valorLower.includes('básico') || valorLower.includes('econômico')) {
                  padroesEncontrados.push({ pergunta: key, padrao: 'SIMPLES', valor: value });
                } else if (valorLower.includes('médio') || valorLower.includes('padrão')) {
                  padroesEncontrados.push({ pergunta: key, padrao: 'MEDIO', valor: value });
                }
              }
            });

            if (padroesEncontrados.length > 0) {
              console.log(`        ⭐ Padrões encontrados:`);
              padroesEncontrados.forEach(item => {
                console.log(`          ${item.pergunta}: ${item.padrao} (${item.valor.substring(0, 50)}...)`);
              });
            }

          } else {
            console.log(`      - ❌ Não há campo 'respostas' nas observações`);
          }

        } catch (error) {
          console.log(`      - ❌ Erro ao parsear observações: ${error.message}`);
        }
      } else {
        console.log(`   📝 Sem observações estruturadas`);
      }

      // Analisar metadata
      if (briefing.metadata) {
        try {
          const metadata = JSON.parse(briefing.metadata);
          console.log(`   📊 Metadata:`);
          console.log(`      - Chaves: ${Object.keys(metadata).join(', ')}`);
        } catch (error) {
          console.log(`   📊 Erro ao parsear metadata: ${error.message}`);
        }
      }

      // Analisar dados_extraidos
      if (briefing.dados_extraidos) {
        try {
          const dadosExtraidos = JSON.parse(briefing.dados_extraidos);
          console.log(`   🎯 Dados extraídos:`);
          console.log(`      - Chaves: ${Object.keys(dadosExtraidos).join(', ')}`);
        } catch (error) {
          console.log(`   🎯 Erro ao parsear dados extraídos: ${error.message}`);
        }
      }

      console.log(''); // Linha em branco
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

analisarBriefingReal();