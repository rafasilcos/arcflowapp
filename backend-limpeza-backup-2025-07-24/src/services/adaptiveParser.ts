/**
 * ADAPTIVE PARSER - ARCFLOW
 * 
 * Parser adaptativo para interpretar briefings personalizados e mapear
 * campos para dados estruturados. Funciona com qualquer estrutura de briefing.
 * 
 * Características:
 * - Análise semântica de perguntas e respostas
 * - Mapeamento automático de campos
 * - Inferência inteligente de dados faltantes
 * - Validação de dados mínimos
 * - Sugestões de melhorias
 */

import { DadosExtraidos, BriefingAnalysisEngine } from './briefingAnalysisEngine';

export interface CampoMapeamento {
  campo: string;
  tipo: 'area' | 'tipologia' | 'complexidade' | 'disciplina' | 'prazo' | 'orcamento' | 'localizacao';
  peso: number;
  confianca: number;
  regrasExtracao: RegrasExtracao[];
  valorExtraido?: any;
}

export interface RegrasExtracao {
  padrao: RegExp;
  transformacao?: (valor: string) => any;
  validacao?: (valor: any) => boolean;
  peso: number;
}

export interface ResultadoMapeamento {
  camposMapeados: CampoMapeamento[];
  dadosExtraidos: Partial<DadosExtraidos>;
  confiancaGeral: number;
  sugestoesMelhoria: string[];
  camposNaoMapeados: string[];
}

export interface ConfiguracaoParser {
  limiteConfiancaMinima: number;
  usarInferencia: boolean;
  incluirSugestoes: boolean;
  modoDebug: boolean;
}

export class AdaptiveParser {
  private readonly analysisEngine: BriefingAnalysisEngine;
  private readonly configuracao: ConfiguracaoParser;
  
  // Regras de mapeamento por tipo de campo
  private readonly regrasMapeamento = {
    area: {
      construida: [
        {
          padrao: /(?:área|area)\s*(?:construída|construida|de\s*construção)/i,
          peso: 0.9
        },
        {
          padrao: /(?:tamanho|dimensão)\s*(?:da\s*)?(?:casa|construção)/i,
          peso: 0.7
        },
        {
          padrao: /quantos\s*m[²2]?\s*(?:vai\s*ter|terá|possui)/i,
          peso: 0.8
        }
      ],
      terreno: [
        {
          padrao: /(?:área|area)\s*(?:do\s*)?terreno/i,
          peso: 0.9
        },
        {
          padrao: /(?:tamanho|dimensão)\s*(?:do\s*)?lote/i,
          peso: 0.8
        }
      ]
    },
    tipologia: [
      {
        padrao: /(?:tipo|categoria)\s*(?:de\s*)?(?:projeto|construção|edificação)/i,
        peso: 0.9
      },
      {
        padrao: /(?:finalidade|uso)\s*(?:do\s*)?(?:projeto|imóvel)/i,
        peso: 0.8
      },
      {
        padrao: /(?:o\s*que|qual)\s*(?:tipo|categoria)/i,
        peso: 0.7
      }
    ],
    complexidade: [
      {
        padrao: /(?:padrão|qualidade|nível)\s*(?:do\s*)?(?:projeto|acabamento)/i,
        peso: 0.8
      },
      {
        padrao: /(?:simples|médio|alto|luxo|premium)/i,
        peso: 0.9
      }
    ],
    disciplina: [
      {
        padrao: /(?:disciplinas?|especialidades?)\s*(?:necessárias?|envolvidas?)/i,
        peso: 0.9
      },
      {
        padrao: /(?:projetos?|serviços?)\s*(?:complementares?|adicionais?)/i,
        peso: 0.7
      }
    ],
    orcamento: [
      {
        padrao: /(?:orçamento|budget|valor|custo)\s*(?:disponível|total|máximo)/i,
        peso: 0.9
      },
      {
        padrao: /(?:quanto|valor)\s*(?:pretende|pode)\s*(?:investir|gastar)/i,
        peso: 0.8
      }
    ],
    prazo: [
      {
        padrao: /(?:prazo|tempo|cronograma)\s*(?:desejado|necessário|limite)/i,
        peso: 0.9
      },
      {
        padrao: /(?:quando|até\s*quando)\s*(?:precisa|quer|deseja)/i,
        peso: 0.7
      }
    ],
    localizacao: [
      {
        padrao: /(?:localização|local|endereço|cidade)/i,
        peso: 0.8
      },
      {
        padrao: /(?:onde|em\s*que\s*cidade|região)/i,
        peso: 0.7
      }
    ]
  };
  
