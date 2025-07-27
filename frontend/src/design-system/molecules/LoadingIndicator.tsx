'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { designTokens } from '../tokens';
import type { LoadingState } from '@/hooks/useSmartLoading';

// ===== TIPOS =====
export interface LoadingIndicatorProps {
  state: LoadingState;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'overlay' | 'card';
  showProgress?: boolean;
  showMessage?: boolean;
  className?: string;
}

// ===== CONFIGURAÇÕES DE TAMANHO =====
const sizeConfig = {
  sm: {
    spinner: 'h-4 w-4',
    progress: 'h-1',
    text: 'text-xs',
    padding: 'p-2'
  },
  md: {
    spinner: 'h-6 w-6',
    progress: 'h-2',
    text: 'text-sm',
    padding: 'p-3'
  },
  lg: {
    spinner: 'h-8 w-8',
    progress: 'h-3',
    text: 'text-base',
    padding: 'p-4'
  }
} as const;

// ===== COMPONENTE PRINCIPAL =====
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  state,
  size = 'md',
  variant = 'inline',
  showProgress = true,
  showMessage = true,
  className = ''
}) => {
  const config = sizeConfig[size];

  // ===== ANIMAÇÕES FRAMER MOTION =====
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: variant === 'overlay' ? 0 : -10,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    },
    exit: { 
      opacity: 0, 
      y: variant === 'overlay' ? 0 : -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn" as const
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${state.progress}%`,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  // ===== RENDERIZAÇÃO BASEADA NO ESTADO =====
  const renderIcon = () => {
    if (state.success) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 20 
          }}
        >
          <CheckCircle2 className={`${config.spinner} text-green-600`} />
        </motion.div>
      );
    }

    if (state.error) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 20 
          }}
        >
          <AlertCircle className={`${config.spinner} text-red-600`} />
        </motion.div>
      );
    }

    if (state.loading) {
      return (
        <motion.div
          variants={spinnerVariants}
          animate="spin"
        >
          <Loader2 className={`${config.spinner} text-blue-600`} />
        </motion.div>
      );
    }

    return null;
  };

  const renderProgressBar = () => {
    if (!showProgress || (!state.loading && !state.success)) return null;

    return (
      <div className={`relative bg-gray-200 rounded-full ${config.progress} overflow-hidden`}>
        <motion.div
          className={`absolute top-0 left-0 ${config.progress} rounded-full ${
            state.success 
              ? 'bg-green-500' 
              : state.error 
                ? 'bg-red-500' 
                : 'bg-blue-500'
          }`}
          variants={progressVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Shimmer effect durante loading */}
        {state.loading && (
          <motion.div
            className={`absolute top-0 left-0 ${config.progress} rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent`}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
          />
        )}
      </div>
    );
  };

  // ===== RENDERIZAÇÃO POR VARIANTE =====
  const renderInline = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex items-center space-x-2 ${className}`}
    >
      {renderIcon()}
      {showMessage && (
        <div className="flex-1 min-w-0">
          {showMessage && (
            <motion.p 
              className={`${config.text} font-medium ${
                state.success 
                  ? 'text-green-700' 
                  : state.error 
                    ? 'text-red-700' 
                    : 'text-gray-700'
              } truncate`}
              key={state.message} // Key change triggers animation
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {state.message}
            </motion.p>
          )}
          {renderProgressBar()}
        </div>
      )}
    </motion.div>
  );

  const renderCard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`bg-white rounded-lg border shadow-sm ${config.padding} ${className}`}
    >
      <div className="flex items-center space-x-3">
        {renderIcon()}
        <div className="flex-1 min-w-0">
          {showMessage && (
            <motion.p 
              className={`${config.text} font-medium ${
                state.success 
                  ? 'text-green-700' 
                  : state.error 
                    ? 'text-red-700' 
                    : 'text-gray-700'
              }`}
              key={state.message}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {state.message}
            </motion.p>
          )}
          {showProgress && state.loading && (
            <motion.p 
              className="text-xs text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {state.progress}% concluído
            </motion.p>
          )}
        </div>
      </div>
      {renderProgressBar() && (
        <div className="mt-3">
          {renderProgressBar()}
        </div>
      )}
    </motion.div>
  );

  const renderOverlay = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm ${className}`}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 mx-4 max-w-sm w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          {renderIcon()}
          {showMessage && (
            <motion.div 
              className="space-y-2"
              key={state.message}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className={`${config.text} font-medium ${
                state.success 
                  ? 'text-green-700' 
                  : state.error 
                    ? 'text-red-700' 
                    : 'text-gray-700'
              }`}>
                {state.message}
              </p>
              {showProgress && state.loading && (
                <p className="text-xs text-gray-500">
                  {state.progress}% concluído
                </p>
              )}
            </motion.div>
          )}
          {renderProgressBar() && (
            <div className="w-full">
              {renderProgressBar()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // ===== RENDERIZAÇÃO PRINCIPAL =====
  return (
    <AnimatePresence mode="wait">
      {(state.loading || state.success || state.error) && (
        <>
          {variant === 'inline' && renderInline()}
          {variant === 'card' && renderCard()}
          {variant === 'overlay' && renderOverlay()}
        </>
      )}
    </AnimatePresence>
  );
};

// ===== COMPONENTE DE BARRA DE PROGRESSO STANDALONE =====
export const ProgressBar: React.FC<{
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'amber';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}> = ({
  progress,
  size = 'md',
  color = 'blue',
  showPercentage = false,
  animated = true,
  className = ''
}) => {
  const config = sizeConfig[size];
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500'
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className={`${config.text} text-gray-600`}>Progresso</span>
          <span className={`${config.text} font-medium text-gray-900`}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className={`relative bg-gray-200 rounded-full ${config.progress} overflow-hidden`}>
        <motion.div
          className={`absolute top-0 left-0 ${config.progress} rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          transition={animated ? { 
            duration: 0.5, 
            ease: "easeOut" as const
          } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

// ===== COMPONENTE DE LOADING SKELETON =====
export const LoadingSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <motion.div
        key={index}
        className="h-4 bg-gray-200 rounded animate-pulse"
        style={{ width: `${Math.random() * 40 + 60}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
      />
    ))}
  </div>
); 