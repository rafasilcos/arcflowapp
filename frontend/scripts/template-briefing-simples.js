/**
 * 🎯 TEMPLATE SIMPLES DE BRIEFING - ARCFLOW
 * 
 * COMO USAR:
 * 1. Cole suas perguntas no array PERGUNTAS abaixo
 * 2. Ajuste os metadados
 * 3. Execute: node scripts/template-briefing-simples.js
 */

// 📝 COLE SUAS PERGUNTAS AQUI (formato simples)
const PERGUNTAS = [
  // Exemplo de formato:
  {
    pergunta: "Qual é o seu orçamento total para o projeto?",
    tipo: "moeda", // text, textarea, select, radio, checkbox, number, moeda, data
    opcoes: [], // Apenas para select, radio, checkbox
    obrigatoria: true,
    secao: "VIABILIDADE FINANCEIRA"
  },
  {
    pergunta: "Qual o prazo desejado para conclusão?",
    tipo: "select",
    opcoes: ["Até 6 meses", "6-12 meses", "1-2 anos", "Sem pressa"],
    obrigatoria: true,
    secao: "CRONOGRAMA E PRAZOS"
  },
  {
    pergunta: "Descreva suas preferências de estilo:",
    tipo: "textarea",
    obrigatoria: false,
    secao: "ESTILO E PREFERÊNCIAS"
  }
  
  // 👆 SUBSTITUA PELOS SEUS DADOS
];

// 📊 METADADOS DO BRIEFING
const METADADOS = {
  nome: "Seu Briefing Aqui",
  tipologia: "residencial", // residencial, comercial, industrial
  subtipo: "casa", // casa, apartamento, escritorio, etc
  padrao: "medio" // simples, medio, alto
};

// 🚀 GERADOR AUTOMÁTICO
const fs = require('fs');
const path = require('path');

function gerarBriefing() {
  const id = `${METADADOS.tipologia}-${METADADOS.subtipo}-${METADADOS.padrao}`;
  const nomeArquivo = `${METADADOS.subtipo}-${METADADOS.padrao}.ts`;
  
  // Agrupar por seções
  const secoes = {};
  PERGUNTAS.forEach(pergunta => {
    if (!secoes[pergunta.secao]) {
      secoes[pergunta.secao] = [];
    }
    secoes[pergunta.secao].push(pergunta);
  });

  const secoesArray = Object.entries(secoes).map(([nome, perguntas], index) => ({
    id: `secao_${index + 1}`,
    nome,
    totalPerguntas: perguntas.length
  }));

  const perguntasFormatadas = PERGUNTAS.map((pergunta, index) => ({
    id: `PERGUNTA_${(index + 1).toString().padStart(2, '0')}`,
    texto: pergunta.pergunta,
    tipo: pergunta.tipo,
    opcoes: pergunta.opcoes?.length > 0 ? pergunta.opcoes : undefined,
    obrigatoria: pergunta.obrigatoria,
    secao: pergunta.secao,
    placeholder: pergunta.tipo === 'textarea' ? `Descreva ${pergunta.pergunta.toLowerCase().replace('?', '')}` : undefined,
    maxLength: pergunta.tipo === 'textarea' ? 500 : undefined
  }));

  const conteudo = `// 🏗️ BRIEFING ${METADADOS.nome.toUpperCase()} - ARCFLOW
// Gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')}

import { BriefingEstatico } from '../types';

export const ${id.toUpperCase().replace(/-/g, '_')}: BriefingEstatico = {
  // 📊 METADADOS
  id: '${id}',
  nome: '${METADADOS.nome}',
  area: '${METADADOS.tipologia}',
  tipologia: '${METADADOS.tipologia.toUpperCase()}',
  subtipo: '${METADADOS.subtipo}',
  padrao: '${METADADOS.padrao.toUpperCase()}',
  categoria: '${METADADOS.tipologia.toUpperCase()}',
  versao: '1.0.0',
  totalPerguntas: ${PERGUNTAS.length},
  tempoEstimado: ${Math.ceil(PERGUNTAS.length * 0.8)},
  
  metadados: {
    criadoEm: '${new Date().toISOString()}',
    atualizadoEm: '${new Date().toISOString()}',
    tags: ${JSON.stringify([METADADOS.tipologia, METADADOS.subtipo, METADADOS.padrao])}
  },

  // 📋 SEÇÕES
  secoes: [
${secoesArray.map(secao => `    {
      id: '${secao.id}',
      nome: '${secao.nome}',
      descricao: 'Seção ${secao.nome}',
      icone: '📋',
      totalPerguntas: ${secao.totalPerguntas}
    }`).join(',\n')}
  ],

  // ❓ PERGUNTAS
  perguntas: [
${perguntasFormatadas.map(pergunta => `    {
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

  // Salvar arquivo
  const caminhoDestino = path.join(__dirname, '..', 'src', 'data', 'briefings-estaticos', METADADOS.tipologia, nomeArquivo);
  
  // Criar diretório se não existir
  const diretorio = path.dirname(caminhoDestino);
  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio, { recursive: true });
  }
  
  fs.writeFileSync(caminhoDestino, conteudo, 'utf8');
  
  console.log('\n✅ BRIEFING GERADO COM SUCESSO!');
  console.log(`📁 Arquivo: ${nomeArquivo}`);
  console.log(`📊 Total: ${PERGUNTAS.length} perguntas`);
  console.log(`⏱️  Tempo estimado: ${Math.ceil(PERGUNTAS.length * 0.8)} min`);
  console.log(`📍 Local: ${caminhoDestino}`);
}

// Executar
gerarBriefing(); 