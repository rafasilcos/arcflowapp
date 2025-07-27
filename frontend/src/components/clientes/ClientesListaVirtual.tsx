'use client';

import React, { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, User, Building } from 'lucide-react';
import { useClientes } from '@/hooks/useClientesEscalavel';
import { useClientesFilters } from '@/stores/uiStore';
import type { Cliente } from '@/hooks/useClientesEscalavel';

// ✅ VIRTUAL SCROLLING SIMPLES (SEM BIBLIOTECA EXTERNA)
interface VirtualScrollProps {
  items: Cliente[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: Cliente, index: number) => React.ReactNode;
}

const VirtualScroll = memo<VirtualScrollProps>(({ items, itemHeight, containerHeight, renderItem }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              width: '100%',
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualScroll.displayName = 'VirtualScroll';

// ✅ ITEM DE CLIENTE MEMOIZADO
interface ClienteItemProps {
  cliente: Cliente;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ClienteItem = memo<ClienteItemProps>(({ cliente, index, onEdit, onDelete, onView }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div 
      className={`
        flex items-center justify-between p-4 border-b hover:bg-gray-50 
        transition-colors duration-150 group
        ${isEven ? 'bg-gray-25' : 'bg-white'}
      `}
    >
      <div className="flex items-center space-x-4 flex-1">
        {/* Avatar/Ícone */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${cliente.tipo_pessoa === 'pf' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
        `}>
          {cliente.tipo_pessoa === 'pf' ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
        </div>
        
        {/* Informações Principais */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {cliente.nome}
            </h3>
            <span className={`
              px-2 py-1 text-xs rounded-full font-medium
              ${cliente.tipo_pessoa === 'pf' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'}
            `}>
              {cliente.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </span>
          </div>
          
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
            <span className="truncate">{cliente.email}</span>
            {cliente.telefone && (
              <span>{cliente.telefone}</span>
            )}
            {cliente.cpf && (
              <span>{cliente.cpf}</span>
            )}
            {cliente.cnpj && (
              <span>{cliente.cnpj}</span>
            )}
          </div>
          
          {(cliente.cidade || cliente.estado) && (
            <div className="mt-1 text-xs text-gray-400">
              {cliente.cidade}{cliente.cidade && cliente.estado && ', '}{cliente.estado}
            </div>
          )}
        </div>
      </div>
      
      {/* Ações */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onView(cliente.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Visualizar"
        >
          <Eye className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onEdit(cliente.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(cliente.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

ClienteItem.displayName = 'ClienteItem';

// ✅ BARRA DE FILTROS MEMOIZADA
const FiltrosBar = memo(() => {
  const { filters, setSearch, setTipoPessoa, resetFilters } = useClientesFilters();
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, [setSearch]);
  
  const handleTipoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoPessoa(e.target.value as 'todos' | 'pf' | 'pj');
  }, [setTipoPessoa]);
  
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={filters.search}
            onChange={handleSearchChange}
            className="
              w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              transition-colors duration-200
            "
          />
        </div>
        
        {/* Filtros */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filters.tipoPessoa}
              onChange={handleTipoChange}
              className="
                border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-colors duration-200
              "
            >
              <option value="todos">Todos</option>
              <option value="pf">Pessoa Física</option>
              <option value="pj">Pessoa Jurídica</option>
            </select>
          </div>
          
          {(filters.search || filters.tipoPessoa !== 'todos') && (
            <button
              onClick={resetFilters}
              className="
                px-3 py-2 text-sm text-gray-600 hover:text-gray-900
                border border-gray-300 rounded-lg hover:bg-gray-50
                transition-colors duration-200
              "
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

FiltrosBar.displayName = 'FiltrosBar';

// ✅ PAGINAÇÃO MEMOIZADA
interface PaginacaoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginacao = memo<PaginacaoProps>(({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            px-3 py-2 text-sm border border-gray-300 rounded-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition-colors duration-200
          "
        >
          Anterior
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={`
              px-3 py-2 text-sm border rounded-lg transition-colors duration-200
              ${page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
              }
              ${typeof page !== 'number' ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            px-3 py-2 text-sm border border-gray-300 rounded-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition-colors duration-200
          "
        >
          Próximo
        </button>
      </div>
      
      <span className="text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
});

Paginacao.displayName = 'Paginacao';

// ✅ COMPONENTE PRINCIPAL
interface ClientesListaVirtualProps {
  onCreateCliente: () => void;
  onEditCliente: (id: string) => void;
  onDeleteCliente: (id: string) => void;
  onViewCliente: (id: string) => void;
}

const ClientesListaVirtual = memo<ClientesListaVirtualProps>(({
  onCreateCliente,
  onEditCliente,
  onDeleteCliente,
  onViewCliente
}) => {
  const { filters, setPage } = useClientesFilters();
  
  // Query com React Query
  const { 
    data, 
    isLoading, 
    error, 
    isFetching 
  } = useClientes({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    filtro: filters.tipoPessoa
  });
  
  // Callbacks memoizados
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);
  
  // Render item para virtual scroll
  const renderItem = useCallback((cliente: Cliente, index: number) => (
    <ClienteItem
      cliente={cliente}
      index={index}
      onEdit={onEditCliente}
      onDelete={onDeleteCliente}
      onView={onViewCliente}
    />
  ), [onEditCliente, onDeleteCliente, onViewCliente]);
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Erro ao carregar clientes
          </div>
          <p className="text-gray-600">
            {error.message || 'Ocorreu um erro inesperado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header com botão de criar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Clientes</h2>
            {data && (
              <p className="text-sm text-gray-600">
                {data.pagination.total} clientes encontrados
              </p>
            )}
          </div>
          
          <button
            onClick={onCreateCliente}
            className="
              inline-flex items-center space-x-2 px-4 py-2
              bg-blue-600 text-white rounded-lg hover:bg-blue-700
              transition-colors duration-200 font-medium
            "
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <FiltrosBar />
      
      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span>Carregando clientes...</span>
          </div>
        </div>
      )}
      
      {/* Lista Virtual */}
      {data && data.clientes.length > 0 && (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          <VirtualScroll
            items={data.clientes}
            itemHeight={120} // Altura estimada de cada item
            containerHeight={600} // Altura do container
            renderItem={renderItem}
          />
        </div>
      )}
      
      {/* Empty State */}
      {data && data.clientes.length === 0 && !isLoading && (
        <div className="p-8 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.tipoPessoa !== 'todos'
              ? 'Tente ajustar os filtros ou criar um novo cliente.'
              : 'Comece criando seu primeiro cliente.'
            }
          </p>
          <button
            onClick={onCreateCliente}
            className="
              inline-flex items-center space-x-2 px-4 py-2
              bg-blue-600 text-white rounded-lg hover:bg-blue-700
              transition-colors duration-200 font-medium
            "
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Cliente</span>
          </button>
        </div>
      )}
      
      {/* Paginação */}
      {data && data.pagination.pages > 1 && (
        <Paginacao
          currentPage={data.pagination.page}
          totalPages={data.pagination.pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
});

ClientesListaVirtual.displayName = 'ClientesListaVirtual';

export default ClientesListaVirtual; 