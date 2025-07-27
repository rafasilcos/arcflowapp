/**
 * 🎯 HOOK PARA GERENCIAMENTO INTELIGENTE DE DISCIPLINAS
 * Sistema robusto e performático para controle de disciplinas ativas
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { debounce } from 'lodash-es';
import { 
  Disciplina, 
  DisciplinaConfig, 
  FaseCronograma, 
  CalculoOrcamento,
  DISCIPLINAS_PADRAO,
  ENTREGAVEIS_POR_DISCIPLINA
} from '../types/disciplinas';
import { DisciplinasDebug } from '../utils/disciplinasDebug';
import { CronogramaOptimizer } from '../utils/cronogramaOptimizer';

interface DisciplinasStore {
  // Estado
  disciplinasDisponiveis: Disciplina[];
  disciplinasAtivas: Set<string>;
  configuracoes: Record<string, DisciplinaConfig>;
  calculoAtual: CalculoOrcamento | null;
  loading: boolean;
  error: string | null;
  orcamentoId: string | null;
  
  // Actions
  initializeDisciplinas: (disciplinas?: Disciplina[], configs?: Record<string, DisciplinaConfig>, orcamentoId?: string, useGlobalFallback?: boolean) => Promise<void>;
  toggleDisciplina: (codigo: string) => Promise<void>;
  updateConfiguracoes: (configs: Record<string, DisciplinaConfig>) => void;
  updateDisciplinaConfig: (codigo: string, config: Partial<DisciplinaConfig>) => void;
  recalcularOrcamento: () => Promise<void>;
  salvarConfiguracoes: () => Promise<void>;
  
  // Computed
  getDisciplinasAtivas: () => Disciplina[];
  getValorTotal: () => number;
  getCronogramaAtualizado: () => FaseCronograma[];
  canToggleDisciplina: (codigo: string) => { canToggle: boolean; reason?: string };
}

export const useDisciplinas = create<DisciplinasStore>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    disciplinasDisponiveis: DISCIPLINAS_PADRAO,
    disciplinasAtivas: new Set(['ARQUITETURA']), // Arquitetura sempre ativa
    configuracoes: {},
    calculoAtual: null,
    loading: false,
    error: null,
    orcamentoId: null,

    // Inicializar disciplinas
    initializeDisciplinas: async (disciplinas = DISCIPLINAS_PADRAO, configs?: Record<string, DisciplinaConfig>, orcamentoId?: string, useGlobalFallback = false) => {
      DisciplinasDebug.log('INITIALIZE_START', { orcamentoId, hasConfigs: !!configs, useGlobalFallback });
      set({ loading: true, error: null });
      
      try {
        // Se não foram passadas configurações, tentar carregar da API
        let configuracoesFinais = configs;
        let disciplinasAtivasFinais: Set<string>;
        
        if (!configs && orcamentoId) {
          // ✅ CORREÇÃO: Implementar fallback para configurações globais
          let dadosCarregados;
          
          if (useGlobalFallback) {
            // Primeiro tenta carregar configurações específicas do orçamento
            try {
              dadosCarregados = await loadDisciplinasConfig(orcamentoId);
              
              // Se não há configurações específicas, usar configurações globais
              if (!dadosCarregados.disciplinasAtivas || dadosCarregados.disciplinasAtivas.length <= 1) {
                DisciplinasDebug.log('FALLBACK_TO_GLOBAL', { orcamentoId });
                const configuracoesGlobais = await loadDisciplinasConfig('configuracoes-globais');
                
                // Usar configurações globais se existirem e forem mais completas
                if (configuracoesGlobais.disciplinasAtivas.length > 1) {
                  dadosCarregados = configuracoesGlobais;
                  DisciplinasDebug.log('GLOBAL_CONFIG_LOADED', { 
                    disciplinasAtivas: configuracoesGlobais.disciplinasAtivas 
                  });
                }
              }
            } catch (error) {
              // Se falhar, tentar apenas configurações globais
              DisciplinasDebug.log('LOADING_GLOBAL_ONLY', { error });
              dadosCarregados = await loadDisciplinasConfig('configuracoes-globais');
            }
          } else {
            // Carregamento normal sem fallback
            dadosCarregados = await loadDisciplinasConfig(orcamentoId);
          }
          
          configuracoesFinais = dadosCarregados.configuracoesPorDisciplina;
          disciplinasAtivasFinais = new Set(dadosCarregados.disciplinasAtivas);
          
          set({
            disciplinasDisponiveis: disciplinas,
            configuracoes: configuracoesFinais,
            disciplinasAtivas: disciplinasAtivasFinais,
            orcamentoId
          });
        } else {
          // Configurações passadas diretamente ou sem orcamentoId
          disciplinasAtivasFinais = new Set(
            disciplinas
              .filter(d => d.ativa || d.categoria === 'ESSENCIAL')
              .map(d => d.codigo)
          );
          
          set({
            disciplinasDisponiveis: disciplinas,
            configuracoes: configuracoesFinais || {},
            disciplinasAtivas: disciplinasAtivasFinais,
            orcamentoId
          });
        }
        
        // Recalcular após inicialização
        await get().recalcularOrcamento();
        
        DisciplinasDebug.log('INITIALIZE_SUCCESS', {
          disciplinasAtivas: Array.from(get().disciplinasAtivas),
          totalConfiguracoes: Object.keys(get().configuracoes).length,
          source: useGlobalFallback ? 'global-fallback' : 'direct'
        });
        
      } catch (error) {
        console.error('Erro ao inicializar disciplinas:', error);
        DisciplinasDebug.log('INITIALIZE_ERROR', error, 'error');
        set({ error: 'Erro ao carregar configurações' });
        
        // Fallback para configuração padrão
        set({
          disciplinasDisponiveis: disciplinas,
          configuracoes: {},
          disciplinasAtivas: new Set(['ARQUITETURA']),
          orcamentoId
        });
        // Recalcular de forma assíncrona
        get().recalcularOrcamento().catch(error => {
          console.error('Erro no recálculo fallback:', error);
        });
      } finally {
        set({ loading: false });
      }
    },

    // Toggle disciplina com validações
    toggleDisciplina: async (codigo: string) => {
      DisciplinasDebug.log('TOGGLE_START', { codigo });
      
      const { canToggle, reason } = get().canToggleDisciplina(codigo);
      
      if (!canToggle) {
        DisciplinasDebug.log('TOGGLE_BLOCKED', { codigo, reason }, 'warn');
        set({ error: reason });
        throw new Error(reason);
      }

      set({ loading: true, error: null });

      try {
        set((state) => {
          const novasAtivas = new Set(state.disciplinasAtivas);
          const disciplina = state.disciplinasDisponiveis.find(d => d.codigo === codigo);
          
          if (!disciplina) {
            throw new Error(`Disciplina ${codigo} não encontrada`);
          }

          if (novasAtivas.has(codigo)) {
            // Desativar disciplina
            novasAtivas.delete(codigo);
            
            // Desativar disciplinas dependentes
            state.disciplinasDisponiveis
              .filter(d => d.dependencias?.includes(codigo))
              .forEach(d => novasAtivas.delete(d.codigo));
              
          } else {
            // Ativar disciplina
            novasAtivas.add(codigo);
            
            // Ativar dependências obrigatórias
            disciplina.dependencias?.forEach(dep => {
              novasAtivas.add(dep);
            });
          }

          return { disciplinasAtivas: novasAtivas };
        });

        // Trigger recálculo automático (imediato)
        get().recalcularOrcamento().catch(error => {
          console.error('Erro no recálculo após toggle:', error);
        });
        
        DisciplinasDebug.log('TOGGLE_SUCCESS', {
          codigo,
          disciplinasAtivas: Array.from(get().disciplinasAtivas),
          valorTotal: get().getValorTotal()
        });
        
        // Salvar no backend (com debounce para evitar muitas chamadas)
        debouncedSave(get().disciplinasAtivas, get().configuracoes, get().orcamentoId);
        
      } catch (error) {
        DisciplinasDebug.log('TOGGLE_ERROR', { codigo, error }, 'error');
        set({ error: error instanceof Error ? error.message : 'Erro desconhecido' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Atualizar configurações
    updateConfiguracoes: (configs: Record<string, DisciplinaConfig>) => {
      set({ configuracoes: configs });
      get().recalcularOrcamento().catch(error => {
        console.error('Erro no recálculo após updateConfiguracoes:', error);
      });
    },

    // Atualizar configuração de uma disciplina específica
    updateDisciplinaConfig: (codigo: string, config: Partial<DisciplinaConfig>) => {
      set((state) => ({
        configuracoes: {
          ...state.configuracoes,
          [codigo]: {
            ...state.configuracoes[codigo],
            ...config
          }
        }
      }));
      
      get().recalcularOrcamento();
      
      // ✅ CORREÇÃO: Adicionar salvamento automático
      const { disciplinasAtivas, configuracoes, orcamentoId } = get();
      debouncedSave(disciplinasAtivas, configuracoes, orcamentoId);
    },

    // ✅ NOVA FUNÇÃO: Salvar configurações manualmente (para botão "Salvar")
    salvarConfiguracoes: async () => {
      const { disciplinasAtivas, configuracoes, orcamentoId } = get();
      set({ loading: true, error: null });
      
      try {
        await saveDisciplinasConfig(disciplinasAtivas, configuracoes, orcamentoId);
        DisciplinasDebug.log('SAVE_SUCCESS', {
          disciplinasAtivas: Array.from(disciplinasAtivas),
          totalConfiguracoes: Object.keys(configuracoes).length
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações';
        set({ error: errorMessage });
        DisciplinasDebug.log('SAVE_ERROR', { error }, 'error');
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // ✅ FUNÇÃO REORGANIZADA: Usar dados reais do banco quando disponíveis
    recalcularOrcamento: async () => {
      const state = get();
      const disciplinasAtivas = state.getDisciplinasAtivas();
      
      try {
        console.log('🔄 INICIANDO RECÁLCULO DO ORÇAMENTO');
        console.log(`   Disciplinas ativas: ${disciplinasAtivas.map(d => d.codigo).join(', ')}`);
        
        // ✅ PRIORIDADE 1: Verificar se há dados reais do banco (para orçamentos existentes)
        let cronograma;
        let valorTotal;
        let valorPorDisciplina;
        let prazoTotal;
        
        // Se há orcamentoId, tentar buscar dados reais do banco
        if (state.orcamentoId && state.orcamentoId !== 'demo' && state.orcamentoId !== 'configuracoes-globais') {
          try {
            console.log('🔍 Tentando carregar dados reais do banco para orçamento:', state.orcamentoId);
            
            const response = await fetch(`/api/orcamentos/${state.orcamentoId}`);
            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data) {
                const orcamentoReal = result.data;
                
                // Usar dados reais do banco
                valorTotal = parseFloat(orcamentoReal.valor_total || 0);
                valorPorDisciplina = {}; // TODO: Calcular por disciplina se necessário
                
                if (orcamentoReal.cronograma) {
                  const cronogramaReal = typeof orcamentoReal.cronograma === 'string' 
                    ? JSON.parse(orcamentoReal.cronograma) 
                    : orcamentoReal.cronograma;
                  
                  prazoTotal = cronogramaReal.prazoTotal || 0;
                  
                  // Converter cronograma do banco para formato esperado
                  cronograma = Object.values(cronogramaReal.fases || {}).map((fase: any) => {
                    // Converter disciplinas string para objetos Disciplina
                    const disciplinasAtivasNaFase = (fase.disciplinas || []).map((discCodigo: string) => {
                      const disciplinaEncontrada = state.disciplinasDisponiveis.find(d => 
                        d.codigo.toUpperCase() === discCodigo.toUpperCase()
                      );
                      return disciplinaEncontrada || {
                        id: discCodigo,
                        codigo: discCodigo,
                        nome: discCodigo,
                        icone: '📋',
                        categoria: 'ESSENCIAL' as const,
                        descricao: '',
                        valorBase: 0,
                        horasBase: 0,
                        ativa: true,
                        ordem: 1
                      };
                    });

                    return {
                      id: fase.nome?.replace(/\s+/g, '_').toUpperCase() || 'FASE',
                      ordem: fase.ordem || 1,
                      etapa: fase.etapa || '',
                      nome: fase.nome || '',
                      prazo: fase.prazo || 0,
                      valor: fase.valor || 0,
                      percentual: fase.percentual || 0,
                      disciplinas: fase.disciplinas || [],
                      disciplinasAtivasNaFase,
                      responsavel: fase.responsavel || 'Equipe Técnica',
                      entregaveis: fase.entregaveis || [],
                      ativa: true
                    };
                  });
                  
                  console.log('✅ Usando dados REAIS do banco:', {
                    valorTotal: `R$ ${valorTotal.toLocaleString('pt-BR')}`,
                    prazoTotal: `${prazoTotal} semanas`,
                    fonte: 'BANCO_DE_DADOS_REAL'
                  });
                }
              }
            }
          } catch (error) {
            console.warn('⚠️ Erro ao carregar dados reais, usando cálculo dinâmico:', error);
          }
        }
        
        // ✅ FALLBACK: Se não há dados reais, calcular dinamicamente
        if (!cronograma || !valorTotal) {
          console.log('🔄 Calculando dinamicamente (sem dados reais no banco)');
          
          cronograma = CronogramaOptimizer.calcularCronogramaOtimizado(disciplinasAtivas, state.configuracoes);
          valorTotal = await calcularValorTotal(disciplinasAtivas, state.configuracoes);
          valorPorDisciplina = await calcularValorPorDisciplina(disciplinasAtivas, state.configuracoes);
          prazoTotal = cronograma.reduce((total, fase) => total + (fase.ativa ? fase.prazo : 0), 0);
        }
        
        // Calcular estatísticas
        const estatisticas = {
          totalFases: cronograma.length,
          totalEntregaveis: cronograma.reduce((total, fase) => total + (fase.entregaveis?.length || 0), 0),
          fasesAtivas: cronograma.filter(f => f.ativa).length,
          disciplinasCount: disciplinasAtivas.length
        };

        const novoCalculo: CalculoOrcamento = {
          valorTotal,
          valorPorDisciplina: valorPorDisciplina || {},
          cronograma,
          prazoTotal,
          disciplinasAtivas: disciplinasAtivas.map(d => d.codigo),
          estatisticas
        };

        set({ calculoAtual: novoCalculo });
        
        console.log('✅ Orçamento atualizado:', {
          valorTotal: `R$ ${valorTotal.toLocaleString('pt-BR')}`,
          prazoTotal: `${prazoTotal} semanas`,
          disciplinasAtivas: disciplinasAtivas.length,
          fonte: cronograma.length > 0 && cronograma[0].id.includes('_') ? 'BANCO_DE_DADOS_REAL' : 'CALCULO_DINAMICO'
        });
        
      } catch (error) {
        console.error('❌ Erro no recálculo do orçamento:', error);
        set({ error: 'Erro ao recalcular orçamento' });
      }
    },

    // Computed: Disciplinas ativas
    getDisciplinasAtivas: () => {
      const { disciplinasDisponiveis, disciplinasAtivas } = get();
      return disciplinasDisponiveis
        .filter(d => disciplinasAtivas.has(d.codigo))
        .sort((a, b) => a.ordem - b.ordem);
    },

    // Computed: Valor total
    getValorTotal: () => {
      return get().calculoAtual?.valorTotal || 0;
    },

    // Computed: Cronograma atualizado
    getCronogramaAtualizado: () => {
      return get().calculoAtual?.cronograma || [];
    },

    // Validação se pode toggle disciplina
    canToggleDisciplina: (codigo: string) => {
      const { disciplinasDisponiveis, disciplinasAtivas } = get();
      const disciplina = disciplinasDisponiveis.find(d => d.codigo === codigo);
      
      if (!disciplina) {
        return { canToggle: false, reason: 'Disciplina não encontrada' };
      }

      // Disciplinas essenciais não podem ser desativadas
      if (disciplina.categoria === 'ESSENCIAL' && disciplinasAtivas.has(codigo)) {
        return { canToggle: false, reason: 'Disciplinas essenciais não podem ser desativadas' };
      }

      // Verificar se há disciplinas dependentes ativas
      if (disciplinasAtivas.has(codigo)) {
        const dependentes = disciplinasDisponiveis
          .filter(d => d.dependencias?.includes(codigo))
          .filter(d => disciplinasAtivas.has(d.codigo));
          
        if (dependentes.length > 0) {
          return { 
            canToggle: false, 
            reason: `Desative primeiro: ${dependentes.map(d => d.nome).join(', ')}` 
          };
        }
      }

      return { canToggle: true };
    }
  }))
);

// Funções auxiliares de cálculo

/**
 * 🎯 FUNÇÃO CRÍTICA: Calcular entregáveis dinâmicos por fase
 * Remove automaticamente entregáveis de disciplinas desativadas
 */
