'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  BarChart3,
  Calendar,
  MapPin,
  Briefcase,
  Rocket,
  Brain
} from 'lucide-react';

interface EscritorioData {
  nomeEscritorio: string;
  cidadeEstado: string;
  anoFundacao: number;
  numeroColaboradores: string;
  faturamentoAnual: string;
  numeroProjetosSimultaneos: number;
  principalDesafio: string[];
  objetivoPrincipal: string;
  nivelTecnologico: string;
  metaProximoAno: string;
  interesseEmInovacao: number;
}

export default function IdentificacaoEscritorio() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EscritorioData>({
    nomeEscritorio: '',
    cidadeEstado: '',
    anoFundacao: new Date().getFullYear(),
    numeroColaboradores: '',
    faturamentoAnual: '',
    numeroProjetosSimultaneos: 0,
    principalDesafio: [],
    objetivoPrincipal: '',
    nivelTecnologico: '',
    metaProximoAno: '',
    interesseEmInovacao: 5
  });

  const [classificacao, setClassificacao] = useState({
    categoria: '',
    potencial: '',
    score: 0,
    recomendacoes: [] as string[]
  });

  // Opções para os campos
  const colaboradoresOptions = [
    { value: 'Solo', label: 'Solo (apenas eu)', icon: '👤', color: 'from-blue-500 to-cyan-500' },
    { value: '2-5', label: '2-5 pessoas', icon: '👥', color: 'from-green-500 to-emerald-500' },
    { value: '6-15', label: '6-15 pessoas', icon: '🏢', color: 'from-purple-500 to-pink-500' },
    { value: '16-30', label: '16-30 pessoas', icon: '🏗️', color: 'from-orange-500 to-red-500' },
    { value: '31-50', label: '31-50 pessoas', icon: '🏭', color: 'from-indigo-500 to-purple-500' },
    { value: '50+', label: 'Mais de 50', icon: '🌆', color: 'from-pink-500 to-rose-500' }
  ];

  const faturamentoOptions = [
    { value: 'Até 500k', label: 'Até R$ 500k/ano', icon: '💰', multiplier: 1 },
    { value: '500k-2M', label: 'R$ 500k - 2M/ano', icon: '💎', multiplier: 2 },
    { value: '2M-10M', label: 'R$ 2M - 10M/ano', icon: '🏆', multiplier: 4 },
    { value: '10M-50M', label: 'R$ 10M - 50M/ano', icon: '👑', multiplier: 8 },
    { value: '50M+', label: 'Mais de R$ 50M/ano', icon: '🚀', multiplier: 16 }
  ];

  const desafiosOptions = [
    'Organização de projetos',
    'Controle de prazos',
    'Gestão financeira',
    'Comunicação com clientes',
    'Qualidade dos briefings',
    'Padronização de processos',
    'Crescimento da equipe',
    'Tecnologia desatualizada',
    'Competitividade no mercado',
    'Conformidade normativa'
  ];

  const objetivosOptions = [
    { value: 'Organização', label: 'Organizar processos', icon: '📋', color: 'from-blue-500 to-cyan-500' },
    { value: 'Crescimento', label: 'Crescer rapidamente', icon: '📈', color: 'from-green-500 to-emerald-500' },
    { value: 'Otimização', label: 'Otimizar operações', icon: '⚡', color: 'from-purple-500 to-pink-500' },
    { value: 'Inovação', label: 'Inovar no mercado', icon: '🚀', color: 'from-orange-500 to-red-500' }
  ];

  const nivelTecnologicoOptions = [
    { value: 'Básico', label: 'Básico (planilhas, e-mail)', icon: '📊', score: 1 },
    { value: 'Intermediário', label: 'Intermediário (alguns softwares)', icon: '💻', score: 2 },
    { value: 'Avançado', label: 'Avançado (integrado, BIM)', icon: '🤖', score: 3 }
  ];

  // Classificação automática em tempo real
  useEffect(() => {
    const calcularClassificacao = () => {
      // Só calcular se tiver dados básicos
      if (!formData.nomeEscritorio && !formData.anoFundacao && !formData.numeroColaboradores) {
        console.log('⏳ Aguardando dados básicos...');
        return;
      }

      let score = 0;
      let categoria = '';
      let potencial = '';
      let recomendacoes: string[] = [];
      
      // Debug: vamos ver os dados
      console.log('🔍 DADOS PARA ANÁLISE:', formData);

      // Score baseado no porte
      const colaboradores = formData.numeroColaboradores;
      let scoreColaboradores = 0;
      if (colaboradores === 'Solo') scoreColaboradores = 1;
      else if (colaboradores === '2-5') scoreColaboradores = 2;
      else if (colaboradores === '6-15') scoreColaboradores = 3;
      else if (colaboradores === '16-30') scoreColaboradores = 4;
      else if (colaboradores === '31-50') scoreColaboradores = 5;
      else if (colaboradores === '50+') scoreColaboradores = 6;
      score += scoreColaboradores;
      console.log(`👥 Colaboradores: ${colaboradores} = +${scoreColaboradores} pontos`);

      // Score baseado no faturamento
      const faturamento = formData.faturamentoAnual;
      let scoreFaturamento = 0;
      if (faturamento === 'Até 500k') scoreFaturamento = 1;
      else if (faturamento === '500k-2M') scoreFaturamento = 2;
      else if (faturamento === '2M-10M') scoreFaturamento = 4;
      else if (faturamento === '10M-50M') scoreFaturamento = 6;
      else if (faturamento === '50M+') scoreFaturamento = 8;
      score += scoreFaturamento;
      console.log(`💰 Faturamento: ${faturamento} = +${scoreFaturamento} pontos`);

      // Score baseado na experiência (anos no mercado)
      const anosExperiencia = new Date().getFullYear() - formData.anoFundacao;
      let scoreExperiencia = 0;
      if (anosExperiencia >= 30) scoreExperiencia = 4; // 30+ anos = muito experiente
      else if (anosExperiencia >= 20) scoreExperiencia = 3; // 20-29 anos = experiente
      else if (anosExperiencia >= 10) scoreExperiencia = 2; // 10-19 anos = estabelecido
      else if (anosExperiencia >= 5) scoreExperiencia = 1; // 5-9 anos = em crescimento
      // 0-4 anos = iniciante (sem pontos extras)
      score += scoreExperiencia;
      console.log(`📅 Experiência: ${anosExperiencia} anos (desde ${formData.anoFundacao}) = +${scoreExperiencia} pontos`);

      // Score baseado na tecnologia
      const tecnologia = formData.nivelTecnologico;
      let scoreTecnologia = 0;
      if (tecnologia === 'Básico') scoreTecnologia = 1;
      else if (tecnologia === 'Intermediário') scoreTecnologia = 2;
      else if (tecnologia === 'Avançado') scoreTecnologia = 3;
      score += scoreTecnologia;
      console.log(`💻 Tecnologia: ${tecnologia} = +${scoreTecnologia} pontos`);

      // Score baseado no interesse em inovação
      const scoreInovacao = Math.floor(formData.interesseEmInovacao / 2);
      score += scoreInovacao;
      console.log(`🚀 Inovação: ${formData.interesseEmInovacao}/10 = +${scoreInovacao} pontos`);

      // Score baseado no número de projetos simultâneos
      let scoreProjetos = 0;
      if (formData.numeroProjetosSimultaneos >= 50) scoreProjetos = 3;
      else if (formData.numeroProjetosSimultaneos >= 20) scoreProjetos = 2;
      else if (formData.numeroProjetosSimultaneos >= 10) scoreProjetos = 1;
      score += scoreProjetos;
      console.log(`📊 Projetos: ${formData.numeroProjetosSimultaneos} = +${scoreProjetos} pontos`);
      
      console.log(`🎯 SCORE TOTAL: ${score}/30`);

      // Classificação (score máximo agora é ~30)
      if (score <= 8) {
        categoria = 'Escritório Iniciante';
        potencial = 'Alto potencial de crescimento';
        recomendacoes = [
          'Templates básicos para organização',
          'Briefings simplificados',
          'Automação de processos básicos'
        ];
        console.log('📊 CLASSIFICAÇÃO: Iniciante (0-8 pontos)');
      } else if (score <= 15) {
        categoria = 'Escritório em Crescimento';
        potencial = 'Excelente momento para escalar';
        recomendacoes = [
          'Templates especializados por tipologia',
          'Briefings detalhados',
          'IA para otimização de processos'
        ];
        console.log('📊 CLASSIFICAÇÃO: Em Crescimento (9-15 pontos)');
      } else if (score <= 22) {
        categoria = 'Escritório Estabelecido';
        potencial = 'Pronto para inovação';
        recomendacoes = [
          'Todos os 68 templates disponíveis',
          'Personalização total',
          'IA avançada e analytics'
        ];
        console.log('📊 CLASSIFICAÇÃO: Estabelecido (16-22 pontos)');
      } else {
        categoria = 'Escritório Líder';
        potencial = 'Referência no mercado';
        recomendacoes = [
          'Configuração enterprise completa',
          'Templates customizados avançados',
          'Integração com sistemas corporativos'
        ];
        console.log('📊 CLASSIFICAÇÃO: Líder (23+ pontos)');
      }

      console.log('✅ RESULTADO FINAL:', { categoria, potencial, score, recomendacoes });
      setClassificacao({ categoria, potencial, score, recomendacoes });
    };

    calcularClassificacao();
  }, [formData]);

  const handleInputChange = (field: keyof EscritorioData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDesafioToggle = (desafio: string) => {
    setFormData(prev => ({
      ...prev,
      principalDesafio: prev.principalDesafio.includes(desafio)
        ? prev.principalDesafio.filter(d => d !== desafio)
        : [...prev.principalDesafio, desafio]
    }));
  };

  const handleContinue = () => {
    // Salvar dados no localStorage
    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify({
      ...formData,
      classificacao,
      etapaAtual: 2
    }));
    
    router.push('/onboarding/v4/perfil-tecnico');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/impacto');
  };

  const formSteps = [
    {
      title: 'Dados Básicos',
      description: 'Informações fundamentais do seu escritório',
      icon: Building2
    },
    {
      title: 'Porte e Estrutura',
      description: 'Tamanho e capacidade atual',
      icon: Users
    },
    {
      title: 'Desafios e Objetivos',
      description: 'O que você quer alcançar',
      icon: Target
    },
    {
      title: 'Perfil Tecnológico',
      description: 'Nível atual de tecnologia',
      icon: Brain
    }
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.nomeEscritorio && formData.cidadeEstado && formData.anoFundacao;
      case 1:
        return formData.numeroColaboradores && formData.faturamentoAnual && formData.numeroProjetosSimultaneos > 0;
      case 2:
        return formData.principalDesafio.length > 0 && formData.objetivoPrincipal && formData.metaProximoAno;
      case 3:
        return formData.nivelTecnologico && formData.interesseEmInovacao > 0;
      default:
        return false;
    }
  };

  const canContinue = formSteps.every((_, index) => isStepComplete(index));

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Building2 className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold">Etapa 2 de 12</span>
            <Sparkles className="h-5 w-5 text-purple-400" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Vamos conhecer seu{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              escritório
            </span>
          </h1>
          
          <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
            Com essas informações, nossa IA vai personalizar completamente o ArcFlow para suas necessidades específicas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {formSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = isStepComplete(index);
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <motion.div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                          ${isCompleted 
                            ? 'bg-green-500 border-green-400 text-white' 
                            : isCurrent 
                              ? 'bg-blue-600 border-blue-400 text-white' 
                              : 'bg-white/10 border-white/30 text-white/50'
                          }
                        `}
                        animate={isCurrent ? { 
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 0 rgba(59,130,246,0.5)',
                            '0 0 20px rgba(59,130,246,0.8)',
                            '0 0 0 rgba(59,130,246,0.5)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        onClick={() => setCurrentStep(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <StepIcon className="h-5 w-5" />
                      </motion.div>
                      
                      {index < formSteps.length - 1 && (
                        <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-white/20'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {/* Step 0: Dados Básicos */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Dados Básicos</h3>
                        <p className="text-blue-200/70">Vamos começar com as informações fundamentais</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">
                            Nome do escritório *
                          </label>
                          <input
                            type="text"
                            value={formData.nomeEscritorio}
                            onChange={(e) => handleInputChange('nomeEscritorio', e.target.value)}
                            placeholder="Ex: Arquitetura & Engenharia Silva"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">
                            Cidade e Estado *
                          </label>
                          <input
                            type="text"
                            value={formData.cidadeEstado}
                            onChange={(e) => handleInputChange('cidadeEstado', e.target.value)}
                            placeholder="Ex: São Paulo, SP"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">
                            Ano de fundação *
                          </label>
                          <input
                            type="number"
                            value={formData.anoFundacao}
                            onChange={(e) => handleInputChange('anoFundacao', parseInt(e.target.value))}
                            min="1950"
                            max={new Date().getFullYear()}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Porte e Estrutura */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Porte e Estrutura</h3>
                        <p className="text-blue-200/70">Entenda o tamanho e capacidade do seu escritório</p>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">
                          Número de colaboradores *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {colaboradoresOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleInputChange('numeroColaboradores', option.value)}
                              className={`
                                p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.numeroColaboradores === option.value
                                  ? 'border-blue-400 bg-blue-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{option.icon}</span>
                                <span className="font-medium">{option.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">
                          Faturamento anual *
                        </label>
                        <div className="space-y-3">
                          {faturamentoOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleInputChange('faturamentoAnual', option.value)}
                              className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.faturamentoAnual === option.value
                                  ? 'border-green-400 bg-green-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{option.icon}</span>
                                <span className="font-medium">{option.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Projetos simultâneos (média) *
                        </label>
                        <input
                          type="number"
                          value={formData.numeroProjetosSimultaneos}
                          onChange={(e) => handleInputChange('numeroProjetosSimultaneos', parseInt(e.target.value) || 0)}
                          min="1"
                          max="200"
                          placeholder="Ex: 15"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Desafios e Objetivos */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Desafios e Objetivos</h3>
                        <p className="text-blue-200/70">O que você quer alcançar com o ArcFlow</p>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">
                          Principais desafios (selecione até 3) *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {desafiosOptions.map((desafio) => (
                            <motion.button
                              key={desafio}
                              onClick={() => handleDesafioToggle(desafio)}
                              disabled={!formData.principalDesafio.includes(desafio) && formData.principalDesafio.length >= 3}
                              className={`
                                p-3 rounded-xl border-2 transition-all duration-300 text-left text-sm
                                ${formData.principalDesafio.includes(desafio)
                                  ? 'border-purple-400 bg-purple-500/20 text-white'
                                  : formData.principalDesafio.length >= 3
                                    ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed'
                                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={formData.principalDesafio.includes(desafio) || formData.principalDesafio.length < 3 ? { scale: 1.02 } : {}}
                              whileTap={formData.principalDesafio.includes(desafio) || formData.principalDesafio.length < 3 ? { scale: 0.98 } : {}}
                            >
                              {desafio}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">
                          Objetivo principal *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {objetivosOptions.map((objetivo) => (
                            <motion.button
                              key={objetivo.value}
                              onClick={() => handleInputChange('objetivoPrincipal', objetivo.value)}
                              className={`
                                p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.objetivoPrincipal === objetivo.value
                                  ? 'border-orange-400 bg-orange-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{objetivo.icon}</span>
                                <span className="font-medium">{objetivo.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Meta para o próximo ano *
                        </label>
                        <textarea
                          value={formData.metaProximoAno}
                          onChange={(e) => handleInputChange('metaProximoAno', e.target.value)}
                          placeholder="Ex: Aumentar faturamento em 50%, organizar processos, contratar 3 arquitetos..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Perfil Tecnológico */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Perfil Tecnológico</h3>
                        <p className="text-blue-200/70">Seu nível atual de adoção tecnológica</p>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">
                          Nível tecnológico atual *
                        </label>
                        <div className="space-y-3">
                          {nivelTecnologicoOptions.map((nivel) => (
                            <motion.button
                              key={nivel.value}
                              onClick={() => handleInputChange('nivelTecnologico', nivel.value)}
                              className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.nivelTecnologico === nivel.value
                                  ? 'border-cyan-400 bg-cyan-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{nivel.icon}</span>
                                <span className="font-medium">{nivel.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">
                          Interesse em inovação (1-10) *
                        </label>
                        <div className="space-y-4">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.interesseEmInovacao}
                            onChange={(e) => handleInputChange('interesseEmInovacao', parseInt(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-white/60">
                            <span>1 - Conservador</span>
                            <span className="text-xl font-bold text-white">{formData.interesseEmInovacao}</span>
                            <span>10 - Inovador</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <motion.button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Voltar</span>
                </motion.button>

                <div className="flex items-center space-x-4">
                  {currentStep < formSteps.length - 1 ? (
                    <motion.button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepComplete(currentStep)}
                      className={`
                        flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                        ${isStepComplete(currentStep)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }
                      `}
                      whileHover={isStepComplete(currentStep) ? { scale: 1.05 } : {}}
                      whileTap={isStepComplete(currentStep) ? { scale: 0.95 } : {}}
                    >
                      <span>Próximo</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleContinue}
                      disabled={!canContinue}
                      className={`
                        flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                        ${canContinue
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }
                      `}
                      whileHover={canContinue ? { scale: 1.05, y: -2 } : {}}
                      whileTap={canContinue ? { scale: 0.95 } : {}}
                    >
                      <span>Continuar para Perfil Técnico</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Classificação em Tempo Real */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sticky top-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Análise em Tempo Real</h3>
                <p className="text-blue-200/70 text-sm">Nossa IA está analisando seu perfil</p>
              </div>

              <AnimatePresence mode="wait">
                {classificacao.categoria && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
                      <h4 className="text-white font-bold mb-1">Classificação</h4>
                      <p className="text-blue-200">{classificacao.categoria}</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                      <h4 className="text-white font-bold mb-1">Potencial</h4>
                      <p className="text-green-200">{classificacao.potencial}</p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-400/30">
                      <h4 className="text-white font-bold mb-2">Score de Maturidade</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(classificacao.score / 30) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <span className="text-white font-bold">{classificacao.score}/30</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                      <h4 className="text-white font-bold mb-2">Recomendações</h4>
                      <ul className="space-y-1">
                        {classificacao.recomendacoes.map((rec, index) => (
                          <li key={index} className="text-purple-200 text-sm flex items-start space-x-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}