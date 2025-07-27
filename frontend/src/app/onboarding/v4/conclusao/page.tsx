'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Trophy,
  Rocket,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Sparkles,
  Crown,
  Award,
  Heart,
  Gift,
  PartyPopper,
  Calendar,
  Clock,
  Users,
  Building,
  Palette,
  BarChart3,
  DollarSign,
  Lock,
  Headphones,
  Download,
  Play,
  BookOpen,
  Video,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  CheckSquare,
  Briefcase,
  Home,
  Factory,
  Hospital,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

interface EtapaResumo {
  numero: number;
  nome: string;
  icon: any;
  cor: string;
  completada: boolean;
  destaque?: string;
}

interface ProximoPasso {
  id: string;
  titulo: string;
  descricao: string;
  icon: any;
  cor: string;
  tempo: string;
  prioridade: 'alta' | 'media' | 'baixa';
  link?: string;
}

interface RecursoUtil {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  tipo: 'video' | 'documento' | 'template' | 'tutorial';
  duracao?: string;
  icon: any;
  cor: string;
  popular: boolean;
}

export default function Conclusao() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [mostrarCelebracao, setMostrarCelebracao] = useState(false);
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [mostrarProximosPassos, setMostrarProximosPassos] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [confettiAtivo, setConfettiAtivo] = useState(false);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Sequência de animações
    setTimeout(() => setMostrarCelebracao(true), 500);
    setTimeout(() => setConfettiAtivo(true), 1000);
    setTimeout(() => setMostrarResumo(true), 2000);
    setTimeout(() => setMostrarProximosPassos(true), 3500);
    
    // Animação das etapas
    const interval = setInterval(() => {
      setEtapaAtual(prev => {
        if (prev >= 11) {
          clearInterval(interval);
          return 11;
        }
        return prev + 1;
      });
    }, 200);
  }, []);

  const etapasResumo: EtapaResumo[] = [
    { numero: 1, nome: 'Boas-vindas', icon: Heart, cor: 'from-pink-500 to-red-500', completada: true, destaque: 'Início da jornada' },
    { numero: 2, nome: 'Perfil Profissional', icon: Users, cor: 'from-blue-500 to-cyan-500', completada: true, destaque: dadosCompletos.perfil?.especialidade || 'Definido' },
    { numero: 3, nome: 'Desafios Atuais', icon: Target, cor: 'from-orange-500 to-red-500', completada: true, destaque: `${dadosCompletos.desafios?.desafios_selecionados?.length || 0} desafios` },
    { numero: 4, nome: 'Objetivos', icon: Trophy, cor: 'from-yellow-500 to-orange-500', completada: true, destaque: dadosCompletos.objetivos?.objetivo_principal || 'Definido' },
    { numero: 5, nome: 'Análise Maturidade', icon: BarChart3, cor: 'from-purple-500 to-pink-500', completada: true, destaque: `${dadosCompletos.analise_maturidade?.score_total || 0}% maturidade` },
    { numero: 6, nome: 'Templates', icon: Palette, cor: 'from-green-500 to-emerald-500', completada: true, destaque: '68 templates vs 3-5' },
    { numero: 7, nome: 'Briefings IA', icon: Lightbulb, cor: 'from-cyan-500 to-blue-500', completada: true, destaque: '127 perguntas vs 15-30' },
    { numero: 8, nome: 'IA Especializada', icon: Cpu, cor: 'from-indigo-500 to-purple-500', completada: true, destaque: '5 funcionalidades reais' },
    { numero: 9, nome: 'Personalização', icon: Crown, cor: 'from-purple-500 to-pink-500', completada: true, destaque: '95% personalização' },
    { numero: 10, nome: 'Precificação', icon: DollarSign, cor: 'from-green-500 to-yellow-500', completada: true, destaque: dadosCompletos.precificacao?.plano_selecionado || 'Professional' },
    { numero: 11, nome: 'Garantias', icon: Shield, cor: 'from-blue-500 to-green-500', completada: true, destaque: '98% confiança' },
    { numero: 12, nome: 'Conclusão', icon: PartyPopper, cor: 'from-pink-500 to-purple-500', completada: true, destaque: 'Jornada completa!' }
  ];

  const proximosPassos: ProximoPasso[] = [
    {
      id: 'criar-conta',
      titulo: 'Criar Sua Conta',
      descricao: 'Configure sua conta e comece seu teste gratuito de 30 dias',
      icon: Rocket,
      cor: 'from-green-500 to-emerald-500',
      tempo: '2 minutos',
      prioridade: 'alta',
      link: '/signup'
    },
    {
      id: 'primeiro-projeto',
      titulo: 'Criar Primeiro Projeto',
      descricao: 'Use nosso assistente para configurar seu primeiro projeto',
      icon: Building,
      cor: 'from-blue-500 to-cyan-500',
      tempo: '5 minutos',
      prioridade: 'alta'
    },
    {
      id: 'configurar-equipe',
      titulo: 'Convidar Sua Equipe',
      descricao: 'Adicione colaboradores e configure permissões',
      icon: Users,
      cor: 'from-purple-500 to-pink-500',
      tempo: '10 minutos',
      prioridade: 'media'
    },
    {
      id: 'personalizar-interface',
      titulo: 'Personalizar Interface',
      descricao: 'Adapte o sistema ao seu fluxo de trabalho',
      icon: Palette,
      cor: 'from-yellow-500 to-orange-500',
      tempo: '15 minutos',
      prioridade: 'media'
    },
    {
      id: 'importar-dados',
      titulo: 'Importar Dados Existentes',
      descricao: 'Migre projetos e clientes do seu sistema atual',
      icon: Download,
      cor: 'from-indigo-500 to-purple-500',
      tempo: '30 minutos',
      prioridade: 'baixa'
    },
    {
      id: 'treinamento-equipe',
      titulo: 'Agendar Treinamento',
      descricao: 'Sessão personalizada para sua equipe',
      icon: BookOpen,
      cor: 'from-red-500 to-pink-500',
      tempo: '60 minutos',
      prioridade: 'baixa'
    }
  ];

  const recursosUteis: RecursoUtil[] = [
    {
      id: 'video-introducao',
      categoria: 'Primeiros Passos',
      titulo: 'Vídeo: Introdução ao ArcFlow',
      descricao: 'Visão geral completa da plataforma em 10 minutos',
      tipo: 'video',
      duracao: '10 min',
      icon: Video,
      cor: 'from-red-500 to-pink-500',
      popular: true
    },
    {
      id: 'guia-inicio-rapido',
      categoria: 'Primeiros Passos',
      titulo: 'Guia de Início Rápido',
      descricao: 'PDF com passo a passo para começar hoje mesmo',
      tipo: 'documento',
      icon: BookOpen,
      cor: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: 'templates-populares',
      categoria: 'Templates',
      titulo: 'Pack Templates Populares',
      descricao: 'Os 10 templates mais usados para download',
      tipo: 'template',
      icon: Download,
      cor: 'from-green-500 to-emerald-500',
      popular: false
    },
    {
      id: 'tutorial-briefing',
      categoria: 'IA e Automação',
      titulo: 'Tutorial: Briefings Inteligentes',
      descricao: 'Como usar a IA para briefings mais eficientes',
      tipo: 'tutorial',
      duracao: '15 min',
      icon: Lightbulb,
      cor: 'from-yellow-500 to-orange-500',
      popular: true
    },
    {
      id: 'webinar-personalizacao',
      categoria: 'Personalização',
      titulo: 'Webinar: Personalização Total',
      descricao: 'Sessão ao vivo sobre personalização avançada',
      tipo: 'video',
      duracao: '45 min',
      icon: Crown,
      cor: 'from-purple-500 to-pink-500',
      popular: false
    },
    {
      id: 'checklist-migracao',
      categoria: 'Migração',
      titulo: 'Checklist de Migração',
      descricao: 'Lista completa para migrar do seu sistema atual',
      tipo: 'documento',
      icon: CheckSquare,
      cor: 'from-indigo-500 to-purple-500',
      popular: false
    }
  ];

  const estatisticasJornada = {
    tempo_total: '12 minutos',
    etapas_completadas: 12,
    insights_descobertos: 47,
    economia_estimada: dadosCompletos.precificacao?.economia_calculada || 0,
    roi_estimado: dadosCompletos.precificacao?.roi_estimado || 0,
    score_maturidade: dadosCompletos.analise_maturidade?.score_total || 0,
    plano_escolhido: dadosCompletos.precificacao?.plano_selecionado || 'Professional'
  };

  const handleComecar = () => {
    // Salvar conclusão do onboarding
    const dadosFinais = {
      ...dadosCompletos,
      conclusao: {
        data_conclusao: new Date().toISOString(),
        tempo_total: '12 minutos',
        etapas_completadas: 12,
        proximo_passo: 'criar-conta',
        recursos_acessados: []
      },
      onboarding_completo: true
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosFinais));
    
    // Redirecionar para criação de conta ou dashboard
    router.push('/signup');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/garantias');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Confetti Effect */}
      {confettiAtivo && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -100, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: 360,
                opacity: 0
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className={`absolute w-3 h-3 ${
                ['bg-pink-400', 'bg-purple-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'][Math.floor(Math.random() * 5)]
              } rounded-full`}
            />
          ))}
        </div>
      )}

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
            <span className="text-white font-semibold">Etapa 12 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          <div className="w-20"></div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Celebração */}
          <AnimatePresence>
            {mostrarCelebracao && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"
                >
                  <Trophy className="h-16 w-16 text-white" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-4"
                >
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Parabéns! 🎉
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-xl text-white/80 max-w-3xl mx-auto mb-6"
                >
                  Você completou sua jornada de descoberta do ArcFlow! Agora você conhece todo o potencial da nossa plataforma.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <span className="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-bold">
                    🚀 Jornada Completa
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-bold">
                    ⏱️ {estatisticasJornada.tempo_total}
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold">
                    💡 {estatisticasJornada.insights_descobertos} Insights
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resumo da Jornada */}
          <AnimatePresence>
            {mostrarResumo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                  📊 Resumo da Sua Jornada
                </h2>

                {/* Estatísticas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-6 border border-pink-400/30 text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">
                      R$ {estatisticasJornada.economia_estimada.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">Economia Anual Estimada</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {estatisticasJornada.roi_estimado}%
                    </div>
                    <div className="text-white/70 text-sm">ROI Estimado</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {estatisticasJornada.score_maturidade}%
                    </div>
                    <div className="text-white/70 text-sm">Score de Maturidade</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {estatisticasJornada.plano_escolhido}
                    </div>
                    <div className="text-white/70 text-sm">Plano Escolhido</div>
                  </div>
                </div>

                {/* Timeline das Etapas */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">
                    🗺️ Etapas Completadas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {etapasResumo.map((etapa, index) => {
                      const IconComponent = etapa.icon;
                      const isVisible = index <= etapaAtual;
                      
                      return (
                        <motion.div
                          key={etapa.numero}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: isVisible ? 1 : 0.3,
                            x: 0
                          }}
                          transition={{ delay: index * 0.1 }}
                          className={`
                            flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300
                            ${isVisible 
                              ? 'border-white/30 bg-white/10' 
                              : 'border-white/10 bg-white/5'
                            }
                          `}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${etapa.cor} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-white/60 text-xs">#{etapa.numero}</span>
                              <h4 className="font-semibold text-white text-sm truncate">{etapa.nome}</h4>
                              {isVisible && <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />}
                            </div>
                            {etapa.destaque && (
                              <div className="text-xs text-white/70 mt-1">{etapa.destaque}</div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Próximos Passos */}
          <AnimatePresence>
            {mostrarProximosPassos && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                  🚀 Seus Próximos Passos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {proximosPassos.map((passo, index) => {
                    const IconComponent = passo.icon;
                    
                    return (
                      <motion.div
                        key={passo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`
                          bg-white/5 rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer
                          ${passo.prioridade === 'alta' ? 'ring-2 ring-green-400/30' : ''}
                        `}
                      >
                        {passo.prioridade === 'alta' && (
                          <div className="flex justify-center mb-4">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                              🔥 PRIORIDADE ALTA
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center mb-4">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${passo.cor} flex items-center justify-center`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          
                          <h3 className="text-lg font-bold text-white mb-2">{passo.titulo}</h3>
                          <p className="text-white/70 text-sm mb-4">{passo.descricao}</p>
                          
                          <div className="flex items-center justify-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-blue-400" />
                              <span className="text-blue-400">{passo.tempo}</span>
                            </div>
                            <div className={`
                              px-2 py-1 rounded-full text-xs font-bold
                              ${passo.prioridade === 'alta' ? 'bg-green-500/20 text-green-400' : 
                                passo.prioridade === 'media' ? 'bg-yellow-500/20 text-yellow-400' : 
                                'bg-gray-500/20 text-gray-400'}
                            `}>
                              {passo.prioridade.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recursos Úteis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              📚 Recursos Úteis para Começar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recursosUteis.map((recurso, index) => {
                const IconComponent = recurso.icon;
                
                return (
                  <motion.div
                    key={recurso.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="bg-white/5 rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    {recurso.popular && (
                      <div className="flex justify-center mb-4">
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${recurso.cor} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-xs text-white/60 mb-1">{recurso.categoria}</div>
                        <h3 className="font-bold text-white mb-2">{recurso.titulo}</h3>
                        <p className="text-white/70 text-sm mb-3">{recurso.descricao}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`
                              px-2 py-1 rounded-full font-bold
                              ${recurso.tipo === 'video' ? 'bg-red-500/20 text-red-400' :
                                recurso.tipo === 'documento' ? 'bg-blue-500/20 text-blue-400' :
                                recurso.tipo === 'template' ? 'bg-green-500/20 text-green-400' :
                                'bg-purple-500/20 text-purple-400'}
                            `}>
                              {recurso.tipo.toUpperCase()}
                            </span>
                            {recurso.duracao && (
                              <span className="text-white/60">{recurso.duracao}</span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/40" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Suporte e Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30 mb-12"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Headphones className="h-8 w-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Precisa de Ajuda?</h2>
                <Heart className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-blue-200/80">Nossa equipe está pronta para ajudar você a ter sucesso</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Chat ao Vivo</h3>
                <p className="text-white/70 text-sm mb-3">Resposta em até 2 minutos</p>
                <div className="text-green-400 text-xs font-bold">24/7 Disponível</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Email Suporte</h3>
                <p className="text-white/70 text-sm mb-3">suporte@arcflow.com.br</p>
                <div className="text-blue-400 text-xs font-bold">Resposta em 2h</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Telefone</h3>
                <p className="text-white/70 text-sm mb-3">(11) 9999-9999</p>
                <div className="text-purple-400 text-xs font-bold">Seg-Sex 9h-18h</div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action Final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-pink-400/30 mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                🚀 Pronto para Revolucionar seu Escritório?
              </h2>
              <p className="text-xl text-white/80 mb-6 max-w-2xl mx-auto">
                Comece seu teste gratuito agora e veja como o ArcFlow pode transformar sua produtividade desde o primeiro dia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={handleComecar}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300"
                >
                  <Rocket className="h-6 w-6" />
                  <span>Começar Teste Gratuito</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                
                <div className="text-white/60 text-sm">
                  ✅ 30 dias grátis • ✅ Sem cartão • ✅ Suporte incluído
                </div>
              </div>
            </div>

            <div className="text-white/60 text-sm">
              Obrigado por conhecer o ArcFlow! Estamos ansiosos para fazer parte da sua jornada de sucesso. 💙
            </div>
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