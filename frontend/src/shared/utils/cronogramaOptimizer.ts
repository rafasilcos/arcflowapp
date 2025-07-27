/**
 * ⚡ OTIMIZADOR DE CRONOGRAMA
 * Sistema de cache e otimização para alta performance
 */

import { Disciplina, FaseCronograma, ENTREGAVEIS_POR_DISCIPLINA } from '../types/disciplinas';

interface CacheEntry {
  key: string;
  cronograma: FaseCronograma[];
  timestamp: number;
  ttl: number;
}

export class CronogramaOptimizer {
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private static readonly MAX_CACHE_SIZE = 100;

  /**
   * 🚀 Calcular cronograma com cache inteligente
   */
  static calcularCronogramaOtimizado(
    disciplinasAtivas: Disciplina[],
    configuracoes: Record<string, any> = {}
  ): FaseCronograma[] {
    // Gerar chave de cache baseada nas disciplinas ativas
    const cacheKey = this.generateCacheKey(disciplinasAtivas, configuracoes);
    
    // Verificar cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Calcular cronograma
    const cronograma = this.calcularCronogramaDinamico(disciplinasAtivas, configuracoes);
    
    // Armazenar no cache
    this.setCache(cacheKey, cronograma);
    
    return cronograma;
  }

  /**
   * 📊 Calcular cronograma dinâmico otimizado
   */
  private static calcularCronogramaDinamico(
    disciplinasAtivas: Disciplina[],
    configuracoes: Record<string, any>
  ): FaseCronograma[] {
    const disciplinasCodigos = disciplinasAtivas.map(d => d.codigo);
    
    const fasesPadrao = [
      {
        id: 'LV_LEVANTAMENTO',
        ordem: 1,
        etapa: 'A - CONCEPÇÃO',
        nome: 'LV - Levantamento de Dados',
        percentual: 0.05,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: []
      },
      {
        id: 'PN_PROGRAMA',
        ordem: 2,
        etapa: 'A - CONCEPÇÃO',
        nome: 'PN - Programa de Necessidades',
        percentual: 0.05,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: []
      },
      {
        id: 'EV_VIABILIDADE',
        ordem: 3,
        etapa: 'A - CONCEPÇÃO',
        nome: 'EV - Estudo de Viabilidade',
        percentual: 0.12,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: ['ESTRUTURAL', 'APROVACAO_LEGAL']
      },
      {
        id: 'EP_PRELIMINAR',
        ordem: 4,
        etapa: 'B - DEFINIÇÃO',
        nome: 'EP - Estudo Preliminar',
        percentual: 0.15,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: ['MODELAGEM_3D', 'PAISAGISMO']
      },
      {
        id: 'AP_ANTEPROJETO',
        ordem: 5,
        etapa: 'C - INTERFACES',
        nome: 'AP - Anteprojeto',
        percentual: 0.25,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: ['ESTRUTURAL', 'INSTALACOES', 'PAISAGISMO', 'INTERIORES', 'MODELAGEM_3D']
      },
      {
        id: 'PL_LEGAL',
        ordem: 6,
        etapa: 'D - APROVAÇÃO',
        nome: 'PL - Projeto Legal',
        percentual: 0.15,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: ['APROVACAO_LEGAL']
      },
      {
        id: 'PB_BASICO',
        ordem: 7,
        etapa: 'E - PROJETO BÁSICO',
        nome: 'PB - Projeto Básico',
        percentual: 0.20,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: ['ESTRUTURAL', 'INSTALACOES', 'PAISAGISMO', 'INTERIORES', 'APROVACAO_LEGAL']
      },
      {
        id: 'PE_EXECUTIVO',
        ordem: 8,
        etapa: 'F - PROJETO EXECUTIVO',
        nome: 'PE - Projeto Executivo',
        percentual: 0.30,
        disciplinasNecessarias: ['ARQUITETURA'],
        disciplinasOpcionais: ['ESTRUTURAL', 'INSTALACOES', 'PAISAGISMO', 'INTERIORES', 'MODELAGEM_3D']
      }
    ];

    // Processar fases em paralelo para melhor performance
    const fasesProcessadas = fasesPadrao.map(fase => {
      const disciplinasAtivasNaFase = disciplinasCodigos.filter(d => 
        fase.disciplinasNecessarias.includes(d) ||
        (fase.disciplinasOpcionais && fase.disciplinasOpcionais.includes(d))
      );

      const ativa = disciplinasAtivasNaFase.length > 0;
      
      if (!ativa) {
        return null; // Fase inativa
      }

      // Calcular entregáveis dinâmicos de forma otimizada
      const entregaveisDinamicos = this.calcularEntregaveisOtimizado(
        fase.id, 
        disciplinasAtivasNaFase
      );
      
      const valorBase = disciplinasAtivas
        .filter(d => disciplinasAtivasNaFase.includes(d.codigo))
        .reduce((total, d) => total + d.valorBase, 0);
      
      const valor = Math.round(valorBase * fase.percentual);
      // ✅ CORREÇÃO: Usar prazos realistas baseados na correção do backend
      const prazosRealistasPorFase: Record<string, number> = {
        'LV_LEVANTAMENTO': 0.5,
        'PN_PROGRAMA': 0.5,
        'EV_VIABILIDADE': 1,
        'EP_PRELIMINAR': 1.5,
        'AP_ANTEPROJETO': 2.5,
        'PL_LEGAL': 1,
        'PB_BASICO': 2,
        'PE_EXECUTIVO': 2.5
      };
      
      const prazo = prazosRealistasPorFase[fase.id] || Math.max(1, Math.round(disciplinasAtivasNaFase.length * 0.5));

      return {
        id: fase.id,
        ordem: fase.ordem,
        etapa: fase.etapa,
        nome: fase.nome,
        prazo,
        valor,
        percentual: fase.percentual,
        disciplinas: disciplinasAtivasNaFase,
        responsavel: 'Equipe Técnica',
        entregaveis: entregaveisDinamicos,
        ativa: true,
        disciplinasAtivasNaFase: disciplinasAtivas.filter(d => disciplinasAtivasNaFase.includes(d.codigo))
      };
    }).filter(Boolean) as FaseCronograma[]; // Remove fases nulas

    return fasesProcessadas;
  }

