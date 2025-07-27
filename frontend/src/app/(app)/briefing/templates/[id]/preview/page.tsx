'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Eye, 
  FileText, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Copy,
  Play,
  Settings,
  Home,
  Building,
  Factory,
  Hospital
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { listarBriefingsDisponiveis } from '@/data/briefings';
import { BriefingCompleto, Pergunta } from '@/types/briefing';
import Link from 'next/link';

export default function PreviewTemplatePage() {
  const { tema, temaId } = useTheme();
  const params = useParams();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<BriefingCompleto | null>(null);
  const [secaoAtual, setSecaoAtual] = useState(0);
  const [modoVisualizacao, setModoVisualizacao] = useState<'estrutura' | 'simulacao'>('estrutura');
  const [respostasSimulacao, setRespostasSimulacao] = useState<Record<string, any>>({});

  // Carregar template
  useEffect(() => {
    const carregarTemplate = () => {
      // Primeiro tentar templates personalizados
      const templatesPersonalizados = localStorage.getItem('templates-personalizados');
      if (templatesPersonalizados) {
        try {
          const templates = JSON.parse(templatesPersonalizados);
          const templateEncontrado = templates.find((t: any) => t.id === templateId);
          if (templateEncontrado) {
            setTemplate(templateEncontrado);
            return;
          }
        } catch (error) {
          console.error('Erro ao carregar templates personalizados:', error);
        }
      }

      // Se não encontrou, tentar templates base
      const templatesBase = listarBriefingsDisponiveis();
      const templateBase = templatesBase.find(t => t.chave === templateId);
      if (templateBase) {
        // Converter para formato BriefingCompleto
        const templateConvertido: BriefingCompleto = {
          id: templateBase.chave,
          nome: templateBase.nome,
          descricao: 'Template padrão do sistema',
          tipologia: templateBase.tipologia,
          subtipo: templateBase.subtipo,
          padrao: templateBase.padrao,
          totalPerguntas: templateBase.totalPerguntas,
          tempoEstimado: templateBase.tempoEstimado,
          versao: '1.0',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
          secoes: []
        };
        setTemplate(templateConvertido);
      }
    };

    if (templateId) {
      carregarTemplate();
    }
  }, [templateId]);

  const obterIconeCategoria = (categoria: string) => {
    switch (categoria?.toLowerCase()) {
      case 'residencial': return Home;
      case 'comercial': return Building;
      case 'industrial': return Factory;
      case 'institucional': return Hospital;
      default: return FileText;
    }
  };

  const obterCorCategoria = (categoria: string) => {
    switch (categoria?.toLowerCase()) {
      case 'residencial': return 'from-green-500 to-emerald-500';
      case 'comercial': return 'from-blue-500 to-cyan-500';
      case 'industrial': return 'from-orange-500 to-red-500';
      case 'institucional': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const renderizarCampoPreview = (pergunta: Pergunta) => {
    const valor = respostasSimulacao[pergunta.id.toString()] || '';
    
    const baseClasses = `w-full px-4 py-3 border rounded-lg transition-all text-base ${
      temaId === 'elegante'
        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
    }`;

    const handleChange = (novoValor: any) => {
      setRespostasSimulacao(prev => ({
        ...prev,
        [pergunta.id.toString()]: novoValor
      }));
    };

    switch (pergunta.tipo) {
      case 'text':
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            className={baseClasses}
          />
        );

      case 'textarea':
      case 'texto_longo':
        return (
          <textarea
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            rows={4}
            className={`${baseClasses} resize-none`}
          />
        );

      case 'numero':
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            className={baseClasses}
          />
        );

      case 'data':
        return (
          <input
            type="date"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            className={baseClasses}
          />
        );

      case 'moeda':
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder || 'R$ 0,00'}
            className={baseClasses}
          />
        );

      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            className={baseClasses}
          >
            <option value="">Selecione uma opção...</option>
            {pergunta.opcoes?.map((opcao, index) => (
              <option key={index} value={opcao} className="text-gray-900">
                {opcao}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {pergunta.opcoes?.map((opcao, index) => (
              <label key={index} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all ${
                temaId === 'elegante'
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'bg-white/5 hover:bg-white/10'
              }`}>
                <input
                  type="radio"
                  name={`pergunta-${pergunta.id.toString()}`}
                  value={opcao}
                  checked={valor === opcao}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className={`${tema.text} font-medium`}>
                  {opcao}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {pergunta.opcoes?.map((opcao, index) => (
              <label key={index} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all ${
                temaId === 'elegante'
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'bg-white/5 hover:bg-white/10'
              }`}>
                <input
                  type="checkbox"
                  checked={Array.isArray(valor) ? valor.includes(opcao) : false}
                  onChange={(e) => {
                    const valorAtual = Array.isArray(valor) ? valor : [];
                    if (e.target.checked) {
                      handleChange([...valorAtual, opcao]);
                    } else {
                      handleChange(valorAtual.filter((v: string) => v !== opcao));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className={`${tema.text} font-medium`}>
                  {opcao}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={pergunta.placeholder}
            className={baseClasses}
          />
        );
    }
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-center ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
          <FileText className="w-16 h-16 mx-auto mb-4" />
          <p>Carregando template...</p>
        </div>
      </div>
    );
  }

  const IconeCategoria = obterIconeCategoria(template.tipologia || '');
  const totalPerguntas = template.secoes.reduce((total, secao) => total + secao.perguntas.length, 0);
  const perguntasObrigatorias = template.secoes.reduce((total, secao) => 
    total + secao.perguntas.filter(p => p.obrigatoria).length, 0
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        temaId === 'elegante' 
          ? 'bg-white border-gray-200' 
          : 'bg-slate-800/50 border-white/10'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link
              href="/briefing/templates"
              className={`p-2 rounded-lg transition-all ${
                temaId === 'elegante'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white/60 hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className={`w-12 h-12 bg-gradient-to-r ${obterCorCategoria(template.tipologia || '')} rounded-xl flex items-center justify-center`}>
              <IconeCategoria className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                👁️ Preview: {template.nome}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                  {template.secoes.length} seções • {totalPerguntas} perguntas • {perguntasObrigatorias} obrigatórias
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {template.tipologia?.charAt(0).toUpperCase() + template.tipologia?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModoVisualizacao(modoVisualizacao === 'estrutura' ? 'simulacao' : 'estrutura')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                temaId === 'elegante'
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              {modoVisualizacao === 'estrutura' ? 'Simular Preenchimento' : 'Ver Estrutura'}
            </button>

            <Link
              href={`/briefing/templates/${template.id}/editar`}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar</span>
            </Link>

            <Link
              href={`/briefing/novo?template=${template.id}`}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Usar Template</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {modoVisualizacao === 'estrutura' ? (
          /* Modo Estrutura */
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className={`backdrop-blur-sm rounded-2xl p-6 border ${
              temaId === 'elegante'
                ? 'bg-white border-gray-200 shadow-sm'
                : 'bg-white/5 border-white/10'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                📊 Informações Gerais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`text-center p-4 rounded-lg ${
                  temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                }`}>
                  <div className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    {template.secoes.length}
                  </div>
                  <div className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    Seções
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${
                  temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                }`}>
                  <div className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    {totalPerguntas}
                  </div>
                  <div className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    Total Perguntas
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${
                  temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                }`}>
                  <div className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    {perguntasObrigatorias}
                  </div>
                  <div className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    Obrigatórias
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${
                  temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                }`}>
                  <div className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    {template.tempoEstimado}
                  </div>
                  <div className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    Tempo Estimado
                  </div>
                </div>
              </div>

              {template.descricao && (
                <div className="mt-6">
                  <h3 className={`font-medium mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Descrição
                  </h3>
                  <p className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    {template.descricao}
                  </p>
                </div>
              )}
            </div>

            {/* Lista de Seções */}
            <div className="space-y-4">
              {template.secoes.map((secao, index) => (
                <motion.div
                  key={secao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`backdrop-blur-sm rounded-2xl p-6 border ${
                    temaId === 'elegante'
                      ? 'bg-white border-gray-200 shadow-sm'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        secao.obrigatoria
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {secao.nome}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                            {secao.perguntas.length} perguntas
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            secao.obrigatoria
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {secao.obrigatoria ? 'Obrigatória' : 'Opcional'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSecaoAtual(index);
                        setModoVisualizacao('simulacao');
                      }}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        temaId === 'elegante'
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-white/20 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      Ver Perguntas
                    </button>
                  </div>

                  {secao.descricao && (
                    <p className={`text-sm mb-4 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                      {secao.descricao}
                    </p>
                  )}

                  {/* Preview das primeiras 3 perguntas */}
                  <div className="space-y-3">
                    {secao.perguntas.slice(0, 3).map((pergunta, perguntaIndex) => (
                      <div
                        key={pergunta.id}
                        className={`p-3 rounded-lg border ${
                          temaId === 'elegante'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-medium ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                            {perguntaIndex + 1}.
                          </span>
                          {pergunta.obrigatoria && (
                            <span className="text-xs px-1 py-0.5 rounded bg-red-100 text-red-700">
                              *
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            {pergunta.tipo}
                          </span>
                        </div>
                        <p className={`text-sm ${temaId === 'elegante' ? 'text-gray-800' : 'text-white/90'}`}>
                          {pergunta.pergunta}
                        </p>
                      </div>
                    ))}
                    
                    {secao.perguntas.length > 3 && (
                      <div className={`text-center py-2 text-sm ${temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}`}>
                        ... e mais {secao.perguntas.length - 3} perguntas
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Modo Simulação */
          <div className="space-y-6">
            {/* Navegação de Seções */}
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {template.secoes.map((secao, index) => (
                <button
                  key={secao.id}
                  onClick={() => setSecaoAtual(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${
                    index === secaoAtual
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent'
                      : temaId === 'elegante'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{secao.nome}</span>
                  <span className="ml-2 text-xs opacity-75">({secao.perguntas.length})</span>
                </button>
              ))}
            </div>

            {/* Seção Atual */}
            {template.secoes[secaoAtual] && (
              <div className={`backdrop-blur-sm rounded-2xl p-6 border ${
                temaId === 'elegante'
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-lg font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                      {template.secoes[secaoAtual].nome}
                    </h2>
                    <p className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                      Simulação de preenchimento • {template.secoes[secaoAtual].perguntas.length} perguntas
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {secaoAtual > 0 && (
                      <button
                        onClick={() => setSecaoAtual(secaoAtual - 1)}
                        className={`p-2 rounded-lg border transition-all ${
                          temaId === 'elegante'
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    
                    {secaoAtual < template.secoes.length - 1 && (
                      <button
                        onClick={() => setSecaoAtual(secaoAtual + 1)}
                        className={`p-2 rounded-lg border transition-all ${
                          temaId === 'elegante'
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de Perguntas */}
                <div className="space-y-6">
                  {template.secoes[secaoAtual].perguntas.map((pergunta, index) => (
                    <motion.div
                      key={pergunta.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <label className={`font-medium ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {index + 1}. {pergunta.pergunta}
                        </label>
                        {pergunta.obrigatoria && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                          {pergunta.tipo}
                        </span>
                      </div>
                      
                      {renderizarCampoPreview(pergunta)}
                    </motion.div>
                  ))}

                  {template.secoes[secaoAtual].perguntas.length === 0 && (
                    <div className={`text-center py-8 ${
                      temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                    }`}>
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma pergunta nesta seção</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 