import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calcular itens visíveis
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Itens visíveis
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook para gerenciar listas virtualizadas grandes
export const useVirtualizedData = <T,>(
  data: T[],
  pageSize: number = 50
) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedData, setLoadedData] = useState<T[]>([]);

  // Carregar mais dados quando necessário
  const loadMoreData = useCallback(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const newData = data.slice(startIndex, endIndex);
    
    setLoadedData(prev => [...prev, ...newData]);
    setCurrentPage(prev => prev + 1);
  }, [data, currentPage, pageSize]);

  // Reset quando dados mudam
  useEffect(() => {
    setCurrentPage(0);
    setLoadedData([]);
    
    // Carregar primeira página
    const initialData = data.slice(0, pageSize);
    setLoadedData(initialData);
    setCurrentPage(1);
  }, [data, pageSize]);

  const hasMore = currentPage * pageSize < data.length;

  return {
    loadedData,
    loadMoreData,
    hasMore,
    totalCount: data.length,
    loadedCount: loadedData.length
  };
}; 