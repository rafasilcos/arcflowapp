'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, XCircle, MessageCircle, Download, 
  User, MapPin, Building, DollarSign, Calendar,
  FileText, Star, AlertTriangle, Clock, Send,
  Eye, Paperclip, Phone, Mail, Shield
} from 'lucide-react'

// Dados do Briefing para Aprovação
const BRIEFING_APROVACAO = {
  id: 1,
  titulo: 'Casa Alto Padrão - Condomínio Alphaville',
  cliente: {
    nome: 'Maria e João Silva',
    email: 'maria.silva@email.com',
    telefone: '(11) 99999-9999'
  },
  escritorio: {
    nome: 'Costa Arquitetura',
    logo: '/logo-empresa.png',
    responsavel: 'Ana Costa',
    contato: '(11) 98888-8888'
  },
  projeto: {
    tipologia: 'Residencial',
    localização: 'Alphaville, Barueri - SP',
    areaPrevista: '450m²',
    valorEstimado: 'R$ 85.000',
    prazoEntrega: '15/03/2024'
  },
  criadoEm: '05/01/2024',
  tempoLimite: '15/01/2024',
  progresso: 85,
  respostasCompletas: 44,
  respostasTotal: 52
}

// Resumo das Seções
const RESUMO_SECOES = [
  {
    nome: 'Programa de Necessidades',
    resumo: '4 suítes, escritório, sala de estar integrada, área gourmet, piscina, área de lazer'
  },
  {
    nome: 'Estilo Arquitetônico',
    resumo: 'Contemporâneo com elementos clássicos, fachada em pedra natural, grandes aberturas'
  },
  {
    nome: 'Infraestrutura',
    resumo: 'Automação residencial completa, aquecimento solar, sistema de segurança integrado'
  },
  {
    nome: 'Sustentabilidade',
    resumo: 'Captação de águas pluviais, painéis solares, iluminação LED, paisagismo nativo'
  },
  {
    nome: 'Orçamento e Cronograma',
    resumo: 'R$ 85.000 para projeto completo, prazo de 90 dias, pagamento em 3 parcelas'
  }
]

interface PageProps {
  params: Promise<{ id: string; token: string }>
}

export default function PortalAprovacao({ params }: PageProps) {
  const [statusAprovacao, setStatusAprovacao] = useState<'pendente' | 'aprovado' | 'rejeitado'>('pendente')
  const [comentarios, setComentarios] = useState('')
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)
  const [enviandoResposta, setEnviandoResposta] = useState(false)
  const [paramsData, setParamsData] = useState<{ id: string; token: string } | null>(null)

  useEffect(() => {
    params.then(setParamsData)
  }, [params])

  const handleAprovacao = async (status: 'aprovado' | 'rejeitado') => {
    setEnviandoResposta(true)
    
    // Simular envio
    setTimeout(() => {
      setStatusAprovacao(status)
      setEnviandoResposta(false)
    }, 1500)
  }

  if (!paramsData) {
    return <div>Carregando...</div>
  }

  if (statusAprovacao === 'aprovado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ✅ Briefing Aprovado com Sucesso!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Obrigado por aprovar o briefing. Nossa equipe foi notificada e iniciará o desenvolvimento do seu projeto.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-green-800 mb-2">Próximos Passos:</h3>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• Você receberá um e-mail de confirmação em breve</li>
              <li>• Nossa equipe entrará em contato em até 24 horas</li>
              <li>• O desenvolvimento do projeto será iniciado conforme cronograma</li>
            </ul>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{BRIEFING_APROVACAO.escritorio.contato}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>contato@costaarquitetura.com</span>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (statusAprovacao === 'rejeitado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📝 Feedback Recebido
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Suas observações foram enviadas para nossa equipe. Faremos os ajustes necessários e retornaremos em breve.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-orange-800 mb-2">Seus Comentários:</h3>
            <p className="text-sm text-orange-700 text-left italic">
              "{comentarios || 'Nenhum comentário adicional.'}"
            </p>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{BRIEFING_APROVACAO.escritorio.contato}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>contato@costaarquitetura.com</span>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {BRIEFING_APROVACAO.escritorio.nome}
                </h1>
                <p className="text-sm text-gray-600">
                  Portal de Aprovação de Briefing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Conexão Segura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Saudação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Olá, {BRIEFING_APROVACAO.cliente.nome.split(' ')[0]}! 👋
            </h2>
            <p className="text-lg text-gray-600">
              Seu briefing está pronto para aprovação. Por favor, revise as informações abaixo e nos dê seu feedback.
            </p>
          </div>

          {/* Informações do Projeto */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Localização</h3>
              <p className="text-sm text-gray-600">{BRIEFING_APROVACAO.projeto.localização}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Área Prevista</h3>
              <p className="text-sm text-gray-600">{BRIEFING_APROVACAO.projeto.areaPrevista}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Valor</h3>
              <p className="text-sm text-gray-600">{BRIEFING_APROVACAO.projeto.valorEstimado}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Prazo</h3>
              <p className="text-sm text-gray-600">{BRIEFING_APROVACAO.projeto.prazoEntrega}</p>
            </div>
          </div>

          {/* Progresso */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Completude do Briefing</h3>
              <span className="text-sm font-bold text-gray-900">
                {BRIEFING_APROVACAO.respostasCompletas}/{BRIEFING_APROVACAO.respostasTotal} respostas
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${BRIEFING_APROVACAO.progresso}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {BRIEFING_APROVACAO.progresso}% completo
            </p>
          </div>
        </motion.div>

        {/* Resumo das Seções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              📋 Resumo do Briefing
            </h3>
            <button
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{mostrarDetalhes ? 'Ocultar' : 'Ver'} Detalhes</span>
            </button>
          </div>

          <div className="space-y-4">
            {RESUMO_SECOES.map((secao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-2xl border-l-4 border-blue-500 ${
                  mostrarDetalhes ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{secao.nome}</h4>
                <p className="text-gray-700">{secao.resumo}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seção de Aprovação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Sua Aprovação
          </h3>

          {/* Comentários */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comentários ou Observações (opcional)
            </label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Compartilhe suas ideias, dúvidas ou sugestões sobre o projeto..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Seus comentários nos ajudam a entregar exatamente o que você deseja
            </p>
          </div>

          {/* Botões de Aprovação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleAprovacao('aprovado')}
              disabled={enviandoResposta}
              className={`flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none ${
                enviandoResposta ? 'animate-pulse' : ''
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">
                {enviandoResposta ? 'Enviando...' : 'Aprovar Briefing'}
              </span>
            </button>
            
            <button
              onClick={() => handleAprovacao('rejeitado')}
              disabled={enviandoResposta}
              className={`flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none ${
                enviandoResposta ? 'animate-pulse' : ''
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">
                {enviandoResposta ? 'Enviando...' : 'Solicitar Ajustes'}
              </span>
            </button>
          </div>

          {/* Informações de Segurança */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>
                Este link é único e seguro. Válido até {BRIEFING_APROVACAO.tempoLimite}.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Dúvidas? Entre em contato: {BRIEFING_APROVACAO.escritorio.contato} | contato@costaarquitetura.com
          </p>
          <p className="text-xs mt-2">
            © 2024 {BRIEFING_APROVACAO.escritorio.nome} - Powered by ArcFlow
          </p>
        </div>
      </div>
    </div>
  )
} 