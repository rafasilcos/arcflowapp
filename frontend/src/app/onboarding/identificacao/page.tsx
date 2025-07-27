'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Upload, 
  Palette, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Camera,
  Sparkles,
  Settings,
  FileText,
  Shield,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

interface DadosEscritorio {
  nome_escritorio: string
  tipo_pessoa: 'Física' | 'Jurídica'
  cpf_cnpj: string
  endereco: {
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
  telefone: string
  email: string
  website: string
}

interface DadosResponsavel {
  nome_completo: string
  cargo: string
  formacao: string
  registro_profissional: string
  email_responsavel: string
  telefone_responsavel: string
}

interface Personalizacao {
  logo_escritorio: File | null
  tema_cores: string
  estilo_interface: string
  preview_ativo: boolean
}

const temasCores = [
  { id: 'azul', nome: 'Azul Profissional', cor: 'from-blue-500 to-blue-600', preview: 'bg-blue-500' },
  { id: 'verde', nome: 'Verde Sustentável', cor: 'from-green-500 to-green-600', preview: 'bg-green-500' },
  { id: 'roxo', nome: 'Roxo Criativo', cor: 'from-purple-500 to-purple-600', preview: 'bg-purple-500' },
  { id: 'laranja', nome: 'Laranja Energético', cor: 'from-orange-500 to-orange-600', preview: 'bg-orange-500' },
  { id: 'vermelho', nome: 'Vermelho Dinâmico', cor: 'from-red-500 to-red-600', preview: 'bg-red-500' },
  { id: 'indigo', nome: 'Índigo Elegante', cor: 'from-indigo-500 to-indigo-600', preview: 'bg-indigo-500' }
]

const estilosInterface = [
  { id: 'moderno', nome: 'Moderno', descricao: 'Design clean com elementos contemporâneos' },
  { id: 'classico', nome: 'Clássico', descricao: 'Visual tradicional e profissional' },
  { id: 'minimalista', nome: 'Minimalista', descricao: 'Interface limpa e focada' }
]

export default function IdentificacaoPage() {
  const [etapaAtual, setEtapaAtual] = useState<'dados' | 'responsavel' | 'personalizacao' | 'preview'>('dados')
  const [dadosEscritorio, setDadosEscritorio] = useState<DadosEscritorio>({
    nome_escritorio: '',
    tipo_pessoa: 'Jurídica',
    cpf_cnpj: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    telefone: '',
    email: '',
    website: ''
  })
  
  const [dadosResponsavel, setDadosResponsavel] = useState<DadosResponsavel>({
    nome_completo: '',
    cargo: '',
    formacao: '',
    registro_profissional: '',
    email_responsavel: '',
    telefone_responsavel: ''
  })
  
  const [personalizacao, setPersonalizacao] = useState<Personalizacao>({
    logo_escritorio: null,
    tema_cores: 'azul',
    estilo_interface: 'moderno',
    preview_ativo: false
  })

  const temaEscolhido = temasCores.find(t => t.id === personalizacao.tema_cores) || temasCores[0]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPersonalizacao(prev => ({ ...prev, logo_escritorio: file }))
    }
  }

  const buscarCEP = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setDadosEscritorio(prev => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              cep,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            }
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const podeAvancar = () => {
    switch (etapaAtual) {
      case 'dados':
        return dadosEscritorio.nome_escritorio && dadosEscritorio.cpf_cnpj && dadosEscritorio.email
      case 'responsavel':
        return dadosResponsavel.nome_completo && dadosResponsavel.cargo && dadosResponsavel.email_responsavel
      case 'personalizacao':
        return true
      case 'preview':
        return true
      default:
        return false
    }
  }

  const proximaEtapa = () => {
    if (etapaAtual === 'dados') setEtapaAtual('responsavel')
    else if (etapaAtual === 'responsavel') setEtapaAtual('personalizacao')
    else if (etapaAtual === 'personalizacao') setEtapaAtual('preview')
  }

  const etapaAnterior = () => {
    if (etapaAtual === 'responsavel') setEtapaAtual('dados')
    else if (etapaAtual === 'personalizacao') setEtapaAtual('responsavel')
    else if (etapaAtual === 'preview') setEtapaAtual('personalizacao')
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* Header com Preview do Tema */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${temaEscolhido.cor} rounded-2xl flex items-center justify-center`}>
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {etapaAtual === 'dados' && 'Dados do Escritório'}
            {etapaAtual === 'responsavel' && 'Responsável Técnico'}
            {etapaAtual === 'personalizacao' && 'Personalização Visual'}
            {etapaAtual === 'preview' && 'Confirmação Final'}
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-3xl mx-auto">
            {etapaAtual === 'dados' && 'Vamos começar identificando seu escritório. Esses dados serão usados em contratos, propostas e documentos oficiais.'}
            {etapaAtual === 'responsavel' && 'Agora precisamos dos dados do responsável técnico principal do escritório.'}
            {etapaAtual === 'personalizacao' && 'Personalize a aparência do ArcFlow com a identidade visual do seu escritório.'}
            {etapaAtual === 'preview' && 'Revise todas as informações antes de prosseguir para a configuração dos módulos.'}
          </p>
          
          {/* Barra de Progresso */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-blue-200">Etapa 1 de 8</span>
              <span className="text-xs text-blue-200">Identificação</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${temaEscolhido.cor} h-2 rounded-full transition-all duration-500`}
                style={{ 
                  width: etapaAtual === 'dados' ? '25%' : 
                         etapaAtual === 'responsavel' ? '50%' : 
                         etapaAtual === 'personalizacao' ? '75%' : '100%' 
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Conteúdo Principal */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            
            {etapaAtual === 'dados' && (
              /* Dados do Escritório */
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Building2 className="h-6 w-6 text-blue-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Informações do Escritório</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome do Escritório */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Nome do Escritório *
                    </label>
                    <input
                      type="text"
                      value={dadosEscritorio.nome_escritorio}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, nome_escritorio: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Silva Arquitetura e Urbanismo"
                    />
                  </div>

                  {/* Tipo de Pessoa */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Tipo de Pessoa *
                    </label>
                    <div className="flex gap-3">
                      {['Física', 'Jurídica'].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => setDadosEscritorio(prev => ({ ...prev, tipo_pessoa: tipo as 'Física' | 'Jurídica' }))}
                          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                            dadosEscritorio.tipo_pessoa === tipo
                              ? `bg-gradient-to-r ${temaEscolhido.cor} text-white`
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CPF/CNPJ */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      {dadosEscritorio.tipo_pessoa === 'Física' ? 'CPF' : 'CNPJ'} *
                    </label>
                    <input
                      type="text"
                      value={dadosEscritorio.cpf_cnpj}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, cpf_cnpj: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={dadosEscritorio.tipo_pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                  </div>

                  {/* CEP */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={dadosEscritorio.endereco.cep}
                      onChange={(e) => {
                        const cep = e.target.value.replace(/\D/g, '')
                        setDadosEscritorio(prev => ({ ...prev, endereco: { ...prev.endereco, cep } }))
                        if (cep.length === 8) buscarCEP(cep)
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="00000-000"
                      maxLength={8}
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={dadosEscritorio.endereco.rua}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, endereco: { ...prev.endereco, rua: e.target.value } }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Rua, Avenida..."
                    />
                  </div>

                  {/* Número e Complemento */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={dadosEscritorio.endereco.numero}
                        onChange={(e) => setDadosEscritorio(prev => ({ ...prev, endereco: { ...prev.endereco, numero: e.target.value } }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={dadosEscritorio.endereco.complemento}
                        onChange={(e) => setDadosEscritorio(prev => ({ ...prev, endereco: { ...prev.endereco, complemento: e.target.value } }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Sala, Andar..."
                      />
                    </div>
                  </div>

                  {/* Cidade e Estado */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={dadosEscritorio.endereco.cidade}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, endereco: { ...prev.endereco, cidade: e.target.value } }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="São Paulo"
                    />
                  </div>

                  {/* Contato */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={dadosEscritorio.telefone}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, telefone: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={dadosEscritorio.email}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contato@escritorio.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Website (opcional)
                    </label>
                    <input
                      type="url"
                      value={dadosEscritorio.website}
                      onChange={(e) => setDadosEscritorio(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.escritorio.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {etapaAtual === 'responsavel' && (
              /* Dados do Responsável */
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-blue-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Responsável Técnico</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={dadosResponsavel.nome_completo}
                      onChange={(e) => setDadosResponsavel(prev => ({ ...prev, nome_completo: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="João Silva Santos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      value={dadosResponsavel.cargo}
                      onChange={(e) => setDadosResponsavel(prev => ({ ...prev, cargo: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Arquiteto Responsável"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Formação
                    </label>
                    <input
                      type="text"
                      value={dadosResponsavel.formacao}
                      onChange={(e) => setDadosResponsavel(prev => ({ ...prev, formacao: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Arquitetura e Urbanismo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      CREA/CAU
                    </label>
                    <input
                      type="text"
                      value={dadosResponsavel.registro_profissional}
                      onChange={(e) => setDadosResponsavel(prev => ({ ...prev, registro_profissional: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CAU A123456-7"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={dadosResponsavel.email_responsavel}
                      onChange={(e) => setDadosResponsavel(prev => ({ ...prev, email_responsavel: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="joao@escritorio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={dadosResponsavel.telefone_responsavel}
                      onChange={(e) => setDadosResponsavel(prev => ({ ...prev, telefone_responsavel: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>
            )}

            {etapaAtual === 'personalizacao' && (
              /* Personalização Visual */
              <div className="space-y-8">
                <div className="flex items-center mb-6">
                  <Palette className="h-6 w-6 text-blue-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Personalização Visual</h2>
                </div>

                {/* Upload de Logo */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Logo do Escritório</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/10 border-2 border-dashed border-white/30 rounded-xl flex items-center justify-center">
                      {personalizacao.logo_escritorio ? (
                        <img 
                          src={URL.createObjectURL(personalizacao.logo_escritorio)} 
                          alt="Logo" 
                          className="w-full h-full object-contain rounded-xl"
                        />
                      ) : (
                        <Camera className="h-8 w-8 text-white/50" />
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors">
                          <Upload className="h-4 w-4 mr-2" />
                          {personalizacao.logo_escritorio ? 'Alterar Logo' : 'Fazer Upload'}
                        </div>
                      </label>
                      <p className="text-xs text-white/60 mt-1">PNG, JPG até 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Tema de Cores */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Tema de Cores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {temasCores.map((tema) => (
                      <button
                        key={tema.id}
                        onClick={() => setPersonalizacao(prev => ({ ...prev, tema_cores: tema.id }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          personalizacao.tema_cores === tema.id
                            ? 'border-white/40 bg-white/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-full h-8 ${tema.preview} rounded-lg mb-2`} />
                        <div className="text-white text-sm font-medium">{tema.nome}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estilo da Interface */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Estilo da Interface</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {estilosInterface.map((estilo) => (
                      <button
                        key={estilo.id}
                        onClick={() => setPersonalizacao(prev => ({ ...prev, estilo_interface: estilo.id }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          personalizacao.estilo_interface === estilo.id
                            ? 'border-white/40 bg-white/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-white font-medium mb-1">{estilo.nome}</div>
                        <div className="text-white/60 text-sm">{estilo.descricao}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Preview do Dashboard</h3>
                    <button
                      onClick={() => setPersonalizacao(prev => ({ ...prev, preview_ativo: !prev.preview_ativo }))}
                      className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {personalizacao.preview_ativo ? 'Ocultar' : 'Visualizar'}
                    </button>
                  </div>
                  
                  {personalizacao.preview_ativo && (
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-white/20 rounded-lg mr-3 flex items-center justify-center">
                            {personalizacao.logo_escritorio ? (
                              <img 
                                src={URL.createObjectURL(personalizacao.logo_escritorio)} 
                                alt="Logo" 
                                className="w-full h-full object-contain rounded"
                              />
                            ) : (
                              <Building2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-white font-semibold">
                            {dadosEscritorio.nome_escritorio || 'Seu Escritório'}
                          </span>
                        </div>
                        <div className={`px-3 py-1 ${temaEscolhido.preview} rounded-full text-white text-xs`}>
                          {temaEscolhido.nome}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/10 rounded p-3">
                          <div className="text-white/60 text-xs">Projetos</div>
                          <div className="text-white font-bold">12</div>
                        </div>
                        <div className="bg-white/10 rounded p-3">
                          <div className="text-white/60 text-xs">Clientes</div>
                          <div className="text-white font-bold">8</div>
                        </div>
                        <div className="bg-white/10 rounded p-3">
                          <div className="text-white/60 text-xs">Receita</div>
                          <div className="text-white font-bold">R$ 45k</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {etapaAtual === 'preview' && (
              /* Preview Final */
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Confirmação dos Dados</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resumo Escritório */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Escritório
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-white/60">Nome:</span> <span className="text-white">{dadosEscritorio.nome_escritorio}</span></div>
                      <div><span className="text-white/60">Tipo:</span> <span className="text-white">{dadosEscritorio.tipo_pessoa}</span></div>
                      <div><span className="text-white/60">{dadosEscritorio.tipo_pessoa === 'Física' ? 'CPF' : 'CNPJ'}:</span> <span className="text-white">{dadosEscritorio.cpf_cnpj}</span></div>
                      <div><span className="text-white/60">E-mail:</span> <span className="text-white">{dadosEscritorio.email}</span></div>
                      <div><span className="text-white/60">Telefone:</span> <span className="text-white">{dadosEscritorio.telefone}</span></div>
                    </div>
                  </div>

                  {/* Resumo Responsável */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Responsável
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-white/60">Nome:</span> <span className="text-white">{dadosResponsavel.nome_completo}</span></div>
                      <div><span className="text-white/60">Cargo:</span> <span className="text-white">{dadosResponsavel.cargo}</span></div>
                      <div><span className="text-white/60">Formação:</span> <span className="text-white">{dadosResponsavel.formacao}</span></div>
                      <div><span className="text-white/60">Registro:</span> <span className="text-white">{dadosResponsavel.registro_profissional}</span></div>
                      <div><span className="text-white/60">E-mail:</span> <span className="text-white">{dadosResponsavel.email_responsavel}</span></div>
                    </div>
                  </div>

                  {/* Resumo Personalização */}
                  <div className="md:col-span-2 bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Personalização
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                        {personalizacao.logo_escritorio ? (
                          <img 
                            src={URL.createObjectURL(personalizacao.logo_escritorio)} 
                            alt="Logo" 
                            className="w-full h-full object-contain rounded-xl"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-white/50" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{temaEscolhido.nome}</div>
                        <div className="text-white/60 text-sm">Estilo {personalizacao.estilo_interface}</div>
                        <div className={`inline-block px-3 py-1 ${temaEscolhido.preview} rounded-full text-white text-xs mt-2`}>
                          Preview do tema
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
              <button
                onClick={etapaAnterior}
                disabled={etapaAtual === 'dados'}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  etapaAtual === 'dados'
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Anterior
              </button>

              <div className="text-center">
                <div className="text-xs text-white/60 mb-1">
                  {etapaAtual === 'dados' && 'Dados básicos do escritório'}
                  {etapaAtual === 'responsavel' && 'Responsável técnico'}
                  {etapaAtual === 'personalizacao' && 'Personalização visual'}
                  {etapaAtual === 'preview' && 'Confirmação final'}
                </div>
                <div className="flex gap-2">
                  {['dados', 'responsavel', 'personalizacao', 'preview'].map((etapa, index) => (
                    <div
                      key={etapa}
                      className={`w-2 h-2 rounded-full transition-all ${
                        etapa === etapaAtual ? `bg-gradient-to-r ${temaEscolhido.cor}` : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {etapaAtual === 'preview' ? (
                <Link href="/onboarding/perfil">
                  <motion.button
                    className={`flex items-center px-6 py-3 bg-gradient-to-r ${temaEscolhido.cor} text-white rounded-xl font-semibold hover:shadow-xl transition-all`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continuar
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                </Link>
              ) : (
                <button
                  onClick={proximaEtapa}
                  disabled={!podeAvancar()}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                    podeAvancar()
                      ? `bg-gradient-to-r ${temaEscolhido.cor} text-white hover:shadow-xl`
                      : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Próximo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Início</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 1 de 8 • Identificação do Escritório
          </div>
          
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  )
} 