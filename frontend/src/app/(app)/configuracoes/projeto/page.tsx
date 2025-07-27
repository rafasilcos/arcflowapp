'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  ArrowLeft, 
  Save, 
  RefreshCw,
  Plus,
  Trash2,
  FileText,
  Settings,
  CheckSquare,
  Package,
  Palette,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit3
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../../../../contexts/ThemeContext';
import useConfiguracaoStore from '../../../../stores/configuracaoStore';

const ConfiguracaoProjetoPage: React.FC = () => {
  const { temaId } = useTheme();
  const { configuracoes, atualizarProjeto } = useConfiguracaoStore();
  
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [abaSelecionada, setAbaSelecionada] = useState<'templates' | 'padroes' | 'qualidade' | 'entregaveis'>('templates');

  const [formData, setFormData] = useState(configuracoes.projeto);

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

  const salvarConfiguracoes = async () => {
    setSalvando(true);
    setErros([]);
    
    try {
      await atualizarProjeto(formData);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (error) {
      setErros(['Erro ao salvar configurações de projeto']);
    } finally {
      setSalvando(false);
    }
  };

  const abas = [
    { key: 'templates', label: 'Templates', icon: FileText, cor: 'blue' },
    { key: 'padroes', label: 'Padrões', icon: Palette, cor: 'green' },
    { key: 'qualidade', label: 'Qualidade', icon: CheckSquare, cor: 'purple' },
    { key: 'entregaveis', label: 'Entregáveis', icon: Package, cor: 'orange' }
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
              ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white shadow-lg'
          }`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Configurações de Projeto
            </h1>
            <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              Configure templates, padrões técnicos e qualidade
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
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
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
                      ? 'bg-indigo-100 text-indigo-700 shadow-md'
                      : 'bg-indigo-500/20 text-indigo-300 shadow-md'
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
        {/* ABA TEMPLATES */}
        {abaSelecionada === 'templates' && (
          <div className="space-y-8">
            <div>
              <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Gerenciamento de Templates
              </h2>
              <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                Configure templates de briefing, contratos e propostas
              </p>
            </div>

            {/* Templates de Briefing */}
            <div className={`p-6 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-blue-200 bg-blue-50'
                : 'border-blue-500/20 bg-blue-500/5'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    temaId === 'elegante' ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-blue-900' : 'text-blue-300'}`}>
                      Templates de Briefing
                    </h3>
                    <p className={`text-sm ${temaId === 'elegante' ? 'text-blue-700' : 'text-blue-400'}`}>
                      Questionários personalizados para coleta de requisitos
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      temaId === 'elegante'
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                    }`}
                  >
                    <Copy className="w-4 h-4 inline mr-2" />
                    Importar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      temaId === 'elegante'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Novo Template
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Residencial Padrão', 'Comercial Completo', 'Paisagismo Avançado'].map((template, index) => (
                  <motion.div
                    key={template}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      temaId === 'elegante'
                        ? 'border-blue-200 bg-white hover:shadow-md'
                        : 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-semibold ${temaId === 'elegante' ? 'text-blue-900' : 'text-blue-300'}`}>
                          {template}
                        </h4>
                        <p className={`text-sm ${temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'}`}>
                          15 perguntas • Ativo
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          temaId === 'elegante'
                            ? 'hover:bg-blue-100 text-blue-600'
                            : 'hover:bg-blue-500/20 text-blue-400'
                        }`}>
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          temaId === 'elegante'
                            ? 'hover:bg-blue-100 text-blue-600'
                            : 'hover:bg-blue-500/20 text-blue-400'
                        }`}>
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      temaId === 'elegante'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      ✓ Template Ativo
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Templates de Contrato */}
            <div className={`p-6 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-green-200 bg-green-50'
                : 'border-green-500/20 bg-green-500/5'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    temaId === 'elegante' ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-green-900' : 'text-green-300'}`}>
                      Templates de Contrato
                    </h3>
                    <p className={`text-sm ${temaId === 'elegante' ? 'text-green-700' : 'text-green-400'}`}>
                      Modelos de contrato para diferentes tipos de projeto
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    temaId === 'elegante'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Novo Template
                </motion.button>
              </div>

              <div className={`text-center py-8 ${
                temaId === 'elegante' ? 'text-green-600' : 'text-green-400'
              }`}>
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum template configurado</h3>
                <p className="text-sm mb-4">Crie templates de contrato personalizados para agilizar seus processos.</p>
                <button className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}>
                  <Plus className="w-4 h-4 inline mr-2" />
                  Criar Primeiro Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA PADRÕES */}
        {abaSelecionada === 'padroes' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Padrões Técnicos
              </h2>
              <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                Configure padrões de desenho, nomenclatura e exportação
              </p>
            </div>

            {/* Padrões de Desenho */}
            <div className={`p-6 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-gray-200 bg-gray-50'
                : 'border-white/10 bg-white/5'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                <Palette className="w-5 h-5" />
                Padrões de Desenho
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Escalas Preferidas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['1:100', '1:50', '1:25', '1:20', '1:10', '1:5'].map(escala => (
                      <label key={escala} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={formData.padroesDesenho.escalasPreferidas.includes(escala)}
                          onChange={(e) => {
                            const novasEscalas = e.target.checked
                              ? [...formData.padroesDesenho.escalasPreferidas, escala]
                              : formData.padroesDesenho.escalasPreferidas.filter(e => e !== escala);
                            handleInputChange('padroesDesenho.escalasPreferidas', novasEscalas);
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {escala}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Formatos de Papel
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['A0', 'A1', 'A2', 'A3', 'A4'].map(formato => (
                      <label key={formato} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={formData.padroesDesenho.formatosPapel.includes(formato)}
                          onChange={(e) => {
                            const novosFormatos = e.target.checked
                              ? [...formData.padroesDesenho.formatosPapel, formato]
                              : formData.padroesDesenho.formatosPapel.filter(f => f !== formato);
                            handleInputChange('padroesDesenho.formatosPapel', novosFormatos);
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {formato}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nomenclatura de Arquivos */}
            <div className={`p-6 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-gray-200 bg-gray-50'
                : 'border-white/10 bg-white/5'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                <FileText className="w-5 h-5" />
                Nomenclatura de Arquivos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Prefixo do Projeto
                  </label>
                  <input
                    type="text"
                    value={formData.nomenclaturaArquivos.prefixoProjeto}
                    onChange={(e) => handleInputChange('nomenclaturaArquivos.prefixoProjeto', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                    placeholder="Ex: PROJ"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Sufixo da Versão
                  </label>
                  <input
                    type="text"
                    value={formData.nomenclaturaArquivos.sufixoVersao}
                    onChange={(e) => handleInputChange('nomenclaturaArquivos.sufixoVersao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                    placeholder="Ex: v"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Separador de Elementos
                  </label>
                  <select
                    value={formData.nomenclaturaArquivos.separadorElementos}
                    onChange={(e) => handleInputChange('nomenclaturaArquivos.separadorElementos', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                  >
                    <option value="_">Underscore (_)</option>
                    <option value="-">Hífen (-)</option>
                    <option value=".">Ponto (.)</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Formato da Data
                  </label>
                  <select
                    value={formData.nomenclaturaArquivos.formatoData}
                    onChange={(e) => handleInputChange('nomenclaturaArquivos.formatoData', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                        : 'border-white/20 bg-white/5 text-white focus:border-white/30'
                    }`}
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                  </select>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${
                temaId === 'elegante' ? 'bg-green-100 border border-green-200' : 'bg-green-500/10 border border-green-500/20'
              }`}>
                <h4 className={`font-semibold mb-2 ${temaId === 'elegante' ? 'text-green-800' : 'text-green-400'}`}>
                  Prévia da Nomenclatura:
                </h4>
                <p className={`font-mono text-sm ${temaId === 'elegante' ? 'text-green-700' : 'text-green-300'}`}>
                  {formData.nomenclaturaArquivos.prefixoProjeto}
                  {formData.nomenclaturaArquivos.separadorElementos}001
                  {formData.nomenclaturaArquivos.separadorElementos}CASA-SILVA
                  {formData.nomenclaturaArquivos.separadorElementos}{formData.nomenclaturaArquivos.sufixoVersao}01
                  {formData.nomenclaturaArquivos.separadorElementos}2025-01-17.dwg
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Outras abas em desenvolvimento */}
        {!['templates', 'padroes'].includes(abaSelecionada) && (
          <div className={`text-center py-12 ${
            temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
          }`}>
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Em desenvolvimento</h3>
            <p>Esta seção será implementada em breve.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfiguracaoProjetoPage; 