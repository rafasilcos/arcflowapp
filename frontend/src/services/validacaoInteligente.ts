// ===== SERVIÇO DE VALIDAÇÃO INTELIGENTE =====
// Migrado da V7-Otimizado para V8-Modular
// Análise e validação de operações CRUD

import { 
  OperacaoCrud, 
  ResultadoValidacao, 
  ValidacaoImpacto, 
  Projeto, 
  Tarefa,
  Etapa 
} from '@/types/dashboard-core';

export class ValidacaoInteligenteService {
  
  // ===== MÉTODO PRINCIPAL DE VALIDAÇÃO =====
  static async validarOperacao(operacao: OperacaoCrud, projeto: Projeto): Promise<ResultadoValidacao> {
    const validacoes: ValidacaoImpacto[] = [];

    // Executar todas as validações
    validacoes.push(...this.validarDependencias(operacao, projeto));
    validacoes.push(...this.calcularImpactoPrazos(operacao, projeto));
    validacoes.push(...this.validarRecursos(operacao, projeto));
    validacoes.push(...this.validarQualidade(operacao, projeto));

    // Calcular impacto total
    const horasAdicionais = validacoes.reduce((total, v) => 
      total + (v.impacto_estimado.horas_adicionais || 0), 0);
    
    const diasAtraso = validacoes.reduce((total, v) => 
      total + (v.impacto_estimado.dias_atraso || 0), 0);

    const tempoTotalNovo = projeto.tempo_total_estimado + horasAdicionais;
    const dataEntregaAtual = new Date(projeto.prazo_final);
    const dataEntregaNova = new Date(dataEntregaAtual.getTime() + (diasAtraso * 24 * 60 * 60 * 1000));

    const temErros = validacoes.some(v => v.tipo === 'error');
    const temAvisos = validacoes.some(v => v.tipo === 'warning');

    return {
      pode_prosseguir: !temErros,
      requer_confirmacao: temAvisos,
      validacoes,
      impacto_calculado: {
        tempo_total_novo: tempoTotalNovo,
        data_entrega_nova: dataEntregaNova.toISOString().split('T')[0],
        dias_atraso: diasAtraso,
        custo_adicional: horasAdicionais * 150, // R$ 150/hora
        tarefas_afetadas: this.calcularTarefasAfetadas(operacao, projeto)
      },
      sugestoes_alternativas: this.gerarSugestoesAlternativas(operacao, projeto)
    };
  }

  // ===== VALIDAÇÃO DE DEPENDÊNCIAS =====
  private static validarDependencias(operacao: OperacaoCrud, projeto: Projeto): ValidacaoImpacto[] {
    const validacoes: ValidacaoImpacto[] = [];

    if (operacao.entidade === 'tarefa' && operacao.tipo === 'excluir') {
      const tarefasVinculadas = this.encontrarTarefasVinculadas(operacao.id!, projeto);
      
      if (tarefasVinculadas.length > 0) {
        validacoes.push({
          id: `dep_${Date.now()}`,
          tipo: 'error',
          categoria: 'dependencia',
          mensagem: `Esta tarefa possui ${tarefasVinculadas.length} dependência(s). Excluir pode quebrar o fluxo.`,
          impacto_estimado: {
            dias_atraso: tarefasVinculadas.length * 2,
            risco_qualidade: 'alto'
          },
          sugestoes: [
            'Remover as dependências primeiro',
            'Reagendar as tarefas dependentes',
            'Consultar o responsável do projeto'
          ],
          pode_prosseguir: false
        });
      }
    }

    return validacoes;
  }

  // ===== CÁLCULO DE IMPACTO NOS PRAZOS =====
  private static calcularImpactoPrazos(operacao: OperacaoCrud, projeto: Projeto): ValidacaoImpacto[] {
    const validacoes: ValidacaoImpacto[] = [];

    if (operacao.entidade === 'tarefa' && operacao.tipo === 'criar') {
      const horasEstimadas = operacao.dados?.horas_estimadas || 8;
      const diasAdicionais = Math.ceil(horasEstimadas / 8);

      if (diasAdicionais > 5) {
        validacoes.push({
          id: `prazo_${Date.now()}`,
          tipo: 'warning',
          categoria: 'prazo',
          mensagem: `Nova tarefa pode adicionar ${diasAdicionais} dias ao projeto.`,
          impacto_estimado: {
            dias_atraso: diasAdicionais,
            horas_adicionais: horasEstimadas,
            custo_adicional: horasEstimadas * 150
          },
          sugestoes: [
            'Reduzir o escopo da tarefa',
            'Dividir em tarefas menores',
            'Alocar mais recursos'
          ],
          pode_prosseguir: true
        });
      }
    }

    return validacoes;
  }

