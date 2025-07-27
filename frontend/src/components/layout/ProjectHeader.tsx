import React from 'react';
import { ArrowLeft, ChevronRight, Timer } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectHeaderProps {
  projectName: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  onBack,
  children
}) => {
  const { temaId } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback para navegação do browser
      window.history.back();
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Breadcrumb de Navegação */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleBack}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            temaId === 'elegante'
              ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Projetos</span>
        </button>
        
        <ChevronRight className={`w-4 h-4 ${
          temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
        }`} />
        
        <span className={`font-semibold ${
          temaId === 'elegante' ? 'text-gray-900' : 'text-white'
        }`}>
          {projectName}
        </span>
      </div>

      {/* Área para componentes adicionais (cronômetro, status, etc.) */}
      {children && (
        <div className="flex items-center space-x-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Componente específico para o cronômetro
export const ProjectHeaderWithTimer: React.FC<{
  projectName: string;
  onBack?: () => void;
  elapsed?: number;
  isRunning?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  lastSaved?: Date;
  isSaving?: boolean;
}> = ({
  projectName,
  onBack,
  elapsed = 0,
  isRunning = false,
  onStart,
  onPause,
  onReset,
  lastSaved,
  isSaving
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ProjectHeader projectName={projectName} onBack={onBack}>
      {/* Cronômetro */}
      <div className="flex items-center space-x-2">
        <Timer className="w-4 h-4" />
        <span className="font-mono text-lg">{formatTime(elapsed)}</span>
        <button
          onClick={isRunning ? onPause : onStart}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100"
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={onReset}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {/* Status de salvamento */}
      <div className="flex flex-col items-end text-xs">
        {lastSaved && (
          <span className="text-green-600">
            Salvo em {lastSaved.toLocaleTimeString()}
          </span>
        )}
        {isSaving && (
          <span className="text-blue-600">Salvando...</span>
        )}
      </div>
    </ProjectHeader>
  );
}; 