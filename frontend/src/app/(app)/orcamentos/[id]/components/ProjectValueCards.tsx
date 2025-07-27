/**
 * 💰 COMPONENTE DE CARDS DE VALOR DO PROJETO
 * 
 * Exibe:
 * - Valor total do projeto (arredondado, formatado como moeda)
 * - Cards individuais para cada disciplina ATIVA
 * - Valores incluem margem, impostos e custos indiretos
 * - Nunca exibe R$ 0,00 (exceto com justificativa)
 */

import React from 'react';
import { CalculatedValues } from '../types/budget';
import { ConfigurationData } from '../types/configuration';

interface ProjectValueCardsProps {
  calculatedValues: CalculatedValues | null;
  activeDisciplines: string[];
  configurations: ConfigurationData | null;
  classes: any;
}

// Mapeamento de disciplinas para ícones e nomes
const DISCIPLINE_INFO = {
  'ARQUITETURA': { name: 'Projeto Arquitetônico', icon: '🏗️', category: 'ESSENCIAL' },
  'ESTRUTURAL': { name: 'Projeto Estrutural', icon: '🏢', category: 'ESSENCIAL' },
  'INSTALACOES_ELETRICAS': { name: 'Instalações Elétricas', icon: '⚡', category: 'COMPLEMENTAR' },
  'INSTALACOES_HIDRAULICAS': { name: 'Instalações Hidráulicas', icon: '🚿', category: 'COMPLEMENTAR' },
  'CLIMATIZACAO': { name: 'Climatização (AVAC)', icon: '❄️', category: 'COMPLEMENTAR' },
  'PAISAGISMO': { name: 'Projeto Paisagístico', icon: '🌿', category: 'COMPLEMENTAR' },
  'INTERIORES': { name: 'Design de Interiores', icon: '🛋️', category: 'COMPLEMENTAR' },
  'APROVACAO_LEGAL': { name: 'Aprovação Legal', icon: '📋', category: 'COMPLEMENTAR' },
  'MODELAGEM_3D': { name: 'Modelagem 3D', icon: '🎨', category: 'COMPLEMENTAR' }
};

