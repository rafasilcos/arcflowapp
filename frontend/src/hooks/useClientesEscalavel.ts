// 🚀 HOOK ESCALÁVEL - SUBSTITUI O CONTEXT API ATUAL
// MUDANÇA SIMPLES: React Query ao invés de Context

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// ✅ CONFIGURACAO AXIOS OTIMIZADA
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ TYPES PARA TYPESCRIPT
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  tipo_pessoa: 'pf' | 'pj';
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

interface ClientesResponse {
  clientes: Cliente[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ClientesFilters {
  page?: number;
  limit?: number;
  search?: string;
  filtro?: 'todos' | 'pf' | 'pj';
}

// ✅ QUERY KEYS ORGANIZADAS
const clientesKeys = {
  all: ['clientes'] as const,
  lists: () => [...clientesKeys.all, 'list'] as const,
  list: (filters: ClientesFilters) => [...clientesKeys.lists(), filters] as const,
  details: () => [...clientesKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientesKeys.details(), id] as const,
  verification: () => [...clientesKeys.all, 'verification'] as const,
  cpf: (cpf: string) => [...clientesKeys.verification(), 'cpf', cpf] as const,
  cnpj: (cnpj: string) => [...clientesKeys.verification(), 'cnpj', cnpj] as const,
};

// ✅ HOOK PRINCIPAL PARA LISTAR CLIENTES
export const useClientes = (filters: ClientesFilters = {}) => {
  return useQuery({
    queryKey: clientesKeys.list(filters),
    queryFn: async (): Promise<ClientesResponse> => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.filtro && filters.filtro !== 'todos') params.append('filtro', filters.filtro);
      
      const response = await api.get(`/clientes?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,     // 5 minutos fresh
    refetchOnWindowFocus: false,  // Não refetch automático
    retry: 2,                     // Retry automático
  });
};

// ✅ HOOK PARA VERIFICAR CPF COM DEBOUNCE
export const useVerificarCpf = (cpf: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: clientesKeys.cpf(cpf),
    queryFn: async (): Promise<{ exists: boolean }> => {
      if (!cpf || cpf.length < 11) return { exists: false };
      
      const response = await api.get(`/clientes/verificar-cpf/${cpf}`);
      return response.data;
    },
    enabled: enabled && cpf.length >= 11,
    staleTime: 2 * 60 * 1000,     // 2 minutos fresh  
    retry: 1,                     // Retry mínimo
  });
};

// ✅ HOOK PARA VERIFICAR CNPJ
export const useVerificarCnpj = (cnpj: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: clientesKeys.cnpj(cnpj),
    queryFn: async (): Promise<{ exists: boolean }> => {
      if (!cnpj || cnpj.length < 14) return { exists: false };
      
      const response = await api.get(`/clientes/verificar-cnpj/${cnpj}`);
      return response.data;
    },
    enabled: enabled && cnpj.length >= 14,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

// ✅ HOOK PARA CRIAR CLIENTE
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await api.post('/clientes', cliente);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar todas as listas de clientes
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      
      // Invalidar verificações de CPF/CNPJ
      if (variables.cpf) {
        queryClient.invalidateQueries({ queryKey: clientesKeys.cpf(variables.cpf) });
      }
      if (variables.cnpj) {
        queryClient.invalidateQueries({ queryKey: clientesKeys.cnpj(variables.cnpj) });
      }
      
      toast.success('Cliente criado com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Erro ao criar cliente';
      toast.error(message);
    },
  });
};

// ✅ HOOK PARA ATUALIZAR CLIENTE
export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...cliente }: Partial<Cliente> & { id: string }) => {
      const response = await api.put(`/clientes/${id}`, cliente);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidar listas e detail
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientesKeys.detail(variables.id) });
      
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Erro ao atualizar cliente';
      toast.error(message);
    },
  });
};

// ✅ HOOK PARA DELETAR CLIENTE
export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/clientes/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.removeQueries({ queryKey: clientesKeys.detail(id) });
      
      toast.success('Cliente excluído com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Erro ao excluir cliente';
      toast.error(message);
    },
  });
};

// ✅ HOOK PARA BUSCA COM DEBOUNCE
export const useClientesSearch = (searchTerm: string, delay: number = 800) => {
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);
  
  return useClientes({ search: debouncedSearch, limit: 50 });
};

// ✅ HOOK PARA PREFETCH DE PRÓXIMA PÁGINA
export const usePrefetchNextPage = (currentPage: number, filters: ClientesFilters) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const nextPageFilters = { ...filters, page: currentPage + 1 };
    
    // Prefetch da próxima página
    queryClient.prefetchQuery({
      queryKey: clientesKeys.list(nextPageFilters),
      queryFn: async () => {
        const params = new URLSearchParams();
        if (nextPageFilters.page) params.append('page', nextPageFilters.page.toString());
        if (nextPageFilters.limit) params.append('limit', nextPageFilters.limit.toString());
        if (nextPageFilters.search) params.append('search', nextPageFilters.search);
        if (nextPageFilters.filtro && nextPageFilters.filtro !== 'todos') {
          params.append('filtro', nextPageFilters.filtro);
        }
        
        const response = await api.get(`/clientes?${params.toString()}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [currentPage, filters, queryClient]);
};

// ✅ EXPORT TYPES
export type { Cliente, ClientesResponse, ClientesFilters }; 