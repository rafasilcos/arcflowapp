/**
 * REALISTIC PRICING ENGINE - ARCFLOW
 * 
 * Engine de precificação com valores REALISTAS do mercado brasileiro
 * Substitui os valores absurdos por preços condizentes com a realidade AEC
 */

import { Pool } from 'pg';
import { logger } from '../config/logger';

export interface PricingRequest {
  briefingId: string;
  tipologia: string;
  area: number;
  complexidade?: string;
  disciplinas?: string[];
  caracteristicasEspeciais?: string[];
  localizacao?: string;
}

export interface PricingResult {
  valorTotal: number;
  valorPorM2: number;
  disciplinas: DisciplinaPricing[];
  fatoresAplicados: FatorComplexidade[];
  composicaoFinanceira: ComposicaoFinanceira;
  validacao: ValidationResult;
  comparacaoMercado: MarketComparison;
}

export interface DisciplinaPricing {
  nome: string;
  codigo: string;
  valorMinimo: number;
  valorMaximo: number;
  valorCalculado: number;
  valorPorM2: number;
  obrigatoria: boolean;
}

export interface FatorComplexidade {
  nome: string;
  tipo: 'MULTIPLIER' | 'PERCENTAGE';
  valor: number;
  impacto: number;
  justificativa: string;
}

export interface ComposicaoFinanceira {
  custoBase: number;
  fatoresComplexidade: number;
  margem: number;
  impostos: number;
  total: number;
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  marketPosition: 'BELOW' | 'WITHIN' | 'ABOVE';
}

export interface MarketComparison {
  valorMinimo: number;
  valorMaximo: number;
  valorMedio: number;
  posicaoPercentil: number;
  observacoes: string[];
}

export class RealisticPricingEngine {
  private pool: Pool;
  
  // Configurações do mercado brasileiro
  private readonly MARKET_CONFIG = {
    // Margens típicas do mercado AEC
    MARGEM_MINIMA: 0.15,      // 15%
    MARGEM_PADRAO: 0.25,      // 25%
    MARGEM_MAXIMA: 0.40,      // 40%
    
    // Impostos e custos indiretos
    IMPOSTOS: 0.15,           // 15% (Simples Nacional médio)
    CUSTOS_INDIRETOS: 0.10,   // 10% (impressões, plotagens, etc.)
    
    // Limites de validação
    VALOR_MINIMO_M2: 50,      // R$ 50/m² mínimo absoluto
    VALOR_MAXIMO_M2: 500,     // R$ 500/m² máximo absoluto
    
    // Multiplicadores regionais
    MULTIPLICADORES_REGIAO: {
      'SAO_PAULO': 1.2,
      'RIO_JANEIRO': 1.15,
      'BRASILIA': 1.1,
      'BELO_HORIZONTE': 1.05,
      'INTERIOR': 1.0,
      'NORDESTE': 0.9,
      'SUL': 1.05
    }
  };

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Calcula orçamento realista baseado nos dados do briefing
   */
  async calculateRealisticBudget(request: PricingRequest): Promise<PricingResult> {
    try {
      logger.info('💰 Calculando orçamento realista', { briefingId: request.briefingId });

      // 1. Validar dados de entrada
      this.validateRequest(request);

      // 2. Determinar complexidade se não fornecida
      const complexidade = request.complexidade || await this.determineComplexity(request);

      // 3. Buscar preços base das disciplinas
      const disciplinas = await this.getDisciplinePricing(request.tipologia, complexidade, request.disciplinas);

      // 4. Aplicar fatores de complexidade
      const fatoresAplicados = await this.applyComplexityFactors(request.caracteristicasEspeciais || [], request.tipologia);

      // 5. Calcular multiplicador regional
      const multiplicadorRegional = this.getRegionalMultiplier(request.localizacao);

      // 6. Calcular valores finais
      const custoBase = this.calculateBaseCost(disciplinas, request.area);
      const impactoFatores = this.calculateComplexityImpact(custoBase, fatoresAplicados);
      const custoComFatores = custoBase + impactoFatores;
      const custoComRegiao = custoComFatores * multiplicadorRegional;

      // 7. Aplicar composição financeira
      const composicaoFinanceira = this.calculateFinancialComposition(custoComRegiao);

      // 8. Validar resultado
      const validacao = this.validateResult(composicaoFinanceira.total, request.area, request.tipologia);

      // 9. Comparar com mercado
      const comparacaoMercado = await this.getMarketComparison(request.tipologia, request.area, composicaoFinanceira.total);

      const result: PricingResult = {
        valorTotal: Math.round(composicaoFinanceira.total),
        valorPorM2: Math.round(composicaoFinanceira.total / request.area),
        disciplinas,
        fatoresAplicados,
        composicaoFinanceira,
        validacao,
        comparacaoMercado
      };

      logger.info('✅ Orçamento realista calculado', {
        briefingId: request.briefingId,
        valorTotal: result.valorTotal,
        valorPorM2: result.valorPorM2,
        isValid: validacao.isValid
      });

      return result;

    } catch (error) {
      logger.error('❌ Erro no cálculo do orçamento realista:', error);
      throw new Error(`Falha no cálculo do orçamento: ${error.message}`);
    }
  }

