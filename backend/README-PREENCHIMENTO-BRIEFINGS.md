# Sistema de Preenchimento Automático de Briefings

## 📋 Visão Geral

Este sistema foi desenvolvido para criar briefings de teste com dados realistas, permitindo testar a funcionalidade de geração automática de orçamentos no ArcFlow. O sistema preenche automaticamente briefings de diferentes categorias com respostas coerentes e realistas.

## 🎯 Objetivo

- **Testar geração de orçamentos**: Criar briefings que possam ser usados para testar o sistema de orçamentos
- **Dados realistas**: Usar informações coerentes e representativas do mercado brasileiro
- **Cobertura completa**: Abranger todas as categorias de briefings disponíveis
- **Automação**: Reduzir trabalho manual na criação de dados de teste

## 🏗️ Arquitetura do Sistema

### Componentes Principais

1. **Mapeamento de Briefings** (`mapeamento-briefings-orcamento.js`)
   - Mapeia categorias e tipos de briefings disponíveis
   - Define palavras-chave para extração de dados
   - Relaciona perguntas dos briefings com dados necessários para orçamento

2. **Dados Realistas** (`dados-realistas-briefings.js`)
   - Templates de respostas por categoria
   - Variações automáticas de dados
   - Validação de dados essenciais

3. **Script Principal** (`script-preenchimento-briefings.js`)
   - Execução do preenchimento automático
   - Conexão com banco de dados
   - Criação de briefings no formato correto

4. **Verificação** (`verificar-briefings-teste.js`)
   - Validação dos briefings criados
   - Teste de geração de orçamentos
   - Relatórios de qualidade

## 📊 Categorias Suportadas

### Comercial
- **Escritórios**: Consultórios, corporativo, coworking
- **Lojas**: Varejo, atacado, boutiques
- **Restaurantes**: Food service, bares, cafeterias
- **Hotéis**: Pousadas, hospedagem

### Residencial
- **Unifamiliar**: Casas térreas, sobrados
- **Multifamiliar**: Prédios, condomínios
- **Paisagismo**: Jardins, áreas externas
- **Design de Interiores**: Ambientação

### Industrial
- **Galpões**: Armazenagem, produção, logística

### Urbanístico
- **Projetos Urbanos**: Loteamentos, bairros

### Estrutural
- **Projetos Adaptativos**: Sistemas estruturais

### Instalações
- **Sistemas Completos**: Elétrica, hidráulica, HVAC

## 🚀 Como Usar

### Pré-requisitos

1. **Node.js** instalado (versão 14+)
2. **PostgreSQL** rodando com banco ArcFlow
3. **Dependências** instaladas:
   ```bash
   npm install pg axios
   ```

### Configuração

1. **Variáveis de Ambiente** (opcional):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=arcflow
   export DB_USER=postgres
   export DB_PASSWORD=sua_senha
   ```

2. **Verificar Conexão**:
   ```bash
   # Testar conexão com banco
   node -e "const {Client} = require('pg'); const client = new Client({host:'localhost',database:'arcflow',user:'postgres',password:'postgres'}); client.connect().then(() => console.log('✅ Conectado')).catch(e => console.log('❌', e.message))"
   ```

### Execução

#### 1. Preenchimento Automático
```bash
# Executar preenchimento completo
node script-preenchimento-briefings.js

# Exemplo de saída:
🚀 INICIANDO PREENCHIMENTO AUTOMÁTICO DE BRIEFINGS
✅ Conectado ao banco de dados PostgreSQL
📋 Escritório encontrado: ArcFlow Admin (uuid)
👤 Usuário encontrado: Admin (admin@arcflow.com.br)
👥 Cliente existente: Cliente Teste

📂 Processando categoria: COMERCIAL
  ✅ Briefing criado: Escritório Corporativo Tech (ID: uuid)
  ✅ Briefing criado: Boutique de Moda Feminina (ID: uuid)

📊 ESTATÍSTICAS FINAIS
✅ Briefings criados com sucesso: 12
❌ Briefings que falharam: 0
🎯 Taxa de sucesso: 100%
```

#### 2. Verificação dos Briefings
```bash
# Verificar briefings criados
node verificar-briefings-teste.js

# Exemplo de saída:
🔍 INICIANDO VERIFICAÇÃO DE BRIEFINGS DE TESTE
📋 Encontrados 12 briefings de teste

📋 Verificando: Escritório Corporativo Tech (ID: uuid)
  ✅ Estrutura válida
  ✅ Dados essenciais presentes
  ✅ Orçamento simulado: R$ 875.000

