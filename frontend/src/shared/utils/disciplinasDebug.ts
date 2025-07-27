/**
 * 🐛 SISTEMA DE DEBUG PARA DISCIPLINAS
 * Utilitários para monitorar e debugar o sistema de disciplinas
 */

import { Disciplina, DisciplinaConfig, CalculoOrcamento } from '../types/disciplinas';

export class DisciplinasDebug {
  private static logs: Array<{
    timestamp: string;
    action: string;
    data: any;
    level: 'info' | 'warn' | 'error';
  }> = [];

  static log(action: string, data: any, level: 'info' | 'warn' | 'error' = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      data,
      level
    };
    
    this.logs.push(logEntry);
    
    // Manter apenas os últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
    
    // Log no console com cores
    const colors = {
      info: '\x1b[36m', // Cyan
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m' // Red
    };
    
    console.log(
      `${colors[level]}[DISCIPLINAS-DEBUG] ${action}\x1b[0m`,
      data
    );
  }

  static getLogs() {
    return [...this.logs];
  }

  static clearLogs() {
    this.logs = [];
  }

  static validateState(
    disciplinasAtivas: Set<string>,
    disciplinasDisponiveis: Disciplina[],
    configuracoes: Record<string, DisciplinaConfig>,
    calculoAtual: CalculoOrcamento | null
  ) {
    const issues: string[] = [];

    // Verificar se disciplinas ativas existem
    for (const codigo of disciplinasAtivas) {
      const exists = disciplinasDisponiveis.some(d => d.codigo === codigo);
      if (!exists) {
        issues.push(`Disciplina ativa '${codigo}' não existe na lista disponível`);
      }
    }

    // Verificar dependências
    for (const codigo of disciplinasAtivas) {
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      if (disciplina?.dependencias) {
        for (const dep of disciplina.dependencias) {
          if (!disciplinasAtivas.has(dep)) {
            issues.push(`Disciplina '${codigo}' depende de '${dep}' que não está ativa`);
          }
        }
      }
    }

    // Verificar se arquitetura está ativa
    if (!disciplinasAtivas.has('ARQUITETURA')) {
      issues.push('Disciplina essencial ARQUITETURA não está ativa');
    }

    // Verificar cálculo
    if (calculoAtual) {
      if (calculoAtual.disciplinasAtivas.length !== disciplinasAtivas.size) {
        issues.push('Inconsistência entre disciplinas ativas e cálculo atual');
      }
    }

    if (issues.length > 0) {
      this.log('VALIDATION_ISSUES', issues, 'warn');
    } else {
      this.log('VALIDATION_SUCCESS', 'Estado válido', 'info');
    }

    return issues;
  }

  static generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      logsByLevel: {
        info: this.logs.filter(l => l.level === 'info').length,
        warn: this.logs.filter(l => l.level === 'warn').length,
        error: this.logs.filter(l => l.level === 'error').length
      },
      recentActions: this.logs.slice(-10).map(l => ({
        time: l.timestamp,
        action: l.action,
        level: l.level
      })),
      errors: this.logs.filter(l => l.level === 'error').slice(-5)
    };

    console.table(report.logsByLevel);
    return report;
  }
}

// Hook para usar o debug
export function useDisciplinasDebug() {
  return {
    log: DisciplinasDebug.log,
    getLogs: DisciplinasDebug.getLogs,
    clearLogs: DisciplinasDebug.clearLogs,
    validateState: DisciplinasDebug.validateState,
    generateReport: DisciplinasDebug.generateReport
  };
}