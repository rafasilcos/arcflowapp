import { Client } from 'pg';
import logger from '../config/logger';

interface AuditoriaEvent {
  entityType: 'cliente' | 'usuario' | 'escritorio';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  changes?: {
    before?: any;
    after?: any;
    fields?: string[];
  };
  userId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: any;
}

class AuditoriaService {
  private static instance: AuditoriaService;
  
  public static getInstance(): AuditoriaService {
    if (!AuditoriaService.instance) {
      AuditoriaService.instance = new AuditoriaService();
    }
    return AuditoriaService.instance;
  }

  /**
   * Registra um evento de auditoria
   */
  async registrarEvento(event: AuditoriaEvent): Promise<void> {
    const client = new Client({
      connectionString: process.env.DATABASE_URL || "postgresql://postgres:Arcflow2024!@localhost:5432/arcflow_db"
    });

    try {
      await client.connect();
      
      const auditoriaId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      await client.query(`
        INSERT INTO auditoria (
          id, entity_type, entity_id, action, changes, 
          user_id, ip_address, user_agent, metadata, 
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      `, [
        auditoriaId,
        event.entityType,
        event.entityId,
        event.action,
        event.changes ? JSON.stringify(event.changes) : null,
        event.userId || 'system',
        event.ip || 'unknown',
        event.userAgent || 'unknown',
        event.metadata ? JSON.stringify(event.metadata) : null
      ]);
      
      logger.info('Evento de auditoria registrado', {
        auditoriaId,
        entityType: event.entityType,
        entityId: event.entityId,
        action: event.action,
        userId: event.userId
      });
      
    } catch (error) {
      logger.error('Erro ao registrar auditoria:', error);
      // Não propagar o erro para não afetar a operação principal
    } finally {
      await client.end();
    }
  }

  /**
   * Calcula diferenças entre dois objetos
   */
  calcularDiferencas(before: any, after: any): { fields: string[], changes: any } {
    const fields: string[] = [];
    const changes: any = { before: {}, after: {} };
    
    const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
    
    for (const key of allKeys) {
      const beforeValue = before?.[key];
      const afterValue = after?.[key];
      
      // Comparar valores (considerando null, undefined e strings vazias como equivalentes)
      const beforeNormalized = beforeValue === null || beforeValue === undefined || beforeValue === '' ? null : beforeValue;
      const afterNormalized = afterValue === null || afterValue === undefined || afterValue === '' ? null : afterValue;
      
      if (JSON.stringify(beforeNormalized) !== JSON.stringify(afterNormalized)) {
        fields.push(key);
        changes.before[key] = beforeValue;
        changes.after[key] = afterValue;
      }
    }
    
    return { fields, changes };
  }

  /**
   * Registra criação de cliente
   */
  async registrarCriacaoCliente(clienteId: string, dadosCliente: any, userId?: string, req?: any): Promise<void> {
    await this.registrarEvento({
      entityType: 'cliente',
      entityId: clienteId,
      action: 'CREATE',
      changes: {
        after: dadosCliente,
        fields: Object.keys(dadosCliente)
      },
      userId,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'web_app'
      }
    });
  }

  /**
   * Registra atualização de cliente
   */
  async registrarAtualizacaoCliente(
    clienteId: string, 
    dadosAntigos: any, 
    dadosNovos: any, 
    userId?: string, 
    req?: any
  ): Promise<void> {
    const { fields, changes } = this.calcularDiferencas(dadosAntigos, dadosNovos);
    
    if (fields.length > 0) {
      await this.registrarEvento({
        entityType: 'cliente',
        entityId: clienteId,
        action: 'UPDATE',
        changes: {
          before: changes.before,
          after: changes.after,
          fields
        },
        userId,
        ip: req?.ip,
        userAgent: req?.headers?.['user-agent'],
        metadata: {
          timestamp: new Date().toISOString(),
          fieldsChanged: fields.length,
          source: 'web_app'
        }
      });
    }
  }

  /**
   * Registra remoção de cliente (soft delete)
   */
  async registrarRemocaoCliente(clienteId: string, dadosCliente: any, userId?: string, req?: any): Promise<void> {
    await this.registrarEvento({
      entityType: 'cliente',
      entityId: clienteId,
      action: 'DELETE',
      changes: {
        before: dadosCliente,
        fields: ['is_active', 'deleted_at']
      },
      userId,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
      metadata: {
        timestamp: new Date().toISOString(),
        softDelete: true,
        source: 'web_app'
      }
    });
  }

  /**
   * Registra restauração de cliente
   */
  async registrarRestauracaoCliente(clienteId: string, dadosCliente: any, userId?: string, req?: any): Promise<void> {
    await this.registrarEvento({
      entityType: 'cliente',
      entityId: clienteId,
      action: 'RESTORE',
      changes: {
        after: dadosCliente,
        fields: ['is_active', 'deleted_at']
      },
      userId,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
      metadata: {
        timestamp: new Date().toISOString(),
        restored: true,
        source: 'web_app'
      }
    });
  }

  /**
   * Busca histórico de auditoria de um cliente
   */
  async buscarHistoricoCliente(clienteId: string): Promise<any[]> {
    const client = new Client({
      connectionString: process.env.DATABASE_URL || "postgresql://postgres:Arcflow2024!@localhost:5432/arcflow_db"
    });

    try {
      await client.connect();
      
      const result = await client.query(`
        SELECT 
          id, action, changes, user_id, ip_address, 
          user_agent, metadata, created_at
        FROM auditoria 
        WHERE entity_type = 'cliente' AND entity_id = $1
        ORDER BY created_at DESC
        LIMIT 50
      `, [clienteId]);
      
      return result.rows.map(row => ({
        id: row.id,
        action: row.action,
        changes: row.changes ? JSON.parse(row.changes) : null,
        userId: row.user_id,
        ip: row.ip_address,
        userAgent: row.user_agent,
        metadata: row.metadata ? JSON.parse(row.metadata) : null,
        timestamp: row.created_at
      }));
      
    } catch (error) {
      logger.error('Erro ao buscar histórico de auditoria:', error);
      return [];
    } finally {
      await client.end();
    }
  }
}

export default AuditoriaService.getInstance(); 