import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { LucideCalculator, LucideSave, LucideFileText, LucideArrowRight } from 'lucide-react';

const TIPOS = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'institucional', label: 'Institucional' },
];
const PADROES = [
  { value: 'economico', label: 'Econômico' },
  { value: 'medio', label: 'Médio' },
  { value: 'alto', label: 'Alto' },
  { value: 'luxo', label: 'Luxo' },
];

export default function OrcamentoModeloForm({ onSalvar, onExportar, onConverter, modelo, modo = 'novo', onCancelar, onEditar }: any) {
  const [form, setForm] = useState({
    nome: '',
    tipo: 'residencial',
    area: '',
    padrao: 'medio',
    localizacao: '',
    valorM2: '',
    observacoes: '',
  });
  const [valorTotal, setValorTotal] = useState<number | null>(null);

  useEffect(() => {
    if (modelo) {
      setForm({
        nome: modelo.nome || '',
        tipo: modelo.tipo || 'residencial',
        area: modelo.area?.toString() || '',
        padrao: modelo.padrao || 'medio',
        localizacao: modelo.localizacao || '',
        valorM2: modelo.valorM2?.toString() || '',
        observacoes: modelo.observacoes || '',
      });
      setValorTotal(modelo.valorTotal || null);
    }
  }, [modelo]);

  function calcularValor() {
    const area = parseFloat(form.area.replace(',', '.')) || 0;
    const valorM2 = parseFloat(form.valorM2.replace(',', '.')) || 0;
    setValorTotal(area * valorM2);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    calcularValor();
    if (modo === 'editar' && onEditar) {
      onEditar(form, valorTotal);
    } else if (onSalvar) {
      onSalvar(form, valorTotal);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <LucideCalculator className="text-blue-600" />
          {modo === 'editar' ? 'Editar Orçamento Modelo' : 'Orçamento Modelo / Rápido'}
        </CardTitle>
        <p className="text-gray-500 text-sm mt-1">Preencha os campos essenciais para gerar um orçamento rápido. Você pode salvar como modelo, exportar ou converter em detalhado.</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Orçamento</label>
              <Input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Residencial Simples" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Projeto</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full rounded-lg border-gray-300">
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Área Estimada (m²)</label>
              <Input name="area" value={form.area} onChange={handleChange} placeholder="Ex: 120" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Padrão</label>
              <select name="padrao" value={form.padrao} onChange={handleChange} className="w-full rounded-lg border-gray-300">
                {PADROES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Localização</label>
              <Input name="localizacao" value={form.localizacao} onChange={handleChange} placeholder="Cidade/UF" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Base m² (R$)</label>
              <Input name="valorM2" value={form.valorM2} onChange={handleChange} placeholder="Ex: 2500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observações</label>
            <Input name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Opcional" />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Button type="submit" variant="primary" leftIcon={<LucideCalculator />}>{modo === 'editar' ? 'Salvar Alterações' : 'Calcular'}</Button>
            {modo !== 'editar' && <Button type="button" variant="secondary" leftIcon={<LucideSave />} onClick={() => onSalvar && onSalvar(form, valorTotal)}>Salvar como Modelo</Button>}
            <Button type="button" variant="outline" leftIcon={<LucideFileText />} onClick={() => onExportar && onExportar(form, valorTotal)}>Exportar</Button>
            <Button type="button" variant="ghost" leftIcon={<LucideArrowRight />} onClick={() => onConverter && onConverter(form, valorTotal)}>Converter em Detalhado</Button>
            {onCancelar && <Button type="button" variant="ghost" onClick={onCancelar}>Cancelar</Button>}
          </div>
        </form>
        {valorTotal !== null && (
          <div className="mt-8 p-6 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Resumo do Orçamento</h3>
            <p className="text-2xl font-extrabold text-blue-700">R$ {valorTotal.toLocaleString('pt-BR')}</p>
            <p className="text-sm text-blue-700 mt-2">{form.nome} • {TIPOS.find(t => t.value === form.tipo)?.label} • {form.area} m² • {PADROES.find(p => p.value === form.padrao)?.label}</p>
            {form.observacoes && <p className="text-xs text-blue-600 mt-1">{form.observacoes}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 