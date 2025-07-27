/**
 * Configuration Management Service
 * Gerencia configurações de orçamento por escritório
 */

import { Client } from 'pg';
import Redis from 'ioredis';

// Interfaces para configurações
export interface ConfiguracaoEscritorio {
  id?: string;
  escritorioId: string;
  tabelaPrecos: TabelaPrecos;
  multiplicadores: MultiplicadoresTipologia;
  parametrosComplexidade: ParametrosComplexidade;
  configuracoesPadrao: ConfiguracoesPadrao;
  ativo: boolean;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export interface TabelaPrecos {
  arquitetura: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
  estrutural: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
  instalacoes: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
  paisagismo: {
    valor_hora_senior: number;
    valor_hora_pleno: number;
    valor_hora_junior: number;
    valor_hora_estagiario: number;
  };
}

export interface MultiplicadoresTipologia {
  residencial: {
    unifamiliar: number;
    multifamiliar: number;
    condominio: number;
  };
  comercial: {
    escritorio: number;
    loja: number;
    hotel: number;
    shopping: number;
  };
  industrial: {
    fabrica: number;
    galpao: number;
    centro_logistico: number;
  };
  institucional: {
    escola: number;
    hospital: number;
    templo: number;
  };
}

export interface ParametrosComplexidade {
  baixa: {
    multiplicador: number;
    horas_base_m2: number;
  };
  media: {
    multiplicador: number;
    horas_base_m2: number;
  };
  alta: {
    multiplicador: number;
    horas_base_m2: number;
  };
  muito_alta: {
    multiplicador: number;
    horas_base_m2: number;
  };
}

export interface ConfiguracoesPadrao {
  margem_lucro: number;
  impostos: number;
  custos_indiretos: number;
  contingencia: number;
  prazo_validade_orcamento: number; // dias
  moeda: string;
}

export interface ValidacaoConfiguracao {
  valida: boolean;
  erros: string[];
  avisos: string[];
}

export class ConfigurationManagementService {
  private db: Client;
  private redis: Redis;
  private cachePrefix = 'config:orcamento:';
  private cacheTTL = 3600; // 1 hora

  constructor(db: Client, redis: Redis) {
    this.db = db;
    this.redis = redis;
  }

  /**
   * Obtém configuração de orçamento para um escritório
   */
  async obterConfiguracaoEscritorio(escritorioId: string): Promise<ConfiguracaoEscritorio> {
    console.log('🔧 Obtendo configuração para escritório:', escritorioId);

    try {
      // Tentar buscar no cache primeiro
      const cacheKey = `${this.cachePrefix}${escritorioId}`;
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        console.log('✅ Configuração encontrada no cache');
        return JSON.parse(cached);
      }

      // Buscar no banco de dados
      const result = await this.db.query(`
        SELECT 
          id,
          escritorio_id,
          tabela_precos,
          multiplicadores_tipologia,
          parametros_complexidade,
          configuracoes_gerais,
          ativo,
          created_at,
          updated_at
        FROM configuracoes_orcamento 
        WHERE escritorio_id = $1 AND ativo = true
        ORDER BY updated_at DESC
        LIMIT 1
      `, [escritorioId]);

      let configuracao: ConfiguracaoEscritorio;

      if (result.rows.length === 0) {
        console.log('⚠️ Configuração não encontrada. Criando configuração padrão...');
        configuracao = await this.criarConfiguracaoPadrao(escritorioId);
      } else {
        const row = result.rows[0];
        configuracao = {
          id: row.id,
          escritorioId: row.escritorio_id,
          tabelaPrecos: row.tabela_precos,
          multiplicadores: row.multiplicadores_tipologia,
          parametrosComplexidade: row.parametros_complexidade,
          configuracoesPadrao: row.configuracoes_gerais,
          ativo: row.ativo,
          criadoEm: row.created_at,
          atualizadoEm: row.updated_at
        };
      }

      // Salvar no cache
      await this.redis.setex(cacheKey, this.cacheTTL, JSON.stringify(configuracao));
      
      console.log('✅ Configuração obtida com sucesso');
      return configuracao;

    } catch (error) {
      console.error('❌ Erro ao obter configuração:', error);
      throw new Error(`Falha ao obter configuração do escritório: ${error.message}`);
    }
  }

