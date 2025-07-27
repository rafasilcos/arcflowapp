'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, Calendar, DollarSign, MapPin, AlertCircle, CheckCircle } from 'lucide-react'

interface InputFormatadoProps {
  tipo: 'telefone' | 'email' | 'data' | 'valor' | 'cep' | 'cpf' | 'cnpj' | 'text'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  obrigatoria?: boolean
  className?: string
  temaId?: 'elegante' | 'dark'
  disabled?: boolean
}

export default function InputFormatado({
  tipo,
  value,
  onChange,
  placeholder,
  label,
  obrigatoria = false,
  className = '',
  temaId = 'elegante',
  disabled = false
}: InputFormatadoProps) {
  const [erro, setErro] = useState<string>('')
  const [valido, setValido] = useState<boolean>(false)

  // Formatadores
  const formatarTelefone = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatarData = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
  }

  const formatarMoeda = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    if (!numeros || numeros === '0') return ''
    const valorNumerico = parseInt(numeros) / 100
    return valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatarCEP = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const formatarCPF = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatarCNPJ = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  // Validadores
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validarTelefone = (telefone: string): boolean => {
    const numeros = telefone.replace(/\D/g, '')
    return numeros.length >= 10
  }

  const validarData = (data: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!regex.test(data)) return false
    
    const [, dia, mes, ano] = data.match(regex) || []
    const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
    return dataObj.getDate() == parseInt(dia) &&
           dataObj.getMonth() == parseInt(mes) - 1 &&
           dataObj.getFullYear() == parseInt(ano)
  }

  const validarCEP = (cep: string): boolean => {
    const numeros = cep.replace(/\D/g, '')
    return numeros.length === 8
  }

  const validarCPF = (cpf: string): boolean => {
    const numeros = cpf.replace(/\D/g, '')
    return numeros.length === 11
  }

  const validarCNPJ = (cnpj: string): boolean => {
    const numeros = cnpj.replace(/\D/g, '')
    return numeros.length === 14
  }

  // Aplicar formatação baseada no tipo
  const aplicarFormatacao = (novoValor: string): string => {
    switch (tipo) {
      case 'telefone':
        return formatarTelefone(novoValor)
      case 'data':
        return formatarData(novoValor)
      case 'valor':
        return formatarMoeda(novoValor)
      case 'cep':
        return formatarCEP(novoValor)
      case 'cpf':
        return formatarCPF(novoValor)
      case 'cnpj':
        return formatarCNPJ(novoValor)
      default:
        return novoValor
    }
  }

  // Validar em tempo real
  useEffect(() => {
    if (!value) {
      setErro('')
      setValido(false)
      return
    }

    switch (tipo) {
      case 'email':
        if (validarEmail(value)) {
          setValido(true)
          setErro('')
        } else {
          setValido(false)
          setErro('E-mail inválido')
        }
        break
      case 'telefone':
        if (validarTelefone(value)) {
          setValido(true)
          setErro('')
        } else {
          setValido(false)
          setErro('Telefone deve ter pelo menos 10 dígitos')
        }
        break
      case 'data':
        if (validarData(value)) {
          setValido(true)
          setErro('')
        } else {
          setValido(false)
          setErro('Data inválida (dd/mm/aaaa)')
        }
        break
      case 'cep':
        if (validarCEP(value)) {
          setValido(true)
          setErro('')
        } else {
          setValido(false)
          setErro('CEP deve ter 8 dígitos')
        }
        break
      case 'cpf':
        if (validarCPF(value)) {
          setValido(true)
          setErro('')
        } else {
          setValido(false)
          setErro('CPF deve ter 11 dígitos')
        }
        break
      case 'cnpj':
        if (validarCNPJ(value)) {
          setValido(true)
          setErro('')
        } else {
          setValido(false)
          setErro('CNPJ deve ter 14 dígitos')
        }
        break
      default:
        setValido(true)
        setErro('')
    }
  }, [value, tipo])

  // Handle change com formatação
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = e.target.value
    
    // Para campos de valor, permitir apenas números
    if (tipo === 'valor') {
      const apenasNumeros = novoValor.replace(/\D/g, '')
      if (apenasNumeros !== novoValor.replace(/\D/g, '')) {
        return // Bloqueia se tentou digitar algo que não é número
      }
    }
    
    const valorFormatado = tipo === 'email' || tipo === 'text' ? novoValor : aplicarFormatacao(novoValor)
    onChange(valorFormatado)
  }

  // Ícones por tipo
  const getIcone = () => {
    switch (tipo) {
      case 'telefone': return Phone
      case 'email': return Mail
      case 'data': return Calendar
      case 'valor': return DollarSign
      case 'cep': return MapPin
      default: return null
    }
  }

  const Icone = getIcone()

  // Placeholders inteligentes
  const getPlaceholder = (): string => {
    if (placeholder) return placeholder
    
    switch (tipo) {
      case 'telefone': return '(11) 99999-9999'
      case 'email': return 'exemplo@email.com'
      case 'data': return 'dd/mm/aaaa'
      case 'valor': return 'R$ 0,00'
      case 'cep': return '12345-678'
      case 'cpf': return '000.000.000-00'
      case 'cnpj': return '00.000.000/0000-00'
      default: return ''
    }
  }

  // Tipo de input HTML
  const getTipoInput = (): string => {
    switch (tipo) {
      case 'email': return 'email'
      case 'telefone': return 'tel'
      default: return 'text'
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium ${
          temaId === 'elegante' ? 'text-gray-700' : 'text-white/70'
        }`}>
          {label} {obrigatoria && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Ícone */}
        {Icone && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icone className={`w-4 h-4 ${
              temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
            }`} />
          </div>
        )}

        {/* Input */}
        <input
          type={getTipoInput()}
          value={value}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className={`w-full py-3 rounded-xl border transition-colors ${
            Icone ? 'pl-10 pr-12' : 'px-4'
          } ${
            erro && value
              ? temaId === 'elegante'
                ? 'border-red-500 bg-white text-gray-900 focus:border-red-500 focus:ring-red-200'
                : 'border-red-500 bg-white/5 text-white focus:border-red-400 focus:ring-red-200'
              : valido && value
                ? temaId === 'elegante'
                  ? 'border-green-500 bg-white text-gray-900 focus:border-green-500 focus:ring-green-200'
                  : 'border-green-400 bg-white/5 text-white focus:border-green-400 focus:ring-green-200'
                : temaId === 'elegante'
                  ? 'border-gray-200 bg-white focus:border-blue-500 text-gray-900'
                  : 'border-white/10 bg-white/5 focus:border-white/30 text-white placeholder:text-white/50'
          } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />

        {/* Ícone de Status */}
        {value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {erro ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : valido ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Mensagem de Erro */}
      {erro && value && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">{erro}</span>
        </div>
      )}

      {/* Dica de Formatação */}
      {!value && (tipo === 'data' || tipo === 'valor' || tipo === 'cep') && (
        <div className={`text-xs ${
          temaId === 'elegante' ? 'text-gray-500' : 'text-white/50'
        }`}>
          {tipo === 'data' && '💡 Formato: dd/mm/aaaa'}
          {tipo === 'valor' && '💡 Digite apenas números'}
          {tipo === 'cep' && '💡 Formato: 12345-678'}
        </div>
      )}
    </div>
  )
} 