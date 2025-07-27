# 🧪 GUIA COMPLETO DE TESTES - ARCFLOW

## 📋 **PASSO A PASSO PARA TESTAR TUDO**

### **ETAPA 1: INICIAR SERVIÇOS**

**1.1. Iniciar Backend:**
```bash
# Abrir Terminal 1
cd backend
node server-simple.js

# Deve aparecer:
# 🚀 ArcFlow Server rodando na porta 3001
# 📍 Health: http://localhost:3001/health
# 🔐 Auth: http://localhost:3001/api/auth/login
# 👥 Convites: http://localhost:3001/api/convites
# 👤 Usuários: http://localhost:3001/api/users
```

**1.2. Iniciar Frontend:**
```bash
# Abrir Terminal 2
cd frontend
npm run dev

# Deve aparecer:
# ▲ Next.js ready on http://localhost:3000
```

---

### **ETAPA 2: TESTAR FLUXO PRINCIPAL**

#### **2.1. Landing Page → Onboarding**
- 🌐 **URL:** `http://localhost:3000`
- ✅ **Teste:** Navegação e design
- 🔗 **Próximo:** Clicar em "Começar" ou similar

#### **2.2. Onboarding Completo**
- 🌐 **URL:** `http://localhost:3000/onboarding/v4/identificacao`
- ✅ **Teste:** Preencher dados do escritório
- 📝 **Dados de exemplo:**
  ```
  Nome: ArcFlow Teste
  Email: contato@arcflowtest.com
  CNPJ: 12.345.678/0001-90
  Telefone: (11) 99999-9999
  ```

#### **2.3. Registro de Conta**
- 🌐 **URL:** `http://localhost:3000/auth/registro`
- ✅ **Teste:** Criar conta real
- 📝 **Dados de exemplo:**
  ```
  Nome: Rafael Silva
  Email: rafael@teste.com
  Senha: 123456
  ```

#### **2.4. Login**
- 🌐 **URL:** `http://localhost:3000/auth/login`
- ✅ **Teste:** Fazer login com conta criada
- 📝 **Credenciais:**
  ```
  Email: rafael@teste.com
  Senha: 123456
  ```

---

### **ETAPA 3: TESTAR DASHBOARD E CLIENTES**

#### **3.1. Dashboard Principal**
- 🌐 **URL:** `http://localhost:3000/dashboard`
- ✅ **Teste:** Visualizar métricas e widgets
- 🔍 **Verificar:** Dados do escritório aparecendo

#### **3.2. Gestão de Clientes**
- 🌐 **URL:** `http://localhost:3000/comercial/clientes`
- ✅ **Teste:** CRUD completo de clientes
- 📝 **Criar cliente:**
  ```
  Nome: João Silva
  Email: joao@cliente.com
  Telefone: (11) 98888-8888
  Empresa: Construtora ABC
  ```

---

### **ETAPA 4: TESTAR SISTEMA DE CONVITES**

#### **4.1. Gestão de Equipe**
- 🌐 **URL:** `http://localhost:3000/configuracoes/equipe`
- ✅ **Teste:** Visualizar interface de equipe
- 👥 **Verificar:** Seu usuário aparece na lista

#### **4.2. Configurar Email (Opcional)**
- 📧 **Para testar emails reais, configure no terminal:**
  ```bash
  # Para Gmail (recomendado para testes)
  set SMTP_HOST=smtp.gmail.com
  set SMTP_PORT=587
  set SMTP_USER=seu-email@gmail.com
  set SMTP_PASS=sua-senha-de-app
  
  # Reinicie o backend
  cd backend && node server-simple.js
  ```

#### **4.3. Enviar Convite**
- 🔘 **Ação:** Clicar em "Convidar Colaborador"
- ✅ **Teste:** Preencher formulário de convite
- 📝 **Dados de exemplo:**
  ```
  Nome: Maria Santos
  Email: maria@exemplo.com (use um email real para testar)
  Cargo: Arquiteta Senior
  Função: ARCHITECT
  Mensagem: Bem-vinda à nossa equipe!
  ```

#### **4.4. Verificar Convite Enviado**
- ✅ **Teste:** Convite aparece na lista "Convites Enviados"
- 📧 **Verificar:** Se email foi enviado (aparece na mensagem)
- 🔗 **Ação:** Clicar em "Copiar Link" (se email não configurado)
- 📋 **Resultado:** Link copiado para área de transferência

#### **4.5. Aceitar Convite via Email**
- 📧 **Se email configurado:** Verificar caixa de entrada
- 📂 **Verificar spam:** Email pode ir para pasta de spam
- 🔗 **Clicar:** No botão "Aceitar Convite" no email
- ✅ **Resultado:** Redirecionamento para página de aceite

#### **4.6. Aceitar Convite via Link**
- 🌐 **URL:** `http://localhost:3000/convite/[TOKEN_COPIADO]`
- ✅ **Teste:** Abrir link em aba anônima/incógnita
- 📝 **Preencher senha:**
  ```
  Senha: senha123
  Confirmar: senha123
  ```