  /**
   * Busca preços das disciplinas no banco de dados
   */
  private async getDisciplinePricing(tipologia: string, complexidade: string, disciplinasSolicitadas?: string[]): Promise<DisciplinaPricing[]> {
    // Disciplinas padrão por tipologia
    const disciplinasPadrao = this.getDefaultDisciplines(tipologia);
    const disciplinasParaBuscar = disciplinasSolicitadas || disciplinasPadrao;

    const query = `
      SELECT tipologia, disciplina, complexidade, price_min, price_max, price_average
      FROM pricing_base 
      WHERE tipologia = $1 
        AND complexidade = $2 
        AND disciplina = ANY($3)
        AND active = true
      ORDER BY disciplina
    `;

    const result = await this.pool.query(query, [tipologia.toUpperCase(), complexidade.toUpperCase(), disciplinasParaBuscar]);

    return result.rows.map(row => ({
      nome: this.getDisciplineName(row.disciplina),
      codigo: row.disciplina,
      valorMinimo: parseFloat(row.price_min),
      valorMaximo: parseFloat(row.price_max),
      valorCalculado: parseFloat(row.price_average),
      valorPorM2: parseFloat(row.price_average),
      obrigatoria: this.isDisciplineRequired(row.disciplina, tipologia)
    }));
  }

  /**
   * Aplica fatores de complexidade baseado nas características especiais
   */
  private async applyComplexityFactors(caracteristicas: string[], tipologia: string): Promise<FatorComplexidade[]> {
    if (caracteristicas.length === 0) return [];

    const query = `
      SELECT name, factor_type, value, description
      FROM complexity_factors
      WHERE active = true
        AND $1 = ANY(applies_to)
        AND (
          ${caracteristicas.map((_, index) => `LOWER(name) LIKE LOWER($${index + 2})`).join(' OR ')}
        )
    `;

    const params = [tipologia.toUpperCase(), ...caracteristicas.map(c => `%${c}%`)];
    const result = await this.pool.query(query, params);

    return result.rows.map(row => ({
      nome: row.name,
      tipo: row.factor_type,
      valor: parseFloat(row.value),
      impacto: 0, // Será calculado depois
      justificativa: row.description
    }));
  }

  /**
   * Calcula custo base somando todas as disciplinas
   */
  private calculateBaseCost(disciplinas: DisciplinaPricing[], area: number): number {
    return disciplinas.reduce((total, disciplina) => {
      return total + (disciplina.valorCalculado * area);
    }, 0);
  }

  /**
   * Calcula impacto dos fatores de complexidade
   */
  private calculateComplexityImpact(custoBase: number, fatores: FatorComplexidade[]): number {
    let impactoTotal = 0;

    fatores.forEach(fator => {
      let impacto = 0;
      
      if (fator.tipo === 'PERCENTAGE') {
        impacto = custoBase * fator.valor;
      } else if (fator.tipo === 'MULTIPLIER') {
        impacto = custoBase * (fator.valor - 1);
      }
      
      fator.impacto = impacto;
      impactoTotal += impacto;
    });

    return impactoTotal;
  }

