// ===== SISTEMA DE TEMPLATES INTELIGENTES =====
// Extraído da V7-Otimizado para IA de sugestões de tarefas

export interface TarefaTemplate {
  id: string;
  nome: string;
  categoria: string;
  tempo_estimado_base: number; // em segundos
  complexidade: 'baixa' | 'media' | 'alta' | 'critica';
  requer_aprovacao: boolean;
  responsavel_sugerido: 'arquiteto' | 'engenheiro' | 'tecnico' | 'designer' | 'gerente';
  posicao_recomendada: number;
  etapa_recomendada: string;
  dependencias: string[];
  multiplicadores: {
    porte_pequeno: number;
    porte_medio: number;
    porte_grande: number;
    complexidade_baixa: number;
    complexidade_media: number;
    complexidade_alta: number;
  };
  palavras_chave: string[];
  descricao: string;
}

export interface TemplateInteligente {
  id: string;
  nome: string;
  tipologia: 'residencial' | 'comercial' | 'industrial' | 'institucional';
  porte: 'pequeno' | 'medio' | 'grande';
  complexidade: 'baixa' | 'media' | 'alta';
  etapas_obrigatorias: string[];
  tarefas_criticas: string[];
  tempo_total_estimado: number;
  margem_seguranca: number; // %
  tarefas_templates: TarefaTemplate[];
}

export interface AnaliseInteligente {
  tarefa_sugerida?: TarefaTemplate;
  tempo_estimado: number;
  posicao_recomendada: number;
  etapa_recomendada: string;
  responsavel_sugerido: string;
  requer_aprovacao: boolean;
  justificativa: string;
  confianca: number; // 0-100%
  alternativas: TarefaTemplate[];
}

// ===== DADOS PARA ANÁLISE DE SIMILARIDADE =====
export interface AnaliseTexto {
  texto_original: string;
  palavras_normalizadas: string[];
  score_similaridade: number;
  template_correspondente?: TarefaTemplate;
}

// ===== CONFIGURAÇÕES DE APRENDIZADO =====
export interface ConfiguracaoIA {
  limite_sugestoes: number;
  threshold_confianca: number;
  peso_historico: number;
  peso_similaridade: number;
  ativo: boolean;
} 