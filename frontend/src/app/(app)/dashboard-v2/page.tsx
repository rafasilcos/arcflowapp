'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, Users, Eye, BarChart3, 
  TrendingUp, AlertTriangle, TrendingDown, 
  Activity, PieChart, Zap, Award, Timer, 
  Lightbulb, FolderOpen, Clock, CheckSquare,
  Calendar, User, Settings, Send, Download,
  ArrowLeft, ChevronRight
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTimer } from '@/hooks/useTimer'
import { apiClient } from '@/lib/api-client'
import { ProjectCache } from '@/lib/cache-advanced'
import { throttledSearch, throttledSave } from '@/lib/rate-limiter'
import { Button } from '@/components/ui/button'

// Dados específicos do "Onde Vai Seu Dinheiro" - Diferencial Único ArcFlow
const ANALISE_ONDE_VAI_DINHEIRO = [
  {
    etapa: 'Projeto Executivo',
    horasOrcadas: 36,
    horasReais: 45,
    custoReal: 'R$ 4.050',
    desvio: '+25%',
    tipo: 'critico' as const,
    gargalo: 'Detalhamento CAD',
    economia: 'R$ 810 (Template)',
    categoria: 'Desenvolvimento'
  },
  {
    etapa: 'Projeto Legal', 
    horasOrcadas: 28,
    horasReais: 32,
    custoReal: 'R$ 2.720',
    desvio: '+14%',
    tipo: 'atencao' as const,
    gargalo: 'Memorial Descritivo',
    economia: 'R$ 360 (Automação)',
    categoria: 'Aprovação'
  },
  {
    etapa: 'Levantamento',
    horasOrcadas: 20,
    horasReais: 18,
    custoReal: 'R$ 1.530',
    desvio: '-10%',
    tipo: 'otimo' as const,
    gargalo: 'Nenhum',
    economia: 'Já otimizado',
    categoria: 'Inicial'
  },
  {
    etapa: 'Compatibilização',
    horasOrcadas: 24,
    horasReais: 38,
    custoReal: 'R$ 3.420',
    desvio: '+58%',
    tipo: 'critico' as const,
    gargalo: 'Reuniões disciplinas',
    economia: 'R$ 1.260 (Checklist)',
    categoria: 'Coordenação'
  }
]

const PRODUTIVIDADE_COLABORADORES = [
  {
    nome: 'Ana Costa',
    especialidade: 'Projeto Legal',
    eficiencia: 125,
    projetos: 4,
    tendencia: 'subindo' as const,
    economia: 'R$ 2.400/mês vs média'
  },
  {
    nome: 'Carlos Lima',
    especialidade: 'Projeto Executivo', 
    eficiencia: 78,
    projetos: 3,
    tendencia: 'descendo' as const,
    economia: 'Precisa treinamento CAD'
  },
  {
    nome: 'Sofia Mendes',
    especialidade: 'Compatibilização',
    eficiencia: 110,
    projetos: 5,
    tendencia: 'subindo' as const,
    economia: 'R$ 1.200/mês vs média'
  }
]

const ROI_TIPOLOGIAS = [
  {
    tipologia: 'Residencial Alto Padrão',
    projetos: 8,
    receitaMedia: 'R$ 45.000',
    margemReal: '37%'
  },
  {
    tipologia: 'Comercial Médio Porte',
    projetos: 5,
    receitaMedia: 'R$ 68.500', 
    margemReal: '30%'
  },
  {
    tipologia: 'Industrial/Galpão',
    projetos: 3,
    receitaMedia: 'R$ 125.000',
    margemReal: '24%'
  }
]

const GARGALOS_IDENTIFICADOS = [
  {
    processo: 'Detalhamento CAD',
    frequencia: '85%',
    tempoMedio: '18h',
    solucao: 'Biblioteca de blocos padrão',
    economia: 'R$ 45.000/ano',
    prioridade: 'crítica' as const
  },
  {
    processo: 'Memorial Descritivo',
    frequencia: '70%', 
    tempoMedio: '8h',
    solucao: 'Template automatizado',
    economia: 'R$ 24.000/ano',
    prioridade: 'alta' as const
  },
  {
    processo: 'Reuniões Compatibilização',
    frequencia: '90%',
    tempoMedio: '12h',
    solucao: 'Checklist digital integrado',
    economia: 'R$ 36.000/ano',
    prioridade: 'crítica' as const
  }
]

