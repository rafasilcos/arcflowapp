'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

// 📅 CRONOGRAMA INTELIGENTE DO PROJETO
// Sistema de gestão de prazos com automações e alertas

interface FaseCronograma {
  id: string;
  nome: string;
  sigla: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  duracaoDias: number;
  progresso: number;
  status: 'Não Iniciada' | 'Em Andamento' | 'Concluída' | 'Atrasada';
  disciplinas: string[];
  responsavel: string;
  dependencias: string[];
  tarefas: TarefaCronograma[];
  marcos: MarcoCronograma[];
}

interface TarefaCronograma {
  id: string;
  nome: string;
  disciplina: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  progresso: number;
  status: string;
  critica: boolean;
}

interface MarcoCronograma {
  id: string;
  nome: string;
  data: string;
  tipo: 'Entrega' | 'Aprovação' | 'Marco';
  concluido: boolean;
  atrasado: boolean;
}

interface AlertaCronograma {
  id: string;
  tipo: 'Crítico' | 'Atenção' | 'Info';
  titulo: string;
  descricao: string;
  data: string;
  acao: string;
}

export default function CronogramaProjetoPage() {
  const params = useParams();
  const projetoId = params.id as string;
  
  const [visualizacao, setVisualizacao] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [cronograma, setCronograma] = useState<any>(null);

  useEffect(() => {
    carregarCronograma();
  }, [projetoId]);

  const carregarCronograma = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCronograma({
        projeto: {
          nome: 'Residência Silva - Casa Alto Padrão',
          dataInicio: '2024-01-10',
          dataFim: '2024-06-15',
          duracaoTotal: 157,
          progressoGeral: 68
        },
        fases: [
          {
            id: 'lv',
            nome: 'Levantamento de Dados',
            dataInicio: '2024-01-10',
            dataFim: '2024-01-20',
            duracaoDias: 10,
            progresso: 100,
            status: 'Concluída',
            disciplinas: ['ARQ'],
            responsavel: 'João Silva',
            tarefas: [
              { id: 't1', nome: 'Briefing Detalhado', progresso: 100, status: 'Concluída', critica: true },
              { id: 't2', nome: 'Levantamento Topográfico', progresso: 100, status: 'Concluída', critica: false }
            ]
          },
          {
            id: 'ep',
            nome: 'Estudo Preliminar',
            dataInicio: '2024-01-21',
            dataFim: '2024-02-10',
            duracaoDias: 20,
            progresso: 100,
            status: 'Concluída',
            disciplinas: ['ARQ'],
            responsavel: 'João Silva',
            tarefas: [
              { id: 't3', nome: 'Estudo de Massas', progresso: 100, status: 'Concluída', critica: true },
              { id: 't4', nome: 'Plantas Preliminares', progresso: 100, status: 'Concluída', critica: true }
            ]
          },
          {
            id: 'ap',
            nome: 'Anteprojeto',
            dataInicio: '2024-02-16',
            dataFim: '2024-03-20',
            duracaoDias: 33,
            progresso: 85,
            status: 'Em Andamento',
            disciplinas: ['ARQ', 'EST'],
            responsavel: 'João Silva',
            tarefas: [
              { id: 't6', nome: 'Plantas Detalhadas', progresso: 100, status: 'Concluída', critica: true },
              { id: 't7', nome: 'Cortes e Fachadas', progresso: 90, status: 'Em Andamento', critica: true }
            ]
          }
        ],
        alertas: [
          {
            id: 'a1',
            tipo: 'Atenção',
            titulo: 'Projeto Elétrico Atrasado',
            descricao: 'Início previsto para ontem, ainda não iniciado',
            acao: 'Contatar Pedro Costa'
          }
        ],
        metricas: {
          progressoGeral: 68,
          diasDecorridos: 75,
          diasRestantes: 82,
          fasesCompletas: 2,
          fasesTotal: 4,
          tarefasCompletas: 28,
          tarefasTotal: 45,
          atrasosAtuais: 1
        }
      });
    } catch (error) {
      console.error('Erro ao carregar cronograma:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando cronograma...</p>
        </div>
      </div>
    );
  }

  const renderTimeline = () => (
    <div className="space-y-6">
      {cronograma.fases.map((fase: any, index: number) => (
        <Card key={fase.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                fase.status === 'Concluída' ? 'bg-green-500' :
                fase.status === 'Em Andamento' ? 'bg-blue-500' : 'bg-gray-400'
              }`}>
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{fase.nome}</h3>
                <p className="text-sm text-gray-600">{fase.responsavel}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant={fase.status === 'Concluída' ? 'default' : 'outline'}>
                {fase.status}
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium">{fase.progresso}%</div>
                <div className="text-xs text-gray-500">{fase.duracaoDias} dias</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{new Date(fase.dataInicio).toLocaleDateString('pt-BR')}</span>
              <span>{new Date(fase.dataFim).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  fase.status === 'Concluída' ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${fase.progresso}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium">Disciplinas:</span>
            {fase.disciplinas.map((disc: string) => (
              <Badge key={disc} variant="outline" className="text-xs">{disc}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fase.tarefas.map((tarefa: any) => (
              <div key={tarefa.id} className={`p-3 rounded-lg border ${
                tarefa.critica ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{tarefa.nome}</span>
                  {tarefa.critica && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">{tarefa.progresso}%</span>
                  <Badge variant="outline" className="text-xs">{tarefa.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📅 Cronograma do Projeto
              </h1>
              <p className="text-gray-600">{cronograma?.projeto.nome}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              className="p-2 border border-gray-300 rounded-lg text-sm"
              value={visualizacao}
              onChange={(e) => setVisualizacao(e.target.value)}
            >
              <option value="timeline">Timeline</option>
              <option value="gantt">Gantt</option>
              <option value="calendario">Calendário</option>
            </select>
            <Button variant="outline" onClick={carregarCronograma}>
              🔄 Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xl font-bold text-blue-600">{cronograma?.metricas.progressoGeral}%</div>
            <div className="text-xs text-gray-600">Progresso Geral</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-xl font-bold text-green-600">{cronograma?.metricas.diasDecorridos}</div>
            <div className="text-xs text-gray-600">Dias Decorridos</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">⏰</div>
            <div className="text-xl font-bold text-orange-600">{cronograma?.metricas.diasRestantes}</div>
            <div className="text-xs text-gray-600">Dias Restantes</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-xl font-bold text-purple-600">{cronograma?.metricas.fasesCompletas}/{cronograma?.metricas.fasesTotal}</div>
            <div className="text-xs text-gray-600">Fases</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-xl font-bold text-indigo-600">{cronograma?.metricas.tarefasCompletas}/{cronograma?.metricas.tarefasTotal}</div>
            <div className="text-xs text-gray-600">Tarefas</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="text-xl font-bold text-red-600">{cronograma?.metricas.atrasosAtuais}</div>
            <div className="text-xs text-gray-600">Atrasos</div>
          </Card>
        </div>

        {cronograma?.alertas.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">🚨 Alertas do Cronograma</h2>
            <div className="space-y-3">
              {cronograma.alertas.map((alerta: any) => (
                <div key={alerta.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h4 className="font-medium">{alerta.titulo}</h4>
                      <p className="text-sm text-gray-600">{alerta.descricao}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {alerta.acao}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div>
          {visualizacao === 'timeline' && renderTimeline()}
          {visualizacao === 'gantt' && (
            <Card className="p-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">Visualização Gantt</h3>
                <p className="text-gray-500">Em desenvolvimento</p>
              </div>
            </Card>
          )}
          {visualizacao === 'calendario' && (
            <Card className="p-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">Visualização Calendário</h3>
                <p className="text-gray-500">Em desenvolvimento</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 