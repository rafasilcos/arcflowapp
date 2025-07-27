'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBackendConnection } from '@/hooks/useBackendConnection';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Play, 
  Square, 
  RefreshCw,
  Server,
  Database,
  Timer,
  User,
  LogIn,
  LogOut
} from 'lucide-react';

export function BackendConnectionTest() {
  const {
    isConnected,
    isLoading,
    error,
    user,
    cronometroAtivo,
    login,
    logout,
    startTimer,
    stopTimer,
    loadDashboardData,
    checkConnection,
    reconnect
  } = useBackendConnection();

  const [testResults, setTestResults] = useState<any>({});
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [testProjectId] = useState('test-project-123');

  // Testar conexão básica
  const testBasicConnection = async () => {
    setTestResults(prev => ({ ...prev, basic: { loading: true } }));
    
    try {
      const isHealthy = await checkConnection();
      setTestResults(prev => ({ 
        ...prev, 
        basic: { 
          success: isHealthy, 
          message: isHealthy ? 'Servidor online' : 'Servidor offline',
          loading: false 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        basic: { 
          success: false, 
          message: error.message,
          loading: false 
        } 
      }));
    }
  };

  // Testar login
  const testLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      alert('Preencha email e senha');
      return;
    }

    setTestResults(prev => ({ ...prev, login: { loading: true } }));
    
    try {
      await login(loginForm.email, loginForm.password);
      setTestResults(prev => ({ 
        ...prev, 
        login: { 
          success: true, 
          message: 'Login realizado com sucesso',
          loading: false 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        login: { 
          success: false, 
          message: error.message,
          loading: false 
        } 
      }));
    }
  };

  // Testar cronômetro
  const testTimer = async () => {
    if (!user) {
      alert('Faça login primeiro');
      return;
    }

    setTestResults(prev => ({ ...prev, timer: { loading: true } }));
    
    try {
      if (cronometroAtivo) {
        await stopTimer(cronometroAtivo.id, 'Teste de conexão finalizado');
        setTestResults(prev => ({ 
          ...prev, 
          timer: { 
            success: true, 
            message: 'Cronômetro parado com sucesso',
            loading: false 
          } 
        }));
      } else {
        await startTimer(testProjectId, undefined, 'Teste de conexão');
        setTestResults(prev => ({ 
          ...prev, 
          timer: { 
            success: true, 
            message: 'Cronômetro iniciado com sucesso',
            loading: false 
          } 
        }));
      }
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        timer: { 
          success: false, 
          message: error.message,
          loading: false 
        } 
      }));
    }
  };

  // Testar dashboard
  const testDashboard = async () => {
    if (!user) {
      alert('Faça login primeiro');
      return;
    }

    setTestResults(prev => ({ ...prev, dashboard: { loading: true } }));
    
    try {
      const data = await loadDashboardData();
      setTestResults(prev => ({ 
        ...prev, 
        dashboard: { 
          success: true, 
          message: `Dashboard carregado: ${data?.overview?.totalProjetos || 0} projetos`,
          loading: false 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        dashboard: { 
          success: false, 
          message: error.message,
          loading: false 
        } 
      }));
    }
  };

  // Status da conexão
  const getConnectionStatus = () => {
    if (isLoading) return { icon: Loader2, color: 'text-yellow-500', text: 'Conectando...' };
    if (error) return { icon: XCircle, color: 'text-red-500', text: 'Erro na conexão' };
    if (isConnected) return { icon: CheckCircle2, color: 'text-green-500', text: 'Conectado' };
    return { icon: AlertCircle, color: 'text-gray-500', text: 'Desconectado' };
  };

  const connectionStatus = getConnectionStatus();
  const ConnectionIcon = connectionStatus.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Teste de Conexão - Backend ArcFlow</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status da Conexão */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Status da Conexão</span>
              </h3>
              
              <div className="flex items-center space-x-3">
                <ConnectionIcon className={`h-5 w-5 ${connectionStatus.color} ${isLoading ? 'animate-spin' : ''}`} />
                <span className={connectionStatus.color}>{connectionStatus.text}</span>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={testBasicConnection} 
                  size="sm" 
                  variant="outline"
                  disabled={testResults.basic?.loading}
                >
                  {testResults.basic?.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Testar Conexão
                </Button>
                
                <Button 
                  onClick={reconnect} 
                  size="sm" 
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconectar
                </Button>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Usuário</span>
              </h3>
              
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Nome:</strong> {user.name}
                  </div>
                  <div className="text-sm">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="text-sm">
                    <strong>Role:</strong> <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <Button onClick={logout} size="sm" variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <Button 
                    onClick={testLogin} 
                    size="sm" 
                    className="w-full"
                    disabled={testResults.login?.loading}
                  >
                    {testResults.login?.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <LogIn className="h-4 w-4 mr-2" />
                    )}
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testes de Funcionalidades */}
      <Card>
        <CardHeader>
          <CardTitle>Testes de Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Teste de Cronômetro */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <Timer className="h-4 w-4" />
                <span>Cronômetro</span>
              </h4>
              
              {cronometroAtivo && (
                <div className="text-sm bg-green-50 p-2 rounded">
                  <div><strong>Ativo:</strong> {cronometroAtivo.projeto?.nome || 'Projeto'}</div>
                  <div><strong>Tempo:</strong> {cronometroAtivo.elapsedTime ? Math.floor(cronometroAtivo.elapsedTime / 60) : 0}min</div>
                </div>
              )}
              
              <Button 
                onClick={testTimer} 
                size="sm" 
                variant="outline" 
                className="w-full"
                disabled={!user || testResults.timer?.loading}
              >
                {testResults.timer?.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : cronometroAtivo ? (
                  <Square className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {cronometroAtivo ? 'Parar' : 'Iniciar'} Timer
              </Button>
            </div>

            {/* Teste de Dashboard */}
            <div className="space-y-3">
              <h4 className="font-medium">Dashboard</h4>
              <Button 
                onClick={testDashboard} 
                size="sm" 
                variant="outline" 
                className="w-full"
                disabled={!user || testResults.dashboard?.loading}
              >
                {testResults.dashboard?.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Carregar Dashboard
              </Button>
            </div>

            {/* Informações Gerais */}
            <div className="space-y-3">
              <h4 className="font-medium">Informações</h4>
              <div className="text-sm space-y-1">
                <div><strong>Backend:</strong> localhost:3001</div>
                <div><strong>Status:</strong> {isConnected ? '🟢 Online' : '🔴 Offline'}</div>
                {user && <div><strong>Autenticado:</strong> ✅</div>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados dos Testes */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(testResults).map(([test, result]: [string, any]) => (
                <div key={test} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium capitalize">{test}</span>
                    {result.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                    ) : result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.message}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 