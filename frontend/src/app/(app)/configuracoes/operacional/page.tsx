'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ArrowLeft, 
  Save, 
  RefreshCw,
  Plus,
  Trash2,
  Clock,
  Settings,
  Mail,
  Zap,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Target,
  Globe,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../../../../contexts/ThemeContext';
import useConfiguracaoStore from '../../../../stores/configuracaoStore';

const ConfiguracaoOperacionalPage: React.FC = () => {
  const { temaId } = useTheme();
  const { configuracoes, atualizarOperacional } = useConfiguracaoStore();
  
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [abaSelecionada, setAbaSelecionada] = useState<'equipe' | 'fluxo' | 'horarios' | 'capacidade' | 'automacao' | 'integracoes'>('equipe');

  const [formData, setFormData] = useState(configuracoes.operacional);

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

  const adicionarMembro = () => {
    const novoMembro = {
      id: Date.now().toString(),
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      especialidade: [],
      horasSemanais: 40,
      custoPorHora: 0,
      ativo: true
    };
    setFormData(prev => ({
      ...prev,
      membrosEquipe: [...prev.membrosEquipe, novoMembro]
    }));
  };

  const removerMembro = (id: string) => {
    setFormData(prev => ({
      ...prev,
      membrosEquipe: prev.membrosEquipe.filter(m => m.id !== id)
    }));
  };

  const atualizarMembro = (id: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      membrosEquipe: prev.membrosEquipe.map(m =>
        m.id === id ? { ...m, [campo]: valor } : m
      )
    }));
  };

  const adicionarEtapa = () => {
    const novaEtapa = {
      id: Date.now().toString(),
      nome: '',
      descricao: '',
      ordem: formData.etapasProjeto.length + 1,
      prazoEstimado: 5,
      obrigatoria: true,
      dependencias: [],
      ativo: true
    };
    setFormData(prev => ({
      ...prev,
      etapasProjeto: [...prev.etapasProjeto, novaEtapa]
    }));
  };

  const removerEtapa = (id: string) => {
    setFormData(prev => ({
      ...prev,
      etapasProjeto: prev.etapasProjeto.filter(e => e.id !== id)
    }));
  };

  const atualizarEtapa = (id: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      etapasProjeto: prev.etapasProjeto.map(e =>
        e.id === id ? { ...e, [campo]: valor } : e
      )
    }));
  };

  const salvarConfiguracoes = async () => {
    setSalvando(true);
    setErros([]);
    
    try {
      await atualizarOperacional(formData);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (error) {
      setErros(['Erro ao salvar configurações operacionais']);
    } finally {
      setSalvando(false);
    }
  };

  const abas = [
    { key: 'equipe', label: 'Equipe', icon: Users, cor: 'blue' },
    { key: 'fluxo', label: 'Fluxo', icon: Settings, cor: 'green' },
    { key: 'horarios', label: 'Horários', icon: Clock, cor: 'purple' },
    { key: 'capacidade', label: 'Capacidade', icon: Target, cor: 'orange' },
    { key: 'automacao', label: 'Automação', icon: Zap, cor: 'yellow' },
    { key: 'integracoes', label: 'Integrações', icon: Globe, cor: 'indigo' }
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
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
          }`}>
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Configurações Operacionais
            </h1>
            <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              Configure equipe, fluxos e processos operacionais
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
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
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
            <span className="font-semibold">Configurações salvas com sucesso!</span>
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
          {abas.map(({ key, label, icon: Icon, cor }) => {
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
                      ? 'bg-orange-100 text-orange-700 shadow-md'
                      : 'bg-orange-500/20 text-orange-300 shadow-md'
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
        {/* ABA EQUIPE */}
        {abaSelecionada === 'equipe' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Gerenciamento da Equipe
                </h2>
                <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                  Configure os membros da sua equipe e suas especialidades
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={adicionarMembro}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Membro
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {formData.membrosEquipe.map((membro, index) => (
                <motion.div
                  key={membro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    temaId === 'elegante'
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        membro.ativo 
                          ? temaId === 'elegante' ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
                          : temaId === 'elegante' ? 'bg-gray-100 text-gray-400' : 'bg-white/10 text-white/40'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {membro.nome || 'Novo Membro'}
                        </h3>
                        <p className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                          {membro.cargo || 'Cargo não definido'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removerMembro(membro.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        temaId === 'elegante'
                          ? 'hover:bg-red-100 text-red-600'
                          : 'hover:bg-red-500/20 text-red-400'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={membro.nome}
                        onChange={(e) => atualizarMembro(membro.id, 'nome', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        placeholder="Nome do profissional"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={membro.email}
                        onChange={(e) => atualizarMembro(membro.id, 'email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Cargo
                      </label>
                      <select
                        value={membro.cargo}
                        onChange={(e) => atualizarMembro(membro.id, 'cargo', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                      >
                        <option value="">Selecione o cargo</option>
                        <option value="Arquiteto Sênior">Arquiteto Sênior</option>
                        <option value="Arquiteto Pleno">Arquiteto Pleno</option>
                        <option value="Arquiteto Júnior">Arquiteto Júnior</option>
                        <option value="Engenheiro">Engenheiro</option>
                        <option value="Desenhista">Desenhista</option>
                        <option value="Estagiário">Estagiário</option>
                        <option value="Coordenador">Coordenador</option>
                        <option value="Gerente">Gerente</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Horas Semanais
                      </label>
                      <input
                        type="number"
                        value={membro.horasSemanais}
                        onChange={(e) => atualizarMembro(membro.id, 'horasSemanais', Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        min="1"
                        max="60"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Custo por Hora (R$)
                      </label>
                      <input
                        type="number"
                        value={membro.custoPorHora}
                        onChange={(e) => atualizarMembro(membro.id, 'custoPorHora', Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={membro.ativo}
                          onChange={(e) => atualizarMembro(membro.id, 'ativo', e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          Membro Ativo
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              ))}

              {formData.membrosEquipe.length === 0 && (
                <div className={`text-center py-12 ${
                  temaId === 'elegante'
                    ? 'text-gray-500'
                    : 'text-white/50'
                }`}>
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum membro cadastrado</h3>
                  <p className="mb-4">Adicione os membros da sua equipe para começar.</p>
                  <button
                    onClick={adicionarMembro}
                    className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                      temaId === 'elegante'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Adicionar Primeiro Membro
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA FLUXO */}
        {abaSelecionada === 'fluxo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Fluxo de Trabalho
                </h2>
                <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                  Configure as etapas dos projetos e aprovações
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={adicionarEtapa}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Etapa
              </motion.button>
            </div>

            {/* Configurações de Aprovação */}
            <div className={`p-4 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-gray-200 bg-gray-50'
                : 'border-white/10 bg-white/5'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Configurações de Aprovação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.aprovacaoInterna}
                    onChange={(e) => handleInputChange('aprovacaoInterna', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Aprovação Interna Obrigatória
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.revisaoTecnica}
                    onChange={(e) => handleInputChange('revisaoTecnica', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Revisão Técnica Obrigatória
                  </span>
                </label>
              </div>
            </div>
            
            {/* Etapas do Projeto */}
            <div className="space-y-4">
              {formData.etapasProjeto.map((etapa, index) => (
                <motion.div
                  key={etapa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    temaId === 'elegante'
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        temaId === 'elegante' ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {etapa.ordem}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {etapa.nome || 'Nova Etapa'}
                        </h3>
                        <p className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                          {etapa.prazoEstimado} dias estimados
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removerEtapa(etapa.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        temaId === 'elegante'
                          ? 'hover:bg-red-100 text-red-600'
                          : 'hover:bg-red-500/20 text-red-400'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Nome da Etapa
                      </label>
                      <input
                        type="text"
                        value={etapa.nome}
                        onChange={(e) => atualizarEtapa(etapa.id, 'nome', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        placeholder="Ex: Estudo Preliminar"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Prazo Estimado (dias)
                      </label>
                      <input
                        type="number"
                        value={etapa.prazoEstimado}
                        onChange={(e) => atualizarEtapa(etapa.id, 'prazoEstimado', Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        min="1"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        Descrição
                      </label>
                      <textarea
                        value={etapa.descricao}
                        onChange={(e) => atualizarEtapa(etapa.id, 'descricao', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        rows={2}
                        placeholder="Descreva as atividades desta etapa..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={etapa.obrigatoria}
                          onChange={(e) => atualizarEtapa(etapa.id, 'obrigatoria', e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          Etapa Obrigatória
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={etapa.ativo}
                          onChange={(e) => atualizarEtapa(etapa.id, 'ativo', e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          Etapa Ativa
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              ))}

              {formData.etapasProjeto.length === 0 && (
                <div className={`text-center py-12 ${
                  temaId === 'elegante'
                    ? 'text-gray-500'
                    : 'text-white/50'
                }`}>
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma etapa configurada</h3>
                  <p className="mb-4">Configure as etapas do fluxo de trabalho dos seus projetos.</p>
                  <button
                    onClick={adicionarEtapa}
                    className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                      temaId === 'elegante'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Adicionar Primeira Etapa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA HORÁRIOS */}
        {abaSelecionada === 'horarios' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Horários de Trabalho
              </h2>
              <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                Configure a jornada de trabalho da equipe
              </p>
            </div>
            
            <div className={`p-6 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-gray-200 bg-gray-50'
                : 'border-white/10 bg-white/5'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Hora de Início
                  </label>
                  <input
                    type="time"
                    value={formData.horariosTrabalho.horaInicio}
                    onChange={(e) => handleInputChange('horariosTrabalho.horaInicio', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Hora de Fim
                  </label>
                  <input
                    type="time"
                    value={formData.horariosTrabalho.horaFim}
                    onChange={(e) => handleInputChange('horariosTrabalho.horaFim', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Horas de Almoço
                  </label>
                  <input
                    type="number"
                    value={formData.horariosTrabalho.horasAlmoco}
                    onChange={(e) => handleInputChange('horariosTrabalho.horasAlmoco', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                    min="0"
                    max="4"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Horas por Dia
                  </label>
                  <input
                    type="number"
                    value={formData.horariosTrabalho.horasDia}
                    onChange={(e) => handleInputChange('horariosTrabalho.horasDia', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                    min="1"
                    max="12"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className={`block text-sm font-semibold mb-3 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Dias da Semana
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia, index) => {
                    const diaNumero = index + 1;
                    const selecionado = formData.horariosTrabalho.diasSemana.includes(diaNumero);
                    
                    return (
                      <label key={dia} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selecionado}
                          onChange={(e) => {
                            const novosDias = e.target.checked
                              ? [...formData.horariosTrabalho.diasSemana, diaNumero]
                              : formData.horariosTrabalho.diasSemana.filter(d => d !== diaNumero);
                            handleInputChange('horariosTrabalho.diasSemana', novosDias);
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm font-medium ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {dia}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA CAPACIDADE */}
        {abaSelecionada === 'capacidade' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Capacidade de Produção
              </h2>
              <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                Configure a capacidade produtiva do escritório
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'projetosSimultaneos', label: 'Projetos Simultâneos', sufixo: 'projeto(s)', icon: '📊' },
                { key: 'metrosQuadradosPorMes', label: 'Metros² por Mês', sufixo: 'm²/mês', icon: '📐' },
                { key: 'horasProducaoMes', label: 'Horas de Produção/Mês', sufixo: 'horas/mês', icon: '⏰' },
                { key: 'eficienciaEquipe', label: 'Eficiência da Equipe', sufixo: '%', icon: '⚡' }
              ].map(({ key, label, sufixo, icon }) => {
                const valor = formData.capacidadeProducao[key as keyof typeof formData.capacidadeProducao];
                return (
                  <div key={key} className={`p-4 rounded-xl border ${
                    temaId === 'elegante'
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-white/10 bg-white/5'
                  }`}>
                    <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                      <span className="text-lg">{icon}</span>
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={valor}
                        onChange={(e) => handleInputChange(`capacidadeProducao.${key}`, Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg text-lg font-semibold transition-colors ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-orange-500'
                            : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                        }`}
                        min="0"
                      />
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                        temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                      }`}>
                        {sufixo}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Outras abas em desenvolvimento */}
        {!['equipe', 'fluxo', 'horarios', 'capacidade'].includes(abaSelecionada) && (
          <div className={`text-center py-12 ${
            temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
          }`}>
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Em desenvolvimento</h3>
            <p>Esta seção será implementada em breve.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfiguracaoOperacionalPage; 