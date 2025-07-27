import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Configurações
import { logger } from './config/logger';
import { connectDatabase } from './config/database-simple';
import { connectRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';

// Rotas
import { 
  usersRoutes, 
  atividadesRoutes, 
  dashboardRoutes, 
  arquivosRoutes, 
  notificacoesRoutes 
} from './routes/simple-routes';
import briefingsRoutes from './routes/briefings';
import authRoutes from './routes/auth-working';
import projetosRoutes from './routes/projetos-working';
import cronometrosRoutes from './routes/cronometros-working';
import clientesRoutes from './routes/clientes-working';
import briefingsCompostosRoutes from './routes/briefings-compostos';
import usersDetailsRoutes from './routes/users-details';
import clientesDetailsRoutes from './routes/clientes-details';
// Removido: import templatesDinamicosRoutes - Sistema de IA removido

// Configurar variáveis de ambiente
dotenv.config();

export class ArcFlowServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
      }
    });

    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    // Security
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: process.env.NODE_ENV === 'production' ? 1000 : 10000,
      message: {
        error: 'Muitas requisições. Tente novamente em alguns minutos.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP Request', {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip
        });
      });
      
      next();
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  private setupRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/projetos', projetosRoutes);
    this.app.use('/api/cronometros', cronometrosRoutes);
    this.app.use('/api/users', usersRoutes);
    this.app.use('/api/users', usersDetailsRoutes);
    this.app.use('/api/atividades', atividadesRoutes);
    this.app.use('/api/dashboard', dashboardRoutes);
    this.app.use('/api/briefings', briefingsRoutes);
    this.app.use('/api/briefings-compostos', briefingsCompostosRoutes);
    this.app.use('/api/arquivos', arquivosRoutes);
    this.app.use('/api/notificacoes', notificacoesRoutes);
    this.app.use('/api/clientes', clientesRoutes);
    this.app.use('/api/clientes', clientesDetailsRoutes);
    // Removido: templates-dinamicos - Sistema de IA removido

    // API health check
    this.app.get('/api/health', async (req, res) => {
      try {
        // Testar conexões
        await Promise.all([
          // Database check seria aqui
          // Redis check seria aqui
        ]);

        res.json({
          status: 'OK',
          services: {
            database: 'connected',
            redis: 'connected',
            websocket: 'active'
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        logger.error('Health check failed', { error });
        res.status(503).json({
          status: 'ERROR',
          error: 'Service unavailable'
        });
      }
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint não encontrado',
        path: req.originalUrl,
        method: req.method
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      this.gracefulShutdown();
    });

    // Unhandled rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      this.gracefulShutdown();
    });

    // Graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  public async start(): Promise<void> {
    try {
      // Conectar ao banco (Redis desabilitado temporariamente)
      await connectDatabase();
      logger.info('⚠️ Redis desabilitado temporariamente para testes');

      // Iniciar servidor
      this.server.listen(this.port, () => {
        logger.info(`🚀 ArcFlow Server rodando na porta ${this.port}`);
        logger.info(`📊 Dashboard: http://localhost:${this.port}/api/health`);
        logger.info(`🔌 WebSocket: Ativo`);
        logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      });

    } catch (error) {
      logger.error('Falha ao iniciar servidor', { error });
      process.exit(1);
    }
  }

  private gracefulShutdown(): void {
    logger.info('Iniciando shutdown graceful...');

    this.server.close(() => {
      logger.info('Servidor HTTP fechado');
      
      // Fechar conexões WebSocket
      this.io.close(() => {
        logger.info('WebSocket fechado');
        process.exit(0);
      });
    });

    // Force shutdown após 10 segundos
    setTimeout(() => {
      logger.error('Forçando shutdown após timeout');
      process.exit(1);
    }, 10000);
  }
}

// Inicializar servidor se executado diretamente
if (require.main === module) {
  const server = new ArcFlowServer();
  server.start().catch((error) => {
    logger.error('Erro fatal ao iniciar servidor', { error });
    process.exit(1);
  });
}

export default ArcFlowServer; 