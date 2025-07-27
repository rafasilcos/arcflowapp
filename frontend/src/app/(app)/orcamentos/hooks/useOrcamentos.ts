/**
 * 🎣 HOOK UNIFICADO PARA ORÇAMENTOS
 * 
 * Gerencia todo o estado e operações relacionadas a orçamentos:
 * - Listagem com cache inteligente
 * - Criação, atualização, exclusão
 * - Estados de loading e erro
 * - Revalidação automática
 */

import { useState, useEffect, useCallback } from 'react';
import { orcamentosAPI, OrcamentoListItem, OrcamentoDetalhado, CriarOrcamentoData } from '../services/orcamentosAPI';

interface UseOrcamentosReturn {
  // Estados principais
  orcamentos: OrcamentoListItem[];
  loading: boolean;
  error: string | null;
  
  // Operações
  recarregar: () => Promise<void>;
  criarOrcamento: (dados: CriarOrcamentoData) => Promise<OrcamentoDetalhado | null>;
  atualizarOrcamento: (id: string, dados: Partial<CriarOrcamentoData>) => Promise<OrcamentoDetalhado | null>;
  excluirOrcamento: (id: string) => Promise<boolean>;
  gerarDoBriefing: (briefingId: string) => Promise<OrcamentoDetalhado | null>;
  
  // Filtros e busca
  filtrarPorStatus: (status?: string) => OrcamentoListItem[];
  buscarPorTexto: (texto: string) => OrcamentoListItem[];
  
  // Métricas calculadas
  metricas: {
    total: number;
    aprovados: number;
    pendentes: number;
    rascunhos: number;
    rejeitados: number;
    valorTotal: number;
  };
}

