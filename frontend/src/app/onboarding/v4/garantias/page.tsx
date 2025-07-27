'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Star,
  CheckCircle,
  Lock,
  Zap,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  Sparkles,
  Crown,
  Eye,
  Server,
  Database,
  Globe,
  Clock,
  Users,
  FileText,
  Headphones,
  RefreshCw,
  AlertTriangle,
  ThumbsUp,
  Heart,
  Umbrella,
  ShieldCheck,
  Key,
  HardDrive,
  Wifi,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  Timer,
  CheckSquare,
  XCircle,
  Info,
  Truck,
  Building,
  Flag,
  Award as Certificate,
  Fingerprint,
  CloudLightning
} from 'lucide-react';

interface GarantiaItem {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  cobertura: string;
  icon: any;
  cor: string;
  beneficios: string[];
  condicoes: string[];
  destaque: boolean;
}

interface CertificacaoItem {
  id: string;
  nome: string;
  orgao: string;
  descricao: string;
  validade: string;
  icon: any;
  cor: string;
  nivel: string;
  verificavel: boolean;
}

interface SegurancaAspecto {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  nivel: string;
  implementacao: string[];
  icon: any;
  cor: string;
  certificado: boolean;
}

export default function Garantias() {
  const router = useRouter();
  const [dadosCompletos, setDadosCompletos] = useState<any>({});
  const [categoriaAtiva, setCategoriaAtiva] = useState('garantias');
  const [garantiaSelecionada, setGarantiaSelecionada] = useState<string>('');
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [confiancaScore, setConfiancaScore] = useState(0);

  // Carregar dados das etapas anteriores
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('arcflow-onboarding-v4') || '{}');
    setDadosCompletos(dados);
    
    // Animação do score de confiança
    setTimeout(() => {
      const interval = setInterval(() => {
        setConfiancaScore(prev => {
          if (prev >= 98) {
            clearInterval(interval);
            return 98;
          }
          return prev + 2;
        });
      }, 50);
    }, 1000);
    
    // Mostrar detalhes após 3 segundos
    setTimeout(() => setMostrarDetalhes(true), 3000);
  }, []);

  const garantias: GarantiaItem[] = [
    {
      id: 'satisfacao-total',
      titulo: 'Satisfação Total',
      descricao: 'Garantia incondicional de satisfação ou seu dinheiro de volta',
      duracao: '60 dias',
      cobertura: '100% do valor pago',
      icon: Heart,
      cor: 'from-red-500 to-pink-500',
      beneficios: [
        'Reembolso integral sem perguntas',
        'Válido para qualquer motivo',
        'Processamento em até 5 dias úteis',
        'Sem taxas ou penalidades',
        'Suporte durante todo processo'
      ],
      condicoes: [
        'Válido nos primeiros 60 dias',
        'Solicitação via suporte oficial',
        'Dados podem ser exportados'
      ],
      destaque: true
    },
    {
      id: 'uptime-garantido',
      titulo: 'Uptime Garantido',
      descricao: 'Garantimos 99.9% de disponibilidade do sistema',
      duracao: 'Permanente',
      cobertura: 'Créditos proporcionais',
      icon: Server,
      cor: 'from-green-500 to-emerald-500',
      beneficios: [
        '99.9% de disponibilidade garantida',
        'Créditos automáticos por indisponibilidade',
        'Monitoramento 24/7',
        'Infraestrutura redundante',
        'SLA documentado'
      ],
      condicoes: [
        'Manutenções programadas não contam',
        'Créditos aplicados automaticamente',
        'Relatórios mensais de uptime'
      ],
      destaque: false
    },
    {
      id: 'seguranca-dados',
      titulo: 'Segurança dos Dados',
      descricao: 'Proteção total dos seus projetos e informações',
      duracao: 'Permanente',
      cobertura: 'Recuperação garantida',
      icon: ShieldCheck,
      cor: 'from-blue-500 to-cyan-500',
      beneficios: [
        'Criptografia AES-256',
        'Backup automático diário',
        'Recuperação em até 4 horas',
        'Conformidade LGPD',
        'Auditoria de segurança'
      ],
      condicoes: [
        'Backups mantidos por 1 ano',
        'Recuperação mediante autenticação',
        'Logs de acesso disponíveis'
      ],
      destaque: true
    },
    {
      id: 'suporte-premium',
      titulo: 'Suporte Premium',
      descricao: 'Atendimento especializado quando você precisar',
      duracao: 'Durante assinatura',
      cobertura: 'Suporte ilimitado',
      icon: Headphones,
      cor: 'from-purple-500 to-pink-500',
      beneficios: [
        'Resposta em até 2 horas',
        'Especialistas em arquitetura',
        'Suporte por chat, email e telefone',
        'Treinamento personalizado',
        'Consultoria técnica incluída'
      ],
      condicoes: [
        'Horário comercial para telefone',
        'Chat 24/7 para planos Pro+',
        'Treinamento agendado'
      ],
      destaque: false
    },
    {
      id: 'migracao-gratuita',
      titulo: 'Migração Gratuita',
      descricao: 'Transferimos seus dados de qualquer sistema',
      duracao: 'Primeiros 90 dias',
      cobertura: 'Migração completa',
      icon: Truck,
      cor: 'from-yellow-500 to-orange-500',
      beneficios: [
        'Migração de qualquer sistema',
        'Especialista dedicado',
        'Sem perda de dados',
        'Treinamento da equipe',
        'Suporte pós-migração'
      ],
      condicoes: [
        'Solicitação nos primeiros 90 dias',
        'Sistemas compatíveis',
        'Agendamento prévio'
      ],
      destaque: false
    },
    {
      id: 'atualizacoes-vitalicia',
      titulo: 'Atualizações Vitalícias',
      descricao: 'Sempre tenha a versão mais atual sem custos extras',
      duracao: 'Durante assinatura',
      cobertura: 'Todas as funcionalidades',
      icon: RefreshCw,
      cor: 'from-indigo-500 to-purple-500',
      beneficios: [
        'Atualizações automáticas',
        'Novos recursos inclusos',
        'Melhorias de performance',
        'Correções de segurança',
        'Sem custos adicionais'
      ],
      condicoes: [
        'Assinatura ativa',
        'Atualizações automáticas',
        'Notificações prévias'
      ],
      destaque: true
    }
  ];

  const certificacoes: CertificacaoItem[] = [
    {
      id: 'iso-27001',
      nome: 'ISO 27001',
      orgao: 'International Organization for Standardization',
      descricao: 'Gestão de Segurança da Informação',
      validade: '2024-2027',
      icon: Certificate,
      cor: 'from-blue-500 to-cyan-500',
      nivel: 'Internacional',
      verificavel: true
    },
    {
      id: 'lgpd-compliance',
      nome: 'LGPD Compliance',
      orgao: 'Autoridade Nacional de Proteção de Dados',
      descricao: 'Conformidade com Lei Geral de Proteção de Dados',
      validade: '2024',
      icon: Shield,
      cor: 'from-green-500 to-emerald-500',
      nivel: 'Nacional',
      verificavel: true
    },
    {
      id: 'pci-dss',
      nome: 'PCI DSS',
      orgao: 'Payment Card Industry Security Standards Council',
      descricao: 'Segurança para Dados de Cartão de Crédito',
      validade: '2024-2025',
      icon: CreditCard,
      cor: 'from-purple-500 to-pink-500',
      nivel: 'Internacional',
      verificavel: true
    },
    {
      id: 'soc2-type2',
      nome: 'SOC 2 Type II',
      orgao: 'American Institute of CPAs',
      descricao: 'Controles de Segurança e Disponibilidade',
      validade: '2024',
      icon: Building,
      cor: 'from-yellow-500 to-orange-500',
      nivel: 'Internacional',
      verificavel: true
    },
    {
      id: 'cau-brasil',
      nome: 'CAU Brasil',
      orgao: 'Conselho de Arquitetura e Urbanismo',
      descricao: 'Reconhecimento para Software de Arquitetura',
      validade: '2024-2026',
      icon: Flag,
      cor: 'from-red-500 to-pink-500',
      nivel: 'Nacional',
      verificavel: true
    },
    {
      id: 'crea-sp',
      nome: 'CREA-SP',
      orgao: 'Conselho Regional de Engenharia',
      descricao: 'Certificação para Software de Engenharia',
      validade: '2024-2025',
      icon: Award,
      cor: 'from-indigo-500 to-purple-500',
      nivel: 'Regional',
      verificavel: true
    }
  ];

  const aspectosSeguranca: SegurancaAspecto[] = [
    {
      id: 'criptografia',
      categoria: 'Proteção de Dados',
      titulo: 'Criptografia Militar',
      descricao: 'AES-256 para dados em repouso e TLS 1.3 para transmissão',
      nivel: 'Máximo',
      implementacao: [
        'Criptografia AES-256 bits',
        'TLS 1.3 para transmissão',
        'Chaves rotacionadas automaticamente',
        'HSM (Hardware Security Module)',
        'Zero-knowledge architecture'
      ],
      icon: Lock,
      cor: 'from-blue-500 to-cyan-500',
      certificado: true
    },
    {
      id: 'backup',
      categoria: 'Continuidade',
      titulo: 'Backup Redundante',
      descricao: 'Múltiplas cópias em datacenters geograficamente distribuídos',
      nivel: 'Empresarial',
      implementacao: [
        'Backup automático a cada 6 horas',
        '3 cópias em datacenters diferentes',
        'Retenção de 1 ano',
        'Teste de recuperação mensal',
        'RTO de 4 horas'
      ],
      icon: HardDrive,
      cor: 'from-green-500 to-emerald-500',
      certificado: true
    },
    {
      id: 'acesso',
      categoria: 'Controle de Acesso',
      titulo: 'Autenticação Multifator',
      descricao: 'Múltiplas camadas de autenticação e autorização',
      nivel: 'Avançado',
      implementacao: [
        'Autenticação de dois fatores (2FA)',
        'Single Sign-On (SSO)',
        'Biometria quando disponível',
        'Logs de acesso detalhados',
        'Sessões com timeout automático'
      ],
      icon: Fingerprint,
      cor: 'from-purple-500 to-pink-500',
      certificado: true
    },
    {
      id: 'infraestrutura',
      categoria: 'Infraestrutura',
      titulo: 'Cloud Enterprise',
      descricao: 'Infraestrutura de nível empresarial com alta disponibilidade',
      nivel: 'Empresarial',
      implementacao: [
        'AWS/Azure com SLA 99.9%',
        'Load balancing automático',
        'Auto-scaling por demanda',
        'CDN global para performance',
        'Monitoramento 24/7'
      ],
      icon: CloudLightning,
      cor: 'from-yellow-500 to-orange-500',
      certificado: true
    },
    {
      id: 'auditoria',
      categoria: 'Compliance',
      titulo: 'Auditoria Contínua',
      descricao: 'Monitoramento e auditoria constante de segurança',
      nivel: 'Profissional',
      implementacao: [
        'Logs imutáveis de auditoria',
        'Monitoramento de anomalias',
        'Relatórios de compliance',
        'Testes de penetração trimestrais',
        'Certificações anuais'
      ],
      icon: Eye,
      cor: 'from-red-500 to-pink-500',
      certificado: true
    },
    {
      id: 'privacidade',
      categoria: 'Privacidade',
      titulo: 'LGPD Compliant',
      descricao: 'Total conformidade com leis de proteção de dados',
      nivel: 'Máximo',
      implementacao: [
        'Minimização de dados coletados',
        'Consentimento explícito',
        'Direito ao esquecimento',
        'Portabilidade de dados',
        'DPO (Data Protection Officer)'
      ],
      icon: ShieldCheck,
      cor: 'from-indigo-500 to-purple-500',
      certificado: true
    }
  ];

  const categorias = [
    { 
      id: 'garantias', 
      nome: 'Garantias', 
      icon: Heart, 
      cor: 'from-red-500 to-pink-500',
      count: garantias.length,
      descricao: 'Proteções e garantias'
    },
    { 
      id: 'certificacoes', 
      nome: 'Certificações', 
      icon: Certificate, 
      cor: 'from-blue-500 to-cyan-500',
      count: certificacoes.length,
      descricao: 'Certificações oficiais'
    },
    { 
      id: 'seguranca', 
      nome: 'Segurança', 
      icon: ShieldCheck, 
      cor: 'from-green-500 to-emerald-500',
      count: aspectosSeguranca.length,
      descricao: 'Aspectos de segurança'
    }
  ];

  const handleContinue = () => {
    const dadosAtualizados = {
      ...dadosCompletos,
      garantias: {
        categoria_visualizada: categoriaAtiva,
        garantia_selecionada: garantiaSelecionada,
        confianca_score: confiancaScore,
        detalhes_visualizados: mostrarDetalhes,
        certificacoes_verificadas: certificacoes.length,
        aspectos_seguranca: aspectosSeguranca.length
      },
      etapaAtual: 11
    };

    localStorage.setItem('arcflow-onboarding-v4', JSON.stringify(dadosAtualizados));
    router.push('/onboarding/v4/conclusao');
  };

  const handleBack = () => {
    router.push('/onboarding/v4/precificacao');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl animate-spin-slow"></div>
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
            <span className="text-white font-semibold">Etapa 11 de 12</span>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
              <div className="w-[92%] h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
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
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Garantias & Segurança
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Sua tranquilidade é nossa prioridade. Proteção total, certificações internacionais e garantias sem pegadinhas.
            </p>
            <div className="mt-4">
              <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-bold">
                🛡️ 98% de Score de Confiança
              </span>
            </div>
          </motion.div>

          {/* Score de Confiança */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-500/10 to-green-500/10 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30 mb-12"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Score de Confiança ArcFlow</h2>
                <Award className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-blue-200/80">Baseado em certificações, garantias e histórico de segurança</p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - confiancaScore / 100) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {confiancaScore}%
                    </div>
                    <div className="text-blue-400 text-sm">Confiança</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{certificacoes.length}</div>
                  <div className="text-white/70 text-sm">Certificações</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{garantias.length}</div>
                  <div className="text-white/70 text-sm">Garantias</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">99.9%</div>
                  <div className="text-white/70 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navegação de Categorias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
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
                  <div className="text-sm text-white/70 mb-2">{categoria.descricao}</div>
                  <div className="text-xs text-white/60">{categoria.count} itens</div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Conteúdo por Categoria */}
          <motion.div
            key={categoriaAtiva}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            {/* Garantias */}
            {categoriaAtiva === 'garantias' && (
              <div>
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                  🛡️ Nossas Garantias para Você
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {garantias.map((garantia, index) => {
                    const IconComponent = garantia.icon;
                    
                    return (
                      <motion.div
                        key={garantia.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setGarantiaSelecionada(garantia.id === garantiaSelecionada ? '' : garantia.id)}
                        className={`
                          cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300
                          ${garantia.destaque 
                            ? 'border-yellow-400/50 bg-yellow-500/10' 
                            : 'border-white/20 bg-white/5'
                          }
                          ${garantiaSelecionada === garantia.id ? 'ring-2 ring-blue-400/50 bg-blue-500/10' : ''}
                          hover:bg-white/10
                        `}
                      >
                        {garantia.destaque && (
                          <div className="flex justify-center mb-4">
                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                              ⭐ DESTAQUE
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center mb-4">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${garantia.cor} flex items-center justify-center`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2">{garantia.titulo}</h3>
                          <p className="text-white/70 text-sm mb-4">{garantia.descricao}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                            <div className="text-center">
                              <div className="text-blue-400 font-bold">{garantia.duracao}</div>
                              <div className="text-white/60">Duração</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 font-bold">{garantia.cobertura}</div>
                              <div className="text-white/60">Cobertura</div>
                            </div>
                          </div>
                        </div>

                        {/* Detalhes Expandidos */}
                        <AnimatePresence>
                          {garantiaSelecionada === garantia.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-white/20 pt-4"
                            >
                              <div className="mb-4">
                                <h4 className="text-sm font-bold text-white mb-2">✅ Benefícios:</h4>
                                <ul className="space-y-1">
                                  {garantia.beneficios.map((beneficio, idx) => (
                                    <li key={idx} className="text-xs text-white/80 flex items-start space-x-2">
                                      <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                                      <span>{beneficio}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-bold text-white mb-2">📋 Condições:</h4>
                                <ul className="space-y-1">
                                  {garantia.condicoes.map((condicao, idx) => (
                                    <li key={idx} className="text-xs text-white/70 flex items-start space-x-2">
                                      <Info className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                                      <span>{condicao}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certificações */}
            {categoriaAtiva === 'certificacoes' && (
              <div>
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                  🏆 Certificações Oficiais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificacoes.map((cert, index) => {
                    const IconComponent = cert.icon;
                    
                    return (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="text-center mb-4">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${cert.cor} flex items-center justify-center`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2">{cert.nome}</h3>
                          <p className="text-white/70 text-sm mb-2">{cert.descricao}</p>
                          <p className="text-white/60 text-xs mb-4">{cert.orgao}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                            <div className="text-center">
                              <div className="text-purple-400 font-bold">{cert.nivel}</div>
                              <div className="text-white/60">Nível</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 font-bold">{cert.validade}</div>
                              <div className="text-white/60">Validade</div>
                            </div>
                          </div>
                          
                          {cert.verificavel && (
                            <div className="bg-green-500/20 px-3 py-2 rounded-lg border border-green-400/30">
                              <div className="flex items-center justify-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-xs font-bold">Verificável Online</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Segurança */}
            {categoriaAtiva === 'seguranca' && (
              <div>
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                  🔒 Aspectos de Segurança
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aspectosSeguranca.map((aspecto, index) => {
                    const IconComponent = aspecto.icon;
                    
                    return (
                      <motion.div
                        key={aspecto.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${aspecto.cor} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-white">{aspecto.titulo}</h3>
                              {aspecto.certificado && (
                                <Certificate className="h-4 w-4 text-yellow-400" />
                              )}
                            </div>
                            
                            <div className="text-xs text-white/60 mb-2">{aspecto.categoria}</div>
                            <p className="text-white/80 text-sm mb-4">{aspecto.descricao}</p>
                            
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-white/70">Nível de Segurança</span>
                                <span className="text-xs font-bold text-green-400">{aspecto.nivel}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-bold text-white mb-2">Implementação:</h4>
                              <ul className="space-y-1">
                                {aspecto.implementacao.map((item, idx) => (
                                  <li key={idx} className="text-xs text-white/70 flex items-start space-x-2">
                                    <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Resumo de Confiança */}
          <AnimatePresence>
            {mostrarDetalhes && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-8 border border-green-400/30 mb-12"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <ThumbsUp className="h-8 w-8 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Por que Confiar no ArcFlow?</h2>
                    <Heart className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-green-200/80">Transparência total e proteção máxima para sua tranquilidade</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">6</div>
                    <div className="text-white/70 text-sm mb-1">Garantias</div>
                    <div className="text-white/60 text-xs">Proteção total</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
                    <div className="text-white/70 text-sm mb-1">Certificações</div>
                    <div className="text-white/60 text-xs">Padrão internacional</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">6</div>
                    <div className="text-white/70 text-sm mb-1">Aspectos Segurança</div>
                    <div className="text-white/60 text-xs">Proteção máxima</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                    <div className="text-white/70 text-sm mb-1">Score Confiança</div>
                    <div className="text-white/60 text-xs">Excelência comprovada</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-3 bg-green-500/20 px-6 py-3 rounded-2xl border border-green-400/30">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <span className="text-green-400 font-bold text-lg">
                      Sua segurança e satisfação são nossa prioridade #1
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <span>Finalizar Onboarding</span>
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