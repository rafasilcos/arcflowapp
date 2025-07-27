import React from "react";
import type { EtapaRecebimento } from "../services/cronogramaRecebimento";

interface Props {
  etapas: EtapaRecebimento[];
}

export const CronogramaRecebimento: React.FC<Props> = ({ etapas }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Cronograma de Recebimento</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Etapa</th>
              <th className="px-4 py-2 text-right">% do Total</th>
              <th className="px-4 py-2 text-right">Valor (R$)</th>
              <th className="px-4 py-2 text-left">Disciplinas</th>
            </tr>
          </thead>
          <tbody>
            {etapas.map((etapa, i) => (
              <tr key={i} className={i === etapas.length - 1 ? "font-bold bg-primary-100 dark:bg-primary-900" : ""}>
                <td className="px-4 py-2">{etapa.nome}</td>
                <td className="px-4 py-2 text-right">{etapa.percentual}%</td>
                <td className="px-4 py-2 text-right">{etapa.valor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-2">{etapa.disciplinas.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 