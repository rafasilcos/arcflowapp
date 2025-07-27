"use client";
import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { 
  Clock, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Send,
  Eye,
  Filter,
  RefreshCw,
  User,
  Building,
  DollarSign,
  FileText,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Dados mock de propostas pendentes
const PROPOSTAS_PENDENTES = [
  {
    id: 'prop-001',
    cliente: {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-1234',
      empresa: 'Silva Construções'
    },
    projeto: 'Casa Alto Padrão - Alphaville',
    valor: 185000,
    dataEnvio: '2024-01-20',
    dataVencimento: '2024-02-05',
    diasRestantes: 3,
    status: 'urgente' as const,
    tentativas: 2,
    ultimoContato: '2024-01-25',
    tipologia: 'Residencial',
    area: 350
  },
  {
    id: 'prop-002',
    cliente: {
      nome: 'Maria Souza',
      email: 'maria.souza@construtora.com',
      telefone: '(11) 98888-5678',
      empresa: 'Construtora ABC'
    },
    projeto: 'Edifício Comercial Centro',
    valor: 420000,
    dataEnvio: '2024-01-18',
    dataVencimento: '2024-02-10',
    diasRestantes: 8,
    status: 'normal' as const,
    tentativas: 1,
    ultimoContato: '2024-01-22',
    tipologia: 'Comercial',
    area: 1200
  },
  {
    id: 'prop-003',
    cliente: {
      nome: 'Carlos Lima',
      email: 'carlos@email.com',
      telefone: '(11) 97777-9012',
      empresa: 'Lima Empreendimentos'
    },
    projeto: 'Reforma Apartamento Jardins',
    valor: 85000,
    dataEnvio: '2024-01-22',
    dataVencimento: '2024-02-15',
    diasRestantes: 13,
    status: 'normal' as const,
    tentativas: 0,
    ultimoContato: null,
    tipologia: 'Residencial',
    area: 120
  },
  {
    id: 'prop-004',
    cliente: {
      nome: 'Ana Costa',
      email: 'ana.costa@incorporadora.com',
      telefone: '(11) 96666-3456',
      empresa: 'Costa Incorporações'
    },
    projeto: 'Galpão Industrial Guarulhos',
    valor: 320000,
    dataEnvio: '2024-01-15',
    dataVencimento: '2024-02-02',
    diasRestantes: 1,
    status: 'critico' as const,
    tentativas: 3,
    ultimoContato: '2024-01-30',
    tipologia: 'Industrial',
    area: 800
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'critico': return 'text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700'
    case 'urgente': return 'text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-700'
    case 'normal': return 'text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
    default: return 'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-gray-900/30 dark:border-gray-700'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'critico': return AlertTriangle
    case 'urgente': return Clock
    case 'normal': return CheckCircle
    default: return Clock
  }
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

function calcularDiasRestantes(dataVencimento: string) {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diffTime = vencimento.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function PendentesOrcamentosPage() {
  const { tema, temaId } = useTheme();
  const [propostas, setPropostas] = useState(PROPOSTAS_PENDENTES);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [reenviando, setReenviando] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const propostasFiltradas = propostas.filter(proposta => {
    const termo = busca.toLowerCase();
    const matchBusca = (
      proposta.cliente.nome.toLowerCase().includes(termo) ||
      proposta.cliente.email.toLowerCase().includes(termo) ||
      proposta.projeto.toLowerCase().includes(termo) ||
      proposta.cliente.empresa.toLowerCase().includes(termo)
    );
    const matchStatus = filtroStatus === 'todos' || proposta.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const statusCounts = {
    todos: propostas.length,
    critico: propostas.filter(p => p.status === 'critico').length,
    urgente: propostas.filter(p => p.status === 'urgente').length,
    normal: propostas.filter(p => p.status === 'normal').length
  };

  const handleReenviar = async (id: string) => {
    setReenviando(id);
    setFeedback(null);
    
    // Simula envio
    setTimeout(() => {
      setPropostas(prev => prev.map(p => 
        p.id === id 
          ? { ...p, tentativas: p.tentativas + 1, ultimoContato: new Date().toISOString().split('T')[0] }
          : p
      ));
      setReenviando(null);
      setFeedback('Lembrete reenviado com sucesso!');
      setTimeout(() => setFeedback(null), 3000);
    }, 1500);
  };

  const valorTotal = propostas.reduce((acc, prop) => acc + prop.valor, 0);
  const propostasUrgentes = propostas.filter(p => p.status === 'critico' || p.status === 'urgente').length;

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
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15s6.716 15 15 15 15-6.716 15-15S23.284 0 15 0zm0 26C8.373 26 3 20.627 3 14S8.373 2 15 2s12 5.373 12 12-5.373 12-12 12z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 rounded-2xl ${
                  temaId === 'elegante' 
                    ? 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-600' 
                    : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-300'
                } shadow-lg`}>
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold ${tema.text} mb-2`}>
                    Propostas Pendentes
                  </h1>
                  <p className={`text-lg ${tema.textSecondary} max-w-2xl`}>
                    Acompanhe e gerencie propostas aguardando aceite dos clientes
                  </p>
                </div>
              </div>
              
              {/* Estatísticas Rápidas */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-red-500' : 'bg-red-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {statusCounts.critico} Críticas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-orange-500' : 'bg-orange-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {statusCounts.urgente} Urgentes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    temaId === 'elegante' ? 'bg-blue-500' : 'bg-blue-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${tema.textSecondary}`}>
                    {statusCounts.normal} Normais
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setCarregando(true)}
                className={`${
                  temaId === 'elegante' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                    : 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500'
                } text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3`}
                disabled={carregando}
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${carregando ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                asChild
                variant="outline"
                className={`border-2 ${
                  temaId === 'elegante' 
                    ? 'border-orange-500 text-orange-600 hover:bg-orange-50' 
                    : 'border-orange-400 text-orange-300 hover:bg-orange-400/10'
                } transition-all duration-300 px-6 py-3`}
              >
                <Link href="/orcamentos/dashboard" className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${tema.card} rounded-2xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-6 relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${tema.textSecondary} mb-1`}>
                  Total de Propostas
                </p>
                <p className={`text-3xl font-bold ${tema.text}`}>
                  {propostas.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${tema.card} rounded-2xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-6 relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${tema.textSecondary} mb-1`}>
                  Valor Total
                </p>
                <p className={`text-3xl font-bold ${tema.text}`}>
                  {formatarMoeda(valorTotal)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${tema.card} rounded-2xl shadow-xl border ${
              temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
            } p-6 relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${tema.textSecondary} mb-1`}>
                  Urgentes
                </p>
                <p className={`text-3xl font-bold ${tema.text}`}>
                  {propostasUrgentes}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${tema.card} rounded-xl border-2 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700 p-4 mb-6`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300 font-medium">
                {feedback}
              </p>
            </div>
          </motion.div>
        )}

        {/* Filtros e Busca */}
        <div className={`${tema.card} rounded-2xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-6 mb-8`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${tema.textSecondary}`} />
              <Input
                type="text"
                placeholder="Buscar por cliente, email, projeto ou empresa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                                 className={`pl-10 h-12 border-2 focus:ring-2 focus:ring-orange-500/20 ${
                   temaId === 'elegante' 
                     ? 'bg-white border-gray-300 text-gray-900 focus:border-orange-500' 
                     : 'bg-gray-800 border-gray-600 text-gray-100 focus:border-orange-400'
                 }`}
              />
            </div>

            {/* Filtros de Status */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'todos', label: 'Todos', count: statusCounts.todos },
                { key: 'critico', label: 'Críticas', count: statusCounts.critico },
                { key: 'urgente', label: 'Urgentes', count: statusCounts.urgente },
                { key: 'normal', label: 'Normais', count: statusCounts.normal }
              ].map((filtro) => (
                <Button
                  key={filtro.key}
                                     variant={filtroStatus === filtro.key ? "primary" : "outline"}
                  onClick={() => setFiltroStatus(filtro.key)}
                  className={`h-12 px-4 ${
                    filtroStatus === filtro.key
                      ? temaId === 'elegante'
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-orange-400 hover:bg-orange-500 text-gray-900'
                      : temaId === 'elegante'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  } transition-all duration-200`}
                >
                  {filtro.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filtro.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Propostas */}
        <div className="space-y-4">
          {propostasFiltradas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${tema.card} rounded-2xl shadow-xl border ${
                temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
              } p-12 text-center`}
            >
              <div className={`inline-flex p-4 rounded-full ${
                temaId === 'elegante' ? 'bg-gray-100' : 'bg-gray-800'
              } mb-4`}>
                <Clock className={`w-8 h-8 ${tema.textSecondary}`} />
              </div>
              <h3 className={`text-xl font-semibold ${tema.text} mb-2`}>
                Nenhuma proposta pendente encontrada
              </h3>
              <p className={`${tema.textSecondary} mb-6`}>
                {busca || filtroStatus !== 'todos' 
                  ? 'Tente ajustar os filtros ou termo de busca'
                  : 'Todas as propostas foram respondidas!'
                }
              </p>
            </motion.div>
          ) : (
            propostasFiltradas.map((proposta, index) => {
              const StatusIcon = getStatusIcon(proposta.status);
              const diasRestantes = calcularDiasRestantes(proposta.dataVencimento);
              
              return (
                <motion.div
                  key={proposta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`${tema.card} rounded-2xl shadow-xl border ${
                    temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
                  } p-6 relative overflow-hidden group`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className={`absolute inset-0 ${
                      proposta.status === 'critico' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500'
                        : proposta.status === 'urgente'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Informações do Cliente */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            {/* Avatar do Cliente */}
                            <div className={`w-12 h-12 rounded-xl ${
                              temaId === 'elegante' 
                                ? 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600' 
                                : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300'
                            } flex items-center justify-center font-bold text-sm shadow-lg`}>
                              {proposta.cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            
                            <div>
                              <h3 className={`text-xl font-bold ${tema.text} mb-1`}>
                                {proposta.cliente.nome}
                              </h3>
                              <p className={`text-sm ${tema.textSecondary} mb-2`}>
                                {proposta.cliente.empresa}
                              </p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Mail className={`w-4 h-4 ${tema.textSecondary}`} />
                                  <span className={`text-xs ${tema.textSecondary}`}>
                                    {proposta.cliente.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className={`w-4 h-4 ${tema.textSecondary}`} />
                                  <span className={`text-xs ${tema.textSecondary}`}>
                                    {proposta.cliente.telefone}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status e Urgência */}
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={`${getStatusColor(proposta.status)} border text-xs font-medium px-3 py-1`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {proposta.status === 'critico' ? 'Crítico' : 
                               proposta.status === 'urgente' ? 'Urgente' : 'Normal'}
                            </Badge>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                              diasRestantes <= 1 
                                ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                                : diasRestantes <= 3
                                  ? 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30'
                                  : 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
                            }`}>
                              {diasRestantes <= 0 ? 'Vencido' : `${diasRestantes} dias`}
                            </div>
                          </div>
                        </div>

                        {/* Detalhes do Projeto */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className={`text-xs font-medium ${tema.textSecondary} uppercase tracking-wide`}>
                              Projeto
                            </p>
                            <p className={`text-sm font-medium ${tema.text}`}>
                              {proposta.projeto}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className={`text-xs font-medium ${tema.textSecondary} uppercase tracking-wide`}>
                              Valor
                            </p>
                            <p className={`text-lg font-bold ${tema.text}`}>
                              {formatarMoeda(proposta.valor)}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className={`text-xs font-medium ${tema.textSecondary} uppercase tracking-wide`}>
                              Enviado em
                            </p>
                            <p className={`text-sm font-medium ${tema.text}`}>
                              {new Date(proposta.dataEnvio).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className={`text-xs font-medium ${tema.textSecondary} uppercase tracking-wide`}>
                              Vence em
                            </p>
                            <p className={`text-sm font-medium ${tema.text}`}>
                              {new Date(proposta.dataVencimento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`text-xs ${
                              temaId === 'elegante' 
                                ? 'border-gray-300 text-gray-600' 
                                : 'border-gray-600 text-gray-400'
                            }`}>
                              {proposta.tipologia}
                            </Badge>
                            <span className={`text-xs ${tema.textSecondary}`}>
                              {proposta.area}m²
                            </span>
                            <span className={`text-xs ${tema.textSecondary}`}>
                              {proposta.tentativas} tentativas
                            </span>
                          </div>
                          
                          {proposta.ultimoContato && (
                            <div className="flex items-center gap-1">
                              <Calendar className={`w-4 h-4 ${tema.textSecondary}`} />
                              <span className={`text-xs ${tema.textSecondary}`}>
                                Último contato: {new Date(proposta.ultimoContato).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-3 min-w-[160px]">
                        <Button
                          onClick={() => handleReenviar(proposta.id)}
                          disabled={reenviando === proposta.id}
                          size="sm"
                          className={`${
                            temaId === 'elegante' 
                              ? 'bg-orange-500 hover:bg-orange-600' 
                              : 'bg-orange-600 hover:bg-orange-700'
                          } text-white shadow-md hover:shadow-lg transition-all duration-200`}
                        >
                          {reenviando === proposta.id ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          {reenviando === proposta.id ? 'Enviando...' : 'Reenviar'}
                        </Button>
                        
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className={`border-2 ${
                            temaId === 'elegante' 
                              ? 'border-blue-300 text-blue-700 hover:bg-blue-50' 
                              : 'border-blue-600 text-blue-300 hover:bg-blue-800'
                          } transition-all duration-200`}
                        >
                          <Link href={`/orcamentos/proposta/${proposta.id}`} className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Ver Proposta
                          </Link>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className={`border-2 ${
                            temaId === 'elegante' 
                              ? 'border-green-300 text-green-700 hover:bg-green-50' 
                              : 'border-green-600 text-green-300 hover:bg-green-800'
                          } transition-all duration-200`}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
} 