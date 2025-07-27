'use client';

import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useCronometro } from '@/hooks/useCronometro';
import { Calendar, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProximasTarefas() {
  const { state } = useDashboard();
  const cronometro = useCronometro();

  // Calcular próximas tarefas (urgentes)
  const proximasTarefas = React.useMemo(() => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    return state.projeto.etapas
      .flatMap(etapa => etapa.tarefas)
      .filter(tarefa => 
        tarefa.status === 'nao_iniciada' || 
        tarefa.status === 'em_progresso'
      )
      .map(tarefa => {
        // Adicionar informações de prazo
        let corBadge = 'bg-green-100 text-green-700';
        let labelPrazo = 'No prazo';

        // Simulação de lógica de prazo (você pode adaptar conforme sua necessidade)
        const tempoEstimadoDias = Math.ceil(tarefa.tempo_estimado / (8 * 3600)); // 8h por dia
        if (tempoEstimadoDias <= 1) {
          corBadge = 'bg-red-100 text-red-700';
          labelPrazo = 'Urgente';
        } else if (tempoEstimadoDias <= 2) {
          corBadge = 'bg-yellow-100 text-yellow-700';
          labelPrazo = 'Prioritária';
        }

        return {
          ...tarefa,
          corBadge,
          labelPrazo
        };
      })
      .sort((a, b) => {
        // Ordenar por urgência
        const urgenciaA = a.labelPrazo === 'Urgente' ? 3 : a.labelPrazo === 'Prioritária' ? 2 : 1;
        const urgenciaB = b.labelPrazo === 'Urgente' ? 3 : b.labelPrazo === 'Prioritária' ? 2 : 1;
        return urgenciaB - urgenciaA;
      })
      .slice(0, 5); // Limitar a 5 tarefas
  }, [state.projeto.etapas]);

  const iniciarTarefa = (tarefaId: string) => {
    cronometro.iniciarCronometro(tarefaId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Próximas Tarefas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {proximasTarefas.length > 0 ? (
            proximasTarefas.map((tarefa) => (
              <div 
                key={tarefa.id} 
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{tarefa.nome}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{tarefa.responsavel}</span>
                    <span>•</span>
                    <span>{cronometro.formatarTempoSimples(tarefa.tempo_estimado)}</span>
                    <span>•</span>
                    <Badge className={tarefa.corBadge}>
                      {tarefa.labelPrazo}
                    </Badge>
                  </div>
                </div>
                <Button 
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 h-8 px-3"
                  onClick={() => iniciarTarefa(tarefa.id)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  {tarefa.status === 'em_progresso' ? 'Continuar' : 'Iniciar'}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">
                Nenhuma tarefa urgente para hoje ou amanhã! 🎉
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Todas as tarefas estão no prazo
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 