'use client';

/**
 * PÁGINA DE CONFIGURAÇÃO DE ORÇAMENTOS - ARCFLOW
 * 
 * Interface para configurar preços base, fatores de complexidade e validações
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, Save, AlertTriangle, CheckCircle } from 'lucide-react';

interface PrecoBase {
  id?: number;
  tipologia: string;
  disciplina: string;
  complexidade: string;
  price_min: number;
  price_max: number;
  price_average: number;
  active: boolean;
}

interface FatorComplexidade {
  name: string;
  impact: number;
  reason: string;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
  marketComparison: {
    position: 'BELOW' | 'WITHIN' | 'ABOVE';
    percentile: number;
    minValue: number;
    maxValue: number;
    avgValue: number;
  };
}

export default function ConfiguracoesOrcamentos() {
  const [precosBase, setPrecosBase] = useState<PrecoBase[]>([]);
  const [fatoresComplexidade, setFatoresComplexidade] = useState<Record<string, FatorComplexidade>>({});
  const [novoPreco, setNovoPreco] = useState<Partial<PrecoBase>>({});
  const [validationTest, setValidationTest] = useState({
    tipologia: '',
    area: 0,
    valorTotal: 0,
    disciplinas: ['ARQUITETURA'],
    complexidade: 'MEDIO'
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tipologias = ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INSTITUCIONAL', 'URBANISTICO'];
  const disciplinas = ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES', 'PAISAGISMO', 'INTERIORES'];
  const complexidades = ['SIMPLES', 'MEDIO', 'COMPLEXO'];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar preços base
      const precosResponse = await fetch('/api/configuracoes-orcamento/precos-base', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (precosResponse.ok) {
        const precos = await precosResponse.json();
        setPrecosBase(precos);
      }

      // Carregar fatores de complexidade
      const fatoresResponse = await fetch('/api/configuracoes-orcamento/fatores-complexidade', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (fatoresResponse.ok) {
        const fatores = await fatoresResponse.json();
        setFatoresComplexidade(fatores);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações' });
    } finally {
      setLoading(false);
    }
  };

  const salvarPrecoBase = async () => {
    try {
      if (!novoPreco.tipologia || !novoPreco.disciplina || !novoPreco.complexidade || 
          !novoPreco.price_min || !novoPreco.price_max || !novoPreco.price_average) {
        setMessage({ type: 'error', text: 'Todos os campos são obrigatórios' });
        return;
      }

      const response = await fetch('/api/configuracoes-orcamento/precos-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(novoPreco)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preço base salvo com sucesso!' });
        setNovoPreco({});
        carregarDados();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao salvar preço base' });
      }
    } catch (error) {
      console.error('Erro ao salvar preço base:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar preço base' });
    }
  };

  const removerPrecoBase = async (id: number) => {
    try {
      const response = await fetch(`/api/configuracoes-orcamento/precos-base/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preço base removido com sucesso!' });
        carregarDados();
      } else {
        setMessage({ type: 'error', text: 'Erro ao remover preço base' });
      }
    } catch (error) {
      console.error('Erro ao remover preço base:', error);
      setMessage({ type: 'error', text: 'Erro ao remover preço base' });
    }
  };

  const validarOrcamento = async () => {
    try {
      if (!validationTest.tipologia || !validationTest.area || !validationTest.valorTotal) {
        setMessage({ type: 'error', text: 'Preencha todos os campos para validação' });
        return;
      }

      const response = await fetch('/api/configuracoes-orcamento/validar-orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(validationTest)
      });

      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
      } else {
        setMessage({ type: 'error', text: 'Erro ao validar orçamento' });
      }
    } catch (error) {
      console.error('Erro ao validar orçamento:', error);
      setMessage({ type: 'error', text: 'Erro ao validar orçamento' });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações de Orçamentos</h1>
        <p className="text-gray-600 mt-2">
          Configure preços base, fatores de complexidade e validações para orçamentos realistas
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="precos-base" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="precos-base">Preços Base</TabsTrigger>
          <TabsTrigger value="complexidade">Complexidade</TabsTrigger>
          <TabsTrigger value="validacao">Validação</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        {/* Tab: Preços Base */}
        <TabsContent value="precos-base" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Preço Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="tipologia">Tipologia</Label>
                  <Select 
                    value={novoPreco.tipologia || ''} 
                    onValueChange={(value) => setNovoPreco({...novoPreco, tipologia: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a tipologia" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipologias.map(tip => (
                        <SelectItem key={tip} value={tip}>{tip}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="disciplina">Disciplina</Label>
                  <Select 
                    value={novoPreco.disciplina || ''} 
                    onValueChange={(value) => setNovoPreco({...novoPreco, disciplina: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas.map(disc => (
                        <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="complexidade">Complexidade</Label>
                  <Select 
                    value={novoPreco.complexidade || ''} 
                    onValueChange={(value) => setNovoPreco({...novoPreco, complexidade: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a complexidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {complexidades.map(comp => (
                        <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="price_min">Preço Mínimo (R$/m²)</Label>
                  <Input
                    type="number"
                    value={novoPreco.price_min || ''}
                    onChange={(e) => setNovoPreco({...novoPreco, price_min: parseFloat(e.target.value)})}
                    placeholder="Ex: 80"
                  />
                </div>

                <div>
                  <Label htmlFor="price_max">Preço Máximo (R$/m²)</Label>
                  <Input
                    type="number"
                    value={novoPreco.price_max || ''}
                    onChange={(e) => setNovoPreco({...novoPreco, price_max: parseFloat(e.target.value)})}
                    placeholder="Ex: 400"
                  />
                </div>

                <div>
                  <Label htmlFor="price_average">Preço Médio (R$/m²)</Label>
                  <Input
                    type="number"
                    value={novoPreco.price_average || ''}
                    onChange={(e) => setNovoPreco({...novoPreco, price_average: parseFloat(e.target.value)})}
                    placeholder="Ex: 200"
                  />
                </div>
              </div>

              <Button onClick={salvarPrecoBase} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Preço Base
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preços Base Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {precosBase.map((preco) => (
                  <div key={preco.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{preco.tipologia}</Badge>
                        <Badge variant="outline">{preco.disciplina}</Badge>
                        <Badge variant="outline">{preco.complexidade}</Badge>
                        {!preco.active && <Badge variant="destructive">Inativo</Badge>}
                      </div>
                      <div className="text-sm text-gray-600">
                        Min: R$ {preco.price_min}/m² | 
                        Máx: R$ {preco.price_max}/m² | 
                        Médio: R$ {preco.price_average}/m²
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => preco.id && removerPrecoBase(preco.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Fatores de Complexidade */}
        <TabsContent value="complexidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fatores de Complexidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(fatoresComplexidade).map(([key, fator]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{key.replace(/_/g, ' ')}</h4>
                      <Badge 
                        variant={fator.impact > 0 ? "destructive" : "default"}
                        className={fator.impact > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {fator.impact > 0 ? '+' : ''}{fator.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{fator.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Validação */}
        <TabsContent value="validacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testar Validação de Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="test-tipologia">Tipologia</Label>
                  <Select 
                    value={validationTest.tipologia} 
                    onValueChange={(value) => setValidationTest({...validationTest, tipologia: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a tipologia" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipologias.map(tip => (
                        <SelectItem key={tip} value={tip}>{tip}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="test-complexidade">Complexidade</Label>
                  <Select 
                    value={validationTest.complexidade} 
                    onValueChange={(value) => setValidationTest({...validationTest, complexidade: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a complexidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {complexidades.map(comp => (
                        <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="test-area">Área (m²)</Label>
                  <Input
                    type="number"
                    value={validationTest.area || ''}
                    onChange={(e) => setValidationTest({...validationTest, area: parseFloat(e.target.value)})}
                    placeholder="Ex: 150"
                  />
                </div>

                <div>
                  <Label htmlFor="test-valor">Valor Total (R$)</Label>
                  <Input
                    type="number"
                    value={validationTest.valorTotal || ''}
                    onChange={(e) => setValidationTest({...validationTest, valorTotal: parseFloat(e.target.value)})}
                    placeholder="Ex: 30000"
                  />
                </div>
              </div>

              <Button onClick={validarOrcamento} className="w-full mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                Validar Orçamento
              </Button>

              {validationResult && (
                <div className="space-y-4">
                  <Alert className={validationResult.isValid ? 'border-green-500' : 'border-red-500'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Status:</strong> {validationResult.isValid ? 'Válido' : 'Inválido'}
                    </AlertDescription>
                  </Alert>

                  {validationResult.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Avisos:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-orange-600">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResult.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Sugestões:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-blue-600">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Comparação com Mercado:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Posição: <Badge>{validationResult.marketComparison.position}</Badge></div>
                      <div>Percentil: {validationResult.marketComparison.percentile}%</div>
                      <div>Faixa: R$ {validationResult.marketComparison.minValue.toLocaleString()} - R$ {validationResult.marketComparison.maxValue.toLocaleString()}</div>
                      <div>Média: R$ {validationResult.marketComparison.avgValue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Estatísticas */}
        <TabsContent value="estatisticas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas dos Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Estatísticas serão carregadas aqui...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}