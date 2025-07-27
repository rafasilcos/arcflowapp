import type { BriefingCompleto, OrcamentoDetalhado } from "./types";

export interface PropostaComercialData {
  titulo: string;
  cliente: string;
  resumoProjeto: string;
  valorTotal: number;
  detalhesOrcamento: OrcamentoDetalhado;
  cronograma: string;
  diferenciais: string[];
  condicoesComerciais: string;
  validade: string;
}

export function gerarProposta(
  briefing: BriefingCompleto,
  orcamento: OrcamentoDetalhado
): PropostaComercialData {
  return {
    titulo: `Proposta Comercial - Projeto ${briefing.tipologia}`,
    cliente: briefing.nomeCliente || 'Cliente',
    resumoProjeto: `Projeto ${briefing.tipologia} de ${briefing.areaTotal}m², complexidade ${briefing.complexidade}, disciplinas: ${briefing.disciplinasSelecionadas?.join(', ')}`,
    valorTotal: orcamento.valorTotal,
    detalhesOrcamento: orcamento,
    cronograma: gerarCronogramaSimples(briefing),
    diferenciais: [
      'Briefing ultra-detalhado e personalizado',
      'Análise de viabilidade por IA',
      'Equipe especializada AEC',
      'Acompanhamento digital e transparente',
    ],
    condicoesComerciais: 'Pagamento em até 6x. Aceite digital válido como assinatura. Valores sujeitos a reajuste após 30 dias.',
    validade: '30 dias',
  };
}

function gerarCronogramaSimples(briefing: BriefingCompleto): string {
  // Exemplo simplificado
  switch (briefing.complexidade) {
    case 'Muito Alta': return '24-36 meses';
    case 'Alta': return '18-24 meses';
    case 'Média': return '12-18 meses';
    default: return '8-12 meses';
  }
} 