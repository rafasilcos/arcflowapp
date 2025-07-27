'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Palette,
  Upload,
  Eye,
  Sparkles,
  FileText,
  PenTool,
  Image,
  Monitor,
  Smartphone,
  Mail,
  Download,
  CheckCircle2,
  Camera,
  Edit3,
  Brush,
  Star
} from 'lucide-react'

// Interfaces
interface PersonalizacaoSistema {
  logo: {
    arquivo: File | null
    preview: string
    posicao: 'esquerda' | 'centro' | 'direita'
  }
  cores: {
    primaria: string
    secundaria: string
    acento: string
    paleta: string
  }
  templates: {
    cabecalho: string
    rodape: string
    assinatura: string
    estilo: 'moderno' | 'classico' | 'minimalista'
  }
  assinaturaDigital: {
    arquivo: File | null
    preview: string
    nome: string
    cargo: string
  }
}

// Paletas de cores predefinidas
const PALETAS_CORES = [
  {
    id: 'profissional',
    nome: 'Profissional',
    descricao: 'Azul corporativo confiável',
    primaria: '#2563eb',
    secundaria: '#1e40af',
    acento: '#3b82f6',
    preview: 'bg-gradient-to-r from-blue-600 to-blue-700'
  },
  {
    id: 'elegante',
    nome: 'Elegante',
    descricao: 'Tons neutros sofisticados',
    primaria: '#374151',
    secundaria: '#1f2937',
    acento: '#6b7280',
    preview: 'bg-gradient-to-r from-gray-700 to-gray-800'
  },
  {
    id: 'moderno',
    nome: 'Moderno',
    descricao: 'Verde tecnológico inovador',
    primaria: '#059669',
    secundaria: '#047857',
    acento: '#10b981',
    preview: 'bg-gradient-to-r from-emerald-600 to-emerald-700'
  },
  {
    id: 'criativo',
    nome: 'Criativo',
    descricao: 'Roxo inspirador e único',
    primaria: '#7c3aed',
    secundaria: '#6d28d9',
    acento: '#8b5cf6',
    preview: 'bg-gradient-to-r from-violet-600 to-violet-700'
  },
  {
    id: 'energetico',
    nome: 'Energético',
    descricao: 'Laranja vibrante e dinâmico',
    primaria: '#ea580c',
    secundaria: '#c2410c',
    acento: '#fb923c',
    preview: 'bg-gradient-to-r from-orange-600 to-orange-700'
  },
  {
    id: 'premium',
    nome: 'Premium',
    descricao: 'Dourado luxuoso e exclusivo',
    primaria: '#d97706',
    secundaria: '#b45309',
    acento: '#f59e0b',
    preview: 'bg-gradient-to-r from-amber-600 to-amber-700'
  }
]

const ESTILOS_TEMPLATE = [
  {
    id: 'moderno',
    nome: 'Moderno',
    descricao: 'Design clean com elementos geométricos',
    preview: '📐'
  },
  {
    id: 'classico',
    nome: 'Clássico',
    descricao: 'Tradicional e elegante',
    preview: '🏛️'
  },
  {
    id: 'minimalista',
    nome: 'Minimalista',
    descricao: 'Simplicidade e funcionalidade',
    preview: '⚪'
  }
]

