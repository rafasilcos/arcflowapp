'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Edit3, 
  Trash2, 
  Eye, 
  Star, 
  Clock, 
  FileText,
  Home,
  Building,
  Factory,
  Hospital,
  ChevronDown,
  Save,
  X,
  Check,
  AlertCircle,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { listarBriefingsDisponiveis } from '@/data/briefings';
import { BriefingCompleto } from '@/types/briefing';
import Link from 'next/link';

// Tipo para templates padrão retornados por listarBriefingsDisponiveis
interface TemplatePadrao {
  chave: string;
  area: string;
  tipologia: string;
  subtipo: string;
  padrao: string;
  nome: string;
  totalPerguntas: number;
  tempoEstimado: string;
}

// Tipo union para todos os templates
type TemplateBase = TemplatePadrao | TemplatePersonalizado;

interface TemplatePersonalizado extends BriefingCompleto {
  criadoPor: string;
  dataUltimaEdicao: string;
  vezesUsado: number;
  baseadoEm?: string;
  publico: boolean;
  favorito: boolean;
}

export default function TemplatesBriefingPage() {
  const { tema, temaId } = useTheme();
  const [templatesPersonalizados, setTemplatesPersonalizados] = useState<TemplatePersonalizado[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos'); // padroes, personalizados, todos
  const [modoVisualizacao, setModoVisualizacao] = useState<'grid' | 'lista'>('grid');
  const [templateSelecionado, setTemplateSelecionado] = useState<string | null>(null);
  const [modalNovoTemplate, setModalNovoTemplate] = useState(false);
  const [novoTemplate, setNovoTemplate] = useState({
    nome: '',
    descricao: '',
    categoria: 'residencial',
    baseadoEm: '',
    publico: false
  });

  // Carregar templates padrão
  const templatesBase = listarBriefingsDisponiveis();

  // Carregar templates personalizados do localStorage
  useEffect(() => {
    const templatesSalvos = localStorage.getItem('templates-personalizados');
    if (templatesSalvos) {
      try {
        const templates = JSON.parse(templatesSalvos);
        setTemplatesPersonalizados(templates);
      } catch (error) {
        console.error('Erro ao carregar templates personalizados:', error);
      }
    }
  }, []);

  const salvarTemplatesPersonalizados = (templates: TemplatePersonalizado[]) => {
    localStorage.setItem('templates-personalizados', JSON.stringify(templates));
    setTemplatesPersonalizados(templates);
  };

  const criarNovoTemplate = async () => {
    if (!novoTemplate.nome.trim()) return;

    let novoTemplateObj: TemplatePersonalizado;
    const novoId = `custom-${Date.now()}`;

    if (novoTemplate.baseadoEm) {
      // Baseado em template existente - CARREGAR TEMPLATE COMPLETO
      const templateBaseMeta = templatesBase.find(t => t.chave === novoTemplate.baseadoEm);
      if (!templateBaseMeta) return;

      try {
        console.log('🔍 Template base encontrado:', templateBaseMeta);
        
        // Carregar template completo baseado na chave
        let templateCompleto = null;
        
        console.log('📦 Carregando template para chave:', templateBaseMeta.chave);
        
        if (templateBaseMeta.chave === 'arquitetura-residencial-casa-simples') {
          console.log('📦 Importando casa-simples...');
          const { BRIEFING_RESIDENCIAL_UNIFAMILIAR } = await import('../../../../data/briefings-aprovados/residencial/unifamiliar');
          templateCompleto = BRIEFING_RESIDENCIAL_UNIFAMILIAR;
        } else if (templateBaseMeta.chave === 'arquitetura-residencial-casa-medio') {
          console.log('📦 Importando casa-medio...');
          const { BRIEFING_RESIDENCIAL_MULTIFAMILIAR } = await import('../../../../data/briefings-aprovados/residencial/multifamiliar');
          templateCompleto = BRIEFING_RESIDENCIAL_MULTIFAMILIAR;
        } else if (templateBaseMeta.chave === 'arquitetura-comercial-escritorio-unico') {
          console.log('📦 Importando escritorio...');
          const { BRIEFING_COMERCIAL_ESCRITORIOS } = await import('../../../../data/briefings-aprovados/comercial/escritorios');
          templateCompleto = BRIEFING_COMERCIAL_ESCRITORIOS;
        } else {
          console.error('❌ Chave de template não reconhecida:', templateBaseMeta.chave);
          alert('Template não suportado: ' + templateBaseMeta.chave);
          return;
        }
        
        console.log('📋 Template carregado:', templateCompleto);
        console.log('📊 Perguntas encontradas:', templateCompleto?.perguntas?.length || 0);
        
        if (!templateCompleto) {
          console.error('❌ Erro ao carregar template completo - função retornou null/undefined');
          alert('Erro ao carregar template base. A função retornou vazio.');
          return;
        }
        
        if (!templateCompleto.perguntas || templateCompleto.perguntas.length === 0) {
          console.error('❌ Template carregado mas sem perguntas');
          alert('Template carregado mas não contém perguntas.');
          return;
        }

        // Criar estrutura de seções a partir das perguntas
        const secoesMap = new Map();
        templateCompleto.perguntas?.forEach((pergunta: any) => {
          if (!secoesMap.has(pergunta.secao)) {
            secoesMap.set(pergunta.secao, {
              id: pergunta.secao.replace(/\s+/g, '_').toUpperCase(),
              nome: pergunta.secao, // ✅ CORRIGIDO: 'nome' em vez de 'titulo'
              descricao: `Seção ${pergunta.secao}`,
              ordem: secoesMap.size + 1,
              perguntas: []
            });
          }
          
          // ✅ CONVERSÃO CORRETA: Mapear estrutura do template para InterfacePerguntas
          const perguntaConvertida = {
            ...pergunta,
            pergunta: pergunta.texto, // ✅ CRÍTICO: Mapear 'texto' para 'pergunta'
            descricao: pergunta.ajuda, // ✅ Mapear 'ajuda' para 'descricao'
            observacoes: pergunta.observacoes || pergunta.dica // ✅ Mapear observações
          };
          
          secoesMap.get(pergunta.secao).perguntas.push(perguntaConvertida);
        });

        const secoes = Array.from(secoesMap.values());

        // ✅ CÁLCULO INTELIGENTE DE METADADOS
        const totalPerguntasReal = secoes.reduce((total, secao) => total + secao.perguntas.length, 0);
        const totalSecoes = secoes.length;
        
        // ✅ ESTIMATIVA INTELIGENTE DE TEMPO - VERSÃO REALISTA
        const calcularTempoEstimado = (totalPerguntas: number, totalSecoes: number) => {
          // Base: 0.8 min por pergunta simples (mais realista)
          let tempoBase = totalPerguntas * 0.8;
          
          // Navegação: 15s por seção (0.25 min)
          const tempoNavegacao = totalSecoes * 0.25;
          
          // Adicionar tempo para perguntas complexas (reduzido)
          let tempoComplexidade = 0;
          secoes.forEach(secao => {
            secao.perguntas?.forEach((pergunta: any) => {
              if (pergunta.tipo === 'texto_longo' || pergunta.tipo === 'textarea') {
                tempoComplexidade += 1; // +1 min para campos longos (reduzido de 1.5)
              } else if (pergunta.tipo === 'multiple' || pergunta.tipo === 'checkbox') {
                tempoComplexidade += 0.3; // +18s para múltipla escolha (reduzido de 30s)
              } else if (pergunta.dependeDe) {
                tempoComplexidade += 0.1; // +6s para campos condicionais (reduzido de 15s)
              }
            });
          });
          
          const tempoTotal = Math.round(tempoBase + tempoNavegacao + tempoComplexidade);
          return Math.max(tempoTotal, 10); // Mínimo 10 minutos
        };
        
        // ✅ DETECTAR COMPLEXIDADE BASEADA NO CONTEÚDO
        const detectarComplexidade = (totalPerguntas: number, totalSecoes: number): 'baixa' | 'media' | 'alta' | 'muito_alta' => {
          if (totalPerguntas <= 30 && totalSecoes <= 3) return 'baixa';
          if (totalPerguntas <= 80 && totalSecoes <= 6) return 'media';
          if (totalPerguntas <= 150 && totalSecoes <= 10) return 'alta';
          return 'muito_alta';
        };
        
        // ✅ DETECTAR DISCIPLINAS BASEADA NAS SEÇÕES
        const detectarDisciplinas = (secoes: any[]): string[] => {
          const disciplinas = new Set<string>();
          secoes.forEach(secao => {
            const nomeSecao = secao.nome.toLowerCase();
            if (nomeSecao.includes('estrutur') || nomeSecao.includes('fundaç')) disciplinas.add('estrutural');
            if (nomeSecao.includes('hidráulic') || nomeSecao.includes('elétric') || nomeSecao.includes('instalaç')) disciplinas.add('instalacoes');
            if (nomeSecao.includes('paisag') || nomeSecao.includes('jardim')) disciplinas.add('paisagismo');
            if (nomeSecao.includes('interior') || nomeSecao.includes('design')) disciplinas.add('design');
            if (nomeSecao.includes('sustentab') || nomeSecao.includes('ambiental')) disciplinas.add('sustentabilidade');
          });
          return disciplinas.size > 0 ? Array.from(disciplinas) : ['arquitetura'];
        };
        
        // ✅ ANÁLISE DE TIPOS DE PERGUNTAS
        const analisarTiposPerguntas = (secoes: any[]) => {
          const tipos: Record<string, number> = {};
          secoes.forEach(secao => {
            secao.perguntas.forEach((pergunta: any) => {
              tipos[pergunta.tipo] = (tipos[pergunta.tipo] || 0) + 1;
            });
          });
          return tipos;
        };
        
        // ✅ CONTAR PERGUNTAS OBRIGATÓRIAS
        const contarPerguntasObrigatorias = (secoes: any[]): number => {
          return secoes.reduce((total, secao) => {
            return total + secao.perguntas.filter((p: any) => p.obrigatoria).length;
          }, 0);
        };
        
        // ✅ CONTAR PERGUNTAS CONDICIONAIS
        const contarPerguntasCondicionais = (secoes: any[]): number => {
          return secoes.reduce((total, secao) => {
            return total + secao.perguntas.filter((p: any) => p.dependeDe).length;
          }, 0);
        };
        
        const tempoEstimadoCalculado = calcularTempoEstimado(totalPerguntasReal, totalSecoes);
        const complexidadeDetectada = detectarComplexidade(totalPerguntasReal, totalSecoes);
        const disciplinasDetectadas = detectarDisciplinas(secoes);

        console.log('📊 METADADOS CALCULADOS:', {
          totalPerguntasOriginal: templateCompleto.perguntas?.length,
          totalPerguntasReal,
          totalSecoes,
          tempoOriginal: templateCompleto.tempoEstimado,
          tempoCalculado: tempoEstimadoCalculado,
          complexidadeDetectada,
          disciplinasDetectadas,
          secoesNomes: secoes.map(s => s.nome)
        });

        novoTemplateObj = {
          id: novoId,
          nome: novoTemplate.nome,
          descricao: novoTemplate.descricao || templateCompleto.nome,
          tipologia: templateBaseMeta.area?.toLowerCase() || 'residencial',
          subtipo: 'personalizado',
          padrao: 'personalizado',
          totalPerguntas: totalPerguntasReal, // ✅ REAL, não estimado
          tempoEstimado: `${tempoEstimadoCalculado} min`, // ✅ CALCULADO INTELIGENTEMENTE
          versao: '1.0',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
          secoes: secoes,
          criadoPor: 'Usuário Atual',
          dataUltimaEdicao: new Date().toISOString(),
          vezesUsado: 0,
          baseadoEm: templateBaseMeta.nome,
          publico: novoTemplate.publico,
          favorito: false,
          metadata: {
            categoria: 'personalizado',
            complexidade: complexidadeDetectada, // ✅ DETECTADA AUTOMATICAMENTE
            tags: ['personalizado', novoTemplate.categoria, 'baseado-em-template', ...disciplinasDetectadas],
            publico: ['arquitetos', 'engenheiros']
          }
        };

      } catch (error) {
        console.error('Erro ao carregar template base:', error);
        return;
      }
    } else {
      // Template do zero
      novoTemplateObj = {
        id: novoId,
        nome: novoTemplate.nome,
        descricao: novoTemplate.descricao,
        tipologia: novoTemplate.categoria,
        subtipo: 'personalizado',
        padrao: 'personalizado',
        totalPerguntas: 0,
        tempoEstimado: '0 min',
        versao: '1.0',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        secoes: [],
        criadoPor: 'Usuário Atual',
        dataUltimaEdicao: new Date().toISOString(),
        vezesUsado: 0,
        publico: novoTemplate.publico,
        favorito: false,
        metadata: {
          categoria: 'personalizado',
          complexidade: 'media',
          tags: ['personalizado', novoTemplate.categoria],
          publico: ['arquitetos', 'engenheiros']
        }
      };
    }

    const novosTemplates = [...templatesPersonalizados, novoTemplateObj];
    salvarTemplatesPersonalizados(novosTemplates);
    
    setModalNovoTemplate(false);
    setNovoTemplate({
      nome: '',
      descricao: '',
      categoria: 'residencial',
      baseadoEm: '',
      publico: false
    });

    // Redirecionar para a página de edição do novo template
    window.location.href = `/briefing/templates/${novoId}/editar`;
  };

  const duplicarTemplate = (template: any) => {
    const isPersonalizado = 'criadoPor' in template;
    
    const templateDuplicado: TemplatePersonalizado = {
      id: `custom-${Date.now()}`,
      nome: `${template.nome} (Cópia)`,
      descricao: isPersonalizado ? template.descricao : `Template baseado em ${template.nome}`,
      tipologia: template.tipologia || 'CASA_UNIFAMILIAR',
      subtipo: template.subtipo || 'SIMPLES',
      padrao: template.padrao || 'PERSONALIZADO',
      versao: '1.0.0',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      secoes: isPersonalizado ? template.secoes : [
        {
          id: 'secao-inicial',
          nome: 'Informações Básicas',
          descricao: 'Seção inicial para começar a personalizar o template',
          obrigatoria: true,
          perguntas: []
        }
      ],
      totalPerguntas: template.totalPerguntas || 0,
      tempoEstimado: template.tempoEstimado || '30 min',
      criadoPor: 'Usuário Atual',
      dataUltimaEdicao: new Date().toISOString(),
      vezesUsado: 0,
      baseadoEm: template.nome,
      publico: false,
      favorito: false,
      metadata: {
        tags: ['personalizado', 'duplicado'],
        complexidade: 'media'
      }
    };

    const novosTemplates = [...templatesPersonalizados, templateDuplicado];
    salvarTemplatesPersonalizados(novosTemplates);
  };

  const excluirTemplate = (templateKey: string) => {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      const novosTemplates = templatesPersonalizados.filter(t => t.id !== templateKey);
      setTemplatesPersonalizados(novosTemplates);
      localStorage.setItem('templates-personalizados', JSON.stringify(novosTemplates));
    }
  };

  const toggleFavorito = (templateId: string) => {
    const novosTemplates = templatesPersonalizados.map(t => 
      t.id === templateId ? { ...t, favorito: !t.favorito } : t
    );
    salvarTemplatesPersonalizados(novosTemplates);
  };

  const obterIconeCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'residencial': return Home;
      case 'comercial': return Building;
      case 'industrial': return Factory;
      case 'institucional': return Hospital;
      default: return FileText;
    }
  };

  const obterCorCategoria = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'residencial': return 'from-green-500 to-emerald-500';
      case 'comercial': return 'from-blue-500 to-cyan-500';
      case 'industrial': return 'from-orange-500 to-red-500';
      case 'institucional': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  // Filtrar templates
  const todosTamplates = [
    ...templatesBase.map(t => ({ ...t, tipo: 'padrao' as const })),
    ...templatesPersonalizados.map(t => ({ ...t, tipo: 'personalizado' as const }))
  ];

  const templatesFiltrados = todosTamplates.filter(template => {
    const isPersonalizado = 'criadoPor' in template;
    const matchBusca = template.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                      (isPersonalizado && (template as TemplatePersonalizado).descricao?.toLowerCase().includes(termoBusca.toLowerCase()));
    
    const matchCategoria = filtroCategoria === 'todos' || 
                          template.tipologia?.toLowerCase() === filtroCategoria;
    
    const matchTipo = filtroTipo === 'todos' || template.tipo === filtroTipo;

    return matchBusca && matchCategoria && matchTipo;
  });

  const categorias = ['todos', 'residencial', 'comercial', 'industrial', 'institucional'];



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
            📋 Templates de Briefing
          </h1>
          <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
            Gerencie templates padrão e personalizados • {templatesBase.length} padrão • {templatesPersonalizados.length} personalizados
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setModalNovoTemplate(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Template</span>
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className={`backdrop-blur-sm rounded-2xl p-6 ${
        temaId === 'elegante'
          ? 'bg-white border border-gray-200 shadow-sm'
          : 'bg-white/5 border border-white/10'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
            }`} />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${
                temaId === 'elegante'
                  ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
              }`}
            />
          </div>

          {/* Filtro Categoria */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              temaId === 'elegante'
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-white/10 border-white/20 text-white focus:border-blue-400'
            }`}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat} className={temaId === 'elegante' ? 'text-gray-900' : 'text-gray-900'}>
                {cat === 'todos' ? 'Todas Categorias' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Filtro Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              temaId === 'elegante'
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-white/10 border-white/20 text-white focus:border-blue-400'
            }`}
          >
            <option key="tipo-todos" value="todos" className={temaId === 'elegante' ? 'text-gray-900' : 'text-gray-900'}>Todos os Tipos</option>
            <option key="tipo-padrao" value="padrao" className={temaId === 'elegante' ? 'text-gray-900' : 'text-gray-900'}>Templates Padrão</option>
            <option key="tipo-personalizado" value="personalizado" className={temaId === 'elegante' ? 'text-gray-900' : 'text-gray-900'}>Personalizados</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20">
          <div className="flex items-center space-x-6">
            <span className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              {templatesFiltrados.length} templates encontrados
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}`}>Visualização:</span>
              <button
                onClick={() => setModoVisualizacao('grid')}
                className={`p-1 rounded ${modoVisualizacao === 'grid' ? 'bg-blue-500 text-white' : temaId === 'elegante' ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white/60'}`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModoVisualizacao('lista')}
                className={`p-1 rounded ${modoVisualizacao === 'lista' ? 'bg-blue-500 text-white' : temaId === 'elegante' ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white/60'}`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Templates */}
      <div className={modoVisualizacao === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        <AnimatePresence>
          {templatesFiltrados.map((template) => {
            const IconeCategoria = obterIconeCategoria(template.tipologia || '');
            const isPersonalizado = 'criadoPor' in template;
            const templateKey = isPersonalizado ? template.id : template.chave;
            
            return (
              <motion.div
                key={templateKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
                  temaId === 'elegante'
                    ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${obterCorCategoria(template.tipologia || '')} rounded-xl flex items-center justify-center`}>
                      <IconeCategoria className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-base ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        {template.nome}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isPersonalizado 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isPersonalizado ? 'Personalizado' : 'Padrão'}
                        </span>
                        {isPersonalizado && template.favorito && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2">
                    {isPersonalizado && (
                      <button
                        onClick={() => toggleFavorito(templateKey)}
                        className={`p-2 rounded-lg transition-all ${
                          template.favorito
                            ? 'text-yellow-500 hover:bg-yellow-50'
                            : temaId === 'elegante'
                              ? 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50'
                              : 'text-white/40 hover:text-yellow-400 hover:bg-white/10'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${template.favorito ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => duplicarTemplate(template)}
                      className={`p-2 rounded-lg transition-all ${
                        temaId === 'elegante'
                          ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                          : 'text-white/40 hover:text-blue-400 hover:bg-white/10'
                      }`}
                      title="Duplicar template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {isPersonalizado && (
                      <>
                        <Link
                          href={`/briefing/templates/${templateKey}/editar`}
                          className={`p-2 rounded-lg transition-all ${
                            temaId === 'elegante'
                              ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              : 'text-white/40 hover:text-green-400 hover:bg-white/10'
                          }`}
                          title="Editar template"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => excluirTemplate(templateKey)}
                          className={`p-2 rounded-lg transition-all ${
                            temaId === 'elegante'
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-white/40 hover:text-red-400 hover:bg-white/10'
                          }`}
                          title="Excluir template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Descrição */}
                {isPersonalizado && template.descricao && (
                  <p className={`text-sm mb-4 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                    {template.descricao}
                  </p>
                )}

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`text-center p-3 rounded-lg ${
                    temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                  }`}>
                    <div className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                      {template.totalPerguntas}
                    </div>
                    <div className={`text-xs ${temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}`}>
                      Perguntas
                    </div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                  }`}>
                    <div className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                      {template.tempoEstimado}
                    </div>
                    <div className={`text-xs ${temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}`}>
                      Tempo
                    </div>
                  </div>
                </div>

                {/* Informações adicionais para personalizados */}
                {isPersonalizado && (
                  <div className={`text-xs space-y-1 mb-4 p-3 rounded-lg ${
                    temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                  }`}>
                    <div className={`flex justify-between ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                      <span>Criado por:</span>
                      <span className="font-medium">{template.criadoPor}</span>
                    </div>
                    <div className={`flex justify-between ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                      <span>Usado:</span>
                      <span className="font-medium">{template.vezesUsado}x</span>
                    </div>
                    {template.baseadoEm && (
                      <div className={`flex justify-between ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                        <span>Baseado em:</span>
                        <span className="font-medium">{template.baseadoEm}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Ações principais */}
                <div className="flex space-x-2">
                  <Link
                    href={`/briefing/templates/${templateKey}/preview`}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border transition-all ${
                      temaId === 'elegante'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-white/20 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Visualizar</span>
                  </Link>
                  
                  <Link
                    href={isPersonalizado ? `/briefing/novo?templateId=${templateKey}` : `/briefing/novo?template=${templateKey}`}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Usar</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal Novo Template */}
      <AnimatePresence>
        {modalNovoTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalNovoTemplate(false)}
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
                  🆕 Novo Template
                </h2>
                <button
                  onClick={() => setModalNovoTemplate(false)}
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
                {/* Nome */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Nome do Template *
                  </label>
                  <input
                    type="text"
                    value={novoTemplate.nome}
                    onChange={(e) => setNovoTemplate(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Casa Unifamiliar Personalizada"
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    }`}
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Descrição
                  </label>
                  <textarea
                    value={novoTemplate.descricao}
                    onChange={(e) => setNovoTemplate(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o propósito deste template..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    }`}
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Categoria
                  </label>
                  <select
                    value={novoTemplate.categoria}
                    onChange={(e) => setNovoTemplate(prev => ({ ...prev, categoria: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        : 'bg-white/10 border-white/20 text-white focus:border-blue-400'
                    }`}
                  >
                    <option key="modal-residencial" value="residencial" className="text-gray-900">Residencial</option>
                    <option key="modal-comercial" value="comercial" className="text-gray-900">Comercial</option>
                    <option key="modal-industrial" value="industrial" className="text-gray-900">Industrial</option>
                    <option key="modal-institucional" value="institucional" className="text-gray-900">Institucional</option>
                  </select>
                </div>

                {/* Baseado em */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Baseado em Template (opcional)
                  </label>
                  <select
                    value={novoTemplate.baseadoEm}
                    onChange={(e) => setNovoTemplate(prev => ({ ...prev, baseadoEm: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        : 'bg-white/10 border-white/20 text-white focus:border-blue-400'
                    }`}
                  >
                    <option key="modal-zero" value="" className="text-gray-900">Criar do zero</option>
                    {templatesBase.filter(t => t.tipologia?.toLowerCase() === novoTemplate.categoria).map(template => (
                      <option key={`modal-base-${template.chave}`} value={template.chave} className="text-gray-900">
                        {template.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Público */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="publico"
                    checked={novoTemplate.publico}
                    onChange={(e) => setNovoTemplate(prev => ({ ...prev, publico: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="publico" className={`text-sm ${
                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                  }`}>
                    Compartilhar com a equipe
                  </label>
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setModalNovoTemplate(false)}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    temaId === 'elegante'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={criarNovoTemplate}
                  disabled={!novoTemplate.nome.trim()}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado vazio */}
      {templatesFiltrados.length === 0 && (
        <div className={`text-center py-12 ${
          temaId === 'elegante'
            ? 'bg-white border border-gray-200 rounded-2xl'
            : 'bg-white/5 border border-white/10 rounded-2xl'
        }`}>
          <FileText className={`w-16 h-16 mx-auto mb-4 ${
            temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            Nenhum template encontrado
          </h3>
          <p className={`text-sm ${
            temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
          }`}>
            Ajuste os filtros ou crie um novo template personalizado
          </p>
        </div>
      )}
    </div>
  );
} 