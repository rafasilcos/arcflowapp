import express from 'express'
import { verificarPlanoEnterprise, verificarLimiteEnterprise, aplicarWhiteLabelEnterprise } from '../middleware/enterprise'
import authenticateToken from '../middleware/auth'
import { prisma } from '../config/database-simple'
import { logger } from '../config/logger'

const router = express.Router()

// Aplicar autenticação em todas as rotas
router.use(authenticateToken)

// ===== ROTAS DE CONFIGURAÇÃO ENTERPRISE =====

// GET /api/enterprise/config - Buscar configurações enterprise
router.get('/config', 
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  aplicarWhiteLabelEnterprise,
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      
      res.json({
        success: true,
        data: {
          plano: tenant.plano,
          status: tenant.status,
          configuracoes: {
            whiteLabel: tenant.whiteLabel,
            limites: tenant.limites,
            recursos: {
              api: tenant.plano === 'ENTERPRISE',
              integracao: ['PROFESSIONAL', 'ENTERPRISE'].includes(tenant.plano),
              relatoriosAvancados: tenant.plano === 'ENTERPRISE',
              suporteDedicado: tenant.plano === 'ENTERPRISE',
              backup: ['PROFESSIONAL', 'ENTERPRISE'].includes(tenant.plano)
            }
          },
          estatisticas: {
            usuarios: await contarUsuarios(tenant.id),
            projetos: await contarProjetos(tenant.id),
            storage: await calcularStorage(tenant.id)
          }
        }
      })
    } catch (error: any) {
      logger.error('Erro ao buscar configurações enterprise:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// PUT /api/enterprise/white-label - Atualizar configurações de white label
router.put('/white-label',
  verificarPlanoEnterprise(['ENTERPRISE']),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { logo, cores, dominio, marca } = req.body

      // Validar dados
      if (!logo || !cores || !marca) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios: logo, cores, marca'
        })
      }

      // Atualizar no banco
      await prisma.$executeRaw`
        UPDATE escritorios 
        SET 
          logo_url = ${logo.principal},
          favicon_url = ${logo.favicon},
          cores = ${JSON.stringify(cores)},
          dominio_customizado = ${dominio?.customizado || ''},
          ssl_customizado = ${dominio?.ssl || false},
          nome_exibicao = ${marca.nomeExibicao},
          slogan = ${marca.slogan || ''},
          copyright = ${marca.copyright || ''},
          updated_at = NOW()
        WHERE id = ${tenant.id}
      `

      res.json({
        success: true,
        message: 'Configurações de white label atualizadas com sucesso',
        data: {
          logo,
          cores,
          dominio,
          marca
        }
      })
    } catch (error: any) {
      logger.error('Erro ao atualizar white label:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// ===== ROTAS DE API KEYS =====

// GET /api/enterprise/api-keys - Listar API keys
router.get('/api-keys',
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant

      const apiKeys = await prisma.$queryRaw`
        SELECT 
          id,
          nome,
          chave,
          permissoes,
          ativa,
          ultima_chamada,
          total_chamadas,
          created_at,
          expires_at
        FROM api_keys 
        WHERE escritorio_id = ${tenant.id}
        ORDER BY created_at DESC
      ` as any[]

      // Mascarar chaves por segurança
      const apiKeysSafe = apiKeys.map(key => ({
        ...key,
        chave: key.chave.substring(0, 8) + '...' + key.chave.substring(key.chave.length - 4),
        permissoes: JSON.parse(key.permissoes || '{}')
      }))

      res.json({
        success: true,
        data: apiKeysSafe
      })
    } catch (error: any) {
      logger.error('Erro ao listar API keys:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// POST /api/enterprise/api-keys - Criar nova API key
router.post('/api-keys',
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  verificarLimiteEnterprise('api', 'create'),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { nome, permissoes, expiresIn } = req.body

      if (!nome) {
        return res.status(400).json({
          success: false,
          error: 'Nome da API key é obrigatório'
        })
      }

      // Gerar chave única
      const chave = generateApiKey()
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000) : null

      // Criar no banco
      await prisma.$executeRaw`
        INSERT INTO api_keys (
          id, escritorio_id, nome, chave, permissoes, ativa, 
          created_at, created_by, expires_at
        ) VALUES (
          ${generateId()}, ${tenant.id}, ${nome}, ${chave}, 
          ${JSON.stringify(permissoes || {})}, true,
          NOW(), ${req.user?.id}, ${expiresAt}
        )
      `

      res.json({
        success: true,
        message: 'API key criada com sucesso',
        data: {
          nome,
          chave, // Mostrar chave completa apenas na criação
          permissoes,
          expiresAt,
          warning: 'Esta é a única vez que a chave completa será exibida. Guarde-a em local seguro.'
        }
      })
    } catch (error: any) {
      logger.error('Erro ao criar API key:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// DELETE /api/enterprise/api-keys/:id - Deletar API key
router.delete('/api-keys/:id',
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { id } = req.params

      // Verificar se a API key pertence ao tenant
      const apiKey = await prisma.$queryRaw`
        SELECT id FROM api_keys 
        WHERE id = ${id} AND escritorio_id = ${tenant.id}
      ` as any[]

      if (apiKey.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'API key não encontrada'
        })
      }

      // Deletar
      await prisma.$executeRaw`
        DELETE FROM api_keys WHERE id = ${id}
      `

      res.json({
        success: true,
        message: 'API key deletada com sucesso'
      })
    } catch (error: any) {
      logger.error('Erro ao deletar API key:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// ===== ROTAS DE RELATÓRIOS ENTERPRISE =====

// GET /api/enterprise/reports/usage - Relatório de uso
router.get('/reports/usage',
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { periodo = '30d' } = req.query

      // Calcular período
      const diasAtras = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
      const dataInicio = new Date()
      dataInicio.setDate(dataInicio.getDate() - diasAtras)

      // Buscar dados de uso
      const relatorio = {
        periodo: `${diasAtras} dias`,
        limites: tenant.limites,
        uso: {
          usuarios: {
            total: await contarUsuarios(tenant.id),
            limite: tenant.limites.usuarios.maximo,
            percentual: Math.round((await contarUsuarios(tenant.id) / tenant.limites.usuarios.maximo) * 100)
          },
          projetos: {
            total: await contarProjetos(tenant.id),
            limite: tenant.limites.projetos.maximo,
            percentual: tenant.limites.projetos.maximo > 0 ? 
              Math.round((await contarProjetos(tenant.id) / tenant.limites.projetos.maximo) * 100) : 0
          },
          storage: {
            total: await calcularStorage(tenant.id),
            limite: tenant.limites.armazenamento.maximo * 1024 * 1024 * 1024,
            percentual: Math.round((await calcularStorage(tenant.id) / (tenant.limites.armazenamento.maximo * 1024 * 1024 * 1024)) * 100)
          },
          api: {
            chamadas: await contarChamadasApi(tenant.id, dataInicio),
            limite: tenant.limites.api.chamadas,
            percentual: Math.round((await contarChamadasApi(tenant.id, dataInicio) / tenant.limites.api.chamadas) * 100)
          }
        },
                 alertas: [] as any[]
      }

      // Adicionar alertas se próximo do limite
      if (relatorio.uso.usuarios.percentual > 80) {
        relatorio.alertas.push({
          tipo: 'warning',
          recurso: 'usuarios',
          mensagem: `Você está usando ${relatorio.uso.usuarios.percentual}% do limite de usuários`
        })
      }

      if (relatorio.uso.projetos.percentual > 80) {
        relatorio.alertas.push({
          tipo: 'warning',
          recurso: 'projetos',
          mensagem: `Você está usando ${relatorio.uso.projetos.percentual}% do limite de projetos`
        })
      }

      res.json({
        success: true,
        data: relatorio
      })
    } catch (error: any) {
      logger.error('Erro ao gerar relatório de uso:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// GET /api/enterprise/reports/performance - Relatório de performance
router.get('/reports/performance',
  verificarPlanoEnterprise(['ENTERPRISE']),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { periodo = '30d' } = req.query

      // Dados de performance simulados (implementar com métricas reais)
      const performance = {
        periodo,
        metricas: {
          uptime: 99.97,
          tempoResposta: {
            media: 145, // ms
            p95: 320,
            p99: 850
          },
          disponibilidade: {
            total: 99.97,
            sla: 99.9,
            status: 'OK'
          },
          throughput: {
            requestsPorMinuto: 1250,
            pico: 3400,
            media: 980
          }
        },
        incidentes: [
          {
            data: '2024-01-15',
            tipo: 'Lentidão',
            duracao: '5 min',
            impacto: 'Baixo',
            resolucao: 'Reinicialização automática'
          }
        ],
        sla: {
          garantido: 99.9,
          atual: 99.97,
          creditos: 0
        }
      }

      res.json({
        success: true,
        data: performance
      })
    } catch (error: any) {
      logger.error('Erro ao gerar relatório de performance:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// ===== ROTAS DE BACKUP ENTERPRISE =====

// POST /api/enterprise/backup/manual - Iniciar backup manual
router.post('/backup/manual',
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  verificarLimiteEnterprise('backup', 'create'),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { tipo = 'completo', descricao } = req.body

      // Simular processo de backup
      const backupId = generateId()
      
      // Registrar backup no banco
      await prisma.$executeRaw`
        INSERT INTO backups (
          id, escritorio_id, tipo, status, descricao,
          iniciado_em, iniciado_por
        ) VALUES (
          ${backupId}, ${tenant.id}, ${tipo}, 'iniciando', 
          ${descricao || 'Backup manual'}, NOW(), ${req.user?.id}
        )
      `

      // Simular processo assíncrono de backup
      setTimeout(async () => {
        try {
          await prisma.$executeRaw`
            UPDATE backups 
            SET status = 'concluido', concluido_em = NOW(), 
                tamanho_mb = 1024, arquivo_url = '/backups/${backupId}.zip'
            WHERE id = ${backupId}
          `
        } catch (error) {
          logger.error('Erro ao finalizar backup:', error)
        }
      }, 5000) // 5 segundos para simular

      res.json({
        success: true,
        message: 'Backup iniciado com sucesso',
        data: {
          id: backupId,
          tipo,
          status: 'iniciando',
          estimativa: '2-5 minutos'
        }
      })
    } catch (error: any) {
      logger.error('Erro ao iniciar backup:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// GET /api/enterprise/backup/history - Histórico de backups
router.get('/backup/history',
  verificarPlanoEnterprise(['PROFESSIONAL', 'ENTERPRISE']),
  async (req, res) => {
    try {
      const tenant = (req as any).tenant
      const { limit = 10 } = req.query

      const backups = await prisma.$queryRaw`
        SELECT 
          id, tipo, status, descricao, tamanho_mb,
          arquivo_url, iniciado_em, concluido_em,
          iniciado_por
        FROM backups 
        WHERE escritorio_id = ${tenant.id}
        ORDER BY iniciado_em DESC
        LIMIT ${parseInt(limit as string)}
      ` as any[]

      res.json({
        success: true,
        data: backups
      })
    } catch (error: any) {
      logger.error('Erro ao buscar histórico de backup:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      })
    }
  }
)

// ===== FUNÇÕES AUXILIARES =====

async function contarUsuarios(tenantId: string): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM users 
      WHERE escritorio_id = ${tenantId} AND is_active = true
    ` as any[]
    return parseInt(result[0]?.total || '0')
  } catch (error) {
    return 0
  }
}

async function contarProjetos(tenantId: string): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM projetos 
      WHERE escritorio_id = ${tenantId} AND is_active = true
    ` as any[]
    return parseInt(result[0]?.total || '0')
  } catch (error) {
    return 0
  }
}

async function calcularStorage(tenantId: string): Promise<number> {
  // Implementar cálculo real de storage
  return Math.floor(Math.random() * 1024 * 1024 * 1024) // Simular por enquanto
}

async function contarChamadasApi(tenantId: string, dataInicio: Date): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM api_calls 
      WHERE escritorio_id = ${tenantId} AND created_at >= ${dataInicio}
    ` as any[]
    return parseInt(result[0]?.total || '0')
  } catch (error) {
    return Math.floor(Math.random() * 1000) // Simular por enquanto
  }
}

function generateApiKey(): string {
  return 'ak_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default router 