'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShieldCheckIcon, LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Definição de Roles e Permissões
export type UserRole = 'admin' | 'coordenador' | 'arquiteto' | 'tecnico' | 'visualizador';

export type Permission = 
  // Permissões de Etapa
  | 'etapa.criar' | 'etapa.editar' | 'etapa.deletar' | 'etapa.reordenar' | 'etapa.duplicar'
  // Permissões de Tarefa
  | 'tarefa.criar' | 'tarefa.editar' | 'tarefa.deletar' | 'tarefa.reordenar' | 'tarefa.duplicar' | 'tarefa.mover'
  // Permissões de Timer
  | 'timer.iniciar' | 'timer.pausar' | 'timer.parar' | 'timer.editar_tempo'
  // Permissões de Projeto
  | 'projeto.configurar' | 'projeto.arquivar' | 'projeto.exportar'
  // Permissões de Usuário
  | 'usuario.convidar' | 'usuario.remover' | 'usuario.alterar_role'
  // Permissões de Dados
  | 'dados.exportar' | 'dados.importar' | 'dados.backup'
  // Permissões de Visualização
  | 'view.dashboard' | 'view.relatorios' | 'view.financeiro';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  disciplinas: string[];
  projetos: string[];
  ativo: boolean;
  avatar?: string;
}

// Mapeamento de permissões por role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    // Todas as permissões
    'etapa.criar', 'etapa.editar', 'etapa.deletar', 'etapa.reordenar', 'etapa.duplicar',
    'tarefa.criar', 'tarefa.editar', 'tarefa.deletar', 'tarefa.reordenar', 'tarefa.duplicar', 'tarefa.mover',
    'timer.iniciar', 'timer.pausar', 'timer.parar', 'timer.editar_tempo',
    'projeto.configurar', 'projeto.arquivar', 'projeto.exportar',
    'usuario.convidar', 'usuario.remover', 'usuario.alterar_role',
    'dados.exportar', 'dados.importar', 'dados.backup',
    'view.dashboard', 'view.relatorios', 'view.financeiro'
  ],
  coordenador: [
    'etapa.criar', 'etapa.editar', 'etapa.duplicar', 'etapa.reordenar',
    'tarefa.criar', 'tarefa.editar', 'tarefa.duplicar', 'tarefa.reordenar', 'tarefa.mover',
    'timer.iniciar', 'timer.pausar', 'timer.parar',
    'projeto.configurar', 'projeto.exportar',
    'usuario.convidar',
    'dados.exportar',
    'view.dashboard', 'view.relatorios', 'view.financeiro'
  ],
  arquiteto: [
    'etapa.editar', 'etapa.duplicar',
    'tarefa.criar', 'tarefa.editar', 'tarefa.duplicar', 'tarefa.reordenar', 'tarefa.mover',
    'timer.iniciar', 'timer.pausar', 'timer.parar',
    'projeto.exportar',
    'dados.exportar',
    'view.dashboard', 'view.relatorios'
  ],
  tecnico: [
    'tarefa.editar', 'tarefa.duplicar',
    'timer.iniciar', 'timer.pausar', 'timer.parar',
    'dados.exportar',
    'view.dashboard'
  ],
  visualizador: [
    'view.dashboard'
  ]
};

