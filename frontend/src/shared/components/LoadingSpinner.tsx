/**
 * ⏳ COMPONENTE DE LOADING SPINNER
 * 
 * Spinner de carregamento reutilizável com mensagens customizáveis
 */

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ 
  message = 'Carregando...', 
  submessage,
  size = 'md' 
}: LoadingSpinnerProps) {
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-4 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
      <p className="text-lg text-gray-600 mb-2">{message}</p>
      {submessage && (
        <p className="text-sm text-gray-500">{submessage}</p>
      )}
    </div>
  );
}