  /**
   * Calcula composição financeira final
   */
  private calculateFinancialComposition(custoTecnico: number): ComposicaoFinanceira {
    const custosIndiretos = custoTecnico * this.MARKET_CONFIG.CUSTOS_INDIRETOS;
    const subtotal = custoTecnico + custosIndiretos;
    const margem = subtotal * this.MARKET_CONFIG.MARGEM_PADRAO;
    const impostos = (subtotal + margem) * this.MARKET_CONFIG.IMPOSTOS;
    const total = subtotal + margem + impostos;

    return {
      custoBase: custoTecnico,
      fatoresComplexidade: custosIndiretos,
      margem,
      impostos,
      total
    };
  }

  /**
   * Valida se o resultado está dentro de parâmetros aceitáveis
   */
  private validateResult(valorTotal: number, area: number, tipologia: string): ValidationResult {
    const valorPorM2 = valorTotal / area;
    const warnings: string[] = [];
    const errors: string[] = [];

    // Validações básicas
    if (valorPorM2 < this.MARKET_CONFIG.VALOR_MINIMO_M2) {
      errors.push(`Valor por m² muito baixo: R$ ${valorPorM2.toFixed(2)} (mínimo: R$ ${this.MARKET_CONFIG.VALOR_MINIMO_M2})`);
    }

    if (valorPorM2 > this.MARKET_CONFIG.VALOR_MAXIMO_M2) {
      errors.push(`Valor por m² muito alto: R$ ${valorPorM2.toFixed(2)} (máximo: R$ ${this.MARKET_CONFIG.VALOR_MAXIMO_M2})`);
    }

    // Validações por tipologia
    const faixasEsperadas = this.getExpectedRanges(tipologia);
    let marketPosition: 'BELOW' | 'WITHIN' | 'ABOVE' = 'WITHIN';

    if (valorPorM2 < faixasEsperadas.min) {
      warnings.push(`Valor abaixo da faixa esperada para ${tipologia}: R$ ${faixasEsperadas.min}-${faixasEsperadas.max}/m²`);
      marketPosition = 'BELOW';
    } else if (valorPorM2 > faixasEsperadas.max) {
      warnings.push(`Valor acima da faixa esperada para ${tipologia}: R$ ${faixasEsperadas.min}-${faixasEsperadas.max}/m²`);
      marketPosition = 'ABOVE';
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
      marketPosition
    };
  }

  /**
   * Obtém comparação com mercado
   */
  private async getMarketComparison(tipologia: string, area: number, valorCalculado: number): Promise<MarketComparison> {
    // Buscar faixas de preços para a tipologia
    const query = `
      SELECT 
        MIN(price_min) as valor_minimo,
        MAX(price_max) as valor_maximo,
        AVG(price_average) as valor_medio
      FROM pricing_base 
      WHERE tipologia = $1 AND active = true
    `;

    const result = await this.pool.query(query, [tipologia.toUpperCase()]);
    const row = result.rows[0];

    const valorMinimo = parseFloat(row.valor_minimo) * area;
    const valorMaximo = parseFloat(row.valor_maximo) * area;
    const valorMedio = parseFloat(row.valor_medio) * area;

    // Calcular posição percentil
    const posicaoPercentil = ((valorCalculado - valorMinimo) / (valorMaximo - valorMinimo)) * 100;

    const observacoes: string[] = [];
    if (posicaoPercentil < 25) {
      observacoes.push('Orçamento no quartil inferior do mercado');
    } else if (posicaoPercentil > 75) {
      observacoes.push('Orçamento no quartil superior do mercado');
    } else {
      observacoes.push('Orçamento dentro da faixa normal do mercado');
    }

    return {
      valorMinimo: Math.round(valorMinimo),
      valorMaximo: Math.round(valorMaximo),
      valorMedio: Math.round(valorMedio),
      posicaoPercentil: Math.round(posicaoPercentil),
      observacoes
    };
  }

  // ===== MÉTODOS AUXILIARES =====