export function ProjectValueCards({ 
  calculatedValues, 
  activeDisciplines, 
  configurations, 
  classes 
}: ProjectValueCardsProps) {
  
  if (!calculatedValues || !configurations) {
    return (
      <div className="mb-8">
        <div className={`rounded-xl p-8 border ${classes.card}`}>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 🎨 FUNÇÃO PARA ESTILO DA CATEGORIA
   */
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'ESSENCIAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLEMENTAR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ESPECIALIZADA':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * 💡 TOOLTIP PARA EXPLICAÇÃO DOS VALORES
   */
  const getValueTooltip = (disciplineCode: string) => {
    const config = configurations.disciplinas[disciplineCode];
    if (!config) return '';

    return `Valor inclui:
• Valor base: R$ ${config.valor_base.toLocaleString('pt-BR')}
• Valor por m²: R$ ${config.valor_por_m2.toLocaleString('pt-BR')}/m²
• Multiplicadores regionais e de complexidade
• Custos indiretos (margem, impostos, overhead)
• Reserva de contingência`;
  };

  return (
    <div className="mb-8">
      {/* Card de Valor Total */}
      <div className={`rounded-xl p-8 border ${classes.card} mb-6`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${classes.text}`}>
            Valor Total do Projeto
          </h2>
          <div className={`text-5xl font-bold mb-2 ${classes.textPrimary}`}>
            R$ {Math.round(calculatedValues.totalValue).toLocaleString('pt-BR')}
          </div>
          <p className={`text-lg ${classes.textSecondary}`}>
            Valor final incluindo todos os custos e margens
          </p>
          
          {/* Breakdown dos Custos */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className={`p-3 rounded-lg ${classes.cardSecondary}`}>
              <div className={`font-medium ${classes.textSecondary}`}>Subtotal</div>
              <div className={`text-lg font-bold ${classes.text}`}>
                R$ {Math.round(calculatedValues.breakdown.subtotal).toLocaleString('pt-BR')}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${classes.cardSecondary}`}>
              <div className={`font-medium ${classes.textSecondary}`}>Custos Indiretos</div>
              <div className={`text-lg font-bold ${classes.text}`}>
                R$ {Math.round(calculatedValues.breakdown.indirectCosts).toLocaleString('pt-BR')}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${classes.cardSecondary}`}>
              <div className={`font-medium ${classes.textSecondary}`}>Total Final</div>
              <div className={`text-lg font-bold ${classes.textPrimary}`}>
                R$ {Math.round(calculatedValues.totalValue).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Individuais por Disciplina */}
      <div className={`rounded-xl p-8 border ${classes.card}`}>
        <h3 className={`text-xl font-bold mb-6 ${classes.text}`}>
          Composição por Disciplina
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDisciplines.map(disciplineCode => {
            const disciplineInfo = DISCIPLINE_INFO[disciplineCode as keyof typeof DISCIPLINE_INFO] || {
              name: disciplineCode.replace(/_/g, ' '),
              icon: '📋',
              category: 'COMPLEMENTAR'
            };
            
            const value = calculatedValues.disciplineValues[disciplineCode] || 0;
            const config = configurations.disciplinas[disciplineCode];
            
            // ⚠️ REGRA DE NEGÓCIO: Nunca mostrar R$ 0,00 sem justificativa
            if (value === 0 && config?.ativo) {
              console.warn(`⚠️ Disciplina ${disciplineCode} está ativa mas tem valor R$ 0,00`);
            }
            
            const percentage = calculatedValues.totalValue > 0 
              ? (value / calculatedValues.totalValue) * 100 
              : 0;

            return (
              <div
                key={disciplineCode}
                className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg ${classes.cardSecondary}`}
                title={getValueTooltip(disciplineCode)}
              >
                {/* Header da Disciplina */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{disciplineInfo.icon}</span>
                    <div>
                      <h4 className={`font-semibold ${classes.text}`}>
                        {disciplineInfo.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryStyle(disciplineInfo.category)}`}>
                        {disciplineInfo.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Valor da Disciplina */}
                <div className="mb-4">
                  <div className={`text-2xl font-bold ${classes.textPrimary}`}>
                    {value > 0 ? (
                      `R$ ${Math.round(value).toLocaleString('pt-BR')}`
                    ) : (
                      <span className="text-gray-400" title="Disciplina não configurada ou desativada">
                        Não incluído
                      </span>
                    )}
                  </div>
                  {value > 0 && (
                    <div className={`text-sm ${classes.textSecondary}`}>
                      {percentage.toFixed(1)}% do total
                    </div>
                  )}
                </div>

                {/* Configurações da Disciplina */}
                {config && value > 0 && (
                  <div className={`text-xs ${classes.textSecondary} space-y-1`}>
                    {config.valor_por_m2 > 0 && (
                      <div>R$ {config.valor_por_m2.toLocaleString('pt-BR')}/m²</div>
                    )}
                    {config.valor_base > 0 && (
                      <div>Base: R$ {config.valor_base.toLocaleString('pt-BR')}</div>
                    )}
                    <div>{config.horas_estimadas}h estimadas</div>
                  </div>
                )}

                {/* Barra de Progresso Visual */}
                {value > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${classes.progressBar}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aviso se não há disciplinas ativas */}
        {activeDisciplines.length === 0 && (
          <div className={`text-center py-12 ${classes.textSecondary}`}>
            <div className="text-6xl mb-4">⚠️</div>
            <h4 className={`text-lg font-semibold mb-2 ${classes.text}`}>
              Nenhuma disciplina ativa
            </h4>
            <p className="mb-4">
              Configure as disciplinas em Configurações → Disciplinas e Serviços
            </p>
            <a
              href="/orcamentos/configuracoes"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${classes.buttonPrimary}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurar Disciplinas
            </a>
          </div>
        )}
      </div>
    </div>
  );
}