'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  DollarSign, 
  Star,
  CheckCircle,
  X,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Sparkles,
  Crown,
  Award,
  Calculator,
  PiggyBank,
  TrendingDown,
  Users,
  Building,
  Rocket,
  Heart,
  Gift,
  Clock,
  BarChart3,
  FileText,
  Headphones,
  Globe,
  Lock,
  Infinity,
  AlertTriangle,
  ThumbsUp,
  Percent,
  CreditCard,
  Calendar,
  Timer
} from 'lucide-react';

interface PlanoPreco {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoAnual: number;
  economia: number;
  popular: boolean;
  recomendado: boolean;
  cor: string;
  icon: any;
  recursos: string[];
  limitacoes: string[];
  usuarios: string;
  projetos: string;
  armazenamento: string;
  suporte: string;
  garantia: string;
  trial: number;
}

interface ComparacaoRecurso {
  nome: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
  categoria: string;
}

export default function Precificacao() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [planoSelecionado, setPlanoSelecionado] = useState<string>('professional');
  const [cicloAnual, setCicloAnual] = useState(false);
  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [calculadoraAtiva, setCalculadoraAtiva] = useState(false);
  const [economiaCalculada, setEconomiaCalculada] = useState(0);
  const [projetosAno, setProjetosAno] = useState(50);
  const [valorMedioProjeto, setValorMedioProjeto] = useState(15000);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Mostrar comparação após 3 segundos
    setTimeout(() => setMostrarComparacao(true), 3000);
    
    // Calcular economia baseada nos dados do usuário
    calcularEconomia();
  }, [projetosAno, valorMedioProjeto]);

  const planosPreco: PlanoPreco[] = [
    {
      id: 'starter',
      nome: 'Starter',
      descricao: 'Perfeito para arquitetos freelancers e pequenos escritórios',
      preco: 97,
      precoAnual: 970,
      economia: 20,
      popular: false,
      recomendado: false,
      cor: 'from-blue-500 to-cyan-500',
      icon: Rocket,
      recursos: [
        'Até 3 usuários',
        '50 projetos ativos',
        '10GB de armazenamento',
        'Templates básicos (20)',
        'Briefings inteligentes',
        'Relatórios essenciais',
        'Suporte por email',
        'Integrações básicas'
      ],
      limitacoes: [
        'Sem IA especializada',
        'Sem personalização avançada',
        'Sem relatórios executivos'
      ],
      usuarios: 'Até 3',
      projetos: '50 ativos',
      armazenamento: '10GB',
      suporte: 'Email',
      garantia: '30 dias',
      trial: 14
    },
    {
      id: 'professional',
      nome: 'Professional',
      descricao: 'Ideal para escritórios estabelecidos que querem crescer',
      preco: 197,
      precoAnual: 1970,
      economia: 20,
      popular: true,
      recomendado: true,
      cor: 'from-purple-500 to-pink-500',
      icon: Crown,
      recursos: [
        'Até 10 usuários',
        'Projetos ilimitados',
        '100GB de armazenamento',
        'Todos os templates (68)',
        'IA especializada completa',
        'Personalização total',
        'Relatórios executivos',
        'Suporte prioritário',
        'Todas as integrações',
        'Análise de maturidade',
        'Cronogramas inteligentes',
        'Validação automática'
      ],
      limitacoes: [],
      usuarios: 'Até 10',
      projetos: 'Ilimitados',
      armazenamento: '100GB',
      suporte: 'Chat + Email',
      garantia: '60 dias',
      trial: 30
    },
    {
      id: 'enterprise',
      nome: 'Enterprise',
      descricao: 'Para grandes escritórios com necessidades específicas',
      preco: 397,
      precoAnual: 3970,
      economia: 20,
      popular: false,
      recomendado: false,
      cor: 'from-yellow-500 to-orange-500',
      icon: Building,
      recursos: [
        'Usuários ilimitados',
        'Projetos ilimitados',
        'Armazenamento ilimitado',
        'Templates personalizados',
        'IA + Machine Learning',
        'White-label completo',
        'API personalizada',
        'Gerente de conta dedicado',
        'Treinamento presencial',
        'Integração customizada',
        'SLA garantido',
        'Backup dedicado'
      ],
      limitacoes: [],
      usuarios: 'Ilimitados',
      projetos: 'Ilimitados',
      armazenamento: 'Ilimitado',
      suporte: 'Dedicado 24/7',
      garantia: '90 dias',
      trial: 45
    }
  ];

  const concorrentesPreco = [
    {
      nome: 'Concorrente A',
      preco: 299,
      recursos: 15,
      usuarios: 5,
      projetos: 100,
      cor: 'text-red-400',
      limitacoes: 'Muitas'
    },
    {
      nome: 'Concorrente B', 
      preco: 249,
      recursos: 22,
      usuarios: 8,
      projetos: 200,
      cor: 'text-orange-400',
      limitacoes: 'Algumas'
    },
    {
      nome: 'Concorrente C',
      preco: 399,
      recursos: 28,
      usuarios: 12,
      projetos: 500,
      cor: 'text-yellow-400',
      limitacoes: 'Poucas'
    },
    {
      nome: 'ArcFlow Pro',
      preco: 197,
      recursos: 45,
      usuarios: 10,
      projetos: 'Ilimitados',
      cor: 'text-green-400',
      limitacoes: 'Nenhuma'
    }
  ];

  const recursosComparacao: ComparacaoRecurso[] = [
    // Recursos Básicos
    { nome: 'Usuários inclusos', starter: '3', professional: '10', enterprise: 'Ilimitados', categoria: 'basico' },
    { nome: 'Projetos ativos', starter: '50', professional: 'Ilimitados', enterprise: 'Ilimitados', categoria: 'basico' },
    { nome: 'Armazenamento', starter: '10GB', professional: '100GB', enterprise: 'Ilimitado', categoria: 'basico' },
    { nome: 'Templates disponíveis', starter: '20', professional: '68', enterprise: '68 + Personalizados', categoria: 'basico' },
    
    // IA e Automação
    { nome: 'Briefings inteligentes', starter: true, professional: true, enterprise: true, categoria: 'ia' },
    { nome: 'IA especializada', starter: false, professional: true, enterprise: true, categoria: 'ia' },
    { nome: 'Geração automática', starter: false, professional: true, enterprise: true, categoria: 'ia' },
    { nome: 'Machine Learning', starter: false, professional: false, enterprise: true, categoria: 'ia' },
    
    // Personalização
    { nome: 'Interface adaptativa', starter: false, professional: true, enterprise: true, categoria: 'personalizacao' },
    { nome: 'Workflows customizados', starter: false, professional: true, enterprise: true, categoria: 'personalizacao' },
    { nome: 'White-label', starter: false, professional: false, enterprise: true, categoria: 'personalizacao' },
    { nome: 'API personalizada', starter: false, professional: false, enterprise: true, categoria: 'personalizacao' },
    
    // Relatórios
    { nome: 'Relatórios básicos', starter: true, professional: true, enterprise: true, categoria: 'relatorios' },
    { nome: 'Dashboards executivos', starter: false, professional: true, enterprise: true, categoria: 'relatorios' },
    { nome: 'Análise de maturidade', starter: false, professional: true, enterprise: true, categoria: 'relatorios' },
    { nome: 'Relatórios customizados', starter: false, professional: false, enterprise: true, categoria: 'relatorios' },
    
    // Suporte
    { nome: 'Suporte por email', starter: true, professional: true, enterprise: true, categoria: 'suporte' },
    { nome: 'Chat ao vivo', starter: false, professional: true, enterprise: true, categoria: 'suporte' },
    { nome: 'Gerente dedicado', starter: false, professional: false, enterprise: true, categoria: 'suporte' },
    { nome: 'Treinamento presencial', starter: false, professional: false, enterprise: true, categoria: 'suporte' }
  ];

  const calcularEconomia = () => {
    // Economia baseada em eficiência: 40% mais produtivo
    const horasEconomizadas = projetosAno * 8; // 8h por projeto
    const valorHora = 80; // R$ 80/hora média arquiteto
    const economiaAnual = horasEconomizadas * valorHora;
    
    // Economia em erros: 78% menos retrabalho
    const economiaErros = (valorMedioProjeto * 0.15) * projetosAno * 0.78; // 15% custo erro típico
    
    const economiaTotal = economiaAnual + economiaErros;
    setEconomiaCalculada(economiaTotal);
  };

  const planoAtual = planosPreco.find(p => p.id === planoSelecionado);
  const precoExibido = cicloAnual ? planoAtual?.precoAnual : planoAtual?.preco;
  const economiaAnual = planoAtual ? (planoAtual.preco * 12 - planoAtual.precoAnual) : 0;

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      precificacao: {
        plano_selecionado: planoSelecionado,
        ciclo_anual: cicloAnual,
        preco_mensal: planoAtual?.preco,
        preco_anual: planoAtual?.precoAnual,
        economia_calculada: economiaCalculada,
        projetos_ano: projetosAno,
        valor_medio_projeto: valorMedioProjeto,
        roi_estimado: Math.round((economiaCalculada / (precoExibido || 0)) * 100)
      },
      etapaAtual: 10
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/garantias');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/personalizacao-total');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-full blur-3xl animate-spin-slow"></div>
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
            <span className="text-white font-semibold">Etapa 10 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[83%] h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"></div>
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
              <span className="bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                Precificação Transparente
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Planos justos, sem pegadinhas. Pague apenas pelo que usar e veja o ROI desde o primeiro mês.
            </p>
            <div className="mt-4">
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                💰 Até 890% de ROI no primeiro ano
              </span>
            </div>
          </motion.div>

          {/* Toggle Anual/Mensal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCicloAnual(false)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    !cicloAnual 
                      ? 'bg-white text-slate-900 shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setCicloAnual(true)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    cicloAnual 
                      ? 'bg-white text-slate-900 shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span>Anual</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    20% OFF
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Planos de Preço */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {planosPreco.map((plano, index) => {
              const IconComponent = plano.icon;
              const precoAtual = cicloAnual ? plano.precoAnual : plano.preco;
              const precoMensal = cicloAnual ? Math.round(plano.precoAnual / 12) : plano.preco;
              const isSelected = planoSelecionado === plano.id;
              
              return (
                <motion.div
                  key={plano.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  onClick={() => setPlanoSelecionado(plano.id)}
                  className={`
                    relative cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300 transform hover:scale-105
                    ${isSelected 
                      ? 'border-white/50 bg-white/20 shadow-2xl shadow-purple-500/25' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }
                    ${plano.popular ? 'ring-2 ring-purple-400/50' : ''}
                  `}
                >
                  {/* Badge Popular */}
                  {plano.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full">
                        <span className="text-white font-bold text-sm flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span>MAIS POPULAR</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Badge Recomendado */}
                  {plano.recomendado && (
                    <div className="absolute -top-4 right-4">
                      <div className="bg-green-500 px-3 py-1 rounded-full">
                        <span className="text-white font-bold text-xs">RECOMENDADO</span>
                      </div>
                    </div>
                  )}

                  {/* Header do Plano */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plano.cor} flex items-center justify-center`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plano.nome}</h3>
                    <p className="text-white/70 text-sm mb-4">{plano.descricao}</p>
                    
                    {/* Preço */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-4xl font-bold text-white">
                          R$ {precoMensal.toLocaleString()}
                        </span>
                        <span className="text-white/60">/mês</span>
                      </div>
                      
                      {cicloAnual && (
                        <div className="mt-2">
                          <span className="text-green-400 text-sm font-bold">
                            💰 Economize R$ {(plano.preco * 12 - plano.precoAnual).toLocaleString()} por ano
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-2 text-white/60 text-sm">
                        Teste grátis por {plano.trial} dias
                      </div>
                    </div>
                  </div>

                  {/* Recursos */}
                  <div className="space-y-3 mb-6">
                    {plano.recursos.map((recurso, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/90 text-sm">{recurso}</span>
                      </div>
                    ))}
                    
                    {plano.limitacoes.map((limitacao, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <span className="text-white/60 text-sm">{limitacao}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs Rápidas */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{plano.usuarios}</div>
                      <div className="text-white/60">Usuários</div>
                    </div>
                    <div className="text-center">
                      <div className="text-pink-400 font-bold">{plano.projetos}</div>
                      <div className="text-white/60">Projetos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 font-bold">{plano.armazenamento}</div>
                      <div className="text-white/60">Storage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{plano.suporte}</div>
                      <div className="text-white/60">Suporte</div>
                    </div>
                  </div>

                  {/* Botão de Seleção */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full py-3 rounded-xl font-bold transition-all duration-300
                      ${isSelected 
                        ? `bg-gradient-to-r ${plano.cor} text-white shadow-lg` 
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }
                    `}
                  >
                    {isSelected ? 'Plano Selecionado' : 'Selecionar Plano'}
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Comparação com Concorrentes */}
          <AnimatePresence>
            {mostrarComparacao && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 backdrop-blur-lg rounded-2xl p-8 border border-green-400/30 mb-12"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Calculator className="h-8 w-8 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Melhor Custo-Benefício do Mercado</h2>
                    <PiggyBank className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-green-200/80">Compare nosso plano Professional com a concorrência</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {concorrentesPreco.map((concorrente, index) => (
                    <motion.div
                      key={concorrente.nome}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`
                        text-center p-6 rounded-xl border-2 transition-all duration-300
                        ${concorrente.nome === 'ArcFlow Pro' 
                          ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/25' 
                          : 'border-white/20 bg-white/5'
                        }
                      `}
                    >
                      <div className={`text-3xl font-bold mb-2 ${concorrente.cor}`}>
                        R$ {concorrente.preco}
                      </div>
                      <div className="text-white/70 text-xs mb-3">/mês</div>
                      
                      <div className={`text-lg font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.recursos}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Recursos</div>
                      
                      <div className={`text-sm font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.usuarios}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Usuários</div>
                      
                      <div className={`text-sm font-bold mb-2 ${concorrente.cor}`}>
                        {concorrente.projetos}
                      </div>
                      <div className="text-white/70 text-xs mb-3">Projetos</div>
                      
                      <div className={`font-semibold text-sm ${concorrente.nome === 'ArcFlow Pro' ? 'text-green-400' : 'text-white/80'}`}>
                        {concorrente.nome}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{concorrente.limitacoes} limitações</div>
                      
                      {concorrente.nome === 'ArcFlow Pro' && (
                        <div className="mt-3">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            💰 MELHOR VALOR
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-green-500/20 px-6 py-3 rounded-2xl border border-green-400/30">
                    <Award className="h-6 w-6 text-yellow-400" />
                    <span className="text-green-400 font-bold text-lg">
                      45 recursos por R$ 197 vs 28 recursos por R$ 399 da concorrência
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculadora de ROI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 mb-12"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Calculator className="h-8 w-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Calculadora de ROI</h2>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-purple-200/80">Veja quanto você vai economizar com o ArcFlow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-3">
                    Quantos projetos você faz por ano?
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={projetosAno}
                      onChange={(e) => setProjetosAno(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-white/60 text-sm mt-2">
                      <span>10</span>
                      <span className="font-bold text-purple-400">{projetosAno} projetos</span>
                      <span>200</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-3">
                    Valor médio por projeto (R$)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="1000"
                      value={valorMedioProjeto}
                      onChange={(e) => setValorMedioProjeto(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-white/60 text-sm mt-2">
                      <span>R$ 5k</span>
                      <span className="font-bold text-pink-400">R$ {(valorMedioProjeto / 1000).toFixed(0)}k</span>
                      <span>R$ 100k</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultados */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  💰 Sua Economia Anual
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Economia em tempo:</span>
                    <span className="text-green-400 font-bold">
                      R$ {(projetosAno * 8 * 80).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Redução de erros:</span>
                    <span className="text-green-400 font-bold">
                      R$ {Math.round((valorMedioProjeto * 0.15) * projetosAno * 0.78).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Economia Total:</span>
                      <span className="text-2xl font-bold text-green-400">
                        R$ {economiaCalculada.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">
                        {Math.round((economiaCalculada / (precoExibido || 1)) * 100)}%
                      </div>
                      <div className="text-green-300 text-sm">ROI no primeiro ano</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabela de Comparação Detalhada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Comparação Completa de Recursos
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white/80 font-semibold py-4 px-4">Recurso</th>
                    <th className="text-center text-white/80 font-semibold py-4 px-4">Starter</th>
                    <th className="text-center text-white/80 font-semibold py-4 px-4">Professional</th>
                    <th className="text-center text-white/80 font-semibold py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {recursosComparacao.map((recurso, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white/90">{recurso.nome}</td>
                      <td className="py-3 px-4 text-center">
                        {typeof recurso.starter === 'boolean' ? (
                          recurso.starter ? (
                            <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">{recurso.starter}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof recurso.professional === 'boolean' ? (
                          recurso.professional ? (
                            <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">{recurso.professional}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof recurso.enterprise === 'boolean' ? (
                          recurso.enterprise ? (
                            <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">{recurso.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Garantias e Benefícios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-400/30 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Garantia Total</h3>
              <p className="text-green-200/80 text-sm mb-3">
                {planoAtual?.garantia} de garantia incondicional. Não gostou? Devolvemos 100% do valor.
              </p>
              <div className="text-green-400 font-bold">Risco Zero</div>
            </div>

            <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-400/30 text-center">
              <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Teste Grátis</h3>
              <p className="text-purple-200/80 text-sm mb-3">
                {planoAtual?.trial} dias para testar todos os recursos sem compromisso.
              </p>
              <div className="text-purple-400 font-bold">Sem Cartão</div>
            </div>

            <div className="bg-yellow-500/10 rounded-2xl p-6 border border-yellow-400/30 text-center">
              <Headphones className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Suporte Premium</h3>
              <p className="text-yellow-200/80 text-sm mb-3">
                {planoAtual?.suporte} com especialistas em arquitetura e engenharia.
              </p>
              <div className="text-yellow-400 font-bold">Sempre Disponível</div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
            >
              <span>Continuar para Garantias</span>
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
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
} 