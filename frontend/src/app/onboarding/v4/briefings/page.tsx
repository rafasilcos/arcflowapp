'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  MessageSquare, 
  Star,
  CheckCircle,
  Brain,
  Zap,
  Clock,
  Target,
  Users,
  FileText,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Award,
  Rocket,
  Eye,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface BriefingStep {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'pergunta' | 'analise' | 'sugestao';
  categoria: string;
  inteligencia: number;
  tempoEconomizado: string;
  icon: any;
  exemplo: string;
  destaque: boolean;
}

export default function BriefingsInteligentes() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [etapaAtiva, setEtapaAtiva] = useState(0);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [briefingCompleto, setBriefingCompleto] = useState(false);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Mostrar comparação após 2 segundos
    setTimeout(() => setMostrarComparacao(true), 2000);
  }, []);

  const briefingSteps: BriefingStep[] = [
    {
      id: 'contexto-inicial',
      titulo: 'Contexto do Projeto',
      descricao: 'IA analisa automaticamente o perfil e sugere perguntas personalizadas',
      tipo: 'analise',
      categoria: 'Análise Inteligente',
      inteligencia: 5,
      tempoEconomizado: '45min',
      icon: Brain,
      exemplo: 'Com base no seu perfil de arquiteto residencial, vou focar em aspectos familiares e funcionais...',
      destaque: true
    },
    {
      id: 'necessidades-especificas',
      titulo: 'Necessidades Específicas',
      descricao: 'Perguntas adaptativas baseadas no tipo de projeto identificado',
      tipo: 'pergunta',
      categoria: 'Personalização',
      inteligencia: 4,
      tempoEconomizado: '30min',
      icon: Target,
      exemplo: 'Para uma casa térrea de 120m², quantos quartos são necessários? Há preferência por suíte master?',
      destaque: true
    },
    {
      id: 'restricoes-tecnicas',
      titulo: 'Restrições Técnicas',
      descricao: 'IA identifica limitações do terreno e sugere soluções automáticas',
      tipo: 'analise',
      categoria: 'Análise Técnica',
      inteligencia: 5,
      tempoEconomizado: '60min',
      icon: Zap,
      exemplo: 'Terreno em declive detectado. Sugerindo fundação em radier com contenção lateral...',
      destaque: true
    },
    {
      id: 'preferencias-esteticas',
      titulo: 'Preferências Estéticas',
      descricao: 'Análise de tendências e sugestões baseadas no perfil do cliente',
      tipo: 'sugestao',
      categoria: 'Design Inteligente',
      inteligencia: 4,
      tempoEconomizado: '25min',
      icon: Sparkles,
      exemplo: 'Baseado no seu gosto por modernidade, sugiro linhas clean com elementos em concreto aparente...',
      destaque: false
    },
    {
      id: 'orcamento-inteligente',
      titulo: 'Orçamento Inteligente',
      descricao: 'Cálculo automático baseado em banco de dados atualizado',
      tipo: 'analise',
      categoria: 'Análise Financeira',
      inteligencia: 5,
      tempoEconomizado: '90min',
      icon: TrendingUp,
      exemplo: 'Para sua região, o custo estimado é R$ 1.850/m². Incluindo acabamentos premium: R$ 2.200/m²',
      destaque: true
    },
    {
      id: 'cronograma-otimizado',
      titulo: 'Cronograma Otimizado',
      descricao: 'IA cria timeline realista considerando sazonalidade e recursos',
      tipo: 'analise',
      categoria: 'Planejamento',
      inteligencia: 4,
      tempoEconomizado: '40min',
      icon: Clock,
      exemplo: 'Considerando o período chuvoso, sugiro iniciar fundação em março. Prazo total: 8 meses.',
      destaque: false
    },
    {
      id: 'equipe-especializada',
      titulo: 'Equipe Especializada',
      descricao: 'Recomendação automática de profissionais baseada no projeto',
      tipo: 'sugestao',
      categoria: 'Recursos Humanos',
      inteligencia: 3,
      tempoEconomizado: '35min',
      icon: Users,
      exemplo: 'Para este projeto, recomendo: 1 mestre de obras, 4 pedreiros, 2 eletricistas, 1 encanador...',
      destaque: false
    },
    {
      id: 'documentacao-automatica',
      titulo: 'Documentação Automática',
      descricao: 'Geração instantânea de memorial descritivo e especificações',
      tipo: 'analise',
      categoria: 'Documentação',
      inteligencia: 5,
      tempoEconomizado: '120min',
      icon: FileText,
      exemplo: 'Memorial descritivo gerado automaticamente com 47 páginas, incluindo especificações técnicas...',
      destaque: true
    }
  ];

  const concorrentes = [
    { 
      nome: 'Método Tradicional', 
      perguntas: 15, 
      tempo: '4-6 horas',
      inteligencia: 0,
      cor: 'text-red-400',
      descricao: 'Questionário estático'
    },
    { 
      nome: 'Concorrente A', 
      perguntas: 25, 
      tempo: '2-3 horas',
      inteligencia: 2,
      cor: 'text-orange-400',
      descricao: 'Algumas automações'
    },
    { 
      nome: 'Concorrente B', 
      perguntas: 30, 
      tempo: '1-2 horas',
      inteligencia: 3,
      cor: 'text-yellow-400',
      descricao: 'IA básica'
    },
    { 
      nome: 'ArcFlow', 
      perguntas: 127, 
      tempo: '15-30 min',
      inteligencia: 5,
      cor: 'text-green-400',
      descricao: 'IA Especializada'
    }
  ];

  const iniciarSimulacao = () => {
    setSimulacaoAtiva(true);
    setEtapaAtiva(0);
    
    // Simular progressão automática
    const interval = setInterval(() => {
      setEtapaAtiva(prev => {
        if (prev >= briefingSteps.length - 1) {
          clearInterval(interval);
          setBriefingCompleto(true);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetarSimulacao = () => {
    setSimulacaoAtiva(false);
    setEtapaAtiva(0);
    setBriefingCompleto(false);
  };

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      briefings: {
        simulacao_completa: briefingCompleto,
        etapas_visualizadas: briefingSteps.length,
        tempo_economizado_total: '445min', // Soma de todos os tempos
        inteligencia_media: 4.4
      },
      etapaAtual: 7
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/ia-especializada');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/templates');
  };

  const StepCard = ({ step, index, isActive }: { step: BriefingStep; index: number; isActive: boolean }) => {
    const IconComponent = step.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: isActive ? 1 : 0.6, 
          x: 0,
          scale: isActive ? 1.02 : 1
        }}
        transition={{ delay: index * 0.1 }}
        className={`
          p-6 rounded-2xl border-2 transition-all duration-500
          ${isActive 
            ? 'border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/25' 
            : step.destaque
              ? 'border-yellow-400/30 bg-yellow-500/10'
              : 'border-white/20 bg-white/5'
          }
        `}
      >
        <div className="flex items-start space-x-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isActive 
              ? 'bg-indigo-500' 
              : step.destaque 
                ? 'bg-yellow-500' 
                : 'bg-white/20'
            }
          `}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-bold ${isActive ? 'text-indigo-400' : 'text-white'}`}>
                {step.titulo}
              </h3>
              {step.destaque && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
            </div>
            
            <p className="text-white/70 text-sm mb-3">{step.descricao}</p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="bg-white/10 px-2 py-1 rounded-full text-white/80">
                  {step.categoria}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-white/60">IA:</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i < step.inteligencia ? 'bg-purple-400' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-green-400 font-bold">
                -{step.tempoEconomizado}
              </div>
            </div>
            
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20"
              >
                <div className="text-xs text-white/60 mb-1">Exemplo em tempo real:</div>
                <div className="text-sm text-white/90 italic">"{step.exemplo}"</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl animate-spin-slow"></div>
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
            <span className="text-white font-semibold">Etapa 7 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[58%] h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
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
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Briefings Inteligentes
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              IA especializada que transforma 4-6 horas de briefing tradicional em 15-30 minutos de precisão absoluta.
            </p>
          </motion.div>

          {/* Comparação com Concorrentes */}
          <AnimatePresence>
            {mostrarComparacao && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 mb-12"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Brain className="h-8 w-8 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Revolução em Briefings</h2>
                    <Rocket className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-purple-200/80">Veja como nossa IA especializada supera todos os métodos tradicionais</p>
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
                        {concorrente.perguntas}
                      </div>
                      <div className="text-white/70 text-xs mb-2">Perguntas Inteligentes</div>
                      
                      <div className={`text-lg font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.tempo}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Tempo Total</div>
                      
                      <div className="flex justify-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < concorrente.inteligencia ? 'bg-purple-400' : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <div className={`font-semibold text-sm ${concorrente.nome === 'ArcFlow' ? 'text-green-400' : 'text-white/80'}`}>
                        {concorrente.nome}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{concorrente.descricao}</div>
                      
                      {concorrente.nome === 'ArcFlow' && (
                        <div className="mt-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            🧠 IA ESPECIALIZADA
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-purple-500/20 px-6 py-3 rounded-2xl border border-purple-400/30">
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                    <span className="text-purple-400 font-bold text-lg">
                      92% mais eficiente que métodos tradicionais
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simulação Interativa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎯 Simulação em Tempo Real
              </h2>
              <p className="text-white/70 mb-6">
                Veja como nossa IA conduz um briefing completo de forma inteligente e personalizada
              </p>
              
              <div className="flex justify-center space-x-4">
                {!simulacaoAtiva ? (
                  <motion.button
                    onClick={iniciarSimulacao}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                  >
                    <Play className="h-5 w-5" />
                    <span>Iniciar Simulação</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={resetarSimulacao}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Resetar</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {simulacaoAtiva && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Progresso do Briefing</span>
                  <span className="text-purple-400 font-bold text-sm">
                    {Math.round(((etapaAtiva + 1) / briefingSteps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((etapaAtiva + 1) / briefingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Briefing Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {briefingSteps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={simulacaoAtiva && index === etapaAtiva}
                />
              ))}
            </div>

            {/* Resultado Final */}
            {briefingCompleto && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-2xl p-8 border border-green-400/30"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Award className="h-8 w-8 text-green-400" />
                    <h3 className="text-2xl font-bold text-white">Briefing Completo!</h3>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">127</div>
                      <div className="text-white/70 text-sm">Perguntas Respondidas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">22min</div>
                      <div className="text-white/70 text-sm">Tempo Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                      <div className="text-white/70 text-sm">Precisão IA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">7.4h</div>
                      <div className="text-white/70 text-sm">Tempo Economizado</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                      ✨ Briefing 15x mais rápido que métodos tradicionais
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Estatísticas de Impacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-indigo-400/30 mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              🚀 Impacto dos Briefings Inteligentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">127</div>
                <div className="text-white/70 text-sm">Perguntas Inteligentes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                <div className="text-white/70 text-sm">Mais Eficiente</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">15-30min</div>
                <div className="text-white/70 text-sm">Tempo Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                <div className="text-white/70 text-sm">Precisão IA</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              <span>Continuar para IA Especializada</span>
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