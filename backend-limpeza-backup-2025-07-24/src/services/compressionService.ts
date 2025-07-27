/**
 * Serviço de Compressão de Dados JSON
 * Tarefa 13: Implementar otimizações de performance
 */

import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

interface CompressionOptions {
  level?: number; // 1-9, onde 9 é máxima compressão
  threshold?: number; // Tamanho mínimo em bytes para comprimir
  algorithm?: 'gzip' | 'json-minify' | 'hybrid';
}

interface CompressionResult {
  compressed: string | Buffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
  metadata?: any;
}

class CompressionService {
  private defaultOptions: CompressionOptions = {
    level: 6,
    threshold: 1024, // 1KB
    algorithm: 'hybrid'
  };

  /**
   * Comprimir dados JSON
   */
  async compress(data: any, options: CompressionOptions = {}): Promise<CompressionResult> {
    const opts = { ...this.defaultOptions, ...options };
    const jsonString = JSON.stringify(data);
    const originalSize = Buffer.byteLength(jsonString, 'utf8');

    // Se o tamanho for menor que o threshold, não comprimir
    if (originalSize < opts.threshold!) {
      return {
        compressed: jsonString,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1.0,
        algorithm: 'none'
      };
    }

    switch (opts.algorithm) {
      case 'gzip':
        return await this.compressGzip(jsonString, originalSize, opts.level!);
      
      case 'json-minify':
        return this.compressJsonMinify(data, originalSize);
      
      case 'hybrid':
        return await this.compressHybrid(data, originalSize, opts.level!);
      
      default:
        throw new Error(`Algoritmo de compressão desconhecido: ${opts.algorithm}`);
    }
  }

  /**
   * Descomprimir dados
   */
  async decompress(compressedData: string | Buffer, algorithm: string): Promise<any> {
    switch (algorithm) {
      case 'none':
        return JSON.parse(compressedData as string);
      
      case 'gzip':
        return await this.decompressGzip(compressedData as Buffer);
      
      case 'json-minify':
        return JSON.parse(compressedData as string);
      
      case 'hybrid':
        return await this.decompressHybrid(compressedData);
      
      default:
        throw new Error(`Algoritmo de descompressão desconhecido: ${algorithm}`);
    }
  }

  /**
   * Compressão GZIP
   */
  private async compressGzip(jsonString: string, originalSize: number, level: number): Promise<CompressionResult> {
    try {
      const compressed = await gzipAsync(Buffer.from(jsonString, 'utf8'), { level });
      const compressedSize = compressed.length;

      return {
        compressed,
        originalSize,
        compressedSize,
        compressionRatio: originalSize / compressedSize,
        algorithm: 'gzip'
      };
    } catch (error) {
      console.error('Erro na compressão GZIP:', error);
      throw new Error('Falha na compressão GZIP');
    }
  }

  /**
   * Descompressão GZIP
   */
  private async decompressGzip(compressedData: Buffer): Promise<any> {
    try {
      const decompressed = await gunzipAsync(compressedData);
      return JSON.parse(decompressed.toString('utf8'));
    } catch (error) {
      console.error('Erro na descompressão GZIP:', error);
      throw new Error('Falha na descompressão GZIP');
    }
  }

  /**
   * Compressão por Minificação JSON
   */
  private compressJsonMinify(data: any, originalSize: number): CompressionResult {
    // Remover espaços desnecessários e otimizar estrutura
    const optimized = this.optimizeJsonStructure(data);
    const minified = JSON.stringify(optimized, null, 0);
    const compressedSize = Buffer.byteLength(minified, 'utf8');

    return {
      compressed: minified,
      originalSize,
      compressedSize,
      compressionRatio: originalSize / compressedSize,
      algorithm: 'json-minify'
    };
  }

