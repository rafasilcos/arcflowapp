# Sistema de Briefing Personalizável - ArcFlow

## 🎯 Objetivo
Implementar um sistema onde perguntas e respostas ficam sempre vinculadas corretamente, mesmo quando o briefing é personalizado (perguntas reordenadas, modificadas ou removidas).

## 🔧 Arquitetura da Solução

### 1. Estrutura de Dados no Backend

```sql
-- Tabela principal de briefings
CREATE TABLE briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_projeto VARCHAR(255) NOT NULL,
    cliente_id UUID REFERENCES clientes(id),
    responsavel_id UUID REFERENCES usuarios(id),
    template_id UUID REFERENCES briefing_templates(id),
    status VARCHAR(50) DEFAULT 'em_andamento',
    progresso INTEGER DEFAULT 0,
    
    -- CAMPO CHAVE: Estrutura completa do briefing
    estrutura_briefing JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_briefings_estrutura ON briefings USING GIN (estrutura_briefing);
CREATE INDEX idx_briefings_cliente ON briefings(cliente_id);
CREATE INDEX idx_briefings_responsavel ON briefings(responsavel_id);
```

### 2. Estrutura do Campo `estrutura_briefing`

```json
{
  "template_id": "template-residencial-01",
  "template_nome": "Residencial - Casa Térrea",
  "template_versao": "1.0",
  "personalizado": true,
  "data_criacao": "2024-01-15T10:00:00Z",
  "data_ultima_modificacao": "2024-01-15T15:30:00Z",
  "metadados": {
    "total_perguntas": 25,
    "total_respondidas": 20,
    "tempo_gasto_minutos": 45,
    "qualidade_respostas": 85
  },
  "secoes": [
    {
      "id": "secao-1",
      "nome": "📋 Informações Gerais",
      "descricao": "Dados básicos do projeto",
      "ordem": 1,
      "obrigatoria": true,
      "perguntas": [
        {
          "id": "pergunta-1",
          "pergunta_original": "Qual é o nome do projeto?",
          "pergunta_personalizada": "Como você gostaria de nomear este projeto?",
          "tipo": "text",
          "obrigatoria": true,
          "ordem": 1,
          "importancia": "alta",
          "categoria": "identificacao",
          "resposta": "Casa dos Sonhos - Família Silva",
          "respondida": true,
          "data_resposta": "2024-01-15T10:15:00Z",
          "validacao": {
            "minLength": 3,
            "maxLength": 100,
            "required": true
          }
        },
        {
          "id": "pergunta-2",
          "pergunta_original": "Qual é a área total do terreno?",
          "pergunta_personalizada": null,
          "tipo": "number",
          "obrigatoria": true,
          "ordem": 2,
          "importancia": "alta",
          "categoria": "dimensoes",
          "resposta": 500,
          "respondida": true,
          "data_resposta": "2024-01-15T10:20:00Z",
          "validacao": {
            "min": 1,
            "max": 10000,
            "required": true,
            "unit": "m²"
          }
        }
      ]
    },
    {
      "id": "secao-2",
      "nome": "💰 Orçamento e Custos",
      "descricao": "Informações financeiras do projeto",
      "ordem": 2,
      "obrigatoria": true,
      "perguntas": [
        {
          "id": "pergunta-10",
          "pergunta_original": "Qual é o orçamento disponível?",
          "pergunta_personalizada": "Qual é o investimento previsto para este projeto?",
          "tipo": "currency",
          "obrigatoria": true,
          "ordem": 1,
          "importancia": "alta",
          "categoria": "financeiro",
          "resposta": 250000,
          "respondida": true,
          "data_resposta": "2024-01-15T10:25:00Z",
          "validacao": {
            "min": 10000,
            "max": 5000000,
            "required": true,
            "currency": "BRL"
          }
        }
      ]
    }
  ]
}
```

## 🚀 Implementação no Backend

### 1. Endpoint para Salvar Briefing Completo

