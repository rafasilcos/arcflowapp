'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  Building2, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ConviteData {
  id: string;
  email: string;
  nome: string;
  cargo: string;
  role: string;
  escritorio: {
    nome: string;
  };
  enviadoPor: {
    nome: string;
  };
  mensagemPersonalizada?: string;
  createdAt: string;
  expiresAt: string;
}

export default function AceitarConvite() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [convite, setConvite] = useState<ConviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aceitando, setAceitando] = useState(false);
  
  // Formulário de aceite
  const [formData, setFormData] = useState({
    password: '',
    confirmarPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (token) {
      verificarConvite();
    }
  }, [token]);

  const verificarConvite = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/convites/${token}`);
      const data = await response.json();

      if (response.ok) {
        setConvite(data.convite);
      } else {
        setError(data.error || 'Convite não encontrado');
      }
    } catch (error) {
      console.error('Erro ao verificar convite:', error);
      setError('Erro ao carregar convite');
    } finally {
      setLoading(false);
    }
  };

  const aceitarConvite = async () => {
    if (!formData.password || !formData.confirmarPassword) {
      alert('Preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmarPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setAceitando(true);
    try {
      const response = await fetch(`http://localhost:3001/api/convites/${token}/aceitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar token de autenticação
        localStorage.setItem('arcflow_auth_token', data.tokens.accessToken);
        localStorage.setItem('arcflow_refresh_token', data.tokens.refreshToken);
        
        // Salvar dados do usuário
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(`${data.message}\n\nVocê será redirecionado para o dashboard.`);
        
        // Redirecionar para o dashboard
        router.push('/dashboard');
      } else {
        alert(data.error || 'Erro ao aceitar convite');
      }
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      alert('Erro ao aceitar convite');
    } finally {
      setAceitando(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'USER': 'Usuário',
      'ARCHITECT': 'Arquiteto',
      'ENGINEER': 'Engenheiro',
      'DESIGNER': 'Designer',
      'MANAGER': 'Gerente'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Verificando convite...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Convite Inválido</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-slate-600 mb-6">{error}</p>
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!convite) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <UserPlus className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">🚀 ArcFlow</h1>
            <p className="opacity-90">Convite para Equipe</p>
          </div>

          <CardContent className="p-8">
            {/* Informações do Convite */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Olá, {convite.nome}! 👋
                </h2>
                <p className="text-slate-600">
                  Você foi convidado(a) para fazer parte da equipe
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-slate-900">{convite.escritorio.nome}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Cargo:</span>
                    <p className="font-medium text-slate-900">{convite.cargo}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Função:</span>
                    <Badge variant="secondary" className="mt-1">
                      {getRoleLabel(convite.role)}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Convidado por: <strong>{convite.enviadoPor.nome}</strong></span>
                  </div>
                </div>
              </div>

              {convite.mensagemPersonalizada && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <p className="text-blue-800 italic">
                    "{convite.mensagemPersonalizada}"
                  </p>
                </div>
              )}
            </div>

            {/* Formulário de Aceite */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={convite.email}
                  disabled
                  className="bg-slate-100"
                />
              </div>

              <div>
                <Label htmlFor="password">Criar Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmarPassword">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmarPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmarPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmarPassword: e.target.value }))}
                    placeholder="Digite a senha novamente"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={aceitarConvite}
                  disabled={aceitando}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                >
                  {aceitando ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Criando Conta...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aceitar Convite e Criar Conta
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-xs text-slate-500 pt-4">
                <p>
                  Expira em: {new Date(convite.expiresAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Ao aceitar este convite, você concorda com os{' '}
            <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 