import React, { useState, useEffect, useCallback } from 'react'
import { verificarCpfDuplicado } from '@/services/clienteService'
import { toast } from 'react-hot-toast'

interface InputCpfInteligenteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  obrigatoria?: boolean
}

interface StatusCpf {
  valido: boolean
  duplicado: boolean
  nomeClienteExistente?: string
  verificando: boolean
  erro?: string
}

export default function InputCpfInteligente({
  value,
  onChange,
  placeholder = "000.000.000-00",
  className = "",
  disabled = false,
  label = "CPF",
  obrigatoria = false
}: InputCpfInteligenteProps) {
  const [status, setStatus] = useState<StatusCpf>({
    valido: false,
    duplicado: false,
    verificando: false
  })

  // Função para validar CPF matematicamente
  const validarCPF = (cpf: string): boolean => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    if (cpfLimpo.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false
    
    // Calcular primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i)
    }
    let resto = 11 - (soma % 11)
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false
    
    // Calcular segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i)
    }
    resto = 11 - (soma % 11)
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false
    
    return true
  }

  // Função para formatar CPF
  const formatarCPF = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Verificação de duplicado otimizada (só quando CPF está completo e válido)
  const verificarDuplicado = useCallback(async (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    // Só verifica se CPF tem 11 dígitos e é válido
    if (cpfLimpo.length !== 11 || !validarCPF(cpf)) {
      return
    }

    setStatus(prev => ({ ...prev, verificando: true }))
    
    try {
      const resultado = await verificarCpfDuplicado(cpf)
      
      // ✅ VERIFICAR SE RESULTADO EXISTE
      if (!resultado) {
        setStatus(prev => ({
          ...prev,
          duplicado: false,
          verificando: false,
          erro: 'Erro na verificação'
        }))
        return
      }
      
      setStatus(prev => ({
        ...prev,
        duplicado: resultado.duplicado || false,
        nomeClienteExistente: resultado.nomeCliente,
        verificando: false
      }))

      // Toast só para duplicados (não para CPF válido)
      if (resultado.duplicado) {
        toast.error(`⚠️ CPF já cadastrado para: ${resultado.nomeCliente}`, {
          duration: 4000,
          position: 'top-right'
        })
      }
      
    } catch (error: any) {
      console.error('Erro ao verificar CPF duplicado:', error.message || error)
      setStatus(prev => ({
        ...prev,
        verificando: false,
        duplicado: false, // Considera disponível em caso de erro
        erro: 'Erro na verificação'
      }))
    }
  }, [])

  // Validação em tempo real
  useEffect(() => {
    const cpfLimpo = value.replace(/\D/g, '')
    
    if (cpfLimpo.length === 0) {
      setStatus({
        valido: false,
        duplicado: false,
        verificando: false
      })
      return
    }

    // Validação matemática (instantânea)
    const cpfValido = validarCPF(value)
    
    setStatus(prev => ({
      ...prev,
      valido: cpfValido,
      erro: undefined
    }))

    // Verificação de duplicado (com debounce de 800ms)
    if (cpfValido && cpfLimpo.length === 11) {
      const timer = setTimeout(() => {
        verificarDuplicado(value)
      }, 800) // Debounce otimizado

      return () => clearTimeout(timer)
    } else {
      // Limpar estado de duplicado se CPF não está completo/válido
      setStatus(prev => ({
        ...prev,
        duplicado: false,
        nomeClienteExistente: undefined,
        verificando: false
      }))
    }
  }, [value, verificarDuplicado])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCPF(e.target.value)
    onChange(valorFormatado)
  }

  // Determinar classe CSS baseada no status
  const getInputClassName = () => {
    let baseClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${className}`
    
    const cpfLimpo = value.replace(/\D/g, '')
    
    if (cpfLimpo.length === 0) {
      return `${baseClass} border-gray-300`
    }
    
    if (cpfLimpo.length < 11) {
      return `${baseClass} border-yellow-300 bg-yellow-50`
    }
    
    if (!status.valido) {
      return `${baseClass} border-red-500 bg-red-50`
    }
    
    if (status.duplicado) {
      return `${baseClass} border-orange-500 bg-orange-50`
    }
    
    return `${baseClass} border-green-500 bg-green-50`
  }

  // Ícone de status
  const renderIconeStatus = () => {
    const cpfLimpo = value.replace(/\D/g, '')
    
    if (status.verificando) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    
    if (cpfLimpo.length === 11) {
      if (!status.valido) {
        return (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-red-500 text-lg">❌</span>
          </div>
        )
      }
      
      if (status.duplicado) {
        return (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-orange-500 text-lg">⚠️</span>
          </div>
        )
      }
      
      if (status.valido && !status.duplicado) {
        return (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-green-500 text-lg">✅</span>
          </div>
        )
      }
    }
    
    return null
  }

  // Mensagem de status
  const renderMensagemStatus = () => {
    const cpfLimpo = value.replace(/\D/g, '')
    
    if (cpfLimpo.length === 0) return null
    
    if (cpfLimpo.length < 11) {
      return (
        <p className="text-yellow-600 text-sm mt-1">
          📝 Continue digitando... ({cpfLimpo.length}/11 dígitos)
        </p>
      )
    }
    
    if (!status.valido) {
      return (
        <p className="text-red-600 text-sm mt-1">
          ❌ CPF inválido - Verifique os números digitados
        </p>
      )
    }
    
    if (status.duplicado) {
      return (
        <p className="text-orange-600 text-sm mt-1">
          ⚠️ CPF já cadastrado para: <strong>{status.nomeClienteExistente}</strong>
        </p>
      )
    }
    
    if (status.valido && !status.duplicado) {
      return (
        <p className="text-green-600 text-sm mt-1">
          ✅ CPF válido e disponível
        </p>
      )
    }
    
    return null
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {obrigatoria && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={14} // CPF formatado: 000.000.000-00
          className={getInputClassName()}
        />
        {renderIconeStatus()}
      </div>
      
      {renderMensagemStatus()}
    </div>
  )
}

// Hook para usar o status do CPF externamente
export const useCpfStatus = (cpf: string) => {
  const [status, setStatus] = useState({
    valido: false,
    duplicado: false,
    podeSubmeter: false
  })

  useEffect(() => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    if (cpfLimpo.length !== 11) {
      setStatus({ valido: false, duplicado: false, podeSubmeter: false })
      return
    }

    // Validação matemática
    const valido = cpfLimpo.length === 11 && !/^(\d)\1{10}$/.test(cpfLimpo)
    
    setStatus(prev => ({
      ...prev,
      valido,
      podeSubmeter: valido && !prev.duplicado
    }))
  }, [cpf])

  return status
} 