const SUGESTOES_IA = [
  {
    titulo: 'Automatizar Memorial Descritivo',
    descricao: 'Template inteligente pode economizar 6h por projeto',
    impacto: 'R$ 3.240/projeto',
    dificuldade: 'Baixa' as const,
    prazo: '2 semanas',
    roi: '350%'
  },
  {
    titulo: 'Redistribuir Projetos Executivos',
    descricao: 'Carlos está 40% acima da capacidade ideal',
    impacto: '+25% produtividade',
    dificuldade: 'Média' as const,
    prazo: '1 semana',
    roi: '200%'
  },
  {
    titulo: 'Aumentar Valor Projeto Executivo',
    descricao: 'Dados mostram subprecificação de 25%',
    impacto: 'R$ 11.250 extra/projeto',
    dificuldade: 'Baixa' as const,
    prazo: 'Imediato',
    roi: '450%'
  }
]

const PROJETOS_EM_ANDAMENTO = [
  {
    nome: 'Residencial Vila Mariana',
    cliente: 'Construtora ABC',
    etapaAtual: 'Projeto Executivo',
    progresso: 65,
    proximaEntrega: '15/06',
    prioridade: 'alta' as const,
    status: 'Em dia',
    responsavel: 'Ana Costa',
    valorContrato: 'R$ 42.000'
  },
  {
    nome: 'Comercial Centro SP',
    cliente: 'Investimentos XYZ',
    etapaAtual: 'Compatibilização',
    progresso: 30,
    proximaEntrega: '12/06',
    prioridade: 'crítica' as const,
    status: '2 dias atraso',
    responsavel: 'Carlos Lima',
    valorContrato: 'R$ 68.500'
  },
  {
    nome: 'Industrial Guarulhos',
    cliente: 'Metalúrgica KLM',
    etapaAtual: 'Projeto Legal',
    progresso: 85,
    proximaEntrega: '20/06',
    prioridade: 'média' as const,
    status: 'Aguardando aprovação',
    responsavel: 'Sofia Mendes',
    valorContrato: 'R$ 125.000'
  },
  {
    nome: 'Residencial Moema',
    cliente: 'Família Silva',
    etapaAtual: 'Levantamento',
    progresso: 95,
    proximaEntrega: '10/06',
    prioridade: 'baixa' as const,
    status: 'Finalizando',
    responsavel: 'Ana Costa',
    valorContrato: 'R$ 35.000'
  }
]

const ATIVIDADES_HOJE = [
  {
    tipo: 'urgente' as const,
    titulo: 'Revisar compatibilização - Comercial Centro SP',
    descricao: 'Conflito estrutural identificado no 3º pavimento',
    prazo: '14:00',
    estimativa: '3h',
    projeto: 'Comercial Centro SP',
    prioridade: 1
  },
  {
    tipo: 'importante' as const,
    titulo: 'Finalizar memorial descritivo - Vila Mariana',
    descricao: 'Última revisão antes da entrega ao cliente',
    prazo: '17:00',
    estimativa: '2h',
    projeto: 'Residencial Vila Mariana',
    prioridade: 2
  },
  {
    tipo: 'normal' as const,
    titulo: 'Reunião de alinhamento - Industrial Guarulhos',
    descricao: 'Definir próximas etapas com a equipe',
    prazo: '10:30',
    estimativa: '1h',
    projeto: 'Industrial Guarulhos',
    prioridade: 3
  },
  {
    tipo: 'planejamento' as const,
    titulo: 'Análise de viabilidade - Novo projeto Mooca',
    descricao: 'Primeira reunião com cliente potencial',
    prazo: '16:00',
    estimativa: '1.5h',
    projeto: 'Novo Lead',
    prioridade: 4
  }
]

