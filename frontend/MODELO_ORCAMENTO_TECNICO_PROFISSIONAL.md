# 🏗️ MODELO TÉCNICO PROFISSIONAL DE ORÇAMENTO - ArcFlow

## 📋 Visão Geral

Este modelo foi desenvolvido com base em **30+ anos de experiência** no mercado de Arquitetura, Engenharia e Construção (AEC), incorporando as melhores práticas profissionais e padrões técnicos reconhecidos pelo setor.

## 🎯 Objetivos do Modelo

### ✅ **Profissionalismo Técnico**
- Estrutura baseada em normas técnicas (NBR, ABNT)
- Metodologia reconhecida pelos conselhos profissionais (CAU, CREA)
- Compatibilidade com práticas de mercado consolidadas

### ✅ **Transparência Financeira**
- Composição detalhada de custos diretos e indiretos
- Metodologia clara de formação de preços
- Rastreabilidade de todos os componentes do orçamento

### ✅ **Gestão de Riscos**
- Identificação de premissas, restrições e riscos
- Contingências técnicas adequadas
- Garantias e seguros profissionais

### ✅ **Cronograma Realista**
- Fases bem definidas com entregas específicas
- Marcos de pagamento vinculados a entregas
- Dependências técnicas mapeadas

## 🏛️ Estrutura do Modelo

### 1. **IDENTIFICAÇÃO DO PROJETO**
```typescript
interface DadosProjeto {
  codigo: string;                    // Código único do projeto
  titulo: string;                    // Nome/descrição do projeto
  cliente: ClienteCompleto;          // Dados completos do contratante
  localizacao: LocalizacaoDetalhada; // Endereço e características do terreno
  dadosTecnicos: DadosTecnicos;      // Área, tipologia, padrão construtivo
}
```

**Características Técnicas Fundamentais:**
- **Tipologia**: 13 tipos (residencial, comercial, industrial, institucional, etc.)
- **Padrão Construtivo**: 5 níveis (simples, médio, alto, luxo, premium)
- **Sistema Construtivo**: 8 opções (convencional, steel frame, wood frame, etc.)
- **Classificação de Uso**: Conforme legislação urbana

### 2. **ESCOPO TÉCNICO DETALHADO**

#### 📐 **Projetos Básicos (Obrigatórios)**
- **Arquitetônico**: Todas as fases do projeto
- **Estrutural**: Dimensionamento e detalhamento
- **Instalações**: Hidrossanitárias, elétricas, gás GLP

#### 🎨 **Projetos Complementares (Opcionais)**
- **Paisagismo**: Projeto paisagístico completo
- **Interiores**: Design de interiores
- **Luminotécnico**: Projeto de iluminação
- **Automação**: Sistemas inteligentes
- **Sustentabilidade**: Certificações ambientais
- **Acessibilidade**: Conformidade NBR 9050
- **Segurança**: Prevenção contra incêndio

#### 🔬 **Consultoria Especializada**
- **Estrutural**: Análise e dimensionamento
- **Instalações**: Cálculos e especificações
- **Sustentabilidade**: Certificações verdes
- **Aprovações**: Acompanhamento em órgãos
- **Acompanhamento de Obra**: Supervisão técnica

### 3. **COMPOSIÇÃO DETALHADA DE CUSTOS**

#### 💰 **Custos Diretos**
```typescript
interface CustosDirectos {
  horasTecnicas: {
    arquiteto: { horas: number; valorHora: number; total: number };
    engenheiro: { horas: number; valorHora: number; total: number };
    desenhista: { horas: number; valorHora: number; total: number };
    // ... outros profissionais
  };
  deslocamentos: DeslocamentosTecnicos;
  materiaisInsumos: MateriaisInsumos;
  terceirizados: ServicosTerceirizados;
}
```

**Componentes dos Custos Diretos:**
- **Horas Técnicas**: Arquiteto, engenheiro, desenhista, estagiário, consultor
- **Deslocamentos**: Visitas técnicas, reuniões, aprovações
- **Materiais/Insumos**: Plotagem, impressões, maquetes, software
- **Terceirizados**: Topografia, sondagem, consultores, aprovações

#### 🏢 **Custos Indiretos**
```typescript
interface CustosIndiretos {
  estruturaEscritorio: { percentual: 25% };  // Rateio da estrutura
  impostos: ImpostosCompletos;               // Todos os tributos
  seguros: SegurosObrigatorios;              // RC, E&O
  contingencia: { percentual: 10% };         // Reserva técnica
}
```

**Impostos Incluídos:**
- **ISSQN**: 5% (varia por município)
- **PIS**: 0,65%
- **COFINS**: 3%
- **IRPJ**: 4,8%
- **CSLL**: 2,88%

#### 📈 **Margem e Lucro**
- **Base de Cálculo**: Custos totais (diretos + indiretos)
- **Percentual Padrão**: 20% (ajustável conforme mercado)
- **Justificativa**: Remuneração do capital e risco empresarial

### 4. **CRONOGRAMA FÍSICO-FINANCEIRO**

#### 📅 **Fases Típicas de Projeto**
1. **Levantamento e Estudos** (15% - 21 dias)
2. **Anteprojeto** (25% - 28 dias)
3. **Projeto Básico** (30% - 42 dias)
4. **Projeto Executivo** (25% - 56 dias)
5. **Acompanhamento de Obra** (5% - 180 dias)

