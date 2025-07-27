 # 🛡️ REGRAS ANTI-REGRESSÃO - ARCFLOW

## ⚠️ REGRA OURO: NUNCA QUEBRAR O QUE JÁ FUNCIONA

**Se uma página/funcionalidade está funcionando, ela DEVE continuar funcionando PARA SEMPRE!**

## 📋 CHECKLIST OBRIGATÓRIO ANTES DE QUALQUER MUDANÇA

### ✅ ANTES DE EDITAR QUALQUER ARQUIVO:

1. **IDENTIFIQUE DEPENDÊNCIAS**
   - Que páginas usam este arquivo?
   - Que componentes dependem dele?
   - Que APIs são afetadas?

2. **TESTE PÁGINAS EXISTENTES**
   - Login: http://localhost:3000/auth/login
   - Clientes: http://localhost:3000/comercial/clientes
   - Dashboard: http://localhost:3000/dashboard
   - Outras páginas funcionais

3. **BACKUP PREVENTIVO**
   - Sempre fazer backup de arquivos críticos
   - Manter versões funcionais salvas

### 🚨 ARQUIVOS CRÍTICOS - CUIDADO EXTREMO:

#### Backend:
- `server.ts` - NUNCA quebrar rotas funcionais
- `auth-working.ts` - Sistema de login funcionando
- `clientes-working.ts` - CRUD de clientes funcionando
- `database-simple.ts` - Conexão com banco

#### Frontend:
- `layout.tsx` - Layout principal
- `ClientesContext.tsx` - Context funcionando
- Páginas de login, clientes, dashboard

### 🔒 PROTOCOLO DE MUDANÇAS SEGURAS:

#### 1. MUDANÇAS EM ARQUIVOS COMPARTILHADOS:
```bash
# SEMPRE testar estas URLs após mudanças:
- http://localhost:3000/auth/login
- http://localhost:3000/comercial/clientes  
- http://localhost:3000/dashboard
- http://localhost:3001/api/auth/status
- http://localhost:3001/api/clientes
```

#### 2. MUDANÇAS NO SERVIDOR:
```bash
# Testar APIs críticas:
curl http://localhost:3001/api/auth/status
curl http://localhost:3001/api/clientes
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"rafael@teste.com","password":"123456"}'
```

#### 3. MUDANÇAS NO FRONTEND:
- Testar navegação entre páginas
- Verificar se contextos continuam funcionando
- Confirmar que formulários ainda submetem

## 🚀 ESTRATÉGIAS DE PROTEÇÃO:

### 1. VERSIONAMENTO DE ARQUIVOS CRÍTICOS:
```
server.ts → server-v1-funcionando.ts (backup)
auth-working.ts → auth-working-v1.ts (backup)
clientes-working.ts → clientes-working-v1.ts (backup)
```

### 2. TESTES AUTOMATIZADOS:
- Scripts de teste para cada funcionalidade
- Execução automática antes de commits

### 3. ISOLAMENTO DE MUDANÇAS:
- Criar novos arquivos em vez de modificar existentes
- Usar sufixos: `-new`, `-v2`, `-experimental`

## 🔧 COMANDOS DE VERIFICAÇÃO RÁPIDA:

### Backend:
```bash
cd backend
node test-auth-api.js          # Testa autenticação
node test-clientes-api-final.js # Testa clientes
npm run dev                    # Inicia servidor
```

### Frontend:
```bash
cd frontend  
npm run dev                    # Inicia frontend
```

### URLs de Teste:
```
✅ Login: http://localhost:3000/auth/login
✅ Clientes: http://localhost:3000/comercial/clientes
✅ Dashboard: http://localhost:3000/dashboard
✅ API Status: http://localhost:3001/api/auth/status
```

## 🎯 COMPROMISSO:

**NUNCA MAIS UMA PÁGINA FUNCIONANDO VAI QUEBRAR!**

### Antes de qualquer mudança:
1. ✅ Backup dos arquivos
2. ✅ Teste das páginas funcionais  
3. ✅ Verificação de dependências
4. ✅ Testes de regressão

### Após qualquer mudança:
1. ✅ Teste imediato das páginas principais
2. ✅ Verificação de APIs críticas
3. ✅ Navegação entre páginas
4. ✅ Funcionalidades essenciais

## 💡 REGRA FINAL:

**SE ALGO ESTÁ FUNCIONANDO, DEIXE FUNCIONANDO!**
**CRIE NOVO EM VEZ DE QUEBRAR O EXISTENTE!**