# 🚀 **SISTEMA DE TEMPLATES - ARCFLOW**

## 📋 **COMO CRIAR NOVOS TEMPLATES**

### 🏗️ **ESTRUTURA DE PASTAS**

```
templates/
├── residencial/
│   ├── casa-simples.ts
│   ├── casa-medio.ts
│   ├── casa-alto.ts
│   ├── sobrado-simples.ts
│   └── apartamento.ts
├── comercial/
│   ├── escritorio-simples.ts
│   ├── loja-simples.ts
│   └── restaurante.ts
├── industrial/
│   ├── fabrica-simples.ts
│   └── galpao.ts
├── institucional/
│   ├── escola-simples.ts
│   └── hospital.ts
└── index.ts
```

### 📝 **FORMATO PARA ENTREGAR DADOS**

**VOCÊ DEVE ME ENTREGAR OS DADOS NESTE FORMATO EXATO:**

```
TIPOLOGIA: residencial | comercial | industrial | institucional
SUBTIPO: casa | escritorio | fabrica | escola | etc...
PADRÃO: simples | medio | alto | premium | luxo
NOME_TEMPLATE: Casa Residencial - Padrão Médio
ICONE_PRINCIPAL: 🏠
COR_PRIMARIA: #3B82F6
COR_SECUNDARIA: #EFF6FF
DISCIPLINAS: Arquitetura, Estrutural, Instalações

=== ETAPAS ===

ETAPA_1:
NOME: Levantamento e Análise
STATUS: concluida | em_andamento | nao_iniciada
PROGRESSO: 0-100
COR_TEMA: #10B981
ICONE: 📐

TAREFA_1.1:
NOME: Levantamento topográfico
DESCRICAO: Realizar medições precisas do terreno
RESPONSAVEL: Ana Arquiteta
DISCIPLINA: Arquitetura
TEMPO_ESTIMADO: 8h
PRIORIDADE: alta | media | baixa
DATA_VENCIMENTO: 2024-01-25
TEMPLATE_NOTAS: Levantamento topográfico:\n- Medições realizadas: \n- Características do solo: 
CHECKLIST: Medir dimensões do terreno | Verificar topografia | Analisar orientação solar

TAREFA_1.2:
[... próxima tarefa da etapa 1]

ETAPA_2:
[... próxima etapa]
```

### 🎯 **EXEMPLO PRÁTICO DE ENTREGA**

```
TIPOLOGIA: residencial
SUBTIPO: sobrado
PADRÃO: medio
NOME_TEMPLATE: Sobrado Residencial - Padrão Médio
ICONE_PRINCIPAL: 🏘️
COR_PRIMARIA: #8B5CF6
COR_SECUNDARIA: #F3E8FF
DISCIPLINAS: Arquitetura, Estrutural, Instalações, Paisagismo

=== ETAPAS ===

ETAPA_1:
NOME: Estudos Iniciais
STATUS: nao_iniciada
PROGRESSO: 0
COR_TEMA: #6B7280
ICONE: 📋

TAREFA_1.1:
NOME: Análise do terreno
DESCRICAO: Estudo completo das características do lote
RESPONSAVEL: Ana Arquiteta
DISCIPLINA: Arquitetura
TEMPO_ESTIMADO: 12h
PRIORIDADE: alta
DATA_VENCIMENTO: 2025-01-15
TEMPLATE_NOTAS: Análise do terreno:\n- Dimensões e topografia: \n- Orientação solar: \n- Vizinhança: 
CHECKLIST: Medir terreno | Estudar topografia | Analisar entorno | Verificar legislação

TAREFA_1.2:
NOME: Programa de necessidades
DESCRICAO: Definição detalhada dos ambientes necessários
RESPONSAVEL: Ana Arquiteta
DISCIPLINA: Arquitetura
TEMPO_ESTIMADO: 6h
PRIORIDADE: alta
DATA_VENCIMENTO: 2025-01-18
TEMPLATE_NOTAS: Programa de necessidades:\n- Ambientes solicitados: \n- Áreas mínimas: \n- Relações funcionais: 
CHECKLIST: Listar ambientes | Definir áreas | Estabelecer relações | Validar com cliente
```

### ⚡ **REGRAS IMPORTANTES**

1. **NOMES DE ARQUIVO**: sempre `tipologia-subtipo-padrao.ts`
2. **IDS ÚNICOS**: cada tarefa deve ter ID único no template
3. **DATAS**: formato YYYY-MM-DD
4. **CORES**: sempre hexadecimal (#RRGGBB)
5. **STATUS**: apenas os valores permitidos
6. **TEMPLATE_NOTAS**: use `\n` para quebras de linha

### 🔄 **PROCESSO DE CONVERSÃO**

1. **VOCÊ ENTREGA** os dados no formato acima
2. **EU CONVERTO** para o formato TypeScript
3. **EU CRIO** o arquivo na pasta correta
4. **EU ATUALIZO** o index.ts automaticamente
5. **SISTEMA DETECTA** automaticamente o novo template

### 📊 **STATUS PERMITIDOS**

**ETAPAS:**
- `nao_iniciada` - Cinza
- `em_andamento` - Azul  
- `concluida` - Verde

**TAREFAS:**
- `pendente` - Não iniciada
- `em_andamento` - Em execução
- `pausada` - Pausada temporariamente
- `concluida` - Finalizada
- `em_revisao` - Aguardando revisão
- `aprovada` - Aprovada pelo cliente

### 🎨 **CORES SUGERIDAS POR TIPOLOGIA**

- **RESIDENCIAL**: `#3B82F6` (Azul)
- **COMERCIAL**: `#059669` (Verde)
- **INDUSTRIAL**: `#DC2626` (Vermelho)
- **INSTITUCIONAL**: `#7C3AED` (Roxo)

### 📋 **TEMPLATE VAZIO PARA COPIAR**

```
TIPOLOGIA: 
SUBTIPO: 
PADRÃO: 
NOME_TEMPLATE: 
ICONE_PRINCIPAL: 
COR_PRIMARIA: 
COR_SECUNDARIA: 
DISCIPLINAS: 

=== ETAPAS ===

ETAPA_1:
NOME: 
STATUS: 
PROGRESSO: 
COR_TEMA: 
ICONE: 

TAREFA_1.1:
NOME: 
DESCRICAO: 
RESPONSAVEL: 
DISCIPLINA: 
TEMPO_ESTIMADO: 
PRIORIDADE: 
DATA_VENCIMENTO: 
TEMPLATE_NOTAS: 
CHECKLIST: 
```

---

## 🚀 **PRONTO PARA USAR!**

Agora é só me entregar os dados no formato acima que eu crio o template automaticamente e integro no sistema! 