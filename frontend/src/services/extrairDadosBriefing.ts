// 🧠 EXTRATOR INTELIGENTE DE DADOS DO BRIEFING - ARCFLOW
// Converte respostas do briefing em dados estruturados para orçamento

import { BriefingCompleto } from '../types/briefing';
import type { BriefingCompleto as BriefingOrcamento } from '../app/(app)/orcamentos/services/types';

export interface DadosExtraidos {
  // Dados básicos
  areaTotal: number;
  tipologia: string;
  complexidade: string;
  urgencia: string;
  
  // Dados financeiros
  orcamentoDisponivel: number;
  formaPagamento: string;
  reservaContingencia: number;
  
  // Programa arquitetônico
  numeroQuartos: number;
  numeroSuites: number;
  numeroVagas: number;
  ambientesEspeciais: string[];
  
  // Disciplinas
  disciplinasSelecionadas: string[];
  
  // Localização e contexto
  localizacao: string;
  regiao: string;
  
  // Características do terreno
  dimensoesTerreno: { frente: number; fundo: number };
  topografia: string;
  orientacaoSolar: string;
  
  // Padrão e acabamentos
  padrao: string;
  estiloArquitetonico: string;
  tipoEstrutura: string;
  tipoCobertura: string;
  
  // Sistemas técnicos
  sistemaAquecimento: string;
  arCondicionado: boolean;
  automacao: boolean;
  sistemaSeguranca: boolean;
  
  // Sustentabilidade
  captacaoAgua: boolean;
  energiaSolar: boolean;
  certificacaoSustentavel: string;
  
  // Cronograma
  inicioDesejado: string;
  prazoMaximo: string;
  flexibilidadePrazo: string;
}

// Mapeamento de IDs de perguntas para extração
const MAPEAMENTO_PERGUNTAS = {
  // Área e dimensões
  areaTotal: [25, 'area_total', 'area_construida', 'area_terreno'],
  dimensoesTerreno: [24, 'dimensoes', 'frente_fundo'],
  
  // Orçamento
  orcamentoDisponivel: [2, 'investimento_total', 'orcamento_disponivel'],
  formaPagamento: [3, 'financiamento', 'forma_pagamento'],
  reservaContingencia: [4, 'contingencia', 'reserva'],
  
  // Programa
  numeroQuartos: [41, 'quartos', 'numero_quartos'],
  numeroSuites: [42, 'suites', 'numero_suites'],
  numeroVagas: [49, 'garagem', 'vagas'],
  
  // Localização
  endereco: [23, 'endereco', 'localizacao'],
  orientacaoSolar: [27, 'orientacao_solar', 'orientacao'],
  topografia: [26, 'topografia', 'terreno'],
  
  // Estilo e padrão
  estiloArquitetonico: [77, 'estilo', 'arquitetonico'],
  tipoCobertura: [81, 'cobertura', 'telhado'],
  tipoEstrutura: [89, 'estrutura', 'sistema_estrutural'],
  
  // Cronograma
  inicioDesejado: [97, 'inicio_obra', 'inicio_desejado'],
  prazoMaximo: [98, 'prazo_conclusao', 'prazo_maximo'],
  
  // Sistemas
  aquecimento: [66, 'aquecimento_agua', 'sistema_aquecimento'],
  arCondicionado: [69, 'ar_condicionado', 'climatizacao'],
  sistemaSeguranca: [72, 'seguranca', 'sistema_seguranca'],
  
  // Sustentabilidade
  captacaoAgua: [12, 'captacao_chuva', 'reuso_agua'],
  energiaSolar: [18, 'energia_solar', 'renovavel']
};

