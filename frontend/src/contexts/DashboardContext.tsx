'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// ===== INTERFACES COMPLETAS DA V7 =====
export interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida' | 'atrasada' | 'aguardando_aprovacao';
  responsavel: string;
  tempo_estimado: number;
  tempo_total: number;
  tempo_sessao_atual: number;
  cronometro_ativo: boolean;
  data_inicio?: string;
  data_conclusao?: string;
  data_entrega?: string;
  prioridade?: 'baixa' | 'media' | 'alta' | 'critica';
  requer_aprovacao: boolean;
  anotacao_sessao_atual?: string;
  notas_sessoes: any[];
  arquivos: any[];
  revisoes: any[];
  horas_estimadas?: number;
  dependencia_tarefa_id?: string;
  tem_dependencia?: boolean;
}

export interface Etapa {
  id: string;
  numero: number;
  nome: string;
  progresso: number;
  status: string;
  tarefas: Tarefa[];
}

export interface Projeto {
  id: string;
  nome: string;
  cliente: string;
  gerente: string;
  data_inicio: string;
  prazo_final: string;
  status: string;
  progresso_geral: number;
  tempo_total_estimado: number;
  tempo_total_trabalhado: number;
  etapas: Etapa[];
  comunicacao: any[];
  equipe: any[];
  atividades: any[];
  arquivos: any[];
}

export interface CronometroState {
  tarefaAtiva: string | null;
  cronometroAtivo: boolean;
  tempoSessaoAtual: number;
  anotacaoSessao: string;
  numeroSessoes: number;
  sessoesHistorico: Array<{
    id: string;
    inicio: Date;
    fim?: Date;
    duracao: number;
    anotacao: string;
  }>;
  anotacoesSalvas: Array<{
    id: string;
    sessao: number;
    tempo: number;
    texto: string;
    timestamp: Date;
    tarefaId: string;
  }>;
  tempoTotalTarefaAtual: number;
  tempoTotalProjeto: number;
}

export interface UIState {
  modoFoco: boolean;
  tarefaModoFoco: string | null;
  visualizacao: 'lista' | 'kanban' | 'timeline';
  etapasExpandidas: string[];
  tarefasDetalhesExpandidos: string[];
  modalPausaInteligente: boolean;
  pausaIniciada: Date | null;
  anotacaoSalva: boolean;
  isDirty: boolean;
}

export interface DashboardState {
  projeto: Projeto;
  cronometro: CronometroState;
  ui: UIState;
  loading: boolean;
  error: string | null;
}

