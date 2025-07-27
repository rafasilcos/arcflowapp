'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Métodos de conveniência
  success: (title: string, message: string, options?: Partial<Notification>) => void;
  error: (title: string, message: string, options?: Partial<Notification>) => void;
  warning: (title: string, message: string, options?: Partial<Notification>) => void;
  info: (title: string, message: string, options?: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remover se configurado
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniência
  const success = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'success', title, message });
  }, [addNotification]);

  const error = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'error', title, message, autoClose: false });
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'warning', title, message });
  }, [addNotification]);

  const info = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'info', title, message });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification, clearAllNotifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {/* Header com contador */}
      {notifications.length > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BellIcon className="w-4 h-4" />
            <span>{notifications.length} notificações</span>
          </div>
          <button
            onClick={clearAllNotifications}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpar todas
          </button>
        </div>
      )}

      {/* Lista de notificações */}
      {notifications.slice(0, 5).map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}

      {/* Indicador de mais notificações */}
      {notifications.length > 5 && (
        <div className="text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-lg p-2">
          +{notifications.length - 5} notificações a mais
        </div>
      )}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`
        ${getStyles()}
        border rounded-lg shadow-lg p-4 transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isRemoving ? 'translate-x-full opacity-0 scale-95' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatTime(notification.timestamp)}
              </span>
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
            {notification.message}
          </p>

          {notification.action && (
            <button
              onClick={() => {
                notification.action!.onClick();
                handleRemove();
              }}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {notification.action.label}
            </button>
          )}
        </div>
      </div>

      {/* Barra de progresso para auto-close */}
      {notification.autoClose && (
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-current opacity-30 transition-all ease-linear"
            style={{
              width: '100%',
              animation: `shrink ${notification.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Hook para notificações CRUD específicas
export function useCrudNotifications() {
  const { success, error, warning, info } = useNotifications();

  return {
    // Notificações de Etapa
    etapaCriada: (nomeEtapa: string) => 
      success('Etapa Criada', `A etapa "${nomeEtapa}" foi criada com sucesso.`),
    
    etapaEditada: (nomeEtapa: string) => 
      success('Etapa Atualizada', `A etapa "${nomeEtapa}" foi atualizada.`),
    
    etapaDeletada: (nomeEtapa: string) => 
      warning('Etapa Removida', `A etapa "${nomeEtapa}" foi removida.`),
    
    etapaDuplicada: (nomeEtapa: string) => 
      success('Etapa Duplicada', `A etapa "${nomeEtapa}" foi duplicada.`),
    
    etapaReordenada: () => 
      info('Etapas Reordenadas', 'A ordem das etapas foi atualizada.'),

    // Notificações de Tarefa
    tarefaCriada: (nomeTarefa: string) => 
      success('Tarefa Criada', `A tarefa "${nomeTarefa}" foi criada com sucesso.`),
    
    tarefaEditada: (nomeTarefa: string) => 
      success('Tarefa Atualizada', `A tarefa "${nomeTarefa}" foi atualizada.`),
    
    tarefaDeletada: (nomeTarefa: string) => 
      warning('Tarefa Removida', `A tarefa "${nomeTarefa}" foi removida.`),
    
    tarefaDuplicada: (nomeTarefa: string) => 
      success('Tarefa Duplicada', `A tarefa "${nomeTarefa}" foi duplicada.`),
    
    tarefaMovida: (nomeTarefa: string, nomeEtapa: string) => 
      info('Tarefa Movida', `"${nomeTarefa}" foi movida para "${nomeEtapa}".`),
    
    tarefaReordenada: () => 
      info('Tarefas Reordenadas', 'A ordem das tarefas foi atualizada.'),

    // Notificações de Timer
    timerIniciado: (nomeTarefa: string) => 
      success('Timer Iniciado', `Timer iniciado para "${nomeTarefa}".`),
    
    timerPausado: (nomeTarefa: string) => 
      warning('Timer Pausado', `Timer pausado para "${nomeTarefa}".`),
    
    timerConcluido: (nomeTarefa: string, tempoTotal: string) => 
      success('Tarefa Concluída', `"${nomeTarefa}" foi concluída em ${tempoTotal}.`),

    // Notificações de Erro
    erroGenerico: (operacao: string, detalhes?: string) => 
      error('Erro na Operação', `Falha ao ${operacao}.${detalhes ? ` ${detalhes}` : ''}`),
    
    erroValidacao: (campo: string, mensagem: string) => 
      error('Erro de Validação', `${campo}: ${mensagem}`),

    // Notificações de Sistema
    templateCarregado: (nomeTemplate: string) => 
      info('Template Carregado', `Template "${nomeTemplate}" carregado com sucesso.`),
    
    dadosSalvos: () => 
      success('Dados Salvos', 'As alterações foram salvas automaticamente.'),
    
    filtrosAplicados: (quantidade: number) => 
      info('Filtros Aplicados', `${quantidade} tarefa(s) encontrada(s).`),

    // Notificações Personalizadas
    custom: (type: NotificationType, title: string, message: string, options?: Partial<Notification>) => {
      switch (type) {
        case 'success': return success(title, message, options);
        case 'error': return error(title, message, options);
        case 'warning': return warning(title, message, options);
        case 'info': return info(title, message, options);
      }
    }
  };
} 