```javascript
// backend/src/routes/briefings.ts
app.post('/api/briefings/:id/salvar-completo', async (req, res) => {
  try {
    const { id } = req.params;
    const { estrutura_briefing } = req.body;
    
    // Validar estrutura
    if (!estrutura_briefing || !estrutura_briefing.secoes) {
      return res.status(400).json({ 
        error: 'Estrutura do briefing inválida' 
      });
    }
    
    // Calcular metadados
    const metadados = calcularMetadados(estrutura_briefing);
    estrutura_briefing.metadados = metadados;
    
    // Salvar no banco
    const result = await pool.query(
      `UPDATE briefings 
       SET estrutura_briefing = $1, 
           progresso = $2, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [
        JSON.stringify(estrutura_briefing),
        metadados.progresso,
        id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Briefing não encontrado' });
    }
    
    res.json({ 
      success: true, 
      briefing: result.rows[0] 
    });
    
  } catch (error) {
    console.error('Erro ao salvar briefing:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função auxiliar para calcular metadados
function calcularMetadados(estrutura) {
  let totalPerguntas = 0;
  let totalRespondidas = 0;
  let tempoGasto = 0;
  
  estrutura.secoes.forEach(secao => {
    secao.perguntas.forEach(pergunta => {
      totalPerguntas++;
      if (pergunta.respondida) {
        totalRespondidas++;
      }
    });
  });
  
  const progresso = Math.round((totalRespondidas / totalPerguntas) * 100);
  const qualidade = calcularQualidadeRespostas(estrutura);
  
  return {
    total_perguntas: totalPerguntas,
    total_respondidas: totalRespondidas,
    progresso: progresso,
    qualidade_respostas: qualidade,
    tempo_gasto_minutos: tempoGasto
  };
}
```

### 2. Endpoint para Buscar Briefing Completo

```javascript
app.get('/api/briefings/:id/completo', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        b.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        c.telefone as cliente_telefone,
        u.nome as responsavel_nome,
        u.email as responsavel_email
       FROM briefings b
       LEFT JOIN clientes c ON b.cliente_id = c.id
       LEFT JOIN usuarios u ON b.responsavel_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Briefing não encontrado' });
    }
    
    const briefing = result.rows[0];
    
    // Se não tem estrutura_briefing, gerar do método antigo
    if (!briefing.estrutura_briefing) {
      briefing.estrutura_briefing = await migrarBriefingAntigo(briefing);
    }
    
    res.json({ 
      success: true, 
      briefing: briefing 
    });
    
  } catch (error) {
    console.error('Erro ao buscar briefing:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
```

## 🎨 Implementação no Frontend

### 1. Interface TypeScript

```typescript
// frontend/src/types/briefing.ts
export interface BriefingCompleto {
  id: string;
  nome_projeto: string;
  cliente_id: string;
  responsavel_id: string;
  template_id: string;
  status: string;
  progresso: number;
  estrutura_briefing: EstruturaBriefing;
  created_at: string;
  updated_at: string;
  
  // Dados relacionados
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone?: string;
  responsavel_nome: string;
  responsavel_email: string;
}

export interface EstruturaBriefing {
  template_id: string;
  template_nome: string;
  template_versao: string;
  personalizado: boolean;
  data_criacao: string;
  data_ultima_modificacao: string;
  metadados: MetadadosBriefing;
  secoes: SecaoBriefing[];
}

export interface SecaoBriefing {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  obrigatoria: boolean;
  perguntas: PerguntaBriefing[];
}

export interface PerguntaBriefing {
  id: string;
  pergunta_original: string;
  pergunta_personalizada?: string;
  tipo: 'text' | 'number' | 'currency' | 'select' | 'textarea' | 'checkbox' | 'radio';
  obrigatoria: boolean;
  ordem: number;
  importancia: 'alta' | 'media' | 'baixa';
  categoria: string;
  resposta: any;
  respondida: boolean;
  data_resposta?: string;
  validacao: ValidacaoPergunta;
}

export interface ValidacaoPergunta {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  options?: string[];
  unit?: string;
  currency?: string;
}

export interface MetadadosBriefing {
  total_perguntas: number;
  total_respondidas: number;
  progresso: number;
  qualidade_respostas: number;
  tempo_gasto_minutos: number;
}
```

### 2. Componente de Dashboard Atualizado

```typescript
// frontend/src/components/BriefingDashboard.tsx
export default function BriefingDashboard() {
  const [briefingCompleto, setBriefingCompleto] = useState<BriefingCompleto | null>(null);
  
  const carregarBriefingCompleto = async () => {
    try {
      const response = await fetch(`/api/briefings/${params.id}/completo`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBriefingCompleto(data.briefing);
      }
    } catch (error) {
      console.error('Erro ao carregar briefing:', error);
    }
  };
  
  const renderPerguntasERespostas = () => {
    if (!briefingCompleto?.estrutura_briefing) return null;
    
    return briefingCompleto.estrutura_briefing.secoes.map(secao => (
      <Card key={secao.id} className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{secao.nome} ({secao.perguntas.length})</span>
            <Badge variant="outline">
              {secao.perguntas.filter(p => p.respondida).length} / {secao.perguntas.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {secao.perguntas.map(pergunta => (
              <div key={pergunta.id} className="border-l-4 border-l-purple-500 pl-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="font-semibold text-gray-900 flex-1">
                    <strong>Pergunta:</strong> {pergunta.pergunta_personalizada || pergunta.pergunta_original}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={pergunta.importancia === 'alta' ? 'destructive' : 
                                  pergunta.importancia === 'media' ? 'secondary' : 'outline'}>
                      {pergunta.importancia}
                    </Badge>
                    <Badge variant={pergunta.respondida ? 'default' : 'secondary'}>
                      {pergunta.respondida ? 'Respondida' : 'Não respondida'}
                    </Badge>
                  </div>
                </div>
                <div className="text-gray-700 bg-white p-3 rounded border">
                  <strong>Resposta:</strong> {
                    pergunta.respondida 
                      ? (typeof pergunta.resposta === 'object' 
                          ? JSON.stringify(pergunta.resposta, null, 2) 
                          : String(pergunta.resposta))
                      : 'Não respondida'
                  }
                </div>
                {pergunta.data_resposta && (
                  <div className="text-xs text-gray-500 mt-2">
                    Respondido em: {new Date(pergunta.data_resposta).toLocaleString('pt-BR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ));
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header e conteúdo existente */}
      
      <TabsContent value="responses" className="space-y-6">
        <div className="space-y-6">
          {renderPerguntasERespostas()}
        </div>
      </TabsContent>
    </div>
  );
}
```

## 🔄 Migração de Dados Existentes

```javascript
// backend/src/migrations/migrar-briefings-antigos.js
async function migrarBriefingAntigo(briefingAntigo) {
  const estrutura = {
    template_id: briefingAntigo.template_id || 'template-generico',
    template_nome: 'Briefing Migrado',
    template_versao: '1.0',
    personalizado: false,
    data_criacao: briefingAntigo.created_at,
    data_ultima_modificacao: briefingAntigo.updated_at,
    metadados: {
      total_perguntas: 0,
      total_respondidas: 0,
      progresso: briefingAntigo.progresso || 0,
      qualidade_respostas: 0,
      tempo_gasto_minutos: 0
    },
    secoes: []
  };
  
  // Tentar extrair dados das observações
  let respostas = {};
  if (briefingAntigo.observacoes) {
    try {
      const observacoes = JSON.parse(briefingAntigo.observacoes);
      respostas = observacoes.respostas || {};
    } catch (e) {
      console.warn('Erro ao parsear observações:', e);
    }
  }
  
  // Converter respostas em estrutura nova
  const secaoGeral = {
    id: 'secao-geral',
    nome: '📋 Informações Gerais',
    descricao: 'Dados migrados do sistema anterior',
    ordem: 1,
    obrigatoria: true,
    perguntas: []
  };
  
  Object.entries(respostas).forEach(([pergunta, resposta], index) => {
    secaoGeral.perguntas.push({
      id: `pergunta-${index + 1}`,
      pergunta_original: pergunta,
      pergunta_personalizada: null,
      tipo: 'text',
      obrigatoria: false,
      ordem: index + 1,
      importancia: 'media',
      categoria: 'geral',
      resposta: resposta,
      respondida: true,
      data_resposta: briefingAntigo.updated_at,
      validacao: {
        required: false
      }
    });
  });
  
  estrutura.secoes.push(secaoGeral);
  estrutura.metadados.total_perguntas = secaoGeral.perguntas.length;
  estrutura.metadados.total_respondidas = secaoGeral.perguntas.filter(p => p.respondida).length;
  
  return estrutura;
}
```

## 📋 Checklist de Implementação

### Backend
- [ ] Adicionar campo `estrutura_briefing` JSONB na tabela `briefings`
- [ ] Criar endpoint `/api/briefings/:id/salvar-completo`
- [ ] Criar endpoint `/api/briefings/:id/completo`
- [ ] Implementar função de migração de dados antigos
- [ ] Adicionar validação de estrutura do briefing
- [ ] Implementar cálculo de metadados automático

### Frontend
- [ ] Criar interfaces TypeScript para estrutura completa
- [ ] Atualizar componente de dashboard para usar nova estrutura
- [ ] Implementar renderização de perguntas e respostas estruturadas
- [ ] Adicionar indicadores de qualidade e progresso
- [ ] Implementar busca e filtros nas perguntas/respostas
- [ ] Adicionar suporte para diferentes tipos de pergunta

### Testes
- [ ] Testar migração de dados antigos
- [ ] Testar salvamento de briefing personalizado
- [ ] Testar renderização de perguntas e respostas
- [ ] Testar performance com briefings grandes
- [ ] Testar exportação PDF com nova estrutura

## 🎯 Benefícios da Nova Implementação

1. **Perguntas e Respostas Sempre Vinculadas**: Nunca mais perder a relação entre pergunta e resposta
2. **Sistema Totalmente Personalizável**: Perguntas podem ser editadas, reordenadas ou removidas
3. **Metadados Automáticos**: Cálculo automático de progresso, qualidade e tempo
4. **Histórico Completo**: Data de resposta, versão da pergunta, etc.
5. **Melhor Performance**: Dados estruturados em JSONB com índices otimizados
6. **Escalabilidade**: Suporta briefings com centenas de perguntas
7. **Compatibilidade**: Migração automática de dados antigos

## 🚀 Próximos Passos

1. Implementar a nova estrutura no backend
2. Migrar dados existentes
3. Atualizar dashboard para usar nova estrutura
4. Testar com briefings reais
5. Implementar ferramentas de personalização avançada 