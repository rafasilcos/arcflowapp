'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Timer, 
  TrendingUp, 
  BarChart3, 
  Save, 
  Zap, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Star,
  Target,
  Lightbulb,
  Settings,
  Award
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import Link from 'next/link';

// Interfaces locais para evitar problemas de importação
interface ConfiguracaoEquipe {
  arquitetos: number;
  engenheiros: number;
  desenhistas: number;
  estagiarios: number;
  horasPorDia: number;
  diasPorSemana: number;
}

interface ConfiguracaoPrazosLocal {
  equipe: ConfiguracaoEquipe;
  prazosBase: {
    arquitetura: {
      levantamento: number;
      estudoPreliminar: number;
      anteprojeto: number;
      projetoExecutivo: number;
      detalhamento: number;
    };
    estrutural: {
      concepcao: number;
      dimensionamento: number;
      detalhamento: number;
      memorial: number;
    };
    instalacoes: {
      concepcao: number;
      dimensionamento: number;
      detalhamento: number;
      memorial: number;
    };
  };
  multiplicadoresComplexidade: {
    simples: number;
    medio: number;
    alto: number;
    complexo: number;
  };
  multiplicadoresArea: {
    ate100: number;
    ate200: number;
    ate300: number;
    ate500: number;
    acima500: number;
  };
  configuracoes: {
    paralelismo: boolean;
    margemSeguranca: number;
  };
}

const CONFIGURACAO_INICIAL: ConfiguracaoPrazosLocal = {
  equipe: {
    arquitetos: 2,
    engenheiros: 1,
    desenhistas: 1,
    estagiarios: 1,
    horasPorDia: 8,
    diasPorSemana: 5
  },
  prazosBase: {
    arquitetura: {
      levantamento: 3,
      estudoPreliminar: 7,
      anteprojeto: 10,
      projetoExecutivo: 15,
      detalhamento: 5
    },
    estrutural: {
      concepcao: 2,
      dimensionamento: 8,
      detalhamento: 7,
      memorial: 3
    },
    instalacoes: {
      concepcao: 2,
      dimensionamento: 6,
      detalhamento: 8,
      memorial: 2
    }
  },
  multiplicadoresComplexidade: {
    simples: 0.7,
    medio: 1.0,
    alto: 1.4,
    complexo: 1.8
  },
  multiplicadoresArea: {
    ate100: 0.8,
    ate200: 1.0,
    ate300: 1.2,
    ate500: 1.4,
    acima500: 1.6
  },
  configuracoes: {
    paralelismo: true,
    margemSeguranca: 15
  }
};

const CONFIGURACAO_OTIMIZADA: ConfiguracaoPrazosLocal = {
  equipe: {
    arquitetos: 3,
    engenheiros: 2,
    desenhistas: 2,
    estagiarios: 2,
    horasPorDia: 8,
    diasPorSemana: 5
  },
  prazosBase: {
    arquitetura: {
      levantamento: 2,
      estudoPreliminar: 4,
      anteprojeto: 6,
      projetoExecutivo: 8,
      detalhamento: 3
    },
    estrutural: {
      concepcao: 1,
      dimensionamento: 4,
      detalhamento: 4,
      memorial: 2
    },
    instalacoes: {
      concepcao: 1,
      dimensionamento: 3,
      detalhamento: 4,
      memorial: 1
    }
  },
  multiplicadoresComplexidade: {
    simples: 0.6,
    medio: 0.8,
    alto: 1.0,
    complexo: 1.3
  },
  multiplicadoresArea: {
    ate100: 0.7,
    ate200: 0.9,
    ate300: 1.0,
    ate500: 1.1,
    acima500: 1.2
  },
  configuracoes: {
    paralelismo: true,
    margemSeguranca: 10
  }
};

