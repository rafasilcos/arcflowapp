import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Download, Filter, Calendar, Clock, Users, 
  TrendingUp, AlertTriangle, CheckCircle, Target, 
  FileText, PieChart, Activity, Zap 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEstatisticasAvancadas } from '@/hooks/useEstatisticasAvancadas';

interface RelatoriosAvancadosProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RelatoriosAvancados({ isOpen, onClose }: RelatoriosAvancadosProps) {
  const [filtroAtivo, setFiltroAtivo] = useState<'geral' | 'tempo' | 'equipe' | 'qualidade'>('geral');
  const [periodoFiltro, setPeriodoFiltro] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const estatisticas = useEstatisticasAvancadas();

  if (!isOpen) return null;

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
  };

  const formatarPercentual = (valor: number) => {
    return `${Math.round(valor)}%`;
  };

  const obterCorStatus = (status: 'verde' | 'amarelo' | 'vermelho') => {
    const cores = {
      verde: 'bg-green-100 text-green-800 border-green-200',
      amarelo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      vermelho: 'bg-red-100 text-red-800 border-red-200'
    };
    return cores[status];
  };

  const obterIconeAlerta = (tipo: 'warning' | 'error' | 'info') => {
    switch (tipo) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const gerarRelatorioCompleto = () => {
    const relatorio = {
      timestamp: new Date().toISOString(),
      periodo: periodoFiltro,
      estatisticas,
      metadados: {
        versao: '1.0',
        gerado_por: 'ArcFlow Dashboard',
        formato: 'JSON'
      }
    };

    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-projeto-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Relatórios Avançados</h2>
                <p className="text-blue-100">Análise completa de produtividade e performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={gerarRelatorioCompleto}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button 
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Status Geral */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${obterCorStatus(estatisticas.resumo_executivo.status_geral)}`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${
              estatisticas.resumo_executivo.status_geral === 'verde' ? 'bg-green-500' :
              estatisticas.resumo_executivo.status_geral === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="font-medium">
              Status: {estatisticas.resumo_executivo.status_geral.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className="border-b bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {[
                { key: 'geral', label: 'Visão Geral', icon: Target },
                { key: 'tempo', label: 'Tempo', icon: Clock },
                { key: 'equipe', label: 'Equipe', icon: Users },
                { key: 'qualidade', label: 'Qualidade', icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFiltroAtivo(key as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtroAtivo === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={periodoFiltro}
                onChange={(e) => setPeriodoFiltro(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Visão Geral */}
          {filtroAtivo === 'geral' && (
            <div className="space-y-6">
              {/* Cards de Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Progresso Geral</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatarPercentual(estatisticas.etapas.progresso_medio)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Eficiência</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatarPercentual(estatisticas.tempo.eficiencia_geral)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tarefas Concluídas</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {estatisticas.tarefas.concluidas}/{estatisticas.tarefas.total_tarefas}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Qualidade</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {estatisticas.qualidade.indice_qualidade}/100
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alertas */}
              {estatisticas.alertas.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                      Alertas e Recomendações
                    </h3>
                    <div className="space-y-3">
                      {estatisticas.alertas.map((alerta, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {obterIconeAlerta(alerta.tipo)}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{alerta.mensagem}</p>
                            <p className="text-sm text-gray-600 mt-1">{alerta.acao_sugerida}</p>
                            <Badge className="mt-2 text-xs">
                              {alerta.categoria.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {estatisticas.resumo_executivo.pontos_criticos.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Pontos Críticos</h4>
                      <ul className="space-y-2">
                        {estatisticas.resumo_executivo.pontos_criticos.map((ponto, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            {ponto}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {estatisticas.resumo_executivo.proximas_acoes.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Próximas Ações</h4>
                      <ul className="space-y-2">
                        {estatisticas.resumo_executivo.proximas_acoes.map((acao, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            {acao}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {estatisticas.resumo_executivo.recomendacoes.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Recomendações</h4>
                      <ul className="space-y-2">
                        {estatisticas.resumo_executivo.recomendacoes.map((recomendacao, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {recomendacao}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Relatório de Tempo */}
          {filtroAtivo === 'tempo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Tempo Trabalhado</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatarTempo(estatisticas.tempo.tempo_total_trabalhado)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      de {formatarTempo(estatisticas.tempo.tempo_estimado_total)} estimado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Eficiência</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {formatarPercentual(estatisticas.tempo.eficiencia_geral)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Média: {estatisticas.tempo.media_horas_por_dia.toFixed(1)}h/dia
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Tendência</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        estatisticas.tempo.tendencia === 'adiantado' ? 'bg-green-500' :
                        estatisticas.tempo.tendencia === 'no_prazo' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <p className="text-lg font-bold capitalize">
                        {estatisticas.tempo.tendencia.replace('_', ' ')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Previsão: {new Date(estatisticas.tempo.projecao_conclusao).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Relatório de Equipe */}
          {filtroAtivo === 'equipe' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Carga</h3>
                  <div className="space-y-4">
                    {estatisticas.equipe.distribuicao_carga.map((membro, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{membro.responsavel}</p>
                            <p className="text-sm text-gray-600">
                              {membro.tarefas_ativas} tarefas ativas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatarTempo(membro.tempo_alocado)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatarPercentual(membro.eficiencia)} eficiência
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Relatório de Qualidade */}
          {filtroAtivo === 'qualidade' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Índice de Qualidade</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {estatisticas.qualidade.indice_qualidade}/100
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Taxa de Aprovação</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatarPercentual(estatisticas.qualidade.taxa_aprovacao)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Revisões</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {estatisticas.qualidade.tarefas_com_revisao}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Retrabalhos</h4>
                    <p className="text-2xl font-bold text-red-600">
                      {estatisticas.qualidade.retrabalhos_detectados}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 