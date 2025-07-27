'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, FileText, User, Target, Calendar, Building, Home, Briefcase, Factory, School, TreePine, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Cliente } from '@/types/integracaoComercial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConfiguracaoInicialBriefingProps {
  cliente: Cliente;
  onVoltar: () => void;
  onContinuar: (dadosIniciais: DadosIniciaisBriefing) => void;
}

export interface DadosIniciaisBriefing {
  nomeBriefing: string;
  motivoBriefing: string;
  tipoBriefing: string;
  responsavelPreenchimento: string;
  responsavelId: string;
  prazoDesejado: string;
  observacoesIniciais: string;
}

interface ProfissionalEscritorio {
  id: string;
  nome: string;
  cargo: string;
  especialidade: string;
  email: string;
  telefone?: string;
  avatar?: string;
  ativo: boolean;
}

const MOTIVOS_BRIEFING = [
  { id: 'novo_projeto', label: 'Novo Projeto', icon: '🏗️', desc: 'Projeto completamente novo' },
  { id: 'reforma', label: 'Reforma/Ampliação', icon: '🔨', desc: 'Modificação de projeto existente' },
  { id: 'consultoria', label: 'Consultoria', icon: '💡', desc: 'Orientação técnica especializada' },
  { id: 'viabilidade', label: 'Estudo de Viabilidade', icon: '📊', desc: 'Análise prévia de viabilidade' },
  { id: 'legalizacao', label: 'Legalização', icon: '📋', desc: 'Regularização de projeto existente' },
  { id: 'outros', label: 'Outros', icon: '❓', desc: 'Outros motivos específicos' }
];

const TIPOS_BRIEFING = [
  { id: 'arquitetura', label: 'Arquitetura', icon: <Building className="w-5 h-5" />, desc: 'Projetos arquitetônicos completos' },
  { id: 'estrutural', label: 'Engenharia Estrutural', icon: <Factory className="w-5 h-5" />, desc: 'Projetos estruturais especializados' },
  { id: 'instalacoes', label: 'Instalações', icon: '⚡', desc: 'Projetos de instalações prediais' },
  { id: 'paisagismo', label: 'Paisagismo', icon: <TreePine className="w-5 h-5" />, desc: 'Projetos paisagísticos' },
  { id: 'design', label: 'Design de Interiores', icon: <Home className="w-5 h-5" />, desc: 'Projetos de interiores' },
  { id: 'multidisciplinar', label: 'Multidisciplinar', icon: <Briefcase className="w-5 h-5" />, desc: 'Múltiplas disciplinas integradas' }
];

// Mock dos profissionais do escritório - em produção virá do contexto/API
const PROFISSIONAIS_ESCRITORIO: ProfissionalEscritorio[] = [
  {
    id: 'PROF_001',
    nome: 'Ana Silva',
    cargo: 'Arquiteta Sênior',
    especialidade: 'Projetos Residenciais',
    email: 'ana.silva@escritorio.com',
    telefone: '(11) 99999-0001',
    ativo: true
  },
  {
    id: 'PROF_002',
    nome: 'Carlos Santos',
    cargo: 'Engenheiro Civil',
    especialidade: 'Estruturas e Fundações',
    email: 'carlos.santos@escritorio.com',
    telefone: '(11) 99999-0002',
    ativo: true
  },
  {
    id: 'PROF_003',
    nome: 'Mariana Costa',
    cargo: 'Arquiteta Júnior',
    especialidade: 'Design de Interiores',
    email: 'mariana.costa@escritorio.com',
    telefone: '(11) 99999-0003',
    ativo: true
  },
  {
    id: 'PROF_004',
    nome: 'Roberto Lima',
    cargo: 'Coordenador de Projetos',
    especialidade: 'Gestão e Coordenação',
    email: 'roberto.lima@escritorio.com',
    telefone: '(11) 99999-0004',
    ativo: true
  },
  {
    id: 'PROF_005',
    nome: 'Fernanda Oliveira',
    cargo: 'Engenheira de Instalações',
    especialidade: 'Instalações Prediais',
    email: 'fernanda.oliveira@escritorio.com',
    telefone: '(11) 99999-0005',
    ativo: true
  }
];