const AGENDA_HOJE = [
  {
    horario: '09:00',
    titulo: 'Reunião com cliente - Residencial Moema',
    tipo: 'cliente' as const,
    duracao: '1h',
    local: 'Escritório',
    participantes: ['Rafael', 'Ana Costa', 'Cliente']
  },
  {
    horario: '10:30',
    titulo: 'Alinhamento equipe - Industrial Guarulhos',
    tipo: 'interno' as const,
    duracao: '45min',
    local: 'Sala de reunião',
    participantes: ['Rafael', 'Sofia Mendes', 'Carlos Lima']
  },
  {
    horario: '14:00',
    titulo: 'Vistoria técnica - Comercial Centro SP',
    tipo: 'vistoria' as const,
    duracao: '2h',
    local: 'Centro SP - Rua Augusta, 1200',
    participantes: ['Carlos Lima', 'Eng. Estrutural']
  },
  {
    horario: '16:00',
    titulo: 'Apresentação proposta - Novo projeto Mooca',
    tipo: 'proposta' as const,
    duracao: '1h30',
    local: 'Online (Teams)',
    participantes: ['Rafael', 'Ana Costa']
  }
]

// Métricas principais para visão geral rápida
const METRICAS_PRINCIPAIS = [
  {
    titulo: 'Receita Mês',
    valor: 'R$ 284.500',
    variacao: '+12%',
    tipo: 'positivo' as const,
    icone: 'receita'
  },
  {
    titulo: 'Projetos Ativos',
    valor: '12',
    variacao: '+3',
    tipo: 'neutro' as const,
    icone: 'projetos'
  },
  {
    titulo: 'Taxa Conversão',
    valor: '68%',
    variacao: '+8%',
    tipo: 'positivo' as const,
    icone: 'conversao'
  },
  {
    titulo: 'Produtividade',
    valor: '94%',
    variacao: '-3%',
    tipo: 'atencao' as const,
    icone: 'produtividade'
  }
]

// Componente de cronômetro otimizado
const CronometroOtimizado = React.memo(() => {
  const { elapsed, isRunning, start, pause, reset } = useTimer();
  
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Timer className="w-4 h-4" />
      <span className="font-mono text-lg">{formatTime(elapsed)}</span>
      <button
        onClick={isRunning ? pause : start}
        className="px-2 py-1 text-sm rounded hover:bg-gray-100"
      >
        {isRunning ? 'Pausar' : 'Iniciar'}
      </button>
      <button
        onClick={reset}
        className="px-2 py-1 text-sm rounded hover:bg-gray-100"
      >
        Reset
      </button>
    </div>
  );
});

CronometroOtimizado.displayName = 'CronometroOtimizado';