  // Padrões para extração de valores das respostas
  private readonly padroesExtracao = {
    area: [
      {
        padrao: /(\d+(?:\.\d+)?)\s*m[²2]?/i,
        transformacao: (valor: string) => parseFloat(valor),
        validacao: (valor: number) => valor > 0 && valor < 100000,
        peso: 0.9
      }
    ],
    valor: [
      {
        padrao: /r?\$?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i,
        transformacao: (valor: string) => parseFloat(valor.replace(/\./g, '').replace(',', '.')),
        validacao: (valor: number) => valor > 0,
        peso: 0.8
      }
    ],
    prazo: [
      {
        padrao: /(\d+)\s*(?:meses?|mês)/i,
        transformacao: (valor: string) => parseInt(valor),
        validacao: (valor: number) => valor > 0 && valor <= 60,
        peso: 0.9
      }
    ]
  };
  
  constructor(configuracao: Partial<ConfiguracaoParser> = {}) {
    this.configuracao = {
      limiteConfiancaMinima: 0.6,
      usarInferencia: true,
      incluirSugestoes: true,
      modoDebug: false,
      ...configuracao
    };
    
    this.analysisEngine = new BriefingAnalysisEngine();
  }
  
  /**
   * Analisa um briefing personalizado e extrai dados estruturados
   */
  async parseCustomBriefing(briefingData: any): Promise<DadosExtraidos> {
    console.log('🔄 Iniciando análise de briefing personalizado...');
    
    try {
      // 1. Mapear campos do briefing
      const mapeamento = await this.mapearCampos(briefingData);
      
      // 2. Extrair dados dos campos mapeados
      const dadosExtraidos = await this.extrairDadosMapeados(mapeamento, briefingData);
      
      // 3. Aplicar inferência para dados faltantes
      if (this.configuracao.usarInferencia) {
        await this.aplicarInferencia(dadosExtraidos, briefingData);
      }
      
      // 4. Validar dados mínimos
      this.validarDadosMinimos(dadosExtraidos);
      
      // 5. Usar o Analysis Engine para completar a análise
      const analiseCompleta = await this.analysisEngine.analisarBriefing({
        ...briefingData,
        dadosExtraidos
      });
      
      console.log('✅ Análise de briefing personalizado concluída');
      
      return analiseCompleta;
      
    } catch (error) {
      console.error('❌ Erro na análise do briefing personalizado:', error);
      throw new Error(`Falha no parsing do briefing personalizado: ${error.message}`);
    }
  }
  
  /**
   * Mapeia campos do briefing personalizado para tipos conhecidos
   */
  async mapearCampos(briefingData: any): Promise<ResultadoMapeamento> {
    const camposMapeados: CampoMapeamento[] = [];
    const camposNaoMapeados: string[] = [];
    
    // Extrair perguntas do briefing
    const perguntas = this.extrairPerguntas(briefingData);
    
    for (const pergunta of perguntas) {
      const mapeamento = this.identificarTipoCampo(pergunta);
      
      if (mapeamento.confianca >= this.configuracao.limiteConfiancaMinima) {
        camposMapeados.push(mapeamento);
      } else {
        camposNaoMapeados.push(pergunta.texto || pergunta.titulo || 'Campo não identificado');
      }
    }
    
    // Calcular confiança geral
    const confiancaGeral = camposMapeados.length > 0 
      ? camposMapeados.reduce((acc, campo) => acc + campo.confianca, 0) / camposMapeados.length
      : 0;
    
    // Gerar sugestões
    const sugestoesMelhoria = this.configuracao.incluirSugestoes 
      ? this.gerarSugestoesMelhoria(camposMapeados, camposNaoMapeados)
      : [];
    
    return {
      camposMapeados,
      dadosExtraidos: {},
      confiancaGeral,
      sugestoesMelhoria,
      camposNaoMapeados
    };
  }
  
