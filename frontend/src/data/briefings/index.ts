// 🚀 SISTEMA DE BRIEFINGS ARCFLOW - VERSÃO ESCALÁVEL PARA 150K+ USUÁRIOS
// Lazy Loading + Cache Inteligente + Performance O(1)

import { obterBriefingEstatico, mapearParametrosLegacy } from '../briefings-estaticos';
import type { BriefingCompleto } from '../../types/briefing';

// ===== FUNÇÕES AUXILIARES DE MAPEAMENTO =====
function mapearTipoPergunta(tipo: string): 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'valor' | 'slider' | 'file' {
  const mapeamento: Record<string, any> = {
    // Tipos antigos (compatibilidade)
    'texto': 'text',
    'texto_longo': 'textarea',
    'numero': 'number',
    'moeda': 'valor',
    'data': 'date',
    'select': 'select',
    'multiple': 'checkbox',
    'boolean': 'radio',
    'cpf': 'text',
    'cnpj': 'text',
    'telefone': 'text',
    'endereco': 'textarea',
    
    // Tipos novos (casa-simples-final.ts)
    'text': 'text',
    'textarea': 'textarea',
    'number': 'number',
    'tel': 'text',
    'email': 'text',
    'radio_condicional': 'radio',
    'componente_customizado': 'text', // Fallback para componentes complexos
    
    // Fallbacks seguros
    'undefined': 'text',
    '': 'text'
  };
  
  const tipoMapeado = mapeamento[tipo] || 'text';
  console.log(`🔄 Mapeando tipo "${tipo}" → "${tipoMapeado}"`);
  return tipoMapeado;
}

function definirComplexidade(totalPerguntas: number): 'baixa' | 'media' | 'alta' | 'muito_alta' {
  if (totalPerguntas <= 40) return 'baixa';
  if (totalPerguntas <= 70) return 'media';
  if (totalPerguntas <= 100) return 'alta';
  return 'muito_alta';
}

