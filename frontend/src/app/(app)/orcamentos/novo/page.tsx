'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, Calculator, FileText, Clock, DollarSign, 
  Users, CheckCircle, Edit3, Save, Plus, Minus,
  Home, Briefcase, Settings, Eye, Download,
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  Search, Filter, User, Calendar, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/contexts/ThemeContext'
import { useConfiguracaoPrecificacao } from '@/services/configuracaoPrecificacao'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// 🎯 TIPOS DE ORÇAMENTO
type TipoOrcamento = 'residencial' | 'comercial'

// 📊 INTERFACE PRINCIPAL
interface OrcamentoState {
  tipo: TipoOrcamento
  etapaAtual: number
  dadosBasicos: any
  disciplinasSelecionadas: string[]
  parametrosPersonalizados: Record<string, any>
  orcamentoGerado: any
}

// 💰 VALORES BASE POR REGIÃO (R$/m²)
const VALORES_BASE_REGIAO = {
  norte: { multiplicador: 0.85, nome: 'Norte' },
  nordeste: { multiplicador: 0.90, nome: 'Nordeste' },
  centro_oeste: { multiplicador: 0.95, nome: 'Centro-Oeste' },
  sudeste: { multiplicador: 1.15, nome: 'Sudeste' },
  sul: { multiplicador: 1.05, nome: 'Sul' }
}

// 🏠 PADRÕES CONSTRUTIVOS
const PADROES_CONSTRUTIVOS = {
  simples: { multiplicador: 0.7, nome: 'Simples', descricao: 'Acabamentos básicos, sem complexidade' },
  medio: { multiplicador: 1.0, nome: 'Médio', descricao: 'Acabamentos intermediários, complexidade média' },
  alto: { multiplicador: 1.4, nome: 'Alto', descricao: 'Acabamentos superiores, alta complexidade' },
  luxo: { multiplicador: 1.8, nome: 'Luxo', descricao: 'Acabamentos premium, máxima complexidade' },
  premium: { multiplicador: 2.5, nome: 'Premium', descricao: 'Acabamentos exclusivos, projeto único' }
}

// 🏗️ DISCIPLINAS MOCK (simplificado para demonstração)
const DISCIPLINAS_RESIDENCIAL = [
  {
    id: 'arquitetura',
    nome: 'Projeto Arquitetônico',
    descricao: 'Concepção, desenvolvimento e detalhamento do projeto arquitetônico completo',
    responsavelTecnico: 'Arquiteto e Urbanista',
    crea_cau: 'CAU',
    horasEstimadas: 110,
    valorHorasTecnicas: 150,
    fases: [
      {
        id: 'lv_arq',
        nome: 'Levantamento de Dados',
        sigla: 'LV',
        descricao: 'Levantamento topográfico, cadastral, legal e programa de necessidades',
        duracaoDias: 7,
        horasTecnicas: 18,
        percentualProjeto: 5,
        atividades: [
          {
            id: 'lv_001',
            nome: 'Análise do Terreno',
            descricao: 'Levantamento topográfico, orientação solar, ventos dominantes',
            responsavel: 'arquiteto',
            horasEstimadas: 8,
            produtos: ['Relatório de Análise do Terreno']
          }
        ]
      }
    ]
  },
  {
    id: 'estrutural',
    nome: 'Projeto Estrutural',
    descricao: 'Dimensionamento e detalhamento da estrutura em concreto armado',
    responsavelTecnico: 'Engenheiro Civil',
    crea_cau: 'CREA',
    horasEstimadas: 88,
    valorHorasTecnicas: 180,
    fases: [
      {
        id: 'pe_est',
        nome: 'Projeto Estrutural Executivo',
        sigla: 'PE',
        descricao: 'Dimensionamento e detalhamento completo da estrutura',
        duracaoDias: 21,
        horasTecnicas: 32,
        percentualProjeto: 90,
        atividades: [
          {
            id: 'pe_est_001',
            nome: 'Cálculo Estrutural',
            descricao: 'Dimensionamento de vigas, pilares, lajes e fundações',
            responsavel: 'engenheiro',
            horasEstimadas: 32,
            produtos: ['Memorial de Cálculo']
          }
        ]
      }
    ]
  }
]

const DISCIPLINAS_COMERCIAL = [
  {
    id: 'arquitetura_comercial',
    nome: 'Projeto Arquitetônico Comercial',
    descricao: 'Concepção e desenvolvimento de projeto arquitetônico para uso comercial',
    responsavelTecnico: 'Arquiteto e Urbanista',
    crea_cau: 'CAU',
    horasEstimadas: 186,
    valorHorasTecnicas: 160,
    fases: [
      {
        id: 'lv_arq_com',
        nome: 'Levantamento e Análise Comercial',
        sigla: 'LV',
        descricao: 'Levantamento específico para projetos comerciais',
        duracaoDias: 10,
        horasTecnicas: 30,
        percentualProjeto: 8,
        atividades: [
          {
            id: 'lv_com_001',
            nome: 'Análise do Negócio',
            descricao: 'Estudo do tipo de negócio, fluxo de clientes',
            responsavel: 'arquiteto',
            horasEstimadas: 12,
            produtos: ['Relatório de Análise do Negócio']
          }
        ]
      }
    ]
  }
]

