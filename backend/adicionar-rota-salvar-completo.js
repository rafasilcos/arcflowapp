const fs = require('fs');

// Ler o arquivo server-simple.js
const serverPath = './server-simple.js';
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Rota a ser adicionada
const novaRota = `
// POST /api/briefings/salvar-completo - Salvar briefing completo do frontend
app.post('/api/briefings/salvar-completo', authenticateToken, async (req, res) => {
  try {
    console.log('🎯 [BRIEFING-SALVAR] Recebendo dados completos:', {
      body: req.body ? 'presente' : 'ausente',
      user: req.user ? req.user.email : 'não autenticado'
    });

    const { 
      nomeProjeto, 
      clienteId,
      briefingTemplate,
      respostas,
      metadados
    } = req.body;

    // Validações básicas
    if (!nomeProjeto || !briefingTemplate || !respostas) {
      console.log('❌ [BRIEFING-SALVAR] Dados obrigatórios faltando');
      return res.status(400).json({
        error: 'Dados obrigatórios faltando',
        message: 'nomeProjeto, briefingTemplate e respostas são obrigatórios'
      });
    }

    // 🚀 SOLUÇÃO DEFINITIVA: Mapear IDs para UUIDs REAIS
    const escritorioIdRaw = req.user.escritorioId;
    const userIdRaw = req.user.id;
    
    const uuidMappings = {
      'escritorio_teste': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      'user_admin_teste': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      '5026f3bc-d80d-4233-acf5-ea446add9b5f': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      '4a027cb6-7a7f-4573-b69f-6bba48655b3e': '4a027cb6-7a7f-4573-b69f-6bba48655b3e'
    };
    
    const escritorioId = uuidMappings[escritorioIdRaw] || escritorioIdRaw;
    const userId = uuidMappings[userIdRaw] || userIdRaw;

    console.log('🔍 [BRIEFING-SALVAR] Mapeamento UUID:', { 
      escritorio: { original: escritorioIdRaw, mapeado: escritorioId },
      usuario: { original: userIdRaw, mapeado: userId }
    });

    // Verificar se cliente existe (se fornecido)
    if (clienteId) {
      const clienteResult = await client.query(\`
        SELECT id FROM clientes 
        WHERE id = $1 AND escritorio_id = $2
      \`, [clienteId, escritorioId]);

      if (clienteResult.rows.length === 0) {
        console.log('❌ [BRIEFING-SALVAR] Cliente não encontrado:', clienteId);
        return res.status(400).json({
          error: 'Cliente não encontrado',
          message: 'O cliente especificado não existe ou não pertence ao seu escritório'
        });
      }
    }

    // Criar briefing completo
    const briefingId = uuidv4();
    const dataAtual = new Date();

    // Preparar dados para salvamento
    const observacoes = JSON.stringify({
      template: briefingTemplate,
      respostas: respostas,
      metadados: metadados || {},
      dataFinalizacao: dataAtual.toISOString()
    });

    console.log('💾 [BRIEFING-SALVAR] Salvando no banco:', {
      id: briefingId,
      nomeProjeto,
      categoria: briefingTemplate.categoria,
      totalPerguntas: briefingTemplate.totalPerguntas,
      totalRespostas: metadados?.totalRespostas || 0
    });

    const result = await client.query(\`
      INSERT INTO briefings (
        id, nome_projeto, descricao, cliente_id, responsavel_id, 
        escritorio_id, created_by, disciplina, area, tipologia,
        status, progresso, observacoes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *
    \`, [
      briefingId,
      nomeProjeto.trim(),
      \`Briefing \${briefingTemplate.categoria} - \${briefingTemplate.nome}\`,
      clienteId || null,
      userId, // responsável
      escritorioId,
      userId, // criado por
      briefingTemplate.categoria || 'Geral',
      briefingTemplate.area || '',
      briefingTemplate.tipologia || '',
      'CONCLUIDO',
      metadados?.progresso || 100,
      observacoes
    ]);

    const briefingSalvo = result.rows[0];

    console.log('✅ [BRIEFING-SALVAR] Briefing salvo com sucesso:', {
      id: briefingSalvo.id,
      nome: briefingSalvo.nome_projeto,
      status: briefingSalvo.status
    });

    // Resposta de sucesso
    res.status(201).json({
      success: true,
      message: 'Briefing salvo com sucesso!',
      data: {
        briefingId: briefingSalvo.id,
        nomeProjeto: briefingSalvo.nome_projeto,
        status: briefingSalvo.status,
        progresso: briefingSalvo.progresso,
        dashboardUrl: \`/projetos/\${briefingSalvo.id}/dashboard\`,
        createdAt: briefingSalvo.created_at
      }
    });

  } catch (error) {
    console.error('❌ [BRIEFING-SALVAR] Erro ao salvar:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Erro ao salvar briefing. Tente novamente.',
      details: error.message 
    });
  }
});

`;

// Procurar onde inserir (antes do app.listen)
const appListenIndex = serverContent.indexOf('// Start server');

if (appListenIndex === -1) {
  console.log('❌ Não encontrou o local para inserir a rota');
  process.exit(1);
}

// Verificar se a rota já existe
if (serverContent.includes('/api/briefings/salvar-completo')) {
  console.log('✅ Rota já existe no arquivo');
  process.exit(0);
}

// Inserir a nova rota
const novoConteudo = serverContent.slice(0, appListenIndex) + novaRota + '\n' + serverContent.slice(appListenIndex);

// Salvar o arquivo
fs.writeFileSync(serverPath, novoConteudo);

console.log('✅ Rota /api/briefings/salvar-completo adicionada com sucesso!');
console.log('🔄 Reinicie o servidor para aplicar as mudanças.'); 