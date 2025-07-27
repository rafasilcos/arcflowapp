import type { BriefingCompleto, OrcamentoDetalhado } from "./types";
import { calcularOrcamento } from "./calcularOrcamento";

// 🎯 FUNÇÃO ORQUESTRADORA: TRANSFORMA BRIEFING EM ORÇAMENTO DETALHADO
export async function transformarBriefingEmOrcamento(briefing: BriefingCompleto): Promise<OrcamentoDetalhado> {
  console.log('🎯 Transformando briefing em orçamento:', briefing);
  
  // Simulação de consulta ao CUB (poderia ser API ou banco de dados)
  const cub = await consultarCUB(briefing.localizacao || "SP");
  // Simulação de consulta ao histórico do escritório
  const historico = await consultarHistoricoProjetos(briefing.perfilCliente);

  // 📊 PREPARAR BRIEFING COM DADOS EXTRAÍDOS
  const briefingCompleto = {
    ...briefing,
    // Garantir que os dados extraídos estejam disponíveis
    dadosExtraidos: (briefing as any).dadosExtraidos || briefing
  };

  console.log('📊 Briefing preparado para cálculo:', briefingCompleto);

  // Chama o serviço de cálculo com dados reais
  const orcamento = calcularOrcamento(briefingCompleto, cub, historico);
  
  console.log('💰 Orçamento calculado:', orcamento);
  
  return orcamento;
}

// Função mock para consulta ao CUB
async function consultarCUB(uf: string): Promise<number> {
  // Exemplo: valores fictícios por estado
  const cubs: Record<string, number> = {
    SP: 2500,
    RJ: 2600,
    MG: 2400,
    RS: 2300,
    BA: 2200,
  };
  return cubs[uf] || 2500;
}

// Função mock para consulta ao histórico
async function consultarHistoricoProjetos(perfilCliente: string): Promise<any[]> {
  // Retorna array vazio por enquanto
  return [];
} 