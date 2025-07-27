/**
 * 💰 SERVIÇO DE ORÇAMENTOS INTELIGENTE V2.0
 * 
 * Sistema completamente novo com lógica 10x melhor que o anterior
 * Baseado em metodologia NBR 13532 e inteligência artificial
 */

const { getClient } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const BriefingAnalyzer = require('../utils/briefingAnalyzer');
const OrcamentoCalculator = require('../utils/orcamentoCalculator');
const OrcamentoValidator = require('../utils/orcamentoValidator');

class OrcamentoService {
  constructor() {
    this.analyzer = new BriefingAnalyzer();
    this.calculator = new OrcamentoCalculator();
    this.validator = new OrcamentoValidator();
  }

  /**
   * 🧠 MÉTODO PRINCIPAL - Gerar orçamento inteligente
   * Substitui completamente a lógica ruim do sistema anterior
   */
  async gerarOrcamentoInteligente(briefingId, escritorioId, userId) {
    const client = getClient();
    
    try {
      console.log('🧠 [ORCAMENTO-V2] Iniciando geração inteligente:', { briefingId, escritorioId, userId });
      
      // ETAPA 1: Buscar briefing completo com validação
      const briefing = await this.buscarBriefingCompleto(briefingId, escritorioId);
      
      // ETAPA 2: Verificar se já existe orçamento
      await this.verificarOrcamentoExistente(briefingId, escritorioId);
      
      // ETAPA 3: ANÁLISE INTELIGENTE (NOVA LÓGICA)
      console.log('🔍 [ORCAMENTO-V2] Iniciando análise inteligente do briefing...');
      const dadosEstruturados = await this.analyzer.extrairDadosEstruturados(briefing);
      
      // ETAPA 4: CÁLCULO AVANÇADO (NOVA LÓGICA)
      console.log('💡 [ORCAMENTO-V2] Calculando orçamento com metodologia NBR 13532...');
      
      // Adicionar escritorioId aos dados estruturados para carregar configurações personalizadas
      dadosEstruturados.escritorioId = escritorioId;
      
      const orcamentoCalculado = await this.calculator.calcularOrcamentoAvancado(dadosEstruturados);
      
      // ETAPA 5: VALIDAÇÃO E AJUSTES (NOVA LÓGICA)
      console.log('✅ [ORCAMENTO-V2] Validando e ajustando orçamento...');
      const orcamentoValidado = await this.validator.validarEAjustar(orcamentoCalculado);
      
      // ETAPA 6: SALVAR NO BANCO
      const orcamentoSalvo = await this.salvarOrcamento(orcamentoValidado, briefingId, escritorioId, userId);
      
      // ETAPA 7: ATUALIZAR STATUS DO BRIEFING
      await this.atualizarStatusBriefing(briefingId, escritorioId);
      
      console.log('🎉 [ORCAMENTO-V2] Orçamento inteligente gerado com sucesso!', {
        orcamentoId: orcamentoSalvo.id,
        valorTotal: orcamentoSalvo.valorTotal,
        precisao: orcamentoValidado.confianca,
        metodologia: 'NBR_13532_V2'
      });
      
      return {
        success: true,
        message: 'Orçamento inteligente gerado com sucesso!',
        version: '2.0.0',
        data: {
          orcamentoId: orcamentoSalvo.id,
          codigo: orcamentoSalvo.codigo,
          valorTotal: orcamentoSalvo.valorTotal,
          valorPorM2: orcamentoSalvo.valorPorM2,
          areaConstruida: orcamentoSalvo.areaConstruida,
          prazoEntrega: orcamentoSalvo.prazoEntrega,
          briefingId: briefingId,
          
          // DADOS EXTRAÍDOS PELA IA (NOVO)
          dadosExtaidosIA: {
            tipologia: dadosEstruturados.tipologia,
            complexidade: dadosEstruturados.complexidade,
            disciplinas: dadosEstruturados.disciplinasNecessarias,
            caracteristicas: dadosEstruturados.caracteristicasEspeciais,
            indicadores: {
              area: dadosEstruturados.areaConstruida,
              valor: orcamentoSalvo.valorTotal,
              prazo: orcamentoSalvo.prazoEntrega,
              confianca: orcamentoValidado.confianca
            }
          },
          
          // COMPOSIÇÃO FINANCEIRA DETALHADA (NOVO)
          composicaoFinanceira: orcamentoSalvo.composicaoFinanceira,
          
          // CRONOGRAMA POR FASES NBR 13532 (NOVO)
          cronograma: orcamentoSalvo.cronograma,
          
          // BENCHMARKING AUTOMÁTICO (NOVO)
          benchmarking: orcamentoValidado.benchmarking,
          
          // ANÁLISE DE RISCOS (NOVO)
          analiseRiscos: orcamentoValidado.analiseRiscos,
          
          // AUDITORIA E RASTREABILIDADE (NOVO)
          auditoria: {
            metodologia: 'NBR_13532_V2',
            versaoSistema: '2.0.0',
            dataGeracao: new Date().toISOString(),
            tempoProcessamento: orcamentoValidado.tempoProcessamento,
            fonteDados: 'briefing_estruturado',
            validacoes: orcamentoValidado.validacoes
          }
        }
      };
      
    } catch (error) {
      console.error('❌ [ORCAMENTO-V2] Erro na geração:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Erro interno na geração do orçamento',
        500,
        'ORCAMENTO_GENERATION_ERROR'
      );
    }
  }

