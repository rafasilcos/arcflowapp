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

  // Funções auxiliares
  const validarConfiguracao = () => {
    if (!configuracao.nomeProjeto || !configuracao.clienteId || !configuracao.responsavelId) {
      toast.error('Preencha todos os campos obrigatórios')
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

      // 🔥 CORREÇÃO CRÍTICA: Usar responsável REAL da configuração
      // ❌ REMOVIDO: Lógica que forçava UUID fixo do Rafael para TODOS os briefings
      console.log('🎯 [CORREÇÃO RESPONSÁVEL] Usando responsável REAL da configuração:', {
        responsavelIdConfigurado: configuracao.responsavelId,
        clienteIdConfigurado: configuracao.clienteId,
        problemaCorrigido: 'UUID fixo removido - agora usa dados reais do usuário'
      });

      // Extrair disciplina, área e tipologia da seleção - CORRIGIDO
      const disciplina = selecao.disciplinas[0] || 'arquitetura';
      const disciplinaKey = selecao.disciplinas[0] || 'arquitetura';
      const area = selecao.areas[disciplinaKey] || '';
      const tipologia = selecao.tipologias[disciplinaKey] || '';
      
      console.log('🎯 [CORREÇÃO] Dados extraídos CORRETAMENTE:', {
        disciplina,
        area,
        tipologia,
        selecaoCompleta: selecao
      });

      console.log('🌐 Fazendo requisição para http://localhost:3001/api/briefings...');
      
      // 🔥 CORREÇÃO CRÍTICA: USAR CLIENTES E RESPONSÁVEIS REAIS DA CONFIGURAÇÃO
      // ❌ REMOVIDO: UUID fixo que causava o bug do cliente errado
      // const UUID_VALIDO = 'e24bb076-9318-497a-9f0e-3813d2cca2ce';
      
      console.log('🎯 [CORREÇÃO CLIENTE] Usando dados REAIS da configuração:', {
        clienteIdConfigurado: configuracao.clienteId,
        responsavelIdConfigurado: configuracao.responsavelId,
        nomeProjetoConfigurado: configuracao.nomeProjeto,
        correçãoAplicada: 'SIM - Não mais UUID fixo!'
      });
      
      const payload = {
        nomeProjeto: configuracao.nomeProjeto || 'Projeto Teste',
        descricao: configuracao.descricao || '',
        objetivos: configuracao.objetivos || '',
        prazo: configuracao.prazo || '',
        orcamento: configuracao.orcamento || '',
        clienteId: configuracao.clienteId,        // ✅ Cliente REAL selecionado pelo usuário
        responsavelId: configuracao.responsavelId,    // ✅ Responsável REAL selecionado pelo usuário
        // escritorioId será automaticamente obtido do token de autenticação no backend
        disciplina,
        area,
        tipologia,
        briefingIds: selecao.briefingIds,
        respostas: {}
      };
      
      console.log('📦 Payload:', payload);

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
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          const text = await response.text();
          errorData = text ? JSON.parse(text) : { error: 'Resposta vazia do servidor' };
        } catch (e) {
          errorData = { error: 'Erro interno do servidor - resposta inválida' }
        }
        console.error('❌ Erro da API (status:', response.status, '):', errorData);
        const errorMessage = errorData.error || errorData.message || `Erro HTTP ${response.status}`;
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Briefing criado com sucesso:', data);
      console.log('🔍 [DEBUG] Estrutura completa da resposta:', JSON.stringify(data, null, 2));
      
      // Extrair ID do briefing criado
      const briefingId = data.briefing?.id;
      console.log('🔍 [DEBUG] briefingId extraído:', briefingId);
      console.log('🔍 [DEBUG] data.briefing existe?', !!data.briefing);
      console.log('🔍 [DEBUG] data.briefing.id existe?', !!data.briefing?.id);
      
      if (briefingId) {
        console.log('✅ [NAVEGAÇÃO] ID encontrado, navegando para:', `/briefing/${briefingId}`);
        toast.success('Briefing criado com sucesso!')
        toast.info('Redirecionando para as perguntas do briefing...');
        
        // Navegar para a página de perguntas do briefing
        setTimeout(() => {
          console.log('🚀 [NAVEGAÇÃO] Executando router.push para:', `/briefing/${briefingId}`);
          router.push(`/briefing/${briefingId}`);
        }, 1500);
      } else {
        console.error('❌ ID do briefing não encontrado na resposta:', data);
        console.error('🔍 [DEBUG] Chaves disponíveis:', Object.keys(data));
        if (data.briefing) {
          console.error('🔍 [DEBUG] Chaves do briefing:', Object.keys(data.briefing));
        }
        toast.error('Briefing criado, mas não foi possível obter o ID');
        
        // Fallback para dashboard se não conseguir o ID
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
      
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
            <ConfiguracaoInicial
              configuracao={configuracao}
              onConfiguracao={setConfiguracao}
            />
            
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
