# 🚀 GUIA DE CRIAÇÃO DE BRIEFINGS - ARCFLOW

## 📋 **3 FORMAS DE CRIAR BRIEFINGS**

### **1. 🎯 MÉTODO SUPER RÁPIDO (RECOMENDADO)**

**Use o template simples:**
```bash
# 1. Abra o arquivo
frontend/scripts/template-briefing-simples.js

# 2. Cole suas perguntas no formato:
const PERGUNTAS = [
  {
    pergunta: "Qual é o seu orçamento total?",
    tipo: "moeda",
    opcoes: [],
    obrigatoria: true,
    secao: "VIABILIDADE FINANCEIRA"
  },
  // ... suas outras perguntas
];

# 3. Ajuste os metadados:
const METADADOS = {
  nome: "Casa Unifamiliar - Alto Padrão",
  tipologia: "residencial",
  subtipo: "casa",
  padrao: "alto"
};

# 4. Execute:
node scripts/template-briefing-simples.js
```

---

### **2. 🤖 MÉTODO AUTOMÁTICO**

**Use o gerador inteligente:**
```bash
# 1. Crie um arquivo .txt com suas perguntas:
perguntas-casa-alto.txt

# 2. Execute o gerador:
node scripts/gerador-briefing.js

# 3. Responda as perguntas interativas
# 4. O arquivo .ts será gerado automaticamente
```

---

### **3. ✋ MÉTODO MANUAL**

**Cole aqui suas perguntas e eu crio para você:**

```
FORMATO SIMPLES:
1. Qual é o orçamento total do projeto?
   - Até R$ 200.000
   - R$ 200.000 - R$ 500.000
   - R$ 500.000 - R$ 1.000.000
   - Acima de R$ 1.000.000

2. Descreva o estilo arquitetônico desejado:
   (campo de texto longo)

3. Quantos quartos a casa deve ter?
   (campo numérico)
```

---

## 🎨 **TIPOS DE CAMPO DISPONÍVEIS**

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `text` | Texto simples | Nome, endereço |
| `textarea` | Texto longo | Descrições, observações |
| `select` | Lista suspensa | Opções múltiplas |
| `radio` | Escolha única | Sim/Não |
| `checkbox` | Múltipla escolha | Características |
| `number` | Números | Quantidade, idade |
| `moeda` | Valores em R$ | Orçamento, custos |
| `data` | Datas | Prazos, cronograma |

---

## 📁 **SEÇÕES PADRÃO**

- `DADOS GERAIS DO CLIENTE E FAMÍLIA` 👥
- `VIABILIDADE FINANCEIRA` 💰
- `TERRENO E LOCALIZAÇÃO` 📍
- `PROGRAMA DE NECESSIDADES` 🏠
- `ESTILO E PREFERÊNCIAS` 🎨
- `SUSTENTABILIDADE` 🌱
- `CRONOGRAMA E PRAZOS` ⏰
- `OUTROS REQUISITOS` 📋

---

## 🔗 **CAMPOS CONDICIONAIS**

Para criar campos que aparecem/desaparecem:

```javascript
{
  pergunta: "Especifique as mudanças:",
  tipo: "textarea",
  dependeDe: "PERGUNTA_01", // ID da pergunta anterior
  obrigatoria: false
}
```

**Lógica:** Campo aparece se a resposta anterior não for:
- "Não"
- "Não temos"
- "Nenhuma experiência"
- "Comunicação mínima"

---

## ⚡ **EXEMPLO COMPLETO**

```javascript
const PERGUNTAS = [
  {
    pergunta: "Qual é o orçamento total para o projeto?",
    tipo: "select",
    opcoes: [
      "Até R$ 300.000",
      "R$ 300.000 - R$ 600.000", 
      "R$ 600.000 - R$ 1.000.000",
      "Acima de R$ 1.000.000"
    ],
    obrigatoria: true,
    secao: "VIABILIDADE FINANCEIRA"
  },
  {
    pergunta: "Há alguma restrição orçamentária específica?",
    tipo: "textarea",
    dependeDe: "PERGUNTA_01",
    obrigatoria: false,
    secao: "VIABILIDADE FINANCEIRA"
  },
  {
    pergunta: "Quantos quartos a casa deve ter?",
    tipo: "select",
    opcoes: ["1 quarto", "2 quartos", "3 quartos", "4+ quartos"],
    obrigatoria: true,
    secao: "PROGRAMA DE NECESSIDADES"
  }
];

const METADADOS = {
  nome: "Casa Unifamiliar - Alto Padrão",
  tipologia: "residencial",
  subtipo: "casa", 
  padrao: "alto"
};
```

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Escolha um método** (recomendo o #1)
2. **Cole suas perguntas** no formato indicado
3. **Execute o script**
4. **Teste no sistema** em `/briefing/novo`

**Cole suas perguntas aqui que eu crio tudo para você! 🚀** 