  /**
   * 📋 Buscar briefing completo com validação
   */
  async buscarBriefingCompleto(briefingId, escritorioId) {
    const client = getClient();
    
    const result = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        c.cpf as cliente_cpf,
        c.cnpj as cliente_cnpj,
        u.nome as responsavel_nome,
        u.email as responsavel_email,
        e.nome as escritorio_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      LEFT JOIN escritorios e ON b.escritorio_id::text = e.id
      WHERE b.id = $1::uuid 
        AND b.escritorio_id::text = $2 
        AND b.deleted_at IS NULL
    `, [briefingId, escritorioId]);

    if (result.rows.length === 0) {
      throw new AppError(
        'Briefing não encontrado ou não pertence ao escritório',
        404,
        'BRIEFING_NOT_FOUND'
      );
    }

    const briefing = result.rows[0];
    
    // Validar se briefing está em status adequado para orçamento
    const statusValidos = ['CONCLUIDO', 'APROVADO', 'EM_ANDAMENTO'];
    if (!statusValidos.includes(briefing.status)) {
      throw new AppError(
        `Briefing deve estar concluído para gerar orçamento. Status atual: ${briefing.status}`,
        400,
        'BRIEFING_INVALID_STATUS'
      );
    }

    return briefing;
  }

  /**
   * 🔍 Verificar se já existe orçamento para o briefing
   */
  async verificarOrcamentoExistente(briefingId, escritorioId) {
    const client = getClient();
    
    const result = await client.query(`
      SELECT id, codigo, status, created_at 
      FROM orcamentos 
      WHERE briefing_id = $1::uuid 
        AND escritorio_id = $2::uuid
        AND deleted_at IS NULL
    `, [briefingId, escritorioId]);

    if (result.rows.length > 0) {
      const orcamentoExistente = result.rows[0];
      throw new AppError(
        'Já existe um orçamento para este briefing',
        409,
        'ORCAMENTO_ALREADY_EXISTS',
        {
          orcamentoId: orcamentoExistente.id,
          codigo: orcamentoExistente.codigo,
          status: orcamentoExistente.status,
          criadoEm: orcamentoExistente.created_at
        }
      );
    }
  }

  /**
   * 💾 Salvar orçamento no banco de dados
   */
  async salvarOrcamento(orcamentoValidado, briefingId, escritorioId, userId) {
    const client = getClient();
    
    try {
      // Gerar código único para o orçamento
      const codigo = this.gerarCodigoOrcamento();
      
      const result = await client.query(`
        INSERT INTO orcamentos (
          codigo, nome, descricao, status,
          area_construida, area_terreno, valor_total, valor_por_m2,
          tipologia, padrao, complexidade, localizacao,
          disciplinas, composicao_financeira, cronograma, proposta,
          briefing_id, cliente_id, escritorio_id, responsavel_id,
          dados_extraidos, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW()
        ) RETURNING *
      `, [
        codigo,
        `Orçamento Inteligente V2 - ${orcamentoValidado.nome || 'Projeto'}`,
        orcamentoValidado.descricao || 'Orçamento gerado automaticamente',
        'RASCUNHO',
        orcamentoValidado.areaConstruida,
        orcamentoValidado.areaTerreno,
        orcamentoValidado.valorTotal,
        orcamentoValidado.valorPorM2,
        orcamentoValidado.tipologia,
        orcamentoValidado.padrao,
        orcamentoValidado.complexidade,
        orcamentoValidado.localizacao,
        JSON.stringify(orcamentoValidado.disciplinas),
        JSON.stringify(orcamentoValidado.composicaoFinanceira),
        JSON.stringify(orcamentoValidado.cronograma),
        JSON.stringify(orcamentoValidado.proposta),
        briefingId,
        orcamentoValidado.clienteId,
        escritorioId,
        userId,
        JSON.stringify(orcamentoValidado.dadosExtraidos)
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('❌ [ORCAMENTO-V2] Erro ao salvar:', error);
      throw new AppError(
        'Erro ao salvar orçamento no banco de dados',
        500,
        'ORCAMENTO_SAVE_ERROR'
      );
    }
  }

  /**
   * 📝 Atualizar status do briefing
   */
  async atualizarStatusBriefing(briefingId, escritorioId) {
    const client = getClient();
    
    await client.query(`
      UPDATE briefings 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2::uuid AND escritorio_id = $3::uuid
    `, ['ORCAMENTO_ELABORACAO', briefingId, escritorioId]);
  }

  /**
   * 🔢 Gerar código único para orçamento
   */
  gerarCodigoOrcamento() {
    const ano = new Date().getFullYear().toString().substring(2);
    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `ORC-V2-${ano}${mes}-${timestamp}-${random}`;
  }

  /**
   * 📊 Listar briefings disponíveis para orçamento
   */
  async listarBriefingsDisponiveis(escritorioId) {
    const client = getClient();
    
    try {
      const result = await client.query(`
        SELECT 
          b.id,
          b.nome_projeto as "nomeProjeto",
          b.status,
          b.progresso,
          b.disciplina,
          b.area,
          b.tipologia,
          b.created_at as "createdAt",
          b.updated_at as "updatedAt",
          c.nome as cliente_nome,
          COUNT(o.id) as total_orcamentos
        FROM briefings b
        LEFT JOIN clientes c ON b.cliente_id::text = c.id
        LEFT JOIN orcamentos o ON b.id = o.briefing_id AND o.deleted_at IS NULL
        WHERE b.escritorio_id = $1 
          AND b.deleted_at IS NULL
          AND b.status IN ('CONCLUIDO', 'APROVADO', 'EM_ANDAMENTO')
        GROUP BY b.id, b.nome_projeto, b.status, b.progresso, b.disciplina, b.area, b.tipologia, b.created_at, b.updated_at, c.nome
        HAVING COUNT(o.id) = 0
        ORDER BY b.updated_at DESC
      `, [escritorioId]);

      const briefingsDisponiveis = result.rows.map(row => ({
        id: row.id,
        nomeProjeto: row.nomeProjeto,
        status: row.status,
        progresso: row.progresso,
        disciplina: row.disciplina,
        area: row.area,
        tipologia: row.tipologia,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        cliente: {
          nome: row.cliente_nome
        },
        podeGerarOrcamento: true
      }));

      return {
        success: true,
        message: 'Briefings disponíveis carregados com sucesso',
        data: {
          briefings: briefingsDisponiveis,
          total: briefingsDisponiveis.length
        }
      };
    } catch (error) {
      console.error('❌ [ORCAMENTO-V2] Erro ao listar briefings:', error);
      throw new AppError(
        'Erro ao carregar briefings disponíveis',
        500,
        'BRIEFINGS_LIST_ERROR'
      );
    }
  }

  /**
   * 🔍 Buscar orçamento por ID
   */
  async buscarOrcamentoPorId(orcamentoId, escritorioId) {
    const client = getClient();
    
    try {
      // Verificar se é UUID ou ID numérico
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orcamentoId);
      
      let query, params;
      
      if (isUUID) {
        // Busca por UUID
        query = `
          SELECT 
            o.*,
            b.nome_projeto as briefing_nome,
            c.nome as cliente_nome,
            u.nome as responsavel_nome
          FROM orcamentos o
          LEFT JOIN briefings b ON o.briefing_id = b.id
          LEFT JOIN clientes c ON o.cliente_id::text = c.id
          LEFT JOIN users u ON o.responsavel_id = u.id
          WHERE o.id = $1::uuid 
            AND o.escritorio_id = $2::uuid
            AND o.deleted_at IS NULL
        `;
        params = [orcamentoId, escritorioId];
      } else {
        // Busca por ID numérico
        query = `
          SELECT 
            o.*,
            b.nome_projeto as briefing_nome,
            c.nome as cliente_nome,
            u.nome as responsavel_nome
          FROM orcamentos o
          LEFT JOIN briefings b ON o.briefing_id = b.id
          LEFT JOIN clientes c ON o.cliente_id::text = c.id
          LEFT JOIN users u ON o.responsavel_id = u.id
          WHERE o.id = $1::integer 
            AND o.escritorio_id = $2::uuid
            AND o.deleted_at IS NULL
        `;
        params = [parseInt(orcamentoId), escritorioId];
      }

      const result = await client.query(query, params);

      if (result.rows.length === 0) {
        throw new AppError(
          'Orçamento não encontrado',
          404,
          'ORCAMENTO_NOT_FOUND'
        );
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ [ORCAMENTO-V2] Erro ao buscar orçamento:', error);
      throw new AppError(
        'Erro ao buscar orçamento',
        500,
        'ORCAMENTO_FETCH_ERROR'
      );
    }
  }
}

module.exports = new OrcamentoService();