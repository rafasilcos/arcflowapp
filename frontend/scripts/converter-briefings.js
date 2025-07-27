// CONVERSOR DE BRIEFINGS - ARCFLOW CORRIGIDO
// Converte os 57 briefings .md para formato TypeScript
// Versão 2.0 - Corrigido para capturar padrão "1. Pergunta"

const fs = require('fs');
const path = require('path');

// Mapeamento de tipologias e padrões
const TIPOLOGIAS = {
  'residencial': {
    'casa_padrao': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'apartamento': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'condominio': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'sobrado': ['alto_padrao', 'medio_padrao', 'simples_padrao']
  },
  'comercial': {
    'loja_varejo': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'escritorio': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'hotel_pousada': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'restaurante_bar': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'shopping_mall': ['alto_padrao', 'medio_padrao', 'simples_padrao']
  },
  'industrial': {
    'galpao_industrial': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'fabrica': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'centro_logistico': ['alto_padrao', 'medio_padrao', 'simples_padrao']
  },
  'institucional': {
    'escola_universidade': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'clinica_hospital': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'templo_religioso': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'equipamento_esportivo': ['alto_padrao', 'medio_padrao', 'simples_padrao']
  },
  'urbanistico': {
    'espacos_publicos': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'loteamentos_parcelamentos': ['alto_padrao', 'medio_padrao', 'simples_padrao'],
    'planos_urbanos': ['alto_padrao']
  }
};

// Função para extrair perguntas de um arquivo .md (CORRIGIDA)
function extrairPerguntasDoMarkdown(conteudo) {
  const linhas = conteudo.split('\n');
  const perguntas = [];
  let secaoAtual = '';
  let subsecaoAtual = '';

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    
    // Detectar seções (## Seção ou ### Seção)
    if (linha.startsWith('## ') || linha.startsWith('### ')) {
      const novaSecao = linha.replace(/^#+\s*/, '').trim();
      if (linha.startsWith('## ')) {
        secaoAtual = novaSecao;
        subsecaoAtual = '';
      } else {
        subsecaoAtual = novaSecao;
      }
      continue;
    }
    
    // Detectar perguntas numeradas (1. Pergunta, 2. Pergunta, etc.)
    const matchPergunta = linha.match(/^(\d+)\.\s*(.+)$/);
    if (matchPergunta) {
      const numeroPergunta = parseInt(matchPergunta[1]);
      const textoPergunta = matchPergunta[2].trim();
      
      // Determinar tipo da pergunta baseado no conteúdo
      let tipo = 'text';
      let opcoes = undefined;
      let obrigatoria = true;
      
      // Verificar se há opções entre parênteses
      const matchOpcoes = textoPergunta.match(/\(([^)]+)\)$/);
      if (matchOpcoes) {
        const opcoesTexto = matchOpcoes[1];
        if (opcoesTexto.includes('/')) {
          opcoes = opcoesTexto.split('/').map(op => op.trim());
          tipo = opcoes.length <= 4 ? 'radio' : 'checkbox';
        }
      }
      
      // Definir tipo baseado no conteúdo da pergunta
      if (!opcoes) {
        if (textoPergunta.toLowerCase().includes('valor') || 
            textoPergunta.toLowerCase().includes('orçamento') ||
            textoPergunta.toLowerCase().includes('investimento')) {
          tipo = 'valor';
        } else if (textoPergunta.toLowerCase().includes('data') ||
                   textoPergunta.toLowerCase().includes('prazo')) {
          tipo = 'date';
        } else if (textoPergunta.toLowerCase().includes('área') || 
                   textoPergunta.toLowerCase().includes('metros') ||
                   textoPergunta.toLowerCase().includes('quantas') ||
                   textoPergunta.toLowerCase().includes('quantos')) {
          tipo = 'number';
        } else if (textoPergunta.toLowerCase().includes('observações') || 
                   textoPergunta.toLowerCase().includes('detalhes') ||
                   textoPergunta.toLowerCase().includes('idades') ||
                   textoPergunta.toLowerCase().includes('endereço')) {
          tipo = 'textarea';
        }
      }
      
      // Limpar texto da pergunta removendo opções
      const perguntaLimpa = textoPergunta.replace(/\s*\([^)]+\)$/, '').trim();
      
      perguntas.push({
        id: numeroPergunta,
        secao: secaoAtual,
        subsecao: subsecaoAtual,
        pergunta: perguntaLimpa,
        tipo: tipo,
        opcoes: opcoes,
        obrigatoria: obrigatoria,
        placeholder: tipo === 'textarea' ? `Descreva ${perguntaLimpa.toLowerCase()}...` : undefined
      });
    }
  }
  
  return perguntas;
}

