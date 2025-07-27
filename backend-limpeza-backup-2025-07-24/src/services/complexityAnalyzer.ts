/**
 * COMPLEXITY ANALYZER - ARCFLOW
 * 
 * Analisador inteligente de complexidade de projetos
 * Determina automaticamente o nível de complexidade baseado nas respostas do briefing
 */

import { logger } from '../config/logger';

export type ComplexityLevel = 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

export interface ComplexityAnalysis {
  level: ComplexityLevel;
  score: number; // 0-100
  factors: ComplexityFactor[];
  justification: string;
  confidence: number; // 0-1
}

export interface ComplexityFactor {
  name: string;
  category: 'ARCHITECTURAL' | 'STRUCTURAL' | 'TECHNICAL' | 'REGULATORY' | 'SCALE';
  impact: number; // pontos adicionados
  description: string;
  detected: boolean;
}

export interface BriefingData {
  tipologia: string;
  area: number;
  respostas: Record<string, any>;
  caracteristicasEspeciais?: string[];
  orcamento?: number;
  prazo?: number;
}

export class ComplexityAnalyzer {
  
  // Fatores de complexidade por categoria
  private readonly COMPLEXITY_FACTORS: ComplexityFactor[] = [
    // ARQUITETÔNICOS
    {
      name: 'Múltiplos Pavimentos',
      category: 'ARCHITECTURAL',
      impact: 15,
      description: 'Projeto com mais de 2 pavimentos',
      detected: false
    },
    {
      name: 'Geometria Complexa',
      category: 'ARCHITECTURAL',
      impact: 20,
      description: 'Formas irregulares, curvas ou geometria não-ortogonal',
      detected: false
    },
    {
      name: 'Múltiplas Funções',
      category: 'ARCHITECTURAL',
      impact: 12,
      description: 'Projeto com usos mistos ou múltiplas funções',
      detected: false
    },
    {
      name: 'Integração Paisagística',
      category: 'ARCHITECTURAL',
      impact: 8,
      description: 'Projeto integrado com paisagismo complexo',
      detected: false
    },

    // ESTRUTURAIS
    {
      name: 'Grandes Vãos',
      category: 'STRUCTURAL',
      impact: 18,
      description: 'Vãos estruturais superiores a 12m',
      detected: false
    },
    {
      name: 'Estrutura Especial',
      category: 'STRUCTURAL',
      impact: 25,
      description: 'Estruturas metálicas, protendidas ou especiais',
      detected: false
    },
    {
      name: 'Fundação Complexa',
      category: 'STRUCTURAL',
      impact: 15,
      description: 'Terreno problemático ou fundações especiais',
      detected: false
    },
    {
      name: 'Cargas Especiais',
      category: 'STRUCTURAL',
      impact: 12,
      description: 'Cargas elevadas ou equipamentos pesados',
      detected: false
    },

    // TÉCNICOS
    {
      name: 'Automação Predial',
      category: 'TECHNICAL',
      impact: 20,
      description: 'Sistema de automação e controle predial',
      detected: false
    },
    {
      name: 'AVAC Complexo',
      category: 'TECHNICAL',
      impact: 15,
      description: 'Sistema de ar condicionado central ou especial',
      detected: false
    },
    {
      name: 'Instalações Especiais',
      category: 'TECHNICAL',
      impact: 18,
      description: 'Gases medicinais, som, CFTV, etc.',
      detected: false
    },
    {
      name: 'Sustentabilidade',
      category: 'TECHNICAL',
      impact: 22,
      description: 'Certificações ambientais (LEED, AQUA, etc.)',
      detected: false
    },
    {
      name: 'Energia Renovável',
      category: 'TECHNICAL',
      impact: 16,
      description: 'Painéis solares, energia eólica, etc.',
      detected: false
    },

    // REGULATÓRIOS
    {
      name: 'Normas Especiais',
      category: 'REGULATORY',
      impact: 14,
      description: 'Normas específicas (hospitalar, industrial, etc.)',
      detected: false
    },
    {
      name: 'Acessibilidade Completa',
      category: 'REGULATORY',
      impact: 10,
      description: 'NBR 9050 com requisitos especiais',
      detected: false
    },
    {
      name: 'Aprovações Múltiplas',
      category: 'REGULATORY',
      impact: 12,
      description: 'Múltiplos órgãos de aprovação',
      detected: false
    },

    // ESCALA
    {
      name: 'Grande Porte',
      category: 'SCALE',
      impact: 15,
      description: 'Área superior a 1000m²',
      detected: false
    },
    {
      name: 'Projeto Urbano',
      category: 'SCALE',
      impact: 20,
      description: 'Impacto urbano significativo',
      detected: false
    }
  ];

