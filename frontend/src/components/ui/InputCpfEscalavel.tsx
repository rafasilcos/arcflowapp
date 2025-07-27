'use client';

import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { useVerificarCpf } from '@/hooks/useClientesEscalavel';

// ✅ TYPES
interface InputCpfEscalavelProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, isDuplicate: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  excludeId?: string; // Para exclusão na validação (edição)
}

// ✅ VALIDAÇÃO MATEMÁTICA DE CPF
const validarCpfMatematico = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  // Validar primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  
  if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;
  
  // Validar segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;
  
  return digito2 === parseInt(cpfLimpo.charAt(10));
};

// ✅ FORMATAÇÃO DE CPF
const formatarCpf = (value: string): string => {
  const numeros = value.replace(/[^\d]/g, '');
  
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
  if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
  
  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
};

// ✅ HOOK CUSTOMIZADO PARA DEBOUNCE
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ✅ COMPONENTE MEMOIZADO
const InputCpfEscalavel = memo<InputCpfEscalavelProps>(({
  value,
  onChange,
  onValidationChange,
  placeholder = 'Digite o CPF',
  disabled = false,
  required = false,
  className = '',
  excludeId
}) => {
  // Estados locais
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  
  // Debounce do CPF para verificação
  const debouncedCpf = useDebounce(value, 800);
  
  // Limpar CPF para verificação
  const cpfLimpo = useMemo(() => debouncedCpf.replace(/[^\d]/g, ''), [debouncedCpf]);
  
  // Validação matemática memoizada
  const isValidMath = useMemo(() => {
    if (cpfLimpo.length !== 11) return null;
    return validarCpfMatematico(cpfLimpo);
  }, [cpfLimpo]);
  
  // Verificação de duplicata com React Query
  const { 
    data: duplicateCheck, 
    isLoading: checkingDuplicate,
    error: duplicateError
  } = useVerificarCpf(cpfLimpo, cpfLimpo.length === 11 && isValidMath === true);
  
  // Estados derivados
  const statusInfo = useMemo(() => {
    if (!value) return { status: 'empty', message: '', color: '' };
    
    if (cpfLimpo.length < 11) {
      return {
        status: 'typing',
        message: 'Continue digitando...',
        color: 'text-amber-600 border-amber-300'
      };
    }
    
    if (isValidMath === false) {
      return {
        status: 'invalid',
        message: 'CPF inválido',
        color: 'text-red-600 border-red-300'
      };
    }
    
    if (checkingDuplicate) {
      return {
        status: 'checking',
        message: 'Verificando...',
        color: 'text-blue-600 border-blue-300'
      };
    }
    
    if (duplicateError) {
      return {
        status: 'error',
        message: 'Erro na verificação',
        color: 'text-red-600 border-red-300'
      };
    }
    
    if (duplicateCheck?.exists) {
      return {
        status: 'duplicate',
        message: 'CPF já cadastrado',
        color: 'text-orange-600 border-orange-300'
      };
    }
    
    if (isValidMath === true && duplicateCheck?.exists === false) {
      return {
        status: 'valid',
        message: 'CPF válido',
        color: 'text-green-600 border-green-300'
      };
    }
    
    return { status: 'unknown', message: '', color: '' };
  }, [value, cpfLimpo, isValidMath, checkingDuplicate, duplicateError, duplicateCheck]);
  
  // Callback para mudança de valor
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatarCpf(inputValue);
    
    // Limitar a 14 caracteres (CPF formatado)
    if (formatted.length <= 14) {
      onChange(formatted);
    }
  }, [onChange]);
  
  // Callback para focus
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTouched(true);
  }, []);
  
  // Callback para blur
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);
  
  // Notificar mudanças de validação
  useEffect(() => {
    if (onValidationChange && touched) {
      const isValid = isValidMath === true && duplicateCheck?.exists === false;
      const isDuplicate = duplicateCheck?.exists === true;
      onValidationChange(isValid, isDuplicate);
    }
  }, [onValidationChange, isValidMath, duplicateCheck, touched]);
  
  // Ícone baseado no status
  const StatusIcon = useMemo(() => {
    switch (statusInfo.status) {
      case 'checking':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4" />;
      case 'invalid':
      case 'duplicate':
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  }, [statusInfo.status]);
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full pl-10 pr-4 py-2 border rounded-lg
            bg-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${statusInfo.color}
            ${className}
          `}
          aria-describedby={statusInfo.message ? 'cpf-status' : undefined}
          aria-invalid={statusInfo.status === 'invalid' || statusInfo.status === 'duplicate'}
        />
        
        {/* Ícone */}
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${statusInfo.color.split(' ')[0] || 'text-gray-400'}`}>
          {StatusIcon}
        </div>
        
        {/* Loading spinner adicional para verificação */}
        {checkingDuplicate && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Mensagem de status */}
      {touched && statusInfo.message && (
        <p 
          id="cpf-status"
          className={`mt-1 text-sm ${statusInfo.color.split(' ')[0] || 'text-gray-500'}`}
          role={statusInfo.status === 'invalid' || statusInfo.status === 'duplicate' ? 'alert' : 'status'}
        >
          {statusInfo.message}
        </p>
      )}
      
      {/* Informações adicionais em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && touched && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <div>Status: {statusInfo.status}</div>
          <div>CPF Limpo: {cpfLimpo}</div>
          <div>Válido Matematicamente: {isValidMath?.toString()}</div>
          <div>Verificando Duplicata: {checkingDuplicate.toString()}</div>
          <div>É Duplicata: {duplicateCheck?.exists?.toString()}</div>
        </div>
      )}
    </div>
  );
});

InputCpfEscalavel.displayName = 'InputCpfEscalavel';

export default InputCpfEscalavel; 