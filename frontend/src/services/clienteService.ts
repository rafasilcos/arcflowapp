import { apiClient } from '@/lib/api-client';
import axios from 'axios';

/**
 * Verificar se CPF já está cadastrado
 */
export const verificarCpfDuplicado = async (cpf: string): Promise<{
  duplicado: boolean;
  nomeCliente?: string;
}> => {
  try {
    // ✅ USAR AXIOS DIRETAMENTE PARA EVITAR PROBLEMA DO WRAPPER
    const token = localStorage.getItem('arcflow_auth_token');
    const response = await axios.get(`http://localhost:3001/api/clientes/verificar-cpf/${cpf.replace(/\D/g, '')}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      duplicado: response.data.duplicado || false,
      nomeCliente: response.data.nomeCliente
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { duplicado: false };
    }
    console.error('Erro ao verificar CPF:', error.message || error);
    return { duplicado: false }; // Retorna disponível em caso de erro
  }
};

/**
 * Verificar se CNPJ já está cadastrado
 */
export const verificarCnpjDuplicado = async (cnpj: string): Promise<{
  duplicado: boolean;
  nomeCliente?: string;
}> => {
  try {
    // ✅ USAR AXIOS DIRETAMENTE PARA EVITAR PROBLEMA DO WRAPPER
    const token = localStorage.getItem('arcflow_auth_token');
    const response = await axios.get(`http://localhost:3001/api/clientes/verificar-cnpj/${cnpj.replace(/\D/g, '')}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      duplicado: response.data.duplicado || false,
      nomeCliente: response.data.nomeCliente
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { duplicado: false };
    }
    console.error('Erro ao verificar CNPJ:', error.message || error);
    return { duplicado: false }; // Retorna disponível em caso de erro
  }
}; 