  /**
   * Atualiza configuração de orçamento para um escritório
   */
  async atualizarConfiguracaoEscritorio(
    escritorioId: string, 
    configuracao: Partial<ConfiguracaoEscritorio>
  ): Promise<ConfiguracaoEscritorio> {
    console.log('🔧 Atualizando configuração para escritório:', escritorioId);

    try {
      // Validar configuração
      const validacao = this.validarConfiguracao(configuracao);
      if (!validacao.valida) {
        throw new Error(`Configuração inválida: ${validacao.erros.join(', ')}`);
      }

      // Verificar se já existe configuração
      const existente = await this.db.query(`
        SELECT id FROM configuracoes_orcamento 
        WHERE escritorio_id = $1 AND ativo = true
      `, [escritorioId]);

      let result;

      if (existente.rows.length === 0) {
        // Criar nova configuração
        result = await this.db.query(`
          INSERT INTO configuracoes_orcamento (
            escritorio_id,
            tabela_precos,
            multiplicadores_tipologia,
            parametros_complexidade,
            configuracoes_gerais,
            ativo
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [
          escritorioId,
          JSON.stringify(configuracao.tabelaPrecos),
          JSON.stringify(configuracao.multiplicadores),
          JSON.stringify(configuracao.parametrosComplexidade),
          JSON.stringify(configuracao.configuracoesPadrao),
          true
        ]);
      } else {
        // Atualizar configuração existente
        result = await this.db.query(`
          UPDATE configuracoes_orcamento 
          SET 
            tabela_precos = $2,
            multiplicadores_tipologia = $3,
            parametros_complexidade = $4,
            configuracoes_gerais = $5,
            updated_at = CURRENT_TIMESTAMP
          WHERE escritorio_id = $1 AND ativo = true
          RETURNING *
        `, [
          escritorioId,
          JSON.stringify(configuracao.tabelaPrecos),
          JSON.stringify(configuracao.multiplicadores),
          JSON.stringify(configuracao.parametrosComplexidade),
          JSON.stringify(configuracao.configuracoesPadrao)
        ]);
      }

      const row = result.rows[0];
      const configuracaoAtualizada: ConfiguracaoEscritorio = {
        id: row.id,
        escritorioId: row.escritorio_id,
        tabelaPrecos: row.tabela_precos,
        multiplicadores: row.multiplicadores_tipologia,
        parametrosComplexidade: row.parametros_complexidade,
        configuracoesPadrao: row.configuracoes_gerais,
        ativo: row.ativo,
        criadoEm: row.created_at,
        atualizadoEm: row.updated_at
      };

      // Limpar cache
      const cacheKey = `${this.cachePrefix}${escritorioId}`;
      await this.redis.del(cacheKey);

      // Salvar nova configuração no cache
      await this.redis.setex(cacheKey, this.cacheTTL, JSON.stringify(configuracaoAtualizada));

      console.log('✅ Configuração atualizada com sucesso');
      return configuracaoAtualizada;

    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
      throw new Error(`Falha ao atualizar configuração: ${error.message}`);
    }
  }

  /**
   * Reseta configuração para valores padrão
   */
  async resetarConfiguracaoPadrao(escritorioId: string): Promise<ConfiguracaoEscritorio> {
    console.log('🔄 Resetando configuração para valores padrão:', escritorioId);

    try {
      // Desativar configuração atual
      await this.db.query(`
        UPDATE configuracoes_orcamento 
        SET ativo = false 
        WHERE escritorio_id = $1
      `, [escritorioId]);

      // Criar nova configuração padrão
      const configuracaoPadrao = await this.criarConfiguracaoPadrao(escritorioId);

      // Limpar cache
      const cacheKey = `${this.cachePrefix}${escritorioId}`;
      await this.redis.del(cacheKey);

      console.log('✅ Configuração resetada com sucesso');
      return configuracaoPadrao;

    } catch (error) {
      console.error('❌ Erro ao resetar configuração:', error);
      throw new Error(`Falha ao resetar configuração: ${error.message}`);
    }
  }

  /**
   * Lista todas as configurações (para administradores)
   */
  async listarConfiguracoes(limite: number = 50, offset: number = 0): Promise<{
    configuracoes: ConfiguracaoEscritorio[];
    total: number;
  }> {
    console.log('📋 Listando configurações de orçamento...');

    try {
      // Contar total
      const countResult = await this.db.query(`
        SELECT COUNT(*) as total 
        FROM configuracoes_orcamento 
        WHERE ativo = true
      `);

      // Buscar configurações
      const result = await this.db.query(`
        SELECT 
          co.*,
          e.nome as escritorio_nome
        FROM configuracoes_orcamento co
        JOIN escritorios e ON co.escritorio_id = e.id
        WHERE co.ativo = true
        ORDER BY co.updated_at DESC
        LIMIT $1 OFFSET $2
      `, [limite, offset]);

      const configuracoes = result.rows.map(row => ({
        id: row.id,
        escritorioId: row.escritorio_id,
        tabelaPrecos: row.tabela_precos,
        multiplicadores: row.multiplicadores_tipologia,
        parametrosComplexidade: row.parametros_complexidade,
        configuracoesPadrao: row.configuracoes_gerais,
        ativo: row.ativo,
        criadoEm: row.created_at,
        atualizadoEm: row.updated_at,
        escritorioNome: row.escritorio_nome
      }));

      console.log(`✅ ${configuracoes.length} configurações encontradas`);

      return {
        configuracoes,
        total: parseInt(countResult.rows[0].total)
      };

    } catch (error) {
      console.error('❌ Erro ao listar configurações:', error);
      throw new Error(`Falha ao listar configurações: ${error.message}`);
    }
  }

  /**
   * Cria configuração padrão para um escritório
   */
  private async criarConfiguracaoPadrao(escritorioId: string): Promise<ConfiguracaoEscritorio> {
    const configuracaoPadrao: ConfiguracaoEscritorio = {
      escritorioId,
      tabelaPrecos: this.obterTabelaPrecosPadrao(),
      multiplicadores: this.obterMultiplicadoresPadrao(),
      parametrosComplexidade: this.obterParametrosComplexidadePadrao(),
      configuracoesPadrao: this.obterConfiguracoesPadrao(),
      ativo: true
    };

    // Salvar no banco
    const result = await this.db.query(`
      INSERT INTO configuracoes_orcamento (
        escritorio_id,
        tabela_precos,
        multiplicadores_tipologia,
        parametros_complexidade,
        configuracoes_gerais,
        ativo
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      escritorioId,
      JSON.stringify(configuracaoPadrao.tabelaPrecos),
      JSON.stringify(configuracaoPadrao.multiplicadores),
      JSON.stringify(configuracaoPadrao.parametrosComplexidade),
      JSON.stringify(configuracaoPadrao.configuracoesPadrao),
      true
    ]);

    const row = result.rows[0];
    return {
      id: row.id,
      escritorioId: row.escritorio_id,
      tabelaPrecos: row.tabela_precos,
      multiplicadores: row.multiplicadores_tipologia,
      parametrosComplexidade: row.parametros_complexidade,
      configuracoesPadrao: row.configuracoes_gerais,
      ativo: row.ativo,
      criadoEm: row.created_at,
      atualizadoEm: row.updated_at
    };
  }  /**
  
 * Valida configuração de orçamento
   */
  private validarConfiguracao(configuracao: Partial<ConfiguracaoEscritorio>): ValidacaoConfiguracao {
    const erros: string[] = [];
    const avisos: string[] = [];

    // Validar tabela de preços
    if (configuracao.tabelaPrecos) {
      const tabela = configuracao.tabelaPrecos;
      
      // Validar valores mínimos
      Object.keys(tabela).forEach(disciplina => {
        const precos = tabela[disciplina as keyof TabelaPrecos];
        
        if (precos.valor_hora_senior < 50) {
          erros.push(`Valor hora sênior muito baixo para ${disciplina}: R$ ${precos.valor_hora_senior}`);
        }
        
        if (precos.valor_hora_pleno < 30) {
          erros.push(`Valor hora pleno muito baixo para ${disciplina}: R$ ${precos.valor_hora_pleno}`);
        }
        
        if (precos.valor_hora_junior < 20) {
          erros.push(`Valor hora júnior muito baixo para ${disciplina}: R$ ${precos.valor_hora_junior}`);
        }
        
        if (precos.valor_hora_estagiario < 10) {
          erros.push(`Valor hora estagiário muito baixo para ${disciplina}: R$ ${precos.valor_hora_estagiario}`);
        }

        // Validar hierarquia de valores
        if (precos.valor_hora_senior <= precos.valor_hora_pleno) {
          avisos.push(`Valor sênior deveria ser maior que pleno em ${disciplina}`);
        }
        
        if (precos.valor_hora_pleno <= precos.valor_hora_junior) {
          avisos.push(`Valor pleno deveria ser maior que júnior em ${disciplina}`);
        }
        
        if (precos.valor_hora_junior <= precos.valor_hora_estagiario) {
          avisos.push(`Valor júnior deveria ser maior que estagiário em ${disciplina}`);
        }
      });
    }

    // Validar multiplicadores
    if (configuracao.multiplicadores) {
      const mult = configuracao.multiplicadores;
      
      Object.keys(mult).forEach(tipologia => {
        const multiplicadores = mult[tipologia as keyof MultiplicadoresTipologia];
        
        Object.keys(multiplicadores).forEach(subtipo => {
          const valor = multiplicadores[subtipo as keyof typeof multiplicadores];
          
          if (valor < 0.1 || valor > 5.0) {
            erros.push(`Multiplicador fora do intervalo válido (0.1-5.0): ${tipologia}.${subtipo} = ${valor}`);
          }
        });
      });
    }

    // Validar parâmetros de complexidade
    if (configuracao.parametrosComplexidade) {
      const params = configuracao.parametrosComplexidade;
      
      Object.keys(params).forEach(nivel => {
        const param = params[nivel as keyof ParametrosComplexidade];
        
        if (param.multiplicador < 0.1 || param.multiplicador > 3.0) {
          erros.push(`Multiplicador de complexidade fora do intervalo (0.1-3.0): ${nivel} = ${param.multiplicador}`);
        }
        
        if (param.horas_base_m2 < 0.1 || param.horas_base_m2 > 5.0) {
          erros.push(`Horas base por m² fora do intervalo (0.1-5.0): ${nivel} = ${param.horas_base_m2}`);
        }
      });
    }

    // Validar configurações padrão
    if (configuracao.configuracoesPadrao) {
      const config = configuracao.configuracoesPadrao;
      
      if (config.margem_lucro < 0 || config.margem_lucro > 1) {
        erros.push(`Margem de lucro deve estar entre 0 e 1: ${config.margem_lucro}`);
      }
      
      if (config.impostos < 0 || config.impostos > 0.5) {
        erros.push(`Impostos devem estar entre 0 e 0.5: ${config.impostos}`);
      }
      
      if (config.custos_indiretos < 0 || config.custos_indiretos > 0.3) {
        erros.push(`Custos indiretos devem estar entre 0 e 0.3: ${config.custos_indiretos}`);
      }
      
      if (config.contingencia < 0 || config.contingencia > 0.2) {
        erros.push(`Contingência deve estar entre 0 e 0.2: ${config.contingencia}`);
      }
      
      if (config.prazo_validade_orcamento < 7 || config.prazo_validade_orcamento > 365) {
        erros.push(`Prazo de validade deve estar entre 7 e 365 dias: ${config.prazo_validade_orcamento}`);
      }
    }

    return {
      valida: erros.length === 0,
      erros,
      avisos
    };
  }

  /**
   * Obtém tabela de preços padrão
   */
  private obterTabelaPrecosPadrao(): TabelaPrecos {
    return {
      arquitetura: {
        valor_hora_senior: 180,
        valor_hora_pleno: 120,
        valor_hora_junior: 80,
        valor_hora_estagiario: 40
      },
      estrutural: {
        valor_hora_senior: 200,
        valor_hora_pleno: 140,
        valor_hora_junior: 90,
        valor_hora_estagiario: 45
      },
      instalacoes: {
        valor_hora_senior: 160,
        valor_hora_pleno: 110,
        valor_hora_junior: 70,
        valor_hora_estagiario: 35
      },
      paisagismo: {
        valor_hora_senior: 140,
        valor_hora_pleno: 100,
        valor_hora_junior: 60,
        valor_hora_estagiario: 30
      }
    };
  }

  /**
   * Obtém multiplicadores padrão por tipologia
   */
  private obterMultiplicadoresPadrao(): MultiplicadoresTipologia {
    return {
      residencial: {
        unifamiliar: 1.0,
        multifamiliar: 1.3,
        condominio: 1.5
      },
      comercial: {
        escritorio: 1.2,
        loja: 1.1,
        hotel: 1.8,
        shopping: 2.0
      },
      industrial: {
        fabrica: 1.6,
        galpao: 1.2,
        centro_logistico: 1.4
      },
      institucional: {
        escola: 1.3,
        hospital: 2.2,
        templo: 1.1
      }
    };
  }

  /**
   * Obtém parâmetros de complexidade padrão
   */
  private obterParametrosComplexidadePadrao(): ParametrosComplexidade {
    return {
      baixa: {
        multiplicador: 0.8,
        horas_base_m2: 0.6
      },
      media: {
        multiplicador: 1.0,
        horas_base_m2: 0.8
      },
      alta: {
        multiplicador: 1.3,
        horas_base_m2: 1.0
      },
      muito_alta: {
        multiplicador: 1.6,
        horas_base_m2: 1.2
      }
    };
  }

  /**
   * Obtém configurações padrão
   */
  private obterConfiguracoesPadrao(): ConfiguracoesPadrao {
    return {
      margem_lucro: 0.25, // 25%
      impostos: 0.15, // 15%
      custos_indiretos: 0.10, // 10%
      contingencia: 0.05, // 5%
      prazo_validade_orcamento: 30, // 30 dias
      moeda: 'BRL'
    };
  }

  /**
   * Limpa cache de configuração
   */
  async limparCache(escritorioId?: string): Promise<void> {
    try {
      if (escritorioId) {
        const cacheKey = `${this.cachePrefix}${escritorioId}`;
        await this.redis.del(cacheKey);
        console.log(`✅ Cache limpo para escritório: ${escritorioId}`);
      } else {
        const keys = await this.redis.keys(`${this.cachePrefix}*`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
          console.log(`✅ Cache limpo para ${keys.length} escritórios`);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }

  /**
   * Obtém estatísticas de uso das configurações
   */
  async obterEstatisticas(): Promise<{
    totalConfiguracoes: number;
    configuracoesPorTipologia: Record<string, number>;
    valoresMedias: {
      margemLucroMedia: number;
      impostosMedia: number;
      custosIndiretosMedia: number;
    };
  }> {
    try {
      // Total de configurações
      const totalResult = await this.db.query(`
        SELECT COUNT(*) as total 
        FROM configuracoes_orcamento 
        WHERE ativo = true
      `);

      // Configurações por tipologia (baseado nos multiplicadores mais usados)
      const tipologiaResult = await this.db.query(`
        SELECT 
          jsonb_object_keys(multiplicadores_tipologia) as tipologia,
          COUNT(*) as quantidade
        FROM configuracoes_orcamento 
        WHERE ativo = true
        GROUP BY tipologia
        ORDER BY quantidade DESC
      `);

      // Valores médios
      const mediasResult = await this.db.query(`
        SELECT 
          AVG((configuracoes_gerais->>'margem_lucro')::numeric) as margem_lucro_media,
          AVG((configuracoes_gerais->>'impostos')::numeric) as impostos_media,
          AVG((configuracoes_gerais->>'custos_indiretos')::numeric) as custos_indiretos_media
        FROM configuracoes_orcamento 
        WHERE ativo = true
      `);

      const configuracoesPorTipologia: Record<string, number> = {};
      tipologiaResult.rows.forEach(row => {
        configuracoesPorTipologia[row.tipologia] = parseInt(row.quantidade);
      });

      const medias = mediasResult.rows[0];

      return {
        totalConfiguracoes: parseInt(totalResult.rows[0].total),
        configuracoesPorTipologia,
        valoresMedias: {
          margemLucroMedia: parseFloat(medias.margem_lucro_media) || 0,
          impostosMedia: parseFloat(medias.impostos_media) || 0,
          custosIndiretosMedia: parseFloat(medias.custos_indiretos_media) || 0
        }
      };

    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw new Error(`Falha ao obter estatísticas: ${error.message}`);
    }
  }
}

// Exportar classe
export default ConfigurationManagementService;