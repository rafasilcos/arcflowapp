'use client';

import { useState } from 'react';
import TimerTarefa from '@/components/projetos/TimerTarefa';

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

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Controles Manuais:</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setStatus('Não Iniciada')}
                className="px-3 py-1 bg-gray-200 rounded text-sm"
              >
                → Não Iniciada
              </button>
              <button 
                onClick={() => setStatus('Em Andamento')}
                className="px-3 py-1 bg-blue-200 rounded text-sm"
              >
                → Em Andamento
              </button>
              <button 
                onClick={() => setStatus('Pausada')}
                className="px-3 py-1 bg-orange-200 rounded text-sm"
              >
                → Pausada
              </button>
              <button 
                onClick={() => setStatus('Aguardando Aprovação')}
                className="px-3 py-1 bg-yellow-200 rounded text-sm"
              >
                → Aguardando
              </button>
              <button 
                onClick={() => setStatus('Aprovada')}
                className="px-3 py-1 bg-green-200 rounded text-sm"
              >
                → Aprovada
              </button>
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">📋 Fluxo Esperado:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><strong>Não Iniciada:</strong> Deve mostrar botão ▶️ INICIAR</li>
              <li><strong>Clica INICIAR:</strong> Status vira "Em Andamento" + deve mostrar ⏸️ PAUSAR + ✅ CONCLUIR</li>
              <li><strong>Clica PAUSAR:</strong> Status vira "Pausada" + deve mostrar ▶️ RETOMAR + ✅ CONCLUIR</li>
              <li><strong>Clica RETOMAR:</strong> Status volta "Em Andamento" + deve mostrar ⏸️ PAUSAR + ✅ CONCLUIR</li>
              <li><strong>Clica CONCLUIR:</strong> Status vira "Aguardando Aprovação" + deve mostrar 👍 APROVAR</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 