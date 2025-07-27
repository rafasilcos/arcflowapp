// SERVIÇO GEMINI - ESPECIALISTA EM ZONEAMENTO E VIABILIDADE URBANA
// Análise completa baseada em legislação municipal oficial

interface DadosZoneamentoCompleto {
  endereco: string
  numero?: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  inscricaoImobiliaria?: string
  tipoEmpreendimento?: string
  areaTerreno?: number
}

interface RelatorioZoneamento {
  zona: string
  nomeZona: string
  parametros: {
    usosPermitidos: string[]
    coeficienteAproveitamento: string
    taxaOcupacao: string
    numeroMaximoPavimentos: string
    alturaMaxima: string
    afastamentos: {
      frontal: string
      lateral: string
      fundos: string
    }
    taxaPermeabilidade: string
  }
  analiseEspecialista: string
  pontosAtencao: string[]
  recomendacoes: string[]
  fonteConsultada: string
  confiabilidade: 'alta' | 'media' | 'baixa'
  relatorioCompleto: string // Markdown completo
}

class GeminiZoneamentoService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCCAbqc_AatCjL2LkQiR8Hcpr8Rx028eSs'
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  
  async analisarZoneamento(dados: DadosZoneamentoCompleto): Promise<RelatorioZoneamento | null> {
    try {
      console.log('🏛️ [GEMINI] Iniciando análise completa de zoneamento...', dados)
      
      const prompt = this.criarPromptProfissional(dados)
      console.log('📝 [GEMINI] Prompt profissional gerado')
      
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          }
        })
      })

      if (!response.ok) {
        console.error('❌ [GEMINI] Erro na API:', response.status)
        return null
      }

      const result = await response.json()
      const relatorio = result.candidates[0].content.parts[0].text
      
      console.log('✅ [GEMINI] Análise recebida, processando...')
      
      return this.processarRelatorioCompleto(relatorio, dados)
      
    } catch (error) {
      console.error('❌ [GEMINI] Erro na análise:', error)
      return null
    }
  }
  
  private criarPromptProfissional(dados: DadosZoneamentoCompleto): string {
    const enderecoCompleto = `${dados.endereco}${dados.numero ? ', ' + dados.numero : ''}, ${dados.bairro}, ${dados.cidade}/${dados.uf}`
    
    return `
Aja como meu especialista técnico sênior em urbanismo e legislação municipal brasileira. Seu objetivo é realizar uma análise de viabilidade construtiva através de CRUZAMENTO DE DADOS entre múltiplas fontes oficiais para QUALQUER município do Brasil.

**DADOS DO TERRENO:**
${enderecoCompleto}
CEP: ${dados.cep}
${dados.inscricaoImobiliaria ? `Inscrição Imobiliária: ${dados.inscricaoImobiliaria}` : ''}
${dados.tipoEmpreendimento ? `Tipo de Empreendimento: ${dados.tipoEmpreendimento}` : ''}
${dados.areaTerreno ? `Área do Terreno: ${dados.areaTerreno}m²` : ''}

**ESTRATÉGIA DE BUSCA UNIVERSAL (EXECUTE EM ORDEM):**

**ETAPA 1: IDENTIFICAÇÃO DO MUNICÍPIO**
- Nome da cidade: ${dados.cidade}
- Estado (sigla): ${dados.uf}
- Bairro: ${dados.bairro}
- CEP: ${dados.cep}

**NÍVEL 1: LEIS MUNICIPAIS (FONTE PRIMÁRIA)**
Execute estas buscas genéricas no site leismunicipais.com.br:
1.1) "plano diretor ${dados.cidade}" site:leismunicipais.com.br
1.2) "zoneamento ${dados.cidade} ${dados.uf}" site:leismunicipais.com.br
1.3) "uso ocupação solo ${dados.cidade}" site:leismunicipais.com.br
1.4) "código obras ${dados.cidade}" site:leismunicipais.com.br
1.5) "lei complementar ${dados.cidade} zoneamento" site:leismunicipais.com.br

**NÍVEL 2: PREFEITURA OFICIAL (FONTE SECUNDÁRIA)**
Construa a URL da prefeitura: ${dados.cidade.toLowerCase()}.${dados.uf.toLowerCase()}.gov.br
Execute estas buscas:
2.1) "plano diretor" site:${dados.cidade.toLowerCase()}.${dados.uf.toLowerCase()}.gov.br
2.2) "zoneamento" site:${dados.cidade.toLowerCase()}.${dados.uf.toLowerCase()}.gov.br
2.3) "mapa zoneamento" site:${dados.cidade.toLowerCase()}.${dados.uf.toLowerCase()}.gov.br

**ANÁLISE INTELIGENTE:**
1. Identifique se é legislação vigente (não revogada)
2. Procure por mapas de zoneamento em anexos
3. Localize tabelas de parâmetros urbanísticos
4. Identifique as zonas existentes no município
5. Procure pelo bairro específico: ${dados.bairro}

**LOCALIZAÇÃO DO ENDEREÇO:**
1. Identifique o bairro ${dados.bairro} em ${dados.cidade}
2. Procure referências à rua: ${dados.endereco}
3. Determine qual zona se aplica ao endereço
4. Se não conseguir localizar exatamente, indique a zona mais provável

**RELATÓRIO TÉCNICO:**

# ANÁLISE DE VIABILIDADE CONSTRUTIVA
## ${enderecoCompleto}

### 1. IDENTIFICAÇÃO DO MUNICÍPIO
- **Município:** ${dados.cidade}, ${dados.uf}
- **Região:** [se identificável]

### 2. FONTES CONSULTADAS E RESULTADOS
| Nível | Tipo de Fonte | Status | Informações Encontradas |
|-------|---------------|--------|------------------------|
| 1 | Leis Municipais | ✅/❌ | [descreva o que encontrou] |
| 2 | Site Oficial da Prefeitura | ✅/❌ | [descreva o que encontrou] |

### 3. LEGISLAÇÃO IDENTIFICADA
- **Lei principal:** [número, ano e ementa]
- **Leis complementares:** [se houver]
- **Status:** [vigente/em revisão]
- **Fonte:** [link do documento]

### 4. ZONEAMENTO IDENTIFICADO
- **Zona aplicável:** [SIGLA] - [Nome Completo da Zona]
- **Método de identificação:** [mapa/texto/dedução]
- **Confiabilidade:** [alta/média/baixa]
- **Observações:** [se houve dificuldades na localização]

### 5. PARÂMETROS URBANÍSTICOS
| Parâmetro | Valor | Artigo/Fonte | Observações |
|-----------|-------|--------------|-------------|
| Taxa de Ocupação | X% | Art. X | |
| Coeficiente de Aproveitamento | X,X | Art. X | |
| Gabarito Máximo | X pav/m | Art. X | |
| Recuo Frontal | X m | Art. X | |
| Recuo Lateral | X m | Art. X | |
| Recuo de Fundo | X m | Art. X | |
| Taxa de Permeabilidade | X% | Art. X | |

### 6. USOS PERMITIDOS
- [Lista extraída da legislação para a zona específica]

### 7. CONCLUSÃO TÉCNICA
**Confiabilidade da análise:** [Alta/Média/Baixa]
**Viabilidade construtiva:** [Viável/Viável com restrições/Necessita confirmação]
**Limitações da análise:** [o que não foi possível determinar]

### 8. RECOMENDAÇÕES
- [Próximos passos para confirmação]
- [Contatos sugeridos na prefeitura]

### 9. FONTES CONSULTADAS
- [Lista completa com links e datas de acesso]

**INSTRUÇÕES CRÍTICAS:**
- NUNCA assuma leis específicas - sempre busque genericamente
- SEMPRE tente todas as estratégias antes de concluir
- Se não encontrar informação específica, seja CLARO sobre as limitações
- PRIORIZE fontes oficiais mais recentes
- Se a localização exata for impossível, indique a zona mais provável
- DOCUMENTE todo o processo de busca realizado

Execute esta análise universal agora para o endereço fornecido.
`
  }
  
  private processarRelatorioCompleto(relatorio: string, dados: DadosZoneamentoCompleto): RelatorioZoneamento {
    // Extrair informações estruturadas do relatório Markdown
    const zona = this.extrairZona(relatorio)
    const parametros = this.extrairParametros(relatorio)
    const analise = this.extrairAnalise(relatorio)
    const pontos = this.extrairPontosAtencao(relatorio)
    const recomendacoes = this.extrairRecomendacoes(relatorio)
    
    return {
      zona: zona.sigla,
      nomeZona: zona.nome,
      parametros: {
        usosPermitidos: parametros.usos,
        coeficienteAproveitamento: parametros.ca,
        taxaOcupacao: parametros.to,
        numeroMaximoPavimentos: parametros.pavimentos,
        alturaMaxima: parametros.altura,
        afastamentos: {
          frontal: parametros.recuoFrontal,
          lateral: parametros.recuoLateral,
          fundos: parametros.recuoFundos
        },
        taxaPermeabilidade: parametros.permeabilidade
      },
      analiseEspecialista: analise,
      pontosAtencao: pontos,
      recomendacoes: recomendacoes,
      fonteConsultada: `Plano Diretor de ${dados.cidade}/${dados.uf}`,
      confiabilidade: this.avaliarConfiabilidade(relatorio),
      relatorioCompleto: relatorio
    }
  }
  
  private extrairZona(relatorio: string): { sigla: string, nome: string } {
    const match = relatorio.match(/\*\*Zona Identificada:\*\*\s*([A-Z0-9-]+)\s*-\s*(.+)/i)
    if (match) {
      return { sigla: match[1].trim(), nome: match[2].trim() }
    }
    return { sigla: 'Não identificada', nome: 'Consultar Plano Diretor' }
  }
  
  private extrairParametros(relatorio: string): any {
    // Implementar extração dos parâmetros da tabela Markdown
    return {
      usos: ['Consultar Plano Diretor'],
      ca: 'Consultar Plano Diretor',
      to: 'Consultar Plano Diretor',
      pavimentos: 'Consultar Plano Diretor',
      altura: 'Consultar Plano Diretor',
      recuoFrontal: 'Consultar Plano Diretor',
      recuoLateral: 'Consultar Plano Diretor',
      recuoFundos: 'Consultar Plano Diretor',
      permeabilidade: 'Consultar Plano Diretor'
    }
  }
  
  private extrairAnalise(relatorio: string): string {
    const match = relatorio.match(/### Potencial Construtivo[^#]*?\n(.+?)(?=###|$)/)
    return match ? match[1].trim() : 'Análise detalhada disponível no relatório completo'
  }
  
  private extrairPontosAtencao(relatorio: string): string[] {
    const match = relatorio.match(/### Principais Pontos de Atenção[^#]*?\n((?:- .+\n?)+)/)
    if (match) {
      return match[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
    }
    return ['Verificar com prefeitura local']
  }
  
  private extrairRecomendacoes(relatorio: string): string[] {
    const match = relatorio.match(/### Recomendações Técnicas[^#]*?\n((?:- .+\n?)+)/)
    if (match) {
      return match[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
    }
    return ['Consultar Secretaria de Planejamento Urbano']
  }
  
  private avaliarConfiabilidade(relatorio: string): 'alta' | 'media' | 'baixa' {
    if (relatorio.includes('Consultar Plano Diretor municipal') || relatorio.includes('não souber')) {
      return 'baixa'
    }
    if (relatorio.includes('Lei nº') && relatorio.includes('Plano Diretor')) {
      return 'alta'
    }
    return 'media'
  }
}

export const geminiZoneamentoService = new GeminiZoneamentoService()
export type { DadosZoneamentoCompleto, RelatorioZoneamento } 