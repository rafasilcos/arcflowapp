'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { geminiService, DadosBriefing, AnaliseIA as AnaliseIAType } from '@/services/geminiService'
import AnaliseIAComponent from '@/components/briefing/AnaliseIA'

// Interface para compatibilidade com o componente existente
interface DadosBriefingLegacy {
  tipologia: string
  area: number
  orcamento: number
  prazo: number
  complexidade: number
  caracteristicas: string[]
  localizacao: string
  sustentabilidade?: boolean
  piscina?: boolean
  leed?: boolean
  zoneamento?: {
    zona: string
    parametros: {
      alturaMaxima: string
      recuoFrontal: string
      recuoLateral: string
      recuoFundos: string
      taxaOcupacao: string
      coeficienteAproveitamento: string
    }
    restricoes: string[]
    observacoes: string
  }
}

interface AnaliseIAProps {
  dadosBriefing: DadosBriefingLegacy
  onAnaliseCompleta?: (resultado: any) => void
}

export default function AnaliseIA({ dadosBriefing, onAnaliseCompleta }: AnaliseIAProps) {
  const [analise, setAnalise] = useState<AnaliseIAType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const executarAnaliseIA = async () => {
      try {
        setIsLoading(true)
        setErro(null)

        // Converter dados para o formato esperado pela IA
        const dadosIA: DadosBriefing = {
          tipologia: dadosBriefing.tipologia,
          orcamentoTotal: dadosBriefing.orcamento,
          prazoDesejado: `${dadosBriefing.prazo} meses`,
          area: dadosBriefing.area,
          complexidade: dadosBriefing.complexidade,
          respostas: {
            caracteristicas: dadosBriefing.caracteristicas,
            sustentabilidade: dadosBriefing.sustentabilidade,
            piscina: dadosBriefing.piscina,
            leed: dadosBriefing.leed
          },
          localizacao: dadosBriefing.localizacao,
          caracteristicas: dadosBriefing.caracteristicas,
          zoneamento: dadosBriefing.zoneamento
        }

        console.log('🚀 Iniciando análise IA real...', dadosIA)

        // Chamar a IA real do Google Gemini
        const resultado = await geminiService.analisarBriefing(dadosIA)
        
        console.log('✅ Análise IA concluída:', resultado)
        
        setAnalise(resultado)
        
        // Callback para compatibilidade
        onAnaliseCompleta?.(resultado)

      } catch (error) {
        console.error('❌ Erro na análise IA:', error)
        setErro('Erro ao processar análise IA. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    executarAnaliseIA()
  }, [dadosBriefing])

  // Tela de erro
  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              ❌ Erro na Análise IA
            </h2>
            <p className="text-slate-600 mb-6">
              {erro}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Usar nosso componente de análise IA
  return (
    <AnaliseIAComponent 
      analise={analise!} 
      isLoading={isLoading}
    />
  )
} 