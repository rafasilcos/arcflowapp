'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// ✅ CONFIGURAÇÃO OTIMIZADA DO QUERY CLIENT
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache strategies optimized for production
        staleTime: 5 * 60 * 1000,      // 5 minutes stale time
        gcTime: 10 * 60 * 1000,        // 10 minutes garbage collection
        
        // Performance optimizations
        refetchOnWindowFocus: false,    // Don't refetch on focus
        refetchOnMount: true,           // Always refetch on component mount
        refetchOnReconnect: true,       // Refetch when reconnecting
        
        // Error handling
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors except 408 (timeout)
          if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 408) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Error handling for mutations
        retry: (failureCount, error: any) => {
          // Don't retry client errors
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 1;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ✅ DEVTOOLS ONLY IN DEVELOPMENT */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
} 