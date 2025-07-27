'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, Clock, Users, AlertTriangle, CheckCircle2, Circle, Play, Pause,
  TrendingUp, Target, Zap, Filter, Search, Bell, Settings, BarChart3,
  Timer, MessageSquare, FileText, Star, Eye, Download, Share2, RefreshCw,
  Layers, Grid3X3, List, Map, Maximize2, ChevronDown, Plus, MoreVertical
} from 'lucide-react';

// Dados mock revolucionários baseados em análise de mercado
const projetoMock = {
  id: 'PRJ-2024-001',
  nome: 'Casa Residencial Alto Padrão - Família Silva',
  cliente: 'João e Maria Silva',
  tipologia: 'RESIDENCIAL_ALTO_PADRAO',
  area: 450,
  valor: 120000,
  status: 'EM_ANDAMENTO',
  prioridade: 'ALTA',
  dataInicio: '2024-01-15',
  dataPrevisao: '2024-06-15',
  progresso: 68,
  saude: 'EXCELENTE', // Verde, Amarelo, Vermelho
  velocidade: 92, // Pontos por sprint
  risco: 'BAIXO',
  satisfacaoCliente: 95
};

const metricasAvancadas = {
  kpis: [
    { nome: 'Progresso Geral', valor: 68, meta: 70, tendencia: 'up', cor: 'green' },
    { nome: 'Tarefas Concluídas', valor: 86, meta: 90, tendencia: 'up', cor: 'blue' },
    { nome: 'Eficiência da Equipe', valor: 92, meta: 85, tendencia: 'up', cor: 'purple' },
    { nome: 'Satisfação Cliente', valor: 95, meta: 90, tendencia: 'stable', cor: 'orange' }
  ],
  burndown: [
    { sprint: 1, planejado: 100, realizado: 95 },
    { sprint: 2, planejado: 80, realizado: 78 },
    { sprint: 3, planejado: 60, realizado: 65 },
    { sprint: 4, planejado: 40, realizado: 32 }
  ]
};

const etapasRevolucionarias = [
  {
    id: 1,
    nome: 'Levantamento e Análise',
    status: 'CONCLUIDA',
    progresso: 100,
    prioridade: 'ALTA',
    dataInicio: '2024-01-15',
    dataConclusao: '2024-02-15',
    tempoEstimado: '32h',
    tempoRealizado: '28h',
    eficiencia: 114,
    tarefas: [
      { 
        id: 1, 
        nome: 'Levantamento topográfico', 
        status: 'CONCLUIDA', 
        responsavel: 'Ana Arquiteta', 
        avatar: 'AA',
        tempo: '8h 30m',
        prioridade: 'ALTA',
        complexidade: 'MEDIA',
        tags: ['topografia', 'campo']
      },
      { 
        id: 2, 
        nome: 'Análise do terreno', 
        status: 'CONCLUIDA', 
        responsavel: 'Ana Arquiteta',
        avatar: 'AA', 
        tempo: '6h 15m',
        prioridade: 'ALTA',
        complexidade: 'BAIXA',
        tags: ['análise', 'solo']
      }
    ]
  },
  {
    id: 2,
    nome: 'Estudo Preliminar',
    status: 'CONCLUIDA',
    progresso: 100,
    prioridade: 'ALTA',
    dataInicio: '2024-02-16',
    dataConclusao: '2024-03-20',
    tempoEstimado: '48h',
    tempoRealizado: '46h',
    eficiencia: 104,
    tarefas: [
      { 
        id: 4, 
        nome: 'Plantas baixas preliminares', 
        status: 'CONCLUIDA', 
        responsavel: 'Ana Arquiteta',
        avatar: 'AA',
        tempo: '24h 20m',
        prioridade: 'ALTA',
        complexidade: 'ALTA',
        tags: ['plantas', 'arquitetura']
      }
    ]
  },
  {
    id: 3,
    nome: 'Anteprojeto',
    status: 'EM_ANDAMENTO',
    progresso: 75,
    prioridade: 'ALTA',
    dataInicio: '2024-03-21',
    dataPrevisao: '2024-05-10',
    tempoEstimado: '72h',
    tempoRealizado: '54h',
    eficiencia: 98,
    tarefas: [
      { 
        id: 7, 
        nome: 'Plantas baixas definitivas', 
        status: 'CONCLUIDA', 
        responsavel: 'Ana Arquiteta',
        avatar: 'AA',
        tempo: '32h 15m',
        prioridade: 'ALTA',
        complexidade: 'ALTA',
        tags: ['plantas', 'definitivo']
      },
      { 
        id: 8, 
        nome: 'Projeto estrutural preliminar', 
        status: 'EM_ANDAMENTO', 
        responsavel: 'Carlos Estrutural',
        avatar: 'CE',
        tempo: '18h 30m / 24h',
        prioridade: 'MEDIA',
        complexidade: 'ALTA',
        tags: ['estrutural', 'cálculo']
      }
    ]
  }
];