  /**
   * Compressão Híbrida (Minificação + GZIP)
   */
  private async compressHybrid(data: any, originalSize: number, level: number): Promise<CompressionResult> {
    // Primeiro, otimizar a estrutura JSON
    const optimized = this.optimizeJsonStructure(data);
    const minified = JSON.stringify(optimized, null, 0);
    
    // Depois, aplicar GZIP se valer a pena
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    
    if (minifiedSize > 512) { // Se ainda for grande, aplicar GZIP
      const gzipResult = await this.compressGzip(minified, originalSize, level);
      return {
        ...gzipResult,
        algorithm: 'hybrid',
        metadata: {
          minifiedSize,
          gzipApplied: true
        }
      };
    } else {
      return {
        compressed: minified,
        originalSize,
        compressedSize: minifiedSize,
        compressionRatio: originalSize / minifiedSize,
        algorithm: 'hybrid',
        metadata: {
          gzipApplied: false
        }
      };
    }
  }

  /**
   * Descompressão Híbrida
   */
  private async decompressHybrid(compressedData: string | Buffer): Promise<any> {
    // Se for Buffer, foi aplicado GZIP
    if (Buffer.isBuffer(compressedData)) {
      return await this.decompressGzip(compressedData);
    } else {
      // Se for string, apenas minificado
      return JSON.parse(compressedData);
    }
  }

