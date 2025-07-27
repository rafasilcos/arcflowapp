import React, { useState } from 'react';
import HistoryViewer from './HistoryViewer';

export interface Disciplina {
  nome: string;
  horas: number;
  valor: number;
  percentual: number;
  detalhes?: {
    valorHora: number;
    multiplicador: number;
    fases: Array<{
      nome: string;
      horas: number;
      valor: number;
    }>;
  };
}

export interface Fase {
  nome: string;
  prazo: number;
  percentual: number;
  disciplinas: Array<{
    nome: string;
    horas: number;
    valor: number;
  }>;
}

export interface BudgetBreakdownProps {
  disciplinas: Disciplina[];
  fases: Fase[];
  valorTotal: number;
  horasTotal: number;
  orcamentoId?: string;
  briefingId?: string;
  onEditarDisciplina?: (disciplina: string, novoValor: number) => void;
  onEditarFase?: (fase: string, novoPrazo: number) => void;
  editavel?: boolean;
}



export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  disciplinas,
  fases,
  valorTotal,
  horasTotal,
  orcamentoId,
  briefingId,
  onEditarDisciplina,
  onEditarFase,
  editavel = false
}) => {
  const [visualizacao, setVisualizacao] = useState<'disciplinas' | 'fases'>('disciplinas');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string | null>(null);
  const [editandoValor, setEditandoValor] = useState<{ disciplina: string; valor: number } | null>(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  // Cores para os gráficos
  const cores = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarHoras = (horas: number) => {
    return `${horas.toLocaleString('pt-BR')}h`;
  };

  const dadosGraficoPizza = disciplinas.map((disciplina, index) => ({
    name: disciplina.nome,
    value: disciplina.valor,
    percentual: disciplina.percentual,
    color: cores[index % cores.length]
  }));

  const dadosGraficoBarras = disciplinas.map((disciplina, index) => ({
    nome: disciplina.nome.length > 15 ? disciplina.nome.substring(0, 15) + '...' : disciplina.nome,
    valor: disciplina.valor,
    horas: disciplina.horas,
    color: cores[index % cores.length]
  }));

  const handleEditarValor = (disciplina: string, novoValor: number) => {
    if (onEditarDisciplina) {
      onEditarDisciplina(disciplina, novoValor);
    }
    setEditandoValor(null);
  };



  return (
    <div className="space-y-6">
      {/* Cabeçalho com Navegação */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Detalhamento do Orçamento</h2>
        <div className="flex items-center space-x-4">
          {orcamentoId && (
            <button
              onClick={() => setMostrarHistorico(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Histórico
            </button>
          )}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVisualizacao('disciplinas')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'disciplinas'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Por Disciplinas
            </button>
            <button
              onClick={() => setVisualizacao('fases')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'fases'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Por Fases
            </button>
          </div>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium">Valor Total</div>
          <div className="text-2xl font-bold text-blue-900">{formatarValor(valorTotal)}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm font-medium">Horas Total</div>
          <div className="text-2xl font-bold text-green-900">{formatarHoras(horasTotal)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-purple-600 text-sm font-medium">Valor/Hora Médio</div>
          <div className="text-2xl font-bold text-purple-900">
            {formatarValor(valorTotal / horasTotal)}
          </div>
        </div>
      </div>

      {visualizacao === 'disciplinas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza Simples */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Valor</h3>
            <div className="space-y-3">
              {dadosGraficoPizza.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatarValor(item.value)}</div>
                    <div className="text-xs text-gray-500">{item.percentual.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparativo Simples */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comparativo Valor vs Horas</h3>
            <div className="space-y-4">
              {dadosGraficoBarras.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.nome}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatarValor(item.valor)}</div>
                      <div className="text-xs text-gray-500">{formatarHoras(item.horas)}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.valor / valorTotal) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista Detalhada */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {visualizacao === 'disciplinas' ? 'Disciplinas' : 'Fases do Projeto'}
          </h3>
        </div>

        {visualizacao === 'disciplinas' ? (
          <div className="divide-y divide-gray-200">
            {disciplinas.map((disciplina, index) => (
              <div key={disciplina.nome} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: cores[index % cores.length] }}
                    ></div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{disciplina.nome}</h4>
                      <p className="text-sm text-gray-500">
                        {formatarHoras(disciplina.horas)} • {disciplina.percentual.toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {editavel && editandoValor?.disciplina === disciplina.nome ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editandoValor.valor}
                          onChange={(e) => setEditandoValor({
                            disciplina: disciplina.nome,
                            valor: parseFloat(e.target.value) || 0
                          })}
                          className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => handleEditarValor(disciplina.nome, editandoValor.valor)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditandoValor(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="text-xl font-bold text-gray-900">
                            {formatarValor(disciplina.valor)}
                          </div>
                          {disciplina.detalhes && (
                            <div className="text-sm text-gray-500">
                              {formatarValor(disciplina.detalhes.valorHora)}/h
                            </div>
                          )}
                        </div>
                        {editavel && (
                          <button
                            onClick={() => setEditandoValor({
                              disciplina: disciplina.nome,
                              valor: disciplina.valor
                            })}
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes da Disciplina */}
                {disciplina.detalhes && (
                  <div className="mt-4 pl-7">
                    <button
                      onClick={() => setDisciplinaSelecionada(
                        disciplinaSelecionada === disciplina.nome ? null : disciplina.nome
                      )}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {disciplinaSelecionada === disciplina.nome ? 'Ocultar detalhes' : 'Ver detalhes'}
                    </button>
                    
                    {disciplinaSelecionada === disciplina.nome && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Valor por Hora:</span>
                            <div className="font-medium">{formatarValor(disciplina.detalhes.valorHora)}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Multiplicador:</span>
                            <div className="font-medium">{disciplina.detalhes.multiplicador}x</div>
                          </div>
                        </div>
                        
                        {disciplina.detalhes.fases.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Distribuição por Fases:</h5>
                            <div className="space-y-2">
                              {disciplina.detalhes.fases.map((fase, faseIndex) => (
                                <div key={faseIndex} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">{fase.nome}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">{formatarHoras(fase.horas)}</span>
                                    <span className="font-medium">{formatarValor(fase.valor)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {fases.map((fase, index) => (
              <div key={fase.nome} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{fase.nome}</h4>
                    <p className="text-sm text-gray-500">
                      {fase.prazo} dias • {fase.percentual.toFixed(1)}% do cronograma
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatarValor(fase.disciplinas.reduce((sum, d) => sum + d.valor, 0))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatarHoras(fase.disciplinas.reduce((sum, d) => sum + d.horas, 0))}
                    </div>
                  </div>
                </div>

                {/* Disciplinas da Fase */}
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <div className="space-y-2">
                    {fase.disciplinas.map((disciplina, discIndex) => (
                      <div key={discIndex} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{disciplina.nome}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{formatarHoras(disciplina.horas)}</span>
                          <span className="font-medium">{formatarValor(disciplina.valor)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal do Histórico */}
      {mostrarHistorico && orcamentoId && (
        <HistoryViewer
          orcamentoId={orcamentoId}
          briefingId={briefingId}
          onClose={() => setMostrarHistorico(false)}
        />
      )}
    </div>
  );
};

export default BudgetBreakdown;