// ===== ACTIONS =====
export type DashboardAction = 
  | { type: 'CARREGAR_PROJETO'; payload: Projeto }
  | { type: 'INICIAR_TAREFA'; payload: string }
  | { type: 'PAUSAR_CRONOMETRO' }
  | { type: 'RETOMAR_CRONOMETRO' }
  | { type: 'PARAR_CRONOMETRO' }
  | { type: 'INCREMENTAR_TEMPO' }
  | { type: 'SALVAR_ANOTACAO'; payload: { texto: string; tarefaId: string } }
  | { type: 'CONCLUIR_TAREFA'; payload: string }
  | { type: 'TOGGLE_MODO_FOCO' }
  | { type: 'TOGGLE_ETAPA'; payload: string }
  | { type: 'TOGGLE_TAREFA_DETALHE'; payload: string }
  | { type: 'ATUALIZAR_PROJETO'; payload: Partial<Projeto> }
  | { type: 'CRIAR_TAREFA'; payload: { etapaId: string; tarefa: Partial<Tarefa> } }
  | { type: 'EDITAR_TAREFA'; payload: { tarefaId: string; dados: Partial<Tarefa> } }
  | { type: 'EXCLUIR_TAREFA'; payload: string }
  | { type: 'MOVER_TAREFA'; payload: { tarefaId: string; etapaOrigemId: string; etapaDestinoId: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MARK_DIRTY'; payload: boolean };

// ===== DADOS MOCK COMPLETOS DA V7 =====
const PROJETO_MOCK: Projeto = {
  id: 'projeto_001',
  nome: 'Casa Residencial - Família Silva',
  cliente: 'João e Maria Silva',
  gerente: 'Ana Paula Arquiteta',
  data_inicio: '2024-03-01',
  prazo_final: '2024-06-15',
  status: 'em_andamento',
  progresso_geral: 68,
  tempo_total_estimado: 240,
  tempo_total_trabalhado: 163,
  etapas: [
    {
      id: 'etapa_001',
      numero: 1,
      nome: 'Estudos Preliminares',
      progresso: 85,
      status: 'em_andamento',
      tarefas: [
        {
          id: 'tarefa_001',
          nome: 'Levantamento topográfico e análise do terreno',
          status: 'concluida',
          responsavel: 'Carlos Topógrafo',
          tempo_estimado: 14*3600,
          tempo_total: 13.5*3600,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: '2024-03-01',
          data_conclusao: '2024-03-03',
          requer_aprovacao: false,
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        },
        {
          id: 'tarefa_002',
          nome: 'Programa de necessidades e briefing detalhado',
          status: 'em_progresso',
          responsavel: 'Ana Paula Arquiteta',
          tempo_estimado: 12*3600,
          tempo_total: 8.75*3600,
          tempo_sessao_atual: 2.25*3600,
          cronometro_ativo: true,
          data_inicio: '2024-03-04',
          data_entrega: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
          prioridade: 'alta',
          requer_aprovacao: true,
          anotacao_sessao_atual: 'Reunião com cliente agendada para revisar programa final',
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        },
        {
          id: 'tarefa_003',
          nome: 'Briefing cliente e validação final',
          status: 'aguardando_aprovacao',
          responsavel: 'Marina Arquiteta Jr.',
          tempo_estimado: 6*3600,
          tempo_total: 4*3600,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: '2024-03-05',
          requer_aprovacao: true,
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        }
      ]
    },
    {
      id: 'etapa_002',
      numero: 2,
      nome: 'Anteprojeto',
      progresso: 45,
      status: 'em_progresso',
      tarefas: [
        {
          id: 'tarefa_004',
          nome: 'Plantas baixas - Pavimento Térreo',
          status: 'em_progresso',
          responsavel: 'Ana Paula Arquiteta',
          tempo_estimado: 24*3600,
          tempo_total: 18.5*3600,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: '2024-03-06',
          data_entrega: new Date().toISOString().split('T')[0],
          prioridade: 'critica',
          requer_aprovacao: true,
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        },
        {
          id: 'tarefa_005',
          nome: 'Cortes e fachadas principais',
          status: 'em_revisao',
          responsavel: 'Carlos Designer',
          tempo_estimado: 16*3600,
          tempo_total: 12*3600,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: '2024-03-07',
          data_entrega: new Date().toISOString().split('T')[0],
          prioridade: 'alta',
          requer_aprovacao: true,
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        }
      ]
    }
  ],
  comunicacao: [
    {
      id: 'msg_001',
      usuario: 'Ana Paula Arquiteta',
      avatar: 'AP',
      mensagem: 'Pessoal, as plantas do térreo estão 90% prontas. Vou enviar para revisão ainda hoje.',
      data: '2024-03-08T15:30:00',
      mencoes: ['Carlos Designer', 'Marina Arquiteta Jr.']
    },
    {
      id: 'msg_002',
      usuario: 'Carlos Designer',
      avatar: 'CD',
      mensagem: 'Perfeito Ana! Já estou aguardando. Vou priorizar a revisão das fachadas também.',
      data: '2024-03-08T15:45:00',
      mencoes: []
    }
  ],
  equipe: [
    { id: 'user_001', nome: 'Ana Paula Arquiteta', role: 'Arquiteta Sênior', avatar: 'AP' },
    { id: 'user_002', nome: 'Carlos Designer', role: 'Designer', avatar: 'CD' },
    { id: 'user_003', nome: 'Marina Arquiteta Jr.', role: 'Arquiteta Junior', avatar: 'MJ' },
    { id: 'user_004', nome: 'Carlos Topógrafo', role: 'Topógrafo', avatar: 'CT' }
  ],
  atividades: [],
  arquivos: []
};

// ===== ESTADO INICIAL =====
const initialState: DashboardState = {
  projeto: PROJETO_MOCK,
  cronometro: {
    tarefaAtiva: 'tarefa_002', // Tarefa em progresso por padrão
    cronometroAtivo: false,
    tempoSessaoAtual: 0,
    anotacaoSessao: '',
    numeroSessoes: 1,
    sessoesHistorico: [],
    anotacoesSalvas: [],
    tempoTotalTarefaAtual: 8.75*3600,
    tempoTotalProjeto: 163*3600
  },
  ui: {
    modoFoco: false,
    tarefaModoFoco: null,
    visualizacao: 'lista',
    etapasExpandidas: ['etapa_001'],
    tarefasDetalhesExpandidos: [],
    modalPausaInteligente: false,
    pausaIniciada: null,
    anotacaoSalva: false,
    isDirty: false
  },
  loading: false,
  error: null
};

// ===== REDUCER =====
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'CARREGAR_PROJETO':
      return {
        ...state,
        projeto: action.payload,
        loading: false,
        error: null
      };

    case 'INICIAR_TAREFA':
      return {
        ...state,
        cronometro: {
          ...state.cronometro,
          tarefaAtiva: action.payload,
          cronometroAtivo: true,
          tempoSessaoAtual: 0,
          anotacaoSessao: ''
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'PAUSAR_CRONOMETRO':
      return {
        ...state,
        cronometro: {
          ...state.cronometro,
          cronometroAtivo: false
        },
        ui: {
          ...state.ui,
          modalPausaInteligente: true,
          pausaIniciada: new Date(),
          isDirty: true
        }
      };

    case 'RETOMAR_CRONOMETRO':
      return {
        ...state,
        cronometro: {
          ...state.cronometro,
          cronometroAtivo: true
        },
        ui: {
          ...state.ui,
          modalPausaInteligente: false,
          pausaIniciada: null,
          isDirty: true
        }
      };

    case 'PARAR_CRONOMETRO':
      return {
        ...state,
        cronometro: {
          ...state.cronometro,
          tarefaAtiva: null,
          cronometroAtivo: false,
          tempoSessaoAtual: 0,
          anotacaoSessao: ''
        },
        ui: {
          ...state.ui,
          modoFoco: false,
          tarefaModoFoco: null,
          modalPausaInteligente: false,
          pausaIniciada: null,
          isDirty: true
        }
      };

    case 'INCREMENTAR_TEMPO':
      return {
        ...state,
        cronometro: {
          ...state.cronometro,
          tempoSessaoAtual: state.cronometro.tempoSessaoAtual + 1,
          tempoTotalTarefaAtual: state.cronometro.tempoTotalTarefaAtual + 1,
          tempoTotalProjeto: state.cronometro.tempoTotalProjeto + 1
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'SALVAR_ANOTACAO':
      const novaAnotacao = {
        id: Date.now().toString(),
        sessao: state.cronometro.numeroSessoes,
        tempo: state.cronometro.tempoSessaoAtual,
        texto: action.payload.texto,
        timestamp: new Date(),
        tarefaId: action.payload.tarefaId
      };

      return {
        ...state,
        cronometro: {
          ...state.cronometro,
          anotacaoSessao: action.payload.texto,
          anotacoesSalvas: [...state.cronometro.anotacoesSalvas, novaAnotacao]
        },
        ui: {
          ...state.ui,
          anotacaoSalva: true,
          isDirty: true
        }
      };

    case 'CONCLUIR_TAREFA':
      return {
        ...state,
        projeto: {
          ...state.projeto,
          etapas: state.projeto.etapas.map(etapa => ({
            ...etapa,
            tarefas: etapa.tarefas.map(tarefa => 
              tarefa.id === action.payload
                ? { ...tarefa, status: 'concluida' as const, data_conclusao: new Date().toISOString().split('T')[0] }
                : tarefa
            )
          }))
        },
        cronometro: {
          ...state.cronometro,
          tarefaAtiva: null,
          cronometroAtivo: false,
          tempoSessaoAtual: 0,
          numeroSessoes: state.cronometro.numeroSessoes + 1
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'TOGGLE_MODO_FOCO':
      return {
        ...state,
        ui: {
          ...state.ui,
          modoFoco: !state.ui.modoFoco,
          tarefaModoFoco: !state.ui.modoFoco ? state.cronometro.tarefaAtiva : null
        }
      };

    case 'TOGGLE_ETAPA':
      const etapaExpandida = state.ui.etapasExpandidas.includes(action.payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          etapasExpandidas: etapaExpandida
            ? state.ui.etapasExpandidas.filter(id => id !== action.payload)
            : [...state.ui.etapasExpandidas, action.payload]
        }
      };

    case 'TOGGLE_TAREFA_DETALHE':
      const tarefaExpandida = state.ui.tarefasDetalhesExpandidos.includes(action.payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          tarefasDetalhesExpandidos: tarefaExpandida
            ? state.ui.tarefasDetalhesExpandidos.filter(id => id !== action.payload)
            : [...state.ui.tarefasDetalhesExpandidos, action.payload]
        }
      };

    case 'ATUALIZAR_PROJETO':
      return {
        ...state,
        projeto: {
          ...state.projeto,
          ...action.payload
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'CRIAR_TAREFA':
      const novaTarefa: Tarefa = {
        id: `tarefa_${Date.now()}`,
        nome: action.payload.tarefa.nome || 'Nova Tarefa',
        status: 'nao_iniciada',
        responsavel: action.payload.tarefa.responsavel || 'Não atribuído',
        tempo_estimado: action.payload.tarefa.tempo_estimado || 0,
        tempo_total: 0,
        tempo_sessao_atual: 0,
        cronometro_ativo: false,
        requer_aprovacao: action.payload.tarefa.requer_aprovacao || false,
        notas_sessoes: [],
        arquivos: [],
        revisoes: [],
        ...action.payload.tarefa
      };

      return {
        ...state,
        projeto: {
          ...state.projeto,
          etapas: state.projeto.etapas.map(etapa => 
            etapa.id === action.payload.etapaId
              ? { ...etapa, tarefas: [...etapa.tarefas, novaTarefa] }
              : etapa
          )
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'EDITAR_TAREFA':
      return {
        ...state,
        projeto: {
          ...state.projeto,
          etapas: state.projeto.etapas.map(etapa => ({
            ...etapa,
            tarefas: etapa.tarefas.map(tarefa => 
              tarefa.id === action.payload.tarefaId
                ? { ...tarefa, ...action.payload.dados }
                : tarefa
            )
          }))
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'EXCLUIR_TAREFA':
      return {
        ...state,
        projeto: {
          ...state.projeto,
          etapas: state.projeto.etapas.map(etapa => ({
            ...etapa,
            tarefas: etapa.tarefas.filter(tarefa => tarefa.id !== action.payload)
          }))
        },
        ui: {
          ...state.ui,
          isDirty: true
        }
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'MARK_DIRTY':
      return {
        ...state,
        ui: {
          ...state.ui,
          isDirty: action.payload
        }
      };

    default:
      return state;
  }
}

// ===== CONTEXT =====
const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | null>(null);

// ===== PROVIDER =====
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Carregar dados do projeto na inicialização
  useEffect(() => {
    // Simular carregamento de dados
    dispatch({ type: 'SET_LOADING', payload: true });
    
    setTimeout(() => {
      dispatch({ type: 'CARREGAR_PROJETO', payload: PROJETO_MOCK });
    }, 500);
  }, []);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

// ===== HOOK =====
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
} 