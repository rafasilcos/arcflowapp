'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Star,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Sparkles,
  Cpu,
  Database,
  Network,
  Bot,
  Rocket,
  Award,
  Eye,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Calculator,
  FileText,
  Search,
  AlertTriangle,
  CheckSquare,
  Clock,
  DollarSign
} from 'lucide-react';

interface IACapability {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  precisao: number;
  tempoEconomizado: string;
  icon: any;
  exemplo: string;
  beneficio: string;
  destaque: boolean;
  novo: boolean;
}

interface IADemo {
  id: string;
  titulo: string;
  pergunta: string;
  resposta: string;
  tempo: string;
  precisao: number;
  categoria: string;
}

export default function IAEspecializada() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [categoriaAtiva, setCategoriaAtiva] = useState('briefing');
  const [demoAtiva, setDemoAtiva] = useState<IADemo | null>(null);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [etapaDemo, setEtapaDemo] = useState(0);
  const [mostrarComparacao, setMostrarComparacao] = useState(false);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Mostrar comparação após 2 segundos
    setTimeout(() => setMostrarComparacao(true), 2000);
  }, []);

  const capacidadesIA: IACapability[] = [
    // Briefing Inteligente
    {
      id: 'briefing-inteligente',
      nome: 'Briefing Inteligente',
      descricao: 'Análise automática das respostas e sugestões de perguntas complementares',
      categoria: 'briefing',
      precisao: 92,
      tempoEconomizado: '2.5h',
      icon: MessageSquare,
      exemplo: 'Cliente menciona "casa moderna" → IA sugere perguntas sobre materiais, cores e estilo específico',
      beneficio: 'Briefings 15x mais rápidos',
      destaque: true,
      novo: false
    },
    {
      id: 'interpretacao-necessidades',
      nome: 'Interpretação de Necessidades',
      descricao: 'Compreende linguagem natural e identifica requisitos técnicos',
      categoria: 'briefing',
      precisao: 89,
      tempoEconomizado: '1.8h',
      icon: Brain,
      exemplo: '"Quero algo aconchegante" → IA identifica: iluminação indireta, cores quentes, materiais naturais',
      beneficio: 'Reduz mal-entendidos em 85%',
      destaque: false,
      novo: true
    },

    // Geração de Templates
    {
      id: 'geracao-templates',
      nome: 'Geração de Templates Inteligente',
      descricao: 'Cruza dados do briefing com banco de templates para sugestão automática',
      categoria: 'templates',
      precisao: 89,
      tempoEconomizado: '1.8h',
      icon: Target,
      exemplo: 'Casa térrea 120m², 3 quartos, moderno → IA sugere Template "Casa Média Contemporânea"',
      beneficio: 'Templates 100% personalizados',
      destaque: true,
      novo: false
    },
    {
      id: 'personalizacao-automatica',
      nome: 'Personalização Automática',
      descricao: 'Adapta tarefas e cronograma conforme especificidades do projeto',
      categoria: 'templates',
      precisao: 87,
      tempoEconomizado: '1.2h',
      icon: Sparkles,
      exemplo: 'Terreno em declive → IA adiciona automaticamente tarefas de contenção e drenagem',
      beneficio: 'Projetos únicos em 2 minutos',
      destaque: false,
      novo: true
    },

    // Preenchimento de Orçamentos
    {
      id: 'orcamento-automatico',
      nome: 'Preenchimento Automático de Orçamentos',
      descricao: 'Análise do projeto e sugestão automática de itens com preços regionais',
      categoria: 'orcamento',
      precisao: 85,
      tempoEconomizado: '2.1h',
      icon: DollarSign,
      exemplo: 'Casa 120m² SP → IA sugere: Fundação R$18k, Estrutura R$35k, Alvenaria R$22k',
      beneficio: 'Economia média R$ 3.200 por projeto',
      destaque: true,
      novo: false
    },
    {
      id: 'precos-regionais',
      nome: 'Preços Regionais Atualizados',
      descricao: 'Banco de dados com preços atualizados por região e fornecedores',
      categoria: 'orcamento',
      precisao: 88,
      tempoEconomizado: '1.5h',
      icon: TrendingUp,
      exemplo: 'Mesmo projeto: São Paulo R$1.850/m², Interior R$1.420/m² → IA ajusta automaticamente',
      beneficio: 'Orçamentos 85% mais precisos',
      destaque: false,
      novo: false
    },

    // Cronograma Inteligente
    {
      id: 'cronograma-inteligente',
      nome: 'Cronograma Inteligente',
      descricao: 'Cálculo de prazos realistas considerando sazonalidade e dependências',
      categoria: 'cronograma',
      precisao: 88,
      tempoEconomizado: '1.9h',
      icon: Clock,
      exemplo: 'Início em dezembro → IA alerta: "Evitar fundação em janeiro (chuvas)" e ajusta cronograma',
      beneficio: 'Redução de atrasos em 45%',
      destaque: true,
      novo: false
    },
    {
      id: 'dependencias-automaticas',
      nome: 'Dependências Automáticas',
      descricao: 'Identifica e organiza automaticamente a sequência ideal de tarefas',
      categoria: 'cronograma',
      precisao: 91,
      tempoEconomizado: '1.3h',
      icon: Network,
      exemplo: 'IA detecta: "Instalação elétrica deve aguardar conclusão da alvenaria" e reorganiza',
      beneficio: 'Cronogramas realistas sempre',
      destaque: false,
      novo: true
    },

    // Validação de Dados
    {
      id: 'validacao-dados',
      nome: 'Validação Automática de Dados',
      descricao: 'Detecção de inconsistências em tempo real com sugestões de correção',
      categoria: 'validacao',
      precisao: 94,
      tempoEconomizado: '1.7h',
      icon: AlertTriangle,
      exemplo: 'Área 50m² para 3 quartos → IA alerta: "Área pequena, considere 2 quartos ou aumentar área"',
      beneficio: 'Prevenção de erros em 78%',
      destaque: true,
      novo: false
    },
    {
      id: 'comparacao-mercado',
      nome: 'Comparação com Mercado',
      descricao: 'Compara dados inseridos com padrões de mercado e benchmarks',
      categoria: 'validacao',
      precisao: 86,
      tempoEconomizado: '1.1h',
      icon: CheckSquare,
      exemplo: 'Orçamento R$50k para 120m² → IA alerta: "60% abaixo da média regional (R$125k)"',
      beneficio: 'Decisões baseadas em dados reais',
      destaque: false,
      novo: true
    }
  ];

  const demos: IADemo[] = [
    {
      id: 'demo-briefing',
      titulo: 'Briefing Inteligente',
      pergunta: 'Cliente: "Quero uma casa moderna e aconchegante para minha família"',
      resposta: 'IA detectou: ESTILO (moderno) + AMBIENTE (aconchegante) + USUÁRIOS (família). Sugestões automáticas: 1) Quantas pessoas na família? 2) Preferência por integração social? 3) Materiais: concreto aparente ou madeira? 4) Iluminação: natural abundante ou intimista?',
      tempo: '1.2s',
      precisao: 92,
      categoria: 'Briefing'
    },
    {
      id: 'demo-orcamento',
      titulo: 'Orçamento Automático',
      pergunta: 'Casa térrea 120m², padrão médio, São Paulo - SP',
      resposta: 'Orçamento gerado automaticamente: FUNDAÇÃO: Radier 120m² - R$ 18.000 | ESTRUTURA: Concreto armado - R$ 35.000 | ALVENARIA: Bloco cerâmico - R$ 22.000 | COBERTURA: Telha cerâmica - R$ 15.000 | ACABAMENTOS: Padrão médio - R$ 45.000 | TOTAL: R$ 135.000 (R$ 1.125/m²)',
      tempo: '2.8s',
      precisao: 85,
      categoria: 'Orçamento'
    },
    {
      id: 'demo-validacao',
      titulo: 'Validação de Dados',
      pergunta: 'Projeto: Casa 80m² com 4 quartos, orçamento R$ 40.000',
      resposta: 'ALERTAS DETECTADOS: 1) ⚠️ Área insuficiente: 80m² para 4 quartos resulta em cômodos < 8m² (mín. recomendado: 9m²). Sugestão: 3 quartos ou aumentar para 100m². 2) ⚠️ Orçamento baixo: R$ 500/m² está 65% abaixo da média regional (R$ 1.420/m²). Revisar especificações.',
      tempo: '1.6s',
      precisao: 94,
      categoria: 'Validação'
    }
  ];

  const categorias = [
    { 
      id: 'briefing', 
      nome: 'Briefing Inteligente', 
      icon: MessageSquare, 
      cor: 'from-blue-500 to-cyan-500',
      count: capacidadesIA.filter(c => c.categoria === 'briefing').length,
      descricao: 'Análise e interpretação automática'
    },
    { 
      id: 'templates', 
      nome: 'Templates Inteligentes', 
      icon: Target, 
      cor: 'from-green-500 to-emerald-500',
      count: capacidadesIA.filter(c => c.categoria === 'templates').length,
      descricao: 'Geração e personalização automática'
    },
    { 
      id: 'orcamento', 
      nome: 'Orçamentos Automáticos', 
      icon: DollarSign, 
      cor: 'from-yellow-500 to-orange-500',
      count: capacidadesIA.filter(c => c.categoria === 'orcamento').length,
      descricao: 'Preenchimento e cálculos automáticos'
    },
    { 
      id: 'cronograma', 
      nome: 'Cronograma Inteligente', 
      icon: Clock, 
      cor: 'from-purple-500 to-pink-500',
      count: capacidadesIA.filter(c => c.categoria === 'cronograma').length,
      descricao: 'Prazos realistas e dependências'
    },
    { 
      id: 'validacao', 
      nome: 'Validação Automática', 
      icon: AlertTriangle, 
      cor: 'from-red-500 to-rose-500',
      count: capacidadesIA.filter(c => c.categoria === 'validacao').length,
      descricao: 'Detecção de inconsistências'
    }
  ];

  const concorrentes = [
    { 
      nome: 'Método Manual', 
      funcionalidades: 0, 
      precisao: 60,
      velocidade: 'Manual',
      cor: 'text-red-400',
      descricao: 'Sem automação'
    },
    { 
      nome: 'Concorrente A', 
      funcionalidades: 1, 
      precisao: 70,
      velocidade: '10-30min',
      cor: 'text-orange-400',
      descricao: 'Automação básica'
    },
    { 
      nome: 'Concorrente B', 
      funcionalidades: 2, 
      precisao: 75,
      velocidade: '5-15min',
      cor: 'text-yellow-400',
      descricao: 'IA limitada'
    },
    { 
      nome: 'ArcFlow', 
      funcionalidades: 5, 
      precisao: 89,
      velocidade: '1-3s',
      cor: 'text-green-400',
      descricao: 'IA Especializada'
    }
  ];

  const iniciarDemo = (demo: IADemo) => {
    setDemoAtiva(demo);
    setSimulacaoAtiva(true);
    setEtapaDemo(0);
    
    // Simular digitação da pergunta
    setTimeout(() => setEtapaDemo(1), 1000);
    // Simular processamento
    setTimeout(() => setEtapaDemo(2), 2000);
    // Mostrar resposta
    setTimeout(() => setEtapaDemo(3), 4000);
  };

  const resetarDemo = () => {
    setDemoAtiva(null);
    setSimulacaoAtiva(false);
    setEtapaDemo(0);
  };

  const capacidadesAtivas = capacidadesIA.filter(c => c.categoria === categoriaAtiva);
  const capacidadesDestaque = capacidadesAtivas.filter(c => c.destaque);

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      ia_especializada: {
        capacidades_visualizadas: capacidadesIA.length,
        categoria_preferida: categoriaAtiva,
        demo_completa: demoAtiva !== null,
        precisao_media: 89.6,
        tempo_economizado_total: '6.1h'
      },
      etapaAtual: 8
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/personalizacao-total');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/briefings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-spin-slow"></div>
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
            <span className="text-white font-semibold">Etapa 8 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[67%] h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
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
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                IA Especializada
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Gemini 2.0 Flash integrado ao ArcFlow. 5 funcionalidades reais que economizam 6.1h por projeto.
            </p>
            <div className="mt-4">
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                🤖 100% Gratuito - Powered by Google Gemini 2.0
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
                className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30 mb-12"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Brain className="h-8 w-8 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Honestidade Total em IA</h2>
                    <Cpu className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-blue-200/80">Comparação real: o que cada sistema realmente entrega</p>
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
                        {concorrente.funcionalidades}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Funcionalidades IA</div>
                      
                      <div className={`text-2xl font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.precisao}%
                      </div>
                      <div className="text-white/70 text-xs mb-3">Precisão</div>
                      
                      <div className={`text-lg font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.velocidade}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Velocidade</div>
                      
                      <div className={`font-semibold text-sm ${concorrente.nome === 'ArcFlow' ? 'text-green-400' : 'text-white/80'}`}>
                        {concorrente.nome}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{concorrente.descricao}</div>
                      
                      {concorrente.nome === 'ArcFlow' && (
                        <div className="mt-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            🤖 GEMINI 2.0
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-blue-500/20 px-6 py-3 rounded-2xl border border-blue-400/30">
                    <Rocket className="h-6 w-6 text-cyan-400" />
                    <span className="text-blue-400 font-bold text-lg">
                      Única plataforma com 5 funcionalidades IA reais
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Interativa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                🤖 Demonstração Real
              </h2>
              <p className="text-white/70 mb-6">
                Veja como nossa IA realmente funciona - sem exageros, apenas resultados práticos
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {demos.map((demo) => (
                  <motion.button
                    key={demo.id}
                    onClick={() => iniciarDemo(demo)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-300 text-left
                      ${demoAtiva?.id === demo.id 
                        ? 'border-blue-400 bg-blue-500/20' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <h3 className="font-bold text-white mb-2">{demo.titulo}</h3>
                    <div className="text-sm text-white/70 mb-3">{demo.categoria}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-400 font-bold">{demo.tempo}</span>
                      <span className="text-blue-400 font-bold">{demo.precisao}%</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Demo Ativa */}
            {demoAtiva && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{demoAtiva.titulo}</h3>
                  <button
                    onClick={resetarDemo}
                    className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">Resetar</span>
                  </button>
                </div>

                {/* Pergunta */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-semibold">Input:</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: etapaDemo >= 1 ? 1 : 0.5 }}
                      className="text-white"
                    >
                      {demoAtiva.pergunta}
                    </motion.p>
                  </div>
                </div>

                {/* Processamento */}
                {etapaDemo >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="h-5 w-5 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">Gemini 2.0 Processando...</span>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-400/30">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-cyan-400 border-t-transparent"></div>
                        <span className="text-cyan-400">Analisando dados...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resposta */}
                {etapaDemo >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Resultado IA:</span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          {demoAtiva.tempo}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          {demoAtiva.precisao}% precisão
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/30">
                      <p className="text-white leading-relaxed">{demoAtiva.resposta}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Categorias de Capacidades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              5 Funcionalidades Reais da IA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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
                      p-4 rounded-2xl border-2 transition-all duration-300 text-center
                      ${isActive 
                        ? 'border-white/50 bg-white/20 shadow-lg' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-r ${categoria.cor} flex items-center justify-center`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{categoria.nome}</h3>
                    <div className="text-xs text-white/70 mb-2">{categoria.descricao}</div>
                    <div className="text-xs text-white/60">{categoria.count} funções</div>
                  </motion.button>
                );
              })}
            </div>

            {/* Capacidades da Categoria Ativa */}
            <motion.div
              key={categoriaAtiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Capacidades em Destaque */}
              {capacidadesDestaque.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>Funcionalidade Principal</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {capacidadesDestaque.map((capacidade, index) => {
                      const IconComponent = capacidade.icon;
                      
                      return (
                        <motion.div
                          key={capacidade.id}
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
                                <h4 className="font-bold text-white">{capacidade.nome}</h4>
                                {capacidade.novo && <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">NOVO</span>}
                              </div>
                              
                              <p className="text-white/70 text-sm mb-3">{capacidade.descricao}</p>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                <div className="text-center">
                                  <div className="text-blue-400 font-bold">{capacidade.precisao}%</div>
                                  <div className="text-white/60">Precisão</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-green-400 font-bold">{capacidade.tempoEconomizado}</div>
                                  <div className="text-white/60">Tempo Economizado</div>
                                </div>
                              </div>
                              
                              <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
                                <div className="text-xs text-white/60 mb-1">Exemplo prático:</div>
                                <div className="text-sm text-white/90 italic">"{capacidade.exemplo}"</div>
                              </div>
                              
                              <div className="text-xs text-green-400 font-bold">
                                💡 {capacidade.beneficio}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Todas as Capacidades */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <span>Todas as Funções - {categorias.find(c => c.id === categoriaAtiva)?.nome}</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capacidadesAtivas.map((capacidade, index) => {
                    const IconComponent = capacidade.icon;
                    
                    return (
                      <motion.div
                        key={capacidade.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">{capacidade.nome}</h4>
                            {capacidade.destaque && <Star className="h-3 w-3 text-yellow-400 fill-current inline ml-1" />}
                            {capacidade.novo && <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs ml-1">NOVO</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-green-400 font-bold">{capacidade.tempoEconomizado}</div>
                          <div className="text-blue-400 font-bold">{capacidade.precisao}%</div>
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
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30 mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              🚀 Impacto Real da IA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">89.6%</div>
                <div className="text-white/70 text-sm">Precisão Média</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">6.1h</div>
                <div className="text-white/70 text-sm">Tempo Economizado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">5</div>
                <div className="text-white/70 text-sm">Funcionalidades Reais</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">78%</div>
                <div className="text-white/70 text-sm">Redução de Erros</div>
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
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <span>Continuar para Personalização Total</span>
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