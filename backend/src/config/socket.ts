import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger, logError, logSecurity } from './logger';
import { RealtimeService } from './redis';
import { prisma } from './database';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  escritorioId?: string;
  userRole?: string;
}

// Mapa de usuários conectados
const connectedUsers = new Map<string, AuthenticatedSocket>();
const userRooms = new Map<string, Set<string>>();

// Middleware de autenticação para WebSocket
const authenticateSocket = async (socket: AuthenticatedSocket, next: any) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      logSecurity('WebSocket: Token não fornecido', { socketId: socket.id });
      return next(new Error('Token de autenticação necessário'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        escritorioId: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      logSecurity('WebSocket: Usuário inválido ou inativo', { 
        userId: decoded.userId,
        socketId: socket.id 
      });
      return next(new Error('Usuário não autorizado'));
    }

    // Adicionar dados do usuário ao socket
    socket.userId = user.id;
    socket.escritorioId = user.escritorioId || undefined;
    socket.userRole = user.role;

    logger.info('WebSocket: Usuário autenticado', {
      userId: user.id,
      userName: user.name,
      socketId: socket.id
    });

    next();
  } catch (error) {
    logError(error as Error, { context: 'WebSocket Authentication', socketId: socket.id });
    next(new Error('Token inválido'));
  }
};

