'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send,
  Trash2,
  Eye,
  AlertTriangle,
  Building2,
  Shield,
  UserCheck,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

// Importar os novos tipos
import { 
  CARGOS_PROFISSIONAIS, 
  FUNCOES_ORGANIZACIONAIS, 
  PERMISSOES_SISTEMA,
  getCargoProfissional,
  getFuncaoOrganizacional,
  getPermissaoSistema,
  getCargosPorArea,
  getFuncoesPorNivel,
  type NovoConvite,
  type Convite,
  type MembroEquipe
} from '@/types/equipe';

export default function GestaoEquipe() {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNovoConvite, setShowNovoConvite] = useState(false);

  // Formulário de novo convite - nova estrutura
  const [novoConvite, setNovoConvite] = useState<NovoConvite>({
    email: '',
    nome: '',
    cargo: '',
    funcao: '',
    role: 'USER',
    mensagemPersonalizada: ''
  });

  // Agrupamentos para melhor organização
  const cargosPorArea = getCargosPorArea();
  const funcoesPorNivel = getFuncoesPorNivel();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('arcflow_auth_token');
      
      // Carregar convites
      const convitesResponse = await fetch('http://localhost:3001/api/convites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (convitesResponse.ok) {
        const convitesData = await convitesResponse.json();
        setConvites(convitesData.convites || []);
      }

      // Carregar membros da equipe
      const membrosResponse = await fetch('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (membrosResponse.ok) {
        const membrosData = await membrosResponse.json();
        setMembros(membrosData.users || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarConvite = async () => {
    if (!novoConvite.email || !novoConvite.nome || !novoConvite.cargo || !novoConvite.funcao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('arcflow_auth_token');
      
      const response = await fetch('http://localhost:3001/api/convites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(novoConvite)
      });

      const data = await response.json();

      if (response.ok) {
        const emailEnviado = data.convite?.emailEnviado;
        let mensagem = data.message || 'Convite enviado com sucesso!';
        
        if (emailEnviado) {
          mensagem += '\n\n📧 Um email foi enviado para o destinatário com o link de convite.';
        } else {
          mensagem += '\n\n⚠️ Sistema de email não configurado. Use o link abaixo para compartilhar:';
          mensagem += `\n\n🔗 ${data.convite.linkConvite}`;
        }
        
        alert(mensagem);
        setNovoConvite({
          email: '',
          nome: '',
          cargo: '',
          funcao: '',
          role: 'USER',
          mensagemPersonalizada: ''
        });
        setShowNovoConvite(false);
        carregarDados();
      } else {
        alert(data.error || 'Erro ao enviar convite');
      }
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      alert('Erro ao enviar convite');
    } finally {
      setLoading(false);
    }
  };

  const cancelarConvite = async (conviteId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este convite?')) return;

    try {
      const token = localStorage.getItem('arcflow_auth_token');
      
      const response = await fetch(`http://localhost:3001/api/convites/${conviteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Convite cancelado com sucesso!');
        carregarDados();
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao cancelar convite');
      }
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      alert('Erro ao cancelar convite');
    }
  };

  // Componentes de Badge atualizados
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>;
      case 'ACEITO':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Aceito
        </Badge>;
      case 'CANCELADO':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelado
        </Badge>;
      case 'EXPIRADO':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Expirado
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCargoBadge = (cargo: string) => {
    const cargoInfo = getCargoProfissional(cargo);
    return (
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        <UserCheck className="w-3 h-3 mr-1" />
        {cargoInfo?.label || cargo}
      </Badge>
    );
  };

  const getFuncaoBadge = (funcao: string) => {
    const funcaoInfo = getFuncaoOrganizacional(funcao);
    return (
      <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
        <Building2 className="w-3 h-3 mr-1" />
        {funcaoInfo?.label || funcao}
      </Badge>
    );
  };

  const getPermissaoBadge = (role: string) => {
    const permissaoInfo = getPermissaoSistema(role);
    return (
      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
        <Shield className="w-3 h-3 mr-1" />
        {permissaoInfo?.label || role}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Gestão de Equipe
            </h1>
            <p className="text-slate-600 mt-2">
              Gerencie membros da equipe e envie convites para colaboradores
            </p>
          </div>
          
          <Button
            onClick={() => setShowNovoConvite(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Convidar Colaborador
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Membros Ativos */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-green-600" />
              Membros da Equipe ({membros.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {membros.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Nenhum membro na equipe ainda</p>
                  <p className="text-sm">Envie convites para colaboradores</p>
                </div>
              ) : (
                membros.map((membro) => (
                  <motion.div
                    key={membro.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white transition-all duration-200 border border-slate-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {membro.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{membro.nome}</h3>
                        <p className="text-sm text-slate-600">{membro.email}</p>
                        <div className="flex space-x-2 mt-2">
                          {membro.cargo && getCargoBadge(membro.cargo)}
                          {membro.funcao && getFuncaoBadge(membro.funcao)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {getPermissaoBadge(membro.role)}
                      <p className="text-xs text-slate-500 mt-1">
                        Último login: {new Date(membro.ultimoLogin).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Convites Pendentes */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-yellow-600" />
              Convites Enviados ({convites.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {convites.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Nenhum convite enviado ainda</p>
                  <p className="text-sm">Comece convidando colaboradores</p>
                </div>
              ) : (
                convites.map((convite) => (
                  <motion.div
                    key={convite.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-slate-900">{convite.nome}</h3>
                        <p className="text-sm text-slate-600">{convite.email}</p>
                        <div className="flex space-x-2 mt-2">
                          {convite.cargo && getCargoBadge(convite.cargo)}
                          {convite.funcao && getFuncaoBadge(convite.funcao)}
                        </div>
                      </div>
                      <div className="text-right">
                      {getStatusBadge(convite.status)}
                        {getPermissaoBadge(convite.role)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Enviado em {new Date(convite.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span>Expira em {new Date(convite.expiresAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {convite.status === 'PENDENTE' && (
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = `${window.location.origin}/convite/${convite.id}`;
                            navigator.clipboard.writeText(link);
                            alert('Link copiado para a área de transferência!');
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Copiar Link
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => cancelarConvite(convite.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Novo Convite */}
      {showNovoConvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                Convidar Colaborador
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNovoConvite(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={novoConvite.nome}
                    onChange={(e) => setNovoConvite(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoConvite.email}
                    onChange={(e) => setNovoConvite(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                    <select
                    id="cargo"
                    value={novoConvite.cargo}
                    onChange={(e) => setNovoConvite(prev => ({ ...prev, cargo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um cargo...</option>
                      {Object.entries(cargosPorArea).map(([area, cargos]) => (
                        <optgroup key={area} label={area}>
                          {cargos.map(cargo => (
                            <option key={cargo.value} value={cargo.value}>
                              {cargo.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                </div>
                <div>
                    <Label htmlFor="funcao">Função *</Label>
                    <select
                      id="funcao"
                      value={novoConvite.funcao}
                      onChange={(e) => setNovoConvite(prev => ({ ...prev, funcao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione uma função...</option>
                      {Object.entries(funcoesPorNivel).map(([nivel, funcoes]) => (
                        <optgroup key={nivel} label={nivel}>
                          {funcoes.map(funcao => (
                            <option key={funcao.value} value={funcao.value}>
                              {funcao.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                                </div>

                  <div>
                    <Label htmlFor="role">Permissões no Sistema *</Label>
                  <select
                    id="role"
                    value={novoConvite.role}
                    onChange={(e) => setNovoConvite(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      {PERMISSOES_SISTEMA.map(permissao => (
                        <option key={permissao.value} value={permissao.value}>
                          {permissao.label} - {permissao.desc}
                      </option>
                    ))}
                  </select>
              </div>

              <div>
                <Label htmlFor="mensagem">Mensagem Personalizada (Opcional)</Label>
                <Textarea
                  id="mensagem"
                  value={novoConvite.mensagemPersonalizada}
                  onChange={(e) => setNovoConvite(prev => ({ ...prev, mensagemPersonalizada: e.target.value }))}
                  placeholder="Adicione uma mensagem pessoal ao convite..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={enviarConvite}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Enviando...' : 'Enviar Convite'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNovoConvite(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 