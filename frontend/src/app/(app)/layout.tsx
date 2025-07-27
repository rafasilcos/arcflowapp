'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Building2, Home, UserCheck, ClipboardList, Calendar, 
  DollarSign, FolderOpen, Users, BarChart3, FileText,
  Settings, Bell, Search, Menu, X, ChevronDown, LogOut,
  Target, Briefcase, Calculator, PieChart, Clock, Award,
  Zap, Eye, Archive, Shield, HelpCircle, Palette, Check
} from 'lucide-react'
import { useTheme, TEMAS, TemaId } from '@/contexts/ThemeContext'
import { EscritorioProvider } from '@/contexts/EscritorioContext'
import { ClientesProvider } from '@/contexts/ClientesContext'
import { ThemeLoader } from '@/components/ui/ThemeLoader'
import AuthGuardOptimized from '@/components/auth/AuthGuardOptimized'
import QueryProvider from '@/providers/QueryProvider'
import { ActivityIndicator } from '@/components/session/ActivityIndicator'
import { EnterpriseProvider } from '@/contexts/EnterpriseContext'
import { EnterpriseStatusBar } from '@/components/enterprise/EnterpriseStatusBar'

// Interfaces para tipagem
interface ItemSubmenu {
  nome: string
  rota: string
  icone: any
  submenu?: ItemSubmenu[]
}

interface ModuloAEC {
  id: string
  nome: string
  icone: any
  rota: string
  descricao: string
  badge: string | null
  submenu?: ItemSubmenu[]
}

