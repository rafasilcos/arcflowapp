// SERVIÇO DE CONSULTA CEP - INTEGRAÇÃO VIACEP + GEMINI HÍBRIDO
// Preenchimento automático de endereço + Consulta especializada de zoneamento

import { geminiZoneamentoService, type DadosZoneamentoCompleto, type RelatorioZoneamento } from './geminiZoneamentoService'

interface DadosEndereco {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

interface EnderecoCompleto extends DadosEndereco {
  numero?: string
  complementoAdicional?: string
  coordenadas?: {
    lat: number
    lng: number
  }
  zoneamento?: ZoneamentoInfo
}

interface EnderecoHibrido {
  cep: string
  endereco: string
  numero?: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  coordenadas?: {
    lat: number
    lng: number
  }
  zoneamento?: ZoneamentoInfo
  isCepGeral: boolean
  metodoPreenchimento: 'cep_automatico' | 'endereco_manual'
}

interface ZoneamentoInfo {
  zona: string
  descricao: string
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
  confiabilidade?: 'alta' | 'media' | 'baixa'
  fonte?: string
  metodoConsulta?: 'gemini' | 'simulado'
}

class CepService {
  private readonly VIACEP_URL = 'https://viacep.com.br/ws'
  
  async consultarCep(cep: string): Promise<EnderecoCompleto | null> {
    try {
      // Limpar CEP (remover caracteres especiais)
      const cepLimpo = cep.replace(/\D/g, '')
      
      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos')
      }

      console.log('🔍 Consultando CEP:', cepLimpo)

      // Consultar ViaCEP
      const response = await fetch(`${this.VIACEP_URL}/${cepLimpo}/json/`)
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP')
      }

      const dados: DadosEndereco = await response.json()
      
      if (dados.erro) {
        throw new Error('CEP não encontrado')
      }

      console.log('✅ CEP encontrado:', dados)

      // Buscar coordenadas (opcional)
      const coordenadas = await this.buscarCoordenadas(dados)
      