#### 💳 **Marcos de Pagamento**
```typescript
interface MarcoPagamento {
  id: string;
  descricao: string;
  percentual: number;
  valor: number;
  condicoes: string[];           // Condições para liberação
  prazoVencimento: number;       // Dias após entrega
}
```

### 5. **CONDIÇÕES CONTRATUAIS**

#### 💰 **Condições de Pagamento**
- **Moeda**: Real brasileiro (BRL)
- **Forma**: Transferência, boleto, PIX
- **Reajuste**: INCC, IGPM ou IPCA
- **Multas**: Atraso (1%/mês) e inadimplência (2%)

#### ⚖️ **Garantias e Seguros**
- **Seguro RC**: R$ 500.000 (5 anos de vigência)
- **Garantia de Serviços**: 60 meses
- **Caução Técnica**: 5% do valor total

#### 📋 **Responsabilidades**
- **Contratante**: Documentação, acesso, aprovações, pagamentos
- **Contratado**: Projetos conformes, prazos, sigilo, seguros
- **Compartilhadas**: Comunicação, segurança, meio ambiente

## 📊 Parâmetros Técnicos de Referência

### 💵 **Valores por m² (Base 2024)**

| Tipologia | Simples | Médio | Alto | Luxo | Premium |
|-----------|---------|-------|------|------|---------|
| **Residencial Unifamiliar** | R$ 45-65 | R$ 65-95 | R$ 95-140 | R$ 140-200 | R$ 200-350 |
| **Comercial Escritório** | R$ 35-55 | R$ 55-85 | R$ 85-125 | R$ 125-180 | R$ 180-280 |

### 🔢 **Multiplicadores de Complexidade**
- **Terreno Irregular**: +15%
- **Terreno em Aclive**: +20%
- **Terreno em Declive**: +25%
- **Patrimônio Histórico**: +40%
- **Normas Especiais**: +30%
- **Aprovação Múltipla**: +25%
- **Prazo Reduzido**: +35%

### 📈 **Percentuais Padrão**
- **Estrutura de Escritório**: 25%
- **Impostos Totais**: 16,5%
- **Contingência**: 10%
- **Margem de Lucro**: 20%
- **Seguro RC**: 2%

## 🎯 Exemplo Prático

### 🏠 **Casa Residencial - Padrão Médio - 180m²**

**Resumo Financeiro:**
- **Custos Diretos**: R$ 92.400,00
- **Custos Indiretos**: R$ 57.361,65
- **Margem de Lucro**: R$ 29.952,33
- **Valor Total**: R$ 179.713,98
- **Valor por m²**: R$ 998,41

**Cronograma:**
- **Prazo Total**: 327 dias (≈ 11 meses)
- **5 Fases** bem definidas
- **Pagamento Escalonado**: 15% + 25% + 30% + 25% + 5%

## 🔍 Controle de Qualidade

### ✅ **Revisão Técnica**
- Revisão por profissional sênior
- Aprovação por responsável técnico
- Verificação de conformidade com normas

### 📋 **Documentação Completa**
- Plantas e memoriais técnicos
- Especificações detalhadas
- Planilhas orçamentárias
- Cronogramas físico-financeiros

### 🛡️ **Gestão de Riscos**
- Identificação de premissas
- Mapeamento de restrições
- Análise de riscos técnicos
- Plano de contingências

## 🚀 Benefícios do Modelo

### 👨‍💼 **Para o Profissional**
- ✅ Credibilidade técnica
- ✅ Transparência nos custos
- ✅ Proteção jurídica
- ✅ Padronização de processos
- ✅ Otimização de tempo

### 👥 **Para o Cliente**
- ✅ Clareza no escopo
- ✅ Previsibilidade de custos
- ✅ Cronograma realista
- ✅ Garantias adequadas
- ✅ Qualidade assegurada

### 🏢 **Para o Mercado**
- ✅ Profissionalização do setor
- ✅ Padronização de práticas
- ✅ Transparência comercial
- ✅ Competitividade saudável
- ✅ Sustentabilidade do negócio

## 📚 Referências Técnicas

### 📖 **Normas Aplicáveis**
- **NBR 13531**: Elaboração de projetos de edificações
- **NBR 13532**: Elaboração de projetos de edificações - Arquitetura
- **NBR 5626**: Instalação predial de água fria
- **NBR 5410**: Instalações elétricas de baixa tensão
- **NBR 9050**: Acessibilidade a edificações
- **NBR 15575**: Edificações habitacionais - Desempenho

### 🏛️ **Órgãos Reguladores**
- **CAU** - Conselho de Arquitetura e Urbanismo
- **CREA** - Conselho Regional de Engenharia e Agronomia
- **ABNT** - Associação Brasileira de Normas Técnicas
- **CBIC** - Câmara Brasileira da Indústria da Construção

---

## 💡 Conclusão

Este modelo representa o **estado da arte** em orçamentação técnica profissional, combinando:

- **Rigor Técnico** baseado em normas e práticas consolidadas
- **Transparência Financeira** com composição detalhada de custos
- **Gestão Profissional** com cronogramas e marcos bem definidos
- **Proteção Jurídica** através de garantias e seguros adequados
- **Escalabilidade** para diferentes tipos e portes de projeto

**O resultado é um orçamento que transmite confiança, profissionalismo e credibilidade técnica, elevando o padrão do mercado AEC brasileiro.** 