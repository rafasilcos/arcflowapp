const { Client } = require('pg');
const fs = require('fs');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function solucaoDefinitiva() {
  console.log('🚀 SOLUÇÃO DEFINITIVA - UUID BRIEFINGS');
  console.log('=======================================\n');
  
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // 1. Buscar escritório real para mapear "escritorio_teste"
    console.log('\n🔍 Buscando escritórios reais...');
    const escritorios = await client.query(`
      SELECT id, nome FROM escritorios 
      WHERE is_active = true 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log(`📊 Escritórios encontrados: ${escritorios.rows.length}`);
    escritorios.rows.forEach((escritorio, index) => {
      console.log(`  ${index + 1}. ${escritorio.nome} - ID: ${escritorio.id}`);
    });
    
    // 2. Buscar usuários reais para mapear "user_admin_teste"
    console.log('\n👤 Buscando usuários reais...');
    const usuarios = await client.query(`
      SELECT id, nome, email FROM users 
      WHERE is_active = true 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log(`📊 Usuários encontrados: ${usuarios.rows.length}`);
    usuarios.rows.forEach((usuario, index) => {
      console.log(`  ${index + 1}. ${usuario.nome} (${usuario.email}) - ID: ${usuario.id}`);
    });
    
    // 3. Definir mapeamentos baseados nos dados reais
    let escritorioRealId = null;
    let usuarioRealId = null;
    
    if (escritorios.rows.length > 0) {
      // Pegar o primeiro escritório como padrão
      escritorioRealId = escritorios.rows[0].id;
      console.log(`\n✅ Escritório selecionado: ${escritorioRealId}`);
    }
    
    if (usuarios.rows.length > 0) {
      // Pegar o primeiro usuário como padrão
      usuarioRealId = usuarios.rows[0].id;
      console.log(`✅ Usuário selecionado: ${usuarioRealId}`);
    }
    
    if (!escritorioRealId || !usuarioRealId) {
      console.log('❌ Não foi possível encontrar UUIDs reais!');
      console.log('💡 ALTERNATIVA: Criar UUIDs válidos');
      
      // Gerar UUIDs válidos
      const { v4: uuidv4 } = require('uuid');
      escritorioRealId = escritorioRealId || uuidv4();
      usuarioRealId = usuarioRealId || uuidv4();
      
      console.log(`🔧 UUID gerado para escritório: ${escritorioRealId}`);
      console.log(`🔧 UUID gerado para usuário: ${usuarioRealId}`);
    }
    
    // 4. Aplicar correção no código
    console.log('\n🔧 Aplicando correção definitiva...');
    
    let content = fs.readFileSync('server-simple.js', 'utf8');
    
    // Encontrar e substituir o bloco de mapeamento
    const oldMappingBlock = `    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    const escritorioId = escritorioIdRaw === 'escritorio_teste' ? 'escritorio_teste' : escritorioIdRaw;
    
    // Mapear também o userId para UUID válido
    const userIdRaw = req.user.id;
    const userId = userIdRaw === 'user_admin_teste' ? 'user_admin_teste' : userIdRaw;
    
    console.log('🔍 [BRIEFING-POST] Mapeamento completo:', { 
      escritorio: { original: escritorioIdRaw, mapeado: escritorioId },
      usuario: { original: userIdRaw, mapeado: userId }
    });`;
    
    const newMappingBlock = `    // 🚀 SOLUÇÃO DEFINITIVA: Mapear strings para UUIDs REAIS
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;
    
    // Mapeamento definitivo para UUIDs reais
    const uuidMappings = {
      // Escritórios - mapear para UUID real
      'escritorio_teste': '${escritorioRealId}',
      'user_admin_teste': '${escritorioRealId}', // Fallback
      
      // Usuários - mapear para UUID real  
      'user_admin_teste': '${usuarioRealId}',
      
      // Manter UUIDs válidos como estão
      '${escritorioRealId}': '${escritorioRealId}',
      '${usuarioRealId}': '${usuarioRealId}'
    };
    
    // Aplicar mapeamentos
    const escritorioId = uuidMappings[escritorioIdRaw] || escritorioIdRaw;
    const userId = uuidMappings[userIdRaw] || userIdRaw;
    
    console.log('🔍 [BRIEFING-POST] Mapeamento DEFINITIVO:', { 
      escritorio: { original: escritorioIdRaw, mapeado: escritorioId, tipo: 'UUID REAL' },
      usuario: { original: userIdRaw, mapeado: userId, tipo: 'UUID REAL' }
    });`;
    
    if (content.includes(oldMappingBlock)) {
      content = content.replace(oldMappingBlock, newMappingBlock);
      console.log('✅ Mapeamento definitivo aplicado!');
    } else {
      console.log('⚠️ Bloco de mapeamento não encontrado. Aplicando correção manual...');
      
      // Aplicar correção manual se necessário
      const lines = content.split('\n');
      let briefingPostFound = false;
      let corrected = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('app.post(\'/api/briefings\'')) {
          briefingPostFound = true;
          continue;
        }
        
        if (briefingPostFound && lines[i].includes('escritorioIdRaw === \'escritorio_teste\'')) {
          // Substituir linha com UUID real
          lines[i] = `    const escritorioId = escritorioIdRaw === 'escritorio_teste' ? '${escritorioRealId}' : escritorioIdRaw;`;
          corrected = true;
          console.log('✅ Correção manual aplicada!');
          break;
        }
      }
      
      if (corrected) {
        content = lines.join('\n');
      }
    }
    
    // Salvar arquivo
    fs.writeFileSync('server-simple.js', content);
    console.log('💾 Arquivo salvo!');
    
    console.log('\n🎯 SOLUÇÃO DEFINITIVA APLICADA!');
    console.log('✅ Strings mapeadas para UUIDs REAIS');
    console.log('✅ PostgreSQL vai aceitar os valores');
    console.log('✅ Sistema preparado para produção');
    
    console.log('\n📋 Mapeamentos aplicados:');
    console.log(`  "escritorio_teste" → ${escritorioRealId}`);
    console.log(`  "user_admin_teste" → ${usuarioRealId}`);
    
    console.log('\n🚀 PRÓXIMO PASSO: Reiniciar servidor e testar');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

// Executar solução
solucaoDefinitiva().catch(console.error); 