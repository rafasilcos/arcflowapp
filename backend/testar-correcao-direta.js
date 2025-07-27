const fetch = require('node-fetch');

async function testarCorrecaoGeracaoOrcamento() {
    console.log('🧪 TESTANDO CORREÇÃO DA GERAÇÃO DE ORÇAMENTO');
    console.log('============================================================');
    
    try {
        // 1. Fazer login
        console.log('🔐 FAZENDO LOGIN...');
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@arcflow.com.br',
                password: 'admin123'
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login falhou: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login realizado com sucesso');

        // 2. Buscar briefings disponíveis
        console.log('\n📋 BUSCANDO BRIEFINGS DISPONÍVEIS...');
        const briefingsResponse = await fetch('http://localhost:3001/api/briefings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!briefingsResponse.ok) {
            throw new Error(`Erro ao buscar briefings: ${briefingsResponse.status}`);
        }

        const briefings = await briefingsResponse.json();
        console.log(`✅ Encontrados ${briefings.length} briefings`);

        if (briefings.length === 0) {
            console.log('❌ Nenhum briefing encontrado para teste');
            return;
        }

        // Pegar o primeiro briefing
        const briefing = briefings[0];
        console.log(`📝 Usando briefing ID: ${briefing.id} - ${briefing.nome_projeto}`);

        // 3. Testar geração de orçamento
        console.log('\n💰 TESTANDO GERAÇÃO DE ORÇAMENTO...');
        const orcamentoResponse = await fetch(`http://localhost:3001/api/orcamentos/gerar-briefing/${briefing.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status da resposta: ${orcamentoResponse.status}`);

        if (!orcamentoResponse.ok) {
            const errorText = await orcamentoResponse.text();
            console.log('❌ Erro na geração:', errorText);
            return;
        }

        const orcamento = await orcamentoResponse.json();
        console.log('✅ ORÇAMENTO GERADO COM SUCESSO!');
        console.log('📊 Dados do orçamento:');
        console.log(`- ID: ${orcamento.id}`);
        console.log(`- Projeto: ${orcamento.nome_projeto}`);
        console.log(`- Área: ${orcamento.area_total}m²`);
        console.log(`- Valor Total: R$ ${orcamento.valor_total?.toLocaleString('pt-BR') || 'N/A'}`);
        console.log(`- Status: ${orcamento.status}`);

        // 4. Verificar se tem cronograma
        if (orcamento.cronograma && orcamento.cronograma.length > 0) {
            console.log(`✅ Cronograma gerado com ${orcamento.cronograma.length} etapas`);
            console.log('📅 Primeiras 3 etapas:');
            orcamento.cronograma.slice(0, 3).forEach((etapa, index) => {
                console.log(`  ${index + 1}. ${etapa.nome} - ${etapa.duracao_semanas} semanas - R$ ${etapa.valor?.toLocaleString('pt-BR') || 'N/A'}`);
            });
        } else {
            console.log('⚠️ Cronograma não foi gerado');
        }

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

testarCorrecaoGeracaoOrcamento();