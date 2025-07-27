#!/usr/bin/env node

/**
 * Teste das APIs de Configuração de Orçamento
 * Testa todos os endpoints relacionados à configuração de orçamentos
 */

const axios = require('axios');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

const BASE_URL = 'http://localhost:3001';
let authToken = '';
let escritorioId = '';

async function fazerLogin() {
  try {
    console.log('🔐 Fazendo login...');
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'usuario1751209003626@teste.com',
      password: 'senha123'
    });
    
    if (response.data.success) {
      authToken = response.data.token;
      escritorioId = response.data.user.escritorio_id;
      console.log('✅ Login realizado com sucesso');
      console.log('📋 Escritório ID:', escritorioId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    return false;
  }
}

async function testarBuscarConfiguracoes() {
  try {
    console.log('\n📋 1. Testando busca de configurações...');
    
    const response = await axios.get(
      `${BASE_URL}/api/configuracoes-orcamento/escritorio/${escritorioId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Configurações encontradas');
      console.log('📊 Dados:', JSON.stringify(response.data.data, null, 2));
      return response.data.data;
    } else {
      console.log('❌ Falha ao buscar configurações:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error.response?.data || error.message);
    return null;
  }
}

async function testarAtualizarConfiguracoes() {
  try {
    console.log('\n📝 2. Testando atualização de configurações...');
    
    const novasConfiguracoes = {
      tabelaPrecos: {
        arquitetura: {
          valor_hora_senior: 200,
          valor_hora_pleno: 150,
          valor_hora_junior: 100,
          valor_hora_estagiario: 50
        },
        estrutural: {
          valor_hora_senior: 220,
          valor_hora_pleno: 170,
          valor_hora_junior: 120,
          valor_hora_estagiario: 60
        },
        instalacoes: {
          valor_hora_senior: 180,
          valor_hora_pleno: 140,
          valor_hora_junior: 90,
          valor_hora_estagiario: 45
        }
      },
      multiplicadores: {
        residencial: {
          unifamiliar: 1.0,
          multifamiliar: 1.2,
          condominio: 1.4
        },
        comercial: {
          escritorio: 1.1,
          loja: 1.0,
          hotel: 1.5,
          shopping: 1.8
        },
        industrial: {
          fabrica: 1.3,
          galpao: 1.0,
          centro_logistico: 1.2
        }
      },
      parametrosComplexidade: {
        baixa: {
          multiplicador: 0.8,
          horas_base_m2: 0.6
        },
        media: {
          multiplicador: 1.0,
          horas_base_m2: 0.8
        },
        alta: {
          multiplicador: 1.3,
          horas_base_m2: 1.0
        },
        muito_alta: {
          multiplicador: 1.6,
          horas_base_m2: 1.2
        }
      },
      configuracoesPadrao: {
        margem_lucro: 0.25,
        impostos: 0.15,
        custos_indiretos: 0.10,
        contingencia: 0.05
      }
    };
    
    const response = await axios.put(
      `${BASE_URL}/api/configuracoes-orcamento/escritorio/${escritorioId}`,
      novasConfiguracoes,
      {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Configurações atualizadas com sucesso');
      console.log('📊 Dados atualizados:', JSON.stringify(response.data.data, null, 2));
      return true;
    } else {
      console.log('❌ Falha ao atualizar configurações:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error.response?.data || error.message);
    return false;
  }
}

async function testarValidarConfiguracoes() {
  try {
    console.log('\n🔍 3. Testando validação de configurações...');
    
    const response = await axios.get(
      `${BASE_URL}/api/configuracoes-orcamento/validar/${escritorioId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Validação realizada');
      console.log('📊 Resultado:', JSON.stringify(response.data.data, null, 2));
      return response.data.data;
    } else {
      console.log('❌ Falha na validação:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro na validação:', error.response?.data || error.message);
    return null;
  }
}

async function testarBuscarTemplates() {
  try {
    console.log('\n📋 4. Testando busca de templates...');
    
    const response = await axios.get(
      `${BASE_URL}/api/configuracoes-orcamento/templates`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Templates encontrados');
      console.log('📊 Templates:', JSON.stringify(response.data.data, null, 2));
      return response.data.data;
    } else {
      console.log('❌ Falha ao buscar templates:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar templates:', error.response?.data || error.message);
    return null;
  }
}

async function testarRestaurarPadrao() {
  try {
    console.log('\n🔄 5. Testando restauração de configurações padrão...');
    
    const response = await axios.post(
      `${BASE_URL}/api/configuracoes-orcamento/reset/${escritorioId}`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Configurações padrão restauradas');
      console.log('📊 Configurações:', JSON.stringify(response.data.data, null, 2));
      return true;
    } else {
      console.log('❌ Falha ao restaurar configurações:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao restaurar configurações:', error.response?.data || error.message);
    return false;
  }
}

async function testarAplicarTemplate() {
  try {
    console.log('\n🎨 6. Testando aplicação de template...');
    
    const response = await axios.post(
      `${BASE_URL}/api/configuracoes-orcamento/aplicar-template/${escritorioId}`,
      { templateId: 'escritorio-medio' },
      {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Template aplicado com sucesso');
      console.log('📊 Configurações:', JSON.stringify(response.data.data, null, 2));
      return true;
    } else {
      console.log('❌ Falha ao aplicar template:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao aplicar template:', error.response?.data || error.message);
    return false;
  }
}

async function testarPermissoes() {
  try {
    console.log('\n🔒 7. Testando controle de permissões...');
    
    // Tentar acessar configurações de outro escritório (deve falhar)
    const escritorioInexistente = 'escritorio-inexistente';
    
    const response = await axios.get(
      `${BASE_URL}/api/configuracoes-orcamento/escritorio/${escritorioInexistente}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.status === 403) {
      console.log('✅ Controle de permissões funcionando - acesso negado');
      return true;
    } else {
      console.log('❌ Falha no controle de permissões - acesso permitido indevidamente');
      return false;
    }
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Controle de permissões funcionando - acesso negado');
      return true;
    } else {
      console.error('❌ Erro inesperado no teste de permissões:', error.response?.data || error.message);
      return false;
    }
  }
}

async function verificarBancoDados() {
  try {
    console.log('\n🗄️ 8. Verificando dados no banco...');
    await client.connect();
    
    // Verificar configurações salvas
    const configuracoes = await client.query(`
      SELECT 
        id,
        escritorio_id,
        tabela_precos,
        multiplicadores_tipologia,
        parametros_complexidade,
        configuracoes_gerais,
        ativo,
        created_at,
        updated_at
      FROM configuracoes_orcamento 
      WHERE escritorio_id = $1
      ORDER BY updated_at DESC
      LIMIT 1;
    `, [escritorioId]);
    
    if (configuracoes.rows.length > 0) {
      console.log('✅ Configurações encontradas no banco');
      console.log('📊 Última atualização:', configuracoes.rows[0].updated_at);
      console.log('📋 Ativo:', configuracoes.rows[0].ativo);
    } else {
      console.log('❌ Nenhuma configuração encontrada no banco');
    }
    
    // Verificar histórico de alterações
    const historico = await client.query(`
      SELECT COUNT(*) as total
      FROM configuracoes_orcamento 
      WHERE escritorio_id = $1;
    `, [escritorioId]);
    
    console.log('📈 Total de registros de configuração:', historico.rows[0].total);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error);
    return false;
  } finally {
    await client.end();
  }
}

async function executarTestes() {
  try {
    console.log('🚀 Iniciando testes das APIs de Configuração de Orçamento...');
    
    // 1. Fazer login
    const loginSuccess = await fazerLogin();
    if (!loginSuccess) {
      console.log('❌ Falha no login. Encerrando testes.');
      return;
    }
    
    // 2. Buscar configurações
    const configuracoes = await testarBuscarConfiguracoes();
    
    // 3. Atualizar configurações
    const atualizacaoSuccess = await testarAtualizarConfiguracoes();
    
    // 4. Validar configurações
    const validacao = await testarValidarConfiguracoes();
    
    // 5. Buscar templates
    const templates = await testarBuscarTemplates();
    
    // 6. Aplicar template
    const templateSuccess = await testarAplicarTemplate();
    
    // 7. Restaurar padrão
    const restaurarSuccess = await testarRestaurarPadrao();
    
    // 8. Testar permissões
    const permissoesSuccess = await testarPermissoes();
    
    // 9. Verificar banco de dados
    const bancoSuccess = await verificarBancoDados();
    
    // Resumo dos testes
    console.log('\n🎉 RESUMO DOS TESTES:');
    console.log('✅ Login:', loginSuccess ? 'PASSOU' : 'FALHOU');
    console.log('✅ Buscar configurações:', configuracoes ? 'PASSOU' : 'FALHOU');
    console.log('✅ Atualizar configurações:', atualizacaoSuccess ? 'PASSOU' : 'FALHOU');
    console.log('✅ Validar configurações:', validacao ? 'PASSOU' : 'FALHOU');
    console.log('✅ Buscar templates:', templates ? 'PASSOU' : 'FALHOU');
    console.log('✅ Aplicar template:', templateSuccess ? 'PASSOU' : 'FALHOU');
    console.log('✅ Restaurar padrão:', restaurarSuccess ? 'PASSOU' : 'FALHOU');
    console.log('✅ Controle de permissões:', permissoesSuccess ? 'PASSOU' : 'FALHOU');
    console.log('✅ Verificação do banco:', bancoSuccess ? 'PASSOU' : 'FALHOU');
    
    const totalTestes = 9;
    const testesPassaram = [
      loginSuccess,
      !!configuracoes,
      atualizacaoSuccess,
      !!validacao,
      !!templates,
      templateSuccess,
      restaurarSuccess,
      permissoesSuccess,
      bancoSuccess
    ].filter(Boolean).length;
    
    console.log(`\n📊 RESULTADO FINAL: ${testesPassaram}/${totalTestes} testes passaram`);
    
    if (testesPassaram === totalTestes) {
      console.log('🎉 TODOS OS TESTES PASSARAM! APIs de configuração funcionando corretamente.');
    } else {
      console.log('⚠️ Alguns testes falharam. Verifique os logs acima.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
  }
}

// Executar testes
executarTestes();