export default function ConfiguracaoInicialBriefing({ cliente, onVoltar, onContinuar }: ConfiguracaoInicialBriefingProps) {
  const { tema, temaId } = useTheme();
  
  const [dadosIniciais, setDadosIniciais] = useState<DadosIniciaisBriefing>({
    nomeBriefing: `Projeto ${cliente.nome} - ${new Date().getFullYear()}`,
    motivoBriefing: '',
    tipoBriefing: '',
    responsavelPreenchimento: '',
    responsavelId: '',
    prazoDesejado: '',
    observacoesIniciais: ''
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [profissionais, setProfissionais] = useState<ProfissionalEscritorio[]>([]);
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [buscaProfissional, setBuscaProfissional] = useState('');

  // Carregar profissionais do escritório
  useEffect(() => {
    // Em produção, isso viria de uma API ou contexto
    setProfissionais(PROFISSIONAIS_ESCRITORIO.filter(p => p.ativo));
  }, []);

  // Fechar seletor ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (seletorAberto && !target.closest('.seletor-profissional')) {
        setSeletorAberto(false);
        setBuscaProfissional('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [seletorAberto]);

  // Filtrar profissionais pela busca
  const profissionaisFiltrados = profissionais.filter(prof =>
    prof.nome.toLowerCase().includes(buscaProfissional.toLowerCase()) ||
    prof.cargo.toLowerCase().includes(buscaProfissional.toLowerCase()) ||
    prof.especialidade.toLowerCase().includes(buscaProfissional.toLowerCase())
  );

  // Selecionar profissional responsável
  const handleSelecionarProfissional = (profissional: ProfissionalEscritorio) => {
    setDadosIniciais(prev => ({
      ...prev,
      responsavelPreenchimento: profissional.nome,
      responsavelId: profissional.id
    }));
    setSeletorAberto(false);
    setBuscaProfissional('');
    // Limpar erro se existir
    if (erros.responsavelPreenchimento) {
      setErros(prev => ({ ...prev, responsavelPreenchimento: '' }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!dadosIniciais.nomeBriefing.trim()) {
      novosErros.nomeBriefing = 'Nome do briefing é obrigatório';
    }

    if (!dadosIniciais.motivoBriefing) {
      novosErros.motivoBriefing = 'Motivo do briefing é obrigatório';
    }

    if (!dadosIniciais.tipoBriefing) {
      novosErros.tipoBriefing = 'Tipo de briefing é obrigatório';
    }

    if (!dadosIniciais.responsavelPreenchimento.trim()) {
      novosErros.responsavelPreenchimento = 'Responsável pelo preenchimento é obrigatório';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleContinuar = () => {
    if (validarFormulario()) {
      onContinuar(dadosIniciais);
    }
  };

  const handleInputChange = (campo: keyof DadosIniciaisBriefing, valor: string) => {
    setDadosIniciais(prev => ({ ...prev, [campo]: valor }));
    // Limpar erro do campo quando usuário começar a digitar
    if (erros[campo]) {
      setErros(prev => ({ ...prev, [campo]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`text-sm ${tema.textSecondary}`}>Cliente:</span>
          <span className={`text-sm font-medium ${tema.text}`}>
            {cliente.nome}
          </span>
          <span className={tema.textSecondary}>→</span>
          <span className={`text-sm font-medium text-blue-600`}>
            Configuração Inicial
          </span>
          <span className={tema.textSecondary}>→</span>
          <span className={`text-sm ${tema.textSecondary}`}>
            Seleção de Briefing
          </span>
        </div>
        
        <h2 className={`text-2xl font-bold ${tema.text} mb-2`}>
          Configuração Inicial do Briefing
        </h2>
        <p className={`${tema.textSecondary} mb-6`}>
          Configure as informações básicas antes de iniciar o briefing detalhado
        </p>
      </motion.div>

      {/* Resumo do Cliente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`${tema.card} border-l-4 border-l-blue-500`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                temaId === 'elegante' ? 'bg-blue-100' : 'bg-blue-500/20'
              }`}>
                {cliente.cnpj ? (
                  <Building className={`w-6 h-6 ${
                    temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                  }`} />
                ) : (
                  <User className={`w-6 h-6 ${
                    temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                  }`} />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${tema.text}`}>{cliente.nome}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className={tema.textSecondary}>{cliente.email}</span>
                  <span className={tema.textSecondary}>{cliente.telefone}</span>
                  {cliente.historicoProjetos && cliente.historicoProjetos.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {cliente.historicoProjetos.length} projeto(s) anterior(es)
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Formulário de Configuração */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Nome do Briefing */}
        <Card className={tema.card}>
          <CardHeader>
            <CardTitle className={`text-lg ${tema.text} flex items-center gap-2`}>
              <FileText className="w-5 h-5" />
              Identificação do Briefing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Nome do Briefing *
              </label>
              <Input
                value={dadosIniciais.nomeBriefing}
                onChange={e => handleInputChange('nomeBriefing', e.target.value)}
                placeholder="Ex: Projeto Residencial - Casa Silva 2024"
                className={`${erros.nomeBriefing ? 'border-red-500' : ''}`}
              />
              {erros.nomeBriefing && (
                <p className="text-red-500 text-sm mt-1">{erros.nomeBriefing}</p>
              )}
            </div>

            <div className="relative">
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Responsável pelo Preenchimento *
              </label>
              
              {/* Seletor Custom */}
              <div className="relative seletor-profissional">
                <button
                  type="button"
                  onClick={() => setSeletorAberto(!seletorAberto)}
                  className={`w-full px-3 py-2 rounded-lg border text-left flex items-center justify-between ${
                    erros.responsavelPreenchimento ? 'border-red-500' : 
                    temaId === 'elegante'
                      ? 'bg-white border-gray-200 hover:border-blue-300'
                      : 'bg-white/10 border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  <span className={`${
                    dadosIniciais.responsavelPreenchimento 
                      ? tema.text 
                      : temaId === 'elegante' ? 'text-gray-400' : 'text-white/60'
                  }`}>
                    {dadosIniciais.responsavelPreenchimento || 'Selecione um profissional...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    seletorAberto ? 'transform rotate-180' : ''
                  } ${tema.textSecondary}`} />
                </button>

                {/* Dropdown */}
                {seletorAberto && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 ${
                      temaId === 'elegante'
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-800 border-gray-600'
                    }`}
                  >
                    {/* Campo de busca */}
                    <div className="p-3 border-b border-gray-200">
                      <Input
                        value={buscaProfissional}
                        onChange={e => setBuscaProfissional(e.target.value)}
                        placeholder="Buscar profissional..."
                        className="w-full"
                      />
                    </div>

                    {/* Lista de profissionais */}
                    <div className="max-h-64 overflow-y-auto">
                      {profissionaisFiltrados.length > 0 ? (
                        profissionaisFiltrados.map(profissional => (
                          <button
                            key={profissional.id}
                            type="button"
                            onClick={() => handleSelecionarProfissional(profissional)}
                            className={`w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                              dadosIniciais.responsavelId === profissional.id
                                ? temaId === 'elegante' 
                                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                  : 'bg-blue-500/20 border-l-4 border-l-blue-400'
                                : ''
                            }`}
                          >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              temaId === 'elegante' ? 'bg-blue-100' : 'bg-blue-500/20'
                            }`}>
                              <User className={`w-5 h-5 ${
                                temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                              }`} />
                            </div>

                            {/* Dados do profissional */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-medium ${tema.text}`}>
                                  {profissional.nome}
                                </h4>
                                {dadosIniciais.responsavelId === profissional.id && (
                                  <Check className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <p className={`text-sm ${tema.textSecondary}`}>
                                {profissional.cargo}
                              </p>
                              <p className={`text-xs ${tema.textSecondary}`}>
                                {profissional.especialidade}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center">
                          <p className={`text-sm ${tema.textSecondary}`}>
                            Nenhum profissional encontrado
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {erros.responsavelPreenchimento && (
                <p className="text-red-500 text-sm mt-1">{erros.responsavelPreenchimento}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Motivo do Briefing */}
        <Card className={tema.card}>
          <CardHeader>
            <CardTitle className={`text-lg ${tema.text} flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Motivo do Briefing *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MOTIVOS_BRIEFING.map(motivo => (
                <motion.button
                  key={motivo.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('motivoBriefing', motivo.id)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    dadosIniciais.motivoBriefing === motivo.id
                      ? temaId === 'elegante'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-blue-400 bg-blue-500/20'
                      : temaId === 'elegante'
                      ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      : 'border-white/20 bg-white/5 hover:border-blue-400 hover:bg-white/10'
                  } ${erros.motivoBriefing ? 'border-red-500' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{motivo.icon}</span>
                    <h4 className={`font-medium ${
                      dadosIniciais.motivoBriefing === motivo.id 
                        ? temaId === 'elegante' ? 'text-blue-700' : 'text-blue-300'
                        : tema.text
                    }`}>
                      {motivo.label}
                    </h4>
                  </div>
                  <p className={`text-xs ${
                    dadosIniciais.motivoBriefing === motivo.id 
                      ? temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                      : tema.textSecondary
                  }`}>
                    {motivo.desc}
                  </p>
                </motion.button>
              ))}
            </div>
            {erros.motivoBriefing && (
              <p className="text-red-500 text-sm mt-2">{erros.motivoBriefing}</p>
            )}
          </CardContent>
        </Card>

        {/* Tipo de Briefing */}
        <Card className={tema.card}>
          <CardHeader>
            <CardTitle className={`text-lg ${tema.text} flex items-center gap-2`}>
              <Briefcase className="w-5 h-5" />
              Tipo de Briefing *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {TIPOS_BRIEFING.map(tipo => (
                <motion.button
                  key={tipo.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('tipoBriefing', tipo.id)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    dadosIniciais.tipoBriefing === tipo.id
                      ? temaId === 'elegante'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-blue-400 bg-blue-500/20'
                      : temaId === 'elegante'
                      ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      : 'border-white/20 bg-white/5 hover:border-blue-400 hover:bg-white/10'
                  } ${erros.tipoBriefing ? 'border-red-500' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {typeof tipo.icon === 'string' ? (
                      <span className="text-xl">{tipo.icon}</span>
                    ) : (
                      <div className={`${
                        dadosIniciais.tipoBriefing === tipo.id 
                          ? temaId === 'elegante' ? 'text-blue-700' : 'text-blue-300'
                          : tema.text
                      }`}>
                        {tipo.icon}
                      </div>
                    )}
                    <h4 className={`font-medium ${
                      dadosIniciais.tipoBriefing === tipo.id 
                        ? temaId === 'elegante' ? 'text-blue-700' : 'text-blue-300'
                        : tema.text
                    }`}>
                      {tipo.label}
                    </h4>
                  </div>
                  <p className={`text-xs ${
                    dadosIniciais.tipoBriefing === tipo.id 
                      ? temaId === 'elegante' ? 'text-blue-600' : 'text-blue-400'
                      : tema.textSecondary
                  }`}>
                    {tipo.desc}
                  </p>
                </motion.button>
              ))}
            </div>
            {erros.tipoBriefing && (
              <p className="text-red-500 text-sm mt-2">{erros.tipoBriefing}</p>
            )}
          </CardContent>
        </Card>

        {/* Informações Complementares */}
        <Card className={tema.card}>
          <CardHeader>
            <CardTitle className={`text-lg ${tema.text} flex items-center gap-2`}>
              <Calendar className="w-5 h-5" />
              Informações Complementares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Prazo Desejado (opcional)
              </label>
              <Input
                value={dadosIniciais.prazoDesejado}
                onChange={e => handleInputChange('prazoDesejado', e.target.value)}
                placeholder="Ex: 3 meses, Urgente, Sem pressa específica"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Observações Iniciais (opcional)
              </label>
              <textarea
                value={dadosIniciais.observacoesIniciais}
                onChange={e => handleInputChange('observacoesIniciais', e.target.value)}
                placeholder="Informações importantes, contexto especial, requisitos específicos..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border resize-none ${
                  temaId === 'elegante'
                    ? 'bg-white border-gray-200 focus:border-blue-500'
                    : 'bg-white/10 border-white/10 text-white placeholder:text-white/60 focus:border-white/30'
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botões de Ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center"
      >
        <Button
          variant="outline"
          onClick={onVoltar}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Cliente
        </Button>

        <Button
          onClick={handleContinuar}
          variant="comercial"
          size="lg"
          className="flex items-center gap-2"
        >
          Continuar para Seleção
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
} 