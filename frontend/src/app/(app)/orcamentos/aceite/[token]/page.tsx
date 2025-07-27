"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Mock de busca de proposta pelo token
async function buscarPropostaPorToken(token: string) {
  // No futuro: buscar do banco de dados
  return {
    titulo: "Proposta Comercial - Projeto Residencial",
    cliente: "Cliente Exemplo",
    resumoProjeto: "Projeto Residencial de 120m², complexidade Média, disciplinas: Arquitetura, Interiores",
    valorTotal: 120000,
    cronograma: "12-18 meses",
    validade: "30 dias",
  };
}

// Integração real de registro de aceite
async function registrarAceite(token: string, nome: string, email: string) {
  const res = await fetch("/orcamentos/api/registrar-aceite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, nome, email }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erro ao registrar aceite");
  }
  return true;
}

export default function AceitePage() {
  const params = useParams();
  const token = params.token as string;
  const [proposta, setProposta] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [aceitando, setAceitando] = useState(false);
  const [aceiteOk, setAceiteOk] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    buscarPropostaPorToken(token).then(setProposta);
  }, [token]);

  const handleAceitar = async () => {
    setAceitando(true);
    setErro(null);
    try {
      await registrarAceite(token, nome, email);
      setAceiteOk(true);
      setTimeout(() => router.push("/"), 5000);
    } catch (e: any) {
      setErro(e.message || "Erro ao registrar aceite. Tente novamente.");
    } finally {
      setAceitando(false);
    }
  };

  if (!proposta) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700 dark:text-gray-200">Carregando proposta...</div>;
  }

  if (aceiteOk) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 max-w-lg">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">Proposta aceita com sucesso!</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">Obrigado, {nome}! Seu aceite foi registrado.</p>
          <p className="text-gray-500 dark:text-gray-400">Nossa equipe entrará em contato para os próximos passos.</p>
          <p className="text-xs text-gray-400 mt-4">Você será redirecionado para a página inicial em instantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400 mb-2">{proposta.titulo}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Cliente: <span className="font-semibold">{proposta.cliente}</span></p>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Resumo do Projeto</h3>
          <p className="text-gray-700 dark:text-gray-300">{proposta.resumoProjeto}</p>
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-8">
          <div className="flex-1 mb-2 md:mb-0">
            <span className="block text-gray-600 dark:text-gray-400">Valor Total</span>
            <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">R$ {proposta.valorTotal.toLocaleString()}</span>
          </div>
          <div className="flex-1">
            <span className="block text-gray-600 dark:text-gray-400">Cronograma</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{proposta.cronograma}</span>
          </div>
        </div>
        <div className="mb-4">
          <span className="block text-gray-500 dark:text-gray-400">Validade: {proposta.validade}</span>
        </div>
        <label className="block text-gray-700 dark:text-gray-300 mb-1">Seu nome completo</label>
        <input type="text" className="w-full rounded border px-3 py-2 mb-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={nome} onChange={e => setNome(e.target.value)} required />
        <label className="block text-gray-700 dark:text-gray-300 mb-1">Seu e-mail</label>
        <input type="email" className="w-full rounded border px-3 py-2 mb-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={email} onChange={e => setEmail(e.target.value)} required />
        <button onClick={handleAceitar} disabled={aceitando || !nome || !email} className="w-full py-3 rounded bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition disabled:opacity-50 mb-2">
          {aceitando ? "Registrando aceite..." : "Aceitar Proposta"}
        </button>
        {erro && <div className="mt-2 text-center text-medium text-red-600">{erro}</div>}
      </div>
    </div>
  );
} 