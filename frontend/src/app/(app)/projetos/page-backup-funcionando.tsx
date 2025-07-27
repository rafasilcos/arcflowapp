'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjetoService } from '@/services/projetoService';
import { Projeto } from '@/types/projeto';

// 🏗️ MÓDULO PRINCIPAL DE PROJETOS ARCFLOW
// O CORAÇÃO E ALMA DO SISTEMA AEC

export default function ProjetosPage() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    tipologia: 'todas',
    pesquisa: ''
  });

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      const data = await ProjetoService.listarProjetos();
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const projetosFiltrados = projetos.filter(projeto => {
    const matchStatus = filtros.status === 'todos' || projeto.status === filtros.status;
    const matchTipologia = filtros.tipologia === 'todas' || projeto.tipologia === filtros.tipologia;
    const matchPesquisa = projeto.nome.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
                         projeto.codigo.toLowerCase().includes(filtros.pesquisa.toLowerCase());
    
    return matchStatus && matchTipologia && matchPesquisa;
  });

  const estatisticas = {
    total: projetos.length,
    emAndamento: projetos.filter(p => p.status === 'Em Andamento').length,
    concluidos: projetos.filter(p => p.status === 'Concluído').length,
    atrasados: projetos.filter(p => 
      p.metricas && new Date(p.dataPrevisaoTermino) < new Date() && p.status !== 'Concluído'
    ).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🏗️ Projetos AEC
            </h1>
            <p className="text-gray-600 mt-1">
              Centro de comando dos seus projetos de arquitetura e engenharia
            </p>
          </div>
          
          <Link href="/projetos/novo">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3">
              🚀 Novo Projeto (2 min)
            </Button>
          </Link>
        </div>

        {/* ESTATÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.total}</div>
            <div className="text-sm text-gray-600">Total de Projetos</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-green-600">{estatisticas.emAndamento}</div>
            <div className="text-sm text-gray-600">Em Andamento</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-purple-600">{estatisticas.concluidos}</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-red-600">{estatisticas.atrasados}</div>
            <div className="text-sm text-gray-600">Com Atrasos</div>
          </Card>
        </div>

        {/* FILTROS */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* PESQUISA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pesquisar
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Nome ou código do projeto..."
                value={filtros.pesquisa}
                onChange={(e) => setFiltros(prev => ({ ...prev, pesquisa: e.target.value }))}
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Status
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="todos">Todos os Status</option>
                <option value="Planejamento">Planejamento</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Pausado">Pausado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            {/* TIPOLOGIA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏛️ Tipologia
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filtros.tipologia}
                onChange={(e) => setFiltros(prev => ({ ...prev, tipologia: e.target.value }))}
              >
                <option value="todas">Todas as Tipologias</option>
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Institucional">Institucional</option>
                <option value="Urbanístico">Urbanístico</option>
              </select>
            </div>

            {/* AÇÕES */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFiltros({ status: 'todos', tipologia: 'todas', pesquisa: '' })}
              >
                🔄 Limpar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* LISTA DE PROJETOS */}
        <div className="space-y-4">
          {projetosFiltrados.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {projetos.length === 0 
                  ? 'Comece criando seu primeiro projeto!' 
                  : 'Ajuste os filtros para encontrar o que procura.'
                }
              </p>
              {projetos.length === 0 && (
                <Link href="/projetos/novo">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    🚀 Criar Primeiro Projeto
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            projetosFiltrados.map((projeto) => (
              <Card key={projeto.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  
                  {/* INFORMAÇÕES PRINCIPAIS */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="text-3xl">
                        {projeto.tipologia === 'Residencial' && '🏠'}
                        {projeto.tipologia === 'Comercial' && '🏢'}
                        {projeto.tipologia === 'Industrial' && '🏭'}
                        {projeto.tipologia === 'Institucional' && '🏥'}
                        {projeto.tipologia === 'Urbanístico' && '🌆'}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{projeto.nome}</h3>
                        <p className="text-gray-600">
                          {projeto.codigo} • {projeto.tipologia} • {projeto.subtipo}
                        </p>
                      </div>
                    </div>

                    {/* PROGRESSO */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso Geral</span>
                        <span className="font-semibold">{projeto.progressoGeral || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            (projeto.progressoGeral || 0) >= 80 ? 'bg-green-500' :
                            (projeto.progressoGeral || 0) >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${projeto.progressoGeral || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* INFORMAÇÕES ADICIONAIS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Início:</span>
                        <div className="font-medium">
                          {new Date(projeto.dataInicio).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Prazo:</span>
                        <div className="font-medium">
                          {new Date(projeto.dataPrevisaoTermino).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Responsável:</span>
                        <div className="font-medium">{projeto.responsavelTecnico}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Equipe:</span>
                        <div className="font-medium">{projeto.equipe?.length || 0} pessoas</div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS E AÇÕES */}
                  <div className="flex flex-col items-end space-y-3 ml-6">
                    <Badge 
                      variant={
                        projeto.status === 'Em Andamento' ? 'default' :
                        projeto.status === 'Concluído' ? 'secondary' :
                        projeto.status === 'Pausado' ? 'outline' : 'destructive'
                      }
                      className="text-sm px-3 py-1"
                    >
                      {projeto.status}
                    </Badge>

                    {/* ALERTAS */}
                    {projeto.alertas && projeto.alertas.length > 0 && (
                      <div className="flex space-x-1">
                        {projeto.alertas.slice(0, 3).map((alerta, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              alerta.tipo === 'Crítico' ? 'bg-red-500' :
                              alerta.tipo === 'Atenção' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            title={alerta.titulo}
                          ></div>
                        ))}
                      </div>
                    )}

                    {/* AÇÕES RÁPIDAS */}
                    <div className="flex space-x-2">
                      <Link href={`/projetos/${projeto.id}/dashboard`}>
                        <Button variant="outline" size="sm">
                          📊 Dashboard
                        </Button>
                      </Link>
                      <Link href={`/projetos/${projeto.id}/kanban`}>
                        <Button variant="outline" size="sm">
                          📋 Kanban
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* DISCIPLINAS RÁPIDAS */}
                {projeto.disciplinas && projeto.disciplinas.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Disciplinas:</span>
                      <div className="flex space-x-2">
                        {projeto.disciplinas.slice(0, 6).map((disciplina) => (
                          <div
                            key={disciplina.id}
                            className={`px-2 py-1 rounded text-xs ${
                              disciplina.progresso >= 90 ? 'bg-green-100 text-green-800' :
                              disciplina.progresso >= 50 ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                            title={`${disciplina.nome}: ${disciplina.progresso}%`}
                          >
                            {disciplina.icone} {disciplina.codigo}
                          </div>
                        ))}
                        {projeto.disciplinas.length > 6 && (
                          <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            +{projeto.disciplinas.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* PAGINAÇÃO (se necessário) */}
        {projetosFiltrados.length > 10 && (
          <Card className="p-4">
            <div className="flex justify-center">
              <div className="text-sm text-gray-600">
                Mostrando {Math.min(10, projetosFiltrados.length)} de {projetosFiltrados.length} projetos
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 