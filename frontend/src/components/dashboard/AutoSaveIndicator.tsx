'use client';

import React from 'react';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAutoSave } from '@/hooks/useAutoSave';

export function AutoSaveIndicator() {
  const { 
    isDirty, 
    lastSaved, 
    isSaving, 
    tempoUltimoSave,
    salvarManualmente 
  } = useAutoSave({
    interval: 30000, // 30 segundos
    enabled: true
  });

  const formatarTempoRelativo = (segundos: number | null) => {
    if (!segundos) return 'nunca';
    
    if (segundos < 60) return 'agora mesmo';
    if (segundos < 3600) return `há ${Math.floor(segundos / 60)} min`;
    
    const horas = Math.floor(segundos / 3600);
    return `há ${horas}h`;
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Status do salvamento */}
      <div className="flex items-center space-x-2 text-sm">
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-600">Salvando...</span>
          </>
        ) : isDirty ? (
          <>
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-amber-600">Alterações não salvas</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-green-600">
              Salvo {formatarTempoRelativo(tempoUltimoSave)}
            </span>
          </>
        )}
      </div>

      {/* Botão de salvamento manual */}
      <button
        onClick={salvarManualmente}
        disabled={isSaving || !isDirty}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className="h-3 w-3" />
        <span>Salvar</span>
      </button>
    </div>
  );
} 

import React from 'react';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAutoSave } from '@/hooks/useAutoSave';

export function AutoSaveIndicator() {
  const { 
    isDirty, 
    lastSaved, 
    isSaving, 
    tempoUltimoSave,
    salvarManualmente 
  } = useAutoSave({
    interval: 30000, // 30 segundos
    enabled: true
  });

  const formatarTempoRelativo = (segundos: number | null) => {
    if (!segundos) return 'nunca';
    
    if (segundos < 60) return 'agora mesmo';
    if (segundos < 3600) return `há ${Math.floor(segundos / 60)} min`;
    
    const horas = Math.floor(segundos / 3600);
    return `há ${horas}h`;
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Status do salvamento */}
      <div className="flex items-center space-x-2 text-sm">
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-600">Salvando...</span>
          </>
        ) : isDirty ? (
          <>
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-amber-600">Alterações não salvas</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-green-600">
              Salvo {formatarTempoRelativo(tempoUltimoSave)}
            </span>
          </>
        )}
      </div>

      {/* Botão de salvamento manual */}
      <button
        onClick={salvarManualmente}
        disabled={isSaving || !isDirty}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className="h-3 w-3" />
        <span>Salvar</span>
      </button>
    </div>
  );
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 