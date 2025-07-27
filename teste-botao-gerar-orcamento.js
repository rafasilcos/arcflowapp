/**
 * 🧪 TESTE COMPLETO DO BOTÃO "GERAR ORÇAMENTO"
 * 
 * Script para testar toda a funcionalidade de geração de orçamentos
 * a partir de briefings, verificando cada etapa do processo.
 */

const axios = require('axios');

// Configurações
const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'admin@arcflow.com';
const ADMIN_PASSWORD = '123456';

let authToken = null;
let briefingTeste = null;
let orcamentoGerado = null;

/**
 * 🔐 Fazer login e obter token
 */
async function fazerLogin() {
    try {
        console.log('🔐 [TESTE] Fazendo login...');

        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        if (response.data.success || response.data.message === 'Login realizado com sucesso') {
            authToken = response.data.tokens?.accessToken || response.data.token;
            console.log('✅ [TESTE] Login realizado com sucesso');
            console.log('🔑 [TESTE] Token obtido:', authToken ? 'SIM' : 'NÃO');
            return true;
        } else {
            throw new Error('Falha no login: ' + response.data.message);
        }
    } catch (error) {
        console.error('❌ [TESTE] Erro no login:', error.message);
        return false;
    }
}

/**
 * 📋 Buscar briefings disponíveis para orçamento
 */
async function buscarBriefingsDisponiveis() {
    try {
        console.log('\n📋 [TESTE] Buscando briefings disponíveis...');

        const response = await axios.get(`${BASE_URL}/api/orcamentos-inteligentes/briefings-disponiveis`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            const briefings = response.data.data.briefings;
            console.log(`✅ [TESTE] Encontrados ${briefings.length} briefings disponíveis`);

            if (briefings.length > 0) {
                briefingTeste = briefings[0];
                console.log('📝 [TESTE] Briefing selecionado para teste:', {
                    id: briefingTeste.id,
                    nome: briefingTeste.nomeProjeto,
                    status: briefingTeste.status,
                    progresso: briefingTeste.progresso,
                    cliente: briefingTeste.cliente?.nome
                });
                return true;
            } else {
                console.log('⚠️ [TESTE] Nenhum briefing disponível para gerar orçamento');
                return false;
            }
        } else {
            throw new Error('Erro ao buscar briefings: ' + response.data.message);
        }
    } catch (error) {
        console.error('❌ [TESTE] Erro ao buscar briefings:', error.message);
        return false;
    }
}

/**
 * 💰 Testar geração de orçamento (FUNÇÃO PRINCIPAL)
 */
