'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  Save, 
  CheckCircle, 
  Clock, 
  FileText,
  AlertCircle,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Settings,
  Target
} from 'lucide-react';
import { BriefingCompleto, Secao, Pergunta } from '@/types/briefing';
import { useTheme } from '@/contexts/ThemeContext';
import { useBriefingTimer } from '@/hooks/useBriefingTimer';
import { filtrarSecoesVisiveis, filtrarPerguntasVisiveis, perguntaDeveSerExibida } from '@/utils/logicaCondicional';
import AnaliseResultado from './AnaliseResultado';
import PersonalizadorBriefing from './PersonalizadorBriefing';
import estruturaService, { EstruturaPersonalizadaService } from '@/services/estruturaPersonalizadaService';

interface InterfacePerguntasProps {
  briefing: BriefingCompleto;
  onVoltar: () => void;
  onSalvarRascunho?: (respostas: Record<string, any>) => void;
  onConcluir: (respostas: Record<string, any>) => void;
  respostasIniciais?: Record<string, any>;
  modoVisualizacao?: boolean;
  clienteId?: string;
  projetoId?: string;
  // Dados dinâmicos para o cabeçalho
  nomeProjeto?: string;
  nomeCliente?: string;
  dataReuniao?: string;
  disciplina?: string;
  area?: string;
  tipologia?: string;
  // 🔥 NOVO: Textos personalizados para os botões
  textoBotaoVoltar?: string;
  textoBotaoConcluir?: string;
  modoEdicao?: boolean;
}

