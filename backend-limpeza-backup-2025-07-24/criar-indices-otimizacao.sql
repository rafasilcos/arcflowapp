-- ✅ ÍNDICES PARA OTIMIZAÇÃO DE ALTA ESCALA - ARCFLOW
-- Estes índices são CRÍTICOS para suportar 10k usuários simultâneos

-- 1. Índice composto para verificação de CPF duplicado
-- Otimiza: WHERE cpf = $1 AND escritorio_id = $2 AND is_active = true
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_cpf_escritorio_ativo 
ON clientes (cpf, escritorio_id, is_active) 
WHERE cpf IS NOT NULL AND is_active = true;

-- 2. Índice composto para verificação de CNPJ duplicado
-- Otimiza: WHERE cnpj = $1 AND escritorio_id = $2 AND is_active = true
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_cnpj_escritorio_ativo 
ON clientes (cnpj, escritorio_id, is_active) 
WHERE cnpj IS NOT NULL AND is_active = true;

-- 3. Índice para verificação de email duplicado
-- Otimiza: WHERE email = $1 AND escritorio_id = $2 AND is_active = true
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_email_escritorio_ativo 
ON clientes (email, escritorio_id, is_active) 
WHERE email IS NOT NULL AND is_active = true;

-- 4. Índice para listagem de clientes por escritório
-- Otimiza: WHERE escritorio_id = $1 AND is_active = true ORDER BY created_at DESC
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_escritorio_ativo_data 
ON clientes (escritorio_id, is_active, created_at DESC) 
WHERE is_active = true;

-- 5. Índice para busca de clientes por nome
-- Otimiza: WHERE nome ILIKE '%termo%' AND escritorio_id = $1 AND is_active = true
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_nome_trgm 
ON clientes USING gin (nome gin_trgm_ops);

-- 6. Índice para autenticação de usuários
-- Otimiza: WHERE email = $1 AND is_active = true
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usuarios_email_ativo 
ON usuarios (email, is_active) 
WHERE is_active = true;

-- 7. Estatísticas atualizadas para o otimizador de query
ANALYZE clientes;
ANALYZE usuarios;

-- 8. Configurações de performance do PostgreSQL (ajustar conforme servidor)
-- Descomente as linhas abaixo se tiver acesso para configurar PostgreSQL

-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';
-- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
-- ALTER SYSTEM SET wal_buffers = '16MB';
-- ALTER SYSTEM SET default_statistics_target = 100;
-- SELECT pg_reload_conf();

-- 9. Verificar se os índices foram criados com sucesso
SELECT 
    schemaname, 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename IN ('clientes', 'usuarios') 
ORDER BY tablename, indexname;

-- 10. Verificar tamanho dos índices
SELECT 
    schemaname, 
    tablename, 
    indexname, 
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_indexes 
WHERE tablename IN ('clientes', 'usuarios')
ORDER BY pg_relation_size(indexname::regclass) DESC; 