  private validateRequest(request: PricingRequest): void {
    if (!request.tipologia) throw new Error('Tipologia é obrigatória');
    if (!request.area || request.area <= 0) throw new Error('Área deve ser maior que zero');
    if (request.area > 100000) throw new Error('Área muito grande (máximo 100.000m²)');
  }

  private async determineComplexity(request: PricingRequest): Promise<string> {
    // Lógica simples para determinar complexidade
    if (request.area > 1000 || (request.caracteristicasEspeciais && request.caracteristicasEspeciais.length > 3)) {
      return 'COMPLEXO';
    } else if (request.area > 300 || (request.caracteristicasEspeciais && request.caracteristicasEspeciais.length > 1)) {
      return 'MEDIO';
    }
    return 'SIMPLES';
  }

  private getDefaultDisciplines(tipologia: string): string[] {
    const disciplinasPorTipologia: Record<string, string[]> = {
      'RESIDENCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'COMERCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'INDUSTRIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'INSTITUCIONAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'URBANISTICO': ['ARQUITETURA', 'PAISAGISMO']
    };

    return disciplinasPorTipologia[tipologia.toUpperCase()] || ['ARQUITETURA'];
  }

  private getDisciplineName(codigo: string): string {
    const nomes: Record<string, string> = {
      'ARQUITETURA': 'Projeto de Arquitetura',
      'ESTRUTURAL': 'Projeto Estrutural',
      'INSTALACOES_ELETRICAS': 'Instalações Elétricas',
      'INSTALACOES_HIDRAULICAS': 'Instalações Hidráulicas',
      'PAISAGISMO': 'Projeto de Paisagismo'
    };
    return nomes[codigo] || codigo;
  }

  private isDisciplineRequired(disciplina: string, tipologia: string): boolean {
    const obrigatorias = this.getDefaultDisciplines(tipologia);
    return obrigatorias.includes(disciplina);
  }

  private getRegionalMultiplier(localizacao?: string): number {
    if (!localizacao) return 1.0;

    const loc = localizacao.toUpperCase();
    
    if (loc.includes('SÃO PAULO') || loc.includes('SAO PAULO')) return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.SAO_PAULO;
    if (loc.includes('RIO DE JANEIRO')) return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.RIO_JANEIRO;
    if (loc.includes('BRASÍLIA') || loc.includes('BRASILIA')) return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.BRASILIA;
    if (loc.includes('BELO HORIZONTE')) return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.BELO_HORIZONTE;
    if (loc.includes('SUL') || loc.includes('PORTO ALEGRE') || loc.includes('CURITIBA')) return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.SUL;
    if (loc.includes('NORDESTE') || loc.includes('RECIFE') || loc.includes('SALVADOR')) return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.NORDESTE;
    
    return this.MARKET_CONFIG.MULTIPLICADORES_REGIAO.INTERIOR;
  }

  private getExpectedRanges(tipologia: string): { min: number; max: number } {
    const faixas: Record<string, { min: number; max: number }> = {
      'RESIDENCIAL': { min: 80, max: 400 },
      'COMERCIAL': { min: 90, max: 400 },
      'INDUSTRIAL': { min: 40, max: 200 },
      'INSTITUCIONAL': { min: 100, max: 400 },
      'URBANISTICO': { min: 30, max: 150 }
    };

    return faixas[tipologia.toUpperCase()] || { min: 50, max: 300 };
  }

  /**
   * Método público para teste rápido
   */
  async quickPriceEstimate(tipologia: string, area: number, complexidade: string = 'MEDIO'): Promise<{ min: number; max: number; average: number }> {
    const query = `
      SELECT 
        SUM(price_min) as total_min,
        SUM(price_max) as total_max,
        SUM(price_average) as total_avg
      FROM pricing_base 
      WHERE tipologia = $1 AND complexidade = $2 AND active = true
    `;

    const result = await this.pool.query(query, [tipologia.toUpperCase(), complexidade.toUpperCase()]);
    const row = result.rows[0];

    return {
      min: Math.round(parseFloat(row.total_min) * area),
      max: Math.round(parseFloat(row.total_max) * area),
      average: Math.round(parseFloat(row.total_avg) * area)
    };
  }
}

export default RealisticPricingEngine;