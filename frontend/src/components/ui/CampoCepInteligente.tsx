'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Building,
  Info,
  Home
} from 'lucide-react'
import { cepService, EnderecoCompleto, ZoneamentoInfo } from '@/services/cepService'

interface CampoCepInteligenteProps {
  value: string
  onChange: (endereco: EnderecoCompleto | null) => void
  onCepChange: (cep: string) => void
  placeholder?: string
  className?: string
  temaId?: string
}

export default function CampoCepInteligente({ 
  value, 
  onChange, 
  onCepChange,
  placeholder = "Digite o CEP do terreno",
  className = "",
  temaId = "elegante"
}: CampoCepInteligenteProps) {
  const [cep, setCep] = useState(value)
  const [endereco, setEndereco] = useState<EnderecoCompleto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)

  useEffect(() => {
    setCep(value)
  }, [value])

  const consultarCep = async (cepDigitado: string) => {
    if (!cepService.validarCep(cepDigitado)) {
      setErro('CEP inválido')
      return
    }

    setIsLoading(true)
    setErro(null)

    try {
      const resultado = await cepService.consultarCep(cepDigitado)
      
      if (resultado) {
        setEndereco(resultado)
        onChange(resultado)
        setMostrarDetalhes(true)
        console.log('✅ Endereço encontrado:', resultado)
      } else {
        setErro('CEP não encontrado')
        setEndereco(null)
        onChange(null)
      }
    } catch (error) {
      setErro('Erro ao consultar CEP')
      setEndereco(null)
      onChange(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '')
    
    // Formatar CEP automaticamente
    if (valor.length > 5) {
      valor = `${valor.slice(0, 5)}-${valor.slice(5, 8)}`
    }
    
    setCep(valor)
    onCepChange(valor)
    setErro(null)
    
    // Consultar automaticamente quando CEP estiver completo
    if (valor.replace(/\D/g, '').length === 8) {
      consultarCep(valor)
    } else {
      setEndereco(null)
      onChange(null)
      setMostrarDetalhes(false)
    }
  }

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
    if (erro) return <AlertCircle className="w-5 h-5 text-red-500" />
    if (endereco) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <Search className="w-5 h-5 text-gray-400" />
  }

  const getStatusColor = () => {
    if (erro) return 'border-red-300 focus:border-red-500'
    if (endereco) return 'border-green-300 focus:border-green-500'
    return temaId === 'elegante' 
      ? 'border-gray-200 focus:border-blue-500' 
      : 'border-white/10 focus:border-white/30'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Campo CEP */}
      <div className="relative">
        <label className={`block text-sm font-medium mb-2 ${
          temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
        }`}>
          📍 CEP do Terreno
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            placeholder={placeholder}
            maxLength={9}
            className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border transition-all ${
              temaId === 'elegante'
                ? `bg-white text-gray-900 ${getStatusColor()}`
                : `bg-white/5 text-white ${getStatusColor()}`
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
          
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>
        
        {erro && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {erro}
          </motion.p>
        )}
      </div>

      {/* Endereço Encontrado */}
      <AnimatePresence>
        {endereco && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl border p-4 ${
              temaId === 'elegante'
                ? 'bg-green-50 border-green-200'
                : 'bg-green-500/10 border-green-500/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className={`font-medium ${
                temaId === 'elegante' ? 'text-green-900' : 'text-green-400'
              }`}>
                Endereço Encontrado
              </h4>
            </div>
            
            <div className={`space-y-2 text-sm ${
              temaId === 'elegante' ? 'text-green-800' : 'text-green-300'
            }`}>
              <p><strong>Logradouro:</strong> {endereco.logradouro}</p>
              <p><strong>Bairro:</strong> {endereco.bairro}</p>
              <p><strong>Cidade:</strong> {endereco.localidade} - {endereco.uf}</p>
              <p><strong>CEP:</strong> {endereco.cep}</p>
              
              {endereco.coordenadas && (
                <p><strong>Coordenadas:</strong> {endereco.coordenadas.lat.toFixed(6)}, {endereco.coordenadas.lng.toFixed(6)}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informações de Zoneamento */}
      <AnimatePresence>
        {endereco?.zoneamento && mostrarDetalhes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl border p-4 ${
              temaId === 'elegante'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-blue-600" />
                <h4 className={`font-medium ${
                  temaId === 'elegante' ? 'text-blue-900' : 'text-blue-400'
                }`}>
                  🏛️ Informações de Zoneamento
                </h4>
              </div>
              <button
                onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                className={`text-xs px-2 py-1 rounded ${
                  temaId === 'elegante' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {mostrarDetalhes ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            
            <div className={`space-y-3 text-sm ${
              temaId === 'elegante' ? 'text-blue-800' : 'text-blue-300'
            }`}>
              <div>
                <p className="font-medium">{endereco.zoneamento.zona}</p>
                <p className="text-xs opacity-80">{endereco.zoneamento.descricao}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-medium mb-1">📏 Parâmetros Urbanísticos:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Altura máxima: {endereco.zoneamento.parametros.alturaMaxima}</li>
                    <li>• Recuo frontal: {endereco.zoneamento.parametros.recuoFrontal}</li>
                    <li>• Recuo lateral: {endereco.zoneamento.parametros.recuoLateral}</li>
                    <li>• Recuo fundos: {endereco.zoneamento.parametros.recuoFundos}</li>
                    <li>• Taxa ocupação: {endereco.zoneamento.parametros.taxaOcupacao}</li>
                    <li>• Coef. aproveitamento: {endereco.zoneamento.parametros.coeficienteAproveitamento}</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium mb-1">⚠️ Restrições:</p>
                  <ul className="space-y-1 text-xs">
                    {endereco.zoneamento.restricoes.map((restricao, index) => (
                      <li key={index}>• {restricao}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                temaId === 'elegante' ? 'bg-blue-100' : 'bg-blue-500/20'
              }`}>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{endereco.zoneamento.observacoes}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campo adicional: Terreno em condomínio */}
      {endereco && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border ${
            temaId === 'elegante'
              ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          } transition-colors`}>
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className={`text-sm font-medium ${
                temaId === 'elegante' ? 'text-gray-700' : 'text-white/80'
              }`}>
                Terreno localizado em condomínio fechado
              </span>
            </div>
          </label>
          
          <p className={`text-xs ${
            temaId === 'elegante' ? 'text-gray-500' : 'text-white/60'
          }`}>
            ℹ️ Terrenos em condomínios podem ter aprovações adicionais e restrições específicas do regulamento interno.
          </p>
        </motion.div>
      )}
    </div>
  )
} 