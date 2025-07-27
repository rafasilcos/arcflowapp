/**
 * 🐛 PÁGINA DE DEBUG PARA ORÇAMENTO
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function DebugOrcamentoPage() {
    const params = useParams();
    const orcamentoId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        console.log(message);
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                addLog(`🔍 Iniciando carregamento do orçamento ID: ${orcamentoId}`);
                setLoading(true);
                setError(null);

                // 1. Verificar token
                let token = localStorage.getItem('arcflow_auth_token');
                addLog(`🔑 Token encontrado: ${token ? 'SIM' : 'NÃO'}`);

                // 2. Login se necessário
                if (!token) {
                    addLog('🔐 Fazendo login automático...');
                    
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
                            addLog('✅ Login realizado com sucesso');
                        }
                    } else {
                        addLog(`❌ Login falhou: ${loginResponse.status}`);
                    }
                }

                if (!token) {
                    throw new Error('Token não encontrado após login');
                }

                // 3. Carregar dados do orçamento
                addLog(`📡 Fazendo chamada para: /api/orcamentos/${orcamentoId}`);
                
                const response = await fetch(`/api/orcamentos/${orcamentoId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                addLog(`📊 Resposta recebida: ${response.status} ${response.statusText}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    addLog(`❌ Erro na resposta: ${errorText}`);
                    throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();
                addLog(`✅ Dados recebidos: ${JSON.stringify(result).substring(0, 100)}...`);

                if (!result.success) {
                    throw new Error(result.message || 'Erro ao carregar orçamento');
                }

                setData(result.data);
                addLog('🎉 Carregamento concluído com sucesso!');

            } catch (err: any) {
                addLog(`💥 Erro: ${err.message}`);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orcamentoId) {
            loadData();
        }
    }, [orcamentoId]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">🐛 Debug - Orçamento {orcamentoId}</h1>
                
                {/* Status */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Status do Carregamento</h2>
                    <div className="space-y-2">
                        <div className={`p-3 rounded ${loading ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            Loading: {loading ? '🔄 Carregando...' : '✅ Concluído'}
                        </div>
                        {error && (
                            <div className="p-3 rounded bg-red-100 text-red-800">
                                Error: {error}
                            </div>
                        )}
                        {data && (
                            <div className="p-3 rounded bg-green-100 text-green-800">
                                Data: ✅ Dados carregados com sucesso
                            </div>
                        )}
                    </div>
                </div>

                {/* Logs */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Logs de Debug</h2>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
                        {logs.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </div>
                </div>

                {/* Dados */}
                {data && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Dados do Orçamento</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>ID:</strong> {data.id}
                            </div>
                            <div>
                                <strong>Código:</strong> {data.codigo}
                            </div>
                            <div>
                                <strong>Nome:</strong> {data.nome}
                            </div>
                            <div>
                                <strong>Status:</strong> {data.status}
                            </div>
                            <div>
                                <strong>Valor Total:</strong> R$ {data.valor_total?.toLocaleString('pt-BR')}
                            </div>
                            <div>
                                <strong>Cliente:</strong> {data.cliente_nome}
                            </div>
                        </div>
                        
                        <details className="mt-4">
                            <summary className="cursor-pointer font-semibold">Ver dados completos (JSON)</summary>
                            <pre className="mt-2 bg-gray-100 p-4 rounded text-xs overflow-auto">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}

                {/* Ações */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Ações de Debug</h2>
                    <div className="space-x-4">
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            🔄 Recarregar Página
                        </button>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('arcflow_auth_token');
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            🗑️ Limpar Token e Recarregar
                        </button>
                        <button 
                            onClick={() => {
                                window.open(`/api/orcamentos/${orcamentoId}`, '_blank');
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            🔗 Testar API Diretamente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}