      // Buscar informações de zoneamento usando Gemini
      const enderecoTexto = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade}, ${dados.uf}`
      const zoneamento = await this.consultarZoneamento(dados, enderecoTexto)

      const enderecoCompleto: EnderecoCompleto = {
        ...dados,
        coordenadas,
        zoneamento
      }

      return enderecoCompleto

    } catch (error) {
      console.error('❌ Erro na consulta CEP:', error)
      return null
    }
  }

  private async buscarCoordenadas(endereco: DadosEndereco): Promise<{lat: number, lng: number} | undefined> {
    try {
      // Usar Nominatim (OpenStreetMap) - gratuito
      const enderecoCompleto = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade}, ${endereco.uf}, Brasil`
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`
      
      const response = await fetch(url)
      const dados = await response.json()
      
      if (dados && dados.length > 0) {
        return {
          lat: parseFloat(dados[0].lat),
          lng: parseFloat(dados[0].lon)
        }
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível obter coordenadas:', error)
    }
    
    return undefined
  }

  private async consultarZoneamento(endereco: DadosEndereco, enderecoCompleto?: string): Promise<ZoneamentoInfo | undefined> {
    try {
      console.log('🏛️ [DEBUG] Iniciando consulta de zoneamento híbrida...')
      console.log('📍 [DEBUG] Dados do endereço:', endereco)
      console.log('📍 [DEBUG] Endereço completo:', enderecoCompleto)
      
      // ESTRATÉGIA HÍBRIDA: Gemini para zoneamento específico
      if (enderecoCompleto) {
        console.log('🤖 [DEBUG] Consultando Gemini para zoneamento específico...')
        
        const consultaGemini: DadosZoneamentoCompleto = {
          endereco: enderecoCompleto,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          uf: endereco.uf,
          cep: endereco.cep
        }
        
        console.log('📤 [DEBUG] Dados enviados para Gemini:', consultaGemini)
        
        const respostaGemini = await geminiZoneamentoService.analisarZoneamento(consultaGemini)
        
        console.log('📥 [DEBUG] Resposta do Gemini:', respostaGemini)
        
        if (respostaGemini) {
          console.log('✅ [DEBUG] Gemini retornou zoneamento válido:', respostaGemini)
          
          return {
            zona: respostaGemini.zona,
            descricao: `Zoneamento identificado via Gemini`,
            parametros: {
              alturaMaxima: respostaGemini.parametros.alturaMaxima,
              recuoFrontal: respostaGemini.parametros.afastamentos.frontal,
              recuoLateral: respostaGemini.parametros.afastamentos.lateral,
              recuoFundos: respostaGemini.parametros.afastamentos.fundos,
              taxaOcupacao: respostaGemini.parametros.taxaOcupacao,
              coeficienteAproveitamento: respostaGemini.parametros.coeficienteAproveitamento
            },
            restricoes: respostaGemini.pontosAtencao,
            observacoes: respostaGemini.analiseEspecialista,
            confiabilidade: respostaGemini.confiabilidade,
            fonte: respostaGemini.fonteConsultada,
            metodoConsulta: 'gemini'
          }
        } else {
          console.log('⚠️ [DEBUG] Gemini retornou null - usando fallback')
        }
      } else {
        console.log('⚠️ [DEBUG] Endereço completo não fornecido - pulando Gemini')
      }
      
      // FALLBACK: Dados simulados se Gemini falhar
      console.log('⚠️ [DEBUG] Usando dados simulados como fallback...')
      console.log('🏙️ [DEBUG] Cidade para busca simulada:', endereco.localidade)
      
      const zoneamentoSimulado = this.getZoneamentoSimulado(endereco.localidade, endereco.uf)
      console.log('📋 [DEBUG] Zoneamento simulado encontrado:', zoneamentoSimulado)
      
      // Verificar se é Garopaba para usar dados pesquisados
      const isGaropaba = endereco.localidade.toLowerCase() === 'garopaba'
      
      return {
        ...zoneamentoSimulado,
        confiabilidade: isGaropaba ? 'media' : 'baixa',
        fonte: isGaropaba 
          ? 'Baseado em pesquisa do Plano Diretor de Garopaba - Verificar com prefeitura' 
          : 'Dados simulados - verificar com prefeitura',
        metodoConsulta: 'simulado'
      }
      
    } catch (error) {
      console.error('❌ [DEBUG] Erro na consulta de zoneamento:', error)
      return undefined
    }
  }

  private getZoneamentoSimulado(cidade: string, uf: string): ZoneamentoInfo {
    // Base de dados com informações reais conhecidas - principais cidades
    const zoneamentos: Record<string, ZoneamentoInfo> = {
      'São Paulo': {
        zona: 'ZM-2 (Zona Mista 2)',
        descricao: 'Zona predominantemente residencial de densidade média',
        parametros: {
          alturaMaxima: '15m (até 4 pavimentos)',
          recuoFrontal: '5m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '50%',
          coeficienteAproveitamento: '2,0'
        },
        restricoes: [
          'Altura máxima 15m',
          'Gabarito máximo 4 pavimentos',
          'Recuos obrigatórios',
          'Taxa de permeabilidade 15%'
        ],
        observacoes: 'Consultar LPUOS atualizada. Possível necessidade de EIV para grandes empreendimentos.'
      },
      'Campinas': {
        zona: 'ZR-3 (Zona Residencial 3)',
        descricao: 'Zona residencial de média densidade',
        parametros: {
          alturaMaxima: '9m (até 2 pavimentos)',
          recuoFrontal: '4m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: 'Não obrigatório',
          taxaOcupacao: '50%',
          coeficienteAproveitamento: '1,0'
        },
        restricoes: [
          'Altura máxima 9m',
          'Máximo 2 pavimentos',
          'Recuo frontal obrigatório',
          'Taxa de permeabilidade 20%'
        ],
        observacoes: 'Verificar se terreno está em condomínio fechado para aprovação adicional.'
      },
      'Ribeirão Preto': {
        zona: 'ZR-2 (Zona Residencial 2)',
        descricao: 'Zona residencial de baixa densidade',
        parametros: {
          alturaMaxima: '7,5m (até 2 pavimentos)',
          recuoFrontal: '5m mínimo',
          recuoLateral: '2m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '40%',
          coeficienteAproveitamento: '0,8'
        },
        restricoes: [
          'Altura máxima 7,5m',
          'Máximo 2 pavimentos',
          'Recuos obrigatórios em todos os lados',
          'Taxa de permeabilidade 25%'
        ],
        observacoes: 'Zona de preservação do caráter residencial. Restrições mais rígidas.'
      },
      
      'Florianópolis': {
        zona: 'ZR-2 (Zona Residencial)',
        descricao: 'Zona residencial com densidade controlada',
        parametros: {
          alturaMaxima: '11m (até 3 pavimentos)',
          recuoFrontal: '4m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '50%',
          coeficienteAproveitamento: '1,2'
        },
        restricoes: [
          'Altura máxima 11m',
          'Máximo 3 pavimentos',
          'Recuos obrigatórios',
          'Taxa de permeabilidade 25%'
        ],
        observacoes: 'Capital com regulamentação específica. Consultar Plano Diretor municipal atualizado.'
      },
      
      // GAROPABA - Dados baseados em pesquisa real do Plano Diretor
      'Garopaba': {
        zona: 'ZM-2 (Zona Mista 2) - Baseado em Plano Diretor',
        descricao: 'Zona mista de densidade média - Bairro Ferraz, Garopaba/SC',
        parametros: {
          alturaMaxima: '9m (até 2 pavimentos)',
          recuoFrontal: '4m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '50%',
          coeficienteAproveitamento: '1,0'
        },
        restricoes: [
          'Altura máxima 9m conforme Plano Diretor',
          'Máximo 2 pavimentos',
          'Recuos obrigatórios',
          'Taxa de permeabilidade 20%',
          'Restrições ambientais costeiras (Linha de Preamar 33m)',
          'Possível necessidade de licenciamento ambiental'
        ],
        observacoes: '⚠️ IMPORTANTE: Dados baseados no Plano Diretor de Garopaba. Bairro Ferraz classificado como ZM-2. Verificar com prefeitura para confirmação oficial e possíveis atualizações da legislação.'
      }
    }

    // Padrões regionais por estado quando cidade não está na base
    const padroesPorEstado: Record<string, ZoneamentoInfo> = {
      'SC': {
        zona: 'ZR (Zona Residencial - Padrão SC)',
        descricao: 'Zona residencial padrão para cidades de Santa Catarina',
        parametros: {
          alturaMaxima: '9m (até 2 pavimentos)',
          recuoFrontal: '4m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '50%',
          coeficienteAproveitamento: '1,0'
        },
        restricoes: [
          'Altura máxima 9m',
          'Máximo 2 pavimentos',
          'Recuos obrigatórios',
          'Taxa de permeabilidade 20%',
          'Possíveis restrições ambientais costeiras'
        ],
        observacoes: 'Padrão típico para cidades de SC. Se próximo ao litoral, verificar restrições da Linha de Preamar (33m).'
      },
      'SP': {
        zona: 'ZR (Zona Residencial - Padrão SP)',
        descricao: 'Zona residencial padrão para cidades do interior de São Paulo',
        parametros: {
          alturaMaxima: '12m (até 3 pavimentos)',
          recuoFrontal: '5m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '60%',
          coeficienteAproveitamento: '1,5'
        },
        restricoes: [
          'Altura máxima 12m',
          'Máximo 3 pavimentos',
          'Recuos obrigatórios',
          'Taxa de permeabilidade 15%'
        ],
        observacoes: 'Padrão para cidades do interior paulista. Consultar Plano Diretor municipal específico.'
      },
      'RJ': {
        zona: 'ZR (Zona Residencial - Padrão RJ)',
        descricao: 'Zona residencial padrão para cidades do Rio de Janeiro',
        parametros: {
          alturaMaxima: '10m (até 3 pavimentos)',
          recuoFrontal: '4m mínimo',
          recuoLateral: '1,5m cada lado',
          recuoFundos: '3m mínimo',
          taxaOcupacao: '50%',
          coeficienteAproveitamento: '1,2'
        },
        restricoes: [
          'Altura máxima 10m',
          'Máximo 3 pavimentos',
          'Recuos obrigatórios',
          'Taxa de permeabilidade 20%'
        ],
        observacoes: 'Padrão para cidades fluminenses. Verificar restrições específicas se em área costeira.'
      }
    }

    // Retornar zoneamento específico, padrão regional ou genérico
    return zoneamentos[cidade] || 
           padroesPorEstado[uf] || 
           {
             zona: 'ZR (Zona Residencial)',
             descricao: 'Zona residencial - consultar Plano Diretor municipal',
             parametros: {
               alturaMaxima: 'Consultar legislação municipal',
               recuoFrontal: 'Consultar legislação municipal',
               recuoLateral: 'Consultar legislação municipal',
               recuoFundos: 'Consultar legislação municipal',
               taxaOcupacao: 'Consultar legislação municipal',
               coeficienteAproveitamento: 'Consultar legislação municipal'
             },
             restricoes: [
               'Parâmetros específicos conforme Plano Diretor',
               'Consultar prefeitura local'
             ],
             observacoes: `Consultar Plano Diretor de ${cidade}/${uf} para parâmetros específicos.`
           }
  }

  formatarCep(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`
    }
    return cep
  }

  validarCep(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '')
    return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo)
  }

  isCepGeral(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '')
    // CEPs que terminam em 000 geralmente são CEPs gerais de cidade pequena
    return cepLimpo.endsWith('000')
  }

  async buscarEnderecoCompleto(endereco: string, cidade: string, uf: string): Promise<{lat: number, lng: number} | undefined> {
    try {
      // Busca mais específica para endereços completos
      const enderecoCompleto = `${endereco}, ${cidade}, ${uf}, Brasil`
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1&addressdetails=1`
      
      console.log('🔍 Buscando coordenadas para:', enderecoCompleto)
      
      const response = await fetch(url)
      const dados = await response.json()
      
      if (dados && dados.length > 0) {
        console.log('✅ Coordenadas encontradas:', dados[0])
        return {
          lat: parseFloat(dados[0].lat),
          lng: parseFloat(dados[0].lon)
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro na busca de coordenadas específicas:', error)
    }
    
    return undefined
  }

  async processarEnderecoHibrido(dados: {
    cep: string
    endereco?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    uf?: string
  }): Promise<EnderecoHibrido | null> {
    try {
      const isCepGeral = this.isCepGeral(dados.cep)
      
      if (!isCepGeral) {
        // CEP específico - preenchimento automático
        const enderecoCompleto = await this.consultarCep(dados.cep)
        
        if (!enderecoCompleto) {
          return null
        }

        return {
          cep: enderecoCompleto.cep,
          endereco: enderecoCompleto.logradouro,
          numero: dados.numero,
          complemento: dados.complemento || enderecoCompleto.complemento,
          bairro: enderecoCompleto.bairro,
          cidade: enderecoCompleto.localidade,
          uf: enderecoCompleto.uf,
          coordenadas: enderecoCompleto.coordenadas,
          zoneamento: enderecoCompleto.zoneamento,
          isCepGeral: false,
          metodoPreenchimento: 'cep_automatico'
        }
      } else {
        // CEP geral - preenchimento manual obrigatório
        if (!dados.endereco || !dados.bairro || !dados.cidade || !dados.uf) {
          throw new Error('Para CEP geral, endereço completo é obrigatório')
        }

        // Buscar coordenadas específicas
        const coordenadas = await this.buscarEnderecoCompleto(
          `${dados.endereco}${dados.numero ? ', ' + dados.numero : ''}`,
          dados.cidade,
          dados.uf
        )

        // Buscar zoneamento usando Gemini para endereço específico
        const enderecoCompleto = `${dados.endereco}${dados.numero ? ', ' + dados.numero : ''}, ${dados.bairro}, ${dados.cidade}, ${dados.uf}`
        const zoneamento = await this.consultarZoneamento({
          cep: dados.cep,
          logradouro: dados.endereco,
          bairro: dados.bairro,
          localidade: dados.cidade,
          uf: dados.uf,
          complemento: '',
          ibge: '',
          gia: '',
          ddd: '',
          siafi: ''
        }, enderecoCompleto)

        return {
          cep: dados.cep,
          endereco: dados.endereco,
          numero: dados.numero,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          uf: dados.uf,
          coordenadas,
          zoneamento,
          isCepGeral: true,
          metodoPreenchimento: 'endereco_manual'
        }
      }
    } catch (error) {
      console.error('❌ Erro no processamento híbrido:', error)
      return null
    }
  }
}

export const cepService = new CepService()
export type { EnderecoHibrido, EnderecoCompleto, ZoneamentoInfo } 