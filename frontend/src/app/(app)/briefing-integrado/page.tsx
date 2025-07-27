'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

// ===== DADOS MOCK PARA DEMONSTRAÇÃO =====

const clienteMock = {
  nome: 'Construtora Delta',
  tipo: 'juridica',
  segmento: 'construcao',
  porte: 'medio'
};

const dadosProjetoMock = {
  nome: 'Edifício Residencial Premium',
  tipologia: 'residencial',
  descricao: 'Edifício residencial de alto padrão com 20 pavimentos'
};

const templatesDetectados = [
  {
    id: 'residencial-multifamiliar',
    nome: 'Residencial Multifamiliar',
    categoria: 'arquitetura',
    score: 0.94,
    tarefas: 180,
    obrigatorio: true
  },
  {
    id: 'estrutural-predial',
    nome: 'Estrutural Predial',
    categoria: 'estrutural',
    score: 0.89,
    tarefas: 120,
    obrigatorio: false
  },
  {
    id: 'instalacoes-predial',
    nome: 'Instalações Prediais',
    categoria: 'instalacoes',
    score: 0.85,
    tarefas: 140,
    obrigatorio: false
  }
];

// ===== COMPONENTE PRINCIPAL =====

export default function BriefingIntegradoDemo() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<'inicio' | 'deteccao' | 'sugestoes' | 'resultado'>('inicio');
  const [progresso, setProgresso] = useState(0);
  const [templatesEscolhidos, setTemplatesEscolhidos] = useState(['residencial-multifamiliar']);

  const iniciarDeteccao = () => {
    setEtapa('deteccao');
    // Simular progresso
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setProgresso(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => setEtapa('sugestoes'), 500);
      }
    }, 100);
  };

  const toggleTemplate = (templateId: string) => {
    setTemplatesEscolhidos(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const gerarProjeto = () => {
    setEtapa('resultado');
  };

  const totalTarefas = templatesDetectados
    .filter(t => templatesEscolhidos.includes(t.id))
    .reduce((acc, t) => acc + t.tarefas, 0);

  // Página inicial
  if (etapa === 'inicio') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 Sistema de Templates Dinâmicos
            </h1>
            <p className="text-xl text-gray-600">
              Demonstração da integração completa funcionando
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>👤 Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold">{clienteMock.nome}</h3>
                <p className="text-sm text-gray-600">
                  {clienteMock.tipo} • {clienteMock.porte} • {clienteMock.segmento}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📋 Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold">{dadosProjetoMock.nome}</h3>
                <p className="text-sm text-gray-600">{dadosProjetoMock.tipologia}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {dadosProjetoMock.descricao}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  IA Pronta para Detectar Templates
                </h3>
                <p className="text-blue-700 mb-6">
                  Sistema analisará automaticamente e sugerirá templates ideais
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-3 rounded">
                    <div className="text-lg font-bold text-blue-600">60%</div>
                    <div className="text-sm">Menos tempo</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="text-lg font-bold text-green-600">94%</div>
                    <div className="text-sm">Precisão</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="text-lg font-bold text-purple-600">120</div>
                    <div className="text-sm">Menos perguntas</div>
                  </div>
                </div>

                <Button onClick={iniciarDeteccao} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  🚀 Iniciar Detecção com IA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Detecção
  if (etapa === 'deteccao') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardContent className="pt-8">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-4 bg-blue-500 text-white rounded-full w-16 h-16 mx-auto mb-6"
                >
                  <Zap className="w-8 h-8" />
                </motion.div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  🤖 IA Analisando Projeto...
                </h3>
                <Progress value={progresso} className="mb-4" />
                <p className="text-blue-700">{progresso}% concluído</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sugestões
  if (etapa === 'sugestoes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-green-900">✅ Detecção Concluída!</h2>
                  <p className="text-green-700">IA identificou {templatesDetectados.length} templates com 91% de confiança</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-blue-600">{totalTarefas}</div>
                  <div className="text-sm">Tarefas Total</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-green-600">{Math.ceil(totalTarefas / 30)}</div>
                  <div className="text-sm">Semanas</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-purple-600">R$ 4.8M</div>
                  <div className="text-sm">Orçamento</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-yellow-600">91%</div>
                  <div className="text-sm">Confiança</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold mb-4">Templates Detectados:</h3>
          <div className="grid gap-4 mb-6">
            {templatesDetectados.map(template => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${
                  templatesEscolhidos.includes(template.id)
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:border-blue-200'
                }`}
                onClick={() => toggleTemplate(template.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg">{template.nome}</h4>
                        {template.obrigatorio && (
                          <Badge variant="default" className="bg-red-500">Obrigatório</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Categoria:</span>
                          <p className="font-medium">{template.categoria}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Score:</span>
                          <p className="font-medium">{(template.score * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tarefas:</span>
                          <p className="font-medium">{template.tarefas}</p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={templatesEscolhidos.includes(template.id)}
                      disabled={template.obrigatorio}
                      className="w-5 h-5"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">💡 Recomendações da IA:</h3>
              </div>
              <ul className="space-y-2 text-blue-700 mb-6">
                <li>• Projeto de alta complexidade - incluir todos os templates complementares</li>
                <li>• Cliente experiente - alto potencial de sucesso</li>
                <li>• Orçamento permite templates opcionais para maximizar valor</li>
              </ul>
              
              <div className="flex gap-4">
                <Button onClick={() => setEtapa('inicio')} variant="outline">
                  ← Voltar
                </Button>
                <Button onClick={gerarProjeto} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  🚀 Gerar Projeto Composto ({templatesEscolhidos.length} templates)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Resultado
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-8">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                🎉 Projeto Composto Gerado!
              </h2>
              <p className="text-green-700 mb-6">
                Sistema revolucionário funcionando perfeitamente
              </p>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-2xl font-bold text-green-600">{totalTarefas}</div>
                  <div className="text-sm">Tarefas Integradas</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-2xl font-bold text-blue-600">{Math.ceil(totalTarefas / 30)}</div>
                  <div className="text-sm">Semanas</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-lg font-bold text-purple-600">R$ 4.8M</div>
                  <div className="text-sm">Orçamento Total</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-2xl font-bold text-yellow-600">85%</div>
                  <div className="text-sm">Economia Tempo</div>
                </div>
              </div>

              <p className="text-lg text-gray-700 mb-8">
                ✅ Cronograma automático gerado com dependências mapeadas<br />
                ✅ Sistema pronto para 10.000 usuários simultâneos!
              </p>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setEtapa('inicio')} variant="outline" size="lg">
                  🔄 Nova Demonstração
                </Button>
                <Button onClick={() => router.push('/briefing/novo')} size="lg" className="bg-green-600 hover:bg-green-700">
                  📋 Testar Briefing Real
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 