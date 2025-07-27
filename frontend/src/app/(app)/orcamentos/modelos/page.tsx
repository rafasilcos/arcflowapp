'use client'
import React, { useState } from 'react';
import OrcamentoModeloForm from '../components/OrcamentoModeloForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucidePlus, LucideFileText, LucideEdit, LucideTrash2 } from 'lucide-react';

// Mock de modelos salvos
const modelosMock = [
  {
    id: 1,
    nome: 'Residencial Simples',
    tipo: 'residencial',
    area: 120,
    padrao: 'medio',
    localizacao: 'São Paulo/SP',
    valorM2: 2500,
    valorTotal: 300000,
    observacoes: 'Modelo padrão para casas térreas.'
  },
  {
    id: 2,
    nome: 'Comercial Médio',
    tipo: 'comercial',
    area: 300,
    padrao: 'alto',
    localizacao: 'Curitiba/PR',
    valorM2: 3200,
    valorTotal: 960000,
    observacoes: 'Loja de rua, padrão alto.'
  }
];

export default function OrcamentosModelosPage() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [modelos, setModelos] = useState(modelosMock);
  const [editando, setEditando] = useState<any>(null);

  function handleSalvar(form: any, valorTotal: number) {
    setModelos(prev => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        valorTotal: valorTotal || 0
      }
    ]);
    setMostrarForm(false);
  }

  function handleEditar(form: any, valorTotal: number) {
    setModelos(prev => prev.map(m => m.id === editando.id ? { ...m, ...form, valorTotal: valorTotal || 0 } : m));
    setEditando(null);
    setMostrarForm(false);
  }

  function handleExcluir(id: number) {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      setModelos(prev => prev.filter(m => m.id !== id));
    }
  }

  function handleCancelar() {
    setMostrarForm(false);
    setEditando(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-700 dark:text-primary-400 flex items-center gap-3">
            <LucideFileText className="w-8 h-8 text-blue-600" />
            Orçamentos Modelo
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">Crie, salve, edite e utilize modelos de orçamento para agilizar propostas e simulações.</p>
        </div>
        <Button variant="primary" leftIcon={<LucidePlus />} onClick={() => { setMostrarForm(true); setEditando(null); }}>
          Novo Orçamento Modelo
        </Button>
      </div>
      {(mostrarForm && !editando) && (
        <OrcamentoModeloForm
          onSalvar={handleSalvar}
          onExportar={() => alert('Exportação mock!')}
          onConverter={() => alert('Conversão mock!')}
          onCancelar={handleCancelar}
        />
      )}
      {(mostrarForm && editando) && (
        <OrcamentoModeloForm
          modelo={editando}
          modo="editar"
          onEditar={handleEditar}
          onExportar={() => alert('Exportação mock!')}
          onConverter={() => alert('Conversão mock!')}
          onCancelar={handleCancelar}
        />
      )}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {modelos.map((modelo) => (
          <Card key={modelo.id} className="shadow-lg border border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LucideFileText className="text-blue-600" />
                  {modelo.nome}
                </CardTitle>
                <p className="text-gray-500 text-sm mt-1">{modelo.tipo.charAt(0).toUpperCase() + modelo.tipo.slice(1)} • {modelo.area} m² • {modelo.padrao.charAt(0).toUpperCase() + modelo.padrao.slice(1)}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => { setEditando(modelo); setMostrarForm(true); }} title="Editar">
                  <LucideEdit className="w-5 h-5 text-blue-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleExcluir(modelo.id)} title="Excluir">
                  <LucideTrash2 className="w-5 h-5 text-red-600" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <span className="text-blue-700 font-bold text-xl">R$ {modelo.valorTotal.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-gray-600">{modelo.localizacao}</span>
                {modelo.observacoes && <span className="text-xs text-blue-600">{modelo.observacoes}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 