'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, CheckCheck, Trash2, Settings, 
  Bot, Shield, Clock, AlertTriangle, Info, 
  ExternalLink, Filter, Search
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotificacoes, Notificacao } from '@/services/notificacoes';

interface PainelNotificacoesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PainelNotificacoes({ isOpen, onClose }: PainelNotificacoesProps) {
  const { temaId } = useTheme();
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas, remover } = useNotificacoes();
  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas' | 'sucesso' | 'alerta' | 'erro'>('todas');
  const [busca, setBusca] = useState('');

  // Filtrar notificações
  const notificacoesFiltradas = notificacoes.filter(notif => {
    // Filtro por tipo
    if (filtro !== 'todas') {
      if (filtro === 'nao_lidas' && notif.lida) return false;
      if (filtro !== 'nao_lidas' && notif.tipo !== filtro) return false;
    }

    // Filtro por busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      return (
        notif.titulo.toLowerCase().includes(termoBusca) ||
        notif.mensagem.toLowerCase().includes(termoBusca)
      );
    }

    return true;
  });

  const getIconeNotificacao = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'sucesso': return Bot;
      case 'info': return Shield;
      case 'alerta': return Clock;
      case 'erro': return AlertTriangle;
      default: return Info;
    }
  };

  const getCorNotificacao = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'sucesso': return 'bg-green-100 text-green-600 border-green-200';
      case 'info': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'alerta': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'erro': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatarTempo = (dataISO: string) => {
    const agora = new Date();
    const data = new Date(dataISO);
    const diffMs = agora.getTime() - data.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias < 7) return `${diffDias}d atrás`;
    return data.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Painel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-96 z-50 shadow-2xl ${
              temaId === 'elegante'
                ? 'bg-white border-l border-gray-200'
                : 'bg-gray-900 border-l border-white/10'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bell className={`w-6 h-6 ${
                      temaId === 'elegante' ? 'text-gray-700' : 'text-white'
                    }`} />
                    {naoLidas > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {naoLidas > 99 ? '99+' : naoLidas}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${
                      temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Notificações
                    </h2>
                    <p className={`text-sm ${
                      temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                    }`}>
                      {naoLidas} não lidas
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    temaId === 'elegante'
                      ? 'hover:bg-gray-100 text-gray-600'
                      : 'hover:bg-white/10 text-white/60'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ações rápidas */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={marcarTodasComoLidas}
                  disabled={naoLidas === 0}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    naoLidas > 0
                      ? temaId === 'elegante'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas</span>
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    temaId === 'elegante'
                      ? 'hover:bg-gray-100 text-gray-600'
                      : 'hover:bg-white/10 text-white/60'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className={`p-4 border-b ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
            }`}>
              {/* Busca */}
              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar notificações..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      : 'border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-blue-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'todas', label: 'Todas', count: notificacoes.length },
                  { key: 'nao_lidas', label: 'Não lidas', count: naoLidas },
                  { key: 'sucesso', label: 'Sucesso', count: notificacoes.filter(n => n.tipo === 'sucesso').length },
                  { key: 'alerta', label: 'Alertas', count: notificacoes.filter(n => n.tipo === 'alerta').length },
                  { key: 'erro', label: 'Erros', count: notificacoes.filter(n => n.tipo === 'erro').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFiltro(key as any)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      filtro === key
                        ? 'bg-blue-500 text-white'
                        : temaId === 'elegante'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="flex-1 scroll-invisible">
              {notificacoesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Bell className={`w-12 h-12 mb-4 ${
                    temaId === 'elegante' ? 'text-gray-300' : 'text-white/20'
                  }`} />
                  <p className={`text-lg font-medium ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {busca ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
                  </p>
                  <p className={`text-sm ${
                    temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                  }`}>
                    {busca ? 'Tente ajustar os filtros de busca' : 'Você está em dia! 🎉'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notificacoesFiltradas.map((notificacao) => {
                    const IconeNotif = getIconeNotificacao(notificacao.tipo);
                    
                    return (
                      <motion.div
                        key={notificacao.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border-l-4 transition-all duration-200 hover:shadow-sm cursor-pointer ${
                          !notificacao.lida 
                            ? temaId === 'elegante'
                              ? 'bg-blue-50 border-l-blue-500'
                              : 'bg-blue-500/10 border-l-blue-400'
                            : temaId === 'elegante'
                              ? 'bg-white border-l-gray-200 hover:bg-gray-50'
                              : 'bg-transparent border-l-white/10 hover:bg-white/5'
                        }`}
                        onClick={() => !notificacao.lida && marcarComoLida(notificacao.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                            getCorNotificacao(notificacao.tipo)
                          }`}>
                            <IconeNotif className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-medium truncate ${
                                temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {notificacao.titulo}
                              </h4>
                              {!notificacao.lida && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            
                            <p className={`text-xs mb-2 ${
                              temaId === 'elegante' ? 'text-gray-600' : 'text-white/70'
                            }`}>
                              {notificacao.mensagem}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${
                                temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                              }`}>
                                {formatarTempo(notificacao.criadaEm)}
                              </span>
                              
                              <div className="flex items-center space-x-1">
                                {notificacao.acao && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(notificacao.acao!.url, '_blank');
                                    }}
                                    className={`p-1 rounded transition-colors ${
                                      temaId === 'elegante'
                                        ? 'hover:bg-gray-200 text-gray-600'
                                        : 'hover:bg-white/20 text-white/60'
                                    }`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                                
                                {!notificacao.lida && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      marcarComoLida(notificacao.id);
                                    }}
                                    className={`p-1 rounded transition-colors ${
                                      temaId === 'elegante'
                                        ? 'hover:bg-gray-200 text-gray-600'
                                        : 'hover:bg-white/20 text-white/60'
                                    }`}
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remover(notificacao.id);
                                  }}
                                  className={`p-1 rounded transition-colors ${
                                    temaId === 'elegante'
                                      ? 'hover:bg-red-100 text-red-600'
                                      : 'hover:bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 