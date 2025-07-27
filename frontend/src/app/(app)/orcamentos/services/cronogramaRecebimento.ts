import type { OrcamentoMultidisciplinar } from "./calcularOrcamento";

export interface EtapaRecebimento {
  nome: string;
  percentual: number;
  valor: number;
  disciplinas: string[];
}

// Blueprint: briefing_aprovado: 10% total, ep_aprovado: 15% arquitetura+paisagismo, ap_aprovado: 25% arquitetura, estudos_complementares: 40% interiores+decoração, pe_aprovados: 50% restante todas disciplinas, entrega_final: 10% total
export function gerarCronogramaRecebimento(breakdown: OrcamentoMultidisciplinar): EtapaRecebimento[] {
  const total = breakdown.total;
  const etapas: EtapaRecebimento[] = [
    {
      nome: "Briefing Aprovado",
      percentual: 10,
      valor: total * 0.10,
      disciplinas: ["Todas"],
    },
    {
      nome: "Estudo Preliminar (EP) Aprovado",
      percentual: 15,
      valor: (breakdown.arquitetura + breakdown.paisagismo) * 0.15,
      disciplinas: ["Arquitetura", ...(breakdown.paisagismo > 0 ? ["Paisagismo"] : [])],
    },
    {
      nome: "Anteprojeto (AP) Aprovado",
      percentual: 25,
      valor: breakdown.arquitetura * 0.25,
      disciplinas: ["Arquitetura"],
    },
    {
      nome: "Estudos Complementares",
      percentual: 40,
      valor: (breakdown.interiores + breakdown.decoracao) * 0.40,
      disciplinas: [
        ...(breakdown.interiores > 0 ? ["Interiores"] : []),
        ...(breakdown.decoracao > 0 ? ["Decoração"] : []),
      ],
    },
    {
      nome: "Projetos Executivos (PE) Aprovados",
      percentual: 50,
      valor: (breakdown.arquitetura + breakdown.interiores + breakdown.paisagismo) * 0.50,
      disciplinas: [
        "Arquitetura",
        ...(breakdown.interiores > 0 ? ["Interiores"] : []),
        ...(breakdown.paisagismo > 0 ? ["Paisagismo"] : []),
      ],
    },
    {
      nome: "Entrega Final",
      percentual: 10,
      valor: total * 0.10,
      disciplinas: ["Todas"],
    },
  ];
  // Filtrar etapas sem disciplinas ou valor zero
  return etapas.filter(e => e.valor > 0 && e.disciplinas.length > 0);
} 