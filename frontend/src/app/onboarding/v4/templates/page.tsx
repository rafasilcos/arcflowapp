'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  Star,
  CheckCircle,
  Building,
  Home,
  Factory,
  Hospital,
  ShoppingBag,
  Zap,
  Crown,
  Trophy,
  Target,
  Eye,
  Download
} from 'lucide-react';

interface Template {
  id: string;
  nome: string;
  categoria: string;
  especialidade: string;
  complexidade: number;
  tempoEconomizado: string;
  icon: any;
  preview: string;
  destaque: boolean;
  novo: boolean;
}

export default function DemonstracaoTemplates() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [categoriaAtiva, setCategoriaAtiva] = useState('residencial');
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null);
  const [mostrarComparacao, setMostrarComparacao] = useState(false);
  const [animacaoContador, setAnimacaoContador] = useState(false);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Iniciar animação do contador após 1 segundo
    setTimeout(() => setAnimacaoContador(true), 1000);
    
    // Mostrar comparação após 3 segundos
    setTimeout(() => setMostrarComparacao(true), 3000);
  }, []);

  const templates: Template[] = [
    // Residencial
    { id: 'casa-terrea-simples', nome: 'Casa Térrea Simples', categoria: 'residencial', especialidade: 'Arquitetura', complexidade: 2, tempoEconomizado: '8h', icon: Home, preview: 'bg-gradient-to-br from-green-400 to-emerald-500', destaque: true, novo: false },
    { id: 'casa-terrea-media', nome: 'Casa Térrea Média', categoria: 'residencial', especialidade: 'Arquitetura', complexidade: 3, tempoEconomizado: '12h', icon: Home, preview: 'bg-gradient-to-br from-blue-400 to-cyan-500', destaque: true, novo: false },
    { id: 'casa-terrea-alto', nome: 'Casa Térrea Alto Padrão', categoria: 'residencial', especialidade: 'Arquitetura', complexidade: 4, tempoEconomizado: '20h', icon: Home, preview: 'bg-gradient-to-br from-purple-400 to-pink-500', destaque: true, novo: false },
    { id: 'sobrado-medio', nome: 'Sobrado Médio Padrão', categoria: 'residencial', especialidade: 'Arquitetura', complexidade: 4, tempoEconomizado: '18h', icon: Building, preview: 'bg-gradient-to-br from-orange-400 to-red-500', destaque: false, novo: true },
    { id: 'apartamento-simples', nome: 'Apartamento Simples', categoria: 'residencial', especialidade: 'Arquitetura', complexidade: 3, tempoEconomizado: '10h', icon: Building, preview: 'bg-gradient-to-br from-teal-400 to-green-500', destaque: false, novo: true },
    { id: 'condominio-horizontal', nome: 'Condomínio Horizontal', categoria: 'residencial', especialidade: 'Arquitetura', complexidade: 5, tempoEconomizado: '35h', icon: Building, preview: 'bg-gradient-to-br from-indigo-400 to-purple-500', destaque: false, novo: false },

    // Comercial
    { id: 'escritorio-pequeno', nome: 'Escritório Pequeno', categoria: 'comercial', especialidade: 'Arquitetura', complexidade: 2, tempoEconomizado: '6h', icon: Building, preview: 'bg-gradient-to-br from-blue-400 to-indigo-500', destaque: true, novo: false },
    { id: 'loja-varejo', nome: 'Loja de Varejo', categoria: 'comercial', especialidade: 'Arquitetura', complexidade: 3, tempoEconomizado: '12h', icon: ShoppingBag, preview: 'bg-gradient-to-br from-pink-400 to-rose-500', destaque: true, novo: false },
    { id: 'restaurante', nome: 'Restaurante', categoria: 'comercial', especialidade: 'Arquitetura', complexidade: 4, tempoEconomizado: '16h', icon: ShoppingBag, preview: 'bg-gradient-to-br from-yellow-400 to-orange-500', destaque: false, novo: true },
    { id: 'coworking', nome: 'Espaço de Coworking', categoria: 'comercial', especialidade: 'Arquitetura', complexidade: 3, tempoEconomizado: '14h', icon: Building, preview: 'bg-gradient-to-br from-cyan-400 to-blue-500', destaque: false, novo: true },

    // Industrial
    { id: 'galpao-simples', nome: 'Galpão Industrial Simples', categoria: 'industrial', especialidade: 'Arquitetura', complexidade: 3, tempoEconomizado: '15h', icon: Factory, preview: 'bg-gradient-to-br from-gray-400 to-slate-500', destaque: true, novo: false },
    { id: 'fabrica-media', nome: 'Fábrica Média', categoria: 'industrial', especialidade: 'Arquitetura', complexidade: 4, tempoEconomizado: '25h', icon: Factory, preview: 'bg-gradient-to-br from-red-400 to-orange-500', destaque: false, novo: false },
    { id: 'centro-distribuicao', nome: 'Centro de Distribuição', categoria: 'industrial', especialidade: 'Arquitetura', complexidade: 5, tempoEconomizado: '40h', icon: Factory, preview: 'bg-gradient-to-br from-emerald-400 to-teal-500', destaque: false, novo: true },

    // Institucional
    { id: 'clinica-medica', nome: 'Clínica Médica', categoria: 'institucional', especialidade: 'Arquitetura', complexidade: 4, tempoEconomizado: '22h', icon: Hospital, preview: 'bg-gradient-to-br from-green-400 to-emerald-500', destaque: true, novo: false },
    { id: 'escola-infantil', nome: 'Escola Infantil', categoria: 'institucional', especialidade: 'Arquitetura', complexidade: 4, tempoEconomizado: '28h', icon: Hospital, preview: 'bg-gradient-to-br from-purple-400 to-indigo-500', destaque: false, novo: true },
    { id: 'posto-saude', nome: 'Posto de Saúde', categoria: 'institucional', especialidade: 'Arquitetura', complexidade: 5, tempoEconomizado: '35h', icon: Hospital, preview: 'bg-gradient-to-br from-blue-400 to-cyan-500', destaque: false, novo: false }
  ];

  const categorias = [
    { id: 'residencial', nome: 'Residencial', icon: Home, cor: 'from-green-500 to-emerald-500', count: templates.filter(t => t.categoria === 'residencial').length },
    { id: 'comercial', nome: 'Comercial', icon: Building, cor: 'from-blue-500 to-cyan-500', count: templates.filter(t => t.categoria === 'comercial').length },
    { id: 'industrial', nome: 'Industrial', icon: Factory, cor: 'from-orange-500 to-red-500', count: templates.filter(t => t.categoria === 'industrial').length },
    { id: 'institucional', nome: 'Institucional', icon: Hospital, cor: 'from-purple-500 to-pink-500', count: templates.filter(t => t.categoria === 'institucional').length }
  ];

  const concorrentes = [
    { nome: 'Concorrente A', templates: 3, cor: 'text-red-400' },
    { nome: 'Concorrente B', templates: 5, cor: 'text-orange-400' },
    { nome: 'Concorrente C', templates: 4, cor: 'text-yellow-400' },
    { nome: 'ArcFlow', templates: 68, cor: 'text-green-400' }
  ];

  const templatesAtivos = templates.filter(t => t.categoria === categoriaAtiva);
  const templatesDestaque = templatesAtivos.filter(t => t.destaque);
  const templatesNovos = templatesAtivos.filter(t => t.novo);

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      templates: {
        visualizados: templates.length,
        categoria_preferida: categoriaAtiva,
        template_selecionado: templateSelecionado?.id,
        demonstracao_completa: true
      },
      etapaAtual: 6
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/briefings');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/maturidade');
  };

  const ContadorAnimado = ({ valor, label }: { valor: number; label: string }) => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: animacaoContador ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 200, delay: Math.random() * 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-4xl font-bold text-white mb-2"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {animacaoContador ? valor : 0}
        </motion.span>
      </motion.div>
      <div className="text-white/70 text-sm">{label}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>
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
            <span className="text-white font-semibold">Etapa 6 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[50%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
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
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Demonstração de Superioridade
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              68 templates especializados vs 3-5 dos concorrentes. Veja a diferença que faz ter o sistema mais completo do mercado.
            </p>
          </motion.div>

          {/* Comparação com Concorrentes */}
          <AnimatePresence>
            {mostrarComparacao && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/30 mb-12"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">Comparação com o Mercado</h2>
                    <Crown className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-yellow-200/80">Veja por que o ArcFlow é líder absoluto em templates especializados</p>
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
                      <div className={`text-4xl font-bold mb-2 ${concorrente.cor}`}>
                        <ContadorAnimado valor={concorrente.templates} label="" />
                      </div>
                      <div className="text-white/70 text-sm mb-2">Templates</div>
                      <div className={`font-semibold ${concorrente.nome === 'ArcFlow' ? 'text-green-400' : 'text-white/80'}`}>
                        {concorrente.nome}
                      </div>
                      {concorrente.nome === 'ArcFlow' && (
                        <div className="mt-2">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            🏆 LÍDER
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-green-500/20 px-6 py-3 rounded-2xl border border-green-400/30">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    <span className="text-green-400 font-bold text-lg">
                      1.360% mais templates que a média dos concorrentes
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categorias de Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Escolha uma Categoria para Explorar
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categorias.map((categoria) => {
                const IconComponent = categoria.icon;
                const isActive = categoriaAtiva === categoria.id;
                
                return (
                  <motion.button
                    key={categoria.id}
                    onClick={() => setCategoriaAtiva(categoria.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                    <div className="text-sm text-white/70">{categoria.count} templates</div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Templates da Categoria Ativa */}
          <motion.div
            key={categoriaAtiva}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {/* Templates em Destaque */}
            {templatesDestaque.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>Templates em Destaque</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {templatesDestaque.map((template, index) => {
                    const IconComponent = template.icon;
                    
                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setTemplateSelecionado(template)}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30 cursor-pointer hover:bg-white/15 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-12 h-12 rounded-xl ${template.preview} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                              {template.nome}
                            </h4>
                            <div className="text-sm text-white/70">{template.especialidade}</div>
                          </div>
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-white/70">Complexidade:</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < template.complexidade ? 'bg-yellow-400' : 'bg-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-green-400 font-bold">
                            Economiza {template.tempoEconomizado}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Novos Templates */}
            {templatesNovos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span>Novos Templates</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">NOVO</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templatesNovos.map((template, index) => {
                    const IconComponent = template.icon;
                    
                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setTemplateSelecionado(template)}
                        className="bg-white/5 rounded-xl p-4 border border-blue-400/30 cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {template.nome}
                            </h4>
                          </div>
                        </div>
                        
                        <div className="text-xs text-green-400 font-bold">
                          Economiza {template.tempoEconomizado}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Todos os Templates */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <span>Todos os Templates - {categoriaAtiva.charAt(0).toUpperCase() + categoriaAtiva.slice(1)}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {templatesAtivos.map((template, index) => {
                  const IconComponent = template.icon;
                  
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setTemplateSelecionado(template)}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 hover:border-indigo-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm group-hover:text-indigo-400 transition-colors">
                            {template.nome}
                          </h4>
                          <div className="text-xs text-white/60">{template.especialidade}</div>
                        </div>
                        {template.destaque && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                        {template.novo && <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs">NOVO</span>}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < template.complexidade ? 'bg-indigo-400' : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-green-400 font-bold">
                          {template.tempoEconomizado}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Estatísticas Finais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-indigo-400/30 mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              🚀 Impacto dos Nossos Templates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-400 mb-2">68</div>
                <div className="text-white/70 text-sm">Templates Únicos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                <div className="text-white/70 text-sm">Tempo Economizado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
                <div className="text-white/70 text-sm">Especialidades</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-white/70 text-sm">Personalizáveis</div>
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
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <span>Continuar para Briefings</span>
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