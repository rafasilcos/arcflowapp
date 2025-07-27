'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Building, Phone, Mail, MapPin, Calendar, Star, Edit, ArrowRight, Users, Heart, Home, CreditCard, Target, Clock, Palette, DollarSign } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Cliente } from '@/types/integracaoComercial';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerfilClienteProps {
  cliente: Cliente;
  onEditarCliente: () => void;
  onContinuar: () => void;
  onVoltar: () => void;
}

export default function PerfilCliente({ cliente, onEditarCliente, onContinuar, onVoltar }: PerfilClienteProps) {
  const { tema, temaId } = useTheme();

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
        vip: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        ativo: 'bg-green-50 text-green-700 border border-green-200',
        inativo: 'bg-gray-50 text-gray-600 border border-gray-200',
        problema: 'bg-red-50 text-red-700 border border-red-200'
      },
      escuro: {
        vip: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        ativo: 'bg-green-500/20 text-green-400 border border-green-500/30',
        inativo: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
        problema: 'bg-red-500/20 text-red-400 border border-red-500/30'
      }
    };
    return cores[temaId as keyof typeof cores]?.[status as keyof typeof cores.elegante] || cores.elegante.ativo;
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header com Avatar Grande */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${tema.card} rounded-3xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
        } p-8`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar Maior e Mais Elegante */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 ${
              cliente.status === 'vip'
                ? temaId === 'elegante'
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                : temaId === 'elegante'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
            }`}>
              {getInitials(cliente.nome)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className={`text-2xl font-bold ${tema.text}`}>
                  {cliente.nome}
                </h1>
                <Badge className={`px-3 py-1 text-sm font-semibold rounded-full ${obterCorStatus(cliente.status)}`}>
                  {obterIconeStatus(cliente.status)} {cliente.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={`flex items-center gap-2 ${tema.textSecondary}`}>
                  {cliente.cnpj ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  {cliente.cnpj ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </span>
                <span className={`flex items-center gap-2 ${tema.textSecondary}`}>
                  <Calendar className="w-4 h-4" />
                  Cliente desde {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onEditarCliente}
            className="flex items-center gap-2 px-6 py-3"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        </div>
      </motion.div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dados de Contato */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${tema.card} rounded-2xl shadow-lg border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-lg font-semibold ${tema.text} flex items-center gap-2`}>
                <Phone className="w-5 h-5 text-blue-500" />
                Dados de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</div>
                    <div className={`${tema.text} font-medium truncate`}>{cliente.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Telefone</div>
                    <div className={`${tema.text} font-medium`}>{cliente.telefone}</div>
                  </div>
                </div>

                {cliente.cpf && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">CPF</div>
                      <div className={`${tema.text} font-medium`}>{cliente.cpf}</div>
                    </div>
                  </div>
                )}

                {cliente.cnpj && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <Building className="w-4 h-4 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">CNPJ</div>
                      <div className={`${tema.text} font-medium`}>{cliente.cnpj}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Endereço */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`${tema.card} rounded-2xl shadow-lg border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-lg font-semibold ${tema.text} flex items-center gap-2`}>
                <MapPin className="w-5 h-5 text-red-500" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cliente.endereco ? (
                <div className="p-4 rounded-lg bg-gray-50/50 space-y-2">
                  <div className={`${tema.text} font-medium`}>
                    {cliente.endereco.logradouro}, {cliente.endereco.numero}
                    {cliente.endereco.complemento && ` - ${cliente.endereco.complemento}`}
                  </div>
                  <div className={`${tema.text}`}>
                    {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.uf}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    CEP: {cliente.endereco.cep}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Endereço não informado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Origem do Cliente */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`${tema.card} rounded-2xl shadow-lg border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-lg font-semibold ${tema.text} flex items-center gap-2`}>
                <Target className="w-5 h-5 text-green-500" />
                Origem do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Fonte</div>
                  <div className={`${tema.text} font-medium capitalize`}>{cliente.origem.fonte}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Responsável</div>
                  <div className={`${tema.text} font-medium`}>{cliente.origem.responsavelComercial}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Histórico de Projetos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`${tema.card} rounded-2xl shadow-lg border ${
            temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-lg font-semibold ${tema.text} flex items-center gap-2`}>
                <Star className="w-5 h-5 text-purple-500" />
                Histórico de Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cliente.historicoProjetos && cliente.historicoProjetos.length > 0 ? (
                <div className="space-y-3">
                  {cliente.historicoProjetos.slice(0, 2).map((projeto, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50/50 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${tema.text}`}>{projeto.tipologia}</span>
                        <span className="text-xs text-gray-500">{projeto.ano}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">R$ {projeto.valor.toLocaleString()}</span>
                        {projeto.satisfacao && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-600">{projeto.satisfacao}/10</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {cliente.historicoProjetos.length > 2 && (
                    <div className="text-center text-sm text-gray-500 pt-2">
                      +{cliente.historicoProjetos.length - 2} projeto(s) anterior(es)
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Primeiro projeto com este cliente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Preferências - Card Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className={`${tema.card} rounded-2xl shadow-lg border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className={`text-lg font-semibold ${tema.text} flex items-center gap-2`}>
              <Palette className="w-5 h-5 text-pink-500" />
              Preferências
            </CardTitle>
          </CardHeader>
          <CardContent>
                         {cliente.preferencias ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {cliente.preferencias.estilosArquitetonicos && cliente.preferencias.estilosArquitetonicos.length > 0 && (
                   <div className="p-6 rounded-lg bg-gray-50/50">
                     <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-3">Estilos Arquitetônicos</div>
                     <div className="flex flex-wrap gap-2">
                       {cliente.preferencias.estilosArquitetonicos.map((estilo, index) => (
                         <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                           {estilo}
                         </Badge>
                       ))}
                     </div>
                   </div>
                 )}

                 {cliente.preferencias.materiaisPreferidos && cliente.preferencias.materiaisPreferidos.length > 0 && (
                   <div className="p-6 rounded-lg bg-gray-50/50">
                     <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-3">Materiais Preferidos</div>
                     <div className="flex flex-wrap gap-2">
                       {cliente.preferencias.materiaisPreferidos.slice(0, 4).map((material, index) => (
                         <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                           {material}
                         </Badge>
                       ))}
                       {cliente.preferencias.materiaisPreferidos.length > 4 && (
                         <Badge variant="secondary" className="text-sm px-3 py-1">
                           +{cliente.preferencias.materiaisPreferidos.length - 4}
                         </Badge>
                       )}
                     </div>
                   </div>
                 )}

                 {cliente.preferencias.orcamentoMedioHistorico > 0 && (
                   <div className="p-6 rounded-lg bg-gray-50/50">
                     <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-3">Orçamento Médio Histórico</div>
                     <div className={`${tema.text} font-bold text-2xl`}>
                       R$ {cliente.preferencias.orcamentoMedioHistorico.toLocaleString()}
                     </div>
                   </div>
                 )}

                 {cliente.preferencias.prazoTipicoPreferido > 0 && (
                   <div className="p-6 rounded-lg bg-gray-50/50">
                     <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-3">Prazo Típico Preferido</div>
                     <div className={`${tema.text} font-medium text-base`}>
                       {(() => {
                         const prazo = cliente.preferencias.prazoTipicoPreferido;
                         const opcoesPrazo = {
                           4: "⚡ 4 semanas (1 mês) - Projetos rápidos",
                           8: "🏃 8 semanas (2 meses) - Projetos ágeis", 
                           12: "⭐ 12 semanas (3 meses) - Padrão recomendado",
                           16: "📐 16 semanas (4 meses) - Projetos detalhados",
                           24: "🏗️ 24 semanas (6 meses) - Projetos complexos",
                           36: "🏛️ 36 semanas (9 meses) - Projetos grandes",
                           52: "🏢 52 semanas (1 ano) - Projetos especiais"
                         };
                         return opcoesPrazo[prazo as keyof typeof opcoesPrazo] || `${prazo} semanas`;
                       })()}
                     </div>
                   </div>
                 )}
               </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Preferências não informadas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Botões de Ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center pt-4"
      >
        <Button
          variant="outline"
          onClick={onVoltar}
          className="flex items-center gap-2 px-6 py-3"
        >
          ← Voltar
        </Button>

        <Button
          onClick={onContinuar}
          variant="comercial"
          size="lg"
          className="flex items-center gap-2 px-8 py-3 text-lg"
        >
          Iniciar Briefing
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
} 