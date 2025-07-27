'use client'

import React, { useState, useEffect } from 'react'
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Settings, 
  Eye, 
  CheckCircle,
  Type,
  List,
  Calendar,
  Hash,
  ToggleLeft,
  FileText,
  Upload,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { BriefingCompleto, Secao, Pergunta } from '@/types/briefing'

interface PersonalizadorBriefingProps {
  briefing: BriefingCompleto
  onSalvar: (briefingPersonalizado: BriefingCompleto) => void
  onCancelar: () => void
  onVisualizarPreview: (briefing: BriefingCompleto) => void
}

type TipoPergunta = 'texto' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'file' | 'boolean' | 'escala'

interface NovaPergunta {
  pergunta: string
  tipo: TipoPergunta
  opcoes?: string[]
  obrigatoria: boolean
  descricao?: string
  observacoes?: string
  placeholder?: string
}

interface NovaSecao {
  nome: string
  descricao: string
  icon?: string
}

export default function PersonalizadorBriefing({
  briefing,
  onSalvar,
  onCancelar,
  onVisualizarPreview
}: PersonalizadorBriefingProps) {
  const { tema, temaId } = useTheme()
  const [briefingEditado, setBriefingEditado] = useState<BriefingCompleto>(briefing)
  const [secaoEditando, setSecaoEditando] = useState<number | null>(null)
  const [perguntaEditando, setPerguntaEditando] = useState<{ secaoId: number, perguntaId: number } | null>(null)
  const [mostrarFormNovaPergunta, setMostrarFormNovaPergunta] = useState<number | null>(null)
  const [mostrarFormNovaSecao, setMostrarFormNovaSecao] = useState(false)
  const [alteracoesSalvas, setAlteracoesSalvas] = useState(false)
  const [novaPergunta, setNovaPergunta] = useState<NovaPergunta>({
    pergunta: '',
    tipo: 'texto',
    obrigatoria: false,
    opcoes: []
  })
  const [novaSecao, setNovaSecao] = useState<NovaSecao>({
    nome: '',
    descricao: '',
    icon: '📋'
  })

  // Auto-save das alterações
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`briefing-personalizado-${briefing.id}`, JSON.stringify(briefingEditado))
      setAlteracoesSalvas(true)
      setTimeout(() => setAlteracoesSalvas(false), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [briefingEditado, briefing.id])

  // Tipos de pergunta disponíveis
  const tiposPergunta = [
    { value: 'texto', label: 'Texto Curto', icon: Type },
    { value: 'textarea', label: 'Texto Longo', icon: FileText },
    { value: 'select', label: 'Seleção Única', icon: List },
    { value: 'radio', label: 'Múltipla Escolha', icon: List },
    { value: 'checkbox', label: 'Seleção Múltipla', icon: List },
    { value: 'number', label: 'Número', icon: Hash },
    { value: 'date', label: 'Data', icon: Calendar },
    { value: 'boolean', label: 'Sim/Não', icon: ToggleLeft },
    { value: 'escala', label: 'Escala (1-10)', icon: Star },
    { value: 'file', label: 'Upload Arquivo', icon: Upload }
  ]

  // Mover seção para cima
  const moverSecaoParaCima = (index: number) => {
    if (index === 0) return
    const secoes = [...briefingEditado.secoes]
    const temp = secoes[index]
    secoes[index] = secoes[index - 1]
    secoes[index - 1] = temp
    setBriefingEditado({ ...briefingEditado, secoes })
  }

  // Mover seção para baixo
  const moverSecaoParaBaixo = (index: number) => {
    if (index === briefingEditado.secoes.length - 1) return
    const secoes = [...briefingEditado.secoes]
    const temp = secoes[index]
    secoes[index] = secoes[index + 1]
    secoes[index + 1] = temp
    setBriefingEditado({ ...briefingEditado, secoes })
  }

  // Mover pergunta para cima
  const moverPerguntaParaCima = (secaoIndex: number, perguntaIndex: number) => {
    if (perguntaIndex === 0) return
    const secoes = [...briefingEditado.secoes]
    const perguntas = [...secoes[secaoIndex].perguntas]
    const temp = perguntas[perguntaIndex]
    perguntas[perguntaIndex] = perguntas[perguntaIndex - 1]
    perguntas[perguntaIndex - 1] = temp
    secoes[secaoIndex] = { ...secoes[secaoIndex], perguntas }
    setBriefingEditado({ ...briefingEditado, secoes })
  }

  // Mover pergunta para baixo
  const moverPerguntaParaBaixo = (secaoIndex: number, perguntaIndex: number) => {
    const secoes = [...briefingEditado.secoes]
    if (perguntaIndex === secoes[secaoIndex].perguntas.length - 1) return
    const perguntas = [...secoes[secaoIndex].perguntas]
    const temp = perguntas[perguntaIndex]
    perguntas[perguntaIndex] = perguntas[perguntaIndex + 1]
    perguntas[perguntaIndex + 1] = temp
    secoes[secaoIndex] = { ...secoes[secaoIndex], perguntas }
    setBriefingEditado({ ...briefingEditado, secoes })
  }

  // Excluir seção
  const excluirSecao = (secaoIndex: number) => {
    if (confirm('Tem certeza que deseja excluir esta seção? Esta ação não pode ser desfeita.')) {
      const secoes = briefingEditado.secoes.filter((_, index) => index !== secaoIndex)
      setBriefingEditado({ ...briefingEditado, secoes })
    }
  }

  // Excluir pergunta
  const excluirPergunta = (secaoIndex: number, perguntaIndex: number) => {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      const secoes = [...briefingEditado.secoes]
      secoes[secaoIndex].perguntas = secoes[secaoIndex].perguntas.filter((_, index) => index !== perguntaIndex)
      setBriefingEditado({ ...briefingEditado, secoes })
    }
  }

  // Adicionar nova pergunta
  const adicionarPergunta = (secaoIndex: number) => {
    if (!novaPergunta.pergunta.trim()) return

    const secoes = [...briefingEditado.secoes]
    const novoId = Math.max(0, ...secoes[secaoIndex].perguntas.map(p => typeof p.id === 'number' ? p.id : 0)) + 1

    const pergunta: Pergunta = {
      id: novoId,
      tipo: novaPergunta.tipo as any,
      pergunta: novaPergunta.pergunta,
      obrigatoria: novaPergunta.obrigatoria,
      ...(novaPergunta.opcoes && novaPergunta.opcoes.length > 0 && { opcoes: novaPergunta.opcoes }),
      ...(novaPergunta.descricao && { descricao: novaPergunta.descricao }),
      ...(novaPergunta.observacoes && { observacoes: novaPergunta.observacoes }),
      ...(novaPergunta.placeholder && { placeholder: novaPergunta.placeholder })
    }

    secoes[secaoIndex].perguntas.push(pergunta)
    setBriefingEditado({ ...briefingEditado, secoes })

    // Reset form
    setNovaPergunta({
      pergunta: '',
      tipo: 'texto',
      obrigatoria: false,
      opcoes: []
    })
    setMostrarFormNovaPergunta(null)
  }

  // Adicionar nova seção
  const adicionarSecao = () => {
    if (!novaSecao.nome.trim()) return

    const novaSecaoObj: Secao = {
      id: `secao-${Date.now()}`,
      nome: novaSecao.nome,
      descricao: novaSecao.descricao,
      icon: novaSecao.icon,
      obrigatoria: false,
      perguntas: []
    }

    setBriefingEditado({
      ...briefingEditado,
      secoes: [...briefingEditado.secoes, novaSecaoObj]
    })

    // Reset form
    setNovaSecao({
      nome: '',
      descricao: '',
      icon: '📋'
    })
    setMostrarFormNovaSecao(false)
  }

  // Editar seção inline
  const salvarEdicaoSecao = (secaoIndex: number, nome: string, descricao: string) => {
    const secoes = [...briefingEditado.secoes]
    secoes[secaoIndex] = {
      ...secoes[secaoIndex],
      nome,
      descricao
    }
    setBriefingEditado({ ...briefingEditado, secoes })
    setSecaoEditando(null)
  }

  // Editar pergunta inline
  const salvarEdicaoPergunta = (secaoIndex: number, perguntaIndex: number, dadosAtualizados: Partial<Pergunta>) => {
    const secoes = [...briefingEditado.secoes]
    secoes[secaoIndex].perguntas[perguntaIndex] = {
      ...secoes[secaoIndex].perguntas[perguntaIndex],
      ...dadosAtualizados
    }
    setBriefingEditado({ ...briefingEditado, secoes })
    setPerguntaEditando(null)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className={`${tema.card} rounded-xl p-6 mb-6 ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${tema.text} mb-2`}>
                🎨 Personalizar Briefing
              </h1>
              <p className={`${tema.textSecondary} text-sm`}>
                {briefingEditado.nome} • {briefingEditado.secoes.length} seções • {briefingEditado.secoes.reduce((acc, s) => acc + s.perguntas.length, 0)} perguntas
              </p>
              {alteracoesSalvas && (
                <div className="flex items-center mt-2 text-green-600 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Alterações salvas automaticamente
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onVisualizarPreview(briefingEditado)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => onSalvar(briefingEditado)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={onCancelar}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200 hover:border-gray-300' : 'border border-gray-600 hover:border-gray-500'} transition-all`}
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Aviso de Funcionalidade */}
        <div className={`${tema.card} rounded-xl p-6 mb-6 ${temaId === 'elegante' ? 'border border-blue-200 bg-blue-50' : 'border border-blue-600 bg-blue-900/20'}`}>
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className={`font-semibold ${tema.text}`}>Sistema de Personalização Ativo</h3>
              <p className={`text-sm ${tema.textSecondary} mt-1`}>
                Você pode editar, reordenar, adicionar ou excluir qualquer pergunta ou seção. As alterações são salvas automaticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Seções */}
        <div className="space-y-6">
          {briefingEditado.secoes.map((secao, secaoIndex) => (
            <div
              key={secao.id}
              className={`${tema.card} rounded-xl ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'}`}
            >
              {/* Header da Seção */}
              <div className={`p-6 ${temaId === 'elegante' ? 'border-b border-gray-200' : 'border-b border-gray-600'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {secaoEditando === secaoIndex ? (
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          defaultValue={secao.nome}
                          className={`text-lg font-semibold ${tema.text} bg-transparent border-b-2 border-blue-500 focus:outline-none w-full`}
                          onBlur={(e) => salvarEdicaoSecao(secaoIndex, e.target.value, secao.descricao)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              salvarEdicaoSecao(secaoIndex, e.currentTarget.value, secao.descricao)
                            }
                          }}
                          autoFocus
                        />
                        <input
                          type="text"
                          defaultValue={secao.descricao}
                          className={`text-sm ${tema.textSecondary} bg-transparent border-b border-blue-400 focus:outline-none w-full`}
                          onBlur={(e) => salvarEdicaoSecao(secaoIndex, secao.nome, e.target.value)}
                          placeholder="Descrição da seção..."
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${tema.text}`}>
                          {secao.icon} {secao.nome}
                        </h3>
                        <p className={`text-sm ${tema.textSecondary} mt-1`}>
                          {secao.descricao}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${tema.textSecondary} px-2 py-1 rounded-full ${temaId === 'elegante' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                      {secao.perguntas.length} perguntas
                    </span>
                    
                    {/* Botões de Reordenar Seção */}
                    <button
                      onClick={() => moverSecaoParaCima(secaoIndex)}
                      disabled={secaoIndex === 0}
                      className={`p-1.5 rounded ${tema.card} ${tema.text} hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moverSecaoParaBaixo(secaoIndex)}
                      disabled={secaoIndex === briefingEditado.secoes.length - 1}
                      className={`p-1.5 rounded ${tema.card} ${tema.text} hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => setSecaoEditando(secaoEditando === secaoIndex ? null : secaoIndex)}
                      className={`p-2 rounded-lg ${tema.card} ${tema.text} hover:bg-gray-100 transition-all`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => excluirSecao(secaoIndex)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Perguntas */}
              <div className="p-6 space-y-4">
                {secao.perguntas.map((pergunta, perguntaIndex) => (
                  <div
                    key={pergunta.id}
                    className={`p-4 rounded-lg ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        {perguntaEditando?.secaoId === secaoIndex && perguntaEditando?.perguntaId === perguntaIndex ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              defaultValue={pergunta.pergunta}
                              className={`w-full text-sm font-medium ${tema.text} bg-transparent border-b border-blue-500 focus:outline-none pb-1`}
                              onBlur={(e) => salvarEdicaoPergunta(secaoIndex, perguntaIndex, { pergunta: e.target.value })}
                            />
                            <div className="flex items-center space-x-4">
                              <select
                                defaultValue={pergunta.tipo}
                                onChange={(e) => salvarEdicaoPergunta(secaoIndex, perguntaIndex, { tipo: e.target.value as any })}
                                className={`text-xs ${tema.text} bg-transparent ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} rounded px-2 py-1`}
                              >
                                {tiposPergunta.map(tipo => (
                                  <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                  </option>
                                ))}
                              </select>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  defaultChecked={pergunta.obrigatoria}
                                  onChange={(e) => salvarEdicaoPergunta(secaoIndex, perguntaIndex, { obrigatoria: e.target.checked })}
                                />
                                <span className={`text-xs ${tema.text}`}>Obrigatória</span>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`text-sm font-medium ${tema.text}`}>
                                {pergunta.pergunta}
                              </span>
                              {pergunta.obrigatoria && (
                                <span className="text-red-500 text-xs">*</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${tema.textSecondary} px-2 py-0.5 rounded-full ${temaId === 'elegante' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                                {tiposPergunta.find(t => t.value === pergunta.tipo)?.label || pergunta.tipo}
                              </span>
                              {pergunta.opcoes && pergunta.opcoes.length > 0 && (
                                <span className={`text-xs ${tema.textSecondary}`}>
                                  {pergunta.opcoes.length} opções
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        {/* Botões de Reordenar Pergunta */}
                        <button
                          onClick={() => moverPerguntaParaCima(secaoIndex, perguntaIndex)}
                          disabled={perguntaIndex === 0}
                          className={`p-1 rounded ${tema.card} ${tema.text} hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moverPerguntaParaBaixo(secaoIndex, perguntaIndex)}
                          disabled={perguntaIndex === secao.perguntas.length - 1}
                          className={`p-1 rounded ${tema.card} ${tema.text} hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => setPerguntaEditando(
                            perguntaEditando?.secaoId === secaoIndex && perguntaEditando?.perguntaId === perguntaIndex 
                              ? null 
                              : { secaoId: secaoIndex, perguntaId: perguntaIndex }
                          )}
                          className={`p-1.5 rounded ${tema.card} ${tema.text} hover:bg-gray-100 transition-all`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => excluirPergunta(secaoIndex, perguntaIndex)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Formulário para Nova Pergunta */}
                {mostrarFormNovaPergunta === secaoIndex ? (
                  <div className={`p-4 rounded-lg border-2 border-dashed ${temaId === 'elegante' ? 'border-gray-300' : 'border-gray-600'} space-y-4`}>
                    <input
                      type="text"
                      placeholder="Digite a pergunta..."
                      value={novaPergunta.pergunta}
                      onChange={(e) => setNovaPergunta({ ...novaPergunta, pergunta: e.target.value })}
                      className={`w-full p-3 rounded-lg ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={novaPergunta.tipo}
                        onChange={(e) => setNovaPergunta({ ...novaPergunta, tipo: e.target.value as TipoPergunta })}
                        className={`p-2 rounded ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'}`}
                      >
                        {tiposPergunta.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={novaPergunta.obrigatoria}
                          onChange={(e) => setNovaPergunta({ ...novaPergunta, obrigatoria: e.target.checked })}
                        />
                        <span className={`text-sm ${tema.text}`}>Obrigatória</span>
                      </label>
                    </div>

                    {(novaPergunta.tipo === 'select' || novaPergunta.tipo === 'radio' || novaPergunta.tipo === 'checkbox') && (
                      <div>
                        <label className={`block text-sm ${tema.text} mb-2`}>Opções (uma por linha):</label>
                        <textarea
                          placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                          value={novaPergunta.opcoes?.join('\n') || ''}
                          onChange={(e) => setNovaPergunta({ 
                            ...novaPergunta, 
                            opcoes: e.target.value.split('\n').filter(opt => opt.trim()) 
                          })}
                          className={`w-full p-2 rounded ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => adicionarPergunta(secaoIndex)}
                        disabled={!novaPergunta.pergunta.trim()}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Adicionar Pergunta
                      </button>
                      <button
                        onClick={() => setMostrarFormNovaPergunta(null)}
                        className={`px-4 py-2 rounded-lg ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} transition-all`}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setMostrarFormNovaPergunta(secaoIndex)}
                    className={`w-full p-3 rounded-lg border-2 border-dashed ${temaId === 'elegante' ? 'border-gray-300 hover:border-gray-400' : 'border-gray-600 hover:border-gray-500'} ${tema.text} hover:bg-gray-50 transition-all flex items-center justify-center space-x-2`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Pergunta</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botão para Adicionar Nova Seção */}
        <div className="mt-6">
          {mostrarFormNovaSecao ? (
            <div className={`${tema.card} rounded-xl p-6 ${temaId === 'elegante' ? 'border-2 border-dashed border-gray-300' : 'border-2 border-dashed border-gray-600'}`}>
              <h3 className={`text-lg font-semibold ${tema.text} mb-4`}>Nova Seção</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome da seção..."
                  value={novaSecao.nome}
                  onChange={(e) => setNovaSecao({ ...novaSecao, nome: e.target.value })}
                  className={`w-full p-3 rounded-lg ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  type="text"
                  placeholder="Descrição da seção..."
                  value={novaSecao.descricao}
                  onChange={(e) => setNovaSecao({ ...novaSecao, descricao: e.target.value })}
                  className={`w-full p-3 rounded-lg ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div className="flex items-center space-x-3">
                  <button
                    onClick={adicionarSecao}
                    disabled={!novaSecao.nome.trim()}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Criar Seção
                  </button>
                  <button
                    onClick={() => setMostrarFormNovaSecao(false)}
                    className={`px-6 py-2 rounded-lg ${tema.card} ${tema.text} ${temaId === 'elegante' ? 'border border-gray-200' : 'border border-gray-600'} transition-all`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setMostrarFormNovaSecao(true)}
              className={`w-full p-4 rounded-xl border-2 border-dashed ${temaId === 'elegante' ? 'border-gray-300 hover:border-gray-400' : 'border-gray-600 hover:border-gray-500'} ${tema.text} hover:bg-gray-50 transition-all flex items-center justify-center space-x-2`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Adicionar Nova Seção</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 