  /**
   * Otimizar estrutura JSON para reduzir tamanho
   */
  private optimizeJsonStructure(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.optimizeJsonStructure(item));
    }

    if (data && typeof data === 'object') {
      const optimized: any = {};

      for (const [key, value] of Object.entries(data)) {
        // Pular valores null, undefined ou strings vazias
        if (value === null || value === undefined || value === '') {
          continue;
        }

        // Pular arrays vazios
        if (Array.isArray(value) && value.length === 0) {
          continue;
        }

        // Pular objetos vazios
        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
          continue;
        }

        // Otimizar chaves longas comuns
        const optimizedKey = this.optimizeKey(key);
        optimized[optimizedKey] = this.optimizeJsonStructure(value);
      }

      return optimized;
    }

    return data;
  }

  /**
   * Otimizar chaves comuns para versões mais curtas
   */
  private optimizeKey(key: string): string {
    const keyMap: Record<string, string> = {
      'nome_projeto': 'np',
      'area_construida': 'ac',
      'numero_pavimentos': 'pav',
      'numero_quartos': 'qto',
      'numero_banheiros': 'bnh',
      'sistema_ar_condicionado': 'ac_sys',
      'sistema_incendio': 'fire_sys',
      'automacao_predial': 'auto',
      'created_at': 'ca',
      'updated_at': 'ua',
      'escritorio_id': 'eid',
      'briefing_id': 'bid',
      'orcamento_id': 'oid',
      'valor_total': 'vt',
      'horas_total': 'ht',
      'disciplinas_necessarias': 'disc',
      'caracteristicas_especiais': 'char'
    };

    return keyMap[key] || key;
  }

  /**
   * Reverter otimização de chaves
   */
  private restoreKey(key: string): string {
    const reverseKeyMap: Record<string, string> = {
      'np': 'nome_projeto',
      'ac': 'area_construida',
      'pav': 'numero_pavimentos',
      'qto': 'numero_quartos',
      'bnh': 'numero_banheiros',
      'ac_sys': 'sistema_ar_condicionado',
      'fire_sys': 'sistema_incendio',
      'auto': 'automacao_predial',
      'ca': 'created_at',
      'ua': 'updated_at',
      'eid': 'escritorio_id',
      'bid': 'briefing_id',
      'oid': 'orcamento_id',
      'vt': 'valor_total',
      'ht': 'horas_total',
      'disc': 'disciplinas_necessarias',
      'char': 'caracteristicas_especiais'
    };

    return reverseKeyMap[key] || key;
  }

  /**
   * Restaurar estrutura JSON otimizada
   */
  private restoreJsonStructure(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.restoreJsonStructure(item));
    }

    if (data && typeof data === 'object') {
      const restored: any = {};

      for (const [key, value] of Object.entries(data)) {
        const restoredKey = this.restoreKey(key);
        restored[restoredKey] = this.restoreJsonStructure(value);
      }

      return restored;
    }

    return data;
  }

  /**
   * Comprimir dados de briefing específicos
   */
  async compressBriefingData(briefingData: any): Promise<CompressionResult> {
    // Configurações específicas para briefings
    const options: CompressionOptions = {
      level: 7, // Compressão alta para briefings
      threshold: 512, // Threshold menor para briefings
      algorithm: 'hybrid'
    };

    return await this.compress(briefingData, options);
  }

  /**
   * Comprimir dados de orçamento específicos
   */
  async compressBudgetData(budgetData: any): Promise<CompressionResult> {
    // Configurações específicas para orçamentos
    const options: CompressionOptions = {
      level: 6, // Compressão média para orçamentos
      threshold: 1024,
      algorithm: 'hybrid'
    };

    return await this.compress(budgetData, options);
  }

  /**
   * Comprimir dados de configuração
   */
  async compressConfigData(configData: any): Promise<CompressionResult> {
    // Configurações específicas para dados de configuração
    const options: CompressionOptions = {
      level: 9, // Máxima compressão para configurações (acessadas com menos frequência)
      threshold: 256,
      algorithm: 'gzip'
    };

    return await this.compress(configData, options);
  }

  /**
   * Analisar eficiência de compressão
   */
  analyzeCompressionEfficiency(results: CompressionResult[]): any {
    if (results.length === 0) return null;

    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
    const averageRatio = results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length;

    const algorithmStats = results.reduce((stats: any, result) => {
      if (!stats[result.algorithm]) {
        stats[result.algorithm] = {
          count: 0,
          totalOriginal: 0,
          totalCompressed: 0,
          avgRatio: 0
        };
      }

      stats[result.algorithm].count++;
      stats[result.algorithm].totalOriginal += result.originalSize;
      stats[result.algorithm].totalCompressed += result.compressedSize;
      stats[result.algorithm].avgRatio += result.compressionRatio;

      return stats;
    }, {});

    // Calcular médias por algoritmo
    Object.keys(algorithmStats).forEach(algorithm => {
      const stat = algorithmStats[algorithm];
      stat.avgRatio = stat.avgRatio / stat.count;
      stat.efficiency = (stat.totalOriginal - stat.totalCompressed) / stat.totalOriginal;
    });

    return {
      summary: {
        totalFiles: results.length,
        totalOriginalSize,
        totalCompressedSize,
        totalSavings: totalOriginalSize - totalCompressedSize,
        averageCompressionRatio: averageRatio,
        overallEfficiency: (totalOriginalSize - totalCompressedSize) / totalOriginalSize
      },
      byAlgorithm: algorithmStats,
      recommendations: this.generateCompressionRecommendations(algorithmStats)
    };
  }

  /**
   * Gerar recomendações de compressão
   */
  private generateCompressionRecommendations(algorithmStats: any): string[] {
    const recommendations: string[] = [];

    const algorithms = Object.keys(algorithmStats);
    if (algorithms.length === 0) return recommendations;

    // Encontrar algoritmo mais eficiente
    let bestAlgorithm = algorithms[0];
    let bestEfficiency = algorithmStats[bestAlgorithm].efficiency;

    algorithms.forEach(algorithm => {
      if (algorithmStats[algorithm].efficiency > bestEfficiency) {
        bestAlgorithm = algorithm;
        bestEfficiency = algorithmStats[algorithm].efficiency;
      }
    });

    recommendations.push(`Algoritmo mais eficiente: ${bestAlgorithm} (${(bestEfficiency * 100).toFixed(1)}% de economia)`);

    // Recomendações específicas
    if (bestEfficiency > 0.5) {
      recommendations.push('Excelente taxa de compressão. Considere aplicar compressão a mais dados.');
    } else if (bestEfficiency > 0.3) {
      recommendations.push('Boa taxa de compressão. Compressão está sendo efetiva.');
    } else {
      recommendations.push('Taxa de compressão baixa. Considere revisar os dados ou algoritmos.');
    }

    return recommendations;
  }

  /**
   * Obter estatísticas de uso de memória
   */
  getMemoryStats(): any {
    const used = process.memoryUsage();
    
    return {
      rss: Math.round(used.rss / 1024 / 1024 * 100) / 100, // MB
      heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100, // MB
      heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100, // MB
      external: Math.round(used.external / 1024 / 1024 * 100) / 100, // MB
      arrayBuffers: Math.round(used.arrayBuffers / 1024 / 1024 * 100) / 100 // MB
    };
  }
}

export default new CompressionService();