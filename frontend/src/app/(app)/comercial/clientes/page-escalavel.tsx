// 🚀 PÁGINA DE CLIENTES ESCALÁVEL
// MUDANÇA SIMPLES: Trocar Context por React Query

'use client'

import React, { Suspense, lazy, useCallback } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
// import { useModalCliente } from '@/stores/uiStore' // TODO: Implementar modal

// ✅ LAZY LOADING DE COMPONENTES PESADOS
const ClientesListaVirtual = lazy(() => import('@/components/clientes/ClientesListaVirtual'))

// ✅ QUERY CLIENT CONFIGURADO PARA PRODUÇÃO
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutos fresh
      refetchOnWindowFocus: false,    // Não refetch automatico
      retry: 2,                       // Retry automático
      refetchOnMount: 'always',       // Sempre refetch no mount
    },
    mutations: {
      retry: 1,                       // Retry uma vez para mutations
    },
  },
})

// ✅ LOADING SKELETON PARA LISTA
const ListaSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    {/* Header Skeleton */}
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="h-10 bg-blue-200 rounded w-32 animate-pulse"></div>
      </div>
    </div>
    
    {/* Filters Skeleton */}
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <div className="h-10 bg-gray-200 rounded flex-1 max-w-md animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </div>
    
    {/* Items Skeleton */}
    <div className="space-y-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border-b">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ✅ LOADING SKELETON PARA MODAL
const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-10 bg-blue-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  </div>
)

// ✅ COMPONENTE PRINCIPAL DA PÁGINA
const ClientesPageEscalavel = () => {
  // ✅ CALLBACKS MEMOIZADOS PARA PERFORMANCE
  const handleCreateCliente = useCallback(() => {
    console.log('Criar cliente')
    // TODO: Implementar modal ou navegação
  }, [])
  
  const handleEditCliente = useCallback((id: string) => {
    console.log('Editar cliente:', id)
    // TODO: Implementar modal ou navegação
  }, [])
  
  const handleViewCliente = useCallback((id: string) => {
    console.log('Visualizar cliente:', id)
    // TODO: Implementar modal ou navegação
  }, [])
  
  const handleDeleteCliente = useCallback((id: string) => {
    // Implementar lógica de confirmação e delete
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      console.log('Deletar cliente:', id)
      // TODO: Implementar hook de delete
    }
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* ✅ BREADCRUMB */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-4 text-sm text-gray-600">
              <span>Comercial</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Clientes</span>
            </div>
          </div>
        </div>
        
        {/* ✅ CONTEÚDO PRINCIPAL */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header da Página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestão de Clientes
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie todos os seus clientes de forma eficiente
            </p>
          </div>
          
          {/* ✅ LISTA VIRTUAL COM LAZY LOADING */}
          <Suspense fallback={<ListaSkeleton />}>
            <ClientesListaVirtual
              onCreateCliente={handleCreateCliente}
              onEditCliente={handleEditCliente}
              onDeleteCliente={handleDeleteCliente}
              onViewCliente={handleViewCliente}
            />
          </Suspense>
        </div>
        
        {/* ✅ TODO: Implementar modal de cliente */}
        
        {/* ✅ TOAST NOTIFICATIONS */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        
        {/* ✅ REACT QUERY DEVTOOLS (APENAS EM DEV) */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </div>
    </QueryClientProvider>
  )
}

export default ClientesPageEscalavel 