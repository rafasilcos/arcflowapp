'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';

interface MaturidadeData {
  processos: {
    organizacao: number;
    padronizacao: number;
    automacao: number;
    colaboracao: number;
  };
  tecnologia: {
    softwares: number;
    integracao: number;
    nuvem: number;
    mobilidade: number;
  };
  gestao: {
    projetos: number;
    financeiro: number;
    qualidade: number;
    prazos: number;
  };
  equipe: {
    capacitacao: number;
    produtividade: number;
    satisfacao: number;
    retencao: number;
  };
}

export default function AnaliseMaturidade() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [maturidadeAtual, setMaturidadeAtual] = useState<MaturidadeData>({
    processos: { organizacao: 3, padronizacao: 2, automacao: 1, colaboracao: 3 },
    tecnologia: { softwares: 4, integracao: 2, nuvem: 2, mobilidade: 3 },
    gestao: { projetos: 3, financeiro: 2, qualidade: 3, prazos: 2 },
    equipe: { capacitacao: 4, produtividade: 3, satisfacao: 4, retencao: 3 }
  });
  
  const [analiseCompleta, setAnaliseCompleta] = useState(false);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Análise automática baseada nos dados coletados
    setTimeout(() => {
      analisarMaturidadeAutomatica(dados);
    }, 1000);
  }, []);

  const analisarMaturidadeAutomatica = (dados: any) => {
    // Análise baseada nos dados coletados
    const novaAnalise: MaturidadeData = {
      processos: {
        organizacao: dados.perfilTecnico?.processoAtual === 'muito-organizado' ? 4 : 
                    dados.perfilTecnico?.processoAtual === 'organizado' ? 3 : 2,
        padronizacao: dados.perfilTecnico?.softwaresUtilizados?.length > 3 ? 3 : 2,
        automacao: dados.perfilTecnico?.interesseEmAutomacao > 70 ? 4 : 
                  dados.perfilTecnico?.interesseEmAutomacao > 40 ? 3 : 2,
        colaboracao: dados.numeroColaboradores > 10 ? 4 : 
                    dados.numeroColaboradores > 5 ? 3 : 2
      },
      tecnologia: {
        softwares: dados.perfilTecnico?.softwaresUtilizados?.length > 4 ? 4 : 
                  dados.perfilTecnico?.softwaresUtilizados?.length > 2 ? 3 : 2,
        integracao: dados.perfilTecnico?.nivelBim > 2 ? 4 : 
                   dados.perfilTecnico?.nivelBim > 1 ? 3 : 2,
        nuvem: dados.configuracao?.integracoes?.includes('drive') ? 3 : 2,
        mobilidade: dados.perfilTecnico?.softwaresUtilizados?.includes('mobile') ? 4 : 2
      },
      gestao: {
        projetos: dados.numeroProjetosSimultaneos > 20 ? 4 : 
                 dados.numeroProjetosSimultaneos > 10 ? 3 : 2,
        financeiro: dados.faturamentoAnual > 2000000 ? 4 : 
                   dados.faturamentoAnual > 500000 ? 3 : 2,
        qualidade: dados.perfilTecnico?.especialidades?.length > 2 ? 4 : 3,
        prazos: dados.principalDesafio?.includes('prazos') ? 2 : 3
      },
      equipe: {
        capacitacao: dados.numeroColaboradores > 15 ? 4 : 
                    dados.numeroColaboradores > 5 ? 3 : 2,
        produtividade: dados.perfilTecnico?.interesseEmIA > 60 ? 4 : 3,
        satisfacao: dados.objetivoPrincipal?.includes('equipe') ? 4 : 3,
        retencao: dados.anoFundacao < 2015 ? 4 : 3
      }
    };

    setMaturidadeAtual(novaAnalise);
    setAnaliseCompleta(true);
  };

  const calcularNivelGeral = (categoria: keyof MaturidadeData) => {
    const valores = Object.values(maturidadeAtual[categoria]);
    return Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
  };

  const calcularMaturidadeGeral = () => {
    const niveis = [
      calcularNivelGeral('processos'),
      calcularNivelGeral('tecnologia'),
      calcularNivelGeral('gestao'),
      calcularNivelGeral('equipe')
    ];
    return Math.round(niveis.reduce((a, b) => a + b, 0) / niveis.length);
  };

  const getNivelTexto = (nivel: number) => {
    switch (nivel) {
      case 1: return { texto: 'Iniciante', cor: 'text-red-400', bg: 'bg-red-500/20' };
      case 2: return { texto: 'Básico', cor: 'text-orange-400', bg: 'bg-orange-500/20' };
      case 3: return { texto: 'Intermediário', cor: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      case 4: return { texto: 'Avançado', cor: 'text-green-400', bg: 'bg-green-500/20' };
      case 5: return { texto: 'Expert', cor: 'text-blue-400', bg: 'bg-blue-500/20' };
      default: return { texto: 'Básico', cor: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const categorias = [
    {
      key: 'processos' as keyof MaturidadeData,
      nome: 'Processos',
      icon: Target,
      descricao: 'Organização e padronização',
      items: [
        { key: 'organizacao', nome: 'Organização Geral' },
        { key: 'padronizacao', nome: 'Padronização' },
        { key: 'automacao', nome: 'Automação' },
        { key: 'colaboracao', nome: 'Colaboração' }
      ]
    },
    {
      key: 'tecnologia' as keyof MaturidadeData,
      nome: 'Tecnologia',
      icon: Zap,
      descricao: 'Ferramentas e integração',
      items: [
        { key: 'softwares', nome: 'Softwares' },
        { key: 'integracao', nome: 'Integração' },
        { key: 'nuvem', nome: 'Nuvem' },
        { key: 'mobilidade', nome: 'Mobilidade' }
      ]
    },
    {
      key: 'gestao' as keyof MaturidadeData,
      nome: 'Gestão',
      icon: BarChart3,
      descricao: 'Controle e resultados',
      items: [
        { key: 'projetos', nome: 'Projetos' },
        { key: 'financeiro', nome: 'Financeiro' },
        { key: 'qualidade', nome: 'Qualidade' },
        { key: 'prazos', nome: 'Prazos' }
      ]
    },
    {
      key: 'equipe' as keyof MaturidadeData,
      nome: 'Equipe',
      icon: Users,
      descricao: 'Pessoas e capacitação',
      items: [
        { key: 'capacitacao', nome: 'Capacitação' },
        { key: 'produtividade', nome: 'Produtividade' },
        { key: 'satisfacao', nome: 'Satisfação' },
        { key: 'retencao', nome: 'Retenção' }
      ]
    }
  ];

  const potencialComArcFlow = {
    processos: { organizacao: 5, padronizacao: 5, automacao: 5, colaboracao: 5 },
    tecnologia: { softwares: 5, integracao: 5, nuvem: 5, mobilidade: 5 },
    gestao: { projetos: 5, financeiro: 5, qualidade: 5, prazos: 5 },
    equipe: { capacitacao: 5, produtividade: 5, satisfacao: 5, retencao: 5 }
  };

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      maturidade: {
        atual: maturidadeAtual,
        potencial: potencialComArcFlow,
        nivelGeral: calcularMaturidadeGeral(),
        analiseCompleta: true
      },
      etapaAtual: 5
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/templates');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/configuracao-inicial');
  };

  const maturidadeGeral = calcularMaturidadeGeral();
  const nivelGeral = getNivelTexto(maturidadeGeral);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            <span className="text-white font-semibold">Etapa 5 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[41.67%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          <div className="w-20"></div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Análise de Maturidade
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Vamos analisar o nível atual do seu escritório e mostrar o potencial de crescimento com o ArcFlow
            </p>
          </motion.div>

          {/* Análise Geral */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: analiseCompleta ? 1 : 0.5, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Nível Atual de Maturidade</h2>
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl ${nivelGeral.bg} border border-white/20`}>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < maturidadeGeral ? 'text-yellow-400 fill-current' : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xl font-bold ${nivelGeral.cor}`}>
                  {nivelGeral.texto}
                </span>
                <span className="text-white/70">({maturidadeGeral}/5)</span>
              </div>
            </div>

            {/* Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorias.map((categoria, index) => {
                const nivel = calcularNivelGeral(categoria.key);
                const nivelInfo = getNivelTexto(nivel);
                const IconComponent = categoria.icon;

                return (
                  <motion.div
                    key={categoria.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: analiseCompleta ? 1 : 0.3, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{categoria.nome}</h3>
                        <p className="text-xs text-white/60">{categoria.descricao}</p>
                      </div>
                    </div>

                    <div className={`text-center py-2 px-3 rounded-lg ${nivelInfo.bg} mb-4`}>
                      <span className={`font-bold ${nivelInfo.cor}`}>{nivelInfo.texto}</span>
                      <div className="text-white/70 text-sm">{nivel}/5</div>
                    </div>

                    <div className="space-y-2">
                      {categoria.items.map((item) => {
                        const valor = maturidadeAtual[categoria.key][item.key as keyof typeof maturidadeAtual[typeof categoria.key]];
                        return (
                          <div key={item.key} className="flex items-center justify-between text-sm">
                            <span className="text-white/70">{item.nome}</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < valor ? 'bg-purple-400' : 'bg-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Potencial com ArcFlow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: analiseCompleta ? 1 : 0.3, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-2xl p-8 border border-green-400/30 mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Seu Potencial com ArcFlow</h2>
              <p className="text-green-200/80">Veja como você pode alcançar o nível máximo em todas as áreas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorias.map((categoria, index) => {
                const nivelAtual = calcularNivelGeral(categoria.key);
                const IconComponent = categoria.icon;

                return (
                  <div key={categoria.key} className="bg-white/5 rounded-xl p-6 border border-green-400/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{categoria.nome}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-orange-400">{nivelAtual}/5</span>
                          <ArrowRight className="h-3 w-3 text-white/60" />
                          <span className="text-green-400 font-bold">5/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/20 text-center py-2 px-3 rounded-lg border border-green-400/30">
                      <span className="font-bold text-green-400">Expert</span>
                      <div className="text-green-200/80 text-sm">Nível Máximo</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-3 bg-green-500/20 px-6 py-3 rounded-2xl border border-green-400/30">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span className="text-green-400 font-bold text-lg">
                  Crescimento Potencial: {((5 - maturidadeGeral) / maturidadeGeral * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Insights e Recomendações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: analiseCompleta ? 1 : 0.3, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎯 Principais Oportunidades de Melhoria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="h-8 w-8 text-blue-400" />
                  <h3 className="font-bold text-white">Automação</h3>
                </div>
                <p className="text-blue-200/80 text-sm">
                  Automatize tarefas repetitivas e ganhe 40% mais tempo para criação
                </p>
              </div>

              <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-400/30">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                  <h3 className="font-bold text-white">Gestão</h3>
                </div>
                <p className="text-purple-200/80 text-sm">
                  Controle financeiro e de prazos em tempo real para melhor lucratividade
                </p>
              </div>

              <div className="bg-green-500/10 rounded-xl p-6 border border-green-400/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-8 w-8 text-green-400" />
                  <h3 className="font-bold text-white">Colaboração</h3>
                </div>
                <p className="text-green-200/80 text-sm">
                  Integre equipe e clientes em um ambiente colaborativo único
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleContinue}
              disabled={!analiseCompleta}
              whileHover={{ scale: analiseCompleta ? 1.05 : 1 }}
              whileTap={{ scale: analiseCompleta ? 0.95 : 1 }}
              className={`
                flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
                ${analiseCompleta
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
                }
              `}
            >
              <span>Continuar para Templates</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}