  /**
   * Identifica campos de área em briefings personalizados
   */
  identificarCamposArea(campos: any[]): { construida?: number; terreno?: number } {
    const resultado: { construida?: number; terreno?: number } = {};
    
    for (const campo of campos) {
      const texto = (campo.pergunta || campo.titulo || '').toLowerCase();
      const resposta = (campo.resposta || campo.valor || '').toLowerCase();
      
      // Verificar se é área construída
      if (this.regrasMapeamento.area.construida.some(regra => regra.padrao.test(texto))) {
        const area = this.extrairValorNumerico(resposta, 'area');
        if (area) resultado.construida = area;
      }
      
      // Verificar se é área do terreno
      if (this.regrasMapeamento.area.terreno.some(regra => regra.padrao.test(texto))) {
        const area = this.extrairValorNumerico(resposta, 'area');
        if (area) resultado.terreno = area;
      }
    }
    
    return resultado;
  }
  
  /**
   * Identifica tipologia em briefings personalizados
   */
  identificarTipologia(respostas: any[]): string {
    const textoCompleto = respostas
      .map(r => `${r.pergunta || ''} ${r.resposta || ''}`)
      .join(' ')
      .toLowerCase();
    
    // Usar o Analysis Engine para identificar tipologia
    const tipologia = this.analysisEngine.identificarCamposRelevantes({ texto: textoCompleto });
    
    return tipologia.tipologia[0] || 'RESIDENCIAL';
  }
  
  /**
   * Infere complexidade baseada nas respostas
   */
  inferirComplexidade(respostas: any[]): 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA' {
    let scoreComplexidade = 0;
    let totalIndicadores = 0;
    
    const indicadoresComplexidade = {
      alta: ['luxo', 'premium', 'sofisticado', 'exclusivo', 'personalizado', 'importado'],
      media: ['padrão', 'qualidade', 'bom', 'moderno', 'contemporâneo'],
      baixa: ['simples', 'básico', 'econômico', 'popular', 'mínimo']
    };
    
    const textoCompleto = respostas
      .map(r => `${r.resposta || r.valor || ''}`)
      .join(' ')
      .toLowerCase();
    
    // Calcular score baseado em palavras-chave
    for (const [nivel, palavras] of Object.entries(indicadoresComplexidade)) {
      const count = palavras.filter(palavra => textoCompleto.includes(palavra)).length;
      
      if (count > 0) {
        totalIndicadores++;
        switch (nivel) {
          case 'alta': scoreComplexidade += 0.8; break;
          case 'media': scoreComplexidade += 0.5; break;
          case 'baixa': scoreComplexidade += 0.2; break;
        }
      }
    }
    
    const complexidadeMedia = totalIndicadores > 0 ? scoreComplexidade / totalIndicadores : 0.5;
    
