'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Rocket,
  Brain,
  Target,
  Star,
  TrendingUp,
  Award,
  Layers,
  Folder,
  FileText,
  Users,
  Clock,
  BarChart3,
  Shield,
  Cpu,
  Database,
  Cloud,
  Palette,
  Layout,
  Code,
  Wrench
} from 'lucide-react';

interface ConfiguracaoData {
  nomeWorkspace: string;
  estruturaFolders: string[];
  templatesAtivados: string[];
  automacoesHabilitadas: string[];
  integracoes: string[];
  configuracoesBIM: {
    nivel: string;
    padroes: string[];
    bibliotecas: string[];
  };
  preferenciasUI: {
    tema: string;
    layout: string;
    dashboardCards: string[];
  };
  notificacoes: {
    tipos: string[];
    frequencia: string;
  };
}

export default function ConfiguracaoInicial() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [configurando, setConfigurando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  
  const [formData, setFormData] = useState<ConfiguracaoData>({
    nomeWorkspace: '',
    estruturaFolders: [],
    templatesAtivados: [],
    automacoesHabilitadas: [],
    integracoes: [],
    configuracoesBIM: {
      nivel: '',
      padroes: [],
      bibliotecas: []
    },
    preferenciasUI: {
      tema: 'dark',
      layout: 'moderno',
      dashboardCards: []
    },
    notificacoes: {
      tipos: [],
      frequencia: 'diaria'
    }
  });

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Configuração automática baseada nos dados coletados
    if (dados.nomeEscritorio) {
      setFormData(prev => ({
        ...prev,
        nomeWorkspace: `${dados.nomeEscritorio} - Workspace`,
        estruturaFolders: gerarEstruturaPastas(dados),
        templatesAtivados: gerarTemplatesRecomendados(dados),
        automacoesHabilitadas: dados.recomendacoes?.automacoes || [],
        configuracoesBIM: gerarConfiguracoesBIM(dados),
        preferenciasUI: {
          ...prev.preferenciasUI,
          dashboardCards: gerarDashboardCards(dados)
        }
      }));
    }
  }, []);

  // Funções para gerar configurações automáticas
  const gerarEstruturaPastas = (dados: any) => {
    const pastas = ['📁 Projetos Ativos', '📁 Templates', '📁 Biblioteca de Blocos', '📁 Documentação'];
    
    if (dados.perfilTecnico?.especialidades?.includes('arquitetura')) {
      pastas.push('📁 Arquitetura', '📁 Renderizações', '📁 Apresentações');
    }
    if (dados.perfilTecnico?.especialidades?.includes('estrutural')) {
      pastas.push('📁 Estrutural', '📁 Cálculos', '📁 Relatórios Técnicos');
    }
    if (dados.perfilTecnico?.especialidades?.includes('instalacoes')) {
      pastas.push('📁 Instalações', '📁 Memoriais', '📁 Especificações');
    }
    
    return pastas;
  };

  const gerarTemplatesRecomendados = (dados: any) => {
    return dados.recomendacoes?.templates || [];
  };

  const gerarConfiguracoesBIM = (dados: any) => {
    const nivel = dados.perfilTecnico?.nivelBIM || 'nivel0';
    const padroes = [];
    const bibliotecas = [];

    if (nivel !== 'nivel0') {
      padroes.push('Padrão de Nomenclatura BIM', 'Níveis e Grids Padronizados');
      bibliotecas.push('Biblioteca de Famílias Revit', 'Templates BIM Personalizados');
    }

    return { nivel, padroes, bibliotecas };
  };

  const gerarDashboardCards = (dados: any) => {
    const cards = ['Projetos Recentes', 'Tarefas Pendentes', 'Estatísticas'];
    
    if (dados.classificacao?.categoria === 'Escritório Líder') {
      cards.push('Analytics Avançados', 'Performance da Equipe');
    }
    
    return cards;
  };

  const etapasConfiguracao = [
    {
      titulo: 'Workspace',
      descricao: 'Configuração do ambiente de trabalho',
      icon: Layout,
      items: [
        'Criando workspace personalizado',
        'Configurando estrutura de pastas',
        'Definindo permissões de acesso'
      ]
    },
    {
      titulo: 'Templates',
      descricao: 'Ativação dos templates personalizados',
      icon: FileText,
      items: [
        'Instalando templates das suas especialidades',
        'Configurando bibliotecas de blocos',
        'Personalizando padrões de desenho'
      ]
    },
    {
      titulo: 'Automações',
      descricao: 'Habilitação das automações inteligentes',
      icon: Zap,
      items: [
        'Configurando automações baseadas no seu perfil',
        'Integrando com softwares utilizados',
        'Definindo fluxos de trabalho'
      ]
    },
    {
      titulo: 'Integrações',
      descricao: 'Conexão com ferramentas externas',
      icon: Cpu,
      items: [
        'Conectando com softwares CAD/BIM',
        'Configurando sincronização na nuvem',
        'Habilitando notificações inteligentes'
      ]
    }
  ];

  const temasDisponiveis = [
    { id: 'dark', nome: 'Escuro', preview: 'bg-gray-900', popular: true },
    { id: 'light', nome: 'Claro', preview: 'bg-white', popular: false },
    { id: 'blue', nome: 'Azul Profissional', preview: 'bg-blue-900', popular: true },
    { id: 'green', nome: 'Verde Sustentável', preview: 'bg-green-900', popular: false }
  ];

  const layoutsDisponiveis = [
    { id: 'moderno', nome: 'Moderno', descricao: 'Interface limpa e minimalista', popular: true },
    { id: 'classico', nome: 'Clássico', descricao: 'Layout tradicional familiar', popular: false },
    { id: 'compacto', nome: 'Compacto', descricao: 'Máximo aproveitamento do espaço', popular: true }
  ];

  const integracoesDisponiveis = [
    { id: 'autocad', nome: 'AutoCAD', icon: '📐', disponivel: true },
    { id: 'revit', nome: 'Revit', icon: '🏗️', disponivel: true },
    { id: 'sketchup', nome: 'SketchUp', icon: '📦', disponivel: true },
    { id: 'drive', nome: 'Google Drive', icon: '☁️', disponivel: true },
    { id: 'dropbox', nome: 'Dropbox', icon: '📁', disponivel: true },
    { id: 'onedrive', nome: 'OneDrive', icon: '🌐', disponivel: true }
  ];

  const handleInputChange = (field: keyof ConfiguracaoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof ConfiguracaoData, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const iniciarConfiguracao = async () => {
    setConfigurando(true);
    setProgresso(0);

    // Simular processo de configuração
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgresso(i);
    }

    // Salvar configuração final
    const configuracaoFinal = {
      ...dadosCompletos,
      configuracao: formData,
      etapaAtual: 4,
      configuracaoCompleta: true
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(configuracaoFinal));
    
    setTimeout(() => {
      router.push('/onboarding/v4/maturidade');
    }, 1000);
  };

  const handleBack = () => {
    router.push('/onboarding/v4/perfil-tecnico');
  };

  const formSteps = [
    {
      title: 'Workspace',
      description: 'Nome e estrutura do ambiente',
      icon: Layout
    },
    {
      title: 'Interface',
      description: 'Tema e layout preferidos',
      icon: Palette
    },
    {
      title: 'Integrações',
      description: 'Conexões com ferramentas',
      icon: Cpu
    },
    {
      title: 'Finalização',
      description: 'Revisão e configuração',
      icon: CheckCircle
    }
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.nomeWorkspace && formData.estruturaFolders.length > 0;
      case 1:
        return formData.preferenciasUI.tema && formData.preferenciasUI.layout;
      case 2:
        return true; // Integrações são opcionais
      case 3:
        return true; // Finalização sempre disponível
      default:
        return false;
    }
  };

  const canContinue = formSteps.every((_, index) => isStepComplete(index));

  if (configurando) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
          >
            <Settings className="h-16 w-16 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Configurando seu ArcFlow
          </h1>
          
          <p className="text-xl text-green-200/80 mb-8">
            Estamos personalizando tudo baseado no seu perfil...
          </p>

          {/* Barra de Progresso */}
          <div className="w-full bg-white/20 rounded-full h-4 mb-6">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <div className="text-2xl font-bold text-white mb-8">
            {progresso}%
          </div>

          {/* Etapas de Configuração */}
          <div className="space-y-4">
            {etapasConfiguracao.map((etapa, index) => {
              const EtapaIcon = etapa.icon;
              const isActive = progresso >= (index * 25);
              const isCompleted = progresso > ((index + 1) * 25);
              
              return (
                <motion.div
                  key={index}
                  className={`
                    p-4 rounded-xl border transition-all duration-500
                    ${isCompleted 
                      ? 'border-green-400 bg-green-500/20' 
                      : isActive 
                        ? 'border-blue-400 bg-blue-500/20' 
                        : 'border-white/20 bg-white/5'
                    }
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isCompleted 
                        ? 'bg-green-500' 
                        : isActive 
                          ? 'bg-blue-500' 
                          : 'bg-white/10'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <EtapaIcon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-white">{etapa.titulo}</h3>
                      <p className="text-sm text-white/70">{etapa.descricao}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

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
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Settings className="h-5 w-5 text-green-400" />
            <span className="text-white font-semibold">Etapa 4 de 4</span>
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Configuração{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              personalizada
            </span>
          </h1>
          
          <p className="text-xl text-green-200/80 max-w-3xl mx-auto">
            Baseado no seu perfil, vamos configurar automaticamente o ArcFlow para suas necessidades específicas
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
                              ? 'bg-green-600 border-green-400 text-white' 
                              : 'bg-white/10 border-white/30 text-white/50'
                          }
                        `}
                        animate={isCurrent ? { 
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 0 rgba(34,197,94,0.5)',
                            '0 0 20px rgba(34,197,94,0.8)',
                            '0 0 0 rgba(34,197,94,0.5)'
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
                  
                  {/* Step 0: Workspace */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Configuração do Workspace</h3>
                        <p className="text-green-200/70">Personalize seu ambiente de trabalho</p>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Nome do Workspace
                        </label>
                        <input
                          type="text"
                          value={formData.nomeWorkspace}
                          onChange={(e) => handleInputChange('nomeWorkspace', e.target.value)}
                          placeholder="Ex: Meu Escritório - Workspace"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Estrutura de Pastas Recomendada
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formData.estruturaFolders.map((pasta, index) => (
                            <motion.div
                              key={index}
                              className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-white text-sm">{pasta}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Templates Ativados ({formData.templatesAtivados.length})
                        </h4>
                        <div className="max-h-40 space-y-2 scroll-invisible">
                          {formData.templatesAtivados.map((template, index) => (
                            <div
                              key={index}
                              className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-sm text-blue-200"
                            >
                              ✓ {template}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Interface */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Preferências de Interface</h3>
                        <p className="text-green-200/70">Escolha o tema e layout que mais combina com você</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Tema</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {temasDisponiveis.map((tema) => (
                            <motion.button
                              key={tema.id}
                              onClick={() => handleInputChange('preferenciasUI', {
                                ...formData.preferenciasUI,
                                tema: tema.id
                              })}
                              className={`
                                p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.preferenciasUI.tema === tema.id
                                  ? 'border-green-400 bg-green-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg ${tema.preview} border border-white/20`} />
                                <div>
                                  <h5 className="font-bold">{tema.nome}</h5>
                                  {tema.popular && (
                                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                      Popular
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Layout</h4>
                        <div className="space-y-3">
                          {layoutsDisponiveis.map((layout) => (
                            <motion.button
                              key={layout.id}
                              onClick={() => handleInputChange('preferenciasUI', {
                                ...formData.preferenciasUI,
                                layout: layout.id
                              })}
                              className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${formData.preferenciasUI.layout === layout.id
                                  ? 'border-green-400 bg-green-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-bold">{layout.nome}</h5>
                                  <p className="text-sm opacity-70">{layout.descricao}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {layout.popular && (
                                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                      Popular
                                    </span>
                                  )}
                                  {formData.preferenciasUI.layout === layout.id && (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Integrações */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Armazenamento e Backup</h3>
                        <p className="text-green-200/70">Configure backup automático e sincronização opcional</p>
                      </div>

                      {/* Explicação sobre Armazenamento */}
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-400 text-lg">🔒</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Como funciona o armazenamento?</h4>
                            <div className="text-blue-200/80 text-sm space-y-1">
                              <p>• <strong>Armazenamento Principal:</strong> Todos os dados ficam nos servidores do ArcFlow</p>
                              <p>• <strong>Controle Total:</strong> Você mantém propriedade e controle dos seus arquivos</p>
                              <p>• <strong>Backup Opcional:</strong> Sincronização adicional com sua nuvem pessoal</p>
                              <p>• <strong>Continuidade Garantida:</strong> Seus projetos nunca são perdidos</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Armazenamento Principal */}
                      <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-green-400 text-lg">☁️</span>
                          </div>
                          <h4 className="text-white font-semibold">Armazenamento Principal - ArcFlow Cloud</h4>
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                            Incluído no plano
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-green-200">
                            <strong>✅ 2GB Inclusos</strong><br/>
                            <span className="text-green-200/70">Para PDFs, fotos e documentos</span>
                          </div>
                          <div className="text-green-200">
                            <strong>✅ Backup Automático</strong><br/>
                            <span className="text-green-200/70">Redundância em múltiplos servidores</span>
                          </div>
                          <div className="text-green-200">
                            <strong>✅ Expansão Flexível</strong><br/>
                            <span className="text-green-200/70">+1GB por R$ 49,90/mês</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Backup Adicional (Opcional)</h4>
                        <p className="text-white/60 text-sm mb-4">
                          Sincronize uma cópia dos seus projetos com sua nuvem pessoal para tranquilidade extra
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {integracoesDisponiveis.filter(i => ['drive', 'dropbox', 'onedrive'].includes(i.id)).map((integracao) => (
                            <motion.button
                              key={integracao.id}
                              onClick={() => handleArrayToggle('integracoes', integracao.id)}
                              className={`
                                p-3 rounded-lg border transition-all duration-300 text-left
                                ${formData.integracoes.includes(integracao.id)
                                  ? 'border-green-400 bg-green-500/20 text-white'
                                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                }
                              `}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">{integracao.icon}</div>
                                  <div>
                                    <h5 className="font-medium">{integracao.nome}</h5>
                                    <p className="text-xs opacity-70">
                                      {integracao.id === 'drive' && 'Backup adicional no Google Drive'}
                                      {integracao.id === 'dropbox' && 'Backup adicional no Dropbox'}
                                      {integracao.id === 'onedrive' && 'Backup adicional no OneDrive'}
                                    </p>
                                  </div>
                                </div>
                                {formData.integracoes.includes(integracao.id) && (
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Explicação sobre tipos de arquivos */}
                      <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-4">
                        <h4 className="text-white font-semibold mb-3">📁 O que fica armazenado no ArcFlow?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="text-orange-200">
                              <strong>Gestão de Projetos:</strong>
                              <div className="text-orange-200/70 ml-2">
                                • Cronogramas e tarefas<br/>
                                • Comunicações e aprovações<br/>
                                • Contratos e documentos<br/>
                                • Relatórios de progresso
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-orange-200">
                              <strong>Arquivos de Projeto:</strong>
                              <div className="text-orange-200/70 ml-2">
                                • Plantas e desenhos finais<br/>
                                • Especificações e memoriais<br/>
                                • Fotos e documentação<br/>
                                • Planilhas e orçamentos
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modelo de Pricing */}
                      <div className="border-t border-white/10 pt-6">
                        <h4 className="text-lg font-semibold text-white mb-4">💰 Como Funciona o Armazenamento</h4>
                        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-blue-400 text-sm">💡</span>
                            </div>
                            <div className="text-blue-200/80 text-sm">
                              <p><strong>Modelo Inteligente:</strong> Começamos com 2GB inclusos no plano básico, suficiente para centenas de PDFs, fotos e documentos de projeto. Quando precisar de mais espaço, você pode expandir por apenas R$ 49,90/mês por GB adicional.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                            <h5 className="text-white font-semibold mb-2">📁 O que cabe em 2GB?</h5>
                            <div className="text-purple-200/80 text-sm space-y-1">
                              <p>• ~2.000 PDFs de plantas</p>
                              <p>• ~10.000 fotos de obra</p>
                              <p>• ~500 documentos Word/Excel</p>
                              <p>• Centenas de projetos pequenos</p>
                            </div>
                          </div>
                          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
                            <h5 className="text-white font-semibold mb-2">🚀 Quando Expandir?</h5>
                            <div className="text-cyan-200/80 text-sm space-y-1">
                              <p>• Escritórios com +50 projetos/ano</p>
                              <p>• Muitas fotos de alta resolução</p>
                              <p>• Documentação extensa</p>
                              <p>• Histórico de vários anos</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Finalização */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Revisão Final</h3>
                        <p className="text-green-200/70">Confirme suas configurações antes de finalizar</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                            <h4 className="font-bold text-white mb-2">📊 Resumo do Perfil</h4>
                            <div className="space-y-1 text-sm text-blue-200">
                              <div>Escritório: {dadosCompletos.nomeEscritorio}</div>
                              <div>Categoria: {dadosCompletos.classificacao?.categoria}</div>
                              <div>Especialidades: {dadosCompletos.perfilTecnico?.especialidades?.length || 0}</div>
                            </div>
                          </div>

                          <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                            <h4 className="font-bold text-white mb-2">⚙️ Configurações</h4>
                            <div className="space-y-1 text-sm text-green-200">
                              <div>Workspace: {formData.nomeWorkspace}</div>
                              <div>Tema: {formData.preferenciasUI.tema}</div>
                              <div>Layout: {formData.preferenciasUI.layout}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl">
                            <h4 className="font-bold text-white mb-2">🚀 Templates</h4>
                            <div className="text-sm text-purple-200">
                              {formData.templatesAtivados.length} templates personalizados
                            </div>
                          </div>

                          <div className="p-4 bg-orange-500/20 border border-orange-400/30 rounded-xl">
                            <h4 className="font-bold text-white mb-2">⚡ Automações</h4>
                            <div className="text-sm text-orange-200">
                              {formData.automacoesHabilitadas.length} automações habilitadas
                            </div>
                          </div>

                          <div className="p-4 bg-cyan-500/20 border border-cyan-400/30 rounded-xl">
                            <h4 className="font-bold text-white mb-2">🔗 Integrações</h4>
                            <div className="text-sm text-cyan-200">
                              {formData.integracoes.length} ferramentas conectadas
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        onClick={iniciarConfiguracao}
                        className="w-full p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <Rocket className="h-6 w-6" />
                          <span>Configurar Meu ArcFlow</span>
                          <Sparkles className="h-6 w-6" />
                        </div>
                      </motion.button>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {currentStep < 3 && (
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
                    <motion.button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepComplete(currentStep)}
                      className={`
                        flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                        ${isStepComplete(currentStep)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }
                      `}
                      whileHover={isStepComplete(currentStep) ? { scale: 1.05 } : {}}
                      whileTap={isStepComplete(currentStep) ? { scale: 0.95 } : {}}
                    >
                      <span>Próximo</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Resumo em Tempo Real */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sticky top-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Configuração Inteligente</h3>
                <p className="text-green-200/70 text-sm">Baseada no seu perfil único</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
                  <h4 className="text-white font-bold mb-2">🎯 Personalização</h4>
                  <div className="text-blue-200 text-sm">
                    Sistema configurado especificamente para {dadosCompletos.classificacao?.categoria || 'seu escritório'}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                  <h4 className="text-white font-bold mb-2">⚡ Eficiência</h4>
                  <div className="text-green-200 text-sm">
                    {dadosCompletos.recomendacoes?.scoreEficiencia || 0}% de eficiência estimada
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-400/30">
                  <h4 className="text-white font-bold mb-2">🚀 Templates</h4>
                  <div className="text-orange-200 text-sm">
                    {formData.templatesAtivados.length} templates personalizados prontos
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                  <h4 className="text-white font-bold mb-2">🤖 Automações</h4>
                  <div className="text-purple-200 text-sm">
                    {formData.automacoesHabilitadas.length} automações inteligentes ativas
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}