# 🧪 GUIA DE TESTE - BRIEFING ESTRUTURAL 3.0

## 🎯 OBJETIVO
Guia prático para testar o briefing estrutural completo com **200 perguntas** adaptativas recém-implementado.

---

## 📋 CHECKLIST DE TESTE

### **1. TESTE INICIAL - CARREGAMENTO**
- [ ] Acessar `/briefing` no frontend
- [ ] Verificar carregamento do briefing estrutural
- [ ] Confirmar que mostra "Projeto Estrutural Adaptativo - COMPLETO"
- [ ] Verificar tempo de carregamento (deve ser < 2 segundos)

### **2. TESTE SEÇÃO 1 - DADOS GERAIS (81 PERGUNTAS)**
- [ ] Verificar que inicia com 81 perguntas (não mais 15)
- [ ] Testar pergunta 9 (pé-direito subsolo):
  - [ ] Não aparece quando subsolos = 0
  - [ ] Aparece quando subsolos ≥ 1
- [ ] Testar upload de plantas (pergunta 6)
- [ ] Testar upload de sondagem (pergunta 29)
- [ ] Verificar subseções visíveis:
  - [ ] 1.1 Identificação (perguntas 1-7)
  - [ ] 1.2 Características Arquitetônicas (8-22)
  - [ ] 1.3 Características do Terreno (23-32)
  - [ ] 1.4 Cargas e Sobrecargas (33-47)
  - [ ] 1.5 Compatibilização (48-50)
  - [ ] 1.6 Condições Ambientais (51-61)
  - [ ] 1.7 Controle Tecnológico (62-67)
  - [ ] Informações Complementares (68-81)

### **3. TESTE SEÇÃO 2 - SISTEMA ESTRUTURAL (15 PERGUNTAS)**
- [ ] Verificar que tem 15 perguntas (não mais 5)
- [ ] Testar pergunta 82 (escolha do sistema):
  - [ ] Opções corretas: Concreto, Metálica, Madeira, Alvenaria, Mistas, Pré-moldados
- [ ] Verificar subseções:
  - [ ] 2.1 Escolha do Sistema (82-86)
  - [ ] 2.2 Requisitos Gerais (87-96)

### **4. TESTE SEÇÕES CONDICIONAIS (6 SEÇÕES)**
**IMPORTANTE**: Seções devem aparecer APENAS após escolha do sistema estrutural

#### **4.1 Teste Concreto Armado**
- [ ] Selecionar "Concreto armado moldado in loco" na pergunta 82
- [ ] Verificar que aparece seção "🏭 Concreto Armado - Específico"
- [ ] Verificar perguntas 97-106 (10 perguntas)
- [ ] Testar campos específicos (fck, cimento, armadura)

#### **4.2 Teste Estrutura Metálica**
- [ ] Selecionar "Estrutura metálica" na pergunta 82
- [ ] Verificar que aparece seção "⚙️ Estrutura Metálica - Específico"
- [ ] Verificar perguntas 107-116 (10 perguntas)
- [ ] Testar campos específicos (aço, perfis, ligações)

#### **4.3 Teste Madeira**
- [ ] Selecionar "Madeira" na pergunta 82
- [ ] Verificar que aparece seção "🌳 Madeira - Específico"
- [ ] Verificar perguntas 117-126 (10 perguntas)

#### **4.4 Teste Alvenaria Estrutural**
- [ ] Selecionar "Alvenaria estrutural" na pergunta 82
- [ ] Verificar que aparece seção "🧱 Alvenaria Estrutural - Específico"
- [ ] Verificar perguntas 127-136 (10 perguntas)

#### **4.5 Teste Estruturas Mistas**
- [ ] Selecionar "Estruturas mistas (aço-concreto)" na pergunta 82
- [ ] Verificar que aparece seção "🏗️ Estruturas Mistas - Específico"
- [ ] Verificar perguntas 137-145 (9 perguntas)

#### **4.6 Teste Pré-moldados**
- [ ] Selecionar "Pré-moldados de concreto" na pergunta 82
- [ ] Verificar que aparece seção "🏭 Pré-moldados - Específico"
- [ ] Verificar perguntas 146-156 (11 perguntas)

### **5. TESTE SEÇÃO 4 - REQUISITOS ESPECIAIS (32 PERGUNTAS)**
- [ ] Verificar que seção aparece automaticamente
- [ ] Verificar nome: "🌟 Requisitos Especiais"
- [ ] Verificar perguntas 157-188 (32 perguntas)
- [ ] Testar subseções:
  - [ ] 4.1 Sustentabilidade (157-164)
  - [ ] 4.2 Cronograma e Orçamento (165-172)
  - [ ] 4.3 Execução e Manutenção (173-180)
  - [ ] 4.4 Informações Complementares (181-188)

### **6. TESTE SEÇÃO 5 - FINALIZAÇÃO (12 PERGUNTAS)**
- [ ] Verificar perguntas 189-200 (12 perguntas)
- [ ] Testar campos obrigatórios:
  - [ ] Nome do responsável (189)
  - [ ] CPF/CNPJ (190)
  - [ ] Telefone (192)
  - [ ] E-mail (193)
  - [ ] Data (194)
  - [ ] Assinatura digital (195)
  - [ ] Declaração (196)

---

## 🔍 CENÁRIOS DE TESTE ESPECÍFICOS

