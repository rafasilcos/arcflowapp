// 🔄 CONVERSOR DE BRIEFINGS - ARCFLOW
// Converte BriefingEstatico para BriefingCompleto (Interface Perguntas)

import { BriefingEstatico, PerguntaBriefing } from '@/data/briefings-estaticos/types';
import { BriefingCompleto, Secao, Pergunta } from '@/types/briefing';

// Mapeamento de tipos de campos
const TIPO_MAPPING: Record<string, string> = {
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
  'email': 'text',
  'endereco': 'text',
  'radio_condicional': 'radio',
  'componente_customizado': 'text'
};

/**
 * Converte um BriefingEstatico para BriefingCompleto
 */
export function converterBriefingEstaticoParaCompleto(briefingEstatico: BriefingEstatico): BriefingCompleto {
  console.log('🔄 CONVERTENDO BRIEFING:', {
    id: briefingEstatico.id,
    nome: briefingEstatico.nome,
    totalPerguntas: briefingEstatico.totalPerguntas
  });

  // Agrupar perguntas por seção
  const perguntasPorSecao = new Map<string, PerguntaBriefing[]>();
  
  briefingEstatico.perguntas.forEach(pergunta => {
    const secaoNome = pergunta.secao || 'GERAL';
    if (!perguntasPorSecao.has(secaoNome)) {
      perguntasPorSecao.set(secaoNome, []);
    }
    perguntasPorSecao.get(secaoNome)!.push(pergunta);
  });

  // Converter seções
  const secoes: Secao[] = Array.from(perguntasPorSecao.entries()).map(([nomeSecao, perguntasSecao], index) => {
    const secaoInfo = briefingEstatico.secoes?.find(s => s.nome === nomeSecao);
    
    return {
      id: secaoInfo?.id || `secao_${index}`,
      nome: nomeSecao,
      descricao: secaoInfo?.descricao || `Seção ${nomeSecao}`,
      icon: secaoInfo?.icone || '📋',
      perguntas: perguntasSecao.map((pergunta, perguntaIndex) => converterPergunta(pergunta, perguntaIndex)),
      obrigatoria: perguntasSecao.some(p => p.obrigatoria)
    };
  });

  const briefingCompleto: BriefingCompleto = {
    id: briefingEstatico.id,
    tipologia: briefingEstatico.tipologia,
    subtipo: briefingEstatico.padrao,
    padrao: briefingEstatico.padrao,
    nome: briefingEstatico.nome,
    descricao: `Briefing ${briefingEstatico.area} - ${briefingEstatico.nome}`,
    totalPerguntas: briefingEstatico.totalPerguntas,
    tempoEstimado: `${briefingEstatico.tempoEstimado} min`,
    versao: briefingEstatico.versao,
    criadoEm: briefingEstatico.metadados?.criadoEm || new Date().toISOString(),
    atualizadoEm: briefingEstatico.metadados?.atualizadoEm || new Date().toISOString(),
    secoes,
    metadata: {
      tags: briefingEstatico.metadados?.tags || [],
      categoria: briefingEstatico.categoria,
      complexidade: briefingEstatico.totalPerguntas > 100 ? 'alta' : briefingEstatico.totalPerguntas > 50 ? 'media' : 'baixa'
    }
  };

  console.log('✅ BRIEFING CONVERTIDO:', {
    id: briefingCompleto.id,
    totalSecoes: briefingCompleto.secoes.length,
    totalPerguntas: briefingCompleto.totalPerguntas
  });

  return briefingCompleto;
}

/**
 * Converte uma PerguntaBriefing para Pergunta
 */