  // ===== VALIDAÇÃO DE RECURSOS =====
  private static validarRecursos(operacao: OperacaoCrud, projeto: Projeto): ValidacaoImpacto[] {
    const validacoes: ValidacaoImpacto[] = [];

    if (operacao.entidade === 'tarefa' && operacao.tipo === 'criar') {
      const responsavel = operacao.dados?.responsavel;
      
      if (responsavel) {
        const tarefasDoResponsavel = this.contarTarefasDoResponsavel(responsavel, projeto);
        
        if (tarefasDoResponsavel > 5) {
          validacoes.push({
            id: `recurso_${Date.now()}`,
            tipo: 'warning',
            categoria: 'equipe',
            mensagem: `${responsavel} já possui ${tarefasDoResponsavel} tarefas. Pode haver sobrecarga.`,
            impacto_estimado: {
              dias_atraso: 2,
              risco_qualidade: 'medio'
            },
            sugestoes: [
              'Redistribuir tarefas',
              'Priorizar tarefas existentes',
              'Alocar outro responsável'
            ],
            pode_prosseguir: true
          });
        }
      }
    }

    return validacoes;
  }

  // ===== VALIDAÇÃO DE QUALIDADE =====
  private static validarQualidade(operacao: OperacaoCrud, projeto: Projeto): ValidacaoImpacto[] {
    const validacoes: ValidacaoImpacto[] = [];

    if (operacao.entidade === 'tarefa' && operacao.tipo === 'criar') {
      const nomeTarefa = operacao.dados?.nome?.toLowerCase() || '';
      const tarefasSimilares = this.encontrarTarefasSimilares(nomeTarefa, projeto);

      if (tarefasSimilares.length > 0) {
        validacoes.push({
          id: `qualidade_${Date.now()}`,
          tipo: 'info',
          categoria: 'qualidade',
          mensagem: `Encontradas ${tarefasSimilares.length} tarefa(s) similar(es). Verifique duplicação.`,
          impacto_estimado: {
            risco_qualidade: 'baixo'
          },
          sugestoes: [
            'Verificar se não é duplicada',
            'Renomear para ser mais específica',
            'Agrupar com tarefa existente'
          ],
          pode_prosseguir: true
        });
      }
    }

    return validacoes;
  }

  // ===== MÉTODOS AUXILIARES =====
  private static encontrarTarefasVinculadas(tarefaId: string, projeto: Projeto): string[] {
    const vinculadas: string[] = [];
    
    projeto.etapas.forEach(etapa => {
      etapa.tarefas.forEach(tarefa => {
        if (tarefa.dependencia_tarefa_id === tarefaId) {
          vinculadas.push(tarefa.id);
        }
      });
    });

    return vinculadas;
  }

  private static contarTarefasDoResponsavel(responsavel: string, projeto: Projeto): number {
    let count = 0;
    
    projeto.etapas.forEach(etapa => {
      etapa.tarefas.forEach(tarefa => {
        if (tarefa.responsavel === responsavel && !['concluida', 'aprovada'].includes(tarefa.status)) {
          count++;
        }
      });
    });

    return count;
  }

  private static encontrarTarefasSimilares(nomeTarefa: string, projeto: Projeto): string[] {
    const similares: string[] = [];
    const palavrasChave = nomeTarefa.split(' ').filter(p => p.length > 3);
    
    projeto.etapas.forEach(etapa => {
      etapa.tarefas.forEach(tarefa => {
        const nomeTarefaExistente = tarefa.nome.toLowerCase();
        const similaridade = palavrasChave.filter(palavra => 
          nomeTarefaExistente.includes(palavra)
        ).length;
        
        if (similaridade >= 2) {
          similares.push(tarefa.id);
        }
      });
    });

    return similares;
  }

  private static calcularTarefasAfetadas(operacao: OperacaoCrud, projeto: Projeto): string[] {
    // Lógica para calcular quais tarefas serão afetadas pela operação
    const afetadas: string[] = [];

    if (operacao.entidade === 'etapa' && operacao.tipo === 'excluir') {
      const etapa = projeto.etapas.find(e => e.id === operacao.id);
      if (etapa) {
        afetadas.push(...etapa.tarefas.map(t => t.id));
      }
    }

    return afetadas;
  }

  private static gerarSugestoesAlternativas(operacao: OperacaoCrud, projeto: Projeto): Array<{
    id: string;
    descricao: string;
    acao: () => void;
  }> {
    const sugestoes: Array<{
      id: string;
      descricao: string;
      acao: () => void;
    }> = [];

    if (operacao.entidade === 'tarefa' && operacao.tipo === 'criar') {
      sugestoes.push({
        id: 'sugestao_template',
        descricao: 'Usar template inteligente baseado em projetos similares',
        acao: () => console.log('Aplicando template inteligente')
      });

      sugestoes.push({
        id: 'sugestao_dividir',
        descricao: 'Dividir tarefa em sub-tarefas menores',
        acao: () => console.log('Dividindo tarefa')
      });
    }

    return sugestoes;
  }
}

export default ValidacaoInteligenteService; 