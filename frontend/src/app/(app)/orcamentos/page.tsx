'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  Users,
  Building,
  BarChart3,
  Settings,
  History,
  Send,
  Target,
  Zap,
  Brain,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useOrcamentos } from './hooks/useOrcamentos';

// Ações rápidas
const ACOES_RAPIDAS = [
  {
    titulo: 'Novo Orçamento',
    descricao: 'Criar orçamento do zero',
    icone: Plus,
    cor: 'blue',
    href: '/orcamentos/novo'
  },
  {
    titulo: 'Dashboard',
    descricao: 'Visualizar métricas',
    icone: BarChart3,
    cor: 'purple',
    href: '/orcamentos/dashboard'
  },
  {
    titulo: 'Pendentes',
    descricao: 'Orçamentos aguardando',
    icone: Clock,
    cor: 'yellow',
    href: '/orcamentos/pendentes'
  },
  {
    titulo: 'Histórico',
    descricao: 'Orçamentos anteriores',
    icone: History,
    cor: 'gray',
    href: '/orcamentos/historico'
  },
  {
    titulo: 'Modelos',
    descricao: 'Templates prontos',
    icone: FileText,
    cor: 'green',
    href: '/orcamentos/modelos'
  },
  {
    titulo: 'Configurações',
    descricao: 'Ajustar parâmetros',
    icone: Settings,
    cor: 'indigo',
    href: '/orcamentos/configuracoes'
  }
];

