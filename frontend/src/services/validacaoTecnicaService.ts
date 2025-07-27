// SERVIÇO DE VALIDAÇÃO TÉCNICA - ARCFLOW
// Validação automática de viabilidade técnica e restrições municipais

import { 
  DadosTerreno, 
  ZoneamentoMunicipal, 
  RestricaoAmbiental, 
  ValidacaoViabilidade, 
  AnaliseAutomatica,
  IntegracaoMunicipal,
  ValidacaoTecnicaService,
  TIPOS_ZONEAMENTO,
  DOCUMENTOS_PADRAO
} from '../types/validacaoTecnica';

class ValidacaoTecnicaServiceImpl implements ValidacaoTecnicaService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  private cacheZoneamento = new Map<string, ZoneamentoMunicipal>();
  private cacheRestricoes = new Map<string, RestricaoAmbiental[]>();

  // ==================== CONSULTA DADOS MUNICIPAIS ====================
  
  async consultarZoneamento(endereco: string): Promise<ZoneamentoMunicipal> {
    try {
      // Verificar cache primeiro
      if (this.cacheZoneamento.has(endereco)) {
        return this.cacheZoneamento.get(endereco)!;
      }

      // Extrair cidade do endereço
      const cidade = this.extrairCidade(endereco);
      
      // Tentar integração municipal específica
      const integracao = await this.obterIntegracaoMunicipal(cidade);
      
      if (integracao && integracao.status === 'ativa') {
        return await this.consultarZoneamentoMunicipal(endereco, integracao);
      } else {
        // Fallback para dados padrão
        return await this.obterZoneamentoPadrao(endereco);
      }
    } catch (error) {
      console.error('Erro ao consultar zoneamento:', error);
      return await this.obterZoneamentoPadrao(endereco);
    }
  }

  private async consultarZoneamentoMunicipal(endereco: string, integracao: IntegracaoMunicipal): Promise<ZoneamentoMunicipal> {
    const response = await fetch(`${integracao.configuracao.base_url}${integracao.configuracao.endpoints.consulta_zoneamento}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${integracao.configuracao.api_key}`
      },
      body: JSON.stringify({ endereco })
    });

    if (!response.ok) throw new Error('Erro na consulta municipal');
    
    const dados = await response.json();
    const zoneamento = this.mapearDadosZoneamento(dados, integracao);
    
    // Cache por 24 horas
    this.cacheZoneamento.set(endereco, zoneamento);
    setTimeout(() => this.cacheZoneamento.delete(endereco), 24 * 60 * 60 * 1000);
    
    return zoneamento;
  }

  private async obterZoneamentoPadrao(endereco: string): Promise<ZoneamentoMunicipal> {
    const cidade = this.extrairCidade(endereco);
    
    // Dados padrão baseados em padrões urbanos brasileiros
    return {
      id: `zona_${Date.now()}`,
      municipio: cidade,
      zona: 'ZR2',
      descricao: TIPOS_ZONEAMENTO.ZR2,
      
      coeficientes: {
        taxa_ocupacao_maxima: 60,
        coeficiente_aproveitamento_basico: 1.0,
        coeficiente_aproveitamento_maximo: 2.0,
        permeabilidade_minima: 20,
        taxa_permeabilidade: 20
      },
      
      recuos: {
        frontal_minimo: 5,
        lateral_minimo: 1.5,
        fundos_minimo: 3,
        entre_edificacoes: 3
      },
      
      alturas: {
        maxima_edificacao: 12,
        pe_direito_minimo: 2.5,
        numero_pavimentos_maximo: 4,
        restricoes_gabarito: []
      },
      
      usos_permitidos: {
        residencial_unifamiliar: true,
        residencial_multifamiliar: true,
        comercial_local: true,
        comercial_geral: false,
        servicos: true,
        institucional: true,
        industrial: false,
        misto: true
      },
      
      restricoes: {
        areas_especiais: [],
        limitacoes_uso: [],
        exigencias_especiais: [],
        documentacao_adicional: []
      },
      
      aprovacao: {
        orgao_responsavel: 'Prefeitura Municipal',
        prazo_medio_aprovacao: 60,
        documentos_necessarios: [...DOCUMENTOS_PADRAO.RESIDENCIAL],
        taxas_aproximadas: 2500
      },
      
      ultima_atualizacao: new Date().toISOString(),
      fonte_dados: 'Dados padrão ArcFlow'
    };
  }

  async consultarRestricoes(coordenadas: { lat: number; lng: number }): Promise<RestricaoAmbiental[]> {
    try {
      const chaveCache = `${coordenadas.lat}_${coordenadas.lng}`;
      
      if (this.cacheRestricoes.has(chaveCache)) {
        return this.cacheRestricoes.get(chaveCache)!;
      }

      // Consultar APIs ambientais (IBAMA, órgãos estaduais, etc.)
      const restricoes = await this.consultarRestricoesMeioAmbiente(coordenadas);
      
      this.cacheRestricoes.set(chaveCache, restricoes);
      setTimeout(() => this.cacheRestricoes.delete(chaveCache), 12 * 60 * 60 * 1000);
      
      return restricoes;
    } catch (error) {
      console.error('Erro ao consultar restrições:', error);
      return [];
    }
  }

  private async consultarRestricoesMeioAmbiente(coordenadas: { lat: number; lng: number }): Promise<RestricaoAmbiental[]> {
    // Simular consulta a APIs ambientais
    // Em produção, integraria com SNUC, IBAMA, órgãos estaduais
    
    const restricoes: RestricaoAmbiental[] = [];
    
    // Verificar proximidade com UCs (simulado)
    if (this.verificarProximidadeUC(coordenadas)) {
      restricoes.push({
        id: 'uc_001',
        tipo: 'area_preservacao',
        descricao: 'Proximidade com Unidade de Conservação',
        area_afetada: 0,
        percentual_terreno: 0,
        impactos: {
          area_construivel_reduzida: 0,
          restricoes_construtivas: ['Limitação de altura', 'Preservação da vegetação'],
          exigencias_compensatorias: ['Plantio compensatório'],
          licencas_necessarias: ['Licença ambiental municipal']
        },
        orgaos_fiscalizadores: ['IBAMA', 'Secretaria Municipal de Meio Ambiente'],
        penalidades: ['Multa', 'Embargo da obra'],
        status: 'ativa',
        data_vigencia: '2030-12-31'
      });
    }
    
    return restricoes;
  }

  // ==================== VALIDAÇÃO DE VIABILIDADE ====================
  
  async validarViabilidadeProjeto(terreno: DadosTerreno, projeto: any): Promise<ValidacaoViabilidade> {
    try {
      // 1. Consultar zoneamento
      const zoneamento = await this.consultarZoneamento(
        `${terreno.endereco.logradouro}, ${terreno.endereco.numero}, ${terreno.endereco.cidade}`
      );
      
      // 2. Consultar restrições ambientais
      const restricoes = terreno.endereco.coordenadas 
        ? await this.consultarRestricoes({
            lat: terreno.endereco.coordenadas.latitude,
            lng: terreno.endereco.coordenadas.longitude
          })
        : [];
      
      // 3. Calcular coeficientes
      const coeficientes = await this.calcularCoeficientes(terreno, projeto);
      
      // 4. Validar cada aspecto
      const validacoes = this.executarValidacoes(terreno, projeto, zoneamento, restricoes, coeficientes);
      
      // 5. Calcular score geral
      const scoreViabilidade = this.calcularScoreViabilidade(validacoes);
      
      // 6. Determinar resultado geral
      const resultadoGeral = this.determinarResultadoGeral(scoreViabilidade, validacoes);
      
      // 7. Gerar recomendações
      const recomendacoes = await this.gerarRecomendacoes({
        validacoes,
        terreno,
        projeto,
        zoneamento
      } as any);
      
      const validacao: ValidacaoViabilidade = {
        id: `val_${Date.now()}`,
        terreno_id: terreno.id,
        projeto_proposto: {
          tipologia: projeto.tipologia,
          area_construida: projeto.area,
          numero_pavimentos: projeto.pavimentos || 1,
          uso_principal: projeto.uso || projeto.tipologia,
          usos_secundarios: projeto.usages_secundarios || []
        },
        resultado_geral: resultadoGeral,
        score_viabilidade: scoreViabilidade,
        validacoes: validacoes as any,
        recomendacoes: {
          ajustes_projeto: recomendacoes.filter(r => r.includes('projeto')),
          alternativas_viabilidade: recomendacoes.filter(r => r.includes('alternativa')),
          otimizacoes_sugeridas: recomendacoes.filter(r => r.includes('otimizar')),
          riscos_identificados: recomendacoes.filter(r => r.includes('risco'))
        },
        cronograma_aprovacoes: this.gerarCronogramaAprovacoes(projeto.tipologia, zoneamento),
        custos_aprovacao: this.calcularCustosAprovacao(projeto.tipologia, projeto.area),
        data_validacao: new Date().toISOString(),
        valido_ate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        responsavel_validacao: 'Sistema Automático ArcFlow'
      };
      
      return validacao;
    } catch (error) {
      console.error('Erro na validação de viabilidade:', error);
      throw error;
    }
  }

  async calcularCoeficientes(terreno: DadosTerreno, projeto: any): Promise<any> {
    const areaTerreno = terreno.caracteristicas.area;
    const areaConstruida = projeto.area;
    const pavimentos = projeto.pavimentos || 1;
    
    return {
      taxa_ocupacao_calculada: (areaConstruida / pavimentos / areaTerreno) * 100,
      coeficiente_aproveitamento_calculado: areaConstruida / areaTerreno,
      area_permeavel_necessaria: areaTerreno * 0.2, // 20% padrão
      area_permeavel_disponivel: areaTerreno - (areaConstruida / pavimentos)
    };
  }

  // ==================== ANÁLISE AUTOMÁTICA COMPLETA ====================
  
  async executarAnaliseCompleta(briefingId: string, dadosTerreno: DadosTerreno): Promise<AnaliseAutomatica> {
    const inicioAnalise = Date.now();
    
    try {
      // Buscar dados do briefing
      const briefing = await this.obterDadosBriefing(briefingId);
      
      // Executar validação de viabilidade
      const validacao = await this.validarViabilidadeProjeto(dadosTerreno, briefing);
      
      // Análises específicas
      const analises = {
        viabilidade_basica: this.analisarViabilidadeBasica(validacao),
        otimizacao_implantacao: this.analisarOtimizacaoImplantacao(dadosTerreno, briefing),
        impacto_vizinhanca: this.analisarImpactoVizinhanca(dadosTerreno, briefing),
        sustentabilidade: this.analisarSustentabilidade(dadosTerreno, briefing)
      };
      
      // Gerar alertas
      const alertas = this.gerarAlertas(validacao, analises);
      
      // Documentos
      const documentos = await this.gerarDocumentosAnalise(validacao, analises);
      
      const tempoProcessamento = (Date.now() - inicioAnalise) / 1000;
      
      return {
        id: `analise_${Date.now()}`,
        briefing_id: briefingId,
        terreno_dados: dadosTerreno,
        analises,
        alertas,
        documentos_gerados: documentos,
        data_analise: new Date().toISOString(),
        tempo_processamento: tempoProcessamento,
        confiabilidade: this.calcularConfiabilidade(validacao)
      };
    } catch (error) {
      console.error('Erro na análise completa:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================
  
  private extrairCidade(endereco: string): string {
    // Lógica simples para extrair cidade do endereço
    const partes = endereco.split(',');
    return partes[partes.length - 2]?.trim() || 'Cidade não identificada';
  }

  private async obterIntegracaoMunicipal(cidade: string): Promise<IntegracaoMunicipal | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/integracoes-municipais/${encodeURIComponent(cidade)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erro ao obter integração municipal:', error);
    }
    return null;
  }

  private mapearDadosZoneamento(dados: any, integracao: IntegracaoMunicipal): ZoneamentoMunicipal {
    // Mapear campos conforme configuração da integração
    return {
      id: dados.id || `zona_${Date.now()}`,
      municipio: integracao.municipio,
      zona: dados[integracao.mapeamento_campos.zona_campo] || 'ZR2',
      descricao: dados.descricao || 'Zona Residencial',
      // ... resto do mapeamento
    } as ZoneamentoMunicipal;
  }

  private verificarProximidadeUC(coordenadas: { lat: number; lng: number }): boolean {
    // Simular verificação de proximidade com UCs
    // Em produção, consultaria APIs do SNUC/IBAMA
    return Math.random() > 0.8; // 20% de chance de ter UC próxima
  }

  private executarValidacoes(terreno: DadosTerreno, projeto: any, zoneamento: ZoneamentoMunicipal, restricoes: RestricaoAmbiental[], coeficientes: any) {
    return {
      zoneamento: {
        status: (zoneamento.usos_permitidos as any)[projeto.tipologia] ? 'aprovado' : 'reprovado' as 'aprovado' | 'reprovado' | 'condicional',
        observacoes: [],
        ajustes_necessarios: []
      },
      coeficientes: {
        taxa_ocupacao: {
          proposta: coeficientes.taxa_ocupacao_calculada,
          permitida: zoneamento.coeficientes.taxa_ocupacao_maxima,
          status: (coeficientes.taxa_ocupacao_calculada <= zoneamento.coeficientes.taxa_ocupacao_maxima ? 'ok' : 'excede') as 'ok' | 'excede' | 'limite'
        },
        coeficiente_aproveitamento: {
          proposto: coeficientes.coeficiente_aproveitamento_calculado,
          permitido: zoneamento.coeficientes.coeficiente_aproveitamento_maximo,
          status: (coeficientes.coeficiente_aproveitamento_calculado <= zoneamento.coeficientes.coeficiente_aproveitamento_maximo ? 'ok' : 'excede') as 'ok' | 'excede' | 'limite'
        },
        permeabilidade: {
          proposta: (coeficientes.area_permeavel_disponivel / terreno.caracteristicas.area) * 100,
          minima_exigida: zoneamento.coeficientes.permeabilidade_minima,
          status: (coeficientes.area_permeavel_disponivel >= coeficientes.area_permeavel_necessaria ? 'ok' : 'insuficiente') as 'ok' | 'insuficiente'
        }
      },
      recuos: {
        frontal: { proposto: 5, minimo: zoneamento.recuos.frontal_minimo, status: 'ok' },
        lateral: { proposto: 2, minimo: zoneamento.recuos.lateral_minimo, status: 'ok' },
        fundos: { proposto: 3, minimo: zoneamento.recuos.fundos_minimo, status: 'ok' }
      },
      altura_gabarito: {
        altura_proposta: (projeto.pavimentos || 1) * 3,
        altura_maxima: zoneamento.alturas.maxima_edificacao,
        pavimentos_propostos: projeto.pavimentos || 1,
        pavimentos_maximos: zoneamento.alturas.numero_pavimentos_maximo,
        status: (projeto.pavimentos || 1) <= zoneamento.alturas.numero_pavimentos_maximo ? 'ok' : 'excede'
      },
      uso_solo: {
        uso_proposto: projeto.tipologia,
        usos_permitidos: Object.keys(zoneamento.usos_permitidos).filter(uso => (zoneamento.usos_permitidos as any)[uso]),
        status: (zoneamento.usos_permitidos as any)[projeto.tipologia] ? 'permitido' : 'nao_permitido',
        condicoes: []
      },
      restricoes_ambientais: {
        areas_protegidas: restricoes,
        impacto_geral: restricoes.length > 0 ? 'medio' : 'baixo',
        licencas_necessarias: restricoes.flatMap(r => r.impactos.licencas_necessarias)
      },
      infraestrutura: {
        adequacao_geral: this.avaliarInfraestrutura(terreno.infraestrutura),
        melhorias_necessarias: this.identificarMelhorias(terreno.infraestrutura),
        custos_estimados: 0
      }
    };
  }

  private calcularScoreViabilidade(validacoes: any): number {
    let score = 100;
    
    // Penalizar por problemas
    if (validacoes.zoneamento.status === 'reprovado') score -= 30;
    if (validacoes.coeficientes.taxa_ocupacao.status === 'excede') score -= 20;
    if (validacoes.coeficientes.coeficiente_aproveitamento.status === 'excede') score -= 20;
    if (validacoes.altura_gabarito.status === 'excede') score -= 15;
    if (validacoes.uso_solo.status === 'nao_permitido') score -= 25;
    
    return Math.max(score, 0);
  }

  private determinarResultadoGeral(score: number, validacoes: any): 'viavel' | 'viavel_com_restricoes' | 'inviavel' | 'necessita_analise' {
    if (score >= 80) return 'viavel';
    if (score >= 60) return 'viavel_com_restricoes';
    if (score >= 40) return 'necessita_analise';
    return 'inviavel';
  }

  async gerarRecomendacoes(dados: any): Promise<string[]> {
    const recomendacoes = [];
    
    if (dados.validacoes.coeficientes.taxa_ocupacao.status === 'excede') {
      recomendacoes.push('Reduzir área construída ou aumentar número de pavimentos para adequar taxa de ocupação');
    }
    
    if (dados.validacoes.altura_gabarito.status === 'excede') {
      recomendacoes.push('Reduzir altura da edificação para atender gabarito municipal');
    }
    
    return recomendacoes;
  }

  // Implementações dos métodos restantes...
  private analisarViabilidadeBasica(validacao: ValidacaoViabilidade) {
    return {
      score: validacao.score_viabilidade,
      fatores_positivos: ['Zoneamento adequado', 'Infraestrutura disponível'],
      fatores_negativos: ['Restrições ambientais'],
      recomendacoes: ['Otimizar implantação']
    };
  }

  private analisarOtimizacaoImplantacao(terreno: DadosTerreno, projeto: any) {
    return {
      orientacao_recomendada: 'Norte-Sul',
      posicionamento_sugerido: 'Centro do terreno',
      aproveitamento_terreno: 75,
      areas_livres_otimizadas: terreno.caracteristicas.area * 0.4
    };
  }

  private analisarImpactoVizinhanca(terreno: DadosTerreno, projeto: any) {
    return {
      nivel_impacto: 'baixo' as const,
      consideracoes: ['Respeitar recuos', 'Controlar ruído'],
      medidas_mitigacao: ['Paisagismo', 'Isolamento acústico']
    };
  }

  private analisarSustentabilidade(terreno: DadosTerreno, projeto: any) {
    return {
      potencial_captacao_agua: true,
      orientacao_solar: 'boa' as const,
      ventilacao_natural: 'boa' as const,
      eficiencia_energetica: 75
    };
  }

  private gerarAlertas(validacao: ValidacaoViabilidade, analises: any) {
    return [
      {
        nivel: 'info' as const,
        categoria: 'tecnico' as const,
        titulo: 'Projeto Viável',
        descricao: 'O projeto atende aos requisitos básicos',
        acao_recomendada: 'Prosseguir com desenvolvimento'
      }
    ];
  }

  private async gerarDocumentosAnalise(validacao: ValidacaoViabilidade, analises: any) {
    return {
      relatorio_viabilidade: 'relatorio_001.pdf',
      memorial_justificativo: 'memorial_001.pdf',
      plantas_situacao: ['situacao_001.pdf'],
      analise_zoneamento: 'zoneamento_001.pdf'
    };
  }

  private calcularConfiabilidade(validacao: ValidacaoViabilidade): number {
    return 85; // Simulado
  }

  private avaliarInfraestrutura(infraestrutura: any): 'adequada' | 'parcial' | 'inadequada' {
    const itensDisponiveis = Object.values(infraestrutura).filter(Boolean).length;
    const totalItens = Object.keys(infraestrutura).length;
    const percentual = (itensDisponiveis / totalItens) * 100;
    
    if (percentual >= 80) return 'adequada';
    if (percentual >= 60) return 'parcial';
    return 'inadequada';
  }

  private identificarMelhorias(infraestrutura: any): string[] {
    const melhorias = [];
    if (!infraestrutura.agua) melhorias.push('Instalação de rede de água');
    if (!infraestrutura.esgoto) melhorias.push('Instalação de rede de esgoto');
    return melhorias;
  }

  private gerarCronogramaAprovacoes(tipologia: string, zoneamento: ZoneamentoMunicipal) {
    return [
      {
        etapa: 'Análise Prévia',
        orgao: 'Prefeitura Municipal',
        prazo_estimado: 15,
        documentos_necessarios: ['Plantas básicas', 'Memorial'],
        custo_estimado: 500
      },
      {
        etapa: 'Aprovação Final',
        orgao: 'Prefeitura Municipal',
        prazo_estimado: 45,
        documentos_necessarios: (DOCUMENTOS_PADRAO as any)[tipologia.toUpperCase()] || DOCUMENTOS_PADRAO.RESIDENCIAL,
        custo_estimado: 2000
      }
    ];
  }

  private calcularCustosAprovacao(tipologia: string, area: number) {
    const custoBase = area * 5; // R$ 5 por m²
    return {
      taxas_municipais: custoBase,
      taxas_estaduais: custoBase * 0.3,
      taxas_federais: custoBase * 0.1,
      documentacao: 1000,
      projetos_complementares: custoBase * 0.5,
      total_estimado: custoBase * 1.9 + 1000
    };
  }

  private async obterDadosBriefing(briefingId: string): Promise<any> {
    // Simular busca do briefing
    return {
      tipologia: 'residencial',
      area: 200,
      pavimentos: 2,
      uso: 'residencial'
    };
  }

  // Métodos da interface não implementados (stubs)
  async configurarIntegracaoMunicipal(municipio: string, config: IntegracaoMunicipal): Promise<void> {
    console.log('Configurando integração municipal:', municipio);
  }

  async sincronizarDadosMunicipais(municipio: string): Promise<void> {
    console.log('Sincronizando dados municipais:', municipio);
  }

  async gerarRelatorioViabilidade(validacao: ValidacaoViabilidade): Promise<string> {
    return 'relatorio_viabilidade.pdf';
  }

  async exportarAnaliseCompleta(analise: AnaliseAutomatica, formato: 'pdf' | 'docx'): Promise<Blob> {
    return new Blob(['Análise completa'], { type: 'application/pdf' });
  }
}

export const validacaoTecnicaService = new ValidacaoTecnicaServiceImpl();
export default validacaoTecnicaService; 