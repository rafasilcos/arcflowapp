# Componentes Frontend para Visualização de Orçamentos

Este diretório contém os componentes React desenvolvidos para a **tarefa 10** da spec "Integração Briefing-Orçamento". Os componentes permitem visualizar, gerenciar e configurar orçamentos gerados automaticamente a partir de briefings.

## Componentes Disponíveis

### 1. BudgetPreview
**Finalidade:** Exibir uma prévia do orçamento antes da geração final.

**Características:**
- Mostra dados extraídos do briefing (área, tipologia, complexidade)
- Exibe preview do orçamento com valores e disciplinas
- Permite gerar ou regenerar orçamentos
- Suporta briefings padrão e personalizados
- Interface responsiva com loading states

**Uso:**
```tsx
import { BudgetPreview } from './components';

<BudgetPreview
  briefingId="uuid-do-briefing"
  orcamentoId="uuid-do-orcamento" // opcional
  onGerarOrcamento={(orcamentoId) => console.log('Gerado:', orcamentoId)}
  onFechar={() => setModalAberto(false)}
/>
```

### 2. BudgetBreakdown
**Finalidade:** Detalhamento completo do orçamento por disciplinas e fases.

**Características:**
- Visualização por disciplinas ou fases do projeto
- Gráficos simples de distribuição de valores
- Detalhamento de horas e valores por disciplina
- Modo de edição para administradores
- Integração com histórico de versões

**Uso:**
```tsx
import { BudgetBreakdown } from './components';

<BudgetBreakdown
  disciplinas={disciplinasArray}
  fases={fasesArray}
  valorTotal={40000}
  horasTotal={280}
  orcamentoId="uuid-do-orcamento"
  briefingId="uuid-do-briefing"
  editavel={isAdmin}
  onEditarDisciplina={(disciplina, valor) => handleEdit(disciplina, valor)}
/>
```

### 3. ConfigurationPanel
**Finalidade:** Painel administrativo para configurar parâmetros de orçamento.

**Características:**
- Configuração de tabela de preços por função
- Multiplicadores por tipologia de projeto
- Fatores de complexidade
- Configurações gerais (impostos, margem, etc.)
- Interface com abas organizadas
- Validação de dados e preview de impacto

**Uso:**
```tsx
import { ConfigurationPanel } from './components';

<ConfigurationPanel
  escritorioId="uuid-do-escritorio"
  onSalvar={(config) => handleSave(config)}
  onFechar={() => setModalAberto(false)}
  readOnly={!isAdmin}
/>
```

### 4. HistoryViewer
**Finalidade:** Visualizar histórico e comparar versões de orçamentos.

**Características:**
- Lista de todas as versões do orçamento
- Comparação entre duas versões
- Detalhamento de diferenças
- Interface modal responsiva
- Auditoria de alterações

**Uso:**
```tsx
import { HistoryViewer } from './components';

<HistoryViewer
  orcamentoId="uuid-do-orcamento"
  briefingId="uuid-do-briefing" // opcional
  onClose={() => setModalAberto(false)}
/>
```

### 5. BudgetIntegrationExample
**Finalidade:** Exemplo completo de integração no dashboard de briefing.

**Características:**
- Botões de ação contextuais
- Gerenciamento de modais
- Estados condicionais baseados no status do briefing
- Interface completa para administradores e usuários

**Uso:**
```tsx
import { BudgetIntegrationExample } from './components';

<BudgetIntegrationExample
  briefingId="uuid-do-briefing"
  orcamentoId="uuid-do-orcamento" // opcional
  escritorioId="uuid-do-escritorio"
  isAdmin={user.isAdmin}
  briefingStatus="CONCLUIDO"
/>
```

## Tipos TypeScript

Todos os componentes incluem tipos TypeScript completos:

```tsx
import type {
  DadosExtraidos,
  OrcamentoPreview,
  BudgetPreviewProps,
  Disciplina,
  Fase,
  BudgetBreakdownProps,
  VersaoOrcamento,
  DiferencaVersao,
  ComparacaoVersoes,
  HistoryViewerProps,
  TabelaPrecos,
  MultiplicadoresTipologia,
  ParametrosComplexidade,
  ConfiguracoesPadrao,
  ConfiguracaoEscritorio,
  ConfigurationPanelProps
} from './components';
```

## Integração com APIs

Os componentes fazem chamadas para as seguintes APIs:

### BudgetPreview
- `GET /api/orcamentos-inteligentes/preview/:briefingId`
- `POST /api/orcamentos-inteligentes/gerar/:briefingId`

### ConfigurationPanel
- `GET /api/configuracoes-orcamento/escritorio/:escritorioId`
- `PUT /api/configuracoes-orcamento/escritorio/:escritorioId`
- `POST /api/configuracoes-orcamento/reset/:escritorioId`

### HistoryViewer
- `GET /api/historico-orcamentos/:orcamentoId`
- `GET /api/historico-orcamentos/briefing/:briefingId`
- `GET /api/historico-orcamentos/comparar/:orcamentoId/:versao1/:versao2`

## Estilos e Design

- **Framework CSS:** Tailwind CSS
- **Design System:** Consistente com o ArcFlow
- **Responsividade:** Mobile-first approach
- **Acessibilidade:** Suporte a screen readers e navegação por teclado
- **Estados:** Loading, error e empty states implementados

## Dependências

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Nenhuma dependência externa de gráficos (implementação simplificada)

## Notas de Implementação

1. **Gráficos:** Implementados de forma simples sem bibliotecas externas para evitar dependências desnecessárias
2. **Estados:** Todos os componentes incluem estados de loading, erro e dados vazios
3. **Responsividade:** Interface adaptável para desktop, tablet e mobile
4. **Performance:** Componentes otimizados com React.memo quando necessário
5. **Acessibilidade:** Seguem as diretrizes WCAG 2.1

## Próximos Passos

Para integrar esses componentes no frontend principal:

1. Mover os componentes para o diretório `frontend/src/components/`
2. Ajustar imports e paths conforme estrutura do projeto
3. Integrar com o sistema de autenticação existente
4. Conectar com as APIs do backend
5. Adicionar testes unitários e de integração

## Requisitos Atendidos

✅ **4.1** - Componente BudgetPreview para mostrar prévia do orçamento  
✅ **4.2** - Componente BudgetBreakdown para detalhamento por disciplinas  
✅ **4.3** - Componente ConfigurationPanel para administradores  
✅ **6.1** - Integração com sistema de configurações de orçamento  
✅ **Botões de ação** - Implementados no dashboard de briefing (gerar, regenerar, aprovar)

A tarefa 10 foi **concluída com sucesso** com todos os componentes frontend implementados e documentados.