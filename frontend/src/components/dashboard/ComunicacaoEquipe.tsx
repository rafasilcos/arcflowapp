// ===== COMUNICAÇÃO DA EQUIPE =====
// Componente extraído da V7-Otimizada

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare } from 'lucide-react';

interface ComunicacaoEquipeProps {
  equipe: Array<{
    nome: string;
    avatar: string;
    status: 'Online' | 'Ausente' | 'Ocupada';
  }>;
  mensagens: Array<{
    id: string;
    usuario: string;
    avatar: string;
    mensagem: string;
    data: string;
    mencoes?: string[];
  }>;
  onEnviarMensagem: (mensagem: string) => void;
}

export function ComunicacaoEquipe({ equipe, mensagens, onEnviarMensagem }: ComunicacaoEquipeProps) {
  const [novaMensagem, setNovaMensagem] = useState('');

  const formatarTempo = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleEnviar = () => {
    if (novaMensagem.trim()) {
      onEnviarMensagem(novaMensagem.trim());
      setNovaMensagem('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Status da Equipe */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
            STATUS DA EQUIPE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {equipe.map((membro) => (
              <div 
                key={membro.nome}
                className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {membro.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{membro.nome}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      membro.status === 'Online' ? 'bg-green-500' :
                      membro.status === 'Ocupada' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs text-gray-600">{membro.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat da Equipe */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">CHAT DO PROJETO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {mensagens.map((msg) => (
              <div key={msg.id} className="flex space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="font-medium">{msg.usuario}</span>
                    <span>{formatarTempo(msg.data)}</span>
                  </div>
                  <p className="text-sm text-gray-900 mt-1">{msg.mensagem}</p>
                  {msg.mencoes && msg.mencoes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.mencoes.map((mencao, index) => (
                        <Badge key={index} className="text-xs bg-blue-100 text-blue-700">
                          @{mencao}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input para nova mensagem */}
          <div className="flex space-x-2">
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
            />
            <Button
              onClick={handleEnviar}
              disabled={!novaMensagem.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 