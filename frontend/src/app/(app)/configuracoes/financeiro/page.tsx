'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  Calculator,
  TrendingUp,
  Receipt,
  ArrowLeft,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle,
  Percent,
  Building
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useConfigFinanceira } from '../../../../stores/configuracaoStore';
import Link from 'next/link';

const ConfiguracaoFinanceiraPage: React.FC = () => {
  const { tema, temaId } = useTheme();
  const { configuracao, atualizar, validar, isLoading } = useConfigFinanceira();
  
  const [formData, setFormData] = useState(configuracao);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [sucesso, setSucesso] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'impostos' | 'precificacao' | 'pagamentos' | 'bancario'>('impostos');

  const handleInputChange = (campo: string, valor: any) => {
    const campos = campo.split('.');
    if (campos.length === 1) {
      setFormData(prev => ({ ...prev, [campo]: valor }));
    } else if (campos.length === 2) {
      setFormData(prev => ({
        ...prev,
        [campos[0]]: {
          ...(prev[campos[0] as keyof typeof prev] as any),
          [campos[1]]: valor
        }
      }));
    }
  };

  const adicionarTabelaPreco = () => {
    const novaTabela = {
      id: Date.now().toString(),
      nome: '',
      valorPorM2: 0,
      valorPorHora: 0,
      horasEstimadas: 0,
      categoria: 'arquitetura' as const,
      ativo: true
    };
    setFormData(prev => ({
      ...prev,
      tabelaPrecos: [...prev.tabelaPrecos, novaTabela]
    }));
  };

  const removerTabelaPreco = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tabelaPrecos: prev.tabelaPrecos.filter(t => t.id !== id)
    }));
  };

  const atualizarTabelaPreco = (id: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      tabelaPrecos: prev.tabelaPrecos.map(t =>
        t.id === id ? { ...t, [campo]: valor } : t
      )
    }));
  };

  const adicionarCondicaoPagamento = () => {
    const novaCondicao = {
      id: Date.now().toString(),
      nome: '',
      descricao: '',
      parcelas: 1,
      intervaloDias: 30,
      ativo: true
    };
    setFormData(prev => ({
      ...prev,
      condicoesPagamento: [...prev.condicoesPagamento, novaCondicao]
    }));
  };

  const removerCondicaoPagamento = (id: string) => {
    setFormData(prev => ({
      ...prev,
      condicoesPagamento: prev.condicoesPagamento.filter(c => c.id !== id)
    }));
  };

  const atualizarCondicaoPagamento = (id: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      condicoesPagamento: prev.condicoesPagamento.map(c =>
        c.id === id ? { ...c, [campo]: valor } : c
      )
    }));
  };

  const salvarConfiguracoes = async () => {
    setSalvando(true);
    setErros([]);
    
    try {
      const errosValidacao = validar();
      if (errosValidacao.length > 0) {
        setErros(errosValidacao);
        return;
      }

      await atualizar(formData);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
      
    } catch (error) {
      setErros(['Erro ao salvar configurações financeiras']);
    } finally {
      setSalvando(false);
    }
  };

  const abas = [
    { key: 'impostos', label: 'Impostos', icon: Receipt, cor: 'red' },
    { key: 'precificacao', label: 'Precificação', icon: Calculator, cor: 'green' },
    { key: 'pagamentos', label: 'Pagamentos', icon: CreditCard, cor: 'blue' },
    { key: 'bancario', label: 'Dados Bancários', icon: Building, cor: 'purple' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/configuracoes">
            <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              temaId === 'elegante'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-white/10 hover:bg-white/20 text-white/70'
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            temaId === 'elegante' 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg'
          }`}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Configurações Financeiras
            </h1>
            <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              Configure impostos, precificação e condições de pagamento
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={salvarConfiguracoes}
          disabled={salvando}
          className={`px-6 py-2 rounded-xl font-semibold transition-colors shadow-lg ${
            temaId === 'elegante'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {salvando ? (
            <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
          ) : (
            <Save className="w-4 h-4 inline mr-2" />
          )}
          {salvando ? 'Salvando...' : 'Salvar'}
        </motion.button>
      </div>

      {/* Alertas */}
      {erros.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            temaId === 'elegante'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Erros encontrados:</h3>
              <ul className="mt-1 list-disc list-inside">
                {erros.map((erro, index) => (
                  <li key={index}>{erro}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {sucesso && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            temaId === 'elegante'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Configurações financeiras salvas com sucesso!</span>
          </div>
        </motion.div>
      )}

      {/* Navegação por abas */}
      <div className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
        temaId === 'elegante'
          ? 'bg-white border-gray-200 shadow-sm'
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex space-x-2 overflow-x-auto">
          {abas.map(({ key, label, icon: Icon }) => {
            const isActive = abaSelecionada === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAbaSelecionada(key as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? temaId === 'elegante'
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'bg-green-500/20 text-green-300 shadow-md'
                    : temaId === 'elegante'
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <motion.div 
        key={abaSelecionada}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
          temaId === 'elegante'
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-white/5 border-white/10'
        }`}
      >
        {/* ABA IMPOSTOS */}
        {abaSelecionada === 'impostos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Moeda
                </label>
                <select
                  value={formData.moeda}
                  onChange={(e) => handleInputChange('moeda', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Regime Tributário
                </label>
                <select
                  value={formData.regimeTributario}
                  onChange={(e) => handleInputChange('regimeTributario', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                >
                  <option value="Simples">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Percent className="w-4 h-4 inline mr-1" />
                  ISS (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  value={formData.aliquotaISS}
                  onChange={(e) => handleInputChange('aliquotaISS', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="2.5"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Percent className="w-4 h-4 inline mr-1" />
                  IR (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.aliquotaIR}
                  onChange={(e) => handleInputChange('aliquotaIR', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Percent className="w-4 h-4 inline mr-1" />
                  PIS (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.aliquotaPIS}
                  onChange={(e) => handleInputChange('aliquotaPIS', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Percent className="w-4 h-4 inline mr-1" />
                  COFINS (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.aliquotaCOFINS}
                  onChange={(e) => handleInputChange('aliquotaCOFINS', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Percent className="w-4 h-4 inline mr-1" />
                  Multa por Atraso (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.multaAtraso}
                  onChange={(e) => handleInputChange('multaAtraso', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="2"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Percent className="w-4 h-4 inline mr-1" />
                  Juros por Atraso (% ao mês)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.jurosAtraso}
                  onChange={(e) => handleInputChange('jurosAtraso', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="1"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABA PRECIFICAÇÃO */}
        {abaSelecionada === 'precificacao' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Tabela de Preços
              </h3>
              <button
                onClick={adicionarTabelaPreco}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Serviço
              </button>
            </div>

            {formData.tabelaPrecos.map((tabela, index) => (
              <motion.div
                key={tabela.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  temaId === 'elegante'
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Serviço {index + 1}
                  </h4>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tabela.ativo}
                        onChange={(e) => atualizarTabelaPreco(tabela.id, 'ativo', e.target.checked)}
                        className="rounded"
                      />
                      <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                        Ativo
                      </span>
                    </label>
                    <button
                      onClick={() => removerTabelaPreco(tabela.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder="Nome do serviço"
                    value={tabela.nome}
                    onChange={(e) => atualizarTabelaPreco(tabela.id, 'nome', e.target.value)}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <select
                    value={tabela.categoria}
                    onChange={(e) => atualizarTabelaPreco(tabela.id, 'categoria', e.target.value)}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  >
                    <option value="arquitetura">Arquitetura</option>
                    <option value="engenharia">Engenharia</option>
                    <option value="complementar">Complementar</option>
                  </select>
                  
                  <input
                    type="number"
                    placeholder="Valor por m²"
                    value={tabela.valorPorM2}
                    onChange={(e) => atualizarTabelaPreco(tabela.id, 'valorPorM2', Number(e.target.value))}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="number"
                    placeholder="Valor por hora"
                    value={tabela.valorPorHora}
                    onChange={(e) => atualizarTabelaPreco(tabela.id, 'valorPorHora', Number(e.target.value))}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="number"
                    placeholder="Horas estimadas"
                    value={tabela.horasEstimadas}
                    onChange={(e) => atualizarTabelaPreco(tabela.id, 'horasEstimadas', Number(e.target.value))}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ABA PAGAMENTOS */}
        {abaSelecionada === 'pagamentos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Condições de Pagamento
              </h3>
              <button
                onClick={adicionarCondicaoPagamento}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Condição
              </button>
            </div>

            {formData.condicoesPagamento.map((condicao, index) => (
              <motion.div
                key={condicao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  temaId === 'elegante'
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Condição {index + 1}
                  </h4>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={condicao.ativo}
                        onChange={(e) => atualizarCondicaoPagamento(condicao.id, 'ativo', e.target.checked)}
                        className="rounded"
                      />
                      <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                        Ativo
                      </span>
                    </label>
                    <button
                      onClick={() => removerCondicaoPagamento(condicao.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Nome da condição"
                    value={condicao.nome}
                    onChange={(e) => atualizarCondicaoPagamento(condicao.id, 'nome', e.target.value)}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="number"
                    placeholder="Parcelas"
                    value={condicao.parcelas}
                    onChange={(e) => atualizarCondicaoPagamento(condicao.id, 'parcelas', Number(e.target.value))}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="number"
                    placeholder="Intervalo (dias)"
                    value={condicao.intervaloDias}
                    onChange={(e) => atualizarCondicaoPagamento(condicao.id, 'intervaloDias', Number(e.target.value))}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="number"
                    placeholder="Desconto à vista (%)"
                    value={condicao.descontoAVista || ''}
                    onChange={(e) => atualizarCondicaoPagamento(condicao.id, 'descontoAVista', Number(e.target.value))}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                </div>

                <div className="mt-4">
                  <textarea
                    placeholder="Descrição da condição"
                    value={condicao.descricao}
                    onChange={(e) => atualizarCondicaoPagamento(condicao.id, 'descricao', e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ABA DADOS BANCÁRIOS */}
        {abaSelecionada === 'bancario' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Dados Bancários
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Banco
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.banco}
                  onChange={(e) => handleInputChange('dadosBancarios.banco', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="Nome do banco"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Tipo de Conta
                </label>
                <select
                  value={formData.dadosBancarios.tipoConta}
                  onChange={(e) => handleInputChange('dadosBancarios.tipoConta', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                >
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Agência
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.agencia}
                  onChange={(e) => handleInputChange('dadosBancarios.agencia', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="0000"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Conta
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.conta}
                  onChange={(e) => handleInputChange('dadosBancarios.conta', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="00000-0"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  PIX (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.pix || ''}
                  onChange={(e) => handleInputChange('dadosBancarios.pix', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                  }`}
                  placeholder="Chave PIX (email, telefone, CPF/CNPJ ou aleatória)"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfiguracaoFinanceiraPage; 