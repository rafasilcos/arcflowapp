# 📧 CONFIGURAÇÃO DE EMAIL - GUIA PASSO A PASSO

## 🎯 **VAMOS CONFIGURAR SEU EMAIL JUNTOS!**

Este guia vai te ajudar a configurar o sistema de email do ArcFlow em 5 minutos.

---

## 📋 **PASSO 1: ESCOLHER SEU PROVEDOR**

### **OPÇÃO A: Gmail (Mais Fácil - Recomendado)**
- ✅ **Vantagens:** Gratuito, confiável, fácil configuração
- ⚠️ **Requisitos:** Conta Gmail + Senha de App
- 🎯 **Ideal para:** Testes e pequenos escritórios

### **OPÇÃO B: Outlook/Hotmail**
- ✅ **Vantagens:** Integração com Microsoft, profissional
- ⚠️ **Requisitos:** Conta Microsoft
- 🎯 **Ideal para:** Escritórios que usam Microsoft

### **OPÇÃO C: Email Profissional**
- ✅ **Vantagens:** Seu próprio domínio (@seuescritorio.com)
- ⚠️ **Requisitos:** Hosting com email
- 🎯 **Ideal para:** Escritórios estabelecidos

**👆 Qual você quer configurar?**

---

## 🚀 **PASSO 2A: CONFIGURAR GMAIL (RECOMENDADO)**

