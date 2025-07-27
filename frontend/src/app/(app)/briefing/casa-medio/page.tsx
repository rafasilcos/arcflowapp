'use client';

import React from 'react';
import InterfacePerguntas from '@/components/briefing/InterfacePerguntas';
import { BRIEFING_RESIDENCIAL_MULTIFAMILIAR } from '@/data/briefings-aprovados/residencial/multifamiliar';

export default function CasaMedioPage() {
  const handleVoltar = () => {
    window.history.back();
  };

  const handleConcluir = async (respostas: Record<string, any>) => {
    console.log('✅ BRIEFING CASA MÉDIO CONCLUÍDO:', {
      briefingId: BRIEFING_RESIDENCIAL_MULTIFAMILIAR.id,
      totalRespostas: Object.keys(respostas).length,
      respostas: respostas
    });
    
    // Simular salvamento
    alert('Briefing Casa Médio concluído com sucesso!');
  };

  const handleSalvarRascunho = async (respostas: Record<string, any>) => {
    console.log('💾 RASCUNHO SALVO:', {
      briefingId: BRIEFING_RESIDENCIAL_MULTIFAMILIAR.id,
      totalRespostas: Object.keys(respostas).length,
      timestamp: new Date().toISOString()
    });
  };

  // ✅ USANDO BRIEFING APROVADO MULTIFAMILIAR
  const briefingCompleto = BRIEFING_RESIDENCIAL_MULTIFAMILIAR;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto">
        <InterfacePerguntas
          briefing={briefingCompleto}
          onVoltar={handleVoltar}
          onConcluir={handleConcluir}
          onSalvarRascunho={handleSalvarRascunho}
          clienteId="cliente-teste"
          projetoId="projeto-casa-medio"
        />
      </div>
    </div>
  );
} 