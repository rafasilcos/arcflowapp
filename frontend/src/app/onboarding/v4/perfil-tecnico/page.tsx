'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Cpu, 
  Code, 
  Layers, 
  Zap, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Circle,
  Building,
  Wrench,
  Lightbulb,
  BarChart3,
  Settings,
  Rocket,
  Brain,
  Target,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';

interface PerfilTecnicoData {
  especialidades: string[];
  softwaresUtilizados: string[];
  processoAtual: string;
  principalDificuldade: string[];
  interesseEmAutomacao: number;
  tempoMedioProjetoPorFase: {
    conceitual: number;
    anteprojeto: number;
    executivo: number;
    detalhamento: number;
  };
  utilizaBIM: string;
  nivelBIM: string;
  interesseEmIA: number;
  metaEficiencia: string;
}

export default function PerfilTecnico() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PerfilTecnicoData>({
    especialidades: [],
    softwaresUtilizados: [],
    processoAtual: '',
    principalDificuldade: [],
    interesseEmAutomacao: 5,
    tempoMedioProjetoPorFase: {
      conceitual: 0,
      anteprojeto: 0,
      executivo: 0,
      detalhamento: 0
    },
    utilizaBIM: '',
    nivelBIM: '',
    interesseEmIA: 5,
    metaEficiencia: ''
  });

  const [recomendacoes, setRecomendacoes] = useState({
    templates: [] as string[],
    automacoes: [] as string[],
    melhorias: [] as string[],
    scoreEficiencia: 0
  });

  // Dados das especialidades
  const especialidadesOptions = [
    { 
      id: 'arquitetura', 
      label: 'Arquitetura', 
      icon: '🏛️', 
      color: 'from-blue-500 to-cyan-500',
      templates: ['Residencial', 'Comercial', 'Institucional', 'Paisagismo']
    },
    { 
      id: 'estrutural', 
      label: 'Engenharia Estrutural', 
      icon: '🏗️', 
      color: 'from-orange-500 to-red-500',
      templates: ['Concreto Armado', 'Estrutura Metálica', 'Madeira', 'Alvenaria']
    },
    { 
      id: 'instalacoes', 
      label: 'Instalações Prediais', 
      icon: '⚡', 
      color: 'from-yellow-500 to-orange-500',
      templates: ['Hidráulicas', 'Elétricas', 'AVAC', 'PPCI', 'Gases']
    },
    { 
      id: 'urbanismo', 
      label: 'Urbanismo', 
      icon: '🌆', 
      color: 'from-green-500 to-emerald-500',
      templates: ['Loteamentos', 'Planos Diretores', 'Mobilidade']
    },
    { 
      id: 'interiores', 
      label: 'Design de Interiores', 
      icon: '🛋️', 
      color: 'from-purple-500 to-pink-500',
      templates: ['Residencial', 'Comercial', 'Corporativo']
    },
    { 
      id: 'sustentabilidade', 
      label: 'Sustentabilidade', 
      icon: '🌱', 
      color: 'from-green-600 to-teal-500',
      templates: ['LEED', 'AQUA', 'Eficiência Energética']
    }
  ];

  const softwaresOptions = [
    { categoria: 'CAD/Desenho', softwares: ['AutoCAD', 'DraftSight', 'ZWCAD', 'BricsCAD'] },
    { categoria: 'BIM/3D', softwares: ['Revit', 'ArchiCAD', 'SketchUp', 'Vectorworks', 'Tekla'] },
    { categoria: 'Renderização', softwares: ['3ds Max', 'V-Ray', 'Lumion', 'Enscape', 'Corona'] },
    { categoria: 'Estrutural', softwares: ['SAP2000', 'ETABS', 'Robot', 'TQS', 'Cypecad', 'Eberick'] },
    { categoria: 'Instalações', softwares: ['QiBuilder', 'Hydros', 'DDS-CAD', 'MEP', 'AltoQi'] },
    { categoria: 'Gestão', softwares: ['MS Project', 'Primavera', 'Trello', 'Asana', 'Monday', 'Planilhas'] }
  ];

  const processosOptions = [
    { 
      value: 'tradicional', 
      label: 'Processo Tradicional', 
      description: 'CAD 2D, entregas por fase, pouca integração',
      icon: '📐',
      eficiencia: 60
    },
    { 
      value: 'semi-bim', 
      label: 'Semi-BIM', 
      description: 'Mistura CAD e BIM, algumas disciplinas integradas',
      icon: '🔄',
      eficiencia: 75
    },
    { 
      value: 'bim-completo', 
      label: 'BIM Completo', 
      description: 'Modelo único, todas disciplinas integradas',
      icon: '🏗️',
      eficiencia: 90
    },
    { 
      value: 'bim-avancado', 
      label: 'BIM Avançado + IA', 
      description: 'BIM + automação, IA e análises avançadas',
      icon: '🤖',
      eficiencia: 95
    }
  ];

  const dificuldadesOptions = [
    'Compatibilização entre disciplinas',
    'Controle de versões de arquivos',
    'Padronização de desenhos',
    'Cálculos repetitivos',
    'Geração de documentação',
    'Quantitativos e orçamentos',
    'Revisões e aprovações',
    'Comunicação com equipe',
    'Backup e organização',
    'Atualização de normas'
  ];

  const nivelBIMOptions = [
    { value: 'nivel0', label: 'Nível 0 - CAD 2D', description: 'Desenhos 2D tradicionais', score: 1 },
    { value: 'nivel1', label: 'Nível 1 - CAD 3D', description: 'Modelos 3D isolados', score: 2 },
    { value: 'nivel2', label: 'Nível 2 - BIM Colaborativo', description: 'Modelo compartilhado', score: 3 },
    { value: 'nivel3', label: 'Nível 3 - BIM Integrado', description: 'Integração total + IA', score: 4 }
  ];

  // Cálculo de recomendações em tempo real
  useEffect(() => {
    const calcularRecomendacoes = () => {
      let templates: string[] = [];
      let automacoes: string[] = [];
      let melhorias: string[] = [];
      let scoreEficiencia = 0;

      // Templates baseados nas especialidades
      formData.especialidades.forEach(esp => {
        const especialidade = especialidadesOptions.find(e => e.id === esp);
        if (especialidade) {
          templates.push(...especialidade.templates.map(t => `${especialidade.label}: ${t}`));
        }
      });

      // Score de eficiência baseado no processo atual
      const processo = processosOptions.find(p => p.value === formData.processoAtual);
      if (processo) {
        scoreEficiencia += processo.eficiencia * 0.4;
      }

      // Score baseado no BIM
      const bimLevel = nivelBIMOptions.find(n => n.value === formData.nivelBIM);
      if (bimLevel) {
        scoreEficiencia += bimLevel.score * 10;
      }

      // Score baseado no interesse em automação e IA
      scoreEficiencia += (formData.interesseEmAutomacao + formData.interesseEmIA) * 2;

             // Automações recomendadas baseadas nas especialidades
       if (formData.interesseEmAutomacao >= 7) {
         if (formData.especialidades.includes('arquitetura')) {
           automacoes.push('Geração automática de plantas');
           automacoes.push('Quantitativos automáticos');
         }
         if (formData.especialidades.includes('estrutural')) {
           automacoes.push('Cálculos estruturais automatizados');
           automacoes.push('Dimensionamento automático');
         }
         if (formData.especialidades.includes('instalacoes')) {
           automacoes.push('Cálculos hidráulicos automatizados');
           automacoes.push('Dimensionamento elétrico automático');
         }
         // Automações gerais
         if (formData.especialidades.length > 0) {
           automacoes.push('Compatibilização automática entre disciplinas');
         }
       }
       
       if (formData.interesseEmIA >= 7) {
         if (formData.especialidades.includes('arquitetura')) {
           automacoes.push('IA para otimização de layouts');
           automacoes.push('Sugestões inteligentes de materiais');
         }
         if (formData.especialidades.includes('estrutural')) {
           automacoes.push('IA para otimização estrutural');
         }
         if (formData.especialidades.includes('instalacoes')) {
           automacoes.push('IA para eficiência energética');
         }
         // IA geral
         automacoes.push('Análise automática de normas');
       }

      // Melhorias baseadas nas dificuldades
      if (formData.principalDificuldade.includes('Compatibilização entre disciplinas')) {
        melhorias.push('Sistema de detecção automática de interferências');
      }
      if (formData.principalDificuldade.includes('Controle de versões de arquivos')) {
        melhorias.push('Versionamento automático com backup na nuvem');
      }
      if (formData.principalDificuldade.includes('Padronização de desenhos')) {
        melhorias.push('Templates padronizados com bibliotecas de blocos');
      }

      setRecomendacoes({
        templates: templates.slice(0, 8), // Limitar a 8 templates
        automacoes: automacoes.slice(0, 6),
        melhorias: melhorias.slice(0, 5),
        scoreEficiencia: Math.min(100, Math.round(scoreEficiencia))
      });
    };

    calcularRecomendacoes();
  }, [formData]);

  const handleInputChange = (field: keyof PerfilTecnicoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEspecialidadeToggle = (especialidadeId: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidadeId)
        ? prev.especialidades.filter(e => e !== especialidadeId)
        : [...prev.especialidades, especialidadeId]
    }));
  };

  const handleSoftwareToggle = (software: string) => {
    setFormData(prev => ({
      ...prev,
      softwaresUtilizados: prev.softwaresUtilizados.includes(software)
        ? prev.softwaresUtilizados.filter(s => s !== software)
        : [...prev.softwaresUtilizados, software]
    }));
  };

  const handleDificuldadeToggle = (dificuldade: string) => {
    setFormData(prev => ({
      ...prev,
      principalDificuldade: prev.principalDificuldade.includes(dificuldade)
        ? prev.principalDificuldade.filter(d => d !== dificuldade)
        : [...prev.principalDificuldade, dificuldade]
    }));
  };

  const handleTempoChange = (fase: keyof typeof formData.tempoMedioProjetoPorFase, valor: number) => {
    setFormData(prev => ({
      ...prev,
      tempoMedioProjetoPorFase: {
        ...prev.tempoMedioProjetoPorFase,
        [fase]: valor
      }
    }));
  };

  const handleContinue = () => {
    // Recuperar dados anteriores e adicionar os novos
    const dadosAnteriores = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    
    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify({
      ...dadosAnteriores,
      perfilTecnico: formData,
      recomendacoes,
      etapaAtual: 3
    }));
    
    router.push('/onboarding/v4/configuracao-inicial');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/identificacao');
  };

  const formSteps = [
    {
      title: 'Especialidades',
      description: 'Áreas de atuação do escritório',
      icon: Building
    },
    {
      title: 'Ferramentas',
      description: 'Softwares e processos atuais',
      icon: Settings
    },
    {
      title: 'Dificuldades',
      description: 'Principais desafios técnicos',
      icon: Target
    },
    {
      title: 'Automação & IA',
      description: 'Interesse em tecnologias avançadas',
      icon: Brain
    }
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.especialidades.length > 0;
      case 1:
        return formData.softwaresUtilizados.length > 0 && formData.processoAtual;
      case 2:
        return formData.principalDificuldade.length > 0;
      case 3:
        return formData.utilizaBIM && formData.interesseEmAutomacao > 0 && formData.interesseEmIA > 0;
      default:
        return false;
    }
  };

  const canContinue = formSteps.every((_, index) => isStepComplete(index));

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Cpu className="h-5 w-5 text-purple-400" />
            <span className="text-white font-semibold">Etapa 3 de 12</span>
            <Sparkles className="h-5 w-5 text-pink-400" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Mapeamento do seu{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              perfil técnico
            </span>
          </h1>
          
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Vamos personalizar os templates e automações baseado nas suas especialidades e processos atuais
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
                              ? 'bg-purple-600 border-purple-400 text-white' 
                              : 'bg-white/10 border-white/30 text-white/50'
                          }
                        `}
                        animate={isCurrent ? { 
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 0 rgba(147,51,234,0.5)',
                            '0 0 20px rgba(147,51,234,0.8)',
                            '0 0 0 rgba(147,51,234,0.5)'
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
                  
                  {/* Step 0: Especialidades */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Especialidades do Escritório</h3>
                        <p className="text-purple-200/70">Selecione todas as áreas em que vocês atuam</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {especialidadesOptions.map((especialidade) => (
                          <motion.button
                            key={especialidade.id}
                            onClick={() => handleEspecialidadeToggle(especialidade.id)}
                            className={`
                              p-6 rounded-xl border-2 transition-all duration-300 text-left
                              ${formData.especialidades.includes(especialidade.id)
                                ? 'border-purple-400 bg-purple-500/20 text-white'
                                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start space-x-4">
                              <span className="text-3xl">{especialidade.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-2">{especialidade.label}</h4>
                                <div className="flex flex-wrap gap-1">
                                  {especialidade.templates.map((template, idx) => (
                                    <span 
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-white/10 rounded-full"
                                    >
                                      {template}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {formData.especialidades.includes(especialidade.id) && (
                                <CheckCircle className="h-6 w-6 text-green-400" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Ferramentas */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Ferramentas e Processos</h3>
                        <p className="text-purple-200/70">Softwares utilizados e processo atual de trabalho</p>
                      </div>

                                             {/* Softwares */}
                       <div>
                         <h4 className="text-lg font-semibold text-white mb-4">Softwares Utilizados</h4>
                         
                         {/* Mensagem informativa */}
                         {formData.especialidades.length === 0 && (
                           <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                             <p className="text-blue-200 text-sm">
                               💡 <strong>Dica:</strong> Selecione suas especialidades na etapa anterior para ver softwares específicos da sua área!
                             </p>
                           </div>
                         )}
                         
                         {softwaresOptions
                           .filter((categoria) => {
                             // Lógica para mostrar categorias baseado nas especialidades selecionadas
                             switch (categoria.categoria) {
                               case 'Estrutural':
                                 return formData.especialidades.includes('estrutural');
                               case 'Instalações':
                                 return formData.especialidades.includes('instalacoes');
                               case 'CAD/Desenho':
                               case 'BIM/3D':
                               case 'Renderização':
                               case 'Gestão':
                                 return true; // Sempre mostrar essas categorias básicas
                               default:
                                 return true;
                             }
                           })
                           .map((categoria) => (
                           <div key={categoria.categoria} className="mb-6">
                             <h5 className="text-md font-medium text-purple-200 mb-3">
                               {categoria.categoria}
                               {(categoria.categoria === 'Estrutural' || categoria.categoria === 'Instalações') && (
                                 <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                   Baseado nas suas especialidades
                                 </span>
                               )}
                             </h5>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                               {categoria.softwares.map((software) => (
                                 <motion.button
                                   key={software}
                                   onClick={() => handleSoftwareToggle(software)}
                                   className={`
                                     p-3 rounded-lg border transition-all duration-200 text-sm
                                     ${formData.softwaresUtilizados.includes(software)
                                       ? 'border-purple-400 bg-purple-500/20 text-white'
                                       : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                     }
                                   `}
                                   whileHover={{ scale: 1.02 }}
                                   whileTap={{ scale: 0.98 }}
                                 >
                                   {software}
                                 </motion.button>
                               ))}
                             </div>
                           </div>
                         ))}
                      </div>

                      {/* Processo Atual */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Processo Atual de Trabalho</h4>
                        <div className="space-y-3">
                          {processosOptions.map((processo) => (
                            <motion.button
                              key={processo.value}
                              onClick={() => handleInputChange('processoAtual', processo.value)}
                              className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.processoAtual === processo.value
                                  ? 'border-purple-400 bg-purple-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center space-x-4">
                                <span className="text-2xl">{processo.icon}</span>
                                <div className="flex-1">
                                  <h5 className="font-bold">{processo.label}</h5>
                                  <p className="text-sm opacity-70">{processo.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-green-400">
                                    {processo.eficiencia}% eficiência
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Dificuldades */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Principais Dificuldades</h3>
                        <p className="text-purple-200/70">Selecione os maiores desafios técnicos do seu escritório</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dificuldadesOptions.map((dificuldade) => (
                          <motion.button
                            key={dificuldade}
                            onClick={() => handleDificuldadeToggle(dificuldade)}
                            className={`
                              p-4 rounded-xl border-2 transition-all duration-300 text-left
                              ${formData.principalDificuldade.includes(dificuldade)
                                ? 'border-red-400 bg-red-500/20 text-white'
                                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{dificuldade}</span>
                              {formData.principalDificuldade.includes(dificuldade) ? (
                                <CheckCircle className="h-5 w-5 text-red-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-white/30" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Tempo por Fase */}
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Tempo Médio por Fase (em dias)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(formData.tempoMedioProjetoPorFase).map(([fase, tempo]) => (
                            <div key={fase}>
                              <label className="block text-white font-medium mb-2 capitalize">
                                {fase}
                              </label>
                              <input
                                type="number"
                                value={tempo}
                                onChange={(e) => handleTempoChange(fase as keyof typeof formData.tempoMedioProjetoPorFase, parseInt(e.target.value) || 0)}
                                min="0"
                                max="365"
                                placeholder="0"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Automação & IA */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Automação & Inteligência Artificial</h3>
                        <p className="text-purple-200/70">Seu interesse em tecnologias avançadas</p>
                      </div>

                      {/* Utiliza BIM */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Utiliza metodologia BIM?</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {['Sim', 'Não'].map((opcao) => (
                            <motion.button
                              key={opcao}
                              onClick={() => handleInputChange('utilizaBIM', opcao)}
                              className={`
                                p-4 rounded-xl border-2 transition-all duration-300
                                ${formData.utilizaBIM === opcao
                                  ? 'border-cyan-400 bg-cyan-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {opcao}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Nível BIM */}
                      {formData.utilizaBIM === 'Sim' && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Nível BIM Atual</h4>
                          <div className="space-y-3">
                            {nivelBIMOptions.map((nivel) => (
                              <motion.button
                                key={nivel.value}
                                onClick={() => handleInputChange('nivelBIM', nivel.value)}
                                className={`
                                  w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                                  ${formData.nivelBIM === nivel.value
                                    ? 'border-cyan-400 bg-cyan-500/20 text-white'
                                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                  }
                                `}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-bold">{nivel.label}</h5>
                                    <p className="text-sm opacity-70">{nivel.description}</p>
                                  </div>
                                  <div className="flex">
                                    {[...Array(nivel.score)].map((_, i) => (
                                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interesse em Automação */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Interesse em Automação (1-10)
                        </h4>
                        <div className="space-y-4">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.interesseEmAutomacao}
                            onChange={(e) => handleInputChange('interesseEmAutomacao', parseInt(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-white/60">
                            <span>1 - Baixo</span>
                            <span className="text-xl font-bold text-white">{formData.interesseEmAutomacao}</span>
                            <span>10 - Alto</span>
                          </div>
                        </div>
                      </div>

                      {/* Interesse em IA */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Interesse em Inteligência Artificial (1-10)
                        </h4>
                        <div className="space-y-4">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.interesseEmIA}
                            onChange={(e) => handleInputChange('interesseEmIA', parseInt(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-white/60">
                            <span>1 - Baixo</span>
                            <span className="text-xl font-bold text-white">{formData.interesseEmIA}</span>
                            <span>10 - Alto</span>
                          </div>
                        </div>
                      </div>

                      {/* Meta de Eficiência */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Meta de Melhoria</h4>
                        <textarea
                          value={formData.metaEficiencia}
                          onChange={(e) => handleInputChange('metaEficiencia', e.target.value)}
                          placeholder="Ex: Reduzir tempo de projeto em 30%, automatizar cálculos repetitivos..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
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
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
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
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }
                      `}
                      whileHover={canContinue ? { scale: 1.05, y: -2 } : {}}
                      whileTap={canContinue ? { scale: 0.95 } : {}}
                    >
                      <span>Continuar para Configuração</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recomendações em Tempo Real */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sticky top-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Personalização em Tempo Real</h3>
                <p className="text-purple-200/70 text-sm">Templates e automações recomendadas</p>
              </div>

              <AnimatePresence mode="wait">
                {(recomendacoes.templates.length > 0 || recomendacoes.automacoes.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Score de Eficiência */}
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                      <h4 className="text-white font-bold mb-2">Score de Eficiência</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-white/20 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${recomendacoes.scoreEficiencia}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <span className="text-white font-bold">{recomendacoes.scoreEficiencia}%</span>
                      </div>
                    </div>

                    {/* Templates Recomendados */}
                    {recomendacoes.templates.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
                        <h4 className="text-white font-bold mb-2">Templates Personalizados</h4>
                        <ul className="space-y-1">
                          {recomendacoes.templates.slice(0, 5).map((template, index) => (
                            <li key={index} className="text-blue-200 text-sm flex items-start space-x-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{template}</span>
                            </li>
                          ))}
                          {recomendacoes.templates.length > 5 && (
                            <li className="text-blue-300 text-sm font-medium">
                              +{recomendacoes.templates.length - 5} templates adicionais
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Automações Recomendadas */}
                    {recomendacoes.automacoes.length > 0 && (
                      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-400/30">
                        <h4 className="text-white font-bold mb-2">Automações Sugeridas</h4>
                        <ul className="space-y-1">
                          {recomendacoes.automacoes.map((automacao, index) => (
                            <li key={index} className="text-orange-200 text-sm flex items-start space-x-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span>{automacao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Melhorias Sugeridas */}
                    {recomendacoes.melhorias.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                        <h4 className="text-white font-bold mb-2">Melhorias Prioritárias</h4>
                        <ul className="space-y-1">
                          {recomendacoes.melhorias.map((melhoria, index) => (
                            <li key={index} className="text-purple-200 text-sm flex items-start space-x-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{melhoria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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