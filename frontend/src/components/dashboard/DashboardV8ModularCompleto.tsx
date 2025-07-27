import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Square, MoreHorizontal, Plus, Settings, 
  BarChart3, Download, Filter, Maximize, Minimize, 
  Lightbulb, Zap, Target, AlertTriangle, Clock, Users 
} from 'lucide-react';

// Hooks e Context
import { useDashboard } from '@/contexts/DashboardContext';
import { useCronometro } from '@/hooks/useCronometro';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { useCrudAvancado } from '@/hooks/useCrudAvancado';
import { useDragDropAvancado } from '@/hooks/useDragDropAvancado';
import { useEstatisticasAvancadas } from '@/hooks/useEstatisticasAvancadas';

// Componentes
import { DashboardErrorBoundary } from './DashboardErrorBoundary';
import { CardsMetricasDetalhados } from './CardsMetricasDetalhados';
import { EtapasListaCompleta } from './EtapasListaCompleta';
import { ProximasTarefas } from './ProximasTarefas';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { NotificacoesPanel } from './NotificacoesPanel';
import { ModalValidacaoInteligente } from './ModalValidacaoInteligente';
import { ModalCrudAvancado } from './ModalCrudAvancado';
import { RelatoriosAvancados } from './RelatoriosAvancados';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Types
import { Tarefa, Etapa } from '@/types/briefing';

