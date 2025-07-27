/**
 * 🔍 VALIDADOR DE DISCIPLINAS
 * Utilitários para validação e consistência de disciplinas
 */

import { Disciplina, DisciplinaConfig, DISCIPLINAS_PADRAO } from '../types/disciplinas';

export class DisciplinasValidator {
  /**
   * Validar se uma configuração de disciplinas é válida
   */
  static validateDisciplinasConfig(
    disciplinasAtivas: string[],
    configuracoes: Record<string, DisciplinaConfig>,
    disciplinasDisponiveis: Disciplina[] = DISCIPLINAS_PADRAO
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar se disciplinas ativas existem
    for (const codigo of disciplinasAtivas) {
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      if (!disciplina) {
        errors.push(`Disciplina '${codigo}' não encontrada`);
      }
    }

    // Verificar se disciplina essencial está ativa
    const disciplinasEssenciais = disciplinasDisponiveis
      .filter(d => d.categoria === 'ESSENCIAL')
      .map(d => d.codigo);

    for (const essencial of disciplinasEssenciais) {
      if (!disciplinasAtivas.includes(essencial)) {
        errors.push(`Disciplina essencial '${essencial}' deve estar ativa`);
      }
    }

    // Verificar dependências
    for (const codigo of disciplinasAtivas) {
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      if (disciplina?.dependencias) {
        for (const dependencia of disciplina.dependencias) {
          if (!disciplinasAtivas.includes(dependencia)) {
            errors.push(`Disciplina '${codigo}' depende de '${dependencia}' que não está ativa`);
          }
        }
      }
    }

    // Verificar incompatibilidades
    for (const codigo of disciplinasAtivas) {
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      if (disciplina?.incompatibilidades) {
        for (const incompativel of disciplina.incompatibilidades) {
          if (disciplinasAtivas.includes(incompativel)) {
            errors.push(`Disciplina '${codigo}' é incompatível com '${incompativel}'`);
          }
        }
      }
    }

    // Validar configurações personalizadas
    for (const [codigo, config] of Object.entries(configuracoes)) {
      if (config.valorPersonalizado !== undefined && config.valorPersonalizado < 0) {
        errors.push(`Valor personalizado para '${codigo}' não pode ser negativo`);
      }

      if (config.multiplicadorComplexidade !== undefined && config.multiplicadorComplexidade <= 0) {
        errors.push(`Multiplicador de complexidade para '${codigo}' deve ser positivo`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Resolver dependências automaticamente
   */
  static resolveDependencies(
    disciplinasAtivas: string[],
    disciplinasDisponiveis: Disciplina[] = DISCIPLINAS_PADRAO
  ): string[] {
    const resolved = new Set(disciplinasAtivas);

    // Adicionar dependências recursivamente
    const addDependencies = (codigo: string) => {
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      if (disciplina?.dependencias) {
        for (const dep of disciplina.dependencias) {
          if (!resolved.has(dep)) {
            resolved.add(dep);
            addDependencies(dep); // Recursivo para dependências de dependências
          }
        }
      }
    };

    for (const codigo of disciplinasAtivas) {
      addDependencies(codigo);
    }

    return Array.from(resolved);
  }

  /**
   * Calcular impacto de remover uma disciplina
   */
  static calculateRemovalImpact(
    disciplinaParaRemover: string,
    disciplinasAtivas: string[],
    disciplinasDisponiveis: Disciplina[] = DISCIPLINAS_PADRAO
  ): {
    canRemove: boolean;
    dependentesAfetadas: string[];
    impactoFinanceiro: number;
  } {
    const disciplina = disciplinasDisponiveis.find(d => d.codigo === disciplinaParaRemover);
    
    if (!disciplina) {
      return {
        canRemove: false,
        dependentesAfetadas: [],
        impactoFinanceiro: 0
      };
    }

    // Verificar se é essencial
    if (disciplina.categoria === 'ESSENCIAL') {
      return {
        canRemove: false,
        dependentesAfetadas: [],
        impactoFinanceiro: 0
      };
    }

    // Encontrar disciplinas dependentes
    const dependentesAfetadas = disciplinasDisponiveis
      .filter(d => d.dependencias?.includes(disciplinaParaRemover))
      .filter(d => disciplinasAtivas.includes(d.codigo))
      .map(d => d.codigo);

    // Calcular impacto financeiro
    let impactoFinanceiro = disciplina.valorBase;
    
    // Adicionar valor das dependentes que também serão removidas
    for (const dependente of dependentesAfetadas) {
      const disciplinaDependente = disciplinasDisponiveis.find(d => d.codigo === dependente);
      if (disciplinaDependente) {
        impactoFinanceiro += disciplinaDependente.valorBase;
      }
    }

    return {
      canRemove: dependentesAfetadas.length === 0,
      dependentesAfetadas,
      impactoFinanceiro
    };
  }

  /**
   * Sugerir disciplinas complementares
   */
  static suggestComplementaryDisciplines(
    disciplinasAtivas: string[],
    tipologiaProjeto: string = 'RESIDENCIAL',
    disciplinasDisponiveis: Disciplina[] = DISCIPLINAS_PADRAO
  ): Disciplina[] {
    const sugestoes: Disciplina[] = [];

    // Sugestões baseadas na tipologia
    const sugestoesPorTipologia: Record<string, string[]> = {
      'RESIDENCIAL': ['PAISAGISMO', 'INTERIORES', 'MODELAGEM_3D'],
      'COMERCIAL': ['ESTRUTURAL', 'INSTALACOES', 'MODELAGEM_3D'],
      'INDUSTRIAL': ['ESTRUTURAL', 'INSTALACOES'],
      'INSTITUCIONAL': ['ESTRUTURAL', 'INSTALACOES', 'PAISAGISMO']
    };

    const sugestoesParaTipologia = sugestoesPorTipologia[tipologiaProjeto] || [];

    for (const codigo of sugestoesParaTipologia) {
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      
      if (disciplina && !disciplinasAtivas.includes(codigo)) {
        // Verificar se dependências estão satisfeitas
        const dependenciasSatisfeitas = disciplina.dependencias?.every(dep => 
          disciplinasAtivas.includes(dep)
        ) ?? true;

        if (dependenciasSatisfeitas) {
          sugestoes.push(disciplina);
        }
      }
    }

    return sugestoes.sort((a, b) => a.ordem - b.ordem);
  }

  /**
   * Calcular score de completude do projeto
   */
  static calculateCompletenessScore(
    disciplinasAtivas: string[],
    tipologiaProjeto: string = 'RESIDENCIAL',
    disciplinasDisponiveis: Disciplina[] = DISCIPLINAS_PADRAO
  ): {
    score: number;
    maxScore: number;
    percentage: number;
    missing: string[];
  } {
    // Disciplinas recomendadas por tipologia
    const recomendadasPorTipologia: Record<string, string[]> = {
      'RESIDENCIAL': ['ARQUITETURA', 'PAISAGISMO', 'INTERIORES', 'MODELAGEM_3D'],
      'COMERCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES', 'MODELAGEM_3D'],
      'INDUSTRIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'],
      'INSTITUCIONAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES', 'PAISAGISMO']
    };

    const recomendadas = recomendadasPorTipologia[tipologiaProjeto] || ['ARQUITETURA'];
    const maxScore = recomendadas.length;
    
    let score = 0;
    const missing: string[] = [];

    for (const codigo of recomendadas) {
      if (disciplinasAtivas.includes(codigo)) {
        score++;
      } else {
        missing.push(codigo);
      }
    }

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      missing
    };
  }
}

/**
 * Hook para usar o validador
 */
export function useDisciplinasValidator() {
  return {
    validate: DisciplinasValidator.validateDisciplinasConfig,
    resolveDependencies: DisciplinasValidator.resolveDependencies,
    calculateRemovalImpact: DisciplinasValidator.calculateRemovalImpact,
    suggestComplementary: DisciplinasValidator.suggestComplementaryDisciplines,
    calculateCompleteness: DisciplinasValidator.calculateCompletenessScore
  };
}