- ✅ **Resultado:** Conta criada e redirecionamento automático

#### **4.7. Verificar Novo Membro**
- 🔄 **Ação:** Voltar para `/configuracoes/equipe`
- ✅ **Verificar:** Novo membro aparece na lista "Membros da Equipe"
- 👥 **Total:** Agora devem aparecer 2 membros
- 📧 **Status:** Convite deve aparecer como "ACEITO"

---

### **ETAPA 5: TESTAR APIs DIRETAMENTE**

#### **5.1. Teste Automatizado**
```bash
# No terminal (pasta raiz)
node teste-sistema-convites-completo.js
```

#### **5.2. APIs Manuais (Postman/Insomnia)**
**Health Check:**
```http
GET http://localhost:3001/health
```

**Login:**
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "rafael@teste.com",
  "password": "123456"
}
```

**Listar Usuários:**
```http
GET http://localhost:3001/api/users
Authorization: Bearer [SEU_TOKEN_JWT]
```

**Enviar Convite:**
```http
POST http://localhost:3001/api/convites
Authorization: Bearer [SEU_TOKEN_JWT]
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "nome": "Teste Silva",
  "cargo": "Arquiteto",
  "role": "ARCHITECT",
  "mensagemPersonalizada": "Bem-vindo!"
}
```

---

### **ETAPA 6: CHECKLIST DE VERIFICAÇÃO**

#### **✅ Funcionalidades Básicas:**
- [ ] Landing page carrega
- [ ] Onboarding funciona
- [ ] Registro cria conta real
- [ ] Login autentica
- [ ] Dashboard mostra dados
- [ ] CRUD de clientes funciona

#### **✅ Sistema de Convites:**
- [ ] Página de equipe carrega
- [ ] Modal de convite abre
- [ ] Convite é enviado
- [ ] Link é gerado
- [ ] Página de aceite funciona
- [ ] Conta é criada automaticamente
- [ ] Novo membro aparece na lista

#### **✅ Segurança:**
- [ ] JWT protege rotas
- [ ] Multi-tenancy isola dados
- [ ] Senhas são validadas
- [ ] Tokens expiram

#### **✅ UX/UI:**
- [ ] Interface responsiva
- [ ] Animações funcionam
- [ ] Loading states aparecem
- [ ] Feedback visual funciona

---

### **ETAPA 7: CENÁRIOS DE ERRO**

#### **7.1. Convite Inválido**
- 🌐 **URL:** `http://localhost:3000/convite/token-inexistente`
- ✅ **Esperado:** Mensagem de erro elegante

#### **7.2. Email Duplicado**
- ✅ **Teste:** Tentar convidar email que já existe
- ✅ **Esperado:** Erro "Email já possui conta"

#### **7.3. Convite Expirado**
- ✅ **Teste:** Usar convite antigo (>7 dias)
- ✅ **Esperado:** Mensagem de expiração

---

### **ETAPA 8: URLS IMPORTANTES**

#### **🌐 Frontend:**
```
Landing Page:           http://localhost:3000
Onboarding V4:          http://localhost:3000/onboarding/v4/identificacao
Registro:               http://localhost:3000/auth/registro
Login:                  http://localhost:3000/auth/login
Dashboard:              http://localhost:3000/dashboard
Clientes:               http://localhost:3000/comercial/clientes
Gestão de Equipe:       http://localhost:3000/configuracoes/equipe
Aceitar Convite:        http://localhost:3000/convite/[token]
```

#### **🔗 Backend APIs:**
```
Health:                 http://localhost:3001/health
Login:                  http://localhost:3001/api/auth/login
Registro:               http://localhost:3001/api/auth/register
Usuários:               http://localhost:3001/api/users
Convites:               http://localhost:3001/api/convites
Verificar Convite:      http://localhost:3001/api/convites/[token]
Aceitar Convite:        http://localhost:3001/api/convites/[token]/aceitar
```

---

### **🎯 RESULTADO ESPERADO**

Após todos os testes, você deve ter:

1. ✅ **Escritório criado** no banco de dados
2. ✅ **Usuário OWNER** funcionando
3. ✅ **Clientes cadastrados** e isolados por escritório
4. ✅ **Convites enviados** e aceitos
5. ✅ **Novos membros** na equipe
6. ✅ **Multi-tenancy** funcionando
7. ✅ **JWT** protegendo rotas
8. ✅ **Interface moderna** e responsiva

### **🚀 COMANDOS RÁPIDOS**

```bash
# Iniciar tudo de uma vez (use 2 terminais)
# Terminal 1:
cd backend && node server-simple.js

# Terminal 2:
cd frontend && npm run dev

# Teste automatizado:
node teste-sistema-convites-completo.js
```

### **📞 SUPORTE**

Se algo não funcionar:
1. Verificar se ambos os serviços estão rodando
2. Verificar console do navegador (F12)
3. Verificar logs do backend
4. Testar APIs diretamente
5. Verificar banco de dados (Supabase)

**🎉 AGORA É SÓ TESTAR E APROVEITAR O ARCFLOW 100% FUNCIONAL!** 