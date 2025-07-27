import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { logger } from '../config/logger';

const router = Router();

// Configuração do banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware de autenticação
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de acesso é obrigatório',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// 🆕 GET /api/orcamentos/briefings-disponiveis - Listar briefings disponíveis para orçamento
router.get('/briefings-disponiveis', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const escritorioId = req.user?.escritorio_id;
    const userId = req.user?.id;

    if (!escritorioId || !userId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('Listando briefings disponíveis para orçamento:', { escritorioId, userId });

    // Buscar briefings CONCLUÍDOS que ainda não foram para orçamento
    const briefingsResult = await pool.query(`
      SELECT 
        b.id,
        b.nome_projeto,
        b.descricao,
        b.status,
        b.progresso,
        b.created_at,
        b.updated_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        u.id as responsavel_id,
        u.nome as responsavel_nome,
        CASE 
          WHEN o.briefing_id IS NOT NULL THEN true 
          ELSE false 
        END as tem_orcamento
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id = c.id
      LEFT JOIN users u ON b.responsavel_id = u.id
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE b.escritorio_id = $1 
        AND b.status IN ('CONCLUIDO', 'EM_EDICAO')
        AND b.deleted_at IS NULL
      ORDER BY b.created_at DESC
      LIMIT 50
    `, [escritorioId]);

    const briefings = briefingsResult.rows.map(row => ({
      id: row.id,
      nomeProjeto: row.nome_projeto,
      descricao: row.descricao,
      status: row.status,
      progresso: row.progresso,
      criadoEm: row.created_at,
      atualizadoEm: row.updated_at,
      cliente: {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email
      },
      responsavel: {
        id: row.responsavel_id,
        nome: row.responsavel_nome
      },
      temOrcamento: row.tem_orcamento
    }));

    logger.info(`Encontrados ${briefings.length} briefings disponíveis`);

    res.json({
      briefings,
      total: briefings.length,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao listar briefings disponíveis:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/orcamentos/gerar-briefing/:briefingId - Gerar orçamento a partir de briefing
router.post('/gerar-briefing/:briefingId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { briefingId } = req.params;
    const userId = req.user?.id;
    const escritorioId = req.user?.escritorio_id;

    if (!userId || !escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('Gerando orçamento para briefing:', { briefingId, userId, escritorioId });

    // 1. Buscar dados do briefing
    const briefingResult = await pool.query(`
      SELECT b.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id = c.id
      WHERE b.id = $1 AND b.escritorio_id = $2
    `, [briefingId, escritorioId]);

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado',
        code: 'BRIEFING_NOT_FOUND'
      });
    }

    const briefing = briefingResult.rows[0];

    // 2. Gerar código único do orçamento
    const now = new Date();
    const ano = now.getFullYear();
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const contador = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const codigo = `ORC-${ano}${mes}-${contador}`;

    // 3. Extrair dados do briefing e calcular valores
    const respostas = typeof briefing.respostas === 'string' ? JSON.parse(briefing.respostas) : briefing.respostas;
    
    // Cálculo básico de área
    let areaConstruida = 0;
    let areaTerreno = 0;
    
    if (respostas) {
      const areaStr = respostas.area || respostas.areaConstruida || respostas.areaTotal || '';
      if (areaStr) {
        const areaMatch = areaStr.toString().match(/(\d+)/);
        if (areaMatch) {
          areaConstruida = parseInt(areaMatch[1]);
        }
      }
      
      const terrenoStr = respostas.terreno || respostas.areaTerreno || '';
      if (terrenoStr) {
        const terrenoMatch = terrenoStr.toString().match(/(\d+)/);
        if (terrenoMatch) {
          areaTerreno = parseInt(terrenoMatch[1]);
        }
      }
    }

    // Se não encontrou área, usar valor padrão
    if (areaConstruida === 0) {
      areaConstruida = 150; // Área padrão
    }

    // 4. Calcular valores baseado em metodologia AEC
    const valorPorM2Base = 750; // R$ 750/m² base
    const valorTotal = areaConstruida * valorPorM2Base;
    
    // 5. Criar composição financeira
    const composicaoFinanceira = {
      disciplinas: [
        { nome: 'Arquitetura', valor: valorTotal * 0.4, porcentagem: 40 },
        { nome: 'Estrutural', valor: valorTotal * 0.2, porcentagem: 20 },
        { nome: 'Instalações', valor: valorTotal * 0.3, porcentagem: 30 },
        { nome: 'Coordenação', valor: valorTotal * 0.1, porcentagem: 10 }
      ],
      subtotal: valorTotal * 0.9,
      impostos: valorTotal * 0.08,
      total: valorTotal
    };

    // 6. Criar cronograma
    const cronograma = [
      { 
        etapa: 'Estudo Preliminar', 
        prazo: 15, 
        valor: valorTotal * 0.2,
        entregaveis: ['Plantas conceituais', 'Volumetria 3D', 'Memorial descritivo']
      },
      { 
        etapa: 'Anteprojeto', 
        prazo: 20, 
        valor: valorTotal * 0.3,
        entregaveis: ['Plantas detalhadas', 'Cortes e fachadas', 'Compatibilização']
      },
      { 
        etapa: 'Projeto Executivo', 
        prazo: 30, 
        valor: valorTotal * 0.4,
        entregaveis: ['Plantas executivas', 'Detalhamentos', 'Especificações']
      },
      { 
        etapa: 'Entrega Final', 
        prazo: 10, 
        valor: valorTotal * 0.1,
        entregaveis: ['Revisão final', 'Arquivos digitais', 'Documentação']
      }
    ];

    // 7. Criar proposta comercial
    const proposta = {
      formaPagamento: 'Parcelado conforme cronograma',
      prazoTotal: 75,
      garantia: '12 meses',
      validade: '30 dias',
      observacoes: 'Valores incluem todas as disciplinas e revisões necessárias.'
    };

    // 8. Inserir orçamento no banco
    const insertResult = await pool.query(`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, area_construida, area_terreno,
        valor_total, valor_por_m2, tipologia, padrao, complexidade,
        localizacao, disciplinas, composicao_financeira, cronograma,
        proposta, briefing_id, cliente_id, escritorio_id, responsavel_id,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW()
      ) RETURNING id
    `, [
      codigo,
      `Orçamento - ${briefing.nome_projeto}`,
      `Orçamento gerado automaticamente a partir do briefing "${briefing.nome_projeto}"`,
      'RASCUNHO',
      areaConstruida,
      areaTerreno,
      valorTotal,
      valorPorM2Base,
      briefing.tipologia || 'RESIDENCIAL',
      'MEDIO',
      'MEDIA',
      briefing.localizacao || 'São Paulo, SP',
      JSON.stringify(['Arquitetura', 'Estrutural', 'Instalações']),
      JSON.stringify(composicaoFinanceira),
      JSON.stringify(cronograma),
      JSON.stringify(proposta),
      briefingId,
      briefing.cliente_id,
      escritorioId,
      userId
    ]);

    const orcamentoId = insertResult.rows[0].id;

    // 🆕 9. Atualizar status do briefing para ORCAMENTO_ELABORACAO
    await pool.query(`
      UPDATE briefings 
      SET status = 'ORCAMENTO_ELABORACAO', 
          updated_at = NOW()
      WHERE id = $1 AND escritorio_id = $2
    `, [briefingId, escritorioId]);

    logger.info('Orçamento criado com sucesso:', { orcamentoId, codigo, valorTotal });

    // 10. Retornar dados do orçamento criado
    res.json({
      message: 'Orçamento gerado com sucesso',
      orcamento: {
        id: orcamentoId,
        codigo,
        nome: `Orçamento - ${briefing.nome_projeto}`,
        status: 'RASCUNHO',
        valorTotal,
        valorPorM2: valorPorM2Base,
        areaConstruida,
        cliente: {
          nome: briefing.cliente_nome,
          email: briefing.cliente_email,
          telefone: briefing.cliente_telefone
        },
        composicaoFinanceira,
        cronograma,
        proposta
      },
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao gerar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      message: error.message
    });
  }
});

