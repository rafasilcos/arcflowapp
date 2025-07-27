import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database-simple'
import { logger } from '../config/logger'

// ===== MIDDLEWARE DE VERIFICAÇÃO DE PLANO =====

export const verificarPlanoEnterprise = (planosPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.escritorioId) {
        return res.status(401).json({
          error: 'Usuário não autenticado',
          code: 'USER_NOT_AUTHENTICATED'
        })
      }

      // Buscar dados do tenant
      const tenant = await buscarTenantCompleto(req.user.escritorioId)
      
      if (!tenant) {
        return res.status(404).json({
          error: 'Escritório não encontrado',
          code: 'TENANT_NOT_FOUND'
        })
      }

      // Verificar se plano permite acesso
      if (!planosPermitidos.includes(tenant.plano)) {
        return res.status(403).json({
          error: `Recurso disponível apenas para planos: ${planosPermitidos.join(', ')}`,
          code: 'PLAN_UPGRADE_REQUIRED',
          planoAtual: tenant.plano,
          planosPermitidos,
          upgradeUrl: `/billing/upgrade?from=${tenant.plano}`
        })
      }

      // Verificar status do tenant
      if (tenant.status !== 'ATIVO') {
        return res.status(403).json({
          error: getStatusMessage(tenant.status),
          code: `TENANT_${tenant.status}`,
          status: tenant.status
        })
      }

      // Adicionar dados enterprise ao request
      ;(req as any).tenant = tenant
      ;(req as any).enterprise = {
        plano: tenant.plano,
        limites: tenant.limites,
        whiteLabel: tenant.whiteLabel
      }

      next()
    } catch (error: any) {
      logger.error('Erro na verificação de plano:', error)
      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      })
    }
  }
}

// ===== MIDDLEWARE DE VERIFICAÇÃO DE LIMITES =====

export const verificarLimiteEnterprise = (recurso: string, acao: 'create' | 'read' | 'update' | 'delete') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = (req as any).tenant
      if (!tenant) {
        return res.status(401).json({
          error: 'Dados do tenant não encontrados',
          code: 'TENANT_DATA_MISSING'
        })
      }

      const limites = tenant.limites
      const resultado = await verificarLimiteRecurso(tenant.id, recurso, acao, limites)

      if (!resultado.permitido) {
        return res.status(429).json({
          error: resultado.mensagem,
          code: 'LIMIT_EXCEEDED',
          limite: resultado.limite,
          atual: resultado.atual,
          recurso,
          upgradeUrl: `/billing/upgrade?reason=limit_${recurso}`
        })
      }

      next()
    } catch (error: any) {
      logger.error('Erro na verificação de limite:', error)
      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      })
    }
  }
}

// ===== MIDDLEWARE DE WHITE LABEL =====

export const aplicarWhiteLabelEnterprise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = (req as any).tenant
    if (tenant?.whiteLabel?.habilitado) {
      const whiteLabel = tenant.whiteLabel
      
      // Adicionar headers customizados
      res.setHeader('X-Brand-Name', whiteLabel.marca?.nomeExibicao || 'ArcFlow')
      res.setHeader('X-Brand-Domain', whiteLabel.dominio?.customizado || 'app.arcflow.com')
      
      // Modificar response para incluir configurações de marca
      const originalJson = res.json
      res.json = function(data: any) {
        if (data && typeof data === 'object') {
          data._branding = {
            logo: whiteLabel.logo?.principal,
            cores: whiteLabel.cores,
            marca: whiteLabel.marca
          }
        }
        return originalJson.call(this, data)
      }
    }

    next()
  } catch (error: any) {
    logger.error('Erro no white label:', error)
    next() // Não bloquear por erro de white label
  }
}

// ===== FUNÇÕES AUXILIARES =====

async function buscarTenantCompleto(tenantId: string): Promise<any> {
  try {
    // Buscar dados básicos do escritório
    const escritorio = await prisma.$queryRaw`
      SELECT * FROM escritorios WHERE id = ${tenantId}
    ` as any[]

    if (escritorio.length === 0) {
      return null
    }

    const dados = escritorio[0]

    // Montar configurações enterprise (com defaults)
    const tenant = {
      id: dados.id,
      nome: dados.nome,
      cnpj: dados.cnpj,
      plano: dados.plan_id || 'FREE',
      status: dados.is_active ? 'ATIVO' : 'SUSPENSO',
      
      whiteLabel: {
        habilitado: dados.plan_id === 'ENTERPRISE',
        logo: {
          principal: dados.logo_url || '/default-logo.png',
          favicon: dados.favicon_url || '/default-favicon.ico'
        },
        cores: dados.cores || {
          primaria: '#FF6B35',
          secundaria: '#2E86AB',
          acento: '#A23B72'
        },
        dominio: {
          customizado: dados.dominio_customizado || '',
          ssl: dados.ssl_customizado || false
        },
        marca: {
          nomeExibicao: dados.nome_exibicao || dados.nome,
          slogan: dados.slogan || '',
          copyright: dados.copyright || `© ${new Date().getFullYear()} ${dados.nome}`
        }
      },

      limites: getLimitesPlano(dados.plan_id),
      
      criadoEm: dados.created_at,
      atualizadoEm: dados.updated_at
    }

    return tenant
  } catch (error) {
    logger.error('Erro ao buscar tenant completo:', error)
    return null
  }
}

