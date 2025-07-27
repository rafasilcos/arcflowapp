// ===== ALERTAS & STATUS CRÍTICOS =====
// Componente extraído da V7-Otimizada

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Eye } from 'lucide-react';

interface AlertasStatusCriticosProps {
  alertas: Array<{
    id: string;
    tipo: 'critico' | 'atencao' | 'info';
    titulo: string;
    descricao: string;
    tempoRestante?: string;
  }>;
}

export function AlertasStatusCriticos({ alertas }: AlertasStatusCriticosProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
          ALERTAS & STATUS CRÍTICOS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alertas.map((alerta) => (
            <div 
              key={alerta.id}
              className={`flex items-center justify-between p-2 rounded-lg border ${
                alerta.tipo === 'critico' 
                  ? 'bg-red-50 border-red-200' 
                  : alerta.tipo === 'atencao'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  alerta.tipo === 'critico' ? 'text-red-800' : 
                  alerta.tipo === 'atencao' ? 'text-orange-800' : 'text-blue-800'
                }`}>
                  {alerta.titulo}
                </p>
                <p className={`text-xs ${
                  alerta.tipo === 'critico' ? 'text-red-600' : 
                  alerta.tipo === 'atencao' ? 'text-orange-600' : 'text-blue-600'
                }`}>
                  {alerta.descricao}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {alerta.tempoRestante && (
                  <Badge className={`text-xs ${
                    alerta.tipo === 'critico' ? 'bg-red-100 text-red-700' : 
                    alerta.tipo === 'atencao' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {alerta.tempoRestante}
                  </Badge>
                )}
                <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 