export function extrairDadosBriefing(
  briefing: BriefingCompleto, 
  respostas: Record<string, any>,
  clienteInfo?: any
): DadosExtraidos {
  
  console.log('🔍 Extraindo dados do briefing:', { briefing: briefing.nome, totalRespostas: Object.keys(respostas).length });
  
  // Função auxiliar para buscar resposta por múltiplos IDs
  const buscarResposta = (ids: (string | number)[], valorPadrao: any = null) => {
    for (const id of ids) {
      const valor = respostas[id.toString()];
      if (valor !== undefined && valor !== null && valor !== '') {
        return valor;
      }
    }
    return valorPadrao;
  };
  
  // Função para extrair número de string
  const extrairNumero = (valor: any, padrao: number = 0): number => {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const numero = parseFloat(valor.replace(/[^\d.,]/g, '').replace(',', '.'));
      return isNaN(numero) ? padrao : numero;
    }
    return padrao;
  };
  
  // Função para determinar complexidade baseada nas respostas
  const determinarComplexidade = (): string => {
    const area = extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.areaTotal), 200);
    const orcamento = extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.orcamentoDisponivel), 800000);
    const quartos = extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.numeroQuartos), 3);
    
    // Lógica de complexidade baseada em múltiplos fatores
    let pontuacao = 0;
    
    if (area > 400) pontuacao += 2;
    else if (area > 250) pontuacao += 1;
    
    if (orcamento > 2000000) pontuacao += 2;
    else if (orcamento > 1200000) pontuacao += 1;
    
    if (quartos > 4) pontuacao += 1;
    
    // Verificar sistemas especiais
    const temAutomacao = buscarResposta(['automacao', 'domotica', 141], false);
    const temPiscina = buscarResposta(['piscina', 59], false);
    const temEnergiaSolar = buscarResposta(MAPEAMENTO_PERGUNTAS.energiaSolar, false);
    
    if (temAutomacao) pontuacao += 1;
    if (temPiscina) pontuacao += 1;
    if (temEnergiaSolar) pontuacao += 1;
    
    if (pontuacao >= 5) return 'Muito Alta';
    if (pontuacao >= 3) return 'Alta';
    if (pontuacao >= 1) return 'Média';
    return 'Baixa';
  };
  
  // Função para determinar disciplinas baseadas nas respostas
  const determinarDisciplinas = (): string[] => {
    const disciplinas = ['Arquitetura']; // Sempre incluída
    
    // Verificar interesse em outras disciplinas
    if (buscarResposta(['interiores', 'design_interiores', 83], false)) {
      disciplinas.push('Interiores');
    }
    
    if (buscarResposta(['paisagismo', 60, 61], false)) {
      disciplinas.push('Paisagismo');
    }
    
    if (buscarResposta(['estrutural', 'calculo_estrutural'], false)) {
      disciplinas.push('Estrutural');
    }
    
    if (buscarResposta(['instalacoes', 'hidraulica', 'eletrica'], false)) {
      disciplinas.push('Instalações');
    }
    
    return disciplinas;
  };
  
  // Função para determinar urgência
  const determinarUrgencia = (): string => {
    const prioridade = buscarResposta([4, 'prioridade'], '');
    const prazoFlexibilidade = buscarResposta(['flexibilidade_prazo', 206], '');
    
    if (prioridade === 'Prazo' || prazoFlexibilidade === 'Nenhuma') {
      return 'Urgente';
    }
    
    return 'Normal';
  };
  
  // Extrair dados estruturados
  const dadosExtraidos: DadosExtraidos = {
    // Dados básicos
    areaTotal: extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.areaTotal), 200),
    tipologia: briefing.tipologia || 'Residencial',
    complexidade: determinarComplexidade(),
    urgencia: determinarUrgencia(),
    
    // Dados financeiros
    orcamentoDisponivel: extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.orcamentoDisponivel), 1000000),
    formaPagamento: buscarResposta(MAPEAMENTO_PERGUNTAS.formaPagamento, 'Recursos próprios'),
    reservaContingencia: extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.reservaContingencia), 15),
    
    // Programa arquitetônico
    numeroQuartos: extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.numeroQuartos), 3),
    numeroSuites: extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.numeroSuites), 1),
    numeroVagas: extrairNumero(buscarResposta(MAPEAMENTO_PERGUNTAS.numeroVagas), 2),
    ambientesEspeciais: [],
    
    // Disciplinas
    disciplinasSelecionadas: determinarDisciplinas(),
    
    // Localização
    localizacao: clienteInfo?.endereco?.uf || 'SP',
    regiao: clienteInfo?.endereco?.cidade || 'São Paulo',
    
    // Características do terreno
    dimensoesTerreno: {
      frente: extrairNumero(buscarResposta(['frente', 'dimensao_frente'], ''), 15),
      fundo: extrairNumero(buscarResposta(['fundo', 'dimensao_fundo'], ''), 30)
    },
    topografia: buscarResposta(MAPEAMENTO_PERGUNTAS.topografia, 'Plano'),
    orientacaoSolar: buscarResposta(MAPEAMENTO_PERGUNTAS.orientacaoSolar, 'Norte'),
    
    // Padrão e acabamentos
    padrao: briefing.padrao || 'Médio',
    estiloArquitetonico: buscarResposta(MAPEAMENTO_PERGUNTAS.estiloArquitetonico, 'Contemporâneo'),
    tipoEstrutura: buscarResposta(MAPEAMENTO_PERGUNTAS.tipoEstrutura, 'Convencional'),
    tipoCobertura: buscarResposta(MAPEAMENTO_PERGUNTAS.tipoCobertura, 'Laje'),
    
    // Sistemas técnicos
    sistemaAquecimento: buscarResposta(MAPEAMENTO_PERGUNTAS.aquecimento, 'Chuveiro elétrico'),
    arCondicionado: buscarResposta(MAPEAMENTO_PERGUNTAS.arCondicionado, false) === 'Sim',
    automacao: buscarResposta(['automacao', 'domotica', 141], false) === 'Sim',
    sistemaSeguranca: buscarResposta(MAPEAMENTO_PERGUNTAS.sistemaSeguranca, false) === 'Sim',
    
    // Sustentabilidade
    captacaoAgua: buscarResposta(MAPEAMENTO_PERGUNTAS.captacaoAgua, false) === 'Sim',
    energiaSolar: buscarResposta(MAPEAMENTO_PERGUNTAS.energiaSolar, false) === 'Sim',
    certificacaoSustentavel: buscarResposta(['certificacao', 'leed', 'aqua'], 'Não'),
    
    // Cronograma
    inicioDesejado: buscarResposta(MAPEAMENTO_PERGUNTAS.inicioDesejado, ''),
    prazoMaximo: buscarResposta(MAPEAMENTO_PERGUNTAS.prazoMaximo, ''),
    flexibilidadePrazo: buscarResposta(['flexibilidade_prazo', 206], 'Moderada')
  };
  
  console.log('✅ Dados extraídos:', dadosExtraidos);
  
  return dadosExtraidos;
}

