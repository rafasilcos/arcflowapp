'use client'

import React, { useState } from 'react'
import { chatgptLegislacaoService } from '@/services/chatgptService'

export default function TestChatGPT() {
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const adicionarLog = (log: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`])
  }

  const testarChatGPT = async () => {
    setLoading(true)
    setResultado(null)
    setLogs([])
    
    adicionarLog('🚀 Iniciando teste do ChatGPT...')
    
    try {
      // Interceptar console.log para capturar logs
      const originalLog = console.log
      const originalError = console.error
      
      console.log = (...args) => {
        adicionarLog(`LOG: ${args.join(' ')}`)
        originalLog(...args)
      }
      
      console.error = (...args) => {
        adicionarLog(`ERROR: ${args.join(' ')}`)
        originalError(...args)
      }
      
      const dados = {
        endereco: 'Rua Giovani Luiz Piucco, Ferraz, Garopaba, SC',
        cidade: 'Garopaba',
        uf: 'SC',
        cep: '88495-000'
      }
      
      adicionarLog(`📤 Enviando dados: ${JSON.stringify(dados)}`)
      
      const resposta = await chatgptLegislacaoService.consultarZoneamento(dados)
      
      adicionarLog(`📥 Resposta recebida: ${JSON.stringify(resposta)}`)
      
      setResultado(resposta)
      
      // Restaurar console
      console.log = originalLog
      console.error = originalError
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      adicionarLog(`❌ Erro: ${errorMessage}`)
      setResultado({ erro: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const verificarApiKey = () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    adicionarLog(`🔑 API Key: ${apiKey ? 'CONFIGURADA (' + apiKey.substring(0, 10) + '...)' : 'NÃO CONFIGURADA'}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Teste ChatGPT - Zoneamento
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Controles de Teste</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={verificarApiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔑 Verificar API Key
            </button>
            
            <button
              onClick={testarChatGPT}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '⏳ Testando...' : '🚀 Testar ChatGPT'}
            </button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📍 Endereço de Teste:</h3>
            <p>Rua Giovani Luiz Piucco, Ferraz, Garopaba, SC - CEP: 88495-000</p>
          </div>
        </div>
        
        {/* Logs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Logs do Sistema</h2>
          <div className="bg-black text-green-400 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nenhum log ainda...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Resultado */}
        {resultado && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📥 Resultado</h2>
            <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 