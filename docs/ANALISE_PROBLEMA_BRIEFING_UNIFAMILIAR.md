# ANÁLISE DO PROBLEMA - BRIEFING UNIFAMILIAR FIXO

## 📋 PROBLEMA IDENTIFICADO

**Status:** 🔴 CRÍTICO - Sistema sempre retorna o mesmo briefing  
**Descrição:** O sistema está fixando o briefing `RESIDENCIAL_UNIFAMILIAR` (235 perguntas) independentemente da seleção do usuário.

### Sintomas Observados:
1. **Seleção Engenharia** → Retorna Residencial Unifamiliar
2. **Seleção Instalações** → Retorna Residencial Unifamiliar  
3. **Seleção Comercial** → Retorna Residencial Unifamiliar
4. **Qualquer seleção** → Sempre o mesmo briefing

## 🔍 ANÁLISE TÉCNICA

### Causa Raiz Identificada:
O `BriefingAdapter.tsx` tem um **fallback hardcoded** que sempre retorna `BRIEFING_RESIDENCIAL_UNIFAMILIAR`:

```typescript
// LINHA 196-197 - PROBLEMA CRÍTICO
console.log('⚠️ [ADAPTER V5] FALLBACK: RESIDENCIAL_UNIFAMILIAR (235 perguntas)')
return BRIEFING_RESIDENCIAL_UNIFAMILIAR
```

### Fluxo Atual (PROBLEMÁTICO):
```
Usuário seleciona Engenharia
↓
BriefingAdapter.tsx recebe dados do banco
↓
Lógica de seleção não encontra correspondência
↓
Executa fallback → SEMPRE unifamiliar
↓
❌ Sistema ignora seleção do usuário
```

## 🏗️ BRIEFINGS DISPONÍVEIS

### Estrutura Atual da Pasta `/briefings-aprovados`:
```
📁 briefings-aprovados/
├── 📁 comercial/
│   ├── escritorios.ts
│   ├── lojas.ts
│   ├── restaurantes.ts
│   └── hotel-pousada.ts
├── 📁 residencial/
│   ├── unifamiliar.ts
│   ├── multifamiliar.ts
│   ├── paisagismo.ts
│   ├── design-interiores.ts
│   └── loteamentos.ts
├── 📁 industrial/
│   └── galpao-industrial.ts
├── 📁 urbanistico/
│   └── projeto-urbano.ts
├── 📁 estrutural/
│   └── projeto-estrutural-adaptativo.ts
├── 📁 instalacoes/
│   └── briefing-instalacoes-adaptativo-completo.ts
└── index.ts
```

### Total de Briefings Disponíveis: **13 briefings**

## 🚀 SOLUÇÃO PROPOSTA

### 1. Corrigir o BriefingAdapter
- **Remover fallback fixo** para unifamiliar
- **Implementar função `getBriefingAprovado`** do index.ts
- **Usar mapeamento correto** categoria → tipo

### 2. Implementar Lógica Dinâmica
```typescript
// SOLUÇÃO PROPOSTA
const briefingCompleto = await getBriefingAprovado(categoria, tipo)
if (!briefingCompleto) {
  throw new Error(`Briefing não encontrado: ${categoria}/${tipo}`)
}
return briefingCompleto
```

### 3. Mapeamento Correto
```typescript
// DISCIPLINA → CATEGORIA → TIPO
'arquitetura' → 'residencial' → 'unifamiliar'
'arquitetura' → 'comercial' → 'escritorios'
'engenharia' → 'estrutural' → 'projeto-estrutural-adaptativo'
'instalacoes' → 'instalacoes' → 'instalacoes-adaptativo'
```

## 🔧 IMPLEMENTAÇÃO

### Arquivos a Modificar:
1. **`BriefingAdapter.tsx`** - Corrigir lógica de seleção
2. **`BriefingAdapter-corrigido.tsx`** - Aplicar mesma correção
3. **Testar fluxo completo** - Verificar todos os briefings

### Benefícios da Solução:
- ✅ **Respeita seleção do usuário**
- ✅ **Usa todos os 13 briefings disponíveis**
- ✅ **Suporta briefings adaptativos**
- ✅ **Mantém compatibilidade**

## 📊 IMPACTO ESPERADO

### Antes (Problema):
- **1 briefing** sempre carregado
- **235 perguntas** sempre as mesmas
- **Seleção ignorada** pelo sistema

### Depois (Solução):
- **13 briefings** disponíveis
- **Perguntas específicas** para cada tipo
- **Seleção respeitada** pelo sistema

## 🧪 TESTES NECESSÁRIOS

### Cenários de Teste:
1. **Arquitetura → Residencial → Unifamiliar** ✅
2. **Arquitetura → Comercial → Escritórios** ✅
3. **Engenharia → Estrutural → Adaptativo** ✅
4. **Instalações → Prediais → Adaptativo** ✅
5. **Arquitetura → Industrial → Galpão** ✅

### Validações:
- ✅ Briefing correto carregado
- ✅ Número de perguntas correto
- ✅ Seções específicas presentes
- ✅ Lógica adaptativa funcionando

---

**Próximos Passos:**
1. Implementar correção no BriefingAdapter
2. Testar todos os cenários
3. Validar briefings adaptativos
4. Documentar solução final 