// Descrições das roles
const ROLE_DESCRIPTIONS: Record<UserRole, { label: string; description: string; color: string }> = {
  admin: {
    label: 'Administrador',
    description: 'Acesso total ao sistema, pode gerenciar usuários e configurações',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  coordenador: {
    label: 'Coordenador',
    description: 'Gerencia projetos, etapas e equipes, sem acesso a configurações críticas',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  arquiteto: {
    label: 'Arquiteto',
    description: 'Cria e edita tarefas, gerencia cronogramas da sua disciplina',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  tecnico: {
    label: 'Técnico',
    description: 'Executa tarefas, controla timer, acesso limitado à edição',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  visualizador: {
    label: 'Visualizador',
    description: 'Apenas visualização, sem permissões de edição',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  }
};

interface PermissionContextType {
  currentUser: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccessResource: (resourceOwner?: string, disciplina?: string) => boolean;
  setCurrentUser: (user: User | null) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

interface PermissionProviderProps {
  children: React.ReactNode;
  initialUser?: User;
}

export function PermissionProvider({ children, initialUser }: PermissionProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser || null);

  // Simular carregamento do usuário atual (substituir por API real)
  useEffect(() => {
    if (!currentUser) {
      // Mock user para demonstração
      const mockUser: User = {
        id: '1',
        nome: 'João Silva',
        email: 'joao@arcflow.com',
        role: 'coordenador',
        disciplinas: ['Arquitetura', 'Estrutural'],
        projetos: ['1', '2', '3'],
        ativo: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      };
      setCurrentUser(mockUser);
    }
  }, [currentUser]);

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser || !currentUser.ativo) return false;
    return ROLE_PERMISSIONS[currentUser.role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    return currentUser?.role === role;
  };

  const canAccessResource = (resourceOwner?: string, disciplina?: string): boolean => {
    if (!currentUser) return false;
    
    // Admin pode acessar tudo
    if (currentUser.role === 'admin') return true;
    
    // Se é o dono do recurso
    if (resourceOwner && resourceOwner === currentUser.id) return true;
    
    // Se tem a disciplina necessária
    if (disciplina && currentUser.disciplinas.includes(disciplina)) return true;
    
    // Coordenador pode acessar recursos dos projetos que coordena
    if (currentUser.role === 'coordenador') return true;
    
    return false;
  };

  const value: PermissionContextType = {
    currentUser,
    hasPermission,
    hasAnyPermission,
    hasRole,
    canAccessResource,
    setCurrentUser,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

// Componente para proteger elementos baseado em permissões
interface ProtectedProps {
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole;
  resourceOwner?: string;
  disciplina?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  requireAll?: boolean; // Se true, requer TODAS as permissões. Se false, requer QUALQUER uma
}

export function Protected({
  permission,
  permissions,
  role,
  resourceOwner,
  disciplina,
  fallback,
  children,
  requireAll = false
}: ProtectedProps) {
  const { hasPermission, hasAnyPermission, hasRole, canAccessResource, currentUser } = usePermissions();

  // Verificar role específica
  if (role && !hasRole(role)) {
    return fallback || null;
  }

  // Verificar permissão única
  if (permission && !hasPermission(permission)) {
    return fallback || null;
  }

  // Verificar múltiplas permissões
  if (permissions) {
    const hasAccess = requireAll 
      ? permissions.every(p => hasPermission(p))
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return fallback || null;
    }
  }

  // Verificar acesso a recurso específico
  if ((resourceOwner || disciplina) && !canAccessResource(resourceOwner, disciplina)) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Componente de aviso de permissão negada
interface PermissionDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  showUpgrade?: boolean;
}

export function PermissionDenied({
  title = 'Acesso Negado',
  message = 'Você não tem permissão para acessar este recurso.',
  requiredRole,
  requiredPermissions,
  showUpgrade = true
}: PermissionDeniedProps) {
  const { currentUser } = usePermissions();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <LockClosedIcon className="w-12 h-12 text-gray-400 mb-4" />
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 max-w-md">
        {message}
      </p>

      {currentUser && (
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${ROLE_DESCRIPTIONS[currentUser.role].color}`}>
            <ShieldCheckIcon className="w-4 h-4 mr-1" />
            {ROLE_DESCRIPTIONS[currentUser.role].label}
          </span>
        </div>
      )}

      {requiredRole && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Role necessária:</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${ROLE_DESCRIPTIONS[requiredRole].color}`}>
            {ROLE_DESCRIPTIONS[requiredRole].label}
          </span>
        </div>
      )}

      {requiredPermissions && requiredPermissions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Permissões necessárias:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {requiredPermissions.map(perm => (
              <span key={perm} className="px-2 py-1 text-xs font-mono bg-gray-200 text-gray-700 rounded">
                {perm}
              </span>
            ))}
          </div>
        </div>
      )}

      {showUpgrade && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Solicitar Acesso
        </button>
      )}
    </div>
  );
}

// Hook para verificações de permissão específicas do CRUD
export function useCrudPermissions() {
  const { hasPermission, canAccessResource } = usePermissions();

  return {
    // Permissões de Etapa
    canCreateEtapa: () => hasPermission('etapa.criar'),
    canEditEtapa: (etapaOwner?: string, disciplina?: string) => 
      hasPermission('etapa.editar') && canAccessResource(etapaOwner, disciplina),
    canDeleteEtapa: (etapaOwner?: string, disciplina?: string) => 
      hasPermission('etapa.deletar') && canAccessResource(etapaOwner, disciplina),
    canReorderEtapas: () => hasPermission('etapa.reordenar'),
    canDuplicateEtapa: () => hasPermission('etapa.duplicar'),

    // Permissões de Tarefa
    canCreateTarefa: () => hasPermission('tarefa.criar'),
    canEditTarefa: (tarefaOwner?: string, disciplina?: string) => 
      hasPermission('tarefa.editar') && canAccessResource(tarefaOwner, disciplina),
    canDeleteTarefa: (tarefaOwner?: string, disciplina?: string) => 
      hasPermission('tarefa.deletar') && canAccessResource(tarefaOwner, disciplina),
    canReorderTarefas: () => hasPermission('tarefa.reordenar'),
    canDuplicateTarefa: () => hasPermission('tarefa.duplicar'),
    canMoveTarefa: () => hasPermission('tarefa.mover'),

    // Permissões de Timer
    canStartTimer: (tarefaOwner?: string, disciplina?: string) => 
      hasPermission('timer.iniciar') && canAccessResource(tarefaOwner, disciplina),
    canPauseTimer: (tarefaOwner?: string, disciplina?: string) => 
      hasPermission('timer.pausar') && canAccessResource(tarefaOwner, disciplina),
    canStopTimer: (tarefaOwner?: string, disciplina?: string) => 
      hasPermission('timer.parar') && canAccessResource(tarefaOwner, disciplina),
    canEditTime: () => hasPermission('timer.editar_tempo'),

    // Permissões de Projeto
    canConfigureProject: () => hasPermission('projeto.configurar'),
    canArchiveProject: () => hasPermission('projeto.arquivar'),
    canExportProject: () => hasPermission('projeto.exportar'),

    // Permissões de Visualização
    canViewDashboard: () => hasPermission('view.dashboard'),
    canViewReports: () => hasPermission('view.relatorios'),
    canViewFinancial: () => hasPermission('view.financeiro'),
  };
}

// Componente para mostrar informações do usuário atual
export function CurrentUserInfo() {
  const { currentUser } = usePermissions();

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      {currentUser.avatar ? (
        <img 
          src={currentUser.avatar} 
          alt={currentUser.nome}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {currentUser.nome.charAt(0)}
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {currentUser.nome}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {currentUser.email}
        </p>
      </div>
      
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${ROLE_DESCRIPTIONS[currentUser.role].color}`}>
        {ROLE_DESCRIPTIONS[currentUser.role].label}
      </span>
    </div>
  );
} 