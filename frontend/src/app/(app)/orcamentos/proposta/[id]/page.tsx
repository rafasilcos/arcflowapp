"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropostaComercial } from "../../components/PropostaComercial";
import { LucideLoader2, LucideAlertTriangle } from "lucide-react";

// Mock de busca de proposta por ID
async function buscarPropostaPorId(id: string) {
  // No futuro: buscar do banco de dados
  return {
    id,
    titulo: "Proposta Comercial - Projeto Residencial",
    cliente: "Cliente Exemplo",
    resumoProjeto: "Projeto Residencial de 120m², complexidade Média, disciplinas: Arquitetura, Interiores",
    valorTotal: 120000,
    cronograma: "12-18 meses",
    status: "Pendente de Aceite",
    detalhesOrcamento: {
      breakdown: {
        area: 120,
        valorBase: 80000,
        fatorTipologia: 1.1,
        fatorComplexidade: 1.2,
        valorDisciplinas: 40000,
        fatoresExtras: { urgencia: "Normal", margem: 10 },
        multidisciplinar: {
          arquitetura: 80000,
          interiores: 20000,
          decoracao: 10000,
          paisagismo: 10000,
          coordenacao: 10000,
          total: 120000,
        },
        sugestoes: ["Considere incluir paisagismo para maior valorização."],
        alertas: ["Área acima da média para tipologia residencial."]
      },
      valorTotal: 120000,
      briefingUtilizado: {
        areaTotal: 120,
        tipologia: "Residencial",
        complexidade: "Média",
        disciplinasSelecionadas: ["Arquitetura", "Interiores"],
        urgencia: "Normal",
        margem: 10,
        perfilCliente: "Primeira vez",
        localizacao: "SP",
        nomeCliente: "Cliente Exemplo"
      }
    },
    diferenciais: [
      "Briefing ultra-detalhado e personalizado",
      "Análise de viabilidade por IA",
      "Equipe especializada AEC",
      "Acompanhamento digital e transparente"
    ],
    condicoesComerciais: "Pagamento em até 6x. Aceite digital válido como assinatura. Valores sujeitos a reajuste após 30 dias.",
    validade: "30 dias"
  };
}

export default function PropostaDetalhadaPage() {
  const params = useParams();
  const id = params?.id as string;
  const [proposta, setProposta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    buscarPropostaPorId(id)
      .then(setProposta)
      .catch(() => setErro("Proposta não encontrada."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700 dark:text-gray-200">
        <LucideLoader2 className="animate-spin mr-2" /> Carregando proposta...
      </div>
    );
  }

  if (erro || !proposta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-700 dark:text-red-400">
        <LucideAlertTriangle size={40} className="mb-4" />
        <span className="text-xl font-bold mb-2">Erro ao carregar proposta</span>
        <span>{erro || "Proposta não encontrada."}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="w-full max-w-4xl mx-auto">
        <PropostaComercial proposta={proposta} />
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Status: {proposta.status}
            </span>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-lg bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition">Reenviar Proposta</button>
            <button className="px-6 py-3 rounded-lg bg-primary-100 text-primary-700 font-bold text-lg hover:bg-primary-200 transition border border-primary-300">Exportar PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
} 