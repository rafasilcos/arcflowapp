'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, FileText, Table, File, Code, 
  Calendar, Filter, Settings, CheckCircle,
  AlertCircle, Loader2, Eye, Share2
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  exportarRelatorioCompleto, 
  exportarRelatorioAnaliseIA, 
  exportarRelatorioExecutivo,
  RelatorioConfig 
} from '@/services/exportacaoRelatorios';
import { BriefingConcluido } from '@/services/salvamentoBriefing';
import { pdfExportService } from '@/services/pdfExportService';

interface ModalExportacaoProps {
  isOpen: boolean;
  onClose: () => void;
  briefings: BriefingConcluido[];
}

export default function ModalExportacao({ isOpen, onClose, briefings }: ModalExportacaoProps) {
  const { temaId } = useTheme();
  const [etapaAtual, setEtapaAtual] = useState<'tipo' | 'config' | 'exportando' | 'concluido'>('tipo');
  const [tipoRelatorio, setTipoRelatorio] = useState<'completo' | 'analise-ia' | 'executivo' | 'personalizado'>('completo');
  const [formato, setFormato] = useState<'pdf' | 'excel' | 'word' | 'json'>('pdf');
  const [config, setConfig] = useState<RelatorioConfig>({
    formato: 'pdf',
    incluir: {
      dadosBasicos: true,
      respostas: true,
      analiseIA: true,
      graficos: true,
      recomendacoes: true,
      anexos: false
    },
    filtros: {
      dataInicio: '',
      dataFim: '',
      tipologia: '',
      status: '',
      scoreMinimo: 0
    }
  });
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  const tiposRelatorio = [
    {
      id: 'completo',
      nome: 'Relatório Completo',
      descricao: 'Inclui todos os dados, respostas, análises IA e gráficos',
      icone: FileText,
      cor: 'from-blue-500 to-cyan-500',
      formatos: ['pdf', 'excel', 'word'],
      tempo: '2-5 min'
    },
    {
      id: 'analise-ia',
      nome: 'Análise IA',
      descricao: 'Foco nas análises de IA, scores e recomendações',
      icone: Eye,
      cor: 'from-purple-500 to-violet-500',
      formatos: ['pdf', 'excel'],
      tempo: '1-2 min'
    },
    {
      id: 'executivo',
      nome: 'Relatório Executivo',
      descricao: 'Resumo executivo com estatísticas e insights principais',
      icone: Share2,
      cor: 'from-green-500 to-emerald-500',
      formatos: ['pdf', 'word'],
      tempo: '1 min'
    },
    {
      id: 'personalizado',
      nome: 'Personalizado',
      descricao: 'Configure exatamente o que incluir no relatório',
      icone: Settings,
      cor: 'from-orange-500 to-red-500',
      formatos: ['pdf', 'excel', 'word', 'json'],
      tempo: 'Variável'
    }
  ];

  const formatosDisponiveis = [
    { id: 'pdf', nome: 'PDF', icone: FileText, descricao: 'Ideal para visualização e impressão' },
    { id: 'excel', nome: 'Excel', icone: Table, descricao: 'Perfeito para análise de dados' },
    { id: 'word', nome: 'Word', icone: File, descricao: 'Editável e personalizável' },
    { id: 'json', nome: 'JSON', icone: Code, descricao: 'Para integração com sistemas' }
  ];

  const handleExportar = async () => {
    setEtapaAtual('exportando');
    setProgresso(0);
    setErro(null);

    try {
      const briefing = briefings[0]; // Pegar o primeiro briefing
      
      // 🔥 GERAR PDF REAL baseado no tipo selecionado
      if (formato === 'pdf') {
        setProgresso(25);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Buscar dados de cliente (se disponível)
        let clienteNome = 'Não informado';
        let responsavelNome = 'Não informado';
        
        try {
          // Tentar buscar nome do cliente
          const token = localStorage.getItem('arcflow_auth_token');
          if (briefing.clienteId && token) {
            const responseCliente = await fetch(`http://localhost:3001/api/clientes/${briefing.clienteId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (responseCliente.ok) {
              const dataCliente = await responseCliente.json();
              clienteNome = dataCliente.cliente?.nome || dataCliente.nome || 'Não informado';
            }
          }
        } catch (error) {
          console.warn('Erro ao buscar cliente:', error);
        }

        setProgresso(50);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Gerar PDF baseado no tipo
        switch (tipoRelatorio) {
          case 'completo':
            await pdfExportService.gerarPDFCompleto(briefing, clienteNome, responsavelNome);
            break;
          case 'executivo':
            await pdfExportService.gerarPDFExecutivo(briefing, clienteNome, responsavelNome);
            break;
          case 'analise-ia':
            await pdfExportService.gerarPDFAnaliseIA(briefing, clienteNome);
            break;
          case 'personalizado':
            // Para personalizado, usar completo como padrão
            await pdfExportService.gerarPDFCompleto(briefing, clienteNome, responsavelNome);
            break;
          default:
            await pdfExportService.gerarPDFCompleto(briefing, clienteNome, responsavelNome);
        }

        setProgresso(100);
      } else {
        // Para outros formatos, manter simulação
        const intervalos = [20, 40, 60, 80, 100];
        for (let i = 0; i < intervalos.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setProgresso(intervalos[i]);
        }

        // Gerar arquivo simples para outros formatos
        const nomeArquivo = `arcflow-${tipoRelatorio}-${new Date().toISOString().split('T')[0]}.${formato}`;
        let conteudo = '';
        
        if (formato === 'json') {
          conteudo = JSON.stringify({
            briefing: briefing,
            exportadoEm: new Date().toISOString(),
            tipoRelatorio: tipoRelatorio
          }, null, 2);
        } else {
          conteudo = `Relatório ArcFlow - ${tipoRelatorio}\n\nBriefing ID: ${briefing.briefingId}\nTotal de Respostas: ${Object.keys(briefing.respostas).length}`;
        }

        const mimeType = formato === 'json' ? 'application/json' : 'text/plain';
        const blob = new Blob([conteudo], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setEtapaAtual('concluido');
    } catch (error) {
      console.error('Erro na exportação:', error);
      setErro('Erro ao gerar relatório. Tente novamente.');
      setEtapaAtual('config');
    }
  };

  const resetModal = () => {
    setEtapaAtual('tipo');
    setProgresso(0);
    setErro(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
                temaId === 'elegante'
                  ? 'bg-white'
                  : 'bg-gray-900 border border-white/10'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 border-b ${
                temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>
                      📊 Exportar Relatórios
                    </h2>
                    <p className={`text-sm mt-1 ${
                      temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                    }`}>
                      {briefings.length} briefings selecionados para exportação
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className={`p-2 rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'hover:bg-gray-100 text-gray-600'
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4 mt-6">
                  {[
                    { id: 'tipo', label: 'Tipo' },
                    { id: 'config', label: 'Configuração' },
                    { id: 'exportando', label: 'Exportando' },
                    { id: 'concluido', label: 'Concluído' }
                  ].map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        etapaAtual === step.id
                          ? 'bg-blue-500 text-white'
                          : index < ['tipo', 'config', 'exportando', 'concluido'].indexOf(etapaAtual)
                            ? 'bg-green-500 text-white'
                            : temaId === 'elegante'
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-white/10 text-white/60'
                      }`}>
                        {index < ['tipo', 'config', 'exportando', 'concluido'].indexOf(etapaAtual) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className={`ml-2 text-sm ${
                        temaId === 'elegante' ? 'text-gray-700' : 'text-white/70'
                      }`}>
                        {step.label}
                      </span>
                      {index < 3 && (
                        <div className={`w-8 h-0.5 mx-4 ${
                          index < ['tipo', 'config', 'exportando', 'concluido'].indexOf(etapaAtual)
                            ? 'bg-green-500'
                            : temaId === 'elegante'
                              ? 'bg-gray-200'
                              : 'bg-white/10'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
                              <div className="p-6 max-h-[60vh] scroll-invisible">
                {/* Etapa 1: Tipo de Relatório */}
                {etapaAtual === 'tipo' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Escolha o tipo de relatório
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tiposRelatorio.map((tipo) => {
                          const IconeTipo = tipo.icone;
                          return (
                            <motion.button
                              key={tipo.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setTipoRelatorio(tipo.id as any)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                tipoRelatorio === tipo.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : temaId === 'elegante'
                                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${tipo.cor} rounded-lg flex items-center justify-center`}>
                                  <IconeTipo className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-semibold ${
                                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                                  }`}>
                                    {tipo.nome}
                                  </h4>
                                  <p className={`text-sm mt-1 ${
                                    temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                                  }`}>
                                    {tipo.descricao}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <span className={`text-xs ${
                                      temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                                    }`}>
                                      ⏱️ {tipo.tempo}
                                    </span>
                                    <span className={`text-xs ${
                                      temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                                    }`}>
                                      📄 {tipo.formatos.join(', ').toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Etapa 2: Configuração */}
                {etapaAtual === 'config' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Configurações do relatório
                      </h3>

                      {/* Formato */}
                      <div className="mb-6">
                        <label className={`block text-sm font-medium mb-3 ${
                          temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                        }`}>
                          Formato de exportação
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {formatosDisponiveis
                            .filter(f => tiposRelatorio.find(t => t.id === tipoRelatorio)?.formatos.includes(f.id))
                            .map((fmt) => {
                              const IconeFormato = fmt.icone;
                              return (
                                <button
                                  key={fmt.id}
                                  onClick={() => setFormato(fmt.id as any)}
                                  className={`p-3 rounded-lg border transition-all ${
                                    formato === fmt.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : temaId === 'elegante'
                                        ? 'border-gray-200 hover:border-gray-300'
                                        : 'border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <IconeFormato className={`w-6 h-6 mx-auto mb-2 ${
                                    formato === fmt.id ? 'text-blue-600' : 
                                    temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                                  }`} />
                                  <div className={`text-sm font-medium ${
                                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                                  }`}>
                                    {fmt.nome}
                                  </div>
                                  <div className={`text-xs ${
                                    temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
                                  }`}>
                                    {fmt.descricao}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Filtros (apenas para relatório personalizado) */}
                      {tipoRelatorio === 'personalizado' && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${
                            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                          }`}>
                            Filtros e conteúdo
                          </h4>
                          
                          {/* Período */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm mb-2 ${
                                temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                              }`}>
                                Data início
                              </label>
                              <input
                                type="date"
                                value={config.filtros?.dataInicio || ''}
                                onChange={(e) => setConfig(prev => ({
                                  ...prev,
                                  filtros: { ...prev.filtros, dataInicio: e.target.value }
                                }))}
                                className={`w-full p-2 rounded-lg border ${
                                  temaId === 'elegante'
                                    ? 'border-gray-300 bg-white'
                                    : 'border-white/20 bg-white/10 text-white'
                                }`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm mb-2 ${
                                temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                              }`}>
                                Data fim
                              </label>
                              <input
                                type="date"
                                value={config.filtros?.dataFim || ''}
                                onChange={(e) => setConfig(prev => ({
                                  ...prev,
                                  filtros: { ...prev.filtros, dataFim: e.target.value }
                                }))}
                                className={`w-full p-2 rounded-lg border ${
                                  temaId === 'elegante'
                                    ? 'border-gray-300 bg-white'
                                    : 'border-white/20 bg-white/10 text-white'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Conteúdo a incluir */}
                          <div>
                            <label className={`block text-sm mb-3 ${
                              temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                            }`}>
                              Conteúdo a incluir
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { key: 'dadosBasicos', label: 'Dados básicos' },
                                { key: 'respostas', label: 'Respostas detalhadas' },
                                { key: 'analiseIA', label: 'Análise IA' },
                                { key: 'graficos', label: 'Gráficos e estatísticas' },
                                { key: 'recomendacoes', label: 'Recomendações' },
                                { key: 'anexos', label: 'Anexos' }
                              ].map(({ key, label }) => (
                                <label key={key} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={config.incluir[key as keyof typeof config.incluir]}
                                    onChange={(e) => setConfig(prev => ({
                                      ...prev,
                                      incluir: { ...prev.incluir, [key]: e.target.checked }
                                    }))}
                                    className="rounded border-gray-300"
                                  />
                                  <span className={`text-sm ${
                                    temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
                                  }`}>
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Etapa 3: Exportando */}
                {etapaAtual === 'exportando' && (
                  <div className="text-center py-12">
                    <Loader2 className={`w-16 h-16 mx-auto mb-4 animate-spin ${
                      temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                    <h3 className={`text-xl font-semibold mb-2 ${
                      temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Gerando relatório...
                    </h3>
                    <p className={`text-sm mb-6 ${
                      temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                    }`}>
                      Processando {briefings.length} briefings
                    </p>
                    
                    {/* Barra de progresso */}
                    <div className={`w-full max-w-md mx-auto bg-gray-200 rounded-full h-2 ${
                      temaId === 'elegante' ? 'bg-gray-200' : 'bg-white/10'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progresso}%` }}
                        transition={{ duration: 0.3 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <p className={`text-sm mt-2 ${
                      temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                    }`}>
                      {progresso}% concluído
                    </p>
                  </div>
                )}

                {/* Etapa 4: Concluído */}
                {etapaAtual === 'concluido' && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className={`text-xl font-semibold mb-2 ${
                      temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Relatório exportado com sucesso! 🎉
                    </h3>
                    <p className={`text-sm mb-6 ${
                      temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                    }`}>
                      O download deve ter iniciado automaticamente
                    </p>
                  </div>
                )}

                {/* Erro */}
                {erro && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-medium">Erro na exportação</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{erro}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`p-6 border-t ${
                temaId === 'elegante' ? 'border-gray-200' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleClose}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      temaId === 'elegante'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {etapaAtual === 'concluido' ? 'Fechar' : 'Cancelar'}
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    {etapaAtual === 'config' && (
                      <button
                        onClick={() => setEtapaAtual('tipo')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          temaId === 'elegante'
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-white/60 hover:bg-white/10'
                        }`}
                      >
                        Voltar
                      </button>
                    )}
                    
                    {etapaAtual === 'tipo' && (
                      <button
                        onClick={() => setEtapaAtual('config')}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Continuar
                      </button>
                    )}
                    
                    {etapaAtual === 'config' && (
                      <button
                        onClick={handleExportar}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                      </button>
                    )}
                    
                    {etapaAtual === 'concluido' && (
                      <button
                        onClick={() => {
                          resetModal();
                          setEtapaAtual('tipo');
                        }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Novo Relatório
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 