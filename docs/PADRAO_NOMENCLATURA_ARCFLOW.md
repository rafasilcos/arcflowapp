# 🎯 PADRÃO DE NOMENCLATURA ARCFLOW - REGRAS DEFINITIVAS

## **⚠️ REGRA OURO: NUNCA MAIS INCONSISTÊNCIAS DE VARIÁVEIS!**

Este documento define o padrão **OBRIGATÓRIO** para nomenclatura de variáveis em todo o sistema ArcFlow.

## **🔧 PADRÃO DEFINIDO:**

### **1. 📊 BANCO DE DADOS (PostgreSQL)**
```sql
-- ✅ SEMPRE snake_case
CREATE TABLE briefings (
    id UUID PRIMARY KEY,
    nome_projeto TEXT,        -- snake_case
    cliente_id UUID,          -- snake_case
    responsavel_id UUID,      -- snake_case
    created_at TIMESTAMP,     -- snake_case
    updated_at TIMESTAMP      -- snake_case
);
```

### **2. 🖥️ BACKEND (Node.js)**
```javascript
// ✅ SEMPRE converter para camelCase na resposta
const briefingQuery = `
  SELECT 
    b.nome_projeto as "nomeProjeto",        -- Conversão automática
    b.cliente_id as "clienteId",            -- Conversão automática
    b.responsavel_id as "responsavelId",    -- Conversão automática
    b.created_at as "createdAt",            -- Conversão automática
    b.updated_at as "updatedAt"             -- Conversão automática
  FROM briefings b
`;

// ✅ SEMPRE retornar camelCase
const response = {
  nomeProjeto: row.nomeProjeto,     // camelCase
  clienteId: row.clienteId,         // camelCase
  responsavelId: row.responsavelId, // camelCase
  createdAt: row.createdAt,         // camelCase
  updatedAt: row.updatedAt          // camelCase
};
```

### **3. 🎨 FRONTEND (React/TypeScript)**
```typescript
// ✅ SEMPRE camelCase (igual ao backend)
interface BriefingData {
  id: string
  nomeProjeto: string           // camelCase
  clienteId?: string            // camelCase
  responsavelId?: string        // camelCase
  createdAt: string             // camelCase
  updatedAt: string             // camelCase
}

// ✅ SEMPRE acessar em camelCase
const briefing = {
  nome: briefingData.nomeProjeto,     // ✅ Correto
  cliente: briefingData.clienteId,    // ✅ Correto
  responsavel: briefingData.responsavelId, // ✅ Correto
}
```

## **📋 REGRAS OBRIGATÓRIAS:**

### **🚨 REGRA 1: CONVERSÃO AUTOMÁTICA NO BACKEND**
```javascript
// ✅ SEMPRE fazer conversão na query SQL
SELECT 
  campo_snake_case as "campoSnakeCase",
  outro_campo as "outroCampo"
FROM tabela
```

### **🚨 REGRA 2: INTERFACES TYPESCRIPT CENTRALIZADAS**
```typescript
// ✅ SEMPRE definir interfaces únicas
// Arquivo: src/types/briefing.ts
export interface BriefingData {
  id: string
  nomeProjeto: string      // ✅ Padrão camelCase
  clienteId?: string       // ✅ Padrão camelCase
  responsavelId?: string   // ✅ Padrão camelCase
  createdAt: string        // ✅ Padrão camelCase
  updatedAt: string        // ✅ Padrão camelCase
}
```

### **🚨 REGRA 3: FALLBACK COMPATÍVEL**
```typescript
// ✅ SEMPRE usar fallback para compatibilidade
const clienteId = briefingData.clienteId || briefingData.cliente_id;
const nomeProjeto = briefingData.nomeProjeto || briefingData.nome_projeto;
```

## **🛠️ FERRAMENTAS DE VALIDAÇÃO:**

### **1. 🔍 SCRIPT DE VERIFICAÇÃO:**
```bash
# Executar antes de qualquer commit
npm run validate-naming
```

### **2. 📝 ESLINT RULES:**
```javascript
// .eslintrc.js
rules: {
  'camelcase': ['error', { 'properties': 'always' }],
  'no-underscore-dangle': 'error'
}
```

### **3. 🧪 TESTES AUTOMATIZADOS:**
```javascript
// Testar consistência de nomenclatura
describe('Nomenclatura', () => {
  it('deve retornar campos em camelCase', () => {
    expect(response.nomeProjeto).toBeDefined();
    expect(response.nome_projeto).toBeUndefined();
  });
});
```

## **📊 MAPEAMENTO COMPLETO:**

| **Banco (snake_case)** | **Backend/Frontend (camelCase)** | **Descrição** |
|---|---|---|
| `nome_projeto` | `nomeProjeto` | Nome do projeto |
| `cliente_id` | `clienteId` | ID do cliente |
| `responsavel_id` | `responsavelId` | ID do responsável |
| `escritorio_id` | `escritorioId` | ID do escritório |
| `created_at` | `createdAt` | Data de criação |
| `updated_at` | `updatedAt` | Data de atualização |
| `deleted_at` | `deletedAt` | Data de exclusão |
| `created_by` | `createdBy` | Criado por |
| `updated_by` | `updatedBy` | Atualizado por |

## **🔧 CHECKLIST OBRIGATÓRIO:**

### **✅ ANTES DE CRIAR NOVA FEATURE:**
- [ ] Definir campos no banco em snake_case
- [ ] Criar conversão no backend para camelCase
- [ ] Definir interface TypeScript em camelCase
- [ ] Implementar fallback de compatibilidade
- [ ] Testar com dados reais

### **✅ ANTES DE FAZER COMMIT:**
- [ ] Executar script de validação
- [ ] Verificar eslint sem erros
- [ ] Rodar testes automatizados
- [ ] Testar APIs no Postman/Thunder Client

### **✅ ANTES DE FAZER DEPLOY:**
- [ ] Validar todas as APIs
- [ ] Testar frontend com dados reais
- [ ] Verificar logs sem erros
- [ ] Executar testes de regressão

## **🎯 EXEMPLO PRÁTICO:**

### **❌ ANTES (INCONSISTENTE):**
```javascript
// Backend retorna
{ nomeProjeto: "Casa Brasil" }

// Frontend tenta acessar
briefing.nome_projeto  // undefined!
```

### **✅ DEPOIS (CONSISTENTE):**
```javascript
// Backend retorna
{ nomeProjeto: "Casa Brasil" }

// Frontend acessa
briefing.nomeProjeto  // "Casa Brasil" ✅
```

## **🛡️ COMPROMISSO:**

**NUNCA MAIS INCONSISTÊNCIAS DE NOMENCLATURA!**

### **📜 JURAMENTO DO DESENVOLVEDOR:**
*"Eu me comprometo a seguir o padrão de nomenclatura ArcFlow em todas as minhas implementações. Sempre usarei snake_case no banco, camelCase no backend/frontend, e implementarei fallbacks para compatibilidade. Nunca mais uma variável ficará indefinida por problemas de nomenclatura!"*

---

**⚖️ Este documento é a LEI de nomenclatura do ArcFlow. Seguí-lo é OBRIGATÓRIO!** 