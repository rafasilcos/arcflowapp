'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  GripVertical, 
  Eye, 
  Copy,
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Type,
  Hash,
  Calendar,
  DollarSign,
  List,
  CheckSquare,
  Circle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { listarBriefingsDisponiveis } from '@/data/briefings';
import { BriefingCompleto, Secao, Pergunta } from '@/types/briefing';
import Link from 'next/link';

export default function EditarTemplatePage() {
  const { tema, temaId } = useTheme();
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<BriefingCompleto | null>(null);
  const [secaoAtual, setSecaoAtual] = useState(0);
  const [modoEdicao, setModoEdicao] = useState<'estrutura' | 'perguntas'>('estrutura');
  const [salvando, setSalvando] = useState(false);
  const [ultimoSalvamento, setUltimoSalvamento] = useState<Date | null>(null);
  const [modalNovaSecao, setModalNovaSecao] = useState(false);
  const [modalNovaPergunta, setModalNovaPergunta] = useState(false);
  const [novaSecao, setNovaSecao] = useState({
    nome: '',
    descricao: '',
    obrigatoria: true
  });
  const [novaPergunta, setNovaPergunta] = useState({
    tipo: 'text' as Pergunta['tipo'],
    pergunta: '',
    placeholder: '',
    obrigatoria: true,
    opcoes: [] as string[]
  });

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
        // Converter para template personalizado
        const templatePersonalizado: BriefingCompleto = {
          id: `custom-${Date.now()}`,
          nome: `${templateBase.nome} (Editável)`,
          descricao: 'Template baseado em template padrão',
          tipologia: templateBase.tipologia,
          subtipo: templateBase.subtipo,
          padrao: templateBase.padrao,
          totalPerguntas: templateBase.totalPerguntas,
          tempoEstimado: templateBase.tempoEstimado,
          versao: '1.0',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
          metadata: {
            tags: ['personalizado'],
            categoria: templateBase.tipologia,
            complexidade: 'media' as const,
            publico: ['profissionais']
          },
          secoes: [] // Será preenchido posteriormente
        };
        setTemplate(templatePersonalizado);
      }
    };

    if (templateId) {
      carregarTemplate();
    }
  }, [templateId]);

  const salvarTemplate = async () => {
    if (!template) return;

    setSalvando(true);
    try {
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      const templatesPersonalizados = localStorage.getItem('templates-personalizados');
      let templates = [];
      
      if (templatesPersonalizados) {
        templates = JSON.parse(templatesPersonalizados);
      }

      // Atualizar template existente ou adicionar novo
      const index = templates.findIndex((t: any) => t.id === template.id);
      const templateAtualizado = {
        ...template,
        dataUltimaEdicao: new Date().toISOString(),
        totalPerguntas: template.secoes.reduce((total, secao) => total + (secao.perguntas?.length || 0), 0)
      };

      if (index >= 0) {
        templates[index] = templateAtualizado;
      } else {
        templates.push(templateAtualizado);
      }

      localStorage.setItem('templates-personalizados', JSON.stringify(templates));
      setTemplate(templateAtualizado);
      setUltimoSalvamento(new Date());
    } catch (error) {
      console.error('Erro ao salvar template:', error);
    } finally {
      setSalvando(false);
    }
  };

  const adicionarSecao = () => {
    if (!template || !novaSecao.nome.trim()) return;

    const secao: Secao = {
      id: `secao-${Date.now()}`,
      nome: novaSecao.nome,
      descricao: novaSecao.descricao,
      obrigatoria: novaSecao.obrigatoria,
      perguntas: []
    };

    setTemplate(prev => prev ? {
      ...prev,
      secoes: [...prev.secoes, secao]
    } : null);

    setModalNovaSecao(false);
    setNovaSecao({
      nome: '',
      descricao: '',
      obrigatoria: true
    });
  };

  const removerSecao = (secaoId: string) => {
    if (!template) return;
    if (!confirm('Tem certeza que deseja remover esta seção?')) return;

    setTemplate(prev => prev ? {
      ...prev,
      secoes: prev.secoes.filter(s => s.id !== secaoId)
    } : null);

    // Ajustar seção atual se necessário
    if (secaoAtual >= template.secoes.length - 1) {
      setSecaoAtual(Math.max(0, template.secoes.length - 2));
    }
  };

  const adicionarPergunta = () => {
    if (!template || !novaPergunta.pergunta.trim()) return;

    const pergunta: Pergunta = {
      id: Date.now(),
      tipo: novaPergunta.tipo,
      pergunta: novaPergunta.pergunta,
      placeholder: novaPergunta.placeholder,
      obrigatoria: novaPergunta.obrigatoria,
      opcoes: novaPergunta.opcoes.length > 0 ? novaPergunta.opcoes : undefined
    };

    const secaoAtualizada = { ...template.secoes[secaoAtual] };
    secaoAtualizada.perguntas = [...(secaoAtualizada.perguntas || []), pergunta];

    const secoesAtualizadas = [...template.secoes];
    secoesAtualizadas[secaoAtual] = secaoAtualizada;

    setTemplate(prev => prev ? {
      ...prev,
      secoes: secoesAtualizadas
    } : null);

    setModalNovaPergunta(false);
    setNovaPergunta({
      tipo: 'text',
      pergunta: '',
      placeholder: '',
      obrigatoria: true,
      opcoes: []
    });
  };

  const removerPergunta = (perguntaId: string | number) => {
    if (!template) return;
    if (!confirm('Tem certeza que deseja remover esta pergunta?')) return;

    const secaoAtualizada = { ...template.secoes[secaoAtual] };
    secaoAtualizada.perguntas = (secaoAtualizada.perguntas || []).filter(p => p.id !== perguntaId);

    const secoesAtualizadas = [...template.secoes];
    secoesAtualizadas[secaoAtual] = secaoAtualizada;

    setTemplate(prev => prev ? {
      ...prev,
      secoes: secoesAtualizadas
    } : null);
  };

  const obterIconeTipo = (tipo: Pergunta['tipo']) => {
    switch (tipo) {
      case 'text': return Type;
      case 'textarea': return FileText;
      case 'numero': return Hash;
      case 'data': return Calendar;
      case 'moeda': return DollarSign;
      case 'select': return List;
      case 'radio': return Circle;
      case 'checkbox': return CheckSquare;
      default: return Type;
    }
  };

  const tiposPergunta = [
    { value: 'text', label: 'Texto Simples', icon: Type },
    { value: 'textarea', label: 'Texto Longo', icon: FileText },
    { value: 'numero', label: 'Número', icon: Hash },
    { value: 'data', label: 'Data', icon: Calendar },
    { value: 'moeda', label: 'Valor Monetário', icon: DollarSign },
    { value: 'select', label: 'Lista Suspensa', icon: List },
    { value: 'radio', label: 'Opção Única', icon: Circle },
    { value: 'checkbox', label: 'Múltipla Escolha', icon: CheckSquare }
  ];

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
            <div>
              <h1 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                ✏️ Editando: {template.nome}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                  {template.secoes.length} seções • {template.secoes.reduce((total, secao) => total + secao.perguntas.length, 0)} perguntas
                </span>
                {ultimoSalvamento && (
                  <span className={`text-xs flex items-center ${temaId === 'elegante' ? 'text-green-600' : 'text-green-400'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Salvo {ultimoSalvamento.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModoEdicao(modoEdicao === 'estrutura' ? 'perguntas' : 'estrutura')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                temaId === 'elegante'
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              {modoEdicao === 'estrutura' ? 'Ver Perguntas' : 'Ver Estrutura'}
            </button>

            <button
              onClick={salvarTemplate}
              disabled={salvando}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{salvando ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {modoEdicao === 'estrutura' ? (
          /* Modo Estrutura */
          <div className="space-y-6">
            {/* Header das Seções */}
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                Estrutura do Template
              </h2>
              <button
                onClick={() => setModalNovaSecao(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Seção</span>
              </button>
            </div>

            {/* Lista de Seções */}
            <div className="space-y-4">
              {template.secoes.map((secao, index) => (
                <motion.div
                  key={secao.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`backdrop-blur-sm rounded-2xl p-6 border transition-all ${
                    temaId === 'elegante'
                      ? 'bg-white border-gray-200 shadow-sm'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        secao.obrigatoria
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {secao.nome}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                            {secao.perguntas?.length || 0} perguntas
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

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSecaoAtual(index);
                          setModoEdicao('perguntas');
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          temaId === 'elegante'
                            ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            : 'text-white/40 hover:text-blue-400 hover:bg-white/10'
                        }`}
                        title="Editar perguntas"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removerSecao(secao.id)}
                        className={`p-2 rounded-lg transition-all ${
                          temaId === 'elegante'
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-white/40 hover:text-red-400 hover:bg-white/10'
                        }`}
                        title="Remover seção"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {secao.descricao && (
                    <p className={`mt-3 text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                      {secao.descricao}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Modo Perguntas */
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
                  <span className="ml-2 text-xs opacity-75">({secao.perguntas?.length || 0})</span>
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
                      {template.secoes[secaoAtual]?.perguntas?.length || 0} perguntas nesta seção
                    </p>
                  </div>
                  <button
                    onClick={() => setModalNovaPergunta(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Pergunta</span>
                  </button>
                </div>

                {/* Lista de Perguntas */}
                <div className="space-y-4">
                  {(template.secoes[secaoAtual]?.perguntas || []).map((pergunta, index) => {
                    const IconeTipo = obterIconeTipo(pergunta.tipo);
                    
                    return (
                      <motion.div
                        key={pergunta.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border transition-all ${
                          temaId === 'elegante'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              pergunta.obrigatoria
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <IconeTipo className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-sm font-medium ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                                  Pergunta {index + 1}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  pergunta.obrigatoria
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {pergunta.obrigatoria ? 'Obrigatória' : 'Opcional'}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                  {tiposPergunta.find(t => t.value === pergunta.tipo)?.label}
                                </span>
                              </div>
                              <p className={`text-sm mb-2 ${temaId === 'elegante' ? 'text-gray-800' : 'text-white/90'}`}>
                                {pergunta.pergunta}
                              </p>
                              {pergunta.placeholder && (
                                <p className={`text-xs ${temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}`}>
                                  Placeholder: {pergunta.placeholder}
                                </p>
                              )}
                              {pergunta.opcoes && pergunta.opcoes.length > 0 && (
                                <div className="mt-2">
                                  <p className={`text-xs font-medium mb-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                                    Opções:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {pergunta.opcoes.map((opcao, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
                                      >
                                        {opcao}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removerPergunta(pergunta.id)}
                              className={`p-2 rounded-lg transition-all ${
                                temaId === 'elegante'
                                  ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                  : 'text-white/40 hover:text-red-400 hover:bg-white/10'
                              }`}
                              title="Remover pergunta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {(template.secoes[secaoAtual]?.perguntas?.length || 0) === 0 && (
                    <div className={`text-center py-8 ${
                      temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                    }`}>
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma pergunta nesta seção</p>
                      <p className="text-sm">Clique em "Nova Pergunta" para adicionar</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Nova Seção */}
      <AnimatePresence>
        {modalNovaSecao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalNovaSecao(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl p-6 ${
                temaId === 'elegante'
                  ? 'bg-white border border-gray-200'
                  : 'bg-gray-800 border border-gray-600'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  ➕ Nova Seção
                </h2>
                <button
                  onClick={() => setModalNovaSecao(false)}
                  className={`p-2 rounded-lg transition-all ${
                    temaId === 'elegante'
                      ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Nome da Seção *
                  </label>
                  <input
                    type="text"
                    value={novaSecao.nome}
                    onChange={(e) => setNovaSecao(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Dados do Cliente"
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Descrição
                  </label>
                  <textarea
                    value={novaSecao.descricao}
                    onChange={(e) => setNovaSecao(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o propósito desta seção..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    }`}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="obrigatoria-secao"
                    checked={novaSecao.obrigatoria}
                    onChange={(e) => setNovaSecao(prev => ({ ...prev, obrigatoria: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="obrigatoria-secao" className={`text-sm ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Seção obrigatória
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setModalNovaSecao(false)}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    temaId === 'elegante'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarSecao}
                  disabled={!novaSecao.nome.trim()}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Seção
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nova Pergunta */}
      <AnimatePresence>
        {modalNovaPergunta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalNovaPergunta(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${
                temaId === 'elegante'
                  ? 'bg-white border border-gray-200'
                  : 'bg-gray-800 border border-gray-600'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  ❓ Nova Pergunta
                </h2>
                <button
                  onClick={() => setModalNovaPergunta(false)}
                  className={`p-2 rounded-lg transition-all ${
                    temaId === 'elegante'
                      ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Tipo de Pergunta */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Tipo de Pergunta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {tiposPergunta.map((tipo) => {
                      const IconeTipo = tipo.icon;
                      return (
                        <button
                          key={tipo.value}
                          onClick={() => setNovaPergunta(prev => ({ ...prev, tipo: tipo.value as Pergunta['tipo'] }))}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            novaPergunta.tipo === tipo.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : temaId === 'elegante'
                                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'border-white/20 text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconeTipo className="w-5 h-5" />
                            <div>
                              <div className="font-medium text-sm">{tipo.label}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pergunta */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Pergunta *
                  </label>
                  <textarea
                    value={novaPergunta.pergunta}
                    onChange={(e) => setNovaPergunta(prev => ({ ...prev, pergunta: e.target.value }))}
                    placeholder="Digite a pergunta que será feita ao usuário..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    }`}
                  />
                </div>

                {/* Placeholder */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Placeholder (opcional)
                  </label>
                  <input
                    type="text"
                    value={novaPergunta.placeholder}
                    onChange={(e) => setNovaPergunta(prev => ({ ...prev, placeholder: e.target.value }))}
                    placeholder="Texto de exemplo que aparece no campo..."
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    }`}
                  />
                </div>

                {/* Opções (para select, radio, checkbox) */}
                {['select', 'radio', 'checkbox'].includes(novaPergunta.tipo) && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                    }`}>
                      Opções (uma por linha)
                    </label>
                    <textarea
                      value={novaPergunta.opcoes.join('\n')}
                      onChange={(e) => setNovaPergunta(prev => ({ 
                        ...prev, 
                        opcoes: e.target.value.split('\n').filter(o => o.trim()) 
                      }))}
                      placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                        temaId === 'elegante'
                          ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                      }`}
                    />
                  </div>
                )}

                {/* Obrigatória */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="obrigatoria-pergunta"
                    checked={novaPergunta.obrigatoria}
                    onChange={(e) => setNovaPergunta(prev => ({ ...prev, obrigatoria: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="obrigatoria-pergunta" className={`text-sm ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Pergunta obrigatória
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setModalNovaPergunta(false)}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    temaId === 'elegante'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarPergunta}
                  disabled={!novaPergunta.pergunta.trim()}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Pergunta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 