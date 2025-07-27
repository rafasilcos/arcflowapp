'use client';

import React from 'react';
import { BackendConnectionTest } from '@/components/debug/BackendConnectionTest';

export default function TestBackendPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Teste de Conexão Backend ArcFlow
          </h1>
          <p className="text-gray-600">
            Verifique se o backend está funcionando corretamente
          </p>
        </div>
        
        <BackendConnectionTest />
      </div>
    </div>
  );
} 