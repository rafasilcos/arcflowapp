// ===== ATIVIDADES RECENTES =====
// Componente extraído da V7-Otimizada

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle2, Play, Eye, Edit } from 'lucide-react';

interface AtividadesRecentesProps {
  atividades: Array<{
    id: string;
    usuario: string;
    acao: string;
    tipo: 'concluiu' | 'iniciou' | 'validou' | 'editou' | 'revisou';
    tempo: string;
    detalhe?: string;
  }>;
}

export function AtividadesRecentes({ atividades }: AtividadesRecentesProps) {
  const obterIcone = (tipo: string) => {
    switch (tipo) {
      case 'concluiu':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'iniciou':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'validou':
        return <Eye className="w-4 h-4 text-purple-600" />;
      case 'editou':
        return <Edit className="w-4 h-4 text-orange-600" />;
      case 'revisou':
        return <Eye className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const obterCorFundo = (tipo: string) => {
    switch (tipo) {
      case 'concluiu':
        return 'bg-green-50 border-green-200';
      case 'iniciou':
        return 'bg-blue-50 border-blue-200';
      case 'validou':
        return 'bg-purple-50 border-purple-200';
      case 'editou':
        return 'bg-orange-50 border-orange-200';
      case 'revisou':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Activity className="w-4 h-4 mr-2 text-gray-600" />
          ATIVIDADES RECENTES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {atividades.map((atividade) => (
            <div 
              key={atividade.id}
              className={`flex items-center space-x-3 p-2 rounded-lg border ${obterCorFundo(atividade.tipo)}`}
            >
              <div className="flex-shrink-0">
                {obterIcone(atividade.tipo)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{atividade.usuario}</span>
                  <span className="text-sm text-gray-600">{atividade.acao}</span>
                </div>
                {atividade.detalhe && (
                  <p className="text-xs text-gray-600 truncate">{atividade.detalhe}</p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <span className="text-xs text-gray-500">{atividade.tempo}</span>
              </div>
            </div>
          ))}
          
          {atividades.length === 0 && (
            <div className="text-center py-4">
              <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 