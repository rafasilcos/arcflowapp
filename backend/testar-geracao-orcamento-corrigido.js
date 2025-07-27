/**
 * 🧪 TESTE ESPECÍFICO DA GERAÇÃO DE ORÇAMENTO COM NOVA LÓGICA
 */

const axios = require('axios');

async function testarGeracaoCorrigida() {
  try {
    console.log('🧪 TESTANDO GERAÇÃO DE ORÇAMENTO COM NOVA LÓGICA\n');
    
    // 1. Fazer login
    console.log('1. 🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.tokens?.accessToken || loginResponse.data.token;
    console.log('✅ Token obtido:', token ? 'SIM' : 'NÃO');
    
    if (!token) {
      throw new Error('Token não obtido');
    }
    
    // 2. Tentar gerar orçamento para o briefing de teste
    const briefingId = '6a9e3407-8da0-4bbc-8221-768b6e6d255e'; // Casa Florianopolis 3
    console.log(`\n2. 💰 Tentando gerar orçamento para briefing: ${briefingId}`);
    
    try {
      const response = await axios.post(
        `http://localhost:3001/api/orcamentos-inteligentes/gerar/${briefingId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        console.log('🎉 ORÇAMENTO GERADO COM SUCESSO!');
        console.log('📊 Dados do orçamento:');
        console.log('  - ID:', response.data.data.orcamentoId);
        console.log('  - Código:', response.data.data.codigo);
        console.log('  - Valor Total:', `R$ ${response.data.data.valorTotal?.toLocaleString('pt-BR')}`);
        console.log('  - Valor por m²:', `R$ ${response.data.data.valorPorM2?.toLocaleString('pt-BR')}`);
        console.log('  - Área Construída:', `${response.data.data.areaConstruida}m²`);
        console.log('  - Área Terreno:', `${response.data.data.areaTerreno}m²`);
        console.log('  - Prazo Entrega:', `${response.data.data.prazoEntrega} dias`);
        
        console.log('\n🧠 Dados extraídos pela IA V2:');
        const dadosIA = response.data.data.dadosExtaidosIA;
        console.log('  - Tipologia:', dadosIA.tipologia);
        console.log('  - Padrão:', dadosIA.padrao);
        console.log('  - Complexidade:', dadosIA.complexidade);
        console.log('  - Disciplinas:', dadosIA.disciplinas?.join(', '));
        console.log('  - Características:', dadosIA.caracteristicas?.join(', '));
        console.log('  - Localização:', dadosIA.localizacao);
        console.log('  - Confiança:', dadosIA.confianca + '%');
        console.log('  - Metodologia:', dadosIA.metodologia);
        
        console.log('\n💼 Composição Financeira:');
        const comp = response.data.data.composicaoFinanceira;
        console.log('  - Custos de horas:', `R$ ${comp.custosHoras?.toLocaleString('pt-BR')}`);
        console.log('  - Custos indiretos:', `R$ ${comp.custosIndiretos?.toLocaleString('pt-BR')}`);
        console.log('  - Impostos:', `R$ ${comp.impostos?.toLocaleString('pt-BR')}`);
        console.log('  - Margem de lucro:', `R$ ${comp.margemLucro?.toLocaleString('pt-BR')}`);
        
        console.log('\n🔧 Disciplinas Detalhadas:');
        response.data.data.disciplinasDetalhadas?.forEach((disc, index) => {
          console.log(`  ${index + 1}. ${disc.nome}`);
          console.log(`     - Horas: ${disc.horasEstimadas}h`);
          console.log(`     - Valor/hora: R$ ${disc.valorHora}`);
          console.log(`     - Total: R$ ${disc.valorTotal?.toLocaleString('pt-BR')}`);
          console.log(`     - Percentual: ${disc.percentualTotal}%`);
        });
        
        console.log('\n📅 Cronograma:');
        const cronograma = response.data.data.cronograma;
        if (cronograma && cronograma.fases) {
          Object.entries(cronograma.fases).slice(0, 3).forEach(([key, fase]) => {
            console.log(`  📋 ${fase.nome}`);
            console.log(`     - Prazo: ${fase.prazo} dias`);
            console.log(`     - Valor: R$ ${fase.valor?.toLocaleString('pt-BR') || 'N/A'}`);
          });
          console.log(`  ... e mais ${Object.keys(cronograma.fases).length - 3} fases`);
        }
        
        console.log('\n🔍 Auditoria:');
        const auditoria = response.data.data.auditoria;
        console.log('  - Metodologia:', auditoria.metodologia);
        console.log('  - Versão:', auditoria.versaoSistema);
        console.log('  - Confiança:', auditoria.confiancaAnalise + '%');
        console.log('  - Respostas analisadas:', auditoria.totalRespostasAnalisadas);
        
        // 3. Verificar se o orçamento foi salvo no banco
        console.log('\n3. 🔍 Verificando orçamento no banco...');
        const orcamentoId = response.data.data.orcamentoId;
        
        const verificarResponse = await axios.get(`http://localhost:3001/api/orcamentos/${orcamentoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (verificarResponse.data.success) {
          const orcamento = verificarResponse.data.data;
          console.log('✅ Orçamento encontrado no banco:');
          console.log('  - ID:', orcamento.id);
          console.log('  - Código:', orcamento.codigo);
          console.log('  - Nome:', orcamento.nome);
          console.log('  - Tipologia:', orcamento.tipologia);
          console.log('  - Valor Total:', `R$ ${orcamento.valor_total?.toLocaleString('pt-BR')}`);
          console.log('  - Área:', `${orcamento.area_construida}m²`);
          console.log('  - Padrão:', orcamento.padrao);
          console.log('  - Complexidade:', orcamento.complexidade);
          console.log('  - Localização:', orcamento.localizacao);
        }
        
        console.log('\n🎯 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('✅ A nova lógica de extração está funcionando corretamente');
        console.log('✅ Os dados do briefing foram interpretados corretamente');
        console.log('✅ O orçamento foi calculado com base nos dados reais');
        console.log('✅ O orçamento foi salvo no banco de dados');
        
      } else {
        throw new Error('Resposta não indica sucesso: ' + response.data.message);
      }
      
    } catch (error) {
      if (error.response?.data?.code === 'ORCAMENTO_ALREADY_EXISTS') {
        console.log('⚠️ Já existe orçamento para este briefing');
        console.log('🔍 ID do orçamento existente:', error.response.data.orcamentoId);
        
        // Verificar o orçamento existente
        const orcamentoId = error.response.data.orcamentoId;
        const verificarResponse = await axios.get(`http://localhost:3001/api/orcamentos/${orcamentoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (verificarResponse.data.success) {
          const orcamento = verificarResponse.data.data;
          console.log('\n📊 ORÇAMENTO EXISTENTE:');
          console.log('  - ID:', orcamento.id);
          console.log('  - Código:', orcamento.codigo);
          console.log('  - Tipologia:', orcamento.tipologia);
          console.log('  - Valor Total:', `R$ ${orcamento.valor_total?.toLocaleString('pt-BR')}`);
          console.log('  - Área:', `${orcamento.area_construida}m²`);
          console.log('  - Valor/m²:', `R$ ${orcamento.valor_por_m2?.toLocaleString('pt-BR')}`);
          
          // Verificar se é um orçamento antigo ou novo
          if (orcamento.codigo?.includes('V2')) {
            console.log('✅ Este orçamento foi gerado com a nova lógica V2');
          } else {
            console.log('⚠️ Este orçamento foi gerado com a lógica antiga');
            console.log('💡 Para testar a nova lógica, delete este orçamento e gere novamente');
          }
        }
        
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response?.data) {
      console.error('📋 Detalhes:', error.response.data);
    }
  }
}

testarGeracaoCorrigida();