### **Cenário 1: Residência Simples**
```
1. Nome: "Casa Família Silva"
2. Localização: "Rua das Flores, 123 - São Paulo, SP"
4. Tipo: "Residencial unifamiliar"
5. Finalidade: "Projeto novo"
8. Subsolos: 0
10. Térreo: "Sim"
11. Pavimentos superiores: 1
82. Sistema: "Concreto armado moldado in loco"
```
**Resultado Esperado**: ~120 perguntas totais

### **Cenário 2: Edifício Comercial**
```
1. Nome: "Edifício Comercial Central"
2. Localização: "Av. Paulista, 1000 - São Paulo, SP"
4. Tipo: "Comercial"
5. Finalidade: "Projeto novo"
8. Subsolos: 2
10. Térreo: "Sim"
11. Pavimentos superiores: 15
82. Sistema: "Estrutura metálica"
```
**Resultado Esperado**: ~130 perguntas totais

### **Cenário 3: Casa de Madeira**
```
1. Nome: "Casa Ecológica"
2. Localização: "Zona Rural - Campos do Jordão, SP"
4. Tipo: "Residencial unifamiliar"
5. Finalidade: "Projeto novo"
8. Subsolos: 0
10. Térreo: "Sim"
11. Pavimentos superiores: 1
82. Sistema: "Madeira"
```
**Resultado Esperado**: ~125 perguntas totais

---

## 🐛 PROBLEMAS POTENCIAIS A OBSERVAR

### **Lógica Condicional**
- [ ] Pergunta 9 (subsolo) aparece com 0 subsolos
- [ ] Seções condicionais aparecem antes da escolha do sistema
- [ ] Dependências não funcionam corretamente

### **Performance**
- [ ] Carregamento lento (> 3 segundos)
- [ ] Travamento ao navegar entre seções
- [ ] Problemas de scroll

### **UX/UI**
- [ ] Campos não responsivos
- [ ] Placeholders faltando
- [ ] Ícones não carregando
- [ ] Textos cortados

### **Validação**
- [ ] Campos obrigatórios não validados
- [ ] Formatos de dados incorretos
- [ ] Uploads não funcionando

---

## 📊 MÉTRICAS A MEDIR

### **Quantitativas**
- [ ] **Total de perguntas**: Deve ser 200
- [ ] **Tempo de carregamento**: < 2 segundos
- [ ] **Tempo de preenchimento**: 35-50 minutos
- [ ] **Seções visíveis**: 5 fixas + 1 condicional

### **Qualitativas**
- [ ] **Fluidez**: Navegação suave entre seções
- [ ] **Clareza**: Perguntas bem formuladas
- [ ] **Completude**: Todas as informações necessárias
- [ ] **Profissionalismo**: Interface de qualidade

---

## 🚨 TESTE CRÍTICO - SEGURANÇA

### **Subseção 1.4 - Cargas e Sobrecargas**
- [ ] Pergunta 36 (sobrecargas especiais) funciona
- [ ] Pergunta 40 (cargas dinâmicas) funciona
- [ ] Pergunta 42 (velocidade do vento) obrigatória
- [ ] Todas as dependências funcionam

### **Subseção 1.6 - Condições Ambientais**
- [ ] Pergunta 51 (classe de agressividade) obrigatória
- [ ] Pergunta 55 (análise sísmica) com dependências
- [ ] Perguntas 56-59 aparecem quando necessário

---

## 📱 TESTE RESPONSIVIDADE

### **Desktop**
- [ ] Funcionamento em Chrome
- [ ] Funcionamento em Firefox
- [ ] Funcionamento em Safari
- [ ] Funcionamento em Edge

### **Mobile**
- [ ] Funcionamento em Android
- [ ] Funcionamento em iOS
- [ ] Campos acessíveis
- [ ] Navegação intuitiva

### **Tablet**
- [ ] Layout adequado
- [ ] Campos proporcionais
- [ ] Usabilidade mantida

---

## 💾 TESTE DADOS

### **Salvamento**
- [ ] Auto-save funciona
- [ ] Dados persistem na navegação
- [ ] Recuperação após refresh
- [ ] Backup automático

### **Validação**
- [ ] Campos obrigatórios destacados
- [ ] Validação em tempo real
- [ ] Mensagens de erro claras
- [ ] Prevenção de perda de dados

---

## 🎯 RESULTADO ESPERADO

### **Sucesso Total**
- ✅ **200 perguntas** funcionando
- ✅ **11 seções** visíveis conforme lógica
- ✅ **Dependências** todas funcionais
- ✅ **Performance** otimizada
- ✅ **UX profissional** mantida

### **Próximos Passos Após Teste**
1. **Se tudo OK**: Documentar e preparar para produção
2. **Se bugs encontrados**: Corrigir e retestas
3. **Se performance ruim**: Otimizar e retestas
4. **Se UX inadequada**: Ajustar e retestas

---

## 📞 SUPORTE

**Em caso de problemas:**
- 📝 Documente o erro detalhadamente
- 🖼️ Capture screenshots
- 🔍 Anote o cenário exato
- 🚨 Reporte imediatamente

**Informações importantes:**
- 🗂️ Arquivo: `projeto-estrutural-adaptativo.ts`
- 📊 Versão: 3.0 - Completa
- 📅 Data: 19/12/2024
- 🎯 Status: Pronto para teste

---

**🚀 BOM TESTE, RAFAEL!**

O briefing estrutural mais completo do Brasil está pronto para ser testado. Vamos revolucionar o mercado de engenharia estrutural! 🏗️ 