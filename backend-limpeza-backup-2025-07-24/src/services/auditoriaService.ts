import { Pool } from 'pg';
import pool from '../config/database';

export interface RegistroAuditoria {
  id: string;
  entidade: 'orcamento' | 'briefing' | 'configuracao';
  entidadeId: string;
  acao: 'criacao' | 'atualizacao' | 'exclusao' | 'regeneracao';
  dadosAnteriores?: any;
  dadosNovos?: any;
  usuarioId: string;
  nomeUsuario?: string;
  escritorioId: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
  detalhes?: string;
}

export interface FiltrosAuditoria {
  entidade?: 'orcamento' | 'briefing' | 'configuracao';
  entidadeId?: string;
  acao?: string;
  usuarioId?: string;
  escritorioId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  limite?: number;
  offset?: number;
}

export interface RelatorioAuditoria {
  registros: RegistroAuditoria[];
  total: number;
  estatisticas: {
    totalAcoes: number;
    acoesUltimos30Dias: number;
    usuariosMaisAtivos: Array<{
      usuarioId: string;
      nomeUsuario: string;
      totalAcoes: number;
    }>;
    acoesPopulares: Array<{
      acao: string;
      total: number;
    }>;
  };
}

class AuditoriaService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Registra uma ação de auditoria
   */
  async registrarAcao(
    entidade: 'orcamento' | 'briefing' | 'configuracao',
    entidadeId: string,
    acao: 'criacao' | 'atualizacao' | 'exclusao' | 'regeneracao',
    usuarioId: string,
    escritorioId: string,
    dadosAnteriores?: any,
    dadosNovos?: any,
    detalhes?: string,
    ip?: string,
    userAgent?: string
  ): Promise<RegistroAuditoria> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO auditoria_orcamentos 
         (entidade, entidade_id, acao, dados_anteriores, dados_novos, usuario_id, escritorio_id, ip, user_agent, detalhes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, timestamp`,
        [
          entidade,
          entidadeId,
          acao,
          dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
          dadosNovos ? JSON.stringify(dadosNovos) : null,
          usuarioId,
          escritorioId,
          ip,
          userAgent,
          detalhes
        ]
      );

      const registro: RegistroAuditoria = {
        id: result.rows[0].id,
        entidade,
        entidadeId,
        acao,
        dadosAnteriores,
        dadosNovos,
        usuarioId,
        escritorioId,
        ip,
        userAgent,
        timestamp: result.rows[0].timestamp,
        detalhes
      };

      console.log(`Auditoria registrada: ${acao} em ${entidade} ${entidadeId} por usuário ${usuarioId}`);
      return registro;

    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
      throw new Error('Falha ao registrar ação de auditoria');
    } finally {
      client.release();
    }
  }

  /**
   * Busca registros de auditoria com filtros
   */
  async buscarRegistros(filtros: FiltrosAuditoria): Promise<RegistroAuditoria[]> {
    const client = await this.pool.connect();
    
    try {
      let query = `
        SELECT 
          a.id,
          a.entidade,
          a.entidade_id,
          a.acao,
          a.dados_anteriores,
          a.dados_novos,
          a.usuario_id,
          a.escritorio_id,
          a.ip,
          a.user_agent,
          a.timestamp,
          a.detalhes,
          u.nome as nome_usuario
        FROM auditoria_orcamentos a
        LEFT JOIN users u ON a.usuario_id = u.id
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramCount = 0;

      if (filtros.entidade) {
        paramCount++;
        query += ` AND a.entidade = $${paramCount}`;
        params.push(filtros.entidade);
      }

      if (filtros.entidadeId) {
        paramCount++;
        query += ` AND a.entidade_id = $${paramCount}`;
        params.push(filtros.entidadeId);
      }

      if (filtros.acao) {
        paramCount++;
        query += ` AND a.acao = $${paramCount}`;
        params.push(filtros.acao);
      }

      if (filtros.usuarioId) {
        paramCount++;
        query += ` AND a.usuario_id = $${paramCount}`;
        params.push(filtros.usuarioId);
      }

      if (filtros.escritorioId) {
        paramCount++;
        query += ` AND a.escritorio_id = $${paramCount}`;
        params.push(filtros.escritorioId);
      }

      if (filtros.dataInicio) {
        paramCount++;
        query += ` AND a.timestamp >= $${paramCount}`;
        params.push(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        paramCount++;
        query += ` AND a.timestamp <= $${paramCount}`;
        params.push(filtros.dataFim);
      }

      query += ` ORDER BY a.timestamp DESC`;

      if (filtros.limite) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(filtros.limite);
      }

      if (filtros.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(filtros.offset);
      }

      const result = await client.query(query, params);

      return result.rows.map(row => ({
        id: row.id,
        entidade: row.entidade,
        entidadeId: row.entidade_id,
        acao: row.acao,
        dadosAnteriores: row.dados_anteriores,
        dadosNovos: row.dados_novos,
        usuarioId: row.usuario_id,
        nomeUsuario: row.nome_usuario,
        escritorioId: row.escritorio_id,
        ip: row.ip,
        userAgent: row.user_agent,
        timestamp: row.timestamp,
        detalhes: row.detalhes
      }));

    } catch (error) {
      console.error('Erro ao buscar registros de auditoria:', error);
      throw new Error('Falha ao buscar registros de auditoria');
    } finally {
      client.release();
    }
  }

  /**
   * Gera relatório completo de auditoria
   */
  async gerarRelatorio(escritorioId: string, periodo?: { inicio: Date; fim: Date }): Promise<RelatorioAuditoria> {
    const client = await this.pool.connect();
    
    try {
      const filtros: FiltrosAuditoria = {
        escritorioId,
        limite: 1000
      };

      if (periodo) {
        filtros.dataInicio = periodo.inicio;
        filtros.dataFim = periodo.fim;
      }

      // Buscar registros
      const registros = await this.buscarRegistros(filtros);

      // Buscar estatísticas
      const estatisticas = await this.buscarEstatisticas(escritorioId, periodo);

      return {
        registros,
        total: registros.length,
        estatisticas
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de auditoria:', error);
      throw new Error('Falha ao gerar relatório de auditoria');
    } finally {
      client.release();
    }
  }

  /**
   * Busca estatísticas de auditoria
   */
  private async buscarEstatisticas(escritorioId: string, periodo?: { inicio: Date; fim: Date }): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      let whereClause = 'WHERE escritorio_id = $1';
      const params = [escritorioId];
      let paramCount = 1;

      if (periodo) {
        paramCount++;
        whereClause += ` AND timestamp >= $${paramCount}`;
        params.push(periodo.inicio);
        
        paramCount++;
        whereClause += ` AND timestamp <= $${paramCount}`;
        params.push(periodo.fim);
      }

      // Total de ações
      const totalResult = await client.query(
        `SELECT COUNT(*) as total FROM auditoria_orcamentos ${whereClause}`,
        params
      );

      // Ações dos últimos 30 dias
      const trinta_dias_atras = new Date();
      trinta_dias_atras.setDate(trinta_dias_atras.getDate() - 30);
      
      const ultimos30Result = await client.query(
        `SELECT COUNT(*) as total FROM auditoria_orcamentos 
         WHERE escritorio_id = $1 AND timestamp >= $2`,
        [escritorioId, trinta_dias_atras]
      );

      // Usuários mais ativos
      const usuariosResult = await client.query(
        `SELECT 
          a.usuario_id,
          u.nome as nome_usuario,
          COUNT(*) as total_acoes
         FROM auditoria_orcamentos a
         LEFT JOIN users u ON a.usuario_id = u.id
         ${whereClause}
         GROUP BY a.usuario_id, u.nome
         ORDER BY total_acoes DESC
         LIMIT 10`,
        params
      );

      // Ações mais populares
      const acoesResult = await client.query(
        `SELECT acao, COUNT(*) as total
         FROM auditoria_orcamentos
         ${whereClause}
         GROUP BY acao
         ORDER BY total DESC`,
        params
      );

      return {
        totalAcoes: parseInt(totalResult.rows[0].total),
        acoesUltimos30Dias: parseInt(ultimos30Result.rows[0].total),
        usuariosMaisAtivos: usuariosResult.rows.map(row => ({
          usuarioId: row.usuario_id,
          nomeUsuario: row.nome_usuario,
          totalAcoes: parseInt(row.total_acoes)
        })),
        acoesPopulares: acoesResult.rows.map(row => ({
          acao: row.acao,
          total: parseInt(row.total)
        }))
      };

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao buscar estatísticas de auditoria');
    } finally {
      client.release();
    }
  }

  /**
   * Registra geração de orçamento
   */
  async registrarGeracaoOrcamento(
    orcamentoId: string,
    briefingId: string,
    usuarioId: string,
    escritorioId: string,
    dadosOrcamento: any,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    await this.registrarAcao(
      'orcamento',
      orcamentoId,
      'criacao',
      usuarioId,
      escritorioId,
      null,
      dadosOrcamento,
      `Orçamento gerado automaticamente a partir do briefing ${briefingId}`,
      ip,
      userAgent
    );
  }

  /**
   * Registra regeneração de orçamento
   */
  async registrarRegeneracaoOrcamento(
    orcamentoId: string,
    usuarioId: string,
    escritorioId: string,
    dadosAnteriores: any,
    dadosNovos: any,
    motivo: string,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    await this.registrarAcao(
      'orcamento',
      orcamentoId,
      'regeneracao',
      usuarioId,
      escritorioId,
      dadosAnteriores,
      dadosNovos,
      motivo,
      ip,
      userAgent
    );
  }

  /**
   * Registra alteração de configuração
   */
  async registrarAlteracaoConfiguracao(
    configuracaoId: string,
    usuarioId: string,
    escritorioId: string,
    configAnteriores: any,
    configNovas: any,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    await this.registrarAcao(
      'configuracao',
      configuracaoId,
      'atualizacao',
      usuarioId,
      escritorioId,
      configAnteriores,
      configNovas,
      'Configurações de orçamento alteradas',
      ip,
      userAgent
    );
  }

  /**
   * Remove registros antigos de auditoria (mais de 2 anos)
   */
  async limparRegistrosAntigos(): Promise<number> {
    const client = await this.pool.connect();
    
    try {
      const doisAnosAtras = new Date();
      doisAnosAtras.setFullYear(doisAnosAtras.getFullYear() - 2);

      const result = await client.query(
        `DELETE FROM auditoria_orcamentos 
         WHERE timestamp < $1`,
        [doisAnosAtras]
      );

      const registrosRemovidos = result.rowCount || 0;
      console.log(`${registrosRemovidos} registros antigos de auditoria removidos`);
      
      return registrosRemovidos;

    } catch (error) {
      console.error('Erro ao limpar registros antigos:', error);
      throw new Error('Falha ao limpar registros antigos de auditoria');
    } finally {
      client.release();
    }
  }
}

export default new AuditoriaService();