  // Palavras-chave para detecção automática
  private readonly KEYWORDS = {
    GEOMETRIC_COMPLEXITY: ['curva', 'irregular', 'orgânico', 'complexo', 'especial', 'diferenciado'],
    MULTIPLE_FLOORS: ['pavimento', 'andar', 'térreo', 'superior', 'subsolo', 'mezanino'],
    LARGE_SPANS: ['vão', 'livre', 'amplo', 'grande', 'aberto', 'sem pilares'],
    AUTOMATION: ['automação', 'inteligente', 'smart', 'controle', 'sensor', 'automatizado'],
    SUSTAINABILITY: ['sustentável', 'verde', 'leed', 'aqua', 'certificação', 'ambiental'],
    SPECIAL_STRUCTURE: ['metálica', 'protendida', 'especial', 'pré-moldada', 'steel frame'],
    HVAC_COMPLEX: ['central', 'vrf', 'chiller', 'climatização', 'condicionado'],
    SPECIAL_INSTALLATIONS: ['gases', 'medicinal', 'som', 'cftv', 'segurança', 'alarme'],
    ACCESSIBILITY: ['acessibilidade', 'cadeirante', 'nbr 9050', 'rampa', 'elevador'],
    MIXED_USE: ['misto', 'múltiplo', 'comercial', 'residencial', 'escritório'],
    RENEWABLE_ENERGY: ['solar', 'fotovoltaico', 'eólica', 'renovável', 'sustentável']
  };

  /**
   * Analisa a complexidade de um projeto baseado nos dados do briefing
   */
  analyzeComplexity(briefingData: BriefingData): ComplexityAnalysis {
    try {
      logger.info('🔍 Analisando complexidade do projeto', { 
        tipologia: briefingData.tipologia, 
        area: briefingData.area 
      });

      // 1. Resetar detecções
      this.resetFactorDetection();

      // 2. Analisar fatores baseados na área
      this.analyzeScaleFactors(briefingData.area, briefingData.tipologia);

      // 3. Analisar fatores baseados nas respostas
      this.analyzeResponseFactors(briefingData.respostas);

      // 4. Analisar fatores baseados no orçamento
      if (briefingData.orcamento) {
        this.analyzeBudgetFactors(briefingData.orcamento, briefingData.area);
      }

      // 5. Analisar características especiais
      if (briefingData.caracteristicasEspeciais) {
        this.analyzeSpecialFeatures(briefingData.caracteristicasEspeciais);
      }

      // 6. Calcular score total
      const detectedFactors = this.COMPLEXITY_FACTORS.filter(f => f.detected);
      const totalScore = detectedFactors.reduce((sum, factor) => sum + factor.impact, 0);

      // 7. Determinar nível de complexidade
      const level = this.determineComplexityLevel(totalScore);

      // 8. Calcular confiança
      const confidence = this.calculateConfidence(detectedFactors, briefingData);

      // 9. Gerar justificativa
      const justification = this.generateJustification(level, detectedFactors, briefingData);

      const analysis: ComplexityAnalysis = {
        level,
        score: Math.min(totalScore, 100),
        factors: detectedFactors,
        justification,
        confidence
      };

      logger.info('✅ Análise de complexidade concluída', {
        level: analysis.level,
        score: analysis.score,
        factorsDetected: detectedFactors.length,
        confidence: analysis.confidence
      });

      return analysis;

    } catch (error) {
      logger.error('❌ Erro na análise de complexidade:', error);
      
      // Retornar análise padrão em caso de erro
      return {
        level: 'MEDIO',
        score: 50,
        factors: [],
        justification: 'Análise padrão devido a erro no processamento',
        confidence: 0.5
      };
    }
  }

