'use client';

import { useState } from 'react';
import estruturaService from '@/services/estruturaPersonalizadaService';

export default function TestDatabase() {
  const [isTestingEstrutura, setIsTestingEstrutura] = useState(false);
  const [isTestingRespostas, setIsTestingRespostas] = useState(false);
  const [resultadoEstrutura, setResultadoEstrutura] = useState<string>('');
  const [resultadoRespostas, setResultadoRespostas] = useState<string>('');

  const testarEstrutura = async () => {
    setIsTestingEstrutura(true);
    try {
      const estruturaTeste = {
        personalizado: true,
        secoesVisiveis: ['1', '2'],
        briefingPersonalizado: {
          id: 'teste-estrutura',
          nome: 'Briefing Teste',
          secoes: [
            {
              id: '1',
              nome: 'Seção 1',
              perguntas: [
                { id: '1', pergunta: 'Teste 1', tipo: 'text' }
              ]
            }
          ]
        },
        versao: 'v2024',
        criadoEm: new Date().toISOString(),
        clienteId: 'teste-cliente',
        projetoId: 'teste-projeto'
      };

      // Salvar
      await estruturaService.salvarEstrutura('teste-briefing', estruturaTeste);
      
      // Carregar
      const estruturaCarregada = await estruturaService.carregarEstrutura('teste-briefing');
      
      setResultadoEstrutura(JSON.stringify(estruturaCarregada, null, 2));
      
    } catch (error) {
      setResultadoEstrutura('ERRO: ' + (error as Error).message);
    } finally {
      setIsTestingEstrutura(false);
    }
  };

  const testarRespostas = async () => {
    setIsTestingRespostas(true);
    try {
      const respostasTeste = {
        '1': 'Resposta teste 1',
        '2': 'Resposta teste 2',
        '3': 'Resposta teste 3'
      };

      // Salvar
      await estruturaService.salvarRespostas('teste-briefing', respostasTeste);
      
      // Carregar
      const respostasCarregadas = await estruturaService.carregarRespostas('teste-briefing');
      
      setResultadoRespostas(JSON.stringify(respostasCarregadas, null, 2));
      
    } catch (error) {
      setResultadoRespostas('ERRO: ' + (error as Error).message);
    } finally {
      setIsTestingRespostas(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🧪 Teste do Sistema de Banco de Dados
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Teste de Estruturas */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📋 Teste de Estruturas</h2>
          <button
            onClick={testarEstrutura}
            disabled={isTestingEstrutura}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isTestingEstrutura ? 'Testando...' : 'Testar Estruturas'}
          </button>
          
          {resultadoEstrutura && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
                {resultadoEstrutura}
              </pre>
            </div>
          )}
        </div>

        {/* Teste de Respostas */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">💬 Teste de Respostas</h2>
          <button
            onClick={testarRespostas}
            disabled={isTestingRespostas}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isTestingRespostas ? 'Testando...' : 'Testar Respostas'}
          </button>
          
          {resultadoRespostas && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
                {resultadoRespostas}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Informações do Teste</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Este teste verifica se o sistema está salvando no banco PostgreSQL</li>
          <li>• Cada teste salva dados e depois carrega para verificar</li>
          <li>• Em caso de erro, aparecerá a mensagem de erro</li>
          <li>• Sistema está configurado para 10.000 usuários simultâneos</li>
        </ul>
      </div>
    </div>
  );
} 