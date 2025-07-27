// Adicionar estas rotas ao server-simple.js antes da linha "// Start server"

// GET /api/users/:id - Buscar usuário por ID
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioIdRaw = req.user.escritorioId;
    
    const uuidMappings = {
      'escritorio_teste': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      'user_admin_teste': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      '5026f3bc-d80d-4233-acf5-ea446add9b5f': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      '4a027cb6-7a7f-4573-b69f-6bba48655b3e': '4a027cb6-7a7f-4573-b69f-6bba48655b3e'
    };
    
    const escritorioId = uuidMappings[escritorioIdRaw] || escritorioIdRaw;
    
    console.log('🔍 [USER-GET] Buscando usuário:', { id, escritorioId });

    const result = await client.query(`
      SELECT id, nome, email, papel, created_at FROM users 
      WHERE id = $1 AND escritorio_id = $2
    `, [id, escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    console.log('✅ [USER-GET] Usuário encontrado:', result.rows[0].nome);

    res.json({
      message: 'Usuário encontrado',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar usuário',
      message: error.message 
    });
  }
});

// GET /api/clientes/:id - Buscar cliente por ID específico
app.get('/api/clientes/:id/detalhes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const escritorioIdRaw = req.user.escritorioId;
    
    const uuidMappings = {
      'escritorio_teste': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      'user_admin_teste': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      '5026f3bc-d80d-4233-acf5-ea446add9b5f': '5026f3bc-d80d-4233-acf5-ea446add9b5f',
      '4a027cb6-7a7f-4573-b69f-6bba48655b3e': '4a027cb6-7a7f-4573-b69f-6bba48655b3e'
    };
    
    const escritorioId = uuidMappings[escritorioIdRaw] || escritorioIdRaw;
    
    console.log('🔍 [CLIENTE-GET-DETALHES] Buscando cliente:', { id, escritorioId });

    const result = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND escritorio_id = $2
    `, [id, escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Cliente não encontrado'
      });
    }

    console.log('✅ [CLIENTE-GET-DETALHES] Cliente encontrado:', result.rows[0].nome);

    res.json({
      message: 'Cliente encontrado',
      cliente: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar cliente',
      message: error.message 
    });
  }
}); 