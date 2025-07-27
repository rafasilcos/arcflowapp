'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Eye, Trash2, FolderOpen, FileText, Image, Archive, ArrowLeft, Search, Filter } from 'lucide-react';

export default function ArquivosProjetoPage() {
  const params = useParams();
  const projetoId = params.id as string;
  
  const [visualizacao, setVisualizacao] = useState('pastas');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('todas');
  const [tipoArquivo, setTipoArquivo] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [loading, setLoading] = useState(true);
  const [arquivos, setArquivos] = useState<any>(null);

  useEffect(() => {
    carregarArquivos();
  }, [projetoId]);

  const carregarArquivos = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setArquivos({
        projeto: {
          nome: 'Residência Silva - Casa Alto Padrão',
          totalArquivos: 156,
          tamanhoTotal: '2.3 GB',
          ultimaAtualizacao: '2024-02-15T10:30:00Z'
        },
        disciplinas: [
          {
            codigo: 'ARQ',
            nome: 'Arquitetura',
            icone: '🏛️',
            totalArquivos: 45,
            tamanho: '850 MB',
            pastas: [
              {
                nome: 'Plantas',
                arquivos: [
                  { id: '1', nome: 'Planta Baixa Térreo.dwg', tipo: 'dwg', tamanho: '2.3 MB', versao: 'R03', data: '2024-02-15', autor: 'João Silva' },
                  { id: '2', nome: 'Planta Baixa Superior.dwg', tipo: 'dwg', tamanho: '2.1 MB', versao: 'R02', data: '2024-02-10', autor: 'João Silva' }
                ]
              },
              {
                nome: 'Cortes',
                arquivos: [
                  { id: '3', nome: 'Corte AA.dwg', tipo: 'dwg', tamanho: '1.8 MB', versao: 'R02', data: '2024-02-12', autor: 'Maria Santos' },
                  { id: '4', nome: 'Corte BB.dwg', tipo: 'dwg', tamanho: '1.9 MB', versao: 'R01', data: '2024-02-08', autor: 'Maria Santos' }
                ]
              },
              {
                nome: 'Fachadas',
                arquivos: [
                  { id: '5', nome: 'Fachada Principal.dwg', tipo: 'dwg', tamanho: '3.2 MB', versao: 'R04', data: '2024-02-14', autor: 'João Silva' },
                  { id: '6', nome: 'Fachada Posterior.dwg', tipo: 'dwg', tamanho: '2.8 MB', versao: 'R03', data: '2024-02-13', autor: 'João Silva' }
                ]
              }
            ]
          },
          {
            codigo: 'EST',
            nome: 'Estrutura',
            icone: '🏗️',
            totalArquivos: 28,
            tamanho: '420 MB',
            pastas: [
              {
                nome: 'Fundação',
                arquivos: [
                  { id: '7', nome: 'Planta de Fundação.dwg', tipo: 'dwg', tamanho: '1.5 MB', versao: 'R01', data: '2024-02-05', autor: 'Carlos Lima' }
                ]
              },
              {
                nome: 'Estrutura',
                arquivos: [
                  { id: '8', nome: 'Estrutura Térreo.dwg', tipo: 'dwg', tamanho: '2.1 MB', versao: 'R02', data: '2024-02-10', autor: 'Carlos Lima' }
                ]
              }
            ]
          },
          {
            codigo: 'ELE',
            nome: 'Elétrica',
            icone: '⚡',
            totalArquivos: 15,
            tamanho: '180 MB',
            pastas: [
              {
                nome: 'Plantas',
                arquivos: [
                  { id: '9', nome: 'Elétrica Térreo.dwg', tipo: 'dwg', tamanho: '1.2 MB', versao: 'R01', data: '2024-02-01', autor: 'Pedro Costa' }
                ]
              }
            ]
          }
        ],
        recentes: [
          { id: '1', nome: 'Planta Baixa Térreo.dwg', disciplina: 'ARQ', tipo: 'dwg', data: '2024-02-15', autor: 'João Silva' },
          { id: '5', nome: 'Fachada Principal.dwg', disciplina: 'ARQ', tipo: 'dwg', data: '2024-02-14', autor: 'João Silva' },
          { id: '6', nome: 'Fachada Posterior.dwg', disciplina: 'ARQ', tipo: 'dwg', data: '2024-02-13', autor: 'João Silva' }
        ],
        compartilhados: [
          { id: '1', nome: 'Planta Baixa Térreo.dwg', compartilhadoCom: 'Cliente', data: '2024-02-15', status: 'Aprovado' },
          { id: '5', nome: 'Fachada Principal.dwg', compartilhadoCom: 'Cliente', data: '2024-02-14', status: 'Pendente' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obterIconeArquivo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'dwg':
      case 'dxf':
        return '📐';
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📄';
    }
  };

  const formatarTamanho = (bytes: string) => {
    return bytes; // Já vem formatado do mock
  };

  const filtrarArquivos = (arquivos: any[]) => {
    return arquivos.filter(arquivo => {
      const matchNome = arquivo.nome.toLowerCase().includes(termoPesquisa.toLowerCase());
      const matchTipo = tipoArquivo === 'todos' || arquivo.tipo === tipoArquivo;
      return matchNome && matchTipo;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando arquivos...</p>
        </div>
      </div>
    );
  }

  const renderPorPastas = () => (
    <div className="space-y-6">
      {arquivos.disciplinas
        .filter((disc: any) => disciplinaSelecionada === 'todas' || disc.codigo === disciplinaSelecionada)
        .map((disciplina: any) => (
        <Card key={disciplina.codigo} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{disciplina.icone}</span>
              <div>
                <h3 className="text-lg font-semibold">{disciplina.nome}</h3>
                <p className="text-sm text-gray-600">{disciplina.totalArquivos} arquivos • {disciplina.tamanho}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>

          <div className="grid gap-4">
            {disciplina.pastas.map((pasta: any) => (
              <div key={pasta.nome} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FolderOpen className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">{pasta.nome}</h4>
                  <Badge variant="outline" className="text-xs">{pasta.arquivos.length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filtrarArquivos(pasta.arquivos).map((arquivo: any) => (
                    <div key={arquivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{obterIconeArquivo(arquivo.tipo)}</span>
                        <div>
                          <p className="text-sm font-medium truncate">{arquivo.nome}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{arquivo.versao}</span>
                            <span>•</span>
                            <span>{arquivo.tamanho}</span>
                            <span>•</span>
                            <span>{new Date(arquivo.data).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderRecentes = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">📁 Arquivos Recentes</h3>
      <div className="space-y-3">
        {arquivos.recentes.map((arquivo: any) => (
          <div key={arquivo.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{obterIconeArquivo(arquivo.tipo)}</span>
              <div>
                <p className="font-medium">{arquivo.nome}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Badge variant="outline" className="text-xs">{arquivo.disciplina}</Badge>
                  <span>•</span>
                  <span>{arquivo.autor}</span>
                  <span>•</span>
                  <span>{new Date(arquivo.data).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderCompartilhados = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">🌐 Compartilhados com Cliente</h3>
      <div className="space-y-3">
        {arquivos.compartilhados.map((arquivo: any) => (
          <div key={arquivo.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🌐</span>
              <div>
                <p className="font-medium">{arquivo.nome}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Compartilhado em {new Date(arquivo.data).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={arquivo.status === 'Aprovado' ? 'default' : 'outline'}>
                {arquivo.status}
              </Badge>
              <Button variant="outline" size="sm">
                Ver Status
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📁 Gestão de Arquivos
              </h1>
              <p className="text-gray-600">{arquivos?.projeto.nome}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Arquivos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xl font-bold text-blue-600">{arquivos?.projeto.totalArquivos}</div>
            <div className="text-xs text-gray-600">Total de Arquivos</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">💾</div>
            <div className="text-xl font-bold text-green-600">{arquivos?.projeto.tamanhoTotal}</div>
            <div className="text-xs text-gray-600">Espaço Utilizado</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🏛️</div>
            <div className="text-xl font-bold text-purple-600">{arquivos?.disciplinas.length}</div>
            <div className="text-xs text-gray-600">Disciplinas</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🌐</div>
            <div className="text-xl font-bold text-orange-600">{arquivos?.compartilhados.length}</div>
            <div className="text-xs text-gray-600">Compartilhados</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    visualizacao === 'pastas' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setVisualizacao('pastas')}
                >
                  📁 Por Pastas
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    visualizacao === 'recentes' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setVisualizacao('recentes')}
                >
                  ⏰ Recentes
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    visualizacao === 'compartilhados' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setVisualizacao('compartilhados')}
                >
                  🌐 Compartilhados
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar arquivos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                />
              </div>

              {visualizacao === 'pastas' && (
                <>
                  <select 
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                    value={disciplinaSelecionada}
                    onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                  >
                    <option value="todas">Todas Disciplinas</option>
                    {arquivos?.disciplinas.map((disc: any) => (
                      <option key={disc.codigo} value={disc.codigo}>{disc.nome}</option>
                    ))}
                  </select>

                  <select 
                    className="p-2 border border-gray-300 rounded-lg text-sm"
                    value={tipoArquivo}
                    onChange={(e) => setTipoArquivo(e.target.value)}
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="dwg">DWG</option>
                    <option value="pdf">PDF</option>
                    <option value="jpg">Imagens</option>
                    <option value="doc">Documentos</option>
                  </select>
                </>
              )}
            </div>
          </div>
        </Card>

        <div>
          {visualizacao === 'pastas' && renderPorPastas()}
          {visualizacao === 'recentes' && renderRecentes()}
          {visualizacao === 'compartilhados' && renderCompartilhados()}
        </div>
      </div>
    </div>
  );
} 