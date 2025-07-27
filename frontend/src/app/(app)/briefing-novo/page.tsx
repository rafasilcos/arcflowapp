'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Briefing {
  id: string;
  nomeProjeto: string;
  nome_projeto?: string;
  descricao?: string;
  status: string;
  progresso: number;
  disciplina?: string;
  area?: string;
  tipologia?: string;
  orcamento?: string;
  prazo?: string;
  createdAt: string;
  updatedAt: string;
  cliente?: {
    id: string;
    nome: string;
    email: string;
  };
  responsavel?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    respostas: number;
  };
}

interface ApiResponse {
  briefings: Briefing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function BriefingNovo() {
  const [loading, setLoading] = useState(true);
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const fazerLogin = async () => {
    try {
      console.log('🔐 Tentando login...');
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@arcflow.com',
          password: '123456'
        })
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(`Falha no login: ${loginResponse.status} - ${errorText}`);
      }

      const loginData = await loginResponse.json();
      if (!loginData.token) {
        throw new Error('Token não recebido no login');
      }

      console.log('✅ Login realizado com sucesso');
      setToken(loginData.token);
      return loginData.token;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  const carregarBriefings = async (authToken: string) => {
    try {
      console.log('📋 Carregando briefings...');
      const briefingsResponse = await fetch('http://localhost:3001/api/briefings?limit=20', {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!briefingsResponse.ok) {
        const errorText = await briefingsResponse.text();
        throw new Error(`Erro na API: ${briefingsResponse.status} - ${errorText}`);
      }

      const data: ApiResponse = await briefingsResponse.json();
      console.log('✅ Dados recebidos:', data);

      // Validar estrutura da resposta
      if (!data.briefings || !Array.isArray(data.briefings)) {
        throw new Error('Estrutura de resposta inválida - briefings não encontrados');
      }

      setBriefings(data.briefings);
      console.log(`✅ ${data.briefings.length} briefings carregados`);
      
    } catch (error) {
      console.error('❌ Erro ao carregar briefings:', error);
      throw error;
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      try {
        setLoading(true);
        setError('');
        
        const authToken = await fazerLogin();
        await carregarBriefings(authToken);
        
      } catch (err) {
        console.error('❌ Erro na inicialização:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    inicializar();
  }, []);

  const recarregar = async () => {
    if (token) {
      try {
        setLoading(true);
        setError('');
        await carregarBriefings(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    } else {
      window.location.reload();
    }
  };

  const formatarData = (dataString: string) => {
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const obterNomeProjeto = (briefing: Briefing) => {
    return briefing.nomeProjeto || briefing.nome_projeto || 'Projeto sem nome';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="w-6 h-6 animate-spin" />
          <h1 className="text-2xl font-bold">Carregando Briefings...</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-red-600">Erro no Sistema</h1>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Erro detectado:</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button 
                  onClick={recarregar}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  🔄 Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📋 Dashboard de Briefings</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Briefing
        </Button>
      </div>

      {briefings.length > 0 && (
        <Card className="border-green-200 bg-green-50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">
                ✅ Conectado ao PostgreSQL - {briefings.length} briefings carregados
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {briefings.map((briefing) => (
          <Card key={briefing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">
                    {obterNomeProjeto(briefing)}
                  </CardTitle>
                  {briefing.descricao && (
                    <p className="text-gray-600 text-sm">{briefing.descricao}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <div className="mt-1">
                    <Badge variant={briefing.status === 'ativo' ? 'default' : 'secondary'}>
                      {briefing.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Progresso</span>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${briefing.progresso || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{briefing.progresso || 0}%</span>
                    </div>
                  </div>
                </div>

                {briefing.disciplina && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Disciplina</span>
                    <p className="mt-1 text-sm">{briefing.disciplina}</p>
                  </div>
                )}

                {briefing.cliente && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Cliente</span>
                    <p className="mt-1 text-sm font-medium">{briefing.cliente.nome}</p>
                  </div>
                )}

                {briefing.responsavel && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Responsável</span>
                    <p className="mt-1 text-sm">{briefing.responsavel.name}</p>
                  </div>
                )}

                {briefing._count?.respostas !== undefined && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Respostas</span>
                    <p className="mt-1 text-sm">{briefing._count.respostas} respostas</p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-500">Criado em</span>
                  <p className="mt-1 text-sm">{formatarData(briefing.createdAt)}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">ID</span>
                  <p className="mt-1 text-xs font-mono text-gray-600">{briefing.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {briefings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum briefing encontrado</h3>
            <p className="text-gray-600 mb-4">Comece criando seu primeiro briefing</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Briefing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 