import { Router, Request, Response } from 'express';
import { Client } from 'pg';
import { logger } from '../config/logger';
import express from 'express';
import rateLimit from 'express-rate-limit';
import auditoriaService from '../utils/auditoria';

const router = Router();

// Rate limiting para clientes - AJUSTADO PARA SER MENOS AGRESSIVO
const clientesRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // AUMENTADO: máximo 500 requests por IP por janela (era 100)
  message: {
    error: 'Muitas tentativas',
    message: 'Você fez muitas requisições. Tente novamente em 15 minutos.',
    retryAfter: 15 * 60 // 15 minutos em segundos
  },
  standardHeaders: true,
  legacyHeaders: false,
  // SKIP GET requests para leitura de dados
  skip: (req) => {
    // Permitir GET requests sem rate limit para leitura normal
    return req.method === 'GET'
  },
  handler: (req, res) => {
    logger.warn('Rate limit excedido', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method
    });
    
    res.status(429).json({
      error: 'Muitas tentativas',
      message: 'Você fez muitas requisições. Tente novamente em 15 minutos.',
      retryAfter: 15 * 60
    });
  }
});

// Rate limiting mais restritivo para criação de clientes
const createClienteRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 criações por IP por janela
  message: {
    error: 'Muitas criações de cliente',
    message: 'Você criou muitos clientes recentemente. Aguarde 5 minutos.',
    retryAfter: 5 * 60
  },
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn('Rate limit de criação excedido', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      body: req.body?.nome || 'Nome não informado'
    });
    
    res.status(429).json({
      error: 'Muitas criações de cliente',
      message: 'Você criou muitos clientes recentemente. Aguarde 5 minutos.',
      retryAfter: 5 * 60
    });
  }
});

// Aplicar rate limiting em todas as rotas
// router.use(clientesRateLimit); // TEMPORARIAMENTE DESABILITADO

// Configuração do banco
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

