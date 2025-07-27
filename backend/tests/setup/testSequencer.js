/**
 * Sequenciador de Testes para Integração
 * Tarefa 12: Desenvolver testes de integração end-to-end
 * 
 * Define a ordem de execução dos testes para otimizar recursos
 */

const Sequencer = require('@jest/test-sequencer').default;

class IntegrationTestSequencer extends Sequencer {
  sort(tests) {
    // Definir ordem de prioridade dos testes
    const testOrder = [
      'budget-integration.test.js',      // Testes básicos primeiro
      'custom-briefing.test.js',         // Briefings personalizados
      'end-to-end-complete.test.js',     // Fluxos completos
      'error-recovery.test.js',          // Recuperação de erros
      'concurrency.test.js',             // Concorrência por último (mais pesado)
      'budget-performance.test.js'       // Performance por último
    ];
    
    return tests.sort((testA, testB) => {
      const getTestName = (test) => test.path.split('/').pop();
      const nameA = getTestName(testA);
      const nameB = getTestName(testB);
      
      const indexA = testOrder.indexOf(nameA);
      const indexB = testOrder.indexOf(nameB);
      
      // Se ambos estão na lista de ordem, usar a ordem definida
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // Se apenas um está na lista, ele tem prioridade
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // Se nenhum está na lista, ordem alfabética
      return nameA.localeCompare(nameB);
    });
  }
}

module.exports = IntegrationTestSequencer;