// Converter dados extraídos para formato de orçamento
export function converterParaOrcamento(
  dadosExtraidos: DadosExtraidos,
  clienteInfo?: any
): BriefingOrcamento {
  
  // Determinar margem baseada no perfil do cliente e complexidade
  let margem = 15; // Padrão
  
  if (dadosExtraidos.complexidade === 'Muito Alta') margem = 25;
  else if (dadosExtraidos.complexidade === 'Alta') margem = 20;
  else if (dadosExtraidos.complexidade === 'Baixa') margem = 12;
  
  if (dadosExtraidos.urgencia === 'Urgente') margem += 5;
  
  // Determinar perfil do cliente
  let perfilCliente = 'Primeira vez';
  if (dadosExtraidos.orcamentoDisponivel > 2000000) {
    perfilCliente = 'Cliente Premium';
  } else if (dadosExtraidos.orcamentoDisponivel > 1500000) {
    perfilCliente = 'Cliente Alto Padrão';
  }
  
  return {
    nomeCliente: clienteInfo?.nome || 'Cliente',
    areaTotal: dadosExtraidos.areaTotal,
    tipologia: dadosExtraidos.tipologia,
    complexidade: dadosExtraidos.complexidade,
    disciplinasSelecionadas: dadosExtraidos.disciplinasSelecionadas,
    urgencia: dadosExtraidos.urgencia,
    margem,
    perfilCliente,
    localizacao: dadosExtraidos.localizacao,
    
    // Dados adicionais para cálculo mais preciso
    orcamentoDisponivel: dadosExtraidos.orcamentoDisponivel,
    numeroQuartos: dadosExtraidos.numeroQuartos,
    numeroSuites: dadosExtraidos.numeroSuites,
    numeroVagas: dadosExtraidos.numeroVagas,
    padrao: dadosExtraidos.padrao,
    sistemaAquecimento: dadosExtraidos.sistemaAquecimento,
    arCondicionado: dadosExtraidos.arCondicionado,
    automacao: dadosExtraidos.automacao,
    captacaoAgua: dadosExtraidos.captacaoAgua,
    energiaSolar: dadosExtraidos.energiaSolar
  };
} 