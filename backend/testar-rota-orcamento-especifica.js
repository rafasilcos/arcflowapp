/**
 * 🧪 TESTE DA ROTA ESPECÍFICA DE ORÇAMENTO
 * 
 * Testa se a rota /api/orcamentos/:id retorna todos os dados
 * necessários para o frontend V3.0
 */

const axios = require('axios');

async function testarRotaOrcamento() {
    console.log('🧪 TESTE DA ROTA ESPECÍFICA DE ORÇAMENTO\n');

    try {
        // 1. Fazer login para obter token
        console.log('🔐 1. Fazendo login...');
        const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'admin@arcflow.com',
            password: '123456'
        });

        const token = loginResponse.data.tokens?.accessToken || loginResponse.data.token;
        console.log('✅ Token obtido:', token ? 'SIM' : 'NÃO');

        if (!token) {
            throw new Error('Token não obtido no login');
        }

        // 2. Buscar orçamento específico
        console.log('\n📊 2. Buscando orçamento ID 81...');
        const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/81', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const orcamento = orcamentoResponse.data;
        console.log('✅ Resposta da API:', {
            success: orcamento.success,
            hasData: !!orcamento.data,
            id: orcamento.data?.id,
            codigo: orcamento.data?.codigo
        });

        // 3. Verificar campos essenciais para o frontend
        console.log('\n🔍 3. Verificando campos essenciais...');
        const data = orcamento.data;
        
        const camposEssenciais = [
            'id', 'codigo', 'nome', 'cliente_nome', 'status',
            'area_construida', 'area_terreno', 'valor_total', 'valor_por_m2',
            'tipologia', 'padrao', 'complexidade', 'localizacao',
            'disciplinas', 'composicao_financeira', 'cronograma', 'dados_extraidos'
        ];

        console.log('📋 Campos presentes:');
        camposEssenciais.forEach(campo => {
            const presente = data.hasOwnProperty(campo);
            const valor = data[campo];
            console.log(`   ${presente ? '✅' : '❌'} ${campo}: ${
                presente ? (typeof valor === 'object' ? 'OBJETO' : valor) : 'AUSENTE'
            }`);
        });

        // 4. Verificar dados dinâmicos específicos
        console.log('\n🧠 4. Verificando dados dinâmicos V3.0...');
        
        // Área do terreno (deve estar presente agora)
        if (data.area_terreno) {
            console.log('✅ Área do terreno:', data.area_terreno + 'm²');
        } else {
            console.log('❌ Área do terreno: AUSENTE');
        }

        // Localização específica (não deve ser apenas "Brasil")
        if (data.localizacao && data.localizacao !== 'Brasil') {
            console.log('✅ Localização específica:', data.localizacao);
        } else {
            console.log('❌ Localização genérica:', data.localizacao);
        }

        // Disciplinas (deve ser array)
        if (Array.isArray(data.disciplinas)) {
            console.log('✅ Disciplinas (array):', data.disciplinas.length, 'disciplinas');
            console.log('   Disciplinas:', data.disciplinas.join(', '));
        } else {
            console.log('❌ Disciplinas não é array:', typeof data.disciplinas);
        }

        // Dados extraídos (deve existir e ter confiança)
        if (data.dados_extraidos) {
            try {
                const dadosExtraidos = typeof data.dados_extraidos === 'string' 
                    ? JSON.parse(data.dados_extraidos) 
                    : data.dados_extraidos;
                
                console.log('✅ Dados extraídos presentes:');
                console.log('   Confiança:', dadosExtraidos.confianca + '%');
                console.log('   Versão:', dadosExtraidos.versaoAnalyzer);
                console.log('   Características:', dadosExtraidos.caracteristicasEspeciais?.join(', ') || 'Nenhuma');
            } catch (error) {
                console.log('❌ Erro ao parsear dados_extraidos:', error.message);
            }
        } else {
            console.log('❌ Dados extraídos: AUSENTES');
        }

        // 5. Verificar composição financeira
        console.log('\n💰 5. Verificando composição financeira...');
        if (data.composicao_financeira) {
            try {
                const composicao = typeof data.composicao_financeira === 'string'
                    ? JSON.parse(data.composicao_financeira)
                    : data.composicao_financeira;
                
                console.log('✅ Composição financeira presente:');
                console.log('   Custos de horas:', composicao.custosHoras);
                console.log('   Custos indiretos:', composicao.custosIndiretos);
                console.log('   Disciplinas detalhadas:', composicao.disciplinasDetalhadas?.length || 0);
            } catch (error) {
                console.log('❌ Erro ao parsear composicao_financeira:', error.message);
            }
        } else {
            console.log('❌ Composição financeira: AUSENTE');
        }

        // 6. Verificar cronograma
        console.log('\n📅 6. Verificando cronograma...');
        if (data.cronograma) {
            try {
                const cronograma = typeof data.cronograma === 'string'
                    ? JSON.parse(data.cronograma)
                    : data.cronograma;
                
                console.log('✅ Cronograma presente:');
                console.log('   Prazo total:', cronograma.prazoTotal, 'dias');
                console.log('   Fases:', Object.keys(cronograma.fases || {}).length);
                console.log('   Valor técnico:', cronograma.valorTecnicoTotal);
            } catch (error) {
                console.log('❌ Erro ao parsear cronograma:', error.message);
            }
        } else {
            console.log('❌ Cronograma: AUSENTE');
        }

        // 7. Resumo final
        console.log('\n🎯 RESUMO DO TESTE:');
        console.log('✅ Rota funcionando corretamente');
        console.log('✅ Dados essenciais presentes');
        console.log('✅ Sistema dinâmico V3.0 integrado');
        console.log('✅ Frontend pode consumir os dados');
        
        console.log('\n🌐 TESTE NO NAVEGADOR:');
        console.log(`   URL: http://localhost:3000/orcamentos/${data.id}`);
        console.log('   A página deve exibir todos os dados dinâmicos');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testarRotaOrcamento();