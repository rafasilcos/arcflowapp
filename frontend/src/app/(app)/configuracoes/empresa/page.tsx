'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Award,
  Upload,
  Save,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  Palette
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useConfigEmpresa } from '../../../../stores/configuracaoStore';
import Link from 'next/link';

const ConfiguracaoEmpresaPage: React.FC = () => {
  const { tema, temaId } = useTheme();
  const { configuracao, atualizar, validar, isLoading } = useConfigEmpresa();
  
  const [formData, setFormData] = useState(configuracao);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [sucesso, setSucesso] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'dados' | 'endereco' | 'contatos' | 'responsaveis' | 'branding'>('dados');

  const handleInputChange = (campo: string, valor: any) => {
    const campos = campo.split('.');
    if (campos.length === 1) {
      setFormData(prev => ({ ...prev, [campo]: valor }));
    } else {
      setFormData(prev => ({
        ...prev,
        [campos[0]]: {
          ...(prev[campos[0] as keyof typeof prev] as any),
          [campos[1]]: valor
        }
      }));
    }
  };

  const adicionarResponsavel = () => {
    const novoResponsavel = {
      id: Date.now().toString(),
      nome: '',
      email: '',
      telefone: '',
      registro: '',
      orgao: '',
      especialidade: '',
      ativo: true
    };
    setFormData(prev => ({
      ...prev,
      responsavelTecnico: [...prev.responsavelTecnico, novoResponsavel]
    }));
  };

  const removerResponsavel = (id: string) => {
    setFormData(prev => ({
      ...prev,
      responsavelTecnico: prev.responsavelTecnico.filter(r => r.id !== id)
    }));
  };

  const atualizarResponsavel = (id: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      responsavelTecnico: prev.responsavelTecnico.map(r =>
        r.id === id ? { ...r, [campo]: valor } : r
      )
    }));
  };

  const salvarConfiguracoes = async () => {
    setSalvando(true);
    setErros([]);
    
    try {
      // Validar dados
      const errosValidacao = validar();
      if (errosValidacao.length > 0) {
        setErros(errosValidacao);
        return;
      }

      // Salvar
      await atualizar(formData);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
      
    } catch (error) {
      setErros(['Erro ao salvar configurações']);
    } finally {
      setSalvando(false);
    }
  };

  const uploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo', e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const abas = [
    { key: 'dados', label: 'Dados Básicos', icon: Building2, cor: 'blue' },
    { key: 'endereco', label: 'Endereço', icon: MapPin, cor: 'green' },
    { key: 'contatos', label: 'Contatos', icon: Phone, cor: 'purple' },
    { key: 'responsaveis', label: 'Responsáveis', icon: Users, cor: 'orange' },
    { key: 'branding', label: 'Branding', icon: Palette, cor: 'pink' }
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
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg'
          }`}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Configurações da Empresa
            </h1>
            <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              Configure os dados fundamentais da sua empresa
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={salvarConfiguracoes}
            disabled={salvando}
            className={`px-6 py-2 rounded-xl font-semibold transition-colors shadow-lg ${
              temaId === 'elegante'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
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
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'bg-blue-500/20 text-blue-300 shadow-md'
                    : temaId === 'elegante'
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
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
        {/* ABA DADOS BÁSICOS */}
        {abaSelecionada === 'dados' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Razão Social *
                </label>
                <input
                  type="text"
                  value={formData.razaoSocial}
                  onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="Nome oficial da empresa"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  value={formData.nomeFantasia}
                  onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="Nome comercial"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  value={formData.inscricaoEstadual || ''}
                  onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="000.000.000.000"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Ano de Fundação
                </label>
                <input
                  type="number"
                  value={formData.anoFundacao || ''}
                  onChange={(e) => handleInputChange('anoFundacao', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="2020"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Número de Funcionários
                </label>
                <input
                  type="number"
                  value={formData.numeroFuncionarios}
                  onChange={(e) => handleInputChange('numeroFuncionarios', Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABA ENDEREÇO */}
        {abaSelecionada === 'endereco' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.endereco.cep}
                  onChange={(e) => handleInputChange('endereco.cep', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="00000-000"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Logradouro
                </label>
                <input
                  type="text"
                  value={formData.endereco.logradouro}
                  onChange={(e) => handleInputChange('endereco.logradouro', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="Rua, Avenida, etc."
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Número
                </label>
                <input
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="123"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.endereco.complemento || ''}
                  onChange={(e) => handleInputChange('endereco.complemento', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="Sala, Andar, etc."
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  Estado
                </label>
                <select
                  value={formData.endereco.estado}
                  onChange={(e) => handleInputChange('endereco.estado', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  {/* Adicionar outros estados */}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  País
                </label>
                <input
                  type="text"
                  value={formData.endereco.pais}
                  onChange={(e) => handleInputChange('endereco.pais', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="Brasil"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABA CONTATOS */}
        {abaSelecionada === 'contatos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone *
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="contato@empresa.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  <Globe className="w-4 h-4 inline mr-2" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      : 'border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10'
                  }`}
                  placeholder="https://www.empresa.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABA RESPONSÁVEIS TÉCNICOS */}
        {abaSelecionada === 'responsaveis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Responsáveis Técnicos
              </h3>
              <button
                onClick={adicionarResponsavel}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar
              </button>
            </div>

            {formData.responsavelTecnico.map((responsavel, index) => (
              <motion.div
                key={responsavel.id}
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
                    Responsável {index + 1}
                  </h4>
                  <button
                    onClick={() => removerResponsavel(responsavel.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={responsavel.nome}
                    onChange={(e) => atualizarResponsavel(responsavel.id, 'nome', e.target.value)}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="email"
                    placeholder="Email"
                    value={responsavel.email}
                    onChange={(e) => atualizarResponsavel(responsavel.id, 'email', e.target.value)}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="text"
                    placeholder="Registro (CREA/CAU)"
                    value={responsavel.registro}
                    onChange={(e) => atualizarResponsavel(responsavel.id, 'registro', e.target.value)}
                    className={`px-3 py-2 border rounded-lg ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-white/20 bg-white/5 text-white'
                    }`}
                  />
                  
                  <input
                    type="text"
                    placeholder="Especialidade"
                    value={responsavel.especialidade}
                    onChange={(e) => atualizarResponsavel(responsavel.id, 'especialidade', e.target.value)}
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

        {/* ABA BRANDING */}
        {abaSelecionada === 'branding' && (
          <div className="space-y-6">
            {/* Upload de Logo */}
            <div>
              <label className={`block text-sm font-semibold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Logo da Empresa
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
                temaId === 'elegante'
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-white/20 hover:border-white/30'
              }`}>
                {formData.logo ? (
                  <div className="space-y-4">
                    <img
                      src={formData.logo}
                      alt="Logo"
                      className="max-h-32 mx-auto"
                    />
                    <button
                      onClick={() => handleInputChange('logo', '')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remover Logo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className={`w-12 h-12 mx-auto ${temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'}`} />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadLogo}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`cursor-pointer inline-block px-4 py-2 rounded-lg font-medium transition-colors ${
                          temaId === 'elegante'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        Escolher Arquivo
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cores */}
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Cores da Marca
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(formData.cores).map(([nome, cor]) => (
                  <div key={nome}>
                    <label className={`block text-sm font-medium mb-2 capitalize ${temaId === 'elegante' ? 'text-gray-700' : 'text-white/70'}`}>
                      {nome}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cor}
                        onChange={(e) => handleInputChange(`cores.${nome}`, e.target.value)}
                        className="w-12 h-10 rounded border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={cor}
                        onChange={(e) => handleInputChange(`cores.${nome}`, e.target.value)}
                        className={`flex-1 px-2 py-2 text-xs border rounded ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900'
                            : 'border-white/20 bg-white/5 text-white'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfiguracaoEmpresaPage; 