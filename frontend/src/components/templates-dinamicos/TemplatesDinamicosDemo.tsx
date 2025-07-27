'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { LoadingIndicator } from '../../design-system/molecules/LoadingIndicator';
import {
  useTemplatesDinamicosStatus,
  useDetectarNecessidadesMutation,
  useSimularProjetoMutation,
  useGerarProjetoMutation,
  useTemplatesDinamicosMetricas
} from '../../hooks/useTemplatesDinamicos';
import { TemplatesDinamicosService } from '../../services/templatesDinamicosService';
import type { AnaliseNecessidades, SimulacaoResultado, ResultadoTemplatesDinamicos } from '../../types/templates-dinamicos';

// Componente Alert simples local
const Alert = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-blue-700">{children}</div>
);

// ===== COMPONENTE DEMO DE TEMPLATES DINÂMICOS =====

export function TemplatesDinamicosDemo() {
  const [briefingData, setBriefingData] = useState({
    tipologia: 'residencial',
    subtipo: 'unifamiliar',
    descricao: 'Casa de 3 quartos com área de lazer, piscina e jardim',
    area: 250,
    orcamento: 500000,
    prioridades: ['estrutural', 'instalacoes', 'paisagismo'],
    complexidade: 'media'
  });

  const [analiseResult, setAnaliseResult] = useState<AnaliseNecessidades | null>(null);
  const [simulacaoResult, setSimulacaoResult] = useState<SimulacaoResultado | null>(null);
  const [projetoResult, setProjetoResult] = useState<ResultadoTemplatesDinamicos | null>(null);

  // Hooks
  const status = useTemplatesDinamicosStatus();
  const metricas = useTemplatesDinamicosMetricas();
  const detectarMutation = useDetectarNecessidadesMutation();
  const simularMutation = useSimularProjetoMutation();
  const gerarMutation = useGerarProjetoMutation();

  // Handlers
  const handleDetectarNecessidades = async () => {
    try {
      const result = await detectarMutation.mutateAsync(briefingData);
      setAnaliseResult(result);
    } catch (error) {
      console.error('Erro na detecção:', error);
    }
  };

  const handleSimularProjeto = async () => {
    try {
      const result = await simularMutation.mutateAsync({
        briefingData,
        configuracao: { incluirOpcionais: true, scoreMinimo: 0.6 }
      });
      setSimulacaoResult(result);
    } catch (error) {
      console.error('Erro na simulação:', error);
    }
  };

  const handleGerarProjeto = async () => {
    try {
      const projetoId = `demo_${Date.now()}`;
      const result = await gerarMutation.mutateAsync({
        projetoId,
        briefingData,
        configuracao: { incluirOpcionais: true }
      });
      setProjetoResult(result);
    } catch (error) {
      console.error('Erro na geração:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🚀 Templates Dinâmicos - Demo</h1>
        <p className="text-gray-600">
          Sistema de geração automática de projetos baseado em briefings estruturados
        </p>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.isHealthy ? '🟢' : '🔴'} Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Saúde do Sistema</p>
              <p className={`font-semibold ${status.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                {status.isHealthy ? 'Saudável' : 'Indisponível'}
              </p>
            </div>
            {metricas.data && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Templates Processados</p>
                  <p className="font-semibold">{metricas.data.sistema.templatesProcessados}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                  <p className="font-semibold text-green-600">
                    {(metricas.data.sistema.taxaSucesso * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

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
                className="w-full p-2 border rounded-md"
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
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orçamento (R$)</label>
              <input
                type="number"
                value={briefingData.orcamento}
                onChange={(e) => setBriefingData({...briefingData, orcamento: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Complexidade</label>
              <select 
                value={briefingData.complexidade}
                onChange={(e) => setBriefingData({...briefingData, complexidade: e.target.value})}
                className="w-full p-2 border rounded-md"
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
              className="w-full p-2 border rounded-md h-20"
              placeholder="Descreva o projeto..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={handleDetectarNecessidades}
          disabled={detectarMutation.isPending}
          className="h-16"
        >
          {detectarMutation.isPending ? (
            <div className="animate-spin">⏳</div>
          ) : (
            <>🔍 Detectar Necessidades</>
          )}
        </Button>
        
        <Button 
          onClick={handleSimularProjeto}
          disabled={simularMutation.isPending}
          variant="outline"
          className="h-16"
        >
          {simularMutation.isPending ? (
            <div className="animate-spin">⏳</div>
          ) : (
            <>🧪 Simular Projeto</>
          )}
        </Button>
        
        <Button 
          onClick={handleGerarProjeto}
          disabled={gerarMutation.isPending}
          variant="secondary"
          className="h-16"
        >
          {gerarMutation.isPending ? (
            <div className="animate-spin">⏳</div>
          ) : (
            <>🚀 Gerar Projeto</>
          )}
        </Button>
      </div>

      {/* Resultados */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">📊 Resultados</h2>
        
        {/* Tab: Análise de Necessidades */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 Análise de Necessidades</CardTitle>
          </CardHeader>
          <CardContent>
            {analiseResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant={analiseResult.complexidade === 'alta' ? 'destructive' : 'default'}>
                    {analiseResult.complexidade}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Confiança: {(analiseResult.confianca * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Templates Principais ({analiseResult.templatesPrincipais.length})</h4>
                    <div className="space-y-1">
                      {analiseResult.templatesPrincipais.map(template => (
                        <div key={template.id} className="text-sm p-2 bg-blue-50 rounded">
                          {TemplatesDinamicosService.obterIconeCategoria(template.categoria)} {template.nome}
                          <span className="ml-2 text-xs text-gray-600">
                            ({template.score.toFixed(2)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complementares ({analiseResult.templatesComplementares.length})</h4>
                    <div className="space-y-1">
                      {analiseResult.templatesComplementares.map(template => (
                        <div key={template.id} className="text-sm p-2 bg-yellow-50 rounded">
                          {TemplatesDinamicosService.obterIconeCategoria(template.categoria)} {template.nome}
                          <span className="ml-2 text-xs text-gray-600">
                            ({template.score.toFixed(2)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Opcionais ({analiseResult.templatesOpcionais.length})</h4>
                    <div className="space-y-1">
                      {analiseResult.templatesOpcionais.map(template => (
                        <div key={template.id} className="text-sm p-2 bg-green-50 rounded">
                          {TemplatesDinamicosService.obterIconeCategoria(template.categoria)} {template.nome}
                          <span className="ml-2 text-xs text-gray-600">
                            ({template.score.toFixed(2)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {analiseResult.recomendacoes.length > 0 && (
                  <Alert>
                    <AlertDescription>
                      <strong>Recomendações:</strong>
                      <ul className="mt-1 list-disc list-inside">
                        {analiseResult.recomendacoes.map((rec, idx) => (
                          <li key={idx} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Clique em "Detectar Necessidades" para analisar o briefing
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tab: Simulação */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🧪 Simulação de Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            {simulacaoResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <p className="text-2xl font-bold text-blue-600">
                      {simulacaoResult.resumo.totalTemplates}
                    </p>
                    <p className="text-sm text-gray-600">Templates</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <p className="text-2xl font-bold text-green-600">
                      {simulacaoResult.resumo.totalAtividades}
                    </p>
                    <p className="text-sm text-gray-600">Atividades</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded">
                    <p className="text-2xl font-bold text-yellow-600">
                      {simulacaoResult.resumo.duracaoEstimada}
                    </p>
                    <p className="text-sm text-gray-600">Dias</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <p className="text-2xl font-bold text-purple-600">
                      {TemplatesDinamicosService.formatarOrcamento(simulacaoResult.resumo.orcamentoEstimado)}
                    </p>
                    <p className="text-sm text-gray-600">Orçamento</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Métricas de Performance</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Tempo de Detecção: {simulacaoResult.metricas.tempoDeteccao}ms</div>
                    <div>Tempo de Composição: {simulacaoResult.metricas.tempoComposicao}ms</div>
                    <div>Tempo Total: {simulacaoResult.metricas.tempoTotal}ms</div>
                    <div>Complexidade: {simulacaoResult.metricas.complexidade}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Clique em "Simular Projeto" para ver uma prévia sem salvar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tab: Projeto Gerado */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Projeto Gerado</CardTitle>
          </CardHeader>
          <CardContent>
            {projetoResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="default">✅ Gerado com sucesso</Badge>
                  <span className="text-sm text-gray-600">
                    ID: {projetoResult.projetoComposto.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">📊 Resumo do Projeto</h4>
                    <div className="space-y-2 text-sm">
                      <div>Total de Atividades: {projetoResult.projetoComposto.atividades.length}</div>
                      <div>Templates Utilizados: {projetoResult.projetoComposto.templatesUtilizados.length}</div>
                      <div>Duração Estimada: {TemplatesDinamicosService.formatarDuracao(projetoResult.metricas.duracaoEstimada)}</div>
                      <div>Orçamento Total: {TemplatesDinamicosService.formatarOrcamento(projetoResult.projetoComposto.orcamento.total)}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">💰 Orçamento por Categoria</h4>
                    <div className="space-y-2">
                      {Object.entries(projetoResult.projetoComposto.orcamento.categorias).map(([categoria, valor]) => (
                        <div key={categoria} className="flex justify-between text-sm">
                          <span>{categoria}:</span>
                          <span className="font-medium">
                            {TemplatesDinamicosService.formatarOrcamento(valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">📅 Cronograma (Primeiras 5 atividades)</h4>
                  <div className="space-y-2">
                    {projetoResult.projetoComposto.cronograma.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-2 bg-gray-50 rounded text-sm">
                        <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium">{item.nome}</div>
                          <div className="text-gray-600">{item.categoria}</div>
                        </div>
                        <div className="text-right">
                          <div>{new Date(item.dataInicio).toLocaleDateString('pt-BR')}</div>
                          <div className="text-gray-600">até {new Date(item.dataFim).toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    ))}
                    {projetoResult.projetoComposto.cronograma.length > 5 && (
                      <p className="text-sm text-gray-600 text-center">
                        ... e mais {projetoResult.projetoComposto.cronograma.length - 5} atividades
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Clique em "Gerar Projeto" para criar um projeto completo
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 