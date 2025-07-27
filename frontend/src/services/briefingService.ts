import axios from 'axios';

export interface BriefingCompletoData {
  nomeProjeto: string;
  clienteId: string | null;
  briefingTemplate: {
    id: string;
    nome: string;
    categoria: string;
    totalPerguntas: number;
  };
  respostas: Record<string, any>;
  metadados: {
    totalRespostas: number;
    progresso: number;
    tempoGasto?: number;
    dataInicio?: string;
    dataFim?: string;
  };
}

export interface BriefingSalvoResponse {
  success: boolean;
  message: string;
  data: {
    briefingId: string;
    nomeProjeto: string;
    status: string;
    progresso: number;
    dashboardUrl: string;
    createdAt: string;
  };
}

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('arcflow_auth_token');
  }
  return null;
};

export const briefingService = {
  async salvarCompleto(dados: BriefingCompletoData): Promise<BriefingSalvoResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }

      console.log(' [DEBUG] Token:', token ? 'PRESENTE' : 'AUSENTE');
      console.log(' [DEBUG] URL:', 'http://localhost:3001/api/briefings/salvar-completo');
      console.log(' [DEBUG] Dados enviados:', JSON.stringify(dados, null, 2));

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log(' [DEBUG] Headers:', headers);

      console.log(' Enviando briefing para API...');
      
      const response = await axios.post(
        'http://localhost:3001/api/briefings/salvar-completo', 
        dados,
        { headers }
      );
      
      console.log(' Response status:', response.status);
      console.log(' Response headers:', response.headers);
      console.log(' Response completo:', response);
      console.log(' Response.data:', response.data);
      
      if (!response) {
        throw new Error('Response da API é undefined');
      }
      
      if (!response.data) {
        throw new Error('Response.data da API é undefined');
      }

      if (!response.data.success) {
        throw new Error(`API retornou erro: ${response.data.message || 'Erro desconhecido'}`);
      }

      if (!response.data.data) {
        throw new Error('Response.data.data é undefined - estrutura de resposta inválida');
      }

      console.log(' Briefing salvo com sucesso!');
      console.log(' briefingId:', response.data.data.briefingId);
      console.log(' dashboardUrl:', response.data.data.dashboardUrl);
      
      return response.data;
      
    } catch (error: any) {
      console.error(' Erro ao salvar briefing:', error);
      console.error(' Error message:', error.message);
      console.error(' Error response:', error.response?.data);
      console.error(' Error status:', error.response?.status);
      console.error(' Error headers:', error.response?.headers);
      console.error(' Stack trace:', error.stack);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('arcflow_auth_token');
        throw new Error('Token de autenticação inválido. Faça login novamente.');
      }
      
      if (error.response?.status === 400) {
        throw new Error(`Dados inválidos: ${error.response.data?.message || error.response.data?.error || 'Verifique os dados enviados'}`);
      }
      
      if (error.response?.status === 500) {
        throw new Error(`Erro interno do servidor: ${error.response.data?.message || 'Tente novamente em alguns minutos'}`);
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        'Erro ao salvar briefing. Tente novamente.'
      );
    }
  },

  async obterBriefing(briefingId: string) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }
      
      const response = await axios.get(`http://localhost:3001/api/briefings/${briefingId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error(' Erro ao obter briefing:', error);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao carregar briefing. Tente novamente.'
      );
    }
  },

  async listarBriefings(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clienteId?: string;
  }) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }
      
      const response = await axios.get('http://localhost:3001/api/briefings', { 
        params,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error(' Erro ao listar briefings:', error);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao carregar briefings. Tente novamente.'
      );
    }
  }
};

// Buscar briefing completo com estrutura personalizada
export const buscarBriefingCompleto = async (id: string) => {
  try {
    console.log('🔍 Buscando briefing completo:', id)
    
    const response = await fetch(`/api/briefings/${id}/completo`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('arcflow_auth_token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Briefing completo recebido:', data)
    
    return data
  } catch (error) {
    console.error('❌ Erro ao buscar briefing completo:', error)
    throw error
  }
}

// Salvar briefing completo
export const salvarBriefingCompleto = async (id: string, estruturaBriefing: any) => {
  try {
    console.log('💾 Salvando briefing completo:', id)
    
    const response = await fetch(`/api/briefings/${id}/salvar-completo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('arcflow_auth_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estrutura_briefing: estruturaBriefing
      })
    })
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Briefing completo salvo:', data)
    
    return data
  } catch (error) {
    console.error('❌ Erro ao salvar briefing completo:', error)
    throw error
  }
}