// GET /api/orcamentos - Listar orçamentos
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const escritorioId = req.user?.escritorio_id;
    const { page = 1, limit = 10, status, search } = req.query;

    let query = `
      SELECT o.*, c.nome as cliente_nome, b.nome_projeto as briefing_nome,
             u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN users u ON o.responsavel_id = u.id
      WHERE o.escritorio_id = $1
    `;
    
    const params = [escritorioId];
    let paramIndex = 2;

    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status as string);
      paramIndex++;
    }

    if (search) {
      query += ` AND (o.nome ILIKE $${paramIndex} OR o.codigo ILIKE $${paramIndex} OR c.nome ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit as string, ((parseInt(page as string) - 1) * parseInt(limit as string)).toString());

    const result = await pool.query(query, params);

    res.json({
      orcamentos: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.rowCount || 0
      },
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao listar orçamentos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/orcamentos/:id - Buscar orçamento por ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user?.escritorio_id;

    const result = await pool.query(`
      SELECT o.*, c.nome as cliente_nome, c.email as cliente_email, 
             c.telefone as cliente_telefone, b.nome_projeto as briefing_nome,
             u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN users u ON o.responsavel_id = u.id
      WHERE o.id = $1 AND o.escritorio_id = $2
    `, [id, escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Orçamento não encontrado',
        code: 'ORCAMENTO_NOT_FOUND'
      });
    }

    const orcamento = result.rows[0];

    // Parse JSON fields
    orcamento.composicao_financeira = typeof orcamento.composicao_financeira === 'string' 
      ? JSON.parse(orcamento.composicao_financeira) 
      : orcamento.composicao_financeira;
    
    orcamento.cronograma = typeof orcamento.cronograma === 'string'
      ? JSON.parse(orcamento.cronograma)
      : orcamento.cronograma;
    
    orcamento.proposta = typeof orcamento.proposta === 'string'
      ? JSON.parse(orcamento.proposta)
      : orcamento.proposta;

    res.json({
      orcamento,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao buscar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// 🆕 PUT /api/orcamentos/:id/aprovar - Aprovar orçamento
router.put('/:id/aprovar', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user?.escritorio_id;

    // Buscar orçamento
    const orcamentoResult = await pool.query(`
      SELECT o.*, b.id as briefing_id
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      WHERE o.id = $1 AND o.escritorio_id = $2
    `, [id, escritorioId]);

    if (orcamentoResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Orçamento não encontrado',
        code: 'ORCAMENTO_NOT_FOUND'
      });
    }

    const orcamento = orcamentoResult.rows[0];

    // Atualizar status do orçamento
    await pool.query(`
      UPDATE orcamentos 
      SET status = 'APROVADO', 
          updated_at = NOW()
      WHERE id = $1 AND escritorio_id = $2
    `, [id, escritorioId]);

    // 🆕 Atualizar status do briefing para PROJETO_INICIADO
    if (orcamento.briefing_id) {
      await pool.query(`
        UPDATE briefings 
        SET status = 'PROJETO_INICIADO', 
            updated_at = NOW()
        WHERE id = $1 AND escritorio_id = $2
      `, [orcamento.briefing_id, escritorioId]);
    }

    logger.info('Orçamento aprovado com sucesso:', { orcamentoId: id, briefingId: orcamento.briefing_id });

    res.json({
      message: 'Orçamento aprovado com sucesso',
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao aprovar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router; 
import { Pool } from 'pg';
import { logger } from '../config/logger';

const router = Router();

// Configuração do banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware de autenticação
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de acesso é obrigatório',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    return res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// 🆕 GET /api/orcamentos/briefings-disponiveis - Listar briefings disponíveis para orçamento
router.get('/briefings-disponiveis', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const escritorioId = req.user?.escritorio_id;
    const userId = req.user?.id;

    if (!escritorioId || !userId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('Listando briefings disponíveis para orçamento:', { escritorioId, userId });

    // Buscar briefings CONCLUÍDOS que ainda não foram para orçamento
    const briefingsResult = await pool.query(`
      SELECT 
        b.id,
        b.nome_projeto,
        b.descricao,
        b.status,
        b.progresso,
        b.created_at,
        b.updated_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        u.id as responsavel_id,
        u.nome as responsavel_nome,
        CASE 
          WHEN o.briefing_id IS NOT NULL THEN true 
          ELSE false 
        END as tem_orcamento
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id = c.id
      LEFT JOIN users u ON b.responsavel_id = u.id
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE b.escritorio_id = $1 
        AND b.status IN ('CONCLUIDO', 'EM_EDICAO')
        AND b.deleted_at IS NULL
      ORDER BY b.created_at DESC
      LIMIT 50
    `, [escritorioId]);

    const briefings = briefingsResult.rows.map(row => ({
      id: row.id,
      nomeProjeto: row.nome_projeto,
      descricao: row.descricao,
      status: row.status,
      progresso: row.progresso,
      criadoEm: row.created_at,
      atualizadoEm: row.updated_at,
      cliente: {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email
      },
      responsavel: {
        id: row.responsavel_id,
        nome: row.responsavel_nome
      },
      temOrcamento: row.tem_orcamento
    }));

    logger.info(`Encontrados ${briefings.length} briefings disponíveis`);

    res.json({
      briefings,
      total: briefings.length,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao listar briefings disponíveis:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/orcamentos/gerar-briefing/:briefingId - Gerar orçamento a partir de briefing
router.post('/gerar-briefing/:briefingId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { briefingId } = req.params;
    const userId = req.user?.id;
    const escritorioId = req.user?.escritorio_id;

    if (!userId || !escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    logger.info('Gerando orçamento para briefing:', { briefingId, userId, escritorioId });

    // 1. Buscar dados do briefing
    const briefingResult = await pool.query(`
      SELECT b.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id = c.id
      WHERE b.id = $1 AND b.escritorio_id = $2
    `, [briefingId, escritorioId]);

    if (briefingResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Briefing não encontrado',
        code: 'BRIEFING_NOT_FOUND'
      });
    }

    const briefing = briefingResult.rows[0];

    // 2. Gerar código único do orçamento
    const now = new Date();
    const ano = now.getFullYear();
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const contador = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const codigo = `ORC-${ano}${mes}-${contador}`;

    // 3. Extrair dados do briefing e calcular valores
    const respostas = typeof briefing.respostas === 'string' ? JSON.parse(briefing.respostas) : briefing.respostas;
    
    // Cálculo básico de área
    let areaConstruida = 0;
    let areaTerreno = 0;
    
    if (respostas) {
      const areaStr = respostas.area || respostas.areaConstruida || respostas.areaTotal || '';
      if (areaStr) {
        const areaMatch = areaStr.toString().match(/(\d+)/);
        if (areaMatch) {
          areaConstruida = parseInt(areaMatch[1]);
        }
      }
      
      const terrenoStr = respostas.terreno || respostas.areaTerreno || '';
      if (terrenoStr) {
        const terrenoMatch = terrenoStr.toString().match(/(\d+)/);
        if (terrenoMatch) {
          areaTerreno = parseInt(terrenoMatch[1]);
        }
      }
    }

    // Se não encontrou área, usar valor padrão
    if (areaConstruida === 0) {
      areaConstruida = 150; // Área padrão
    }

    // 4. Calcular valores baseado em metodologia AEC
    const valorPorM2Base = 750; // R$ 750/m² base
    const valorTotal = areaConstruida * valorPorM2Base;
    
    // 5. Criar composição financeira
    const composicaoFinanceira = {
      disciplinas: [
        { nome: 'Arquitetura', valor: valorTotal * 0.4, porcentagem: 40 },
        { nome: 'Estrutural', valor: valorTotal * 0.2, porcentagem: 20 },
        { nome: 'Instalações', valor: valorTotal * 0.3, porcentagem: 30 },
        { nome: 'Coordenação', valor: valorTotal * 0.1, porcentagem: 10 }
      ],
      subtotal: valorTotal * 0.9,
      impostos: valorTotal * 0.08,
      total: valorTotal
    };

    // 6. Criar cronograma
    const cronograma = [
      { 
        etapa: 'Estudo Preliminar', 
        prazo: 15, 
        valor: valorTotal * 0.2,
        entregaveis: ['Plantas conceituais', 'Volumetria 3D', 'Memorial descritivo']
      },
      { 
        etapa: 'Anteprojeto', 
        prazo: 20, 
        valor: valorTotal * 0.3,
        entregaveis: ['Plantas detalhadas', 'Cortes e fachadas', 'Compatibilização']
      },
      { 
        etapa: 'Projeto Executivo', 
        prazo: 30, 
        valor: valorTotal * 0.4,
        entregaveis: ['Plantas executivas', 'Detalhamentos', 'Especificações']
      },
      { 
        etapa: 'Entrega Final', 
        prazo: 10, 
        valor: valorTotal * 0.1,
        entregaveis: ['Revisão final', 'Arquivos digitais', 'Documentação']
      }
    ];

    // 7. Criar proposta comercial
    const proposta = {
      formaPagamento: 'Parcelado conforme cronograma',
      prazoTotal: 75,
      garantia: '12 meses',
      validade: '30 dias',
      observacoes: 'Valores incluem todas as disciplinas e revisões necessárias.'
    };

    // 8. Inserir orçamento no banco
    const insertResult = await pool.query(`
      INSERT INTO orcamentos (
        codigo, nome, descricao, status, area_construida, area_terreno,
        valor_total, valor_por_m2, tipologia, padrao, complexidade,
        localizacao, disciplinas, composicao_financeira, cronograma,
        proposta, briefing_id, cliente_id, escritorio_id, responsavel_id,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW()
      ) RETURNING id
    `, [
      codigo,
      `Orçamento - ${briefing.nome_projeto}`,
      `Orçamento gerado automaticamente a partir do briefing "${briefing.nome_projeto}"`,
      'RASCUNHO',
      areaConstruida,
      areaTerreno,
      valorTotal,
      valorPorM2Base,
      briefing.tipologia || 'RESIDENCIAL',
      'MEDIO',
      'MEDIA',
      briefing.localizacao || 'São Paulo, SP',
      JSON.stringify(['Arquitetura', 'Estrutural', 'Instalações']),
      JSON.stringify(composicaoFinanceira),
      JSON.stringify(cronograma),
      JSON.stringify(proposta),
      briefingId,
      briefing.cliente_id,
      escritorioId,
      userId
    ]);

    const orcamentoId = insertResult.rows[0].id;

    // 🆕 9. Atualizar status do briefing para ORCAMENTO_ELABORACAO
    await pool.query(`
      UPDATE briefings 
      SET status = 'ORCAMENTO_ELABORACAO', 
          updated_at = NOW()
      WHERE id = $1 AND escritorio_id = $2
    `, [briefingId, escritorioId]);

    logger.info('Orçamento criado com sucesso:', { orcamentoId, codigo, valorTotal });

    // 10. Retornar dados do orçamento criado
    res.json({
      message: 'Orçamento gerado com sucesso',
      orcamento: {
        id: orcamentoId,
        codigo,
        nome: `Orçamento - ${briefing.nome_projeto}`,
        status: 'RASCUNHO',
        valorTotal,
        valorPorM2: valorPorM2Base,
        areaConstruida,
        cliente: {
          nome: briefing.cliente_nome,
          email: briefing.cliente_email,
          telefone: briefing.cliente_telefone
        },
        composicaoFinanceira,
        cronograma,
        proposta
      },
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao gerar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      message: error.message
    });
  }
});

// GET /api/orcamentos - Listar orçamentos
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const escritorioId = req.user?.escritorio_id;
    const { page = 1, limit = 10, status, search } = req.query;

    let query = `
      SELECT o.*, c.nome as cliente_nome, b.nome_projeto as briefing_nome,
             u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN users u ON o.responsavel_id = u.id
      WHERE o.escritorio_id = $1
    `;
    
    const params = [escritorioId];
    let paramIndex = 2;

    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status as string);
      paramIndex++;
    }

    if (search) {
      query += ` AND (o.nome ILIKE $${paramIndex} OR o.codigo ILIKE $${paramIndex} OR c.nome ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit as string, ((parseInt(page as string) - 1) * parseInt(limit as string)).toString());

    const result = await pool.query(query, params);

    res.json({
      orcamentos: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.rowCount || 0
      },
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao listar orçamentos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/orcamentos/:id - Buscar orçamento por ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user?.escritorio_id;

    const result = await pool.query(`
      SELECT o.*, c.nome as cliente_nome, c.email as cliente_email, 
             c.telefone as cliente_telefone, b.nome_projeto as briefing_nome,
             u.nome as responsavel_nome
      FROM orcamentos o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      LEFT JOIN briefings b ON o.briefing_id = b.id
      LEFT JOIN users u ON o.responsavel_id = u.id
      WHERE o.id = $1 AND o.escritorio_id = $2
    `, [id, escritorioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Orçamento não encontrado',
        code: 'ORCAMENTO_NOT_FOUND'
      });
    }

    const orcamento = result.rows[0];

    // Parse JSON fields
    orcamento.composicao_financeira = typeof orcamento.composicao_financeira === 'string' 
      ? JSON.parse(orcamento.composicao_financeira) 
      : orcamento.composicao_financeira;
    
    orcamento.cronograma = typeof orcamento.cronograma === 'string'
      ? JSON.parse(orcamento.cronograma)
      : orcamento.cronograma;
    
    orcamento.proposta = typeof orcamento.proposta === 'string'
      ? JSON.parse(orcamento.proposta)
      : orcamento.proposta;

    res.json({
      orcamento,
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao buscar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// 🆕 PUT /api/orcamentos/:id/aprovar - Aprovar orçamento
router.put('/:id/aprovar', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const escritorioId = req.user?.escritorio_id;

    // Buscar orçamento
    const orcamentoResult = await pool.query(`
      SELECT o.*, b.id as briefing_id
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      WHERE o.id = $1 AND o.escritorio_id = $2
    `, [id, escritorioId]);

    if (orcamentoResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Orçamento não encontrado',
        code: 'ORCAMENTO_NOT_FOUND'
      });
    }

    const orcamento = orcamentoResult.rows[0];

    // Atualizar status do orçamento
    await pool.query(`
      UPDATE orcamentos 
      SET status = 'APROVADO', 
          updated_at = NOW()
      WHERE id = $1 AND escritorio_id = $2
    `, [id, escritorioId]);

    // 🆕 Atualizar status do briefing para PROJETO_INICIADO
    if (orcamento.briefing_id) {
      await pool.query(`
        UPDATE briefings 
        SET status = 'PROJETO_INICIADO', 
            updated_at = NOW()
        WHERE id = $1 AND escritorio_id = $2
      `, [orcamento.briefing_id, escritorioId]);
    }

    logger.info('Orçamento aprovado com sucesso:', { orcamentoId: id, briefingId: orcamento.briefing_id });

    res.json({
      message: 'Orçamento aprovado com sucesso',
      success: true
    });

  } catch (error: any) {
    logger.error('Erro ao aprovar orçamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router; 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 