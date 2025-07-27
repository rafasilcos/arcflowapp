/**
 * 🚀 PÁGINA DE DEMONSTRAÇÃO - INTEGRAÇÃO REVOLUCIONÁRIA ARCFLOW
 * 
 * Demonstra o sistema híbrido:
 * - Regras inteligentes (GRATUITO - 85% precisão)
 * - IA Gemini opcional (PRO - 95% precisão)
 * - 100% confiável e escalável
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Brain, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Cpu,
  Sparkles,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';

import { IntegracaoRevolucionariaService, FluxoRevolucionario, ResultadoIntegracao } from '@/services/integracaoRevolucionaria';
import { AnaliseInteligenteService, PlanoUsuario } from '@/services/analiseInteligenteService';
// import TemplatesInteligenteService from '@/services/templatesInteligenteService'; // Removido temporariamente
import { BriefingCompleto } from '@/types/briefing';

export default function IntegracaoRevolucionariaPage() {
  const [isProcessando, setIsProcessando] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState<FluxoRevolucionario | null>(null);
  const [resultado, setResultado] = useState<ResultadoIntegracao | null>(null);
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoUsuario>('GRATUITO');
  const [briefingDemo, setBriefingDemo] = useState<BriefingCompleto | null>(null);

  // Dados de demonstração - Mock para o serviço
  const briefingExemplo: any = {
    id: 'DEMO_001',
    titulo: 'Casa Residencial com Home Office',
    nome: 'Casa Residencial com Home Office',
    tipologia: 'RESIDENCIAL',
    subtipo: 'Casa Unifamiliar',
    padrao: 'MEDIO',
    areaTotal: 180,
    descricao: 'Casa residencial moderna com home office, piscina e sistema de automação residencial. Sustentabilidade é prioridade.',
    ambientes: ['Sala', 'Cozinha', 'Home Office', 'Suíte Master', '2 Quartos', 'Piscina', 'Área Gourmet'],
    disciplinas: ['ARQ', 'EST', 'ELE', 'HID', 'AVAC', 'PAISAG', 'AUTOMACAO'],
    complexidade: 'MEDIA',
    cliente: {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999'
    },
    orcamento: 250000,
    prazoDesejado: 120,
    observacoes: 'Cliente valoriza sustentabilidade e tecnologia',
    status: 'APROVADO',
    dataAprovacao: new Date().toISOString(),
    totalPerguntas: 45,
    tempoEstimado: '15-20 minutos',
    versao: '1.0',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    secoes: [
      {
        id: 'dados_basicos',
        nome: 'Dados Básicos',
        descricao: 'Informações gerais do projeto',
        perguntas: [],
        obrigatoria: true
      }
    ],
    metadata: {
      tags: ['home office', 'piscina', 'automação'],
      categoria: 'residencial',
      complexidade: 'media',
      publico: ['arquitetos', 'engenheiros']
    }
  };

  const executarDemonstracao = async () => {
    setIsProcessando(true);
    setResultado(null);
    setBriefingDemo(briefingExemplo);

    try {
      const resultado = await IntegracaoRevolucionariaService.executarFluxoCompleto(
        briefingExemplo,
        planoSelecionado,
        (etapa) => {
          setEtapaAtual(etapa);
        }
      );

      setResultado(resultado);
      
    } catch (error) {
      console.error('Erro na demonstração:', error);
      alert('Erro na demonstração. Verifique o console.');
    } finally {
      setIsProcessando(false);
      setEtapaAtual(null);
    }
  };

  const estatisticas = IntegracaoRevolucionariaService.obterEstatisticasIntegracao();
  // const statsTemplates = { totalTemplates: 12, templatesAtivos: 8, matchPrecision: 85 }; // Removido temporariamente
  const statsRegras = AnaliseInteligenteService.obterEstatisticas();

  return (
    <div className="container mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Integração Revolucionária ARCFLOW
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sistema híbrido que combina <strong>regras especializadas</strong> com <strong>IA avançada</strong> para criar projetos personalizados em minutos
        </p>
      </div>

      {/* Seletor de Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Escolha seu Plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Plano Gratuito */}
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                planoSelecionado === 'GRATUITO' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPlanoSelecionado('GRATUITO')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Plano Gratuito</h3>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  R$ 0
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span>Sistema de regras especializadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>85% de precisão</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Processamento em 2 segundos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>100% confiável</span>
                </div>
              </div>
            </div>

            {/* Plano Pro */}
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                planoSelecionado === 'PRO' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPlanoSelecionado('PRO')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Plano Pro</h3>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  R$ 599/mês
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Regras + IA Gemini 2.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>95% de precisão</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Análise mais detalhada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Sugestões criativas</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Demonstração */}
      <div className="text-center">
        <Button 
          onClick={executarDemonstracao}
          disabled={isProcessando}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          {isProcessando ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Processando...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Executar Demonstração {planoSelecionado}
            </>
          )}
        </Button>
      </div>

      {/* Progresso da Execução */}
      {etapaAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Progresso da Execução
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {etapaAtual.etapa.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-600">
                {etapaAtual.progresso}%
              </span>
            </div>
            <Progress value={etapaAtual.progresso} className="w-full" />
            <p className="text-sm text-gray-600">
              Tempo estimado: {etapaAtual.tempoEstimado} segundos
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resultado da Análise */}
      {resultado && (
        <div className="space-y-6">
          
          {/* Resumo Executivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resultado da Análise {planoSelecionado}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {resultado.economiaGerada.tempoEconomizado}h
                  </div>
                  <div className="text-sm text-gray-600">Tempo Economizado</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {resultado.economiaGerada.custosEvitados.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Custos Evitados</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {resultado.economiaGerada.eficienciaGanha}%
                  </div>
                  <div className="text-sm text-gray-600">Eficiência Ganha</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Análise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise Detalhada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Template Selecionado</h4>
                  <p className="text-sm text-gray-600">
                    {resultado.templateSelecionado.nome}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {resultado.templateSelecionado.complexidade || 'MEDIO'}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Tipo de Análise</h4>
                  <Badge 
                    variant={resultado.analisePersonalizacao.tipoAnalise === 'HIBRIDA' ? 'default' : 'secondary'}
                    className="mr-2"
                  >
                    {resultado.analisePersonalizacao.tipoAnalise}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {resultado.analisePersonalizacao.confidenciaAnalise}% confiança
                  </span>
                </div>
              </div>

              {/* Modificações Aplicadas */}
              <div className="space-y-3">
                <h4 className="font-semibold">Modificações Aplicadas</h4>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-800">Etapas Removidas</div>
                    <div className="text-2xl font-bold text-red-600">
                      {resultado.analisePersonalizacao.etapasRemover.length}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Etapas Adicionadas</div>
                    <div className="text-2xl font-bold text-green-600">
                      {resultado.analisePersonalizacao.etapasAdicionar.length}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Tarefas Modificadas</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {resultado.analisePersonalizacao.tarefasModificar.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendações */}
              {resultado.analisePersonalizacao.recomendacoes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Recomendações</h4>
                  {resultado.analisePersonalizacao.recomendacoes.map((rec, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-yellow-800">{rec.titulo}</div>
                          <div className="text-sm text-yellow-700">{rec.descricao}</div>
                          <div className="text-xs text-yellow-600 mt-1">{rec.acao}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sugestão de Upgrade (apenas para plano gratuito) */}
              {resultado.analisePersonalizacao.sugestaoUpgrade && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {resultado.analisePersonalizacao.sugestaoUpgrade.titulo}
                  </h4>
                  <p className="text-sm text-purple-700 mb-3">
                    {resultado.analisePersonalizacao.sugestaoUpgrade.descricao}
                  </p>
                  <ul className="text-xs text-purple-600 space-y-1 mb-3">
                    {resultado.analisePersonalizacao.sugestaoUpgrade.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Fazer Upgrade
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projeto Final */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Projeto Final Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações Gerais</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Nome:</strong> {resultado.projetoFinal.nome}</div>
                    <div><strong>Prazo:</strong> {resultado.projetoFinal.prazoEstimado} dias</div>
                    <div><strong>Valor:</strong> R$ {resultado.projetoFinal.valorEstimado?.toLocaleString()}</div>
                    <div><strong>Complexidade:</strong> {resultado.projetoFinal.complexidade}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Disciplinas</h4>
                  <div className="flex flex-wrap gap-1">
                    {resultado.projetoFinal.disciplinas.map((disc: any, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {disc.nome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Fases do Projeto ({resultado.projetoFinal.fases.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {resultado.projetoFinal.fases.map((fase: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {fase.disciplina}
                        </Badge>
                        <span className="text-sm">{fase.nome}</span>
                      </div>
                      <span className="text-xs text-gray-600">{fase.prazo} dias</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estatísticas do Sistema */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Stats Integração */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integração Revolucionária</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total de Fluxos</span>
              <span className="font-semibold">{estatisticas.totalFluxosExecutados.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tempo Médio</span>
              <span className="font-semibold">{estatisticas.tempoMedioProcessamento}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Taxa de Sucesso</span>
              <span className="font-semibold">{estatisticas.taxaSucesso}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Templates Inteligentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total de Templates</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Residencial</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comercial</span>
              <span className="font-semibold">4</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Regras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sistema de Regras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total de Regras</span>
              <span className="font-semibold">{statsRegras.totalRegras}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Residencial</span>
              <span className="font-semibold">{statsRegras.regrasPorTipologia.RESIDENCIAL || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comercial</span>
              <span className="font-semibold">{statsRegras.regrasPorTipologia.COMERCIAL || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 