// Função para agrupar perguntas por seção
function agruparPorSecoes(perguntas) {
  const secoes = {};
  
  perguntas.forEach(pergunta => {
    const nomeSecao = pergunta.secao || 'Geral';
    if (!secoes[nomeSecao]) {
      secoes[nomeSecao] = {
        nome: nomeSecao,
        descricao: `Perguntas sobre ${nomeSecao.toLowerCase()}`,
        perguntas: []
      };
    }
    secoes[nomeSecao].perguntas.push({
      id: pergunta.id,
      tipo: pergunta.tipo,
      pergunta: pergunta.pergunta,
      opcoes: pergunta.opcoes,
      obrigatoria: pergunta.obrigatoria,
      placeholder: pergunta.placeholder
    });
  });
  
  return Object.values(secoes);
}

// Função principal de conversão
function converterBriefings() {
  const briefingsPath = path.join(__dirname, '../../briefings');
  const outputPath = path.join(__dirname, '../src/data/briefings-convertidos.ts');
  
  const briefingsConvertidos = {};
  let totalConvertidos = 0;
  
  console.log('🚀 Iniciando conversão CORRIGIDA dos briefings...\n');
  
  // Processar cada tipologia
  Object.keys(TIPOLOGIAS).forEach(tipologia => {
    Object.keys(TIPOLOGIAS[tipologia]).forEach(subtipo => {
      TIPOLOGIAS[tipologia][subtipo].forEach(padrao => {
        const nomeArquivo = `briefing_${tipologia}_${subtipo}_${padrao}.md`;
        const caminhoArquivo = path.join(briefingsPath, nomeArquivo);
        
        if (fs.existsSync(caminhoArquivo)) {
          try {
            const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
            const perguntas = extrairPerguntasDoMarkdown(conteudo);
            const secoes = agruparPorSecoes(perguntas);
            
            const chave = `${tipologia}-${subtipo}-${padrao}`;
            briefingsConvertidos[chave] = {
              tipologia: tipologia,
              subtipo: subtipo,
              padrao: padrao,
              totalPerguntas: perguntas.length,
              secoes: secoes
            };
            
            console.log(`✅ ${nomeArquivo} - ${perguntas.length} perguntas`);
            totalConvertidos++;
          } catch (error) {
            console.log(`❌ Erro ao processar ${nomeArquivo}: ${error.message}`);
          }
        } else {
          console.log(`⚠️  Arquivo não encontrado: ${nomeArquivo}`);
        }
      });
    });
  });
  
  // Processar briefings especiais
  const briefingsEspeciais = [
    '🏗️ BRIEFING ESTRUTURAL ÚNICO ADAPTATIVO - ARCFLOW.md',
    '🔧 BRIEFING ADAPTATIVO COMPLETO - ENGENHARIA DE INSTALAÇÕES.md'
  ];
  
  briefingsEspeciais.forEach(arquivo => {
    const caminhoArquivo = path.join(briefingsPath, arquivo);
    if (fs.existsSync(caminhoArquivo)) {
      try {
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
        const perguntas = extrairPerguntasDoMarkdown(conteudo);
        const secoes = agruparPorSecoes(perguntas);
        
        const chave = arquivo.includes('ESTRUTURAL') ? 'estrutural-adaptativo' : 'instalacoes-adaptativo';
        briefingsConvertidos[chave] = {
          tipologia: arquivo.includes('ESTRUTURAL') ? 'estrutural' : 'instalacoes',
          subtipo: 'adaptativo',
          padrao: 'unico',
          totalPerguntas: perguntas.length,
          secoes: secoes
        };
        
        console.log(`✅ ${arquivo} - ${perguntas.length} perguntas`);
        totalConvertidos++;
      } catch (error) {
        console.log(`❌ Erro ao processar ${arquivo}: ${error.message}`);
      }
    }
  });
  
  // Gerar arquivo TypeScript
  const conteudoTS = `// BRIEFINGS CONVERTIDOS - ARCFLOW
// Gerado automaticamente a partir dos arquivos .md
// Total de briefings: ${totalConvertidos}
// VERSÃO CORRIGIDA - Captura padrão "1. Pergunta"

export interface Pergunta {
  id: number;
  tipo: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'valor' | 'slider';
  pergunta: string;
  opcoes?: string[];
  obrigatoria: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  descricao?: string;
  formatacao?: 'moeda' | 'percentual' | 'metros';
}

export interface Secao {
  nome: string;
  descricao: string;
  perguntas: Pergunta[];
}

export interface BriefingCompleto {
  tipologia: string;
  subtipo: string;
  padrao: string;
  totalPerguntas: number;
  secoes: Secao[];
}

export const BRIEFINGS_COMPLETOS: Record<string, BriefingCompleto> = ${JSON.stringify(briefingsConvertidos, null, 2)};

export default BRIEFINGS_COMPLETOS;
`;
  
  // Criar diretório se não existir
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Salvar arquivo
  fs.writeFileSync(outputPath, conteudoTS);
  
  console.log(`\n🎉 Conversão CORRIGIDA concluída!`);
  console.log(`📊 Total de briefings convertidos: ${totalConvertidos}`);
  console.log(`📁 Arquivo gerado: ${outputPath}`);
  
  return briefingsConvertidos;
}

// Executar conversão
if (require.main === module) {
  converterBriefings();
}

module.exports = { converterBriefings }; 