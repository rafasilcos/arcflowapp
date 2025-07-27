'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, Play, Pause, Square, CheckCircle2, AlertTriangle, Clock,
  Users, MessageSquare, Bell, Settings, Eye, EyeOff, Plus, Edit3,
  List, Calendar, Columns, Upload, Send, Trash2, GripVertical,
  MoreHorizontal, User, ChevronDown, ChevronRight, Focus, FileText,
  Paperclip, Target, Search, Filter, Home, ArrowRight, Timer,
  Zap, TrendingUp, Activity, Save, ChevronUp, PanelRightClose,
  PanelRightOpen, Workflow, BarChart3, Maximize2, Minimize2,
  PlayCircle, PauseCircle, StopCircle, Volume2, VolumeX,
  Lightbulb, Coffee, Headphones, Layers, GitBranch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces baseadas no prompt detalhado
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

interface TimerSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  notes: string;
  productivity: 'high' | 'medium' | 'low';
}

interface TaskTimer {
  isRunning: boolean;
  currentSessionId?: string;
  sessions: TimerSession[];
  totalTime: number;
  estimatedTime: number;
  efficiency: number;
}

interface TaskApproval {
  required: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'needs_correction';
  manager: TeamMember;
  files: File[];
  feedback?: string;
  corrections?: string[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
  phaseId: string;
  assignee: TeamMember;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'paused' | 'review' | 'completed' | 'blocked';
  estimatedHours: number;
  actualHours: number;
  timer: TaskTimer;
  notes: string[];
  files: File[];
  approval?: TaskApproval;
  dependencies: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

interface Phase {
  id: string;
  name: string;
  order: number;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  tasks: Task[];
  dependencies: string[];
  estimatedHours: number;
  actualHours: number;
  progress: number;
  isCollapsed: boolean;
}

interface Project {
  id: string;
  name: string;
  client: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: Date;
  budget: {
    estimated: number;
    used: number;
    remaining: number;
  };
  team: TeamMember[];
  phases: Phase[];
  progress: number;
}

interface Message {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'task_update' | 'system';
  taskId?: string;
  phaseId?: string;
  mentions: string[];
  isImportant: boolean;
}

interface ProductivityMetrics {
  dailyHours: number;
  weeklyEfficiency: number;
  taskCompletionRate: number;
  averageTaskDuration: number;
  mostProductiveHours: number[];
  burnoutRisk: 'low' | 'medium' | 'high';
}

interface DashboardProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDashboardQuantico({ params }: DashboardProps) {
  const { id: projectId } = use(params);
  
  // Estados principais
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline'>('list');
  const [activeTaskId, setActiveTaskId] = useState<string | null>('task_002');
  const [focusMode, setFocusMode] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'files' | 'activity' | 'team'>('chat');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  
  // Estados do cronômetro
  const [currentTime, setCurrentTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Dados mock do projeto
  const project: Project = {
    id: projectId,
    name: 'Edifício Comercial Downtown',
    client: 'Empresa ABC Ltda',
    type: 'commercial',
    status: 'active',
    priority: 'high',
    deadline: new Date('2024-12-31'),
    budget: {
      estimated: 850000,
      used: 520000,
      remaining: 330000
    },
    team: [
      {
        id: 'user_001',
        name: 'João Silva',
        email: 'joao@arcflow.com',
        avatar: 'JS',
        role: 'Arquiteto Sênior',
        status: 'online'
      },
      {
        id: 'user_002',
        name: 'Maria Santos',
        email: 'maria@arcflow.com',
        avatar: 'MS',
        role: 'Projetista',
        status: 'busy'
      },
      {
        id: 'user_003',
        name: 'Carlos Lima',
        email: 'carlos@arcflow.com',
        avatar: 'CL',
        role: 'Engenheiro',
        status: 'away'
      }
    ],
    phases: [
      {
        id: 'phase_001',
        name: 'Estudo Preliminar',
        order: 1,
        description: 'Análise inicial do projeto e levantamento de requisitos',
        status: 'completed',
        dependencies: [],
        estimatedHours: 120,
        actualHours: 115,
        progress: 100,
        isCollapsed: false,
        tasks: [
          {
            id: 'task_001',
            title: 'Levantamento do terreno e análise de viabilidade',
            description: 'Estudo topográfico e análise de potencial construtivo',
            order: 1,
            phaseId: 'phase_001',
            assignee: {
              id: 'user_001',
              name: 'João Silva',
              email: 'joao@arcflow.com',
              avatar: 'JS',
              role: 'Arquiteto Sênior',
              status: 'online'
            },
            priority: 'high',
            status: 'completed',
            estimatedHours: 8,
            actualHours: 7.5,
            timer: {
              isRunning: false,
              sessions: [],
              totalTime: 27000, // 7.5 horas em segundos
              estimatedTime: 28800, // 8 horas em segundos
              efficiency: 107
            },
            notes: ['Terreno com boa localização', 'Aprovação municipal necessária'],
            files: [],
            dependencies: [],
            tags: ['topografia', 'viabilidade'],
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-20'),
            dueDate: new Date('2024-01-25')
          }
        ]
      },
      {
        id: 'phase_002',
        name: 'Anteprojeto',
        order: 2,
        description: 'Desenvolvimento do anteprojeto arquitetônico',
        status: 'in_progress',
        dependencies: ['phase_001'],
        estimatedHours: 200,
        actualHours: 85,
        progress: 42,
        isCollapsed: false,
        tasks: [
          {
            id: 'task_002',
            title: 'Desenho da planta baixa - Pavimento Térreo',
            description: 'Desenvolvimento das plantas baixas do pavimento térreo',
            order: 1,
            phaseId: 'phase_002',
            assignee: {
              id: 'user_002',
              name: 'Maria Santos',
              email: 'maria@arcflow.com',
              avatar: 'MS',
              role: 'Projetista',
              status: 'busy'
            },
            priority: 'critical',
            status: 'in_progress',
            estimatedHours: 24,
            actualHours: 15.5,
            timer: {
              isRunning: true,
              currentSessionId: 'session_001',
              sessions: [
                {
                  id: 'session_001',
                  startTime: new Date('2024-03-08T09:00:00'),
                  duration: 7200, // 2 horas
                  notes: 'Definindo layout principal',
                  productivity: 'high'
                }
              ],
              totalTime: 55800, // 15.5 horas em segundos
              estimatedTime: 86400, // 24 horas em segundos
              efficiency: 85
            },
            notes: ['Cliente solicitou ajustes na recepção', 'Verificar normas de acessibilidade'],
            files: [],
            approval: {
              required: true,
              status: 'pending',
              manager: {
                id: 'user_001',
                name: 'João Silva',
                email: 'joao@arcflow.com',
                avatar: 'JS',
                role: 'Arquiteto Sênior',
                status: 'online'
              },
              files: []
            },
            dependencies: ['task_001'],
            tags: ['plantas', 'térreo', 'layout'],
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-03-08'),
            dueDate: new Date('2024-03-15')
          },
          {
            id: 'task_003',
            title: 'Cortes e fachadas principais',
            description: 'Desenvolvimento dos cortes arquitetônicos e fachadas',
            order: 2,
            phaseId: 'phase_002',
            assignee: {
              id: 'user_003',
              name: 'Carlos Lima',
              email: 'carlos@arcflow.com',
              avatar: 'CL',
              role: 'Engenheiro',
              status: 'away'
            },
            priority: 'high',
            status: 'todo',
            estimatedHours: 20,
            actualHours: 0,
            timer: {
              isRunning: false,
              sessions: [],
              totalTime: 0,
              estimatedTime: 72000, // 20 horas em segundos
              efficiency: 0
            },
            notes: [],
            files: [],
            dependencies: ['task_002'],
            tags: ['cortes', 'fachadas', 'elevações'],
            createdAt: new Date('2024-02-05'),
            updatedAt: new Date('2024-02-05'),
            dueDate: new Date('2024-03-20')
          }
        ]
      },
      {
        id: 'phase_003',
        name: 'Projeto Executivo',
        order: 3,
        description: 'Detalhamento completo para execução',
        status: 'not_started',
        dependencies: ['phase_002'],
        estimatedHours: 300,
        actualHours: 0,
        progress: 0,
        isCollapsed: true,
        tasks: []
      }
    ],
    progress: 65
  };

  // Mensagens do chat
  const messages: Message[] = [
    {
      id: 'msg_001',
      author: project.team[1],
      content: 'João, as plantas do térreo estão 90% prontas. Posso enviar para sua revisão?',
      timestamp: new Date('2024-03-08T14:30:00'),
      type: 'text',
      taskId: 'task_002',
      mentions: ['João Silva'],
      isImportant: false
    },
    {
      id: 'msg_002',
      author: project.team[0],
      content: '@Maria Santos Perfeito! Pode enviar sim. Vou revisar ainda hoje.',
      timestamp: new Date('2024-03-08T14:45:00'),
      type: 'text',
      taskId: 'task_002',
      mentions: ['Maria Santos'],
      isImportant: false
    },
    {
      id: 'msg_003',
      author: project.team[2],
      content: 'Pessoal, preciso das plantas aprovadas para iniciar os cortes. Qual o prazo estimado?',
      timestamp: new Date('2024-03-08T15:20:00'),
      type: 'text',
      mentions: [],
      isImportant: true
    }
  ];

  // Métricas de produtividade
  const productivityMetrics: ProductivityMetrics = {
    dailyHours: 7.5,
    weeklyEfficiency: 87,
    taskCompletionRate: 92,
    averageTaskDuration: 4.2,
    mostProductiveHours: [9, 10, 14, 15],
    burnoutRisk: 'low'
  };

  // Funções utilitárias
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeSimple = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'todo': return '📋';
      case 'in_progress': return '🔄';
      case 'paused': return '⏸️';
      case 'review': return '👁️';
      case 'completed': return '✅';
      case 'blocked': return '🚫';
      default: return '📋';
    }
  };

  // Obter tarefa ativa
  const activeTask = project.phases
    .flatMap(phase => phase.tasks)
    .find(task => task.id === activeTaskId);

  // Obter tarefas críticas
  const criticalTasks = project.phases
    .flatMap(phase => phase.tasks)
    .filter(task => task.priority === 'critical' && task.status !== 'completed');

  const overdueTasks = project.phases
    .flatMap(phase => phase.tasks)
    .filter(task => task.dueDate && new Date() > task.dueDate && task.status !== 'completed');

  const pendingApprovals = project.phases
    .flatMap(phase => phase.tasks)
    .filter(task => task.approval?.status === 'pending');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && activeTask?.timer.isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeTask]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !focusMode) {
        e.preventDefault();
        setIsTimerRunning(!isTimerRunning);
      }
      if (e.code === 'Escape' && focusMode) {
        setFocusMode(false);
      }
      if (e.code === 'KeyF' && e.ctrlKey) {
        e.preventDefault();
        setFocusMode(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTimerRunning, focusMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER PRINCIPAL */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">ArcFlow</span>
            </div>
            <div className="text-gray-400">|</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-600">{project.client}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(project.status)}>
                {project.status.toUpperCase()}
              </Badge>
            </div>
            
                         <div className="flex items-center space-x-2">
               <Button
                 variant={viewMode === 'list' ? 'primary' : 'outline'}
                 size="sm"
                 onClick={() => setViewMode('list')}
               >
                 <List className="h-4 w-4" />
               </Button>
               <Button
                 variant={viewMode === 'kanban' ? 'primary' : 'outline'}
                 size="sm"
                 onClick={() => setViewMode('kanban')}
               >
                 <Columns className="h-4 w-4" />
               </Button>
               <Button
                 variant={viewMode === 'timeline' ? 'primary' : 'outline'}
                 size="sm"
                 onClick={() => setViewMode('timeline')}
               >
                 <Calendar className="h-4 w-4" />
               </Button>
             </div>
             
             <Button
               variant={focusMode ? 'primary' : 'outline'}
               size="sm"
               onClick={() => setFocusMode(!focusMode)}
             >
              <Focus className="h-4 w-4 mr-2" />
              Foco
            </Button>
            
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {criticalTasks.length + overdueTasks.length}
              </span>
            </div>
            
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {project.team[0].avatar}
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* SIDEBAR ESQUERDA - QUICK ACTIONS */}
        <div className="w-80 bg-white border-r p-6 overflow-y-auto">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  if (activeTask) {
                    setIsTimerRunning(!isTimerRunning);
                  }
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                {isTimerRunning ? 'Pausar Timer' : 'Iniciar Timer'}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Nova Fase
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Arquivo
              </Button>
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Visão Geral
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(229 231 235)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(59 130 246)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${project.progress * 2.83} 283`}
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${project.progress * 2.83} 283` }}
                        transition={{ duration: 1.5 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{project.progress}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Progresso Geral</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">💰 Orçamento:</span>
                    <span className="font-medium">
                      R$ {(project.budget.used / 1000).toFixed(0)}k / {(project.budget.estimated / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📅 Prazo:</span>
                    <span className="font-medium">
                      {project.deadline.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">👥 Equipe:</span>
                    <span className="font-medium">{project.team.length} pessoas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Críticos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Alertas Críticos
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-red-700">🔴 Tarefas atrasadas</span>
                <span className="font-bold text-red-700">{overdueTasks.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-700">🟡 Tarefas críticas</span>
                <span className="font-bold text-yellow-700">{criticalTasks.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">🔵 Aguardando aprovação</span>
                <span className="font-bold text-blue-700">{pendingApprovals.length}</span>
              </div>
            </div>
          </div>

          {/* Métricas de Produtividade */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Produtividade
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Horas hoje:</span>
                <span className="font-medium text-green-600">{productivityMetrics.dailyHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eficiência semanal:</span>
                <span className="font-medium text-blue-600">{productivityMetrics.weeklyEfficiency}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa conclusão:</span>
                <span className="font-medium text-purple-600">{productivityMetrics.taskCompletionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risco burnout:</span>
                <Badge className={
                  productivityMetrics.burnoutRisk === 'low' ? 'bg-green-100 text-green-700' :
                  productivityMetrics.burnoutRisk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }>
                  {productivityMetrics.burnoutRisk.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tarefas Recentes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              Tarefas Recentes
            </h3>
            <div className="space-y-2">
              {project.phases.flatMap(phase => phase.tasks)
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 3)
                .map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      task.id === activeTaskId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTaskId(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {getStatusIcon(task.status)} {task.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      👤 {task.assignee.name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ÁREA CENTRAL - CONTEÚDO PRINCIPAL */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Barra de Controles */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar tarefas, pessoas, arquivos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <select 
                  value={density} 
                  onChange={(e) => setDensity(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-3 py-1"
                >
                  <option value="compact">Compacto</option>
                  <option value="comfortable">Confortável</option>
                  <option value="spacious">Espaçoso</option>
                </select>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hierarquia do Projeto */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Workflow className="h-5 w-5 mr-2 text-blue-600" />
              Hierarquia do Projeto
            </h2>

            {project.phases.map((phase) => (
              <Card key={phase.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          // Toggle collapse logic would go here
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {phase.isCollapsed ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <h4 className="font-semibold text-gray-900">
                        FASE {phase.order}: {phase.name}
                      </h4>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Progress value={phase.progress} className="w-24" />
                        <span className="text-sm font-medium text-gray-600">
                          {phase.progress}%
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {phase.description && (
                    <p className="text-sm text-gray-600 ml-8">{phase.description}</p>
                  )}
                </CardHeader>
                
                {!phase.isCollapsed && (
                  <CardContent className="pt-0">
                    <div className={`space-y-3 ml-6 ${
                      density === 'compact' ? 'space-y-2' : 
                      density === 'spacious' ? 'space-y-4' : 'space-y-3'
                    }`}>
                      {phase.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                            task.id === activeTaskId 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          } ${
                            density === 'compact' ? 'p-3' :
                            density === 'spacious' ? 'p-5' : 'p-4'
                          }`}
                          onClick={() => setActiveTaskId(task.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getStatusIcon(task.status)}
                                </span>
                                <span className={`font-medium text-gray-900 ${
                                  density === 'compact' ? 'text-sm' :
                                  density === 'spacious' ? 'text-lg' : 'text-base'
                                }`}>
                                  {task.title}
                                </span>
                              </div>
                              
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority.toUpperCase()}
                              </Badge>
                              
                              <div className="text-sm text-gray-600">
                                👤 {task.assignee.name}
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                ⏱️ {formatTimeSimple(task.timer.totalTime)} / {formatTimeSimple(task.timer.estimatedTime)}
                              </div>

                              {task.timer.efficiency > 0 && (
                                <div className={`text-sm font-medium ${
                                  task.timer.efficiency > 100 ? 'text-green-600' :
                                  task.timer.efficiency > 80 ? 'text-blue-600' :
                                  task.timer.efficiency > 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {task.timer.efficiency}% eficiência
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {task.status === 'todo' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTaskId(task.id);
                                    setIsTimerRunning(true);
                                  }}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Iniciar
                                </Button>
                              )}
                              
                              {task.status === 'in_progress' && (
                                <>
                                  {task.timer.isRunning ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-orange-300 text-orange-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsTimerRunning(false);
                                      }}
                                    >
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pausar
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-300 text-green-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTaskId(task.id);
                                        setIsTimerRunning(true);
                                      }}
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Retomar
                                    </Button>
                                  )}
                                </>
                              )}
                              
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>

                              {task.approval && (
                                <Badge className={
                                  task.approval.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  task.approval.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  task.approval.status === 'needs_correction' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-blue-100 text-blue-700'
                                }>
                                  {task.approval.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {task.description && density !== 'compact' && (
                            <p className="text-sm text-gray-600 mt-2 ml-8">{task.description}</p>
                          )}
                          
                          {task.notes.length > 0 && (
                            <div className="mt-2 ml-8">
                              {task.notes.slice(0, 2).map((note, index) => (
                                <div key={index} className="text-sm text-blue-700 bg-blue-50 rounded p-2 mt-1">
                                  💭 {note}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 ml-6">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Tarefa
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
            
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Fase
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Tudo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL DIREITO - COMUNICAÇÃO */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-l overflow-hidden"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Comunicação</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightPanelOpen(false)}
                >
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {(['chat', 'files', 'activity', 'team'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRightPanelTab(tab)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      rightPanelTab === tab
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'chat' && '💬'} {tab === 'files' && '📁'} 
                    {tab === 'activity' && '📋'} {tab === 'team' && '👥'}
                    {' '}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)]">
              {rightPanelTab === 'chat' && (
                <div className="p-4">
                  <div className="space-y-4 mb-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {msg.author.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {msg.author.name.split(' ')[0]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {msg.isImportant && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Importante
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{msg.content}</p>
                          {msg.taskId && (
                            <div className="text-xs text-blue-600 mt-1">
                              📋 Relacionado à tarefa
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Digite sua mensagem... @mencionar"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // Send message logic
                            setChatMessage('');
                          }
                        }}
                      />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {rightPanelTab === 'files' && (
                <div className="p-4">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Nenhum arquivo compartilhado</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Arquivo
                    </Button>
                  </div>
                </div>
              )}

              {rightPanelTab === 'activity' && (
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Maria concluiu</span>
                      <span className="font-medium">Plantas baixas</span>
                      <span className="text-gray-500">2h atrás</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">João iniciou</span>
                      <span className="font-medium">Revisão do projeto</span>
                      <span className="text-gray-500">4h atrás</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Carlos pausou</span>
                      <span className="font-medium">Cortes e fachadas</span>
                      <span className="text-gray-500">1d atrás</span>
                    </div>
                  </div>
                </div>
              )}

              {rightPanelTab === 'team' && (
                <div className="p-4">
                  <div className="space-y-3">
                    {project.team.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className={`text-xs flex items-center ${
                            member.status === 'online' ? 'text-green-600' :
                            member.status === 'busy' ? 'text-yellow-600' :
                            member.status === 'away' ? 'text-orange-600' : 'text-gray-500'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              member.status === 'online' ? 'bg-green-500' :
                              member.status === 'busy' ? 'bg-yellow-500' :
                              member.status === 'away' ? 'bg-orange-500' : 'bg-gray-400'
                            }`} />
                            {member.status === 'online' ? 'Online' :
                             member.status === 'busy' ? 'Ocupado' :
                             member.status === 'away' ? 'Ausente' : 'Offline'}
                            {member.role && ` • ${member.role}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão para abrir painel direito quando fechado */}
      {!rightPanelOpen && (
        <div className="w-12 bg-white border-l flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(true)}
            className="h-full w-full"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* MODO FOCO IMERSIVO */}
      <AnimatePresence>
        {focusMode && activeTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Modo Foco</h2>
                <Button
                  variant="ghost"
                  onClick={() => setFocusMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Minimize2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTask.title}
                </h3>
                <p className="text-gray-600">{activeTask.description}</p>
              </div>

              {/* Timer Gigante */}
              <div className="text-center mb-8">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(229 231 235)"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(34 197 94)"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (activeTask.timer.totalTime / activeTask.timer.estimatedTime) * 283}
                      animate={isTimerRunning ? { strokeDashoffset: [283, 0, 283] } : {}}
                      transition={isTimerRunning ? { duration: 60, repeat: Infinity } : {}}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 font-mono">
                      {formatTime(activeTask.timer.totalTime + currentTime)}
                    </span>
                    <span className="text-sm text-gray-600">tempo total</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  <Button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    size="lg"
                    className={isTimerRunning ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Parar
                  </Button>
                </div>
              </div>

              {/* Campo de Notas */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas da Sessão
                </label>
                <Textarea
                  placeholder="Anote suas ideias e observações..."
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Pressione ESC para sair do modo foco
                </div>
                <Button onClick={() => setFocusMode(false)}>
                  Finalizar Foco
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRONÔMETRO FLUTUANTE */}
      <AnimatePresence>
        {activeTask?.timer.isRunning && isTimerRunning && !focusMode && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg border-2 border-green-500 p-4 z-40 cursor-pointer"
            onClick={() => setFocusMode(true)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(229 231 235)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(34 197 94)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    animate={{ strokeDashoffset: [70, 283, 70] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-green-600" />
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-bold text-gray-900 font-mono">
                  {formatTime(currentTime)}
                </div>
                <div className="text-gray-600 truncate max-w-32">
                  {activeTask.title}
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTimerRunning(false);
                  }}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTimerRunning(false);
                    setCurrentTime(0);
                  }}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 