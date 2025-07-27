# Testes de Integração - Sistema Briefing-Orçamento

## Visão Geral

Esta suíte de testes valida a integração completa entre os módulos de briefing e orçamento do ArcFlow, incluindo:

- Geração automática de orçamentos a partir de briefings
- Análise de briefings personalizados
- Sistema de configurações por escritório
- Monitoramento e alertas
- Performance e concorrência

## Estrutura dos Testes

```
tests/integration/
├── README.md                     # Este arquivo
├── setup/
│   ├── globalSetup.js           # Configuração global dos testes
│   ├── globalTeardown.js        # Limpeza após testes
│   └── setupTests.js            # Configuração por teste
├── budget-integration.test.js    # Testes de integração de orçamento
├── custom-briefing.test.js      # Testes de briefings personalizados
├── performance/
│   └── budget-performance.test.js # Testes de performance
├── concurrency.test.js          # Testes de concorrência
├── error-recovery.test.js       # Testes de recuperação de erro
├── end-to-end-complete.test.js  # Testes end-to-end completos
└── run-all-tests.js            # Script para executar todos os testes
```

## Pré-requisitos

1. **Banco de dados de teste**: PostgreSQL com dados de teste
2. **Redis**: Para cache e filas
3. **Variáveis de ambiente**: Configuradas para teste
4. **Dados de seed**: Escritórios, usuários e briefings de exemplo

## Executando os Testes

### Todos os testes
```bash
npm run test:integration
# ou
node tests/integration/run-all-tests.js
```

### Testes específicos
```bash
# Testes de integração básica
npm test -- budget-integration.test.js

# Testes de performance
npm test -- performance/budget-performance.test.js

# Testes de concorrência
npm test -- concurrency.test.js
```

## Cenários de Teste

### 1. Integração Básica
- ✅ Geração de orçamento a partir de briefing padrão
- ✅ Análise automática de dados do briefing
- ✅ Cálculo de valores por disciplina
- ✅ Persistência do orçamento gerado

### 2. Briefings Personalizados
- ✅ Análise de briefing com estrutura customizada
- ✅ Mapeamento de campos não padronizados
- ✅ Inferência de tipologia e complexidade
- ✅ Geração de orçamento adaptativo

### 3. Configurações por Escritório
- ✅ Aplicação de tabela de preços personalizada
- ✅ Multiplicadores por tipologia
- ✅ Configurações padrão para novos escritórios
- ✅ Validação de configurações

### 4. Sistema de Histórico
- ✅ Versionamento de orçamentos
- ✅ Comparação entre versões
- ✅ Auditoria de alterações
- ✅ Limpeza automática de versões antigas

### 5. Monitoramento e Alertas
- ✅ Coleta de métricas de performance
- ✅ Geração de alertas por threshold
- ✅ Relatórios de uso por escritório
- ✅ Dashboard de monitoramento

### 6. Performance e Escalabilidade
- ✅ Processamento de múltiplos orçamentos simultâneos
- ✅ Cache de configurações e resultados
- ✅ Otimização de consultas ao banco
- ✅ Rate limiting e throttling

### 7. Recuperação de Erros
- ✅ Fallback para dados insuficientes
- ✅ Retry automático em falhas temporárias
- ✅ Logging de erros para auditoria
- ✅ Notificação de falhas críticas

## Dados de Teste

### Escritórios
- **Escritório A**: Configuração padrão
- **Escritório B**: Configuração personalizada
- **Escritório C**: Múltiplos usuários

### Briefings
- **Residencial Simples**: Casa unifamiliar básica
- **Comercial Complexo**: Edifício corporativo
- **Industrial**: Galpão industrial
- **Personalizado**: Estrutura não padronizada

### Usuários
- **Admin**: Acesso completo
- **Arquiteto**: Acesso a briefings e orçamentos
- **Estagiário**: Acesso limitado

## Métricas de Sucesso

### Performance
- **Geração de orçamento**: < 5 segundos
- **Análise de briefing**: < 3 segundos
- **Consultas ao banco**: < 500ms
- **Cache hit rate**: > 80%

### Confiabilidade
- **Taxa de sucesso**: > 99%
- **Tempo de recuperação**: < 30 segundos
- **Disponibilidade**: > 99.9%
- **Consistência de dados**: 100%

### Escalabilidade
- **Usuários simultâneos**: 1,000+
- **Orçamentos por hora**: 5,000+
- **Briefings por minuto**: 100+
- **Uso de memória**: < 512MB

## Relatórios de Teste

Os testes geram relatórios detalhados em:
- `tests/reports/integration-report.html`
- `tests/reports/performance-report.json`
- `tests/reports/coverage-report.html`

## Troubleshooting

### Problemas Comuns

1. **Timeout nos testes**
   - Aumentar timeout: `jest.setTimeout(30000)`
   - Verificar conexão com banco/Redis

2. **Falhas de conexão**
   - Verificar variáveis de ambiente
   - Confirmar serviços rodando

3. **Dados inconsistentes**
   - Executar seed do banco de teste
   - Limpar cache do Redis

### Logs de Debug

```bash
# Habilitar logs detalhados
DEBUG=test:* npm run test:integration

# Logs específicos
DEBUG=test:budget npm test -- budget-integration.test.js
```

## Contribuindo

### Adicionando Novos Testes

1. Criar arquivo de teste na pasta apropriada
2. Seguir padrão de nomenclatura: `*.test.js`
3. Incluir setup e teardown necessários
4. Documentar cenários testados
5. Atualizar este README

### Padrões de Código

- **Describe blocks**: Agrupar testes relacionados
- **Test names**: Descritivos e específicos
- **Assertions**: Claras e específicas
- **Cleanup**: Sempre limpar dados de teste
- **Mocks**: Usar quando apropriado

## Automação

### CI/CD Pipeline

```yaml
# .github/workflows/integration-tests.yml
name: Integration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: test
      redis:
        image: redis:6
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run integration tests
        run: npm run test:integration
```

### Execução Agendada

```bash
# Crontab para execução diária
0 2 * * * cd /path/to/project && npm run test:integration:nightly
```

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0
**Responsável**: Equipe de QA ArcFlow