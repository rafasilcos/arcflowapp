'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { DollarSign, ArrowRight, ArrowLeft, User, Building2, MapPin, Phone, Mail, Clock, Target, Plus, Minus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import InputFormatado from '@/components/ui/InputFormatado'

interface ValoresPorHora {
  seniorArquiteto: number
  plenoArquiteto: number
  juniorArquiteto: number
  tecnicoCAD: number
  estagiario: number
}

interface ConfiguracaoParametros {
  valores: ValoresPorHora
  margemMinima: number
  margemIdeal: number
  horasPorDia: number
  diasPorSemana: number
  feriasPorAno: number
  produtividade: number
  estado: string
  cidade: string
  telefone: string
  email: string
  website: string
  cnpj: string
  razaoSocial: string
  responsavelTecnico: string
  registroProfissional: string
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function ParametrosPage() {
  const [parametros, setParametros] = useState<ConfiguracaoParametros>({
    valores: {
      seniorArquiteto: 85,
      plenoArquiteto: 65,
      juniorArquiteto: 45,
      tecnicoCAD: 35,
      estagiario: 15
    },
    margemMinima: 25,
    margemIdeal: 35,
    horasPorDia: 8,
    diasPorSemana: 5,
    feriasPorAno: 30,
    produtividade: 85,
    estado: 'SP',
    cidade: '',
    telefone: '',
    email: '',
    website: '',
    cnpj: '',
    razaoSocial: '',
    responsavelTecnico: '',
    registroProfissional: ''
  })

  const [activeSection, setActiveSection] = useState<string>('valores')
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})

  const handleValueChange = (field: keyof ConfiguracaoParametros, value: any) => {
    setParametros(prev => ({
      ...prev,
      [field]: value
    }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleValorHoraChange = (nivel: keyof ValoresPorHora, valor: number) => {
    if (valor < 10 || valor > 200) return
    
    setParametros(prev => ({
      ...prev,
      valores: {
        ...prev.valores,
        [nivel]: valor
      }
    }))
    setTouched(prev => ({ ...prev, [`valores.${nivel}`]: true }))
  }

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'cidade':
        return !value ? 'Cidade é obrigatória' : ''
      case 'email':
        return !value ? 'E-mail é obrigatório' : 
               !/\S+@\S+\.\S+/.test(value) ? 'E-mail inválido' : ''
      case 'telefone':
        return !value ? 'Telefone é obrigatório' : ''
      case 'razaoSocial':
        return !value ? 'Razão social é obrigatória' : ''
      case 'responsavelTecnico':
        return !value ? 'Responsável técnico é obrigatório' : ''
      case 'registroProfissional':
        return !value ? 'Registro profissional é obrigatório' : ''
      default:
        return ''
    }
  }

  const errors = Object.keys(parametros).reduce((acc, key) => {
    if (key === 'valores') return acc
    const error = validateField(key, parametros[key as keyof ConfiguracaoParametros])
    if (error) acc[key] = error
    return acc
  }, {} as {[key: string]: string})

  const isFormValid = Object.keys(errors).length === 0 && 
    parametros.cidade && parametros.email && parametros.telefone && 
    parametros.razaoSocial && parametros.responsavelTecnico && parametros.registroProfissional

  const horasPorSemana = parametros.horasPorDia * parametros.diasPorSemana
  const diasUteisPorAno = (52 * parametros.diasPorSemana) - parametros.feriasPorAno
  const horasProdutivasPorAno = Math.round((diasUteisPorAno * parametros.horasPorDia * parametros.produtividade) / 100)

  const sections = [
    { id: 'valores', title: 'Valores por Hora', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { id: 'margem', title: 'Margem e Metas', icon: Target, color: 'from-blue-500 to-indigo-600' },
    { id: 'jornada', title: 'Jornada de Trabalho', icon: Clock, color: 'from-purple-500 to-pink-600' },
    { id: 'escritorio', title: 'Dados do Escritório', icon: Building2, color: 'from-orange-500 to-red-600' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">
          Defina seus parâmetros financeiros 💰
        </h1>
        <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
          Configure valores por hora, margem de lucro e dados do escritório. 
          Essas informações serão usadas para gerar orçamentos automáticos precisos.
        </p>
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {sections.map((section) => {
          const IconComponent = section.icon
          const isActive = activeSection === section.id
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm">{section.title}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Content Sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        
        {/* Valores por Hora */}
        {activeSection === 'valores' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Valores por Hora por Nível
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(parametros.valores).map(([nivel, valor]) => {
                const labels = {
                  seniorArquiteto: { title: 'Arquiteto Sênior', desc: '5+ anos experiência', color: 'from-green-500 to-emerald-600', icon: '👨‍💼' },
                  plenoArquiteto: { title: 'Arquiteto Pleno', desc: '2-5 anos experiência', color: 'from-blue-500 to-indigo-600', icon: '👩‍💼' },
                  juniorArquiteto: { title: 'Arquiteto Júnior', desc: '0-2 anos experiência', color: 'from-purple-500 to-pink-600', icon: '👨‍💻' },
                  tecnicoCAD: { title: 'Técnico CAD', desc: 'Desenho técnico', color: 'from-orange-500 to-red-600', icon: '👩‍💻' },
                  estagiario: { title: 'Estagiário', desc: 'Em formação', color: 'from-gray-500 to-gray-600', icon: '👨‍🎓' }
                }
                
                const info = labels[nivel as keyof typeof labels]
                
                return (
                  <div key={nivel} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center text-lg`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{info.title}</h3>
                        <p className="text-blue-100/60 text-xs">{info.desc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleValorHoraChange(nivel as keyof ValoresPorHora, valor - 5)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        disabled={valor <= 10}
                      >
                        <Minus className="h-4 w-4 text-white" />
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-lg font-bold text-white">
                          R$ {valor}/h
                        </div>
                        <input
                          type="number"
                          min="10"
                          max="200"
                          value={valor}
                          onChange={(e) => handleValorHoraChange(nivel as keyof ValoresPorHora, parseInt(e.target.value) || 10)}
                          className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white text-sm mt-1"
                        />
                      </div>
                      <button
                        onClick={() => handleValorHoraChange(nivel as keyof ValoresPorHora, valor + 5)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        disabled={valor >= 200}
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Margem e Metas */}
        {activeSection === 'margem' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Margem de Lucro e Metas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-yellow-400" />
                  <span>Margem Mínima</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleValueChange('margemMinima', Math.max(15, parametros.margemMinima - 5))}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-white">
                      {parametros.margemMinima}%
                    </div>
                    <p className="text-blue-100/60 text-sm">Abaixo disso, recusar projeto</p>
                  </div>
                  <button
                    onClick={() => handleValueChange('margemMinima', Math.min(45, parametros.margemMinima + 5))}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-400" />
                  <span>Margem Ideal</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleValueChange('margemIdeal', Math.max(25, parametros.margemIdeal - 5))}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-white">
                      {parametros.margemIdeal}%
                    </div>
                    <p className="text-blue-100/60 text-sm">Meta para orçamentos</p>
                  </div>
                  <button
                    onClick={() => handleValueChange('margemIdeal', Math.min(60, parametros.margemIdeal + 5))}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jornada de Trabalho */}
        {activeSection === 'jornada' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Jornada de Trabalho
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'horasPorDia', label: 'Horas/Dia', value: parametros.horasPorDia, min: 6, max: 12, suffix: 'h' },
                { key: 'diasPorSemana', label: 'Dias/Semana', value: parametros.diasPorSemana, min: 4, max: 6, suffix: 'd' },
                { key: 'feriasPorAno', label: 'Férias/Ano', value: parametros.feriasPorAno, min: 20, max: 60, suffix: 'd' },
                { key: 'produtividade', label: 'Produtividade', value: parametros.produtividade, min: 70, max: 95, suffix: '%' }
              ].map((item) => (
                <div key={item.key} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="font-medium text-white mb-3 text-sm">{item.label}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleValueChange(item.key as keyof ConfiguracaoParametros, Math.max(item.min, item.value - 1))}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                    >
                      <Minus className="h-3 w-3 text-white" />
                    </button>
                    <div className="flex-1 text-center">
                      <div className="text-lg font-bold text-white">
                        {item.value}{item.suffix}
                      </div>
                    </div>
                    <button
                      onClick={() => handleValueChange(item.key as keyof ConfiguracaoParametros, Math.min(item.max, item.value + 1))}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                    >
                      <Plus className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo Automático */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Resumo Automático</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{horasPorSemana}h</div>
                  <div className="text-purple-300/70 text-sm">por semana</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{diasUteisPorAno}d</div>
                  <div className="text-purple-300/70 text-sm">úteis por ano</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{horasProdutivasPorAno}h</div>
                  <div className="text-purple-300/70 text-sm">produtivas/ano</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dados do Escritório */}
        {activeSection === 'escritorio' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Dados do Escritório
            </h2>
            
            <div className="space-y-6">
              {/* Localização */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Localização</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Estado</label>
                    <select
                      value={parametros.estado}
                      onChange={(e) => handleValueChange('estado', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    >
                      {estadosBrasil.map(estado => (
                        <option key={estado} value={estado} className="bg-gray-800">
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Cidade *</label>
                    <input
                      type="text"
                      value={parametros.cidade}
                      onChange={(e) => handleValueChange('cidade', e.target.value)}
                      placeholder="Ex: São Paulo"
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 ${
                        errors.cidade ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.cidade && touched.cidade && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.cidade}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contatos */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span>Contatos</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <InputFormatado
                      tipo="telefone"
                      value={parametros.telefone}
                      onChange={(value) => handleValueChange('telefone', value)}
                      placeholder="(11) 99999-9999"
                      label="Telefone/WhatsApp"
                      obrigatoria
                      temaId="dark"
                    />
                    {errors.telefone && touched.telefone && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.telefone}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <InputFormatado
                      tipo="email"
                      value={parametros.email}
                      onChange={(value) => handleValueChange('email', value)}
                      placeholder="contato@escritorio.com.br"
                      label="E-mail"
                      obrigatoria
                      temaId="dark"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Website</label>
                    <input
                      type="url"
                      value={parametros.website}
                      onChange={(e) => handleValueChange('website', e.target.value)}
                      placeholder="www.escritorio.com.br"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Dados Legais */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-purple-400" />
                  <span>Dados Legais</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputFormatado
                      tipo="cnpj"
                      value={parametros.cnpj}
                      onChange={(value) => handleValueChange('cnpj', value)}
                      placeholder="00.000.000/0001-00"
                      label="CNPJ"
                      temaId="dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Razão Social *</label>
                    <input
                      type="text"
                      value={parametros.razaoSocial}
                      onChange={(e) => handleValueChange('razaoSocial', e.target.value)}
                      placeholder="Escritório de Arquitetura Ltda"
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 ${
                        errors.razaoSocial ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.razaoSocial && touched.razaoSocial && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.razaoSocial}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Responsável Técnico *</label>
                    <input
                      type="text"
                      value={parametros.responsavelTecnico}
                      onChange={(e) => handleValueChange('responsavelTecnico', e.target.value)}
                      placeholder="Nome do arquiteto/engenheiro"
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 ${
                        errors.responsavelTecnico ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.responsavelTecnico && touched.responsavelTecnico && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.responsavelTecnico}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">CAU/CREA *</label>
                    <input
                      type="text"
                      value={parametros.registroProfissional}
                      onChange={(e) => handleValueChange('registroProfissional', e.target.value)}
                      placeholder="SP123456"
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 ${
                        errors.registroProfissional ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.registroProfissional && touched.registroProfissional && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.registroProfissional}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Dica */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-400 text-sm">💡</span>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">
              Configuração Inteligente
            </h3>
            <p className="text-blue-100/70 text-sm leading-relaxed">
              Esses parâmetros serão usados em todos os orçamentos automáticos, relatórios financeiros 
              e análises de produtividade. Você pode ajustar esses valores a qualquer momento nas configurações.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex justify-between items-center pt-8 border-t border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link
          href="/onboarding/etapas"
          className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
        >
          <motion.div
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
          <span>Voltar: Metodologia</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="text-blue-100/60 text-sm">
            Etapa 5 de 6
          </div>
          
          <Link
            href="/onboarding/conclusao"
            className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
              isFormValid
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
            onClick={(e) => {
              if (!isFormValid) {
                e.preventDefault()
                // Marcar campos obrigatórios como touched
                const requiredFields = ['cidade', 'email', 'telefone', 'razaoSocial', 'responsavelTecnico', 'registroProfissional']
                const newTouched = requiredFields.reduce((acc, field) => ({
                  ...acc,
                  [field]: true
                }), {})
                setTouched(prev => ({ ...prev, ...newTouched }))
              }
            }}
          >
            <span>Finalizar: Conclusão</span>
            <motion.div
              animate={isFormValid ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  )
} 