export default function PersonalizacaoSistema() {
  const router = useRouter()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const assinaturaInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<PersonalizacaoSistema>({
    logo: {
      arquivo: null,
      preview: '',
      posicao: 'esquerda'
    },
    cores: {
      primaria: '#2563eb',
      secundaria: '#1e40af',
      acento: '#3b82f6',
      paleta: 'profissional'
    },
    templates: {
      cabecalho: '',
      rodape: '',
      assinatura: '',
      estilo: 'moderno'
    },
    assinaturaDigital: {
      arquivo: null,
      preview: '',
      nome: '',
      cargo: ''
    }
  })

  const [dadosCompletos, setDadosCompletos] = useState<any>({})
  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])
  const [previewTemplate, setPreviewTemplate] = useState(false)

  useEffect(() => {
    // Carregar dados das etapas anteriores
    const dadosAnteriores = localStorage.getItem('arcflow-onboarding-v3')
    if (dadosAnteriores) {
      const dados = JSON.parse(dadosAnteriores)
      setDadosCompletos(dados)
      gerarSugestoesIA(dados)
      preencherDadosAutomaticos(dados)
    }
  }, [])

  const preencherDadosAutomaticos = (dados: any) => {
    // Preencher automaticamente baseado nos dados anteriores
    if (dados.identificacao?.nomeEmpresa) {
      setFormData(prev => ({
        ...prev,
        templates: {
          ...prev.templates,
          cabecalho: dados.identificacao.nomeEmpresa,
          rodape: `${dados.identificacao.nomeEmpresa} - Todos os direitos reservados`
        },
        assinaturaDigital: {
          ...prev.assinaturaDigital,
          nome: dados.identificacao.nomeResponsavel || '',
          cargo: dados.identificacao.cargo || 'Responsável Técnico'
        }
      }))
    }
  }

  const gerarSugestoesIA = (dados: any) => {
    const sugestoes: string[] = []
    
    const porte = dados?.identificacao?.porte
    const disciplinas = dados?.perfilTecnico?.disciplinasAtivas || {}
    
    if (porte === 'Solo') {
      sugestoes.push('👤 Profissional solo: Recomendamos paleta "Profissional" para transmitir confiança e credibilidade.')
    } else if (porte === 'Pequeno' || porte === 'Médio') {
      sugestoes.push('🏢 Empresa consolidada: Paleta "Elegante" ou "Premium" destacará sua expertise no mercado.')
    }
    
    if (disciplinas.arquitetura?.ativa) {
      sugestoes.push('🎨 Escritório de arquitetura: Template "Moderno" combina perfeitamente com projetos inovadores.')
    }
    
    if (disciplinas.estrutural?.ativa) {
      sugestoes.push('⚙️ Engenharia estrutural: Template "Clássico" transmite solidez e confiabilidade técnica.')
    }
    
    if (Object.keys(disciplinas).filter(d => disciplinas[d]?.ativa).length > 2) {
      sugestoes.push('🔗 Escritório multidisciplinar: Template "Minimalista" manterá foco no conteúdo técnico.')
    }
    
    const estado = dados?.identificacao?.localizacao?.estado
    if (estado === 'SP' || estado === 'RJ') {
      sugestoes.push('🏙️ Mercado competitivo: Investir em identidade visual forte é essencial para se destacar.')
    }

    setSugestoesIA(sugestoes)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo deve ter no máximo 2MB')
        return
      }
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logo: {
            ...prev.logo,
            arquivo: file,
            preview: e.target?.result as string
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAssinaturaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamanho (máx 1MB)
      if (file.size > 1024 * 1024) {
        alert('Assinatura deve ter no máximo 1MB')
        return
      }
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          assinaturaDigital: {
            ...prev.assinaturaDigital,
            arquivo: file,
            preview: e.target?.result as string
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaletaChange = (paleta: any) => {
    setFormData(prev => ({
      ...prev,
      cores: {
        primaria: paleta.primaria,
        secundaria: paleta.secundaria,
        acento: paleta.acento,
        paleta: paleta.id
      }
    }))
  }

  const handleVoltar = () => {
    router.push('/onboarding/v3/precificacao')
  }

  const handleContinuar = () => {
    // Salvar dados
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      personalizacao: formData
    }))
    
    router.push('/onboarding/v3/conclusao')
  }

  const isFormValid = () => {
    return formData.cores.paleta && formData.templates.estilo
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoltar}
              className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="w-px h-6 bg-white/20"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">Personalização da Marca</h1>
              <p className="text-blue-200/70">Etapa 7 de 8</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-sm text-blue-100">87.5% Concluído</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-[87.5%] transition-all duration-1000"></div>
          </div>
        </motion.div>

        {/* Cards IA e Preview no Topo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* IA Helper */}
          <motion.div
            className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Designer IA</h3>
            </div>
            
            {sugestoesIA.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-purple-300 font-medium">
                  Recomendações personalizadas:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Analisando seu perfil para sugestões de design...
              </p>
            )}
          </motion.div>

          {/* Preview da Personalização */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Preview do Sistema</h3>
            </div>
            
            <div className="space-y-4">
              {/* Mini preview com as cores escolhidas */}
              <div 
                className="p-4 rounded-xl border-2 transition-all duration-300"
                style={{ 
                  backgroundColor: formData.cores.primaria + '10',
                  borderColor: formData.cores.primaria + '30'
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  {formData.logo.preview ? (
                    <img 
                      src={formData.logo.preview} 
                      alt="Logo preview" 
                      className="w-8 h-8 object-contain rounded"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: formData.cores.primaria }}
                    >
                      LOGO
                    </div>
                  )}
                  <div>
                    <div className="text-white font-bold text-sm">{dadosCompletos.identificacao?.nomeEmpresa || 'Sua Empresa'}</div>
                    <div className="text-xs" style={{ color: formData.cores.acento }}>Sistema Personalizado</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: formData.cores.primaria }}
                  ></div>
                  <div 
                    className="h-1 rounded-full w-3/4"
                    style={{ backgroundColor: formData.cores.secundaria }}
                  ></div>
                  <div 
                    className="h-1 rounded-full w-1/2"
                    style={{ backgroundColor: formData.cores.acento }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-green-400">100%</div>
                  <div className="text-xs text-blue-100/60">Personalizado</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">Pro</div>
                  <div className="text-xs text-blue-100/60">Visual Único</div>
                </div>
              </div>
              
              <button
                onClick={() => setPreviewTemplate(!previewTemplate)}
                className="w-full py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm font-medium rounded-xl hover:scale-105 transition-all duration-300 border border-blue-400/30"
              >
                {previewTemplate ? 'Ocultar Preview' : 'Ver Preview Completo'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          {/* Upload de Logo */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Image className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Logo da Empresa</h3>
                <p className="text-blue-100/70 text-sm">Adicione sua marca ao sistema</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400/50 transition-all duration-300 hover:bg-white/5"
                >
                  {formData.logo.preview ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.logo.preview} 
                        alt="Logo preview" 
                        className="max-h-32 mx-auto object-contain rounded-lg"
                      />
                      <button className="text-blue-300 text-sm font-medium flex items-center space-x-2 mx-auto">
                        <Upload className="w-4 h-4" />
                        <span>Trocar Logo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Clique para fazer upload</h4>
                        <p className="text-blue-100/60 text-sm">PNG, JPG até 2MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Configurações do Logo */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-blue-100 mb-2 block">Posição do logo:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['esquerda', 'centro', 'direita'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setFormData(prev => ({ ...prev, logo: { ...prev.logo, posicao: pos }}))}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          formData.logo.posicao === pos
                            ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                            : 'bg-white/5 text-blue-100/70 hover:bg-white/10'
                        }`}
                      >
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 rounded-xl border border-green-400/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-bold text-white">Dicas para o logo:</span>
                  </div>
                  <ul className="text-xs text-green-300 space-y-1">
                    <li>• Use fundo transparente (PNG)</li>
                    <li>• Resolução mínima: 300x300px</li>
                    <li>• Formato horizontal funciona melhor</li>
                    <li>• Evite textos muito pequenos</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Paleta de Cores */}
          <motion.div
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Paleta de Cores</h3>
                <p className="text-blue-100/70 text-sm">Escolha as cores da sua marca</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PALETAS_CORES.map((paleta, index) => (
                <motion.div
                  key={paleta.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    formData.cores.paleta === paleta.id
                      ? 'border-white/30 bg-white/10 scale-105'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  onClick={() => handlePaletaChange(paleta)}
                >
                  <div className={`h-16 rounded-xl mb-4 ${paleta.preview}`}></div>
                  <h4 className="font-bold text-white mb-2">{paleta.nome}</h4>
                  <p className="text-sm text-blue-100/70 mb-4">{paleta.descricao}</p>
                  
                  <div className="flex space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: paleta.primaria }}
                      title="Cor primária"
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: paleta.secundaria }}
                      title="Cor secundária"
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: paleta.acento }}
                      title="Cor de acento"
                    ></div>
                  </div>
                  
                  {formData.cores.paleta === paleta.id && (
                    <div className="mt-4 flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-green-300 font-medium">Selecionada</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Templates de Documento */}
          <motion.div
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Templates de Documento</h3>
                <p className="text-blue-100/70 text-sm">Estilo dos seus relatórios e contratos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {ESTILOS_TEMPLATE.map((estilo, index) => (
                <motion.div
                  key={estilo.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-center ${
                    formData.templates.estilo === estilo.id
                      ? 'border-yellow-400/50 bg-yellow-500/20'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  onClick={() => setFormData(prev => ({ ...prev, templates: { ...prev.templates, estilo: estilo.id as any }}))}
                >
                  <div className="text-4xl mb-4">{estilo.preview}</div>
                  <h4 className="font-bold text-white mb-2">{estilo.nome}</h4>
                  <p className="text-sm text-blue-100/70">{estilo.descricao}</p>
                  
                  {formData.templates.estilo === estilo.id && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-yellow-300 font-medium">Selecionado</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Campos de texto personalizados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-blue-100 mb-2 block">Texto do cabeçalho:</label>
                <input
                  type="text"
                  value={formData.templates.cabecalho}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    templates: { ...prev.templates, cabecalho: e.target.value }
                  }))}
                  placeholder="Nome da empresa ou slogan"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-100/50 focus:border-yellow-400/50 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="text-sm text-blue-100 mb-2 block">Texto do rodapé:</label>
                <input
                  type="text"
                  value={formData.templates.rodape}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    templates: { ...prev.templates, rodape: e.target.value }
                  }))}
                  placeholder="Informações de contato ou copyright"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-100/50 focus:border-yellow-400/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </motion.div>

          {/* Assinatura Digital */}
          <motion.div
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Assinatura Digital</h3>
                <p className="text-blue-100/70 text-sm">Para contratos e documentos oficiais</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Assinatura */}
              <div>
                <input
                  ref={assinaturaInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAssinaturaUpload}
                  className="hidden"
                />
                
                <div 
                  onClick={() => assinaturaInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-400/50 transition-all duration-300 hover:bg-white/5"
                >
                  {formData.assinaturaDigital.preview ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.assinaturaDigital.preview} 
                        alt="Assinatura preview" 
                        className="max-h-20 mx-auto object-contain"
                      />
                      <button className="text-purple-300 text-sm font-medium flex items-center space-x-2 mx-auto">
                        <Upload className="w-4 h-4" />
                        <span>Trocar Assinatura</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                        <PenTool className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Upload da assinatura</h4>
                        <p className="text-blue-100/60 text-sm">PNG com fundo transparente, até 1MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dados da Assinatura */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-blue-100 mb-2 block">Nome completo:</label>
                  <input
                    type="text"
                    value={formData.assinaturaDigital.nome}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      assinaturaDigital: { ...prev.assinaturaDigital, nome: e.target.value }
                    }))}
                    placeholder="Nome do responsável técnico"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-100/50 focus:border-purple-400/50 focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-blue-100 mb-2 block">Cargo/Função:</label>
                  <input
                    type="text"
                    value={formData.assinaturaDigital.cargo}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      assinaturaDigital: { ...prev.assinaturaDigital, cargo: e.target.value }
                    }))}
                    placeholder="Arquiteto, Engenheiro Civil, etc."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-100/50 focus:border-purple-400/50 focus:outline-none transition-colors"
                  />
                </div>

                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-bold text-white">Uso da assinatura:</span>
                  </div>
                  <ul className="text-xs text-purple-300 space-y-1">
                    <li>• Contratos de prestação de serviço</li>
                    <li>• Relatórios técnicos e laudos</li>
                    <li>• Propostas comerciais</li>
                    <li>• Documentos para órgãos públicos</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Botão Continuar */}
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button
              onClick={handleContinuar}
              disabled={!isFormValid()}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>Finalizar Personalização</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}