async function verificarLimiteRecurso(
  tenantId: string, 
  recurso: string, 
  acao: string, 
  limites: any
): Promise<{ permitido: boolean; mensagem: string; limite: number; atual: number }> {
  
  try {
    switch (recurso) {
      case 'usuarios':
        const totalUsuarios = await contarUsuarios(tenantId)
        const limiteUsuarios = limites.usuarios.maximo
        
        if (acao === 'create' && totalUsuarios >= limiteUsuarios) {
          return {
            permitido: false,
            mensagem: `Limite de usuários atingido (${limiteUsuarios})`,
            limite: limiteUsuarios,
            atual: totalUsuarios
          }
        }
        break

      case 'projetos':
        const totalProjetos = await contarProjetos(tenantId)
        const limiteProjetos = limites.projetos.maximo
        
        if (acao === 'create' && limiteProjetos > 0 && totalProjetos >= limiteProjetos) {
          return {
            permitido: false,
            mensagem: `Limite de projetos atingido (${limiteProjetos})`,
            limite: limiteProjetos,
            atual: totalProjetos
          }
        }
        break

      case 'storage':
        const totalStorage = await calcularStorage(tenantId)
        const limiteStorage = limites.armazenamento.maximo * 1024 * 1024 * 1024 // GB para bytes
        
        if (totalStorage >= limiteStorage) {
          return {
            permitido: false,
            mensagem: `Limite de armazenamento atingido (${limites.armazenamento.maximo}GB)`,
            limite: limiteStorage,
            atual: totalStorage
          }
        }
        break
    }

    return {
      permitido: true,
      mensagem: 'Limite OK',
      limite: 0,
      atual: 0
    }
  } catch (error) {
    logger.error('Erro ao verificar limite:', error)
    return {
      permitido: true, // Em caso de erro, permitir (fail-safe)
      mensagem: 'Erro na verificação',
      limite: 0,
      atual: 0
    }
  }
}

function getLimitesPlano(plano: string) {
  const limites = {
    'FREE': {
      usuarios: { maximo: 1, atual: 0 },
      projetos: { maximo: 3, atual: 0, simultaneos: 1 },
      armazenamento: { maximo: 1, atual: 0, arquivos: 100 },
      api: { chamadas: 100, webhooks: 0 },
      recursos: { relatorios: 5, exports: 10 }
    },
    'BASIC': {
      usuarios: { maximo: 5, atual: 0 },
      projetos: { maximo: 25, atual: 0, simultaneos: 5 },
      armazenamento: { maximo: 10, atual: 0, arquivos: 1000 },
      api: { chamadas: 500, webhooks: 2 },
      recursos: { relatorios: 25, exports: 50 }
    },
    'PROFESSIONAL': {
      usuarios: { maximo: 25, atual: 0 },
      projetos: { maximo: 100, atual: 0, simultaneos: 20 },
      armazenamento: { maximo: 100, atual: 0, arquivos: 10000 },
      api: { chamadas: 5000, webhooks: 10 },
      recursos: { relatorios: 100, exports: 200 }
    },
    'ENTERPRISE': {
      usuarios: { maximo: 1000, atual: 0 },
      projetos: { maximo: -1, atual: 0, simultaneos: -1 }, // Ilimitado
      armazenamento: { maximo: 1000, atual: 0, arquivos: -1 },
      api: { chamadas: 50000, webhooks: -1 },
      recursos: { relatorios: -1, exports: -1 }
    }
  }

  return limites[plano as keyof typeof limites] || limites['FREE']
}

// Funções auxiliares de contagem
async function contarUsuarios(tenantId: string): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM users WHERE escritorio_id = ${tenantId} AND is_active = true
    ` as any[]
    return parseInt(result[0]?.total || '0')
  } catch (error) {
    logger.error('Erro ao contar usuários:', error)
    return 0
  }
}

async function contarProjetos(tenantId: string): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM projetos WHERE escritorio_id = ${tenantId} AND is_active = true
    ` as any[]
    return parseInt(result[0]?.total || '0')
  } catch (error) {
    logger.error('Erro ao contar projetos:', error)
    return 0
  }
}

async function calcularStorage(tenantId: string): Promise<number> {
  // Implementar cálculo real de storage usado
  return 0 // Por enquanto retorna 0
}

function getStatusMessage(status: string): string {
  const mensagens = {
    'INADIMPLENTE': 'Escritório com pagamento em atraso. Entre em contato com o financeiro.',
    'SUSPENSO': 'Escritório suspenso. Entre em contato com o suporte.',
    'CANCELADO': 'Escritório cancelado.',
    'TRIAL': 'Período de teste expirado.'
  }
  return mensagens[status as keyof typeof mensagens] || 'Status inválido'
} 