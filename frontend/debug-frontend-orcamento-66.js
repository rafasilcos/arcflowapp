/**
 * 🔍 DEBUG DO FRONTEND PARA ORÇAMENTO 66
 * Simular exatamente o que o frontend faz
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

// Função auxiliar para fazer parse JSON de forma segura (igual ao frontend)
function parseJsonSafely(data, fallback = null) {
  if (!data) return fallback;
  
  if (typeof data === 'object' && data !== null) {
    return data;
  }
  
  if (typeof data === 'string') {
    if (data.includes(',') && !data.startsWith('{') && !data.startsWith('[')) {
      return data.split(',').map(item => item.trim());
    }
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('⚠️ Erro ao fazer parse JSON:', error.message, 'Data:', data);
      return fallback;
    }
  }
  
  return fallback;
}

async function debugFrontendOrcamento66() {
  try {
    console.log('🔍 Simulando comportamento do frontend para orçamento 66...\n');
    
    // 1. Login (igual ao frontend)
    console.log('1️⃣ Fazendo login automático...');
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
    console.log('✅ Login realizado, token obtido');
    
    // 2. Buscar orçamento (igual ao frontend)
    console.log('\n2️⃣ Buscando orçamento via API...');
    const response = await makeRequest('http://localhost:3001/api/orcamentos/66', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const result = response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Erro ao carregar orçamento');
    }
    
    const orcamentoReal = result.data;
    console.log('✅ Dados brutos recebidos da API');
    
    // 3. Mapear dados (igual ao frontend)
    console.log('\n3️⃣ Mapeando dados para formato do frontend...');
    const orcamentoData = {
      id: orcamentoReal.id,
      codigo: orcamentoReal.codigo,
      nome: orcamentoReal.nome,
      cliente: orcamentoReal.cliente_nome || 'Cliente não informado',
      status: orcamentoReal.status,
      areaConstruida: orcamentoReal.area_construida || 0,
      areaTerreno: orcamentoReal.area_terreno || 0,
      valorTotal: orcamentoReal.valor_total || 0,
      valorPorM2: orcamentoReal.valor_por_m2 || 0,
      tipologia: orcamentoReal.tipologia,
      padrao: orcamentoReal.padrao,
      complexidade: orcamentoReal.complexidade,
      localizacao: orcamentoReal.localizacao,
      prazoEntrega: orcamentoReal.prazo_entrega || 0,
      disciplinas: parseJsonSafely(orcamentoReal.disciplinas, []),
      cronograma: parseJsonSafely(orcamentoReal.cronograma, null),
      composicaoFinanceira: parseJsonSafely(orcamentoReal.composicao_financeira, null),
      createdAt: orcamentoReal.created_at,
      updatedAt: orcamentoReal.updated_at
    };
    
    console.log('✅ Dados mapeados com sucesso');
    console.log('\n📊 DADOS MAPEADOS:');
    console.log('ID:', orcamentoData.id);
    console.log('Código:', orcamentoData.codigo);
    console.log('Nome:', orcamentoData.nome);
    console.log('Cliente:', orcamentoData.cliente);
    console.log('Valor Total:', orcamentoData.valorTotal);
    console.log('Área:', orcamentoData.areaConstruida);
    console.log('Disciplinas:', orcamentoData.disciplinas);
    
    // 4. Processar cronograma (igual ao frontend)
    console.log('\n4️⃣ Processando cronograma...');
    if (orcamentoData && orcamentoData.cronograma) {
      console.log('✅ Cronograma encontrado, processando...');
      
      const DISCIPLINAS_PADRAO = [
        { id: 'arquitetura', codigo: 'ARQUITETURA', nome: 'Arquitetura', icone: '🏗️', categoria: 'ESSENCIAL', descricao: 'Projeto arquitetônico completo', valorBase: 5000, horasBase: 40, ativa: true, ordem: 1 },
        { id: 'estrutural', codigo: 'ESTRUTURAL', nome: 'Estrutural', icone: '🏗️', categoria: 'ESSENCIAL', descricao: 'Projeto estrutural', valorBase: 4000, horasBase: 30, ativa: true, ordem: 2 },
        { id: 'hidraulica', codigo: 'INSTALACOES_HIDRAULICAS', nome: 'Instalações Hidráulicas', icone: '🚿', categoria: 'COMPLEMENTAR', descricao: 'Projeto hidrossanitário', valorBase: 2000, horasBase: 20, ativa: true, ordem: 3 },
        { id: 'eletrica', codigo: 'INSTALACOES_ELETRICAS', nome: 'Instalações Elétricas', icone: '⚡', categoria: 'COMPLEMENTAR', descricao: 'Projeto elétrico', valorBase: 2500, horasBase: 25, ativa: true, ordem: 4 }
      ];
      
      const cronogramaProcessado = Object.values(orcamentoData.cronograma.fases || {}).map((fase) => {
        // Converter disciplinas string para objetos Disciplina
        const disciplinasAtivasNaFase = (fase.disciplinas || []).map((discCodigo) => {
          const disciplinaEncontrada = DISCIPLINAS_PADRAO.find(d => 
            d.codigo.toUpperCase() === discCodigo.toUpperCase()
          );
          return disciplinaEncontrada || {
            id: discCodigo,
            codigo: discCodigo,
            nome: discCodigo,
            icone: '📋',
            categoria: 'ESSENCIAL',
            descricao: '',
            valorBase: 0,
            horasBase: 0,
            ativa: true,
            ordem: 1
          };
        });

        return {
          id: fase.nome?.replace(/\s+/g, '_').toUpperCase() || 'FASE',
          ordem: fase.ordem || 1,
          etapa: fase.etapa || '',
          nome: fase.nome || '',
          prazo: fase.prazo || 0,
          valor: fase.valor || 0,
          percentual: fase.percentual || 0,
          disciplinas: fase.disciplinas || [],
          disciplinasAtivasNaFase,
          responsavel: fase.responsavel || 'Equipe Técnica',
          entregaveis: fase.entregaveis || [],
          ativa: true
        };
      });
      
      console.log('✅ Cronograma processado');
      console.log('Prazo Total:', orcamentoData.cronograma.prazoTotal, 'semanas');
      console.log('Número de Fases:', cronogramaProcessado.length);
      console.log('Total de Entregáveis:', cronogramaProcessado.reduce((total, fase) => total + (fase.entregaveis?.length || 0), 0));
      
      // Mostrar primeira fase como exemplo
      if (cronogramaProcessado.length > 0) {
        const primeiraFase = cronogramaProcessado[0];
        console.log('\n📋 PRIMEIRA FASE (exemplo):');
        console.log('Nome:', primeiraFase.nome);
        console.log('Prazo:', primeiraFase.prazo, 'semanas');
        console.log('Valor:', primeiraFase.valor);
        console.log('Disciplinas:', primeiraFase.disciplinas);
        console.log('Entregáveis:', primeiraFase.entregaveis?.length || 0);
        console.log('Primeiros entregáveis:', primeiraFase.entregaveis?.slice(0, 3));
      }
      
    } else {
      console.log('❌ Cronograma não encontrado ou inválido');
    }
    
    console.log('\n✅ Debug concluído - dados processados corretamente!');
    
  } catch (error) {
    console.error('❌ Erro no debug:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar debug
debugFrontendOrcamento66();