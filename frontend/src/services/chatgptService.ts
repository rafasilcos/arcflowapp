// SERVIÇO CHATGPT - ESPECIALISTA EM LEGISLAÇÃO URBANA
// Consulta específica para zoneamento e Planos Diretores

interface ConsultaZoneamento {
  endereco: string
  cidade: string
  uf: string
  cep?: string
}

interface RespostaZoneamento {
  zoneamento: string
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
  confiabilidade: 'alta' | 'media' | 'baixa'
  fonte: string
}

class ChatGPTLegislacaoService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions'

  async consultarZoneamento(dados: ConsultaZoneamento): Promise<RespostaZoneamento | null> {
    try {
      console.log('🏛️ [DEBUG] Iniciando consulta ChatGPT...', dados)
      console.log('🔑 [DEBUG] API Key configurada:', this.API_KEY ? 'SIM' : 'NÃO')
      console.log('🔑 [DEBUG] API Key primeiros chars:', this.API_KEY ? this.API_KEY.substring(0, 10) + '...' : 'VAZIA')

      if (!this.API_KEY) {
        console.error('❌ [DEBUG] API Key do OpenAI não configurada!')
        return null
      }

      const prompt = this.criarPromptZoneamento(dados)
      console.log('📝 [DEBUG] Prompt gerado:', prompt.substring(0, 200) + '...')
      
      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Você é um especialista em legislação urbana brasileira e Planos Diretores municipais. Sua especialidade é identificar zoneamentos específicos baseados em endereços exatos.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.3,
        max_tokens: 1000
      }
      
      console.log('📤 [DEBUG] Enviando request para OpenAI...', {
        url: this.API_URL,
        model: requestBody.model,
        messagesCount: requestBody.messages.length
      })
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('📥 [DEBUG] Response status:', response.status)
      console.log('📥 [DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [DEBUG] Erro na API ChatGPT:', response.status, errorText)
        throw new Error(`Erro na API ChatGPT: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('📋 [DEBUG] Response completa:', result)
      
      const textoResposta = result.choices[0].message.content
      console.log('✅ [DEBUG] Resposta ChatGPT recebida:', textoResposta)

      const respostaProcessada = this.processarRespostaZoneamento(textoResposta)
      console.log('🔄 [DEBUG] Resposta processada:', respostaProcessada)
      
      return respostaProcessada

    } catch (error) {
      console.error('❌ [DEBUG] Erro completo na consulta ChatGPT:', error)
      return null
    }
  }

  private criarPromptZoneamento(dados: ConsultaZoneamento): string {
    return `
CONSULTA ESPECÍFICA DE ZONEAMENTO URBANO:

ENDEREÇO PARA ANÁLISE:
- Endereço: ${dados.endereco}
- Cidade: ${dados.cidade}
- Estado: ${dados.uf}
${dados.cep ? `- CEP: ${dados.cep}` : ''}

INSTRUÇÕES ESPECÍFICAS:
1. Consulte seu conhecimento sobre o Plano Diretor de ${dados.cidade}/${dados.uf}
2. Identifique o ZONEAMENTO ESPECÍFICO para este endereço exato
3. Forneça os parâmetros urbanísticos aplicáveis
4. Seja TRANSPARENTE sobre o nível de confiabilidade da informação

FORMATO DE RESPOSTA OBRIGATÓRIO:
{
  "zoneamento": "ZM-2" (ou ZR-3, ZC-1, etc. - código exato),
  "parametros": {
    "alturaMaxima": "valor específico em metros",
    "recuoFrontal": "valor em metros",
    "recuoLateral": "valor em metros", 
    "recuoFundos": "valor em metros",
    "taxaOcupacao": "percentual",
    "coeficienteAproveitamento": "valor decimal"
  },
  "restricoes": ["lista de restrições específicas"],
  "observacoes": "informações importantes sobre este zoneamento",
  "confiabilidade": "alta/media/baixa",
  "fonte": "Plano Diretor de [Cidade] ou fonte consultada"
}

IMPORTANTE: 
- Se você CONHECE o zoneamento específico, forneça com confiabilidade "alta"
- Se você tem informação geral da região, use confiabilidade "media"  
- Se você NÃO tem certeza, use confiabilidade "baixa" e seja honesto
- SEMPRE recomende verificação com a prefeitura para projetos reais

Responda APENAS com o JSON estruturado acima.
`
  }

  private processarRespostaZoneamento(texto: string): RespostaZoneamento | null {
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = texto.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('JSON não encontrado na resposta')
      }

      const dados = JSON.parse(jsonMatch[0])
      
      return {
        zoneamento: dados.zoneamento || 'Não identificado',
        parametros: dados.parametros || {
          alturaMaxima: 'Consultar prefeitura',
          recuoFrontal: 'Consultar prefeitura',
          recuoLateral: 'Consultar prefeitura',
          recuoFundos: 'Consultar prefeitura',
          taxaOcupacao: 'Consultar prefeitura',
          coeficienteAproveitamento: 'Consultar prefeitura'
        },
        restricoes: dados.restricoes || ['Verificar com prefeitura local'],
        observacoes: dados.observacoes || 'Consultar Plano Diretor municipal atualizado',
        confiabilidade: dados.confiabilidade || 'baixa',
        fonte: dados.fonte || 'Conhecimento geral'
      }
    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error)
      return null
    }
  }
}

export const chatgptLegislacaoService = new ChatGPTLegislacaoService()
export type { ConsultaZoneamento, RespostaZoneamento } 