// GET /api/clientes/lixeira - Listar clientes removidos (soft deleted)
router.get('/lixeira', async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const { page = 1, limit = 25 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    console.log(`🗑️ [DEBUG] Carregando lixeira - Página: ${page}, Limite: ${limit}`);
    
    // Buscar clientes removidos
    const result = await client.query(`
      SELECT 
        id, nome, email, telefone, cpf, cnpj,
        deleted_at, status
      FROM clientes 
      WHERE is_active = false AND deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
      LIMIT $1 OFFSET $2
    `, [Number(limit), offset]);
    
    console.log(`✅ [DEBUG] Encontrados ${result.rows.length} clientes removidos`);
    
    // Contar total
    const countResult = await client.query(`
      SELECT COUNT(*) as total 
      FROM clientes 
      WHERE is_active = false AND deleted_at IS NOT NULL
    `);
    
    const total = parseInt(countResult.rows[0]?.total || '0');
    const totalPages = Math.ceil(total / Number(limit));
    
    res.json({
      clientes: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar lixeira:', error);
    logger.error('Erro ao buscar lixeira:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await client.end();
  }
});

// GET /api/clientes - Listar clientes com paginação
router.get('/', async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const { page = 1, limit = 25, search, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    console.log(`📄 [DEBUG] Carregando clientes - Página: ${page}, Limite: ${limit}, Offset: ${offset}`);
    
    let query = `
      SELECT * FROM clientes 
      WHERE deleted_at IS NULL
    `;
    
    const params: any[] = [];
    let paramCount = 0;
    
    if (search) {
      paramCount++;
      query += ` AND (nome ILIKE $${paramCount} OR email ILIKE $${paramCount} OR telefone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    if (status && status !== 'todos') {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);
    
    const result = await client.query(query, params);
    
    console.log(`✅ [DEBUG] Encontrados ${result.rows.length} clientes`);
    
    // Contar total
    let countQuery = `SELECT COUNT(*) FROM clientes WHERE deleted_at IS NULL`;
    const countParams: any[] = [];
    let countParamCount = 0;
    
    if (search) {
      countParamCount++;
      countQuery += ` AND (nome ILIKE $${countParamCount} OR email ILIKE $${countParamCount} OR telefone ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }
    
    if (status && status !== 'todos') {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }
    
    const countResult = await client.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    const totalPaginas = Math.ceil(total / Number(limit));
    
    // Processar dados dos clientes
    const clientes = result.rows.map(row => ({
      id: row.id,
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
      tipoPessoa: row.tipo_pessoa,
      cpf: row.cpf,
      cnpj: row.cnpj,
      endereco: {
        cep: row.endereco_cep || '',
        logradouro: row.endereco_logradouro || '',
        numero: row.endereco_numero || '',
        complemento: row.endereco_complemento || '',
        bairro: row.endereco_bairro || '',
        cidade: row.endereco_cidade || '',
        uf: row.endereco_uf || '',
        pais: row.endereco_pais || 'Brasil'
      },
      endereco_cep: row.endereco_cep,
      endereco_logradouro: row.endereco_logradouro,
      endereco_numero: row.endereco_numero,
      endereco_complemento: row.endereco_complemento,
      endereco_bairro: row.endereco_bairro,
      endereco_cidade: row.endereco_cidade,
      endereco_uf: row.endereco_uf,
      endereco_pais: row.endereco_pais,
      profissao: row.profissao,
      dataNascimento: row.data_nascimento ? new Date(row.data_nascimento).toLocaleDateString('pt-BR') : null,
      dataFundacao: row.data_fundacao ? new Date(row.data_fundacao).toLocaleDateString('pt-BR') : null,
      familia: row.familia,
      origem: row.origem,
      preferencias: row.preferencias,
      historicoProjetos: row.historico_projetos,
      observacoes: row.observacoes,
      status: row.status,
      isActive: row.is_active,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      deletedBy: row.deleted_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    }));
    
    res.json({
      clientes,
      paginacao: {
        paginaAtual: Number(page),
        itemsPorPagina: Number(limit),
        totalItens: total,
        totalPaginas,
        temProxima: Number(page) < totalPaginas,
        temAnterior: Number(page) > 1
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar clientes:', error);
    logger.error('Erro ao buscar clientes:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await client.end();
  }
});

// GET /api/clientes/:id - Buscar cliente por ID
router.get('/:id', async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const { id } = req.params;
    
    const result = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND deleted_at IS NULL
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    const row = result.rows[0];
    const cliente = {
      id: row.id,
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
      tipoPessoa: row.tipo_pessoa,
      cpf: row.cpf,
      cnpj: row.cnpj,
      endereco: {
        cep: row.endereco_cep || '',
        logradouro: row.endereco_logradouro || '',
        numero: row.endereco_numero || '',
        complemento: row.endereco_complemento || '',
        bairro: row.endereco_bairro || '',
        cidade: row.endereco_cidade || '',
        uf: row.endereco_uf || '',
        pais: row.endereco_pais || 'Brasil'
      },
      endereco_cep: row.endereco_cep,
      endereco_logradouro: row.endereco_logradouro,
      endereco_numero: row.endereco_numero,
      endereco_complemento: row.endereco_complemento,
      endereco_bairro: row.endereco_bairro,
      endereco_cidade: row.endereco_cidade,
      endereco_uf: row.endereco_uf,
      endereco_pais: row.endereco_pais,
      profissao: row.profissao,
      dataNascimento: row.data_nascimento ? new Date(row.data_nascimento).toLocaleDateString('pt-BR') : null,
      dataFundacao: row.data_fundacao ? new Date(row.data_fundacao).toLocaleDateString('pt-BR') : null,
      familia: row.familia,
      origem: row.origem,
      preferencias: row.preferencias,
      historicoProjetos: row.historico_projetos,
      observacoes: row.observacoes,
      status: row.status,
      isActive: row.is_active,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      deletedBy: row.deleted_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
    
    res.json({ cliente });
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar cliente:', error);
    logger.error('Erro ao buscar cliente:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await client.end();
  }
});

// POST /api/clientes - Criar novo cliente
router.post('/', createClienteRateLimit, async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const {
      nome, email, telefone, tipoPessoa, cpf, cnpj,
      endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_pais,
      profissao, dataNascimento, dataFundacao,
      familia, origem, preferencias, historicoProjetos,
      observacoes, status
    } = req.body;
    
    // Validações básicas
    if (!nome || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }
    
    // Verificar email único
    const emailCheck = await client.query(`
      SELECT id FROM clientes 
      WHERE email = $1 AND deleted_at IS NULL
    `, [email]);
    
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    
    // Função para converter data brasileira (DD/MM/YYYY) para SQL (YYYY-MM-DD)
    const converterDataBrasileiraParaSQL = (dataBrasileira?: string) => {
      if (!dataBrasileira) return null;
      
      console.log(`🔄 [DEBUG] Convertendo data: "${dataBrasileira}"`);
      
      // Se já está no formato SQL (YYYY-MM-DD), retorna como está
      if (/^\d{4}-\d{2}-\d{2}$/.test(dataBrasileira)) {
        console.log(`✅ [DEBUG] Data já no formato SQL: ${dataBrasileira}`);
        return dataBrasileira;
      }
      
      // Se está no formato brasileiro (DD/MM/YYYY), converte
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataBrasileira)) {
        const partes = dataBrasileira.split('/');
        if (partes.length !== 3) return null;
        
        const dia = partes[0];
        const mes = partes[1]; 
        const ano = partes[2];
        
        if (!dia || !mes || !ano) return null;
        
        // Validar se a data é válida
        const diaNum = parseInt(dia);
        const mesNum = parseInt(mes);
        const anoNum = parseInt(ano);
        
        if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 1900 || anoNum > 2100) {
          console.log(`❌ [DEBUG] Data inválida: ${dataBrasileira}`);
          return null;
        }
        
        const dataSQL = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        console.log(`✅ [DEBUG] Data convertida: ${dataBrasileira} → ${dataSQL}`);
        return dataSQL;
      }
      
      console.log(`❌ [DEBUG] Formato de data não reconhecido: ${dataBrasileira}`);
      return null;
    };
    
    const dataNascimentoSQL = converterDataBrasileiraParaSQL(dataNascimento);
    const dataFundacaoSQL = converterDataBrasileiraParaSQL(dataFundacao);
    
    const clienteId = 'cliente_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const result = await client.query(`
      INSERT INTO clientes (
        id, nome, email, telefone, tipo_pessoa, cpf, cnpj, 
        endereco_cep, endereco_logradouro, endereco_numero, 
        endereco_complemento, endereco_bairro, endereco_cidade, 
        endereco_uf, endereco_pais, observacoes, status, escritorio_id, 
        profissao, data_nascimento, data_fundacao, familia, origem, 
        preferencias, historico_projetos, created_by, created_at, updated_at, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW(), true)
      RETURNING *;
    `, [
      clienteId,
      nome.trim(),
      email.trim().toLowerCase(),
      telefone?.trim(),
      tipoPessoa,
      cpf?.trim(),
      cnpj?.trim(),
      endereco_cep || null,
      endereco_logradouro || null,
      endereco_numero || null,
      endereco_complemento || null,
      endereco_bairro || null,
      endereco_cidade || null,
      endereco_uf || null,
      endereco_pais || 'Brasil',
      observacoes?.trim(),
      status || 'ativo',
      'escritorio_teste', // Por enquanto usando escritório fixo
      profissao?.trim() || null,
      dataNascimentoSQL || null,
      dataFundacaoSQL || null,
      familia ? JSON.stringify(familia) : null,
      origem ? JSON.stringify(origem) : null,
      preferencias ? JSON.stringify(preferencias) : null,
      historicoProjetos ? JSON.stringify(historicoProjetos) : null,
      'user_system' // Por enquanto usando usuário fixo
    ]);
    
    logger.info('Cliente criado:', { clienteId, nome, email });
    
    // AUDITORIA: Registrar criação
    await auditoriaService.registrarCriacaoCliente(
      clienteId,
      result.rows[0],
      'user_system', // TODO: Usar usuário real da sessão
      req
    );
    
    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao criar cliente:', error);
    logger.error('Erro ao criar cliente:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  } finally {
    await client.end();
  }
});

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Buscar dados antigos para auditoria
    const dadosAntigos = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND is_active = true
    `, [id]);
    
    if (dadosAntigos.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    const clienteAntigo = dadosAntigos.rows[0];
    
    // Verificar email único (se alterado)
    if (updateData.email) {
      const emailCheck = await client.query(`
        SELECT id FROM clientes 
        WHERE email = $1 AND id != $2 AND deleted_at IS NULL
      `, [updateData.email, id]);
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ 
          message: 'Email já cadastrado por outro cliente' 
        });
      }
    }
    
    // Função para converter data brasileira para SQL
    const converterDataBrasileiraParaSQL = (dataBrasileira?: string) => {
      if (!dataBrasileira) return null;
      
      // Se já está no formato SQL (YYYY-MM-DD), retorna como está
      if (/^\d{4}-\d{2}-\d{2}$/.test(dataBrasileira)) {
        return dataBrasileira;
      }
      
      // Se está no formato brasileiro (DD/MM/YYYY), converte
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataBrasileira)) {
        const partes = dataBrasileira.split('/');
        if (partes.length !== 3) return null;
        
        const dia = partes[0];
        const mes = partes[1]; 
        const ano = partes[2];
        
        if (!dia || !mes || !ano) return null;
        
        // Validar se a data é válida
        const diaNum = parseInt(dia);
        const mesNum = parseInt(mes);
        const anoNum = parseInt(ano);
        
        if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 1900 || anoNum > 2100) {
          return null;
        }
        
        const dataSQL = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        return dataSQL;
      }
      
      return null;
    };
    
    const dataNascimentoSQL = updateData.dataNascimento ? converterDataBrasileiraParaSQL(updateData.dataNascimento) : null;
    const dataFundacaoSQL = updateData.dataFundacao ? converterDataBrasileiraParaSQL(updateData.dataFundacao) : null;
    
    const result = await client.query(`
      UPDATE clientes 
      SET 
        nome = COALESCE($1, nome),
        email = COALESCE($2, email),
        telefone = COALESCE($3, telefone),
        tipo_pessoa = COALESCE($4, tipo_pessoa),
        cpf = COALESCE($5, cpf),
        cnpj = COALESCE($6, cnpj),
        endereco_cep = COALESCE($7, endereco_cep),
        endereco_logradouro = COALESCE($8, endereco_logradouro),
        endereco_numero = COALESCE($9, endereco_numero),
        endereco_complemento = COALESCE($10, endereco_complemento),
        endereco_bairro = COALESCE($11, endereco_bairro),
        endereco_cidade = COALESCE($12, endereco_cidade),
        endereco_uf = COALESCE($13, endereco_uf),
        endereco_pais = COALESCE($14, endereco_pais),
        observacoes = COALESCE($15, observacoes),
        status = COALESCE($16, status),
        profissao = COALESCE($17, profissao),
        data_nascimento = COALESCE($18, data_nascimento),
        data_fundacao = COALESCE($19, data_fundacao),
        familia = COALESCE($20, familia),
        origem = COALESCE($21, origem),
        preferencias = COALESCE($22, preferencias),
        historico_projetos = COALESCE($23, historico_projetos),
        updated_by = $24,
        updated_at = NOW()
      WHERE id = $25
      RETURNING *;
    `, [
      updateData.nome?.trim(),
      updateData.email?.trim().toLowerCase(),
      updateData.telefone?.trim(),
      updateData.tipoPessoa,
      updateData.cpf?.trim(),
      updateData.cnpj?.trim(),
      updateData.endereco_cep,
      updateData.endereco_logradouro,
      updateData.endereco_numero,
      updateData.endereco_complemento,
      updateData.endereco_bairro,
      updateData.endereco_cidade,
      updateData.endereco_uf,
      updateData.endereco_pais,
      updateData.observacoes?.trim(),
      updateData.status,
      updateData.profissao?.trim(),
      dataNascimentoSQL,
      dataFundacaoSQL,
      updateData.familia ? JSON.stringify(updateData.familia) : null,
      updateData.origem ? JSON.stringify(updateData.origem) : null,
      updateData.preferencias ? JSON.stringify(updateData.preferencias) : null,
      updateData.historicoProjetos ? JSON.stringify(updateData.historicoProjetos) : null,
      'user_system', // TODO: Usar usuário real da sessão
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    logger.info('Cliente atualizado:', { id, nome: updateData.nome });
    
    // AUDITORIA: Registrar atualização
    await auditoriaService.registrarAtualizacaoCliente(
      id,
      clienteAntigo,
      result.rows[0],
      'user_system', // TODO: Usar usuário real da sessão
      req
    );
    
    res.json({
      message: 'Cliente atualizado com sucesso',
      cliente: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao atualizar cliente:', error);
    logger.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  } finally {
    await client.end();
  }
});

// DELETE /api/clientes/:id - Soft delete do cliente
router.delete('/:id', async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const { id } = req.params;
    
    // Buscar dados do cliente para auditoria
    const dadosAntigos = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND is_active = true
    `, [id]);
    
    if (dadosAntigos.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    const clienteAntigo = dadosAntigos.rows[0];
    
    // Soft delete
    const result = await client.query(`
      UPDATE clientes 
      SET 
        is_active = false,
        deleted_at = NOW(),
        deleted_by = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `, ['user_system', id]); // TODO: Usar usuário real da sessão
    
    logger.info('Cliente removido (soft delete):', { id, nome: clienteAntigo.nome });
    
    // AUDITORIA: Registrar remoção
    await auditoriaService.registrarRemocaoCliente(
      id,
      clienteAntigo,
      'user_system', // TODO: Usar usuário real da sessão
      req
    );
    
    res.json({
      message: 'Cliente removido com sucesso',
      cliente: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao remover cliente:', error);
    logger.error('Erro ao remover cliente:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  } finally {
    await client.end();
  }
});

// POST /api/clientes/:id/restaurar - Restaurar cliente da lixeira
router.post('/:id/restaurar', async (req: Request, res: Response) => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    
    const { id } = req.params;
    
    // Verificar se cliente existe na lixeira
    const clienteCheck = await client.query(`
      SELECT * FROM clientes 
      WHERE id = $1 AND is_active = false AND deleted_at IS NOT NULL
    `, [id]);
    
    if (clienteCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado na lixeira' });
    }
    
    // Restaurar cliente
    const result = await client.query(`
      UPDATE clientes 
      SET 
        is_active = true,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_by = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `, ['user_system', id]); // TODO: Usar usuário real da sessão
    
    logger.info('Cliente restaurado:', { id, nome: result.rows[0].nome });
    
    res.json({
      message: 'Cliente restaurado com sucesso',
      cliente: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao restaurar cliente:', error);
    logger.error('Erro ao restaurar cliente:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  } finally {
    await client.end();
  }
});

export default router; 