  /**
   * Analisa fatores relacionados à escala do projeto
   */
  private analyzeScaleFactors(area: number, tipologia: string): void {
    // Grande porte
    if (area > 1000) {
      this.setFactorDetected('Grande Porte');
    }

    // Ajustes por tipologia
    if (tipologia.toUpperCase() === 'INDUSTRIAL' && area > 2000) {
      this.setFactorDetected('Projeto Urbano');
    }

    if (tipologia.toUpperCase() === 'URBANISTICO') {
      this.setFactorDetected('Projeto Urbano');
    }
  }

  /**
   * Analisa fatores baseados nas respostas do briefing
   */
  private analyzeResponseFactors(respostas: Record<string, any>): void {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();

    // Verificar cada categoria de palavras-chave
    Object.entries(this.KEYWORDS).forEach(([category, keywords]) => {
      const hasKeyword = keywords.some(keyword => textoCompleto.includes(keyword.toLowerCase()));
      
      if (hasKeyword) {
        this.detectFactorByCategory(category);
      }
    });

    // Análises específicas
    this.analyzeSpecificResponses(respostas);
  }

  /**
   * Analisa respostas específicas
   */
  private analyzeSpecificResponses(respostas: Record<string, any>): void {
    // Número de pavimentos
    const pavimentos = this.extractNumber(respostas, ['pavimentos', 'andares', 'pisos']);
    if (pavimentos > 2) {
      this.setFactorDetected('Múltiplos Pavimentos');
    }

    // Pé-direito alto
    const peDireito = this.extractNumber(respostas, ['pe_direito', 'altura', 'pé direito']);
    if (peDireito > 4) {
      this.setFactorDetected('Grandes Vãos');
    }

    // Número de ambientes (complexidade funcional)
    const quartos = this.extractNumber(respostas, ['quartos', 'dormitorios']);
    const banheiros = this.extractNumber(respostas, ['banheiros', 'lavabos']);
    
    if (quartos > 4 || banheiros > 3) {
      this.setFactorDetected('Múltiplas Funções');
    }

    // Características especiais por tipologia
    this.analyzeTypologySpecificFactors(respostas);
  }

  /**
   * Analisa fatores específicos por tipologia
   */
  private analyzeTypologySpecificFactors(respostas: Record<string, any>): void {
    const textoCompleto = Object.values(respostas).join(' ').toLowerCase();

    // Residencial
    if (textoCompleto.includes('piscina') || textoCompleto.includes('spa')) {
      this.setFactorDetected('Instalações Especiais');
    }

    // Comercial
    if (textoCompleto.includes('data center') || textoCompleto.includes('servidor')) {
      this.setFactorDetected('Instalações Especiais');
    }

    // Industrial
    if (textoCompleto.includes('ponte rolante') || textoCompleto.includes('guindaste')) {
      this.setFactorDetected('Cargas Especiais');
    }

    // Institucional
    if (textoCompleto.includes('hospital') || textoCompleto.includes('clínica')) {
      this.setFactorDetected('Normas Especiais');
    }
  }

  /**
   * Analisa fatores baseados no orçamento
   */
  private analyzeBudgetFactors(orcamento: number, area: number): void {
    const orcamentoPorM2 = orcamento / area;

    // Orçamento alto indica complexidade
    if (orcamentoPorM2 > 3000) {
      this.setFactorDetected('Sustentabilidade'); // Orçamento alto pode indicar sustentabilidade
    }

    if (orcamentoPorM2 > 5000) {
      this.setFactorDetected('Automação Predial'); // Orçamento muito alto indica automação
    }
  }

  /**
   * Analisa características especiais fornecidas
   */
  private analyzeSpecialFeatures(caracteristicas: string[]): void {
    caracteristicas.forEach(caracteristica => {
      const char = caracteristica.toLowerCase();
      
      if (char.includes('sustentável') || char.includes('verde')) {
        this.setFactorDetected('Sustentabilidade');
      }
      
      if (char.includes('automação') || char.includes('inteligente')) {
        this.setFactorDetected('Automação Predial');
      }
      
      if (char.includes('acessibilidade')) {
        this.setFactorDetected('Acessibilidade Completa');
      }
    });
  }

