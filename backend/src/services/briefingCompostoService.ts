import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

// ===== TIPOS PARA BRIEFING COMPOSTO =====

export interface CriarBriefingCompostoData {
  nome: string;
  descricao?: string;
  disciplinas: string[];
  areas: Record<string, string>;
  tipologias: Record<string, string>;
  projetoId: string;
  clienteId?: string;
  createdBy: string;
}

export interface CriarBriefingIndividualData {
  disciplina: string;
  briefingId: string;
  nome: string;
  ordem: number;
  briefingCompostoId: string;
}

export interface AtualizarRespostasData {
  briefingIndividualId: string;
  respostas: Record<string, any>;
  progresso: number;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'APROVADO' | 'REJEITADO';
}

// ===== SERVIÇO PRINCIPAL =====

export class BriefingCompostoService {
  
  // ===== CRIAR BRIEFING COMPOSTO =====
  
  static async criarBriefingComposto(data: CriarBriefingCompostoData) {
    try {
      logger.info('🏗️ Criando briefing composto', {
        nome: data.nome,
        disciplinas: data.disciplinas,
        projetoId: data.projetoId
      });

      // Calcular ordem de preenchimento
      const ordemPadrao = ['arquitetura', 'estrutural', 'instalacoes', 'design', 'paisagismo'];
      const ordemPreenchimento = ordemPadrao.filter(d => data.disciplinas.includes(d));

      // Progresso inicial
      const progressoInicial = {
        etapaAtual: 0,
        disciplinaAtual: ordemPreenchimento[0] || data.disciplinas[0],
        percentualGeral: 0,
        percentualEtapa: 0,
        ordemPreenchimento
      };

      // Criar briefing composto
      const briefingComposto = await prisma.briefingComposto.create({
        data: {
          nome: data.nome,
          descricao: data.descricao,
          disciplinas: data.disciplinas,
          areas: data.areas,
          tipologias: data.tipologias,
          status: 'CONFIGURACAO',
          progresso: progressoInicial,
          createdBy: data.createdBy,
          projetoId: data.projetoId,
          clienteId: data.clienteId
        },
        include: {
          projeto: {
            select: {
              nome: true,
              tipologia: true,
              status: true
            }
          },
          cliente: {
            select: {
              nome: true,
              email: true
            }
          }
        }
      });

      logger.info('✅ Briefing composto criado', {
        id: briefingComposto.id,
        disciplinas: data.disciplinas.length
      });

      return briefingComposto;

    } catch (error: any) {
      logger.error('❌ Erro ao criar briefing composto', {
        error: error.message,
        projetoId: data.projetoId
      });
      throw new Error(`Erro ao criar briefing composto: ${error.message}`);
    }
  }

  // ===== CRIAR BRIEFINGS INDIVIDUAIS =====
  
  static async criarBriefingsIndividuais(briefingCompostoId: string, briefingsData: CriarBriefingIndividualData[]) {
    try {
      logger.info('📝 Criando briefings individuais', {
        briefingCompostoId,
        quantidade: briefingsData.length
      });

      // Criar todos os briefings individuais em transação
      const briefingsIndividuais = await prisma.$transaction(
        briefingsData.map(data => 
          prisma.briefingIndividual.create({
            data: {
              disciplina: data.disciplina,
              briefingId: data.briefingId,
              nome: data.nome,
              ordem: data.ordem,
              respostas: {},
              status: data.ordem === 1 ? 'EM_ANDAMENTO' : 'PENDENTE',
              progresso: 0,
              briefingCompostoId: data.briefingCompostoId
            }
          })
        )
      );

      // Atualizar status do briefing composto
      await prisma.briefingComposto.update({
        where: { id: briefingCompostoId },
        data: { status: 'EM_PREENCHIMENTO' }
      });

      logger.info('✅ Briefings individuais criados', {
        quantidade: briefingsIndividuais.length
      });

      return briefingsIndividuais;

    } catch (error: any) {
      logger.error('❌ Erro ao criar briefings individuais', {
        error: error.message,
        briefingCompostoId
      });
      throw new Error(`Erro ao criar briefings individuais: ${error.message}`);
    }
  }

  // ===== OBTER BRIEFING COMPOSTO =====
  
