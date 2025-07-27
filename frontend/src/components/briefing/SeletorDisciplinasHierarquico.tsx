'use client';

import React, { useState } from 'react';
import { ChevronRight, Check, Plus, X, ChevronDown, ChevronUp, Zap, Brain, CheckCircle, ChevronLeft } from 'lucide-react';
import { 
  ESTRUTURA_DISCIPLINAS, 
  SelecaoComposta, 
  validarSelecao,
  isDisciplinaAdaptativa,
  isAreaAdaptativa,
  MAPEAMENTO_BRIEFINGS
} from '@/types/disciplinas';

interface SeletorDisciplinasHierarquicoProps {
  onSelecaoCompleta: (selecao: SelecaoComposta) => void;
  clienteId?: string;
  projetoId?: string;
  selecaoInicial?: SelecaoComposta;
}

export default function SeletorDisciplinasHierarquico({
  onSelecaoCompleta,
  selecaoInicial
}: SeletorDisciplinasHierarquicoProps) {
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>(selecaoInicial?.disciplinas || []);
  const [areasSelecionadas, setAreasSelecionadas] = useState<Record<string, string>>(selecaoInicial?.areas || {});
  const [tipologiasSelecionadas, setTipologiasSelecionadas] = useState<Record<string, string>>(selecaoInicial?.tipologias || {});
  const [disciplinasExpandidas, setDisciplinasExpandidas] = useState<Record<string, boolean>>({});
  const [areasExpandidas, setAreasExpandidas] = useState<Record<string, boolean>>({});

  const handleSelecionarDisciplina = (disciplinaId: string) => {
    if (disciplinasSelecionadas.includes(disciplinaId)) {
      // Remove disciplina e suas seleções
      setDisciplinasSelecionadas(prev => prev.filter(d => d !== disciplinaId));
      const novasAreas = { ...areasSelecionadas };
      const novasTipologias = { ...tipologiasSelecionadas };
      delete novasAreas[disciplinaId];
      delete novasTipologias[disciplinaId];
      setAreasSelecionadas(novasAreas);
      setTipologiasSelecionadas(novasTipologias);
      
      // Colapsar cards
      setDisciplinasExpandidas(prev => ({ ...prev, [disciplinaId]: false }));
      setAreasExpandidas(prev => ({ ...prev, [disciplinaId]: false }));
    } else {
      // Adiciona disciplina
      setDisciplinasSelecionadas(prev => [...prev, disciplinaId]);
      
      const disciplinaConfig = ESTRUTURA_DISCIPLINAS[disciplinaId];
      
      if (disciplinaConfig.adaptativo) {
        // Para disciplinas adaptativas, configurar automaticamente
        const primeiraArea = Object.keys(disciplinaConfig.areas)[0];
        const primeiraTipologia = Object.keys(disciplinaConfig.areas[primeiraArea].tipologias)[0];
        
        setAreasSelecionadas(prev => ({
          ...prev,
          [disciplinaId]: primeiraArea
        }));
        
        setTipologiasSelecionadas(prev => ({
          ...prev,
          [disciplinaId]: primeiraTipologia
        }));
        
        // Não expandir para adaptativas - já está completo
        setDisciplinasExpandidas(prev => ({ ...prev, [disciplinaId]: false }));
      } else {
        // Para disciplinas normais, expandir para mostrar áreas
        setDisciplinasExpandidas(prev => ({ ...prev, [disciplinaId]: true }));
      }
    }
  };

  const handleSelecionarArea = (disciplinaId: string, areaId: string) => {
    setAreasSelecionadas(prev => ({
      ...prev,
      [disciplinaId]: areaId
    }));
    
    // Remove tipologia anterior se mudou de área
    const novasTipologias = { ...tipologiasSelecionadas };
    delete novasTipologias[disciplinaId];
    setTipologiasSelecionadas(novasTipologias);
    
    // Expandir para mostrar tipologias
    setAreasExpandidas(prev => ({ ...prev, [disciplinaId]: true }));
  };

  const handleSelecionarTipologia = (disciplinaId: string, tipologiaId: string) => {
    setTipologiasSelecionadas(prev => ({
      ...prev,
      [disciplinaId]: tipologiaId
    }));
  };

  const podeIniciarBriefings = () => {
    return disciplinasSelecionadas.length > 0 && 
           disciplinasSelecionadas.every(d => {
             const disciplina = ESTRUTURA_DISCIPLINAS[d];
             if (disciplina.adaptativo) return true;
             return areasSelecionadas[d] && tipologiasSelecionadas[d];
           });
  };

  const handleIniciarBriefings = () => {
    const briefingIds = disciplinasSelecionadas.map(disciplina => {
      const area = areasSelecionadas[disciplina];
      const tipologia = tipologiasSelecionadas[disciplina];
      const config = ESTRUTURA_DISCIPLINAS[disciplina];
      return config.areas[area]?.tipologias[tipologia]?.briefingId || '';
    }).filter(id => id);

    const selecao: SelecaoComposta = {
      disciplinas: disciplinasSelecionadas,
      areas: areasSelecionadas,
      tipologias: tipologiasSelecionadas,
      briefingIds,
      ordemPreenchimento: disciplinasSelecionadas
    };
    onSelecaoCompleta(selecao);
  };

  const renderDisciplinaCard = (disciplinaId: string, disciplina: any) => {
    const isSelected = disciplinasSelecionadas.includes(disciplinaId);
    const isExpanded = disciplinasExpandidas[disciplinaId];
    const isAdaptativa = disciplina.adaptativo;

    return (
      <div key={disciplinaId} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
        {/* Header da Disciplina */}
        <div
          onClick={() => handleSelecionarDisciplina(disciplinaId)}
          className={`
            p-6 cursor-pointer transition-all duration-200
            ${isSelected 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100' 
              : 'hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{disciplina.icone}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {disciplina.nome}
                  {isAdaptativa && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      SISTEMA ADAPTATIVO
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{disciplina.descricao}</p>
                {isAdaptativa && (
                  <p className="text-sm text-purple-600 mt-1">
                    ⚡ Configuração automática - sem necessidade de seleções adicionais
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isSelected && (
                <CheckCircle className="w-6 h-6 text-blue-500" />
              )}
              {!isAdaptativa && isSelected && (
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              )}
            </div>
          </div>
        </div>

        {/* Áreas (só para disciplinas não adaptativas) */}
        {isSelected && !isAdaptativa && isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              📐 Selecione a Área de Atuação
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(disciplina.areas).map(([areaId, area]: [string, any]) => {
                const isAreaSelected = areasSelecionadas[disciplinaId] === areaId;
                
                return (
                  <div
                    key={areaId}
                    onClick={() => handleSelecionarArea(disciplinaId, areaId)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${isAreaSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{area.icone}</span>
                        <div>
                          <h5 className="font-medium text-gray-900">{area.nome}</h5>
                          <p className="text-sm text-gray-600">{area.descricao}</p>
                        </div>
                      </div>
                      {isAreaSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tipologias */}
        {isSelected && !isAdaptativa && areasSelecionadas[disciplinaId] && areasExpandidas[disciplinaId] && (
          <div className="px-6 py-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              🏗️ Selecione a Tipologia do Projeto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(disciplina.areas[areasSelecionadas[disciplinaId]].tipologias).map(([tipologiaId, tipologia]: [string, any]) => {
                const isTipologiaSelected = tipologiasSelecionadas[disciplinaId] === tipologiaId;
                
                return (
                  <div
                    key={tipologiaId}
                    onClick={() => handleSelecionarTipologia(disciplinaId, tipologiaId)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${isTipologiaSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{tipologia.icone}</span>
                        <div>
                          <h5 className="font-medium text-gray-900">{tipologia.nome}</h5>
                          <p className="text-sm text-gray-600 mb-2">{tipologia.descricao}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{tipologia.tempoEstimado}</span>
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${tipologia.complexidade === 'baixa' ? 'bg-green-100 text-green-800' :
                                tipologia.complexidade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                tipologia.complexidade === 'alta' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }
                            `}>
                              {tipologia.complexidade.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isTipologiaSelected && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Seleção de Disciplinas - ArcFlow
        </h1>
        <p className="text-gray-600 text-lg">
          Selecione as disciplinas do seu projeto. Os cards se expandem automaticamente para configuração.
        </p>
      </div>

      {/* Cards das Disciplinas */}
      <div className="space-y-4 mb-8">
        {Object.entries(ESTRUTURA_DISCIPLINAS).map(([disciplinaId, disciplina]) => 
          renderDisciplinaCard(disciplinaId, disciplina)
        )}
      </div>

      {/* Resumo das Seleções */}
      {disciplinasSelecionadas.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Resumo das Seleções ({disciplinasSelecionadas.length} disciplina{disciplinasSelecionadas.length > 1 ? 's' : ''})
          </h3>
          
          <div className="space-y-2">
            {disciplinasSelecionadas.map(disciplinaId => {
              const disciplina = ESTRUTURA_DISCIPLINAS[disciplinaId];
              const area = areasSelecionadas[disciplinaId];
              const tipologia = tipologiasSelecionadas[disciplinaId];
              
              return (
                <div key={disciplinaId} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{disciplina.icone}</span>
                    <div>
                      <span className="font-medium text-gray-900">{disciplina.nome}</span>
                      {area && tipologia && (
                        <span className="text-sm text-gray-600 ml-2">
                          → {disciplina.areas[area].nome} → {disciplina.areas[area].tipologias[tipologia].nome}
                        </span>
                      )}
                      {disciplina.adaptativo && (
                        <span className="text-sm text-purple-600 ml-2">→ Sistema Adaptativo</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {disciplina.adaptativo ? 'Configurado automaticamente' : 
                     (area && tipologia) ? 'Configurado' : 'Configuração pendente'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão de Iniciar Briefings */}
      {podeIniciarBriefings() && (
        <div className="text-center">
          <button
            onClick={handleIniciarBriefings}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CheckCircle className="w-6 h-6 mr-3" />
            Iniciar Briefings ({disciplinasSelecionadas.length} disciplina{disciplinasSelecionadas.length > 1 ? 's' : ''})
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Todas as configurações estão completas. Clique para iniciar o preenchimento dos briefings.
          </p>
        </div>
      )}

      {/* Indicador de Progresso */}
      {disciplinasSelecionadas.length > 0 && !podeIniciarBriefings() && (
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Brain className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Complete a configuração das disciplinas selecionadas para continuar
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 