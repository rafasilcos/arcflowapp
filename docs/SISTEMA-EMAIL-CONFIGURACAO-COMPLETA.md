# 📧 SISTEMA DE EMAIL - CONFIGURAÇÃO COMPLETA

## 🚨 **POR QUE NÃO ESTÁ ENVIANDO EMAILS?**

### **ERRO ATUAL**: `Invalid login: 534-5.7.9 Application-specific password required`

**O QUE SIGNIFICA**: O sistema está tentando usar Gmail, mas o Gmail não aceita mais senha normal para aplicações. Precisa de uma **senha específica de aplicativo**.

## 🔧 **OPÇÕES PARA RESOLVER O EMAIL**

### 🆓 **OPÇÃO 1: GMAIL GRATUITO (Recomendado para desenvolvimento)**

#### **1. Configurar Gmail com Senha de Aplicativo**
1. Acesse sua conta Gmail
2. Vá em **Configurações** > **Segurança**
3. Ative **Verificação em 2 etapas**
4. Vá em **Senhas de app**
5. Gere uma senha para "Mail"
6. Use essa senha no sistema

#### **2. Configurar no ArcFlow**
```bash
# Arquivo .env do backend
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu.email@gmail.com
SMTP_PASS=sua-senha-de-aplicativo-gerada
NODE_ENV=production
```

#### **3. Limitações do Gmail**
- ✅ **Gratuito**
- ✅ **Fácil de configurar**
- ❌ **Limite**: 500 emails/dia
- ❌ **Não profissional** (aparece como gmail.com)

### 🚀 **OPÇÃO 2: SENDGRID (Recomendado para produção)**

#### **1. Vantagens**
- ✅ **100 emails/dia GRATUITOS**
- ✅ **Muito confiável**
- ✅ **Usado por grandes empresas**
- ✅ **Relatórios detalhados**

#### **2. Configuração**
```bash
# Arquivo .env do backend
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.sua-api-key-aqui
NODE_ENV=production
```

#### **3. Preços**
- **Gratuito**: 100 emails/dia
- **Pago**: $19.95/mês para 50.000 emails

### 💰 **OPÇÃO 3: MAILGUN**

#### **1. Vantagens**
- ✅ **3 meses gratuitos**
- ✅ **Muito fácil de usar**
- ✅ **Boa documentação**

#### **2. Configuração**
```bash
# Arquivo .env do backend
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua-senha-mailgun
NODE_ENV=production
```

#### **3. Preços**
- **Gratuito**: 3 meses ou 5.000 emails
- **Pago**: $35/mês para 50.000 emails

### 🏢 **OPÇÃO 4: AMAZON SES**

#### **1. Vantagens**
- ✅ **Muito barato**
- ✅ **Integração com AWS**
- ✅ **Altamente escalável**

#### **2. Preços**
- **$0.10** por 1.000 emails
- **Praticamente gratuito** para uso normal

### 🔄 **OPÇÃO 5: OUTLOOK/HOTMAIL**

#### **1. Configuração**
```bash
# Arquivo .env do backend
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=seu.email@outlook.com
SMTP_PASS=sua-senha-normal
NODE_ENV=production
```

#### **2. Vantagens**
- ✅ **Gratuito**
- ✅ **Não precisa senha de aplicativo**
- ✅ **Fácil de usar**

## 🛠️ **COMO IMPLEMENTAR (PASSO A PASSO)**

### **PASSO 1: Escolher Opção**
**Para desenvolvimento**: Gmail ou Outlook
**Para produção**: SendGrid ou Mailgun

### **PASSO 2: Configurar Variáveis**
```bash
# Criar arquivo .env no backend
cd backend
nano .env
```

### **PASSO 3: Adicionar Configurações**
```bash
# Exemplo para SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.sua-api-key-aqui
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

### **PASSO 4: Testar Sistema**
```bash
# Reiniciar backend
cd backend
npm run dev
```

## 🎯 **RECOMENDAÇÃO FINAL**

### **PARA AGORA (DESENVOLVIMENTO)**
**Use OUTLOOK** - É o mais fácil e não precisa configurar nada especial:

```bash
# .env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=seu.email@outlook.com
SMTP_PASS=sua-senha-normal
NODE_ENV=production
```

### **PARA PRODUÇÃO**
**Use SENDGRID** - 100 emails/dia gratuitos, muito confiável:

1. Cadastre-se em https://sendgrid.com
2. Crie uma API Key
3. Configure no .env
4. Pronto!

## 🔧 **CONFIGURAÇÃO IMEDIATA**

### **1. Criar Arquivo .env**
```bash
cd backend
echo "SMTP_HOST=smtp-mail.outlook.com" > .env
echo "SMTP_PORT=587" >> .env
echo "SMTP_USER=seu.email@outlook.com" >> .env
echo "SMTP_PASS=sua-senha" >> .env
echo "NODE_ENV=production" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env
```

### **2. Reiniciar Backend**
```bash
npm run dev
```

### **3. Testar Convite**
- Vá em http://localhost:3000/configuracoes/equipe
- Envie um convite
- Verifique o email!

## 📱 **ALTERNATIVAS SEM EMAIL**

### **OPÇÃO: SISTEMA DE NOTIFICAÇÕES**
Se não quiser configurar email, pode:

1. **Copiar o link** e enviar via WhatsApp/Telegram
2. **Gerar QR Code** para o convite
3. **Sistema de notificações** no próprio sistema
4. **Enviar SMS** em vez de email

## 🚀 **PRÓXIMOS PASSOS**

### **1. AGORA**
- Configure Outlook para testar rapidamente
- Teste o sistema de convites
- Verifique se o colaborador aparece no briefing

### **2. DEPOIS**
- Configure SendGrid para produção
- Personalize templates de email
- Implemente notificações em tempo real

---

## 📞 **SUPORTE**

### **Se precisar de ajuda:**
1. **Gmail**: Siga o tutorial de senha de aplicativo
2. **SendGrid**: Documentação em https://docs.sendgrid.com
3. **Mailgun**: Documentação em https://documentation.mailgun.com
4. **Outlook**: Funciona direto com senha normal

### **Teste rápido:**
```bash
# Testar se o email está funcionando
curl -X POST http://localhost:3001/api/convites -H "Content-Type: application/json" -H "Authorization: Bearer seu-token" -d '{"email":"teste@gmail.com","nome":"Teste","cargo":"Arquiteto","role":"ARCHITECT"}'
```

---

**✨ RAFAEL, ESCOLHA A OPÇÃO QUE PREFERIR E VAMOS CONFIGURAR AGORA!** 