export function DashboardV8ModularCompleto() {
  // Estados principais
  const { state, dispatch } = useDashboard();
  const [modoFoco, setModoFoco] = useState(false);
  const [tarefaAtivaId, setTarefaAtivaId] = useState<string | null>(null);
  const [notasSessao, setNotasSessao] = useState('');
  
  // Estados de modais
  const [modalCrudAberto, setModalCrudAberto] = useState(false);
  const [modalCrudTipo, setModalCrudTipo] = useState<'etapa' | 'tarefa'>('tarefa');
  const [modalCrudModo, setModalCrudModo] = useState<'criar' | 'editar' | 'duplicar'>('criar');
  const [itemEditando, setItemEditando] = useState<Etapa | Tarefa | null>(null);
  const [etapaIdParaTarefa, setEtapaIdParaTarefa] = useState<string>('');
  const [relatoriosAberto, setRelatoriosAberto] = useState(false);
  const [notificacoesAberto, setNotificacoesAberto] = useState(false);

  // Hooks avançados
  const cronometro = useCronometro();
  const autoSave = useAutoSave();
  const estatisticas = useEstatisticasAvancadas();
  const crud = useCrudAvancado();
  const dragDrop = useDragDropAvancado();
  const { notificacoes, marcarComoLida } = useNotifications();

  // Atalhos de teclado
  useKeyboardShortcuts({
    'Space': () => {
      if (tarefaAtivaId) {
        if (cronometro.cronometroAtivo) {
          cronometro.pausarCronometro();
        } else {
          cronometro.retomarCronometro();
        }
      }
    },
    'KeyF': () => setModoFoco(!modoFoco),
    'Escape': () => {
      if (modoFoco) setModoFoco(false);
      if (tarefaAtivaId) pararTarefa();
    },
    'KeyR': () => setRelatoriosAberto(true),
    'KeyN': () => setNotificacoesAberto(true)
  });

  // Obter tarefa ativa
  const tarefaAtiva = tarefaAtivaId ? 
    state.projeto.etapas
      .flatMap(e => e.tarefas)
      .find(t => t.id === tarefaAtivaId) : null;

  // Funções de controle de cronômetro
  const iniciarTarefa = (tarefaId: string) => {
    if (tarefaAtivaId && tarefaAtivaId !== tarefaId) {
      pararTarefa(); // Para a tarefa atual antes de iniciar nova
    }
    
    setTarefaAtivaId(tarefaId);
    cronometro.iniciarCronometro(tarefaId);
    dispatch({
      type: 'ATUALIZAR_TAREFA',
      payload: {
        tarefaId,
        dados: { status: 'em_progresso', cronometro_ativo: true }
      }
    });
  };

  const pausarTarefa = () => {
    if (tarefaAtivaId) {
      cronometro.pausarCronometro();
    }
  };

  const retomarTarefa = () => {
    if (tarefaAtivaId) {
      cronometro.retomarCronometro();
    }
  };

  const pararTarefa = () => {
    if (tarefaAtivaId) {
      cronometro.pararCronometro();
      
      // Salvar notas da sessão se houver
      if (notasSessao.trim()) {
        const novaNota = {
          id: `nota_${Date.now()}`,
          timestamp: new Date().toISOString(),
          texto: notasSessao,
          tempo_sessao: cronometro.tempoSessaoAtual
        };

        dispatch({
          type: 'ATUALIZAR_TAREFA',
          payload: {
            tarefaId: tarefaAtivaId,
            dados: {
              notas_sessoes: [...(tarefaAtiva?.notas_sessoes || []), novaNota],
              cronometro_ativo: false
            }
          }
        });
        
        setNotasSessao('');
      }
      
      setTarefaAtivaId(null);
    }
  };

  const concluirTarefa = () => {
    if (tarefaAtivaId && tarefaAtiva) {
      pararTarefa();
      
      const novoStatus = tarefaAtiva.requer_aprovacao ? 'aguardando_aprovacao' : 'concluida';
      
      dispatch({
        type: 'ATUALIZAR_TAREFA',
        payload: {
          tarefaId: tarefaAtivaId,
          dados: { status: novoStatus }
        }
      });
    }
  };

  // Handlers CRUD
  const abrirModalCriarTarefa = (etapaId: string) => {
    setModalCrudTipo('tarefa');
    setModalCrudModo('criar');
    setEtapaIdParaTarefa(etapaId);
    setItemEditando(null);
    setModalCrudAberto(true);
  };

  const abrirModalEditarTarefa = (tarefa: Tarefa) => {
    setModalCrudTipo('tarefa');
    setModalCrudModo('editar');
    setItemEditando(tarefa);
    setModalCrudAberto(true);
  };

  const abrirModalCriarEtapa = () => {
    setModalCrudTipo('etapa');
    setModalCrudModo('criar');
    setItemEditando(null);
    setModalCrudAberto(true);
  };

  const handleSalvarItem = async (dados: any) => {
    try {
      if (modalCrudTipo === 'tarefa') {
        if (modalCrudModo === 'criar') {
          await crud.criarTarefa(etapaIdParaTarefa, dados);
        } else if (modalCrudModo === 'editar' && itemEditando) {
          await crud.editarTarefa(itemEditando.id, dados);
        }
      } else if (modalCrudTipo === 'etapa') {
        if (modalCrudModo === 'criar') {
          await crud.criarEtapa(dados);
        } else if (modalCrudModo === 'editar' && itemEditando) {
          await crud.editarEtapa(itemEditando.id, dados);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  // Auto-save das notas da sessão
  useEffect(() => {
    if (tarefaAtivaId && notasSessao) {
      const timer = setTimeout(() => {
        // Auto-save das notas a cada 30 segundos
        autoSave.save('notas_sessao_temp', {
          tarefaId: tarefaAtivaId,
          notas: notasSessao,
          timestamp: Date.now()
        });
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [tarefaAtivaId, notasSessao, autoSave]);

  // Layout do modo foco
  if (modoFoco && tarefaAtiva) {
    return (
      <DashboardErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4 py-8">
            {/* Header do modo foco */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3"
              >
                <Target className="w-6 h-6" />
                <span className="text-xl font-bold">Modo Foco</span>
              </motion.div>
            </div>

            {/* Tarefa ativa em foco */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{tarefaAtiva.nome}</h1>
                    <p className="text-white/80">{tarefaAtiva.responsavel}</p>
                  </div>

                  {/* Cronômetro central */}
                  <div className="text-center mb-8">
                    <div className="text-6xl font-mono font-bold mb-4">
                      {cronometro.formatarTempo(cronometro.tempoSessaoAtual)}
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      {!cronometro.cronometroAtivo ? (
                        <Button
                          onClick={retomarTarefa}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Retomar
                        </Button>
                      ) : (
                        <Button
                          onClick={pausarTarefa}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg"
                        >
                          <Pause className="w-6 h-6 mr-2" />
                          Pausar
                        </Button>
                      )}
                      
                      <Button
                        onClick={concluirTarefa}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                      >
                        <Square className="w-6 h-6 mr-2" />
                        Concluir
                      </Button>
                    </div>
                  </div>

                  {/* Notas da sessão */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Notas da Sessão</label>
                    <textarea
                      value={notasSessao}
                      onChange={(e) => setNotasSessao(e.target.value)}
                      placeholder="Anote o progresso, observações ou próximos passos..."
                      className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Controles */}
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => setModoFoco(false)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Minimize className="w-4 h-4 mr-2" />
                      Sair do Foco
                    </Button>
                    
                    <div className="text-sm text-white/80">
                      Pressione ESC para sair | Espaço para pausar/retomar
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DashboardErrorBoundary>
    );
  }

  // Layout principal
  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard de Produtividade</h1>
              <Badge className={`${
                estatisticas.resumo_executivo.status_geral === 'verde' ? 'bg-green-100 text-green-800' :
                estatisticas.resumo_executivo.status_geral === 'amarelo' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Status: {estatisticas.resumo_executivo.status_geral.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <AutoSaveIndicator 
                isSaving={autoSave.isSaving}
                lastSaved={autoSave.lastSaved}
                hasUnsavedChanges={autoSave.hasUnsavedChanges}
              />
              
              <Button
                onClick={() => setRelatoriosAberto(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              
              <Button
                onClick={() => setNotificacoesAberto(true)}
                className="relative bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <AlertTriangle className="w-4 h-4" />
                {notificacoes.filter(n => !n.lida).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-6">
          {/* Cards de métricas */}
          <div className="mb-8">
            <CardsMetricasDetalhados />
          </div>

          {/* Layout principal com drag & drop */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Coluna principal - Lista de etapas e tarefas */}
            <div className="xl:col-span-3">
              <div className="space-y-6">
                {/* Tarefa ativa */}
                {tarefaAtiva && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <h3 className="text-lg font-semibold">Tarefa Ativa</h3>
                      </div>
                      
                      <Button
                        onClick={() => setModoFoco(true)}
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Maximize className="w-4 h-4 mr-2" />
                        Modo Foco
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-white/90 mb-1">{tarefaAtiva.nome}</h4>
                        <p className="text-white/70 text-sm">{tarefaAtiva.responsavel}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-mono font-bold">
                          {cronometro.formatarTempo(cronometro.tempoSessaoAtual)}
                        </div>
                        <p className="text-white/70 text-sm">Sessão atual</p>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        {!cronometro.cronometroAtivo ? (
                          <Button
                            onClick={retomarTarefa}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={pausarTarefa}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          onClick={concluirTarefa}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Lista de etapas e tarefas */}
                <EtapasListaCompleta
                  onIniciarTarefa={iniciarTarefa}
                  onEditarTarefa={abrirModalEditarTarefa}
                  onCriarTarefa={abrirModalCriarTarefa}
                  onCriarEtapa={abrirModalCriarEtapa}
                  tarefaAtivaId={tarefaAtivaId}
                  dragDropProps={dragDrop}
                />
              </div>
            </div>

            {/* Sidebar direita */}
            <div className="space-y-6">
              {/* Próximas tarefas */}
              <ProximasTarefas onIniciarTarefa={iniciarTarefa} />
              
              {/* Estatísticas rápidas */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                    Estatísticas Rápidas
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Eficiência Geral</span>
                      <span className="font-medium">{Math.round(estatisticas.tempo.eficiencia_geral)}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tarefas Concluídas</span>
                      <span className="font-medium">
                        {estatisticas.tarefas.concluidas}/{estatisticas.tarefas.total_tarefas}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Qualidade</span>
                      <span className="font-medium">{estatisticas.qualidade.indice_qualidade}/100</span>
                    </div>
                    
                    {estatisticas.alertas.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">
                            {estatisticas.alertas.length} alerta(s)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modais */}
        <AnimatePresence>
          {/* Modal CRUD */}
          {modalCrudAberto && (
            <ModalCrudAvancado
              isOpen={modalCrudAberto}
              modo={modalCrudModo}
              tipo={modalCrudTipo}
              item={itemEditando}
              etapaId={etapaIdParaTarefa}
              onClose={() => setModalCrudAberto(false)}
              onSave={handleSalvarItem}
              onDelete={() => {
                // Implementar exclusão
                setModalCrudAberto(false);
              }}
            />
          )}

          {/* Modal de validação inteligente */}
          {crud.validacaoAtiva && (
            <ModalValidacaoInteligente
              isOpen={!!crud.validacaoAtiva}
              validacao={crud.validacaoAtiva}
              onClose={crud.cancelarOperacao}
              onConfirm={crud.confirmarOperacao}
              onCancel={crud.cancelarOperacao}
            />
          )}

          {/* Relatórios avançados */}
          {relatoriosAberto && (
            <RelatoriosAvancados
              isOpen={relatoriosAberto}
              onClose={() => setRelatoriosAberto(false)}
            />
          )}

          {/* Painel de notificações */}
          {notificacoesAberto && (
            <NotificacoesPanel
              isOpen={notificacoesAberto}
              onClose={() => setNotificacoesAberto(false)}
              notificacoes={notificacoes}
              onMarcarComoLida={marcarComoLida}
            />
          )}
        </AnimatePresence>

        {/* Overlay de drag & drop */}
        {dragDrop.DragOverlay && <dragDrop.DragOverlay />}
      </div>
    </DashboardErrorBoundary>
  );
} 