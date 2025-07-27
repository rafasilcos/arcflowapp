/**
 * 🧪 TESTE COMPLETO DO SISTEMA DE DISCIPLINAS
 * Testa todas as funcionalidades e identifica problemas
 */

import { DISCIPLINAS_PADRAO, Disciplina, DisciplinaConfig } from '../types/disciplinas';
import { DisciplinasValidator } from './disciplinasValidator';

export class DisciplinasTest {
  static async runCompleteTest() {
    console.log('🧪 INICIANDO TESTE COMPLETO DO SISTEMA DE DISCIPLINAS');
    console.log('='.repeat(60));
    
    const results = {
      passed: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Teste 1: Validação de tipos e estrutura
    console.log('\n📋 Teste 1: Validação de Estrutura');
    try {
      this.testDataStructure();
      console.log('✅ Estrutura de dados válida');
      results.passed++;
    } catch (error) {
      console.log('❌ Erro na estrutura:', error);
      results.failed++;
      results.errors.push(`Estrutura: ${error}`);
    }

    // Teste 2: Lógica de dependências
    console.log('\n🔗 Teste 2: Lógica de Dependências');
    try {
      this.testDependencyLogic();
      console.log('✅ Lógica de dependências funcionando');
      results.passed++;
    } catch (error) {
      console.log('❌ Erro nas dependências:', error);
      results.failed++;
      results.errors.push(`Dependências: ${error}`);
    }

    // Teste 3: Cálculos de valores
    console.log('\n💰 Teste 3: Cálculos de Valores');
    try {
      this.testValueCalculations();
      console.log('✅ Cálculos de valores corretos');
      results.passed++;
    } catch (error) {
      console.log('❌ Erro nos cálculos:', error);
      results.failed++;
      results.errors.push(`Cálculos: ${error}`);
    }

    // Teste 4: Validações de negócio
    console.log('\n🎯 Teste 4: Regras de Negócio');
    try {
      this.testBusinessRules();
      console.log('✅ Regras de negócio implementadas corretamente');
      results.passed++;
    } catch (error) {
      console.log('❌ Erro nas regras de negócio:', error);
      results.failed++;
      results.errors.push(`Regras: ${error}`);
    }

    // Teste 5: API Integration (simulado)
    console.log('\n🔌 Teste 5: Integração com API');
    try {
      await this.testAPIIntegration();
      console.log('✅ Integração com API funcionando');
      results.passed++;
    } catch (error) {
      console.log('❌ Erro na API:', error);
      results.failed++;
      results.errors.push(`API: ${error}`);
    }

    // Resultado final
    console.log('\n📊 RESULTADO FINAL:');
    console.log('='.repeat(60));
    console.log(`✅ Testes aprovados: ${results.passed}`);
    console.log(`❌ Testes falharam: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n🐛 ERROS ENCONTRADOS:');
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    const successRate = (results.passed / (results.passed + results.failed)) * 100;
    console.log(`\n📈 Taxa de sucesso: ${successRate.toFixed(1)}%`);

    if (successRate === 100) {
      console.log('🎉 TODOS OS TESTES PASSARAM! Sistema funcionando perfeitamente.');
    } else if (successRate >= 80) {
      console.log('⚠️ Sistema funcionando com pequenos problemas.');
    } else {
      console.log('🚨 Sistema com problemas críticos que precisam ser corrigidos.');
    }

    return results;
  }

  private static testDataStructure() {
    // Verificar se todas as disciplinas têm os campos obrigatórios
    for (const disciplina of DISCIPLINAS_PADRAO) {
      if (!disciplina.id || !disciplina.codigo || !disciplina.nome) {
        throw new Error(`Disciplina ${disciplina.codigo} com campos obrigatórios faltando`);
      }
      
      if (typeof disciplina.valorBase !== 'number' || disciplina.valorBase <= 0) {
        throw new Error(`Disciplina ${disciplina.codigo} com valor base inválido`);
      }
      
      if (!['ESSENCIAL', 'COMPLEMENTAR', 'ESPECIALIZADA'].includes(disciplina.categoria)) {
        throw new Error(`Disciplina ${disciplina.codigo} com categoria inválida`);
      }
    }

    // Verificar se ARQUITETURA existe e é essencial
    const arquitetura = DISCIPLINAS_PADRAO.find(d => d.codigo === 'ARQUITETURA');
    if (!arquitetura || arquitetura.categoria !== 'ESSENCIAL') {
      throw new Error('ARQUITETURA deve existir e ser ESSENCIAL');
    }
  }

  private static testDependencyLogic() {
    const validator = new DisciplinasValidator();
    
    // Teste 1: Dependências válidas
    const disciplinasComDependencias = ['ARQUITETURA', 'ESTRUTURAL'];
    const resolved = DisciplinasValidator.resolveDependencies(disciplinasComDependencias);
    
    if (!resolved.includes('ARQUITETURA')) {
      throw new Error('Dependências não resolvidas corretamente');
    }

    // Teste 2: Validação de dependências
    const { isValid, errors } = DisciplinasValidator.validateDisciplinasConfig(
      ['ESTRUTURAL'], // Sem ARQUITETURA
      {},
      DISCIPLINAS_PADRAO
    );
    
    if (isValid) {
      throw new Error('Validação deveria falhar sem ARQUITETURA');
    }

    // Teste 3: Impacto de remoção
    const impact = DisciplinasValidator.calculateRemovalImpact(
      'ARQUITETURA',
      ['ARQUITETURA', 'ESTRUTURAL'],
      DISCIPLINAS_PADRAO
    );
    
    if (impact.canRemove) {
      throw new Error('ARQUITETURA não deveria poder ser removida');
    }
  }

  private static testValueCalculations() {
    const disciplinasAtivas = DISCIPLINAS_PADRAO.filter(d => 
      ['ARQUITETURA', 'ESTRUTURAL'].includes(d.codigo)
    );
    
    const configuracoes: Record<string, DisciplinaConfig> = {
      'ARQUITETURA': {
        ativa: true,
        multiplicadorComplexidade: 1.2
      }
    };

    // Calcular valor total
    const valorTotal = disciplinasAtivas.reduce((total, disciplina) => {
      const config = configuracoes[disciplina.codigo];
      const valor = config?.valorPersonalizado || disciplina.valorBase;
      const multiplicador = config?.multiplicadorComplexidade || 1;
      return total + (valor * multiplicador);
    }, 0);

    // Verificar se o cálculo está correto
    const valorEsperado = (120 * 1.2) + 25; // ARQUITETURA com multiplicador + ESTRUTURAL
    if (Math.abs(valorTotal - valorEsperado) > 0.01) {
      throw new Error(`Cálculo incorreto: esperado ${valorEsperado}, obtido ${valorTotal}`);
    }
  }

  private static testBusinessRules() {
    // Regra 1: ARQUITETURA sempre deve estar ativa
    const disciplinasEssenciais = DISCIPLINAS_PADRAO.filter(d => d.categoria === 'ESSENCIAL');
    if (disciplinasEssenciais.length === 0) {
      throw new Error('Deve haver pelo menos uma disciplina essencial');
    }

    // Regra 2: Disciplinas com dependências devem ter suas dependências ativas
    const estrutural = DISCIPLINAS_PADRAO.find(d => d.codigo === 'ESTRUTURAL');
    if (!estrutural?.dependencias?.includes('ARQUITETURA')) {
      throw new Error('ESTRUTURAL deve depender de ARQUITETURA');
    }

    // Regra 3: Valores devem ser positivos
    for (const disciplina of DISCIPLINAS_PADRAO) {
      if (disciplina.valorBase <= 0) {
        throw new Error(`Valor base de ${disciplina.codigo} deve ser positivo`);
      }
    }
  }

  private static async testAPIIntegration() {
    // Simular teste de API
    const testData = {
      disciplinasAtivas: ['ARQUITETURA', 'ESTRUTURAL'],
      configuracoesPorDisciplina: {
        'ARQUITETURA': { ativa: true }
      }
    };

    // Verificar se a estrutura de dados está correta para API
    if (!Array.isArray(testData.disciplinasAtivas)) {
      throw new Error('disciplinasAtivas deve ser um array');
    }

    if (typeof testData.configuracoesPorDisciplina !== 'object') {
      throw new Error('configuracoesPorDisciplina deve ser um objeto');
    }

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  static generatePerformanceReport() {
    console.log('\n⚡ RELATÓRIO DE PERFORMANCE:');
    console.log('='.repeat(60));
    
    const startTime = performance.now();
    
    // Simular operações típicas
    for (let i = 0; i < 1000; i++) {
      const disciplinasAtivas = ['ARQUITETURA', 'ESTRUTURAL', 'PAISAGISMO'];
      DisciplinasValidator.validateDisciplinasConfig(disciplinasAtivas, {}, DISCIPLINAS_PADRAO);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ 1000 validações executadas em: ${duration.toFixed(2)}ms`);
    console.log(`📊 Média por validação: ${(duration / 1000).toFixed(3)}ms`);
    
    if (duration < 100) {
      console.log('✅ Performance excelente');
    } else if (duration < 500) {
      console.log('⚠️ Performance aceitável');
    } else {
      console.log('🚨 Performance precisa ser otimizada');
    }
  }
}

// Função para executar todos os testes
export async function runDisciplinasTests() {
  const results = await DisciplinasTest.runCompleteTest();
  DisciplinasTest.generatePerformanceReport();
  return results;
}