### **2A.1. Ativar Verificação em Duas Etapas**
1. Acesse: [myaccount.google.com](https://myaccount.google.com)
2. Clique em **"Segurança"** (lado esquerdo)
3. Procure **"Verificação em duas etapas"**
4. Clique em **"Começar"** e siga os passos
5. ✅ **Confirme:** Verificação ativa

### **2A.2. Gerar Senha de App**
1. Na mesma página de Segurança
2. Procure **"Senhas de app"** (pode estar em "Verificação em duas etapas")
3. Clique em **"Senhas de app"**
4. Selecione **"Email"** ou **"Outro"**
5. Digite: **"ArcFlow"**
6. Clique **"Gerar"**
7. 📋 **Copie a senha gerada** (16 caracteres, ex: `abcd efgh ijkl mnop`)

### **2A.3. Testar Configuração Gmail**
```bash
# Abra o PowerShell/Terminal como Administrador
# Configure as variáveis (substitua pelos seus dados):

set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USER=seu-email@gmail.com
set SMTP_PASS=abcd efgh ijkl mnop

# Exemplo real:
# set SMTP_USER=contato@meuescritorio.com
# set SMTP_PASS=abcd efgh ijkl mnop
```

---

## 🚀 **PASSO 2B: CONFIGURAR OUTLOOK**

### **2B.1. Configuração Simples**
```bash
# Configure as variáveis:
set SMTP_HOST=smtp.office365.com
set SMTP_PORT=587
set SMTP_USER=seu-email@outlook.com
set SMTP_PASS=sua-senha-normal

# Ou para Hotmail:
set SMTP_USER=seu-email@hotmail.com
```

---

## 🚀 **PASSO 2C: EMAIL PROFISSIONAL**

### **2C.1. Descobrir Configurações**
Consulte seu provedor de hosting para obter:
- **SMTP Host:** (ex: `smtp.seudominio.com`)
- **SMTP Port:** (geralmente `587` ou `465`)
- **Email:** `noreply@seuescritorio.com`
- **Senha:** Senha do email

### **2C.2. Configurar**
```bash
set SMTP_HOST=smtp.seudominio.com
set SMTP_PORT=587
set SMTP_USER=noreply@seuescritorio.com
set SMTP_PASS=sua-senha
```

---

## ✅ **PASSO 3: APLICAR CONFIGURAÇÃO**

### **3.1. Configurar Variáveis**
```bash
# No PowerShell/Terminal (substitua pelos seus dados):
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USER=SEU-EMAIL-AQUI
set SMTP_PASS=SUA-SENHA-AQUI
```

### **3.2. Verificar Configuração**
```bash
# Verificar se as variáveis foram definidas:
echo %SMTP_USER%
echo %SMTP_HOST%

# Deve mostrar seus dados, não estar vazio
```

### **3.3. Reiniciar Backend**
```bash
# Navegue para a pasta backend:
cd backend

# Inicie o servidor:
node server-simple.js

# Procure por esta mensagem:
# 📧 Sistema de email configurado ✅
```

---

## 🧪 **PASSO 4: TESTAR SISTEMA**

### **4.1. Iniciar Frontend**
```bash
# Em outro terminal:
cd frontend
npm run dev
```

### **4.2. Testar Convite**
1. Acesse: `http://localhost:3000/configuracoes/equipe`
2. Clique em **"Convidar Colaborador"**
3. Preencha com **SEU EMAIL REAL** para testar
4. Envie o convite
5. ✅ **Verifique:** Mensagem deve dizer "Email foi enviado"

### **4.3. Verificar Email**
1. 📧 **Abra seu email** (mesmo que você enviou)
2. 📂 **Verifique spam** se não aparecer na caixa principal
3. 🎨 **Veja o email** com design do ArcFlow
4. 🔗 **Clique no botão** "Aceitar Convite"

---

## 🔧 **TROUBLESHOOTING**

### **❌ Problema: "Sistema de email não configurado"**
**Solução:**
```bash
# Verificar variáveis:
echo %SMTP_USER%
echo %SMTP_PASS%

# Se estiver vazio, configure novamente:
set SMTP_USER=seu-email@gmail.com
set SMTP_PASS=sua-senha-de-app

# Reinicie o backend:
cd backend && node server-simple.js
```

### **❌ Problema: "Erro ao enviar email"**
**Possíveis causas:**
1. **Senha de app incorreta** (Gmail)
2. **Email/senha errados**
3. **Verificação em duas etapas não ativa** (Gmail)
4. **Firewall/antivírus bloqueando**

**Solução:**
```bash
# Teste com dados corretos:
set SMTP_USER=email-correto@gmail.com
set SMTP_PASS=senha-de-app-correta

# Reinicie e teste novamente
```

### **❌ Problema: "Email vai para spam"**
**Soluções:**
1. **Use email profissional** em vez de Gmail pessoal
2. **Configure SPF/DKIM** no seu domínio
3. **Teste com diferentes provedores**

---

## 📊 **CONFIGURAÇÕES TESTADAS**

### **✅ Gmail (Funciona 100%)**
```bash
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USER=seu-email@gmail.com
set SMTP_PASS=senha-de-app-16-caracteres
```

### **✅ Outlook (Funciona 100%)**
```bash
set SMTP_HOST=smtp.office365.com
set SMTP_PORT=587
set SMTP_USER=seu-email@outlook.com
set SMTP_PASS=sua-senha-normal
```

### **✅ Locaweb (Exemplo Brasil)**
```bash
set SMTP_HOST=smtp.locaweb.com.br
set SMTP_PORT=587
set SMTP_USER=contato@seudominio.com.br
set SMTP_PASS=sua-senha
```

---

## 🎯 **CONFIGURAÇÃO RECOMENDADA PARA PRODUÇÃO**

```bash
# Para escritório profissional:
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USER=noreply@seuescritorio.com
set SMTP_PASS=senha-de-app-gmail

# Ou email profissional:
set SMTP_HOST=smtp.seuescritorio.com
set SMTP_PORT=587
set SMTP_USER=noreply@seuescritorio.com
set SMTP_PASS=senha-do-email
```

---

## 🚀 **COMANDOS RÁPIDOS**

### **Configurar Gmail Rapidamente:**
```bash
# Substitua pelos seus dados:
set SMTP_HOST=smtp.gmail.com && set SMTP_PORT=587 && set SMTP_USER=SEU-EMAIL@gmail.com && set SMTP_PASS=SUA-SENHA-DE-APP

# Iniciar sistema:
cd backend && node server-simple.js
```

### **Testar Sistema:**
```bash
# Terminal 1:
cd backend && node server-simple.js

# Terminal 2:
cd frontend && npm run dev

# Navegador:
start http://localhost:3000/configuracoes/equipe
```

---

## 🎉 **RESULTADO ESPERADO**

Após a configuração, você terá:

- ✅ **Emails automáticos** para todos os convites
- 🎨 **Template profissional** com logo ArcFlow
- 📧 **Entrega confiável** na caixa de entrada
- 🔗 **Fallback com link** se email falhar
- 📊 **Logs detalhados** para monitoramento

---

## 📞 **PRECISA DE AJUDA?**

**Se algo não funcionar:**

1. 📋 **Copie a mensagem de erro** do console
2. 🔍 **Verifique as variáveis** com `echo %SMTP_USER%`
3. 📧 **Teste com Gmail primeiro** (mais fácil)
4. 🔄 **Reinicie o backend** após mudanças

**🎯 Vamos fazer funcionar juntos!** 