// Hook para busca com throttling
const useBuscaOtimizada = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarDados = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }

    setCarregando(true);
    try {
      // Verificar cache primeiro
      const cacheKey = `search:${termo}`;
      const resultadosCache = await ProjectCache.get(cacheKey);
      
      if (resultadosCache) {
        setResultados(resultadosCache as any[]);
        return;
      }

      // Simular busca na API (substituir por chamada real)
      const response = await apiClient.get(`/search?q=${encodeURIComponent(termo)}`);
      
      // Cachear resultados
      await ProjectCache.set(cacheKey, (response as any).data, 5 * 60 * 1000); // 5min
      setResultados((response as any).data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Busca com throttling
  const buscaThrottled = useMemo(
    () => throttledSearch(buscarDados, 300),
    [buscarDados]
  );

  useEffect(() => {
    buscaThrottled(termoBusca);
  }, [termoBusca, buscaThrottled]);

  return { termoBusca, setTermoBusca, resultados, carregando };
};

// Sistema de salvamento automático
const useSalvamentoAutomatico = () => {
  const [dados, setDados] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [ultimoSalvamento, setUltimoSalvamento] = useState<Date | null>(null);

  const salvarDados = useCallback(async (novosDados: any) => {
    setSalvando(true);
    try {
      await apiClient.post('/dashboard/salvar', novosDados);
      setUltimoSalvamento(new Date());
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSalvando(false);
    }
  }, []);

  const salvarThrottled = useMemo(
    () => throttledSave(salvarDados, 2000),
    [salvarDados]
  );

  const atualizarDados = useCallback((novosDados: any) => {
    setDados(prev => ({ ...prev, ...novosDados }));
    salvarThrottled(novosDados);
  }, [salvarThrottled]);

  return { dados, atualizarDados, salvando, ultimoSalvamento };
};

// Componente principal otimizado
const DashboardV2Otimizado = React.memo(() => {
  const { tema, personalizacao, temaId } = useTheme();
  const { termoBusca, setTermoBusca, resultados, carregando } = useBuscaOtimizada();
  const { dados, atualizarDados, salvando, ultimoSalvamento } = useSalvamentoAutomatico();
  
  // Estados removidos: chat não é mais necessário
  
  // Dados memoizados para evitar recálculos
  const metricasCalculadas = useMemo(() => {
    return METRICAS_PRINCIPAIS.map(metrica => ({
      ...metrica,
      valorNumerico: parseFloat(metrica.valor.replace(/[^\d,.-]/g, '').replace(',', '.'))
    }));
  }, []);

  // Função para download de relatórios
  const downloadRelatorio = useCallback(async (tipo: string) => {
    try {
      const response = await apiClient.get(`/relatorios/${tipo}`);
      
      // Simular download
      const blob = new Blob([JSON.stringify(response)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${tipo}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
    }
  }, []);

  // Função de chat removida - não é mais necessária

  // Salvar todas as configurações
  const salvarTudo = useCallback(() => {
    atualizarDados({
      configuracoes: {
        tema: temaId,
        personalizacao,
        ultimaAtualizacao: new Date().toISOString()
      }
    });
  }, [temaId, personalizacao, atualizarDados]);

  return (
    <div className="p-6 space-y-6">
      
      {/* Header com Breadcrumb de Navegação */}
      <div className="flex items-center justify-between">
        {/* Breadcrumb de Navegação */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => window.history.back()}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            temaId === 'elegante'
                ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Projetos</span>
          </button>
          <ChevronRight className={`w-4 h-4 ${
            temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
          }`} />
          <span className={`font-semibold ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            Casa Residencial - Família Silva
          </span>
        </div>

        {/* Status e Cronômetro */}
        <div className="flex items-center space-x-4">
          <CronometroOtimizado />
          {ultimoSalvamento && (
            <span className="text-xs text-green-600">
              Salvo em {ultimoSalvamento.toLocaleTimeString()}
            </span>
          )}
          {salvando && (
            <span className="text-xs text-blue-600">Salvando...</span>
          )}
        </div>
      </div>

      {/* Chat removido - interface mais limpa */}

      {/* Barra de Busca Otimizada */}
      <div className="relative">
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Buscar projetos, clientes, atividades..."
          className={`w-full px-4 py-3 rounded-xl border ${
            temaId === 'elegante'
              ? 'bg-white border-gray-300 text-gray-900'
              : 'bg-white/10 border-white/20 text-white placeholder-white/60'
          }`}
        />
        {carregando && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* 1. VISÃO GERAL RÁPIDA - Métricas Principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {metricasCalculadas.map((metrica, index) => (
          <div key={index} className={`backdrop-blur-sm rounded-2xl p-4 ${
            temaId === 'elegante'
              ? 'bg-white border border-gray-200 shadow-sm'
              : 'bg-white/5 border border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-medium ${
                temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
              }`}>{metrica.titulo}</h3>
              <span className={`px-2 py-1 text-xs rounded-lg ${
                metrica.tipo === 'positivo' ? 'text-green-600' :
                metrica.tipo === 'atencao' ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {metrica.variacao}
              </span>
            </div>
            <p className={`text-2xl font-bold ${
              temaId === 'elegante' ? 'text-gray-900' : 'text-white'
            }`}>{metrica.valor}</p>
          </div>
        ))}
      </motion.div>

      {/* 2. O QUE FAZER HOJE - Agenda + Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agenda Hoje */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-sm rounded-2xl p-6 ${
            temaId === 'elegante'
              ? 'bg-white border border-gray-200 shadow-sm'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            <Calendar className="w-5 h-5 mr-2" />
            Agenda Hoje
          </h3>
          
          <div className="space-y-3">
            {AGENDA_HOJE.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>{item.horario}</span>
                  <span className={`px-2 py-1 text-xs rounded-lg ${
                    item.tipo === 'cliente' ? 'bg-blue-100 text-blue-700' :
                    item.tipo === 'interno' ? 'bg-green-100 text-green-700' :
                    item.tipo === 'vistoria' ? 'bg-orange-100 text-orange-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {item.duracao}
                  </span>
                </div>
                <h4 className={`text-sm font-medium mb-1 ${
                  temaId === 'elegante' ? 'text-gray-800' : 'text-white/90'
                }`}>{item.titulo}</h4>
                <p className={`text-xs ${
                  temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'
                }`}>📍 {item.local}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Suas Atividades Hoje */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 backdrop-blur-sm rounded-2xl p-6 ${
            temaId === 'elegante'
              ? 'bg-white border border-gray-200 shadow-sm'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold flex items-center ${
              temaId === 'elegante' ? 'text-gray-900' : 'text-white'
            }`}>
              <CheckSquare className="w-5 h-5 mr-2" />
              Suas Atividades Hoje
            </h3>
            <span className={`text-sm px-3 py-1 rounded-lg ${
              temaId === 'elegante' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-blue-500/20 text-blue-300'
            }`}>
              Por onde começar
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ATIVIDADES_HOJE.map((atividade, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                atividade.tipo === 'urgente'
                  ? temaId === 'elegante'
                    ? 'bg-red-50 border-l-red-500 border border-red-200'
                    : 'bg-red-500/10 border-l-red-500 border border-red-500/20'
                  : atividade.tipo === 'importante'
                    ? temaId === 'elegante'
                      ? 'bg-orange-50 border-l-orange-500 border border-orange-200'
                      : 'bg-orange-500/10 border-l-orange-500 border border-orange-500/20'
                    : atividade.tipo === 'normal'
                      ? temaId === 'elegante'
                        ? 'bg-blue-50 border-l-blue-500 border border-blue-200'
                        : 'bg-blue-500/10 border-l-blue-500 border border-blue-500/20'
                      : temaId === 'elegante'
                        ? 'bg-green-50 border-l-green-500 border border-green-200'
                        : 'bg-green-500/10 border-l-green-500 border border-green-500/20'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-medium text-sm ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>{atividade.titulo}</h4>
                  <div className="flex items-center space-x-1 text-xs">
                    <Clock className="w-3 h-3" />
                    <span className={temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}>
                      {atividade.prazo}
                    </span>
                  </div>
                </div>
                
                <p className={`text-xs mb-2 ${
                  temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                }`}>
                  {atividade.descricao}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}>
                    ⏱️ {atividade.estimativa}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    atividade.prioridade === 1 ? 'bg-red-100 text-red-700' :
                    atividade.prioridade === 2 ? 'bg-orange-100 text-orange-700' :
                    atividade.prioridade === 3 ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    #{atividade.prioridade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. STATUS DOS PROJETOS - Projetos em Andamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`backdrop-blur-sm rounded-2xl p-6 ${
          temaId === 'elegante'
            ? 'bg-white border border-gray-200 shadow-sm'
            : 'bg-white/5 border border-white/10'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          temaId === 'elegante' ? 'text-gray-900' : 'text-white'
        }`}>
          <FolderOpen className="w-5 h-5 mr-2" />
          Projetos em Andamento
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROJETOS_EM_ANDAMENTO.map((projeto, index) => (
            <div key={index} className={`p-4 rounded-xl border ${
              temaId === 'elegante' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <h4 className={`font-medium text-sm ${
                  temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                }`}>{projeto.nome}</h4>
                <span className={`px-2 py-1 text-xs rounded-lg ${
                  projeto.prioridade === 'crítica'
                    ? 'bg-red-500 text-white'
                    : projeto.prioridade === 'alta'
                      ? 'bg-orange-500 text-white'
                      : projeto.prioridade === 'média'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                }`}>
                  {projeto.prioridade}
                </span>
              </div>
              
              <p className={`text-xs mb-3 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                {projeto.cliente} • {projeto.valorContrato}
              </p>
              
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'}>
                    {projeto.etapaAtual}
                  </span>
                  <span className={`font-medium ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>{projeto.progresso}%</span>
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-1.5 ${
                  temaId === 'elegante' ? 'bg-gray-200' : 'bg-white/20'
                }`}>
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${projeto.progresso}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                    Entrega:
                  </span>
                  <span className={temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'}>
                    {projeto.proximaEntrega}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                    Status:
                  </span>
                  <span className={`${
                    projeto.status.includes('atraso') ? 'text-red-600' : 
                    projeto.status.includes('Aguardando') ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {projeto.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. ANÁLISES ESTRATÉGICAS - Onde Vai Seu Dinheiro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Etapas Mais Caras */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`backdrop-blur-sm rounded-2xl p-6 ${
              temaId === 'elegante'
                ? 'bg-white border border-gray-200 shadow-sm'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold flex items-center ${
                temaId === 'elegante' ? 'text-gray-900' : 'text-white'
              }`}>
                <Eye className="w-5 h-5 mr-2" />
                Onde Vai Seu Dinheiro (Por Etapa NBR)
              </h3>
              <span className={`text-sm px-3 py-1 rounded-lg ${
                temaId === 'elegante' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                DIFERENCIAL ÚNICO
              </span>
            </div>
            
            <div className="space-y-4">
              {ANALISE_ONDE_VAI_DINHEIRO.map((etapa, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 border transition-colors ${
                    temaId === 'elegante'
                      ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`font-medium ${
                          temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                        }`}>{etapa.etapa}</h4>
                        <span className={`px-2 py-1 text-xs rounded-lg ${
                          etapa.tipo === 'critico' 
                            ? temaId === 'elegante'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-red-500/20 text-red-300'
                            : etapa.tipo === 'atencao'
                              ? temaId === 'elegante'
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                : 'bg-yellow-500/20 text-yellow-300'
                              : temaId === 'elegante'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-green-500/20 text-green-300'
                        }`}>
                          {etapa.desvio}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                            Orçado
                          </p>
                          <p className={`font-medium ${
                            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                          }`}>{etapa.horasOrcadas}h</p>
                        </div>
                        <div>
                          <p className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                            Real
                          </p>
                          <p className={`font-medium ${
                            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                          }`}>{etapa.horasReais}h</p>
                        </div>
                        <div>
                          <p className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                            Custo Real
                          </p>
                          <p className={`font-medium ${
                            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                          }`}>{etapa.custoReal}</p>
                        </div>
                        <div>
                          <p className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                            Gargalo
                          </p>
                          <p className={`font-medium text-red-500`}>{etapa.gargalo}</p>
                        </div>
                      </div>
                      
                      <div className={`text-xs flex items-center space-x-4 ${
                        temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                      }`}>
                        <span>💡 Economia potencial: {etapa.economia}</span>
                        <span>📋 Categoria: {etapa.categoria}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Produtividade por Colaborador */}
        <div className="space-y-6">
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`backdrop-blur-sm rounded-2xl p-6 ${
              temaId === 'elegante'
                ? 'bg-white border border-gray-200 shadow-sm'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              temaId === 'elegante' ? 'text-gray-900' : 'text-white'
            }`}>
              <Users className="w-5 h-5 mr-2" />
              Produtividade da Equipe
            </h3>
            
            <div className="space-y-3">
              {PRODUTIVIDADE_COLABORADORES.map((colaborador, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${
                      temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>{colaborador.nome}</h4>
                    <div className="flex items-center space-x-1">
                      {colaborador.tendencia === 'subindo' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : colaborador.tendencia === 'descendo' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        colaborador.eficiencia >= 100 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {colaborador.eficiencia}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                        Especialidade:
                      </span>
                      <p className={temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'}>
                        {colaborador.especialidade}
                      </p>
                    </div>
                    <div>
                      <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                        Projetos:
                      </span>
                      <p className={temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'}>
                        {colaborador.projetos} ativos
                      </p>
                    </div>
                  </div>
                  
                  <p className={`text-xs ${
                    colaborador.eficiencia >= 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    💡 {colaborador.economia}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ROI por Tipologia */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`backdrop-blur-sm rounded-2xl p-6 ${
              temaId === 'elegante'
                ? 'bg-white border border-gray-200 shadow-sm'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              temaId === 'elegante' ? 'text-gray-900' : 'text-white'
            }`}>
              <PieChart className="w-5 h-5 mr-2" />
              ROI por Tipologia
            </h3>
            
            <div className="space-y-3">
              {ROI_TIPOLOGIAS.map((tipologia, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  temaId === 'elegante' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-medium ${
                      temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>{tipologia.tipologia}</h4>
                    <span className={`text-lg font-bold ${
                      parseFloat(tipologia.margemReal) >= 35 ? 'text-green-500' :
                      parseFloat(tipologia.margemReal) >= 25 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {tipologia.margemReal}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                        Receita: {tipologia.receitaMedia}
                      </span>
                    </div>
                    <div>
                      <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                        Projetos: {tipologia.projetos}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gargalos + Sugestões IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gargalos Identificados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`backdrop-blur-sm rounded-2xl p-6 ${
            temaId === 'elegante'
              ? 'bg-white border border-gray-200 shadow-sm'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            <AlertTriangle className="w-5 h-5 mr-2" />
            Gargalos Identificados (IA)
          </h3>
          
          <div className="space-y-3">
            {GARGALOS_IDENTIFICADOS.map((gargalo, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                gargalo.prioridade === 'crítica'
                  ? temaId === 'elegante'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-red-500/10 border-red-500/20'
                  : temaId === 'elegante'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>{gargalo.processo}</h4>
                  <span className={`px-2 py-1 text-xs rounded-lg ${
                    gargalo.prioridade === 'crítica'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {gargalo.prioridade}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                      Frequência: {gargalo.frequencia}
                    </span>
                  </div>
                  <div>
                    <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                      Tempo: {gargalo.tempoMedio}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs space-y-1">
                  <p className={`${temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'}`}>
                    💡 <strong>Solução:</strong> {gargalo.solucao}
                  </p>
                  <p className="text-green-600 font-medium">
                    💰 <strong>Economia:</strong> {gargalo.economia}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sugestões IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl p-6 ${
            temaId === 'elegante'
              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'
              : 'bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            <Zap className="w-5 h-5 mr-2" />
            Sugestões Automáticas IA
          </h3>
          
          <div className="space-y-3">
            {SUGESTOES_IA.map((sugestao, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                temaId === 'elegante'
                  ? 'bg-white/80 border border-indigo-200'
                  : 'bg-white/5 border border-purple-500/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>{sugestao.titulo}</h4>
                  <span className={`px-2 py-1 text-xs rounded-lg ${
                    temaId === 'elegante'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    ROI {sugestao.roi}
                  </span>
                </div>
                
                <p className={`text-sm mb-2 ${
                  temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                }`}>
                  {sugestao.descricao}
                </p>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                      Impacto: 
                    </span>
                    <p className="font-medium text-green-600">{sugestao.impacto}</p>
                  </div>
                  <div>
                    <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                      Prazo:
                    </span>
                    <p className={temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'}>
                      {sugestao.prazo}
                    </p>
                  </div>
                  <div>
                    <span className={temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'}>
                      Dificuldade:
                    </span>
                    <p className={
                      sugestao.dificuldade === 'Baixa' ? 'text-green-600' :
                      sugestao.dificuldade === 'Média' ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {sugestao.dificuldade}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className={`w-full mt-4 py-3 rounded-xl font-medium transition-all ${
            temaId === 'elegante'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : `bg-gradient-to-r ${tema.gradiente} hover:${tema.gradienteHover} text-white`
          }`}>
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Implementar Todas as Sugestões
          </button>
        </motion.div>
      </div>

      {/* Footer com Métricas de Impacto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`backdrop-blur-sm rounded-2xl p-6 ${
          temaId === 'elegante'
            ? 'bg-white border border-gray-200 shadow-sm'
            : 'bg-white/5 border border-white/10'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          temaId === 'elegante' ? 'text-gray-900' : 'text-white'
        }`}>
          <Award className="w-5 h-5 mr-2" />
          Impacto das Otimizações (Projeção IA)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl text-center ${
            temaId === 'elegante' ? 'bg-green-50 border border-green-200' : 'bg-green-500/10 border border-green-500/20'
          }`}>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-600">+37%</p>
            <p className={`text-sm ${temaId === 'elegante' ? 'text-green-700' : 'text-green-400'}`}>
              Margem de Lucro
            </p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            temaId === 'elegante' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-500/10 border border-blue-500/20'
          }`}>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-600">-28%</p>
            <p className={`text-sm ${temaId === 'elegante' ? 'text-blue-700' : 'text-blue-400'}`}>
              Tempo por Projeto
            </p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            temaId === 'elegante' ? 'bg-purple-50 border border-purple-200' : 'bg-purple-500/10 border border-purple-500/20'
          }`}>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-600">R$ 125k</p>
            <p className={`text-sm ${temaId === 'elegante' ? 'text-purple-700' : 'text-purple-400'}`}>
              Economia Anual
            </p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            temaId === 'elegante' ? 'bg-orange-50 border border-orange-200' : 'bg-orange-500/10 border border-orange-500/20'
          }`}>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-orange-600">450%</p>
            <p className={`text-sm ${temaId === 'elegante' ? 'text-orange-700' : 'text-orange-400'}`}>
              ROI das Melhorias
            </p>
          </div>
        </div>
      </motion.div>


    </div>
  );
});

DashboardV2Otimizado.displayName = 'DashboardV2Otimizado';

export default DashboardV2Otimizado;