const equipeAvancada = [
  { 
    nome: 'Ana Arquiteta', 
    cargo: 'Arquiteta Líder', 
    avatar: 'AA', 
    carga: 85,
    status: 'ATIVO',
    tarefasAtivas: 3,
    eficiencia: 96,
    especialidades: ['Residencial', 'Alto Padrão']
  },
  { 
    nome: 'Carlos Estrutural', 
    cargo: 'Eng. Estrutural', 
    avatar: 'CE', 
    carga: 60,
    status: 'ATIVO',
    tarefasAtivas: 2,
    eficiencia: 88,
    especialidades: ['Concreto', 'Metálica']
  }
];

export default function DashboardRevolucionario() {
  const params = useParams();
  const [projeto] = useState(projetoMock);
  const [etapas] = useState(etapasRevolucionarias);
  const [equipe] = useState(equipeAvancada);
  const [viewMode, setViewMode] = useState('KANBAN');
  const [filtros, setFiltros] = useState({
    status: 'TODOS',
    responsavel: 'TODOS',
    prioridade: 'TODOS'
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'CONCLUIDA': 'bg-emerald-500',
      'EM_ANDAMENTO': 'bg-blue-500',
      'NAO_INICIADA': 'bg-slate-400',
      'ATRASADA': 'bg-red-500',
      'PAUSADA': 'bg-yellow-500'
    };
    return colors[status] || 'bg-slate-400';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      'ALTA': 'bg-red-100 text-red-800 border-red-200',
      'MEDIA': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'BAIXA': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[prioridade] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header Revolucionário - Inspirado no Monday.com */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Informações do Projeto */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">{projeto.nome}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-600 font-medium">{projeto.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-600">{projeto.cliente}</span>
                    <span className="text-slate-400">•</span>
                    <Badge variant="outline" className="text-xs">
                      {projeto.area}m² • R$ {projeto.valor.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Status e Saúde do Projeto */}
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(projeto.status)} text-white border-0 px-3 py-1`}>
                  <Circle className="h-3 w-3 mr-1 fill-current" />
                  Em Andamento
                </Badge>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-700">Saúde Excelente</span>
                </div>
              </div>
            </div>

            {/* Controles Avançados */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Bell className="h-4 w-4 mr-2" />
                <Badge className="bg-red-500 text-white text-xs ml-1">3</Badge>
              </Button>
              
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat do Projeto
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* KPIs Visuais - Inspirado no ClickUp */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricasAvancadas.kpis.map((kpi, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${kpi.cor}-500`}></div>
                    <h3 className="font-medium text-slate-700 text-sm">{kpi.nome}</h3>
                  </div>
                  <TrendingUp className={`h-4 w-4 text-${kpi.cor}-500`} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{kpi.valor}</span>
                    <span className="text-sm text-slate-500">/ {kpi.meta}</span>
                  </div>
                  
                  <Progress value={(kpi.valor / kpi.meta) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`text-${kpi.cor}-600 font-medium`}>
                      {kpi.valor > kpi.meta ? '+' : ''}{kpi.valor - kpi.meta} vs meta
                    </span>
                    <span className="text-slate-500">
                      {Math.round((kpi.valor / kpi.meta) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controles de Visualização - Inspirado no Asana */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Filtros Inteligentes */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filtros:</span>
              </div>
              
              <select 
                className="bg-white/80 border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <option value="TODOS">Todos os Status</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDA">Concluídas</option>
                <option value="NAO_INICIADA">Não Iniciadas</option>
              </select>
              
              <select 
                className="bg-white/80 border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filtros.responsavel}
                onChange={(e) => setFiltros({...filtros, responsavel: e.target.value})}
              >
                <option value="TODOS">Todos os Responsáveis</option>
                <option value="Ana">Ana Arquiteta</option>
                <option value="Carlos">Carlos Estrutural</option>
              </select>
            </div>

            {/* Busca Avançada */}
            <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar tarefas, etapas, responsáveis..."
                className="bg-transparent text-sm placeholder:text-slate-400 focus:outline-none w-64"
              />
            </div>
          </div>

          {/* Modos de Visualização */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <Button 
              variant={viewMode === 'KANBAN' ? 'primary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('KANBAN')}
              className="text-xs"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Kanban
            </Button>
            <Button 
              variant={viewMode === 'LIST' ? 'primary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('LIST')}
              className="text-xs"
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
            <Button 
              variant={viewMode === 'TIMELINE' ? 'primary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('TIMELINE')}
              className="text-xs"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Timeline
            </Button>
          </div>
        </div>

        {/* Etapas do Projeto - Estilo Kanban Revolucionário */}
        <div className="space-y-6">
          {etapas.map((etapa) => (
            <Card key={etapa.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Header da Etapa */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(etapa.status)} shadow-sm`}></div>
                      <h2 className="text-xl font-bold text-slate-900">{etapa.nome}</h2>
                      <Badge className={getPrioridadeColor(etapa.prioridade)} variant="outline">
                        {etapa.prioridade}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Métricas da Etapa */}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{etapa.dataInicio} - {etapa.dataConclusao || etapa.dataPrevisao}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        <span>{etapa.tempoRealizado} / {etapa.tempoEstimado}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span className="font-medium text-emerald-600">{etapa.eficiencia}% eficiência</span>
                      </div>
                    </div>
                    
                    {/* Progresso Visual */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{etapa.progresso}%</p>
                        <Progress value={etapa.progresso} className="w-24 h-2" />
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarefas da Etapa */}
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {etapa.tarefas.map((tarefa) => (
                    <div key={tarefa.id} className="group flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200 border border-slate-100">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(tarefa.status)} shadow-sm`}></div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{tarefa.nome}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>Complexidade: {tarefa.complexidade}</span>
                            <div className="flex gap-1">
                              {tarefa.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs px-2 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                            <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              {tarefa.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-slate-700 hidden md:block">{tarefa.responsavel}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-lg px-3 py-1 border">
                          <Clock className="h-3 w-3" />
                          <span>{tarefa.tempo}</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          {tarefa.status === 'EM_ANDAMENTO' ? (
                            <Pause className="h-4 w-4 text-orange-500" />
                          ) : (
                            <Play className="h-4 w-4 text-emerald-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção da Equipe e Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equipe Avançada */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Equipe do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {equipe.map((membro, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-white transition-all duration-200 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                        <AvatarFallback className="font-medium bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {membro.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        membro.status === 'ATIVO' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}></div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900">{membro.nome}</h4>
                      <p className="text-sm text-slate-600">{membro.cargo}</p>
                      <div className="flex gap-1 mt-1">
                        {membro.especialidades.map((esp, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{membro.carga}%</span>
                      <span className="text-xs text-slate-500">carga</span>
                    </div>
                    <Progress value={membro.carga} className="w-20 h-2 mb-1" />
                    <p className="text-xs text-slate-500">{membro.tarefasAtivas} tarefas ativas</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analytics Avançado */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Insights Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Projeto Performando Acima da Média</span>
                </div>
                <p className="text-sm text-emerald-700">
                  Velocidade 15% acima da média histórica. Eficiência da equipe em 92%.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">Previsão de Entrega</span>
                </div>
                <p className="text-sm text-blue-700">
                  Com a velocidade atual, entrega prevista para 8 dias antes do prazo.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-2 text-orange-800 mb-2">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">Satisfação do Cliente</span>
                </div>
                <p className="text-sm text-orange-700">
                  95% de satisfação - cliente altamente engajado no processo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Revolucionário */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              🚀 Dashboard Revolucionária ARCFLOW
            </h3>
            <p className="text-slate-600 mb-6">
              Baseada nas melhores práticas do Monday.com, Asana, ClickUp e Notion. 
              Uma interface que revoluciona a gestão de projetos de arquitetura.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Star className="h-5 w-5 mr-2" />
                Explorar Funcionalidades Completas
              </Button>
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 