// Módulos do sistema AEC
const MODULOS_AEC: ModuloAEC[] = [
  {
    id: 'dashboard',
    nome: 'Dashboard',
    icone: Home,
    rota: '/dashboard',
    descricao: 'Visão geral operacional',
    badge: null
  },
  {
    id: 'comercial',
    nome: 'Comercial',
    icone: UserCheck,
    rota: '/comercial',
    descricao: 'CRM e pipeline de vendas',
    badge: null,
    submenu: [
      { nome: 'Dashboard', rota: '/comercial', icone: BarChart3 },
      { nome: 'Leads', rota: '/comercial/leads', icone: Target },
      { nome: 'Pipeline', rota: '/comercial/pipeline', icone: Briefcase },
      { nome: 'Clientes', rota: '/comercial/clientes', icone: Users },
      { nome: 'Comunicação', rota: '/comercial/comunicacao', icone: Bell }
    ]
  },
  {
    id: 'briefing',
    nome: 'Briefing',
    icone: ClipboardList,
    rota: '/briefing',
    descricao: 'Briefing estruturado IA',
    badge: 'Único',
    submenu: [
      { nome: 'Dashboard', rota: '/briefing', icone: BarChart3 },
      { nome: 'Novo Briefing', rota: '/briefing/novo', icone: FileText },
      { nome: 'Em Andamento', rota: '/briefing/andamento', icone: Clock },
      { nome: 'Templates', rota: '/briefing/templates', icone: Archive },
      { nome: 'Aprovações', rota: '/briefing/aprovacoes', icone: Shield }
    ]
  },
  {
    id: 'agenda',
    nome: 'Agenda',
    icone: Calendar,
    rota: '/agenda',
    descricao: 'Agenda integrada inteligente',
    badge: null,
    submenu: [
      { nome: 'Calendário', rota: '/agenda', icone: Calendar },
      { nome: 'Equipe', rota: '/agenda/equipe', icone: Users },
      { nome: 'Recursos', rota: '/agenda/recursos', icone: Archive },
      { nome: 'Sincronização', rota: '/agenda/sync', icone: Zap }
    ]
  },
  {
    id: 'orcamentos',
    nome: 'Orçamentos',
    icone: Calculator,
    rota: '/orcamentos',
    descricao: 'Orçamentação com IA',
    badge: null,
    submenu: [
      { nome: 'Dashboard', rota: '/orcamentos/dashboard', icone: BarChart3 },
      { nome: 'Histórico', rota: '/orcamentos/historico', icone: FileText },
      { nome: 'Pendentes', rota: '/orcamentos/pendentes', icone: Clock },
      { nome: 'Configurações', rota: '/orcamentos/configuracoes', icone: Settings }
    ]
  },
  {
    id: 'projetos',
    nome: 'Projetos',
    icone: FolderOpen,
    rota: '/projetos',
    descricao: '🚀 Coração do Sistema AEC',
    badge: 'Revolucionário',
    submenu: [
      { nome: '📊 Lista de Projetos', rota: '/projetos', icone: BarChart3 },
      { nome: '🚀 Novo Projeto (2min)', rota: '/projetos/novo', icone: Zap },
      { nome: '📋 Kanban Inteligente', rota: '/projetos/kanban', icone: Briefcase },
      { nome: '📅 Cronograma Gantt', rota: '/projetos/cronograma', icone: Calendar },
      { nome: '👥 Gestão de Equipe', rota: '/projetos/equipe', icone: Users },
      { nome: '📁 Arquivos CAD/BIM', rota: '/projetos/arquivos', icone: FileText },
      { nome: '🔄 Compatibilização', rota: '/projetos/compatibilizacao', icone: Check },
      { nome: '🌐 Portal do Cliente', rota: '/projetos/portal-cliente', icone: Shield },
      { nome: '📈 Métricas Avançadas', rota: '/projetos/metricas', icone: Eye },
      { nome: '🤖 IA e Automações', rota: '/projetos/ia', icone: Zap }
    ]
  },
  {
    id: 'financeiro',
    nome: 'Financeiro',
    icone: DollarSign,
    rota: '/financeiro',
    descricao: 'Gestão financeira completa',
    badge: null,
    submenu: [
      { 
        nome: 'Financeiro Escritório', 
        rota: '/financeiro-escritorio', 
        icone: DollarSign,
        submenu: [
          { nome: 'Dashboard', rota: '/financeiro-escritorio', icone: BarChart3 },
          { nome: 'Fluxo de Caixa', rota: '/financeiro-escritorio/fluxo', icone: DollarSign },
          { nome: 'Contas a Receber', rota: '/financeiro-escritorio/receber', icone: Target },
          { nome: 'Contas a Pagar', rota: '/financeiro-escritorio/pagar', icone: Calculator },
          { nome: 'Folha Pagamento', rota: '/financeiro-escritorio/folha', icone: Users }
        ]
      },
      { 
        nome: 'Financeiro Projetos', 
        rota: '/financeiro-projetos', 
        icone: PieChart,
        submenu: [
          { nome: 'Dashboard', rota: '/financeiro-projetos', icone: BarChart3 },
          { nome: 'Por Projeto', rota: '/financeiro-projetos/projeto', icone: FolderOpen },
          { nome: 'Comparativo', rota: '/financeiro-projetos/comparativo', icone: PieChart },
          { nome: 'Projeções', rota: '/financeiro-projetos/projecoes', icone: Target }
        ]
      }
    ]
  },
  {
    id: 'produtividade',
    nome: 'Produtividade',
    icone: Eye,
    rota: '/analise-produtividade',
    descricao: 'Análise produtividade IA',
    badge: 'Exclusivo',
    submenu: [
      { nome: 'Onde vai seu $', rota: '/analise-produtividade', icone: Eye },
      { nome: 'Por Etapas NBR', rota: '/analise-produtividade/etapas', icone: BarChart3 },
      { nome: 'Por Colaborador', rota: '/analise-produtividade/colaboradores', icone: Users },
      { nome: 'Benchmark', rota: '/analise-produtividade/benchmark', icone: Award },
      { nome: 'Simulador ROI', rota: '/analise-produtividade/simulador', icone: Calculator }
    ]
  },
  {
    id: 'equipe',
    nome: 'Equipe',
    icone: Users,
    rota: '/equipe',
    descricao: 'Gestão de pessoas',
    badge: null,
    submenu: [
      { nome: 'Dashboard', rota: '/equipe', icone: BarChart3 },
      { nome: 'Colaboradores', rota: '/equipe/colaboradores', icone: Users },
      { nome: 'Ponto', rota: '/equipe/ponto', icone: Clock },
      { nome: 'Timesheet', rota: '/equipe/timesheet', icone: Calendar },
      { nome: 'Avaliações', rota: '/equipe/avaliacoes', icone: Award }
    ]
  },
  {
    id: 'documentos',
    nome: 'Documentos',
    icone: FileText,
    rota: '/documentos',
    descricao: 'Gestão de arquivos',
    badge: null,
    submenu: [
      { nome: 'Biblioteca', rota: '/documentos', icone: Archive },
      { nome: 'Por Projeto', rota: '/documentos/projetos', icone: FolderOpen },
      { nome: 'Categorias', rota: '/documentos/categorias', icone: FileText },
      { nome: 'Compartilhados', rota: '/documentos/compartilhados', icone: Users }
    ]
  },
  {
    id: 'portal-cliente',
    nome: 'Portal Cliente',
    icone: Shield,
    rota: '/portal-cliente',
    descricao: 'Transparência total projetos',
    badge: null,
    submenu: [
      { nome: 'Dashboard', rota: '/portal-cliente', icone: BarChart3 },
      { nome: 'Aprovações', rota: '/portal-cliente/aprovacoes', icone: Shield },
      { nome: 'Comunicação', rota: '/portal-cliente/chat', icone: Bell },
      { nome: 'Histórico', rota: '/portal-cliente/historico', icone: Archive }
    ]
  },
  {
    id: 'relatorios',
    nome: 'Relatórios',
    icone: BarChart3,
    rota: '/relatorios',
    descricao: 'Relatórios executivos',
    badge: null,
    submenu: [
      { nome: 'Dashboard', rota: '/relatorios', icone: BarChart3 },
      { nome: 'Financeiros', rota: '/relatorios/financeiros', icone: DollarSign },
      { nome: 'Projetos', rota: '/relatorios/projetos', icone: FolderOpen },
      { nome: 'Equipe', rota: '/relatorios/equipe', icone: Users },
      { nome: 'Personalizado', rota: '/relatorios/construtor', icone: Settings }
    ]
  }
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { tema, personalizacao, temaId, mudarTema } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [moduloExpandido, setModuloExpandido] = useState<string | null>(null)
  const [notificacoes, setNotificacoes] = useState(3)
  const [seletorTemaAberto, setSeletorTemaAberto] = useState(false)

  useEffect(() => {
    // Auto-expandir módulo atual
    const moduloAtual = MODULOS_AEC.find(m => 
      pathname.startsWith(m.rota) || 
      m.submenu?.some(s => pathname.startsWith(s.rota))
    )
    if (moduloAtual) {
      setModuloExpandido(moduloAtual.id)
    }
  }, [pathname])

  const toggleModulo = (moduloId: string) => {
    setModuloExpandido(moduloExpandido === moduloId ? null : moduloId)
  }

  const isRotaAtiva = (rota: string) => {
    return pathname === rota
  }

  const isItemSubmenuAtivo = (rota: string, todasRotasDoModulo?: string[]) => {
    // Caso 1: Rota exata
    if (pathname === rota) return true
    
    // Caso 2: Sub-rota - só ativa se for a rota mais específica
    if (pathname.startsWith(rota + '/')) {
      // Se não temos todas as rotas do módulo, usamos uma lógica simples
      if (!todasRotasDoModulo) {
        return true
      }
      
      // Encontra a rota mais específica que corresponde ao pathname
      const rotaMaisEspecifica = todasRotasDoModulo
        .filter(r => pathname === r || pathname.startsWith(r + '/'))
        .sort((a, b) => b.length - a.length)[0] // Ordena pela mais longa (mais específica)
      
      // Só ativa se esta rota é a mais específica
      return rota === rotaMaisEspecifica
    }
    
    return false
  }

  const isModuloAtivo = (modulo: any) => {
    // Verifica se a rota atual corresponde exatamente ao módulo
    if (pathname === modulo.rota) return true
    
    // Verifica se a rota atual está dentro do módulo (usando startsWith)
    if (pathname.startsWith(modulo.rota + '/')) return true
    
    // Se tem submenu, verifica cada item do submenu
    if (modulo.submenu) {
      return modulo.submenu.some((item: any) => {
        // Verifica se é exatamente a rota do submenu
        if (pathname === item.rota) return true
        
        // Verifica se é uma sub-rota do item do submenu
        if (pathname.startsWith(item.rota + '/')) return true
        
        // Se o item tem sub-submenu, verifica também
        if (item.submenu) {
          return item.submenu.some((subItem: any) => 
            pathname === subItem.rota || pathname.startsWith(subItem.rota + '/')
          )
        }
        
        return false
      })
    }
    
    return false
  }

  const handleMudarTema = (novoTemaId: TemaId) => {
    mudarTema(novoTemaId)
    setSeletorTemaAberto(false)
  }

  return (
    <EscritorioProvider>
      <ThemeLoader>
        <AuthGuardOptimized>
          <EnterpriseProvider>
            {/* Enterprise Status Bar Global - OCULTO PARA PRODUÇÃO */}
            {/* <EnterpriseStatusBar compact position="top" /> */}
            
            <div className={`min-h-screen bg-gradient-to-br ${tema.bg}`}>
        
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-0 top-0 h-full w-80 backdrop-blur-xl border-r z-50 flex flex-col ${
            temaId === 'elegante' 
              ? 'bg-gray-50/95 border-gray-300/50' 
              : 'bg-white/5 border-white/10'
          }`}
        >
          
          {/* Header Sidebar */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${tema.gradiente} rounded-xl flex items-center justify-center`}>
                {personalizacao.logo ? (
                  <img src={personalizacao.logo} alt="Logo" className="w-10 h-10 rounded-lg" />
                ) : (
                  <Building2 className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className={`text-lg font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                  {personalizacao.textoPersonalizado.cabecalho}
                </h1>
                <p className={`text-sm ${temaId === 'elegante' ? 'text-gray-600' : 'text-blue-200/60'}`}>
                  Sistema AEC Completo
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 flex-shrink-0">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
              }`} />
              <input
                type="text"
                placeholder="Buscar módulos..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none transition-colors ${
                  temaId === 'elegante'
                    ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40'
                }`}
              />
            </div>
          </div>

          {/* Menu de Navegação - Área Scrollável */}
          <nav className="flex-1 px-4 py-2 space-y-2 scroll-invisible overflow-y-auto">
            {MODULOS_AEC.map((modulo) => {
              const IconeModulo = modulo.icone
              const isAtivo = isModuloAtivo(modulo)
              const hasSubmenu = modulo.submenu && modulo.submenu.length > 0
              const isExpandido = moduloExpandido === modulo.id

              return (
                <div key={modulo.id} className="w-full">
                  {/* Item Principal do Módulo */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isAtivo 
                        ? temaId === 'elegante'
                          ? 'bg-gray-900 text-white shadow-lg'
                          : `bg-gradient-to-r ${tema.gradiente} text-white shadow-lg`
                        : temaId === 'elegante' 
                          ? 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                          : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => hasSubmenu ? toggleModulo(modulo.id) : null}
                  >
                    <Link 
                      href={hasSubmenu ? '#' : modulo.rota} 
                      className="flex items-center space-x-3 flex-1 min-w-0"
                      onClick={hasSubmenu ? (e) => e.preventDefault() : undefined}
                    >
                      <IconeModulo className={`w-5 h-5 flex-shrink-0 ${
                        isAtivo 
                          ? 'text-white' 
                          : temaId === 'elegante'
                            ? 'text-gray-600'
                            : 'text-blue-100/70'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate">{modulo.nome}</span>
                          {modulo.badge && (
                            <span className={`px-2 py-1 text-xs rounded-lg flex-shrink-0 ${
                              isAtivo
                                ? 'bg-white/20 text-white'
                                : modulo.badge === 'Único' 
                                  ? temaId === 'elegante'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-purple-500/20 text-purple-300'
                                  : modulo.badge === 'Exclusivo' 
                                    ? temaId === 'elegante'
                                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                      : 'bg-yellow-500/20 text-yellow-300'
                                    : temaId === 'elegante'
                                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                      : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {modulo.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-current opacity-60 truncate">{modulo.descricao}</p>
                      </div>
                    </Link>
                    {hasSubmenu && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${
                          isExpandido ? 'rotate-180' : ''
                        } ${
                          isAtivo 
                            ? 'text-white' 
                            : temaId === 'elegante'
                              ? 'text-gray-500'
                              : 'text-blue-100/70'
                        }`} 
                      />
                    )}
                  </div>

                  {/* Submenu Expandido */}
                  <AnimatePresence>
                    {hasSubmenu && isExpandido && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-4 mt-2"
                      >
                        <div className="space-y-1">
                          {modulo.submenu?.map((item) => {
                            const IconeItem = item.icone
                            const todasRotasDoSubmenu = modulo.submenu?.map(i => i.rota) || []
                            const isSubmenuAtivo = isItemSubmenuAtivo(item.rota, todasRotasDoSubmenu)
                            const hasSubSubmenu = item.submenu && item.submenu.length > 0
                            
                            return (
                              <div key={item.rota}>
                                {hasSubSubmenu ? (
                                  // Item com sub-submenu (Financeiro Escritório/Projetos)
                                  <div className="space-y-1">
                                    <div className={`flex items-center space-x-3 p-2 rounded-lg font-medium ${
                                      temaId === 'elegante'
                                        ? 'text-gray-700 bg-gray-100/50'
                                        : 'text-blue-100/80 bg-white/5'
                                    }`}>
                                      <IconeItem className={`w-4 h-4 flex-shrink-0 ${
                                        temaId === 'elegante' ? 'text-gray-600' : 'text-blue-100/70'
                                      }`} />
                                      <span className="text-sm truncate">{item.nome}</span>
                                    </div>
                                    
                                    {/* Sub-submenu */}
                                    <div className="ml-6 space-y-1">
                                      {item.submenu?.map((subItem: ItemSubmenu) => {
                                        const IconeSubItem = subItem.icone
                                        const isSubSubmenuAtivo = isItemSubmenuAtivo(subItem.rota, item.submenu?.map(i => i.rota))
                                        
                                        return (
                                          <Link
                                            key={subItem.rota}
                                            href={subItem.rota}
                                                                                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                                          isSubSubmenuAtivo
                                            ? `bg-gradient-to-r ${tema.gradiente} text-white`
                                                : temaId === 'elegante'
                                                  ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                  : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                          >
                                            <IconeSubItem className={`w-3 h-3 flex-shrink-0 ${
                                              isSubSubmenuAtivo
                                                ? 'text-white'
                                                : temaId === 'elegante'
                                                  ? 'text-gray-500'
                                                  : 'text-blue-100/60'
                                            }`} />
                                            <span className="text-xs truncate">{subItem.nome}</span>
                                          </Link>
                                        )
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  // Item normal sem sub-submenu
                                  <Link
                                    href={item.rota}
                                                                      className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                                    isSubmenuAtivo
                                      ? `bg-gradient-to-r ${tema.gradiente} text-white`
                                        : temaId === 'elegante'
                                          ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                          : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                  >
                                    <IconeItem className={`w-4 h-4 flex-shrink-0 ${
                                      isSubmenuAtivo
                                        ? 'text-white'
                                        : temaId === 'elegante'
                                          ? 'text-gray-500'
                                          : 'text-blue-100/60'
                                    }`} />
                                    <span className="text-sm truncate">{item.nome}</span>
                                  </Link>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          {/* Footer Sidebar */}
          <div className={`flex-shrink-0 p-4 border-t ${
            temaId === 'elegante' 
              ? 'border-gray-300/60 bg-gray-100/50' 
              : 'border-white/10 bg-black/20'
          }`}>
            <div className="space-y-2">
              <Link 
                href="/configuracoes"
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  temaId === 'elegante'
                    ? 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
                    : 'text-blue-100/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Configurações</span>
              </Link>
              <Link 
                href="/ajuda"
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  temaId === 'elegante'
                    ? 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
                    : 'text-blue-100/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Ajuda & Suporte</span>
              </Link>
              <button className={`flex items-center space-x-3 p-2 rounded-lg transition-colors w-full ${
                temaId === 'elegante'
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-red-300 hover:bg-red-500/10 hover:text-red-200'
              }`}>
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Conteúdo Principal */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'} flex flex-col min-h-screen`}>
          
          {/* Header Superior */}
          <header className={`backdrop-blur-sm border-b sticky top-0 z-40 ${
            temaId === 'elegante'
              ? 'bg-white/95 border-gray-300/50'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between px-6 py-4">
              
              {/* Toggle Menu + Breadcrumb */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-2 rounded-xl transition-colors ${
                    temaId === 'elegante'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-blue-200/60'}>ArcFlow</span>
                  {pathname !== '/dashboard' && (
                    <>
                      <span className={temaId === 'elegante' ? 'text-gray-400' : 'text-blue-200/40'}>/</span>
                      <span className={`font-medium ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                        {MODULOS_AEC.find(m => pathname.startsWith(m.rota))?.nome || 'Página'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Ações do Header */}
              <div className="flex items-center space-x-4">
                <ActivityIndicator 
                  compact 
                  inactivityTimeout={30}
                  onSessionExpired={() => {
                    // Redirecionar para login
                    window.location.href = '/auth/login'
                  }}
                />
                
                {/* Seletor de Tema */}
                <div className="relative">
                  <button
                    onClick={() => setSeletorTemaAberto(!seletorTemaAberto)}
                    className={`p-2 rounded-xl transition-colors ${
                      temaId === 'elegante'
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Palette className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {seletorTemaAberto && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`absolute right-0 top-12 w-72 rounded-2xl shadow-2xl border z-50 p-4 ${
                          temaId === 'elegante'
                            ? 'bg-white border-gray-200'
                            : 'bg-gray-900/95 border-white/10 backdrop-blur-xl'
                        }`}
                      >
                        <h3 className={`font-bold text-lg mb-4 ${
                          temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                        }`}>
                          Escolher Tema
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(TEMAS).map(([id, tema]) => (
                            <button
                              key={id}
                              onClick={() => handleMudarTema(id as TemaId)}
                              className={`p-3 rounded-xl border-2 transition-all text-left ${
                                temaId === id
                                  ? 'border-blue-500 bg-blue-50'
                                  : temaId === 'elegante'
                                    ? 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                    : 'border-white/10 hover:border-white/20 bg-white/5'
                              }`}
                            >
                              <div className={`w-full h-3 rounded-lg bg-gradient-to-r ${tema.gradiente} mb-2`} />
                              <div className={`text-sm font-medium ${
                                temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {tema.nome}
                              </div>
                              {temaId === id && (
                                <Check className="w-4 h-4 text-blue-500 mt-1" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notificações */}
                <button className={`relative p-2 rounded-xl transition-colors ${
                  temaId === 'elegante'
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}>
                  <Bell className="w-5 h-5" />
                  {notificacoes > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificacoes}
                    </span>
                    )}
                </button>

                {/* Perfil */}
                <div className={`flex items-center space-x-3 p-2 rounded-xl ${
                  temaId === 'elegante'
                    ? 'bg-gray-100'
                    : 'bg-white/10'
                }`}>
                  <div className={`w-8 h-8 bg-gradient-to-r ${tema.gradiente} rounded-lg flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Área de Conteúdo */}
          <main className="flex-1">
            <QueryProvider>
              <ClientesProvider>
                {children}
              </ClientesProvider>
            </QueryProvider>
          </main>
          
        </div>

        {/* Overlay Mobile */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Overlay Seletor de Tema */}
        {seletorTemaAberto && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setSeletorTemaAberto(false)}
          />
        )}
            </div>
          </EnterpriseProvider>
        </AuthGuardOptimized>
      </ThemeLoader>
    </EscritorioProvider>
  )
}
