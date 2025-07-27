const https = require('https');
const http = require('http');

// Configuração para testes
const BASE_URL = 'http://localhost:3001';
const TEST_BRIEFING_ID = '90d01a57-0791-4571-a669-3fa30462701d';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhMDI3Y2I2LTdhN2YtNDU3My1iNjlmLTZiYmE0ODY1NWIzZSIsImVtYWlsIjoicmFmYWVsQHRlc3RlLmNvbSIsIm5vbWUiOiJBZG1pbiBUZXN0ZSIsInJvbGUiOiJhZG1pbiIsImVzY3JpdG9yaW9JZCI6IjUwMjZmM2JjLWQ4MGQtNDIzMy1hY2Y1LWVhNDQ2YWRkOWI1ZiIsImlhdCI6MTc1MjA3NzIwNSwiZXhwIjoxNzUyMDc4MTA1LCJpc3MiOiJhcmNmbG93LWFwaSIsImF1ZCI6ImFyY2Zsb3ctY2xpZW50In0.w_YTCEjKjnpGhJYRfmFkpZwDRwGnOHhNKi4RQQRDjLg';

console.log('🧪 ==========================================');
console.log('   TESTE DAS APIS DE ESTRUTURAS PERSONALIZADAS');
console.log('🧪 ==========================================\n');

// Função para fazer requisições HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Teste 1: Verificar se servidor está rodando
async function teste1_HealthCheck() {
  console.log('📊 Teste 1: Health Check');
  try {
    const response = await makeRequest('GET', '/health');
    console.log('✅ Status:', response.statusCode);
    console.log('✅ Dados:', response.data);
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  console.log('');
}

// Teste 2: Carregar estrutura personalizada (deve retornar vazio inicialmente)
async function teste2_CarregarEstrutura() {
  console.log('📊 Teste 2: Carregar Estrutura Personalizada');
  try {
    const response = await makeRequest('GET', `/api/briefings/${TEST_BRIEFING_ID}/estrutura-personalizada`);
    console.log('✅ Status:', response.statusCode);
    console.log('✅ Dados:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  console.log('');
}

// Teste 3: Salvar estrutura personalizada
async function teste3_SalvarEstrutura() {
  console.log('📊 Teste 3: Salvar Estrutura Personalizada');
  
  const estruturaTeste = {
    personalizado: true,
    secoesVisiveis: ['1', '2'],
    briefingPersonalizado: {
      id: 'teste-estrutura',
      nome: 'Briefing Personalizado Teste',
      secoes: [
        {
          id: '1',
          nome: 'Seção 1 - Dados Básicos',
          ordem: 1,
          perguntas: [
            {
              id: '1',
              pergunta: 'Qual é o nome do projeto?',
              tipo: 'text',
              obrigatoria: true,
              ordem: 1
            },
            {
              id: '2',
              pergunta: 'Qual é o orçamento disponível?',
              tipo: 'moeda',
              obrigatoria: false,
              ordem: 2
            }
          ]
        },
        {
          id: '2',
          nome: 'Seção 2 - Requisitos',
          ordem: 2,
          perguntas: [
            {
              id: '3',
              pergunta: 'Descreva os requisitos principais',
              tipo: 'textarea',
              obrigatoria: true,
              ordem: 1
            }
          ]
        }
      ]
    },
    versao: 'v2024',
    criadoEm: new Date().toISOString(),
    clienteId: 'teste-cliente',
    projetoId: 'teste-projeto'
  };

  try {
    const response = await makeRequest('POST', `/api/briefings/${TEST_BRIEFING_ID}/estrutura-personalizada`, {
      estruturaPersonalizada: estruturaTeste
    });
    console.log('✅ Status:', response.statusCode);
    console.log('✅ Dados:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  console.log('');
}

// Teste 4: Carregar estrutura personalizada (deve retornar dados salvos)
async function teste4_CarregarEstruturaSalva() {
  console.log('📊 Teste 4: Carregar Estrutura Personalizada (Após Salvar)');
  try {
    const response = await makeRequest('GET', `/api/briefings/${TEST_BRIEFING_ID}/estrutura-personalizada`);
    console.log('✅ Status:', response.statusCode);
    console.log('✅ Dados:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  console.log('');
}

// Teste 5: Salvar respostas
async function teste5_SalvarRespostas() {
  console.log('📊 Teste 5: Salvar Respostas');
  
  const respostasTeste = {
    '1': 'Projeto Casa dos Sonhos',
    '2': 'R$ 500.000,00',
    '3': 'Casa moderna com 3 quartos, sala ampla, cozinha integrada e área gourmet'
  };

  try {
    const response = await makeRequest('POST', `/api/briefings/${TEST_BRIEFING_ID}/respostas`, {
      respostas: respostasTeste
    });
    console.log('✅ Status:', response.statusCode);
    console.log('✅ Dados:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  console.log('');
}

// Teste 6: Carregar respostas
async function teste6_CarregarRespostas() {
  console.log('📊 Teste 6: Carregar Respostas');
  try {
    const response = await makeRequest('GET', `/api/briefings/${TEST_BRIEFING_ID}/respostas`);
    console.log('✅ Status:', response.statusCode);
    console.log('✅ Dados:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  console.log('');
}

// Executar todos os testes
async function executarTestes() {
  console.log('🚀 Iniciando testes...\n');
  
  await teste1_HealthCheck();
  await teste2_CarregarEstrutura();
  await teste3_SalvarEstrutura();
  await teste4_CarregarEstruturaSalva();
  await teste5_SalvarRespostas();
  await teste6_CarregarRespostas();
  
  console.log('✅ Testes concluídos!');
  console.log('\n🎯 Se todos os testes passaram, o sistema está funcionando corretamente!');
}

// Executar
executarTestes().catch(console.error); 