export default function InterfacePerguntas({
  briefing,
  onVoltar,
  onSalvarRascunho,
  onConcluir,
  respostasIniciais = {},
  modoVisualizacao = false,
  clienteId = 'cliente-demo',
  projetoId,
  nomeProjeto,
  nomeCliente,
  dataReuniao,
  disciplina,
  area,
  tipologia,
  textoBotaoVoltar,
  textoBotaoConcluir,
  modoEdicao = false
}: InterfacePerguntasProps) {
  // 🔥 DEBUG CRÍTICO: Verificar props do cliente
  console.log('🎯 [InterfacePerguntas] Props recebidas:', {
    nomeCliente: nomeCliente,
    nomeProjeto: nomeProjeto,
    clienteId: clienteId,
    projetoId: projetoId,
    modoEdicao: modoEdicao,
    dataReuniao: dataReuniao,
    disciplina: disciplina,
    area: area,
    tipologia: tipologia,
    // Verificar origem dos dados do cliente
    propsCompletas: { nomeCliente, nomeProjeto, clienteId, projetoId }
  })
  
  // 🔍 DEBUG ESPECÍFICO: Nome do cliente
  console.log('🔍 [CLIENTE DEBUG] Análise detalhada:', {
    nomeClienteProp: nomeCliente,
    tipoNomeCliente: typeof nomeCliente,
    comprimentoNome: nomeCliente?.length,
    primeiraLetra: nomeCliente?.[0],
    conteudo: nomeCliente ? `"${nomeCliente}"` : 'undefined/null',
    clienteIdAssociado: clienteId,
    origemProvavelProblema: nomeCliente === 'Rafael Silveira Costa' ? 'PROBLEMA IDENTIFICADO' : 'OK'
  })

  const { tema, temaId } = useTheme();
  // const { timerData, startTimer, stopTimer, restoreTimer, formattedTime, isRunning } = useBriefingTimer();
  const [respostas, setRespostas] = useState<Record<string, any>>(respostasIniciais);
  const [secaoAtual, setSecaoAtual] = useState(0);
  const [carregandoSalvamento, setCarregandoSalvamento] = useState(false);
  const [ultimoSalvamento, setUltimoSalvamento] = useState<Date | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [modoResumo, setModoResumo] = useState(false);
  const [analiseIA, setAnaliseIA] = useState<any>(null);
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [processandoConclusao, setProcessandoConclusao] = useState(false);
  const [direcaoTransicao, setDirecaoTransicao] = useState<'left' | 'right'>('right');
  const [modoPersonalizacao, setModoPersonalizacao] = useState(false);
  const [briefingPersonalizado, setBriefingPersonalizado] = useState<BriefingCompleto>(briefing);
  const [salvandoManual, setSalvandoManual] = useState(false);

  // 🔥 DEBUG CRÍTICO: Verificar respostas iniciais
  console.log('🎯 [InterfacePerguntas] Inicialização:', {
    modoEdicao,
    totalRespostasIniciais: Object.keys(respostasIniciais).length,
    respostasIniciais,
    estadoRespostas: respostas,
    briefingId: briefing.id,
    primeirasTresRespostas: Object.entries(respostasIniciais).slice(0, 3),
    // 🔥 NOVO: Debug específico para modo edição
    projetoId,
    clienteId,
    modoEdicaoAtivo: modoEdicao ? 'SIM' : 'NÃO',
    botaoSalvarDeveria: modoEdicao && projetoId ? 'APARECER' : 'NÃO APARECER'
  });

  // 🚨 CORREÇÃO CRÍTICA RAFAEL: Atualizar respostas quando respostasIniciais mudarem
  useEffect(() => {
    console.log('🔄 [INTERFACE-PERGUNTAS] useEffect respostasIniciais disparado:', {
      modoEdicao,
      respostasIniciaisLength: Object.keys(respostasIniciais).length,
      respostasAtuaisLength: Object.keys(respostas).length,
      briefingId: briefing.id,
      projetoId,
      timestamp: new Date().toISOString()
    })
    
    if (modoEdicao) {
      console.log('🔄 [INTERFACE-PERGUNTAS] Modo de edição ativo - verificando respostas...')
      
      if (Object.keys(respostasIniciais).length > 0) {
        console.log('🔥 [CORREÇÃO EDIÇÃO] Atualizando respostas com dados carregados:', {
          respostasAnteriores: Object.keys(respostas).length,
          respostasNovas: Object.keys(respostasIniciais).length,
          diferenca: Object.keys(respostasIniciais).length - Object.keys(respostas).length,
          sampleRespostas: Object.entries(respostasIniciais).slice(0, 5).map(([k, v]) => ({ 
            pergunta: k, 
            resposta: String(v).substring(0, 30) + (String(v).length > 30 ? '...' : '') 
          })),
          timestamp: new Date().toISOString()
        })
        
        // 🔥 FORÇA ATUALIZAÇÃO DO ESTADO
        setRespostas(respostasIniciais)
        console.log('✅ [CORREÇÃO EDIÇÃO] Estado de respostas atualizado - campos serão preenchidos!')
        
        // 🔥 FORÇAR RERENDER DEPOIS DE UM PEQUENO DELAY
        setTimeout(() => {
          console.log('🔄 [CORREÇÃO EDIÇÃO] Forçando rerender com respostas:', Object.keys(respostasIniciais).length)
        }, 100)
        
      } else {
        console.log('⚠️ [CORREÇÃO EDIÇÃO] Nenhuma resposta inicial encontrada para preencher')
        console.log('⚠️ [CORREÇÃO EDIÇÃO] Verificar se carregamento das respostas funcionou')
        console.log('⚠️ [CORREÇÃO EDIÇÃO] respostasIniciais:', respostasIniciais)
      }
    } else {
      console.log('📝 [INTERFACE-PERGUNTAS] Modo novo - iniciando com respostas vazias')
    }
  }, [respostasIniciais, modoEdicao, briefing.id, projetoId])
  
  // 🔥 NOVO: useEffect para debugging do estado das respostas
  useEffect(() => {
    console.log('🔍 [INTERFACE-PERGUNTAS] Estado respostas mudou:', {
      totalRespostas: Object.keys(respostas).length,
      modoEdicao,
      briefingId: briefing.id,
      primeiras3: Object.entries(respostas).slice(0, 3).map(([k, v]) => ({ 
        pergunta: k, 
        resposta: String(v).substring(0, 30) + (String(v).length > 30 ? '...' : '') 
      })),
      timestamp: new Date().toISOString()
    })
  }, [respostas, modoEdicao, briefing.id])

  // 🎯 APLICAR LÓGICA CONDICIONAL: Filtrar seções visíveis baseado nas respostas
  const secoesTodas = briefingPersonalizado.secoes || [];
  const secoes = filtrarSecoesVisiveis(secoesTodas, respostas);
  const secaoAtualData = secoes[secaoAtual];
  
  // 🎯 DEBUG: Mostrar para Rafael quantas seções estão visíveis
  console.log('🔧 LÓGICA CONDICIONAL ATIVA:', {
    secoesTotais: secoesTodas.length,
    secoesVisiveis: secoes.length,
    respostasQueInfluenciam: Object.keys(respostas).filter(k => 
      secoesTodas.some(s => s.condicional && s.condicao?.perguntaId.toString() === k)
    ),
    secoesOcultas: secoesTodas.filter(s => !secoes.includes(s)).map(s => s.nome)
  });

  // DEBUG: Log completo do briefing para Rafael
  console.log('🎯 RAFAEL DEBUG - BRIEFING COMPLETO:', {
    id: briefing.id,
    nome: briefing.nome,
    totalPerguntas: briefing.totalPerguntas,
    totalSecoes: secoes.length,
    secoesNomes: secoes.map(s => s.nome),
    secaoAtual: secaoAtual,
    secaoAtualData: secaoAtualData ? {
      nome: secaoAtualData.nome,
      totalPerguntas: secaoAtualData.perguntas.length,
      primeiras3Perguntas: secaoAtualData.perguntas.slice(0, 3).map((p: any) => ({
        id: p.id,
        pergunta: p.pergunta?.substring(0, 50),
        tipo: p.tipo,
        obrigatoria: p.obrigatoria
      }))
    } : 'SEÇÃO NÃO ENCONTRADA'
  });

  // 🔥 SIMPLIFICAÇÃO CRÍTICA: BriefingAdapter já passa briefing personalizado correto
  useEffect(() => {
    // O BriefingAdapter já fez todo o trabalho de personalização
    // Só precisamos usar o briefing que ele passou
    setBriefingPersonalizado(briefing);
    console.log('🔄 [INTERFACE] Usando briefing do Adapter (já personalizado):', {
      id: briefing.id,
      nome: briefing.nome,
      totalSecoes: briefing.secoes?.length || 0,
      totalPerguntas: briefing.totalPerguntas || 0,
      modo: modoEdicao ? 'EDIÇÃO' : 'VISUALIZAÇÃO',
      primeiraSecao: briefing.secoes?.[0]?.nome || 'N/A'
    });
  }, [briefing, modoEdicao]);

  // Auto-save em tempo real - DESABILITADO EM MODO EDIÇÃO
  useEffect(() => {
    // 🚨 RAFAEL: Não fazer auto-save durante edição para evitar conflitos
    if (modoEdicao) {
      console.log('⏸️ [AUTO-SAVE] Desabilitado durante modo de edição')
      return
    }
    
    const timer = setTimeout(() => {
      if (Object.keys(respostas).length > 0) {
        salvarRascunhoAutomatico();
      }
    }, 2000);

      return () => clearTimeout(timer);
  }, [respostas, modoEdicao]);

  const salvarRascunhoAutomatico = async () => {
    try {
      // Simular salvamento automático
      setUltimoSalvamento(new Date());
      if (onSalvarRascunho) {
        await onSalvarRascunho(respostas);
      }
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  };

  const calcularProgresso = () => {
    // 🎯 CÁLCULO INTELIGENTE: Considera apenas perguntas visíveis
    let perguntasVisiveis = 0;
    let perguntasRespondidas = 0;
    
    secoes.forEach(secao => {
      secao.perguntas.forEach(pergunta => {
        // Verificar se a pergunta está visível (mesma lógica do render)
        let perguntaVisivel = true;
        
        if (pergunta.dependeDe) {
          let perguntaVisivel = false;
          
          if (typeof pergunta.dependeDe === 'string') {
            const dependenciaId = pergunta.dependeDe;
            const respostaDependencia = respostas[dependenciaId];
            
            const respostasQueOcultam = [
              'Não', 'Não há construções vizinhas', 'Não temos animais', 'Não, família estável', 
              'Não, geralmente há consenso', 'Não, as decisões são internas', 'Nenhuma experiência', 
              'Não, nenhum histórico conhecido', 'Comunicação mínima (apenas marcos importantes)', 
              'Mínimo (apenas aprovações chave)', 'Não é necessário'
            ];
            
            perguntaVisivel = respostaDependencia && !respostasQueOcultam.includes(respostaDependencia);
          } else {
            const { perguntaId, valoresQueExibem } = pergunta.dependeDe;
            const respostaDependencia = respostas[perguntaId];
            
            perguntaVisivel = respostaDependencia && valoresQueExibem.includes(respostaDependencia);
          }
          
          if (!perguntaVisivel) {
            return; // Pula esta pergunta
          }
        }
        
        if (perguntaVisivel) {
          perguntasVisiveis++;
          if (respostas[pergunta.id.toString()]) {
            perguntasRespondidas++;
          }
        }
      });
    });
    
    return perguntasVisiveis > 0 ? Math.round((perguntasRespondidas / perguntasVisiveis) * 100) : 0;
  };

  const calcularProgressoSecao = (indexSecao: number) => {
    const secao = secoes[indexSecao];
    if (!secao) return 0;
    
    const perguntasRespondidas = secao.perguntas.filter(p => respostas[p.id.toString()]).length;
    return secao.perguntas.length > 0 ? Math.round((perguntasRespondidas / secao.perguntas.length) * 100) : 0;
  };

  const secaoCompleta = (indexSecao: number) => {
    const secao = secoes[indexSecao];
    if (!secao) return false;
    
    const perguntasObrigatorias = secao.perguntas.filter(p => p.obrigatoria);
    
    // DEBUG: Log detalhado para Rafael
    console.log(`🔍 RAFAEL DEBUG - secaoCompleta(${indexSecao}):`, {
      nomeSecao: secao.nome,
      totalPerguntas: secao.perguntas.length,
      perguntasObrigatorias: perguntasObrigatorias.length,
      perguntasObrigatoriasIds: perguntasObrigatorias.map(p => p.id),
      respostasAtuais: Object.keys(respostas),
      respostasParaEstaSecao: perguntasObrigatorias.map(p => ({
        id: p.id,
        temResposta: !!respostas[p.id.toString()],
        resposta: respostas[p.id.toString()]
      }))
    });
    
    // 🎯 CORREÇÃO: Tratar seções opcionais corretamente
    if (perguntasObrigatorias.length === 0) {
      // Seção opcional - só aparece completa se usuário responder pelo menos 1 pergunta
      const temAlgumaResposta = secao.perguntas.some(p => {
        const resposta = respostas[p.id.toString()];
        return resposta && resposta !== '' && resposta !== null && resposta !== undefined;
      });
      console.log(`🎯 SEÇÃO OPCIONAL ${indexSecao} - TEM RESPOSTA: ${temAlgumaResposta}`);
      return temAlgumaResposta;
    }
    
    // Seção obrigatória - comportamento normal
    const completa = perguntasObrigatorias.every(p => {
      const resposta = respostas[p.id.toString()];
      return resposta && resposta !== '' && resposta !== null && resposta !== undefined;
    });
    console.log(`🎯 SEÇÃO OBRIGATÓRIA ${indexSecao} COMPLETA: ${completa}`);
    
    return completa;
  };

  const proximaSecao = () => {
    if (secaoAtual < secoes.length - 1) {
      setDirecaoTransicao('right');
      setSecaoAtual(secaoAtual + 1);
      setErros({});
      
      // 🎯 SCROLL AUTOMÁTICO PARA O TOPO - Melhoria UX solicitada pelo Rafael
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100); // Pequeno delay para aguardar mudança de estado
    }
  };

  const secaoAnterior = () => {
    if (secaoAtual > 0) {
      setDirecaoTransicao('left');
      setSecaoAtual(secaoAtual - 1);
      setErros({});
      
      // 🎯 SCROLL AUTOMÁTICO PARA O TOPO - Melhoria UX solicitada pelo Rafael
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100); // Pequeno delay para aguardar mudança de estado
    }
  };

  const handleResposta = (perguntaId: string, valor: any) => {
    const novasRespostas = {
      ...respostas,
      [perguntaId]: valor
    };
    
    setRespostas(novasRespostas);
    
    // Remover erro se campo foi preenchido
    if (valor && erros[perguntaId]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[perguntaId];
        return novosErros;
      });
    }
    
    // 🚨 CORREÇÃO CRÍTICA RAFAEL: Sistema de salvamento ZERO PERDA DE DADOS
    console.log('🚨 [RAFAEL-DEBUG] ====== SALVAMENTO AUTOMÁTICO INICIADO ======')
    console.log('🚨 [RAFAEL-DEBUG] Briefing ID (usado para salvar):', briefing.id)
    console.log('🚨 [RAFAEL-DEBUG] Projeto ID (passado via props):', projetoId)
    console.log('🚨 [RAFAEL-DEBUG] ID que será usado no salvamento:', projetoId || briefing.id)
    console.log('🚨 [RAFAEL-DEBUG] Pergunta ID:', perguntaId)
    console.log('🚨 [RAFAEL-DEBUG] Valor:', valor?.toString().substring(0, 30) || 'vazio')
    console.log('🚨 [RAFAEL-DEBUG] Modo edição:', modoEdicao)
    console.log('🚨 [RAFAEL-DEBUG] Total respostas atual:', Object.keys(novasRespostas).length)
    console.log('🚨 [RAFAEL-DEBUG] URL atual:', window.location.href)
    console.log('🚨 [RAFAEL-DEBUG] Timestamp:', new Date().toISOString())
    console.log('🚨 [RAFAEL-DEBUG] ============================================')
    
    // 🛡️ BACKUP IMEDIATO SEMPRE (ANTES DE QUALQUER PROCESSAMENTO)
    try {
      const backupEmergencial = {
        perguntaId,
        valor,
        todasRespostas: novasRespostas,
        briefingId: briefing.id,
        projetoId: projetoId || briefing.id,
        timestamp: new Date().toISOString(),
        tipo: 'BACKUP_IMEDIATO_PRE_SAVE'
      };
      
      localStorage.setItem(`briefing-emergency-${briefing.id}`, JSON.stringify(backupEmergencial));
      localStorage.setItem(`briefing-last-response-${briefing.id}`, JSON.stringify({perguntaId, valor}));
      localStorage.setItem(`briefing-all-responses-${briefing.id}`, JSON.stringify(novasRespostas));
      
      console.log('✅ [RAFAEL-BACKUP] Backup emergencial criado IMEDIATAMENTE com', Object.keys(novasRespostas).length, 'respostas');
    } catch (error) {
      console.error('❌ [RAFAEL-BACKUP] ERRO no backup emergencial:', error);
    }

    // 🔥 SALVAMENTO BASEADO NO MODO - CORRIGIDO
    if (modoEdicao && projetoId) {
      // ✅ MODO EDIÇÃO: Usar debounce inteligente (evita triplo salvamento)
      console.log('💾 [RAFAEL-SAVE] Modo edição - usando debounce inteligente');
      salvarRespostasComDebounce(novasRespostas);
    } else {
      // ✅ MODO NOVO: Auto-save imediato (sempre funciona)
      console.log('💾 [RAFAEL-SAVE] Briefing novo - auto-save imediato');
      const idParaSalvar = projetoId || briefing.id;
      // Atualizar respostas globais primeiro
      setRespostas(novasRespostas);
      salvarRespostasAutomatico(perguntaId, valor);
    }
  };

  // 🔥 NOVO: Função para salvar respostas automaticamente no banco
  const salvarRespostasAutomatico = async (perguntaId: string, valor: any) => {
    // 🚨 CORREÇÃO CRÍTICA: Desabilitar completamente auto-save em modo edição
    if (modoEdicao) {
      console.log('⚠️ [AUTO-SAVE] DESABILITADO em modo edição para evitar triplo salvamento');
      return;
    }
    
    // 🎯 NOVO: SALVAMENTO AUTOMÁTICO NO BANCO DE DADOS (apenas briefings novos)
    if (!projetoId) {
      console.log('💾 [AUTO-SAVE] Pulando salvamento - sem projetoId');
      return;
    }
    
    try {
      console.log('💾 [RAFAEL-SAVE] ====== SALVAMENTO NO BANCO INICIADO ======')
      console.log('💾 [RAFAEL-SAVE] Briefing ID (contexto):', briefing.id)
      console.log('💾 [RAFAEL-SAVE] Projeto ID (parâmetro):', projetoId)
      console.log('💾 [RAFAEL-SAVE] ID usado para salvar no banco:', projetoId || briefing.id)
      console.log('💾 [RAFAEL-SAVE] Pergunta ID:', perguntaId)
      console.log('💾 [RAFAEL-SAVE] Valor:', valor?.toString().substring(0, 50) || 'vazio')
      console.log('💾 [RAFAEL-SAVE] Modo edição:', modoEdicao)
      console.log('💾 [RAFAEL-SAVE] Total respostas na memória:', Object.keys(respostas).length)
      console.log('💾 [RAFAEL-SAVE] =============================================')
      
      // Salvar no banco de dados - SEMPRE USAR ID CONSISTENTE
      const idParaSalvarBanco = projetoId || briefing.id;
      console.log('💾 [RAFAEL-SAVE] Chamando estruturaService.salvarRespostas com ID:', idParaSalvarBanco)
      
      await estruturaService.salvarRespostas(
        idParaSalvarBanco,
        { [perguntaId]: valor }
      );
      
      console.log('✅ [AUTO-SAVE] Resposta salva no banco com sucesso');
      
      // 🔄 FALLBACK: Salvar também no localStorage para compatibilidade (mesmo ID)
      const chaveRespostas = `respostas-${idParaSalvarBanco}`;
      const respostasCompletas = { ...respostas, [perguntaId]: valor };
      localStorage.setItem(chaveRespostas, JSON.stringify(respostasCompletas));
      console.log('💾 [RAFAEL-SAVE] Backup localStorage criado com chave:', chaveRespostas);
      
      console.log('✅ [AUTO-SAVE] Resposta também salva no localStorage');
      
    } catch (error) {
      console.error('❌ [AUTO-SAVE] Erro ao salvar resposta:', error);
      
      // EM CASO DE ERRO, SALVAR APENAS NO LOCALSTORAGE (mesmo ID)
      const idParaSalvarLocal = projetoId || briefing.id;
      const chaveRespostas = `respostas-${idParaSalvarLocal}`;
      const respostasCompletas = { ...respostas, [perguntaId]: valor };
      localStorage.setItem(chaveRespostas, JSON.stringify(respostasCompletas));
      console.log('💾 [RAFAEL-ERROR] Salvamento de emergência com ID:', idParaSalvarLocal, 'e chave:', chaveRespostas);
      
      console.log('⚠️ [AUTO-SAVE] Resposta salva apenas no localStorage devido ao erro');
    }
  };

  // 🔥 SOLUÇÃO ENTERPRISE: Debounce inteligente para modo edição
  const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null);
  
  const salvarRespostasComDebounce = useCallback(async (todasRespostas: Record<string, any>) => {
    if (!modoEdicao || !projetoId) return;
    
    // 🚨 CORREÇÃO CRÍTICA: RAFAEL BUG F5 - BACKUP IMEDIATO ANTES DO DEBOUNCE
    console.log('🛡️ [ZERO-LOSS] BACKUP EMERGENCIAL imediato antes do debounce');
    try {
      // 1. BACKUP IMEDIATO no localStorage (instantâneo)
      const backupKey = `briefing-emergency-backup-${projetoId}`;
      const backupData = {
        respostas: todasRespostas,
        timestamp: new Date().toISOString(),
        briefingId: projetoId,
        tipo: 'BACKUP_PRE_DEBOUNCE'
      };
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // 2. MÚLTIPLOS BACKUPS para redundância total
      localStorage.setItem(`briefing-backup-${projetoId}-${Date.now()}`, JSON.stringify(backupData));
      localStorage.setItem(`briefing-last-save-${projetoId}`, JSON.stringify(todasRespostas));
      
      console.log('✅ [ZERO-LOSS] Backup emergencial criado com', Object.keys(todasRespostas).length, 'respostas');
    } catch (error) {
      console.error('❌ [ZERO-LOSS] Erro no backup emergencial:', error);
    }
    
    // Limpar timeout anterior
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
    }
    
    // Agendar novo salvamento com debounce de 2 segundos
    debouncedSaveRef.current = setTimeout(async () => {
      try {
        console.log('💾 [DEBOUNCE-SAVE] Salvando respostas com debounce:', {
          briefingId: projetoId,
          totalRespostas: Object.keys(todasRespostas).length,
          modoEdicao: true
        });
        
        await estruturaService.salvarRespostas(projetoId, todasRespostas);
        setUltimoSalvamento(new Date());
        console.log('✅ [DEBOUNCE-SAVE] Respostas salvas com sucesso');
        
        // 🔥 LIMPAR BACKUP EMERGENCIAL após salvamento bem-sucedido
        const backupKey = `briefing-emergency-backup-${projetoId}`;
        localStorage.removeItem(backupKey);
        console.log('🗑️ [ZERO-LOSS] Backup emergencial limpo após salvamento');
        
      } catch (error) {
        console.error('❌ [DEBOUNCE-SAVE] Erro no salvamento:', error);
        
        // 🚨 EM CASO DE ERRO: MANTER BACKUP e tentar salvamento direto
        console.log('🆘 [ZERO-LOSS] Tentando salvamento direto após erro do debounce');
        try {
          await salvarImediatamente(todasRespostas);
        } catch (saveError) {
          console.error('❌ [ZERO-LOSS] Falha no salvamento direto também:', saveError);
        }
      }
    }, 2000); // 2 segundos de debounce
    
  }, [modoEdicao, projetoId]);

  // 🚨 PROTEÇÃO CRÍTICA: Salvar antes de sair da página (F5, fechar aba, etc.)
  useEffect(() => {
    if (!modoEdicao || !projetoId) return;
    
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      console.log('🚨 [BEFOREUNLOAD] Página sendo fechada/recarregada - SALVAMENTO EMERGENCIAL');
      
      try {
        // 1. Cancelar debounce pendente
        if (debouncedSaveRef.current) {
          clearTimeout(debouncedSaveRef.current);
          console.log('⏹️ [BEFOREUNLOAD] Debounce cancelado');
        }
        
        // 2. Salvamento IMEDIATO das respostas atuais
        if (Object.keys(respostas).length > 0) {
          console.log('💾 [BEFOREUNLOAD] Salvando', Object.keys(respostas).length, 'respostas imediatamente');
          
          // BACKUP MÚLTIPLO (instantâneo)
          const emergencyBackup = {
            respostas,
            timestamp: new Date().toISOString(),
            briefingId: projetoId,
            tipo: 'BEFOREUNLOAD_EMERGENCY',
            motivo: 'F5_OU_FECHAMENTO_PAGINA'
          };
          
          localStorage.setItem(`briefing-beforeunload-${projetoId}`, JSON.stringify(emergencyBackup));
          localStorage.setItem(`briefing-emergency-${projetoId}`, JSON.stringify(respostas));
          localStorage.setItem(`briefing-f5-backup-${projetoId}`, JSON.stringify(emergencyBackup));
          
          // Tentar salvamento no servidor (sem await para não travar o fechamento)
          estruturaService.salvarRespostas(projetoId, respostas).catch(error => {
            console.error('❌ [BEFOREUNLOAD] Salvamento servidor falhou, mas backup local foi feito:', error);
          });
          
          console.log('✅ [BEFOREUNLOAD] Backup triplo criado no localStorage');
        }
        
      } catch (error) {
        console.error('❌ [BEFOREUNLOAD] Erro no salvamento emergencial:', error);
      }
    };
    
    // Adicionar listener para beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      console.log('🧹 [BEFOREUNLOAD] Removendo listener');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [modoEdicao, projetoId, respostas]);

  // Limpar timeout ao desmontar componente
  useEffect(() => {
    return () => {
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current);
      }
    };
  }, []);

  // 🔥 FUNÇÃO PARA CANCELAR DEBOUNCE E SALVAR IMEDIATAMENTE
  const salvarImediatamente = async (respostasParaSalvar?: Record<string, any>) => {
    if (!modoEdicao || !projetoId) return;
    
    const respostasFinais = respostasParaSalvar || respostas;
    
    // Cancelar debounce pendente
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
      debouncedSaveRef.current = null;
    }
    
    try {
      console.log('⚡ [SAVE-IMMEDIATE] Salvamento IMEDIATO de', Object.keys(respostasFinais).length, 'respostas');
      await estruturaService.salvarRespostas(projetoId, respostasFinais);
      setUltimoSalvamento(new Date());
      console.log('✅ [SAVE-IMMEDIATE] Salvamento imediato bem-sucedido');
      
      // Limpar backups após sucesso
      localStorage.removeItem(`briefing-emergency-backup-${projetoId}`);
      localStorage.removeItem(`briefing-beforeunload-${projetoId}`);
      
    } catch (error) {
      console.error('❌ [SAVE-IMMEDIATE] Erro no salvamento imediato:', error);
      throw error;
    }
  };

  const validarSecaoAtual = (): boolean => {
    if (!secaoAtualData) return true;
    
    const novosErros: Record<string, string> = {};
    
    secaoAtualData.perguntas.forEach(pergunta => {
      if (pergunta.obrigatoria && !respostas[pergunta.id.toString()]) {
        novosErros[pergunta.id.toString()] = 'Campo obrigatório';
      }
    });
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // 🚫 FUNÇÃO DESABILITADA: Avanço automático removido por solicitação do Rafael
  // const avancarAutomatico = () => {
  //   if (secaoCompleta(secaoAtual)) {
  //     if (secaoAtual < secoes.length - 1) {
  //       proximaSecao();
  //     } else {
  //       // Todas as seções completas
  //       if (todasSecoesConcluidas) {
  //         setModoResumo(true);
  //       }
  //     }
  //   }
  // };

  // 🚫 USEEFFECT DESABILITADO: Navegação agora é 100% manual
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     avancarAutomatico();
  //   }, 1000);
  //   
  //   return () => clearTimeout(timer);
  // }, [respostas, secaoAtual]);

  const finalizarBriefing = async () => {
    setProcessandoConclusao(true);
    
    try {
      // Preparar dados para envio
      const dadosBriefing = {
        briefingId: projetoId || briefing.id, // 🎯 SOLUÇÃO RAFAEL: Enviar ID para atualizar
        nomeProjeto: nomeProjeto || briefing.nome_projeto || briefing.nome || 'Briefing Personalizado',
        clienteId: null, // 🔥 CORRIGIDO RAFAEL: Não enviar clienteId para preservar valor do banco
        briefingTemplate: {
          id: briefing.id,
          nome: briefing.nome || nomeProjeto || 'Briefing Personalizado',
          categoria: 'residencial',
          totalPerguntas: briefing.totalPerguntas
        },
        respostas: respostas,
        // 🔥 NOVO: Incluir estrutura personalizada do briefing
        estruturaPersonalizada: {
          briefingOriginal: briefing,
          briefingPersonalizado: briefingPersonalizado,
          secoesVisiveis: briefingPersonalizado.secoes.map(secao => ({
            id: secao.id,
            nome: secao.nome,
            perguntasVisiveis: secao.perguntas.map(pergunta => ({
              id: pergunta.id,
              pergunta: pergunta.pergunta
            }))
          })),
          personalizado: briefingPersonalizado !== briefing
        },
        metadados: {
          totalRespostas: Object.keys(respostas).length,
          progresso: calcularProgresso(),
          tempoGasto: 0, // TODO: Implementar cronômetro
          dataInicio: new Date().toISOString(),
          dataFim: new Date().toISOString()
        }
      };

      console.log('🚀 Enviando briefing para backend:', dadosBriefing);

      // Importar service dinamicamente
      const { briefingService } = await import('@/services/briefingService');
      
      // Salvar no backend
      console.log('📡 Chamando briefingService.salvarCompleto...');
      const resultado = await briefingService.salvarCompleto(dadosBriefing);
      
      console.log('✅ Briefing salvo com sucesso:', resultado);
      console.log('🔍 Tipo do resultado:', typeof resultado);
      console.log('🔍 Resultado tem data?', resultado && typeof resultado === 'object' && 'data' in resultado);
      
      // Verificar se resultado existe e tem dados
      if (!resultado) {
        console.error('❌ Resultado da API é undefined');
        throw new Error('Resultado da API é undefined');
      }
      
      if (typeof resultado !== 'object') {
        console.error('❌ Resultado não é um objeto:', typeof resultado);
        throw new Error('Resultado da API não é um objeto');
      }
      
      if (!('data' in resultado)) {
        console.error('❌ Resultado não tem propriedade data:', Object.keys(resultado));
        throw new Error('Resultado da API não tem propriedade data');
      }
      
      if (!resultado.data) {
        console.error('❌ Dados do resultado são undefined');
        throw new Error('Dados do resultado são undefined');
      }
      
      console.log('✅ Validação do resultado passou, dados:', resultado.data);
      
      // Chamar callback de conclusão com dados do backend
      onConcluir({
        ...respostas,
        _briefingId: resultado.data.briefingId,
        _dashboardUrl: resultado.data.dashboardUrl
      });
      
      // ✅ BRIEFING DASHBOARD PERMANECE COMO PADRÃO
      // Removido redirecionamento automático para manter o BriefingDashboard
      console.log('✅ Briefing finalizado! Permanecendo no BriefingDashboard');
      
      // Opcional: Mostrar notificação de sucesso
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert('🎉 Briefing salvo com sucesso!\n\nVocê pode agora gerar orçamentos ou continuar editando.');
        }, 500);
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao finalizar briefing:', error);
      console.error('❌ Stack trace:', error.stack);
      
      // Mostrar erro para o usuário
      alert(`Erro ao salvar briefing: ${error.message}`);
      
      // Fallback: continuar com fluxo local
      onConcluir(respostas);
    } finally {
      setProcessandoConclusao(false);
    }
  };

  // Funções do Personalizador
  const salvarPersonalizacao = async (novosBriefing: BriefingCompleto) => {
    setBriefingPersonalizado(novosBriefing);
    
    try {
      // 🎯 NOVO: SALVAR NO BANCO DE DADOS - SISTEMA CONFIÁVEL
      const estruturaCompleta = {
        personalizado: true,
        secoesVisiveis: novosBriefing.secoes.map((_, index) => index.toString()),
        briefingPersonalizado: novosBriefing,
        versao: 'v2024',
        criadoEm: new Date().toISOString(),
        clienteId,
        projetoId: projetoId || 'temp'
      };
      
      console.log('💾 [BANCO] Salvando estrutura personalizada:', {
        clienteId,
        projetoId: projetoId || 'temp',
        briefingId: briefing.id,
        secoesPersonalizadas: novosBriefing.secoes.length,
        perguntasPersonalizadas: novosBriefing.secoes.reduce((acc, s) => acc + s.perguntas.length, 0)
      });
      
      // Salvar no banco de dados
      await estruturaService.salvarEstrutura(
        briefing.id,
        estruturaCompleta
      );
      
      console.log('✅ [BANCO] Estrutura personalizada salva com sucesso');
      
      // 🔄 FALLBACK: MANTER NO LOCALSTORAGE PARA COMPATIBILIDADE
      const chavePersonalizacao = `briefing-personalizado-${clienteId}-${projetoId || 'temp'}-${briefing.id}`;
      const chaveEstrutura = `briefing-personalizado-${briefing.id}-estrutura`;
      
      localStorage.setItem(chavePersonalizacao, JSON.stringify(novosBriefing));
      localStorage.setItem(chaveEstrutura, JSON.stringify(estruturaCompleta));
      
      console.log('✅ [FALLBACK] Estrutura também salva no localStorage');
      
    } catch (error) {
      console.error('❌ [ERRO] Falha ao salvar no banco:', error);
      
      // EM CASO DE ERRO, SALVAR APENAS NO LOCALSTORAGE
      const chavePersonalizacao = `briefing-personalizado-${clienteId}-${projetoId || 'temp'}-${briefing.id}`;
      const chaveEstrutura = `briefing-personalizado-${briefing.id}-estrutura`;
      const estruturaCompleta = {
        personalizado: true,
        secoesVisiveis: novosBriefing.secoes.map((_, index) => index.toString()),
        briefingPersonalizado: novosBriefing,
        versao: 'v2024',
        criadoEm: new Date().toISOString(),
        clienteId,
        projetoId: projetoId || 'temp'
      };
      
      localStorage.setItem(chavePersonalizacao, JSON.stringify(novosBriefing));
      localStorage.setItem(chaveEstrutura, JSON.stringify(estruturaCompleta));
      
      console.log('⚠️ [FALLBACK] Estrutura salva apenas no localStorage devido ao erro');
    }
    
    setModoPersonalizacao(false);
    // Reset seção atual se necessário
    if (secaoAtual >= novosBriefing.secoes.length) {
      setSecaoAtual(0);
    }
  };

  const cancelarPersonalizacao = () => {
    setModoPersonalizacao(false);
  };

  const limparPersonalizacao = () => {
    // 🗑️ LIMPAR PERSONALIZAÇÃO EM AMBOS OS FORMATOS
    const chavePersonalizacao = `briefing-personalizado-${clienteId}-${projetoId || 'temp'}-${briefing.id}`;
    const chaveEstrutura = `briefing-personalizado-${briefing.id}-estrutura`;
    
    localStorage.removeItem(chavePersonalizacao);
    localStorage.removeItem(chaveEstrutura);
    
    // Voltar ao briefing original
    setBriefingPersonalizado(briefing);
    
    console.log('🗑️ Personalização removida de AMBOS os formatos:', {
      clienteId,
      projetoId: projetoId || 'temp',
      briefingId: briefing.id,
      chaveAntigaRemovida: chavePersonalizacao,
      chaveNovaRemovida: chaveEstrutura
    });
  };

  const visualizarPreview = (briefingPreview: BriefingCompleto) => {
    setBriefingPersonalizado(briefingPreview);
    setModoPersonalizacao(false);
  };

  const renderizarCampo = (pergunta: Pergunta) => {
    const valor = respostas[pergunta.id.toString()] || '';
    const preenchido = Boolean(valor);
    const obrigatoriaNaoPreenchida = pergunta.obrigatoria && !valor;

    // 🔥 RAFAEL: Log detalhado para debugging do modo de edição
    if (modoEdicao) {
      console.log('🔍 [RENDERIZAR-CAMPO] Dados do campo:', {
        perguntaId: pergunta.id,
        perguntaTexto: pergunta.pergunta?.substring(0, 50) + '...',
        valorEncontrado: valor,
        valorTipo: typeof valor,
        valorLength: String(valor).length,
        preenchido,
        obrigatoriaNaoPreenchida,
        respostasDisponiveisTotal: Object.keys(respostas).length,
        modoEdicao,
        timestamp: new Date().toISOString()
      })
    }

    const baseClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 text-base font-medium ${
      obrigatoriaNaoPreenchida
        ? `border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ${tema.card} ${tema.text} placeholder-red-400`
        : preenchido
        ? `border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 ${tema.card} ${tema.text} placeholder-gray-400`
        : `border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${tema.card} ${tema.text} placeholder-gray-400`
    } ${modoVisualizacao ? 'cursor-not-allowed opacity-60' : ''}`;

    const handleChange = (novoValor: any) => {
      // 🔥 RAFAEL: Log da mudança de valor
      if (modoEdicao) {
        console.log('📝 [CAMPO-MUDANCA] Valor alterado:', {
          perguntaId: pergunta.id,
          valorAntigo: valor,
          valorNovo: novoValor,
          timestamp: new Date().toISOString()
        })
      }
      handleResposta(pergunta.id.toString(), novoValor);
    };

    switch (pergunta.tipo) {
      case 'text':
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            className={baseClasses}
            disabled={modoVisualizacao}
          />
        );

      case 'textarea':
      case 'texto_longo':
        return (
          <textarea
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            rows={4}
            className={baseClasses}
            disabled={modoVisualizacao}
            maxLength={pergunta.maxLength}
          />
        );

      case 'numero':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            min={pergunta.min}
            max={pergunta.max}
            className={baseClasses}
            disabled={modoVisualizacao}
          />
        );

      case 'moeda':
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => {
              // Formatar como moeda - remover caracteres não numéricos
              let valorLimpo = e.target.value.replace(/\D/g, '');
              
              if (valorLimpo === '') {
                handleChange('');
                return;
              }
              
              // Converter para número e formatar como moeda
              const numeroFormatado = parseInt(valorLimpo) / 100;
              const valorFormatado = numeroFormatado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              });
              
              handleChange(valorFormatado);
            }}
            placeholder={pergunta.placeholder || 'R$ 0,00'}
            className={baseClasses}
            disabled={modoVisualizacao}
          />
        );

      case 'data':
        return (
          <input
            type="date"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            className={baseClasses}
            disabled={modoVisualizacao}
          />
        );

      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            className={`${baseClasses} ${temaId === 'elegante' ? '[&>option]:bg-white [&>option]:text-gray-900' : '[&>option]:bg-gray-800 [&>option]:text-white'}`}
            disabled={modoVisualizacao}
          >
            <option value="">Selecione uma opção...</option>
            {pergunta.opcoes?.map((opcao, index) => (
              <option key={index} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {pergunta.opcoes?.map((opcao, index) => (
              <label key={index} className={`flex items-center space-x-3 cursor-pointer group p-3 rounded-lg transition-all duration-200 ${tema.card} hover:shadow-md border ${temaId === 'elegante' ? 'border-gray-200 hover:border-gray-300' : 'border-gray-600 hover:border-gray-500'}`}>
                <input
                  type="radio"
                  name={`pergunta-${pergunta.id.toString()}`}
                  value={opcao}
                  checked={valor === opcao}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={modoVisualizacao}
                />
                <span className={`${tema.text} font-medium text-base transition-colors`}>
                  {opcao}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
      case 'multiple':
        return (
          <div className="space-y-3">
            {pergunta.opcoes?.map((opcao, index) => (
              <label key={index} className={`flex items-center space-x-3 cursor-pointer group p-3 rounded-lg transition-all duration-200 ${tema.card} hover:shadow-md border ${temaId === 'elegante' ? 'border-gray-200 hover:border-gray-300' : 'border-gray-600 hover:border-gray-500'}`}>
                <input
                  type="checkbox"
                  checked={Array.isArray(valor) ? valor.includes(opcao) : false}
                  onChange={(e) => {
                    const valorAtual = Array.isArray(valor) ? valor : [];
                    if (e.target.checked) {
                      handleChange([...valorAtual, opcao]);
                    } else {
                      handleChange(valorAtual.filter(v => v !== opcao));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={modoVisualizacao}
                />
                <span className={`${tema.text} font-medium text-base transition-colors`}>
                  {opcao}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            className={baseClasses}
            disabled={modoVisualizacao}
          />
        );
    }
  };

  const progresso = calcularProgresso();
  const progressoSecaoAtual = calcularProgressoSecao(secaoAtual);
  const todasSecoesConcluidas = secoes.every((_, index) => secaoCompleta(index));

  // 🛡️ ESTADO PARA INDICADOR DE PROTEÇÃO DE DADOS
  const [protecaoAtiva, setProtecaoAtiva] = useState(false);
  const [ultimoBackup, setUltimoBackup] = useState<Date | null>(null);

  // Renderizar modo personalização
  if (modoPersonalizacao) {
    return (
      <PersonalizadorBriefing
        briefing={briefingPersonalizado}
        onSalvar={salvarPersonalizacao}
        onCancelar={cancelarPersonalizacao}
        onVisualizarPreview={visualizarPreview}
      />
    );
  }

  if (modoResumo) {
    // Calcular estatísticas do briefing
    const totalRespostas = Object.keys(respostas).length;
    const perguntasObrigatorias = secoes.flatMap(s => s.perguntas.filter(p => p.obrigatoria)).length;
    const perguntasOpcionais = secoes.flatMap(s => s.perguntas.filter(p => !p.obrigatoria)).length;
    const respostasObrigatorias = secoes.flatMap(s => s.perguntas.filter(p => p.obrigatoria && respostas[p.id.toString()])).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header Profissional */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Briefing Concluído com Sucesso! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Seu briefing está pronto para gerar o orçamento personalizado
            </p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Respostas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRespostas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completude</p>
                  <p className="text-2xl font-bold text-gray-900">{progresso}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tempo Estimado</p>
                  <p className="text-2xl font-bold text-gray-900">{briefing.tempoEstimado}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Seções</p>
                  <p className="text-2xl font-bold text-gray-900">{secoes.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview das Respostas Principais */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                📋 Resumo das Respostas Principais
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preview das informações mais importantes coletadas
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mostrar algumas respostas importantes */}
                {Object.entries(respostas).slice(0, 8).map(([perguntaId, resposta], index) => {
                  const pergunta = secoes.flatMap(s => s.perguntas).find(p => p.id.toString() === perguntaId);
                  if (!pergunta || !resposta) return null;
                  
                  return (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {pergunta.pergunta}
                      </p>
                      <p className="text-gray-900">
                        {Array.isArray(resposta) ? resposta.join(', ') : resposta.toString()}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {totalRespostas > 8 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    ... e mais {totalRespostas - 8} respostas detalhadas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white mb-8">
            <h3 className="text-xl font-semibold mb-4">🚀 Próximos Passos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Salvar Briefing</p>
                  <p className="text-sm opacity-90">Suas respostas serão salvas no sistema</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Gerar Orçamento</p>
                  <p className="text-sm opacity-90">Orçamento personalizado será criado</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Dashboard do Projeto</p>
                  <p className="text-sm opacity-90">Acesso completo ao painel do projeto</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setModoResumo(false)}
              className="px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar e Editar</span>
            </button>
            
            <button
              onClick={finalizarBriefing}
              disabled={processandoConclusao}
              className="px-8 py-4 rounded-lg font-bold text-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processandoConclusao ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>💼 Salvar e Gerar Orçamento</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ⏱️ Tempo médio de processamento: 2-3 segundos • 
              📄 PDF será gerado automaticamente • 
              🔒 Dados criptografados e seguros
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header Compacto - Seguindo o Print */}
        <div className="mb-6">
          {/* Card Elegante - Título + Barra de Progresso */}
          <div className={`${tema.card} border ${temaId === 'elegante' ? 'border-gray-200' : 'border-gray-600'} rounded-lg p-5 mb-6 shadow-lg`}>
            {/* Linha Principal - Título + Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onVoltar}
                  className={`${textoBotaoVoltar ? 'px-4 py-2' : 'p-2'} rounded-lg ${tema.card} border ${temaId === 'elegante' ? 'border-gray-200 text-gray-600 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-800'} transition-all flex items-center space-x-2`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  {textoBotaoVoltar && <span className="text-sm font-medium">{textoBotaoVoltar}</span>}
                </button>
                <button
                  onClick={() => setModoPersonalizacao(true)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${tema.card} border ${temaId === 'elegante' ? 'border-gray-200 text-gray-600 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-800'} transition-all`}
                  title="Personalizar Briefing"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Personalizar</span>
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {disciplina === 'engenharia' ? '🏗️' : 
                     disciplina === 'instalacoes' ? '⚡' : 
                     area === 'comercial' ? '🏢' : 
                     area === 'industrial' ? '🏭' : 
                     area === 'design_interiores' ? '🏠' : 
                     '🏠'}
                  </span>
                  <div>
                    <h1 className={`text-xl font-semibold ${tema.text}`}>
                      {nomeProjeto || briefing.nome || 'Briefing'}
                    </h1>
                    <p className={`text-sm ${tema.textSecondary}`}>
                      Cliente: {(() => {
                        console.log('🔍 [NOME_CLIENTE] Exibindo nome do cliente:', {
                          nomeCliente: nomeCliente,
                          valor: nomeCliente || 'Cliente',
                          props: { nomeCliente, nomeProjeto, clienteId },
                          timestamp: new Date().toISOString()
                        })
                        return nomeCliente || 'Cliente'
                      })()} • 
                      {dataReuniao ? ` Reunião: ${dataReuniao}` : ` Criado em: ${new Date().toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Compacto */}
              <div className="flex items-center space-x-4">
                {ultimoSalvamento && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-green-100 border border-green-200 text-green-800">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      Salvo
                    </span>
                  </div>
                )}
                <div className="text-right">
                  <div className={`text-lg font-semibold ${tema.text}`}>{progresso}% completo</div>
                </div>
              </div>
            </div>
          
            {/* Barra de Progresso Geral */}
            <div className={`w-full ${temaId === 'elegante' ? 'bg-gray-200' : 'bg-gray-700'} rounded-full h-2 ${temaId === 'elegante' ? 'border border-gray-300' : 'border border-gray-600'} mb-4`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progresso}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-2 rounded-full shadow-lg ${
                  progresso === 100 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-500/50'
                    : progresso >= 75
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-500 shadow-blue-500/50'
                      : progresso >= 50
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 shadow-purple-500/50'
                        : 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-orange-500/50'
                }`}
              />
            </div>
          
            {/* Navegação de Seções - Dentro do Card */}
            <div className="flex items-center justify-center space-x-2">
              {secoes.map((secao, index) => {
                const completa = secaoCompleta(index);
                const ativa = index === secaoAtual;

                return (
                  <div
                    key={index}
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 text-sm font-medium ${
                      ativa
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : completa
                          ? 'bg-green-600 text-white'
                          : `${tema.card} ${tema.text} hover:shadow-md ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'}`
                    }`}
                    onClick={() => {
                      setDirecaoTransicao(index > secaoAtual ? 'right' : 'left');
                      setSecaoAtual(index);
                    }}
                  >
                    {completa ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
                    
        {/* Card Principal da Seção */}
        <AnimatePresence mode="wait">
          <motion.div
            key={secaoAtual}
            initial={{ 
              opacity: 0, 
              x: direcaoTransicao === 'right' ? 100 : -100 
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: direcaoTransicao === 'right' ? -100 : 100 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header da Seção */}
            <div className={`${tema.card} border ${temaId === 'elegante' ? 'border-gray-200' : 'border-gray-600'} rounded-t-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-medium ${tema.text} mb-1`}>
                    {secaoAtualData?.nome}
                  </h3>
                  <p className={`${tema.textSecondary} text-sm`}>
                    Seção {secaoAtual + 1} de {secoes.length}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${tema.textSecondary}`}>
                    {progressoSecaoAtual}%
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo das Perguntas */}
            <div className={`p-6 ${tema.card} border-x ${temaId === 'elegante' ? 'border-gray-200' : 'border-gray-600'}`}>
              {secaoAtualData && (
                <div className="space-y-6">
                  {filtrarPerguntasVisiveis(secaoAtualData.perguntas, respostas).map((pergunta: any, index: number) => {
                    const preenchida = Boolean(respostas[pergunta.id.toString()]);
                    const obrigatoriaNaoPreenchida = pergunta.obrigatoria && !respostas[pergunta.id.toString()];
                    
                    // 🎯 DEBUG: Log para Rafael ver funcionamento da nova lógica
                    if (pergunta.condicional || pergunta.dependeDe) {
                      console.log(`🔍 PERGUNTA CONDICIONAL: ${pergunta.id}`, {
                        pergunta: pergunta.pergunta?.substring(0, 50),
                        condicional: pergunta.condicional,
                        condicao: pergunta.condicao,
                        dependeDe: pergunta.dependeDe,
                        deveSerExibida: perguntaDeveSerExibida(pergunta, respostas)
                      });
                    }
                          
                    return (
                      <motion.div
                        key={pergunta.id.toString()}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          obrigatoriaNaoPreenchida
                            ? `${tema.card} ${temaId === 'elegante' ? 'border-gray-200 hover:border-gray-300' : 'border-gray-600 hover:border-gray-500'} hover:shadow-md`
                            : preenchida
                              ? 'border-green-400 bg-green-50 shadow-green-100 shadow-lg'
                              : `${tema.card} ${temaId === 'elegante' ? 'border-gray-200 hover:border-gray-300' : 'border-gray-600 hover:border-gray-500'} hover:shadow-md`
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Número da Pergunta - Melhor Contraste */}
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border ${
                            obrigatoriaNaoPreenchida
                              ? `${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} shadow-md`
                              : preenchida
                                ? 'bg-green-600 text-white border-green-500 shadow-green-500/30 shadow-lg'
                                : `${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} shadow-md`
                          }`}>
                            {preenchida ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>

                          {/* Conteúdo da Pergunta */}
                          <div className="flex-1">
                            <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                              {pergunta.pergunta}
                              {pergunta.obrigatoria && (
                                <span className="text-red-400 ml-1">*</span>
                              )}
                              {pergunta.dependeDe && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1 animate-pulse"></span>
                                  Condicional
                                </span>
                              )}
                            </label>
                                  
                            {pergunta.descricao && (
                              <p className={`text-xs ${tema.textSecondary} mb-3 leading-relaxed`}>
                                {pergunta.descricao}
                              </p>
                            )}

                            {/* Campo de Input */}
                            <div className="mb-3">
                              {renderizarCampo(pergunta)}
                            </div>
                                
                            {pergunta.observacoes && (
                              <div className={`flex items-start space-x-2 p-3 ${tema.card} rounded ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'}`}>
                                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <p className={`text-xs ${tema.textSecondary} leading-relaxed`}>
                                  {pergunta.observacoes}
                                </p>
                              </div>
                            )}
                            
                            {obrigatoriaNaoPreenchida && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center space-x-2 mt-2 px-2 py-1 rounded ${temaId === 'elegante' ? 'bg-gray-100 border border-gray-200' : 'bg-gray-800 border border-gray-600'}`}
                              >
                                <AlertCircle className={`w-4 h-4 ${temaId === 'elegante' ? 'text-gray-600' : 'text-gray-400'}`} />
                                <span className={`text-xs font-medium ${temaId === 'elegante' ? 'text-gray-700' : 'text-gray-300'}`}>Campo obrigatório</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navegação Inferior */}
            <div className={`${tema.card} border ${temaId === 'elegante' ? 'border-gray-200' : 'border-gray-600'} rounded-b-lg p-6`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={secaoAnterior}
                  disabled={secaoAtual === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    secaoAtual === 0
                      ? `${tema.textSecondary} cursor-not-allowed opacity-50`
                      : `${tema.text} ${tema.card} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} hover:shadow-md`
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${tema.textSecondary}`}>
                    {secaoAtual + 1} de {secoes.length}
                  </span>
                  
                  {todasSecoesConcluidas && (
                    <button
                      onClick={() => setModoResumo(true)}
                      className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      {textoBotaoConcluir || (modoEdicao ? 'Salvar e Continuar' : 'Finalizar Briefing')}
                    </button>
                  )}
                </div>

                <button
                  onClick={proximaSecao}
                  disabled={secaoAtual === secoes.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    secaoAtual === secoes.length - 1
                      ? `${tema.textSecondary} cursor-not-allowed opacity-50`
                      : `${tema.text} ${tema.card} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} hover:shadow-md`
                  }`}
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 