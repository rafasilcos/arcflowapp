// 🎯 HOOK PARA NORMALIZAÇÃO AUTOMÁTICA DE DADOS
// Garante que todos os dados sigam o padrão de nomenclatura ArcFlow

import { useMemo } from 'react';
import { 
  BriefingData, 
  ClienteData, 
  UsuarioData, 
  normalizeBriefingData, 
  getBriefingValue,
  FIELD_MAPPINGS,
  VALIDATION_RULES
} from '../types/briefing-standard';

/**
 * 🔧 HOOK PARA NORMALIZAÇÃO DE BRIEFING
 * Converte automaticamente dados snake_case para camelCase
 */
export function useNormalizedBriefing(rawData: any): BriefingData | null {
  return useMemo(() => {
    if (!rawData) return null;
    
    console.log('🔧 [NORMALIZE] Dados recebidos:', rawData);
    
    // Aplicar normalização automática
    const normalized = normalizeBriefingData(rawData);
    
    // Fallbacks para compatibilidade
    const finalData: BriefingData = {
      id: normalized.id || rawData.id,
      nomeProjeto: normalized.nomeProjeto || rawData.nome_projeto || 'Projeto ArcFlow',
      descricao: normalized.descricao || rawData.descricao,
      objetivos: normalized.objetivos || rawData.objetivos,
      prazo: normalized.prazo || rawData.prazo,
      orcamento: normalized.orcamento || rawData.orcamento,
      status: normalized.status || rawData.status || 'RASCUNHO',
      progresso: normalized.progresso || rawData.progresso || 0,
      disciplina: normalized.disciplina || rawData.disciplina || '',
      area: normalized.area || rawData.area || '',
      tipologia: normalized.tipologia || rawData.tipologia || '',
      clienteId: normalized.clienteId || rawData.cliente_id,
      responsavelId: normalized.responsavelId || rawData.responsavel_id,
      escritorioId: normalized.escritorioId || rawData.escritorio_id || '',
      createdAt: normalized.createdAt || rawData.created_at || '',
      updatedAt: normalized.updatedAt || rawData.updated_at || '',
      deletedAt: normalized.deletedAt || rawData.deleted_at,
      createdBy: normalized.createdBy || rawData.created_by,
      updatedBy: normalized.updatedBy || rawData.updated_by,
      metadata: normalized.metadata || rawData.metadata,
      observacoes: normalized.observacoes || rawData.observacoes,
      _count: normalized._count || rawData._count,
      cliente: normalized.cliente || rawData.cliente,
      responsavel: normalized.responsavel || rawData.responsavel
    };
    
    console.log('✅ [NORMALIZE] Dados normalizados:', finalData);
    
    return finalData;
  }, [rawData]);
}

/**
 * 🔧 HOOK PARA NORMALIZAÇÃO DE CLIENTE
 * Converte automaticamente dados snake_case para camelCase
 */
export function useNormalizedCliente(rawData: any): ClienteData | null {
  return useMemo(() => {
    if (!rawData) return null;
    
    const normalized: ClienteData = {
      id: rawData.id || '',
      nome: rawData.nome || rawData.name || '',
      email: rawData.email,
      telefone: rawData.telefone || rawData.phone,
      documento: rawData.documento || rawData.document,
      endereco: rawData.endereco || rawData.address,
      cidade: rawData.cidade || rawData.city,
      estado: rawData.estado || rawData.state,
      cep: rawData.cep || rawData.zipCode,
      status: rawData.status || 'ATIVO',
      escritorioId: rawData.escritorioId || rawData.escritorio_id || '',
      createdAt: rawData.createdAt || rawData.created_at || '',
      updatedAt: rawData.updatedAt || rawData.updated_at || '',
      deletedAt: rawData.deletedAt || rawData.deleted_at
    };
    
    return normalized;
  }, [rawData]);
}

/**
 * 🔧 HOOK PARA NORMALIZAÇÃO DE USUÁRIO
 * Converte automaticamente dados snake_case para camelCase
 */
export function useNormalizedUsuario(rawData: any): UsuarioData | null {
  return useMemo(() => {
    if (!rawData) return null;
    
    const normalized: UsuarioData = {
      id: rawData.id || '',
      nome: rawData.nome || rawData.name || '',
      email: rawData.email || '',
      cargo: rawData.cargo || rawData.position,
      role: rawData.role || 'ARCHITECT',
      isActive: rawData.isActive !== undefined ? rawData.isActive : true,
      status: rawData.status || 'ATIVO',
      escritorioId: rawData.escritorioId || rawData.escritorio_id || '',
      createdAt: rawData.createdAt || rawData.created_at || '',
      updatedAt: rawData.updatedAt || rawData.updated_at || '',
      lastLogin: rawData.lastLogin || rawData.last_login,
      ultimoLogin: rawData.ultimoLogin || rawData.ultimo_login
    };
    
    return normalized;
  }, [rawData]);
}

/**
 * 🔧 HOOK PARA VALIDAÇÃO DE DADOS
 * Verifica se os dados estão no formato correto
 */
