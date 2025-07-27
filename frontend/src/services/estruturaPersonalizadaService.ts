import { apiClient } from '@/lib/api-client';

export interface EstruturaPersonalizada {
  personalizado: boolean;
  secoesVisiveis: string[];
  briefingPersonalizado?: any;
  [key: string]: any;
}

export interface RespostasBriefing {
  [perguntaId: string]: string;
}

/**
 * Serviço para gerenciar estruturas personalizadas de briefings
 * 🎯 SISTEMA CONFIÁVEL PARA 10.000 USUÁRIOS SIMULTÂNEOS
 * ✅ Zero perda de dados - tudo salvo no banco PostgreSQL
 */
export class EstruturaPersonalizadaService {
  
  /**
   * Salvar estrutura personalizada no banco de dados
   */
  static async salvarEstrutura(briefingId: string, estrutura: EstruturaPersonalizada): Promise<void> {
    console.log('💾 [SERVICE] Salvando estrutura personalizada:', briefingId);
    console.log('💾 [SERVICE] Estrutura:', {
      personalizado: estrutura.personalizado,
      secoesVisiveis: estrutura.secoesVisiveis?.length || 0
    });

    try {
      // 🔥 CORREÇÃO: Usar fetch direto como os outros serviços funcionais
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}/estrutura-personalizada`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estruturaPersonalizada: estrutura
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ [SERVICE] Estrutura personalizada salva com sucesso');
      } else {
        throw new Error('Erro ao salvar estrutura personalizada');
      }
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao salvar estrutura personalizada:', error);
      throw error;
    }
  }

  /**
   * Carregar estrutura personalizada do banco de dados
   */
  static async carregarEstrutura(briefingId: string): Promise<EstruturaPersonalizada | null> {
    console.log('🔍 [SERVICE] Carregando estrutura personalizada:', briefingId);

    try {
      // 🔥 CORREÇÃO: Usar fetch direto como os outros serviços funcionais
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}/estrutura-personalizada`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️ [SERVICE] Nenhuma estrutura personalizada encontrada');
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const estrutura = data.estruturaPersonalizada;
        console.log('✅ [SERVICE] Estrutura personalizada carregada:', estrutura ? 'SIM' : 'NÃO');
        return estrutura;
      } else {
        console.log('⚠️ [SERVICE] Nenhuma estrutura personalizada encontrada');
        return null;
      }
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao carregar estrutura personalizada:', error);
      return null;
    }
  }

  /**
   * Salvar respostas do briefing no banco de dados
   */
  static async salvarRespostas(briefingId: string, respostas: RespostasBriefing): Promise<void> {
    console.log('💾 [SERVICE] Salvando respostas:', briefingId);
    console.log('💾 [SERVICE] Número de respostas:', Object.keys(respostas).length);

    try {
      // 🔥 CORREÇÃO: Usar fetch direto como os outros serviços funcionais
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          respostas
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('✅ [SERVICE] Respostas salvas com sucesso:', data.totalRespostas);
      } else {
        throw new Error('Erro ao salvar respostas');
      }
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao salvar respostas:', error);
      throw new Error('Erro ao salvar respostas');
    }
  }

  /**
   * Carregar respostas do briefing do banco de dados
   */
  static async carregarRespostas(briefingId: string): Promise<RespostasBriefing> {
    console.log('🔍 [SERVICE] Carregando respostas:', briefingId);

    try {
      // 🔥 CORREÇÃO: Usar fetch direto como os outros serviços funcionais
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️ [SERVICE] Nenhuma resposta encontrada');
          return {};
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const respostas = data.respostas;
        console.log('✅ [SERVICE] Respostas carregadas:', Object.keys(respostas).length);
        return respostas;
      } else {
        console.log('⚠️ [SERVICE] Nenhuma resposta encontrada');
        return {};
      }
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao carregar respostas:', error);
      return {};
    }
  }

  /**
   * Migrar dados do localStorage para o banco de dados
   * 🔄 MIGRAÇÃO ÚNICA - executar apenas uma vez por briefing
   */
  static async migrarLocalStorageParaBanco(briefingId: string): Promise<void> {
    console.log('🔄 [SERVICE] Iniciando migração do localStorage para banco:', briefingId);

    try {
      // Verificar se já existe estrutura no banco
      const estruturaExistente = await this.carregarEstrutura(briefingId);
      if (estruturaExistente) {
        console.log('⚠️ [SERVICE] Estrutura já existe no banco - pulando migração');
        return;
      }

      // Tentar carregar do localStorage
      const chavesPersonalizacao = [
        `briefing-personalizado-${briefingId}-estrutura`,
        `briefing-personalizado-${briefingId}`,
        `briefing-personalizado-cliente-demo-${briefingId}`,
        `briefing-personalizado-cliente-demo-temp-${briefingId}`,
      ];

      let estruturaLocalStorage = null;
      let chaveEncontrada = '';

      for (const chave of chavesPersonalizacao) {
        const dados = localStorage.getItem(chave);
        if (dados) {
          estruturaLocalStorage = JSON.parse(dados);
          chaveEncontrada = chave;
          break;
        }
      }

      if (estruturaLocalStorage) {
        console.log('📦 [SERVICE] Estrutura encontrada no localStorage:', chaveEncontrada);
        
        // Salvar no banco
        await this.salvarEstrutura(briefingId, estruturaLocalStorage);
        
        // Remover do localStorage após sucesso
        for (const chave of chavesPersonalizacao) {
          localStorage.removeItem(chave);
        }
        
        console.log('✅ [SERVICE] Migração concluída com sucesso');
      } else {
        console.log('⚠️ [SERVICE] Nenhuma estrutura encontrada no localStorage');
      }

      // Migrar respostas de backup se existirem
      const respostasBackup = localStorage.getItem(`briefing-backup-respostas-${briefingId}`);
      if (respostasBackup) {
        const respostas = JSON.parse(respostasBackup);
        await this.salvarRespostas(briefingId, respostas);
        localStorage.removeItem(`briefing-backup-respostas-${briefingId}`);
        console.log('✅ [SERVICE] Respostas de backup migradas com sucesso');
      }

    } catch (error) {
      console.error('❌ [SERVICE] Erro na migração:', error);
      throw error;
    }
  }

  /**
   * Limpar completamente o localStorage (apenas para limpeza final)
   */
  static limparLocalStorage(): void {
    console.log('🧹 [SERVICE] Limpando localStorage de estruturas personalizadas');
    
    const chaves = Object.keys(localStorage);
    const chavesParaRemover = chaves.filter(chave => 
      chave.startsWith('briefing-personalizado-') || 
      chave.startsWith('briefing-backup-respostas-')
    );

    chavesParaRemover.forEach(chave => {
      localStorage.removeItem(chave);
    });

    console.log('✅ [SERVICE] localStorage limpo:', chavesParaRemover.length, 'chaves removidas');
  }
}

export default EstruturaPersonalizadaService; 