'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, ArrowLeft, FileText, User, Calendar,
  Clock, Building, DollarSign, Zap, Download,
  Send, Share2, Loader2
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

interface BriefingData {
  id: string
  nome_projeto: string
  status: string
  disciplina: string
  area: string
  tipologia: string
  created_at: string
  _isEditMode?: boolean
  _editedData?: boolean
}

export default function PreSalvamentoPage({ params }: PageProps) {
  const { tema, personalizacao } = useTheme()
  const router = useRouter()
  
  const [paramsData, setParamsData] = useState<{ id: string } | null>(null)
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [respostasCarregadas, setRespostasCarregadas] = useState<Record<string, any>>({})

  useEffect(() => {
    params.then(setParamsData)
  }, [params])

  // Carregar dados do briefing editado
  useEffect(() => {
    if (!paramsData?.id) return

    const carregarDados = async () => {
      try {
        console.log('📋 [PRE-SALVAMENTO] Carregando dados do briefing editado:', paramsData.id)
        
        // Carregar dados temporários salvos pela página anterior
        const chaveTemp = `briefing-pre-salvamento-${paramsData.id}`
        const dadosTemp = localStorage.getItem(chaveTemp)
        
        if (dadosTemp) {
          const dadosParsed = JSON.parse(dadosTemp)
          console.log('✅ [PRE-SALVAMENTO] Dados temporários encontrados:', Object.keys(dadosParsed).length)
          
          // Extrair informações do briefing
          setBriefingData({
            id: dadosParsed._briefingId || paramsData.id,
            nome_projeto: dadosParsed.nomeProjeto || 'Projeto ArcFlow',
            status: 'EDITADO',
            disciplina: dadosParsed.disciplina || 'Arquitetura',
            area: dadosParsed.area || 'Residencial',
            tipologia: dadosParsed.tipologia || 'Casa',
            created_at: new Date().toISOString(),
            _isEditMode: dadosParsed._isEditMode,
            _editedData: dadosParsed._editedData
          })
          
          // Carregar respostas
          const respostasLimpas = { ...dadosParsed }
          delete respostasLimpas._briefingId
          delete respostasLimpas._isEditMode
          delete respostasLimpas._editedData
          setRespostasCarregadas(respostasLimpas)
          
          // Limpar dados temporários
          localStorage.removeItem(chaveTemp)
        } else {
          console.log('⚠️ [PRE-SALVAMENTO] Nenhum dado temporário encontrado, carregando dados padrão')
          setBriefingData({
            id: paramsData.id,
            nome_projeto: 'Projeto ArcFlow',
            status: 'CONCLUIDO',
            disciplina: 'Arquitetura',
            area: 'Residencial',
            tipologia: 'Casa',
            created_at: new Date().toISOString()
          })
        }
        
        setLoading(false)
        
      } catch (error) {
        console.error('❌ [PRE-SALVAMENTO] Erro ao carregar dados:', error)
        toast.error('Erro ao carregar dados do briefing')
        setLoading(false)
      }
    }

    carregarDados()
  }, [paramsData])

  const handleGerarBriefing = async () => {
    if (!briefingData) return

    setGenerating(true)
    console.log('🚀 [PRE-SALVAMENTO] Gerando briefing final:', briefingData.id)

    try {
      // Simular processo de geração
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('✅ [PRE-SALVAMENTO] Briefing gerado com sucesso!')
      toast.success('Briefing gerado com sucesso!')
      
      // Redirecionar para dashboard do briefing
      router.push(`/briefing/${briefingData.id}`)
      
    } catch (error) {
      console.error('❌ [PRE-SALVAMENTO] Erro ao gerar briefing:', error)
      toast.error('Erro ao gerar briefing')
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do briefing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href={`/briefing/${briefingData?.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Briefing
            </Link>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {briefingData?._isEditMode ? 'Edições Salvas!' : 'Briefing Concluído!'}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {briefingData?._isEditMode 
                  ? 'Suas alterações foram salvas com sucesso no banco de dados.'
                  : 'Todas as informações foram coletadas e salvas.'
                }
              </p>

              {briefingData?._editedData && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-6">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Modo Edição - Alterações Aplicadas</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Resumo do Briefing */}
          {briefingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Resumo do Projeto</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nome do Projeto</p>
                      <p className="font-medium">{briefingData.nome_projeto}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Tipologia</p>
                      <p className="font-medium">{briefingData.tipologia}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Disciplina</p>
                      <p className="font-medium">{briefingData.disciplina}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Área</p>
                      <p className="font-medium">{briefingData.area}</p>
                    </div>
                  </div>
                </div>
              </div>

              {Object.keys(respostasCarregadas).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-2">Respostas Coletadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Object.keys(respostasCarregadas).length} perguntas respondidas
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Ações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Próximos Passos</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleGerarBriefing}
                disabled={generating}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-4 rounded-lg transition-colors font-medium"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Briefing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Gerar Briefing Final
                  </>
                )}
              </button>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </button>
                
                <button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 