import { Pool } from 'pg';
import pool from '../config/database';

export interface VersaoOrcamento {
  id: string;
  orcamentoId: string;
  briefingId: string;
  versao: number;
  dadosVersao: any;
  motivoAlteracao?: string;
  createdAt: Date;
  createdBy: string;
  nomeUsuario?: string;
}

export interface ComparacaoVersoes {
  versaoAnterior: VersaoOrcamento;
  versaoAtual: VersaoOrcamento;
  diferencas: DiferencaVersao[];
}

export interface DiferencaVersao {
  campo: string;
  valorAnterior: any;
  valorAtual: any;
  tipo: 'adicionado' | 'removido' | 'modificado';
  categoria: 'valor' | 'horas' | 'disciplina' | 'configuracao';
}

export interface HistoricoFiltros {
  orcamentoId?: string;
  briefingId?: string;
  escritorioId?: string;
  usuarioId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  limite?: number;
  offset?: number;
}

class HistoricoOrcamentoService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Salva uma nova versão do orçamento no histórico
   */
  async salvarVersao(
    orcamentoId: string,
    briefingId: string,
    dadosOrcamento: any,
    motivoAlteracao: string,
    usuarioId: string
  ): Promise<VersaoOrcamento> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Buscar próximo número de versão
      const versaoResult = await client.query(
        `SELECT COALESCE(MAX(versao), 0) + 1 as proxima_versao 
         FROM historico_orcamentos 
         WHERE orcamento_id = $1`,
        [orcamentoId]
      );

      const proximaVersao = versaoResult.rows[0].proxima_versao;

      // Inserir nova versão
      const insertResult = await client.query(
        `INSERT INTO historico_orcamentos 
         (orcamento_id, briefing_id, versao, dados_versao, motivo_alteracao, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, created_at`,
        [orcamentoId, briefingId, proximaVersao, JSON.stringify(dadosOrcamento), motivoAlteracao, usuarioId]
      );

      await client.query('COMMIT');

      const novaVersao: VersaoOrcamento = {
        id: insertResult.rows[0].id,
        orcamentoId,
        briefingId,
        versao: proximaVersao,
        dadosVersao: dadosOrcamento,
        motivoAlteracao,
        createdAt: insertResult.rows[0].created_at,
        createdBy: usuarioId
      };

      console.log(`Nova versão ${proximaVersao} salva para orçamento ${orcamentoId}`);
      return novaVersao;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao salvar versão do orçamento:', error);
      throw new Error('Falha ao salvar versão do orçamento');
    } finally {
      client.release();
    }
  }

  /**
   * Busca histórico de versões de um orçamento
   */
  async buscarHistorico(filtros: HistoricoFiltros): Promise<VersaoOrcamento[]> {
    const client = await this.pool.connect();

    try {
      let query = `
        SELECT 
          h.id,
          h.orcamento_id,
          h.briefing_id,
          h.versao,
          h.dados_versao,
          h.motivo_alteracao,
          h.created_at,
          h.created_by,
          u.nome as nome_usuario
        FROM historico_orcamentos h
        LEFT JOIN users u ON h.created_by = u.id
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramCount = 0;

      if (filtros.orcamentoId) {
        paramCount++;
        query += ` AND h.orcamento_id = $${paramCount}`;
        params.push(filtros.orcamentoId);
      }

      if (filtros.briefingId) {
        paramCount++;
        query += ` AND h.briefing_id = $${paramCount}`;
        params.push(filtros.briefingId);
      }

      if (filtros.usuarioId) {
        paramCount++;
        query += ` AND h.created_by = $${paramCount}`;
        params.push(filtros.usuarioId);
      }

      if (filtros.dataInicio) {
        paramCount++;
        query += ` AND h.created_at >= $${paramCount}`;
        params.push(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        paramCount++;
        query += ` AND h.created_at <= $${paramCount}`;
        params.push(filtros.dataFim);
      }

      // Filtro por escritório (através do briefing)
      if (filtros.escritorioId) {
        paramCount++;
        query += ` AND EXISTS (
          SELECT 1 FROM briefings b 
          WHERE b.id = h.briefing_id 
          AND b.escritorio_id = $${paramCount}
        )`;
        params.push(filtros.escritorioId);
      }

      query += ` ORDER BY h.created_at DESC, h.versao DESC`;

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
        orcamentoId: row.orcamento_id,
        briefingId: row.briefing_id,
        versao: row.versao,
        dadosVersao: row.dados_versao,
        motivoAlteracao: row.motivo_alteracao,
        createdAt: row.created_at,
        createdBy: row.created_by,
        nomeUsuario: row.nome_usuario
      }));

    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error('Falha ao buscar histórico de orçamentos');
    } finally {
      client.release();
    }
  }

  /**
   * Compara duas versões de orçamento
   */
  async compararVersoes(
    orcamentoId: string,
    versaoAnterior: number,
    versaoAtual: number
  ): Promise<ComparacaoVersoes> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(
        `SELECT * FROM historico_orcamentos 
         WHERE orcamento_id = $1 AND versao IN ($2, $3)
         ORDER BY versao`,
        [orcamentoId, versaoAnterior, versaoAtual]
      );

      if (result.rows.length !== 2) {
        throw new Error('Versões não encontradas para comparação');
      }

      const versoes = result.rows.map(row => ({
        id: row.id,
        orcamentoId: row.orcamento_id,
        briefingId: row.briefing_id,
        versao: row.versao,
        dadosVersao: row.dados_versao,
        motivoAlteracao: row.motivo_alteracao,
        createdAt: row.created_at,
        createdBy: row.created_by
      }));

      const diferencas = this.calcularDiferencas(
        versoes[0].dadosVersao,
        versoes[1].dadosVersao
      );

      return {
        versaoAnterior: versoes[0],
        versaoAtual: versoes[1],
        diferencas
      };

    } catch (error) {
      console.error('Erro ao comparar versões:', error);
      throw new Error('Falha ao comparar versões do orçamento');
    } finally {
      client.release();
    }
  }

  /**
   * Calcula diferenças entre duas versões de dados
   */
  private calcularDiferencas(dadosAnteriores: any, dadosAtuais: any): DiferencaVersao[] {
    const diferencas: DiferencaVersao[] = [];

    // Comparar valores totais
    if (dadosAnteriores.valorTotal !== dadosAtuais.valorTotal) {
      diferencas.push({
        campo: 'valorTotal',
        valorAnterior: dadosAnteriores.valorTotal,
        valorAtual: dadosAtuais.valorTotal,
        tipo: 'modificado',
        categoria: 'valor'
      });
    }

    // Comparar horas totais
    if (dadosAnteriores.horasTotal !== dadosAtuais.horasTotal) {
      diferencas.push({
        campo: 'horasTotal',
        valorAnterior: dadosAnteriores.horasTotal,
        valorAtual: dadosAtuais.horasTotal,
        tipo: 'modificado',
        categoria: 'horas'
      });
    }

    // Comparar disciplinas
    this.compararDisciplinas(dadosAnteriores, dadosAtuais, diferencas);

    // Comparar configurações
    this.compararConfiguracoes(dadosAnteriores, dadosAtuais, diferencas);

    return diferencas;
  }

  /**
   * Compara disciplinas entre versões
   */
  private compararDisciplinas(dadosAnteriores: any, dadosAtuais: any, diferencas: DiferencaVersao[]) {
    const disciplinasAnteriores = dadosAnteriores.disciplinas || {};
    const disciplinasAtuais = dadosAtuais.disciplinas || {};

    const todasDisciplinas = new Set([
      ...Object.keys(disciplinasAnteriores),
      ...Object.keys(disciplinasAtuais)
    ]);

    for (const disciplina of todasDisciplinas) {
      const anterior = disciplinasAnteriores[disciplina];
      const atual = disciplinasAtuais[disciplina];

      if (!anterior && atual) {
        diferencas.push({
          campo: `disciplinas.${disciplina}`,
          valorAnterior: null,
          valorAtual: atual,
          tipo: 'adicionado',
          categoria: 'disciplina'
        });
      } else if (anterior && !atual) {
        diferencas.push({
          campo: `disciplinas.${disciplina}`,
          valorAnterior: anterior,
          valorAtual: null,
          tipo: 'removido',
          categoria: 'disciplina'
        });
      } else if (anterior && atual && JSON.stringify(anterior) !== JSON.stringify(atual)) {
        diferencas.push({
          campo: `disciplinas.${disciplina}`,
          valorAnterior: anterior,
          valorAtual: atual,
          tipo: 'modificado',
          categoria: 'disciplina'
        });
      }
    }
  }

  /**
   * Compara configurações entre versões
   */
  private compararConfiguracoes(dadosAnteriores: any, dadosAtuais: any, diferencas: DiferencaVersao[]) {
    const configAnteriores = dadosAnteriores.configuracoes || {};
    const configAtuais = dadosAtuais.configuracoes || {};

    const todasConfigs = new Set([
      ...Object.keys(configAnteriores),
      ...Object.keys(configAtuais)
    ]);

    for (const config of todasConfigs) {
      const anterior = configAnteriores[config];
      const atual = configAtuais[config];

      if (anterior !== atual) {
        diferencas.push({
          campo: `configuracoes.${config}`,
          valorAnterior: anterior,
          valorAtual: atual,
          tipo: anterior === undefined ? 'adicionado' : atual === undefined ? 'removido' : 'modificado',
          categoria: 'configuracao'
        });
      }
    }
  }

  /**
   * Remove versões antigas (mais de 1 ano)
   */
  async limparVersõesAntigas(): Promise<number> {
    const client = await this.pool.connect();

    try {
      const umAnoAtras = new Date();
      umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

      const result = await client.query(
        `DELETE FROM historico_orcamentos 
         WHERE created_at < $1`,
        [umAnoAtras]
      );

      const versõesRemovidas = result.rowCount || 0;
      console.log(`${versõesRemovidas} versões antigas removidas do histórico`);

      return versõesRemovidas;

    } catch (error) {
      console.error('Erro ao limpar versões antigas:', error);
      throw new Error('Falha ao limpar histórico antigo');
    } finally {
      client.release();
    }
  }

  /**
   * Busca estatísticas do histórico
   */
  async buscarEstatisticas(escritorioId: string): Promise<any> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(
        `SELECT 
          COUNT(*) as total_versoes,
          COUNT(DISTINCT h.orcamento_id) as total_orcamentos,
          COUNT(DISTINCT h.created_by) as total_usuarios,
          MIN(h.created_at) as primeira_versao,
          MAX(h.created_at) as ultima_versao
         FROM historico_orcamentos h
         JOIN briefings b ON h.briefing_id = b.id
         WHERE b.escritorio_id = $1`,
        [escritorioId]
      );

      return result.rows[0];

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao buscar estatísticas do histórico');
    } finally {
      client.release();
    }
  }
}

export default new HistoricoOrcamentoService();