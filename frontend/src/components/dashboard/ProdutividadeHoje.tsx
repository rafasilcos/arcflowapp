// ===== PRODUTIVIDADE HOJE =====
// Componente extraído da V7-Otimizada

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, CheckCircle2 } from 'lucide-react';

interface ProdutividadeHojeProps {
  metricas: {
    paraFazer: number;
    fazendo: number;
    revisaoConcluida: number;
    totalHoje: number;
  };
}

export function ProdutividadeHoje({ metricas }: ProdutividadeHojeProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
          PRODUTIVIDADE HOJE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Para fazer</span>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {metricas.paraFazer}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">Fazendo</span>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {metricas.fazendo}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Revisão concluída</span>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {metricas.revisaoConcluida}
            </Badge>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Total Hoje</span>
              <span className="text-lg font-bold text-gray-900">{metricas.totalHoje}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 