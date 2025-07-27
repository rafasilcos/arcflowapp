'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useClientes } from '@/contexts/ClientesContext'
import { Cliente, ConversaComercial, ProjetoAnterior } from '@/types/integracaoComercial'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Users, Home, Star, User as UserIcon, Tag, ArrowLeft, Save, Trash2, Check, AlertCircle, Building2, Palette, DollarSign, Clock, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import FooterSection from '@/components/ui/FooterSection'

export default function EditarClientePage() {
  const params = useParams<{ id: string }>()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const router = useRouter()
  const { tema, temaId } = useTheme()

  const { clientes, atualizar, remover } = useClientes()
  const clienteExistente = clientes.find(c => c.id === id)
  
  const [abaAtiva, setAbaAtiva] = useState('basicos')
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const [dropdownAberto, setDropdownAberto] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoPessoa: 'fisica',
    cpf: '',
    cnpj: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      pais: 'Brasil'
    },
    familia: {
      conjuge: '',
      filhos: [] as { nome: string; idade: number; necessidadesEspeciais?: string }[],
      pets: [] as { tipo: string; quantidade: number }[]
    },
    origem: {
      fonte: 'site' as 'site' | 'indicacao' | 'telefone' | 'evento',
      dataContato: '',
      responsavelComercial: '',
      conversasAnteriores: [] as ConversaComercial[]
    },
    preferencias: {
      estilosArquitetonicos: [] as string[],
      materiaisPreferidos: [] as string[],
      coresPreferidas: [] as string[],
      orcamentoMedioHistorico: 0,
      prazoTipicoPreferido: 0
    },
    status: 'ativo' as 'ativo' | 'inativo' | 'vip' | 'problema',
    profissao: '',
    dataNascimento: '',
    dataFundacao: '',
    observacoes: '',
    historicoProjetos: [] as ProjetoAnterior[],
  })

  useEffect(() => {
    if (clienteExistente && !form.nome) {
      setForm({
        nome: clienteExistente.nome || '',
        email: clienteExistente.email || '',
        telefone: clienteExistente.telefone || '',
        tipoPessoa: clienteExistente.cnpj ? 'juridica' : 'fisica',
        cpf: clienteExistente.cpf || '',
        cnpj: clienteExistente.cnpj || '',
        endereco: clienteExistente.endereco || {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
          pais: 'Brasil'
        },
        familia: {
          conjuge: clienteExistente.familia?.conjuge || '',
          filhos: clienteExistente.familia?.filhos || [],
          pets: clienteExistente.familia?.pets || []
        },
        origem: {
          fonte: clienteExistente.origem?.fonte || 'site',
          dataContato: clienteExistente.origem?.dataContato || '',
          responsavelComercial: clienteExistente.origem?.responsavelComercial || '',
          conversasAnteriores: clienteExistente.origem?.conversasAnteriores || []
        },
        preferencias: {
          estilosArquitetonicos: clienteExistente.preferencias?.estilosArquitetonicos || [],
          materiaisPreferidos: clienteExistente.preferencias?.materiaisPreferidos || [],
          coresPreferidas: clienteExistente.preferencias?.coresPreferidas || [],
          orcamentoMedioHistorico: clienteExistente.preferencias?.orcamentoMedioHistorico || 0,
          prazoTipicoPreferido: clienteExistente.preferencias?.prazoTipicoPreferido || 0
        },
        status: clienteExistente.status || 'ativo',
        profissao: clienteExistente.profissao || '',
        dataNascimento: clienteExistente.dataNascimento || '',
        dataFundacao: clienteExistente.dataFundacao || '',
        observacoes: clienteExistente.observacoes || '',
        historicoProjetos: Array.isArray(clienteExistente.historicoProjetos) ? clienteExistente.historicoProjetos.map((p: any) => ({
          projetoId: String(p.projetoId || p.id || ''),
          tipologia: String(p.tipologia || ''),
          ano: Number(p.ano) || new Date().getFullYear(),
          valor: Number(p.valor) || 0,
          satisfacao: Number(p.satisfacao) || 0,
          observacoes: String(p.observacoes || '')
        })) : [],
      });
    }
  }, [clienteExistente, form.nome])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-estilos')) {
        setDropdownAberto(false);
      }
    };

    if (dropdownAberto) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownAberto])

  if (!clienteExistente) {
    return <div className="p-6">Cliente não encontrado.</div>
  }

  const statusColors: Record<string, string> = {
    ativo: 'bg-green-100 text-green-700',
    inativo: 'bg-gray-100 text-gray-600',
    vip: 'bg-yellow-100 text-yellow-700',
    problema: 'bg-red-100 text-red-700',
  }

  function getInitials(nome: string) {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const DetalheCliente = () => (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center gap-4 pb-0">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700 border-2 border-primary-200">
          {getInitials(clienteExistente.nome)}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            {clienteExistente.nome}
            <Badge className={`capitalize ml-2 ${statusColors[clienteExistente.status] || 'bg-gray-100 text-gray-600'}`}>{clienteExistente.status}</Badge>
          </CardTitle>
          <div className="flex gap-2 mt-1 text-slate-500 text-sm">
            <Mail size={16} /> {clienteExistente.email}
            <Phone size={16} className="ml-4" /> {clienteExistente.telefone}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados básicos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><UserIcon size={16} /> <span className="font-medium">Tipo:</span> {clienteExistente.cnpj ? 'Jurídica' : 'Física'}</div>
            {clienteExistente.cpf && <div className="flex items-center gap-2 text-sm"><Tag size={16} /> <span className="font-medium">CPF:</span> {clienteExistente.cpf}</div>}
            {clienteExistente.cnpj && <div className="flex items-center gap-2 text-sm"><Tag size={16} /> <span className="font-medium">CNPJ:</span> {clienteExistente.cnpj}</div>}
            <div className="flex items-center gap-2 text-sm"><Star size={16} /> <span className="font-medium">Origem:</span> {clienteExistente.origem?.fonte} | {new Date(clienteExistente.origem?.dataContato || '').toLocaleDateString()} | Resp: {clienteExistente.origem?.responsavelComercial}</div>
          </div>
          {/* Endereço */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><Home size={16} /> <span className="font-medium">Endereço:</span> {clienteExistente.endereco.logradouro}, {clienteExistente.endereco.numero} {clienteExistente.endereco.complemento && `- ${clienteExistente.endereco.complemento}`}, {clienteExistente.endereco.bairro}, {clienteExistente.endereco.cidade}/{clienteExistente.endereco.uf} - {clienteExistente.endereco.cep}</div>
          </div>
          {/* Família */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><Users size={16} /> <span className="font-medium">Família:</span></div>
            {(clienteExistente.familia?.conjuge) && <div className="ml-6 text-sm">• Cônjuge: {clienteExistente.familia.conjuge}</div>}
            {(clienteExistente.familia?.filhos || []).length > 0 && <div className="ml-6 text-sm">• Filhos: {(clienteExistente.familia?.filhos || []).map(f => f.nome).join(', ')}</div>}
            {(clienteExistente.familia?.pets || []).length > 0 && <div className="ml-6 text-sm">• Pets: {(clienteExistente.familia?.pets || []).map(p => `${p.tipo} (${p.quantidade})`).join(', ')}</div>}
          </div>
          {/* Preferências */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><Star size={16} /> <span className="font-medium">Preferências:</span></div>
            <div className="ml-6 text-sm">• Estilos: {(clienteExistente.preferencias?.estilosArquitetonicos || []).join(', ')}</div>
            <div className="ml-6 text-sm">• Materiais: {(clienteExistente.preferencias?.materiaisPreferidos || []).join(', ')}</div>
            <div className="ml-6 text-sm">• Cores: {(clienteExistente.preferencias?.coresPreferidas || []).join(', ')}</div>
            <div className="ml-6 text-sm">• Orçamento médio: R$ {(clienteExistente.preferencias?.orcamentoMedioHistorico || 0).toLocaleString()}</div>
            <div className="ml-6 text-sm">• Prazo típico: {(clienteExistente.preferencias?.prazoTipicoPreferido || 0)} semanas</div>
          </div>
        </div>
        {/* Histórico de Projetos */}
        {clienteExistente.historicoProjetos && clienteExistente.historicoProjetos.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center gap-2 text-sm font-medium mb-2"><Star size={16} /> Histórico de Projetos:</div>
            <ul className="list-disc ml-8 text-sm text-slate-600">
              {clienteExistente.historicoProjetos.map((p, i) => (
                <li key={i}>{p.projetoId} - {p.tipologia} ({p.ano}) - R$ {(p.valor || 0).toLocaleString()} - Satisfação: {(p.satisfacao || '')}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Função para formatar data DD/MM/YYYY
    const formatarData = (valor: string) => {
      // Remove tudo que não é número
      const numeros = valor.replace(/\D/g, '')
      
      // Aplica a máscara DD/MM/YYYY
      if (numeros.length <= 2) {
        return numeros
      } else if (numeros.length <= 4) {
        return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
      } else {
        return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`
      }
    }
    
    if (name.startsWith('endereco.')) {
      setForm({ ...form, endereco: { ...form.endereco, [name.replace('endereco.', '')]: value } })
    } else if (name.startsWith('familia.')) {
      setForm({ ...form, familia: { ...form.familia, [name.replace('familia.', '')]: value } })
    } else if (name === 'dataNascimento' || name === 'dataFundacao') {
      // Aplicar formatação de data
      const dataFormatada = formatarData(value)
      setForm({ ...form, [name]: dataFormatada })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  const buscarCep = async () => {
    if (!form.endereco.cep) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${form.endereco.cep.replace(/\D/g, '')}/json/`)
      const data = await res.json()
      if (data.erro) {
        alert('CEP não encontrado')
        return
      }
      setForm(f => ({
        ...f,
        endereco: {
          ...f.endereco,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || '',
          pais: 'Brasil'
        }
      }))
    } catch {
      alert('Erro ao buscar CEP')
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      if (!form.nome || !form.email || !form.telefone) {
        setErro('Preencha nome, email e telefone')
        return
      }
      if (form.tipoPessoa === 'fisica' && !form.cpf) {
        setErro('CPF obrigatório para pessoa física')
        return
      }
      if (form.tipoPessoa === 'juridica' && !form.cnpj) {
        setErro('CNPJ obrigatório para pessoa jurídica')
        return
      }
      // Desmembrar o endereço em campos separados
      const endereco = form.endereco || {}
      const dados: Partial<Cliente> = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        tipoPessoa: form.tipoPessoa as 'fisica' | 'juridica',
        cpf: form.tipoPessoa === 'fisica' ? form.cpf : undefined,
        cnpj: form.tipoPessoa === 'juridica' ? form.cnpj : undefined,
        endereco_cep: endereco.cep || '',
        endereco_logradouro: endereco.logradouro || '',
        endereco_numero: endereco.numero || '',
        endereco_complemento: endereco.complemento || '',
        endereco_bairro: endereco.bairro || '',
        endereco_cidade: endereco.cidade || '',
        endereco_uf: endereco.uf || '',
        endereco_pais: endereco.pais || 'Brasil',
        observacoes: form.observacoes,
        status: form.status,
        profissao: form.profissao,
        dataNascimento: form.dataNascimento,
        dataFundacao: form.dataFundacao,
        familia: form.familia,
        origem: form.origem,
        preferencias: form.preferencias,
        historicoProjetos: form.historicoProjetos
      }
      atualizar(id, dados)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (error) {
      setErro('Erro ao salvar cliente. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const handleRemover = () => {
    if (confirm('Tem certeza de que deseja remover este cliente?')) {
      remover(id)
      router.push('/comercial/clientes')
    }
  }

  // Definir abas
  const abas = [
    { id: 'basicos', nome: 'Dados Básicos', icone: UserIcon },
    { id: 'endereco', nome: 'Endereço', icone: Home },
    { id: 'comercial', nome: 'Comercial', icone: Building2 },
    { id: 'familia', nome: 'Família', icone: Users },
    { id: 'preferencias', nome: 'Preferências', icone: Palette },
    { id: 'historico', nome: 'Histórico', icone: FileText },
    { id: 'status', nome: 'Status', icone: Check }
  ]

  return (
    <div className={`bg-gradient-to-br ${tema.bg} min-h-screen py-8 px-4`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        
        {/* Header Melhorado */}
        <div className={`${tema.card} rounded-3xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/comercial/clientes"
                className={`p-3 rounded-xl transition-all ${
                  temaId === 'elegante'
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold border-2 ${
                  clienteExistente?.status === 'vip'
                    ? temaId === 'elegante'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                    : temaId === 'elegante'
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                }`}>
                  {clienteExistente ? getInitials(clienteExistente.nome) : '??'}
                </div>
                
                <div>
                  <h1 className={`text-2xl font-bold ${tema.text}`}>
                    Editar Cliente
                  </h1>
                  <p className={`text-lg ${tema.textSecondary}`}>
                    {clienteExistente?.nome || 'Carregando...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status e Ações Rápidas */}
            <div className="flex items-center gap-4">
              {clienteExistente && (
                <Badge className={`capitalize px-3 py-1 text-sm font-semibold rounded-full border ${
                  clienteExistente.status === 'ativo' ? 'text-green-600 bg-green-50 border-green-200' :
                  clienteExistente.status === 'vip' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                  clienteExistente.status === 'problema' ? 'text-red-600 bg-red-50 border-red-200' :
                  'text-gray-600 bg-gray-50 border-gray-200'
                }`}>
                  {clienteExistente.status}
                </Badge>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={salvando}
                  variant="comercial"
                  leftIcon={salvando ? <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="w-4 h-4" />}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </Button>
                
                <Button
                  onClick={handleRemover}
                  variant="destructive"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="opacity-70 hover:opacity-100"
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>

          {/* Feedback Visual */}
          <AnimatePresence>
            {sucesso && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Cliente atualizado com sucesso!</span>
              </motion.div>
            )}
            
            {erro && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{erro}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navegação por Abas */}
        <div className={`${tema.card} rounded-3xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } overflow-hidden mb-8`}>
          
          {/* Tabs Header */}
          <div className={`flex overflow-x-auto ${
            temaId === 'elegante' ? 'bg-gray-50' : 'bg-white/5'
          }`}>
            {abas.map((aba) => {
              const Icone = aba.icone
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    abaAtiva === aba.id
                      ? temaId === 'elegante'
                        ? 'border-blue-500 text-blue-600 bg-white'
                        : 'border-blue-400 text-blue-300 bg-white/10'
                      : temaId === 'elegante'
                        ? 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icone className="w-4 h-4" />
                  {aba.nome}
                </button>
              )
            })}
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={abaAtiva}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {abaAtiva === 'basicos' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            Nome Completo
                          </Label>
                          <Input
                            name="nome"
                            value={form.nome || ''}
                            onChange={handleChange}
                            required
                            className="h-12"
                            placeholder="Digite o nome completo"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </Label>
                          <Input
                            name="email"
                            type="email"
                            value={form.email || ''}
                            onChange={handleChange}
                            required
                            className="h-12"
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telefone
                          </Label>
                          <Input
                            name="telefone"
                            value={form.telefone || ''}
                            onChange={handleChange}
                            required
                            className="h-12"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      {/* Seção Documentos */}
                      <div className="pt-6 border-t border-current/10">
                        <h3 className={`text-lg font-semibold ${tema.text} mb-4 flex items-center gap-2`}>
                          <Tag className="w-5 h-5" />
                          Documentos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label>Tipo de Pessoa</Label>
                            <Select
                              name="tipoPessoa"
                              value={form.tipoPessoa || ''}
                              onChange={e => handleSelectChange('tipoPessoa', e.target.value)}
                              required
                              className="h-12"
                            >
                              <option value="fisica">Pessoa Física</option>
                              <option value="juridica">Pessoa Jurídica</option>
                            </Select>
                          </div>
                          
                          {form.tipoPessoa === 'fisica' && (
                            <div className="space-y-2">
                              <Label>CPF</Label>
                              <Input
                                name="cpf"
                                value={form.cpf || ''}
                                onChange={handleChange}
                                required
                                className="h-12"
                                placeholder="000.000.000-00"
                              />
                            </div>
                          )}
                          
                          {form.tipoPessoa === 'juridica' && (
                            <div className="space-y-2">
                              <Label>CNPJ</Label>
                              <Input
                                name="cnpj"
                                value={form.cnpj || ''}
                                onChange={handleChange}
                                required
                                className="h-12"
                                placeholder="00.000.000/0000-00"
                              />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label>Profissão</Label>
                            <Input
                              name="profissao"
                              value={form.profissao || ''}
                              onChange={handleChange}
                              className="h-12"
                              placeholder="Ex: Engenheiro Civil, Empresário..."
                            />
                          </div>
                          
                          {form.tipoPessoa === 'fisica' && (
                            <div className="space-y-2">
                              <Label>Data de Nascimento</Label>
                              <Input
                                name="dataNascimento"
                                type="text"
                                value={form.dataNascimento || ''}
                                onChange={handleChange}
                                className="h-12"
                                placeholder="dd/mm/aaaa"
                                maxLength={10}
                              />
                            </div>
                          )}
                          
                          {form.tipoPessoa === 'juridica' && (
                            <div className="space-y-2">
                              <Label>Data de Fundação</Label>
                              <Input
                                name="dataFundacao"
                                type="text"
                                value={form.dataFundacao || ''}
                                onChange={handleChange}
                                className="h-12"
                                placeholder="dd/mm/aaaa"
                                maxLength={10}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'endereco' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
                        <Home className="w-6 h-6" />
                        Endereço Completo
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <Label>CEP</Label>
                          <div className="flex gap-2">
                            <Input
                              name="endereco.cep"
                              value={form.endereco.cep || ''}
                              onChange={handleChange}
                              placeholder="00000-000"
                              className="h-12"
                            />
                            <Button type="button" onClick={buscarCep} className="h-12 px-4">
                              Buscar
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label>Logradouro</Label>
                          <Input
                            name="endereco.logradouro"
                            value={form.endereco.logradouro || ''}
                            onChange={handleChange}
                            placeholder="Rua, Avenida, etc."
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Número</Label>
                          <Input
                            name="endereco.numero"
                            value={form.endereco.numero || ''}
                            onChange={handleChange}
                            placeholder="123"
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Complemento</Label>
                          <Input
                            name="endereco.complemento"
                            value={form.endereco.complemento || ''}
                            onChange={handleChange}
                            placeholder="Apto, Bloco, etc."
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Bairro</Label>
                          <Input
                            name="endereco.bairro"
                            value={form.endereco.bairro || ''}
                            onChange={handleChange}
                            placeholder="Nome do bairro"
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Cidade</Label>
                          <Input
                            name="endereco.cidade"
                            value={form.endereco.cidade || ''}
                            onChange={handleChange}
                            placeholder="Nome da cidade"
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>UF</Label>
                          <Input
                            name="endereco.uf"
                            value={form.endereco.uf || ''}
                            onChange={handleChange}
                            placeholder="SP"
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'comercial' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
                        <Building2 className="w-6 h-6" />
                        Informações Comerciais
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Origem do Lead</Label>
                          <Select
                            name="origem.fonte"
                            value={form.origem.fonte || ''}
                            onChange={e => handleSelectChange('origem.fonte', e.target.value)}
                            required
                            className="h-12"
                          >
                            <option value="site">🌐 Site</option>
                            <option value="indicacao">👥 Indicação</option>
                            <option value="telefone">📞 Telefone</option>
                            <option value="evento">🎪 Evento</option>
                            <option value="redes-sociais">📱 Redes Sociais</option>
                            <option value="google">🔍 Google/SEO</option>
                            <option value="outros">📋 Outros</option>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Data de Contato</Label>
                          <Input
                            name="origem.dataContato"
                            type="datetime-local"
                            value={form.origem.dataContato || ''}
                            onChange={handleChange}
                            required
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Responsável Comercial</Label>
                          <Input
                            name="origem.responsavelComercial"
                            value={form.origem.responsavelComercial || ''}
                            onChange={handleChange}
                            required
                            placeholder="Nome do responsável"
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label>Conversas Anteriores</Label>
                          <textarea 
                            name="origem.conversasAnteriores"
                            value={(form.origem.conversasAnteriores || []).map(c => `${c.data} - ${c.canal} - ${c.responsavel} - ${c.resumo}`).join('\n')}
                                                         onChange={e => setForm(f => ({
                               ...f,
                               origem: {
                                 ...f.origem,
                                 conversasAnteriores: e.target.value.split('\n').map(linha => {
                                   const partes = linha.split(' - ')
                                   const canal = partes[1] || 'email'
                                   return {
                                     data: partes[0] || '',
                                     canal: ['email', 'telefone', 'whatsapp', 'site', 'outro'].includes(canal) ? canal as 'email' | 'telefone' | 'whatsapp' | 'site' | 'outro' : 'email',
                                     responsavel: partes[2] || '',
                                     resumo: partes[3] || ''
                                   }
                                 })
                               }
                             }))}
                            rows={4}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                              temaId === 'elegante' 
                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white' 
                                : 'bg-white/10 border-white/10 text-white placeholder-white/60'
                            }`} 
                            placeholder="Data - Canal - Responsável - Resumo da conversa" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'familia' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
                        <Users className="w-6 h-6" />
                        Informações Familiares
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Nome do Cônjuge</Label>
                          <Input
                            name="familia.conjuge"
                            value={form.familia.conjuge || ''}
                            onChange={handleChange}
                            placeholder="Nome do cônjuge"
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Informações dos Filhos</Label>
                          <textarea 
                            name="familia.filhos"
                            value={(form.familia.filhos || []).map(f => `${f.nome} (${f.idade || 0} anos)`).join('\n')}
                            onChange={e => setForm(f => ({
                              ...f,
                              familia: {
                                ...f.familia,
                                filhos: e.target.value.split('\n').filter(linha => linha.trim()).map(linha => {
                                  const match = linha.match(/^(.+?)\s*\((\d+)\s*anos?\)/)
                                  return {
                                    nome: match ? match[1].trim() : linha.trim(),
                                    idade: match ? Number(match[2]) : 0,
                                    necessidadesEspeciais: ''
                                  }
                                })
                              }
                            }))}
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                              temaId === 'elegante' 
                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white' 
                                : 'bg-white/10 border-white/10 text-white placeholder-white/60'
                            }`} 
                            placeholder="Ex: João (10 anos)&#10;Maria (8 anos)" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Informações dos Pets</Label>
                          <textarea 
                            name="familia.pets"
                            value={(form.familia.pets || []).map(p => `${p.tipo}: ${p.quantidade}`).join('\n')}
                            onChange={e => setForm(f => ({
                              ...f,
                              familia: {
                                ...f.familia,
                                pets: e.target.value.split('\n').filter(linha => linha.trim()).map(linha => {
                                  const partes = linha.split(':')
                                  return {
                                    tipo: partes[0]?.trim() || '',
                                    quantidade: Number(partes[1]?.trim()) || 1
                                  }
                                })
                              }
                            }))}
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                              temaId === 'elegante' 
                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white' 
                                : 'bg-white/10 border-white/10 text-white placeholder-white/60'
                            }`} 
                            placeholder="Ex: Cachorro: 2&#10;Gato: 1" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'preferencias' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
                        <Palette className="w-6 h-6" />
                        Preferências de Projeto
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Estilos Arquitetônicos Preferidos
                          </Label>
                          <div className="relative dropdown-estilos">
                            <div 
                              className={`w-full px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                                temaId === 'elegante' 
                                  ? 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-white' 
                                  : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
                              }`}
                              onClick={() => setDropdownAberto(!dropdownAberto)}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`${(form.preferencias.estilosArquitetonicos || []).length === 0 ? 'opacity-60' : ''}`}>
                                  {(form.preferencias.estilosArquitetonicos || []).length === 0 
                                    ? 'Selecione os estilos preferidos...' 
                                    : `${(form.preferencias.estilosArquitetonicos || []).length} estilo(s) selecionado(s)`
                                  }
                                </span>
                                <svg className={`w-4 h-4 transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            
                            {dropdownAberto && (
                              <div className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg ${
                                temaId === 'elegante' 
                                  ? 'bg-white border-gray-200' 
                                  : 'bg-gray-800 border-gray-600'
                              }`}>
                                <div className="p-2 max-h-64 overflow-y-auto">
                                  {[
                                    { value: 'contemporaneo', label: '🏢 Contemporâneo' },
                                    { value: 'moderno', label: '✨ Moderno' },
                                    { value: 'classico', label: '🏛️ Clássico' },
                                    { value: 'minimalista', label: '⚪ Minimalista' },
                                    { value: 'industrial', label: '🏭 Industrial' },
                                    { value: 'rustico', label: '🌲 Rústico' },
                                    { value: 'colonial', label: '🏘️ Colonial' },
                                    { value: 'neoclassico', label: '🏛️ Neoclássico' },
                                    { value: 'art-deco', label: '🎨 Art Déco' },
                                    { value: 'sustentavel', label: '🌱 Sustentável' },
                                    { value: 'high-tech', label: '🤖 High-Tech' },
                                    { value: 'mediterraneo', label: '🌊 Mediterrâneo' }
                                  ].map(estilo => (
                                    <label key={estilo.value} className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                                      (form.preferencias.estilosArquitetonicos || []).includes(estilo.value)
                                        ? temaId === 'elegante'
                                          ? 'bg-blue-50 text-blue-700'
                                          : 'bg-blue-500/20 text-blue-300'
                                        : temaId === 'elegante'
                                          ? 'hover:bg-gray-50'
                                          : 'hover:bg-gray-700'
                                    }`}>
                                      <input 
                                        type="checkbox"
                                        checked={(form.preferencias.estilosArquitetonicos || []).includes(estilo.value)}
                                        onChange={(e) => {
                                          const estilos = form.preferencias.estilosArquitetonicos || [];
                                          if (e.target.checked) {
                                            setForm(f => ({ 
                                              ...f, 
                                              preferencias: { 
                                                ...f.preferencias, 
                                                estilosArquitetonicos: [...estilos, estilo.value] 
                                              } 
                                            }));
                                          } else {
                                            setForm(f => ({ 
                                              ...f, 
                                              preferencias: { 
                                                ...f.preferencias, 
                                                estilosArquitetonicos: estilos.filter(e => e !== estilo.value) 
                                              } 
                                            }));
                                          }
                                        }}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm">{estilo.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Mostrar estilos selecionados */}
                          {(form.preferencias.estilosArquitetonicos || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(form.preferencias.estilosArquitetonicos || []).map(estilo => {
                                const estiloInfo = [
                                  { value: 'contemporaneo', label: '🏢 Contemporâneo' },
                                  { value: 'moderno', label: '✨ Moderno' },
                                  { value: 'classico', label: '🏛️ Clássico' },
                                  { value: 'minimalista', label: '⚪ Minimalista' },
                                  { value: 'industrial', label: '🏭 Industrial' },
                                  { value: 'rustico', label: '🌲 Rústico' },
                                  { value: 'colonial', label: '🏘️ Colonial' },
                                  { value: 'neoclassico', label: '🏛️ Neoclássico' },
                                  { value: 'art-deco', label: '🎨 Art Déco' },
                                  { value: 'sustentavel', label: '🌱 Sustentável' },
                                  { value: 'high-tech', label: '🤖 High-Tech' },
                                  { value: 'mediterraneo', label: '🌊 Mediterrâneo' }
                                ].find(e => e.value === estilo);
                                
                                return (
                                  <span key={estilo} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                    temaId === 'elegante' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {estiloInfo?.label || estilo}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setForm(f => ({ 
                                          ...f, 
                                          preferencias: { 
                                            ...f.preferencias, 
                                            estilosArquitetonicos: (f.preferencias.estilosArquitetonicos || []).filter(e => e !== estilo) 
                                          } 
                                        }));
                                      }}
                                      className="ml-1 hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          
                          <p className={`text-xs ${tema.textSecondary}`}>
                            ✨ Clique no campo acima para selecionar múltiplos estilos
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Materiais Preferidos</Label>
                          <Input
                            name="preferencias.materiaisPreferidos"
                            value={(form.preferencias.materiaisPreferidos || []).join(', ')}
                            onChange={e => setForm(f => ({
                              ...f,
                              preferencias: {
                                ...f.preferencias,
                                materiaisPreferidos: e.target.value ? e.target.value.split(',').map(m => m.trim()) : []
                              }
                            }))}
                            placeholder="Madeira, Concreto, Vidro..."
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Cores Preferidas</Label>
                          <Input
                            name="preferencias.coresPreferidas"
                            value={(form.preferencias.coresPreferidas || []).join(', ')}
                            onChange={e => setForm(f => ({
                              ...f,
                              preferencias: {
                                ...f.preferencias,
                                coresPreferidas: e.target.value ? e.target.value.split(',').map(c => c.trim()) : []
                              }
                            }))}
                            placeholder="Branco, Cinza, Azul..."
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Orçamento Médio Histórico
                          </Label>
                          <Input
                            name="preferencias.orcamentoMedioHistorico"
                            value={form.preferencias.orcamentoMedioHistorico > 0 ? form.preferencias.orcamentoMedioHistorico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                            onChange={e => {
                              const numeroLimpo = e.target.value.replace(/\D/g, '')
                              setForm(f => ({
                                ...f,
                                preferencias: {
                                  ...f.preferencias,
                                  orcamentoMedioHistorico: Number(numeroLimpo) / 100
                                }
                              }))
                            }}
                            placeholder="R$ 150.000,00"
                            className="h-12"
                          />
                          <p className={`text-xs ${tema.textSecondary}`}>
                            💰 Valor médio que o cliente costuma investir em projetos
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Prazo Típico Preferido (semanas)
                          </Label>
                          <Select
                            name="preferencias.prazoTipicoPreferido"
                            value={String(form.preferencias.prazoTipicoPreferido || '')}
                            onChange={e => setForm(f => ({
                              ...f,
                              preferencias: {
                                ...f.preferencias,
                                prazoTipicoPreferido: Number(e.target.value)
                              }
                            }))}
                            className="h-12"
                          >
                            <option value="">Selecione o prazo...</option>
                            <option value="4">⚡ 4 semanas (1 mês) - Projetos rápidos</option>
                            <option value="8">🏃 8 semanas (2 meses) - Projetos ágeis</option>
                            <option value="12">⭐ 12 semanas (3 meses) - Padrão recomendado</option>
                            <option value="16">📐 16 semanas (4 meses) - Projetos detalhados</option>
                            <option value="24">🏗️ 24 semanas (6 meses) - Projetos complexos</option>
                            <option value="36">🏛️ 36 semanas (9 meses) - Projetos grandes</option>
                            <option value="52">🏢 52 semanas (1 ano) - Projetos especiais</option>
                          </Select>
                          <p className={`text-xs ${tema.textSecondary}`}>
                            ⏱️ Tempo ideal que o cliente prefere para conclusão de projetos
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'historico' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
                        <FileText className="w-6 h-6" />
                        Histórico de Projetos
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label>Projetos Anteriores</Label>
                          <textarea 
                            name="historicoProjetos"
                            value={(form.historicoProjetos || []).map(p => `${p.tipologia} (${p.ano}) - R$ ${p.valor?.toLocaleString()} - Satisfação: ${p.satisfacao}/10`).join('\n')}
                            onChange={e => setForm(f => ({
                              ...f,
                              historicoProjetos: e.target.value.split('\n').filter(linha => linha.trim()).map(linha => {
                                const match = linha.match(/^(.+?)\s*\((\d+)\)\s*-\s*R\$\s*([\d.,]+)\s*-\s*Satisfação:\s*(\d+)/)
                                return {
                                  projetoId: Math.random().toString(36).substr(2, 9),
                                  tipologia: match ? match[1].trim() : linha.split('(')[0]?.trim() || '',
                                  ano: match ? Number(match[2]) : new Date().getFullYear(),
                                  valor: match ? Number(match[3].replace(/\D/g, '')) : 0,
                                  satisfacao: match ? Number(match[4]) : 0,
                                  observacoes: ''
                                }
                              })
                            }))}
                            rows={6}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                              temaId === 'elegante' 
                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white' 
                                : 'bg-white/10 border-white/10 text-white placeholder-white/60'
                            }`} 
                            placeholder="Ex: Casa Residencial (2023) - R$ 350.000 - Satisfação: 9&#10;Apartamento (2022) - R$ 280.000 - Satisfação: 8" 
                          />
                          <p className={`text-xs ${tema.textSecondary}`}>
                            📋 Digite um projeto por linha no formato: Tipologia (Ano) - R$ Valor - Satisfação: Nota
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'status' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${tema.text} mb-6 flex items-center gap-2`}>
                        <Check className="w-6 h-6" />
                        Status e Histórico
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Status do Cliente</Label>
                          <Select
                            name="status"
                            value={form.status || ''}
                            onChange={e => handleSelectChange('status', e.target.value)}
                            required
                            className="h-12"
                          >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                            <option value="vip">VIP</option>
                            <option value="problema">Problema</option>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Observações Gerais
                          </Label>
                          <textarea 
                            name="observacoes"
                            value={form.observacoes || ''} 
                            onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} 
                            rows={4}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                              temaId === 'elegante' 
                                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white' 
                                : 'bg-white/10 border-white/10 text-white placeholder-white/60'
                            }`} 
                            placeholder="Informações adicionais sobre o cliente..." 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Footer da Página */}
        <FooterSection 
          titulo="👥 Edição de Cliente ArcFlow"
          subtitulo="Gestão Comercial • CRM • Pipeline • Relacionamento"
        />
      </motion.div>
    </div>
  )
}