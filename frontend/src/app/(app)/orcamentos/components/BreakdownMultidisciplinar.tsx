import React from "react";
import type { OrcamentoMultidisciplinar } from "../services/calcularOrcamento";

interface Props {
  breakdown: OrcamentoMultidisciplinar;
  destaqueColor?: string;
  borderColor?: string;
  fontFamily?: string;
}

export const BreakdownMultidisciplinar: React.FC<Props> = ({ breakdown, destaqueColor = "bg-primary-100 dark:bg-primary-900", borderColor = "border-primary-300", fontFamily = "font-sans" }) => {
  const total = breakdown.total;
  const percent = (valor: number) => ((valor / total) * 100).toFixed(1) + "%";

  return (
    <div className={`w-full max-w-2xl mx-auto mt-8 ${fontFamily}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Orçamento Multidisciplinar</h3>
      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-xl bg-white dark:bg-gray-900 ${borderColor}`}>
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Disciplina</th>
              <th className="px-4 py-2 text-right">Valor (R$)</th>
              <th className="px-4 py-2 text-right">% do Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-medium">Arquitetura</td>
              <td className="px-4 py-2 text-right">{breakdown.arquitetura.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{percent(breakdown.arquitetura)}</td>
            </tr>
            {breakdown.interiores > 0 && (
              <tr>
                <td className="px-4 py-2 font-medium">Interiores</td>
                <td className="px-4 py-2 text-right">{breakdown.interiores.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{percent(breakdown.interiores)}</td>
              </tr>
            )}
            {breakdown.decoracao > 0 && (
              <tr>
                <td className="px-4 py-2 font-medium">Decoração</td>
                <td className="px-4 py-2 text-right">{breakdown.decoracao.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{percent(breakdown.decoracao)}</td>
              </tr>
            )}
            {breakdown.paisagismo > 0 && (
              <tr>
                <td className="px-4 py-2 font-medium">Paisagismo</td>
                <td className="px-4 py-2 text-right">{breakdown.paisagismo.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{percent(breakdown.paisagismo)}</td>
              </tr>
            )}
            <tr>
              <td className="px-4 py-2 font-medium">Coordenação Geral</td>
              <td className="px-4 py-2 text-right">{breakdown.coordenacao.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{percent(breakdown.coordenacao)}</td>
            </tr>
            <tr className={destaqueColor + " font-bold"}>
              <td className="px-4 py-2">Total</td>
              <td className="px-4 py-2 text-right">{breakdown.total.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}; 