#!/usr/bin/env node

/**
 * 🚀 GERADOR AUTOMÁTICO DE BRIEFINGS - ARCFLOW
 * 
 * Este script automatiza a criação de novos briefings baseado no template casa-simples.ts
 * 
 * USO:
 * 1. Copie suas perguntas para um arquivo .txt
 * 2. Execute: node scripts/gerador-briefing.js
 * 3. O arquivo .ts será gerado automaticamente
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 🎯 TEMPLATE BASE - Estrutura do casa-simples.ts
const TEMPLATE_BRIEFING = {
  metadados: {
    id: '',
    nome: '',
    area: 'arquitetura',
    tipologia: '',
    subtipo: '',
    padrao: '',
    categoria: 'RESIDENCIAL',
    versao: '1.0.0',
    totalPerguntas: 0,
    tempoEstimado: 0,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    tags: []
  },
  secoes: [],
  perguntas: []
};

// 🎨 TIPOS DE CAMPO INTELIGENTES
const TIPOS_CAMPO = {
  // Detectar automaticamente baseado no conteúdo
  'select': ['escolha', 'opção', 'selecone', 'qual', 'como', 'tipo de', 'nível de'],
  'texto_longo': ['descreva', 'especifique', 'detalhes', 'explique', 'comente'],
  'numero': ['quantidade', 'número', 'metros', 'área', 'valor', 'idade'],
  'moeda': ['orçamento', 'valor', 'custo', 'preço', 'R$', 'reais'],
  'multiple': ['múltiplas', 'várias', 'todas que', 'marque', 'selecione todas'],
  'data': ['data', 'quando', 'prazo', 'até']
};

// 🔍 DETECTAR SEÇÕES AUTOMATICAMENTE
const SECOES_PADRAO = {
  'DADOS GERAIS DO CLIENTE E FAMÍLIA': ['cliente', 'família', 'composição', 'moradores'],
  'VIABILIDADE FINANCEIRA': ['financeiro', 'orçamento', 'custo', 'valor', 'pagamento'],
  'TERRENO E LOCALIZAÇÃO': ['terreno', 'lote', 'localização', 'endereço', 'área'],
  'PROGRAMA DE NECESSIDADES': ['programa', 'necessidades', 'ambientes', 'cômodos'],
  'ESTILO E PREFERÊNCIAS': ['estilo', 'preferências', 'design', 'acabamentos'],
  'SUSTENTABILIDADE': ['sustentável', 'ecológico', 'energia', 'água', 'solar'],
  'CRONOGRAMA E PRAZOS': ['prazo', 'cronograma', 'tempo', 'urgência', 'data'],
  'OUTROS REQUISITOS': ['outros', 'observações', 'requisitos', 'especiais']
};

class GeradorBriefing {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async iniciar() {
    console.log('\n🚀 GERADOR AUTOMÁTICO DE BRIEFINGS - ARCFLOW\n');
    
    try {
      // 1. Coletar informações básicas
      const info = await this.coletarInformacoes();
      
      // 2. Processar arquivo de perguntas
      const perguntas = await this.processarPerguntas(info.arquivoPerguntas);
      
      // 3. Gerar briefing
      const briefing = this.gerarBriefing(info, perguntas);
      
      // 4. Salvar arquivo
      await this.salvarArquivo(briefing, info);
      
      console.log('\n✅ BRIEFING GERADO COM SUCESSO!');
      console.log(`📁 Arquivo: ${info.nomeArquivo}`);
      console.log(`📊 Total: ${briefing.totalPerguntas} perguntas`);
      console.log(`⏱️  Tempo estimado: ${briefing.tempoEstimado} min`);
      
    } catch (error) {
      console.error('❌ Erro:', error.message);
    } finally {
      this.rl.close();
    }
  }

  async coletarInformacoes() {
    const perguntar = (questao) => new Promise(resolve => this.rl.question(questao, resolve));
    
    console.log('📋 INFORMAÇÕES BÁSICAS:\n');
    
    const nome = await perguntar('1. Nome do briefing (ex: Casa Unifamiliar - Padrão Médio): ');
    const tipologia = await perguntar('2. Tipologia (residencial/comercial/industrial): ');
    const subtipo = await perguntar('3. Subtipo (casa/apartamento/escritorio): ');
    const padrao = await perguntar('4. Padrão (simples/medio/alto): ');
    const arquivoPerguntas = await perguntar('5. Caminho do arquivo com perguntas (.txt): ');
    
    return {
      nome,
      tipologia: tipologia.toLowerCase(),
      subtipo: subtipo.toLowerCase().replace(' ', '_'),
      padrao: padrao.toLowerCase(),
      arquivoPerguntas,
      nomeArquivo: `${subtipo.toLowerCase()}-${padrao.toLowerCase()}.ts`
    };
  }

  async processarPerguntas(caminhoArquivo) {
    if (!fs.existsSync(caminhoArquivo)) {
      throw new Error(`Arquivo não encontrado: ${caminhoArquivo}`);
    }

    const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
    const linhas = conteudo.split('\n').filter(linha => linha.trim());
    
    const perguntas = [];
    let perguntaAtual = null;
    let contador = 1;

    for (const linha of linhas) {
      const linhaTrim = linha.trim();
      
      // Detectar nova pergunta (começar com número ou bullet)
      if (/^\d+\.|\-|\*/.test(linhaTrim) || (!perguntaAtual && linhaTrim.endsWith('?'))) {
        if (perguntaAtual) {
          perguntas.push(this.finalizarPergunta(perguntaAtual, contador++));
        }
        
        perguntaAtual = {
          texto: linhaTrim.replace(/^\d+\.|\-|\*\s*/, ''),
          opcoes: [],
          tipo: null,
          secao: null
        };
      }
      // Detectar opções (começar com letra ou bullet)
      else if (perguntaAtual && (/^[a-z]\)|\-|\*/.test(linhaTrim) || linhaTrim.includes('|'))) {
        const opcoes = linhaTrim.includes('|') 
          ? linhaTrim.split('|').map(o => o.trim())
          : [linhaTrim.replace(/^[a-z]\)|\-|\*\s*/, '')];
        
        perguntaAtual.opcoes.push(...opcoes);
      }
      // Continuar pergunta anterior
      else if (perguntaAtual && linhaTrim) {
        perguntaAtual.texto += ' ' + linhaTrim;
      }
    }
    
    // Adicionar última pergunta
    if (perguntaAtual) {
      perguntas.push(this.finalizarPergunta(perguntaAtual, contador));
    }

    console.log(`\n📊 PROCESSADAS: ${perguntas.length} perguntas`);
    return perguntas;
  }

  finalizarPergunta(pergunta, index) {
    // Detectar tipo automaticamente
    const texto = pergunta.texto.toLowerCase();
    let tipo = 'texto';
    
    for (const [tipoDetectado, palavrasChave] of Object.entries(TIPOS_CAMPO)) {
      if (palavrasChave.some(palavra => texto.includes(palavra))) {
        tipo = tipoDetectado;
        break;
      }
    }
    
    // Se tem opções, é select ou multiple
    if (pergunta.opcoes.length > 0) {
      tipo = pergunta.opcoes.length > 5 ? 'select' : 'radio';
    }
    
    // Detectar seção automaticamente
    let secao = 'OUTROS REQUISITOS';
    for (const [nomeSecao, palavrasChave] of Object.entries(SECOES_PADRAO)) {
      if (palavrasChave.some(palavra => texto.includes(palavra))) {
        secao = nomeSecao;
        break;
      }
    }

    return {
      id: `PERGUNTA_${index.toString().padStart(2, '0')}`,
      texto: pergunta.texto,
      tipo,
      opcoes: pergunta.opcoes.length > 0 ? pergunta.opcoes : undefined,
      obrigatoria: pergunta.texto.includes('*') || pergunta.texto.includes('obrigatória'),
      secao,
      placeholder: tipo === 'texto_longo' ? `Descreva ${pergunta.texto.toLowerCase().replace('?', '')}` : undefined,
      maxLength: tipo === 'texto_longo' ? 500 : undefined
    };
  }

  gerarBriefing(info, perguntas) {
    const briefing = { ...TEMPLATE_BRIEFING };
    
    // Metadados
    briefing.id = `${info.tipologia}-${info.subtipo}-${info.padrao}`;
    briefing.nome = info.nome;
    briefing.tipologia = info.tipologia.toUpperCase();
    briefing.subtipo = info.subtipo;
    briefing.padrao = info.padrao.toUpperCase();
    briefing.totalPerguntas = perguntas.length;
    briefing.tempoEstimado = Math.ceil(perguntas.length * 0.8); // 0.8 min por pergunta
    briefing.tags = [info.tipologia, info.subtipo, info.padrao];

    // Agrupar por seções
    const secoes = {};
    perguntas.forEach(pergunta => {
      if (!secoes[pergunta.secao]) {
        secoes[pergunta.secao] = [];
      }
      secoes[pergunta.secao].push(pergunta);
    });

    briefing.secoes = Object.entries(secoes).map(([nome, perguntas], index) => ({
      id: `secao_${index + 1}`,
      nome,
      descricao: `Seção ${nome}`,
      icone: this.obterIconeSecao(nome),
      totalPerguntas: perguntas.length
    }));

    briefing.perguntas = perguntas;
    
    return briefing;
  }

  obterIconeSecao(nomeSecao) {
    const icones = {
      'DADOS GERAIS DO CLIENTE E FAMÍLIA': '👥',
      'VIABILIDADE FINANCEIRA': '💰',
      'TERRENO E LOCALIZAÇÃO': '📍',
      'PROGRAMA DE NECESSIDADES': '🏠',
      'ESTILO E PREFERÊNCIAS': '🎨',
      'SUSTENTABILIDADE': '🌱',
      'CRONOGRAMA E PRAZOS': '⏰',
      'OUTROS REQUISITOS': '📋'
    };
    return icones[nomeSecao] || '📋';
  }

  async salvarArquivo(briefing, info) {
    const conteudo = this.gerarConteudoTypeScript(briefing);
    const caminhoDestino = path.join(__dirname, '..', 'src', 'data', 'briefings-estaticos', info.tipologia, info.nomeArquivo);
    
    // Criar diretório se não existir
    const diretorio = path.dirname(caminhoDestino);
    if (!fs.existsSync(diretorio)) {
      fs.mkdirSync(diretorio, { recursive: true });
    }
    
    fs.writeFileSync(caminhoDestino, conteudo, 'utf8');
    return caminhoDestino;
  }

  gerarConteudoTypeScript(briefing) {
    return `// 🏗️ BRIEFING ${briefing.nome.toUpperCase()} - ARCFLOW
// Gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')}

import { BriefingEstatico } from '../types';

export const ${briefing.id.toUpperCase().replace(/-/g, '_')}: BriefingEstatico = {
  // 📊 METADADOS
  id: '${briefing.id}',
  nome: '${briefing.nome}',
  area: '${briefing.tipologia.toLowerCase()}',
  tipologia: '${briefing.tipologia}',
  subtipo: '${briefing.subtipo}',
  padrao: '${briefing.padrao}',
  categoria: '${briefing.tipologia}',
  versao: '${briefing.versao}',
  totalPerguntas: ${briefing.totalPerguntas},
  tempoEstimado: ${briefing.tempoEstimado},
  
  metadados: {
    criadoEm: '${briefing.criadoEm}',
    atualizadoEm: '${briefing.atualizadoEm}',
    tags: ${JSON.stringify(briefing.tags)}
  },

  // 📋 SEÇÕES
  secoes: [
${briefing.secoes.map(secao => `    {
      id: '${secao.id}',
      nome: '${secao.nome}',
      descricao: '${secao.descricao}',
      icone: '${secao.icone}',
      totalPerguntas: ${secao.totalPerguntas}
    }`).join(',\n')}
  ],

  // ❓ PERGUNTAS
  perguntas: [
${briefing.perguntas.map(pergunta => `    {
      id: '${pergunta.id}',
      texto: '${pergunta.texto.replace(/'/g, "\\'")}',
      tipo: '${pergunta.tipo}',${pergunta.opcoes ? `
      opcoes: [
${pergunta.opcoes.map(opcao => `        '${opcao.replace(/'/g, "\\'")}'`).join(',\n')}
      ],` : ''}
      obrigatoria: ${pergunta.obrigatoria},${pergunta.placeholder ? `
      placeholder: '${pergunta.placeholder.replace(/'/g, "\\'")}',` : ''}${pergunta.maxLength ? `
      maxLength: ${pergunta.maxLength},` : ''}
      secao: '${pergunta.secao}'
    }`).join(',\n')}
  ]
};
`;
  }
}

// 🚀 EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
  new GeradorBriefing().iniciar();
}

module.exports = GeradorBriefing; 