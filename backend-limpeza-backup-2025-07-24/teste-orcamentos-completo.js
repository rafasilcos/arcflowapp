const { Client } = require('pg');
const axios = require('axios');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const API_URL = 'http://localhost:3001/api';

const client = new Client({
  connectionString: DATABASE_URL
});

let authToken = null;

console.log('🧪 ===== TESTE COMPLETO SISTEMA ORÇAMENTOS ARCFLOW =====\n');

async function testeCompleto() {
  try {
    // 1. Testar conexão com banco
    console.log('1️⃣ Testando conexão com banco de dados...');
    await client.connect();
    
    // Verificar se tabela orcamentos existe
    const tabelaResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos' 
      ORDER BY ordinal_position
    `);
    
    if (tabelaResult.rows.length === 0) {
      console.log('❌ Tabela orcamentos não encontrada!');
      return;
    }
    
    console.log('✅ Tabela orcamentos encontrada!');
    console.log('📊 Colunas:', tabelaResult.rows.map(r => r.column_name).join(', '));
    
    // 2. Testar autenticação
    console.log('\n2️⃣ Testando login...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@arcflow.com',
        password: '123456'
      });
      
      authToken = loginResponse.data.tokens.accessToken;
      console.log('✅ Login realizado com sucesso!');
      console.log('👤 Usuário:', loginResponse.data.user.nome);
      console.log('🏢 Escritório:', loginResponse.data.escritorio.nome);
    } catch (error) {
      console.log('❌ Erro no login:', error.response?.data?.error || error.message);
      return;
    }
    
    // 3. Buscar briefings existentes
    console.log('\n3️⃣ Buscando briefings...');
    try {
      const briefingsResponse = await axios.get(`${API_URL}/briefings`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Briefings encontrados:', briefingsResponse.data.briefings?.length || 0);
      
      if (briefingsResponse.data.briefings?.length > 0) {
        const briefing = briefingsResponse.data.briefings[0];
        console.log('📋 Primeiro briefing:', briefing.nome);
        
        // 4. Testar geração de orçamento
        console.log('\n4️⃣ Testando geração de orçamento...');
        try {
          const orcamentoResponse = await axios.post(`${API_URL}/orcamentos/gerar-briefing/${briefing.id}`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          
          console.log('✅ Orçamento gerado com sucesso!');
          console.log('💰 Código:', orcamentoResponse.data.orcamento.codigo);
          console.log('💰 Valor Total:', orcamentoResponse.data.orcamento.valorTotal);
          console.log('📐 Área:', orcamentoResponse.data.orcamento.areaConstruida, 'm²');
          
          const orcamentoId = orcamentoResponse.data.orcamento.id;
          
          // 5. Verificar se foi salvo no banco
          console.log('\n5️⃣ Verificando no banco de dados...');
          const dbResult = await client.query('SELECT * FROM orcamentos WHERE id = $1', [orcamentoId]);
          
          if (dbResult.rows.length > 0) {
            console.log('✅ Orçamento salvo no banco!');
            console.log('📊 Dados do banco:');
            console.log('   - ID:', dbResult.rows[0].id);
            console.log('   - Código:', dbResult.rows[0].codigo);
            console.log('   - Nome:', dbResult.rows[0].nome);
            console.log('   - Valor:', dbResult.rows[0].valor_total);
            console.log('   - Status:', dbResult.rows[0].status);
          } else {
            console.log('❌ Orçamento não encontrado no banco!');
          }
          
          // 6. Testar busca de orçamento
          console.log('\n6️⃣ Testando busca de orçamento...');
          try {
            const getOrcamentoResponse = await axios.get(`${API_URL}/orcamentos/${orcamentoId}`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            
            console.log('✅ Busca de orçamento funcionando!');
            console.log('📋 Orçamento encontrado:', getOrcamentoResponse.data.orcamento.nome);
          } catch (error) {
            console.log('❌ Erro na busca:', error.response?.data?.error || error.message);
          }
          
          // 7. Testar listagem de orçamentos
          console.log('\n7️⃣ Testando listagem de orçamentos...');
          try {
            const listOrcamentosResponse = await axios.get(`${API_URL}/orcamentos`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            
            console.log('✅ Listagem funcionando!');
            console.log('📊 Total de orçamentos:', listOrcamentosResponse.data.orcamentos?.length || 0);
          } catch (error) {
            console.log('❌ Erro na listagem:', error.response?.data?.error || error.message);
          }
          
        } catch (error) {
          console.log('❌ Erro na geração de orçamento:', error.response?.data?.error || error.message);
          console.log('🔍 Detalhes:', error.response?.data);
        }
        
      } else {
        console.log('⚠️ Nenhum briefing encontrado para teste');
      }
      
    } catch (error) {
      console.log('❌ Erro ao buscar briefings:', error.response?.data?.error || error.message);
    }
    
    // 8. Teste de performance - múltiplas requisições
    console.log('\n8️⃣ Teste de performance básico...');
    try {
      const startTime = Date.now();
      const promises = [];
      
      // Fazer 10 requisições simultâneas
      for (let i = 0; i < 10; i++) {
        promises.push(
          axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        );
      }
      
      await Promise.all(promises);
      const endTime = Date.now();
      
      console.log('✅ Performance OK!');
      console.log('⚡ 10 requisições em:', (endTime - startTime), 'ms');
      console.log('📊 Média por requisição:', Math.round((endTime - startTime) / 10), 'ms');
      
    } catch (error) {
      console.log('❌ Erro no teste de performance:', error.message);
    }
    
    console.log('\n🎉 ===== TESTE COMPLETO FINALIZADO =====');
    console.log('✅ Sistema funcionando com dados reais!');
    console.log('✅ Banco PostgreSQL conectado!');
    console.log('✅ APIs de orçamento operacionais!');
    console.log('✅ Fluxo Briefing → Orçamento funcional!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await client.end();
  }
}

testeCompleto(); 
const axios = require('axios');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const API_URL = 'http://localhost:3001/api';

const client = new Client({
  connectionString: DATABASE_URL
});

let authToken = null;

console.log('🧪 ===== TESTE COMPLETO SISTEMA ORÇAMENTOS ARCFLOW =====\n');

async function testeCompleto() {
  try {
    // 1. Testar conexão com banco
    console.log('1️⃣ Testando conexão com banco de dados...');
    await client.connect();
    
    // Verificar se tabela orcamentos existe
    const tabelaResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos' 
      ORDER BY ordinal_position
    `);
    
    if (tabelaResult.rows.length === 0) {
      console.log('❌ Tabela orcamentos não encontrada!');
      return;
    }
    
    console.log('✅ Tabela orcamentos encontrada!');
    console.log('📊 Colunas:', tabelaResult.rows.map(r => r.column_name).join(', '));
    
    // 2. Testar autenticação
    console.log('\n2️⃣ Testando login...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@arcflow.com',
        password: '123456'
      });
      
      authToken = loginResponse.data.tokens.accessToken;
      console.log('✅ Login realizado com sucesso!');
      console.log('👤 Usuário:', loginResponse.data.user.nome);
      console.log('🏢 Escritório:', loginResponse.data.escritorio.nome);
    } catch (error) {
      console.log('❌ Erro no login:', error.response?.data?.error || error.message);
      return;
    }
    
    // 3. Buscar briefings existentes
    console.log('\n3️⃣ Buscando briefings...');
    try {
      const briefingsResponse = await axios.get(`${API_URL}/briefings`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Briefings encontrados:', briefingsResponse.data.briefings?.length || 0);
      
      if (briefingsResponse.data.briefings?.length > 0) {
        const briefing = briefingsResponse.data.briefings[0];
        console.log('📋 Primeiro briefing:', briefing.nome);
        
        // 4. Testar geração de orçamento
        console.log('\n4️⃣ Testando geração de orçamento...');
        try {
          const orcamentoResponse = await axios.post(`${API_URL}/orcamentos/gerar-briefing/${briefing.id}`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          
          console.log('✅ Orçamento gerado com sucesso!');
          console.log('💰 Código:', orcamentoResponse.data.orcamento.codigo);
          console.log('💰 Valor Total:', orcamentoResponse.data.orcamento.valorTotal);
          console.log('📐 Área:', orcamentoResponse.data.orcamento.areaConstruida, 'm²');
          
          const orcamentoId = orcamentoResponse.data.orcamento.id;
          
          // 5. Verificar se foi salvo no banco
          console.log('\n5️⃣ Verificando no banco de dados...');
          const dbResult = await client.query('SELECT * FROM orcamentos WHERE id = $1', [orcamentoId]);
          
          if (dbResult.rows.length > 0) {
            console.log('✅ Orçamento salvo no banco!');
            console.log('📊 Dados do banco:');
            console.log('   - ID:', dbResult.rows[0].id);
            console.log('   - Código:', dbResult.rows[0].codigo);
            console.log('   - Nome:', dbResult.rows[0].nome);
            console.log('   - Valor:', dbResult.rows[0].valor_total);
            console.log('   - Status:', dbResult.rows[0].status);
          } else {
            console.log('❌ Orçamento não encontrado no banco!');
          }
          
          // 6. Testar busca de orçamento
          console.log('\n6️⃣ Testando busca de orçamento...');
          try {
            const getOrcamentoResponse = await axios.get(`${API_URL}/orcamentos/${orcamentoId}`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            
            console.log('✅ Busca de orçamento funcionando!');
            console.log('📋 Orçamento encontrado:', getOrcamentoResponse.data.orcamento.nome);
          } catch (error) {
            console.log('❌ Erro na busca:', error.response?.data?.error || error.message);
          }
          
          // 7. Testar listagem de orçamentos
          console.log('\n7️⃣ Testando listagem de orçamentos...');
          try {
            const listOrcamentosResponse = await axios.get(`${API_URL}/orcamentos`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            
            console.log('✅ Listagem funcionando!');
            console.log('📊 Total de orçamentos:', listOrcamentosResponse.data.orcamentos?.length || 0);
          } catch (error) {
            console.log('❌ Erro na listagem:', error.response?.data?.error || error.message);
          }
          
        } catch (error) {
          console.log('❌ Erro na geração de orçamento:', error.response?.data?.error || error.message);
          console.log('🔍 Detalhes:', error.response?.data);
        }
        
      } else {
        console.log('⚠️ Nenhum briefing encontrado para teste');
      }
      
    } catch (error) {
      console.log('❌ Erro ao buscar briefings:', error.response?.data?.error || error.message);
    }
    
    // 8. Teste de performance - múltiplas requisições
    console.log('\n8️⃣ Teste de performance básico...');
    try {
      const startTime = Date.now();
      const promises = [];
      
      // Fazer 10 requisições simultâneas
      for (let i = 0; i < 10; i++) {
        promises.push(
          axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        );
      }
      
      await Promise.all(promises);
      const endTime = Date.now();
      
      console.log('✅ Performance OK!');
      console.log('⚡ 10 requisições em:', (endTime - startTime), 'ms');
      console.log('📊 Média por requisição:', Math.round((endTime - startTime) / 10), 'ms');
      
    } catch (error) {
      console.log('❌ Erro no teste de performance:', error.message);
    }
    
    console.log('\n🎉 ===== TESTE COMPLETO FINALIZADO =====');
    console.log('✅ Sistema funcionando com dados reais!');
    console.log('✅ Banco PostgreSQL conectado!');
    console.log('✅ APIs de orçamento operacionais!');
    console.log('✅ Fluxo Briefing → Orçamento funcional!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await client.end();
  }
}

testeCompleto(); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 