export default function NovoOrcamentoPage() {
  const { tema, temaId } = useTheme()
  const { configuracao, calcularOrcamento, disciplinasAtivas } = useConfiguracaoPrecificacao()
  
  const [state, setState] = useState<OrcamentoState>({
    tipo: 'residencial',
    etapaAtual: 1,
    dadosBasicos: {
      nomeCliente: '',
      nomeProjeto: '',
      areaConstruida: 150,
      regiao: 'sul',
      padraoConstrucao: 'medio'
    },
    disciplinasSelecionadas: ['arquitetura'],
    parametrosPersonalizados: {},
    orcamentoGerado: null
  })

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [editMode, setEditMode] = useState<Record<string, boolean>>({})
  const [dadosBriefing, setDadosBriefing] = useState<any>(null)
  const [briefingsDisponiveis, setBriefingsDisponiveis] = useState<any[]>([])
  const [loadingBriefings, setLoadingBriefings] = useState(false)
  const [mostrarBriefings, setMostrarBriefings] = useState(false)

  // 🔄 CARREGAR DADOS DO BRIEFING (se disponível)
  useEffect(() => {
    const carregarDadosBriefing = () => {
      try {
        const dados = localStorage.getItem('dados_para_orcamento')
        if (dados) {
          const briefingData = JSON.parse(dados)
          setDadosBriefing(briefingData)
          
          // Pré-preencher dados básicos com informações do briefing
          setState(prev => ({
            ...prev,
            dadosBasicos: {
              ...prev.dadosBasicos,
              nomeCliente: briefingData.cliente?.nome || '',
              nomeProjeto: `${briefingData.nome || 'Projeto'} - ${briefingData.cliente?.nome || 'Cliente'}`,
              areaConstruida: briefingData.dadosOrcamento?.areaConstruida || briefingData.respostas?.dados_basicos_area_terreno || 150,
              regiao: 'sudeste', // Pode ser extraído do endereço do cliente
              padraoConstrucao: briefingData.padrao === 'simples_padrao' ? 'simples' : 
                               briefingData.padrao === 'medio_padrao' ? 'medio' : 'alto'
            }
          }))
          
          console.log('✅ Dados do briefing carregados no orçamento:', briefingData)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do briefing:', error)
      }
    }
    
    carregarDadosBriefing()
  }, [])

  // 🆕 CARREGAR BRIEFINGS DISPONÍVEIS
  const carregarBriefingsDisponiveis = async () => {
    setLoadingBriefings(true)
    try {
      const token = localStorage.getItem('arcflow_auth_token')
      const response = await fetch('http://localhost:3001/api/orcamentos/briefings-disponiveis', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBriefingsDisponiveis(data.briefings || [])
        console.log('✅ Briefings disponíveis carregados:', data.briefings?.length)
      } else {
        throw new Error('Erro ao carregar briefings')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar briefings:', error)
      toast.error('Erro ao carregar briefings disponíveis')
    } finally {
      setLoadingBriefings(false)
    }
  }

  // 🆕 GERAR ORÇAMENTO A PARTIR DO BRIEFING
  const gerarOrcamentoDoBriefing = async (briefingId: string) => {
    try {
      const token = localStorage.getItem('arcflow_auth_token')
      const response = await fetch(`http://localhost:3001/api/orcamentos/gerar-briefing/${briefingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Orçamento gerado com sucesso!')
        // Redirecionar para o orçamento criado
        window.location.href = `/orcamentos/${data.id}`
      } else {
        const errorData = await response.text()
        throw new Error(errorData || 'Erro ao gerar orçamento')
      }
    } catch (error) {
      console.error('❌ Erro ao gerar orçamento:', error)
      toast.error('Erro ao gerar orçamento do briefing')
    }
  }

  // 🎨 TEMA DINÂMICO
  const corPrimaria = state.tipo === 'residencial' ? 'blue' : 'purple'
  const gradiente = state.tipo === 'residencial' 
    ? 'from-blue-600 to-blue-700' 
    : 'from-purple-600 to-purple-700'

  // 💰 CALCULAR ORÇAMENTO DINÂMICO
  const orcamentoCalculado = calcularOrcamento({
    areaConstruida: state.dadosBasicos.areaConstruida || 150,
    regiao: state.dadosBasicos.regiao || 'sul',
    padraoConstrucao: state.dadosBasicos.padraoConstrucao || 'medio',
    disciplinasSelecionadas: state.disciplinasSelecionadas
  })

  // 📄 FUNÇÃO PARA ABRIR DOCUMENTO COMPLETO
  const abrirDocumentoCompleto = () => {
    const documentoCompleto = gerarDocumentoCompleto()
    const novaJanela = window.open('', '_blank', 'width=1200,height=800')
    if (novaJanela) {
      novaJanela.document.write(documentoCompleto)
      novaJanela.document.close()
    }
  }

  // 📋 GERAR DOCUMENTO COMPLETO
  const gerarDocumentoCompleto = () => {
    const tipoTexto = state.tipo === 'residencial' ? 'Residencial' : 'Comercial'
    
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orçamento Profissional ArcFlow - Projeto ${tipoTexto}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background: #f8fafc; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
        .subtitle { color: #64748b; font-size: 18px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 20px; border-left: 4px solid #3b82f6; padding-left: 16px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .info-card { background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .info-label { font-weight: bold; color: #475569; margin-bottom: 5px; }
        .info-value { color: #1e293b; font-size: 18px; }
        .disciplina { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .disciplina-header { font-weight: bold; color: #1e293b; font-size: 18px; margin-bottom: 10px; }
        .disciplina-desc { color: #64748b; margin-bottom: 15px; }
        .fase { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 10px; }
        .fase-header { font-weight: bold; color: #475569; margin-bottom: 8px; }
        .atividade { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .valor-destaque { font-size: 28px; font-weight: bold; color: #059669; text-align: center; background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cronograma { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .cronograma-item { background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center; }
        .observacoes { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; }
        .print-only { display: none; }
        @media print { .print-only { display: block; } }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- CABEÇALHO -->
        <div class="header">
          <div class="logo">🏗️ ARCFLOW</div>
          <div class="subtitle">Sistema Profissional de Orçamentação AEC</div>
          <div style="margin-top: 20px; color: #64748b;">
            Orçamento Técnico Detalhado - Projeto ${tipoTexto}
          </div>
        </div>

        <!-- DADOS DO PROJETO -->
        <div class="section">
          <div class="section-title">📋 Dados do Projeto</div>
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">Cliente</div>
              <div class="info-value">João Silva</div>
            </div>
            <div class="info-card">
              <div class="info-label">Projeto</div>
              <div class="info-value">Casa ${tipoTexto} - 150m²</div>
            </div>
            <div class="info-card">
              <div class="info-label">Localização</div>
              <div class="info-value">Região Sul - Curitiba/PR</div>
            </div>
            <div class="info-card">
              <div class="info-label">Área Construída</div>
              <div class="info-value">150,00 m²</div>
            </div>
            <div class="info-card">
              <div class="info-label">Padrão Construtivo</div>
              <div class="info-value">Médio Padrão</div>
            </div>
            <div class="info-card">
              <div class="info-label">Prazo Estimado</div>
              <div class="info-value">127 dias úteis</div>
            </div>
          </div>
        </div>

                 <!-- VALOR TOTAL -->
         <div class="valor-destaque">
           💰 VALOR TOTAL: R$ 15.600,00 (R$ 104,00/m²)
         </div>

        <!-- MEMORIAL DESCRITIVO -->
        <div class="section">
          <div class="section-title">📖 Memorial Descritivo NBR</div>
          <p><strong>1. INTRODUÇÃO:</strong> O presente memorial descritivo tem por objetivo apresentar as diretrizes técnicas para o desenvolvimento do projeto ${tipoTexto.toLowerCase()}, em conformidade com as normas NBR 13531 e NBR 13532.</p>
          
          <p><strong>2. METODOLOGIA:</strong> O projeto será desenvolvido seguindo metodologia consolidada em 30+ anos de experiência AEC, estruturada nas fases: LV (Levantamento), EP (Estudo Preliminar), AP (Anteprojeto), PE (Projeto Executivo) e AS (Acompanhamento de Serviços).</p>
          
          <p><strong>3. RESPONSABILIDADE TÉCNICA:</strong> Todos os projetos serão desenvolvidos por profissionais habilitados junto ao CAU (Conselho de Arquitetura e Urbanismo) e CREA (Conselho Regional de Engenharia e Agronomia).</p>
        </div>

        <!-- DISCIPLINAS DETALHADAS -->
        <div class="section">
          <div class="section-title">🏗️ Disciplinas e Escopo Técnico</div>
          
          <div class="disciplina">
            <div class="disciplina-header">🏠 PROJETO ARQUITETÔNICO - R$ 11.250,00 (R$ 75,00/m²)</div>
            <div class="disciplina-desc">Concepção, desenvolvimento e detalhamento do projeto arquitetônico completo</div>
            <div class="fase">
              <div class="fase-header">LV - Levantamento de Dados (7 dias)</div>
              <div class="atividade">• Análise do terreno e condicionantes legais</div>
              <div class="atividade">• Programa de necessidades detalhado</div>
              <div class="atividade">• Estudo de viabilidade técnica</div>
            </div>
            <div class="fase">
              <div class="fase-header">EP - Estudo Preliminar (14 dias)</div>
              <div class="atividade">• Concepção arquitetônica e partido</div>
              <div class="atividade">• Plantas baixas preliminares</div>
              <div class="atividade">• Volumetria e implantação</div>
            </div>
            <div class="fase">
              <div class="fase-header">AP - Anteprojeto (21 dias)</div>
              <div class="atividade">• Plantas baixas definitivas cotadas</div>
              <div class="atividade">• Cortes e fachadas detalhadas</div>
              <div class="atividade">• Memorial descritivo e especificações</div>
            </div>
            <div class="fase">
              <div class="fase-header">PE - Projeto Executivo (35 dias)</div>
              <div class="atividade">• Detalhamento construtivo completo</div>
              <div class="atividade">• Plantas de layout e mobiliário</div>
              <div class="atividade">• Caderno de especificações técnicas</div>
            </div>
          </div>

          <div class="disciplina">
            <div class="disciplina-header">🎨 MODELAGEM 3D + 6 RENDERIZAÇÕES - R$ 2.550,00 (R$ 17,00/m²)</div>
            <div class="disciplina-desc">Modelagem tridimensional e renderizações fotorrealísticas</div>
            <div class="fase">
              <div class="fase-header">Modelagem 3D Completa (10 dias)</div>
              <div class="atividade">• Modelo 3D detalhado da edificação</div>
              <div class="atividade">• Aplicação de materiais e texturas</div>
              <div class="atividade">• Configuração de iluminação natural</div>
            </div>
            <div class="fase">
              <div class="fase-header">Renderizações (7 dias)</div>
              <div class="atividade">• 6 renderizações fotorrealísticas</div>
              <div class="atividade">• Vistas externas e internas</div>
              <div class="atividade">• Pós-produção e tratamento</div>
            </div>
          </div>

          <div class="disciplina">
            <div class="disciplina-header">📋 APROVAÇÃO PREFEITURA + ALVARÁ - R$ 1.800,00 (R$ 12,00/m²)</div>
            <div class="disciplina-desc">Processo completo de aprovação legal e obtenção de alvará</div>
            <div class="fase">
              <div class="fase-header">Documentação Legal (14 dias)</div>
              <div class="atividade">• Adequação às normas municipais</div>
              <div class="atividade">• Preparação da documentação</div>
              <div class="atividade">• Protocolo na prefeitura</div>
            </div>
            <div class="fase">
              <div class="fase-header">Acompanhamento (30 dias)</div>
              <div class="atividade">• Acompanhamento do processo</div>
              <div class="atividade">• Atendimento às exigências</div>
              <div class="atividade">• Obtenção do alvará de construção</div>
            </div>
          </div>
        </div>

        <!-- CRONOGRAMA FÍSICO-FINANCEIRO -->
        <div class="section">
          <div class="section-title">📅 Cronograma Físico-Financeiro</div>
          <div class="cronograma">
            <div class="cronograma-item">
              <strong>Fase 1 - LV</strong><br>
              7 dias<br>
              R$ 780,00 (5%)
            </div>
            <div class="cronograma-item">
              <strong>Fase 2 - EP</strong><br>
              14 dias<br>
              R$ 2.340,00 (15%)
            </div>
            <div class="cronograma-item">
              <strong>Fase 3 - AP</strong><br>
              21 dias<br>
              R$ 4.680,00 (30%)
            </div>
            <div class="cronograma-item">
              <strong>Fase 4 - PE</strong><br>
              35 dias<br>
              R$ 7.800,00 (50%)
            </div>
          </div>
        </div>

        <!-- CONDIÇÕES COMERCIAIS -->
        <div class="section">
          <div class="section-title">💼 Condições Comerciais</div>
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">Forma de Pagamento</div>
              <div class="info-value">Conforme cronograma físico</div>
            </div>
            <div class="info-card">
              <div class="info-label">Validade da Proposta</div>
              <div class="info-value">30 dias</div>
            </div>
            <div class="info-card">
              <div class="info-label">Garantia dos Serviços</div>
              <div class="info-value">12 meses</div>
            </div>
            <div class="info-card">
              <div class="info-label">Reajuste</div>
              <div class="info-value">INCC-DI (FGV)</div>
            </div>
          </div>
        </div>

        <!-- OBSERVAÇÕES IMPORTANTES -->
        <div class="observacoes">
          <div class="section-title" style="border: none; margin-bottom: 15px;">⚠️ Observações Importantes</div>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Valores baseados em pesquisa de mercado região Sul (2024)</li>
            <li>Projeto desenvolvido conforme NBR 13531/13532</li>
            <li>Responsabilidade técnica: CAU/CREA</li>
            <li>Alterações no escopo podem impactar prazo e valor</li>
            <li>Não inclui taxas de aprovação em órgãos públicos</li>
            <li>Revisões ilimitadas até aprovação do cliente</li>
          </ul>
        </div>

        <!-- RODAPÉ -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b;">
          <p><strong>ARCFLOW - Sistema Profissional de Orçamentação AEC</strong></p>
          <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  // 📝 FORMULÁRIO DADOS BÁSICOS
  const renderFormularioDadosBasicos = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${tema.card} rounded-2xl shadow-xl border ${
        temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
      } p-8`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-xl bg-${corPrimaria}-100 dark:bg-${corPrimaria}-900/20`}>
          {state.tipo === 'residencial' ? (
            <Home className={`w-6 h-6 text-${corPrimaria}-600`} />
          ) : (
            <Building2 className={`w-6 h-6 text-${corPrimaria}-600`} />
          )}
        </div>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${tema.text}`}>
            Dados do Projeto {state.tipo === 'residencial' ? 'Residencial' : 'Comercial'}
          </h2>
          <p className={`${tema.textSecondary}`}>
            Preencha as informações básicas para gerar o orçamento profissional
          </p>
          {dadosBriefing && (
            <div className="flex items-center gap-2 mt-2">
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                ✅ Dados importados do Briefing: {dadosBriefing.cliente?.nome}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identificação */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${tema.text} mb-4`}>Identificação</h3>
          
          <div>
            <label className={`block text-sm font-medium ${tema.text} mb-2`}>
              Nome do Cliente *
            </label>
            <Input
              placeholder="Ex: João Silva"
              className="w-full"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${tema.text} mb-2`}>
              Nome do Projeto *
            </label>
            <Input
              placeholder={state.tipo === 'residencial' ? 'Ex: Residência Silva' : 'Ex: Escritório Advocacia'}
              className="w-full"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${tema.text} mb-2`}>
              Endereço
            </label>
            <Input
              placeholder="Rua, número, bairro, cidade"
              className="w-full"
            />
          </div>
        </div>

        {/* Características Técnicas */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${tema.text} mb-4`}>Características Técnicas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Área Construída (m²) *
              </label>
              <Input
                type="number"
                placeholder="180"
                className="w-full"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Área do Terreno (m²)
              </label>
              <Input
                type="number"
                placeholder="300"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                Número de Pavimentos
              </label>
              <select className={`w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ${tema.text}`}>
                <option value="1">1 Pavimento</option>
                <option value="2">2 Pavimentos</option>
                <option value="3">3 Pavimentos</option>
                <option value="4">4+ Pavimentos</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${tema.text} mb-2`}>
                {state.tipo === 'residencial' ? 'Número de Quartos' : 'Número de Salas'}
              </label>
              <Input
                type="number"
                placeholder={state.tipo === 'residencial' ? '3' : '8'}
                className="w-full"
              />
            </div>
          </div>

          {/* Padrão Construtivo */}
          <div>
            <label className={`block text-sm font-medium ${tema.text} mb-2`}>
              Padrão Construtivo *
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PADROES_CONSTRUTIVOS).map(([key, padrao]) => (
                <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    name="padrao"
                    value={key}
                    className={`text-${corPrimaria}-600`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${tema.text}`}>{padrao.nome}</span>
                      <span className={`text-sm ${tema.textSecondary}`}>
                        {padrao.multiplicador}x
                      </span>
                    </div>
                    <p className={`text-xs ${tema.textSecondary}`}>{padrao.descricao}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Região */}
          <div>
            <label className={`block text-sm font-medium ${tema.text} mb-2`}>
              Região *
            </label>
            <select className={`w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ${tema.text}`}>
              {Object.entries(VALORES_BASE_REGIAO).map(([key, regiao]) => (
                <option key={key} value={key}>
                  {regiao.nome} ({regiao.multiplicador}x)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button 
          className={`bg-${corPrimaria}-600 hover:bg-${corPrimaria}-700 text-white`}
          onClick={() => setState(prev => ({ ...prev, etapaAtual: 2 }))}
        >
          Próximo: Disciplinas
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  )

  // 🏗️ SELEÇÃO DE DISCIPLINAS
  const renderSelecaoDisciplinas = () => {
    const disciplinas = state.tipo === 'residencial' ? DISCIPLINAS_RESIDENCIAL : DISCIPLINAS_COMERCIAL

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${tema.card} rounded-2xl shadow-xl border ${
          temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
        } p-8`}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl bg-${corPrimaria}-100 dark:bg-${corPrimaria}-900/20`}>
            <Settings className={`w-6 h-6 text-${corPrimaria}-600`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${tema.text}`}>
              Disciplinas do Projeto
            </h2>
            <p className={`${tema.textSecondary}`}>
              Selecione as disciplinas que farão parte do projeto
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {disciplinas.map((disciplina) => (
            <motion.div
              key={disciplina.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    className={`mt-1 text-${corPrimaria}-600`}
                    defaultChecked={disciplina.id === 'arquitetura' || disciplina.id === 'arquitetura_comercial'}
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${tema.text} mb-2`}>
                      {disciplina.nome}
                    </h3>
                    <p className={`${tema.textSecondary} mb-4`}>
                      {disciplina.descricao}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className={`font-medium ${tema.text}`}>Responsável:</span>
                        <span className={`ml-2 ${tema.textSecondary}`}>
                          {disciplina.responsavelTecnico}
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${tema.text}`}>Registro:</span>
                        <span className={`ml-2 ${tema.textSecondary}`}>
                          {disciplina.crea_cau}
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${tema.text}`}>Horas Estimadas:</span>
                        <span className={`ml-2 ${tema.textSecondary}`}>
                          {disciplina.horasEstimadas}h
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${tema.text}`}>Valor/Hora:</span>
                        <span className={`ml-2 ${tema.textSecondary}`}>
                          R$ {disciplina.valorHorasTecnicas}
                        </span>
                      </div>
                    </div>

                    {/* Fases da Disciplina */}
                    <div className="mt-4">
                      <button
                        onClick={() => setExpandedSections(prev => ({
                          ...prev,
                          [disciplina.id]: !prev[disciplina.id]
                        }))}
                        className={`flex items-center gap-2 text-sm font-medium ${tema.text} hover:text-${corPrimaria}-600`}
                      >
                        {expandedSections[disciplina.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        Ver Fases e Atividades ({disciplina.fases.length} fases)
                      </button>

                      <AnimatePresence>
                        {expandedSections[disciplina.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3"
                          >
                            {disciplina.fases.map((fase) => (
                              <div key={fase.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`font-medium ${tema.text}`}>
                                    {fase.sigla} - {fase.nome}
                                  </h4>
                                  <span className={`text-xs px-2 py-1 rounded-full bg-${corPrimaria}-100 text-${corPrimaria}-700`}>
                                    {fase.percentualProjeto}% do projeto
                                  </span>
                                </div>
                                <p className={`text-sm ${tema.textSecondary} mb-3`}>
                                  {fase.descricao}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className={`font-medium ${tema.text}`}>Duração:</span>
                                    <span className={`ml-1 ${tema.textSecondary}`}>
                                      {fase.duracaoDias} dias
                                    </span>
                                  </div>
                                  <div>
                                    <span className={`font-medium ${tema.text}`}>Horas Técnicas:</span>
                                    <span className={`ml-1 ${tema.textSecondary}`}>
                                      {fase.horasTecnicas}h
                                    </span>
                                  </div>
                                </div>

                                {/* Atividades da Fase */}
                                <div className="mt-3 space-y-2">
                                  {fase.atividades.map((atividade) => (
                                    <div key={atividade.id} className="flex items-start gap-2">
                                      <CheckCircle className={`w-3 h-3 mt-0.5 text-${corPrimaria}-500`} />
                                      <div className="flex-1">
                                        <span className={`text-xs font-medium ${tema.text}`}>
                                          {atividade.nome}
                                        </span>
                                        <p className={`text-xs ${tema.textSecondary}`}>
                                          {atividade.descricao}
                                        </p>
                                      </div>
                                      <span className={`text-xs ${tema.textSecondary}`}>
                                        {atividade.horasEstimadas}h
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold text-${corPrimaria}-600`}>
                    R$ {(disciplina.horasEstimadas * disciplina.valorHorasTecnicas).toLocaleString('pt-BR')}
                  </div>
                  <div className={`text-xs ${tema.textSecondary}`}>
                    Valor estimado
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
          <Button 
            variant="outline"
            onClick={() => setState(prev => ({ ...prev, etapaAtual: 1 }))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button 
            className={`bg-${corPrimaria}-600 hover:bg-${corPrimaria}-700 text-white`}
            onClick={() => setState(prev => ({ ...prev, etapaAtual: 3 }))}
          >
            Próximo: Gerar Orçamento
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    )
  }

  // 📊 ORÇAMENTO GERADO
  const renderOrcamentoGerado = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Resumo Executivo */}
      <div className={`${tema.card} rounded-2xl shadow-xl border ${
        temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
      } p-8`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${tema.text} mb-2`}>
            Orçamento Profissional AEC
          </h1>
          <p className={`text-lg ${tema.textSecondary}`}>
            Projeto {state.tipo === 'residencial' ? 'Residencial' : 'Comercial'} - Metodologia NBR
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`text-center p-6 rounded-xl bg-${corPrimaria}-50 dark:bg-${corPrimaria}-900/20`}>
            <DollarSign className={`w-8 h-8 text-${corPrimaria}-600 mx-auto mb-2`} />
            <div className={`text-2xl font-bold text-${corPrimaria}-600 mb-1`}>
              R$ 15.600,00
            </div>
            <div className={`text-sm ${tema.textSecondary}`}>
              Valor Total do Projeto
            </div>
          </div>

          <div className={`text-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20`}>
            <Calculator className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              R$ 104,00/m²
            </div>
            <div className={`text-sm ${tema.textSecondary}`}>
              Valor por Metro Quadrado
            </div>
          </div>

          <div className={`text-center p-6 rounded-xl bg-orange-50 dark:bg-orange-900/20`}>
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600 mb-1">
              127 dias
            </div>
            <div className={`text-sm ${tema.textSecondary}`}>
              Prazo Total Estimado
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button className={`bg-${corPrimaria}-600 hover:bg-${corPrimaria}-700 text-white`}>
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
          <Button 
            variant="outline"
            onClick={() => abrirDocumentoCompleto()}
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar Completo
          </Button>
        </div>
      </div>

      {/* Memorial Descritivo */}
      <div className={`${tema.card} rounded-2xl shadow-xl border ${
        temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
      } p-8`}>
        <h2 className={`text-2xl font-bold ${tema.text} mb-6`}>
          Memorial Descritivo do Projeto
        </h2>

        <div className="prose max-w-none">
          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${tema.text} mb-3`}>1. Introdução</h3>
            <p className={`${tema.textSecondary} leading-relaxed`}>
              O presente memorial descritivo tem por objetivo apresentar as diretrizes técnicas, 
              metodológicas e executivas para o desenvolvimento do projeto {state.tipo === 'residencial' ? 'residencial' : 'comercial'}, 
              em conformidade com as normas brasileiras NBR 13531 e NBR 13532, que regulamentam 
              a elaboração de projetos de edificações.
            </p>
          </div>

          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${tema.text} mb-3`}>2. Objetivos do Projeto</h3>
            <ul className={`${tema.textSecondary} space-y-2`}>
              <li>• Desenvolver projeto arquitetônico completo e suas disciplinas complementares</li>
              <li>• Garantir conformidade com legislações municipais e normas técnicas</li>
              <li>• Otimizar funcionalidade, conforto e eficiência energética</li>
              <li>• Assegurar qualidade técnica e viabilidade construtiva</li>
              <li>• Fornecer documentação completa para execução da obra</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${tema.text} mb-3`}>3. Metodologia de Trabalho</h3>
            <p className={`${tema.textSecondary} leading-relaxed mb-4`}>
              O desenvolvimento do projeto seguirá metodologia consolidada em 30+ anos de experiência 
              em escritórios AEC, estruturada nas seguintes fases:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className={`font-semibold ${tema.text} mb-2`}>LV - Levantamento</h4>
                <p className={`text-sm ${tema.textSecondary}`}>
                  Coleta e análise de dados técnicos, legais e funcionais
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className={`font-semibold ${tema.text} mb-2`}>EP - Estudo Preliminar</h4>
                <p className={`text-sm ${tema.textSecondary}`}>
                  Concepção inicial e definição do partido arquitetônico
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className={`font-semibold ${tema.text} mb-2`}>AP - Anteprojeto</h4>
                <p className={`text-sm ${tema.textSecondary}`}>
                  Desenvolvimento técnico para aprovações legais
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className={`font-semibold ${tema.text} mb-2`}>PE - Projeto Executivo</h4>
                <p className={`text-sm ${tema.textSecondary}`}>
                  Detalhamento completo para execução da obra
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // 🎯 SELETOR DE TIPO
  const renderSeletorTipo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${tema.card} rounded-2xl shadow-xl border ${
        temaId === 'elegante' ? 'border-gray-200' : 'border-current/10'
      } p-8 text-center`}
    >
      <h1 className={`text-3xl font-bold ${tema.text} mb-4`}>
        ⚡ Novo Orçamento
      </h1>
      <p className={`text-lg ${tema.textSecondary} mb-8`}>
        Sistema de orçamentação automática AEC
      </p>

      {/* 🆕 OPÇÕES DE CRIAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Criar do Zero</CardTitle>
            <CardDescription>
              Criar orçamento manual com dados personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setState(prev => ({ ...prev, etapaAtual: 1 }))}
            >
              Começar do Zero
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <CardTitle>Usar Briefing</CardTitle>
            <CardDescription>
              Gerar orçamento automaticamente a partir de briefing existente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                setMostrarBriefings(true)
                carregarBriefingsDisponiveis()
              }}
            >
              <Target className="w-4 h-4 mr-2" />
              Ver Briefings
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-70">
          <CardHeader className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <CardTitle>Importar Dados</CardTitle>
            <CardDescription>
              Importar orçamento de arquivo Excel ou sistema externo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              className="w-full"
              disabled
            >
              Em breve
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 🆕 LISTA DE BRIEFINGS DISPONÍVEIS */}
      {mostrarBriefings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Briefings Disponíveis
              </CardTitle>
              <CardDescription>
                Selecione um briefing para gerar orçamento automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBriefings ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando briefings...</p>
                </div>
              ) : briefingsDisponiveis.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Nenhum briefing disponível</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Crie um briefing concluído para gerar orçamento
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {briefingsDisponiveis.map((briefing) => (
                    <div
                      key={briefing.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {briefing.nomeProjeto}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {briefing.descricao}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {briefing.cliente?.nome}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(briefing.criadoEm).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={briefing.status === 'CONCLUIDO' ? 'default' : 'secondary'}
                          >
                            {briefing.status === 'CONCLUIDO' ? '✅ Concluído' : '✏️ Em Edição'}
                          </Badge>
                          {briefing.temOrcamento && (
                            <Badge variant="outline">
                              💰 Tem Orçamento
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/briefing/${briefing.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => gerarOrcamentoDoBriefing(briefing.id)}
                          disabled={briefing.temOrcamento}
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          {briefing.temOrcamento ? 'Já tem Orçamento' : 'Gerar Orçamento'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <p className={`text-lg ${tema.textSecondary} mb-8`}>
        Ou escolha o tipo de projeto para criar manualmente
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState(prev => ({ ...prev, tipo: 'residencial', etapaAtual: 1 }))}
          className="p-8 border-2 border-blue-200 hover:border-blue-400 rounded-xl text-left transition-all"
        >
          <Home className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-blue-600 mb-2">Projeto Residencial</h3>
          <p className="text-gray-600 mb-4">
            Casas, apartamentos, condomínios residenciais
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Arquitetura + Complementares</li>
            <li>• Estrutural + Instalações</li>
            <li>• Memorial Descritivo Completo</li>
            <li>• Cronograma Físico-Financeiro</li>
          </ul>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState(prev => ({ ...prev, tipo: 'comercial', etapaAtual: 1 }))}
          className="p-8 border-2 border-purple-200 hover:border-purple-400 rounded-xl text-left transition-all"
        >
          <Building2 className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-purple-600 mb-2">Projeto Comercial</h3>
          <p className="text-gray-600 mb-4">
            Escritórios, lojas, clínicas, restaurantes
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Arquitetura Comercial Especializada</li>
            <li>• Instalações Complexas (HVAC, Segurança)</li>
            <li>• Aprovações Múltiplas Órgãos</li>
            <li>• Design de Interiores Comercial</li>
          </ul>
        </motion.button>
      </div>
    </motion.div>
  )

  // 📊 INDICADOR DE PROGRESSO
  const renderIndicadorProgresso = () => {
    const etapas = ['Tipo', 'Dados', 'Disciplinas', 'Orçamento']
    const progresso = (state.etapaAtual / 3) * 100

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${tema.textSecondary}`}>
            Progresso do Orçamento
          </span>
          <span className={`text-sm font-medium ${tema.textSecondary}`}>
            {Math.round(progresso)}%
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${
          temaId === 'elegante' ? 'bg-gray-200' : 'bg-gray-700'
        }`}>
          <motion.div
            className={`h-full rounded-full bg-${corPrimaria}-500`}
            initial={{ width: 0 }}
            animate={{ width: `${progresso}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {etapas.map((etapa, index) => (
            <span
              key={etapa}
              className={`text-xs ${
                index <= state.etapaAtual 
                  ? `text-${corPrimaria}-600 font-medium` 
                  : tema.textSecondary
              }`}
            >
              {etapa}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${tema.bg} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {state.etapaAtual > 0 && renderIndicadorProgresso()}
        
        <AnimatePresence mode="wait">
          {state.etapaAtual === 0 && renderSeletorTipo()}
          {state.etapaAtual === 1 && renderFormularioDadosBasicos()}
          {state.etapaAtual === 2 && renderSelecaoDisciplinas()}
          {state.etapaAtual === 3 && renderOrcamentoGerado()}
        </AnimatePresence>
      </div>
    </div>
  )
}

        <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-70">
          <CardHeader className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <CardTitle>Importar Dados</CardTitle>
            <CardDescription>
              Importar orçamento de arquivo Excel ou sistema externo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              className="w-full"
              disabled
            >
              Em breve
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 🆕 LISTA DE BRIEFINGS DISPONÍVEIS */}
      {mostrarBriefings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Briefings Disponíveis
              </CardTitle>
              <CardDescription>
                Selecione um briefing para gerar orçamento automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBriefings ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando briefings...</p>
                </div>
              ) : briefingsDisponiveis.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Nenhum briefing disponível</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Crie um briefing concluído para gerar orçamento
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {briefingsDisponiveis.map((briefing) => (
                    <div
                      key={briefing.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {briefing.nomeProjeto}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {briefing.descricao}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {briefing.cliente?.nome}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(briefing.criadoEm).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={briefing.status === 'CONCLUIDO' ? 'default' : 'secondary'}
                          >
                            {briefing.status === 'CONCLUIDO' ? '✅ Concluído' : '✏️ Em Edição'}
                          </Badge>
                          {briefing.temOrcamento && (
                            <Badge variant="outline">
                              💰 Tem Orçamento
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/briefing/${briefing.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => gerarOrcamentoDoBriefing(briefing.id)}
                          disabled={briefing.temOrcamento}
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          {briefing.temOrcamento ? 'Já tem Orçamento' : 'Gerar Orçamento'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <p className={`text-lg ${tema.textSecondary} mb-8`}>
        Ou escolha o tipo de projeto para criar manualmente
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState(prev => ({ ...prev, tipo: 'residencial', etapaAtual: 1 }))}
          className="p-8 border-2 border-blue-200 hover:border-blue-400 rounded-xl text-left transition-all"
        >
          <Home className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-blue-600 mb-2">Projeto Residencial</h3>
          <p className="text-gray-600 mb-4">
            Casas, apartamentos, condomínios residenciais
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Arquitetura + Complementares</li>
            <li>• Estrutural + Instalações</li>
            <li>• Memorial Descritivo Completo</li>
            <li>• Cronograma Físico-Financeiro</li>
          </ul>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState(prev => ({ ...prev, tipo: 'comercial', etapaAtual: 1 }))}
          className="p-8 border-2 border-purple-200 hover:border-purple-400 rounded-xl text-left transition-all"
        >
          <Building2 className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-purple-600 mb-2">Projeto Comercial</h3>
          <p className="text-gray-600 mb-4">
            Escritórios, lojas, clínicas, restaurantes
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Arquitetura Comercial Especializada</li>
            <li>• Instalações Complexas (HVAC, Segurança)</li>
            <li>• Aprovações Múltiplas Órgãos</li>
            <li>• Design de Interiores Comercial</li>
          </ul>
        </motion.button>
      </div>
    </motion.div>
  )

  // 📊 INDICADOR DE PROGRESSO
  const renderIndicadorProgresso = () => {
    const etapas = ['Tipo', 'Dados', 'Disciplinas', 'Orçamento']
    const progresso = (state.etapaAtual / 3) * 100

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${tema.textSecondary}`}>
            Progresso do Orçamento
          </span>
          <span className={`text-sm font-medium ${tema.textSecondary}`}>
            {Math.round(progresso)}%
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${
          temaId === 'elegante' ? 'bg-gray-200' : 'bg-gray-700'
        }`}>
          <motion.div
            className={`h-full rounded-full bg-${corPrimaria}-500`}
            initial={{ width: 0 }}
            animate={{ width: `${progresso}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {etapas.map((etapa, index) => (
            <span
              key={etapa}
              className={`text-xs ${
                index <= state.etapaAtual 
                  ? `text-${corPrimaria}-600 font-medium` 
                  : tema.textSecondary
              }`}
            >
              {etapa}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${tema.bg} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {state.etapaAtual > 0 && renderIndicadorProgresso()}
        
        <AnimatePresence mode="wait">
          {state.etapaAtual === 0 && renderSeletorTipo()}
          {state.etapaAtual === 1 && renderFormularioDadosBasicos()}
          {state.etapaAtual === 2 && renderSelecaoDisciplinas()}
          {state.etapaAtual === 3 && renderOrcamentoGerado()}
        </AnimatePresence>
      </div>
    </div>
  )
      </div>
    </div>
  )
}