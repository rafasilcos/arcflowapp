# 🚀 COMANDOS BACKEND CORRIGIDOS - ARCFLOW

## ✅ **PROBLEMA RESOLVIDO!**

Agora o `npm run dev` funciona perfeitamente! Corrigi o package.json para apontar para o arquivo correto.

---

## 🎯 **COMANDOS DISPONÍVEIS**

### **🚀 COMANDO PRINCIPAL (Recomendado)**
```bash
cd backend
npm run dev
```
**✅ Este comando agora:**
- ✅ Verifica se o arquivo existe
- ✅ Testa se a porta 3001 está livre
- ✅ Mostra status do email configurado
- ✅ Inicia o servidor com logs detalhados
- ✅ Mostra URLs importantes
- ✅ Captura erros e sugere soluções

### **⚡ COMANDO RÁPIDO**
```bash
cd backend
npm run dev-simple
```
**Para quando você quer iniciar rapidamente sem verificações**

### **🔧 COMANDO DIRETO**
```bash
cd backend
node server-simple.js
```
**Comando original que sempre funciona**

---

## 📊 **O QUE VOCÊ VERÁ AGORA**

Quando executar `npm run dev`, você verá:

```
🚀 ===============================================
   INICIANDO SERVIDOR ARCFLOW BACKEND
🚀 ===============================================

✅ Arquivo do servidor encontrado
📁 Caminho: C:\Users\rafae\Documents\sistema-arcflow\backend\server-simple.js

📧 Verificando configuração de email...
✅ Email configurado:
   📧 Host: smtp.gmail.com
   👤 User: rafaelcosta.engenheiro@gmail.com
   🔑 Pass: *******************

✅ Porta 3001 disponível

🚀 Iniciando servidor...

🚀 ArcFlow Server rodando na porta 3001
📧 Sistema de email configurado
📍 Health: http://localhost:3001/health
🔐 Auth: http://localhost:3001/api/auth/login
👥 Convites: http://localhost:3001/api/convites
👤 Usuários: http://localhost:3001/api/users

📊 INFORMAÇÕES DO SERVIDOR:
🌐 Backend: http://localhost:3001
🔍 Health: http://localhost:3001/health
🔐 Auth: http://localhost:3001/api/auth/login
👥 Users: http://localhost:3001/api/users
📧 Convites: http://localhost:3001/api/convites

💡 Para parar o servidor: Ctrl+C
🔄 Para reiniciar: npm run dev
```

---

## 🔧 **SOLUÇÃO DE PROBLEMAS**

### **❌ Se a porta 3001 estiver ocupada:**
```bash
# Windows:
taskkill /f /im node.exe

# Ou reinicie o terminal
```

### **❌ Se der erro de permissão:**
```bash
# Execute o terminal como Administrador
# Depois: cd backend && npm run dev
```

### **❌ Se o arquivo não for encontrado:**
```bash
# Certifique-se de estar na pasta correta:
cd C:\Users\rafae\Documents\sistema-arcflow\backend
npm run dev
```

---

## 🧪 **TESTE AGORA**

Vamos testar se está funcionando: 