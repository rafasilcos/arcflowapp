'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Clock, User, Target } from 'lucide-react';

// 🎯 PÁGINA SIMPLIFICADA: BRIEFINGS APROVADOS → PROJETOS AUTOMÁTICOS

interface BriefingAprovado {
  id: string;
  nome: string;
  cliente: {
    nome: string;
    email: string;
  };
  tipologia: string;
  padrao: string;
  area: number;
  orcamento: number;
  dataAprovacao: string;
  resumo: {
    quartos?: number;
    banheiros?: number;
    funcionarios?: number;
    caracteristicas: string[];
  };
  respostas: any[];
}

export default function NovoProjetoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [briefingSelecionado, setBriefingSelecionado] = useState<BriefingAprovado | null>(null);
  const [etapaGeracao, setEtapaGeracao] = useState<string>('');

  // 📋 BRIEFINGS APROVADOS MOCK
  const briefingsAprovados: BriefingAprovado[] = [
    {
      id: 'brief-001',
      nome: 'Casa Simples - Família Silva',
      cliente: {
        nome: 'João Silva',
        email: 'joao@silva.com'
      },
      tipologia: 'RESIDENCIAL',
      padrao: 'SIMPLES',
      area: 180,
      orcamento: 800000,
      dataAprovacao: '2024-12-15',
      resumo: {
        quartos: 3,
        banheiros: 2,
        caracteristicas: ['Área gourmet', 'Garagem 2 carros', 'Jardim frontal']
      },
      respostas: []
    },
    {
      id: 'brief-002',
      nome: 'Casa Alto Padrão - Família Costa',
      cliente: {
        nome: 'Maria Costa',
        email: 'maria@costa.com'
      },
      tipologia: 'RESIDENCIAL',
      padrao: 'ALTO_PADRAO',
      area: 350,
      orcamento: 1800000,
      dataAprovacao: '2024-12-14',
      resumo: {
        quartos: 4,
        banheiros: 4,
        caracteristicas: ['Piscina', 'Home theater', 'Automação', 'Paisagismo']
      },
      respostas: []
    },
    {
      id: 'brief-003',
      nome: 'Escritório Tech Startup',
      cliente: {
        nome: 'TechFlow Ltda',
        email: 'contato@techflow.com'
      },
      tipologia: 'COMERCIAL',
      padrao: 'SIMPLES',
      area: 120,
      orcamento: 300000,
      dataAprovacao: '2024-12-13',
      resumo: {
        funcionarios: 15,
        caracteristicas: ['Open space', 'Sala reunião', 'Copa', 'AVAC']
      },
      respostas: []
    }
  ];

  const gerarProjetoAutomatico = async (briefing: BriefingAprovado) => {
    setBriefingSelecionado(briefing);
    setLoading(true);

    try {
      // 🧠 SIMULAÇÃO DO PROCESSO DE GERAÇÃO AUTOMÁTICA
      const etapas = [
        'Analisando briefing aprovado...',
        'Identificando tipologia e padrão...',
        'Calculando complexidade do projeto...',
        'Selecionando template apropriado...',
        'Definindo disciplinas necessárias...',
        'Gerando etapas personalizadas...',
        'Criando tarefas com estimativas...',
        'Configurando cronograma...',
        'Finalizando projeto automático...'
      ];

      for (let i = 0; i < etapas.length; i++) {
        setEtapaGeracao(etapas[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // 🎯 GERAR PROJETO BASEADO NO BRIEFING
      const { TemplateProjetoService } = await import('@/services/templateProjetoService');
      const projetoGerado = TemplateProjetoService.gerarProjetoFromBriefing(briefing);

      console.log('🚀 Projeto gerado automaticamente:', projetoGerado);

      // ✅ REDIRECIONAR PARA DASHBOARD DO PROJETO CRIADO
      router.push(`/projetos/proj-${briefing.id}/dashboard`);

    } catch (error) {
      console.error('Erro ao gerar projeto:', error);
      setLoading(false);
    }
  };

  const obterCorPadrao = (padrao: string) => {
    switch (padrao) {
      case 'SIMPLES': return 'bg-green-100 text-green-800';
      case 'MEDIO': return 'bg-blue-100 text-blue-800';
      case 'ALTO_PADRAO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obterCorTipologia = (tipologia: string) => {
    switch (tipologia) {
      case 'RESIDENCIAL': return 'bg-blue-100 text-blue-800';
      case 'COMERCIAL': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🧠 Gerando Projeto Automaticamente
            </h2>
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-medium text-blue-600 mb-2">
                {briefingSelecionado?.nome}
              </div>
              <div className="text-sm text-gray-600">
                ⚡ {etapaGeracao}
              </div>
            </div>
            <p className="text-gray-600">
              O sistema está analisando o briefing aprovado e gerando automaticamente todas as etapas, tarefas e cronograma do projeto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚀 Novo Projeto
              </h1>
              <p className="text-xl text-gray-600">
                Selecione um briefing aprovado para gerar o projeto automaticamente
              </p>
            </div>
          </div>
        </div>

        {/* INSTRUÇÕES */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🎯 Como Funciona o Sistema Inteligente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Selecione um briefing aprovado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Sistema analisa automaticamente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Gera etapas e tarefas personalizadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Projeto pronto para execução</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-2xl font-bold text-blue-600">{briefingsAprovados.length}</div>
            <div className="text-sm text-gray-600">Briefings Aprovados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-green-600">~30s</div>
            <div className="text-sm text-gray-600">Tempo de Geração</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Automático</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-orange-600">Smart</div>
            <div className="text-sm text-gray-600">Templates IA</div>
          </Card>
        </div>

        {/* BRIEFINGS APROVADOS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              📋 Briefings Aprovados - Prontos para Projeto
            </h2>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              {briefingsAprovados.length} aguardando
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {briefingsAprovados.map((briefing) => (
              <Card key={briefing.id} className="overflow-hidden hover:shadow-lg transition-all">
                
                {/* HEADER DO BRIEFING */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {briefing.nome}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{briefing.cliente.nome}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(briefing.dataAprovacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Badge className={obterCorTipologia(briefing.tipologia)}>
                        {briefing.tipologia}
                      </Badge>
                      <Badge className={obterCorPadrao(briefing.padrao)}>
                        {briefing.padrao}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* DETALHES DO BRIEFING */}
                <div className="p-6 space-y-4">
                  
                  {/* INFORMAÇÕES PRINCIPAIS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Área</div>
                      <div className="font-semibold text-lg">{briefing.area}m²</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Orçamento</div>
                      <div className="font-semibold text-lg text-green-600">
                        R$ {briefing.orcamento.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* RESUMO ESPECÍFICO */}
                  <div className="space-y-2">
                    {briefing.resumo.quartos && (
                      <div className="flex justify-between text-sm">
                        <span>Quartos:</span>
                        <span className="font-medium">{briefing.resumo.quartos}</span>
                      </div>
                    )}
                    {briefing.resumo.banheiros && (
                      <div className="flex justify-between text-sm">
                        <span>Banheiros:</span>
                        <span className="font-medium">{briefing.resumo.banheiros}</span>
                      </div>
                    )}
                    {briefing.resumo.funcionarios && (
                      <div className="flex justify-between text-sm">
                        <span>Funcionários:</span>
                        <span className="font-medium">{briefing.resumo.funcionarios}</span>
                      </div>
                    )}
                  </div>

                  {/* CARACTERÍSTICAS */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Características:</div>
                    <div className="flex flex-wrap gap-1">
                      {briefing.resumo.caracteristicas.map((carac, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {carac}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* AÇÃO */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => gerarProjetoAutomatico(briefing)}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      size="lg"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Gerar Projeto Automaticamente
                    </Button>
                    
                    <div className="text-center mt-2">
                      <div className="text-xs text-gray-500">
                        ⚡ Sistema irá analisar o briefing e gerar todas as etapas automaticamente
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* INFORMAÇÕES ADICIONAIS */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Sobre a Geração Automática de Projetos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🧠 Análise Inteligente</h4>
              <p>O sistema analisa automaticamente as respostas do briefing para identificar tipologia, padrão, complexidade e disciplinas necessárias.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📋 Templates Dinâmicos</h4>
              <p>Baseado na análise, seleciona o template mais apropriado e personaliza etapas, tarefas, prazos e responsabilidades.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">⏱️ Timer Integrado</h4>
              <p>Todas as tarefas geradas incluem timer obrigatório para controle preciso de produtividade e análise de desempenho.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 