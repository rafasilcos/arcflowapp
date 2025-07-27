-- Migração de Índices de Performance
-- Tarefa 13: Implementar otimizações de performance

-- Índices para tabela briefings
CREATE INDEX IF NOT EXISTS idx_briefings_escritorio_status 
ON briefings(escritorio_id, status);

CREATE INDEX IF NOT EXISTS idx_briefings_tipologia_area 
ON briefings(tipologia, area_construida) 
WHERE area_construida IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_briefings_created_at 
ON briefings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_briefings_orcamento_gerado 
ON briefings(orcamento_gerado, status) 
WHERE orcamento_gerado = true;

CREATE INDEX IF NOT EXISTS idx_briefings_ultima_analise 
ON briefings(ultima_analise DESC) 
WHERE ultima_analise IS NOT NULL;

-- Índice composto para consultas frequentes de briefings
CREATE INDEX IF NOT EXISTS idx_briefings_composite 
ON briefings(escritorio_id, status, tipologia, created_at DESC);

-- Índices para tabela orcamentos
CREATE INDEX IF NOT EXISTS idx_orcamentos_briefing_id 
ON orcamentos(briefing_id);

CREATE INDEX IF NOT EXISTS idx_orcamentos_escritorio_status 
ON orcamentos(escritorio_id, status);

CREATE INDEX IF NOT EXISTS idx_orcamentos_valor_total 
ON orcamentos(valor_total DESC) 
WHERE valor_total > 0;

CREATE INDEX IF NOT EXISTS idx_orcamentos_created_at 
ON orcamentos(created_at DESC);

-- Índice para busca por tipologia e área
CREATE INDEX IF NOT EXISTS idx_orcamentos_tipologia_area 
ON orcamentos(tipologia, area_construida) 
WHERE area_construida IS NOT NULL;

-- Índices para tabela users
CREATE INDEX IF NOT EXISTS idx_users_escritorio_ativo 
ON users(escritorio_id, ativo) 
WHERE ativo = true;

CREATE INDEX IF NOT EXISTS idx_users_email_ativo 
ON users(email, ativo) 
WHERE ativo = true;

CREATE INDEX IF NOT EXISTS idx_users_cargo 
ON users(cargo) 
WHERE cargo IS NOT NULL;

-- Índices para tabela escritorios
CREATE INDEX IF NOT EXISTS idx_escritorios_email 
ON escritorios(email);

CREATE INDEX IF NOT EXISTS idx_escritorios_ativo 
ON escritorios(ativo) 
WHERE ativo = true;

-- Índices para configuracoes_orcamento
CREATE INDEX IF NOT EXISTS idx_configuracoes_escritorio_ativo 
ON configuracoes_orcamento(escritorio_id, ativo) 
WHERE ativo = true;

CREATE INDEX IF NOT EXISTS idx_configuracoes_updated_at 
ON configuracoes_orcamento(updated_at DESC);

-- Índices para historico_orcamentos
CREATE INDEX IF NOT EXISTS idx_historico_orcamento_id 
ON historico_orcamentos(orcamento_id);

CREATE INDEX IF NOT EXISTS idx_historico_briefing_id 
ON historico_orcamentos(briefing_id);

CREATE INDEX IF NOT EXISTS idx_historico_versao 
ON historico_orcamentos(orcamento_id, versao DESC);

CREATE INDEX IF NOT EXISTS idx_historico_created_at 
ON historico_orcamentos(created_at DESC);

-- Índices para dados JSONB (se aplicável)
-- Índice GIN para busca em campos JSON de briefings
CREATE INDEX IF NOT EXISTS idx_briefings_respostas_gin 
ON briefings USING GIN (respostas) 
WHERE respostas IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_briefings_dados_extraidos_gin 
ON briefings USING GIN (dados_extraidos) 
WHERE dados_extraidos IS NOT NULL;

-- Índices específicos para campos JSON frequentemente consultados
CREATE INDEX IF NOT EXISTS idx_briefings_area_construida_json 
ON briefings((respostas->>'area_construida')::numeric) 
WHERE respostas->>'area_construida' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_briefings_numero_pavimentos_json 
ON briefings((respostas->>'numero_pavimentos')::integer) 
WHERE respostas->>'numero_pavimentos' IS NOT NULL;

-- Índices para configurações JSON
CREATE INDEX IF NOT EXISTS idx_configuracoes_tabela_precos_gin 
ON configuracoes_orcamento USING GIN (tabela_precos);

CREATE INDEX IF NOT EXISTS idx_configuracoes_multiplicadores_gin 
ON configuracoes_orcamento USING GIN (multiplicadores_tipologia);

-- Índices para otimizar consultas de relatórios
CREATE INDEX IF NOT EXISTS idx_orcamentos_relatorio_mensal 
ON orcamentos(escritorio_id, EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at));

CREATE INDEX IF NOT EXISTS idx_briefings_relatorio_mensal 
ON briefings(escritorio_id, EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at));

-- Índices para otimizar consultas de dashboard
CREATE INDEX IF NOT EXISTS idx_briefings_dashboard 
ON briefings(escritorio_id, status, created_at DESC) 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

CREATE INDEX IF NOT EXISTS idx_orcamentos_dashboard 
ON orcamentos(escritorio_id, status, created_at DESC) 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

-- Índices para otimizar busca de briefings similares
CREATE INDEX IF NOT EXISTS idx_briefings_similaridade 
ON briefings(tipologia, area_construida, padrao) 
WHERE status = 'CONCLUIDO' AND orcamento_gerado = true;

-- Índices para otimizar consultas de auditoria
CREATE INDEX IF NOT EXISTS idx_briefings_auditoria 
ON briefings(created_by, updated_by, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orcamentos_auditoria 
ON orcamentos(created_by, updated_by, created_at DESC);

-- Estatísticas para otimização do query planner
ANALYZE briefings;
ANALYZE orcamentos;
ANALYZE users;
ANALYZE escritorios;
ANALYZE configuracoes_orcamento;
ANALYZE historico_orcamentos;

-- Comentários para documentação
COMMENT ON INDEX idx_briefings_escritorio_status IS 'Otimiza consultas de briefings por escritório e status';
COMMENT ON INDEX idx_briefings_composite IS 'Índice composto para consultas frequentes do dashboard';
COMMENT ON INDEX idx_orcamentos_briefing_id IS 'Otimiza join entre briefings e orçamentos';
COMMENT ON INDEX idx_briefings_respostas_gin IS 'Otimiza busca em campos JSON de respostas';
COMMENT ON INDEX idx_briefings_similaridade IS 'Otimiza busca de briefings similares para sugestões';

-- Verificar tamanho dos índices criados
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;