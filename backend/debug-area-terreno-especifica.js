/**
 * 🔍 DEBUG ESPECÍFICO DA ÁREA DO TERRENO
 * 
 * Investigar por que a área do terreno está sendo extraída incorretamente
 */

const BriefingSemanticMapper = require('./utils/briefingSemanticMapper');
const BriefingAnalyzerDynamic = require('./utils/briefingAnalyzerDynamic');
const { connectDatabase, getClient } = require('./config/database');

async function debugAreaTerrenoEspecifica() {
    console.log('🔍 DEBUG ESPECÍFICO DA ÁREA DO TERRENO\n');

    try {
        await connectDatabase();
        const client = getClient();

        // Buscar o briefing real
        const briefingResult = await client.query(`
            SELECT * FROM briefings 
            WHERE id = $1
        `, ['6a9e3407-8da0-4bbc-8221-768b6e6d255e']);

        if (briefingResult.rows.length === 0) {
            console.log('❌ Briefing não encontrado');
            return;
        }

        const briefing = briefingResult.rows[0];
        console.log('📋 Briefing encontrado:', briefing.nome_projeto);

        // Extrair respostas
        let respostas = {};
        if (briefing.observacoes) {
            try {
                const observacoes = JSON.parse(briefing.observacoes);
                if (observacoes.respostas) {
                    respostas = { ...respostas, ...observacoes.respostas };
                }
            } catch (error) {
                console.warn('⚠️ Erro ao parsear observações:', error.message);
            }
        }

        console.log('📊 Total de respostas:', Object.keys(respostas).length);

        // Verificar perguntas específicas
        console.log('\n🔍 VERIFICANDO PERGUNTAS ESPECÍFICAS:');
        console.log('   Pergunta 24 (área construída):', respostas['24']);
        console.log('   Pergunta 62 (área terreno):', respostas['62']);
        console.log('   Pergunta 63 (dimensões):', respostas['63']);

        // Testar mapeamento semântico
        console.log('\n🧠 TESTANDO MAPEAMENTO SEMÂNTICO:');
        const mapper = new BriefingSemanticMapper();
        const mapeamento = mapper.mapearCampos(respostas);

        console.log('✅ Campos mapeados:');
        console.log('   area_construida:', mapeamento.campos.area_construida);
        console.log('   area_terreno:', mapeamento.campos.area_terreno);

        console.log('\n📊 Confiança do mapeamento:');
        console.log('   area_construida:', mapeamento.confianca.area_construida + '%');
        console.log('   area_terreno:', mapeamento.confianca.area_terreno + '%');

        // Testar analyzer dinâmico
        console.log('\n🧠 TESTANDO ANALYZER DINÂMICO:');
        const analyzer = new BriefingAnalyzerDynamic();
        const dadosExtraidos = await analyzer.extrairDadosEstruturados(briefing);

        console.log('✅ Dados extraídos pelo analyzer:');
        console.log('   areaConstruida:', dadosExtraidos.areaConstruida + 'm²');
        console.log('   areaTerreno:', dadosExtraidos.areaTerreno + 'm²');

        // Comparar com sistema antigo
        console.log('\n🔄 COMPARANDO COM SISTEMA ANTIGO:');
        const BriefingAnalyzer = require('./utils/briefingAnalyzer');
        const analyzerAntigo = new BriefingAnalyzer();
        const dadosAntigos = await analyzerAntigo.extrairDadosEstruturados(briefing);

        console.log('✅ Dados extraídos pelo sistema antigo:');
        console.log('   areaConstruida:', dadosAntigos.areaConstruida + 'm²');
        console.log('   areaTerreno:', dadosAntigos.areaTerreno + 'm²');

        // Análise do problema
        console.log('\n🎯 ANÁLISE DO PROBLEMA:');
        if (mapeamento.campos.area_terreno === mapeamento.campos.area_construida) {
            console.log('❌ PROBLEMA IDENTIFICADO: Área do terreno = Área construída');
            console.log('   Ambos os campos estão sendo mapeados para o mesmo valor');
            console.log('   Isso indica problema na lógica de mapeamento semântico');
        }

        if (dadosExtraidos.areaTerreno !== dadosAntigos.areaTerreno) {
            console.log('❌ DIVERGÊNCIA: Sistema dinâmico vs sistema antigo');
            console.log('   Sistema antigo (correto):', dadosAntigos.areaTerreno + 'm²');
            console.log('   Sistema dinâmico (incorreto):', dadosExtraidos.areaTerreno + 'm²');
        }

    } catch (error) {
        console.error('❌ Erro no debug:', error);
    }
}

debugAreaTerrenoEspecifica();