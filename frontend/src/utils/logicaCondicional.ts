import { CondicaoPergunta } from '@/types/briefing';

// Tipo para lógica condicional avançada
interface CondicaoAvancada {
  perguntaId: number;
  valores: string[];
  operador: 'equals' | 'includes' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal';
  valor?: number;
}

/**
 * Avalia se uma condição é verdadeira baseada nas respostas
 */
export function avaliarCondicao(
  condicao: CondicaoPergunta | CondicaoAvancada,
  respostas: Record<string, any>
): boolean {
  const { perguntaId, valores, operador } = condicao;
  const condicaoEstendida = condicao as CondicaoAvancada;
  const respostaPergunta = respostas[perguntaId.toString()];

  if (!respostaPergunta) {
    return false;
  }

  switch (operador) {
    case 'equals':
      return valores.includes(respostaPergunta);
    
    case 'not_equals':
      return !valores.includes(respostaPergunta);
    
    case 'includes':
      if (Array.isArray(respostaPergunta)) {
        return valores.some(v => respostaPergunta.includes(v));
      }
      return valores.includes(respostaPergunta);
    
    case 'greater_than':
      const numResposta = Number(respostaPergunta);
      const numValor = Number(condicaoEstendida.valor || valores[0]);
      return !isNaN(numResposta) && !isNaN(numValor) && numResposta > numValor;
    
    case 'less_than':
      const numResposta2 = Number(respostaPergunta);
      const numValor2 = Number(condicaoEstendida.valor || valores[0]);
      return !isNaN(numResposta2) && !isNaN(numValor2) && numResposta2 < numValor2;
    
    case 'greater_equal':
      const numResposta3 = Number(respostaPergunta);
      const numValor3 = Number(condicaoEstendida.valor || valores[0]);
      return !isNaN(numResposta3) && !isNaN(numValor3) && numResposta3 >= numValor3;
    
    case 'less_equal':
      const numResposta4 = Number(respostaPergunta);
      const numValor4 = Number(condicaoEstendida.valor || valores[0]);
      return !isNaN(numResposta4) && !isNaN(numValor4) && numResposta4 <= numValor4;
    
    default:
      console.warn(`Operador não reconhecido: ${operador}`);
      return false;
  }
}

/**
 * Avalia se uma pergunta condicional deve ser exibida
 */
export function perguntaDeveSerExibida(
  pergunta: any,
  respostas: Record<string, any>
): boolean {
  // 🎯 CORREÇÃO RAFAEL: Verificar dependeDe primeiro (sistema mais simples)
  if (pergunta.dependeDe) {
    const { perguntaId, valoresQueExibem } = pergunta.dependeDe;
    const respostaDependencia = respostas[perguntaId];
    
    console.log(`🔍 DEPENDÊNCIA RAFAEL: Pergunta ${pergunta.id}`, {
      pergunta: pergunta.pergunta?.substring(0, 50),
      dependeDe: perguntaId,
      respostaDependencia,
      valoresQueExibem,
      deveExibir: respostaDependencia && valoresQueExibem.includes(respostaDependencia.toString())
    });
    
    // Só exibir se a resposta da dependência estiver nos valores que exibem
    return respostaDependencia && valoresQueExibem.includes(respostaDependencia.toString());
  }
  
  // 🎯 SISTEMA ANTIGO: Verificar condicional (sistema mais complexo)
  if (pergunta.condicional && pergunta.condicao) {
    return avaliarCondicao(pergunta.condicao, respostas);
  }

  // Se não tem condição nenhuma, sempre exibir
  return true;
}

/**
 * Avalia se uma seção condicional deve ser exibida
 */
export function secaoDeveSerExibida(
  secao: any,
  respostas: Record<string, any>
): boolean {
  // Se não é condicional, sempre exibir
  if (!secao.condicional || !secao.condicao) {
    return true;
  }

  const resultado = avaliarCondicao(secao.condicao, respostas);
  
  // 🎯 DEBUG RAFAEL: Log detalhado para seções condicionais
  console.log(`🔍 SEÇÃO CONDICIONAL: ${secao.nome}`, {
    id: secao.id,
    condicional: secao.condicional,
    condicao: secao.condicao,
    respostaPerguntaChave: respostas[secao.condicao.perguntaId.toString()],
    valoresEsperados: secao.condicao.valores,
    deveExibir: resultado
  });
  
  return resultado;
}

/**
 * Filtra as seções que devem ser exibidas baseado nas respostas
 */
export function filtrarSecoesVisiveis(
  secoes: any[],
  respostas: Record<string, any>
): any[] {
  return secoes.filter(secao => secaoDeveSerExibida(secao, respostas));
}

/**
 * Filtra as perguntas que devem ser exibidas em uma seção
 */
export function filtrarPerguntasVisiveis(
  perguntas: any[],
  respostas: Record<string, any>
): any[] {
  return perguntas.filter(pergunta => perguntaDeveSerExibida(pergunta, respostas));
}

/**
 * Conta o total de perguntas visíveis baseado nas respostas
 */
export function contarPerguntasVisiveis(
  secoes: any[],
  respostas: Record<string, any>
): number {
  const secoesVisiveis = filtrarSecoesVisiveis(secoes, respostas);
  return secoesVisiveis.reduce((total, secao) => {
    const perguntasVisiveis = filtrarPerguntasVisiveis(secao.perguntas, respostas);
    return total + perguntasVisiveis.length;
  }, 0);
}

/**
 * Simula todas as possibilidades de um briefing adaptativo
 */
export function simularCaminhosBriefing(secoes: any[]): {
  caminho: string;
  perguntaChave: string;
  respostaChave: string;
  secoesVisiveis: number;
  perguntasVisiveis: number;
}[] {
  const resultados: any[] = [];
  
  // Encontrar a pergunta chave (sistema estrutural)
  const secaoSistema = secoes.find(s => s.id === 'sistema-estrutural');
  if (!secaoSistema) return resultados;
  
  const perguntaChave = secaoSistema.perguntas.find((p: any) => 
    p.pergunta?.includes('SISTEMA ESTRUTURAL') || p.pergunta?.includes('ESCOLHA O SISTEMA')
  );
  if (!perguntaChave) return resultados;
  
  // Testar cada opção
  perguntaChave.opcoes?.forEach((opcao: string) => {
    const respostasTeste = {
      [perguntaChave.id.toString()]: opcao
    };
    
    const secoesVisiveis = filtrarSecoesVisiveis(secoes, respostasTeste);
    const perguntasVisiveis = contarPerguntasVisiveis(secoes, respostasTeste);
    
    resultados.push({
      caminho: opcao,
      perguntaChave: perguntaChave.pergunta || 'Sistema Estrutural',
      respostaChave: opcao,
      secoesVisiveis: secoesVisiveis.length,
      perguntasVisiveis
    });
  });
  
  return resultados;
} 