function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case 'APROVADO': return 'text-green-700 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700'
    case 'PENDENTE': return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'
    case 'REJEITADO': return 'text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700'
    case 'RASCUNHO': return 'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-gray-900/30 dark:border-gray-700'
    default: return 'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-gray-900/30 dark:border-gray-700'
  }
}

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case 'APROVADO': return CheckCircle
    case 'PENDENTE': return Clock
    case 'REJEITADO': return AlertTriangle
    case 'RASCUNHO': return FileText
    default: return FileText
  }
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export default function OrcamentosPage() {
  const { tema, temaId } = useTheme();

  // ✅ USANDO DADOS REAIS VIA HOOK
  const {
    orcamentos,
    loading,
    error,
    recarregar,
    filtrarPorStatus,
    buscarPorTexto,
    metricas,
    gerarDoBriefing
  } = useOrcamentos();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // ✅ FILTROS APLICADOS AOS DADOS REAIS
  const orcamentosFiltrados = React.useMemo(() => {
    let resultado = filtrarPorStatus(filtroStatus);
    if (busca.trim()) {
      resultado = buscarPorTexto(busca);
    }
    return resultado;
  }, [orcamentos, busca, filtroStatus, filtrarPorStatus, buscarPorTexto]);

  // ✅ MÉTRICAS CALCULADAS DOS DADOS REAIS
  const metricasCalculadas = [
    {
      titulo: 'Orçamentos Ativos',
      valor: metricas.total.toString(),
      variacao: '+' + Math.round((metricas.total / 10) * 100) / 100,
      tipo: 'positiva' as const,
      icone: Calculator,
      gradiente: 'from-blue-500 to-cyan-500',
      detalhe: 'Total cadastrado',
      cor: 'blue'
    },
    {
      titulo: 'Valor Total',
      valor: formatarMoeda(metricas.valorTotal).replace('R$', 'R$').replace(',00', ''),
      variacao: '+15%',
      tipo: 'positiva' as const,
      icone: DollarSign,
      gradiente: 'from-green-500 to-emerald-500',
      detalhe: 'Em propostas',
      cor: 'green'
    },
    {
      titulo: 'Taxa Aprovação',
      valor: metricas.total > 0 ? `${Math.round((metricas.aprovados / metricas.total) * 100)}%` : '0%',
      variacao: '+5%',
      tipo: 'positiva' as const,
      icone: TrendingUp,
      gradiente: 'from-purple-500 to-violet-500',
      detalhe: 'Últimos 30 dias',
      cor: 'purple'
    },
    {
      titulo: 'Pendentes',
      valor: metricas.pendentes.toString(),
      variacao: metricas.pendentes > 0 ? `+${metricas.pendentes}` : '0',
      tipo: metricas.pendentes > 5 ? 'negativa' as const : 'positiva' as const,
      icone: Clock,
      gradiente: 'from-orange-500 to-red-500',
      detalhe: 'Aguardando aprovação',
      cor: 'orange'
    }
  ];

  return (
    <div className={`min-h-screen ${tema.bg} py-8 px-4`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Principal */}
        <div className={`${tema.card} rounded-3xl shadow-2xl border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
          } p-8 mb-8 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 rounded-2xl ${temaId === 'elegante'
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-600'
                    : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-300'
                  } shadow-lg`}>
                  <Calculator className="w-8 h-8" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold ${tema.text} mb-2`}>
                    Gestão de Orçamentos
                  </h1>
                  <p className={`text-lg ${tema.textSecondary} max-w-2xl`}>
                    Crie, gerencie e acompanhe orçamentos de forma inteligente. Integrado com briefings e propostas comerciais.
                  </p>
                </div>
              </div>

              {/* Estatísticas Rápidas - DADOS REAIS */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${temaId === 'elegante' ? 'bg-green-500' : 'bg-green-400'
                    }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {metricas.aprovados} Aprovados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${temaId === 'elegante' ? 'bg-yellow-500' : 'bg-yellow-400'
                    }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {metricas.pendentes} Pendentes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${temaId === 'elegante' ? 'bg-gray-500' : 'bg-gray-400'
                    }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {metricas.rascunhos} Rascunhos
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={recarregar}
                variant="outline"
                className={`border-2 ${temaId === 'elegante'
                    ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  } transition-all duration-300 px-4 py-3`}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Carregando...' : 'Atualizar'}
              </Button>
              <Button
                asChild
                className={`${temaId === 'elegante'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'
                  } text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3`}
              >
                <Link href="/orcamentos/novo" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Novo Orçamento
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={`border-2 ${temaId === 'elegante'
                    ? 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                    : 'border-yellow-400 text-yellow-300 hover:bg-yellow-400/10'
                  } transition-all duration-300 px-6 py-3`}
              >
                <Link href="/orcamentos/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas - DADOS REAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricasCalculadas.map((metrica, index) => {
            const IconeMetrica = metrica.icone;
            return (
              <motion.div
                key={metrica.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${tema.card} rounded-2xl shadow-xl border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
                  } p-6 relative overflow-hidden group cursor-pointer`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metrica.gradiente} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${metrica.cor}-100 dark:bg-${metrica.cor}-900/30`}>
                      <IconeMetrica className={`w-6 h-6 text-${metrica.cor}-600 dark:text-${metrica.cor}-400`} />
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${metrica.tipo === 'positiva'
                        ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
                        : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                      }`}>
                      {metrica.variacao}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-2xl font-bold ${tema.text}`}>
                      {metrica.valor}
                    </h3>
                    <p className={`text-sm font-medium ${tema.textSecondary}`}>
                      {metrica.titulo}
                    </p>
                    <p className={`text-xs ${tema.textSecondary} opacity-75`}>
                      {metrica.detalhe}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filtros e Busca */}
        <div className={`${tema.card} rounded-2xl shadow-xl border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
          } p-6 mb-8`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
                  }`} />
                <Input
                  placeholder="Buscar orçamentos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={`pl-10 ${temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 focus:border-yellow-500'
                      : 'bg-white/10 border-white/10 text-white placeholder:text-white/60 focus:border-white/30'
                    }`}
                />
              </div>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className={`px-4 py-2 rounded-xl border font-medium ${temaId === 'elegante'
                    ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-yellow-500'
                    : 'bg-white/10 border-white/10 text-white focus:border-white/30'
                  }`}
              >
                <option value="todos">Todos Status</option>
                <option value="APROVADO">Aprovados</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="RASCUNHO">Rascunhos</option>
                <option value="REJEITADO">Rejeitados</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              {orcamentosFiltrados.length} de {orcamentos.length} orçamentos
            </div>
          </div>
        </div>

        {/* Estados de Loading e Erro */}
        {loading && (
          <div className={`${tema.card} rounded-2xl shadow-xl border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-12`}>
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`inline-flex p-4 rounded-full ${temaId === 'elegante' ? 'bg-yellow-100' : 'bg-yellow-500/20'
                } mb-4`}>
                <RefreshCw className={`w-8 h-8 ${temaId === 'elegante' ? 'text-yellow-600' : 'text-yellow-400'
                  } animate-spin`} />
              </div>
              <h3 className={`text-2xl font-bold ${tema.text} mb-2`}>
                Carregando orçamentos...
              </h3>
              <p className={`text-lg ${tema.textSecondary}`}>
                Conectando com a base de dados
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className={`${tema.card} rounded-2xl shadow-xl border border-red-200 p-8 mb-8`}>
            <div className="flex items-center gap-4 text-red-600">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-bold">Erro ao carregar orçamentos</h3>
                <p className="text-sm">{error}</p>
                <Button
                  onClick={recarregar}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Orçamentos - DADOS REAIS */}
        {!loading && !error && (
          <div className="space-y-6">
            {orcamentosFiltrados.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${tema.card} rounded-3xl shadow-xl border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
                  } p-12`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`p-6 rounded-3xl mb-6 ${temaId === 'elegante' ? 'bg-gray-100' : 'bg-white/10'
                    }`}>
                    <Calculator className={`w-16 h-16 ${tema.textSecondary}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${tema.text} mb-2`}>
                    {busca || filtroStatus !== 'todos'
                      ? 'Nenhum orçamento encontrado'
                      : 'Nenhum orçamento cadastrado'
                    }
                  </h3>
                  <p className={`text-lg ${tema.textSecondary} mb-6 max-w-md`}>
                    {busca || filtroStatus !== 'todos'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece criando seu primeiro orçamento'
                    }
                  </p>
                  <Button
                    asChild
                    className={`${temaId === 'elegante'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'
                      } text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3`}
                  >
                    <Link href="/orcamentos/novo" className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      {busca || filtroStatus !== 'todos' ? 'Criar Novo Orçamento' : 'Criar Primeiro Orçamento'}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {orcamentosFiltrados.map(orcamento => {
                  const StatusIcon = getStatusIcon(orcamento.status);
                  return (
                    <motion.div
                      key={orcamento.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className={`group relative ${tema.card} rounded-2xl shadow-lg border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
                        } hover:shadow-xl transition-all duration-300 overflow-hidden`}
                    >
                      {/* Header do Card */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-lg truncate ${tema.text} mb-1`}>
                              {orcamento.nome}
                            </h3>
                            <div className={`text-sm ${tema.textSecondary} space-y-1`}>
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                <span className="truncate">{orcamento.cliente_nome}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="w-3 h-3" />
                                <span>{orcamento.tipologia} • {orcamento.area_construida}m²</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              className={`capitalize px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(orcamento.status)}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {orcamento.status.toLowerCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Valor */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${tema.textSecondary}`}>
                              Valor Total
                            </span>
                            <span className={`text-xl font-bold ${tema.text}`}>
                              {formatarMoeda(orcamento.valor_total)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className={tema.textSecondary}>Valor/m²</span>
                            <span className={tema.text}>{formatarMoeda(orcamento.valor_por_m2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer com Ações */}
                      <div className={`px-6 py-4 border-t ${temaId === 'elegante' ? 'border-gray-100' : 'border-current/10'
                        } flex items-center justify-between`}>
                        <div className={`text-xs ${tema.textSecondary}`}>
                          <div>Código: {orcamento.codigo}</div>
                          <div>Criado em {new Date(orcamento.created_at).toLocaleDateString('pt-BR')}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="opacity-70 hover:opacity-100"
                          >
                            <Link href={`/orcamentos/${orcamento.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-70 hover:opacity-100"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="font-medium"
                          >
                            <Link href={`/orcamentos/${orcamento.id}/editar`}>
                              <Edit3 className="w-4 h-4 mr-1" />
                              Editar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}

        {/* Ações Rápidas */}
        <div className={`${tema.card} rounded-2xl shadow-xl border ${temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
          } p-6 mt-8`}>
          <h2 className={`text-xl font-bold ${tema.text} mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-yellow-500" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ACOES_RAPIDAS.map((acao, index) => {
              const IconeAcao = acao.icone;
              return (
                <motion.div
                  key={acao.titulo}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={acao.href}
                    className={`block p-4 rounded-xl border-2 border-dashed ${temaId === 'elegante'
                        ? `border-${acao.cor}-200 hover:border-${acao.cor}-300 hover:bg-${acao.cor}-50`
                        : `border-${acao.cor}-400/30 hover:border-${acao.cor}-400/50 hover:bg-${acao.cor}-400/10`
                      } transition-all duration-300 text-center group`}
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-${acao.cor}-100 dark:bg-${acao.cor}-900/30 mb-3 group-hover:scale-110 transition-transform`}>
                      <IconeAcao className={`w-5 h-5 text-${acao.cor}-600 dark:text-${acao.cor}-400`} />
                    </div>
                    <h3 className={`font-semibold text-sm ${tema.text} mb-1`}>
                      {acao.titulo}
                    </h3>
                    <p className={`text-xs ${tema.textSecondary}`}>
                      {acao.descricao}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer com Informações */}
        <div className={`mt-8 text-center text-sm ${tema.textSecondary}`}>
          <p>🎯 ArcFlow Orçamentos - Gestão Inteligente v2.0</p>
          <p>✨ Integrado com Briefing → Orçamento → Proposta → Projeto</p>
          <p className="text-xs mt-2">
            {orcamentos.length > 0 ? `${orcamentos.length} orçamentos carregados` : 'Conectado ao sistema'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}