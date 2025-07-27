'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useCronometro } from './useCronometro';

interface Notificacao {
  id: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  titulo: string;
  mensagem: string;
  timestamp: Date;
  lida: boolean;
  acao?: {
    texto: string;
    callback: () => void;
  };
  duracao?: number; // em milissegundos
}

export function useNotifications() {
  const { state } = useDashboard();
  const cronometro = useCronometro();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [permissaoNotificacao, setPermissaoNotificacao] = useState<NotificationPermission>('default');

  // Solicitar permissão para notificações do navegador
  useEffect(() => {
    if ('Notification' in window) {
      setPermissaoNotificacao(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setPermissaoNotificacao(permission);
        });
      }
    }
  }, []);

  // Criar notificação
  const criarNotificacao = useCallback((notificacao: Omit<Notificacao, 'id' | 'timestamp' | 'lida'>) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      lida: false
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);

    // Notificação do navegador se permitido
    if (permissaoNotificacao === 'granted' && document.hidden) {
      new Notification(novaNotificacao.titulo, {
        body: novaNotificacao.mensagem,
        icon: '/favicon.ico',
        tag: novaNotificacao.id
      });
    }

    // Auto-remover após duração especificada
    if (notificacao.duracao) {
      setTimeout(() => {
        removerNotificacao(novaNotificacao.id);
      }, notificacao.duracao);
    }

    return novaNotificacao.id;
  }, [permissaoNotificacao]);

  // Marcar como lida
  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  }, []);

  // Remover notificação
  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Limpar todas as notificações
  const limparTodas = useCallback(() => {
    setNotificacoes([]);
  }, []);

  // Notificações automáticas baseadas no estado
  useEffect(() => {
    const tarefaAtiva = cronometro.obterTarefaAtiva();
    
    // Notificação de sessão longa (mais de 2 horas)
    if (cronometro.cronometroAtivo && cronometro.tempoSessaoAtual > 2 * 60 * 60) {
      const ultimaNotificacaoSessaoLonga = notificacoes.find(n => 
        n.titulo.includes('Sessão Longa') && 
        n.timestamp.getTime() > Date.now() - 30 * 60 * 1000 // últimos 30 min
      );

      if (!ultimaNotificacaoSessaoLonga) {
        criarNotificacao({
          tipo: 'warning',
          titulo: 'Sessão Longa Detectada',
          mensagem: `Você está trabalhando há ${cronometro.formatarTempoSimples(cronometro.tempoSessaoAtual)}. Considere fazer uma pausa.`,
          acao: {
            texto: 'Pausar Agora',
            callback: () => cronometro.pausarCronometro()
          },
          duracao: 10000
        });
      }
    }

    // Notificação de prazo próximo
    if (tarefaAtiva?.data_entrega) {
      const dataEntrega = new Date(tarefaAtiva.data_entrega);
      const diasRestantes = Math.ceil((dataEntrega.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes <= 1 && diasRestantes > 0) {
        const ultimaNotificacaoPrazo = notificacoes.find(n => 
          n.titulo.includes('Prazo Próximo') && 
          n.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000 // últimas 24h
        );

        if (!ultimaNotificacaoPrazo) {
          criarNotificacao({
            tipo: 'warning',
            titulo: 'Prazo Próximo',
            mensagem: `A tarefa "${tarefaAtiva.nome}" vence em ${diasRestantes} dia(s).`,
            acao: {
              texto: 'Ver Detalhes',
              callback: () => console.log('Abrir detalhes da tarefa')
            }
          });
        }
      }
    }

    // Notificação de tempo excedido
    if (tarefaAtiva && cronometro.tempoSessaoAtual > tarefaAtiva.tempo_estimado) {
      const ultimaNotificacaoExcedido = notificacoes.find(n => 
        n.titulo.includes('Tempo Excedido') && 
        n.timestamp.getTime() > Date.now() - 60 * 60 * 1000 // última hora
      );

      if (!ultimaNotificacaoExcedido) {
        const tempoExcedido = cronometro.tempoSessaoAtual - tarefaAtiva.tempo_estimado;
        criarNotificacao({
          tipo: 'info',
          titulo: 'Tempo Excedido',
          mensagem: `Você excedeu o tempo estimado em ${cronometro.formatarTempoSimples(tempoExcedido)}.`,
          acao: {
            texto: 'Revisar Estimativa',
            callback: () => console.log('Abrir edição de tarefa')
          },
          duracao: 8000
        });
      }
    }
  }, [cronometro, notificacoes, criarNotificacao]);

  // Notificações de conclusão de tarefa
  const notificarConclusaoTarefa = useCallback((nomeTarefa: string) => {
    criarNotificacao({
      tipo: 'success',
      titulo: 'Tarefa Concluída',
      mensagem: `Parabéns! Você concluiu a tarefa "${nomeTarefa}".`,
      duracao: 5000
    });
  }, [criarNotificacao]);

  // Notificações de inicio de nova sessão
  const notificarInicioSessao = useCallback((nomeTarefa: string) => {
    criarNotificacao({
      tipo: 'info',
      titulo: 'Nova Sessão Iniciada',
      mensagem: `Cronômetro iniciado para "${nomeTarefa}".`,
      duracao: 3000
    });
  }, [criarNotificacao]);

  // Estatísticas das notificações
  const estatisticas = {
    total: notificacoes.length,
    naoLidas: notificacoes.filter(n => !n.lida).length,
    porTipo: {
      info: notificacoes.filter(n => n.tipo === 'info').length,
      warning: notificacoes.filter(n => n.tipo === 'warning').length,
      error: notificacoes.filter(n => n.tipo === 'error').length,
      success: notificacoes.filter(n => n.tipo === 'success').length,
    }
  };

  return {
    notificacoes,
    estatisticas,
    permissaoNotificacao,
    criarNotificacao,
    marcarComoLida,
    removerNotificacao,
    limparTodas,
    notificarConclusaoTarefa,
    notificarInicioSessao
  };
} 
 
 
 
 
 
 
 
 
 
 
 
 
 