function converterPergunta(perguntaBriefing: PerguntaBriefing, index: number): Pergunta {
  const tipo = TIPO_MAPPING[perguntaBriefing.tipo] || 'text';
  
  let opcoes = perguntaBriefing.opcoes;
  
  // Para tipo boolean, criar opções de sim/não
  if (perguntaBriefing.tipo === 'boolean') {
    opcoes = ['Sim', 'Não'];
  }

  // 🎯 PRESERVAR ID COMO STRING SE HÁ DEPENDÊNCIAS, SENÃO CONVERTER PARA NUMBER
  const temDependencias = perguntaBriefing.dependeDe || 
    // Verificar se alguma outra pergunta depende desta
    false; // Por simplicidade, vamos sempre preservar como string para compatibilidade

  const pergunta: Pergunta = {
    id: perguntaBriefing.id as any, // 🎯 PRESERVAR ID ORIGINAL (string) PARA DEPENDÊNCIAS
    tipo: tipo as any,
    pergunta: perguntaBriefing.texto,
    opcoes,
    obrigatoria: perguntaBriefing.obrigatoria,
    placeholder: perguntaBriefing.placeholder,
    min: perguntaBriefing.min,
    max: perguntaBriefing.max,
    descricao: perguntaBriefing.ajuda,
    observacoes: perguntaBriefing.tooltip,
    dependeDe: perguntaBriefing.dependeDe as any, // 🎯 PRESERVAR DEPENDÊNCIA CONDICIONAL
    formatacao: perguntaBriefing.tipo === 'moeda' ? 'moeda' : perguntaBriefing.tipo === 'telefone' ? 'telefone' : perguntaBriefing.tipo === 'email' ? 'email' : perguntaBriefing.tipo === 'cpf' ? 'cpf' : perguntaBriefing.tipo === 'cnpj' ? 'cnpj' : undefined
  };

  // Configurações especiais por tipo
  if (perguntaBriefing.tipo === 'texto_longo') {
    pergunta.tipo = 'textarea';
  }

  return pergunta;
}

/**
 * ⚠️ FUNÇÃO LEGACY - USAR BRIEFINGS APROVADOS EM VEZ DESTA
 * Função auxiliar para converter e cachear briefings
 */
export async function converterEObterBriefing(
  area: string,
  tipologia: string,
  padrao: string = 'SIMPLES'
): Promise<BriefingCompleto | null> {
  try {
    console.log('⚠️ USANDO FUNÇÃO LEGACY - MIGRAR PARA BRIEFINGS-APROVADOS');
    console.log('📋 OBTENDO BRIEFING ESTÁTICO:', { area, tipologia, padrao });
    
    // ⚠️ MIGRAÇÃO RECOMENDADA: Usar briefings-aprovados diretamente
    // Exemplo: import { BRIEFING_RESIDENCIAL_UNIFAMILIAR } from '@/data/briefings-aprovados/residencial/unifamiliar'
    
    let briefingEstatico: BriefingEstatico | null = null;
    
    // Mapear diretamente para o arquivo correto
    if (area === 'RESIDENCIAL' && tipologia === 'CASA_UNIFAMILIAR' && padrao === 'SIMPLES') {
      // ⚠️ MANTER COMPATIBILIDADE TEMPORÁRIA - MIGRAR PARA BRIEFINGS-APROVADOS
      const { CASA_SIMPLES } = await import('@/data/briefings-estaticos/residencial/casa-simples');
      briefingEstatico = CASA_SIMPLES;
    } else if (area === 'RESIDENCIAL' && tipologia === 'CASA_UNIFAMILIAR' && padrao === 'MEDIO') {
      // ⚠️ MANTER COMPATIBILIDADE TEMPORÁRIA - MIGRAR PARA BRIEFINGS-APROVADOS
      const { CASA_MEDIO } = await import('@/data/briefings-estaticos/residencial/casa-medio');
      briefingEstatico = CASA_MEDIO;
    }
    // Adicionar outros mapeamentos conforme necessário
    
    if (!briefingEstatico) {
      console.warn('❌ BRIEFING ESTÁTICO NÃO ENCONTRADO:', { area, tipologia, padrao });
      return null;
    }
    
    console.log('✅ BRIEFING ESTÁTICO ENCONTRADO:', briefingEstatico.nome);
    
    // Converter para formato compatível com InterfacePerguntas
    const briefingCompleto = converterBriefingEstaticoParaCompleto(briefingEstatico);
    
    return briefingCompleto;
    
  } catch (error) {
    console.error('💥 ERRO NA CONVERSÃO:', error);
    return null;
  }
} 