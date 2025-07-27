// ===== SERVIÇO DE TEMPLATES INTELIGENTES =====
// Migrado da V7-Otimizado para V8-Modular

import { 
  TarefaTemplate, 
  TemplateInteligente, 
  AnaliseInteligente,
  Tarefa,
  Etapa 
} from '@/types/dashboard-avancado';

export class TemplatesInteligentesService {
  
  // ===== TEMPLATES DE TAREFAS =====
  private static tarefasTemplates: TarefaTemplate[] = [
    {
      id: 'levantamento_topografico',
      nome: 'Levantamento Topográfico',
      categoria: 'levantamento',
      tempo_estimado_base: 14400, // 4 horas
      complexidade: 'media',
      requer_aprovacao: true,
      responsavel_sugerido: 'engenheiro',
      posicao_recomendada: 1,
      etapa_recomendada: 'levantamento',
      dependencias: [],
      multiplicadores: {
        porte_pequeno: 0.7,
        porte_medio: 1.0,
        porte_grande: 1.5,
        complexidade_baixa: 0.8,
        complexidade_media: 1.0,
        complexidade_alta: 1.3
      },
      palavras_chave: ['topografia', 'levantamento', 'terreno', 'medição'],
      descricao: 'Levantamento das características topográficas do terreno'
    },
    {
      id: 'programa_necessidades',
      nome: 'Programa de Necessidades',
      categoria: 'concepcao',
      tempo_estimado_base: 10800, // 3 horas
      complexidade: 'alta',
      requer_aprovacao: true,
      responsavel_sugerido: 'arquiteto',
      posicao_recomendada: 2,
      etapa_recomendada: 'concepcao',
      dependencias: ['levantamento_topografico'],
      multiplicadores: {
        porte_pequeno: 0.6,
        porte_medio: 1.0,
        porte_grande: 1.8,
        complexidade_baixa: 0.7,
        complexidade_media: 1.0,
        complexidade_alta: 1.5
      },
      palavras_chave: ['programa', 'necessidades', 'briefing', 'requisitos'],
      descricao: 'Desenvolvimento do programa de necessidades do projeto'
    },
    {
      id: 'estudo_preliminar',
      nome: 'Estudo Preliminar',
      categoria: 'concepcao',
      tempo_estimado_base: 21600, // 6 horas
      complexidade: 'alta',
      requer_aprovacao: true,
      responsavel_sugerido: 'arquiteto',
      posicao_recomendada: 3,
      etapa_recomendada: 'concepcao',
      dependencias: ['programa_necessidades'],
      multiplicadores: {
        porte_pequeno: 0.8,
        porte_medio: 1.0,
        porte_grande: 1.4,
        complexidade_baixa: 0.8,
        complexidade_media: 1.0,
        complexidade_alta: 1.4
      },
      palavras_chave: ['estudo', 'preliminar', 'conceito', 'partido'],
      descricao: 'Desenvolvimento do estudo preliminar do projeto'
    },
    {
      id: 'anteprojeto',
      nome: 'Anteprojeto',
      categoria: 'desenvolvimento',
      tempo_estimado_base: 32400, // 9 horas
      complexidade: 'alta',
      requer_aprovacao: true,
      responsavel_sugerido: 'arquiteto',
      posicao_recomendada: 4,
      etapa_recomendada: 'desenvolvimento',
      dependencias: ['estudo_preliminar'],
      multiplicadores: {
        porte_pequeno: 0.7,
        porte_medio: 1.0,
        porte_grande: 1.6,
        complexidade_baixa: 0.8,
        complexidade_media: 1.0,
        complexidade_alta: 1.5
      },
      palavras_chave: ['anteprojeto', 'desenvolvimento', 'detalhamento'],
      descricao: 'Desenvolvimento do anteprojeto arquitetônico'
    },
    {
      id: 'projeto_executivo',
      nome: 'Projeto Executivo',
      categoria: 'detalhamento',
      tempo_estimado_base: 57600, // 16 horas
      complexidade: 'critica',
      requer_aprovacao: true,
      responsavel_sugerido: 'arquiteto',
      posicao_recomendada: 5,
      etapa_recomendada: 'detalhamento',
      dependencias: ['anteprojeto'],
      multiplicadores: {
        porte_pequeno: 0.6,
        porte_medio: 1.0,
        porte_grande: 2.0,
        complexidade_baixa: 0.7,
        complexidade_media: 1.0,
        complexidade_alta: 1.8
      },
      palavras_chave: ['executivo', 'detalhamento', 'construção', 'especificações'],
      descricao: 'Desenvolvimento do projeto executivo completo'
    }
  ];

