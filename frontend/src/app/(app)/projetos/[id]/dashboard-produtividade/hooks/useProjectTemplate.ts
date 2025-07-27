import { useState, useEffect } from 'react';
import { ProjectTemplate, Etapa, Tarefa } from '../data/projectTemplates';
import { detectAndLoadTemplate, BriefingData } from '../templates/index';
import { useProjectCrud } from './useProjectCrud';

// ===== HOOK PARA GERENCIAR TEMPLATES DE PROJETO =====
export function useProjectTemplate(projetoId: string, briefingData?: BriefingData) {
  const [template, setTemplate] = useState<ProjectTemplate | null>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar template baseado no projeto
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        setError(null);

        // Detectar e carregar template dinamicamente
        const detectedTemplate = await detectAndLoadTemplate(projetoId, briefingData);
        
        if (detectedTemplate) {
          setTemplate(detectedTemplate);
          setEtapas(detectedTemplate.etapas);
          console.log(`🎯 Template carregado: ${detectedTemplate.nome} (${detectedTemplate.tipologia})`);
        } else {
          setError('Template não encontrado para este projeto');
        }
      } catch (err) {
        setError('Erro ao carregar template do projeto');
        console.error('Erro no useProjectTemplate:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [projetoId, briefingData]);

  // Função para atualizar etapas (mantém integração com o timer)
  const updateEtapas = (newEtapas: Etapa[]) => {
    setEtapas(newEtapas);
  };

  // Função para obter tarefa por ID
  const getTarefaById = (tarefaId: number): Tarefa | null => {
    for (const etapa of etapas) {
      const tarefa = etapa.tarefas.find(t => t.id === tarefaId);
      if (tarefa) return tarefa;
    }
    return null;
  };

  // Função para atualizar tarefa específica
  const updateTarefa = (tarefaId: number, updates: Partial<Tarefa>) => {
    setEtapas(prevEtapas => 
      prevEtapas.map(etapa => ({
        ...etapa,
        tarefas: etapa.tarefas.map(tarefa => 
          tarefa.id === tarefaId 
            ? { ...tarefa, ...updates }
            : tarefa
        )
      }))
    );
  };

  // Função para obter estatísticas do projeto
  const getProjectStats = () => {
    const totalTarefas = etapas.reduce((total, etapa) => total + etapa.tarefas.length, 0);
    const tarefasConcluidas = etapas.reduce((total, etapa) => 
      total + etapa.tarefas.filter(t => t.status === 'concluida').length, 0
    );
    const tarefasEmAndamento = etapas.reduce((total, etapa) => 
      total + etapa.tarefas.filter(t => t.status === 'em_andamento').length, 0
    );
    const tarefasAtrasadas = etapas.reduce((total, etapa) => 
      total + etapa.tarefas.filter(t => t.status === 'atrasada' || 
        (t.dataVencimento < '2024-12-19' && t.status !== 'concluida')).length, 0
    );
    const tarefasEmRevisao = etapas.reduce((total, etapa) => 
      total + etapa.tarefas.filter(t => t.status === 'em_revisao').length, 0
    );

    return {
      total: totalTarefas,
      concluidas: tarefasConcluidas,
      emAndamento: tarefasEmAndamento,
      atrasadas: tarefasAtrasadas,
      emRevisao: tarefasEmRevisao,
      progresso: totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0
    };
  };

  // Função para obter tarefas por filtro
  const getTarefasByFilter = (filter: 'hoje' | 'amanha' | 'atrasadas' | 'revisao') => {
    const allTarefas = etapas.flatMap(etapa => etapa.tarefas);
    
    switch (filter) {
      case 'hoje':
        return allTarefas.filter(t => 
          t.dataVencimento === '2024-12-20' || t.dataVencimento === '2024-12-19'
        );
      case 'amanha':
        return allTarefas.filter(t => 
          t.dataVencimento === '2024-12-22' || t.dataVencimento === '2024-12-25'
        );
      case 'atrasadas':
        return allTarefas.filter(t => 
          t.status === 'atrasada' || 
          (t.dataVencimento < '2024-12-19' && t.status !== 'concluida')
        );
      case 'revisao':
        return allTarefas.filter(t => t.status === 'em_revisao');
      default:
        return [];
    }
  };

  // ===== INTEGRAÇÃO COM CRUD =====
  const crudOperations = useProjectCrud(etapas, updateEtapas);

  return {
    template,
    etapas,
    loading,
    updateEtapas,
    getProjectStats,
    getTarefasByFilter,
    
    // CRUD Operations (com prioridade para as versões do CRUD)
    ...crudOperations,
    
    // Sobrescrever error para combinar ambos
    error: error || crudOperations.error
  };
} 