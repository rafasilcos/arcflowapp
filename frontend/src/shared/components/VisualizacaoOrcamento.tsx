/**
 * 📊 COMPONENTE DE VISUALIZAÇÃO DINÂMICA DO ORÇAMENTO
 * Exibe cronograma e valores que se atualizam automaticamente conforme disciplinas ativas
 */

'use client';

import React from 'react';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { FaseCronograma } from '../types/disciplinas';
import { useThemeOptimized } from '@/hooks/useThemeOptimized';

interface VisualizacaoOrcamentoProps {
  orcamentoId?: string;
  className?: string;
}

export function VisualizacaoOrcamento({ orcamentoId, className = '' }: VisualizacaoOrcamentoProps) {
  const {
    getDisciplinasAtivas,
    getCronogramaAtualizado,
    getValorTotal,
    calculoAtual
  } = useDisciplinas();

  const { classes, tema, isElegante } = useThemeOptimized();

  const disciplinasAtivas = getDisciplinasAtivas();
  const cronograma = getCronogramaAtualizado();
  const valorTotal = getValorTotal();

  if (!calculoAtual) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className={`h-8 rounded ${isElegante ? 'bg-gray-200' : 'bg-white/10'}`}></div>
          <div className={`h-32 rounded ${isElegante ? 'bg-gray-200' : 'bg-white/10'}`}></div>
          <div className={`h-24 rounded ${isElegante ? 'bg-gray-200' : 'bg-white/10'}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header com Estatísticas */}
      <div className={`rounded-lg p-6 ${
        isElegante 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50' 
          : 'bg-gradient-to-r from-white/10 to-white/5'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${isElegante ? 'text-gray-900' : classes.text}`}>
          Orçamento Dinâmico
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${isElegante ? 'text-blue-600' : classes.text}`} style={!isElegante ? { color: tema.primaria } : {}}>
              R$ {valorTotal.toLocaleString('pt-BR')}
            </div>
            <div className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
              Valor Total
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${isElegante ? 'text-green-600' : classes.text}`} style={!isElegante ? { color: tema.acento } : {}}>
              {calculoAtual.prazoTotal}
            </div>
            <div className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
              Semanas
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${isElegante ? 'text-purple-600' : classes.text}`} style={!isElegante ? { color: tema.secundaria } : {}}>
              {calculoAtual.estatisticas.fasesAtivas}
            </div>
            <div className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
              Fases Ativas
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${isElegante ? 'text-orange-600' : classes.text}`} style={!isElegante ? { color: tema.acento } : {}}>
              {calculoAtual.estatisticas.disciplinasCount}
            </div>
            <div className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
              Disciplinas
            </div>
          </div>
        </div>
      </div>

      {/* Disciplinas Ativas */}
      <section>
        <h3 className={`text-lg font-semibold mb-4 ${isElegante ? 'text-gray-900' : classes.text}`}>
          Disciplinas Incluídas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplinasAtivas.map((disciplina) => {
            const valor = calculoAtual.valorPorDisciplina[disciplina.codigo] || 0;
            
            return (
              <div
                key={disciplina.codigo}
                className={`rounded-lg p-4 border ${isElegante ? 'bg-white border-gray-200' : classes.card}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{disciplina.icone}</span>
                  <div>
                    <h4 className={`font-medium ${isElegante ? 'text-gray-900' : classes.text}`}>
                      {disciplina.nome}
                    </h4>
                    <p className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
                      {disciplina.categoria}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isElegante ? 'text-gray-500' : classes.textSecondary}`}>
                    {disciplina.horasBase}h estimadas
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isElegante ? 'text-blue-600' : classes.text}`} style={!isElegante ? { color: tema.primaria } : {}}>
                      R$ {valor.toLocaleString('pt-BR')}
                    </span>
                    {valor === 0 && (
                      <div className="group relative">
                        <span className="text-yellow-500 cursor-help">⚠️</span>
                        <div className={`absolute bottom-full right-0 mb-2 hidden group-hover:block text-xs rounded py-1 px-2 whitespace-nowrap z-10 ${
                          isElegante ? 'bg-gray-800 text-white' : 'bg-black/80 text-white'
                        }`}>
                          Disciplina não configurada na Tabela de Preços
                        </div>
                      </div>
                    )}
                    <div className="group relative">
                      <span className={`cursor-help ${isElegante ? 'text-gray-400' : classes.textSecondary}`}>ℹ️</span>
                      <div className={`absolute bottom-full right-0 mb-2 hidden group-hover:block text-xs rounded py-1 px-2 whitespace-nowrap z-10 max-w-xs ${
                        isElegante ? 'bg-gray-800 text-white' : 'bg-black/80 text-white'
                      }`}>
                        Valor já inclui margem de lucro, impostos, overhead e demais custos indiretos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cronograma Dinâmico */}
      <section>
        <h3 className={`text-lg font-semibold mb-4 ${isElegante ? 'text-gray-900' : classes.text}`}>
          Cronograma de Execução
        </h3>
        
        <div className="space-y-4">
          {cronograma.map((fase, index) => (
            <FaseCard 
              key={fase.id} 
              fase={fase}
              index={index}
              total={cronograma.length}
              isElegante={isElegante}
              classes={classes}
              tema={tema}
            />
          ))}
        </div>
        
        {cronograma.length === 0 && (
          <div className={`text-center py-8 ${isElegante ? 'text-gray-500' : classes.textSecondary}`}>
            <div className="text-4xl mb-2">📋</div>
            <p>Nenhuma fase ativa. Ative pelo menos uma disciplina para ver o cronograma.</p>
          </div>
        )}
      </section>

      {/* Resumo Financeiro Detalhado */}
      <section>
        <h3 className={`text-lg font-semibold mb-4 ${isElegante ? 'text-gray-900' : classes.text}`}>
          Resumo Financeiro
        </h3>
        
        <div className={`rounded-lg overflow-hidden border ${isElegante ? 'bg-white border-gray-200' : classes.card}`}>
          <div className={`px-6 py-4 border-b ${
            isElegante 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-white/5 border-white/10'
          }`}>
            <h4 className={`font-medium ${isElegante ? 'text-gray-900' : classes.text}`}>
              Composição por Disciplina
            </h4>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {disciplinasAtivas.map((disciplina) => {
                const valor = calculoAtual.valorPorDisciplina[disciplina.codigo] || 0;
                const percentual = valorTotal > 0 ? (valor / valorTotal) * 100 : 0;
                
                return (
                  <div key={disciplina.codigo} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{disciplina.icone}</span>
                      <span className={isElegante ? 'text-gray-900' : classes.text}>
                        {disciplina.nome}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-medium ${isElegante ? 'text-gray-900' : classes.text}`}>
                          R$ {valor.toLocaleString('pt-BR')}
                        </div>
                        <div className={`text-sm ${isElegante ? 'text-gray-500' : classes.textSecondary}`}>
                          {percentual.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className={`w-24 rounded-full h-2 ${isElegante ? 'bg-gray-200' : 'bg-white/20'}`}>
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percentual}%`,
                            backgroundColor: isElegante ? '#2563eb' : tema.primaria
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={`mt-6 pt-4 border-t ${isElegante ? 'border-gray-200' : 'border-white/20'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-lg font-semibold ${isElegante ? 'text-gray-900' : classes.text}`}>
                  Total Geral
                </span>
                <span className={`text-2xl font-bold ${isElegante ? 'text-blue-600' : classes.text}`} style={!isElegante ? { color: tema.primaria } : {}}>
                  R$ {valorTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente do Card de Fase
interface FaseCardProps {
  fase: FaseCronograma;
  index: number;
  total: number;
  isElegante: boolean;
  classes: any;
  tema: any;
}

function FaseCard({ fase, index, total, isElegante, classes, tema }: FaseCardProps) {
  const progressPercentage = ((index + 1) / total) * 100;
  
  return (
    <div className={`rounded-lg p-6 border ${isElegante ? 'bg-white border-gray-200' : classes.card}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
              isElegante 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-white/20 text-white'
            }`} style={!isElegante ? { backgroundColor: `${tema.primaria}20`, color: tema.primaria } : {}}>
              {fase.ordem}
            </div>
            <div>
              <h4 className={`font-semibold ${isElegante ? 'text-gray-900' : classes.text}`}>
                {fase.nome}
              </h4>
              <p className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
                {fase.etapa}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-4 text-sm mb-3 ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
            <span>👥 {fase.responsavel}</span>
            <span>⏱️ {fase.prazo} semanas</span>
            <span>💰 R$ {fase.valor.toLocaleString('pt-BR')}</span>
          </div>
          
          {/* Disciplinas da Fase */}
          <div className="flex flex-wrap gap-2 mb-3">
            {fase.disciplinasAtivasNaFase?.map((disciplina) => (
              <span
                key={disciplina.codigo}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                  isElegante 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-white/20 text-white'
                }`}
                style={!isElegante ? { backgroundColor: `${tema.primaria}20`, color: tema.primaria } : {}}
              >
                {disciplina.icone} {disciplina.nome}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Entregáveis */}
      <div>
        <h5 className={`font-medium mb-2 ${isElegante ? 'text-gray-900' : classes.text}`}>
          Principais Entregáveis ({fase.entregaveis?.length || 0})
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {fase.entregaveis?.slice(0, 4).map((entregavel, idx) => (
            <div key={idx} className={`flex items-center gap-2 text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
              <span className={isElegante ? 'text-green-500' : 'text-green-400'}>✓</span>
              {entregavel}
            </div>
          ))}
          {(fase.entregaveis?.length || 0) > 4 && (
            <div className={`text-sm ${isElegante ? 'text-gray-500' : classes.textSecondary}`}>
              ... e mais {(fase.entregaveis?.length || 0) - 4} itens
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className={`mt-4 pt-4 border-t ${isElegante ? 'border-gray-200' : 'border-white/20'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${isElegante ? 'text-gray-600' : classes.textSecondary}`}>
            Progresso no cronograma
          </span>
          <span className={`text-sm font-medium ${isElegante ? 'text-gray-900' : classes.text}`}>
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${isElegante ? 'bg-gray-200' : 'bg-white/20'}`}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              background: isElegante 
                ? 'linear-gradient(to right, #3b82f6, #2563eb)' 
                : `linear-gradient(to right, ${tema.primaria}, ${tema.secundaria})`
            }}
          />
        </div>
      </div>
    </div>
  );
}