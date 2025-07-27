// ⏱️ COMPONENTE DE TIMER POR TAREFA
// Controle obrigatório de tempo para análise de produtividade

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock, User, AlertTriangle, CheckCircle, Eye, ThumbsUp } from 'lucide-react';

interface SessaoTrabalho {
  id: string;
  dataInicio: Date;
  dataFim?: Date;
  duracao: number; // em segundos
  observacoes?: string;
  pausas: {
    inicio: Date;
    fim?: Date;
    motivo?: string;
  }[];
}

interface TimerTarefaProps {
  tarefaId: string;
  nomeTarefa: string;
  responsavel: string;
  estimativaHoras: number;
  horasRealizadas: number;
  status: 'Não Iniciada' | 'Em Andamento' | 'Pausada' | 'Concluída' | 'Aguardando Aprovação' | 'Aprovada';
  prioridade: 'BAIXA' | 'NORMAL' | 'ALTA' | 'CRITICA';
  onStatusChange: (novoStatus: string, tempoGasto: number) => void;
  onTempoAtualizado: (tempoAtual: number) => void;
  sessoes?: SessaoTrabalho[];
  isManager?: boolean;
}

export default function TimerTarefa({
  tarefaId,
  nomeTarefa,
  responsavel,
  estimativaHoras,
  horasRealizadas,
  status,
  prioridade,
  onStatusChange,
  onTempoAtualizado,
  sessoes = [],
  isManager = false
}: TimerTarefaProps) {
  
  const [tempoAtual, setTempoAtual] = useState(0); // em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(status === 'Pausada');
  const [sessaoAtual, setSessaoAtual] = useState<SessaoTrabalho | null>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Prevenir múltiplos cliques
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inicioSessaoRef = useRef<Date | null>(null);

  // Calcular tempo total trabalhado (sessões anteriores + sessão atual)
  const tempoTotalTrabalhado = sessoes.reduce((total, sessao) => total + sessao.duracao, 0) + tempoAtual;
  const horasTrabalhadas = tempoTotalTrabalhado / 3600;
  const progressoPorcentual = Math.min((horasTrabalhadas / estimativaHoras) * 100, 100);

  // Verificar se está atrasado
  const estaAtrasado = horasTrabalhadas > estimativaHoras && !['Concluída', 'Aprovada'].includes(status);
  const tempoExcedido = horasTrabalhadas - estimativaHoras;

  // Sincronizar estado com status recebido
  useEffect(() => {
    if (status === 'Em Andamento' && !isRunning && !isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    } else if (status === 'Pausada') {
      setIsRunning(false);
      setIsPaused(true);
    } else if (['Concluída', 'Aprovada', 'Não Iniciada'].includes(status)) {
      setIsRunning(false);
      setIsPaused(false);
      setSessaoAtual(null);
      setTempoAtual(0);
    }
  }, [status]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTempoAtual(prev => {
          const novoTempo = prev + 1;
          onTempoAtualizado(novoTempo);
          return novoTempo;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onTempoAtualizado]);

  const formatarTempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos.toString().padStart(2, '0')}min`;
    }
    return `${minutos}min ${segs.toString().padStart(2, '0')}s`;
  };

  const iniciarTarefa = async () => {
    if (isProcessing || isRunning) return; // Prevenir múltiplos cliques
    
    setIsProcessing(true);
    
    try {
      // Mudar status se necessário
      if (status === 'Não Iniciada') {
        onStatusChange('Em Andamento', tempoTotalTrabalhado);
      }
      
      const agora = new Date();
      inicioSessaoRef.current = agora;
      
      const novaSessao: SessaoTrabalho = {
        id: `sessao-${Date.now()}`,
        dataInicio: agora,
        duracao: 0,
        pausas: []
      };
      
      setSessaoAtual(novaSessao);
      setIsRunning(true);
      setIsPaused(false);
      setTempoAtual(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const pausarTarefa = async () => {
    if (isProcessing || !isRunning) return;
    
    setIsProcessing(true);
    
    try {
      if (sessaoAtual && inicioSessaoRef.current) {
        const agora = new Date();
        const duracaoSessao = Math.floor((agora.getTime() - inicioSessaoRef.current.getTime()) / 1000);
        
        setSessaoAtual(prev => prev ? {
          ...prev,
          duracao: duracaoSessao,
          pausas: [...prev.pausas, { inicio: agora }]
        } : null);
      }
      
      setIsRunning(false);
      setIsPaused(true);
      onStatusChange('Pausada', tempoTotalTrabalhado + tempoAtual);
    } finally {
      setIsProcessing(false);
    }
  };

  const retomarTarefa = async () => {
    if (isProcessing || isRunning) return;
    
    setIsProcessing(true);
    
    try {
      const agora = new Date();
      inicioSessaoRef.current = agora;
      
      setIsRunning(true);
      setIsPaused(false);
      onStatusChange('Em Andamento', tempoTotalTrabalhado);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizarTarefa = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (sessaoAtual && inicioSessaoRef.current) {
        const agora = new Date();
        const duracaoSessao = Math.floor((agora.getTime() - inicioSessaoRef.current.getTime()) / 1000);
        
        const sessaoFinalizada: SessaoTrabalho = {
          ...sessaoAtual,
          dataFim: agora,
          duracao: duracaoSessao,
          observacoes
        };
        
        console.log('Sessão finalizada:', sessaoFinalizada);
      }
      
      setIsRunning(false);
      setIsPaused(false);
      setSessaoAtual(null);
      setTempoAtual(0);
      
      // Colaborador conclui → Aguardando Aprovação
      // Manager pode aprovar diretamente
      const novoStatus = isManager ? 'Aprovada' : 'Aguardando Aprovação';
      onStatusChange(novoStatus, tempoTotalTrabalhado + tempoAtual);
    } finally {
      setIsProcessing(false);
    }
  };

  const aprovarTarefa = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      onStatusChange('Aprovada', tempoTotalTrabalhado);
    } finally {
      setIsProcessing(false);
    }
  };

  const obterCorStatus = () => {
    switch (status) {
      case 'Aprovada': return 'text-green-600 bg-green-50 border-green-200';
      case 'Concluída': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Aguardando Aprovação': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Em Andamento': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Pausada': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Não Iniciada': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const obterIconeStatus = () => {
    switch (status) {
      case 'Aprovada': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Concluída': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'Aguardando Aprovação': return <Eye className="h-4 w-4 text-yellow-600" />;
      case 'Em Andamento': return <Play className="h-4 w-4 text-blue-600" />;
      case 'Pausada': return <Pause className="h-4 w-4 text-orange-600" />;
      case 'Não Iniciada': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const obterCorPrioridade = () => {
    switch (prioridade) {
      case 'CRITICA': return 'bg-red-100 text-red-800 border-red-200';
      case 'ALTA': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NORMAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BAIXA': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`border rounded-md p-2 transition-all hover:shadow-sm ${obterCorStatus()}`}>
      {/* LAYOUT HORIZONTAL ULTRA FINO */}
      <div className="flex items-center justify-between space-x-3">
        
        {/* INFORMAÇÕES BÁSICAS */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {obterIconeStatus()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 text-sm truncate">{nomeTarefa}</h4>
              <Badge className={`text-xs px-1 py-0 ${obterCorPrioridade()}`}>
                {prioridade}
              </Badge>
              {estaAtrasado && (
                <Badge className="text-xs px-1 py-0 bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3" />
                </Badge>
              )}
              {status === 'Aguardando Aprovação' && (
                <Badge className="text-xs px-1 py-0 bg-yellow-100 text-yellow-800">
                  Aguardando Manager
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* RESPONSÁVEL */}
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span className="whitespace-nowrap">{responsavel}</span>
        </div>

        {/* TEMPO */}
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span className="whitespace-nowrap">{formatarTempo(tempoTotalTrabalhado)} / {estimativaHoras}h</span>
        </div>

        {/* TIMER ATIVO - Melhorado */}
        {(isRunning || isPaused) && (
          <div className={`flex items-center space-x-2 border rounded px-2 py-1 ${
            isRunning && !isPaused 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className={`text-xs font-bold ${
              isRunning && !isPaused ? 'text-green-600' : 'text-orange-600'
            }`}>
              {formatarTempo(tempoAtual)}
            </div>
            {isRunning && !isPaused && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
            {isPaused && (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
        )}

        {/* PROGRESSO */}
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                estaAtrasado ? 'bg-red-500' :
                ['Aprovada', 'Concluída'].includes(status) ? 'bg-green-500' :
                status === 'Em Andamento' ? 'bg-blue-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${Math.min(progressoPorcentual, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-gray-900 w-8 text-right">
            {progressoPorcentual.toFixed(0)}%
          </span>
        </div>

        {/* CONTROLES E DETALHES - LADO DIREITO */}
        <div className="flex items-center space-x-1">
          
          {/* BOTÃO PRINCIPAL - Baseado apenas no STATUS */}
          {status === 'Não Iniciada' && (
            <Button 
              onClick={iniciarTarefa}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white h-6 w-6 p-0 disabled:opacity-50"
              size="sm"
              title="Iniciar Tarefa"
            >
              <Play className="h-3 w-3" />
            </Button>
          )}
          
          {/* PAUSAR - Se em andamento (sempre mostra) */}
          {status === 'Em Andamento' && (
            <Button 
              onClick={pausarTarefa}
              disabled={isProcessing}
              variant="outline"
              className="h-6 w-6 p-0 border-orange-300 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
              size="sm"
              title="Pausar Tarefa"
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
          
          {/* RETOMAR - Se pausada */}
          {status === 'Pausada' && (
            <Button 
              onClick={retomarTarefa}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white h-6 w-6 p-0 disabled:opacity-50"
              size="sm"
              title="Retomar Tarefa"
            >
              <Play className="h-3 w-3" />
            </Button>
          )}
          
          {/* CONCLUIR - Se em andamento ou pausada */}
          {(status === 'Em Andamento' || status === 'Pausada') && (
            <Button 
              onClick={finalizarTarefa}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white h-6 w-6 p-0 disabled:opacity-50"
              size="sm"
              title="Concluir Tarefa"
            >
              <CheckCircle className="h-3 w-3" />
            </Button>
          )}

          {/* APROVAR - Só para manager quando aguardando */}
          {status === 'Aguardando Aprovação' && isManager && (
            <Button 
              onClick={aprovarTarefa}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white h-6 w-6 p-0 disabled:opacity-50"
              size="sm"
              title="Aprovar Tarefa"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
          )}

          {/* DETALHES */}
          <Button 
            variant="ghost" 
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            title="Ver Detalhes"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* OBSERVAÇÕES - Só quando timer ativo */}
      {(isRunning || isPaused) && (
        <div className="mt-2 space-y-1">
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="O que está sendo feito nesta sessão..."
            className="w-full p-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
          />
        </div>
      )}

      {/* DETALHES EXPANDIDOS */}
      {mostrarDetalhes && (
        <div className="mt-2 pt-2 border-t space-y-2">
          <h5 className="font-medium text-gray-900 text-xs">📊 Histórico de Sessões</h5>
          
          {sessoes.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhuma sessão registrada.</p>
          ) : (
            <div className="space-y-1">
              {sessoes.map((sessao, index) => (
                <div key={sessao.id} className="bg-gray-50 p-2 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-medium">
                        Sessão {index + 1} - {sessao.dataInicio.toLocaleDateString('pt-BR')}
                      </div>
                      {sessao.observacoes && (
                        <div className="text-xs text-gray-700 mt-1">
                          💭 {sessao.observacoes}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium">
                      {formatarTempo(sessao.duracao)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* ESTATÍSTICAS */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <div className="text-xs font-bold text-blue-600">{sessoes.length}</div>
              <div className="text-xs text-gray-600">Sessões</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-green-600">{formatarTempo(tempoTotalTrabalhado)}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-purple-600">
                {sessoes.length > 0 ? formatarTempo(Math.round(tempoTotalTrabalhado / sessoes.length)) : '0min'}
              </div>
              <div className="text-xs text-gray-600">Média</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 