"use client";

import React, { useEffect, useState } from "react";

interface Aceite {
  token: string;
  nome: string;
  email: string;
  dataHora: string;
  ip: string;
}

export default function HistoricoOrcamentosPage() {
  const [aceites, setAceites] = useState<Aceite[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function fetchAceites() {
      try {
        const res = await fetch("/orcamentos/api/historico-aceites");
        if (res.ok) {
          const data = await res.json();
          setAceites(data.aceites || []);
        }
      } catch {}
    }
    fetchAceites();
  }, []);

  const aceitesFiltrados = aceites.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.email.toLowerCase().includes(busca.toLowerCase()) ||
    a.token.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-400">Histórico de Propostas e Aceites</h1>
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou token..."
          className="w-full mb-4 px-4 py-2 rounded border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">E-mail</th>
                <th className="px-4 py-2 text-left">Data/Hora</th>
                <th className="px-4 py-2 text-left">Token</th>
                <th className="px-4 py-2 text-left">IP</th>
              </tr>
            </thead>
            <tbody>
              {aceitesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">Nenhum aceite encontrado.</td>
                </tr>
              )}
              {aceitesFiltrados.map((a, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">{a.nome}</td>
                  <td className="px-4 py-2">{a.email}</td>
                  <td className="px-4 py-2">{new Date(a.dataHora).toLocaleString()}</td>
                  <td className="px-4 py-2 font-mono text-xs">{a.token}</td>
                  <td className="px-4 py-2 text-xs">{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 