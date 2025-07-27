import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitiza string removendo scripts maliciosos
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return ''
  
  // Remove caracteres perigosos e de controle
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove todas as tags HTML
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove caracteres de controle
    .trim()
  
  return sanitized
}

/**
 * Sanitiza email
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return ''
  
  const sanitized = sanitizeString(email.toLowerCase())
  
  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) ? sanitized : ''
}

/**
 * Sanitiza telefone
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return ''
  
  // Remove tudo exceto números, parênteses, traços e espaços
  return phone.replace(/[^\d\s\-\(\)]/g, '').trim()
}

/**
 * Sanitiza CPF
 */
export const sanitizeCPF = (cpf: string): string => {
  if (!cpf) return ''
  
  // Remove tudo exceto números, pontos e traços
  const cleaned = cpf.replace(/[^\d\.\-]/g, '')
  
  // Valida formato básico
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  return cpfRegex.test(cleaned) ? cleaned : ''
}

/**
 * Sanitiza CNPJ
 */
export const sanitizeCNPJ = (cnpj: string): string => {
  if (!cnpj) return ''
  
  // Remove tudo exceto números, pontos, traços e barras
  const cleaned = cnpj.replace(/[^\d\.\-\/]/g, '')
  
  // Valida formato básico
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
  return cnpjRegex.test(cleaned) ? cleaned : ''
}

/**
 * Sanitiza nome (apenas letras, espaços e acentos)
 */
export const sanitizeName = (name: string): string => {
  if (!name) return ''
  
  // Permite apenas letras, espaços e acentos
  const sanitized = name.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim()
  
  // Remove espaços duplos
  return sanitized.replace(/\s+/g, ' ')
}

/**
 * Sanitiza CEP
 */
export const sanitizeCEP = (cep: string): string => {
  if (!cep) return ''
  
  // Remove tudo exceto números e traços
  const cleaned = cep.replace(/[^\d\-]/g, '')
  
  // Valida formato básico
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cleaned) ? cleaned : ''
}

/**
 * Sanitiza objeto cliente completo
 */
export const sanitizeCliente = (cliente: any) => {
  return {
    ...cliente,
    nome: sanitizeName(cliente.nome || ''),
    email: sanitizeEmail(cliente.email || ''),
    telefone: sanitizePhone(cliente.telefone || ''),
    cpf: cliente.cpf ? sanitizeCPF(cliente.cpf) : '',
    cnpj: cliente.cnpj ? sanitizeCNPJ(cliente.cnpj) : '',
    profissao: sanitizeString(cliente.profissao || ''),
    observacoes: sanitizeString(cliente.observacoes || ''),
    endereco: {
      cep: sanitizeCEP(cliente.endereco?.cep || ''),
      logradouro: sanitizeString(cliente.endereco?.logradouro || ''),
      numero: sanitizeString(cliente.endereco?.numero || ''),
      complemento: sanitizeString(cliente.endereco?.complemento || ''),
      bairro: sanitizeString(cliente.endereco?.bairro || ''),
      cidade: sanitizeString(cliente.endereco?.cidade || ''),
      uf: sanitizeString(cliente.endereco?.uf || '').toUpperCase(),
      pais: sanitizeString(cliente.endereco?.pais || 'Brasil')
    }
  }
} 