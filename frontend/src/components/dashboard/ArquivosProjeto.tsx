// ===== ARQUIVOS DO PROJETO =====
// Componente extraído da V7-Otimizada

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Upload, Folder } from 'lucide-react';

interface ArquivosProjetoProps {
  arquivos: Array<{
    id: string;
    nome: string;
    tipo: string;
    tamanho: string;
    etapa: string;
    dataModificacao: string;
    status: 'aprovado' | 'em_revisao' | 'pendente';
  }>;
  onDownload: (id: string) => void;
  onVisualizar: (id: string) => void;
  onUpload: () => void;
}

export function ArquivosProjeto({ arquivos, onDownload, onVisualizar, onUpload }: ArquivosProjetoProps) {
  const obterIconeArquivo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'dwg':
      case 'dxf':
        return '📐';
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'png':
      case 'jpeg':
        return '🖼️';
      default:
        return '📁';
    }
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'em_revisao':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pendente':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Agrupar arquivos por etapa
  const arquivosPorEtapa = arquivos.reduce((acc, arquivo) => {
    if (!acc[arquivo.etapa]) {
      acc[arquivo.etapa] = [];
    }
    acc[arquivo.etapa].push(arquivo);
    return acc;
  }, {} as Record<string, typeof arquivos>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Folder className="w-4 h-4 mr-2 text-blue-600" />
            ARQUIVOS DO PROJETO
          </div>
          <Button
            onClick={onUpload}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(arquivosPorEtapa).map(([etapa, arquivosEtapa]) => (
            <div key={etapa}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Folder className="w-4 h-4 mr-1 text-gray-500" />
                {etapa}
              </h4>
              <div className="space-y-2">
                {arquivosEtapa.map((arquivo) => (
                  <div 
                    key={arquivo.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-lg">{obterIconeArquivo(arquivo.tipo)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {arquivo.nome}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{arquivo.tamanho}</span>
                          <span>•</span>
                          <span>{arquivo.dataModificacao}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${obterCorStatus(arquivo.status)}`}>
                        {arquivo.status.replace('_', ' ')}
                      </Badge>
                      
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => onVisualizar(arquivo.id)}
                          size="sm"
                          className="h-6 w-6 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => onDownload(arquivo.id)}
                          size="sm"
                          className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {arquivos.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Nenhum arquivo carregado</p>
              <Button
                onClick={onUpload}
                size="sm"
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-1" />
                Carregar primeiro arquivo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 