// ===== FUNÇÃO PRINCIPAL ESCALÁVEL =====
export async function obterBriefing(
  tipologia?: string,
  subtipo?: string,
  padrao?: string
): Promise<BriefingCompleto | null> {
  try {
    console.log('🚀 BRIEFING ESCALÁVEL | Parâmetros recebidos:', { tipologia, subtipo, padrao });

    // Mapear parâmetros legacy para novo formato
    const parametrosMapeados = mapearParametrosLegacy(tipologia, subtipo, padrao);
    
    if (!parametrosMapeados) {
      console.warn('❌ BRIEFING ESCALÁVEL | Parâmetros inválidos:', { tipologia, subtipo, padrao });
      return null;
    }

    console.log('✅ BRIEFING ESCALÁVEL | Parâmetros mapeados:', parametrosMapeados);

    // ===== LAZY LOADING ASSÍNCRONO =====
    const briefingEstatico = await obterBriefingEstatico(
      parametrosMapeados.area,
      parametrosMapeados.tipologia,
      parametrosMapeados.padrao
    );

    if (!briefingEstatico) {
      console.warn('❌ BRIEFING ESCALÁVEL | Briefing não encontrado para:', parametrosMapeados);
      return null;
    }

    console.log('🎉 BRIEFING ESCALÁVEL | Briefing carregado:', {
      id: briefingEstatico.id,
      nome: briefingEstatico.nome,
      totalPerguntas: briefingEstatico.totalPerguntas
    });

    // ===== CONVERSÃO INTELIGENTE PARA DIFERENTES FORMATOS =====
    let secoes: any = {};
    
    console.log('🔍 DETECTANDO FORMATO:', {
      temSecoes: !!briefingEstatico.secoes,
      tipoPerguntas: Array.isArray(briefingEstatico.perguntas) ? 'array' : typeof briefingEstatico.perguntas,
      totalPerguntas: Array.isArray(briefingEstatico.perguntas) ? briefingEstatico.perguntas.length : 'N/A'
    });
    
    // Verificar se é o formato com seções já organizadas
    if (briefingEstatico.secoes && Array.isArray(briefingEstatico.secoes)) {
      console.log('🆕 FORMATO COM SEÇÕES | Convertendo casa-simples-final.ts');
      
      // Usar seções diretamente do novo formato
      secoes = briefingEstatico.secoes.reduce((acc: any, secao: any) => {
        acc[secao.nome] = secao.perguntas;
        return acc;
      }, {});
      
    } else if (Array.isArray(briefingEstatico.perguntas)) {
      // Formato novo: array direto de perguntas (casa-simples-final.ts)
      console.log('🆕 FORMATO ARRAY DIRETO | Convertendo casa-simples-final.ts');
      console.log('📊 Total de perguntas encontradas:', briefingEstatico.perguntas.length);
      console.log('🔍 Primeiras 3 perguntas:', briefingEstatico.perguntas.slice(0, 3).map((p: any) => ({ id: p.id, secao: p.secao, texto: p.texto?.substring(0, 50) })));
      
      // Agrupar perguntas por seção
      secoes = (briefingEstatico.perguntas as any[]).reduce((acc: any, pergunta: any) => {
        const secao = pergunta.secao || 'Outros';
        if (!acc[secao]) {
          acc[secao] = [];
        }
        acc[secao].push(pergunta);
        return acc;
      }, {});
      
      console.log('📋 Seções criadas:', Object.keys(secoes));
      console.log('📊 Perguntas por seção:', Object.entries(secoes).map(([nome, perguntas]: [string, any]) => 
        `${nome}: ${Array.isArray(perguntas) ? perguntas.length : 0} perguntas`
      ));
      
    } else if (briefingEstatico.perguntas && typeof briefingEstatico.perguntas === 'object' && !Array.isArray(briefingEstatico.perguntas)) {
      // Formato antigo: objeto com propriedades aninhadas (compatibilidade)
      console.log('🔄 FORMATO ANTIGO | Convertendo formato legacy');
      
      // Tentar encontrar array de perguntas no objeto (formato legado)
      const perguntasSelecionadas = (briefingEstatico.perguntas as any)?.perguntas || 
                                   Object.values(briefingEstatico.perguntas).find(Array.isArray) ||
                                   [];

      if (perguntasSelecionadas.length === 0) {
        console.warn('⚠️ Nenhuma pergunta encontrada no formato antigo');
      }

      // Agrupar perguntas por seção
      secoes = perguntasSelecionadas.reduce((acc: any, pergunta: any) => {
        const secao = pergunta.secao || 'Outros';
        if (!acc[secao]) {
          acc[secao] = [];
        }
        acc[secao].push(pergunta);
        return acc;
      }, {} as Record<string, typeof perguntasSelecionadas>);
      
    } else {
      console.error('❌ FORMATO NÃO RECONHECIDO:', briefingEstatico);
      throw new Error('Formato de briefing não reconhecido');
    }

    const briefingCompleto: BriefingCompleto = {
      id: briefingEstatico.id,
      tipologia: parametrosMapeados.tipologia,
      subtipo: subtipo || 'padrao',
      padrao: parametrosMapeados.padrao,
      nome: briefingEstatico.nome,
      descricao: `${briefingEstatico.nome} - ${briefingEstatico.totalPerguntas} perguntas`,
      totalPerguntas: briefingEstatico.totalPerguntas,
      tempoEstimado: `${briefingEstatico.tempoEstimado} min`,
      versao: briefingEstatico.versao || '1.0',
      criadoEm: briefingEstatico.metadados?.criadoEm || new Date().toISOString(),
      atualizadoEm: briefingEstatico.metadados?.atualizadoEm || new Date().toISOString(),
      secoes: Object.entries(secoes).map(([titulo, perguntas], secaoIndex) => {
        // Validação de segurança
        const perguntasArray = Array.isArray(perguntas) ? perguntas : [];
        
        console.log(`🔍 PROCESSANDO SEÇÃO "${titulo}":`, {
          totalPerguntas: perguntasArray.length,
          primeirasPerguntasIds: perguntasArray.slice(0, 3).map(p => p?.id || 'sem-id')
        });
        
        return {
          id: titulo.toLowerCase().replace(/\s+/g, '_'),
          nome: titulo,
          descricao: `${perguntasArray.length} perguntas`,
          obrigatoria: true,
          perguntas: perguntasArray.map((pergunta: any, index: number) => {
            const perguntaProcessada = {
              id: parseInt(pergunta.id?.replace(/[^\d]/g, '')) || index + 1,
              tipo: mapearTipoPergunta(pergunta.tipo),
              pergunta: pergunta.texto || pergunta.pergunta || 'Pergunta sem texto', // Suporte aos dois formatos
              opcoes: pergunta.opcoes || [],
              obrigatoria: pergunta.obrigatoria || false,
              placeholder: pergunta.placeholder,
              help: pergunta.ajuda || pergunta.observacoes, // Novo formato usa 'observacoes'
              validacao: pergunta.validacao, // Adicionar validação do novo formato
              mascara: pergunta.mascara, // Adicionar máscara do novo formato
              rows: pergunta.rows // Adicionar rows para textarea
            };
            
            // Log de debug para primeira pergunta de cada seção
            if (index === 0) {
              console.log(`🔍 PRIMEIRA PERGUNTA DA SEÇÃO "${titulo}":`, {
                id: perguntaProcessada.id,
                tipo: perguntaProcessada.tipo,
                pergunta: perguntaProcessada.pergunta.substring(0, 50),
                obrigatoria: perguntaProcessada.obrigatoria
              });
            }
            
            return perguntaProcessada;
          })
        };
      }),
      metadata: {
        tags: briefingEstatico.metadados?.tags || [],
        categoria: briefingEstatico.categoria || 'geral',
        complexidade: definirComplexidade(briefingEstatico.totalPerguntas)
      }
    };

    console.log('🚀 BRIEFING ESCALÁVEL | Conversão concluída:', {
      totalSecoes: briefingCompleto.secoes.length,
      tempoEstimado: briefingCompleto.tempoEstimado
    });

    return briefingCompleto;

  } catch (error) {
    console.error('💥 ERRO no obterBriefing escalável:', error);
    return null;
  }
}

