'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OnboardingSucesso() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dadosOnboarding, setDadosOnboarding] = useState<any>(null);

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosBasicos = JSON.parse(localStorage.getItem('onboarding_dados_basicos') || '{}');
    const identificacao = JSON.parse(localStorage.getItem('onboarding_identificacao') || '{}');
    const perfilTecnico = JSON.parse(localStorage.getItem('onboarding_perfil_tecnico') || '{}');
    const configuracao = JSON.parse(localStorage.getItem('onboarding_configuracao') || '{}');

    setDadosOnboarding({
      dadosBasicos,
      identificacao,
      perfilTecnico,
      configuracao
    });

    // Trigger confetti após 1 segundo
    setTimeout(() => setShowConfetti(true), 1000);
  }, []);

  // Animação dos steps de resumo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleIniciarArcFlow = () => {
    // Limpar dados do onboarding
    localStorage.removeItem('onboarding_dados_basicos');
    localStorage.removeItem('onboarding_identificacao');
    localStorage.removeItem('onboarding_perfil_tecnico');
    localStorage.removeItem('onboarding_configuracao');
    
    // Marcar onboarding como concluído
    localStorage.setItem('onboarding_concluido', 'true');
    
    // Redirecionar para dashboard
    router.push('/dashboard');
  };

  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
            transition: {
              duration: Math.random() * 3 + 2,
              ease: "easeOut"
            }
          }}
        />
      ))}
    </div>
  );

  if (!dadosOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header com Celebração */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-4xl"
              >
                🎉
              </motion.span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Parabéns!
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Seu ArcFlow foi configurado com sucesso! 🚀<br/>
            Agora você está pronto para revolucionar a gestão dos seus projetos.
          </motion.p>
        </motion.div>

        {/* Resumo da Configuração */}
        <div className="max-w-6xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-3xl font-bold text-white text-center mb-8"
          >
            ✨ Resumo da Sua Configuração
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Dados Básicos */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: currentStep >= 0 ? 1 : 0.3, y: 0 }}
              transition={{ delay: 1.4 }}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${
                currentStep >= 0 ? 'border-green-400/50 shadow-lg shadow-green-400/20' : 'border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-green-400 text-xl">👤</span>
                </div>
                <h3 className="text-white font-semibold">Perfil Criado</h3>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <p><strong>Escritório:</strong> {dadosOnboarding.dadosBasicos.nomeEscritorio || 'Não informado'}</p>
                <p><strong>Responsável:</strong> {dadosOnboarding.dadosBasicos.nomeResponsavel || 'Não informado'}</p>
                <p><strong>Cidade:</strong> {dadosOnboarding.dadosBasicos.cidade || 'Não informado'}</p>
              </div>
            </motion.div>

            {/* Card 2: Identificação */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0.3, y: 0 }}
              transition={{ delay: 1.6 }}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${
                currentStep >= 1 ? 'border-blue-400/50 shadow-lg shadow-blue-400/20' : 'border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 text-xl">🏢</span>
                </div>
                <h3 className="text-white font-semibold">Escritório Analisado</h3>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <p><strong>Classificação:</strong> {dadosOnboarding.identificacao.classificacao || 'Não definida'}</p>
                <p><strong>Colaboradores:</strong> {dadosOnboarding.identificacao.colaboradores || 'Não informado'}</p>
                <p><strong>Especialidades:</strong> {dadosOnboarding.perfilTecnico.especialidades?.length || 0} selecionadas</p>
              </div>
            </motion.div>

            {/* Card 3: Perfil Técnico */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: currentStep >= 2 ? 1 : 0.3, y: 0 }}
              transition={{ delay: 1.8 }}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${
                currentStep >= 2 ? 'border-purple-400/50 shadow-lg shadow-purple-400/20' : 'border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 text-xl">⚙️</span>
                </div>
                <h3 className="text-white font-semibold">Tecnologia Mapeada</h3>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <p><strong>Softwares:</strong> {dadosOnboarding.perfilTecnico.softwares?.length || 0} identificados</p>
                <p><strong>Nível BIM:</strong> {dadosOnboarding.perfilTecnico.nivelBim || 0}/3</p>
                <p><strong>IA/Automação:</strong> {dadosOnboarding.perfilTecnico.interesseIA || 0}% interesse</p>
              </div>
            </motion.div>

            {/* Card 4: Configuração */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: currentStep >= 3 ? 1 : 0.3, y: 0 }}
              transition={{ delay: 2.0 }}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${
                currentStep >= 3 ? 'border-pink-400/50 shadow-lg shadow-pink-400/20' : 'border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-pink-400 text-xl">🚀</span>
                </div>
                <h3 className="text-white font-semibold">Sistema Configurado</h3>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <p><strong>Workspace:</strong> {dadosOnboarding.configuracao.nomeWorkspace || 'ArcFlow Workspace'}</p>
                <p><strong>Tema:</strong> {dadosOnboarding.configuracao.tema || 'Escuro'}</p>
                <p><strong>Armazenamento:</strong> 2GB + expansão flexível</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Próximos Passos */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            🎯 Seus Próximos Passos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-green-400 text-2xl">📁</span>
              </div>
              <h3 className="text-white font-semibold mb-2">1. Criar Primeiro Projeto</h3>
              <p className="text-white/70 text-sm">
                Comece criando seu primeiro projeto e explore todas as funcionalidades do ArcFlow.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-blue-400 text-2xl">👥</span>
              </div>
              <h3 className="text-white font-semibold mb-2">2. Convidar Equipe</h3>
              <p className="text-white/70 text-sm">
                Adicione colaboradores e clientes para trabalhar em conjunto nos projetos.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-purple-400 text-2xl">🎓</span>
              </div>
              <h3 className="text-white font-semibold mb-2">3. Explorar Recursos</h3>
              <p className="text-white/70 text-sm">
                Acesse tutoriais, templates e automações personalizadas para seu perfil.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas Motivacionais */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              🏆 Você Está Pronto Para Decolar!
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                <div className="text-white/70 text-sm">Redução no tempo de gestão</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">3x</div>
                <div className="text-white/70 text-sm">Mais projetos organizados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-white/70 text-sm">Controle dos seus dados</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botão Final */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
          className="text-center"
        >
          <motion.button
            onClick={handleIniciarArcFlow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg shadow-green-500/25 transition-all duration-300"
          >
            🚀 Iniciar ArcFlow
          </motion.button>
          
          <p className="text-white/60 text-sm mt-4">
            Clique para acessar seu dashboard personalizado
          </p>
        </motion.div>

        {/* Footer Motivacional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-center mt-16"
        >
          <p className="text-white/40 text-sm">
            "O futuro da arquitetura e engenharia começa agora. Bem-vindo ao ArcFlow!" ✨
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}