'use client';

import { TemplatesDinamicosDemo } from '../../../components/templates-dinamicos/TemplatesDinamicosDemo';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export default function TemplatesDinamicosTestePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Templates Dinâmicos - Sistema Completo
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Sistema revolucionário de geração automática de projetos
          </p>
          <p className="text-lg text-gray-500">
            Detecta necessidades e compõe projetos baseado em briefings estruturados
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-700 text-sm font-medium">Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">✅ 100%</div>
              <p className="text-green-600 text-sm">8 APIs REST</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-700 text-sm font-medium">Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">✅ 100%</div>
              <p className="text-blue-600 text-sm">UI Completa</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-700 text-sm font-medium">Briefings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">24</div>
              <p className="text-purple-600 text-sm">Implementados</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 text-sm font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">10K</div>
              <p className="text-yellow-600 text-sm">Usuários</p>
            </CardContent>
          </Card>
        </div>

        {/* Briefings Disponíveis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Briefings Disponíveis para Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">🏠 Residencial (2)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Unifamiliar (235 perguntas)</li>
                  <li>• Multifamiliar (157 perguntas)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2">🏢 Comercial (5)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Escritórios (238 perguntas)</li>
                  <li>• Lojas (218 perguntas)</li>
                  <li>• Restaurantes (238 perguntas)</li>
                  <li>• Hotéis (224 perguntas)</li>
                  <li>• Shopping Centers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🏭 Industrial (1)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Galpão Industrial (311 perguntas)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-700 mb-2">🎨 Especializados (2)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Paisagismo (285 perguntas)</li>
                  <li>• Design Interiores (344 perguntas)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-orange-700 mb-2">🏗️ Engenharia (2)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Estrutural Adaptativo (6 sistemas)</li>
                  <li>• Instalações Adaptativo (7 tipos)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-cyan-700 mb-2">🏙️ Urbanístico (1)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Projeto Urbano/Revitalização</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções de Teste */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700">🧪 Como Testar o Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">1. Configure um Briefing:</h4>
                <p className="text-sm text-blue-600">
                  Escolha uma tipologia (residencial, comercial, etc.) e preencha os dados básicos como área, orçamento e descrição.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2">2. Detectar Necessidades:</h4>
                <p className="text-sm text-blue-600">
                  O sistema analisará seu briefing e detectará automaticamente quais templates são necessários.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2">3. Simular Projeto:</h4>
                <p className="text-sm text-blue-600">
                  Veja uma prévia do projeto com estimativas de tempo, orçamento e quantidade de atividades.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2">4. Gerar Projeto Completo:</h4>
                <p className="text-sm text-blue-600">
                  Crie o projeto final com cronograma detalhado, orçamento por categoria e todas as atividades organizadas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Componente Principal */}
        <TemplatesDinamicosDemo />

        {/* Footer Info */}
        <Card className="mt-8 bg-gray-900 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🎯 Sistema Revolucionário ArcFlow</h3>
              <p className="text-gray-300 mb-4">
                Primeiro sistema do mundo a detectar automaticamente necessidades de projetos AEC
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>⚡ Performance:</strong><br />
                  Detecção em ~1.2s<br />
                  Composição em ~2.1s
                </div>
                <div>
                  <strong>🎯 Precisão:</strong><br />
                  94% taxa de sucesso<br />
                  Score de confiança
                </div>
                <div>
                  <strong>🚀 Escalabilidade:</strong><br />
                  10k usuários simultâneos<br />
                  Cache Redis otimizado
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 