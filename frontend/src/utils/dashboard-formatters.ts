// ===== UTILITÁRIOS DASHBOARD ENTERPRISE =====
// Extraído da página original de 4277 linhas do Rafael

// ===== FORMATAÇÃO DE TEMPO =====
export const formatarTempo = (segundos: number): string => {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = segundos % 60;
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
};

export const formatarTempoSimples = (segundos: number): string => {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  
  if (horas > 0) {
    return `${horas}h ${minutos}min`;
  }
  return `${minutos}min`;
};

// ===== CORES E ESTILOS PARA STATUS =====
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'nao_iniciada': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'em_progresso': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'em_revisao': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'concluida': return 'bg-green-100 text-green-800 border-green-200';
    case 'atrasada': return 'bg-red-100 text-red-800 border-red-200';
    case 'aguardando_aprovacao': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'nao_iniciada': return '⭕';
    case 'em_progresso': return '🔄';
    case 'em_revisao': return '👁️';
    case 'concluida': return '✅';
    case 'atrasada': return '⚠️';
    case 'aguardando_aprovacao': return '⏳';
    default: return '❓';
  }
};

// ===== DEBOUNCE FUNCTION =====
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ===== CACHE MANAGER LOCAL =====
export const CacheManager = {
  set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`arcflow_${key}`, JSON.stringify(item));
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(`arcflow_${key}`);
      if (!item) return null;
      
      const { data, timestamp, ttl } = JSON.parse(item);
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`arcflow_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  
  clear: (pattern?: string) => {
    if (pattern) {
      Object.keys(localStorage)
        .filter(key => key.includes(pattern))
        .forEach(key => localStorage.removeItem(key));
    }
  }
};

// ===== CALCULADORAS DE TEMPO =====
export const calcularTempoTotalRealTime = (tempoBase: number, tempoSessao: number): number => {
  return tempoBase + tempoSessao;
};

export const calcularTempoTarefaAtualRealTime = (tempoTotal: number, tempoSessao: number): number => {
  return tempoTotal + tempoSessao;
};

export const formatarTempoTotalRealTime = (tempoTotal: number, tempoSessao: number): string => {
  const tempoFinal = calcularTempoTotalRealTime(tempoTotal, tempoSessao);
  return formatarTempoSimples(tempoFinal);
};

// ===== VALIDAÇÃO DE IDS =====
export const gerarId = (prefixo: string): string => {
  return `${prefixo}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ===== FORMATAÇÃO DE DATAS =====
export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR');
};

export const calcularDiasRestantes = (prazoFinal: string): number => {
  const hoje = new Date();
  const prazo = new Date(prazoFinal);
  const diferenca = prazo.getTime() - hoje.getTime();
  return Math.ceil(diferenca / (1000 * 3600 * 24));
};

// ===== CÁLCULOS DE PRODUTIVIDADE =====
export const calcularPorcentagemProgresso = (tempoTrabalhado: number, tempoEstimado: number): number => {
  if (tempoEstimado === 0) return 0;
  return Math.min(100, Math.round((tempoTrabalhado / tempoEstimado) * 100));
};

export const calcularVelocidadeMedia = (tempoTrabalhado: number, diasTrabalhados: number): number => {
  if (diasTrabalhados === 0) return 0;
  return tempoTrabalhado / diasTrabalhados;
};

// ===== VALIDAÇÕES DE NEGÓCIO =====
export const validarNomeTarefa = (nome: string): { valido: boolean; erro?: string } => {
  if (!nome.trim()) {
    return { valido: false, erro: 'Nome da tarefa é obrigatório' };
  }
  if (nome.length < 3) {
    return { valido: false, erro: 'Nome deve ter pelo menos 3 caracteres' };
  }
  if (nome.length > 100) {
    return { valido: false, erro: 'Nome deve ter no máximo 100 caracteres' };
  }
  return { valido: true };
};

export const validarTempoEstimado = (tempo: number): { valido: boolean; erro?: string } => {
  if (tempo <= 0) {
    return { valido: false, erro: 'Tempo estimado deve ser maior que zero' };
  }
  if (tempo > 30 * 24 * 3600) { // 30 dias
    return { valido: false, erro: 'Tempo estimado não pode ser maior que 30 dias' };
  }
  return { valido: true };
};

// ===== ORDENAÇÃO E FILTROS =====
export const ordenarTarefasPorPrioridade = (tarefas: any[]): any[] => {
  const prioridades = { 'critica': 4, 'alta': 3, 'media': 2, 'baixa': 1 };
  return [...tarefas].sort((a, b) => {
    const prioridadeA = prioridades[a.prioridade as keyof typeof prioridades] || 0;
    const prioridadeB = prioridades[b.prioridade as keyof typeof prioridades] || 0;
    return prioridadeB - prioridadeA;
  });
};

export const filtrarTarefasPorStatus = (tarefas: any[], status: string[]): any[] => {
  return tarefas.filter(tarefa => status.includes(tarefa.status));
};

export const buscarTarefas = (tarefas: any[], termo: string): any[] => {
  const termoBusca = termo.toLowerCase().trim();
  if (!termoBusca) return tarefas;
  
  return tarefas.filter(tarefa =>
    tarefa.nome.toLowerCase().includes(termoBusca) ||
    tarefa.responsavel.toLowerCase().includes(termoBusca) ||
    (tarefa.anotacao_sessao_atual && tarefa.anotacao_sessao_atual.toLowerCase().includes(termoBusca))
  );
}; 