/**
 * 🔧 CRIAR CONFIGURAÇÃO CORRETA PARA TESTE
 */

const { Client } = require('pg');

async function criarConfiguracaoTeste() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 CRIANDO CONFIGURAÇÃO DE TESTE');
    console.log('='.repeat(50));
    
    const escritorioId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    
    // Configuração de teste: apenas arquitetura ativa
    const configTeste = {
      disciplinas: {
        "PROJETO_ARQUITETONICO": {
          ativo: true,
          nome: "Projeto Arquitetônico",
          valorPorM2: 75,
          valorPorHora: 150
        },
        "PROJETO_ESTRUTURAL": {
          ativo: false, // DESATIVADO - escritório não faz estrutural
          nome: "Projeto Estrutural", 
          valorPorM2: 45,
          valorPorHora: 180
        },
        "PROJETOS_INSTALACOES": {
          ativo: false, // DESATIVADO - escritório não faz instalações
          nome: "Projetos de Instalações",
          valorPorM2: 35,
          valorPorHora: 160
        },
        "MODELAGEM_3D": {
          ativo: true,
          nome: "Modelagem 3D + 6 Renderizações",
          valorPorM2: 17,
          valorPorHora: 120
        },
        "APROVACAO_PREFEITURA": {
          ativo: true,
          nome: "Aprovação Prefeitura + Alvará",
          valorPorM2: 12,
          valorPorHora: 100
        }
      }
    };
    
    // Atualizar configuração
    const updateResult = await client.query(`
      UPDATE configuracoes_orcamento 
      SET 
        configuracoes = $1,
        updated_at = NOW()
      WHERE escritorio_id = $2
    `, [JSON.stringify(configTeste), escritorioId]);
    
    console.log('✅ Configuração atualizada');
    console.log(`🔄 Linhas afetadas: ${updateResult.rowCount}`);
    
    // Verificar configuração
    const verificacao = await client.query(`
      SELECT configuracoes FROM configuracoes_orcamento 
      WHERE escritorio_id = $1
    `, [escritorioId]);
    
    const config = verificacao.rows[0].configuracoes;
    
    console.log('\n📋 CONFIGURAÇÃO CRIADA:');
    Object.entries(config.disciplinas).forEach(([key, disciplina]) => {
      const status = disciplina.ativo ? '✅ ATIVO' : '❌ INATIVO';
      console.log(`${status} ${disciplina.nome}`);
    });
    
    console.log('\n🎯 CENÁRIO DE TESTE:');
    console.log('• Escritório faz APENAS projetos arquitetônicos');
    console.log('• NÃO faz projetos estruturais');
    console.log('• NÃO faz projetos de instalações');
    console.log('• Orçamento deve se adaptar automaticamente');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

criarConfiguracaoTeste();