function calcularEntregaveisDinamicos(
  faseId: string,
  disciplinasAtivasCodigos: string[],
  entregaveisPorDisciplina: Record<string, Record<string, string[]>>
): string[] {
  const entregaveis: string[] = [];
  
  // Para cada disciplina ativa, buscar seus entregáveis específicos para esta fase
  for (const disciplinaCodigo of disciplinasAtivasCodigos) {
    const entregaveisDisciplina = entregaveisPorDisciplina[disciplinaCodigo];
    
    if (entregaveisDisciplina && entregaveisDisciplina[faseId]) {
      // Adicionar entregáveis específicos desta disciplina para esta fase
      entregaveis.push(...entregaveisDisciplina[faseId]);
    }
  }
  
  // Se não houver entregáveis específicos, usar entregáveis genéricos da arquitetura
  if (entregaveis.length === 0 && disciplinasAtivasCodigos.includes('ARQUITETURA')) {
    const entregaveisArquitetura = entregaveisPorDisciplina['ARQUITETURA'];
    if (entregaveisArquitetura && entregaveisArquitetura[faseId]) {
      entregaveis.push(...entregaveisArquitetura[faseId]);
    }
  }
  
  // Remover duplicatas e retornar
  return [...new Set(entregaveis)];
}

// ✅ NOVA FUNÇÃO: Buscar configurações da Tabela de Preços
async function buscarConfiguracoesTabelaPrecos(escritorioId: string = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11') {
  try {
    const response = await fetch(`/api/escritorios/${escritorioId}/configuracoes`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Erro ao buscar configurações da Tabela de Preços:', error);
  }
  
  return null;
}

/**
 * 🎯 FUNÇÃO REORGANIZADA: Calcular valor total com lógica centralizada e transparente
 * 
 * HIERARQUIA OFICIAL (SIMPLIFICADA):
 * 1º - TABELA DE PREÇOS (fonte única e oficial)
 * 2º - Parâmetros do projeto (área, região, etc.)
 * 3º - Fallback para valores padrão apenas se Tabela de Preços não existir
 */
async function calcularValorTotal(
  disciplinasAtivas: Disciplina[], 
  configuracoes: Record<string, DisciplinaConfig>,
  parametrosProjeto?: {
    area?: number;
    regiao?: string;
    padrao_construcao?: string;
    complexidade?: string;
  }
): Promise<number> {
  
  // ✅ ETAPA 1: Buscar configurações da Tabela de Preços (FONTE ÚNICA OFICIAL)
  const tabelaPrecos = await buscarConfiguracoesTabelaPrecos();
  
  if (!tabelaPrecos) {
    console.warn('⚠️ Tabela de Preços não encontrada - usando valores padrão');
    // Fallback simples apenas se não houver Tabela de Preços
    return disciplinasAtivas.reduce((total, disciplina) => {
      return total + disciplina.valorBase;
    }, 0);
  }

  // ✅ ETAPA 2: Definir parâmetros do projeto com valores padrão da Tabela de Preços
  const parametros = {
    area: parametrosProjeto?.area || 100,
    regiao: parametrosProjeto?.regiao || tabelaPrecos.configuracoes_escritorio?.regiao_principal || 'sudeste',
    padrao_construcao: parametrosProjeto?.padrao_construcao || 'medio',
    complexidade: parametrosProjeto?.complexidade || 'normal'
  };

  console.log('📊 Parâmetros do projeto:', parametros);

  let subtotal = 0;
  const detalhesCalculo: Array<{
    disciplina: string;
    valorBase: number;
    fonte: string;
    multiplicadores: {
      regional: number;
      padrao: number;
      complexidade: number;
    };
    valorFinal: number;
  }> = [];

  // ✅ ETAPA 3: Calcular valor por disciplina usando APENAS Tabela de Preços
  disciplinasAtivas.forEach(disciplina => {
    const disciplinaConfig = tabelaPrecos.disciplinas?.[disciplina.codigo];
    
    // Verificar se disciplina está ativa na Tabela de Preços
    if (!disciplinaConfig || !disciplinaConfig.ativo) {
      console.warn(`⚠️ Disciplina ${disciplina.codigo} não está ativa na Tabela de Preços`);
      return;
    }

    // ✅ CÁLCULO DO VALOR BASE (lógica simplificada)
    let valorBase: number;
    let fonte: string;

    if (parametros.area > 0 && disciplinaConfig.valor_por_m2 > 0) {
      // Prioridade 1: Valor por m² × área
      valorBase = disciplinaConfig.valor_por_m2 * parametros.area;
      fonte = `valor_por_m2 (R$ ${disciplinaConfig.valor_por_m2}/m² × ${parametros.area}m²)`;
    } else if (disciplinaConfig.valor_base > 0) {
      // Prioridade 2: Valor base fixo
      valorBase = disciplinaConfig.valor_base;
      fonte = 'valor_base';
    } else {
      // Fallback: Valor padrão da disciplina
      valorBase = disciplina.valorBase;
      fonte = 'valor_padrao_disciplina';
      console.warn(`⚠️ Usando valor padrão para ${disciplina.codigo}`);
    }

    // ✅ APLICAR MULTIPLICADORES (todos da Tabela de Preços)
    const multiplicadores = {
      regional: tabelaPrecos.multiplicadores_regionais?.[parametros.regiao]?.multiplicador || 1,
      padrao: tabelaPrecos.padroes_construcao?.[parametros.padrao_construcao]?.multiplicador || 1,
      complexidade: tabelaPrecos.multiplicadores_complexidade?.[parametros.complexidade] || 1
    };

    const valorFinal = valorBase * multiplicadores.regional * multiplicadores.padrao * multiplicadores.complexidade;
    subtotal += valorFinal;

    // Registrar detalhes para transparência
    detalhesCalculo.push({
      disciplina: disciplina.codigo,
      valorBase,
      fonte,
      multiplicadores,
      valorFinal
    });

    console.log(`💰 ${disciplina.codigo}: R$ ${valorBase.toFixed(2)} (${fonte}) × ${multiplicadores.regional} × ${multiplicadores.padrao} × ${multiplicadores.complexidade} = R$ ${valorFinal.toFixed(2)}`);
  });

  // ✅ ETAPA 4: Aplicar custos indiretos (todos da Tabela de Preços)
  let valorFinalComCustos = subtotal;
  
  if (tabelaPrecos.custos_indiretos) {
    const custos = tabelaPrecos.custos_indiretos;
    const multiplicadorCustos = (1 + custos.margem_lucro/100) * 
                               (1 + custos.overhead/100) * 
                               (1 + custos.impostos/100) * 
                               (1 + custos.reserva_contingencia/100) * 
                               (1 + custos.comissao_vendas/100);
    
    valorFinalComCustos = subtotal * multiplicadorCustos;
    
    console.log(`📊 Subtotal: R$ ${subtotal.toFixed(2)} × ${multiplicadorCustos.toFixed(3)} = R$ ${valorFinalComCustos.toFixed(2)}`);
    console.log(`   Custos: Lucro ${custos.margem_lucro}% + Overhead ${custos.overhead}% + Impostos ${custos.impostos}% + Contingência ${custos.reserva_contingencia}% + Comissão ${custos.comissao_vendas}%`);
  }

  // ✅ ETAPA 5: Log final para transparência total
  console.log('🎯 CÁLCULO FINALIZADO:', {
    fonte: 'Tabela de Preços (fonte única oficial)',
    parametros,
    disciplinasCalculadas: detalhesCalculo.length,
    subtotal,
    valorFinal: valorFinalComCustos,
    detalhes: detalhesCalculo
  });

  return valorFinalComCustos;
}

// ✅ FUNÇÃO CORRIGIDA: Calcular valor por disciplina COM custos indiretos distribuídos
async function calcularValorPorDisciplina(
  disciplinasAtivas: Disciplina[], 
  configuracoes: Record<string, DisciplinaConfig>,
  parametrosProjeto?: {
    area?: number;
    regiao?: string;
    padrao_construcao?: string;
    complexidade?: string;
  }
): Promise<Record<string, number>> {
  const valores: Record<string, number> = {};
  
  // 1. Buscar configurações da Tabela de Preços
  const tabelaPrecos = await buscarConfiguracoesTabelaPrecos();
  
  if (!tabelaPrecos) {
    // Fallback para sistema antigo
    disciplinasAtivas.forEach(disciplina => {
      const config = configuracoes[disciplina.codigo];
      const valor = config?.valorPersonalizado || disciplina.valorBase;
      const multiplicador = config?.multiplicadorComplexidade || 1;
      valores[disciplina.codigo] = valor * multiplicador;
    });
    return valores;
  }

  // 2. Usar configurações da Tabela de Preços
  const {
    area = 100,
    regiao = tabelaPrecos.configuracoes_escritorio?.regiao_principal || 'sudeste',
    padrao_construcao = 'medio',
    complexidade = 'normal'
  } = parametrosProjeto || {};

  // 3. Calcular valores base (sem custos indiretos)
  const valoresBase: Record<string, number> = {};
  let subtotalBase = 0;

  disciplinasAtivas.forEach(disciplina => {
    const disciplinaConfig = tabelaPrecos.disciplinas?.[disciplina.codigo];
    
    if (disciplinaConfig && disciplinaConfig.ativo) {
      let valorBase = disciplinaConfig.valor_base;
      
      if (area > 0 && disciplinaConfig.valor_por_m2 > 0) {
        valorBase = disciplinaConfig.valor_por_m2 * area;
      }
      
      const multRegional = tabelaPrecos.multiplicadores_regionais?.[regiao]?.multiplicador || 1;
      const multPadrao = tabelaPrecos.padroes_construcao?.[padrao_construcao]?.multiplicador || 1;
      const multComplexidade = tabelaPrecos.multiplicadores_complexidade?.[complexidade] || 1;
      
      const valorFinalBase = valorBase * multRegional * multPadrao * multComplexidade;
      valoresBase[disciplina.codigo] = valorFinalBase;
      subtotalBase += valorFinalBase;
    } else {
      // Se disciplina não está na tabela de preços, usar valor zero
      valoresBase[disciplina.codigo] = 0;
    }
  });

  // 4. ✅ CORREÇÃO PRINCIPAL: Aplicar custos indiretos proporcionalmente
  if (tabelaPrecos.custos_indiretos && subtotalBase > 0) {
    const custos = tabelaPrecos.custos_indiretos;
    const multiplicadorCustos = (1 + (custos.margem_lucro || 0)/100) * 
                               (1 + (custos.overhead || 0)/100) * 
                               (1 + (custos.impostos || 0)/100) * 
                               (1 + (custos.reserva_contingencia || 0)/100) * 
                               (1 + (custos.comissao_vendas || 0)/100) *
                               (1 + (custos.marketing || 0)/100) *
                               (1 + (custos.capacitacao || 0)/100) *
                               (1 + (custos.seguros || 0)/100);
    
    // Aplicar multiplicador de custos indiretos a cada disciplina
    disciplinasAtivas.forEach(disciplina => {
      const valorBase = valoresBase[disciplina.codigo] || 0;
      valores[disciplina.codigo] = Math.round(valorBase * multiplicadorCustos);
    });

    console.log('💰 Custos indiretos aplicados proporcionalmente:', {
      multiplicadorCustos: multiplicadorCustos.toFixed(3),
      subtotalBase,
      subtotalComCustos: Object.values(valores).reduce((sum, val) => sum + val, 0),
      detalhePorDisciplina: valores
    });
  } else {
    // Se não há custos indiretos, usar valores base
    disciplinasAtivas.forEach(disciplina => {
      valores[disciplina.codigo] = Math.round(valoresBase[disciplina.codigo] || 0);
    });
  }

  // 5. ✅ GARANTIR QUE NENHUMA DISCIPLINA TENHA VALOR R$ 0,00 (exceto se explicitamente desativada)
  disciplinasAtivas.forEach(disciplina => {
    if (valores[disciplina.codigo] === 0) {
      // Se valor é zero, usar um valor mínimo baseado na categoria da disciplina
      const valorMinimo = disciplina.categoria === 'ESSENCIAL' ? 5000 : 
                         disciplina.categoria === 'ESPECIALIZADA' ? 3000 : 1500;
      
      valores[disciplina.codigo] = valorMinimo;
      
      console.warn(`⚠️ Disciplina ${disciplina.codigo} tinha valor R$ 0,00 - aplicado valor mínimo: R$ ${valorMinimo.toLocaleString('pt-BR')}`);
    }
  });
  
  return valores;
}

// Função debounced para salvar configurações (evita muitas chamadas à API)
const debouncedSave = debounce(async (
  disciplinasAtivas: Set<string>, 
  configuracoes: Record<string, DisciplinaConfig>,
  orcamentoId?: string | null
) => {
  if (orcamentoId) {
    try {
      await saveDisciplinasConfig(disciplinasAtivas, configuracoes, orcamentoId);
    } catch (error) {
      console.error('❌ Erro no salvamento debounced:', error);
    }
  }
}, 500);

// Função para salvar configurações na API
async function saveDisciplinasConfig(
  disciplinasAtivas: Set<string>, 
  configuracoes: Record<string, DisciplinaConfig>,
  orcamentoId?: string
): Promise<void> {
  try {
    // Se não tiver orcamentoId, usar um padrão para demo
    const id = orcamentoId || 'demo';
    
    const response = await fetch(`/api/orcamentos/${id}/disciplinas`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        disciplinasAtivas: Array.from(disciplinasAtivas),
        configuracoesPorDisciplina: configuracoes
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro desconhecido');
    }

    console.log('💾 Configurações salvas com sucesso:', result.data);
    
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
    throw error;
  }
}

// Função para carregar configurações da API
async function loadDisciplinasConfig(orcamentoId?: string): Promise<{
  disciplinasAtivas: string[];
  configuracoesPorDisciplina: Record<string, DisciplinaConfig>;
}> {
  try {
    const id = orcamentoId || 'demo';
    
    const response = await fetch(`/api/orcamentos/${id}/disciplinas`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro desconhecido');
    }

    return {
      disciplinasAtivas: result.data.disciplinasAtivas || ['ARQUITETURA'],
      configuracoesPorDisciplina: result.data.configuracoesPorDisciplina || {}
    };
    
  } catch (error) {
    console.error('❌ Erro ao carregar configurações:', error);
    // Retornar configuração padrão em caso de erro
    return {
      disciplinasAtivas: ['ARQUITETURA'],
      configuracoesPorDisciplina: {}
    };
  }
}