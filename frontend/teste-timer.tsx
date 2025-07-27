'use client';

import { useState } from 'react';
import TimerTarefa from './src/components/projetos/TimerTarefa';

export default function TesteTimer() {
  const [status, setStatus] = useState<'Não Iniciada' | 'Em Andamento' | 'Pausada' | 'Concluída' | 'Aguardando Aprovação' | 'Aprovada'>('Não Iniciada');
  const [tempoGasto, setTempoGasto] = useState(0);

  const handleStatusChange = (novoStatus: string, tempo: number) => {
    console.log('🔄 STATUS MUDOU:', { de: status, para: novoStatus, tempo });
    setStatus(novoStatus as any);
    setTempoGasto(tempo);
  };

  const handleTempoAtualizado = (tempoAtual: number) => {
    console.log('⏱️ TEMPO ATUALIZADO:', tempoAtual);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">🧪 Teste do Timer de Tarefa</h1>
          
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Estado Atual:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Status:</strong> <span className="font-mono">{status}</span>
              </div>
              <div>
                <strong>Tempo Gasto:</strong> <span className="font-mono">{tempoGasto}s</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Componente TimerTarefa:</h3>
            <TimerTarefa
              tarefaId="teste-1"
              nomeTarefa="Tarefa de Teste - Desenvolvimento de Layout"
              responsavel="Rafael Silva"
              estimativaHoras={4}
              horasRealizadas={0}
              status={status}
              prioridade="ALTA"
              onStatusChange={handleStatusChange}
              onTempoAtualizado={handleTempoAtualizado}
              sessoes={[]}
              isManager={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 