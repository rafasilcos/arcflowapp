# 🚀 GUIA RÁPIDO - PADRÃO DE NOMENCLATURA ARCFLOW

## **⚡ REGRA DE OURO (MEMORIZE!):**

- **🗄️ BANCO**: `snake_case` (nome_projeto, cliente_id)
- **🖥️ BACKEND**: `camelCase` (nomeProjeto, clienteId) 
- **🎨 FRONTEND**: `camelCase` (nomeProjeto, clienteId)

## **🔧 COMO IMPLEMENTAR:**

### **1. 🖥️ BACKEND (server-simple.js)**
```javascript
// ✅ SEMPRE fazer conversão na query
SELECT 
  nome_projeto as "nomeProjeto",
  cliente_id as "clienteId"
FROM briefings
```

### **2. 🎨 FRONTEND (componentes)**
```typescript
// ✅ SEMPRE usar camelCase
interface BriefingData {
  nomeProjeto: string    // ✅ Correto
  clienteId?: string     // ✅ Correto
}

// ✅ SEMPRE usar hooks de normalização
import { useNormalizedBriefing } from '../hooks/useNormalizedData';

const briefing = useNormalizedBriefing(rawData);
```

### **3. 🛡️ FALLBACKS SEMPRE**
```typescript
// ✅ SEMPRE implementar fallback
const nomeProjeto = data.nomeProjeto || data.nome_projeto || 'Projeto ArcFlow';
const clienteId = data.clienteId || data.cliente_id;
```

## **🎯 COMANDOS ÚTEIS:**

```bash
# Validar nomenclatura
npm run validate-naming

# Antes de commit
npm run pre-commit
```

## **📋 CHECKLIST RÁPIDO:**

- [ ] Backend usa conversão `as "camelCase"`
- [ ] Frontend usa `camelCase` em interfaces
- [ ] Implementou fallbacks `||` 
- [ ] Usou hooks `useNormalizedBriefing()`
- [ ] Executou `npm run validate-naming`

## **🚨 NUNCA MAIS:**

- ❌ `briefing.nome_projeto` (snake_case no frontend)
- ❌ `briefing.cliente_id` (snake_case no frontend)
- ❌ Interfaces com snake_case

## **✅ SEMPRE:**

- ✅ `briefing.nomeProjeto` (camelCase no frontend)
- ✅ `briefing.clienteId` (camelCase no frontend)
- ✅ Interfaces com camelCase

---

**🎯 MEMORIZE: snake_case (banco) → camelCase (backend/frontend)** 