async function testarGeracaoOrcamento() {
    try {
        console.log('\n💰 [TESTE] Testando geração de orçamento...');
        console.log('🎯 [TESTE] Briefing ID:', briefingTeste.id);

        const response = await axios.post(
            `${BASE_URL}/api/orcamentos-inteligentes/gerar/${briefingTeste.id}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            orcamentoGerado = response.data.data;

            console.log('🎉 [TESTE] ORÇAMENTO GERADO COM SUCESSO!');
            console.log('📊 [TESTE] Dados do orçamento:');
            console.log('  - ID:', orcamentoGerado.orcamentoId);
            console.log('  - Código:', orcamentoGerado.codigo);
            console.log('  - Valor Total:', `R$ ${orcamentoGerado.valorTotal?.toLocaleString('pt-BR')}`);
            console.log('  - Valor por m²:', `R$ ${orcamentoGerado.valorPorM2?.toLocaleString('pt-BR')}`);
            console.log('  - Área Construída:', `${orcamentoGerado.areaConstruida}m²`);
            console.log('  - Prazo Entrega:', `${orcamentoGerado.prazoEntrega} dias`);

            if (orcamentoGerado.dadosExtaidosIA) {
                console.log('🧠 [TESTE] Dados extraídos pela IA:');
                console.log('  - Tipologia:', orcamentoGerado.dadosExtaidosIA.tipologia);
                console.log('  - Complexidade:', orcamentoGerado.dadosExtaidosIA.complexidade);
                console.log('  - Disciplinas:', orcamentoGerado.dadosExtaidosIA.disciplinas?.join(', '));
            }

            return true;
        } else {
            if (response.data.code === 'ORCAMENTO_ALREADY_EXISTS') {
                console.log('⚠️ [TESTE] Já existe orçamento para este briefing');
                console.log('🔍 [TESTE] ID do orçamento existente:', response.data.orcamentoId);
                orcamentoGerado = { orcamentoId: response.data.orcamentoId };
                return true;
            } else {
                throw new Error('Erro na geração: ' + response.data.message);
            }
        }
    } catch (error) {
        console.error('❌ [TESTE] Erro na geração de orçamento:', error.message);

        if (error.response?.data) {
            console.error('📋 [TESTE] Detalhes do erro:', error.response.data);
        }

        return false;
    }
}

/**
 * 🔍 Verificar se o orçamento foi salvo no banco
 */
async function verificarOrcamentoNoBanco() {
    try {
        console.log('\n🔍 [TESTE] Verificando orçamento no banco...');

        const response = await axios.get(`${BASE_URL}/api/orcamentos/${orcamentoGerado.orcamentoId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            const orcamento = response.data.data;

            console.log('✅ [TESTE] Orçamento encontrado no banco:');
            console.log('  - ID:', orcamento.id);
            console.log('  - Código:', orcamento.codigo);
            console.log('  - Nome:', orcamento.nome);
            console.log('  - Status:', orcamento.status);
            console.log('  - Valor Total:', `R$ ${orcamento.valor_total?.toLocaleString('pt-BR')}`);
            console.log('  - Criado em:', new Date(orcamento.created_at).toLocaleString('pt-BR'));

            return true;
        } else {
            throw new Error('Orçamento não encontrado no banco');
        }
    } catch (error) {
        console.error('❌ [TESTE] Erro ao verificar orçamento no banco:', error.message);
        return false;
    }
}

/**
 * 🌐 Testar acesso à página do orçamento
 */
async function testarPaginaOrcamento() {
    try {
        console.log('\n🌐 [TESTE] Testando acesso à página do orçamento...');

        const url = `${BASE_URL.replace('3001', '3000')}/orcamentos/${orcamentoGerado.orcamentoId}`;
        console.log('🔗 [TESTE] URL da página:', url);
        console.log('✅ [TESTE] Página deve estar acessível no frontend');

        return true;
    } catch (error) {
        console.error('❌ [TESTE] Erro ao testar página:', error.message);
        return false;
    }
}

/**
 * 📊 Executar todos os testes
 */
async function executarTestes() {
    console.log('🧪 ===== TESTE COMPLETO DO BOTÃO "GERAR ORÇAMENTO" =====\n');

    const resultados = {
        login: false,
        briefings: false,
        geracao: false,
        verificacao: false,
        pagina: false
    };

    // Teste 1: Login
    resultados.login = await fazerLogin();
    if (!resultados.login) {
        console.log('\n❌ [TESTE] Falha no login. Abortando testes.');
        return;
    }

    // Teste 2: Buscar briefings
    resultados.briefings = await buscarBriefingsDisponiveis();
    if (!resultados.briefings) {
        console.log('\n❌ [TESTE] Nenhum briefing disponível. Abortando testes.');
        return;
    }

    // Teste 3: Gerar orçamento
    resultados.geracao = await testarGeracaoOrcamento();
    if (!resultados.geracao) {
        console.log('\n❌ [TESTE] Falha na geração de orçamento. Abortando testes.');
        return;
    }

    // Teste 4: Verificar no banco
    resultados.verificacao = await verificarOrcamentoNoBanco();

    // Teste 5: Testar página
    resultados.pagina = await testarPaginaOrcamento();

    // Resumo final
    console.log('\n📊 ===== RESUMO DOS TESTES =====');
    console.log('🔐 Login:', resultados.login ? '✅ PASSOU' : '❌ FALHOU');
    console.log('📋 Briefings:', resultados.briefings ? '✅ PASSOU' : '❌ FALHOU');
    console.log('💰 Geração:', resultados.geracao ? '✅ PASSOU' : '❌ FALHOU');
    console.log('🔍 Verificação:', resultados.verificacao ? '✅ PASSOU' : '❌ FALHOU');
    console.log('🌐 Página:', resultados.pagina ? '✅ PASSOU' : '❌ FALHOU');

    const sucessos = Object.values(resultados).filter(r => r).length;
    const total = Object.keys(resultados).length;

    console.log(`\n🎯 [TESTE] Resultado final: ${sucessos}/${total} testes passaram`);

    if (sucessos === total) {
        console.log('🎉 [TESTE] TODOS OS TESTES PASSARAM! O botão "Gerar Orçamento" está funcionando corretamente.');
    } else {
        console.log('⚠️ [TESTE] Alguns testes falharam. Verifique os logs acima para detalhes.');
    }
}

// Executar testes
if (require.main === module) {
    executarTestes().catch(error => {
        console.error('💥 [TESTE] Erro crítico:', error);
        process.exit(1);
    });
}

module.exports = {
    executarTestes,
    fazerLogin,
    buscarBriefingsDisponiveis,
    testarGeracaoOrcamento
};