    if (complexidadeMedia >= 0.8) return 'MUITO_ALTA';
    if (complexidadeMedia >= 0.6) return 'ALTA';
    if (complexidadeMedia >= 0.4) return 'MEDIA';
    return 'BAIXA';
  }
  
  /**
   * Valida se os dados mínimos necessários estão presentes
   */
  validarDadosMinimos(dados: Partial<DadosExtraidos>): void {
    const camposObrigatorios = ['tipologia'];
    const camposFaltantes = camposObrigatorios.filter(campo => !dados[campo as keyof DadosExtraidos]);
    
    if (camposFaltantes.length > 0) {
      console.warn('⚠️ Campos obrigatórios faltantes:', camposFaltantes);
      // Não lançar erro, apenas avisar
    }
    
    // Validações específicas
    if (dados.areaConstruida && (dados.areaConstruida <= 0 || dados.areaConstruida > 100000)) {
      console.warn('⚠️ Área construída fora dos limites razoáveis:', dados.areaConstruida);
      delete dados.areaConstruida;
    }
    
    if (dados.orcamentoDisponivel && dados.orcamentoDisponivel <= 0) {
      console.warn('⚠️ Orçamento inválido:', dados.orcamentoDisponivel);
      delete dados.orcamentoDisponivel;
    }
  }
  
  // ===== MÉTODOS PRIVADOS =====
  
  private extrairPerguntas(briefingData: any): any[] {
    const perguntas = [];
    
    // Estrutura padrão com respostas
    if (briefingData.respostas) {
      for (const resposta of briefingData.respostas) {
        if (resposta.pergunta) {
          perguntas.push({
            texto: resposta.pergunta.titulo || resposta.pergunta.texto,
            resposta: resposta.resposta,
            tipo: resposta.pergunta.tipo
          });
        }
      }
    }
    
    // Estrutura personalizada
    if (briefingData.estruturaBriefing) {
      const estrutura = briefingData.estruturaBriefing;
      
      if (Array.isArray(estrutura)) {
        perguntas.push(...estrutura.map(item => ({
          texto: item.pergunta || item.titulo || item.label,
          resposta: item.resposta || item.valor || item.value,
          tipo: item.tipo || item.type
        })));
      } else if (typeof estrutura === 'object') {
        for (const [chave, valor] of Object.entries(estrutura)) {
          perguntas.push({
            texto: chave,
            resposta: valor,
            tipo: 'texto'
          });
        }
      }
    }
    
    // Campos diretos do briefing
    if (briefingData.perguntas) {
      perguntas.push(...briefingData.perguntas.map((p: any) => ({
        texto: p.titulo || p.texto,
        resposta: p.resposta || '',
        tipo: p.tipo
      })));
    }
    
    return perguntas.filter(p => p.texto && p.texto.trim().length > 0);
  }
  
  private identificarTipoCampo(pergunta: any): CampoMapeamento {
    const texto = (pergunta.texto || '').toLowerCase();
    let melhorMatch: CampoMapeamento = {
      campo: pergunta.texto,
      tipo: 'area', // default
      peso: 0,
      confianca: 0,
      regrasExtracao: []
    };
    
    // Testar cada tipo de campo
    for (const [tipo, regras] of Object.entries(this.regrasMapeamento)) {
      if (Array.isArray(regras)) {
        for (const regra of regras) {
          if (regra.padrao.test(texto)) {
            const confianca = regra.peso;
            if (confianca > melhorMatch.confianca) {
              melhorMatch = {
                campo: pergunta.texto,
                tipo: tipo as any,
                peso: regra.peso,
                confianca,
                regrasExtracao: this.padroesExtracao[tipo as keyof typeof this.padroesExtracao] || []
              };
            }
          }
        }
      } else {
        // Para tipos com subcategorias (como area)
        for (const [subtipo, subregras] of Object.entries(regras)) {
          for (const regra of subregras) {
            if (regra.padrao.test(texto)) {
              const confianca = regra.peso;
              if (confianca > melhorMatch.confianca) {
                melhorMatch = {
                  campo: pergunta.texto,
                  tipo: tipo as any,
                  peso: regra.peso,
                  confianca,
                  regrasExtracao: this.padroesExtracao[tipo as keyof typeof this.padroesExtracao] || []
                };
              }
            }
          }
        }
      }
    }
    
    return melhorMatch;
  }
  
  private async extrairDadosMapeados(mapeamento: ResultadoMapeamento, briefingData: any): Promise<Partial<DadosExtraidos>> {
    const dados: Partial<DadosExtraidos> = {};
    
    for (const campo of mapeamento.camposMapeados) {
      const valor = this.extrairValorCampo(campo, briefingData);
      if (valor !== undefined) {
        // Mapear para o campo correto em DadosExtraidos
        switch (campo.tipo) {
          case 'area':
            if (!dados.areaConstruida) dados.areaConstruida = valor;
            break;
          case 'tipologia':
            dados.tipologia = valor;
            break;
          case 'orcamento':
            dados.orcamentoDisponivel = valor;
            break;
          case 'prazo':
            dados.prazoDesejado = valor;
            break;
          case 'localizacao':
            dados.localizacao = valor;
            break;
        }
      }
    }
    
    return dados;
  }
  
  private extrairValorCampo(campo: CampoMapeamento, briefingData: any): any {
    // Encontrar a resposta correspondente ao campo
    const perguntas = this.extrairPerguntas(briefingData);
    const perguntaCorrespondente = perguntas.find(p => 
      p.texto.toLowerCase().includes(campo.campo.toLowerCase()) ||
      campo.campo.toLowerCase().includes(p.texto.toLowerCase())
    );
    
    if (!perguntaCorrespondente || !perguntaCorrespondente.resposta) {
      return undefined;
    }
    
    const resposta = perguntaCorrespondente.resposta.toString();
    
    // Aplicar regras de extração
    for (const regra of campo.regrasExtracao) {
      const match = resposta.match(regra.padrao);
      if (match) {
        let valor = match[1] || match[0];
        
        // Aplicar transformação se definida
        if (regra.transformacao) {
          valor = regra.transformacao(valor);
        }
        
        // Validar se definida
        if (regra.validacao && !regra.validacao(valor)) {
          continue;
        }
        
        return valor;
      }
    }
    
    // Se não encontrou com regras específicas, retornar resposta bruta
    return resposta;
  }
  
  private async aplicarInferencia(dados: Partial<DadosExtraidos>, briefingData: any): Promise<void> {
    // Inferir tipologia se não foi identificada
    if (!dados.tipologia) {
      const perguntas = this.extrairPerguntas(briefingData);
      dados.tipologia = this.identificarTipologia(perguntas);
    }
    
    // Inferir complexidade se não foi identificada
    if (!dados.complexidade) {
      const perguntas = this.extrairPerguntas(briefingData);
      dados.complexidade = this.inferirComplexidade(perguntas);
    }
    
    // Inferir disciplinas básicas baseadas na tipologia
    if (!dados.disciplinasNecessarias && dados.tipologia) {
      dados.disciplinasNecessarias = this.inferirDisciplinasBasicas(dados.tipologia);
    }
    
    // Inferir padrão baseado na complexidade
    if (!dados.padrao && dados.complexidade) {
      dados.padrao = this.inferirPadrao(dados.complexidade);
    }
  }
  
  private inferirDisciplinasBasicas(tipologia: string): string[] {
    const disciplinasPorTipologia = {
      'RESIDENCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
      'COMERCIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC'],
      'INDUSTRIAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'INSTALACOES_ESPECIAIS'],
      'INSTITUCIONAL': ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC', 'SEGURANCA']
    };
    
    return disciplinasPorTipologia[tipologia as keyof typeof disciplinasPorTipologia] || ['ARQUITETURA'];
  }
  
  private inferirPadrao(complexidade: string): 'SIMPLES' | 'MEDIO' | 'ALTO' | 'LUXO' | 'PREMIUM' {
    const mapeamento = {
      'BAIXA': 'SIMPLES' as const,
      'MEDIA': 'MEDIO' as const,
      'ALTA': 'ALTO' as const,
      'MUITO_ALTA': 'LUXO' as const
    };
    
    return mapeamento[complexidade as keyof typeof mapeamento] || 'MEDIO';
  }
  
  private extrairValorNumerico(texto: string, tipo: 'area' | 'valor' | 'prazo'): number | undefined {
    const regras = this.padroesExtracao[tipo] || [];
    
    for (const regra of regras) {
      const match = texto.match(regra.padrao);
      if (match) {
        let valor = regra.transformacao ? regra.transformacao(match[1]) : parseFloat(match[1]);
        
        if (regra.validacao && !regra.validacao(valor)) {
          continue;
        }
        
        return valor;
      }
    }
    
    return undefined;
  }
  
  private gerarSugestoesMelhoria(camposMapeados: CampoMapeamento[], camposNaoMapeados: string[]): string[] {
    const sugestoes = [];
    
    // Verificar campos essenciais
    const tiposEssenciais = ['area', 'tipologia', 'orcamento'];
    const tiposMapeados = camposMapeados.map(c => c.tipo);
    
    for (const tipo of tiposEssenciais) {
      if (!tiposMapeados.includes(tipo as any)) {
        switch (tipo) {
          case 'area':
            sugestoes.push('Considere adicionar uma pergunta sobre a área construída do projeto');
            break;
          case 'tipologia':
            sugestoes.push('Inclua uma pergunta sobre o tipo/categoria do projeto');
            break;
          case 'orcamento':
            sugestoes.push('Adicione uma pergunta sobre o orçamento disponível');
            break;
        }
      }
    }
    
    // Sugestões para campos não mapeados
    if (camposNaoMapeados.length > 0) {
      sugestoes.push(`${camposNaoMapeados.length} campos não foram mapeados automaticamente. Considere revisar a formulação das perguntas.`);
    }
    
    // Sugestões de confiança baixa
    const camposBaixaConfianca = camposMapeados.filter(c => c.confianca < 0.7);
    if (camposBaixaConfianca.length > 0) {
      sugestoes.push('Algumas perguntas podem ser reformuladas para melhor identificação automática');
    }
    
    return sugestoes;
  }
}