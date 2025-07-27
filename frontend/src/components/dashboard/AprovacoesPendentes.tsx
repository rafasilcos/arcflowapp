// ===== APROVAÇÕES PENDENTES =====
// Componente extraído da V7-Otimizada

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AprovacoesPendentesProps {
  aprovacoes: Array<{
    id: string;
    tipo: 'aguardando_revisao' | 'aprovacoes_hoje' | 'em_revisao';
    titulo: string;
    responsavel: string;
    prazo?: string;
  }>;
  onAprovar: (id: string) => void;
  onContinuar: (id: string) => void;
}

export function AprovacoesPendentes({ aprovacoes, onAprovar, onContinuar }: AprovacoesPendentesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
          APROVAÇÕES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {aprovacoes.map((aprovacao) => (
            <div 
              key={aprovacao.id}
              className={`p-2 rounded-lg border ${
                aprovacao.tipo === 'aguardando_revisao' 
                  ? 'bg-orange-50 border-orange-200' 
                  : aprovacao.tipo === 'aprovacoes_hoje'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {aprovacao.tipo === 'aguardando_revisao' ? (
                    <Clock className="w-4 h-4 text-orange-600" />
                  ) : aprovacao.tipo === 'aprovacoes_hoje' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    aprovacao.tipo === 'aguardando_revisao' ? 'text-orange-800' : 
                    aprovacao.tipo === 'aprovacoes_hoje' ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {aprovacao.titulo}
                  </span>
                </div>
                {aprovacao.prazo && (
                  <Badge className="text-xs bg-white border border-gray-200">
                    {aprovacao.prazo}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  👤 {aprovacao.responsavel}
                </span>
                <div className="flex space-x-1">
                  {aprovacao.tipo === 'aguardando_revisao' && (
                    <Button
                      size="sm"
                      onClick={() => onContinuar(aprovacao.id)}
                      className="h-6 px-2 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Continuar
                    </Button>
                  )}
                  {aprovacao.tipo === 'aprovacoes_hoje' && (
                    <Button
                      size="sm"
                      onClick={() => onAprovar(aprovacao.id)}
                      className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Aprovar
                    </Button>
                  )}
                  {aprovacao.tipo === 'em_revisao' && (
                    <Button
                      size="sm"
                      onClick={() => onContinuar(aprovacao.id)}
                      className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Revisar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 