const ConfiguracaoPrazosPage: React.FC = () => {
  const { tema, temaId } = useTheme();
  const [configuracao, setConfiguracao] = useState<ConfiguracaoPrazosLocal>(CONFIGURACAO_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'equipe' | 'prazos' | 'multiplicadores' | 'simulacao'>('equipe');
  const [simulacao, setSimulacao] = useState({
    disciplinas: ['arquitetura', 'estrutural'],
    areaConstruida: 150,
    complexidade: 'medio' as 'simples' | 'medio' | 'alto' | 'complexo'
  });

  // Função para calcular prazos
  const calcularPrazoSimulacao = () => {
    const { areaConstruida, complexidade } = simulacao;
    
    // Cálculo simplificado
    let prazoBase = 40; // Base para projeto médio
    
    // Multiplicador por complexidade
    const multComplexidade = configuracao.multiplicadoresComplexidade[complexidade];
    
    // Multiplicador por área
    let multArea = 1.0;
    if (areaConstruida <= 100) multArea = configuracao.multiplicadoresArea.ate100;
    else if (areaConstruida <= 200) multArea = configuracao.multiplicadoresArea.ate200;
    else if (areaConstruida <= 300) multArea = configuracao.multiplicadoresArea.ate300;
    else if (areaConstruida <= 500) multArea = configuracao.multiplicadoresArea.ate500;
    else multArea = configuracao.multiplicadoresArea.acima500;
    
    const prazoFinal = Math.ceil(prazoBase * multComplexidade * multArea * (1 + configuracao.configuracoes.margemSeguranca / 100));
    
    return {
      atual: prazoFinal,
      conservador: Math.ceil(prazoBase * 1.6 * multArea * 1.15),
      otimizado: Math.ceil(prazoBase * 0.8 * multArea * 1.1)
    };
  };

  const resultadoSimulacao = calcularPrazoSimulacao();

  const salvarConfiguracao = async () => {
    setSalvando(true);
    try {
      localStorage.setItem('configuracao_prazos_arcflow', JSON.stringify(configuracao));
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('✅ Configuração salva com sucesso!');
    } catch (error) {
      alert('❌ Erro ao salvar configuração');
    } finally {
      setSalvando(false);
    }
  };

  const aplicarTemplate = (template: 'padrao' | 'otimizado') => {
    const novaConfiguracao = template === 'padrao' ? CONFIGURACAO_INICIAL : CONFIGURACAO_OTIMIZADA;
    setConfiguracao(novaConfiguracao);
  };

  const updateConfiguracao = (path: string, value: any) => {
    const newConfig = { ...configuracao };
    const keys = path.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfiguracao(newConfig);
  };

  const abas = [
    { key: 'equipe', label: 'Equipe', icon: Users, cor: 'blue' },
    { key: 'prazos', label: 'Prazos Base', icon: Timer, cor: 'green' },
    { key: 'multiplicadores', label: 'Multiplicadores', icon: TrendingUp, cor: 'purple' },
    { key: 'simulacao', label: 'Simulação', icon: BarChart3, cor: 'indigo' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/configuracoes">
            <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              temaId === 'elegante'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-white/10 hover:bg-white/20 text-white/70'
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            temaId === 'elegante' 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
              Configuração de Prazos
            </h1>
            <p className={`mt-1 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
              Personalize os prazos de desenvolvimento do seu escritório
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => aplicarTemplate('padrao')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              temaId === 'elegante'
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
                : 'text-white/70 hover:text-white hover:bg-white/10 border border-white/20'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Template Padrão
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => aplicarTemplate('otimizado')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              temaId === 'elegante'
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-300'
                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10 border border-green-500/20'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Template Otimizado
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={salvarConfiguracao}
            disabled={salvando}
            className={`px-6 py-2 rounded-xl font-semibold transition-colors shadow-lg ${
              temaId === 'elegante'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {salvando ? (
              <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
            ) : (
              <Save className="w-4 h-4 inline mr-2" />
            )}
            {salvando ? 'Salvando...' : 'Salvar'}
          </motion.button>
        </div>
      </div>
      
      {/* Navegação por abas */}
      <div className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
        temaId === 'elegante'
          ? 'bg-white border-gray-200 shadow-sm'
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex space-x-2">
          {abas.map(({ key, label, icon: Icon, cor }) => {
            const isActive = abaSelecionada === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAbaSelecionada(key as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? temaId === 'elegante'
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'bg-blue-500/20 text-blue-300 shadow-md'
                    : temaId === 'elegante'
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <motion.div 
        key={abaSelecionada}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
          temaId === 'elegante'
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-white/5 border-white/10'
        }`}
      >
        {/* ABA EQUIPE */}
        {abaSelecionada === 'equipe' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                temaId === 'elegante' ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Configuração da Equipe</h2>
                <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>Configure o tamanho e capacidade da sua equipe</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'arquitetos', label: 'Arquitetos', icon: '👨‍💼', sufixo: 'Arquiteto(s)' },
                { key: 'engenheiros', label: 'Engenheiros', icon: '⚙️', sufixo: 'Engenheiro(s)' },
                { key: 'desenhistas', label: 'Desenhistas', icon: '✏️', sufixo: 'Desenhista(s)' },
                { key: 'estagiarios', label: 'Estagiários', icon: '🎓', sufixo: 'Estagiário(s)' },
                { key: 'horasPorDia', label: 'Horas por Dia', icon: '⏰', sufixo: 'Hora(s) por Dia' },
                { key: 'diasPorSemana', label: 'Dias por Semana', icon: '📅', sufixo: 'Dia(s) por Semana' }
              ].map(({ key, label, icon, sufixo }) => {
                const valor = configuracao.equipe[key as keyof ConfiguracaoEquipe];
                const valorFormatado = `${valor.toString().padStart(2, '0')} ${sufixo}`;
                
                return (
                  <div key={key} className={`p-4 rounded-xl border transition-colors ${
                    temaId === 'elegante'
                      ? 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}>
                    <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                      <span className="text-lg">{icon}</span>
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={valor}
                        onChange={(e) => updateConfiguracao(`equipe.${key}`, Number(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg text-lg font-semibold transition-colors opacity-0 absolute inset-0 ${
                          temaId === 'elegante'
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            : `border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10`
                        }`}
                      />
                      <div className={`w-full px-3 py-2 border rounded-lg text-lg font-semibold transition-colors pointer-events-none ${
                        temaId === 'elegante'
                          ? 'border-gray-300 bg-white text-gray-900'
                          : `border-white/20 bg-white/5 text-white`
                      }`}>
                        {valorFormatado}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA PRAZOS */}
        {abaSelecionada === 'prazos' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                temaId === 'elegante' ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
              }`}>
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Prazos Base por Disciplina</h2>
                <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>Configure os prazos em dias para cada etapa</p>
              </div>
            </div>
            
            {Object.entries(configuracao.prazosBase).map(([disciplina, etapas]) => (
              <motion.div 
                key={disciplina} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  temaId === 'elegante'
                    ? 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
                    : 'border-white/10 bg-gradient-to-br from-white/5 to-white/2'
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 capitalize ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    disciplina === 'arquitetura' ? 'bg-blue-100 text-blue-600' :
                    disciplina === 'estrutural' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <div className="w-3 h-3 bg-current rounded-full"></div>
                  </div>
                  {disciplina}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(etapas as Record<string, number>).map(([etapa, dias]) => {
                    const valorFormatado = `${dias.toString().padStart(2, '0')} Dia(s)`;
                    
                    return (
                      <div key={etapa}>
                        <label className={`block text-xs font-medium mb-2 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'} capitalize`}>
                          {etapa.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={dias}
                            onChange={(e) => updateConfiguracao(`prazosBase.${disciplina}.${etapa}`, Number(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-semibold transition-colors opacity-0 absolute inset-0 ${
                              temaId === 'elegante'
                                ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                : `border-white/20 bg-white/5 text-white focus:border-white/30`
                            }`}
                          />
                          <div className={`w-full px-3 py-2 border rounded-lg text-sm font-semibold transition-colors pointer-events-none ${
                            temaId === 'elegante'
                              ? 'border-gray-300 bg-white text-gray-900'
                              : `border-white/20 bg-white/5 text-white`
                          }`}>
                            {valorFormatado}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ABA MULTIPLICADORES */}
        {abaSelecionada === 'multiplicadores' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                temaId === 'elegante' ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'
              }`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Multiplicadores</h2>
                <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>Ajuste os fatores de complexidade e área</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Multiplicadores de Complexidade */}
              <div className={`p-4 rounded-xl border ${
                temaId === 'elegante'
                  ? 'border-gray-200 bg-gradient-to-br from-purple-50 to-white'
                  : 'border-white/10 bg-gradient-to-br from-purple-500/5 to-white/2'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                  <Target className="w-5 h-5" />
                  Por Complexidade
                </h3>
                <div className="space-y-3">
                  {Object.entries(configuracao.multiplicadoresComplexidade).map(([nivel, valor]) => {
                    const valorFormatado = `× ${valor.toFixed(1)}`;
                    
                    return (
                      <div key={nivel} className="flex items-center gap-4">
                        <label className={`text-sm font-semibold capitalize w-20 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {nivel}
                        </label>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            step="0.1"
                            value={valor}
                            onChange={(e) => updateConfiguracao(`multiplicadoresComplexidade.${nivel}`, Number(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-semibold transition-colors opacity-0 absolute inset-0 ${
                              temaId === 'elegante'
                                ? 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                                : `border-white/20 bg-white/5 text-white focus:border-white/30`
                            }`}
                          />
                          <div className={`w-full px-3 py-2 border rounded-lg text-sm font-semibold transition-colors pointer-events-none ${
                            temaId === 'elegante'
                              ? 'border-gray-300 bg-white text-gray-900'
                              : `border-white/20 bg-white/5 text-white`
                          }`}>
                            {valorFormatado}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Multiplicadores de Área */}
              <div className={`p-4 rounded-xl border ${
                temaId === 'elegante'
                  ? 'border-gray-200 bg-gradient-to-br from-blue-50 to-white'
                  : 'border-white/10 bg-gradient-to-br from-blue-500/5 to-white/2'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                  <BarChart3 className="w-5 h-5" />
                  Por Área (m²)
                </h3>
                <div className="space-y-3">
                  {Object.entries(configuracao.multiplicadoresArea).map(([faixa, valor]) => {
                    const valorFormatado = `× ${valor.toFixed(1)}`;
                    
                    return (
                      <div key={faixa} className="flex items-center gap-4">
                        <label className={`text-sm font-semibold w-20 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                          {faixa.replace('ate', 'até ').replace('acima', 'acima ')}
                        </label>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            step="0.1"
                            value={valor}
                            onChange={(e) => updateConfiguracao(`multiplicadoresArea.${faixa}`, Number(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-semibold transition-colors opacity-0 absolute inset-0 ${
                              temaId === 'elegante'
                                ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                : `border-white/20 bg-white/5 text-white focus:border-white/30`
                            }`}
                          />
                          <div className={`w-full px-3 py-2 border rounded-lg text-sm font-semibold transition-colors pointer-events-none ${
                            temaId === 'elegante'
                              ? 'border-gray-300 bg-white text-gray-900'
                              : `border-white/20 bg-white/5 text-white`
                          }`}>
                            {valorFormatado}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Configurações Especiais */}
            <div className={`p-4 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
                : 'border-white/10 bg-gradient-to-br from-white/5 to-white/2'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'} flex items-center gap-2`}>
                <Settings className="w-5 h-5" />
                Configurações Especiais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={configuracao.configuracoes.paralelismo}
                    onChange={(e) => updateConfiguracao('configuracoes.paralelismo', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <label className={`text-sm font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Disciplinas em Paralelo</label>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className={`text-sm font-semibold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Margem de Segurança</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={configuracao.configuracoes.margemSeguranca}
                      onChange={(e) => updateConfiguracao('configuracoes.margemSeguranca', Number(e.target.value))}
                      className={`w-24 px-3 py-2 border rounded-lg text-sm font-semibold transition-colors opacity-0 absolute inset-0 ${
                        temaId === 'elegante'
                          ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                          : `border-white/20 bg-white/5 text-white focus:border-white/30`
                      }`}
                    />
                    <div className={`w-24 px-3 py-2 border rounded-lg text-sm font-semibold transition-colors pointer-events-none ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : `border-white/20 bg-white/5 text-white`
                    }`}>
                      {configuracao.configuracoes.margemSeguranca}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA SIMULAÇÃO */}
        {abaSelecionada === 'simulacao' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                temaId === 'elegante' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Simulação de Prazos</h2>
                <p className={`${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>Teste diferentes cenários e compare resultados</p>
              </div>
            </div>
            
            {/* Parâmetros da Simulação */}
            <div className={`p-4 rounded-xl border ${
              temaId === 'elegante'
                ? 'border-gray-200 bg-gradient-to-br from-indigo-50 to-white'
                : 'border-white/10 bg-gradient-to-br from-indigo-500/5 to-white/2'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>Parâmetros do Projeto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Área Construída (m²)
                  </label>
                  <input
                    type="number"
                    value={simulacao.areaConstruida}
                    onChange={(e) => setSimulacao(prev => ({ ...prev, areaConstruida: Number(e.target.value) }))}
                    className={`w-full px-4 py-3 border rounded-xl text-lg font-semibold transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                        : `border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10`
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${temaId === 'elegante' ? 'text-gray-900' : 'text-white'}`}>
                    Complexidade
                  </label>
                  <select
                    value={simulacao.complexidade}
                    onChange={(e) => setSimulacao(prev => ({ ...prev, complexidade: e.target.value as any }))}
                    className={`w-full px-4 py-3 border rounded-xl text-lg font-semibold transition-colors ${
                      temaId === 'elegante'
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                        : `border-white/20 bg-white/5 text-white focus:border-white/30 focus:ring-2 focus:ring-white/10`
                    }`}
                  >
                    <option value="simples">Simples</option>
                    <option value="medio">Médio</option>
                    <option value="alto">Alto</option>
                    <option value="complexo">Complexo</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Resultados da Simulação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  key: 'conservador', 
                  label: 'Conservador', 
                  valor: resultadoSimulacao.conservador,
                  cor: 'gray',
                  descricao: 'Estimativa tradicional'
                },
                { 
                  key: 'atual', 
                  label: 'Sua Configuração', 
                  valor: resultadoSimulacao.atual,
                  cor: 'blue',
                  destaque: true,
                  descricao: 'Baseado na sua configuração'
                },
                { 
                  key: 'otimizado', 
                  label: 'Otimizado', 
                  valor: resultadoSimulacao.otimizado,
                  cor: 'green',
                  descricao: 'Configuração otimizada'
                }
              ].map(({ key, label, valor, cor, destaque, descricao }) => (
                <motion.div 
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border transition-all ${
                    destaque 
                      ? temaId === 'elegante'
                        ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                        : 'border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/20 shadow-lg'
                      : temaId === 'elegante'
                      ? 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
                      : 'border-white/10 bg-gradient-to-br from-white/5 to-white/2'
                  }`}
                >
                  <div className="text-center">
                    <h3 className={`font-bold mb-2 ${destaque ? (temaId === 'elegante' ? 'text-blue-700' : 'text-blue-400') : (temaId === 'elegante' ? 'text-gray-900' : 'text-white')}`}>
                      {label}
                      {destaque && <Star className="w-4 h-4 inline ml-1" />}
                    </h3>
                    <div className={`text-3xl font-bold mb-2 ${
                      destaque 
                        ? temaId === 'elegante' ? 'text-blue-700' : 'text-blue-400'
                        : temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {valor} dias
                    </div>
                    <div className={`text-sm mb-3 ${temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'}`}>
                      {Math.ceil(valor / 7)} semanas
                    </div>
                    <p className={`text-xs ${temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'}`}>
                      {descricao}
                    </p>
                    
                    {destaque && valor > 60 && (
                      <div className={`mt-3 p-2 rounded-lg text-xs ${
                        temaId === 'elegante'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Considere otimizar os prazos
                      </div>
                    )}
                    
                    {destaque && valor <= 45 && (
                      <div className={`mt-3 p-2 rounded-lg text-xs ${
                        temaId === 'elegante'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Prazos otimizados!
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dica */}
            <div className={`p-4 rounded-xl border ${
              temaId === 'elegante'
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  temaId === 'elegante' ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
                }`}>
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    temaId === 'elegante' ? 'text-green-800' : 'text-green-300'
                  }`}>
                    💡 Dica de Otimização
                  </h4>
                  <p className={`text-sm ${
                    temaId === 'elegante' ? 'text-green-700' : 'text-green-400'
                  }`}>
                    Prazos otimizados resultam em orçamentos mais competitivos e maior agilidade comercial. 
                    Ajuste gradualmente os valores até encontrar o equilíbrio ideal para seu escritório.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfiguracaoPrazosPage; 