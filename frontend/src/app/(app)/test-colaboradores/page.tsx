'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Settings, TestTube } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import SeletorColaborador from '@/components/briefing/SeletorColaborador'
import { colaboradoresService, type Colaborador } from '@/services/colaboradoresService'

export default function TestColaboradoresPage() {
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null)
  const [colaboradorResponsavel, setColaboradorResponsavel] = useState<Colaborador | null>(null)
  const [colaboradorArquiteto, setColaboradorArquiteto] = useState<Colaborador | null>(null)

  const handleSelecaoColaborador = (colaborador: Colaborador | null) => {
    setColaboradorSelecionado(colaborador)
    if (colaborador) {
      toast.success(`Colaborador selecionado: ${colaborador.nome}`)
    } else {
      toast.info('Seleção de colaborador limpa')
    }
  }

  const handleSelecaoResponsavel = (colaborador: Colaborador | null) => {
    setColaboradorResponsavel(colaborador)
    if (colaborador) {
      toast.success(`Responsável selecionado: ${colaborador.nome}`)
    } else {
      toast.info('Seleção de responsável limpa')
    }
  }

  const handleSelecaoArquiteto = (colaborador: Colaborador | null) => {
    setColaboradorArquiteto(colaborador)
    if (colaborador) {
      toast.success(`Arquiteto selecionado: ${colaborador.nome}`)
    } else {
      toast.info('Seleção de arquiteto limpa')
    }
  }

  const testarAPI = async () => {
    try {
      toast.info('Testando API de colaboradores...')
      
      // Teste 1: Listar colaboradores
      const response = await colaboradoresService.listar()
      console.log('✅ Teste 1 - Listar colaboradores:', response)
      
      // Teste 2: Listar apenas ativos
      const ativos = await colaboradoresService.listarAtivos()
      console.log('✅ Teste 2 - Colaboradores ativos:', ativos)
      
      // Teste 3: Listar por role
      const arquitetos = await colaboradoresService.listarPorRole('ARCHITECT')
      console.log('✅ Teste 3 - Arquitetos:', arquitetos)
      
      toast.success(`API testada com sucesso! 
      Total: ${response.users.length} | 
      Ativos: ${ativos.length} | 
      Arquitetos: ${arquitetos.length}`)
      
    } catch (error) {
      console.error('❌ Erro no teste da API:', error)
      toast.error('Erro ao testar API: ' + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 mb-8 bg-white border-b border-gray-200"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TestTube className="w-6 h-6 text-blue-600" />
                Teste de Colaboradores
              </h1>
              <p className="text-sm text-gray-500">
                Testando o sistema de colaboradores e seleção
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={testarAPI} variant="outline">
              <TestTube className="w-4 h-4 mr-2" />
              Testar API
            </Button>
            <Link href="/configuracoes/equipe">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configurar Equipe
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Informações dos Colaboradores Selecionados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Status das Seleções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Colaborador Geral</h3>
                {colaboradorSelecionado ? (
                  <div>
                    <p className="font-medium">{colaboradorSelecionado.nome}</p>
                    <p className="text-sm text-blue-700">{colaboradorSelecionado.email}</p>
                    <Badge className="mt-1">
                      {colaboradoresService.getRoleDisplay(colaboradorSelecionado.role)}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-blue-600">Nenhum colaborador selecionado</p>
                )}
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Responsável</h3>
                {colaboradorResponsavel ? (
                  <div>
                    <p className="font-medium">{colaboradorResponsavel.nome}</p>
                    <p className="text-sm text-green-700">{colaboradorResponsavel.email}</p>
                    <Badge className="mt-1">
                      {colaboradoresService.getRoleDisplay(colaboradorResponsavel.role)}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-green-600">Nenhum responsável selecionado</p>
                )}
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Arquiteto</h3>
                {colaboradorArquiteto ? (
                  <div>
                    <p className="font-medium">{colaboradorArquiteto.nome}</p>
                    <p className="text-sm text-purple-700">{colaboradorArquiteto.email}</p>
                    <Badge className="mt-1">
                      {colaboradoresService.getRoleDisplay(colaboradorArquiteto.role)}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-purple-600">Nenhum arquiteto selecionado</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seletores de Colaboradores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Seletor Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seletor Geral de Colaboradores</CardTitle>
            </CardHeader>
            <CardContent>
              <SeletorColaborador
                colaboradorId={colaboradorSelecionado?.id}
                onSelecionar={handleSelecaoColaborador}
                label="Selecionar Colaborador"
                placeholder="Buscar por nome, email ou cargo..."
                descricao="Selecione qualquer colaborador ativo do escritório"
                apenasAtivos={true}
              />
            </CardContent>
          </Card>

          {/* Seletor de Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seletor de Responsáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <SeletorColaborador
                colaboradorId={colaboradorResponsavel?.id}
                onSelecionar={handleSelecaoResponsavel}
                label="Selecionar Responsável"
                placeholder="Buscar responsável..."
                descricao="Apenas colaboradores com funções técnicas podem ser responsáveis"
                apenasResponsaveis={true}
                apenasAtivos={true}
              />
            </CardContent>
          </Card>

          {/* Seletor por Role */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seletor por Role (Arquitetos)</CardTitle>
            </CardHeader>
            <CardContent>
              <SeletorColaborador
                colaboradorId={colaboradorArquiteto?.id}
                onSelecionar={handleSelecaoArquiteto}
                label="Selecionar Arquiteto"
                placeholder="Buscar arquiteto..."
                descricao="Apenas colaboradores com role de Arquiteto"
                rolesFiltro={['ARCHITECT']}
                apenasAtivos={true}
              />
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instruções de Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">🧪 Como testar:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Clique em "Testar API" para verificar as chamadas</li>
                  <li>• Selecione colaboradores nos diferentes seletores</li>
                  <li>• Observe as diferenças entre os filtros</li>
                  <li>• Verifique as validações de responsáveis</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">🔧 Funcionalidades testadas:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Listagem de colaboradores</li>
                  <li>• Filtros por role e status</li>
                  <li>• Busca por nome, email e cargo</li>
                  <li>• Validação de responsáveis</li>
                  <li>• Interface responsiva</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 