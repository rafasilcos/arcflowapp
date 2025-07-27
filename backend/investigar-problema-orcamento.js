const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function investigarProblema() {
    console.log('🔍 INVESTIGANDO PROBLEMA DE ORÇAMENTO');
    console.log('============================================================');
    
    try {
        // 1. Verificar usuários admin
        console.log('👤 VERIFICANDO USUÁRIOS ADMIN...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin')
            .limit(5);

        if (usersError) {
            console.log('❌ Erro ao buscar usuários:', usersError.message);
        } else {
            console.log(`✅ Encontrados ${users.length} usuários admin:`);
            users.forEach(user => {
                console.log(`- ${user.email} (ID: ${user.id})`);
            });
        }

        // 2. Verificar briefings disponíveis
        console.log('\n📋 VERIFICANDO BRIEFINGS...');
        const { data: briefings, error: briefingsError } = await supabase
            .from('briefings')
            .select('id, nome_projeto, area_total, tipologia, status')
            .limit(5);

        if (briefingsError) {
            console.log('❌ Erro ao buscar briefings:', briefingsError.message);
        } else {
            console.log(`✅ Encontrados ${briefings.length} briefings:`);
            briefings.forEach(briefing => {
                console.log(`- ID: ${briefing.id} | ${briefing.nome_projeto || 'Sem nome'} | ${briefing.area_total || 'N/A'}m² | ${briefing.tipologia || 'N/A'}`);
            });
        }

        // 3. Verificar orçamentos existentes
        console.log('\n💰 VERIFICANDO ORÇAMENTOS...');
        const { data: orcamentos, error: orcamentosError } = await supabase
            .from('orcamentos')
            .select('id, nome_projeto, area_total, valor_total, status')
            .limit(5);

        if (orcamentosError) {
            console.log('❌ Erro ao buscar orçamentos:', orcamentosError.message);
        } else {
            console.log(`✅ Encontrados ${orcamentos.length} orçamentos:`);
            orcamentos.forEach(orcamento => {
                console.log(`- ID: ${orcamento.id} | ${orcamento.nome_projeto || 'Sem nome'} | R$ ${orcamento.valor_total?.toLocaleString('pt-BR') || 'N/A'}`);
            });
        }

        // 4. Verificar configurações de escritório
        console.log('\n🏢 VERIFICANDO CONFIGURAÇÕES...');
        const { data: configs, error: configsError } = await supabase
            .from('configuracoes_escritorio')
            .select('*')
            .limit(3);

        if (configsError) {
            console.log('❌ Erro ao buscar configurações:', configsError.message);
        } else {
            console.log(`✅ Encontradas ${configs.length} configurações de escritório`);
            configs.forEach(config => {
                console.log(`- Escritório ID: ${config.escritorio_id} | Valor/m²: R$ ${config.valor_m2_base || 'N/A'}`);
            });
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

investigarProblema();