export function useDataValidation(data: any, type: 'briefing' | 'cliente' | 'usuario') {
  return useMemo(() => {
    if (!data) return { isValid: false, errors: ['Dados não fornecidos'] };
    
    const errors: string[] = [];
    
    // Validar campos obrigatórios
    if (type === 'briefing') {
      if (!data.id) errors.push('ID é obrigatório');
      if (!data.nomeProjeto && !data.nome_projeto) errors.push('Nome do projeto é obrigatório');
      if (!data.status) errors.push('Status é obrigatório');
      if (!VALIDATION_RULES.VALID_STATUS.includes(data.status)) {
        errors.push(`Status inválido: ${data.status}`);
      }
    }
    
    // Verificar se está usando snake_case (aviso)
    const snakeCaseFields = Object.keys(FIELD_MAPPINGS).filter(field => 
      data[field] !== undefined
    );
    
    if (snakeCaseFields.length > 0) {
      console.warn(`⚠️ [VALIDATION] Campos em snake_case detectados: ${snakeCaseFields.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: snakeCaseFields.length > 0 ? [`Campos em snake_case: ${snakeCaseFields.join(', ')}`] : []
    };
  }, [data, type]);
}

/**
 * 🔧 HOOK PARA CONVERSÃO SEGURA DE CAMPOS
 * Garante que sempre temos o valor correto, independente do formato
 */
export function useSafeFieldValue<T>(data: any, field: keyof typeof FIELD_MAPPINGS, defaultValue?: T): T | undefined {
  return useMemo(() => {
    if (!data) return defaultValue;
    
    const camelCase = FIELD_MAPPINGS[field];
    const value = data[camelCase] || data[field];
    
    if (value === undefined) {
      if (defaultValue !== undefined) {
        console.log(`🔧 [SAFE_FIELD] Usando valor padrão para ${field}:`, defaultValue);
        return defaultValue;
      }
      console.warn(`⚠️ [SAFE_FIELD] Campo ${field} não encontrado em:`, data);
      return undefined;
    }
    
    console.log(`✅ [SAFE_FIELD] Campo ${field} encontrado:`, value);
    return value;
  }, [data, field, defaultValue]);
}

/**
 * 🔧 HOOK PARA MÚLTIPLOS BRIEFINGS
 * Normaliza uma lista de briefings
 */
export function useNormalizedBriefings(rawList: any[]): BriefingData[] {
  return useMemo(() => {
    if (!Array.isArray(rawList)) return [];
    
    return rawList.map(item => {
      const normalized = normalizeBriefingData(item);
      return {
        ...normalized,
        nomeProjeto: normalized.nomeProjeto || item.nome_projeto || 'Projeto ArcFlow',
        clienteId: normalized.clienteId || item.cliente_id,
        responsavelId: normalized.responsavelId || item.responsavel_id,
        createdAt: normalized.createdAt || item.created_at || '',
        updatedAt: normalized.updatedAt || item.updated_at || ''
      };
    });
  }, [rawList]);
}

/**
 * 🔧 HOOK PARA LOG DE DEBUGGING
 * Mostra informações sobre a normalização
 */
export function useNormalizationDebug(data: any, label?: string) {
  useMemo(() => {
    if (!data) return;
    
    const prefix = label ? `[${label}]` : '[NORMALIZE]';
    
    console.group(`🔍 ${prefix} Debug de Normalização`);
    console.log('📊 Dados originais:', data);
    
    // Detectar campos snake_case
    const snakeCaseFields = Object.keys(FIELD_MAPPINGS).filter(field => 
      data[field] !== undefined
    );
    
    if (snakeCaseFields.length > 0) {
      console.log('🐍 Campos snake_case encontrados:', snakeCaseFields);
    }
    
    // Detectar campos camelCase
    const camelCaseFields = Object.values(FIELD_MAPPINGS).filter(field => 
      data[field] !== undefined
    );
    
    if (camelCaseFields.length > 0) {
      console.log('🐪 Campos camelCase encontrados:', camelCaseFields);
    }
    
    console.groupEnd();
  }, [data, label]);
}

/**
 * 🎯 HOOK PRINCIPAL - USAR ESTE SEMPRE
 * Combina normalização + validação + debugging
 */
export function useArcFlowData(rawData: any, type: 'briefing' | 'cliente' | 'usuario' = 'briefing', debug = false) {
  // Debug opcional
  if (debug) {
    useNormalizationDebug(rawData, type.toUpperCase());
  }
  
  // Normalização
  const normalizedBriefing = useNormalizedBriefing(type === 'briefing' ? rawData : null);
  const normalizedCliente = useNormalizedCliente(type === 'cliente' ? rawData : null);
  const normalizedUsuario = useNormalizedUsuario(type === 'usuario' ? rawData : null);
  
  // Validação
  const validation = useDataValidation(rawData, type);
  
  return {
    data: normalizedBriefing || normalizedCliente || normalizedUsuario,
    briefing: normalizedBriefing,
    cliente: normalizedCliente,
    usuario: normalizedUsuario,
    validation,
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings
  };
} 