/**
 * 🔍 TESTE DA API PARA ORÇAMENTO 66
 * Verificar se os dados estão sendo retornados corretamente
 */

const https = require('https');
const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ ok: res.statusCode < 400, status: res.statusCode, statusText: res.statusMessage, json: () => jsonData });
        } catch (error) {
          resolve({ ok: res.statusCode < 400, status: res.statusCode, statusText: res.statusMessage, text: () => data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testarApiOrcamento66() {
  try {
    console.log('🔍 Testando API do orçamento 66...\n');
    
    // 1. Fazer login primeiro
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await makeRequest('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Erro no login: ${loginResponse.status}`);
    }
    
    const loginData = loginResponse.json();
    const token = loginData.tokens?.accessToken || loginData.token;
    
    if (!token) {
      throw new Error('Token não encontrado na resposta do login');
    }
    
    console.log('✅ Login realizado com sucesso');
    
    // 2. Buscar orçamento 66
    console.log('\n2️⃣ Buscando orçamento 66...');
    const orcamentoResponse = await makeRequest('http://localhost:3001/api/orcamentos/66', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!orcamentoResponse.ok) {
      throw new Error(`Erro ao buscar orçamento: ${orcamentoResponse.status} - ${orcamentoResponse.statusText}`);
    }
    
    const result = orcamentoResponse.json();
    
    if (!result.success) {
      throw new Error(`API retornou erro: ${result.message}`);
    }
    
    const orcamento = result.data;
    
    console.log('✅ Orçamento 66 encontrado!');
    console.log('\n📊 DADOS DO ORÇAMENTO:');
    console.log('ID:', orcamento.id);
    console.log('Código:', orcamento.codigo);
    console.log('Nome:', orcamento.nome);
    console.log('Cliente:', orcamento.cliente_nome);
    console.log('Status:', orcamento.status);
    console.log('Valor Total:', orcamento.valor_total);
    console.log('Área Construída:', orcamento.area_construida);
    console.log('Tipologia:', orcamento.tipologia);
    console.log('Padrão:', orcamento.padrao);
    console.log('Complexidade:', orcamento.complexidade);
    
    // 3. Verificar cronograma
    console.log('\n📅 CRONOGRAMA:');
    if (orcamento.cronograma) {
      let cronograma;
      try {
        cronograma = typeof orcamento.cronograma === 'string' 
          ? JSON.parse(orcamento.cronograma) 
          : orcamento.cronograma;
        
        console.log('Prazo Total:', cronograma.prazoTotal, 'semanas');
        console.log('Número de Fases:', Object.keys(cronograma.fases || {}).length);
        
        // Mostrar algumas fases
        const fases = Object.values(cronograma.fases || {});
        fases.slice(0, 3).forEach((fase, index) => {
          console.log(`\nFase ${index + 1}:`, fase.nome);
          console.log('  Prazo:', fase.prazo, 'semanas');
          console.log('  Valor:', fase.valor);
          console.log('  Entregáveis:', fase.entregaveis?.length || 0);
        });
        
      } catch (error) {
        console.log('❌ Erro ao fazer parse do cronograma:', error.message);
        console.log('Cronograma raw:', orcamento.cronograma);
      }
    } else {
      console.log('❌ Cronograma não encontrado');
    }
    
    // 4. Verificar disciplinas
    console.log('\n🎯 DISCIPLINAS:');
    if (orcamento.disciplinas) {
      let disciplinas;
      try {
        disciplinas = typeof orcamento.disciplinas === 'string' 
          ? JSON.parse(orcamento.disciplinas) 
          : orcamento.disciplinas;
        
        console.log('Disciplinas ativas:', disciplinas);
      } catch (error) {
        console.log('❌ Erro ao fazer parse das disciplinas:', error.message);
        console.log('Disciplinas raw:', orcamento.disciplinas);
      }
    } else {
      console.log('❌ Disciplinas não encontradas');
    }
    
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    process.exit(1);
  }
}

// Executar teste
testarApiOrcamento66();