// 📋 KANBAN REVOLUCIONÁRIO - COMPONENTE CENTRAL
// Sistema Visual Inteligente para Gestão de Tarefas AEC

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TarefaProjeto, DisciplinaProjeto } from '@/types/projeto';

interface KanbanRevolucionarioProps {
  projetoId: string;
  disciplinaId?: string;
  tarefas: TarefaProjeto[];
  disciplinas: DisciplinaProjeto[];
  onTarefaMove?: (tarefaId: string, novoStatus: string) => void;
  onTarefaClick?: (tarefa: TarefaProjeto) => void;
  onNovaTarefa?: () => void;
}

interface KanbanColumn {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  tarefas: TarefaProjeto[];
}

export default function KanbanRevolucionario({
  projetoId,
  disciplinaId,
  tarefas,
  disciplinas,
  onTarefaMove,
  onTarefaClick,
  onNovaTarefa
}: KanbanRevolucionarioProps) {
  
  const [filtros, setFiltros] = useState({
    responsavel: 'todos',
    prioridade: 'todas',
    pesquisa: ''
  });
  
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(
    disciplinaId || disciplinas[0]?.codigo || 'ARQ'
  );

  // Filtrar tarefas da disciplina selecionada
  const tarefasDisciplina = tarefas.filter(t => 
    !disciplinaId || t.disciplinaId === disciplinaSelecionada
  );

  // Aplicar filtros
  const tarefasFiltradas = tarefasDisciplina.filter(tarefa => {
    const matchResponsavel = filtros.responsavel === 'todos' || tarefa.responsavel === filtros.responsavel;
    const matchPrioridade = filtros.prioridade === 'todas' || tarefa.prioridade === filtros.prioridade;
    const matchPesquisa = tarefa.titulo.toLowerCase().includes(filtros.pesquisa.toLowerCase()) ||
                         tarefa.descricao.toLowerCase().includes(filtros.pesquisa.toLowerCase());
    
    return matchResponsavel && matchPrioridade && matchPesquisa;
  });

  // Organizar em colunas
  const colunas: KanbanColumn[] = [
    {
      id: 'A Fazer',
      titulo: 'A Fazer',
      icone: '📝',
      cor: 'gray',
      tarefas: tarefasFiltradas.filter(t => t.status === 'A Fazer')
    },
    {
      id: 'Fazendo',
      titulo: 'Fazendo',
      icone: '⚡',
      cor: 'blue',
      tarefas: tarefasFiltradas.filter(t => t.status === 'Fazendo')
    },
    {
      id: 'Revisão',
      titulo: 'Revisão',
      icone: '🔍',
      cor: 'yellow',
      tarefas: tarefasFiltradas.filter(t => t.status === 'Revisão')
    },
    {
      id: 'Concluído',
      titulo: 'Concluído',
      icone: '✅',
      cor: 'green',
      tarefas: tarefasFiltradas.filter(t => t.status === 'Concluído')
    }
  ];

  // Métricas rápidas
  const metricas = {
    total: tarefasFiltradas.length,
    emAndamento: colunas.find(c => c.id === 'Fazendo')?.tarefas.length || 0,
    concluidas: colunas.find(c => c.id === 'Concluído')?.tarefas.length || 0,
    atrasadas: tarefasFiltradas.filter(t => 
      new Date(t.dataPrevisaoTermino) < new Date() && t.status !== 'Concluído'
    ).length
  };

  const disciplinaAtual = disciplinas.find(d => d.codigo === disciplinaSelecionada);

  // Componente de Tarefa
  const TarefaCard = ({ tarefa }: { tarefa: TarefaProjeto }) => (
    <Card 
      className="p-4 mb-3 cursor-pointer hover:shadow-md transition-all bg-white border border-gray-200"
      onClick={() => onTarefaClick?.(tarefa)}
    >
      {/* Header da Tarefa */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">
          {tarefa.titulo}
        </h4>
        <Badge 
          variant={
            tarefa.prioridade === 'Crítica' ? 'destructive' :
            tarefa.prioridade === 'Alta' ? 'default' :
            'outline'
          }
          className="text-xs ml-2 flex-shrink-0"
        >
          {tarefa.prioridade}
        </Badge>
      </div>

      {/* Descrição */}
      {tarefa.descricao && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {tarefa.descricao}
        </p>
      )}

      {/* Progresso */}
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

      {/* Prazo e Responsável */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span className={`${
            new Date(tarefa.dataPrevisaoTermino) < new Date() && tarefa.status !== 'Concluído'
              ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}>
            {new Date(tarefa.dataPrevisaoTermino).toLocaleDateString('pt-BR')}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span>👤</span>
          <span className="text-gray-700 font-medium text-xs truncate">
            {tarefa.responsavel}
          </span>
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex space-x-2">
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
        </div>
        
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
    <div className="space-y-6">
      
      {/* SELETOR DE DISCIPLINAS */}
      {!disciplinaId && disciplinas.length > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">🏛️ Disciplina</h2>
            {disciplinaAtual && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {disciplinaAtual.tarefasConcluidas}/{disciplinaAtual.tarefasTotal} tarefas
                </Badge>
                <Badge variant={disciplinaAtual.diasAtraso > 0 ? 'destructive' : 'default'}>
                  {disciplinaAtual.progresso}%
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
                <div className="text-xs text-gray-600 truncate">{disciplina.nome}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {disciplina.progresso}%
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

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
              {Array.from(new Set(tarefasDisciplina.map(t => t.responsavel))).map(resp => (
                <option key={resp} value={resp}>{resp}</option>
              ))}
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

          <div className="flex items-end space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setFiltros({ responsavel: 'todos', prioridade: 'todas', pesquisa: '' })}
            >
              🔄 Limpar
            </Button>
            {onNovaTarefa && (
              <Button onClick={onNovaTarefa} className="flex-1">
                ➕ Nova
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xl font-bold text-blue-600">{metricas.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xl font-bold text-green-600">{metricas.emAndamento}</div>
          <div className="text-xs text-gray-600">Em Andamento</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-xl font-bold text-purple-600">{metricas.concluidas}</div>
          <div className="text-xs text-gray-600">Concluídas</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl mb-1">⚠️</div>
          <div className="text-xl font-bold text-red-600">{metricas.atrasadas}</div>
          <div className="text-xs text-gray-600">Atrasadas</div>
        </Card>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {colunas.map((coluna) => (
          <div 
            key={coluna.id}
            className={`bg-white rounded-xl border-2 shadow-sm ${
              coluna.cor === 'gray' ? 'border-gray-200' :
              coluna.cor === 'blue' ? 'border-blue-200' :
              coluna.cor === 'yellow' ? 'border-yellow-200' :
              'border-green-200'
            }`}
          >
            {/* Header da Coluna */}
            <div className={`p-4 rounded-t-xl border-b ${
              coluna.cor === 'gray' ? 'bg-gray-50 border-gray-200' :
              coluna.cor === 'blue' ? 'bg-blue-50 border-blue-200' :
              coluna.cor === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${
                  coluna.cor === 'gray' ? 'text-gray-800' :
                  coluna.cor === 'blue' ? 'text-blue-800' :
                  coluna.cor === 'yellow' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {coluna.icone} {coluna.titulo}
                </h3>
                <Badge 
                  variant={coluna.cor === 'blue' ? 'default' : 'outline'}
                  className={`text-xs ${
                    coluna.cor === 'blue' ? 'bg-blue-600' :
                    coluna.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    coluna.cor === 'green' ? 'bg-green-100 text-green-800' :
                    ''
                  }`}
                >
                  {coluna.tarefas.length}
                </Badge>
              </div>
            </div>

            {/* Tarefas da Coluna */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {coluna.tarefas.length > 0 ? (
                coluna.tarefas.map(tarefa => (
                  <TarefaCard key={tarefa.id} tarefa={tarefa} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* INFORMAÇÕES DA DISCIPLINA */}
      {disciplinaAtual && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">👥 {disciplinaAtual.nome}</h2>
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
  );
} 