import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, Pause, CheckCircle2, LogOut, Save 
} from 'lucide-react';

interface TarefaAtivaProps {
  tarefaAtiva: string | null;
  tarefaAtivaData: any;
  cronometroAtivo: boolean;
  tempoSessaoAtual: number;
  numeroSessoes: number;
  anotacaoSessao: string;
  anotacaoSalva: boolean;
  formatarTempo: (segundos: number) => string;
  formatarTempoSimples: (segundos: number) => string;
  calcularTempoTarefaAtualRealTime: () => number;
  iniciarTarefa: (tarefaId: string) => void;
  pausarTarefa: () => void;
  sairDaTarefa: () => void;
  concluirTarefa: (tarefaId: string) => void;
  setAnotacaoSessao: (anotacao: string) => void;
  salvarNota: () => void;
}

export const TarefaAtivaCard: React.FC<TarefaAtivaProps> = ({
  tarefaAtiva,
  tarefaAtivaData,
  cronometroAtivo,
  tempoSessaoAtual,
  numeroSessoes,
  anotacaoSessao,
  anotacaoSalva,
  formatarTempo,
  formatarTempoSimples,
  calcularTempoTarefaAtualRealTime,
  iniciarTarefa,
  pausarTarefa,
  sairDaTarefa,
  concluirTarefa,
  setAnotacaoSessao,
  salvarNota
}) => {
  if (!tarefaAtiva || !tarefaAtivaData) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Header com Cronômetro e Controles */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-base font-semibold text-gray-900">Tarefa Atual</h2>
            </div>
            
            {/* Cronômetro da Sessão */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                <span className="text-green-600 font-mono font-semibold">
                  ⏱️ {formatarTempo(tempoSessaoAtual)}
                </span>
                <span className="text-green-500 text-xs ml-1">sessão</span>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-mono font-semibold">
                  🕒 {formatarTempo(calcularTempoTarefaAtualRealTime())}
                </span>
                <span className="text-blue-500 text-xs ml-1">total</span>
              </div>
              <div className="bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                <span className="text-purple-600 font-mono font-semibold">
                  📊 {numeroSessoes}
                </span>
                <span className="text-purple-500 text-xs ml-1">sessões</span>
              </div>
            </div>
          </div>

          {/* Controles de Cronômetro */}
          <div className="flex items-center space-x-2">
            {!cronometroAtivo ? (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                onClick={() => iniciarTarefa(tarefaAtivaData.id)}
              >
                <Play className="h-3 w-3 mr-1" />
                {tempoSessaoAtual > 0 ? 'Retomar' : 'Iniciar'}
              </Button>
            ) : (
              <Button 
                className="border-orange-300 text-orange-700 hover:bg-orange-50 h-8 px-3 border"
                onClick={pausarTarefa}
              >
                <Pause className="h-3 w-3 mr-1" />
                Pausar
              </Button>
            )}
            <Button 
              className="border-red-300 text-red-700 hover:bg-red-50 h-8 px-3 border"
              onClick={sairDaTarefa}
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sair da Tarefa
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
              onClick={() => concluirTarefa(tarefaAtivaData.id)}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Concluir
            </Button>
          </div>
        </div>

        {/* Nome da Tarefa */}
        <div className="mb-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{tarefaAtivaData.nome}</h3>
          <p className="text-sm text-gray-600">Desenvolvimento do programa de necessidades detalhado</p>
        </div>

        {/* Informações Compactas */}
        <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">👤 Responsável</span>
            <span className="font-medium text-gray-900">{tarefaAtivaData.responsavel}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">📊 Estimado</span>
            <span className="font-medium text-gray-900">{formatarTempoSimples(tarefaAtivaData.tempo_estimado)}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">📅 Iniciado</span>
            <span className="font-medium text-gray-900">{tarefaAtivaData.data_inicio ? new Date(tarefaAtivaData.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">📈 Progresso</span>
            <span className="font-medium text-gray-900">73%</span>
          </div>
        </div>

        {/* Barra de Progresso Compacta */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: '73%' }}></div>
          </div>
        </div>

        {/* Anotações da Sessão Compacta */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Anotações da Sessão Atual
          </label>
          <Textarea
            value={anotacaoSessao}
            onChange={(e) => setAnotacaoSessao(e.target.value)}
            placeholder="O que está sendo feito nesta sessão..."
            className="w-full h-16 text-xs resize-none"
          />
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className={`${anotacaoSalva ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {anotacaoSalva ? '✅ Anotação salva com sucesso!' : 'Digite sua anotação e clique em Salvar'}
            </span>
            <Button 
              onClick={salvarNota}
              disabled={!anotacaoSessao.trim() || anotacaoSalva}
              className={`text-xs h-6 px-2 ${anotacaoSalva ? 'bg-green-600 hover:bg-green-700 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {anotacaoSalva ? (
                <>
                  <CheckCircle2 className="h-2 w-2 mr-1" />
                  Salvo
                </>
              ) : (
                <>
                  <Save className="h-2 w-2 mr-1" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 