  /**
   * 🎯 Calcular entregáveis de forma otimizada
   */
  private static calcularEntregaveisOtimizado(
    faseId: string,
    disciplinasAtivasCodigos: string[]
  ): string[] {
    const entregaveis = new Set<string>(); // Usar Set para evitar duplicatas automaticamente
    
    // Processar disciplinas em ordem de prioridade
    const disciplinasOrdenadas = this.ordenarDisciplinasPorPrioridade(disciplinasAtivasCodigos);
    
    for (const disciplinaCodigo of disciplinasOrdenadas) {
      const entregaveisDisciplina = ENTREGAVEIS_POR_DISCIPLINA[disciplinaCodigo];
      
      if (entregaveisDisciplina?.[faseId]) {
        entregaveisDisciplina[faseId].forEach(entregavel => {
          entregaveis.add(entregavel);
        });
      }
    }
    
    return Array.from(entregaveis);
  }

  /**
   * 📋 Ordenar disciplinas por prioridade
   */
  private static ordenarDisciplinasPorPrioridade(disciplinas: string[]): string[] {
    const prioridades: Record<string, number> = {
      'ARQUITETURA': 1,
      'ESTRUTURAL': 2,
      'INSTALACOES': 3,
      'MODELAGEM_3D': 4,
      'APROVACAO_LEGAL': 5,
      'PAISAGISMO': 6,
      'INTERIORES': 7
    };

    return disciplinas.sort((a, b) => {
      return (prioridades[a] || 999) - (prioridades[b] || 999);
    });
  }

  /**
   * 🔑 Gerar chave de cache
   */
  private static generateCacheKey(
    disciplinasAtivas: Disciplina[],
    configuracoes: Record<string, any>
  ): string {
    const disciplinasCodigos = disciplinasAtivas
      .map(d => d.codigo)
      .sort()
      .join(',');
    
    const configHash = JSON.stringify(configuracoes);
    
    return `cronograma:${disciplinasCodigos}:${this.simpleHash(configHash)}`;
  }

  /**
   * 🔍 Buscar no cache
   */
  private static getFromCache(key: string): FaseCronograma[] | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.cronograma;
  }

  /**
   * 💾 Armazenar no cache
   */
  private static setCache(key: string, cronograma: FaseCronograma[]): void {
    // Limpar cache se estiver muito grande
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.clearOldEntries();
    }
    
    this.cache.set(key, {
      key,
      cronograma: JSON.parse(JSON.stringify(cronograma)), // Deep clone
      timestamp: Date.now(),
      ttl: this.CACHE_TTL
    });
  }

  /**
   * 🧹 Limpar entradas antigas do cache
   */
  private static clearOldEntries(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        entriesToDelete.push(key);
      }
    }
    
    entriesToDelete.forEach(key => this.cache.delete(key));
    
    // Se ainda estiver cheio, remover as mais antigas
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, Math.floor(this.MAX_CACHE_SIZE / 2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * 🔢 Hash simples para configurações
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 📊 Estatísticas do cache
   */
  static getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    oldestEntry: number;
  } {
    const now = Date.now();
    let oldestTimestamp = now;
    
    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
    }
    
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      hitRate: 0, // Implementar contador de hits se necessário
      oldestEntry: now - oldestTimestamp
    };
  }

  /**
   * 🧹 Limpar todo o cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}