  static async obterBriefingComposto(id: string) {
    try {
      const briefingComposto = await prisma.briefingComposto.findUnique({
        where: { id },
        include: {
          projeto: {
            select: {
              nome: true,
              tipologia: true,
              status: true,
              orcamento: true,
              endereco: true
            }
          },
          cliente: {
            select: {
              nome: true,
              email: true,
              telefone: true,
              cpf: true,
              cnpj: true
            }
          },
          briefings: {
            orderBy: { ordem: 'asc' },
            select: {
              id: true,
              disciplina: true,
              briefingId: true,
              nome: true,
              status: true,
              progresso: true,
              ordem: true,
              respostas: true,
              aprovado: true,
              observacoes: true,
              iniciadoEm: true,
              concluidoEm: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      });

      if (!briefingComposto) {
        throw new Error('Briefing composto não encontrado');
      }

      return briefingComposto;

    } catch (error: any) {
      logger.error('❌ Erro ao obter briefing composto', {
        error: error.message,
        id
      });
      throw new Error(`Erro ao obter briefing composto: ${error.message}`);
    }
  }

  // ===== ATUALIZAR RESPOSTAS =====
  
  static async atualizarRespostas(data: AtualizarRespostasData) {
    try {
      logger.info('💾 Atualizando respostas do briefing', {
        briefingIndividualId: data.briefingIndividualId,
        progresso: data.progresso
      });

      // Atualizar briefing individual
      const briefingIndividual = await prisma.briefingIndividual.update({
        where: { id: data.briefingIndividualId },
        data: {
          respostas: data.respostas,
          progresso: data.progresso,
          status: data.status || 'EM_ANDAMENTO',
          ...(data.progresso === 100 && { concluidoEm: new Date() }),
          ...(data.progresso > 0 && { iniciadoEm: new Date() })
        },
        include: {
          briefingComposto: {
            include: {
              briefings: true
            }
          }
        }
      });

      // Recalcular progresso geral  
      await this.recalcularProgressoGeral(briefingIndividual.briefingCompostoId);

      logger.info('✅ Respostas atualizadas', {
        briefingIndividualId: data.briefingIndividualId,
        novoProgresso: data.progresso
      });

      return briefingIndividual;

    } catch (error: any) {
      logger.error('❌ Erro ao atualizar respostas', {
        error: error.message,
        briefingIndividualId: data.briefingIndividualId
      });
      throw new Error(`Erro ao atualizar respostas: ${error.message}`);
    }
  }

  // ===== RECALCULAR PROGRESSO GERAL =====
  
  static async recalcularProgressoGeral(briefingCompostoId: string) {
    try {
      const briefingComposto = await prisma.briefingComposto.findUnique({
        where: { id: briefingCompostoId },
        include: {
          briefings: {
            orderBy: { ordem: 'asc' }
          }
        }
      });

      if (!briefingComposto) {
        throw new Error('Briefing composto não encontrado');
      }

      const briefings = briefingComposto.briefings;
      const totalBriefings = briefings.length;
      
      if (totalBriefings === 0) return;

      // Calcular progresso geral
      const progressoTotal = briefings.reduce((acc, b) => acc + b.progresso, 0);
      const percentualGeral = Math.round(progressoTotal / totalBriefings);

      // Encontrar briefing atual (primeiro não concluído)
      const briefingAtual = briefings.find(b => b.status !== 'CONCLUIDO' && b.status !== 'APROVADO');
      const etapaAtual = briefingAtual ? briefings.findIndex(b => b.id === briefingAtual.id) : totalBriefings - 1;

      // Verificar se todos estão concluídos
      const todosConcluidos = briefings.every(b => b.status === 'CONCLUIDO' || b.status === 'APROVADO');
      const novoStatus = todosConcluidos ? 'CONCLUIDO' : 'EM_PREENCHIMENTO';

      // Atualizar progresso
      const progressoAtualizado = {
        etapaAtual,
        disciplinaAtual: briefingAtual?.disciplina || briefings[totalBriefings - 1]?.disciplina,
        percentualGeral,
        percentualEtapa: briefingAtual?.progresso || 100,
        ordemPreenchimento: (briefingComposto.progresso as any)?.ordemPreenchimento || []
      };

      await prisma.briefingComposto.update({
        where: { id: briefingCompostoId },
        data: {
          status: novoStatus,
          progresso: progressoAtualizado
        }
      });

      logger.info('📊 Progresso geral recalculado', {
        briefingCompostoId,
        percentualGeral,
        etapaAtual,
        status: novoStatus
      });

    } catch (error: any) {
      logger.error('❌ Erro ao recalcular progresso', {
        error: error.message,
        briefingCompostoId
      });
    }
  }

  // ===== LISTAR BRIEFINGS POR PROJETO =====
  
  static async listarPorProjeto(projetoId: string) {
    try {
      const briefings = await prisma.briefingComposto.findMany({
        where: { projetoId },
        include: {
          cliente: {
            select: {
              nome: true,
              email: true
            }
          },
          briefings: {
            select: {
              id: true,
              disciplina: true,
              nome: true,
              status: true,
              progresso: true,
              ordem: true
            },
            orderBy: { ordem: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return briefings;

    } catch (error: any) {
      logger.error('❌ Erro ao listar briefings do projeto', {
        error: error.message,
        projetoId
      });
      throw new Error(`Erro ao listar briefings: ${error.message}`);
    }
  }
}

export default BriefingCompostoService;