// Configurar handlers do WebSocket
export const setupSocketHandlers = (io: SocketIOServer) => {
  // Middleware de autenticação
  io.use(authenticateSocket);

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const escritorioId = socket.escritorioId;

    logger.info('WebSocket: Nova conexão', {
      userId,
      escritorioId,
      socketId: socket.id,
      totalConnections: io.engine.clientsCount
    });

    // Adicionar usuário ao mapa de conectados
    connectedUsers.set(userId, socket);

    // Entrar nas salas apropriadas
    if (escritorioId) {
      socket.join(`escritorio:${escritorioId}`);
    }
    socket.join(`user:${userId}`);

    // Handler para entrar em sala de projeto
    socket.on('join-project', async (projectId: string) => {
      try {
        // Verificar se o usuário tem acesso ao projeto
        const projectAccess = await prisma.projetoUser.findFirst({
          where: {
            userId,
            projetoId: projectId
          }
        });

        if (!projectAccess) {
          socket.emit('error', { message: 'Acesso negado ao projeto' });
          return;
        }

        socket.join(`project:${projectId}`);
        
        // Adicionar à lista de salas do usuário
        if (!userRooms.has(userId)) {
          userRooms.set(userId, new Set());
        }
        userRooms.get(userId)!.add(`project:${projectId}`);

        logger.info('WebSocket: Usuário entrou no projeto', {
          userId,
          projectId,
          socketId: socket.id
        });

        socket.emit('joined-project', { projectId });
      } catch (error) {
        logError(error as Error, { context: 'Join Project', userId, projectId });
        socket.emit('error', { message: 'Erro ao entrar no projeto' });
      }
    });

    // Handler para sair de sala de projeto
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      userRooms.get(userId)?.delete(`project:${projectId}`);
      
      logger.info('WebSocket: Usuário saiu do projeto', {
        userId,
        projectId,
        socketId: socket.id
      });

      socket.emit('left-project', { projectId });
    });

    // ===== CRONÔMETRO REAL-TIME =====
    
    socket.on('timer-start', async (data: { projectId: string, atividadeId?: string }) => {
      try {
        const { projectId, atividadeId } = data;

        // Verificar acesso ao projeto
        const projectAccess = await prisma.projetoUser.findFirst({
          where: { userId, projetoId: projectId }
        });

        if (!projectAccess) {
          socket.emit('error', { message: 'Acesso negado ao projeto' });
          return;
        }

        // Criar registro do cronômetro
        const cronometro = await prisma.cronometro.create({
          data: {
            projetoId: projectId,
            atividadeId,
            inicio: new Date(),
            isActive: true
          }
        });

        const timerData = {
          id: cronometro.id,
          projectId,
          atividadeId,
          userId,
          startTime: cronometro.inicio.toISOString(),
          isActive: true
        };

        // Emitir para todos no projeto
        io.to(`project:${projectId}`).emit('timer-started', timerData);

        // Publicar no Redis para sincronização entre servidores
        await RealtimeService.publishTimerUpdate(projectId, {
          action: 'start',
          ...timerData
        });

        logger.info('Cronômetro iniciado', { userId, projectId, cronometroId: cronometro.id });

      } catch (error) {
        logError(error as Error, { context: 'Timer Start', userId });
        socket.emit('error', { message: 'Erro ao iniciar cronômetro' });
      }
    });

    socket.on('timer-stop', async (data: { cronometroId: string }) => {
      try {
        const { cronometroId } = data;

        // Buscar e atualizar cronômetro
        const cronometro = await prisma.cronometro.findUnique({
          where: { id: cronometroId },
          include: { projeto: true }
        });

        if (!cronometro) {
          socket.emit('error', { message: 'Cronômetro não encontrado' });
          return;
        }

        const fim = new Date();
        const duracao = Math.floor((fim.getTime() - cronometro.inicio.getTime()) / 1000);

        const updatedCronometro = await prisma.cronometro.update({
          where: { id: cronometroId },
          data: {
            fim,
            duracao,
            isActive: false
          }
        });

        const timerData = {
          id: cronometroId,
          projectId: cronometro.projetoId,
          userId,
          endTime: fim.toISOString(),
          duration: duracao,
          isActive: false
        };

        // Emitir para todos no projeto
        io.to(`project:${cronometro.projetoId}`).emit('timer-stopped', timerData);

        // Publicar no Redis
        await RealtimeService.publishTimerUpdate(cronometro.projetoId, {
          action: 'stop',
          ...timerData
        });

        logger.info('Cronômetro parado', { 
          userId, 
          projectId: cronometro.projetoId, 
          cronometroId,
          duracao: `${duracao}s`
        });

      } catch (error) {
        logError(error as Error, { context: 'Timer Stop', userId });
        socket.emit('error', { message: 'Erro ao parar cronômetro' });
      }
    });

    // ===== NOTIFICAÇÕES REAL-TIME =====

    socket.on('mark-notification-read', async (notificationId: string) => {
      try {
        await prisma.notificacao.update({
          where: { id: notificationId, userId },
          data: { lida: true }
        });

        socket.emit('notification-marked-read', { notificationId });
      } catch (error) {
        logError(error as Error, { context: 'Mark Notification Read', userId });
      }
    });

    // ===== COLABORAÇÃO REAL-TIME =====

    socket.on('project-update', async (data: { projectId: string, update: any }) => {
      try {
        const { projectId, update } = data;

        // Verificar acesso
        const projectAccess = await prisma.projetoUser.findFirst({
          where: { userId, projetoId: projectId }
        });

        if (!projectAccess) return;

        // Emitir para outros usuários no projeto (exceto o remetente)
        socket.to(`project:${projectId}`).emit('project-updated', {
          projectId,
          userId,
          update,
          timestamp: new Date().toISOString()
        });

        // Publicar no Redis
        await RealtimeService.publishProjectUpdate(projectId, {
          userId,
          update,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        logError(error as Error, { context: 'Project Update', userId });
      }
    });

    // ===== CHAT REAL-TIME =====

    socket.on('send-message', async (data: { projectId: string, message: string }) => {
      try {
        const { projectId, message } = data;

        // Verificar acesso
        const projectAccess = await prisma.projetoUser.findFirst({
          where: { userId, projetoId: projectId }
        });

        if (!projectAccess) return;

        const chatMessage = {
          id: `msg_${Date.now()}_${userId}`,
          projectId,
          userId,
          message,
          timestamp: new Date().toISOString()
        };

        // Emitir para todos no projeto
        io.to(`project:${projectId}`).emit('new-message', chatMessage);

        logger.info('Mensagem enviada', { userId, projectId, messageLength: message.length });

      } catch (error) {
        logError(error as Error, { context: 'Send Message', userId });
      }
    });

    // ===== EVENTOS DE DESCONEXÃO =====

    socket.on('disconnect', (reason) => {
      logger.info('WebSocket: Usuário desconectado', {
        userId,
        socketId: socket.id,
        reason,
        totalConnections: io.engine.clientsCount - 1
      });

      // Remover do mapa de conectados
      connectedUsers.delete(userId);
      userRooms.delete(userId);

      // Notificar projetos sobre desconexão
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room.startsWith('project:')) {
          socket.to(room).emit('user-disconnected', { userId });
        }
      });
    });

    // Ping/Pong para manter conexão
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Enviar dados iniciais
    socket.emit('connected', {
      userId,
      escritorioId,
      timestamp: new Date().toISOString()
    });
  });

  // Eventos globais
  io.engine.on('connection_error', (err) => {
    logError(err, { context: 'WebSocket Connection Error' });
  });

  logger.info('✅ WebSocket handlers configurados');
};

// Funções utilitárias
export const getConnectedUsers = (): string[] => {
  return Array.from(connectedUsers.keys());
};

export const isUserConnected = (userId: string): boolean => {
  return connectedUsers.has(userId);
};

export const sendNotificationToUser = (io: SocketIOServer, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('notification', notification);
};

export const sendToProject = (io: SocketIOServer, projectId: string, event: string, data: any) => {
  io.to(`project:${projectId}`).emit(event, data);
};

export const sendToEscritorio = (io: SocketIOServer, escritorioId: string, event: string, data: any) => {
  io.to(`escritorio:${escritorioId}`).emit(event, data);
}; 