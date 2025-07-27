'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjetoService } from '@/services/projetoService';
import { TarefaProjeto, DisciplinaProjeto } from '@/types/projeto';

// 📋 KANBAN REVOLUCIONÁRIO POR DISCIPLINAS
// GESTÃO VISUAL INTELIGENTE COM DRAG & DROP

export default function ProjetoKanbanPage() {
  const params = useParams();
  const projetoId = params.id as string;
  
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('ARQ');
  const [kanbanData, setKanbanData] = useState<any>(null);
  const [disciplinas, setDisciplinas] = useState<DisciplinaProjeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    responsavel: 'todos',
    prioridade: 'todas',
    pesquisa: ''
  });

  useEffect(() => {
    carregarDados();
  }, [projetoId, disciplinaSelecionada]);

  const carregarDados = async () => {
    try {
      const [kanban, projeto] = await Promise.all([
        ProjetoService.obterKanbanDisciplina(projetoId, disciplinaSelecionada),
        ProjetoService.obterProjeto(projetoId)
      ]);
      
      setKanbanData(kanban);
      setDisciplinas(projeto.disciplinas);
    } catch (error) {
      console.error('Erro ao carregar kanban:', error);
    } finally {
      setLoading(false);
    }
  };

  const disciplinaAtual = disciplinas.find(d => d.codigo === disciplinaSelecionada);

  if (loading || !kanbanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando kanban...</p>
        </div>
      </div>
    );
  }

  const filtrarTarefas = (tarefas: TarefaProjeto[]) => {
    return tarefas.filter(tarefa => {
      const matchResponsavel = filtros.responsavel === 'todos' || tarefa.responsavel === filtros.responsavel;
      const matchPrioridade = filtros.prioridade === 'todas' || tarefa.prioridade === filtros.prioridade;
      const matchPesquisa = tarefa.titulo.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
                           tarefa.descricao.toLowerCase().includes(filtros.pesquisa.toLowerCase());
      
      return matchResponsavel && matchPrioridade && matchPesquisa;
    });
  };

  const renderTarefa = (tarefa: TarefaProjeto) => (
    <Card key={tarefa.id} className="p-4 mb-3 cursor-move hover:shadow-md transition-shadow bg-white border border-gray-200">
      {/* HEADER DA TAREFA */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-900 leading-tight">
          {tarefa.titulo}
        </h4>
        <Badge 
          variant={
            tarefa.prioridade === 'Crítica' ? 'destructive' :
            tarefa.prioridade === 'Alta' ? 'default' :
            'outline'
          }
          className="text-xs ml-2"
        >
          {tarefa.prioridade}
        </Badge>
      </div>

      {/* DESCRIÇÃO */}
      {tarefa.descricao && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {tarefa.descricao}
        </p>
      )}

      {/* PROGRESSO */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Progresso</span>
          <span className="font-semibold">{tarefa.progresso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${
              tarefa.progresso >= 80 ? 'bg-green-500' :
              tarefa.progresso >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${tarefa.progresso}%` }}
          ></div>
        </div>
      </div>

      {/* PRAZO E RESPONSÁVEL */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">📅</span>
          <span className={`${
            new Date(tarefa.dataPrevisaoTermino) < new Date() && tarefa.status !== 'Concluído'
              ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}>
            {new Date(tarefa.dataPrevisaoTermino).toLocaleDateString('pt-BR')}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">👤</span>
          <span className="text-gray-700 font-medium">
            {tarefa.responsavel}
          </span>
        </div>
      </div>

      {/* CHECKLIST E ANEXOS */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        {tarefa.checklist && tarefa.checklist.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>☑️</span>
            <span>
              {tarefa.checklist.filter(c => c.concluido).length}/{tarefa.checklist.length}
            </span>
          </div>
        )}
        
        {tarefa.arquivos && tarefa.arquivos.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>📎</span>
            <span>{tarefa.arquivos.length}</span>
          </div>
        )}
        
        {tarefa.comentarios && tarefa.comentarios.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>💬</span>
            <span>{tarefa.comentarios.length}</span>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📋 Kanban de Tarefas
            </h1>
            <p className="text-gray-600 mt-1">
              Gestão visual inteligente por disciplina
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={carregarDados}>
              🔄 Atualizar
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              ➕ Nova Tarefa
            </Button>
          </div>
        </div>

        {/* SELETOR DE DISCIPLINAS */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">🏛️ Selecionar Disciplina</h2>
            {disciplinaAtual && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {disciplinaAtual.tarefasConcluidas}/{disciplinaAtual.tarefasTotal} tarefas
                </Badge>
                <Badge variant={disciplinaAtual.diasAtraso > 0 ? 'destructive' : 'outline'}>
                  {disciplinaAtual.progresso}% concluído
                </Badge>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {disciplinas.map((disciplina) => (
              <button
                key={disciplina.id}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  disciplina.codigo === disciplinaSelecionada
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setDisciplinaSelecionada(disciplina.codigo)}
              >
                <div className="text-2xl mb-1">{disciplina.icone}</div>
                <div className="font-semibold text-sm">{disciplina.codigo}</div>
                <div className="text-xs text-gray-600">{disciplina.nome}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {disciplina.progresso}% • {disciplina.tarefasConcluidas}/{disciplina.tarefasTotal}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* FILTROS */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pesquisar
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Título ou descrição..."
                value={filtros.pesquisa}
                onChange={(e) => setFiltros(prev => ({ ...prev, pesquisa: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Responsável
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                value={filtros.responsavel}
                onChange={(e) => setFiltros(prev => ({ ...prev, responsavel: e.target.value }))}
              >
                <option value="todos">Todos</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
                <option value="Pedro Costa">Pedro Costa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Prioridade
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                value={filtros.prioridade}
                onChange={(e) => setFiltros(prev => ({ ...prev, prioridade: e.target.value }))}
              >
                <option value="todas">Todas</option>
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Normal">Normal</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFiltros({ responsavel: 'todos', prioridade: 'todas', pesquisa: '' })}
              >
                🔄 Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xl font-bold text-blue-600">{kanbanData.metricas.totalTarefas}</div>
            <div className="text-xs text-gray-600">Total</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xl font-bold text-green-600">{kanbanData.metricas.emAndamento}</div>
            <div className="text-xs text-gray-600">Em Andamento</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-xl font-bold text-purple-600">{kanbanData.metricas.concluidas}</div>
            <div className="text-xs text-gray-600">Concluídas</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="text-xl font-bold text-red-600">{kanbanData.metricas.atrasadas}</div>
            <div className="text-xs text-gray-600">Atrasadas</div>
          </Card>
        </div>

        {/* KANBAN BOARD */}
        <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-4 gap-6">
          
          {/* COLUNA: A FAZER */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gray-50 p-4 rounded-t-xl border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">📝 A Fazer</h3>
                <Badge variant="outline" className="text-xs">
                  {filtrarTarefas(kanbanData.colunas.aFazer).length}
                </Badge>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {filtrarTarefas(kanbanData.colunas.aFazer).map(renderTarefa)}
              
              {filtrarTarefas(kanbanData.colunas.aFazer).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA: FAZENDO */}
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm">
            <div className="bg-blue-50 p-4 rounded-t-xl border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-800">⚡ Fazendo</h3>
                <Badge className="text-xs bg-blue-600 text-white">
                  {filtrarTarefas(kanbanData.colunas.fazendo).length}
                </Badge>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {filtrarTarefas(kanbanData.colunas.fazendo).map(renderTarefa)}
              
              {filtrarTarefas(kanbanData.colunas.fazendo).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💭</div>
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA: REVISÃO */}
          <div className="bg-white rounded-xl border border-yellow-200 shadow-sm">
            <div className="bg-yellow-50 p-4 rounded-t-xl border-b border-yellow-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-yellow-800">🔍 Revisão</h3>
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                  {filtrarTarefas(kanbanData.colunas.revisao).length}
                </Badge>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {filtrarTarefas(kanbanData.colunas.revisao).map(renderTarefa)}
              
              {filtrarTarefas(kanbanData.colunas.revisao).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA: CONCLUÍDO */}
          <div className="bg-white rounded-xl border border-green-200 shadow-sm">
            <div className="bg-green-50 p-4 rounded-t-xl border-b border-green-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-800">✅ Concluído</h3>
                <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                  {filtrarTarefas(kanbanData.colunas.concluido).length}
                </Badge>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {filtrarTarefas(kanbanData.colunas.concluido).map(renderTarefa)}
              
              {filtrarTarefas(kanbanData.colunas.concluido).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INFORMAÇÕES DA EQUIPE */}
        {disciplinaAtual && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">👥 Equipe da Disciplina</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="text-center">
                <div className="text-3xl mb-2">👨‍💼</div>
                <div className="font-semibold">{disciplinaAtual.responsavelPrincipal}</div>
                <div className="text-sm text-gray-600">Responsável Principal</div>
                <div className="text-xs text-gray-500 mt-1">
                  Eficiência: {disciplinaAtual.eficiencia}%
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">⏰</div>
                <div className="font-semibold">{disciplinaAtual.horasRealizadas}h</div>
                <div className="text-sm text-gray-600">Horas Realizadas</div>
                <div className="text-xs text-gray-500 mt-1">
                  Planejadas: {disciplinaAtual.horasPlanejadas}h
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="font-semibold">
                  {disciplinaAtual.diasAtraso > 0 ? `${disciplinaAtual.diasAtraso} dias` : 'No prazo'}
                </div>
                <div className="text-sm text-gray-600">Situação do Prazo</div>
                <div className="text-xs text-gray-500 mt-1">
                  Previsão: {new Date(disciplinaAtual.dataPrevisaoTermino).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 