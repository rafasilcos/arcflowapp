import React from "react";
import type { OrcamentoDetalhado } from "../services/types";
import { BreakdownMultidisciplinar } from "./BreakdownMultidisciplinar";
import { LucideAlertTriangle, LucideLightbulb } from "lucide-react";

interface Props {
  orcamento: OrcamentoDetalhado;
}

export const OrcamentoDetalhadoComponent: React.FC<Props> = ({ orcamento }) => {
  const disciplinasSelecionadas = orcamento.briefingUtilizado.disciplinasSelecionadas || [];
  const temMultidisciplinar = ["Interiores", "Decoração", "Paisagismo"].some(d => disciplinasSelecionadas.includes(d));
  const { sugestoes, alertas } = orcamento.breakdown;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Orçamento Detalhado</h2>
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Área Total:</span>
          <span className="text-gray-900 dark:text-gray-100">{orcamento.breakdown.area} m²</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Valor Base (CUB):</span>
          <span className="text-gray-900 dark:text-gray-100">R$ {orcamento.breakdown.valorBase.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Fator Tipologia:</span>
          <span>{orcamento.breakdown.fatorTipologia}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Fator Complexidade:</span>
          <span>{orcamento.breakdown.fatorComplexidade}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Disciplinas Adicionais:</span>
          <span>R$ {orcamento.breakdown.valorDisciplinas.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Urgência:</span>
          <span>{orcamento.breakdown.fatoresExtras.urgencia}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Margem:</span>
          <span>{orcamento.breakdown.fatoresExtras.margem}%</span>
        </div>
      </div>
      <div className="flex flex-col items-center mt-6">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Valor Total do Projeto</span>
        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">R$ {orcamento.valorTotal.toLocaleString()}</span>
      </div>
      {temMultidisciplinar && (
        <BreakdownMultidisciplinar breakdown={orcamento.breakdown.multidisciplinar} />
      )}
      {(alertas.length > 0 || sugestoes.length > 0) && (
        <div className="mt-8">
          {alertas.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1 text-red-700 dark:text-red-400 font-bold">
                <LucideAlertTriangle size={20} /> Alertas Críticos
              </div>
              <ul className="list-disc pl-6 text-red-700 dark:text-red-400">
                {alertas.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          {sugestoes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1 text-yellow-700 dark:text-yellow-400 font-bold">
                <LucideLightbulb size={20} /> Sugestões Inteligentes
              </div>
              <ul className="list-disc pl-6 text-yellow-700 dark:text-yellow-400">
                {sugestoes.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 