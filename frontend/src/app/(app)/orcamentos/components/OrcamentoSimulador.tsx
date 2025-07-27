import React, { useState } from "react";
import { transformarBriefingEmOrcamento } from "../services/transformarBriefingEmOrcamento";
import { OrcamentoDetalhadoComponent } from "./OrcamentoDetalhado";
import { PropostaComercial } from "./PropostaComercial";
import { gerarProposta } from "../services/gerarProposta";
import type { BriefingCompleto, OrcamentoDetalhado as OrcamentoDetalhadoType } from "../services/types";
import type { PropostaComercialData } from "../services/gerarProposta";
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import InputFormatado from '@/components/ui/InputFormatado';
import { motion } from 'framer-motion';
import { Calculator, Zap, FileText, TrendingUp } from 'lucide-react';

const TIPOS = ["Residencial", "Comercial", "Industrial", "Institucional", "Urbanístico"];
const COMPLEXIDADES = ["Baixa", "Média", "Alta", "Muito Alta"];
const DISCIPLINAS = ["Arquitetura", "Interiores", "Paisagismo", "Estrutural", "Instalações"];
const URGENCIAS = ["Normal", "Urgente", "Flexível"];
const PERFIS = ["Primeira vez", "Experiente", "Investidor", "Cliente Premium"];
const UF = ["SP", "RJ", "MG", "RS", "BA"];

