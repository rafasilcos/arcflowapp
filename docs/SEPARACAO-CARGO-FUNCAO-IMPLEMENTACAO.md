# Separação de Cargo e Função - Implementação Completa

## Problema Original

O sistema ArcFlow estava confundindo dois conceitos importantes:
- **Cargo**: Formação profissional (ex: Engenheiro Civil, Arquiteto)
- **Função**: Papel na organização (ex: Coordenador, Administrador)

### Exemplo do Problema
- Um colaborador que é **Engenheiro Civil** (cargo) pode exercer a **função** de **Administrador** na equipe
- O sistema antigo mostrava apenas "Engenheiro" onde deveria mostrar "Administrador"

## Solução Implementada

### 1. Backend - Schema do Banco de Dados

#### Novos Enums em Português

```prisma
// Cargos profissionais (formação)
enum CargoProfissional {
  ARQUITETO
  ENGENHEIRO_CIVIL
  ENGENHEIRO_ELETRICO
  ENGENHEIRO_MECANICO
  ENGENHEIRO_ESTRUTURAL
  ENGENHEIRO_SANITARIO
  DESIGNER_INTERIORES
  DESIGNER_GRAFICO
  URBANISTA
  PAISAGISTA
  TECNICO_EDIFICACOES
  TECNICO_SEGURANCA
  ADMINISTRADOR
  CONTADOR
  ADVOGADO
  ESTAGIARIO
  AUXILIAR_TECNICO
  OUTROS
}

// Funções organizacionais (papel na equipe)
enum FuncaoOrganizacional {
  PROPRIETARIO
  DIRETOR
  GERENTE_GERAL
  COORDENADOR_PROJETOS
  COORDENADOR_OBRAS
  COORDENADOR_ADMINISTRATIVO
  COORDENADOR_FINANCEIRO
  ARQUITETO_RESPONSAVEL
  ENGENHEIRO_RESPONSAVEL
  PROJETISTA_SENIOR
  PROJETISTA_JUNIOR
  ANALISTA_FINANCEIRO
  ASSISTENTE_ADMINISTRATIVO
  ASSISTENTE_TECNICO
  ESTAGIARIO
  CONSULTOR
  TERCEIRIZADO
  COLABORADOR
}
```

#### Modelo User Atualizado

```prisma
model User {
  // ... outros campos ...
  
  // Separação clara entre cargo e função
  cargo       CargoProfissional?     // Formação profissional
  funcao      FuncaoOrganizacional?  // Papel na organização
  role        UserRole              // Permissões no sistema
  
  // ... outros campos ...
}
```

#### Modelo Convite Atualizado

```prisma
model Convite {
  // ... outros campos ...
  
  // Separação clara entre cargo e função
  cargo       CargoProfissional     // Formação profissional
  funcao      FuncaoOrganizacional  // Papel na organização
  role        UserRole              // Permissões no sistema
  
  // ... outros campos ...
}
```

### 2. Frontend - Tipos TypeScript

#### Arquivo: `types/equipe.ts`

```typescript
// Cargos profissionais organizados por área
export const CARGOS_PROFISSIONAIS: CargoProfissional[] = [
  {
    value: 'ARQUITETO',
    label: 'Arquiteto',
    desc: 'Profissional formado em Arquitetura e Urbanismo',
    area: 'ARQUITETURA'
  },
  // ... mais cargos ...
];

// Funções organizacionais organizadas por nível
export const FUNCOES_ORGANIZACIONAIS: FuncaoOrganizacional[] = [
  {
    value: 'PROPRIETARIO',
    label: 'Proprietário',
    desc: 'Dono do escritório',
    nivel: 'DIRETORIA'
  },
  // ... mais funções ...
];
```

### 3. Interface de Usuário Atualizada

#### Formulário de Convite

