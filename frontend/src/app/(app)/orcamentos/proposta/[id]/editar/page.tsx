"use client";
import React, { useEffect, useState } from "react";
import { LucideSave, LucideSend, LucideEdit } from "lucide-react";
import { PropostaComercial } from "../../../components/PropostaComercial";

// Mock de proposta para edição
const mockProposta = {
  id: "1",
  nomeCliente: "João Silva",
  email: "joao@email.com",
  areaTotal: 120,
  tipologia: "Residencial",
  complexidade: "Média",
  disciplinasSelecionadas: ["Arquitetura", "Interiores"],
  margem: 10,
  condicoesComerciais: "Pagamento em até 6x. Aceite digital válido como assinatura.",
};

const TIPOS = ["Residencial", "Comercial", "Industrial", "Institucional", "Urbanístico"];
const COMPLEXIDADES = ["Baixa", "Média", "Alta", "Muito Alta"];
const DISCIPLINAS = ["Arquitetura", "Interiores", "Paisagismo", "Estrutural", "Instalações"];

export default function EditarPropostaPage() {
  const [form, setForm] = useState<any>(mockProposta);
  const [salvando, setSalvando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: name === "areaTotal" || name === "margem" ? Number(value) : value }));
  };

  const handleDisciplinaChange = (disciplina: string) => {
    setForm((prev: any) => {
      const atuais = prev.disciplinasSelecionadas || [];
      return {
        ...prev,
        disciplinasSelecionadas: atuais.includes(disciplina)
          ? atuais.filter((d: string) => d !== disciplina)
          : [...atuais, disciplina],
      };
    });
  };

  const handleSalvar = async () => {
    setSalvando(true);
    setFeedback(null);
    setTimeout(() => {
      setSalvando(false);
      setFeedback("Proposta salva com sucesso!");
      setTimeout(() => setFeedback(null), 3000);
    }, 1200);
  };

  const handleReenviar = async () => {
    setReenviando(true);
    setFeedback(null);
    setTimeout(() => {
      setReenviando(false);
      setFeedback("Proposta reenviada com sucesso!");
      setTimeout(() => setFeedback(null), 3000);
    }, 1200);
  };

  // Mock para preview da proposta comercial
  const previewProposta = {
    titulo: `Proposta Comercial - Projeto ${form.tipologia}`,
    cliente: form.nomeCliente,
    resumoProjeto: `Projeto ${form.tipologia} de ${form.areaTotal}m², complexidade ${form.complexidade}, disciplinas: ${form.disciplinasSelecionadas?.join(", ")}`,
    valorTotal: 120000, // mock
    detalhesOrcamento: {
      valorTotal: 120000,
      breakdown: {
        area: form.areaTotal,
        valorBase: 100000,
        fatorTipologia: 1.2,
        fatorComplexidade: 1.1,
        valorDisciplinas: 5000,
        fatoresExtras: {
          urgencia: "Normal",
          margem: form.margem,
        },
        multidisciplinar: {
          arquitetura: 60000,
          interiores: 20000,
          decoracao: 10000,
          paisagismo: 5000,
          coordenacao: 5000,
          total: 100000,
        },
        sugestoes: ["Considere incluir paisagismo para maior valorização."],
        alertas: [],
      },
      briefingUtilizado: {
        areaTotal: form.areaTotal,
        tipologia: form.tipologia,
        complexidade: form.complexidade,
        disciplinasSelecionadas: form.disciplinasSelecionadas,
        urgencia: "Normal",
        margem: form.margem,
        perfilCliente: "Primeira vez",
      },
    },
    cronograma: "12-18 meses",
    diferenciais: [
      "Briefing ultra-detalhado e personalizado",
      "Análise de viabilidade por IA",
      "Equipe especializada AEC",
      "Acompanhamento digital e transparente",
    ],
    condicoesComerciais: form.condicoesComerciais,
    validade: "30 dias",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8 text-primary-700 dark:text-primary-400 flex items-center gap-2">
        <LucideEdit size={28} /> Editar/Renegociar Proposta
      </h1>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        <form className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Nome do Cliente</label>
            <input type="text" name="nomeCliente" value={form.nomeCliente} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Área Total (m²)</label>
              <input type="number" name="areaTotal" min={10} max={10000} value={form.areaTotal} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" required />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Margem (%)</label>
              <input type="number" name="margem" min={0} max={100} value={form.margem} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" required />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Tipologia</label>
            <select name="tipologia" value={form.tipologia} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Complexidade</label>
            <select name="complexidade" value={form.complexidade} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {COMPLEXIDADES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Disciplinas</label>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINAS.map((d) => (
                <label key={d} className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={form.disciplinasSelecionadas.includes(d)} onChange={() => handleDisciplinaChange(d)} /> {d}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Condições Comerciais</label>
            <textarea name="condicoesComerciais" value={form.condicoesComerciais} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" rows={3} />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={handleSalvar} disabled={salvando} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition disabled:opacity-50">
              <LucideSave size={20} /> {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={handleReenviar} disabled={reenviando} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-100 text-primary-700 font-bold text-lg hover:bg-primary-200 transition border border-primary-300 disabled:opacity-50">
              <LucideSend size={20} /> {reenviando ? "Reenviando..." : "Reenviar Proposta"}
            </button>
          </div>
          {feedback && <div className="mt-4 text-center text-green-600 font-medium">{feedback}</div>}
        </form>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">Preview da Proposta</h2>
          <PropostaComercial proposta={previewProposta} />
        </div>
      </div>
    </div>
  );
} 