  /**
   * Detecta fator por categoria de palavra-chave
   */
  private detectFactorByCategory(category: string): void {
    const factorMap: Record<string, string> = {
      'GEOMETRIC_COMPLEXITY': 'Geometria Complexa',
      'MULTIPLE_FLOORS': 'Múltiplos Pavimentos',
      'LARGE_SPANS': 'Grandes Vãos',
      'AUTOMATION': 'Automação Predial',
      'SUSTAINABILITY': 'Sustentabilidade',
      'SPECIAL_STRUCTURE': 'Estrutura Especial',
      'HVAC_COMPLEX': 'AVAC Complexo',
      'SPECIAL_INSTALLATIONS': 'Instalações Especiais',
      'ACCESSIBILITY': 'Acessibilidade Completa',
      'MIXED_USE': 'Múltiplas Funções',
      'RENEWABLE_ENERGY': 'Energia Renovável'
    };

    const factorName = factorMap[category];
    if (factorName) {
      this.setFactorDetected(factorName);
    }
  }

  /**
   * Determina o nível de complexidade baseado no score
   */
  private determineComplexityLevel(score: number): ComplexityLevel {
    if (score >= 60) return 'COMPLEXO';
    if (score >= 30) return 'MEDIO';
    return 'SIMPLES';
  }

  /**
   * Calcula a confiança da análise
   */
  private calculateConfidence(detectedFactors: ComplexityFactor[], briefingData: BriefingData): number {
    let confidence = 0.7; // Base

    // Mais fatores detectados = maior confiança
    confidence += Math.min(detectedFactors.length * 0.05, 0.2);

    // Dados mais completos = maior confiança
    const responseCount = Object.keys(briefingData.respostas).length;
    if (responseCount > 20) confidence += 0.1;
    if (responseCount > 50) confidence += 0.1;

    // Orçamento fornecido = maior confiança
    if (briefingData.orcamento) confidence += 0.05;

    return Math.min(confidence, 1.0);
  }

  /**
   * Gera justificativa textual da análise
   */
  private generateJustification(level: ComplexityLevel, factors: ComplexityFactor[], briefingData: BriefingData): string {
    const tipologia = briefingData.tipologia;
    const area = briefingData.area;

    let justification = `Projeto ${tipologia.toLowerCase()} de ${area}m² classificado como ${level.toLowerCase()}`;

    if (factors.length > 0) {
      const mainFactors = factors
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 3)
        .map(f => f.name.toLowerCase());

      justification += ` devido a: ${mainFactors.join(', ')}`;
    }

    // Adicionar contexto específico
    if (level === 'COMPLEXO') {
      justification += '. Requer equipe especializada e maior tempo de desenvolvimento.';
    } else if (level === 'SIMPLES') {
      justification += '. Projeto padrão com soluções convencionais.';
    } else {
      justification += '. Projeto com algumas características especiais.';
    }

    return justification;
  }

  // ===== MÉTODOS AUXILIARES =====

  private resetFactorDetection(): void {
    this.COMPLEXITY_FACTORS.forEach(factor => {
      factor.detected = false;
    });
  }

  private setFactorDetected(factorName: string): void {
    const factor = this.COMPLEXITY_FACTORS.find(f => f.name === factorName);
    if (factor) {
      factor.detected = true;
    }
  }

  private extractNumber(respostas: Record<string, any>, keys: string[]): number {
    for (const key of keys) {
      for (const [respKey, respValue] of Object.entries(respostas)) {
        if (respKey.toLowerCase().includes(key.toLowerCase())) {
          const num = this.parseNumber(respValue);
          if (num > 0) return num;
        }
      }
    }
    return 0;
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const match = value.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  }

  /**
   * Método público para análise rápida
   */
  quickComplexityCheck(tipologia: string, area: number, caracteristicas: string[] = []): ComplexityLevel {
    let score = 0;

    // Score base por área
    if (area > 1000) score += 15;
    else if (area > 500) score += 8;

    // Score por características
    score += caracteristicas.length * 10;

    // Ajuste por tipologia
    if (tipologia.toUpperCase() === 'INDUSTRIAL') score += 10;
    if (tipologia.toUpperCase() === 'INSTITUCIONAL') score += 12;

    return this.determineComplexityLevel(score);
  }
}

export default ComplexityAnalyzer;