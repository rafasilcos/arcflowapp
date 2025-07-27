'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, User, Building, Phone, Mail, MapPin, Calendar, Star, ArrowRight, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useClientes } from '@/contexts/ClientesContext';
import { Cliente } from '@/types/integracaoComercial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SeletorClienteProps {
  onClienteSelecionado: (cliente: Cliente) => void;
  onNovoCliente: () => void;
}

export default function SeletorCliente({ onClienteSelecionado, onNovoCliente }: SeletorClienteProps) {
  const { tema, temaId } = useTheme();
  const { clientes } = useClientes();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);

  useEffect(() => {
    let filtrados = clientes;

    // Filtro por busca
    if (busca) {
      filtrados = filtrados.filter(cliente =>
        cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.email.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.telefone.includes(busca) ||
        (cliente.cpf && cliente.cpf.includes(busca)) ||
        (cliente.cnpj && cliente.cnpj.includes(busca))
      );
    }

    // Filtro por status
    if (filtroStatus !== 'todos') {
      filtrados = filtrados.filter(cliente => cliente.status === filtroStatus);
    }

    setClientesFiltrados(filtrados);
  }, [clientes, busca, filtroStatus]);

  const obterIconeStatus = (status: string) => {
    switch (status) {
      case 'vip': return '⭐';
      case 'ativo': return '✅';
      case 'inativo': return '⏸️';
      case 'problema': return '⚠️';
      default: return '👤';
    }
  };

  const obterCorStatus = (status: string) => {
    const cores = {
      elegante: {
        vip: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        ativo: 'bg-green-100 text-green-800 border-green-200',
        inativo: 'bg-gray-100 text-gray-600 border-gray-200',
        problema: 'bg-red-100 text-red-800 border-red-200'
      },
      escuro: {
        vip: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        ativo: 'bg-green-500/20 text-green-400 border-green-500/30',
        inativo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        problema: 'bg-red-500/20 text-red-400 border-red-500/30'
      }
    };
    return cores[temaId as keyof typeof cores]?.[status as keyof typeof cores.elegante] || cores.elegante.ativo;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-2xl font-bold ${tema.text} mb-2`}>
          Selecionar Cliente
        </h2>
        <p className={`${tema.textSecondary} mb-6`}>
          Escolha um cliente existente ou crie um novo para iniciar o briefing
        </p>
      </motion.div>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
            }`} />
            <Input
              placeholder="Buscar por nome, email, telefone ou documento..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className={`pl-10 ${
                temaId === 'elegante' 
                  ? 'bg-gray-50 border-gray-200 focus:border-blue-500' 
                  : 'bg-white/10 border-white/10 text-white placeholder:text-white/60 focus:border-white/30'
              }`}
            />
          </div>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border font-medium min-w-[140px] ${
              temaId === 'elegante'
                ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-blue-500'
                : 'bg-white/10 border-white/10 text-white focus:border-white/30'
            }`}
          >
            <option value="todos">Todos Status</option>
            <option value="ativo">Ativos</option>
            <option value="vip">VIP</option>
            <option value="inativo">Inativos</option>
            <option value="problema">Problemas</option>
          </select>
        </div>

        {/* Botão Novo Cliente */}
        <Button
          onClick={onNovoCliente}
          variant="primary"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </motion.div>

      {/* Lista de Clientes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {clientesFiltrados.length === 0 ? (
          <Card className={`${tema.card} border-dashed`}>
            <CardContent className="pt-8 pb-8 text-center">
              <Users className={`w-12 h-12 mx-auto mb-4 ${tema.textSecondary}`} />
              <h3 className={`text-lg font-semibold ${tema.text} mb-2`}>
                {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className={`${tema.textSecondary} mb-4`}>
                {busca 
                  ? 'Tente ajustar os filtros de busca ou criar um novo cliente'
                  : 'Comece criando seu primeiro cliente para iniciar os briefings'
                }
              </p>
              <Button onClick={onNovoCliente} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clientesFiltrados.map((cliente, index) => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${tema.card} hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 ${
                  cliente.status === 'vip' ? 'border-l-yellow-500' : 
                  cliente.status === 'ativo' ? 'border-l-green-500' : 
                  'border-l-gray-400'
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar Maior */}
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          temaId === 'elegante' ? 'bg-blue-100' : 'bg-blue-500/20'
                        }`}>
                          {cliente.cnpj ? (
                            <Building className={`w-7 h-7 ${
                              temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                            }`} />
                          ) : (
                            <User className={`w-7 h-7 ${
                              temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                            }`} />
                          )}
                        </div>

                        {/* Dados Principais Simplificados */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-xl font-bold ${tema.text} truncate`}>
                              {cliente.nome}
                            </h3>
                            <Badge className={`text-xs px-3 py-1 font-medium ${obterCorStatus(cliente.status)}`}>
                              {obterIconeStatus(cliente.status)} {cliente.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className={`w-4 h-4 ${tema.textSecondary}`} />
                              <span className={tema.textSecondary}>{cliente.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className={`w-4 h-4 ${tema.textSecondary}`} />
                              <span className={tema.textSecondary}>{cliente.telefone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className={`w-4 h-4 ${tema.textSecondary}`} />
                              <span className={tema.textSecondary}>
                                Cliente desde {new Date(cliente.criadoEm).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botão Selecionar Destacado */}
                      <Button
                        onClick={() => onClienteSelecionado(cliente)}
                        variant="briefing"
                        className="ml-6"
                      >
                        Selecionar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>


    </div>
  );
} 