  // ===== ANÁLISE INTELIGENTE DE TAREFAS =====
  static analisarTarefaInteligente(nomeTarefa: string, etapaId: string): AnaliseInteligente {
    // Encontrar template mais similar
    const templateSugerido = this.encontrarTemplateSimilar(nomeTarefa);
    
    if (!templateSugerido) {
      return {
        tempo_estimado: 7200, // 2 horas padrão
        posicao_recomendada: 1,
        etapa_recomendada: etapaId,
        responsavel_sugerido: 'arquiteto',
        requer_aprovacao: false,
        justificativa: 'Tarefa personalizada sem template correspondente',
        confianca: 30,
        alternativas: []
      };
    }

    // Calcular tempo estimado com multiplicadores
    const tempoBase = templateSugerido.tempo_estimado_base;
    const multiplicadorComplexidade = this.obterMultiplicadorComplexidade(templateSugerido);
    const multiplicadorPorte = this.obterMultiplicadorPorte(templateSugerido);
    
    const tempoEstimado = Math.round(tempoBase * multiplicadorComplexidade * multiplicadorPorte);

    // Encontrar alternativas
    const alternativas = this.encontrarAlternativas(nomeTarefa, templateSugerido);

    return {
      tarefa_sugerida: templateSugerido,
      tempo_estimado: tempoEstimado,
      posicao_recomendada: templateSugerido.posicao_recomendada,
      etapa_recomendada: templateSugerido.etapa_recomendada,
      responsavel_sugerido: templateSugerido.responsavel_sugerido,
      requer_aprovacao: templateSugerido.requer_aprovacao,
      justificativa: `Baseado no template "${templateSugerido.nome}" com ${Math.round(this.calcularSimilaridade(nomeTarefa, templateSugerido) * 100)}% de similaridade`,
      confianca: Math.round(this.calcularSimilaridade(nomeTarefa, templateSugerido) * 100),
      alternativas: alternativas
    };
  }

  // ===== CÁLCULO DE SIMILARIDADE =====
  private static calcularSimilaridade(nomeTarefa: string, template: TarefaTemplate): number {
    const nomeNormalizado = nomeTarefa.toLowerCase();
    const palavrasChave = template.palavras_chave;
    
    let pontuacao = 0;
    let totalPalavras = palavrasChave.length;
    
    // Verificar correspondência exata
    if (nomeNormalizado.includes(template.nome.toLowerCase())) {
      return 0.95;
    }
    
    // Verificar palavras-chave
    palavrasChave.forEach(palavra => {
      if (nomeNormalizado.includes(palavra.toLowerCase())) {
        pontuacao += 1;
      }
    });
    
    // Verificar similaridade por categoria
    if (nomeNormalizado.includes(template.categoria)) {
      pontuacao += 0.5;
    }
    
    return Math.min(pontuacao / totalPalavras, 1);
  }

  // ===== BUSCAR TEMPLATE SIMILAR =====
  private static encontrarTemplateSimilar(nomeTarefa: string): TarefaTemplate | null {
    let melhorTemplate: TarefaTemplate | null = null;
    let melhorPontuacao = 0;
    
    this.tarefasTemplates.forEach(template => {
      const similaridade = this.calcularSimilaridade(nomeTarefa, template);
      if (similaridade > melhorPontuacao && similaridade > 0.3) {
        melhorPontuacao = similaridade;
        melhorTemplate = template;
      }
    });
    
    return melhorTemplate;
  }

  // ===== ENCONTRAR ALTERNATIVAS =====
  private static encontrarAlternativas(nomeTarefa: string, templatePrincipal: TarefaTemplate): TarefaTemplate[] {
    const alternativas: TarefaTemplate[] = [];
    
    this.tarefasTemplates.forEach(template => {
      if (template.id !== templatePrincipal.id) {
        const similaridade = this.calcularSimilaridade(nomeTarefa, template);
        if (similaridade > 0.2) {
          alternativas.push(template);
        }
      }
    });
    
    // Ordenar por similaridade e retornar top 3
    return alternativas
      .sort((a, b) => this.calcularSimilaridade(nomeTarefa, b) - this.calcularSimilaridade(nomeTarefa, a))
      .slice(0, 3);
  }

  // ===== MULTIPLICADORES =====
  private static obterMultiplicadorComplexidade(template: TarefaTemplate): number {
    // Por enquanto, usar complexidade média como padrão
    return template.multiplicadores.complexidade_media;
  }

  private static obterMultiplicadorPorte(template: TarefaTemplate): number {
    // Por enquanto, usar porte médio como padrão
    return template.multiplicadores.porte_medio;
  }

  // ===== OBTER TODOS OS TEMPLATES =====
  static obterTodosTemplates(): TarefaTemplate[] {
    return [...this.tarefasTemplates];
  }

  // ===== OBTER TEMPLATE POR ID =====
  static obterTemplatePorId(id: string): TarefaTemplate | null {
    return this.tarefasTemplates.find(t => t.id === id) || null;
  }

  // ===== ADICIONAR TEMPLATE PERSONALIZADO =====
  static adicionarTemplate(template: TarefaTemplate): void {
    this.tarefasTemplates.push(template);
  }

  // ===== OBTER TEMPLATES POR CATEGORIA =====
  static obterTemplatesPorCategoria(categoria: string): TarefaTemplate[] {
    return this.tarefasTemplates.filter(t => t.categoria === categoria);
  }

  // ===== SUGERIR PRÓXIMA TAREFA =====
  static sugerirProximaTarefa(tarefaConcluida: Tarefa, etapas: Etapa[]): TarefaTemplate[] {
    const templateConcluido = this.encontrarTemplateSimilar(tarefaConcluida.nome);
    
    if (!templateConcluido) {
      return [];
    }
    
    // Encontrar templates que dependem da tarefa concluída
    const proximosTemplates = this.tarefasTemplates.filter(template => 
      template.dependencias.includes(templateConcluido.id)
    );
    
    return proximosTemplates;
  }
} 