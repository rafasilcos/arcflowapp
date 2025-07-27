# 🔍 ANÁLISE COMPLETA: CAMPOS DO FORMULÁRIO vs TABELA CLIENTES

## 📋 CAMPOS NO FORMULÁRIO DE CADASTRO/EDIÇÃO

### 1. **Dados Básicos**
- ✅ `nome` (obrigatório)
- ✅ `email` (obrigatório) 
- ✅ `telefone` (obrigatório)
- ❌ `profissao` (campo extra no formulário)
- ❌ `tipoPessoa` ('fisica' | 'juridica' - campo extra)
- ✅ `cpf` (condicional - pessoa física)
- ✅ `cnpj` (condicional - pessoa jurídica)
- ❌ `dataNascimento` (pessoa física - campo extra)
- ❌ `dataFundacao` (pessoa jurídica - campo extra)

### 2. **Endereço Completo**
- ✅ `endereco.cep`
- ✅ `endereco.logradouro` 
- ✅ `endereco.numero`
- ❌ `endereco.complemento` (campo extra)
- ✅ `endereco.bairro`
- ✅ `endereco.cidade`
- ✅ `endereco.uf`
- ❌ `endereco.pais` (campo extra - padrão 'Brasil')

### 3. **Família** (campos extras complexos)
- ❌ `familia.conjuge`
- ❌ `familia.filhos[]` (array de objetos)
- ❌ `familia.pets[]` (array de objetos)

### 4. **Origem/Comercial** (campos extras complexos)
- ❌ `origem.fonte` ('site' | 'indicacao' | 'telefone' | 'evento')
- ❌ `origem.dataContato`
- ❌ `origem.responsavelComercial`
- ❌ `origem.conversasAnteriores[]`

### 5. **Preferências** (campos extras complexos)
- ❌ `preferencias.estilosArquitetonicos[]`
- ❌ `preferencias.materiaisPreferidos[]`
- ❌ `preferencias.coresPreferidas[]`
- ❌ `preferencias.orcamentoMedioHistorico`
- ❌ `preferencias.prazoTipicoPreferido`

### 6. **Status e Controle**
- ✅ `status` ('ativo' | 'inativo' | 'vip' | 'problema')
- ❌ `historicoProjetos[]` (array de projetos anteriores)
- ❌ `observacoes` (campo extra usado no backend)

## 🗄️ CAMPOS NA TABELA CLIENTES (ESTIMADOS)

Baseado no código do backend, a tabela tem:

1. ✅ `id` (UUID)
2. ✅ `nome` (VARCHAR)
3. ✅ `email` (VARCHAR)
4. ✅ `telefone` (VARCHAR)
5. ✅ `cpf_cnpj` (VARCHAR - campo unificado)
6. ✅ `endereco` (VARCHAR - apenas logradouro)
7. ✅ `cidade` (VARCHAR)
8. ✅ `estado` (VARCHAR)
9. ❓ `cep` (provavelmente existe)
10. ✅ `observacoes` (TEXT)
11. ✅ `escritorio_id` (UUID - FK)
12. ✅ `is_active` (BOOLEAN)
13. ✅ `created_at` (TIMESTAMP)
14. ✅ `updated_at` (TIMESTAMP)

## ❌ PROBLEMAS IDENTIFICADOS

### 1. **Campos do Formulário SEM correspondência na tabela:**
- `profissao`
- `tipoPessoa` 
- `dataNascimento`
- `dataFundacao`
- `endereco.numero`
- `endereco.complemento`
- `endereco.bairro`
- `endereco.pais`
- `familia.*` (todos os campos)
- `origem.*` (todos os campos)
- `preferencias.*` (todos os campos)
- `historicoProjetos`
- `status` (pode não existir na tabela)

### 2. **Mapeamento Corrigido:**
- ✅ Formulário: `cpf` + `cnpj` (separados)
- ✅ Tabela: `cpf` + `cnpj` (separados) - CORRIGIDO!

### 3. **Estrutura de Endereço:**
- Formulário: Objeto complexo com 7+ campos
- Tabela: Campos separados básicos (endereco, cidade, estado)

## 🔧 SOLUÇÕES NECESSÁRIAS

### Opção 1: **Simplificar o Formulário** (Recomendado)
Remover campos desnecessários e manter apenas:
- Dados básicos: nome, email, telefone, cpf/cnpj
- Endereço simples: logradouro, cidade, estado, cep
- Status e observações

### Opção 2: **Expandir a Tabela**
Adicionar colunas para todos os campos do formulário:
```sql
ALTER TABLE clientes ADD COLUMN profissao VARCHAR(255);
ALTER TABLE clientes ADD COLUMN tipo_pessoa VARCHAR(20);
ALTER TABLE clientes ADD COLUMN data_nascimento DATE;
ALTER TABLE clientes ADD COLUMN data_fundacao DATE;
ALTER TABLE clientes ADD COLUMN endereco_numero VARCHAR(20);
ALTER TABLE clientes ADD COLUMN endereco_complemento VARCHAR(255);
ALTER TABLE clientes ADD COLUMN endereco_bairro VARCHAR(255);
ALTER TABLE clientes ADD COLUMN endereco_cep VARCHAR(20);
ALTER TABLE clientes ADD COLUMN endereco_pais VARCHAR(100);
ALTER TABLE clientes ADD COLUMN familia JSONB;
ALTER TABLE clientes ADD COLUMN origem JSONB;
ALTER TABLE clientes ADD COLUMN preferencias JSONB;
ALTER TABLE clientes ADD COLUMN historico_projetos JSONB;
ALTER TABLE clientes ADD COLUMN status VARCHAR(20);
```

### Opção 3: **Criar Tabelas Relacionadas**
- `clientes` (dados básicos)
- `clientes_endereco` (endereço completo)  
- `clientes_familia` (dados familiares)
- `clientes_preferencias` (preferências)
- `clientes_origem` (dados comerciais)

## 🎯 RECOMENDAÇÃO

**Implementar Opção 2** - Expandir a tabela com colunas JSONB para dados complexos:

1. ✅ Manter compatibilidade com formulário atual
2. ✅ Flexibilidade para dados complexos (JSON)
3. ✅ Performance adequada para o volume esperado
4. ✅ Facilita consultas básicas
5. ✅ Permite evolução futura

Isso resolverá definitivamente o problema de persistência dos dados! 🎉 