// ===== FUNÇÕES AUXILIARES MANTIDAS =====

export function listarTipologias() {
  return [
    { id: 'casa', nome: 'Casa Unifamiliar', area: 'residencial' },
    { id: 'apartamento', nome: 'Apartamento', area: 'residencial' },
    { id: 'sobrado', nome: 'Sobrado', area: 'residencial' },
    { id: 'escritorio', nome: 'Escritório', area: 'comercial' },
    { id: 'loja', nome: 'Loja', area: 'comercial' },
    { id: 'restaurante', nome: 'Restaurante', area: 'comercial' },
    { id: 'galpao', nome: 'Galpão Industrial', area: 'industrial' },
    { id: 'escola', nome: 'Escola', area: 'institucional' },
    { id: 'saude', nome: 'Unidade de Saúde', area: 'institucional' }
  ];
}

export function listarSubtipos(tipologia: string) {
  // Para compatibilidade - apenas casa tem subtipos
  if (tipologia === 'casa') {
    return [
      { id: 'unifamiliar', nome: 'Casa Unifamiliar' }
    ];
  }
  return [{ id: 'padrao', nome: 'Padrão' }];
}

export function listarPadroes(tipologia: string) {
  // Apenas casa tem múltiplos padrões
  if (tipologia === 'casa') {
    return [
      { id: 'simples', nome: 'Simples', descricao: '128 perguntas - Projeto básico' },
      { id: 'medio', nome: 'Médio', descricao: '85 perguntas - Projeto intermediário' },
      { id: 'alto', nome: 'Alto', descricao: '120 perguntas - Projeto completo' }
    ];
  }
  
  return [{ id: 'unico', nome: 'Padrão Único', descricao: 'Briefing padrão' }];
}

