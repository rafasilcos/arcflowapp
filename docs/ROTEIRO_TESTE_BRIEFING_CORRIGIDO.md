# 🧪 ROTEIRO DE TESTE - BRIEFING CORRIGIDO

## 🎯 OBJETIVO
Validar que a correção do algoritmo está funcionando e cada seleção retorna o briefing correto.

## 📋 PRÉ-REQUISITOS
1. Backend rodando em `http://localhost:3001`
2. Frontend rodando em `http://localhost:3000`
3. Console do navegador aberto (F12)

## 🔍 TESTES OBRIGATÓRIOS

### **TESTE 1: Design de Interiores (Caso principal)**
1. **Acessar:** `http://localhost:3000/briefing/novo`
2. **Preencher configuração inicial:**
   - Nome do Projeto: `Teste Design Interiores`
   - Descrição: `Validação da correção`
   - Clicar em **Próxima Etapa**

3. **Fazer seleção:**
   - Disciplina: **Arquitetura** ✅
   - Área: **Design de Interiores** ✅
   - Tipologia: **Design de Interiores** ✅
   - Clicar em **Criar Briefing**

4. **Verificar no Console:**
   ```
   🎯 [CORREÇÃO] Dados extraídos CORRETAMENTE: {
     disciplina: "arquitetura",
     area: "design_interiores",        // ← DEVE SER ISSO
     tipologia: "design_interiores"    // ← DEVE SER ISSO
   }
   ```

5. **Resultado esperado:**
   - **NÃO** deve ser Briefing Unifamiliar (235 perguntas)
   - **DEVE** ser Briefing Design Interiores (89 perguntas)

### **TESTE 2: Residencial Unifamiliar**
1. **Repetir processo**
2. **Seleção:**
   - Disciplina: **Arquitetura**
   - Área: **Residencial**
   - Tipologia: **Unifamiliar**
3. **Resultado esperado:** Briefing Unifamiliar (235 perguntas)

### **TESTE 3: Comercial**
1. **Repetir processo**
2. **Seleção:**
   - Disciplina: **Arquitetura**
   - Área: **Comercial**
   - Tipologia: **Escritórios**
3. **Resultado esperado:** Briefing Comercial (específico para escritórios)

### **TESTE 4: Engenharia Estrutural**
1. **Repetir processo**
2. **Seleção:**
   - Disciplina: **Engenharia**
   - Área: **Estrutural**
   - Tipologia: **Adaptativo**
3. **Resultado esperado:** Briefing Estrutural Adaptativo

## 🚨 SINAIS DE PROBLEMA

### **❌ SE AINDA ESTIVER BUGADO:**
- Console mostra: `area: "arquitetura"` (em vez de `"design_interiores"`)
- Sempre retorna Briefing Unifamiliar independente da seleção
- Total de perguntas sempre 235

### **✅ SE ESTIVER CORRIGIDO:**
- Console mostra: `area: "design_interiores"` (ou valor correto)
- Cada seleção retorna briefing específico
- Total de perguntas varia conforme o briefing

## 📊 TABELA DE VALIDAÇÃO

| Teste | Disciplina | Área | Tipologia | Briefing Esperado | Perguntas |
|-------|------------|------|-----------|------------------|-----------|
| 1 | Arquitetura | Design de Interiores | Design de Interiores | Design Interiores | 89 |
| 2 | Arquitetura | Residencial | Unifamiliar | Unifamiliar | 235 |
| 3 | Arquitetura | Comercial | Escritórios | Comercial | ~150 |
| 4 | Engenharia | Estrutural | Adaptativo | Estrutural | ~162 |

## 📝 LOGS PARA VERIFICAR

### **Console do Navegador:**
```
🎯 [CORREÇÃO] Dados extraídos CORRETAMENTE: { ... }
🔄 [ADAPTER V6] Adaptação dinâmica CORRIGIDA: { ... }
🔍 [ADAPTER V6] Seleção dinâmica para: { ... }
🎯 [ADAPTER V6] Mapeamento final: { categoria: "residencial", tipo: "design-interiores" }
✅ [ADAPTER V6] Briefing encontrado: { ... }
```

### **Console do Backend:**
```
POST /api/briefings
Body: { disciplina: "arquitetura", area: "design_interiores", tipologia: "design_interiores" }
```

## 🔧 TROUBLESHOOTING

### **Problema 1: Ainda retorna unifamiliar**
- **Causa:** Cache do navegador
- **Solução:** Ctrl+F5 ou abrir nova aba anônima

### **Problema 2: Erro no console**
- **Causa:** Briefing não encontrado
- **Solução:** Verificar se o arquivo existe em `briefings-aprovados/residencial/`

### **Problema 3: Dados incorretos no console**
- **Causa:** Seleção não está sendo feita corretamente
- **Solução:** Verificar se clicou nas opções corretas

## ✅ CRITÉRIOS DE SUCESSO
- [ ] Teste 1: Design Interiores carrega briefing correto
- [ ] Teste 2: Unifamiliar carrega briefing correto
- [ ] Teste 3: Comercial carrega briefing correto
- [ ] Teste 4: Estrutural carrega briefing correto
- [ ] Console mostra dados corretos em todos os testes
- [ ] Nenhum fallback para unifamiliar quando não deveria

## 🎉 VALIDAÇÃO COMPLETA
Quando todos os testes passarem, o problema está **DEFINITIVAMENTE RESOLVIDO**! 