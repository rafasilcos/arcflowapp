# 🚀 PLANO DE IMPLEMENTAÇÃO - SISTEMA DE TEMPLATES DINÂMICOS

> **Projeto**: ArcFlow - Sistema SaaS AEC  
> **Funcionalidade**: Templates Dinâmicos (Detecção automática + Composição de projetos)  
> **Data**: 31 de dezembro de 2024  
> **Status**: ✅ INICIANDO IMPLEMENTAÇÃO

---

## 🎯 OBJETIVO FINAL

Implementar um sistema que:
- **Detecta automaticamente** necessidades do briefing
- **Compõe projetos personalizados** combinando múltiplos templates
- **Funciona como projeto único** com cronograma e dependências automáticas
- **Exemplo prático**: Briefing "casa unifamiliar" → 160 tarefas vs "edifício + complementares" → 491 tarefas

---

## 📊 ANÁLISE DA INFRAESTRUTURA ATUAL

### ✅ JÁ TEMOS:
- **Redis configurado** - CacheService + RealtimeService
- **PostgreSQL + Prisma** - Schema robusto para 10k usuários
- **Express + TypeScript** - Security, rate limiting, CORS
- **Model Template** - Base para templates dinâmicos
- **Relacionamentos** - Projeto → Briefing → Atividade
- **90% dos briefings** implementados (19/21)

### 🎯 PRECISAMOS IMPLEMENTAR:
- **Templates Engine** - detecção e composição automática
- **Projetos Compostos** - múltiplos templates em um projeto
- **Cronograma Automático** - dependências entre templates
- **APIs especializadas** - endpoints para templates dinâmicos

---

## 🏗️ CRONOGRAMA DE IMPLEMENTAÇÃO

### **FASE 1: DATABASE SCHEMA** (Dias 1-2)
- ✅ Estender Prisma Schema
- ✅ Migrations do banco
- ✅ Testes de relacionamentos

### **FASE 2: TEMPLATES ENGINE** (Dias 3-5)
- ⚡ NecessidadesDetector
- ⚡ ProjetoCompositor  
- ⚡ CronogramaGerador

### **FASE 3: APIs REST** (Dias 6-7)
- 🌐 Rotas especializadas
- 💾 Cache com Redis
- 🧪 Testes de API

### **FASE 4: FRONTEND** (Dias 8-10)
- 🎨 Hooks React
- 📱 Componentes UI
- 🔗 Integração completa

---

## 💾 FASE 1 DETALHADA: DATABASE SCHEMA

### Novos Models Prisma:

```prisma
// Projeto Composto - projetos que combinam múltiplos templates
model ProjetoComposto {
  id              String   @id @default(cuid())
  projetoId       String   @unique
  tipoComposicao  String   // 'automatica' | 'manual'
  templateIds     String[] // Array de templates aplicados
  dependencias    Json     // Mapeamento de dependências
  cronograma      Json     // Cronograma gerado automaticamente
  orcamento       Json     // Orçamento consolidado
  configuracao    Json     // Configurações específicas
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  projeto Projeto @relation(fields: [projetoId], references: [id], onDelete: Cascade)
  
  @@index([projetoId])
  @@map("projetos_compostos")
}

// Regras de Detecção de Necessidades
model RegraDeteccao {
  id              String   @id @default(cuid())
  nome            String
  descricao       String?
  condicao        Json     // Condições do briefing para ativar template
  templateId      String   // Template a ser aplicado
  prioridade      Int      @default(1)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  template Template @relation(fields: [templateId], references: [id], onDelete: Cascade)
  
  @@index([templateId])
  @@index([prioridade])
  @@map("regras_deteccao")
}
```

---

## 🎯 RESULTADOS ESPERADOS

### ANTES (Sistema Atual):
- Briefing manual → Projeto simples
- 1 template = 1 projeto
- Cronograma manual

### DEPOIS (Templates Dinâmicos):
- Briefing → Detecção automática → Projeto composto
- Múltiplos templates = 1 projeto unificado
- Cronograma automático com dependências
- 160-491 tarefas organizadas automaticamente

---

## 🚀 PRÓXIMO PASSO

Implementar **FASE 1: DATABASE SCHEMA** - base fundamental para todo o sistema.

**Ready to code, Rafael!** 🔥