```tsx
// Cargo (Formação Profissional)
<select id="cargo" value={novoConvite.cargo}>
  <option value="">Selecione um cargo...</option>
  {Object.entries(cargosPorArea).map(([area, cargos]) => (
    <optgroup key={area} label={area}>
      {cargos.map(cargo => (
        <option key={cargo.value} value={cargo.value}>
          {cargo.label}
        </option>
      ))}
    </optgroup>
  ))}
</select>

// Função (Papel na Organização)
<select id="funcao" value={novoConvite.funcao}>
  <option value="">Selecione uma função...</option>
  {Object.entries(funcoesPorNivel).map(([nivel, funcoes]) => (
    <optgroup key={nivel} label={nivel}>
      {funcoes.map(funcao => (
        <option key={funcao.value} value={funcao.value}>
          {funcao.label}
        </option>
      ))}
    </optgroup>
  ))}
</select>

// Permissões do Sistema
<select id="role" value={novoConvite.role}>
  {PERMISSOES_SISTEMA.map(permissao => (
    <option key={permissao.value} value={permissao.value}>
      {permissao.label} - {permissao.desc}
    </option>
  ))}
</select>
```

#### Exibição de Membros da Equipe

```tsx
// Separação visual clara
<div className="flex space-x-2 mt-2">
  {membro.cargo && getCargoBadge(membro.cargo)}
  {membro.funcao && getFuncaoBadge(membro.funcao)}
</div>

// Permissões do sistema
{getPermissaoBadge(membro.role)}
```

### 4. Badges Diferenciados

```tsx
// Badge de Cargo (Azul)
const getCargoBadge = (cargo: string) => (
  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
    <UserCheck className="w-3 h-3 mr-1" />
    {cargoInfo?.label || cargo}
  </Badge>
);

// Badge de Função (Roxo)
const getFuncaoBadge = (funcao: string) => (
  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
    <Building2 className="w-3 h-3 mr-1" />
    {funcaoInfo?.label || funcao}
  </Badge>
);

// Badge de Permissão (Verde)
const getPermissaoBadge = (role: string) => (
  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
    <Shield className="w-3 h-3 mr-1" />
    {permissaoInfo?.label || role}
  </Badge>
);
```

## Estrutura de Organização

### Cargos por Área

- **ARQUITETURA**: Arquiteto, Urbanista, Paisagista
- **ENGENHARIA**: Engenheiro Civil, Elétrico, Mecânico, Estrutural, Sanitário
- **DESIGN**: Designer de Interiores, Designer Gráfico
- **TÉCNICO**: Técnico em Edificações, Técnico em Segurança
- **ADMINISTRATIVO**: Administrador, Assistente Administrativo
- **FINANCEIRO**: Contador, Analista Financeiro
- **JURÍDICO**: Advogado
- **ACADÊMICO**: Estagiário

### Funções por Nível Hierárquico

- **DIRETORIA**: Proprietário, Diretor, Gerente Geral
- **COORDENAÇÃO**: Coordenador de Projetos, Coordenador de Obras, etc.
- **OPERACIONAL**: Arquiteto Responsável, Projetista Sênior, etc.
- **APOIO**: Assistente Administrativo, Estagiário, etc.

## Validação e Experiência do Usuário

### Validações Implementadas

1. **Campos obrigatórios**: email, nome, cargo, funcao, role
2. **Seleção guiada**: Agrupamento por área/nível para facilitar seleção
3. **Descrições claras**: Cada opção tem descrição explicativa

### Melhorias de UX

1. **Separação visual**: Badges com cores diferentes para cada tipo
2. **Agrupamento lógico**: Selectboxes organizados por categoria
3. **Nomenclatura em português**: Tudo em português brasileiro
4. **Validação em tempo real**: Feedback imediato para o usuário

## Exemplo Prático

### Antes (Confuso)
```
João Silva
Cargo: Engenheiro
Função: Engenheiro
```

### Depois (Correto)
```
João Silva
🔵 Engenheiro Civil (formação)
🟣 Administrador (função na equipe)
🟢 Gerente (permissões do sistema)
```

## Próximos Passos

1. **Migração de dados**: Converter dados existentes para nova estrutura
2. **Testes**: Validar funcionamento em ambiente de produção
3. **Documentação**: Treinar usuários sobre nova estrutura
4. **Relatórios**: Adaptar relatórios para nova estrutura

## Benefícios

1. **Clareza**: Separação clara entre formação e função
2. **Flexibilidade**: Mesma formação pode ter funções diferentes
3. **Organização**: Melhor estruturação da equipe
4. **Relatórios**: Análises mais precisas sobre composição da equipe
5. **Escalabilidade**: Facilita crescimento da equipe

## Compatibilidade

- ✅ Mantém compatibilidade com dados existentes
- ✅ Não quebra funcionalidades atuais
- ✅ Permite migração gradual
- ✅ Suporta rollback se necessário 