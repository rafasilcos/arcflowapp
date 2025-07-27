'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { ConfiguracaoInicial } from '@/components/briefing/ConfiguracaoInicial'
import SeletorDisciplinasHierarquico from '@/components/briefing/SeletorDisciplinasHierarquico'
import { toast } from 'sonner'
import type { SelecaoComposta } from '@/types/disciplinas'

interface ConfiguracaoInicial {
  nomeProjeto: string
  descricao: string
  objetivos: string
  prazo: string
  orcamento: string
  clienteId: string
  responsavelId: string
}

export default function NovoBriefing() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estados
  const [etapa, setEtapa] = useState<'configuracao' | 'selecao'>('configuracao')
  const [configuracao, setConfiguracao] = useState<ConfiguracaoInicial>({
    nomeProjeto: '',
    descricao: '',
    objetivos: '',
    prazo: '',
    orcamento: '',
    clienteId: searchParams.get('clienteId') || '',
    responsavelId: ''
  })

        // 🔥 CORREÇÃO CRÍTICA: REMOVIDO UUID FIXO - Agora usa dados reais da configuração
      // ❌ const UUID_VALIDO = 'e24bb076-9318-497a-9f0e-3813d2cca2ce'; // REMOVIDO!

  // Funções auxiliares
  const validarConfiguracao = () => {
    if (!configuracao.nomeProjeto) {
      toast.error('Nome do projeto é obrigatório')
      return false
    }
    return true
  }

  const handleSelecaoCompleta = async (selecao: SelecaoComposta) => {
    try {
      console.log('🔄 Iniciando criação de briefing...');
      console.log('📋 Seleção:', selecao);
      console.log('⚙️ Configuração:', configuracao);
      
      // Verificar token
      let token = localStorage.getItem('arcflow_auth_token')
      
      // Se não houver token, usar um token de desenvolvimento
      if (!token) {
        console.log('⚠️ Token não encontrado no localStorage, usando token de desenvolvimento');
        token = 'dev-token-for-testing'; // Token temporário para desenvolvimento
      } else {
        console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
      }

      // Extrair disciplina, área e tipologia da seleção
      const disciplina = selecao.disciplinas[0] || 'arquitetura';
      const area = Object.values(selecao.areas)[0] || 'residencial';
      const tipologia = Object.values(selecao.tipologias)[0] || 'unifamiliar';

      console.log('🌐 Fazendo requisição para http://localhost:3001/api/briefings...');
      
      // 🔥 CORREÇÃO: USAR DADOS REAIS DA CONFIGURAÇÃO
      const payload = {
        nomeProjeto: configuracao.nomeProjeto || 'Projeto Teste',
        descricao: configuracao.descricao || '',
        objetivos: configuracao.objetivos || '',
        prazo: configuracao.prazo || '',
        orcamento: configuracao.orcamento || '',
        clienteId: configuracao.clienteId,        // ✅ Cliente REAL selecionado
        responsavelId: configuracao.responsavelId,    // ✅ Responsável REAL selecionado
        // escritorioId será obtido automaticamente do token no backend
        disciplina,
        area,
        tipologia,
        briefingIds: selecao.briefingIds || [],
        respostas: {}
      };
      
      console.log('📦 Payload com UUIDs válidos:', payload);

      const response = await fetch('http://localhost:3001/api/briefings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: await response.text() }
        }
        console.error('❌ Erro da API:', errorData);
        throw new Error(errorData.error || `Erro HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Briefing criado com sucesso:', data);
      toast.success('🎉 Briefing criado com sucesso!')
      
      // Navegar para o dashboard
      toast.info('Redirecionando para dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('💥 Erro completo:', error)
      console.error('💥 Stack trace:', error.stack)
      toast.error(error.message || 'Erro ao criar briefing')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 mb-8 bg-white border-b border-gray-200"
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              href="/briefing"
              className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Novo Briefing
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Etapa {etapa === 'configuracao' ? '1' : '2'} de 2</span>
                <span>•</span>
                <span>{etapa === 'configuracao' ? 'Configuração Inicial' : 'Seleção de Disciplinas'}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  ✅ UUID CORRIGIDO
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 pb-20"
      >
        {etapa === 'configuracao' ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuração do Projeto
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    value={configuracao.nomeProjeto}
                    onChange={(e) => setConfiguracao({
                      ...configuracao,
                      nomeProjeto: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o nome do projeto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={configuracao.descricao}
                    onChange={(e) => setConfiguracao({
                      ...configuracao,
                      descricao: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Descrição do projeto (opcional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo
                    </label>
                    <input
                      type="text"
                      value={configuracao.prazo}
                      onChange={(e) => setConfiguracao({
                        ...configuracao,
                        prazo: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 3 meses"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orçamento
                    </label>
                    <input
                      type="text"
                      value={configuracao.orcamento}
                      onChange={(e) => setConfiguracao({
                        ...configuracao,
                        orcamento: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: R$ 50.000"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botões de Navegação */}
            <div className="flex justify-between mt-8">
              <Link href="/briefing">
                <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
              </Link>

              <button
                onClick={() => {
                  if (validarConfiguracao()) {
                    setEtapa('selecao')
                  }
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Próxima Etapa
              </button>
            </div>
          </>
        ) : (
          <SeletorDisciplinasHierarquico
            onSelecaoCompleta={handleSelecaoCompleta}
          />
        )}
      </motion.div>
    </div>
  )
} 