📊 RELATÓRIO DE VERIFICAÇÃO
✅ Briefings com estrutura válida: 12
💰 Orçamentos gerados com sucesso: 12
🎯 TAXA DE SUCESSO GERAL: 100%
```

#### 3. Limpeza (Opcional)
```bash
# Remover briefings de teste
node script-preenchimento-briefings.js --limpar
```

## 📋 Estrutura de Dados

### Briefing Criado
```json
{
  "id": "uuid",
  "nome_projeto": "Escritório Corporativo Tech",
  "tipo": "comercial",
  "subtipo": "escritorios",
  "padrao": "alto",
  "status": "CONCLUÍDO",
  "respostas": {
    "area_total": 350,
    "funcionarios": 25,
    "padrao_acabamento": "Alto",
    "estado": "SP",
    "cidade": "São Paulo",
    "tipologia": "comercial",
    "complexidade_calculada": "media"
  },
  "metadados": {
    "origem": "preenchimento_automatico",
    "template_usado": "Escritório Médio - Corporativo",
    "dados_para_orcamento": {
      "area_total": 350,
      "tipologia": "comercial",
      "padrao": "Alto",
      "complexidade": "media"
    }
  }
}
```

### Dados Essenciais para Orçamento
- **Área Total**: Metragem construída em m²
- **Tipologia**: Categoria principal (comercial, residencial, etc.)
- **Subtipologia**: Subcategoria específica
- **Padrão de Acabamento**: Nível de qualidade (simples, médio, alto, luxo)
- **Localização**: Estado e cidade
- **Complexidade**: Calculada automaticamente (baixa, média, alta)

## 🔧 Personalização

### Adicionar Nova Categoria

1. **Atualizar Mapeamento** (`mapeamento-briefings-orcamento.js`):
```javascript
categorias: {
  nova_categoria: {
    nome: 'Nova Categoria',
    briefings: ['subtipo1', 'subtipo2'],
    status: 'ativo'
  }
}
```

2. **Criar Templates** (`dados-realistas-briefings.js`):
```javascript
templates: {
  'nova_categoria-subtipo1': [
    {
      nome: 'Template Exemplo',
      respostas: {
        area_total: 200,
        padrao_acabamento: 'Médio',
        // ... outros campos
      }
    }
  ]
}
```

### Modificar Dados Realistas

Edite os templates em `dados-realistas-briefings.js`:
- Ajustar faixas de área
- Modificar localizações
- Alterar padrões de acabamento
- Incluir novos requisitos especiais

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```
❌ Erro ao conectar ao banco: connection refused
```
**Solução**: Verificar se PostgreSQL está rodando e credenciais estão corretas.

#### 2. Escritório/Usuário Não Encontrado
```
❌ Escritório admin não encontrado
```
**Solução**: Criar usuário admin no sistema ou ajustar query de busca.

#### 3. Briefings Não Aparecem na Dashboard
**Possíveis causas**:
- Status diferente de "CONCLUÍDO"
- Escritório incorreto
- Dados malformados

**Verificação**:
```sql
SELECT id, nome_projeto, status, escritorio_id 
FROM briefings 
WHERE metadados->>'origem' = 'preenchimento_automatico';
```

#### 4. Orçamento Não Gera
**Verificar**:
- Área total presente e válida
- Tipologia e subtipologia corretas
- Padrão de acabamento definido
- Status = "CONCLUÍDO"

### Logs Detalhados

Para debug, adicione logs extras:
```javascript
console.log('Debug - Respostas:', JSON.stringify(respostas, null, 2));
console.log('Debug - Metadados:', JSON.stringify(metadados, null, 2));
```

## 📈 Monitoramento

### Verificar Briefings Criados
```sql
-- Contar briefings por categoria
SELECT 
  tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'CONCLUÍDO' THEN 1 END) as concluidos
FROM briefings 
WHERE metadados->>'origem' = 'preenchimento_automatico'
GROUP BY tipo;
```

### Verificar Dados Essenciais
```sql
-- Briefings com área definida
SELECT COUNT(*) 
FROM briefings 
WHERE metadados->>'origem' = 'preenchimento_automatico'
  AND (respostas->>'area_total' IS NOT NULL 
       OR respostas->>'area_construida' IS NOT NULL);
```

## 🔄 Manutenção

### Atualização de Templates
1. Editar `dados-realistas-briefings.js`
2. Executar limpeza: `node script-preenchimento-briefings.js --limpar`
3. Executar preenchimento: `node script-preenchimento-briefings.js`
4. Verificar: `node verificar-briefings-teste.js`

### Backup de Briefings de Teste
```sql
-- Exportar briefings de teste
COPY (
  SELECT * FROM briefings 
  WHERE metadados->>'origem' = 'preenchimento_automatico'
) TO '/tmp/briefings_teste.csv' WITH CSV HEADER;
```

## 🎯 Próximos Passos

1. **Integração com API**: Testar geração real de orçamentos via API
2. **Mais Categorias**: Adicionar briefings institucionais
3. **Variações Regionais**: Dados específicos por região do Brasil
4. **Automação CI/CD**: Executar testes automaticamente
5. **Dashboard de Monitoramento**: Interface para acompanhar qualidade dos dados

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs de execução
2. Consultar seção de troubleshooting
3. Executar verificação de briefings
4. Revisar configuração do banco de dados

---

**Versão**: 1.0  
**Última Atualização**: Dezembro 2024  
**Compatibilidade**: ArcFlow v2.0+