'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Palette, 
  Star,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Sparkles,
  Settings,
  Layout,
  Users,
  Briefcase,
  Home,
  Building,
  Factory,
  Hospital,
  Crown,
  Award,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Sliders,
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';

interface PersonalizacaoAspecto {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  nivel: number;
  impacto: string;
  icon: any;
  exemplo: string;
  beneficio: string;
  destaque: boolean;
  novo: boolean;
}

interface PerfilEscritorio {
  id: string;
  nome: string;
  descricao: string;
  especialidade: string;
  tamanho: string;
  cor: string;
  icon: any;
  personalizacoes: string[];
}

export default function PersonalizacaoTotal() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [categoriaAtiva, setCategoriaAtiva] = useState('interface');
  const [perfilSelecionado, setPerfilSelecionado] = useState<PerfilEscritorio | null>(null);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [etapaPersonalizacao, setEtapaPersonalizacao] = useState(0);
  const [mostrarComparacao, setMostrarComparacao] = useState(false);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Mostrar comparação após 2 segundos
    setTimeout(() => setMostrarComparacao(true), 2000);
  }, []);

  const aspectosPersonalizacao: PersonalizacaoAspecto[] = [
    // Interface e Layout
    {
      id: 'interface-adaptativa',
      nome: 'Interface Adaptativa',
      descricao: 'Layout e navegação se adaptam ao tipo de escritório e fluxo de trabalho',
      categoria: 'interface',
      nivel: 5,
      impacto: 'Alto',
      icon: Layout,
      exemplo: 'Escritório de interiores: destaque para materiais e acabamentos no dashboard',
      beneficio: 'Produtividade +40%',
      destaque: true,
      novo: false
    },
    {
      id: 'dashboard-personalizado',
      nome: 'Dashboard Personalizado',
      descricao: 'Widgets e métricas relevantes para cada especialidade aparecem em destaque',
      categoria: 'interface',
      nivel: 4,
      impacto: 'Alto',
      icon: Monitor,
      exemplo: 'Engenheiro estrutural: cálculos e normas técnicas em primeiro plano',
      beneficio: 'Foco nas informações certas',
      destaque: false,
      novo: true
    },
    {
      id: 'responsividade-total',
      nome: 'Responsividade Total',
      descricao: 'Experiência otimizada para desktop, tablet e mobile conforme uso',
      categoria: 'interface',
      nivel: 5,
      impacto: 'Médio',
      icon: Smartphone,
      exemplo: 'Visitas de obra: interface mobile simplificada para acompanhamento',
      beneficio: 'Trabalho em qualquer lugar',
      destaque: true,
      novo: false
    },

    // Fluxos de Trabalho
    {
      id: 'workflows-especializados',
      nome: 'Workflows Especializados',
      descricao: 'Fluxos de trabalho adaptados para cada tipo de projeto e especialidade',
      categoria: 'workflows',
      nivel: 5,
      impacto: 'Alto',
      icon: Target,
      exemplo: 'Projeto residencial: briefing → conceito → anteprojeto → executivo',
      beneficio: 'Metodologia otimizada',
      destaque: true,
      novo: false
    },
    {
      id: 'etapas-customizaveis',
      nome: 'Etapas Customizáveis',
      descricao: 'Adicione, remova ou modifique etapas conforme metodologia do escritório',
      categoria: 'workflows',
      nivel: 4,
      impacto: 'Alto',
      icon: Settings,
      exemplo: 'Adicionar etapa "Aprovação do condomínio" para projetos residenciais',
      beneficio: 'Flexibilidade total',
      destaque: false,
      novo: true
    },
    {
      id: 'aprovacoes-automaticas',
      nome: 'Aprovações Automáticas',
      descricao: 'Configure regras de aprovação baseadas no perfil e hierarquia',
      categoria: 'workflows',
      nivel: 3,
      impacto: 'Médio',
      icon: CheckCircle,
      exemplo: 'Projetos até R$ 50k: aprovação automática do coordenador',
      beneficio: 'Agilidade nas decisões',
      destaque: false,
      novo: false
    },

    // Relatórios e Métricas
    {
      id: 'relatorios-especializados',
      nome: 'Relatórios Especializados',
      descricao: 'Relatórios e KPIs específicos para cada tipo de escritório',
      categoria: 'relatorios',
      nivel: 4,
      impacto: 'Alto',
      icon: BarChart3,
      exemplo: 'Escritório comercial: ROI por m², tempo médio de aprovação, margem por projeto',
      beneficio: 'Decisões baseadas em dados',
      destaque: true,
      novo: false
    },
    {
      id: 'dashboards-executivos',
      nome: 'Dashboards Executivos',
      descricao: 'Visão estratégica com métricas de performance e crescimento',
      categoria: 'relatorios',
      nivel: 5,
      impacto: 'Alto',
      icon: PieChart,
      exemplo: 'Visão mensal: faturamento, projetos em andamento, produtividade da equipe',
      beneficio: 'Gestão estratégica',
      destaque: true,
      novo: true
    },
    {
      id: 'alertas-inteligentes',
      nome: 'Alertas Inteligentes',
      descricao: 'Notificações personalizadas baseadas no perfil e prioridades',
      categoria: 'relatorios',
      nivel: 3,
      impacto: 'Médio',
      icon: Zap,
      exemplo: 'Alerta: "Projeto residencial com prazo em risco - 3 dias para entrega"',
      beneficio: 'Nunca perca prazos',
      destaque: false,
      novo: false
    },

    // Integrações
    {
      id: 'integracoes-especializadas',
      nome: 'Integrações Especializadas',
      descricao: 'Conecta com softwares específicos de cada especialidade',
      categoria: 'integracoes',
      nivel: 4,
      impacto: 'Alto',
      icon: Sparkles,
      exemplo: 'AutoCAD, SketchUp, Revit, TQS - sincronização automática de arquivos',
      beneficio: 'Ecossistema integrado',
      destaque: true,
      novo: false
    },
    {
      id: 'apis-personalizadas',
      nome: 'APIs Personalizadas',
      descricao: 'Desenvolva integrações customizadas para ferramentas específicas',
      categoria: 'integracoes',
      nivel: 5,
      impacto: 'Alto',
      icon: Settings,
      exemplo: 'Integração com software de orçamento específico do escritório',
      beneficio: 'Flexibilidade máxima',
      destaque: false,
      novo: true
    },
    {
      id: 'sincronizacao-nuvem',
      nome: 'Sincronização em Nuvem',
      descricao: 'Backup automático e acesso remoto configurável por perfil',
      categoria: 'integracoes',
      nivel: 3,
      impacto: 'Médio',
      icon: Shield,
      exemplo: 'Backup automático no Google Drive para projetos residenciais',
      beneficio: 'Segurança e mobilidade',
      destaque: false,
      novo: false
    }
  ];

  const perfisEscritorio: PerfilEscritorio[] = [
    {
      id: 'arquitetura-residencial',
      nome: 'Arquitetura Residencial',
      descricao: 'Especializado em casas, apartamentos e condomínios',
      especialidade: 'Residencial',
      tamanho: '5-15 pessoas',
      cor: 'from-green-500 to-emerald-500',
      icon: Home,
      personalizacoes: [
        'Dashboard com foco em briefings familiares',
        'Workflow: Briefing → Estudo → Anteprojeto → Executivo',
        'Relatórios de satisfação do cliente',
        'Integração com SketchUp e AutoCAD',
        'Alertas de prazos de aprovação'
      ]
    },
    {
      id: 'arquitetura-comercial',
      nome: 'Arquitetura Comercial',
      descricao: 'Lojas, escritórios, restaurantes e espaços comerciais',
      especialidade: 'Comercial',
      tamanho: '8-25 pessoas',
      cor: 'from-blue-500 to-cyan-500',
      icon: Building,
      personalizacoes: [
        'Dashboard com ROI e viabilidade comercial',
        'Workflow: Viabilidade → Conceito → Projeto → Execução',
        'Relatórios de rentabilidade por m²',
        'Integração com softwares de orçamento',
        'Alertas de marcos contratuais'
      ]
    },
    {
      id: 'engenharia-estrutural',
      nome: 'Engenharia Estrutural',
      descricao: 'Cálculos estruturais e projetos de fundação',
      especialidade: 'Estrutural',
      tamanho: '3-12 pessoas',
      cor: 'from-orange-500 to-red-500',
      icon: Factory,
      personalizacoes: [
        'Dashboard com normas técnicas e cálculos',
        'Workflow: Análise → Dimensionamento → Detalhamento',
        'Relatórios de conformidade com NBRs',
        'Integração com TQS e Eberick',
        'Alertas de revisões técnicas'
      ]
    },
    {
      id: 'arquitetura-hospitalar',
      nome: 'Arquitetura Hospitalar',
      descricao: 'Clínicas, hospitais e equipamentos de saúde',
      especialidade: 'Saúde',
      tamanho: '10-30 pessoas',
      cor: 'from-purple-500 to-pink-500',
      icon: Hospital,
      personalizacoes: [
        'Dashboard com normas sanitárias',
        'Workflow: RDC → Projeto → Aprovação ANVISA',
        'Relatórios de conformidade sanitária',
        'Integração com softwares médicos',
        'Alertas de licenças e aprovações'
      ]
    }
  ];

  const concorrentes = [
    { 
      nome: 'Sistema Genérico', 
      personalizacao: 10, 
      adaptabilidade: 'Baixa',
      especializacao: 'Nenhuma',
      cor: 'text-red-400',
      descricao: 'Interface única'
    },
    { 
      nome: 'Concorrente A', 
      personalizacao: 30, 
      adaptabilidade: 'Limitada',
      especializacao: 'Básica',
      cor: 'text-orange-400',
      descricao: 'Algumas opções'
    },
    { 
      nome: 'Concorrente B', 
      personalizacao: 50, 
      adaptabilidade: 'Média',
      especializacao: 'Parcial',
      cor: 'text-yellow-400',
      descricao: 'Configurações limitadas'
    },
    { 
      nome: 'ArcFlow', 
      personalizacao: 95, 
      adaptabilidade: 'Total',
      especializacao: 'Completa',
      cor: 'text-green-400',
      descricao: 'Personalização Total'
    }
  ];

  const categorias = [
    { 
      id: 'interface', 
      nome: 'Interface & Layout', 
      icon: Layout, 
      cor: 'from-blue-500 to-cyan-500',
      count: aspectosPersonalizacao.filter(a => a.categoria === 'interface').length,
      descricao: 'Adaptação visual e navegação'
    },
    { 
      id: 'workflows', 
      nome: 'Fluxos de Trabalho', 
      icon: Target, 
      cor: 'from-green-500 to-emerald-500',
      count: aspectosPersonalizacao.filter(a => a.categoria === 'workflows').length,
      descricao: 'Processos e metodologias'
    },
    { 
      id: 'relatorios', 
      nome: 'Relatórios & KPIs', 
      icon: BarChart3, 
      cor: 'from-purple-500 to-pink-500',
      count: aspectosPersonalizacao.filter(a => a.categoria === 'relatorios').length,
      descricao: 'Métricas especializadas'
    },
    { 
      id: 'integracoes', 
      nome: 'Integrações', 
      icon: Sparkles, 
      cor: 'from-yellow-500 to-orange-500',
      count: aspectosPersonalizacao.filter(a => a.categoria === 'integracoes').length,
      descricao: 'Conectividade e APIs'
    }
  ];

  const iniciarSimulacao = (perfil: PerfilEscritorio) => {
    setPerfilSelecionado(perfil);
    setSimulacaoAtiva(true);
    setEtapaPersonalizacao(0);
    
    // Simular etapas de personalização
    const interval = setInterval(() => {
      setEtapaPersonalizacao(prev => {
        if (prev >= perfil.personalizacoes.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetarSimulacao = () => {
    setPerfilSelecionado(null);
    setSimulacaoAtiva(false);
    setEtapaPersonalizacao(0);
  };

  const aspectosAtivos = aspectosPersonalizacao.filter(a => a.categoria === categoriaAtiva);
  const aspectosDestaque = aspectosAtivos.filter(a => a.destaque);

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      personalizacao_total: {
        aspectos_visualizados: aspectosPersonalizacao.length,
        categoria_preferida: categoriaAtiva,
        perfil_simulado: perfilSelecionado?.id,
        personalizacao_completa: simulacaoAtiva,
        nivel_personalizacao: 95
      },
      etapaAtual: 9
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/precificacao');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/ia-especializada');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>

          <div className="text-center">
            <span className="text-white font-semibold">Etapa 9 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[75%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          <div className="w-20"></div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Personalização Total
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              O ArcFlow se adapta 100% ao seu escritório. Interface, workflows, relatórios - tudo personalizado para sua especialidade.
            </p>
            <div className="mt-4">
              <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-bold">
                🎨 95% de Personalização vs 10-50% dos concorrentes
              </span>
            </div>
          </motion.div>

          {/* Comparação com Concorrentes */}
          <AnimatePresence>
            {mostrarComparacao && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 mb-12"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Palette className="h-8 w-8 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Revolução em Personalização</h2>
                    <Crown className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-purple-200/80">Veja como nossa personalização supera qualquer sistema do mercado</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {concorrentes.map((concorrente, index) => (
                    <motion.div
                      key={concorrente.nome}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`
                        text-center p-6 rounded-xl border-2 transition-all duration-300
                        ${concorrente.nome === 'ArcFlow' 
                          ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/25' 
                          : 'border-white/20 bg-white/5'
                        }
                      `}
                    >
                      <div className={`text-3xl font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.personalizacao}%
                      </div>
                      <div className="text-white/70 text-xs mb-3">Personalização</div>
                      
                      <div className={`text-lg font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.adaptabilidade}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Adaptabilidade</div>
                      
                      <div className={`text-sm font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.especializacao}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Especialização</div>
                      
                      <div className={`font-semibold text-sm ${concorrente.nome === 'ArcFlow' ? 'text-green-400' : 'text-white/80'}`}>
                        {concorrente.nome}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{concorrente.descricao}</div>
                      
                      {concorrente.nome === 'ArcFlow' && (
                        <div className="mt-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            🎨 PERSONALIZAÇÃO TOTAL
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-purple-500/20 px-6 py-3 rounded-2xl border border-purple-400/30">
                    <Award className="h-6 w-6 text-pink-400" />
                    <span className="text-purple-400 font-bold text-lg">
                      Única plataforma com personalização total por especialidade
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simulação de Perfis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎯 Simulação por Especialidade
              </h2>
              <p className="text-white/70 mb-6">
                Veja como o ArcFlow se transforma completamente para cada tipo de escritório
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {perfisEscritorio.map((perfil) => {
                  const IconComponent = perfil.icon;
                  
                  return (
                    <motion.button
                      key={perfil.id}
                      onClick={() => iniciarSimulacao(perfil)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-6 rounded-xl border-2 transition-all duration-300 text-center
                        ${perfilSelecionado?.id === perfil.id 
                          ? 'border-purple-400 bg-purple-500/20' 
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${perfil.cor} flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-2">{perfil.nome}</h3>
                      <div className="text-sm text-white/70 mb-2">{perfil.descricao}</div>
                      <div className="text-xs text-white/60">{perfil.tamanho}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Simulação Ativa */}
            {perfilSelecionado && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${perfilSelecionado.cor} flex items-center justify-center`}>
                      <perfilSelecionado.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{perfilSelecionado.nome}</h3>
                      <p className="text-white/70">{perfilSelecionado.descricao}</p>
                    </div>
                  </div>
                  <button
                    onClick={resetarSimulacao}
                    className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">Resetar</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">Personalizando Sistema</span>
                    <span className="text-purple-400 font-bold text-sm">
                      {Math.round(((etapaPersonalizacao + 1) / perfilSelecionado.personalizacoes.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((etapaPersonalizacao + 1) / perfilSelecionado.personalizacoes.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Personalizações */}
                <div className="space-y-4">
                  {perfilSelecionado.personalizacoes.map((personalizacao, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: index <= etapaPersonalizacao ? 1 : 0.3,
                        x: 0
                      }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        flex items-center space-x-3 p-4 rounded-lg border transition-all duration-500
                        ${index <= etapaPersonalizacao 
                          ? 'border-purple-400/50 bg-purple-500/20' 
                          : 'border-white/10 bg-white/5'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${index <= etapaPersonalizacao 
                          ? 'bg-purple-500' 
                          : 'bg-white/20'
                        }
                      `}>
                        {index <= etapaPersonalizacao ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <span className="text-white/60 text-sm">{index + 1}</span>
                        )}
                      </div>
                      <span className={`
                        ${index <= etapaPersonalizacao ? 'text-white' : 'text-white/60'}
                      `}>
                        {personalizacao}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {etapaPersonalizacao >= perfilSelecionado.personalizacoes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                  >
                    <div className="bg-green-500/20 px-6 py-3 rounded-2xl border border-green-400/30 inline-block">
                      <span className="text-green-400 font-bold">
                        ✨ Sistema 100% personalizado para {perfilSelecionado.especialidade}!
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Aspectos de Personalização */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Aspectos de Personalização
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {categorias.map((categoria) => {
                const IconComponent = categoria.icon;
                const isActive = categoriaAtiva === categoria.id;
                
                return (
                  <motion.button
                    key={categoria.id}
                    onClick={() => setCategoriaAtiva(categoria.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-6 rounded-2xl border-2 transition-all duration-300 text-center
                      ${isActive 
                        ? 'border-white/50 bg-white/20 shadow-lg' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${categoria.cor} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{categoria.nome}</h3>
                    <div className="text-sm text-white/70 mb-2">{categoria.descricao}</div>
                    <div className="text-xs text-white/60">{categoria.count} aspectos</div>
                  </motion.button>
                );
              })}
            </div>

            {/* Aspectos da Categoria Ativa */}
            <motion.div
              key={categoriaAtiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Aspectos em Destaque */}
              {aspectosDestaque.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>Aspectos em Destaque</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aspectosDestaque.map((aspecto, index) => {
                      const IconComponent = aspecto.icon;
                      
                      return (
                        <motion.div
                          key={aspecto.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-bold text-white">{aspecto.nome}</h4>
                                {aspecto.novo && <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">NOVO</span>}
                              </div>
                              
                              <p className="text-white/70 text-sm mb-3">{aspecto.descricao}</p>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                <div className="text-center">
                                  <div className="text-purple-400 font-bold">Nível {aspecto.nivel}</div>
                                  <div className="text-white/60">Personalização</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-pink-400 font-bold">{aspecto.impacto}</div>
                                  <div className="text-white/60">Impacto</div>
                                </div>
                              </div>
                              
                              <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
                                <div className="text-xs text-white/60 mb-1">Exemplo:</div>
                                <div className="text-sm text-white/90 italic">"{aspecto.exemplo}"</div>
                              </div>
                              
                              <div className="text-xs text-green-400 font-bold">
                                💡 {aspecto.beneficio}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Todos os Aspectos */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <span>Todos os Aspectos - {categorias.find(c => c.id === categoriaAtiva)?.nome}</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aspectosAtivos.map((aspecto, index) => {
                    const IconComponent = aspecto.icon;
                    
                    return (
                      <motion.div
                        key={aspecto.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">{aspecto.nome}</h4>
                            {aspecto.destaque && <Star className="h-3 w-3 text-yellow-400 fill-current inline ml-1" />}
                            {aspecto.novo && <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs ml-1">NOVO</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-purple-400 font-bold">Nível {aspecto.nivel}</div>
                          <div className="text-pink-400 font-bold">{aspecto.impacto}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Estatísticas de Impacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              🚀 Impacto da Personalização Total
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-white/70 text-sm">Personalização</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400 mb-2">12</div>
                <div className="text-white/70 text-sm">Aspectos Únicos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">4</div>
                <div className="text-white/70 text-sm">Especialidades</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">40%</div>
                <div className="text-white/70 text-sm">+ Produtividade</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              <span>Continuar para Precificação</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}