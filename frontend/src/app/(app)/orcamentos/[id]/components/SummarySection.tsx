/**
 * 📊 COMPONENTE DE SEÇÃO DE RESUMO
 * 
 * Exibe APENAS:
 * - Dados dinâmicos do orçamento
 * - Disciplinas incluídas
 * 
 * NUNCA mostra:
 * - Cronograma do projeto (tem seção própria)
 * - Resumo financeiro (tem seção própria)
 */

import React from 'react';
import { BudgetData } from '../types/budget';

interface SummarySectionProps {
  budgetData: BudgetData;
  activeDisciplines: string[];
  classes: any;
}

// Mapeamento de disciplinas
const DISCIPLINE_INFO = {
  'ARQUITETURA': { name: 'Projeto Arquitetônico', icon: '🏗️', description: 'Desenvolvimento completo do projeto arquitetônico' },
  'ESTRUTURAL': { name: 'Projeto Estrutural', icon: '🏢', description: 'Dimensionamento e detalhamento estrutural' },
  'INSTALACOES_ELETRICAS': { name: 'Instalações Elétricas', icon: '⚡', description: 'Projeto elétrico completo' },
  'INSTALACOES_HIDRAULICAS': { name: 'Instalações Hidráulicas', icon: '🚿', description: 'Projeto hidrossanitário' },
  'CLIMATIZACAO': { name: 'Climatização (AVAC)', icon: '❄️', description: 'Sistema de climatização' },
  'PAISAGISMO': { name: 'Projeto Paisagístico', icon: '🌿', description: 'Projeto de paisagismo e áreas verdes' },
  'INTERIORES': { name: 'Design de Interiores', icon: '🛋️', description: 'Projeto de interiores e especificação' },
  'APROVACAO_LEGAL': { name: 'Aprovação Legal', icon: '📋', description: 'Projeto legal e acompanhamento' },
  'MODELAGEM_3D': { name: 'Modelagem 3D', icon: '🎨', description: 'Modelagem tridimensional e renderizações' }
};

export function SummarySection({ budgetData, activeDisciplines, classes }: SummarySectionProps) {
  
  return (
    <div className="mb-8">
      <div className={`rounded-xl p-8 border ${classes.card}`}>
        <h3 className={`text-xl font-bold mb-6 ${classes.text}`}>
          Resumo do Projeto
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Dados do Projeto */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${classes.text}`}>
              Informações Gerais
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${classes.textSecondary}`}>
                    Tipologia
                  </label>
                  <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                    {budgetData.tipologia}
                  </div>
                </div>
                
                <div>
                  <label className={`text-sm font-medium ${classes.textSecondary}`}>
                    Padrão de Construção
                  </label>
                  <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                    {budgetData.padrao}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${classes.textSecondary}`}>
                    Complexidade
                  </label>
                  <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                    {budgetData.complexidade}
                  </div>
                </div>
                
                <div>
                  <label className={`text-sm font-medium ${classes.textSecondary}`}>
                    Localização
                  </label>
                  <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                    {budgetData.localizacao || 'Não informado'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${classes.textSecondary}`}>
                    Área Construída
                  </label>
                  <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                    {budgetData.area_construida.toLocaleString('pt-BR')} m²
                  </div>
                </div>
                
                <div>
                  <label className={`text-sm font-medium ${classes.textSecondary}`}>
                    Área do Terreno
                  </label>
                  <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                    {budgetData.area_terreno ? 
                      `${budgetData.area_terreno.toLocaleString('pt-BR')} m²` : 
                      'Não informado'
                    }
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium ${classes.textSecondary}`}>
                  Valor por m²
                </label>
                <div className={`mt-1 text-lg font-semibold ${classes.text}`}>
                  R$ {budgetData.valor_por_m2.toLocaleString('pt-BR')}/m²
                </div>
              </div>
            </div>
          </div>

          {/* Disciplinas Incluídas */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${classes.text}`}>
              Disciplinas Incluídas ({activeDisciplines.length})
            </h4>
            
            <div className="space-y-3">
              {activeDisciplines.map(disciplineCode => {
                const disciplineInfo = DISCIPLINE_INFO[disciplineCode as keyof typeof DISCIPLINE_INFO] || {
                  name: disciplineCode.replace(/_/g, ' '),
                  icon: '📋',
                  description: 'Disciplina personalizada'
                };

                return (
                  <div
                    key={disciplineCode}
                    className={`p-4 rounded-lg border ${classes.cardSecondary} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{disciplineInfo.icon}</span>
                      <div className="flex-1">
                        <h5 className={`font-semibold ${classes.text}`}>
                          {disciplineInfo.name}
                        </h5>
                        <p className={`text-sm ${classes.textSecondary} mt-1`}>
                          {disciplineInfo.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 text-lg" title="Disciplina incluída">
                          ✓
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aviso se não há disciplinas */}
            {activeDisciplines.length === 0 && (
              <div className={`text-center py-8 ${classes.textSecondary}`}>
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-sm">
                  Nenhuma disciplina ativa encontrada.
                </p>
                <a
                  href="/orcamentos/configuracoes"
                  className={`inline-flex items-center gap-2 mt-3 px-3 py-2 text-sm rounded-lg ${classes.buttonSecondary}`}
                >
                  Configurar Disciplinas
                </a>
              </div>
            )}

            {/* Link para Configurações */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${classes.textSecondary}`}>
                    Personalize as disciplinas e valores
                  </p>
                </div>
                <a
                  href="/orcamentos/configuracoes"
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${classes.buttonTertiary} hover:scale-105 transition-transform`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}