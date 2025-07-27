"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ArrowRight, User, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Funções de busca real (ajustar endpoints conforme backend)
async function fetchClientes(query: string) {
  const res = await fetch(`/api/clientes?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Erro ao buscar clientes");
  const result = await res.json();
  return result.clientes || [];
}
async function fetchUsuarios() {
  const res = await fetch(`/api/users`);
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  const result = await res.json();
  return result.users || [];
}

export default function BriefingManualPage() {
  // Stepper
  const [step, setStep] = useState(0);
  // Cliente
  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const { data: clientes, isLoading: loadingClientes } = useQuery({
    queryKey: ["clientes", clienteQuery],
    queryFn: () => fetchClientes(clienteQuery),
    enabled: step === 0 && clienteQuery.length > 1,
  });
  // Responsável
  const [responsavelId, setResponsavelId] = useState<string | null>(null);
  const { data: usuarios, isLoading: loadingUsuarios } = useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    enabled: step === 0,
  });

  // Leitura do clienteId da URL
  const searchParams = useSearchParams();
  useEffect(() => {
    const urlClienteId = searchParams.get("clienteId");
    if (urlClienteId) {
      setClienteId(urlClienteId);
    }
  }, [searchParams]);

  // Avançar etapa
  function nextStep() {
    if (!clienteId || !responsavelId) {
      toast.error("Selecione cliente e responsável");
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Stepper */}
      <div className="flex items-center mb-8">
        <div className={cn("flex-1 h-2 rounded-full", step >= 0 ? "bg-blue-600" : "bg-gray-200")} />
        <div className={cn("flex-1 h-2 rounded-full mx-2", step >= 1 ? "bg-blue-600" : "bg-gray-200")} />
        <div className={cn("flex-1 h-2 rounded-full", step >= 2 ? "bg-blue-600" : "bg-gray-200")} />
      </div>

      {/* Etapa 1: Cliente e responsável */}
      {step === 0 && (
        <div>
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Seleção de Cliente
          </h1>
          <Input
            placeholder="Buscar cliente..."
            value={clienteQuery}
            onChange={(e) => setClienteQuery(e.target.value)}
            className="mb-2"
          />
          {loadingClientes && <Skeleton className="h-10 w-full mb-2" />}
          {clientes && (
            <div className="mb-4 space-y-1">
              {clientes.map((c: any) => (
                <button
                  key={c.id}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded hover:bg-blue-50 border",
                    clienteId === c.id ? "bg-blue-100 border-blue-400" : "bg-white border-gray-200"
                  )}
                  onClick={() => setClienteId(c.id)}
                >
                  <span className="font-medium">{c.nome}</span>
                  <span className="ml-2 text-xs text-gray-500">{c.email}</span>
                </button>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Responsável pelo Briefing
          </h2>
          {loadingUsuarios && <Skeleton className="h-10 w-full mb-2" />}
          {usuarios && (
            <Select value={responsavelId || ""} onChange={e => setResponsavelId(e.target.value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} <span className="ml-2 text-xs text-gray-500">{u.email}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button className="mt-8 w-full" onClick={nextStep}>
            Próxima etapa <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Outras etapas virão aqui... */}
      {step > 0 && (
        <div className="text-center py-20 text-gray-500">
          <p>Próximas etapas do briefing em desenvolvimento...</p>
        </div>
      )}
    </div>
  );
} 