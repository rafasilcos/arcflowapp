/**
 * 🎬 COMPONENTE DE AÇÕES DO ORÇAMENTO
 * 
 * Botões de ação para:
 * - Editar orçamento
 * - Duplicar orçamento
 * - Compartilhar orçamento
 * - Gerar PDF
 */

import React, { useState } from 'react';
import { BudgetData } from '../types/budget';

interface BudgetActionsProps {
  budgetId: string;
  budgetData: BudgetData;
  classes: any;
}

export function BudgetActions({ budgetId, budgetData, classes }: BudgetActionsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  /**
   * 📝 EDITAR ORÇAMENTO
   */
  const handleEdit = () => {
    window.location.href = `/orcamentos/${budgetId}/editar`;
  };

  /**
   * 📋 DUPLICAR ORÇAMENTO
   */
  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/orcamentos/${budgetId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('arcflow_auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          window.location.href = `/orcamentos/${result.data.id}`;
        }
      }
    } catch (error) {
      console.error('Erro ao duplicar orçamento:', error);
      alert('Erro ao duplicar orçamento. Tente novamente.');
    }
  };

  /**
   * 🔗 COMPARTILHAR ORÇAMENTO
   */
  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // Gerar link de compartilhamento
      const shareUrl = `${window.location.origin}/orcamentos/${budgetId}/share`;
      
      if (navigator.share) {
        // API nativa de compartilhamento (mobile)
        await navigator.share({
          title: `Orçamento ${budgetData.codigo}`,
          text: `Orçamento para ${budgetData.cliente_nome} - ${budgetData.nome}`,
          url: shareUrl
        });
      } else {
        // Fallback: copiar para clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao compartilhar orçamento.');
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * 📄 GERAR PDF
   */
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const response = await fetch(`/api/orcamentos/${budgetId}/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('arcflow_auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamento-${budgetData.codigo}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Erro ao gerar PDF');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Editar */}
        <button
          onClick={handleEdit}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${classes.buttonPrimary} hover:scale-105`}
          title="Editar este orçamento"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="font-medium">Editar</span>
        </button>

        {/* Duplicar */}
        <button
          onClick={handleDuplicate}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${classes.buttonSecondary} hover:scale-105`}
          title="Criar uma cópia deste orçamento"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Duplicar</span>
        </button>

        {/* Compartilhar */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${classes.buttonSecondary} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Compartilhar este orçamento"
        >
          {isSharing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          )}
          <span className="font-medium">
            {isSharing ? 'Compartilhando...' : 'Compartilhar'}
          </span>
        </button>

        {/* Gerar PDF */}
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${classes.buttonSecondary} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Gerar PDF deste orçamento"
        >
          {isGeneratingPDF ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="font-medium">
            {isGeneratingPDF ? 'Gerando PDF...' : 'Gerar PDF'}
          </span>
        </button>

        {/* Link para Configurações */}
        <div className="ml-auto">
          <a
            href="/orcamentos/configuracoes"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${classes.buttonTertiary} hover:scale-105`}
            title="Ir para configurações de orçamento"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Configurações</span>
          </a>
        </div>
      </div>
    </div>
  );
}