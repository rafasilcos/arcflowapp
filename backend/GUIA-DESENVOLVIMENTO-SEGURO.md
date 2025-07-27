# 🛡️ GUIA DE DESENVOLVIMENTO SEGURO - ARCFLOW

## 🚨 PROBLEMA RESOLVIDO
O script anterior estava matando TODOS os processos Node.js, incluindo o frontend. Agora temos uma solução mais inteligente.

## ✅ COMANDOS SEGUROS PARA USAR

### 🚀 Para iniciar o BACKEND (RECOMENDADO):
```bash
cd backend
npm run dev
```
**Este comando:**
- ✅ Só mata processos na porta 3001 (backend)
- ✅ NÃO afeta o frontend na porta 3000
- ✅ Mais seguro e inteligente

### 🔧 Comandos alternativos:
```bash
# Modo mais agressivo (cuidado!)
npm run dev-unsafe

# Modo simples (sem verificação de porta)
npm run dev-simple

# Modo TypeScript
npm run dev-ts
```

## 🎯 FLUXO RECOMENDADO

### 1. Iniciar Frontend PRIMEIRO:
```bash
cd frontend
npm run dev
```
**Frontend roda em: http://localhost:3000**

### 2. Iniciar Backend DEPOIS:
```bash
cd backend  
npm run dev
```
**Backend roda em: http://localhost:3001**

## 🔍 VERIFICAÇÃO DE STATUS

### URLs para testar:
```
✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:3001
✅ Health: http://localhost:3001/health
✅ Login: http://localhost:3000/auth/login
✅ Clientes: http://localhost:3000/comercial/clientes
```

### Comandos de diagnóstico:
```bash
# Ver processos nas portas
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar processo específico (se necessário)
taskkill /f /pid [PID]
```

## 🚫 O QUE NÃO FAZER

### ❌ Evitar:
- Usar `dev-unsafe` quando frontend estiver rodando
- Matar processos manualmente sem verificar
- Rodar múltiplos backends na mesma porta

### ✅ Fazer:
- Sempre usar `npm run dev` no backend
- Verificar se frontend continua funcionando
- Usar Ctrl+C para parar servidores

## 🔄 SOLUÇÃO DE PROBLEMAS

### Se o backend não iniciar:
1. Verificar se está na pasta `backend`
2. Tentar `npm run dev-simple`
3. Verificar se arquivo `server-simple.js` existe

### Se o frontend parar de funcionar:
1. Ir para pasta `frontend`
2. Executar `npm run dev`
3. Verificar se porta 3000 está livre

### Se ambos estiverem com problema:
1. Fechar todos os terminais
2. Abrir novo terminal para frontend
3. Abrir novo terminal para backend
4. Iniciar na ordem: frontend → backend

## 💡 DICAS DE PRODUTIVIDADE

### Usar 2 terminais:
```
Terminal 1 (Frontend):
cd frontend && npm run dev

Terminal 2 (Backend):  
cd backend && npm run dev
```

### Atalhos úteis:
- `Ctrl+C` - Parar servidor
- `Ctrl+Shift+C` - Novo terminal
- `↑` - Comando anterior

## 🎯 RESUMO

**COMANDO PRINCIPAL:**
```bash
cd backend
npm run dev
```

**Este comando é:**
- 🛡️ Seguro (não mata frontend)
- 🎯 Inteligente (só mata porta 3001)
- 🚀 Rápido (inicialização automática)
- 📊 Informativo (mostra status)

**Agora você pode desenvolver sem medo de quebrar o frontend!** 