'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Zap, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import SeletorCliente from '@/components/briefing/SeletorCliente';
import PerfilCliente from '@/components/briefing/PerfilCliente';
import ConfiguracaoInicialBriefing, { DadosIniciaisBriefing } from '@/components/briefing/ConfiguracaoInicialBriefing';
import { Cliente } from '@/types/integracaoComercial';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type EtapasFluxo = 'cliente' | 'perfil' | 'configuracao' | 'loading' | 'erro';

export default function BriefingIntegradoSimplesPage() {
  const { tema } = useTheme();

  // Estados principais
  const [etapaAtual, setEtapaAtual] = useState<EtapasFluxo>('cliente');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [dadosIniciaisBriefing, setDadosIniciaisBriefing] = useState<DadosIniciaisBriefing | null>(null);
  const [modoIA, setModoIA] = useState(true);
  const [erroDeteccao, setErroDeteccao] = useState<string | null>(null);

  // Handlers
  const handleClienteSelecionado = (cliente: Cliente) => {
    console.log('Cliente selecionado:', cliente.nome);
    setClienteSelecionado(cliente);
    setEtapaAtual('perfil');
  };

  const handleVoltarParaClientes = () => {
    setEtapaAtual('cliente');
    setClienteSelecionado(null);
  };

  const handleVoltarParaPerfil = () => {
    setEtapaAtual('perfil');
  };

  const handleContinuarParaConfiguracao = () => {
    setEtapaAtual('configuracao');
  };

  const handleContinuarParaBriefing = async (dadosIniciais: DadosIniciaisBriefing) => {
    console.log('Dados do briefing:', dadosIniciais);
    setDadosIniciaisBriefing(dadosIniciais);

    if (modoIA && clienteSelecionado) {
      setEtapaAtual('loading');
      
      try {
        // Simulação de análise de IA
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Análise de IA simulada com sucesso');
        alert(`✅ Briefing configurado com sucesso!\n\nCliente: ${clienteSelecionado.nome}\nProjeto: ${dadosIniciais.nomeBriefing}\nTipo: ${dadosIniciais.tipoBriefing}`);
        
        // Voltar para cliente
        setEtapaAtual('cliente');
        setClienteSelecionado(null);
        setDadosIniciaisBriefing(null);
        
      } catch (error) {
        console.error('❌ Erro na análise:', error);
        setErroDeteccao('Erro na análise de IA');
        setEtapaAtual('erro');
      }
    }
  };

  const handleVoltarParaConfiguracao = () => {
    setEtapaAtual('configuracao');
    setErroDeteccao(null);
  };

  // Renderização por etapas
  if (etapaAtual === 'cliente') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">📋 Briefing Integrado - Versão Simples</h1>
            <p className="text-gray-600 mt-2">Teste do fluxo completo sem erros</p>
          </div>
          
          <SeletorCliente
            onClienteSelecionado={handleClienteSelecionado}
            onNovoCliente={() => console.log('Novo cliente')}
          />
        </div>
      </div>
    );
  }

  if (etapaAtual === 'perfil' && clienteSelecionado) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <span>Cliente: <strong>{clienteSelecionado.nome}</strong></span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Perfil</span>
          </div>
          
          <PerfilCliente
            cliente={clienteSelecionado}
            onEditarCliente={() => console.log('Editar cliente')}
            onContinuar={handleContinuarParaConfiguracao}
            onVoltar={handleVoltarParaClientes}
          />
        </div>
      </div>
    );
  }

  if (etapaAtual === 'configuracao' && clienteSelecionado) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <span>Cliente: <strong>{clienteSelecionado.nome}</strong></span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Configuração</span>
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-blue-900">🤖 Modo Inteligente com IA</h3>
                    <p className="text-sm text-blue-700">
                      {modoIA 
                        ? 'IA detectará templates automaticamente'
                        : 'Usar seleção manual tradicional'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setModoIA(!modoIA)}
                  variant={modoIA ? "primary" : "outline"}
                  className="flex items-center gap-2"
                >
                  {modoIA ? '✅ IA Ativada' : '📝 Manual'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfiguracaoInicialBriefing
            cliente={clienteSelecionado}
            onVoltar={handleVoltarParaPerfil}
            onContinuar={handleContinuarParaBriefing}
          />
        </div>
      </div>
    );
  }

  if (etapaAtual === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <span>Cliente: <strong>{clienteSelecionado?.nome}</strong></span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Análise Inteligente</span>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin p-3 bg-blue-500 text-white rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">🤖 IA Analisando Necessidades...</h3>
                  <p className="text-gray-600">Detectando templates ideais para seu projeto</p>
                </div>
              </div>
              <Progress value={75} className="mb-4" />
              <div className="text-sm text-gray-600 space-y-1">
                <p>📋 Projeto: <strong>{dadosIniciaisBriefing?.nomeBriefing}</strong></p>
                <p>🏗️ Tipo: <strong>{dadosIniciaisBriefing?.tipoBriefing}</strong></p>
                <p>🎯 Motivo: <strong>{dadosIniciaisBriefing?.motivoBriefing}</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (etapaAtual === 'erro') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-xl font-bold text-red-900">❌ Erro na Detecção</h3>
                  <p className="text-red-700">{erroDeteccao}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => {
                  setErroDeteccao(null);
                  setEtapaAtual('configuracao');
                }}>
                  🔄 Tentar Novamente
                </Button>
                <Button onClick={handleVoltarParaConfiguracao} variant="outline">
                  ⬅️ Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p>Carregando...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 