// ===== ESTATÍSTICAS =====
export function obterEstatisticasBriefings() {
  return {
    totalBriefings: 12, // Será atualizado conforme implementamos mais briefings
    briefingsAtivos: 3, // Casa Simples, Casa Médio, Escritório
    totalPerguntas: 285, // 128 + 85 + 72
    tempoMedioEstimado: 169, // (190 + 128 + 108) / 3
    performance: '🚀 Lazy Loading - Escalável para 150k+ usuários',
    arquitetura: 'Dynamic imports + Cache inteligente + O(1) lookup'
  };
}

// ===== FUNÇÃO OBTER BRIEFING MODULAR (COMPATIBILIDADE) =====
export async function obterBriefingModular(
  area: string,
  tipologia: string,
  padrao: string
): Promise<BriefingCompleto | null> {
  console.log('🔍 obterBriefingModular ESCALÁVEL:', { area, tipologia, padrao });
  console.log('🎯 RAFAEL DEBUG - ENTRADA:', { area, tipologia, padrao });
  
  // Mapear parâmetros para sistema estático
  let tipologiaMapeada = tipologia;
  let padraoMapeado = padrao;
  
  // Converter arquitetura/residencial para casa
  if (area === 'arquitetura' && tipologia === 'residencial') {
    console.log('✅ DETECTADO: arquitetura + residencial → mapeando para casa');
    tipologiaMapeada = 'casa';
    // Converter padrões adicionando _padrao
    if (padrao === 'simples') {
      padraoMapeado = 'simples_padrao';
    } else if (padrao === 'medio') {
      padraoMapeado = 'medio_padrao';
    } else if (padrao === 'alto') {
      padraoMapeado = 'alto_padrao';
    }
  }
  
  // Converter arquitetura/comercial para escritorio  
  if (area === 'arquitetura' && tipologia === 'comercial') {
    console.log('✅ DETECTADO: arquitetura + comercial → mapeando para escritorio');
    tipologiaMapeada = 'escritorio';
    padraoMapeado = 'unico';
  }
  
  // Chamar função principal com parâmetros mapeados
  console.log('🎯 RAFAEL DEBUG - ANTES DE CHAMAR obterBriefing:', { tipologiaMapeada, padraoMapeado });
  const resultado = await obterBriefing(tipologiaMapeada, undefined, padraoMapeado);
  console.log('📋 RESULTADO obterBriefing escalável:', resultado ? '✅ ENCONTRADO' : '❌ NULL');
  console.log('🎯 RAFAEL DEBUG - RESULTADO FINAL:', resultado);
  
  return resultado;
}

// ===== FUNÇÃO PARA COMPATIBILIDADE COM COMPONENTES EXISTENTES =====
export function listarBriefingsDisponiveis() {
  // Mapear briefings estáticos para formato esperado pelo componente
  return [
    // Casa Unifamiliar
    {
      chave: 'arquitetura-residencial-casa-simples',
      area: 'arquitetura',
      tipologia: 'residencial',
      subtipo: 'casa_padrao',
      padrao: 'simples',
      nome: 'Casa Unifamiliar - Padrão Simples',
      totalPerguntas: 128,
      tempoEstimado: '190 min'
    },
    {
      chave: 'arquitetura-residencial-casa-medio',
      area: 'arquitetura',
      tipologia: 'residencial',
      subtipo: 'casa_padrao',
      padrao: 'medio',
      nome: 'Casa Unifamiliar - Padrão Médio',
      totalPerguntas: 85,
      tempoEstimado: '128 min'
    },
    
    // Comercial - Escritório
    {
      chave: 'arquitetura-comercial-escritorio-unico',
      area: 'arquitetura',
      tipologia: 'comercial',
      subtipo: 'escritorio',
      padrao: 'unico',
      nome: 'Escritório Comercial',
      totalPerguntas: 72,
      tempoEstimado: '108 min'
    }
  ];
}

console.log('🚀 SISTEMA DE BRIEFINGS ESCALÁVEL | Carregado com sucesso');
console.log('📊 Estatísticas:', obterEstatisticasBriefings()); 