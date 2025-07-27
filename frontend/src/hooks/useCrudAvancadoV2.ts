// ===== HOOK DE CRUD AVANÇADO V2 =====
// Migrado da V7-Otimizado para V8-Modular

import { useState, useCallback } from 'react';
import { 
  Projeto, 
  Etapa, 
  Tarefa, 
  OperacaoCrud, 
  ResultadoValidacao,
  ModoEdicao,
  ConfirmacaoExclusao 
} from '@/types/dashboard-avancado';
import { ValidacaoInteligenteService } from '@/services/validacaoInteligente';
import { TemplatesInteligentesService } from '@/services/templatesInteligentes';

export interface UseCrudAvancadoProps {
  projeto: Projeto;
  onProjetoChange: (projeto: Projeto) => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export interface UseCrudAvancadoReturn {
  // Estados
  salvando: boolean;
  validacaoAtiva: ResultadoValidacao | null;
  modoEdicao: ModoEdicao;
  confirmacaoExclusao: ConfirmacaoExclusao;
  
  // Métodos de Projeto
  editarProjeto: (dados: Partial<Projeto>) => Promise<void>;
  
  // Métodos de Etapa
  criarEtapa: (dados: Partial<Etapa>) => Promise<void>;
  editarEtapa: (etapaId: string, dados: Partial<Etapa>) => Promise<void>;
  duplicarEtapa: (etapaId: string) => Promise<void>;
  excluirEtapa: (etapaId: string) => Promise<void>;
  reordenarEtapa: (etapaId: string, novaPosicao: number) => Promise<void>;
  
  // Métodos de Tarefa
  criarTarefa: (etapaId: string, dados: Partial<Tarefa>) => Promise<void>;
  editarTarefa: (tarefaId: string, dados: Partial<Tarefa>) => Promise<void>;
  duplicarTarefa: (tarefaId: string) => Promise<void>;
  excluirTarefa: (tarefaId: string) => Promise<void>;
  moverTarefa: (tarefaId: string, etapaOrigemId: string, etapaDestinoId: string, novaPosicao?: number) => Promise<void>;
  concluirTarefa: (tarefaId: string) => Promise<void>;
  aprovarTarefa: (tarefaId: string) => Promise<void>;
  rejeitarTarefa: (tarefaId: string) => Promise<void>;
  
  // Métodos de UI
  abrirModalEdicao: (tipo: 'projeto' | 'etapa' | 'tarefa', id: string | null, acao: 'criar' | 'editar' | 'duplicar') => void;
  fecharModalEdicao: () => void;
  abrirConfirmacaoExclusao: (tipo: 'projeto' | 'etapa' | 'tarefa', id: string, nome: string) => void;
  fecharConfirmacaoExclusao: () => void;
  confirmarExclusao: () => Promise<void>;
  
  // Métodos de Validação
  validarOperacao: (operacao: OperacaoCrud) => Promise<ResultadoValidacao>;
  executarComValidacao: (operacao: OperacaoCrud) => Promise<void>;
  fecharValidacao: () => void;
}

export function useCrudAvancado({
  projeto,
  onProjetoChange,
  onError,
  onSuccess
}: UseCrudAvancadoProps): UseCrudAvancadoReturn {
  
  // ===== ESTADOS =====
  const [salvando, setSalvando] = useState(false);
  const [validacaoAtiva, setValidacaoAtiva] = useState<ResultadoValidacao | null>(null);
  const [modoEdicao, setModoEdicao] = useState<ModoEdicao>({
    tipo: null,
    acao: 'criar',
    id: null
  });
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<ConfirmacaoExclusao>({
    aberto: false,
    tipo: 'tarefa',
    id: '',
    nome: ''
  });

  // ===== MÉTODOS AUXILIARES =====
  const registrarAcao = useCallback((acao: string, tipo: string, itemId: string) => {
    console.log(`🔄 ${acao} ${tipo} ${itemId}`);
    // Aqui seria integrado com sistema de log/auditoria
  }, []);

  const atualizarProjeto = useCallback((novosProjeto: Projeto) => {
    onProjetoChange(novosProjeto);
    onSuccess?.('Operação realizada com sucesso!');
  }, [onProjetoChange, onSuccess]);

  const tratarErro = useCallback((erro: string) => {
    console.error('Erro CRUD:', erro);
    onError?.(erro);
  }, [onError]);

  // ===== MÉTODOS DE VALIDAÇÃO =====
  const validarOperacao = useCallback(async (operacao: OperacaoCrud): Promise<ResultadoValidacao> => {
    return await ValidacaoInteligenteService.validarOperacao(operacao, projeto);
  }, [projeto]);

  const executarComValidacao = useCallback(async (operacao: OperacaoCrud) => {
    setSalvando(true);
    try {
      const validacao = await validarOperacao(operacao);
      
      if (!validacao.pode_prosseguir) {
        setValidacaoAtiva(validacao);
        return;
      }

      if (validacao.requer_confirmacao) {
        setValidacaoAtiva(validacao);
        return;
      }

      // Executar operação
      await executarOperacao(operacao);
    } catch (error) {
      tratarErro('Erro na validação');
    } finally {
      setSalvando(false);
    }
  }, [validarOperacao, tratarErro]);

  const executarOperacao = useCallback(async (operacao: OperacaoCrud) => {
    switch (operacao.entidade) {
      case 'etapa':
        if (operacao.tipo === 'criar') {
          executarCriacaoEtapa(operacao.dados);
        } else if (operacao.tipo === 'excluir' && operacao.id) {
          executarExclusaoEtapa(operacao.id);
        }
        break;
      case 'tarefa':
        if (operacao.tipo === 'criar' && operacao.dados?.etapaId) {
          executarCriacaoTarefa(operacao.dados.etapaId, operacao.dados);
        } else if (operacao.tipo === 'excluir' && operacao.id) {
          executarExclusaoTarefa(operacao.id);
        }
        break;
    }
  }, []);

  const fecharValidacao = useCallback(() => {
    setValidacaoAtiva(null);
  }, []);

  // ===== MÉTODOS DE PROJETO =====
  const editarProjeto = useCallback(async (dados: Partial<Projeto>) => {
    setSalvando(true);
    try {
      const projetoAtualizado = { ...projeto, ...dados };
      registrarAcao('EDITAR', 'PROJETO', projeto.id);
      atualizarProjeto(projetoAtualizado);
    } catch (error) {
      tratarErro('Erro ao editar projeto');
    } finally {
      setSalvando(false);
    }
  }, [projeto, registrarAcao, atualizarProjeto, tratarErro]);

  // ===== MÉTODOS DE ETAPA =====
  const criarEtapa = useCallback(async (dados: Partial<Etapa>) => {
    const operacao: OperacaoCrud = {
      tipo: 'criar',
      entidade: 'etapa',
      dados
    };
    await executarComValidacao(operacao);
  }, [executarComValidacao]);

  const executarCriacaoEtapa = useCallback((dados: Partial<Etapa>) => {
    const novaEtapa: Etapa = {
      id: `etapa_${Date.now()}`,
      numero: projeto.etapas.length + 1,
      nome: dados.nome || 'Nova Etapa',
      progresso: 0,
      status: 'nao_iniciada',
      tarefas: [],
      ...dados
    };

    const projetoAtualizado = {
      ...projeto,
      etapas: [...projeto.etapas, novaEtapa]
    };

    registrarAcao('CRIAR', 'ETAPA', novaEtapa.id);
    atualizarProjeto(projetoAtualizado);
  }, [projeto, registrarAcao, atualizarProjeto]);

  const editarEtapa = useCallback(async (etapaId: string, dados: Partial<Etapa>) => {
    setSalvando(true);
    try {
      const etapasAtualizadas = projeto.etapas.map(etapa =>
        etapa.id === etapaId ? { ...etapa, ...dados } : etapa
      );

      const projetoAtualizado = {
        ...projeto,
        etapas: etapasAtualizadas
      };

      registrarAcao('EDITAR', 'ETAPA', etapaId);
      atualizarProjeto(projetoAtualizado);
    } catch (error) {
      tratarErro('Erro ao editar etapa');
    } finally {
      setSalvando(false);
    }
  }, [projeto, registrarAcao, atualizarProjeto, tratarErro]);

  const duplicarEtapa = useCallback(async (etapaId: string) => {
    setSalvando(true);
    try {
      const etapaOriginal = projeto.etapas.find(e => e.id === etapaId);
      if (!etapaOriginal) throw new Error('Etapa não encontrada');

      const novaEtapa: Etapa = {
        ...etapaOriginal,
        id: `etapa_${Date.now()}`,
        numero: projeto.etapas.length + 1,
        nome: `${etapaOriginal.nome} (Cópia)`,
        tarefas: etapaOriginal.tarefas.map(tarefa => ({
          ...tarefa,
          id: `tarefa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'nao_iniciada' as const,
          tempo_total: 0,
          tempo_sessao_atual: 0,
          cronometro_ativo: false
        }))
      };

      const projetoAtualizado = {
        ...projeto,
        etapas: [...projeto.etapas, novaEtapa]
      };

      registrarAcao('DUPLICAR', 'ETAPA', etapaId);
      atualizarProjeto(projetoAtualizado);
    } catch (error) {
      tratarErro('Erro ao duplicar etapa');
    } finally {
      setSalvando(false);
    }
  }, [projeto, registrarAcao, atualizarProjeto, tratarErro]);

  const excluirEtapa = useCallback(async (etapaId: string) => {
    const operacao: OperacaoCrud = {
      tipo: 'excluir',
      entidade: 'etapa',
      id: etapaId
    };
    await executarComValidacao(operacao);
  }, [executarComValidacao]);

  const executarExclusaoEtapa = useCallback((etapaId: string) => {
    const etapasAtualizadas = projeto.etapas.filter(etapa => etapa.id !== etapaId);
    
    // Reordenar números das etapas
    const etapasReordenadas = etapasAtualizadas.map((etapa, index) => ({
      ...etapa,
      numero: index + 1
    }));

    const projetoAtualizado = {
      ...projeto,
      etapas: etapasReordenadas
    };

    registrarAcao('EXCLUIR', 'ETAPA', etapaId);
    atualizarProjeto(projetoAtualizado);
  }, [projeto, registrarAcao, atualizarProjeto]);

  const reordenarEtapa = useCallback(async (etapaId: string, novaPosicao: number) => {
    setSalvando(true);
    try {
      const etapas = [...projeto.etapas];
      const etapaIndex = etapas.findIndex(e => e.id === etapaId);
      
      if (etapaIndex === -1) throw new Error('Etapa não encontrada');
      
      const [etapaMovida] = etapas.splice(etapaIndex, 1);
      etapas.splice(novaPosicao, 0, etapaMovida);
      
      // Atualizar números
      const etapasReordenadas = etapas.map((etapa, index) => ({
        ...etapa,
        numero: index + 1
      }));

      const projetoAtualizado = {
        ...projeto,
        etapas: etapasReordenadas
      };

      registrarAcao('REORDENAR', 'ETAPA', etapaId);
      atualizarProjeto(projetoAtualizado);
    } catch (error) {
      tratarErro('Erro ao reordenar etapa');
    } finally {
      setSalvando(false);
    }
  }, [projeto, registrarAcao, atualizarProjeto, tratarErro]);

  // ===== MÉTODOS DE TAREFA =====
  const criarTarefa = useCallback(async (etapaId: string, dados: Partial<Tarefa>) => {
    const operacao: OperacaoCrud = {
      tipo: 'criar',
      entidade: 'tarefa',
      dados: { ...dados, etapaId }
    };
    await executarComValidacao(operacao);
  }, [executarComValidacao]);

  const executarCriacaoTarefa = useCallback((etapaId: string, dados: Partial<Tarefa>) => {
    // Usar análise inteligente para sugerir dados
    const analise = TemplatesInteligentesService.analisarTarefaInteligente(
      dados.nome || 'Nova Tarefa',
      etapaId
    );

    const novaTarefa: Tarefa = {
      id: `tarefa_${Date.now()}`,
      nome: dados.nome || 'Nova Tarefa',
      status: 'nao_iniciada',
      responsavel: dados.responsavel || analise.responsavel_sugerido,
      tempo_estimado: dados.tempo_estimado || analise.tempo_estimado,
      tempo_total: 0,
      tempo_sessao_atual: 0,
      cronometro_ativo: false,
      requer_aprovacao: dados.requer_aprovacao ?? analise.requer_aprovacao,
      notas_sessoes: [],
      arquivos: [],
      revisoes: [],
      ...dados
    };

    const etapasAtualizadas = projeto.etapas.map(etapa =>
      etapa.id === etapaId
        ? { ...etapa, tarefas: [...etapa.tarefas, novaTarefa] }
        : etapa
    );

    const projetoAtualizado = {
      ...projeto,
      etapas: etapasAtualizadas
    };

    registrarAcao('CRIAR', 'TAREFA', novaTarefa.id);
    atualizarProjeto(projetoAtualizado);
  }, [projeto, registrarAcao, atualizarProjeto]);

  const editarTarefa = useCallback(async (tarefaId: string, dados: Partial<Tarefa>) => {
    setSalvando(true);
    try {
      const etapasAtualizadas = projeto.etapas.map(etapa => ({
        ...etapa,
        tarefas: etapa.tarefas.map(tarefa =>
          tarefa.id === tarefaId ? { ...tarefa, ...dados } : tarefa
        )
      }));

      const projetoAtualizado = {
        ...projeto,
        etapas: etapasAtualizadas
      };

      registrarAcao('EDITAR', 'TAREFA', tarefaId);
      atualizarProjeto(projetoAtualizado);
    } catch (error) {
      tratarErro('Erro ao editar tarefa');
    } finally {
      setSalvando(false);
    }
  }, [projeto, registrarAcao, atualizarProjeto, tratarErro]);

  const duplicarTarefa = useCallback(async (tarefaId: string) => {
    setSalvando(true);
    try {
      let tarefaOriginal: Tarefa | undefined;
      let etapaId: string | undefined;

      // Encontrar a tarefa
      projeto.etapas.forEach(etapa => {
        const tarefa = etapa.tarefas.find(t => t.id === tarefaId);
        if (tarefa) {
          tarefaOriginal = tarefa;
          etapaId = etapa.id;
        }
      });

      if (!tarefaOriginal || !etapaId) throw new Error('Tarefa não encontrada');

      const novaTarefa: Tarefa = {
        ...tarefaOriginal,
        id: `tarefa_${Date.now()}`,
        nome: `${tarefaOriginal.nome} (Cópia)`,
        status: 'nao_iniciada',
        tempo_total: 0,
        tempo_sessao_atual: 0,
        cronometro_ativo: false
      };

      const etapasAtualizadas = projeto.etapas.map(etapa =>
        etapa.id === etapaId
          ? { ...etapa, tarefas: [...etapa.tarefas, novaTarefa] }
          : etapa
      );

      const projetoAtualizado = {
        ...projeto,
        etapas: etapasAtualizadas
      };

      registrarAcao('DUPLICAR', 'TAREFA', tarefaId);
      atualizarProjeto(projetoAtualizado);
    } catch (error) {
      tratarErro('Erro ao duplicar tarefa');
    } finally {
      setSalvando(false);
    }
  }, [projeto, registrarAcao, atualizarProjeto, tratarErro]);

  const excluirTarefa = useCallback(async (tarefaId: string) => {
    const operacao: OperacaoCrud = {
      tipo: 'excluir',
      entidade: 'tarefa',
      id: tarefaId
    };
    await executarComValidacao(operacao);
  }, [executarComValidacao]);

  const executarExclusaoTarefa = useCallback((tarefaId: string) => {
    const etapasAtualizadas = projeto.etapas.map(etapa => ({
      ...etapa,
      tarefas: etapa.tarefas.filter(tarefa => tarefa.id !== tarefaId)
    }));

    const projetoAtualizado = {
      ...projeto,
      etapas: etapasAtualizadas
    };

    registrarAcao('EXCLUIR', 'TAREFA', tarefaId);
    atualizarProjeto(projetoAtualizado);
  }, [projeto, registrarAcao, atualizarProjeto]);

  const moverTarefa = useCallback(async (
    tarefaId: string, 
    etapaOrigemId: string, 
    etapaDestinoId: string, 
    novaPosicao?: number
  ) => {
    const operacao: OperacaoCrud = {
      tipo: 'mover',
      entidade: 'tarefa',
      id: tarefaId,
      contexto: {
        etapa_origem: etapaOrigemId,
        etapa_destino: etapaDestinoId,
        posicao_destino: novaPosicao
      }
    };
    await executarComValidacao(operacao);
  }, [executarComValidacao]);

  const concluirTarefa = useCallback(async (tarefaId: string) => {
    await editarTarefa(tarefaId, { 
      status: 'concluida',
      data_conclusao: new Date().toISOString()
    });
  }, [editarTarefa]);

  const aprovarTarefa = useCallback(async (tarefaId: string) => {
    await editarTarefa(tarefaId, { status: 'concluida' });
  }, [editarTarefa]);

  const rejeitarTarefa = useCallback(async (tarefaId: string) => {
    await editarTarefa(tarefaId, { status: 'em_progresso' });
  }, [editarTarefa]);

  // ===== MÉTODOS DE UI =====
  const abrirModalEdicao = useCallback((
    tipo: 'projeto' | 'etapa' | 'tarefa', 
    id: string | null, 
    acao: 'criar' | 'editar' | 'duplicar'
  ) => {
    setModoEdicao({ tipo, acao, id });
  }, []);

  const fecharModalEdicao = useCallback(() => {
    setModoEdicao({ tipo: null, acao: 'criar', id: null });
  }, []);

  const abrirConfirmacaoExclusao = useCallback((
    tipo: 'projeto' | 'etapa' | 'tarefa', 
    id: string, 
    nome: string
  ) => {
    setConfirmacaoExclusao({ aberto: true, tipo, id, nome });
  }, []);

  const fecharConfirmacaoExclusao = useCallback(() => {
    setConfirmacaoExclusao({ aberto: false, tipo: 'tarefa', id: '', nome: '' });
  }, []);

  const confirmarExclusao = useCallback(async () => {
    if (!confirmacaoExclusao.aberto) return;

    try {
      if (confirmacaoExclusao.tipo === 'etapa') {
        await excluirEtapa(confirmacaoExclusao.id);
      } else if (confirmacaoExclusao.tipo === 'tarefa') {
        await excluirTarefa(confirmacaoExclusao.id);
      }
      fecharConfirmacaoExclusao();
    } catch (error) {
      tratarErro('Erro ao confirmar exclusão');
    }
  }, [confirmacaoExclusao, excluirEtapa, excluirTarefa, fecharConfirmacaoExclusao, tratarErro]);

  return {
    // Estados
    salvando,
    validacaoAtiva,
    modoEdicao,
    confirmacaoExclusao,
    
    // Métodos de Projeto
    editarProjeto,
    
    // Métodos de Etapa
    criarEtapa,
    editarEtapa,
    duplicarEtapa,
    excluirEtapa,
    reordenarEtapa,
    
    // Métodos de Tarefa
    criarTarefa,
    editarTarefa,
    duplicarTarefa,
    excluirTarefa,
    moverTarefa,
    concluirTarefa,
    aprovarTarefa,
    rejeitarTarefa,
    
    // Métodos de UI
    abrirModalEdicao,
    fecharModalEdicao,
    abrirConfirmacaoExclusao,
    fecharConfirmacaoExclusao,
    confirmarExclusao,
    
    // Métodos de Validação
    validarOperacao,
    executarComValidacao,
    fecharValidacao
  };
} 