export const OrcamentoSimulador: React.FC = () => {
  const { tema, temaId } = useTheme();
  const temaIdFormatado = temaId === 'elegante' ? 'elegante' : 'dark';
  
  const [form, setForm] = useState<Partial<BriefingCompleto>>({
    areaTotal: 100,
    tipologia: "Residencial",
    complexidade: "Média",
    disciplinasSelecionadas: ["Arquitetura"],
    urgencia: "Normal",
    margem: 10,
    perfilCliente: "Primeira vez",
    localizacao: "SP",
    nomeCliente: "Cliente Exemplo",
  });
  const [orcamento, setOrcamento] = useState<OrcamentoDetalhadoType | null>(null);
  const [proposta, setProposta] = useState<PropostaComercialData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "areaTotal" || name === "margem" ? Number(value) : value }));
  };

  const handleDisciplinaChange = (disciplina: string) => {
    setForm((prev) => {
      const atuais = prev.disciplinasSelecionadas || [];
      return {
        ...prev,
        disciplinasSelecionadas: atuais.includes(disciplina)
          ? atuais.filter((d) => d !== disciplina)
          : [...atuais, disciplina],
      };
    });
  };

  const handleSimular = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrcamento(null);
    setProposta(null);
    try {
      const resultado = await transformarBriefingEmOrcamento(form as BriefingCompleto);
      setOrcamento(resultado);
    } catch (err) {
      alert("Erro ao calcular orçamento. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGerarProposta = () => {
    if (orcamento) {
      const prop = gerarProposta(form as BriefingCompleto, orcamento);
      setProposta(prop);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${tema.card} rounded-2xl shadow-lg border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-8`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${
            temaId === 'elegante' 
              ? 'bg-yellow-100 text-yellow-600' 
              : 'bg-yellow-500/20 text-yellow-300'
          }`}>
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${tema.text}`}>
              Simulador de Orçamento
            </h2>
            <p className={`text-sm ${tema.textSecondary}`}>
              Preencha os dados do projeto para gerar um orçamento preciso
            </p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSimular}>
          {/* Dados do Cliente */}
          <section>
            <h3 className={`text-lg font-semibold ${tema.text} mb-4 flex items-center gap-2`}>
              👤 Dados do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputFormatado
                tipo="text"
                value={form.nomeCliente || ''}
                onChange={(valor) => setForm(prev => ({ ...prev, nomeCliente: valor }))}
                label="Nome do Cliente"
                obrigatoria
                temaId={temaIdFormatado}
                placeholder="Ex: João Silva"
              />
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${tema.text}`}>
                  Perfil do Cliente
                </label>
                <select 
                  name="perfilCliente" 
                  value={form.perfilCliente} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 rounded-xl border font-medium ${
                    temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-yellow-500'
                      : 'bg-white/10 border-white/10 text-white focus:border-white/30'
                  }`}
                >
                  {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Dados do Projeto */}
          <section>
            <h3 className={`text-lg font-semibold ${tema.text} mb-4 flex items-center gap-2`}>
              🏗️ Dados do Projeto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputFormatado
                tipo="text"
                value={String(form.areaTotal || '')}
                onChange={(valor) => setForm(prev => ({ ...prev, areaTotal: Number(valor.replace(/\D/g, '')) }))}
                label="Área Total (m²)"
                obrigatoria
                temaId={temaIdFormatado}
                placeholder="Ex: 150"
              />
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${tema.text}`}>
                  Tipologia
                </label>
                <select 
                  name="tipologia" 
                  value={form.tipologia} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 rounded-xl border font-medium ${
                    temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-yellow-500'
                      : 'bg-white/10 border-white/10 text-white focus:border-white/30'
                  }`}
                >
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${tema.text}`}>
                  Complexidade
                </label>
                <select 
                  name="complexidade" 
                  value={form.complexidade} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 rounded-xl border font-medium ${
                    temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-yellow-500'
                      : 'bg-white/10 border-white/10 text-white focus:border-white/30'
                  }`}
                >
                  {COMPLEXIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Disciplinas */}
          <section>
            <h3 className={`text-lg font-semibold ${tema.text} mb-4 flex items-center gap-2`}>
              🎯 Disciplinas Envolvidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {DISCIPLINAS.map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                    form.disciplinasSelecionadas?.includes(d)
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-500 shadow-lg'
                      : temaId === 'elegante'
                        ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                  }`}
                  onClick={() => handleDisciplinaChange(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* Configurações Comerciais */}
          <section>
            <h3 className={`text-lg font-semibold ${tema.text} mb-4 flex items-center gap-2`}>
              💼 Configurações Comerciais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${tema.text}`}>
                  Urgência
                </label>
                <select 
                  name="urgencia" 
                  value={form.urgencia} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 rounded-xl border font-medium ${
                    temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-yellow-500'
                      : 'bg-white/10 border-white/10 text-white focus:border-white/30'
                  }`}
                >
                  {URGENCIAS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <InputFormatado
                tipo="text"
                value={String(form.margem || '')}
                onChange={(valor) => setForm(prev => ({ ...prev, margem: Number(valor.replace(/\D/g, '')) }))}
                label="Margem (%)"
                temaId={temaIdFormatado}
                placeholder="Ex: 15"
              />
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${tema.text}`}>
                  Localização (UF)
                </label>
                <select 
                  name="localizacao" 
                  value={form.localizacao} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-3 rounded-xl border font-medium ${
                    temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-yellow-500'
                      : 'bg-white/10 border-white/10 text-white focus:border-white/30'
                  }`}
                >
                  {UF.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Botão Simular */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              variant="orcamentos" 
              size="lg"
              loading={loading}
              leftIcon={<Zap className="w-5 h-5" />}
              className="px-12 py-4 text-lg font-bold shadow-xl hover:shadow-2xl"
            >
              {loading ? "Calculando..." : "Simular Orçamento"}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Resultado do Orçamento */}
      {orcamento && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <OrcamentoDetalhadoComponent orcamento={orcamento} />
          
          {!proposta && (
            <div className="flex justify-center">
              <Button 
                onClick={handleGerarProposta} 
                variant="orcamentos" 
                size="lg"
                leftIcon={<FileText className="w-5 h-5" />}
                className="px-8 py-3 font-bold shadow-lg hover:shadow-xl"
              >
                Gerar Proposta Comercial
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Proposta Comercial */}
      {proposta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PropostaComercial proposta={proposta} />
        </motion.div>
      )}
    </div>
  );
}; 