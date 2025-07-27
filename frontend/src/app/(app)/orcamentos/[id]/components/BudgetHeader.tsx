/**
 * 📋 COMPONENTE DE CABEÇALHO DO ORÇAMENTO
 * 
 * Exibe informações principais do orçamento:
 * - Nome do cliente e projeto
 * - Status do orçamento
 * - Data de criação
 * - ID/código do orçamento
 * - Botão de voltar
 */

import React from 'react';
import { BudgetData } from '../types/budget';

interface BudgetHeaderProps {
  budgetData: BudgetData;
  onBack: () => void;
  theme: any;
  classes: any;
}

export function BudgetHeader({ budgetData, onBack, theme, classes }: BudgetHeaderProps) {
  /**
   * 🎨 FUNÇÃO PARA ESTILO DO STATUS
   */
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJEITADO':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RASCUNHO':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * 🎨 FUNÇÃO PARA ÍCONE DO STATUS
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return '✅';
      case 'PENDENTE':
        return '⏳';
      case 'REJEITADO':
        return '❌';
      case 'RASCUNHO':
      default:
        return '📝';
    }
  };

  return (
    <div className="mb-8">
      {/* Botão de Voltar */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${classes.buttonSecondary} hover:scale-105`}
          title="Voltar à lista de orçamentos"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Voltar aos Orçamentos</span>
        </button>
      </div>

      {/* Informações Principais */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="flex-1">
          {/* Título e Status */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className={`text-4xl lg:text-5xl font-bold ${classes.text} mb-2`}>
                {budgetData.nome}
              </h1>
              <p className={`text-xl ${classes.textSecondary}`}>
                {budgetData.cliente_nome}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full border font-medium text-sm ${getStatusStyle(budgetData.status)}`}>
              <span className="mr-2">{getStatusIcon(budgetData.status)}</span>
              {budgetData.status}
            </div>
          </div>

          {/* Informações Secundárias */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <div className={`font-medium text-xs uppercase tracking-wide opacity-75 ${classes.textSecondary}`}>
                  Código
                </div>
                <div className={`font-semibold ${classes.text}`}>
                  {budgetData.codigo}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🏠</span>
              <div>
                <div className={`font-medium text-xs uppercase tracking-wide opacity-75 ${classes.textSecondary}`}>
                  Área
                </div>
                <div className={`font-semibold ${classes.text}`}>
                  {budgetData.area_construida.toLocaleString('pt-BR')}m²
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🏗️</span>
              <div>
                <div className={`font-medium text-xs uppercase tracking-wide opacity-75 ${classes.textSecondary}`}>
                  Tipologia
                </div>
                <div className={`font-semibold ${classes.text}`}>
                  {budgetData.tipologia}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div>
                <div className={`font-medium text-xs uppercase tracking-wide opacity-75 ${classes.textSecondary}`}>
                  Criado em
                </div>
                <div className={`font-semibold ${classes.text}`}>
                  {new Date(budgetData.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Executivo Rápido */}
        <div className={`rounded-2xl p-6 border ${classes.card} min-w-[280px]`}>
          <h3 className={`text-lg font-bold mb-4 ${classes.text}`}>
            Resumo Executivo
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${classes.textSecondary}`}>Valor Total</span>
              <span className={`font-bold text-lg ${classes.textPrimary}`}>
                R$ {budgetData.valor_total.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${classes.textSecondary}`}>Valor/m²</span>
              <span className={`font-semibold ${classes.text}`}>
                R$ {budgetData.valor_por_m2.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${classes.textSecondary}`}>Padrão</span>
              <span className={`font-semibold ${classes.text}`}>
                {budgetData.padrao}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${classes.textSecondary}`}>Complexidade</span>
              <span className={`font-semibold ${classes.text}`}>
                {budgetData.complexidade}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}