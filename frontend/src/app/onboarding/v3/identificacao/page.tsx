'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Building2, TrendingUp, Users, Target, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react'

// Interfaces baseadas na nossa evolução documentada
interface IdentificacaoEscritorio {
  porte: 'Solo' | 'Pequeno' | 'Médio' | 'Grande'
  faturamentoMensal: number
  anosExperiencia: number
  principaisDesafios: string[]
  objetivoPrincipal: 'Organização' | 'Crescimento' | 'Otimização'
  numeroFuncionarios: number
  principaisClientes: string
  localizacao: {
    cidade: string
    estado: string
  }
}

const DESAFIOS_OPCOES = [
  'Controle de prazos dos projetos',
  'Precificação adequada dos serviços',
  'Gestão financeira do escritório',
  'Organização de documentos',
  'Comunicação com clientes',
  'Controle de horas da equipe',
  'Análise de rentabilidade',
  'Crescimento sustentável',
  'Captação de novos clientes',
  'Padronização de processos'
]

export default function IdentificacaoEscritorio() {
  const router = useRouter()
  const [formData, setFormData] = useState<IdentificacaoEscritorio>({
    porte: 'Solo',
    faturamentoMensal: 0,
    anosExperiencia: 0,
    principaisDesafios: [],
    objetivoPrincipal: 'Organização',
    numeroFuncionarios: 1,
    principaisClientes: '',
    localizacao: {
      cidade: '',
      estado: ''
    }
  })

  const [sugestoesIA, setSugestoesIA] = useState<string[]>([])

  // Inteligência para sugestões baseadas no perfil
  const gerarSugestoesIA = () => {
    const sugestoes: string[] = []
    
    if (formData.porte === 'Solo' && formData.anosExperiencia < 5) {
      sugestoes.push('💡 Foque primeiro em organização e controle básico')
      sugestoes.push('📊 Precificação adequada será seu maior ROI inicial')
    }
    
    if (formData.faturamentoMensal > 100000 && formData.porte === 'Pequeno') {
      sugestoes.push('🚀 Seu faturamento indica potencial para escalar rapidamente')
      sugestoes.push('👥 Considere estruturar processos para crescimento de equipe')
    }
    
    if (formData.principaisDesafios.includes('Análise de rentabilidade')) {
      sugestoes.push('📈 Nosso módulo "Onde Vai Seu Dinheiro" será transformador')
    }
    
    if (formData.principaisDesafios.includes('Comunicação com clientes')) {
      sugestoes.push('🌐 Portal do Cliente será seu diferencial competitivo')
    }

    setSugestoesIA(sugestoes)
  }

  const handleDesafioChange = (desafio: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        principaisDesafios: [...prev.principaisDesafios, desafio]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        principaisDesafios: prev.principaisDesafios.filter(d => d !== desafio)
      }))
    }
  }

  const handleContinuar = () => {
    // Salvar dados no contexto/localStorage
    const dadosExistentes = localStorage.getItem('arcflow-onboarding-v3')
    const dados = dadosExistentes ? JSON.parse(dadosExistentes) : {}
    
    localStorage.setItem('arcflow-onboarding-v3', JSON.stringify({
      ...dados,
      identificacao: formData
    }))
    
    // Gerar sugestões para próxima etapa
    gerarSugestoesIA()
    
    // Navegar para próxima etapa
    router.push('/onboarding/v3/perfil-tecnico')
  }

  const isFormValid = () => {
    return formData.faturamentoMensal > 0 && 
           formData.anosExperiencia > 0 && 
           formData.principaisDesafios.length > 0 &&
           formData.localizacao.cidade.length > 0 &&
           formData.localizacao.estado.length > 0
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header com Progress */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Configuração Personalizada do ArcFlow
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-3xl mx-auto">
            Vamos conhecer seu escritório em detalhes para personalizar cada funcionalidade, workflow e automação especificamente para suas necessidades.
          </p>
          
          {/* Progress Bar Elegante */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100/60 text-sm">Etapa 1 de 8</span>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-sm text-blue-100">12.5% Concluído</span>
                </div>
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: '12.5%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
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
              <h3 className="text-lg font-bold text-white">IA do ArcFlow</h3>
            </div>
            
            {sugestoesIA.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-purple-300 font-medium">
                  Insights baseados no seu perfil:
                </p>
                {sugestoesIA.map((sugestao, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl border border-purple-400/20">
                    <p className="text-sm text-blue-100/80">{sugestao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200/80">
                Preencha os dados para receber insights personalizados sobre como o ArcFlow pode transformar seu escritório.
              </p>
            )}
          </motion.div>

          {/* Preview da Configuração */}
          {formData.porte && formData.faturamentoMensal > 0 ? (
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Preview da Configuração</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/60">Porte:</span>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-blue-100">
                    {formData.porte}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/60">Foco:</span>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-blue-100">
                    {formData.objetivoPrincipal}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/60">Desafios:</span>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-blue-100">
                    {formData.principaisDesafios.length} selecionados
                  </div>
                </div>
                
                {formData.faturamentoMensal > 0 && (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20 mt-4">
                    <p className="text-sm text-green-300 font-medium">
                      🎯 Plano sugerido: {
                        formData.faturamentoMensal < 80000 ? 'Solo (R$ 247/mês)' :
                        formData.faturamentoMensal < 300000 ? 'Profissional (R$ 497/mês)' :
                        'Empresarial (R$ 997/mês)'
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 rounded-3xl p-6 border border-white/10 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Preview da Configuração</h3>
                <p className="text-sm text-gray-300/70">
                  Preencha os dados básicos para ver o preview
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conteúdo Principal - Largura Total */}
        <div className="space-y-6">
            {/* Dados Básicos */}
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Perfil do Escritório</h3>
                  <p className="text-blue-100/70 text-sm">Dados básicos para configuração inicial</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Porte e Funcionários */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">
                      Porte do Escritório
                    </label>
                    <select 
                      value={formData.porte} 
                      onChange={(e) => setFormData(prev => ({ ...prev, porte: e.target.value as any }))}
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    >
                      <option value="Solo" className="bg-slate-800">Solo (1 pessoa)</option>
                      <option value="Pequeno" className="bg-slate-800">Pequeno (2-5 pessoas)</option>
                      <option value="Médio" className="bg-slate-800">Médio (6-20 pessoas)</option>
                      <option value="Grande" className="bg-slate-800">Grande (20+ pessoas)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">
                      Número de Funcionários
                    </label>
                    <input
                      type="number"
                      value={formData.numeroFuncionarios}
                      onChange={(e) => setFormData(prev => ({ ...prev, numeroFuncionarios: parseInt(e.target.value) || 1 }))}
                      min="1"
                      max="200"
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-blue-100/50"
                    />
                  </div>
                </div>

                {/* Faturamento e Experiência */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">
                      Faturamento Mensal (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.faturamentoMensal}
                      onChange={(e) => setFormData(prev => ({ ...prev, faturamentoMensal: parseInt(e.target.value) || 0 }))}
                      placeholder="Ex: 50000"
                      min="0"
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-blue-100/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">
                      Anos de Experiência
                    </label>
                    <input
                      type="number"
                      value={formData.anosExperiencia}
                      onChange={(e) => setFormData(prev => ({ ...prev, anosExperiencia: parseInt(e.target.value) || 0 }))}
                      min="0"
                      max="50"
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-blue-100/50"
                    />
                  </div>
                </div>

                {/* Localização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">
                      Cidade
                    </label>
                    <input
                      value={formData.localizacao.cidade}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        localizacao: { ...prev.localizacao, cidade: e.target.value }
                      }))}
                      placeholder="Ex: São Paulo"
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-blue-100/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">
                      Estado
                    </label>
                    <input
                      value={formData.localizacao.estado}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        localizacao: { ...prev.localizacao, estado: e.target.value }
                      }))}
                      placeholder="Ex: SP"
                      maxLength={2}
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-blue-100/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Principais Desafios */}
            <motion.div
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Principais Desafios</h3>
                  <p className="text-blue-100/70 text-sm">Selecione até 5 desafios que enfrenta (isso configurará as automações)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DESAFIOS_OPCOES.map((desafio) => (
                  <div key={desafio} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      id={desafio}
                      checked={formData.principaisDesafios.includes(desafio)}
                      onChange={(e) => handleDesafioChange(desafio, e.target.checked)}
                      disabled={!formData.principaisDesafios.includes(desafio) && formData.principaisDesafios.length >= 5}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 disabled:opacity-50"
                    />
                    <label 
                      htmlFor={desafio} 
                      className="text-sm leading-relaxed cursor-pointer text-blue-100/80 hover:text-white transition-colors"
                    >
                      {desafio}
                    </label>
                  </div>
                ))}
              </div>
              
              {formData.principaisDesafios.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
                  <p className="text-sm text-blue-300 font-medium">
                    ✅ {formData.principaisDesafios.length} desafio(s) selecionado(s) - Sistema será configurado para resolver estes pontos
                  </p>
                </div>
              )}
            </motion.div>

            {/* Objetivo Principal */}
            <motion.div
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Objetivo Principal</h3>
                  <p className="text-blue-100/70 text-sm">Qual seu principal objetivo com o ArcFlow?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    valor: 'Organização', 
                    titulo: 'Organizar', 
                    desc: 'Estruturar processos e controles básicos',
                    icon: '📋',
                    color: 'from-blue-500/20 to-cyan-500/20'
                  },
                  { 
                    valor: 'Crescimento', 
                    titulo: 'Crescer', 
                    desc: 'Expandir equipe e faturamento',
                    icon: '🚀',
                    color: 'from-purple-500/20 to-pink-500/20'
                  },
                  { 
                    valor: 'Otimização', 
                    titulo: 'Otimizar', 
                    desc: 'Melhorar eficiência e rentabilidade',
                    icon: '⚡',
                    color: 'from-green-500/20 to-emerald-500/20'
                  }
                ].map((objetivo) => (
                  <div
                    key={objetivo.valor}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      formData.objetivoPrincipal === objetivo.valor
                        ? 'border-white/30 bg-gradient-to-br ' + objetivo.color + ' scale-105'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, objetivoPrincipal: objetivo.valor as any }))}
                  >
                    <div className="text-2xl mb-3">{objetivo.icon}</div>
                    <h4 className="font-bold text-white mb-2">{objetivo.titulo}</h4>
                    <p className="text-sm text-blue-100/70 leading-relaxed">{objetivo.desc}</p>
                    {formData.objetivoPrincipal === objetivo.valor && (
                      <div className="mt-3 flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-xs font-medium">Selecionado</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Botão Continuar */}
            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={handleContinuar}
                disabled={!isFormValid()}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span>Continuar para Perfil Técnico</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 