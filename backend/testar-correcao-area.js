const fetch = require('node-fetch');

async function testarCorrecaoArea() {
    console.log('🧪 TESTANDO CORREÇÃO DA ÁREA DO BRIEFING');
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
            console.log('❌ Login falhou');
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login OK');

        // 2. Buscar briefings
        console.log('\n📋 BUSCANDO BRIEFINGS...');
        const briefingsResponse = await fetch('http://localhost:3001/api/briefings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const briefings = await briefingsResponse.json();
        console.log(`✅ ${briefings.length} briefings encontrados`);

        if (briefings.length === 0) {
            console.log('❌ Nenhum briefing para teste');
            return;
        }

        // 3. Analisar primeiro briefing
        const briefing = briefings[0];
        console.log('\n📝 ANALISANDO BRIEFING:');
        console.log(`- ID: ${briefing.id}`);
        console.log(`- Nome: ${briefing.nome_projeto || 'N/A'}`);
        console.log(`- Área: ${briefing.area_total || 'N/A'}`);
        console.log(`- Tipologia: ${briefing.tipologia || 'N/A'}`);
        console.log(`- Status: ${briefing.status || 'N/A'}`);

        // 4. Verificar respostas do briefing
        if (briefing.respostas) {
            console.log('\n📋 RESPOSTAS DO BRIEFING:');
            const respostas = typeof briefing.respostas === 'string' ? 
                JSON.parse(briefing.respostas) : briefing.respostas;
            
            // Procurar por área nas respostas
            const areaResposta = Object.entries(respostas).find(([key, value]) => 
                key.toLowerCase().includes('area') || 
                key.toLowerCase().includes('área') ||
                (typeof value === 'string' && value.includes('m²'))
            );
            
            if (areaResposta) {
                console.log(`- Área encontrada: ${areaResposta[0]} = ${areaResposta[1]}`);
            } else {
                console.log('- Área não encontrada nas respostas');
            }
        }

        // 5. Testar geração de orçamento
        console.log('\n💰 TESTANDO GERAÇÃO...');
        const orcamentoResponse = await fetch(`http://localhost:3001/api/orcamentos/gerar-briefing/${briefing.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status: ${orcamentoResponse.status}`);

        if (orcamentoResponse.ok) {
            const orcamento = await orcamentoResponse.json();
            console.log('✅ ORÇAMENTO GERADO!');
            console.log(`- Área: ${orcamento.area_total}m²`);
            console.log(`- Valor: R$ ${orcamento.valor_total?.toLocaleString('pt-BR')}`);
        } else {
            const error = await orcamentoResponse.text();
            console.log('❌ ERRO:', error);
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

testarCorrecaoArea();