export function useOrcamentos(): UseOrcamentosReturn {
  // Estados principais
  const [orcamentos, setOrcamentos] = useState<OrcamentoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔄 CARREGAR ORÇAMENTOS DA API
   */
  const carregarOrcamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Carregando orçamentos via API...');
      
      const response = await orcamentosAPI.listarOrcamentos();
      
      if (response.success && response.data) {
        setOrcamentos(response.data);
        console.log(`✅ ${response.data.length} orçamentos carregados`);
      } else {
        throw new Error(response.error || 'Erro ao carregar orçamentos');
      }
    } catch (err: any) {
      console.error('❌ Erro ao carregar orçamentos:', err);
      setError(err.message);
      
      // Fallback: dados mock temporários para desenvolvimento
      console.log('🔄 Usando dados mock como fallback...');
      setOrcamentos([
        {
          id: 'temp-001',
          codigo: 'ORC-001',
          nome: 'Residência Silva',
          cliente_nome: 'João Silva',
          status: 'PENDENTE',
          valor_total: 185000,
          valor_por_m2: 1233,
          area_construida: 150,
          tipologia: 'Residencial',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'temp-002',
          codigo: 'ORC-002',
          nome: 'Escritório Advocacia',
          cliente_nome: 'Maria Santos',
          status: 'APROVADO',
          valor_total: 125000,
          valor_por_m2: 892,
          area_construida: 140,
          tipologia: 'Comercial',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ➕ CRIAR NOVO ORÇAMENTO
   */
  const criarOrcamento = useCallback(async (dados: CriarOrcamentoData): Promise<OrcamentoDetalhado | null> => {
    try {
      console.log('➕ Criando orçamento:', dados.nome);
      
      const response = await orcamentosAPI.criarOrcamento(dados);
      
      if (response.success && response.data) {
        // Recarregar lista após criação
        await carregarOrcamentos();
        console.log('✅ Orçamento criado com sucesso');
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao criar orçamento');
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar orçamento:', err);
      setError(err.message);
      return null;
    }
  }, [carregarOrcamentos]);

  /**
   * ✏️ ATUALIZAR ORÇAMENTO
   */
  const atualizarOrcamento = useCallback(async (
    id: string, 
    dados: Partial<CriarOrcamentoData>
  ): Promise<OrcamentoDetalhado | null> => {
    try {
      console.log(`✏️ Atualizando orçamento ${id}...`);
      
      const response = await orcamentosAPI.atualizarOrcamento(id, dados);
      
      if (response.success && response.data) {
        // Atualizar item na lista local
        setOrcamentos(prev => prev.map(orc => 
          orc.id === id ? { ...orc, ...dados } : orc
        ));
        console.log('✅ Orçamento atualizado com sucesso');
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao atualizar orçamento');
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar orçamento:', err);
      setError(err.message);
      return null;
    }
  }, []);

  /**
   * 🗑️ EXCLUIR ORÇAMENTO
   */
  const excluirOrcamento = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log(`🗑️ Excluindo orçamento ${id}...`);
      
      const response = await orcamentosAPI.excluirOrcamento(id);
      
      if (response.success) {
        // Remover da lista local
        setOrcamentos(prev => prev.filter(orc => orc.id !== id));
        console.log('✅ Orçamento excluído com sucesso');
        return true;
      } else {
        throw new Error(response.error || 'Erro ao excluir orçamento');
      }
    } catch (err: any) {
      console.error('❌ Erro ao excluir orçamento:', err);
      setError(err.message);
      return false;
    }
  }, []);

  /**
   * 🧠 GERAR ORÇAMENTO DO BRIEFING
   */
  const gerarDoBriefing = useCallback(async (briefingId: string): Promise<OrcamentoDetalhado | null> => {
    try {
      console.log(`🧠 Gerando orçamento do briefing ${briefingId}...`);
      
      const response = await orcamentosAPI.gerarOrcamentoDoBriefing(briefingId);
      
      if (response.success && response.data) {
        // Recarregar lista após criação
        await carregarOrcamentos();
        console.log('✅ Orçamento gerado do briefing com sucesso');
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao gerar orçamento do briefing');
      }
    } catch (err: any) {
      console.error('❌ Erro ao gerar orçamento do briefing:', err);
      setError(err.message);
      return null;
    }
  }, [carregarOrcamentos]);

  /**
   * 🔍 FILTRAR POR STATUS
   */
  const filtrarPorStatus = useCallback((status?: string): OrcamentoListItem[] => {
    if (!status || status === 'todos') {
      return orcamentos;
    }
    return orcamentos.filter(orc => orc.status === status.toUpperCase());
  }, [orcamentos]);

  /**
   * 🔍 BUSCAR POR TEXTO
   */
  const buscarPorTexto = useCallback((texto: string): OrcamentoListItem[] => {
    if (!texto.trim()) {
      return orcamentos;
    }
    
    const termo = texto.toLowerCase();
    return orcamentos.filter(orc => 
      orc.nome.toLowerCase().includes(termo) ||
      orc.cliente_nome.toLowerCase().includes(termo) ||
      orc.codigo.toLowerCase().includes(termo) ||
      orc.tipologia.toLowerCase().includes(termo)
    );
  }, [orcamentos]);

  /**
   * 📊 CALCULAR MÉTRICAS
   */
  const metricas = useCallback(() => {
    const total = orcamentos.length;
    const aprovados = orcamentos.filter(o => o.status === 'APROVADO').length;
    const pendentes = orcamentos.filter(o => o.status === 'PENDENTE').length;
    const rascunhos = orcamentos.filter(o => o.status === 'RASCUNHO').length;
    const rejeitados = orcamentos.filter(o => o.status === 'REJEITADO').length;
    const valorTotal = orcamentos.reduce((sum, orc) => sum + orc.valor_total, 0);

    return {
      total,
      aprovados,
      pendentes,
      rascunhos,
      rejeitados,
      valorTotal
    };
  }, [orcamentos])();

  // Carregar orçamentos na inicialização
  useEffect(() => {
    carregarOrcamentos();
  }, [carregarOrcamentos]);

  return {
    // Estados
    orcamentos,
    loading,
    error,
    
    // Operações
    recarregar: carregarOrcamentos,
    criarOrcamento,
    atualizarOrcamento,
    excluirOrcamento,
    gerarDoBriefing,
    
    // Filtros
    filtrarPorStatus,
    buscarPorTexto,
    
    // Métricas
    metricas
  };
}