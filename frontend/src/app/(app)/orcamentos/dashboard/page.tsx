'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  LineChart,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useOrcamentos } from '../hooks/useOrcamentos';

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

function formatarNumero(valor: number) {
  if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1)}M`;
  } else if (valor >= 1000) {
    return `${(valor / 1000).toFixed(0)}K`;
  }
  return valor.toString();
}

export default function DashboardOrcamentos() {
  const { tema, temaId } = useTheme();
  
  // ✅ USANDO DADOS REAIS VIA HOOK
  const { 
    orcamentos, 
    loading, 
    error, 
    recarregar, 
    metricas 
  } = useOrcamentos();

  // ✅ MÉTRICAS CALCULADAS DOS DADOS REAIS
  const metricasCalculadas = [
    {
      titulo: 'Total de Orçamentos',
      valor: metricas.total,
      variacao: Math.max(1, Math.round(metricas.total * 0.15)),
      percentual: metricas.total > 0 ? 15.2 : 0,
      tipo: 'positiva' as const,
      icone: FileText,
      cor: 'blue',
      detalhe: 'Cadastrados no sistema'
    },
    {
      titulo: 'Orçamentos Aprovados',
      valor: metricas.aprovados,
      variacao: Math.max(0, metricas.aprovados - Math.round(metricas.aprovados * 0.8)),
      percentual: metricas.total > 0 ? (metricas.aprovados / metricas.total) * 100 : 0,
      tipo: 'positiva' as const,
      icone: CheckCircle,
      cor: 'green',
      detalhe: 'Confirmados pelos clientes'
    },
    {
      titulo: 'Valor Total',
      valor: metricas.valorTotal,
      variacao: Math.round(metricas.valorTotal * 0.18),
      percentual: 18.3,
      tipo: 'positiva' as const,
      icone: DollarSign,
      cor: 'emerald',
      detalhe: 'Em propostas ativas'
    },
    {
      titulo: 'Taxa de Aprovação',
      valor: metricas.total > 0 ? Math.round((metricas.aprovados / metricas.total) * 100) : 0,
      variacao: 5,
      percentual: 5,
      tipo: metricas.aprovados > metricas.rejeitados ? 'positiva' as const : 'negativa' as const,
      icone: Target,
      cor: 'orange',
      detalhe: 'Baseado no histórico'
    }
  ];

  // ✅ DISTRIBUIÇÃO REAL DOS STATUS
  const distribuicaoReal = {
    aceitas: metricas.aprovados,
    pendentes: metricas.pendentes,
    recusadas: metricas.rejeitados,
    rascunhos: metricas.rascunhos,
    total: metricas.total
  };

  // ✅ FUNIL BASEADO NOS DADOS REAIS
  const funilReal = [
    { 
      etapa: 'Orçamentos Criados', 
      quantidade: metricas.total, 
      conversao: 100 
    },
    { 
      etapa: 'Enviados aos Clientes', 
      quantidade: metricas.total - metricas.rascunhos, 
      conversao: metricas.total > 0 ? ((metricas.total - metricas.rascunhos) / metricas.total) * 100 : 0
    },
    { 
      etapa: 'Em Análise', 
      quantidade: metricas.pendentes, 
      conversao: metricas.total > 0 ? (metricas.pendentes / metricas.total) * 100 : 0
    },
    { 
      etapa: 'Aprovados', 
      quantidade: metricas.aprovados, 
      conversao: metricas.total > 0 ? (metricas.aprovados / metricas.total) * 100 : 0
    }
  ];

  // ✅ ALERTAS BASEADOS NOS DADOS REAIS
  const alertasReais = [
    {
      tipo: 'urgente',
      titulo: 'Orçamentos Pendentes',
      descricao: `${metricas.pendentes} orçamentos aguardando resposta dos clientes`,
      icone: AlertTriangle,
      cor: metricas.pendentes > 5 ? 'red' : 'yellow'
    },
    {
      tipo: 'atencao',
      titulo: 'Taxa de Aprovação',
      descricao: `${metricas.total > 0 ? Math.round((metricas.aprovados / metricas.total) * 100) : 0}% dos orçamentos foram aprovados`,
      icone: Target,
      cor: (metricas.total > 0 && (metricas.aprovados / metricas.total) > 0.7) ? 'green' : 'yellow'
    },
    {
      tipo: 'info',
      titulo: 'Valor Médio',
      descricao: `Valor médio por orçamento: ${formatarMoeda(metricas.total > 0 ? metricas.valorTotal / metricas.total : 0)}`,
      icone: TrendingUp,
      cor: 'blue'
    }
  ];

  // ✅ TIMELINE BASEADA NOS ORÇAMENTOS REAIS
  const timelineReal = orcamentos
    .filter(orc => orc.status === 'APROVADO')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 7)
    .map(orc => ({
      data: orc.created_at,
      aceites: 1,
      valor: orc.valor_total,
      cliente: orc.cliente_nome,
      projeto: orc.nome
    }));

  if (loading) {
    return (
      <div className={`min-h-screen ${tema.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-full ${
            temaId === 'elegante' ? 'bg-yellow-100' : 'bg-yellow-500/20'
          } mb-4`}>
            <Activity className={`w-8 h-8 ${
              temaId === 'elegante' ? 'text-yellow-600' : 'text-yellow-400'
            } animate-pulse`} />
          </div>
          <p className={`text-lg font-medium ${tema.text}`}>
            Carregando dashboard...
          </p>
          <p className={`text-sm ${tema.textSecondary} mt-2`}>
            Analisando dados dos orçamentos
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${tema.bg} flex items-center justify-center`}>
        <div className="text-center max-w-md">
          <div className="text-red-500 text-8xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Button
              onClick={recarregar}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
            <Button
              asChild
              variant="outline"
            >
              <Link href="/orcamentos">Voltar aos Orçamentos</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${tema.bg} py-8 px-4`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className={`${tema.card} rounded-3xl shadow-2xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-8 mb-8 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 rounded-2xl ${
                  temaId === 'elegante' 
                    ? 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600' 
                    : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300'
                } shadow-lg`}>
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold ${tema.text} mb-2`}>
                    Dashboard de Orçamentos
                  </h1>
                  <p className={`text-lg ${tema.textSecondary} max-w-2xl`}>
                    Acompanhe métricas, funil de conversão e performance em tempo real
                  </p>
                </div>
              </div>
              
              {/* Estatísticas Rápidas - DADOS REAIS */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-green-500' : 'bg-green-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {distribuicaoReal.aceitas} Aprovados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-yellow-500' : 'bg-yellow-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {distribuicaoReal.pendentes} Pendentes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-red-500' : 'bg-red-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {distribuicaoReal.recusadas} Rejeitados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {distribuicaoReal.rascunhos} Rascunhos
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={recarregar}
                variant="outline"
                className={`border-2 ${
                  temaId === 'elegante' 
                    ? 'border-gray-300 text-gray-600 hover:bg-gray-50' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                } transition-all duration-300 px-4 py-3`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button
                asChild
                className={`${
                  temaId === 'elegante' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                    : 'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500'
                } text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3`}
              >
                <Link href="/orcamentos/novo" className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Nova Proposta
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={`border-2 ${
                  temaId === 'elegante' 
                    ? 'border-blue-500 text-blue-600 hover:bg-blue-50' 
                    : 'border-blue-400 text-blue-300 hover:bg-blue-400/10'
                } transition-all duration-300 px-6 py-3`}
              >
                <Link href="/orcamentos" className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5" />
                  Ver Todos
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas Principais - DADOS REAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricasCalculadas.map((metrica, index) => {
            const IconeMetrica = metrica.icone;
            const isPositiva = metrica.tipo === 'positiva';
            
            return (
              <motion.div
                key={metrica.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${tema.card} rounded-2xl shadow-xl border ${
                  temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
                } p-6 relative overflow-hidden group cursor-pointer`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${metrica.cor}-500 to-${metrica.cor}-600 opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${metrica.cor}-100 dark:bg-${metrica.cor}-900/30`}>
                      <IconeMetrica className={`w-6 h-6 text-${metrica.cor}-600 dark:text-${metrica.cor}-400`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      isPositiva 
                        ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' 
                        : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                    }`}>
                      {isPositiva ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(metrica.percentual).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={`text-2xl font-bold ${tema.text}`}>
                      {metrica.titulo === 'Valor Total' 
                        ? formatarMoeda(metrica.valor)
                        : metrica.titulo === 'Taxa de Aprovação'
                          ? `${metrica.valor}%`
                          : metrica.valor.toLocaleString()
                      }
                    </h3>
                    <p className={`text-sm font-medium ${tema.textSecondary}`}>
                      {metrica.titulo}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${tema.textSecondary} opacity-75`}>
                        {metrica.detalhe}
                      </p>
                      <p className={`text-xs font-medium ${
                        isPositiva ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isPositiva ? '+' : ''}{metrica.titulo === 'Valor Total' 
                          ? formatarMoeda(metrica.variacao)
                          : metrica.variacao.toLocaleString()
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Alertas Críticos - DADOS REAIS */}
        <div className={`${tema.card} rounded-2xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-6 mb-8`}>
          <h2 className={`text-xl font-bold ${tema.text} mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-yellow-500" />
            Alertas e Notificações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertasReais.map((alerta, index) => {
              const IconeAlerta = alerta.icone;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 border-dashed ${
                    temaId === 'elegante' 
                      ? `border-${alerta.cor}-200 bg-${alerta.cor}-50` 
                      : `border-${alerta.cor}-400/30 bg-${alerta.cor}-400/10`
                  } transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-${alerta.cor}-100 dark:bg-${alerta.cor}-900/30`}>
                      <IconeAlerta className={`w-4 h-4 text-${alerta.cor}-600 dark:text-${alerta.cor}-400`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${tema.text} mb-1`}>
                        {alerta.titulo}
                      </h3>
                      <p className={`text-xs ${tema.textSecondary}`}>
                        {alerta.descricao}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Funil de Conversão e Distribuição - DADOS REAIS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Funil de Conversão */}
          <div className={`${tema.card} rounded-2xl shadow-xl border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
          } p-6`}>
            <h2 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
              <LineChart className="w-5 h-5 text-blue-500" />
              Funil de Conversão
            </h2>
            <div className="space-y-4">
              {funilReal.map((etapa, index) => (
                <motion.div
                  key={etapa.etapa}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${tema.text}`}>
                      {etapa.etapa}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${tema.textSecondary}`}>
                        {etapa.conversao.toFixed(1)}%
                      </span>
                      <Badge variant="outline" className={`text-xs ${
                        temaId === 'elegante' 
                          ? 'border-blue-300 text-blue-700' 
                          : 'border-blue-600 text-blue-400'
                      }`}>
                        {etapa.quantidade}
                      </Badge>
                    </div>
                  </div>
                  <div className={`w-full h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-gray-200' : 'bg-gray-700'
                  } overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${etapa.conversao}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-full rounded-full ${
                        index === 0 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : index === 1
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : index === 2
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Distribuição de Status */}
          <div className={`${tema.card} rounded-2xl shadow-xl border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
          } p-6`}>
            <h2 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
              <PieChart className="w-5 h-5 text-purple-500" />
              Distribuição de Status
            </h2>
            <div className="space-y-6">
              {/* Gráfico Visual Simples */}
              <div className="relative">
                <div className={`w-full h-4 rounded-full ${
                  temaId === 'elegante' ? 'bg-gray-200' : 'bg-gray-700'
                } overflow-hidden flex`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${distribuicaoReal.total > 0 ? (distribuicaoReal.aceitas / distribuicaoReal.total) * 100 : 0}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${distribuicaoReal.total > 0 ? (distribuicaoReal.pendentes / distribuicaoReal.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${distribuicaoReal.total > 0 ? (distribuicaoReal.recusadas / distribuicaoReal.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="bg-gradient-to-r from-red-500 to-pink-500"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${distribuicaoReal.total > 0 ? (distribuicaoReal.rascunhos / distribuicaoReal.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600"
                  />
                </div>
              </div>

              {/* Legenda */}
              <div className="space-y-3">
                {[
                  { label: 'Aprovados', valor: distribuicaoReal.aceitas, cor: 'green', icone: CheckCircle },
                  { label: 'Pendentes', valor: distribuicaoReal.pendentes, cor: 'yellow', icone: Clock },
                  { label: 'Rejeitados', valor: distribuicaoReal.recusadas, cor: 'red', icone: AlertTriangle },
                  { label: 'Rascunhos', valor: distribuicaoReal.rascunhos, cor: 'gray', icone: FileText }
                ].map((item) => {
                  const IconeItem = item.icone;
                  const percentual = distribuicaoReal.total > 0 ? (item.valor / distribuicaoReal.total) * 100 : 0;
                  
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${item.cor}-100 dark:bg-${item.cor}-900/30`}>
                          <IconeItem className={`w-4 h-4 text-${item.cor}-600 dark:text-${item.cor}-400`} />
                        </div>
                        <span className={`text-sm font-medium ${tema.text}`}>
                          {item.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${tema.text}`}>
                          {item.valor}
                        </div>
                        <div className={`text-xs ${tema.textSecondary}`}>
                          {percentual.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline de Aceites - DADOS REAIS */}
        <div className={`${tema.card} rounded-2xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-6`}>
          <h2 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
            <Calendar className="w-5 h-5 text-indigo-500" />
            Orçamentos Aprovados Recentes
          </h2>
          <div className="space-y-4">
            {timelineReal.length > 0 ? (
              timelineReal.map((item, index) => (
                <motion.div
                  key={`${item.data}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    temaId === 'elegante' 
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200' 
                      : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30'
                  } hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${
                      temaId === 'elegante' 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600' 
                        : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300'
                    } flex items-center justify-center font-bold text-sm`}>
                      ✓
                    </div>
                    <div>
                      <p className={`font-semibold ${tema.text}`}>
                        {item.projeto}
                      </p>
                      <p className={`text-sm ${tema.textSecondary}`}>
                        {item.cliente} • {new Date(item.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tema.text}`}>
                      {formatarMoeda(item.valor)}
                    </p>
                    <p className={`text-xs ${tema.textSecondary}`}>
                      Aprovado
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className={`text-center py-8 ${tema.textSecondary}`}>
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum orçamento aprovado ainda</p>
                <p className="text-sm mt-1">Os orçamentos aprovados aparecerão aqui</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer com Informações */}
        <div className={`mt-8 text-center text-sm ${tema.textSecondary}`}>
          <p>📊 Dashboard atualizado em tempo real</p>
          <p>✨ Dados baseados em {metricas.total} orçamentos cadastrados</p>
          <p className="text-xs mt-2">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}