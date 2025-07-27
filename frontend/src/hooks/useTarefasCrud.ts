'use client';

// ===== HOOK CRUD TAREFAS ENTERPRISE =====
// Extraído da lógica da página original de 4277 linhas do Rafael

import { useState, useCallback } from 'react';
import { 
  Projeto, 
  Etapa, 
  Tarefa, 
  ModoEdicao, 
  ConfirmacaoExclusao, 
  HistoricoCrud,
  OperacaoCrud,
  ValidacaoImpacto,
  ResultadoValidacao
} from '@/types/dashboard';
import { gerarId, validarNomeTarefa, validarTempoEstimado } from '@/utils/dashboard-formatters';

export const useTarefasCrud = (projeto: Projeto, setProjeto: (projeto: Projeto) => void) => {
  // ===== ESTADOS PARA SISTEMA CRUD =====
  const [modoEdicao, setModoEdicao] = useState<ModoEdicao | null>(null);
  
  const [formData, setFormData] = useState<any>({});
  
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<ConfirmacaoExclusao | null>(null);
  
  const [historicoCrud, setHistoricoCrud] = useState<HistoricoCrud[]>([]);
  const [salvandoCrud, setSalvandoCrud] = useState(false);

  // ===== ESTADOS PARA SISTEMA DE VALIDAÇÃO INTELIGENTE =====
  const [validacaoAtiva, setValidacaoAtiva] = useState<ResultadoValidacao | null>(null);
  const [operacaoPendente, setOperacaoPendente] = useState<OperacaoCrud | null>(null);

  // ===== FUNÇÕES DE VALIDAÇÃO INTELIGENTE =====
  
  const validarDependencias = useCallback((operacao: OperacaoCrud): ValidacaoImpacto[] => {
    const validacoes: ValidacaoImpacto[] = [];
    
    if (operacao.tipo === 'excluir' && operacao.entidade === 'tarefa') {
      // Verificar dependências ao excluir tarefa
      const todasTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas);
      const tarefaDependente = todasTarefas.find(t => 
        // Aqui implementaria lógica de dependência real
        t.id !== operacao.id && t.status === 'aguardando_aprovacao'
      );
      
      if (tarefaDependente) {
        validacoes.push({
          id: gerarId('validacao'),
          tipo: 'warning',
          categoria: 'dependencia',
          mensagem: `Existem tarefas que podem depender desta. Verifique antes de excluir.`,
          impacto_estimado: {
            risco_qualidade: 'medio'
          },
          sugestoes: ['Revisar dependências', 'Confirmar com equipe'],
          pode_prosseguir: true
        });
      }
    }
    
    return validacoes;
  }, [projeto]);

  const calcularImpactoPrazos = useCallback((operacao: OperacaoCrud): ValidacaoImpacto[] => {
    const validacoes: ValidacaoImpacto[] = [];
    
    if (operacao.tipo === 'criar' && operacao.entidade === 'tarefa') {
      const tempoEstimado = operacao.dados?.tempo_estimado || 0;
      
      if (tempoEstimado > 8 * 3600) { // Mais de 8 horas
        validacoes.push({
          id: gerarId('validacao'),
          tipo: 'warning',
          categoria: 'prazo',
          mensagem: `Tarefa com ${Math.round(tempoEstimado / 3600)}h pode impactar cronograma`,
          impacto_estimado: {
            horas_adicionais: tempoEstimado,
            dias_atraso: Math.ceil(tempoEstimado / (8 * 3600))
          },
          sugestoes: ['Dividir em subtarefas', 'Alocar mais recursos'],
          pode_prosseguir: true
        });
      }
    }
    
    return validacoes;
  }, []);

  const validarOperacao = useCallback(async (operacao: OperacaoCrud): Promise<ResultadoValidacao> => {
    const validacoesDependencia = validarDependencias(operacao);
    const validacoesPrazo = calcularImpactoPrazos(operacao);
    
    const todasValidacoes = [...validacoesDependencia, ...validacoesPrazo];
    
    const resultado: ResultadoValidacao = {
      pode_prosseguir: todasValidacoes.every(v => v.pode_prosseguir),
      requer_confirmacao: todasValidacoes.some(v => v.tipo === 'warning'),
      validacoes: todasValidacoes,
      impacto_calculado: {
        tempo_total_novo: projeto.tempo_total_trabalhado,
        data_entrega_nova: projeto.prazo_final,
        dias_atraso: 0,
        custo_adicional: 0,
        tarefas_afetadas: []
      },
      sugestoes_alternativas: []
    };
    
    return resultado;
  }, [validarDependencias, calcularImpactoPrazos, projeto]);

  // ===== FUNÇÕES DE CRUD =====
  
  const registrarAcaoCrud = useCallback((
    acao: string, 
    tipo: 'projeto' | 'etapa' | 'tarefa', 
    itemId: string, 
    dadosAnteriores: any, 
    dadosNovos: any
  ) => {
    const novaAcao: HistoricoCrud = {
      id: gerarId('crud'),
      acao,
      tipo,
      itemId,
      dadosAnteriores,
      dadosNovos,
      timestamp: new Date(),
      usuario: 'Usuário Atual' // Em produção: pegar do contexto
    };
    
    setHistoricoCrud(prev => [...prev, novaAcao]);
    console.log(`📝 CRUD: ${acao} ${tipo} ${itemId}`);
  }, []);

  const criarEtapa = useCallback((dadosEtapa: Partial<Etapa>) => {
    const novaEtapa: Etapa = {
      id: gerarId('etapa'),
      numero: projeto.etapas.length + 1,
      nome: dadosEtapa.nome || 'Nova Etapa',
      progresso: 0,
      status: 'nao_iniciada',
      tarefas: []
    };
    
    const projetoAtualizado = {
      ...projeto,
      etapas: [...projeto.etapas, novaEtapa]
    };
    
    setProjeto(projetoAtualizado);
    registrarAcaoCrud('criar', 'etapa', novaEtapa.id, null, novaEtapa);
    
    console.log(`✅ Etapa criada: ${novaEtapa.nome}`);
  }, [projeto, setProjeto, registrarAcaoCrud]);

  const editarEtapa = useCallback((etapaId: string, dadosAtualizados: Partial<Etapa>) => {
    const etapaAntiga = projeto.etapas.find(e => e.id === etapaId);
    if (!etapaAntiga) return;
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas.map(etapa =>
        etapa.id === etapaId
          ? { ...etapa, ...dadosAtualizados }
          : etapa
      )
    };
    
    setProjeto(projetoAtualizado);
    registrarAcaoCrud('editar', 'etapa', etapaId, etapaAntiga, dadosAtualizados);
    
    console.log(`✏️ Etapa editada: ${etapaId}`);
  }, [projeto, setProjeto, registrarAcaoCrud]);

  const duplicarEtapa = useCallback((etapaId: string) => {
    const etapaOriginal = projeto.etapas.find(e => e.id === etapaId);
    if (!etapaOriginal) return;
    
    const etapaDuplicada: Etapa = {
      ...etapaOriginal,
      id: gerarId('etapa'),
      numero: projeto.etapas.length + 1,
      nome: `${etapaOriginal.nome} (Cópia)`,
      progresso: 0,
      tarefas: etapaOriginal.tarefas.map(tarefa => ({
        ...tarefa,
        id: gerarId('tarefa'),
        status: 'nao_iniciada',
        tempo_total: 0,
        tempo_sessao_atual: 0,
        cronometro_ativo: false,
        data_inicio: undefined,
        data_conclusao: undefined
      }))
    };
    
    const projetoAtualizado = {
      ...projeto,
      etapas: [...projeto.etapas, etapaDuplicada]
    };
    
    setProjeto(projetoAtualizado);
    registrarAcaoCrud('duplicar', 'etapa', etapaId, etapaOriginal, etapaDuplicada);
    
    console.log(`📋 Etapa duplicada: ${etapaDuplicada.nome}`);
  }, [projeto, setProjeto, registrarAcaoCrud]);

  const excluirEtapa = useCallback((etapaId: string) => {
    const etapaExcluida = projeto.etapas.find(e => e.id === etapaId);
    if (!etapaExcluida) return;
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas
        .filter(etapa => etapa.id !== etapaId)
        .map((etapa, index) => ({ ...etapa, numero: index + 1 }))
    };
    
    setProjeto(projetoAtualizado);
    registrarAcaoCrud('excluir', 'etapa', etapaId, etapaExcluida, null);
    
    console.log(`🗑️ Etapa excluída: ${etapaExcluida.nome}`);
  }, [projeto, setProjeto, registrarAcaoCrud]);

  const criarTarefa = useCallback(async (etapaId: string, dadosTarefa: Partial<Tarefa>) => {
    // Validar dados
    const validacaoNome = validarNomeTarefa(dadosTarefa.nome || '');
    const validacaoTempo = validarTempoEstimado(dadosTarefa.tempo_estimado || 0);
    
    if (!validacaoNome.valido) {
      alert(validacaoNome.erro);
      return;
    }
    
    if (!validacaoTempo.valido) {
      alert(validacaoTempo.erro);
      return;
    }
    
    // Validar operação
    const operacao: OperacaoCrud = {
      tipo: 'criar',
      entidade: 'tarefa',
      dados: dadosTarefa
    };
    
    const validacao = await validarOperacao(operacao);
    
    if (validacao.requer_confirmacao) {
      setValidacaoAtiva(validacao);
      setOperacaoPendente(operacao);
      return;
    }
    
    executarCriacaoTarefa(etapaId, dadosTarefa, validacao);
  }, [validarOperacao]);

  const executarCriacaoTarefa = useCallback((
    etapaId: string, 
    dadosTarefa: Partial<Tarefa>, 
    validacao?: ResultadoValidacao
  ) => {
    const novaTarefa: Tarefa = {
      id: gerarId('tarefa'),
      nome: dadosTarefa.nome || 'Nova Tarefa',
      status: 'nao_iniciada',
      responsavel: dadosTarefa.responsavel || 'Não atribuído',
      tempo_estimado: dadosTarefa.tempo_estimado || 3600,
      tempo_total: 0,
      tempo_sessao_atual: 0,
      cronometro_ativo: false,
      prioridade: dadosTarefa.prioridade || 'media',
      requer_aprovacao: dadosTarefa.requer_aprovacao || false,
      notas_sessoes: [],
      arquivos: [],
      revisoes: []
    };
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas.map(etapa =>
        etapa.id === etapaId
          ? { ...etapa, tarefas: [...etapa.tarefas, novaTarefa] }
          : etapa
      )
    };
    
    setProjeto(projetoAtualizado);
    registrarAcaoCrud('criar', 'tarefa', novaTarefa.id, null, novaTarefa);
    
    // Limpar validação
    setValidacaoAtiva(null);
    setOperacaoPendente(null);
    
    console.log(`✅ Tarefa criada: ${novaTarefa.nome}`);
  }, [projeto, setProjeto, registrarAcaoCrud]);

  // ===== FUNÇÕES DE MODAL E UI =====
  
  const abrirModalEdicao = useCallback((
    tipo: 'projeto' | 'etapa' | 'tarefa', 
    id: string | null, 
    acao: 'criar' | 'editar' | 'duplicar'
  ) => {
    setModoEdicao({ tipo, id, acao });
    
    // Preencher formData se for edição
    if (acao === 'editar' && id) {
      if (tipo === 'projeto') {
        setFormData(projeto);
      } else if (tipo === 'etapa') {
        const etapa = projeto.etapas.find(e => e.id === id);
        setFormData(etapa || {});
      } else if (tipo === 'tarefa') {
        const tarefa = projeto.etapas
          .flatMap(e => e.tarefas)
          .find(t => t.id === id);
        setFormData(tarefa || {});
      }
    } else {
      setFormData({});
    }
  }, [projeto]);

  const fecharModalEdicao = useCallback(() => {
    setModoEdicao(null);
    setFormData({});
    setValidacaoAtiva(null);
    setOperacaoPendente(null);
  }, []);

  const abrirConfirmacaoExclusao = useCallback((tipo: 'projeto' | 'etapa' | 'tarefa', id: string, nome: string) => {
    setConfirmacaoExclusao({ tipo, id, nome });
  }, []);

  const fecharConfirmacaoExclusao = useCallback(() => {
    setConfirmacaoExclusao(null);
  }, []);

  const confirmarExclusao = useCallback(async () => {
    if (!confirmacaoExclusao) return;
    
    const { tipo, id } = confirmacaoExclusao;
    
    try {
      setSalvandoCrud(true);
      
      // Validar a operação
      const operacao: OperacaoCrud = {
        tipo: 'excluir',
        entidade: tipo,
        id
      };
      
      const validacao = await validarOperacao(operacao);
      
      if (!validacao.pode_prosseguir) {
        setValidacaoAtiva(validacao);
        setOperacaoPendente(operacao);
        return;
      }
      
      // Executar exclusão
      let projetoAtualizado = { ...projeto };
      
      if (tipo === 'etapa') {
        projetoAtualizado.etapas = projeto.etapas.filter(e => e.id !== id);
      } else if (tipo === 'tarefa') {
        projetoAtualizado.etapas = projeto.etapas.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas.filter(t => t.id !== id)
        }));
      }
      
      setProjeto(projetoAtualizado);
      setConfirmacaoExclusao(null);
      
      // Registrar ação no histórico
      registrarAcaoCrud('excluir', tipo, id, null, null);
      
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      setSalvandoCrud(false);
    }
  }, [confirmacaoExclusao, projeto, setProjeto, validarOperacao, registrarAcaoCrud]);

  return {
    // Estados
    modoEdicao,
    formData,
    confirmacaoExclusao,
    historicoCrud,
    salvandoCrud,
    validacaoAtiva,
    operacaoPendente,
    
    // Setters
    setFormData,
    setSalvandoCrud,
    
    // Funções CRUD Etapas
    criarEtapa,
    editarEtapa,
    duplicarEtapa,
    excluirEtapa,
    
    // Funções CRUD Tarefas
    criarTarefa,
    executarCriacaoTarefa,
    
    // Funções UI
    abrirModalEdicao,
    fecharModalEdicao,
    abrirConfirmacaoExclusao,
    fecharConfirmacaoExclusao,
    confirmarExclusao,
    
    // Funções Validação
    validarOperacao
  };
}; 