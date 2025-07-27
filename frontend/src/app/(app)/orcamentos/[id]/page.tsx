/**
 * 💰 PÁGINA DE ORÇAMENTO DINÂMICA V3.0 - ARCFLOW
 * 
 * Página completamente integrada com o sistema dinâmico de geração de orçamentos
 * Exibe todos os dados extraídos automaticamente do briefing e calculados adaptativamente
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Interface para os dados do orçamento
interface OrcamentoData {
    id: number;
    codigo: string;
    nome: string;
    cliente_nome: string;
    responsavel_nome: string;
    status: string;
    area_construida: number;
    area_terreno: number | null;
    valor_total: number;
    valor_por_m2: number;
    tipologia: string;
    padrao: string;
    complexidade: string;
    localizacao: string;
    disciplinas: string[];
    composicao_financeira: any;
    cronograma: any;
    proposta: any;
    dados_extraidos: any;
    created_at: string;
    updated_at: string;
}

export default function OrcamentoPageV3() {
    const params = useParams();
    const router = useRouter();
    const orcamentoId = params.id as string;

    // Estados principais
    const [orcamento, setOrcamento] = useState<OrcamentoData | null>(null);
    const [activeTab, setActiveTab] = useState('resumo');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Definição das abas
    const tabs = [
        { id: 'resumo', label: '📋 Resumo Geral', icon: '📋' },
        { id: 'dados-extraidos', label: '🧠 Dados Extraídos', icon: '🧠' },
        { id: 'disciplinas', label: '🔧 Disciplinas', icon: '🔧' },
        { id: 'cronograma', label: '📅 Cronograma', icon: '📅' },
        { id: 'financeiro', label: '💰 Financeiro', icon: '💰' }
    ];

    // Carregar dados do orçamento
    useEffect(() => {
        const loadOrcamentoData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('🔍 [ORCAMENTO-V3] Carregando dados do orçamento:', orcamentoId);

                // Obter token de autenticação
                let token = localStorage.getItem('arcflow_auth_token');

                // Login automático se necessário
                if (!token) {
                    console.log('🔐 [ORCAMENTO-V3] Fazendo login automático...');
                    try {
                        const loginResponse = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: 'admin@arcflow.com',
                                password: '123456'
                            })
                        });

                        if (loginResponse.ok) {
                            const loginData = await loginResponse.json();
                            token = loginData.tokens?.accessToken || loginData.token;
                            if (token) {
                                localStorage.setItem('arcflow_auth_token', token);
                            }
                        }
                    } catch (loginError) {
                        console.error('❌ [ORCAMENTO-V3] Erro no login automático:', loginError);
                    }
                }

                if (!token) {
                    throw new Error('Token de autenticação não encontrado. Faça login primeiro.');
                }

                // Carregar dados do orçamento via API
                const response = await fetch(`/api/orcamentos/${orcamentoId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Erro ao carregar orçamento');
                }

                // Processar dados extraídos
                let dadosExtraidos = null;
                if (result.data.dados_extraidos) {
                    try {
                        if (typeof result.data.dados_extraidos === 'string') {
                            dadosExtraidos = JSON.parse(result.data.dados_extraidos);
                        } else {
                            dadosExtraidos = result.data.dados_extraidos;
                        }
                    } catch (error) {
                        console.warn('⚠️ Erro ao parsear dados_extraidos:', error);
                    }
                }

                // Processar composição financeira
                let composicaoFinanceira = null;
                if (result.data.composicao_financeira) {
                    try {
                        if (typeof result.data.composicao_financeira === 'string') {
                            composicaoFinanceira = JSON.parse(result.data.composicao_financeira);
                        } else {
                            composicaoFinanceira = result.data.composicao_financeira;
                        }
                    } catch (error) {
                        console.warn('⚠️ Erro ao parsear composicao_financeira:', error);
                    }
                }

                // Processar cronograma
                let cronograma = null;
                if (result.data.cronograma) {
                    try {
                        if (typeof result.data.cronograma === 'string') {
                            cronograma = JSON.parse(result.data.cronograma);
                        } else {
                            cronograma = result.data.cronograma;
                        }
                    } catch (error) {
                        console.warn('⚠️ Erro ao parsear cronograma:', error);
                    }
                }

                const orcamentoData: OrcamentoData = {
                    ...result.data,
                    valor_total: parseFloat(result.data.valor_total) || 0,
                    valor_por_m2: parseFloat(result.data.valor_por_m2) || 0,
                    area_construida: parseInt(result.data.area_construida) || 0,
                    area_terreno: result.data.area_terreno ? parseInt(result.data.area_terreno) : null,
                    disciplinas: Array.isArray(result.data.disciplinas) ? result.data.disciplinas : [],
                    composicao_financeira: composicaoFinanceira,
                    cronograma: cronograma,
                    dados_extraidos: dadosExtraidos
                };

                setOrcamento(orcamentoData);

                console.log('✅ [ORCAMENTO-V3] Dados carregados:', {
                    id: orcamentoData.id,
                    codigo: orcamentoData.codigo,
                    valorTotal: orcamentoData.valor_total,
                    areaTerreno: orcamentoData.area_terreno,
                    localizacao: orcamentoData.localizacao,
                    disciplinas: orcamentoData.disciplinas?.length || 0
                });

            } catch (error: any) {
                console.error('❌ [ORCAMENTO-V3] Erro ao carregar orçamento:', error);
                setError(`Erro ao carregar dados do orçamento: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (orcamentoId) {
            loadOrcamentoData();
        }
    }, [orcamentoId]);

    // Função para obter nome da disciplina
    const getDisciplineName = (codigo: string): string => {
        const nomes: Record<string, string> = {
            'arquitetura': 'Projeto Arquitetônico',
            'estrutural': 'Projeto Estrutural',
            'instalacoes_hidraulicas': 'Instalações Hidráulicas',
            'instalacoes_eletricas': 'Instalações Elétricas',
            'climatizacao': 'Climatização',
            'paisagismo': 'Paisagismo',
            'interiores': 'Design de Interiores',
            'aprovacao_legal': 'Aprovação Legal',
            'modelagem_3d': 'Modelagem 3D'
        };
        return nomes[codigo] || codigo.charAt(0).toUpperCase() + codigo.slice(1);
    };

    // Função para formatar moeda
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Estados de loading e erro
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 mb-2">Carregando orçamento dinâmico...</p>
                    <p className="text-sm text-gray-500">Sistema V3.0 - Análise Inteligente</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-8xl mb-6">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar orçamento</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Tentar novamente
                        </button>
                        <button
                            onClick={() => router.push('/orcamentos')}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Voltar aos Orçamentos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!orcamento) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-gray-400 text-8xl mb-6">📋</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Orçamento não encontrado</h2>
                    <p className="text-gray-600 mb-6">O orçamento solicitado não existe ou foi removido.</p>
                    <button
                        onClick={() => router.push('/orcamentos')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar aos Orçamentos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header com Badge V3.0 */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => router.push('/orcamentos')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Voltar
                            </button>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {orcamento.nome}
                            </h1>
                            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                                orcamento.status === 'APROVADO'
                                    ? 'bg-green-100 text-green-800'
                                    : orcamento.status === 'RASCUNHO'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-blue-100 text-blue-800'
                            }`}>
                                {orcamento.status}
                            </div>
                            <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                                V3.0 DINÂMICO
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span>👤</span>
                                <span className="font-medium">{orcamento.cliente_nome}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>📋</span>
                                <span>{orcamento.codigo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🏠</span>
                                <span>{orcamento.area_construida}m²</span>
                            </div>
                            {orcamento.area_terreno && (
                                <div className="flex items-center gap-2">
                                    <span>🏞️</span>
                                    <span>{orcamento.area_terreno}m² terreno</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{orcamento.localizacao}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <span className="mr-2">✏️</span>
                            Editar Orçamento
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <span className="mr-2">📄</span>
                            Gerar PDF
                        </button>
                    </div>
                </div>

                {/* Cards de Estatísticas Dinâmicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">💰</span>
                            <span className="text-sm font-medium text-gray-600">Valor Total</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(orcamento.valor_total)}
                        </div>
                        <div className="text-sm text-gray-500">
                            {formatCurrency(orcamento.valor_por_m2)}/m²
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🏠</span>
                            <span className="text-sm font-medium text-gray-600">Área</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                            {orcamento.area_construida}m²
                        </div>
                        <div className="text-sm text-gray-500">
                            {orcamento.tipologia}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">⭐</span>
                            <span className="text-sm font-medium text-gray-600">Padrão</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600 capitalize">
                            {orcamento.padrao}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                            {orcamento.complexidade}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🔧</span>
                            <span className="text-sm font-medium text-gray-600">Disciplinas</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                            {orcamento.disciplinas?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Disciplinas ativas</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🧠</span>
                            <span className="text-sm font-medium text-gray-600">IA</span>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">
                            {orcamento.dados_extraidos?.confianca || 0}%
                        </div>
                        <div className="text-sm text-gray-500">Confiança</div>
                    </div>
                </div>

                {/* Abas de Navegação */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Conteúdo das Abas */}
                <div className="space-y-6">
                    {activeTab === 'resumo' && (
                        <div className="space-y-6">
                            {/* Resumo Geral */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>📋</span>
                                    Resumo do Projeto
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Informações Básicas</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Cliente:</span>
                                                <span className="font-medium">{orcamento.cliente_nome}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Responsável:</span>
                                                <span className="font-medium">{orcamento.responsavel_nome || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tipologia:</span>
                                                <span className="font-medium capitalize">{orcamento.tipologia}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Área Construída:</span>
                                                <span className="font-medium">{orcamento.area_construida} m²</span>
                                            </div>
                                            {orcamento.area_terreno && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Área Terreno:</span>
                                                    <span className="font-medium">{orcamento.area_terreno} m²</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Classificação</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Padrão:</span>
                                                <span className="font-medium capitalize">{orcamento.padrao}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Complexidade:</span>
                                                <span className="font-medium capitalize">{orcamento.complexidade}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Localização:</span>
                                                <span className="font-medium">{orcamento.localizacao}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    orcamento.status === 'APROVADO' ? 'bg-green-100 text-green-800' :
                                                    orcamento.status === 'RASCUNHO' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {orcamento.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Valores</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Valor Total:</span>
                                                <span className="font-bold text-lg text-blue-600">
                                                    {formatCurrency(orcamento.valor_total)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Valor por m²:</span>
                                                <span className="font-medium">
                                                    {formatCurrency(orcamento.valor_por_m2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Disciplinas:</span>
                                                <span className="font-medium">{orcamento.disciplinas?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dados-extraidos' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🧠</span>
                                Dados Extraídos pela IA V3.0
                            </h3>
                            {orcamento.dados_extraidos ? (
                                <div className="space-y-6">
                                    {/* Informações de Análise */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Informações da Análise</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Confiança:</span>
                                                <div className="font-bold text-lg text-blue-600">
                                                    {orcamento.dados_extraidos.confianca || 0}%
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Versão Analyzer:</span>
                                                <div className="font-medium">
                                                    {orcamento.dados_extraidos.versaoAnalyzer || 'V3.0'}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Fonte dos Dados:</span>
                                                <div className="font-medium">
                                                    {orcamento.dados_extraidos.fonteDados || 'Briefing Dinâmico'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dados Extraídos */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Dados do Projeto</h4>
                                            <div className="space-y-2 text-sm">
                                                {Object.entries(orcamento.dados_extraidos)
                                                    .filter(([key]) => !['confianca', 'versaoAnalyzer', 'fonteDados', 'timestampAnalise'].includes(key))
                                                    .map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-gray-600 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                                            </span>
                                                            <span className="font-medium">
                                                                {Array.isArray(value) ? value.join(', ') : String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Características Especiais */}
                                        {orcamento.dados_extraidos.caracteristicasEspeciais && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">Características Especiais</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {orcamento.dados_extraidos.caracteristicasEspeciais.map((caracteristica: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                        >
                                                            {caracteristica}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <span className="text-4xl mb-4 block">🤖</span>
                                    Dados extraídos não disponíveis
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'disciplinas' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🔧</span>
                                Disciplinas do Projeto
                            </h3>
                            {orcamento.disciplinas && orcamento.disciplinas.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {orcamento.disciplinas.map((disciplina: string, index: number) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {getDisciplineName(disciplina)}
                                                </h4>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {disciplina}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Disciplina identificada automaticamente pelo sistema dinâmico
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <span className="text-4xl mb-4 block">🔧</span>
                                    Nenhuma disciplina encontrada
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'cronograma' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span>📅</span>
                                Cronograma de Execução
                            </h3>
                            {orcamento.cronograma && orcamento.cronograma.fases ? (
                                <div className="space-y-4">
                                    {Object.entries(orcamento.cronograma.fases).map(([codigo, fase]: [string, any]) => (
                                        <div key={codigo} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{fase.nome}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>{fase.prazo} dias</span>
                                                    <span className="font-medium text-blue-600">
                                                        {formatCurrency(fase.valor)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                {fase.objetivo}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>Código: {fase.codigo}</span>
                                                <span>Percentual: {(fase.percentual * 100).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Resumo do Cronograma */}
                                    <div className="bg-gray-50 rounded-lg p-4 mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {orcamento.cronograma.prazoTotal}
                                                </div>
                                                <div className="text-sm text-gray-600">Dias totais</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-600">
                                                    {Object.keys(orcamento.cronograma.fases).length}
                                                </div>
                                                <div className="text-sm text-gray-600">Fases</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {formatCurrency(orcamento.cronograma.valorTecnicoTotal)}
                                                </div>
                                                <div className="text-sm text-gray-600">Valor técnico</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <span className="text-4xl mb-4 block">📅</span>
                                    Cronograma não disponível
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'financeiro' && (
                        <div className="space-y-6">
                            {/* Resumo Financeiro */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>💰</span>
                                    Detalhes Financeiros
                                </h3>
                                
                                {orcamento.composicao_financeira ? (
                                    <div className="space-y-6">
                                        {/* Cards de Valores */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(orcamento.composicao_financeira.custosHoras)}
                                                </div>
                                                <div className="text-sm text-gray-600">Custos de Horas</div>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(orcamento.composicao_financeira.custosIndiretos)}
                                                </div>
                                                <div className="text-sm text-gray-600">Custos Indiretos</div>
                                            </div>
                                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">
                                                    {formatCurrency(orcamento.composicao_financeira.impostos)}
                                                </div>
                                                <div className="text-sm text-gray-600">Impostos</div>
                                            </div>
                                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {formatCurrency(orcamento.composicao_financeira.margemLucro)}
                                                </div>
                                                <div className="text-sm text-gray-600">Margem de Lucro</div>
                                            </div>
                                        </div>

                                        {/* Disciplinas Detalhadas */}
                                        {orcamento.composicao_financeira.disciplinasDetalhadas && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-4">Breakdown por Disciplina</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Disciplina
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Horas
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Valor/Hora
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Total
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    %
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {orcamento.composicao_financeira.disciplinasDetalhadas.map((disciplina: any, index: number) => (
                                                                <tr key={index} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {disciplina.nome}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {disciplina.horasEstimadas}h
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {formatCurrency(disciplina.valorHora)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                                        {formatCurrency(disciplina.valorTotal)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {disciplina.percentualTotal}%
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <span className="text-4xl mb-4 block">💰</span>
                                        Detalhes financeiros não disponíveis
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer com informações do sistema */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        Orçamento gerado pelo Sistema Dinâmico V3.0 • 
                        Criado em {new Date(orcamento.created_at).toLocaleDateString('pt-BR')} • 
                        Última atualização: {new Date(orcamento.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>
        </div>
    );
}