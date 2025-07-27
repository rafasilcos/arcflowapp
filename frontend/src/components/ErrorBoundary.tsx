'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Gerar ID único para o erro
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    console.error('🚨 Error Boundary capturou um erro:', error);
    console.error('📍 Informações do erro:', errorInfo);

    // Salvar erro no localStorage para análise
    const errorData = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    try {
      const existingErrors = JSON.parse(localStorage.getItem('arcflow_errors') || '[]');
      existingErrors.push(errorData);
      
      // Manter apenas os últimos 10 erros
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('arcflow_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Erro ao salvar log de erro:', e);
    }

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleReportError = () => {
    const errorData = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Em produção, enviar para serviço de monitoramento
    console.log('📤 Relatório de erro enviado:', errorData);
    
    // Simular envio
    alert('Erro reportado com sucesso! ID: ' + this.state.errorId);
  };

  render() {
    if (this.state.hasError) {
      // Renderizar fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar UI de erro padrão
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oops! Algo deu errado
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Encontramos um erro inesperado. Não se preocupe, seus dados estão seguros.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Informações do erro */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Bug className="h-4 w-4 mr-2" />
                  Detalhes Técnicos
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>ID do Erro:</strong> {this.state.errorId}</p>
                  <p><strong>Mensagem:</strong> {this.state.error?.message}</p>
                  <p><strong>Horário:</strong> {new Date().toLocaleString()}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={this.handleTryAgain}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>

                <Button 
                  onClick={this.handleReload}
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recarregar Página
                </Button>

                <Button 
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir para Início
                </Button>
              </div>

              {/* Botão de reportar erro */}
              <div className="text-center border-t pt-4">
                <Button 
                  onClick={this.handleReportError}
                  className="text-gray-500 hover:text-gray-700 bg-transparent border-none text-sm px-3 py-1"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Reportar este erro
                </Button>
              </div>

              {/* Detalhes expandidos para desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                    Detalhes para Desenvolvimento
                  </summary>
                  <div className="text-xs text-red-700 space-y-2">
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 bg-red-100 p-2 rounded text-xs overflow-auto">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 bg-red-100 p-2 rounded text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para acessar erros salvos
export function useErrorLogs() {
  const getErrorLogs = () => {
    try {
      return JSON.parse(localStorage.getItem('arcflow_errors') || '[]');
    } catch {
      return [];
    }
  };

  const clearErrorLogs = () => {
    localStorage.removeItem('arcflow_errors');
  };

  const reportError = (error: Error, context?: string) => {
    const errorData = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      const existingErrors = getErrorLogs();
      existingErrors.push(errorData);
      
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('arcflow_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Erro ao salvar log de erro:', e);
    }
  };

  return {
    getErrorLogs,
    clearErrorLogs,
    reportError
  };
} 

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Gerar ID único para o erro
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    console.error('🚨 Error Boundary capturou um erro:', error);
    console.error('📍 Informações do erro:', errorInfo);

    // Salvar erro no localStorage para análise
    const errorData = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    try {
      const existingErrors = JSON.parse(localStorage.getItem('arcflow_errors') || '[]');
      existingErrors.push(errorData);
      
      // Manter apenas os últimos 10 erros
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('arcflow_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Erro ao salvar log de erro:', e);
    }

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleReportError = () => {
    const errorData = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Em produção, enviar para serviço de monitoramento
    console.log('📤 Relatório de erro enviado:', errorData);
    
    // Simular envio
    alert('Erro reportado com sucesso! ID: ' + this.state.errorId);
  };

  render() {
    if (this.state.hasError) {
      // Renderizar fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar UI de erro padrão
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oops! Algo deu errado
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Encontramos um erro inesperado. Não se preocupe, seus dados estão seguros.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Informações do erro */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Bug className="h-4 w-4 mr-2" />
                  Detalhes Técnicos
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>ID do Erro:</strong> {this.state.errorId}</p>
                  <p><strong>Mensagem:</strong> {this.state.error?.message}</p>
                  <p><strong>Horário:</strong> {new Date().toLocaleString()}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={this.handleTryAgain}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>

                <Button 
                  onClick={this.handleReload}
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recarregar Página
                </Button>

                <Button 
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir para Início
                </Button>
              </div>

              {/* Botão de reportar erro */}
              <div className="text-center border-t pt-4">
                <Button 
                  onClick={this.handleReportError}
                  className="text-gray-500 hover:text-gray-700 bg-transparent border-none text-sm px-3 py-1"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Reportar este erro
                </Button>
              </div>

              {/* Detalhes expandidos para desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                    Detalhes para Desenvolvimento
                  </summary>
                  <div className="text-xs text-red-700 space-y-2">
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 bg-red-100 p-2 rounded text-xs overflow-auto">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 bg-red-100 p-2 rounded text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para acessar erros salvos
export function useErrorLogs() {
  const getErrorLogs = () => {
    try {
      return JSON.parse(localStorage.getItem('arcflow_errors') || '[]');
    } catch {
      return [];
    }
  };

  const clearErrorLogs = () => {
    localStorage.removeItem('arcflow_errors');
  };

  const reportError = (error: Error, context?: string) => {
    const errorData = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      const existingErrors = getErrorLogs();
      existingErrors.push(errorData);
      
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('arcflow_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Erro ao salvar log de erro:', e);
    }
  };

  return {
    getErrorLogs,
    clearErrorLogs,
    reportError
  };
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 