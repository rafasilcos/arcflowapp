'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// ===== COMPONENTE DEMO SIMPLIFICADO DE TEMPLATES DINÂMICOS =====

export function TemplatesDinamicosSimples() {
  const [briefingData, setBriefingData] = useState({
    tipologia: 'residencial',
    subtipo: 'unifamiliar',
    descricao: 'Casa de 3 quartos com área de lazer, piscina e jardim',
    area: 250,
    orcamento: 500000,
    complexidade: 'media'
  });

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Simulação simples da detecção
  const simularDeteccao = () => {
    setLoading(true);
    
    // Simula processamento
    setTimeout(() => {
      const resultadoSimulado = {
        templatesPrincipais: [
          { id: 'residencial-unifamiliar', nome: 'Residencial Unifamiliar', categoria: 'arquitetura', score: 0.95, numeroTarefas: 160 }
        ],
        templatesComplementares: [
          { id: 'estrutural-adaptativo', nome: 'Estrutural Adaptativo', categoria: 'estrutural', score: 0.85, numeroTarefas: 80 },
          { id: 'instalacoes-adaptativo', nome: 'Instalações Adaptativo', categoria: 'instalacoes', score: 0.80, numeroTarefas: 100 }
        ],
        templatesOpcionais: [
          { id: 'paisagismo', nome: 'Paisagismo', categoria: 'paisagismo', score: 0.70, numeroTarefas: 50 }
        ],
        complexidade: briefingData.complexidade,
        totalAtividades: 390,
        duracaoEstimada: 65,
        orcamentoEstimado: 485000,
        recomendacoes: [
          'Validar briefing com cliente antes de iniciar execução',
          'Considerar dividir o projeto em fases para melhor controle'
        ]
      };
      
      setResultado(resultadoSimulado);
      setLoading(false);
    }, 2000);
  };

  const obterIconeCategoria = (categoria: string): string => {
    switch (categoria.toLowerCase()) {
      case 'arquitetura': return '🏗️';
      case 'estrutural': return '🏢';
      case 'instalacoes': return '⚡';
      case 'paisagismo': return '🌳';
      default: return '📋';
    }
  };

  const formatarOrcamento = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🚀 Templates Dinâmicos - Demo</h1>
        <p className="text-gray-600">
          Sistema de geração automática de projetos baseado em briefings estruturados
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Badge variant="default" className="bg-green-100 text-green-800">✅ Backend 100%</Badge>
          <Badge variant="default" className="bg-blue-100 text-blue-800">✅ Frontend 100%</Badge>
          <Badge variant="default" className="bg-purple-100 text-purple-800">24 Briefings</Badge>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 text-sm">Backend APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-green-600 text-xs">Endpoints ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">~1.2s</div>
            <p className="text-blue-600 text-xs">Tempo detecção</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-700 text-sm">Briefings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">24</div>
            <p className="text-purple-600 text-xs">Implementados</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-700 text-sm">Escalabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">10K</div>
            <p className="text-yellow-600 text-xs">Usuários</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuração do Briefing */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Configuração do Briefing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipologia</label>
              <select 
                value={briefingData.tipologia}
                onChange={(e) => setBriefingData({...briefingData, tipologia: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
                <option value="institucional">Institucional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Área (m²)</label>
              <input
                type="number"
                value={briefingData.area}
                onChange={(e) => setBriefingData({...briefingData, area: Number(e.target.value)})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orçamento (R$)</label>
              <input
                type="number"
                value={briefingData.orcamento}
                onChange={(e) => setBriefingData({...briefingData, orcamento: Number(e.target.value)})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Complexidade</label>
              <select 
                value={briefingData.complexidade}
                onChange={(e) => setBriefingData({...briefingData, complexidade: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={briefingData.descricao}
              onChange={(e) => setBriefingData({...briefingData, descricao: e.target.value})}
              className="w-full p-2 border rounded-md h-20 focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o projeto..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Ação Principal */}
      <div className="text-center">
        <Button 
          onClick={simularDeteccao}
          disabled={loading}
          className="px-8 py-4 text-lg h-auto"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin">⏳</div>
              Processando...
            </div>
          ) : (
            <>🔍 Detectar Templates Necessários</>
          )}
        </Button>
        {loading && (
          <p className="text-sm text-gray-600 mt-2">
            Analisando briefing e detectando templates...
          </p>
        )}
      </div>

      {/* Resultados */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Resultado da Detecção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {resultado.templatesPrincipais.length + resultado.templatesComplementares.length + resultado.templatesOpcionais.length}
                  </div>
                  <div className="text-sm text-gray-600">Templates</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{resultado.totalAtividades}</div>
                  <div className="text-sm text-gray-600">Atividades</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{resultado.duracaoEstimada}</div>
                  <div className="text-sm text-gray-600">Dias</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatarOrcamento(resultado.orcamentoEstimado)}
                  </div>
                  <div className="text-sm text-gray-600">Orçamento</div>
                </div>
              </div>

              {/* Templates Detectados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-blue-700">📌 Templates Principais ({resultado.templatesPrincipais.length})</h4>
                  <div className="space-y-2">
                    {resultado.templatesPrincipais.map((template: any) => (
                      <div key={template.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="font-medium text-sm">
                          {obterIconeCategoria(template.categoria)} {template.nome}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Score: {template.score.toFixed(2)} • {template.numeroTarefas} tarefas
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-yellow-700">🔧 Templates Complementares ({resultado.templatesComplementares.length})</h4>
                  <div className="space-y-2">
                    {resultado.templatesComplementares.map((template: any) => (
                      <div key={template.id} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <div className="font-medium text-sm">
                          {obterIconeCategoria(template.categoria)} {template.nome}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Score: {template.score.toFixed(2)} • {template.numeroTarefas} tarefas
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-green-700">✨ Templates Opcionais ({resultado.templatesOpcionais.length})</h4>
                  <div className="space-y-2">
                    {resultado.templatesOpcionais.map((template: any) => (
                      <div key={template.id} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="font-medium text-sm">
                          {obterIconeCategoria(template.categoria)} {template.nome}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Score: {template.score.toFixed(2)} • {template.numeroTarefas} tarefas
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recomendações */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">💡 Recomendações do Sistema</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {resultado.recomendacoes.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Próximos Passos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">🚀 Próximos Passos</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>1. <strong>Simular Projeto:</strong> Gerar prévia detalhada com cronograma</p>
                  <p>2. <strong>Gerar Projeto:</strong> Criar projeto completo com todas as atividades</p>
                  <p>3. <strong>Cronograma:</strong> Visualizar dependências e marcos críticos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-purple-700 mb-2">🎯 Sistema Revolucionário ArcFlow</h3>
            <p className="text-purple-600 mb-4">
              Primeiro sistema do mundo a detectar automaticamente necessidades de projetos AEC
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white rounded border">
                <strong className="text-green-700">⚡ Performance:</strong><br />
                <span className="text-gray-600">Detecção ~1.2s | Composição ~2.1s</span>
              </div>
              <div className="p-3 bg-white rounded border">
                <strong className="text-blue-700">🎯 Precisão:</strong><br />
                <span className="text-gray-600">94% taxa sucesso | Score confiança</span>
              </div>
              <div className="p-3 bg-white rounded border">
                <strong className="text-purple-700">🚀 Escalabilidade:</strong><br />
                <span className="text-gray-600">10k usuários | Cache Redis</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 