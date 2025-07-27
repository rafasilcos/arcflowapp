'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClientes } from '@/contexts/ClientesContext'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Cliente, ProjetoAnterior } from '@/types/integracaoComercial'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Phone, Building2, MapPin, Palette, CheckCircle2, ArrowLeft, Home } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import InputFormatado from '@/components/ui/InputFormatado'
import InputCpfInteligente from '@/components/ui/InputCpfInteligente'
import ValidadorCliente from '@/lib/validacao'
import { verificarCpfDuplicado, verificarCnpjDuplicado } from '@/services/clienteService'

export default function NovoClientePage() {
  const router = useRouter()
  const { adicionar, adicionarCliente } = useClientes()
  const { tema, temaId } = useTheme()

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoPessoa: 'juridica',
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
      dataContato: new Date().toISOString(),
      responsavelComercial: '',
      conversasAnteriores: [] as { data: string; responsavel: string; canal: 'email' | 'telefone' | 'whatsapp' | 'site' | 'outro'; resumo: string }[]
    },
    preferencias: {
      estilosArquitetonicos: [] as string[],
      materiaisPreferidos: [] as string[],
      coresPreferidas: [] as string[],
      orcamentoMedioHistorico: 0,
      prazoTipicoPreferido: 0
    },
    status: 'ativo' as 'ativo' | 'inativo' | 'vip' | 'problema',
    historicoProjetos: [] as ProjetoAnterior[],
    profissao: '',
    dataNascimento: '',
    dataFundacao: '',
    observacoes: ''
  })

  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string>>({})
  const [avisosValidacao, setAvisosValidacao] = useState<Record<string, string>>({})
  const [cpfDuplicado, setCpfDuplicado] = useState<{ duplicado: boolean; nomeCliente?: string }>({ duplicado: false })
  const [cnpjDuplicado, setCnpjDuplicado] = useState<{ duplicado: boolean; nomeCliente?: string }>({ duplicado: false })
  const [verificandoCpf, setVerificandoCpf] = useState(false)
  const [verificandoCnpj, setVerificandoCnpj] = useState(false)

  // Definir temaIdFormatado para InputFormatado
  const temaIdFormatado = temaId === 'elegante' ? 'elegante' : 'dark'

  // Função para verificar CPF duplicado com debounce
  const verificarCpf = async (cpf: string) => {
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      setCpfDuplicado({ duplicado: false })
      return
    }

    setVerificandoCpf(true)
    try {
      const resultado = await verificarCpfDuplicado(cpf)
      
      // ✅ VERIFICAR SE RESULTADO EXISTE
      if (!resultado) {
        setCpfDuplicado({ duplicado: false })
        return
      }
      
      setCpfDuplicado(resultado)
      
      if (resultado.duplicado) {
        toast.error(`⚠️ CPF já cadastrado para: ${resultado.nomeCliente}`)
      }
    } catch (error: any) {
      console.error('Erro ao verificar CPF:', error.message || error)
      setCpfDuplicado({ duplicado: false }) // Considera disponível em caso de erro
    } finally {
      setVerificandoCpf(false)
    }
  }

  // Função para verificar CNPJ duplicado com debounce
  const verificarCnpj = async (cnpj: string) => {
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
      setCnpjDuplicado({ duplicado: false })
      return
    }

    setVerificandoCnpj(true)
    try {
      const resultado = await verificarCnpjDuplicado(cnpj)
      
      // ✅ VERIFICAR SE RESULTADO EXISTE
      if (!resultado) {
        setCnpjDuplicado({ duplicado: false })
        return
      }
      
      setCnpjDuplicado(resultado)
      
      if (resultado.duplicado) {
        toast.error(`⚠️ CNPJ já cadastrado para: ${resultado.nomeCliente}`)
      }
    } catch (error: any) {
      console.error('Erro ao verificar CNPJ:', error.message || error)
      setCnpjDuplicado({ duplicado: false }) // Considera disponível em caso de erro
    } finally {
      setVerificandoCnpj(false)
    }
  }

  // Debounce para verificação de CPF
  useEffect(() => {
    if (form.tipoPessoa === 'fisica' && form.cpf) {
      const timer = setTimeout(() => {
        verificarCpf(form.cpf)
      }, 1000) // Espera 1 segundo após parar de digitar

      return () => clearTimeout(timer)
    } else {
      setCpfDuplicado({ duplicado: false })
    }
  }, [form.cpf, form.tipoPessoa])

  // Debounce para verificação de CNPJ
  useEffect(() => {
    if (form.tipoPessoa === 'juridica' && form.cnpj) {
      const timer = setTimeout(() => {
        verificarCnpj(form.cnpj)
      }, 1000) // Espera 1 segundo após parar de digitar

      return () => clearTimeout(timer)
    } else {
      setCnpjDuplicado({ duplicado: false })
    }
  }, [form.cnpj, form.tipoPessoa])

  // AUTO-SAVE: Salvar automaticamente o formulário para prevenir perda de dados
  const { loadAutoSavedData, clearAutoSave } = useAutoSave(form, {
    key: 'novo-cliente',
    delay: 3000, // Salvar a cada 3 segundos
    enabled: !salvando && !sucesso // Não salvar quando está enviando ou teve sucesso
  })

  // Carregar dados salvos automaticamente ao montar o componente
  useEffect(() => {
    const dadosSalvos = loadAutoSavedData()
    if (dadosSalvos && dadosSalvos.nome) {
      setForm(dadosSalvos)
      toast('📝 Dados recuperados automaticamente', { duration: 2000 })
    }
  }, [])

  // Limpar auto-save quando formulário for enviado com sucesso
  useEffect(() => {
    if (sucesso) {
      clearAutoSave()
    }
  }, [sucesso])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('endereco.')) {
      setForm({ ...form, endereco: { ...form.endereco, [name.replace('endereco.', '')]: value } })
    } else if (name.startsWith('familia.')) {
      setForm({ ...form, familia: { ...form.familia, [name.replace('familia.', '')]: value } })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error('CEP não encontrado')
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
      toast.success('Endereço preenchido automaticamente!')
    } catch {
      toast.error('Erro ao buscar CEP')
    }
  }

  // Buscar CEP automaticamente quando o usuário digitar 8 dígitos
  useEffect(() => {
    if (form.endereco.cep.replace(/\D/g, '').length === 8) {
      buscarCep(form.endereco.cep)
    }
  }, [form.endereco.cep])

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

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 [DEBUG] handleSubmit foi chamado!', e);
    e.preventDefault()
    
    console.log('🔍 [DEBUG] Dados do formulário:', form);
    
    // VALIDAÇÃO ROBUSTA usando ValidadorCliente
    const dadosParaValidacao = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      tipoPessoa: form.tipoPessoa as 'fisica' | 'juridica',
      cpf: form.cpf,
      cnpj: form.cnpj,
      endereco: form.endereco,
      dataNascimento: form.dataNascimento,
      dataFundacao: form.dataFundacao
    }
    
    console.log('🔍 [DEBUG] Dados para validação:', dadosParaValidacao);
    
    // 🔍 DEBUG ESPECÍFICO - Testar CPF
    if (dadosParaValidacao.cpf) {
      console.log('🔍 [DEBUG] Testando CPF:', dadosParaValidacao.cpf);
      const cpfLimpo = dadosParaValidacao.cpf.replace(/\D/g, '');
      console.log('🔍 [DEBUG] CPF limpo:', cpfLimpo);
      console.log('🔍 [DEBUG] CPF tem 11 dígitos?', cpfLimpo.length === 11);
      console.log('🔍 [DEBUG] CPF não é sequência?', !/^(\d)\1{10}$/.test(cpfLimpo));
    }
    
    const validacao = ValidadorCliente.validarCliente(dadosParaValidacao)
    
    console.log('🔍 [DEBUG] Resultado da validação:', validacao);
    
    if (!validacao.valido) {
      setErrosValidacao(validacao.erros)
      setAvisosValidacao(validacao.avisos || {})
      
      // Mostrar primeiro erro encontrado
      const primeiroErro = Object.values(validacao.erros)[0]
      toast.error(primeiroErro)
      return
    }

    // Verificar se há CPF ou CNPJ duplicado
    if (cpfDuplicado.duplicado) {
      toast.error(`❌ CPF já cadastrado para: ${cpfDuplicado.nomeCliente}`)
      return
    }

    if (cnpjDuplicado.duplicado) {
      toast.error(`❌ CNPJ já cadastrado para: ${cnpjDuplicado.nomeCliente}`)
      return
    }
    
    // Limpar erros se validação passou
    setErrosValidacao({})
    setAvisosValidacao(validacao.avisos || {})
    
    // Mostrar avisos se houver
    if (validacao.avisos && Object.keys(validacao.avisos).length > 0) {
      const primeiroAviso = Object.values(validacao.avisos)[0]
      toast(primeiroAviso, { icon: '⚠️' })
    }
    
    setSalvando(true)
    try {
      // Desmembrar o endereço em campos separados
      const endereco = form.endereco || {}
      const dadosCliente: Partial<Cliente> = {
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
      
      await adicionarCliente(dadosCliente)
      setSucesso(true)
      toast.success('Cliente cadastrado com sucesso!')
      setTimeout(() => router.push('/comercial/clientes'), 1200)
    } catch (error: any) {
      console.error('Erro ao cadastrar cliente:', error)
      toast.error(error.message || 'Erro ao cadastrar cliente')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${tema.bg}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 border-b ${
          temaId === 'elegante'
            ? 'border-gray-200/50'
            : 'border-white/10'
        }`}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              href="/comercial/clientes"
              className={`p-2 rounded-xl transition-colors ${
                temaId === 'elegante'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white/60 hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={`text-3xl font-bold ${
                temaId === 'elegante' ? 'text-gray-900' : 'text-white'
              }`}>
                👤 Novo Cliente
              </h1>
              <p className={`mt-1 ${
                temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
              }`}>
                Cadastre um novo cliente e personalize a experiência do seu escritório de arquitetura, engenharia ou construção.
              </p>
            </div>
          </div>
          <Link 
            href="/"
            className={`p-2 rounded-xl transition-colors ${
              temaId === 'elegante'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 pt-12"
      >
        <div className={`max-w-6xl mx-auto ${tema.card} shadow-sm rounded-3xl shadow-xl border ${
          temaId === 'elegante' 
            ? 'border-gray-200' 
            : 'border-white/20'
        } p-12 relative`}>
          <div className="flex flex-col items-center gap-2 pb-6">
            <UserPlus className={`w-10 h-10 ${tema.text}`} />
            <h2 className={`text-2xl font-bold ${tema.text}`}>Cadastro de Cliente</h2>
            <p className={`text-sm text-center max-w-md ${tema.textSecondary}`}>Preencha os dados abaixo para criar um novo cliente no ArcFlow.</p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-10 mt-2">
                {/* Dados Pessoais */}
                <section>
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${tema.text}`}>👤 Dados Pessoais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Nome completo *</label>
                      <InputFormatado tipo="text" value={form.nome} onChange={valor => setForm(f => ({ ...f, nome: valor }))} obrigatoria temaId={temaIdFormatado} placeholder="Ex: Ana Paula Silva" />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>E-mail *</label>
                      <InputFormatado tipo="email" value={form.email} onChange={valor => setForm(f => ({ ...f, email: valor }))} obrigatoria temaId={temaIdFormatado} placeholder="Ex: ana@email.com" />
                    </div>
                    {/* Telefone */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Telefone *</label>
                      <InputFormatado tipo="telefone" value={form.telefone} onChange={valor => setForm(f => ({ ...f, telefone: valor }))} obrigatoria temaId={temaIdFormatado} placeholder="(99) 99999-9999" />
                    </div>
                    {/* Profissão */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Profissão</label>
                      <InputFormatado tipo="text" value={form.profissao || ''} onChange={valor => setForm(f => ({ ...f, profissao: valor }))} temaId={temaIdFormatado} placeholder="Ex: Engenheiro Civil, Empresário..." />
                    </div>
                    {/* Toggle Pessoa Física/Jurídica */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Tipo de Pessoa</label>
                      <div className="flex gap-3 mt-1">
                        <button 
                          type="button" 
                          onClick={() => setForm(f => ({ ...f, tipoPessoa: 'fisica' }))} 
                          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                            form.tipoPessoa === 'fisica' 
                              ? `bg-gradient-to-r ${tema.gradiente} text-white shadow-lg` 
                              : temaId === 'elegante'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          Pessoa Física
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setForm(f => ({ ...f, tipoPessoa: 'juridica' }))} 
                          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                            form.tipoPessoa === 'juridica' 
                              ? `bg-gradient-to-r ${tema.gradiente} text-white shadow-lg` 
                              : temaId === 'elegante'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          Pessoa Jurídica
                        </button>
                      </div>
                    </div>
                    {/* CPF/CNPJ */}
                    {form.tipoPessoa === 'fisica' && (
                      <InputCpfInteligente
                        value={form.cpf}
                        onChange={valor => setForm(f => ({ ...f, cpf: valor }))}
                        label="CPF"
                        obrigatoria={true}
                        placeholder="000.000.000-00"
                      />
                    )}
                    {form.tipoPessoa === 'juridica' && (
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${tema.text}`}>CNPJ *</label>
                        <div className="relative">
                          <InputFormatado tipo="cnpj" value={form.cnpj} onChange={valor => setForm(f => ({ ...f, cnpj: valor }))} obrigatoria temaId={temaIdFormatado} placeholder="00.000.000/0001-00" />
                          {verificandoCnpj && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                          )}
                          {cnpjDuplicado.duplicado && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <span className="text-red-500 text-xl">⚠️</span>
                            </div>
                          )}
                        </div>
                        {cnpjDuplicado.duplicado && (
                          <p className="text-red-500 text-sm">⚠️ CNPJ já cadastrado para: {cnpjDuplicado.nomeCliente}</p>
                        )}
                      </div>
                    )}
                    {/* Data de nascimento */}
                    {form.tipoPessoa === 'fisica' && (
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${tema.text}`}>Data de Nascimento</label>
                        <InputFormatado tipo="data" value={form.dataNascimento || ''} onChange={valor => setForm(f => ({ ...f, dataNascimento: valor }))} temaId={temaIdFormatado} placeholder="dd/mm/aaaa" />
                      </div>
                    )}
                    {/* Data de fundação para juridica */}
                    {form.tipoPessoa === 'juridica' && (
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${tema.text}`}>Data de Fundação</label>
                        <InputFormatado tipo="data" value={form.dataFundacao || ''} onChange={valor => setForm(f => ({ ...f, dataFundacao: valor }))} temaId={temaIdFormatado} placeholder="dd/mm/aaaa" />
                      </div>
                    )}
                  </div>
                </section>
                <hr className="my-2 border-blue-100" />
                
                {/* FASE 1: Seção Família */}
                <section>
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${tema.text}`}>👨‍👩‍👧‍👦 Informações Familiares</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cônjuge */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Nome do Cônjuge</label>
                      <InputFormatado 
                        tipo="text" 
                        value={form.familia.conjuge || ''} 
                        onChange={valor => setForm(f => ({ 
                          ...f, 
                          familia: { ...f.familia, conjuge: valor } 
                        }))} 
                        temaId={temaIdFormatado}
                        placeholder="Nome completo do cônjuge"
                      />
                    </div>
                    
                    {/* Filhos */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Filhos</label>
                      <div className="space-y-3">
                        {form.familia.filhos.map((filho, index) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            temaId === 'elegante' 
                              ? 'border-gray-200 bg-gray-50' 
                              : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="grid grid-cols-2 gap-3">
                              <InputFormatado 
                                tipo="text"
                                value={filho.nome}
                                onChange={valor => {
                                  const novosFilhos = [...form.familia.filhos];
                                  novosFilhos[index] = { ...novosFilhos[index], nome: valor };
                                  setForm(f => ({ ...f, familia: { ...f.familia, filhos: novosFilhos } }));
                                }}
                                temaId={temaIdFormatado}
                                placeholder="Nome do filho"
                              />
                                                             <InputFormatado 
                                 tipo="text"
                                 value={filho.idade?.toString() || ''}
                                 onChange={valor => {
                                   const novosFilhos = [...form.familia.filhos];
                                   novosFilhos[index] = { ...novosFilhos[index], idade: Number(valor) || 0 };
                                   setForm(f => ({ ...f, familia: { ...f.familia, filhos: novosFilhos } }));
                                 }}
                                 temaId={temaIdFormatado}
                                 placeholder="Idade"
                               />
                            </div>
                            <div className="mt-2">
                              <InputFormatado 
                                tipo="text"
                                value={filho.necessidadesEspeciais || ''}
                                onChange={valor => {
                                  const novosFilhos = [...form.familia.filhos];
                                  novosFilhos[index] = { ...novosFilhos[index], necessidadesEspeciais: valor };
                                  setForm(f => ({ ...f, familia: { ...f.familia, filhos: novosFilhos } }));
                                }}
                                temaId={temaIdFormatado}
                                placeholder="Necessidades especiais (opcional)"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const novosFilhos = form.familia.filhos.filter((_, i) => i !== index);
                                setForm(f => ({ ...f, familia: { ...f.familia, filhos: novosFilhos } }));
                              }}
                              className="mt-2 text-red-500 text-sm hover:text-red-700"
                            >
                              ❌ Remover filho
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => {
                            const novosFilhos = [...form.familia.filhos, { nome: '', idade: 0, necessidadesEspeciais: '' }];
                            setForm(f => ({ ...f, familia: { ...f.familia, filhos: novosFilhos } }));
                          }}
                          className={`w-full py-2 px-4 rounded-lg border-2 border-dashed transition-colors ${
                            temaId === 'elegante'
                              ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                              : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          ➕ Adicionar Filho
                        </button>
                      </div>
                    </div>
                    
                    {/* Pets */}
                    <div className="space-y-2 md:col-span-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Pets</label>
                      <div className="space-y-3">
                        {form.familia.pets.map((pet, index) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            temaId === 'elegante' 
                              ? 'border-gray-200 bg-gray-50' 
                              : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="grid grid-cols-2 gap-3">
                              <InputFormatado 
                                tipo="text"
                                value={pet.tipo}
                                onChange={valor => {
                                  const novosPets = [...form.familia.pets];
                                  novosPets[index] = { ...novosPets[index], tipo: valor };
                                  setForm(f => ({ ...f, familia: { ...f.familia, pets: novosPets } }));
                                }}
                                temaId={temaIdFormatado}
                                placeholder="Tipo (ex: Cão, Gato, Pássaro)"
                              />
                              <InputFormatado 
                                tipo="text"
                                value={pet.quantidade.toString()}
                                onChange={valor => {
                                  const novosPets = [...form.familia.pets];
                                  novosPets[index] = { ...novosPets[index], quantidade: Number(valor) || 1 };
                                  setForm(f => ({ ...f, familia: { ...f.familia, pets: novosPets } }));
                                }}
                                temaId={temaIdFormatado}
                                placeholder="Quantidade"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const novosPets = form.familia.pets.filter((_, i) => i !== index);
                                setForm(f => ({ ...f, familia: { ...f.familia, pets: novosPets } }));
                              }}
                              className="mt-2 text-red-500 text-sm hover:text-red-700"
                            >
                              ❌ Remover pet
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => {
                            const novosPets = [...form.familia.pets, { tipo: '', quantidade: 1 }];
                            setForm(f => ({ ...f, familia: { ...f.familia, pets: novosPets } }));
                          }}
                          className={`w-full py-2 px-4 rounded-lg border-2 border-dashed transition-colors ${
                            temaId === 'elegante'
                              ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                              : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          🐾 Adicionar Pet
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
                <hr className="my-2 border-blue-100" />
                
                {/* FASE 1: Histórico de Projetos */}
                <section>
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${tema.text}`}>📋 Histórico de Projetos</h2>
                  <div className="space-y-4">
                    {form.historicoProjetos.map((projeto, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${
                        temaId === 'elegante' 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-white/10 bg-white/5'
                      }`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className={`block text-sm font-medium ${tema.text}`}>Tipologia</label>
                            <select 
                              value={projeto.tipologia}
                              onChange={e => {
                                const novosProjetos = [...form.historicoProjetos];
                                novosProjetos[index] = { ...novosProjetos[index], tipologia: e.target.value };
                                setForm(f => ({ ...f, historicoProjetos: novosProjetos }));
                              }}
                              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                temaId === 'elegante' 
                                  ? 'bg-white border-gray-200 text-gray-900' 
                                  : 'bg-white/10 border-white/10 text-white'
                              }`}
                            >
                              <option value="">Selecione...</option>
                              <option value="residencial">🏠 Residencial</option>
                              <option value="comercial">🏢 Comercial</option>
                              <option value="industrial">🏭 Industrial</option>
                              <option value="institucional">🏛️ Institucional</option>
                              <option value="reforma">🔨 Reforma</option>
                              <option value="interiores">🛋️ Design de Interiores</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className={`block text-sm font-medium ${tema.text}`}>Ano</label>
                                                         <InputFormatado 
                               tipo="text"
                               value={projeto.ano.toString()}
                               onChange={valor => {
                                 const novosProjetos = [...form.historicoProjetos];
                                 novosProjetos[index] = { ...novosProjetos[index], ano: Number(valor) || new Date().getFullYear() };
                                 setForm(f => ({ ...f, historicoProjetos: novosProjetos }));
                               }}
                               temaId={temaIdFormatado}
                               placeholder="2024"
                             />
                          </div>
                          
                          <div className="space-y-2">
                            <label className={`block text-sm font-medium ${tema.text}`}>Valor Investido</label>
                            <InputFormatado 
                              tipo="valor"
                              value={projeto.valor ? projeto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                              onChange={valor => {
                                const numeroLimpo = valor.replace(/\D/g, '');
                                const novosProjetos = [...form.historicoProjetos];
                                novosProjetos[index] = { ...novosProjetos[index], valor: Number(numeroLimpo) / 100 };
                                setForm(f => ({ ...f, historicoProjetos: novosProjetos }));
                              }}
                              temaId={temaIdFormatado}
                              placeholder="R$ 150.000,00"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className={`block text-sm font-medium ${tema.text}`}>Satisfação</label>
                            <select 
                              value={projeto.satisfacao?.toString() || ''}
                              onChange={e => {
                                const novosProjetos = [...form.historicoProjetos];
                                novosProjetos[index] = { ...novosProjetos[index], satisfacao: Number(e.target.value) || 0 };
                                setForm(f => ({ ...f, historicoProjetos: novosProjetos }));
                              }}
                              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                temaId === 'elegante' 
                                  ? 'bg-white border-gray-200 text-gray-900' 
                                  : 'bg-white/10 border-white/10 text-white'
                              }`}
                                                          >
                                <option value="">Selecione...</option>
                                <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                                <option value="4">⭐⭐⭐⭐ Muito Boa</option>
                                <option value="3">⭐⭐⭐ Boa</option>
                                <option value="2">⭐⭐ Regular</option>
                                <option value="1">⭐ Ruim</option>
                              </select>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const novosProjetos = form.historicoProjetos.filter((_, i) => i !== index);
                            setForm(f => ({ ...f, historicoProjetos: novosProjetos }));
                          }}
                          className="mt-3 text-red-500 text-sm hover:text-red-700"
                        >
                          🗑️ Remover Projeto
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => {
                        const novosProjetos = [...form.historicoProjetos, { 
                          projetoId: `projeto_${Date.now()}`, 
                          tipologia: '', 
                          ano: new Date().getFullYear(), 
                          valor: 0, 
                          satisfacao: 0,
                          observacoes: '' 
                        }];
                        setForm(f => ({ ...f, historicoProjetos: novosProjetos }));
                      }}
                      className={`w-full py-3 px-4 rounded-lg border-2 border-dashed transition-colors ${
                        temaId === 'elegante'
                          ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                          : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                      }`}
                    >
                      ➕ Adicionar Projeto Anterior
                    </button>
                  </div>
                </section>
                <hr className="my-2 border-blue-100" />
                
                {/* Endereço */}
                <section>
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${tema.text}`}>📍 Endereço</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>CEP</label>
                      <InputFormatado tipo="cep" value={form.endereco.cep} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, cep: valor } }))} temaId={temaIdFormatado} placeholder="00000-000" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Logradouro</label>
                      <InputFormatado tipo="text" value={form.endereco.logradouro} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, logradouro: valor } }))} temaId={temaIdFormatado} placeholder="Rua, Avenida..." />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Número</label>
                      <InputFormatado tipo="text" value={form.endereco.numero} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, numero: valor } }))} temaId={temaIdFormatado} placeholder="123" />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Complemento</label>
                      <InputFormatado tipo="text" value={form.endereco.complemento || ''} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, complemento: valor } }))} temaId={temaIdFormatado} placeholder="Apto, sala..." />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Bairro</label>
                      <InputFormatado tipo="text" value={form.endereco.bairro} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, bairro: valor } }))} temaId={temaIdFormatado} placeholder="Centro" />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Cidade</label>
                      <InputFormatado tipo="text" value={form.endereco.cidade} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, cidade: valor } }))} temaId={temaIdFormatado} placeholder="Cidade" />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>UF</label>
                      <InputFormatado tipo="text" value={form.endereco.uf} onChange={valor => setForm(f => ({ ...f, endereco: { ...f.endereco, uf: valor } }))} temaId={temaIdFormatado} placeholder="UF" />
                    </div>
                  </div>
                </section>
                <hr className="my-2 border-blue-100" />
                {/* Origem do lead */}
                <section>
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${tema.text}`}>🔗 Informações Comerciais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Origem do Lead</label>
                      <select 
                        value={form.origem.fonte} 
                        onChange={e => setForm(f => ({ ...f, origem: { ...f.origem, fonte: e.target.value as any } }))} 
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          temaId === 'elegante' 
                            ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white' 
                            : 'bg-white/10 border-white/10 text-white'
                        }`}
                      >
                        <option value="site">🌐 Site</option>
                        <option value="indicacao">👥 Indicação</option>
                        <option value="telefone">📞 Telefone</option>
                        <option value="evento">🎪 Evento</option>
                        <option value="redes-sociais">📱 Redes Sociais</option>
                        <option value="google">🔍 Google/SEO</option>
                        <option value="outros">📋 Outros</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Data de Contato</label>
                      <input 
                        type="datetime-local"
                        value={form.origem.dataContato} 
                        onChange={e => setForm(f => ({ ...f, origem: { ...f.origem, dataContato: e.target.value } }))} 
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          temaId === 'elegante' 
                            ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white' 
                            : 'bg-white/10 border-white/10 text-white'
                        }`}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Responsável Comercial</label>
                      <InputFormatado 
                        tipo="text" 
                        value={form.origem.responsavelComercial} 
                        onChange={valor => setForm(f => ({ ...f, origem: { ...f.origem, responsavelComercial: valor } }))} 
                        temaId={temaIdFormatado} 
                        placeholder="Nome do responsável comercial" 
                        obrigatoria
                      />
                    </div>
                    
                    {/* FASE 3: Conversas Anteriores */}
                    <div className="space-y-2 md:col-span-2">
                      <label className={`block text-sm font-medium ${tema.text}`}>Conversas Anteriores</label>
                      <div className="space-y-3">
                        {form.origem.conversasAnteriores?.map((conversa, index) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            temaId === 'elegante' 
                              ? 'border-gray-200 bg-gray-50' 
                              : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <label className={`block text-xs font-medium ${tema.text}`}>Data</label>
                                <input 
                                  type="date"
                                  value={conversa.data}
                                  onChange={e => {
                                    const novasConversas = [...(form.origem.conversasAnteriores || [])];
                                    novasConversas[index] = { ...novasConversas[index], data: e.target.value };
                                    setForm(f => ({ ...f, origem: { ...f.origem, conversasAnteriores: novasConversas } }));
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    temaId === 'elegante' 
                                      ? 'bg-white border-gray-200 text-gray-900' 
                                      : 'bg-white/10 border-white/10 text-white'
                                  }`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className={`block text-xs font-medium ${tema.text}`}>Canal</label>
                                <select 
                                  value={conversa.canal}
                                  onChange={e => {
                                    const novasConversas = [...(form.origem.conversasAnteriores || [])];
                                    novasConversas[index] = { ...novasConversas[index], canal: e.target.value as any };
                                    setForm(f => ({ ...f, origem: { ...f.origem, conversasAnteriores: novasConversas } }));
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    temaId === 'elegante' 
                                      ? 'bg-white border-gray-200 text-gray-900' 
                                      : 'bg-white/10 border-white/10 text-white'
                                  }`}
                                >
                                  <option value="email">📧 Email</option>
                                  <option value="telefone">📞 Telefone</option>
                                  <option value="whatsapp">💬 WhatsApp</option>
                                  <option value="site">🌐 Site</option>
                                  <option value="outro">📋 Outro</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className={`block text-xs font-medium ${tema.text}`}>Responsável</label>
                                <InputFormatado 
                                  tipo="text"
                                  value={conversa.responsavel}
                                  onChange={valor => {
                                    const novasConversas = [...(form.origem.conversasAnteriores || [])];
                                    novasConversas[index] = { ...novasConversas[index], responsavel: valor };
                                    setForm(f => ({ ...f, origem: { ...f.origem, conversasAnteriores: novasConversas } }));
                                  }}
                                  temaId={temaIdFormatado}
                                  placeholder="Nome do responsável"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className={`block text-xs font-medium ${tema.text}`}>Resumo da Conversa</label>
                                <textarea 
                                  value={conversa.resumo}
                                  onChange={e => {
                                    const novasConversas = [...(form.origem.conversasAnteriores || [])];
                                    novasConversas[index] = { ...novasConversas[index], resumo: e.target.value };
                                    setForm(f => ({ ...f, origem: { ...f.origem, conversasAnteriores: novasConversas } }));
                                  }}
                                  rows={2}
                                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                    temaId === 'elegante' 
                                      ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400' 
                                      : 'bg-white/10 border-white/10 text-white placeholder-white/60'
                                  }`}
                                  placeholder="Resumo do que foi conversado..."
                                />
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const novasConversas = (form.origem.conversasAnteriores || []).filter((_, i) => i !== index);
                                setForm(f => ({ ...f, origem: { ...f.origem, conversasAnteriores: novasConversas } }));
                              }}
                              className="mt-2 text-red-500 text-sm hover:text-red-700"
                            >
                              🗑️ Remover Conversa
                            </button>
                          </div>
                        )) || []}
                        <button 
                          type="button"
                          onClick={() => {
                            const novasConversas = [...(form.origem.conversasAnteriores || []), { 
                              data: new Date().toISOString().split('T')[0], 
                              canal: 'telefone' as const, 
                              responsavel: '', 
                              resumo: '' 
                            }];
                            setForm(f => ({ ...f, origem: { ...f.origem, conversasAnteriores: novasConversas } }));
                          }}
                          className={`w-full py-2 px-4 rounded-lg border-2 border-dashed transition-colors ${
                            temaId === 'elegante'
                              ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                              : 'border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          💬 Adicionar Conversa
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
                <hr className="my-2 border-blue-100" />
                {/* Preferências */}
                <section>
                  <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${tema.text}`}>🎨 Preferências</h2>
                  
                  {/* Layout em grid uniforme - todos os campos com mesma altura */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* FASE 2: Múltipla seleção de estilos */}
                    <div className="space-y-3 md:col-span-2">
                      <label className={`block text-sm font-medium ${tema.text} h-5`}>
                        Estilos Arquitetônicos Preferidos (múltipla seleção)
                      </label>
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
                            <span className={`${form.preferencias.estilosArquitetonicos.length === 0 ? 'opacity-60' : ''}`}>
                              {form.preferencias.estilosArquitetonicos.length === 0 
                                ? 'Selecione os estilos preferidos...' 
                                : `${form.preferencias.estilosArquitetonicos.length} estilo(s) selecionado(s)`
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
                                  form.preferencias.estilosArquitetonicos.includes(estilo.value)
                                    ? temaId === 'elegante'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-blue-500/20 text-blue-300'
                                    : temaId === 'elegante'
                                      ? 'hover:bg-gray-50'
                                      : 'hover:bg-gray-700'
                                }`}>
                                  <input 
                                    type="checkbox"
                                    checked={form.preferencias.estilosArquitetonicos.includes(estilo.value)}
                                    onChange={(e) => {
                                      const estilos = form.preferencias.estilosArquitetonicos;
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
                      {form.preferencias.estilosArquitetonicos.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {form.preferencias.estilosArquitetonicos.map(estilo => {
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
                                        estilosArquitetonicos: f.preferencias.estilosArquitetonicos.filter(e => e !== estilo) 
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

                    <div className="space-y-3">
                      <label className={`block text-sm font-medium ${tema.text} h-5`}>
                        Materiais Preferidos
                      </label>
                      <InputFormatado 
                        tipo="text" 
                        value={form.preferencias.materiaisPreferidos.join(', ')} 
                        onChange={valor => setForm(f => ({ ...f, preferencias: { ...f.preferencias, materiaisPreferidos: valor.split(',').map(s => s.trim()) } }))} 
                        temaId={temaIdFormatado} 
                        placeholder="Ex: Madeira, Vidro, Concreto, Aço..." 
                      />
                    </div>

                    <div className="space-y-3">
                      <label className={`block text-sm font-medium ${tema.text} h-5`}>
                        Cores Preferidas
                      </label>
                      <InputFormatado 
                        tipo="text" 
                        value={form.preferencias.coresPreferidas.join(', ')} 
                        onChange={valor => setForm(f => ({ ...f, preferencias: { ...f.preferencias, coresPreferidas: valor.split(',').map(s => s.trim()) } }))} 
                        temaId={temaIdFormatado} 
                        placeholder="Ex: Branco, Cinza, Madeira natural..." 
                      />
                    </div>

                    <div className="space-y-3">
                      <label className={`block text-sm font-medium ${tema.text} h-5`}>
                        Orçamento Médio Histórico
                      </label>
                      <InputFormatado 
                        tipo="valor" 
                        value={form.preferencias.orcamentoMedioHistorico > 0 ? form.preferencias.orcamentoMedioHistorico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''} 
                        onChange={valor => {
                          const numeroLimpo = valor.replace(/\D/g, '')
                          setForm(f => ({ ...f, preferencias: { ...f.preferencias, orcamentoMedioHistorico: Number(numeroLimpo) / 100 } }))
                        }} 
                        temaId={temaIdFormatado} 
                        placeholder="R$ 150.000,00" 
                      />
                      <p className={`text-xs ${tema.textSecondary}`}>
                        💰 Valor médio que o cliente costuma investir em projetos
                      </p>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className={`block text-sm font-medium ${tema.text} h-5`}>
                        Prazo Típico Preferido (semanas)
                      </label>
                      <select 
                        value={form.preferencias.prazoTipicoPreferido || ''} 
                        onChange={e => setForm(f => ({ ...f, preferencias: { ...f.preferencias, prazoTipicoPreferido: Number(e.target.value) } }))} 
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          temaId === 'elegante' 
                            ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white' 
                            : 'bg-white/10 border-white/10 text-white'
                        }`}
                      >
                        <option value="">Selecione o prazo...</option>
                        <option value="4">⚡ 4 semanas (1 mês) - Projetos rápidos</option>
                        <option value="8">🏃 8 semanas (2 meses) - Projetos ágeis</option>
                        <option value="12">⭐ 12 semanas (3 meses) - Padrão recomendado</option>
                        <option value="16">📐 16 semanas (4 meses) - Projetos detalhados</option>
                        <option value="24">🏗️ 24 semanas (6 meses) - Projetos complexos</option>
                        <option value="36">🏛️ 36 semanas (9 meses) - Projetos grandes</option>
                        <option value="52">🏢 52 semanas (1 ano) - Projetos especiais</option>
                      </select>
                      <p className={`text-xs ${tema.textSecondary}`}>
                        ⏱️ Tempo ideal que o cliente prefere para conclusão de projetos
                      </p>
                    </div>
                  </div>

                  {/* Card informativo separado */}
                  <div className={`mt-6 p-4 rounded-lg ${
                    temaId === 'elegante' 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-blue-500/10 border border-blue-500/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="text-blue-500 mt-0.5">💡</div>
                      <div>
                        <h4 className={`text-sm font-medium ${
                          temaId === 'elegante' ? 'text-blue-900' : 'text-blue-200'
                        }`}>
                          Dica Profissional
                        </h4>
                        <p className={`text-xs mt-1 ${
                          temaId === 'elegante' ? 'text-blue-700' : 'text-blue-300'
                        }`}>
                          Essas informações ajudam a personalizar propostas e criar briefings mais assertivos para o cliente.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                <hr className="my-2 border-blue-100" />
                {/* Status */}
                <section>
                  <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${tema.text}`}>🏷️ Status</h2>
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${tema.text}`}>Status</label>
                    <select 
                      value={form.status} 
                      onChange={e => handleSelectChange('status', e.target.value)} 
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        temaId === 'elegante' 
                          ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white' 
                          : 'bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="vip">VIP</option>
                      <option value="problema">Problema</option>
                    </select>
                  </div>
                </section>
                
                {/* Observações gerais */}
                <section>
                  <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${tema.text}`}>📝 Observações Gerais</h2>
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${tema.text}`}>Observações</label>
                    <textarea 
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
                </section>
                <div className="pt-6 flex gap-3">
                                        <Button variant="comercial" width="full" type="submit" disabled={salvando || cpfDuplicado.duplicado || cnpjDuplicado.duplicado || verificandoCpf || verificandoCnpj} className="flex-1 flex items-center justify-center gap-2">
                    {salvando ? (
                      <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Salvando...</span>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5" /> Salvar Cliente</>
                    )}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => router.push('/comercial/clientes')} className="flex-1">Cancelar</Button>
                </div>
                {sucesso && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-green-600 font-semibold justify-center mt-2">
                    <CheckCircle2 className="w-5 h-5" /> Cliente cadastrado com sucesso!
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>

      {/* Footer informativo atualizado */}
      <div className={`mt-8 pb-6 text-center text-sm ${tema.textSecondary}`}>
        <p>🎯 Sistema ArcFlow - Cadastro de Cliente v3.0 - COMPLETO</p>
        <p>✨ CRM → Briefing → Orçamento → Projeto integrados</p>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            ✅ Fase 1: Família + Histórico
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            ✅ Fase 2: Múltiplos Estilos
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
            ✅ Fase 3: Conversas Anteriores
          </span>
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
            🚀 100% Campos Implementados
          </span>
        </div>
      </div>
    </div>
  )
} 